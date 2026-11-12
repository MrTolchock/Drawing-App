# Visual overhaul — Waldbuch

Design package for making Forest friends look consistent and polished on an iPad 9th generation, without changing gameplay.

| File | Purpose |
| --- | --- |
| [BLUEPRINT.md](BLUEPRINT.md) | Implementation spec: tokens, components, screens, consistency rules, 3D changes, performance plan, phases, acceptance |
| [PROGRESS.md](PROGRESS.md) | Phase checklist that Claude Code keeps current while implementing |
| [ASSET-REQUESTS.md](ASSET-REQUESTS.md) | New artwork to generate (optional; every item has a fallback) |
| [mockup/board.html](mockup/board.html) | Visual mockups built from the game's own art and `waldbuch.css` (serve the repo root and open `/design/visual-overhaul/mockup/board.html`) |
| [mockup/waldbuch.css](mockup/waldbuch.css) | Reference stylesheet; copy tokens and components into `css/waldbuch.css` |
| [lookdev/](lookdev/) | 3D look-dev scene of the forest in the new style (three.js, runs offline): open `/design/visual-overhaul/lookdev/?view=hero`, `close`, `brook` or `log`; the cast sheet at `lookdev/cast.html`. The sculpted plush characters are in `plush.js` |
| `mockup/a/` | Crops of existing assets and current-build screenshots used by the mockups (design reference only, not runtime assets) |

Design canvas with all boards: [Farbtupf — Waldbuch visual overhaul](https://claude.ai/artifact/XJyWbTidKVZEJR8SWUWZWA) (owner's claude.ai account; the same boards are in `mockup/board.html`).

## Handover prompt for Claude Code

The repository's `CLAUDE.md` points every session here, so a short prompt is enough:

> Continue the Waldbuch visual overhaul: read `design/visual-overhaul/PROGRESS.md` and implement the next phase.

Full version for the first session:

> Implement the visual overhaul in `design/visual-overhaul/BLUEPRINT.md`, phase by phase (section 8). For the 3D forest, port the techniques of `design/visual-overhaul/lookdev/` (section 6). Read section 0 first: do not change gameplay, puzzle rules, saves or frozen references. Use `design/visual-overhaul/mockup/board.html` and `waldbuch.css` as the visual target. After each phase run the tests named there, capture milestone screenshots at 1080 × 810 and 390 × 844, write the comparison, bump the version, tick `PROGRESS.md` and push to main.
