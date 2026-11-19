# Current visual consistency audit

Current game art is **Waldpost 9.4.10**. The canonical medium remains **`waldpost-watercolour-pencil-v1`**, with frozen animal and object reference pixels and **86** complete forward image-generation prompts.

## The way up to the Steinbock can be walked — 9.4.10

On the iPad Fuchs could not go up the new way: a tap up there sent him nowhere or the long way round. The 1 m path grid saw the ledge as broken (too narrow at the hairpin and the top turn, with a step where two parts met), so routes went round by the summit trail (about 100 m). The way now runs along the foot of the face, round a rounded hairpin, back across the face and up onto the rim beside the crag; it is level across, eases into level landings at its turns, and its core counts as walkable like the crossings. The route from the cave's path to the Steinbock is now about 33 m, and taps on the ledge or the rim bring Fuchs up. One small boulder beside the crag moved 1.3 m so that the way along the rim passes it. The look of the zigzag is kept; the drawn map still does not show it.

## Rätsel, Aufgaben und aktuelle Reviews — 9.4.9

Die neun neuen [Review-Hinweise vom 19. November](../docs/RAETSEL-FEEDBACK-2026-11-19.md) sind umgesetzt. Die Sammlung enthält 22 Rätsel mit 794 Aufgaben: 18 zusätzliche Mengenreihen mit drei Gegenständen, zusammengeführte Wald- und Bergmuster beim Steinbock sowie die Naturhinweise als Fragen im Tierrätsel. Der vierte Picknickgast ist ein Reh. Besetzte Zahlenfelder haben durchgezogene Ränder; die Gedächtnisübung verwendet Häkchen und Auge samt passender deutscher Offline-Erklärung. Die Silben zum Zusammensetzen werden gross dargestellt. Der neue gelbe Schweizer Briefkasten hat echte Transparenz und einen vollständigen, kanonischen Generierungsnachweis.

Alle Systembeschriftungen verwenden «Rätsel» und «Aufgaben». Die Prüfnummer zeigt die Position in der vollständigen Sammlung des gewählten Rätsels, unabhängig von der kürzeren offenen Warteschlange. Technische IDs und Original-Review-Daten bleiben bestehen. Eine weitere exakt gebundene Kompatibilitätskante übernimmt 559 unveränderte Aufgaben über die reine Begriffs- und Prüfnummeränderung hinweg. Neue oder tatsächlich geänderte Aufgaben werden nicht freigegeben.

Modellprüfungen und Browsertests decken Zusammenlegungen, Freigabe-Erhalt, alle 4.255 iPad-Aufgabenansichten und Zustände sowie die tatsächliche Bedienung der neuen Elemente auf Tablet und Telefon ab. Die [Bildbelege](evidence/2026-11-19-raetsel-reviews/README.md) stammen aus dem gemeinsamen Renderer mit wegwerfbarem Speicher und abgefangenen Review-APIs.

## Detail where the camera looks, a still sun, a way up to the Steinbock — 9.4.8

Feedback from the iPad (19 Nov): the land in the background looked unfinished, shadows crawled after a puzzle, the mailman stood too close, the Steinbock could only be reached the long way round, Fuchs left paw prints while sliding down the snow and lay across his bed.

