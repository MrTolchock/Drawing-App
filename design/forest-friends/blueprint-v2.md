> Shared visual rule: [den-led art direction](visuals/art-direction.md). Outdoors, den and shop use 3D; learning puzzles use 2D.

> Latest interaction decisions: [Design revision 8](visuals/revisions/v8.md) supersedes earlier check-to-submit, owl-help and shop-layout proposals. The single difficulty level and curriculum requirements remain.

# Blueprint v2 — Forest friends

**Status:** Game outline with first playable design pack; teacher and child review pending.
**Updated:** 7 November 2026.
**Scope:** Plan the redesign before implementation. Character assignments, content, prices and interaction details remain working proposals until reviewed.

Design pack: [Curriculum matrix](curriculum-matrix.md) · [Five puzzle specifications](puzzle-specifications.md) · [First-session and interaction design](experience-design.md) · [Rewards, continuity and logging](rewards-and-continuity.md) · [Visual design review](visuals/README.md) · [Interactive mockups](visuals/review.html).

## 1. Game outline

Start with a clean design, using the current game and its learning activities as the basis. The player is a small orange fox with a green neckerchief, living beneath a large tree in a welcoming 3D forest. Explore freely, visit friends, help with puzzles, collect rewards and furnish the fox's home.

The game is for children aged 7–8 in Zürich, Switzerland. Use Swiss Standard German. Pictures, demonstrations and repeatable spoken instructions make ordinary play understandable before fluent reading. Reading puzzles explicitly practise written language.

### Required intuitive interface

Assume the child cannot yet read navigation or instructions. The complete home → friend → puzzle → reward → shop → home loop must work through recognisable objects, character pictures, a separate visual demonstration and replayable speech. Do not rely on written menus, dialogue paragraphs, item descriptions or error messages. Merely replacing labels with unexplained symbols is insufficient: teach unfamiliar controls by showing the action.

At home, the doorway, drawing table and bed are directly actionable. Use picture destinations on the map, physical resource tokens for prices, a visible selection state and a demonstrated check-to-confirm action. Retry and completion feedback must be visible and audible. Written words remain where reading is the learning objective; numerals remain where relevant to counting and quantities. Retain German accessibility names, keyboard access and optional captions without making them a reading requirement.

The user endorsed the characters and den artwork. Preserve this direction and use the [versioned visual baseline](visuals/baseline.md) to compare real development at each milestone. Keep the original artwork, frozen mockups and screenshots intact; new design changes get new versions. Version 2 is the current picture-led interface target, pending child review.

### Mandatory curriculum requirement

The game's primary goal is to help children practise the school learning of **first grade in the canton of Zürich**. Alignment with the official **Zürcher Lehrplan 21** is a requirement for every learning puzzle, including future additions. Story, characters and rewards serve that goal.

Use **Zyklus 1** as the curriculum framework, then select tasks suitable for first grade and the classroom's current learning. Zyklus 1 spans kindergarten and first/second primary classes; its competency steps are not an official first-grade annual or trimester schedule. The app's single difficulty level is a first-grade content selection, not a claim that every child or class follows the same sequence. Prioritise German literacy and mathematics, with related nature learning and creative practice.

Before a puzzle is accepted for implementation, document its official competency code and relevant Zyklus-1 step, concrete learning objective, first-grade task range or vocabulary, required prior learning and observable action. Check the actual question pool, instructions and feedback against that objective. Review first-grade suitability with a Zürich primary teacher before release; mappings below are design mappings, not official approval or a claim of complete curriculum coverage.

### Curriculum mapping for the catalogue

The English competency names are game categories, not official Lehrplan titles. Category references guide design; each released puzzle needs its own specific code, step and task mapping in the curriculum matrix. Supporting memory and attention activities must be tied to a subject-specific learning action before release; generic memory play alone does not establish a school competency.

