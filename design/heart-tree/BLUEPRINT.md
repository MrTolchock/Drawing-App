# Farbtupf — Der Herzbaum

> Design reference recorded during planning. Implementation and approval statements describe the stage when it was written. See the [current app notes](../../docs/HEART-TREE.md) and [design index](../README.md) for the present build.
## Die vergessenen Pfade

Design blueprint. Its broader story and world remain the roadmap. The [authorised first local playable slice](../archive/implementation-notes/PLAYABLE-SLICE.md) is now implemented separately in the application repository. No deployment or wholesale puzzle redesign has occurred. These illustrations remain concept references.

The [design pack index](README.md) links the consolidated story, child interface, activity guidance matrix, walkthrough materials and future implementation plan.

An [eight-page visual review](../archive/reviews/DESIGN-REVIEW.pdf) provides a compact route through the chosen direction and proposed first playable slice.

Chosen visual direction: the user has selected **the original A, Painted woodland**, in the left column of the [A/B comparison](../archive/woodland-studies/visual-middle-ground-options.png). Preserve its original balance of detail and open space. The [art direction](ART-DIRECTION.md) records the reference; [next steps](../archive/implementation-notes/NEXT-STEPS.md) carry it into gameplay and later implementation. Existing flat puzzle artwork is retained. Earlier alternatives are archived explorations.

Capacity revision: the ten story milestones organise a growing library of puzzle activities and short quests. The detailed content-growth plan is in [A forest with room for many puzzles](PUZZLE-LIBRARY.md).

Audience priority: children are 6–7 and initially cannot read. Goals, instructions, controls, help and feedback must be understandable through pictures, spoken guidance and demonstration. The detailed interaction plan is in [Understand before reading](BEFORE-READING.md).

The [first-session script and picture-card walkthrough](FIRST-SESSION.md) now provide concrete reference materials for checking this requirement. These are static design materials, with no child observations or app implementation yet.

The user has asked for autonomous continuation, fewer requests to pick between alternatives, and at most three options when a genuinely substantial choice needs discussion. Their later explicit approval authorised the first local playable slice. The current task does not authorise publishing.

## 1. The experience

**Player promise:** Explore a welcoming Swiss woodland, help its neighbours reconnect, and see the forest remember how to come together.

The Heart Tree once stood at the centre of woodland life. Over time, its old shortcuts and shared places have become overgrown. The neighbours still live nearby, but their paths cross less often and the tree has grown quiet.

The fox arrives at the old meeting clearing. Helping Beaver reopen a crossing to Hare’s garden becomes the first act of reconnection. Other small acts gradually restore the forest’s shared places. The ending brings everyone back to the Heart Tree, whose roots, branches and canopy have awakened along the way.

Tone: curious, warm, playful and reassuring. Each resident has a reason to want a connection with another. The tree’s awakening expresses those renewed connections.

## 2. Direction already chosen

| Part | Chosen direction |
| --- | --- |
| Overall story | The Heart Tree |
| Story opening | The Forgotten Paths |
| World | One persistent woodland loop around the tree |
| Places | Beaver’s brook, Hare’s meadow garden, Hedgehog’s moss grove, Owl’s story hollow and Kingfisher’s reed pond |
| Session structure | Short, complete quest arcs within an explorable forest |
| Puzzle capacity | Growing collections at several activity places in each clearing; separate story, quest and activity records |
| Opening | Two nearby clearings and one introductory quest, then access to the full loop |
| Progression | Meet → Reconnect → Gather |
| First quest | A Bridge to the Neighbours |
| Visual identity | Original A, Painted woodland, for map and 3D surroundings; existing Waldatelier flat puzzle art, ivory and forest green |
| Future rendering | Three.js for the angled overhead 3D world; existing puzzles remain flat |
| Ecology | Swiss-native species suited to a Zürich-area lowland woodland and freshwater margins |
| Audience | Ages 6–7; assume no reading ability at the beginning |
| Beginner guidance | Short spoken instructions, visual demonstration, a safe first try and repeatable help |

The opening quest counts as the first story beat of Meet. Its introductions and repaired bridge carry forward.

## 3. The world and its residents

The main walking route forms a loop:

**Brook → meadow garden → moss grove → story hollow → reed pond → brook.**

