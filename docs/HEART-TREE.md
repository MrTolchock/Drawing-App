> Current story (6.5): the central oak, opening, requests, thanks, chapter returns and gathering now have animated 3D story scenes. A travelling heartlight connects each completed repair to a newly living bough. Children advance or skip each scene; the beginning can be replayed at the tree without resetting progress. [Story scenes](STORY-SCENES.md) · [Gameplay](GAMEPLAY.md). Waldspiele remains the single library. The saved nine-repair model below is preserved.

# Der Herzbaum — complete playable story

The selected **original A — Painted woodland** identity now covers the full
five-clearing loop and the three story chapters. A real Three.js fox explores
an angled overhead woodland. Its presentation now uses layered original painted
characters and vegetation, with solid 3D crossings and props. All puzzles stay
flat DOM activities and share the same illustrated cast and natural objects.

## Story and lasting results

| Chapter | Project | Neighbours | Flat family | Lasting result |
| --- | --- | --- | --- | --- |
| Meet | The little bridge | Beaver, Brown Hare | Pattern | A usable timber crossing |
| Meet | A place to rest | European Hedgehog | Memory | A leaf-and-moss resting place |
| Meet | The old trail sign | Tawny Owl | Routes | A restored Heart Tree picture sign |
| Meet | A view of the water | Common Kingfisher | Memory | A clear viewing deck by the reed pond |
| Reconnect | The garden path | Hare, Hedgehog | Pattern | A genuinely shorter garden-to-grove route |
| Reconnect | Stories by the water | Owl, Kingfisher | Routes | A walkable waterside link and story bench |
| Reconnect | Our old meeting place | Beaver | Memory | A renewed clearing around the Heart Tree |
| Gather | A place for everyone | Hedgehog, Beaver | Pattern | Shared seating, moss pads and a small bird perch |
| Gather | The invitation | Kingfisher, Hare | Routes | Pictured invitations at the tree |
| Ending | The story continues | Everyone | Story reward | Five neighbours gather; the canopy awakens |

Each helping project is one short, untimed five-item round. The ending is a
five-beat animated gathering around the awakened oak. The child advances the
scenes with an arrow, then returns to the restored, explorable world. Its original
saved ending cursor is retained, including interrupted earlier endings.
The gathering and the opening can be replayed at the tree without resetting progress or stars.

After the bridge and Hare's introduction, the other three Meet projects can be
completed in any order. Reconnect's three projects and Gather's two projects are
also independent within their chapters. One pictured onward invitation appears
in the HUD. Children can still visit other available neighbours. Chapters change
at the Heart Tree after the required projects and their world payoffs are seen.
Optional practice never becomes a chapter requirement.

## Play and controls

Run `python3 -m http.server 8000 --bind 127.0.0.1` in the repository and open
`http://localhost:8000` on that machine. No package installation or build is needed.
`?screen=hub` opens the original library directly.

- Start the narrated opening with its play button; each scene waits for the child.
  A pictured invitation then begins walking. Scenes have listen and skip controls.
- Tap a path, neighbour, the tree or the pictured destination. Arrow keys/WASD
  also move the fox along safe routes. New destinations replace old approaches.
- Accept a neighbour's pictured helping request, or return to exploring.
- The speaker repeats guidance. The hand replays a separate worked example.
  The example never adds a hand cue to a live answer or changes the saved item.
- Pattern rounds use painted leaves, hazelnuts and a feather, keeping the original
  stage-one sequences and saved answer identities. Memory lets the child look
  freely, hide one object with the basket, answer by picture and look again with
  the eye. Routes use a three-by-three board with a fox and pictured neighbour;
  the arrows move one cell and the curved arrow undoes a step.
- The pictured back control leaves a puzzle. Returning to its owner resumes the
  exact item, answer order, hidden/visible phase, route position or answered state.
- A pictured return after completion reveals the lasting change in the same world.
- At chapter transitions, the tree shows the next shared projects with pictures
  and short speech. It never requires reading an instruction or earning more stars.
- The book opens **Waldspiele**: choose a familiar neighbour, then a pictured
  pattern, memory or route collection. **Alle Spiele** opens the entire original
  library, drawing tools and parent settings. Its fox button returns to the forest.
- The optional clock in **Waldspiele** offers a stopwatch or a gentle play-time
  countdown. It starts off, never limits a quest or changes a reward, and pauses
  in the background. [Clock controls and saving](TIMER.md).

## World and Swiss-native cast

The main loop connects brook → meadow garden → moss grove → story hollow → reed
pond → brook, with two existing approaches to the central tree. The lower pond
crossing is already safe. Restoration opens additional shortcuts. Water taps
choose a reachable bank; the fox never walks freely through the river.

The cast is Eurasian beaver, European brown hare, European hedgehog, tawny owl
(round head and facial discs, no ear tufts) and common kingfisher (blue back,
orange breast, short tail and long bill). Pedunculate oak, beech, alder, hazel,
reeds, moss and wild strawberries establish the Zürich-area lowland woodland.

