/* Sculpted plush characters for the look-dev (design reference).
   Each body part is one seamless mesh: a smooth union of ellipsoids and tapered capsules
   (signed distance field), turned into triangles once with surface nets. Fur colours are
   painted as soft vertex-colour regions; a small shader adds fuzz and a velvet rim.
   Parts hang on the same joints as the game's rigs (body, head, ears, arms, legs, tail),
   so the existing animator can drive them. */
import * as THREE from '../../../vendor/three/three.module.js';

const TAU = Math.PI * 2, clamp = THREE.MathUtils.clamp;
const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const C = h => new THREE.Color(h);

/* ---------- signed distance primitives ---------- */
function smin(a, b, k) { if (k <= 0) return Math.min(a, b); const h = Math.max(k - Math.abs(a - b), 0) / k; return Math.min(a, b) - h * h * k * .25; }
function rotInv(rot) { if (!rot) return null; const m = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(...rot)); return m.invert().elements; }
function local(p, c, inv) {
  let x = p[0] - c[0], y = p[1] - c[1], z = p[2] - c[2];
  if (inv) { const e = inv; const X = e[0] * x + e[4] * y + e[8] * z, Y = e[1] * x + e[5] * y + e[9] * z, Z = e[2] * x + e[6] * y + e[10] * z; x = X; y = Y; z = Z; }
  return [x, y, z];
}
// Ellipsoid (Inigo Quilez' bound), optionally rotated.
function E(c, r, {rot = null, k = .04, sub = false} = {}) {
  const inv = rotInv(rot);
  const R = rot ? [Math.max(...r), Math.max(...r), Math.max(...r)] : r;
  return {k, sub, lo: c.map((v, i) => v - R[i]), hi: c.map((v, i) => v + R[i]), f(p) { const [x, y, z] = local(p, c, inv); const k0 = Math.hypot(x / r[0], y / r[1], z / r[2]), k1 = Math.hypot(x / (r[0] * r[0]), y / (r[1] * r[1]), z / (r[2] * r[2])); return k1 > 0 ? k0 * (k0 - 1) / k1 : -Math.min(...r); }};
}
// Tapered capsule from a (radius ra) to b (radius rb), optionally squashed along z (flat ears, paddle tails).
function T(a, b, ra, rb, {k = .04, flat = 1, sub = false} = {}) {
  const ba = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], bb = ba[0] ** 2 + ba[1] ** 2 + ba[2] ** 2;
  const m = Math.max(ra, rb);
  return {k, sub, lo: a.map((v, i) => Math.min(v, b[i]) - m), hi: a.map((v, i) => Math.max(v, b[i]) + m), f(p) { const pa = [p[0] - a[0], p[1] - a[1], (p[2] - a[2]) * flat]; const t = clamp((pa[0] * ba[0] + pa[1] * ba[1] + pa[2] * ba[2] * flat) / bb, 0, 1); return Math.hypot(pa[0] - ba[0] * t, pa[1] - ba[1] * t, pa[2] - ba[2] * t * flat) - (ra + (rb - ra) * t); }};
}
// A smooth chain of tapered capsules along points (tails, whiskers of fur, legs).
function chain(pts, radii, opts = {}) { const out = []; for (let i = 0; i < pts.length - 1; i++) out.push(T(pts[i], pts[i + 1], radii[i], radii[i + 1], {k: .05, ...opts})); return out; }
function sdf(prims) {
  const add = prims.filter(q => !q.sub), lo = [0, 1, 2].map(i => Math.min(...add.map(q => q.lo[i]))), hi = [0, 1, 2].map(i => Math.max(...add.map(q => q.hi[i])));
  const f = p => { let d = 1e9; for (const q of prims) { const v = q.f(p); d = q.sub ? -smin(-d, v, q.k) : smin(d, v, q.k); } return d; };
  f.lo = lo; f.hi = hi; return f;
}
// Soft membership of a paint region: 1 inside, 0 outside, blended over `soft`.
const inside = (prim, p, soft = .02) => 1 - sstep(-soft, soft, prim.f(p));

