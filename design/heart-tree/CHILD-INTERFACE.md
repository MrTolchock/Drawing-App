# The child’s interface

> Design reference recorded during planning. Implementation and approval statements describe the stage when it was written. See the [current app notes](../../docs/HEART-TREE.md) and [design index](../README.md) for the present build.

Design specification for ages 6–7, initially unable to read. The [first local slice](../archive/implementation-notes/PLAYABLE-SLICE.md) implements the opening request, pattern guidance, help/leave/continue and pictured return. Full map/catalogue interfaces remain planned; the existing activity library is retained through the book. The selected identity, Swiss-native world and flat puzzle format remain the foundation.

Environment reference: [the selected original A, Painted woodland](ART-DIRECTION.md). Its open-space and detail balance carries into the [opening walkthrough](painted-woodland-opening.png); flat activities retain their existing visual language.

The opening's [layout and camera](OPENING-LAYOUT.md) and [interaction states](OPENING-INTERACTIONS.md) make these defaults concrete. The [support-route storyboard](opening-support.png) illustrates the optional paths around the normal quest flow.

## 1. Two routes into an activity

**Story:** forest → neighbour’s pictured request → guidance when needed → flat activity → pictured return → same place and its story result.

**Practice:** forest → practice book → activity preview → guidance when needed → flat activity → pictured return → the place where the book was opened.

The practice book is an optional route introduced after the first bridge quest. A story outing does not require opening a catalogue.

## 2. Screen responsibilities

| Screen or state | What is in focus | How the child understands it |
| --- | --- | --- |
| First arrival | Fox and one reachable path spot | Gesture, footprints and a short spoken action |
| Forest | One active small goal and nearby residents | A small picture of the goal, familiar landmarks and one local invitation |
| Neighbour request | The visible change the neighbour wants | Character gesture, one short line and a pictured request |
| More local invitations | A small selection of story or side requests | Meaningful previews; tapping begins context and guidance |
| Practice book | A small page of activity previews | Animal/place tabs and demonstrations of what each activity does |
| New rule | One separate example | Short voice, highlighted action and a demonstration |
| Live activity | One current learning task | Picture support, taught controls and repeatable help |
| Round result | One primary return action | A picture of the place or neighbour left behind and a short spoken line |
| World payoff | The durable effect of the help | A repaired crossing, renewed place or neighbour interaction |
| Pause or resume | Continue the active outing | A familiar fox/place picture and preserved checkpoint |

The adult labels on planning boards are not child-facing instructions.

## 3. The forest screen

Keep the fox visible through a fixed angled overhead camera. Occluding foreground foliage fades. A clear walkable path and natural landmarks are more useful than dense decoration.

Use a single current-goal picture. On the opening outing it is the unfinished crossing, not a written quest list.

A tap on the ground walks there along a safe route. A tap on a neighbour approaches and opens the request when close. The child can continue wandering; finished steps remain recorded.

Introduce the map and practice-book controls when useful rather than presenting every system on arrival. Their meanings need a brief contextual demonstration.

The map uses the five familiar residents and paths. Selecting a place can set walking guidance. It does not need reading a legend or instantly teleporting the fox.

## 4. Neighbour invitations

The first request has one obvious way to help. Hare can lead the child towards the same bridge request if visited first.

After the opening, a resident may offer a small set of pictured requests, normally no more than two or three at once. Show a meaningful preview of a bridge, trail, gathering place or observation, rather than a generic question mark beside a title.

Tapping a request begins its story context and instruction. Avoid hidden hover behaviour or an unexplained requirement to tap twice.

An additional book control can offer practice. The story request and practice route carry different completion context.

Changing the active request preserves prior finished contributions. Leaving an invitation panel returns to the forest without a failure message.

## 5. The practice book

The physical book at the Heart Tree is a landmark. A secondary book shortcut can open the same catalogue elsewhere after its introduction; return to the original world place afterwards.

A page shows a small set of large activity previews. Begin with familiar place portraits and previously introduced interaction families. Pagination and browsing controls need a demonstrated meaning.

A preview should suggest the action: a picture entering a gap, quantities being matched, an item being hidden or a brush making a mark. Names and subject words can accompany these pictures for emerging readers, but do not carry the selection alone.

New question collections can join familiar activity previews. A new mechanic receives its own introduction. Keep the recommended beginner route distinct from the complete catalogue so a child is not forced into a reading target before readiness.

Challenge selection is available separately for the current activity, with spoken labels and pictured examples when opened. The first visit can use a suitable simple default; needing narration does not force every subject to its easiest content.

## 6. Guidance, live attempts and help

Before an unfamiliar interaction, show a practice item and then a fresh attempt. Replay remains available. A new content pack with the same rule need not force a full tutorial again.

Teach the speaker/character help control itself. Use the same meaning across games. A memory activity also needs separate taught meanings for hiding and looking again; do not reuse one identical icon for unrelated actions.

The live attempt must not be marked with the demonstration’s answer cue. Speaking the instruction is distinct from speaking a target word being tested.

Provide thinking time. A quiet pause does not automatically mean confusion. Review existing timed hint behaviour with children instead of assuming a fixed delay is appropriate.

## 7. Completion and return

The primary completion action is a large scene picture: for the opening, Beaver and the brook. A short line says “Zurück zum Biber.” The child does not need to read “Weiter” or “Zur Lerninsel”.

Preserve the original world location and camera. Apply the story result once. The bridge can be used immediately after the return.

A secondary replay action is introduced after the main flow is familiar. A round launched for practice does not accidentally complete an unrelated quest.

Existing star and sticker rules remain intact, but the primary story message is the neighbour’s result. A replay can complete a new story contribution even when its learning star was already earned.

## 8. Pausing and persistence

The child can pause, ask again, leave an unfinished task or return to wandering. Preserve completed quest steps, repairs, chosen activity level and a safe return checkpoint.

Detailed interrupted-round restoration depends on the activity adapter and must be implemented and tested explicitly. Until that exists, do not claim that every current game already restores its exact question state.

A large, growing library retains only a few visible invitations. Completed milestones remain complete when optional collections are added.

## 9. Review before calling the interface ready

Observe whether a child can find the goal, act on an invitation, recognise the activity preview, use the taught gesture, ask again, return to the forest and recognise what changed. Record learning difficulty separately from instruction comprehension.

Paper cards can examine goals and action concepts. Walking, touch targets, timing, speech playback and actual return transitions require the later interactive slice and target-device observation.

[Interface flow board](../archive/storyboards/child-interface.png) · [First-session packet](FIRST-SESSION.md)
