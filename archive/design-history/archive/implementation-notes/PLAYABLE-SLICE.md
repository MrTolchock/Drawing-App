# The first local playable slice

> Archived design/review note. Implementation and approval statements describe the stage when it was written. See the [current app notes](../../../archive/project-baseline/docs/HEART-TREE.md) and [design index](../../../archive/project-baseline/design/README.md) for the present build.

The user authorised this build by selecting **Start the local playable slice**. It is implemented in [/workspace/Drawing-App](../../../archive/project-baseline/README.md). An owner-private hosted preview was subsequently created to fix the inaccessible localhost link. The existing public app is not replaced.

## Try it

[Open the private playable preview](https://farbtupf-herzbaum-preview-k7m4.andreas-itten.chatgpt.site). Sign in with the same ChatGPT account you use here. Native Sites deployment status confirmed success.

The earlier localhost address was only usable inside the workspace. For local development, start `python3 -m http.server 8000 --bind 0.0.0.0` from the application directory. `?screen=hub` opens the retained activity library directly. [Hosting and future-update notes](../../../archive/project-baseline/docs/PREVIEW.md).

Actual browser captures are available here:

- [Opening](../prototype-screenshots/01-opening.png)
- [Beaver's bridge request](../prototype-screenshots/02-bridge-request.png)
- [Separate demonstration](../prototype-screenshots/03-demonstration.png)
- [The existing flat pattern activity](../prototype-screenshots/04-flat-puzzle.png)
- [Pictured return](../prototype-screenshots/05-pictured-return.png)
- [Walking over the repaired bridge](../prototype-screenshots/06-crossing.png)
- [Phone view](../prototype-screenshots/07-phone.png)

## Implemented

- Real Three.js woodland geometry and animated fox, Eurasian beaver and European brown hare, with the selected original A as the visual reference.
- Tap/click walking, arrow keys/WASD, a fixed angled overhead camera, safe routes and fading canopies.
- A working longer route to both neighbours, and an upstream bridge repair that creates the direct shortcut.
- One shared opening quest, including Hare-first discovery.
- The existing five-item stage-one Musterzug round with separate demonstration, replayable instructions, fresh attempts and pictured return. Other library levels remain independently selected.
- Leaving, reloading and continuing the supported pattern session with its current item, answer order, answered state and round progress.
- One durable bridge contribution, independent of whether a new learning star is earned. Completed repairs remain after interruptions and reloads.
- Access to the existing activity library and a fox control returning to the woodland.
- Locally bundled Three.js and first-slice assets in the PWA cache.

The new forest namespace is `farbtupf.forest.v1`. Legacy settings, learning progress and IndexedDB identifiers are retained.

## Verification completed

- **79 unit checks:** learning 14, adventures 25, expeditions 24, existing artwork 5 and forest state/navigation/guidance 11.
- **Forest touch journey:** changed walking target, Hare-first route, shared request, wrong-answer retry, separate help without live-answer cues, interrupted session recovery, existing-star completion, pictured return, walking over the new bridge and persistent repair.
- **Offline:** Three.js world and saved bridge reloaded without network; the browser journey made no external runtime requests.
- **Existing learning browser checks:** 12 rounds / 60 tasks, rewards, three-stage routes, reading progression, touch tracing, responsive layout and offline progress.
- **Handwriting:** all 68 models fit after stage changes; all 17 corrected models completed with simulated touch strokes.
- **Additional checks:** fox framing after portrait resize, actual arrow-key movement, renderer pause in the book, return to the repaired world, and speech replay inside pictured requests. Syntax and whitespace checks passed.

These checks used Chromium, including software WebGL. They do not establish comfortable performance or comprehension on a physical iPad or with children.

## Remaining work

Prototype narration uses available German device voices, preferring `de-CH`. The cloud browser has no installed voices, so actual spoken playback was not verified there; voice selection/cancellation/mute were checked using a controlled speech stub. Reviewed offline recordings remain future work. Local visual demonstrations work independently of that voice availability.

Next is observation on the intended iPad/Safari with real audio and children aged 6–7. Use those findings to refine controls, camera, asset quality, guidance and pacing. The remaining forest, story chapters, activity adapters and individual puzzle review follow. The full five-clearing world and 120 illustrative episode capacity are not delivered content in this slice.

[Application implementation notes](../../../archive/project-baseline/docs/HEART-TREE.md) · [Roadmap](NEXT-STEPS.md)
