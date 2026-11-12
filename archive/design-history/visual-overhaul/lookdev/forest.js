/* Look-dev scene for the Waldbuch forest (design reference, not game code).
   Open via the dev server: /design/visual-overhaul/lookdev/?view=hero|close|brook|log (&scale=1|2, &hud=0, &chars=0, &plush=0).
   Everything is procedural: no downloads beyond three.js and the character rigs, so the same
   techniques work offline in the home-screen PWA. Budgets are printed to window.stats. */
import * as THREE from '../../../vendor/three/three.module.js';
import {characters, setDetail} from './characters3d.js';   // today's rigs (with fox tweaks), used with &plush=0
import {plush} from './plush.js';

const T0 = performance.now();
const P = new URLSearchParams(location.search);
const VIEW = P.get('view') || 'hero';
const canvas = document.getElementById('c');
const W = innerWidth, H = innerHeight;
const renderer = new THREE.WebGLRenderer({canvas, antialias: true, powerPreference: 'high-performance'});
renderer.setPixelRatio(+(P.get('scale') || devicePixelRatio));
renderer.setSize(W, H, false);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.02;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.autoUpdate = false;
renderer.shadowMap.needsUpdate = true;

const scene = new THREE.Scene();
const FOG = new THREE.Color('#e8dcae');
scene.fog = new THREE.Fog(FOG, 24, 72);
scene.background = FOG;

/* ---------- small helpers ---------- */
const TAU = Math.PI * 2, clamp = THREE.MathUtils.clamp, lerp = THREE.MathUtils.lerp;
const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
function rng(seed) { return () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }
const R = rng(20261109);
function hash(x, y) { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s); }
function vnoise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
  return lerp(lerp(a, b, u), lerp(c, d, u), v);
}
const fbm = (x, y) => vnoise(x, y) * .55 + vnoise(x * 2.1 + 5, y * 2.1 + 9) * .3 + vnoise(x * 4.3 + 11, y * 4.3 + 3) * .15;
const col = h => new THREE.Color(h);
function canvasTex(w, h, draw, {repeat = null, srgb = true} = {}) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); if (srgb) t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat); }
  return t;
}

/* ---------- layout: a meandering brook and narrow, wandering trails ---------- */
const V3 = (x, z) => new THREE.Vector3(x, 0, z);
const brookCurve = new THREE.CatmullRomCurve3(
  [[0, -46], [4.5, -36], [1.5, -27], [6.5, -19], [3.8, -12], [7.8, -6.5], [5.6, -1.2], [8.8, 3.5], [6.2, 8.5], [8.6, 13], [7.2, 19], [9, 26]].map(([x, z]) => V3(x, z)), false, 'centripetal');
const BN = 520, brookS = brookCurve.getSpacedPoints(BN);
const brookW = t => 1.15 + .42 * Math.sin(t * 23) + .22 * Math.sin(t * 57 + 1.3);   // 0.6..1.8 m half-variation
const rise = z => sstep(-12, -44, z) * 3.2;                                            // gentle hill behind
const brookLevel = t => { const p = brookS[Math.round(t * BN)]; return rise(p.z) * .85 - .32; };

const paths = [
  {pts: [[-3.2, -7.0], [-2.7, -5.2], [-1.2, -3.9], [.2, -2.4], [.4, -.4], [-.6, 1.6], [-2.2, 3.4], [-2.6, 5.8], [-1.4, 8.4], [-2.2, 12]], w: .95},
  {pts: [[.2, -2.4], [1.8, -1.5], [3.1, -.3], [4.4, .7], [5.8, 1.1], [7.4, 1.2], [9.0, .3], [10.6, -1.0], [12.6, -1.2], [15, -.2]], w: .85},
  {pts: [[-1.2, -3.9], [-3.4, -2.8], [-5.0, -3.2], [-6.6, -2.2]], w: .7},
].map(p => { const c = new THREE.CatmullRomCurve3(p.pts.map(([x, z]) => V3(x, z)), false, 'centripetal'); return {...p, curve: c, s: c.getSpacedPoints(220)}; });

function nearest(samples, x, z) {
  let best = 1e9, bi = 0;
  for (let i = 0; i < samples.length; i++) { const dx = samples[i].x - x, dz = samples[i].z - z, d = dx * dx + dz * dz; if (d < best) { best = d; bi = i; } }
  return {d: Math.sqrt(best), t: bi / (samples.length - 1), i: bi};
}
function brookAt(x, z) { const n = nearest(brookS, x, z); return {...n, w: brookW(n.t), level: brookLevel(n.t)}; }
function pathAt(x, z) {
  let best = {d: 1e9, w: 1, t: 0};
  for (const p of paths) { const n = nearest(p.s, x, z); const w = p.w * (1 + .22 * Math.sin(n.t * 31 + p.w * 10)); if (n.d - w / 2 < best.d - best.w / 2) best = {...n, w}; }
  return best;
}

const HOME = {x: -3.2, z: -10.2, r: 2.35};
function baseGround(x, z) { return (fbm(x * .07 + 3, z * .07 + 7) - .5) * .9 + rise(z) + .6 * sstep(4, 0, Math.hypot(x + 7.6, z + 2.4)) * .4; }
function ground(x, z, b = brookAt(x, z), p = pathAt(x, z)) {
  let h = baseGround(x, z);
  const hw = b.w / 2, top = b.level + .34;
  // riverbank: a smooth shoulder near the water, steep cut bank, rounded bed
  if (b.d < hw + 5) {
    const shoulder = sstep(hw + 5, hw + .9, b.d);
    h = lerp(h, Math.max(top, Math.min(h, top + .25)), shoulder);
    if (b.d < hw + .9) h = lerp(top, b.level - .05, sstep(hw + .9, hw - .05, b.d));
    if (b.d < hw) h = b.level - .05 - .32 * (1 - (b.d / hw) ** 2) + (fbm(x * 2.3, z * 2.3) - .5) * .06;
  }
  if (p.d < p.w / 2 + .35) h -= .045 * sstep(p.w / 2 + .35, p.w / 2 - .1, p.d);
  return h;
}

/* ---------- sky, sun and atmosphere ---------- */
const sunDir = new THREE.Vector3(-.55, .62, -.56).normalize();
{
  const sky = new THREE.Mesh(new THREE.SphereGeometry(150, 32, 16), new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: {top: {value: col('#a9d3c6')}, horizon: {value: col('#f3e3b2')}, sun: {value: sunDir}},
    vertexShader: 'varying vec3 vD;void main(){vD=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: 'uniform vec3 top,horizon,sun;varying vec3 vD;void main(){float h=clamp(vD.y,0.,1.);vec3 c=mix(horizon,top,pow(h,.55));float g=pow(max(dot(vD,sun),0.),24.);c+=vec3(1.,.86,.55)*g*.6;gl_FragColor=vec4(c,1.);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}'
  }));
  scene.add(sky);
}
const hemi = new THREE.HemisphereLight('#e4f0ff', '#8a7444', 1.35); scene.add(hemi);
const sun = new THREE.DirectionalLight('#ffe0ab', 2.6);
sun.position.copy(sunDir).multiplyScalar(40).add(new THREE.Vector3(2, 0, -4)); sun.target.position.set(2, 0, -4);
sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, {left: -30, right: 30, top: 30, bottom: -30, near: 5, far: 95});
sun.shadow.bias = -.0004; sun.shadow.normalBias = .04;
scene.add(sun, sun.target);
const fill = new THREE.DirectionalLight('#fff4e0', .55); scene.add(fill, fill.target);   // camera-side fill so faces read against the low sun

