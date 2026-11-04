/* Farbtupf – Ausmalbilder: Schweiz. Drawn with the helper documented in js/art/dsl.js. */
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

  // Several sub-paths merged into one outlined region (head with a hair tuft).
  function union(g, p) {
    g.ctx.strokeStyle = '#000';
    g.ctx.lineWidth = g.lw * 2;
    g.ctx.stroke(p);
    g.ctx.fillStyle = '#fff';
    g.ctx.fill(p);
    return p;
  }

  // Adds a rounded rectangle to path p (all corners drawn clockwise, so unions fill solid).
  function rr(p, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    p.moveTo(x + r, y);
    p.arcTo(x + w, y, x + w, y + h, r);
    p.arcTo(x + w, y + h, x, y + h, r);
    p.arcTo(x, y + h, x, y, r);
    p.arcTo(x, y, x + w, y, r);
    p.closePath();
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
    const a = s * 0.1, b = s * 0.31;   // half arm width, half cross length
    g.poly([
      [cx - a, cy - b], [cx + a, cy - b], [cx + a, cy - a], [cx + b, cy - a], [cx + b, cy + a], [cx + a, cy + a],
      [cx + a, cy + b], [cx - a, cy + b], [cx - a, cy + a], [cx - b, cy + a], [cx - b, cy - a], [cx - a, cy - a],
    ]);
    return f;
  }

  // Tulip: stem, an open leaf (it shares the meadow's colour) and a cup that can carry a label.
  function tulip(g, x, y, s, lean) {
    g.at(x, y, lean || 0, s, () => {
      g.line('M0 0 L0 -95');
      g.line('M12 0 C34 -40 62 -84 88 -118 C48 -112 40 -50 54 0');
      g.shape('M-60 -200 L-30 -166 L0 -206 L30 -166 L60 -200 C72 -130 52 -88 0 -86 C-52 -88 -72 -130 -60 -200 Z');
    });
  }

  // Simple flying bird (two arcs).
  function bird(g, x, y, s) {
    g.line('M' + (x - s) + ' ' + y + ' Q' + (x - s * 0.5) + ' ' + (y - s * 0.6) + ' ' + x + ' ' + y +
      ' Q' + (x + s * 0.5) + ' ' + (y - s * 0.6) + ' ' + (x + s) + ' ' + y, g.lw * 0.8);
  }

  // Fir tree in three tiers (one region) on a trunk; top at (x, y), height h, half width w.
  function fir(g, x, y, h, w) {
    g.rect(x - w * 0.16, y + h * 0.9, w * 0.32, h * 0.22, 6);
    const t = (k) => y + h * k;
    g.poly([
      [x, y], [x + w * 0.45, t(0.32)], [x + w * 0.24, t(0.32)], [x + w * 0.72, t(0.64)], [x + w * 0.46, t(0.64)],
      [x + w, t(0.96)], [x - w, t(0.96)], [x - w * 0.46, t(0.64)], [x - w * 0.72, t(0.64)], [x - w * 0.24, t(0.32)],
      [x - w * 0.45, t(0.32)],
    ]);
  }

  // Cluster of round geranium blossoms (one region).
  function geranium(g, x, y, s) {
    return g.blob([[x - s * 0.5, y + s * 0.12, s * 0.36], [x, y - s * 0.02, s * 0.42], [x + s * 0.5, y + s * 0.12, s * 0.36],
      [x - s * 0.25, y - s * 0.3, s * 0.32], [x + s * 0.25, y - s * 0.3, s * 0.32]]);
  }

  /* ---------- Kuh ---------- */
  FK.art.add({
    id: 'kuh',
    name: 'Kuh',
    cat: 'schweiz',
    colors: ['braun', 'gelb', 'rot', 'gruen', 'hellblau', 'grau'],
    spots: [
      { x: 320, y: 170, c: 5 },   // sky
      { x: 110, y: 110, c: 2 },   // sun
      { x: 740, y: 160, c: 3 },   // flag
      { x: 560, y: 395, c: 6 },   // mountain
      { x: 55, y: 545, c: 6 },    // mountain left
      { x: 540, y: 930, c: 4 },   // meadow
      { x: 430, y: 590, c: 1 },   // body
      { x: 240, y: 330, c: 1 },   // head
      { x: 66, y: 375, c: 1 },    // ear left
      { x: 414, y: 375, c: 1 },   // ear right
      { x: 240, y: 610, c: 3 },   // strap
      { x: 240, y: 738, c: 2 },   // bell
      { x: 70, y: 869, c: 3 },    // tulip left
      { x: 896, y: 869, c: 2 },   // tulip right
    ],
    draw(g) {
      // sky
      g.sun(110, 110, 52, 10);
      g.cloud(560, 95, 84);
      bird(g, 300, 95, 30);
      bird(g, 372, 130, 22);
      // mountains with snow caps, Swiss flag on the summit
      alps(g, 'M-1200 640 L-300 600 L110 330 L250 440 L470 170 L610 370 L690 300 L790 640 Z', [
        'M40 420 L80 410 L110 440 L140 405 L170 420 L170 250 L40 250 Z',
        'M380 280 L415 300 L450 265 L485 300 L520 270 L560 290 L560 100 L380 100 Z',
        'M640 345 L668 330 L695 352 L725 332 L760 360 L760 250 L640 250 Z',
      ]);
      g.rect(681, 112, 18, 206, 9);
      g.circle(690, 106, 15);
      swissFlag(g, 699, 118, 206);
      // meadow
      ground(g, 630, 22);
      g.grass(340, 975, 13);
      g.grass(720, 975, 13);
      // tail
      g.line('M785 515 C850 520 862 480 872 450');
      g.shape('M872 398 C904 420 908 472 876 484 C844 478 842 430 872 398 Z');
      // body and legs in one outline, white patches, hooves
      const legs = [296, 410, 602, 716];
      const body = rr(new Path2D(), 250, 455, 545, 265, 125);
      legs.forEach((x) => rr(body, x, 600, 70, 230, 30));
      union(g, body);
      g.clip(body, () => {
        g.shape('M495 420 C505 535 640 545 680 420 Z');
        g.ellipse(555, 645, 60, 40, -0.15);
        g.ellipse(742, 590, 40, 52, 0.2);
      });
      legs.forEach((x) => g.rect(x - 4, 806, 78, 48, 18));
      // leather strap + Treichel (cow bell)
      g.shape('M128 518 Q240 598 352 518 L366 598 Q240 728 114 598 Z');
      g.heart(150, 574, 15);
      g.heart(330, 574, 15);
      g.rect(214, 654, 52, 42, 10);
      g.shape('M188 686 Q240 670 292 686 Q318 732 328 800 Q240 832 152 800 Q162 732 188 686 Z');
      g.line('M160 770 Q240 798 320 770', g.lw * 0.8);
      g.circle(240, 840, 22);
      // horns
      g.mirror(240, () => {
        g.shape('M168 318 C140 290 128 250 146 214 C170 232 190 266 214 300 Z');
      });
      // ears
      g.ellipse(100, 378, 84, 44, 0.3);
      g.ellipse(380, 378, 84, 44, -0.3);
      // head with a hair tuft
      const head = new Path2D('M240 282 C326 282 362 336 358 404 C356 458 324 482 240 482 C156 482 124 458 122 404 C118 336 154 282 240 282 Z');
      [[210, 292, 25], [240, 280, 29], [270, 292, 25]].forEach((c) => {
        head.moveTo(c[0] + c[2], c[1]);
        head.arc(c[0], c[1], c[2], 0, TAU);
      });
      union(g, head);
      // muzzle
      g.ellipse(240, 494, 112, 64);
      ink(g, 'M182 478 a14 18 0 1 0 28 0 a14 18 0 1 0 -28 0 Z');
      ink(g, 'M270 478 a14 18 0 1 0 28 0 a14 18 0 1 0 -28 0 Z');
      g.line('M200 528 Q240 556 280 528', g.lw * 0.8);
      // eyes
      g.dot(192, 392, 22, true);
      g.dot(288, 392, 22, true);
      // flowers
      tulip(g, 85, 1000, 1, -0.12);
      tulip(g, 880, 1000, 1, 0.12);
    },
  });
  /* ---------- Chalet ---------- */
  FK.art.add({
    id: 'chalet',
    name: 'Chalet',
    cat: 'schweiz',
    colors: ['braun', 'orange', 'rot', 'gruen', 'hellblau', 'grau'],
    spots: [
      { x: 498, y: 459, c: 1 },   // wall
      { x: 584, y: 691, c: 1 },   // lower wall
      { x: 498, y: 959, c: 1 },   // path
      { x: 214, y: 632, c: 2 },   // balcony
      { x: 486, y: 819, c: 2 },   // door
      { x: 660, y: 94, c: 3 },   // flag
      { x: 498, y: 225, c: 3 },   // roof
      { x: 360, y: 536, c: 3 },   // geraniums
      { x: 638, y: 536, c: 3 },   // geraniums
      { x: 900, y: 720, c: 4 },   // fir tree
      { x: 863, y: 922, c: 4 },   // meadow
      { x: 105, y: 898, c: 4 },   // meadow
      { x: 853, y: 150, c: 5 },   // sky
      { x: 330, y: 749, c: 5 },   // window
      { x: 669, y: 749, c: 5 },   // window
      { x: 96, y: 549, c: 6 },   // mountain
      { x: 818, y: 503, c: 6 },   // mountain
      { x: 965, y: 482, c: 6 },   // mountain
      { x: 412, y: 880, c: 6 },   // base
    ],
    draw(g) {
      // sky + mountains
      g.cloud(150, 120, 90);
      alps(g, 'M-1200 760 L-200 700 L130 330 L300 520 L420 360 L560 560 L700 300 L860 470 L960 380 L1300 700 L2200 760 Z', [
        'M60 420 L95 405 L130 430 L165 400 L200 425 L200 250 L60 250 Z',
        'M630 390 L665 372 L700 400 L735 372 L770 395 L770 250 L630 250 Z',
        'M910 430 L935 418 L960 440 L990 420 L990 330 L910 330 Z',
      ]);
      // meadow, path, fir tree
      ground(g, 760, 16);
      g.shape('M440 900 L560 900 L640 1400 L360 1400 Z');
      fir(g, 900, 420, 380, 95);
      // walls (gable + upper floor, lower floor) and stone base
      g.poly([[235, 600], [235, 400], [500, 262], [765, 400], [765, 600]]);
      g.rect(235, 640, 530, 230, 0);
      g.rect(215, 850, 570, 60, 12);
      // chimney + smoke, flag on the ridge
      g.rect(300, 200, 60, 140, 6);
      g.rect(288, 186, 84, 30, 8);
      g.line('M330 160 Q300 130 330 105 Q360 80 330 50', g.lw * 0.8);
      g.rect(491, 52, 18, 150, 9);
      g.circle(500, 46, 15);
      swissFlag(g, 509, 62, 190);
      // roof
      g.poly([[500, 168], [96, 408], [128, 458], [500, 274], [872, 458], [904, 408]]);
      // gable window
      g.circle(500, 350, 42);
      g.line('M500 308 L500 392 M458 350 L542 350', g.lw * 0.8);
      // upper windows
      g.rect(295, 420, 110, 120, 10);
      g.rect(595, 420, 110, 120, 10);
      // balcony with heart cut-outs and geraniums
      g.rect(190, 565, 620, 92, 10);
      [250, 500, 750].forEach((x) => g.heart(x, 606, 24));
      geranium(g, 350, 548, 150);
      geranium(g, 650, 548, 150);
      // lower windows and door
      g.rect(275, 700, 110, 105, 10);
      g.rect(615, 700, 110, 105, 10);
      g.rect(262, 800, 136, 30, 8);
      g.rect(602, 800, 136, 30, 8);
      g.shape('M440 870 L440 740 Q440 690 500 690 Q560 690 560 740 L560 870 Z');
      g.heart(500, 742, 20);
      g.circle(538, 800, 9);
    },
  });
})();
