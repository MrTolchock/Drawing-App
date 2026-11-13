/* Tiles of the big world: 16 × 16 m pieces built from the terrain functions and the tile's trees,
   in small steps (a generator, like world/tiles.js) so the streamer can spread the work over frames.
   Near tile: terrain, one merged plant mesh, rocks, trunks, instanced leaf cards, "stand" (birch
   trunks, spruce boughs and snags, which take their colours from the plant atlas) and water.
   Far tile: a single mesh on the plant atlas (coarse ground, tree cards, flat water). */
import {THREE} from '../../../scene/materials.js';
import {TAU, clamp, lerp, sstep, fbm, rng, tileSeed} from '../noise.js';
import {TILE, Buffer, quads, templates, trunkGeometry, rootGeometries, crownCards, instanced} from '../tiles.js';
import {ATLAS} from './atlas.js';

const GRID = 32, FAR_GRID = 8, SEED = 77123;
const C = h => new THREE.Color(h), tone = new THREE.Color(), tone2 = new THREE.Color();
const WHITE_UV = [ATLAS.white[0] + ATLAS.white[2] / 2, ATLAS.white[1] + ATLAS.white[3] / 2];

/* ---------- small builders ---------- */
let extra = null;
function bigTemplates() { return extra || (extra = {card: quads(1, 1, [0, Math.PI / 2]), bush: quads(1.5, 1.1, [0, Math.PI / 3, -Math.PI / 3]), tall: quads(.95, .62, [0, Math.PI / 2, Math.PI / 4]), heather: quads(.6, .5, [0, Math.PI / 2])}); }
/** Four corners (x, y, z each) as one quad on an atlas cell. */
function quad(buf, P, cell, r, g, b, nx = 0, ny = 1, nz = 0) {
  const base = buf.n; buf.grow(base + 4, buf.ni + 6);
  for (let k = 0; k < 4; k++) { const v = base + k; buf.pos[v * 3] = P[k * 3]; buf.pos[v * 3 + 1] = P[k * 3 + 1]; buf.pos[v * 3 + 2] = P[k * 3 + 2]; buf.nor[v * 3] = nx; buf.nor[v * 3 + 1] = ny; buf.nor[v * 3 + 2] = nz;
    buf.uv[v * 2] = cell[0] + (k === 1 || k === 2 ? cell[2] : 0); buf.uv[v * 2 + 1] = cell[1] + (k > 1 ? cell[3] : 0); buf.col[v * 3] = r; buf.col[v * 3 + 1] = g; buf.col[v * 3 + 2] = b; }
  buf.idx[buf.ni++] = base; buf.idx[buf.ni++] = base + 1; buf.idx[buf.ni++] = base + 2; buf.idx[buf.ni++] = base; buf.idx[buf.ni++] = base + 2; buf.idx[buf.ni++] = base + 3; buf.n += 4;
}
/** A geometry coloured by a function, drawn from the atlas' white cell (vertex colours only). */
function solid(buf, geo, colour) {
  const p = geo.attributes.position, n = geo.attributes.normal, base = buf.n, count = geo.index ? geo.index.count : p.count; buf.grow(base + p.count, buf.ni + count);
  buf.pos.set(p.array, base * 3); buf.nor.set(n.array, base * 3);
  for (let i = 0; i < p.count; i++) { const v = base + i; colour(p.getX(i), p.getY(i), p.getZ(i), tone); buf.uv[v * 2] = WHITE_UV[0]; buf.uv[v * 2 + 1] = WHITE_UV[1]; buf.col[v * 3] = tone.r; buf.col[v * 3 + 1] = tone.g; buf.col[v * 3 + 2] = tone.b; }
  if (geo.index) { const a = geo.index.array; for (let k = 0; k < a.length; k++) buf.idx[buf.ni++] = base + a[k]; } else for (let i = 0; i < p.count; i++) buf.idx[buf.ni++] = base + i;
  buf.n += p.count; geo.dispose();
}
const BIRCH = C('#f1ece0'), BIRCH_D = C('#3b352d'), SNAG = C('#9a9384'), SNAG_D = C('#6c6659'), SPRUCE_BARK = C('#c9a58a');

/* ---------- the water material: flowing streams and still pools in one shader ---------- */
export function waterMaterial(look, fog) {
  if (look.M.water) return look.M.water;
  return look.M.water = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side: THREE.DoubleSide,
    uniforms: {uTime: {value: 3.7}, uNoise: {value: look.T.noise}, uShallow: {value: C('#7fc3b0')}, uDeep: {value: C('#1d6476')}, uFoam: {value: C('#f6fbf2')}, uSky: {value: C('#e6f1df')}, uSun: {value: C('#fff1c8')}, uSunDir: {value: fog.sunDir}, fogColor: {value: fog.color}, fogNear: {value: fog.near}, fogFar: {value: fog.far}},
    vertexShader: 'attribute vec3 wa;varying vec2 vUv;varying vec3 vW,vA;varying float vFog;void main(){vUv=uv;vA=wa;vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;vec4 mv=viewMatrix*w;vFog=-mv.z;gl_Position=projectionMatrix*mv;}',
    // wa = (1 for a stream / 0 for still water, depth 0…1 of still water, fade at a stream's ends)
    fragmentShader: `uniform float uTime;uniform sampler2D uNoise;uniform vec3 uShallow,uDeep,uFoam,uSky,uSun,uSunDir,fogColor;uniform float fogNear,fogFar;varying vec2 vUv;varying vec3 vW,vA;varying float vFog;
    void main(){
      float flow=vA.x;float across=mix(1.-smoothstep(0.,.5,vA.y),abs(vUv.x-.5)*2.,flow);float along=vUv.y;
      vec2 still=vW.xz*.09;
      vec2 f1=mix(still+vec2(uTime*.008,uTime*.005),vec2(vUv.x*.6,along*.07-uTime*.12),flow),f2=mix(still*1.9+vec2(.37-uTime*.011,uTime*.007),vec2(vUv.x*1.1+.37,along*.12-uTime*.2),flow);
      float n1=texture2D(uNoise,f1).r,n2=texture2D(uNoise,f2).r,n=(n1+n2)*.5;
      float e=.015;float nx=texture2D(uNoise,f2+vec2(e,0.)).r-n2,nz=texture2D(uNoise,f2+vec2(0.,e)).r-n2;
      vec3 N=normalize(vec3(-nx*mix(1.2,2.5,flow),1.,-nz*mix(1.2,2.5,flow)));vec3 V=normalize(cameraPosition-vW);
      float depth=mix(vA.y,1.-across*across,flow);
      vec3 c=mix(uShallow,uDeep,smoothstep(.0,.8,depth)*.92);
      c*=.94+.12*n;
      float fres=pow(1.-max(dot(N,V),0.),4.);c=mix(c,uSky,fres*mix(.5,.35,flow));
      vec3 Hh=normalize(uSunDir+V);c+=uSun*smoothstep(.72,.92,n2)*pow(max(dot(N,Hh),0.),260.)*1.4;
      float streak=smoothstep(.7,.82,n2)*(.2+.6*depth)*flow;c=mix(c,uFoam,streak*.08);
      float foam=smoothstep(.84,.99,across)*smoothstep(.45,.7,n1+.18*sin(along*2.6+uTime*1.7))*mix(.0,1.,flow);
      c=mix(c,uFoam,foam*.7);
      float alpha=mix(.86,.35,smoothstep(.45,1.,across));alpha=max(alpha,foam*.8);
      alpha*=mix(smoothstep(.0,.16,vA.y),vA.z,flow);
      c=mix(c,fogColor,smoothstep(fogNear,fogFar,vFog));
      gl_FragColor=vec4(c,alpha);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`,
  });
}

