/* Farbtupf – Ausmalbilder: Tiere. Drawn with the helper documented in js/art/dsl.js. */
(function () {
  'use strict';
  const FK = window.FK;
  const TAU = Math.PI * 2;

  /* ---------- local helpers ---------- */

  // Path string through a list of points (open).
  function pts(list) {
    return list.map((q, i) => (i ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join(' ');
  }

  // Happy eyes: dot eyes with shine.
  function eyes(g, x1, x2, y, r) {
    g.dot(x1, y, r, true);
    g.dot(x2, y, r, true);
  }

  // Wavy ground that runs far beyond the box so wide screens show a continuous landscape.
  function ground(g, y, a) {
    return g.shape('M-1200 ' + y + ' Q-600 ' + (y - a) + ' 0 ' + y + ' Q250 ' + (y + a) + ' 500 ' + y +
      ' Q750 ' + (y - a) + ' 1000 ' + y + ' Q1600 ' + (y + a) + ' 2200 ' + y + ' L2200 1400 L-1200 1400 Z');
  }

  // Several closed paths merged into one outlined region without inner lines (head with ears …).
  function merge(g, paths) {
    const ctx = g.ctx;
    ctx.strokeStyle = '#000';
    ctx.lineWidth = g.lw * 2;
    paths.forEach((p) => ctx.stroke(p));
    ctx.fillStyle = '#fff';
    paths.forEach((p) => ctx.fill(p));
    return paths;
  }

  function polyPath(list) {
    const p = new Path2D();
    list.forEach((q, i) => (i ? p.lineTo(q[0], q[1]) : p.moveTo(q[0], q[1])));
    p.closePath();
    return p;
  }

  function ellPath(x, y, rx, ry, rot) {
    const p = new Path2D();
    p.ellipse(x, y, rx, ry, rot || 0, 0, TAU);
    return p;
  }

  // Triangle ABC shrunk by factor k towards its incentre (inner ear inside an ear).
  function innerTri(A, B, C, k) {
    const d = (P, Q) => Math.hypot(P[0] - Q[0], P[1] - Q[1]);
    const a = d(B, C), b = d(C, A), c = d(A, B), s = a + b + c;
    const I = [(a * A[0] + b * B[0] + c * C[0]) / s, (a * A[1] + b * B[1] + c * C[1]) / s];
    return [A, B, C].map((V) => [I[0] + k * (V[0] - I[0]), I[1] + k * (V[1] - I[1])]);
  }

  function bez(p0, p1, p2, p3, t) {
    const u = 1 - t;
    return [
      u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
      u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
    ];
  }

  // A tube along a cubic curve, width w0 → w1, flat start, round end (tail).
  function tube(p0, p1, p2, p3, w0, w1) {
    const L = [], R = [];
    const N = 48;
    let end = null;
    for (let i = 0; i <= N; i++) {
      const t = i / N, u = 1 - t;
      const b = bez(p0, p1, p2, p3, t);
      const dx = 3 * u * u * (p1[0] - p0[0]) + 6 * u * t * (p2[0] - p1[0]) + 3 * t * t * (p3[0] - p2[0]);
      const dy = 3 * u * u * (p1[1] - p0[1]) + 6 * u * t * (p2[1] - p1[1]) + 3 * t * t * (p3[1] - p2[1]);
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len, ny = dx / len;
      const h = (w0 + (w1 - w0) * t) / 2;
      L.push([b[0] + nx * h, b[1] + ny * h]);
      R.push([b[0] - nx * h, b[1] - ny * h]);
      if (i === N) end = { x: b[0], y: b[1], a: Math.atan2(ny, nx), h };
    }
    const p = new Path2D();
    L.forEach((q, i) => (i ? p.lineTo(q[0], q[1]) : p.moveTo(q[0], q[1])));
    p.arc(end.x, end.y, end.h, end.a, end.a + Math.PI, true);
    for (let i = N; i >= 0; i--) p.lineTo(R[i][0], R[i][1]);
    p.closePath();
    return p;
  }

  // Flower whose petals form one colourable ring around a round centre.
  function bloom(g, x, y, r, n) {
    n = n || 5;
    const petals = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU - Math.PI / 2;
      petals.push(ellPath(x + Math.cos(a) * r, y + Math.sin(a) * r, r * 0.72, r * 0.72));
    }
    merge(g, petals);
    return g.circle(x, y, r * 0.62);
  }

  // Solid ink shape (noses): not colourable.
  function ink(g, p) {
    g.ctx.fillStyle = '#000';
    g.ctx.fill(p);
    g.ctx.strokeStyle = '#000';
    g.ctx.lineWidth = g.lw;
    g.ctx.stroke(p);
    return p;
  }

  /* ---------- Katze ---------- */
  const CAT_EAR = [[582, 252], [770, 62], [750, 352]];
  const CAT_INNER = innerTri(CAT_EAR[0], CAT_EAR[1], CAT_EAR[2], 0.63);

  FK.art.add({
    id: 'katze',
    name: 'Katze',
    cat: 'tiere',
    colors: ['orange', 'rosa', 'rot', 'gelb', 'hellblau', 'braun'],
    spots: [
      { x: 500, y: 318, c: 1 },   // head
      { x: 312, y: 238, c: 2 },   // left inner ear
      { x: 688, y: 238, c: 2 },   // right inner ear
      { x: 400, y: 632, c: 3 },   // collar
      { x: 352, y: 760, c: 1 },   // body left
      { x: 648, y: 760, c: 1 },   // body right
      { x: 500, y: 790, c: 4 },   // belly
      { x: 776, y: 846, c: 1 },   // tail
      { x: 168, y: 892, c: 2 },   // yarn
      { x: 120, y: 300, c: 5 },   // wall
      { x: 880, y: 950, c: 6 },   // floor
    ],
    draw(g) {
      // floor
      g.shape('M-1200 800 L2200 800 L2200 1400 L-1200 1400 Z');
      // tail curling up behind the body
      g.draw(tube([640, 850], [830, 905], [915, 740], [830, 580], 86, 78));
      // body, belly and paws
      g.shape('M300 890 C268 700 360 545 500 545 C640 545 732 700 700 890 Z');
      g.ellipse(500, 770, 94, 120);
      g.ellipse(425, 890, 74, 42);
      g.ellipse(575, 890, 74, 42);
      g.line('M405 932 L405 906 M445 932 L445 906 M555 932 L555 906 M595 932 L595 906', g.lw * 0.75);
      // collar with a little bell
      g.shape('M330 545 Q500 610 670 545 L676 648 Q500 742 324 648 Z');
      g.circle(500, 712, 32);
      g.line('M470 708 L530 708', g.lw * 0.75);
      g.dot(500, 726, 7);
      // head with ears in one outline, pink inside the ears
      const mx = (q) => [1000 - q[0], q[1]];
      merge(g, [ellPath(500, 410, 262, 185), polyPath(CAT_EAR), polyPath(CAT_EAR.map(mx))]);
      g.poly(CAT_INNER);
      g.poly(CAT_INNER.map(mx));
      // tabby marks on the forehead
      g.line('M500 222 L500 270 M446 228 L452 264 M554 228 L548 264', g.lw * 0.9);
      // face
      eyes(g, 415, 585, 395, 31);
      g.ellipse(358, 468, 34, 20);
      g.ellipse(642, 468, 34, 20);
      g.shape('M472 444 Q500 434 528 444 Q520 470 500 476 Q480 470 472 444 Z');
      g.line('M500 476 L500 492 M500 492 Q478 516 452 498 M500 492 Q522 516 548 498', g.lw * 0.8);
      g.line('M300 436 L196 414 M302 476 L200 496 M700 436 L804 414 M698 476 L800 496', g.lw * 0.75);
      // yarn ball with a loose thread
      g.line('M228 930 Q280 975 330 950 Q360 935 372 968');
      g.circle(170, 878, 84);
      g.line('M104 846 Q140 810 196 806 M98 880 Q128 832 214 830 M150 952 Q214 944 244 900', g.lw * 0.75);
    },
  });

  /* ---------- Teddybär ---------- */
  FK.art.add({
    id: 'teddy',
    name: 'Teddybär',
    cat: 'tiere',
    colors: ['braun', 'gelb', 'rot', 'blau', 'gruen', 'hellblau'],
    spots: [
      { x: 430, y: 222, c: 1 },   // head
      { x: 268, y: 162, c: 1 },   // left ear
      { x: 592, y: 162, c: 1 },   // right ear
      { x: 354, y: 412, c: 2 },   // muzzle
      { x: 362, y: 524, c: 4 },   // bow left
      { x: 498, y: 524, c: 4 },   // bow right
      { x: 552, y: 630, c: 1 },   // body
      { x: 430, y: 700, c: 3 },   // heart
      { x: 205, y: 720, c: 1 },   // left arm
      { x: 652, y: 506, c: 1 },   // right arm
      { x: 300, y: 820, c: 1 },   // left leg
      { x: 560, y: 820, c: 1 },   // right leg
      { x: 190, y: 885, c: 2 },   // left sole
      { x: 670, y: 885, c: 2 },   // right sole
      { x: 800, y: 210, c: 3 },   // balloon
      { x: 120, y: 120, c: 2 },   // sun
      { x: 850, y: 900, c: 5 },   // grass
      { x: 880, y: 560, c: 6 },   // sky
    ],
    draw(g) {
      g.sun(120, 120, 50, 10);
      ground(g, 790, 12);
      g.grass(70, 955, 14);
      g.grass(860, 975, 14);
      // balloon on a string
      g.line('M800 330 C780 370 770 390 742 425');
      g.ellipse(800, 205, 96, 112);
      g.shape('M800 312 L783 338 L817 338 Z');
      g.line('M742 150 Q756 118 790 108', g.lw * 0.8);
      // ears
      g.circle(290, 185, 84);
      g.circle(570, 185, 84);
      // arms behind the body
      g.ellipse(245, 650, 68, 125, 0.45);
      g.ellipse(640, 520, 66, 130, 0.75);
      // body with a heart
      g.ellipse(430, 665, 188, 192);
      g.heart(430, 688, 76);
      // legs with round soles
      g.ellipse(285, 835, 118, 74, -0.4);
      g.ellipse(575, 835, 118, 74, 0.4);
      g.ellipse(195, 878, 56, 70, -0.4);
      g.ellipse(665, 878, 56, 70, 0.4);
      // head
      g.circle(430, 330, 178);
      g.ellipse(430, 405, 120, 75);
      ink(g, ellPath(430, 376, 36, 25));
      g.ctx.fillStyle = '#fff';
      g.ctx.beginPath();
      g.ctx.ellipse(418, 368, 10, 6, 0, 0, TAU);
      g.ctx.fill();
      g.line('M430 400 L430 424 M430 424 Q410 444 390 431 M430 424 Q450 444 470 431', g.lw * 0.8);
      eyes(g, 365, 495, 300, 23);
      // bow tie
      g.ellipse(365, 522, 62, 44, -0.25);
      g.ellipse(495, 522, 62, 44, 0.25);
      g.circle(430, 522, 28);
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
      { x: 500, y: 935, c: 2 },   // sand
      { x: 117, y: 795, c: 4 },   // seaweed left
      { x: 878, y: 815, c: 4 },   // seaweed right
      { x: 735, y: 730, c: 5 },   // water under the fish
      { x: 245, y: 520, c: 1 },   // fish head
      { x: 470, y: 400, c: 1 },   // fish middle
      { x: 690, y: 450, c: 1 },   // fish back
      { x: 352, y: 400, c: 2 },   // stripe 1
      { x: 585, y: 386, c: 2 },   // stripe 2
      { x: 500, y: 228, c: 3 },   // top fin
      { x: 836, y: 450, c: 3 },   // tail
      { x: 515, y: 712, c: 3 },   // bottom fin
      { x: 522, y: 552, c: 3 },   // side fin
      { x: 696, y: 920, c: 3 },   // starfish
      { x: 262, y: 882, c: 6 },   // shell
    ],
    draw(g) {
      // sand
      g.shape('M-1200 850 Q-900 820 -600 850 Q-300 880 0 850 Q250 825 500 850 Q750 875 1000 850 Q1300 820 1600 850 Q1900 880 2200 850 L2200 1400 L-1200 1400 Z');
      // seaweed
      g.shape('M55 880 C15 780 125 730 75 640 C35 570 95 505 90 430 C180 505 170 575 195 640 C235 740 150 800 180 880 Z');
      g.shape('M825 880 C785 800 885 760 845 690 C810 630 860 585 855 520 C945 585 920 645 945 700 C975 780 900 820 935 880 Z');
      // starfish + shell
      g.star(700, 912, 98, 52, 5, -Math.PI / 2 - 0.2);
      g.dot(682, 880, 7);
      g.dot(720, 878, 7);
      g.shape('M180 965 Q172 842 270 832 Q368 842 360 965 Z');
      g.line('M226 963 L214 925 M270 963 L270 922 M314 963 L326 925', g.lw * 0.75);
      // fins + tail (behind body)
      g.shape('M720 470 Q800 360 925 315 Q880 470 925 625 Q800 580 720 470 Z');
      g.shape('M335 305 C355 145 525 110 675 245 Q632 285 612 320 Z');
      g.shape('M410 636 C428 785 592 800 628 646 Z');
      // body with two stripes
      const body = g.shape('M150 470 C190 290 470 240 620 290 C720 330 760 400 770 470 C760 560 700 620 600 650 C450 700 190 650 150 470 Z');
      g.clip(body, () => {
        g.line('M320 230 Q290 470 320 710');
        g.line('M418 230 Q393 470 418 710');
        g.line('M545 230 Q525 470 545 710');
        g.line('M642 230 Q627 470 642 710');
      });
      g.draw(body, false);
      // side fin
      g.shape('M445 505 Q565 485 605 595 Q505 635 445 505 Z');
      // face
      g.dot(228, 418, 30, true);
      g.line('M166 492 Q186 510 210 498', g.lw * 0.9);
      // bubbles
      g.circle(110, 360, 30);
      g.circle(70, 270, 22);
      g.circle(115, 195, 16);
      g.circle(820, 150, 28);
      g.circle(880, 80, 18);
    },
  });

  /* ---------- Schmetterling ---------- */
  // Tulip head standing on a stem that reaches down to y = y1.
  function tulip(g, x, y, s, y1) {
    g.line('M' + x + ' ' + (y + 50 * s) + ' L' + x + ' ' + y1, g.lw * 1.3);
    g.at(x, y, 0, s, () => {
      g.shape('M-58 -62 L-30 -24 L0 -68 L30 -24 L58 -62 C68 10 42 56 0 56 C-42 56 -68 10 -58 -62 Z');
    });
  }

  FK.art.add({
    id: 'schmetterling',
    name: 'Schmetterling',
    cat: 'tiere',
    colors: ['violett', 'pink', 'gelb', 'hellblau', 'gruen', 'orange'],
    spots: [
      { x: 500, y: 60, c: 4 },    // sky
      { x: 230, y: 400, c: 1 },   // upper wing left
      { x: 770, y: 400, c: 1 },   // upper wing right
      { x: 266, y: 278, c: 3 },   // big spot left
      { x: 734, y: 278, c: 3 },   // big spot right
      { x: 384, y: 422, c: 6 },   // small spot left
      { x: 616, y: 422, c: 6 },   // small spot right
      { x: 262, y: 745, c: 2 },   // lower wing left
      { x: 738, y: 745, c: 2 },   // lower wing right
      { x: 342, y: 668, c: 3 },   // heart left
      { x: 658, y: 668, c: 3 },   // heart right
      { x: 500, y: 590, c: 1 },   // body
      { x: 500, y: 300, c: 1 },   // head
      { x: 300, y: 950, c: 5 },   // grass
      { x: 90, y: 808, c: 6 },    // tulip left
      { x: 910, y: 808, c: 6 },   // tulip right
    ],
    draw(g) {
      // grass
      g.shape('M-1200 885 Q-600 860 0 882 Q500 905 1000 878 Q1600 860 2200 885 L2200 1400 L-1200 1400 Z');
      g.grass(560, 975, 14);
      g.grass(840, 965, 14);
      // tulips
      tulip(g, 90, 800, 1, 890);
      tulip(g, 910, 800, 1, 890);
      g.mirror(500, () => {
        // upper wing with two dots, lower wing with a heart
        g.shape('M490 470 C400 220 170 100 105 260 C60 410 270 510 490 505 Z');
        g.shape('M490 525 C320 525 170 620 215 760 C260 890 440 800 495 620 Z');
        g.ellipse(266, 280, 74, 62, -0.5);
        g.circle(384, 422, 46);
        g.heart(342, 662, 66);
        // antenna
        g.line('M474 270 Q445 165 380 130');
        g.circle(372, 122, 26);
      });
      g.ellipse(500, 585, 50, 210);
      g.circle(500, 330, 84);
      eyes(g, 470, 530, 352, 15);
      g.line('M474 384 Q500 404 526 384', g.lw * 0.8);
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
      { x: 520, y: 210, c: 5 },   // sky
      { x: 280, y: 930, c: 4 },   // grass
      { x: 850, y: 120, c: 2 },   // sun
      { x: 684, y: 729, c: 3 },   // snail body
      { x: 347, y: 413, c: 1 },   // shell band A
      { x: 413, y: 714, c: 2 },   // shell band B
      { x: 905, y: 670, c: 6 },   // mushroom cap
    ],
    draw(g) {
      // sun + cloud
      g.sun(850, 120, 58);
      g.cloud(200, 150, 150);
      // ground
      g.shape('M-1200 830 Q-500 800 100 820 Q550 840 1000 815 Q1500 795 2200 830 L2200 1400 L-1200 1400 Z');
      // mushroom
      g.rect(875, 700, 60, 138, 24);
      g.shape('M823 714 C823 566 987 566 987 714 Q905 738 823 714 Z');
      g.circle(857, 645, 16);
      g.circle(953, 645, 16);
      g.circle(905, 604, 13);
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
      g.clip(shell, () => g.line(shellPath(380, 565, 225, 1.2, 0.9)));
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
      { x: 130, y: 340, c: 6 },   // sky
      { x: 800, y: 185, c: 4 },   // flower centre
      { x: 713, y: 155, c: 5 },   // petals
      { x: 357, y: 546, c: 1 },   // left wing
      { x: 502, y: 546, c: 1 },   // right wing
      { x: 430, y: 212, c: 2 },   // head
      { x: 300, y: 850, c: 3 },   // leaf left
      { x: 719, y: 394, c: 3 },   // leaf upper right
      { x: 778, y: 526, c: 3 },   // leaf lower right
    ],
    draw(g) {
      g.cloud(170, 140, 120);
      // flower on a stem
      g.line('M800 250 Q790 320 812 380', g.lw * 1.3);
      bloom(g, 800, 185, 76);
      // leaf with its middle vein
      g.shape('M70 940 C40 680 260 420 600 360 C760 335 860 340 945 300 C935 440 870 600 740 720 C580 870 300 960 70 940 Z');
      g.line('M520 590 C640 500 780 410 942 302');
      // legs and antennae
      g.mirror(430, () => {
        g.line('M250 470 L180 430', g.lw * 1.3);
        g.line('M226 590 L150 600', g.lw * 1.3);
        g.line('M262 710 L196 770', g.lw * 1.3);
        g.line('M380 180 Q360 120 322 96');
        g.circle(316, 90, 24);
      });
      // head with big eyes
      g.ellipse(430, 302, 150, 136);
      g.mirror(430, () => {
        g.circle(384, 302, 32);
        g.dot(390, 309, 16, true);
      });
      // body: two wings with black dots
      g.circle(430, 575, 225);
      g.line('M430 352 L430 798');
      [[330, 450, 40], [270, 590, 38], [340, 720, 36], [530, 450, 40], [590, 590, 38], [520, 720, 36]].forEach((s) => g.dot(s[0], s[1], s[2]));
    },
  });
})();