/* ---------- textures (all drawn once on canvas) ---------- */
const grainTex = canvasTex(256, 256, (g, w, h) => {
  const img = g.createImageData(w, h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const n = .82 + .18 * (vnoise(x / 9, y / 9) * .6 + hash(x, y) * .4); const i = (y * w + x) * 4;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = 255 * n; img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
}, {repeat: [42, 40]});
const noiseTex = canvasTex(256, 256, (g, w, h) => {
  const img = g.createImageData(w, h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const f = (a, b) => vnoise(a, b);  // tileable by wrapping coords
    const s = 16, n = (f(x / w * s, y / h * s) * .5 + f(x / w * s * 2 + 7, y / h * s * 2) * .3 + f(x / w * s * 4, y / h * s * 4 + 3) * .2);
    const i = (y * w + x) * 4; img.data[i] = img.data[i + 1] = img.data[i + 2] = 255 * n; img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
}, {repeat: [1, 1], srgb: false});
noiseTex.wrapS = noiseTex.wrapT = THREE.RepeatWrapping;

function leafShape(g, len, wid, base, mid, light, rand) {
  g.beginPath(); g.moveTo(0, 0);
  g.bezierCurveTo(wid * .9, -len * .18, wid * .75, -len * .75, 0, -len);
  g.bezierCurveTo(-wid * .75, -len * .75, -wid * .9, -len * .18, 0, 0);
  const gr = g.createLinearGradient(-wid, 0, wid, -len); gr.addColorStop(0, base); gr.addColorStop(.6, mid); gr.addColorStop(1, light);
  g.fillStyle = gr; g.fill();
  g.strokeStyle = 'rgba(255,255,220,.28)'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(0, -2); g.lineTo(0, -len * .92); g.stroke();
  g.strokeStyle = 'rgba(30,60,10,.25)'; g.lineWidth = 1;
  for (let k = 1; k < 5; k++) { const y = -len * k / 5.4; g.beginPath(); g.moveTo(0, y); g.lineTo(wid * .55, y - len * .1); g.moveTo(0, y); g.lineTo(-wid * .55, y - len * .1); g.stroke(); }
}
const leafTex = canvasTex(512, 512, (g, w, h) => {
  const r = rng(5), cols = [['#2f5f1c', '#4f8a2c', '#7fb447'], ['#3b6d22', '#5c9a33', '#94c454'], ['#2a5418', '#467e28', '#6aa63c'], ['#4a7a23', '#77a83e', '#b2d36a']];
  for (let i = 0; i < 70; i++) {
    const a = r() * TAU, d = Math.sqrt(r()) * w * .3, x = w / 2 + Math.cos(a) * d, y = h / 2 + Math.sin(a) * d;
    g.save(); g.translate(x, y); g.rotate(a + Math.PI / 2 + (r() - .5) * .9); const c = cols[(r() * cols.length) | 0];
    leafShape(g, 60 + r() * 50, 26 + r() * 16, ...c, r); g.restore();
  }
});
const fernTex = canvasTex(128, 512, (g, w, h) => {
  g.strokeStyle = '#3d6b22'; g.lineWidth = 4; g.beginPath(); g.moveTo(w / 2, h); g.quadraticCurveTo(w / 2 + 4, h / 2, w / 2, 6); g.stroke();
  for (let i = 0; i < 26; i++) {
    const t = i / 26, y = h - 18 - t * (h - 40), len = (1 - t) * 56 + 8;
    for (const s of [-1, 1]) {
      g.save(); g.translate(w / 2, y); g.rotate(s * (1.15 - t * .4));
      g.fillStyle = t < .5 ? '#5f9a34' : '#86bd4c'; g.beginPath(); g.ellipse(0, -len / 2, 6 * (1 - t * .5), len / 2, 0, 0, TAU); g.fill();
      g.fillStyle = 'rgba(200,240,140,.35)'; g.beginPath(); g.ellipse(-1.5, -len / 2, 2, len / 2.4, 0, 0, TAU); g.fill(); g.restore();
    }
  }
});
const flowerTex = canvasTex(512, 128, (g, w, h) => {
  const cell = (i, fn) => { g.save(); g.translate(i * 128 + 64, 64); fn(); g.restore(); };
  cell(0, () => { for (let k = 0; k < 14; k++) { g.rotate(TAU / 14); g.fillStyle = '#fffaf0'; g.beginPath(); g.ellipse(0, -26, 7, 22, 0, 0, TAU); g.fill(); } g.fillStyle = '#f2c230'; g.beginPath(); g.arc(0, 0, 13, 0, TAU); g.fill(); });
  cell(1, () => { for (let k = 0; k < 5; k++) { g.rotate(TAU / 5); g.fillStyle = '#ffd53a'; g.beginPath(); g.ellipse(0, -22, 19, 24, 0, 0, TAU); g.fill(); } g.fillStyle = '#e6a020'; g.beginPath(); g.arc(0, 0, 10, 0, TAU); g.fill(); });
  cell(2, () => { g.strokeStyle = '#4c7a2a'; g.lineWidth = 4; g.beginPath(); g.moveTo(0, 60); g.quadraticCurveTo(10, 0, 0, -58); g.stroke(); for (let k = 0; k < 7; k++) { const y = -50 + k * 13; g.fillStyle = k % 2 ? '#8b6cd6' : '#a387e6'; g.beginPath(); g.ellipse(9 + (k % 2) * 4, y, 10, 8, .5, 0, TAU); g.fill(); } });
  cell(3, () => { for (let k = 0; k < 5; k++) { g.rotate(TAU / 5); g.fillStyle = '#ef8fae'; g.beginPath(); g.moveTo(0, 0); g.bezierCurveTo(-20, -18, -14, -46, 0, -38); g.bezierCurveTo(14, -46, 20, -18, 0, 0); g.fill(); } g.fillStyle = '#fff2c8'; g.beginPath(); g.arc(0, 0, 7, 0, TAU); g.fill(); });
});
const litterTex = canvasTex(256, 256, (g, w, h) => {
  const r = rng(9), cs = ['#c8772f', '#d99a3d', '#a95a2a', '#b8873e', '#8f6a36'];
  for (let i = 0; i < 26; i++) { g.save(); g.translate(30 + r() * (w - 60), 30 + r() * (h - 60)); g.rotate(r() * TAU); const c = cs[(r() * cs.length) | 0]; leafShape(g, 26 + r() * 18, 12 + r() * 6, c, c, '#f0c070', r); g.restore(); }
});
const cloverTex = canvasTex(256, 256, (g, w, h) => {
  const r = rng(3);
  for (let i = 0; i < 46; i++) { const x = 20 + r() * (w - 40), y = 20 + r() * (h - 40), s = 7 + r() * 6; for (let k = 0; k < 3; k++) { const a = k * TAU / 3 + r(); g.fillStyle = r() < .5 ? '#5e9a34' : '#79b043'; g.beginPath(); g.arc(x + Math.cos(a) * s * .8, y + Math.sin(a) * s * .8, s * .75, 0, TAU); g.fill(); } }
});
const barkTex = canvasTex(256, 512, (g, w, h) => {
  g.fillStyle = '#a2683f'; g.fillRect(0, 0, w, h); const r = rng(13);
  for (let i = 0; i < 260; i++) { const x = r() * w, y = r() * h, l = 30 + r() * 90; g.strokeStyle = r() < .55 ? 'rgba(60,32,16,.45)' : 'rgba(190,130,80,.35)'; g.lineWidth = 2 + r() * 5; g.beginPath(); g.moveTo(x, y); g.bezierCurveTo(x + 6, y + l * .3, x - 6, y + l * .6, x + 2, y + l); g.stroke(); }
}, {repeat: [3, 2]});
const woodTex = canvasTex(256, 64, (g, w, h) => {
  g.fillStyle = '#b07a46'; g.fillRect(0, 0, w, h); const r = rng(21);
  for (let i = 0; i < 40; i++) { g.strokeStyle = r() < .5 ? 'rgba(90,52,26,.35)' : 'rgba(230,180,120,.3)'; g.lineWidth = 1 + r() * 2; const y = r() * h; g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(w * .3, y + 4, w * .6, y - 4, w, y + 2); g.stroke(); }
}, {repeat: [1, 1]});
const glowTex = canvasTex(64, 64, (g, w, h) => { const gr = g.createRadialGradient(w / 2, h / 2, 1, w / 2, h / 2, w / 2); gr.addColorStop(0, 'rgba(255,255,230,1)'); gr.addColorStop(.25, 'rgba(255,228,150,.85)'); gr.addColorStop(1, 'rgba(255,200,90,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });

// Foliage cards: both faces keep the upward normal (three.js would flip it on back faces and darken them).
function foliage(m) { m.onBeforeCompile = sh => { sh.fragmentShader = sh.fragmentShader.replace('#include <normal_fragment_begin>', 'float faceDirection = 1.0;\nvec3 normal = normalize( vNormal );\nvec3 nonPerturbedNormal = normal;'); }; m.customProgramCacheKey = () => 'foliage'; return m; }
const alphaDepth = map => new THREE.MeshDepthMaterial({depthPacking: THREE.RGBADepthPacking, map, alphaTest: .5});

/* ---------- terrain ---------- */
const stats = {parts: {}};
{
  const X0 = -42, X1 = 46, Z0 = -64, Z1 = 22, NX = 176, NZ = 172;
  const geo = new THREE.PlaneGeometry(X1 - X0, Z1 - Z0, NX, NZ); geo.rotateX(-Math.PI / 2); geo.translate((X0 + X1) / 2, 0, (Z0 + Z1) / 2);
  const p = geo.attributes.position, c = new Float32Array(p.count * 3);
  const grassA = col('#5f8f2f'), grassB = col('#86ad45'), sunny = col('#a9b856'), moss = col('#4c7a2a'), dirt = col('#b77a49'), dirtL = col('#cf9a66'), wet = col('#6a5237'), sand = col('#bba57f'), bed = col('#7c6c50'), tmp = new THREE.Color();
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), z = p.getZ(i), b = brookAt(x, z), pa = pathAt(x, z);
    p.setY(i, ground(x, z, b, pa));
    const n = fbm(x * .18, z * .18), n2 = fbm(x * .9 + 4, z * .9);
    tmp.copy(grassA).lerp(grassB, n).lerp(sunny, sstep(.62, .82, fbm(x * .05 + 9, z * .05)) * .55);
    const homeD = Math.hypot(x - HOME.x, z - HOME.z); tmp.lerp(moss, sstep(5.5, 2.4, homeD) * .7);
    // path: warm earth with a ragged, grassy edge
    const pe = pa.d - pa.w / 2 + (n2 - .5) * .35;
    if (pe < .25) tmp.lerp(col('#9b8a4a'), sstep(.25, 0, pe) * .6);
    if (pe < 0) tmp.copy(dirt).lerp(dirtL, n2 * .7).lerp(col('#a8703f'), sstep(-.1, -.4, pe) * 0);
    // brook: wet soil, sand and pebbles at the waterline, darker bed below
    const be = b.d - b.w / 2;
    if (be < 1.1) tmp.lerp(wet, sstep(1.1, .25, be + (n2 - .5) * .3));
    if (be < .35) tmp.lerp(sand, sstep(.35, .05, be) * (.5 + .5 * n2));
    if (be < 0) tmp.copy(bed).lerp(sand, n2 * .5);
    c[i * 3] = tmp.r; c[i * 3 + 1] = tmp.g; c[i * 3 + 2] = tmp.b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(c, 3)); geo.computeVertexNormals();
  const terrain = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({vertexColors: true, map: grainTex})); terrain.name = 'terrain';
  terrain.receiveShadow = true; scene.add(terrain);
}

/* ---------- the brook: flowing water with bank foam, sun glints and visible bed ---------- */
let waterMat;
{
  const seg = BN, pos = [], uv = [], idx = [];
  let along = 0;
  for (let i = 0; i <= seg; i++) {
    const t = i / seg, p = brookS[i], q = brookS[Math.min(seg, i + 1)], o = brookS[Math.max(0, i - 1)];
    const dir = new THREE.Vector3().subVectors(q, o).setY(0).normalize(), side = new THREE.Vector3(-dir.z, 0, dir.x);
    const hw = brookW(t) / 2 + .16, y = brookLevel(t);
    if (i) along += p.distanceTo(o) / 2 + 0;
    for (const s of [-1, 1]) { pos.push(p.x + side.x * hw * s, y, p.z + side.z * hw * s); uv.push(s < 0 ? 0 : 1, i * brookCurve.getLength() / seg); }
    if (i < seg) { const a = i * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
  }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); geo.setIndex(idx);
  waterMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side: THREE.DoubleSide,
    uniforms: {uTime: {value: 3.7}, uNoise: {value: noiseTex}, uShallow: {value: col('#7fc3b0')}, uDeep: {value: col('#1d6476')}, uFoam: {value: col('#f6fbf2')}, uSky: {value: col('#e6f1df')}, uSun: {value: col('#fff1c8')}, uSunDir: {value: sunDir}, fogColor: {value: FOG}, fogNear: {value: 24}, fogFar: {value: 72}},
    vertexShader: `varying vec2 vUv;varying vec3 vW;varying float vFog;void main(){vUv=uv;vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;vec4 mv=viewMatrix*w;vFog=-mv.z;gl_Position=projectionMatrix*mv;}`,
    fragmentShader: `uniform float uTime;uniform sampler2D uNoise;uniform vec3 uShallow,uDeep,uFoam,uSky,uSun,uSunDir,fogColor;uniform float fogNear,fogFar;varying vec2 vUv;varying vec3 vW;varying float vFog;
    void main(){
      float across=abs(vUv.x-.5)*2.;float along=vUv.y;
      vec2 f1=vec2(vUv.x*.6,along*.07-uTime*.12),f2=vec2(vUv.x*1.1+.37,along*.12-uTime*.2);
      float n1=texture2D(uNoise,f1).r,n2=texture2D(uNoise,f2).r,n=(n1+n2)*.5;
      float e=.015;float nx=texture2D(uNoise,f2+vec2(e,0.)).r-n2,nz=texture2D(uNoise,f2+vec2(0.,e)).r-n2;
      vec3 N=normalize(vec3(-nx*2.5,1.,-nz*2.5));vec3 V=normalize(cameraPosition-vW);
      float depth=1.-across*across;
      vec3 c=mix(uShallow,uDeep,smoothstep(.0,.8,depth)*.92);
      c*=.94+.12*n;
      float fres=pow(1.-max(dot(N,V),0.),4.);c=mix(c,uSky,fres*.35);
      vec3 Hh=normalize(uSunDir+V);c+=uSun*smoothstep(.72,.92,n2)*pow(max(dot(N,Hh),0.),260.)*1.4;
      float streak=smoothstep(.7,.82,n2)*(.2+.6*depth);c=mix(c,uFoam,streak*.08);
      float foam=smoothstep(.84,.99,across)*smoothstep(.45,.7,n1+.18*sin(along*2.6+uTime*1.7));
      c=mix(c,uFoam,foam*.7);
      float alpha=mix(.86,.35,smoothstep(.45,1.,across));alpha=max(alpha,foam*.8);
      c=mix(c,fogColor,smoothstep(fogNear,fogFar,vFog));
      gl_FragColor=vec4(c,alpha);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`
  });
  const water = new THREE.Mesh(geo, waterMat); water.name = 'water'; water.renderOrder = 2; scene.add(water);
}

