/* The world graph (blueprint 7A): regions with their offsets and the paths that join them.
   Today the world is region `home` only. `?world=10x` (development only, separate save) adds nine
   placeholder regions laid out as in the "World ×10" mockup, generated from the home decoration rules
   with different seeds and joined by paths, to prove the per-frame budget before new content exists. */
import {THREE} from '../../forest/materials.js';
import {createRegion, baseGround} from './region.js';
import {home} from './regions/home.js';
import {fbm, sstep} from './noise.js';
import {TILE} from './tiles.js';

export const WORLD_MODE = new URLSearchParams(location.search).get('world') === '10x' ? '10x' : 'home';

// Mockup positions (map scale 1 m = 3.2 px around the Heimatlichtung), scaled ×1.5 so no region overlaps home.
const PLACEHOLDERS = [['r2', -117, -56], ['r3', 112, -51], ['r4', -70, 75], ['r5', 117, 70], ['r6', -150, 13], ['r7', 0, -84], ['r8', 159, 13], ['r9', 13, 99], ['r10', 54, -87]];
// Paths between regions, as polylines (home's east paths leave over the log bridge and the arched bridge).
const LINKS = [
  ['home', 'r2', [[-6, -10], [-30, -20], [-117, -56]]], ['home', 'r3', [[13.4, -9.6], [24, -16], [112, -51]]], ['home', 'r4', [[-2, 8], [-26, 26], [-70, 75]]],
  ['home', 'r5', [[19.5, 1], [30, 12], [117, 70]]], ['home', 'r7', [[-4, -14], [-6, -30], [0, -84]]], ['home', 'r9', [[2, 12], [6, 34], [13, 99]]],
  ['r2', 'r6', [[-117, -56], [-150, 13]]], ['r3', 'r8', [[112, -51], [159, 13]]], ['r3', 'r10', [[112, -51], [54, -87]]], ['r5', 'r8', [[117, 70], [159, 13]]], ['r4', 'r6', [[-70, 75], [-150, 13]]], ['r7', 'r10', [[0, -84], [54, -87]]],
];
/** The fixed walk through all ten regions used by the budget test. */
export const TEST_ROUTE = [[2, -2], [8.8, -9.4], [13.4, -9.6], [24, -16], [112, -51], [54, -87], [0, -84], [-6, -30], [-4, -14], [-6, -10], [-30, -20], [-117, -56], [-150, 13], [-70, 75], [-26, 26], [-2, 8], [2, 12], [6, 34], [13, 99]];

function placeholder(id, cx, cz, k, links) {
  const corridors = links.filter(([a, b]) => a === id || b === id).flatMap(([, , pts]) => pts.slice(1).map((p, i) => [pts[i], p, 1.4]));
  return {
    id, origin: [cx, cz], seed: 1000 + k * 7919, bounds: {x0: cx - 20, x1: cx + 20, z0: cz - 20, z1: cz + 20},
    clearing: {x: cx, z: cz, r: 11}, places: {}, friends: {}, corridors,
    trails: corridors.map(([a, b]) => ({pts: [a, [(a[0] + b[0]) / 2 + 1.5, (a[1] + b[1]) / 2 - 1], b], w: .9})),
    solids: [], trees: [], rocks: [], landmarks: [], treeDensity: .012,
    hills: (x, z) => sstep(10, 20, Math.hypot(x - cx, z - cz)) * (1 + fbm(x * .05 + k, z * .05) * 1.5),
    neighbours: ['n', 's', 'e', 'w'],
  };
}

