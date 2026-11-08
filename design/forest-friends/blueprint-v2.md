> Implementation update, 8 November 2026: restore the original illustrated activity catalogue inside v2, assign every activity to the five current friends, use one fixed Entdecken level, and restore the original puzzle-selection menu, settings gear and full Malatelier at the fox’s table. New rounds use the original woodland stationery and painted objects. See [the implemented catalogue and host mapping](../../docs/FOREST-FRIENDS.md#restored-illustrated-games-and-malatelier). This updates the earlier five-puzzle-only launch scope; the preserved visual baselines stay unchanged.

> Current revision 10: purchases never alter the environment. No teacher testing is planned or required. Child testing happens after implementation, once the game is running. This replaces earlier pre-implementation external-review gates; internal curriculum source checks remain.

> Shared visual rule: [den-led art direction](visuals/art-direction.md). Outdoors, den and shop use 3D; learning puzzles use 2D.

> Latest interaction decisions: [Design revision 10](visuals/revisions/v10.md) sets the shared categories, reading-led rhymes, easier owl sentences and clear shape matching. The single difficulty level and curriculum requirements remain.

# Blueprint v2 — Forest friends

**Status:** Updated Blueprint V2. User endorsed the revised examples and simpler categories; Waldkauz simplified further. No teacher testing planned; child testing follows implementation.
**Updated:** 7 November 2026.
**Scope:** Plan the redesign before implementation. Shared categories and the revised example direction reflect user feedback. Content pools, prices and production interaction details still need review.

Design pack: [Curriculum matrix](curriculum-matrix.md) · [Five puzzle specifications](puzzle-specifications.md) · [First-session and interaction design](experience-design.md) · [Rewards, continuity and logging](rewards-and-continuity.md) · [Visual design review](visuals/README.md) · [Interactive mockups](visuals/review.html).

## 1. Game outline

Start with a clean design, using the current game and its learning activities as the basis. The player is a small orange fox with a green neckerchief, living beneath a large tree in a welcoming 3D forest. Explore freely, visit friends, help with puzzles, collect rewards, unlock drawing activities and enjoy short animated treats.

The game is for children aged 7–8 in Zürich, Switzerland. Use Swiss Standard German. Pictures, demonstrations and repeatable spoken instructions make ordinary play understandable before fluent reading. Reading puzzles explicitly practise written language.

### Required intuitive interface

Assume the child cannot yet read navigation or instructions. The complete home → friend → puzzle → reward → shop → home loop must work through recognisable objects, character pictures, a separate visual demonstration and replayable speech. Do not rely on written menus, dialogue paragraphs, item descriptions or error messages. Merely replacing labels with unexplained symbols is insufficient: teach unfamiliar controls by showing the action.

At home, the doorway, drawing table and bed are directly actionable. Use picture destinations on the map, physical resource tokens for prices, a visible selection state and a demonstrated check-to-confirm action. Retry and completion feedback must be visible and audible. Written words remain where reading is the learning objective; numerals remain where relevant to counting and quantities. Retain German accessibility names, keyboard access and optional captions without making them a reading requirement.

The user endorsed the characters and den artwork. Preserve this direction and use the [versioned visual baseline](visuals/baseline.md) to compare real development at each milestone. Keep the original artwork, frozen mockups and screenshots intact; new design changes get new versions. The preserved Version-2 art remains the baseline; revision 9 is the current interaction and learning-category target, pending child review.

### Mandatory curriculum requirement

The game's primary goal is to help children practise the school learning of **first grade in the canton of Zürich**. Alignment with the official **Zürcher Lehrplan 21** is a requirement for every learning puzzle, including future additions. Story, characters and rewards serve that goal.

Use **Zyklus 1** as the curriculum framework, then select tasks suitable for first grade and the classroom's current learning. Zyklus 1 spans kindergarten and first/second primary classes; its competency steps are not an official first-grade annual or trimester schedule. The app's single difficulty level is a first-grade content selection, not a claim that every child or class follows the same sequence. Prioritise German literacy and mathematics, with related nature learning and creative practice.

Before a puzzle is accepted for implementation, document its official competency code and relevant Zyklus-1 step, concrete learning objective, first-grade task range or vocabulary, required prior learning and observable action. Check the actual question pool, instructions and feedback against that objective. Check curriculum references and first-grade task boundaries internally during implementation. No teacher consultation/testing is planned or required. The user tests with a child after implementation once the game is running; mappings are design mappings, not official approval or complete curriculum coverage.

### Simple learning categories

Use a small set of familiar categories: **Mathematics (Mathematik), Reading (Lesen), Writing (Schreiben), Nature (Natur), and Creativity (Gestalten)**. Reading is a core priority. The first playable set focuses on Mathematics and Reading; the other categories describe the existing catalogue and later work, not extra launch requirements.

Categories organise puzzles, not animal identities. Several animals can offer Reading or Mathematics. Within a category, different animals may introduce different puzzle types; a shared category does not force identical activities at every visit. Once released, a puzzle can be reused by any assigned friend with an adapted story and host reward. Never invent a category just to give an animal something unique.

| Category | Learning content inside the category | Initial hosts |
| --- | --- | --- |
| Mathematics / Mathematik | Counting and arithmetic; patterns; shapes, space and simple data representations | Eichhörnchen, Biber; later Hase, Fisch, Eisvogel |
| Reading / Lesen | Letters and syllables; written words; written rhyme pairs; short sentence-to-picture matching | Maus, Blaumeise, Waldkauz |
| Writing / Schreiben | Introduced letter forms and simple spelling tasks | Later activities with Maus or another existing friend |
| Nature / Natur | Familiar animals, habitats, tracks and material properties | Later Igel and Reh |
| Creativity / Gestalten | Drawing, colouring and picture composition | Fuchs at home |

Memory, attention, phonological awareness, sequencing and spatial reasoning are supporting skills or internal curriculum tags. They are not separate main categories. Pure memory/search play remains optional enrichment and does not count as subject coverage. Each learning puzzle still needs its own specific Lehrplan mapping; a simple category name never substitutes for that review.

### Updated initial examples

| Category | Animal | Puzzle | Child's action |
| --- | --- | --- | --- |
| Mathematics | Eichhörnchen | Zählgarten | Count pictured nuts and choose a numeral |
| Mathematics | Biber | Welche Form fehlt? | Choose the shape that fills a visible gap in a house or cart; one tap inserts it |
| Reading | Maus | Leseschatz | Read a familiar word and choose its picture |
| Reading | Blaumeise | Reimzirkus | Read a written target and two written, pictured answers; choose the rhyme, e.g. Haus → Maus |
| Reading | Waldkauz | Lies und zeig | Read a three-word sentence and choose between two clear pictures, e.g. «Die Maus sitzt.» |

The old game's Reimzirkus word-and-picture cards are the basis for Blaumeise. Optional word audio is support; this is a reading-led activity with rhyming practice, not an audio-only game. Log answer-revealing playback as support rather than independent reading.

Waldkauz starts with familiar nouns and concrete actions: «Die Maus sitzt.», «Der Vogel fliegt.», «Die Maus rennt.», «Der Vogel sitzt.», «Der Fisch schwimmt.» Use two large pictures, short sentences, optional syllable support, unlimited time and a separate spoken example. Avoid opening with spatial prepositions, similar multi-detail scenes, three-event ordering or a third distractor. The instruction speaker explains what to do without reading the scored sentence. This is one consistent content level, not a difficulty ladder. Longer sentences remain later content work, outside the initial pool.

Biber's former 3×3 placement grid and Waldkauz's narrated ordering activity are withdrawn from the initial set. Biber now offers a basic shape-recognition warm-up; do not label it full geometry or shape-composition mastery. Matching a gap does not establish that the child can name a shape. Composition and narrated sequencing can return later as separately specified tasks if useful, rather than as compulsory animal categories.

The curriculum matrix distinguishes game categories from exact subject references. Reading uses D.2.A.1.b for initial decoding and short sentences; rhyming also has a listening/phonological support reference. Biber's recognition exercise supports basic shape vocabulary under MA.2.A.1.a, with naming practised in feedback; full naming/composition assessment is outside this fixture. Internal curriculum source checks remain required. No teacher test is planned; child testing follows implementation.

Official sources, checked on 7 November 2026:

- [Zürcher Lehrplan 21 — Mathematik](https://zh.lehrplan.ch/lehrplan_printout.php?e=1&fb_id=5&k=1).
- [Deutsch — Hören, D.1.A.1](https://zh.lehrplan.ch/index.php?code=a%7C1%7C11%7C1%7C1%7C1).
- [Deutsch — Lesen, D.2.A.1](https://zh.lehrplan.ch/index.php?code=a%7C1%7C11%7C2%7C1%7C1).
- [NMG — Tiere und Lebensräume, NMG.2.1](https://zh.lehrplan.ch/index.php?code=a%7C6%7C1%7C2%7C0%7C1).
- [Earlier project research with writing and nature references](../../docs/RESEARCH.md).

## 2. Story and play loop

The fox lives in a den beneath the large tree at the centre of the world. The game starts inside the den: this is the playable home and main menu. Here the fox can draw, colour, use a consumable reward, sleep and go outside. The den layout remains fixed.

Outside is a freely explorable forest full of friends. Each friend has a personality, a shared learning category and a reason to need help. Each visit offers fresh tasks from a puzzle in that category. Friends can introduce different activities inside the same category; the rules of each shared puzzle remain consistent across hosts. Friends give characteristic resources as thanks: Eichhörnchen gives nuts, Biber gives logs, and Fisch gives fish tokens.

1. Start or resume in the fox's fixed den.
2. Go outside and choose a friend to visit.
3. Hear or watch a short introduction and example.
4. Complete a round of tasks.
5. Receive the friend's resource reward.
6. Visit more friends or buy drawing unlocks or consumable rewards at the shop.
7. Return home to use the drawing table or enjoy a short consumable animation from the bag.

Mistakes allow retries and help. There are no lost lives or required countdowns. Leaving a puzzle preserves its question and interaction state; returning resumes it. Completing a round makes the next visit offer fresh tasks. Task pools should avoid immediate repeats.

## 3. World and navigation

The large home tree anchors a central clearing. A smaller tree nearby contains the shop. Other places include a brook, beaver dam and pond, meadow garden, moss grove, story hollow, reed pond, mountain cave, deeper misty woodland and swamp. Bridges connect paths across the brook. The den, shop and cave have enterable interiors.

Click or tap a destination to walk there. A picture map lets the child choose a friend and shows a directional arrow from the fox. Keep navigation readable and forgiving, with clear paths, gentle camera movement and recognisable landmarks. Use [Emberwick](https://simonw.github.io/emberwick/v11/emberwick.html) as the reference for the feel of moving around the world. Preserve this game’s own woodland character and visual identity.

## 4. Characters, appearance and shared categories

Use Swiss Standard German character names throughout the game and this blueprint: Fuchs, Waldkauz, Eichhörnchen, Blaumeise, Maus, Biber, Hase, Igel, Reh, Fisch and Eisvogel. English species descriptions remain explanatory text.

Each character needs an expressive, articulated 3D model, a consistent portrait, readable silhouette, idle and interaction animations, and a clear personality. Use warm stylised woodland animals and carry their colours and features into puzzle illustrations.

The following locations, rewards and assignments are proposals where the earlier outline left them open. Resource amounts and prices remain to be balanced.

| Character | Species | Place | 3D appearance | Personality and relationship | Shared category | Reward |
| --- | --- | --- | --- | --- | --- | --- |
| Fuchs | Red fox (*Vulpes vulpes*) | Central tree den | Small orange fox, cream muzzle, bushy tail, green neckerchief | Curious and friendly; visits neighbours and makes a home | Creativity | Collects and spends resources |
| Waldkauz | Tawny owl (*Strix aluco*) | Story hollow | Rounded brown owl, large expressive eyes, soft feathers and tilting head | Warm, thoughtful storyteller; reads short messages with the child and welcomes patient help | Reading | Feathers |
| Eichhörnchen | Eurasian red squirrel (*Sciurus vulgaris*) | Nut tree | Rust-red fur, tufted ears, large curling tail | Plans ahead and wants enough nuts stored for winter | Mathematics | Nuts |
| Blaumeise | Eurasian blue tit (*Cyanistes caeruleus*) | Singing tree | Small blue-and-yellow bird with lively head and wing movements | Musical and sociable; needs rhymes for new songs | Reading | Seeds |
| Maus | Wood mouse (*Apodemus sylvaticus*) | Reading nook | Small brown mouse, cream belly, large ears | Eager but unsure; wants to learn letters, syllables and reading with the fox | Reading | Berries |
| Biber | Eurasian beaver (*Castor fiber*) | Brook | Sturdy brown body, broad flat tail, visible front teeth | Practical and affectionate; misses Hase across the broken bridge | Mathematics | Logs |
| Hase | European hare (*Lepus europaeus*) | Meadow garden | Long ears, long hind legs, warm brown coat | Energetic and welcoming; wants to visit neighbours and invite everyone together | Mathematics | Carrots |
| Igel | European hedgehog (*Erinaceus europaeus*) | Moss grove | Rounded spiny back, soft face, small careful steps | Gentle and observant; needs a comfortable resting place and company | Nature | Mushrooms |
| Reh | European roe deer (*Capreolus capreolus*) | Woodland edge | Slender legs, large ears, warm brown coat | Attentive and calm; notices changes and helps care for the forest | Nature | Leaves |
| Fisch | Brown trout (*Salmo trutta*) | Pond | Spotted body, moving fins, clear underwater silhouette | Playful collector; enjoys arranging pond treasures | Mathematics | Fish tokens |
| Eisvogel | Common kingfisher (*Alcedo atthis*) | Reed pond | Bright blue back, orange breast, long beak | Curious and attentive; wants to share the water's view and connect its paths | Mathematics | Pebbles |

Fish tokens represent a game resource; the story should make clear how Fisch gives them to the fox.

## 5. Shared categories and puzzle catalogue

Use the simple categories in section 1 throughout navigation, adult summaries and logs. Several animals share a category; each puzzle retains a precise objective and its own curriculum tags. A friend may introduce a particular puzzle without owning a new category or exposing the entire category catalogue immediately. Add a puzzle once, then reuse it across eligible hosts with the same answer rules and adapted story objects and rewards.

The catalogue below has one puzzle type per row, grouped by category. Existing activities come from the current checkout's documented learning activities; proposed additions expand the task pool. Creative activities are included alongside puzzles so the home activities have a place in the same catalogue.

| Category | Puzzle or activity | What the child practises | Basis |
| --- | --- | --- | --- |
| Mathematics | Zählgarten | Count objects and match quantities to numbers | Existing |
| Mathematics | Znüni-Rechnen | Addition and subtraction | Existing |
| Mathematics | Sternenrakete | Find number bonds and missing quantities | Existing |
| Mathematics | Zauberzwillinge | Double quantities | Existing |
| Mathematics | Nachbarhäuser | Find predecessor and successor numbers | Existing |
| Mathematics | Beerenvergleich | Compare quantities | Existing |
| Mathematics | Rechenfreunde | Recognise related addition facts | Existing |
| Mathematics | Waldpicknick | Share objects into equal groups | Existing |
| Mathematics | Zahlenwege | Connect numbers in order to reveal a picture | Existing |
| Reading | Reimzirkus | Read written words and match rhymes, with pictures and optional audio | Existing, adapted |
| Reading | Lies und zeig | Read a three-word sentence and select one of two pictures | Initial Waldkauz activity |
| Reading | Silbentrommel | Hear and count spoken syllables | Existing |
| Reading | Initial-sound matching | Match pictures with the same initial sound | Proposed |
| Reading | Leseschatz | Read syllables and words | Existing |
| Reading | Lies genau | Read colour words, phrases and sentences carefully | Existing |
| Reading | Silben-Ballone | Recognise written syllable families | Existing |
| Writing | Vokalversteck | Supply missing written vowels | Existing |
| Writing | Schreibspuren | Trace letter forms | Existing |
| Reading | Letter–sound matching | Connect written letters with spoken sounds | Proposed |
| Reading | Build a word | Combine written syllables into a word | Proposed |
| Optional enrichment | Waldschatz | Remember objects and identify what is missing | Existing |
| Reading | Was kommt dann? | Put events or actions in a logical order | Existing |
| Optional enrichment | Lost belongings | Remember where an object belongs | Proposed |
| Reading | Mixed-up stories | Understand and order a narrated story | Later proposal; withdrawn from initial set |
| Mathematics | Musterzug | Recognise and extend repeating patterns | Existing |
| Mathematics | Welche Form fehlt? | Recognise a missing shape in a familiar object | Initial Biber warm-up |
| Mathematics | Formenwerkstatt | Combine geometric shapes | Existing; later composition variant |
| Mathematics | Spiegelmosaik | Complete a reflected grid | Existing |
| Mathematics | Roboterpost | Follow and construct routes | Existing |
| Mathematics | Bridge builder | Fit pieces to a pictured construction plan | Proposed |
| Mathematics | Waldumfrage | Read and compare quantities in picture charts | Existing |
| Nature | Naturdetektive | Identify animals, habitats, traits and needs | Existing |
| Nature | Nest-material sorting | Group materials by properties and suitability | Proposed |
| Nature | Track matching | Match animal tracks to their owners | Proposed |
| Optional enrichment | Spot the difference | Find changes between two forest scenes | Proposed |
| Creativity | Free drawing | Express ideas through drawing | Existing |
| Creativity | Colouring | Colour illustrated scenes | Existing |
| Creativity | Guided colouring | Follow visual colour rules | Existing |
| Creativity | Picture stamps | Compose pictures using stamps | Existing |

Creative missions are a source collection outside this table; add each selected mission as its own named row with a learning objective.

The initial hosts cover two shared categories. Writing, Nature and Creativity expand the catalogue without requiring a new animal for every skill. Optional enrichment is kept outside claims of curriculum coverage.

Use one difficulty level for every puzzle. Vary questions and story objects within that level; there is no level selector or higher-difficulty reward multiplier. Add more tasks and variations within each puzzle type. A round begins with a separate worked example and initially contains five tasks; expand the question pool before increasing round length. Keep explanations short and allow replayable demonstrations and hints.

## 6. Shop rewards with a fixed environment

Purchases must not change the game environment. The shop no longer sells furniture, decorations or placed objects. The den, forest, paths and navigation remain fixed; there is no purchasing-related placement or rearrangement mode.

| Item | Purchase result | Use | Ownership |
| --- | --- | --- | --- |
| Ausmalbilder / colouring pages | Unlock an illustrated outline | Select the page at the drawing table and colour repeatedly | Permanent unlock |
| New Farbstifte / coloured pencils | Unlock additional colours | Expanded palette inside the drawing-table activity | Permanent tool unlock |
| Apple | Add one apple to the bag | A short sequence shows Fuchs eating the apple | One-use consumable |
| Bubble bath / Schaumbad | Add one bath portion to the bag | A short sequence shows Fuchs enjoying a bubble bath | One-use consumable |
| Later drinks and similar treats | Add one use to the bag | Short self-contained animation | One-use consumable |

Show pictured prices and an explicit purchase confirmation. Buying never automatically starts an animation. Permanent items show as owned and cannot be bought twice; consumables show quantities and may be bought repeatedly. Free drawing and basic pencils remain available without purchasing.

A consumable's Use action commits exactly one inventory decrement, opens a short skippable 4–6 second sequence, then returns to the same location and camera. An apple moves to the fox's mouth and is eaten; a bath uses foam/bubbles and a temporary bath set inside the sequence only. No bathtub or other prop remains in the world. Skip, close, refresh or a cosmetic replay cannot duplicate consumption or grant resources. There are no hunger/hygiene meters or upkeep pressure.

Purchased pages and colours appear only inside the drawing-table activity. Preserve drawings separately per page and keep them when changing pages or tools. The fixed environment keeps movement, scene composition and navigation predictable.

## 7. Saving and continuity

Save the wallet, unlocked colouring-page IDs, unlocked pencil palettes, consumable quantities, per-page drawings, completed tasks, active puzzle state, settings, and unique reward/purchase/use transaction IDs. Save resource deductions and ownership/inventory additions together; refresh or relaunch must not duplicate charges or payouts.

On animation interruption restore committed inventory and the return location; the game can return directly to play. Animation completion is never a requirement for keeping a learning reward. Persist creative unlocks and drawings through ordinary updates.

Preserve existing drawings/progress during migration. Legacy furniture fields should be retained safely for rollback or migration without enabling the old shopping/placement flow. Never silently erase old saves. A later backup/export feature can support moving devices.

## 8. Visuals, sound and interaction

Use warm ivory, woodland greens, honey-coloured timber, blue water and the orange fox. Give the forest depth through sloping terrain, solid tree crowns, moving foliage, water, flowers and wildlife. Keep puzzle objects readable and consistent with the 3D cast.

Add subtle background music and forest ambience: birdsong, wind through leaves, running water and occasional animal sounds. Keep loops gentle and reduce background sound during spoken instructions. Provide separate controls for music, ambience and speech, and remember them across sessions.

## 9. Development version

Provide a clearly identified development version with direct access to characters and all puzzle types at the single difficulty level. Developers can skip a puzzle or task to inspect later content and test the complete flow.

A skip must be distinguishable from a solved puzzle in the log. Keep development progress and rewards separate from ordinary player progress so testing does not change a child's home or wallet.

## 10. Gameplay log and export

The running version records a general gameplay log to help improve movement, instructions and puzzles. Export it as a file that an adult can review and manually upload to an AI for analysis.

Record:

- Session identifier, game version, timestamps and save-data version.
- Movement destinations, sampled positions, routes, area transitions and stuck or interrupted movement.
- Character visits, puzzle type, task identifier or generation seed, and shared category.
- Submitted answers, wrong entries, retries, hints and puzzle skips.
- Time spent per task and round, distinguishing active play from pauses or a hidden browser tab.
- Puzzle completion, abandonment and resumption.
- Resource rewards, purchases, creative unlocks, consumable use/skip and save/load failures.

Keep logs local by default, bounded in size and available through adult settings with export and clear controls. Use an anonymous session identifier; avoid names, recordings and unrelated personal information. There is no automatic AI upload. Exports should contain enough puzzle context to understand mistakes and timing, with development skips marked explicitly.

This introduces local gameplay logging beyond the current checkout's stated no-tracking behaviour; explain it in adult settings when implemented.

## 11. First playable version and checks

Build the den, a small explorable forest, the shop and five friends first: Eichhörnchen, Blaumeise, Waldkauz, Biber and Maus. The design pack brings Maus into the initial set to include explicit reading practice. Include the five initial puzzle types across two shared categories, one difficulty level, fresh repeat visits, resource rewards, a colouring-page unlock, an extra-pencil palette, an apple and a bubble bath. The category groups related puzzles; each initial host introduces the activity listed in section 1, and released puzzles can be reused by other hosts in that category. Add the remaining neighbours as further game families are ready.

The first version is ready to review when:

- The game starts in the den and the fox can leave, navigate to friends and return.
- Each friend has a recognisable 3D model, personality and playable puzzle.
- Every released learning puzzle has a verified Zürcher Lehrplan code and Zyklus-1 step, a concrete first-grade objective, and reviewed task content; supporting or enrichment activities are labelled separately.
- Curriculum source checks are documented. No teacher testing is required. Child testing happens after implementation on the running game.
- Each new completed visit can offer fresh tasks; interrupted puzzles resume correctly.
- There is one difficulty level, with no level selector or difficulty-based reward multiplier.
- Several animals can share Reading or Mathematics while introducing different puzzle types; shared puzzles keep identical learning rules.
- Each puzzle occupies its own catalogue row; new puzzles and categories can be added independently of the cast.
- Page/pencil purchases and apple/bath use work; the environment stays fixed and refresh/relaunch restores ownership, inventory and drawings.
- Music and forest sounds play gently and their controls persist.
- A child can follow the main loop using objects, pictures, demonstration and speech without reading navigation text.
- Matched development screenshots have been compared with the preserved visual baseline; intentional deviations are documented.
- Development skips work and remain separate from player progress.
- The gameplay log exports usable movement, error and timing information.
- Existing saves and drawings remain accessible after an update.

## 12. Open decisions

- Agree on movement and camera details using the linked Emberwick reference.
- Confirm the proposed character appearances, category assignments and rewards.
- Decide who runs the shop and expand the initial colouring-page/pencil/consumable catalogue.
- Balance resource amounts, combined prices and task ranges for the single difficulty level.
- Select suitable tasks from existing three-stage activities for the single level.
- Select later Writing, Nature and Creativity activities without forcing a new category or character for every skill.
- Set local log retention limits and the adult export format.
- Preserve useful interactions from the current game: see [current gameplay](../../docs/GAMEPLAY.md) and [Heart Tree baseline](../heart-tree/BLUEPRINT.md). Inspect existing save keys and assets before implementation; the current checkout now includes the later world and story documentation.

## 13. Implementation handoff and testing order

The user will not test with a teacher. Child testing happens **after implementation, once the game is running**. Earlier teacher/child testing gates before development are superseded. Internal curriculum source/content checks still apply; do not claim teacher endorsement or completed child testing.

**Switch to Codex after revision 10 is saved and pushed to GitHub.** The next phase is implementation of a running game, not further rounds of design-only mockups. Resolve routine implementation details within this blueprint and preserve accepted artwork.

| Order | Work | Result |
| --- | --- | --- |
| 1. Implement one complete loop | Fixed den/forest → friend → puzzle → resources → shop → drawing unlock or consumable animation → return | Playable loop with unchanged world layout |
| 2. Complete initial scope | Add all five initial puzzles across Reading/Mathematics, page/pencil unlocks, apple and bath sequences, audio and developer access | Running first playable game |
| 3. Verify continuity and content | Save/migrate drawings, inventory, unlocks and puzzle state; prevent duplicate transactions; expand and internally check task pools; local logs and responsive controls | Tested running build ready for the user |
| 4. Child test after implementation | User plays the running game with a child | Observe navigation, instructions, Waldkauz reading, shop, drawing and animations |
| 5. Iterate | Fix observed confusion and defects before expanding scope | Improved playable game; no teacher test is a dependency |

### Codex handoff

Read this blueprint, [curriculum matrix](curriculum-matrix.md), [puzzle specifications](puzzle-specifications.md), [experience design](experience-design.md), [reward/save contract](rewards-and-continuity.md), [visual baseline](visuals/baseline.md) and [revision 10](visuals/revisions/v10.md). Implement one complete saved loop before expanding the world. Compare the running game with the preserved art and record intentional differences.

The design preview demonstrates interactions with temporary 2D animation studies. Production 3D character animation, durable saves and the complete explorable game are implementation work. Older furniture and pre-implementation external-testing requirements are historical references only.
