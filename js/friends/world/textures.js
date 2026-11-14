/* Shared, procedurally drawn textures and the one material per surface kind (blueprint 6.1, 7A).
   Everything is drawn on canvases at start-up: no downloads, so the forest works offline.
   Materials are created once, shared by every tile and never disposed. */
import {THREE} from '../../scene/materials.js';
import {TAU, rng, hash, vnoise} from './noise.js';
import {drawBigCells} from './big/atlas.js';

export function canvasTex(w, h, draw, {repeat = null, srgb = true} = {}) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace; t.anisotropy = 4;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat); }
  return t;
}
function leafShape(g, len, wid, base, mid, light) {
  g.beginPath(); g.moveTo(0, 0);
  g.bezierCurveTo(wid * .9, -len * .18, wid * .75, -len * .75, 0, -len);
  g.bezierCurveTo(-wid * .75, -len * .75, -wid * .9, -len * .18, 0, 0);
  const gr = g.createLinearGradient(-wid, 0, wid, -len); gr.addColorStop(0, base); gr.addColorStop(.6, mid); gr.addColorStop(1, light);
  g.fillStyle = gr; g.fill();
  g.strokeStyle = 'rgba(255,255,220,.28)'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(0, -2); g.lineTo(0, -len * .92); g.stroke();
  g.strokeStyle = 'rgba(30,60,10,.25)'; g.lineWidth = 1;
  for (let k = 1; k < 5; k++) { const y = -len * k / 5.4; g.beginPath(); g.moveTo(0, y); g.lineTo(wid * .55, y - len * .1); g.moveTo(0, y); g.lineTo(-wid * .55, y - len * .1); g.stroke(); }
}

/* ---------- shader patches ---------- */
// Foliage cards keep the upward normal on both faces (three.js would flip and darken back faces).
const FOLIAGE = ['#include <normal_fragment_begin>', 'float faceDirection = 1.0;\nvec3 normal = normalize( vNormal );\nvec3 nonPerturbedNormal = normal;'];
// Leaves and trunks that stand between the camera and Fuchs turn translucent so he is never hidden: a narrow
// column around him (about 1 m wide, reaching up a trunk), fading out softly over another metre and a half,
// and never clearing completely, so a ghost of the tree stays. The fade is a fine screen-door pattern
// (interleaved gradient noise), which costs no blending or sorting. Anything right at the lens clears too.
// `foxView` is Fuchs' position in view space.
export const foxView = {value: new THREE.Vector3(0, 0, -16)};
/** Where grass and flowers bend aside: up to four [x, z, radius, strength] (Fuchs and the friends nearest him). */
export const bendAt = {value: [0, 1, 2, 3].map(() => new THREE.Vector4(1e4, 1e4, 1, 0))};
// The top of each plant card (its height within the atlas cell) leans away from whoever stands in it and dips a little.
const BEND = `#include <begin_vertex>
#ifdef USE_MAP
{ vec3 ffW = (modelMatrix * vec4(transformed, 1.)).xyz; float ffK = fract(MAP_UV.y * 4.); ffK *= ffK;
  for (int i = 0; i < 4; i++) { vec4 b = ffBend[i]; vec2 d = ffW.xz - b.xy; float l = length(d), p = b.w * (1. - smoothstep(b.z * .3, b.z, l)) * ffK;
    if (l > .001) { transformed.xz += d / l * p * .32; transformed.y -= p * .16; } } }
#endif`;
const NEAR_COMMON = '#include <common>\nuniform vec3 ffFox;\nfloat ffNoise(vec2 p){return fract(52.9829189*fract(dot(floor(p),vec2(.06711056,.00583715))));}';
const NEAR_CLIP = `#include <clipping_planes_fragment>
 vec3 ffP=-vViewPosition;vec2 ffD=ffP.xy*(ffFox.z/min(ffP.z,-.2))-ffFox.xy;ffD.y*=ffD.y>0.?.45:1.;
 float ffLine=(1.-smoothstep(.95,2.5,length(ffD)))*smoothstep(ffFox.z+.6,ffFox.z+2.4,ffP.z)*.92;
 float nearFade=max(ffLine,clamp((6.5-vViewPosition.z)/2.4,0.,1.));if(nearFade>0.&&ffNoise(gl_FragCoord.xy)<nearFade)discard;`;
