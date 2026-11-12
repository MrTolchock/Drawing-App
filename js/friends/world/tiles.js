/* Shared builders for the world's tiles (world/big/tiles.js) and landmarks: a typed-array vertex buffer
   that merges small templates, the plant templates, tree trunks, roots, crown cards and instancing. */
import {THREE} from '../../scene/materials.js';
import {TAU, clamp, lerp, sstep, fbm, rng, tileSeed} from './noise.js';

export const TILE = 16;
const GRID = 32;                                   // terrain cells per tile edge (0.5 m)
const C = h => new THREE.Color(h);
const tone = new THREE.Color(), crownTone = new THREE.Color(.95, .95, .95);   // scratch colours: Buffer.add copies r, g, b

/* ---------- vertex buffer builder (merge many small transformed templates into one mesh) ---------- */
// Typed arrays that double when full: building a tile allocates a handful of buffers, not millions of
// array slots, which keeps garbage collection out of the build slices.
export class Buffer {
  constructor(color = true) { this.n = 0; this.ni = 0; this.cap = 0; this.icap = 0; this.color = color; this.grow(1024, 2048); }
  grow(v, i) {
    if (v > this.cap) { const cap = Math.max(v, this.cap * 2), copy = (a, k) => { const b = new Float32Array(cap * k); if (a) b.set(a.subarray(0, this.n * k)); return b; };
      this.pos = copy(this.pos, 3); this.nor = copy(this.nor, 3); this.uv = copy(this.uv, 2); if (this.color) this.col = copy(this.col, 3); this.cap = cap; }
    if (i > this.icap) { const cap = Math.max(i, this.icap * 2), b = new Uint32Array(cap); if (this.idx) b.set(this.idx.subarray(0, this.ni)); this.idx = b; this.icap = cap; }
  }
  get count() { return this.n; }
  /** Append a template, rotated about y by `ry`, scaled and moved; normals `up` keeps foliage lit like the ground. */
  add(t, {x = 0, y = 0, z = 0, ry = 0, sx = 1, sy = 1, sz = 1, c = null, up = false, cell = null}) {
    const n = t.pos.length / 3, base = this.n; this.grow(base + n, this.ni + t.idx.length);
    const cs = Math.cos(ry), sn = Math.sin(ry), cr = c ? c.r : 1, cg = c ? c.g : 1, cb = c ? c.b : 1, P = this.pos, N = this.nor, U = this.uv, K = this.col;
    for (let i = 0, v = base; i < n; i++, v++) {
      const px = t.pos[i * 3] * sx, py = t.pos[i * 3 + 1] * sy, pz = t.pos[i * 3 + 2] * sz;
      P[v * 3] = x + px * cs + pz * sn; P[v * 3 + 1] = y + py; P[v * 3 + 2] = z - px * sn + pz * cs;
      if (up) { N[v * 3] = 0; N[v * 3 + 1] = 1; N[v * 3 + 2] = 0; } else { const nx = t.nor[i * 3], nz = t.nor[i * 3 + 2]; N[v * 3] = nx * cs + nz * sn; N[v * 3 + 1] = t.nor[i * 3 + 1]; N[v * 3 + 2] = -nx * sn + nz * cs; }
      const u = t.uv ? t.uv[i * 2] : 0, w = t.uv ? t.uv[i * 2 + 1] : 0;
      if (cell) { U[v * 2] = cell[0] + u * cell[2]; U[v * 2 + 1] = cell[1] + w * cell[3]; } else { U[v * 2] = u; U[v * 2 + 1] = w; }
      if (K) { K[v * 3] = (t.col ? t.col[i * 3] : 1) * cr; K[v * 3 + 1] = (t.col ? t.col[i * 3 + 1] : 1) * cg; K[v * 3 + 2] = (t.col ? t.col[i * 3 + 2] : 1) * cb; }
    }
    for (let k = 0; k < t.idx.length; k++) this.idx[this.ni++] = base + t.idx[k];
    this.n += n;
  }
  /** Append a whole BufferGeometry in world space (trunks, roots). */
  addGeometry(g) {
    const p = g.attributes.position, nr = g.attributes.normal, uv = g.attributes.uv, cl = g.attributes.color, base = this.n, count = g.index ? g.index.count : p.count;
    this.grow(base + p.count, this.ni + count);
    this.pos.set(p.array, base * 3); this.nor.set(nr.array, base * 3);
    if (uv) this.uv.set(uv.array, base * 2); else this.uv.fill(0, base * 2, (base + p.count) * 2);
    if (this.col) { if (cl) this.col.set(cl.array, base * 3); else this.col.fill(1, base * 3, (base + p.count) * 3); }
    if (g.index) { const a = g.index.array; for (let k = 0; k < a.length; k++) this.idx[this.ni++] = base + a[k]; } else for (let i = 0; i < p.count; i++) this.idx[this.ni++] = base + i;
    this.n += p.count;
  }
  geometry() {
    if (!this.n) return null;
    const g = new THREE.BufferGeometry(), n = this.n;
    g.setAttribute('position', new THREE.BufferAttribute(this.pos.slice(0, n * 3), 3)); g.setAttribute('normal', new THREE.BufferAttribute(this.nor.slice(0, n * 3), 3));
    g.setAttribute('uv', new THREE.BufferAttribute(this.uv.slice(0, n * 2), 2)); if (this.col) g.setAttribute('color', new THREE.BufferAttribute(this.col.slice(0, n * 3), 3));
    const idx = this.idx.subarray(0, this.ni); g.setIndex(new THREE.BufferAttribute(n > 65535 ? idx.slice() : Uint16Array.from(idx), 1));
    g.computeBoundingSphere(); g.computeBoundingBox(); return g;
  }
}
export const template = (g, color = null) => { const t = {pos: [...g.attributes.position.array], nor: [...g.attributes.normal.array], uv: g.attributes.uv ? [...g.attributes.uv.array] : null, idx: g.index ? [...g.index.array] : [...Array(g.attributes.position.count).keys()], col: g.attributes.color ? [...g.attributes.color.array] : null}; if (color) t.col = t.pos.map((_, i) => [color.r, color.g, color.b][i % 3]); return t; };
export const quads = (w, h, angles, lift = 0) => { const parts = angles.map(a => new THREE.PlaneGeometry(w, h).translate(0, h / 2 + lift, 0).rotateY(a)); const b = new Buffer(false); parts.forEach(p => b.addGeometry(p)); return template(b.geometry()); };
// Atlas cells as [u0, v0, du, dv] (v from the bottom, as three.js flips canvas textures).
const cell = (col, row, w = 1, h = 1) => [col / 4, 1 - (row + h) / 4, w / 4, h / 4];
const ATLAS = {daisy: cell(0, 0), buttercup: cell(1, 0), bell: cell(2, 0), campion: cell(3, 0), clover: cell(0, 1), litter: cell(1, 1), fern: cell(2, 1), reeds: cell(3, 1), grass: cell(0, 2, 2, 1), crownA: cell(0, 3, 2, 1), crownB: cell(2, 3, 2, 1)};

