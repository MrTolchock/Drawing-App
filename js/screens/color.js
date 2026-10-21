/* Farbklecks – Ausmalen: frei oder «Malen nach Zahlen / Würfeln / Silben / Farbwörtern». */
(function () {
  'use strict';
  const FK = window.FK;
  const h = FK.h;

  const MODES = {
    frei: { name: 'Frei ausmalen', short: 'Frei' },
    wuerfel: { name: 'Malen nach Würfel', short: 'Würfel' },
    zahlen: { name: 'Malen nach Zahlen', short: 'Zahlen' },
    silben: { name: 'Malen nach Silben', short: 'Silben' },
    woerter: { name: 'Farbwörter lesen', short: 'Wörter' },
  };
  const MODE_ORDER = ['frei', 'wuerfel', 'zahlen', 'silben', 'woerter'];
  const TOOL_BRUSHES = ['wachs', 'filz', 'glitzer', 'spray', 'neon'];
  const BRUSH_ICON = { wachs: 'crayon', filz: 'marker', glitzer: 'glitter', spray: 'brush', neon: 'brush' };
  const SIZE_INFO = [{ name: 'Klein', dot: 10, r: 5 }, { name: 'Mittel', dot: 18, r: 8 }, { name: 'Gross', dot: 28, r: 12 }, { name: 'Riesig', dot: 42, r: 16 }];
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
      if (mode !== 'woerter') cols.forEach((c, i) => { labels[c.id] = texts[i]; });
      pencils.set(cols, mode !== 'woerter' ? labels : null);
      if (!cols.some((c) => c.id === T.colorId)) T.colorId = cols[0].id;
    }
    pencils.select(T.colorId);
    applyTool();
  }

  function buildLabels() {
    eng.labels.innerHTML = '';
    spots = [];
    eng.labels.classList.toggle('words', mode === 'woerter');
    if (mode === 'frei' || !FK.art.hasLabels(page) || !eng.W) return;
    const pos = FK.art.spotsOnPaper(page, eng.W, eng.H);
    const texts = slotTexts();
    if (pos.length) eng.labels.style.setProperty('--lblk', ((70 * pos[0].scale) / eng.W).toFixed(5));
    pos.forEach((p) => {
      const lab = h('div', { class: 'lbl-spot', style: { left: (p.x / eng.W) * 100 + '%', top: (p.y / eng.H) * 100 + '%' } });
      const t = texts[p.c - 1] || '';
      if (mode === 'wuerfel') lab.innerHTML = FK.ui.dice(p.c);
      else lab.append(h('span', { text: t }));
      if (t.length > 2) lab.classList.add('long');
      eng.labels.append(lab);
      spots.push({ x: p.x, y: p.y, c: p.c, el: lab, done: false, wrong: false, scale: p.scale });
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
    spots.forEach((sp) => {
      const s = eng.sample(sp.x, sp.y, rad);
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
    updateCounter(spots.length - open, spots.length);
    if (!open && !completed && !restoring) complete();
  }

  function scheduleCheck() {
    clearTimeout(checkTimer);
    if (spots.length) checkTimer = setTimeout(() => checkLabels(false), 120);
  }

  function updateCounter(done, total) {
    if (!total) {
      el.counter.hidden = true;
      return;
    }
    el.counter.hidden = false;
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
  function scheduleSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(save, 1500);
  }

  async function save() {
    clearTimeout(saveTimer);
    if (!page || !eng || !eng.W) return;
    if (eng.busy) {
      saveTimer = setTimeout(save, 800);
      return;
    }
    // Take every snapshot synchronously: by the first await another picture may already be loading.
    const pageId = page.id;
    const m = mode;
    const meta = { W: eng.W, H: eng.H, paper: eng.paper, pageId, mode: m, gid, done: completed };
    const paintP = eng.paintBlob();
    const thumbP = FK.canvasBlob(eng.compose(360), 'image/jpeg', 0.84);
    try {
      const paint = await paintP;
      const thumb = await thumbP;
      await FK.store.put('c:' + pageId + ':' + m, Object.assign(meta, { paint, thumb, t: Date.now() }));
      const idx = FK.settings.get('color.index') || {};
      idx[pageId] = { mode: m, t: Date.now(), done: Object.assign({}, (idx[pageId] || {}).done, meta.done ? { [m]: true } : {}) };
      FK.settings.set('color.index', idx);
    } catch (e) { /* storage unavailable */ }
  }

  async function saveToGallery() {
    try {
      const paint = await eng.paintBlob();
      const thumb = await FK.canvasBlob(eng.compose(420), 'image/jpeg', 0.86);
      const now = Date.now();
      const old = await FK.store.getBild(gid).catch(() => null);
      await FK.store.putBild({
        id: gid, kind: 'color', pageId: page.id, mode, name: page.name,
        created: old ? old.created : now, updated: now,
        W: eng.W, H: eng.H, k: eng.paperScale(), paper: eng.paper, paint, thumb,
      });
    } catch (e) { /* storage unavailable */ }
  }

  /* ---------- finishing ---------- */
  async function complete() {
    completed = true;
    eng.settle();
    const labelMode = mode !== 'frei';
    const stars = FK.progress.finish('color', page.id + ':' + mode, labelMode ? 2 : 1);
    eng.flash();
    await saveToGallery();
    save();
    await FK.ui.celebrate({ stars, big: labelMode, from: el.done });
    endCard(stars);
  }

  function endCard(stars) {
    const img = h('canvas', { class: 'end-pic' });
    const c = eng.compose(640);
    img.width = c.width;
    img.height = c.height;
    img.getContext('2d').drawImage(c, 0, 0);
    const body = h('div', { class: 'end-body' }, h('div', { class: 'end-frame' }, img));
    if (stars) {
      const row = h('div', { class: 'end-stars' });
      for (let i = 0; i < stars; i++) row.insertAdjacentHTML('beforeend', FK.icon('star', 'ic'));
      body.append(row);
    }
    FK.ui.modal({
      title: FK.pick(['Fertig!', 'Wunderschön!', 'Bravo!', 'Super gmacht!']),
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
    const labelMode = mode !== 'frei';
    if (labelMode && !completed) {
      const open = spots.filter((s) => !s.done);
      const now = Date.now();
      if (open.length && now - finishHint > 4000) {
        finishHint = now;
        FK.sound.wrong();
        open.forEach((s, i) => setTimeout(() => FK.ui.bounce(s.el), i * 60));
        FK.ui.toast('Noch nicht ganz fertig! Schau die Zeichen an.');
        return;
      }
    }
    if (completed) {
      eng.flash();
      saveToGallery();
      FK.sound.tada();
      endCard(0);
      return;
    }
    if (labelMode) {
      // finished without all labels: keep the picture, no stars
      completed = true;
      eng.flash();
      saveToGallery().then(() => { save(); FK.ui.celebrate({ stars: 0 }).then(() => endCard(0)); });
      return;
    }
    complete();
  }

  async function restart(confirmFirst) {
    if (confirmFirst) {
      const ok = await FK.ui.confirm('Nochmal von vorne?', 'Ja', 'Nein');
      if (!ok) return;
    }
    completed = false;
    gid = newGid();
    await eng.newPage({ pageId: page.id, keepUndo: true, animate: true });
    buildLabels();
    checkLabels(true);
    scheduleSave();
  }

  /* ---------- screen ---------- */
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
      el.eraser = railBtn('eraser', 'Radierer', () => setKind('eraser'));
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
      el.zoom = railBtn('zoom', 'Ganz', () => eng.zoomReset());
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
      });

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
      page = FK.art.find(params.pageId);
      if (!page) {
        setTimeout(() => FK.back());
        return;
      }
      mode = MODES[params.mode] && (params.mode === 'frei' || FK.art.hasLabels(page)) ? params.mode : 'frei';
      el.title.textContent = FK.text.word(page.name);
      el.chip.textContent = MODES[mode].short;
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
        if (params.bild && params.bild.pageId === page.id) rec = Object.assign({}, params.bild, { gid: params.bild.id, done: false });
        else {
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
          gid = rec.gid || newGid();
          completed = !!rec.done;
        } else {
          await eng.newPage({ pageId: page.id });
          gid = newGid();
        }
        buildLabels();
        checkLabels(true);
        restoring = false;
      });
    },

    leave() {
      loadToken++;
      FK.ui.closePop(true);
      clearTimeout(checkTimer);
      if (page && eng.W) {
        eng.settle();
        const p = save();
        // free the big canvases once the drawing is safely stored
        Promise.resolve(p).then(() => { if (FK.current() !== 'color') eng.release(); });
      }
    },
  });

  FK.COLOR_MODES = MODES;
  FK.COLOR_MODE_ORDER = MODE_ORDER;
})();