/* ---------- surface nets ---------- */
const CORNERS = [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0], [0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 1]];
const EDGES = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]];
function polygonize(f, {cell = .009, paint, margin = .03} = {}) {
  const lo = f.lo.map(v => v - margin), hi = f.hi.map(v => v + margin);
  const n = [0, 1, 2].map(i => Math.ceil((hi[i] - lo[i]) / cell)), [nx, ny, nz] = n, NX = nx + 1, NY = ny + 1;
  const val = new Float32Array(NX * NY * (nz + 1));
  for (let k = 0; k <= nz; k++) for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) val[i + NX * (j + NY * k)] = f([lo[0] + i * cell, lo[1] + j * cell, lo[2] + k * cell]);
  const cellV = new Int32Array(nx * ny * nz).fill(-1), pos = [];
  for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const v = CORNERS.map(([a, b, c]) => val[(i + a) + NX * ((j + b) + NY * (k + c))]);
    let mask = 0; v.forEach((x, q) => { if (x < 0) mask |= 1 << q; }); if (mask === 0 || mask === 255) continue;
    let sx = 0, sy = 0, sz = 0, cnt = 0;
    for (const [a, b] of EDGES) { if ((v[a] < 0) === (v[b] < 0)) continue; const t = v[a] / (v[a] - v[b]); const A = CORNERS[a], B = CORNERS[b]; sx += A[0] + (B[0] - A[0]) * t; sy += A[1] + (B[1] - A[1]) * t; sz += A[2] + (B[2] - A[2]) * t; cnt++; }
    cellV[i + nx * (j + ny * k)] = pos.length / 3; pos.push(lo[0] + (i + sx / cnt) * cell, lo[1] + (j + sy / cnt) * cell, lo[2] + (k + sz / cnt) * cell);
  }
  // project vertices onto the surface and compute normals from the field
  const h = cell * .5, nor = new Float32Array(pos.length), col = new Float32Array(pos.length);
  for (let q = 0; q < pos.length; q += 3) {
    let p = [pos[q], pos[q + 1], pos[q + 2]];
    for (let it = 0; it < 2; it++) { const d = f(p), g = [f([p[0] + h, p[1], p[2]]) - f([p[0] - h, p[1], p[2]]), f([p[0], p[1] + h, p[2]]) - f([p[0], p[1] - h, p[2]]), f([p[0], p[1], p[2] + h]) - f([p[0], p[1], p[2] - h])]; const l2 = (g[0] ** 2 + g[1] ** 2 + g[2] ** 2) / (4 * h * h) || 1; const s = d / l2 / (2 * h); p = [p[0] - g[0] * s, p[1] - g[1] * s, p[2] - g[2] * s]; }
    const g = [f([p[0] + h, p[1], p[2]]) - f([p[0] - h, p[1], p[2]]), f([p[0], p[1] + h, p[2]]) - f([p[0], p[1] - h, p[2]]), f([p[0], p[1], p[2] + h]) - f([p[0], p[1], p[2] - h])], l = Math.hypot(...g) || 1;
    pos[q] = p[0]; pos[q + 1] = p[1]; pos[q + 2] = p[2]; nor[q] = g[0] / l; nor[q + 1] = g[1] / l; nor[q + 2] = g[2] / l;
    const c = paint(p, [nor[q], nor[q + 1], nor[q + 2]]); col[q] = c.r; col[q + 1] = c.g; col[q + 2] = c.b;
  }
  const idx = [], cv = (i, j, k) => (i < 0 || j < 0 || k < 0 || i >= nx || j >= ny || k >= nz) ? -1 : cellV[i + nx * (j + ny * k)];
  const quad = (a, b, c, d) => {
    if (a < 0 || b < 0 || c < 0 || d < 0) return;
    const P = i => [pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]], A = P(a), B = P(b), Cc = P(c);
    const u = [B[0] - A[0], B[1] - A[1], B[2] - A[2]], w = [Cc[0] - A[0], Cc[1] - A[1], Cc[2] - A[2]], fn = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]];
    const nn = [0, 1, 2].map(e => nor[a * 3 + e] + nor[b * 3 + e] + nor[c * 3 + e] + nor[d * 3 + e]);
    if (fn[0] * nn[0] + fn[1] * nn[1] + fn[2] * nn[2] >= 0) idx.push(a, b, c, a, c, d); else idx.push(a, c, b, a, d, c);
  };
  for (let k = 0; k <= nz; k++) for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) {
    const s0 = val[i + NX * (j + NY * k)] < 0;
    if (i < nx && s0 !== (val[(i + 1) + NX * (j + NY * k)] < 0)) quad(cv(i, j - 1, k - 1), cv(i, j, k - 1), cv(i, j, k), cv(i, j - 1, k));
    if (j < ny && s0 !== (val[i + NX * ((j + 1) + NY * k)] < 0)) quad(cv(i - 1, j, k - 1), cv(i, j, k - 1), cv(i, j, k), cv(i - 1, j, k));
    if (k < nz && s0 !== (val[i + NX * (j + NY * (k + 1))] < 0)) quad(cv(i - 1, j - 1, k), cv(i, j - 1, k), cv(i, j, k), cv(i - 1, j, k));
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.BufferAttribute(nor, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3)); g.setIndex(idx);
  return g;
}

/* ---------- materials ---------- */
const NOISE = `
float plHash(vec3 p){p=fract(p*.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float plNoise(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);
 return mix(mix(mix(plHash(i),plHash(i+vec3(1,0,0)),f.x),mix(plHash(i+vec3(0,1,0)),plHash(i+vec3(1,1,0)),f.x),f.y),
            mix(mix(plHash(i+vec3(0,0,1)),plHash(i+vec3(1,0,1)),f.x),mix(plHash(i+vec3(0,1,1)),plHash(i+vec3(1,1,1)),f.x),f.y),f.z);}`;
