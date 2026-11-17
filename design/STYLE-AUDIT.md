# Current visual consistency audit

Current game art: **Waldpost 9.3.92**. The canonical medium remains **`waldpost-watercolour-pencil-v1`**, with frozen animal/object reference pixels and **35** complete forward image-generation prompts.

## Stay on the Steg in Frosch's swamp — 9.3.87

The soft bog is no longer walkable merely because it sits above the water. The wooden boardwalk starts further north on firm ground and its five connected sections remain the way into the swamp. Fuchs stops on the centre of its final section beside Frosch. The grid route planner permits diagonal movement along the same crossing or crossings sharing a real endpoint, preserving the connected narrow deck without permitting ordinary blocked corners to be cut. Routes can also begin and end inside one plank.

World-navigation checks sample routes to Frosch and back from every named destination, plus the whole bog and every boardwalk joint. The real-game browser check covers both travel directions, manual steering against the edge and blocked ground destinations at phone/tablet sizes. The adopted map painting, character locations/pins, learning artwork and all puzzle definitions and presentation revisions are unchanged; this world change requires no new puzzle approvals.

## Feedback survives changed graphics — 9.3.86

The [15 November follow-up](../docs/PUZZLE-FEEDBACK-2026-11-15.md) accounts for all 26 original improvement notes, including those attached to older artwork. Existing fixes for animal-only answers, natural wording, centred apples, drag/drop, control sizing, memory-picture size, matching mirror leaves and the three removed puzzles are retained and rechecked against the current game.

The remaining syllable prompt no longer asks for clapping. All hedgehog questions now use at most six words and describe a feature visible in the two current pictures, removing lifecycle/behaviour recall and the ear-tuft metaphor. The existing canonical pictures, animal identities and stable task IDs stay in place.

Fresh browsers restore older GitHub notes into read-only history. Puzzle details expose their original dates, distinguish earlier versions and link to the current task. Notes cannot grant approval or become an upload through restoration; the remote review ledger is untouched. Only the two changed puzzle definitions require new review; unrelated puzzle presentation and sign-offs are retained.

Validation: all 126 model tests pass. The feedback browser suite passes native mouse/touch gestures and keyboard alternatives at 390 px and 1080 px. The GitHub sync suite passes fresh-device historical notes, history-only refresh, filters and links to current tasks, alongside its existing save/conflict/offline checks. Design-system and historical-approval compatibility browser checks pass. Canonical style, image library/handoff, calibrated map, generated catalogue and offline/legacy/link checks pass. Evidence is under `/tmp/waldpost-feedback-sync`, `/tmp/puzzle-feedback` and `/tmp/design-system`.

## Smooth stones and matching water — 9.3.85

The 3D world's big stones no longer look cut from polygons: boulders, scree, the cave-mouth and waterfall boulders, the stepping stones, the bridging stone and the stone circle are welded, softly shaded spheres, and the large ones use a finer sphere with the same shape. The stepping stones are rounded stones instead of nine-sided posts. Standing water (pond, plunge pool, swamp) again looks like the flowing brook. Two things set it apart although the water shader itself was unchanged since before 9.3.71: the morning mist added in 9.3.45 lay only over still water, and the first letter of every journey is in the morning, so the pond and plunge pool read almost grey beside the blue brook; and from the camera's further-back view of open water the pools took so much sky that they read as pale turquoise. The morning mist over the pond and plunge pool is removed (the swamp keeps its own mist), and still water shares the brook's ripple size/strength and takes less sky. Measured on the same morning frame, the pond moved from rgb(159,178,172) (saturation 0.11) to rgb(81,132,130) (0.39), beside the brook's rgb(80,129,118) (0.39); in the afternoon from rgb(100,137,131) to rgb(82,129,124). Painted UI assets, puzzle art and puzzle presentation are unchanged, so no review revision changes.

## Steinbock as a letter friend

The Steinbock writes letters and has his own puzzle, **Bergmuster** (`friends-ibex`, 30 iterations): repeating groups of the drawn stone, fir and flower (AAB, ABB, ABC, ABAC, AABC in all six orders), the empty place at the end or inside the second group; every task has exactly one fitting picture. It uses the shared pattern renderer and existing library pictures, so no other puzzle's revision changed. He keeps his painted portrait and his pin on the drawn map, now as a real destination; the map has no visit-only places left. In the world a flat bridging stone crosses the spring on the Rock and a trail leads round his crag. Letters pass over any friend whose puzzles are not yet signed off, so no child is sent to him before **Bergmuster** is approved in Puzzle-Prüfung.

