/* Frame budget helpers for the iPad 9 (blueprint section 7).
   - Counters (fps, frame time, render scale, draw calls, triangles, GPU objects, longest build slice)
     are always kept, cheaply, so tests can read them from FK.perf.
   - The overlay is development only: it appears with ?perf=1, like ?dev=1.
   - Adaptive render scale (P1): starts at min(devicePixelRatio, 1.5), clamped 1.0–1.5; every 60 frames
     the average frame interval steps it down 0.125 above 18 ms and up 0.125 below 12 ms, at most once per 2 s. */
const params = new URLSearchParams(location.search);

export function createPerf(renderer, {software = false} = {}) {
  const dpr = window.devicePixelRatio || 1;
  const max = software ? .5 : Math.min(dpr, 1.5), min = software ? .5 : Math.min(dpr, 1);
  const stats = {fps: 0, frameMs: 0, scale: max, calls: 0, triangles: 0, textures: 0, geometries: 0, programs: 0,
    maxCalls: 0, maxTriangles: 0, buildSliceMs: 0, maxBuildSliceMs: 0, buildSlices: 0, p95BuildSliceMs: 0, liveTiles: 0, maxLiveTiles: 0, farTiles: 0, maxFarTiles: 0,
    animated: 0, maxAnimated: 0, lost: false, frames: 0, rendered: 0};
  let sum = 0, count = 0, lastStep = 0, overlay = null;
  const sliceBins = new Uint32Array(81);   // build slices in 0.25 ms bins (the last one is 20 ms and more)
  if (params.get('perf') === '1') {
    overlay = document.createElement('pre');
    overlay.className = 'ff-perf'; overlay.setAttribute('aria-hidden', 'true');
    Object.assign(overlay.style, {position: 'fixed', left: '8px', bottom: '8px', zIndex: 99, margin: 0, padding: '6px 9px', borderRadius: '8px',
      background: '#2a180bd9', color: '#fff8e8', font: '12px/1.35 ui-monospace,Menlo,monospace', pointerEvents: 'none', whiteSpace: 'pre'});
    document.body.append(overlay);
  }
  renderer.setPixelRatio(stats.scale);
  function setScale(next, now) {
    next = Math.round(Math.min(max, Math.max(min, next)) * 8) / 8;
    if (next === stats.scale) return;
    stats.scale = next; lastStep = now; renderer.setPixelRatio(next);
  }
  return {
    stats,
    /** Call once per animation frame with the interval since the previous one. */
    frame(intervalMs, now, active) {
      stats.frames++;
      if (!active || intervalMs <= 0 || intervalMs > 250) return;
      sum += intervalMs; count++;
      if (count >= 60) {
        const avg = sum / count; stats.frameMs = avg; stats.fps = 1000 / avg; sum = 0; count = 0;
        if (!software && now - lastStep > 2000) { if (avg > 18) setScale(stats.scale - .125, now); else if (avg < 12) setScale(stats.scale + .125, now); }
      }
    },
    /** Call right after renderer.render() for the frame. */
    rendered(extra = {}) {
      const r = renderer.info.render, m = renderer.info.memory;
      stats.rendered++; stats.calls = r.calls; stats.triangles = r.triangles; stats.textures = m.textures; stats.geometries = m.geometries; stats.programs = renderer.info.programs?.length || 0;
      Object.assign(stats, extra);
      stats.maxCalls = Math.max(stats.maxCalls, stats.calls); stats.maxTriangles = Math.max(stats.maxTriangles, stats.triangles);
      stats.maxLiveTiles = Math.max(stats.maxLiveTiles, stats.liveTiles); stats.maxFarTiles = Math.max(stats.maxFarTiles, stats.farTiles);
      stats.maxAnimated = Math.max(stats.maxAnimated, stats.animated);
      if (overlay && stats.rendered % 10 === 0) overlay.textContent =
        `${stats.fps.toFixed(0)} fps  ${stats.frameMs.toFixed(1)} ms  scale ${stats.scale.toFixed(3)}\n` +
        `calls ${stats.calls}  tris ${(stats.triangles / 1000).toFixed(0)}k  tex ${stats.textures}  geo ${stats.geometries}\n` +
        `tiles ${stats.liveTiles}+${stats.farTiles}  slice ${stats.buildSliceMs.toFixed(1)} ms (p95 ${stats.p95BuildSliceMs.toFixed(2)}, max ${stats.maxBuildSliceMs.toFixed(1)})  anim ${stats.animated}`;
    },
    /** Call with the duration of each frame's build slice (frames that built something). */
    slice(ms) {
      stats.buildSliceMs = ms; stats.maxBuildSliceMs = Math.max(stats.maxBuildSliceMs, ms);
      sliceBins[Math.min(80, Math.floor(ms * 4))]++; stats.buildSlices++;
      // 95th percentile (upper bin edge, and at least the second-longest slice): one stall (garbage
      // collection, the OS) does not decide the result alone
      let left = Math.max(2, Math.ceil(stats.buildSlices * .05)), bin = 80; while (bin > 0 && (left -= sliceBins[bin]) > 0) bin--; stats.p95BuildSliceMs = (bin + 1) / 4;
    },
    reset() { for (const k of ['maxCalls', 'maxTriangles', 'maxBuildSliceMs', 'buildSlices', 'p95BuildSliceMs', 'maxLiveTiles', 'maxFarTiles', 'maxAnimated']) stats[k] = 0; sliceBins.fill(0); },
    dispose() { overlay?.remove(); },
  };
}
