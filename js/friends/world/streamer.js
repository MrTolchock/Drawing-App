/* Tile streaming (blueprint 7A): tiles enter and leave the near (≤ 40 m) and far (40–80 m) rings as
   Fuchs moves. Building is time-sliced (a few ms per frame) and starts ahead of Fuchs; freed tiles
   dispose their geometry, and the last 8 freed tiles are kept for quick returns. Materials and
   textures are shared and never disposed. Region landmarks load with their region. */
import {THREE} from '../../forest/materials.js';
import {buildTile, templates, TILE} from './tiles.js';
import {landmarkSteps} from './landmarks.js';

export const NEAR = 40, FAR = 80, SLACK = 4;
const rectDistance = (x, z, i, j) => { const dx = Math.max(i * TILE - x, 0, x - (i + 1) * TILE), dz = Math.max(j * TILE - z, 0, z - (j + 1) * TILE); return Math.hypot(dx, dz); };

export function createStreamer(world, look, scene, options = {}) {
  let onSlice = options.onSlice || (() => {});
  const all = world.tiles(), live = new Map(), cache = [], jobs = [], regionGroups = new Map(), landmarks = {};
  const root = new THREE.Group(); root.name = 'world'; scene.add(root);
  let lookSteps = [...look.steps, () => templates()], focus = {x: 0, z: 0, ahead: {x: 0, z: 0}};
  const key = (i, j, ring) => i + ',' + j + ',' + ring;
  function dispose(group) { group.traverse(o => { if (o.isMesh || o.isPoints) { if (!o.userData.shared) o.geometry.dispose(); if (o.isInstancedMesh) o.dispose(); } }); group.removeFromParent(); }
  function release(entry) {
    entry.group.visible = false; cache.push(entry);
    while (cache.length > 8) dispose(cache.shift().group);
  }
  function want() {
    const out = new Map(), {x, z, ahead} = focus;
    for (const [i, j] of all) {
      const d = Math.min(rectDistance(x, z, i, j), rectDistance(ahead.x, ahead.z, i, j) + 8);
      const current = live.get(i + ',' + j)?.ring;
      const nearLimit = current === 'near' ? NEAR + SLACK : NEAR, farLimit = current ? FAR + SLACK : FAR;
      if (d < nearLimit) out.set(i + ',' + j, {i, j, ring: 'near', d}); else if (d < farLimit) out.set(i + ',' + j, {i, j, ring: 'far', d});
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
      if (jobs.some(j => j.i === w.i && j.j === w.j && j.ring === w.ring)) continue;
      const hit = cache.findIndex(c => c.key === key(w.i, w.j, w.ring));
      if (hit >= 0) { const c = cache.splice(hit, 1)[0]; c.group.visible = true; if (entry) release(entry); live.set(k, c); continue; }
      jobs.push({...w, it: buildTile(world, look, w.i, w.j, w.ring)});
    }
    jobs.sort((a, b) => (a.ring === b.ring ? 0 : a.ring === 'near' ? -1 : 1) || a.d - b.d);
    // landmarks of regions within the near ring
    for (const region of world.regions) {
      const b = region.bounds, d = Math.hypot(Math.max(b.x0 - focus.x, 0, focus.x - b.x1), Math.max(b.z0 - focus.z, 0, focus.z - b.z1));
      if (d < NEAR && !regionGroups.has(region.id)) { const g = new THREE.Group(); g.name = 'landmarks ' + region.id; root.add(g); const out = {}; regionGroups.set(region.id, {g, steps: landmarkSteps(region, look, world, g, out), out}); landmarks[region.id] = out; }
    }
  }
  /** Spend up to `budget` ms building. Returns true while work remains. */
  function work(budget) {
    const t0 = performance.now();
    while (lookSteps.length) { lookSteps.shift()(); if (performance.now() - t0 > budget) return finish(t0); }
    for (const r of regionGroups.values()) while (r.steps.length) { r.steps.shift()(); if (performance.now() - t0 > budget) return finish(t0); }
    while (jobs.length) {
      const job = jobs[0], step = job.it.next();
      if (step.done) {
        jobs.shift(); const k = job.i + ',' + job.j, old = live.get(k), group = step.value;
        root.add(group); live.set(k, {key: key(job.i, job.j, job.ring), ring: job.ring, group}); if (old) release(old);
      }
      if (performance.now() - t0 > budget) return finish(t0);
    }
    return finish(t0);
  }
  function finish(t0) { onSlice(performance.now() - t0); return pending(); }
  const pending = () => lookSteps.length > 0 || jobs.length > 0 || [...regionGroups.values()].some(r => r.steps.length);
  return {
    root, landmarks,
    /** Where Fuchs is and where he is heading (tiles ahead are built first). */
    focus(x, z, ax = x, az = z) { const moved = Math.hypot(x - focus.x, z - focus.z) > 2 || Math.hypot(ax - focus.ahead.x, az - focus.ahead.z) > 4; focus = {x, z, ahead: {x: ax, z: az}}; if (moved || !live.size) schedule(); },
    work, pending,
    /** Finish everything now (used when Fuchs steps outside before the slices are done). */
    complete() { const t0 = performance.now(), report = onSlice; onSlice = () => {}; while (work(1e9)); onSlice = report; return performance.now() - t0; },
    get counts() { let near = 0, far = 0; for (const e of live.values()) e.ring === 'near' ? near++ : far++; return {near, far, jobs: jobs.length}; },
    terrain() { const out = []; for (const e of live.values()) if (e.ring === 'near') e.group.traverse(o => { if (o.userData.terrain) out.push(o); }); return out; },
  };
}
