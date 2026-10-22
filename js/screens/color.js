/* Farbklecks – Ausmalen: frei oder «Malen nach Zahlen / Würfeln / Silben / Farbwörtern». */
(function () {
  'use strict';
  const FK = window.FK;
  const h = FK.h;

  const MODES = {
    frei: { name: 'Frei ausmalen', short: 'Frei' },
    wuerfel: { name: 'Malen nach Würfeln', short: 'Würfel' },
    zahlen: { name: 'Malen nach Zahlen', short: 'Zahlen' },
    silben: { name: 'Malen nach Silben', short: 'Silben' },
    woerter: { name: 'Farbwörter lesen', short: 'Wörter' },
  };
  const MODE_ORDER = ['frei', 'wuerfel', 'zahlen', 'silben', 'woerter'];
  const TOOL_BRUSHES = ['wachs', 'filz', 'glitzer', 'spray', 'neon'];
  const BRUSH_ICON = { wachs: 'crayon', filz: 'marker', glitzer: 'glitter', spray: 'brush', neon: 'brush' };
  const SIZE_INFO = [{ name: 'Klein', dot: 10, r: 5 }, { name: 'Mittel', dot: 18, r: 8 }, { name: 'Gross', dot: 28, r: 12 }, { name: 'Riesig', dot: 42, r: 16 }];
  // a picture is only kept (gallery, stars) when at least this share of the paper is painted
  const MIN_PAINT = 0.003;
  const FALLBACK_ROWS = { M: ['Ma', 'Me', 'Mi', 'Mo', 'Mu'], L: ['La', 'Le', 'Li', 'Lo', 'Lu'], S: ['Sa', 'Se', 'Si', 'So', 'Su'], N: ['Na', 'Ne', 'Ni', 'No', 'Nu'], R: ['Ra', 'Re', 'Ri', 'Ro', 'Ru'], T: ['Ta', 'Te', 'Ti', 'To', 'Tu'], F: ['Fa', 'Fe', 'Fi', 'Fo', 'Fu'] };

  const saved = FK.settings.get('color.tool') || {};
  const T = {
    kind: ['fill', 'brush', 'stamp', 'eraser'].indexOf(saved.kind) >= 0 ? saved.kind : 'fill',
    brush: TOOL_BRUSHES.indexOf(saved.brush) >= 0 ? saved.brush : 'wachs',
    colorId: saved.colorId || 'rot',
    pattern: saved.pattern || 'voll',
    size: [0, 1, 2, 3].indexOf(saved.size) >= 0 ? saved.size : 2,
    emoji: saved.emoji || '🐱',
    stickerTab: saved.stickerTab | 0,
  };
  function persistTool() { FK.settings.set('color.tool', T); }

  let root = null;
  let eng = null;
  let pencils = null;
  let page = null;
  let mode = 'frei';
  let spots = [];
  let completed = false;
  let restoring = false;
  let gid = null;
  let saveTimer = 0;
  let checkTimer = 0;
  let finishHint = 0;
  let loadToken = 0;
  let finishing = false; // a celebration / end card is on its way: «Fertig» waits
  let active = false; // the screen is shown (FK.current() still names it while leave() runs)
  let layoutTimer = 0;
  const hinted = new Set(); // «Wörter»: pencils whose colour word was revealed after a wrong fill
  const el = {};

  const stateKey = () => 'c:' + page.id + ':' + mode;
  const newGid = () => 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);

  function hashOf(s) {
    let x = 7;
    for (let i = 0; i < s.length; i++) x = (x * 31 + s.charCodeAt(i)) >>> 0;
    return x;
  }

  /* ---------- palette & labels ---------- */
  function slotColors() {
    return page.colors.map((id) => FK.color.byId(id)).filter(Boolean);
  }

  // Label text per slot (index 0 = slot 1) for the current mode.
  function slotTexts() {
    const n = page.colors.length;
    if (mode === 'zahlen') return page.colors.map((_, i) => String(i + 1));
    if (mode === 'wuerfel') return page.colors.map((_, i) => '•'.repeat(i + 1));
    if (mode === 'woerter') return slotColors().map((c) => FK.text.word(c.word));
    if (mode === 'silben') {
      const rows = (FK.words && FK.words.syllables) || FALLBACK_ROWS;
      const keys = Object.keys(rows);
      const hsh = hashOf(page.id);
      const first = rows[keys[hsh % keys.length]].slice();
      const second = rows[keys[(hsh + 3) % keys.length]].slice();
      // deterministic shuffle so the same picture keeps its labels
      let seed = hsh;
      const rand = () => ((seed = (seed * 1103515245 + 12345) >>> 0) / 4294967296);
      const a = first.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        const t = a[i];
        a[i] = a[j];
        a[j] = t;
      }
      const pool = a.concat(second.filter((s) => a.indexOf(s) < 0));
      return pool.slice(0, n).map((s) => FK.text.syllable(s));
    }
    return [];
  }

  function setupPalette() {
    if (mode === 'frei') {
      pencils.set(FK.COLORS.slice());
      if (!FK.color.byId(T.colorId)) T.colorId = 'rot';
    } else {
      const cols = slotColors();
      const texts = slotTexts();
      const labels = {};
      // Würfel: dice on the picture, numerals on the pencils – the child counts the dots.
      // Wörter: big pencils without a tag (the word is the riddle); hint() adds one after a wrong fill.
      if (mode === 'wuerfel') cols.forEach((c, i) => { labels[c.id] = String(i + 1); });
      else if (mode !== 'woerter') cols.forEach((c, i) => { labels[c.id] = texts[i]; });
      pencils.set(cols, labels);
      if (!cols.some((c) => c.id === T.colorId)) T.colorId = cols[0].id;
      if (mode === 'woerter') hinted.forEach((id) => revealWord(id));
    }
    pencils.select(T.colorId);
    applyTool();
  }

  function revealWord(id) {
    const c = FK.color.byId(id);
    return c ? pencils.hint(id, FK.text.word(c.word)) : null;
  }

  function buildLabels() {
    eng.labels.innerHTML = '';
    spots = [];
    eng.labels.classList.toggle('words', mode === 'woerter');
    eng.labels.classList.toggle('dice', mode === 'wuerfel');
    if (mode === 'frei' || !FK.art.hasLabels(page) || !eng.W) return;
    const pos = FK.art.spotsOnPaper(page, eng.W, eng.H);
    const texts = slotTexts();
    if (pos.length) eng.labels.style.setProperty('--lblk', ((70 * pos[0].scale) / eng.W).toFixed(5));
    pos.forEach((p) => {
      const lab = h('div', { class: 'lbl-spot' });
      const t = texts[p.c - 1] || '';
      if (mode === 'wuerfel') lab.innerHTML = FK.ui.dice(p.c, 13);
      else lab.append(h('span', { text: t }));
      if (t.length > 2 && mode !== 'wuerfel') lab.classList.add('long');
      eng.labels.append(lab);
      spots.push({ x: p.x, y: p.y, ox: p.x, oy: p.y, c: p.c, el: lab, done: false, wrong: false, scale: p.scale, r: eng.regionAt(p.x, p.y, 4), twin: -1 });
    });
    layoutLabels();
    markHot(false);
  }

  /* Labels must never cover each other (small papers on phones, long colour words).
     Pass 1, in order: a label that overlaps one placed before it moves to the nearest free place whose
     centre is still in its own region (preferably not reaching into a neighbour). If there is none and
     the label it hits is of the same slot, it waits hidden behind that «twin» until the twin is done.
     Pass 2: the rest go to the nearest free place anywhere, with a short line to a dot in their region
     (a tap on such a label fills that region, see labelTap). Colour checks always use the original point. */
  function layoutLabels() {
    clearTimeout(layoutTimer);
    if (!spots.length || !eng.W) return;
    const pw = eng.labels.clientWidth;
    const ph = eng.labels.clientHeight;
    if (!pw || !ph) return;
    const k = eng.W / pw;
    const GAP = 3;
    eng.labels.querySelectorAll('.lead-line, .lead-dot').forEach((x) => x.remove());
    const box = spots.map((sp) => {
      sp.twin = -1;
      sp.lead = false;
      sp.leads = null;
      sp.el.classList.remove('twin', 'lead');
      return { w: sp.el.offsetWidth + GAP, h: sp.el.offsetHeight + GAP };
    });
    const placed = [];
    const hit = (x, y, b) => {
      for (let j = 0; j < placed.length; j++) {
        const q = placed[j];
        if (Math.abs(q.x - x) * 2 < q.w + b.w && Math.abs(q.y - y) * 2 < q.h + b.h) return q;
      }
      return null;
    };
    const fits = (x, y, b) => x - b.w / 2 >= 0 && x + b.w / 2 <= pw && y - b.h / 2 >= 0 && y + b.h / 2 <= ph;
    // nearest free place around (x0, y0); ok(x, y) filters, cost(x, y) adds to the distance
    const search = (x0, y0, b, maxR, ok, cost) => {
      const step = Math.max(2, Math.min(b.w, b.h) * 0.18);
      let best = null;
      for (let rad = step; rad <= maxR; rad += step) {
        const n = Math.max(12, Math.round((6.283 * rad) / step));
        for (let a = 0; a < n; a++) {
          const x = x0 + Math.cos((a / n) * 6.283) * rad;
          const y = y0 + Math.sin((a / n) * 6.283) * rad;
          if (!fits(x, y, b) || hit(x, y, b) || (ok && !ok(x, y))) continue;
          const score = rad + (cost ? cost(x, y) * step * 1.5 : 0);
          if (!best || score < best.score) best = { x, y, score };
        }
        if (best && best.score <= rad + step) break;
      }
      return best;
    };
    const put = (sp, i, x, y) => {
      sp.x = x * k;
      sp.y = y * k;
      sp.el.style.left = (sp.x / eng.W) * 100 + '%';
      sp.el.style.top = (sp.y / eng.H) * 100 + '%';
      placed.push({ x, y, w: box[i].w, h: box[i].h, i });
    };
    const later = [];
    spots.forEach((sp, i) => {
      const b = box[i];
      const x0 = sp.ox / k;
      const y0 = sp.oy / k;
      const first = hit(x0, y0, b);
      if (!first && fits(x0, y0, b)) return put(sp, i, x0, y0);
      const strays = (x, y) => {
        let n = 0;
        for (let a = 0; a < 8; a++) {
          const r = eng.regionAt((x + Math.cos(a * 0.785) * b.w * 0.42) * k, (y + Math.sin(a * 0.785) * b.h * 0.42) * k);
          if (r >= 0 && r !== sp.r) n++;
        }
        return n;
      };
      const best = search(x0, y0, b, Math.max(b.w, b.h) * 3, sp.r >= 0 ? (x, y) => eng.regionAt(x * k, y * k) === sp.r : null, strays);
      if (best) return put(sp, i, best.x, best.y);
      if (first && spots[first.i].c === sp.c && !spots[first.i].lead) {
        sp.twin = first.i;
        sp.x = sp.ox;
        sp.y = sp.oy;
        sp.el.style.left = (sp.x / eng.W) * 100 + '%';
        sp.el.style.top = (sp.y / eng.H) * 100 + '%';
        return;
      }
      later.push(i);
    });
    // the anchor dots of pass 2 must stay visible too
    const DOT = 12;
    later.forEach((i) => placed.push({ x: spots[i].ox / k, y: spots[i].oy / k, w: DOT, h: DOT, i: -1 }));
    later.forEach((i) => {
      const sp = spots[i];
      const b = box[i];
      const x0 = sp.ox / k;
      const y0 = sp.oy / k;
      const best = search(x0, y0, b, Math.max(pw, ph));
      if (!best) return put(sp, i, x0, y0);
      put(sp, i, best.x, best.y);
      sp.lead = true;
      sp.el.classList.add('lead');
      // line from the label's edge to the dot on the original point
      const dx = x0 - best.x;
      const dy = y0 - best.y;
      const len = Math.hypot(dx, dy) || 1;
      const ux = dx / len;
      const uy = dy / len;
      const e = Math.min((b.w - GAP) / 2 / Math.max(1e-3, Math.abs(ux)), (b.h - GAP) / 2 / Math.max(1e-3, Math.abs(uy)));
      // lines and dots lie under every label (first in the layer), so no line crosses a word
      const pct = (v, all) => ((v / all) * 100).toFixed(3) + '%';
      const line = h('i', { class: 'lead-line', style: {
        left: pct(best.x + ux * e, pw), top: pct(best.y + uy * e, ph),
        width: Math.max(0, len - e - 4).toFixed(1) + 'px', transform: 'rotate(' + Math.atan2(dy, dx).toFixed(3) + 'rad)',
      } });
      const dot = h('i', { class: 'lead-dot', style: { left: pct(x0, pw), top: pct(y0, ph) } });
      eng.labels.prepend(line, dot);
      sp.leads = [line, dot];
    });
    spots.forEach((sp, i) => {
      sp.w = (box[i].w - GAP) * k;
      sp.h = (box[i].h - GAP) * k;
    });
    showTwins();
  }

  // A tap on a label that sits away from its region (with a line) fills that region.
  function labelTap(x, y) {
    for (let i = 0; i < spots.length; i++) {
      const sp = spots[i];
      if (sp.lead && !sp.done && Math.abs(x - sp.x) * 2 <= sp.w && Math.abs(y - sp.y) * 2 <= sp.h) return { x: sp.ox, y: sp.oy };
    }
    return null;
  }

  function showTwins() {
    spots.forEach((sp) => {
      if (sp.twin >= 0) sp.el.classList.toggle('twin', !sp.done && !spots[sp.twin].done);
      if (sp.leads) sp.leads.forEach((x) => x.classList.toggle('off', sp.done));
    });
  }

  // The labels that belong to the chosen pencil get a ring in its colour (and hop once when picked).
  function markHot(hop) {
    if (mode === 'frei' || !spots.length) return;
    const c = FK.color.byId(T.colorId);
    const slot = page.colors.indexOf(T.colorId) + 1;
    eng.labels.style.setProperty('--hot', c ? c.hex : '#ffffff');
    let n = 0;
    spots.forEach((sp) => {
      const on = sp.c === slot;
      sp.el.classList.toggle('hot', on);
      if (sp.leads) sp.leads[1].classList.toggle('hot', on);
      if (on && hop && !sp.done) setTimeout(() => FK.ui.bounce(sp.el), 40 * n++);
    });
  }

  function dist(a, b) {
    return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2);
  }

  function checkLabels(silent) {
    if (!spots.length || !eng.W) return;
    const cols = slotColors().map((c) => FK.color.hexRgb(c.hex));
    const rad = Math.max(6, 24 * spots[0].scale);
    let open = 0;
    const fresh = [];
    const res = eng.sampleMany(spots.map((sp) => ({ x: sp.ox, y: sp.oy })), rad);
    spots.forEach((sp, i) => {
      const s = res[i];
      const target = cols[sp.c - 1];
      const white = target && target[0] > 245 && target[1] > 245 && target[2] > 245;
      const ok = white ? s.coverage < 0.25 || (s.rgb && dist(s.rgb, target) < 60) : s.coverage >= 0.42 && s.rgb && dist(s.rgb, target) < 80;
      if (ok && !sp.done) {
        sp.done = true;
        sp.el.classList.add('done');
        fresh.push(sp);
      } else if (!ok && sp.done) {
        sp.done = false;
        sp.el.classList.remove('done');
      }
      if (!ok) {
        open++;
        const wrong = s.coverage >= 0.6 && !white;
        if (wrong && !sp.wrong && !silent) {
          FK.ui.shake(sp.el);
          sp.el.classList.add('wrong');
          FK.sound.wrong();
          // point at the right pencil; in «Wörter» it now shows its colour word
          const id = page.colors[sp.c - 1];
          let pb = null;
          if (mode === 'woerter') {
            hinted.add(id);
            pb = revealWord(id);
          } else pb = pencils.button(id);
          if (pb) setTimeout(() => FK.ui.bounce(pb), 180);
        }
        if (!wrong) sp.el.classList.remove('wrong');
        sp.wrong = wrong;
      } else {
        sp.wrong = false;
        sp.el.classList.remove('wrong');
      }
    });
    if (!silent) {
      fresh.forEach((sp, i) => {
        const r = sp.el.getBoundingClientRect();
        FK.fx.burst(r.left + r.width / 2, r.top + r.height / 2, null, 6);
        if (i < 3) FK.sound.plip(spots.length - open);
      });
    }
    showTwins();
    updateCounter(spots.length - open, spots.length);
    if (!open && !completed && !restoring && !finishing) {
      // a picture that was finished before (gallery «Weitermalen», undo of «Nochmal») just counts as
      // finished again; one that never earned its stars (e.g. the child left too quickly) earns them now
      if (silent && FK.progress.isDone('color', page.id + ':' + mode)) completed = true;
      else complete();
    }
  }

  function scheduleCheck() {
    clearTimeout(checkTimer);
    if (spots.length) checkTimer = setTimeout(() => checkLabels(false), 120);
  }

  function updateCounter(done, total) {
    const was = el.counter.hidden;
    el.counter.hidden = !total;
    if (was !== el.counter.hidden) fitTitle();
    if (!total) return;
    el.counter.querySelector('b').textContent = done + ' / ' + total;
    el.counter.classList.toggle('full', done === total);
  }

  /* ---------- tools ---------- */
  function applyTool() {
    const c = FK.color.byId(T.colorId) || FK.COLORS[0];
    const labelMode = mode !== 'frei';
    eng.setTool({
      kind: T.kind,
      brush: T.brush,
      color: c.hex,
      rainbow: !!c.rainbow,
      pattern: labelMode ? 'voll' : T.pattern,
      size: T.size,
      emoji: T.emoji,
      mirror: 'off',
    });
    document.documentElement.style.setProperty('--cur', c.rainbow ? 'url(#fk-rainbow)' : c.hex);
    el.fill.classList.toggle('on', T.kind === 'fill');
    el.brush.classList.toggle('on', T.kind === 'brush');
    el.stamp.classList.toggle('on', T.kind === 'stamp');
    el.eraser.classList.toggle('on', T.kind === 'eraser');
    el.brush.querySelector('use').setAttribute('href', '#i-' + BRUSH_ICON[T.brush]);
    el.stamp.querySelector('.emoji').textContent = T.emoji;
    el.size.querySelector('circle').setAttribute('r', SIZE_INFO[T.size].r);
    el.pattern.classList.toggle('off', labelMode);
    el.pattern.classList.toggle('on', !labelMode && T.pattern !== 'voll');
  }

  function setKind(kind) {
    T.kind = kind;
    persistTool();
    applyTool();
  }

  function brushPop(anchor) {
    FK.ui.pop(anchor, (card) => {
      FK.ui.popTitle(card, 'Stifte');
      const grid = h('div', { class: 'grid-opts', style: { '--cols': 3 } });
      const c = FK.color.byId(T.colorId) || FK.COLORS[0];
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      TOOL_BRUSHES.forEach((id) => {
        const br = FK.BRUSHES[id];
        const b = FK.ui.opt(br.name, T.kind === 'brush' && T.brush === id, () => {
          T.brush = id;
          setKind('brush');
          FK.sound.tick();
          FK.ui.closePop(true);
        });
        const pc = h('canvas', { width: Math.round(72 * dpr), height: Math.round(44 * dpr) });
        FK.brushes.preview(pc, id, c.hex === '#ffffff' ? '#d9dcef' : c.hex, !!c.rainbow);
        b.append(pc, h('span', { text: br.name }));
        grid.append(b);
      });
      card.append(grid);
    });
  }

  function patternPop(anchor) {
    FK.ui.pop(anchor, (card) => {
      FK.ui.popTitle(card, 'Muster für den Eimer');
      const grid = h('div', { class: 'grid-opts', style: { '--cols': 4 } });
      const c = FK.color.byId(T.colorId) || FK.COLORS[0];
      const hex = c.rainbow ? '#ff4fa3' : c.hex;
      FK.engine.PATTERNS.forEach((p) => {
        const b = FK.ui.opt(p.name, T.pattern === p.id, () => {
          T.pattern = p.id;
          T.kind = 'fill';
          persistTool();
          applyTool();
          FK.sound.tick();
          FK.ui.closePop(true);
        });
        const chip = h('canvas', { class: 'pattern-chip', width: 104, height: 80 });
        const g = chip.getContext('2d');
        if (p.id === 'voll' || p.id === 'glitzer') {
          g.fillStyle = hex;
          g.fillRect(0, 0, 104, 80);
          if (p.id === 'glitzer') {
            for (let i = 0; i < 14; i++) FK.brushes.sparkle(g, Math.random() * 104, Math.random() * 80, 3 + Math.random() * 6, i % 2 ? '#ffffff' : '#fff6b3');
          }
        } else {
          g.fillStyle = g.createPattern(FK.engine.patternTile(p.id, hex, 1.4), 'repeat');
          g.fillRect(0, 0, 104, 80);
        }
        b.append(chip, h('span', { text: p.name }));
        grid.append(b);
      });
      card.append(grid);
    });
  }

  function sizePop(anchor) {
    FK.ui.pop(anchor, (card) => {
      FK.ui.popTitle(card, 'Grösse');
      const grid = h('div', { class: 'grid-opts', style: { '--cols': 4 } });
      SIZE_INFO.forEach((sz, i) => {
        const b = FK.ui.opt(sz.name, T.size === i, () => {
          T.size = i;
          persistTool();
          applyTool();
          FK.sound.note(3 + i * 2);
          FK.ui.closePop(true);
        });
        const dot = h('span', { class: 'size-dot', style: { width: sz.dot + 'px', height: sz.dot + 'px' } });
        b.append(h('span', { class: 'dotbox' }, dot), h('span', { text: sz.name }));
        grid.append(b);
      });
      card.append(grid);
    });
  }

  function stampPop(anchor) {
    FK.ui.pop(anchor, (card) => stickerPicker(card, T, () => {
      setKind('stamp');
      FK.sound.pop();
      FK.ui.closePop(true);
    }, persistTool));
  }

  // Shared with «Freies Malen»: tabs + emoji grid, last tab = earned reward stickers.
  function stickerPicker(card, state, onPick, onTab) {
    const cats = FK.STICKERS.slice();
    const unlocked = FK.rewardsUnlocked();
    cats.push({ icon: '🏆', name: 'Belohnungen', items: FK.REWARDS.slice(0, unlocked), locked: FK.REWARDS.length - unlocked });
    if (state.stickerTab >= cats.length) state.stickerTab = 0;
    const tabs = h('div', { class: 'tabs' });
    const grid = h('div', { class: 'stickers' });
    const fill = () => {
      grid.innerHTML = '';
      const cat = cats[state.stickerTab];
      cat.items.forEach(([e, name]) => {
        grid.append(h('button', {
          type: 'button',
          class: 'sticker emoji' + (e === state.emoji ? ' on' : ''),
          'aria-label': name,
          text: e,
          onclick: () => {
            state.emoji = e;
            onPick();
          },
        }));
      });
      if (cat.locked) {
        const n = Math.min(cat.locked, 6);
        for (let i = 0; i < n; i++) grid.append(h('span', { class: 'sticker locked', html: FK.icon('lock') }));
      }
    };
    cats.forEach((cat, i) => {
      tabs.append(h('button', {
        type: 'button',
        class: 'tab emoji' + (i === state.stickerTab ? ' on' : ''),
        'aria-label': cat.name,
        text: cat.icon,
        onclick: () => {
          state.stickerTab = i;
          tabs.querySelectorAll('.tab').forEach((x, j) => x.classList.toggle('on', j === i));
          fill();
          FK.sound.tick();
          if (onTab) onTab();
          FK.ui.popPosition();
        },
      }));
    });
    fill();
    card.append(tabs, grid);
  }
  FK.ui.stickerPicker = stickerPicker;

  /* ---------- saving ---------- */
  // JPEG of a temporary canvas, which is freed right after (iOS canvas memory).
  function blobOnce(c, q) {
    const free = () => { c.width = c.height = 0; };
    return FK.canvasBlob(c, 'image/jpeg', q).then((b) => { free(); return b; }, (e) => { free(); throw e; });
  }

  function scheduleSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(save, 1500);
  }

  async function save() {
    clearTimeout(saveTimer);
    // never while another picture is still loading (the paper would hold the previous one)
    if (!page || !eng || !eng.W || restoring || eng.pageId !== page.id) return;
    if (eng.busy) {
      saveTimer = setTimeout(save, 800);
      return;
    }
    // Take every snapshot synchronously: by the first await another picture may already be loading.
    const pageId = page.id;
    const m = mode;
    const meta = { W: eng.W, H: eng.H, paper: eng.paper, pageId, mode: m, gid, done: completed };
    const paintP = eng.paintBlob();
    const thumbP = blobOnce(eng.compose(360), 0.84);
    try {
      const paint = await paintP;
      const thumb = await thumbP;
      await FK.store.put('c:' + pageId + ':' + m, Object.assign(meta, { paint, thumb, t: Date.now() }));
      const idx = FK.settings.get('color.index') || {};
      idx[pageId] = { mode: m, t: Date.now(), done: Object.assign({}, (idx[pageId] || {}).done, meta.done ? { [m]: true } : {}) };
      FK.settings.set('color.index', idx);
    } catch (e) { /* storage unavailable */ }
  }

  // Snapshots are taken synchronously, so leaving the screen meanwhile can't spoil the stored picture.
  async function saveToGallery() {
    if (!eng.W || !page) return;
    const rec = { id: gid, kind: 'color', pageId: page.id, mode, name: page.name, W: eng.W, H: eng.H, k: eng.paperScale(), paper: eng.paper };
    const paintP = eng.paintBlob();
    const thumbP = blobOnce(eng.compose(420), 0.86);
    try {
      const paint = await paintP;
      const thumb = await thumbP;
      const now = Date.now();
      const old = await FK.store.getBild(rec.id).catch(() => null);
      await FK.store.putBild(Object.assign(rec, { created: old ? old.created : now, updated: now, paint, thumb }));
    } catch (e) { /* storage unavailable */ }
  }

  // Gallery «Weitermalen» replaces this page's slot: a different picture in it goes to the gallery first.
  async function archiveSlot(cur) {
    const old = await FK.store.getBild(cur.gid).catch(() => null);
    if (old && (old.updated || 0) >= (cur.t || 0)) return;
    const img = await FK.blobToImage(cur.paint);
    const share = FK.engine.coverageOf(img, cur.W, cur.H);
    if (img.close) img.close();
    if (share < MIN_PAINT) return;
    const pg = FK.art.find(cur.pageId);
    const t = cur.t || Date.now();
    await FK.store.putBild({
      id: cur.gid, kind: 'color', pageId: cur.pageId, mode: cur.mode, name: pg ? pg.name : '',
      created: old ? old.created : t, updated: t,
      W: cur.W, H: cur.H, k: old && old.k ? old.k : Math.min(2, window.devicePixelRatio || 1), paper: cur.paper || '#ffffff',
      paint: cur.paint, thumb: cur.thumb,
    });
  }

  function hasPaint() {
    return eng.coverage() >= MIN_PAINT;
  }

  /* ---------- finishing ---------- */
  async function complete() {
    if (completed || finishing || !eng.W) return;
    completed = true;
    finishing = true;
    const tok = loadToken;
    try {
      eng.settle();
      const labelMode = mode !== 'frei';
      const stars = FK.progress.finish('color', page.id + ':' + mode, labelMode ? 2 : 1);
      eng.flash();
      const g = saveToGallery();
      save();
      await g;
      // the child may have left meanwhile: no celebration or end card on another screen
      if (tok !== loadToken) return;
      await FK.ui.celebrate({ stars, big: labelMode, from: el.done });
      if (tok !== loadToken) return;
      endCard(stars);
    } finally {
      if (tok === loadToken) finishing = false;
    }
  }

  // «Fertig» (tapped twice on purpose) before all labels are right: keep the picture, no stars yet –
  // finishing it later still celebrates and earns them.
  async function finishEarly() {
    finishing = true;
    const tok = loadToken;
    try {
      eng.flash();
      const g = saveToGallery();
      save();
      await g;
      if (tok !== loadToken) return;
      await FK.ui.celebrate({ stars: 0 });
      if (tok !== loadToken) return;
      endCard(0);
    } finally {
      if (tok === loadToken) {
        finishing = false;
        scheduleCheck();
      }
    }
  }

  function endCard(stars) {
    if (!eng.W || !active) return;
    const img = h('canvas', { class: 'end-pic' });
    const c = eng.compose(640);
    img.width = c.width;
    img.height = c.height;
    img.getContext('2d').drawImage(c, 0, 0);
    c.width = c.height = 0;
    const body = h('div', { class: 'end-body' }, h('div', { class: 'end-frame' }, img));
    if (stars) {
      const row = h('div', { class: 'end-stars' });
      for (let i = 0; i < stars; i++) row.insertAdjacentHTML('beforeend', FK.icon('star', 'ic'));
      body.append(row);
    }
    FK.ui.modal({
      title: FK.text.word(FK.pick(['Fertig!', 'Wunderschön!', 'Bravo!', 'Super gemacht!'])),
      read: true,
      body,
      wide: true,
      actions: [
        { label: 'Malbuch', icon: 'book', cls: 'btn-sun', onClick: () => FK.go('book', { cat: page.cat }, { replace: true }) },
        { label: 'Weitermalen', icon: 'pencil' },
        { label: 'Nochmal', icon: 'refresh', onClick: () => restart(false) },
      ],
    });
  }

  function onFinishButton() {
    if (finishing || restoring || !eng.W) return;
    eng.settle();
    if (completed) {
      // already finished: show it again (the gallery copy follows the latest strokes)
      eng.flash();
      saveToGallery();
      FK.sound.tada();
      endCard(0);
      return;
    }
    if (mode === 'frei') {
      if (!hasPaint()) return nothingYet();
      complete();
      return;
    }
    // the last fill may not be checked yet
    clearTimeout(checkTimer);
    checkLabels(false);
    if (completed || finishing) return;
    const open = spots.filter((s) => !s.done);
    if (!open.length) {
      complete();
      return;
    }
    const since = Date.now() - finishHint;
    if (since < 1200) return; // a double tap: the hint is still playing
    if (since > 6000 || !hasPaint()) {
      finishHint = Date.now();
      FK.sound.wrong();
      open.forEach((s, i) => setTimeout(() => FK.ui.bounce(s.el), i * 60));
      FK.ui.toast('Noch nicht fertig!', 0, { read: true });
      return;
    }
    finishEarly();
  }

  // An empty paper is not a picture yet: no stars, nothing for the gallery.
  function nothingYet() {
    FK.sound.nope();
    FK.ui.shake(eng.paperEl);
    FK.ui.toast('Mal zuerst etwas!', 0, { read: true });
  }

  async function restart(confirmFirst) {
    if (finishing || restoring || !eng.W || !active) return;
    const tok = loadToken;
    if (confirmFirst) {
      const ok = await FK.ui.confirm(FK.text.word('Nochmal von vorne?'), 'Ja', 'Nein', { read: true });
      if (!ok || tok !== loadToken) return;
    }
    // undo («Zurück») brings the old picture back together with its gallery id and «finished»
    const meta = { gid, completed };
    completed = false;
    gid = newGid();
    await eng.newPage({ pageId: page.id, keepUndo: true, animate: true, meta });
    if (tok !== loadToken) return;
    buildLabels();
    checkLabels(true);
    scheduleSave();
  }

  /* ---------- screen ---------- */
  // Long picture names shrink to fit the top bar on phones instead of ending in «…».
  function fitTitle() {
    const t = el.title;
    t.style.fontSize = '';
    t.style.webkitTextStrokeWidth = '';
    if (!t.clientWidth) return;
    let fs = parseFloat(getComputedStyle(t).fontSize) || 26;
    const fs0 = fs;
    const stroke = parseFloat(getComputedStyle(t).webkitTextStrokeWidth) || 6;
    while (t.scrollWidth > t.clientWidth + 1 && fs > 12) {
      fs -= 1;
      t.style.fontSize = fs + 'px';
      t.style.webkitTextStrokeWidth = Math.max(3, (stroke * fs) / fs0).toFixed(1) + 'px';
    }
  }

  function railBtn(icon, label, onClick, extra) {
    const b = FK.ui.btn({ icon, label, onClick });
    if (extra) b.append(extra);
    return b;
  }

  FK.screen('color', {
    build(r) {
      root = r;
      el.title = null;
      el.counter = h('div', { class: 'cl-counter', hidden: true, html: FK.icon('check', 'ic') + '<b></b>' });
      el.chip = h('div', { class: 'cl-mode' });
      const bar = FK.ui.topbar({ title: '', backIcon: 'back', onBack: () => { FK.back(); }, extra: [el.chip, el.counter] });
      el.title = bar.querySelector('.title');

      el.fill = railBtn('bucket', 'Eimer', () => { setKind('fill'); });
      el.brush = railBtn('crayon', 'Stift', (e) => {
        if (T.kind !== 'brush') setKind('brush');
        brushPop(e.currentTarget);
      });
      el.pattern = railBtn('pattern', 'Muster', (e) => patternPop(e.currentTarget));
      el.stamp = FK.ui.btn({ emoji: T.emoji, label: 'Stempel', onClick: (e) => {
        if (T.kind !== 'stamp') setKind('stamp');
        stampPop(e.currentTarget);
      } });
      el.eraser = railBtn('eraser', 'Gummi', () => setKind('eraser'));
      el.size = FK.ui.btn({ label: 'Grösse', onClick: (e) => sizePop(e.currentTarget) });
      el.size.insertAdjacentHTML('afterbegin', '<svg class="ic" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="12" fill="#23203d"/></svg>');

      el.undo = railBtn('undo', 'Zurück', () => {
        FK.ui.closePop(true);
        if (eng.undo()) FK.sound.undo();
        else {
          FK.sound.nope();
          FK.ui.shake(el.undo);
        }
      });
      el.zoom = railBtn('zoom', 'Ganzes Bild', () => eng.zoomReset());
      el.zoom.classList.add('two-lines');
      el.zoom.hidden = true;
      el.restart = railBtn('refresh', 'Neu', () => restart(true));
      el.done = FK.ui.btn({ icon: 'check', label: 'Fertig', cls: 'btn-go', onClick: onFinishButton });

      const tools = h('nav', { class: 'rail rail-tools', 'aria-label': 'Werkzeuge' }, el.fill, el.brush, el.pattern, el.stamp, el.eraser, el.size);
      const actions = h('nav', { class: 'rail rail-actions', 'aria-label': 'Aktionen' }, el.undo, el.zoom, el.restart, el.done);
      const stageHost = h('div', { class: 'cl-stage' });
      pencils = FK.ui.pencilBox({
        onPick: (c) => {
          T.colorId = c.id;
          if (T.kind === 'eraser' || T.kind === 'stamp') T.kind = mode === 'frei' ? 'brush' : 'fill';
          persistTool();
          applyTool();
          markHot(true);
        },
      });
      const body = h('div', { class: 'paint-grid' }, tools, stageHost, actions, h('div', { class: 'box-wrap' }, pencils.el));
      r.append(bar, body);

      eng = FK.engine.create({
        host: stageHost,
        kind: 'color',
        onChange: () => {
          scheduleSave();
          scheduleCheck();
        },
        onZoom: (z) => { el.zoom.hidden = z <= 1; },
        fillAt: (x, y) => (mode !== 'frei' ? labelTap(x, y) : null),
        // the paper was re-cut for a new screen shape (rotation): labels move with the art
        onRemap: () => {
          if (!page || restoring || eng.pageId !== page.id) return;
          buildLabels();
          checkLabels(true);
          scheduleSave();
        },
        // undo of «Nochmal»: the old picture is back with its gallery id and «finished» state
        onPageUndo: (m) => {
          if (!m) return;
          gid = m.gid || gid;
          completed = !!m.completed;
        },
      });
      // the labels' size follows the paper only in steps: re-check for overlaps when it changes
      if (window.ResizeObserver) {
        let lw = 0;
        new ResizeObserver(() => {
          const w = eng.labels.clientWidth;
          if (!w || w === lw) return;
          lw = w;
          clearTimeout(layoutTimer);
          layoutTimer = setTimeout(() => { if (active && !restoring) layoutLabels(); }, 200);
        }).observe(eng.labels);
      }
      window.addEventListener('resize', () => { if (active) fitTitle(); });

      document.addEventListener('visibilitychange', () => {
        if (document.hidden && FK.current() === 'color') save();
      });
      FK.on('settings', (e) => {
        if (e.key === 'schrift' && FK.current() === 'color' && page) {
          setupPalette();
          buildLabels();
          checkLabels(true);
        }
      });
    },

    enter(params) {
      active = true;
      finishing = false;
      hinted.clear();
      page = FK.art.find(params.pageId);
      if (!page) {
        setTimeout(() => FK.back());
        return;
      }
      mode = MODES[params.mode] && (params.mode === 'frei' || FK.art.hasLabels(page)) ? params.mode : 'frei';
      el.title.textContent = FK.text.word(page.name);
      fitTitle();
      el.chip.textContent = FK.text.word(MODES[mode].short);
      el.chip.className = 'cl-mode mode-' + mode;
      el.chip.hidden = mode === 'frei';
      completed = false;
      spots = [];
      updateCounter(0, 0);
      if (mode !== 'frei' && (T.kind === 'stamp' || T.kind === 'eraser')) T.kind = 'fill';
      setupPalette();
      const token = ++loadToken;
      restoring = true;
      requestAnimationFrame(async () => {
        eng.fit();
        let rec = null;
        if (params.bild && params.bild.pageId === page.id) {
          rec = Object.assign({}, params.bild, { gid: params.bild.id, done: false });
          try {
            const cur = await FK.store.get('c:' + page.id + ':' + mode);
            if (cur && cur.paint && cur.gid && cur.gid !== params.bild.id) await archiveSlot(cur);
          } catch (e) { /* no storage */ }
        } else {
          try {
            rec = await FK.store.get('c:' + page.id + ':' + mode);
          } catch (e) { /* no storage */ }
        }
        if (token !== loadToken) return;
        let img = null;
        if (rec && rec.paint && rec.pageId === page.id) {
          try {
            img = await FK.blobToImage(rec.paint);
          } catch (e) { img = null; }
        }
        if (token !== loadToken) return;
        if (img) {
          eng.load(rec, img);
          if (img.close) img.close();
          gid = rec.gid || newGid();
          completed = !!rec.done;
        } else {
          await eng.newPage({ pageId: page.id });
          gid = newGid();
        }
        if (token !== loadToken) return;
        restoring = false;
        buildLabels();
        checkLabels(true);
        // Andika may still be loading: word labels get their real width, then the layout is re-checked
        fitTitle();
        if (document.fonts && document.fonts.status !== 'loaded') {
          document.fonts.ready.then(() => {
            if (token !== loadToken) return;
            layoutLabels();
            fitTitle();
          });
        }
      });
    },

    leave() {
      loadToken++;
      active = false;
      finishing = false;
      FK.ui.closePop(true);
      if (page && eng.W) {
        // lands a fill, stroke or new-paper swap now, so the save below can't be put off
        eng.settle();
        const p = save();
        // free the big canvases once the drawing is safely stored
        Promise.resolve(p).then(() => { if (!active) eng.release(); });
      }
      // after settle(): its last change must not start a label check on the hidden screen
      clearTimeout(checkTimer);
      clearTimeout(layoutTimer);
    },
  });

  FK.COLOR_MODES = MODES;
  FK.COLOR_MODE_ORDER = MODE_ORDER;
})();