// Plush fur: fine fuzz in colour and normal, soft wrap-around light and a warm velvet rim.
export function furMaterial({fuzz = 1, rim = .5, rough = .92} = {}) {
  const m = new THREE.MeshStandardMaterial({vertexColors: true, roughness: rough, metalness: 0});
  m.onBeforeCompile = sh => {
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vPl;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvPl=position;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vPl;' + NOISE)
      .replace('#include <color_fragment>', `#include <color_fragment>
        float fz=plNoise(vPl*300.)*.5+plNoise(vPl*110.+7.)*.5; diffuseColor.rgb*=mix(1.,.9+.16*fz,${fuzz.toFixed(2)});`)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
        vec3 fzN=vec3(plNoise(vPl*260.),plNoise(vPl*260.+3.1),plNoise(vPl*260.+5.7))-.5; normal=normalize(normal+fzN*${(.4 * fuzz).toFixed(2)});`)
      .replace('#include <opaque_fragment>', `float plRim=pow(1.-clamp(dot(normal,normalize(vViewPosition)),0.,1.),2.4);
        outgoingLight+=diffuseColor.rgb*vec3(1.,.9,.78)*plRim*${rim.toFixed(2)}+diffuseColor.rgb*.07;
        #include <opaque_fragment>`);
  };
  m.customProgramCacheKey = () => 'plush' + fuzz + rim + rough;
  return m;
}
const glossy = (color, rough = .12) => new THREE.MeshStandardMaterial({color, roughness: rough, metalness: 0});
const cloth = color => furMaterial({fuzz: .5, rim: .3, rough: .95});

/* Painted eye: dark lid ring, warm brown iris lighter at the bottom, big pupil, two catchlights. */
const eyeTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d');
  g.fillStyle = '#1c0f07'; g.fillRect(0, 0, 256, 256);
  const ir = g.createRadialGradient(128, 150, 10, 128, 140, 100); ir.addColorStop(0, '#2a1508'); ir.addColorStop(.45, '#5a3016'); ir.addColorStop(.8, '#9a5a28'); ir.addColorStop(1, '#3a1d0c');
  g.fillStyle = ir; g.beginPath(); g.arc(128, 132, 96, 0, TAU); g.fill();
  g.fillStyle = '#120804'; g.beginPath(); g.arc(128, 128, 52, 0, TAU); g.fill();
  g.fillStyle = '#fff'; g.beginPath(); g.ellipse(96, 92, 30, 24, -.5, 0, TAU); g.fill(); g.beginPath(); g.arc(160, 168, 11, 0, TAU); g.fill();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
function eye(r, {lid = '#d9692a', iris = true} = {}) {
  const geo = new THREE.SphereGeometry(r, 28, 20), p = geo.attributes.position, uv = geo.attributes.uv;
  for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / r * .52 + .5, p.getY(i) / r * .52 + .5);
  const g = new THREE.Group(); const ball = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({map: eyeTex, roughness: .08, metalness: 0})); ball.scale.z = .62; g.add(ball);
  return g;
}

/* ---------- builder ---------- */
function part(parent, name, at, prims, paint, {cell = .009, mat} = {}) {
  const joint = new THREE.Group(); joint.name = name; joint.position.set(...at); parent.add(joint);
  const g = polygonize(sdf(prims), {cell, paint}); const m = new THREE.Mesh(g, mat); m.castShadow = true; joint.add(m); joint.userData.mesh = m; return joint;
}
const mixC = (...stops) => { const c = stops[0][1].clone(); for (const [w, col] of stops.slice(1)) c.lerp(col, clamp(w, 0, 1)); return c; };

