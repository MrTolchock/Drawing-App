/* Farbklecks – kleine, schon (teilweise) ausgemalte Vorschaubilder für Startseite und Malbuch. */
(function () {
  'use strict';
  const FK = window.FK;

  // Connected regions of non-line pixels. Returns label per pixel (-1 = line).
  function regions(alpha, W, H, wall) {
    const lab = new Int32Array(W * H).fill(-1);
    const stack = new Int32Array(W * H);
    let n = 0;
    for (let i = 0; i < W * H; i++) {
      if (lab[i] !== -1 || alpha[i] >= wall) continue;
      let top = 0;
      stack[top++] = i;
      lab[i] = n;
      while (top) {
        const j = stack[--top];
        const x = j % W;
        if (x > 0 && lab[j - 1] === -1 && alpha[j - 1] < wall) { lab[j - 1] = n; stack[top++] = j - 1; }
        if (x < W - 1 && lab[j + 1] === -1 && alpha[j + 1] < wall) { lab[j + 1] = n; stack[top++] = j + 1; }
        if (j >= W && lab[j - W] === -1 && alpha[j - W] < wall) { lab[j - W] = n; stack[top++] = j - W; }
        if (j < W * (H - 1) && lab[j + W] === -1 && alpha[j + W] < wall) { lab[j + W] = n; stack[top++] = j + W; }
      }
      n++;
    }
    return { lab, n };
  }

  // Draws `page` onto `canvas`, with `amount` (0…1) of its labelled regions filled in their solution colours.
  function preview(canvas, page, amount, paper) {
    const W = canvas.width;
    const H = canvas.height;
    const ctx = canvas.getContext('2d');
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
  }

  FK.art.preview = preview;
  FK.art.regions = regions;
})();
