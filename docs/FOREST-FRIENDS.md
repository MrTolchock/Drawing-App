# Forest friends — the letter adventure

Forest friends is the default game. Its current design is the [letter-adventure blueprint](../design/forest-friends/blueprint-v2.md): Fuchs starts in his den, receives a pictured invitation, follows its friend in the 3D forest, solves a puzzle, then receives the next invitation from Hase the mailman. The current adventure has no shop or currency rewards.

The original Heart Tree remains at `?screen=forest`, and its historical activity book at `?screen=hub`. Their existing progress, pictures, settings and database identifiers are preserved. Historical shop/reward descriptions in old design reviews do not define the current Forest friends loop.

## Letter loop and controls

At startup the fox is inside the den. Its front door is closed and has a mail lid. An envelope slips through the lid and remains on the inside floor until clicked. Opening it shows decorative, unreadable handwriting and a recognizable portrait of the invited friend. Speech and pictures explain the invitation; its marks do not need to be read.

After leaving the den, a directional arrow in the 3D world leads toward the pictured friend. The player moves Fuchs by clicking/tapping the ground or a map destination; there is no movement pad, keyboard walking or jumping. The arrow guides the next click and updates with the destination.

Talking to the friend starts an assigned library puzzle. Both the five newer rounds and original illustrated activities participate. Interrupted newer rounds resume first; visits otherwise rotate through the friend's assigned activities. Mistakes permit correction, help and a separate worked example, with one fixed content level and no countdown.

Completion of the invited friend's puzzle changes the destination to the mailman. Hase is staged very close to Fuchs in the 3D forest. The arrow points to him. Clicking Hase gives the next picture letter, inviting Fuchs to another friend. The cycle continues without needing to return home between every delivery. Leaving an unfinished puzzle does not trigger the next letter.

Hase wears recognizable postal clothing and a mail satchel/envelope badge. He wanders freely on walkable forest ground between deliveries, stays easy to reach for the handover, and never presents a puzzle. He is not part of the puzzle-host tabs or learning categories.

The picture-book overview remains available for direct practice. All 26 puzzles share one grid, without a separate section for the five newer rounds. A completion only advances a letter when it belongs to that letter's current friend; unrelated practice does not create a delivery.

## Puzzles and assignments

| Friend | Newer round | Original illustrated activities |
| --- | --- | --- |
| Eichhörnchen | Nüsse zählen | Zählgarten, Znüni-Rechenfreunde, Sternenrakete, Waldpicknick, Nachbarhäuser, Beerenvergleich |
| Blaumeise | Reimpaare lesen | Reimzirkus, Silbentrommel, Naturdetektive |
| Waldkauz | Lies und zeig | Musterzug, Was kommt dann?, Waldschatz, Waldumfrage |
| Biber | Welche Form fehlt? | Formenwerkstatt, Zauberspiegel, Spiegelmosaik, Roboterpost, Zahlenwege |
| Maus | Wörter und Bilder | Leseschatz (four reading activities), Vokalversteck, Schreibspuren |

There are 21 original catalogue entries: 18 learning-game entries plus Leseschatz, Schreibspuren and Zahlenwege. Rechenfreunde remains an alias of Znüni-Rechenfreunde. V2 uses the original **Entdecken** content (stage 1), including reading, handwriting and number paths. The original bookmarks retain their prior difficulty settings. Forest friends practice does not advance an interrupted Heart Tree tour.

The newer rounds keep their exact five-task snapshots, choice order, attempts and help state. Their pools remain 20 scored quantities (three reserved for the example), 15 rhyme pairs, 15 sentences, 16 object/shape combinations and 18 pictured words (Ast reserved for the example). A next round avoids the prior five task IDs when the pool allows it. Cream paper, garden panels, sepia outlines and original painted objects provide the shared puzzle style. Menu animal portraits and puzzle icons use that painted Waldatelier family; matching squirrel, blue tit, blueberries, neighbouring houses, mirror and wand illustrations are in `assets/waldatelier/menu.png`. Individual berry counters inside puzzles remain one berry. Settings uses the original Waldatelier gear.

## Den and free Malatelier

The fox's table opens **Ausmalen** directly. Six new woodland illustrations replace the current picture selection: fox painting, squirrel with nuts, owl reading, beaver by the brook, mouse at a picnic and blue tit at its nest. Selecting a picture opens free colouring immediately, without dice, numbers, syllables or colour-word modes. Stamps are removed from the current colouring and free-drawing controls. Brushes, fill, patterns, eraser, sizes and undo remain available. **Waldspiele → Malatelier** offers Ausmalen and Meine Bilder; Freies Malen and Meine bisherigen Blätter are removed from the menu. The original free editor remains compatible at `?screen=free`, including its mirror/kaleidoscope and coloured paper. All included pages, pencils and colours are freely available.