/* ---------- templates, made once ---------- */
let T = null;
export function templates() {
  if (T) return T;
  T = {};
  T.grass = quads(.62, .3, [0, Math.PI / 2, Math.PI / 4]);
  T.flower = quads(.3, .3, [0, Math.PI / 2]);
  T.bell = quads(.34, .44, [0, Math.PI / 2]);
  T.flat = template(new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2));
  T.reeds = quads(.9, 1.3, [0, Math.PI / 3, -Math.PI / 3], -.05);
  T.crown = quads(1, .5, [0, Math.PI / 2]);
  { const fronds = new Buffer(false); for (let k = 0; k < 8; k++) { const g = new THREE.PlaneGeometry(.34, 1, 1, 5), p = g.attributes.position; g.translate(0, .5, 0); for (let i = 0; i < p.count; i++) { const y = p.getY(i); p.setXYZ(i, p.getX(i), Math.sin(y * 1.9) * .62, y * .9 + y * y * .25); } g.rotateY(k / 8 * TAU + Math.sin(k * 7.3) * .3); fronds.addGeometry(g); } T.fern = template(fronds.geometry()); }
  // rocks: noise-displaced icosahedra with moss on top faces; pebbles and flat stones
  const rockGeo = (seed, detail, base = ['#8e8a80', '#6f6c62'], mossy = true) => {
    const g = new THREE.IcosahedronGeometry(1, detail), p = g.attributes.position, v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) { v.set(p.getX(i), p.getY(i), p.getZ(i)); v.multiplyScalar(.78 + .35 * fbm(v.x * 1.3 + seed, v.y * 1.3 + v.z)); v.y *= .62; p.setXYZ(i, v.x, v.y, v.z); }
    g.computeVertexNormals(); const n = g.attributes.normal, c = [], a = C(base[0]), b = C(base[1]), m = C('#8aa457'), t = new THREE.Color();
    for (let i = 0; i < p.count; i++) { t.copy(a).lerp(b, fbm(p.getX(i) * 3, p.getZ(i) * 3)); if (mossy) t.lerp(m, sstep(.75, .95, n.getY(i) + (fbm(p.getX(i) * 4 + seed, p.getZ(i) * 4) - .5) * .7) * .85); c.push(t.r, t.g, t.b); }
    g.setAttribute('color', new THREE.Float32BufferAttribute(c, 3)); return template(g);
  };
  T.rock = rockGeo(1, 2); T.pebble = rockGeo(9, 0, ['#b6ab98', '#8f8676'], false); T.stone = rockGeo(4, 1, ['#b9ad98', '#948a7a'], false);
  { const cap = new THREE.LatheGeometry([[0, .16], [.12, .155], [.17, .12], [.18, .09], [.15, .085], [0, .09]].map(([r, y]) => new THREE.Vector2(r, y)), 12), stem = new THREE.CylinderGeometry(.035, .05, .1, 8).translate(0, .05, 0);
    const b = new Buffer(); b.add(template(stem, C('#f2e8d6')), {}); T.stem = template(b.geometry()); T.cap = template(cap, C('#ffffff')); }
  return T;
}

