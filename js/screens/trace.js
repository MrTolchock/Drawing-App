/* Farbklecks – Schreiben: Buchstaben und Ziffern mit dem Finger nachspuren, in der richtigen
   Reihenfolge und Richtung, auf Schreiblinien wie im Schweizer Schreibheft der 1. Klasse.

   Overview: three sets (ABC / abc / 123) and a grid of glyph tiles with stars.
   Tracing:  the glyph as a wide soft track on 4-line paper. The current stroke has a green numbered start
             dot, a moving dashed centre line and chevrons that show the direction; finished strokes are
             painted in crayon colours. Progress follows the finger projected onto the stroke, forward only.
   Finish:   stars, the glyph glows, the Anlaut card (emoji + word, or a Zehnerfeld for digits) and the
             choice «Nochmal», «Ohne Hilfe» (second round with only the faint track), «Weiter» or the overview.

   Geometry comes from FK.glyphs (js/learn/glyphs.js): x 0…w, y 0 top line, 50 middle, 100 baseline,
   150 descender line, one SVG path per stroke in writing direction. Paths are flattened here (M L H V C Q Z),
   so tracing does not depend on getTotalLength in the browser. */
(function () {
  'use strict';
  const FK = window.FK;
  const h = FK.h;
  const NS = 'http://www.w3.org/2000/svg';

  const CRAYONS = ['#ff4b4b', '#ff9f1c', '#2fbf71', '#3a86ff', '#9b5de5', '#ff5fa2', '#13bdbd', '#ffb000'];
  const STEP = 1;        // sample spacing along a stroke (glyph units)
  const BACK = 22;       // the finger may wander this far behind the reached point and still be "on track"
  const AHEAD = 12;      // progress never jumps further ahead than this in one small step
  const DONE_AT = 0.96;  // a stroke counts as finished at 96 %
  const CHEV_GAP = 20;   // chevron spacing (units)
  const CHEV_VIEW = 44;  // chevrons are shown this far ahead of the reached point

  const GRID_IC = '<svg class="ic" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><g stroke="#23203d" stroke-width="3" stroke-linejoin="round">' +
    '<rect x="5" y="5" width="16" height="16" rx="4" fill="#7be0b0"/><rect x="27" y="5" width="16" height="16" rx="4" fill="#ffc93c"/>' +
    '<rect x="5" y="27" width="16" height="16" rx="4" fill="#ff9cc6"/><rect x="27" y="27" width="16" height="16" rx="4" fill="#8fd3ff"/></g></svg>';
  const FREI_IC = '<svg class="ic" viewBox="0 0 48 48" aria-hidden="true" focusable="false">' +
    '<rect x="4" y="7" width="34" height="36" rx="6" fill="#ffffff" stroke="#23203d" stroke-width="3"/>' +
    '<path d="M11 36 L21 13 L31 36 M15 28 H27" fill="none" stroke="#c9c5dc" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M35 3 L38.6 11 L47 12 L40.6 17.7 L42.4 26 L35 21.8 L27.6 26 L29.4 17.7 L23 12 L31.4 11 Z" fill="#ffc93c" stroke="#23203d" stroke-width="2.6" stroke-linejoin="round"/></svg>';

  const f2 = (n) => Math.round(n * 100) / 100;
  const dist = (ax, ay, bx, by) => Math.sqrt((ax - bx) * (ax - bx) + (ay - by) * (ay - by));

  function svgEl(tag, attrs, parent) {
    const el = document.createElementNS(NS, tag);
    if (attrs) Object.keys(attrs).forEach((k) => el.setAttribute(k, attrs[k]));
    if (parent) parent.appendChild(el);
    return el;
  }

  /* ---------- geometry ---------- */

  // SVG path → polyline (absolute and relative M L H V C Q Z).
  function flatten(d) {
    const toks = String(d).match(/[a-zA-Z]|-?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/g) || [];
    const out = [];
    let i = 0;
    let cmd = '';
    let x = 0;
    let y = 0;
    let sx = 0;
    let sy = 0;
    const num = () => parseFloat(toks[i++]) || 0;
    while (i < toks.length) {
      if (/^[a-zA-Z]$/.test(toks[i])) cmd = toks[i++];
      else if (!cmd || cmd === 'Z' || cmd === 'z') { i++; continue; }
      const rel = cmd !== cmd.toUpperCase();
      const ox = rel ? x : 0;
      const oy = rel ? y : 0;
      switch (cmd.toUpperCase()) {
        case 'M':
          x = ox + num(); y = oy + num(); sx = x; sy = y;
          out.push([x, y]);
          cmd = rel ? 'l' : 'L';
          break;
        case 'L': x = ox + num(); y = oy + num(); out.push([x, y]); break;
        case 'H': x = ox + num(); out.push([x, y]); break;
        case 'V': y = oy + num(); out.push([x, y]); break;
        case 'C': {
          const x1 = ox + num(); const y1 = oy + num();
          const x2 = ox + num(); const y2 = oy + num();
          const x3 = ox + num(); const y3 = oy + num();
          const est = dist(x, y, x1, y1) + dist(x1, y1, x2, y2) + dist(x2, y2, x3, y3);
          const n = FK.clamp(Math.ceil(est / 1.2), 6, 160);
          for (let k = 1; k <= n; k++) {
            const t = k / n;
            const u = 1 - t;
            out.push([u * u * u * x + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3,
              u * u * u * y + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3]);
          }
          x = x3; y = y3;
          break;
        }
        case 'Q': {
          const x1 = ox + num(); const y1 = oy + num();
          const x2 = ox + num(); const y2 = oy + num();
          const n = FK.clamp(Math.ceil((dist(x, y, x1, y1) + dist(x1, y1, x2, y2)) / 1.2), 6, 160);
          for (let k = 1; k <= n; k++) {
            const t = k / n;
            const u = 1 - t;
            out.push([u * u * x + 2 * u * t * x1 + t * t * x2, u * u * y + 2 * u * t * y1 + t * t * y2]);
          }
          x = x2; y = y2;
          break;
        }
        case 'Z': x = sx; y = sy; out.push([x, y]); break;
        default: i++;
      }
    }
    return out;
  }

  // Polyline → points every STEP units with arc length s and a smoothed unit tangent.
  function resample(poly) {
    if (!poly.length) return { pts: [{ x: 0, y: 0, s: 0, tx: 0, ty: 0 }], len: 0 };
    const pts = [{ x: poly[0][0], y: poly[0][1], s: 0 }];
    let acc = 0;
    let next = STEP;
    for (let k = 1; k < poly.length; k++) {
      const ax = poly[k - 1][0];
      const ay = poly[k - 1][1];
      const bx = poly[k][0];
      const by = poly[k][1];
      const seg = dist(ax, ay, bx, by);
      if (seg === 0) continue;
      while (next <= acc + seg) {
        const t = (next - acc) / seg;
        pts.push({ x: ax + (bx - ax) * t, y: ay + (by - ay) * t, s: next });
        next += STEP;
      }
      acc += seg;
    }
    const last = poly[poly.length - 1];
    if (acc - pts[pts.length - 1].s > 0.05) pts.push({ x: last[0], y: last[1], s: acc });
    for (let k = 0; k < pts.length; k++) {
      const a = pts[Math.max(0, k - 2)];
      const b = pts[Math.min(pts.length - 1, k + 2)];
      const l = dist(a.x, a.y, b.x, b.y);
      pts[k].tx = l ? (b.x - a.x) / l : 0;
      pts[k].ty = l ? (b.y - a.y) / l : 0;
    }
    return { pts, len: acc };
  }

  const geoCache = {};
  function geo(g) {
    if (geoCache[g]) return geoCache[g];
    const data = FK.glyphs.data[g];
    let minY = Infinity;
    let maxY = -Infinity;
    const strokes = data.strokes.map((d, i) => {
      const r = resample(flatten(d));
      r.pts.forEach((p) => { if (p.y < minY) minY = p.y; if (p.y > maxY) maxY = p.y; });
      return { i, d, pts: r.pts, len: r.len, dot: r.len < 6 };
    });
    geoCache[g] = { g, data, w: data.w || 60, strokes, minY, maxY, digit: data.count !== undefined };
    return geoCache[g];
  }

  function idxOf(st, s) { return Math.max(0, Math.min(st.pts.length - 1, Math.round(s / STEP))); }
  function pointAt(st, s) {
    const pts = st.pts;
    if (s <= 0) return pts[0];
    if (s >= st.len) return pts[pts.length - 1];
    const k = Math.min(pts.length - 2, Math.floor(s / STEP));
    const a = pts[k];
    const b = pts[k + 1];
    const t = b.s > a.s ? (s - a.s) / (b.s - a.s) : 0;
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, tx: a.tx, ty: a.ty, s };
  }
  // Path of the stroke from s0 to s1 (sampled points), for the painted progress and the demo trail.
  function partD(st, s0, s1) {
    s0 = Math.max(0, s0);
    s1 = Math.min(st.len, s1);
    if (s1 <= s0) return '';
    const a = pointAt(st, s0);
    const b = pointAt(st, s1);
    let d = 'M' + f2(a.x) + ' ' + f2(a.y);
    const k0 = Math.floor(s0 / STEP) + 1;
    const k1 = Math.min(st.pts.length - 1, Math.ceil(s1 / STEP) - 1);
    for (let k = k0; k <= k1; k++) {
      if (st.pts[k].s >= s1) break;
      d += 'L' + f2(st.pts[k].x) + ' ' + f2(st.pts[k].y);
    }
    return d + 'L' + f2(b.x) + ' ' + f2(b.y + (s1 - s0 < 0.3 ? 0.01 : 0));
  }

  // Vertical frame shared by all glyphs of a set (so line spacing stays the same inside a set).
  const frameCache = {};
  function frameOf(sid) {
    if (frameCache[sid]) return frameCache[sid];
    const set = setById(sid);
    let y0 = 0;
    let y1 = 100;
    if (set) set.items.forEach((g) => { if (FK.glyphs.data[g]) { const G = geo(g); y0 = Math.min(y0, G.minY); y1 = Math.max(y1, G.maxY); } });
    frameCache[sid] = { y0, y1: y1 > 104 ? Math.max(y1, 150) : y1 };
    return frameCache[sid];
  }

  /* ---------- sets ---------- */

  function sets() { return (FK.glyphs && FK.glyphs.sets) || []; }
  function setById(id) { return sets().find((s) => s.id === id) || null; }
  function setOf(g) { return sets().find((s) => s.items.indexOf(g) >= 0) || null; }
  function isDone(g) { return FK.progress.isDone('trace', g); }
  function isFrei(g) { return FK.progress.isDone('trace', g + ':frei'); }
  function neighbour(g, dir) {
    const set = setOf(g);
    if (!set) return g;
    const i = set.items.indexOf(g);
    return set.items[(i + dir + set.items.length) % set.items.length];
  }

  /* ---------- state ---------- */

  let root = null;
  let backUse = null;
  let overEl = null;
  let tabsEl = null;
  let gridEl = null;
  let gridScroll = null;
  let playEl = null;
  let paperEl = null;
  let svg = null;
  const L = {};
  let headEl = null;
  let headNum = null;
  let toolsEl = null;
  let endEl = null;
  let pipsEl = null;
  let mystCol = null;
  let mystSil = null;
  let chipEl = null;

  let setId = 'gross';
  let view = 'over';
  let cur = null;          // geometry of the glyph on the paper
  let mode = 'guided';     // 'guided' | 'frei'
  let si = 0;              // index of the current stroke
  let prog = 0;            // reached length on the current stroke
  let phase = 'ready';     // ready | seek | trace | pause | done
  let done = [];           // finished strokes
  let els = [];            // svg elements per stroke
  let chevs = [];          // chevrons of the current stroke
  let ptr = null;          // the one finger / pen / mouse we follow
  let fit = null;          // { s, x, y, w, h } – px per unit and the viewBox
  let svgRect = null;
  let token = 0;
  let colorBase = 0;
  const lastGlyph = {};
  let timers = [];
  let rafId = 0;
  let demo = null;
  let demoRaf = 0;
  let idleTimer = 0;
  let lastNudge = 0;
  let misses = 0;
  let ro = null;
  let active = false;

  function later(fn, ms) {
    const t = setTimeout(() => {
      timers = timers.filter((x) => x !== t);
      fn();
    }, ms);
    timers.push(t);
    return t;
  }
  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
    clearTimeout(idleTimer);
    idleTimer = 0;
  }

  const colorOf = (i) => CRAYONS[(colorBase + i) % CRAYONS.length];
  const tol = () => Math.max(17, 30 / fit.s);        // how far from the centre line the finger may be
  const startTol = () => Math.max(19, 40 / fit.s);   // how close to the start the finger must touch down
  const dotTol = () => Math.max(24, 46 / fit.s);     // dots (i, j, ä …) are tapped

  /* ---------- building ---------- */

  function buildPaper() {
    paperEl = h('div', { class: 'tr-paper' });
    svg = svgEl('svg', { class: 'tr-svg', 'aria-hidden': 'true', focusable: 'false' });
    const lines = svgEl('g', { class: 'tr-lines' }, svg);
    L.band = svgEl('rect', { class: 'tr-band', y: 50, height: 50 }, lines);
    L.lnTop = svgEl('path', { class: 'tr-ln' }, lines);
    L.lnMid = svgEl('path', { class: 'tr-ln tr-ln-mid' }, lines);
    L.lnBase = svgEl('path', { class: 'tr-ln tr-ln-base' }, lines);
    L.lnDesc = svgEl('path', { class: 'tr-ln' }, lines);
    L.glyph = svgEl('g', { class: 'tr-glyph' }, svg);
    L.halo = svgEl('g', { class: 'tr-halo' }, L.glyph);
    L.trackO = svgEl('g', { class: 'tr-track-o' }, L.glyph);
    L.track = svgEl('g', { class: 'tr-track' }, L.glyph);
    L.guide = svgEl('g', { class: 'tr-guide' }, L.glyph);
    L.center = svgEl('path', { class: 'tr-center' }, L.guide);
    L.endMark = svgEl('circle', { class: 'tr-endmark', r: 3.2 }, L.guide);
    L.chevs = svgEl('g', { class: 'tr-chevs' }, L.guide);
    L.paintO = svgEl('g', { class: 'tr-paint-o' }, L.glyph);
    L.paint = svgEl('g', { class: 'tr-paint' }, L.glyph);
    L.nums = svgEl('g', { class: 'tr-nums' }, L.glyph);
    L.demo = svgEl('g', { class: 'tr-demo' }, L.glyph);
    L.demoTrail = svgEl('path', { class: 'tr-demo-trail' }, L.demo);
    L.demoBall = svgEl('circle', { class: 'tr-demo-ball', r: 6.5 }, L.demo);
    headEl = svgEl('g', { class: 'tr-head' }, L.glyph);
    const hin = svgEl('g', { class: 'tr-head-in' }, headEl);
    svgEl('circle', { class: 'tr-head-ring', r: 9.5 }, hin);
    svgEl('circle', { class: 'tr-head-dot', r: 9.5 }, hin);
    headNum = svgEl('text', { class: 'tr-head-num', 'text-anchor': 'middle', dy: 4.3 }, hin);
    paperEl.appendChild(svg);

    paperEl.addEventListener('pointerdown', onDown);
    paperEl.addEventListener('pointermove', onMove);
    paperEl.addEventListener('pointerup', onUp);
    paperEl.addEventListener('pointercancel', onUp);
    paperEl.addEventListener('lostpointercapture', onUp);
    return paperEl;
  }

  function buildTools() {
    const prev = FK.ui.btn({ icon: 'back', cls: 'btn-round tr-nav', title: 'Zurück', onClick: () => step(-1) });
    const next = FK.ui.btn({ icon: 'next', cls: 'btn-round tr-nav', title: 'Weiter', onClick: () => step(1) });
    mystSil = h('span', { class: 'tr-myst-e tr-myst-sil emoji', 'aria-hidden': 'true' });
    mystCol = h('span', { class: 'tr-myst-e tr-myst-col emoji', 'aria-hidden': 'true' });
    pipsEl = h('div', { class: 'tr-pips', 'aria-hidden': 'true' });
    chipEl = h('div', { class: 'tr-chip', html: FK.icon('star', 'ic') + '<span>Ohne Hilfe</span>' });
    toolsEl = h('div', { class: 'tr-tools' },
      h('div', { class: 'tr-mid' }, h('div', { class: 'tr-myst' }, mystSil, mystCol), pipsEl, chipEl),
      h('div', { class: 'tr-navs' }, prev, next));
    endEl = h('div', { class: 'tr-end', 'aria-live': 'polite' });
    return h('div', { class: 'tr-side' }, toolsEl, endEl);
  }

  /* ---------- overview ---------- */

  function renderTabs() {
    tabsEl.innerHTML = '';
    sets().forEach((s) => {
      const n = s.items.filter(isDone).length;
      const b = h('button', {
        type: 'button',
        class: 'tr-tab tr-tab-' + s.id + (s.id === setId ? ' on' : ''),
        'aria-label': s.name,
        'aria-pressed': s.id === setId ? 'true' : 'false',
        onclick: () => {
          if (setId === s.id) { FK.ui.bounce(b); return; }
          setId = s.id;
          FK.sound.page();
          renderTabs();
          renderGrid(true);
        },
      }, h('span', { class: 'tr-tab-name', text: s.name }),
      h('span', { class: 'tr-tab-prog', html: FK.icon('star', 'ic') + '<b>' + n + '</b>' }));
      tabsEl.append(b);
    });
  }

  function tileSvg(g) {
    const d = isDone(g);
    const lower = setOf(g) && setOf(g).id === 'klein';
    const col = CRAYONS[(sets().length ? Math.max(0, setOf(g).items.indexOf(g)) : 0) % CRAYONS.length];
    const esc = g.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    return '<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">' +
      '<path class="tr-tile-ln" d="M10 ' + (lower ? 66 : 76) + ' H90"/>' +
      '<text x="50" y="' + (lower ? 66 : 76) + '" text-anchor="middle" class="tr-tile-g' + (d ? ' is-done' : '') + '"' +
      (d ? ' style="fill:' + col + '"' : '') + '>' + esc + '</text></svg>';
  }

  function renderGrid(resetScroll) {
    gridEl.innerHTML = '';
    const set = setById(setId);
    if (!set) {
      gridEl.append(h('p', { class: 'tr-empty', text: 'Kommt bald!' }));
      return;
    }
    const firstOpen = set.items.find((g) => !isDone(g) && FK.glyphs.data[g]);
    set.items.forEach((g, i) => {
      if (!FK.glyphs.data[g]) return;
      const t = h('button', {
        type: 'button',
        class: 'tr-tile' + (isDone(g) ? ' is-done' : '') + (g === firstOpen ? ' is-next' : '') + (g === lastGlyph[setId] ? ' is-last' : ''),
        'aria-label': g,
        style: { '--tilt': ((i % 3) - 1) * 1.2 + 'deg' },
        onclick: () => { FK.sound.tick(); openGlyph(g, 'guided'); },
        html: tileSvg(g),
      });
      const stars = h('span', { class: 'tr-tile-stars' });
      stars.innerHTML = FK.icon(isDone(g) ? 'star' : 'star-empty', 'ic' + (isDone(g) ? '' : ' tr-star-empty')) +
        (isFrei(g) ? FK.icon('star', 'ic tr-star-frei') : '');
      t.append(stars);
      gridEl.append(t);
    });
    if (resetScroll) gridScroll.scrollTop = 0;
    else {
      const last = gridEl.querySelector('.is-last') || gridEl.querySelector('.is-next');
      if (last) {
        requestAnimationFrame(() => {
          const r = last.getBoundingClientRect();
          const sr = gridScroll.getBoundingClientRect();
          if (r.bottom > sr.bottom || r.top < sr.top) gridScroll.scrollTop += r.top - sr.top - (sr.height - r.height) / 2;
        });
      }
    }
  }

  function showOver() {
    stopActivity();
    token++;
    view = 'over';
    backUse.setAttribute('href', '#i-home');
    playEl.hidden = true;
    overEl.hidden = false;
    overEl.classList.remove('tr-in');
    void overEl.offsetWidth;
    overEl.classList.add('tr-in');
    renderTabs();
    renderGrid(false);
  }

  function openGlyph(g, m) {
    if (!FK.glyphs || !FK.glyphs.data[g]) return;
    view = 'play';
    backUse.setAttribute('href', '#i-back');
    overEl.hidden = true;
    playEl.hidden = false;
    playEl.classList.remove('tr-in');
    void playEl.offsetWidth;
    playEl.classList.add('tr-in');
    load(g, m);
  }

  function step(dir) {
    if (!cur) return;
    FK.sound.page();
    load(neighbour(cur.g, dir), 'guided');
  }

  /* ---------- a glyph on the paper ---------- */

  function load(g, m) {
    stopActivity();
    token++;
    const set = setOf(g);
    if (set) setId = set.id;
    lastGlyph[setId] = g;
    cur = geo(g);
    mode = m === 'frei' ? 'frei' : 'guided';
    si = 0;
    prog = 0;
    phase = 'ready';
    misses = 0;
    done = cur.strokes.map(() => false);
    colorBase = set ? set.items.indexOf(g) * 3 : 0;
    playEl.classList.remove('is-done', 'is-glow');
    playEl.classList.toggle('is-frei', mode === 'frei');
    playEl.classList.toggle('is-digit', cur.digit);
    svg.classList.remove('is-glow', 'is-hop');
    endEl.innerHTML = '';
    buildGlyph();
    fillTools();
    refit();
    setupStroke();
    render();
    if (mode === 'guided') later(playDemo, 750);
    armIdle();
  }

  function buildGlyph() {
    [L.halo, L.trackO, L.track, L.paintO, L.paint, L.nums].forEach((g) => { g.textContent = ''; });
    els = cur.strokes.map((st, i) => {
      const e = {
        halo: svgEl('path', { d: st.d }, L.halo),
        tro: svgEl('path', { d: st.d }, L.trackO),
        tr: svgEl('path', { d: st.d, class: st.dot ? 'is-dot' : '' }, L.track),
        po: svgEl('path', { d: '' }, L.paintO),
        p: svgEl('path', { d: '', style: 'stroke:' + colorOf(i) }, L.paint),
        num: svgEl('g', { class: 'tr-num', transform: 'translate(' + f2(st.pts[0].x) + ' ' + f2(st.pts[0].y) + ')' }, L.nums),
      };
      svgEl('circle', { r: 6.2 }, e.num);
      const t = svgEl('text', { 'text-anchor': 'middle', dy: 2.9 }, e.num);
      t.textContent = String(i + 1);
      return e;
    });
  }

  function fillTools() {
    const data = cur.data;
    mystSil.textContent = data.emoji || '⭐';
    mystCol.textContent = data.emoji || '⭐';
    pipsEl.innerHTML = '';
    cur.strokes.forEach((st, i) => pipsEl.append(h('span', { class: 'tr-pip' + (st.dot ? ' is-dot' : ''), style: { '--c': colorOf(i) }, text: st.dot ? '' : String(i + 1) })));
  }

  // Fit the glyph as large as the paper allows; lines run across the whole paper.
  function refit() {
    if (!cur || !svg) return;
    const r = svg.getBoundingClientRect();
    if (r.width < 20 || r.height < 20) return;
    svgRect = r;
    const fr = frameOf(setId);
    const padX = 15;
    const padT = 15;
    const padB = fr.y1 > 104 ? 10 : 15;
    const cw = Math.max(cur.w, 46) + padX * 2;
    const ch = fr.y1 - fr.y0 + padT + padB;
    const s = Math.min(r.width / cw, r.height / ch);
    const w = r.width / s;
    const hh = r.height / s;
    const cy = (fr.y0 - padT + fr.y1 + padB) / 2;
    fit = { s, x: cur.w / 2 - w / 2, y: cy - hh / 2, w, h: hh };
    svg.setAttribute('viewBox', [fit.x, fit.y, fit.w, fit.h].map(f2).join(' '));
    const x0 = f2(fit.x - 2);
    const x1 = f2(fit.x + fit.w + 2);
    L.band.setAttribute('x', x0);
    L.band.setAttribute('width', f2(fit.w + 4));
    L.lnTop.setAttribute('d', 'M' + x0 + ' 0 H' + x1);
    L.lnMid.setAttribute('d', 'M' + x0 + ' 50 H' + x1);
    L.lnBase.setAttribute('d', 'M' + x0 + ' 100 H' + x1);
    L.lnDesc.setAttribute('d', 'M' + x0 + ' 150 H' + x1);
    const dash = f2(9 / s);
    L.lnMid.setAttribute('stroke-dasharray', dash + ' ' + dash);
  }

  function setupStroke() {
    const st = cur.strokes[si];
    els.forEach((e, i) => {
      e.tr.setAttribute('class', (cur.strokes[i].dot ? 'is-dot ' : '') + (done[i] ? 'is-done' : i === si ? 'is-cur' : 'is-later'));
      e.tro.setAttribute('class', done[i] ? 'is-done' : i === si ? 'is-cur' : 'is-later');
      e.num.setAttribute('class', 'tr-num' + (i > si ? ' on' : ''));
    });
    L.chevs.textContent = '';
    chevs = [];
    if (!st) {
      L.guide.setAttribute('class', 'tr-guide');
      headEl.setAttribute('class', 'tr-head');
      return;
    }
    L.guide.setAttribute('class', 'tr-guide' + (st.dot ? '' : ' on'));
    L.center.setAttribute('d', st.dot ? '' : st.d);
    const end = st.pts[st.pts.length - 1];
    L.endMark.setAttribute('cx', f2(end.x));
    L.endMark.setAttribute('cy', f2(end.y));
    if (!st.dot) {
      const first = Math.min(12, st.len / 2);
      for (let s = first; s < st.len - 7 || s === first; s += CHEV_GAP) {
        const p = pointAt(st, s);
        const a = Math.atan2(p.ty, p.tx) * 180 / Math.PI;
        const g = svgEl('g', { transform: 'translate(' + f2(p.x) + ' ' + f2(p.y) + ') rotate(' + f2(a) + ')' }, L.chevs);
        const inner = svgEl('g', { class: 'tr-chev' }, g);
        svgEl('path', { class: 'tr-chev-w', d: 'M-2.6 -4.4 L1.8 0 L-2.6 4.4' }, inner);
        svgEl('path', { class: 'tr-chev-i', d: 'M-2.6 -4.4 L1.8 0 L-2.6 4.4' }, inner);
        chevs.push({ s, el: inner, st: '' });
        if (st.len < 14) break;
      }
    }
    headNum.textContent = String(si + 1);
    headEl.setAttribute('class', 'tr-head on' + (st.dot ? ' is-dot' : ''));
    updatePips();
  }

  function updatePips() {
    const pips = pipsEl.children;
    for (let i = 0; i < pips.length; i++) {
      pips[i].className = 'tr-pip' + (cur.strokes[i].dot ? ' is-dot' : '') + (done[i] ? ' is-done' : i === si && phase !== 'done' ? ' is-cur' : '');
    }
  }

  function render() {
    if (!rafId) rafId = requestAnimationFrame(doRender);
  }
  function doRender() {
    rafId = 0;
    if (!cur) return;
    const st = cur.strokes[si];
    if (st && !done[si]) {
      const d = st.dot ? '' : partD(st, 0, prog);
      els[si].p.setAttribute('d', d);
      els[si].po.setAttribute('d', d);
    }
    if (st && phase !== 'done') {
      const p = pointAt(st, st.dot ? 0 : prog);
      headEl.setAttribute('transform', 'translate(' + f2(p.x) + ' ' + f2(p.y) + ')');
      let cls = 'tr-head on' + (st.dot ? ' is-dot' : '');
      if (phase === 'trace') cls += ' is-active';
      if (phase === 'pause') cls += ' is-pause';
      if (headEl._hint) cls += ' is-hint';
      if (headEl.getAttribute('class') !== cls) headEl.setAttribute('class', cls);
    }
    chevs.forEach((c) => {
      const ds = c.s - prog;
      const v = ds < 2 || ds > CHEV_VIEW ? '' : ds < 22 ? ' on' : ' on far';
      if (v !== c.st) {
        c.st = v;
        c.el.setAttribute('class', 'tr-chev' + v);
      }
    });
    // the mystery picture fills from the bottom while the child writes
    let n = 0;
    done.forEach((x) => { if (x) n++; });
    if (st && !done[si] && !st.dot && st.len) n += prog / st.len;
    const frac = cur.strokes.length ? n / cur.strokes.length : 0;
    const clip = 'inset(' + f2((1 - frac) * 100) + '% 0 0 0)';
    mystCol.style.clipPath = clip;
    mystCol.style.webkitClipPath = clip;
  }

  /* ---------- tracing ---------- */

  function toUnits(cx, cy) {
    const r = svgRect;
    return { x: fit.x + (cx - r.left) / fit.s, y: fit.y + (cy - r.top) / fit.s };
  }
  function toClient(x, y) {
    const r = svg.getBoundingClientRect();
    return { x: r.left + (x - fit.x) * fit.s, y: r.top + (y - fit.y) * fit.s };
  }

  // Nearest point of the current stroke inside the window [s0, s1]. Ties on strokes that run back over
  // themselves (n, m, h, a, d, b …) are decided by the direction the finger moves.
  function nearest(st, P, s0, s1, motion) {
    const pts = st.pts;
    const i0 = idxOf(st, Math.max(0, s0));
    const i1 = idxOf(st, Math.min(st.len, s1));
    let minD = Infinity;
    let best = i0;
    let bestScore = Infinity;
    for (let k = i0; k <= i1; k++) {
      const p = pts[k];
      const d = dist(P.x, P.y, p.x, p.y);
      if (d < minD) minD = d;
      let score = d + Math.max(0, p.s - prog - 3) * 0.12;
      if (motion) score += (1 - (motion.x * p.tx + motion.y * p.ty)) * motion.w;
      if (score < bestScore) {
        bestScore = score;
        best = k;
      }
    }
    return { d: minD, k: best, bd: dist(P.x, P.y, pts[best].x, pts[best].y) };
  }

  function onDown(e) {
    if (view !== 'play' || !cur || !fit || phase === 'done') return;
    if (ptr) return;                                  // ignore extra fingers
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.preventDefault();
    try { paperEl.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    svgRect = svg.getBoundingClientRect();
    stopDemo();
    clearTimeout(idleTimer);
    const P = toUnits(e.clientX, e.clientY);
    ptr = { id: e.pointerId, x: P.x, y: P.y, cx: e.clientX, cy: e.clientY, t: performance.now(), ref: P, motion: null, spark: 0, speed: 0, fresh: true };
    phase = 'seek';
    seek(P, e.clientX, e.clientY);
    if (ptr) ptr.fresh = false;
    render();
  }

  function onMove(e) {
    if (!ptr || e.pointerId !== ptr.id) return;
    e.preventDefault();
    const list = e.getCoalescedEvents ? e.getCoalescedEvents() : null;
    const evs = list && list.length ? list : [e];
    for (let i = 0; i < evs.length && ptr; i++) moveTo(evs[i].clientX, evs[i].clientY);
    render();
  }

  function moveTo(cx, cy) {
    const P = toUnits(cx, cy);
    const now = performance.now();
    const px = dist(cx, cy, ptr.cx, ptr.cy);
    const dt = Math.max(1, now - ptr.t);
    ptr.speed = ptr.speed * 0.7 + (px / dt) * 0.3;
    ptr.cx = cx;
    ptr.cy = cy;
    ptr.t = now;
    // direction of the finger, measured over the last few units
    const mv = dist(P.x, P.y, ptr.ref.x, ptr.ref.y);
    if (mv >= 2.5) {
      ptr.motion = { x: (P.x - ptr.ref.x) / mv, y: (P.y - ptr.ref.y) / mv, w: tol() * 0.6 };
      ptr.ref = P;
    }
    if (phase === 'seek') seek(P, cx, cy);
    else if (phase === 'pause') {
      const st = cur.strokes[si];
      const n = nearest(st, P, prog - BACK, prog + 6, null);
      if (n.d <= tol() * 0.9) {
        phase = 'trace';
        FK.sound.scribbleStart('trace');
      }
    } else if (phase === 'trace') {
      // walk in small steps so fast swipes cannot skip parts of the stroke
      const n = Math.max(1, Math.ceil(dist(P.x, P.y, ptr.x, ptr.y) / 2.5));
      for (let k = 1; k <= n && phase === 'trace'; k++) {
        advance({ x: ptr.x + (P.x - ptr.x) * k / n, y: ptr.y + (P.y - ptr.y) * k / n });
      }
      if (phase === 'trace') {
        FK.sound.scribbleSpeed(ptr.speed);
        ptr.spark += px;
        if (ptr.spark > 26) {
          ptr.spark = 0;
          FK.fx.twinkle(cx + FK.rnd(-8, 8), cy + FK.rnd(-8, 8), FK.pick([colorOf(si), '#ffffff', '#ffe14a']));
        }
      }
    }
    if (ptr) {
      ptr.x = P.x;
      ptr.y = P.y;
    }
  }

  // Finger is down but not yet tracing: start when it is at the reached point of the current stroke.
  function seek(P, cx, cy) {
    const st = cur.strokes[si];
    if (!st) return;
    if (st.dot) {
      if (dist(P.x, P.y, st.pts[0].x, st.pts[0].y) <= dotTol()) completeStroke();
      else if (ptr && ptr.fresh) miss(cx, cy);
      return;
    }
    const n = nearest(st, P, prog - BACK * 0.5, prog + (prog > 0 ? 10 : 7), null);
    if (n.d <= startTol()) {
      phase = 'trace';
      FK.sound.scribbleStart('trace');
      FK.sound.scribbleSpeed(0);
      if (prog === 0) {
        const c = toClient(st.pts[0].x, st.pts[0].y);
        FK.fx.ring(c.x, c.y, '#3fd16b');
      }
      if (ptr) ptr.ref = P;
      misses = 0;
      headEl._hint = false;
    } else if (ptr && ptr.fresh) miss(cx, cy);
  }

  function advance(P) {
    const st = cur.strokes[si];
    const n = nearest(st, P, prog - BACK, prog + AHEAD, ptr ? ptr.motion : null);
    if (n.d > tol()) {
      pause();
      return;
    }
    const s = st.pts[n.k].s;
    if (n.bd <= tol() && s > prog) prog = Math.min(st.len, s);
    if (prog >= st.len * DONE_AT) completeStroke();
  }

  function pause() {
    phase = 'pause';
    FK.sound.scribbleSpeed(0);
    const now = performance.now();
    if (now - lastNudge > 900) {
      lastNudge = now;
      FK.sound.undo();
      wobbleHead();
    }
  }

  function wobbleHead() {
    const hin = headEl.firstChild;
    hin.classList.remove('wob');
    void hin.getBoundingClientRect();
    hin.classList.add('wob');
  }

  // Touched somewhere else: show gently where to begin.
  function miss() {
    misses++;
    FK.sound.undo();
    wobbleHead();
    const st = cur.strokes[si];
    const p = pointAt(st, st.dot ? 0 : prog);
    const c = toClient(p.x, p.y);
    FK.fx.ring(c.x, c.y, '#3fd16b');
    if (mode === 'frei') {
      // no help in this round – but never leave the child stuck: show the start for a moment
      headEl._hint = true;
      later(() => { headEl._hint = false; render(); }, 1800);
    } else if (misses >= 2) {
      later(playDemo, 450);
    }
  }

  function onUp(e) {
    if (!ptr || (e && e.pointerId !== ptr.id)) return;
    const id = ptr.id;
    ptr = null;
    try { if (paperEl.hasPointerCapture && paperEl.hasPointerCapture(id)) paperEl.releasePointerCapture(id); } catch (err) { /* ignore */ }
    FK.sound.scribbleStop();
    if (phase === 'seek' || phase === 'trace' || phase === 'pause') phase = 'ready';
    armIdle();
    render();
  }

  function completeStroke() {
    const st = cur.strokes[si];
    const i = si;
    done[i] = true;
    prog = st.len;
    els[i].p.setAttribute('d', st.d);
    els[i].po.setAttribute('d', st.d);
    els[i].p.setAttribute('class', 'pop');
    FK.sound.scribbleStop();
    FK.sound.plip(i * 2 + 2);
    const end = st.pts[st.pts.length - 1];
    const c = toClient(end.x, end.y);
    FK.fx.burst(c.x, c.y, [colorOf(i), '#ffffff', '#ffe14a', colorOf(i + 1)], st.dot ? 10 : 8);
    if (st.dot) FK.sound.pop();
    si++;
    prog = 0;
    misses = 0;
    if (si >= cur.strokes.length) {
      finishGlyph();
      return;
    }
    phase = ptr ? 'seek' : 'ready';
    if (ptr) {
      ptr.fresh = false;
      ptr.motion = null;
    }
    setupStroke();
    render();
    if (mode === 'guided' && !ptr) later(() => { if (!ptr && phase === 'ready' && prog === 0) playDemo(); }, 900);
    armIdle();
  }

  function finishGlyph() {
    phase = 'done';
    const my = token;
    FK.sound.scribbleStop();
    stopDemo();
    clearTimeout(idleTimer);
    setupStroke();
    updatePips();
    headEl.setAttribute('class', 'tr-head');
    render();
    later(() => {
      if (my !== token) return;
      FK.sound.rainbow();
      svg.classList.add('is-glow', 'is-hop');
      cur.strokes.forEach((st, i) => later(() => {
        if (my !== token) return;
        const p = pointAt(st, st.len / 2);
        const c = toClient(p.x, p.y);
        FK.fx.burst(c.x, c.y, [colorOf(i), '#ffe14a', '#ffffff'], 10);
      }, 90 * i));
    }, 120);
    later(() => {
      if (my !== token) return;
      const id = mode === 'frei' ? cur.g + ':frei' : cur.g;
      const n = FK.progress.finish('trace', id, 1);
      showEnd();
      playEl.classList.add('is-done');
      FK.ui.celebrate({ stars: n, from: paperEl }).then(() => {
        if (my !== token) return;
        const set = setOf(cur.g);
        if (mode === 'guided' && n && set && set.items.every(isDone)) {
          const b = FK.progress.finish('trace', 'alle:' + set.id, 3);
          if (b) FK.ui.celebrate({ big: true, text: 'Alle geschafft!', stars: b, from: paperEl });
        }
      });
      later(() => {
        const w = endEl.querySelector('.tr-go');
        if (w && my === token) w.classList.add('tr-invite');
      }, 2600);
    }, 650);
  }

  /* ---------- the end card ---------- */

  function anlautCard() {
    const data = cur.data;
    const card = h('div', { class: 'tr-card' + (cur.digit ? ' is-digit' : '') });
    if (cur.digit) {
      const frame = h('div', { class: 'tr-ten', 'aria-label': String(data.count) });
      for (let i = 0; i < 10; i++) {
        frame.append(h('span', { class: 'tr-cell' + (i < data.count ? ' on' : ''), style: { animationDelay: (0.35 + i * 0.09) + 's' } },
          i < data.count ? h('span', { class: 'emoji', text: data.emoji || '⭐' }) : null));
      }
      card.append(frame);
      if (data.word) card.append(FK.ui.word(data.word, { cls: 'tr-word' }));
    } else {
      card.append(h('span', { class: 'tr-card-emoji emoji', 'aria-hidden': 'true', text: data.emoji || '⭐' }));
      if (data.word) card.append(FK.ui.word(data.word, { highlight: cur.g, cls: 'tr-word' }));
    }
    return card;
  }

  function showEnd() {
    const set = setOf(cur.g);
    endEl.innerHTML = '';
    const acts = h('div', { class: 'tr-acts' });
    const over = FK.ui.btn({ label: set ? set.name : 'ABC', cls: 'btn-big tr-over', title: 'Alle', onClick: showOver });
    over.insertAdjacentHTML('afterbegin', GRID_IC);
    acts.append(over);
    acts.append(FK.ui.btn({ icon: 'refresh', label: 'Nochmal', cls: 'btn-big', onClick: () => load(cur.g, mode) }));
    if (mode === 'guided') {
      const fr = FK.ui.btn({ label: 'Ohne Hilfe', cls: 'btn-big btn-sun tr-frei', onClick: () => load(cur.g, 'frei') });
      fr.insertAdjacentHTML('afterbegin', FREI_IC);
      if (isFrei(cur.g)) fr.classList.add('is-has');
      acts.append(fr);
    }
    acts.append(FK.ui.btn({ icon: 'next', label: 'Weiter', cls: 'btn-big btn-go tr-go', onClick: () => load(neighbour(cur.g, 1), 'guided') }));
    endEl.append(anlautCard(), acts);
  }

  /* ---------- demo: a glowing ball shows the way ---------- */

  function playDemo() {
    if (view !== 'play' || mode !== 'guided' || !cur || ptr || phase === 'done') return;
    const st = cur.strokes[si];
    if (!st) return;
    stopDemo();
    if (st.dot || FK.reduced) {
      wobbleHead();
      return;
    }
    const from = prog;
    const len = st.len - from;
    const dur = FK.clamp(len / 105, 0.7, 2.4) * 1000;
    demo = { st, from, dur, t0: performance.now() };
    L.demo.setAttribute('class', 'tr-demo on');
    const tick = (now) => {
      demoRaf = 0;
      if (!demo) return;
      const t = (now - demo.t0 - 260) / demo.dur;
      const e = t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t) * 0.35 + t * 0.65;
      const s = demo.from + (demo.st.len - demo.from) * e;
      const p = pointAt(demo.st, s);
      L.demoBall.setAttribute('cx', f2(p.x));
      L.demoBall.setAttribute('cy', f2(p.y));
      L.demoTrail.setAttribute('d', partD(demo.st, Math.max(demo.from, s - 30), s));
      if (t >= 1.25) {
        stopDemo();
        return;
      }
      L.demo.style.opacity = t > 1 ? String(Math.max(0, 1 - (t - 1) * 4)) : '';
      demoRaf = requestAnimationFrame(tick);
    };
    demoRaf = requestAnimationFrame(tick);
  }

  function stopDemo() {
    demo = null;
    if (demoRaf) cancelAnimationFrame(demoRaf);
    demoRaf = 0;
    if (L.demo) {
      L.demo.setAttribute('class', 'tr-demo');
      L.demo.style.opacity = '';
      L.demoTrail.setAttribute('d', '');
    }
  }

  // Waiting for the child: show the way again (guided) or the start for a moment (without help).
  function armIdle() {
    clearTimeout(idleTimer);
    if (view !== 'play' || phase === 'done') return;
    idleTimer = setTimeout(() => {
      idleTimer = 0;
      if (ptr || phase === 'done' || view !== 'play') return;
      if (mode === 'guided') playDemo();
      else {
        headEl._hint = true;
        render();
        later(() => { headEl._hint = false; render(); }, 1800);
      }
      armIdle();
    }, mode === 'guided' ? 5200 : 9000);
  }

  function stopActivity() {
    clearTimers();
    stopDemo();
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
    if (ptr) {
      const id = ptr.id;
      ptr = null;
      try { if (paperEl.hasPointerCapture && paperEl.hasPointerCapture(id)) paperEl.releasePointerCapture(id); } catch (err) { /* ignore */ }
    }
    FK.sound.scribbleStop();
    if (headEl) headEl._hint = false;
  }

  /* ---------- screen ---------- */

  function onResize() {
    if (view !== 'play' || !cur) return;
    refit();
    svgRect = svg.getBoundingClientRect();
    render();
  }
  function onOrient() { later(onResize, 250); }
  function onKey(e) {
    if (e.key !== 'Escape' || view !== 'play' || document.querySelector('.modal')) return;
    e.stopImmediatePropagation();
    e.preventDefault();
    showOver();
  }
  function onVis() {
    if (document.hidden) {
      if (ptr) onUp({ pointerId: ptr.id });
      FK.sound.scribbleStop();
    }
  }

  FK.screen('trace', {
    build(r) {
      root = r;
      const bar = FK.ui.topbar({
        title: 'Schreiben',
        onBack: () => { if (view === 'play') showOver(); else FK.back(); },
      });
      backUse = bar.querySelector('.btn-back use');
      tabsEl = h('nav', { class: 'tr-tabs', 'aria-label': 'ABC abc 123' });
      gridEl = h('div', { class: 'tr-grid' });
      gridScroll = h('div', { class: 'scroll tr-scroll' }, gridEl);
      overEl = h('div', { class: 'tr-over-view' }, tabsEl, gridScroll);
      playEl = h('div', { class: 'tr-play', hidden: true }, buildPaper(), buildTools());
      r.append(bar, overEl, playEl);
      if (window.ResizeObserver) ro = new ResizeObserver(() => { if (active) onResize(); });
      // Words follow the parents' GROSS/normal setting.
      FK.on('settings', (e) => {
        if (e.key !== 'schrift' || !cur || !playEl.classList.contains('is-done')) return;
        const old = endEl.querySelector('.tr-card');
        if (old) old.replaceWith(anlautCard());
      });
    },
    enter(params) {
      params = params || {};
      active = true;
      window.addEventListener('resize', onResize);
      window.addEventListener('orientationchange', onOrient);
      window.addEventListener('keydown', onKey, true);
      document.addEventListener('visibilitychange', onVis);
      if (ro) ro.observe(paperEl);
      if (params.set && setById(params.set)) setId = params.set;
      if (!setById(setId) && sets().length) setId = sets()[0].id;
      if (params.glyph && FK.glyphs && FK.glyphs.data[params.glyph]) openGlyph(params.glyph, params.mode);
      else showOver();
    },
    leave() {
      active = false;
      token++;
      stopActivity();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onOrient);
      window.removeEventListener('keydown', onKey, true);
      document.removeEventListener('visibilitychange', onVis);
      if (ro) ro.disconnect();
      phase = 'ready';
    },
  });
})();
