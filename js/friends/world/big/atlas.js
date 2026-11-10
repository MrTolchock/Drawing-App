/* The big world's plant atlas: the home atlas (4 × 4 cells, left half) plus new cells on the right
   half of a 2048 × 1024 canvas. One texture and one material still serve all ground plants,
   conifer boughs, water plants and the far ring. */
import {TAU, rng} from '../noise.js';

export const cell = (col, row, w = 1, h = 1) => [col / 8, 1 - (row + h) / 4, w / 8, h / 4];
export const ATLAS = {
  daisy: cell(0, 0), buttercup: cell(1, 0), bell: cell(2, 0), campion: cell(3, 0), clover: cell(0, 1), litter: cell(1, 1), fern: cell(2, 1), reeds: cell(3, 1),
  grass: cell(0, 2, 2, 1), crownA: cell(0, 3, 2, 1), crownB: cell(2, 3, 2, 1),
  poppy: cell(4, 0), cornflower: cell(5, 0), heather: cell(6, 0), lilypad: cell(7, 0), lily: cell(4, 1), cattail: cell(5, 1), bough: cell(6, 1),
  white: [7.4 / 8, 1 - 1.6 / 4, .2 / 8, .2 / 4], tallgrass: cell(4, 2, 2, 1), bush: cell(6, 2), sedge: cell(7, 2), spruceFar: cell(4, 3), birchFar: cell(5, 3), snagFar: cell(6, 3), yellowLeaves: cell(7, 3),
};

