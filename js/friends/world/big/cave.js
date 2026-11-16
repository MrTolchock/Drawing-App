/* The cave in the Rock (layout CAVE, terrain `cave`): a passage that winds into the hill and opens into a hall with
   an underground lake. The terrain is cut flat along the cave's way; here the rock is built round that cut:
   - inside, one mesh of floor, walls and vaulted ceiling (traced from the cut's outline, so passage and hall are one
     shape), stalactites, stalagmites, columns and rubble. It is not lit by the sun: its light is worked out once per
     vertex (daylight that reaches in from the mouth, the glow of crystals, mushrooms and the lake) and drawn by a
     small shader with a rock texture, so the dark stays dark and the glow pools on the walls;
   - outside, the hillside over it (the roof) and the face of rock above the mouth;
   - between the two, black: seen from within, the rock itself is night.
   The walls face inwards only, so the camera can stand inside the rock and look into the cave like into a
   diorama (forest3d.js brings it down as Fuchs walks in). */
import {THREE} from '../../../scene/materials.js';
import {TAU, clamp, lerp, sstep, fbm, rng} from '../noise.js';
import {Buffer, templates} from '../tiles.js';
import {stony} from './tiles.js';
import {canvasTex} from '../textures.js';
import {ATLAS} from './atlas.js';

/** What the cave's shaders share with the forest: the time, and the daylight at the mouth (forest3d.js sets both). */
export const caveLight = {time: {value: 0}, day: {value: new THREE.Color(1, .93, .8)}, inside: {value: 0}};   // inside: 0 while Fuchs is out in the open, 1 in the cave
const HUES = [[.35, 1.25, 1.55], [.95, .55, 1.6], [.45, 1.5, 1.15]], GLOW = [[.3, .9, 1.1], [.75, .45, 1.15], [.35, 1.05, .8]];
const DARK = 'vec3(.012,.012,.017)';

function caveMaterial(look) {
  return new THREE.ShaderMaterial({
    uniforms: {uRock: {value: look.T.rock}, uTime: caveLight.time, uDay: caveLight.day, uIn: caveLight.inside},
    vertexShader: `attribute vec3 color;attribute vec4 gl;varying vec3 vC,vW,vN;varying vec4 vG;varying float vD;
      void main(){vC=color;vG=gl;vN=normal;vW=position;vec4 mv=modelViewMatrix*vec4(position,1.);vD=-mv.z;gl_Position=projectionMatrix*mv;}`,
    fragmentShader: `uniform sampler2D uRock;uniform float uTime,uIn;uniform vec3 uDay;varying vec3 vC,vW,vN;varying vec4 vG;varying float vD;
      void main(){
        vec3 b=abs(normalize(vN));b*=b;b*=b;b/=b.x+b.y+b.z;
        vec3 t=texture2D(uRock,vW.zy*.27).rgb*b.x+texture2D(uRock,vW.xz*.27).grb*b.y+texture2D(uRock,vW.xy*.27).rgb*b.z;
        vec3 glow=vG.rgb*(.93+.07*sin(uTime*1.1+vW.x*.7+vW.z*.5)),light=vec3(.07,.08,.105)+glow+uDay*vG.a*mix(2.3,1.,uIn);
        vec3 c=vC*(.5+.95*t.r)*light;
        float sp=smoothstep(.93,.97,t.b)*(.5+.5*sin(uTime*2.3+t.b*90.+vW.x*5.+vW.y*4.));c+=(glow+uDay*vG.a*.25)*sp*.55;
        c=mix(c,${DARK},smoothstep(9.,34.,vD)*mix(.25,1.,uIn));
        gl_FragColor=vec4(c,1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`});
}

/** The top of the rock over the cave: the hillside, raised to a rounded outcrop over the mouth so that the way in
    can be a round arch with rock above it. */
export function caveRoofTop(world) {
  const T = world.terrain, C = world.layout.CAVE; let F = null;
  return (x, z) => { if (F === null) F = T.ground(C.x, C.z); const h = T.rawHill(x, z), d = Math.hypot(x - C.x, (C.z - z) - (C.open + 1.4)) / 5.4; if (d >= 1) return h; const dome = F + 4.05 * Math.pow(1 - d * d, 1.1); return dome > h ? h + (dome - h) * sstep(0, .6, dome - h) : h; };
}
/** The cave's ceiling as a function of the place (world x, z): walls about a man's height, then an arch up to the
    crown (much higher in the hall), rough all over, and never nearer the rock's top than half a metre. At the mouth
    the walls are low and the arch a half round, so the way in is round. */
export function caveCeiling(world) {
  const T = world.terrain, C = world.layout.CAVE, top = caveRoofTop(world), cv = {};
  return (x, z) => {
    T.cave(x, z, cv); const d = Math.max(0, .05 - cv.sd), hall = sstep(21, 29, cv.s), mouth = sstep(C.open + 3.2, C.open + .2, cv.v), wall = lerp(1.5 + .55 * fbm(x * .5 + 1, z * .5), .35, mouth), crown = lerp(lerp(3.05, 6.3, hall) + (fbm(x * .23, z * .23 + 5) - .5) * lerp(.5, 1.8, hall), 2.85, mouth);
    const t = Math.min(1, d / lerp(lerp(1.9, 4.4, hall), 2.3, mouth)), arch = Math.sqrt(1 - (1 - t) * (1 - t));
    const y = T.ground(x, z) + .03 + wall + (crown - wall) * arch + (fbm(x * .9 + 7, z * .9) - .5) * .6 * arch * (1 - mouth) + (fbm(x * 2.3, z * 2.3 + 4) - .5) * .18 * (1 - .6 * mouth);
    return Math.min(y, top(x, z) - .45);
  };
}