Two routes connect the central tree clearing with the loop. Old shortcuts and shared spaces create restoration opportunities between neighbouring places. The exact walking geometry will be validated in the first scene prototype; the concept map establishes relationships rather than construction dimensions.

The opening uses a compact segment around the tree, brook and garden. After the first payoff, the onward trail reveals the wider loop. The initial layout must provide readable natural boundaries and a clear onward exit. Opening access to exploration is distinct from restoring all the forest’s forgotten shortcuts.

| Place | Resident and personality | Distinctive landmark | Why they need the others |
| --- | --- | --- | --- |
| Brook | Eurasian beaver: practical, patient, pleased when something becomes useful | Alder-lined water and a small timber crossing | Wants the old direct route to the garden and shared clearing restored |
| Meadow garden | European brown hare: welcoming, energetic, eager to share a place | Sunny forest-edge garden with wild strawberries and a low hazel boundary | Wants neighbours to visit and help revive the gathering corner |
| Moss grove | Western European hedgehog: observant, unhurried, knows the small paths | Mossy stones, fallen beech leaves and a sheltered resting spot | Remembers a route to Owl’s hollow and needs a comfortable place along it |
| Story hollow | Tawny owl: thoughtful, enjoys remembering and telling stories | A hollow tree, low story bench and picture book | Wants the others’ observations and stories to return to the shared clearing |
| Reed pond | Common kingfisher: lively, attentive, notices movement and detail | Blue water, reeds and a low viewing perch | Knows a waterside route and can help connect the pond with the others |

Use the species names as working character names. Proper names can be added only if they improve the story; they are unnecessary for the current design.

### Swiss-native art palette

| Subject | Species | Art direction |
| --- | --- | --- |
| Playable fox | Red fox — Vulpes vulpes | Existing orange-and-cream character and green neckerchief |
| Beaver | Eurasian beaver — Castor fiber | Broad flat tail; brown woodland character |
| Hare | European brown hare / Feldhase — Lepus europaeus | Brown-grey fur, long black-tipped ears, longer hind legs; sunny meadow edge |
| Hedgehog | Western European hedgehog — Erinaceus europaeus | Small pointed face and brown spines |
| Owl | Tawny owl / Waldkauz — Strix aluco | Rounded facial disc and mottled brown plumage |
| Kingfisher | Common kingfisher — Alcedo atthis | Blue and orange plumage, long bill, waterside perch |
| Heart Tree | Pedunculate oak / Stieleiche — Quercus robur | An old, recognisable oak; magical heart glow and gradual awakening |
| Surrounding trees | European beech — Fagus sylvatica | Smooth grey bark and characteristic leaves |
| Woodland boundary | Hazel — Corylus avellana | Low rounded shrubs and hazelnuts |
| Brook edge | Black alder — Alnus glutinosa | Waterside trees and recognisable leaves |
| Garden edge | Wild strawberry — Fragaria vesca | Trifoliate toothed leaves, small white flowers and small red fruits |
| Pond margin | Common reed — Phragmites australis | Natural reed beds and open viewing gaps |

Further fern, moss, grass, flower, insect and background-animal species need checking before final assets are commissioned. Choose seasonally and ecologically compatible details rather than adding arbitrary decorative species. The storybook style permits magical light and human-like gestures while species remain recognisable.

Earlier concept boards containing a white rabbit or generic vegetable garden are superseded by the brown hare and native meadow garden.

## 4. Gameplay

### The main loop

**Walk → notice a neighbour or interesting place → hear a small request → choose to help → play an existing flat puzzle → return to the same location → see a lasting change → continue exploring or pause.**

Walking has a purpose. The player learns landmarks, notices possible connections, finds little story details and discovers that previous help has made a route more direct or a shared place more welcoming.

One short helping episode contains one clear local problem and a visible result. A larger world project can group several short episodes into a story milestone. The opening bridge quest stays short; later projects can contain more activity choices and optional episodes. Final puzzle selection and task counts remain part of the user’s later puzzle review.

### Movement and camera defaults