- **Background.** The full-detail ring was a 40 m circle round Fuchs, so a quarter of its tiles lay behind the camera, unseen, while ahead the ground near the top of the picture (zoomed out, 35–45 m away) was the plain far version, and new detail dissolved in right there. The near ring now follows the picture: everything within 22 m, and ahead of Fuchs the ground in the camera's view out to 50 m (tile centres), built in the order the camera sees it. It holds about as many tiles as before. The far ring's ground takes on the colour of what grows in the near ring (sunny grass, the meadow's warm tall grass and its drifts of poppies, cornflowers, bellflowers and daisies), so the land beyond no longer reads as bare green.
- **Time of day.** It used to ease over half a minute after a puzzle, redrawing the shadow map every half second, so shadows crept across the ground in jerks. Time now passes while the puzzle is open: when the forest shows again it is already the new hour, with one shadow redraw.
- **Mailman.** He waits 18–22 m away (a routed approach 16–25 m where the way bends), usually ahead in view.
- **Steinbock.** A new ledge path with one hairpin climbs the Rock's face from the cave's path, a few steps before the cave mouth, to the rim in front of his crag (`ibex-cave` trail, graded by `RAMPS`). The drawn map does not show this short path yet; its painting is unchanged.
- **Slide marks.** Sliding down the snowy peak leaves one smooth furrow (pressed rims, soft middle, fine fur drag lines) instead of paw prints.
- **Asleep in bed.** Fuchs lies along the bed on the blanket, head toward the pillow and tail toward the foot, sized to the mattress instead of lying across it with his paws over the edge.

Character art, painted UI, map painting, learning pictures and all puzzle definitions and presentation revisions are unchanged; no puzzle needs new review.

## iPad puzzle space and simpler world controls — 9.4.7

The return arrow now sits directly left of the small host portrait inside the puzzle paper. The separate title bar is removed. Competence subtitles become the sole catalogue/gallery titles (for example, «Mengen zählen»); stable IDs, task prompts, questions, answers, rule explanations, difficulty, artwork and partial-work fields stay unchanged. iPad layouts compact margins and boards while keeping scored text sizes and touch targets. The map keeps just the position pulse; completed letters appear as a non-interactive `completed/limit` status in place of the toolbar letter button. Invitation letters have no speech control.

The owner explicitly requested keeping puzzle releases. `tools/puzzle-layout-compatibility.json` records the exact before/after definition and review-presentation hashes for this migration, with the prior code commit as a verified baseline. Compatibility applies only to those exact pairs with identical definitions. It grants no decisions, writes no review ledger and cannot accept subsequent question, rule, interaction, picture or layout changes. Existing rejection/comment/deletion precedence remains in force.

Validation covers all 776 finite tasks at iPad landscape and portrait sizes, memory phases and distributed berries, phone width, keyboard return, existing navigation/letter flows and historical review recovery. The [real-renderer evidence](evidence/2026-11-19-ipad-layout/README.md) uses disposable storage and intercepted review APIs. Physical Safari testing remains an owner check.

## Lighter haze, distant land and no loading pops — 9.4.3

The forest's haze is lighter and less yellow: it begins about 36 m from the camera in the wood (24 m before) and covers the ground only towards the top of the view, where the land beyond the tiles is now a sunlit mesh of woods, meadows, rock and snow fading into the same haze instead of a flat cream band. The haze that stands close for a moment when Fuchs walks into an open area lifts from much less. Tiles, detail changes and landmarks dissolve instead of popping, and tree shadows arrive with their trees and fade out with distance instead of ending at a moving edge. The mailman now waits 10–13 m away, usually ahead where the camera sees him, so reaching him is a short walk. Character art, painted UI, map, learning pictures and all puzzle definitions and presentation revisions are unchanged; no puzzle needs new review.

Measured on a fixed 188 s walk (headless, 60 fps steps): tiles that appeared or changed on screen at once went from 148 to 0, frames with trees on screen missing their shadow from 93 % to about 1.4 %, and late shadow pops from 118 to 5. Draw calls rise by up to about 20 (cheap far tiles reach further, but only where the camera looks); triangles by at most 2.5 %.

## Birdsong, audio credits and puzzle feedback — 9.4.0

The audio credits open inside adult Settings with the shared illustrated back arrow. Bird phrases have been filtered to reduce flutter, with quieter leaf and footstep layers. Five updated spoken puzzle rules are bundled offline.

The review ledger at `192c28881b433fad0fab1113f23e1ff4be88b3b8` informed this pass. Beaver rows use painted nuts, leaves and feathers. The hare follows the four arrow controls. Children drag numbers into the spaces around a neighbour, choose from three syllable counts and arrange picture-only stories. Nature clues use one sentence. Seven redundant puzzles left the active catalogue, and the mouse now offers the distinct words from all three former reading pools.

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

All 137 model tests and the final style, image-library, generator-handoff, catalogue, design/offline and whitespace checks passed. The restored counting-nut atlas is byte-identical to `44130c3`.

## Historical puzzle approvals — 17 November 2026, 9.3.93

The shared basket branch was included too broadly in 9.3.91's fingerprints and reopened unrelated games. [The recovery record](../docs/PUZZLE-REVIEW-RECOVERY-2026-11-17.md) documents the corrected finite-pool comparison, full historical implementation tokens, exact owner-requested nut restoration and preserved later restrictions. Twenty-six games match the previous release under that restoration; the five actually changed games remain subject to review. The inspected GitHub snapshot restores nine complete puzzle releases without writing or fabricating editorial decisions. Original dates, later notes, rejection status and comment deletion markers survive fresh-device and offline recovery. No puzzle rendering or artwork changes in this repair.

## Natural water edges — 17 November 2026, 9.3.92

Two places drew a toothed edge on the half-metre water grid because water ended at a boundary in the code, not at a shore. Where the upper brook leaves Fisch's plunge pool, the pool's still water ran down the brook's channel, lay over the brook as a second, paler layer and stopped in a sawtooth across it. Now the still water thins out across the pool's mouth while the brook's flowing water comes in, and the pool's bed colour gives way to the brook's bed in the same way; the brook's inflow into Biber's pond uses the same crossfade instead of lying over the open pond. To the west and south of Frosch's swamp the land falls away below the bog's water, which therefore ran on to the bog's outline and stopped there in a staircase. A low bank (up to 0.2 m) now rises out of the water towards the bog's edge, so the shore is where the ground comes out of the water; its shore tint and the change from pond-like shore to bog mud fade gradually.

The swamp keeps about 96 % of its open water; the Steg's firm start moves by less than a centimetre and stays below its deck. [Before/after screenshots](evidence/2026-11-17-water-edges/README.md) show the plunge-pool outlet, the pond inlet and the swamp's south and west shore. All 140 model tests, including the new `tests/water-edges.test.cjs` (which fails on 9.3.91), the Steg journeys, all 13 map routes, navigation and the style, map, catalogue, image-library, handoff, design/offline and whitespace checks passed. The adopted map painting, characters, learning artwork and every puzzle definition and fingerprint are unchanged; no new puzzle approvals are needed.

## Consistent adult menus and individual review revisions — 18 November 2026, 9.3.94

Gallery and review use the Settings paper frame and typography. Gallery cards contain only portrait/name; review overview cards omit curriculum codes and use general competence headings. Details retain curriculum references. Saved general comments clear the entry field while remaining in history; unsaved drafts remain available. The developer controls have a distinct inset subsection. Fisch has a visible character filter and remains available for future puzzle assignment. [The change record](../docs/PUZZLE-REVIEW-ITERATIONS-2026-11-18.md) describes the per-iteration historical compatibility proof and thirty-day analysis logs. No new artwork is introduced.

[Phone/tablet evidence](evidence/2026-11-18-adult-menus/README.md) and computed-style checks compare the three menu frames directly. Real review checks pass all 130 previously adjusted iterations, native mouse/touch for all 31 games, retries, rejection, celebration, partial queues and offline restoration. The gameplay-log browser check passes real answers, placements, handwriting, timing, export and developer-mode isolation.

## Consistent edges, scale and placement in the image library — 18 November 2026, 9.3.95

The audit compared all 238 library images with the canonical animal and object paintings. Twenty subjects were redrawn, including the lynx, marten and four rhyme pictures with prominent cutout artifacts. The remaining 69 corrected subjects use the original painted strokes, with faint background haze removed and missing edges recovered where the original sheet still contains them. Both seated cat IDs use the same tabby drawing. Corrected subjects are centred at 80% of the cell on their longest side, with their original proportions and soft edges.

Pixel comparisons against 9.3.94 confirm that 149 images are identical. Fine edges and the original atlas grid are preserved in lossless downloads. Gallery previews and PNG downloads use the same sheet version. The 796 iterations with identical presentation retain their revisions. The 162 revised iterations display corrected art. A read-only check of the GitHub review ledger verified current approvals, later comments and restrictions, and recovery on a fresh device.

All 151 model tests and the phone and tablet rendering checks for all 31 puzzles passed. The gallery check verified the pixels and transparency of 129 PNG exports, including five full browser downloads. The side-by-side crops, dark-background checks and real puzzle screenshots are available in the [image library evidence](evidence/2026-11-18-image-library/README.md).

## Illustration guidance, puzzle type and review feedback — 18 November 2026, 9.3.96

All current prompts include the shared centring, visible size and clean-alpha checks. The forest rose now uses the existing layered red rose painting. The two new garden pictures have retained generator inputs and transparent crops. The puzzle blueprint specifies Andika sizes for prompts, answers, controls, context and captions. [Puzzle and illustration checks](evidence/2026-11-18-review-feedback/README.md)

The 16 current feedback notes are accounted for in the [review follow-up](../docs/PUZZLE-FEEDBACK-2026-11-18.md). General comments reopen a puzzle with its iteration decisions intact. Waldmuster restores the two original approvals from verified GitHub evidence. Review queues complete automatically. The live review branch is the authoritative record.

The phone and tablet design check passed for all 31 puzzles. Gallery checks verified 131 transparent PNG exports, including eight browser downloads. The read-only GitHub snapshot test restored the three eligible puzzles on fresh devices, including Waldmuster. It also confirmed later restrictions and comment deletions.

Version 9.3.97 installs the reviewed puzzle update and the woodland audio update together in a fresh offline cache. Both updates were merged with the same initial version number.

## Preserve approvals after typography corrections — 18 November 2026, 9.3.98

The 9.3.96 comparison treated the requested text-size corrections as fresh review requirements. Of the 727 revised iterations, 350 have matching tasks, interaction and pictures once typography is excluded. The compatibility comparison now excludes font declarations, line height, letter and word spacing, and text wrapping. Exact display revisions still include them. Questions, answers, difficulty, rules, interaction, picture pixels and the remaining layout properties continue to control review compatibility.

Against the GitHub snapshot at data commit `dc9d88d6dcf203ca4f44a95ae061922b3da874dc`, the corrected comparison restores 199 recorded approvals. Seven puzzles are eligible, including Lies und zeig, Wer wohnt wo?, Tierwörter lesen and Äpfel rechnen. The review source contains 1,498 entries, 16 history records and 40 deletion markers. Recovery keeps the original dates, notes and later restrictions, with zero uploads. All 962 exact current iteration revisions are preserved.

## Read-aloud controls — 18 November 2026, 9.3.99

The letter has a separate speaker button on the paper. Opening the letter, listening to the sender and setting off for the forest remain distinct actions. The speaker uses the existing utility symbol and has a 48 px or larger touch target on phone, tablet and landscape layouts. The puzzle overview reports when narration plays, stops or fails. The catalogue check preserves existing puzzle revisions.

## Future puzzle image expansion — 19 November 2026, 9.4.2

The central library adds [150 canonical watercolour/pencil drawings](illustrations/EXPANSION-2026-11-19.md) across ten thematic sheets: plants, woodland finds, meadow/pond wildlife, harvest, equipment, picnic/home, weather/clothing, animal actions, life cycles and habitats. All have stable IDs, German search labels, transparent PNG exports and retained actual generator inputs, source hashes and packing manifests. The offline cache includes the new sheets.

The original 240 picture files/cells and existing puzzle uses are unchanged, and regenerating the catalogue leaves all current implementation revisions identical. No puzzle content or editorial decisions are added. Validation covers 161 model tests, all 150 new browser PNG exports, cell framing and responsive library layouts, canonical references/prompts, generator handoff and design/offline inventory.

## Second future-puzzle image expansion — 19 November 2026, 9.4.4

A [second set of 150 drawings](illustrations/EXPANSION-TWO-2026-11-19.md) expands the central library from 390 to 540 pictures in 39 atlases. The ten new sets cover birds, woodland/alpine mammals, undergrowth and fungi, flowers, produce, crafts, music/play, kitchen tools, household objects and animal behaviours. Every generator call supplies the fixed canonical reference pair; actual requests, editable sources, source/reference hashes and follow-up repairs are retained. Each new picture has a stable ID, German search label and transparent PNG export.

Optional source crop rectangles in three new manifests keep complete stems, handles and tails when the generator places them across an imaginary grid line. The packer validates those source-pixel bounds, preserves all previous default-grid behaviour and normalizes to the same 320 px cells / 256 px subject extent. Original 390 atlas files, cell locations and puzzle uses remain unchanged; existing puzzle implementation revisions and editorial decisions are preserved.

Validation: 163 model tests, including source-crop validation, and 431 browser PNG exports covering all 150 new pictures; phone/tablet layout, alpha edges and source/atlas pixel matches; canonical style, generated catalogue/handoff and offline/design checks. [Preview and browser evidence](illustrations/EXPANSION-TWO-2026-11-19.md#verification) are retained.

## Third future-puzzle image expansion — 19 November 2026, 9.4.5

The [third collection of 150 illustrations](illustrations/EXPANSION-THREE-2026-11-19.md) expands the central library from 540 to 690 pictures in 49 atlases. It adds spatial relations, object-state opposites, making sequences, material specimens, workshop tools, outdoor equipment, animal signs, plant parts, exact quantity groups, visual patterns, seasonal trees and habitats. The subject plan records intended puzzle uses, counter families/quantities and construction details for future authors. All requests use the fixed canonical watercolour/pencil pair; raw outputs, actual requests, reference/source hashes, refinements and source crops are retained. Current forward briefs describe the selected artwork separately from immutable actual-generation records.

The counted groups contain exactly 2–6 separate buttons, acorns and leaves, checked in both source analysis and the exported atlas. A model test guards the actual rendered counts. Explicit source rectangles preserve complete material specimens, plant parts and outdoor props without repainting or changing any previous picture. Existing 540 image hashes, labels, cell coordinates and puzzle uses are unchanged; no existing task revision or editorial decision is altered.

Validation: all 164 model tests and 581 browser PNG exports, including every new picture, plus source edge, phone/tablet, canonical-style, catalogue, generator-handoff and offline/design checks. [Preview and evidence](illustrations/EXPANSION-THREE-2026-11-19.md#verification) document the exported result.
