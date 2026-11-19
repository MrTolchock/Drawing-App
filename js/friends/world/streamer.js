/* Tile streaming (blueprint 7A): tiles enter and leave the near ring and the far ring as Fuchs moves. The camera always
   looks north from behind Fuchs, so both rings are shaped by what it can see. The near ring (full detail) is everything
   within CORE m of Fuchs and, ahead of him, the ground in the camera's view out to REACH m: a wedge as wide as the
   picture (`setView` near), from NEAR_BACK m behind Fuchs. The far ring holds the tiles in a wider wedge out to where the
   haze has (almost) covered the ground. So the detail reaches well past the top of the picture, and no full-detail tile
   is built behind the camera where nothing of it would be seen.
   Building is time-sliced, tiles in view ahead of Fuchs are built first, freed tiles dispose their geometry and the last
   8 freed tiles are kept for quick returns. A tile that appears, changes its detail (near ↔ far) or leaves dissolves
   (fade.js) instead of popping; landmarks are built hidden and dissolve in once they are complete and their shaders
   compiled (`prepare`). Materials and textures are shared and never disposed. Region landmarks load with their region. */
import {THREE} from '../../scene/materials.js';
import {templates, TILE} from './tiles.js';

// NEAR: characters are drawn and region landmarks built within it (and the near ring is round before the view is known)
export const NEAR = 40, FAR = 64, SLACK = 2;
const CORE = 22, REACH = 50, NEAR_BACK = 20, VIEW_AHEAD = 14;
const centreDistance = (x, z, i, j) => Math.hypot((i + .5) * TILE - x, (j + .5) * TILE - z);