The pile of pictures beside the table has its own **Meine Bilder** button, opening the saved gallery directly. The back arrow inside a colouring page returns to its picture selection, or to the gallery when resuming a saved picture; **Rückgängig** separately undoes a paint action. Existing IndexedDB drawings and original page IDs remain usable, including older colouring pages and modes in the historical game. Earlier v2 vector sheets and ownership records remain stored without migration.

The den painting has a matching closed wooden door with a brass mail lid and no loose cushion beside the bed. Sleeping curls the fox sideways on the green mattress, including after resizing. The Waldspiele button sits beside the shelf books so their spines remain visible. Opened letters use new large illustrated character portraits rather than enlarging the small navigation icons.

The shop, bag/wallet controls, prices and currency payout flow are removed from current play. Completing a puzzle brings friendly acknowledgement and a new delivery. Previously stored ownership, token and consumable values are compatibility data, not a gate on drawing tools or the new story. No picture is overwritten by a migration.

## Durable state and legacy records

The existing identifiers remain:

- `farbklecks.settings.v2`, `farbklecks.progress.v1`
- `farbtupf.forest.v1`, `farbtupf.journey.v1`, `farbtupf.timer.v1`
- `farbtupf.exploration.v1`, `farbtupf.cinema.v1`
- `farbtupf.friends.v1`, with `.backup` and `.log` alongside it

IndexedDB remains `farbklecks`, version 2, containing `state` (including `free` and `c:<pageId>:<mode>`) and `bilder`. Its drawings remain usable in both the current atelier and the original game.

The Forest friends save adds the current letter phase, recipient and delivery sequence to its validated envelope. A completed invited puzzle and its change to the mailman phase must commit once. Refreshing cannot duplicate a letter or complete an unfinished puzzle. Relaunch starts in the den and retains the current invitation; the correct guidance target returns when Fuchs goes outside.

Old wallet, ownership, consumable, animation and furniture data can remain stored safely for compatibility. Current play does not grant currency, buy items or require those records to access drawing tools. Old schema support must not erase drawings or progress. Unknown fields in a supported save are retained.

A validated prior envelope remains at `.backup`. An invalid current envelope can recover that prior save with an explicit notice. An unsupported newer schema or irrecoverable corrupt save is not overwritten silently; the raw data remains exportable. Failed writes leave prior in-memory/stored state intact and show a German unsaved indication with retry and backup export. Concurrent tabs require reload instead of overwriting a newer save.

This is local, single-device/origin persistence, with no account or cloud sync. Storage eviction remains possible. No migration clears older records to demonstrate the new den opening.

## Visuals, exploration and audio

The forest is an explorable 3D world (`js/friends/forest3d.js`) styled after the reviewed paintings: warm low sun with static soft shadows under a golden haze and pale sky dome, faint light shafts and a painted vignette; canvas-painted grass and terracotta trails with pebbles and grass spilling over their edges; canopies of broad serrated leaves; broad-leaf ground plants, ferns, lavender and daisies; speckled stones with moss on top; fluted, gently twisted trunks flowing into buttress roots; a brook with foam along its banks, three small rapids and a chunky arched bridge; the home tree with a lit room (books, armchair, lantern, rug) behind its round door; lanterns. Its layout follows the original forest plan; decorative art draws from its own random streams so the authored layout does not shift. Foliage on the line between camera and fox dissolves with an ordered dither so it never hides the play area; other foliage stays whole. Colliders keep the fox out of trunks, rocks and water; the bridge is the only crossing.

The fox, squirrel, blue tit, owl, mouse and beaver are articulated 3D models (`js/friends/characters3d.js`) in the character sheet's plush style: soft felt fur (fine stroke texture, gentle bump and a warm velvet rim), brown irises with highlights, cheek fluff, broad dark-tipped ears, tapered brush tails, scalloped owl feathers and the beaver's scaled paddle tail. They have procedural breathing, blinking, ear flicks, head tilts, walk cycles with tail follow-through and greeting poses; the fox lies curled on its bed for pretend sleep. Each joint's static meshes merge by material to keep draw calls low; `tests/characters-preview.html` renders a model sheet for development. The fox eases into and out of walking, turns smoothly and flows round path corners, and the camera follows with a little look-ahead. Static scenery is merged by material and leafy cores are instanced to keep draw calls low. Moving between areas fades softly.

The shop and its destination/stall are removed. Hase adds a roaming postal character and delivery handover in the same plush style. Click/tap movement follows walkable routes around solid trunks and water. The arrow updates with the active recipient or moving mailman rather than starting movement automatically. The closed den door, mail lid and envelope are part of the picture-led letter loop.