/* ---------- trees ---------- */
const BARK = C('#ffe3cc'), MOSS = C('#8fb35a'), ROOT = C('#ffe3cc').lerp(C('#8fb35a'), .25);
const PROFILE = [[1.8, 0], [1.32, .2], [1.1, .55], [1.02, 1.2], [.97, 2.4], [.92, 3.8], [.86, 5.2], [.8, 6.4], [.7, 7.6]];
export function trunkGeometry(t, y0, R, {segments = 22, rings = 16} = {}) {
  const height = t.height || (.85 + R() * .3), seed = R() * 10;
  const geo = new THREE.LatheGeometry(PROFILE.map(([r, y]) => new THREE.Vector2(r * t.r, y * height * (t.s < 1 ? .62 : 1))), segments, rings), pp = geo.attributes.position;
  for (let i = 0; i < pp.count; i++) { const x = pp.getX(i), y = pp.getY(i), z = pp.getZ(i), a = Math.atan2(z, x), r = Math.hypot(x, z); const flute = 1 + .07 * Math.sin(a * 6 + seed + y * .25) + (.28 * Math.max(0, Math.sin(a * 5 + seed))) * Math.max(0, 1 - y / 1.4); pp.setXYZ(i, Math.cos(a) * r * flute, y, Math.sin(a) * r * flute); }
  geo.computeVertexNormals(); geo.translate(t.x, y0 - .05, t.z);
  const c = new Float32Array(pp.count * 3);
  for (let i = 0; i < pp.count; i++) { const x = pp.getX(i), y = pp.getY(i), z = pp.getZ(i); tone.copy(BARK).lerp(MOSS, sstep(1.1, .1, y - y0) * sstep(.35, .7, fbm(x * 2, z * 2 + y))); c[i * 3] = tone.r; c[i * 3 + 1] = tone.g; c[i * 3 + 2] = tone.b; }
  geo.setAttribute('color', new THREE.BufferAttribute(c, 3));
  return {geo, crownY: y0 + 7.4 * height * (t.s < 1 ? .62 : 1), height};
}
export function rootGeometries(t, ground, R, {count = 4 + Math.floor(R() * 3), skip = null, length = 1.9 * t.r, radius = .42 * t.r} = {}) {
  const out = [], c0 = new THREE.Vector3();
  for (let k = 0; k < count; k++) {
    const a = k / count * TAU + R() * .6; if (skip && skip(a)) continue;
    const L = (.9 + R() * .9) * length, r0 = radius;
    const pts = [0, .35, .7, 1].map(s => new THREE.Vector3(t.x + Math.cos(a) * (t.r * .8 + s * L), 0, t.z + Math.sin(a) * (t.r * .8 + s * L)));
    pts.forEach((p, i) => p.y = ground(p.x, p.z) + (1 - i / 3) ** 1.6 * r0 * 1.5 - .1);
    const g = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 8, r0, 6, false), q = g.attributes.position;
    for (let i = 0; i < q.count; i++) { const s = Math.floor(i / 7) / 8, k2 = 1 - s * .9; c0.copy(pts[0]).lerp(pts[3], s); q.setXYZ(i, lerp(c0.x, q.getX(i), k2), lerp(c0.y, q.getY(i), k2), lerp(c0.z, q.getZ(i), k2)); }
    const col = new Float32Array(q.count * 3); for (let i = 0; i < q.count; i++) { col[i * 3] = ROOT.r; col[i * 3 + 1] = ROOT.g; col[i * 3 + 2] = ROOT.b; }
    g.computeVertexNormals(); g.setAttribute('color', new THREE.BufferAttribute(col, 3)); out.push(g);
  }
  return out;
}
/** Leaf cards on a lumpy ellipsoid, shaded toward the sun (light baked into the instance colour). */
export function crownCards(cx, cy, cz, radius, n, R, sunDir, size = [2.1, 1.4], squash = .7) {
  const out = [], d = new THREE.Vector3();
  for (let k = 0; k < n; k++) {
    const u = R() * TAU, v = Math.acos(lerp(-.35, 1, R())); d.set(Math.sin(v) * Math.cos(u), Math.cos(v) * squash, Math.sin(v) * Math.sin(u));
    const rr = radius * (.72 + .3 * R()), light = clamp(.55 + .45 * Math.max(0, d.dot(sunDir)) + .15 * d.y, .45, 1.15);
    out.push({x: cx + d.x * rr, y: cy + d.y * rr, z: cz + d.z * rr, rx: (R() - .5) * 1.2, ry: R() * TAU, rz: (R() - .5) * 1.2, s: size[0] + R() * size[1], c: light});
  }
  return out;
}
const dummy = new THREE.Object3D(), tint = new THREE.Color();
export function instanced(geometry, material, list, {cast = false, receive = true, depth = null, name = ''} = {}) {
  if (!list.length) return null;
  const m = new THREE.InstancedMesh(geometry, material, list.length); m.name = name;
  list.forEach((it, i) => { dummy.position.set(it.x, it.y, it.z); dummy.rotation.set(it.rx || 0, it.ry || 0, it.rz || 0); dummy.scale.set(it.sx ?? it.s ?? 1, it.sy ?? it.s ?? 1, it.sz ?? it.s ?? 1); dummy.updateMatrix(); m.setMatrixAt(i, dummy.matrix); if (it.c != null) m.setColorAt(i, typeof it.c === 'number' ? tint.setScalar(it.c) : it.c); });
  m.castShadow = cast; m.receiveShadow = receive; if (depth) m.customDepthMaterial = depth; m.computeBoundingSphere(); return m;
}
let cardGeo = null;
const leafCardGeometry = () => { if (!cardGeo) { cardGeo = new THREE.PlaneGeometry(1, 1); const n = cardGeo.attributes.normal; for (let i = 0; i < n.count; i++) n.setXYZ(i, 0, 1, 0); } return cardGeo; };
