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
// Plush fur: brushed strokes running down the body in colour and normal, soft clumps (both fade out with
// distance instead of turning into grain), a warm velvet rim.
export function furMaterial({fuzz = 1, rim = .5, rough = .92} = {}) {
  const m = new THREE.MeshStandardMaterial({vertexColors: true, roughness: rough, metalness: 0});
  m.onBeforeCompile = sh => {
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vPl;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvPl=position;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vPl;' + NOISE)
      .replace('#include <color_fragment>', `#include <color_fragment>
        float plFw=length(fwidth(vPl)),plFine=clamp(1.4-plFw*300.,0.,1.),plCoarse=clamp(1.4-plFw*90.,0.,1.);
        float fz=mix(.5,plNoise(vPl*vec3(330.,62.,330.)),plFine)*.6+mix(.5,plNoise(vPl*95.+7.),plCoarse)*.4; diffuseColor.rgb*=mix(1.,.87+.24*fz,${fuzz.toFixed(2)});`)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
        vec3 fzN=vec3(plNoise(vPl*vec3(280.,70.,280.)),plNoise(vPl*vec3(280.,70.,280.)+3.1),plNoise(vPl*vec3(280.,70.,280.)+5.7))-.5; normal=normalize(normal+fzN*plFine*${(.34 * fuzz).toFixed(2)});`)
      .replace('#include <opaque_fragment>', `float plRim=pow(1.-clamp(dot(normal,normalize(vViewPosition)),0.,1.),2.4);
        outgoingLight+=diffuseColor.rgb*vec3(1.,.9,.78)*plRim*${rim.toFixed(2)}+diffuseColor.rgb*.07;
        #include <opaque_fragment>`);
  };
  m.customProgramCacheKey = () => 'plush' + fuzz + rim + rough;
  return m;
}
const glossy = (color, rough = .12) => new THREE.MeshStandardMaterial({color, roughness: rough, metalness: 0});

/* Painted eye, as on the friends sheet: a cream eyeball with a soft shade round its rim, a thick dark
   upper lid, a big warm-brown iris that is lighter at the bottom, a large pupil and two catchlights.
   The same drawing is in js/friends/characters3d.js (eyes) and tools/bake/bake.js (eyeAtlas). */
export function drawEye(g) {
  const TAU = Math.PI * 2;
  g.fillStyle = '#2a1810'; g.fillRect(0, 0, 256, 256);
  const ball = g.createRadialGradient(128, 128, 60, 128, 128, 124); ball.addColorStop(0, '#fbf3e4'); ball.addColorStop(.7, '#f4e6cf'); ball.addColorStop(1, '#c9ac86');
  g.fillStyle = ball; g.beginPath(); g.arc(128, 128, 121, 0, TAU); g.fill();
  const ir = g.createRadialGradient(128, 168, 8, 128, 138, 84); ir.addColorStop(0, '#a5642e'); ir.addColorStop(.55, '#6f3d1b'); ir.addColorStop(.9, '#43220f'); ir.addColorStop(1, '#2c160a');
  g.fillStyle = ir; g.beginPath(); g.arc(128, 138, 84, 0, TAU); g.fill();
  g.fillStyle = '#150b06'; g.beginPath(); g.arc(128, 136, 50, 0, TAU); g.fill();
  // upper lid: the part of the eye above a lower circle
  g.save(); g.beginPath(); g.rect(0, 0, 256, 256); g.arc(128, 163, 134, 0, TAU, true); g.clip('evenodd'); g.fillStyle = '#2a1810'; g.fillRect(0, 0, 256, 256); g.restore();
  g.fillStyle = '#fff'; g.beginPath(); g.ellipse(158, 104, 19, 17, .4, 0, TAU); g.fill(); g.globalAlpha = .9; g.beginPath(); g.arc(102, 170, 8, 0, TAU); g.fill(); g.globalAlpha = 1;
}
const eyeTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 256; drawEye(c.getContext('2d')); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
const eyeMat = new THREE.MeshStandardMaterial({map: eyeTex, roughness: .08, metalness: 0});
function eye(r, {depth = .6} = {}) {
  const geo = new THREE.SphereGeometry(r, 28, 20), p = geo.attributes.position, uv = geo.attributes.uv;
  for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / r * .52 + .5, p.getY(i) / r * .52 + .5);
  const g = new THREE.Group(); const ball = new THREE.Mesh(geo, eyeMat); ball.scale.z = depth; g.add(ball);
  return g;
}

/* ---------- builder ---------- */
function part(parent, name, at, prims, paint, {cell = .009, mat} = {}) {
  const joint = new THREE.Group(); joint.name = name; joint.position.set(...at); parent.add(joint);
  const f = sdf(prims), g = polygonize(f, {cell, paint}); const m = new THREE.Mesh(g, mat); m.castShadow = true; joint.add(m); joint.userData.mesh = m; joint.userData.f = f; return joint;
}
const mixC = (...stops) => { const c = stops[0][1].clone(); for (const [w, col] of stops.slice(1)) c.lerp(col, clamp(w, 0, 1)); return c; };

/* ---------- the face kit: every friend gets the same eyes, brows, nose and smile ---------- */
// Where the front (+z) surface of a part lies at (x, y) of its own space, and the surface normal there.
function frontZ(f, x, y) {
  let a = f.hi[2] + .06, b = a; while (b > f.lo[2] - .06 && f([x, y, b]) > 0) { a = b; b -= .008; }
  if (f([x, y, b]) > 0) return null;
  for (let i = 0; i < 16; i++) { const m = (a + b) / 2; if (f([x, y, m]) > 0) a = m; else b = m; } return (a + b) / 2;
}
function normalAt(f, p, h = .004) { const g = new THREE.Vector3(f([p[0] + h, p[1], p[2]]) - f([p[0] - h, p[1], p[2]]), f([p[0], p[1] + h, p[2]]) - f([p[0], p[1] - h, p[2]]), f([p[0], p[1], p[2] + h]) - f([p[0], p[1], p[2] - h])); return g.lengthSq() ? g.normalize() : g.set(0, 0, 1); }
const solid = (geo, color) => { const n = geo.attributes.position.count, c = new Float32Array(n * 3); for (let i = 0; i < n; i++) { c[i * 3] = color.r; c[i * 3 + 1] = color.g; c[i * 3 + 2] = color.b; } geo.setAttribute('color', new THREE.BufferAttribute(c, 3)); return geo; };
// A soft painted line lying on a part's front (brows, the smile): pts are [x, y] in the part's front view,
// the line follows the surface, is wider than it is high and tapers to both ends.
function stroke(joint, pts, r, color, mat, {flat = .5, seg = 16, ends = .35} = {}) {
  const f = joint.userData.f, P = pts.map(([x, y]) => new THREE.Vector3(x, y, frontZ(f, x, y) ?? 0)), curve = new THREE.CatmullRomCurve3(P), RAD = 8;
  const pos = [], nor = [], idx = [], T = new THREE.Vector3(), B = new THREE.Vector3(), v = new THREE.Vector3();
  for (let i = 0; i <= seg; i++) {
    const t = i / seg, c = curve.getPoint(t); const z = frontZ(f, c.x, c.y); if (z != null) c.z = z;
    const N = normalAt(f, [c.x, c.y, c.z]); curve.getTangent(t, T); B.crossVectors(T, N).normalize();
    const rad = r * (ends + (1 - ends) * Math.sin(Math.PI * clamp(t * .9 + .05, 0, 1)) ** .7);
    for (let j = 0; j < RAD; j++) { const a = j / RAD * TAU, cb = Math.cos(a), sn = Math.sin(a); v.copy(c).addScaledVector(B, cb * rad).addScaledVector(N, (sn * flat + flat * .5) * rad); pos.push(v.x, v.y, v.z); v.copy(B).multiplyScalar(cb * flat).addScaledVector(N, sn).normalize(); nor.push(v.x, v.y, v.z); }
  }
  for (let i = 0; i < seg; i++) for (let j = 0; j < RAD; j++) { const a = i * RAD + j, b = i * RAD + (j + 1) % RAD, c = a + RAD, d = b + RAD; idx.push(a, c, b, b, c, d); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); g.setIndex(idx);
  const m = new THREE.Mesh(solid(g, color), mat); joint.add(m); return m;
}
const INK = C('#4a2a18');
/* Two eyes set into the head at (±x, y): size r, turned `yaw` outwards (less than the surface, so they look ahead). */
function eyes(head, x, y, r, {yaw = .2, sink = .42, depth = .6, pitch = 0} = {}) {
  const f = head.userData.f;
  return [-1, 1].map(s => { const e = eye(r, {depth}), z = frontZ(f, s * x, y) ?? 0; e.position.set(s * x, y, z - r * depth * sink); e.rotation.set(pitch, s * yaw, 0); head.add(e); return e; });
}
/* Brows: short thick arcs above the eyes, higher towards the middle of each. */
function brows(head, x, y, w, mat, {r = .011, tilt = .012, color = INK, arch = .012} = {}) {
  for (const s of [-1, 1]) stroke(head, [[s * (x - w * .5), y + tilt * .4], [s * (x - w * .1), y + arch], [s * (x + w * .5), y - tilt]], r, color, mat);
}
/* Nose: a rounded, slightly triangular button sitting on the muzzle tip at height y. */
function nose(head, y, [w, h, d], color, {push = .35, x = 0} = {}) {
  const f = head.userData.f, geo = new THREE.SphereGeometry(1, 22, 16), p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) { const yy = p.getY(i); p.setX(i, p.getX(i) * (1 + yy * .28)); } geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, glossy(color, .28)); m.scale.set(w, h, d); m.position.set(x, y, (frontZ(f, x, y) ?? 0) - d * push); head.add(m); return m;
}
/* The friends' smile: a short line down from the nose and a soft curve to each side, turning up at the ends. */
function smile(head, y, w, mat, {r = .0052, drop = .02, lift = .012, color = INK, top = null} = {}) {
  if (top != null) stroke(head, [[0, top], [0, y - drop * .5]], r * .9, color, mat, {seg: 6, ends: .7});
  for (const s of [-1, 1]) stroke(head, [[0, y - drop * .45], [s * w * .45, y - drop], [s * w * .85, y - drop * .4], [s * w, y + lift]], r, color, mat, {ends: .5});
}