## Compact map and dismissal

The adopted top-down map is unchanged as a painting. Its panel is capped at 940 px / 92 vw and 82 dvh, with less padding and no map/back header icons. There is visible backdrop around it. A primary tap that starts and ends on the backdrop closes either the map or an invitation letter; a drag, pan, cancelled pointer or gesture started inside the content does not dismiss it. Escape remains available, focus returns to the launcher, and map keyboard focus wraps across its destination buttons.

The board now stays at least 880 px wide, with the same thirteen picture-only 64 px pins and real world routes, including Steinbock. Calibration/spacing checks still reject overlapping hit areas. Animal identity, painting pixels, landmark calibration and route destinations are unchanged.

## Den and exit roles

The den destination has a new [painted tree-home marker](artwork/den-marker.json), using the same watercolour/pencil finish as the animal portraits. Its compact silhouette avoids miniature leaves, realistic wood, hardware and scenery. The complete request, ordered canonical references, source and packing hashes are retained.

The leaving-den sign now uses a matching [illustrated pictogram](artwork/exit-symbol.json), replacing the rigid geometric SVG: softly irregular sepia outlines, nearly flat cream/ochre door and blue exit arrow, with the same outline proportions and edge softness as settings/map/letter. Its complete actual generator request includes the two canonical style references followed by the approved navigation-symbol sheet. Source, hashes and packing are retained for Claude and future changes. The old SVG is retired provenance and has no runtime/offline dependency. The old detailed six-icon sheet is retained as provenance, but no runtime/offline dependency uses it. Current Claude/design instructions distinguish the painted map landmark from flat navigation controls.

All other UI animals keep the shared fourteen-friend cast plus sleeping Fuchs; the live world and den fox keep their 3D models. This exit-icon change leaves the 235 learning pictures and all 983 current task definitions, answers, competence and difficulty unchanged.

## Review and validation

The 9.3.83 exit-icon update kept all **32** puzzle presentation revisions byte-identical to 9.3.82; the review return-route changes in 9.3.84 refresh the affected presentation revisions. The visual-review requirements from the earlier painted-portrait adoption still apply. Editorial decisions, their history and real-device saved data are not edited or auto-approved.

Validation includes the actual den-exit touch target, matching artwork and invitation action at phone/tablet/landscape sizes, installed-app updates and the unchanged model/style/calibration contracts. Existing map checks cover real map/letter backdrop taps, gesture safety, Escape/focus, compact dimensions and all thirteen real touch/keyboard routes at tablet, phone and landscape sizes. Existing artwork, navigation and installed-app update checks cover their normal flows. See [Development](../docs/DEVELOPMENT.md) for commands.

All **775** protected archived originals retain their bytes. Historical requests are provenance only, while the canonical contract and registered forward prompts define future requests.

## Menu and review navigation — 9.3.84

The map keeps its existing portrait/home pins and accessible destination names, with no friend-name tooltips or visible courier text. Settings uses the standard automatic narration voice and no longer repeats the GitHub connection panel. Puzzle-Prüfung opens with all 32 puzzles; its entry page owns the GitHub panel. The shared drawn header arrow returns from selected puzzle details to that overview and then to Settings. Iteration previews (including handwriting) return to their selected puzzle details.

Each selected puzzle explains its bounded competence in words alongside its curriculum reference and offers an optional general comment. Comments use the existing exact-revision puzzle record and GitHub synchronization, preserve decision status/revision and survive queue/bulk approval. Drafts survive filtering and navigation within the visit. The normal child puzzle page and artwork stay the same. Updated implementation fingerprints reflect the explicit review return routes; no editorial approvals are generated.

Feature-branch validation before the merge: all 119 model tests passed, including general-comment persistence, unchanged release status and stale-approval protection. Navigation checks passed for picture-only map pins, the review hierarchy, shared drawn backs, phone sizing and keyboard use. GitHub sync checks passed for saved comments in independent browsers and unsaved drafts across filters/Back. The visual suite passed for the then-current 31 puzzles at two viewport sizes. The targeted review suite solved all 124 addition/letter/digit iterations and checked native touch/mouse input for the then-current 31 puzzles, queue/rejection/celebration behaviour and offline persistence. The full letter-session browser suite passed, including adult review exits, child-save isolation, invitations, home/sleep, offline lock and parent restart. Design, canonical-style, image-library and generated-catalogue checks passed. Browser evidence is captured by the existing suites under `/tmp/waldpost-navigation`, `/tmp/review-sync`, `/tmp/design-system` and `/tmp/puzzle-review`.