/** Draw the new cells (columns 4–7) onto the atlas canvas. */
export function drawBigCells(g) {
  const at = (col, row, fn, w = 1) => { g.save(); g.beginPath(); g.rect(col * 256 + 4, row * 256 + 4, 256 * w - 8, 248); g.clip(); g.translate(col * 256 + 128 * w, row * 256 + 128); fn(); g.restore(); };
  // poppy: four silky red petals round a dark heart
  at(4, 0, () => { g.scale(1.55, 1.55); for (let k = 0; k < 4; k++) { g.rotate(TAU / 4); const gr = g.createRadialGradient(0, -8, 4, 0, -30, 44); gr.addColorStop(0, '#b3201a'); gr.addColorStop(.6, '#e8402a'); gr.addColorStop(1, '#f2603c'); g.fillStyle = gr; g.beginPath(); g.moveTo(0, 0); g.bezierCurveTo(-46, -14, -40, -66, 0, -62); g.bezierCurveTo(40, -66, 46, -14, 0, 0); g.fill(); } g.fillStyle = '#2a1a1a'; g.beginPath(); g.arc(0, 0, 11, 0, TAU); g.fill(); g.fillStyle = '#e8d24a'; for (let k = 0; k < 10; k++) { g.beginPath(); g.arc(Math.cos(k * .63) * 15, Math.sin(k * .63) * 15, 2.4, 0, TAU); g.fill(); } });
  // cornflower: ragged blue rays
  at(5, 0, () => { g.scale(1.5, 1.5); for (let k = 0; k < 11; k++) { g.rotate(TAU / 11); g.fillStyle = k % 2 ? '#3f6fe0' : '#5a86ee'; g.beginPath(); g.moveTo(0, 0); g.lineTo(-11, -52); g.lineTo(-5, -44); g.lineTo(0, -60); g.lineTo(5, -44); g.lineTo(11, -52); g.closePath(); g.fill(); } g.fillStyle = '#5b3fb0'; g.beginPath(); g.arc(0, 0, 12, 0, TAU); g.fill(); });
  // heather: woody sprigs with pink bells
  at(6, 0, () => { const r = rng(61); g.translate(0, 122); for (let i = 0; i < 9; i++) { const x = -80 + i * 20 + r() * 8, hh = 150 + r() * 80, lean = (r() - .5) * 50; g.strokeStyle = '#5d6b34'; g.lineWidth = 4; g.beginPath(); g.moveTo(x, 0); g.quadraticCurveTo(x + lean * .4, -hh * .5, x + lean, -hh); g.stroke(); for (let k = 0; k < 16; k++) { const t = .3 + k / 16 * .7, px = x + lean * t * t + (r() - .5) * 12, py = -hh * t; g.fillStyle = r() < .5 ? '#c86aa8' : '#dd8cc0'; g.beginPath(); g.ellipse(px, py, 6, 8, 0, 0, TAU); g.fill(); } } });
  // lily pad: a round leaf with a notch and pale veins
  at(7, 0, () => { const gr = g.createRadialGradient(-20, -20, 10, 0, 0, 118); gr.addColorStop(0, '#7fb24a'); gr.addColorStop(1, '#3f7a34'); g.fillStyle = gr; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, 114, .22, TAU - .22); g.closePath(); g.fill(); g.strokeStyle = 'rgba(210,235,160,.5)'; g.lineWidth = 3; for (let k = 1; k < 11; k++) { const a = .22 + k * (TAU - .44) / 11; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(a) * 104, Math.sin(a) * 104); g.stroke(); } g.strokeStyle = 'rgba(40,80,30,.5)'; g.lineWidth = 4; g.beginPath(); g.arc(0, 0, 112, .22, TAU - .22); g.stroke(); });
  // water lily: white and rose petals round a golden centre
  at(4, 1, () => { g.scale(1.6, 1.6); for (const [n, len, c] of [[12, 66, '#f7d9e4'], [10, 50, '#ffffff'], [8, 34, '#fff3f6']]) for (let k = 0; k < n; k++) { g.save(); g.rotate(k * TAU / n + len); g.fillStyle = c; g.beginPath(); g.moveTo(0, 0); g.bezierCurveTo(-15, -len * .4, -9, -len * .9, 0, -len); g.bezierCurveTo(9, -len * .9, 15, -len * .4, 0, 0); g.fill(); g.strokeStyle = 'rgba(200,140,160,.35)'; g.lineWidth = 1; g.stroke(); g.restore(); } g.fillStyle = '#f0b830'; g.beginPath(); g.arc(0, 0, 12, 0, TAU); g.fill(); });
  // cattails: tall blades and brown spikes
  at(5, 1, () => { const r = rng(67); g.translate(0, 124); for (let i = 0; i < 12; i++) { const x = -78 + r() * 156, hh = 150 + r() * 92, lean = (r() - .5) * 50, gr = g.createLinearGradient(0, 0, 0, -hh); gr.addColorStop(0, '#3a5f2a'); gr.addColorStop(1, '#9db860'); g.fillStyle = gr; g.beginPath(); g.moveTo(x - 5, 0); g.quadraticCurveTo(x + lean * .3, -hh * .6, x + lean, -hh); g.quadraticCurveTo(x + lean * .3 + 3, -hh * .55, x + 5, 0); g.fill(); }
    for (const [x, y] of [[-46, -196], [-6, -224], [40, -186], [74, -150]]) { g.strokeStyle = '#5a6e34'; g.lineWidth = 4; g.beginPath(); g.moveTo(x, 0); g.lineTo(x, y + 30); g.stroke(); g.fillStyle = '#6a3e22'; g.beginPath(); g.roundRect(x - 8, y, 16, 46, 8); g.fill(); g.fillStyle = 'rgba(255,220,170,.25)'; g.fillRect(x - 5, y + 4, 4, 36); } });
  // spruce bough: a hanging branch with rows of dark needles, widest at the tip (bottom of the cell)
  at(6, 1, () => { const r = rng(71); g.translate(0, -122);
    const twig = (x0, y0, a, len, w) => { g.save(); g.translate(x0, y0); g.rotate(a); const gr = g.createLinearGradient(0, 0, 0, len); gr.addColorStop(0, '#1f4a2a'); gr.addColorStop(.7, '#2f6a38'); gr.addColorStop(1, '#5a9a4c'); g.fillStyle = gr; g.beginPath(); g.moveTo(0, 0); g.bezierCurveTo(w, len * .2, w * .9, len * .8, 0, len); g.bezierCurveTo(-w * .9, len * .8, -w, len * .2, 0, 0); g.fill(); g.restore(); };
    for (let i = 0; i < 44; i++) { const t = i / 44, y = 10 + t * 190, spread = 18 + t * 84; for (const s of [-1, 1]) twig(s * r() * spread * .25, y - 10, s * (.35 + r() * .75), 34 + r() * 30 + t * 14, 9 + r() * 5); }
    for (let i = 0; i < 9; i++) twig((r() - .5) * 40, 150 + r() * 40, (r() - .5) * .5, 46 + r() * 20, 12); });
  // an opaque white cell: terrain, trunks and water in the far ring take their colour from the vertices alone
  g.fillStyle = '#fff'; g.fillRect(7 * 256, 256, 256, 256);
  // tall meadow grass with seed heads (two cells wide)
  { g.save(); g.beginPath(); g.rect(4 * 256 + 4, 516, 504, 248); g.clip(); g.translate(4 * 256, 512); const r = rng(73), w = 512, h = 252;
    for (let i = 0; i < 90; i++) { const x = 16 + r() * (w - 32), hh = h * (.5 + r() * .48), lean = (r() - .5) * 70, bw = 2.6 + r() * 3.4, v = r();
      const gr = g.createLinearGradient(0, h, 0, h - hh); gr.addColorStop(0, '#7aa23c'); gr.addColorStop(.6, v < .5 ? '#a9c256' : '#bccb62'); gr.addColorStop(1, '#e6dd94');
      g.fillStyle = gr; g.beginPath(); g.moveTo(x - bw, h); g.quadraticCurveTo(x + lean * .3, h - hh * .6, x + lean, h - hh); g.quadraticCurveTo(x + lean * .3 + bw * .4, h - hh * .55, x + bw, h); g.fill();
      if (v > .55) { g.fillStyle = v > .8 ? '#d8c27a' : '#c9b46a'; for (let k = 0; k < 6; k++) { g.beginPath(); g.ellipse(x + lean + (k % 2 ? 4 : -4), h - hh + k * 7, 4, 7, (k % 2 ? .5 : -.5), 0, TAU); g.fill(); } } }
    g.restore(); }
  // bush: a round bramble with berries
  at(6, 2, () => { const r = rng(79), cols = ['#2f5f24', '#3f7a2c', '#5a9a3a', '#78b048']; for (let i = 0; i < 150; i++) { const a = r() * TAU, d = Math.sqrt(r()), x = Math.cos(a) * d * 108, y = 20 + Math.sin(a) * d * 92; g.fillStyle = cols[(r() * 4) | 0]; g.beginPath(); g.ellipse(x, y, 13 + r() * 8, 9 + r() * 5, r() * TAU, 0, TAU); g.fill(); } for (let i = 0; i < 16; i++) { const a = r() * TAU, d = Math.sqrt(r()) * .85; g.fillStyle = r() < .5 ? '#7a1f3a' : '#3a1f4a'; g.beginPath(); g.arc(Math.cos(a) * d * 100, 20 + Math.sin(a) * d * 84, 6, 0, TAU); g.fill(); } });
  // sedge: a tuft of thin arching blades
  at(7, 2, () => { const r = rng(83); g.translate(0, 124); for (let i = 0; i < 46; i++) { const a = (r() - .5) * 2.2, len = 120 + r() * 120, x1 = Math.sin(a) * len, y1 = -Math.cos(a) * len * .9; g.strokeStyle = r() < .5 ? '#6f8f3c' : '#8faa4c'; g.lineWidth = 3 + r() * 2.5; g.beginPath(); g.moveTo((r() - .5) * 26, 0); g.quadraticCurveTo(x1 * .3, y1 * .8, x1, y1 + Math.abs(x1) * .35); g.stroke(); } });
  // distant spruce, birch and snag (far ring cards)
  at(4, 3, () => { g.fillStyle = '#5d4630'; g.fillRect(-7, 60, 14, 66); for (let k = 0; k < 9; k++) { const y = -118 + k * 24, w = 16 + k * 10; g.fillStyle = k % 2 ? '#23512f' : '#2c6238'; g.beginPath(); g.moveTo(0, y - 16); g.lineTo(w, y + 30); g.quadraticCurveTo(0, y + 20, -w, y + 30); g.closePath(); g.fill(); } });
  at(5, 3, () => { const r = rng(89); g.fillStyle = '#eee9dc'; g.fillRect(-6, -30, 12, 156); g.fillStyle = '#3a342c'; for (let k = 0; k < 7; k++) g.fillRect(-6, -10 + k * 20 + r() * 6, 5 + r() * 7, 3); for (let i = 0; i < 150; i++) { const a = r() * TAU, d = Math.sqrt(r()), x = Math.cos(a) * d * 78, y = -42 + Math.sin(a) * d * 80; g.fillStyle = ['#8fbf4a', '#a9cf5a', '#c9dc6a', '#7aa93c'][(r() * 4) | 0]; g.beginPath(); g.ellipse(x, y, 9, 6, r() * TAU, 0, TAU); g.fill(); } });
  at(6, 3, () => { g.strokeStyle = '#8d8676'; g.lineCap = 'round'; g.lineWidth = 16; g.beginPath(); g.moveTo(0, 124); g.lineTo(4, -90); g.stroke(); g.lineWidth = 7; for (const [y, dx, dy] of [[20, 44, -34], [-20, -40, -30], [-56, 26, -30]]) { g.beginPath(); g.moveTo(2, y); g.lineTo(dx, y + dy); g.stroke(); } });
  // a spray of small yellow-green leaves (birch crowns near Fuchs)
  at(7, 3, () => { const r = rng(97); for (let i = 0; i < 110; i++) { const a = r() * TAU, d = Math.sqrt(r()) * 104; g.save(); g.translate(Math.cos(a) * d, Math.sin(a) * d); g.rotate(r() * TAU); g.fillStyle = ['#9cc94c', '#b7d85c', '#d4e070', '#86b63e'][(r() * 4) | 0]; g.beginPath(); g.moveTo(0, -13); g.quadraticCurveTo(11, -2, 0, 13); g.quadraticCurveTo(-11, -2, 0, -13); g.fill(); g.restore(); } });
}