The den preserves its warm painted composition and animated fox. Reduced motion leaves an immediately available envelope instead of relying on the arrival animation. Collectible leaves, butterflies, footsteps and friend greetings can remain optional exploration; they do not affect letters or puzzle completion.

Music, ambience and speech have independent saved controls. Background audio quietens during speech and mutes while hidden. Scored reading targets are not pronounced automatically. Explicit rhyme-word audio is recorded as support. Narration quality and voice availability depend on the device.

## Logs, development and validation

Logs remain local and bounded to seven days / 10,000 events, with anonymous session IDs, app/content/schema versions, movement, letter phases/delivery, full task snapshots, attempts, support, active durations, pauses and save failures. Adults can export or clear logs. They contain no names, drawings, recordings or automatic AI upload. Historical economy entries may remain in old logs.

`?dev=1` uses a visibly marked separate development save/log/backup. Portrait shortcuts and task skips belong only there; test activity must not alter a child's letter journey or drawings. `?software=1` reduces raster resolution and shadows for automated rendering; it does not change puzzle answers or saved letter rules.

Run `node --test tests/*.test.cjs` and the current Forest friends browser suites against the local server. Letter-loop checks must cover the closed-door arrival, letter opening, friend arrow, old/new assigned puzzle completion, nearby mailman, next letter, repeated completion, refresh, old saves, offline relaunch and phone layouts. `tests/friends-mail-browser.cjs` (also `friends-browser.cjs`) checks the letter loop; `friends-animation-browser.cjs` checks free bed sleep and Skip. The original economy fixtures have been replaced. All 15 model/content/save test suites passed. The integrated mail journey, library/atelier and free-bed browser suites passed in Chromium at tablet and phone sizes, including offline reload, actual tracing/number-path completion and normal-motion delivery. [Visual evidence and comparison](../design/forest-friends/visuals/milestones/letter-adventure/COMPARISON.md) record this implementation.

The den repair adds `tests/den-browser.cjs`: mattress placement at both viewports, shelf visibility, illustrated postcard, six closed-region colouring pages, direct free mode, absence of stamps, working back paths, gallery save/resume and offline restoration. [Den comparison evidence](../design/forest-friends/visuals/milestones/den-polish/COMPARISON.md) records the new artwork and layouts.

Physical iPad/Safari performance, installed voices and child navigation/reading observations remain separate from software Chromium checks. Preserve the frozen [visual baseline](../design/forest-friends/visuals/baseline.md) and add new milestone screenshots for visual changes.

## Internal content/source review, 7 November 2026

The implementation fetched and checked the official Zürich pages linked from the design matrix:

| Mapping | Confirmed source wording / implementation boundary |
| --- | --- |
| [MA.1.A.2.a](https://zh.lehrplan.ch/index.php?code=a%7C5%7C0%7C1%7C1%7C2) | Count up to 20 elements. The game practises pictured quantities, not the whole forward/backward counting step. Zero is an app extension. |
| [D.2.A.1.b](https://zh.lehrplan.ch/index.php?code=a%7C1%7C11%7C2%7C1%7C1) | Connect letters to syllables/short words and slowly decode short sentences. Scored words/sentences stay visible; instruction speech excludes them. |
| [D.2.B.1.b](https://zh.lehrplan.ch/index.php?code=a%7C1%7C11%7C2%7C2%7C1) | Understand short factual sentences with pictures or guidance. Two concrete action pictures support this limited practice. |
| [D.1.A.1.b](https://zh.lehrplan.ch/index.php?code=a%7C1%7C11%7C1%7C1%7C1) | Supporting attention to speech sounds/rhymes. Written rhyme cards also require decoding; audio help is recorded. |
| [MA.2.A.1.a](https://zh.lehrplan.ch/index.php?code=a%7C5%7C0%7C2%7C1%7C1) | Names include circle, triangle, rectangle and square, as well as solids. The game only recognises flat gaps and names the shape in feedback; it does not assess the whole naming/geometry step. |

Authored pools were checked for one correct answer, distinct options, visible target/answer correspondence, separate example content, exact saved snapshots and first-grade task boundaries. Vocabulary includes introduced consonant combinations (`sch`, `st`, `ch`), diphthongs (`au`, `ei`) and ordinary familiar nouns; the classroom must already have introduced them. The current adult controls do not yet filter letter inventories. Picture naming, running/sitting poses and rhyme familiarity need the planned child session; successful matching is not proof of independent reading or curriculum mastery. No teacher review or official endorsement is claimed.