The merge preserves the newer painted cast, compact calibrated map and Steinbock letter friend from main. Visible friend-name labels are removed from the adopted map; accessible destination names, routes, calibrated positions, 64 px hit areas and backdrop/Escape dismissal remain. Bergmuster has the same competence explanation and general-comment controls as the other puzzles.

Merged-release validation: all **122** model tests passed. The navigation and GitHub sync browser suites passed against the combined 32-puzzle app; the visual suite checked every puzzle at phone/tablet sizes. Canonical style, design/offline inventory, generated puzzle catalogue, drawn-image library and calibrated map checks passed.

The map browser suite passed all 13 picture-only destinations using real touch/keyboard routing at tablet, phone and landscape sizes, including compact layout, backdrop/Escape dismissal, focus restoration and safe panning.

## Current-game repository cleanup — 17 November 2026

The single `legacy/` root now contains the former archive, retired drawing engine/templates/palettes/stamps/word bank, obsolete colouring/landing/navigation assets, unused recipes and map/portrait preparation attempts. Exact original bytes and paths are recorded in `legacy/manifest.json`; the earlier 775-file protected manifest remains unchanged. Current scripts/styles are traced from `index.html`, and CI rejects unused live source files or legacy runtime/offline dependencies.

Current artwork pixels, puzzle content, the map/Steg collision fixes, current authoring tools and the complete generator handoff remain available. The intermediate base-cast atlas moved from runtime assets to current design preparation inputs. Shared control/handwriting CSS remains; retired screen/paint rules were removed. Puzzle presentation fingerprints were regenerated because the old global paint stylesheet was removed; no editorial approvals are created. Historical feedback stays available across revisions, and local/IndexedDB save keys and stored drawings remain compatible.

## Puzzle feedback and comment deletion — 17 November 2026, 9.3.89