/* ---------- instancing helper ---------- */
const dummy = new THREE.Object3D();
function instanced(geo, mat, list, {shadow = false, receive = true, depth = null, colors = true, name = ''} = {}) {
  const m = new THREE.InstancedMesh(geo, mat, list.length); m.name = name;
  list.forEach((it, i) => {
    dummy.position.set(it.x, it.y, it.z); dummy.rotation.set(it.rx || 0, it.ry || 0, it.rz || 0);
    dummy.scale.set(it.sx ?? it.s ?? 1, it.sy ?? it.s ?? 1, it.sz ?? it.s ?? 1); dummy.updateMatrix(); m.setMatrixAt(i, dummy.matrix);
    if (colors) m.setColorAt(i, it.c || new THREE.Color(1, 1, 1));
  });
  m.castShadow = shadow; m.receiveShadow = receive; if (depth) m.customDepthMaterial = depth; scene.add(m); return m;
}
const upNormals = geo => { const n = geo.attributes.normal; for (let i = 0; i < n.count; i++) n.setXYZ(i, 0, 1, 0); return geo; };
function merge(geos) {
  const out = new THREE.BufferGeometry(), attrs = ['position', 'normal', 'uv', 'color']; const data = {position: [], normal: [], uv: [], color: []}, idx = []; let off = 0;
  for (const g0 of geos) { const g = g0.index ? g0 : g0; const n = g.attributes.position.count;
    for (const a of attrs) { const at = g.attributes[a]; if (at) data[a].push(...at.array); else if (a === 'color') for (let i = 0; i < n; i++) data.color.push(1, 1, 1); else if (a === 'uv') for (let i = 0; i < n; i++) data.uv.push(0, 0); }
    if (g.index) for (const v of g.index.array) idx.push(v + off); else for (let i = 0; i < n; i++) idx.push(i + off); off += n; }
  out.setAttribute('position', new THREE.Float32BufferAttribute(data.position, 3)); out.setAttribute('normal', new THREE.Float32BufferAttribute(data.normal, 3));
  out.setAttribute('uv', new THREE.Float32BufferAttribute(data.uv, 2)); out.setAttribute('color', new THREE.Float32BufferAttribute(data.color, 3)); out.setIndex(idx); return out;
}
const tintGeo = (g, fn) => { const p = g.attributes.position, c = []; for (let i = 0; i < p.count; i++) { const cc = fn(p.getX(i), p.getY(i), p.getZ(i), i); c.push(cc.r, cc.g, cc.b); } g.setAttribute('color', new THREE.Float32BufferAttribute(c, 3)); return g; };