/* ---------- Fuchs ---------- */
export function fox({detail = 1} = {}) {
  const cell = .0105 / detail, fur = furMaterial(), group = new THREE.Group(), root = new THREE.Group(); group.add(root);
  const OR = C('#dd6a28'), ORd = C('#b9531c'), CR = C('#f6e7cf'), DK = C('#4a2413'), IN = C('#f2d9bd');
  const body = part(root, 'body', [0, 0, 0], [
    E([0, .32, 0], [.16, .19, .14]), E([0, .25, .03], [.155, .15, .135], {k: .06}), E([0, .19, -.01], [.15, .1, .13], {k: .06}), E([0, .47, .01], [.1, .08, .09], {k: .07}),
  ], p => { const chest = inside(E([0, .3, .1], [.1, .16, .08]), p, .025); return mixC([0, OR], [sstep(.5, .2, p[1]) * .25, ORd], [chest, CR]); }, {cell, mat: fur});
  const head = part(body, 'head', [0, .5, .01], [
    E([0, .17, 0], [.24, .2, .205]), E([0, .25, .02], [.19, .13, .16], {k: .06}),
    E([.13, .1, .07], [.13, .1, .12], {k: .07}), E([-.13, .1, .07], [.13, .1, .12], {k: .07}),
    E([.24, .07, .02], [.07, .04, .05], {rot: [0, 0, -.55], k: .05}), E([-.24, .07, .02], [.07, .04, .05], {rot: [0, 0, .55], k: .05}),
    E([0, .085, .175], [.085, .065, .1], {rot: [-.15, 0, 0], k: .06}), E([0, .045, .13], [.12, .06, .09], {k: .05}),
  ], p => {
    const lower = inside(E([0, .03, .1], [.23, .1, .17]), p, .03), cheek = Math.max(inside(E([.17, .07, .08], [.12, .07, .1]), p, .025), inside(E([-.17, .07, .08], [.12, .07, .1]), p, .025));
    const muzzleSide = inside(E([0, .075, .2], [.09, .055, .1]), p, .02), bridge = inside(E([0, .15, .17], [.05, .06, .13]), p, .02);
    const brow = Math.max(inside(E([.092, .268, .168], [.042, .01, .03], {rot: [0, 0, -.06]}), p, .006), inside(E([-.092, .268, .168], [.042, .01, .03], {rot: [0, 0, .06]}), p, .006));
    const cream = clamp(Math.max(lower, cheek, muzzleSide) - bridge * .9, 0, 1);
    return mixC([0, OR], [sstep(.3, .05, p[1]) * .15, ORd], [cream, CR], [brow, DK]);
  }, {cell, mat: fur});
  const eyes = [-1, 1].map(s => { const e = eye(.066); e.position.set(s * .092, .175, .172); e.rotation.y = s * .34; head.add(e); return e; });
  const nose = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), glossy('#22120a', .2)); nose.scale.set(.034, .025, .024); nose.position.set(0, .112, .272); head.add(nose);
  const mouth = new THREE.Mesh(new THREE.TorusGeometry(.028, .0055, 6, 16, Math.PI * .9), glossy('#3a1c0e', .6)); mouth.position.set(0, .07, .245); mouth.rotation.set(-.35, 0, Math.PI + .14); head.add(mouth);
  const ears = [-1, 1].map(s => {
    const j = part(head, 'ear', [s * .15, .32, -.02], [T([0, 0, 0], [s * .03, .2, -.01], .085, .012, {flat: 1.9, k: .03})], p => {
      const tip = sstep(.12, .17, p[1]), inner = p[2] > .004 ? inside(T([0, .01, .02], [s * .028, .17, .02], .055, .006, {flat: 2.4}), p, .012) : 0; return mixC([0, OR], [inner, IN], [tip, DK]);
    }, {cell: cell * .8, mat: fur});
    j.rotation.z = s * -.32; j.rotation.x = -.12; return j;
  });
  const arms = [-1, 1].map(s => part(body, 'arm', [s * .15, .42, .03], [...chain([[0, 0, 0], [s * .02, -.1, .02], [s * .03, -.17, .045]], [.048, .042, .04]), E([s * .032, -.19, .05], [.044, .042, .045], {k: .03})],
    p => mixC([0, OR], [sstep(-.07, -.11, p[1]), DK]), {cell, mat: fur}));
  arms.forEach((a, i) => a.rotation.z = (i ? -1 : 1) * .12);
  const legs = [-1, 1].map(s => part(body, 'leg', [s * .085, .2, 0], [E([0, -.02, 0], [.075, .095, .085]), T([0, -.06, .01], [0, -.15, .015], .055, .05), E([0, -.172, .035], [.058, .034, .082], {k: .03})],
    p => mixC([0, OR], [sstep(-.07, -.11, p[1]), DK]), {cell, mat: fur}));
  const tail = part(body, 'tail', [0, .2, -.12], chain([[0, 0, 0], [.02, -.02, -.1], [.09, .04, -.2], [.18, .16, -.24], [.23, .3, -.2], [.22, .4, -.13]], [.05, .085, .125, .14, .115, .02], {k: .06}),
    p => { const tipD = Math.hypot(p[0] - .22, p[1] - .4, p[2] + .13); return mixC([0, OR], [sstep(.2, .14, tipD), CR]); }, {cell, mat: fur});
  tail.rotation.y = .45;
  // neckerchief: collar, chest triangle and a small knot (cloth, separate meshes)
  const scarfMat = furMaterial({fuzz: .35, rim: .25}); const sc = C('#5f7d31');
  const tint = g => { const n = g.attributes.position.count, c = new Float32Array(n * 3); for (let i = 0; i < n; i++) { c[i * 3] = sc.r; c[i * 3 + 1] = sc.g; c[i * 3 + 2] = sc.b; } g.setAttribute('color', new THREE.BufferAttribute(c, 3)); return g; };
  const collar = new THREE.Mesh(tint(new THREE.TorusGeometry(.1, .028, 10, 30)), scarfMat); collar.position.set(0, .49, .01); collar.rotation.x = Math.PI / 2 - .2; body.add(collar);
  const sh = new THREE.Shape(); sh.moveTo(-.11, 0); sh.quadraticCurveTo(0, .02, .11, 0); sh.quadraticCurveTo(.04, -.07, 0, -.13); sh.quadraticCurveTo(-.04, -.07, -.11, 0);
  const tri = new THREE.Mesh(tint(new THREE.ExtrudeGeometry(sh, {depth: .012, bevelEnabled: true, bevelThickness: .008, bevelSize: .008, bevelSegments: 3, curveSegments: 12})), scarfMat); tri.position.set(0, .49, .1); tri.rotation.x = -.3; tri.scale.setScalar(1.25); body.add(tri);
  const knot = new THREE.Mesh(tint(new THREE.SphereGeometry(.024, 12, 10)), scarfMat); knot.position.set(.06, .48, .09); body.add(knot);
  group.traverse(o => { if (o.isMesh) o.castShadow = true; });
  return {group, parts: {body, head, eyes, ears, arms, legs, tail}};
}