All three [today's review notes](../docs/PUZZLE-FEEDBACK-2026-11-17.md) are addressed. The Eichhörnchen identity (visible even at zero nuts), hazelnut counting picture and cottage are redrawn with the fixed canonical animal/object references first. Actual requests, raw transparent outputs, source hashes and editable packed composite PNGs are retained. All other subject/portrait cells keep their visible RGBA pixels; the new lossless export mode avoids tiny unrelated alpha-edge changes. The shared UI cast remains consistent across letters, map pins, menus, puzzles and celebrations.

Biber now requires comparing the two complete rows to infer the repeated quantity of each shape before completing the third. All 25 stable IDs remain distinct, using every ordered pair of shapes with a two-plus-one distribution. The spoken explanation, competence text, difficulty and finite catalogue follow the same rule. No rectangle/square distinction is introduced.

Each prior comment has a 52 px shared SVG ×, an accessible action name and room to wrap on a phone. Removal synchronizes separately from decisions, retains unsaved drafts and does not change approval or inspection evidence. Older duplicate revisions stay removed across browser refresh and GitHub restoration. Earlier decision history remains an audit of status/date rather than displaying deleted notes again. Tests use disposable local/browser storage and intercepted GitHub, never production review writes.

Validation: 134 model tests; comment deletion/sync UI; all 75 iterations in the affected pools plus native input for every puzzle; all 32 puzzle layouts at both widths; 38 transparent PNG exports; canonical-style, map, catalogue, handoff, design/offline and whitespace checks passed. [Current screenshots](evidence/2026-11-17-puzzle-feedback/README.md) show the actual phone/tablet result. The additional artwork suite hits a pre-existing phone den-exit target assertion, reproduced against unchanged `main` (`44130c3`); it does not complete the remainder of that suite.

## Settings text and typography — 17 November 2026, 9.3.90

The settings introduction now says «Danach geht der Fuchs in seinen Bau schlafen.» Every settings section uses the same semantic heading component and the standard Baloo 2 section font at 22 px. All explanatory, privacy, status and version text uses Andika at 16 px in the same brown ink; toggle labels and action buttons consistently use 17 px bold Andika. Button labels wrap within a shared 52 px minimum control. These rules are scoped to the settings body.

«Spielprotokoll und Entwicklermodus» is one section: local-storage explanation, developer-mode switch, paused/current log status, export and deletion controls. Logging, export, deletion confirmation, saved preferences, adult gate and session behaviour remain the existing implementations. The docs use this common entry path. Puzzle content, review storage and editorial decisions are not edited.

[Actual phone/tablet screenshots](evidence/2026-11-17-settings/README.md) document the corrected sentence and combined section. Computed-style checks confirm identical heading/prose/button typography and text colours across sections, horizontal fit and complete touch targets. The existing local-log suite passed developer-mode on/off and reload, JSON export and isolated deletion; the navigation suite passed settings/review/gallery exits plus phone and keyboard use. Regenerating the catalogue leaves every puzzle implementation fingerprint byte-identical.

All 134 model tests and the design/offline, canonical-style, generator-handoff, generated-catalogue and whitespace checks passed before publication.

## New puzzle review follow-up — 17 November 2026, 9.3.91

The [second feedback pass](../docs/PUZZLE-FEEDBACK-2026-11-17-FOLLOWUP.md) respects the user's preferred original counting nuts by restoring their exact original atlas bytes. The reported zero-task basket was a separate geometric SVG: both copies are replaced with one canonical painted empty-basket subject, also used in zero numeral quantities. The new 2 × 2 transparent atlas includes a recognizable pond for swimming habitats and a learning squirrel unmistakably holding one nut. Actual generation request, canonical reference pixels, raw source/hash and preparation are retained. Other existing picture cells and the shared UI cast are preserved.

The Dachs replacement asks «Was wächst aus einer Eichel?» with a unique pictured tree answer. The redundant Fische zählen pool is removed: 31 active puzzles and 958 iterations remain. Future invitations omit Fisch and unfinished old Fisch invitations are retargeted without losing letter index, phase, session progress or world position. Historical saves and editorial records remain readable. Biber's already implemented two-plus-one matrices are retained after checking the repeated note.

[Phone/tablet evidence](evidence/2026-11-17-review-followup/README.md) confirms the real rendering. Browser checks passed for all 130 affected iterations, native input for every active puzzle, the complete letter/home/sleep/offline flow, all 31 puzzle layouts at both widths and 41 PNG exports. The unchanged Biber definitions retain their existing two-plus-one tests; regenerated shared presentation fingerprints follow the normal review requirement.

## Historical puzzle approvals — 17 November 2026, 9.3.92

The shared basket branch was included too broadly in 9.3.91's fingerprints and reopened unrelated games. [The recovery record](../docs/PUZZLE-REVIEW-RECOVERY-2026-11-17.md) documents the corrected finite-pool comparison, full historical implementation tokens, exact owner-requested nut restoration and preserved later restrictions. Twenty-six games match the previous release under that restoration; the five actually changed games remain subject to review. The inspected GitHub snapshot restores nine complete puzzle releases without writing or fabricating editorial decisions. Original dates, later notes, rejection status and comment deletion markers survive fresh-device and offline recovery. No puzzle rendering or artwork changes in this repair.

All 137 model tests and the final style, image-library, generator-handoff, catalogue, design/offline and whitespace checks passed. The restored counting-nut atlas is byte-identical to `44130c3`.

## Natural water edges — 17 November 2026, 9.3.92

Two places drew a toothed edge on the half-metre water grid because water ended at a boundary in the code, not at a shore. Where the upper brook leaves Fisch's plunge pool, the pool's still water ran down the brook's channel, lay over the brook as a second, paler layer and stopped in a sawtooth across it. Now the still water thins out across the pool's mouth while the brook's flowing water comes in, and the pool's bed colour gives way to the brook's bed in the same way; the brook's inflow into Biber's pond uses the same crossfade instead of lying over the open pond. To the west and south of Frosch's swamp the land falls away below the bog's water, which therefore ran on to the bog's outline and stopped there in a staircase. A low bank (up to 0.2 m) now rises out of the water towards the bog's edge, so the shore is where the ground comes out of the water; its shore tint and the change from pond-like shore to bog mud fade gradually.

The swamp keeps about 96 % of its open water; the Steg's firm start moves by less than a centimetre and stays below its deck. [Before/after screenshots](evidence/2026-11-17-water-edges/README.md) show the plunge-pool outlet, the pond inlet and the swamp's south and west shore. All 140 model tests, including the new `tests/water-edges.test.cjs` (which fails on 9.3.91), the Steg journeys, all 13 map routes, navigation and the style, map, catalogue, image-library, handoff, design/offline and whitespace checks passed. The adopted map painting, characters, learning artwork and every puzzle definition and fingerprint are unchanged; no new puzzle approvals are needed.
