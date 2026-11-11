# Forest friends — the letter adventure

Forest friends is the default game. Its current design is the [letter-adventure blueprint](../design/forest-friends/blueprint-v2.md): Fuchs starts in his den, receives a pictured invitation, follows its friend in the 3D forest, solves a puzzle, then receives the next invitation from Hase the mailman. The current adventure has no shop or currency rewards.

The original Heart Tree remains at `?screen=forest`, and its historical activity book at `?screen=hub`. Their existing progress, pictures, settings and database identifiers are preserved. Historical shop/reward descriptions in old design reviews do not define the current Forest friends loop.

## Letter loop and controls

At startup the fox is inside the den. Its front door is closed and has a mail lid. An envelope slips through the lid and remains on the inside floor until clicked. Opening it shows decorative, unreadable handwriting and a recognizable portrait of the invited friend. The picture identifies the invitation; its marks do not need to be read and there is no automatic narration.

After leaving the den, a line of fireflies in the 3D world leads toward the pictured friend. The player moves Fuchs by clicking/tapping the ground or a map destination; there is no movement pad, keyboard walking or jumping. The fireflies guide the next click and update with the destination.

Talking to the friend starts an assigned library puzzle. Both the five newer rounds and original illustrated activities participate. Interrupted rounds resume first; visits otherwise cycle through every assigned game using stable game IDs. Mistakes permit correction, with one fixed content level and no countdown. Each game has exactly five tasks, one manual explanation, automatic continuation and a short woodland celebration.

Completion of the invited friend's puzzle changes the destination to the mailman. Hase is staged very close to Fuchs in the 3D forest. The fireflies lead to him. Clicking Hase gives the next picture letter, inviting Fuchs to another friend. The cycle continues without needing to return home between every delivery. Leaving an unfinished puzzle does not trigger the next letter.

Hase wears recognizable postal clothing and a mail satchel/envelope badge. He wanders freely on walkable forest ground between deliveries, stays easy to reach for the handover, and never presents a puzzle. He is not part of the puzzle-host tabs or learning categories.

The picture-book overview remains available for direct practice. All 33 puzzles share one grid, without a separate section for the five newer rounds or a nested Leseschatz menu. A completion only advances a letter when it belongs to that letter's current friend; unrelated practice does not create a delivery.

## Puzzles and assignments

| Friend | Newer round | Original illustrated activities |
| --- | --- | --- |
| Eichhörnchen | Nüsse zählen | Waldkäfer zählen, Äpfel rechnen, Glühwürmchen sammeln, Waldpicknick, Zahlennachbarn, Beeren vergleichen |
| Blaumeise | Reimpaare lesen | Silben klopfen, Naturdetektive (reading riddles) |
| Waldkauz | Lies und zeig | Waldmuster, Was kommt zuerst?, Waldschatz, Waldumfrage |
| Biber | Welche Form fehlt? | Waldwerkstatt, Nüsse verdoppeln, Waldspiegel, Waldpost |
| Maus | Wörter und Bilder | Silben-Puzzle, Wort und Waldbild, Silbenblätter, Farben lesen, Waldwörter ergänzen, Schreibspuren, Zahlenspuren |

The active catalogue has 33 entries, including the ten friends’ counting, reading and animal questions. Waldreime is merged into Reimpaare lesen; Zahlenwege is absent from current play. Letters and digits are separate five-glyph writing games. Historical puzzle IDs, saves and difficulty settings remain available through the historical entry points; Forest friends practice does not advance a Heart Tree tour.

All current games use `js/screens/puzzle.js` and `css/puzzle-rounds.css`, with the existing finger-tracing engine adapted to five-glyph sessions. Andika, one portrait/context row, five leaf badges and consistent answer tiles are shared. There is no pointer mode, question-mark button, tip footer, duplicate success row or next-task button. A correct response is shown on the tile for 900 ms, followed after task five by a 2.2-second leaf-and-flower celebration. Leaving cancels pending transitions. Navigation from Waldspiele returns to that menu; a completed forest invitation returns to the nearby mailman.

`js/friends/puzzle-rounds.js` defines bounded first-grade content and repeatable seeded sessions. Original friend rounds retain FriendsState's exact five-task snapshots and answer order. Other games save their seed, task index and partial placements/selections in `farbtupf.puzzles.v1` (separate developer key), including a pending correct transition. Writing resumes at the current glyph; incomplete strokes can be retraced. No historical key is migrated or erased. Host rotation uses stable IDs in the existing settings record and resumes unfinished work before selecting another game.