/* ---------- trees: fluted trunks with buttress roots, leaf-card crowns ---------- */
const trees = [];
{
  const fixed = [[-12.5, -5.5, .8], [15.5, -9, .78], [-7.5, -17, .72], [12, -18, .75], [-15, 2.5, .85], [17.5, 1, .8], [-10, 9.5, .75]];
  fixed.forEach(([x, z, r]) => trees.push({x, z, r}));
  let tries = 0;
  while (trees.length < 46 && tries++ < 4000) {
    const x = -32 + R() * 70, z = -54 + R() * 64, b = brookAt(x, z), p = pathAt(x, z);
    if (b.d < b.w / 2 + 2.6 || p.d < p.w / 2 + 2.2 || Math.hypot(x - HOME.x, z - HOME.z) < 8 || Math.hypot(x - 2, z + 1) < 9.5 || (z > 4 && x > -6 && x < 14)) continue;
    if (trees.some(t => Math.hypot(t.x - x, t.z - z) < 6)) continue;
    trees.push({x, z, r: .55 + R() * .3});
  }
  const trunkGeos = [], leafCards = [];
  const trunkProfile = [[1.8, 0], [1.32, .2], [1.1, .55], [1.02, 1.2], [.97, 2.4], [.92, 3.8], [.86, 5.2], [.8, 6.4], [.7, 7.6]];
  const barkC = col('#ffe3cc'), mossC = col('#8fb35a');
  const addTree = (t, hero = false) => {
    const y0 = ground(t.x, t.z), height = hero ? 1 : .85 + R() * .3, seed = R() * 10;
    const geo = new THREE.LatheGeometry(trunkProfile.map(([r, y]) => new THREE.Vector2(r * t.r * (hero ? 1 : 1), y * height)), 22, 16);
    const pp = geo.attributes.position;
    for (let i = 0; i < pp.count; i++) {
      const x = pp.getX(i), y = pp.getY(i), z = pp.getZ(i), a = Math.atan2(z, x), r = Math.hypot(x, z);
      const flute = 1 + .07 * Math.sin(a * 6 + seed + y * .25) + (.28 * Math.max(0, Math.sin(a * 5 + seed))) * Math.max(0, 1 - y / 1.4);
      pp.setXYZ(i, Math.cos(a) * r * flute, y, Math.sin(a) * r * flute);
    }
    geo.computeVertexNormals(); geo.translate(t.x, y0 - .05, t.z);
    tintGeo(geo, (x, y, z) => barkC.clone().lerp(mossC, sstep(1.1, .1, y - y0) * sstep(.35, .7, fbm(x * 2, z * 2 + y))));
    trunkGeos.push(geo);
    // crown: leaf cards on a lumpy ellipsoid, shaded toward the sun
    const crownY = y0 + 7.4 * height, crownR = 3.0 + t.r * 2.6, n = 80;
    for (let k = 0; k < n; k++) {
      const u = R() * TAU, v = Math.acos(lerp(-.35, 1, R())), d = new THREE.Vector3(Math.sin(v) * Math.cos(u), Math.cos(v) * .7, Math.sin(v) * Math.sin(u));
      const rr = crownR * (.72 + .3 * R()), p = new THREE.Vector3(t.x, crownY, t.z).addScaledVector(d, rr);
      const light = .55 + .45 * Math.max(0, d.dot(sunDir)) + .15 * d.y;
      leafCards.push({x: p.x, y: p.y, z: p.z, rx: (R() - .5) * 1.2, ry: R() * TAU, rz: (R() - .5) * 1.2, s: 2.1 + R() * 1.4, c: new THREE.Color(1, 1, 1).multiplyScalar(clamp(light, .45, 1.15))});
    }
  };
  trees.forEach(t => addTree(t));
  // the home tree: a wide old trunk, flattened at the front for the den door
  {
    const t = {x: HOME.x, z: HOME.z, r: 1}, y0 = ground(HOME.x, HOME.z) - .05;
    const prof = [[3.6, 0], [2.95, .3], [2.55, .8], [2.36, 1.5], [2.26, 2.6], [2.14, 4], [1.98, 5.6], [1.84, 7.2], [1.72, 8.6], [1.62, 10]];
    const geo = new THREE.LatheGeometry(prof.map(([r, y]) => new THREE.Vector2(r, y)), 40, 30), pp = geo.attributes.position;
    for (let i = 0; i < pp.count; i++) {
      let x = pp.getX(i), y = pp.getY(i), z = pp.getZ(i); const a = Math.atan2(z, x), r = Math.hypot(x, z);
      const tw = a + y * .05, k = 1 + .07 * Math.sin(tw * 7 + y * .3) + .34 * Math.max(0, Math.sin(tw * 6 + .4)) * Math.max(0, 1 - y / 1.8);
      x = Math.cos(a) * r * k; z = Math.sin(a) * r * k;
      if (z > 0 && Math.abs(x) < 1.35 && y < 2.9) z = Math.min(z, 2.3 + .25 * sstep(1.0, 1.35, Math.abs(x)) + .2 * sstep(2.5, 2.9, y));
      pp.setXYZ(i, x, y, z);
    }
    geo.computeVertexNormals(); geo.translate(HOME.x, y0, HOME.z);
    tintGeo(geo, (x, y, z) => barkC.clone().lerp(mossC, sstep(1.2, .1, y - y0) * sstep(.3, .65, fbm(x * 2, z * 2 + y))));
    trunkGeos.push(geo);
    const crownY = y0 + 10.5;
    for (let k = 0; k < 150; k++) {
      const u = R() * TAU, v = Math.acos(lerp(-.4, 1, R())), d = new THREE.Vector3(Math.sin(v) * Math.cos(u), Math.cos(v) * .6, Math.sin(v) * Math.sin(u));
      const p = new THREE.Vector3(HOME.x, crownY, HOME.z).addScaledVector(d, 6.4 * (.75 + .3 * R()));
      const light = .55 + .45 * Math.max(0, d.dot(sunDir)) + .15 * d.y;
      leafCards.push({x: p.x, y: p.y, z: p.z, rx: (R() - .5) * 1.2, ry: R() * TAU, rz: (R() - .5) * 1.2, s: 2.6 + R() * 1.6, c: new THREE.Color(1, 1, 1).multiplyScalar(clamp(light, .45, 1.15))});
    }
  }
  // buttress roots that run into the ground, merged with the trunks
  const roots = [];
  for (const t of [...trees, {x: HOME.x, z: HOME.z, r: 1.25}]) {
    const y0 = ground(t.x, t.z), n = 4 + Math.floor(R() * 3);
    for (let k = 0; k < n; k++) {
      const a = k / n * TAU + R() * .6; if (t.r > 1 && Math.abs(Math.sin(a) - 1) < .25) continue;     // keep the den doorstep free
      const L = (.9 + R() * .9) * (t.r > 1 ? 1.6 : t.r * 1.9), r0 = t.r * (t.r > 1 ? .5 : .42);
      const pts = [0, .35, .7, 1].map(s => new THREE.Vector3(t.x + Math.cos(a) * (t.r * .8 + s * L), 0, t.z + Math.sin(a) * (t.r * .8 + s * L)));
      pts.forEach((p, i) => p.y = ground(p.x, p.z) + (1 - i / 3) ** 1.6 * r0 * 1.5 - .1);
      const g = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 10, r0, 7, false), q = g.attributes.position;
      for (let i = 0; i < q.count; i++) { const s = Math.floor(i / 8) / 10; const c = pts[0].clone().lerp(pts[3], s); const k = 1 - s * .9; q.setXYZ(i, lerp(c.x, q.getX(i), k), lerp(c.y, q.getY(i), k), lerp(c.z, q.getZ(i), k)); }
      g.computeVertexNormals(); tintGeo(g, () => barkC.clone().lerp(mossC, .25)); roots.push(g);
    }
  }
  const trunkMesh = new THREE.Mesh(merge([...trunkGeos, ...roots]), new THREE.MeshLambertMaterial({map: barkTex, vertexColors: true}));
  trunkMesh.name = 'trunks+roots'; trunkMesh.castShadow = trunkMesh.receiveShadow = true; scene.add(trunkMesh);
  const leafMat = new THREE.MeshBasicMaterial({map: leafTex, alphaTest: .5, side: THREE.DoubleSide});
  instanced(new THREE.PlaneGeometry(1, 1), leafMat, leafCards, {shadow: true, receive: false, depth: alphaDepth(leafTex), name: 'leaf cards'});
}

