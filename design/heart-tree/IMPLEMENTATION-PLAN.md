# Implementation plan — future Three.js application

> Archived design/review note. Implementation and approval statements describe the stage when it was written. See the [current app notes](../../docs/HEART-TREE.md) and [design index](../README.md) for the present build.

Implementation reference. The user explicitly authorised the first local playable slice, which is now implemented. [Current scope, screenshots and verification](PLAYABLE-SLICE.md) distinguish that slice from the later phases below. No publication or deployment was authorised.

## 1. Recommended first build

Follow the [opening layout and camera specification](OPENING-LAYOUT.md) and [interaction-state contract](OPENING-INTERACTIONS.md). The [current opening review packet](OPENING-REVIEW.pdf) visualises these in the selected original A style.

Build a local first playable slice containing:

- The quiet Heart Tree, Beaver’s brook and Hare’s meadow garden.
- An actual 3D fox with the established scarf and recognisable native neighbours.
- Tap/click walking, a fixed angled overhead camera and readable interaction targets.
- The selected bridge request, beginner guidance, one existing flat activity and a pictured return.
- The one-time bridge payoff, first tree response and invitation to the wider loop.
- Saved story progress and preservation of existing learning progress.

Use stage-one Musterzug as the current functional candidate, retaining its existing rules and reward identity. The native-object paper patterns are instructional references, not a final approved replacement question bank. Final activity choice and content remain subject to the later puzzle review.

The slice proves the world/puzzle relationship, visual approach, guidance contract and save behaviour before producing the whole forest.

## 2. Fit the current application

The application is a static HTML/CSS/JavaScript PWA with existing flat screens.