/* ---------- Eichhörnchen ---------- */
export function squirrel({detail = 1} = {}) {
  const cell = .0105 / detail, fur = furMaterial(), group = new THREE.Group();
  const RD = C('#c9612a'), RDd = C('#a8481d'), CR = C('#f4dfc2'), DK = C('#3a1d0e');
  const body = part(group, 'body', [0, 0, 0], [E([0, .26, 0], [.15, .2, .13]), E([0, .17, .02], [.16, .13, .13], {k: .06}), E([0, .42, .01], [.09, .07, .08], {k: .06})],
    p => mixC([0, RD], [inside(E([0, .25, .1], [.09, .15, .07]), p, .025), CR]), {cell, mat: fur});
  const head = part(body, 'head', [0, .44, .01], [E([0, .14, 0], [.2, .17, .175]), E([.11, .08, .07], [.1, .08, .1], {k: .06}), E([-.11, .08, .07], [.1, .08, .1], {k: .06}), E([0, .075, .15], [.075, .06, .08], {k: .05})],
    p => { const cream = Math.max(inside(E([0, .04, .12], [.17, .08, .12]), p, .03), inside(E([0, .07, .16], [.07, .05, .07]), p, .02)) - inside(E([0, .13, .15], [.04, .05, .09]), p, .02) * .8; return mixC([0, RD], [clamp(cream, 0, 1), CR]); }, {cell, mat: fur});
  [-1, 1].forEach(s => { const e = eye(.048); e.position.set(s * .075, .145, .15); e.rotation.y = s * .3; head.add(e); });
  const nose = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), glossy('#3a1a10', .25)); nose.scale.set(.022, .016, .016); nose.position.set(0, .1, .222); head.add(nose);
  [-1, 1].forEach(s => { const j = part(head, 'ear', [s * .11, .27, -.02], [T([0, 0, 0], [s * .02, .14, -.01], .05, .008, {flat: 1.6, k: .02}), E([s * .02, .15, -.01], [.018, .03, .015], {k: .02})], p => mixC([0, RD], [p[2] > 0 ? inside(T([0, .01, .015], [s * .02, .11, .015], .03, .005, {flat: 2}), p, .01) : 0, CR], [sstep(.11, .15, p[1]), RDd]), {cell: cell * .8, mat: fur}); j.rotation.z = s * -.2; });
  [-1, 1].forEach(s => part(body, 'arm', [s * .11, .36, .07], [...chain([[0, 0, 0], [s * -.03, -.07, .05], [s * -.05, -.1, .07]], [.035, .03, .028])], () => RD, {cell, mat: fur}));
  [-1, 1].forEach(s => part(body, 'leg', [s * .09, .1, .02], [E([0, 0, 0], [.07, .08, .09]), E([0, -.085, .06], [.04, .022, .07], {k: .03})], p => mixC([0, RD], [sstep(-.05, -.08, p[1]), RDd]), {cell, mat: fur}));
  const acorn = new THREE.Group(); const nut = new THREE.Mesh(new THREE.SphereGeometry(.04, 16, 12), glossy('#a8682f', .45)); nut.scale.y = 1.2; const cap = new THREE.Mesh(new THREE.SphereGeometry(.043, 16, 8, 0, TAU, 0, Math.PI / 2), furMaterial({fuzz: .8, rim: .2})); cap.geometry.setAttribute('color', new THREE.Float32BufferAttribute(new Array(cap.geometry.attributes.position.count).fill(0).flatMap(() => [.35, .22, .12]), 3)); cap.position.y = .02; acorn.add(nut, cap); acorn.position.set(0, .3, .17); body.add(acorn);
  const tail = part(body, 'tail', [0, .12, -.1], chain([[0, 0, 0], [0, .06, -.12], [0, .22, -.2], [0, .42, -.17], [0, .56, -.06], [0, .58, .04], [0, .52, .08]], [.06, .1, .14, .15, .13, .09, .03], {k: .07}),
    p => mixC([0, C('#c35a26')], [sstep(.25, .5, p[1]) * .25, C('#d9773a')]), {cell: cell * 1.1, mat: fur});
  tail.rotation.y = .7;
  group.traverse(o => { if (o.isMesh) o.castShadow = true; });
  return {group};
}