/* ---------- Fuchs ---------- */
export function fox({detail = 1} = {}) {
  const cell = .0105 / detail, fur = furMaterial(), group = new THREE.Group(), root = new THREE.Group(); group.add(root);
  const OR = C('#e06e2a'), ORd = C('#bd561d'), CR = C('#f6e4c8'), DK = C('#5c2f1a'), IN = C('#f2d9bd');
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
    const cream = clamp(Math.max(lower, cheek, muzzleSide) - bridge * .9, 0, 1);
    return mixC([0, OR], [sstep(.3, .05, p[1]) * .15, ORd], [cream, CR]);
  }, {cell, mat: fur});
  const eyes_ = eyes(head, .096, .172, .06, {yaw: .22});
  brows(head, .098, .262, .085, fur, {r: .0125});
  nose(head, .112, [.036, .026, .024], '#5a3422');
  smile(head, .074, .062, fur, {top: .095});
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
  return {group, parts: {body, head, eyes: eyes_, ears, arms, legs, tail}};
}

/* ---------- Eichhörnchen ---------- */
export function squirrel({detail = 1} = {}) {
  const cell = .0105 / detail, fur = furMaterial(), group = new THREE.Group();
  const RD = C('#c9602a'), RDd = C('#a8491d'), CR = C('#f4dcba'), DK = C('#6e3c22'), IN = C('#efc3a6'), TL = C('#d9773a'), TLl = C('#f0c394');
  const body = part(group, 'body', [0, 0, 0], [E([0, .25, 0], [.155, .2, .135]), E([0, .16, .02], [.17, .135, .14], {k: .06}), E([0, .42, .01], [.09, .07, .08], {k: .06})],
    p => mixC([0, RD], [sstep(.35, .1, p[1]) * .2, RDd], [inside(E([0, .23, .11], [.1, .16, .075]), p, .03), CR]), {cell, mat: fur});
  const head = part(body, 'head', [0, .43, .01], [
    E([0, .15, 0], [.205, .175, .18]), E([0, .21, .01], [.17, .12, .15], {k: .06}),
    E([.115, .085, .06], [.115, .09, .11], {k: .07}), E([-.115, .085, .06], [.115, .09, .11], {k: .07}),
    E([0, .08, .15], [.08, .06, .085], {k: .06}),
  ], p => {
    const cream = Math.max(inside(E([0, .035, .1], [.2, .085, .15]), p, .03), inside(E([.14, .065, .08], [.1, .06, .1]), p, .025), inside(E([-.14, .065, .08], [.1, .06, .1]), p, .025), inside(E([0, .075, .17], [.075, .05, .08]), p, .02)) - inside(E([0, .135, .15], [.04, .05, .1]), p, .02) * .9;
    return mixC([0, RD], [sstep(.25, .05, p[1]) * .12, RDd], [clamp(cream, 0, 1), CR]);
  }, {cell, mat: fur});
  const eyes_ = eyes(head, .085, .15, .052, {yaw: .22});
  brows(head, .088, .228, .07, fur, {r: .0105});
  nose(head, .098, [.026, .019, .018], '#5a3422');
  smile(head, .066, .048, fur, {top: .084, r: .0045, drop: .017, lift: .01});
  const ears = [-1, 1].map(s => { const j = part(head, 'ear', [s * .115, .28, -.02], [T([0, 0, 0], [s * .015, .12, -.01], .07, .03, {flat: 1.7, k: .02}), T([s * .015, .12, -.01], [s * .03, .2, -.02], .03, .004, {k: .03})],
    p => mixC([0, RD], [p[2] > .002 ? inside(T([0, .01, .02], [s * .014, .11, .02], .046, .014, {flat: 2.2}), p, .012) : 0, IN], [sstep(.13, .19, p[1]), RDd]), {cell: cell * .8, mat: fur}); j.rotation.z = s * -.24; j.rotation.x = -.1; return j; });
  const arms = [-1, 1].map(s => part(body, 'arm', [s * .125, .35, .05], [...chain([[0, 0, 0], [s * -.02, -.06, .06], [s * -.065, -.075, .105]], [.04, .034, .03]), E([s * -.075, -.07, .115], [.036, .034, .034], {k: .03})],
    p => mixC([0, RD], [sstep(.085, .1, p[2]), DK]), {cell, mat: fur}));
  const legs = [-1, 1].map(s => part(body, 'leg', [s * .095, .1, .02], [E([0, 0, 0], [.075, .085, .095]), E([0, -.078, .065], [.046, .026, .075], {k: .03})], p => mixC([0, RD], [sstep(-.045, -.07, p[1]), DK]), {cell, mat: fur}));
  // acorn in both paws: smooth nut, rough cap with a little stalk
  const acorn = new THREE.Group(); const nut = new THREE.Mesh(solid(new THREE.SphereGeometry(.042, 18, 14), C('#b9793a')), furMaterial({fuzz: .2, rim: .3})); nut.scale.set(1, 1.22, 1);
  const cap = new THREE.Mesh(solid(new THREE.SphereGeometry(.046, 18, 8, 0, TAU, 0, Math.PI / 2), C('#6d4526')), fur); cap.position.y = .018; cap.scale.y = .8;
  const stalk = new THREE.Mesh(solid(new THREE.CylinderGeometry(.006, .008, .025, 6), C('#5a3a20')), fur); stalk.position.y = .062;
  acorn.add(nut, cap, stalk); acorn.position.set(0, .285, .175); acorn.rotation.z = .12; body.add(acorn);
  // the big brush: up behind the back, curling away at the top, lighter towards the curl
  const tail = part(body, 'tail', [0, .12, -.1], chain([[0, 0, 0], [0, .04, -.13], [0, .2, -.235], [0, .4, -.25], [0, .56, -.2], [0, .66, -.255], [0, .66, -.36], [0, .58, -.41]], [.06, .105, .15, .16, .15, .125, .095, .035], {k: .07}),
    p => { const curl = sstep(.22, .0, Math.hypot(p[1] - .6, p[2] + .37)); return mixC([0, RD], [sstep(.05, .5, p[1]) * .6, TL], [curl * .85, TLl]); }, {cell: cell * 1.1, mat: fur});
  tail.rotation.y = .55;
  group.traverse(o => { if (o.isMesh) o.castShadow = true; });
  return {group, parts: {body, head, eyes: eyes_, ears, arms, legs, tail}};
}

