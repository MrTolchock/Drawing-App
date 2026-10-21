/* Farbklecks – Ausmalbilder: Natur. Drawn with the helper documented in js/art/dsl.js. */
(function () {
  'use strict';
  const FK = window.FK;
  const TAU = Math.PI * 2;

  FK.art.add({
    id: 'haus',
    name: 'Haus',
    cat: 'natur',
    colors: [],
    spots: [],
    draw(g) {
      g.circle(870, 135, 75);
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * TAU;
        g.line('M' + (870 + Math.cos(a) * 100) + ' ' + (135 + Math.sin(a) * 100) + ' L' + (870 + Math.cos(a) * 140) + ' ' + (135 + Math.sin(a) * 140));
      }
      g.blob([[150, 140, 50], [215, 110, 65], [290, 135, 52], [220, 165, 50]]);
      g.shape('M-1200 720 Q-300 650 300 690 Q700 720 1100 680 Q1600 640 2200 700 L2200 1400 L-1200 1400 Z');
      g.rect(765, 470, 50, 260);
      g.blob([[790, 400, 85], [720, 460, 70], [860, 460, 70], [790, 490, 70]]);
      g.ellipse(745, 430, 22, 22);
      g.ellipse(835, 395, 22, 22);
      g.ellipse(805, 485, 22, 22);
      g.rect(480, 210, 60, 130);
      g.blob([[525, 165, 30], [560, 125, 38], [610, 100, 30]]);
      g.rect(150, 420, 400, 330);
      g.poly([[110, 440], [350, 205], [590, 440]]);
      g.circle(350, 345, 42);
      g.line('M308 345 L392 345 M350 303 L350 387', g.lw * 0.8);
      g.shape('M300 750 L300 615 A50 50 0 0 1 400 615 L400 750 Z');
      g.dot(382, 680, 10);
      g.rect(185, 490, 82, 82, 6);
      g.rect(433, 490, 82, 82, 6);
      g.line('M226 490 L226 572 M185 531 L267 531 M474 490 L474 572 M433 531 L515 531', g.lw * 0.8);
      g.shape('M305 750 Q280 850 220 1000 L480 1000 Q420 850 395 750 Z');
      g.line('M640 780 L640 860 M690 790 L690 870 M60 790 L60 880 M960 780 L960 860', g.lw * 0.8);
      g.flower(640, 770, 22);
      g.flower(690, 780, 22);
      g.flower(60, 780, 22);
      g.flower(960, 770, 22);
      g.grass(560, 940, 14);
      g.grass(120, 930, 14);
      g.grass(850, 950, 14);
    },
  });

  FK.art.add({
    id: 'blume',
    name: 'Blume',
    cat: 'natur',
    colors: [],
    spots: [],
    draw(g) {
      g.shape('M495 790 C480 650 520 560 492 470 L512 470 C542 560 505 650 520 790 Z');
      g.shape('M505 690 C560 600 680 600 720 640 C660 700 570 720 505 700 Z');
      g.shape('M500 640 C440 560 320 560 285 600 C340 660 430 670 500 655 Z');
      g.line('M520 690 Q610 650 690 643 M490 645 Q400 610 310 603', g.lw * 0.7);
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * TAU;
        g.ellipse(500 + Math.cos(a) * 150, 330 + Math.sin(a) * 150, 92, 52, a);
      }
      g.circle(500, 330, 112);
      g.dot(462, 312, 14, true);
      g.dot(538, 312, 14, true);
      g.line('M455 360 Q500 400 545 360');
      g.ellipse(430, 355, 18, 11);
      g.ellipse(570, 355, 18, 11);
      g.shape('M330 790 L670 790 L630 965 L370 965 Z');
      g.rect(305, 760, 390, 70, 14);
      g.ellipse(650, 612, 34, 26, -0.4);
      g.line('M640 590 L662 636', g.lw * 0.7);
      g.dot(635, 615, 6);
      g.dot(662, 608, 6);
    },
  });

  FK.art.add({
    id: 'glace',
    name: 'Glace',
    cat: 'natur',
    colors: [],
    spots: [],
    draw(g) {
      const cone = g.shape('M335 560 L665 560 L500 965 Z');
      g.clip(cone, () => {
        for (let i = -6; i <= 6; i++) {
          g.line('M' + (500 + i * 64) + ' 540 L' + (500 + i * 64 + 300) + ' 990', g.lw * 0.7);
          g.line('M' + (500 + i * 64) + ' 540 L' + (500 + i * 64 - 300) + ' 990', g.lw * 0.7);
        }
      });
      g.shape('M315 585 C295 470 380 385 500 385 C620 385 705 470 685 585 C655 615 630 580 605 605 C580 635 550 595 525 620 C500 645 475 605 450 625 C425 645 400 595 375 610 C350 625 330 605 315 585 Z');
      g.shape('M365 405 C345 290 420 215 500 215 C580 215 655 290 635 405 C610 430 590 400 565 425 C540 450 520 410 500 435 C480 410 460 450 435 425 C410 400 390 430 365 405 Z');
      g.line('M510 165 Q525 110 585 85');
      g.ellipse(612, 92, 38, 17, -0.4);
      g.circle(500, 190, 42);
      [[440, 290, 0.5], [560, 280, -0.6], [500, 340, 1.3], [415, 360, -0.2], [590, 355, 0.3]].forEach((s) => {
        g.ctx.save();
        g.ctx.translate(s[0], s[1]);
        g.ctx.rotate(s[2]);
        g.rect(-24, -9, 48, 18, 9);
        g.ctx.restore();
      });
      g.dot(450, 500, 14, true);
      g.dot(550, 500, 14, true);
      g.line('M465 540 Q500 570 535 540');
      g.ellipse(410, 535, 22, 13);
      g.ellipse(590, 535, 22, 13);
    },
  });

  FK.art.add({
    id: 'mandala',
    name: 'Mandala',
    cat: 'natur',
    colors: [],
    spots: [],
    draw(g) {
      g.circle(500, 500, 450);
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * TAU;
        g.circle(500 + Math.cos(a) * 395, 500 + Math.sin(a) * 395, 48);
      }
      g.circle(500, 500, 345);
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * TAU;
        const ctx = g.ctx;
        ctx.save();
        ctx.translate(500, 500);
        ctx.rotate(a);
        g.shape('M0 -335 C60 -280 70 -220 0 -165 C-70 -220 -60 -280 0 -335 Z');
        g.circle(0, -255, 18);
        ctx.restore();
      }
      g.circle(500, 500, 165);
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * TAU + Math.PI / 8;
        g.ellipse(500 + Math.cos(a) * 110, 500 + Math.sin(a) * 110, 52, 30, a);
      }
      g.circle(500, 500, 62);
      g.star(500, 500, 44, 20, 8, 0);
    },
  });
})();
