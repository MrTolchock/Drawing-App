/* Farbklecks – Mal-Motor für «Ausmalen» und «Freies Malen».

   const eng = FK.engine.create({ host, kind: 'color' | 'free', onChange, onZoom });
   Layers (bottom → top): paper colour (CSS), paint, live glow/base/top (stroke in progress), outline, labels.

   kind 'color':  one finger paints, two fingers pinch-zoom. Crayons stay inside the region where the stroke
                  started; the bucket fills the whole outlined region (over earlier scribbles).
   kind 'free':   several fingers can draw at once; mirror modes; bucket = classic flood fill on the paint. */
(function () {
  'use strict';
  const FK = window.FK;
  const TAU = Math.PI * 2;
  const clamp = FK.clamp;
  const INK = [35, 32, 61];
  const GLOW_ALPHA = 0.38;
  const WALL = 110;
  const UNDO_MAX_BYTES = 90e6;
  const UNDO_MAX_STEPS = 40;
  const MAX_PIXELS = 3.4e6;

  // Palm rejection: while an Apple Pencil touches the glass (and shortly after), fingers don't paint.
  const pens = { ids: new Set(), until: 0 };
  window.addEventListener('pointerdown', (e) => { if (e.pointerType === 'pen') pens.ids.add(e.pointerId); }, true);
  const penUp = (e) => { if (e.pointerType === 'pen' && pens.ids.delete(e.pointerId)) pens.until = performance.now() + 1200; };
  window.addEventListener('pointerup', penUp, true);
  window.addEventListener('pointercancel', penUp, true);

  /* ---------- fill patterns ---------- */
  const PATTERNS = [
    { id: 'voll', name: 'Voll' },
    { id: 'punkte', name: 'Punkte' },
    { id: 'streifen', name: 'Streifen' },
    { id: 'karo', name: 'Karo' },
    { id: 'sterne', name: 'Sterne' },
    { id: 'herzli', name: 'Herzli' },
    { id: 'wellen', name: 'Wellen' },
    { id: 'glitzer', name: 'Glitzer' },
  ];

  function lum(hex) {
    const c = FK.color.hexRgb(hex);
    return 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2];
  }
  function accentOf(hex) {
    return lum(hex) > 200 ? FK.color.mix(hex, '#000000', 0.2) : FK.color.mix(hex, '#ffffff', 0.62);
  }

  const tileCache = new Map();
  function patternTile(id, hex, k) {
    const s = Math.max(8, Math.round(26 * k));
    const key = id + hex + s;
    let c = tileCache.get(key);
    if (c) return c;
    c = document.createElement('canvas');
    c.width = c.height = s;
    const g = c.getContext('2d');
    g.fillStyle = hex;
    g.fillRect(0, 0, s, s);
    const fg = accentOf(hex);
    g.fillStyle = fg;
    g.strokeStyle = fg;
    g.lineCap = 'round';
    g.lineJoin = 'round';
    if (id === 'punkte') {
      [[0.25, 0.25], [0.75, 0.75]].forEach((p) => {
        g.beginPath();
        g.arc(p[0] * s, p[1] * s, s * 0.13, 0, TAU);
        g.fill();
      });
    } else if (id === 'streifen') {
      g.lineWidth = s * 0.2;
      g.lineCap = 'butt';
      for (let i = -1; i <= 1; i++) {
        g.beginPath();
        g.moveTo(i * s - 1, -1);
        g.lineTo(i * s + s + 1, s + 1);
        g.stroke();
      }
    } else if (id === 'karo') {
      g.fillRect(0, 0, s / 2, s / 2);
      g.fillRect(s / 2, s / 2, s / 2, s / 2);
    } else if (id === 'sterne') {
      FK.brushes.starPath(g, s / 2, s / 2, s * 0.3, s * 0.14, 5, -Math.PI / 2);
      g.fill();
    } else if (id === 'herzli') {
      g.save();
      g.translate(s / 2, s / 2);
      FK.brushes.heartPath(g, s * 0.24);
      g.fill();
      g.restore();
    } else if (id === 'wellen') {
      g.lineWidth = s * 0.13;
      g.beginPath();
      for (let x = 0; x <= s; x += 1) {
        const y = s * 0.5 + Math.sin((x / s) * TAU) * s * 0.17;
        if (x) g.lineTo(x, y);
        else g.moveTo(x, y);
      }
      g.stroke();
    }
    if (tileCache.size > 40) tileCache.delete(tileCache.keys().next().value);
    tileCache.set(key, c);
    return c;
  }

  function create(opts) {
    const kind = opts.kind || 'free';
    const h = FK.h;

    /* ---------- DOM ---------- */
    const stage = h('div', { class: 'pt-stage pt-' + kind });
    const zoomer = h('div', { class: 'pt-zoomer' });
    const paperEl = h('div', { class: 'paper' });
    const clipEl = h('div', { class: 'paper-clip' });
    const cv = {
      paint: h('canvas', { class: 'cv-paint' }),
      glow: h('canvas', { class: 'live glow' }),
      base: h('canvas', { class: 'live' }),
      top: h('canvas', { class: 'live' }),
      outline: h('canvas', { class: 'cv-outline' }),
    };
    const guidesWrap = h('div', { class: 'guides-wrap', html: '<svg class="guides" preserveAspectRatio="none" aria-hidden="true"></svg>' });
    const guides = guidesWrap.firstChild;
    const labels = h('div', { class: 'pt-labels' });
    const flash = h('div', { class: 'flash' });
    clipEl.append(cv.paint, cv.glow, cv.base, cv.top, cv.outline, guidesWrap, labels, flash);
    paperEl.append(clipEl, h('span', { class: 'tape tape-l', 'aria-hidden': 'true' }), h('span', { class: 'tape tape-r', 'aria-hidden': 'true' }));
    zoomer.append(paperEl);
    stage.append(zoomer);
    opts.host.append(stage);

    const ctx = {};
    Object.keys(cv).forEach((k) => { ctx[k] = cv[k].getContext('2d'); });
    const L = { paint: ctx.paint, glow: ctx.glow, base: ctx.base, top: ctx.top };
    let undoBase = null;
    let undoBaseCtx = null;
    let eraseLayer = null;
    let eraseCtx = null;

    const S = { W: 0, H: 0, paper: '#ffffff', page: null, alpha: null, reg: null, masks: new Map(), dirty: false, busy: false, hue: 0, pw: 0, ph: 0 };
    const T = { kind: 'brush', brush: 'filz', color: '#e5322d', rainbow: false, pattern: 'voll', size: 1, emoji: '🐱', mirror: 'off' };

    /* ---------- size & fit ---------- */
    function margin() { return Math.min(window.innerWidth, window.innerHeight) < 520 ? 6 : 14; }
    function areaSize() {
      const r = stage.getBoundingClientRect();
      const m = margin();
      return { w: Math.max(80, r.width - m * 2), h: Math.max(80, r.height - m * 2) };
    }
    function sizeForArea() {
      const a = areaSize();
      let s = clamp(window.devicePixelRatio || 1, 1, 2);
      if (a.w * a.h * s * s > MAX_PIXELS) s = Math.sqrt(MAX_PIXELS / (a.w * a.h));
      return { W: Math.round(a.w * s), H: Math.round(a.h * s) };
    }
    function setSize(W, H) {
      S.W = W;
      S.H = H;
      Object.values(cv).forEach((c) => {
        c.width = W;
        c.height = H;
      });
      if (undoBase) {
        undoBase.width = W;
        undoBase.height = H;
      }
      if (eraseLayer) {
        eraseLayer.width = W;
        eraseLayer.height = H;
      }
      S.alpha = null;
      S.reg = null;
      S.masks.clear();
      fit();
      updateGuides();
    }
    function clearAll() {
      Object.values(ctx).forEach((g) => g.clearRect(0, 0, S.W, S.H));
    }
    function clearLive() {
      ctx.glow.clearRect(0, 0, S.W, S.H);
      ctx.base.clearRect(0, 0, S.W, S.H);
      ctx.top.clearRect(0, 0, S.W, S.H);
    }
    function fit() {
      if (!S.W) return;
      const r = stage.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const m = margin();
      const s = Math.min((r.width - m * 2) / S.W, (r.height - m * 2) / S.H);
      S.pw = Math.max(40, Math.floor(S.W * s));
      S.ph = Math.max(40, Math.floor(S.H * s));
      zoomer.style.width = S.pw + 'px';
      zoomer.style.height = S.ph + 'px';
      paperEl.style.setProperty('--pw', S.pw + 'px');
      clampZoom();
      applyZoom();
      if (session) session.rect = clipEl.getBoundingClientRect();
    }
    function paperScale() { return S.W / Math.max(1, clipEl.getBoundingClientRect().width); }
    function setPaper(hex) {
      S.paper = hex;
      paperEl.style.backgroundColor = hex;
    }

    /* ---------- outline & regions ---------- */
    function applyOutline(pageId) {
      S.page = pageId ? FK.art.find(pageId) : null;
      S.masks.clear();
      if (!S.page) {
        ctx.outline.clearRect(0, 0, S.W, S.H);
        S.alpha = null;
        S.reg = null;
        return;
      }
      const k = S.W / Math.max(1, S.pw || clipEl.getBoundingClientRect().width || S.W / 2);
      S.alpha = FK.art.renderOutline(cv.outline, S.page, 4.2 * k, INK);
      const R = FK.art.regions(S.alpha, S.W, S.H, WALL);
      const box = new Int32Array(R.n * 4);
      for (let r = 0; r < R.n; r++) {
        box[r * 4] = S.W;
        box[r * 4 + 1] = S.H;
        box[r * 4 + 2] = -1;
        box[r * 4 + 3] = -1;
      }
      const lab = R.lab;
      for (let y = 0, i = 0; y < S.H; y++) {
        for (let x = 0; x < S.W; x++, i++) {
          const r = lab[i];
          if (r < 0) continue;
          const o = r * 4;
          if (x < box[o]) box[o] = x;
          if (y < box[o + 1]) box[o + 1] = y;
          if (x > box[o + 2]) box[o + 2] = x;
          if (y > box[o + 3]) box[o + 3] = y;
        }
      }
      S.reg = { lab, n: R.n, box };
    }

    function regionAt(x, y, R) {
      if (!S.reg) return -1;
      x = Math.round(x);
      y = Math.round(y);
      const W = S.W;
      const lab = S.reg.lab;
      if (x >= 0 && y >= 0 && x < W && y < S.H && lab[y * W + x] >= 0) return lab[y * W + x];
      for (let r = 1; r <= (R || 0); r++) {
        for (let dy = -r; dy <= r; dy++) {
          for (let dx = -r; dx <= r; dx++) {
            if (Math.abs(dx) !== r && Math.abs(dy) !== r) continue;
            const xx = x + dx;
            const yy = y + dy;
            if (xx < 0 || yy < 0 || xx >= W || yy >= S.H) continue;
            const v = lab[yy * W + xx];
            if (v >= 0) return v;
          }
        }
      }
      return -1;
    }

    // Canvas whose alpha is 255 inside region r (grown 2px under the outline so no seam shows).
    function regionMask(r) {
      let m = S.masks.get(r);
      if (m) {
        S.masks.delete(r);
        S.masks.set(r, m);
        return m;
      }
      const W = S.W;
      const b = S.reg.box;
      const x0 = Math.max(0, b[r * 4] - 2);
      const y0 = Math.max(0, b[r * 4 + 1] - 2);
      const x1 = Math.min(W - 1, b[r * 4 + 2] + 2);
      const y1 = Math.min(S.H - 1, b[r * 4 + 3] + 2);
      const w = x1 - x0 + 1;
      const hh = y1 - y0 + 1;
      const lab = S.reg.lab;
      const inside = new Uint8Array(w * hh);
      for (let y = 0; y < hh; y++) {
        const row = (y0 + y) * W + x0;
        for (let x = 0; x < w; x++) if (lab[row + x] === r) inside[y * w + x] = 1;
      }
      for (let pass = 0; pass < 2; pass++) {
        const add = [];
        for (let y = 0; y < hh; y++) {
          for (let x = 0; x < w; x++) {
            const i = y * w + x;
            if (inside[i] || lab[(y0 + y) * W + x0 + x] !== -1) continue;
            if ((x > 0 && inside[i - 1]) || (x < w - 1 && inside[i + 1]) || (y > 0 && inside[i - w]) || (y < hh - 1 && inside[i + w])) add.push(i);
          }
        }
        for (let i = 0; i < add.length; i++) inside[add[i]] = 1;
      }
      const img = new ImageData(w, hh);
      for (let i = 0; i < inside.length; i++) if (inside[i]) img.data[i * 4 + 3] = 255;
      const c = document.createElement('canvas');
      c.width = w;
      c.height = hh;
      c.getContext('2d').putImageData(img, 0, 0);
      m = { canvas: c, x: x0, y: y0, w, h: hh };
      S.masks.set(r, m);
      if (S.masks.size > 24) S.masks.delete(S.masks.keys().next().value);
      return m;
    }

    /* ---------- mirror (free drawing) ---------- */
    function mirrorMats() {
      const W = S.W;
      const H = S.H;
      if (kind !== 'free' || T.kind === 'fill') return [[1, 0, 0, 1, 0, 0]];
      if (T.mirror === 'spiegel') return [[1, 0, 0, 1, 0, 0], [-1, 0, 0, 1, W, 0]];
      if (T.mirror === 'kaleido') {
        const cx = W / 2;
        const cy = H / 2;
        const out = [];
        for (let i = 0; i < 4; i++) {
          const a = (i * Math.PI) / 2;
          const c = Math.round(Math.cos(a));
          const s = Math.round(Math.sin(a));
          out.push([c, s, -s, c, cx - c * cx + s * cy, cy - s * cx - c * cy]);
          out.push([-c, -s, -s, c, cx + c * cx + s * cy, cy + s * cx - c * cy]);
        }
        return out;
      }
      return [[1, 0, 0, 1, 0, 0]];
    }
    function updateGuides() {
      const W = S.W;
      const H = S.H;
      guides.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      let html = '';
      if (kind === 'free' && T.mirror === 'spiegel') html = '<line x1="' + W / 2 + '" y1="0" x2="' + W / 2 + '" y2="' + H + '"/>';
      if (kind === 'free' && T.mirror === 'kaleido') {
        const cx = W / 2;
        const cy = H / 2;
        const R = W + H;
        [0, 45, 90, 135].forEach((deg) => {
          const a = (deg * Math.PI) / 180;
          html += '<line x1="' + (cx - Math.cos(a) * R) + '" y1="' + (cy - Math.sin(a) * R) + '" x2="' + (cx + Math.cos(a) * R) + '" y2="' + (cy + Math.sin(a) * R) + '"/>';
        });
      }
      guides.innerHTML = html;
    }

    /* ---------- zoom (colouring) ---------- */
    const Z = { z: 1, tx: 0, ty: 0 };
    let pinch = null;
    let afterPinch = false;
    function clampZoom() {
      Z.z = clamp(Z.z, 1, 4);
      Z.tx = clamp(Z.tx, S.pw - S.pw * Z.z, 0);
      Z.ty = clamp(Z.ty, S.ph - S.ph * Z.z, 0);
    }
    function applyZoom() {
      zoomer.style.transform = Z.z === 1 ? '' : 'translate(' + Z.tx + 'px,' + Z.ty + 'px) scale(' + Z.z + ')';
      stage.classList.toggle('zoomed', Z.z > 1);
      if (opts.onZoom) opts.onZoom(Z.z);
    }
    function zoomReset() {
      Z.z = 1;
      Z.tx = 0;
      Z.ty = 0;
      applyZoom();
    }
    function touchPair() {
      const v = Array.from(touches.values());
      return v.length >= 2 ? [v[0], v[1]] : null;
    }
    function pinchStart() {
      const p = touchPair();
      if (!p) return;
      const sr = stage.getBoundingClientRect();
      const bx = sr.left + zoomer.offsetLeft;
      const by = sr.top + zoomer.offsetTop;
      const mx = (p[0].x + p[1].x) / 2;
      const my = (p[0].y + p[1].y) / 2;
      pinch = {
        bx, by,
        d: Math.max(20, Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y)),
        z: Z.z,
        cx: (mx - bx - Z.tx) / Z.z,
        cy: (my - by - Z.ty) / Z.z,
      };
      afterPinch = true;
    }
    function pinchMove() {
      const p = touchPair();
      if (!p || !pinch) return;
      const d = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
      const mx = (p[0].x + p[1].x) / 2;
      const my = (p[0].y + p[1].y) / 2;
      Z.z = clamp((pinch.z * d) / pinch.d, 1, 4);
      Z.tx = mx - pinch.bx - pinch.cx * Z.z;
      Z.ty = my - pinch.by - pinch.cy * Z.z;
      clampZoom();
      applyZoom();
    }
    function pinchEnd() {
      pinch = null;
      if (Z.z < 1.06) zoomReset();
    }

    /* ---------- strokes ---------- */
    let session = null;
    let clipRaf = 0;
    const touches = new Map();
    let pendingFill = null;

    function activeBrush() {
      if (T.kind === 'brush') return FK.BRUSHES[T.brush] || FK.BRUSHES.filz;
      if (T.kind === 'eraser') return FK.BRUSHES.eraser;
      if (T.kind === 'stamp') return FK.BRUSHES.stamp;
      return null;
    }
    function toPaper(e, rect) {
      return { x: ((e.clientX - rect.left) * S.W) / rect.width, y: ((e.clientY - rect.top) * S.H) / rect.height };
    }
    function pressure(e, prev) {
      if (e.pointerType !== 'pen' || !e.pressure) return prev == null ? 1 : prev;
      const f = 0.35 + e.pressure * 1.3;
      return prev == null ? f : prev * 0.6 + f * 0.4;
    }
    function ensureUndoBase() {
      if (!undoBase) {
        undoBase = document.createElement('canvas');
        undoBaseCtx = undoBase.getContext('2d');
      }
      if (undoBase.width !== S.W || undoBase.height !== S.H) {
        undoBase.width = S.W;
        undoBase.height = S.H;
      }
    }
    function ensureEraseLayer() {
      if (!eraseLayer) {
        eraseLayer = document.createElement('canvas');
        eraseCtx = eraseLayer.getContext('2d');
      }
      if (eraseLayer.width !== S.W || eraseLayer.height !== S.H) {
        eraseLayer.width = S.W;
        eraseLayer.height = S.H;
      }
    }

    function beginSession(b, p) {
      const rect = clipEl.getBoundingClientRect();
      session = {
        brush: b,
        rect,
        k: S.W / rect.width,
        strokes: new Map(),
        mats: mirrorMats(),
        box: [Infinity, Infinity, -Infinity, -Infinity],
        raf: 0,
        t0: performance.now(),
        moved: 0,
        mask: null,
        layers: b === FK.BRUSHES.neon ? ['glow', 'base', 'top'] : b === FK.BRUSHES.glitzer ? ['base', 'top'] : ['base'],
      };
      if (kind === 'color' && S.reg && b !== FK.BRUSHES.stamp) {
        const pp = toPaper(p, rect);
        const r = regionAt(pp.x, pp.y, Math.round(14 * session.k));
        if (r >= 0) session.mask = regionMask(r);
      }
      if (b.direct) {
        ensureUndoBase();
        undoBaseCtx.clearRect(0, 0, S.W, S.H);
        undoBaseCtx.drawImage(cv.paint, 0, 0);
        if (session.mask) ensureEraseLayer();
      }
      if (b.sound) FK.sound.scribbleStart(b.sound);
      if (b.tick) session.raf = requestAnimationFrame(tickLoop);
    }
    function tickLoop() {
      if (!session) return;
      session.strokes.forEach((st) => step(st, 'tick'));
      session.raf = requestAnimationFrame(tickLoop);
    }
    function setT(m) {
      L.paint.setTransform(m[0], m[1], m[2], m[3], m[4], m[5]);
      L.glow.setTransform(m[0], m[1], m[2], m[3], m[4], m[5]);
      L.base.setTransform(m[0], m[1], m[2], m[3], m[4], m[5]);
      L.top.setTransform(m[0], m[1], m[2], m[3], m[4], m[5]);
    }

    function step(st, ph, p) {
      const s = session;
      const b = s.brush;
      const seg = FK.brushes.makeSeg(st, ph, p);
      const d = b.plan(seg, st);
      if (!d) return;
      const M = s.mats;
      if (b === FK.BRUSHES.eraser && s.mask) {
        FK.BRUSHES.filz.paint({ base: eraseCtx }, { seg: d.seg, w: d.w, c: '#000' });
      } else {
        for (let i = 0; i < M.length; i++) {
          setT(M[i]);
          b.paint(L, d);
        }
        setT([1, 0, 0, 1, 0, 0]);
      }
      const r = st.size * b.reach * (st.pen ? 1.7 : 1) + 3;
      const x0 = Math.min(seg.x0, seg.cx, seg.x1) - r;
      const y0 = Math.min(seg.y0, seg.cy, seg.y1) - r;
      const x1 = Math.max(seg.x0, seg.cx, seg.x1) + r;
      const y1 = Math.max(seg.y0, seg.cy, seg.y1) + r;
      const box = s.box;
      for (let i = 0; i < M.length; i++) {
        const m = M[i];
        for (let c = 0; c < 4; c++) {
          const x = c & 1 ? x1 : x0;
          const y = c & 2 ? y1 : y0;
          const X = m[0] * x + m[2] * y + m[4];
          const Y = m[1] * x + m[3] * y + m[5];
          if (X < box[0]) box[0] = X;
          if (Y < box[1]) box[1] = Y;
          if (X > box[2]) box[2] = X;
          if (Y > box[3]) box[3] = Y;
        }
      }
      if (s.mask && !clipRaf) clipRaf = requestAnimationFrame(applyClip);
      if (d.fx) brushFx(b, d.fx, M);
    }

    function maskLayer(g, m) {
      g.save();
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.globalCompositeOperation = 'destination-in';
      g.drawImage(m.canvas, m.x, m.y);
      g.restore();
      g.clearRect(0, 0, S.W, m.y);
      g.clearRect(0, m.y + m.h, S.W, S.H - m.y - m.h);
      g.clearRect(0, m.y, m.x, m.h);
      g.clearRect(m.x + m.w, m.y, S.W - m.x - m.w, m.h);
    }
    // Keeps the stroke in progress inside its region (runs once per frame).
    function applyClip() {
      clipRaf = 0;
      const s = session;
      if (!s || !s.mask) return;
      const m = s.mask;
      if (s.brush === FK.BRUSHES.eraser) {
        maskLayer(eraseCtx, m);
        ctx.paint.save();
        ctx.paint.globalCompositeOperation = 'destination-out';
        ctx.paint.drawImage(eraseLayer, 0, 0);
        ctx.paint.restore();
        eraseCtx.clearRect(0, 0, S.W, S.H);
      } else {
        s.layers.forEach((k) => maskLayer(ctx[k], m));
      }
    }

    function sessionRect(s) {
      const x = Math.max(0, Math.floor(s.box[0]));
      const y = Math.max(0, Math.floor(s.box[1]));
      const w = Math.min(S.W, Math.ceil(s.box[2])) - x;
      const hh = Math.min(S.H, Math.ceil(s.box[3])) - y;
      return w > 0 && hh > 0 ? [x, y, w, hh] : null;
    }

    function endSession() {
      const s = session;
      if (!s) return;
      if (clipRaf) {
        cancelAnimationFrame(clipRaf);
        clipRaf = 0;
      }
      if (s.mask) applyClip();
      session = null;
      if (s.raf) cancelAnimationFrame(s.raf);
      FK.sound.scribbleStop();
      const r = sessionRect(s);
      if (!r) {
        clearLive();
        return;
      }
      const [x, y, w, hh] = r;
      let before;
      if (s.brush.direct) {
        before = undoBaseCtx.getImageData(x, y, w, hh);
      } else {
        before = ctx.paint.getImageData(x, y, w, hh);
        ctx.paint.globalAlpha = GLOW_ALPHA;
        ctx.paint.drawImage(cv.glow, x, y, w, hh, x, y, w, hh);
        ctx.paint.globalAlpha = 1;
        ctx.paint.drawImage(cv.base, x, y, w, hh, x, y, w, hh);
        ctx.paint.drawImage(cv.top, x, y, w, hh, x, y, w, hh);
        clearLive();
      }
      pushUndo({ type: 'patch', x, y, data: before });
      S.dirty = true;
      changed();
    }

    // Throws the stroke in progress away (a second finger turned it into a pinch).
    function cancelSession() {
      const s = session;
      if (!s) return;
      if (clipRaf) {
        cancelAnimationFrame(clipRaf);
        clipRaf = 0;
      }
      session = null;
      if (s.raf) cancelAnimationFrame(s.raf);
      FK.sound.scribbleStop();
      clearLive();
      if (s.brush.direct) {
        const r = sessionRect(s);
        if (r) {
          ctx.paint.clearRect(r[0], r[1], r[2], r[3]);
          ctx.paint.drawImage(undoBase, r[0], r[1], r[2], r[3], r[0], r[1], r[2], r[3]);
        }
        if (eraseCtx) eraseCtx.clearRect(0, 0, S.W, S.H);
      }
    }

    function brushFx(b, pts, M) {
      const n = Math.min(M.length, 4);
      const rect = session ? session.rect : clipEl.getBoundingClientRect();
      for (const p of pts) {
        for (let i = 0; i < n; i++) {
          const m = M[i];
          const x = m[0] * p.x + m[2] * p.y + m[4];
          const y = m[1] * p.x + m[3] * p.y + m[5];
          const sx = rect.left + (x / S.W) * rect.width;
          const sy = rect.top + (y / S.H) * rect.height;
          if (b === FK.BRUSHES.stamp) FK.fx.burst(sx, sy);
          else FK.fx.twinkle(sx, sy, i % 2 ? '#fff6b3' : '#ffffff');
        }
      }
      if (b !== FK.BRUSHES.stamp) FK.sound.twinkle();
    }

    function startStroke(e) {
      const b = activeBrush();
      if (!b) return;
      finishFill();
      if (session && (session.brush !== b || kind === 'color')) endSession();
      if (!session) beginSession(b, e);
      const st = {
        size: b.sizes[T.size] * session.k,
        color: T.color,
        rainbow: !!T.rainbow,
        hue: S.hue,
        acc: 0,
        pr: pressure(e, null),
        pen: e.pointerType === 'pen',
        k: session.k,
        emoji: T.emoji,
        t: performance.now(),
        cx: e.clientX,
        cy: e.clientY,
        sx: e.clientX,
        sy: e.clientY,
      };
      session.strokes.set(e.pointerId, st);
      step(st, 'down', toPaper(e, session.rect));
      if (b === FK.BRUSHES.stamp) FK.sound.pop();
    }

    function onDown(e) {
      if (e.button > 0 || S.busy) return;
      if (e.pointerType === 'touch' && (pens.ids.size > 0 || performance.now() < pens.until)) return;
      e.preventDefault();
      if (e.pointerType === 'touch') touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
      try { stage.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      if (opts.onInteract) opts.onInteract();

      if (kind === 'color' && e.pointerType === 'touch' && touches.size >= 2) {
        if (pinch) return;
        const now = performance.now();
        const young = (pendingFill && now - pendingFill.t < 600) ||
          (session && session.strokes.size === 1 && now - session.t0 < 350 && session.moved < 40) ||
          (!session && !pendingFill);
        if (young && touches.size === 2) {
          pendingFill = null;
          cancelSession();
          pinchStart();
        }
        return;
      }
      if (pinch || afterPinch) return;
      if (T.kind === 'fill') {
        if (!pendingFill) pendingFill = { id: e.pointerId, x: e.clientX, y: e.clientY, t: performance.now() };
        return;
      }
      if (kind === 'color' && session) return;
      startStroke(e);
    }

    function onMove(e) {
      if (e.pointerType === 'touch' && touches.has(e.pointerId)) touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pinch) {
        e.preventDefault();
        pinchMove();
        return;
      }
      if (pendingFill && pendingFill.id === e.pointerId && Math.hypot(e.clientX - pendingFill.x, e.clientY - pendingFill.y) > 14) pendingFill = null;
      if (!session) return;
      const st = session.strokes.get(e.pointerId);
      if (!st) return;
      e.preventDefault();
      const list = e.getCoalescedEvents ? e.getCoalescedEvents() : null;
      const evs = list && list.length ? list : [e];
      const minD = 0.6 * session.k;
      for (let i = 0; i < evs.length; i++) {
        const ev = evs[i];
        const p = toPaper(ev, session.rect);
        const dx = p.x - st.x;
        const dy = p.y - st.y;
        if (dx * dx + dy * dy < minD * minD) continue;
        st.pr = pressure(ev, st.pr);
        step(st, 'move', p);
      }
      session.moved = Math.max(session.moved, Math.hypot(e.clientX - st.sx, e.clientY - st.sy));
      const now = performance.now();
      const dt = now - st.t;
      if (dt > 8) {
        FK.sound.scribbleSpeed(Math.hypot(e.clientX - st.cx, e.clientY - st.cy) / dt);
        st.t = now;
        st.cx = e.clientX;
        st.cy = e.clientY;
      }
    }

    function onUp(e) {
      touches.delete(e.pointerId);
      if (pinch) {
        if (touches.size < 2) pinchEnd();
        return;
      }
      if (afterPinch) {
        if (!touches.size) afterPinch = false;
        return;
      }
      if (pendingFill && pendingFill.id === e.pointerId) {
        const pf = pendingFill;
        pendingFill = null;
        if (e.type === 'pointerup') doFill(pf.x, pf.y);
        return;
      }
      if (!session) return;
      const st = session.strokes.get(e.pointerId);
      if (!st) return;
      step(st, 'up');
      S.hue = st.hue;
      session.strokes.delete(e.pointerId);
      if (!session.strokes.size) endSession();
    }

    stage.addEventListener('pointerdown', onDown);
    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerup', onUp);
    stage.addEventListener('pointercancel', onUp);

    /* ---------- bucket ---------- */
    let fillAnim = null;
    function finishFill() {
      if (fillAnim) fillAnim.finish();
    }

    // Classic flood fill on the paint layer (free drawing). Returns a mask object or null.
    function floodMask(sx, sy) {
      const W = S.W;
      const H = S.H;
      const img = ctx.paint.getImageData(0, 0, W, H);
      const d = img.data;
      const pc = FK.color.hexRgb(S.paper);
      const si = (sy * W + sx) * 4;
      const sa = d[si + 3] / 255;
      const r0 = d[si] * sa + pc[0] * (1 - sa);
      const g0 = d[si + 1] * sa + pc[1] * (1 - sa);
      const b0 = d[si + 2] * sa + pc[2] * (1 - sa);
      const TOL = 44;
      const mask = new Uint8Array(W * H);
      const match = (j) => {
        if (mask[j]) return false;
        const i = j * 4;
        const a = d[i + 3];
        let r;
        let g;
        let b;
        if (a === 0) {
          r = pc[0];
          g = pc[1];
          b = pc[2];
        } else if (a === 255) {
          r = d[i];
          g = d[i + 1];
          b = d[i + 2];
        } else {
          const t = a / 255;
          r = d[i] * t + pc[0] * (1 - t);
          g = d[i + 1] * t + pc[1] * (1 - t);
          b = d[i + 2] * t + pc[2] * (1 - t);
        }
        return Math.abs(r - r0) <= TOL && Math.abs(g - g0) <= TOL && Math.abs(b - b0) <= TOL;
      };
      let minX = sx;
      let maxX = sx;
      let minY = sy;
      let maxY = sy;
      let count = 0;
      const stack = [sx, sy];
      while (stack.length) {
        const y = stack.pop();
        let x = stack.pop();
        let j = y * W + x;
        if (!match(j)) continue;
        while (x > 0 && match(j - 1)) {
          x--;
          j--;
        }
        let up = false;
        let down = false;
        while (x < W && match(j)) {
          mask[j] = 1;
          count++;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y > 0) {
            const m = match(j - W);
            if (m && !up) stack.push(x, y - 1);
            up = m;
          }
          if (y < H - 1) {
            const m = match(j + W);
            if (m && !down) stack.push(x, y + 1);
            down = m;
          }
          x++;
          j++;
        }
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
      if (!count) return null;
      minX = Math.max(0, minX - 1);
      minY = Math.max(0, minY - 1);
      maxX = Math.min(W - 1, maxX + 1);
      maxY = Math.min(H - 1, maxY + 1);
      const w = maxX - minX + 1;
      const hh = maxY - minY + 1;
      const out = new ImageData(w, hh);
      for (let y = 0; y < hh; y++) {
        for (let x = 0; x < w; x++) {
          const j = (minY + y) * W + minX + x;
          const grow = mask[j] || (minX + x > 0 && mask[j - 1]) || (minX + x < W - 1 && mask[j + 1]) || (minY + y > 0 && mask[j - W]) || (minY + y < H - 1 && mask[j + W]);
          if (grow) out.data[(y * w + x) * 4 + 3] = 255;
        }
      }
      const c = document.createElement('canvas');
      c.width = w;
      c.height = hh;
      c.getContext('2d').putImageData(out, 0, 0);
      return { canvas: c, x: minX, y: minY, w, h: hh };
    }

    function paintStyle(g, m, sx, sy, k) {
      if (T.rainbow) {
        const R = Math.max(
          Math.hypot(m.x - sx, m.y - sy), Math.hypot(m.x + m.w - sx, m.y - sy),
          Math.hypot(m.x - sx, m.y + m.h - sy), Math.hypot(m.x + m.w - sx, m.y + m.h - sy)) + 2;
        const grad = g.createRadialGradient(sx, sy, 0, sx, sy, R);
        const cycles = Math.max(1, R / (260 * k));
        const N = Math.ceil(cycles * 12);
        for (let i = 0; i <= N; i++) grad.addColorStop(i / N, FK.color.hsl(S.hue + (i / N) * 360 * cycles, 92, 58));
        S.hue = (S.hue + 70) % 360;
        g.fillStyle = grad;
        g.fillRect(m.x, m.y, m.w, m.h);
        return;
      }
      if (T.pattern && T.pattern !== 'voll' && T.pattern !== 'glitzer') {
        g.fillStyle = g.createPattern(patternTile(T.pattern, T.color, k), 'repeat');
        g.fillRect(m.x, m.y, m.w, m.h);
        return;
      }
      g.fillStyle = T.color;
      g.fillRect(m.x, m.y, m.w, m.h);
      if (T.pattern === 'glitzer') {
        const n = Math.min(900, Math.round((m.w * m.h) / (900 * k * k)));
        const tints = ['#ffffff', '#fff6b3', '#ffd23f', accentOf(T.color)];
        for (let i = 0; i < n; i++) {
          const x = m.x + Math.random() * m.w;
          const y = m.y + Math.random() * m.h;
          const big = Math.random() < 0.2;
          if (big) FK.brushes.sparkle(g, x, y, k * FK.rnd(4, 8), tints[i % tints.length]);
          else {
            g.fillStyle = tints[i % tints.length];
            g.beginPath();
            g.arc(x, y, k * FK.rnd(0.8, 1.8), 0, TAU);
            g.fill();
          }
        }
      }
    }

    function doFill(clientX, clientY) {
      finishFill();
      const rect = clipEl.getBoundingClientRect();
      const k = S.W / rect.width;
      const px = ((clientX - rect.left) * S.W) / rect.width;
      const py = ((clientY - rect.top) * S.H) / rect.height;
      const sx = Math.floor(px);
      const sy = Math.floor(py);
      if (sx < 0 || sy < 0 || sx >= S.W || sy >= S.H) return;
      let m = null;
      if (S.reg) {
        const r = regionAt(sx, sy, Math.round(16 * k));
        if (r >= 0) m = regionMask(r);
      } else {
        m = floodMask(sx, sy);
      }
      FK.fx.ring(clientX, clientY, T.rainbow ? '#ffffff' : T.color);
      if (!m) {
        FK.sound.nope();
        return;
      }
      const tmp = document.createElement('canvas');
      tmp.width = m.w;
      tmp.height = m.h;
      const g = tmp.getContext('2d');
      g.translate(-m.x, -m.y);
      paintStyle(g, m, sx, sy, k);
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.globalCompositeOperation = 'destination-in';
      g.drawImage(m.canvas, 0, 0);
      const before = ctx.paint.getImageData(m.x, m.y, m.w, m.h);
      pushUndo({ type: 'patch', x: m.x, y: m.y, data: before });
      S.dirty = true;

      const maxR = Math.max(
        Math.hypot(m.x - sx, m.y - sy), Math.hypot(m.x + m.w - sx, m.y - sy),
        Math.hypot(m.x - sx, m.y + m.h - sy), Math.hypot(m.x + m.w - sx, m.y + m.h - sy)) + 2;
      const dur = FK.reduced ? 1 : Math.min(560, 220 + (maxR / k) * 0.7);
      const t0 = performance.now();
      let raf = 0;
      const done = () => {
        cancelAnimationFrame(raf);
        ctx.paint.drawImage(tmp, m.x, m.y);
        fillAnim = null;
        changed();
      };
      const frame = (now) => {
        const t = clamp((now - t0) / dur, 0, 1);
        if (t >= 1) return done();
        const r = maxR * (1 - Math.pow(1 - t, 3)) + 2;
        ctx.paint.save();
        ctx.paint.beginPath();
        ctx.paint.arc(sx, sy, r, 0, TAU);
        ctx.paint.clip();
        ctx.paint.drawImage(tmp, m.x, m.y);
        ctx.paint.restore();
        raf = requestAnimationFrame(frame);
      };
      fillAnim = { finish: done };
      raf = requestAnimationFrame(frame);
      FK.sound.blub();
    }

    /* ---------- undo ---------- */
    const undoStack = [];
    let undoBytes = 0;
    function pushUndo(entry) {
      entry.bytes = (entry.data ? entry.data.data.length : 0) + (entry.paint ? entry.paint.data.length : 0) + 64;
      undoStack.push(entry);
      undoBytes += entry.bytes;
      while ((undoBytes > UNDO_MAX_BYTES || undoStack.length > UNDO_MAX_STEPS) && undoStack.length > 1) {
        undoBytes -= undoStack.shift().bytes;
      }
      if (opts.onUndoChange) opts.onUndoChange(undoStack.length);
    }
    function undo() {
      if (S.busy) return false;
      finishFill();
      endSession();
      const e = undoStack.pop();
      if (!e) return false;
      undoBytes -= e.bytes;
      if (e.type === 'patch') ctx.paint.putImageData(e.data, e.x, e.y);
      else restorePage(e);
      if (opts.onUndoChange) opts.onUndoChange(undoStack.length);
      changed();
      return true;
    }
    function clearUndo() {
      undoStack.length = 0;
      undoBytes = 0;
      if (opts.onUndoChange) opts.onUndoChange(0);
    }
    function pageSnapshot() {
      return {
        type: 'page', W: S.W, H: S.H, paper: S.paper, pageId: S.page ? S.page.id : null, dirty: S.dirty,
        paint: S.dirty ? ctx.paint.getImageData(0, 0, S.W, S.H) : null,
      };
    }
    function restorePage(e) {
      if (e.W !== S.W || e.H !== S.H) setSize(e.W, e.H);
      else clearAll();
      setPaper(e.paper);
      applyOutline(e.pageId);
      if (e.paint) ctx.paint.putImageData(e.paint, 0, 0);
      S.dirty = e.dirty;
    }

    function changed() {
      if (opts.onChange) opts.onChange();
    }

    /* ---------- pages ---------- */
    function swap(fn, animate) {
      if (!animate || FK.reduced) {
        fn();
        return Promise.resolve();
      }
      S.busy = true;
      FK.sound.swoosh();
      paperEl.classList.add('fly-out');
      return new Promise((resolve) => {
        setTimeout(() => {
          paperEl.style.transition = 'none';
          paperEl.classList.remove('fly-out');
          void paperEl.offsetWidth;
          paperEl.style.transition = '';
          fn();
          paperEl.classList.add('fly-in');
          S.busy = false;
          setTimeout(() => paperEl.classList.remove('fly-in'), 500);
          resolve();
        }, 340);
      });
    }

    // New empty paper sized for the current screen. { paper, pageId, keepUndo, animate }
    function newPage(o) {
      o = o || {};
      finishFill();
      endSession();
      if (o.keepUndo && S.W) pushUndo(pageSnapshot());
      else clearUndo();
      return swap(() => {
        zoomReset();
        const sz = sizeForArea();
        if (sz.W !== S.W || sz.H !== S.H) setSize(sz.W, sz.H);
        else clearAll();
        setPaper(o.paper || '#ffffff');
        applyOutline(o.pageId || null);
        S.dirty = false;
        changed();
      }, o.animate);
    }

    // Restores a saved drawing: rec = { W, H, paper, pageId }, img = decoded paint layer.
    function load(rec, img) {
      finishFill();
      endSession();
      clearUndo();
      zoomReset();
      if (rec.W !== S.W || rec.H !== S.H) setSize(rec.W, rec.H);
      else clearAll();
      setPaper(rec.paper || '#ffffff');
      applyOutline(rec.pageId || null);
      if (img) ctx.paint.drawImage(img, 0, 0);
      S.dirty = !!img;
    }

    function compose(maxDim) {
      const s = maxDim ? Math.min(1, maxDim / Math.max(S.W, S.H)) : 1;
      const c = document.createElement('canvas');
      c.width = Math.max(1, Math.round(S.W * s));
      c.height = Math.max(1, Math.round(S.H * s));
      const g = c.getContext('2d');
      g.fillStyle = S.paper;
      g.fillRect(0, 0, c.width, c.height);
      g.drawImage(cv.paint, 0, 0, c.width, c.height);
      g.drawImage(cv.outline, 0, 0, c.width, c.height);
      return c;
    }

    // Paint under a label: share of the label's region that is painted and its average colour.
    function sample(x, y, rad) {
      const x0 = clamp(Math.round(x - rad), 0, S.W - 1);
      const y0 = clamp(Math.round(y - rad), 0, S.H - 1);
      const x1 = clamp(Math.round(x + rad), 0, S.W - 1);
      const y1 = clamp(Math.round(y + rad), 0, S.H - 1);
      const w = x1 - x0 + 1;
      const hh = y1 - y0 + 1;
      const d = ctx.paint.getImageData(x0, y0, w, hh).data;
      const r0 = regionAt(x, y, 4);
      const lab = S.reg ? S.reg.lab : null;
      let n = 0;
      let painted = 0;
      let sr = 0;
      let sg = 0;
      let sb = 0;
      for (let yy = 0; yy < hh; yy += 2) {
        for (let xx = 0; xx < w; xx += 2) {
          if (lab && r0 >= 0 && lab[(y0 + yy) * S.W + x0 + xx] !== r0) continue;
          n++;
          const i = (yy * w + xx) * 4;
          if (d[i + 3] > 150) {
            painted++;
            sr += d[i];
            sg += d[i + 1];
            sb += d[i + 2];
          }
        }
      }
      return { coverage: n ? painted / n : 0, rgb: painted ? [sr / painted, sg / painted, sb / painted] : null };
    }

    function doFlash() {
      flash.classList.remove('go');
      void flash.offsetWidth;
      flash.classList.add('go');
    }

    // Frees the big canvases while the screen is hidden (iOS has a tight canvas memory budget).
    function release() {
      finishFill();
      cancelSession();
      Object.values(cv).forEach((c) => {
        c.width = 1;
        c.height = 1;
      });
      if (undoBase) undoBase.width = undoBase.height = 1;
      if (eraseLayer) eraseLayer.width = eraseLayer.height = 1;
      S.W = S.H = 0;
      S.alpha = null;
      S.reg = null;
      S.masks.clear();
      clearUndo();
    }

    if (window.ResizeObserver) new ResizeObserver(() => fit()).observe(stage);
    window.addEventListener('resize', fit);

    return {
      stage, paperEl, labels,
      get W() { return S.W; },
      get H() { return S.H; },
      get paper() { return S.paper; },
      get pageId() { return S.page ? S.page.id : null; },
      get dirty() { return S.dirty; },
      get busy() { return S.busy || !!session || !!fillAnim; },
      get zoom() { return Z.z; },
      get tool() { return Object.assign({}, T); },
      setTool(t) {
        Object.assign(T, t);
        updateGuides();
      },
      newPage, load, undo, clearUndo,
      canUndo: () => undoStack.length > 0,
      settle() {
        finishFill();
        endSession();
      },
      compose,
      paintBlob: () => FK.canvasBlob(cv.paint),
      sample, regionAt,
      paperScale, fit, zoomReset,
      flash: doFlash,
      release,
      PATTERNS,
    };
  }

  FK.engine = { create, PATTERNS, patternTile };
})();
