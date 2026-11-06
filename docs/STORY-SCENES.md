# The heart of the forest — 6.5

The game now explains itself through the world. The first screen shows a large bare oak and an empty meeting circle. Its play button starts narration from a user gesture. Five short scenes establish the quiet Heart Tree, missing friendships, Beaver's longing for Hare and the promise that helping brings life back.

## A complete first episode

1. Approach Beaver. His head and ears droop; he says he misses Hare.
2. The camera reveals the real broken crossing. Hare waves from the other bank.
3. Fox shows a plank with picture marks. Finding the next picture explains the existing pattern task's purpose.
4. Play the same guided first-grade puzzle, with its original exact save and reward identity.
5. Return to the completed bridge and Beaver's delight. A small golden heart appears above the new connection.
6. Follow the heartlight through the actual 3D forest to the central oak. The previous canopy is held briefly so one newly green bough can visibly appear.
7. Walk with Beaver to Hare. The friends take their last steps towards each other in a close reunion scene. Greeting them adds no extra repair.

Each other project has a distinct request, emotional pose and thank-you: Hedgehog's lonely sleeping place, Owl's missing sign, Kingfisher's overgrown view, the garden shortcut, shared stories, the empty meeting clearing, seating and invitations. The return ritual keeps the connection to the tree visible. Chapter scenes develop the theme from meeting neighbours to reconnecting paths and preparing a gathering.

## An unmistakable landmark

The oak uses solid 3D geometry: a thick trunk, spreading roots, nine boughs, a heart-shaped hollow and nine growing canopy groups. Its meeting circle has nine small stone lights. The heart pulses gently and fireflies return as authored contributions accumulate. The woodland light warms with the same progress. The existing landmark coordinates and walking graph are preserved so older positions remain valid.

A tree direction marker appears at the edge of the exploration view when the clearing is out of sight. The header's tree control also leads home. Scene cameras establish the tree's full shape and show the repaired places from lower angles. Close conversation shots clear the foreground oak from the camera's path. Phone landscape places captions beside the action; portrait uses a bottom tray.

The finale brings all five neighbours and Fox together as articulated 3D actors. Hedgehog has a separate foreground place so the smaller character remains visible. The final invitation is simple: “Hier ist dein Platz, kleiner Fuchs. Du gehörst zu uns.”

## Child control and existing saves

Scenes advance only when the child chooses. They can repeat narration, skip to the pictured action or replay a scene. The speaker explicitly enables sound when asked to listen. Character pitch and pacing vary slightly, while the installed German voice remains the narration source. Reduced motion keeps poses and scene order while removing travel, bobbing and camera interpolation.

Animated story shots render at up to 30 frames per second. Reduced-motion shots repaint when the scene or layout changes, leaving static conversations inexpensive to display.

Seen-scene flags use the new, independent `farbtupf.cinema.v1` key. Watching a request never starts a puzzle, awards a star or contributes to the tree. The same nine authored repairs remain its sole growth source. Closing a short unfinished scene leaves it available again; interrupted puzzle questions remain exact. The finale resumes the existing saved ending cursor.

“Wie der Wald erwacht” at the tree revisits the opening as an explicitly narrated memory. It temporarily shows the bare tree and broken crossing, then reveals the child's actual current growth again. Those are presentation overrides: contributions, repaired routes, ending state, stars and pictures are preserved. Leaving the replay restores the real world immediately. Returning players receive an opening appropriate to their actual progress.

## Verification

The content suite checks all nine requests and returns, short captions, valid speakers, the heartlight-to-bough sequence, corrupted/unavailable scene storage, replay isolation and offline assets. The existing story model tests retain all 72 supported chapter orders.

`tests/cinema-browser.cjs` plays the opening, Beaver's request, the actual bridge puzzle, its exact save/resume, the returning heartlight and the reunion. It checks mesh-based actors, real 3D heartlight movement, growth held/revealed correctly, the direction marker, an interrupted earlier ending, all six faces above/beside captions at four screen sizes, the safe opening replay and offline restoration with legacy data retained. Captured screenshots go to `/tmp/farbtupf-cinema`.

The full story browser suite follows all nine repairs, chapter changes and the new ending. Its returning-player fixture marks introductory films seen so it can concentrate on gameplay and world state; the dedicated cinema suite exercises the actual unseen films. On machines without a GPU, the full story suite supports `FARBTUPF_SOFTWARE_RENDERING=1` to reduce raster resolution and disable shadows while retaining geometry, layout and touch paths.

Chromium automation does not establish physical Safari performance or narration quality. German speech availability and offline speech continue to depend on the device.
