/* Farbtupf – Ausmalbilder: Fahrzeuge 2 (Gondelbahn, Postauto, Dampfschiff). Drawn with the helper documented in js/art/dsl.js. */
(function () {
  'use strict';
  const FK = window.FK;
  const TAU = Math.PI * 2;

  /* ---------- small local helpers ---------- */

  // Wavy ground that runs far beyond the box so wide screens show a continuous landscape.
  function ground(g, y, a) {
    return g.shape('M-1200 ' + y + ' Q-600 ' + (y - a) + ' 0 ' + y + ' Q250 ' + (y + a) + ' 500 ' + y +
      ' Q750 ' + (y - a) + ' 1000 ' + y + ' Q1600 ' + (y + a) + ' 2200 ' + y + ' L2200 1400 L-1200 1400 Z');
  }

  // Water with little wave crests along the top, running far beyond the box.
  function water(g, y, a, n) {
    let d = 'M-1200 ' + y;
    for (let x = -1200; x < 2200; x += n) d += ' Q' + (x + n / 2) + ' ' + (y - a) + ' ' + (x + n) + ' ' + y;
    return g.shape(d + ' L2200 1400 L-1200 1400 Z');
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
    const a = s * 0.1, b = s * 0.31;
    g.poly([
      [cx - a, cy - b], [cx + a, cy - b], [cx + a, cy - a], [cx + b, cy - a], [cx + b, cy + a], [cx + a, cy + a],
      [cx + a, cy + b], [cx - a, cy + b], [cx - a, cy + a], [cx - b, cy + a], [cx - b, cy - a], [cx - a, cy - a],
    ]);
    return f;
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

  // Friendly face: dot eyes with shine and a small smile.
  function face(g, x, y, gap, r, smileY, smileW) {
    g.dot(x - gap, y, r, true);
    g.dot(x + gap, y, r, true);
    const sy = y + (smileY || r * 2.2);
    const w = smileW || gap * 0.75;
    g.line('M' + (x - w) + ' ' + sy + ' Q' + x + ' ' + (sy + w * 0.8) + ' ' + (x + w) + ' ' + sy, g.lw * 0.8);
  }

  // Sun with a face set low, so the forehead can carry a label.
  function sunFace(g, x, y, r) {
    g.sun(x, y, r, 10);
    face(g, x, y + r * 0.14, r * 0.3, r * 0.12, r * 0.25, r * 0.26);
  }

  // A puff of smoke / small cloud (one outline).
  function puff(g, x, y, s) {
    return g.blob([[x - s * 0.5, y + s * 0.1, s * 0.52], [x, y - s * 0.18, s * 0.66], [x + s * 0.55, y + s * 0.1, s * 0.48]]);
  }

  // Flower with merged petals and a round middle (2 regions).
  function flower(g, x, y, r) {
    const c = [];
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * TAU - Math.PI / 2;
      c.push([x + Math.cos(a) * r * 0.62, y + Math.sin(a) * r * 0.62, r * 0.5]);
    }
    g.blob(c);
    g.circle(x, y, r * 0.42);
  }

  // Tulip: stem, an open leaf (it shares the meadow's colour) and a cup that can carry a label.
  function tulip(g, x, y, s, lean) {
    g.at(x, y, lean || 0, s, () => {
      g.line('M0 0 L0 -95');
      g.line('M12 0 C34 -40 62 -84 88 -118 C48 -112 40 -50 54 0');
      g.shape('M-60 -200 L-30 -166 L0 -206 L30 -166 L60 -200 C72 -130 52 -88 0 -86 C-52 -88 -72 -130 -60 -200 Z');
    });
  }

  // Ring with an even-odd fill (a tyre): outer r1, inner r2.
  function ring(g, x, y, r1, r2) {
    const ctx = g.ctx;
    const p = new Path2D();
    p.arc(x, y, r1, 0, TAU);
    p.moveTo(x + r2, y);
    p.arc(x, y, r2, 0, TAU, true);
    ctx.fillStyle = '#fff';
    ctx.fill(p, 'evenodd');
    ctx.strokeStyle = '#000';
    ctx.lineWidth = g.lw;
    ctx.stroke(p);
    return p;
  }

  // Ink music note (the post bus horn): solid head, stem and flag. Not colourable.
  function note(g, x, y, s) {
    const ctx = g.ctx;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(0, 0, 17, 12, -0.4, 0, TAU);
    ctx.fill();
    ctx.restore();
    g.line('M' + (x + 14 * s) + ' ' + (y - 4 * s) + ' L' + (x + 14 * s) + ' ' + (y - 62 * s) +
      ' Q' + (x + 22 * s) + ' ' + (y - 40 * s) + ' ' + (x + 40 * s) + ' ' + (y - 34 * s), g.lw * 0.8);
  }

  /* ---------- Gondelbahn ---------- */

  FK.art.add({
    id: 'gondel',
    name: 'Gondelbahn',
    cat: 'schweiz',
    colors: ['rot', 'gelb', 'gruen', 'hellblau', 'grau'],
    spots: [
      { x: 848, y: 184, c: 4 },   // sky
      { x: 161, y: 345, c: 4 },   // sky
      { x: 625, y: 389, c: 4 },   // sky
      { x: 916, y: 476, c: 4 },   // sky
      { x: 119, y: 94, c: 2 },   // sun
      { x: 389, y: 278, c: 5 },   // grip
      { x: 389, y: 395, c: 5 },   // roof
      { x: 389, y: 676, c: 1 },   // gondola
      { x: 460, y: 488, c: 4 },   // window
      { x: 831, y: 384, c: 5 },   // pylon head
      { x: 839, y: 506, c: 5 },   // pylon
      { x: 839, y: 637, c: 5 },   // pylon
      { x: 839, y: 742, c: 5 },   // pylon
      { x: 687, y: 565, c: 5 },   // mountain
      { x: 954, y: 567, c: 5 },   // mountain
      { x: 84, y: 792, c: 3 },   // fir tree
      { x: 699, y: 809, c: 3 },   // fir tree
      { x: 954, y: 792, c: 3 },   // fir tree
      { x: 837, y: 918, c: 3 },   // meadow
      { x: 290, y: 907, c: 2 },   // tulip
      { x: 552, y: 903, c: 1 },   // tulip
    ],
    draw(g) {
      const ry = (x) => 220 + x * 0.15;   // the rope
      const ra = Math.atan(0.15);
      sunFace(g, 120, 115, 52);
      g.cloud(640, 105, 78);
      bird(g, 330, 95, 28);
      bird(g, 400, 132, 20);
      // mountains with snow caps
      alps(g, 'M-1200 820 L-300 800 L70 400 L250 600 L560 600 L690 430 L860 640 L980 470 L1300 780 L2200 820 Z', [
        'M-60 520 L-20 495 L20 520 L60 490 L100 520 L140 495 L170 515 L170 330 L-60 330 Z',
        'M620 470 L650 490 L680 468 L710 495 L740 474 L775 498 L775 380 L620 380 Z',
        'M920 540 L950 520 L980 545 L1010 520 L1045 540 L1045 420 L920 420 Z',
      ]);
      // pylon: tower, meadow, head carrying the rope
      const pyl = g.poly([[815, 400], [865, 400], [905, 830], [775, 830]]);
      g.clip(pyl, () => {
        g.line('M700 550 L1000 550');
        g.line('M700 690 L1000 690');
      });
      ground(g, 800, 18);
      g.at(840, ry(840), ra, 1, () => g.rect(-105, 6, 210, 68, 22));
      g.line('M-1200 ' + ry(-1200) + ' L2200 ' + ry(2200), g.lw * 1.4);
      // gondola: hanger, grip on the rope, roof, cabin
      const gx = 390, gy = ry(390);
      g.rect(gx - 18, gy, 36, 110, 8);
      g.at(gx, gy, ra, 1, () => g.rect(-62, -32, 124, 64, 24));
      g.shape('M230 452 Q230 366 390 362 Q550 366 550 452 Z');
      g.rect(190, 430, 400, 320, 56);
      // left window: a child with a bobble hat
      const w1 = g.rect(222, 455, 150, 160, 22);
      g.clip(w1, () => {
        g.circle(297, 582, 50);
        g.rect(242, 532, 110, 24, 12);
        g.shape('M252 536 Q252 494 297 492 Q342 494 342 536 Z');
        g.circle(297, 486, 11);
        face(g, 297, 580, 16, 7, 17, 12);
      });
      g.draw(w1, false);
      // right window: a happy dog
      const w2 = g.rect(408, 455, 150, 160, 22);
      g.clip(w2, () => {
        g.ellipse(444, 560, 19, 40, 0.3);
        g.ellipse(522, 560, 19, 40, -0.3);
        g.circle(483, 562, 41);
        g.dot(483, 575, 9);
        g.line('M467 585 Q475 594 483 585 Q491 594 499 585', g.lw * 0.7);
        g.dot(468, 550, 7, true);
        g.dot(498, 550, 7, true);
      });
      g.draw(w2, false);
      // fir trees and grass
      fir(g, 85, 560, 300, 92);
      fir(g, 700, 640, 220, 70);
      fir(g, 955, 600, 250, 78);
      g.grass(190, 960, 13);
      g.grass(420, 975, 13);
      tulip(g, 300, 1000, 0.7, -0.1);
      tulip(g, 545, 995, 0.7, 0.1);
    },
  });

  /* ---------- Postauto ---------- */

  FK.art.add({
    id: 'postauto',
    name: 'Postauto',
    cat: 'fahrzeuge',
    colors: ['gelb', 'hellblau', 'gruen', 'grau', 'rot'],
    spots: [
      { x: 669, y: 219, c: 2 },   // sky
      { x: 869, y: 88, c: 1 },   // sun
      { x: 187, y: 409, c: 4 },   // mountains
      { x: 935, y: 555, c: 3 },   // fir tree
      { x: 805, y: 574, c: 3 },   // meadow
      { x: 30, y: 646, c: 3 },   // meadow
      { x: 760, y: 726, c: 3 },   // meadow in the bend
      { x: 918, y: 783, c: 4 },   // road
      { x: 321, y: 729, c: 1 },   // bus
      { x: 433, y: 751, c: 1 },   // door
      { x: 166, y: 594, c: 2 },   // window
      { x: 441, y: 605, c: 2 },   // door window
      { x: 549, y: 576, c: 2 },   // driver's window
      { x: 956, y: 906, c: 5 },   // tulip
    ],
    draw(g) {
      sunFace(g, 870, 110, 56);
      g.cloud(220, 120, 84);
      bird(g, 470, 120, 26);
      bird(g, 535, 155, 18);
      alps(g, 'M-1200 560 L-200 540 L170 230 L340 400 L520 280 L700 460 L860 300 L1200 540 L2200 560 Z', [
        'M60 330 L100 305 L140 335 L180 300 L220 330 L260 310 L260 150 L60 150 Z',
        'M440 345 L475 325 L510 350 L545 322 L580 345 L600 330 L600 220 L440 220 Z',
        'M780 370 L815 350 L850 378 L885 348 L920 375 L955 355 L955 240 L780 240 Z',
      ]);
      ground(g, 520, 18);
      fir(g, 935, 400, 200, 62);
      // mountain road with a hairpin bend
      g.shape('M-1200 915 L560 915 C840 915 985 875 985 785 C985 690 860 635 600 600 L600 652 ' +
        'C790 668 862 712 862 755 C862 772 830 778 560 778 L-1200 778 Z');
      flower(g, 330, 960, 34);
      flower(g, 560, 965, 34);
      tulip(g, 945, 1000, 0.72, 0.12);
      // the horn plays «Dü-da-do»
      note(g, 700, 405, 1);
      note(g, 775, 345, 0.85);
      // bus (moved a little to the right so the meadow behind it stays paintable)
      g.at(30, 0, 0, 1, () => {
        g.shape('M80 810 Q40 810 40 770 L40 555 Q40 500 95 500 L585 500 Q640 500 652 552 L668 650 L670 770 Q670 810 630 810 Z');
        // passenger windows, one with a child
        g.rect(72, 535, 130, 120, 18);
        const w2 = g.rect(218, 535, 130, 120, 18);
        g.clip(w2, () => {
          g.circle(283, 612, 40);
          g.shape('M245 606 Q240 566 283 564 Q326 566 321 606 Q304 588 283 590 Q262 588 245 606 Z');
          face(g, 283, 614, 15, 6, 15, 10);
        });
        g.draw(w2, false);
        // door
        g.rect(366, 530, 92, 260, 14);
        g.rect(380, 546, 64, 120, 10);
        g.rect(430, 690, 16, 36, 8);
        // driver
        const dw = g.shape('M478 535 L600 535 Q630 535 637 565 L652 655 L478 655 Z');
        g.clip(dw, () => {
          g.circle(590, 608, 33);
          g.shape('M556 600 Q558 564 590 562 Q622 564 624 600 Z');
          g.rect(554, 590, 76, 16, 8);
          face(g, 590, 616, 12, 6, 13, 9);
        });
        g.draw(dw, false);
        // mirror, lights, bumpers
        g.line('M655 560 L690 552', g.lw * 0.8);
        g.ellipse(698, 580, 12, 28);
        g.ellipse(664, 712, 14, 24);
        g.rect(30, 680, 22, 48, 10);
        g.rect(625, 762, 80, 34, 16);
        g.rect(15, 762, 60, 34, 16);
        // wheels
        [170, 545].forEach((x) => {
          ring(g, x, 815, 72, 34);
          g.circle(x, 815, 34);
          g.dot(x, 815, 8);
        });
      });
    },
  });

  /* ---------- Dampfschiff ---------- */

  FK.art.add({
    id: 'dampfschiff',
    name: 'Dampfschiff',
    cat: 'fahrzeuge',
    colors: ['hellblau', 'tuerkis', 'rot', 'gelb', 'grau', 'braun'],
    spots: [
      { x: 641, y: 108, c: 1 },   // sky
      { x: 859, y: 97, c: 4 },   // sun
      { x: 71, y: 450, c: 5 },   // mountains
      { x: 960, y: 503, c: 5 },   // mountain
      { x: 36, y: 602, c: 2 },   // lake
      { x: 857, y: 591, c: 2 },   // lake
      { x: 964, y: 720, c: 2 },   // lake
      { x: 707, y: 872, c: 2 },   // lake
      { x: 862, y: 327, c: 3 },   // flag
      { x: 877, y: 676, c: 3 },   // hull
      { x: 494, y: 500, c: 3 },   // roof
      { x: 439, y: 658, c: 3 },   // paddle box hub
      { x: 647, y: 398, c: 4 },   // chimney
      { x: 647, y: 298, c: 6 },   // chimney top
      { x: 305, y: 565, c: 4 },   // deck house
      { x: 590, y: 571, c: 4 },   // deck house
      { x: 231, y: 584, c: 1 },   // window
      { x: 667, y: 584, c: 1 },   // window
      { x: 763, y: 584, c: 1 },   // window
      { x: 339, y: 647, c: 6 },   // paddle box
      { x: 398, y: 588, c: 4 },   // paddle box
      { x: 480, y: 588, c: 6 },   // paddle box
      { x: 540, y: 647, c: 4 },   // paddle box
      { x: 163, y: 938, c: 4 },   // duck
    ],
    draw(g) {
      const ctx = g.ctx;
      sunFace(g, 860, 120, 58);
      g.cloud(170, 120, 84);
      bird(g, 300, 215, 26);
      bird(g, 360, 250, 18);
      alps(g, 'M-1200 570 L-250 560 L150 300 L330 450 L520 250 L700 450 L820 380 L1250 570 L2200 580 Z', [
        'M40 380 L80 360 L120 388 L160 355 L200 385 L240 365 L240 230 L40 230 Z',
        'M430 330 L465 312 L500 338 L540 308 L575 335 L610 318 L610 200 L430 200 Z',
        'M745 425 L780 405 L815 430 L855 402 L895 428 L930 410 L930 330 L745 330 Z',
      ]);
      water(g, 565, 12, 100);
      g.line('M80 600 Q100 588 120 600 M690 590 Q710 578 730 590', g.lw * 0.7);
      // smoke and chimney
      puff(g, 560, 240, 42);
      puff(g, 470, 168, 52);
      g.rect(615, 300, 66, 220, 8);
      g.rect(600, 266, 96, 66, 14);
      // flag at the bow, flying back in the wind
      g.rect(897, 262, 16, 370, 8);
      g.circle(905, 256, 13);
      ctx.save();
      ctx.translate(1794, 0);
      ctx.scale(-1, 1);
      swissFlag(g, 897, 297, 172);
      ctx.restore();
      // deck house with windows, roof
      g.rect(170, 518, 650, 130, 12);
      g.rect(188, 552, 88, 64, 14);
      g.rect(628, 552, 80, 64, 14);
      g.rect(724, 552, 80, 64, 14);
      g.rect(140, 466, 710, 68, 22);
      // hull with portholes
      g.shape('M55 640 L955 622 Q915 760 835 800 L165 800 Q90 778 55 640 Z');
      [130, 205, 670, 745, 820].forEach((x) => g.circle(x, 722, 18));
      // paddle box with a fan
      const box = new Path2D();
      box.moveTo(290, 690);
      box.arc(440, 690, 150, Math.PI, 0);
      box.closePath();
      g.draw(box);
      for (let k = 1; k < 4; k++) {
        const a = Math.PI + (k * Math.PI) / 4;
        g.line('M' + (440 + Math.cos(a) * 62) + ' ' + (690 + Math.sin(a) * 62) + ' L' + (440 + Math.cos(a) * 150) + ' ' + (690 + Math.sin(a) * 150));
      }
      const hub = new Path2D();
      hub.moveTo(378, 690);
      hub.arc(440, 690, 62, Math.PI, 0);
      hub.closePath();
      g.draw(hub);
      // lake in front with a duck
      water(g, 775, 20, 110);
      g.line('M560 900 Q585 885 610 900 M790 940 Q815 925 840 940 M380 960 Q405 945 430 960', g.lw * 0.7);
      g.at(165, 900, 0, 1.25, () => {
        // body and head in one outline
        const duck = new Path2D('M-80 0 Q-85 60 0 62 Q70 62 78 12 Q55 22 35 12 Q0 -8 -45 2 Q-62 -28 -80 0 Z');
        duck.moveTo(72, -10);
        duck.arc(42, -10, 30, 0, TAU, true);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = g.lw * 2;
        ctx.stroke(duck);
        ctx.fillStyle = '#fff';
        ctx.fill(duck);
        g.shape('M66 -16 Q98 -16 104 -4 Q94 8 66 4 Z');
        g.dot(48, -18, 6, true);
      });
    },
  });
})();
