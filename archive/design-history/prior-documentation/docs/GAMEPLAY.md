# Gameplay: small adventures with things to do

Activities use editable, pictured situations. The same first-grade Swiss Standard German content, three open stages and unlimited retries remain. A wrong attempt has no penalty, deadline or lost reward.

## A clear next step

The single Waldspiele book offers an optional three-stop Entdeckertour. A general tour mixes quantities, language and spatial/nature activities; choosing a neighbour offers three of that neighbour's games. Completed and unexplored activities are considered when selecting the next tour, so later trips can vary.

The current tour's three destinations, chosen stage and completed stops are stored under `farbtupf.journey.v1`. Leaving for a different activity or closing the app keeps the next unfinished stop. A practice stop starts a fresh five-question round when reopened; the story's existing exact-question recovery remains separate. Unknown or damaged tour saves recover safely, and unavailable storage falls back to the in-memory session.

Finishing a round offers a pictured next activity. Four tasks solved without retries or requested hints can offer the next stage; it is applied only after the child explicitly chooses it. This is a practice suggestion, not an assessment or a required level gate. Hints never reduce stars. Finishing a tour adds no farmable bonus stars, and completing unrelated free practice does not skip its saved stops.

## Direct manipulation

- **Zählgarten:** search scattered ladybirds among plants. Count marks appear in the order selected and renumber correctly after undo. Counting precedes choosing the numeral, including a deliberately empty garden.
- **Znüni-Rechenfreunde:** give away or combine actual apples by tap or drag. The visible pictured target states how many to move. All transfers can be undone before choosing the result; swap and neighbouring sums remain in the same collection.
- **Musterzug and Naturdetektive:** drag a picture to the actual missing wagon/illustrated question mark, or select it by tap. A correct choice visibly fills the scene. Hints highlight the relevant pattern group or nature clue.
- **Sternenrakete:** choose cargo rather than fill answer-sized vacant seats. Load one/two/five-star bundles according to stage, attempt a launch, remove excess stars and retry. Both underloading and overloading remain possible.
- **Waldpicknick:** share the same physical berries among two, three or four recipients by stage. Move a berry from any plate to another plate or back to the basket. Both tap selection and dragging preserve its identity, and undo restores its previous place. An empty basket with unequal plates does not pass.
- **Zauberspiegel:** construct an equal second group first, with editable extra/missing stars. Only then combine the two groups to find the double.
- **Formenwerkstatt:** build a woodland house with two/three/four missing geometric parts. Stage three adds quarter-turn rotation; symmetric shapes behave correctly. Pieces fit only the matching outline and orientation.
- **Roboterpost:** queue arrows, remove individual commands, reset, then run the route. The character moves only during execution. A blocked or incomplete program remains editable and reruns from the start. Story route boards retain direct movement and saved snapshots.
- **Beerenvergleich:** select berries on both sides to form real one-to-one pairs. Undo returns a pair to its original piles. Unpaired berries make the greater quantity visible; children can also solve mentally.
- **Waldumfrage:** illustrated ballot cards show each friend's fruit choice. Enter their votes to construct the chart, then answer its question. The overview remains directly accessible, and advanced questions begin with the finished chart.

Touch release and click handling are coordinated so dropping an object does not accidentally activate a different object or swallow a fresh tap. The same protection spans screen changes: returning to the book cannot also open the game underneath that finger. Leaving a game cancels its animation/drag state. Mouse, touch and keyboard paths remain available, with reduced-motion settings honored.

## Repairs in the world

The forest now shows a line of pawprints along a selected walking route, visible visit marks and pictured mission invitations. Before/after pictures explain a repair at the point of accepting it. Its return scene frames the actual restored place and brings the relevant neighbours together. After a completed project, a friend can walk behind the fox to the next destination, including Biber crossing the repaired bridge to Hase.

These moments do not add, reorder or reset story contributions. The same nine authored milestones revive the Heart Tree; optional tours never grow it. Existing drawings, stars, settings, story sessions and endings retain their storage identifiers.

## Verification

Content tests cover quantity bounds, equal sharing across all recipient counts, reachable shape rotations, route validity, exact story saves and all 72 supported chapter orders. Journey tests cover saved stop recovery, replay/duplicate advancement, incompatible free games, level boundaries and corrupted/unavailable storage.

The browser suites separately exercise real touch interactions, construction gates, wrong loads and arrangements, undo, ballot entry, robot execution, touch-drop cleanup, explicit stage recommendations, responsive content bounds and offline reload. The journey navigation test uses completion helpers to isolate the tour controller; it does not claim to solve the individual games. Those mechanics are exercised in the dedicated learning/adventure/interaction suites and the broad play-through. A separate return-navigation check plays all three guided practice types and checks that delayed touch clicks cannot reopen another round, while a fresh tap still works.

Device narration still uses installed German voices. Chromium touch emulation does not establish physical Safari compatibility or test voice quality.
