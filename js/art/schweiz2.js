/* Farbklecks – Ausmalbilder: Schweiz (Teil 2). Drawn with the helper documented in js/art/dsl.js. */
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

  // Mountain range: outline path `d`, snow caps given as polygons that are cut to the mountain.
  function alps(g, d, caps) {
    const m = g.shape(d);
    g.clip(m, () => caps.forEach((c) => g.shape(c)));
    g.draw(m, false);
    return m;
  }

  // Simple flying bird (two arcs).
  function bird(g, x, y, s) {
    g.line('M' + (x - s) + ' ' + y + ' Q' + (x - s * 0.5) + ' ' + (y - s * 0.6) + ' ' + x + ' ' + y +
      ' Q' + (x + s * 0.5) + ' ' + (y - s * 0.6) + ' ' + (x + s) + ' ' + y, g.lw * 0.8);
  }

  // Snowflake: three crossing strokes (open lines, they never close a region).
  function flake(g, x, y, s) {
    let d = '';
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI + Math.PI / 2;
      d += 'M' + (x + Math.cos(a) * s) + ' ' + (y + Math.sin(a) * s) + ' L' + (x - Math.cos(a) * s) + ' ' + (y - Math.sin(a) * s) + ' ';
    }
    g.line(d, g.lw * 0.7);
  }

  // Fir tree in three tiers (one region) on a trunk; top at (x, y), height h, half width w.
  function fir(g, x, y, h, w) {
    g.rect(x - w * 0.16, y + h * 0.9, w * 0.32, h * 0.22, 6);
    const t = (k) => y + h * k;
    return g.poly([
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

  // Flower with merged petals and a round middle (2 regions).
  function flower(g, x, y, r) {
    const c = [];
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * TAU - Math.PI / 2;
      c.push([x + Math.cos(a) * r * 0.62, y + Math.sin(a) * r * 0.62, r * 0.5]);
    }
    g.blob(c);
    g.circle(x, y, r * 0.45);
  }

  // Adds a pointed leaf to path p: stalk end at (x, y), length len, pointing in direction rot (0 = up).
  function leafTo(p, x, y, len, w, rot) {
    const c = Math.cos(rot), s = Math.sin(rot);
    const T = (u, v) => [x + u * c - v * s, y + u * s + v * c];
    const q = [[w, -len * 0.2], [w, -len * 0.75], [0, -len], [-w, -len * 0.75], [-w, -len * 0.2], [0, 0]].map((k) => T(k[0], k[1]));
    p.moveTo(x, y);
    p.bezierCurveTo(q[0][0], q[0][1], q[1][0], q[1][1], q[2][0], q[2][1]);
    p.bezierCurveTo(q[3][0], q[3][1], q[4][0], q[4][1], q[5][0], q[5][1]);
    p.closePath();
    return p;
  }

  // Several sub-paths merged into one outlined region (a plant with its leaves).
  function union(g, p) {
    g.ctx.strokeStyle = '#000';
    g.ctx.lineWidth = g.lw * 2;
    g.ctx.stroke(p);
    g.ctx.fillStyle = '#fff';
    g.ctx.fill(p);
    return p;
  }

  /* ---------- Bernhardiner ---------- */

  FK.art.add({
    id: 'bernhardiner',
    name: 'Bernhardiner',
    cat: 'schweiz',
    colors: ['braun', 'rot', 'gelb', 'gruen', 'hellblau', 'grau'],
    spots: [
      { x: 809, y: 91, c: 5 },    // sky
      { x: 105, y: 105, c: 3 },   // sun
      { x: 229, y: 594, c: 6 },   // mountain
      { x: 720, y: 596, c: 6 },   // mountain
      { x: 94, y: 664, c: 4 },    // fir
      { x: 880, y: 634, c: 4 },   // fir
      { x: 327, y: 345, c: 1 },   // head patch
      { x: 632, y: 347, c: 1 },   // head patch
      { x: 237, y: 432, c: 1 },   // ear
      { x: 720, y: 435, c: 1 },   // ear
      { x: 479, y: 497, c: 2 },   // tongue
      { x: 491, y: 584, c: 2 },   // collar
      { x: 479, y: 704, c: 1 },   // barrel
      { x: 333, y: 848, c: 1 },   // body
      { x: 626, y: 842, c: 1 },   // body
      { x: 248, y: 789, c: 1 },   // haunch
      { x: 710, y: 786, c: 1 },   // haunch
      { x: 810, y: 763, c: 1 },   // tail
    ],
    draw(g) {
      // sky, mountains with snow caps
      g.sun(105, 105, 50, 10);
      g.cloud(640, 95, 78);
      bird(g, 300, 92, 28);
      bird(g, 372, 128, 20);
      alps(g, 'M-1200 690 L-250 650 L170 250 L330 440 L470 330 L620 470 L790 230 L1250 690 L2200 690 Z', [
        'M80 320 L115 336 L145 312 L175 338 L205 315 L240 332 L240 200 L80 200 Z',
        'M720 300 L752 318 L785 295 L815 320 L848 298 L880 312 L880 180 L720 180 Z',
      ]);
      flake(g, 250, 205, 18);
      flake(g, 905, 150, 18);
      flake(g, 470, 105, 15);
      // snowy ground with fir trees
      ground(g, 690, 18);
      fir(g, 95, 470, 250, 72);
      fir(g, 880, 360, 360, 105);

      const cx = 480;
      // tail
      g.shape('M620 810 C712 822 772 780 782 712 C788 668 858 668 860 718 C866 830 760 900 640 895 Z');
      // haunches and back paws
      g.mirror(cx, () => g.ellipse(322, 798, 122, 102));
      g.mirror(cx, () => g.ellipse(266, 884, 80, 40));
      // body with brown sides and a white chest
      const body = g.shape('M300 892 C272 730 355 540 480 540 C605 540 688 730 660 892 Z');
      g.clip(body, () => g.mirror(cx, () => g.shape('M200 500 L392 500 C356 600 352 740 392 910 L200 910 Z')));
      // front legs and paws
      g.rect(396, 640, 86, 240, 38);
      g.rect(478, 640, 86, 240, 38);
      g.ellipse(436, 882, 66, 36);
      g.ellipse(524, 882, 66, 36);
      g.line('M416 868 L416 896 M456 868 L456 896 M504 868 L504 896 M544 868 L544 896', g.lw * 0.7);
      // red collar, ring and the little barrel with metal rims
      g.shape('M335 515 Q480 585 625 515 L642 572 Q480 668 318 572 Z');
      g.circle(480, 632, 15);
      g.shape('M410 668 Q480 642 550 668 L550 742 Q480 768 410 742 Z');
      g.shape('M396 658 Q410 654 424 658 Q432 705 424 752 Q410 756 396 752 Q388 705 396 658 Z');
      g.shape('M536 658 Q550 654 564 658 Q572 705 564 752 Q550 756 536 752 Q528 705 536 658 Z');
      // floppy ears
      g.mirror(cx, () => g.shape('M335 205 C255 195 198 252 190 342 C182 432 204 502 254 507 C300 512 318 462 312 410 C306 350 322 290 360 245 Z'));
      // head with brown patches and a white blaze
      const head = g.shape('M480 170 C615 170 690 255 690 360 C690 470 610 540 480 540 C350 540 270 470 270 360 C270 255 345 170 480 170 Z');
      g.clip(head, () => g.mirror(cx, () => g.shape('M240 140 L452 140 C440 210 446 280 452 330 C440 395 395 430 330 432 C290 432 260 420 240 400 Z')));
      // muzzle (jowls), tongue, nose and mouth
      g.blob([[426, 452, 70], [534, 452, 70], [480, 420, 58]]);
      g.shape('M448 466 C436 562 524 562 512 466 Z');
      ink(g, 'M448 388 Q480 372 512 388 Q510 414 480 422 Q450 414 448 388 Z');
      g.dot(466, 388, 6);
      g.line('M480 422 L480 448 M480 448 Q456 476 426 458 M480 448 Q504 476 534 458', g.lw * 0.8);
      // eyes and brows
      g.dot(405, 330, 24, true);
      g.dot(555, 330, 24, true);
      g.line('M372 282 Q402 264 432 280 M528 280 Q558 264 588 282', g.lw * 0.8);
    },
  });

  /* ---------- Murmeli ---------- */

  FK.art.add({
    id: 'murmeltier',
    name: 'Murmeli',
    cat: 'schweiz',
    colors: ['braun', 'pfirsich', 'gelb', 'gruen', 'hellblau', 'grau'],
    spots: [
      { x: 239, y: 245, c: 5 },   // sky
      { x: 109, y: 109, c: 3 },   // sun
      { x: 181, y: 529, c: 6 },   // mountain
      { x: 781, y: 439, c: 6 },   // mountain
      { x: 479, y: 228, c: 1 },   // head
      { x: 357, y: 178, c: 1 },   // ear
      { x: 602, y: 178, c: 1 },   // ear
      { x: 418, y: 343, c: 2 },   // muzzle
      { x: 336, y: 559, c: 1 },   // body
      { x: 389, y: 506, c: 1 },   // arm
      { x: 567, y: 508, c: 1 },   // arm
      { x: 441, y: 565, c: 1 },   // paw
      { x: 514, y: 567, c: 1 },   // paw
      { x: 479, y: 508, c: 2 },   // chest
      { x: 479, y: 676, c: 2 },   // belly
      { x: 726, y: 643, c: 1 },   // tail
      { x: 407, y: 769, c: 1 },   // foot
      { x: 552, y: 769, c: 1 },   // foot
      { x: 485, y: 875, c: 6 },   // rock
      { x: 777, y: 919, c: 6 },   // stone
      { x: 252, y: 714, c: 4 },   // meadow
      { x: 802, y: 679, c: 4 },   // meadow
      { x: 708, y: 973, c: 4 },   // meadow
      { x: 43, y: 790, c: 3 },    // flower
      { x: 111, y: 812, c: 1 },   // flower middle
      { x: 960, y: 930, c: 3 },   // flower
      { x: 901, y: 950, c: 1 },   // flower middle
      { x: 211, y: 947, c: 3 },   // daisy middle
      { x: 877, y: 798, c: 3 },   // daisy middle
    ],
    draw(g) {
      g.sun(110, 110, 52, 10);
      g.cloud(820, 105, 82);
      bird(g, 310, 105, 26);
      bird(g, 375, 140, 18);
      alps(g, 'M-1200 660 L-100 650 L190 330 L360 520 L760 190 L1150 600 L2200 660 Z', [
        'M110 385 L140 400 L170 380 L200 405 L230 382 L260 398 L260 250 L110 250 Z',
        'M630 275 L670 300 L710 270 L750 300 L790 272 L830 298 L870 275 L870 120 L630 120 Z',
      ]);
      ground(g, 640, 20);
      g.grass(70, 700, 12);
      g.grass(930, 690, 12);
      // rock
      g.shape('M245 935 C215 845 262 762 352 748 C430 738 555 738 632 748 C722 762 768 845 742 935 Q495 965 245 935 Z');
      g.line('M300 870 Q330 845 322 815 M680 880 Q650 860 664 830', g.lw * 0.7);
      g.ellipse(800, 920, 70, 42);

      const cx = 480;
      // tail
      g.shape('M600 690 C660 690 696 650 700 606 C704 560 770 562 768 618 C764 700 690 760 606 756 Z');
      // body with a light belly
      const body = g.shape('M480 380 C612 380 666 500 666 600 C666 712 600 772 480 772 C360 772 294 712 294 600 C294 500 348 380 480 380 Z');
      g.clip(body, () => g.ellipse(480, 615, 112, 140));
      // arms with the paws held at the chest
      g.mirror(cx, () => {
        g.ellipse(400, 516, 72, 34, 0.75);
        g.ellipse(446, 568, 42, 33, 0.25);
        g.line('M426 592 L422 608 M446 597 L444 613 M466 593 L466 609', g.lw * 0.7);
      });
      // feet
      g.mirror(cx, () => {
        g.ellipse(408, 770, 72, 34);
        g.line('M372 806 L368 820 M400 808 L398 822 M428 806 L428 820', g.lw * 0.7);
      });
      // ears
      g.mirror(cx, () => g.circle(364, 186, 46));
      // head
      g.ellipse(480, 300, 152, 124);
      // muzzle, buck teeth, nose, mouth, whiskers
      g.ellipse(480, 348, 94, 62);
      g.rect(461, 360, 19, 32, 6);
      g.rect(480, 360, 19, 32, 6);
      ink(g, 'M456 318 Q480 304 504 318 Q502 338 480 344 Q458 338 456 318 Z');
      g.dot(470, 318, 5);
      g.line('M480 344 L480 360 M480 356 Q460 366 446 354 M480 356 Q500 366 514 354', g.lw * 0.8);
      g.line('M388 334 L360 326 M390 360 L366 366 M572 334 L600 326 M570 360 L594 366', g.lw * 0.7);
      // eyes
      g.dot(428, 278, 21, true);
      g.dot(532, 278, 21, true);
      // alpine flowers
      flower(g, 112, 812, 88);
      flower(g, 212, 948, 78);
      flower(g, 878, 798, 84);
      flower(g, 902, 950, 76);
    },
  });

  /* ---------- Edelweiss ---------- */

  FK.art.add({
    id: 'edelweiss',
    name: 'Edelweiss',
    cat: 'schweiz',
    colors: ['gelb', 'gruen', 'grau', 'hellblau', 'orange'],
    spots: [
      { x: 622, y: 106, c: 4 },   // sky
      { x: 109, y: 87, c: 1 },    // sun
      { x: 804, y: 91, c: 5 },    // butterfly
      { x: 895, y: 109, c: 5 },   // butterfly
      { x: 793, y: 158, c: 5 },   // butterfly
      { x: 880, y: 178, c: 5 },   // butterfly
      { x: 140, y: 568, c: 3 },   // mountain
      { x: 865, y: 523, c: 3 },   // mountain
      { x: 498, y: 400, c: 1 },   // flower head
      { x: 521, y: 324, c: 1 },   // flower head
      { x: 435, y: 353, c: 1 },   // flower head
      { x: 579, y: 398, c: 1 },   // flower head
      { x: 436, y: 447, c: 1 },   // flower head
      { x: 523, y: 474, c: 1 },   // flower head
      { x: 441, y: 670, c: 2 },   // stem and leaves
      { x: 772, y: 761, c: 2 },   // meadow
      { x: 498, y: 912, c: 3 },   // rock
      { x: 205, y: 915, c: 3 },   // rock
      { x: 795, y: 918, c: 3 },   // rock
    ],
    draw(g) {
      g.sun(110, 110, 62, 10);
      face(g, 110, 122, 19, 8, 17, 17);
      g.cloud(330, 95, 70);
      alps(g, 'M-1200 680 L-80 670 L140 380 L300 560 L360 520 L850 300 L1250 680 L2200 680 Z', [
        'M80 450 L110 465 L140 445 L170 470 L200 450 L230 460 L230 300 L80 300 Z',
        'M740 370 L775 390 L810 362 L845 390 L880 362 L915 388 L950 370 L950 250 L740 250 Z',
      ]);
      ground(g, 670, 18);
      g.grass(80, 760, 12);
      g.grass(930, 770, 12);
      // rocks behind
      g.shape('M120 965 C100 905 140 858 205 856 C268 854 310 900 305 965 Q215 985 120 965 Z');
      g.shape('M700 965 C690 905 730 862 795 860 C860 860 895 905 885 965 Q790 985 700 965 Z');
      // big rock
      g.shape('M300 965 C272 885 318 805 418 795 L590 795 C682 805 724 885 702 965 Q500 990 300 965 Z');
      g.line('M362 900 Q392 878 380 848 M640 905 Q612 885 626 855', g.lw * 0.7);
      // stem and woolly leaves growing out of the rock (one region)
      const plant = new Path2D('M486 500 C484 620 482 720 480 830 L520 830 C518 720 516 620 514 500 Z');
      leafTo(plant, 516, 680, 170, 64, -1.45);
      leafTo(plant, 484, 705, 165, 62, 1.45);
      leafTo(plant, 490, 825, 170, 62, -1.45);
      leafTo(plant, 510, 825, 170, 62, 1.45);
      union(g, plant);
      // star of felt petals
      const cx = 500, cy = 400;
      const petal = (len, w) => 'M0 0 C' + w + ' ' + (-len * 0.15) + ' ' + w * 1.05 + ' ' + (-len * 0.6) + ' 0 ' + (-len) +
        ' C' + (-w * 1.05) + ' ' + (-len * 0.6) + ' ' + (-w) + ' ' + (-len * 0.15) + ' 0 0 Z';
      for (let i = 0; i < 5; i++) g.at(cx, cy, (i / 5) * TAU, 1, () => g.shape(petal(280, 72)));
      for (let i = 0; i < 5; i++) g.at(cx, cy, ((i + 0.5) / 5) * TAU, 1, () => g.shape(petal(225, 62)));
      // yellow flower heads in the middle
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * TAU - Math.PI / 2 + 0.3;
        g.circle(cx + Math.cos(a) * 72, cy + Math.sin(a) * 72, 41);
      }
      g.circle(cx, cy, 46);
      // butterfly
      g.at(845, 135, 0.2, 1.3, () => {
        g.ellipse(-40, -18, 46, 34, -0.5);
        g.ellipse(40, -18, 46, 34, 0.5);
        g.ellipse(-30, 28, 34, 26, 0.4);
        g.ellipse(30, 28, 34, 26, -0.4);
        g.ellipse(0, 6, 11, 40);
        g.line('M-4 -32 Q-14 -60 -28 -68 M4 -32 Q14 -60 28 -68', g.lw * 0.7);
      });
    },
  });
})();