export function createStreamer(world, look, scene, options = {}) {
  let onSlice = options.onSlice || (() => {});
  const fades = options.fades || null, onChange = options.onChange || (() => {}), prepare = options.prepare || null;
  // The world brings its tile builder and landmark sites (world/big/).
  const build = world.buildTile, marks = world.landmarkSteps;
  const all = world.tiles(), live = new Map(), leaving = new Map(), cache = [], jobs = [], regionGroups = new Map(), landmarks = {};
  const root = new THREE.Group(); root.name = 'world'; scene.add(root);
  let lookSteps = [...look.steps, () => templates()], focus = {x: 0, z: 0, ahead: {x: 0, z: 0}}, planned = null, instant = !fades;
  let far = FAR, view = null;   // view: the camera's wedges: the far one's apex `back` m south of Fuchs, its half-width `tan` per metre; the near one's `near`
  const key = (i, j, ring) => i + ',' + j + ',' + ring;
  function dispose(group) { group.traverse(o => { if (o.isMesh || o.isPoints) { if (!o.userData.shared) o.geometry.dispose(); if (o.isInstancedMesh) o.dispose(); } }); group.removeFromParent(); }
  /** Can the camera see any of the tile? (`widen` > 1 keeps a tile that is already there a little longer.) */
  function seen(i, j, widen = 1) {
    if (!view) return true;
    const ax = focus.x, az = focus.z + view.back, t = view.tan * widen, m = widen > 1 ? 4 : 0;
    for (const cx of [i * TILE, (i + 1) * TILE]) for (const cz of [j * TILE, (j + 1) * TILE]) { const dz = az - cz; if (dz > 0 && Math.abs(cx - ax) < dz * t + m) return true; }
    return ax >= i * TILE && ax < (i + 1) * TILE && az >= j * TILE && az < (j + 1) * TILE;
  }
  /** Does the tile belong in the near ring? Within CORE m of Fuchs, or ahead of him in the picture (out to REACH m).
      `m` widens (a tile that is already near stays a little longer) or narrows it. */
  function nearWanted(i, j, m = 0) {
    const d = centreDistance(focus.x, focus.z, i, j);
    if (!view) return d < NEAR + m;
    if (d < CORE + m) return true;
    if (focus.z - (j + .5) * TILE > REACH + m) return false;
    const ax = focus.x, az = focus.z + NEAR_BACK, t = view.near;
    for (const cx of [i * TILE, (i + 1) * TILE]) for (const cz of [j * TILE, (j + 1) * TILE]) { const dz = az - cz; if (dz > 0 && Math.abs(cx - ax) < dz * t + m) return true; }
    return false;
  }
  /* ---------- showing and hiding: a dissolve, or at once while everything is finished in one go ---------- */
  function hide(entry) { entry.group.visible = false; cache.push(entry); while (cache.length > 8) dispose(cache.shift().group); }
  function show(entry) {
    onChange(entry.group, entry.ring, true);
    if (instant) { fades?.stop(entry.group, true); entry.group.visible = true; } else fades.in(entry.group);
  }
  // a tile no longer drawn dissolves away and then waits in the cache
  function retire(entry) {
    onChange(entry.group, entry.ring, false);
    if (instant) { fades?.stop(entry.group, true); hide(entry); return; }
    leaving.set(entry.key, entry);
    const gone = () => { if (leaving.get(entry.key) === entry) { leaving.delete(entry.key); hide(entry); } };
    if (!fades.turn(entry.group, gone)) fades.out(entry.group, gone);   // still dissolving in: it turns round where it is
  }
  function want() {
    const out = new Map(), {x, z, ahead} = focus, building = new Map(jobs.map(b => [b.i + ',' + b.j, b.ring]));
    for (const [i, j] of all) {
      // what the camera sees first: round Fuchs, where he is heading and the middle of the picture ahead of him
      const d = centreDistance(x, z, i, j), priority = Math.min(d, centreDistance(ahead.x, ahead.z, i, j), view ? centreDistance(x, z - VIEW_AHEAD, i, j) : Infinity);
      // Hysteresis also holds for a tile still being built, so a job is not dropped and restarted at a ring edge.
      const current = building.get(i + ',' + j) || live.get(i + ',' + j)?.ring;
      const farLimit = current ? far + SLACK : far;
      if (nearWanted(i, j, current === 'near' ? SLACK : 0)) out.set(i + ',' + j, {i, j, ring: 'near', d: priority});
      else if (d < farLimit && seen(i, j, current ? 1.12 : 1)) out.set(i + ',' + j, {i, j, ring: 'far', d: priority});
    }
    return out;
  }
  function schedule() {
    const wanted = want();
    // drop tiles that left both rings, and stale jobs
    for (const [k, entry] of live) if (!wanted.has(k)) { live.delete(k); retire(entry); }
    for (let n = jobs.length - 1; n >= 0; n--) { const w = wanted.get(jobs[n].i + ',' + jobs[n].j); if (!w || w.ring !== jobs[n].ring) jobs.splice(n, 1); }
    for (const [k, w] of wanted) {
      const entry = live.get(k), wk = key(w.i, w.j, w.ring);
      if (entry && entry.ring === w.ring) continue;
      const waiting = jobs.find(j => j.i === w.i && j.j === w.j && j.ring === w.ring);
      if (waiting) { waiting.d = entry ? w.d : w.d - 24; continue; }   // priorities follow Fuchs
      // still dissolving away, or kept from a little while ago: back at once
      const going = leaving.get(wk);
      if (going) { leaving.delete(wk); if (entry) { live.delete(k); retire(entry); } live.set(k, going); onChange(going.group, going.ring, true); if (!fades.turn(going.group)) going.group.visible = true; continue; }
      const hit = cache.findIndex(c => c.key === wk);
      if (hit >= 0) { const c = cache.splice(hit, 1)[0]; if (entry) { live.delete(k); retire(entry); } live.set(k, c); show(c); continue; }
      // a near tile that only needs its cheap far version is swapped first: it frees a full-detail tile
      // (a tile with nothing drawn yet counts as 24 m closer: a hole in the ground shows more than missing detail)
      jobs.push({...w, d: entry ? w.d : w.d - 24, it: build(world, look, w.i, w.j, w.ring), next: 'tile start', swap: w.ring === 'far' && entry?.ring === 'near'});
    }
    jobs.sort((a, b) => (b.swap ? 1 : 0) - (a.swap ? 1 : 0) || a.d - b.d);
    // landmarks of regions within the near ring, built out of sight
    for (const region of world.regions) {
      const b = region.bounds, d = Math.hypot(Math.max(b.x0 - focus.x, 0, focus.x - b.x1), Math.max(b.z0 - focus.z, 0, focus.z - b.z1));
      if (d < NEAR && !regionGroups.has(region.id)) { const g = new THREE.Group(); g.name = 'landmarks ' + region.id; g.visible = false; root.add(g); const out = {}; regionGroups.set(region.id, {g, steps: marks(region, look, world, g, out), out, state: 'building'}); landmarks[region.id] = out; }
    }
  }
  // A finished landmark: its shaders are compiled first (without a stall), then it dissolves in.
  function reveal(r) {
    if (instant || !prepare) { r.state = 'shown'; fades?.stop(r.g, true); r.g.visible = true; onChange(r.g, 'landmark', true); return; }
    r.state = 'preparing';
    Promise.resolve().then(() => prepare(r.g)).catch(() => {}).then(() => { if (r.state !== 'preparing') return; r.state = 'shown'; onChange(r.g, 'landmark', true); fades.in(r.g); });
  }
  /* Build in slices of at most `budget` ms. Before each step the streamer predicts its cost from steps of
     the same kind (tile generators yield the name of the step that follows): 1.5 × their moving average, or
     their recent peak (decaying) when that is higher, since some kinds vary with the tile (trees, grass).
     A step expected to overrun the slice waits for the next frame. */
  const costs = new Map();
  const expected = kind => { const c = costs.get(kind); return c ? Math.max(c.avg * 1.5, c.peak) : 1; };
  const room = (t0, budget, first, kind) => first || performance.now() - t0 + expected(kind) <= budget;
  const slowest = {kind: '', ms: 0};
  const timed = (kind, fn) => { const s = performance.now(), v = fn(), ms = performance.now() - s; if (ms > slowest.ms) { slowest.kind = kind; slowest.ms = ms; } const c = costs.get(kind); if (c) { c.avg = c.avg * .7 + ms * .3; c.peak = Math.max(ms, c.peak * .8); } else costs.set(kind, {avg: ms, peak: ms}); return v; };
  /** Spend up to `budget` ms building. Returns true while work remains. */
  function work(budget) {
    const t0 = performance.now(); let first = true;
    while (lookSteps.length && room(t0, budget, first, 'look')) { timed('look', lookSteps.shift()); first = false; }
    // Nothing is built before the shared textures and materials exist: a mesh made earlier would get
    // three.js' default white material (this once turned the den tree white).
    if (lookSteps.length) { if (!first) onSlice(performance.now() - t0); return true; }
    for (const r of regionGroups.values()) { while (r.steps.length && room(t0, budget, first, 'landmark')) { timed('landmark', r.steps.shift()); first = false; } if (!r.steps.length && r.state === 'building') reveal(r); }
    while (jobs.length && room(t0, budget, first, jobs[0].next)) {
      first = false; const job = jobs[0], step = timed(job.next, () => job.it.next());
      if (!step.done) { job.next = step.value || 'step'; continue; }
      jobs.shift(); const k = job.i + ',' + job.j, old = live.get(k), entry = {key: key(job.i, job.j, job.ring), ring: job.ring, group: step.value};
      entry.group.visible = false; root.add(entry.group); live.set(k, entry); show(entry); if (old) retire(old);
    }
    if (!first) onSlice(performance.now() - t0);   // only frames that built something count as slices
    return pending();
  }
  const pending = () => lookSteps.length > 0 || jobs.length > 0 || [...regionGroups.values()].some(r => r.steps.length);
  return {
    root, landmarks,
    /** The longest single build step so far and its kind (a step that should be split up shows here). */
    slowest,
    /** Where Fuchs is and where he is heading (tiles ahead are built first). */
    focus(x, z, ax = x, az = z) {
      // Compared with the place of the last plan, not with the previous frame: a steady walk moves a few
      // centimetres per frame and would otherwise never ask for new tiles.
      focus = {x, z, ahead: {x: ax, z: az}};
      if (!planned || !live.size || Math.hypot(x - planned.x, z - planned.z) > 2 || Math.hypot(ax - x - planned.ax, az - z - planned.az) > 4) { planned = {x, z, ax: ax - x, az: az - z}; schedule(); }
    },
    /** What the camera can see: the far ring reaches `far` m within the wedge (apex `back` m behind Fuchs, `tan` wide). */
    setView(next) {
      const same = view && next && Math.abs(view.back - next.back) < .5 && Math.abs(view.tan - next.tan) < .02 && Math.abs(view.near - (next.near ?? next.tan)) < .02 && Math.abs(far - next.far) < 1;
      if (same) return; view = next ? {back: next.back, tan: next.tan, near: next.near ?? next.tan} : null; far = next?.far || FAR; planned = null;
    },
    get far() { return far; },
    work, pending,
    /** Finish everything now (used when Fuchs steps outside before the slices are done): no dissolves. */
    complete() {
      const t0 = performance.now(), report = onSlice; onSlice = () => {}; instant = true;
      try {
        fades?.finish(); while (work(1e9));
        for (const r of regionGroups.values()) if (!r.steps.length && r.state !== 'shown') { r.state = 'shown'; fades?.stop(r.g, true); r.g.visible = true; onChange(r.g, 'landmark', true); }
        fades?.finish();
      } finally { instant = !fades; onSlice = report; }
      return performance.now() - t0;
    },
    get counts() { let near = 0, farTiles = 0; for (const e of live.values()) e.ring === 'near' ? near++ : farTiles++; return {near, far: farTiles, jobs: jobs.length, leaving: leaving.size}; },
    /** How far streaming is behind at Fuchs' place: tiles that should be drawn (well inside the rings) with nothing drawn
        (holes) and tiles `inner` m inside the near ring (or near Fuchs) still without their full version (plain ground).
        Both are 0 when streaming keeps up. */
    gaps(inner = TILE) {
      let holes = 0, plain = 0;
      for (const [i, j] of all) { const d = centreDistance(focus.x, focus.z, i, j), e = live.get(i + ',' + j);
        if (!e && (nearWanted(i, j, -TILE / 2) || (d < far - TILE / 2 && seen(i, j)))) holes++;
        if (e?.ring !== 'near' && (nearWanted(i, j, -inner) || (d < NEAR - inner && nearWanted(i, j)))) plain++; }
      return {holes, plain};
    },
    /** Development and tests: is the tile meant to have its full detail now? */
    nearWanted: (i, j) => nearWanted(i, j),
    terrain() { const out = []; for (const e of live.values()) if (e.ring === 'near') e.group.traverse(o => { if (o.userData.terrain) out.push(o); }); return out; },
  };
}
