# Waldfreunde implementation

The active game follows [letter sessions](LETTER-SESSIONS.md), [visual style](../design/VISUAL-STYLE.md) and the [puzzle blueprint](../design/PUZZLE-BLUEPRINT.md). Historical Heart Tree screens and engines live in `archive/legacy-game/`; `?screen=forest` opens the current den. The old gallery URL opens the adult gate.

## Current modules

| Module | Responsibility |
| --- | --- |
| `js/friends/game.js` | Den, letter, visits, map, mailman, return home and sleeping end card |
| `js/friends/state.js` | Durable invitation/session allowance, world position, exports and compatibility records |
| `js/friends/world/`, `forest3d.js`, `characters3d.js`, `painted.js` | Forest, plush cast, movement and painted den |
| `js/friends/interface.js` | One model-rendered identity atlas for every UI surface |
| `js/ui/waldatelier.js`, `waldatelier-icons.js` | Drawn subjects and shared utility icons |
| `js/friends/library.js` | Explicit active inventory and current-letter access permit |
| `js/friends/puzzle-catalogue.js`, `puzzle-rounds.js` | Finite content, revisions, random distinct five-task selection and exact snapshots |
| `js/screens/puzzle.js`, `trace.js` | Shared puzzle page and writing stroke engine |
| `js/friends/puzzle-review.js`, `js/screens/puzzle-review.js` | Individual editorial decisions, previews, revision gate and backup |
| `js/friends/settings.js` | Adult gate, letter count, gallery, sounds, reading case, exports and updates |
| `js/scene/materials.js`, `js/core/speech.js`, `js/ui/gestures.js` | Current shared scene, requested speech and touch utilities |

The catalogue lists all 34 [puzzles and competence assignments](PUZZLE-CATALOGUE.md). An interrupted puzzle resumes before the host rotates. Correct answers advance automatically; only completing all five consumes a letter. Non-invited friends, direct routes and the mailman cannot grant extra puzzles.

The table opens six drawn colouring pages. Saved older drawings can still resume in their original painting engine; template IDs, localStorage and IndexedDB names remain stable. Archived story records are retained but their former screens are no longer shipped or downloaded. The new journey does not spend historical currencies.

Review decisions are separate device-local records. Do not ship approvals, reset storage or silently carry an old approval to a changed revision. Export/import is revision checked. Tests use isolated fixtures; the owner still inspects every real iteration before children use it.

The world supports requested rule speech, quiet button/correct/retry sounds and parent sound preferences. There is no countdown or automatic answer narration. Updates preserve saved data and defer reload during active puzzles/drawing. See [Development](DEVELOPMENT.md) for validation and publishing.
