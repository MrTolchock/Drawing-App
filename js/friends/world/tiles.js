/* World tiles (blueprint 7A): 16 × 16 m pieces of ground with their decoration, built from region
   data and seeds only, so a tile rebuilt later looks the same. Building is a generator that yields
   between small steps; the caller spends at most a few milliseconds per frame on it.
   Near tile (≤ 40 m from Fuchs): terrain + one merged foliage mesh (grass, flowers, ferns, clover,
   litter, reeds share the plant atlas) + one merged rock mesh + merged trunks + instanced leaf cards.
   Far tile (40–80 m): merged trunks + crown cards. Materials are shared and never disposed. */
import {THREE} from '../../forest/materials.js';
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

/* ---------- the tile ---------- */
/** Build a tile. `world` gives ground/colour/regions, `look` the shared materials. Yields between steps. */
export function* buildTile(world, look, i, j, ring) {
  const {M} = look, t = templates(), x0 = i * TILE, z0 = j * TILE, group = new THREE.Group(); group.name = 'tile ' + i + ',' + j + ' ' + ring;
  const regions = world.regions.filter(r => r.bounds.x1 > x0 && r.bounds.x0 < x0 + TILE && r.bounds.z1 > z0 && r.bounds.z0 < z0 + TILE);
  const inTile = (x, z) => x >= x0 && x < x0 + TILE && z >= z0 && z < z0 + TILE;
  const add = (mesh) => { if (mesh) group.add(mesh); };
  const meshOf = (buffer, material, opts = {}) => { const g = buffer.geometry(); if (!g) return null; const m = new THREE.Mesh(g, material); m.castShadow = !!opts.cast && M.shadows; m.receiveShadow = opts.receive !== false && M.shadows; m.name = opts.name || ''; return m; };

  /* trees (both rings): trunks and roots merged; leaf cards instanced near, crown cards far */
  const trunks = new Buffer(), leaves = [], crowns = new Buffer();
  // A tree is three steps (trunk, roots, crown) so no single step overruns a build slice.
  const emitTree = function* (tree, ground, seed) {
    const R = rng(tileSeed(seed, Math.round(tree.x * 10), Math.round(tree.z * 10))), y0 = ground(tree.x, tree.z);
    const {geo, crownY} = trunkGeometry(tree, y0, R, ring === 'near' ? {} : {segments: 10, rings: 6}); trunks.addGeometry(geo); geo.dispose();
    if (ring === 'near') {
      yield 'roots';
      for (const g of rootGeometries(tree, ground, R)) { trunks.addGeometry(g); g.dispose(); }
      yield 'crown';
      if (tree.branch) { const [dx, dy, r] = tree.branch, pts = [[0, dy - .25, 0], [dx * .5, dy, .1], [dx, dy + .08, .25]].map(([a, b, c]) => new THREE.Vector3(tree.x + a, y0 + b, tree.z + c)); const g = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 8, r * .22, 6); g.setAttribute('color', new THREE.Float32BufferAttribute(new Array(g.attributes.position.count).fill(0).flatMap(() => [1, .92, .85]), 3)); trunks.addGeometry(g); g.dispose(); }
      const crownR = (3.0 + tree.r * 2.6) * (tree.s < 1 ? .62 : 1);
      leaves.push(...crownCards(tree.x, crownY, tree.z, crownR, tree.s < 1 ? 40 : 80, R, world.sunDir, tree.s < 1 ? [1.4, 1] : [2.1, 1.4]));
    } else {
      const s = (3.0 + tree.r * 2.6) * 2.3; crowns.add(t.crown, {x: tree.x, y: crownY - s * .2, z: tree.z, ry: R() * TAU, sx: s, sy: s, sz: s, cell: R() < .5 ? ATLAS.crownA : ATLAS.crownB, up: true, c: crownTone});
    }
  };
  // Each yield names the step that follows, so the streamer can predict its cost (see streamer.js).
  const treeStep = ring === 'near' ? 'trunk' : 'far tree';
  for (const region of regions) for (const tree of region.trees) if (inTile(tree.x, tree.z)) { yield treeStep; yield* emitTree(tree, region.ground, region.seed); }
  // Between regions (10×): wild forest away from the paths, scattered per tile.
  const wild = world.wild, wildTrees = [];
  if (wild) {
    const R = rng(tileSeed(wild.seed, i, j));
    for (let k = 0; k < 9 && wildTrees.length < 4; k++) { const x = x0 + R() * TILE, z = z0 + R() * TILE; if (world.regionAt(x, z) || !wild.treeAt(x, z) || wildTrees.some(w => Math.hypot(w.x - x, w.z - z) < 6)) continue; wildTrees.push({x, z, r: .55 + R() * .3, s: 1}); }
    for (const tree of wildTrees) { yield treeStep; yield* emitTree(tree, world.ground, wild.seed); }
  }
  yield ring === 'near' ? 'leaves' : 'far meshes';
  add(meshOf(trunks, M.bark, {cast: true, name: 'trunks'}));
  if (ring === 'far') { add(meshOf(crowns, M.plants, {name: 'crown cards'})); return group; }
  { const m = instanced(leafCardGeometry(), M.leaves, leaves, {cast: M.shadows, receive: false, depth: M.leafDepth, name: 'leaf cards'}); if (m) { m.userData.shared = true; group.add(m); } }
  yield 'terrain';

  /* terrain: a displaced grid with analytic normals and painted vertex colours */
  {
    const N = GRID + 1, W = N + 2, step = TILE / GRID, pos = new Float32Array(N * N * 3), nor = new Float32Array(N * N * 3), col = new Float32Array(N * N * 3), uv = new Float32Array(N * N * 2), c = new THREE.Color();
    // Heights on the tile plus a one-cell ring around it: normals come from grid differences, and
    // neighbouring tiles sample the same points, so shading is seamless across tile edges.
    const H = new Float32Array(W * W);
    for (let r = -1; r <= N; r++) {
      for (let k = -1; k <= N; k++) {
        const x = x0 + k * step, z = z0 + r * step, region = world.regionAt(x, z), interior = r >= 0 && k >= 0 && r < N && k < N;
        let h;
        if (region) { const bk = region.brook && region.brook.at(x, z), pa = region.pathAt(x, z); h = region.ground(x, z, bk, pa); if (interior) region.colour(x, z, c, bk, pa); }
        else { h = world.ground(x, z); if (interior) world.colour(x, z, c); }
        H[(r + 1) * W + k + 1] = h;
        if (interior) { const v = r * N + k; pos[v * 3] = x; pos[v * 3 + 1] = h; pos[v * 3 + 2] = z; uv[v * 2] = x / 2; uv[v * 2 + 1] = z / 2; col[v * 3] = c.r; col[v * 3 + 1] = c.g; col[v * 3 + 2] = c.b; }
      }
      if (r % 2) yield 'terrain';
    }
    yield 'normals';
    for (let r = 0; r < N; r++) for (let k = 0; k < N; k++) {
      const hx = H[(r + 1) * W + k + 2] - H[(r + 1) * W + k], hz = H[(r + 2) * W + k + 1] - H[r * W + k + 1], l = Math.hypot(hx, 2 * step, hz), v = r * N + k;
      nor[v * 3] = -hx / l; nor[v * 3 + 1] = 2 * step / l; nor[v * 3 + 2] = -hz / l;
    }
    yield 'terrain mesh';
    const idx = new Uint16Array(GRID * GRID * 6); let q = 0;
    for (let r = 0; r < GRID; r++) for (let k = 0; k < GRID; k++) { const a = r * N + k, b = a + 1, d = a + N, e = d + 1; idx[q++] = a; idx[q++] = d; idx[q++] = b; idx[q++] = b; idx[q++] = d; idx[q++] = e; }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.BufferAttribute(nor, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3)); g.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); g.setIndex(new THREE.BufferAttribute(idx, 1)); g.computeBoundingSphere();
    const terrain = new THREE.Mesh(g, M.ground); terrain.name = 'terrain'; terrain.receiveShadow = M.shadows; terrain.userData.terrain = true; group.add(terrain);
  }
  yield 'grass';

  /* ground foliage: one merged mesh for grass, flowers, ferns, clover, leaf litter and reeds */
  const foliage = new Buffer(), rocks = new Buffer();
  for (const region of regions) {
    const R = rng(tileSeed(region.seed, i, j)), b = region.bounds, D = region.decoration || {};
    const ax0 = Math.max(x0, b.x0), ax1 = Math.min(x0 + TILE, b.x1), az0 = Math.max(z0, b.z0), az1 = Math.min(z0 + TILE, b.z1), area = (ax1 - ax0) * (az1 - az0);
    if (area <= 0) continue;
    const spot = () => [ax0 + R() * (ax1 - ax0), az0 + R() * (az1 - az0)];
    const nearTree = (x, z) => region.trees.reduce((m, tr) => Math.min(m, Math.hypot(tr.x - x, tr.z - z) - tr.r), Infinity);
    const onCrossing = (x, z) => region.crossings.some(c => { const dx = c.b[0] - c.a[0], dz = c.b[1] - c.a[1], tt = clamp(((x - c.a[0]) * dx + (z - c.a[1]) * dz) / (dx * dx + dz * dz), 0, 1); return Math.hypot(x - c.a[0] - dx * tt, z - c.a[1] - dz * tt) < c.width / 2 + .4; });
    const solidPad = (x, z, pad) => region.blocked(x, z, pad);
    // grass
    for (let k = 0, n = Math.round(area * (D.grass ?? 3)); k < n; k++) {
      if (k % 40 === 39) yield 'grass';
      const [x, z] = spot(), bk = region.brook && region.brook.at(x, z), pa = region.pathAt(x, z);
      if ((bk && bk.d < bk.w / 2 + .3) || pa.d < pa.w / 2 - .1 + (R() - .5) * .3 || solidPad(x, z, -.2) || onCrossing(x, z)) continue;
      const v = .82 + R() * .3, warm = fbm(x * .05 + 9, z * .05);
      foliage.add(t.grass, {x, y: region.ground(x, z, bk, pa) - .02, z, ry: R() * TAU, sx: .8 + R() * .6, sy: .7 + R() * .8, sz: .8 + R() * .6, cell: ATLAS.grass, up: true, c: tone.setRGB(v * (1 + warm * .12), v, v * .86)});
    }
    yield 'ferns';
    // ferns near trees and water, in shady drifts
    for (let k = 0, n = Math.round(area * (D.ferns ?? .3)); k < n; k++) {
      const [x, z] = spot(), bk = region.brook && region.brook.at(x, z), pa = region.pathAt(x, z);
      if (pa.d < pa.w / 2 + .5 || (bk && bk.d < bk.w / 2 + .15) || solidPad(x, z, .1) || onCrossing(x, z)) continue;
      if (!(nearTree(x, z) < 3.2 || (bk && bk.d < bk.w / 2 + 1.6) || fbm(x * .2, z * .2) > .64)) continue;
      const l = .62 + R() * .12, c = tone.setHSL(.25, .35, l), s = .7 + R() * .6;
      foliage.add(t.fern, {x, y: region.ground(x, z, bk, pa), z, ry: R() * TAU, sx: s, sy: s, sz: s, cell: ATLAS.fern, up: true, c});
    }
    yield 'flowers';
    // flowers in drifts: daisies, buttercups, bellflowers, campion
    for (let kind = 0; kind < 4; kind++) for (let k = 0, n = Math.round(area * (D.flowers ?? .3)); k < n; k++) {
      if (k % 40 === 39) yield 'flowers';
      const [x, z] = spot(); if (fbm(x * .16 + kind * 7.1, z * .16 - kind * 3.3) < .58) continue;
      const bk = region.brook && region.brook.at(x, z), pa = region.pathAt(x, z);
      if (pa.d < pa.w / 2 + .2 || (bk && bk.d < bk.w / 2 + .3) || solidPad(x, z, 0) || onCrossing(x, z)) continue;
      const s = (kind === 2 ? 1.15 : 1) * (.8 + R() * .5);
      foliage.add(kind === 2 ? t.bell : t.flower, {x, y: region.ground(x, z, bk, pa) + (kind === 1 ? .05 : 0), z, ry: R() * TAU, sx: s, sy: s, sz: s, cell: [ATLAS.daisy, ATLAS.buttercup, ATLAS.bell, ATLAS.campion][kind], up: true});
    }
    // clover patches off the trails, fallen leaves on them
    for (let k = 0, n = Math.round(area * (D.clover ?? .1)); k < n; k++) {
      const [x, z] = spot(), bk = region.brook && region.brook.at(x, z), pa = region.pathAt(x, z), onPath = pa.d < pa.w / 2 + .1;
      if ((bk && bk.d < bk.w / 2 + .4) || solidPad(x, z, 0) || onCrossing(x, z)) continue;
      if (!onPath && R() < .25) continue;
      const s = onPath ? .55 + R() * .5 : .9 + R() * 1.2;
      foliage.add(t.flat, {x, y: region.ground(x, z, bk, pa) + (onPath ? .035 : .03), z, ry: R() * TAU, sx: s, sy: 1, sz: s, cell: onPath ? ATLAS.litter : ATLAS.clover, up: true});
    }
    yield 'brook';
    // along the brook: reeds and cattails, rocks on the banks, pebbles in the bed
    if (region.brook) {
      const br = region.brook;
      for (let s = 0; s < br.samples.length; s += 3) {
        const p = br.samples[s]; if (!inTile(p.x, p.z)) continue;
        if (s % 24 === 0) yield 'brook';
        const Rs = rng(tileSeed(region.seed, s, 7)), tt = s / br.N, w = br.width(tt) / 2, q = br.samples[Math.min(br.N, s + 1)], dx = q.x - p.x, dz = q.z - p.z, l = Math.hypot(dx, dz) || 1;
        if (fbm(tt * 30, 2) > .55) for (const side of [-1, 1]) { if (Rs() < .45) continue; const off = w + .05 + Rs() * .4, x = p.x - dz / l * off * side, z = p.z + dx / l * off * side; if (region.pathAt(x, z).d < 1.2 || onCrossing(x, z) || !inTile(x, z)) continue; const sc = .8 + Rs() * .5; foliage.add(t.reeds, {x, y: region.ground(x, z) - .05, z, ry: Rs() * TAU, sx: sc, sy: sc, sz: sc, cell: ATLAS.reeds, up: true}); }
        if (s % 4 === 0 && fbm(tt * 22, 7) > .5) { const side = Rs() < .5 ? -1 : 1, off = w + (Rs() - .3) * .6, x = p.x - dz / l * off * side, z = p.z + dx / l * off * side; if (region.pathAt(x, z).d > 1 && !onCrossing(x, z) && inTile(x, z)) { const sc = .22 + Rs() * .4; rocks.add(t.rock, {x, y: region.ground(x, z) + .02, z, ry: Rs() * TAU, sx: sc, sy: sc, sz: sc}); } }
        for (let k = 0; k < 2; k++) { const off = (Rs() * 2 - 1) * w * .9, x = p.x - dz / l * off, z = p.z + dx / l * off; if (!inTile(x, z)) continue; const v = .7 + Rs() * .5, sc = .05 + Rs() * .08; rocks.add(t.pebble, {x, y: region.ground(x, z) + .02, z, ry: Rs() * TAU, sx: sc, sy: sc, sz: sc, c: tone.setRGB(v, v * .95, v * .85)}); }
      }
    }
    yield 'rocks';
    // the region's fixed rocks (the owl's rock) and a few mossy rocks near trees
    for (const [x, z, s, h] of region.rocks || []) if (inTile(x, z)) rocks.add(t.rock, {x, y: region.ground(x, z) - .05, z, ry: x * 1.7, sx: s * 1.05, sy: s * h, sz: s * .95});
    for (let k = 0, n = Math.round(area * (D.rocks ?? .012)); k < n; k++) {
      const [x, z] = spot(), bk = region.brook && region.brook.at(x, z), pa = region.pathAt(x, z);
      if (pa.d < pa.w / 2 + .8 || (bk && bk.d < bk.w / 2 + 1) || nearTree(x, z) > 4 || solidPad(x, z, .3) || region.walkable(x, z)) continue;
      const sc = .3 + R() * .7; rocks.add(t.rock, {x, y: region.ground(x, z, bk, pa) + .05, z, ry: R() * TAU, sx: sc, sy: sc, sz: sc});
    }
    // flat stones along the trails
    for (const tr of region.trails) for (let s = 4; s < tr.samples.length; s += 4) {
      if (s % 3 === 1) { const p = tr.samples[s]; if (inTile(p.x, p.z)) { const Rs = rng(tileSeed(region.seed, s, 57 + tr.samples.length)); if (Rs() < .7) { const x = p.x + (Rs() - .5) * tr.w * .8, z = p.z + (Rs() - .5) * tr.w * .8, sc = .5 + Rs() * .5; foliage.add(t.flat, {x, y: region.ground(x, z) + .035, z, ry: Rs() * TAU, sx: sc, sy: 1, sz: sc, cell: ATLAS.litter, up: true}); } } }
      if (s % 3) continue;
      const p = tr.samples[s]; if (!inTile(p.x, p.z)) continue; const Rs = rng(tileSeed(region.seed, s, 31 + tr.samples.length)), x = p.x + (Rs() - .5) * .4, z = p.z + (Rs() - .5) * .4;
      if (region.brook && region.brook.at(x, z)?.d < 2) continue; rocks.add(t.stone, {x, y: region.ground(x, z) + .01, z, ry: Rs() * TAU, sx: .2 + Rs() * .12, sy: .06, sz: .16 + Rs() * .1});
    }
    // mushrooms at the foot of trees
    for (const tree of region.trees) { if (!inTile(tree.x, tree.z)) continue; const Rs = rng(tileSeed(region.seed, Math.round(tree.x * 7), Math.round(tree.z * 7)));
      for (let k = 0, n = Math.floor(Rs() * 4); k < n; k++) { const a = Rs() * TAU, d = tree.r * 1.4 + .3 + Rs() * .9, x = tree.x + Math.cos(a) * d, z = tree.z + Math.sin(a) * d, sc = .9 + Rs() * 1.2, y = region.ground(x, z), red = Rs() < .5;
        rocks.add(t.stem, {x, y, z, ry: Rs() * TAU, sx: sc, sy: sc, sz: sc}); rocks.add(t.cap, {x, y, z, ry: Rs() * TAU, sx: sc, sy: sc, sz: sc, c: red ? C('#c8352a') : C('#8a5a2e')}); } }
  }
  if (wild) {
    const R = rng(tileSeed(wild.seed + 1, i, j)), D = wild.decoration;
    for (let k = 0, n = Math.round(TILE * TILE * D.grass); k < n; k++) {
      if (k % 60 === 59) yield 'grass';
      const x = x0 + R() * TILE, z = z0 + R() * TILE; if (world.regionAt(x, z) || world.linkDistance(x, z) < .8 || wildTrees.some(w => Math.hypot(w.x - x, w.z - z) < w.r + .3)) continue;
      const v = .82 + R() * .3; foliage.add(t.grass, {x, y: world.ground(x, z) - .02, z, ry: R() * TAU, sx: .8 + R() * .6, sy: .7 + R() * .8, sz: .8 + R() * .6, cell: ATLAS.grass, up: true, c: tone.setRGB(v, v, v * .86)});
    }
  }
  yield 'foliage mesh';
  add(meshOf(foliage, M.plants, {name: 'foliage'}));
  yield 'rock mesh';
  add(meshOf(rocks, M.rock, {name: 'rocks'}));
  return group;
}
