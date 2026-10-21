/* Farbklecks – die Mal-App. Zeichenfläche, Werkzeuge, Galerie. */
(function () {
  'use strict';
  const FK = window.FK;
  const VERSION = '1.0.0';
  const $ = (id) => document.getElementById(id);
  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const INK = [35, 32, 61];
  const GLOW_ALPHA = 0.38;
  const UNDO_MAX_BYTES = 90e6;
  const UNDO_MAX_STEPS = 40;
  const REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- content ---------- */

  const STICKERS = [
    { icon: '🐶', name: 'Tiere', items: [['🐶', 'Hund'], ['🐱', 'Katze'], ['🐰', 'Hase'], ['🦊', 'Fuchs'], ['🐻', 'Bär'], ['🐼', 'Panda'], ['🐯', 'Tiger'], ['🦁', 'Löwe'], ['🐵', 'Affe'], ['🐸', 'Frosch'], ['🐷', 'Schwein'], ['🐔', 'Huhn'], ['🐧', 'Pinguin'], ['🦉', 'Eule'], ['🦄', 'Einhorn'], ['🐢', 'Schildkröte'], ['🐙', 'Krake'], ['🐠', 'Fisch'], ['🐳', 'Wal'], ['🦖', 'Dino'], ['🐞', 'Marienkäfer'], ['🦋', 'Schmetterling'], ['🐝', 'Biene'], ['🐌', 'Schnecke']] },
    { icon: '🌸', name: 'Natur', items: [['🌸', 'Blüte'], ['🌻', 'Sonnenblume'], ['🌷', 'Tulpe'], ['🌹', 'Rose'], ['🍀', 'Kleeblatt'], ['🌲', 'Tanne'], ['🌴', 'Palme'], ['🍄', 'Pilz'], ['🌈', 'Regenbogen'], ['☀️', 'Sonne'], ['🌙', 'Mond'], ['⭐', 'Stern'], ['☁️', 'Wolke'], ['⚡', 'Blitz'], ['❄️', 'Schneeflocke'], ['💧', 'Tropfen'], ['🔥', 'Feuer'], ['🍁', 'Blatt']] },
    { icon: '🍦', name: 'Essen', items: [['🍎', 'Apfel'], ['🍓', 'Erdbeere'], ['🍌', 'Banane'], ['🍒', 'Kirschen'], ['🍉', 'Melone'], ['🍇', 'Trauben'], ['🥕', 'Rüebli'], ['🍦', 'Glace'], ['🍭', 'Lutscher'], ['🧁', 'Muffin'], ['🍩', 'Donut'], ['🍪', 'Guetzli'], ['🍕', 'Pizza'], ['🥐', 'Gipfeli'], ['🎂', 'Torte'], ['🥨', 'Brezel'], ['🍿', 'Popcorn'], ['🍰', 'Kuchen']] },
    { icon: '🎈', name: 'Spass', items: [['🎈', 'Ballon'], ['🎁', 'Geschenk'], ['❤️', 'Herz'], ['💜', 'Herz'], ['👑', 'Krone'], ['💎', 'Diamant'], ['🚀', 'Rakete'], ['🚗', 'Auto'], ['🚒', 'Feuerwehr'], ['🚁', 'Helikopter'], ['⛵', 'Segelboot'], ['🏰', 'Schloss'], ['⚽', 'Fussball'], ['🪁', 'Drachen'], ['🎵', 'Musik'], ['🧸', 'Teddy'], ['👻', 'Gespenst'], ['🤖', 'Roboter'], ['😀', 'Lachen'], ['😎', 'Cool'], ['🥳', 'Party'], ['🌟', 'Glitzerstern'], ['🎨', 'Farben'], ['✏️', 'Bleistift']] },
    { icon: '🇨🇭', name: 'Schweiz', items: [['🇨🇭', 'Schweiz'], ['🏔️', 'Berg'], ['🐄', 'Kuh'], ['🔔', 'Glocke'], ['🧀', 'Käse'], ['🫕', 'Fondue'], ['🍫', 'Schoggi'], ['🚡', 'Gondel'], ['🚂', 'Zug'], ['⌚', 'Uhr'], ['⛷️', 'Skifahrer'], ['🏂', 'Snowboard'], ['🐐', 'Geiss'], ['🦌', 'Hirsch'], ['🦅', 'Adler'], ['🦢', 'Schwan'], ['🍏', 'Apfel'], ['🌄', 'Sonnenaufgang']] },
  ];

  const PAPERS = [
    { hex: '#ffffff', name: 'Weisses Blatt' },
    { hex: '#1d1b3a', name: 'Nachthimmel' },
    { hex: '#cdeaff', name: 'Himmelblau' },
    { hex: '#fff1b8', name: 'Sonnengelb' },
    { hex: '#ffd9e8', name: 'Rosa' },
    { hex: '#d4f5e2', name: 'Mintgrün' },
    { hex: '#d8b48a', name: 'Packpapier' },
  ];

  const MIRRORS = [
    { id: 'off', name: 'Spiegel aus', icon: '#i-mirror-off' },
    { id: 'spiegel', name: 'Spiegel', icon: '#i-mirror' },
    { id: 'kaleido', name: 'Kaleidoskop', icon: '#i-kaleido' },
  ];

  const SIZES = [{ name: 'Klein', dot: 10, r: 5 }, { name: 'Mittel', dot: 18, r: 8 }, { name: 'Gross', dot: 28, r: 12 }, { name: 'Riesig', dot: 42, r: 16 }];

  const PRAISE = [
    { text: 'Mega schön!', say: 'Mega schön!' },
    { text: 'Bravo!', say: 'Bravo!' },
    { text: 'Super gmacht!', say: 'Super gemacht!' },
    { text: 'Wunderschön!', say: 'Wunderschön!' },
    { text: 'Grossartig!', say: 'Grossartig!' },
    { text: 'Ein Kunstwerk!', say: 'Wow, ein Kunstwerk!' },
  ];

  /* ---------- state ---------- */

  const saved = FK.store.loadSettings();
  const S = {
    tool: ['brush', 'stamp', 'fill', 'eraser'].includes(saved.tool) ? saved.tool : 'brush',
    brush: FK.BRUSH_ORDER.includes(saved.brush) ? saved.brush : 'filz',
    colorId: FK.COLORS.some((c) => c.id === saved.color) ? saved.color : 'rot',
    size: [0, 1, 2, 3].includes(saved.size) ? saved.size : 1,
    emoji: typeof saved.emoji === 'string' && saved.emoji ? saved.emoji : '🐱',
    stickerTab: clamp(saved.stickerTab | 0, 0, STICKERS.length - 1),
    mirror: MIRRORS.some((m) => m.id === saved.mirror) ? saved.mirror : 'off',
    sound: saved.sound !== false,
    voice: saved.voice !== false,
    hue: 0,
    W: 0,
    H: 0,
    paper: '#ffffff',
    pageId: null,
    outlineAlpha: null,
    dirty: false,
    galleryId: null,
    changeId: 0,
    savedChangeId: 0,
    busy: false,
  };
  FK.sound.enabled = S.sound;
  FK.voice.enabled = S.voice;

  function persistSettings() {
    FK.store.saveSettings({
      tool: S.tool, brush: S.brush, color: S.colorId, size: S.size, emoji: S.emoji,
      stickerTab: S.stickerTab, mirror: S.mirror, sound: S.sound, voice: S.voice,
    });
  }

  const color = () => FK.COLORS.find((c) => c.id === S.colorId) || FK.COLORS[0];

  /* ---------- elements & layers ---------- */

  const el = {
    stage: $('stage'), paper: $('paper'), clip: $('paper-clip'), guides: $('guides'), flash: $('flash'),
    hint: $('hint'), crayons: $('crayons'), pop: $('pop'), popCard: $('pop-card'), praise: $('praise'),
  };
  const cv = { paint: $('cv-paint'), glow: $('cv-glow'), base: $('cv-base'), top: $('cv-top'), outline: $('cv-outline') };
  const ctx = {};
  Object.keys(cv).forEach((k) => { ctx[k] = cv[k].getContext('2d'); });
  const L = { paint: ctx.paint, glow: ctx.glow, base: ctx.base, top: ctx.top };
  let undoBase = null;
  let undoBaseCtx = null;

  function paperMargin() { return Math.min(window.innerWidth, window.innerHeight) < 520 ? 8 : 20; }

  function areaSize() {
    const r = el.stage.getBoundingClientRect();
    const m = paperMargin();
    return { w: Math.max(80, r.width - m * 2), h: Math.max(80, r.height - m * 2) };
  }

  // Paper resolution for the space we have: sharp on retina, but capped so iPhones don't run out of canvas memory.
  function sizeForArea() {
    const a = areaSize();
    let s = clamp(window.devicePixelRatio || 1, 1, 2);
    const MAX = 3.4e6;
    if (a.w * a.h * s * s > MAX) s = Math.sqrt(MAX / (a.w * a.h));
    return { W: Math.round(a.w * s), H: Math.round(a.h * s) };
  }

  function setCanvasSize(W, H) {
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
    fitPaper();
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

  function fitPaper() {
    if (!S.W) return;
    const r = el.stage.getBoundingClientRect();
    const m = paperMargin();
    const s = Math.min((r.width - m * 2) / S.W, (r.height - m * 2) / S.H);
    el.paper.style.width = Math.max(40, Math.floor(S.W * s)) + 'px';
    el.paper.style.height = Math.max(40, Math.floor(S.H * s)) + 'px';
    if (session) session.rect = el.clip.getBoundingClientRect();
  }

  function paperScale() { return S.W / Math.max(1, el.clip.getBoundingClientRect().width); }

  function setPaper(hex) {
    S.paper = hex;
    el.paper.style.backgroundColor = hex;
  }

  function applyOutline(pageId) {
    S.pageId = pageId || null;
    if (!S.pageId) {
      ctx.outline.clearRect(0, 0, S.W, S.H);
      S.outlineAlpha = null;
      return;
    }
    S.outlineAlpha = FK.pages.renderOutline(cv.outline, S.pageId, 4.5 * paperScale(), INK);
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

  /* ---------- mirror modes ---------- */

  function mirrorMats() {
    const W = S.W;
    const H = S.H;
    if (S.mirror === 'spiegel') return [[1, 0, 0, 1, 0, 0], [-1, 0, 0, 1, W, 0]];
    if (S.mirror === 'kaleido') {
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
    el.guides.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    let html = '';
    if (S.mirror === 'spiegel') html = '<line x1="' + W / 2 + '" y1="0" x2="' + W / 2 + '" y2="' + H + '"/>';
    if (S.mirror === 'kaleido') {
      const cx = W / 2;
      const cy = H / 2;
      const R = W + H;
      [0, 45, 90, 135].forEach((deg) => {
        const a = (deg * Math.PI) / 180;
        html += '<line x1="' + (cx - Math.cos(a) * R) + '" y1="' + (cy - Math.sin(a) * R) + '" x2="' + (cx + Math.cos(a) * R) + '" y2="' + (cy + Math.sin(a) * R) + '"/>';
      });
    }
    el.guides.innerHTML = html;
  }

  /* ---------- drawing engine ---------- */

  let session = null;
  // Palm rejection: while an Apple Pencil is on the glass (and shortly after), finger touches don't draw.
  const pens = { ids: new Set(), until: 0 };

  function activeBrush() {
    if (S.tool === 'brush') return FK.BRUSHES[S.brush];
    if (S.tool === 'eraser') return FK.BRUSHES.eraser;
    if (S.tool === 'stamp') return FK.BRUSHES.stamp;
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

  function beginSession(b) {
    const rect = el.clip.getBoundingClientRect();
    session = {
      brush: b,
      rect,
      k: S.W / rect.width,
      strokes: new Map(),
      mats: mirrorMats(),
      box: [Infinity, Infinity, -Infinity, -Infinity],
      raf: 0,
    };
    if (b.direct) {
      ensureUndoBase();
      undoBaseCtx.clearRect(0, 0, S.W, S.H);
      undoBaseCtx.drawImage(cv.paint, 0, 0);
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
    const b = session.brush;
    const seg = FK.brushes.makeSeg(st, ph, p);
    const d = b.plan(seg, st);
    if (!d) return;
    const M = session.mats;
    for (let i = 0; i < M.length; i++) {
      setT(M[i]);
      b.paint(L, d);
    }
    setT([1, 0, 0, 1, 0, 0]);

    const r = st.size * b.reach * (st.pen ? 1.7 : 1) + 3;
    const x0 = Math.min(seg.x0, seg.cx, seg.x1) - r;
    const y0 = Math.min(seg.y0, seg.cy, seg.y1) - r;
    const x1 = Math.max(seg.x0, seg.cx, seg.x1) + r;
    const y1 = Math.max(seg.y0, seg.cy, seg.y1) + r;
    const box = session.box;
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
    if (d.fx) brushFx(b, d.fx, M, st);
  }

  function endSession() {
    const s = session;
    if (!s) return;
    session = null;
    if (s.raf) cancelAnimationFrame(s.raf);
    FK.sound.scribbleStop();
    const x = Math.max(0, Math.floor(s.box[0]));
    const y = Math.max(0, Math.floor(s.box[1]));
    const w = Math.min(S.W, Math.ceil(s.box[2])) - x;
    const h = Math.min(S.H, Math.ceil(s.box[3])) - y;
    if (w <= 0 || h <= 0) {
      clearLive();
      return;
    }
    let before;
    if (s.brush.direct) {
      before = undoBaseCtx.getImageData(x, y, w, h);
    } else {
      before = ctx.paint.getImageData(x, y, w, h);
      ctx.paint.globalAlpha = GLOW_ALPHA;
      ctx.paint.drawImage(cv.glow, x, y, w, h, x, y, w, h);
      ctx.paint.globalAlpha = 1;
      ctx.paint.drawImage(cv.base, x, y, w, h, x, y, w, h);
      ctx.paint.drawImage(cv.top, x, y, w, h, x, y, w, h);
      clearLive();
    }
    pushUndo({ type: 'patch', x, y, data: before });
    S.dirty = true;
    changed();
  }

  function onDown(e) {
    if (e.button > 0 || S.busy) return;
    FK.sound.unlock();
    keepAwake();
    hideHint();
    const now = performance.now();
    if (e.pointerType === 'touch' && (pens.ids.size > 0 || now < pens.until)) return;
    e.preventDefault();

    if (S.tool === 'fill') {
      if (!session) doFill(e);
      return;
    }
    const b = activeBrush();
    if (!b) return;
    finishFill();
    if (session && session.brush !== b) endSession();
    try { el.clip.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    if (!session) beginSession(b);
    const c = color();
    const st = {
      size: b.sizes[S.size] * session.k,
      color: c.hex,
      rainbow: !!c.rainbow,
      hue: S.hue,
      acc: 0,
      pr: pressure(e, null),
      pen: e.pointerType === 'pen',
      k: session.k,
      emoji: S.emoji,
      t: now,
      cx: e.clientX,
      cy: e.clientY,
    };
    session.strokes.set(e.pointerId, st);
    step(st, 'down', toPaper(e, session.rect));
    if (b === FK.BRUSHES.stamp) FK.sound.pop();
  }

  function onMove(e) {
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
    if (!session) return;
    const st = session.strokes.get(e.pointerId);
    if (!st) return;
    step(st, 'up');
    S.hue = st.hue;
    session.strokes.delete(e.pointerId);
    if (!session.strokes.size) endSession();
  }

  /* ---------- fill bucket ---------- */

  let fillAnim = null;

  function finishFill() {
    if (fillAnim) fillAnim.finish();
  }

  function findOpen(sx, sy, wall, R) {
    const W = S.W;
    for (let r = 1; r <= R; r++) {
      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          if (Math.abs(dx) !== r && Math.abs(dy) !== r) continue;
          const x = sx + dx;
          const y = sy + dy;
          if (x < 0 || y < 0 || x >= W || y >= S.H) continue;
          if (wall[y * W + x] < 110) return [x, y];
        }
      }
    }
    return null;
  }

  function floodFill(sx, sy, k) {
    const W = S.W;
    const H = S.H;
    const img = ctx.paint.getImageData(0, 0, W, H);
    const d = img.data;
    const wall = S.outlineAlpha;
    const WALL = 110;
    if (wall && wall[sy * W + sx] >= WALL) {
      const f = findOpen(sx, sy, wall, Math.round(16 * k));
      if (!f) return null;
      sx = f[0];
      sy = f[1];
    }
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
      if (wall && wall[j] >= WALL) return false;
      const i = j * 4;
      const a = d[i + 3];
      let r, g, b;
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

    let minX = sx, maxX = sx, minY = sy, maxY = sy, count = 0;
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

    // Grow one pixel so the soft edges of strokes and lines don't leave a halo.
    minX = Math.max(0, minX - 1);
    minY = Math.max(0, minY - 1);
    maxX = Math.min(W - 1, maxX + 1);
    maxY = Math.min(H - 1, maxY + 1);
    const grow = [];
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const j = y * W + x;
        if (mask[j]) continue;
        if ((x > 0 && mask[j - 1] === 1) || (x < W - 1 && mask[j + 1] === 1) ||
            (y > 0 && mask[j - W] === 1) || (y < H - 1 && mask[j + W] === 1)) grow.push(j);
      }
    }
    for (let i = 0; i < grow.length; i++) mask[grow[i]] = 2;
    return { mask, img, sx, sy, box: [minX, minY, maxX, maxY], seed: [r0, g0, b0] };
  }

  function doFill(e) {
    finishFill();
    const rect = el.clip.getBoundingClientRect();
    const k = S.W / rect.width;
    const p = toPaper(e, rect);
    const sx = Math.floor(p.x);
    const sy = Math.floor(p.y);
    if (sx < 0 || sy < 0 || sx >= S.W || sy >= S.H) return;
    const c = color();
    const res = floodFill(sx, sy, k);
    fxRing(e.clientX, e.clientY, c.rainbow ? '#ffffff' : c.hex);
    if (!res) {
      FK.sound.nope();
      return;
    }
    const solid = c.rainbow ? null : FK.color.hexRgb(c.hex);
    if (solid && Math.abs(solid[0] - res.seed[0]) < 6 && Math.abs(solid[1] - res.seed[1]) < 6 && Math.abs(solid[2] - res.seed[2]) < 6) {
      FK.sound.blub();
      return;
    }
    const W = S.W;
    const [x0, y0, x1, y1] = res.box;
    const bw = x1 - x0 + 1;
    const bh = y1 - y0 + 1;
    const before = new ImageData(bw, bh);
    for (let y = 0; y < bh; y++) {
      const start = ((y0 + y) * W + x0) * 4;
      before.data.set(res.img.data.subarray(start, start + bw * 4), y * bw * 4);
    }
    const out = new ImageData(bw, bh);
    const od = out.data;
    const mask = res.mask;
    let lut = null;
    const hue0 = S.hue;
    if (!solid) {
      lut = new Uint8Array(360 * 3);
      for (let h = 0; h < 360; h++) {
        const rgb = FK.color.hslRgb(h, 92, 58);
        lut[h * 3] = rgb[0];
        lut[h * 3 + 1] = rgb[1];
        lut[h * 3 + 2] = rgb[2];
      }
    }
    for (let y = 0; y < bh; y++) {
      for (let x = 0; x < bw; x++) {
        const j = (y0 + y) * W + (x0 + x);
        if (!mask[j]) continue;
        const o = (y * bw + x) * 4;
        if (solid) {
          od[o] = solid[0];
          od[o + 1] = solid[1];
          od[o + 2] = solid[2];
        } else {
          const dist = Math.hypot(x0 + x - res.sx, y0 + y - res.sy);
          const h = ((hue0 + (dist / k) * 1.1) | 0) % 360;
          od[o] = lut[h * 3];
          od[o + 1] = lut[h * 3 + 1];
          od[o + 2] = lut[h * 3 + 2];
        }
        od[o + 3] = 255;
      }
    }
    if (!solid) S.hue = (S.hue + 70) % 360;
    pushUndo({ type: 'patch', x: x0, y: y0, data: before });
    S.dirty = true;

    const fc = document.createElement('canvas');
    fc.width = bw;
    fc.height = bh;
    fc.getContext('2d').putImageData(out, 0, 0);
    const maxR = Math.max(
      Math.hypot(x0 - res.sx, y0 - res.sy), Math.hypot(x1 - res.sx, y0 - res.sy),
      Math.hypot(x0 - res.sx, y1 - res.sy), Math.hypot(x1 - res.sx, y1 - res.sy)) + 2;
    const dur = REDUCED ? 1 : Math.min(560, 220 + (maxR / k) * 0.7);
    const t0 = performance.now();
    let raf = 0;
    const done = () => {
      cancelAnimationFrame(raf);
      ctx.paint.drawImage(fc, x0, y0);
      fillAnim = null;
      changed();
    };
    const frame = (now) => {
      const t = clamp((now - t0) / dur, 0, 1);
      if (t >= 1) return done();
      const r = maxR * (1 - Math.pow(1 - t, 3)) + 2;
      ctx.paint.save();
      ctx.paint.beginPath();
      ctx.paint.arc(res.sx, res.sy, r, 0, TAU);
      ctx.paint.clip();
      ctx.paint.drawImage(fc, x0, y0);
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
  }

  function undo() {
    if (S.busy) return;
    finishFill();
    endSession();
    const e = undoStack.pop();
    if (!e) {
      FK.sound.nope();
      wiggle($('btn-undo'));
      return;
    }
    undoBytes -= e.bytes;
    if (e.type === 'patch') ctx.paint.putImageData(e.data, e.x, e.y);
    else restorePage(e);
    FK.sound.undo();
    changed();
  }

  function pageSnapshot() {
    return {
      type: 'page', W: S.W, H: S.H, paper: S.paper, pageId: S.pageId, galleryId: S.galleryId, dirty: S.dirty,
      paint: S.dirty ? ctx.paint.getImageData(0, 0, S.W, S.H) : null,
    };
  }

  function restorePage(e) {
    if (e.W !== S.W || e.H !== S.H) setCanvasSize(e.W, e.H);
    else clearAll();
    setPaper(e.paper);
    applyOutline(e.pageId);
    if (e.paint) ctx.paint.putImageData(e.paint, 0, 0);
    S.galleryId = e.galleryId;
    S.dirty = e.dirty;
  }

  /* ---------- pages ---------- */

  function swapPaper(fn) {
    S.busy = true;
    FK.sound.swoosh();
    el.paper.classList.add('fly-out');
    setTimeout(() => {
      el.paper.style.transition = 'none';
      el.paper.classList.remove('fly-out');
      void el.paper.offsetWidth;
      el.paper.style.transition = '';
      fn();
      el.paper.classList.add('fly-in');
      S.busy = false;
      setTimeout(() => el.paper.classList.remove('fly-in'), 500);
    }, REDUCED ? 0 : 340);
  }

  function newPage(opts) {
    if (S.busy) return;
    finishFill();
    endSession();
    pushUndo(pageSnapshot());
    swapPaper(() => {
      const sz = sizeForArea();
      if (sz.W !== S.W || sz.H !== S.H) setCanvasSize(sz.W, sz.H);
      else clearAll();
      setPaper(opts.paper || '#ffffff');
      applyOutline(opts.pageId);
      S.galleryId = null;
      S.dirty = false;
      changed();
    });
  }

  function blobToImage(blob) {
    if (window.createImageBitmap) return createImageBitmap(blob).catch(() => blobToImg(blob));
    return blobToImg(blob);
  }
  function blobToImg(blob) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = (err) => {
        URL.revokeObjectURL(url);
        reject(err);
      };
      img.src = url;
    });
  }

  function loadRecord(rec, img) {
    if (rec.W !== S.W || rec.H !== S.H) setCanvasSize(rec.W, rec.H);
    else clearAll();
    setPaper(rec.paper || '#ffffff');
    applyOutline(rec.pageId);
    ctx.paint.drawImage(img, 0, 0);
    S.dirty = true;
  }

  function canvasBlob(c, type, q) {
    return new Promise((resolve, reject) => {
      c.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), type || 'image/png', q);
    });
  }

  /* ---------- autosave ---------- */

  let autosaveTimer = 0;
  let autosaving = false;

  function changed() {
    S.changeId++;
    clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(autosave, 1500);
  }

  async function autosave() {
    clearTimeout(autosaveTimer);
    if (session || fillAnim || autosaving || S.busy) {
      autosaveTimer = setTimeout(autosave, 1000);
      return;
    }
    if (S.savedChangeId === S.changeId) return;
    autosaving = true;
    const id = S.changeId;
    try {
      const paint = await canvasBlob(cv.paint);
      await FK.store.putCurrent({ W: S.W, H: S.H, paper: S.paper, pageId: S.pageId, galleryId: S.galleryId, paint, t: Date.now() });
      S.savedChangeId = id;
    } catch (err) { /* storage unavailable: the drawing just isn't kept */ }
    autosaving = false;
  }

  /* ---------- saving to the gallery ---------- */

  function compose(maxDim) {
    const s = maxDim ? Math.min(1, maxDim / Math.max(S.W, S.H)) : 1;
    const c = document.createElement('canvas');
    c.width = Math.round(S.W * s);
    c.height = Math.round(S.H * s);
    const g = c.getContext('2d');
    g.fillStyle = S.paper;
    g.fillRect(0, 0, c.width, c.height);
    g.drawImage(cv.paint, 0, 0, c.width, c.height);
    g.drawImage(cv.outline, 0, 0, c.width, c.height);
    return c;
  }

  async function composeRecord(rec) {
    const img = await blobToImage(rec.paint);
    const c = document.createElement('canvas');
    c.width = rec.W;
    c.height = rec.H;
    const g = c.getContext('2d');
    g.fillStyle = rec.paper || '#ffffff';
    g.fillRect(0, 0, c.width, c.height);
    g.drawImage(img, 0, 0);
    if (rec.pageId) {
      const oc = document.createElement('canvas');
      oc.width = rec.W;
      oc.height = rec.H;
      FK.pages.renderOutline(oc, rec.pageId, 4.5 * (rec.k || 2), INK);
      g.drawImage(oc, 0, 0);
    }
    return c;
  }

  async function saveToGallery() {
    if (S.busy) return;
    finishFill();
    endSession();
    S.busy = true;
    el.flash.classList.remove('go');
    void el.flash.offsetWidth;
    el.flash.classList.add('go');
    FK.sound.click();
    try {
      const paint = await canvasBlob(cv.paint);
      const thumb = await canvasBlob(compose(420), 'image/jpeg', 0.86);
      const now = Date.now();
      let created = now;
      let id = S.galleryId;
      if (id) {
        const old = await FK.store.getBild(id).catch(() => null);
        if (old) created = old.created;
        else id = null;
      }
      if (!id) id = 'b' + now.toString(36) + Math.random().toString(36).slice(2, 6);
      await FK.store.putBild({
        id, created, updated: now, W: S.W, H: S.H, k: paperScale(), paper: S.paper, pageId: S.pageId, paint, thumb,
      });
      S.galleryId = id;
      changed();
      celebrate();
    } catch (err) {
      FK.sound.nope();
      showPraise('Hoppla, das ging nicht.');
    }
    S.busy = false;
  }

  function celebrate() {
    const p = PRAISE[(Math.random() * PRAISE.length) | 0];
    setTimeout(() => {
      FK.sound.tada();
      showPraise(p.text);
      FK.voice.say(p.say);
      confetti();
    }, 180);
  }

  let praiseTimer = 0;
  function showPraise(text) {
    const p = el.praise;
    p.textContent = text;
    p.hidden = false;
    p.style.animation = 'none';
    void p.offsetWidth;
    p.style.animation = '';
    clearTimeout(praiseTimer);
    praiseTimer = setTimeout(() => { p.hidden = true; }, 2000);
  }

  /* ---------- effects layer ---------- */

  const FX = { c: $('cv-fx'), g: null, parts: [], raf: 0, dpr: 1, last: 0 };
  FX.g = FX.c.getContext('2d');

  function fxResize() {
    FX.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    FX.c.width = Math.round(window.innerWidth * FX.dpr);
    FX.c.height = Math.round(window.innerHeight * FX.dpr);
  }

  function fxAdd(p) {
    if (REDUCED) return;
    FX.parts.push(p);
    if (FX.parts.length > 400) FX.parts.splice(0, FX.parts.length - 400);
    if (!FX.raf) {
      FX.last = performance.now();
      FX.raf = requestAnimationFrame(fxLoop);
    }
  }

  function fxLoop(now) {
    const dt = clamp((now - FX.last) / 1000, 0, 0.05);
    FX.last = now;
    const g = FX.g;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, FX.c.width, FX.c.height);
    g.setTransform(FX.dpr, 0, 0, FX.dpr, 0, 0);
    FX.parts = FX.parts.filter((p) => {
      p.t += dt;
      if (p.t >= p.life) return false;
      p.draw(g, p.t / p.life, dt);
      return true;
    });
    FX.raf = FX.parts.length ? requestAnimationFrame(fxLoop) : 0;
    if (!FX.raf) g.clearRect(0, 0, FX.c.width, FX.c.height);
  }

  function paperToScreen(x, y, m) {
    if (m) {
      const X = m[0] * x + m[2] * y + m[4];
      const Y = m[1] * x + m[3] * y + m[5];
      x = X;
      y = Y;
    }
    const r = session ? session.rect : el.clip.getBoundingClientRect();
    return [r.left + (x / S.W) * r.width, r.top + (y / S.H) * r.height];
  }

  function fxTwinkle(x, y, c) {
    fxAdd({
      t: 0, life: 0.55, rot: Math.random() * TAU, size: 6 + Math.random() * 8,
      draw(g, k) {
        const s = this.size * Math.sin(k * Math.PI);
        g.save();
        g.translate(x, y);
        g.rotate(this.rot + k * 2);
        g.globalAlpha = 1 - k * 0.6;
        FK.brushes.sparkle(g, 0, 0, s, c);
        g.restore();
      },
    });
  }

  function fxBurst(x, y) {
    const cols = ['#ffc93c', '#ff4fa3', '#5bc0ff', '#8bd448', '#ffffff'];
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * TAU + Math.random() * 0.4;
      const v = 90 + Math.random() * 80;
      const c = cols[i % cols.length];
      fxAdd({
        t: 0, life: 0.5,
        draw(g, k) {
          const d = v * k * (1.6 - k);
          g.globalAlpha = 1 - k;
          FK.brushes.sparkle(g, x + Math.cos(a) * d, y + Math.sin(a) * d, 7 * (1 - k * 0.5), c);
          g.globalAlpha = 1;
        },
      });
    }
  }

  function fxRing(x, y, c) {
    fxAdd({
      t: 0, life: 0.45,
      draw(g, k) {
        g.globalAlpha = 1 - k;
        g.strokeStyle = c;
        g.lineWidth = 6 * (1 - k) + 1;
        g.beginPath();
        g.arc(x, y, 10 + k * 60, 0, TAU);
        g.stroke();
        g.strokeStyle = '#23203d';
        g.lineWidth = 2;
        g.beginPath();
        g.arc(x, y, 14 + k * 64, 0, TAU);
        g.stroke();
        g.globalAlpha = 1;
      },
    });
  }

  function brushFx(b, pts, M, st) {
    const n = Math.min(M.length, 4);
    for (const p of pts) {
      for (let i = 0; i < n; i++) {
        const q = paperToScreen(p.x, p.y, M[i]);
        if (b === FK.BRUSHES.stamp) fxBurst(q[0], q[1]);
        else fxTwinkle(q[0], q[1], i % 2 ? '#fff6b3' : '#ffffff');
      }
    }
    if (b !== FK.BRUSHES.stamp) FK.sound.twinkle();
  }

  function confetti() {
    const cols = ['#e5322d', '#ff8a1f', '#ffd60a', '#8bd448', '#1cc6c6', '#2f5bea', '#8a4fe0', '#ff4fa3'];
    const W = window.innerWidth;
    const H = window.innerHeight;
    for (let i = 0; i < 150; i++) {
      const fromLeft = i % 2 === 0;
      const x0 = fromLeft ? -10 : W + 10;
      const y0 = H * (0.55 + Math.random() * 0.35);
      const ang = fromLeft ? -Math.PI / 2 + 0.25 + Math.random() * 0.7 : -Math.PI / 2 - 0.25 - Math.random() * 0.7;
      const v = (0.9 + Math.random() * 0.7) * Math.max(H, 500) * 1.1;
      const c = cols[i % cols.length];
      const w = 7 + Math.random() * 7;
      const h = 4 + Math.random() * 5;
      const spin = (Math.random() - 0.5) * 18;
      const p = {
        t: 0, life: 2.6 + Math.random() * 0.8, x: x0, y: y0, vx: Math.cos(ang) * v, vy: Math.sin(ang) * v, r: Math.random() * TAU,
        draw(g, k, dt) {
          this.vy += 1100 * dt;
          this.vx *= 1 - 1.2 * dt;
          this.vy *= 1 - 0.9 * dt;
          this.x += this.vx * dt;
          this.y += this.vy * dt;
          this.r += spin * dt;
          g.save();
          g.translate(this.x, this.y);
          g.rotate(this.r);
          g.scale(1, Math.cos(this.r * 1.7));
          g.globalAlpha = k > 0.8 ? (1 - k) * 5 : 1;
          g.fillStyle = c;
          g.fillRect(-w / 2, -h / 2, w, h);
          g.restore();
        },
      };
      fxAdd(p);
    }
  }

  /* ---------- UI: tools, colours, popovers ---------- */

  function wiggle(b) {
    if (!b) return;
    b.classList.remove('wiggle');
    void b.offsetWidth;
    b.classList.add('wiggle');
  }

  function crayonSvg(c) {
    const fill = c.rainbow ? 'url(#fk-rainbow)' : c.hex;
    const band = c.rainbow ? '#ffffff' : FK.color.mix(c.hex, '#000000', 0.25);
    return '<svg viewBox="0 0 40 120" aria-hidden="true">' +
      '<path d="M6 37 L20 5 L34 37 Z" fill="#f3c891" stroke="#23203d" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M13.6 19.5 L20 5 L26.4 19.5 Q20 22 13.6 19.5 Z" fill="' + fill + '" stroke="#23203d" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<rect x="6" y="35" width="28" height="92" rx="3" fill="' + fill + '" stroke="#23203d" stroke-width="3"/>' +
      '<rect x="10.5" y="40" width="5" height="80" rx="2.5" fill="#ffffff" opacity=".4"/>' +
      '<rect x="7.5" y="58" width="25" height="7" fill="' + band + '" opacity=".6"/>' +
      '</svg>';
  }

  function buildCrayons() {
    el.crayons.innerHTML = '';
    FK.COLORS.forEach((c, i) => {
      const b = document.createElement('button');
      b.className = 'crayon';
      b.type = 'button';
      b.dataset.color = c.id;
      b.setAttribute('role', 'radio');
      b.setAttribute('aria-label', c.name);
      b.innerHTML = crayonSvg(c);
      b.addEventListener('click', () => {
        selectColor(c.id);
        if (c.rainbow) FK.sound.rainbow();
        else FK.sound.note(i);
        FK.voice.say(c.name);
      });
      el.crayons.append(b);
    });
  }

  function selectColor(id) {
    S.colorId = id;
    if (S.tool === 'eraser' || S.tool === 'stamp') S.tool = 'brush';
    hideHint();
    refreshUI();
    persistSettings();
  }

  function selectTool(tool, say) {
    S.tool = tool;
    refreshUI();
    persistSettings();
    if (say) FK.voice.say(say);
  }

  function refreshUI() {
    const c = color();
    document.documentElement.style.setProperty('--cur', c.rainbow ? 'url(#fk-rainbow)' : c.hex);
    el.crayons.querySelectorAll('.crayon').forEach((b) => {
      const on = b.dataset.color === S.colorId;
      b.classList.toggle('on', on);
      b.setAttribute('aria-checked', on ? 'true' : 'false');
    });
    const map = { brush: 'btn-brush', stamp: 'btn-stamp', fill: 'btn-fill', eraser: 'btn-eraser' };
    Object.keys(map).forEach((t) => {
      const b = $(map[t]);
      b.classList.toggle('on', S.tool === t);
      b.setAttribute('aria-pressed', S.tool === t ? 'true' : 'false');
    });
    $('stamp-face').textContent = S.emoji;
    $('size-dot').setAttribute('r', SIZES[S.size].r);
    const m = MIRRORS.find((x) => x.id === S.mirror);
    $('mirror-use').setAttribute('href', m.icon);
    $('btn-mirror').classList.toggle('on', S.mirror !== 'off');
    updateGuides();
  }

  let popAnchor = null;

  function openPop(anchor, build) {
    closePop(true);
    el.popCard.innerHTML = '';
    build(el.popCard);
    el.pop.hidden = false;
    popAnchor = anchor;
    anchor.setAttribute('aria-expanded', 'true');
    positionPop();
    FK.sound.open();
  }

  function closePop(silent) {
    if (el.pop.hidden) return;
    el.pop.hidden = true;
    if (popAnchor) popAnchor.setAttribute('aria-expanded', 'false');
    popAnchor = null;
    if (!silent) FK.sound.close();
  }

  function positionPop() {
    if (!popAnchor || el.pop.hidden) return;
    const c = el.popCard;
    c.style.left = '0px';
    c.style.top = '0px';
    const a = popAnchor.getBoundingClientRect();
    const cw = c.offsetWidth;
    const ch = c.offsetHeight;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const m = 10;
    const rail = popAnchor.closest('.rail');
    const row = rail && getComputedStyle(rail).flexDirection === 'row';
    let x;
    let y;
    if (row) {
      x = a.left + a.width / 2 - cw / 2;
      y = a.top > vh / 2 ? a.top - ch - 16 : a.bottom + 16;
    } else {
      y = a.top + a.height / 2 - ch / 2;
      x = a.left < vw / 2 ? a.right + 16 : a.left - cw - 16;
    }
    c.style.left = clamp(x, m, Math.max(m, vw - cw - m)) + 'px';
    c.style.top = clamp(y, m, Math.max(m, vh - ch - m)) + 'px';
  }

  function popTitle(card, text) {
    const h = document.createElement('p');
    h.className = 'pop-title';
    h.textContent = text;
    card.append(h);
  }

  function optButton(label, on, onPick) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'opt' + (on ? ' on' : '');
    b.setAttribute('aria-label', label);
    b.addEventListener('click', onPick);
    return b;
  }

  function buildBrushPop(card) {
    popTitle(card, 'Pinsel');
    const grid = document.createElement('div');
    grid.className = 'grid-opts';
    grid.style.setProperty('--cols', 4);
    const c = color();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    FK.BRUSH_ORDER.forEach((id) => {
      const br = FK.BRUSHES[id];
      const b = optButton(br.name, S.tool === 'brush' && S.brush === id, () => {
        S.brush = id;
        selectTool('brush', br.name);
        FK.sound.tick();
        closePop(true);
      });
      const pc = document.createElement('canvas');
      pc.width = Math.round(72 * dpr);
      pc.height = Math.round(44 * dpr);
      FK.brushes.preview(pc, id, c.hex === '#ffffff' && S.paper === '#ffffff' ? '#d9dcef' : c.hex, !!c.rainbow);
      const t = document.createElement('span');
      t.textContent = br.name;
      b.append(pc, t);
      grid.append(b);
    });
    card.append(grid);
  }

  function buildStampPop(card) {
    const tabs = document.createElement('div');
    tabs.className = 'tabs';
    const grid = document.createElement('div');
    grid.className = 'stickers';
    const fillGrid = () => {
      grid.innerHTML = '';
      STICKERS[S.stickerTab].items.forEach(([e, name]) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'sticker' + (e === S.emoji ? ' on' : '');
        b.textContent = e;
        b.setAttribute('aria-label', name);
        b.addEventListener('click', () => {
          S.emoji = e;
          selectTool('stamp', name);
          FK.sound.pop();
          closePop(true);
        });
        grid.append(b);
      });
    };
    STICKERS.forEach((cat, i) => {
      const t = document.createElement('button');
      t.type = 'button';
      t.className = 'tab' + (i === S.stickerTab ? ' on' : '');
      t.textContent = cat.icon;
      t.setAttribute('aria-label', cat.name);
      t.addEventListener('click', () => {
        S.stickerTab = i;
        tabs.querySelectorAll('.tab').forEach((x, j) => x.classList.toggle('on', j === i));
        fillGrid();
        FK.sound.tick();
        FK.voice.say(cat.name);
        persistSettings();
        positionPop();
      });
      tabs.append(t);
    });
    fillGrid();
    card.append(tabs, grid);
  }

  function buildSizePop(card) {
    popTitle(card, 'Grösse');
    const grid = document.createElement('div');
    grid.className = 'grid-opts';
    grid.style.setProperty('--cols', 4);
    SIZES.forEach((sz, i) => {
      const b = optButton(sz.name, S.size === i, () => {
        S.size = i;
        refreshUI();
        persistSettings();
        FK.sound.note(3 + i * 2);
        FK.voice.say(sz.name);
        closePop(true);
      });
      const box = document.createElement('span');
      box.className = 'dotbox';
      const dot = document.createElement('span');
      dot.className = 'size-dot';
      dot.style.width = dot.style.height = sz.dot + 'px';
      box.append(dot);
      const t = document.createElement('span');
      t.textContent = sz.name;
      b.append(box, t);
      grid.append(b);
    });
    card.append(grid);
  }

  function buildMirrorPop(card) {
    popTitle(card, 'Spiegel');
    const grid = document.createElement('div');
    grid.className = 'grid-opts';
    grid.style.setProperty('--cols', 3);
    MIRRORS.forEach((m) => {
      const b = optButton(m.name, S.mirror === m.id, () => {
        S.mirror = m.id;
        refreshUI();
        persistSettings();
        FK.sound.tick();
        FK.voice.say(m.name);
        closePop(true);
      });
      b.innerHTML = '<svg class="ic" aria-hidden="true"><use href="' + m.icon + '"/></svg><span></span>';
      b.lastChild.textContent = m.id === 'off' ? 'Aus' : m.name;
      grid.append(b);
    });
    card.append(grid);
  }

  function buildPaperPop(card) {
    popTitle(card, 'Neues Blatt');
    const grid = document.createElement('div');
    grid.className = 'grid-opts';
    grid.style.setProperty('--cols', 4);
    PAPERS.forEach((p) => {
      const b = optButton(p.name, false, () => {
        closePop(true);
        FK.voice.say(p.name);
        newPage({ paper: p.hex });
      });
      const chip = document.createElement('span');
      chip.className = 'paper-chip';
      chip.style.background = p.hex;
      const t = document.createElement('span');
      t.textContent = p.name.replace('Weisses Blatt', 'Weiss');
      b.append(chip, t);
      grid.append(b);
    });
    card.append(grid);
  }

  /* ---------- sheets ---------- */

  function openSheet(id) {
    closePop(true);
    $(id).hidden = false;
    FK.sound.open();
  }

  function closeSheet(id) {
    const s = $(id);
    if (s.hidden) return;
    s.hidden = true;
    FK.sound.close();
    if (id === 'sheet-gallery') revokeGallery();
    if (id === 'sheet-viewer') revokeViewer();
  }

  let pagesBuilt = false;
  function openPages() {
    openSheet('sheet-pages');
    FK.voice.say('Ausmalbilder');
    if (pagesBuilt) return;
    pagesBuilt = true;
    const grid = $('pages-grid');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    FK.pages.list.forEach((pg) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'card';
      b.setAttribute('aria-label', pg.name);
      const c = document.createElement('canvas');
      c.width = Math.round(220 * dpr);
      c.height = Math.round(165 * dpr);
      const n = document.createElement('span');
      n.className = 'name';
      n.textContent = pg.name;
      b.append(c, n);
      b.addEventListener('click', () => {
        closeSheet('sheet-pages');
        FK.voice.say(pg.name);
        S.tool = 'fill';
        refreshUI();
        persistSettings();
        newPage({ pageId: pg.id, paper: '#ffffff' });
      });
      grid.append(b);
      requestAnimationFrame(() => FK.pages.thumb(c, pg.id));
    });
  }

  let galleryURLs = [];
  function revokeGallery() {
    galleryURLs.forEach((u) => URL.revokeObjectURL(u));
    galleryURLs = [];
  }

  async function openGallery() {
    endSession();
    await autosave();
    openSheet('sheet-gallery');
    FK.voice.say('Meine Bilder');
    renderGallery();
  }

  async function renderGallery() {
    const grid = $('gallery-grid');
    revokeGallery();
    grid.innerHTML = '';
    let list = [];
    try {
      list = await FK.store.listBilder();
    } catch (err) { /* no storage */ }
    $('gallery-empty').hidden = list.length > 0;
    const fmt = new Intl.DateTimeFormat('de-CH', { day: 'numeric', month: 'long' });
    list.forEach((rec) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'card';
      const img = new Image();
      const url = URL.createObjectURL(rec.thumb);
      galleryURLs.push(url);
      img.src = url;
      img.alt = 'Bild vom ' + fmt.format(new Date(rec.updated || rec.created));
      b.append(img);
      b.addEventListener('click', () => openViewer(rec));
      grid.append(b);
    });
  }

  let viewer = { rec: null, url: null, blob: null };
  function revokeViewer() {
    if (viewer.url) URL.revokeObjectURL(viewer.url);
    viewer = { rec: null, url: null, blob: null };
  }

  async function openViewer(rec) {
    revokeViewer();
    viewer.rec = rec;
    $('viewer-actions').hidden = false;
    $('viewer-confirm').hidden = true;
    const img = $('viewer-img');
    const thumbUrl = URL.createObjectURL(rec.thumb);
    img.src = thumbUrl;
    viewer.url = thumbUrl;
    openSheet('sheet-viewer');
    try {
      const c = await composeRecord(rec);
      const blob = await canvasBlob(c);
      if (viewer.rec !== rec) return;
      viewer.blob = blob;
      const url = URL.createObjectURL(blob);
      img.src = url;
      URL.revokeObjectURL(viewer.url);
      viewer.url = url;
    } catch (err) { /* keep the thumbnail */ }
  }

  async function continueDrawing() {
    const rec = viewer.rec;
    if (!rec || S.busy) return;
    let img;
    try {
      img = await blobToImage(rec.paint);
    } catch (err) {
      FK.sound.nope();
      return;
    }
    closeSheet('sheet-viewer');
    closeSheet('sheet-gallery');
    FK.voice.say('Weitermalen');
    finishFill();
    endSession();
    pushUndo(pageSnapshot());
    swapPaper(() => {
      loadRecord(rec, img);
      S.galleryId = rec.id;
      changed();
    });
  }

  async function shareImage() {
    const rec = viewer.rec;
    if (!rec) return;
    let blob = viewer.blob;
    try {
      if (!blob) blob = await canvasBlob(await composeRecord(rec));
    } catch (err) {
      FK.sound.nope();
      return;
    }
    const name = 'farbklecks-' + new Date(rec.updated || Date.now()).toISOString().slice(0, 10) + '.png';
    const file = window.File ? new File([blob], name, { type: 'image/png' }) : null;
    if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: 'Mein Farbklecks-Bild' });
        return;
      } catch (err) {
        if (err && err.name === 'AbortError') return;
      }
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  }

  async function deleteImage() {
    const rec = viewer.rec;
    if (!rec) return;
    try {
      await FK.store.deleteBild(rec.id);
    } catch (err) { /* ignore */ }
    if (S.galleryId === rec.id) {
      S.galleryId = null;
      changed();
    }
    FK.sound.swoosh();
    closeSheet('sheet-viewer');
    renderGallery();
  }

  /* ---------- hint ---------- */

  function showHint() { el.hint.hidden = false; }
  function hideHint() { el.hint.hidden = true; }

  /* ---------- wake lock ---------- */

  let wakeLock = null;
  async function keepAwake() {
    try {
      if (!wakeLock && 'wakeLock' in navigator && document.visibilityState === 'visible') {
        wakeLock = await navigator.wakeLock.request('screen');
        wakeLock.addEventListener('release', () => { wakeLock = null; });
      }
    } catch (err) { /* not allowed here */ }
  }

  /* ---------- wiring ---------- */

  function bind() {
    el.clip.addEventListener('pointerdown', onDown);
    el.clip.addEventListener('pointermove', onMove);
    el.clip.addEventListener('pointerup', onUp);
    el.clip.addEventListener('pointercancel', onUp);
    window.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'pen') pens.ids.add(e.pointerId);
    }, true);
    const penUp = (e) => {
      if (e.pointerType === 'pen' && pens.ids.delete(e.pointerId)) pens.until = performance.now() + 1200;
    };
    window.addEventListener('pointerup', penUp, true);
    window.addEventListener('pointercancel', penUp, true);

    const press = (id, fn) => $(id).addEventListener('click', (e) => {
      FK.sound.unlock();
      hideHint();
      fn(e.currentTarget);
    });

    press('btn-brush', (b) => {
      if (S.tool !== 'brush') selectTool('brush');
      FK.voice.say('Pinsel');
      openPop(b, buildBrushPop);
    });
    press('btn-stamp', (b) => {
      if (S.tool !== 'stamp') selectTool('stamp');
      FK.voice.say('Stempel');
      openPop(b, buildStampPop);
    });
    press('btn-fill', () => {
      selectTool('fill', 'Farbeimer');
      FK.sound.tick();
    });
    press('btn-eraser', () => {
      selectTool('eraser', 'Radiergummi');
      FK.sound.tick();
    });
    press('btn-size', (b) => {
      FK.voice.say('Grösse');
      openPop(b, buildSizePop);
    });
    press('btn-mirror', (b) => {
      FK.voice.say('Spiegel');
      openPop(b, buildMirrorPop);
    });
    press('btn-undo', () => {
      closePop(true);
      undo();
    });
    press('btn-pages', () => openPages());
    press('btn-new', (b) => {
      FK.voice.say('Neues Blatt');
      openPop(b, buildPaperPop);
    });
    press('btn-save', () => {
      closePop(true);
      saveToGallery();
    });
    press('btn-gallery', () => openGallery());
    press('btn-settings', () => {
      openSheet('sheet-settings');
    });

    document.querySelectorAll('[data-close]').forEach((b) => {
      b.addEventListener('click', () => closeSheet(b.closest('.sheet').id));
    });
    $('v-continue').addEventListener('click', continueDrawing);
    $('v-share').addEventListener('click', shareImage);
    $('v-delete').addEventListener('click', () => {
      $('viewer-actions').hidden = true;
      $('viewer-confirm').hidden = false;
      FK.voice.say('Wirklich löschen?');
    });
    $('v-no').addEventListener('click', () => {
      $('viewer-actions').hidden = false;
      $('viewer-confirm').hidden = true;
    });
    $('v-yes').addEventListener('click', deleteImage);

    el.pop.addEventListener('pointerdown', (e) => {
      if (e.target === el.pop) {
        e.preventDefault();
        closePop();
      }
    });

    const setSound = $('set-sound');
    const setVoice = $('set-voice');
    setSound.checked = S.sound;
    setVoice.checked = S.voice;
    setSound.addEventListener('change', () => {
      S.sound = setSound.checked;
      FK.sound.enabled = S.sound;
      persistSettings();
      if (S.sound) {
        FK.sound.unlock();
        FK.sound.tick();
      }
    });
    setVoice.addEventListener('change', () => {
      S.voice = setVoice.checked;
      FK.voice.enabled = S.voice;
      persistSettings();
      if (S.voice) FK.voice.say('Vorlesen ist an');
    });

    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undo();
      } else if (e.key === 'Escape') {
        if (!el.pop.hidden) closePop();
        else {
          const open = ['sheet-viewer', 'sheet-settings', 'sheet-gallery', 'sheet-pages'].find((id) => !$(id).hidden);
          if (open) closeSheet(open);
        }
      }
    });

    // iOS only starts audio from touchend/click, and only shows :active styles when a touchstart listener exists.
    document.addEventListener('touchstart', () => {}, { passive: true });
    document.addEventListener('touchend', () => FK.sound.unlock(), { passive: true });
    document.addEventListener('click', () => FK.sound.unlock(), true);

    // Keep iOS from zooming, scrolling the page or showing callouts while kids draw.
    document.addEventListener('gesturestart', (e) => e.preventDefault());
    document.addEventListener('dblclick', (e) => e.preventDefault(), { passive: false });
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    document.addEventListener('touchmove', (e) => {
      if (!e.target.closest || !e.target.closest('.scroll, .rail, .pop-card')) e.preventDefault();
    }, { passive: false });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        endSession();
        finishFill();
        autosave();
      } else {
        keepAwake();
      }
    });
    window.addEventListener('pagehide', () => {
      endSession();
      autosave();
    });

    const onResize = () => {
      fitPaper();
      fxResize();
      positionPop();
    };
    if (window.ResizeObserver) new ResizeObserver(onResize).observe(el.stage);
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', () => setTimeout(onResize, 250));
  }

  async function boot() {
    $('app-version').textContent = 'Farbklecks ' + VERSION;
    buildCrayons();
    refreshUI();
    bind();
    fxResize();
    await new Promise((r) => requestAnimationFrame(() => r()));
    const sz = sizeForArea();
    setCanvasSize(sz.W, sz.H);
    setPaper('#ffffff');
    let rec = null;
    try {
      rec = await FK.store.getCurrent();
    } catch (err) { /* no storage */ }
    if (rec && rec.paint && rec.W && rec.H) {
      try {
        const img = await blobToImage(rec.paint);
        loadRecord(rec, img);
        S.galleryId = rec.galleryId || null;
      } catch (err) {
        showHint();
      }
    } else {
      showHint();
    }
    FK.store.persist();
  }

  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => { /* e.g. inside a sandboxed preview */ });
    });
  }

  boot();
})();
