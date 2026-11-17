# Visual consistency audit

Latest audit: 16 November 2026, Waldpost 9.3.78. The dated entries below record earlier releases. This checks the active game against [Visual style](VISUAL-STYLE.md) and [Puzzle blueprint](PUZZLE-BLUEPRINT.md). It records implementation evidence; it does not grant editorial approval.

## Gallery drawing-style consistency — 9.3.78

The [manual audit](illustrations/GALLERY-STYLE-AUDIT.md) compares every one of the 235 gallery drawings. The majority uses warm watercolour washes, visible coloured-pencil marks, organic sepia contours and soft drawn shading. Sixteen animal-action pictures, sixteen woodland objects and six colour flowers had a smoother sculpted/plush/felt-like finish. Those 38 pictures now match the majority; the other 197 pictures and all 14 other atlases retain their original pixels. [Before/after](evidence/2026-11-16-gallery-style/comparison.png) and [whole corrected gallery](evidence/2026-11-16-gallery-style/all-sheets-after.png).

Subjects, stable IDs, cell order, action contrasts, animal markings, counted quantities and the six flower colours are preserved. Each subject has clean transparent cell corners and complete limbs/leaves inside its bounds. Exact prompts, supplied reference composites, drafts, padding repairs, final PNGs, hashes and manifests are retained in the illustration handoff. Navigation, den/door pins, backgrounds and model identity portraits remain unchanged.

All 112 model tests, all 31 puzzles at phone/tablet sizes, all 38 real PNG exports and the installed-app upgrade/offline checks passed. The shared progress leaf and celebration flower change, so all 31 puzzle rendering revisions reopen normally. A fresh reader with actual pre-redraw approvals correctly shows pending review, preserves history and makes zero writes. Compatibility tests use declared unchanged fixtures for the positive recovery case, rather than assuming today's changed artwork is still compatible. [Validation, screenshots and reports](evidence/2026-11-16-gallery-style/README.md).

## Simpler symbols and consistent navigation back — 9.3.77