- Tablet: tap the ground to walk; tap a neighbour to approach and interact.
- Desktop: click to walk, with keyboard movement available.
- Movement follows walkable paths and avoids getting caught on scenery.
- Fixed-angle orthographic camera, approximately 55–60 degrees down, with gentle following.
- Trees or foreground scenery fade when they obscure the fox or an important interaction.
- Keep turns and transitions calm. A clear fox silhouette and scarf remain visible.
- Bridges and slopes are walked normally; precision jumping is unnecessary.

### Guidance and interface

Show one current small goal through a picture and a short spoken action. Beginner guidance is narrated by default when audio is enabled, with a visual demonstration and a safe first try for unfamiliar rules. Text is additional support. Dialogue uses short Swiss Standard German sentences, with no ß.

Introduce icon meanings through use. A speaker, map or arrow is not assumed self-explanatory. Reading ability and puzzle difficulty remain independent, and the full story has a route usable before reading.

A small animal-marked map provides orientation. An optional leaf trail points towards the active goal. Local footsteps demonstrate the first movement.

The child sees both a local purpose and a wider story purpose:

- Local: “Hilf dem Biber bei der Brücke.”
- Wider: “Bring die Nachbarn wieder zusammen.”

The Heart Tree invites a return at chapter milestones. Those returns become brief story moments. A player can finish their current outing before returning.

### Creative and exploratory encounters

Optional encounters add reasons to linger: inspect an old trail marker, notice water movement, hear a neighbour remember the clearing, or look at the new view from a restored path.

Existing creative tools can contribute to the forest: a child’s drawing might become a small leaf sign, a page in Owl’s picture book or an image beside the gathering place. These are optional creative contributions, with a simple child-controlled “Fertig” step. The main story can be completed through the chosen helping quests.

The forest remains the main entry to the adventure. A small practice book at the tree can retain direct access to the existing activities and freely selectable stages.

Each clearing can contain several recurring activity places: the resident’s meeting point, a small work or book surface, and an observation or creative spot. Each place can host growing collections of quests. Keep only a few local invitations visible at once; let the practice book provide access to the full catalogue. Subject placement remains flexible across residents.

An illustrative arrangement of five clearings, three activity places per clearing and eight episodes per place gives 120 short quest episodes. This is a capacity example, not an authored content inventory or a count of distinct puzzle mechanics. Further activity families can join the same geography.

## 5. The opening: A Bridge to the Neighbours

A first-session design target is a few minutes of gentle discovery and one completed existing puzzle round. It is a pacing target, not a timer.

| Beat | Player experience | World and story response |
| --- | --- | --- |
| Arrive | Fox reaches the quiet Heart Tree and sees two nearby trails | A short line introduces the old meeting clearing |
| Walk | Follow the brook or look towards the meadow garden | A gesture demonstration, footprints and a short spoken line teach the first movement |
| Meet | Approach Beaver at the unfinished shortcut crossing | Beaver explains why the crossing matters to Hare |
| Help | Open one appropriate flat activity with beginner guidance | The flat interface shows a practice example, gives one spoken action and lets the child try a fresh item |
| Return | Resume beside Beaver at the same camera position | Beaver finishes the crossing in a brief scripted animation |
| Use the result | Walk across the new bridge and greet Hare | A first warm root light appears; the wider forest invites exploration |

The first two clearings allow a little wandering. Hare can direct the fox towards the same shared crossing quest if the player visits the garden first. There is one opening quest rather than duplicated tutorials.

The [opening layout](OPENING-LAYOUT.md) specifies the two existing approaches from the tree. The garden approach uses a broad finished stone-and-earth crossing. Repairing the upstream timber bridge creates the direct shortcut between neighbours. The [interaction states](OPENING-INTERACTIONS.md) specify Hare-first, repeated help, leaving, continuation and pictured return.

Suggested child-facing lines:

- Opening: “Am Herzbaum trafen sich früher alle Tiere.”
- Beaver: “Die alte Brücke führte direkt zum Garten. Hilfst du mir?”
- If the child postpones: “Ich bin hier, wenn du magst.”
- After completion: “Jetzt können wir uns wieder besuchen!”
- Hare: “Schön, dass du da bist!”
- Wider invitation: “Im Wald warten noch mehr Nachbarn.”

The bridge is a small, durable change. Opening the wider forest reveals further relationships and restoration work. Most of the adventure remains ahead.

The precise learning activity is deliberately deferred. The storyboard’s leaf, nut and strawberry cards indicate the existing flat visual language, not a new puzzle specification or an approved answer set.