/* ---------- Waldkauz ---------- */
// felt props (beaks, feet, twigs, caps): plain colour on the plush material
const felt = (geo, color, mat) => new THREE.Mesh(solid(geo, C(color)), mat);
// a bird's foot: three toes forward from the ankle
function birdFoot(parent, x, y, z, len, r, color, mat) { for (let k = -1; k <= 1; k++) { const t = felt(new THREE.CapsuleGeometry(r, len, 4, 8), color, mat); t.position.set(x + k * r * 1.9, y, z + len * .5); t.rotation.set(Math.PI / 2 - .12, 0, -k * .32); parent.add(t); } }
export function owl({detail = 1} = {}) {
  const cell = .012 / detail, fur = furMaterial(), group = new THREE.Group();
  const BR = C('#9f643a'), BRd = C('#7a4a28'), BE = C('#ecd0a4'), DI = C('#f3dcb6'), RI = C('#8a5530'), WG = C('#80502a');
  // rows of rounded breast feathers: 1 on the lower rim of each feather
  const scallop = (x, y) => { const v = (y - .04) / .058, row = Math.floor(v), u = x / .075 + (row % 2 ? .5 : 0), du = (u - Math.floor(u) - .5) * 2, fv = v - row; const e = fv + du * du * .6; return sstep(.72, .9, e) * sstep(1.12, 1., e); };
  const body = part(group, 'body', [0, 0, 0], [E([0, .27, 0], [.235, .27, .205]), E([0, .19, .03], [.24, .19, .2], {k: .08}), E([0, .42, 0], [.2, .14, .18], {k: .08})],
    p => { const belly = inside(E([0, .26, .13], [.17, .25, .13]), p, .04) * sstep(-.02, .06, p[2]); return mixC([0, BR], [sstep(.1, .5, p[1]) * .15, BRd], [belly, BE], [belly * scallop(p[0], p[1]) * .55, RI]); }, {cell, mat: fur});
  const head = part(body, 'head', [0, .43, .0], [E([0, .2, 0], [.255, .215, .215]), E([0, .14, .02], [.25, .16, .2], {k: .06}),
    E([.105, .2, .23], [.1, .1, .05], {sub: true, k: .05}), E([-.105, .2, .23], [.1, .1, .05], {sub: true, k: .05})],
    p => { const ax = Math.abs(p[0]), d = Math.hypot(ax - .105, (p[1] - .195) * 1.02), front = sstep(.0, .08, p[2]), disc = sstep(.118, .1, d) * front, ring = sstep(.15, .128, d) * front, low = sstep(.1, .0, p[1]) * front;
      return mixC([0, BR], [sstep(.2, .4, p[1]) * .2, BRd], [low * .7, BE], [ring, RI], [disc, DI], [disc * sstep(.1, .04, d) * .0, BE]); }, {cell, mat: fur});
  const eyes_ = eyes(head, .105, .2, .064, {yaw: .12, sink: .3});
  const beakG = new THREE.SphereGeometry(1, 16, 12); { const q = beakG.attributes.position; for (let i = 0; i < q.count; i++) { const y = q.getY(i), k = .5 + y * .5; q.setX(i, q.getX(i) * k); q.setZ(i, q.getZ(i) * k + (1 - y) * (1 - y) * .16); } beakG.computeVertexNormals(); }
  const beak = felt(beakG, '#e2a23a', furMaterial({fuzz: .25, rim: .3})); beak.scale.set(.044, .046, .042); beak.position.set(0, .14, (frontZ(head.userData.f, 0, .14) ?? .2) + .014); head.add(beak);
  // wings hang at the sides and lift like arms (the animator waves with them)
  const arms = [-1, 1].map(s => part(body, 'arm', [s * .2, .42, -.01], [E([s * .035, -.16, 0], [.055, .19, .13], {rot: [0, 0, s * .1], k: .03}), T([s * .04, -.3, .05], [s * .035, -.37, .04], .04, .012, {flat: 2, k: .03}), T([s * .04, -.31, -.04], [s * .03, -.39, -.05], .04, .012, {flat: 2, k: .03})],
    p => { const row = sstep(.6, 1, Math.abs(Math.sin((p[1] + Math.abs(p[2]) * .3) * 34))); return mixC([0, WG], [row * .45, BRd], [sstep(-.05, .02, p[1]) * .5, BR]); }, {cell, mat: fur}));
  [-1, 1].forEach(s => birdFoot(body, s * .085, .018, .1, .05, .017, '#e3a13a', fur));
  group.traverse(o => { if (o.isMesh) o.castShadow = true; });
  return {group, parts: {body, head, eyes: eyes_, arms}};
}

