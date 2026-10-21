/* Farbklecks – Ausmalbilder: Natur. Drawn with the helper documented in js/art/dsl.js. */
(function () {
  'use strict';
  const FK = window.FK;
  const TAU = Math.PI * 2;

  /* ---------- small local helpers ---------- */

  // Friendly face: dot eyes with shine and a small smile.
  function face(g, x, y, gap, r, smileDy, smileW) {
    g.dot(x - gap, y, r, true);
    g.dot(x + gap, y, r, true);
    const sy = y + (smileDy || r * 2.2);
    const w = smileW || gap * 0.7;
    g.line('M' + (x - w) + ' ' + sy + ' Q' + x + ' ' + (sy + w * 0.8) + ' ' + (x + w) + ' ' + sy, g.lw * 0.8);
  }

  // Sun with rays and a happy face in its lower half (the label goes on the forehead).
  function sunFace(g, x, y, r) {
    g.sun(x, y, r, 10);
    face(g, x, y + r * 0.12, r * 0.3, r * 0.12, r * 0.3, r * 0.26);
  }

  // Several closed shapes merged into one outline (no inner lines), like g.blob for any path.
  function merge(g, list) {
    const ctx = g.ctx;
    const ps = list.map((d) => (typeof d === 'string' ? new Path2D(d) : d));
    ctx.strokeStyle = '#000';
    ctx.lineWidth = g.lw * 2;
    ps.forEach((p) => ctx.stroke(p));
    ctx.fillStyle = '#fff';
    ps.forEach((p) => ctx.fill(p));
    return ps;
  }

  function rectD(x, y, w, h, r) {
    return 'M' + (x + r) + ' ' + y + ' L' + (x + w - r) + ' ' + y + ' Q' + (x + w) + ' ' + y + ' ' + (x + w) + ' ' + (y + r) +
      ' L' + (x + w) + ' ' + (y + h - r) + ' Q' + (x + w) + ' ' + (y + h) + ' ' + (x + w - r) + ' ' + (y + h) +
      ' L' + (x + r) + ' ' + (y + h) + ' Q' + x + ' ' + (y + h) + ' ' + x + ' ' + (y + h - r) +
      ' L' + x + ' ' + (y + r) + ' Q' + x + ' ' + y + ' ' + (x + r) + ' ' + y + ' Z';
  }

  // Flower with merged petals and a round middle (2 regions).
  function flower(g, x, y, r) {
    const c = [];
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * TAU - Math.PI / 2;
      c.push([x + Math.cos(a) * r * 0.62, y + Math.sin(a) * r * 0.62, r * 0.5]);
    }
    g.blob(c);
    g.circle(x, y, r * 0.4);
  }

  // Flower on a short stem with one leaf line.
  function stemFlower(g, x, y, r, h) {
    g.line('M' + x + ' ' + (y + r * 0.6) + ' Q' + (x + 6) + ' ' + (y + h * 0.6) + ' ' + x + ' ' + (y + h), g.lw * 0.8);
    flower(g, x, y, r);
  }

  // An apple: round body with a dent on top, stem, optional leaf and a little shine.
  function apple(g, x, y, r, leaf) {
    g.line('M' + x + ' ' + (y - r * 0.6) + ' Q' + (x + r * 0.05) + ' ' + (y - r * 1.05) + ' ' + (x + r * 0.25) + ' ' + (y - r * 1.25), g.lw * 0.8);
    if (leaf) g.ellipse(x + r * 0.62, y - r * 1.05, r * 0.38, r * 0.2, -0.45);
    g.shape('M' + x + ' ' + (y - r * 0.68) +
      ' C' + (x + r * 0.4) + ' ' + (y - r * 1.08) + ' ' + (x + r * 1.08) + ' ' + (y - r * 0.92) + ' ' + (x + r * 1.02) + ' ' + (y - r * 0.05) +
      ' C' + (x + r * 0.98) + ' ' + (y + r * 0.72) + ' ' + (x + r * 0.42) + ' ' + (y + r * 1.02) + ' ' + x + ' ' + (y + r * 0.9) +
      ' C' + (x - r * 0.42) + ' ' + (y + r * 1.02) + ' ' + (x - r * 0.98) + ' ' + (y + r * 0.72) + ' ' + (x - r * 1.02) + ' ' + (y - r * 0.05) +
      ' C' + (x - r * 1.08) + ' ' + (y - r * 0.92) + ' ' + (x - r * 0.4) + ' ' + (y - r * 1.08) + ' ' + x + ' ' + (y - r * 0.68) + ' Z');
    g.line('M' + (x - r * 0.62) + ' ' + (y - r * 0.12) + ' Q' + (x - r * 0.6) + ' ' + (y - r * 0.48) + ' ' + (x - r * 0.3) + ' ' + (y - r * 0.56), g.lw * 0.7);
  }

  /* ---------- Haus ---------- */

  FK.art.add({
    id: 'haus',
    name: 'Haus',
    cat: 'natur',
    colors: ['rot', 'gelb', 'hellblau', 'gruen', 'braun', 'grau'],
    spots: [
      { x: 339, y: 248, c: 1 },   // roof
      { x: 850, y: 106, c: 2 },   // sun
      { x: 339, y: 533, c: 2 },   // wall
      { x: 682, y: 614, c: 3 },   // sky
      { x: 343, y: 419, c: 3 },   // round window
      { x: 233, y: 535, c: 3 },   // window
      { x: 502, y: 536, c: 3 },   // window
      { x: 845, y: 530, c: 4 },   // tree
      { x: 777, y: 812, c: 4 },   // meadow
      { x: 202, y: 862, c: 4 },   // meadow
      { x: 839, y: 649, c: 5 },   // trunk
      { x: 339, y: 698, c: 5 },   // door
      { x: 489, y: 191, c: 6 },   // chimney
      { x: 339, y: 926, c: 6 },   // path
    ],
    draw(g) {
      sunFace(g, 850, 140, 80);
      g.cloud(170, 122, 95);
      // a bird far away
      g.line('M600 262 Q622 240 644 262 Q666 240 688 262', g.lw * 0.8);
      // tree behind, on the right
      g.rect(798, 540, 84, 240, 20);
      g.blob([[840, 400, 100], [775, 465, 62], [905, 465, 62], [840, 505, 78]]);
      g.line('M800 380 Q815 360 835 372 M860 450 Q875 430 895 442 M790 490 Q805 470 825 482', g.lw * 0.7);
      // meadow
      g.shape('M-1200 720 Q-500 690 150 712 Q520 735 820 712 Q1400 680 2200 720 L2200 1400 L-1200 1400 Z');
      // path to the door (its top hides under the house)
      g.shape('M297 770 C292 850 248 930 208 1060 L472 1060 C432 930 388 850 383 770 Z');
      // smoke + chimney (behind the roof)
      g.blob([[495, 138, 28], [540, 102, 33], [597, 80, 28]]);
      merge(g, [rectD(450, 190, 80, 200, 8), rectD(436, 148, 108, 52, 14)]);
      // wall with gable
      g.shape('M100 790 L100 450 L340 240 L580 450 L580 790 Z');
      // roof
      g.shape('M25 475 L340 165 L655 475 L535 475 L340 305 L145 475 Z');
      // round attic window
      g.circle(340, 415, 42);
      g.line('M318 400 Q326 388 340 384', g.lw * 0.7);
      // windows with flower boxes
      [205, 475].forEach((cx) => {
        g.rect(cx - 55, 490, 110, 120, 14);
        g.line('M' + (cx - 35) + ' 535 L' + (cx - 15) + ' 515 M' + (cx - 35) + ' 562 L' + (cx + 8) + ' 519', g.lw * 0.7);
        g.blob([[cx - 33, 603, 26], [cx, 594, 28], [cx + 33, 603, 26]]);
        g.rect(cx - 65, 605, 130, 45, 10);
      });
      // door
      g.shape('M290 790 L290 660 A50 50 0 0 1 390 660 L390 790 Z');
      g.dot(372, 742, 9);
      // flowers in the grass
      stemFlower(g, 70, 820, 46, 70);
      stemFlower(g, 640, 880, 46, 70);
      stemFlower(g, 930, 830, 46, 70);
      g.grass(170, 960, 14);
      g.grass(560, 990, 14);
      g.grass(820, 950, 14);
    },
  });

  /* ---------- Blume ---------- */

  FK.art.add({
    id: 'blume',
    name: 'Blume',
    cat: 'natur',
    colors: ['pink', 'violett', 'gelb', 'gruen', 'orange', 'rot'],
    spots: [
      { x: 498, y: 137, c: 1 },   // petal
      { x: 315, y: 319, c: 1 },   // petal
      { x: 682, y: 319, c: 1 },   // petal
      { x: 500, y: 503, c: 1 },   // petal
      { x: 498, y: 894, c: 1 },   // heart
      { x: 371, y: 190, c: 2 },   // petal
      { x: 629, y: 188, c: 2 },   // petal
      { x: 629, y: 448, c: 2 },   // petal
      { x: 369, y: 450, c: 2 },   // petal
      { x: 498, y: 267, c: 3 },   // centre
      { x: 502, y: 696, c: 4 },   // stem
      { x: 775, y: 119, c: 5 },   // butterfly
      { x: 901, y: 150, c: 5 },   // butterfly
      { x: 413, y: 918, c: 5 },   // pot
      { x: 498, y: 774, c: 6 },   // pot rim
    ],
    draw(g) {
      // butterfly
      g.at(835, 150, 0.25, 1, () => {
        g.ellipse(-48, 42, 46, 40, 0.5);
        g.ellipse(48, 42, 46, 40, -0.5);
        g.ellipse(-58, -18, 64, 50, -0.35);
        g.ellipse(58, -18, 64, 50, 0.35);
        g.line('M-8 -48 Q-20 -85 -38 -92 M8 -48 Q20 -85 38 -92', g.lw * 0.8);
        g.ellipse(0, 10, 20, 62);
      });
      // stem and leaves (one shape)
      const stem = 'M478 430 C470 560 490 640 478 790 L522 790 C534 640 514 560 522 430 Z';
      const leafL = 'M492 705 C440 640 360 600 285 620 C330 690 420 728 494 735 Z';
      const leafR = 'M508 660 C560 590 650 560 725 575 C690 640 600 680 506 690 Z';
      merge(g, [stem, leafL, leafR]);
      g.line('M480 715 Q400 670 330 640', g.lw * 0.7);
      g.line('M520 670 Q600 620 680 590', g.lw * 0.7);
      // petals around a happy middle
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * TAU - Math.PI / 2;
        g.ellipse(500 + Math.cos(a) * 165, 320 + Math.sin(a) * 165, 100, 64, a);
      }
      g.circle(500, 320, 118);
      face(g, 500, 330, 42, 15, 40, 24);
      g.ellipse(424, 372, 22, 13);
      g.ellipse(576, 372, 22, 13);
      // ladybug on the right leaf
      g.at(640, 600, -0.35, 1, () => {
        g.circle(0, -42, 22);
        g.circle(0, 0, 40);
        g.line('M0 -40 L0 12', g.lw * 0.7);
        g.dot(-18, -6, 8);
        g.dot(18, -6, 8);
        g.dot(-14, 20, 7);
        g.dot(14, 20, 7);
      });
      // pot
      g.shape('M330 800 L670 800 L632 958 Q628 975 610 975 L390 975 Q372 975 368 958 Z');
      g.rect(300, 735, 400, 80, 24);
      g.heart(500, 890, 40);
    },
  });

  /* ---------- Glace ---------- */

  // A scoop of ice cream: round top and a drippy bottom edge.
  function scoopD(cx, cy, r, drips) {
    const a = 0.26;
    const x1 = cx - r * Math.cos(a), x2 = cx + r * Math.cos(a), y1 = cy + r * Math.sin(a);
    let d = 'M' + x1 + ' ' + y1 + ' A' + r + ' ' + r + ' 0 1 1 ' + x2 + ' ' + y1;
    const n = drips.length;
    const w = (x2 - x1) / n;
    for (let i = 0; i < n; i++) {
      const xa = x2 - i * w, xb = x2 - (i + 1) * w;
      const dep = drips[i] * r;
      d += ' C' + (xa - w * 0.05) + ' ' + (y1 + dep * 1.3) + ' ' + (xb + w * 0.05) + ' ' + (y1 + dep * 1.3) + ' ' + xb + ' ' + y1;
    }
    return d + ' Z';
  }

  FK.art.add({
    id: 'glace',
    name: 'Glace',
    cat: 'natur',
    colors: ['rosa', 'braun', 'gelb', 'orange', 'rot'],
    spots: [
      { x: 498, y: 360, c: 1 },   // strawberry
      { x: 631, y: 546, c: 2 },   // chocolate
      { x: 368, y: 546, c: 3 },   // vanilla
      { x: 429, y: 688, c: 4 },   // cone
      { x: 570, y: 688, c: 4 },   // cone
      { x: 498, y: 757, c: 4 },   // cone
      { x: 450, y: 828, c: 4 },   // cone
      { x: 549, y: 828, c: 4 },   // cone
      { x: 498, y: 895, c: 4 },   // cone
      { x: 506, y: 264, c: 5 },   // cherry
    ],
    draw(g) {
      // cone with a waffle pattern
      const cone = g.shape('M292 600 L708 600 L530 942 Q500 990 470 942 Z');
      g.clip(cone, () => {
        for (let k = -6; k <= 6; k++) {
          const x = 500 + k * 141;
          g.line('M' + (x - 500) + ' 470 L' + (x + 500) + ' 1470', g.lw * 0.8);
          g.line('M' + (x + 500) + ' 470 L' + (x - 500) + ' 1470', g.lw * 0.8);
        }
      });
      // two scoops below, one on top
      g.shape(scoopD(392, 585, 128, [0.26, 0.16, 0.36, 0.18]));
      g.shape(scoopD(608, 585, 128, [0.18, 0.36, 0.16, 0.26]));
      g.shape(scoopD(500, 420, 140, [0.12, 0.2, 0.1, 0.2, 0.12]));
      // cherry
      g.line('M505 225 Q512 170 560 138');
      g.ellipse(592, 140, 36, 17, -0.25);
      g.circle(500, 262, 46);
      g.line('M478 245 Q482 232 494 228', g.lw * 0.7);
      // face
      face(g, 500, 405, 46, 15, 36, 24);
      g.ellipse(420, 446, 22, 13);
      g.ellipse(580, 446, 22, 13);
    },
  });

  /* ---------- Mandala ---------- */

  FK.art.add({
    id: 'mandala',
    name: 'Mandala',
    cat: 'natur',
    colors: ['violett', 'pink', 'gelb', 'orange', 'hellblau', 'rot'],
    spots: [
      { x: 467, y: 193, c: 1 },   // petal
      { x: 193, y: 532, c: 1 },   // petal
      { x: 805, y: 532, c: 1 },   // petal
      { x: 467, y: 805, c: 1 },   // petal
      { x: 350, y: 137, c: 2 },   // gap
      { x: 649, y: 137, c: 2 },   // gap
      { x: 135, y: 350, c: 2 },   // gap
      { x: 862, y: 350, c: 2 },   // gap
      { x: 546, y: 380, c: 2 },   // flower
      { x: 135, y: 649, c: 2 },   // gap
      { x: 863, y: 649, c: 2 },   // gap
      { x: 350, y: 862, c: 2 },   // gap
      { x: 649, y: 862, c: 2 },   // gap
      { x: 498, y: 106, c: 3 },   // dot
      { x: 498, y: 498, c: 3 },   // centre
      { x: 108, y: 498, c: 3 },   // dot
      { x: 891, y: 498, c: 3 },   // dot
      { x: 498, y: 891, c: 3 },   // dot
      { x: 254, y: 309, c: 4 },   // petal
      { x: 745, y: 309, c: 4 },   // petal
      { x: 254, y: 690, c: 4 },   // petal
      { x: 745, y: 690, c: 4 },   // petal
      { x: 500, y: 708, c: 5 },   // ring
      { x: 222, y: 222, c: 6 },   // dot
      { x: 777, y: 222, c: 6 },   // dot
      { x: 222, y: 777, c: 6 },   // dot
      { x: 777, y: 777, c: 6 },   // dot
    ],
    draw(g) {
      const C = 500;
      for (let i = 0; i < 8; i++) {
        g.at(C, C, (i + 0.5) * (TAU / 8), 1, () => g.shape('M0 -220 C80 -265 110 -340 0 -448 C-110 -340 -80 -265 0 -220 Z'));
      }
      for (let i = 0; i < 8; i++) {
        g.at(C, C, i * (TAU / 8), 1, () => {
          g.shape('M0 -235 C95 -250 140 -360 98 -425 C68 -475 -68 -475 -98 -425 C-140 -360 -95 -250 0 -235 Z');
          g.circle(0, -392, 44);
        });
      }
      g.circle(C, C, 258);
      const lobes = [];
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * TAU + TAU / 16;
        lobes.push([C + Math.cos(a) * 118, C + Math.sin(a) * 118, 54]);
      }
      g.blob(lobes);
      g.circle(C, C, 80);
    },
  });

  /* ---------- Regenbogen ---------- */

  FK.art.add({
    id: 'regenbogen',
    name: 'Regenbogen',
    cat: 'natur',
    colors: ['rot', 'orange', 'gelb', 'gruen', 'hellblau', 'violett'],
    spots: [
      { x: 505, y: 309, c: 1 },   // band
      { x: 470, y: 388, c: 2 },   // band
      { x: 857, y: 105, c: 3 },   // sun
      { x: 477, y: 465, c: 3 },   // band
      { x: 492, y: 543, c: 4 },   // band
      { x: 41, y: 960, c: 4 },   // meadow
      { x: 959, y: 960, c: 4 },   // meadow
      { x: 585, y: 137, c: 5 },   // sky
      { x: 498, y: 622, c: 5 },   // band
      { x: 500, y: 831, c: 5 },   // sky
      { x: 498, y: 699, c: 6 },   // band
    ],
    draw(g) {
      sunFace(g, 858, 135, 72);
      g.cloud(150, 150, 80);
      g.line('M300 120 Q320 100 340 120 Q360 100 380 120', g.lw * 0.8);
      // the bands: flat ellipses, thick on top and slimmer towards the clouds
      for (let i = 0; i <= 6; i++) g.ellipse(500, 860, 455 - i * 36, 590 - i * 78);
      // meadow
      g.shape('M-1200 900 Q-600 870 0 905 Q500 945 1000 905 Q1600 870 2200 900 L2200 1400 L-1200 1400 Z');
      // happy clouds at both ends
      g.mirror(500, () => {
        g.blob([[85, 845, 72], [168, 792, 92], [262, 838, 78], [178, 888, 80]]);
        face(g, 175, 838, 30, 11, 26, 22);
      });
      stemFlower(g, 420, 965, 40, 60);
      stemFlower(g, 590, 975, 40, 60);
    },
  });

  /* ---------- Apfelbaum ---------- */

  FK.art.add({
    id: 'apfelbaum',
    name: 'Apfelbaum',
    cat: 'natur',
    colors: ['rot', 'gruen', 'braun', 'hellgruen', 'hellblau', 'gelb'],
    spots: [
      { x: 383, y: 169, c: 1 },   // apple
      { x: 243, y: 304, c: 1 },   // apple
      { x: 608, y: 394, c: 1 },   // apple
      { x: 163, y: 398, c: 1 },   // apple
      { x: 287, y: 444, c: 1 },   // apple
      { x: 459, y: 448, c: 1 },   // apple
      { x: 173, y: 909, c: 1 },   // apple
      { x: 267, y: 938, c: 1 },   // apple
      { x: 392, y: 310, c: 2 },   // crown
      { x: 467, y: 772, c: 3 },   // trunk
      { x: 491, y: 906, c: 4 },   // meadow
      { x: 161, y: 644, c: 5 },   // sky
      { x: 757, y: 653, c: 5 },   // sky
      { x: 869, y: 94, c: 6 },   // sun
      { x: 570, y: 228, c: 6 },   // apple
      { x: 749, y: 767, c: 6 },   // swing
    ],
    draw(g) {
      sunFace(g, 870, 120, 64);
      // meadow
      g.shape('M-1200 810 Q-300 780 300 815 Q700 850 1100 860 Q1600 870 2200 820 L2200 1400 L-1200 1400 Z');
      // trunk with a long branch for the swing
      merge(g, [
        'M368 850 Q408 800 412 720 L418 430 L522 430 L520 720 Q526 800 572 850 Q540 832 512 845 Q470 826 428 845 Q400 832 368 850 Z',
        'M470 600 L880 470 Q912 462 916 492 Q918 520 890 528 L470 662 Z',
      ]);
      // crown
      g.blob([[400, 300, 190], [230, 360, 130], [570, 350, 135], [300, 170, 130], [500, 160, 130], [400, 430, 130]]);
      // apples in the tree
      apple(g, 240, 300, 40, true);
      apple(g, 380, 165, 40, false);
      apple(g, 565, 225, 40, true);
      apple(g, 605, 390, 40, false);
      apple(g, 455, 445, 40, true);
      apple(g, 285, 440, 40, false);
      apple(g, 160, 395, 36, false);
      // swing
      g.line('M660 600 L660 740 M840 543 L840 740');
      g.rect(620, 730, 260, 78, 22);
      // bird on the branch
      g.poly([[856, 424], [818, 402], [828, 446]]);
      g.circle(885, 428, 42);
      g.poly([[924, 414], [956, 426], [924, 440]]);
      g.dot(900, 414, 8, true);
      g.ellipse(872, 442, 26, 15, 0.35);
      // apples in the grass + flowers
      apple(g, 170, 905, 40, true);
      apple(g, 265, 935, 36, false);
      stemFlower(g, 720, 930, 42, 60);
      stemFlower(g, 930, 920, 42, 60);
      g.grass(80, 960, 14);
      g.grass(420, 960, 14);
      g.grass(560, 970, 14);
    },
  });
})();
