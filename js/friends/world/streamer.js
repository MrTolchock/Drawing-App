/* Tile streaming (blueprint 7A): tiles enter and leave the near ring (tile centre ≤ 40 m from Fuchs) and
   the far ring (40–68 m; beyond that the haze is over 90 % and the horizon band takes over, which keeps
   the far ring within 40 tiles) as Fuchs moves. Building is time-sliced, tiles ahead of Fuchs are built
   first, freed tiles dispose their geometry and the last 8 freed tiles are kept for quick returns.
   Materials and textures are shared and never disposed. Region landmarks load with their region. */
import {THREE} from '../../forest/materials.js';
import {templates, TILE} from './tiles.js';

export const NEAR = 40, FAR = 64, SLACK = 2;
const centreDistance = (x, z, i, j) => Math.hypot((i + .5) * TILE - x, (j + .5) * TILE - z);

export function createStreamer(world, look, scene, options = {}) {
  let onSlice = options.onSlice || (() => {});
  // The world brings its tile builder and landmark sites (world/big/).
  const build = world.buildTile, marks = world.landmarkSteps;
  const all = world.tiles(), live = new Map(), cache = [], jobs = [], regionGroups = new Map(), landmarks = {};
  const root = new THREE.Group(); root.name = 'world'; scene.add(root);
  let lookSteps = [...look.steps, () => templates()], focus = {x: 0, z: 0, ahead: {x: 0, z: 0}}, planned = null;
  const key = (i, j, ring) => i + ',' + j + ',' + ring;
  function dispose(group) { group.traverse(o => { if (o.isMesh || o.isPoints) { if (!o.userData.shared) o.geometry.dispose(); if (o.isInstancedMesh) o.dispose(); } }); group.removeFromParent(); }
  function release(entry) {
    entry.group.visible = false; cache.push(entry);
    while (cache.length > 8) dispose(cache.shift().group);
  }
  function want() {
    const out = new Map(), {x, z, ahead} = focus, building = new Map(jobs.map(b => [b.i + ',' + b.j, b.ring]));
    for (const [i, j] of all) {
      const d = centreDistance(x, z, i, j), priority = Math.min(d, centreDistance(ahead.x, ahead.z, i, j));
      // Hysteresis also holds for a tile still being built, so a job is not dropped and restarted at a ring edge.
      const current = building.get(i + ',' + j) || live.get(i + ',' + j)?.ring;
      const nearLimit = current === 'near' ? NEAR + SLACK : NEAR, farLimit = current ? FAR + SLACK : FAR;
      if (d < nearLimit) out.set(i + ',' + j, {i, j, ring: 'near', d: priority}); else if (d < farLimit) out.set(i + ',' + j, {i, j, ring: 'far', d: priority});
    }
    return out;
  }
  function schedule() {
    const wanted = want();
    // drop tiles that left both rings, and stale jobs
    for (const [k, entry] of live) if (!wanted.has(k)) { live.delete(k); release(entry); }
    for (let n = jobs.length - 1; n >= 0; n--) { const w = wanted.get(jobs[n].i + ',' + jobs[n].j); if (!w || w.ring !== jobs[n].ring) jobs.splice(n, 1); }
    for (const [k, w] of wanted) {
      const entry = live.get(k);
      if (entry && entry.ring === w.ring) continue;
      const waiting = jobs.find(j => j.i === w.i && j.j === w.j && j.ring === w.ring);
      if (waiting) { waiting.d = entry ? w.d : w.d - 24; continue; }   // priorities follow Fuchs
      const hit = cache.findIndex(c => c.key === key(w.i, w.j, w.ring));
      if (hit >= 0) { const c = cache.splice(hit, 1)[0]; c.group.visible = true; if (entry) release(entry); live.set(k, c); continue; }
      // a near tile that only needs its cheap far version is swapped first: it frees a full-detail tile
      // (a tile with nothing drawn yet counts as 24 m closer: a hole in the ground shows more than missing detail)
      jobs.push({...w, d: entry ? w.d : w.d - 24, it: build(world, look, w.i, w.j, w.ring), next: 'tile start', swap: w.ring === 'far' && entry?.ring === 'near'});
    }
    jobs.sort((a, b) => (b.swap ? 1 : 0) - (a.swap ? 1 : 0) || a.d - b.d);
    // landmarks of regions within the near ring
    for (const region of world.regions) {
      const b = region.bounds, d = Math.hypot(Math.max(b.x0 - focus.x, 0, focus.x - b.x1), Math.max(b.z0 - focus.z, 0, focus.z - b.z1));
      if (d < NEAR && !regionGroups.has(region.id)) { const g = new THREE.Group(); g.name = 'landmarks ' + region.id; root.add(g); const out = {}; regionGroups.set(region.id, {g, steps: marks(region, look, world, g, out), out}); landmarks[region.id] = out; }
    }
  }
  /* Build in slices of at most `budget` ms. Before each step the streamer predicts its cost from steps of
     the same kind (tile generators yield the name of the step that follows): 1.5 × their moving average, or
     their recent peak (decaying) when that is higher, since some kinds vary with the tile (trees, grass).
     A step expected to overrun the slice waits for the next frame. */
  const costs = new Map();
  const expected = kind => { const c = costs.get(kind); return c ? Math.max(c.avg * 1.5, c.peak) : 1; };
  const room = (t0, budget, first, kind) => first || performance.now() - t0 + expected(kind) <= budget;
  const timed = (kind, fn) => { const s = performance.now(), v = fn(), ms = performance.now() - s; const c = costs.get(kind); if (c) { c.avg = c.avg * .7 + ms * .3; c.peak = Math.max(ms, c.peak * .8); } else costs.set(kind, {avg: ms, peak: ms}); return v; };
  /** Spend up to `budget` ms building. Returns true while work remains. */
  function work(budget) {
    const t0 = performance.now(); let first = true;
    while (lookSteps.length && room(t0, budget, first, 'look')) { timed('look', lookSteps.shift()); first = false; }
    // Nothing is built before the shared textures and materials exist: a mesh made earlier would get
    // three.js' default white material (this once turned the den tree white).
    if (lookSteps.length) { if (!first) onSlice(performance.now() - t0); return true; }
    for (const r of regionGroups.values()) while (r.steps.length && room(t0, budget, first, 'landmark')) { timed('landmark', r.steps.shift()); first = false; }
    while (jobs.length && room(t0, budget, first, jobs[0].next)) {
      first = false; const job = jobs[0], step = timed(job.next, () => job.it.next());
      if (!step.done) { job.next = step.value || 'step'; continue; }
      jobs.shift(); const k = job.i + ',' + job.j, old = live.get(k), group = step.value;
      root.add(group); live.set(k, {key: key(job.i, job.j, job.ring), ring: job.ring, group}); if (old) release(old);
    }
    if (!first) onSlice(performance.now() - t0);   // only frames that built something count as slices
    return pending();
  }
  const pending = () => lookSteps.length > 0 || jobs.length > 0 || [...regionGroups.values()].some(r => r.steps.length);
  return {
    root, landmarks,
    /** Where Fuchs is and where he is heading (tiles ahead are built first). */
    focus(x, z, ax = x, az = z) {
      // Compared with the place of the last plan, not with the previous frame: a steady walk moves a few
      // centimetres per frame and would otherwise never ask for new tiles.
      focus = {x, z, ahead: {x: ax, z: az}};
      if (!planned || !live.size || Math.hypot(x - planned.x, z - planned.z) > 2 || Math.hypot(ax - x - planned.ax, az - z - planned.az) > 4) { planned = {x, z, ax: ax - x, az: az - z}; schedule(); }
    },
    work, pending,
    /** Finish everything now (used when Fuchs steps outside before the slices are done). */
    complete() { const t0 = performance.now(), report = onSlice; onSlice = () => {}; while (work(1e9)); onSlice = report; return performance.now() - t0; },
    get counts() { let near = 0, far = 0; for (const e of live.values()) e.ring === 'near' ? near++ : far++; return {near, far, jobs: jobs.length}; },
    /** How far streaming is behind at Fuchs' place: tiles well inside the far ring with nothing drawn (holes) and tiles
        within `inner` m still without their full version (plain ground). Both are 0 when streaming keeps up. */
    gaps(inner = NEAR - TILE) { let holes = 0, plain = 0; for (const [i, j] of all) { const d = centreDistance(focus.x, focus.z, i, j), e = live.get(i + ',' + j); if (d < FAR - TILE / 2 && !e) holes++; if (d < inner && e?.ring !== 'near') plain++; } return {holes, plain}; },
    terrain() { const out = []; for (const e of live.values()) if (e.ring === 'near') e.group.traverse(o => { if (o.userData.terrain) out.push(o); }); return out; },
  };
}