/* ---------- Waldkauz ---------- */
export function owl({detail = 1} = {}) {
  const cell = .012 / detail, fur = furMaterial({fuzz: .8, rim: .45}), group = new THREE.Group();
  const BR = C('#9b6a3f'), BRd = C('#7a4c28'), BE = C('#e2c497'), DI = C('#efd9b2'), RI = C('#86562f');
  const scallop = p => { const row = Math.floor((p[1] - .05) / .055), off = row % 2 ? .03 : 0, u = ((p[0] + off) / .06) % 1, v = ((p[1] - .05) / .055) % 1; const d = Math.abs(((u + 1) % 1) - .5) * 2; return sstep(.7, .95, v + d * .35); };
  const body = part(group, 'body', [0, 0, 0], [E([0, .3, 0], [.25, .3, .23]), E([0, .2, .03], [.25, .2, .22], {k: .08}), E([0, .55, 0], [.24, .2, .22], {k: .1}), E([0, .7, .0], [.22, .14, .2], {k: .08}),
    E([.23, .35, -.02], [.06, .2, .13], {rot: [0, 0, .12], k: .03}), E([-.23, .35, -.02], [.06, .2, .13], {rot: [0, 0, -.12], k: .03})],
  p => {
    const belly = inside(E([0, .28, .12], [.16, .22, .14]), p, .04), disc = inside(E([0, .58, .17], [.2, .13, .1]), p, .02), ring = inside(E([0, .58, .15], [.215, .15, .11]), p, .015) - disc;
    const wing = sstep(.17, .21, Math.abs(p[0])) * sstep(.12, .2, p[1]) * sstep(.62, .5, p[1]);
    let c = mixC([0, BR], [sstep(.35, .7, p[1]) * .2, BRd], [belly, BE], [belly * scallop(p) * .5, BR], [wing * .8, C('#6e4424')], [clamp(ring, 0, 1), RI], [disc, DI]);
    return c;
  }, {cell, mat: fur});
  [-1, 1].forEach(s => { const e = eye(.07); e.position.set(s * .085, .6, .215); e.rotation.y = s * .25; body.add(e); });
  const beak = new THREE.Mesh(new THREE.ConeGeometry(.026, .07, 12), glossy('#d9a541', .35)); beak.position.set(0, .53, .26); beak.rotation.x = Math.PI + .5; body.add(beak);
  [-1, 1].forEach(s => { for (let k = -1; k <= 1; k++) { const t = new THREE.Mesh(new THREE.CapsuleGeometry(.014, .03, 4, 8), glossy('#e0a43c', .5)); t.position.set(s * .08 + k * .022, .015, .14); t.rotation.x = Math.PI / 2 - .3; body.add(t); } });
  [-1, 1].forEach(s => { const tuft = part(body, 'ear', [s * .14, .74, .02], [T([0, 0, 0], [s * .04, .08, -.02], .045, .01, {flat: 1.6})], () => BRd, {cell: cell * .8, mat: fur}); });
  group.traverse(o => { if (o.isMesh) o.castShadow = true; });
  return {group};
}

/* ---------- Hase, the mailman ---------- */
export function hare({detail = 1} = {}) {
  const cell = .0115 / detail, fur = furMaterial(), group = new THREE.Group();
  const FU = C('#b98a5e'), FUd = C('#9a6e48'), CR = C('#f5e6cf'), PK = C('#e9b3a2');
  const navy = C('#456f93');
  const body = part(group, 'body', [0, 0, 0], [E([0, .36, 0], [.17, .23, .15]), E([0, .25, .02], [.17, .14, .15], {k: .06}), E([0, .58, 0], [.1, .08, .09], {k: .07})],
    p => { const vest = sstep(.27, .3, p[1]) * sstep(.56, .53, p[1]) * (1 - (p[2] > .05 ? sstep(.045, .03, Math.abs(p[0])) : 0)); const button = p[2] > .1 && Math.abs(p[0]) < .06 && Math.abs(p[0]) > .04 && Math.abs(((p[1] - .33) / .07) % 1 - .5) < .2 ? 1 : 0;
      return mixC([0, FU], [inside(E([0, .3, .12], [.1, .17, .07]), p, .025), CR], [vest, navy], [vest * button, C('#e6be66')]); }, {cell, mat: fur});
  const head = part(body, 'head', [0, .6, .01], [E([0, .14, 0], [.2, .18, .18]), E([.1, .07, .08], [.1, .08, .1], {k: .06}), E([-.1, .07, .08], [.1, .08, .1], {k: .06}), E([0, .07, .15], [.08, .06, .07], {k: .05})],
    p => mixC([0, FU], [inside(E([0, .05, .14], [.13, .07, .09]), p, .025), CR]), {cell, mat: fur});
  [-1, 1].forEach(s => { const e = eye(.045); e.position.set(s * .082, .15, .155); e.rotation.y = s * .32; head.add(e); });
  const nose = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), glossy('#d9837a', .3)); nose.scale.set(.022, .016, .016); nose.position.set(0, .1, .225); head.add(nose);
  [-1, 1].forEach(s => { const j = part(head, 'ear', [s * .08, .29, -.02], [T([0, 0, 0], [s * .03, .3, -.02], .05, .035, {flat: 2.2, k: .03})], p => mixC([0, FU], [p[2] > 0 ? inside(T([0, .02, .02], [s * .03, .27, .0], .03, .022, {flat: 3}), p, .01) : 0, PK]), {cell: cell * .85, mat: fur}); j.rotation.z = s * -.18; });
  const capG = new THREE.SphereGeometry(.17, 28, 14, 0, TAU, 0, Math.PI / 2); capG.scale(1, .55, 1); const capM = new THREE.Mesh(capG, glossy('#3d6688', .75)); capM.position.set(0, .25, -.01); head.add(capM);
  const brim = new THREE.Mesh(new THREE.CylinderGeometry(.11, .12, .015, 24, 1, false, -Math.PI / 2 - .9, 1.8), glossy('#2b4b68', .7)); brim.position.set(0, .26, .12); head.add(brim);
  const badge = new THREE.Mesh(new THREE.PlaneGeometry(.05, .035), new THREE.MeshStandardMaterial({color: '#fff6dd'})); badge.position.set(0, .31, .16); badge.rotation.x = -.5; head.add(badge);
  [-1, 1].forEach(s => part(body, 'arm', [s * .17, .5, .02], chain([[0, 0, 0], [s * .02, -.12, .03], [s * .03, -.21, .05]], [.045, .04, .042]), p => mixC([0, FU], [sstep(-.17, -.2, p[1]), CR]), {cell, mat: fur}));
  [-1, 1].forEach(s => part(body, 'leg', [s * .09, .16, 0], [E([0, 0, 0], [.08, .1, .09]), E([0, -.13, .07], [.055, .035, .11], {k: .03})], p => mixC([0, FU], [sstep(-.1, -.14, p[1]), CR]), {cell, mat: fur}));
  const bag = new THREE.Mesh(new THREE.BoxGeometry(.16, .13, .06, 2, 2, 1), glossy('#8e5a33', .7)); bag.position.set(.19, .24, .06); bag.rotation.y = -.9; body.add(bag);
  const strap = new THREE.Mesh(new THREE.TorusGeometry(.2, .013, 6, 48), glossy('#7a4a28', .7)); strap.position.set(.01, .38, .0); strap.rotation.set(Math.PI / 2, -.65, 0); strap.scale.set(1, .9, 1); body.add(strap);
  const letter = new THREE.Mesh(new THREE.BoxGeometry(.1, .065, .006), new THREE.MeshStandardMaterial({color: '#fff6df'})); letter.position.set(.22, .32, .08); letter.rotation.set(.1, -.9, .25); body.add(letter);
  group.traverse(o => { if (o.isMesh) o.castShadow = true; });
  return {group};
}

