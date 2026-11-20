/* Dachs' sett (built with the `sett` site, in small steps). The bank of earth is part of the ground (`sett` in
   terrain.js), so moss, grass and flowers grow on it as everywhere in the wood, and its face and the ground in front of
   it are bare, dug earth. Here comes what makes it a home:
   - two ways in, a wide one in the face and a smaller one at the side: each a short D-shaped tunnel that slopes down
     into the dark, under a thick lip of dug earth. The tunnel is drawn before everything else and its mouth is then
     closed for the depth test only, so the ground of the bank does not cover it: one really looks into the hole;
   - a root of the old oak arching over the main way in, with fine rootlets hanging into it, and the oak's roots that
     climb out of the bank behind and grip it on both sides;
   - his bedding: a heap of dry grass airing beside the main way in, loose stalks dragged towards the hole, and the
     soil he has thrown out heaped at the side of the dug earth, with clods and stones;
   - ferns either side of the main way in, bluebells, wood anemones and grass on the bank, moss cushions, a few
     mushrooms at its foot, a fallen branch and oak leaves on the dug earth.
   `f` runs forward out of the bank (where the entrances face), `s` across it. */
import {THREE} from '../../../scene/materials.js';
import {TAU, lerp, fbm} from '../noise.js';
import {Buffer, templates} from '../tiles.js';
import {ATLAS} from './atlas.js';

const SOIL = '#a5703f', SOIL_DARK = '#5c3b22', STRAW = ['#e3c477', '#d2ad5c', '#c99c4c', '#ecd590'];

