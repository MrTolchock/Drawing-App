# Forest friends implementation

Forest friends is the default entry point. The original Heart Tree remains at `?screen=forest`, and its activity book at `?screen=hub`. Adult settings links to both. The v2 picture book also integrates the original activities directly; the drawing table opens the full Malatelier. No original progress, drawings, stars, furniture fields or database identifiers are converted or deleted.

## Playable loop

The fixed 3D den offers bed, doorway and drawing table. Outside, walk only by clicking/tapping the ground or a map destination. Movement arrows, keyboard movement and jumping are removed. The picture map sets a walking destination, not a teleport. Routes plan around solid central trunks; a destination ring points the way. The reward screen’s shop choice walks to the shop. All five friends and the shop are available immediately. Each friend offers five distinct tasks, direct answer submission, non-punitive retries, optional help and a separate example. Correct answers continue automatically after 1.4 seconds; examples and hidden tabs pause continuation.

| Friend | Activity | Resource | Scored pool |
| --- | --- | --- | --- |
| Eichhörnchen | Count pictured nuts, 0–20 | Nuts | 20 quantities; three is reserved for the example |
| Blaumeise | Written, pictured rhyme pairs | Seeds | 15 pairs; Haus/Maus reserved for the example |
| Waldkauz | Three-word sentence, two action pictures | Feathers | 15 sentences; sleeping mouse reserved for the example |
| Biber | Missing basic shape in a pictured object | Logs | 16 object/part combinations; tent example separate |
| Maus | Word to one of three pictures | Berries | 18 words; Ast example separate |

There is one content level. Five completed tasks credit three host tokens in the same save as completion. Support, retries and elapsed time do not reduce rewards. The next round avoids the previous five IDs when the pool permits. Each host keeps its own interrupted round.

The fixed shop sells a leaf page (two seeds), four extra pencil colours (two logs), an apple (one nut) and a bath (two feathers). Permanent unlocks cannot be repurchased. Buy and Use are separate. Apple and bath open five seconds of articulated 3D animation; Skip returns immediately. Temporary props never become environment purchases. Bed offers a separate pretend-sleep sequence with no resource cost or upkeep.

## Restored illustrated games and Malatelier

The Waldspiele book is available from the main menu, the den and every friend's meeting card. It includes the five new rounds and all 21 original catalogue entries (18 learning games plus Leseschatz, Schreibspuren and Zahlenwege). Rechenfreunde remains the existing alias of Znüni-Rechenfreunde, rather than a duplicate card. The original illustrations and interactions are reused. The five new rounds share their cream paper, garden panels, sepia outlines and painted objects. Settings uses the original Waldatelier gear.

| V2 host | Restored activities |
| --- | --- |
| Eichhörnchen | Zählgarten, Znüni-Rechenfreunde, Sternenrakete, Waldpicknick, Nachbarhäuser, Beerenvergleich |
| Blaumeise | Reimzirkus, Silbentrommel, Naturdetektive |
| Maus | Leseschatz (all four reading activities), Vokalversteck, Schreibspuren |
| Waldkauz | Musterzug, Was kommt dann?, Waldschatz, Waldumfrage |
| Biber | Formenwerkstatt, Zauberspiegel, Spiegelmosaik, Roboterpost, Zahlenwege |

V2 selects the original **Entdecken** content (stage 1) consistently, including reading, handwriting and number paths. It has no difficulty chooser, higher-level completion suggestion or automatic progression. The original bookmarks retain their prior difficulty settings. V2 practice does not advance an interrupted Heart Tree tour. Restored activities keep their original star rewards; the five new rounds retain their host-token rewards. Every return button leads back to the v2 book or forest.

The fox's table opens Freies Malen, Ausmalen, Meine Bilder and Waldalbum. This restores the original brushes, stamps, fill bucket, eraser, brush sizes, mirror/kaleidoscope, paper colours, undo, gallery saving and colouring modes, using the existing IndexedDB pictures. V2's earlier vector drawings and purchased leaf sheet remain accessible through **Meine bisherigen Blätter** when present. No old picture is overwritten by a migration.

## Durable state and legacy inventory

The implementation inventory found these existing localStorage keys:

- `farbklecks.settings.v2`, `farbklecks.progress.v1`
- `farbtupf.forest.v1`, `farbtupf.journey.v1`, `farbtupf.timer.v1`
- `farbtupf.exploration.v1`, `farbtupf.cinema.v1`

IndexedDB remains `farbklecks`, version 2, with `state` (including `free` and `c:<pageId>:<mode>`) and `bilder`. Those records are reused by the restored Malatelier and remain usable in the previous game; no migration rewrites them. There is no approved star-to-token mapping; new token balances start at zero.

New state uses `farbtupf.friends.v1`. Wallet, ownership, consumables, per-page vector drawings, audio controls, each host's complete task snapshots and attempts/support, completion cursor, previous sets, last world position and consumption receipt share one envelope. A successful localStorage replacement commits both sides of each economy operation together. Failed writes leave the prior in-memory and stored state unchanged and show the required German unsaved indication with retry and backup export. Unsaved drawing strokes remain available for retry during that session.

