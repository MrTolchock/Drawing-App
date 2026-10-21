/* Farbklecks – Ausmalbilder: Fantasie (Teil 2). Drawn with the helper documented in js/art/dsl.js. */
(function () {
  'use strict';
  const FK = window.FK;
  const TAU = Math.PI * 2;

  // A fluffy outline around an ellipse: n soft bumps (fur, clouds of hair).
  function fluffy(cx, cy, rx, ry, n, bump) {
    let d = '';
    for (let i = 0; i <= n; i++) {
      const a = (i / n) * TAU - Math.PI / 2;
      const x = cx + Math.cos(a) * rx;
      const y = cy + Math.sin(a) * ry;
      if (!i) {
        d += 'M' + x.toFixed(1) + ' ' + y.toFixed(1);
        continue;
      }
      const m = ((i - 0.5) / n) * TAU - Math.PI / 2;
      const k = 1 + bump * 2;
      d += ' Q' + (cx + Math.cos(m) * rx * k).toFixed(1) + ' ' + (cy + Math.sin(m) * ry * k).toFixed(1) + ' ' + x.toFixed(1) + ' ' + y.toFixed(1);
    }
    return d + ' Z';
  }

  // A round robot claw (a circle with a little wedge cut out), the opening facing `dir`.
  function claw(g, x, y, r, dir) {
    const p = new Path2D();
    p.moveTo(x + Math.cos(dir) * r * 0.2, y + Math.sin(dir) * r * 0.2);
    p.arc(x, y, r, dir + 0.5, dir + TAU - 0.5);
    p.closePath();
    return g.draw(p);
  }

  /* ---------- Roboter ---------- */
  FK.art.add({
    id: 'roboter',
    name: 'Roboter',
    cat: 'fantasie',
    colors: ['grau', 'blau', 'hellblau', 'rot', 'gelb', 'hellgruen'],
    spots: [
      { x: 500, y: 318, c: 1 },
      { x: 150, y: 580, c: 1 },
      { x: 850, y: 580, c: 1 },
      { x: 150, y: 430, c: 1 },
      { x: 396, y: 818, c: 1 },
      { x: 604, y: 818, c: 1 },
      { x: 290, y: 600, c: 2 },
      { x: 395, y: 896, c: 2 },
      { x: 605, y: 896, c: 2 },
      { x: 396, y: 600, c: 3 },
      { x: 500, y: 593, c: 4 },
      { x: 500, y: 105, c: 4 },
      { x: 860, y: 130, c: 5 },
      { x: 840, y: 352, c: 5 },
      { x: 780, y: 950, c: 6 },
    ],
    draw(g) {
      g.sun(860, 130, 60, 10);
      g.cloud(300, 95, 95);
      g.shape('M-1200 875 Q-400 845 200 865 Q600 882 1000 858 Q1500 838 2200 868 L2200 1400 L-1200 1400 Z');
      g.grass(70, 965, 16);
      g.grass(930, 960, 16);
      // a flower in the left claw
      g.line('M150 405 Q138 330 150 262');
      g.ellipse(182, 335, 40, 19, -0.6);
      g.flower(150, 225, 38);
      // antenna
      g.line('M500 210 L500 145');
      g.circle(500, 105, 44);
      // ears, neck, legs
      g.rect(262, 285, 76, 112, 26);
      g.rect(662, 285, 76, 112, 26);
      g.rect(452, 430, 96, 80, 12);
      g.rect(350, 760, 92, 120, 14);
      g.rect(558, 760, 92, 120, 14);
      // both arms up, claws open
      g.mirror(500, () => {
        g.shape('M262 538 L212 538 Q192 538 192 518 L192 440 L108 440 L108 590 Q108 622 140 622 L262 622 Z');
        claw(g, 150, 415, 56, -Math.PI / 2);
      });
      // body
      g.rect(235, 495, 530, 285, 50);
      g.rect(345, 525, 310, 150, 30);
      g.heart(500, 600, 48);
      g.circle(400, 727, 26);
      g.circle(500, 727, 26);
      g.circle(600, 727, 26);
      // feet
      g.rect(315, 855, 160, 82, 40);
      g.rect(525, 855, 160, 82, 40);
      // head
      g.rect(310, 205, 380, 248, 60);
      g.circle(405, 312, 47);
      g.circle(595, 312, 47);
      g.dot(412, 319, 23, true);
      g.dot(602, 319, 23, true);
      g.line('M440 392 Q500 437 560 392');
      g.ellipse(366, 392, 26, 16);
      g.ellipse(634, 392, 26, 16);
      // a little bird sits in the right claw
      g.poly([[805, 340], [770, 318], [778, 362]]);
      g.ellipse(845, 352, 50, 38);
      g.circle(885, 312, 28);
      g.poly([[908, 304], [940, 314], [908, 324]]);
      g.dot(890, 306, 7, true);
      g.line('M822 345 Q845 372 868 345', g.lw * 0.8);
    },
  });

  /* ---------- Monster ---------- */
  // An arm from the shoulder (0,0) along +x with a round three-finger hand at the end.
  function monsterArm(g, len) {
    g.rect(-30, -40, len + 30, 80, 40);
    g.blob([[len, 0, 42], [len + 34, -30, 18], [len + 44, 4, 18], [len + 30, 36, 18]]);
  }

  FK.art.add({
    id: 'monster',
    name: 'Monster',
    cat: 'fantasie',
    colors: ['violett', 'rosa', 'gelb', 'hellgruen', 'rot'],
    spots: [
      { x: 500, y: 255, c: 1 },
      { x: 385, y: 852, c: 1 },
      { x: 615, y: 852, c: 1 },
      { x: 500, y: 728, c: 2 },
      { x: 285, y: 615, c: 2 },
      { x: 715, y: 615, c: 2 },
      { x: 376, y: 240, c: 3 },
      { x: 624, y: 240, c: 3 },
      { x: 858, y: 150, c: 5 },
      { x: 440, y: 528, c: 5 },
      { x: 780, y: 945, c: 4 },
    ],
    draw(g) {
      g.cloud(170, 130, 120);
      g.shape('M-1200 860 Q-400 830 200 850 Q600 872 1000 845 Q1500 825 2200 855 L2200 1400 L-1200 1400 Z');
      g.grass(60, 960, 15);
      g.grass(940, 965, 15);
      // flowers
      g.line('M95 905 L95 800');
      g.flower(95, 775, 32);
      g.line('M915 905 L915 815');
      g.flower(915, 790, 30);
      // balloon
      g.line('M858 250 Q900 320 872 385', g.lw * 0.8);
      g.poly([[858, 236], [838, 262], [878, 262]]);
      g.ellipse(858, 150, 76, 92);
      // arms behind the body
      g.at(262, 500, -2.4, 1, () => monsterArm(g, 150));
      g.at(738, 500, -0.74, 1, () => monsterArm(g, 150));
      // body
      const body = g.shape(fluffy(500, 520, 290, 320, 26, 0.04));
      g.clip(body, () => {
        g.circle(285, 615, 44);
        g.circle(715, 615, 44);
        g.circle(330, 735, 22);
        g.circle(672, 740, 20);
        g.circle(255, 520, 18);
        g.circle(748, 515, 16);
      });
      // horns
      g.at(385, 262, -0.35, 1, () => g.shape('M-46 22 Q-40 -60 -12 -118 Q2 -138 16 -118 Q40 -60 46 22 Q0 38 -46 22 Z'));
      g.at(615, 262, 0.35, 1, () => g.shape('M-46 22 Q-40 -60 -12 -118 Q2 -138 16 -118 Q40 -60 46 22 Q0 38 -46 22 Z'));
      // belly
      g.ellipse(500, 728, 135, 72);
      // eyes and cheeks
      g.circle(420, 365, 56);
      g.circle(580, 365, 56);
      g.dot(428, 374, 27, true);
      g.dot(588, 374, 27, true);
      g.ellipse(338, 452, 24, 14);
      g.ellipse(662, 452, 24, 14);
      // mouth with one tooth and a tongue
      const mouth = g.shape('M385 458 Q500 488 615 458 Q607 612 500 617 Q393 612 385 458 Z');
      g.clip(mouth, () => {
        g.ellipse(500, 630, 88, 50);
        g.rect(516, 440, 50, 90, 16);
      });
      g.draw(mouth, false);
      // feet
      g.ellipse(385, 862, 100, 50);
      g.ellipse(615, 862, 100, 50);
      g.line('M345 909 L350 886 M425 909 L420 886 M575 909 L580 886 M655 909 L650 886', g.lw * 0.8);
    },
  });

  /* ---------- Pilzhaus ---------- */
  FK.art.add({
    id: 'pilzhaus',
    name: 'Pilzhaus',
    cat: 'fantasie',
    colors: ['rot', 'pfirsich', 'braun', 'gelb', 'hellgruen', 'grau'],
    spots: [
      { x: 500, y: 430, c: 1 },
      { x: 380, y: 760, c: 2 },
      { x: 500, y: 770, c: 3 },
      { x: 400, y: 640, c: 4 },
      { x: 600, y: 640, c: 4 },
      { x: 120, y: 120, c: 4 },
      { x: 180, y: 940, c: 5 },
      { x: 455, y: 960, c: 6 },
    ],
    draw(g) {
      g.sun(120, 120, 58, 10);
      g.line('M260 160 Q285 135 310 160 Q335 135 360 160');
      // chimney with smoke
      g.blob([[705, 78, 24], [742, 52, 30], [790, 40, 26]]);
      g.rect(640, 150, 66, 120, 10);
      g.rect(626, 128, 94, 40, 14);
      // meadow
      g.shape('M-1200 800 Q-400 770 150 790 Q500 810 850 780 Q1500 760 2200 800 L2200 1400 L-1200 1400 Z');
      // path to the door
      g.shape('M450 825 C440 880 390 930 350 1000 L300 1400 L640 1400 L590 1000 C570 930 560 880 550 825 Z');
      // house (the mushroom stem)
      g.shape('M330 830 C300 720 330 600 350 540 L650 540 C670 600 700 720 670 830 Z');
      g.shape('M445 830 L445 720 A55 55 0 0 1 555 720 L555 830 Z');
      g.dot(535, 778, 10);
      g.circle(400, 640, 44);
      g.circle(600, 640, 44);
      // the cap
      const cap = g.shape('M130 530 C120 330 300 200 500 200 C700 200 880 330 870 530 C760 575 240 575 130 530 Z');
      g.clip(cap, () => {
        g.ellipse(290, 420, 48, 40);
        g.ellipse(500, 290, 58, 46);
        g.ellipse(710, 420, 48, 40);
        g.ellipse(170, 520, 36, 30);
        g.ellipse(830, 520, 36, 30);
      });
      // little mushroom
      g.rect(800, 780, 46, 80, 16);
      g.shape('M745 795 Q745 705 823 705 Q901 705 901 795 Q823 815 745 795 Z');
      g.circle(823, 750, 18);
      // flowers
      g.line('M150 880 L150 820 M245 910 L245 860');
      g.flower(150, 805, 26);
      g.flower(245, 850, 22);
      g.grass(700, 950, 15);
      g.grass(90, 975, 15);
    },
  });

  /* ---------- UFO ---------- */
  FK.art.add({
    id: 'ufo',
    name: 'UFO',
    cat: 'fantasie',
    colors: ['hellgruen', 'grau', 'hellblau', 'gelb', 'orange', 'blau'],
    spots: [
      { x: 500, y: 445, c: 1 },
      { x: 430, y: 545, c: 2 },
      { x: 380, y: 330, c: 3 },
      { x: 500, y: 800, c: 4 },
      { x: 500, y: 692, c: 5 },
      { x: 500, y: 160, c: 6 },
      { x: 820, y: 950, c: 2 },
    ],
    draw(g) {
      // stars
      [[880, 110, 46], [640, 100, 38], [95, 420, 42], [905, 440, 40], [330, 140, 34], [120, 690, 40], [880, 700, 40]].forEach((s) =>
        g.star(s[0], s[1], s[2], s[2] * 0.48));
      // ringed planet
      g.at(180, 175, -0.35, 1, () => {
        g.circle(0, 0, 76);
        g.ellipse(0, 0, 148, 32);
      });
      // small planet with craters
      g.circle(800, 285, 62);
      g.circle(780, 265, 18);
      g.circle(822, 310, 14);
      // light beam
      g.poly([[420, 720], [580, 720], [720, 900], [280, 900]]);
      // moon ground with craters
      g.shape('M-1200 860 Q-400 830 200 850 Q500 875 800 845 Q1400 815 2200 855 L2200 1400 L-1200 1400 Z');
      g.ellipse(150, 935, 70, 26);
      g.ellipse(840, 950, 64, 24);
      g.ellipse(520, 975, 50, 20);
      // saucer: bottom, dome with the alien, disc, lights
      g.shape('M320 625 L680 625 L615 730 Q500 750 385 730 Z');
      g.shape('M280 545 C280 190 720 190 720 545 Z');
      g.line('M468 378 Q452 352 452 340', g.lw * 0.8);
      g.line('M532 378 Q548 352 548 340', g.lw * 0.8);
      g.circle(448, 330, 18);
      g.circle(552, 330, 18);
      g.ellipse(500, 548, 78, 60);
      g.ellipse(500, 445, 88, 72);
      g.dot(466, 440, 21, true);
      g.dot(534, 440, 21, true);
      g.line('M472 485 Q500 505 528 485', g.lw * 0.8);
      g.ellipse(436, 474, 15, 9);
      g.ellipse(564, 474, 15, 9);
      g.shape('M110 580 C110 480 890 480 890 580 C890 680 110 680 110 580 Z');
      [230, 365, 500, 635, 770].forEach((x) => g.circle(x, 600, 24));
    },
  });

  /* ---------- Meerjungfrau ---------- */
  FK.art.add({
    id: 'meerjungfrau',
    name: 'Meerjungfrau',
    cat: 'fantasie',
    colors: ['pfirsich', 'orange', 'gruen', 'grau', 'gelb', 'hellblau'],
    spots: [
      { x: 455, y: 330, c: 1 },
      { x: 330, y: 400, c: 2 },
      { x: 620, y: 640, c: 3 },
      { x: 330, y: 780, c: 4 },
      { x: 500, y: 950, c: 5 },
      { x: 640, y: 420, c: 6 },
    ],
    draw(g) {
      // sand
      g.shape('M-1200 880 Q-500 850 100 870 Q500 895 900 860 Q1500 835 2200 870 L2200 1400 L-1200 1400 Z');
      // seaweed
      g.shape('M70 885 C40 790 120 730 82 630 C52 550 100 510 112 460 C155 525 122 585 142 645 C172 745 102 795 132 885 Z');
      g.shape('M175 885 C160 820 215 790 190 720 C175 680 200 650 215 625 C245 670 225 710 240 750 C258 805 222 840 232 885 Z');
      g.shape('M880 885 C850 800 925 750 892 660 C866 590 905 555 918 515 C958 575 930 625 948 680 C975 765 912 810 940 885 Z');
      // rock
      g.shape('M230 905 C195 800 250 690 350 655 C450 620 600 630 670 675 C760 730 800 830 770 905 Z');
      // fin (behind the tail tip)
      g.shape('M770 600 C800 540 840 480 900 455 C905 520 880 570 840 600 C890 600 930 630 950 680 C890 690 820 670 780 640 Z');
      // hair behind the head
      g.shape('M455 225 C360 225 330 300 345 380 C355 450 315 500 330 560 C360 560 395 545 410 520 C430 480 430 430 470 410 L540 400 C560 340 540 230 455 225 Z');
      // torso and arms
      g.at(395, 455, 1.75, 1, () => g.rect(-10, -26, 170, 52, 26));
      g.ellipse(352, 625, 34, 26);
      g.shape('M400 430 C380 470 395 520 410 580 L520 580 C530 520 540 470 515 430 Z');
      g.at(512, 455, -0.8, 1, () => g.rect(-10, -26, 140, 52, 26));
      g.circle(612, 360, 32);
      // shell top
      g.shape('M415 480 Q440 455 465 480 Q440 505 415 480 Z');
      g.shape('M455 480 Q480 455 505 480 Q480 505 455 480 Z');
      // tail
      g.shape('M405 560 C400 600 400 650 430 690 C520 720 660 690 790 650 L775 595 C690 610 600 600 525 560 Z');
      g.line('M410 600 Q465 625 525 590', g.lw * 0.8);
      // head
      g.circle(458, 330, 80);
      g.shape('M380 320 C380 260 420 236 462 236 C510 236 540 270 538 320 C510 290 480 286 462 300 C440 286 400 290 380 320 Z');
      g.dot(430, 345, 14, true);
      g.dot(490, 345, 14, true);
      g.line('M440 378 Q460 395 480 378', g.lw * 0.8);
      g.ellipse(410, 372, 16, 10);
      g.ellipse(510, 372, 16, 10);
      g.star(415, 255, 26, 12);
      // fish
      g.shape('M860 260 L930 215 Q915 260 930 305 Z');
      const fish = g.ellipse(790, 260, 85, 55);
      g.clip(fish, () => g.line('M800 200 Q780 260 800 320'));
      g.dot(745, 250, 10, true);
      g.shape('M215 160 L160 125 Q170 160 160 195 Z');
      g.ellipse(260, 160, 55, 38);
      g.dot(287, 154, 8, true);
      // bubbles
      g.circle(690, 205, 22);
      g.circle(660, 140, 16);
      g.circle(690, 80, 26);
      g.circle(330, 110, 18);
      g.circle(370, 60, 24);
      // starfish and shell on the sand
      g.star(150, 935, 56, 26, 5);
      g.shape('M820 960 Q850 900 880 960 Z');
      g.circle(150, 935, 12);
    },
  });
})();