The first activity must pass a pre-reader comprehension review. Current puzzle screens include written prompts and hints, and the app’s current sound system contains effects but no speech. Narration, demonstration and any necessary picture support are future work, not existing capability.

Pattern completion is the current reference for that review because it permits one visible missing position and a simple picture selection. It is not the final assignment of the first activity. Quantity and memory references are introduced separately in the walkthrough pack, keeping the first forest reward after one short activity.

## 6. The story spine: ten milestones with room for many quests

There are nine helping projects and a final gathering. These are the story’s ten milestones. A later project can contain several short quest episodes, while optional local stories, creative encounters and direct practice provide additional uses of the puzzle library.

| Chapter | Story milestone | Neighbours | Short story and lasting result |
| --- | --- | --- | --- |
| Meet | 1. A Bridge to the Neighbours | Beaver + Hare | The opening crossing becomes usable and the two neighbours greet each other |
| Meet | 2. A Place to Rest | Hedgehog | Restore the small resting place beside the mossy trail |
| Meet | 3. The Old Trail Sign | Owl | Renew a picture-led trail sign and learn where the old meeting paths led |
| Meet | 4. A View of the Water | Kingfisher | Reopen a viewing spot at the pond and hear about the route to Owl’s hollow |
| Reconnect | 5. The Garden Path | Hare + Hedgehog | Restore a useful connection between the sunny garden and moss grove |
| Reconnect | 6. Stories by the Water | Owl + Kingfisher | Renew a shared path and quiet story spot near the water |
| Reconnect | 7. The Old Meeting Place | Beaver + the community | Make the tree’s gathering corner and its approach welcoming again |
| Gather | 8. A Place for Everyone | Beaver + Hedgehog | Place a shared bench and comfortable resting spots at the tree |
| Gather | 9. The Invitation | Hare + Kingfisher | Prepare a picture-led invitation and guide the neighbours towards the gathering |
| Gather | 10. The Story Continues | Owl + everyone | Walk back to the tree, recognise the earlier changes and see the canopy awaken |

These are narrative project briefs. Each project receives a small, explicit set of story contributions and can host additional optional episodes. Exact activity selection, required episode counts, question counts, exercise illustrations and pedagogical content remain for the separate puzzle review.

### Chapter milestones

**Meet:** The opening introduces Beaver and Hare. The remaining three introductory milestones can be completed in any order. Each has a clear main route and room for additional episodes. Local improvements spread light through the roots. When the authored main introductions are complete, the tree invites the fox home for a short transition.

**Reconnect:** The three shared restoration projects can be completed in any order. A project can unfold through several short contributions from neighbouring residents, with optional activities around them. New paths make journeys more useful, and residents begin interacting across their home places. Branches regain leaves. A new invitation at the tree opens Gather.

**Gather:** Complete the two contribution projects in either order, then return for the ending. Each can contain short helping episodes. The finale is a story reward: earlier repairs remain visible, the residents recognise their shared work, and the tree becomes fully awake.

Optional activities do not need to be exhausted to advance a chapter. Chapters follow story milestones rather than exercise difficulty, star totals, real-world dates or repeated farming.

Chapter conditions refer to explicit authored main-story contributions. Adding more optional episodes or new puzzle families must not change the requirements of a completed milestone.

### Ending and continued play

The fox arrives at the central clearing. Beaver’s bench, the welcoming place and the renewed routes are present. Owl recalls the first crossing and the neighbours’ contributions through a few short lines and pictures.

The tree’s lights travel from the roots into the branches and canopy. All five neighbours are together. The world stays restored afterwards. The player can return to favourite places, practice existing activities, draw, revisit the gathering or play growing collections of optional episodes. New content uses the restored world and preserves the ending already earned.

The ending delivers the promise that helpful acts reconnect a community. It is not a requirement to complete the whole curriculum.

## 7. Flat puzzles, rewards and continuity

The forest and the flat activities have different presentation roles but form one outing. Launching a puzzle preserves the fox’s world location, camera and active quest context. Finishing the round returns the player to that location and applies the story result once.

Story quests, optional episodes, practice and creative encounters have different results. Story projects change authored world states; optional stories can add a small detail or memory; practice records existing learning progress; chosen creative work can appear in the scene. The world does not need another 3D object for every completed round.