/* ---------- Maus ---------- */
export function mouse({detail = 1} = {}) {
  const cell = .0085 / detail, fur = furMaterial(), group = new THREE.Group();
  const GR = C('#9b8c80'), GRd = C('#7f7166'), CR = C('#f0e4d2'), PK = C('#eaa9a0');
  const body = part(group, 'body', [0, 0, 0], [E([0, .2, 0], [.13, .17, .12]), E([0, .13, .02], [.14, .11, .12], {k: .06})], p => mixC([0, GR], [inside(E([0, .19, .1], [.08, .12, .06]), p, .02), CR]), {cell, mat: fur});
  const head = part(body, 'head', [0, .33, .01], [E([0, .11, 0], [.16, .14, .14]), E([0, .07, .11], [.08, .065, .09], {k: .06}), E([0, .06, .17], [.035, .03, .04], {k: .04})],
    p => mixC([0, GR], [inside(E([0, .04, .12], [.11, .06, .09]), p, .02), CR]), {cell, mat: fur});
  [-1, 1].forEach(s => { const e = eye(.04); e.position.set(s * .065, .125, .118); e.rotation.y = s * .35; head.add(e); });
  const nose = new THREE.Mesh(new THREE.SphereGeometry(.018, 14, 10), glossy('#e58a86', .3)); nose.position.set(0, .065, .215); head.add(nose);
  [-1, 1].forEach(s => { const j = part(head, 'ear', [s * .12, .2, -.02], [E([0, .04, 0], [.09, .09, .025])], p => mixC([0, GR], [p[2] > 0 ? inside(E([0, .04, .02], [.065, .065, .03]), p, .01) : 0, PK]), {cell: cell * .9, mat: fur}); j.rotation.z = s * -.35; j.rotation.y = s * -.3; });
  [-1, 1].forEach(s => part(body, 'arm', [s * .1, .26, .06], chain([[0, 0, 0], [s * -.02, -.06, .04]], [.025, .022]), () => PK, {cell, mat: fur}));
  [-1, 1].forEach(s => part(body, 'leg', [s * .07, .05, .03], [E([0, 0, .03], [.04, .03, .07])], () => PK, {cell, mat: fur}));
  const tailC = new THREE.CatmullRomCurve3([[0, .06, -.1], [.05, .02, -.22], [.18, .03, -.26], [.26, .1, -.2]].map(p => new THREE.Vector3(...p)));
  const tail = new THREE.Mesh(new THREE.TubeGeometry(tailC, 30, .011, 8), glossy('#e2a49a', .55)); body.add(tail);
  group.traverse(o => { if (o.isMesh) o.castShadow = true; });
  return {group};
}

