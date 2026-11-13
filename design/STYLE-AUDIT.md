# Visual consistency audit

Latest audit: 13 November 2026, feature branch 9.3.20. The dated entries below record earlier releases. This checks the active game against [Visual style](VISUAL-STYLE.md) and [Puzzle blueprint](PUZZLE-BLUEPRINT.md). It records implementation evidence; it does not grant editorial approval.

## Gameplay review — feature branch 9.3.20

Review now uses the production puzzle/trace viewport, with no sign-off footer or fixed-height review override. The rejection × uses the same control component and slot as the child's speech button, preserving the context row height. The overview retains competence, difficulty, iteration status and the single puzzle-level speech test.

Correct completion saves an exact-revision iteration approval and uses the normal 900 ms feedback/advance. Handwriting requires every stroke. A queue contains every unconfirmed iteration of the selected puzzle, including stale and improvement items, once per run. Rejections accept an optional comment and stay open for the next pass. The normal 2.2-second celebration ends the queue; only a fully approved current pool gains puzzle approval after the celebration. Refresh/reopening retains saved decisions and rebuilds the remaining queue. No separate sign-off form remains.

Bug fixes enlarge the small picnic return controls and phone mirror cells to at least 48 px. Syllable taps now render the actual tally dots: the previous array passed to `replaceChildren` became object text. Every one of the 35 syllable iterations now checks its tally and reset. Digit-writing quantity contexts were hidden by the legacy mystery-panel CSS, making three variants look identical; they now show a static drawn quantity row in both child play and review, including labelled empty baskets for zero. The review control is attached before fitting handwriting geometry. The rejection dialog pauses handwriting input, correct transitions lock out duplicate decisions, and failed saves stay visible with a retry. Review never completes invitations or writes a child's puzzle round. GitHub sharing, the offline outbox and conflict handling remain in place; no editorial approvals are shipped.

| Production-sized review | Tablet | Phone |
| --- | --- | --- |
| Addition | [View](evidence/2026-11-13-gameplay-review/add-1080.png) | [View](evidence/2026-11-13-gameplay-review/add-390.png) |
| Writing | [View](evidence/2026-11-13-gameplay-review/trace-1080.png) | [View](evidence/2026-11-13-gameplay-review/trace-390.png) |
| Digit quantity context | [View](evidence/2026-11-13-gameplay-review/trace-numbers-1080.png) | [View](evidence/2026-11-13-gameplay-review/trace-numbers-390.png) |

The layout audit compares review and child-play paper/context/writing dimensions for all **34 puzzles × 2 viewports** (1080 × 810 and 390 × 844), in addition to fonts, art roles, five leaves and no hint/footer checks. [Per-page report](evidence/2026-11-13-gameplay-review/report.json). [Nine-feather digit context on a phone](evidence/2026-11-13-gameplay-review/trace-numbers-nine-390.png).

The final browser run passed **all 1,048 finite solutions**, every digit quantity's visibility/count, native touch and mouse input across all 34 puzzles, syllable tally/reset, rapid taps, keyboard activation, drag/cancel handling and the next tap after closing a dialog. It completed the actual 36-item addition review and a seven-item writing review, rejected items without mandatory text, revisited only the remaining item, played both celebrations and left child saves unchanged. Save failure/retry, export/import, refresh and offline review also passed.

All 11 model suites passed, including whole-pool review, rejected/stale items, failed saves, revision invalidation and the GitHub repository cases. The separate browser checks passed shared GitHub decisions across independent/fresh browser storage, offline outbox/conflict choice and token isolation; the real child journey passed two invitations, five tasks per puzzle, the final home/sleep/game-over sequence, reload/offline lock and parent restart. The puzzle-only browser suite omits unrelated 3D-world startup; the journey and layout suites exercise that real integration. Browser fixtures intercept GitHub and use disposable storage. No checks grant editorial approval or write fixture decisions to the production data branch.

## Initial cleanup — 9.3.0

## Findings and corrections

