> Retained Heart Tree experience: open `?screen=forest`. Forest friends is now the default runtime; see [implementation status](../../docs/FOREST-FRIENDS.md). These Heart Tree records and original saves remain intact.

# Current design review and next step

The [blueprint](BLUEPRINT.md) is the implemented baseline. This review identifies the next design work; it does not promise that the items below have shipped.

## What is working as a basis

The central metaphor is visible: a bare tree grows through nine acts of help. Beaver and Hare provide a concrete first relationship. The acted requests, gratitude and returning heartlight connect short puzzles to an emotional result. Free walking, a picture map and six discoveries give the forest a purpose beyond selecting a task. Exploration and films now share solid 3D animals.

The game has useful continuity: lasting repairs, exact story-puzzle recovery, optional practice without story inflation, a saved ending and offline assets. The single games book keeps a broad learning library available without adding more world menus. These are foundations to preserve.

## Main design tensions

| Area | Current implementation | Review needed |
| --- | --- | --- |
| Story and puzzle action | Repairs use pattern, memory or route rounds, followed by acted payoffs | Check whether children understand how each puzzle helps that particular friend; a scene alone may not make every pairing convincing |
| Freedom and onboarding | Stick, taps, keyboard, map, pawprints, tracked arrow and story invitation coexist | Observe which cues children notice; reduce duplication and teach one useful action at a time |
| Repair consequences | Bridges change water access; the garden repair restores scenery, while free walking already permits the surrounding terrain | Make the benefit of each shortcut observable in access, travel effort or shared behaviour, rather than relying on its label |
| Living world | Solid scenery, wind, wildlife and optional observations | Determine which places invite meaningful return visits; richer scenery does not by itself create deeper play |
| Emotional consequence | Friends express longing, thanks and reunion in films; ordinary residents generally return to their home locations | Review how everyday world behaviour could reflect restored friendships after the film ends |
| Learning and story | Three families drive repairs; the book offers a broader catalogue | Review where the wider activities naturally belong in the fiction without turning every game into a required repair |
| Before reading | Pictures, speech and worked examples support the core story | Verify understanding with children and with sound muted; icons and speech availability cannot be assumed |
| Rewards | Tree boughs, album stars, round leaves and discovery marks have separate purposes | Check whether the child can explain them and whether feedback feels consistent across activities |
| Performance and touch | Automated Chromium checks cover responsive layouts, geometry, controls and saving | Measure physical iPhone/iPad Safari performance, sustained play, finger comfort and installed German voices |

## Recommended next step: review one complete episode

Use the existing first bridge episode as a playable vertical slice of the whole experience. Do not expand the catalogue or add chapters before evaluating it.

1. Watch a first-time player encounter the bare tree, identify the current need and find Beaver.
2. Check whether Beaver's relationship with Hare and the broken crossing are understood without reading.
3. Observe whether the separate example teaches the pattern rule and the child can recover from a mistake.
4. Follow the return, repaired crossing, heartlight and reunion. Ask what changed and why the tree grew.
5. Let the child choose between visiting another friend, exploring and opening the book. Check whether they can return home and stop comfortably.
6. Repeat after an interrupted puzzle and after reopening the app offline.

Record comprehension problems separately from difficulty solving a puzzle. Record device, audio state and observed behaviour; do not treat automated test results as child observations.

## Acceptance goals for that review

- The child can identify a friend to help and find a workable movement control.
- The child can describe the local problem and recognise the result of helping.
- Help teaches the rule without supplying the answer.
- Returning to the forest makes the relationship, repair and new bough recognisable.
- Opening the map or book and returning to the forest does not cause navigation dead ends.
- Interrupting play preserves the task and earned progress.
- Target-device performance and touch targets remain comfortable during actual play.

These are evaluation goals, not claims of completed validation. Use the results to prioritise the next implementation change. Keep the remainder of the existing game available while improving this episode.

## Deferred decisions

More chapters, new currencies, additional required projects, procedural quests, recorded voices and a larger world are not part of this reset. Reconsider them after reviewing the current experience. The reset establishes a clear starting point; it does not commit to a new game architecture.