export function patch(material, {foliage = false, near = false}, key) {
  material.onBeforeCompile = sh => {
    if (near) { sh.uniforms.ffFox = foxView; sh.fragmentShader = sh.fragmentShader.replace('#include <common>', NEAR_COMMON).replace('#include <clipping_planes_fragment>', NEAR_CLIP); }
    if (foliage) { sh.fragmentShader = sh.fragmentShader.replace(...FOLIAGE); sh.uniforms.ffBend = bendAt; sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nuniform vec4 ffBend[4];').replace('#include <begin_vertex>', BEND); }
  };
  material.customProgramCacheKey = () => key;
  return material;
}

/* ---------- textures and materials, built lazily in small steps ---------- */
export function createLook({software = false, big = false} = {}) {
  const T = {}, M = {};
  function pixelSteps(name, size, value, options) {
    const c = document.createElement('canvas'); c.width = c.height = size; const g = c.getContext('2d'), img = g.createImageData(size, size), bands = 8, rows = size / bands;
    return [...Array(bands).keys()].map(b => () => {
      for (let y = b * rows; y < (b + 1) * rows; y++) for (let x = 0; x < size; x++) { const n = 255 * value(x, y, size), i = (y * size + x) * 4; img.data[i] = img.data[i + 1] = img.data[i + 2] = n; img.data[i + 3] = 255; }
      if (b === bands - 1) T[name] = canvasTex(size, size, (g2) => g2.putImageData(img, 0, 0), options);
    });
  }
  const steps = [
    // Pixel textures are filled in row bands, one band per step.
    ...pixelSteps('grain', 256, (x, y) => .82 + .18 * (vnoise(x / 9, y / 9) * .6 + hash(x, y) * .4), {repeat: [1, 1]}),
    ...pixelSteps('noise', 256, (x, y, w) => { const s = 16 / w; return vnoise(x * s, y * s) * .5 + vnoise(x * s * 2 + 7, y * s * 2) * .3 + vnoise(x * s * 4, y * s * 4 + 3) * .2; }, {repeat: [1, 1], srgb: false}),
    () => { T.leaf = canvasTex(512, 512, (g, w, h) => { const r = rng(5), cols = [['#2f5f1c', '#4f8a2c', '#7fb447'], ['#3b6d22', '#5c9a33', '#94c454'], ['#2a5418', '#467e28', '#6aa63c'], ['#4a7a23', '#77a83e', '#b2d36a']];
      for (let i = 0; i < 70; i++) { const a = r() * TAU, d = Math.sqrt(r()) * w * .3, x = w / 2 + Math.cos(a) * d, y = h / 2 + Math.sin(a) * d; g.save(); g.translate(x, y); g.rotate(a + Math.PI / 2 + (r() - .5) * .9); leafShape(g, 60 + r() * 50, 26 + r() * 16, ...cols[(r() * cols.length) | 0]); g.restore(); } }); },
    // Plant atlas, 4 × 4 cells of 256 px: daisy, buttercup, bellflower, campion / clover, leaf litter, fern frond, reeds /
    // grass (two cells wide) / two crown cards for distant trees (two cells each). One texture for all ground foliage.
    // The big world's atlas is twice as wide: the same cells on the left, new ones on the right (big/atlas.js).
    () => { T.plants = canvasTex(big ? 2048 : 1024, 1024, (g) => {
      const cell = (i, fn) => { g.save(); g.beginPath(); g.rect((i % 4) * 256 + 4, Math.floor(i / 4) * 256 + 4, 248, 248); g.clip(); g.translate((i % 4) * 256 + 128, Math.floor(i / 4) * 256 + 128); fn(); g.restore(); };
      cell(0, () => { g.scale(1.6, 1.6); for (let k = 0; k < 14; k++) { g.rotate(TAU / 14); g.fillStyle = '#fffaf0'; g.beginPath(); g.ellipse(0, -26, 7, 22, 0, 0, TAU); g.fill(); } g.fillStyle = '#f2c230'; g.beginPath(); g.arc(0, 0, 13, 0, TAU); g.fill(); });
      cell(1, () => { g.scale(1.6, 1.6); for (let k = 0; k < 5; k++) { g.rotate(TAU / 5); g.fillStyle = '#ffd53a'; g.beginPath(); g.ellipse(0, -22, 19, 24, 0, 0, TAU); g.fill(); } g.fillStyle = '#e6a020'; g.beginPath(); g.arc(0, 0, 10, 0, TAU); g.fill(); });
      cell(2, () => { g.scale(1.9, 1.9); g.strokeStyle = '#4c7a2a'; g.lineWidth = 4; g.beginPath(); g.moveTo(0, 62); g.quadraticCurveTo(10, 0, 0, -58); g.stroke(); for (let k = 0; k < 7; k++) { const y = -50 + k * 13; g.fillStyle = k % 2 ? '#8b6cd6' : '#a387e6'; g.beginPath(); g.ellipse(9 + (k % 2) * 4, y, 10, 8, .5, 0, TAU); g.fill(); } });
      cell(3, () => { g.scale(1.6, 1.6); for (let k = 0; k < 5; k++) { g.rotate(TAU / 5); g.fillStyle = '#ef8fae'; g.beginPath(); g.moveTo(0, 0); g.bezierCurveTo(-20, -18, -14, -46, 0, -38); g.bezierCurveTo(14, -46, 20, -18, 0, 0); g.fill(); } g.fillStyle = '#fff2c8'; g.beginPath(); g.arc(0, 0, 7, 0, TAU); g.fill(); });
      cell(4, () => { const r = rng(3); for (let i = 0; i < 46; i++) { const x = -108 + r() * 216, y = -108 + r() * 216, s = 7 + r() * 6; for (let k = 0; k < 3; k++) { const a = k * TAU / 3 + r(); g.fillStyle = r() < .5 ? '#5e9a34' : '#79b043'; g.beginPath(); g.arc(x + Math.cos(a) * s * .8, y + Math.sin(a) * s * .8, s * .75, 0, TAU); g.fill(); } } });
      cell(5, () => { const r = rng(9), cs = ['#c8772f', '#d99a3d', '#a95a2a', '#b8873e', '#8f6a36']; for (let i = 0; i < 26; i++) { g.save(); g.translate(-98 + r() * 196, -98 + r() * 196); g.rotate(r() * TAU); const c = cs[(r() * cs.length) | 0]; leafShape(g, 26 + r() * 18, 12 + r() * 6, c, c, '#f0c070'); g.restore(); } });
      cell(6, () => { g.scale(.5, 1); g.translate(0, 128); g.strokeStyle = '#3d6b22'; g.lineWidth = 8; g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(8, -128, 0, -250); g.stroke();
        for (let i = 0; i < 26; i++) { const t = i / 26, y = -18 - t * 222, len = (1 - t) * 112 + 16; for (const s of [-1, 1]) { g.save(); g.translate(0, y); g.rotate(s * (1.15 - t * .4)); g.fillStyle = t < .5 ? '#5f9a34' : '#86bd4c'; g.beginPath(); g.ellipse(0, -len / 2, 12 * (1 - t * .5), len / 2, 0, 0, TAU); g.fill(); g.fillStyle = 'rgba(200,240,140,.35)'; g.beginPath(); g.ellipse(-3, -len / 2, 4, len / 2.4, 0, 0, TAU); g.fill(); g.restore(); } } });
      cell(7, () => { const r = rng(23); g.translate(0, 124); for (let i = 0; i < 16; i++) { const x = -70 + r() * 140, hh = 150 + r() * 90, lean = (r() - .5) * 60; const gr = g.createLinearGradient(0, 0, 0, -hh); gr.addColorStop(0, '#3f6a30'); gr.addColorStop(1, '#a8c06a'); g.fillStyle = gr; g.beginPath(); g.moveTo(x - 4, 0); g.quadraticCurveTo(x + lean * .3, -hh * .6, x + lean, -hh); g.quadraticCurveTo(x + lean * .3 + 2, -hh * .55, x + 4, 0); g.fill(); }
        for (const [x, y] of [[-24, -190], [22, -205]]) { g.strokeStyle = '#4f6b34'; g.lineWidth = 3; g.beginPath(); g.moveTo(x, 0); g.lineTo(x, y + 30); g.stroke(); g.fillStyle = '#6a3e22'; g.beginPath(); g.roundRect(x - 6, y, 12, 34, 6); g.fill(); } });
      // grass: 130 drawn blades in a 512 × 256 strip (cells 8 and 9)
      { g.save(); g.beginPath(); g.rect(4, 516, 504, 248); g.clip(); g.translate(0, 512); const r = rng(17), w = 512, h = 252;
        for (let i = 0; i < 150; i++) { const x = 14 + r() * (w - 28), hh = h * (.3 + r() * .66), lean = (r() - .5) * 100, bw = 3.6 + r() * 5.2, v = r();
          const gr = g.createLinearGradient(0, h, 0, h - hh); gr.addColorStop(0, v < .5 ? '#6c9a39' : '#78a540'); gr.addColorStop(.55, v < .5 ? '#8fb84b' : '#9ec456'); gr.addColorStop(1, v < .35 ? '#e0e69a' : '#c2d872');
          g.fillStyle = gr; g.beginPath(); g.moveTo(x - bw, h); g.quadraticCurveTo(x + lean * .3, h - hh * .6, x + lean, h - hh); g.quadraticCurveTo(x + lean * .3 + bw * .4, h - hh * .55, x + bw, h); g.fill(); }
        g.restore(); }
      // crown cards for distant trees (cells 12–13 and 14–15, 512 × 256 each, drawn as round leafy crowns on a short trunk)
      for (const [k, x0] of [[0, 0], [1, 512]]) { g.save(); g.beginPath(); g.rect(x0 + 4, 772, 504, 248); g.clip(); g.translate(x0 + 256, 768); const r = rng(41 + k);
        g.fillStyle = '#6e4a2c'; g.fillRect(-14, 160, 28, 96);
        const cols = [['#2f5f1c', '#4f8a2c', '#7fb447'], ['#3b6d22', '#5c9a33', '#94c454'], ['#4a7a23', '#77a83e', '#b2d36a']];
        for (let i = 0; i < 120; i++) { const a = r() * TAU, d = Math.sqrt(r()), x = Math.cos(a) * d * 210 * (k ? .82 : 1), y = 108 + Math.sin(a) * d * 92 - (1 - d) * 18; g.save(); g.translate(x, y); g.rotate(a + Math.PI / 2 + (r() - .5)); leafShape(g, 34 + r() * 26, 15 + r() * 9, ...cols[(r() * 3) | 0]); g.restore(); }
        g.restore(); }
      if (big) drawBigCells(g);
    }); },
    () => { T.bark = canvasTex(256, 512, (g, w, h) => { g.fillStyle = '#a2683f'; g.fillRect(0, 0, w, h); const r = rng(13); for (let i = 0; i < 260; i++) { const x = r() * w, y = r() * h, l = 30 + r() * 90; g.strokeStyle = r() < .55 ? 'rgba(60,32,16,.45)' : 'rgba(190,130,80,.35)'; g.lineWidth = 2 + r() * 5; g.beginPath(); g.moveTo(x, y); g.bezierCurveTo(x + 6, y + l * .3, x - 6, y + l * .6, x + 2, y + l); g.stroke(); } }, {repeat: [3, 2]}); },
    () => { T.wood = canvasTex(256, 64, (g, w, h) => { g.fillStyle = '#b07a46'; g.fillRect(0, 0, w, h); const r = rng(21); for (let i = 0; i < 40; i++) { g.strokeStyle = r() < .5 ? 'rgba(90,52,26,.35)' : 'rgba(230,180,120,.3)'; g.lineWidth = 1 + r() * 2; const y = r() * h; g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(w * .3, y + 4, w * .6, y - 4, w, y + 2); g.stroke(); } }, {repeat: [1, 1]}); },
    () => { T.log = canvasTex(512, 128, (g, w, h) => { g.fillStyle = '#9a6740'; g.fillRect(0, 0, w, h); const r = rng(31); for (let i = 0; i < 220; i++) { const y = r() * h, x = r() * w, l = 40 + r() * 160; g.strokeStyle = r() < .55 ? 'rgba(70,40,20,.45)' : 'rgba(200,150,100,.35)'; g.lineWidth = 1.5 + r() * 3; g.beginPath(); g.moveTo(x, y); g.bezierCurveTo(x + l * .3, y + 3, x + l * .6, y - 3, x + l, y + 1); g.stroke(); } }, {repeat: [3, 2]}); },
    () => { T.glow = canvasTex(64, 64, (g, w, h) => { const gr = g.createRadialGradient(w / 2, h / 2, 1, w / 2, h / 2, w / 2); gr.addColorStop(0, 'rgba(255,255,230,1)'); gr.addColorStop(.25, 'rgba(255,228,150,.85)'); gr.addColorStop(1, 'rgba(255,200,90,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
      T.soft = canvasTex(64, 64, (g) => { const r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, 'rgba(42,26,12,.55)'); r.addColorStop(1, 'rgba(42,26,12,0)'); g.fillStyle = r; g.fillRect(0, 0, 64, 64); }); },
    // Materials: one per surface kind, shared by every tile.
    () => {
      const shadows = !software;
      M.ground = new THREE.MeshLambertMaterial({vertexColors: true, map: T.grain});
      M.plants = patch(new THREE.MeshLambertMaterial({map: T.plants, alphaTest: .5, side: THREE.DoubleSide, vertexColors: true}), {foliage: true}, 'wb-plants');
      M.rock = new THREE.MeshLambertMaterial({vertexColors: true, map: T.grain});
      M.soft = patch(new THREE.MeshLambertMaterial({vertexColors: true, map: T.grain}), {near: true}, 'wb-soft');   // coloured things tall enough to hide Fuchs: they turn translucent like the trees
      M.bark = patch(new THREE.MeshLambertMaterial({map: T.bark, vertexColors: true}), {near: true}, 'wb-bark');
      M.leaves = patch(new THREE.MeshLambertMaterial({map: T.leaf, alphaTest: .5, side: THREE.DoubleSide}), {foliage: true, near: true}, 'wb-leaves');
      M.wood = new THREE.MeshLambertMaterial({map: T.wood, vertexColors: true});
      M.log = new THREE.MeshLambertMaterial({map: T.log, vertexColors: true});
      M.leafDepth = new THREE.MeshDepthMaterial({depthPacking: THREE.RGBADepthPacking, map: T.leaf, alphaTest: .5});
      M.plantDepth = new THREE.MeshDepthMaterial({depthPacking: THREE.RGBADepthPacking, map: T.plants, alphaTest: .5});
      M.shadows = shadows;
    },
  ];
  return {T, M, steps};
}