export function caveSteps(site, look, world, group, out) {
  const T = world.terrain, C = world.layout.CAVE, M = look.M, R = rng(881), B = T.cave.bounds, G = .5;
  const NU = Math.ceil((B.u1 - B.u0) / G), NV = Math.ceil((B.v1 - C.open) / G), W = NU + 1;
  const X = u => C.x + u, Z = v => C.z - v, at = (u, v) => [C.x + u, C.z - v];
  const floorAt = (x, z) => T.ground(x, z) + .03, F0 = T.ground(C.x, C.z), SMOUTH = T.cave(X(0), Z(C.open)).s;
  const ceilAt = caveCeiling(world), topAt = caveRoofTop(world), cv = {};
  /* ---------- the lights that are baked into the rock ---------- */
  const lights = [];
  for (const [u, v, r, hue] of C.crystals) { const [x, z] = at(u, v); lights.push({x, y: floorAt(x, z) + .5, z, c: GLOW[hue], R: 1.9 + r * 2.8, I: 1.55}); }
  for (const [u, v] of C.mushrooms) { const [x, z] = at(u, v); lights.push({x, y: floorAt(x, z) + .2, z, c: [.5, .95, .6], R: .9, I: .55}); }
  { const [x, z] = at(C.pool[0], C.pool[1]); lights.push({x, y: floorAt(x, z) + .5, z, c: [.16, .62, .7], R: 4, I: .7}); }
  const mouth = new THREE.Vector3(X(0), F0 + 1.6, Z(C.open - 1.5)), cs = {};
  /** Light on a point of rock: [r, g, b] of the glow, and how much daylight reaches it from the mouth. */
  function bake(px, py, pz, nx, ny, nz, o) {
    let r = 0, g = 0, b = 0;
    for (const L of lights) { const dx = L.x - px, dy = L.y - py, dz = L.z - pz, d2 = dx * dx + dy * dy + dz * dz, lim = L.R * 3.2; if (d2 > lim * lim) continue;
      const d = Math.sqrt(d2) || 1e-3, w = .4 + .6 * Math.max(0, (nx * dx + ny * dy + nz * dz) / d), q = d / L.R, k = L.I * w / (1 + 2.6 * q * q) * (1 - d / lim) ** 2; r += L.c[0] * k; g += L.c[1] * k; b += L.c[2] * k; }
    T.cave(px, pz, cs); const dx = mouth.x - px, dy = mouth.y - py, dz = mouth.z - pz, d = Math.hypot(dx, dy, dz) || 1e-3, into = Math.max(0, cs.s - SMOUTH + 1.5);
    o[0] = r; o[1] = g; o[2] = b; o[3] = Math.exp(-into / 4.6) * (.35 + .65 * Math.max(0, (nx * dx + ny * dy + nz * dz) / d)) * 1.15;
  }
  /** Give a geometry (position, normal, colour) its baked light. */
  function lit(g) { const p = g.attributes.position, n = g.attributes.normal, a = new Float32Array(p.count * 4), o = [0, 0, 0, 0];
    for (let i = 0; i < p.count; i++) { bake(p.getX(i), p.getY(i), p.getZ(i), n.getX(i), n.getY(i), n.getZ(i), o); a.set(o, i * 4); }
    g.setAttribute('gl', new THREE.BufferAttribute(a, 4)); return g; }

  /* ---------- the cut's outline, traced on a half-metre grid (marching squares) ---------- */
  // `inside` is positive within the walls; `over` reaches 2.7 m further out (the roof that lies over the whole cut).
  const inside = new Float32Array(W * (NV + 1));
  const trace = (field, node, cross, poly, edge) => {
    const key = (a, b) => a < b ? a * 65536 + b : b * 65536 + a, cuts = new Map(), nodes = new Map();
    const nodeOf = n => { let v = nodes.get(n); if (v === undefined) { v = node(n % W, (n / W) | 0); nodes.set(n, v); } return v; };
    const cutOf = (a, b) => { const k = key(a, b); let v = cuts.get(k); if (v === undefined) { const t = field[a] / (field[a] - field[b]); v = cross(lerp(a % W, b % W, t), lerp((a / W) | 0, (b / W) | 0, t), k); cuts.set(k, v); } return v; };
    for (let j = 0; j < NV; j++) for (let i = 0; i < NU; i++) {
      const c = [j * W + i, j * W + i + 1, (j + 1) * W + i + 1, (j + 1) * W + i], P = [], cut = [];
      for (let k = 0; k < 4; k++) { const a = c[k], b = c[(k + 1) % 4]; if (field[a] > 0) { P.push(nodeOf(a)); cut.push(false); } if ((field[a] > 0) !== (field[b] > 0)) { P.push(cutOf(a, b)); cut.push(true); } }
      if (P.length < 3) continue; poly(P);
      for (let k = 0; k < P.length; k++) { const n = (k + 1) % P.length; if (cut[k] && cut[n]) edge(P[k], P[n]); }   // two cuts in a row: an edge along the outline, the inside on its left
    }
    return {nodes, cuts};
  };
  const pos = [], col = [], idx = [], tint = new THREE.Color(), cA = new THREE.Color('#8e7c69'), cB = new THREE.Color('#63564b'), ochre = new THREE.Color('#8c6c48'), algae = new THREE.Color('#5c6e44'), earth = new THREE.Color('#6d5d4a'), trod = new THREE.Color('#87765e');
  const push = (x, y, z, c) => { pos.push(x, y, z); col.push(c.r, c.g, c.b); return pos.length / 3 - 1; };
  const rockTone = (x, y, z, o) => { T.cave(x, z, cs); const day = Math.exp(-Math.max(0, cs.s - SMOUTH + 1.5) / 5);
    return o.copy(cA).lerp(cB, fbm(x * .8 + y * .6, z * .8 - y * .4)).lerp(ochre, sstep(.55, .8, fbm(x * .3 + 4, z * .3 + y * .5)) * .5).lerp(algae, day * sstep(.4, .7, fbm(x * .9, z * .9 + y)) * .6).multiplyScalar(.9 + .3 * fbm(x * 2.1, y * 2.1 + z * 2.1)); };
  const outward = (x, z, e = .12) => { const gx = T.cave(x + e, z).sd - T.cave(x - e, z).sd, gz = T.cave(x, z + e).sd - T.cave(x, z - e).sd, l = Math.hypot(gx, gz) || 1; return [gx / l, gz / l]; };
  const steps = [], wallTop = [], ceilRow0 = new Map();   // wallTop: [ceiling vertex, floor vertex] for every point of the outline
  let shell = null;

  steps.push(() => { for (let j = 0; j <= NV; j++) for (let i = 0; i <= NU; i++) inside[j * W + i] = .05 - T.cave(X(B.u0 + i * G), Z(C.open + j * G)).sd; });
  steps.push(() => { // floor and ceiling over the inside, and a wall along its outline
    const ROWS = 6, floorOf = new Map(), column = new Map(), wallQuads = [];
    const make = (gi, gj, k) => { const x = X(B.u0 + gi * G), z = Z(C.open + gj * G), fy = floorAt(x, z), cy = ceilAt(x, z);
      T.cave(x, z, cs); const f = push(x, fy, z, tint.copy(earth).lerp(trod, sstep(-.5, -1.9, cs.sd) * .7).multiplyScalar((.85 + .3 * fbm(x * 1.7, z * 1.7)) * lerp(1, .62, sstep(.55, .75, fbm(x * .35 + 9, z * .35)))));
      const c = push(x, cy, z, rockTone(x, cy, z, tint).multiplyScalar(.9)); floorOf.set(c, f); if (gj === 0) ceilRow0.set(c, B.u0 + gi * G); return c; };
    trace(inside, (i, j) => make(i, j), (gi, gj) => { const c = make(gi, gj); wallTop.push(c); return c; },
      P => { for (let k = 1; k < P.length - 1; k++) { idx.push(floorOf.get(P[0]), floorOf.get(P[k]), floorOf.get(P[k + 1])); idx.push(P[0], P[k + 1], P[k]); } },
      (a, b) => wallQuads.push([a, b]));
    // walls: a column of points under each outline point, pushed out and in by ledges and bulges
    for (const c of wallTop) { const x = pos[c * 3], z = pos[c * 3 + 2], top = pos[c * 3 + 1], f = floorOf.get(c), fy = pos[f * 3 + 1], e = .12;
      let gx = T.cave(x + e, z).sd - T.cave(x - e, z).sd, gz = T.cave(x, z + e).sd - T.cave(x, z - e).sd; const l = Math.hypot(gx, gz) || 1; gx /= l; gz /= l;   // outwards
      const ring = [f];
      for (let r = 1; r < ROWS; r++) { const t = r / ROWS, y = lerp(fy, top, t), ledge = Math.floor(y * 2.1 + fbm(x * .35, z * .35) * 3), o = Math.sin(t * Math.PI) * ((fbm(x * .9 + ledge * 7.3, z * .9 + y * 1.3) - .35) * .5 + (ledge % 2 ? .1 : -.02)) + .1 * Math.sin(t * Math.PI * .5) * (1 - t);
        ring.push(push(x + gx * o, y, z + gz * o, rockTone(x, y, z, tint).multiplyScalar(lerp(.78, 1, sstep(0, .5, y - fy))))); }
      ring.push(c); column.set(c, ring); }
    for (const [a, b] of wallQuads) { const A = column.get(a), Bc = column.get(b); if (!A || !Bc) continue; for (let r = 0; r < ROWS; r++) idx.push(A[r], Bc[r + 1], Bc[r], A[r], A[r + 1], Bc[r + 1]); }
    out.wallQuads = wallQuads; out.column = column;
  });
  steps.push(() => { // stalactites, stalagmites, columns and rubble, then the light on all of it
    const props = new Buffer(), t = templates(), stone = (g, a = 1) => { const p = g.attributes.position, c = new Float32Array(p.count * 3); for (let i = 0; i < p.count; i++) { rockTone(p.getX(i), p.getY(i), p.getZ(i), tint).multiplyScalar(a); c[i * 3] = tint.r; c[i * 3 + 1] = tint.g; c[i * 3 + 2] = tint.b; } g.setAttribute('color', new THREE.BufferAttribute(c, 3)); props.addGeometry(g); g.dispose(); };
    // a dripstone: thick where it grows from, drawn out to a point, with a few rings
    const drip = (l, r, down) => { const pts = [[r * 1.5, 0], [r, l * .1], [r * .78, l * .32], [r * .52, l * .6], [r * .26, l * .85], [.012, l]].map(([a, b]) => new THREE.Vector2(a * (1 + .12 * Math.sin(b * 23)), down ? -b : b)); if (down) pts.reverse(); return new THREE.LatheGeometry(pts, 7); };
    for (let k = 0, n = 0; k < 900 && n < 120; k++) { const u = lerp(B.u0, B.u1, R()), v = lerp(C.open + .6, B.v1, R()), [x, z] = at(u, v); T.cave(x, z, cs); if (cs.sd > -.25) continue;
      const cy = ceilAt(x, z), room = cy - floorAt(x, z) - 2.25, hall = sstep(21, 29, cs.s); if (room < .12) continue; const l = Math.min(room, (.18 + R() * R() * lerp(.7, 2.6, hall))), r = .035 + l * .075 + R() * .03;
      stone(drip(l, r, true).rotateY(R() * TAU).translate(x, cy + .03, z), 1.05); n++;
      if (R() < .4) stone(drip(l * .5, r * .7, true).translate(x + (R() - .5) * .3, ceilAt(x + .12, z + .1) + .03, z + (R() - .5) * .3), 1.05); }
    for (const [u, v, l] of C.mites) { const [x, z] = at(u, v), y = floorAt(x, z) - .04; stone(drip(l, .15 + l * .05, false).translate(x, y, z), 1.1); stone(drip(l * .55, .09, false).translate(x + .2, y, z + .12), 1.1); stone(drip(l * .3, .07, false).translate(x - .14, y, z + .2), 1.1); }
    for (const [u, v, r] of C.columns) { const [x, z] = at(u, v), y0 = floorAt(x, z) - .05, y1 = ceilAt(x, z) + .05, h = y1 - y0, N = 9;
      const pts = []; for (let k = 0; k <= N; k++) { const q = k / N, waist = 1 - .5 * Math.sin(q * Math.PI) ** .7; pts.push(new THREE.Vector2(r * (waist * 1.5 + .12 * Math.sin(q * 31)) + (k === 0 || k === N ? r * .5 : 0), q * h)); }
      stone(new THREE.LatheGeometry(pts, 9).translate(x, y0, z), 1.1); }
    for (const c of wallTop) if (R() < .32) { const x = pos[c * 3], z = pos[c * 3 + 2]; T.cave(x, z, cs); const e = .12, gx = T.cave(x + e, z).sd - T.cave(x - e, z).sd, gz = T.cave(x, z + e).sd - T.cave(x, z - e).sd, l = Math.hypot(gx, gz) || 1, o = .12 + R() * .35, sx = x - gx / l * o, sz = z - gz / l * o, sc = .09 + R() * R() * .3;
      props.add(R() < .5 ? t.stone : t.pebble, {x: sx, y: floorAt(sx, sz) + sc * .2, z: sz, ry: R() * TAU, sx: sc, sy: sc * (.6 + R() * .5), sz: sc * (.7 + R() * .5), c: tint.setRGB(.62, .58, .54).multiplyScalar(.8 + R() * .3)}); }
    { const [x, z] = at(C.pool[0], C.pool[1]), y = floorAt(x, z); for (let k = 0; k < 26; k++) { const a = k / 26 * TAU + R() * .15, d = C.pool[2] * (.98 + R() * .1), sc = .16 + R() * .16; props.add(t.stone, {x: x + Math.cos(a) * d, y: y + sc * .12, z: z + Math.sin(a) * d * .8, ry: R() * TAU, sx: sc, sy: sc * .55, sz: sc * (.7 + R() * .4), c: tint.setRGB(.6, .57, .54).multiplyScalar(.8 + R() * .3)}); } }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.setIndex(idx); g.computeVertexNormals();
    const pg = props.geometry(), np = g.attributes.position.count, P = new Float32Array((np + pg.attributes.position.count) * 3), N = new Float32Array(P.length), K = new Float32Array(P.length), I = new Uint32Array(idx.length + pg.index.count);
    P.set(g.attributes.position.array); P.set(pg.attributes.position.array, np * 3); N.set(g.attributes.normal.array); N.set(pg.attributes.normal.array, np * 3); K.set(g.attributes.color.array); K.set(pg.attributes.color.array, np * 3);
    I.set(idx); for (let k = 0; k < pg.index.count; k++) I[idx.length + k] = pg.index.array[k] + np;
    shell = new THREE.BufferGeometry(); shell.setAttribute('position', new THREE.BufferAttribute(P, 3)); shell.setAttribute('normal', new THREE.BufferAttribute(N, 3)); shell.setAttribute('color', new THREE.BufferAttribute(K, 3)); shell.setIndex(new THREE.BufferAttribute(I, 1));
    g.dispose(); pg.dispose();
  });
  steps.push(() => { lit(shell); shell.computeBoundingSphere(); const m = new THREE.Mesh(shell, caveMaterial(look)); m.name = 'cave'; group.add(m); out.inside = m; });

  steps.push(() => { // the hillside over the cave, the rock face above the mouth, and the night inside the rock
    const over = new Float32Array(W * (NV + 1)); for (let j = 0; j <= NV; j++) for (let i = 0; i <= NU; i++) over[j * W + i] = 2.75 - T.cave(X(B.u0 + i * G), Z(C.open + j * G)).sd;
    const tp = [], tc = [], ti = [], dark = [], di = [], up = new THREE.Vector3(), c = new THREE.Color(), row0 = [], rim = [];
    const make = (gi, gj) => { const x = X(B.u0 + gi * G), z = Z(C.open + gj * G), h = topAt(x, z), e = .4, hx = topAt(x + e, z) - topAt(x - e, z), hz = topAt(x, z + e) - topAt(x, z - e);
      up.set(-hx / (2 * e), 1, -hz / (2 * e)).normalize(); T.colour(x, z, c, true); T.cliff(x, z, up.y, c);   // painted as the hillside, not as the cave's floor under it
      tp.push(x, h + .07, z); tc.push(c.r, c.g, c.b); dark.push(x, h - .3, z); const v = tp.length / 3 - 1; if (gj === 0) row0.push([B.u0 + gi * G, v]); return v; };
    trace(over, make, (gi, gj) => { const v = make(gi, gj); rim.push(v); return v; },
      P => { for (let k = 1; k < P.length - 1; k++) { ti.push(P[0], P[k], P[k + 1]); di.push(P[0], P[k + 1], P[k]); } }, (a, b) => rim.push(-1, a, b));
    // the rock face over the mouth: from the roof's front edge down to the arch (inside) or into the ground (beside it)
    row0.sort((a, b) => a[0] - b[0]); const arch = [...ceilRow0.entries()].map(([v, u]) => [u, v]).sort((a, b) => a[0] - b[0]), z0 = Z(C.open), fp = [], fc = [], fi = [];
    const archY = u => { for (let k = 0; k < arch.length - 1; k++) if (u >= arch[k][0] - 1e-6 && u <= arch[k + 1][0] + 1e-6) { const t = (u - arch[k][0]) / (arch[k + 1][0] - arch[k][0] || 1); return lerp(pos[arch[k][1] * 3 + 1], pos[arch[k + 1][1] * 3 + 1], t); } return null; };
    const cols = [], us = [...new Set([...row0.map(r => r[0]), ...arch.map(a => a[0])])].sort((a, b) => a - b), FR = 4;
    const colAt = (u, a) => { const x = X(u), top = topAt(x, z0) + .07, low = a === null ? Math.min(T.ground(x, z0), top) - .35 : a, ring = [];
      for (let r = 0; r <= FR; r++) { const t = r / FR, y = lerp(low, top, t), bulge = Math.sin(t * Math.PI) * (fbm(x * .8, y * .9) - .3) * .5; T.colour(x, z0, c, true); T.cliff(x, z0, .3, c); fp.push(x, y, z0 + bulge + (r === FR ? 0 : .04)); fc.push(c.r, c.g, c.b); ring.push(fp.length / 3 - 1); }
      cols.push(ring); };
    for (const u of us) { const a = archY(u); if (a !== null && arch.length && u === arch[0][0]) colAt(u, null); colAt(u, a); if (a !== null && arch.length && u === arch[arch.length - 1][0]) colAt(u, null); }
    for (let k = 0; k < cols.length - 1; k++) for (let r = 0; r < 4; r++) fi.push(cols[k][r], cols[k + 1][r], cols[k + 1][r + 1], cols[k][r], cols[k + 1][r + 1], cols[k][r + 1]);
    const geo = (p, k, i) => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3)); if (k) g.setAttribute('color', new THREE.Float32BufferAttribute(k, 3)); g.setIndex(i); g.computeVertexNormals(); const uv = new Float32Array(p.length / 3 * 2); for (let n = 0; n < uv.length / 2; n++) { uv[n * 2] = p[n * 3] / 2; uv[n * 2 + 1] = p[n * 3 + 2] / 2; } g.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); return g; };
    const roof = stony(new THREE.Mesh(geo(tp, tc, ti), M.ground), 1); roof.name = 'cave roof'; roof.castShadow = M.shadows; roof.receiveShadow = M.shadows; group.add(roof); out.roof = roof;
    const face = stony(new THREE.Mesh(geo(fp, fc, fi), M.rock), 1); face.name = 'cave mouth'; face.castShadow = M.shadows; face.receiveShadow = M.shadows; group.add(face);
    // night: a lid just under the hillside, a curtain from every wall's top up to it, a skirt round the outside, a floor far below
    const lidY = (x, z) => topAt(x, z) - .3, low = F0 - 4;
    for (const [a, b] of out.wallQuads) { const n = dark.length / 3; for (const v of [a, b]) { const [ox, oz] = outward(pos[v * 3], pos[v * 3 + 2]), x = pos[v * 3] + ox * .7, z = pos[v * 3 + 2] + oz * .7; dark.push(x, pos[v * 3 + 1] - .6, z, x, lidY(x, z), z); } di.push(n, n + 3, n + 2, n, n + 1, n + 3); }
    for (let k = 0; k < rim.length; k++) if (rim[k] === -1) { const a = rim[k + 1], b = rim[k + 2], n = dark.length / 3; for (const v of [a, b]) dark.push(dark[v * 3], low, dark[v * 3 + 2]); di.push(n, b, n + 1, n, a, b); k += 2; }
    { const n = dark.length / 3, x0 = X(B.u0 - 3), x1 = X(B.u1 + 3), za = Z(C.open - 1), zb = Z(B.v1 + 3); dark.push(x0, low, za, x1, low, za, x1, low, zb, x0, low, zb); di.push(n, n + 1, n + 2, n, n + 2, n + 3); }
    const night = new THREE.Mesh(geo(dark, null, di), new THREE.MeshBasicMaterial({color: '#030304', fog: false})); night.name = 'cave night'; group.add(night);
    // the way in: a round arch of rock, thick at its feet, rough and mossy on top, standing in the hillside
    { const SEG = 26, RAD = 11, ap = [], ac = [], ai = [], moss = new THREE.Color('#7f9a4d'), A = new THREE.Color('#928d80'), Bc = new THREE.Color('#6f6b61'), zc = Z(C.open - .25), fy = T.ground(X(0), zc);
      for (let i = 0; i <= SEG; i++) { const a = lerp(-.16, Math.PI + .16, i / SEG), up = Math.max(0, Math.sin(a)), cx = Math.cos(a) * 2.95, cy = Math.sin(a) * 3.02, r = lerp(.98, .62, up) * (.88 + .3 * fbm(i * .55, 3.3));
        for (let j = 0; j < RAD; j++) { const b = j / RAD * TAU, k = 1 + (fbm(i * .7 + Math.cos(b) * 1.3, j * .9 + 5) - .5) * .5, ox = Math.cos(b) * r * k, oz = Math.sin(b) * r * k * 1.3, x = X(cx + Math.cos(a) * ox), y = fy + cy + Math.sin(a) * ox, z = zc + oz;
          ap.push(x, y, z); const n = fbm(x * 1.1 + y, z * 1.1 - y), topness = Math.sin(a) * Math.cos(b) * up + (1 - up) * .2; c.copy(A).lerp(Bc, n).lerp(moss, sstep(.5, .85, topness + (fbm(x * 2.3, z * 2.3 + y) - .5) * .5) * .75); ac.push(c.r, c.g, c.b); } }
      for (let i = 0; i < SEG; i++) for (let j = 0; j < RAD; j++) { const p0 = i * RAD + j, p1 = i * RAD + (j + 1) % RAD, q0 = p0 + RAD, q1 = p1 + RAD; ai.push(p0, q0, p1, p1, q0, q1); }
      const ag = geo(ap, ac, ai); if (ag.attributes.normal.getY(Math.floor(SEG / 2) * RAD) < 0) { ag.setIndex(ai.map((v, n) => ai[n - n % 3 + [0, 2, 1][n % 3]])); ag.computeVertexNormals(); }
      const arch = stony(new THREE.Mesh(ag, M.rock), .9); arch.name = 'cave arch'; arch.castShadow = M.shadows; arch.receiveShadow = M.shadows; group.add(arch); }
    // a few boulders frame the mouth; heather and grass grow on the roof as on the hill around it
    const rocks = new Buffer(), plants = new Buffer(), t = templates();
    for (const [u, v, sc] of [[-4.1, C.open - .7, .7], [4, C.open - .6, .8], [-3.3, C.open - 2.2, .45], [3.3, C.open - 2.4, .5], [3.9, C.open - 3.6, .36], [-3.8, C.open - 3.8, .4]]) { const [x, z] = at(u, v), w = .8 + R() * .12; rocks.add(t.rock, {x, y: T.ground(x, z) - sc * .25, z, ry: R() * TAU, sx: sc * 1.2, sy: sc, sz: sc, c: c.setRGB(w, w * .97, w * .92)}); }
    for (let k = 0; k < 520; k++) { const u = lerp(B.u0, B.u1, R()), v = lerp(C.open + .3, B.v1, R()), [x, z] = at(u, v); if (T.cave(x, z).sd > 1.85) continue; const e = .5, s = Math.hypot(T.rawHill(x + e, z) - T.rawHill(x - e, z), T.rawHill(x, z + e) - T.rawHill(x, z - e)); if (s > .75 || T.snow(x, z) > .05) continue;
      const y = topAt(x, z) + .05, q = R(), sc = .8 + R() * .6, v2 = .82 + R() * .3;
      if (q < .5) plants.add(t.grass, {x, y, z, ry: R() * TAU, sx: sc, sy: sc * .9, sz: sc, cell: ATLAS.grass, up: true, c: c.setRGB(v2, v2, v2 * .86)});
      else if (q < .85) plants.add(t.grass, {x, y: y - .03, z, ry: R() * TAU, sx: sc, sy: sc * 1.6, sz: sc, cell: ATLAS.heather, up: true});
      else { const rs = .1 + R() * .22; rocks.add(t.rock, {x, y, z, ry: R() * TAU, sx: rs, sy: rs * .8, sz: rs}); } }
    { const g = rocks.geometry(); if (g) { const m = stony(new THREE.Mesh(g, M.rock)); m.name = 'cave rocks'; m.castShadow = M.shadows; m.receiveShadow = M.shadows; group.add(m); } }
    { const g = plants.geometry(); if (g) { const m = new THREE.Mesh(g, M.plants); m.name = 'cave roof plants'; m.receiveShadow = M.shadows; group.add(m); } }
  });

  steps.push(() => { // crystals: six-sided, pointed, every face its own shade
    const tri = [], tcol = [], V = new THREE.Vector3(), A = new THREE.Vector3(), Bv = new THREE.Vector3(), Cv = new THREE.Vector3(), sun = new THREE.Vector3(.4, .7, .6).normalize();
    const crystal = (x, y, z, l, r, tiltX, tiltZ, hue) => { const g = new THREE.LatheGeometry([[r * .7, 0], [r, l * .12], [r * .86, l * .74], [0, l]].map(([a, b]) => new THREE.Vector2(a, b)), 6).rotateY(R() * TAU).rotateX(tiltX).rotateZ(tiltZ).translate(x, y, z).toNonIndexed(), p = g.attributes.position;
      for (let i = 0; i < p.count; i += 3) { A.fromBufferAttribute(p, i); Bv.fromBufferAttribute(p, i + 1); Cv.fromBufferAttribute(p, i + 2); V.copy(Bv).sub(A).cross(Cv.clone().sub(A)).normalize(); const f = .5 + .65 * Math.abs(V.dot(sun));
        for (const q of [A, Bv, Cv]) { const up = clamp((q.y - y) / l, 0, 1), k = f * (.55 + .75 * up); tri.push(q.x, q.y, q.z); tcol.push(hue[0] * k + up * .25, hue[1] * k + up * .25, hue[2] * k + up * .25); } }
      g.dispose(); };
    const hp = [], hc = [];
    for (const [u, v, r, hue] of C.crystals) { const [x, z] = at(u, v), y = floorAt(x, z) - .04, h = HUES[hue];
      crystal(x, y, z, .55 + r * 1.1, .07 + r * .12, (R() - .5) * .25, (R() - .5) * .25, h);
      for (let k = 0, n = 6 + Math.round(r * 6); k < n; k++) { const a = R() * TAU, d = (.25 + R() * .75) * r * .75, l = (.2 + R() * .5) * (1 - d / r * .4) * (.6 + r); crystal(x + Math.cos(a) * d, y, z + Math.sin(a) * d, l, .035 + l * .09, Math.sin(a) * (.25 + R() * .45), -Math.cos(a) * (.25 + R() * .45), h.map(q => q * (.8 + R() * .3))); }
      hp.push(x, y + .45, z); hc.push(...GLOW[hue]); }
    // the little ones high in the walls and on the ceiling of the hall
    for (let k = 0, n = 0; k < 400 && n < 30; k++) { const c = wallTop[Math.floor(R() * wallTop.length)], ring = out.column.get(c), w = ring[1 + Math.floor(R() * (ring.length - 2))], x = pos[w * 3], y = pos[w * 3 + 1], z = pos[w * 3 + 2]; T.cave(x, z, cs); if (cs.s < 11) continue;
      const [ox, oz] = outward(x, z), hue = Math.floor(R() * 3), lean = .9 + R() * .5; crystal(x + ox * .04, y, z + oz * .04, .16 + R() * .22, .03 + R() * .025, -oz * lean, ox * lean, HUES[hue]); n++; }
    for (const [u, v] of C.mushrooms) for (let k = 0; k < 5; k++) { const [x0, z0] = at(u, v), x = x0 + (R() - .5) * .55, z = z0 + (R() - .5) * .55; if (T.cave(x, z).sd > -.08) continue; const y = floorAt(x, z), s = .5 + R() * .7;
      for (const [g, c] of [[new THREE.CylinderGeometry(.018 * s, .026 * s, .13 * s, 5).translate(x, y + .065 * s, z), [1.1, 1.2, .95]], [new THREE.SphereGeometry(.075 * s, 8, 5, 0, TAU, 0, Math.PI / 2).scale(1, .62, 1).translate(x, y + .12 * s, z), [.85, 1.5, 1]]]) { const q = g.toNonIndexed(), p = q.attributes.position; for (let i = 0; i < p.count; i++) { tri.push(p.getX(i), p.getY(i), p.getZ(i)); tcol.push(...c); } g.dispose(); q.dispose(); }
      if (k === 0) { hp.push(x0, y + .2, z0); hc.push(.4, .9, .6); } }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(tri, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(tcol, 3));
    const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({vertexColors: true, toneMapped: false, fog: false})); m.name = 'cave crystals'; group.add(m); out.crystals = m;
    const halo = canvasTex(64, 64, q => { const gr = q.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,.7)'); gr.addColorStop(.3, 'rgba(255,255,255,.24)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); q.fillStyle = gr; q.fillRect(0, 0, 64, 64); });
    const halos = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(hp, 3)).setAttribute('color', new THREE.Float32BufferAttribute(hc, 3)), new THREE.PointsMaterial({map: halo, size: 2.3, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, opacity: .42, fog: false}));
    halos.name = 'cave glow'; halos.renderOrder = 5; group.add(halos); out.halos = halos;
    // glow-worms: threads of small blue lights on the ceiling, thick in the hall
    const wp = []; for (let k = 0; k < 900 && wp.length < 190 * 3; k++) { const u = lerp(B.u0, B.u1, R()), v = lerp(C.open + 1.2, B.v1, R()), [x, z] = at(u, v); T.cave(x, z, cs); if (cs.sd > -.5 || fbm(x * .5 + 2, z * .5) < .47) continue; wp.push(x, ceilAt(x, z) - .05, z); }
    const worms = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(wp, 3)), new THREE.PointsMaterial({map: halo, size: .2, color: '#9ff2ff', transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, fog: false}));
    worms.name = 'glow-worms'; worms.renderOrder = 5; group.add(worms); out.worms = worms;
  });
  steps.push(() => { // the lake: still, dark water that gives back the crystals' light; a drop falls now and then and rings run out
    const [x, z] = at(C.pool[0], C.pool[1]), y = floorAt(x, z) + .035, RINGS = 10, SEG = 44, p = [], g4 = [], id = [], o = [0, 0, 0, 0];
    for (let i = 0; i <= RINGS; i++) for (let j = 0; j < SEG; j++) { const r = i / RINGS, a = j / SEG * TAU, rr = C.pool[2] * r * (1 + .07 * Math.sin(a * 3 + 1) + .04 * Math.sin(a * 5)), px = x + Math.cos(a) * rr, pz = z + Math.sin(a) * rr * .8; p.push(px, y, pz);
      // the glow of each crystal lies on the water as a streak towards the viewer (south)
      let cr = 0, cg = 0, cb = 0; for (const [u, v, , hue] of C.crystals) { const [lx, lz] = at(u, v), dz = pz - lz, dx = px - lx; if (dz < -.5 || dz > 7) continue; const k = Math.exp(-(dx * dx) / .5) * Math.exp(-Math.max(0, dz) / 2.6) * .9; cr += GLOW[hue][0] * k; cg += GLOW[hue][1] * k; cb += GLOW[hue][2] * k; }
      bake(px, y, pz, 0, 1, 0, o); g4.push(cr + o[0] * .25, cg + o[1] * .25, cb + o[2] * .25, r); }
    for (let i = 0; i < RINGS; i++) for (let j = 0; j < SEG; j++) { const a = i * SEG + j, b = i * SEG + (j + 1) % SEG; id.push(a, a + SEG, b, b, a + SEG, b + SEG); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3)); g.setAttribute('gl', new THREE.Float32BufferAttribute(g4, 4)); g.setIndex(id);
    const m = new THREE.Mesh(g, new THREE.ShaderMaterial({transparent: true, depthWrite: false, side: THREE.DoubleSide, uniforms: {uTime: caveLight.time, uNoise: {value: look.T.noise}, uC: {value: new THREE.Vector3(x, y, z)}},
      vertexShader: 'attribute vec4 gl;varying vec4 vG;varying vec3 vW;varying float vD;void main(){vG=gl;vW=position;vec4 mv=modelViewMatrix*vec4(position,1.);vD=-mv.z;gl_Position=projectionMatrix*mv;}',
      fragmentShader: `uniform float uTime;uniform sampler2D uNoise;uniform vec3 uC;varying vec4 vG;varying vec3 vW;varying float vD;
        void main(){vec2 q=vW.xz-uC.xz;float n=texture2D(uNoise,q*.11+vec2(uTime*.006,uTime*.004)).r,n2=texture2D(uNoise,q*.23-vec2(uTime*.008,0.)).r;
          float rings=0.;for(int i=0;i<3;i++){float fi=float(i),per=5.5+fi*2.3,ph=uTime/per+fi*.37,t=fract(ph),nth=floor(ph);vec2 o=vec2(sin(nth*12.9+fi*4.1),cos(nth*7.3+fi*2.7))*${(C.pool[2] * .45).toFixed(2)};float d=length(q-o);rings+=sin((d-t*2.6)*16.)*exp(-abs(d-t*2.6)*3.2)*(1.-t)*(1.-t);}
          vec3 c=mix(vec3(.07,.42,.46),vec3(.015,.12,.19),smoothstep(.0,.8,1.-vG.a))*(.8+.45*n)+vG.rgb*(.5+.9*n2+rings*.6);
          c+=vec3(.3,.75,.8)*max(0.,rings)*.3+vec3(.1,.4,.42)*smoothstep(.6,.78,n*.5+n2*.5);
          c=mix(c,${DARK},smoothstep(9.,34.,vD));gl_FragColor=vec4(c,(1.-smoothstep(.86,1.,vG.a))*.96);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`}));
    m.name = 'cave lake'; m.renderOrder = 1; group.add(m); out.lake = m;
  });
  return steps;
}