A puzzle activity, its content variants, a short quest episode and a world project have separate identities. Several quests can use the same flat activity in suitable contexts. Practice launches and story launches carry explicit context so completion affects the correct records.

Existing stage choice remains independent of chapter progression. A child can complete a story quest using an appropriate learning level.

Remember a suitable challenge stage per activity family. The existing global stage can serve as an initial default while preserving existing activity-stage progress identifiers. Needing speech or demonstration does not force an easier mathematics level or a harder reading level.

Understanding the task is separate from solving it. Instructions and controls must work before reading. In reading activities, explain the action without automatically speaking the target words being tested. Auditory learning activities need suitable sound support or an appropriate alternative story activity.

Story progress needs its own quest and world-state records. Existing stars and stickers retain their current rules, including replay-safe rewards. A previously earned star must not prevent a new story quest from recognising its own successful round.

The design should support pausing and resuming from safe checkpoints, preserve completed repairs and retain unfinished optional arcs across chapters. Exact interrupted-round restoration must be checked against each existing activity during implementation; the concept does not assume that every current activity already serialises its in-progress state.

Existing saved pictures, localStorage identifiers, IndexedDB names, handwriting geometry and learning-relevant colours need preserving. Native-species refinements in the new world do not silently redesign existing exercises; that content is reviewed separately.

## 8. Future Three.js build plan

This section plans future work only.

### First playable scene

Build the smallest complete demonstration of the experience: the quiet tree, brook, meadow garden, walking fox, Beaver and Hare, one existing flat activity, bridge payoff, first root light and a simple indication of the wider loop.

This scene must demonstrate that the 3D art can retain the watercolour identity and work comfortably on the intended tablet before the rest of the forest is produced.

### World and character production

Use actual 3D terrain, bridges, props and characters with painterly textures. Keep geometry and lighting simple enough for mobile rendering. Native species silhouettes and leaf shapes matter more than decorative density.

Create consistent idle, turn and walk movement for the fox; simple gestures and local movement for neighbours. Make the tree’s quiet, root-lit, leafing and awake states visually related.

Keep navigation and interaction targets separate from foliage decoration so tree density does not make walking difficult.

### Integration

- Three.js owns world rendering, movement, navigation, camera and world-state visuals.
- Existing HTML/CSS puzzle screens retain their flat layout and interaction.
- A quest coordinator connects story interactions, puzzle completion and persistent world results.
- A content catalogue describes activities, variants, collections and quest placements independently of the 3D map.
- Stable quest and milestone records let new optional content join existing places without resetting completed story progress.
- Save world progress separately while preserving current learning progress and saved artwork.
- Keep dependencies, models, textures and required audio local and available to the offline PWA.
- Update the service-worker cache deliberately when implementation begins.
- Provide standard beginner instruction speech, visual demonstrations and repeatable help; keep required guidance available offline.
- Respect mute preferences and distinguish spoken instructions from reading targets or auditory learning content.

### Expansion order

1. Review a picture-and-voice walkthrough of the opening and representative quantity, pattern and memory interactions.
2. When implementation begins, validate the opening scene, beginner guidance and flat-puzzle transition.
3. Add another activity and several episodes at an existing place, plus the practice book, to validate content growth.
4. Add the full walkable loop and Meet projects.
5. Add shared restorations and the tree’s intermediate states.
6. Add contributions, the gathering and continued play.
7. Integrate reviewed activities and optional collections incrementally, then complete audio production and final polish.
8. Observe actual child use and check touch interaction, the intended iPad/Safari devices, offline guidance and existing progress compatibility.

## 9. What to verify when implementation begins