/* ---------- Biber ---------- */
export function beaver({detail = 1} = {}) {
  const cell = .0115 / detail, fur = furMaterial(), group = new THREE.Group();
  const BR = C('#8c5a34'), BRd = C('#6e4426'), CR = C('#d9b48a'), DK = C('#3a2416');
  const body = part(group, 'body', [0, 0, 0], [E([0, .26, 0], [.2, .25, .18]), E([0, .16, .02], [.21, .15, .18], {k: .08})], p => mixC([0, BR], [inside(E([0, .25, .14], [.13, .18, .08]), p, .03), CR]), {cell, mat: fur});
  const head = part(body, 'head', [0, .48, .02], [E([0, .12, 0], [.19, .16, .17]), E([0, .07, .12], [.12, .08, .09], {k: .06})], p => mixC([0, BR], [inside(E([0, .05, .15], [.11, .06, .07]), p, .02), CR]), {cell, mat: fur});
  [-1, 1].forEach(s => { const e = eye(.04); e.position.set(s * .08, .15, .15); e.rotation.y = s * .3; head.add(e); });
  const nose = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), glossy('#2a170c', .2)); nose.scale.set(.035, .025, .022); nose.position.set(0, .1, .21); head.add(nose);
  const teeth = new THREE.Mesh(new THREE.BoxGeometry(.05, .04, .012), new THREE.MeshStandardMaterial({color: '#fffaf0', roughness: .3})); teeth.position.set(0, .025, .2); head.add(teeth);
  [-1, 1].forEach(s => part(head, 'ear', [s * .14, .23, -.02], [E([0, 0, 0], [.035, .03, .02])], () => BRd, {cell, mat: fur}));
  [-1, 1].forEach(s => part(body, 'arm', [s * .17, .36, .08], chain([[0, 0, 0], [s * -.02, -.09, .05]], [.04, .035]), () => BRd, {cell, mat: fur}));
  [-1, 1].forEach(s => part(body, 'leg', [s * .12, .07, .04], [E([0, 0, .04], [.06, .045, .09])], () => DK, {cell, mat: fur}));
  const tailM = part(body, 'tail', [0, .04, -.16], [E([0, 0, -.14], [.11, .025, .16])], p => { const u = (p[0] + p[2]) * 40, v = (p[0] - p[2]) * 40; const hatch = sstep(.82, .95, Math.abs(Math.sin(u))) + sstep(.82, .95, Math.abs(Math.sin(v))); return mixC([0, C('#4a3324')], [clamp(hatch, 0, 1) * .5, C('#2a1c12')]); }, {cell, mat: furMaterial({fuzz: .2, rim: .2, rough: .7})});
  tailM.rotation.x = .15;
  group.traverse(o => { if (o.isMesh) o.castShadow = true; });
  return {group};
}

/* ---------- Blaumeise ---------- */
export function bluetit({detail = 1} = {}) {
  const cell = .0055 / detail, fur = furMaterial({fuzz: .7}), group = new THREE.Group();
  const YE = C('#f3cf3c'), BL = C('#3f80c4'), WH = C('#f8f6ee'), GN = C('#94a85c'), DK = C('#1f2b3c');
  const body = part(group, 'body', [0, 0, 0], [E([0, .11, -.01], [.085, .085, .1]), E([0, .205, .035], [.066, .062, .064], {k: .025}), T([0, .1, -.08], [0, .07, -.2], .035, .03, {flat: 3, k: .03})],
    p => {
      const head = sstep(.17, .185, p[1] + p[2] * .25);
      const cap = sstep(.236, .246, p[1]) * head;
      const stripe = (Math.abs(p[1] - .207 + (p[2] - .08) * .08) < .0075 && p[2] < .1 ? 1 : 0) * head;
      const collar = (Math.abs(p[1] - .17 - p[2] * .1) < .007 && p[2] < .06 ? 1 : 0);
      const bib = inside(E([0, .178, .098], [.016, .014, .014]), p, .004);
      const cheek = head * (1 - cap);
      const back = sstep(.0, -.06, p[2]) * (1 - head), tail = sstep(-.1, -.14, p[2]);
      return mixC([0, YE], [back, GN], [tail, BL], [cheek, WH], [cap, BL], [Math.max(stripe, collar), DK], [bib, DK]);
    }, {cell, mat: fur});
  [-1, 1].forEach(s => { const e = eye(.012); e.position.set(s * .048, .207, .08); e.rotation.y = s * .8; body.add(e); });
  const beak = new THREE.Mesh(new THREE.ConeGeometry(.01, .026, 10), glossy('#2a2a2a', .3)); beak.position.set(0, .2, .112); beak.rotation.x = Math.PI / 2; body.add(beak);
  [-1, 1].forEach(s => part(body, 'wing', [s * .07, .12, -.02], [E([0, 0, -.03], [.02, .05, .08], {rot: [.3, 0, 0]})], p => mixC([0, BL], [sstep(-.04, -.09, p[2]), C('#2b5d93')]), {cell, mat: fur}));
  [-1, 1].forEach(s => { const l = new THREE.Mesh(new THREE.CylinderGeometry(.005, .005, .045, 6), glossy('#59606a', .5)); l.position.set(s * .03, .028, .0); body.add(l); });
  group.traverse(o => { if (o.isMesh) o.castShadow = true; });
  return {group};
}

export const plush = {fox, squirrel, owl, hare, mouse, beaver, bluetit};