/* ---------- Hase, the mailman ---------- */
export function hare({detail = 1} = {}) {
  const cell = .0115 / detail, fur = furMaterial(), prop = furMaterial({fuzz: .35, rim: .3}), group = new THREE.Group();
  const FU = C('#c98450'), FUd = C('#a8683a'), CR = C('#f5e2c6'), IN = C('#f0cfae'), DK = C('#7a4a2e'), NV = C('#52687e'), NVd = C('#3f5266'), GOLD = '#d9a441';
  const body = part(group, 'body', [0, 0, 0], [E([0, .36, 0], [.17, .23, .15]), E([0, .25, .02], [.175, .15, .155], {k: .06}), E([0, .58, 0], [.1, .08, .09], {k: .07})],
    p => { const open = p[2] > 0 ? sstep(.012 + sstep(.3, .56, p[1]) * .075, .0 + sstep(.3, .56, p[1]) * .06, Math.abs(p[0])) : 0, hem = .285 + (p[2] > 0 ? sstep(.1, .0, Math.abs(p[0])) * -.03 : 0);
      const vest = sstep(hem, hem + .012, p[1]) * sstep(.57, .55, p[1]) * (1 - open), edge = vest * (1 - sstep(hem + .012, hem + .03, p[1]));
      return mixC([0, FU], [sstep(.3, .1, p[1]) * .2, FUd], [inside(E([0, .3, .12], [.11, .2, .08]), p, .025), CR], [vest, NV], [edge * .6, NVd]); }, {cell, mat: fur});
  [.36, .44].forEach(y => { const b = new THREE.Mesh(new THREE.SphereGeometry(.014, 12, 10), glossy(GOLD, .3)); b.scale.z = .5; b.position.set(.052, y, frontZ(body.userData.f, .052, y) ?? .15); body.add(b); });
  const head = part(body, 'head', [0, .58, .01], [E([0, .17, 0], [.235, .21, .21]), E([0, .24, .01], [.19, .135, .17], {k: .06}), E([.125, .09, .075], [.125, .1, .115], {k: .07}), E([-.125, .09, .075], [.125, .1, .115], {k: .07}), E([0, .09, .17], [.095, .072, .09], {k: .06})],
    p => { const cream = Math.max(inside(E([0, .04, .11], [.23, .095, .17]), p, .03), inside(E([0, .085, .19], [.09, .06, .09]), p, .02)) - inside(E([0, .16, .17], [.045, .055, .11]), p, .02) * .9; return mixC([0, FU], [sstep(.28, .05, p[1]) * .12, FUd], [clamp(cream, 0, 1), CR]); }, {cell, mat: fur});
  const eyes_ = eyes(head, .1, .175, .06, {yaw: .22});
  brows(head, .102, .265, .08, fur, {r: .012});
  nose(head, .113, [.031, .023, .021], '#6a4030');
  smile(head, .077, .057, fur, {top: .097, r: .005, drop: .019, lift: .011});
  const ears = [-1, 1].map(s => { const j = part(head, 'ear', [s * .1, .33, -.03], [E([s * .02, .2, 0], [.08, .215, .03], {k: .02}), T([0, 0, 0], [s * .01, .08, 0], .05, .06, {flat: 2, k: .03})],
    p => mixC([0, FU], [p[2] > .003 ? inside(E([s * .02, .2, .02], [.05, .17, .03]), p, .014) : 0, IN]), {cell: cell * .85, mat: fur}); j.rotation.z = s * -.24; j.rotation.x = -.1; return j; });
  // felt cap with a brim, a band and the letter badge
  const cap = part(head, 'cap', [0, .335, .01], [E([0, .04, -.02], [.215, .07, .2]), E([0, .0, .15], [.15, .018, .1], {k: .02})],
    p => mixC([0, NV], [sstep(.014, .004, Math.abs(p[1] - .016)) * sstep(.12, .14, Math.hypot(p[0], p[2])), NVd], [sstep(.16, .18, p[2]) * .5, NVd]), {cell, mat: prop});
  cap.rotation.set(-.12, 0, .08);
  const badge = felt(new THREE.BoxGeometry(.075, .05, .01), '#f3e3c2', prop); badge.position.set(0, .068, .178); badge.rotation.x = -.5; cap.add(badge);
  const seal = felt(new THREE.CylinderGeometry(.011, .011, .005, 10), '#b5432e', prop); seal.rotation.x = Math.PI / 2; seal.position.set(0, 0, .007); badge.add(seal);
  const capKnob = new THREE.Mesh(new THREE.SphereGeometry(.014, 12, 10), glossy(GOLD, .3)); capKnob.position.set(-.13, .02, .145); cap.add(capKnob);
  const arms = [-1, 1].map(s => part(body, 'arm', [s * .17, .5, .02], [...chain([[0, 0, 0], [s * .02, -.12, .03], [s * .03, -.2, .05]], [.047, .042, .042]), E([s * .032, -.22, .055], [.046, .044, .046], {k: .03})], p => mixC([0, FU], [sstep(-.15, -.19, p[1]), DK]), {cell, mat: fur}));
  const legs = [-1, 1].map(s => part(body, 'leg', [s * .09, .16, 0], [E([0, 0, 0], [.085, .1, .095]), E([0, -.125, .055], [.058, .038, .095], {k: .03})], p => mixC([0, FU], [sstep(-.085, -.115, p[1]), DK]), {cell, mat: fur}));
  const tail = part(body, 'tail', [0, .2, -.14], [E([0, .01, -.04], [.07, .07, .065])], () => CR, {cell, mat: fur});
  // satchel with a flap, a button, the strap across the chest and two letters looking out
  const bag = part(body, 'bag', [.21, .2, .06], [E([0, 0, 0], [.12, .095, .058], {k: .02}), E([0, .04, .014], [.124, .06, .058], {k: .015})], p => mixC([0, C('#9a5c30')], [sstep(.0, .012, p[1]) * sstep(.0, .02, p[2]), C('#b06c38')]), {cell, mat: prop});
  bag.rotation.y = -.85;
  const knob = new THREE.Mesh(new THREE.SphereGeometry(.013, 12, 10), glossy(GOLD, .3)); knob.position.set(0, -.005, .068); bag.add(knob);
  [[-.04, .105, -.014, .18], [.035, .095, -.024, -.12]].forEach(([x, y, z, r]) => { const l = felt(new THREE.BoxGeometry(.085, .06, .008), '#f6e9cf', prop); l.position.set(x, y, z); l.rotation.z = r; bag.add(l); const sl = felt(new THREE.CylinderGeometry(.01, .01, .004, 10), '#b5432e', prop); sl.rotation.x = Math.PI / 2; sl.position.set(0, .0, .006); l.add(sl); });
  const strap = felt(new THREE.TorusGeometry(.2, .014, 6, 48), '#8a5028', prop); strap.position.set(.012, .4, .0); strap.rotation.set(Math.PI / 2, -.7, 0); strap.scale.set(1.02, .88, .95); body.add(strap);
  group.traverse(o => { if (o.isMesh) o.castShadow = true; });
  return {group, parts: {body, head, eyes: eyes_, ears, arms, legs, tail}};
}

/* ---------- Maus ---------- */
export function mouse({detail = 1} = {}) {
  const cell = .0085 / detail, fur = furMaterial(), group = new THREE.Group();
  const GR = C('#a08c7c'), GRd = C('#857263'), CR = C('#f2e2cc'), PK = C('#eda598'), PKd = C('#e08f84');
  const body = part(group, 'body', [0, 0, 0], [E([0, .2, 0], [.135, .17, .12]), E([0, .13, .02], [.15, .12, .13], {k: .06}), E([0, .33, .01], [.08, .06, .07], {k: .06})],
    p => mixC([0, GR], [sstep(.25, .05, p[1]) * .2, GRd], [inside(E([0, .18, .1], [.09, .13, .065]), p, .025), CR]), {cell, mat: fur});
  const head = part(body, 'head', [0, .33, .01], [E([0, .12, 0], [.17, .15, .15]), E([.09, .07, .05], [.09, .075, .09], {k: .06}), E([-.09, .07, .05], [.09, .075, .09], {k: .06}), E([0, .075, .12], [.075, .06, .08], {k: .06})],
    p => { const cream = Math.max(inside(E([0, .03, .09], [.16, .07, .13]), p, .025), inside(E([0, .065, .15], [.07, .05, .07]), p, .02)) - inside(E([0, .125, .14], [.035, .045, .09]), p, .02) * .9; return mixC([0, GR], [sstep(.2, .03, p[1]) * .12, GRd], [clamp(cream, 0, 1), CR]); }, {cell, mat: fur});
  const eyes_ = eyes(head, .072, .128, .045, {yaw: .22});
  brows(head, .075, .196, .06, fur, {r: .009, color: C('#5e4a3e')});
  nose(head, .088, [.024, .018, .017], '#e58a80');
  smile(head, .058, .042, fur, {top: .074, r: .004, drop: .015, lift: .009, color: C('#5e4038')});
  const ears = [-1, 1].map(s => { const j = part(head, 'ear', [s * .12, .2, -.03], [E([s * .03, .085, 0], [.115, .115, .026], {k: .02}), T([0, 0, 0], [s * .02, .04, 0], .04, .05, {flat: 1.8, k: .03})],
    p => mixC([0, GR], [p[2] > .003 ? inside(E([s * .03, .085, .02], [.088, .088, .03]), p, .012) : 0, PK]), {cell: cell * .9, mat: fur}); j.rotation.z = s * -.42; j.rotation.y = s * -.28; return j; });
  const arms = [-1, 1].map(s => part(body, 'arm', [s * .105, .26, .05], [...chain([[0, 0, 0], [s * -.02, -.045, .05], [s * -.06, -.055, .085]], [.03, .026, .022]), E([s * -.068, -.052, .092], [.026, .024, .024], {k: .02})], p => mixC([0, GR], [sstep(.055, .075, p[2]), PK]), {cell, mat: fur}));
  const legs = [-1, 1].map(s => part(body, 'leg', [s * .075, .05, .03], [E([0, .01, 0], [.06, .06, .07]), E([0, -.02, .05], [.04, .026, .07], {k: .03})], p => mixC([0, GR], [sstep(.0, -.015, p[1]) + sstep(.05, .07, p[2]), PK]), {cell, mat: fur}));
  // long tail curling up at the side
  const tail = new THREE.Group(); tail.name = 'tail'; tail.position.set(0, .055, -.1); body.add(tail);
  const tailC = new THREE.CatmullRomCurve3([[0, 0, 0], [.07, -.03, -.1], [.2, -.025, -.13], [.3, .04, -.08], [.31, .14, -.03], [.25, .2, .0]].map(p => new THREE.Vector3(...p)));
  { const g = new THREE.TubeGeometry(tailC, 36, .013, 8), q = g.attributes.position, n = g.attributes.normal; for (let i = 0; i < q.count; i++) { const t = Math.floor(i / 9) / 36, k = 1 - t * .6 - 1; q.setXYZ(i, q.getX(i) + n.getX(i) * .013 * k, q.getY(i) + n.getY(i) * .013 * k, q.getZ(i) + n.getZ(i) * .013 * k); } tail.add(felt(g, '#e9a79a', furMaterial({fuzz: .3, rim: .3}))); }
  group.traverse(o => { if (o.isMesh) o.castShadow = true; });
  return {group, parts: {body, head, eyes: eyes_, ears, arms, legs, tail}};
}

