# Der Herzbaum — playable woodland

The selected **original A, Painted woodland** direction now has a small, real
Three.js neighbourhood: the Heart Tree, Beaver's brook, Brown Hare's garden and
European Hedgehog's moss grove.
The existing activities remain flat DOM screens with their current artwork and
rules. The full five-clearing story is still in development.

## Play locally

Run `python3 -m http.server 8000 --bind 0.0.0.0` in the repository and open
`http://localhost:8000`. No package installation or build step is required. Open
`http://localhost:8000/?screen=hub` for direct access to the existing library.

- Touch the large fox/play invitation to begin. A pictured gesture teaches walking.
- Tap/click a path destination or a neighbour. Arrow keys and WASD also move the fox.
- The existing route through the tree clearing reaches both neighbours. The broad
  lower crossing is already safe. The unfinished upper timber bridge is the quest.
- Hare can introduce the same request if visited first. The Beaver picture guides
  back to him; there is one opening quest.
- Accept the pictured bridge request. A separate example demonstrates the pattern
  action, then a fresh existing stage-one Musterzug round begins.
- The speaker repeats the action; the hand/sample control replays the example.
  The live item and answer order remain intact. The example has its own sequence.
- The Beaver/brook picture leaves the activity. Return to him to continue; the
  current item, answered state and completed-item count survive reloading.
- After five successful items, the large Beaver/brook picture returns to the same
  place. The bridge is usable and remains repaired. Cross it to greet Hare.
- Hare introduces Hedgehog beyond the garden. Follow the pictured invitation to
  the moss grove. This path becomes available after the bridge introduction.
- Help Hedgehog make a resting place. The existing Waldschatz board shows three
  woodland objects. Look for as long as you want, tap the pictured basket to hide
  one, then tap the missing object. The eye lets you look again without penalty.
- A separate, replayable example teaches the basket and answer controls using
  a different answer from the live puzzle. No live answer receives a hand cue.
- The pictured Hedgehog/resting-place control leaves the puzzle. The objects,
  choices, hidden/visible phase and answered state survive leaving and reloading.
- Five successful items create a lasting leaf-and-moss bed. Return to Hedgehog
  to see the result; visit again freely or walk back to the Heart Tree.
- The book opens the full existing library. Its fox control returns to the forest.

## Rendering and navigation

`js/forest/scene.js` loads the local WebGL Three.js distribution. It uses an
orthographic camera angled down at roughly 56 degrees, with gentle following and
an interaction view. Character portraits are rendered from the same solid 3D
models as the world. Orange fox/scarf, broad-tailed Eurasian beaver and long-eared
brown hare and European hedgehog have local idle/gesture/walk animation. The hare is brown rather than
the earlier illustration library's white rabbit.

Canopy instances, broad painted surfaces, native oak silhouettes, beech/alder/hazel
forms, reeds and small wild-strawberry patches carry the quiet style. Trees fade
when they obscure the fox. Decorative motion respects reduced-motion preference.
Static soft world shadows and local character contact shadows keep recurring
rendering work down. Exact appearance and performance still need physical-device
review; generated concept art is a visual reference, not a production 3D asset.

The path graph in `js/forest/model.js` is shared by destination selection and route
planning. Before repair, the direct upstream link is absent. The existing path
through the tree and lower crossing remains available. Repair adds the direct
link. Water taps choose the reachable current bank. New destinations replace old
approaches, and interface taps do not also move the fox.

## Activity and progress

The first story session uses the existing `pattern` question generator, five-item
round and `learn:pattern:1` reward identity. It passes stage one explicitly and
does not change `learning.stage` for the other activities. Ordinary library
practice keeps the previous learning UI and reward behaviour, without applying
story effects.

The second session reuses the existing `treasure` question generator and a shared
flat memory board (`js/ui/memory-board.js`). Its `swiss-woodland` content pack
uses leaf, feather, mushroom, stone and wild strawberry pictures. The library's
original pool and three selectable stages remain available. The story adapter
in `js/forest/memory.js` fixes this introductory round at stage one and retains
the existing `expedition:treasure:1` reward identity.

The new localStorage namespace is **farbtupf.forest.v1**. It stores position,
introductions, the stable bridge contribution, guidance familiarity, live pattern
and shuffled choices, answered state, round count and payoff acknowledgement.
Successful round completion commits the bridge before the result/return screen.
It succeeds even when `FK.progress.finish` awards zero new stars. A separate
reward flag and legacy replay-safe reward ID prevent repeated star awards. After
an interrupted completion, the repaired world is retained and acknowledged.

The same namespace also stores a separate memory snapshot and the stable
`moss-rest-v1` contribution. Each quest commits its world result before the
return screen, independently of stars. Loading an earlier first-slice save adds
the new fields without losing the bridge, position or introductions. Unknown
valid completed contribution IDs are retained for future story/content packs.

Existing identifiers stay intact: **farbklecks.settings.v2**,
**farbklecks.progress.v1**, IndexedDB **farbklecks**, and its **state**/**bilder**
stores. No drawing or existing learning progress is migrated or cleared.

The supported pattern and memory sessions have serialisable snapshots. Other activity
families do not acquire exact interrupted-question recovery simply by sharing
the forest. They require their own adapters before story integration.

## Guidance and current limits

Narration uses the Web Speech API, preferring an available `de-CH` voice and then
another German voice. It cancels prior speech and obeys the existing sound
setting. Device voices can be missing or require an OS download. No reviewed
offline recordings are included, and an empty voice list is not treated as proof
that speech was heard. Visual demonstrations are local and remain available.

The first slice is a functional prototype. It has not been observed with children
or checked on a physical iPad/Safari. Those checks, reviewed recordings, final 3D
assets, the remaining neighbours/chapters and the individual puzzle-content review
remain separate work. The complete library can be reached through the book while
future world activities are added progressively.

## Checks

With the server running:

```sh
node tests/forest.test.cjs
node tests/forest-browser.cjs
```

The browser test uses touch inputs, a software WebGL Chromium instance and the
real local service worker. Screenshots default to `/tmp/farbtupf-forest-test`;
set `FARBTUPF_SHOTS` to save them elsewhere. Existing learning and handwriting
checks use `?screen=hub` so they continue to test their original entry directly.

For a fresh development playthrough, remove only `farbtupf.forest.v1` from local
storage. Keep the legacy settings, reward and picture stores. No reset control is
added to the child-facing journey.