| Existing part | Relevant behaviour | Planned integration |
| --- | --- | --- |
| [Startup](../../js/app.js) | Initialises effects, audio unlocking and service worker, then opens hub | Add the forest entry after the world module is ready; retain direct learning access |
| [Screen router](../../js/ui/ui.js#L22) | build/enter/leave lifecycle and history | Register the forest as a screen and explicitly handle return context |
| [Learning screen](../../js/screens/learn.js) | Selects game and global stage, runs a round, records completion | Accept an explicit session/stage and emit round completion independently of stars |
| [Adventure screen](../../js/screens/adventure.js) | Several distinct mechanics and a round finish | Add the same session contract per supported activity |
| [Expedition screen](../../js/screens/expedition.js) | Several mechanics including memory and mirror grid | Add the same contract, with appropriate state and guidance |
| [Reading screen](../../js/screens/read.js) | Four reading modes | Keep per-mode target-audio policies and original reward identities |
| [Progress/settings](../../js/core/store.js#L25) | Stable settings and replay-safe learning rewards | Preserve the existing identifiers; add separate world/session storage |
| [Saved artwork](../../js/core/store.js#L72) | IndexedDB stores state and pictures | Preserve the database and stores; reference selected drawings without renaming old data |
| [Sound](../../js/core/sound.js#L1) | Synthesised effects, currently no speech | Add a separate guidance/audio layer with repeat and mute handling |
| [Service worker](../../sw.js) | Caches local runtime assets | Include the chosen local Three.js dependency and new required assets deliberately |

The router currently treats the hub specially and several finish screens navigate there directly. A forest return must use explicit session context rather than relying on the existing Back button alone.

## 3. Proposed responsibilities

These are module roles, not files already created.

| Role | Owns |
| --- | --- |
| Forest scene | Three.js scene, native terrain/props, world visual states |
| Fox controller | Walking, safe navigation and character animation |
| Camera controller | Fixed angle, following and occlusion handling |
| Interaction controller | Nearby residents, activity places and active goal |
| Quest coordinator | Requests, contributions, milestones and one-time world effects |
| Activity catalogue | Existing activity references, stages, guidance versions, content packs and placements |
| Activity session | Current quest/practice run, selected activity, return place, completion and cancellation |
| Guidance player | Instruction voice, demonstration, replay and audio/content policy |
| World save | Stable quest/world state and resumable checkpoints |
| Child interface | Pictured invitations, map, practice book, pause and scene return |

Keep DOM puzzles separate from Three.js meshes. Pause unnecessary world animation while a flat activity is active. Do not mount the existing exercise UI as a 3D billboard.

Verify the appropriate Three.js release and local distribution when implementation starts. Keep required code and assets local for the PWA. No dependency or package installation has been performed during design.

## 4. Session contract

A launch needs an activity reference, chosen stage, content reference where applicable, quest run identity or practice context, guidance version and world return checkpoint.

A completion reports that the current round succeeded. Its star award can be zero because the child played it before; the story still needs its fresh contribution.

Apply the story contribution and world effect by stable identity once. Save the completed result before presenting the celebration. Test recovery when the page closes during completion.

A practice run retains its learning rewards while leaving unrelated story state unchanged. A cancelled run returns to its safe checkpoint without a failure penalty.

Use explicit stage parameters for quest sessions and remember preferences per activity. The existing global stage can remain a fallback. Avoid temporarily changing one global level in a way that silently changes other subjects.

## 5. Save compatibility

Preserve current storage:

- Settings: farbklecks.settings.v2.
- Learning rewards: farbklecks.progress.v1.
- IndexedDB database: farbklecks, with existing state and bilder stores.

Add a new versioned world namespace, proposed as farbtupf.forest.v1. It can contain stable quest contributions, completed milestone identities, applied world effects, active run/checkpoint, world position, guidance version and per-activity stage preferences.

Do not use titles, array positions or the number of currently available episodes as completion identities.

Each milestone has an explicit required contribution set. New optional activities must not extend a completed requirement or make the tree sleep again.

Mark guidance familiarity separately from learning mastery. Replaying a demonstration remains possible regardless of the saved flag.

Detailed question-state restoration requires a serialisable snapshot per adapter. Preserve the last safe checkpoint until that is actually implemented; do not equate an in-memory pause with persistence after a reload.

## 6. Art and map production

Use the [selected original A, Painted woodland](ART-DIRECTION.md), retaining its original detail and open-space balance. The left column of the A/B comparison is the authoritative style reference.

Use a fixed orthographic angled overhead camera and actual 3D terrain/character silhouettes. Painted textures, soft lighting and restrained geometry should carry the watercolour identity.

First prove the fox, oak, brook, bridge and native brown hare in motion. Planning illustrations are reference art, not ready-made 3D assets. Do not use the large contact-sheet images as the game world.

The opening segment needs readable natural boundaries and an onward exit. Validate walkability and camera framing in the first slice. The main loop and its shortcuts are expanded after the first scene works.

Both neighbours are initially reachable via the tree and a broad existing stone-and-earth crossing on the garden approach. The quest repairs the distinct upstream timber bridge into a direct shortcut. Keep this connectivity and safe return landings explicit in navigation. The opening's natural onward boundaries clear as part of its completion, without another task; the local slice demonstrates the onward invitation rather than claiming the whole forest is built.

Keep three activity places per clearing as the spatial default. A growing catalogue adds content records and flat activities before it needs more 3D buildings or resident markers.

All new world plants and animals follow the verified Swiss-native palette. Additional species and exercise imagery require their later review.

## 7. Voice and guidance assets

Beginner guidance needs speech, a visual demonstration and a fresh attempt. It must work without reading controls or prompts.

The repository currently has no speech recordings or speech integration. Production needs bundled, reviewed Swiss Standard German clips, cached for required offline guidance. A recording source has not been supplied or configured during planning.

A device speech voice can be a temporary development aid if available. It must not be described as a reliable offline recording asset or evidence of child comprehension. A missing device voice must not leave the non-auditory reference activity unexplained: visual guidance remains essential.

Before calling the non-reader slice usable on a target device, verify actual speech playback and replay there. Auditory activities such as rhyming need suitable target-word audio or another appropriate story activity.

Keep instruction audio distinct from printed reading targets. Prevent overlapping instructions, duck decorative sound where appropriate and preserve mute choices.

## 8. Build sequence after authorisation

### A. Opening slice

Establish the local Three.js entry, two-neighbour scene, movement, camera and current goal. Add the selected request, one supported flat activity, guidance, return and durable bridge payoff.

### B. Demonstrate growth

Attach another existing activity and several optional episodes to the same place. Add the picture-led practice book and explicit story/practice context. Validate that the scene stays uncluttered.

### C. Complete Meet

Expand the woodland loop and five native residents. Add the remaining introductions and root-light milestone.

### D. Reconnect and Gather

Add shared projects, persistent shortcuts, contribution scenes and the finale. Completed story states survive optional catalogue updates.

### E. Integrate the reviewed library

Attach reviewed activities and collections progressively, with the readiness matrix determining needed guidance and audio policy. Keep the question-content review separate from the structural inventory.

### F. Release validation

Retain existing learning, handwriting, reward and offline checks. Add meaningful world/session tests and device observation. Test the intended iPad/Safari environment and observe real children before making usability claims.

## 9. Acceptance for the first slice

- The child can discover movement through the planned gesture and short voice.
- A request has a visible goal and teaches the activity’s action before reading.
- The flat activity retains correct existing rules and stage selection.
- A fresh successful round can complete the quest even when no new star is earned.
- Return uses the correct neighbour/place picture and restores the camera/location.
- The bridge becomes walkable and remains repaired after reload.
- Replaying or cancelling does not duplicate a world effect or erase progress.
- Existing saved learning progress, pictures and sticker rules remain intact.
- Required first-slice assets work after a successful offline load.
- Actual voice availability is reported honestly.
- The native character silhouettes and painterly 3D appearance are reviewed.
- Input, camera and response are comfortable on the target device.
- Child task comprehension remains a separate observation result, not inferred from code tests.

## 10. What is still evidence-dependent

Actual child observations, final question-bank review, production recordings, final 3D asset quality and physical device performance are not established by this design pack.

The first local slice is implemented in the original A direction, retaining existing flat puzzle artwork and reward identities. The [next phase](NEXT-STEPS.md) is device/audio checks and child observation. The remaining forest phases and production recordings are future work. No deployment or publication has occurred.

