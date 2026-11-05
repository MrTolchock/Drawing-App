## Complete story implementation — 5 November 2026

> Archived design/review note. Implementation and approval statements describe the stage when it was written. See the [current app notes](../../docs/HEART-TREE.md) and [design index](../README.md) for the present build.

All nine helping projects, all five Swiss-native neighbours/clearings, the closed
main woodland loop, two useful restored shortcuts, Meet → Reconnect → Gather,
the saved/replayable gathering and fifteen guided practice collections are now
implemented. Original A — Painted woodland remains the visual direction.

App source: 25ad7a240c69205df1530c12254f9088817487b1 on GitHub main.
Owner-private preview: https://farbtupf-herzbaum-preview-k7m4.andreas-itten.chatgpt.site
Private source: c348dc758a736085726afc2d146e28abd3ac004d.
Native deployment appgdep_6aecc753bb3081919ab056367ac8b960 succeeded.
The current 98 runtime files were copied and hash-verified before publication.

102 unit checks pass, including all 72 permitted chapter-order combinations.
The complete touch journey passed every quest, chapter transition and ending;
three new interrupted puzzle types and the ending resume exactly. All three
practice types preserve story completion. The final restored world reloads offline.
The 60-task existing learning smoke test also passes. No GitHub Pages waiting or
status polling was added. Existing legacy progress and picture storage remain.

The important remaining input is a real child/device observation. An async
question asks the user to try the opening with a nonreading 6–7-year-old on the
intended iPad, identify the first point requiring adult explanation, and confirm
that German guidance is audible. A fresh profile avoids resetting original saves.
Physical Safari performance, heard device voices and child understanding are not
established by cloud automation. Individual puzzle-content review remains the
separate review the user deferred. The Sites managed browser tool is unavailable;
publication is verified by native deployment status, not a hosted browser visit.

## Current implementation update — Owl chapter

Following the user's instruction to continue development without waiting for
GitHub Pages, Tawny Owl's story hollow and The Old Trail Sign are implemented.
This third complete arc reuses Roboterpost's flat grid family with pictured
fox/owl targets, separate demonstration, arrow controls and stepwise undo.
Exact current grid, position, recent history and answered state persist.
Five routes restore the picture sign once, independently of reward stars.

Validation: 95 unit checks, 15 library route rounds across all three stages,
the complete Owl touch journey, two interrupted save/resume states, offline
3D/sign reload, both earlier quest journeys and the 60-task learning smoke test.
Final phone and landscape views were inspected. No Pages status was polled.
Source commit: ee2a321 (full SHA recorded in the chat after push).

The next story increment is Common Kingfisher's reed pond and A View of the Water.
Physical iPad/Safari, heard guidance audio, child understanding and the individual
puzzle-content review remain pending. Preserve original A and one invitation at
a time while completing the five-clearing loop and larger story.

## Current implementation update — 5 November 2026

The user authorised continuing and committing to GitHub on `main`. The local app
now includes Hedgehog's moss grove and a complete resting-place quest using the
existing flat Waldschatz memory family. The original A visual direction remains
selected. Both story contributions and exact supported puzzle sessions persist.
GitHub Pages publishes `main`; final validation and source/deployment details are
recorded in the application repository and this chat. Physical iPad, audible
speech and observed child usability checks remain pending.

# From chosen visual direction to the final app

The user has selected the **original A, Painted woodland** and explicitly authorised the first playable slice. The Heart Tree story, five-clearing loop, short complete quests, Swiss-native woodland and flat puzzle format remain the foundation. [The first slice is implemented and available through an owner-private preview](PLAYABLE-SLICE.md); a public release remains later work.

## Current design work

The [chosen art direction](ART-DIRECTION.md) is recorded, and the [opening walkthrough](painted-woodland-opening.png) carries it through movement, meeting Beaver, a separate demonstration, a fresh attempt, pictured return and the usable bridge result.

Steps 1–2 are recorded in the [opening layout and camera](OPENING-LAYOUT.md) and [interaction-state contract](OPENING-INTERACTIONS.md). The [opening review packet](OPENING-REVIEW.pdf) brings their visual boards and route/state summary together. The local slice now exercises these behaviours; real-device comfort, spoken playback and child understanding still need observation.

This updates the presentation of the existing [first-session design](FIRST-SESSION.md). The pattern example remains illustrative; it does not settle the individual puzzle review or replace current question banks. Adult headings on the board are outside the child-facing views.

## Sequence