/* ---------- the tile ---------- */
export function* buildBigTile(world, look, i, j, ring) {
  const {M} = look, T = world.terrain, L = world.layout, t = templates(), bt = bigTemplates(), x0 = i * TILE, z0 = j * TILE;
  const group = new THREE.Group(); group.name = 'tile ' + i + ',' + j + ' ' + ring;
  const inTile = (x, z) => x >= x0 && x < x0 + TILE && z >= z0 && z < z0 + TILE;
  const meshOf = (buffer, material, opts = {}) => { const g = buffer.geometry(); if (!g) return null; const m = new THREE.Mesh(g, material); m.castShadow = !!opts.cast && M.shadows; m.receiveShadow = opts.receive !== false && M.shadows; if (opts.depth && M.shadows) m.customDepthMaterial = opts.depth; m.name = opts.name || ''; group.add(m); return m; };
  const trees = world.treesIn(i, j), bm = {};
  // what this tile is made of, judged at its centre and corners (to skip whole passes)
  const mix = {meadow: 0, swamp: 0, rock: 0, spruce: 0, birch: 0};
  for (const [u, v] of [[.5, .5], [.1, .1], [.9, .1], [.1, .9], [.9, .9]]) { T.biome(x0 + u * TILE, z0 + v * TILE, bm); for (const k in mix) mix[k] = Math.max(mix[k], bm[k]); }

  if (ring === 'far') { yield* farTile(); return group; }

  /* trees */
  const trunks = new Buffer(), stand = new Buffer(), leaves = [];
  for (const tree of trees) {
    yield 'trunk';
    const R = rng(tileSeed(SEED, Math.round(tree.x * 10), Math.round(tree.z * 10))), y0 = T.ground(tree.x, tree.z);
    if (tree.kind === 'spruce') { spruce(tree, y0, R, trunks, stand); continue; }
    if (tree.kind === 'birch') { birch(tree, y0, R, stand, leaves); continue; }
    if (tree.kind === 'snag') { snag(tree, y0, R, stand); continue; }
    const big = tree.kind === 'oak' || tree.kind === 'hollow', small = tree.kind === 'alder' || tree.kind === 'willow';
    const {geo, crownY} = trunkGeometry({...tree, s: small ? .8 : 1, height: big ? 1.05 : undefined}, y0, R); trunks.addGeometry(geo); geo.dispose();
    yield 'roots';
    for (const g of rootGeometries(tree, T.ground, R)) { trunks.addGeometry(g); g.dispose(); }
    if (tree.branch) { const [dx, dy, r] = tree.branch, pts = [[0, dy - .25, 0], [dx * .5, dy, .1], [dx, dy + .08, .25]].map(([a, b, c]) => new THREE.Vector3(tree.x + a, y0 + b, tree.z + c)); const g = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 8, r * .22, 6); const col = new Float32Array(g.attributes.position.count * 3); for (let k = 0; k < col.length; k += 3) { col[k] = 1; col[k + 1] = .92; col[k + 2] = .85; } g.setAttribute('color', new THREE.BufferAttribute(col, 3)); trunks.addGeometry(g); g.dispose(); }
    yield 'crown';
    const crownR = (3.0 + tree.r * 2.6) * (small ? .62 : 1), cards = crownCards(tree.x, crownY, tree.z, crownR, small ? 40 : big ? 110 : 80, R, world.sunDir, small ? [1.4, 1] : [2.1, 1.4]);
    if (tree.kind === 'alder') for (const c of cards) c.c = new THREE.Color(c.c * .8, c.c * .95, c.c * .78);
    if (tree.kind === 'willow') { willow(tree, crownY, y0, R, leaves); continue; }
    if (tree.kind === 'hollow') hollow(tree, y0, trunks);
    leaves.push(...cards);
  }
  yield 'leaves';
  meshOf(trunks, M.bark, {cast: true, name: 'trunks'});
  { const m = instanced(leafCardGeometry(), M.leaves, leaves, {cast: M.shadows, receive: false, depth: M.leafDepth, name: 'leaf cards'}); if (m) { m.userData.shared = true; group.add(m); } }
  yield 'stand';
  meshOf(stand, M.plants, {cast: true, depth: M.plantDepth, name: 'stand'});

  /* terrain: heights on the grid plus a one-cell ring, so normals agree across tile edges */
  yield 'terrain';
  {
    const N = GRID + 1, W = N + 2, step = TILE / GRID, pos = new Float32Array(N * N * 3), nor = new Float32Array(N * N * 3), col = new Float32Array(N * N * 3), uv = new Float32Array(N * N * 2), H = new Float32Array(W * W);
    for (let r = -1; r <= N; r++) {
      for (let k = -1; k <= N; k++) {
        const x = x0 + k * step, z = z0 + r * step, h = T.ground(x, z); H[(r + 1) * W + k + 1] = h;
        if (r >= 0 && k >= 0 && r < N && k < N) { const v = r * N + k; pos[v * 3] = x; pos[v * 3 + 1] = h; pos[v * 3 + 2] = z; uv[v * 2] = x / 2; uv[v * 2 + 1] = z / 2; T.colour(x, z, tone); col[v * 3] = tone.r; col[v * 3 + 1] = tone.g; col[v * 3 + 2] = tone.b; }
      }
      if (r % 2) yield 'terrain';
    }
    yield 'normals';
    for (let r = 0; r < N; r++) for (let k = 0; k < N; k++) {
      const hx = H[(r + 1) * W + k + 2] - H[(r + 1) * W + k], hz = H[(r + 2) * W + k + 1] - H[r * W + k + 1], l = Math.hypot(hx, 2 * step, hz), v = r * N + k, up = 2 * step / l;
      nor[v * 3] = -hx / l; nor[v * 3 + 1] = up; nor[v * 3 + 2] = -hz / l;
      if (up < .93) { tone.setRGB(col[v * 3], col[v * 3 + 1], col[v * 3 + 2]); T.cliff(pos[v * 3], pos[v * 3 + 2], up, tone); col[v * 3] = tone.r; col[v * 3 + 1] = tone.g; col[v * 3 + 2] = tone.b; }
    }
    yield 'terrain mesh';
    const idx = new Uint16Array(GRID * GRID * 6); let q = 0;
    for (let r = 0; r < GRID; r++) for (let k = 0; k < GRID; k++) { const a = r * N + k, b = a + 1, d = a + N, e = d + 1; idx[q++] = a; idx[q++] = d; idx[q++] = b; idx[q++] = b; idx[q++] = d; idx[q++] = e; }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.BufferAttribute(nor, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3)); g.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); g.setIndex(new THREE.BufferAttribute(idx, 1)); g.computeBoundingSphere();
    const terrain = new THREE.Mesh(g, M.ground); terrain.name = 'terrain'; terrain.receiveShadow = M.shadows; terrain.userData.terrain = true; group.add(terrain);
  }

  /* ground plants: one merged mesh */
  const foliage = new Buffer(), rocks = new Buffer(), R = rng(tileSeed(SEED + 1, i, j)), area = TILE * TILE;
  const spot = () => [x0 + R() * TILE, z0 + R() * TILE];
  const treeGap = (x, z) => { let m = Infinity; for (const tr of trees) m = Math.min(m, Math.hypot(tr.x - x, tr.z - z) - tr.r); return m; };
  // a spot plants can grow on: not in water, not on a trail, not inside a collider or on a crossing
  const dry = (s, pathPad = -.1) => s.sd - s.sw / 2 > .3 && !(s.still - s.h > -.03) && s.pd > s.pw / 2 + pathPad;
  yield 'grass';
  for (let k = 0, n = Math.round(area * 3.2); k < n; k++) {
    if (k % 40 === 39) yield 'grass';
    const [x, z] = spot(), s = T.site(x, z), h = s.h; if (!dry(s, -.1 + (R() - .5) * .3) || T.snow(x, z) > R() * .3) continue;   // no grass on the snow
    T.biome(x, z, bm); if (R() < bm.spruce * .62 + bm.rock * .8 + bm.swamp * .35) continue;
    if (world.blocked(x, z, -.2) || T.onCrossing(x, z)) continue;
    const v = .82 + R() * .3, warm = fbm(x * .05 + 9, z * .05), tall = R() < bm.meadow * .7;
    if (tall) foliage.add(bt.tall, {x, y: h - .02, z, ry: R() * TAU, sx: .9 + R() * .5, sy: .9 + R() * .7, sz: .9 + R() * .5, cell: ATLAS.tallgrass, up: true, c: tone.setRGB(v * 1.02, v, v * .8)});
    else foliage.add(t.grass, {x, y: h - .02, z, ry: R() * TAU, sx: .8 + R() * .6, sy: .7 + R() * .8, sz: .8 + R() * .6, cell: ATLAS.grass, up: true, c: tone.setRGB(v * (1 + warm * .12), v, v * .86).lerp(tone2.setRGB(.62, .7, .5), bm.swamp * .6)});
  }
  yield 'flowers';
  { // drifts of flowers: four kinds in the woods; the meadow adds poppies and cornflowers and many more of each
    const kinds = [[ATLAS.daisy, t.flower, 1, 0], [ATLAS.buttercup, t.flower, 1, .05], [ATLAS.bell, t.bell, 1.15, 0], [ATLAS.campion, t.flower, 1, 0], [ATLAS.poppy, t.flower, 1.25, .1], [ATLAS.cornflower, t.flower, 1.05, .08]];
    for (let kind = 0; kind < kinds.length; kind++) {
      const meadowOnly = kind > 3; if (meadowOnly && !mix.meadow) continue;
      const [cellUv, tpl, size, lift] = kinds[kind], per = mix.meadow ? 1.7 : .3;
      for (let k = 0, n = Math.round(area * per); k < n; k++) {
        if (k % 40 === 39) yield 'flowers';
        const [x, z] = spot(), drift = fbm(x * .16 + kind * 7.1, z * .16 - kind * 3.3), s0 = T.site(x, z); if (!dry(s0, .2) || T.snow(x, z) > .05) continue; const h = s0.h;
        T.biome(x, z, bm); const md = bm.meadow;
        if (drift < lerp(.58, .47, md) || R() > (meadowOnly ? md : lerp(.3 / per, 1, md)) || R() < bm.spruce * .8 + bm.rock * .7 + bm.swamp * .8) continue;
        if (world.blocked(x, z, 0) || T.onCrossing(x, z)) continue;
        const sc = size * (.8 + R() * .5) * (1 + md * .25);
        foliage.add(tpl, {x, y: h + lift + md * .12, z, ry: R() * TAU, sx: sc, sy: sc * (1 + md * .5), sz: sc, cell: cellUv, up: true});
      }
    }
  }
  yield 'ferns';
  for (let k = 0, n = Math.round(area * (.3 + .35 * mix.spruce)); k < n; k++) {
    const [x, z] = spot(), s0 = T.site(x, z); if (!dry(s0, .5) || T.snow(x, z) > .05) continue; const h = s0.h, nearWater = s0.sd - s0.sw / 2 < 1.6;
    T.biome(x, z, bm); if (R() < bm.meadow * .95 + bm.rock * .6) continue;
    if (!(treeGap(x, z) < 3.2 || nearWater || fbm(x * .2, z * .2) > .64) || world.blocked(x, z, .1) || T.onCrossing(x, z)) continue;
    const l = .62 + R() * .12 - bm.spruce * .06, c = tone.setHSL(.25 + bm.spruce * .03, .35, l), sc = .7 + R() * .6;
    foliage.add(t.fern, {x, y: h, z, ry: R() * TAU, sx: sc, sy: sc, sz: sc, cell: ATLAS.fern, up: true, c});
  }
  for (let k = 0, n = Math.round(area * .1); k < n; k++) { // clover off the trails, fallen leaves on them
    const [x, z] = spot(), s0 = T.site(x, z), onPath = s0.pd < s0.pw / 2 + .1; if (s0.sd - s0.sw / 2 < .4 || s0.still - s0.h > -.05 || T.snow(x, z) > .05) continue; const h = s0.h;
    if (world.blocked(x, z, 0) || T.onCrossing(x, z) || (!onPath && R() < .25)) continue;
    const sc = onPath ? .55 + R() * .5 : .9 + R() * 1.2;
    foliage.add(t.flat, {x, y: h + (onPath ? .035 : .03), z, ry: R() * TAU, sx: sc, sy: 1, sz: sc, cell: onPath ? ATLAS.litter : ATLAS.clover, up: true});
  }
  yield 'shrubs';
  if (mix.rock || mix.meadow) for (let k = 0, n = Math.round(area * .45); k < n; k++) { // heather on the Rock's skirts and here and there in the meadow
    const [x, z] = spot(); T.biome(x, z, bm); if (R() > bm.rock * .8 + bm.meadow * .05 || bm.snow > .05) continue;
    const s0 = T.site(x, z); if (!dry(s0, .3) || world.blocked(x, z, 0)) continue; const sc = .8 + R() * .7;
    foliage.add(bt.heather, {x, y: s0.h - .03, z, ry: R() * TAU, sx: sc, sy: sc, sz: sc, cell: ATLAS.heather, up: true});
  }
  for (let k = 0, n = Math.round(area * .014); k < n; k++) { // brambles at the wood's edge
    const [x, z] = spot(); T.biome(x, z, bm); if (bm.swamp > .3 || bm.rock > .5 || bm.glade > .5 || bm.meadow > .8 || bm.snow > .05) continue;
    const s0 = T.site(x, z); if (!dry(s0, 1.4) || s0.sd - s0.sw / 2 < 1.5 || treeGap(x, z) < 1 || world.blocked(x, z, .4) || T.onCrossing(x, z)) continue; const sc = .8 + R() * .5, v = .85 + R() * .2;
    foliage.add(bt.bush, {x, y: s0.h - .05, z, ry: R() * TAU, sx: sc, sy: sc, sz: sc, cell: ATLAS.bush, up: true, c: tone.setRGB(v, v, v)});
  }
  yield 'brook';
  for (const s of T.streams) { // along the streams: reeds, bank rocks, pebbles in the bed
    for (let k = 0; k <= s.N; k += 4) {
      const p = s.samples[k]; if (!inTile(p.x, p.z)) continue;
      if (k % 32 === 0) yield 'brook';
      const Rs = rng(tileSeed(SEED + 2, k, s.N)), tt = k / s.N, w = s.width(k) / 2, q = s.samples[Math.min(s.N, k + 1)], o = s.samples[Math.max(0, k - 1)], dx = q.x - o.x, dz = q.z - o.z, l = Math.hypot(dx, dz) || 1;
      if (fbm(tt * 30 + s.N, 2) > .55 && T.snow(p.x, p.z) < .05) for (const side of [-1, 1]) { if (Rs() < .45) continue; const off = w + .05 + Rs() * .4, x = p.x - dz / l * off * side, z = p.z + dx / l * off * side; if (T.pathAt(x, z).d < 1.2 || T.onCrossing(x, z) || T.stillDepth(x, z) > .05) continue; const sc = .8 + Rs() * .5; foliage.add(t.reeds, {x, y: T.ground(x, z) - .05, z, ry: Rs() * TAU, sx: sc, sy: sc, sz: sc, cell: ATLAS.reeds, up: true}); }
      if (k % 8 === 0 && fbm(tt * 22, 7 + s.N) > .5) { const side = Rs() < .5 ? -1 : 1, off = w + (Rs() - .3) * .6, x = p.x - dz / l * off * side, z = p.z + dx / l * off * side; if (T.pathAt(x, z).d > 1 && !T.onCrossing(x, z)) { const sc = .22 + Rs() * .4; rocks.add(t.rock, {x, y: T.ground(x, z) + .02, z, ry: Rs() * TAU, sx: sc, sy: sc, sz: sc}); } }
      { const off = (Rs() * 2 - 1) * w * .9, x = p.x - dz / l * off, z = p.z + dx / l * off, v = .7 + Rs() * .5, sc = .05 + Rs() * .08; rocks.add(t.pebble, {x, y: T.ground(x, z) + .02, z, ry: Rs() * TAU, sx: sc, sy: sc, sz: sc, c: tone.setRGB(v, v * .95, v * .85)}); }
    }
  }
  yield 'shore';
  if (mix.swamp || T.pools.some(p => Math.abs(p.x - x0 - 8) < p.rx + 12 && Math.abs(p.z - z0 - 8) < p.rx + 12)) for (let k = 0, n = Math.round(area * (mix.swamp ? 1.5 : .9)); k < n; k++) { // still water: reeds and cattails on the shore, lily pads afloat
    if (k % 60 === 59) yield 'shore';
    const [x, z] = spot(), s0 = T.site(x, z); if (!(s0.still === s0.still)) continue; const depth = s0.still - s0.h, level = s0.still;
    if (T.onCrossing(x, z) || s0.pd < s0.pw / 2 + .6) continue; T.biome(x, z, bm);
    if (depth > -.14 && depth < .14) { if (fbm(x * .3, z * .3) < .5 || s0.sd - s0.sw / 2 < 1) continue; const sc = .8 + R() * .6, kind = bm.swamp > .4 ? (R() < .5 ? ATLAS.cattail : ATLAS.sedge) : (R() < .6 ? ATLAS.reeds : ATLAS.cattail); foliage.add(t.reeds, {x, y: Math.max(s0.h, level) - .08, z, ry: R() * TAU, sx: sc, sy: sc * (kind === ATLAS.sedge ? .6 : 1), sz: sc, cell: kind, up: true}); }
    else if (depth > .16 && R() < (bm.swamp > .4 ? .34 : .1) && fbm(x * .22 + 3, z * .22) > .46) { const sc = .5 + R() * .45, v = .85 + R() * .25; foliage.add(t.flat, {x, y: level + .012, z, ry: R() * TAU, sx: sc, sy: 1, sz: sc, cell: ATLAS.lilypad, up: true, c: tone.setRGB(v, v, v)}); if (R() < .22) foliage.add(t.flat, {x: x + .08, y: level + .05, z: z - .05, ry: R() * TAU, sx: sc * .5, sy: 1, sz: sc * .5, cell: ATLAS.lily, up: true}); }
    else if (depth < -.14 && depth > -.6 && bm.swamp > .3 && R() < .25) { const sc = .7 + R() * .6; foliage.add(t.reeds, {x, y: s0.h - .04, z, ry: R() * TAU, sx: sc, sy: sc * .55, sz: sc, cell: ATLAS.sedge, up: true}); }
  }
  yield 'rocks';
  for (const [x, z, sz, hh] of L.ROCKS) if (inTile(x, z)) rocks.add(t.rock, {x, y: T.ground(x, z) - .05, z, ry: x * 1.7, sx: sz * 1.05, sy: sz * hh, sz: sz * .95});
  for (let k = 0, n = Math.round(area * (.012 + .09 * mix.rock)); k < n; k++) { // mossy rocks near trees; boulders and scree round the Rock
    const [x, z] = spot(), s0 = T.site(x, z); if (!dry(s0, .8) || s0.sd - s0.sw / 2 < 1) continue; const h = s0.h; T.biome(x, z, bm);
    const scree = R() < bm.rock; if ((!scree && treeGap(x, z) > 4) || world.blocked(x, z, .3)) continue;
    // rocks here are not colliders: big ones only where Fuchs cannot walk anyway
    let sc = scree ? .12 + R() * R() * .9 : .14 + R() * .2; if (sc > .32 && world.walkable(x, z)) sc = .2 + R() * .12;
    rocks.add(t.rock, {x, y: h + .03, z, ry: R() * TAU, sx: sc, sy: sc * (scree ? .7 + R() * .5 : 1), sz: sc});
  }
  for (const tr of T.trails) for (let k = 4; k < tr.samples.length; k += 4) { // flat stones and fallen leaves along the trails
    const p = tr.samples[k]; if (!inTile(p.x, p.z)) continue; const Rs = rng(tileSeed(SEED + 3, k, tr.samples.length));
    if (k % 3 === 1 && Rs() < .7) { const x = p.x + (Rs() - .5) * tr.w * .8, z = p.z + (Rs() - .5) * tr.w * .8, sc = .5 + Rs() * .5; foliage.add(t.flat, {x, y: T.ground(x, z) + .035, z, ry: Rs() * TAU, sx: sc, sy: 1, sz: sc, cell: ATLAS.litter, up: true}); }
    if (k % 3) continue; const x = p.x + (Rs() - .5) * .4, z = p.z + (Rs() - .5) * .4, s0 = T.site(x, z); if (s0.sd < 2.5 || s0.still === s0.still || T.onCrossing(x, z)) continue;
    rocks.add(t.stone, {x, y: s0.h + .01, z, ry: Rs() * TAU, sx: .2 + Rs() * .12, sy: .06, sz: .16 + Rs() * .1});
  }
  for (const tree of trees) { if (tree.kind === 'snag') continue; const Rs = rng(tileSeed(SEED + 4, Math.round(tree.x * 7), Math.round(tree.z * 7))); // mushrooms at the foot of trees
    for (let k = 0, n = Math.floor(Rs() * (tree.kind === 'spruce' ? 5 : 4)); k < n; k++) { const a = Rs() * TAU, d = tree.r * 1.4 + .3 + Rs() * .9, x = tree.x + Math.cos(a) * d, z = tree.z + Math.sin(a) * d, sc = .9 + Rs() * 1.2, red = Rs() < .5; if (T.wet(x, z)) continue; const y = T.ground(x, z);
      rocks.add(t.stem, {x, y, z, ry: Rs() * TAU, sx: sc, sy: sc, sz: sc}); rocks.add(t.cap, {x, y, z, ry: Rs() * TAU, sx: sc, sy: sc, sz: sc, c: red ? tone.set('#c8352a') : tone.set('#8a5a2e')}); } }
  yield 'foliage mesh';
  meshOf(foliage, M.plants, {name: 'foliage'});
  yield 'rock mesh';
  meshOf(rocks, M.rock, {name: 'rocks'});
  yield 'water';
  { const g = waterGeometry(); if (g) { const m = new THREE.Mesh(g, waterMaterial(look, world.fog)); m.name = 'water'; m.renderOrder = 2; group.add(m); } }
  return group;

  /* ---------- the willow and the owl's hollow tree ---------- */
  // A willow: a low dome of pale leaves and curtains of them hanging almost to the ground
  // (none on the side of its perch branch, so the bird on it stays in view).
  function willow(tree, crownY, y0, R, leafList) {
    const top = Math.max(crownY, y0 + 4.6), sun = world.sunDir, pale = (l, v) => new THREE.Color(l * 1.25 * v, l * 1.42 * v, l * .7 * v), open = tree.branch ? Math.atan2(.25, tree.branch[0]) : null;
    for (let k = 0; k < 34; k++) { const a = R() * TAU, u = Math.sqrt(R()), rr = u * 2.7, l = clamp(.7 + .3 * (Math.cos(a) * sun.x + Math.sin(a) * sun.z) + .2 * (1 - u), .55, 1.15);
      leafList.push({x: tree.x + Math.cos(a) * rr, y: top + .9 * (1 - u * u) - .2, z: tree.z + Math.sin(a) * rr, rx: (R() - .5) * 1.2, ry: R() * TAU, rz: (R() - .5) * 1.2, s: 1.5 + R() * .9, c: pale(l, .95 + R() * .1)}); }
    for (let q = 0, n = 17; q < n; q++) {
      const a = q / n * TAU + R() * .25; if (open !== null && Math.abs(Math.atan2(Math.sin(a - open), Math.cos(a - open))) < .75) continue;
      const rr = 2.5 + R() * .9, len = 2.6 + R() * 1.5, l = clamp(.72 + .3 * (Math.cos(a) * sun.x + Math.sin(a) * sun.z), .55, 1.1), sway = (R() - .5) * .5;
      for (let i = 0, m = Math.round(len / .55); i < m; i++) { const t = i / (m - 1), bow = rr + Math.sin(t * 2.2) * .35;   // a strand: small cards one below the other
        leafList.push({x: tree.x + Math.cos(a + sway * t * .2) * bow, y: top + .25 - t * len, z: tree.z + Math.sin(a + sway * t * .2) * bow, rx: (R() - .5) * .35, ry: -a + Math.PI / 2 + (R() - .5) * .7, rz: (R() - .5) * .35, s: (1.25 - t * .45) * (.9 + R() * .3), c: pale(l * (1 - t * .12), .95 + R() * .1)}); }
    }
  }
  // The hollow: a dark opening with a rim of bark, facing south where the path comes from.
  function hollow(tree, y0, trunkBuf) {
    const r = tree.r * 1.04, y = y0 + 3.0, paint = (g, cr, cg, cb) => { const c = new Float32Array(g.attributes.position.count * 3); for (let k = 0; k < c.length; k += 3) { c[k] = cr; c[k + 1] = cg; c[k + 2] = cb; } g.setAttribute('color', new THREE.BufferAttribute(c, 3)); trunkBuf.addGeometry(g); g.dispose(); };
    paint(new THREE.SphereGeometry(1, 16, 10).scale(.42, .56, .16).translate(tree.x + .1, y, tree.z + r - .02), .05, .035, .03);
    paint(new THREE.TorusGeometry(.5, .12, 8, 20).scale(.92, 1.2, .8).translate(tree.x + .1, y, tree.z + r + .02), .8, .68, .58);
  }

  /* ---------- trees of the "stand" kinds ---------- */
  function spruce(tree, y0, R, trunkBuf, standBuf) {
    const H = (8.5 + R() * 4.5) * tree.s, r = tree.r, tiers = 6 + Math.floor(R() * 2), lean = R() * TAU;
    const g = new THREE.CylinderGeometry(r * .18, r * 1.05, H, 8, 3, true).translate(tree.x, y0 + H / 2 - .1, tree.z), col = new Float32Array(g.attributes.position.count * 3);
    for (let k = 0; k < col.length; k += 3) { col[k] = SPRUCE_BARK.r; col[k + 1] = SPRUCE_BARK.g; col[k + 2] = SPRUCE_BARK.b; } g.setAttribute('color', new THREE.BufferAttribute(col, 3)); trunkBuf.addGeometry(g); g.dispose();
    const sun = world.sunDir;
    for (let k = 0; k < tiers; k++) { // skirts of hanging boughs, wide at the bottom
      const u = k / (tiers - 1), y = y0 + lerp(1.9, H * .9, u), rad = lerp(2.5 + r * 1.6, .55, u ** .85) * tree.s, n = Math.max(4, Math.round(lerp(8, 4, u))), drop = lerp(1.25, .5, u);
      for (let q = 0; q < n; q++) {
        const a = lean + q / n * TAU + k * .9 + (R() - .5) * .3, ca = Math.cos(a), sa = Math.sin(a), half = rad * Math.tan(Math.PI / n) * 1.25 + .15, v = .78 + R() * .3, light = clamp(.72 + .34 * (ca * sun.x + sa * sun.z), .55, 1.12) * v;
        const ix = tree.x + ca * .12, iz = tree.z + sa * .12, ox = tree.x + ca * rad, oz = tree.z + sa * rad, tx = -sa * half, tz = ca * half;
        quad(standBuf, [ox - tx, y - drop, oz - tz, ox + tx, y - drop, oz + tz, ix + tx * .25, y + .55, iz + tz * .25, ix - tx * .25, y + .55, iz - tz * .25], ATLAS.bough, light * .92, light, light * .9, ca * .5, .86, sa * .5);
      }
    }
    for (const a of [lean, lean + Math.PI / 2]) { const ca = Math.cos(a) * .6 * tree.s, sa = Math.sin(a) * .6 * tree.s, top = y0 + H + .5; quad(standBuf, [tree.x - ca, top - 2.3, tree.z - sa, tree.x + ca, top - 2.3, tree.z + sa, tree.x + ca * .1, top, tree.z + sa * .1, tree.x - ca * .1, top, tree.z - sa * .1], ATLAS.bough, .95, 1, .92); }
  }
  function birch(tree, y0, R, standBuf, leafList) {
    const H = (7 + R() * 2.5) * tree.s, r = tree.r, bend = (R() - .5) * .5, ba = R() * TAU, seed = R() * 40;
    const g = new THREE.CylinderGeometry(r * .45, r, H, 9, 8, true), p = g.attributes.position;
    for (let k = 0; k < p.count; k++) { const u = p.getY(k) / H + .5, off = bend * u * u; p.setXYZ(k, p.getX(k) + Math.cos(ba) * off + tree.x, p.getY(k) + H / 2 + y0 - .1, p.getZ(k) + Math.sin(ba) * off + tree.z); }
    g.computeVertexNormals();
    solid(standBuf, g, (x, y, z, out) => { const yy = y - y0, mark = sstep(.62, .7, fbm(yy * 2.6 + seed, Math.atan2(z - tree.z, x - tree.x) * 1.3)) + sstep(.5, .1, yy) * .7; return out.copy(BIRCH).lerp(BIRCH_D, clamp(mark, 0, 1) * .85); });
    if (tree.branch) { const [dx, dy, rr] = tree.branch, pts = [[0, dy - .25, 0], [dx * .5, dy, .1], [dx, dy + .08, .25]].map(([a, b, c]) => new THREE.Vector3(tree.x + a, y0 + b, tree.z + c)); solid(standBuf, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 8, rr * .2, 6), (x, y, z, out) => out.copy(BIRCH).lerp(BIRCH_D, .25)); }
    const cx = tree.x + Math.cos(ba) * bend * .8, cz = tree.z + Math.sin(ba) * bend * .8;
    for (const c of crownCards(cx, y0 + H * .78, cz, 1.9 + r * 3, 46, R, world.sunDir, [1.15, .8], 1.25)) { c.c = new THREE.Color(c.c * 1.45, c.c * 1.5, c.c * .72); leafList.push(c); }
  }
  function snag(tree, y0, R, standBuf) {
    const H = 3.5 + R() * 3.5, r = tree.r, seed = R() * 30, paint = (x, y, z, out) => out.copy(SNAG).lerp(SNAG_D, fbm(y * 1.4 + seed, x * 3 + z * 3)).lerp(tone2.set('#6f8a48'), sstep(1, .1, y - y0) * .5);
    solid(standBuf, new THREE.CylinderGeometry(r * .5, r * 1.1, H, 7, 3, false).translate(tree.x, y0 + H / 2 - .15, tree.z), paint);
    for (let k = 0, n = 2 + Math.floor(R() * 2); k < n; k++) { const a = R() * TAU, y = y0 + H * (.45 + R() * .45), len = .7 + R() * 1.1; solid(standBuf, new THREE.CylinderGeometry(.03, r * .28, len, 5, 1, false).rotateZ(-1.05).rotateY(-a).translate(tree.x + Math.cos(a) * len * .43, y + len * .25, tree.z + Math.sin(a) * len * .43), paint); }
  }

  /* ---------- water of this tile: stream ribbons and still surfaces ---------- */
  function waterGeometry() {
    const pos = [], uv = [], wa = [], idx = [];
    for (const s of T.streams) {
      let prev = -2, base = 0; const toFalls = s.id === 'spring';
      for (let k = 0; k < s.N; k++) {
        const p = s.samples[k]; if (!inTile(p.x, p.z)) continue;
        if (prev !== k - 1) { base = pos.length / 3; section(s, k, toFalls); }
        section(s, k + 1, toFalls); const a = base; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); base += 2; prev = k;
      }
    }
    function section(s, k, toFalls) {
      const p = s.samples[k], q = s.samples[Math.min(s.N, k + 1)], o = s.samples[Math.max(0, k - 1)], dx = q.x - o.x, dz = q.z - o.z, l = Math.hypot(dx, dz) || 1, hw = s.width(k) / 2 + .16, y = s.level[k];
      const fade = Math.min(1, k / 9, toFalls ? 1 : (s.N - k) / 14);
      for (const side of [-1, 1]) { pos.push(p.x - dz / l * hw * side, y, p.z + dx / l * hw * side); uv.push(side < 0 ? 0 : 1, k * .2); wa.push(1, 0, fade); }
    }
    // still water: 1 m cells wherever the ground lies below a pool's level
    const n = TILE * 2, depth = new Float32Array((n + 1) * (n + 1)), level = new Float32Array((n + 1) * (n + 1)); let any = false;
    if (mix.swamp || T.pools.some(p => Math.abs(p.x - x0 - 8) < p.rx + 12 && Math.abs(p.z - z0 - 8) < p.rx + 12)) {
      for (let r = 0; r <= n; r++) for (let k = 0; k <= n; k++) { const s0 = T.site(x0 + k * .5, z0 + r * .5), v = r * (n + 1) + k; level[v] = s0.still; depth[v] = s0.still === s0.still ? s0.still - s0.h : -9; if (depth[v] > -.03) any = true; }
      if (any) for (let r = 0; r < n; r++) for (let k = 0; k < n; k++) {
        const a = r * (n + 1) + k, c4 = [a, a + 1, a + n + 1, a + n + 2]; if (Math.max(depth[c4[0]], depth[c4[1]], depth[c4[2]], depth[c4[3]]) < -.03) continue;
        let lv = NaN; for (const v of c4) if (level[v] === level[v]) lv = level[v]; const b = pos.length / 3;
        for (let q = 0; q < 4; q++) { const v = c4[q]; pos.push(x0 + (k + (q & 1)) * .5, lv, z0 + (r + (q >> 1)) * .5); uv.push(0, 0); wa.push(0, clamp(depth[v] < -8 ? -.1 : depth[v] / .8, -.1, 1), 1); }
        idx.push(b, b + 2, b + 1, b + 1, b + 2, b + 3);
      }
    }
    if (!idx.length) return null;
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setAttribute('wa', new THREE.Float32BufferAttribute(wa, 3)); g.setIndex(idx); g.computeBoundingSphere(); return g;
  }

  /* ---------- the far ring: one mesh ---------- */
  function* farTile() {
    const far = new Buffer(), N = FAR_GRID + 1, W = N + 2, step = TILE / FAR_GRID, H = new Float32Array(W * W), dim = .9;
    for (let r = -1; r <= N; r++) for (let k = -1; k <= N; k++) H[(r + 1) * W + k + 1] = T.ground(x0 + k * step, z0 + r * step);
    yield 'far ground';
    const base = far.n; far.grow(base + N * N + 4 * N, far.ni + FAR_GRID * FAR_GRID * 6 + 4 * FAR_GRID * 6);
    for (let r = 0; r < N; r++) for (let k = 0; k < N; k++) {
      const x = x0 + k * step, z = z0 + r * step, hx = H[(r + 1) * W + k + 2] - H[(r + 1) * W + k], hz = H[(r + 2) * W + k + 1] - H[r * W + k + 1], l = Math.hypot(hx, 2 * step, hz), v = base + r * N + k, up = 2 * step / l;
      T.colour(x, z, tone); T.cliff(x, z, up, tone);
      far.pos[v * 3] = x; far.pos[v * 3 + 1] = H[(r + 1) * W + k + 1]; far.pos[v * 3 + 2] = z; far.nor[v * 3] = -hx / l; far.nor[v * 3 + 1] = up; far.nor[v * 3 + 2] = -hz / l; far.uv[v * 2] = WHITE_UV[0]; far.uv[v * 2 + 1] = WHITE_UV[1]; far.col[v * 3] = tone.r * dim; far.col[v * 3 + 1] = tone.g * dim; far.col[v * 3 + 2] = tone.b * dim;
    }
    for (let r = 0; r < FAR_GRID; r++) for (let k = 0; k < FAR_GRID; k++) { const a = base + r * N + k, b = a + 1, d = a + N, e = d + 1; far.idx[far.ni++] = a; far.idx[far.ni++] = d; far.idx[far.ni++] = b; far.idx[far.ni++] = b; far.idx[far.ni++] = d; far.idx[far.ni++] = e; }
    far.n += N * N;
    // a skirt hides the cracks where coarse and fine tiles meet
    for (const [r0, k0, dr, dk] of [[0, 0, 0, 1], [FAR_GRID, 0, 0, 1], [0, 0, 1, 0], [0, FAR_GRID, 1, 0]]) for (let q = 0; q < FAR_GRID; q++) {
      const a = base + (r0 + dr * q) * N + k0 + dk * q, b = base + (r0 + dr * (q + 1)) * N + k0 + dk * (q + 1), P = [];
      for (const v of [a, b]) P.push(far.pos[v * 3], far.pos[v * 3 + 1], far.pos[v * 3 + 2]); P.push(P[3], P[4] - 2.5, P[5], P[0], P[1] - 2.5, P[2]);
      quad(far, P, ATLAS.white, far.col[a * 3], far.col[a * 3 + 1], far.col[a * 3 + 2]); for (let v = far.n - 4; v < far.n; v++) { far.uv[v * 2] = WHITE_UV[0]; far.uv[v * 2 + 1] = WHITE_UV[1]; }
    }
    yield 'far trees';
    for (const tree of trees) {
      const R = rng(tileSeed(SEED, Math.round(tree.x * 10), Math.round(tree.z * 10))), y0 = T.ground(tree.x, tree.z), ry = R() * TAU;
      if (tree.kind === 'spruce') { const H = (8.5 + R() * 4.5) * tree.s + .5; far.add(bt.card, {x: tree.x, y: y0 - .2, z: tree.z, ry, sx: H * .55, sy: H, sz: H * .55, cell: ATLAS.spruceFar, up: true, c: tone.setRGB(.9, .95, .9)}); }
      else if (tree.kind === 'birch') { const H = (7 + R() * 2.5) * tree.s * 1.25; far.add(bt.card, {x: tree.x, y: y0 - .2, z: tree.z, ry, sx: H * .62, sy: H, sz: H * .62, cell: ATLAS.birchFar, up: true}); }
      else if (tree.kind === 'snag') { const H = 3.5 + R() * 3.5; far.add(bt.card, {x: tree.x, y: y0 - .2, z: tree.z, ry, sx: H * .7, sy: H, sz: H * .7, cell: ATLAS.snagFar, up: true}); }
      else {
        const small = tree.kind === 'alder' || tree.kind === 'willow', hh = (.85 + R() * .3) * (small ? .62 : 1) * 7.4, s = (3.0 + tree.r * 2.6) * 2.3 * (small ? .62 : 1);
        solid(far, new THREE.CylinderGeometry(tree.r * .7, tree.r * 1.2, hh, 6, 1, true).translate(tree.x, y0 + hh / 2 - .1, tree.z), (x, y, z, out) => out.setRGB(.42, .27, .17));
        far.add(t.crown, {x: tree.x, y: y0 + hh - s * .2, z: tree.z, ry, sx: s, sy: s, sz: s, cell: R() < .5 ? ATLAS.crownA : ATLAS.crownB, up: true, c: tone.setRGB(.95, .95, .95)});
      }
    }
    yield 'far water';
    for (const s of T.streams) for (let k = 0; k + 6 <= s.N; k += 6) { // streams as flat ribbons
      const p = s.samples[k]; if (!inTile(p.x, p.z)) continue; const P = [];
      for (const [kk, side] of [[k, -1], [k, 1], [k + 6, 1], [k + 6, -1]]) { const a = s.samples[kk], q = s.samples[Math.min(s.N, kk + 1)], o = s.samples[Math.max(0, kk - 1)], dx = q.x - o.x, dz = q.z - o.z, l = Math.hypot(dx, dz) || 1, hw = s.width(kk) / 2 + .1; P.push(a.x - dz / l * hw * side, s.level[kk] + .02, a.z + dx / l * hw * side); }
      quad(far, P, ATLAS.white, .36, .62, .64); for (let v = far.n - 4; v < far.n; v++) { far.uv[v * 2] = WHITE_UV[0]; far.uv[v * 2 + 1] = WHITE_UV[1]; }
    }
    if (mix.swamp || T.pools.some(p => Math.abs(p.x - x0 - 8) < p.rx + 12 && Math.abs(p.z - z0 - 8) < p.rx + 12)) for (let r = 0; r < TILE; r += 2) for (let k = 0; k < TILE; k += 2) { // still water as 2 m squares
      const x = x0 + k + 1, z = z0 + r + 1, s0 = T.site(x, z); if (!(s0.still - s0.h > .02)) continue; const y = s0.still + .02;
      quad(far, [x - 1, y, z - 1, x + 1, y, z - 1, x + 1, y, z + 1, x - 1, y, z + 1], ATLAS.white, .3, .56, .6); for (let v = far.n - 4; v < far.n; v++) { far.uv[v * 2] = WHITE_UV[0]; far.uv[v * 2 + 1] = WHITE_UV[1]; }
    }
    yield 'far mesh';
    meshOf(far, M.plants, {name: 'far', receive: false});
  }
}
let cardGeo = null;
const leafCardGeometry = () => { if (!cardGeo) { cardGeo = new THREE.PlaneGeometry(1, 1); const n = cardGeo.attributes.normal; for (let i = 0; i < n.count; i++) n.setXYZ(i, 0, 1, 0); } return cardGeo; };
