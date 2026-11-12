# Design history — archived

These are the original superseded design folders, preserved when the repository adopted one [visual style](../../design/VISUAL-STYLE.md) and one [puzzle blueprint](../../design/PUZZLE-BLUEPRINT.md). They do not define current behaviour or impose current workflow restrictions.

- `heart-tree/`: retired story, blueprint and reviews.
- `forest-friends/`: previous drafts, handoffs, mockups, screenshots and fixed visual baseline.
- `visual-overhaul/`: Waldbuch proposal, look-development and performance experiments. The maintained plush sculpt source was promoted to `tools/characters/plush.js`.
- `world-10x/`: previous large-world proposal; the active world source remains in `js/friends/world/`.
- `archive/`: the older design archive, kept intact.
- `prior-documentation/`: superseded root/docs working documents before consolidation.
- `manifest.json`: original paths, archive paths and SHA-256 for preserved files (including retired runtime/tests). `node tools/check-design.cjs` verifies integrity.

Relative links inside old documents retain their historical context; use the manifest to locate moved targets. Fixed visual references were not overwritten to match the new implementation. Their original checker still runs at `forest-friends/visuals/check-baseline.py`.
