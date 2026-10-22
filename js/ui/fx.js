/* Farbtupf – Effekte: Konfetti, Glitzer, fliegende Sterne. One fixed canvas above everything,
   which only has pixels while something flies (iOS counts every canvas against one small budget). */
(function () {
  'use strict';
  const FK = window.FK;
  const TAU = Math.PI * 2;
  const COLS = ['#e5322d', '#ff8a1f', '#ffd60a', '#8bd448', '#1cc6c6', '#2f5bea', '#8a4fe0', '#ff4fa3'];

  const FX = { c: null, g: null, parts: [], raf: 0, dpr: 1, last: 0 };

  function init() {
    FX.c = document.getElementById('cv-fx');
    if (!FX.c) {
      FX.c = FK.h('canvas', { id: 'cv-fx', class: 'fx', 'aria-hidden': 'true' });
      document.body.append(FX.c);
    }
    FX.g = FX.c.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
  }

  function resize() {
    if (!FX.c) return;
    if (!FX.raf) {
      FX.c.width = FX.c.height = 0;
      return;
    }
    FX.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.round(window.innerWidth * FX.dpr);
    const h = Math.round(window.innerHeight * FX.dpr);
    if (FX.c.width !== w) FX.c.width = w;
    if (FX.c.height !== h) FX.c.height = h;
  }

  function add(p) {
    if (FK.reduced || !FX.g) return;
    FX.parts.push(p);
    if (FX.parts.length > 500) FX.parts.splice(0, FX.parts.length - 500);
    if (!FX.raf) {
      FX.last = performance.now();
      FX.raf = requestAnimationFrame(loop);
      resize();
    }
  }

  function loop(now) {
    const dt = FK.clamp((now - FX.last) / 1000, 0, 0.05);
    FX.last = now;
    const g = FX.g;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, FX.c.width, FX.c.height);
    g.setTransform(FX.dpr, 0, 0, FX.dpr, 0, 0);
    FX.parts = FX.parts.filter((p) => {
      p.t += dt;
      if (p.t >= p.life) {
        if (p.done) p.done();
        return false;
      }
      p.draw(g, p.t / p.life, dt);
      return true;
    });
    FX.raf = FX.parts.length ? requestAnimationFrame(loop) : 0;
    if (!FX.raf) resize();
  }

  function sparkleShape(g, x, y, r, c) {
    g.fillStyle = c;
    g.beginPath();
    g.moveTo(x, y - r);
    g.quadraticCurveTo(x + r * 0.16, y - r * 0.16, x + r, y);
    g.quadraticCurveTo(x + r * 0.16, y + r * 0.16, x, y + r);
    g.quadraticCurveTo(x - r * 0.16, y + r * 0.16, x - r, y);
    g.quadraticCurveTo(x - r * 0.16, y - r * 0.16, x, y - r);
    g.fill();
  }

  function starShape(g, x, y, R, c, rot) {
    g.save();
    g.translate(x, y);
    g.rotate(rot || 0);
    g.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const r = i % 2 ? R * 0.48 : R;
      if (i) g.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      else g.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    g.closePath();
    g.fillStyle = c;
    g.strokeStyle = '#23203d';
    g.lineWidth = Math.max(2, R * 0.16);
    g.lineJoin = 'round';
    g.fill();
    g.stroke();
    g.restore();
  }

  function centerOf(target) {
    if (!target) return [window.innerWidth / 2, window.innerHeight / 2];
    if (target.getBoundingClientRect) {
      const r = target.getBoundingClientRect();
      return [r.left + r.width / 2, r.top + r.height / 2];
    }
    return [target.x, target.y];
  }

  FK.fx = {
    init,
    resize,
    sparkle: sparkleShape,
    twinkle(x, y, c) {
      add({
        t: 0, life: 0.55, rot: Math.random() * TAU, size: 6 + Math.random() * 8,
        draw(g, k) {
          const s = this.size * Math.sin(k * Math.PI);
          g.save();
          g.translate(x, y);
          g.rotate(this.rot + k * 2);
          g.globalAlpha = 1 - k * 0.6;
          sparkleShape(g, 0, 0, s, c || '#ffffff');
          g.restore();
        },
      });
    },
    burst(x, y, cols, n) {
      cols = cols || ['#ffc93c', '#ff4fa3', '#5bc0ff', '#8bd448', '#ffffff'];
      n = n || 8;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * TAU + Math.random() * 0.4;
        const v = 90 + Math.random() * 90;
        const c = cols[i % cols.length];
        add({
          t: 0, life: 0.55,
          draw(g, k) {
            const d = v * k * (1.6 - k);
            g.globalAlpha = 1 - k;
            sparkleShape(g, x + Math.cos(a) * d, y + Math.sin(a) * d, 8 * (1 - k * 0.5), c);
            g.globalAlpha = 1;
          },
        });
      }
    },
    ring(x, y, c) {
      add({
        t: 0, life: 0.45,
        draw(g, k) {
          g.globalAlpha = 1 - k;
          g.strokeStyle = c || '#ffffff';
          g.lineWidth = 6 * (1 - k) + 1;
          g.beginPath();
          g.arc(x, y, 10 + k * 60, 0, TAU);
          g.stroke();
          g.strokeStyle = '#23203d';
          g.lineWidth = 2;
          g.beginPath();
          g.arc(x, y, 14 + k * 64, 0, TAU);
          g.stroke();
          g.globalAlpha = 1;
        },
      });
    },
    confetti(amount) {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const n = amount || 150;
      for (let i = 0; i < n; i++) {
        const fromLeft = i % 2 === 0;
        const x0 = fromLeft ? -10 : W + 10;
        const y0 = H * (0.55 + Math.random() * 0.35);
        const ang = fromLeft ? -Math.PI / 2 + 0.25 + Math.random() * 0.7 : -Math.PI / 2 - 0.25 - Math.random() * 0.7;
        const v = (0.9 + Math.random() * 0.7) * Math.max(H, 500) * 1.1;
        const c = COLS[i % COLS.length];
        const w = 7 + Math.random() * 7;
        const h = 4 + Math.random() * 5;
        const spin = (Math.random() - 0.5) * 18;
        add({
          t: 0, life: 2.6 + Math.random() * 0.8, x: x0, y: y0, vx: Math.cos(ang) * v, vy: Math.sin(ang) * v, r: Math.random() * TAU,
          draw(g, k, dt) {
            this.vy += 1100 * dt;
            this.vx *= 1 - 1.2 * dt;
            this.vy *= 1 - 0.9 * dt;
            this.x += this.vx * dt;
            this.y += this.vy * dt;
            this.r += spin * dt;
            g.save();
            g.translate(this.x, this.y);
            g.rotate(this.r);
            g.scale(1, Math.cos(this.r * 1.7));
            g.globalAlpha = k > 0.8 ? (1 - k) * 5 : 1;
            g.fillStyle = c;
            g.fillRect(-w / 2, -h / 2, w, h);
            g.restore();
          },
        });
      }
    },
    // Fireworks bursts at a few random spots in the upper half.
    fireworks(count) {
      const W = window.innerWidth;
      const H = window.innerHeight;
      for (let b = 0; b < (count || 4); b++) {
        const cx = W * (0.2 + Math.random() * 0.6);
        const cy = H * (0.15 + Math.random() * 0.35);
        const delay = b * 0.25;
        const col = COLS[(Math.random() * COLS.length) | 0];
        for (let i = 0; i < 22; i++) {
          const a = (i / 22) * TAU;
          const v = 120 + Math.random() * 70;
          add({
            t: -delay, life: 1.1,
            draw(g, k) {
              if (k < 0) return;
              const d = v * Math.sqrt(k) * 1.2;
              g.globalAlpha = 1 - k;
              g.fillStyle = col;
              g.beginPath();
              g.arc(cx + Math.cos(a) * d, cy + Math.sin(a) * d + k * k * 40, 3.5 * (1 - k * 0.5), 0, TAU);
              g.fill();
              g.globalAlpha = 1;
            },
          });
        }
      }
    },
    // A star flies from `from` (element or {x,y}) to the visible star counter; returns a promise.
    starFly(from, count) {
      const target = FK.$$('.star-count').find((e) => e.offsetParent !== null);
      const [x0, y0] = centerOf(from);
      const [x1, y1] = centerOf(target);
      const n = Math.max(1, Math.min(count || 1, 5));
      if (FK.reduced || !FX.g) return Promise.resolve();
      return new Promise((resolve) => {
        let left = n;
        for (let i = 0; i < n; i++) {
          const delay = i * 0.18;
          const bend = (Math.random() - 0.5) * 300;
          add({
            t: -delay, life: 0.9,
            draw(g, k) {
              if (k < 0) return;
              const e = k * k * (3 - 2 * k);
              const mx = (x0 + x1) / 2 + bend;
              const my = Math.min(y0, y1) - 160;
              const u = 1 - e;
              const x = u * u * x0 + 2 * u * e * mx + e * e * x1;
              const y = u * u * y0 + 2 * u * e * my + e * e * y1;
              starShape(g, x, y, 22 - 8 * e, '#ffc93c', k * 6);
            },
            done() {
              FK.sound.twinkle();
              if (target) {
                target.classList.remove('bump');
                void target.offsetWidth;
                target.classList.add('bump');
              }
              if (--left === 0) resolve();
            },
          });
        }
      });
    },
  };
})();