`js/forest/scene.js` uses locally bundled Three.js 0.187.0. The orthographic camera
looks down at roughly 56 degrees, follows distant clearings and frames a resident
or the tree during conversation. The original A reference is implemented as an
illustrated 2.5D presentation: camera-facing paintings are placed in the actual
Three.js world, while navigation, depth, bridges, height changes and timber props
remain three-dimensional. The fox has four viewing directions. Portraits and
puzzle pieces use those same paintings. Story scenes add articulated 3D actors
with head, face, ear, paw and wing animation, plus a detailed volumetric oak.
Transparent corners of painted trees do not intercept ground taps. Trees fade
when they obscure interaction; the gathered finale keeps the crown
visible. Decorative movement and scene transitions respect reduced-motion settings.
Static world shadows and soft character contact shadows limit recurring rendering.
The gathering uses a close, staged camera and all six 3D actors. Other scenes show
the real bridge, restored places and a heartlight flying through the same world.
Normal exploration and companion walking remain available between scenes.

## Fixed story, extensible collections

`js/forest/story.js` holds nine explicit quest IDs, fixed chapter requirements,
resident/partner roles, pictured goals and fifteen initial optional collections.
Adding practice packs or optional episodes does not extend completed chapters.
There is no growing field of quest pins. Existing places hold new content.

The three guided adapters share the original generators and flat rules:

- `learn.js`: stage-one Musterzug and the `learn:pattern:1` reward identity.
- `memory.js`: Waldschatz, its shared board and the `swiss-woodland` picture pack;
  the existing `expedition:treasure:1` reward identity is retained.
- `trail.js`: Roboterpost and the shared movement rules/board; ordinary library
  practice retains robot/mailbox artwork, three stages and hedge layouts. The
  existing `adventure:robot:1` reward identity is retained.

`activity.js` handles the common pictured return, result and reward recovery.
Practice has its own per-collection sessions and never writes a story contribution.
Every story round fixes its own introductory stage; `learning.stage` stays intact.
The original activities outside these three adapters retain their existing UI and
content. Their individual reading/difficulty review has not been performed here.

## Save, interruptions and continued play

The localStorage namespace remains **farbtupf.forest.v1**. It stores position,
introductions, per-quest and per-practice snapshots, guidance familiarity, fixed
story contributions, payoff acknowledgements, chapter acknowledgements and the
ending's current picture/completion state. Route undo keeps 64 recent positions
so long exploratory loops do not grow storage indefinitely.

A completed round commits its world result before the return screen. It works
even when an existing library reward awards zero new stars. Reward identities
and separate recorded flags prevent farming; interrupted reward recording is
recovered on forest/book entry. The ending and previous contributions survive
reloads, replay, optional practice and future unknown valid contribution IDs.

Earlier bridge, resting-place and Owl saves upgrade without losing their live
items or repaired places. Existing **farbklecks.settings.v2**,
**farbklecks.progress.v1**, IndexedDB **farbklecks** and its **state**/**bilder**
stores retain their identifiers. Saved drawings are never migrated or cleared.

For a fresh development playthrough, use a fresh browser profile or remove only
`farbtupf.forest.v1`. Keep the legacy settings, rewards and picture stores. A story
reset is not exposed in the child-facing journey.

## Verification and remaining human checks

The full story is implemented and exercised in a Chromium touch/WebGL journey,
including interrupted new quests, both chapter changes, a saved ending, optional
practice and an offline fully restored world. Unit tests cover all 72 permissible
chapter-order combinations. Automated checks do not establish child comprehension
or physical iPad/Safari performance.

Guidance uses the Web Speech API, preferring an available `de-CH` voice and then
German. It obeys mute and cancels old speech. Device voices can be absent or need
an OS download; reviewed offline recordings are not bundled. Local visual
examples remain available with mute or missing voices. Actual audible guidance,
comfortable touch/camera behaviour and a nonreading child's understanding need
observation on the intended device. Individual puzzle-content review remains the
separate review the user planned.

```sh
node tests/forest.test.cjs
node tests/routes.test.cjs
node tests/story.test.cjs
# With the local server running and Playwright/Chromium available:
node tests/painted-browser.cjs
node tests/forest-browser.cjs
node tests/trail-browser.cjs
node tests/story-browser.cjs
```

The repository also retains the ordinary learning, adventures, expeditions,
artwork, memory, responsive and handwriting checks. `FARBTUPF_SHOTS` selects the
browser screenshot directory; the full story defaults to `/tmp/farbtupf-complete-story`.

The painted-art browser check validates loaded Three.js paintings, transparent
tree corners, natural spoken/picture labels, all three guided families, exact
answered-item recovery, the longest pattern row at 320/390/700/820 pixels, and
offline artwork. The ordinary game smoke and timer journeys also run against
this presentation. They retain the physical-device and child-observation limits
described above.
