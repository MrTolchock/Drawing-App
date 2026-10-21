/* Farbklecks – Ausmalbilder: Schweiz. Drawn with the helper documented in js/art/dsl.js. */
(function () {
  'use strict';
  const FK = window.FK;
  const TAU = Math.PI * 2;

  /* ---------- local helpers ---------- */

  // Wavy ground that runs far beyond the box so wide screens show a continuous landscape.
  function ground(g, y, a) {
    return g.shape('M-1200 ' + y + ' Q-600 ' + (y - a) + ' 0 ' + y + ' Q250 ' + (y + a) + ' 500 ' + y +
      ' Q750 ' + (y - a) + ' 1000 ' + y + ' Q1600 ' + (y + a) + ' 2200 ' + y + ' L2200 1400 L-1200 1400 Z');
  }

  // Solid ink shape (noses, nostrils): not colourable.
  function ink(g, d) {
    const p = typeof d === 'string' ? new Path2D(d) : d;
    g.ctx.fillStyle = '#000';
    g.ctx.fill(p);
    g.ctx.strokeStyle = '#000';
    g.ctx.lineWidth = g.lw;
    g.ctx.stroke(p);
    return p;
  }

  // Mountain range: outline path `d`, snow caps given as polygons that are cut to the mountain.
  function alps(g, d, caps) {
    const m = g.shape(d);
    g.clip(m, () => caps.forEach((c) => g.shape(c)));
    g.draw(m, false);
    return m;
  }

  // Square Swiss flag (red field, white cross) with its top-left corner at (x, y), side s.
  function swissFlag(g, x, y, s) {
    const f = g.shape('M' + x + ' ' + y + ' Q' + (x + s * 0.5) + ' ' + (y - s * 0.08) + ' ' + (x + s) + ' ' + y +
      ' L' + (x + s) + ' ' + (y + s) + ' Q' + (x + s * 0.5) + ' ' + (y + s * 0.92) + ' ' + x + ' ' + (y + s) + ' Z');
    const cx = x + s / 2, cy = y + s / 2;
    const a = s * 0.12, b = s * 0.33;   // half arm width, half arm length
    g.poly([
      [cx - a, cy - b], [cx + a, cy - b], [cx + a, cy - a], [cx + b, cy - a], [cx + b, cy + a], [cx + a, cy + a],
      [cx + a, cy + b], [cx - a, cy + b], [cx - a, cy + a], [cx - b, cy + a], [cx - b, cy - a], [cx - a, cy - a],
    ]);
    return f;
  }

  // Tulip-like flower: stem, leaf and a cup with three points; the cup can carry a label.
  function tulip(g, x, y, s, lean) {
    g.at(x, y, lean || 0, s, () => {
      g.line('M0 0 L0 -95');
      g.shape('M0 -20 C30 -40 55 -75 60 -110 C25 -95 5 -70 0 -40 Z');
      g.shape('M-48 -175 L-24 -150 L0 -182 L24 -150 L48 -175 C58 -120 40 -90 0 -88 C-40 -90 -58 -120 -48 -175 Z');
    });
  }

  // Simple flying bird (two arcs).
  function bird(g, x, y, s) {
    g.line('M' + (x - s) + ' ' + y + ' Q' + (x - s * 0.5) + ' ' + (y - s * 0.6) + ' ' + x + ' ' + y +
      ' Q' + (x + s * 0.5) + ' ' + (y - s * 0.6) + ' ' + (x + s) + ' ' + y, g.lw * 0.8);
  }

  /* ---------- Kuh ---------- */
  FK.art.add({
    id: 'kuh',
    name: 'Kuh',
    cat: 'schweiz',
    colors: ['braun', 'gelb', 'rot', 'gruen', 'hellblau', 'grau'],
    spots: [],
    draw(g) {
      // sky things
      g.sun(110, 110, 52, 10);
      g.cloud(565, 100, 84);
      bird(g, 330, 120, 34);
      bird(g, 400, 160, 26);
      // mountains with snow caps, Swiss flag on the summit
      alps(g, 'M-1200 640 L-300 600 L110 330 L250 440 L470 170 L610 370 L690 300 L790 640 Z', [
        'M40 420 L80 410 L110 440 L140 405 L170 420 L170 250 L40 250 Z',
        'M380 280 L415 300 L450 265 L485 300 L520 270 L560 290 L560 100 L380 100 Z',
        'M640 345 L668 330 L695 352 L725 332 L760 360 L760 250 L640 250 Z',
      ]);
      g.rect(681, 168, 18, 150, 9);
      g.circle(690, 162, 15);
      swissFlag(g, 699, 176, 124);
      g.cloud(890, 250, 70);
      // meadow
      ground(g, 630, 22);
      // tail
      g.line('M785 515 C850 520 860 480 870 450');
      g.shape('M870 400 C900 420 905 470 875 482 C845 476 845 430 870 400 Z');
      // legs + hooves
      [290, 385, 615, 710].forEach((x) => {
        g.rect(x, 640, 66, 240, 28);
        g.rect(x - 3, 836, 72, 48, 18);
      });
      // body with white patches
      const body = g.rect(250, 455, 545, 265, 125);
      g.clip(body, () => {
        g.shape('M495 420 C505 535 640 545 680 420 Z');
        g.ellipse(560, 648, 62, 42, -0.15);
        g.ellipse(742, 590, 40, 52, 0.2);
      });
      g.draw(body, false);
      // strap + Treichel (cow bell)
      g.shape('M132 530 Q240 604 348 530 L356 572 Q240 650 124 572 Z');
      g.dot(160, 568, 9);
      g.dot(198, 590, 9);
      g.dot(282, 590, 9);
      g.dot(320, 568, 9);
      g.rect(216, 612, 48, 50, 10);
      g.shape('M188 652 Q240 638 292 652 Q322 700 334 772 Q240 806 146 772 Q158 700 188 652 Z');
      g.line('M156 742 Q240 772 324 742', g.lw * 0.8);
      g.circle(240, 812, 22);
      // horns
      g.mirror(240, () => {
        g.shape('M168 318 C140 290 128 250 146 214 C170 232 190 266 214 300 Z');
      });
      // ears
      g.ellipse(112, 382, 74, 40, 0.35);
      g.ellipse(368, 382, 74, 40, -0.35);
      // head + forelock
      g.shape('M240 282 C326 282 362 336 358 404 C356 458 324 482 240 482 C156 482 124 458 122 404 C118 336 154 282 240 282 Z');
      g.blob([[212, 292, 24], [240, 282, 28], [268, 292, 24]]);
      // muzzle
      g.ellipse(240, 500, 112, 68);
      ink(g, 'M196 478 m-14 0 a14 18 0 1 0 28 0 a14 18 0 1 0 -28 0');
      ink(g, 'M284 478 m-14 0 a14 18 0 1 0 28 0 a14 18 0 1 0 -28 0');
      g.line('M200 528 Q240 556 280 528', g.lw * 0.8);
      // eyes
      g.dot(192, 392, 22, true);
      g.dot(288, 392, 22, true);
      // flowers
      tulip(g, 90, 980, 1, -0.12);
      tulip(g, 545, 985, 0.9, 0.1);
      tulip(g, 900, 975, 1, 0.12);
    },
  });
})();