/* ---------- den door, round window, lanterns ---------- */
{
  const y0 = ground(HOME.x, HOME.z + 2.3) - .02;
  const doorTex = canvasTex(256, 352, (c, w, h) => {
    c.fillStyle = '#6e4224'; c.fillRect(0, 0, w, h); const pw = w / 5;
    for (let i = 0; i < 5; i++) { const g2 = c.createLinearGradient(0, 0, 0, h); g2.addColorStop(0, i % 2 ? '#cf9152' : '#c88a4e'); g2.addColorStop(1, i % 2 ? '#a86c38' : '#a26634'); c.fillStyle = g2; c.fillRect(i * pw + 2, 0, pw - 4, h); c.fillStyle = 'rgba(255,230,190,.14)'; c.fillRect(i * pw + 6, 0, 3, h); }
    c.fillStyle = '#2f2621'; for (const y of [h * .24, h * .76]) { c.beginPath(); c.moveTo(w, y - 9); c.lineTo(w * .34, y - 9); c.lineTo(w * .26, y); c.lineTo(w * .34, y + 9); c.lineTo(w, y + 9); c.fill(); }
    c.fillStyle = '#8a6420'; c.beginPath(); c.roundRect(w * .3, h * .5, w * .4, h * .075, 5); c.fill(); c.fillStyle = '#d9ab4c'; c.beginPath(); c.roundRect(w * .31, h * .505, w * .38, h * .065, 4); c.fill(); c.fillStyle = '#5a4214'; c.fillRect(w * .36, h * .525, w * .28, h * .022);
    c.fillStyle = '#8a6420'; c.beginPath(); c.arc(w * .15, h * .6, 13, 0, TAU); c.fill(); c.fillStyle = '#e6bb58'; c.beginPath(); c.arc(w * .15, h * .6, 10, 0, TAU); c.fill(); c.fillStyle = '#fff3c0'; c.beginPath(); c.arc(w * .14, h * .59, 3, 0, TAU); c.fill();
  });
  const arch = new THREE.Shape(); arch.moveTo(-.62, 0); arch.lineTo(-.62, 1.32); arch.absarc(0, 1.32, .62, Math.PI, 0, true); arch.lineTo(.62, 0); arch.lineTo(-.62, 0);
  const sg = new THREE.ShapeGeometry(arch, 20), uv = sg.attributes.uv, pp = sg.attributes.position; for (let i = 0; i < uv.count; i++) uv.setXY(i, (pp.getX(i) + .62) / 1.24, pp.getY(i) / 1.94);
  const door = new THREE.Mesh(sg, new THREE.MeshLambertMaterial({map: doorTex})); door.position.set(HOME.x, y0, HOME.z + 2.33); door.receiveShadow = true; scene.add(door);
  const frameGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([[-.74, -.05], [-.74, 1.3], [-.52, 1.86], [0, 2.06], [.52, 1.86], [.74, 1.3], [.74, -.05]].map(([x, y]) => new THREE.Vector3(x, y, 0))), 40, .12, 8);
  const frame = new THREE.Mesh(frameGeo, new THREE.MeshLambertMaterial({color: '#7a4a28', map: barkTex})); frame.position.copy(door.position); frame.position.z += .02; frame.castShadow = true; scene.add(frame);
  const step = new THREE.Mesh(new THREE.CylinderGeometry(.9, 1, .16, 20, 1), new THREE.MeshLambertMaterial({color: '#9a8a74', map: grainTex})); step.scale.z = .55; step.position.set(HOME.x, y0 + .02, HOME.z + 2.8); step.receiveShadow = true; scene.add(step);
  const winTex = canvasTex(128, 128, (c, w, h) => { const g2 = c.createRadialGradient(w / 2, h / 2, 4, w / 2, h / 2, w / 2); g2.addColorStop(0, '#fff6d0'); g2.addColorStop(.6, '#ffd987'); g2.addColorStop(1, '#e8a24a'); c.fillStyle = g2; c.fillRect(0, 0, w, h); c.strokeStyle = '#7a4a28'; c.lineWidth = 8; c.beginPath(); c.moveTo(w / 2, 0); c.lineTo(w / 2, h); c.moveTo(0, h / 2); c.lineTo(w, h / 2); c.stroke(); });
  const wx = 1.5, wy = 2.7, wz = Math.sqrt(2.62 ** 2 - wx * wx) + .02, a = Math.atan2(wx, wz);
  const win = new THREE.Mesh(new THREE.CircleGeometry(.36, 28), new THREE.MeshBasicMaterial({map: winTex})); win.position.set(HOME.x + wx, y0 + wy, HOME.z + wz); win.rotation.y = a; scene.add(win);
  const wf = new THREE.Mesh(new THREE.TorusGeometry(.38, .09, 8, 28), new THREE.MeshLambertMaterial({color: '#7a4a28'})); wf.position.copy(win.position); wf.rotation.y = a; scene.add(wf);
  for (const sx of [-1, 1]) {
    const lp = new THREE.Vector3(HOME.x + sx * 1.05, y0 + 1.75, HOME.z + 2.42);
    const lamp = new THREE.Mesh(new THREE.CylinderGeometry(.11, .13, .26, 8), new THREE.MeshBasicMaterial({color: '#ffd889'})); lamp.position.copy(lp); scene.add(lamp);
    const cap = new THREE.Mesh(new THREE.ConeGeometry(.17, .14, 8), new THREE.MeshLambertMaterial({color: '#4a3020'})); cap.position.copy(lp).y += .2; scene.add(cap);
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({map: glowTex, blending: THREE.AdditiveBlending, depthWrite: false, opacity: .55})); halo.position.copy(lp); halo.scale.setScalar(1.1); scene.add(halo);
  }
}

/* ---------- ground cover: grass, ferns, flowers, clover, leaf litter, reeds ---------- */
function scatter(n, accept, make) { const out = []; let tries = 0; while (out.length < n && tries++ < n * 30) { const x = -26 + R() * 50, z = -40 + R() * 54; const b = brookAt(x, z), p = pathAt(x, z); if (!accept(x, z, b, p)) continue; out.push(make(x, z, ground(x, z, b, p), b, p)); } return out; }
const nearTree = (x, z) => trees.reduce((m, t) => Math.min(m, Math.hypot(t.x - x, t.z - z) - t.r), Math.hypot(x - HOME.x, z - HOME.z) - 2.4);
const inView = (x, z) => z < 15 && z > -42 && x > -24 && x < 26;
// grass: crossed cards with many drawn blades (4 triangles show ~40 blades), normals up so they shade softly
{
  const grassTex = canvasTex(256, 128, (g, w, h) => {
    const r = rng(17);
    for (let i = 0; i < 130; i++) {
      const x = 8 + r() * (w - 16), hh = h * (.3 + r() * .66), lean = (r() - .5) * 50, bw = 1.8 + r() * 2.6, v = r();
      const gr = g.createLinearGradient(0, h, 0, h - hh); gr.addColorStop(0, v < .5 ? '#6c9a39' : '#78a540'); gr.addColorStop(.55, v < .5 ? '#8fb84b' : '#9ec456'); gr.addColorStop(1, v < .35 ? '#e0e69a' : '#c2d872');
      g.fillStyle = gr; g.beginPath(); g.moveTo(x - bw, h); g.quadraticCurveTo(x + lean * .3, h - hh * .6, x + lean, h - hh); g.quadraticCurveTo(x + lean * .3 + bw * .4, h - hh * .55, x + bw, h); g.fill();
    }
  });
  const q1 = new THREE.PlaneGeometry(.62, .3), q2 = q1.clone().rotateY(Math.PI / 2), q3 = q1.clone().rotateY(Math.PI / 4);
  const card = merge([q1, q2, q3]); card.translate(0, .15, 0); upNormals(card);
  const list = scatter(7000, (x, z, b, p) => inView(x, z) && b.d > b.w / 2 + .3 && p.d > p.w / 2 - .1 + (R() - .5) * .3 && Math.hypot(x - HOME.x, z - HOME.z) > 2.7, (x, z, y) => {
    const v = .82 + R() * .3, warm = fbm(x * .05 + 9, z * .05); return {x, y: y - .02, z, ry: R() * TAU, sx: .8 + R() * .6, sy: .7 + R() * .8, sz: .8 + R() * .6, c: new THREE.Color(v * (1 + warm * .12), v, v * .86)};
  });
  instanced(card, foliage(new THREE.MeshLambertMaterial({map: grassTex, alphaTest: .5, side: THREE.DoubleSide, vertexColors: false})), list, {name: 'grass'});
  stats.parts.grass = list.length;
}
// ferns: eight bent fronds with drawn pinnae
{
  const fronds = [];
  for (let k = 0; k < 8; k++) {
    const g = new THREE.PlaneGeometry(.34, 1, 1, 5), p = g.attributes.position; g.translate(0, .5, 0);
    for (let i = 0; i < p.count; i++) { const y = p.getY(i); p.setXYZ(i, p.getX(i), Math.sin(y * 1.9) * .62, y * .9 + y * y * .25); }
    g.rotateY(k / 8 * TAU + R() * .3); g.computeVertexNormals(); fronds.push(upNormals(g));
  }
  const fern = merge(fronds);
  const list = scatter(320, (x, z, b, p) => inView(x, z) && p.d > p.w / 2 + .5 && b.d > b.w / 2 + .15 && (nearTree(x, z) < 3.2 || b.d < b.w / 2 + 1.6 || fbm(x * .2, z * .2) > .64), (x, z, y) => ({x, y, z, ry: R() * TAU, s: .7 + R() * .6, c: new THREE.Color().setHSL(.25, .35, .62 + R() * .12)}));
  instanced(fern, foliage(new THREE.MeshLambertMaterial({map: fernTex, alphaTest: .45, side: THREE.DoubleSide})), list, {shadow: true, depth: alphaDepth(fernTex), name: 'ferns'});
}
// flowers in drifts: daisies, buttercups, bellflower spikes, campion
{
  const fmat = foliage(new THREE.MeshLambertMaterial({map: flowerTex, alphaTest: .5, side: THREE.DoubleSide}));
  for (let kind = 0; kind < 4; kind++) {
    const q1 = new THREE.PlaneGeometry(.3, .3), q2 = q1.clone().rotateY(Math.PI / 2), g = merge([q1, q2]); g.translate(0, .15 + (kind === 2 ? .12 : 0), 0);
    const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setX(i, (kind + uv.getX(i)) / 4);
    upNormals(g);
    const centre = [[-6, 4], [2, 6], [-9, -5], [10, -6], [-4, 9], [14, 7], [-1, -14], [4, -6]];
    const list = scatter(110, (x, z, b, p) => inView(x, z) && p.d > p.w / 2 + .2 && b.d > b.w / 2 + .3 && centre.some(([cx, cz]) => Math.hypot(cx + kind * 1.7 - x, cz - kind * 1.3 - z) < 1.4 + fbm(x, z) * 1.6), (x, z, y) => ({x, y: y + (kind === 1 ? .05 : 0), z, ry: R() * TAU, s: (kind === 2 ? 1.15 : 1) * (.8 + R() * .5)}));
    instanced(g, fmat, list, {colors: false});
  }
}
// clover patches and fallen leaves along the trails
{
  const quad = new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2); upNormals(quad);
  instanced(quad, new THREE.MeshLambertMaterial({map: cloverTex, alphaTest: .5}), scatter(260, (x, z, b, p) => inView(x, z) && p.d > p.w / 2 && b.d > b.w / 2 + .4, (x, z, y) => ({x, y: y + .03, z, ry: R() * TAU, s: .9 + R() * 1.2})), {colors: false});
  instanced(quad, new THREE.MeshLambertMaterial({map: litterTex, alphaTest: .5}), scatter(150, (x, z, b, p) => inView(x, z) && p.d < p.w / 2 + .1, (x, z, y) => ({x, y: y + .035, z, ry: R() * TAU, s: .55 + R() * .5})), {colors: false});
}
// reeds and cattails in clusters along the banks
{
  const bl = [];
  for (let k = 0; k < 9; k++) {
    const a = R() * TAU, h = .7 + R() * .6, g = new THREE.PlaneGeometry(.05, h, 1, 3); g.translate(0, h / 2, 0); const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) { const y = p.getY(i) / h; p.setX(i, p.getX(i) * (1 - y * .8) + y * y * .18); }
    g.rotateY(a); g.translate(Math.cos(a) * .08, 0, Math.sin(a) * .08); tintGeo(g, (x, y) => col('#3f6a30').lerp(col('#a8c06a'), y / h)); bl.push(g);
  }
  for (let k = 0; k < 2; k++) { const g = new THREE.CylinderGeometry(.025, .025, .12, 6); g.translate((k - .5) * .12, 1.2 + k * .1, 0); tintGeo(g, () => col('#6a3e22')); bl.push(g); }
  const reed = merge(bl); upNormals(reed);
  const list = []; for (let i = 0; i < BN; i += 3) { const t = i / BN, p = brookS[i]; if (fbm(t * 30, 2) < .55) continue; const w = brookW(t) / 2;
    for (const s of [-1, 1]) { if (R() < .45) continue; const q = brookS[Math.min(BN, i + 1)], dir = new THREE.Vector3().subVectors(q, p).normalize(); const off = w + .05 + R() * .4; const x = p.x - dir.z * off * s, z = p.z + dir.x * off * s; if (!inView(x, z) || pathAt(x, z).d < 1.2) continue; list.push({x, y: ground(x, z) - .05, z, ry: R() * TAU, s: .8 + R() * .5}); } }
  instanced(reed, foliage(new THREE.MeshLambertMaterial({vertexColors: true, side: THREE.DoubleSide})), list, {colors: false, name: 'reeds'});
}

