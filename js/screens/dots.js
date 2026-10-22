/* Farbklecks – Punkt zu Punkt: Zahlen der Reihe nach verbinden, dann wird ein Bild daraus. */
(function () {
  'use strict';
  const FK = window.FK;
  const h = FK.h;
  const INK = '#23203d';
  const LEAF = '#3fd16b';
  const TILE_COLS = ['#ffc93c', '#7fd6ff', '#ff9ec7', '#9be37a', '#c7a6ff', '#ffb37a'];

  let root = null;
  let backUse = null;
  let overEl = null;
  let tabsEl = null;
  let gridEl = null;
  let gridScroll = null;
  let playEl = null;
  let paperEl = null;
  let bgCv = null;
  let cv = null;
  let artCv = null;
  let sideEl = null;
  let nextEl = null;
  let barEl = null;
  let endEl = null;

  let view = 'over';
  let level = [1, 2, 3].indexOf(FK.settings.get('dots.level')) >= 0 ? FK.settings.get('dots.level') : 1;
  let cur = null;
  let page = null;
  let done = -1;          // index of the last connected dot
  let phase = 'play';     // play → closing → reveal → end
  let closeT = 0;
  let ptr = null;         // active finger: { id, x, y } in device pixels of the canvas
  let G = null;           // geometry of the current layout
  let raf = 0;
  let idle = 0;
  let hintAt = 0;
  let token = 0;
  let active = false;
  let ro = null;
  let timers = [];

  const dotsOf = (lvl) => (FK.dots || []).filter((d) => d.level === lvl);
  const isDone = (id) => FK.progress.isDone('dots', id);
  function later(ms, fn) {
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
    clearTimeout(idle);
  }

  /* ---------- overview ---------- */

  function starsHtml(n, max) {
    let s = '';
    for (let i = 0; i < max; i++) s += FK.icon(i < n ? 'star' : 'star-empty', 'ic');
    return s;
  }

  function renderTabs() {
    tabsEl.textContent = '';
    [1, 2, 3].forEach((lvl) => {
      const list = dotsOf(lvl);
      const n = list.filter((d) => isDone(d.id)).length;
      const b = h('button', {
        type: 'button',
        class: 'pp-tab' + (lvl === level ? ' on' : ''),
        'aria-label': 'Stufe ' + lvl,
        'aria-pressed': lvl === level ? 'true' : 'false',
        onclick: () => {
          if (level === lvl) { FK.ui.bounce(b); return; }
          level = lvl;
          FK.settings.set('dots.level', lvl);
          FK.sound.page();
          renderTabs();
          renderGrid(true);
        },
      },
      h('span', { class: 'pp-tab-lvl', html: starsHtml(lvl, lvl) }),
      h('span', { class: 'pp-tab-dots', text: lvl === 1 ? '1 2 3' : lvl === 2 ? '1 … 20' : '1 … 30' }),
      h('span', { class: 'pp-tab-prog', html: FK.icon('star', 'ic') + '<b>' + n + '</b>' }));
      tabsEl.append(b);
    });
  }

  function previewDots(c, d) {
    const ctx = c.getContext('2d');
    const W = c.width;
    const H = c.height;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, W, H);
    const f = FK.art.fitOf(W, H);
    const k = W / 200;
    d.points.forEach((q, i) => {
      const x = f.ox + q[0] * f.s;
      const y = f.oy + q[1] * f.s;
      ctx.beginPath();
      ctx.arc(x, y, (i ? 4.2 : 6.5) * k, 0, Math.PI * 2);
      ctx.fillStyle = i ? '#fff' : LEAF;
      ctx.fill();
      ctx.lineWidth = 2.2 * k;
      ctx.strokeStyle = INK;
      ctx.stroke();
    });
  }

  function renderGrid(resetScroll) {
    gridEl.textContent = '';
    const list = dotsOf(level);
    if (!list.length) {
      gridEl.append(h('p', { class: 'pp-empty', text: 'Kommt bald!' }));
      return;
    }
    const firstOpen = list.find((d) => !isDone(d.id));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    list.forEach((d, i) => {
      const ok = isDone(d.id);
      const c = h('canvas', { width: Math.round(200 * dpr), height: Math.round(200 * dpr) });
      if (ok) FK.art.thumb(c, FK.art.find(d.id));
      else previewDots(c, d);
      const t = h('button', {
        type: 'button',
        class: 'pp-tile' + (ok ? ' is-done' : '') + (d === firstOpen ? ' is-next' : ''),
        'aria-label': ok ? d.name : 'Bild ' + (i + 1),
        style: { '--tilt': ((i % 3) - 1) * 1.2 + 'deg', '--c': TILE_COLS[i % TILE_COLS.length] },
        onclick: () => {
          FK.sound.tick();
          openPic(d);
        },
      }, c);
      const badge = h('span', { class: 'pp-tile-star', html: FK.icon(ok ? 'star' : 'star-empty', 'ic') });
      t.append(badge);
      if (ok) t.append(h('span', { class: 'pp-tile-name', text: FK.text.word(d.name) }));
      else t.append(h('span', { class: 'pp-tile-count', text: String(d.points.length) }));
      gridEl.append(t);
    });
    if (resetScroll) gridScroll.scrollTop = 0;
  }

  function showOver() {
    stopPlay();
    view = 'over';
    backUse.setAttribute('href', '#i-home');
    playEl.hidden = true;
    overEl.hidden = false;
    overEl.classList.remove('pp-in');
    void overEl.offsetWidth;
    overEl.classList.add('pp-in');
    renderTabs();
    renderGrid(false);
  }

  /* ---------- play ---------- */

  function openPic(d) {
    stopPlay();
    token++;
    cur = d;
    page = FK.art.find(d.id);
    level = d.level;
    view = 'play';
    phase = 'play';
    done = -1;
    closeT = 0;
    ptr = null;
    backUse.setAttribute('href', '#i-back');
    overEl.hidden = true;
    playEl.hidden = false;
    playEl.classList.remove('is-end');
    artCv.classList.remove('on');
    cv.classList.remove('pp-fade');
    bgCv.classList.remove('pp-fade');
    endEl.textContent = '';
    playEl.classList.remove('pp-in');
    void playEl.offsetWidth;
    playEl.classList.add('pp-in');
    layout();
    updateSide();
    FK.sound.open();
    armIdle();
    loop();
  }

  function stopPlay() {
    cancelAnimationFrame(raf);
    raf = 0;
    clearTimers();
    ptr = null;
  }

  function layout() {
    if (view !== 'play' || !cur) return;
    // client size: not affected by the entrance animation's transform
    const r = { width: paperEl.clientWidth, height: paperEl.clientHeight };
    if (!r.width || !r.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = Math.round(r.width * dpr);
    const H = Math.round(r.height * dpr);
    [bgCv, cv, artCv].forEach((c) => {
      if (c.width !== W || c.height !== H) {
        c.width = W;
        c.height = H;
      }
    });
    const f = FK.art.fitOf(W, H);
    const css = Math.min(r.width, r.height);
    const pts = cur.points.map((q) => ({ x: f.ox + q[0] * f.s, y: f.oy + q[1] * f.s }));
    // the closest two consecutive dots decide how big the touch area may be
    let minGap = Infinity;
    pts.forEach((p, i) => {
      const q = pts[(i + 1) % pts.length];
      minGap = Math.min(minGap, Math.hypot(p.x - q.x, p.y - q.y));
    });
    const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
    const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
    const r0 = FK.clamp(css * 0.017, 6, 13) * dpr;
    const fs = FK.clamp(css * 0.036, 14, 26) * dpr;
    pts.forEach((p, i) => {
      const q = cur.points[i];
      let dx = q.length > 3 ? q[2] : p.x - cx;
      let dy = q.length > 3 ? q[3] : p.y - cy;
      const l = Math.hypot(dx, dy) || 1;
      dx /= l;
      dy /= l;
      const off = r0 + fs * 0.75;
      p.lx = p.x + dx * off;
      p.ly = p.y + dy * off;
    });
    G = {
      W, H, dpr, f, pts, r: r0, fs,
      hit: FK.clamp(minGap * 0.45, 16 * dpr, 30 * dpr),
      lw: Math.max(9 * f.s, 4.2 * dpr),
    };
    drawBack();
    if (phase === 'reveal' || phase === 'end') drawArt();
    render(performance.now());
  }

  function drawBack() {
    const ctx = bgCv.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, G.W, G.H);
    if (!cur.back) return;
    ctx.save();
    ctx.setTransform(G.f.s, 0, 0, G.f.s, G.f.ox, G.f.oy);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    cur.back(FK.art.helper(ctx, Math.max(9, (4.2 * G.dpr) / G.f.s)));
    ctx.restore();
  }

  function drawArt() {
    FK.art.renderOutline(artCv, page, 4.2 * G.dpr, [35, 32, 61]);
  }

  function updateSide() {
    const n = cur.points.length;
    const next = Math.min(done + 2, n);
    nextEl.textContent = String(next);
    nextEl.classList.remove('pp-bump');
    void nextEl.offsetWidth;
    nextEl.classList.add('pp-bump');
    barEl.style.setProperty('--p', ((done + 1) / n).toFixed(3));
  }

  function loop() {
    cancelAnimationFrame(raf);
    const tick = (t) => {
      raf = 0;
      if (!active || view !== 'play') return;
      if (phase === 'closing') {
        closeT = Math.min(1, closeT + 1 / 26);
        if (closeT >= 1) reveal();
      }
      render(t);
      if (phase === 'play' || phase === 'closing') raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }

  function render(t) {
    if (!G) return;
    const ctx = cv.getContext('2d');
    const { pts, r, fs, dpr } = G;
    const n = pts.length;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, G.W, G.H);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // connected lines
    if (done > 0) {
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i <= done; i++) ctx.lineTo(pts[i].x, pts[i].y);
      if (phase !== 'play' && cur.closed !== false) {
        const a = pts[n - 1];
        const b = pts[0];
        ctx.lineTo(a.x + (b.x - a.x) * closeT, a.y + (b.y - a.y) * closeT);
      }
      ctx.strokeStyle = INK;
      ctx.lineWidth = G.lw;
      ctx.stroke();
    }
    // rubber band from the last dot to the finger
    if (phase === 'play' && ptr && done >= 0) {
      const a = pts[done];
      ctx.save();
      ctx.setLineDash([G.lw * 1.2, G.lw * 1.4]);
      ctx.strokeStyle = LEAF;
      ctx.lineWidth = G.lw * 0.9;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(ptr.x, ptr.y);
      ctx.stroke();
      ctx.restore();
    }

    // dots
    const nx = phase === 'play' ? done + 1 : -1;
    const pulse = 0.5 + 0.5 * Math.sin(t / 220);
    const hint = hintAt && t - hintAt < 1600 ? 1 - (t - hintAt) / 1600 : 0;
    pts.forEach((p, i) => {
      if (i === nx) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * (2.1 + pulse * 0.7 + hint * 1.6), 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(63, 209, 107, ' + (0.18 + hint * 0.25) + ')';
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, i === nx ? r * 1.45 : i <= done ? r * 0.8 : r, 0, Math.PI * 2);
      ctx.fillStyle = i === nx ? LEAF : i <= done ? INK : '#fff';
      ctx.fill();
      if (i > done) {
        ctx.lineWidth = 2.6 * dpr;
        ctx.strokeStyle = INK;
        ctx.stroke();
      }
    });

    // numbers
    if (phase === 'play' || phase === 'closing') {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      pts.forEach((p, i) => {
        const big = i === nx;
        const size = big ? fs * 1.3 : fs;
        ctx.font = '700 ' + Math.round(size) + 'px Andika, "Baloo 2", sans-serif';
        ctx.globalAlpha = i <= done ? 0.35 : 1;
        ctx.lineWidth = size * 0.32;
        ctx.strokeStyle = '#fff';
        ctx.strokeText(String(i + 1), p.lx, p.ly + size * 0.06);
        ctx.fillStyle = big ? '#1f9e4a' : INK;
        ctx.fillText(String(i + 1), p.lx, p.ly + size * 0.06);
      });
      ctx.globalAlpha = 1;
    }
  }

  function toCanvas(e) {
    const r = paperEl.getBoundingClientRect();
    const k = paperEl.offsetWidth ? r.width / paperEl.offsetWidth : 1;
    return { x: ((e.clientX - r.left) / k - paperEl.clientLeft) * G.dpr, y: ((e.clientY - r.top) / k - paperEl.clientTop) * G.dpr };
  }
  function toClient(p) {
    const r = paperEl.getBoundingClientRect();
    return { x: r.left + paperEl.clientLeft + p.x / G.dpr, y: r.top + paperEl.clientTop + p.y / G.dpr };
  }
  // distance from point p to the segment a–b
  function segDist(p, a, b) {
    const vx = b.x - a.x;
    const vy = b.y - a.y;
    const l2 = vx * vx + vy * vy;
    const t = l2 ? FK.clamp(((p.x - a.x) * vx + (p.y - a.y) * vy) / l2, 0, 1) : 0;
    return Math.hypot(a.x + vx * t - p.x, a.y + vy * t - p.y);
  }

  function sweep(from, to) {
    // connect every next dot the finger passes over (also when it moves fast)
    let guard = 0;
    while (phase === 'play' && done + 1 < G.pts.length && guard++ < 40) {
      const q = G.pts[done + 1];
      if (segDist(q, from, to) > G.hit) break;
      connect(done + 1);
    }
  }

  function onDown(e) {
    if (view !== 'play' || phase !== 'play' || !G) return;
    if (ptr && ptr.id !== e.pointerId) {
      if (e.pointerType !== 'pen' || ptr.pen) return;   // extra fingers are ignored, but a pencil beats a resting palm
      ptr = null;
    }
    e.preventDefault();
    try { paperEl.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    const p = toCanvas(e);
    ptr = { id: e.pointerId, x: p.x, y: p.y, pen: e.pointerType === 'pen' };
    const before = done;
    sweep(p, p);
    if (done === before && done < 0) {
      // the child has to begin at the green dot
      hintAt = performance.now();
      FK.sound.tick();
    }
    armIdle();
  }
  function onMove(e) {
    if (!ptr || ptr.id !== e.pointerId || phase !== 'play') return;
    e.preventDefault();
    const p = toCanvas(e);
    const from = { x: ptr.x, y: ptr.y };
    ptr.x = p.x;
    ptr.y = p.y;
    sweep(from, p);
  }
  function onUp(e) {
    if (!ptr || (e && e.pointerId !== undefined && ptr.id !== e.pointerId)) return;
    ptr = null;
  }

  function connect(i) {
    done = i;
    const p = G.pts[i];
    FK.sound.plip(Math.round((i / Math.max(1, G.pts.length - 1)) * 12));
    const c = toClient(p);
    FK.fx.twinkle(c.x, c.y, i % 2 ? '#ffc93c' : '#ffffff');
    if (i && i % 5 === 4) FK.fx.ring(c.x, c.y, '#ffe14a');
    updateSide();
    armIdle();
    if (i === G.pts.length - 1) finish();
  }

  function finish() {
    ptr = null;
    clearTimeout(idle);
    if (cur.closed === false) {
      closeT = 1;
      reveal();
      render(performance.now());
      return;
    }
    phase = 'closing';
    closeT = 0;
    FK.sound.swoosh();
  }

  function reveal() {
    if (phase === 'reveal' || phase === 'end') return;
    phase = 'reveal';
    const my = token;
    drawArt();
    artCv.classList.add('on');
    later(350, () => {
      if (my !== token) return;
      cv.classList.add('pp-fade');
      bgCv.classList.add('pp-fade');
    });
    const c = toClient({ x: G.W / 2, y: G.H / 2 });
    FK.fx.burst(c.x, c.y, null, 14);
    later(700, () => {
      if (my !== token) return;
      phase = 'end';
      showEnd();
      const stars = FK.progress.finish('dots', cur.id, 1);
      FK.ui.celebrate({ stars, from: endEl.querySelector('.pp-name') || paperEl });
    });
  }

  function nextPic() {
    const all = (FK.dots || []).slice().sort((a, b) => a.level - b.level);
    const i = all.indexOf(cur);
    const rest = all.slice(i + 1).concat(all.slice(0, i));
    return rest.find((d) => !isDone(d.id)) || all[(i + 1) % all.length];
  }

  function showEnd() {
    endEl.textContent = '';
    const name = h('div', { class: 'pp-name' }, FK.ui.word(cur.w || cur.name, { cls: 'pp-word' }));
    const acts = h('div', { class: 'pp-acts' },
      FK.ui.btn({ icon: 'crayon', label: 'Ausmalen', cls: 'btn-go pp-paint', onClick: () => {
        FK.sound.click();
        FK.go('color', { pageId: cur.id, mode: 'frei' });
      } }),
      FK.ui.btn({ icon: 'refresh', label: 'Nochmal', onClick: () => openPic(cur) }),
      FK.ui.btn({ icon: 'next', label: 'Weiter', cls: 'btn-sun', onClick: () => openPic(nextPic()) }));
    endEl.append(name, acts);
    playEl.classList.add('is-end');
  }

  function armIdle() {
    clearTimeout(idle);
    if (phase !== 'play') return;
    idle = setTimeout(() => {
      if (!active || view !== 'play' || phase !== 'play') return;
      hintAt = performance.now();
      armIdle();
    }, 5000);
  }

  function onResize() {
    if (active && view === 'play') layout();
  }
  function onKey(e) {
    if (e.key !== 'Escape' || view !== 'play' || document.querySelector('.modal')) return;
    e.stopImmediatePropagation();
    e.preventDefault();
    showOver();
  }

  FK.screen('dots', {
    build(r) {
      root = r;
      const bar = FK.ui.topbar({
        title: 'Punkt zu Punkt',
        onBack: () => { if (view === 'play') showOver(); else FK.back(); },
      });
      backUse = bar.querySelector('.btn-back use');
      tabsEl = h('nav', { class: 'pp-tabs', 'aria-label': 'Stufen' });
      gridEl = h('div', { class: 'pp-grid' });
      gridScroll = h('div', { class: 'scroll pp-scroll' }, gridEl);
      overEl = h('div', { class: 'pp-over' }, tabsEl, gridScroll);

      bgCv = h('canvas', { class: 'pp-cv pp-bg' });
      cv = h('canvas', { class: 'pp-cv pp-dots' });
      artCv = h('canvas', { class: 'pp-cv pp-art' });
      paperEl = h('div', { class: 'pp-paper' }, bgCv, artCv, cv);
      paperEl.addEventListener('pointerdown', onDown);
      paperEl.addEventListener('pointermove', onMove);
      paperEl.addEventListener('pointerup', onUp);
      paperEl.addEventListener('pointercancel', onUp);
      paperEl.addEventListener('lostpointercapture', onUp);

      nextEl = h('div', { class: 'pp-next' });
      barEl = h('div', { class: 'pp-bar' }, h('i'));
      const live = h('div', { class: 'pp-live' }, h('div', { class: 'pp-next-wrap' }, h('span', { class: 'pp-finger', text: '👆' }), nextEl), barEl);
      endEl = h('div', { class: 'pp-end' });
      sideEl = h('div', { class: 'pp-side' }, live, endEl);
      playEl = h('div', { class: 'pp-play', hidden: true }, paperEl, sideEl);
      r.append(bar, overEl, playEl);
      if (window.ResizeObserver) ro = new ResizeObserver(() => { if (active) onResize(); });
      FK.on('settings', (e) => {
        if (e.key !== 'schrift' || !active) return;
        if (view === 'over') renderGrid(false);
        else if (phase === 'end') showEnd();
      });
    },
    enter(params) {
      params = params || {};
      active = true;
      window.addEventListener('resize', onResize);
      window.addEventListener('keydown', onKey, true);
      if (ro) ro.observe(paperEl);
      const d = params.id && (FK.dots || []).find((x) => x.id === params.id);
      if (d) openPic(d);
      else showOver();
    },
    leave() {
      active = false;
      token++;
      stopPlay();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('keydown', onKey, true);
      if (ro) ro.disconnect();
      // free canvas memory (iOS)
      [bgCv, cv, artCv].forEach((c) => { c.width = 0; c.height = 0; });
      G = null;
      if (view === 'play' && phase !== 'end') view = 'over';
    },
  });
})();
