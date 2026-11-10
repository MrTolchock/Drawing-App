/* The world graph (blueprint 7A): regions with their offsets and the paths that join them.
   Today the world is region `home` only. `?world=10x` (development only, separate save) adds nine
   placeholder regions laid out as in the "World ×10" mockup, generated from the home decoration rules
   with different seeds and joined by paths, to prove the per-frame budget before new content exists. */
import {THREE} from '../../forest/materials.js';
import {createRegion, baseGround} from './region.js';
import {home} from './regions/home.js';
import {fbm, sstep} from './noise.js';
import {TILE} from './tiles.js';
import {createBigWorld, BIG_ROUTE} from './big/index.js';
import {buildBigTile} from './big/tiles.js';
import {siteSteps} from './big/sites.js';

// The big world is the game's world; `?world=home` still opens the old clearing (to be removed).
export const WORLD_MODE = new URLSearchParams(location.search).get('world') === 'home' ? 'home' : '10x';

/** The fixed walk used by the budget test (the big world's own route). */
export const TEST_ROUTE = BIG_ROUTE;

export function createWorld(mode = WORLD_MODE) {
  if (mode === '10x') return Object.assign(createBigWorld(), {buildTile: buildBigTile, landmarkSteps: siteSteps});
  const sunDir = new THREE.Vector3(-.55, .62, -.56).normalize();
  const fog = {color: new THREE.Color('#e8dcae'), near: 24, far: 72, sunDir};
  const data = [home()];
  const links = [];
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
  world.wild = null;
  return world;
}