A validated previous envelope lives at `.backup`. An invalid current envelope can recover that prior state with an explicit notice. If neither is valid, or a newer schema is encountered, writes are blocked and raw current data remains exportable. Unknown fields in supported saves are retained. This version introduces a parallel schema rather than destructively migrating the previous game's records. Future migrations must follow the same validation/backup policy.

Refresh during a task restores its content, choice order, attempts, help and correct/retry feedback. Refresh after task five can replay the reward acknowledgement without another grant. Consumption is committed before animation; refresh returns to its saved area with the already-decremented quantity. No animation replay has an economy callback. Position is saved during movement, on stop and on overlay entry. Returning normally starts in the den, with pictured invitations to unfinished rounds.

Concurrent tabs detect changes before committing and require reload instead of overwriting newer progress. This is a single-device, single-origin save; it is not cloud sync or a guarantee against device storage eviction. Adult backup export covers the new Forest friends state; legacy data remains in its original stores.

## Visual style and exploration

The forest is an explorable 3D world (`js/friends/forest3d.js`) styled after the reviewed paintings: warm low sun with static soft shadows, canvas-painted grass and terracotta trails, leaf-card canopies, mossy rocks, ferns, lavender and daisies, a flowing brook with an arched bridge, the flared home tree with its glowing round door, the striped stall and lanterns. Its layout mirrors the forest painting, so the picture map stays truthful. Foliage between camera and fox dissolves so it never hides the play area. Colliders keep the fox out of trunks, rocks and water; the bridge is the only crossing.

The fox, squirrel, blue tit, owl, mouse and beaver are articulated 3D models (`js/friends/characters3d.js`) in the character sheet's soft style, with procedural breathing, blinking, head tilts, walk cycles and greeting poses; `tests/characters-preview.html` renders a model sheet for development. The fox eases into and out of walking, turns smoothly and flows round path corners, and the camera follows with a little look-ahead. Static scenery is merged by material and leafy cores are instanced to keep draw calls low. Moving between areas fades softly.

The den and shop remain the reviewed paintings (`js/friends/painted.js`). The den is animated: the 3D fox, lit like the painting, waves on arrival and potters between spots on the floor; dust drifts through a sunbeam from the door and the round window glows. Apple, bath and sleep use the 3D fox with real props. Painted cut-outs from the reviewed art (`assets/forest-friends`, built by `tools/forest-friends-paint-assets.py` from the frozen design art) are used for portraits, pins and meeting cards.

Exploration play, separate from the learning rounds and the token economy: twelve golden leaves to find (saved as `collected`, with a counter and a spoken finale), butterflies that flutter away, footstep dust, friends that hop when the fox arrives, and soft collect sounds that follow the forest-sounds setting. Golden leaves never grant tokens.

Controls follow the review's flat style: cream rounded tiles (speaker top-left; map, bag and adult settings top-right), frosted round pins and plain paper puzzle cards. The earlier procedural 3D world remains available with `?world3d`; saves are shared and positions outside the forest fall back to the home door. All motion stops under reduced-motion settings.

## Audio, logs and development

Music, ambience and speech have separate saved controls. Procedural music/wind/bird tones begin after interaction. Background audio quietens during speech and mutes while hidden. German device speech explains controls; scored reading targets are never automatically pronounced. Rhyme word audio is explicit, logged support. Narration quality and voice availability depend on the device.

Logs use `farbtupf.friends.v1.log`, separate from the progress transaction. They contain anonymous session IDs, app/content/schema versions, movement destinations and samples, full round content snapshots, submissions, attempts, support, active durations, transactions and pauses. Retention is seven days and 10,000 events. Export reports its retained range and truncation; deletion removes logs only. No drawings, names, recording or automatic AI upload are included. Storage pressure can prevent retaining logs independently of progress.

`?dev=1` visibly identifies development mode and uses `farbtupf.friends.development.v1` and its own log/backup. Portrait shortcuts and task skips are confined to this mode. Neither solved nor skipped development rounds grant ordinary tokens. `?software=1` lowers raster resolution and disables shadows for automated software-rendering checks; it does not change saves, tasks or rewards.

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

## Validation

Run `node --test tests/*.test.cjs` and `node tests/friends-library-browser.cjs`, then `node tests/friends-browser.cjs` and `node tests/friends-animation-browser.cjs` against the local server. Set `PLAYWRIGHT_MODULE`, `CHROMIUM_PATH`, `FARBTUPF_BASE_URL` or `FARBTUPF_SHOTS` for another machine. The animation suite checks normal-motion wall-clock completion, skipping and bed sleep with an isolated fixture. The main browser suite exercises real controls for all five rounds, save/reward boundaries, four purchases, drawings, consumption, legacy IndexedDB, offline relaunch and developer isolation. Older browser suites now enter the original game explicitly.

The [visual milestone record](../design/forest-friends/visuals/milestones/playable-loop-1/COMPARISON.md) records screenshots and remaining art differences. Physical iPad/Safari performance, installed voices, child navigation/reading observations and further model/material polish remain to be checked. Software Chromium evidence does not establish those results.

Talking to a friend starts an assigned activity immediately. Visits cycle through the new round and that friend’s original library activities; an interrupted new round resumes first. The five new rounds have a prominent “Spiele aus dem Wald” section in the picture book.