Settings, map and envelope now use broad brown outlines, plain cream/ochre fills and a few blue/red marks. The realistic grain, tiny scenery, brass centre and postage decoration are removed. The new three-symbol atlas is separate; the den/home tree, exit-door pin and existing back arrow retain their original pixels. [Exact prompt, source and packing instructions](artwork/README.md#simplified-navigation-symbols--9377).

The map and shared topbar use one navigation-back component: the same drawn arrow, cream circular centre, brown rim/shadow, 56 px target and 40 px picture across Settings, galleries, review and puzzle/writing headers. Accessible names, keyboard activation and actual return routes are preserved. The legacy handwriting SVG handle remains hidden for compatibility; task-direction arrows stay separate.

- Simpler toolbar: [phone](evidence/2026-11-16-simple-navigation/navigation-390.png) and [tablet](evidence/2026-11-16-simple-navigation/navigation-1080.png).
- Same back treatment: [map](evidence/2026-11-16-simple-navigation/map-390.png), [Settings](evidence/2026-11-16-simple-navigation/settings-390.png), [puzzle](evidence/2026-11-16-simple-navigation/add-390.png) and [writing](evidence/2026-11-16-simple-navigation/trace-390.png).
- [Computed-style and real-route comparison](evidence/2026-11-16-simple-navigation/navigation-report.json) passed map, Settings, gallery, review, puzzle and handwriting, with phone and keyboard navigation. [All 31 puzzles × two viewports](evidence/2026-11-16-simple-navigation/layout-report.json) passed the existing layout/role contract; all 112 model tests passed.

The [source/pin hashes and revision comparison](evidence/2026-11-16-simple-navigation/art-and-revisions.json) prove the existing pin atlas is byte-identical and all 31 puzzle revisions remain unchanged. No approvals or production review records are written. The new CSS and symbol atlas are included in the offline cache.

Main's 9.3.76 landscape changes are integrated. All 112 model tests and the navigation comparison passed again on the combined runtime; upgrade checks from 9.3.76 passed partial-work/dialog protection, saved-data retention, failed-download/offline recovery, first install and the independent recovery page. The offline fixture waits for startup before testing the separate manual update control. [Validation record](evidence/2026-11-16-simple-navigation/README.md).

## Drawn navigation, letter and shared image library — 9.3.75

Settings, map, envelope, den/home, door and back now use one drawn pencil/gouache atlas: honey wood, cream parchment, sage leaves and red wax. Their accessible button names and adult gate remain intact. The navigation pictures render as squares inside the existing 48 px or larger targets; the back picture keeps its drawn colours. Puzzle utility controls retain the shared quiet SVG family.

The letter uses newly illustrated cream paper with real transparent edges, a leaf stamp and postmark. The current sender's model portrait is added separately in the clear left half; there is no generated substitute character. The complete letter fits tablet, phone and short landscape screens, and keyboard focus remains visible.

- [Phone navigation](evidence/2026-11-16-artwork/navigation-390.png) and [tablet den](evidence/2026-11-16-artwork/navigation-1080.png).
- Illustrated letter: [phone](evidence/2026-11-16-artwork/letter-390.png), [tablet](evidence/2026-11-16-artwork/letter-1080.png) and [landscape](evidence/2026-11-16-artwork/letter-844.png).
- [Phone map](evidence/2026-11-16-artwork/map-390.png), including drawn home, invitation and back pictures.
- Central picture library: [tablet](evidence/2026-11-16-artwork/image-library-1080.png) and [phone](evidence/2026-11-16-artwork/image-library-390.png); [browser report](evidence/2026-11-16-artwork/report.json).

All 235 registered puzzle drawings across 17 atlases remain together in `assets/waldatelier/`, with their original IDs, cells and runtime paths. The new searchable library records actual use by the 31 puzzles, copies IDs and exports individual transparent PNGs from existing cells. It operates independently of game/review storage. Its generated catalogue is checked in CI.

The [artwork handoff for Claude](artwork/README.md) retains the exact new prompts, supplied references, editable PNGs, source hashes and preparation manifests. It indexes recovered historical prompts and explains every known generator role, including the den and the one clearing shared by puzzle pages, menus and Settings. Missing final historical prompts are explicitly distinguished from new reconstruction recipes. The picture map, model portraits and procedural world have their actual code pipelines documented.

All 31 puzzle revision IDs remain identical to 9.3.74, preserving existing review decisions. No review data or approvals are written by this change or its browser fixtures. All 112 model tests, all 31 puzzles at two viewport sizes, the complete letter journey and the new artwork/library browser checks passed. Installed-app checks from 9.3.74 passed partial-work retention, dialog protection, complete offline installation, failed-download recovery and the independent recovery page. [Source/runtime hashes and revision comparison](evidence/2026-11-16-artwork/art-and-revisions.json) and the [validation record](evidence/2026-11-16-artwork/README.md) accompany the screenshots.

## Published approval recovery and review comments — 9.3.72

The [feedback record](REVIEW-FEEDBACK-2026-11-15.md) maps all 26 new comments to the final changes, including complete-puzzle requirements and three removals. The library now has 31 puzzles and 953 iterations. It includes the drawn wildlife fox, simpler hedgehog clues, animal-only word choices, corrected nature wording, direct berry/story placement, cleaner quantity/number controls and visible, matching mirror leaves. Phone/tablet evidence is linked in that record.

Per-puzzle rendering/CSS/picture-cell fingerprints replace the global fingerprint. A fresh reader recovers the squirrel's existing published approval without a token or write; later compatible rejections still block it. Changed puzzles reopen automatically. Review history, local saves and the separate data branch remain intact. The implementation, browser and offline/update checks are recorded with the feedback; none grant new editorial approvals.

## Waldpost name — 9.3.27

The game is now **Waldpost** in the browser title, Apple home-screen metadata, manifest name/short name, Settings version label, recovery page, icon accessible name, export filenames and current documentation. The usage export adds `appName: "Waldpost"`. Existing storage keys, JSON format identifiers, app ID/start URL/scope, cache prefix and updater messages retain their compatible identifiers. The icon's embedded artwork is byte-identical.

The rename uses the existing fonts, settings card and recovery page. [Actual phone Settings](evidence/2026-11-13-waldpost/settings-phone.png); [browser metadata/export report](evidence/2026-11-13-waldpost/branding-report.json). The browser check verified both export filenames, the developer toggle, the new name and version, complete offline installation and the recovery page without writing review decisions. It isolated the branding UI from another forest build; the separate installed-app suite exercised the full world and upgrades from current main's 9.3.24.

All twelve model suites, generated catalogue/fingerprint, design/archive checks and fourteen fixed visual references passed. Installed-app checks passed old-to-new activation, unfinished-puzzle retention, dialog protection, failed download/offline recovery, first install and recovery-page activation. This release includes the preceding local usage log and developer-mode work and preserves main's landscape changes. Editorial approvals remain separate.

## Developer-mode logging switch — feature branch 9.3.26

**Einstellungen → Zum Testen → Entwicklermodus** uses the existing Andika settings card and checkbox control. The selection persists in the browser, the log card announces that recording is paused, and forest navigation uses the existing **ENTWICKLUNG** marker. [Actual tablet](evidence/2026-11-13-developer-mode/developer-mode-1080.png) and [phone](evidence/2026-11-13-developer-mode/developer-mode-390.png) views.

While enabled, the shared recorder adds no events or definitions, including startup, answers, timing and forest movement. Existing usage history stays available for export. Switching off resumes observations. Puzzles entered during testing detach from the earlier usage run; a resumed tested iteration has no fabricated first-try result. Gameplay state, parent limits and review requirements keep their normal behaviour. The older isolated `?dev=1` route is also silent and its menu switch can return to the normal URL.

All twelve model suites passed. The expanded real-browser play-log suite passed zero test events/definitions, retained history and actual export, full on/off reloads, the visible navigation marker, correct normal recording after testing, separate resumed run IDs, unknown first-try status for tested work, and legacy URL exit. The last URL/preference assertion omits another forest build after prior complete normal-world reloads. Phone/tablet checks passed overflow and 48 px minimum label targets. Screenshots use disposable fixture data; usage-log exports remain local. Catalogue, design/archive checks and GitHub CI passed for the runtime. Puzzle art, layout and interaction continue to use the preceding shared audit.

## Local gameplay observations — feature branch 9.3.25

Settings now offers **Lokales Spielprotokoll**, with full-width export/delete buttons using Andika and the existing cream/sage settings card. Both controls retain at least 52 px height and wrap labels on phones. The manual **Spielstand sichern** control is removed. The automatic invitation/allowance/unfinished-round state remains independent of the log; there is no successful-save banner in the child interface.

The [AI-readable local export](../docs/PLAY-LOG.md) records exact task/revision definitions, actual selections and explicit outcomes, rule/reset/input events, foreground task times and flow observations. It excludes adult puzzle previews and raw handwriting paths. Hidden/dialog/feedback/celebration time is excluded; a page-cache suspension pauses and resumes its existing visit. Choice-question first-try summaries require an observed beginning; construction/tracing have no misleading first-try score. There is no automatic upload or difficulty change.

- [Actual Settings card, tablet](evidence/2026-11-13-local-play-log/local-log-1080.png) and [phone](evidence/2026-11-13-local-play-log/local-log-390.png).
- [All 34 puzzles × 2 viewport layout checks](evidence/2026-11-13-local-play-log/layout-report.json), including child/review geometry, font/art roles, writing, five leaves and no hint/footer checks.
- All twelve model suites passed; the recorder/revision suites passed again after idle-expiry and page-cache fixes. Tests cover exact definitions, timings, interrupted visits, compatible old logs, storage/size bounds and failure isolation.
- The real browser export passed exact wrong/correct answers, dialog/page-cache time exclusion, same-run reload, robot controls/reset, writing outcomes, review exclusion, actual JSON download and delete/cancel isolation. The exported fixture stays in `/tmp`; no child observation data is committed to GitHub.
- The complete real journey passed fifteen outcomes, three completed puzzles/celebrations, offline log retention, parent allowance, short reachable courier approaches at all eleven hosts and home/sleep/game over. The 610 archived originals and fourteen frozen visual references remain intact.

Logging is part of the shared puzzle blueprint for future additions. It does not grant editorial approval or change the existing GitHub review ledger.

The 124 addition/writing iteration regression also passed native touch/mouse for all 34 puzzles at both sizes, rapid/keyboard/drag/cancel input, sound/mute, whole-pool review, optional rejection, save retry, celebrations and offline review. Main's landscape work through 9.3.24 is integrated; the combined branch is 9.3.25.

All twelve model suites and the full local-log browser check passed again on the integrated 9.3.25 branch. Installed-app tests from 9.3.24 passed partial-puzzle preservation, dialog protection, retained local/IndexedDB data, failed-download/offline recovery, first install and the independent recovery page. The update fixture now waits for startup and its initial update check to finish before simulating a separate resume. The screenshots above were refreshed on 9.3.25. GitHub's Puzzle contract check passed for the integrated runtime.

## Letter variety and quiet menus — feature branch 9.3.21

- The courier waits outside the 3.2 m interaction radius, normally 5.4–7.2 m from Fuchs, with reachable alternatives around bends. He stays at that spot while delivering a letter. Tapping him starts a short walk before the next invitation opens.
- Friends and each friend's approved puzzle types use saved shuffled bags. New journeys avoid the previous recipient, bags avoid immediate repetitions and puzzle selection prefers a different interaction when possible. Reloads keep the active letter, bag order and unfinished puzzle. Legacy mail recipients and save data are retained.
- Menu, navigation and review activation sounds are removed, including the dialog-opening tone. Puzzle task/answer clicks, correct/retry feedback, handwriting sounds and celebration remain controlled by Spielklänge.
- Drawing and saved-picture screens are preserved under [retired drawing](../archive/retired-drawing/README.md); they no longer register or enter the offline bundle. Their den hotspots and projection pins are removed. The den painting itself is unchanged: table, pencils and picture pile remain visible. Existing local drawing records are retained.

[Den with table/picture pile and no drawing icons](evidence/2026-11-13-letter-variety/den-no-drawing-controls.png).

The model suites passed shuffled-cycle coverage across all eleven friends, varied starts across 40 deterministic seeds, restart/reload stability, shuffled puzzle bags, interaction variety and unfinished-round restoration. The review regression passed 124 addition/writing iterations, native touch/mouse input across all 34 puzzles, silent menus and preserved puzzle click/mute feedback, review queues/rejections, celebration and offline storage. The real journey browser check passed short reachable courier approaches at all eleven friend locations, actual walking before opening the next letter, silent parent menus, retired drawing routes, randomized invitations, ten answers, home/sleep/game over, offline reopening and a writing invitation. The 34 × 2 phone/tablet layout audit passed, including unavailable drawing routes; [layout report](evidence/2026-11-13-letter-variety/layout-report.json). Upgrade tests from 9.3.20 passed active-puzzle/dialog protection, retired-route checks, existing IndexedDB drawing retention, failed-download/offline recovery and first-install/recovery-page behaviour. All 606 earlier preserved files and 14 frozen visual references remain intact; the four retired screen originals add four preservation records.

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

**13 November 2026 (release 9.3.28).** The Rock's plateau gains a snow-capped peak (terrain, not a model), a summit cross with cairn and a snowman built from the world's materials, and the picture map is redrawn from the world with `tools/map/render.cjs`. Snow uses a cool white that turns slightly blue in hollows; ground cover is kept off it.

**13 November 2026 (release 9.3.29).** Weather: occasional showers grey the sky and haze, dim the sun (softer shadows) and darken the ground while it is wet; rain is drawn as thin pale streaks with small splash rings, snow on the peak as round flakes. No new pictures or identity art.

## Review comments — 14 November 2026 (9.3.36)

Addressed all five nonempty comments in the [shared review ledger](https://github.com/MrTolchock/Drawing-App/blob/puzzle-review-data/reviews.json), read at file SHA `3a41f96c7ba51aaac50da119df7d554774f8b712`:

| Reviewed item / comment | Revision |
| --- | --- |
| `friends-owl/sentence-4`: “Does not fit principle of rest” | Replace the lone fish/mouse comparison with the sleeping mouse and other mouse actions, matching the other short sentence tasks. |
| `friends-owl/sentence-12`: “Dog looks like three ears” | Redraw the sleeping dog with a smooth crown and exactly two floppy ears. Replace only its existing atlas cell; all other cells retain exactly the same decoded pixels. |
| `friends-owl/pair-0`: “Does not fit to others, just one animal at a time” | Revise all ten two-sentence tasks to describe one animal. Each answer picture contains one animal; distractors compare its action or identity. Preserve the saved iteration IDs and the 25-item pool. |
| `friends-beaver/matrix-3`: “For all make more clear that there are three rows. Now looks like block of 9” | Group every matrix into three outlined horizontal rows with generous spacing and three cells each, including accessible table/row/cell semantics. |
| `friends-beaver/matrix-20`: “Also better use triangle instead of quadrat and rectangle” | Every matrix now contains circle, triangle and square. Remove the square/rectangle comparison, retaining 25 distinct row-order/missing-position configurations. |

The page, exact geometry palette and drawn learning art follow the existing visual specification. [Phone/tablet evidence and layout results](evidence/2026-11-14-review-feedback/report.json) cover all 25 matrices at both widths, single-animal answer cards, the revised dog and native touch answers.

Regenerating the shared puzzle implementation fingerprint reopens prior sign-offs as **Geändert · Offen**, including unrelated approvals covered by that fingerprint. The 9.3.35 gallery and release-independent revision handling are retained; the former-implementation carry-over list is cleared because this release changes actual puzzle content, art and rendering. A read-only snapshot of the real ledger confirms all five comments remain available and all 68 latest approved records reopen; neither improved puzzle is released for child play. Historical decisions remain on the separate data branch. No production review writes or automatic editorial approvals were made.

## Review comments — second pass, 14 November 2026 (9.3.37)

Read the latest **Verbessern** records from the [shared review ledger](https://github.com/MrTolchock/Drawing-App/blob/puzzle-review-data/reviews.json), file SHA `d192e6ce4d1e0db6c626e10a753af7088b9d0b2f`. Current-revision comments take precedence; older unresolved comments are checked against the current content as well.

| Comment | Result |
| --- | --- |
| `friends-bird/rhyme-16`: reversed pairs such as Tisch/Fisch and Fisch/Tisch must count once | Keep the 16 distinct existing pairs and replace all nine reversed duplicates with new pairs. The new pairs are Nuss/Bus, Boot/Brot, Biene/Schiene, Schnecke/Decke, Sonne/Tonne, Kanne/Tanne, Mund/Hund, Dach/Bach and Ziege/Fliege. New noun illustrations support the added vocabulary; the pool remains 25. |
| `friends-owl/sentence-4`: keep two pictures throughout | Restore exactly two pictures for the sleeping mouse and assert that count for all 25 owl tasks. |
| `friends-owl/pair-2`: always one sentence and two pictures; add variety by drawing more animals | Replace all ten two-sentence tasks with ten single sentences using new drawings of a squirrel, hedgehog, badger, roe deer and frog, each in two actions. Every owl task compares two actions of the same animal with the same prompt. Saved iteration IDs are retained. |
| `friends-hedgehog/riddle-17`: use Swiss forest animals rather than elephants and similar animals | Replace the entire 25-item riddle pool with local woodland, woodland-edge and brook wildlife. Every distractor also uses that set. New drawings add a woodpecker, bat, tawny owl, robin, lynx and pine marten. No zoo or farm animals remain in this puzzle. |
| Older `friends-owl/sentence-12` and `pair-0` comments | Retain the corrected two-eared sleeping dog and single-animal pictures from 9.3.36. The new one-sentence/two-picture rule also addresses the older consistency request. |

The two companion atlases use the existing drawn learning-illustration style and transparent cells, with no model portraits substituting for scored animals. Both are registered for offline caching. [Phone/tablet evidence and review-reopening checks](evidence/2026-11-14-review-feedback-2/report.json) cover all 75 revised iterations. Review comments and historical decisions stay in the ledger; changed revisions reopen for owner review and are never automatically approved.

## Forest polish — 14 November 2026 (published as 9.3.53)

Developed on a branch in checkpoints numbered 9.3.37–9.3.52 in parallel with main's 9.3.37 review release; both are published together as **9.3.53**. The version labels below name those branch checkpoints.

World-only changes (no puzzle pages, identity art or learning pictures touched; the puzzle implementation fingerprint is unchanged unless noted).

**9.3.37.** The squirrel bounds in short dashes and stops to glance round, flicks its tail and nibbles; the deer walks without bobbing, grazes with flicking ears and lifts its head to look at Fuchs. Friends greet Fuchs with a brief hop and then stand and look at him instead of hopping without end. The pond's ducks, jumping fish with ripples, the paper boats on the brook and the sunbeams in the wood move again (their update was lost in 9.3.23). Same plush models and materials; poses only.

**9.3.38.** The picture map shows where Fuchs is: his model portrait in a sage teardrop pin (not a button), its tip on his spot with a slow pulse (static with reduced motion); in the den it stands at home. The home pin now uses the shared `home` utility icon instead of a second fox portrait, so the two cannot be confused. On a phone the map opens scrolled to Fuchs.

**9.3.39.** A friend who is not on the letter still answers a visit: they turn to Fuchs and show a little trick (the squirrel and badger dig, the beaver slaps its tail, the owl turns its head right round, the mouse spins, the tit and kingfisher flutter, the hedgehog rolls up, the deer and frog leap, the fish jumps), then turn and point the way to the letter's friend, the mailman or home. Poses of the same models with a few dust puffs; no extra puzzle and no change to who may start one.

**9.3.40.** Fuchs reacts at the things to discover when he stops beside them: he sniffs a berry bush, holds his paws to the picnic fire, leans over the well (his little call comes back three times, softer each time), pokes his head into the hollow log (a hollow knock) and looks up into an apple tree. Poses of the same model; the sounds are made in the browser like the other forest sounds and follow the Waldklänge setting.

**9.3.41.** Paw prints (`world/footprints.js`): left and right in turn where the ground keeps them: in snow (cool blue-grey, longest), in the swamp's mud and on the brook and pond banks (dark brown), and on paths and grass while the ground is still wet after a shower. They lie flat on the slope and fade slowly. One instanced draw call, a small drawn paw shape; nothing with reduced motion.

**9.3.42.** Rain is drawn as fine streaks stretched along each drop's fall (bright head, fading tail), slanting with a soft gusting wind, finer and fainter with distance; rings on water and small crowns of droplets on the ground; the peak keeps round snowflakes. Dragonflies hover with a slight drift and glide along soft eased curves, mirroring smoothly instead of flipping upside down. Fisch lives on the west side of the plunge pool, clear of the trees, and swims slow rounds there. The swamp's basin lies a little lower, so more of it is open water that Fuchs cannot wade, as at the pond; the boardwalk, the paths and every friend stay reachable. The picture map is not redrawn for the slightly larger swamp water.

**9.3.43.** Sound only. The wood sings like a Swiss mixed forest, weighted by how common each bird is: chaffinch, blackbird, robin, wren, blackcap, song thrush, great and blue tit and nuthatch; coal tit and goldcrest in the spruce; wood pigeon, and rarely cuckoo, woodpecker and jay. Songs use curved syllables with light vibrato. Each place has its own touch: a hollow knock now and then in the old wood, songs echoing off the Rock (a delayed, duller copy from the other side), and single gusts of wind on the snowy peak (still no steady wind). All are in `tests/audio-preview.html`.

**9.3.44.** The Rock is lower (plateau 9 m instead of 11.5 m, peak 10.5 m above it instead of 13 m) and its sides rise over about fourteen metres of ground instead of a few, so from the paths they read as a rocky hillside rather than a wall; only where the waterfall drops is it still a cliff. Snow, summit cross, cairn and snowman are unchanged and sit on the lower summit. The summit trail, the plateau and all friends stay reachable. The picture map is not redrawn (the outline is the same).

**9.3.45.** The time of day follows the letter journey: fresh morning light for the first letter, a golden afternoon in the middle, dusk on the walk home (orange low sun from the west, deeper sky, warmer haze). The light eases between them over half a minute and the sun crosses the sky (the static shadow map is redrawn only now and then while it moves). At dusk the den's round window and the lanterns glow, fireflies dance round Fuchs and the butterflies and little birds go to rest. Morning mist lies over the swamp, the pond and the plunge pool and lifts by the afternoon (a little rises from wet ground after a shower). After some showers a rainbow stands far off in the haze, seen between the trees; puddles gather in the dips of the paths and dry slowly. New pictures are soft shapes drawn in code (`world/ambience.js`). The den painting is unchanged.

**9.3.46.** Camera: it stands a little further back where the view is wide (meadow, the Rock and its peak, open water, near the waterfall) and closer in dense wood, easing between them. Before a puzzle opens there is a short close shot of Fuchs with the invited friend (about 1.3 s; none with reduced motion). Two fingers pinch the view closer or further within a narrow range (also ctrl/trackpad wheel); a pinch never counts as a tap to walk.

**9.3.47.** Fuchs moves with more character: a little quicker on open earth paths, slower on rock, boards and when wading through the shallow edge of the pond or swamp (with white splashes), sliding down the snow leaning back with his paws in front, hopping onto the log bridge and from stone to stone, and shaking himself dry once he stands still after rain or wading. Poses of the same model.

**9.3.48.** The badger's sett is no longer a smooth grey dome: the mound is shaped like the woodland floor it grows from (a soft, uneven hillock whose rim takes the ground's own colour), grassy and mossy on its back with bare dug earth on the front round the entrances; the spoil in front is sandy earth. Roots, holes, bedding and stones are kept.

**9.3.49.** Grass, flowers and ferns bend aside round Fuchs, the mailman and the three friends nearest him (the tops of the plant cards lean away and dip a little; same plant atlas and material). Atlas coordinates of plant cards sit a hair inside their cells so the shader can tell a card's top from its foot; there is no visible change to the pictures.

**9.3.50.** Small chains of cause and effect: the fish often jumps near a duck and its spreading ripple rocks her as it passes; little birds flying up startle the squirrel close by, who dashes off a few steps, and make the deer lift its head and listen for a while.

The mailman (same model) also walks his own round on the paths near the den between letters, pausing at each stop, and whistles once from where he is when a new letter is ready. Walking into a big open area (meadow, Rock, peak, swamp) for the first time in a while, the haze stands close for a moment and lifts over a few seconds (not with reduced motion).

**9.3.51.** Speech (requested only, unchanged rules): the best German voice on the device is chosen (enhanced, premium or natural voices first, Swiss German before German, robotic engines avoided, offline voices when there is no network); characters keep the voice's own pitch with only small differences, at an easier pace; text is read sentence by sentence with dashes as pauses. Real voices differ by device: the owner should listen on the iPad.

**9.3.52.** A cave in the Rock's south flank, east of the waterfall, reached by a short trail from the owl's path. The ground is cut flat into the hillside and a rock shell closes it over: its outer face follows the hillside (from outside one slope with a dark arched mouth, boulders at its sides), inside a low vault comes down to the floor at the sides and the back. The roof turns translucent round Fuchs like the trees, so he stays visible inside. Inside: stone stalactites and stalagmites, glowing crystals (unlit colours with soft halos), pale mushrooms, glow-worms on the ceiling and a still pool. In the cave the camera comes a little closer and the haze dims; Fuchs' call echoes when he steps in, water drips and rings back, footsteps echo and the birds fall quiet. All made from the world's own materials and simple shapes; no new pictures. The picture map is not redrawn.

**9.3.54.** Adult screens only. Puzzle-Prüfung loses the file export/import and the search field, opens (and opens each puzzle) at the top, and each puzzle has **Alle bestätigen** next to the review button, which approves all current iterations and the puzzle together after a confirmation. Settings: the **Schrift zum Lesen** choice is gone, children always read upper and lower case; **Anzahl Briefe** is a slider from 1 to 10 with the number shown beside it. Short spoken rules are read in one piece again (long texts are still read in groups of sentences). The puzzle implementation fingerprint is unchanged.

**9.3.55.** The paper boats on the brook are gone. The world's own buttons (map, letter, adults' settings, home, door) use painted pictures in the world's warm palette on round wooden medallions (`js/friends/hud-art.js`) instead of the thin utility line icons, so they match the den painting and the plush cast; the picture map's home pin shows the den tree. Puzzle pages keep the shared utility family, so the puzzle fingerprint is unchanged.

**9.3.56.** Speech: Settings → Klänge im Wald offers **Stimme zum Vorlesen**, the German voices on the device best first (marked «hohe Qualität» for premium/enhanced/natural ones), with **Probe hören**; «Automatisch» keeps choosing the best one. A note explains how to download a Premium or Erweitert German voice on the iPad (Bedienungshilfen → Gesprochene Inhalte → Stimmen → Deutsch), which is the biggest gain in quality the browser allows.

**9.3.57.** Wind: grass, flowers, ferns and tree leaves sway in slow waves that travel across the ground, with gusts and calm spells, more in the rain, in the meadow and high on the Rock; still with reduced motion. Same plant and leaf materials (vertex shader only).

**9.3.58.** Ground detail near Fuchs (`world/big/decals.js`): small drawn things lying flat on the woodland floor, painted in code in the world's palette on one atlas: root flares at the foot of every tree, moss cushions and lichen near trunks, spruce needles with cones, pebbles and twigs along the path edges, trodden patches on the paths and fallen beech leaves. Near tiles only, one extra draw call per tile.

**9.3.59.** Distance: the band that hides the world's edge is painted with layers seen above the trees, a far row of snowy Alpine peaks, hazy blue-green hills and the wooded edge, each melting further into the area's haze (and following the time of day and weather through the haze colour).

**9.3.60.** The picture map is redrawn from the world with `tools/map/render.cjs`: the lower, gentler Rock, the larger open water in the swamp and the cave (its rock roof and a dark arched mouth on the cave trail).

**9.3.61.** Characters in the forest stand on the lowest ground under their feet, so they no longer float on slopes; friends squint happily at the end of a trick and while greeting Fuchs; at dusk the plush fur catches a warm orange rim light. Same models and materials (a uniform in the plush fur shader, 0 outside the forest).

**9.3.62.** Small creatures to find on the ground near Fuchs: snails that creep, ladybirds that scurry and stop, and little frogs near the water that hop away when he comes close; drawn small in code, hidden in the rain and at dusk. A soft warm wash in the middle of the frame (in the existing vignette overlay, no extra pass) brings the forest closer to the den painting's warmth.

**9.3.63.** No more rainbows: the one in the waterfall's mist and the one after showers are removed.

**9.3.64.** Characters in the forest: the plush fur catches the low sun as a golden rim on the edges that face it, stronger when a friend stands against the light (follows the sun through the day; off in the den, which keeps its painted light), and the painted catchlights in the eyes glow a little so the eyes look wet and alive. Same models; portraits are not re-rendered, so the puzzle fingerprint is unchanged. A tufted fur fringe was tried and rejected (noisy outline, wrapped over held props).

**9.3.65.** The gallery's **Zur Puzzle-Prüfung** no longer asks for a second adult calculation: once past the gate, moving between Settings, the Puzzle-Galerie and the Puzzle-Prüfung opens directly. Other ways in still ask once.

**9.3.66.** The cave is rebuilt and about three times as deep: a winding passage into the Rock that opens into a hall with a glowing underground lake, crystals, dripstones, columns and glow-worms. Inside, the rock is drawn with its own light (daylight from the mouth, the glow of crystals, mushrooms and lake, baked per vertex) and a shared wrapping rock texture (bedding lines, cracks, glints); the camera comes down and looks in from behind Fuchs, the rock around is black. Bats hang in the hall, wake when Fuchs comes, and hunt over the mouth at dusk (asleep with reduced motion); they have a soft flutter-and-squeak cue. No puzzle or character art changed; the puzzle fingerprint is unchanged.

**9.3.67.** A new character in the forest: the Steinbock, sculpted and baked in the same plush pipeline as the cast (grey-brown fur, cream chest and muzzle, long ribbed horns swept back, a little beard), standing on a crag at the Rock's rim. He has no puzzles, letters, portrait or map pin, so the identity atlas and the puzzle fingerprint are unchanged; he shows a trick and points the way when Fuchs visits.

**9.3.68.** Biber's dam and lodge are rebuilt (`world/big/beaver.js`): bent, tapered sticks in several barks and peeled wood, heavy foot logs, a brushwood mat, crest poles, drift, grass and leafy branches, two spills with foam; the lodge is thatched all round with a crown of sticks, an arched door with a warm light at dusk and a raft. Same materials and textures as before.

**9.3.69.** Rock surfaces: the Rock's cliffs and stony ground, the cave's roof and mouth and the boulders carry a shared rock texture laid on from three sides (level bedding lines, cracks) with a soft relief, in place of smooth grey sheets. The ground is shaded a little where trees and big rocks meet it. Ground and rock keep their colours and materials otherwise.

**9.3.70.** Fuchs, the mailman and the friends beside him cast real shadows with their own outline that follow the sun through the day (four small shadow pictures at most, laid on the ground along the sun's rays); the soft blobs under the feet remain as a fainter contact shade.

**9.3.71.** Water: reflections of the sky and of the trees' dark as soft streaks, light on the bed in the shallows, sun glitter that follows the weather and the hour, and a lapping line of foam along the shores of pond, pools and swamp. Same water colours.

**9.3.73.** The picture map is repainted from the world as a storybook map (`tools/map/map.html`, 1800 × 1200): a lit wash of the land, sharp water with shore and waves, dotted trails, every tree drawn small, the places as small drawings (den tree, dam and lodge, bridges, the deeper cave with its hall, summit cross, well, picnic fire, signposts, toadstool house, stone circle, apple trees, sett, the Steinbock), the wood running out into paper at the sides, a compass and the name on a ribbon. Pins sit where they sat (`MAP` unchanged).

**9.3.74.** The peak's snow stays on all but the steepest rock: the dark, jagged smudge of half-covered rock on its flank is gone.

**9.3.76.** After the owner's review: the water is as it was before 9.3.71 (the reflections, glitter and shore foam are taken out again); the rock outdoors shows cracks and soft patches with only a faint hint of level beds instead of strong horizontal lines; the cave's way in is a round arch of mossy rock in a rounded outcrop, daylight lies on its threshold when seen from outside, and the crystals no longer glow out of a black mouth by day.
