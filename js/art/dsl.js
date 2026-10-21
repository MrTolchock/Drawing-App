/* Farbklecks – Ausmalbilder: Zeichensprache und Verzeichnis.
   Every picture is drawn back to front in a 1000×1000 box: shapes get a white fill and a black
   outline, so nearer shapes hide the lines behind them. The result is turned into transparent
   "ink" so the child's paint shows through and the fill bucket stops at the lines.

   A page:
     FK.art.add({
       id: 'katze',              unique, lowercase ascii
       name: 'Katze',            shown to the child (Swiss Standard German)
       cat: 'tiere',             one of FK.art.CATS ids
       draw(g) { … },            draws the outline with the helper below
       colors: ['orange', …],    FK.COLORS ids for colour slots 1…n (n = 3…6)
       spots: [{ x, y, c }],     label anchors in the 1000-box; c = slot 1…n; one spot per region
     })
*/
(function () {
  'use strict';
  const FK = (window.FK = window.FK || {});
  const TAU = Math.PI * 2;
  const BOX = 1000;
  const FIT = 0.94;

  const CATS = [
    { id: 'tiere', name: 'Tiere', icon: '🐾' },
    { id: 'schweiz', name: 'Schweiz', icon: '🇨🇭' },
    { id: 'fahrzeuge', name: 'Fahrzeuge', icon: '🚂' },
    { id: 'fantasie', name: 'Fantasie', icon: '🦄' },
    { id: 'natur', name: 'Natur', icon: '🌻' },
    { id: 'punkte', name: 'Punkt zu Punkt', icon: '✏️', hidden: true },
  ];

  function roundRectPath(p, x, y, w, h, r) {
    r = Math.max(0, Math.min(r, w / 2, h / 2));
    p.moveTo(x + r, y);
    p.arcTo(x + w, y, x + w, y + h, r);
    p.arcTo(x + w, y + h, x, y + h, r);
    p.arcTo(x, y + h, x, y, r);
    p.arcTo(x, y, x + w, y, r);
    p.closePath();
  }

  // The drawing helper handed to page.draw(g). All coordinates are in the 1000×1000 box.
  function helper(ctx, lw) {
    const P = (d) => (typeof d === 'string' ? new Path2D(d) : d);
    const g = {
      lw,          // default line width (box units); thin details: g.lw * 0.7
      ctx,         // raw CanvasRenderingContext2D, already transformed to box units
      // Filled white + outlined: hides everything drawn earlier underneath it.
      draw(path, fill) {
        if (fill !== false) {
          ctx.fillStyle = '#fff';
          ctx.fill(path);
        }
        ctx.strokeStyle = '#000';
        ctx.lineWidth = g.lw;
        ctx.stroke(path);
        return path;
      },
      shape(d) { return g.draw(P(d)); },                 // SVG path string or Path2D, closed shape
      line(d, w) {                                       // open line, no fill
        ctx.strokeStyle = '#000';
        ctx.lineWidth = w || g.lw;
        ctx.stroke(P(d));
      },
      circle(x, y, r) {
        const p = new Path2D();
        p.arc(x, y, r, 0, TAU);
        return g.draw(p);
      },
      ellipse(x, y, rx, ry, rot) {
        const p = new Path2D();
        p.ellipse(x, y, rx, ry, rot || 0, 0, TAU);
        return g.draw(p);
      },
      rect(x, y, w, h, r) {
        const p = new Path2D();
        roundRectPath(p, x, y, w, h, r || 0);
        return g.draw(p);
      },
      poly(pts) {
        const p = new Path2D();
        pts.forEach((q, i) => (i ? p.lineTo(q[0], q[1]) : p.moveTo(q[0], q[1])));
        p.closePath();
        return g.draw(p);
      },
      star(x, y, R, r, n, rot) {
        n = n || 5;
        rot = rot === undefined ? -Math.PI / 2 : rot;
        const p = new Path2D();
        for (let i = 0; i < n * 2; i++) {
          const a = rot + (i * Math.PI) / n;
          const rr = i % 2 ? r : R;
          if (i) p.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
          else p.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
        }
        p.closePath();
        return g.draw(p);
      },
      heart(x, y, s) {
        const p = new Path2D();
        p.moveTo(x, y + s * 0.95);
        p.bezierCurveTo(x - s * 0.35, y + s * 0.62, x - s * 1.15, y + s * 0.2, x - s * 1.05, y - s * 0.38);
        p.bezierCurveTo(x - s * 0.95, y - s * 0.98, x - s * 0.2, y - s * 1.08, x, y - s * 0.5);
        p.bezierCurveTo(x + s * 0.2, y - s * 1.08, x + s * 0.95, y - s * 0.98, x + s * 1.05, y - s * 0.38);
        p.bezierCurveTo(x + s * 1.15, y + s * 0.2, x + s * 0.35, y + s * 0.62, x, y + s * 0.95);
        p.closePath();
        return g.draw(p);
      },
      // Ink-filled dot (pupils, nostrils) with an optional white shine. Not colourable.
      dot(x, y, r, shine) {
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, TAU);
        ctx.fill();
        if (shine) {
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.arc(x - r * 0.35, y - r * 0.35, r * 0.32, 0, TAU);
          ctx.fill();
        }
      },
      // Several circles merged into one outline without inner lines (clouds, tree tops, smoke).
      blob(circles) {
        const p = new Path2D();
        circles.forEach((c) => {
          p.moveTo(c[0] + c[2], c[1]);
          p.arc(c[0], c[1], c[2], 0, TAU);
        });
        ctx.strokeStyle = '#000';
        ctx.lineWidth = g.lw * 2;
        ctx.stroke(p);
        ctx.fillStyle = '#fff';
        ctx.fill(p);
        return p;
      },
      cloud(x, y, s) {
        return g.blob([[x - s * 0.55, y + s * 0.1, s * 0.38], [x - s * 0.1, y - s * 0.15, s * 0.5], [x + s * 0.45, y + s * 0.05, s * 0.4], [x, y + s * 0.2, s * 0.4]]);
      },
      sun(x, y, r, rays) {
        rays = rays === undefined ? 10 : rays;
        for (let i = 0; i < rays; i++) {
          const a = (i / rays) * TAU;
          g.line('M' + (x + Math.cos(a) * r * 1.3) + ' ' + (y + Math.sin(a) * r * 1.3) + ' L' + (x + Math.cos(a) * r * 1.75) + ' ' + (y + Math.sin(a) * r * 1.75));
        }
        return g.circle(x, y, r);
      },
      // Draws inside `path` only (stripes on a fish, spots on a cow).
      clip(path, fn) {
        ctx.save();
        ctx.clip(path);
        fn();
        ctx.restore();
      },
      // Draws fn() and its mirror image around the vertical line x = cx.
      mirror(cx, fn) {
        fn();
        ctx.save();
        ctx.translate(cx * 2, 0);
        ctx.scale(-1, 1);
        fn();
        ctx.restore();
      },
      // Runs fn() translated, rotated (radians) and scaled around (x, y).
      at(x, y, rot, scale, fn) {
        ctx.save();
        ctx.translate(x, y);
        if (rot) ctx.rotate(rot);
        if (scale && scale !== 1) ctx.scale(scale, scale);
        fn();
        ctx.restore();
      },
      flower(x, y, r) {
        for (let i = 0; i < 5; i++) {
          const a = (i / 5) * TAU - Math.PI / 2;
          g.circle(x + Math.cos(a) * r, y + Math.sin(a) * r, r * 0.72);
        }
        return g.circle(x, y, r * 0.6);
      },
      grass(x, y, s) {
        g.line('M' + (x - s) + ' ' + y + ' Q' + (x - s * 0.8) + ' ' + (y - s * 1.2) + ' ' + (x - s * 1.3) + ' ' + (y - s * 2));
        g.line('M' + x + ' ' + y + ' Q' + (x + s * 0.1) + ' ' + (y - s * 1.5) + ' ' + (x - s * 0.1) + ' ' + (y - s * 2.6));
        g.line('M' + (x + s) + ' ' + y + ' Q' + (x + s * 0.9) + ' ' + (y - s * 1.2) + ' ' + (x + s * 1.4) + ' ' + (y - s * 1.9));
      },
    };
    return g;
  }

  /* ---------- registry ---------- */

  const PAGES = [];

  function add(page) {
    if (!page || !page.id || typeof page.draw !== 'function') return;
    if (PAGES.some((p) => p.id === page.id)) return;
    page.spots = page.spots || [];
    page.colors = page.colors || [];
    PAGES.push(page);
  }

  function find(id) { return PAGES.find((p) => p.id === id) || null; }
  function list(cat) { return cat ? PAGES.filter((p) => p.cat === cat) : PAGES.slice(); }
  function hasLabels(page) { return !!(page && page.spots.length && page.colors.length); }

  /* ---------- rendering ---------- */

  function fitOf(W, H) {
    const s = Math.min(W / BOX, H / BOX) * FIT;
    return { s, ox: (W - BOX * s) / 2, oy: (H - BOX * s) / 2 };
  }

  function drawArt(ctx, page, W, H, minLinePx) {
    const f = fitOf(W, H);
    ctx.save();
    ctx.setTransform(f.s, 0, 0, f.s, f.ox, f.oy);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const g = helper(ctx, Math.max(9, (minLinePx || 0) / f.s));
    page.draw(g);
    ctx.restore();
  }

  // Draws the outline layer onto a transparent canvas as ink and returns its alpha channel
  // (the walls for the fill bucket and the "stay inside the lines" crayons).
  function renderOutline(canvas, page, minLinePx, ink) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    if (!page) return null;
    drawArt(ctx, page, W, H, minLinePx);
    const img = ctx.getImageData(0, 0, W, H);
    const d = img.data;
    const alpha = new Uint8Array(W * H);
    const ir = ink[0], ig = ink[1], ib = ink[2];
    for (let i = 0, j = 0; j < alpha.length; i += 4, j++) {
      const a = d[i + 3];
      if (!a) continue;
      const lum = (d[i] + d[i + 1] + d[i + 2]) / 3;
      const na = Math.round((a * (255 - lum)) / 255);
      alpha[j] = na;
      d[i] = ir;
      d[i + 1] = ig;
      d[i + 2] = ib;
      d[i + 3] = na;
    }
    ctx.putImageData(img, 0, 0);
    return alpha;
  }

  function thumb(canvas, page) {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (page) drawArt(ctx, page, canvas.width, canvas.height, canvas.width / 170);
  }

  // Spot positions in paper pixels for a paper of W×H.
  function spotsOnPaper(page, W, H) {
    const f = fitOf(W, H);
    return page.spots.map((sp) => ({ x: f.ox + sp.x * f.s, y: f.oy + sp.y * f.s, c: sp.c, scale: f.s }));
  }

  // A connect-the-dots picture becomes a colouring page once it is finished:
  // optional back(g), then the line through all points, then detail(g).
  function fromDots(d) {
    return {
      id: d.id,
      name: d.name,
      cat: 'punkte',
      colors: d.colors || [],
      spots: d.spots || [],
      draw(g) {
        if (d.back) d.back(g);
        const p = new Path2D();
        d.points.forEach((q, i) => (i ? p.lineTo(q[0], q[1]) : p.moveTo(q[0], q[1])));
        if (d.closed === false) g.line(p);
        else {
          p.closePath();
          g.draw(p);
        }
        if (d.detail) d.detail(g);
      },
    };
  }

  FK.art = { CATS, add, find, list, hasLabels, drawArt, renderOutline, thumb, spotsOnPaper, fitOf, helper, fromDots, BOX, FIT };
})();