/* ---------- Biber ---------- */
export function beaver({detail = 1} = {}) {
  const cell = .0115 / detail, fur = furMaterial(), prop = furMaterial({fuzz: .35, rim: .3}), group = new THREE.Group();
  const BR = C('#99633a'), BRd = C('#7a4a28'), BL = C('#b98253'), CR = C('#e6c098'), DK = C('#5a3824');
  const body = part(group, 'body', [0, 0, 0], [E([0, .26, 0], [.205, .25, .185]), E([0, .16, .02], [.225, .16, .195], {k: .08}), E([0, .46, .01], [.13, .09, .11], {k: .08})],
    p => mixC([0, BR], [sstep(.3, .05, p[1]) * .2, BRd], [inside(E([0, .23, .15], [.14, .19, .09]), p, .04), BL]), {cell, mat: fur});
  const head = part(body, 'head', [0, .47, .02], [E([0, .14, 0], [.2, .175, .18]), E([.105, .08, .05], [.115, .095, .11], {k: .07}), E([-.105, .08, .05], [.115, .095, .11], {k: .07}), E([0, .085, .13], [.115, .085, .095], {k: .06})],
    p => mixC([0, BR], [sstep(.2, .02, p[1]) * .15, BRd], [Math.max(inside(E([0, .07, .17], [.12, .075, .09]), p, .025), inside(E([0, .02, .12], [.1, .04, .08]), p, .02)), CR]), {cell, mat: fur});
  const eyes_ = eyes(head, .09, .165, .047, {yaw: .22});
  brows(head, .092, .235, .07, fur, {r: .0105, color: C('#4a2c1a')});
  nose(head, .118, [.04, .028, .024], '#4a2e22');
  smile(head, .07, .058, fur, {top: .098, r: .0048, drop: .018, lift: .011, color: C('#4a2c1a')});
  [-1, 1].forEach(s => { const t = new THREE.Mesh(new THREE.BoxGeometry(.024, .036, .012, 2, 2, 1), glossy('#fff8ea', .35)); t.position.set(s * .0135, .035, (frontZ(head.userData.f, 0, .04) ?? .2) + .002); head.add(t); });
  const ears = [-1, 1].map(s => { const j = part(head, 'ear', [s * .15, .265, -.01], [E([0, .01, 0], [.045, .042, .024])], p => mixC([0, BR], [p[2] > .004 ? inside(E([0, .01, .015], [.028, .026, .02]), p, .008) : 0, BRd]), {cell: cell * .8, mat: fur}); j.rotation.z = s * -.5; return j; });
  const arms = [-1, 1].map(s => part(body, 'arm', [s * .175, .36, .07], [...chain([[0, 0, 0], [s * -.02, -.07, .07], [s * -.085, -.09, .115]], [.045, .04, .036]), E([s * -.095, -.085, .125], [.042, .04, .04], {k: .03})], p => mixC([0, BR], [sstep(.085, .105, p[2]), DK]), {cell, mat: fur}));
  const legs = [-1, 1].map(s => part(body, 'leg', [s * .125, .07, .04], [E([0, .01, 0], [.085, .075, .095]), E([0, -.03, .075], [.062, .04, .09], {k: .03})], p => mixC([0, BR], [sstep(.0, -.02, p[1]) + sstep(.06, .09, p[2]), DK]), {cell, mat: fur}));
  // twig with two leaves, held in both paws
  const twig = new THREE.Group(); twig.position.set(.01, .275, .225); twig.rotation.z = -.5; body.add(twig);
  twig.add(felt(new THREE.CylinderGeometry(.009, .011, .22, 8), '#9a6a3c', prop));
  [[.01, .12, .5], [-.028, .085, -.9]].forEach(([x, y, r]) => { const l = felt(new THREE.SphereGeometry(1, 12, 8), '#6f9a3a', prop); l.scale.set(.022, .042, .008); l.position.set(x, y, 0); l.rotation.z = r; twig.add(l); });
  // the paddle: flat, wide, cross-hatched, lying to one side
  const tail = part(body, 'tail', [0, .05, -.15], [E([0, 0, -.17], [.125, .026, .18]), T([0, 0, 0], [0, 0, -.06], .05, .06, {k: .04})], p => { const u = (p[0] + p[2]) * 34, v = (p[0] - p[2]) * 34; const hatch = Math.max(sstep(.86, .97, Math.abs(Math.sin(u))), sstep(.86, .97, Math.abs(Math.sin(v)))); return mixC([0, C('#5c3d2a')], [sstep(-.04, -.08, p[2]) * hatch * .55, C('#33211a')], [sstep(-.07, -.02, p[2]), BRd]); }, {cell: cell * .9, mat: furMaterial({fuzz: .3, rim: .25})});
  tail.rotation.set(.12, .95, 0);
  group.traverse(o => { if (o.isMesh) o.castShadow = true; });
  return {group, parts: {body, head, eyes: eyes_, ears, arms, legs, tail}};
}

/* ---------- Blaumeise ---------- */
export function bluetit({detail = 1} = {}) {
  const cell = .0055 / detail, fur = furMaterial({fuzz: .8}), group = new THREE.Group();
  const YE = C('#f2c93c'), BL = C('#4a82c4'), BLd = C('#2f5b96'), WH = C('#f8f3e6'), GN = C('#9aa856'), DK = C('#27344a');
  const body = part(group, 'body', [0, 0, 0], [E([0, .112, -.012], [.09, .088, .1]), E([0, .208, .03], [.074, .07, .072], {k: .03}), E([0, .092, -.15], [.034, .011, .075], {rot: [-.22, 0, 0], k: .02})],
    p => {
      const hv = p[1] + p[2] * .25, head = sstep(.158, .172, hv), ax = Math.abs(p[0]);
      const cap = sstep(.245, .254, p[1] - p[2] * .04) * head;
      const stripe = sstep(.012, .006, Math.abs(p[1] - .213 + (p[2] - .08) * .1)) * sstep(.014, .026, ax) * head;
      const collar = sstep(.012, .006, Math.abs(hv - .166));
      const back = sstep(.01, -.05, p[2]) * (1 - head), tail = sstep(-.1, -.14, p[2]);
      return mixC([0, YE], [back, GN], [tail, BL], [head, WH], [cap, BL], [Math.max(stripe, collar), DK]);
    }, {cell, mat: fur});
  const eyes_ = eyes(body, .042, .214, .0175, {yaw: .6, sink: .3});
  const beak = felt(new THREE.ConeGeometry(.016, .034, 12), '#454a55', furMaterial({fuzz: .2, rim: .3})); beak.scale.set(1, 1, .8); beak.position.set(0, .2, (frontZ(body.userData.f, 0, .2) ?? .1) + .008); beak.rotation.x = Math.PI / 2; body.add(beak);
  const wings = [-1, 1].map(s => part(body, 'wing', [s * .078, .125, -.02], [E([0, 0, -.03], [.02, .046, .075], {rot: [.3, 0, 0]}), E([0, -.012, -.07], [.016, .03, .062], {rot: [.25, 0, 0], k: .01})],
    p => { const bar = sstep(.011, .006, Math.abs(p[1] - .012 + p[2] * .55)) * sstep(.0, .008, s * p[0]); return mixC([0, BL], [sstep(-.05, -.1, p[2]), BLd], [sstep(.6, 1, Math.abs(Math.sin((p[1] - p[2] * .5) * 120))) * sstep(-.03, -.06, p[2]) * .35, DK], [bar, WH]); }, {cell, mat: fur}));
  [-1, 1].forEach(s => { const l = felt(new THREE.CylinderGeometry(.0055, .0055, .04, 6), '#4a505c', fur); l.position.set(s * .032, .028, .0); body.add(l); birdFoot(body, s * .032, .008, -.004, .02, .005, '#4a505c', fur); });
  group.traverse(o => { if (o.isMesh) o.castShadow = true; });
  return {group, parts: {body, eyes: eyes_, wings}};
}

/* ---------- the big world's neighbours: Reh, Frosch, Igel, Fisch, Eisvogel ---------- */
const dots = (p, fx, fy, min) => sstep(min, min + .08, Math.sin(p[0] * fx + p[1] * 9) * Math.sin(p[1] * fy + p[0] * 7));