| Step | Concrete output | What it needs to resolve |
| --- | --- | --- |
| **1. Make the opening walkable on paper** | A gameplay layout of the Heart Tree, brook and meadow garden, with paths, interaction spots, natural boundaries and camera views | The fox can move freely, find Beaver or Hare first, and understand the unfinished crossing. The repaired bridge creates a useful connection. |
| **2. Complete the first-quest interaction design** | Picture-led request, guidance, fresh attempt, help, cancellation and return states in the chosen style | A child who cannot read can understand the goal and action, ask again, leave and return, and see what changed. |
| **3. First local Three.js slice — implemented** | Real 3D fox, tree, brook, garden and neighbours; one existing flat activity; persistent bridge repair | Automated checks cover movement, camera, launch/return, session recovery, offline loading and existing progress. Device and child checks remain. |
| **4. Check the slice before expanding** | Target-device checks and observed first sessions with children when available | Touch controls, real guidance audio, camera occlusion, learning comprehension and puzzle difficulty can be assessed separately. Use the findings to revise the slice. |
| **5. Expand story and library** | Five connected clearings, Meet → Reconnect → Gather, shared projects and the picture-led practice book | Many activities fit inside familiar places. Optional collections preserve completed milestones and keep only a few invitations visible. Review puzzle families progressively. |
| **6. Finish and validate the app** | Consistent assets and voices, complete story states, reviewed activities, save/resume and offline behaviour | The whole journey works on the intended devices, including repeat play and interruptions. Publication is a later explicit action. |

## Immediate review: one short first adventure

Use the [private playable preview](https://farbtupf-herzbaum-preview-k7m4.andreas-itten.chatgpt.site) on the intended iPad/Safari. An adult signs in before the child's session.

First check the actual 3D look against original A, comfortable tapping, a visible fox and audible German guidance. Replay an instruction. Device speech has not been verified on this iPad. If it is unavailable, record that and prioritise reliable guidance audio; reading the planned line aloud counts as adult support.

For a first encounter, keep the bridge unfinished. If it was already repaired during an adult playthrough, a separate ordinary browser profile signed in to the same ChatGPT account provides a fresh preview without erasing the original progress.

Keep the child session short, roughly five minutes as a starting point rather than a timer. Invite exploration, let the app's pictures and guidance lead, and offer help when needed. Observe:

| Moment | What to notice |
| --- | --- |
| Walk | Does the child intentionally move the fox and find a neighbour? |
| Request | Do they notice the bridge problem and the way to help? |
| Activity | After the separate demonstration, do they know where and how to answer? |
| Support | Can they use the taught replay or demonstration controls when needed? |
| Payoff | Can they return to Beaver, notice the repair and use the new crossing? |

Record **independent / after planned help / after an extra adult explanation** for each moment. Record puzzle accuracy separately: an incorrect answer can still show that the child understood the action. Note the first one or two places where the experience became unclear. A short spoken “Was hat sich verändert?” can examine the story connection after the return.

Use the observations to refine movement, camera, guidance, audio and pacing. Recheck affected moments. No child usability result is established until these observations exist.

The next world expansion after this review is **Hedgehog's moss grove and one complete resting-place quest**, using another existing flat activity family. This tests a second quest/activity adapter within the same calm geography. It does not require deciding every puzzle now. Keep the Swiss-native cast and original A density, then extend the remaining loop and growing collections progressively.

## Opening-layout defaults for step 1

- Place the fox near the quiet Heart Tree with one clearly visible reachable path spot for the movement demonstration.
- Present the brook and garden as the first two nearby clearings. A safe existing route permits exploration while the shorter crossing awaits repair.
- Put Beaver, the bridge gap and the garden-side destination within one readable camera composition. The missing connection should be visible before its explanation.
- If Hare is visited first, she points towards the same shared bridge request; this does not create a second opening tutorial.
- Retain enough open ground for the approved A appearance and comfortable interaction. Decorative vegetation stays clear of paths and targets.
- Return the player beside Beaver after the flat activity. Repair once, then let the child walk over the bridge immediately.
- Reveal the onward loop after that payoff. Introduce the map and practice book later, when useful.

Design steps 1–2 and the first local slice in step 3 are complete. The next phase is step 4: real-device audio/performance checks and child observation. Exact comfort, timing and comprehension remain evidence-dependent.

[Detailed implementation plan](IMPLEMENTATION-PLAN.md) · [Child interface](CHILD-INTERFACE.md) · [First-session observation packet](FIRST-SESSION.md)
