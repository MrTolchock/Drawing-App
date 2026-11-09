/* A region at runtime: the shape of its ground, brook, trails and crossings, and its colliders,
   all derived from the plain data in world/regions/*.js. Pure functions of that data, so tiles
   can be built (and rebuilt) in any order. */
import {THREE} from '../../forest/materials.js';
import {TAU, clamp, lerp, sstep, fbm, rng, sampleIndex} from './noise.js';

const V3 = (x, z) => new THREE.Vector3(x, 0, z);
/** Ground shared by all regions: gentle noise, continuous across region borders. */
export function baseGround(x, z) { return (fbm(x * .07 + 3, z * .07 + 7) - .5) * .9; }

function segmentDistance(px, pz, ax, az, bx, bz) {
  const dx = bx - ax, dz = bz - az, t = clamp(((px - ax) * dx + (pz - az) * dz) / (dx * dx + dz * dz || 1), 0, 1);
  return {d: Math.hypot(px - ax - dx * t, pz - az - dz * t), t};
}

export function createRegion(data) {
  const {clearing} = data, b = data.bounds;
  const region = {...data};
  const seeded = rng(data.seed);

  /* ---------- the brook: a meandering spline around the authored centre line ---------- */
  let brook = null;
  if (data.brook) {
    const {line, meander = {amp: 0, freq: .24, zeroAt: 0}, width = [1.15, .42, .22]} = data.brook;
    // Control points every ~4 m along the authored line, pushed sideways by a smooth meander that is
    // zero at `zeroAt` (where the arched bridge sits), so the crossing keeps its authored place.
    const ctrl = [];
    for (let i = 0; i < line.length - 1; i++) {
      const [ax, az] = line[i], [bx, bz] = line[i + 1], len = Math.hypot(bx - ax, bz - az), n = Math.max(1, Math.round(len / 4));
      for (let k = 0; k < n; k++) { const u = k / n, x = lerp(ax, bx, u), z = lerp(az, bz, u), off = meander.amp * Math.sin((z - meander.zeroAt) * meander.freq); ctrl.push([x + off * (bz - az) / len, z - off * (bx - ax) / len]); }
    }
    ctrl.push(line[line.length - 1]);
    const curve = new THREE.CatmullRomCurve3(ctrl.map(([x, z]) => V3(x, z)), false, 'centripetal');
    const N = Math.max(60, Math.round(curve.getLength() / .14)), samples = curve.getSpacedPoints(N), near = sampleIndex(samples, 3);
    const w = t => width[0] + width[1] * Math.sin(t * 23) + width[2] * Math.sin(t * 57 + 1.3);
    brook = {curve, samples, N, nearest: near, width: w,
      level: t => { const p = samples[Math.round(t * N)]; return region.hills(p.x, p.z) * .85 - .32; },
      at(x, z) { const n = near(x, z, 3); return n.d === Infinity ? null : {...n, w: w(n.t), level: brook.level(n.t)}; }};
  }
  region.brook = brook;

  /* ---------- trails: narrow, wandering splines through the authored trail points ---------- */
  const trails = (data.trails || []).map((t, k) => {
    const pts = t.pts || t, curve = new THREE.CatmullRomCurve3(pts.map(([x, z]) => V3(x, z)), false, 'centripetal');
    const samples = curve.getSpacedPoints(Math.max(20, Math.round(curve.getLength() / .25)));
    // a gentle sideways wander so the trail never looks ruled
    for (let i = 1; i < samples.length - 1; i++) { const a = samples[i - 1], c = samples[i + 1], dx = c.x - a.x, dz = c.z - a.z, l = Math.hypot(dx, dz) || 1, o = Math.sin(i * .21 + k * 2.1) * .22; samples[i].x += -dz / l * o; samples[i].z += dx / l * o; }
    return {w: t.w || .9, samples, nearest: sampleIndex(samples, 3)};
  });
  region.trails = trails;
  region.pathAt = (x, z) => {
    let best = null;
    for (const p of trails) { const n = p.nearest(x, z, 2); if (n.d === Infinity) continue; const w = p.w * (1 + .22 * Math.sin(n.t * 31 + p.w * 10)); if (!best || n.d - w / 2 < best.d - best.w / 2) best = {...n, w}; }
    if (data.plaza) { const P = data.plaza, e = Math.hypot((x - P.x) / P.rx, (z - P.z) / P.rz); const d = (e - 1) * Math.min(P.rx, P.rz) + .45; if (!best || d - .45 < best.d - best.w / 2) best = {d: Math.max(0, d), w: .9, t: 0, plaza: true}; }
    return best || {d: Infinity, w: 1, t: 0};
  };

  /* ---------- ground ---------- */
  const borderFade = (x, z) => { let f = 1; for (const side of data.neighbours || []) { const d = side === 'w' ? x - b.x0 : side === 'e' ? b.x1 - x : side === 'n' ? z - b.z0 : b.z1 - z; f = Math.min(f, sstep(0, 8, d)); } return f; };
  const wildness = (x, z) => sstep(clearing.r - 4, clearing.r + 8, Math.hypot(x - clearing.x, z - clearing.z));
  region.wildness = wildness;
  region.hills = (x, z) => (data.hills ? data.hills(x, z) : 0) * wildness(x, z) * borderFade(x, z);
  region.ground = (x, z, bk = brook && brook.at(x, z), pa = region.pathAt(x, z)) => {
    const wild = wildness(x, z), base = baseGround(x, z) * lerp(.2, 1, wild) + region.hills(x, z);
    let h = base;
    if (bk && bk.d < bk.w / 2 + 5) {
      const hw = bk.w / 2, top = bk.level + .34, shoulder = sstep(hw + 5, hw + .9, bk.d);
      h = lerp(h, Math.max(top, Math.min(h, top + .25)), shoulder);
      if (bk.d < hw + .9) h = lerp(top, bk.level - .05, sstep(hw + .9, hw - .05, bk.d));
      if (bk.d < hw) h = bk.level - .05 - .32 * (1 - (bk.d / hw) ** 2) + (fbm(x * 2.3, z * 2.3) - .5) * .06;
      // where a neighbouring region begins, the brook runs underground: the bank flattens out
      if (data.neighbours?.length) h = lerp(base, h, borderFade(x, z));
    }
    if (pa.d < pa.w / 2 + .35) h -= .045 * sstep(pa.w / 2 + .35, pa.w / 2 - .1, pa.d);
    return h;
  };
  /** Analytic normal of the ground, so tile edges shade without seams. */
  region.normal = (x, z, out) => { const e = .25, hx = region.ground(x + e, z) - region.ground(x - e, z), hz = region.ground(x, z + e) - region.ground(x, z - e); return out.set(-hx / (2 * e), 1, -hz / (2 * e)).normalize(); };

  /* ---------- terrain colour: meadow, sunny patches, moss, trail earth, wet soil, sand, bed ---------- */
  const C = h => new THREE.Color(h), grassA = C('#5f8f2f'), grassB = C('#86ad45'), sunny = C('#a9b856'), moss = C('#4c7a2a'), edge = C('#9b8a4a'),
    dirt = C('#b77a49'), dirtL = C('#cf9a66'), wet = C('#6a5237'), sand = C('#bba57f'), bed = C('#7c6c50');
  region.colour = (x, z, out, bk = brook && brook.at(x, z), pa = region.pathAt(x, z)) => {
    const n = fbm(x * .18, z * .18), n2 = fbm(x * .9 + 4, z * .9);
    out.copy(grassA).lerp(grassB, n).lerp(sunny, sstep(.62, .82, fbm(x * .05 + 9, z * .05)) * .55);
    for (const m of data.mossy || []) out.lerp(moss, sstep(m.r + 3, m.r, Math.hypot(x - m.x, z - m.z)) * .7);
    const pe = pa.d - pa.w / 2 + (n2 - .5) * .35;
    if (pe < .25) out.lerp(edge, sstep(.25, 0, pe) * .6);
    if (pe < 0) out.copy(dirt).lerp(dirtL, n2 * .7);
    if (bk) { const be = bk.d - bk.w / 2; if (be < 1.1) out.lerp(wet, sstep(1.1, .25, be + (n2 - .5) * .3)); if (be < .35) out.lerp(sand, sstep(.35, .05, be) * (.5 + .5 * n2)); if (be < 0) out.copy(bed).lerp(sand, n2 * .5); }
    return out;
  };

  /* ---------- crossings: an arched bridge and a fallen log ---------- */
  region.crossings = (data.crossings || []).map(c => {
    if (c.kind === 'bridge') {
      const n = brook.at(c.x, c.z), w = n.w, span = w + 2.4, dir = c.dir || [1, 0], a = [c.x - dir[0] * span / 2, c.z - dir[1] * span / 2], e = [c.x + dir[0] * span / 2, c.z + dir[1] * span / 2];
      return {...c, span, width: 1.3, a, b: e, top: .5};
    }
    // The log lies across the brook where the authored line meets it, root plate on the west bank.
    let bi = 0, bd = Infinity; brook.samples.forEach((p, i) => { const d = Math.abs(p.z - c.z); if (d < bd) { bd = d; bi = i; } });
    const t = bi / brook.N, p = brook.samples[bi], q = brook.samples[Math.min(brook.N, bi + 3)], o = brook.samples[Math.max(0, bi - 3)];
    const dx = q.x - o.x, dz = q.z - o.z, l = Math.hypot(dx, dz), side = [-dz / l, dx / l], half = brook.width(t) / 2 + 1.5;
    const s = side[0] < 0 ? -1 : 1, a = [p.x - side[0] * half * s, p.z - side[1] * half * s], e = [p.x + side[0] * half * 1.05 * s, p.z + side[1] * half * 1.05 * s];
    return {...c, a, b: e, width: .8, ya: region.ground(...a) + .3, yb: region.ground(...e) + .24, radius: .34};
  });
  // How far along a crossing (0..1) a point is, and whether it is on its walkway.
  const onCrossing = (x, z) => {
    for (const c of region.crossings) { const s = segmentDistance(x, z, c.a[0], c.a[1], c.b[0], c.b[1]); if (s.d < c.width / 2 && s.t > 0 && s.t < 1) return {c, t: s.t}; }
    return null;
  };
  region.deck = (c, t) => c.kind === 'bridge' ? .5 * Math.sin(Math.PI * t) + lerp(region.ground(...c.a), region.ground(...c.b), t) * (1 - Math.sin(Math.PI * t)) : lerp(c.ya, c.yb, t) - Math.sin(t * Math.PI) * .06 + c.radius * (1 - t * .28) * .92;
  region.inWater = (x, z) => { if (!brook) return false; const n = brook.at(x, z); return !!n && n.d < n.w / 2 + .45 && !onCrossing(x, z); };
  region.groundY = (x, z) => {
    const on = onCrossing(x, z); if (on) return region.deck(on.c, on.t);
    // little ramps onto the log ends
    for (const c of region.crossings) if (c.kind === 'log') for (const [end, y] of [[c.a, c.ya], [c.b, c.yb]]) { const d = Math.hypot(x - end[0], z - end[1]); if (d < .7) { const s = segmentDistance(x, z, c.a[0], c.a[1], c.b[0], c.b[1]); if (s.d < c.width / 2 + .1) return lerp(region.deck(c, end === c.a ? 0 : 1), region.ground(x, z), sstep(0, .7, d)); } }
    return region.ground(x, z);
  };

  /* ---------- colliders in a spatial hash ---------- */
  const solids = (data.solids || []).map(([x, z, r]) => ({x, z, r})), hash = new Map(), cell = 4, key = (i, j) => i * 65536 + j;
  for (const s of solids) for (let i = Math.floor((s.x - s.r - .3) / cell); i <= Math.floor((s.x + s.r + .3) / cell); i++) for (let j = Math.floor((s.z - s.r - .3) / cell); j <= Math.floor((s.z + s.r + .3) / cell); j++) (hash.get(key(i, j)) || hash.set(key(i, j), []).get(key(i, j))).push(s);
  region.solids = solids;
  region.blocked = (x, z, pad = .25) => { const list = hash.get(key(Math.floor(x / cell), Math.floor(z / cell))); return !!list && list.some(s => Math.hypot(x - s.x, z - s.z) <= s.r + pad); };
  const inCorridor = (x, z) => (data.corridors || []).some(c => segmentDistance(x, z, c[0][0], c[0][1], c[1][0], c[1][1]).d < (c[2] || 1.4));
  region.walkable = (x, z) => (Math.hypot(x - clearing.x, z - clearing.z) < clearing.r || inCorridor(x, z)) && !region.inWater(x, z) && !region.blocked(x, z);
  region.inside = (x, z) => x >= b.x0 && x < b.x1 && z >= b.z0 && z < b.z1;

  /* ---------- the region's trees (fixed ones are colliders; the rest fill the wild ground) ---------- */
  region.trees = (data.trees || []).map(([x, z, s, opts]) => ({x, z, r: .55 + .25 * (s - 1), s, fixed: true, ...opts}));
  {
    const want = Math.round((b.x1 - b.x0) * (b.z1 - b.z0) * (data.treeDensity ?? .0105));
    let filler = 0;
    for (let tries = 0; tries < want * 90 && filler < want; tries++) {
      const x = b.x0 + 2 + seeded() * (b.x1 - b.x0 - 4), z = b.z0 + 2 + seeded() * (b.z1 - b.z0 - 4);
      if (Math.hypot(x - clearing.x, z - clearing.z) < clearing.r + 2.5) continue;
      if (inCorridor(x, z) || (data.keepClear || []).some(k => Math.hypot(x - k.x, z - k.z) < k.r)) continue;
      const bk = brook && brook.at(x, z), pa = region.pathAt(x, z);
      if ((bk && bk.d < bk.w / 2 + 2.6) || pa.d < pa.w / 2 + 2.2) continue;
      if (region.trees.some(t => Math.hypot(t.x - x, t.z - z) < (t.fixed ? 5 : 6))) continue;
      region.trees.push({x, z, r: .55 + seeded() * .3, s: 1, fixed: false}); filler++;
    }
  }
  return region;
}