export function deer({detail = 1} = {}) {
  const cell = .0105 / detail, fur = furMaterial(), group = new THREE.Group(), root = new THREE.Group(); group.add(root);
  const TN = C('#c58d55'), TNd = C('#a26c3c'), CR = C('#f8ead2'), DK = C('#4a2e1c'), IN = C('#f1cdb4'), WH = C('#fff6e6');
  // a fawn's white spots: rows along the back and flanks
  const spots = p => { let m = 0; for (let i = 0; i < 26; i++) { const a = i * 2.39996, y = .25 + (i % 7) * .042 + ((i * 7) % 3) * .008, r = .14, c = [Math.sin(a) * r, y, -Math.abs(Math.cos(a)) * r * .9 - .0]; m = Math.max(m, 1 - sstep(.014, .024, Math.hypot(p[0] - c[0], p[1] - c[1], (p[2] - c[2]) * .6))); } return m; };
  const body = part(root, 'body', [0, 0, 0], [E([0, .33, 0], [.145, .19, .13]), E([0, .25, .02], [.15, .14, .13], {k: .06}), E([0, .2, -.01], [.14, .1, .125], {k: .06}), E([0, .5, .01], [.085, .1, .08], {k: .07})],
    p => { const chest = inside(E([0, .31, .1], [.095, .19, .08]), p, .03); return mixC([0, TN], [sstep(.5, .2, p[1]) * .22, TNd], [chest, CR], [p[2] < .03 && p[1] < .5 ? spots(p) : 0, WH]); }, {cell, mat: fur});
  const head = part(body, 'head', [0, .56, .01], [E([0, .17, 0], [.215, .2, .2]), E([0, .24, .01], [.18, .13, .16], {k: .06}), E([.1, .1, .07], [.105, .09, .1], {k: .07}), E([-.1, .1, .07], [.105, .09, .1], {k: .07}), E([0, .095, .17], [.098, .08, .115], {rot: [.12, 0, 0], k: .07})],
    p => { const muzzle = inside(E([0, .075, .22], [.095, .06, .1]), p, .025), chin = inside(E([0, .03, .1], [.17, .07, .14]), p, .03), ring = Math.max(inside(E([.1, .185, .16], [.068, .07, .06]), p, .014), inside(E([-.1, .185, .16], [.068, .07, .06]), p, .014)) * .45, bridge = inside(E([0, .15, .2], [.04, .05, .1]), p, .02);
      return mixC([0, TN], [sstep(.3, .1, p[1]) * .12, TNd], [clamp(Math.max(muzzle, chin) - bridge * .8, 0, 1), CR], [ring, CR]); }, {cell, mat: fur});
  const eyes_ = eyes(head, .1, .185, .062, {yaw: .26});
  brows(head, .103, .272, .075, fur, {r: .011});
  nose(head, .118, [.037, .028, .025], '#3a2418');
  smile(head, .074, .05, fur, {top: .098, r: .0048, drop: .017, lift: .011});
  const ears = [-1, 1].map(s => { const j = part(head, 'ear', [s * .15, .29, -.03], [E([0, .15, 0], [.078, .16, .03], {k: .02}), T([0, 0, 0], [0, .06, 0], .045, .055, {flat: 2, k: .03})],
    p => mixC([0, TN], [p[2] > .003 ? inside(E([0, .15, .02], [.05, .125, .03]), p, .014) : 0, IN], [sstep(.27, .31, p[1]) * .6, TNd]), {cell: cell * .85, mat: fur}); j.rotation.z = s * -.85; j.rotation.x = -.1; j.rotation.y = s * -.15; return j; });
  const arms = [-1, 1].map(s => part(body, 'arm', [s * .14, .43, .03], [...chain([[0, 0, 0], [s * .012, -.12, .02], [s * .018, -.21, .035]], [.043, .036, .034]), E([s * .02, -.235, .04], [.037, .034, .04], {k: .03})], p => mixC([0, TN], [sstep(-.185, -.21, p[1]), DK]), {cell, mat: fur}));
  const legs = [-1, 1].map(s => part(body, 'leg', [s * .08, .2, 0], [E([0, -.02, 0], [.072, .09, .08]), T([0, -.06, .01], [0, -.165, .012], .047, .04), E([0, -.18, .028], [.047, .032, .062], {k: .03})], p => mixC([0, TN], [sstep(-.135, -.16, p[1]), DK]), {cell, mat: fur}));
  const tail = part(body, 'tail', [0, .22, -.12], [E([0, .01, -.03], [.05, .058, .05])], p => mixC([0, TN], [sstep(.01, -.02, p[1]) + sstep(-.04, -.07, p[2]), WH]), {cell, mat: fur});
  group.traverse(o => { if (o.isMesh) o.castShadow = true; });
  return {group, parts: {body, head, eyes: eyes_, ears, arms, legs, tail}};
}

export function frog({detail = 1} = {}) {
  const cell = .0105 / detail, fur = furMaterial({fuzz: .6}), group = new THREE.Group(), root = new THREE.Group(); group.add(root);
  const GR = C('#78b540'), GRd = C('#4f8e2f'), CR = C('#f4efc4'), YE = C('#c6d85c'), PK = C('#f0a58c');
  const toes = (x, y, z, r, s) => [-1, 0, 1].map(k => E([x + k * r * 1.5 + s * r * .4, y, z + r * (1.2 - Math.abs(k) * .5)], [r, r * .62, r * 1.15], {k: .012}));
  const body = part(root, 'body', [0, 0, 0], [E([0, .17, 0], [.2, .16, .17]), E([0, .12, .04], [.2, .12, .165], {k: .06})],
    p => { const belly = inside(E([0, .11, .12], [.15, .13, .1]), p, .03), spot = p[2] < .02 && p[1] > .14 ? dots(p, 30, 28, .8) : 0; return mixC([0, GR], [sstep(.2, .05, p[1]) * .3, YE], [spot, GRd], [belly, CR]); }, {cell, mat: fur});
  const head = part(body, 'head', [0, .25, .03], [E([0, .06, .02], [.215, .105, .165]), E([.112, .14, .0], [.072, .072, .066], {k: .05}), E([-.112, .14, .0], [.072, .072, .066], {k: .05})],
    p => { const lip = sstep(.04, .015, p[1]) * sstep(-.02, .06, p[2]), blush = Math.max(inside(E([.15, .05, .11], [.04, .028, .04]), p, .02), inside(E([-.15, .05, .11], [.04, .028, .04]), p, .02)); return mixC([0, GR], [lip, CR], [p[2] < -.02 ? dots(p, 30, 28, .82) : 0, GRd], [blush * .55, PK]); }, {cell, mat: fur});
  const eyes_ = eyes(head, .112, .15, .056, {yaw: .2, sink: .3});
  // the wide frog smile, turning up at the corners; two small nostrils
  stroke(head, [[-.15, .075], [-.12, .052], [-.06, .04], [0, .037], [.06, .04], [.12, .052], [.15, .075]], .0058, C('#2f5a20'), fur, {seg: 28, ends: .45});
  [-1, 1].forEach(s => { const n = felt(new THREE.SphereGeometry(.0065, 8, 6), '#2f5a20', fur); n.position.set(s * .022, .092, (frontZ(head.userData.f, s * .022, .092) ?? .18) - .002); head.add(n); });
  const arms = [-1, 1].map(s => part(body, 'arm', [s * .15, .15, .09], [...chain([[0, 0, 0], [s * .02, -.06, .03], [s * .03, -.11, .05]], [.042, .036, .032]), ...toes(s * .034, -.128, .06, .018, s)], p => mixC([0, GR], [sstep(-.09, -.12, p[1]), YE]), {cell, mat: fur}));
  const legs = [-1, 1].map(s => part(body, 'leg', [s * .16, .1, -.03], [E([s * .03, 0, 0], [.095, .085, .125]), E([s * .07, -.072, .09], [.05, .026, .08], {k: .04}), ...toes(s * .075, -.078, .14, .022, s)], p => mixC([0, GR], [sstep(-.04, -.07, p[1]), YE]), {cell, mat: fur}));
  group.traverse(o => { if (o.isMesh) o.castShadow = true; });
  return {group, parts: {body, head, eyes: eyes_, arms, legs}};
}

