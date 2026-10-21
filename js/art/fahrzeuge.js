/* Farbklecks – Ausmalbilder: Fahrzeuge. Drawn with the helper documented in js/art/dsl.js. */
(function () {
  'use strict';
  const FK = window.FK;
  const TAU = Math.PI * 2;

  /* ---------- small local helpers ---------- */

  // A thick tube along a path with one merged outline (bike frames, ladders, pipes).
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

  /* ---------- Zug ---------- */

  FK.art.add({
    id: 'zug',
    name: 'Zug',
    cat: 'fahrzeuge',
    colors: ['rot', 'gelb', 'gruen', 'hellblau', 'grau', 'blau'],
    spots: [],
    draw(g) {
      sunFace(g, 880, 120, 58);
      // mountains with snow
      const mB = g.shape('M330 660 L520 335 Q560 285 600 335 L880 660 Z');
      g.clip(mB, () => g.line('M400 420 L470 400 L510 432 L555 398 L600 430 L640 402 L720 420'));
      const mA = g.shape('M-420 660 L170 245 Q235 180 300 245 L720 660 Z');
      g.clip(mA, () => g.line('M0 340 L70 305 L120 345 L170 305 L225 348 L280 308 L330 342 L380 312 L450 335'));
      hills(g, 640, 22);
      // smoke
      puff(g, 790, 290, 46);
      puff(g, 640, 200, 60);
      puff(g, 455, 112, 72);
      // track
      for (let x = -1180; x < 2200; x += 120) g.rect(x, 830, 62, 54, 10);
      g.line('M-1200 838 L2200 838', g.lw * 1.4);
      flower(g, 130, 945, 52);
      flower(g, 530, 950, 52);
      flower(g, 880, 945, 52);

      // coach
      g.rect(75, 430, 265, 265, 20);
      g.rect(50, 398, 312, 52, 24);
      g.rect(108, 488, 84, 92, 18);
      g.rect(223, 488, 84, 92, 18);
      g.rect(60, 675, 300, 50, 20);
      g.circle(140, 783, 55);
      g.circle(280, 783, 55);
      g.circle(140, 783, 20);
      g.circle(280, 783, 20);
      g.line('M358 700 L386 700', g.lw * 1.3);
      // bird on the roof
      g.shape('M240 382 L205 360 L212 392 Z');
      g.ellipse(268, 374, 40, 30);
      g.circle(300, 346, 24);
      g.poly([[320, 340], [345, 348], [320, 356]]);
      g.dot(304, 342, 6, true);
      g.line('M250 368 Q270 390 292 372', g.lw * 0.7);

      // locomotive
      g.shape('M772 480 L778 412 L754 364 Q801 350 848 364 L824 412 L830 480 Z');
      g.ellipse(690, 476, 46, 44);
      const boiler = g.rect(570, 470, 300, 220, 34);
      g.clip(boiler, () => g.line('M805 420 L805 720'));
      g.circle(878, 548, 32);
      g.rect(400, 332, 192, 368, 18);
      g.rect(388, 300, 222, 50, 24);
      g.rect(432, 384, 126, 120, 22);
      g.shape('M888 712 L968 838 L868 838 Z');
      g.rect(380, 680, 530, 52, 20);
      g.circle(480, 758, 80);
      g.circle(665, 758, 80);
      g.circle(838, 783, 55);
      g.line('M480 758 L665 758', g.lw * 1.3);
      g.circle(480, 758, 26);
      g.circle(665, 758, 26);
      g.circle(838, 783, 20);
    },
  });

  /* ---------- Auto ---------- */

  FK.art.add({
    id: 'auto',
    name: 'Auto',
    cat: 'fahrzeuge',
    colors: ['blau', 'gelb', 'hellblau', 'gruen', 'grau', 'rot'],
    spots: [],
    draw(g) {
      sunFace(g, 135, 135, 62);
      puff(g, 760, 150, 80);
      g.line('M520 140 Q545 115 570 140 Q595 115 620 140', g.lw * 0.8);
      hills(g, 600, 25);
      // road with dashes
      g.shape('M-1200 790 L2200 790 L2200 1400 L-1200 1400 Z');
      for (let x = -1150; x < 2200; x += 260) g.rect(x, 950, 130, 30, 14);
      // bushes on the meadow
      g.blob([[-10, 640, 60], [60, 610, 70], [130, 650, 55]]);
      g.blob([[880, 640, 55], [950, 610, 70], [1020, 640, 60]]);

      // suitcase on the back
      g.rect(195, 505, 130, 115, 16);
      g.line('M235 505 L235 475 Q260 455 285 475 L285 505', g.lw);
      g.line('M260 520 L260 605', g.lw * 0.8);
      // driver
      g.shape('M440 625 L452 560 Q515 525 578 560 L590 625 Z');
      g.shape('M450 450 Q440 380 505 372 Q575 368 578 440 Z');
      g.shape('M455 420 Q395 400 365 430 Q405 438 440 460 Z');
      g.circle(512, 470, 62);
      g.shape('M450 455 Q448 392 512 390 Q575 392 575 450 Q545 425 512 432 Q478 428 450 455 Z');
      face(g, 512, 478, 22, 9, 26, 18);
      // car body
      const body = g.shape('M150 840 C100 840 90 800 92 760 C95 690 118 622 205 614 L635 614 L840 634 C892 642 912 692 912 750 C912 810 896 840 860 840 Z');
      g.clip(body, () => {
        g.line('M405 614 L405 790 Q405 820 435 820 L615 820');
        g.line('M615 820 L615 614');
      });
      g.rect(540, 650, 50, 20, 10);
      g.shape('M612 618 L656 470 L712 476 L678 618 Z');
      g.ellipse(882, 700, 24, 34);
      g.rect(72, 680, 40, 60, 12);
      g.rect(860, 790, 78, 40, 18);
      g.rect(62, 790, 78, 40, 18);
      // wheels
      ring(g, 285, 830, 92, 44);
      ring(g, 720, 830, 92, 44);
      g.circle(285, 830, 44);
      g.circle(720, 830, 44);
    },
  });

  /* ---------- Rakete ---------- */

  FK.art.add({
    id: 'rakete',
    name: 'Rakete',
    cat: 'fahrzeuge',
    colors: ['blau', 'rot', 'gelb', 'orange', 'hellblau'],
    spots: [],
    draw(g) {
      const ctx = g.ctx;
      [[880, 130, 52], [570, 90, 34], [95, 560, 40], [940, 470, 34], [640, 905, 40], [90, 900, 30], [360, 120, 26]].forEach((s) =>
        g.star(s[0], s[1], s[2], s[2] * 0.5));
      g.circle(760, 330, 20);
      g.circle(260, 420, 16);
      g.circle(420, 860, 18);
      // planet with ring
      ctx.save();
      ctx.translate(190, 230);
      ctx.rotate(-0.35);
      ring(g, 0, 0, 0, 0);
      const rp = new Path2D();
      rp.ellipse(0, 0, 175, 50, 0, 0, TAU);
      rp.ellipse(0, 0, 120, 28, 0, 0, TAU);
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
      g.circle(830, 790, 92);
      g.circle(790, 840, 16);
      g.circle(880, 745, 12);
      face(g, 830, 785, 30, 11, 30, 24);

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
        g.shape('M-22 215 L-22 140 Q0 128 22 140 L22 215');
        g.circle(0, -30, 88);
        g.circle(0, -30, 66);
        g.clip(new Path2D('M0 -96 A66 66 0 1 1 -0.1 -96 Z'), () => {
          g.circle(0, 0, 58);
          face(g, 0, -10, 22, 9, 24, 17);
        });
      });
    },
  });

  /* ---------- Velo ---------- */

  FK.art.add({
    id: 'velo',
    name: 'Velo',
    cat: 'fahrzeuge',
    colors: ['violett', 'grau', 'gelb', 'braun', 'orange', 'hellgruen'],
    spots: [],
    draw(g) {
      sunFace(g, 130, 130, 60);
      puff(g, 520, 120, 70);
      hills(g, 860, 18);
      flower(g, 70, 930, 50);
      flower(g, 940, 935, 50);
      // wheels
      [[235, 690], [770, 690]].forEach((w) => {
        ring(g, w[0], w[1], 168, 88);
        g.circle(w[0], w[1], 88);
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * TAU + 0.3;
          g.line('M' + (w[0] + Math.cos(a) * 26) + ' ' + (w[1] + Math.sin(a) * 26) + ' L' + (w[0] + Math.cos(a) * 88) + ' ' + (w[1] + Math.sin(a) * 88), g.lw * 0.7);
        }
      });
      // chain guard
      g.shape('M455 650 L250 668 Q220 690 250 712 L470 745 Q510 700 455 650 Z');
      // frame
      tube(g, 'M235 690 L412 470 L470 705 L235 690 M412 470 L690 440 M470 705 L705 480', 50);
      tube(g, 'M470 705 L700 470', 74);
      tube(g, 'M690 420 L715 520 L770 690', 50);
      tube(g, 'M412 470 L398 405', 34);
      tube(g, 'M690 430 L680 350 Q675 318 630 318 L600 318', 34);
      g.rect(548, 298, 70, 42, 20);
      // saddle
      g.shape('M320 405 Q330 375 400 380 L470 385 Q480 410 440 418 L345 422 Q318 420 320 405 Z');
      // pedals
      tube(g, 'M470 705 L520 790', 30);
      g.rect(485, 785, 80, 30, 12);
      g.circle(470, 705, 52);
      g.circle(235, 690, 26);
      g.circle(770, 690, 26);
      // bell
      g.circle(655, 300, 26);
      // kitten in the basket
      g.poly([[770, 250], [775, 160], [830, 215]]);
      g.poly([[905, 250], [900, 160], [845, 215]]);
      g.circle(838, 280, 88);
      face(g, 838, 285, 32, 12, 30, 18);
      g.shape('M828 298 L848 298 L838 310 Z');
      g.line('M770 300 L720 290 M770 315 L722 322 M906 300 L956 290 M906 315 L954 322', g.lw * 0.7);
      // basket
      g.shape('M725 345 L950 345 L915 505 L760 505 Z');
      g.rect(712, 330, 250, 44, 18);
      g.ellipse(790, 345, 30, 22);
      g.ellipse(886, 345, 30, 22);
    },
  });

  /* ---------- Traktor ---------- */

  FK.art.add({
    id: 'traktor',
    name: 'Traktor',
    cat: 'fahrzeuge',
    colors: ['rot', 'gelb', 'braun', 'hellgruen', 'hellblau', 'grau'],
    spots: [],
    draw(g) {
      sunFace(g, 130, 125, 58);
      puff(g, 790, 210, 52);
      puff(g, 700, 110, 40);
      hills(g, 610, 25);
      // hay wagon
      g.blob([[120, 520, 75], [210, 470, 90], [320, 490, 85], [395, 545, 60], [250, 560, 80]]);
      g.line('M150 520 Q170 500 195 505 M260 470 Q290 455 315 470 M330 540 Q350 525 370 535 M210 570 Q235 555 260 565', g.lw * 0.7);
      // hen on the hay
      g.shape('M175 420 Q140 380 160 350 Q190 380 205 405 Z');
      g.ellipse(225, 415, 52, 40);
      g.circle(265, 375, 28);
      g.shape('M255 350 Q262 325 275 345 Q285 330 290 352 Z');
      g.poly([[290, 372], [318, 380], [290, 390]]);
      g.dot(270, 370, 6, true);
      g.rect(50, 590, 410, 110, 18);
      g.line('M55 645 L455 645', g.lw * 0.8);
      g.line('M450 650 L520 670', g.lw * 1.4);
      g.circle(140, 770, 72);
      g.circle(370, 770, 72);
      g.circle(140, 770, 30);
      g.circle(370, 770, 30);

      // tractor
      g.line('M795 560 L795 300', g.lw * 3.4);
      g.line('M795 560 L795 300', g.lw * 1.4);
      g.rect(470, 270, 230, 40, 18);
      g.line('M500 305 L500 600 M670 305 L670 560');
      // dog driver
      g.ellipse(560, 520, 60, 70);
      g.circle(580, 420, 62);
      g.ellipse(525, 430, 22, 45, 0.3);
      g.ellipse(635, 430, 22, 45, -0.3);
      g.ellipse(600, 450, 30, 22);
      g.dot(612, 440, 9);
      face(g, 580, 410, 20, 8, 55, 0);
      g.line('M630 520 L690 470', g.lw * 1.2);
      g.ellipse(690, 470, 14, 34, 0.5);
      // body
      g.shape('M640 560 L900 560 Q940 560 940 600 L940 700 Q940 730 910 730 L640 730 Z');
      g.clip(new Path2D('M640 560 L900 560 Q940 560 940 600 L940 700 Q940 730 910 730 L640 730 Z'), () => {
        g.line('M880 560 L880 730');
      });
      g.shape('M440 600 L700 600 L700 740 L440 740 Z');
      // wheels
      ring(g, 560, 735, 165, 82);
      g.circle(560, 735, 82);
      [0, 1, 2, 3, 4].forEach((i) => { const a = (i / 5) * TAU; g.dot(560 + Math.cos(a) * 52, 735 + Math.sin(a) * 52, 9); });
      ring(g, 850, 795, 100, 30);
      g.circle(850, 795, 30);
    },
  });

  /* ---------- Feuerwehrauto ---------- */

  FK.art.add({
    id: 'feuerwehr',
    name: 'Feuerwehrauto',
    cat: 'fahrzeuge',
    colors: ['rot', 'gelb', 'blau', 'hellblau', 'grau', 'gruen'],
    spots: [],
    draw(g) {
      g.cloud(200, 130, 110);
      g.cloud(780, 110, 90);
      hills(g, 640, 20);
      g.shape('M-1200 820 L2200 820 L2200 1400 L-1200 1400 Z');
      // body
      g.rect(80, 450, 640, 330, 26);
      g.rect(115, 500, 160, 200, 14);
      g.rect(300, 500, 160, 200, 14);
      g.rect(485, 500, 160, 200, 14);
      // cab
      g.shape('M690 400 L860 400 Q900 400 915 440 L950 600 Q955 620 955 640 L955 760 Q955 780 935 780 L690 780 Z');
      g.shape('M730 440 L850 440 Q870 440 875 460 L905 590 L730 590 Z');
      g.rect(80, 700, 875, 70, 20);
      // blue lights
      g.shape('M740 400 L740 370 Q770 330 800 370 L800 400 Z');
      g.shape('M120 450 L120 420 Q150 380 180 420 L180 450 Z');
      // ladder
      const lad = new Path2D('M110 405 L840 375 M110 345 L840 315');
      tube(g, lad, 30);
      for (let x = 160; x < 840; x += 90) tube(g, 'M' + x + ' ' + (403 - (x - 110) * 0.041) + ' L' + x + ' ' + (347 - (x - 110) * 0.041), 24);
      g.rect(330, 405, 120, 45, 10);
      // wheels
      [[230, 790], [450, 790], [790, 790]].forEach((w) => {
        ring(g, w[0], w[1], 88, 36);
        g.circle(w[0], w[1], 36);
      });
    },
  });
})();