- A child can discover how to move, find Beaver and understand the current small goal.
- Before/after scenery makes the benefit of completing the flat activity obvious.
- Fox returns beside the same neighbour after the puzzle.
- The bridge becomes walkable and remains repaired after reload.
- Replaying a completed activity preserves current star rules and does not duplicate a story payoff.
- The opening counts towards the first chapter; it is not repeated after the wider world opens.
- Each chapter has at least a few meaningful choices in quest order.
- Chapter transitions acknowledge the work already completed.
- Pictures, standard beginner speech and demonstrations make the goal and action understandable without reading.
- A demonstration teaches the rule on a separate example; the live attempt does not reveal its answer.
- Reading instructions are spoken appropriately without unintentionally answering a reading task.
- Auditory activities have suitable sound support; visual activities have usable visual guidance when muted.
- Actual 6–7-year-old walkthroughs distinguish task comprehension from difficulty solving the learning challenge.
- Leaves and trees do not obscure the fox, paths or interaction targets.
- The rendering remains comfortable on the target devices.
- Existing pictures, learning stages, offline access and saved progress remain usable.
- New activity and quest records can join existing places without extra 3D buildings or excessive quest markers.
- Adding optional collections preserves completed chapter milestones and the awake tree.
- A child can find a suitable activity in the growing catalogue through pictures, places and simple filters.

The application’s current tests should be retained and extended only for meaningful new behaviour. Physical iPad/Safari checks remain part of release validation.

## 10. What remains deliberately open

- Individual puzzle quality, subject mapping and any necessary exercise-art refinements: the user requested a later deep dive.
- Final authored episode and activity counts: the capacity example is structural design, not completed content.
- Exact 3D model and texture production technique: settle through the first scene’s visual and performance review.
- Detailed final text, voice recordings and small incidental animations: iterate within this direction.

These do not require another round of choices before continuing the design. Bring a decision back to the user only when it would substantially change the experience.

## 11. Visual deliverables

- [Opening layout and camera board](opening-layout.png)
- [Help and return storyboard](opening-support.png)
- [Current opening review packet](../archive/reviews/OPENING-REVIEW.pdf)
- [Chosen art direction — original A, Painted woodland](ART-DIRECTION.md)
- [Opening walkthrough in the chosen style](painted-woodland-opening.png)
- [Next steps from design to app](../archive/implementation-notes/NEXT-STEPS.md)
- [Opening storyboard](../archive/storyboards/opening-storyboard.png)
- [Updated adventure blueprint](../archive/storyboards/adventure-blueprint-v2.png)
- [Puzzle-library capacity board](../archive/storyboards/puzzle-library.png)
- [Puzzle-library design](PUZZLE-LIBRARY.md)
- [Understand before reading](BEFORE-READING.md)
- [Non-reader interaction storyboard](../archive/storyboards/before-reading-storyboard.png)
- [First-session script and observation sheet](FIRST-SESSION.md)
- [Picture-only walkthrough cards](walkthrough-cards.pdf)
- [Child interface flow](../archive/storyboards/child-interface.png)
- [Child interface specification](CHILD-INTERFACE.md)
- [Activity guidance readiness](ACTIVITY-READINESS.md)
- [Future implementation plan](../archive/implementation-notes/IMPLEMENTATION-PLAN.md)

These are illustrations of the intended experience, not screenshots of a built app.

## 12. Ecology references

Species and habitat choices draw on the sources already checked during planning:

- [Feldhase — Stadtwildtiere Zürich](https://zuerich.stadtwildtiere.ch/artportraet/feldhase)
- [Native woody plants — Canton Zürich](https://www.zh.ch/de/planen-bauen/bauvorschriften/bauen-an-besonderer-lage/bauen-ausserhalb-von-bauzonen/inhalt/spezialthemen/verwendung-einheimischer-pflanzen.html)
- [Waldkauz — Swiss Ornithological Institute](https://www.vogelwarte.ch/de/voegel-der-schweiz/waldkauz/)
- [Eisvogel — BirdLife Zürich](https://birdlife-zuerich.ch/voegel/Eisvogel/)
- [Biber — Federal Office for the Environment](https://www.bafu.admin.ch/de/biber)
- [Rotfuchs — Swiss National Park](https://nationalpark.ch/flora-und-fauna/rotfuchs/)
- [Artenschutz, including Braunbrustigel — Canton Zürich](https://www.zh.ch/de/umwelt-tiere/naturschutz/artenschutz.html)
- [Fragaria vesca — InfoFlora](https://www.infoflora.ch/de/flora/fragaria-vesca.html)
- [Alnus glutinosa — InfoFlora](https://www.infoflora.ch/de/flora/alnus-glutinosa.html)
- [Phragmites australis — InfoFlora](https://www.infoflora.ch/de/flora/2985-phragmites-australis.html)
