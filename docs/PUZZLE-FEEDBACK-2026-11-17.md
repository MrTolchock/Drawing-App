# Puzzle feedback from 17 November 2026

Read from the public `puzzle-review-data/reviews.json` ledger on 17 November 2026. All three notes dated today were read, including the general comment on an approved Biber puzzle. The implementation is 9.3.89; this follow-up does not approve content or delete the original editorial records.

| Stable key | Original feedback | Change |
| --- | --- | --- |
| `friends-squirrel/count-0` | Illustration passt nicht zu anderen gemalten Bildern | Redrew the shared Eichhörnchen identity in the canonical watercolour/pencil technique. The zero task shows this portrait and no count objects. Also replaced the strongly modelled counting acorn with one drawn hazelnut, reused through the stable `forest-nut` ID. The related badger question now asks what the squirrel collects in autumn rather than suggesting a hazelnut grows under an oak. |
| `friends-bird/rhyme-15` | Haus ist perspektivisch falsch beim Fenster; neu zeichnen | Redrew `vocab-house` as a frontal cottage, with rectangular front windows, parallel sills and consistent wall/roof perspective. Every puzzle using this stable subject receives the corrected drawing. |
| `puzzle:friends-beaver` | Reihen sind immer kreis, dreieck und quadrat. Beim fehlenden zeichen muss man gar nicht wissen, was erste zwei reihen zeigen. Besser wäre ein muster in ersten zwei reihen das in dritter weitergeführt wird, bsw. Immer zwei dreiecke und ein kreis, in unterschiedlichen reihenfolgen, und in letzter zeile muss ergänzt werden | All 25 stable matrix IDs now use two of one shape and one of another, in changing row orders. The first two complete rows establish the shape quantities for the incomplete third row. All six ordered shape pairs occur, all three shapes remain answer choices, and the first two rows imply exactly one completion. Instruction, competence, difficulty and catalogue match this rule. |

**Comment removal:** every row in **Bisherige Hinweise** has a shared SVG × with an accessible name and a 52 px touch target. It removes the comment and its older revision duplicates, while preserving the decision and its revision/timestamp/inspection evidence. GitHub-synced deletion markers prevent old notes from returning after refresh, offline recovery or opening another device. Unsaved drafts and other comments remain intact.

## Artwork records

The fixed canonical animal/object references were supplied first in both generator requests. The actual requests, ordered references, raw transparent generator outputs, preparation settings, hashes and editable composite PNGs are retained in the current design area:

- [Nuss and Haus request / cell preparation](../design/artwork/generation-records/forest-objects-feedback-2026-11-17.json)
- [Haus source and preparation](../design/artwork/generation-records/puzzle-vocabulary-feedback-2026-11-17.json)
- [Eichhörnchen request and preparation](../design/artwork/generation-records/squirrel-portrait-repair.json)

Only the two reported subject cells and the squirrel portrait cell change. All other decoded visible RGBA pixels in their atlases are preserved. Exact presentation fingerprints are regenerated; human approval remains the owner's review action.

## Verification

Model tests cover the finite matrices and unique completions, deletion authorization, duplicate/history handling, persistence, failed writes and unchanged approval state. Repository tests cover independent devices, offline restart, concurrent decision conflicts, lost write responses, malformed markers and deduplicated uploads. The real phone/tablet UI tests cover touch targets, drafts, local-only edits, GitHub connection, cross-device refresh, fresh browsers and reload. The puzzle review suite solves the three affected 25-item pools and exercises native input for all 32 puzzles. Current style, artwork handoff, generated catalogue and design/offline checks are required before the branch is ready.

[Actual phone/tablet evidence](../design/evidence/2026-11-17-puzzle-feedback/README.md) includes the X buttons, Biber rows, cottage, squirrel portrait and hazelnuts.

Validation completed: **134 model tests passed**. `review-comments-browser.cjs`, `review-sync-browser.cjs`, the targeted 75-iteration `puzzle-review-browser.cjs` run (plus native input for all 32 puzzles), `design-system-browser.cjs` (all 32 puzzles × two viewports), and `gallery-images-browser.cjs` (all 38 PNG exports) passed. Canonical style, map calibration, library, generator handoff, generated catalogue, design/offline and whitespace checks passed.

Additional verification limit: `artwork-browser.cjs` fails its existing «illustrated exit remains a visible touch target» assertion at phone size. The exact same test fails at the same assertion against unchanged `main` commit `44130c3` served separately; this is a pre-existing den-exit check, outside these puzzle/comment changes. No unrelated exit/navigation changes are included.