export function createWorld(mode = WORLD_MODE) {
  const sunDir = new THREE.Vector3(-.55, .62, -.56).normalize();
  const fog = {color: new THREE.Color('#e8dcae'), near: 24, far: 72, sunDir};
  const data = [home()];
  let links = [];
  if (mode === '10x') {
    links = LINKS;
    data[0].corridors = LINKS.filter(([a, b]) => a === 'home' || b === 'home').flatMap(([, , pts]) => pts.slice(1).map((p, i) => [pts[i], p, 1.4]));
    data[0].neighbours = ['n', 's', 'e', 'w'];
    PLACEHOLDERS.forEach(([id, x, z], k) => data.push(placeholder(id, x, z, k + 1, LINKS)));
  }
  const regions = data.map(createRegion);
  // Between regions: wild forest on the shared base ground, walkable only along the paths.
  const segments = links.flatMap(([, , pts]) => pts.slice(1).map((p, i) => [pts[i], p]));
  const segDist = (x, z, [[ax, az], [bx, bz]]) => { const dx = bx - ax, dz = bz - az, t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz))); return Math.hypot(x - ax - dx * t, z - az - dz * t); };
  const linkDistance = (x, z) => segments.reduce((m, s) => Math.min(m, segDist(x, z, s)), Infinity);
  const regionAt = (x, z) => { for (const r of regions) if (r.inside(x, z)) return r; return null; };
  const regionDistance = (x, z) => regions.reduce((m, r) => { const b = r.bounds; return Math.min(m, Math.hypot(Math.max(b.x0 - x, 0, x - b.x1), Math.max(b.z0 - z, 0, z - b.z1))); }, Infinity);
  const C = h => new THREE.Color(h), meadow = C('#6a9534'), meadowB = C('#86ad45'), earth = C('#b77a49');
  const world = {
    mode, regions, sunDir, fog, links, segments, regionAt, linkDistance,
    ground(x, z) { const r = regionAt(x, z); if (r) return r.ground(x, z); const d = linkDistance(x, z), edge = regionDistance(x, z); return baseGround(x, z) + sstep(6, 16, d) * sstep(0, 8, edge) * fbm(x * .04, z * .04) * 2 - (d < .6 ? .04 : 0); },
    groundY(x, z) { const r = regionAt(x, z); return r ? r.groundY(x, z) : world.ground(x, z); },
    normal(x, z, out) { const e = .25, hx = world.ground(x + e, z) - world.ground(x - e, z), hz = world.ground(x, z + e) - world.ground(x, z - e); return out.set(-hx / (2 * e), 1, -hz / (2 * e)).normalize(); },
    colour(x, z, out) { const d = linkDistance(x, z); out.copy(meadow).lerp(meadowB, fbm(x * .18, z * .18)); if (d < .7) out.lerp(earth, sstep(.7, .3, d)); return out; },
    walkable(x, z) { const r = regionAt(x, z); if (r) return r.walkable(x, z); return linkDistance(x, z) < 1.4; },
    places: Object.assign({}, ...regions.map(r => r.places || {})),
    home: regions[0],
    /** Every tile key the world has: tiles over regions, and (10×) over the wild ground along paths. */
    tiles() {
      const keys = new Set(), add = (i, j) => keys.add(i + ',' + j);
      for (const r of regions) for (let i = Math.floor(r.bounds.x0 / TILE); i < Math.ceil(r.bounds.x1 / TILE); i++) for (let j = Math.floor(r.bounds.z0 / TILE); j < Math.ceil(r.bounds.z1 / TILE); j++) add(i, j);
      for (const [[ax, az], [bx, bz]] of segments) { const n = Math.ceil(Math.hypot(bx - ax, bz - az) / 4); for (let k = 0; k <= n; k++) { const x = ax + (bx - ax) * k / n, z = az + (bz - az) * k / n; for (let di = -1; di <= 1; di++) for (let dj = -1; dj <= 1; dj++) add(Math.floor(x / TILE) + di, Math.floor(z / TILE) + dj); } }
      return [...keys].map(k => k.split(',').map(Number));
    },
  };
  // The wild forest between regions: trees and grass scattered per tile, away from the paths.
  world.wild = mode === '10x' ? {
    id: 'wild', seed: 4242, trees: [], decoration: {grass: 1.2, ferns: .1, flowers: .03, clover: .05, rocks: .01},
    treeAt: (x, z) => linkDistance(x, z) > 3.5,
  } : null;
  return world;
}