/* ---------- rocks, pebbles, stepping stones, mushrooms, a fallen log ---------- */
function rockGeo(seed, detail = 2) {
  const g = new THREE.IcosahedronGeometry(1, detail), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const v = new THREE.Vector3(p.getX(i), p.getY(i), p.getZ(i)); const k = .78 + .35 * fbm(v.x * 1.3 + seed, v.y * 1.3 + v.z); v.multiplyScalar(k); v.y *= .62; p.setXYZ(i, v.x, v.y, v.z); }
  g.computeVertexNormals(); { const n0 = g.attributes.normal, pp = g.attributes.position; for (let i = 0; i < pp.count; i++) { const v = new THREE.Vector3(pp.getX(i), pp.getY(i) / .62 * .8, pp.getZ(i)).normalize(); const f = new THREE.Vector3(n0.getX(i), n0.getY(i), n0.getZ(i)); v.lerp(f, .25).normalize(); n0.setXYZ(i, v.x, v.y, v.z); } }
  const n = g.attributes.normal;
  return tintGeo(g, (x, y, z, i) => col('#8e8a80').lerp(col('#6f6c62'), fbm(x * 3, z * 3)).lerp(col('#8aa457'), sstep(.75, .95, n.getY(i) + (fbm(x * 4 + seed, z * 4) - .5) * .7) * .85));
}
{
  const rocks = [];
  for (let i = 0; i < BN; i += 4) { const t = i / BN, p = brookS[i]; if (fbm(t * 22, 7) < .5) continue; const q = brookS[Math.min(BN, i + 1)], dir = new THREE.Vector3().subVectors(q, p).normalize(); const s = R() < .5 ? -1 : 1, off = brookW(t) / 2 + (R() - .3) * .6; const x = p.x - dir.z * off * s, z = p.z + dir.x * off * s; if (!inView(x, z) || pathAt(x, z).d < 1) continue; rocks.push({x, y: ground(x, z) + .02, z, ry: R() * TAU, s: .22 + R() * .4}); }
  rocks.push(...scatter(26, (x, z, b, p) => inView(x, z) && p.d > p.w / 2 + .8 && b.d > b.w / 2 + 1 && nearTree(x, z) < 4, (x, z, y) => ({x, y: y + .05, z, ry: R() * TAU, s: .3 + R() * .7})));
  rocks.push({x: -7.6, y: ground(-7.6, -2.4) + .25, z: -2.4, ry: .4, sx: 1.05, sy: .95, sz: .9});      // the owl's rock
  instanced(rockGeo(1, 2), new THREE.MeshLambertMaterial({vertexColors: true, map: grainTex}), rocks, {shadow: true, colors: false, name: 'rocks'});
  const pebbles = []; for (let i = 0; i < 900; i++) { const t = R(), j = Math.round(t * BN), p = brookS[j]; const q = brookS[Math.min(BN, j + 1)], dir = new THREE.Vector3().subVectors(q, p).normalize(); const off = (R() * 2 - 1) * brookW(t) / 2 * .9; const x = p.x - dir.z * off, z = p.z + dir.x * off; if (!inView(x, z)) continue; const v = .7 + R() * .5; pebbles.push({x, y: ground(x, z) + .02, z, ry: R() * TAU, s: .05 + R() * .08, c: new THREE.Color(v, v * .95, v * .85)}); }
  instanced(rockGeo(9, 0), new THREE.MeshLambertMaterial({vertexColors: true}), pebbles, {name: 'pebbles'});
  stats.parts.pebbles = pebbles.length;
}
{
  const mk = (capColor, dots) => {
    const cap = new THREE.LatheGeometry([[0, .16], [.12, .155], [.17, .12], [.18, .09], [.15, .085], [0, .09]].map(([r, y]) => new THREE.Vector2(r, y)), 16);
    const capTex = canvasTex(128, 64, (g, w, h) => { g.fillStyle = capColor; g.fillRect(0, 0, w, h); if (dots) { g.fillStyle = '#fff6e8'; for (let i = 0; i < 18; i++) { g.beginPath(); g.arc(Math.random() * w, Math.random() * h * .55, 2 + Math.random() * 3, 0, TAU); g.fill(); } } });
    const stem = new THREE.CylinderGeometry(.035, .05, .1, 8); stem.translate(0, .05, 0); tintGeo(stem, () => col('#f2e8d6'));
    return {cap, capTex, stem};
  };
  const near = scatter(70, (x, z, b, p) => inView(x, z) && nearTree(x, z) < 1.6 && p.d > p.w / 2 + .3, (x, z, y) => ({x, y, z, ry: R() * TAU, s: .9 + R() * 1.2}));
  const red = mk('#c8352a', true), brown = mk('#8a5a2e', false);
  [red, brown].forEach((m, k) => { const l = near.filter((_, i) => i % 2 === k); instanced(m.cap, new THREE.MeshLambertMaterial({map: m.capTex}), l, {shadow: true, colors: false}); instanced(m.stem, new THREE.MeshLambertMaterial({vertexColors: true}), l, {colors: false}); });
  // a mossy fallen log by the water
  const logCurve = new THREE.CatmullRomCurve3([[-5.2, -9.4], [-3.4, -8.9], [-1.6, -9.6]].map(([x, z]) => new THREE.Vector3(x, ground(x, z) + .24, z)));
  const log = new THREE.TubeGeometry(logCurve, 16, .3, 12, false); tintGeo(log, (x, y, z, i) => { const n = log.attributes.normal; return col('#ffffff').lerp(col('#7aa64a'), sstep(.3, .8, n.getY(i))); });
  const logMesh = new THREE.Mesh(log, new THREE.MeshLambertMaterial({map: barkTex, vertexColors: true})); logMesh.castShadow = logMesh.receiveShadow = true; scene.add(logMesh);
}
// stepping stones across the brook downstream, and flat stones on the trail
{
  const stones = [];
  { const t = .735, j = Math.round(t * BN), p = brookS[j], q = brookS[j + 1], dir = new THREE.Vector3().subVectors(q, p).normalize(); for (let k = -2; k <= 2; k++) { const off = k * .42; stones.push({x: p.x - dir.z * off + (R() - .5) * .1, y: brookLevel(t) + .02, z: p.z + dir.x * off, ry: R() * TAU, sx: .28, sy: .2, sz: .24}); } }
  for (const pa of paths.slice(0, 2)) for (let i = 4; i < pa.s.length; i += 9) { const p = pa.s[i]; if (!inView(p.x, p.z) || brookAt(p.x, p.z).d < 2) continue; stones.push({x: p.x + (R() - .5) * .4, y: ground(p.x, p.z) + .01, z: p.z + (R() - .5) * .4, ry: R() * TAU, sx: .2 + R() * .12, sy: .06, sz: .16 + R() * .1}); }
  { const sg = rockGeo(4); tintGeo(sg, (x, y, z) => col('#b9ad98').lerp(col('#948a7a'), fbm(x * 3 + 4, z * 3))); instanced(sg, new THREE.MeshLambertMaterial({vertexColors: true, map: grainTex}), stones, {shadow: true, colors: false, name: 'stones'}); }
}

