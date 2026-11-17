/* Farbtupf – Ausmalbilder: Fantasie. Drawn with the helper documented in js/art/dsl.js. */
(function () {
  'use strict';
  const FK = window.FK;

  // Point and direction on a cubic bezier given as [x0,y0,x1,y1,x2,y2,x3,y3].
  function bez(p, t) {
    const u = 1 - t;
    const x = u * u * u * p[0] + 3 * u * u * t * p[2] + 3 * u * t * t * p[4] + t * t * t * p[6];
    const y = u * u * u * p[1] + 3 * u * u * t * p[3] + 3 * u * t * t * p[5] + t * t * t * p[7];
    const dx = 3 * u * u * (p[2] - p[0]) + 6 * u * t * (p[4] - p[2]) + 3 * t * t * (p[6] - p[4]);
    const dy = 3 * u * u * (p[3] - p[1]) + 6 * u * t * (p[5] - p[3]) + 3 * t * t * (p[7] - p[5]);
    return { x, y, a: Math.atan2(dy, dx) };
  }

  // A wide wavy meadow so landscape screens show one continuous ground.
  function ground(g, y, amp) {
    const a = amp || 20;
    return g.shape('M-1200 ' + y + ' Q-700 ' + (y - a) + ' -200 ' + y + ' Q250 ' + (y + a) + ' 600 ' + (y - a * 0.6) +
      ' Q1000 ' + (y - a * 1.4) + ' 1400 ' + y + ' Q1800 ' + (y + a) + ' 2200 ' + y + ' L2200 1400 L-1200 1400 Z');
  }

  // Simple flower: one merged petal outline and a round middle (2 regions), optional stem.
  function flower(g, x, y, r, stem) {
    if (stem) g.line('M' + x + ' ' + (y + r) + ' Q' + (x - r * 0.3) + ' ' + (y + r + stem / 2) + ' ' + x + ' ' + (y + r + stem), g.lw * 0.8);
    const c = [];
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
      c.push([x + Math.cos(a) * r * 0.62, y + Math.sin(a) * r * 0.62, r * 0.5]);
    }
    g.blob(c);
    g.circle(x, y, r * 0.4);
  }

  /* ------------------------------------------------------------------ Dino */
  const DINO_TAIL = [70, 770, 170, 730, 250, 590, 370, 520];
  const DINO_BACK = [370, 520, 460, 460, 590, 455, 650, 485];
  // [curve, t, scale] – plates sit on the back line, pointing away from the body.
  const DINO_PLATES = [[DINO_TAIL, 0.5, 0.95], [DINO_TAIL, 0.84, 1.25], [DINO_BACK, 0.2, 1.5], [DINO_BACK, 0.56, 1.5], [DINO_BACK, 0.9, 1.2]];
  const dinoPlateSpots = DINO_PLATES.map((q) => {
    const b = bez(q[0], q[1]);
    const d = 40 * q[2];
    return { x: Math.round(b.x + d * Math.sin(b.a)), y: Math.round(b.y - d * Math.cos(b.a)), c: 3 };
  });

  FK.art.add({
    id: 'dino',
    name: 'Dino',
    cat: 'fantasie',
    colors: ['gruen', 'gelb', 'orange', 'hellblau', 'braun', 'hellgruen'],
    spots: [
      { x: 330, y: 90, c: 4 },    // Himmel
      { x: 470, y: 130, c: 2 },   // Sonne
      { x: 95, y: 560, c: 5 },    // Vulkan
      { x: 150, y: 400, c: 3 },   // Lava
      { x: 560, y: 615, c: 1 },   // Körper
      { x: 815, y: 300, c: 1 },   // Kopf
      { x: 690, y: 610, c: 2 },   // Bauch
      { x: 335, y: 830, c: 6 },   // Bein hinten (hinten)
      { x: 432, y: 830, c: 1 },   // Bein hinten (vorne)
      { x: 595, y: 830, c: 6 },   // Bein vorne (hinten)
      { x: 688, y: 830, c: 1 },   // Bein vorne (vorne)
      { x: 500, y: 945, c: 6 },   // Wiese
      { x: 880, y: 868, c: 2 },   // Eierschale
      { x: 905, y: 768, c: 1 },   // Baby
    ].concat(dinoPlateSpots),
    draw(g) {
      g.sun(470, 130, 58, 10);
      const volcano = g.shape('M-90 770 L95 355 Q150 328 205 355 L380 770 Z');
      g.clip(volcano, () => {
        g.shape('M-50 300 L260 300 L260 430 Q246 478 226 446 Q210 420 196 444 Q180 512 160 452 Q146 420 128 446 Q108 498 90 440 Q76 410 40 430 Z');
      });
      g.blob([[150, 290, 32], [118, 240, 26], [172, 222, 30], [140, 180, 24]]);
      ground(g, 740, 18);

      const plate = () => g.shape('M-44 34 Q-48 -28 0 -78 Q48 -28 44 34 Z');
      DINO_PLATES.forEach((q) => {
        const b = bez(q[0], q[1]);
        g.at(b.x, b.y, b.a, q[2], plate);
      });

      // Far legs (lighter), body, near legs.
      g.rect(290, 700, 92, 178, 40);
      g.rect(548, 700, 92, 178, 40);
      const body = g.shape('M70 770 C170 730 250 590 370 520 C460 460 590 455 650 485 C680 440 680 380 695 330 L800 340 ' +
        'C795 430 770 510 740 570 C730 690 680 785 570 790 L400 790 C330 790 290 778 260 768 C200 766 130 778 70 770 Z');
      g.clip(body, () => {
        g.shape('M815 340 C735 470 670 590 585 660 C500 730 410 755 240 790 L240 900 L940 900 L940 340 Z');
        g.circle(500, 530, 30);
        g.circle(410, 600, 24);
        g.circle(310, 650, 20);
      });
      g.rect(385, 712, 95, 175, 40);
      g.rect(640, 712, 95, 175, 40);

      // Head.
      g.shape('M640 310 C630 215 710 178 780 195 C850 210 908 248 910 310 C912 372 840 400 760 395 C690 390 648 360 640 310 Z');
      g.dot(740, 268, 23, true);
      g.dot(884, 280, 7);
      g.line('M802 355 Q846 374 890 344');
      g.ellipse(712, 345, 26, 16);

      // Baby dino hatching from an egg.
      g.circle(872, 742, 72);
      g.dot(846, 728, 11, true);
      g.dot(886, 726, 11, true);
      g.line('M852 756 Q866 768 880 756', g.lw * 0.8);
      g.at(895, 668, 0.35, 1, () => g.shape('M-52 18 L-36 2 L-20 18 L-3 0 L14 18 L30 2 L46 18 C48 -28 25 -48 -3 -48 C-31 -48 -54 -28 -52 18 Z'));
      g.shape('M802 818 L826 794 L850 818 L874 794 L898 818 L922 794 L946 818 C952 876 924 912 874 912 C824 912 796 876 802 818 Z');
    },
  });

  /* --------------------------------------------------------------- Einhorn */
  FK.art.add({
    id: 'einhorn',
    name: 'Einhorn',
    cat: 'fantasie',
    colors: ['rosa', 'violett', 'pink', 'gelb', 'hellblau', 'hellgruen'],
    spots: [
      { x: 205, y: 381, c: 1 },   // head
      { x: 664, y: 558, c: 1 },   // body
      { x: 419, y: 728, c: 1 },   // leg
      { x: 734, y: 728, c: 1 },   // leg
      { x: 391, y: 252, c: 2 },   // mane
      { x: 865, y: 426, c: 2 },   // rainbow
      { x: 529, y: 526, c: 2 },   // mane
      { x: 901, y: 646, c: 2 },   // tail
      { x: 451, y: 331, c: 3 },   // mane
      { x: 884, y: 348, c: 3 },   // rainbow
      { x: 877, y: 535, c: 3 },   // tail
      { x: 90, y: 129, c: 4 },   // star
      { x: 489, y: 436, c: 4 },   // mane
      { x: 906, y: 769, c: 4 },   // tail
      { x: 653, y: 147, c: 5 },   // sky
      { x: 257, y: 878, c: 6 },   // meadow
    ],
    draw(g) {
      // Rainbow behind the unicorn; the meadow hides its feet.
      const cx = 760, cy = 760;
      [470, 390, 310, 230].forEach((r) => {
        g.shape('M' + (cx - r) + ' ' + cy + ' A' + r + ' ' + r + ' 0 0 1 ' + (cx + r) + ' ' + cy + ' Z');
      });
      g.star(90, 130, 60, 30);
      g.star(480, 90, 46, 24);
      ground(g, 700, 18);
      flower(g, 80, 840, 50, 40);
      flower(g, 920, 880, 44, 40);

      // Tail.
      const tail = g.shape('M775 495 C850 450 945 490 935 580 C975 620 975 700 940 735 C960 780 940 830 890 830 ' +
        'C860 780 840 720 830 680 C820 640 800 610 780 600 Z');
      g.clip(tail, () => {
        g.line('M935 580 C890 590 840 580 790 560');
        g.line('M940 735 C900 735 860 700 820 660');
      });
      // Far legs.
      g.rect(448, 650, 66, 210, 26);
      g.rect(640, 650, 66, 210, 26);
      g.rect(444, 812, 74, 56, 20);
      g.rect(636, 812, 74, 56, 20);
      // Body with neck.
      g.shape('M420 470 C540 450 700 450 780 480 C850 505 860 620 800 680 C760 715 700 720 640 712 L470 712 ' +
        'C400 712 350 690 340 620 C330 560 300 470 290 400 L335 300 C380 360 390 430 420 470 Z');
      // Near legs.
      g.rect(385, 640, 70, 230, 28);
      g.rect(700, 640, 70, 230, 28);
      g.rect(380, 815, 80, 60, 20);
      g.rect(695, 815, 80, 60, 20);

      // Mane.
      const mane = g.shape('M300 225 C360 190 440 205 455 270 C510 280 540 330 520 375 C570 395 585 450 550 485 ' +
        'C590 520 570 575 520 570 C470 540 420 470 400 420 C380 380 360 350 340 320 Z');
      g.clip(mane, () => {
        g.line('M455 270 C420 280 380 300 330 330');
        g.line('M520 375 C470 385 420 400 360 420');
        g.line('M550 485 C510 490 460 495 400 500');
      });
      // Ear, horn, head.
      g.shape('M292 258 Q300 180 335 145 Q362 200 350 270 Z');
      g.shape('M308 245 Q314 205 333 178 Q347 212 340 250 Z');
      const horn = g.shape('M218 248 L228 70 L288 240 Z');
      g.clip(horn, () => {
        g.line('M205 200 L275 180', g.lw * 0.8);
        g.line('M210 140 L262 125', g.lw * 0.8);
      });
      g.shape('M345 300 C335 245 285 225 240 232 C190 240 165 285 148 330 C128 385 120 440 168 452 ' +
        'C210 462 255 448 292 428 C345 400 355 345 345 300 Z');
      g.shape('M300 238 C262 232 228 252 212 292 C240 280 268 280 292 292 Z');
      g.dot(238, 325, 20, true);
      g.line('M222 307 L208 292 M234 303 L230 285 M248 305 L254 288', g.lw * 0.7);
      g.dot(160, 405, 7);
      g.line('M168 432 Q195 448 225 432');
      g.ellipse(285, 380, 28, 18);
    },
  });

  /* ---------------------------------------------------------------- Drache */
  FK.art.add({
    id: 'drache',
    name: 'Drache',
    cat: 'fantasie',
    colors: ['gruen', 'gelb', 'orange', 'rot', 'hellblau', 'hellgruen'],
    spots: [
      { x: 500, y: 274, c: 1 },   // head
      { x: 424, y: 536, c: 1 },   // body
      { x: 368, y: 638, c: 1 },   // arm
      { x: 631, y: 638, c: 1 },   // arm
      { x: 359, y: 743, c: 1 },   // leg
      { x: 640, y: 743, c: 1 },   // leg
      { x: 701, y: 790, c: 1 },   // tail
      { x: 436, y: 850, c: 1 },   // foot
      { x: 562, y: 850, c: 1 },   // foot
      { x: 84, y: 90, c: 2 },   // sun
      { x: 498, y: 606, c: 2 },   // belly
      { x: 498, y: 780, c: 2 },   // belly
      { x: 134, y: 404, c: 3 },   // wing
      { x: 865, y: 404, c: 3 },   // wing
      { x: 327, y: 491, c: 3 },   // wing
      { x: 672, y: 491, c: 3 },   // wing
      { x: 477, y: 696, c: 3 },   // belly
      { x: 225, y: 502, c: 4 },   // wing
      { x: 774, y: 502, c: 4 },   // wing
      { x: 866, y: 673, c: 4 },   // tail tip
      { x: 117, y: 658, c: 5 },   // sky
      { x: 435, y: 419, c: 6 },   // snout
      { x: 746, y: 918, c: 6 },   // meadow
    ],
    draw(g) {
      g.sun(85, 90, 44, 10);
      ground(g, 770, 16);
      flower(g, 120, 880, 50, 0);
      flower(g, 890, 900, 44, 0);

      // Tail with a spade tip.
      g.shape('M600 770 C700 850 860 860 885 730 L835 725 C825 790 720 790 630 720 Z');
      g.at(862, 690, 0.25, 1, () => g.shape('M0 -62 C32 -30 58 -5 42 22 C28 42 6 28 0 12 C-6 28 -28 42 -42 22 C-58 -5 -32 -30 0 -62 Z'));
      // Bat wings.
      g.mirror(500, () => {
        const wing = g.shape('M432 505 C390 420 280 300 160 240 C125 300 100 360 88 430 Q140 450 175 560 Q250 540 320 612 Q370 585 425 600 Z');
        g.clip(wing, () => {
          g.line('M175 230 L175 560');
          g.line('M175 230 L320 612');
        });
      });
      // Head spikes and horns behind the head.
      g.poly([[452, 232], [478, 168], [505, 228]]);
      g.poly([[495, 228], [522, 162], [548, 232]]);
      g.mirror(500, () => {
        g.shape('M402 250 Q385 180 352 132 Q430 150 455 236 Z');
      });
      // Body, belly, arms, feet.
      g.shape('M500 470 C640 470 690 600 690 700 C690 800 620 845 500 845 C380 845 310 800 310 700 C310 600 360 470 500 470 Z');
      const belly = g.ellipse(500, 690, 108, 130);
      g.clip(belly, () => {
        g.line('M380 640 Q500 665 620 640');
        g.line('M380 730 Q500 755 620 730');
      });
      g.mirror(500, () => {
        g.ellipse(368, 640, 38, 70, 0.5);
        g.ellipse(405, 850, 82, 46);
        g.line('M360 875 L360 852 M400 880 L400 855', g.lw * 0.8);
      });
      // Head.
      g.ellipse(500, 360, 178, 145);
      g.ellipse(500, 425, 102, 62);
      g.dot(470, 410, 9);
      g.dot(530, 410, 9);
      g.line('M450 450 Q500 482 550 450');
      g.dot(432, 318, 28, true);
      g.dot(568, 318, 28, true);
      g.ellipse(370, 395, 26, 16);
      g.ellipse(630, 395, 26, 16);
      g.heart(830, 120, 40);
      g.heart(730, 200, 24);
    },
  });

  /* ---------------------------------------------------------------- Schloss */
  FK.art.add({
    id: 'schloss',
    name: 'Schloss',
    cat: 'fantasie',
    colors: ['rosa', 'blau', 'gelb', 'hellblau', 'hellgruen', 'braun'],
    spots: [
      { x: 562, y: 70, c: 1 },   // flag
      { x: 500, y: 570, c: 1 },   // tower
      { x: 205, y: 682, c: 1 },   // tower
      { x: 793, y: 682, c: 1 },   // tower
      { x: 324, y: 593, c: 1 },   // wall
      { x: 684, y: 593, c: 1 },   // wall
      { x: 498, y: 239, c: 2 },   // roof
      { x: 179, y: 343, c: 2 },   // roof
      { x: 819, y: 343, c: 2 },   // roof
      { x: 94, y: 94, c: 3 },   // sun
      { x: 498, y: 460, c: 3 },   // heart
      { x: 179, y: 561, c: 3 },   // window
      { x: 819, y: 561, c: 3 },   // window
      { x: 319, y: 702, c: 3 },   // window
      { x: 679, y: 702, c: 3 },   // window
      { x: 377, y: 97, c: 4 },   // sky
      { x: 809, y: 894, c: 4 },   // moat
      { x: 196, y: 894, c: 4 },   // moat
      { x: 953, y: 795, c: 5 },   // meadow
      { x: 52, y: 802, c: 5 },   // meadow
      { x: 208, y: 971, c: 5 },   // grass
      { x: 498, y: 745, c: 6 },   // door
      { x: 445, y: 907, c: 6 },   // bridge
      { x: 498, y: 915, c: 6 },   // bridge
      { x: 552, y: 901, c: 6 },   // bridge
    ],
    draw(g) {
      g.sun(95, 95, 46, 10);
      g.cloud(860, 75, 90);
      ground(g, 750, 14);
      // Moat and front meadow.
      g.shape('M-1200 850 Q-600 835 0 850 Q500 862 1000 848 Q1600 835 2200 850 L2200 930 Q1600 915 1000 932 Q500 948 0 930 Q-600 915 -1200 930 Z');
      flower(g, 90, 965, 40, 0);
      flower(g, 910, 965, 40, 0);
      // Walls with battlements.
      const wall = (x0, x1) => {
        let d = 'M' + x0 + ' 830 L' + x0 + ' 500';
        for (let x = x0; x < x1 - 1; x += 100) {
          d += ' L' + (x + 55) + ' 500 L' + (x + 55) + ' 545 L' + Math.min(x + 100, x1) + ' 545 L' + Math.min(x + 100, x1) + ' 500';
        }
        return g.shape(d + ' L' + x1 + ' 830 Z');
      };
      wall(230, 400);
      wall(600, 770);
      // Side towers with pointed roofs and flags.
      g.mirror(500, () => {
        g.line('M180 240 L180 140', g.lw * 0.8);
        g.shape('M180 140 Q215 128 250 142 Q270 150 290 146 L290 200 Q270 206 250 198 Q215 186 180 196 Z');
        g.rect(100, 380, 160, 455, 8);
        g.shape('M80 400 L180 230 L280 400 Z');
        g.shape('M135 570 L135 530 A45 45 0 0 1 225 530 L225 630 L135 630 Z');
        g.shape('M280 720 L280 680 A40 40 0 0 1 360 680 L360 760 L280 760 Z');
        g.line('M120 700 L160 700 M200 760 L240 760 M150 450 L190 450', g.lw * 0.7);
      });
      // Keep.
      g.line('M500 120 L500 40', g.lw * 0.8);
      g.shape('M500 40 Q545 22 590 42 Q620 56 650 46 L650 120 Q620 130 590 116 Q545 96 500 112 Z');
      g.rect(380, 300, 240, 535, 8);
      g.shape('M355 310 L500 115 L645 310 Z');
      g.heart(500, 455, 58);
      g.line('M410 600 L450 600 M550 600 L590 600 M420 380 L460 380 M540 380 L580 380', g.lw * 0.7);
      // Gate and drawbridge.
      g.shape('M435 835 L435 710 A65 65 0 0 1 565 710 L565 835 Z');
      g.shape('M435 835 L565 835 L590 945 L410 945 Z');
      g.line('M478 835 L470 945 M522 835 L530 945', g.lw * 0.8);
    },
  });
})();
