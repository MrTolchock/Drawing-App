# Waldpost implementation

The active game follows [letter sessions](LETTER-SESSIONS.md), [visual style](../design/VISUAL-STYLE.md) and the [puzzle blueprint](../design/PUZZLE-BLUEPRINT.md). Historical Heart Tree screens and engines live in `archive/legacy-game/`; `?screen=forest` opens the current den. The old gallery URL opens the adult gate.

## Current modules

| Module | Responsibility |
| --- | --- |
| `js/friends/game.js` | Den, letter, visits, map, mailman, return home and sleeping end card |
| `js/friends/state.js` | Durable invitation/session allowance, world position, exports and compatibility records |
| `js/friends/play-log.js` | Bounded local observations, exact task definitions, active-time accounting and AI-readable export summaries |
| `js/friends/world/`, `forest3d.js`, `characters3d.js`, `painted.js` | Forest, plush cast, movement and painted den |
| `js/friends/world/life.js` | Moving life that travels with Fuchs: falling leaves, butterflies, dragonflies, little birds that fly up, smoke from the picnic fire, ducks and a jumping fish on the pond, paper boats on the brook, the waterfall's rainbow, sunbeams through the wood. Holds still with reduced motion |
| `js/friends/world/big/wonders.js`, `layout.js` (`WONDERS`) | Small things to discover beside the paths (toadstool ring and house, hollow log, stone circle, apple trees, berry bushes, well, lanterns, picnic stump, signposts, and a picnic place with timber table, benches and a fire place with grill), each built in one short step when Fuchs comes near. When he stops beside one he reacts once: sniffs the berries, warms his paws at the fire, leans over the well and hears an echo, pokes his head into the hollow log, looks up into an apple tree (`react` in `forest3d.js`) |
| `js/friends/weather.js`, `js/friends/world/rain.js` | Weather: mostly sun; after the first few minutes a shower now and then (every 5–9 minutes of play, 1–2 minutes long) eases in, greys and dims the light, darkens the ground and falls as fine slanting rain streaks with splash rings and droplet crowns (as snow on the peak), then clears to a brighter spell. Butterflies, dragonflies and the little birds take shelter, birdsong falls quiet and comes back afterwards, rain patters on the leaves. The weather pauses with the game and is not saved. `FK.friendsForest.weather(true/false)` starts or stops a shower; `tests/weather.test.cjs` plays half an hour through |
| `js/friends/world/big/terrain.js` (`PEAK` in `layout.js`) | A snow-capped peak rises 10.5 m out of the Rock's plateau (the Rock's sides rise gently over some fourteen metres, a cliff only at the waterfall); a path from the summit trail climbs to a summit cross with a cairn and a snowman. No plants or trees grow on the snow; Fuchs' steps crunch there and snowflakes fall instead of leaves |
| `js/friends/world/ambience.js`, time of day in `forest3d.js` | The day follows the journey (game.js `syncMail`): morning for the first letter, golden afternoon in the middle, dusk on the walk home, easing over half a minute. Dusk: den window and lanterns glow, fireflies. Morning mist over still water; a rainbow after some showers; puddles on the paths that dry slowly. `FK.friendsForest.timeOfDay(v)` and `.rainbow()` for development |
| `js/friends/world/footprints.js` | Paw prints that fade slowly: in snow, swamp mud and on the banks always, on paths and grass while they are wet after rain |
| `js/friends/audio.js`, `soundscape.js` | Forest sound made in the browser: leaves in gusts, brook, waterfall, footsteps by ground, the birds of a Swiss mixed wood (chaffinch, blackbird, robin, wren, blackcap, song thrush, tits, nuthatch; coal tit and goldcrest in the spruce; rarely cuckoo, woodpecker, jay), frogs and crickets; a hollow knock in the old wood, echoes by the Rock and single wind gusts on the peak; no music. `soundscape.js` decides what plays when (tested over twenty simulated minutes in `tests/soundscape.test.cjs`); `tests/audio-preview.html` plays every sound by itself. There is no constant wind sound |
| `js/friends/interface.js` | One model-rendered identity atlas for every UI surface |
| `js/ui/waldatelier.js`, `waldatelier-icons.js` | Drawn subjects and shared utility icons |
| `js/friends/library.js` | Explicit active inventory and current-letter access permit |
| `js/friends/puzzle-catalogue.js`, `puzzle-rounds.js` | Finite content, revisions, random distinct five-task selection and exact snapshots |
| `js/screens/puzzle.js`, `trace.js` | Shared puzzle page and writing stroke engine |
| `js/friends/puzzle-review.js`, `js/screens/puzzle-review.js` | Individual editorial decisions, previews, revision gate and backup |
| `js/friends/settings.js` | Adult gate, letter count, gallery, sounds, reading case, exports and updates |
| `js/scene/materials.js`, `js/core/speech.js`, `js/ui/gestures.js` | Current shared scene, requested speech and touch utilities |

The catalogue lists all 34 [puzzles and competence assignments](PUZZLE-CATALOGUE.md). An interrupted puzzle resumes before the host rotates. Correct answers advance automatically; only completing all five consumes a letter. Non-invited friends, direct routes and the mailman cannot grant extra puzzles; a non-invited friend shows a small trick and points the way to the friend on the letter (`TRICKS` in `characters3d.js`, `visit` in `forest3d.js`).

The den table and picture pile remain scenery. Drawing/saved-picture controls and routes are retired; historical template IDs, localStorage and IndexedDB records remain intact. Archived story records are retained but their former screens are no longer shipped or downloaded. The new journey does not spend historical currencies.

The [local gameplay log](PLAY-LOG.md) records child iterations, selected answers, input issues, foreground times and journey observations. Settings exports JSON with exact task definitions and analysis summaries; no gameplay data is uploaded. It survives refresh/offline use in the same browser and can be cleared independently of the automatic journey state. Adult review previews are excluded from child outcomes.

Review decisions are shared in GitHub’s `puzzle-review-data` branch, with a separate local cache and offline outbox. Do not ship approvals, reset storage or silently carry an old approval to a changed revision. Only confirmed exact-revision GitHub approvals enter child play. Export/import is revision checked. See [review storage](REVIEW-STORAGE.md). Tests use isolated fixtures; the owner still inspects every real iteration before children use it.

The world supports requested rule speech, quiet puzzle-button/correct/retry sounds and parent sound preferences. Menus are silent. There is no countdown or automatic answer narration. Updates preserve saved data and defer reload during active puzzles and dialogs. See [Development](DEVELOPMENT.md) for validation and publishing.

The friends who live on the ground (Eichhörnchen, Biber, Igel, Dachs, and the Reh a little further) stroll a few slow steps round their home spot with pauses, keep off trails and crossings, stand and turn to Fuchs when he comes close (a brief greeting hop, then they look at him), and stay put with reduced motion. The squirrel bounds in short dashes with both hind legs together, glances round, flicks its tail and nibbles; the deer walks smoothly, grazes now and then with flicking ears and lifts its head when Fuchs comes (`MANNERS` in `characters3d.js`); their map pin follows them. Trees between the camera and Fuchs turn translucent in a narrow, soft-edged column (`js/friends/world/textures.js`).

The camera stands further back where the view is wide (meadow, Rock, peak, open water) and closer in dense wood; a short close shot frames Fuchs with the invited friend before the puzzle opens (not with reduced motion); two fingers pinch the view closer or further within a narrow range (`zoom` in `forest3d.js`, pointer handling in `painted.js`).
