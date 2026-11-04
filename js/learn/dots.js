/* Farbtupf – Punkt zu Punkt: Bilder zum Verbinden.
   w: the name with syllables for reading. points: the dots in order 1…n in the 1000-box. When all are connected the outline is closed,
   detail() draws the inside features and the picture becomes a colouring page (cat 'punkte'). */
(function () {
  'use strict';
  const FK = window.FK;

  // points on a circle, angles in degrees (0 = right, 90 = down)
  function arc(cx, cy, r, angles) {
    return angles.map((a) => [Math.round(cx + Math.cos((a * Math.PI) / 180) * r), Math.round(cy + Math.sin((a * Math.PI) / 180) * r)]);
  }
  function starPts(cx, cy, R, r) {
    const out = [];
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const rr = i % 2 ? r : R;
      out.push([Math.round(cx + Math.cos(a) * rr), Math.round(cy + Math.sin(a) * rr)]);
    }
    return out;
  }
  const ground = (g, y) => g.shape('M-600 ' + y + ' L1600 ' + y + ' L1600 1600 L-600 1600 Z');
  const hill = (g, y) => g.shape('M-600 ' + (y + 40) + ' Q500 ' + (y - 50) + ' 1600 ' + (y + 40) + ' L1600 1600 L-600 1600 Z');

  FK.dots = [
    /* ---------- Stufe 1 ---------- */
    {
      id: 'pp-stern',
      name: 'Stern',
      w: 'Stern',
      level: 1,
      points: starPts(500, 540, 420, 175),
      back(g) {
        g.cloud(160, 150, 100);
        g.cloud(850, 130, 90);
      },
      detail(g) {
        g.dot(440, 520, 22, true);
        g.dot(560, 520, 22, true);
        g.line('M445 590 Q500 640 555 590');
        g.circle(385, 600, 34);
        g.circle(615, 600, 34);
      },
      colors: ['gelb', 'hellblau', 'rosa'],
      spots: [
      { x: 498, y: 416, c: 1 },   // star
      { x: 847, y: 666, c: 2 },   // sky
      { x: 384, y: 599, c: 3 },   // cheek
      { x: 614, y: 599, c: 3 },   // cheek
    ],
    },
    {
      id: 'pp-herz',
      name: 'Herz',
      w: 'Herz',
      level: 1,
      points: [[500, 310], [620, 200], [780, 210], [880, 340], [840, 510], [500, 850], [160, 510], [120, 340], [220, 210], [380, 200]],
      back(g) {
        g.star(140, 130, 55, 24);
        g.star(870, 860, 55, 24);
      },
      detail(g) {
        g.heart(500, 500, 150);
      },
      colors: ['rot', 'rosa', 'hellblau'],
      spots: [
      { x: 245, y: 377, c: 1 },   // heart
      { x: 498, y: 517, c: 2 },   // inner heart
      { x: 184, y: 818, c: 3 },   // sky
    ],
    },
    {
      id: 'pp-haus',
      name: 'Haus',
      w: 'Haus',
      level: 1,
      points: [[500, 140], [880, 470], [770, 470], [770, 860], [230, 860], [230, 470], [120, 470]],
      back(g) {
        g.sun(140, 140, 60);
        ground(g, 860);
      },
      detail(g) {
        g.line('M230 470 L770 470');
        g.circle(500, 350, 55);
        g.line('M445 350 L555 350', g.lw * 0.8);
        g.rect(290, 540, 120, 110, 10);
        g.rect(590, 540, 120, 110, 10);
        g.rect(440, 680, 120, 180, 40);
        g.dot(530, 780, 10);
      },
      colors: ['rot', 'gelb', 'braun', 'hellblau', 'gruen'],
      spots: [
      { x: 363, y: 381, c: 1 },   // roof
      { x: 140, y: 140, c: 2 },   // sun
      { x: 664, y: 754, c: 2 },   // wall
      { x: 494, y: 734, c: 3 },   // door
      { x: 828, y: 173, c: 4 },   // sky
      { x: 498, y: 324, c: 4 },   // round window
      { x: 498, y: 375, c: 4 },   // round window
      { x: 350, y: 594, c: 4 },   // window
      { x: 649, y: 594, c: 4 },   // window
      { x: 498, y: 935, c: 5 },   // meadow
    ],
    },
    {
      id: 'pp-pilz',
      name: 'Pilz',
      w: 'Pilz',
      level: 1,
      points: [[500, 140], [770, 240], [880, 470], [610, 480], [630, 840], [370, 840], [390, 480], [120, 470], [230, 240]],
      back(g) {
        hill(g, 830);
        g.grass(160, 900, 22);
        g.grass(840, 900, 22);
      },
      detail(g) {
        g.line('M390 480 L610 480');
        g.circle(370, 290, 50);
        g.circle(590, 260, 56);
        g.circle(730, 390, 42);
        g.circle(260, 400, 40);
        g.circle(480, 400, 36);
        g.dot(460, 620, 16, true);
        g.dot(540, 620, 16, true);
        g.line('M465 690 Q500 720 535 690');
      },
      colors: ['rot', 'pfirsich', 'gruen', 'hellblau'],
      spots: [
      { x: 597, y: 397, c: 1 },   // cap
      { x: 550, y: 764, c: 2 },   // stem
      { x: 325, y: 916, c: 3 },   // meadow
      { x: 804, y: 650, c: 4 },   // sky
    ],
    },
    {
      id: 'pp-krone',
      name: 'Krone',
      w: 'Kro-ne',
      level: 1,
      points: [[130, 800], [130, 330], [320, 530], [500, 190], [680, 530], [870, 330], [870, 800]],
      detail(g) {
        g.line('M130 670 L870 670');
        g.circle(310, 735, 38);
        g.circle(500, 735, 44);
        g.circle(690, 735, 38);
        g.circle(500, 450, 50);
      },
      colors: ['gelb', 'rot', 'blau', 'violett'],
      spots: [
      { x: 585, y: 571, c: 1 },   // crown
      { x: 793, y: 734, c: 1 },   // band
      { x: 309, y: 734, c: 2 },   // jewel
      { x: 688, y: 734, c: 2 },   // jewel
      { x: 498, y: 450, c: 3 },   // jewel
      { x: 498, y: 734, c: 3 },   // jewel
      { x: 278, y: 187, c: 4 },   // background
    ],
    },
    {
      id: 'pp-tulpe',
      name: 'Tulpe',
      w: 'Tul-pe',
      level: 1,
      points: [[290, 160], [400, 290], [500, 140], [600, 290], [710, 160], [740, 420], [500, 600], [260, 420]],
      back(g) {
        g.sun(860, 130, 55);
        ground(g, 900);
      },
      detail(g) {
        g.rect(478, 600, 44, 300, 10);
        g.shape('M478 830 Q330 790 280 650 Q420 670 478 770 Z');
        g.shape('M522 790 Q670 760 720 620 Q580 640 522 730 Z');
        g.line('M400 290 Q420 450 500 600', g.lw * 0.8);
        g.line('M600 290 Q580 450 500 600', g.lw * 0.8);
      },
      colors: ['rot', 'gruen', 'hellblau', 'gelb', 'braun'],
      spots: [
      { x: 498, y: 322, c: 1 },   // petal
      { x: 340, y: 378, c: 1 },   // petal
      { x: 658, y: 378, c: 1 },   // petal
      { x: 608, y: 704, c: 2 },   // leaf
      { x: 389, y: 737, c: 2 },   // leaf
      { x: 845, y: 733, c: 3 },   // sky
      { x: 859, y: 129, c: 4 },   // sun
      { x: 498, y: 954, c: 5 },   // soil
    ],
    },

    /* ---------- Stufe 2 ---------- */
    {
      id: 'pp-fisch',
      name: 'Fisch',
      w: 'Fisch',
      level: 2,
      points: [[120, 500], [270, 330], [480, 280], [660, 340], [780, 450], [910, 300], [880, 500], [910, 700], [780, 550], [660, 660], [480, 720], [270, 670]],
      back(g) {
        g.circle(190, 210, 34);
        g.circle(250, 130, 24);
        g.line('M80 880 Q160 840 240 880 Q320 920 400 880', g.lw * 0.8);
        g.line('M600 900 Q680 860 760 900 Q840 940 920 900', g.lw * 0.8);
      },
      detail(g) {
        g.line('M360 360 Q420 500 360 640');
        g.line('M780 450 L780 550');
        g.circle(250, 450, 40);
        g.dot(258, 452, 18, true);
        g.line('M150 540 Q190 560 230 545', g.lw * 0.8);
        g.line('M500 330 Q560 500 500 690', g.lw * 0.8);
        g.line('M620 360 Q670 500 620 650', g.lw * 0.8);
      },
      colors: ['orange', 'gelb', 'hellblau'],
      spots: [
      { x: 301, y: 568, c: 1 },   // body
      { x: 831, y: 474, c: 2 },   // tail
      { x: 748, y: 181, c: 3 },   // water
    ],
    },
    {
      id: 'pp-tanne',
      name: 'Tanne',
      w: 'Tan-ne',
      level: 2,
      points: [[500, 80], [690, 330], [600, 330], [770, 545], [670, 545], [860, 770], [570, 770], [570, 910], [430, 910], [430, 770], [140, 770], [330, 545], [230, 545], [400, 330], [310, 330]],
      back(g) {
        g.shape('M-600 900 Q500 860 1600 900 L1600 1600 L-600 1600 Z');
        g.star(130, 150, 40, 17);
        g.star(880, 210, 34, 15);
      },
      detail(g) {
        g.line('M430 770 L570 770');
        g.star(500, 120, 85, 36);
        g.circle(450, 440, 34);
        g.circle(600, 640, 36);
        g.circle(380, 690, 34);
        g.circle(530, 300, 30);
      },
      colors: ['gruen', 'braun', 'gelb', 'rot', 'hellblau'],
      spots: [
      { x: 574, y: 500, c: 1 },   // tree
      { x: 498, y: 839, c: 2 },   // trunk
      { x: 498, y: 120, c: 3 },   // star
      { x: 529, y: 299, c: 4 },   // ball
      { x: 450, y: 439, c: 4 },   // ball
      { x: 599, y: 640, c: 4 },   // ball
      { x: 380, y: 690, c: 4 },   // ball
      { x: 157, y: 360, c: 5 },   // sky
    ],
    },
    {
      id: 'pp-rakete',
      name: 'Rakete',
      w: 'Ra-ke-te',
      level: 2,
      points: [[500, 70], [600, 190], [630, 350], [630, 590], [760, 720], [760, 850], [630, 780], [370, 780], [240, 850], [240, 720], [370, 590], [370, 350], [400, 190]],
      back(g) {
        g.star(140, 180, 55, 24);
        g.star(860, 300, 45, 20);
        g.star(150, 560, 35, 15);
        g.circle(850, 600, 70);
      },
      detail(g) {
        g.line('M400 190 Q500 230 600 190');
        g.circle(500, 400, 80);
        g.circle(500, 400, 50);
        g.line('M630 590 L630 780');
        g.line('M370 590 L370 780');
        g.shape('M400 780 Q420 900 500 970 Q580 900 600 780 Z');
        g.shape('M450 780 Q460 860 500 900 Q540 860 550 780 Z');
      },
      colors: ['rot', 'hellblau', 'orange', 'gelb', 'blau'],
      spots: [
      { x: 498, y: 157, c: 1 },   // nose
      { x: 309, y: 742, c: 1 },   // fin
      { x: 690, y: 742, c: 1 },   // fin
      { x: 498, y: 400, c: 2 },   // window
      { x: 498, y: 927, c: 3 },   // flame
      { x: 850, y: 599, c: 4 },   // planet
      { x: 498, y: 821, c: 4 },   // flame
      { x: 205, y: 378, c: 5 },   // space
    ],
    },
    {
      id: 'pp-katze',
      name: 'Katze',
      w: 'Kat-ze',
      level: 2,
      points: [[250, 130], [390, 285], [610, 285], [750, 130], [790, 400], [800, 570], [720, 730], [500, 810], [280, 730], [200, 570], [210, 400]],
      detail(g) {
        g.poly([[275, 215], [355, 300], [285, 350]]);
        g.poly([[725, 215], [645, 300], [715, 350]]);
        g.ellipse(395, 480, 46, 56);
        g.ellipse(605, 480, 46, 56);
        g.dot(400, 488, 24, true);
        g.dot(610, 488, 24, true);
        g.poly([[465, 585], [535, 585], [500, 625]]);
        g.line('M500 625 L500 660 M500 660 Q470 700 435 670 M500 660 Q530 700 565 670');
        g.line('M360 610 L120 580 M360 640 L130 680', g.lw * 0.8);
        g.line('M640 610 L880 580 M640 640 L870 680', g.lw * 0.8);
      },
      colors: ['orange', 'rosa', 'hellblau'],
      spots: [
      { x: 498, y: 375, c: 1 },   // head
      { x: 309, y: 293, c: 2 },   // ear
      { x: 690, y: 293, c: 2 },   // ear
      { x: 845, y: 845, c: 3 },   // background
    ],
    },
    {
      id: 'pp-schmetterling',
      name: 'Schmetterling',
      w: 'Schmet-ter-ling',
      level: 2,
      points: [[820, 170], [880, 300], [770, 450], [870, 590], [810, 770], [650, 770], [540, 640], [460, 640], [350, 770], [190, 770], [130, 590], [230, 450], [120, 300], [180, 170], [330, 150], [465, 290], [535, 290], [670, 150]],
      back(g) {
        g.flower(130, 890, 45);
        g.flower(870, 900, 40);
      },
      detail(g) {
        g.line('M500 450 L770 450');
        g.line('M500 450 L230 450');
        g.circle(690, 320, 60);
        g.circle(310, 320, 60);
        g.circle(700, 640, 48);
        g.circle(300, 640, 48);
        g.ellipse(500, 480, 46, 210);
        g.circle(500, 250, 56);
        g.line('M480 200 Q450 120 400 90');
        g.line('M520 200 Q550 120 600 90');
        g.dot(400, 90, 16);
        g.dot(600, 90, 16);
        g.dot(480, 245, 9);
        g.dot(520, 245, 9);
      },
      colors: ['violett', 'pink', 'gelb', 'braun', 'hellblau'],
      spots: [
      { x: 222, y: 228, c: 1 },   // wing
      { x: 777, y: 228, c: 1 },   // wing
      { x: 369, y: 530, c: 2 },   // wing
      { x: 629, y: 530, c: 2 },   // wing
      { x: 309, y: 319, c: 3 },   // dot
      { x: 690, y: 319, c: 3 },   // dot
      { x: 299, y: 640, c: 3 },   // dot
      { x: 699, y: 640, c: 3 },   // dot
      { x: 498, y: 274, c: 4 },   // head
      { x: 498, y: 486, c: 4 },   // body
      { x: 500, y: 850, c: 5 },   // sky
    ],
    },

    /* ---------- Stufe 3 ---------- */
    {
      id: 'pp-dino',
      name: 'Dino',
      w: 'Di-no',
      level: 3,
      points: [[760, 110], [850, 120], [910, 170], [890, 230], [800, 250], [760, 330], [740, 450], [770, 560], [780, 820], [690, 820], [680, 660],
        [540, 690], [450, 680], [440, 820], [350, 820], [330, 650], [230, 620], [120, 660], [50, 610], [180, 520], [300, 440], [440, 400], [570, 410], [650, 330], [690, 200]],
      back(g) {
        g.sun(140, 140, 55);
        g.cloud(540, 170, 85);
        ground(g, 820);
      },
      detail(g) {
        g.dot(820, 165, 15, true);
        g.line('M850 215 Q875 225 895 205', g.lw * 0.8);
        g.circle(450, 520, 46);
        g.circle(580, 500, 38);
        g.circle(330, 540, 30);
        g.line('M690 820 L700 790 M735 820 L735 790', g.lw * 0.8);
        g.line('M350 820 L360 790 M395 820 L395 790', g.lw * 0.8);
      },
      colors: ['gruen', 'gelb', 'hellblau', 'braun', 'orange'],
      spots: [
      { x: 682, y: 573, c: 1 },   // body
      { x: 140, y: 140, c: 2 },   // sun
      { x: 337, y: 280, c: 3 },   // sky
      { x: 602, y: 748, c: 3 },   // sky
      { x: 498, y: 913, c: 4 },   // ground
      { x: 579, y: 500, c: 5 },   // spot
      { x: 450, y: 520, c: 5 },   // spot
      { x: 330, y: 540, c: 5 },   // spot
    ],
    },
    {
      id: 'pp-auto',
      name: 'Auto',
      w: 'Au-to',
      level: 3,
      points: [[100, 640], [110, 540], [250, 500], [340, 330], [500, 315], [650, 330], [760, 500], [900, 530], [920, 640], [890, 700], [820, 700], [800, 630],
        [730, 595], [660, 630], [640, 700], [500, 700], [360, 700], [340, 630], [270, 595], [200, 630], [180, 700]],
      back(g) {
        g.cloud(170, 150, 100);
        g.sun(850, 140, 55);
        ground(g, 780);
      },
      detail(g) {
        g.shape('M300 500 L370 370 L480 360 L480 500 Z');
        g.shape('M520 500 L520 360 L630 370 L700 500 Z');
        g.line('M500 360 L500 700');
        g.rect(560, 540, 50, 18, 9);
        g.ellipse(895, 585, 18, 30);
        g.circle(730, 700, 82);
        g.circle(730, 700, 36);
        g.circle(270, 700, 82);
        g.circle(270, 700, 36);
      },
      colors: ['rot', 'hellblau', 'grau', 'gelb', 'gruen'],
      spots: [
      { x: 412, y: 587, c: 1 },   // car
      { x: 576, y: 158, c: 2 },   // sky
      { x: 412, y: 432, c: 2 },   // window
      { x: 587, y: 432, c: 2 },   // window
      { x: 269, y: 699, c: 3 },   // hub
      { x: 729, y: 699, c: 3 },   // hub
      { x: 850, y: 140, c: 4 },   // sun
      { x: 498, y: 894, c: 5 },   // meadow
    ],
    },
    {
      id: 'pp-schneemann',
      name: 'Schneemann',
      w: 'Schnee-mann',
      level: 3,
      points: [].concat(
        arc(500, 250, 115, [-90, -50, -10, 30]),
        arc(500, 500, 165, [-45, -10, 25]),
        arc(500, 770, 200, [-30, 0, 30, 60, 90, 120, 150, 180, 210]),
        arc(500, 500, 165, [155, 190, 225]),
        arc(500, 250, 115, [150, 190, 230])
      ),
      back(g) {
        g.shape('M-600 900 Q500 840 1600 900 L1600 1600 L-600 1600 Z');
        [[130, 180, 34], [860, 150, 30], [170, 520, 28], [850, 480, 34]].forEach((f) => {
          const [x, y, r] = f;
          g.line('M' + (x - r) + ' ' + y + ' L' + (x + r) + ' ' + y + ' M' + (x - r / 2) + ' ' + (y - r * 0.87) + ' L' + (x + r / 2) + ' ' + (y + r * 0.87) + ' M' + (x - r / 2) + ' ' + (y + r * 0.87) + ' L' + (x + r / 2) + ' ' + (y - r * 0.87), g.lw * 0.7);
        });
      },
      detail(g) {
        g.rect(410, 90, 180, 60, 8);
        g.rect(370, 140, 260, 34, 14);
        g.dot(455, 230, 15, true);
        g.dot(545, 230, 15, true);
        g.shape('M500 262 L600 285 L500 300 Z');
        g.line('M455 320 Q500 345 545 320', g.lw * 0.8);
        g.shape('M360 380 Q500 420 640 380 L650 420 Q500 465 350 420 Z');
        g.shape('M560 430 L620 560 L560 570 L520 445 Z');
        g.circle(500, 520, 20);
        g.circle(500, 600, 20);
        g.circle(500, 740, 22);
        g.line('M338 600 Q500 652 662 600');
        g.line('M345 470 L220 380 M262 410 L240 360');
        g.line('M655 470 L780 380 M738 410 L760 360');
      },
      colors: ['hellblau', 'schwarz', 'rot'],
      spots: [
      { x: 840, y: 672, c: 1 },   // sky
      { x: 498, y: 114, c: 2 },   // hat
      { x: 576, y: 532, c: 3 },   // scarf
    ],
    },
  ];

  FK.dots.forEach((d) => FK.art.add(FK.art.fromDots(d)));
})();