| Game competency | Zürcher Lehrplan reference | First-grade focus and acceptance rule |
| --- | --- | --- |
| Numbers and arithmetic | MA.1.A.1–4, Zahl und Variable | Count, compare, order, decompose, add and subtract with visible number structures. Use a proposed core range up to 20; equal sharing and doubling remain concrete actions, not formal multiplication/division requirements. |
| Speech sounds and phonological awareness | D.1.A.1.b/d, Hören | Hear rhymes, syllables and initial sounds; identify sounds in spoken words. Supply audio so reading is not required to solve a listening task. |
| Reading and writing | D.2.A.1.a–c; D.4.A.1, Grundfertigkeiten | Connect letters and sounds, combine syllables, read familiar short words and simple sentences, and practise individual letter forms. Select letters and vocabulary to match introduced classroom content; use unjoined Deutschschweizer Basisschrift for writing models. |
| Memory and sequencing | Supporting skill; D.1 listening comprehension for narrated sequences, D.2 reading comprehension for written sequences | Waldkauz tasks must involve understanding a short spoken or readable sequence, recalling relevant details or ordering meaningful story events. Object-location memory alone is optional enrichment, not evidence of literacy attainment. Record the specific subject competency and step for each task variant. |
| Patterns and logical reasoning | MA.2.A.2, Form und Raum | Recognise, continue and create simple visual patterns. Explain or demonstrate the repeating rule rather than reward guessing. |
| Geometry and spatial reasoning | MA.2.A.1–2; MA.2.C, Form und Raum | Recognise basic shapes, combine pieces, follow spatial directions and explore simple reflections. Specify the exact competency and step for construction and route variants before implementation. |
| Data and representations | MA.3.C.1, Grössen, Funktionen, Daten und Zufall | Collect and organise small counts and read simple picture representations. Confirm the chosen representation and competency step suit first grade. |
| Nature and classification | NMG.2.1.a/b; NMG.2.4.a/b | Match familiar animals to habitats and classify visible features. Include observation and description prompts; a picture quiz does not replace exploring real habitats. Material-sorting variants require their own relevant NMG reference. |
| Visual attention | Supporting skill; linked to the subject objective of each task | Use differences that matter to learning, such as animal features or geometric properties. Pure visual search remains optional enrichment and cannot count as curriculum coverage. |
| Creative expression and fine motor skills | D.4.A.1 for preparatory writing movements; Bildnerisches Gestalten for art tasks | Keep drawing and colouring as creative practice. Assign a specific BG competency and step when defining each mission; do not count generic colouring or stamps as reading or writing mastery. |

Some current catalogue entries need refinement to meet this requirement: attach Lost belongings and Waldschatz to meaningful listening/reading content or mark them as enrichment; give each creative mission its own row and specific objective; verify the route, chart and construction variants against their exact curriculum steps. No unverified variant is release-ready simply because it appears in the catalogue.

Official sources, checked on 7 November 2026:

