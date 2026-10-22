/* Farbklecks – kleine, schon (teilweise) ausgemalte Vorschaubilder für Startseite und Malbuch. */
(function () {
  'use strict';
  const FK = window.FK;

  // Connected regions of non-line pixels (4-connected scanline flood, no per-pixel modulo).
  // Returns label per pixel (-1 = line), the region count and per region its bbox [x0, y0, x1, y1].
  function regions(alpha, W, H, wall) {
    const lab = new Int32Array(W * H).fill(-1);
    let box = new Int32Array(256 * 4);
    let stack = new Int32Array(4096);
    let n = 0;
    for (let y = 0, i = 0; y < H; y++) {
      for (let x = 0; x < W; x++, i++) {
        if (lab[i] !== -1 || alpha[i] >= wall) continue;
        if (n * 4 >= box.length) {
          const nb = new Int32Array(box.length * 2);
          nb.set(box);
          box = nb;
        }
        let bx0 = x;
        let by0 = y;
        let bx1 = x;
        let by1 = y;
        let top = 0;
        stack[top++] = x;
        stack[top++] = y;
        while (top) {
          const sy = stack[--top];
          const sx = stack[--top];
          const row = sy * W;
          if (lab[row + sx] !== -1 || alpha[row + sx] >= wall) continue;
          // widen the seed to the whole run on this row
          let xl = sx;
          let xr = sx;
          while (xl > 0 && lab[row + xl - 1] === -1 && alpha[row + xl - 1] < wall) xl--;
          while (xr < W - 1 && lab[row + xr + 1] === -1 && alpha[row + xr + 1] < wall) xr++;
          lab.fill(n, row + xl, row + xr + 1);
          if (xl < bx0) bx0 = xl;
          if (xr > bx1) bx1 = xr;
          if (sy < by0) by0 = sy;
          if (sy > by1) by1 = sy;
          // one seed per open run in the rows above and below
          for (let ny = sy - 1; ny <= sy + 1; ny += 2) {
            if (ny < 0 || ny >= H) continue;
            const nrow = ny * W;
            let open = false;
            for (let xx = xl; xx <= xr; xx++) {
              const ok = lab[nrow + xx] === -1 && alpha[nrow + xx] < wall;
              if (ok && !open) {
                if (top + 2 > stack.length) {
                  const ns = new Int32Array(stack.length * 2);
                  ns.set(stack);
                  stack = ns;
                }
                stack[top++] = xx;
                stack[top++] = ny;
              }
              open = ok;
            }
          }
        }
        box[n * 4] = bx0;
        box[n * 4 + 1] = by0;
        box[n * 4 + 2] = bx1;
        box[n * 4 + 3] = by1;
        n++;
      }
    }
    return { lab, n, box: box.slice(0, n * 4) };
  }

  // Finished previews per page and size for callers that redraw the same few often (the hub, on every visit).
  const cache = new Map();
  const CACHE_MAX = 4;

  // Draws `page` onto `canvas`, with `amount` (0…1) of its labelled regions filled in their solution colours.
  // keep = remember the result (one ImageData per entry, so only for a single big canvas like the hub's).
  function preview(canvas, page, amount, paper, keep) {
    const W = canvas.width;
    const H = canvas.height;
    const ctx = canvas.getContext('2d');
    const key = page && keep ? [page.id, W, H, amount, paper || ''].join('|') : '';
    const hit = key ? cache.get(key) : null;
    if (hit) {
      cache.delete(key);
      cache.set(key, hit);
      ctx.putImageData(hit, 0, 0);
      return;
    }
    ctx.fillStyle = paper || '#ffffff';
    ctx.fillRect(0, 0, W, H);
    if (!page) return;
    const oc = document.createElement('canvas');
    oc.width = W;
    oc.height = H;
    const alpha = FK.art.renderOutline(oc, page, Math.max(2, W / 170), [35, 32, 61]);
    if (amount > 0 && FK.art.hasLabels(page)) {
      const R = regions(alpha, W, H, 110);
      const spots = FK.art.spotsOnPaper(page, W, H);
      const colorOf = new Map();
      const keep = Math.max(1, Math.round(spots.length * amount));
      spots.slice(0, keep).forEach((sp) => {
        const x = Math.round(sp.x);
        const y = Math.round(sp.y);
        if (x < 0 || y < 0 || x >= W || y >= H) return;
        const r = R.lab[y * W + x];
        const c = FK.color.byId(page.colors[sp.c - 1]);
        if (r >= 0 && c) colorOf.set(r, FK.color.hexRgb(c.hex));
      });
      const img = ctx.getImageData(0, 0, W, H);
      const d = img.data;
      for (let i = 0; i < W * H; i++) {
        let r = R.lab[i];
        if (r < 0) {
          // pixels under the line take a neighbour's colour so no white seams show
          r = i > 0 && R.lab[i - 1] >= 0 ? R.lab[i - 1] : (i + 1 < W * H ? R.lab[i + 1] : -1);
        }
        const col = r >= 0 ? colorOf.get(r) : null;
        if (!col) continue;
        const o = i * 4;
        d[o] = col[0];
        d[o + 1] = col[1];
        d[o + 2] = col[2];
      }
      ctx.putImageData(img, 0, 0);
    }
    ctx.drawImage(oc, 0, 0);
    oc.width = oc.height = 0;
    if (!key) return;
    try {
      cache.set(key, ctx.getImageData(0, 0, W, H));
      if (cache.size > CACHE_MAX) cache.delete(cache.keys().next().value);
    } catch (e) { /* tainted or out of memory: just don't cache */ }
  }

  FK.art.preview = preview;
  FK.art.regions = regions;
})();