export function hedgehog({detail = 1} = {}) {
  const cell = .0105 / detail, fur = furMaterial(), group = new THREE.Group(), root = new THREE.Group(); group.add(root);
  const BR = C('#7a5a3c'), TIP = C('#dcc49a'), CR = C('#f3e0c4'), CRd = C('#dcc09c'), DK = C('#6b4630'), PK = C('#eab2a0');
  // soft spines over the back of a ball: centre c, radius r, where keep(dx, dy, dz) is true
  const spines = (c, r, len, n, keep, w = .034) => { const out = []; for (let i = 0; i < n; i++) { const y = 1 - (i + .5) / n * 2, q = Math.sqrt(1 - y * y), a = i * 2.39996, dx = Math.cos(a) * q, dz = Math.sin(a) * q; if (!keep(dx, y, dz)) continue; out.push(T([c[0] + dx * r * .8, c[1] + y * r * .8, c[2] + dz * r * .8], [c[0] + dx * (r + len), c[1] + y * (r + len), c[2] + dz * (r + len)], w, .007, {k: .014})); } return out; };
  const bc = [0, .21, -.02], body = part(root, 'body', [0, 0, 0], [E([0, .2, 0], [.185, .19, .165]), E([0, .13, .03], [.19, .13, .16], {k: .06}), E(bc, [.19, .2, .17], {k: .04}), ...spines(bc, .185, .07, 230, (dx, y, dz) => dz < .16 && y > -.74, .03)],
    p => { const out = Math.hypot((p[0] - bc[0]) / .19, (p[1] - bc[1]) / .2, (p[2] - bc[2]) / .17), coat = sstep(.1, .0, p[2] - .06 + Math.abs(p[0]) * .0) * sstep(.03, .09, p[1]), belly = inside(E([0, .17, .13], [.13, .16, .08]), p, .03);
      return mixC([0, CR], [coat, BR], [coat * sstep(1.12, 1.36, out), TIP], [belly, CR], [sstep(.1, .02, p[1]) * (1 - coat) * .5, CRd]); }, {cell: cell * .9, mat: fur});
  const hc = [0, .15, -.04], head = part(body, 'head', [0, .34, .03], [E([0, .12, .02], [.17, .145, .15]), E([.085, .075, .07], [.085, .07, .085], {k: .06}), E([-.085, .075, .07], [.085, .07, .085], {k: .06}), T([0, .085, .11], [0, .07, .215], .066, .03, {k: .06}), E(hc, [.185, .16, .15], {k: .04}), ...spines(hc, .165, .065, 170, (dx, y, dz) => dz < .1 + y * .62 && y > -.4, .029)],
    p => { const out = Math.hypot((p[0] - hc[0]) / .185, (p[1] - hc[1]) / .16, (p[2] - hc[2]) / .15), hood = sstep(.0, .045, (p[1] - .225) * 1.0 - (p[2] - .05) * .95 + Math.abs(p[0]) * .22);
      return mixC([0, CR], [sstep(.14, .22, p[2]) * .35, CRd], [hood, BR], [hood * sstep(1.1, 1.32, out), TIP]); }, {cell: cell * .9, mat: fur});
  const eyes_ = eyes(head, .074, .135, .045, {yaw: .24});
  brows(head, .076, .2, .058, fur, {r: .009, color: C('#6b4a32')});
  nose(head, .078, [.03, .024, .023], '#2e1a12', {push: .1});
  smile(head, .046, .04, fur, {r: .0042, drop: .014, lift: .01, top: .06});
  const ears = [-1, 1].map(s => { const j = part(head, 'ear', [s * .15, .2, .02], [E([0, .015, 0], [.045, .048, .024])], p => mixC([0, CRd], [p[2] > .004 ? inside(E([0, .015, .015], [.03, .032, .02]), p, .008) : 0, PK]), {cell: cell * .8, mat: fur}); j.rotation.z = s * -.6; j.rotation.y = s * -.3; return j; });
  const arms = [-1, 1].map(s => part(body, 'arm', [s * .13, .27, .09], [...chain([[0, 0, 0], [s * .0, -.06, .05], [s * -.03, -.085, .085]], [.036, .032, .028]), E([s * -.035, -.085, .095], [.032, .03, .03], {k: .03})], p => mixC([0, CR], [sstep(.07, .09, p[2]), CRd]), {cell, mat: fur}));
  const legs = [-1, 1].map(s => part(body, 'leg', [s * .1, .05, .06], [E([0, .0, .0], [.062, .05, .07]), E([0, -.02, .05], [.046, .03, .07], {k: .03})], p => mixC([0, CR], [sstep(.0, -.02, p[1]) + sstep(.05, .08, p[2]), C('#b58c66')]), {cell, mat: fur}));
  group.traverse(o => { if (o.isMesh) o.castShadow = true; });
  return {group, parts: {body, head, eyes: eyes_, ears, arms, legs}};
}

export function fish({detail = 1} = {}) {
  const cell = .0095 / detail, fur = furMaterial({fuzz: .5, rim: .6}), group = new THREE.Group(), root = new THREE.Group(); group.add(root);
  const BL = C('#3d9db0'), BLd = C('#2a7890'), SV = C('#f2f1e2'), PK = C('#f3a58c'), OR = C('#f2913f'), ORd = C('#d8702a');
  // rows of rounded scales along the flank: 1 on each scale's rear rim
  const scales = (y, z) => { const v = z / .05, row = Math.floor(v), u = y / .052 + (row % 2 ? .5 : 0), du = (u - Math.floor(u) - .5) * 2, e = (1 - (v - row)) + du * du * .6; return sstep(.74, .9, e) * sstep(1.12, 1., e); };
  const rays = p => sstep(.55, 1, Math.abs(Math.sin(Math.atan2(p[1], -p[2] + .02) * 9)));
  const body = part(root, 'body', [0, 0, 0], [E([0, .19, -.03], [.125, .165, .23]), E([0, .19, .1], [.118, .15, .15], {k: .05}), E([0, .37, -.06], [.02, .075, .11], {rot: [.55, 0, 0], k: .03}), E([0, .035, -.06], [.016, .04, .06], {rot: [-.5, 0, 0], k: .03})],
    p => { const back = sstep(.15, .3, p[1] + Math.abs(p[0]) * .1), fin = Math.max(sstep(.33, .36, p[1]), sstep(.06, .035, p[1])), face = sstep(.1, .16, p[2]), blush = inside(E([p[0] > 0 ? .1 : -.1, .15, .2], [.04, .035, .045]), p, .02);
      return mixC([0, SV], [back, BL], [back * scales(p[1], p[2]) * (1 - face) * .6, BLd], [(1 - back) * scales(p[1], p[2]) * (1 - face) * .22, BL], [blush * .6, PK], [fin, OR], [fin * sstep(.6, 1, Math.abs(Math.sin(p[2] * 70))) * .5, ORd]); }, {cell, mat: fur});
  // the eyes sit on the sides of the face and look a little forward
  const eyes_ = [-1, 1].map(s => { const e = eye(.05); e.position.set(s * .1, .225, .135); e.rotation.y = s * .95; body.add(e); return e; });
  const mouth = felt(new THREE.TorusGeometry(.02, .0075, 8, 18), '#c9604e', fur); mouth.position.set(0, .15, .247); mouth.rotation.x = .15; body.add(mouth);
  const arms = [-1, 1].map(s => part(body, 'arm', [s * .11, .13, .06], [E([s * .05, -.02, -.035], [.06, .018, .07], {rot: [0, 0, s * -.55]})], p => mixC([0, OR], [sstep(.5, 1, Math.abs(Math.sin(Math.atan2(p[2] + .1, Math.abs(p[0]) + .02) * 14))) * .45, ORd]), {cell, mat: fur}));
  const tail = part(body, 'tail', [0, .19, -.24], [T([0, 0, .02], [0, 0, -.07], .055, .032), E([0, .08, -.13], [.02, .105, .075], {rot: [-.5, 0, 0], k: .04}), E([0, -.08, -.13], [.02, .105, .075], {rot: [.5, 0, 0], k: .04})], p => mixC([0, BL], [sstep(-.03, -.08, p[2]), OR], [sstep(-.06, -.09, p[2]) * rays(p) * .5, ORd]), {cell, mat: fur});
  group.traverse(o => { if (o.isMesh) o.castShadow = true; });
  return {group, parts: {body, eyes: eyes_, arms, tail}};
}

