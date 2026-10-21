/* Farbklecks – Ausmalbilder: Tiere. Drawn with the helper documented in js/art/dsl.js. */
(function () {
  'use strict';
  const FK = window.FK;
  const TAU = Math.PI * 2;

  // Path string through a list of points (open).
  function pts(list) {
    return list.map((q, i) => (i ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join(' ');
  }

  // Rosy cheeks + happy eyes: dot eyes with shine.
  function eyes(g, x1, x2, y, r) {
    g.dot(x1, y, r, true);
    g.dot(x2, y, r, true);
  }

  /* ---------- Katze ---------- */
  FK.art.add({
    id: 'katze',
    name: 'Katze',
    cat: 'tiere',
    colors: ['orange', 'rosa', 'rot', 'gelb', 'blau'],
    spots: [
      { x: 500, y: 300, c: 1 },   // head
      { x: 325, y: 175, c: 1 },   // left ear tip
      { x: 675, y: 175, c: 1 },   // right ear tip
      { x: 365, y: 255, c: 2 },   // left inner ear
      { x: 635, y: 255, c: 2 },   // right inner ear
      { x: 360, y: 720, c: 1 },   // body
      { x: 500, y: 760, c: 4 },   // belly
      { x: 825, y: 680, c: 1 },   // tail
      { x: 500, y: 605, c: 3 },   // collar
      { x: 200, y: 850, c: 2 },   // yarn
      { x: 740, y: 885, c: 5 },   // cushion
    ],
    draw(g) {
      // cushion
      g.rect(150, 800, 700, 140, 60);
      g.line('M215 870 L250 870 M750 870 L785 870', g.lw * 0.8);
      // tail
      g.shape('M640 860 C770 870 870 800 870 690 C870 600 830 545 780 535 C740 527 725 565 752 590 C790 625 800 660 795 700 C785 770 730 795 640 790 Z');
      // body
      g.shape('M315 905 C285 720 360 530 500 530 C640 530 715 720 685 905 Z');
      g.ellipse(500, 765, 95, 120);
      // front paws
      g.ellipse(420, 890, 72, 42);
      g.ellipse(580, 890, 72, 42);
      g.line('M400 932 L400 905 M440 932 L440 905 M560 932 L560 905 M600 932 L600 905', g.lw * 0.8);
      // collar + bell
      g.shape('M355 540 Q500 600 645 540 L655 610 Q500 670 345 610 Z');
      // ears
      g.mirror(500, () => {
        g.shape('M285 370 L295 140 Q300 105 330 125 L490 250 Z');
        g.shape('M335 330 L340 230 Q342 215 356 224 L440 285 Z');
      });
      // head
      g.ellipse(500, 395, 235, 185);
      // tabby marks
      g.line('M500 212 L500 262 M440 218 L447 258 M560 218 L553 258');
      // face
      eyes(g, 418, 582, 385, 30);
      g.ellipse(365, 460, 36, 22);
      g.ellipse(635, 460, 36, 22);
      g.shape('M468 438 Q500 428 532 438 Q522 466 500 472 Q478 466 468 438 Z');
      g.line('M500 472 L500 488 M500 488 Q480 512 456 496 M500 488 Q520 512 544 496', g.lw * 0.8);
      g.line('M290 430 L190 410 M292 470 L195 490 M710 430 L810 410 M708 470 L805 490', g.lw * 0.8);
      g.circle(500, 655, 42);
      g.line('M462 650 L538 650', g.lw * 0.8);
      g.dot(500, 674, 8);
      // yarn ball
      g.line('M135 880 Q90 930 130 960 Q170 985 110 995');
      g.circle(195, 835, 88);
      g.line('M140 790 Q185 760 238 788 M128 822 Q180 800 210 815', g.lw * 0.7);
    },
  });

  /* ---------- Teddybär ---------- */
  FK.art.add({
    id: 'teddy',
    name: 'Teddybär',
    cat: 'tiere',
    colors: ['braun', 'pfirsich', 'rot', 'blau', 'gelb'],
    spots: [
      { x: 440, y: 255, c: 1 },   // head
      { x: 250, y: 185, c: 1 },   // left ear
      { x: 630, y: 185, c: 1 },   // right ear
      { x: 300, y: 225, c: 2 },   // left inner ear
      { x: 580, y: 225, c: 2 },   // right inner ear
      { x: 440, y: 450, c: 2 },   // muzzle
      { x: 285, y: 680, c: 1 },   // body
      { x: 440, y: 720, c: 3 },   // heart
      { x: 180, y: 640, c: 1 },   // left arm
      { x: 660, y: 520, c: 1 },   // right arm
      { x: 300, y: 860, c: 1 },   // left leg
      { x: 580, y: 860, c: 1 },   // right leg
      { x: 440, y: 575, c: 4 },   // bow knot
      { x: 835, y: 190, c: 3 },   // balloon
      { x: 800, y: 845, c: 4 },   // block front
      { x: 780, y: 940, c: 5 },   // rug
    ],
    draw(g) {
      // rug
      g.ellipse(500, 935, 440, 60);
      // balloon + string
      g.line('M675 450 C700 400 740 380 760 340 C780 300 805 330 815 305');
      g.shape('M815 300 L800 330 L835 330 Z');
      g.ellipse(825, 195, 100, 115);
      g.line('M770 140 Q785 110 815 102', g.lw * 0.8);
      // block
      g.shape('M720 780 L760 740 L920 740 L880 780 Z');
      g.shape('M880 780 L920 740 L920 900 L880 940 Z');
      g.rect(720, 780, 160, 160, 8);
      g.star(800, 862, 52, 24);
      // ears
      g.circle(290, 200, 95);
      g.circle(590, 200, 95);
      g.circle(312, 222, 45);
      g.circle(568, 222, 45);
      // arms
      g.ellipse(215, 650, 72, 130, 0.45);
      g.ellipse(640, 520, 70, 135, -0.75);
      // body
      g.ellipse(440, 690, 210, 215);
      g.ellipse(440, 725, 118, 125);
      g.heart(440, 718, 58);
      // legs
      g.ellipse(310, 870, 110, 88);
      g.ellipse(570, 870, 110, 88);
      g.ellipse(295, 890, 58, 50);
      g.ellipse(585, 890, 58, 50);
      // head
      g.circle(440, 360, 200);
      g.ellipse(440, 450, 98, 74);
      // nose (ink) with shine
      const ctx = g.ctx;
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.ellipse(440, 418, 38, 26, 0, 0, TAU);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.ellipse(428, 410, 10, 6, 0, 0, TAU);
      ctx.fill();
      g.line('M440 440 L440 470 M440 470 Q415 498 388 480 M440 470 Q465 498 492 480', g.lw * 0.8);
      eyes(g, 365, 515, 335, 24);
      g.ellipse(330, 410, 30, 18);
      g.ellipse(550, 410, 30, 18);
      // bow tie
      g.shape('M440 575 L350 528 Q335 575 350 622 Z');
      g.shape('M440 575 L530 528 Q545 575 530 622 Z');
      g.circle(440, 575, 34);
    },
  });

  /* ---------- Fisch ---------- */
  FK.art.add({
    id: 'fisch',
    name: 'Fisch',
    cat: 'tiere',
    colors: ['orange', 'gelb', 'rot', 'gruen', 'hellblau', 'rosa'],
    spots: [
      { x: 500, y: 110, c: 5 },   // water
      { x: 500, y: 930, c: 2 },   // sand
      { x: 120, y: 700, c: 4 },   // seaweed left
      { x: 890, y: 760, c: 4 },   // seaweed right
      { x: 250, y: 440, c: 1 },   // fish head
      { x: 470, y: 400, c: 1 },   // fish middle
      { x: 680, y: 450, c: 1 },   // fish back
      { x: 365, y: 360, c: 2 },   // stripe 1
      { x: 585, y: 360, c: 2 },   // stripe 2
      { x: 540, y: 245, c: 3 },   // top fin
      { x: 865, y: 465, c: 3 },   // tail
      { x: 510, y: 680, c: 3 },   // bottom fin
      { x: 500, y: 555, c: 3 },   // side fin
      { x: 700, y: 905, c: 3 },   // starfish
      { x: 270, y: 915, c: 6 },   // shell
    ],
    draw(g) {
      // sand
      g.shape('M-1200 860 Q-900 830 -600 860 Q-300 890 0 860 Q250 835 500 860 Q750 885 1000 860 Q1300 830 1600 860 Q1900 890 2200 860 L2200 1400 L-1200 1400 Z');
      // seaweed
      g.shape('M80 880 C40 790 140 740 90 650 C50 580 110 530 100 470 C160 530 150 590 175 650 C210 740 130 800 160 880 Z');
      g.shape('M850 880 C810 810 900 770 860 700 C830 640 875 600 870 550 C930 600 905 650 925 700 C955 780 885 820 915 880 Z');
      // starfish + shell
      g.at(700, 910, -0.2, 1, () => {
        const p = new Path2D();
        for (let i = 0; i < 10; i++) {
          const a = -Math.PI / 2 + (i * Math.PI) / 5;
          const r = i % 2 ? 30 : 72;
          const x = Math.cos(a) * r, y = Math.sin(a) * r;
          i ? p.lineTo(x, y) : p.moveTo(x, y);
        }
        p.closePath();
        g.ctx.lineJoin = 'round';
        g.draw(p);
      });
      g.shape('M200 950 Q195 870 270 860 Q345 870 340 950 Z');
      g.line('M245 948 L240 885 M270 948 L270 875 M295 948 L300 885', g.lw * 0.7);
      // fins + tail (behind body)
      g.shape('M720 470 Q800 370 920 320 Q880 470 920 620 Q800 570 720 470 Z');
      g.shape('M370 300 Q430 160 650 260 Q620 300 600 320 Z');
      g.shape('M440 640 Q500 760 600 650 Z');
      // body
      const body = g.shape('M150 470 C190 290 470 240 620 290 C720 330 760 400 770 470 C760 560 700 620 600 650 C450 700 190 650 150 470 Z');
      g.clip(body, () => {
        g.line('M320 230 Q290 470 320 710');
        g.line('M410 230 Q385 470 410 710');
        g.line('M540 230 Q520 470 540 710');
        g.line('M630 230 Q615 470 630 710');
      });
      g.draw(body, false);
      // side fin
      g.shape('M450 510 Q540 500 575 580 Q500 610 450 510 Z');
      // face
      g.dot(245, 420, 30, true);
      g.line('M168 505 Q195 528 228 512', g.lw * 0.9);
      g.ellipse(255, 505, 26, 16);
      // bubbles
      g.circle(110, 380, 30);
      g.circle(70, 290, 22);
      g.circle(115, 215, 16);
      g.circle(820, 150, 28);
      g.circle(880, 80, 18);
    },
  });

  /* ---------- Schmetterling ---------- */
  FK.art.add({
    id: 'schmetterling',
    name: 'Schmetterling',
    cat: 'tiere',
    colors: ['violett', 'pink', 'gelb', 'hellblau', 'gruen', 'orange'],
    spots: [
      { x: 500, y: 60, c: 4 },    // sky
      { x: 190, y: 330, c: 1 },   // upper wing left
      { x: 810, y: 330, c: 1 },   // upper wing right
      { x: 275, y: 245, c: 3 },   // spot left
      { x: 725, y: 245, c: 3 },
      { x: 390, y: 420, c: 6 },   // small spot left
      { x: 610, y: 420, c: 6 },
      { x: 250, y: 740, c: 2 },   // lower wing left
      { x: 750, y: 740, c: 2 },
      { x: 345, y: 640, c: 3 },   // heart left
      { x: 655, y: 640, c: 3 },
      { x: 500, y: 560, c: 1 },   // body
      { x: 500, y: 340, c: 1 },   // head
      { x: 500, y: 950, c: 5 },   // grass
      { x: 95, y: 815, c: 6 },    // flower left
      { x: 905, y: 815, c: 6 },   // flower right
    ],
    draw(g) {
      // grass
      g.shape('M-1200 910 Q-600 880 0 905 Q500 925 1000 900 Q1600 880 2200 910 L2200 1400 L-1200 1400 Z');
      // flowers
      [[95, 815], [905, 815]].forEach((f) => {
        g.rect(f[0] - 9, f[1], 18, 110, 9);
        g.flower(f[0], f[1], 44);
      });
      g.mirror(500, () => {
        g.shape('M490 470 C400 220 170 100 105 260 C60 410 270 510 490 505 Z');
        g.shape('M490 525 C320 525 170 620 215 760 C260 890 440 800 495 620 Z');
        g.ellipse(265, 280, 72, 62, -0.5);
        g.circle(390, 425, 38);
        g.heart(345, 655, 56);
        g.line('M478 288 Q445 175 380 140');
        g.circle(372, 132, 24);
      });
      g.ellipse(500, 580, 42, 205);
      g.circle(500, 345, 72);
      eyes(g, 472, 528, 340, 14);
      g.line('M475 372 Q500 392 525 372', g.lw * 0.8);
    },
  });

  /* ---------- Schnecke ---------- */
  function shellPath(cx, cy, R, turns, rot) {
    const A = [];
    const B = [];
    const N = 120;
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const r = R * t;
      const a = rot + t * turns * TAU;
      A.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
      B.push([cx + Math.cos(a + Math.PI) * r, cy + Math.sin(a + Math.PI) * r]);
    }
    return pts(B.reverse().concat(A.slice(1)));
  }

  FK.art.add({
    id: 'schnecke',
    name: 'Schnecke',
    cat: 'tiere',
    colors: ['orange', 'gelb', 'hellgruen', 'gruen', 'hellblau', 'rot'],
    spots: [
      { x: 500, y: 250, c: 5 },   // sky
      { x: 500, y: 920, c: 4 },   // grass
      { x: 850, y: 120, c: 2 },   // sun
      { x: 230, y: 780, c: 3 },   // snail foot
      { x: 690, y: 590, c: 3 },   // snail head
      { x: 300, y: 450, c: 1 },   // shell A
      { x: 470, y: 690, c: 2 },   // shell B
      { x: 890, y: 650, c: 6 },   // mushroom cap
    ],
    draw(g) {
      // sun + cloud
      g.sun(850, 120, 58);
      g.cloud(200, 150, 150);
      // ground
      g.shape('M-1200 830 Q-500 800 100 820 Q550 840 1000 815 Q1500 795 2200 830 L2200 1400 L-1200 1400 Z');
      // mushroom
      g.rect(860, 680, 60, 150, 22);
      g.shape('M805 700 C805 590 975 590 975 700 Q890 725 805 700 Z');
      g.circle(850, 650, 18);
      g.circle(920, 640, 16);
      // snail body
      g.shape('M120 830 C100 770 140 750 200 750 L560 750 C610 750 620 700 615 640 C610 560 650 500 700 500 C760 500 790 560 785 640 C780 720 750 800 700 830 Z');
      g.line('M665 510 Q650 440 620 400 M735 510 Q760 440 790 405');
      g.circle(616, 392, 22);
      g.circle(795, 398, 22);
      eyes(g, 668, 745, 585, 20);
      g.line('M675 640 Q706 668 738 640', g.lw * 0.8);
      g.ellipse(640, 630, 18, 12);
      g.ellipse(770, 630, 18, 12);
      // shell
      const shell = g.circle(380, 565, 205);
      g.clip(shell, () => g.line(shellPath(380, 565, 220, 1.5, 0.6)));
      g.draw(shell, false);
      // grass tufts
      g.grass(70, 960, 16);
      g.grass(470, 970, 16);
      g.grass(760, 960, 16);
    },
  });

  /* ---------- Marienkäfer ---------- */
  FK.art.add({
    id: 'marienkaefer',
    name: 'Marienkäfer',
    cat: 'tiere',
    colors: ['rot', 'schwarz', 'gruen', 'gelb', 'pink', 'hellblau'],
    spots: [
      { x: 500, y: 60, c: 6 },    // sky
      { x: 790, y: 175, c: 4 },   // flower centre
      { x: 330, y: 470, c: 1 },   // left wing
      { x: 560, y: 520, c: 1 },   // right wing
      { x: 430, y: 290, c: 2 },   // head
      { x: 150, y: 830, c: 3 },   // leaf lower
      { x: 760, y: 520, c: 3 },   // leaf upper
    ],
    draw(g) {
      g.cloud(170, 140, 140);
      // flower stem behind the leaf
      g.rect(782, 250, 22, 400, 11);
      g.shape('M800 420 Q880 360 930 390 Q880 450 800 440 Z');
      g.flower(790, 175, 60);
      // leaf
      g.shape('M70 940 C40 680 260 420 600 360 C760 335 860 340 945 300 C935 440 870 600 740 720 C580 870 300 960 70 940 Z');
      g.line('M70 940 C300 760 560 560 900 330');
      // legs
      g.mirror(430, () => {
        g.line('M260 470 L185 430', g.lw * 1.3);
        g.line('M240 590 L160 600', g.lw * 1.3);
        g.line('M270 700 L200 760', g.lw * 1.3);
        g.line('M392 260 Q370 190 335 165');
        g.circle(330, 158, 22);
      });
      // head
      g.ellipse(430, 345, 128, 105);
      g.mirror(430, () => {
        g.ellipse(385, 300, 30, 36);
        g.dot(390, 308, 16, true);
      });
      // body
      const body = g.ellipse(430, 565, 220, 210);
      g.line('M430 350 L430 780');
      g.clip(body, () => {
        [[330, 470, 48], [285, 600, 45], [360, 710, 42], [530, 470, 48], [575, 600, 45], [500, 710, 42]].forEach((s) => g.circle(s[0], s[1], s[2]));
      });
    },
  });
})();
