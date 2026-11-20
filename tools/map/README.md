# Approved drawn map and interactive pins

The runtime map is the owner's approved flat, simplified, top-down version 2 painting. Its current source is [world-map.png](../../design/artwork/sources/world-map.png); [world-map.json](../../design/artwork/world-map.json) prepares `assets/forest-friends/world-map.webp`. Generate future edits with the canonical `world-map` request; preserve projection, geography and sparse detail.

The actual destination buttons, animal portraits, names, invitation marker and current-position marker remain UI layers. Each destination has a 64 px picture button and an accessible name. The map stays at least 880 px wide and pans horizontally on phones. The position marker and leader lines cannot intercept pointer events; destination pins sit above them.

[world-map-layout.json](../../design/artwork/world-map-layout.json) calibrates 30 world landmarks to painting pixels. Its 54 precomputed world-space triangles interpolate the current Fuchs position continuously across the full extent. Named destination buttons have separated display centres; leader lines indicate the actual projected location. Routes still use original world coordinates, including Steinbock's crag and the new ascent from the cave approach. The painting distinguishes the plank bridge beside the den from the branch dam at the pond outlet. The calibration does not move terrain or characters.

```sh
node tools/illustrations/prepare-image.cjs design/artwork/world-map.json
node tools/map/layout.cjs
node tools/map/layout.cjs --check
node tests/drawn-map-browser.cjs
```

When changing the painting's landmark positions, edit their pixel coordinates and the corresponding pin centres, then regenerate the runtime module. Keep world coordinates tied to `world/big/layout.js`. Pixel-only changes retain the stored triangulation; adding/moving world control points requires recalculating its world-space Delaunay triangles. The check rejects folded triangles, stale generated code, labels leaving the canvas and overlapping hit areas at the minimum board width. Tests cover exact landmark mapping, continuous triangle boundaries, full-extent coverage and real touch/keyboard routing of all thirteen pins at tablet, phone and landscape sizes.

`map.html` / `render.cjs` can still paint a geometry-derived development reference from the actual world. Its default output is `/tmp/waldpost-world-map-geography.webp`, never the approved runtime painting. The preserved `design/artwork/references/world-map-geography.webp` holds the exact prior geography reference; do not overwrite it or reuse its oblique scenery as a style reference.

The compact panel is capped at 940 px / 92 vw and 82 dvh. It has no map/back header; an outside tap or Escape closes it and restores launcher focus. The same outside-tap behaviour applies to invitation letters. Gesture tracking prevents panning or a drag ending on the backdrop from closing either panel. The den marker uses the animal portraits' painted medium; the leaving-den sign uses the flat SVG family of the world navigation icons.