export function kingfisher({detail = 1} = {}) {
  const cell = .0055 / detail, fur = furMaterial({fuzz: .8}), group = new THREE.Group();
  const OR = C('#ec8a34'), TQ = C('#1fa3c2'), TQd = C('#15748f'), TQl = C('#86dcea'), WH = C('#f8f3e6'), DK = C('#27344a');
  const body = part(group, 'body', [0, 0, 0], [E([0, .112, -.012], [.086, .088, .098]), E([0, .214, .03], [.08, .074, .08], {k: .03}), E([0, .096, -.13], [.032, .011, .06], {rot: [-.22, 0, 0], k: .02})],
    p => {
      const hv = p[1] + p[2] * .25, head = sstep(.16, .176, hv), ax = Math.abs(p[0]);
      const cap = sstep(.214, .226, p[1] - p[2] * .08 + sstep(.02, -.06, p[2]) * .03) * head, throat = inside(E([0, .176, .075], [.042, .024, .034]), p, .008);
      const cheek = inside(E([.058, .202, .028], [.024, .02, .03]), [ax, p[1], p[2]], .008), neck = inside(E([.064, .19, -.02], [.022, .02, .024]), [ax, p[1], p[2]], .008);
      const back = sstep(.01, -.05, p[2]) * (1 - head), speck = Math.max(cap, back) * dots(p, 150, 140, .7) * .55;
      return mixC([0, OR], [back, TQ], [head * sstep(.03, -.03, p[2]) * sstep(.2, .215, p[1]), TQ], [cap, TQ], [speck, TQl], [cheek, OR], [Math.max(throat, neck), WH]);
    }, {cell, mat: fur});
  const eyes_ = eyes(body, .046, .222, .0185, {yaw: .6, sink: .3});
  const beak = felt(new THREE.ConeGeometry(.018, .088, 12), '#2f333b', furMaterial({fuzz: .2, rim: .3})); beak.scale.set(1, 1, .82); beak.position.set(0, .204, (frontZ(body.userData.f, 0, .204) ?? .1) + .03); beak.rotation.x = Math.PI / 2 + .06; body.add(beak);
  const wings = [-1, 1].map(s => part(body, 'wing', [s * .076, .125, -.02], [E([0, 0, -.03], [.02, .046, .074], {rot: [.3, 0, 0]}), E([0, -.012, -.068], [.016, .03, .06], {rot: [.25, 0, 0], k: .01})],
    p => mixC([0, TQ], [sstep(-.04, -.09, p[2]), TQd], [dots(p, 120, 110, .72) * .5, TQl]), {cell, mat: fur}));
  [-1, 1].forEach(s => { const l = felt(new THREE.CylinderGeometry(.0055, .0055, .036, 6), '#e0602c', fur); l.position.set(s * .032, .028, .0); body.add(l); birdFoot(body, s * .032, .009, -.004, .02, .005, '#e0602c', fur); });
  group.traverse(o => { if (o.isMesh) o.castShadow = true; });
  return {group, parts: {body, eyes: eyes_, wings}};
}

/* ---------- Dachs ---------- */
// Built like Fuchs (the reference for the cast): stocky and low, grey coat, dark chest, arms and legs,
// a long white face with the two black stripes that run from the nose over the eyes to the small,
// white-rimmed ears, a big dark nose, brows and a smile.
export function badger({detail = 1} = {}) {
  const cell = .0105 / detail, fur = furMaterial(), group = new THREE.Group(), root = new THREE.Group(); group.add(root);
  const GR = C('#8d8983'), GRd = C('#6c6863'), GRl = C('#b3aea6'), WH = C('#f7f1e4'), BK = C('#2b2523'), IN = C('#e9c9b4');
  const body = part(root, 'body', [0, 0, 0], [
    E([0, .3, 0], [.2, .2, .17]), E([0, .22, .02], [.21, .16, .175], {k: .06}), E([0, .16, -.01], [.19, .1, .16], {k: .06}), E([0, .45, .01], [.12, .09, .1], {k: .07}),
  ], p => { const chest = inside(E([0, .25, .15], [.13, .2, .1]), p, .035), back = sstep(.02, -.12, p[2]) * sstep(.2, .42, p[1]); return mixC([0, GR], [sstep(.45, .15, p[1]) * .3, GRd], [back * .35, GRl], [chest, BK]); }, {cell, mat: fur});
  // distance from (x, y) to the segment a–b, with the place along it (front view: the mask is painted flat on the face)
  const seg2 = (x, y, ax, ay, bx, by) => { const dx = bx - ax, dy = by - ay, t = clamp(((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy), 0, 1); return [Math.hypot(x - ax - dx * t, y - ay - dy * t), t]; };
  const head = part(body, 'head', [0, .47, .02], [
    E([0, .16, 0], [.235, .18, .2]), E([0, .225, .01], [.19, .115, .16], {k: .06}),
    E([.14, .09, .05], [.11, .085, .11], {k: .07}), E([-.14, .09, .05], [.11, .085, .11], {k: .07}),
    T([0, .105, .12], [0, .078, .3], .105, .05, {k: .08}), E([0, .05, .13], [.12, .06, .1], {k: .05}),
  ], p => {
    // the mask: a black stripe on each side from beside the nose, widening over the eye, up to the ear
    const ax = Math.abs(p[0]), [d1, t1] = seg2(ax, p[1], .036, .085, .096, .178), [d2, t2] = seg2(ax, p[1], .096, .178, .178, .31);
    const stripe = Math.max(1 - sstep(.02 + t1 * .036, .034 + t1 * .04, d1), 1 - sstep(.056 + t2 * .012, .074 + t2 * .012, d2)) * sstep(-.14, -.06, p[2]);
    const brow = inside(E([.094, .262, .16], [.04, .01, .03], {rot: [0, 0, -.1]}), [ax, p[1], p[2]], .006), backHead = sstep(0, -.12, p[2]) * sstep(.1, .2, p[1]);
    return mixC([0, WH], [backHead, GR], [stripe, BK], [brow * .5, GRd]);
  }, {cell, mat: fur});
  const eyes_ = eyes(head, .096, .178, .058, {yaw: .24});
  nose(head, .09, [.044, .034, .03], '#241512', {push: .15});
  smile(head, .05, .058, fur, {r: .005, drop: .018, lift: .012, top: .07, color: C('#3a2018')});
  const ears = [-1, 1].map(s => {
    const j = part(head, 'ear', [s * .168, .285, -.03], [E([0, .035, 0], [.06, .058, .03], {k: .03})], p => mixC([0, BK], [sstep(.045, .072, p[1] + Math.abs(p[0]) * .25), WH]), {cell: cell * .8, mat: fur});
    j.rotation.z = s * -.42; j.rotation.x = -.1; return j;
  });
  const arms = [-1, 1].map(s => part(body, 'arm', [s * .185, .38, .04], [...chain([[0, 0, 0], [s * .02, -.09, .025], [s * .03, -.15, .05]], [.056, .05, .047]), E([s * .032, -.17, .058], [.052, .046, .052], {k: .03})],
    p => mixC([0, GRd], [sstep(.03, -.03, p[1]), BK]), {cell, mat: fur}));
  arms.forEach((a, i) => a.rotation.z = (i ? -1 : 1) * .14);
  const legs = [-1, 1].map(s => part(body, 'leg', [s * .105, .17, 0], [E([0, -.02, 0], [.088, .09, .095]), T([0, -.05, .01], [0, -.12, .02], .064, .058), E([0, -.142, .042], [.066, .036, .09], {k: .03})],
    p => mixC([0, GRd], [sstep(.03, -.05, p[1]), BK]), {cell, mat: fur}));
  const tail = part(body, 'tail', [0, .16, -.15], chain([[0, 0, 0], [0, -.01, -.08], [0, .02, -.16]], [.06, .07, .035], {k: .05}),
    p => mixC([0, GR], [sstep(-.08, -.17, p[2]), WH]), {cell, mat: fur});
  group.traverse(o => { if (o.isMesh) o.castShadow = true; });
  return {group, parts: {body, head, eyes: eyes_, ears, arms, legs, tail}};
}

export const plush = {fox, squirrel, owl, hare, mouse, beaver, bluetit, deer, frog, hedgehog, fish, kingfisher, badger};
