/* Path search for the big world: a 1 m grid over the whole map, filled in lazily, searched with A*.
   A cell is free only if Fuchs can stand anywhere in it, so straight lines between free cells are safe.
   Crossings (bridges, logs, stones, planks, the dam) are narrower than a cell: their cells are free by
   decree and a route always walks a crossing from end to end. */
export function createNav({extent, walkable, crossings}) {
  const X0 = extent.x0, Z0 = extent.z0, W = extent.x1 - extent.x0, H = extent.z1 - extent.z0, N = W * H;
  const state = new Uint8Array(N), cross = new Int16Array(N).fill(-1);          // 0 unknown, 1 free, 2 blocked
  const g = new Float32Array(N), from = new Int32Array(N), stamp = new Uint32Array(N); let run = 0, filled = 0;
  crossings.forEach((c, k) => { const len = Math.hypot(c.b[0] - c.a[0], c.b[1] - c.a[1]), n = Math.ceil(len / .25);
    for (let i = 0; i <= n; i++) { const x = c.a[0] + (c.b[0] - c.a[0]) * i / n, z = c.a[1] + (c.b[1] - c.a[1]) * i / n, ci = Math.floor(x - X0), cj = Math.floor(z - Z0); if (ci >= 0 && cj >= 0 && ci < W && cj < H) cross[cj * W + ci] = k; } });
  const OFF = [[0, 0], [-.42, -.42], [.42, -.42], [-.42, .42], [.42, .42]];
  function free(i, j) {
    if (i < 0 || j < 0 || i >= W || j >= H) return false;
    const k = j * W + i; let s = state[k];
    if (!s) { s = 1; if (cross[k] < 0) { const x = X0 + i + .5, z = Z0 + j + .5; for (const [ox, oz] of OFF) if (!walkable(x + ox, z + oz, .5)) { s = 2; break; } } state[k] = s; }
    return s === 1;
  }
  /** Fill the grid a little at a time (in the den); returns true while cells remain. */
  function work(budget) { const t0 = performance.now(); while (filled < N) { free(filled % W, (filled / W) | 0); filled++; if ((filled & 63) === 0 && performance.now() - t0 > budget) break; } return filled < N; }
  function nearestFree(i, j) { if (free(i, j)) return [i, j]; for (let r = 1; r < 9; r++) for (let dj = -r; dj <= r; dj++) for (let di = -r; di <= r; di++) if (Math.max(Math.abs(di), Math.abs(dj)) === r && free(i + di, j + dj)) return [i + di, j + dj]; return null; }
  /** True if the straight line between two points stays on free cells that are not crossings. */
  function clear(ax, az, bx, bz) {
    const d = Math.hypot(bx - ax, bz - az), n = Math.max(1, Math.ceil(d / .4));
    for (let k = 0; k <= n; k++) { const x = ax + (bx - ax) * k / n, z = az + (bz - az) * k / n, i = Math.floor(x - X0), j = Math.floor(z - Z0); if (!free(i, j) || cross[j * W + i] >= 0) return false; }
    return true;
  }
  const heap = []; // binary heap of [f, cell]
  const push = (f, c) => { let i = heap.length; heap.push([f, c]); while (i) { const p = (i - 1) >> 1; if (heap[p][0] <= f) break; [heap[p], heap[i]] = [heap[i], heap[p]]; i = p; } };
  const pop = () => { const top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; let i = 0; for (;;) { const l = i * 2 + 1, r = l + 1; let m = i; if (l < heap.length && heap[l][0] < heap[m][0]) m = l; if (r < heap.length && heap[r][0] < heap[m][0]) m = r; if (m === i) break; [heap[m], heap[i]] = [heap[i], heap[m]]; i = m; } } return top; };
  /** A route from a to b as [[x, z], …] (b last), or null. Both ends may be off the grid's free cells. */
  function plan(ax, az, bx, bz) {
    const s = nearestFree(Math.floor(ax - X0), Math.floor(az - Z0)), e = nearestFree(Math.floor(bx - X0), Math.floor(bz - Z0)); if (!s || !e) return null;
    const start = s[1] * W + s[0], goal = e[1] * W + e[0], gi = e[0], gj = e[1]; run++; heap.length = 0;
    const h = (i, j) => { const dx = Math.abs(i - gi), dz = Math.abs(j - gj); return Math.max(dx, dz) + .4142 * Math.min(dx, dz); };
    g[start] = 0; stamp[start] = run; from[start] = -1; push(h(s[0], s[1]), start); let found = false, guard = 0;
    while (heap.length && guard++ < 120000) {
      const [f, c] = pop(), i = c % W, j = (c / W) | 0; if (c === goal) { found = true; break; } if (f > g[c] + h(i, j) + 1e-3) continue;
      for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) {
        if (!di && !dj) continue; const ni = i + di, nj = j + dj; if (!free(ni, nj)) continue; if (di && dj && (!free(i + di, j) || !free(i, j + dj))) continue;
        const n = nj * W + ni, cost = g[c] + (di && dj ? 1.4142 : 1); if (stamp[n] === run && g[n] <= cost) continue;
        g[n] = cost; stamp[n] = run; from[n] = c; push(cost + h(ni, nj), n);
      }
    }
    if (!found) return null;
    const cells = []; for (let c = goal; c >= 0; c = from[c]) cells.push(c); cells.reverse();
    // cells → points; a run of crossing cells becomes the crossing's two ends (hard corners of the route)
    const pts = []; let k = 0;
    while (k < cells.length) {
      const c = cells[k], id = cross[c];
      if (id < 0) { pts.push({x: X0 + c % W + .5, z: Z0 + ((c / W) | 0) + .5}); k++; continue; }
      while (k < cells.length && cross[cells[k]] === id) k++;
      const cr = crossings[id], dx = cr.b[0] - cr.a[0], dz = cr.b[1] - cr.a[1], l = Math.hypot(dx, dz), A = {x: cr.a[0] - dx / l * .7, z: cr.a[1] - dz / l * .7, hard: true}, B = {x: cr.b[0] + dx / l * .7, z: cr.b[1] + dz / l * .7, hard: true};
      const prev = pts[pts.length - 1] || {x: ax, z: az}; if (Math.hypot(prev.x - A.x, prev.z - A.z) <= Math.hypot(prev.x - B.x, prev.z - B.z)) pts.push(A, B); else pts.push(B, A);
    }
    // pull the string tight between the hard corners
    const out = []; let anchor = {x: ax, z: az}, i = 0;
    while (i < pts.length) {
      let j = i; if (!pts[i].hard) while (j + 1 < pts.length && !pts[j + 1].hard && clear(anchor.x, anchor.z, pts[j + 1].x, pts[j + 1].z)) j++;
      out.push([pts[j].x, pts[j].z]); anchor = pts[j]; i = j + 1;
    }
    const last = out[out.length - 1]; if (Math.hypot(last[0] - bx, last[1] - bz) > .05) out.push([bx, bz]);
    return out;
  }
  return {plan, work, free: (x, z) => free(Math.floor(x - X0), Math.floor(z - Z0)), get pending() { return filled < N; }};
}
