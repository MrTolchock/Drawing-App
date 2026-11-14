/* Ground detail for the big world: small things lying flat on the woodland floor, drawn here in the world's palette
   onto one 1024 × 512 atlas (4 × 2 cells) and laid by tiles.js on the ground near the camera's side of each tile:
   root flares at the foot of trees, moss cushions, spruce needles, pebbles at the path edges, fallen twigs, worn
   patches on the paths, and a few fallen leaves. */
import {TAU, rng} from '../noise.js';

const cell = (col, row) => [col / 4 + .002, 1 - (row + 1) / 2 + .004, .25 - .004, .5 - .008];
export const DECALS = {roots: cell(0, 0), moss: cell(1, 0), needles: cell(2, 0), pebbles: cell(3, 0), twigs: cell(0, 1), worn: cell(1, 1), leaves: cell(2, 1), mossDots: cell(3, 1)};

export function drawDecals(g) {
  const at = (col, row, fn) => { g.save(); g.beginPath(); g.rect(col * 256 + 3, row * 256 + 3, 250, 250); g.clip(); g.translate(col * 256 + 128, row * 256 + 128); fn(rng(101 + col * 7 + row * 13)); g.restore(); };
  const blob = (r, x, y, rx, ry, a = 0) => { g.beginPath(); for (let k = 0; k <= 18; k++) { const t = k / 18 * TAU, w = 1 + (r() - .5) * .3; g.lineTo(x + Math.cos(t + a) * rx * w, y + Math.sin(t + a) * ry * w); } g.closePath(); g.fill(); };
  // root flares: five to seven roots spreading from a trunk-sized gap in the middle, tapering into the soil
  at(0, 0, r => { const n = 6 + Math.floor(r() * 2);
    for (let k = 0; k < n; k++) { const a = k / n * TAU + (r() - .5) * .5, len = 70 + r() * 45, w0 = 15 + r() * 7;
      g.save(); g.rotate(a); const gr = g.createLinearGradient(30, 0, 30 + len, 0); gr.addColorStop(0, 'rgba(110,70,40,1)'); gr.addColorStop(.7, 'rgba(96,64,40,.85)'); gr.addColorStop(1, 'rgba(90,62,40,0)'); g.fillStyle = gr;
      g.beginPath(); g.moveTo(26, -w0); g.quadraticCurveTo(30 + len * .5, -w0 * .5 + (r() - .5) * 10, 30 + len, (r() - .5) * 6); g.quadraticCurveTo(30 + len * .5, w0 * .5 + (r() - .5) * 10, 26, w0); g.fill();
      g.strokeStyle = 'rgba(150,104,62,.55)'; g.lineWidth = 3; g.beginPath(); g.moveTo(30, -w0 * .4); g.quadraticCurveTo(30 + len * .45, -w0 * .3, 30 + len * .85, 0); g.stroke(); g.restore(); }
    g.fillStyle = 'rgba(80,110,40,.55)'; for (let k = 0; k < 9; k++) { const a = r() * TAU, d = 40 + r() * 50; blob(r, Math.cos(a) * d, Math.sin(a) * d, 9 + r() * 8, 6 + r() * 5, a); } });
  // moss cushions: soft green, lighter tips, a few dark gaps
  at(1, 0, r => { for (let k = 0; k < 26; k++) { const a = r() * TAU, d = Math.sqrt(r()) * 85; g.fillStyle = ['#4f7a2a', '#5f8d32', '#6e9c3a', '#86b04a'][Math.floor(r() * 4)]; blob(r, Math.cos(a) * d, Math.sin(a) * d * .8, 18 + r() * 22, 14 + r() * 16, r() * 3); }
    g.fillStyle = 'rgba(190,220,120,.7)'; for (let k = 0; k < 70; k++) { const a = r() * TAU, d = Math.sqrt(r()) * 90; g.beginPath(); g.arc(Math.cos(a) * d, Math.sin(a) * d * .8, 1.5 + r() * 2, 0, TAU); g.fill(); } });
  // spruce needles: a rusty carpet of fine strokes with a cone or two
  at(2, 0, r => { g.lineCap = 'round'; for (let k = 0; k < 900; k++) { const a = r() * TAU, d = Math.sqrt(r()) * 110, x = Math.cos(a) * d, y = Math.sin(a) * d, t = r() * TAU, l = 7 + r() * 8; g.strokeStyle = ['rgba(150,96,50,.9)', 'rgba(122,78,40,.9)', 'rgba(176,122,66,.8)', 'rgba(100,84,46,.8)'][Math.floor(r() * 4)]; g.lineWidth = 1.6; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(t) * l, y + Math.sin(t) * l); g.stroke(); }
    for (const [x, y] of [[-30, 20], [42, -36]]) { g.save(); g.translate(x, y); g.rotate(r() * 3); g.fillStyle = '#7a4e2c'; g.beginPath(); g.ellipse(0, 0, 9, 22, 0, 0, TAU); g.fill(); g.strokeStyle = '#a8703f'; g.lineWidth = 2; for (let k = -16; k < 18; k += 6) { g.beginPath(); g.moveTo(-8, k); g.lineTo(8, k + 3); g.stroke(); } g.restore(); } });
  // pebbles along a path edge: rounded stones in greys and sand with a light top
  at(3, 0, r => { for (let k = 0; k < 22; k++) { const x = (r() - .5) * 200, y = (r() - .5) * 120, s = 6 + r() * 13, v = 120 + r() * 70; g.fillStyle = `rgb(${v},${v - 6},${v - 16})`; blob(r, x, y, s, s * (.65 + r() * .3), r() * 3); g.fillStyle = 'rgba(255,250,235,.35)'; blob(r, x - s * .2, y - s * .25, s * .45, s * .3, 0); } });
  // fallen twigs: thin brown sticks with little forks
  at(0, 1, r => { g.lineCap = 'round'; for (let k = 0; k < 7; k++) { const x = (r() - .5) * 150, y = (r() - .5) * 150, a = r() * TAU, l = 40 + r() * 70; g.strokeStyle = ['#6e4a2c', '#7f5634', '#5e3e24'][k % 3]; g.lineWidth = 3 + r() * 3; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke();
    g.lineWidth = 2; const u = .3 + r() * .4, b = a + (r() < .5 ? .6 : -.6); g.beginPath(); g.moveTo(x + Math.cos(a) * l * u, y + Math.sin(a) * l * u); g.lineTo(x + Math.cos(a) * l * u + Math.cos(b) * 22, y + Math.sin(a) * l * u + Math.sin(b) * 22); g.stroke(); } });
  // a worn patch on a path: trodden darker earth, small stones pressed in, a crack
  at(1, 1, r => { g.fillStyle = 'rgba(120,80,48,.55)'; blob(r, 0, 0, 100, 64, r()); g.fillStyle = 'rgba(96,62,36,.45)'; for (let k = 0; k < 6; k++) blob(r, (r() - .5) * 120, (r() - .5) * 70, 20 + r() * 26, 10 + r() * 12, r() * 3);
    for (let k = 0; k < 16; k++) { const v = 130 + r() * 60; g.fillStyle = `rgba(${v},${v - 8},${v - 20},.9)`; blob(r, (r() - .5) * 170, (r() - .5) * 100, 3 + r() * 5, 2.5 + r() * 3.5, r() * 3); }
    g.strokeStyle = 'rgba(70,46,28,.45)'; g.lineWidth = 2; g.beginPath(); g.moveTo(-60, -10); g.quadraticCurveTo(-10, 8, 50, -4); g.stroke(); });
  // fallen beech leaves: ochre, rust and a few still green
  at(2, 1, r => { for (let k = 0; k < 30; k++) { const x = (r() - .5) * 190, y = (r() - .5) * 190, a = r() * TAU, s = 9 + r() * 7; g.save(); g.translate(x, y); g.rotate(a); g.fillStyle = ['#c08a3a', '#a4592c', '#d6a24a', '#7f8a3a', '#8e4a26'][Math.floor(r() * 5)];
    g.beginPath(); g.moveTo(0, -s * 1.6); g.quadraticCurveTo(s, -s * .4, 0, s * 1.4); g.quadraticCurveTo(-s, -s * .4, 0, -s * 1.6); g.fill(); g.strokeStyle = 'rgba(70,40,20,.4)'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(0, -s * 1.4); g.lineTo(0, s * 1.3); g.stroke(); g.restore(); } });
  // small moss dots and lichen for stones and stumps
  at(3, 1, r => { for (let k = 0; k < 40; k++) { const a = r() * TAU, d = Math.sqrt(r()) * 100; g.fillStyle = r() < .7 ? ['#5f8d32', '#7aa443', '#4f7a2a'][Math.floor(r() * 3)] : '#c9cf9a'; blob(r, Math.cos(a) * d, Math.sin(a) * d, 5 + r() * 9, 4 + r() * 7, r() * 3); } });
}
