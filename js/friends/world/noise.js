/* Deterministic randomness and value noise for the forest world. Everything the world builds is a
   pure function of region data and these seeds, so a tile rebuilt later looks exactly the same. */
export const TAU = Math.PI * 2;
export const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
export const lerp = (a, b, t) => a + (b - a) * t;
export const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

/** Park–Miller generator returning floats in [0, 1). */
export function rng(seed) {
  seed = Math.abs(Math.floor(seed)) % 2147483646 + 1;
  return () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
}
/** A stable integer seed for a tile of a region. */
export const tileSeed = (seed, i, j) => (Math.imul(seed | 0, 73856093) ^ Math.imul(i + 4096, 19349663) ^ Math.imul(j + 4096, 83492791)) >>> 0;

export function hash(x, y) { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s); }
export function vnoise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
  return lerp(lerp(a, b, u), lerp(c, d, u), v);
}
export const fbm = (x, y) => vnoise(x, y) * .55 + vnoise(x * 2.1 + 5, y * 2.1 + 9) * .3 + vnoise(x * 4.3 + 11, y * 4.3 + 3) * .15;

/** Nearest-sample lookup over a dense polyline (brook and trail splines), bucketed for speed. */
export function sampleIndex(points, cell = 4) {
  const grid = new Map(), key = (i, j) => i * 65536 + j;
  let i0 = Infinity, i1 = -Infinity, j0 = Infinity, j1 = -Infinity;
  points.forEach((p, n) => { const i = Math.floor(p.x / cell), j = Math.floor(p.z / cell), k = key(i, j); (grid.get(k) || grid.set(k, []).get(k)).push(n); i0 = Math.min(i0, i); i1 = Math.max(i1, i); j0 = Math.min(j0, j); j1 = Math.max(j1, j); });
  /** Nearest sample within `reach` buckets: {d, i, t}, written into `out` when given (no allocation). */
  return function nearest(x, z, reach = 3, out = {}) {
    const ci = Math.floor(x / cell), cj = Math.floor(z / cell);
    out.d = Infinity; out.i = 0; out.t = 0;
    // no bucket within reach: the polyline is far away
    if (ci + reach < i0 || ci - reach > i1 || cj + reach < j0 || cj - reach > j1) return out;
    let best = Infinity, bi = -1, stop = reach;
    for (let r = 0; r <= stop; r++) {
      if (bi >= 0 && stop > r) stop = r;   // after the first hit, scan one more ring and finish
      for (let i = ci - r; i <= ci + r; i++) for (let j = cj - r; j <= cj + r; j++) {
        if (r && Math.abs(i - ci) < r && Math.abs(j - cj) < r) continue;
        const list = grid.get(key(i, j)); if (!list) continue;
        for (const n of list) { const p = points[n], dx = p.x - x, dz = p.z - z, d = dx * dx + dz * dz; if (d < best) { best = d; bi = n; } }
      }
    }
    if (bi >= 0) { out.d = Math.sqrt(best); out.i = bi; out.t = bi / (points.length - 1); }
    return out;
  };
}