Portrait and interface sheets preload with the app. Twenty missing vocabulary pictures and six coloured flowers have matching crayon atlases with equal-sized cells. Every counting berry is a single berry. Shape and colour answers remain visually exact. See [the current puzzle specification and learning boundaries](PUZZLES.md) for individual changes and validation.

## Shared interface and settings

The top-right map, letter, book and gear use one newly painted icon sheet in the style of `characters-v1.png`. Each icon is centred inside the same cream tile; the book no longer uses an off-centre atlas illustration. The map uses a new painted woodland background with six recognizable portrait destinations, paths and the brook/bridge. The active invitation is marked. A pending mail delivery adds a separate postal-rabbit destination, whose route follows his actual current position.

Every settings button, including Waldspiele and old `parents` routes, opens the same **Einstellungen** screen. It contains independent forest ambience, music and game-effect controls, the optional play timer, reading letter case and local save/log export. Game effects (**Spielklänge**) default to off; previously saved choices remain in effect. The Waldspiele header has neither a timer launcher nor a narration button. The timer waits while settings is open, retains its stored mode/duration, restores paused after reload and never ends a puzzle. A countdown completion shows a quiet visual reminder.

The parent gate accepts an entered multiplication result. A wrong or empty answer remains editable with visible feedback; closing/reopening has no hidden lockout. All buttons share gesture-specific touch/click handling, including pictures and the world toolbar. The [typography and input guide](TYPOGRAPHY.md) defines Andika for controls/learning and Baloo 2 for menu headings.

**App-Version** shows the running version and **Nach Updates suchen** checks for a new release, with download, current, offline and error feedback. The installed app also checks when it resumes or reconnects. A fully downloaded update reloads on an idle screen after pending drawing saves, while an active puzzle or drawing stays open. Older installed code can receive the new worker without implementing the latest activation handshake.

The [installed-app update review](../design/forest-friends/visuals/milestones/pwa-updates/README.md) records the parent control and upgrade checks.

For cached versions that cannot use the current Settings control, [the independent recovery page](../update.html) forces a fresh updater check and confirms the installed release. The worker clears abandoned download caches before installation while keeping the working release and all saved game data.

The [input and typography comparison](../design/forest-friends/visuals/milestones/input-typography/README.md) records the phone/tablet review and intentional changes to the earlier type styles.

## Den and free Malatelier

The fox's table opens **Ausmalen** directly. Six new woodland illustrations replace the current picture selection: fox painting, squirrel with nuts, owl reading, beaver by the brook, mouse at a picnic and blue tit at its nest. Selecting a picture opens free colouring immediately, without dice, numbers, syllables or colour-word modes. Stamps are removed from the current colouring and free-drawing controls. Brushes, fill, patterns, eraser, sizes and undo remain available. **Waldspiele → Malatelier** offers Ausmalen and Meine Bilder; Freies Malen and Meine bisherigen Blätter are removed from the menu. Existing saved free drawings remain resumable in the original editor, including its mirror/kaleidoscope and coloured paper. All included pages, pencils and colours are freely available.

The pile of pictures beside the table has its own **Meine Bilder** button, opening the saved gallery directly. The back arrow inside a colouring page returns to its picture selection, or to the gallery when resuming a saved picture; **Rückgängig** separately undoes a paint action. Existing IndexedDB drawings and original page IDs remain usable, including older colouring pages and modes in the historical game. Earlier v2 vector sheets and ownership records remain stored without migration.

The den painting has a matching closed wooden door with a brass mail lid and no loose cushion beside the bed. Sleeping curls the fox sideways on the green mattress at a size comparable to the standing fox; resizing keeps the full body visible. The Waldspiele book sits lower beside the shelf, with room above it. An opened letter shows only the postcard; tapping it or pressing Enter takes Fuchs outside. The surrounding panel and separate door button are removed. New/Cancel/Undo at the painting table also works when a touch browser delivers pointer events without a compatibility click.

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

The forest is an explorable 3D world (`js/friends/forest3d.js`) ported from the Waldbuch look-dev (`design/visual-overhaul/lookdev/`, blueprint section 6.1): warm low sun with a static soft shadow under a golden haze, pale sky dome and painted horizon band; terrain with painted vertex colours; a meandering brook with sandy banks, reeds, pebbles and flowing water; narrow wandering trails with flat stones and fallen leaves; grass cards, ferns, flowers and clover from one painted plant atlas; mossy rocks and mushrooms; fluted trunks with buttress roots under leaf-card crowns; the arched bridge and a log bridge as the two crossings; the home tree with its round door and lit window, lanterns, and fireflies that lead to the invited friend. Foliage between camera and fox dissolves with an ordered dither. Colliders keep the fox out of trunks, rocks and water.

