# Character identity portraits

`assets/forest-friends/character-portraits.webp` is the only UI identity atlas: all 13 current characters and the fox sleep pose. It uses the same baked GLBs as the world, with one fixed camera, warm lighting and consistent framing. The transparent 4 × 4 atlas has 256 px cells (4 MiB decoded). No separate paint-over treatment.

Serve the repository root, then run `node tools/portraits/render.cjs`. Set `PLAYWRIGHT_MODULE` and `CHROMIUM_PATH` to your installed tools when needed. The script fails on an empty render. Re-bake changed models first; the maintained sculpt source is `tools/characters/plush.js`.

See [visual style](../../design/VISUAL-STYLE.md) for the boundary between rendered character identity and drawn learning subjects. The previous mixed portrait pipeline is preserved under `archive/legacy-game/tools/portraits/`.