export function settSteps(site, look, world, group, R) {
  const T = world.terrain, L = world.layout, M = look.M, steps = [], tpl = templates();
  const [cx, cz, yaw] = L.SETT, FX = Math.sin(yaw), FZ = Math.cos(yaw), SX = FZ, SZ = -FX;
  const at = (f, s) => [cx + FX * f + SX * s, cz + FZ * f + SZ * s], gy = (x, z) => T.ground(x, z), probe = {};
  const Q = new THREE.Quaternion(), UP = new THREE.Vector3(0, 1, 0), V = new THREE.Vector3(), C = new THREE.Color(), C2 = new THREE.Color();
  const paint = (g, c) => { const k = new Float32Array(g.attributes.position.count * 3); for (let i = 0; i < k.length; i += 3) { k[i] = c.r; k[i + 1] = c.g; k[i + 2] = c.b; } g.setAttribute('color', new THREE.BufferAttribute(k, 3)); return g; };
  const add = (buf, g, c) => { buf.addGeometry(paint(g, c)); g.dispose(); };
  const mesh = (buf, material, name, cast = true) => { const g = buf.geometry(); if (!g) return null; const m = new THREE.Mesh(g, material); m.name = name; m.castShadow = cast && M.shadows; m.receiveShadow = M.shadows; group.add(m); return m; };
  const earth = new Buffer(), stones = new Buffer(), roots = new Buffer(), straw = new Buffer(), flora = new Buffer();
  const [tx, tz, ts] = L.TREES.find(t => t[3]?.kind === 'oak' && Math.hypot(t[0] - cx, t[1] - cz) < 5), tr = .55 + .25 * (ts - 1);   // the old oak above the sett
  // uv for the grain texture on upright earth (as the ground's: half a texture per metre)
  const grainUv = g => { const p = g.attributes.position, uv = new Float32Array(p.count * 2); for (let i = 0; i < p.count; i++) { uv[i * 2] = (p.getX(i) + p.getZ(i)) * .5; uv[i * 2 + 1] = p.getY(i) * .5; } g.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); return g; };
  /** A tube along points, tapering from r0 to r1, half sunk into what it lies on. */
  const tube = (buf, pts, r0, r1, colour, sides = 6) => {
    const curve = new THREE.CatmullRomCurve3(pts), seg = Math.max(4, pts.length * 3), g = new THREE.TubeGeometry(curve, seg, 1, sides, false), p = g.attributes.position;
    for (let i = 0; i <= seg; i++) { const o = curve.getPointAt(i / seg), r = lerp(r0, r1, i / seg); for (let j = 0; j <= sides; j++) { const n = i * (sides + 1) + j; p.setXYZ(n, o.x + (p.getX(n) - o.x) * r, o.y + (p.getY(n) - o.y) * r, o.z + (p.getZ(n) - o.z) * r); } }
    g.computeVertexNormals(); add(buf, g, colour);
  };
  const facing = (f, s) => Math.atan2(FX * f + SX * s, FZ * f + SZ * s);
  /** A low, lumpy heap (thrown-out soil, a pile of hay): the top of a noisy ball, sunk a little into the ground. */
  const heap = (buf, x, z, rx, ry, rz, turn, colour, seed) => { const g = new THREE.IcosahedronGeometry(1, 3), p = g.attributes.position, y0 = gy(x, z);
    for (let i = 0; i < p.count; i++) { let u = p.getX(i), v = p.getY(i), w = p.getZ(i); const k = 1 + (fbm(u * 1.7 + seed, w * 1.7 + v + seed) - .5) * .5; v = Math.max(v, -.15); u *= k; w *= k; v *= k;
      const lx = u * rx, lz = w * rz, px = x + lx * Math.cos(turn) + lz * Math.sin(turn), pz = z - lx * Math.sin(turn) + lz * Math.cos(turn); p.setXYZ(i, px, Math.max(gy(px, pz) - .04, y0 + v * ry - .05), pz); }
    g.computeVertexNormals(); add(buf, grainUv(g), colour); };

  /* ---------- the ways in ---------- */
  // the outline of a badger's hole, seen from the front: flat floor, upright sides, a round top (counter-clockwise)
  const outline = (w, h, n = 22) => { const pts = [], side = h * .32; pts.push([-w * .5, 0], [-w * .17, -.01], [w * .17, -.01], [w * .5, 0], [w * .5, side]);
    for (let k = 1; k < n; k++) { const a = k / n * Math.PI; pts.push([Math.cos(a) * w * .5, side + Math.sin(a) * (h - side)]); }
    pts.push([-w * .5, side]); return pts; };
  const interiors = [], masks = [];
  function entrance(f, s, w, h, depth, lip) {
    const turn = facing(...(s ? [f, s] : [1, 0])), [ox, oz] = at(f, s), oy = gy(ox, oz) - .03, ofx = Math.sin(turn), ofz = Math.cos(turn), rx = ofz, rz = -ofx, ring = outline(w, h), N = ring.length;
    const P = (px, py, u, drop = 0, bend = 0) => [ox + rx * (px + bend) - ofx * u, oy + py - drop, oz + rz * (px + bend) - ofz * u];
    // the tunnel: rings going in and down, narrowing and bending a little, from dark earth to black
    { const DEPTH = 6, pos = [], col = [], idx = [], mouth = new THREE.Color('#3a2616'), dark = new THREE.Color('#0b0705');
      for (let k = 0; k <= DEPTH; k++) { const q = k / DEPTH, u = q * depth, sc = 1 - .28 * q, drop = .22 * q * q * depth, bend = .12 * q * q * (s ? -1 : 1);
        C.copy(mouth).lerp(dark, Math.pow(q, .55)); for (const [px, py] of ring) { pos.push(...P(px * sc, py * sc, u - .02, drop, bend)); col.push(C.r, C.g, C.b); } }
      for (let k = 0; k < DEPTH; k++) for (let i = 0; i < N; i++) { const a = k * N + i, b = k * N + (i + 1) % N, c = a + N, d = b + N; idx.push(a, c, b, b, c, d); }
      const end = pos.length / 3; pos.push(...P(0, h * .38 * .72, depth, .22 * depth, .12 * (s ? -1 : 1))); col.push(dark.r, dark.g, dark.b);
      for (let i = 0; i < N; i++) idx.push(DEPTH * N + i, end, DEPTH * N + (i + 1) % N);
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.setIndex(idx); g.computeBoundingSphere();
      interiors.push(g); }
    // the mouth, closed for the depth test only: the bank's ground behind it is not drawn there
    { const pos = [...P(0, h * .45, .03)], idx = []; for (const [px, py] of ring) pos.push(...P(px * .985, py * .985 + .005, .03)); for (let i = 0; i < N; i++) idx.push(0, 1 + i, 1 + (i + 1) % N);
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeBoundingSphere(); masks.push(g); }
    // the lip: a thick, lumpy arch of dug earth round the top and sides, running back into the bank
    { const pos = [], col = [], idx = [], arch = [ring[3], ...ring.slice(4), ring[0]], A = arch.length, cxy = [0, h * .4], RINGS = 4, soil = new THREE.Color(SOIL), deep = new THREE.Color(SOIL_DARK), moss = new THREE.Color('#5d7f34');
      for (let k = 0; k <= RINGS; k++) { const q = k / RINGS, u = lerp(-lip * .55, .75, q);   // from in front of the mouth into the bank
        for (let i = 0; i < A; i++) { const [px, py] = arch[i], d = Math.hypot(px - cxy[0], py - cxy[1]) || 1, top = py / h, lump = fbm(i * .9 + k * 1.7 + f * 3, s + k) - .5;
          const thick = k === 0 ? 0 : lip * (.55 + .7 * top) * (1 + lump * .6) * (k === 1 ? .8 : 1), sink = k > 1 ? (q - .25) * .35 * h : 0;
          pos.push(...P(px + (px - cxy[0]) / d * thick, py + (py - cxy[1]) / d * thick - sink, u, k === 0 ? 0 : .02));
          C.copy(soil).lerp(deep, k === 0 ? .75 : k === 1 ? .25 : 0).lerp(moss, k >= 3 ? top * .55 : 0).multiplyScalar(.9 + lump * .3); col.push(C.r, C.g, C.b); } }
      for (let k = 0; k < RINGS; k++) for (let i = 0; i < A - 1; i++) { const a = k * A + i, b = a + 1, c = a + A, d = b + A; idx.push(a, c, b, b, c, d); }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.setIndex(idx); g.computeVertexNormals(); earth.addGeometry(grainUv(g)); g.dispose(); }
    // the threshold: worn soil, a few clods and stones at its sides
    for (const side of [-1, 1]) { const [x, z] = [ox + rx * side * (w * .5 + lip * .9) + ofx * .12, oz + rz * side * (w * .5 + lip * .9) + ofz * .12], sc = .1 + R() * .07, v = .78 + R() * .2;
      stones.add(tpl.pebble, {x, y: gy(x, z) - sc * .25, z, ry: R() * TAU, sx: sc * 1.3, sy: sc, sz: sc, c: C.setRGB(v, v * .97, v * .9)}); }
    for (let k = 0; k < 4; k++) { const a = (R() - .5) * 2.4, d = w * (.55 + R() * .6), x = ox + ofx * d * Math.cos(a) * .7 + rx * d * Math.sin(a), z = oz + ofz * d * Math.cos(a) * .7 + rz * d * Math.sin(a), r = .05 + R() * .06;
      add(earth, grainUv(new THREE.SphereGeometry(1, 7, 5).scale(r * 1.4, r * .7, r).rotateY(R() * 3).translate(x, gy(x, z) + r * .25, z)), C.set(SOIL).multiplyScalar(.85 + R() * .3)); }
    return {ox, oz, oy, ofx, ofz, rx, rz, w, h, lip};
  }
  let main = null;
  steps.push(() => {
    main = entrance(2.6, 0, .8, .66, 1.6, .22);
    entrance(1.55, -1.95, .52, .44, 1.1, .16);
    // inside first, then the closed mouths: everything else is drawn after them
    const inside = new THREE.MeshBasicMaterial({vertexColors: true, side: THREE.DoubleSide}), seal = new THREE.MeshBasicMaterial({colorWrite: false, side: THREE.DoubleSide});
    interiors.forEach((g, k) => { const m = new THREE.Mesh(g, inside); m.name = 'sett tunnel ' + k; m.renderOrder = -2; group.add(m); });
    masks.forEach((g, k) => { const m = new THREE.Mesh(g, seal); m.name = 'sett mouth ' + k; m.renderOrder = -1; group.add(m); });
  });

  /* ---------- roots of the old oak ---------- */
  steps.push(() => {
    const bark = new THREE.Color('#ffe3cc').lerp(new THREE.Color('#8fb35a'), .2), toward = Math.atan2(cz - tz, cx - tx);
    // they climb out of the bank behind and grip it on both sides, sinking in where they end
    for (const [da, len, r0, wave] of [[-.95, 2.6, .22, .22], [-.2, 2.2, .26, -.18], [.75, 2.8, .2, .25]]) {
      const a = toward + da, pts = [];
      for (let k = 0; k <= 12; k++) { const q = k / 12, d = tr * .75 + q * len, side = Math.sin(q * Math.PI * 1.3) * wave, x = tx + Math.cos(a) * d - Math.sin(a) * side, z = tz + Math.sin(a) * d + Math.cos(a) * side, r = lerp(r0, .03, q);
        pts.push(new THREE.Vector3(x, gy(x, z) + r * .35 + .32 * (1 - Math.min(1, q * 4)) ** 2 - .06 * q, z)); }
      tube(roots, pts, r0, .03, bark, 7); }
    // the root over the main way in: out of the bank on one side, over the lip, back into it on the other
    const {ox, oz, oy, ofx, ofz, rx, rz, w, h, lip} = main, over = [];
    for (let k = 0; k <= 8; k++) { const q = k / 8, across = lerp(-1, 1, q) * (w * .5 + lip + .45), back = .2 + .55 * (1 - Math.sin(q * Math.PI)), x = ox + rx * across - ofx * back, z = oz + rz * across - ofz * back;
      over.push(new THREE.Vector3(x, Math.max(gy(x, z) - .02, oy + (h + lip * 1.05) * Math.pow(Math.sin(q * Math.PI), .7) + .03), z)); }
    tube(roots, over, .12, .08, bark, 7);
    // fine rootlets hanging down into the mouth
    for (const [across, len] of [[-.16, .2], [.05, .28], [.2, .16]]) { const x = ox + rx * across - ofx * .05, z = oz + rz * across - ofz * .05, y = oy + h + .02;
      tube(roots, [new THREE.Vector3(x, y, z), new THREE.Vector3(x + rx * .02 + ofx * .03, y - len * .5, z + rz * .02 + ofz * .03), new THREE.Vector3(x - rx * .02 + ofx * .02, y - len, z - rz * .02 + ofz * .02)], .014, .004, bark, 4); }
  });

  /* ---------- bedding, spoil and what lies about ---------- */
  steps.push(() => {
    // the heap of dry grass he airs in the sun: a soft heap under a tangle of stalks
    const [hx, hz] = at(...L.SETT_HEAPS.hay), hy = gy(hx, hz);
    heap(straw, hx, hz, .62, .38, .52, yaw + .4, C.set('#e6c067'), 5);
    for (let k = 0; k < 150; k++) { const a = R() * TAU, d = Math.sqrt(R()), u = Math.cos(a) * d, v = Math.sin(a) * d, y = .36 * Math.sqrt(Math.max(0, 1 - d * d)) - .03, x = hx + u * .6 * Math.cos(yaw + .4) + v * .5 * Math.sin(yaw + .4), z = hz - u * .6 * Math.sin(yaw + .4) + v * .5 * Math.cos(yaw + .4);
      const dir = R() * TAU, l = .22 + R() * .32, lift = R() < .2 ? 1 + R() : (R() - .3) * .6, c = C.set(STRAW[(R() * STRAW.length) | 0]).multiplyScalar(1 + R() * .3);
      tube(straw, [new THREE.Vector3(x - Math.cos(dir) * l * .5, hy + y - lift * l * .5, z - Math.sin(dir) * l * .5), new THREE.Vector3(x, hy + y + .015, z), new THREE.Vector3(x + Math.cos(dir) * l * .5, hy + y + lift * l * .5, z + Math.sin(dir) * l * .5)], .011, .007, c, 3); }
    // loose stalks dragged towards the main way in
    for (let k = 0; k < 16; k++) { const q = R(), [x, z] = at(lerp(2.5, 2.95, q) + (R() - .5) * .5, lerp(1.85, .45, q) + (R() - .5) * .35), dir = R() * TAU, l = .18 + R() * .25, y = gy(x, z) + .012;
      tube(straw, [new THREE.Vector3(x - Math.cos(dir) * l * .5, y, z - Math.sin(dir) * l * .5), new THREE.Vector3(x + Math.cos(dir) * l * .5, y + .01, z + Math.sin(dir) * l * .5)], .009, .006, C.set(STRAW[k % 4]), 3); }
    // the soil he has thrown out, heaped at the side of the dug earth, with clods
    { const [sx, sz] = at(...L.SETT_HEAPS.spoil); heap(earth, sx, sz, .72, .46, .58, yaw - .5, C.set('#b98650'), 11); heap(earth, sx + FX * .55 - SX * .4, sz + FZ * .55 - SZ * .4, .42, .26, .36, yaw + .4, C.set('#a8753f'), 17);
      for (let k = 0; k < 7; k++) { const a = R() * TAU, d = .4 + R() * .9, x = sx + Math.cos(a) * d, z = sz + Math.sin(a) * d * .8, r = .06 + R() * .07;
        add(earth, grainUv(new THREE.SphereGeometry(1, 7, 5).scale(r * 1.3, r * .75, r).rotateY(R() * 3).translate(x, gy(x, z) + r * .3, z)), C.set(SOIL).multiplyScalar(.8 + R() * .35)); } }
    // stones in the dug earth and one big one beside it
    for (const [f, s, sc] of [[3.15, .7, .16], [2.25, 1.05, .12], [3.7, -.35, .13], [2.9, -2.75, .38], [1.1, 2.75, .3]]) { const [x, z] = at(f, s), v = .8 + R() * .15;
      stones.add(sc > .25 ? tpl.stone : tpl.pebble, {x, y: gy(x, z) - sc * .3, z, ry: R() * TAU, sx: sc * 1.2, sy: sc * .8, sz: sc, c: C.setRGB(v, v * .97, v * .92)}); }
    // a fallen oak branch with a side twig
    { const [bx, bz] = at(3.9, 2.3), a = yaw + 1.9, l = 1.6, pts = [0, .5, 1].map(q => { const x = bx + Math.sin(a) * l * (q - .5), z = bz + Math.cos(a) * l * (q - .5); return new THREE.Vector3(x, gy(x, z) + .05, z); });
      tube(roots, pts, .05, .03, C.set('#c8b4a0'), 6); const m = pts[1]; tube(roots, [m, new THREE.Vector3(m.x + Math.sin(a + .8) * .45, m.y + .06, m.z + Math.cos(a + .8) * .45)], .025, .012, C.set('#c8b4a0'), 5); }
    // mushrooms at the bank's foot, among the roots
    for (const [f, s, n, red] of [[-.6, -3.2, 3, false], [.4, 3.05, 2, false], [-2.6, 2.3, 4, false], [1.2, -3.0, 1, true]]) for (let k = 0; k < n; k++) {
      const [x, z] = at(f + (R() - .5) * .5, s + (R() - .5) * .5), sc = (.55 + R() * .5) * (k ? .8 : 1.1), y = gy(x, z) - .01;
      stones.add(tpl.stem, {x, y, z, ry: R() * TAU, sx: sc, sy: sc, sz: sc}); stones.add(tpl.cap, {x, y, z, ry: R() * TAU, sx: sc, sy: sc, sz: sc, c: red ? C.set('#c8352a') : C.set(k % 2 ? '#b07d48' : '#8a5a2e')}); }
  });

  /* ---------- what grows on and round the bank ---------- */
  steps.push(() => {
    const fern = (x, z, sc) => flora.add(tpl.fern, {x, y: gy(x, z) - .02, z, ry: R() * TAU, sx: sc, sy: sc, sz: sc, cell: ATLAS.fern, up: true, c: C.setHSL(.25, .38, .6 + R() * .08)});
    // ferns either side of the main way in, and at the bank's shoulders
    for (const [f, s, sc] of [[2.15, -1.05, 1.0], [2.0, 1.1, .9], [1.0, -2.4, .8], [.3, 2.75, .95], [-1.6, -2.9, .85], [-2.2, 2.5, .9]]) { const [x, z] = at(f, s); fern(x, z, sc * (.9 + R() * .2)); }
    // on the bank: bluebells in clumps, wood anemones, tufts of grass, moss cushions (never on the dug earth)
    const onBank = (x, z) => { T.sett(x, z, probe); return probe.rn < .95 && probe.dug < .2; };
    for (let k = 0; k < 220; k++) { const a = R() * TAU, d = Math.sqrt(R()) * 4.2, x = cx + Math.cos(a) * d, z = cz + Math.sin(a) * d; if (!onBank(x, z) || Math.hypot(x - tx, z - tz) < tr + .35) continue;
      const y = gy(x, z), q = R(), drift = fbm(x * .8 + 3, z * .8);
      if (q < .42) { if (drift > .55) flora.add(tpl.bell, {x, y, z, ry: R() * TAU, sx: .8 + R() * .3, sy: .85 + R() * .3, sz: .8, cell: ATLAS.bell, up: true});   // bluebells in drifts, wood anemones, a few primroses and campions
        else { const [cell, sc] = drift > .42 ? [ATLAS.daisy, .62] : drift > .33 ? [ATLAS.buttercup, .55] : [ATLAS.campion, .6]; flora.add(tpl.flower, {x, y: y + .02, z, ry: R() * TAU, sx: sc + R() * .25, sy: sc + R() * .3, sz: sc, cell, up: true}); } }
      else if (q < .78) flora.add(tpl.grass, {x, y: y - .02, z, ry: R() * TAU, sx: .7 + R() * .5, sy: .6 + R() * .6, sz: .7 + R() * .5, cell: ATLAS.grass, up: true, c: C.setRGB(.78, .86, .62).multiplyScalar(.9 + R() * .2)});
      else if (q < .88) add(earth, grainUv(new THREE.SphereGeometry(1, 9, 5, 0, TAU, 0, Math.PI / 2).scale(.18 + R() * .2, .07 + R() * .05, .15 + R() * .18).rotateY(R() * 3).translate(x, y - .02, z)), C.set(R() < .5 ? '#4f7a2c' : '#6a8f36'));
      else { const sc = .5 + R() * .5; flora.add(tpl.flat, {x, y: y + .025, z, ry: R() * TAU, sx: sc, sy: 1, sz: sc, cell: ATLAS.clover, up: true}); } }
    // oak leaves fallen on the dug earth, more at its edges
    for (let k = 0; k < 22; k++) { const [x, z] = at(2.3 + R() * 2.6, (R() - .5) * 4.6); T.sett(x, z, probe); if (probe.dug < .3 || Math.hypot(x - main.ox, z - main.oz) < .6) continue; const sc = .3 + R() * .35;
      flora.add(tpl.flat, {x, y: gy(x, z) + .03, z, ry: R() * TAU, sx: sc, sy: 1, sz: sc, cell: ATLAS.litter, up: true}); }
  }, () => { mesh(earth, M.ground, 'sett earth'); mesh(stones, M.rock, 'sett stones'); mesh(roots, M.bark, 'sett roots'); mesh(straw, M.ground, 'sett bedding'); mesh(flora, M.plants, 'sett plants', false); });
  return steps;
}