Since November 2026 the forest is the big world (`js/friends/world/big/`, plan and status in `design/world-10x/PLAN.md`): one continuous landscape of 256 × 224 m with the den in the middle, where Fuchs can walk anywhere that is not water, cliff, tree or rim. `layout.js` holds the map as data (the Rock with its waterfall, the beaver pond and dam, the brook, the meadow, the swamp with its boardwalk, trails, places and characters); `terrain.js` turns it into ground, water and habitats; `nav.js` finds routes on a 1 m grid; `tiles.js` and `sites.js` build the streamed tiles and the landmarks. Reh, Frosch, Igel, Fisch and Eisvogel live there as neighbours without puzzles yet. `tests/world-map.html?s=4&nav=1` draws the map from above; `FK.friendsForest.teleport(x, z)` jumps anywhere. `?world=home` still opens the old clearing described next, until that code is removed.

The old clearing is built from regions (`js/friends/world/`, blueprint section 7A). Today `home` (`world/regions/home.js`, today's layout) is the only real region. The ground is cut into 16 m tiles in two rings round Fuchs: near tiles (centre ≤ 40 m) carry terrain, merged plants, rocks, trunks and instanced leaf cards; far tiles (to 68 m, beyond which the haze is over 90 %) carry trunks and crown cards only. `world/streamer.js` builds tiles in time slices (3 ms per frame outside, 8 ms in the den, each step's cost predicted from steps of its kind), builds tiles ahead of Fuchs first, disposes freed tiles and keeps the last eight for quick returns. Materials and textures (`world/textures.js`, painted on canvases at start-up) are shared and never disposed. The forest is built while the child is in the den, including the route-planning table, and shaders are compiled before Fuchs steps outside. `?world=10x` (development only, own save `farbtupf.friends.world10x.v1`) adds nine placeholder regions joined by paths to prove the frame budget; saved positions outside `home` carry the region id. `?perf=1` shows frame time, render scale, draw calls, triangles, tiles and build slices; the render scale adapts between 1.0 and 1.5 to the frame time; the den idles at 30 fps; a lost WebGL context is restored without losing the save.

The fox, squirrel, blue tit, owl, mouse, beaver and Hase are the sculpted plush cast of the look-dev (`cast.html`), baked to skinned glTF files in `assets/characters/` (570 KB together) by `tools/bake-characters.mjs` (a developer tool: it runs the look-dev builders in headless Chromium, simplifies each part with meshoptimizer and compresses with gltfpack; `cd tools && npm install` first). `js/friends/characters3d.js` loads them with the vendored GLTFLoader and meshopt decoder, draws the eyes at runtime, and switches to a lighter level of detail beyond 8 m; at most six characters animate at once. Breathing, blinking, ear flicks, head tilts, walk cycles and greetings are procedural on the baked bones; the fox lies curled on its bed for pretend sleep. Characters do not cast into the static shadow map. `tests/characters-preview.html` renders a model sheet (`?sleep=1` for the sleep pose). The fox eases into and out of walking, turns smoothly and flows round path corners, and the camera follows with a little look-ahead. Moving between areas fades softly.

The shop and its destination/stall are removed. Hase adds a roaming postal character and delivery handover in the same plush style. Click/tap movement follows walkable routes around solid trunks and water. The fireflies update with the active recipient or moving mailman rather than starting movement automatically. The closed den door, mail lid and envelope are part of the picture-led letter loop.

The den preserves its warm painted composition and animated fox. Reduced motion leaves an immediately available envelope instead of relying on the arrival animation. Butterflies, footsteps and friend greetings remain optional exploration. Golden leaf objects, collection checks, counter and effects are removed. Existing `collected` save fields remain compatibility data and cannot grant another collection.

Speech starts only when **Spiel erklären** is pressed inside a puzzle. Navigation, letters, feedback, new tasks and examples do not speak automatically, including on a prior save with speech enabled. New saves start with speech off; the older preference field remains readable for compatibility. Original and current activity families each offer one explanation button. Separate rhyme/word and example-replay speech buttons are removed. Silben klopfen shows a pictured word and a large tapping leaf; speaking and clapping are the child's actions. Scored reading words and sentences are not spoken by the explanation. Device German voice availability still governs explicit spoken help.

Forest ambience is synthesized locally after the first user gesture: stereo wind, softly varying leaf rustle, flowing brook and varied bird phrases. It works offline, is softer indoors, quietens during a requested explanation and mutes while hidden. Ambience and music continue across activity screens and have separate saved controls; no remote audio request is made.

## Logs, development and validation

