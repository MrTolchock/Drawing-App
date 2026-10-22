/* Farbklecks – Lesen: Silben-Puzzle, Wort und Bild, Silben-Ballone und Lies genau.
   There is no speech: every game checks itself through pictures, colours and stars,
   so the child sees at once whether the syllable or word was read right. */
(function () {
  'use strict';
  const FK = window.FK;
  const h = FK.h;

  const N_PUZZLE = 5;
  const N_WORT = 6;
  const N_POPS = 8;
  const N_GENAU = 6;
  const INK = '#23203d';
  const PASTELS = ['#ffc93c', '#7be0b0', '#8fd3ff', '#ff9cc6', '#c7a6ff', '#ffb366'];
  const BALLOON_COLORS = ['#ff9cc6', '#8fd3ff', '#ffc93c', '#7be0b0', '#c7a6ff', '#ffb366', '#ff8a7a'];
  const ARC = '<svg class="arc" viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden="true"><path d="M4 4 Q50 26 96 4"/></svg>';

  // Used only if js/learn/words.js could not be loaded.
  const FALLBACK = {
    list: [
      { w: 'Ma-mi', e: '👩‍👧', lvl: 1 }, { w: 'O-ma', e: '👵', lvl: 1 }, { w: 'La-ma', e: '🦙', lvl: 1 },
      { w: 'Ro-se', e: '🌹', lvl: 1 }, { w: 'Na-se', e: '👃', lvl: 1 }, { w: 'Ha-se', e: '🐰', lvl: 1 },
      { w: 'Ve-lo', e: '🚲', lvl: 1 }, { w: 'Ba-na-ne', e: '🍌', lvl: 2 }, { w: 'To-ma-te', e: '🍅', lvl: 2 },
      { w: 'Ra-ke-te', e: '🚀', lvl: 2 }, { w: 'Me-lo-ne', e: '🍉', lvl: 2 }, { w: 'Ti-ger', e: '🐯', lvl: 2 },
      { w: 'Ka-mel', e: '🐫', lvl: 2 }, { w: 'Son-ne', e: '☀️', lvl: 3 }, { w: 'Maus', e: '🐭', lvl: 3 },
      { w: 'Kat-ze', e: '🐱', lvl: 3 }, { w: 'Ap-fel', e: '🍎', lvl: 3 }, { w: 'Blu-me', e: '🌸', lvl: 3 },
    ],
    syllables: { M: ['Ma', 'Me', 'Mi', 'Mo', 'Mu'], L: ['La', 'Le', 'Li', 'Lo', 'Lu'], S: ['Sa', 'Se', 'Si', 'So', 'Su'] },
    phrases: [
      { t: 'Die Sonne ist gelb.', e: '☀️', check: { emoji: '☀️', color: 'gelb' } },
      { t: 'Der Ball ist rot.', e: '⚽', check: { emoji: '⚽', color: 'rot' } },
      { t: 'Das Auto ist blau.', e: '🚗', check: { emoji: '🚗', color: 'blau' } },
      { t: 'Das Herz ist rot.', e: '❤️', check: { emoji: '❤️', color: 'rot' } },
      { t: 'Der Baum ist grün.', e: '🌳', check: { emoji: '🌳', color: 'gruen' } },
      { t: 'Der Fisch ist orange.', e: '🐟', check: { emoji: '🐟', color: 'orange' } },
    ],
  };

  function data() {
    const W = FK.words || {};
    return {
      list: W.list && W.list.length ? W.list : FALLBACK.list,
      syllables: W.syllables && Object.keys(W.syllables).length ? W.syllables : FALLBACK.syllables,
      phrases: W.phrases && W.phrases.length ? W.phrases : FALLBACK.phrases,
    };
  }

  /* ---------- screen state, timers and clean-up ---------- */

  let root = null;
  let stage = null;
  let titleEl = null;
  let backUse = null;
  let view = '';
  let token = 0; // bumped on every view change: pending timers and awaits of the old view stop
  let timers = [];
  let rafId = 0;
  let resizeRaf = 0;
  let onResize = null;
  const recent = {};

  function later(ms, fn) {
    const t = token;
    const id = setTimeout(() => {
      timers = timers.filter((x) => x !== id);
      if (t === token) fn();
    }, ms);
    timers.push(id);
    return id;
  }
  function cancel(id) {
    if (!id) return;
    clearTimeout(id);
    timers = timers.filter((x) => x !== id);
  }
  function stopAll() {
    token++;
    timers.forEach(clearTimeout);
    timers = [];
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
    onResize = null;
  }

  function setView(name, title) {
    stopAll();
    view = name;
    stage.textContent = '';
    stage.className = 'rd-stage rd-on-' + name;
    titleEl.textContent = title;
    backUse.setAttribute('href', name === 'home' ? '#i-home' : '#i-back');
    return token;
  }

  function goBack() {
    if (view === 'home' || !view) FK.back();
    else if (view === 'ballone') { FK.sound.close(); showBallPick(); }
    else { FK.sound.close(); showHome(); }
  }

  function onWinResize() {
    if (resizeRaf) return;
    resizeRaf = requestAnimationFrame(() => {
      resizeRaf = 0;
      if (onResize) onResize();
    });
  }

  // Escape (keyboard on the iPad) leaves a game first, then the screen.
  function onKey(e) {
    if (e.key !== 'Escape' || view === 'home' || document.querySelector('.modal')) return;
    e.stopImmediatePropagation();
    e.preventDefault();
    goBack();
  }

  // Relayout again once the reading font is there (measurements depend on it).
  function afterFonts(fn) {
    const t = token;
    try {
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (t === token) fn(); });
    } catch (e) { /* old browser */ }
  }

  /* ---------- small helpers ---------- */

  const lc = (s) => String(s).toLocaleLowerCase('de-CH');
  const plain = (w) => w.replace(/-/g, '');
  const centre = (el) => {
    const r = el.getBoundingClientRect();
    return [r.left + r.width / 2, r.top + r.height / 2];
  };
  function twinkleAround(el, n, col) {
    const r = el.getBoundingClientRect();
    for (let i = 0; i < n; i++) FK.fx.twinkle(r.left + Math.random() * r.width, r.top + Math.random() * r.height, col || '#ffffff');
  }
  function burstAt(el, cols, n) {
    const c = centre(el);
    FK.fx.burst(c[0], c[1], cols, n);
  }

  function getLvl() {
    const v = FK.settings.get('read.lvl') | 0;
    return v >= 1 && v <= 3 ? v : 1;
  }
  function setLvl(n) { FK.settings.set('read.lvl', n); }

  function starsHtml(n, of) {
    let s = '';
    for (let i = 0; i < (of || n); i++) s += FK.icon(i < n ? 'star' : 'star-empty', 'ic');
    return s;
  }

  // Random words of a level, avoiding the words of the last rounds.
  function pickWords(lvl, n, filter, key) {
    const L = data().list.filter((x) => !filter || filter(x));
    let pool = L.filter((x) => x.lvl === lvl);
    if (pool.length < n) pool = pool.concat(FK.shuffle(L.filter((x) => Math.abs(x.lvl - lvl) === 1)).slice(0, n - pool.length));
    if (pool.length < n) pool = pool.concat(FK.shuffle(L.filter((x) => pool.indexOf(x) < 0)).slice(0, n - pool.length));
    const k = key + lvl;
    const rec = recent[k] || [];
    const fresh = FK.shuffle(pool.filter((x) => rec.indexOf(x.w) < 0));
    const old = FK.shuffle(pool.filter((x) => rec.indexOf(x.w) >= 0));
    const out = fresh.concat(old).slice(0, n);
    recent[k] = out.map((x) => x.w).concat(rec).slice(0, Math.max(0, pool.length - n));
    return out;
  }

  /* ---------- similar-looking syllables (distractors) ---------- */

  const VSWAP = { a: ['o', 'e', 'u'], e: ['a', 'i', 'o'], i: ['e', 'a', 'u'], o: ['a', 'u', 'e'], u: ['o', 'a', 'i'], ä: ['a', 'e'], ö: ['o', 'e'], ü: ['u', 'i'] };
  const CSWAP = { m: ['n', 'w'], n: ['m', 'h'], w: ['m', 'v'], b: ['d', 'p'], d: ['b', 'p'], p: ['b', 'd'], t: ['f', 'l'], f: ['t', 'l'], l: ['t', 'f'], h: ['n', 'k'], k: ['h', 't'], r: ['n', 'm'], s: ['z', 'r'], z: ['s', 't'], g: ['k', 'd'], j: ['l', 'g'], v: ['w', 'f'] };
  const VOWEL = /[aeiouäöüy]/;
  const matchCase = (ch, ref) => (ref === ref.toLocaleUpperCase('de-CH') ? ch.toLocaleUpperCase('de-CH') : ch);

  function syllableVariants(s) {
    const out = [];
    const low = lc(s);
    const groups = low.match(/[aeiouäöüy]+/g) || [];
    if (groups.length === 1 && groups[0].length === 1 && VSWAP[groups[0]]) {
      const i = low.indexOf(groups[0]);
      VSWAP[groups[0]].forEach((v) => out.push(s.slice(0, i) + matchCase(v, s[i]) + s.slice(i + 1)));
    }
    if (CSWAP[low[0]] && low.length > 1 && VOWEL.test(low[1])) {
      CSWAP[low[0]].forEach((c) => out.push(matchCase(c, s[0]) + s.slice(1)));
    }
    return out;
  }

  // One syllable that looks like a syllable of the word but is not one of them.
  function puzzleDistractor(parts) {
    const own = parts.map(lc);
    const order = FK.shuffle(parts.map((_, i) => i));
    for (let k = 0; k < order.length; k++) {
      const cands = FK.shuffle(syllableVariants(parts[order[k]])).filter((v) => own.indexOf(lc(v)) < 0);
      if (cands.length) return cands[0];
    }
    const rows = data().syllables;
    const all = [].concat.apply([], Object.keys(rows).map((k) => rows[k])).filter((v) => own.indexOf(lc(v)) < 0);
    return FK.pick(all) || 'Mo';
  }

  // Other words for «Wort und Bild»: one that looks alike (same start or end), one at random.
  // Pictures that would also be right (a Tanne is a Baum) never stand next to each other.
  function nearPics(e) {
    const groups = (FK.words && FK.words.near) || [];
    return [].concat.apply([e], groups.filter((g) => g.indexOf(e) >= 0));
  }

  function distractorWords(w, k) {
    const near = nearPics(w.e);
    const L = data().list.filter((x) => x.w !== w.w && near.indexOf(x.e) < 0);
    const tw = lc(plain(w.w));
    const tp = lc(w.w).split('-');
    const scored = L.map((x) => {
      const xw = lc(plain(x.w));
      const xp = lc(x.w).split('-');
      let s = Math.random() * 1.5;
      if (xw[0] === tw[0]) s += 2;
      if (xp[xp.length - 1] === tp[tp.length - 1]) s += 3;
      if (xp.length === tp.length) s += 1;
      if (Math.abs(xw.length - tw.length) <= 1) s += 1;
      if (x.lvl === w.lvl) s += 1.5;
      return { x, s };
    }).sort((a, b) => b.s - a.s);
    const out = [];
    if (scored.length) out.push(scored[0].x);
    const clash = (x) => out.some((o) => nearPics(o.e).indexOf(x.e) >= 0);
    const rest = FK.shuffle(L.filter((x) => out.indexOf(x) < 0 && !clash(x)));
    const same = rest.filter((x) => x.lvl === w.lvl);
    while (out.length < k && (same.length || rest.length)) {
      const x = same.length ? same.shift() : rest.shift();
      if (out.indexOf(x) < 0 && !clash(x)) out.push(x);
    }
    return out;
  }

  /* ---------- shared pieces ---------- */

  function makeSteps(n) {
    const el = h('div', { class: 'rd-steps', 'aria-hidden': 'true' });
    const dots = [];
    for (let i = 0; i < n; i++) {
      const d = h('span', { class: 'rd-step', html: FK.icon('star', 'ic') });
      dots.push(d);
      el.append(d);
    }
    return {
      el,
      cur(i) { dots.forEach((d, k) => d.classList.toggle('cur', k === i)); },
      done(i) {
        const d = dots[i];
        if (!d) return;
        d.classList.remove('cur');
        d.classList.add('done');
        const c = centre(d);
        FK.fx.twinkle(c[0], c[1], '#ffffff');
      },
    };
  }

  function balloonSvg(color, cls) {
    return '<svg class="' + (cls || 'rd-b-svg') + '" viewBox="0 0 100 150" aria-hidden="true">' +
      '<path class="rd-b-str" d="M50 110 C41 119 59 127 49 136 C43 142 53 146 50 150" fill="none" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M50 4 C76 4 94 25 94 52 C94 79 73 99 55 104 L45 104 C27 99 6 79 6 52 C6 25 24 4 50 4 Z" fill="' + color + '" stroke="' + INK + '" stroke-width="4.5"/>' +
      '<path d="M42 113 L50 101 L58 113 Z" fill="' + color + '" stroke="' + INK + '" stroke-width="3.5" stroke-linejoin="round"/>' +
      '<ellipse cx="29" cy="33" rx="7" ry="14" transform="rotate(28 29 33)" fill="#fff" opacity=".7"/>' +
      '</svg>';
  }

  // Overlay at the end of a round: Klecksi cheers, then «Nochmal», «Weiter» or «Fertig».
  // n: stars this round earned (1 the first time, 0 on a replay); the panel never shows more than the counter got
  function donePanel(actions, n) {
    const row = h('div', { class: 'rd-done-actions' });
    actions.forEach((a) => row.append(FK.ui.btn({ icon: a.icon, emoji: a.emoji, label: a.label, cls: 'btn-big ' + (a.cls || ''), onClick: a.onClick })));
    const card = h('div', { class: 'rd-done-card' },
      FK.ui.mascot({ mood: 'cheer', cls: 'rd-done-mascot' }),
      n > 0 ? h('div', { class: 'rd-done-stars', html: starsHtml(n) }) : null,
      row);
    const wrap = h('div', { class: 'rd-done' }, card);
    stage.append(wrap);
    const go = row.querySelector('.btn-go') || row.querySelector('.btn-sun') || row.firstChild;
    if (go) later(900, () => FK.ui.bounce(go));
    return wrap;
  }

  async function finishRound(id, fromEl, actions) {
    const t = token;
    stage.classList.add('rd-locked');
    const n = FK.progress.finish('read', id, 1);
    await FK.ui.celebrate({ stars: n, from: fromEl, big: true });
    if (t !== token) return;
    stage.classList.remove('rd-locked');
    donePanel(actions, n);
  }

  // Shrinks an element's font so it fits into maxW (and maxH if given).
  function fitFont(el, max, min, maxW, maxH) {
    el.style.fontSize = max + 'px';
    let fs = max;
    const w = el.scrollWidth;
    if (w > maxW) fs = Math.max(min, Math.floor((max * maxW) / w));
    el.style.fontSize = fs + 'px';
    if (maxH) {
      let guard = 12;
      while (guard-- > 0 && fs > min && (el.scrollHeight > maxH || el.scrollWidth > maxW)) {
        fs = Math.max(min, Math.floor(fs * 0.92));
        el.style.fontSize = fs + 'px';
      }
    }
    return fs;
  }

  /* ---------- simple SVG objects for «Lies genau» (one main colour each) ---------- */

  const ST = ' stroke="' + INK + '" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"';
  const ST3 = ' stroke="' + INK + '" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"';
  const dark = (c) => FK.color.mix(c, INK, 0.3);
  const leafOf = (id) => (id === 'gruen' || id === 'hellgruen' ? '#8bd448' : '#1f9d55');
  const eye = (x, y, r) => '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + INK + '"/><circle cx="' + (x + r * 0.35) + '" cy="' + (y - r * 0.38) + '" r="' + r * 0.38 + '" fill="#fff"/>';
  const fatLine = (d, c, w) => '<path d="' + d + '" fill="none" stroke="' + INK + '" stroke-width="' + (w + 6) + '" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="' + d + '" fill="none" stroke="' + c + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"/>';

  function starPath(cx, cy, R, r) {
    let d = '';
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const rr = i % 2 ? r : R;
      d += (i ? 'L' : 'M') + (cx + Math.cos(a) * rr).toFixed(1) + ' ' + (cy + Math.sin(a) * rr).toFixed(1) + ' ';
    }
    return d + 'Z';
  }

  const OBJ = {
    sun(c) {
      let s = '';
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4;
        s += fatLine('M' + (60 + Math.cos(a) * 41).toFixed(1) + ' ' + (60 + Math.sin(a) * 41).toFixed(1) + ' L' + (60 + Math.cos(a) * 53).toFixed(1) + ' ' + (60 + Math.sin(a) * 53).toFixed(1), c, 6);
      }
      return s + '<circle cx="60" cy="60" r="32" fill="' + c + '"' + ST + '/>' + eye(49, 56, 4) + eye(71, 56, 4) +
        '<path d="M48 68 Q60 78 72 68" fill="none"' + ST + '/>';
    },
    ball(c) {
      return '<circle cx="60" cy="62" r="44" fill="' + c + '"' + ST + '/>' +
        '<path d="M17 56 Q60 74 103 56 L102 70 Q60 90 18 70 Z" fill="#fff"' + ST3 + '/>' +
        '<ellipse cx="40" cy="38" rx="10" ry="6" transform="rotate(-32 40 38)" fill="#fff" opacity=".75"/>';
    },
    car(c) {
      return '<path d="M30 60 L40 37 Q43 31 50 31 L76 31 Q83 31 87 37 L99 60 Z" fill="' + c + '"' + ST + '/>' +
        '<path d="M45 58 L52 40 L62 40 L62 58 Z M68 58 L68 40 L79 40 L87 58 Z" fill="#bfe3ff"' + ST3 + '/>' +
        '<rect x="9" y="56" width="102" height="31" rx="14" fill="' + c + '"' + ST + '/>' +
        '<circle cx="104" cy="67" r="4" fill="#ffe14a"' + ST3 + '/>' +
        '<circle cx="34" cy="87" r="13" fill="' + INK + '"/><circle cx="34" cy="87" r="5.5" fill="#cfd6ea"/>' +
        '<circle cx="86" cy="87" r="13" fill="' + INK + '"/><circle cx="86" cy="87" r="5.5" fill="#cfd6ea"/>';
    },
    mouse(c) {
      return '<circle cx="28" cy="36" r="21" fill="' + c + '"' + ST + '/><circle cx="28" cy="36" r="11" fill="#ffb3d1"/>' +
        '<circle cx="92" cy="36" r="21" fill="' + c + '"' + ST + '/><circle cx="92" cy="36" r="11" fill="#ffb3d1"/>' +
        '<ellipse cx="60" cy="68" rx="38" ry="34" fill="' + c + '"' + ST + '/>' + eye(47, 62, 5) + eye(73, 62, 5) +
        '<path d="M40 80 L18 76 M40 87 L18 92 M80 80 L102 76 M80 87 L102 92" fill="none"' + ST3 + '/>' +
        '<circle cx="60" cy="78" r="6.5" fill="#ff6f91"' + ST3 + '/><path d="M54 88 Q60 94 66 88" fill="none"' + ST3 + '/>';
    },
    fish(c) {
      return '<path d="M84 60 L111 36 Q104 60 111 84 Z" fill="' + c + '"' + ST + '/>' +
        '<path d="M44 38 Q58 14 78 36 Z" fill="' + dark(c) + '"' + ST + '/>' +
        '<ellipse cx="56" cy="60" rx="42" ry="28" fill="' + c + '"' + ST + '/>' +
        '<path d="M44 42 Q54 60 44 78" fill="none"' + ST3 + '/>' +
        '<path d="M62 50 Q67 56 62 62 M74 48 Q79 56 74 64" fill="none" stroke="' + dark(c) + '" stroke-width="3" stroke-linecap="round"/>' +
        '<circle cx="31" cy="54" r="7" fill="#fff"' + ST3 + '/><circle cx="30" cy="54" r="3.5" fill="' + INK + '"/>' +
        '<path d="M15 66 Q19 69 23 66" fill="none"' + ST3 + '/>';
    },
    heart(c) {
      return '<path d="M60 104 C20 78 8 54 14 38 C20 20 46 16 60 38 C74 16 100 20 106 38 C112 54 100 78 60 104 Z" fill="' + c + '"' + ST + '/>' +
        '<ellipse cx="32" cy="42" rx="7" ry="11" transform="rotate(-30 32 42)" fill="#fff" opacity=".7"/>';
    },
    tree(c) {
      const C = [[60, 34, 24], [36, 54, 22], [84, 54, 22], [60, 64, 24], [42, 34, 16], [78, 34, 16]];
      return '<path d="M51 112 L54 66 L66 66 L69 112 Z" fill="#8b5a2b"' + ST + '/>' +
        C.map((k) => '<circle cx="' + k[0] + '" cy="' + k[1] + '" r="' + k[2] + '" fill="' + INK + '" stroke="' + INK + '" stroke-width="8"/>').join('') +
        C.map((k) => '<circle cx="' + k[0] + '" cy="' + k[1] + '" r="' + k[2] + '" fill="' + c + '"/>').join('') +
        '<ellipse cx="44" cy="30" rx="6" ry="9" transform="rotate(-30 44 30)" fill="#fff" opacity=".45"/>';
    },
    flower(c, id) {
      let s = fatLine('M60 70 Q57 92 60 114', leafOf(id), 5) + '<path d="M60 98 Q76 84 90 90 Q78 104 60 98 Z" fill="' + leafOf(id) + '"' + ST3 + '/>';
      for (let i = 0; i < 5; i++) {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
        s += '<circle cx="' + (60 + Math.cos(a) * 23).toFixed(1) + '" cy="' + (46 + Math.sin(a) * 23).toFixed(1) + '" r="19" fill="' + c + '"' + ST + '/>';
      }
      return s + '<circle cx="60" cy="46" r="13" fill="' + (id === 'gelb' || id === 'orange' ? '#ffffff' : '#ffd60a') + '"' + ST + '/>';
    },
    hat(c) {
      return '<ellipse cx="60" cy="80" rx="52" ry="17" fill="' + c + '"' + ST + '/>' +
        '<path d="M30 80 Q28 32 60 32 Q92 32 90 80 Z" fill="' + c + '"' + ST + '/>' +
        '<path d="M30 64 Q60 73 90 64 L90 77 Q60 86 30 77 Z" fill="#fff"' + ST3 + '/>' +
        '<circle cx="78" cy="70" r="6" fill="#ff4fa3"' + ST3 + '/>' +
        '<ellipse cx="44" cy="46" rx="5" ry="9" transform="rotate(20 44 46)" fill="#fff" opacity=".5"/>';
    },
    house(c) {
      return '<rect x="80" y="20" width="12" height="26" fill="' + dark(c) + '"' + ST + '/>' +
        '<rect x="22" y="52" width="76" height="58" fill="' + c + '"' + ST + '/>' +
        '<path d="M10 58 L60 14 L110 58 Z" fill="' + dark(c) + '"' + ST + '/>' +
        '<rect x="51" y="76" width="20" height="34" rx="3" fill="#f3c891"' + ST3 + '/>' +
        '<rect x="29" y="66" width="16" height="16" fill="#bfe3ff"' + ST3 + '/><path d="M37 66 V82 M29 74 H45" stroke="' + INK + '" stroke-width="2.5"/>' +
        '<rect x="77" y="66" width="16" height="16" fill="#bfe3ff"' + ST3 + '/><path d="M85 66 V82 M77 74 H93" stroke="' + INK + '" stroke-width="2.5"/>';
    },
    star(c) {
      return '<path d="' + starPath(60, 63, 54, 24) + '" fill="' + c + '"' + ST + ' stroke-width="4.5"/>' + eye(51, 62, 4) + eye(69, 62, 4) +
        '<path d="M53 73 Q60 79 67 73" fill="none"' + ST3 + '/>';
    },
    cow(c) {
      return '<path d="M24 58 Q10 66 15 84" fill="none"' + ST + '/>' +
        [30, 44, 66, 80].map((x) => '<rect x="' + x + '" y="74" width="11" height="32" rx="4" fill="' + c + '"' + ST + '/>').join('') +
        '<rect x="20" y="42" width="76" height="44" rx="20" fill="' + c + '"' + ST + '/>' +
        '<ellipse cx="42" cy="56" rx="11" ry="8" fill="#fff"/><ellipse cx="70" cy="70" rx="9" ry="7" fill="#fff"/>' +
        '<ellipse cx="58" cy="88" rx="8" ry="5" fill="#ffb3d1"' + ST3 + '/>' +
        '<path d="M88 30 L82 18 L94 26 Z M110 30 L116 18 L104 26 Z" fill="#f3c891"' + ST3 + '/>' +
        '<ellipse cx="82" cy="36" rx="8" ry="5" fill="' + c + '"' + ST3 + '/><ellipse cx="116" cy="36" rx="7" ry="5" fill="' + c + '"' + ST3 + '/>' +
        '<ellipse cx="99" cy="44" rx="17" ry="19" fill="' + c + '"' + ST + '/>' +
        eye(92, 40, 3.5) + eye(106, 40, 3.5) +
        '<ellipse cx="99" cy="57" rx="13" ry="9" fill="#ffb3d1"' + ST3 + '/><circle cx="94" cy="57" r="2" fill="' + INK + '"/><circle cx="104" cy="57" r="2" fill="' + INK + '"/>';
    },
    velo(c) {
      return '<circle cx="28" cy="80" r="23" fill="#fff" stroke="' + INK + '" stroke-width="5"/><circle cx="28" cy="80" r="4" fill="' + INK + '"/>' +
        '<circle cx="92" cy="80" r="23" fill="#fff" stroke="' + INK + '" stroke-width="5"/><circle cx="92" cy="80" r="4" fill="' + INK + '"/>' +
        fatLine('M28 80 L56 80 L84 48 L48 48 Z M56 80 L46 40 M84 48 L92 80 M84 48 L81 36', c, 6) +
        '<path d="M37 38 L56 38" stroke="' + INK + '" stroke-width="8" stroke-linecap="round"/>' +
        '<path d="M74 34 L90 34" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/>' +
        '<circle cx="56" cy="80" r="6" fill="' + INK + '"/>';
    },
    balloon(c) {
      return '<g transform="translate(22 2) scale(.76)">' + balloonSvg(c, 'x').replace(/^<svg[^>]*>/, '').replace('</svg>', '') + '</g>';
    },
    glace(c) {
      return '<path d="M36 58 L60 114 L84 58 Z" fill="#f3c891"' + ST + '/>' +
        '<path d="M45 66 L68 92 M60 62 L76 80 M75 64 L52 92 M60 62 L44 78" stroke="#c98a4a" stroke-width="3" stroke-linecap="round"/>' +
        '<path d="M28 60 Q20 30 60 20 Q100 30 92 60 Q84 68 74 60 Q66 70 58 60 Q48 70 40 60 Q34 66 28 60 Z" fill="' + c + '"' + ST + '/>' +
        '<path d="M48 36 L52 32 M66 30 L70 34 M76 44 L80 40 M56 46 L60 48" stroke="' + dark(c) + '" stroke-width="3.5" stroke-linecap="round"/>' +
        '<circle cx="60" cy="16" r="7" fill="#e5322d"' + ST3 + '/>';
    },
    boat(c) {
      return '<path d="M4 104 Q18 97 32 104 T60 104 T88 104 T116 104" fill="none" stroke="#5bc0ff" stroke-width="5" stroke-linecap="round"/>' +
        '<path d="M60 12 L60 84" stroke="' + INK + '" stroke-width="5" stroke-linecap="round"/>' +
        '<path d="M66 18 L66 76 L104 76 Z" fill="#fff"' + ST + '/><path d="M54 28 L54 76 L24 76 Z" fill="#fff"' + ST + '/>' +
        '<path d="M60 10 L78 16 L60 22 Z" fill="' + c + '"' + ST3 + '/>' +
        '<path d="M12 80 L108 80 Q102 100 86 102 L34 102 Q18 100 12 80 Z" fill="' + c + '"' + ST + '/>';
    },
    apple(c, id) {
      return fatLine('M60 38 Q58 24 64 14', '#8b5a2b', 4) +
        '<path d="M60 38 C46 26 18 30 18 62 C18 92 42 112 60 103 C78 112 102 92 102 62 C102 30 74 26 60 38 Z" fill="' + c + '"' + ST + '/>' +
        '<path d="M65 24 Q80 8 94 18 Q82 34 65 24 Z" fill="' + leafOf(id) + '"' + ST3 + '/>' +
        '<ellipse cx="36" cy="58" rx="6" ry="12" transform="rotate(18 36 58)" fill="#fff" opacity=".6"/>';
    },
    banana(c) {
      return '<path d="M24 26 Q14 82 70 98 Q96 104 108 88 Q96 90 82 86 Q44 74 38 26 Z" fill="' + c + '"' + ST + '/>' +
        '<path d="M31 36 Q32 76 80 92" fill="none" stroke="' + dark(c) + '" stroke-width="3" stroke-linecap="round"/>' +
        '<path d="M23 28 L25 14 L38 18 L38 28 Z" fill="#8b5a2b"' + ST3 + '/>' +
        '<circle cx="108" cy="88" r="4" fill="#8b5a2b"' + ST3 + '/>';
    },
    carrot(c, id) {
      const L = leafOf(id);
      return '<path d="M58 30 Q46 6 34 10 Q42 22 52 34 Z" fill="' + L + '"' + ST3 + '/><path d="M62 30 Q74 6 86 10 Q78 22 68 34 Z" fill="' + L + '"' + ST3 + '/>' +
        '<path d="M60 32 Q58 8 64 4 Q68 16 62 34 Z" fill="' + L + '"' + ST3 + '/>' +
        '<path d="M40 34 Q60 24 80 34 Q76 72 60 114 Q44 72 40 34 Z" fill="' + c + '"' + ST + '/>' +
        '<path d="M47 50 L56 50 M64 64 L73 64 M51 80 L59 80 M63 94 L68 94" stroke="' + dark(c) + '" stroke-width="3.5" stroke-linecap="round"/>';
    },
    mushroom(c) {
      return '<path d="M46 62 Q40 96 47 110 L73 110 Q80 96 74 62 Z" fill="#fff4e0"' + ST + '/>' + eye(53, 82, 3.5) + eye(67, 82, 3.5) +
        '<path d="M10 66 Q12 16 60 14 Q108 16 110 66 Q60 78 10 66 Z" fill="' + c + '"' + ST + '/>' +
        '<circle cx="34" cy="44" r="8" fill="#fff"/><circle cx="62" cy="30" r="7" fill="#fff"/><circle cx="86" cy="48" r="8.5" fill="#fff"/><circle cx="58" cy="56" r="5.5" fill="#fff"/>';
    },
    grape(c, id) {
      const B = [[44, 40], [60, 37], [76, 40], [36, 58], [52, 58], [68, 58], [84, 58], [44, 76], [60, 76], [76, 76], [52, 93], [68, 93], [60, 108]];
      return fatLine('M60 30 Q62 16 70 8', '#8b5a2b', 4) +
        '<path d="M63 22 Q80 6 96 16 Q84 32 63 22 Z" fill="' + leafOf(id) + '"' + ST3 + '/>' +
        B.map((p) => '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="11" fill="' + c + '"' + ST3 + '/><circle cx="' + (p[0] - 4) + '" cy="' + (p[1] - 4) + '" r="2.6" fill="#fff" opacity=".7"/>').join('');
    },
  };
  const OBJ_BY_EMOJI = {
    '☀': 'sun', '⚽': 'ball', '🚗': 'car', '🐭': 'mouse', '🐟': 'fish', '❤': 'heart', '🌳': 'tree', '🌸': 'flower',
    '👒': 'hat', '🏠': 'house', '⭐': 'star', '🐄': 'cow', '🚲': 'velo', '🎈': 'balloon', '🍦': 'glace', '⛵': 'boat',
    '🍎': 'apple', '🍌': 'banana', '🥕': 'carrot', '🍄': 'mushroom', '🍇': 'grape',
  };
  const objKey = (emoji) => OBJ_BY_EMOJI[String(emoji || '').replace(/️/g, '')] || null;
  const GENAU_COLORS = ['rot', 'orange', 'gelb', 'gruen', 'blau', 'violett', 'rosa', 'braun', 'grau'];

  function objSvg(key, colorId, emoji) {
    const col = FK.color.byId(colorId) || FK.color.byId('rot');
    if (!key || !OBJ[key]) {
      // unknown object: the emoji on a paint splash of the colour
      return '<svg class="rd-obj" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="48" fill="' + col.hex + '"' + ST + '/>' +
        '<text x="60" y="78" text-anchor="middle" font-size="52">' + (emoji || '') + '</text></svg>';
    }
    return '<svg class="rd-obj" viewBox="0 0 120 120" aria-hidden="true">' + OBJ[key](col.hex, col.id) + '</svg>';
  }

  // Syllables for the words of a sentence (Silbenbögen like in the reading books).
  const HYPH = {
    Sonne: 'Son-ne', Banane: 'Ba-na-ne', Blume: 'Blu-me', Velo: 'Ve-lo', Ballon: 'Bal-lon', Glace: 'Gla-ce', Apfel: 'Ap-fel',
    Rüebli: 'Rüeb-li', Traube: 'Trau-be', Auto: 'Au-to', orange: 'o-ran-ge', rosa: 'ro-sa', violett: 'vi-o-lett',
    Tomate: 'To-ma-te', Rakete: 'Ra-ke-te', Katze: 'Kat-ze', Melone: 'Me-lo-ne',
  };
  function hyphenate(word) {
    if (HYPH[word]) return HYPH[word];
    const hit = data().list.find((x) => plain(x.w) === word);
    return hit ? hit.w : word;
  }
  function sentenceEl(text) {
    const box = h('div', { class: 'rd-sent', 'aria-label': FK.text.word(text) });
    text.split(/\s+/).forEach((w) => {
      const m = w.match(/^(.*?)([.,!?:]*)$/);
      const wrap = h('span', { class: 'rd-sent-w' }, FK.ui.word(hyphenate(m[1])));
      if (m[2]) wrap.append(h('span', { class: 'rd-punct', text: m[2] }));
      box.append(wrap);
    });
    return box;
  }

  /* =====================================================================
     Lesen home
     ===================================================================== */

  const SAMPLE = { 1: 'Ma-mi', 2: 'Ba-na-ne', 3: 'Son-ne' };
  function sampleWord(n) {
    const L = data().list;
    if (L.some((x) => x.w === SAMPLE[n])) return SAMPLE[n];
    const f = L.find((x) => x.lvl === n);
    return f ? f.w : SAMPLE[n];
  }

  function artPuzzle() {
    const parts = ['Ba', 'na', 'ne'];
    return h('div', { class: 'rd-art rd-art-puzzle' },
      h('span', { class: 'rd-art-pic emoji', text: '🍌' }),
      h('span', { class: 'rd-art-row' }, parts.map((p, i) => h('span', { class: 'rd-art-chip' + (i === 2 ? ' fly' : ''), style: { '--c': PASTELS[i] }, text: FK.text.word(p) }))));
  }
  function artWort() {
    const cards = ['🐰', '👖', '🌹'].map((e, i) => {
      const c = h('span', { class: 'rd-art-card emoji' + (i === 0 ? ' ok' : ''), text: e });
      if (i === 0) c.insertAdjacentHTML('beforeend', FK.icon('star', 'ic'));
      return c;
    });
    return h('div', { class: 'rd-art rd-art-wort' }, h('span', { class: 'rd-art-paper' }, FK.ui.word('Ha-se')), h('span', { class: 'rd-art-row' }, cards));
  }
  function artBall() {
    const d = h('div', { class: 'rd-art rd-art-ball' });
    ['Ma', 'Mo', 'Mu'].forEach((s, i) => {
      d.append(h('span', { class: 'rd-art-balloon b' + i, html: balloonSvg(BALLOON_COLORS[[0, 2, 3][i]]) }, h('b', { text: FK.text.syllable(s) })));
    });
    return d;
  }
  function artGenau() {
    const d = h('div', { class: 'rd-art rd-art-genau' });
    d.append(h('span', { class: 'rd-art-paper' }, FK.ui.word('rot')));
    const row = h('span', { class: 'rd-art-row' });
    ['blau', 'rot', 'gelb'].forEach((c, i) => {
      const s = h('span', { class: 'rd-art-obj' + (i === 1 ? ' ok' : ''), html: objSvg('ball', c) });
      if (i === 1) s.insertAdjacentHTML('beforeend', FK.icon('star', 'ic'));
      row.append(s);
    });
    d.append(row);
    return d;
  }

  function tileBadge(id) {
    if (id === 'puzzle' || id === 'wort') {
      let s = '';
      for (let n = 1; n <= 3; n++) s += FK.icon(FK.progress.isDone('read', id + '-' + n) ? 'star' : 'star-empty', 'ic');
      return s;
    }
    if (id === 'ballone') {
      const rows = Object.keys(data().syllables);
      const n = rows.filter((k) => FK.progress.isDone('read', 'ballone-' + k)).length;
      return FK.icon(n ? 'star' : 'star-empty', 'ic') + (n ? '<b>' + n + '</b>' : '');
    }
    return FK.icon(FK.progress.isDone('read', id) ? 'star' : 'star-empty', 'ic');
  }

  const GAMES = [
    { id: 'puzzle', title: 'Silben-Puzzle', cls: 'rd-t-sun', art: artPuzzle, start: () => startPuzzle() },
    { id: 'wort', title: 'Wort und Bild', cls: 'rd-t-mint', art: artWort, start: () => startWort() },
    { id: 'ballone', title: 'Silben-Ballone', cls: 'rd-t-sky', art: artBall, start: () => showBallPick() },
    { id: 'genau', title: 'Lies genau', cls: 'rd-t-lilac', art: artGenau, start: () => startGenau() },
  ];

  function showHome() {
    setView('home', 'Lesen');
    const lvl = getLvl();
    const lvBtns = [1, 2, 3].map((n) => {
      const b = h('button', {
        type: 'button',
        class: 'rd-lvl' + (n === lvl ? ' on' : ''),
        role: 'radio',
        'aria-checked': n === lvl ? 'true' : 'false',
        'aria-label': 'Stufe ' + n,
        onclick: () => {
          if (getLvl() === n) { FK.ui.bounce(b); return; }
          setLvl(n);
          FK.sound.plip(n * 3);
          lvBtns.forEach((x, i) => {
            x.classList.toggle('on', i + 1 === n);
            x.setAttribute('aria-checked', i + 1 === n ? 'true' : 'false');
          });
          FK.ui.bounce(b);
          const c = centre(b);
          FK.fx.burst(c[0], c[1], ['#ffc93c', '#ffffff'], 8);
        },
      },
      h('span', { class: 'rd-lvl-stars', html: starsHtml(n) }),
      FK.ui.word(sampleWord(n), { cls: 'rd-lvl-word' }));
      return b;
    });
    const levels = h('div', { class: 'rd-levels', role: 'radiogroup', 'aria-label': 'Stufe' },
      h('span', { class: 'rd-lv-label', text: 'Stufe' }), lvBtns);

    const tiles = GAMES.map((g, i) => h('button', {
      type: 'button',
      class: 'rd-tile ' + g.cls,
      'aria-label': g.title,
      style: { animationDelay: i * 70 + 'ms' },
      onclick: () => { FK.sound.open(); g.start(); },
    },
    h('span', { class: 'rd-tile-badge', 'aria-hidden': 'true', html: tileBadge(g.id) }),
    h('span', { class: 'rd-tile-art', 'aria-hidden': 'true' }, g.art()),
    h('span', { class: 'rd-tile-title', text: g.title })));

    stage.append(h('div', { class: 'rd-home scroll' }, levels, h('div', { class: 'rd-tiles' }, tiles)));
  }

  /* =====================================================================
     a) Silben-Puzzle
     ===================================================================== */

  function startPuzzle(lvlArg) {
    const lvl = lvlArg || getLvl();
    setView('puzzle', 'Silben-Puzzle');
    const words = pickWords(lvl, N_PUZZLE, (x) => x.w.split('-').length >= 2, 'puzzle');
    const st = makeSteps(words.length);
    const emo = h('span', { class: 'emoji rd-pz-emoji' });
    const pic = h('div', { class: 'rd-pic' }, emo);
    const slotsEl = h('div', { class: 'rd-slots' });
    const paper = h('div', { class: 'rd-paper rd-pz-paper' }, slotsEl);
    const tilesEl = h('div', { class: 'rd-chips' });
    const board = h('div', { class: 'rd-pz-board' }, paper, tilesEl);
    const main = h('div', { class: 'rd-pz-main' }, pic, board);
    const game = h('div', { class: 'rd-game rd-puzzle' }, st.el, main);
    stage.append(game);

    let idx = -1;
    let word = null;
    let need = [];
    let filled = 0;
    let misses = 0;
    let locked = true;
    let slots = [];
    let chips = [];
    let idle = 0;
    let wordEl = null;

    function layout() {
      const W = main.clientWidth;
      const H = main.clientHeight;
      if (!W || !H) return;
      const row = W > H * 1.15;
      main.classList.toggle('rd-row', row);
      const gap = Math.round(FK.clamp(Math.min(W, H) * 0.045, 12, 40));
      main.style.setProperty('--gap', gap + 'px');
      let fs = Math.round(FK.clamp(Math.min(W * 0.11, H * (row ? 0.13 : 0.085)), 36, 80));
      const th = Math.max(72, fs * 1.6);
      const boardH = th * 2 + fs * 0.9 + 30 + gap;
      let picS = row ? Math.min(H * 0.82, W * 0.36, 360) : Math.min(W * 0.7, H - boardH - gap - 8, 340);
      picS = Math.round(Math.max(picS, 96));
      main.style.setProperty('--pic', picS + 'px');
      main.style.setProperty('--fs', fs + 'px');
      // syllable row must fit into the board
      const availW = (row ? W - picS - gap : W) - 8;
      for (let k = 0; k < 3; k++) {
        const pw = paper.scrollWidth;
        if (pw <= availW) break;
        fs = Math.max(26, Math.floor((fs * availW) / pw));
        main.style.setProperty('--fs', fs + 'px');
      }
      if (wordEl) wordEl.style.fontSize = '';
    }
    onResize = layout;
    afterFonts(layout);

    function chipFor(p, i) {
      const b = h('button', { type: 'button', class: 'rd-chip', style: { '--c': PASTELS[(i + idx) % PASTELS.length] }, 'aria-label': FK.text.word(p) },
        h('span', { class: 'rd-chip-txt', text: FK.text.word(p) }));
      b._p = p;
      b.addEventListener('click', () => tap(b));
      return b;
    }

    function armIdle() {
      cancel(idle);
      idle = later(5000, () => { hint(); armIdle(); });
    }
    function hint() {
      if (locked || filled >= need.length) return;
      const want = FK.text.word(need[filled]);
      const c = chips.find((x) => !x.classList.contains('used') && FK.text.word(x._p) === want);
      if (!c) return;
      c.classList.remove('rd-hint');
      void c.offsetWidth;
      c.classList.add('rd-hint');
    }
    function markCur() {
      slots.forEach((s, i) => s.classList.toggle('cur', i === filled));
    }

    function next() {
      idx++;
      if (idx >= words.length) return finish();
      word = words[idx];
      need = word.w.split('-');
      filled = 0;
      misses = 0;
      locked = false;
      wordEl = null;
      st.cur(idx);
      emo.textContent = word.e;
      pic.setAttribute('aria-label', FK.text.word(plain(word.w)));
      paper.classList.remove('solved');
      slotsEl.textContent = '';
      tilesEl.textContent = '';
      slots = need.map((p, i) => {
        const s = h('div', { class: 'rd-slot s' + (i % 2) }, h('span', { class: 'rd-slot-txt', text: FK.text.word(p) }));
        s.insertAdjacentHTML('beforeend', ARC);
        return s;
      });
      slots.forEach((s) => slotsEl.append(s));
      let opts = FK.shuffle(need.concat([puzzleDistractor(need)]));
      // never start in the solved order
      if (opts.slice(0, need.length).join('|') === need.join('|')) opts = opts.slice(1).concat(opts[0]);
      chips = opts.map(chipFor);
      chips.forEach((c) => tilesEl.append(c));
      markCur();
      main.classList.remove('rd-out', 'rd-in');
      void main.offsetWidth;
      main.classList.add('rd-in');
      layout();
      armIdle();
    }

    function tap(b) {
      if (locked || b.classList.contains('used')) return;
      const want = need[filled];
      if (FK.text.word(b._p) === FK.text.word(want)) {
        const slot = slots[filled];
        filled++;
        misses = 0;
        b.classList.remove('rd-hint');
        b.classList.add('used');
        FK.sound.plip(filled * 2 + 1);
        slot.style.setProperty('--c', b.style.getPropertyValue('--c'));
        fly(b, slot, () => {
          slot.classList.add('filled');
          FK.ui.bounce(slot);
          twinkleAround(slot, 4, '#ffffff');
          const c = centre(slot);
          FK.fx.ring(c[0], c[1], '#ffc93c');
        });
        markCur();
        if (filled === need.length) {
          locked = true;
          cancel(idle);
          later(460, solved);
        } else armIdle();
      } else {
        FK.sound.wrong();
        FK.ui.shake(b);
        misses++;
        if (misses >= 2) hint();
        armIdle();
      }
    }

    function fly(from, to, done) {
      const sr = stage.getBoundingClientRect();
      const a = from.getBoundingClientRect();
      const b = to.getBoundingClientRect();
      const g = h('div', { class: 'rd-chip rd-ghost', style: { '--c': from.style.getPropertyValue('--c') } }, h('span', { class: 'rd-chip-txt', text: from.textContent }));
      Object.assign(g.style, { left: a.left - sr.left + 'px', top: a.top - sr.top + 'px', width: a.width + 'px', height: a.height + 'px' });
      stage.append(g);
      const dx = b.left + b.width / 2 - (a.left + a.width / 2);
      const dy = b.top + b.height / 2 - (a.top + a.height / 2);
      const s = Math.min(b.width / a.width, b.height / a.height) || 1;
      void g.offsetWidth;
      g.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(' + s.toFixed(3) + ')';
      later(400, () => {
        g.remove();
        done();
      });
    }

    function solved() {
      FK.sound.right();
      paper.classList.add('solved');
      slotsEl.textContent = '';
      wordEl = FK.ui.word(word.w, { cls: 'rd-big-word' });
      slotsEl.append(wordEl);
      FK.ui.bounce(pic);
      burstAt(pic, ['#ffc93c', '#ff4fa3', '#5bc0ff', '#8bd448', '#ffffff'], 12);
      chips.forEach((c) => { if (!c.classList.contains('used')) c.classList.add('gone'); });
      st.done(idx);
      later(idx + 1 >= words.length ? 900 : 1500, () => {
        if (idx + 1 >= words.length) return next();
        main.classList.remove('rd-in');
        main.classList.add('rd-out');
        later(260, next);
      });
    }

    function finish() {
      st.cur(-1);
      cancel(idle);
      const actions = [{ icon: 'refresh', label: 'Nochmal', onClick: () => startPuzzle(lvl) }];
      if (lvl < 3) actions.push({ icon: 'next', label: 'Stufe ' + (lvl + 1), cls: 'btn-go', onClick: () => { setLvl(lvl + 1); startPuzzle(lvl + 1); } });
      actions.push({ icon: 'check', label: 'Fertig', cls: 'btn-sun', onClick: () => showHome() });
      finishRound('puzzle-' + lvl, st.el, actions);
    }

    next();
  }

  /* =====================================================================
     b) Wort und Bild   and   d) Lies genau  (same board: text on paper, three cards)
     ===================================================================== */

  function choiceBoard(o) {
    const st = makeSteps(o.n);
    const paper = h('div', { class: 'rd-paper rd-ch-paper' });
    const cardsEl = h('div', { class: 'rd-cards' });
    const main = h('div', { class: 'rd-ch-main' }, paper, cardsEl);
    const game = h('div', { class: 'rd-game rd-choice ' + o.cls }, st.el, main);
    stage.append(game);
    let textEl = null;
    let cards = [];

    function layout() {
      const W = main.clientWidth;
      const H = main.clientHeight;
      if (!W || !H || !textEl) return;
      const short = H < 420;
      const gap = Math.round(FK.clamp(Math.min(W, H) * 0.035, 12, 30));
      main.style.setProperty('--gap', gap + 'px');
      const maxFs = Math.round(FK.clamp(Math.min(W * (o.sentence ? 0.085 : 0.15), H * (o.sentence ? 0.11 : 0.17)), 34, o.sentence ? 84 : 124));
      const padX = 2 * (4 + Math.round(maxFs * 0.45));
      fitFont(textEl, maxFs, o.sentence ? 24 : 30, W - padX - 8, o.sentence ? H * (short ? 0.42 : 0.38) : 0);
      const ph = paper.offsetHeight;
      const availH = H - ph - gap - 10;
      let cw = Math.min((W - gap * 2) / 3, 280);
      let ch = Math.min(availH, cw * (W < H ? 1.3 : 1));
      if (ch < cw) cw = Math.max(ch, Math.min(cw, ch * 1.15));
      cw = Math.max(72, Math.floor(cw));
      ch = Math.max(72, Math.floor(ch));
      cardsEl.style.setProperty('--cw', cw + 'px');
      cardsEl.style.setProperty('--ch', ch + 'px');
    }
    onResize = layout;
    afterFonts(layout);

    return {
      st,
      setText(el) {
        paper.textContent = '';
        textEl = el;
        paper.append(el);
      },
      setCards(list, onPick) {
        cardsEl.textContent = '';
        cards = list.map((it, i) => {
          const c = h('button', { type: 'button', class: 'rd-card', style: { '--tilt': (i - 1) * 1.5 + 'deg' }, 'aria-label': 'Bild ' + (i + 1) });
          if (it.html) c.insertAdjacentHTML('beforeend', it.html);
          else c.append(h('span', { class: 'emoji rd-card-emoji', text: it.emoji }));
          c._it = it;
          c.addEventListener('click', () => onPick(c, it));
          cardsEl.append(c);
          return c;
        });
        main.classList.remove('rd-out', 'rd-in');
        void main.offsetWidth;
        main.classList.add('rd-in');
        layout();
        return cards;
      },
      right(c) {
        FK.sound.right();
        FK.ui.bounce(c);
        FK.ui.bounce(textEl);
        c.classList.add('right');
        c.insertAdjacentHTML('beforeend', FK.icon('star', 'ic rd-card-star'));
        cards.forEach((x) => { if (x !== c) x.classList.add('fade'); });
        burstAt(c, ['#ffc93c', '#ffffff', '#ff4fa3', '#8bd448'], 12);
        twinkleAround(c, 5, '#ffc93c');
      },
      wrong(c) {
        FK.sound.wrong();
        FK.ui.shake(c);
        c.classList.add('dim');
      },
      swap(fn) {
        main.classList.remove('rd-in');
        main.classList.add('rd-out');
        later(260, fn);
      },
    };
  }

  function startWort(lvlArg) {
    const lvl = lvlArg || getLvl();
    setView('wort', 'Wort und Bild');
    const words = pickWords(lvl, N_WORT, null, 'wort');
    const B = choiceBoard({ n: words.length, cls: 'rd-wort' });
    let idx = -1;
    let locked = false;

    function next() {
      idx++;
      if (idx >= words.length) return finish();
      const w = words[idx];
      locked = false;
      B.st.cur(idx);
      B.setText(FK.ui.word(w.w, { cls: 'rd-big-word' }));
      const opts = FK.shuffle([w].concat(distractorWords(w, 2)));
      B.setCards(opts.map((x) => ({ emoji: x.e, ok: x === w })), (c, it) => {
        if (locked || c.classList.contains('dim')) return;
        if (it.ok) {
          locked = true;
          B.right(c);
          B.st.done(idx);
          later(idx + 1 >= words.length ? 900 : 1400, () => (idx + 1 >= words.length ? next() : B.swap(next)));
        } else B.wrong(c);
      });
    }

    function finish() {
      B.st.cur(-1);
      const actions = [{ icon: 'refresh', label: 'Nochmal', onClick: () => startWort(lvl) }];
      if (lvl < 3) actions.push({ icon: 'next', label: 'Stufe ' + (lvl + 1), cls: 'btn-go', onClick: () => { setLvl(lvl + 1); startWort(lvl + 1); } });
      actions.push({ icon: 'check', label: 'Fertig', cls: 'btn-sun', onClick: () => showHome() });
      finishRound('wort-' + lvl, B.st.el, actions);
    }

    next();
  }

  function startGenau() {
    setView('genau', 'Lies genau');
    let pool = data().phrases.filter((p) => p.check && objKey(p.check.emoji) && FK.color.byId(p.check.color));
    if (pool.length < 3) pool = data().phrases.filter((p) => p.check && FK.color.byId(p.check.color));
    const rec = recent.genau || [];
    const list = FK.shuffle(pool.filter((p) => rec.indexOf(p.t) < 0)).concat(FK.shuffle(pool.filter((p) => rec.indexOf(p.t) >= 0))).slice(0, N_GENAU);
    recent.genau = list.map((p) => p.t).concat(rec).slice(0, Math.max(0, pool.length - N_GENAU));
    // every second sentence also shows another thing in the right colour: read the noun AND the colour
    const mixFlags = FK.shuffle(list.map((_, i) => i % 2 === 1));
    const B = choiceBoard({ n: list.length, cls: 'rd-genau', sentence: true });
    let idx = -1;
    let locked = false;

    function next() {
      idx++;
      if (idx >= list.length) return finish();
      const p = list[idx];
      locked = false;
      B.st.cur(idx);
      B.setText(sentenceEl(p.t));
      const key = objKey(p.check.emoji);
      const right = p.check.color;
      const palette = GENAU_COLORS.indexOf(right) >= 0 ? GENAU_COLORS : GENAU_COLORS.concat([right]);
      const others = FK.shuffle(palette.filter((c) => c !== right));
      const items = [{ key, color: right, ok: true }, { key, color: others[0] }];
      const otherObj = FK.shuffle(pool.map((x) => objKey(x.check.emoji)).filter((k) => k && k !== key))[0];
      if (mixFlags[idx] && otherObj) items.push({ key: otherObj, color: right });
      else items.push({ key, color: others[1] });
      B.setCards(FK.shuffle(items).map((it) => ({ html: objSvg(it.key, it.color, p.check.emoji), ok: !!it.ok })), (c, it) => {
        if (locked || c.classList.contains('dim')) return;
        if (it.ok) {
          locked = true;
          B.right(c);
          B.st.done(idx);
          later(idx + 1 >= list.length ? 900 : 1500, () => (idx + 1 >= list.length ? next() : B.swap(next)));
        } else B.wrong(c);
      });
    }

    function finish() {
      B.st.cur(-1);
      finishRound('genau', B.st.el, [
        { icon: 'refresh', label: 'Nochmal', onClick: () => startGenau() },
        { icon: 'check', label: 'Fertig', cls: 'btn-sun', onClick: () => showHome() },
      ]);
    }

    next();
  }

  /* =====================================================================
     c) Silben-Ballone
     ===================================================================== */

  function showBallPick() {
    setView('ballpick', 'Silben-Ballone');
    const rows = data().syllables;
    const keys = Object.keys(rows);
    const grid = h('div', { class: 'rd-letters' });
    keys.forEach((k, i) => {
      const b = h('button', {
        type: 'button',
        class: 'rd-letter',
        'aria-label': k,
        style: { animationDelay: i * 22 + 'ms' },
        onclick: () => { FK.sound.open(); startBall(k); },
        html: balloonSvg(BALLOON_COLORS[i % BALLOON_COLORS.length], 'rd-letter-b'),
      },
      h('span', { class: 'rd-letter-big', text: FK.text.syllable(k) }),
      h('span', { class: 'rd-letter-sub', text: rows[k].slice(0, 3).map((s) => FK.text.syllable(s)).join(' ') }));
      if (FK.progress.isDone('read', 'ballone-' + k)) b.insertAdjacentHTML('beforeend', FK.icon('star', 'ic rd-letter-star'));
      grid.append(b);
    });
    grid.append(h('button', {
      type: 'button',
      class: 'rd-letter rd-letter-rnd',
      'aria-label': 'Zufall',
      style: { animationDelay: keys.length * 22 + 'ms' },
      onclick: () => {
        FK.sound.open();
        const open = keys.filter((k) => !FK.progress.isDone('read', 'ballone-' + k));
        startBall(FK.pick(open.length ? open : keys));
      },
    }, h('span', { class: 'emoji rd-letter-dice', text: '🎲' }), h('span', { class: 'rd-letter-sub', text: 'Zufall' })));
    stage.append(h('div', { class: 'rd-pick scroll' }, grid));
  }

  function balloonPool(target, row) {
    const pool = [];
    row.forEach((s) => { if (lc(s) !== lc(target)) pool.push(s, s); });
    const t = lc(target);
    if (t.length === 2 && VOWEL.test(t[1]) && !VOWEL.test(t[0])) pool.push(t[1] + t[0]);
    (CSWAP[t[0]] || []).forEach((c) => pool.push(c.toLocaleUpperCase('de-CH') + t.slice(1)));
    return pool;
  }

  function startBall(rowKey) {
    const rows = data().syllables;
    const row = rows[rowKey] ? rowKey : Object.keys(rows)[0];
    const t = setView('ballone', 'Silben-Ballone');
    const sylls = rows[row];
    const targets = FK.shuffle(sylls).slice(0, 4);
    const B = {
      list: [], W: 0, H: 0, S: 100, lanes: 3, dur: 9, spawnIn: 0.5, popped: 0, tIdx: 0, target: targets[0],
      last: performance.now(), sinceHit: 0, ending: false, lastLane: -1, lastSyl: '', colorI: (Math.random() * 7) | 0, glow: false, force: false,
    };

    const signTxt = h('span', { class: 'rd-sign-txt', text: FK.text.syllable(B.target) });
    const sign = h('div', { class: 'rd-sign', html: balloonSvg('#ffc93c', 'rd-sign-b') }, signTxt);
    const count = h('div', { class: 'rd-count', 'aria-hidden': 'true' });
    const cnt = [];
    for (let i = 0; i < N_POPS; i++) {
      const c = h('span', { class: 'rd-cnt', html: balloonSvg('#ffffff', 'rd-cnt-b') });
      cnt.push(c);
      count.append(c);
    }
    const field = h('div', { class: 'rd-field' });
    const game = h('div', { class: 'rd-game rd-ball' }, h('div', { class: 'rd-ball-head' }, sign, count), field);
    stage.append(game);

    function measure() {
      B.W = field.clientWidth;
      B.H = field.clientHeight;
      B.S = Math.round(FK.clamp(Math.min(B.W / 4.2, B.H / 2.4), 88, 150));
      B.lanes = FK.clamp(Math.floor(B.W / (B.S * 1.22)), 3, 6);
      B.dur = FK.clamp(B.H / 60, 7, 13);
      field.style.setProperty('--S', B.S + 'px');
    }
    measure();
    onResize = measure;

    const same = (a, b) => lc(a) === lc(b);

    function spawn(p0, forceTarget) {
      const busy = [];
      B.list.forEach((b) => {
        if (!b.away && b.p < 0.4) busy[Math.floor(b.lx * B.lanes)] = true;
      });
      const live = B.list.filter((b) => !b.away);
      if (live.length >= B.lanes + 1) return false;
      let free = [];
      for (let i = 0; i < B.lanes; i++) if (!busy[i] && i !== B.lastLane) free.push(i);
      if (!free.length) for (let i = 0; i < B.lanes; i++) if (!busy[i]) free.push(i);
      if (!free.length) return false;
      const lane = FK.pick(free);
      B.lastLane = lane;
      const hasTarget = live.some((b) => same(b.syl, B.target) && b.p < 0.7);
      const isT = forceTarget || B.force || !hasTarget || Math.random() < 0.34;
      B.force = false;
      let syl = B.target;
      if (!isT) {
        const pool = balloonPool(B.target, sylls).filter((s) => !same(s, B.lastSyl));
        syl = FK.pick(pool.length ? pool : balloonPool(B.target, sylls));
      }
      B.lastSyl = syl;
      B.colorI = (B.colorI + 1 + ((Math.random() * 2) | 0)) % BALLOON_COLORS.length;
      const color = BALLOON_COLORS[B.colorI];
      const hit = h('div', { class: 'rd-b-hit' });
      const el = h('div', { class: 'rd-balloon' + (same(syl, B.target) ? ' is-t' : '') },
        h('div', { class: 'rd-b-in', html: balloonSvg(color) }, h('span', { class: 'rd-b-syl', text: FK.text.syllable(syl) })),
        hit);
      const b = {
        el, syl, color, lx: (lane + 0.5 + FK.rnd(-0.12, 0.12)) / B.lanes, p: p0 || 0, t: FK.rnd(0, 6), f: FK.rnd(0.9, 1.35),
        ph: FK.rnd(0, 6.28), k: FK.rnd(0.9, 1.1), dx: 0, vx: 0, away: false, x: 0, y: 0,
      };
      hit.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        tapBalloon(b);
      });
      place(b);
      field.append(el);
      B.list.push(b);
      return true;
    }

    function place(b) {
      const S = B.S;
      const y = B.H - b.p * (B.H + S * 1.55);
      let x = b.lx * B.W - S / 2 + Math.sin(b.t * b.f + b.ph) * S * 0.12 + b.dx;
      if (!b.away) x = FK.clamp(x, 2, Math.max(2, B.W - S - 2));
      const r = Math.sin(b.t * b.f + b.ph + 0.9) * 5;
      b.x = x;
      b.y = y;
      b.el.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0) rotate(' + r.toFixed(2) + 'deg)';
    }

    function frame(now) {
      rafId = 0;
      if (t !== token) return;
      const dt = FK.clamp((now - B.last) / 1000, 0, 0.05);
      B.last = now;
      if (!B.ending) {
        B.sinceHit += dt;
        B.spawnIn -= dt;
        if (B.spawnIn <= 0) B.spawnIn = spawn() ? (B.dur / (B.lanes * 0.95)) * FK.rnd(0.8, 1.15) : 0.25;
        if (B.sinceHit > 7 && !B.glow) {
          B.glow = true;
          game.classList.add('rd-glow');
        }
      }
      for (let i = B.list.length - 1; i >= 0; i--) {
        const b = B.list[i];
        b.t += dt;
        b.p += (dt / B.dur) * b.k * (b.away ? 2.6 : 1);
        if (b.away) b.dx += b.vx * dt;
        place(b);
        if (b.y < -B.S * 1.6 || b.x < -B.S * 1.5 || b.x > B.W + B.S * 0.5) {
          b.el.remove();
          B.list.splice(i, 1);
        }
      }
      if (B.ending && !B.list.length) return;
      rafId = requestAnimationFrame(frame);
    }

    function tapBalloon(b) {
      if (t !== token || b.away || b.popped || B.ending) return;
      const r = b.el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.width * 0.55;
      if (same(b.syl, B.target)) {
        b.popped = true;
        B.list.splice(B.list.indexOf(b), 1);
        b.el.classList.add('rd-popping');
        later(260, () => b.el.remove());
        FK.sound.balloon();
        FK.fx.burst(cx, cy, [b.color, '#ffffff', '#ffc93c', '#ff4fa3', '#5bc0ff'], 16);
        FK.fx.ring(cx, cy, b.color);
        for (let i = 0; i < 4; i++) FK.fx.twinkle(cx + FK.rnd(-40, 40), cy + FK.rnd(-40, 40), '#ffffff');
        const c = cnt[B.popped];
        if (c) {
          c.innerHTML = balloonSvg(b.color, 'rd-cnt-b');
          c.classList.add('on');
          FK.ui.bounce(c);
        }
        B.popped++;
        B.sinceHit = 0;
        B.glow = false;
        game.classList.remove('rd-glow');
        if (B.popped >= N_POPS) win();
        else if (B.popped % 2 === 0) later(350, changeTarget);
      } else {
        b.away = true;
        b.vx = (b.x + B.S / 2 < B.W / 2 ? -1 : 1) * FK.rnd(80, 120);
        b.el.classList.add('rd-away');
        FK.sound.wrong();
      }
    }

    function clearSky(cls) {
      B.list.forEach((b) => {
        if (b.away) return;
        b.away = true;
        b.vx = FK.rnd(-30, 30);
        b.el.classList.add(cls || 'rd-leave');
      });
    }

    function changeTarget() {
      if (B.ending) return;
      B.tIdx++;
      B.target = targets[B.tIdx % targets.length];
      clearSky();
      B.list.forEach((b) => b.el.classList.toggle('is-t', same(b.syl, B.target)));
      FK.sound.swoosh();
      sign.classList.remove('rd-flip');
      void sign.offsetWidth;
      sign.classList.add('rd-flip');
      later(230, () => {
        signTxt.textContent = FK.text.syllable(B.target);
        twinkleAround(sign, 4, '#ffc93c');
      });
      B.force = true;
      B.spawnIn = 0.8;
    }

    function win() {
      B.ending = true;
      clearSky();
      finishRound('ballone-' + row, count, [
        { icon: 'refresh', label: 'Nochmal', onClick: () => startBall(row) },
        { emoji: '🎈', label: 'Andere', cls: 'btn-go', onClick: () => showBallPick() },
        { icon: 'check', label: 'Fertig', cls: 'btn-sun', onClick: () => showHome() },
      ]);
    }

    // a few balloons are already on their way when the game starts
    spawn(0.34, true);
    spawn(0.14);
    B.spawnIn = 1.2;
    rafId = requestAnimationFrame(frame);
  }

  /* =====================================================================
     screen
     ===================================================================== */

  FK.screen('read', {
    build(r) {
      root = r;
      const bar = FK.ui.topbar({ title: 'Lesen', onBack: goBack });
      titleEl = bar.querySelector('.title');
      backUse = bar.querySelector('.btn-back use');
      stage = h('div', { class: 'rd-stage' });
      root.append(bar, stage);
    },
    enter(params) {
      window.addEventListener('resize', onWinResize);
      window.addEventListener('orientationchange', onWinResize);
      window.addEventListener('keydown', onKey, true);
      const p = params || {};
      const lvl = p.lvl >= 1 && p.lvl <= 3 ? p.lvl | 0 : 0;
      if (lvl) setLvl(lvl);
      if (p.game === 'puzzle') startPuzzle(lvl);
      else if (p.game === 'wort') startWort(lvl);
      else if (p.game === 'genau') startGenau();
      else if (p.game === 'ballone') (p.row ? startBall(p.row) : showBallPick());
      else showHome();
    },
    leave() {
      stopAll();
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      resizeRaf = 0;
      window.removeEventListener('resize', onWinResize);
      window.removeEventListener('orientationchange', onWinResize);
      window.removeEventListener('keydown', onKey, true);
      view = '';
      if (stage) {
        stage.textContent = '';
        stage.className = 'rd-stage';
      }
    },
  });
})();
