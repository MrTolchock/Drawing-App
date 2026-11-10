/* The big world (design/world-10x/PLAN.md): one continuous landscape, 256 × 224 m, with the den in
   the middle. This module puts the pieces together: the terrain functions, the trees (one possible
   tree per 6 m cell, decided by the habitat), colliders, where Fuchs can walk, the path search, and
   the places and characters. Tiles and landmarks are built from it on demand (tiles.js, sites.js). */
import {THREE} from '../../../forest/materials.js';
import {rng, tileSeed, sstep} from '../noise.js';
import {TILE} from '../tiles.js';
import {createTerrain} from './terrain.js';
import {createNav} from './nav.js';
import * as L from './layout.js';

const SEED = 20261110, CELL = 6;

export function createBigWorld() {
  const T = createTerrain(), E = L.EXTENT;
  const sunDir = new THREE.Vector3(-.55, .62, -.56).normalize();
  const fog = {color: new THREE.Color('#e8dcae'), near: 24, far: 72, sunDir};

  /* ---------- colliders that are placed by hand ---------- */
  const solids = [...L.SOLIDS.map(([x, z, r]) => ({x, z, r})), ...L.ROCKS.map(([x, z, s]) => ({x, z, r: s * .95})), ...L.TREES.map(([x, z, s]) => ({x, z, r: .55 + .25 * (s - 1)}))];
  const hash = new Map(), HC = 4, hkey = (i, j) => i * 65536 + j;
  for (const s of solids) for (let i = Math.floor((s.x - s.r - 1) / HC); i <= Math.floor((s.x + s.r + 1) / HC); i++) for (let j = Math.floor((s.z - s.r - 1) / HC); j <= Math.floor((s.z + s.r + 1) / HC); j++) (hash.get(hkey(i, j)) || hash.set(hkey(i, j), []).get(hkey(i, j))).push(s);
  // Trees keep away from everything a child should reach or see.
  const keepClear = [...Object.values(L.PLACES).map(p => [p.x, p.z, 2.4]), ...Object.values({...L.FRIENDS, ...L.NEIGHBOURS}).map(f => [...f.at, 2.2]), ...L.TREES.map(([x, z, s]) => [x, z, 4.5 + s]), ...L.ROCKS.map(([x, z, s]) => [x, z, s + 1.2]),
    ...T.crossings.flatMap(c => [[...c.a, 2.2], [...c.b, 2.2]]), [L.DEN.x, L.DEN.z, 9], [...T.falls.lip, 5]];

  /* ---------- trees: at most one per 6 m cell ---------- */
  const cells = new Map(), bm = {}, authored = L.TREES.map(([x, z, s, o = {}]) => ({x, z, s, r: .55 + .25 * (s - 1), kind: o.kind || 'beech', fixed: true, ...o}));
  function cellTree(ci, cj) {
    const key = ci * 4096 + cj; let t = cells.get(key); if (t !== undefined) return t;
    const R = rng(tileSeed(SEED, ci, cj)), x = ci * CELL + 1.2 + R() * 3.6, z = cj * CELL + 1.2 + R() * 3.6, pick = R(), kindRoll = R(), sizeRoll = R();
    t = null;
    if (x > E.x0 + 1 && x < E.x1 - 1 && z > E.z0 + 1 && z < E.z1 - 1) {
      const b = T.biome(x, z, bm), rim = sstep(12, 4, T.edge(x, z));
      let p = .36 + .26 * b.spruce + .14 * b.birch; p *= (1 - .97 * b.meadow) * (1 - .78 * b.swamp) * (1 - .88 * b.rock); p = Math.max(p, rim * .72); if (b.glade > .3) p = 0;
      if (pick < p && !keepClear.some(([kx, kz, kr]) => Math.hypot(x - kx, z - kz) < kr)) {
        const st = T.streamAt(x, z), nearWater = st.d < st.w / 2 + 2.5 || T.stillDepth(x, z) > -.3, pa = T.pathAt(x, z);
        if (!nearWater && pa.d > pa.w / 2 + 1.9 && T.slope(x, z) < .8 && !T.onCrossing(x, z)) {
          const kind = b.swamp > .4 ? (kindRoll < .55 ? 'snag' : 'alder') : kindRoll < b.spruce * .92 || (b.rock > .4 && kindRoll < .8) ? 'spruce' : kindRoll < b.birch * .85 ? 'birch' : 'beech';
          const r = {beech: .55 + sizeRoll * .3, birch: .2 + sizeRoll * .1, spruce: .3 + sizeRoll * .16, snag: .26 + sizeRoll * .14, alder: .3 + sizeRoll * .12}[kind];
          t = {x, z, r, s: kind === 'beech' ? 1 : .8 + sizeRoll * .3, kind, fixed: false};
        }
      }
    }
    cells.set(key, t); return t;
  }
  /** The trees standing in a tile. */
  function treesIn(i, j) {
    const x0 = i * TILE, z0 = j * TILE, out = authored.filter(t => t.x >= x0 && t.x < x0 + TILE && t.z >= z0 && t.z < z0 + TILE);
    for (let ci = Math.floor(x0 / CELL); ci <= Math.floor((x0 + TILE) / CELL); ci++) for (let cj = Math.floor(z0 / CELL); cj <= Math.floor((z0 + TILE) / CELL); cj++) { const t = cellTree(ci, cj); if (t && t.x >= x0 && t.x < x0 + TILE && t.z >= z0 && t.z < z0 + TILE) out.push(t); }
    return out;
  }
  function blocked(x, z, pad = .25) {
    const list = hash.get(hkey(Math.floor(x / HC), Math.floor(z / HC)));
    if (list) for (const s of list) if (Math.hypot(x - s.x, z - s.z) <= s.r + pad) return true;
    const ci = Math.floor(x / CELL), cj = Math.floor(z / CELL);
    for (let a = ci - 1; a <= ci + 1; a++) for (let c = cj - 1; c <= cj + 1; c++) { const t = cellTree(a, c); if (t && Math.hypot(x - t.x, z - t.z) <= t.r * 1.1 + pad) return true; }
    return false;
  }

  /* ---------- where Fuchs can walk ---------- */
  const dam = T.dam;
  function walkable(x, z, pad = .25) {
    if (T.edge(x, z) < 9 || blocked(x, z, pad)) return false;
    if (T.onCrossing(x, z)) return true;
    if (T.wet(x, z)) return false;
    // cliffs: only the Rock and the dam's flanks are steep enough to matter
    if (T.rock(x, z).d > -15 || (Math.abs(x - dam.a[0]) < 12 && Math.abs(z - dam.a[1]) < 12)) return T.slope(x, z) < 1.05;
    return true;
  }
  const nav = createNav({extent: E, walkable, crossings: T.crossings});

  /* ---------- named areas (for the save and, later, the map) ---------- */
  const areas = L.SITES.filter(s => s.id !== 'friends' && s.id !== 'crossings');
  function regionAt(x, z) {
    if (x < E.x0 || x >= E.x1 || z < E.z0 || z >= E.z1) return null;
    let best = null, bd = Infinity; for (const s of areas) { const d = Math.hypot(x - s.x, z - s.z) - s.r; if (d < bd) { bd = d; best = s; } }
    return {id: bd < 6 ? best.id : 'forest'};
  }
  const places = Object.fromEntries(Object.entries(L.PLACES).map(([id, p]) => [id, {...p}]));
  const stand = f => ({...f, y: f.onWater ? T.stillLevel(...f.at) - T.ground(...f.at) + f.y : f.y});
  const friends = Object.fromEntries(Object.entries(L.FRIENDS).map(([id, f]) => [id, stand(f)])), neighbours = Object.fromEntries(Object.entries(L.NEIGHBOURS).map(([id, f]) => [id, stand(f)]));
  const pins = Object.fromEntries([['home', [L.DEN.x, 3.75, L.DEN.z + 2.7]], ...Object.entries(friends).map(([id, f]) => [id, [f.at[0], f.y + f.h + .55, f.at[1]]])]);

  const world = {
    mode: '10x', big: true, terrain: T, layout: L, sunDir, fog, extent: E,
    // landmark sites take the place of regions for the streamer
    regions: L.SITES.map(s => ({...s, bounds: {x0: s.x - s.r, x1: s.x + s.r, z0: s.z - s.r, z1: s.z + s.r}})),
    regionAt, ground: T.ground, groundY: T.groundY, walkable, blocked, treesIn, places, friends, neighbours, pins,
    home: {home: {...L.DEN}, id: 'home'}, nav,
    /** A route between two points as [[x, z], …], or null. */
    plan: (ax, az, bx, bz) => nav.plan(ax, az, bx, bz),
    tiles() { const out = []; for (let i = E.x0 / TILE; i < E.x1 / TILE; i++) for (let j = E.z0 / TILE; j < E.z1 / TILE; j++) out.push([i, j]); return out; },
    allTrees() { const out = []; for (const [i, j] of world.tiles()) out.push(...treesIn(i, j)); return out; },
  };
  return world;
}

/** The fixed walk used by the budget test: from the den to every corner of the map. */
export const BIG_ROUTE = [[2, -2], [10.9, -3], [15.1, -3], [23.2, -15.5], [51, -46.5], [42.5, -77], [72.5, -62.5], [47, -82.5], [-25, -50], [-29.5, -59], [-72, -6], [-79, -10.5], [-57, 51.5], [-8.5, 57], [-13, 65.5], [-28.5, 84], [-11.5, 63], [.2, 64.4], [51, 42.5], [84.5, -4.5], [30, 14], [2, -2]];
