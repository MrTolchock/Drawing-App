/* Farbklecks – Ausmalbilder: Tiere (Teil 2). Drawn with the helper documented in js/art/dsl.js. */
(function () {
  'use strict';
  const FK = window.FK;
  const TAU = Math.PI * 2;

  /* ---------- local helpers ---------- */

  // Wavy ground that runs far beyond the box so wide screens show a continuous landscape.
  function ground(g, y, a) {
    return g.shape('M-1200 ' + y + ' Q-600 ' + (y - a) + ' 0 ' + y + ' Q250 ' + (y + a) + ' 500 ' + y +
      ' Q750 ' + (y - a) + ' 1000 ' + y + ' Q1600 ' + (y + a) + ' 2200 ' + y + ' L2200 1400 L-1200 1400 Z');
  }

  // Solid ink shape (noses): not colourable.
  function ink(g, d) {
    const p = typeof d === 'string' ? new Path2D(d) : d;
    g.ctx.fillStyle = '#000';
    g.ctx.fill(p);
    g.ctx.strokeStyle = '#000';
    g.ctx.lineWidth = g.lw;
    g.ctx.stroke(p);
    return p;
  }

  // Several sub-paths merged into one outlined region (bone, leaf tuft).
  function union(g, build) {
    const p = new Path2D();
    build(p);
    g.ctx.strokeStyle = '#000';
    g.ctx.lineWidth = g.lw * 2;
    g.ctx.stroke(p);
    g.ctx.fillStyle = '#fff';
    g.ctx.fill(p);
    return p;
  }

  function bez(p0, p1, p2, p3, t) {
    const u = 1 - t;
    return [
      u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
      u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
    ];
  }

  // A tube along a cubic curve, width w0 → w1, flat start, round end (trunk, water jet).
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

  // Pointed leaf with its stalk end at (x, y), pointing in direction rot (0 = up).
  function leaf(g, x, y, len, w, rot) {
    g.at(x, y, rot, 1, () => {
      g.shape('M0 0 C' + w + ' ' + (-len * 0.2) + ' ' + w + ' ' + (-len * 0.75) + ' 0 ' + (-len) +
        ' C' + (-w) + ' ' + (-len * 0.75) + ' ' + (-w) + ' ' + (-len * 0.2) + ' 0 0 Z');
      g.line('M0 0 L0 ' + (-len * 0.62), g.lw * 0.7);
    });
  }

  // Falling water drop, round at the bottom.
  function drop(g, x, y, s) {
    return g.shape('M' + x + ' ' + (y - s * 1.6) + ' C' + (x + s * 0.35) + ' ' + (y - s * 0.9) + ' ' + (x + s) + ' ' + (y - s * 0.5) +
      ' ' + (x + s) + ' ' + y + ' A' + s + ' ' + s + ' 0 0 1 ' + (x - s) + ' ' + y +
      ' C' + (x - s) + ' ' + (y - s * 0.5) + ' ' + (x - s * 0.35) + ' ' + (y - s * 0.9) + ' ' + x + ' ' + (y - s * 1.6) + ' Z');
  }

  // Arc of circle (cx, cy, r) from angle a to angle b, taking the way whose middle points towards `toward`.
  function arcToward(p, cx, cy, r, a, b, toward) {
    const cw = (b - a + TAU * 4) % TAU;
    const mid = a + cw / 2;
    p.arc(cx, cy, r, a, b, Math.cos(mid - toward) < 0);
  }

  // Crescent moon: circle (cx, cy, r) with a bite of circle (cx+dx, cy+dy, r2) taken out.
  function moon(g, cx, cy, r, dx, dy, r2) {
    const d = Math.hypot(dx, dy);
    const ux = dx / d, uy = dy / d;
    const a = (r * r - r2 * r2 + d * d) / (2 * d);
    const h = Math.sqrt(r * r - a * a);
    const px = cx + ux * a, py = cy + uy * a;
    const i1 = [px - uy * h, py + ux * h], i2 = [px + uy * h, py - ux * h];
    const phi = Math.atan2(dy, dx);
    const p = new Path2D();
    p.moveTo(i1[0], i1[1]);
    arcToward(p, cx, cy, r, Math.atan2(i1[1] - cy, i1[0] - cx), Math.atan2(i2[1] - cy, i2[0] - cx), phi + Math.PI);
    const c2x = cx + dx, c2y = cy + dy;
    arcToward(p, c2x, c2y, r2, Math.atan2(i2[1] - c2y, i2[0] - c2x), Math.atan2(i1[1] - c2y, i1[0] - c2x), phi + Math.PI);
    p.closePath();
    return g.draw(p);
  }

  /* ---------- Hund ---------- */

  FK.art.add({
    id: 'hund',
    name: 'Hund',
    cat: 'tiere',
    colors: ['orange', 'braun', 'rot', 'gelb', 'gruen', 'hellblau'],
    spots: [
      { x: 500, y: 110, c: 6 },
      { x: 130, y: 135, c: 4 },
      { x: 330, y: 930, c: 5 },
      { x: 150, y: 820, c: 3 },
      { x: 150, y: 875, c: 4 },
      { x: 830, y: 893, c: 2 },
      { x: 790, y: 700, c: 1 },
      { x: 290, y: 770, c: 1 },
      { x: 710, y: 770, c: 1 },
      { x: 500, y: 680, c: 1 },
      { x: 460, y: 780, c: 1 },
      { x: 540, y: 780, c: 1 },
      { x: 500, y: 590, c: 3 },
      { x: 500, y: 270, c: 1 },
      { x: 300, y: 400, c: 2 },
      { x: 700, y: 400, c: 2 },
      { x: 560, y: 310, c: 2 },
    ],
    draw(g) {
      g.sun(130, 135, 56, 10);
      g.cloud(800, 150, 140);
      ground(g, 815, 14);
      g.grass(330, 985, 14);
      g.grass(680, 980, 14);
      // ball with a stripe
      const ball = g.circle(150, 868, 80);
      g.clip(ball, () => {
        g.line('M50 868 Q150 828 250 868');
        g.line('M50 922 Q150 882 250 922');
      });
      // bone
      union(g, (p) => {
        [[752, 873], [752, 913], [908, 873], [908, 913]].forEach((c) => {
          p.moveTo(c[0] + 27, c[1]);
          p.arc(c[0], c[1], 27, 0, TAU);
        });
        p.rect(752, 875, 156, 36);
      });
      // wagging tail
      g.shape('M640 770 C710 760 770 715 780 630 C785 590 830 585 836 628 C845 730 760 812 660 822 Z');
      g.line('M858 560 Q880 590 872 625', g.lw * 0.8);
      g.line('M890 540 Q918 585 905 630', g.lw * 0.8);
      // back legs and paws
      g.mirror(500, () => {
        g.ellipse(360, 785, 100, 88);
        g.ellipse(305, 862, 72, 38);
      });
      // body
      g.shape('M335 870 C312 720 378 560 500 560 C622 560 688 720 665 870 Z');
      // front legs
      g.rect(420, 650, 82, 215, 36);
      g.rect(498, 650, 82, 215, 36);
      g.ellipse(458, 866, 62, 34);
      g.ellipse(542, 866, 62, 34);
      g.line('M440 850 L440 878 M476 850 L476 878 M524 850 L524 878 M560 850 L560 878', g.lw * 0.7);
      // collar and tag
      g.shape('M372 555 Q500 600 628 555 L640 600 Q500 652 360 600 Z');
      g.circle(500, 640, 30);
      // head
      g.shape('M500 200 C625 200 695 285 695 385 C695 490 615 565 500 565 C385 565 305 490 305 385 C305 285 375 200 500 200 Z');
      // eye patch
      g.ellipse(568, 345, 64, 60, 0.2);
      // floppy ears
      g.mirror(500, () => {
        g.shape('M395 222 C325 200 262 240 248 325 C234 410 254 495 296 515 C338 534 366 494 362 444 C358 394 382 330 418 284 C432 262 420 228 395 222 Z');
      });
      // eyes
      g.dot(432, 345, 27, true);
      g.dot(568, 345, 27, true);
      // muzzle, tongue, nose and mouth
      g.ellipse(500, 465, 92, 62);
      g.shape('M480 500 C474 552 526 552 520 500 Q500 512 480 500 Z');
      ink(g, 'M462 428 Q500 410 538 428 Q536 458 500 466 Q464 458 462 428 Z');
      g.dot(486, 428, 6);
      g.line('M500 466 L500 486 M500 486 Q478 508 452 490 M500 486 Q522 508 548 490', g.lw * 0.8);
      // butterfly
      g.at(840, 430, 0.15, 1, () => {
        g.ellipse(-38, -18, 40, 30, -0.5);
        g.ellipse(38, -18, 40, 30, 0.5);
        g.ellipse(-28, 26, 28, 22, 0.4);
        g.ellipse(28, 26, 28, 22, -0.4);
        g.ellipse(0, 4, 11, 40);
        g.line('M-4 -34 Q-14 -60 -28 -68 M4 -34 Q14 -60 28 -68', g.lw * 0.7);
      });
    },
  });

  /* ---------- Hase ---------- */

  FK.art.add({
    id: 'hase',
    name: 'Hase',
    cat: 'tiere',
    colors: ['grau', 'rosa', 'orange', 'gruen', 'hellblau', 'gelb'],
    spots: [
      { x: 230, y: 560, c: 5 },
      { x: 860, y: 140, c: 6 },
      { x: 500, y: 930, c: 4 },
      { x: 391, y: 88, c: 1 },
      { x: 609, y: 88, c: 1 },
      { x: 409, y: 192, c: 2 },
      { x: 591, y: 192, c: 2 },
      { x: 500, y: 315, c: 1 },
      { x: 500, y: 595, c: 1 },
      { x: 375, y: 845, c: 1 },
      { x: 625, y: 845, c: 1 },
      { x: 505, y: 690, c: 3 },
      { x: 670, y: 652, c: 4 },
    ],
    draw(g) {
      g.sun(860, 140, 55, 10);
      g.cloud(165, 150, 130);
      ground(g, 800, 14);
      // flowers in the meadow
      g.line('M110 975 L110 900', g.lw * 0.8);
      g.flower(110, 890, 36);
      g.line('M890 975 L890 900', g.lw * 0.8);
      g.flower(890, 890, 36);
      // ears
      [[415, 205, -0.2], [585, 205, 0.2]].forEach((e) => {
        g.at(e[0], e[1], e[2], 1, () => {
          g.ellipse(0, 0, 70, 165);
          g.ellipse(0, 30, 32, 106);
        });
      });
      // body and feet
      g.shape('M335 845 C300 700 360 525 500 525 C640 525 700 700 665 845 Z');
      g.ellipse(385, 842, 100, 48);
      g.ellipse(615, 842, 100, 48);
      g.line('M330 890 L336 866 M372 892 L374 866 M628 892 L626 866 M670 890 L664 866', g.lw * 0.7);
      // head
      g.ellipse(500, 395, 168, 140);
      g.dot(440, 372, 26, true);
      g.dot(560, 372, 26, true);
      g.ellipse(395, 445, 32, 20);
      g.ellipse(605, 445, 32, 20);
      g.rect(480, 474, 40, 36, 8);
      g.line('M500 474 L500 494', g.lw * 0.7);
      g.shape('M474 422 Q500 410 526 422 Q524 447 500 455 Q476 447 474 422 Z');
      g.line('M500 455 L500 472 M500 472 Q482 494 460 478 M500 472 Q518 494 540 478', g.lw * 0.8);
      // the Rüebli
      g.at(500, 690, 1.35, 1, () => {
        union(g, (p) => {
          p.ellipse(-30, -158, 22, 56, -0.4, 0, TAU);
          p.ellipse(0, -176, 22, 62, 0, 0, TAU);
          p.ellipse(30, -158, 22, 56, 0.4, 0, TAU);
        });
        const c = g.shape('M-50 -100 C-50 -125 50 -125 50 -100 C50 -20 20 80 0 150 C-20 80 -50 -20 -50 -100 Z');
        g.clip(c, () => {
          g.line('M-60 -50 L-16 -44 M60 0 L18 6 M-60 52 L-22 58', g.lw * 0.8);
        });
      });
      // paws holding it
      g.ellipse(420, 708, 40, 32);
      g.ellipse(592, 670, 40, 32);
    },
  });

  /* ---------- Eule ---------- */

  FK.art.add({
    id: 'eule',
    name: 'Eule',
    cat: 'tiere',
    colors: ['braun', 'orange', 'gelb', 'gruen', 'blau'],
    spots: [
      { x: 120, y: 580, c: 5 },
      { x: 815, y: 200, c: 3 },
      { x: 500, y: 235, c: 1 },
      { x: 320, y: 350, c: 3 },
      { x: 270, y: 590, c: 1 },
      { x: 730, y: 590, c: 1 },
      { x: 500, y: 540, c: 2 },
      { x: 840, y: 812, c: 1 },
      { x: 120, y: 690, c: 4 },
      { x: 230, y: 900, c: 4 },
      { x: 770, y: 905, c: 4 },
      { x: 900, y: 700, c: 4 },
    ],
    draw(g) {
      moon(g, 830, 175, 90, 45, -30, 80);
      g.star(110, 140, 46, 21);
      g.star(150, 400, 36, 16);
      g.star(880, 420, 40, 18);
      g.star(610, 75, 32, 14);
      // leaves, then the branch over their stalks
      leaf(g, 140, 780, 120, 46, -1.0);
      leaf(g, 230, 830, 115, 44, 3.0);
      leaf(g, 760, 830, 115, 44, -3.0);
      leaf(g, 880, 780, 120, 46, 0.9);
      g.shape('M-1200 765 Q-300 750 300 762 Q700 772 905 752 Q960 760 958 805 Q955 850 900 852 Q700 860 300 855 Q-300 850 -1200 870 Z');
      g.line('M600 790 Q650 800 700 792 M180 800 Q230 810 280 800', g.lw * 0.7);
      // body with ear tufts
      g.shape('M500 190 Q600 190 675 140 L725 92 Q752 200 742 300 C772 450 752 640 642 755 Q575 808 500 808 Q425 808 358 755 C248 640 228 450 258 300 Q248 200 275 92 L325 140 Q400 190 500 190 Z');
      // wings
      g.mirror(500, () => {
        g.shape('M300 420 C215 480 205 640 300 735 C350 660 362 520 300 420 Z');
        g.line('M262 600 Q285 640 300 680', g.lw * 0.7);
      });
      // belly with feather marks
      g.ellipse(500, 620, 125, 145);
      g.line('M435 640 Q455 662 475 640 M525 640 Q545 662 565 640 M480 705 Q500 727 520 705', g.lw * 0.7);
      // face disc, eyes, beak
      union(g, (p) => {
        p.moveTo(525, 350);
        p.arc(405, 350, 120, 0, TAU);
        p.moveTo(715, 350);
        p.arc(595, 350, 120, 0, TAU);
      });
      g.circle(420, 345, 58);
      g.circle(580, 345, 58);
      g.dot(430, 352, 30, true);
      g.dot(570, 352, 30, true);
      g.shape('M468 395 Q500 382 532 395 Q518 432 500 455 Q482 432 468 395 Z');
      // feet gripping the branch
      g.mirror(500, () => {
        g.shape('M405 790 Q400 822 420 826 Q434 828 440 812 Q446 830 462 826 Q478 820 470 790 Z');
      });
    },
  });

  /* ---------- Igel ---------- */

  FK.art.add({
    id: 'igel',
    name: 'Igel',
    cat: 'tiere',
    colors: ['braun', 'pfirsich', 'rot', 'gruen', 'orange', 'hellblau'],
    spots: [
      { x: 160, y: 400, c: 6 },
      { x: 140, y: 140, c: 5 },
      { x: 500, y: 935, c: 4 },
      { x: 420, y: 330, c: 3 },
      { x: 380, y: 600, c: 1 },
      { x: 700, y: 640, c: 2 },
    ],
    draw(g) {
      g.sun(140, 140, 52, 10);
      g.cloud(800, 140, 125);
      ground(g, 790, 12);
      // leaves on the ground and in the air
      leaf(g, 120, 930, 110, 46, 1.25);
      leaf(g, 560, 945, 110, 46, -1.35);
      leaf(g, 880, 930, 105, 44, 0.5);
      leaf(g, 650, 265, 95, 40, 0.9);
      leaf(g, 905, 430, 95, 40, -0.6);
      // apple on the spikes
      g.line('M420 262 Q414 232 432 206', g.lw * 0.9);
      leaf(g, 430, 214, 80, 32, 1.2);
      g.shape('M420 262 C385 228 325 240 328 310 C330 372 372 410 420 404 C468 410 510 372 512 310 C515 240 455 228 420 262 Z');
      // body with snout
      g.shape('M180 782 C140 640 220 470 420 450 C600 420 700 480 770 560 Q840 610 880 638 Q905 665 872 690 Q800 722 720 768 Q660 796 560 796 L230 796 Q192 796 180 782 Z');
      // spiky coat
      const cx = 430, cy = 640, rx = 290, ry = 255, n = 13;
      const a0 = -1.0, a1 = -Math.PI - 0.25;
      const p = new Path2D();
      p.moveTo(585, 796);
      p.quadraticCurveTo(665, 600, cx + rx * Math.cos(a0), cy + ry * Math.sin(a0));
      for (let k = 1; k <= n * 2; k++) {
        const a = a0 + ((a1 - a0) * k) / (n * 2);
        const f = k % 2 ? 1.2 : 1;
        p.lineTo(cx + rx * f * Math.cos(a), cy + ry * f * Math.sin(a));
      }
      p.lineTo(170, 796);
      p.closePath();
      g.draw(p);
      [[300, 520], [470, 470], [235, 650], [520, 700], [360, 735]].forEach((q) => {
        g.line('M' + (q[0] - 20) + ' ' + (q[1] + 13) + ' L' + q[0] + ' ' + (q[1] - 13) + ' L' + (q[0] + 20) + ' ' + (q[1] + 13), g.lw * 0.7);
      });
      // ear, face
      g.circle(612, 470, 32);
      g.dot(735, 585, 20, true);
      g.ellipse(765, 645, 26, 17);
      ink(g, 'M885 632 m-24 0 a24 24 0 1 0 48 0 a24 24 0 1 0 -48 0 Z');
      g.line('M828 676 Q846 688 862 674', g.lw * 0.8);
      // feet
      g.ellipse(265, 798, 58, 28);
      g.ellipse(645, 800, 58, 28);
    },
  });

  /* ---------- Elefant ---------- */

  FK.art.add({
    id: 'elefant',
    name: 'Elefant',
    cat: 'tiere',
    colors: ['grau', 'blau', 'hellblau', 'gruen', 'gelb'],
    spots: [
      { x: 760, y: 260, c: 3 },
      { x: 870, y: 130, c: 5 },
      { x: 500, y: 960, c: 4 },
      { x: 500, y: 880, c: 2 },
      { x: 600, y: 520, c: 1 },
      { x: 330, y: 330, c: 1 },
      { x: 480, y: 470, c: 1 },
      { x: 100, y: 400, c: 1 },
      { x: 300, y: 60, c: 2 },
      { x: 446, y: 780, c: 1 },
      { x: 706, y: 780, c: 1 },
      { x: 525, y: 770, c: 1 },
      { x: 800, y: 770, c: 1 },
    ],
    draw(g) {
      g.sun(870, 130, 58, 10);
      ground(g, 770, 12);
      g.ellipse(520, 880, 410, 70);
      g.line('M190 905 Q215 890 240 905 M760 915 Q785 900 810 915', g.lw * 0.7);
      // tail
      g.line('M840 600 Q885 625 893 678', g.lw * 0.9);
      g.ellipse(896, 700, 18, 28);
      // far legs, body, near legs
      g.rect(490, 640, 78, 200, 34);
      g.rect(762, 640, 76, 195, 34);
      g.ellipse(610, 560, 250, 175);
      g.rect(400, 650, 92, 215, 40);
      g.rect(660, 650, 92, 215, 40);
      [400, 660].forEach((x) => {
        g.line('M' + (x + 10) + ' 865 Q' + (x + 28) + ' 832 ' + (x + 46) + ' 865 M' + (x + 46) + ' 865 Q' + (x + 64) + ' 832 ' + (x + 82) + ' 865', g.lw * 0.8);
      });
      // water jet, trunk, head
      g.draw(tube([165, 240], [195, 120], [330, 50], [450, 92], 44, 64));
      g.draw(tube([250, 480], [120, 490], [90, 330], [160, 240], 100, 56));
      g.circle(330, 430, 150);
      // ear
      g.shape('M405 322 C490 292 572 352 562 455 C554 548 492 592 438 576 C405 566 396 528 408 498 C382 452 376 362 405 322 Z');
      g.line('M440 360 Q500 380 515 450 M450 520 Q480 530 505 512', g.lw * 0.7);
      // face
      g.dot(298, 405, 21, true);
      g.ellipse(335, 492, 30, 19);
      g.line('M238 528 Q262 562 302 550', g.lw * 0.8);
      g.line('M118 420 L150 412 M108 360 L140 358', g.lw * 0.7);
      // drops falling on its back
      drop(g, 520, 175, 22);
      drop(g, 600, 255, 22);
      drop(g, 680, 330, 20);
      drop(g, 470, 265, 18);
    },
  });

  /* ---------- Pinguin ---------- */

  FK.art.add({
    id: 'pinguin',
    name: 'Pinguin',
    cat: 'tiere',
    colors: ['blau', 'orange', 'rot', 'gelb', 'tuerkis', 'hellblau'],
    spots: [
      { x: 140, y: 400, c: 6 },
      { x: 140, y: 140, c: 4 },
      { x: 500, y: 960, c: 5 },
      { x: 500, y: 860, c: 6 },
      { x: 470, y: 215, c: 1 },
      { x: 320, y: 600, c: 1 },
      { x: 620, y: 600, c: 1 },
      { x: 470, y: 440, c: 3 },
      { x: 560, y: 545, c: 3 },
      { x: 215, y: 770, c: 4 },
      { x: 255, y: 540, c: 1 },
      { x: 730, y: 330, c: 1 },
    ],
    draw(g) {
      g.sun(140, 140, 55, 10);
      // iceberg and sea
      g.shape('M690 700 L752 525 L815 565 L880 420 L955 575 L1000 535 L1070 700 Z');
      g.shape('M-1200 690 L2200 690 L2200 1400 L-1200 1400 Z');
      g.line('M60 930 Q95 910 130 930 M820 950 Q855 930 890 950 M900 760 Q930 742 960 760', g.lw * 0.7);
      // ice floe
      g.shape('M80 770 L96 850 Q500 935 904 850 L920 770 Z');
      g.ellipse(500, 770, 420, 48);
      // penguin body
      g.shape('M470 170 C590 170 650 300 660 450 C675 620 630 765 470 778 C310 765 265 620 280 450 C290 300 350 170 470 170 Z');
      g.shape('M470 290 C505 245 590 255 590 330 C590 375 565 395 580 450 C615 560 600 735 470 748 C340 735 325 560 360 450 C375 395 350 375 350 330 C350 255 435 245 470 290 Z');
      // flippers
      g.shape('M300 400 C228 460 200 580 232 662 C280 622 308 522 306 440 Z');
      g.shape('M642 420 C700 380 760 312 792 250 C808 300 772 390 655 478 Z');
      g.line('M820 220 Q840 240 836 268 M850 200 Q874 228 868 262', g.lw * 0.7);
      // scarf
      g.shape('M548 470 L598 610 L540 622 L512 484 Z');
      g.line('M552 618 L556 646 M572 614 L578 642', g.lw * 0.7);
      g.shape('M298 405 Q470 468 642 405 L652 458 Q470 528 288 458 Z');
      // face
      g.dot(425, 325, 22, true);
      g.dot(515, 325, 22, true);
      g.shape('M434 360 Q470 344 506 360 Q492 396 470 406 Q448 396 434 360 Z');
      // feet
      g.ellipse(410, 778, 58, 24);
      g.ellipse(530, 778, 58, 24);
      // fish on the ice
      g.poly([[150, 768], [100, 735], [100, 800]]);
      g.ellipse(220, 768, 80, 34);
      g.dot(270, 760, 9);
      g.line('M235 742 Q220 768 235 794', g.lw * 0.7);
    },
  });
})();
