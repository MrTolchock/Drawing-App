# Working agreement

- Push finished work directly to `main` — the owner's standing instruction (7 November 2026). GitHub Pages serves `main`, so a push publishes the game.
- Before pushing, run `node --test tests/*.test.cjs` and the browser suites for what changed (see [Development](docs/DEVELOPMENT.md)).

# Current work: Waldbuch visual overhaul (handed over 9 November 2026)

The design is finished; implementation is next. At the start of every session:

1. Read [design/visual-overhaul/PROGRESS.md](design/visual-overhaul/PROGRESS.md) to see which phase is next.
2. Read [design/visual-overhaul/BLUEPRINT.md](design/visual-overhaul/BLUEPRINT.md) — section 0 (guardrails) first, then the section for the current phase.
3. Use the visual targets: `design/visual-overhaul/mockup/board.html` (2D screens) and `design/visual-overhaul/lookdev/` (3D forest `?view=hero|close|brook|log`, cast at `cast.html`). Serve the repo root to open them.

Rules for this work:

- Visuals, consistency and performance only. Do not change gameplay, puzzle rules, task order, saves or frozen references in `design/forest-friends/visuals/`.
- Work one phase at a time (blueprint section 8). After each phase: tests, milestone screenshots at 1080 × 810 and 390 × 844 in `design/forest-friends/visuals/milestones/waldbuch/`, `COMPARISON.md`, version bump in `js/core/util.js` and `sw.js`, update `PROGRESS.md`, push to `main`.
- Target device: iPad 9th generation, Safari, home-screen app (PWA), offline. Keep within the budgets in blueprint sections 6, 7, 7A and 7B.
- `lookdev/` is a design reference, not runtime code: port its techniques into `js/friends/`, do not import it from the game.

Model and effort (you cannot change these yourself, so tell the owner):

- Phases 1–3 and 5: Opus 5.5 at effort `high`.
- Phase 4 (3D world, plush cast, world ×10, performance): effort `xhigh` ("extra high"), or Fable 5.1 if available.
- IMPORTANT: Before starting phase 4, stop and tell the owner to switch: `/effort xhigh` (or `/model fable`). Wait for confirmation before writing any phase-4 code. When phase 4 is finished, tell the owner to switch back with `/effort high` before phase 5.
- In any phase, if the same problem has failed twice or a performance budget cannot be met, stop and suggest switching to `xhigh` for that problem.
