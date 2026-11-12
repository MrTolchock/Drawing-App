# Visual consistency audit

Audit date: 12 November 2026. Release: 9.3.0. This checks the active game against [Visual style](VISUAL-STYLE.md) and [Puzzle blueprint](PUZZLE-BLUEPRINT.md). It records implementation evidence; it does not grant editorial approval.

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