| Finding before cleanup | Correction |
| --- | --- |
| Design index, README and working agreement each pointed to different “current” blueprints | One design index, one visual specification and one puzzle blueprint; competing plans moved intact into `archive/design-history/` |
| Heart Tree screens, engines and styles still loaded with the current game | Retired entry points/code/tests/styles archived, script and offline lists cleaned; old forest URL opens the current den; saved data keys preserved |
| Original friends used painted portraits, neighbours used painted-over renders and mailman used another image | All 13 characters plus sleeping fox now use one render atlas generated from the current world GLBs; letters/map/puzzle context/companions/finish use the same API |
| Vocabulary fox/beaver redirected to plush identity portraits | Scored nouns/actions now resolve to drawn Waldatelier subjects; character identity is a separate role; data checks forbid identity tokens in scored content |
| Toolbar used a painted icon atlas while back/explain used SVG; HTML retained a second icon drawing set | One sepia SVG family for utility controls; duplicate legacy symbols removed; painting rainbow resource preserved |
| Old handwriting-margin portrait and mascot fallback could show a competing cast style | Removed the retired margin picture; mascot uses the current model portrait |
| Unused character sprites, shops, old maps and woodland sheets were still downloaded | Archived unused assets and their former generation script; shared active world utilities retained and promoted |
| Some survey counts exceeded the five supplied voter portraits, silently falling back to fox | Explicit current-cast voter sequence covers every displayed vote; all survey iterations must render without a fallback |
| Writing still showed a legacy mystery/question-mark box alongside the shared page | Removed it during current puzzles; retain stroke starts and stroke-progress markers |
| Curriculum and developer docs described a five-puzzle draft or historical release restrictions | Current inventory/competence links and authoring instructions now describe the shipped 34-puzzle game |

## Verification and evidence

The design browser audit checks all 34 real puzzle pages at 1080 × 810 and 390 × 844: Andika learning titles, model identity portraits, drawn subject sources, five progress leaves, exactly one rule explanation, no hint controls, no horizontal overflow, current routes and preserved historical storage. The finite-content suite separately solves every iteration in the actual puzzle/tracing renderers and exercises review decisions, invalidation, backup and offline access. The journey suite exercises the parent allowance, invitations, actual five-task rounds, courier, return home, sleep and durable game over.

Validation completed for the current runtime:

- Design browser checks: **34 puzzles × 2 viewports**, including visible writing paper and real glyph paths. [Per-page report](evidence/2026-11-12/report.json).
- Finite content: **all 1,048 iterations** opened and solved in the real renderers. The first pass completed 810; the remaining 238 (all survey, reading and writing items) passed after the survey correction. Previews, release blocking, export/import, isolated saves, five-task celebration and offline review passed.
- Journey browser checks: Settings, invitation-only access, two letters/ten answers, actual return-home route, sleep/game over, reload/offline lock and parent restart passed.
- All **10 current model suites** passed; final content/revision/art suites passed again after the renderer correction.
- Repository checks passed: **84 live source files, 132 unique offline files, 34 puzzle mappings, 606 preserved originals**, all current Markdown links and runtime dependencies. The offline download is approximately **13.4 MiB**.
- Upgrade from **9.2.2** passed: old installation activation, cache isolation, partial-puzzle preservation, delayed drawing saves, failed download/offline recovery, first install and independent recovery page.
- The original **14 fixed visual references** pass their SHA-256 checker after archiving.

The [screenshots](evidence/2026-11-12/) were captured from the real 9.3.0 UI. The “Vorschau” strip belongs to adult review only; child puzzles do not show it.

| Example | Tablet 1080 × 810 | Phone 390 × 844 |
| --- | --- | --- |
| Addition: rendered companions with drawn apples | [View](evidence/2026-11-12/add-1080.png) | [View](evidence/2026-11-12/add-390.png) |
| Reading: same page and drawn subjects | [View](evidence/2026-11-12/friends-owl-1080.png) | [View](evidence/2026-11-12/friends-owl-390.png) |
| Syllable puzzle | [View](evidence/2026-11-12/read-puzzle-1080.png) | [View](evidence/2026-11-12/read-puzzle-390.png) |
| Writing: precise paths in the shared shell | [View](evidence/2026-11-12/trace-1080.png) | [View](evidence/2026-11-12/trace-390.png) |
| Final sleeping fox | [View](evidence/2026-11-12/game-over-tablet.png) | [View](evidence/2026-11-12/game-over-phone.png) |

Additional views: [den](evidence/2026-11-12/den-start.png), [pictured letter](evidence/2026-11-12/letter-tablet.png), [parent settings](evidence/2026-11-12/settings-phone.png).

## Owner review still required

Every puzzle and every iteration must be inspected in Settings → Puzzle-Prüfung and signed off or labelled **Verbessern**. Shared art/presentation changes produce a new implementation revision, so previous approvals become stale. No approvals are generated by this cleanup, tests or publishing. Keep notes on picture meaning, difficulty, sound comfort and physical iPad/Safari behaviour in the review workbench; export decisions as a backup.

The drawn task illustrations, model-rendered character identity and painted/3D world have distinct, documented purposes. Future additions must use those same roles and the existing page shell. Update the visual specification explicitly before introducing any new treatment.


## Owner review follow-up — feature branch 9.3.3

The owner requested a simpler review workflow. [The review guide](../docs/PUZZLE-REVIEW.md) and [puzzle blueprint](PUZZLE-BLUEPRINT.md) now define these rules:

- Settings retains its adult calculation. Opening the gallery from Settings needs no additional calculation; a direct review link still asks once.
- No reviewer field and no puzzle checklist. Open an iteration, then approve or flag it with a single click. Notes remain optional behind a disclosure, including for improvements.
- Test the shared spoken rule on the puzzle overview with **Spielerklärung anhören**. Iteration previews do not repeat that control; normal child puzzles retain **Spiel erklären**.
- Final **Puzzle freigeben** remains available once every current iteration is approved. New decisions omit reviewer/checklist metadata. Older backups remain readable; revision checks and separate child saves remain in place.

The branch also preserves main's 9.3.2 audio and iPad fixes. These screenshots show the actual review controls at tablet/phone widths, captured in an isolated review UI without starting the 3D world. No approvals ship with the app.

| Panel | Tablet | Phone |
| --- | --- | --- |
| Shared spoken rule | [View](evidence/2026-11-12-review-workflow/speech-1080.png) | [View](evidence/2026-11-12-review-workflow/speech-390.png) |
| Final puzzle decision | [View](evidence/2026-11-12-review-workflow/puzzle-signoff-1080.png) | [View](evidence/2026-11-12-review-workflow/puzzle-signoff-390.png) |
| Individual iteration decision | [View](evidence/2026-11-12-review-workflow/iteration-signoff-1080.png) | [View](evidence/2026-11-12-review-workflow/iteration-signoff-390.png) |

Review validation passed all 34 puzzle-level German speech requests, approval/improvement without text, optional notes, final sign-off without a checklist, backup import/export, 124 representative real iterations (addition, all letter forms and all digit contexts), all 34 phone/tablet preview routes, isolated saves, celebration and offline review. Model checks cover older metadata and reject approvals without a matching inspected revision. After including main's audio/iPad fixes, the review, letter-session and soundscape model suites passed; all 34 × 2 preview layouts and the complete parent-limited journey passed again. [Integrated layout report](evidence/2026-11-12-review-workflow/report.json).


## Shared review storage — feature branch 9.3.8

The owner's review decisions now use [GitHub review storage](../docs/REVIEW-STORAGE.md): a separate [data branch](https://github.com/MrTolchock/Drawing-App/tree/puzzle-review-data), automatic restoration, a local offline cache/outbox, exact-revision keys and explicit conflict choices. Only confirmed GitHub approvals release puzzles. Ordinary readers need no token; the owner connects once per editing session. Tokens are not stored in review files or exports. No child saves or drawings are uploaded.

The real public data endpoint was checked for browser access and initially contains no approvals. Storage tests use an intercepted GitHub API rather than real credentials or fixture writes to production. They cover fresh browser storage, refresh/reinstall recovery, offline edits, lost responses, concurrent-file retries, conflicting decisions, revision separation, legacy evidence, token expiry/isolation, batching/rate limits and large-file reads.

- [Fresh browser with restored review data, phone](evidence/2026-11-12-shared-reviews/fresh-browser-phone.png)
- [Shared review controls, tablet](evidence/2026-11-12-shared-reviews/synced-review-tablet.png)
- [All 34 × 2 integrated preview layouts](evidence/2026-11-12-shared-reviews/layout-report.json)

The cross-browser UI, 15 repository model cases, review/revision models, all 34 phone/tablet layouts, 124 representative real iteration previews, all 34 puzzle-level speech controls and the complete letter journey passed. The journey was also run alone after a concurrent-browser run exhausted its native-click timeout; it then passed reload, both letters, sleep/game over, offline lock and adult restart. The branch preserves main's latest iPad/forest-audio changes through 9.3.7. Existing fixed reference files and archive hashes remain unchanged.

## Additions on 12–13 November 2026 (releases 9.3.7 to 9.3.14)

World dressing only; no puzzle, letter, save or identity art changed.

| Addition | How it follows the visual style |
| --- | --- |
| Guiding lights as a tapering string of fireflies | Same warm glow family as the pollen motes; one draw call |
| Falling leaves, butterflies, dragonflies, little birds, bees, ducks, a jumping fish, paper boats (`world/life.js`) | Small flat cut-outs drawn in code in the world's palette, as the butterflies already were; no character identities and no scored learning subjects among them |
| Rainbow at the waterfall, sunbeams through the wood | Additive light like the den's existing shafts |
| Things to discover (`world/big/wonders.js`) | Built from the world's own rock, log, wood and bark materials with vertex colour; tall ones use the soft material so they turn translucent in front of Fuchs like trees |

Measured in Chromium (software rendering) standing at each new site: at most 106 draw calls (limit 150) and 188 k triangles (limit 350 k). The former budget walk test is archived with the legacy game, so a full walk was not repeated; the frame rate on the iPad is for the owner to check with `?perf=1`.