- [Zürcher Lehrplan 21 — Mathematik](https://zh.lehrplan.ch/lehrplan_printout.php?e=1&fb_id=5&k=1).
- [Deutsch — Hören, D.1.A.1](https://zh.lehrplan.ch/index.php?code=a%7C1%7C11%7C1%7C1%7C1).
- [Deutsch — Lesen, D.2.A.1](https://zh.lehrplan.ch/index.php?code=a%7C1%7C11%7C2%7C1%7C1).
- [NMG — Tiere und Lebensräume, NMG.2.1](https://zh.lehrplan.ch/index.php?code=a%7C6%7C1%7C2%7C0%7C1).
- [Earlier project research with writing and nature references](../../docs/RESEARCH.md).

## 2. Story and play loop

The fox lives in a den beneath the large tree at the centre of the world. The game starts inside the den: this is the playable home and main menu. Here the fox can play games, eat, sleep, arrange furniture, drink and go outside.

Outside is a freely explorable forest full of friends. Each friend has a personality, a learning competency and a reason to need help. Each visit offers a fresh puzzle from the shared catalogue for that friend's assigned competency. Characters with the same competency offer the same set of puzzle types, with story details adapted to their personalities. Friends give characteristic resources as thanks: Eichhörnchen gives nuts, Biber gives logs, and Fisch gives fish tokens.

1. Start or resume in the fox's furnished den.
2. Go outside and choose a friend to visit.
3. Hear or watch a short introduction and example.
4. Complete a round of tasks.
5. Receive the friend's resource reward.
6. Visit more friends or buy furnishings or other rewards at the shop.
7. Return home to arrange purchases, play, eat, drink or sleep.

Mistakes allow retries and help. There are no lost lives or required countdowns. Leaving a puzzle preserves its question and interaction state; returning resumes it. Completing a round makes the next visit offer fresh tasks. Task pools should avoid immediate repeats.

## 3. World and navigation

The large home tree anchors a central clearing. A smaller tree nearby contains the shop. Other places include a brook, beaver dam and pond, meadow garden, moss grove, story hollow, reed pond, mountain cave, deeper misty woodland and swamp. Bridges connect paths across the brook. The den, shop and cave have enterable interiors.

Click or tap a destination to walk there. A picture map lets the child choose a friend and shows a directional arrow from the fox. Keep navigation readable and forgiving, with clear paths, gentle camera movement and recognisable landmarks. Use [Emberwick](https://simonw.github.io/emberwick/v11/emberwick.html) as the reference for the feel of moving around the world. Preserve this game’s own woodland character and visual identity.

## 4. Characters, appearance and competencies

Use Swiss Standard German character names throughout the game and this blueprint: Fuchs, Waldkauz, Eichhörnchen, Blaumeise, Maus, Biber, Hase, Igel, Reh, Fisch and Eisvogel. English species descriptions remain explanatory text.

Each character needs an expressive, articulated 3D model, a consistent portrait, readable silhouette, idle and interaction animations, and a clear personality. Use warm stylised woodland animals and carry their colours and features into puzzle illustrations.

The following locations, rewards and assignments are proposals where the earlier outline left them open. Resource amounts and prices remain to be balanced.

| Character | Species | Place | 3D appearance | Personality and relationship | Assigned competency | Reward |
| --- | --- | --- | --- | --- | --- | --- |
| Fuchs | Red fox (*Vulpes vulpes*) | Central tree den | Small orange fox, cream muzzle, bushy tail, green neckerchief | Curious and friendly; visits neighbours and makes a home | Creative expression and fine motor skills | Collects and spends resources |
| Waldkauz | Tawny owl (*Strix aluco*) | Story hollow | Rounded brown owl, large expressive eyes, soft feathers and tilting head | Old, thoughtful storyteller; gets confused, mixes things up and loses belongings; welcomes patient help | Memory and sequencing | Feathers |
| Eichhörnchen | Eurasian red squirrel (*Sciurus vulgaris*) | Nut tree | Rust-red fur, tufted ears, large curling tail | Plans ahead and wants enough nuts stored for winter | Numbers and arithmetic | Nuts |
| Blaumeise | Eurasian blue tit (*Cyanistes caeruleus*) | Singing tree | Small blue-and-yellow bird with lively head and wing movements | Musical and sociable; needs rhymes for new songs | Speech sounds and phonological awareness | Seeds |
| Maus | Wood mouse (*Apodemus sylvaticus*) | Reading nook | Small brown mouse, cream belly, large ears | Eager but unsure; wants to learn letters, syllables and reading with the fox | Reading and writing | Berries |
| Biber | Eurasian beaver (*Castor fiber*) | Brook | Sturdy brown body, broad flat tail, visible front teeth | Practical and affectionate; misses Hase across the broken bridge | Geometry and spatial reasoning | Logs |
| Hase | European hare (*Lepus europaeus*) | Meadow garden | Long ears, long hind legs, warm brown coat | Energetic and welcoming; wants to visit neighbours and invite everyone together | Numbers and arithmetic | Carrots |
| Igel | European hedgehog (*Erinaceus europaeus*) | Moss grove | Rounded spiny back, soft face, small careful steps | Gentle and observant; needs a comfortable resting place and company | Nature and classification | Mushrooms |
| Reh | European roe deer (*Capreolus capreolus*) | Woodland edge | Slender legs, large ears, warm brown coat | Attentive and calm; notices changes and helps care for the forest | Nature and classification | Leaves |
| Fisch | Brown trout (*Salmo trutta*) | Pond | Spotted body, moving fins, clear underwater silhouette | Playful collector; enjoys arranging pond treasures | Geometry and spatial reasoning | Fish tokens |
| Eisvogel | Common kingfisher (*Alcedo atthis*) | Reed pond | Bright blue back, orange breast, long beak | Curious and attentive; wants to share the water's view and connect its paths | Geometry and spatial reasoning | Pebbles |

Fish tokens represent a game resource; the story should make clear how Fisch gives them to the fox.

## 5. Competencies and puzzle catalogue

Competencies organise learning independently of the number of characters. Each character is assigned one competency in the cast table. Several characters can share a competency and therefore present the same set of puzzles. Their introductions, objects and rewards can differ while the learning rules remain the same.

Each puzzle belongs to one primary competency and must meet the mandatory Zürich curriculum requirement in section 1. Add new puzzle types under an existing competency as the game develops; add a new competency when a new learning area requires it. Adding a character does not require inventing a competency, and adding a puzzle makes it available to every character assigned to that competency.

The catalogue below has one puzzle type per row, grouped by competency. Existing activities come from the current checkout's documented learning activities; proposed additions expand the task pool. Creative activities are included alongside puzzles so the home activities have a place in the same catalogue.

| Competency | Puzzle or activity | What the child practises | Basis |
| --- | --- | --- | --- |
| Numbers and arithmetic | Zählgarten | Count objects and match quantities to numbers | Existing |
| Numbers and arithmetic | Znüni-Rechnen | Addition and subtraction | Existing |
| Numbers and arithmetic | Sternenrakete | Find number bonds and missing quantities | Existing |
| Numbers and arithmetic | Zauberzwillinge | Double quantities | Existing |
| Numbers and arithmetic | Nachbarhäuser | Find predecessor and successor numbers | Existing |
| Numbers and arithmetic | Beerenvergleich | Compare quantities | Existing |
| Numbers and arithmetic | Rechenfreunde | Recognise related addition facts | Existing |
| Numbers and arithmetic | Waldpicknick | Share objects into equal groups | Existing |
| Numbers and arithmetic | Zahlenwege | Connect numbers in order to reveal a picture | Existing |
| Speech sounds and phonological awareness | Reimzirkus | Match rhyming words to finish a song | Existing |
| Speech sounds and phonological awareness | Silbentrommel | Hear and count spoken syllables | Existing |
| Speech sounds and phonological awareness | Initial-sound matching | Match pictures with the same initial sound | Proposed |
| Reading and writing | Leseschatz | Read syllables and words | Existing |
| Reading and writing | Lies genau | Read colour words, phrases and sentences carefully | Existing |
| Reading and writing | Silben-Ballone | Recognise written syllable families | Existing |
| Reading and writing | Vokalversteck | Supply missing written vowels | Existing |
| Reading and writing | Schreibspuren | Trace letter forms | Existing |
| Reading and writing | Letter–sound matching | Connect written letters with spoken sounds | Proposed |
| Reading and writing | Build a word | Combine written syllables into a word | Proposed |
| Memory and sequencing | Waldschatz | Remember objects and identify what is missing | Existing |
| Memory and sequencing | Was kommt dann? | Put events or actions in a logical order | Existing |
| Memory and sequencing | Lost belongings | Remember where an object belongs | Proposed |
| Memory and sequencing | Mixed-up stories | Restore the order of illustrated story scenes | Proposed |
| Patterns and logical reasoning | Musterzug | Recognise and extend repeating patterns | Existing |
| Geometry and spatial reasoning | Formenwerkstatt | Recognise and combine geometric shapes | Existing |
| Geometry and spatial reasoning | Spiegelmosaik | Complete a reflected grid | Existing |
| Geometry and spatial reasoning | Roboterpost | Follow and construct routes | Existing |
| Geometry and spatial reasoning | Bridge builder | Fit pieces to a pictured construction plan | Proposed |
| Data and representations | Waldumfrage | Read and compare quantities in picture charts | Existing |
| Nature and classification | Naturdetektive | Identify animals, habitats, traits and needs | Existing |
| Nature and classification | Nest-material sorting | Group materials by properties and suitability | Proposed |
| Nature and classification | Track matching | Match animal tracks to their owners | Proposed |
| Visual attention | Spot the difference | Find changes between two forest scenes | Proposed |
| Creative expression and fine motor skills | Free drawing | Express ideas through drawing | Existing |
| Creative expression and fine motor skills | Colouring | Colour illustrated scenes | Existing |
| Creative expression and fine motor skills | Guided colouring | Follow visual colour rules | Existing |
| Creative expression and fine motor skills | Picture stamps | Compose pictures using stamps | Existing |

Creative missions are a source collection outside this table; add each selected mission as its own named row with a learning objective.

Patterns and logical reasoning, Data and representations, and Visual attention currently have no assigned character. Their puzzles remain in the catalogue for future assignments or new neighbours. Competency coverage must not be forced to match the cast size.

Use one difficulty level for every puzzle. Vary questions and story objects within that level; there is no level selector or higher-difficulty reward multiplier. Add more tasks and variations within each puzzle type. A round begins with a separate worked example and initially contains five tasks; expand the question pool before increasing round length. Keep explanations short and allow replayable demonstrations and hints.

## 6. Shop, resources and home

The shop sells furniture, decorations, creative activities, food and drinks for the fox's den. Prices can combine resources: for example, a furnishing might cost **two nuts, one log and two fish tokens**. This is an example price, not a final balance decision.

Show prices and wallet contents with recognisable pictures and quantities. Preview furnishings before purchase. Purchases deduct resources once and add an owned item that the child can place or rearrange at home.

The den is a continuing part of play: furnish it with gifts and purchases, play familiar games, eat, sleep and leave through the door. Eating and sleeping are gentle role-play actions; they must not create upkeep pressure or remove earned progress.

Repeatable rewards keep the shop useful after the den is furnished. Sell drawing templates to use at the den's table, apples that trigger a short eating animation, and drinks with a drinking animation. Food and drinks are consumed when used; owned furniture remains. Keep the reward catalogue open to further consumable items and activities.

## 7. Saving and continuity

Furniture and progress must survive page refreshes, closing and reopening the game, and ordinary game updates on the same device.

Save the wallet, owned furnishings, furniture placement, unused consumables, unlocked drawing templates, completed tasks, active puzzle state, settings and existing drawings. Save after meaningful changes, including purchases, furniture moves and puzzle rewards. Loading restores the same home and progress without duplicate purchases or payouts.

Keep existing progress and drawings through compatible storage and migrations. A clean redesign must not mean clearing the child's save. Provide a deliberate reset separately from normal play. A later backup/export feature can support moving saves between devices.

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
- Character visits, puzzle type, task identifier or generation seed, and assigned competency.
- Submitted answers, wrong entries, retries, hints and puzzle skips.
- Time spent per task and round, distinguishing active play from pauses or a hidden browser tab.
- Puzzle completion, abandonment and resumption.
- Resource rewards, purchases, furniture changes and save/load failures.

Keep logs local by default, bounded in size and available through adult settings with export and clear controls. Use an anonymous session identifier; avoid names, recordings and unrelated personal information. There is no automatic AI upload. Exports should contain enough puzzle context to understand mistakes and timing, with development skips marked explicitly.

This introduces local gameplay logging beyond the current checkout's stated no-tracking behaviour; explain it in adult settings when implemented.

## 11. First playable version and checks

Build the den, a small explorable forest, the shop and five friends first: Eichhörnchen, Blaumeise, Waldkauz, Biber and Maus. The design pack brings Maus into the initial set to include explicit reading practice. Include at least one puzzle type from each of their assigned competencies, one difficulty level, fresh repeat visits, resource rewards, at least one purchasable furnishing and one consumable reward. The competency determines the available puzzle set for every character who shares it. Add the remaining neighbours as further game families are ready.

The first version is ready to review when:

- The game starts in the den and the fox can leave, navigate to friends and return.
- Each friend has a recognisable 3D model, personality and playable puzzle.
- Every released learning puzzle has a verified Zürcher Lehrplan code and Zyklus-1 step, a concrete first-grade objective, and reviewed task content; supporting or enrichment activities are labelled separately.
- First-grade suitability has been reviewed with a Zürich primary teacher; remaining curriculum gaps are documented.
- Each new completed visit can offer fresh tasks; interrupted puzzles resume correctly.
- There is one difficulty level, with no level selector or difficulty-based reward multiplier.
- Characters sharing a competency offer the same catalogue of puzzle types.
- Each puzzle occupies its own catalogue row; new puzzles and competencies can be added independently of the cast.
- Buying and placing furniture works, and refresh/relaunch preserves furniture and resources.
- Music and forest sounds play gently and their controls persist.
- A child can follow the main loop using objects, pictures, demonstration and speech without reading navigation text.
- Matched development screenshots have been compared with the preserved visual baseline; intentional deviations are documented.
- Development skips work and remain separate from player progress.
- The gameplay log exports usable movement, error and timing information.
- Existing saves and drawings remain accessible after an update.

## 12. Open decisions

- Agree on movement and camera details using the linked Emberwick reference.
- Confirm the proposed character appearances, competency assignments and rewards.
- Decide who runs the shop and select the first furniture collection.
- Balance resource amounts, combined prices and task ranges for the single difficulty level.
- Select suitable tasks from existing three-stage activities for the single level.
- Assign the currently uncovered competencies to existing or future characters.
- Set local log retention limits and the adult export format.
- Preserve useful interactions from the current game: see [current gameplay](../../docs/GAMEPLAY.md) and [Heart Tree baseline](../heart-tree/BLUEPRINT.md). Inspect existing save keys and assets before implementation; the current checkout now includes the later world and story documentation.

## 13. Next design steps and development handoff

Complete the following in order before full development. The blueprint is a design draft until these decisions are resolved; adding this checklist does not mean the design is approved or finished.

| Step | Design work | Deliverable and completion criterion |
| --- | --- | --- |
| 1. Validate learning scope | Review the curriculum mapping and choose first-grade objectives, number ranges, introduced letters and vocabulary. Prioritise German and mathematics. Resolve provisional references with a Zürich primary teacher. | A reviewed curriculum matrix with one puzzle per row, exact competency code and step, learning objective, prerequisites and task boundaries. Label enrichment separately. |
| 2. Define puzzle specifications | For each initial puzzle, write its introduction, worked example, five sample tasks, correct answers, plausible errors, hints and feedback. Define input and resume behaviour. | One short specification per puzzle, with a larger question-generation or content plan and clear evidence that tasks practise the intended objective. Keep one difficulty level. |
| 3. Confirm cast and shared competencies | Approve character personalities, appearances, assigned competencies, resources and story reasons for helping. Decide which neighbours share puzzle sets and who runs the shop. | A final cast sheet and an explicit character-to-competency mapping. Keep unassigned competencies visible in the backlog. |
| 4. Storyboard the first session | Draw the flow from waking in the den through leaving, meeting a friend, learning a puzzle, earning a reward, buying an item and returning home. Include mistakes, help, leaving and returning. | A short picture storyboard that a child can follow with little reading, plus draft Swiss Standard German dialogue and speech. |
| 5. Sketch the world and controls | Map the first playable forest, paths, landmarks, entrances and camera behaviour. Use Emberwick to discuss movement feel. Sketch the den, map, puzzle screen, wallet, shop and adult settings. | An annotated world map and screen wireframes, including touch targets, route guidance and transitions. |
| 6. Set the visual and audio direction | Make a character reference sheet, starting with Fuchs and Waldkauz, and one representative forest/den scene. Define model proportions, animation needs, puzzle illustration style, music and ambience. | A small approved reference pack and asset list for the first playable version. |
| 7. Balance the reward loop | Choose initial rewards, wallet icons, furniture and consumables. Work through sample purchases and repeat visits. Define ownership, consumption and placement rules. | A price/reward table showing how many rounds a first furnishing needs, with no forced upkeep or difficulty multiplier. |
| 8. Specify persistence and logging | List saved states, migration expectations, interrupted-puzzle behaviour, purchase/reward consistency and development skips. Define log events, sample export, retention and adult controls. | A save-state checklist and sample anonymous log export covering success, mistakes, pauses, refreshes and skips. |
| 9. Review with children and a teacher | Walk through the storyboard or a small disposable interaction mockup. Observe navigation, instruction comprehension, puzzle relevance and reward understanding. | Recorded findings, agreed revisions and resolved blockers. Use this review to refine design before expanding the world. |
| 10. Freeze the first playable scope | Choose the exact initial puzzle types, characters, scene boundaries, asset needs and acceptance checks. Separate required work from later additions. | A development-ready brief linking the approved designs, a prioritised implementation backlog and a documented list of remaining optional decisions. |

### Design work completed in the next pass

- [Curriculum matrix](curriculum-matrix.md): five initial puzzle mappings with exact official steps, plus a row-by-row backlog. Unverified mappings and enrichment are explicit.
- [Puzzle specifications](puzzle-specifications.md): counting, rhymes, spoken-story sequencing, shape composition and reading. Each has an example, five sample tasks, answers, hints, feedback, content boundaries and resume rules.
- [Experience design](experience-design.md): first-session storyboard, world topology, screen layouts, movement proposal, character/audio direction and review script.
- [Rewards and continuity](rewards-and-continuity.md): proposed rewards and prices, purchase/consumption rules, save recovery and local log/export contract.
- [Visual review](visuals/README.md): Fuchs/Waldkauz character reference, den/forest concepts and editable tablet screen mockups with counting, reading and shop interaction specimens.

These are drafts available for review. Next: review the first visual proposals, extend the remaining character/screen references, expand each initial puzzle to at least 15 reviewed tasks or valid generated variants, review curriculum suitability with a Zürich primary teacher, and walk through the interaction design with children. No teacher approval, child testing or asset approval has yet taken place. Do not mark the design frozen until those reviews are recorded.

### Handoff to development

Give the development chat this blueprint, the reviewed curriculum matrix, puzzle specifications, world map, wireframes, reference assets, reward table and [visual comparison baseline](visuals/baseline.md). For each implemented milestone, capture the matching scenes and compare them with the frozen art and screenshots; record differences instead of changing the reference to fit the implementation. Implement one complete loop first: den → friend → puzzle → resource → shop → placed furnishing → refresh with state restored. Validate that loop before adding the remaining puzzle catalogue and forest regions.

The design phase is complete when the first playable deliverables above are approved, curriculum checks are resolved for its puzzles, and the acceptance checks in section 11 can be implemented without inventing major product decisions. Curriculum gaps for later releases stay explicitly listed.
