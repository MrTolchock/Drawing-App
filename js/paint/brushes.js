/* Farbklecks – Farben, Pinsel und Stempel.
   Each brush splits work in two steps: plan() decides geometry and randomness once,
   paint() draws it. The engine calls paint() once per mirror copy, so copies match exactly. */
(function () {
  'use strict';
  const FK = (window.FK = window.FK || {});
  const TAU = Math.PI * 2;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

  const { mix, hsl } = FK.color;

  function colorOf(st) { return st.rainbow ? hsl(st.hue, 92, 55) : st.color; }
  function lightOf(st, t) { return st.rainbow ? hsl(st.hue, 100, 55 + 40 * t) : mix(st.color, '#ffffff', t); }
  function darkOf(st, t) { return st.rainbow ? hsl(st.hue, 90, 55 - 30 * t) : mix(st.color, '#000000', t); }
  function advanceHue(st, len) { st.hue = (st.hue + (len / st.k) * 0.9) % 360; }

  /* ---------- geometry ---------- */

  // Builds the next smoothed segment (quadratic through midpoints) and updates the stroke state.
  function makeSeg(st, ph, p) {
    let seg;
    if (ph === 'down') {
      st.x = st.mx = p.x;
      st.y = st.my = p.y;
      st.acc = 0;
      seg = { x0: p.x, y0: p.y, cx: p.x, cy: p.y, x1: p.x, y1: p.y, len: 0 };
    } else if (ph === 'move') {
      const mx = (st.x + p.x) / 2;
      const my = (st.y + p.y) / 2;
      seg = { x0: st.mx, y0: st.my, cx: st.x, cy: st.y, x1: mx, y1: my, len: Math.hypot(st.x - st.mx, st.y - st.my) + Math.hypot(mx - st.x, my - st.y) };
      st.x = p.x;
      st.y = p.y;
      st.mx = mx;
      st.my = my;
    } else if (ph === 'up') {
      seg = { x0: st.mx, y0: st.my, cx: (st.mx + st.x) / 2, cy: (st.my + st.y) / 2, x1: st.x, y1: st.y, len: Math.hypot(st.x - st.mx, st.y - st.my) };
    } else {
      seg = { x0: st.x, y0: st.y, cx: st.x, cy: st.y, x1: st.x, y1: st.y, len: 0 };
    }
    seg.ph = ph;
    return seg;
  }

  function at(seg, t) {
    const u = 1 - t;
    return {
      x: u * u * seg.x0 + 2 * u * t * seg.cx + t * t * seg.x1,
      y: u * u * seg.y0 + 2 * u * t * seg.cy + t * t * seg.y1,
    };
  }

  // Points every `spacing` px along the segment, carrying leftover distance in st.acc.
  function sample(seg, spacing, st) {
    const out = [];
    if (seg.len <= 0.001) return out;
    spacing = Math.max(0.5, spacing);
    const n = Math.max(2, Math.ceil(seg.len / Math.max(0.5, spacing / 3)));
    let px = seg.x0;
    let py = seg.y0;
    for (let i = 1; i <= n; i++) {
      const q = at(seg, i / n);
      const d = Math.hypot(q.x - px, q.y - py);
      st.acc += d;
      while (st.acc >= spacing) {
        st.acc -= spacing;
        const back = d ? st.acc / d : 0;
        out.push({ x: q.x - (q.x - px) * back, y: q.y - (q.y - py) * back });
      }
      px = q.x;
      py = q.y;
    }
    return out;
  }

  function strokeSeg(g, seg, w, c) {
    if (seg.ph === 'down' || seg.len < 0.01) {
      g.fillStyle = c;
      g.beginPath();
      g.arc(seg.x1, seg.y1, w / 2, 0, TAU);
      g.fill();
      return;
    }
    g.strokeStyle = c;
    g.lineWidth = w;
    g.lineCap = 'round';
    g.lineJoin = 'round';
    g.beginPath();
    g.moveTo(seg.x0, seg.y0);
    g.quadraticCurveTo(seg.cx, seg.cy, seg.x1, seg.y1);
    g.stroke();
  }

  function starPath(g, x, y, R, r, n, rot) {
    g.beginPath();
    for (let i = 0; i < n * 2; i++) {
      const a = rot + (i * Math.PI) / n;
      const rr = i % 2 ? r : R;
      if (i === 0) g.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
      else g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
    }
    g.closePath();
  }

  function heartPath(g, s) {
    g.beginPath();
    g.moveTo(0, s * 0.95);
    g.bezierCurveTo(-s * 0.35, s * 0.62, -s * 1.15, s * 0.2, -s * 1.05, -s * 0.38);
    g.bezierCurveTo(-s * 0.95, -s * 0.98, -s * 0.2, -s * 1.08, 0, -s * 0.5);
    g.bezierCurveTo(s * 0.2, -s * 1.08, s * 0.95, -s * 0.98, s * 1.05, -s * 0.38);
    g.bezierCurveTo(s * 1.15, s * 0.2, s * 0.35, s * 0.62, 0, s * 0.95);
    g.closePath();
  }

  function sparkle(g, x, y, r, c) {
    g.fillStyle = c;
    g.beginPath();
    g.moveTo(x, y - r);
    g.quadraticCurveTo(x + r * 0.16, y - r * 0.16, x + r, y);
    g.quadraticCurveTo(x + r * 0.16, y + r * 0.16, x, y + r);
    g.quadraticCurveTo(x - r * 0.16, y + r * 0.16, x - r, y);
    g.quadraticCurveTo(x - r * 0.16, y - r * 0.16, x, y - r);
    g.fill();
  }

  /* ---------- emoji stamp cache ---------- */
  const EMOJI_FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
  const emojiCache = new Map();
  FK.EMOJI_FONT = EMOJI_FONT;
  function emojiImage(e, size) {
    const s = Math.max(8, Math.round(size));
    const key = e + '|' + s;
    let c = emojiCache.get(key);
    if (c) return c;
    c = document.createElement('canvas');
    const pad = Math.ceil(s * 0.3);
    c.width = c.height = s + pad * 2;
    const g = c.getContext('2d');
    g.font = s + 'px ' + EMOJI_FONT;
    g.textAlign = 'center';
    let y = c.height / 2;
    try {
      g.textBaseline = 'alphabetic';
      const m = g.measureText(e);
      if (m.actualBoundingBoxAscent !== undefined) {
        y = c.height / 2 + (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2;
      } else {
        g.textBaseline = 'middle';
      }
    } catch (err) {
      g.textBaseline = 'middle';
    }
    g.fillText(e, c.width / 2, y);
    if (emojiCache.size > 24) emojiCache.delete(emojiCache.keys().next().value);
    emojiCache.set(key, c);
    return c;
  }

  /* ---------- brushes ---------- */

  const B = {};

  B.filz = {
    name: 'Filzstift', sound: 'filz', reach: 0.6, sizes: [4, 10, 20, 38], pv: 7,
    plan(seg, st) {
      advanceHue(st, seg.len);
      return { seg, w: Math.max(1, st.size * st.pr), c: colorOf(st) };
    },
    paint(L, d) { strokeSeg(L.base, d.seg, d.w, d.c); },
  };

  B.wachs = {
    name: 'Wachskreide', sound: 'wachs', reach: 0.75, sizes: [6, 14, 26, 44], pv: 10,
    plan(seg, st) {
      const w = st.size * st.pr;
      const pts = seg.ph === 'down' ? [{ x: seg.x1, y: seg.y1 }] : sample(seg, Math.max(1, w * 0.12), st);
      if (!pts.length) return null;
      advanceHue(st, seg.len);
      const n = clamp(Math.round(w * 0.7), 6, 40);
      const R = w / 2;
      const dots = new Float32Array(pts.length * n * 4);
      let j = 0;
      for (const p of pts) {
        for (let i = 0; i < n; i++) {
          const a = Math.random() * TAU;
          const r = R * Math.sqrt(Math.random());
          const s = Math.max(1.2, w * rnd(0.06, 0.13));
          dots[j++] = p.x + Math.cos(a) * r - s / 2;
          dots[j++] = p.y + Math.sin(a) * r - s / 2;
          dots[j++] = s;
          dots[j++] = rnd(0.35, 0.95);
        }
      }
      return { dots, c: colorOf(st) };
    },
    paint(L, d) {
      const g = L.base;
      g.fillStyle = d.c;
      const a = d.dots;
      for (let j = 0; j < a.length; j += 4) {
        g.globalAlpha = a[j + 3];
        g.fillRect(a[j], a[j + 1], a[j + 2], a[j + 2]);
      }
      g.globalAlpha = 1;
    },
  };

  B.neon = {
    name: 'Neon', sound: 'neon', reach: 1.4, sizes: [4, 9, 16, 28], pv: 5,
    plan(seg, st) {
      advanceHue(st, seg.len);
      return { seg, w: Math.max(1, st.size * st.pr), c: colorOf(st), core: lightOf(st, 0.78) };
    },
    paint(L, d) {
      strokeSeg(L.glow, d.seg, d.w * 2.7, d.c);
      strokeSeg(L.base, d.seg, d.w, d.c);
      strokeSeg(L.top, d.seg, Math.max(1, d.w * 0.38), d.core);
    },
  };

  B.spray = {
    name: 'Spraydose', sound: 'spray', reach: 1.25, sizes: [8, 16, 28, 48], pv: 9, tick: true,
    plan(seg, st) {
      const w = st.size;
      let n;
      if (seg.ph === 'tick' || seg.ph === 'down') n = Math.round(w * 0.55);
      else if (seg.ph === 'move') n = Math.round(seg.len * 0.3);
      else return null;
      if (n < 1) return null;
      advanceHue(st, seg.ph === 'move' ? seg.len : w * 0.06);
      const R = w * 1.15;
      const dots = new Float32Array(n * 3);
      for (let i = 0, j = 0; i < n; i++) {
        const q = at(seg, Math.random());
        const a = Math.random() * TAU;
        const r = R * Math.pow(Math.random(), 0.75);
        const s = Math.max(1, w * rnd(0.03, 0.06));
        dots[j++] = q.x + Math.cos(a) * r - s / 2;
        dots[j++] = q.y + Math.sin(a) * r - s / 2;
        dots[j++] = s;
      }
      return { dots, c: colorOf(st) };
    },
    paint(L, d) {
      const g = L.base;
      g.fillStyle = d.c;
      const a = d.dots;
      for (let j = 0; j < a.length; j += 3) g.fillRect(a[j], a[j + 1], a[j + 2], a[j + 2]);
    },
  };

  B.glitzer = {
    name: 'Glitzer', sound: 'glitzer', reach: 1.7, sizes: [5, 11, 20, 34], pv: 6,
    plan(seg, st) {
      const w = Math.max(1, st.size * st.pr);
      const pts = seg.ph === 'down' ? [{ x: seg.x1, y: seg.y1 }] : sample(seg, Math.max(1, w * 0.35), st);
      advanceHue(st, seg.len);
      const tints = ['#ffffff', '#fff6b3', '#ffd23f', lightOf(st, 0.55), lightOf(st, 0.85)];
      const sp = [];
      for (const p of pts) {
        const a = Math.random() * TAU;
        const r = w * 0.95 * Math.sqrt(Math.random());
        const star = Math.random() < 0.18;
        sp.push({
          x: p.x + Math.cos(a) * r,
          y: p.y + Math.sin(a) * r,
          r: star ? w * rnd(0.32, 0.6) : w * rnd(0.06, 0.15),
          star,
          c: tints[(Math.random() * tints.length) | 0],
        });
      }
      return { seg, w, c: colorOf(st), sp, fx: pts.length && Math.random() < 0.5 ? [pts[pts.length - 1]] : null };
    },
    paint(L, d) {
      strokeSeg(L.base, d.seg, d.w * 0.72, d.c);
      const g = L.top;
      for (const s of d.sp) {
        if (s.star) sparkle(g, s.x, s.y, s.r, s.c);
        else {
          g.fillStyle = s.c;
          g.beginPath();
          g.arc(s.x, s.y, s.r, 0, TAU);
          g.fill();
        }
      }
    },
  };

  function shapeBrush(name, spacingF, sizes, pv, drawOne) {
    return {
      name, sound: 'shape', reach: 1.0, sizes, pv,
      plan(seg, st) {
        const w = st.size;
        const pts = seg.ph === 'down' ? [{ x: seg.x1, y: seg.y1 }] : sample(seg, w * spacingF, st);
        if (!pts.length) return null;
        const items = pts.map((p) => {
          if (st.rainbow) st.hue = (st.hue + 32) % 360;
          return {
            x: p.x, y: p.y,
            rot: rnd(-0.45, 0.45),
            sc: rnd(0.8, 1.15),
            c: colorOf(st), hi: lightOf(st, 0.7), lo: darkOf(st, 0.22),
          };
        });
        return { items, w, fx: Math.random() < 0.4 ? [pts[0]] : null };
      },
      paint(L, d) {
        const g = L.base;
        for (const it of d.items) {
          g.save();
          g.translate(it.x, it.y);
          g.rotate(it.rot);
          g.scale(it.sc, it.sc);
          drawOne(g, d.w, it);
          g.restore();
        }
      },
    };
  }

  B.sternli = shapeBrush('Sternli', 1.45, [12, 22, 36, 56], 13, (g, w, it) => {
    const R = w * 0.62;
    starPath(g, 0, 0, R, R * 0.48, 5, -Math.PI / 2);
    g.fillStyle = it.c;
    g.strokeStyle = it.c;
    g.lineJoin = 'round';
    g.lineWidth = R * 0.28;
    g.fill();
    g.stroke();
    g.fillStyle = 'rgba(255,255,255,.7)';
    g.beginPath();
    g.arc(-R * 0.2, -R * 0.22, R * 0.15, 0, TAU);
    g.fill();
  });

  B.herzli = shapeBrush('Herzli', 1.4, [12, 22, 36, 56], 13, (g, w, it) => {
    const s = w * 0.5;
    heartPath(g, s);
    g.fillStyle = it.c;
    g.fill();
    g.fillStyle = 'rgba(255,255,255,.7)';
    g.beginPath();
    g.ellipse(-s * 0.5, -s * 0.42, s * 0.2, s * 0.13, -0.6, 0, TAU);
    g.fill();
  });

  B.perlen = shapeBrush('Perlen', 1.02, [8, 16, 28, 44], 10, (g, w, it) => {
    const r = w * 0.48;
    g.fillStyle = it.c;
    g.beginPath();
    g.arc(0, 0, r, 0, TAU);
    g.fill();
    g.strokeStyle = it.lo;
    g.lineWidth = Math.max(1, r * 0.14);
    g.beginPath();
    g.arc(0, 0, r * 0.93, 0, TAU);
    g.stroke();
    g.fillStyle = 'rgba(255,255,255,.75)';
    g.beginPath();
    g.arc(-r * 0.36, -r * 0.36, r * 0.24, 0, TAU);
    g.fill();
  });

  B.eraser = {
    name: 'Radiergummi', sound: 'eraser', reach: 0.6, sizes: [12, 26, 48, 86], direct: true,
    plan(seg, st) { return { seg, w: st.size }; },
    paint(L, d) {
      const g = L.paint;
      g.globalCompositeOperation = 'destination-out';
      strokeSeg(g, d.seg, d.w, '#000');
      g.globalCompositeOperation = 'source-over';
    },
  };

  B.stamp = {
    name: 'Stempel', sound: null, reach: 1.05, sizes: [36, 64, 104, 168],
    plan(seg, st) {
      const pts = seg.ph === 'down' ? [{ x: seg.x1, y: seg.y1 }] : sample(seg, st.size * 0.95, st);
      if (!pts.length) return null;
      return {
        emoji: st.emoji,
        size: st.size,
        items: pts.map((p) => ({ x: p.x, y: p.y, rot: rnd(-0.3, 0.3), sc: rnd(0.9, 1.1) })),
        fx: pts,
      };
    },
    paint(L, d) {
      const g = L.base;
      const img = emojiImage(d.emoji, Math.min(d.size, 320));
      const f = d.size / Math.min(d.size, 320);
      for (const it of d.items) {
        g.save();
        g.translate(it.x, it.y);
        g.rotate(it.rot);
        g.scale(it.sc * f, it.sc * f);
        g.drawImage(img, -img.width / 2, -img.height / 2);
        g.restore();
      }
    },
  };

  FK.BRUSHES = B;
  FK.BRUSH_ORDER = ['filz', 'wachs', 'neon', 'spray', 'glitzer', 'sternli', 'herzli', 'perlen'];

  /* ---------- small previews for the brush picker ---------- */
  function preview(canvas, id, color, rainbow) {
    const b = B[id];
    const W = canvas.width;
    const H = canvas.height;
    const k = W / 72;
    const mk = () => {
      const c = document.createElement('canvas');
      c.width = W;
      c.height = H;
      return c;
    };
    const cv = { glow: mk(), base: mk(), top: mk() };
    const L = { glow: cv.glow.getContext('2d'), base: cv.base.getContext('2d'), top: cv.top.getContext('2d') };
    const st = { size: b.pv * k, color, rainbow, hue: 0, acc: 0, pr: 1, k };
    const pts = [];
    for (let i = 0; i <= 28; i++) {
      const t = i / 28;
      pts.push({ x: W * 0.13 + t * W * 0.74, y: H * 0.5 + Math.sin(t * TAU) * H * 0.2 });
    }
    const run = (ph, p) => {
      const seg = makeSeg(st, ph, p);
      const d = b.plan(seg, st);
      if (d) b.paint(L, d);
    };
    run('down', pts[0]);
    for (let i = 1; i < pts.length; i++) {
      run('move', pts[i]);
      if (b.tick && i % 2) run('tick', pts[i]);
    }
    run('up', pts[pts.length - 1]);
    const g = canvas.getContext('2d');
    g.clearRect(0, 0, W, H);
    g.globalAlpha = 0.38;
    g.drawImage(cv.glow, 0, 0);
    g.globalAlpha = 1;
    g.drawImage(cv.base, 0, 0);
    g.drawImage(cv.top, 0, 0);
  }

  FK.brushes = { makeSeg, preview, emojiImage, sparkle, starPath, heartPath };
})();
