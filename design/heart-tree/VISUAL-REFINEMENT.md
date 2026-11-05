# Three calmer woodland directions

> Archived design/review note. Implementation and approval statements describe the stage when it was written. See the [current app notes](../../docs/HEART-TREE.md) and [design index](../README.md) for the present build.

Status: archived comparison round. Subsequent exploration led to selection of **the original A, Painted woodland** in the [A/B comparison](VISUAL-MIDDLE-GROUND.md). See the [chosen art direction](ART-DIRECTION.md). Application implementation remains deferred.

The user likes the existing flat puzzle artwork but finds the woodland map too busy. This refinement explores a calmer, more abstract map and a matching future Three.js environment. The existing puzzle illustrations stay as they are.

[View the three-option comparison](visual-refinement-options.png). The upper row compares maps; the lower row compares the same brook-crossing scene as a future 3D environment. These are generated art-direction concepts, not screenshots of a working game or exact construction plans.

## The three alternatives

| Option | Map | Future 3D world | Main consideration |
| --- | --- | --- | --- |
| **1. Open watercolour** | Large pale washes, soft edges, small isolated landmarks and generous empty ground | Simple solid forms with broad painted surfaces and restrained texture | Closest to the current illustrations; paths and interaction targets need sufficiently clear edges |
| **2. Soft woodland** | Broad rounded land shapes, a clear continuous path and a few chunky landmark symbols | Matte sculpted trees, rounded stones, simple water and wood, very little surface detail | Recommended starting point for visual clarity; retain the fox's warmth and expression so simplification stays welcoming |
| **3. Paper forest** | Crisp organic shapes with a few subtle layers | Thick softly bevelled forms, restrained texture and gentle shadows | Gives places a clear visual structure; avoid stacking so many layers that the world becomes busy again |

These are three treatments of the same woodland. Their differences are edge softness, surface texture, volume and shadow, rather than different stories or navigation systems.

## Shared design rules

- Keep warm ivory, muted forest green, dusty water blue and the orange fox with green neckerchief. Give paths, characters and important objects stronger separation than decoration.
- Give every landmark open ground around it. Use a few canopy masses instead of drawing every leaf, and broad terrain fields instead of many tiny plants and stones.
- Keep the map focused on the Heart Tree, the main loop and five clearing landmarks. A growing puzzle library belongs inside those places and the picture-led activity book; it does not require a growing field of map markers.
- Keep the real 3D world at the planned fixed angled overhead camera. Broad walkable areas, simple natural boundaries and readable character silhouettes should carry navigation.
- Use one nearby invitation or current-goal cue where needed. Reserve animation for meaningful actions, resident gestures and feedback; avoid perpetual sparkles, moving grass and decorative effects across the scene.
- Assume the player cannot read. The option titles on the comparison are adult design labels, not required game signage. Landmark shapes, pictures, demonstration and spoken guidance remain the child's supports. Colour alone must not carry meaning.
- Retain Swiss-native forms: pedunculate oak, beech, hazel, alder, reeds, red fox, Eurasian beaver, European brown hare, European hedgehog, tawny owl and common kingfisher. Abstract details while preserving recognisable silhouettes. No white rabbit or ear-tufted owl substitution.

## Continuity and next step

The Heart Tree story, five-clearing loop, short complete quest arcs, bridge opening and room for many puzzles remain the design foundation. The previous detailed map remains useful for relationships between places, but its decorative density is no longer the target for new environment artwork.

Choose a visual direction from this comparison, then refine one map and one close scene in that direction. Generated concepts do not establish child usability or device performance. The first playable slice remains a later step, requiring an explicit instruction to build.
