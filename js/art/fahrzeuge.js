/* Farbklecks – Ausmalbilder: Fahrzeuge. Drawn with the helper documented in js/art/dsl.js. */
(function () {
  'use strict';
  const FK = window.FK;
  const TAU = Math.PI * 2;

  /* ---------- small local helpers ---------- */

  // A thick tube along a path with one merged outline (bike frames, ladders, pipes).
  // All segments of one call share a single outline, so joints melt together.
  function tube(g, d, T) {
    const ctx = g.ctx;
    const p = typeof d === 'string' ? new Path2D(d) : d;
    ctx.strokeStyle = '#000';
    ctx.lineWidth = T + g.lw;
    ctx.stroke(p);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = T - g.lw;
    ctx.stroke(p);
    return p;
  }

  // Friendly face: dot eyes with shine and a small smile.
  function face(g, x, y, gap, r, smileY, smileW) {
    g.dot(x - gap, y, r, true);
    g.dot(x + gap, y, r, true);
    const sy = y + (smileY || r * 2.2);
    const w = smileW || gap * 0.75;
    g.line('M' + (x - w) + ' ' + sy + ' Q' + x + ' ' + (sy + w * 0.8) + ' ' + (x + w) + ' ' + sy, g.lw * 0.8);
  }

  function sunFace(g, x, y, r) {
    g.sun(x, y, r, 10);
    face(g, x, y - r * 0.08, r * 0.32, r * 0.13, r * 0.3, r * 0.3);
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

  // A wide wavy meadow so landscape screens show one continuous ground.
  function hills(g, y, amp) {
    const a = amp || 25;
    return g.shape('M-1200 ' + y + ' Q-700 ' + (y - a) + ' -200 ' + y + ' Q250 ' + (y + a) + ' 600 ' + (y - a * 0.6) +
      ' Q1000 ' + (y - a * 1.4) + ' 1400 ' + y + ' Q1800 ' + (y + a) + ' 2200 ' + y + ' L2200 1400 L-1200 1400 Z');
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

  // Short tread marks on the outside of a tyre (open lines, they do not split the tyre).
  function treads(g, x, y, r, n, len) {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU;
      g.line('M' + (x + Math.cos(a) * r) + ' ' + (y + Math.sin(a) * r) + ' L' + (x + Math.cos(a) * (r - len)) + ' ' + (y + Math.sin(a) * (r - len)), g.lw * 0.8);
    }
  }

  // A round tree: trunk and a fluffy crown.
  function tree(g, x, y, s) {
    g.rect(x - s * 0.2, y - s * 0.2, s * 0.4, s * 1.2, s * 0.08);
    g.blob([[x - s * 0.45, y - s * 0.35, s * 0.5], [x + s * 0.45, y - s * 0.35, s * 0.5], [x, y - s * 0.8, s * 0.6], [x, y - s * 0.25, s * 0.5]]);
  }

  /* ---------- Zug ---------- */

  FK.art.add({
    id: 'zug',
    name: 'Zug',
    cat: 'fahrzeuge',
    colors: ['rot', 'gelb', 'gruen', 'hellblau', 'grau', 'blau'],
    spots: [
      { x: 491, y: 574, c: 1 },   // cab
      { x: 704, y: 558, c: 1 },   // boiler
      { x: 915, y: 802, c: 1 },   // cowcatcher
      { x: 880, y: 87, c: 2 },   // sun
      { x: 195, y: 617, c: 2 },   // wagon
      { x: 857, y: 570, c: 2 },   // front
      { x: 964, y: 670, c: 3 },   // meadow
      { x: 35, y: 754, c: 3 },   // meadow
      { x: 195, y: 693, c: 3 },   // wagon frame
      { x: 359, y: 757, c: 3 },   // meadow
      { x: 354, y: 939, c: 3 },   // grass
      { x: 122, y: 122, c: 4 },   // sky
      { x: 492, y: 451, c: 4 },   // cab window
      { x: 140, y: 538, c: 4 },   // window
      { x: 249, y: 538, c: 4 },   // window
      { x: 128, y: 353, c: 5 },   // mountain
      { x: 795, y: 395, c: 5 },   // chimney
      { x: 935, y: 416, c: 5 },   // mountain
      { x: 951, y: 527, c: 5 },   // mountain
      { x: 470, y: 751, c: 5 },   // wheel
      { x: 653, y: 751, c: 5 },   // wheel
      { x: 158, y: 790, c: 5 },   // wheel
      { x: 287, y: 792, c: 5 },   // wheel
      { x: 492, y: 322, c: 6 },   // cab roof
      { x: 195, y: 429, c: 6 },   // wagon roof
      { x: 664, y: 670, c: 6 },   // frame
    ],
    draw(g) {
      sunFace(g, 880, 115, 56);
      // mountains with snow caps
      const mB = g.shape('M640 660 L895 385 Q930 350 965 385 L1250 660 Z');
      g.clip(mB, () => g.line('M780 470 L825 450 L860 478 L895 446 L930 478 L965 448 L1000 476 L1040 452 L1090 470'));
      const mA = g.shape('M-420 660 L150 255 Q210 195 270 255 L690 660 Z');
      g.clip(mA, () => g.line('M-20 322 L30 296 L80 332 L130 294 L180 335 L230 295 L280 334 L330 300 L380 328 L430 308'));
      hills(g, 640, 22);
      // smoke
      puff(g, 772, 288, 44);
      puff(g, 640, 205, 56);
      puff(g, 470, 120, 66);
      // track
      for (let x = -1180; x < 2200; x += 120) g.rect(x, 832, 62, 50, 10);
      g.line('M-1200 840 L2200 840', g.lw * 1.4);
      flower(g, 120, 940, 48);
      flower(g, 500, 945, 48);
      flower(g, 880, 940, 48);

      // coach
      g.rect(70, 450, 250, 230, 20);
      g.rect(45, 398, 300, 62, 26);
      g.rect(100, 494, 80, 90, 18);
      g.rect(210, 494, 80, 90, 18);
      [130, 260].forEach((x) => {
        g.circle(x, 783, 57);
        g.dot(x, 783, 10);
      });
      g.rect(55, 662, 280, 64, 22);
      g.line('M335 690 L385 690', g.lw * 1.3);
      // a bird rides on the roof
      g.shape('M232 378 L196 354 L204 388 Z');
      g.ellipse(258, 370, 42, 30);
      g.circle(294, 340, 25);
      g.poly([[314, 334], [340, 342], [314, 350]]);
      g.dot(298, 335, 6, true);
      g.line('M244 366 Q262 386 284 370', g.lw * 0.7);

      // locomotive: lamp, dome and chimney behind the boiler
      g.rect(850, 432, 52, 60, 14);
      g.ellipse(690, 485, 50, 44);
      g.shape('M762 492 L768 420 L744 368 Q795 352 846 368 L822 420 L828 492 Z');
      g.rect(570, 478, 290, 205, 30);
      g.ellipse(858, 580, 44, 102);
      // cab
      g.rect(395, 345, 195, 345, 18);
      g.rect(380, 292, 225, 62, 26);
      g.rect(428, 392, 130, 120, 22);
      // frame, cow catcher, wheels with a coupling rod
      g.rect(380, 640, 540, 62, 22);
      g.shape('M890 702 L930 702 L958 838 L878 838 Z');
      g.circle(475, 770, 70);
      g.circle(650, 770, 70);
      g.circle(805, 790, 50);
      g.line('M475 806 L650 806', g.lw * 1.3);
      g.dot(475, 806, 12);
      g.dot(650, 806, 12);
      g.dot(805, 790, 10);
    },
  });

  /* ---------- Auto ---------- */

  FK.art.add({
    id: 'auto',
    name: 'Auto',
    cat: 'fahrzeuge',
    colors: ['rot', 'gelb', 'hellblau', 'gruen', 'grau', 'schwarz'],
    spots: [
      { x: 415, y: 684, c: 1 },   // car
      { x: 594, y: 695, c: 1 },   // door
      { x: 125, y: 94, c: 2 },   // sun
      { x: 445, y: 357, c: 2 },   // suitcase
      { x: 254, y: 331, c: 3 },   // sky
      { x: 418, y: 532, c: 3 },   // window
      { x: 650, y: 550, c: 3 },   // window
      { x: 74, y: 471, c: 4 },   // tree
      { x: 924, y: 471, c: 4 },   // tree
      { x: 968, y: 619, c: 4 },   // meadow
      { x: 32, y: 740, c: 4 },   // meadow
      { x: 84, y: 889, c: 5 },   // road
      { x: 280, y: 863, c: 6 },   // tyre
      { x: 719, y: 863, c: 6 },   // tyre
    ],
    draw(g) {
      sunFace(g, 125, 125, 60);
      puff(g, 730, 140, 72);
      g.line('M470 150 Q495 125 520 150 Q545 125 570 150', g.lw * 0.8);
      tree(g, 75, 520, 100);
      tree(g, 925, 520, 100);
      hills(g, 600, 25);
      // road with dashes
      g.shape('M-1200 780 L2200 780 L2200 1400 L-1200 1400 Z');
      for (let x = -1150; x < 2200; x += 260) g.rect(x, 935, 130, 30, 14);

      // suitcase on the roof
      g.line('M450 322 L450 298 Q480 278 510 298 L510 322', g.lw);
      g.rect(395, 318, 170, 95, 16);
      // car body
      g.shape('M130 795 C85 795 72 765 72 725 C72 660 100 615 180 605 L290 595 C320 470 375 400 465 395 L610 395 ' +
        'C690 395 735 440 785 570 L860 590 C915 605 935 650 935 715 C935 770 920 795 880 795 Z');
      // windows
      g.shape('M345 595 L368 492 Q382 448 425 448 L478 448 L478 595 Z');
      g.shape('M515 448 L600 448 Q648 448 676 500 L718 595 L515 595 Z');
      // driver
      g.shape('M528 597 Q532 575 566 572 Q600 575 606 597 Z');
      g.circle(566, 540, 42);
      g.shape('M524 540 Q520 496 566 494 Q612 496 608 540 Q590 522 566 524 Q542 522 524 540 Z');
      face(g, 566, 546, 16, 7, 20, 13);
      // door, handle, lights, bumpers
      g.rect(505, 620, 220, 150, 22);
      g.rect(670, 640, 38, 16, 8);
      g.ellipse(926, 672, 20, 32);
      g.rect(60, 668, 30, 50, 10);
      g.rect(868, 770, 88, 36, 18);
      g.rect(44, 770, 88, 36, 18);
      // wheels
      [260, 740].forEach((x) => {
        ring(g, x, 795, 98, 46);
        g.circle(x, 795, 46);
        g.dot(x, 795, 10);
      });
    },
  });

  /* ---------- Rakete ---------- */

  FK.art.add({
    id: 'rakete',
    name: 'Rakete',
    cat: 'fahrzeuge',
    colors: ['blau', 'rot', 'gelb', 'orange', 'hellblau', 'violett'],
    spots: [
      { x: 771, y: 549, c: 1 },   // space
      { x: 558, y: 304, c: 2 },   // nose
      { x: 237, y: 619, c: 2 },   // fin
      { x: 571, y: 751, c: 2 },   // fin
      { x: 52, y: 280, c: 3 },   // ring
      { x: 486, y: 716, c: 3 },   // band
      { x: 357, y: 798, c: 3 },   // flame
      { x: 179, y: 199, c: 4 },   // planet
      { x: 309, y: 919, c: 4 },   // flame
      { x: 518, y: 632, c: 5 },   // body
      { x: 473, y: 457, c: 6 },   // window
      { x: 825, y: 742, c: 6 },   // moon
    ],
    draw(g) {
      const ctx = g.ctx;
      [[880, 130, 52], [575, 92, 36], [95, 560, 42], [935, 470, 36], [640, 905, 42], [90, 900, 34], [370, 120, 30]].forEach((s) =>
        g.star(s[0], s[1], s[2], s[2] * 0.5));
      g.circle(760, 330, 20);
      g.circle(260, 430, 16);
      g.circle(250, 945, 18);
      // planet with a ring (back half of the ring, planet, front half)
      ctx.save();
      ctx.translate(190, 230);
      ctx.rotate(-0.35);
      const rp = new Path2D();
      rp.ellipse(0, 0, 180, 62, 0, 0, TAU);
      rp.ellipse(0, 0, 118, 26, 0, 0, TAU);
      ctx.fillStyle = '#fff';
      ctx.fill(rp, 'evenodd');
      ctx.strokeStyle = '#000';
      ctx.lineWidth = g.lw;
      ctx.stroke(rp);
      g.circle(0, 0, 92);
      ctx.save();
      const front = new Path2D();
      front.rect(-220, 0, 440, 90);
      ctx.clip(front);
      ctx.fillStyle = '#fff';
      ctx.fill(rp, 'evenodd');
      ctx.stroke(rp);
      ctx.restore();
      ctx.restore();
      // moon with a face
      g.circle(830, 790, 95);
      g.circle(785, 845, 18);
      g.circle(885, 742, 14);
      face(g, 832, 785, 30, 11, 30, 24);

      // rocket
      g.at(470, 520, 0.38, 1, () => {
        g.shape('M-72 245 Q-120 360 0 480 Q120 360 72 245 Z');
        g.shape('M-38 245 Q-62 330 0 400 Q62 330 38 245 Z');
        g.shape('M-112 40 Q-250 120 -240 260 Q-180 220 -110 215 Z');
        g.shape('M112 40 Q250 120 240 260 Q180 220 110 215 Z');
        g.rect(-90, 200, 180, 56, 16);
        const body = g.shape('M0 -340 C150 -250 160 -40 128 215 L-128 215 C-160 -40 -150 -250 0 -340 Z');
        g.clip(body, () => {
          g.line('M-170 -175 Q0 -128 170 -175');
          g.line('M-170 125 Q0 160 170 125');
        });
        g.circle(0, -30, 96);
        g.circle(0, -30, 62);
        g.clip(new Path2D('M62 -30 A62 62 0 1 1 61.9 -30.1 Z'), () => {
          g.circle(0, 8, 52);
          face(g, 0, 0, 20, 8, 22, 15);
        });
      });
    },
  });

  /* ---------- Velo ---------- */

  FK.art.add({
    id: 'velo',
    name: 'Velo',
    cat: 'fahrzeuge',
    colors: ['rot', 'grau', 'gelb', 'braun', 'gruen', 'hellblau'],
    spots: [
      { x: 422, y: 488, c: 1 },   // frame
      { x: 102, y: 733, c: 2 },   // tyre
      { x: 819, y: 816, c: 2 },   // tyre
      { x: 125, y: 94, c: 3 },   // sun
      { x: 830, y: 432, c: 3 },   // basket
      { x: 830, y: 216, c: 4 },   // dog
      { x: 419, y: 809, c: 5 },   // meadow
      { x: 646, y: 927, c: 5 },   // grass
      { x: 149, y: 378, c: 6 },   // sky
    ],
    draw(g) {
      sunFace(g, 125, 125, 60);
      puff(g, 480, 130, 70);
      hills(g, 860, 18);
      flower(g, 75, 940, 46);
      flower(g, 500, 950, 46);
      flower(g, 925, 940, 46);
      // wheels: fat tyres, spokes, hubs
      [[230, 690], [775, 690]].forEach((w) => {
        ring(g, w[0], w[1], 172, 98);
        for (let i = 0; i < 8; i++) {
          const a = (i / 8) * TAU + 0.2;
          g.line('M' + (w[0] + Math.cos(a) * 26) + ' ' + (w[1] + Math.sin(a) * 26) + ' L' + (w[0] + Math.cos(a) * 98) + ' ' + (w[1] + Math.sin(a) * 98), g.lw * 0.7);
        }
      });
      // handlebar and stem
      tube(g, 'M700 450 L684 372 L612 362', 36);
      g.rect(552, 342, 74, 38, 18);
      g.circle(648, 335, 22);
      // frame
      tube(g, 'M230 690 L470 720 L428 468 Z M428 468 L700 450 M712 530 L470 720 M700 450 L712 530 L775 690 M428 468 L414 405', 54);
      // saddle
      g.shape('M330 398 Q334 366 400 368 L472 372 Q490 398 448 408 L356 414 Q328 412 330 398 Z');
      // crank and pedal
      tube(g, 'M470 720 L520 808', 30);
      g.rect(482, 800, 84, 30, 12);
      g.circle(470, 720, 50);
      g.circle(470, 720, 14);
      g.circle(230, 690, 26);
      g.circle(775, 690, 26);

      // a puppy rides in the basket
      g.ellipse(752, 268, 32, 64, 0.35);
      g.ellipse(908, 268, 32, 64, -0.35);
      g.circle(830, 262, 82);
      g.ellipse(830, 300, 40, 30);
      g.dot(830, 286, 12);
      g.line('M830 298 L830 312 M812 318 Q830 330 848 318', g.lw * 0.8);
      g.dot(800, 248, 11, true);
      g.dot(860, 248, 11, true);
      // basket
      g.shape('M722 352 L938 352 L906 492 L754 492 Z');
      g.rect(704, 330, 252, 44, 18);
      g.ellipse(792, 336, 30, 20);
      g.ellipse(868, 336, 30, 20);
      g.line('M782 342 L782 354 M802 342 L802 354 M858 342 L858 354 M878 342 L878 354', g.lw * 0.7);
    },
  });

  /* ---------- Traktor ---------- */

  FK.art.add({
    id: 'traktor',
    name: 'Traktor',
    cat: 'fahrzeuge',
    colors: ['rot', 'gelb', 'grau', 'hellblau', 'gruen'],
    spots: [
      { x: 470, y: 413, c: 1 },   // cab
      { x: 691, y: 596, c: 1 },   // bonnet
      { x: 125, y: 90, c: 2 },   // sun
      { x: 254, y: 540, c: 2 },   // mudguard
      { x: 333, y: 812, c: 2 },   // rim
      { x: 789, y: 802, c: 2 },   // rim
      { x: 330, y: 278, c: 3 },   // roof
      { x: 357, y: 892, c: 3 },   // tyre
      { x: 888, y: 851, c: 3 },   // tyre
      { x: 350, y: 125, c: 4 },   // sky
      { x: 366, y: 422, c: 4 },   // window
      { x: 585, y: 851, c: 5 },   // meadow
    ],
    draw(g) {
      sunFace(g, 125, 120, 58);
      g.cloud(560, 110, 86);
      hills(g, 640, 25);
      g.grass(60, 930, 16);
      g.grass(560, 975, 16);
      g.grass(960, 960, 16);
      // smoke from the exhaust
      puff(g, 760, 245, 44);
      puff(g, 870, 165, 34);
      // exhaust pipe
      g.rect(712, 318, 40, 170, 12);
      g.rect(702, 300, 60, 30, 10);
      // cab with a farmer
      g.rect(140, 290, 380, 300, 18);
      g.rect(118, 248, 424, 62, 26);
      g.rect(185, 330, 235, 146, 20);
      g.shape('M216 478 Q220 448 270 444 Q320 448 324 478 Z');
      g.circle(270, 410, 40);
      g.ellipse(270, 378, 64, 15);
      g.shape('M232 378 Q234 342 270 340 Q306 342 308 378 Z');
      face(g, 270, 416, 14, 7, 17, 11);
      // lamp, hood with grille
      g.rect(872, 438, 48, 56, 14);
      const hood = g.shape('M440 470 L870 470 Q925 470 930 530 L935 695 Q935 725 905 725 L440 725 Z');
      g.clip(hood, () => {
        g.line('M880 470 L880 730');
        g.line('M880 560 L940 560 M880 640 L940 640', g.lw * 0.8);
      });
      // rear wheel with mudguard, front wheel
      ring(g, 320, 760, 195, 100);
      treads(g, 320, 760, 195, 22, 26);
      g.circle(320, 760, 100);
      g.dot(320, 760, 16);
      g.shape('M56 760 A264 264 0 0 1 584 760 L515 760 A195 195 0 0 0 125 760 Z');
      ring(g, 800, 835, 125, 64);
      treads(g, 800, 835, 125, 16, 18);
      g.circle(800, 835, 64);
      g.dot(800, 835, 11);
    },
  });

  /* ---------- Feuerwehrauto ---------- */

  FK.art.add({
    id: 'feuerwehr',
    name: 'Feuerwehrauto',
    cat: 'fahrzeuge',
    colors: ['rot', 'gelb', 'hellblau', 'grau', 'gruen', 'schwarz'],
    spots: [
      { x: 754, y: 660, c: 1 },   // cab
      { x: 506, y: 492, c: 1 },   // body
      { x: 191, y: 584, c: 2 },   // locker
      { x: 386, y: 584, c: 2 },   // locker
      { x: 424, y: 150, c: 3 },   // sky
      { x: 860, y: 559, c: 3 },   // window
      { x: 570, y: 541, c: 4 },   // hose reel
      { x: 210, y: 799, c: 4 },   // hub
      { x: 439, y: 799, c: 4 },   // hub
      { x: 809, y: 799, c: 4 },   // hub
      { x: 603, y: 901, c: 4 },   // road
      { x: 30, y: 717, c: 5 },   // bush
      { x: 269, y: 819, c: 6 },   // tyre
      { x: 460, y: 859, c: 6 },   // tyre
      { x: 749, y: 819, c: 6 },   // tyre
    ],
    draw(g) {
      g.cloud(190, 130, 88);
      g.cloud(800, 115, 76);
      hills(g, 640, 20);
      g.shape('M-1200 820 L2200 820 L2200 1400 L-1200 1400 Z');
      for (let x = -1150; x < 2200; x += 260) g.rect(x, 945, 130, 30, 14);
      // blue lights behind the roof edges
      g.shape('M825 404 L825 374 Q852 336 880 374 L880 404 Z');
      g.shape('M95 454 L95 422 Q125 382 155 422 L155 454 Z');
      // body with two shutters and a hose reel
      g.rect(70, 450, 640, 320, 26);
      g.rect(110, 500, 165, 190, 14);
      g.rect(305, 500, 165, 190, 14);
      g.line('M135 665 L250 665 M330 665 L445 665', g.lw * 0.8);
      g.circle(590, 595, 88);
      g.circle(590, 595, 26);
      // cab with a firefighter
      g.shape('M690 400 L860 400 Q900 400 915 440 L950 600 Q955 620 955 640 L955 760 Q955 780 935 780 L690 780 Z');
      g.shape('M730 440 L850 440 Q870 440 875 460 L905 595 L730 595 Z');
      g.shape('M742 597 Q746 568 785 565 Q824 568 830 597 Z');
      g.circle(785, 530, 40);
      g.shape('M738 520 Q738 466 785 464 Q832 466 832 520 Z');
      g.rect(728, 512, 114, 22, 11);
      face(g, 785, 552, 14, 6, 15, 11);
      g.rect(880, 640, 40, 16, 8);
      g.ellipse(950, 690, 16, 28);
      // bumper
      g.rect(55, 735, 910, 52, 22);
      // ladder on a turntable
      g.rect(120, 405, 120, 50, 12);
      let lad = 'M100 400 L780 367 M100 338 L780 305';
      for (let i = 0; i < 7; i++) {
        const x = 170 + i * 100;
        const y = 400 - (x - 100) * 0.0485;
        lad += ' M' + x + ' ' + y.toFixed(1) + ' L' + x + ' ' + (y - 62).toFixed(1);
      }
      tube(g, lad, 30);
      // wheels
      [210, 440, 810].forEach((x) => {
        ring(g, x, 800, 88, 38);
        g.circle(x, 800, 38);
      });
    },
  });
})();
