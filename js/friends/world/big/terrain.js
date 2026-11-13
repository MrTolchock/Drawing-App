/* The big world's ground and water as pure functions of the layout (world/big/layout.js):
   height with hills, the Rock and its cliff, the swamp basin and the world's rim; streams that
   run downhill and carve their beds; still pools; biomes; trails; crossings; ground colour.
   Nothing here builds meshes, so tiles can be built and rebuilt in any order and always agree. */
import {THREE} from '../../../scene/materials.js';
import {TAU, clamp, lerp, sstep, fbm, sampleIndex} from '../noise.js';
import * as L from './layout.js';

const V3 = (x, z) => new THREE.Vector3(x, 0, z);
const C = h => new THREE.Color(h);
const angle = (a, b) => Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b)));
function segment(px, pz, ax, az, bx, bz, out) {
  const dx = bx - ax, dz = bz - az, t = clamp(((px - ax) * dx + (pz - az) * dz) / (dx * dx + dz * dz || 1), 0, 1);
  out.d = Math.hypot(px - ax - dx * t, pz - az - dz * t); out.t = t; return out;
}

export function createTerrain() {
  const E = L.EXTENT, R = L.ROCK, S = L.SWAMP;

  /* ---------- big shapes ---------- */
  /** Metres inside the world's wavy rim (walkable where this is above 9). */
  const edge = (x, z) => Math.min(x - E.x0, E.x1 - x, z - E.z0, E.z1 - z) + (fbm(x * .03 + 40, z * .03 + 17) - .5) * 14;
  const rk = {d: 0, th: 0};
  /** The Rock's outline: metres inside it (negative outside) and the direction from its centre. */
  function rock(x, z, out = rk) {
    const dx = (x - R.x) / R.rx, dz = (z - R.z) / R.rz, th = Math.atan2(dz, dx);
    out.d = (1 + .09 * Math.sin(3 * th + 1.2) + .05 * Math.sin(7 * th + .5) - Math.hypot(dx, dz)) * R.rz; out.th = th; return out;
  }
  /** How far up the peak a spot is: 0 at its foot and beyond, 1 on the top (a pointed cone with a rounded tip). */
  const PK = L.PEAK;
  function peak(x, z) { const d = Math.hypot(x - PK.x, z - PK.z); if (d >= PK.r) return 0; const t = 1 - d / PK.r; return .5 * t * t + .5 * t * t * (3 - 2 * t); }
  /** Snow: 1 where it lies thick, 0 below the snow line (which wanders a little). */
  function snow(x, z) { const p = peak(x, z); return p <= 0 ? 0 : sstep(.1, .2, p + (fbm(x * .35 + 11, z * .35 + 4) - .5) * .09 + (fbm(x * 1.4, z * 1.4 + 9) - .5) * .03); }
  const RAMP = 3.22;                                   // the west flank, where a trail climbs to the plateau
  function rockHeight(x, z) {
    rock(x, z); const pk = peak(x, z) * PK.top; if (rk.d < -14) return pk;
    const cliff = sstep(1.25, .85, angle(rk.th, R.fall)), ramp = sstep(.75, .35, angle(rk.th, RAMP));
    // under the peak the plateau counts as fully risen: near the Rock's centre its outline wobbles quickly and
    // would leave little ridges on the mountain's flank that are too steep to climb
    const body = lerp(sstep(0, lerp(lerp(7, 3.4, cliff), 25, ramp), rk.d), 1, sstep(2.2, 4.8, pk));
    const scree = sstep(-14, 0, rk.d) * 1.6 * (1 - ramp * .7);
    return scree + body * R.top + body * ((fbm(x * .09 + 3, z * .09) - .5) * 1.6 + (fbm(x * .3, z * .3 + 8) - .5) * .5) + pk;
  }
  const meadow = (x, z) => sstep(1.05, .72, Math.hypot((x + 72) / 41, (z + 4) / 37) + (fbm(x * .045 + 11, z * .045 + 3) - .5) * .45);
  const swampMask = (x, z) => sstep(1, .6, Math.hypot((x - S.x) / S.rx, (z - S.z) / S.rz) + (fbm(x * .05 + 20, z * .05) - .5) * .35);
  const blob = (x, z, cx, cz, r, seed) => sstep(1.1, .7, Math.hypot(x - cx, z - cz) / r + (fbm(x * .05 + seed, z * .05 + seed * 2) - .5) * .5);
  function glade(x, z) { let g = 0; for (const [cx, cz, r] of L.GLADES) { const d = Math.hypot(x - cx, z - cz); if (d < r + 2.5) g = Math.max(g, sstep(r + 2.5, r - 1.5, d)); } return g; }
  /** How much of each habitat a spot has (0…1 each); the rest is beech wood. */
  function biome(x, z, out = {}) {
    rock(x, z);
    out.rock = sstep(-10, 0, rk.d); out.snow = snow(x, z); out.meadow = meadow(x, z); out.swamp = swampMask(x, z); out.glade = glade(x, z);
    out.spruce = sstep(-34, -54, z + (fbm(x * .03 + 7, z * .03 + 2) - .5) * 34) * (1 - out.rock) * (1 - out.meadow);
    out.birch = Math.max(blob(x, z, -58, 54, 30, 5), blob(x, z, -36, -26, 13, 9) * .8, blob(x, z, 60, 44, 20, 3) * .6) * (1 - out.swamp) * (1 - out.meadow * .7);
    return out;
  }

  /** Height before any water is carved. */
  function raw(x, z) {
    const md = meadow(x, z), roll = (fbm(x * .035 + 3, z * .035 + 7) - .5) * 2.4 + (fbm(x * .11 + 1, z * .11) - .5) * .5;
    let h = x * .012 - z * .014 + roll * (1 - .55 * md) + md * .6;
    for (const [cx, cz, r, top] of L.HILLS) { const q = ((x - cx) ** 2 + (z - cz) ** 2) / (r * r); if (q < 6) h += top * Math.exp(-q); }
    h = lerp(h, roll * .12, sstep(30, 13, Math.hypot(x - 1, z + 4)));             // the den's clearing is nearly flat
    h += rockHeight(x, z);
    const ed = edge(x, z); h += sstep(10, -8, ed) * 7 + sstep(24, 6, ed) * 1.2;      // the wooded rim rises
    const sw = swampMask(x, z);
    if (sw > 0) h = lerp(h, S.level + (fbm(x * .085 + 5, z * .085 + 9) - .4) * 1.9 + (fbm(x * .4, z * .4) - .5) * .14, sw);
    return h;
  }

  /* ---------- the waterfall: where the Rock's cliff meets the spring ---------- */
  const falls = (() => {
    const dir = new THREE.Vector2(Math.cos(R.fall) * R.rx, Math.sin(R.fall) * R.rz).normalize();
    let s = 0; for (let k = 0; k < 400; k++) { s = 10 + k * .1; if (rock(R.x + dir.x * s, R.z + dir.y * s).d <= 0) break; }
    const foot = [R.x + dir.x * s, R.z + dir.y * s];
    return {dir: [dir.x, dir.y], foot, lip: [foot[0] - dir.x * 3.9, foot[1] - dir.y * 3.9], base: [foot[0] + dir.x * 5.4, foot[1] + dir.y * 5.4]};
  })();

  /* ---------- pools ---------- */
  const pools = L.POOLS.map(p => ({...p}));
  { const p = pools.find(q => q.id === 'plunge'); p.x = falls.base[0]; p.z = falls.base[1]; }
  function poolE(p, x, z) {
    const c = Math.cos(p.rot), s = Math.sin(p.rot), dx = x - p.x, dz = z - p.z, u = dx * c + dz * s, v = -dx * s + dz * c, th = Math.atan2(v / p.rz, u / p.rx);
    return Math.hypot(u / p.rx, v / p.rz) / (1 + .1 * Math.sin(3 * th + p.x) + .06 * Math.sin(5 * th));
  }
  const poolOf = id => pools.find(p => p.id === id);

  /* ---------- streams ---------- */
  const streams = L.STREAMS.map((def, k) => {
    const pts = def.pts.map(p => [...p]);
    if (def.id === 'spring') pts[pts.length - 1] = [...falls.lip];
    // control points every ~4 m, pushed sideways by a smooth meander (zero at the ends and at a pinned crossing)
    const ctrl = [], total = pts.slice(1).reduce((a, p, i) => a + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0); let run = 0;
    for (let i = 0; i < pts.length - 1; i++) {
      const [ax, az] = pts[i], [bx, bz] = pts[i + 1], len = Math.hypot(bx - ax, bz - az), n = Math.max(1, Math.round(len / 4));
      for (let j = 0; j < n; j++) {
        const u = j / n, x = lerp(ax, bx, u), z = lerp(az, bz, u), along = run + len * u;
        let amp = (def.meander || 0) * sstep(0, 6, along) * sstep(0, 6, total - along);
        if (def.pin) amp *= sstep(2, 9, Math.hypot(x - def.pin[0], z - def.pin[1]));
        const off = amp * Math.sin(along * .23 + k * 1.7); ctrl.push([x + off * (bz - az) / len, z - off * (bx - ax) / len]);
      }
      run += len;
    }
    ctrl.push(pts[pts.length - 1]);
    const curve = new THREE.CatmullRomCurve3(ctrl.map(([x, z]) => V3(x, z)), false, 'centripetal'), len = curve.getLength();
    const N = Math.max(40, Math.round(len / .2)), samples = curve.getSpacedPoints(N), [w0, w1, w2] = def.width;
    const stream = {id: def.id, def, samples, N, len, nearest: sampleIndex(samples, 3), level: new Float32Array(N + 1),
      width: i => w0 + w1 * Math.sin(i * .2 * .33) + w2 * Math.sin(i * .2 * .81 + 1.3)};
    // the water runs downhill along the uncarved ground, starting at its source pool
    let lv = def.from ? poolOf(def.from).level - (def.drop || .04) : Infinity;
    for (let i = 0; i <= N; i++) { lv = Math.min(lv, raw(samples[i].x, samples[i].z) - .34); stream.level[i] = lv; }
    const floor = def.to === 'swamp' ? S.level : def.to ? poolOf(def.to).level : -Infinity;
    for (let i = 0; i <= N; i++) stream.level[i] = Math.max(stream.level[i], floor);
    for (let pass = 0; pass < 3; pass++) for (let i = N - 1; i > 0; i--) stream.level[i] = Math.min(stream.level[i - 1], (stream.level[i - 1] + stream.level[i] * 2 + stream.level[i + 1]) / 4);
    return stream;
  });
  const hit = {d: Infinity, i: 0, t: 0}, st = {d: Infinity, w: 1, level: 0, i: 0, stream: null};
  /** The nearest stream within 6 m: {d, w, level, i, stream}; `d` is Infinity when there is none. */
  function streamAt(x, z, out = st) {
    out.d = Infinity; out.stream = null; let best = Infinity;
    for (const s of streams) { s.nearest(x, z, 2, hit); if (hit.d === Infinity) continue; const w = s.width(hit.i); if (hit.d - w / 2 < best) { best = hit.d - w / 2; out.d = hit.d; out.w = w; out.i = hit.i; out.level = s.level[hit.i]; out.stream = s; } }
    return out;
  }
  falls.top = streams[0].level[streams[0].N]; falls.level = poolOf('plunge').level;

  /* ---------- trails ---------- */
  const trails = L.TRAILS.map((t, k) => {
    const curve = new THREE.CatmullRomCurve3(t.pts.map(([x, z]) => V3(x, z)), false, 'centripetal');
    const samples = curve.getSpacedPoints(Math.max(20, Math.round(curve.getLength() / .25)));
    for (let i = 1; i < samples.length - 1; i++) { const a = samples[i - 1], c = samples[i + 1], dx = c.x - a.x, dz = c.z - a.z, l = Math.hypot(dx, dz) || 1, o = Math.sin(i * .21 + k * 2.1) * .22 * sstep(0, 8, Math.min(i, samples.length - 1 - i)); samples[i].x += -dz / l * o; samples[i].z += dx / l * o; }
    return {id: t.id, w: t.w || .9, samples, nearest: sampleIndex(samples, 3)};
  });
  const plaza = {x: .6, z: -4.1, rx: 2.4, rz: 1.5}, pa = {d: Infinity, w: 1};
  /** The nearest trail within 6 m: {d, w}. */
  function pathAt(x, z, out = pa) {
    out.d = Infinity; out.w = 1; let best = Infinity;
    for (const p of trails) { p.nearest(x, z, 2, hit); if (hit.d === Infinity) continue; const w = p.w * (1 + .22 * Math.sin(hit.t * 31 + p.w * 10)); if (hit.d - w / 2 < best) { best = hit.d - w / 2; out.d = hit.d; out.w = w; } }
    const e = Math.hypot((x - plaza.x) / plaza.rx, (z - plaza.z) / plaza.rz), d = (e - 1) * plaza.rz + .45;
    if (d - .45 < best) { out.d = Math.max(0, d); out.w = .9; }
    return out;
  }

  /* ---------- the ground ---------- */
  const seg = {d: 0, t: 0}, dam = {...L.DAM, top: poolOf('pond').level + .3};
  // The dam's normal towards the pond: the pond's water ends at the dam, the brook below it runs lower.
  { const dx = dam.b[0] - dam.a[0], dz = dam.b[1] - dam.a[1], l = Math.hypot(dx, dz), p = poolOf('pond'), side = Math.sign((p.x - dam.a[0]) * dz - (p.z - dam.a[1]) * dx) || 1; dam.n = [dz / l * side, -dx / l * side]; dam.len = l; }
  // One spot is usually asked several times in a row (height, colour, water): remember the last answer.
  const memo = {x: NaN, z: NaN, h: 0, raw: 0, sd: Infinity, sw: 1, sl: 0, pd: Infinity, pw: 1, still: NaN};
  function site(x, z) {
    if (x === memo.x && z === memo.z) return memo;
    let h = raw(x, z), still = NaN; memo.raw = h;
    streamAt(x, z); const sd = st.d, hw = st.w / 2;
    if (sd < hw + 5) {
      const top = st.level + .34;
      h = lerp(h, Math.max(top, Math.min(h, top + .25)), sstep(hw + 5, hw + .9, sd));
      if (sd < hw + .9) h = lerp(top, st.level - .05, sstep(hw + .9, hw - .05, sd));
      if (sd < hw) h = st.level - .05 - .32 * (1 - (sd / hw) ** 2) + (fbm(x * 2.3, z * 2.3) - .5) * .06;
    }
    const nearStream = sstep(hw + 1.6, hw + .3, sd);
    for (const p of pools) {
      if (Math.abs(x - p.x) > p.rx * 2.2 || Math.abs(z - p.z) > p.rx * 2.2) continue;
      const e = poolE(p, x, z); if (e > 1.9) continue;
      h = lerp(h, clamp(h, lerp(p.level + .12, Math.min(h, p.level + .12), nearStream), p.level + .5), sstep(1.9, 1.15, e));
      if (e < 1.15) { h = Math.min(h, lerp(p.level + .12, p.level - p.depth, sstep(1.15, .5, e)) + (fbm(x * 1.7, z * 1.7) - .5) * .08); still = p.level; }
    }
    if (Math.abs(x - dam.a[0]) < 12 && Math.abs(z - dam.a[1]) < 12) { segment(x, z, dam.a[0], dam.a[1], dam.b[0], dam.b[1], seg); if (seg.d < 2.4) h = Math.max(h, dam.top - .12 - Math.max(0, seg.d - .45) * 1.5);
      if (still === still && (x - dam.a[0]) * dam.n[0] + (z - dam.a[1]) * dam.n[1] < -.25 && seg.d < 9) still = NaN; }
    if (swampMask(x, z) > .04 && !(still === still)) still = S.level;
    pathAt(x, z); if (pa.d < pa.w / 2 + .35) h -= .045 * sstep(pa.w / 2 + .35, pa.w / 2 - .1, pa.d);
    memo.x = x; memo.z = z; memo.h = h; memo.sd = sd; memo.sw = st.w; memo.sl = st.level; memo.pd = pa.d; memo.pw = pa.w; memo.still = still;
    return memo;
  }
  const ground = (x, z) => site(x, z).h;
  /** Depth of still water here (pond, plunge pool, swamp); negative on dry land. */
  const stillDepth = (x, z) => { const s = site(x, z); return s.still === s.still ? s.still - s.h : -1; };
  const stillLevel = (x, z) => site(x, z).still;
  /** How steep the ground is (rise over run). */
  function slope(x, z) { const e = .45, hx = ground(x + e, z) - ground(x - e, z), hz = ground(x, z + e) - ground(x, z - e); return Math.hypot(hx, hz) / (2 * e); }

  /* ---------- ground colour ---------- */
  const grassA = C('#5f8f2f'), grassB = C('#86ad45'), sunny = C('#a9b856'), mossC = C('#4c7a2a'), edgeC = C('#9b8a4a'), dirt = C('#b77a49'), dirtL = C('#cf9a66'),
    wetC = C('#6a5237'), sand = C('#bba57f'), bed = C('#7c6c50'), meadowA = C('#8db546'), meadowB = C('#b9c95c'), needle = C('#77683c'), birchC = C('#9db84c'),
    bog = C('#4d6b33'), mud = C('#54452c'), stoneA = C('#8f8b7e'), stoneB = C('#a9a493'), stoneD = C('#6f6b60'), bm = {},
    snowC = new THREE.Color(1.5, 1.56, 1.66), snowShade = new THREE.Color(1.12, 1.24, 1.5), snowPath = new THREE.Color(1.05, 1.03, 1);
  /** Painted ground colour (without the rock that shows on steep ground: see `cliff`). */
  function colour(x, z, out) {
    const s = site(x, z), n = fbm(x * .18, z * .18), n2 = fbm(x * .9 + 4, z * .9), b = biome(x, z, bm);
    out.copy(grassA).lerp(grassB, n).lerp(sunny, sstep(.62, .82, fbm(x * .05 + 9, z * .05)) * .55);
    if (b.meadow > 0) out.lerp(meadowA, b.meadow * .85).lerp(meadowB, b.meadow * sstep(.4, .75, fbm(x * .06 + 2, z * .06 + 5)) * .8);
    if (b.birch > 0) out.lerp(birchC, b.birch * .45);
    if (b.spruce > 0) out.lerp(needle, b.spruce * (.45 + .4 * n2));
    out.lerp(mossC, sstep(7, 4, Math.hypot(x - L.DEN.x, z - L.DEN.z)) * .7);
    if (b.rock > 0) out.lerp(stoneA, b.rock * sstep(.35, .6, n2 * .5 + b.rock * .45) * .85);
    if (b.swamp > 0) { const above = s.h - S.level; out.lerp(bog, b.swamp * .85); out.lerp(mud, b.swamp * sstep(.28, .02, above) * .9); }
    const pe = s.pd - s.pw / 2 + (n2 - .5) * .35;
    if (pe < .25) out.lerp(edgeC, sstep(.25, 0, pe) * .6);
    if (pe < 0) { out.copy(dirt).lerp(dirtL, n2 * .7); if (b.rock > .5) out.lerp(stoneB, .5); }
    if (s.sd < 8) { const be = s.sd - s.sw / 2; if (be < 1.1) out.lerp(wetC, sstep(1.1, .25, be + (n2 - .5) * .3)); if (be < .35) out.lerp(sand, sstep(.35, .05, be) * (.5 + .5 * n2)); if (be < 0) out.copy(bed).lerp(sand, n2 * .5); }
    if (s.still === s.still && b.swamp < .5) { const above = s.h - s.still; if (above < .45) out.lerp(wetC, sstep(.45, .1, above + (n2 - .5) * .2)); if (above < .12) out.lerp(sand, sstep(.12, 0, above) * (.4 + .6 * n2)); if (above < -.05) out.copy(bed).lerp(stoneD, sstep(-.1, -.9, above) * .6); }
    // snow on the peak: bluish in the hollows, a trodden grey-white on the path
    if (b.snow > 0) { out.lerp(scratchC.copy(snowC).lerp(snowShade, sstep(.45, .7, fbm(x * .22 + 6, z * .22)) * .6), b.snow); if (pe < 0) out.lerp(snowPath, b.snow * .85); }
    return out;
  }
  /** Rock shows through where the ground is steep; `up` is the normal's y. */
  function cliff(x, z, up, out) {
    let k = sstep(.9, .66, up + (fbm(x * .7, z * .7) - .5) * .12); if (k <= 0) return out;
    const sn = snow(x, z); if (sn > 0) k *= 1 - sn * sstep(.5, .72, up);                // snow stays on all but the steepest rock
    const y = ground(x, z), band = .5 + .5 * Math.sin(y * 2.4 + fbm(x * .25, z * .25) * 5);
    return out.lerp(scratchC.copy(stoneA).lerp(stoneB, band * .7).lerp(stoneD, sstep(.6, .9, fbm(x * 1.3 + 2, z * 1.3)) * .5), k);
  }
  const scratchC = new THREE.Color();

  /* ---------- crossings ---------- */
  const streamOf = id => streams.find(s => s.id === id);
  const crossings = L.CROSSINGS.map(c => {
    if (c.kind === 'planks') return {...c, width: 1.25, y: S.level + .34};
    if (c.kind === 'dam') return {...c, a: dam.a, b: dam.b, width: 1.2, y: dam.top};
    const s = streamOf(c.stream); let bi = 0, bd = Infinity; s.samples.forEach((p, i) => { const d = Math.hypot(p.x - c.at[0], p.z - c.at[1]); if (d < bd) { bd = d; bi = i; } });
    const p = s.samples[bi], q = s.samples[Math.min(s.N, bi + 4)], o = s.samples[Math.max(0, bi - 4)], dx = q.x - o.x, dz = q.z - o.z, l = Math.hypot(dx, dz), sx = -dz / l, sz = dx / l, w = s.width(bi), sign = sx < 0 ? -1 : 1;
    const half = c.kind === 'bridge' ? w / 2 + 1.2 : c.kind === 'log' ? w / 2 + 1.5 : w / 2 + .75;
    const a = [p.x - sx * half * sign, p.z - sz * half * sign], b = [p.x + sx * half * sign, p.z + sz * half * sign];
    if (c.kind === 'bridge') return {...c, a, b, width: 1.3, span: half * 2, level: s.level[bi]};
    if (c.kind === 'log') return {...c, a, b, width: .8, radius: .34, ya: ground(...a) + .3, yb: ground(...b) + .24, level: s.level[bi]};
    return {...c, a, b, width: 1, y: s.level[bi] + .13, level: s.level[bi]};
  });
  const on = {c: null, t: 0};
  /** The crossing a spot is on, with how far along it (0…1), or null. */
  function onCrossing(x, z) {
    for (const c of crossings) {
      if (Math.abs(x - c.a[0]) > 12 || Math.abs(z - c.a[1]) > 12) continue;
      segment(x, z, c.a[0], c.a[1], c.b[0], c.b[1], seg); const ends = c.kind === 'planks' || c.kind === 'dam' ? -1e-9 : 0;
      if (seg.d < c.width / 2 && seg.t > ends && seg.t < 1 - ends) { on.c = c; on.t = seg.t; return on; }
    }
    return null;
  }
  /** Height of a crossing's walkway at `t` along it. */
  function deck(c, t) {
    if (c.kind === 'bridge') return .5 * Math.sin(Math.PI * t) + lerp(ground(...c.a), ground(...c.b), t);
    if (c.kind === 'log') return lerp(c.ya, c.yb, t) - Math.sin(t * Math.PI) * .06 + c.radius * (1 - t * .28) * .92;
    return c.y;
  }
  /** Where Fuchs' feet are: the ground, or a bridge, log, stone, plank or the dam. */
  function groundY(x, z) {
    const o = onCrossing(x, z); if (o) return Math.max(deck(o.c, o.t), o.c.kind === 'bridge' || o.c.kind === 'log' ? -Infinity : ground(x, z));
    for (const c of crossings) if (c.kind === 'log') for (const end of [c.a, c.b]) { const d = Math.hypot(x - end[0], z - end[1]); if (d < .7) { segment(x, z, c.a[0], c.a[1], c.b[0], c.b[1], seg); if (seg.d < c.width / 2 + .1) return lerp(deck(c, end === c.a ? 0 : 1), ground(x, z), sstep(0, .7, d)); } }
    return ground(x, z);
  }
  /** Water too deep to walk in (streams and pools), unless a crossing carries Fuchs over it. */
  function wet(x, z) { const s = site(x, z); return s.sd - s.sw / 2 < .42 || (s.still === s.still && s.still - s.h > .07); }

  return {extent: E, edge, rock, peak, snow, biome, raw, site, ground, slope, colour, cliff, stillDepth, stillLevel, streamAt, pathAt, streams, pools, poolE, swamp: S, swampMask, trails, plaza,
    crossings, onCrossing, deck, groundY, wet, falls, dam, TAU};
}
