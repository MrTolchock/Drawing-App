/* Farbklecks – Ausmalbilder.
   Every picture is drawn back to front in a 1000×1000 box: shapes get a white fill and a black
   outline, so nearer shapes hide the lines behind them. The result is turned into transparent
   "ink" so the child's paint shows through and the fill bucket stops at the lines. */
(function () {
  'use strict';
  const FK = (window.FK = window.FK || {});
  const TAU = Math.PI * 2;

  function roundRectPath(p, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    p.moveTo(x + r, y);
    p.arcTo(x + w, y, x + w, y + h, r);
    p.arcTo(x + w, y + h, x, y + h, r);
    p.arcTo(x, y + h, x, y, r);
    p.arcTo(x, y, x + w, y, r);
    p.closePath();
  }

  function helper(ctx, lw) {
    const P = (d) => (typeof d === 'string' ? new Path2D(d) : d);
    const g = {
      lw,
      ctx,
      draw(path, fill) {
        if (fill !== false) {
          ctx.fillStyle = '#fff';
          ctx.fill(path);
        }
        ctx.strokeStyle = '#000';
        ctx.lineWidth = g.lw;
        ctx.stroke(path);
        return path;
      },
      shape(d) { return g.draw(P(d)); },
      line(d, w) {
        ctx.strokeStyle = '#000';
        ctx.lineWidth = w || g.lw;
        ctx.stroke(P(d));
      },
      circle(x, y, r) {
        const p = new Path2D();
        p.arc(x, y, r, 0, TAU);
        return g.draw(p);
      },
      ellipse(x, y, rx, ry, rot) {
        const p = new Path2D();
        p.ellipse(x, y, rx, ry, rot || 0, 0, TAU);
        return g.draw(p);
      },
      rect(x, y, w, h, r) {
        const p = new Path2D();
        roundRectPath(p, x, y, w, h, r || 0);
        return g.draw(p);
      },
      poly(pts) {
        const p = new Path2D();
        pts.forEach((q, i) => (i ? p.lineTo(q[0], q[1]) : p.moveTo(q[0], q[1])));
        p.closePath();
        return g.draw(p);
      },
      star(x, y, R, r, n, rot) {
        n = n || 5;
        rot = rot === undefined ? -Math.PI / 2 : rot;
        const p = new Path2D();
        for (let i = 0; i < n * 2; i++) {
          const a = rot + (i * Math.PI) / n;
          const rr = i % 2 ? r : R;
          i ? p.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) : p.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
        }
        p.closePath();
        return g.draw(p);
      },
      heart(x, y, s) {
        const p = new Path2D(
          'M' + x + ' ' + (y + s * 0.95) +
          ' C' + (x - s * 0.35) + ' ' + (y + s * 0.62) + ' ' + (x - s * 1.15) + ' ' + (y + s * 0.2) + ' ' + (x - s * 1.05) + ' ' + (y - s * 0.38) +
          ' C' + (x - s * 0.95) + ' ' + (y - s * 0.98) + ' ' + (x - s * 0.2) + ' ' + (y - s * 1.08) + ' ' + x + ' ' + (y - s * 0.5) +
          ' C' + (x + s * 0.2) + ' ' + (y - s * 1.08) + ' ' + (x + s * 0.95) + ' ' + (y - s * 0.98) + ' ' + (x + s * 1.05) + ' ' + (y - s * 0.38) +
          ' C' + (x + s * 1.15) + ' ' + (y + s * 0.2) + ' ' + (x + s * 0.35) + ' ' + (y + s * 0.62) + ' ' + x + ' ' + (y + s * 0.95) + ' Z');
        return g.draw(p);
      },
      // Ink-filled dot (pupils, nostrils) with an optional white shine.
      dot(x, y, r, shine) {
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, TAU);
        ctx.fill();
        if (shine) {
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.arc(x - r * 0.35, y - r * 0.35, r * 0.32, 0, TAU);
          ctx.fill();
        }
      },
      // Several circles merged into one outline (clouds, tree tops, smoke).
      blob(circles) {
        const p = new Path2D();
        circles.forEach((c) => {
          p.moveTo(c[0] + c[2], c[1]);
          p.arc(c[0], c[1], c[2], 0, TAU);
        });
        ctx.strokeStyle = '#000';
        ctx.lineWidth = g.lw * 2;
        ctx.stroke(p);
        ctx.fillStyle = '#fff';
        ctx.fill(p);
        return p;
      },
      clip(path, fn) {
        ctx.save();
        ctx.clip(path);
        fn();
        ctx.restore();
      },
      mirror(cx, fn) {
        fn();
        ctx.save();
        ctx.translate(cx * 2, 0);
        ctx.scale(-1, 1);
        fn();
        ctx.restore();
      },
      flower(x, y, r) {
        for (let i = 0; i < 5; i++) {
          const a = (i / 5) * TAU - Math.PI / 2;
          g.circle(x + Math.cos(a) * r, y + Math.sin(a) * r, r * 0.72);
        }
        g.circle(x, y, r * 0.6);
      },
      grass(x, y, s) {
        g.line('M' + (x - s) + ' ' + y + ' Q' + (x - s * 0.8) + ' ' + (y - s * 1.2) + ' ' + (x - s * 1.3) + ' ' + (y - s * 2));
        g.line('M' + x + ' ' + y + ' Q' + (x + s * 0.1) + ' ' + (y - s * 1.5) + ' ' + (x - s * 0.1) + ' ' + (y - s * 2.6));
        g.line('M' + (x + s) + ' ' + y + ' Q' + (x + s * 0.9) + ' ' + (y - s * 1.2) + ' ' + (x + s * 1.4) + ' ' + (y - s * 1.9));
      },
    };
    return g;
  }

  /* ---------- the pictures ---------- */

  const PAGES = [];
  const add = (id, name, draw) => PAGES.push({ id, name, draw });

  add('katze', 'Katze', (g) => {
    g.ellipse(500, 905, 360, 55);
    g.shape('M640 870 C800 880 900 790 870 640 C855 565 790 560 790 615 C790 650 820 680 812 730 C800 800 730 820 640 812 Z');
    g.shape('M300 890 C270 700 350 520 500 520 C650 520 730 700 700 890 Z');
    g.ellipse(500, 730, 105, 125);
    g.ellipse(415, 880, 72, 42);
    g.ellipse(585, 880, 72, 42);
    g.line('M395 870 L395 905 M435 870 L435 905 M565 870 L565 905 M605 870 L605 905', g.lw * 0.8);
    g.poly([[315, 335], [330, 130], [480, 245]]);
    g.poly([[685, 335], [670, 130], [520, 245]]);
    g.poly([[345, 290], [352, 190], [430, 250]]);
    g.poly([[655, 290], [648, 190], [570, 250]]);
    g.ellipse(500, 395, 215, 185);
    g.ellipse(425, 375, 42, 52);
    g.ellipse(575, 375, 42, 52);
    g.dot(432, 385, 24, true);
    g.dot(582, 385, 24, true);
    g.shape('M470 440 L530 440 L500 475 Z');
    g.line('M500 475 Q500 510 462 515 M500 475 Q500 510 538 515');
    g.line('M410 455 L265 430 M410 478 L262 492 M590 455 L735 430 M590 478 L738 492', g.lw * 0.8);
    g.shape('M375 560 Q500 610 625 560 L630 590 Q500 645 370 590 Z');
    g.circle(500, 625, 36);
    g.line('M470 625 L530 625', g.lw * 0.8);
  });

  add('teddy', 'Teddybär', (g) => {
    g.circle(310, 215, 92);
    g.circle(690, 215, 92);
    g.circle(310, 215, 48);
    g.circle(690, 215, 48);
    g.ellipse(255, 610, 78, 135, 0.55);
    g.ellipse(745, 610, 78, 135, -0.55);
    g.ellipse(360, 860, 105, 90);
    g.ellipse(640, 860, 105, 90);
    g.ellipse(360, 880, 55, 45);
    g.ellipse(640, 880, 55, 45);
    g.ellipse(500, 660, 215, 235);
    g.ellipse(500, 700, 128, 145);
    g.heart(500, 700, 62);
    g.circle(500, 365, 215);
    g.ellipse(500, 455, 98, 76);
    g.ellipse(500, 418, 40, 28);
    g.dot(425, 335, 22, true);
    g.dot(575, 335, 22, true);
    g.line('M500 446 L500 480 M500 480 Q470 510 440 488 M500 480 Q530 510 560 488');
    g.ellipse(395, 405, 30, 18);
    g.ellipse(605, 405, 30, 18);
  });

  add('haus', 'Haus', (g) => {
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
  });

  add('fisch', 'Fisch', (g) => {
    g.shape('M-1200 870 Q-500 830 0 860 Q300 885 600 850 Q900 820 1300 860 Q1700 890 2200 850 L2200 1400 L-1200 1400 Z');
    g.shape('M120 1000 C80 900 175 850 130 750 C95 670 150 640 140 590 C195 640 175 700 195 760 C225 850 160 900 190 1000 Z');
    g.shape('M860 1000 C820 920 905 870 865 790 C835 730 880 700 875 650 C925 700 905 755 925 805 C950 880 890 930 915 1000 Z');
    g.star(700, 920, 55, 25, 5, -1.2);
    g.shape('M810 500 L960 360 Q925 500 960 640 Z');
    g.shape('M440 330 Q520 170 700 300 Z');
    g.shape('M500 660 Q560 760 650 690 Z');
    const body = g.shape('M180 500 C270 300 690 270 840 500 C690 730 270 700 180 500 Z');
    g.clip(body, () => {
      g.line('M600 280 Q560 500 600 720');
      g.line('M700 300 Q665 500 700 700');
    });
    g.shape('M470 520 Q560 555 545 615 Q480 600 450 545 Z');
    g.circle(300, 460, 46);
    g.dot(308, 468, 22, true);
    g.line('M195 530 Q225 545 250 525');
    g.circle(120, 350, 26);
    g.circle(85, 270, 18);
    g.circle(125, 200, 12);
    g.circle(850, 170, 30);
    g.circle(900, 100, 18);
  });

  add('schmetterling', 'Schmetterling', (g) => {
    g.mirror(500, () => {
      g.shape('M490 460 C390 200 140 90 95 270 C60 430 280 520 490 505 Z');
      g.shape('M490 520 C300 520 140 640 205 790 C270 920 450 780 495 610 Z');
      g.circle(270, 330, 62);
      g.circle(370, 420, 30);
      g.circle(170, 230, 28);
      g.circle(320, 700, 48);
      g.circle(230, 780, 24);
      g.line('M555 270 Q600 150 660 120');
      g.circle(668, 116, 20);
    });
    g.ellipse(500, 560, 34, 210);
    g.line('M470 470 Q500 485 530 470 M468 560 Q500 575 532 560 M472 650 Q500 665 528 650', g.lw * 0.8);
    g.circle(500, 315, 58);
    g.dot(480, 305, 9);
    g.dot(520, 305, 9);
    g.line('M478 335 Q500 352 522 335', g.lw * 0.8);
  });

  add('blume', 'Blume', (g) => {
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
  });

  add('rakete', 'Rakete', (g) => {
    [[110, 120, 34], [880, 520, 30], [180, 560, 26], [300, 860, 30], [860, 860, 36], [640, 120, 24]].forEach((s) =>
      g.star(s[0], s[1], s[2], s[2] * 0.45));
    // planet with ring
    const ctx = g.ctx;
    ctx.save();
    ctx.translate(790, 230);
    ctx.rotate(-0.35);
    const ring = new Path2D();
    ring.ellipse(0, 0, 175, 48, 0, 0, TAU);
    ring.ellipse(0, 0, 128, 26, 0, 0, TAU);
    ctx.fillStyle = '#fff';
    ctx.fill(ring, 'evenodd');
    ctx.strokeStyle = '#000';
    ctx.lineWidth = g.lw;
    ctx.stroke(ring);
    g.circle(0, 0, 100);
    ctx.save();
    const front = new Path2D();
    front.rect(-200, 0, 400, 80);
    ctx.clip(front);
    ctx.fillStyle = '#fff';
    ctx.fill(ring, 'evenodd');
    ctx.stroke(ring);
    ctx.restore();
    g.line('M-60 -45 Q-30 -60 0 -55');
    ctx.restore();
    // rocket
    ctx.save();
    ctx.translate(430, 560);
    ctx.rotate(0.45);
    g.shape('M-55 225 Q-80 330 0 400 Q80 330 55 225 Z');
    g.shape('M-28 225 Q-40 290 0 335 Q40 290 28 225 Z');
    g.shape('M-95 60 L-185 230 L-90 200 Z');
    g.shape('M95 60 L185 230 L90 200 Z');
    g.rect(-70, 195, 140, 40, 10);
    const body = g.shape('M0 -330 C120 -210 125 0 95 215 L-95 215 C-125 0 -120 -210 0 -330 Z');
    g.clip(body, () => {
      g.line('M-130 -170 Q0 -120 130 -170');
      g.line('M-130 150 Q0 185 130 150');
    });
    g.circle(0, -40, 66);
    g.circle(0, -40, 42);
    ctx.restore();
  });

  add('kuh', 'Kuh', (g) => {
    g.circle(860, 130, 60);
    g.shape('M-1200 620 L-200 520 L60 300 L170 400 L330 140 L470 340 L560 270 L760 470 L880 390 L1080 560 L2200 620 L2200 1400 L-1200 1400 Z');
    g.shape('M276 228 L330 140 L390 226 L360 212 L335 240 L310 210 Z');
    g.shape('M20 335 L60 300 L105 340 L80 335 L62 352 L40 332 Z');
    g.shape('M-1200 700 Q-400 640 200 660 Q600 680 900 640 Q1500 600 2200 660 L2200 1400 L-1200 1400 Z');
    // Swiss flag on the hill
    g.line('M900 660 L900 470');
    g.rect(900, 470, 95, 80, 4);
    g.shape('M935 485 L960 485 L960 498 L973 498 L973 523 L960 523 L960 536 L935 536 L935 523 L922 523 L922 498 L935 498 Z');
    // cow
    g.rect(735, 600, 26, 120, 13);
    g.line('M748 718 Q770 760 760 790');
    g.blob([[760, 800, 18], [745, 812, 14], [774, 815, 14]]);
    g.rect(345, 700, 56, 175, 22);
    g.rect(430, 710, 56, 175, 22);
    g.rect(610, 710, 56, 175, 22);
    g.rect(690, 700, 56, 175, 22);
    g.rect(345, 840, 56, 40, 12);
    g.rect(430, 850, 56, 40, 12);
    g.rect(610, 850, 56, 40, 12);
    g.rect(690, 840, 56, 40, 12);
    const body = g.rect(330, 540, 430, 240, 110);
    g.clip(body, () => {
      g.shape('M560 540 C600 600 690 590 700 530 Z');
      g.shape('M470 780 C450 700 540 660 590 720 C620 760 600 790 590 800 Z');
      g.shape('M330 600 C390 620 400 700 330 720 Z');
    });
    g.ellipse(560, 790, 52, 32);
    g.line('M538 815 L536 835 M582 815 L584 835', g.lw * 0.8);
    g.shape('M210 420 C175 360 205 330 235 350 C230 375 240 395 255 412 Z');
    g.shape('M370 420 C405 360 375 330 345 350 C350 375 340 395 325 412 Z');
    g.ellipse(195, 470, 52, 26, 0.35);
    g.ellipse(385, 470, 52, 26, -0.35);
    g.ellipse(290, 500, 115, 120);
    g.shape('M250 400 C270 370 310 370 330 400 C320 430 260 430 250 400 Z');
    g.ellipse(290, 600, 105, 66);
    g.dot(250, 600, 12);
    g.dot(330, 600, 12);
    g.line('M262 635 Q290 650 318 635', g.lw * 0.8);
    g.dot(245, 485, 18, true);
    g.dot(335, 485, 18, true);
    // bell
    g.shape('M215 650 Q290 690 365 650 L370 672 Q290 712 210 672 Z');
    g.shape('M255 690 L325 690 L345 775 Q290 790 235 775 Z');
    g.circle(290, 790, 16);
    g.flower(80, 860, 24);
    g.flower(900, 900, 24);
    g.grass(180, 960, 14);
    g.grass(840, 760, 14);
  });

  add('schnecke', 'Schnecke', (g) => {
    g.shape('M-1200 850 Q-500 820 200 840 Q600 855 1000 830 Q1500 810 2200 850 L2200 1400 L-1200 1400 Z');
    g.rect(735, 650, 70, 200, 20);
    g.shape('M640 670 C640 520 900 520 900 670 Q770 700 640 670 Z');
    g.circle(720, 600, 22);
    g.circle(820, 590, 18);
    g.circle(770, 640, 14);
    g.line('M560 640 Q545 520 520 470 M600 645 Q615 525 640 480');
    g.circle(518, 462, 20);
    g.circle(642, 472, 20);
    g.shape('M120 840 C110 790 160 770 220 770 L520 770 C570 770 580 720 575 680 C570 620 610 600 640 640 C670 690 640 790 590 840 Z');
    g.dot(612, 680, 11, true);
    g.line('M585 735 Q605 750 625 730', g.lw * 0.8);
    g.circle(350, 590, 205);
    const ctx = g.ctx;
    const sp = new Path2D();
    for (let i = 0; i <= 160; i++) {
      const a = i * 0.11;
      const r = 12 + i * 1.12;
      const x = 350 + Math.cos(a + 2.4) * r;
      const y = 590 + Math.sin(a + 2.4) * r;
      i ? sp.lineTo(x, y) : sp.moveTo(x, y);
    }
    ctx.strokeStyle = '#000';
    ctx.lineWidth = g.lw;
    ctx.stroke(sp);
    g.grass(80, 960, 16);
    g.grass(470, 950, 16);
    g.grass(900, 960, 16);
  });

  add('glace', 'Glace', (g) => {
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
  });

  add('zug', 'Zug', (g) => {
    g.blob([[300, 140, 40], [360, 110, 50], [430, 120, 40]]);
    g.blob([[200, 230, 36], [250, 200, 42]]);
    g.line('M-1200 905 L2200 905');
    g.line('M-1200 945 L2200 945');
    for (let x = -1180; x < 2200; x += 90) g.rect(x, 900, 40, 50, 6);
    g.rect(330, 300, 80, 110, 8);
    g.rect(310, 280, 120, 40, 10);
    g.rect(270, 420, 400, 260, 30);
    g.circle(270, 550, 60);
    g.circle(270, 550, 25);
    g.rect(620, 300, 300, 400, 20);
    g.rect(600, 270, 340, 50, 16);
    g.rect(670, 360, 90, 110, 12);
    g.rect(790, 360, 90, 110, 12);
    g.rect(730, 520, 110, 110, 6);
    g.shape('M765 540 L805 540 L805 565 L830 565 L830 585 L805 585 L805 610 L765 610 L765 585 L740 585 L740 565 L765 565 Z');
    g.poly([[170, 700], [250, 620], [250, 760], [150, 760]]);
    g.rect(150, 680, 820, 70, 20);
    [[330, 790, 95], [560, 790, 95], [810, 790, 95]].forEach((w) => {
      g.circle(w[0], w[1], w[2]);
      g.circle(w[0], w[1], w[2] * 0.35);
    });
    g.line('M330 790 L560 790 L810 790', g.lw * 1.3);
  });

  add('dino', 'Dino', (g) => {
    g.shape('M-1200 880 Q-500 850 200 870 Q600 880 1000 860 Q1500 840 2200 870 L2200 1400 L-1200 1400 Z');
    g.circle(860, 140, 70);
    g.blob([[560, 160, 40], [620, 130, 52], [690, 160, 40]]);
    [[300, 520], [380, 470], [470, 450], [560, 470], [640, 520]].forEach((p, i) => {
      g.poly([[p[0] - 42, p[1] + 30], [p[0] + (i - 2) * 6, p[1] - 70], [p[0] + 42, p[1] + 30]]);
    });
    g.rect(300, 700, 85, 180, 36);
    g.rect(560, 700, 85, 180, 36);
    g.shape('M640 640 C740 650 840 700 960 650 C930 760 800 780 640 760 Z');
    g.rect(380, 710, 85, 175, 36);
    g.rect(640, 700, 85, 185, 36);
    const body = g.shape('M240 700 C200 560 320 470 470 470 C600 470 680 520 700 610 C710 680 690 760 600 780 L330 780 C280 775 250 745 240 700 Z');
    g.clip(body, () => {
      g.circle(560, 560, 34);
      g.circle(620, 640, 24);
      g.circle(500, 650, 28);
    });
    g.shape('M300 560 C250 480 170 420 160 330 C150 250 210 210 260 260 C300 300 330 420 380 500 Z');
    g.ellipse(170, 250, 115, 82, -0.2);
    g.dot(150, 225, 17, true);
    g.line('M85 285 Q130 315 185 300', g.lw * 0.8);
    g.dot(80, 245, 6);
    g.ellipse(200, 290, 20, 12);
    g.shape('M800 870 C770 860 760 800 780 750 C800 700 860 700 880 750 C900 800 890 860 860 870 Z');
    g.line('M772 790 L800 775 L815 800 L840 778 L855 800 L888 785', g.lw * 0.8);
  });

  add('auto', 'Auto', (g) => {
    g.circle(150, 150, 70);
    g.blob([[700, 150, 45], [760, 120, 55], [830, 150, 45]]);
    g.shape('M-1200 760 L2200 760 L2200 1400 L-1200 1400 Z');
    g.line('M-1200 870 L-1100 870 M-950 870 L-850 870 M-700 870 L-600 870 M-450 870 L-350 870 M-200 870 L-100 870 M50 870 L150 870 M300 870 L400 870 M550 870 L650 870 M800 870 L900 870 M1050 870 L1150 870 M1300 870 L1400 870 M1550 870 L1650 870 M1800 870 L1900 870');
    g.shape('M300 470 L380 330 C400 300 420 290 460 290 L640 290 C680 290 700 300 720 330 L800 470 Z');
    g.shape('M350 470 L410 350 L540 350 L540 470 Z');
    g.shape('M570 470 L570 350 L690 350 L760 470 Z');
    g.rect(110, 460, 800, 210, 70);
    g.rect(130, 520, 70, 50, 20);
    g.rect(830, 520, 60, 40, 16);
    g.line('M550 480 L550 650');
    g.rect(470, 520, 50, 16, 8);
    g.rect(590, 520, 50, 16, 8);
    g.circle(290, 680, 95);
    g.circle(290, 680, 40);
    g.circle(720, 680, 95);
    g.circle(720, 680, 40);
  });

  add('mandala', 'Mandala', (g) => {
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
  });

  /* ---------- rendering ---------- */

  function find(id) { return PAGES.find((p) => p.id === id); }

  function drawArt(ctx, page, W, H, minLinePx) {
    const s = Math.min(W / 1000, H / 1000) * 0.94;
    ctx.save();
    ctx.setTransform(s, 0, 0, s, (W - 1000 * s) / 2, (H - 1000 * s) / 2);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const g = helper(ctx, Math.max(9, (minLinePx || 0) / s));
    page.draw(g);
    ctx.restore();
  }

  // Draws the outline layer. Returns the alpha channel (walls for the fill bucket) or null.
  function renderOutline(canvas, id, minLinePx, ink) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const page = find(id);
    if (!page) return null;
    drawArt(ctx, page, W, H, minLinePx);
    const img = ctx.getImageData(0, 0, W, H);
    const d = img.data;
    const alpha = new Uint8Array(W * H);
    const ir = ink[0], ig = ink[1], ib = ink[2];
    for (let i = 0, j = 0; j < alpha.length; i += 4, j++) {
      const a = d[i + 3];
      if (!a) continue;
      const lum = (d[i] + d[i + 1] + d[i + 2]) / 3;
      const na = Math.round((a * (255 - lum)) / 255);
      alpha[j] = na;
      d[i] = ir;
      d[i + 1] = ig;
      d[i + 2] = ib;
      d[i + 3] = na;
    }
    ctx.putImageData(img, 0, 0);
    return alpha;
  }

  function thumb(canvas, id) {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const page = find(id);
    if (page) drawArt(ctx, page, canvas.width, canvas.height, canvas.width / 160);
  }

  FK.pages = { list: PAGES, find, renderOutline, thumb };
})();