/* ---------- a small arched footbridge where the trail meets the brook ---------- */
let bridgePos;
{
  const pa = paths[1]; let best = {d: 1e9};
  pa.s.forEach((p, i) => { const b = brookAt(p.x, p.z); if (b.d < best.d) best = {d: b.d, i, b}; });
  const c = pa.s[best.i], a = pa.s[Math.max(0, best.i - 4)], b = pa.s[Math.min(pa.s.length - 1, best.i + 4)];
  const dir = new THREE.Vector3().subVectors(b, a).setY(0).normalize(), side = new THREE.Vector3(-dir.z, 0, dir.x), span = best.b.w + 2.0, top = best.b.level + .62;
  bridgePos = c.clone(); bridgePos.y = top;
  const parts = [], wood = col('#ffffff');
  for (let k = 0; k <= 10; k++) {
    const s = k / 10 - .5, along = s * span, h = top - (best.b.level + .36) * 0 - Math.pow(s * 2, 2) * .42;
    const g = new THREE.BoxGeometry(.22, .07, 1.05); const m = new THREE.Matrix4().makeRotationY(Math.atan2(dir.x, dir.z)); g.applyMatrix4(m);
    g.translate(c.x + dir.x * along, h + (best.b.level + .36 - top) * 0 + Math.max(0, ground(c.x + dir.x * along, c.z + dir.z * along) + .04 - h) * 0, c.z + dir.z * along); tintGeo(g, () => wood.clone().multiplyScalar(.9 + R() * .2)); parts.push(g);
  }
  for (const sd of [-1, 1]) {
    const railPts = []; for (let k = 0; k <= 8; k++) { const s = k / 8 - .5, along = s * span * .92, h = top - Math.pow(s * 2, 2) * .42 + .62; railPts.push(new THREE.Vector3(c.x + dir.x * along + side.x * .5 * sd, h, c.z + dir.z * along + side.z * .5 * sd)); }
    const rail = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(railPts), 24, .045, 6); tintGeo(rail, () => wood); parts.push(rail);
    for (const s of [-.46, -.15, .15, .46]) { const along = s * span * .92, h = top - Math.pow(s * 2, 2) * .42; const post = new THREE.CylinderGeometry(.045, .055, .66, 6); post.translate(c.x + dir.x * along + side.x * .5 * sd, h + .3, c.z + dir.z * along + side.z * .5 * sd); tintGeo(post, () => wood.clone().multiplyScalar(.85)); parts.push(post); }
  }
  const bridge = new THREE.Mesh(merge(parts), new THREE.MeshLambertMaterial({map: woodTex, vertexColors: true})); bridge.castShadow = bridge.receiveShadow = true; scene.add(bridge);
  bridgePos.dir = dir; bridgePos.side = side; bridgePos.span = span;
}

/* ---------- characters ---------- */
const friends = {};
const PLUSH = P.get('plush') !== '0', NEAR = VIEW === 'close' ? ['fox', 'squirrel'] : VIEW === 'log' ? ['squirrel'] : ['fox'];
const plushName = {mailman: 'hare', bird: 'bluetit'};
function place(kind, height, x, z, yaw, yOff = 0, state = {}) {
  if (P.get('chars') === '0') return {group: new THREE.Group(), update() {}};
  let rig;
  if (PLUSH) {
    const c = plush[plushName[kind] || kind]({detail: NEAR.includes(kind) ? (VIEW === 'close' ? 1 : .8) : .6});
    const box = new THREE.Box3().setFromObject(c.group), k = height / (box.max.y - box.min.y);
    c.group.scale.setScalar(k); const wrap = new THREE.Group(); wrap.add(c.group); c.group.position.y = -box.min.y * k; rig = {group: wrap};
  } else { rig = characters[kind](height); rig.update(.016, {reduced: true, ...state}); }
  rig.group.userData.kind = kind; rig.group.position.set(x, (yOff === 'abs' ? 0 : ground(x, z) + yOff), z); if (yOff === 'abs') rig.group.position.y = state.y; rig.group.rotation.y = yaw; scene.add(rig.group);
  rig.group.traverse(o => { if (o.isMesh) o.castShadow = true; });
  const blob = new THREE.Mesh(new THREE.CircleGeometry(height * .32, 24), new THREE.MeshBasicMaterial({map: glowTex, color: '#2a1a0c', transparent: true, opacity: .45, depthWrite: false}));
  blob.rotation.x = -Math.PI / 2; blob.position.set(x, rig.group.position.y + .02, z); scene.add(blob);
  friends[kind] = rig; return rig;
}

/* ---------- a fallen tree across the brook: the second bridge ---------- */
let logTop;
{
  let bi = 0, bd = 1e9; brookS.forEach((p, i) => { const d = Math.abs(p.z + 7.4); if (d < bd && p.x > 3) { bd = d; bi = i; } });
  const t = bi / BN, c = brookS[bi], q = brookS[Math.min(BN, bi + 3)], o = brookS[Math.max(0, bi - 3)];
  const dir = new THREE.Vector3().subVectors(q, o).setY(0).normalize(), side = new THREE.Vector3(-dir.z, 0, dir.x), half = brookW(t) / 2 + 1.5, top = brookLevel(t) + .34;
  const a = c.clone().addScaledVector(side, -half), b = c.clone().addScaledVector(side, half * 1.05).addScaledVector(dir, .35);
  const ya = ground(a.x, a.z) + .3, yb = ground(b.x, b.z) + .24;
  const pts = [0, .25, .5, .75, 1].map(u => { const p = a.clone().lerp(b, u); p.y = THREE.MathUtils.lerp(ya, yb, u) - Math.sin(u * Math.PI) * .06; p.x += Math.sin(u * 5) * .06; return p; });
  const curve = new THREE.CatmullRomCurve3(pts), seg = 40, rad = 8, geo = new THREE.TubeGeometry(curve, seg, .34, 14, false), pp = geo.attributes.position;
  // taper toward the broken end and add bark bumps
  for (let i = 0; i < pp.count; i++) { const ring = Math.floor(i / 15), u = ring / seg, cpt = curve.getPointAt(u); const k = (1 - u * .28) * (1 + .06 * Math.sin(i * 1.7) ); pp.setXYZ(i, cpt.x + (pp.getX(i) - cpt.x) * k, cpt.y + (pp.getY(i) - cpt.y) * k, cpt.z + (pp.getZ(i) - cpt.z) * k); }
  geo.computeVertexNormals();
  
  tintGeo(geo, (x, y, z, i) => { const n = geo.attributes.normal; return col('#f0d8c0').lerp(col('#9cc25a'), sstep(.45, .8, n.getY(i) + (fbm(x * 3, z * 3) - .5) * .6) * .95); });
  // the root plate at the uprooted end, with roots fanning out and a little earth
  const parts = [geo];
  const plate = new THREE.SphereGeometry(.62, 18, 12); plate.scale(.35, 1, 1); const ax = new THREE.Vector3().subVectors(a, b).normalize();
  plate.applyMatrix4(new THREE.Matrix4().makeRotationY(Math.atan2(ax.x, ax.z) + Math.PI / 2)); plate.translate(a.x + ax.x * .1, ya + .12, a.z + ax.z * .1);
  tintGeo(plate, (x, y, z) => col('#c9a27a').lerp(col('#a07a54'), fbm(x * 5, y * 5 + z))); parts.push(plate);
  for (let k = 0; k < 9; k++) { const ang = k / 9 * TAU; const r0 = new THREE.Vector3(a.x + ax.x * .05, ya + .12 + Math.sin(ang) * .35, a.z + ax.z * .05).addScaledVector(new THREE.Vector3(-ax.z, 0, ax.x), Math.cos(ang) * .35);
    const r1 = r0.clone().add(new THREE.Vector3(-ax.z, 0, ax.x).multiplyScalar(Math.cos(ang) * .45)).add(new THREE.Vector3(0, Math.sin(ang) * .4, 0)).addScaledVector(ax, .25);
    const rg = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([r0, r0.clone().lerp(r1, .5).addScaledVector(ax, .1), r1]), 6, .045 - k * .002, 5); tintGeo(rg, () => col('#d9b896')); parts.push(rg); }
  const logTex = canvasTex(512, 128, (g, w, h) => { g.fillStyle = '#9a6740'; g.fillRect(0, 0, w, h); const r = rng(31); for (let i = 0; i < 220; i++) { const y = r() * h, x = r() * w, l = 40 + r() * 160; g.strokeStyle = r() < .55 ? 'rgba(70,40,20,.45)' : 'rgba(200,150,100,.35)'; g.lineWidth = 1.5 + r() * 3; g.beginPath(); g.moveTo(x, y); g.bezierCurveTo(x + l * .3, y + 3, x + l * .6, y - 3, x + l, y + 1); g.stroke(); } }, {repeat: [3, 2]});
  const logMesh = new THREE.Mesh(merge(parts), new THREE.MeshLambertMaterial({map: logTex, vertexColors: true})); logMesh.name = 'log bridge'; logMesh.castShadow = logMesh.receiveShadow = true; scene.add(logMesh);
  // shelf fungi and a few mushrooms on the log
  const fungus = new THREE.CylinderGeometry(.12, .1, .03, 14, 1); tintGeo(fungus, () => col('#e9c68a'));
  const fl = []; for (const u of [.3, .36, .7]) { const p = curve.getPointAt(u); fl.push({x: p.x + side.x * .26, y: p.y + .02 + u * .05, z: p.z + side.z * .26, ry: R() * TAU, s: .9 + R() * .4}); }
  instanced(fungus, new THREE.MeshLambertMaterial({vertexColors: true}), fl, {shadow: true, colors: false});
  logTop = {curve, side, dir};
}