Logs remain local and bounded to seven days / 10,000 events, with anonymous session IDs, app/content/schema versions, movement, letter phases/delivery, full task snapshots, attempts, support, active durations, pauses and save failures. Adults can export or clear logs. They contain no names, drawings, recordings or automatic AI upload. Historical economy entries may remain in old logs.

`?dev=1` uses a visibly marked separate development save/log/backup. Portrait shortcuts and task skips belong only there; test activity must not alter a child's letter journey or drawings. `?software=1` reduces raster resolution and shadows for automated rendering; it does not change puzzle answers or saved letter rules.

Run `node --test tests/*.test.cjs` and the current Forest friends browser suites against the local server. Letter-loop checks must cover the closed-door arrival, letter opening, friend arrow, old/new assigned puzzle completion, nearby mailman, next letter, repeated completion, refresh, old saves, offline relaunch and phone layouts. `tests/friends-mail-browser.cjs` (also `friends-browser.cjs`) checks the letter loop; `friends-animation-browser.cjs` checks free bed sleep and Skip. The original economy fixtures have been replaced. All 16 model/content/save test suites passed. The integrated mail journey, library/atelier and den browser suites passed in Chromium at tablet and phone sizes, including offline reload, actual tracing/number-path completion and normal-motion delivery. The puzzle suite checks all 24 catalogue routes at 1024/390, four independent reading completions, rethemed arithmetic, sleep size and pointer-only painting confirmation. [Visual evidence and comparison](../design/forest-friends/visuals/milestones/letter-adventure/COMPARISON.md) record this implementation.

The den repair adds `tests/den-browser.cjs`: mattress placement at both viewports, shelf visibility, illustrated postcard, six closed-region colouring pages, direct free mode, absence of stamps, working back paths, gallery save/resume and offline restoration. [Den comparison evidence](../design/forest-friends/visuals/milestones/den-polish/COMPARISON.md) records the new artwork and layouts.

The interface revision adds `tests/interface-browser.cjs`: shared gated settings, centred toolbar at both viewports, actual map travel, visible portrait targets, one explicit explanation per activity family, real audio output and muted/background states, retired leaves and offline continuity. `tests/timer-browser.cjs` checks both clock modes and foreground timing. [Interface comparison evidence](../design/forest-friends/visuals/milestones/interface-polish/COMPARISON.md) records the intentional replacement of the earlier mixed icons/map.

Physical iPad/Safari performance, installed voices and child navigation/reading observations remain separate from software Chromium checks. Preserve the frozen [visual baseline](../design/forest-friends/visuals/baseline.md) and add new milestone screenshots for visual changes.

## Internal content/source review, 7 November 2026

The implementation fetched and checked the official Zürich pages linked from the design matrix:

| Mapping | Confirmed source wording / implementation boundary |
| --- | --- |
| [MA.1.A.2.a](https://zh.lehrplan.ch/index.php?code=a%7C5%7C0%7C1%7C1%7C2) | Count up to 20 elements. The game practises pictured quantities, not the whole forward/backward counting step. Zero is an app extension. |
| [D.2.A.1.b](https://zh.lehrplan.ch/index.php?code=a%7C1%7C11%7C2%7C1%7C1) | Connect letters to syllables/short words and slowly decode short sentences. Scored words/sentences stay visible; instruction speech excludes them. |
| [D.2.B.1.b](https://zh.lehrplan.ch/index.php?code=a%7C1%7C11%7C2%7C2%7C1) | Understand short factual sentences with pictures or guidance. Two concrete action pictures support this limited practice. |
| [D.1.A.1.b](https://zh.lehrplan.ch/index.php?code=a%7C1%7C11%7C1%7C1%7C1) | Supporting attention to speech sounds/rhymes. Written rhyme cards also require decoding; the explanation describes the action without pronouncing their answers. |
| [MA.2.A.1.a](https://zh.lehrplan.ch/index.php?code=a%7C5%7C0%7C2%7C1%7C1) | Names include circle, triangle, rectangle and square, as well as solids. The game only recognises flat gaps and names the shape in feedback; it does not assess the whole naming/geometry step. |

Authored pools were checked for one correct answer, distinct options, visible target/answer correspondence, separate example content, exact saved snapshots and first-grade task boundaries. Vocabulary includes introduced consonant combinations (`sch`, `st`, `ch`), diphthongs (`au`, `ei`) and ordinary familiar nouns; the classroom must already have introduced them. The current adult controls do not yet filter letter inventories. Picture naming, running/sitting poses and rhyme familiarity need the planned child session; successful matching is not proof of independent reading or curriculum mastery. No teacher review or official endorsement is claimed.