/* ---------- characters ---------- */
const fox = place('fox', 1.0, 3.25, -.2, .22);
if (!PLUSH && VIEW !== 'close') setDetail(14, 10);
place('owl', .78, -7.6, -2.4, .55, .78);
{ const p = logTop.curve.getPointAt(.5); place('squirrel', .62, p.x, p.z, .25, 'abs', {y: p.y + .31}); }
place('mailman', 1.08, -1.0, 2.6, .35);
place('mouse', .36, 10.4, 2.2, -.9);
place('beaver', .72, 9.9, 10.8, -.6);
if (P.get('chars') !== '0') { const b = bridgePos; place('bird', .3, b.x + b.dir.x * .9 + b.side.x * .5, b.z + b.dir.z * .9 + b.side.z * .5, 2.2, 'abs', {y: b.y + .58}); }

/* ---------- atmosphere: light shafts, pollen, butterflies, fireflies to the invited friend ---------- */
{
  const shaftTex = canvasTex(64, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgba(255,236,180,0)'); gr.addColorStop(.25, 'rgba(255,236,180,.8)'); gr.addColorStop(1, 'rgba(255,236,180,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); const hg = g.createLinearGradient(0, 0, w, 0); hg.addColorStop(0, 'rgba(0,0,0,1)'); hg.addColorStop(.5, 'rgba(0,0,0,0)'); hg.addColorStop(1, 'rgba(0,0,0,1)'); g.globalCompositeOperation = 'destination-out'; g.fillStyle = hg; g.fillRect(0, 0, w, h); });
  const sm = new THREE.MeshBasicMaterial({map: shaftTex, transparent: true, opacity: .16, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false});
  for (const [x, z, w] of [[-4, -14, 2.6], [3, -18, 3.4], [10, -12, 2.4], [-11, -9, 2.2], [6, -26, 4]]) { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, 22), sm); m.position.set(x, 9, z); m.rotation.set(0, .5, .48); scene.add(m); }
  const n = 260, pp = new Float32Array(n * 3); for (let i = 0; i < n; i++) { pp[i * 3] = -14 + R() * 30; pp[i * 3 + 1] = .4 + R() * 5; pp[i * 3 + 2] = -20 + R() * 30; }
  const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pp, 3));
  scene.add(new THREE.Points(pg, new THREE.PointsMaterial({size: .07, map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: .8})));
  const bfTex = canvasTex(64, 64, (g, w, h) => { for (const s of [-1, 1]) { g.fillStyle = '#f39a3a'; g.beginPath(); g.ellipse(w / 2 + s * 13, h / 2 - 6, 13, 16, s * .4, 0, TAU); g.fill(); g.fillStyle = '#e7792a'; g.beginPath(); g.ellipse(w / 2 + s * 10, h / 2 + 12, 9, 10, -s * .3, 0, TAU); g.fill(); g.fillStyle = '#3a2416'; g.beginPath(); g.arc(w / 2 + s * 16, h / 2 - 12, 2.5, 0, TAU); g.fill(); } g.fillStyle = '#3a2416'; g.fillRect(w / 2 - 2, h / 2 - 14, 4, 28); });
  for (const [x, y, z] of [[-5.5, 1.3, 3], [6, 1.6, 5], [-1, 2.1, -5], [12, 1.4, -3]]) { const s = new THREE.Sprite(new THREE.SpriteMaterial({map: bfTex})); s.position.set(x, ground(x, z) + y, z); s.scale.setScalar(.32); scene.add(s); }
  // fireflies: a short trail from Fuchs toward the invited friend (the squirrel)
  const a = new THREE.Vector3(3.25, 0, -.2), b = logTop.curve.getPointAt(.5).setY(0);
  for (let k = 0; k < 7; k++) { const p = a.clone().lerp(b, .12 + k * .11); p.x += Math.sin(k * 1.9) * .35; const s = new THREE.Sprite(new THREE.SpriteMaterial({map: glowTex, blending: THREE.AdditiveBlending, depthWrite: false})); s.position.set(p.x, ground(p.x, p.z) + .5 + Math.sin(k * 2.3) * .18, p.z); s.scale.setScalar(.26 - k * .015); s.material.opacity = .8; scene.add(s); }
}

/* ---------- cameras ---------- */
const cam = new THREE.PerspectiveCamera(42, W / H, .1, 160);
const views = {
  hero: {pos: [3.6, 7.4, 12.8], look: [.6, .3, -3.4], fov: 42},
  close: {pos: [4.15, 1.3, 3.0], look: [3.15, .62, -.6], fov: 40},
  brook: {pos: [12.5, 3.2, 14.5], look: [7.2, -.2, 4.0], fov: 46},
};
{ const c0 = logTop.curve.getPointAt(.5); const pos = c0.clone().addScaledVector(logTop.dir, 4.4).addScaledVector(logTop.side, -1.6); pos.y += 2.5; views.log = {pos: pos.toArray(), look: [c0.x, c0.y + .25, c0.z], fov: 42}; }
const v = views[VIEW] || views.hero; cam.position.set(...v.pos); cam.fov = v.fov; cam.updateProjectionMatrix(); cam.lookAt(...v.look);
if (VIEW === 'close' || VIEW === 'log') scene.fog.near = 30;
fill.position.copy(cam.position).add(new THREE.Vector3(0, 4, 0)); fill.target.position.set(...v.look);

/* ---------- render, stats and HUD anchors ---------- */
renderer.render(scene, cam);       // first frame also bakes the shadow map
renderer.info.autoReset = false; renderer.info.reset();
renderer.render(scene, cam);
stats.calls = renderer.info.render.calls; stats.triangles = renderer.info.render.triangles; stats.geometries = renderer.info.memory.geometries; stats.textures = renderer.info.memory.textures; stats.programs = renderer.info.programs.length;
stats.size = [renderer.domElement.width, renderer.domElement.height];
const tri = g => (g.index ? g.index.count : g.attributes.position.count) / 3; stats.tris = {};
scene.traverse(o => { if (!o.isMesh || !o.visible) return; let k = o.name || 'other'; let p = o; while (p.parent && p.parent !== scene) p = p.parent; if (p.userData.kind) k = 'char:' + p.userData.kind; stats.tris[k] = (stats.tris[k] || 0) + tri(o.geometry) * (o.isInstancedMesh ? o.count : 1); });
for (const k in stats.tris) stats.tris[k] = Math.round(stats.tris[k]);
const project = (o, dy) => { const p = o.clone(); p.y += dy; p.project(cam); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H]; };
stats.anchors = {
  owl: friends.owl ? project(friends.owl.group.position, 1.45) : [0, 0], squirrel: friends.squirrel ? project(friends.squirrel.group.position, 1.25) : [0, 0], door: project(new THREE.Vector3(HOME.x, ground(HOME.x, HOME.z + 2.3), HOME.z + 2.3), 3.0),
};
stats.buildMs = Math.round(performance.now() - T0); window.stats = stats; window.done = true;
console.log(JSON.stringify({buildMs: stats.buildMs, calls: stats.calls, triangles: stats.triangles, programs: stats.programs, textures: stats.textures, parts: stats.parts, tris: stats.tris}));
