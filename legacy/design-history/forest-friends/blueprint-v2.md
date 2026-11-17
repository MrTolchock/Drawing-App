# Blueprint v2 — Forest friends: letters through the forest

**Updated:** 9 November 2026.
**Current direction:** A continuous letter adventure, with a rabbit mailman and no shop or currency rewards.
**Scope:** This is the current game contract. It supersedes revision 10's economy, consumables and Hase puzzle-host role. The [previous blueprint](blueprint-before-letters.md), frozen visual references and original Heart Tree adventure remain historical records.

Design references: [curriculum matrix](curriculum-matrix.md) · [puzzle specifications](puzzle-specifications.md) · [visual baseline](visuals/baseline.md) · [letter-loop specification](letter-loop.md) · [current implementation and saves](../../docs/FOREST-FRIENDS.md).

The earlier [experience design](experience-design.md), [reward/save design](rewards-and-continuity.md) and frozen mockups contain historical shopping flows. Where they conflict with this document, the letter loop below governs. The curriculum, readable puzzle objectives and accepted woodland art direction still apply.

## 1. Game outline and learning

Fuchs, a small orange fox with a green neckerchief, lives beneath a large tree in a warm woodland. A letter arrives at home and invites him to visit a pictured friend. Solving that friend's puzzle brings the next letter, delivered nearby by Hase the mailman. Each delivery points to another friend, so the adventure continues without a shop, prices, coins, host currencies or purchases.

The game is for children aged 7–8 in Zürich, Switzerland. Use Swiss Standard German. Pictures, demonstrations and repeatable spoken instructions make ordinary play understandable before fluent reading. Reading puzzles explicitly practise written language.

### Required intuitive interface

The main loop must be understandable through the letter, a character portrait, the directional arrow, recognisable places and separate visual worked examples. Speech is off during ordinary play. A single **Spiel erklären** button inside each puzzle speaks its explanation on request; remove navigation/replay narration controls and automatic reading. The invitation letter contains decorative, unreadable handwriting and a clear picture of its recipient. It is a pictured invitation, not a reading exercise. Never depend on deciphering its marks to choose the destination.

At home, the closed doorway, letter, drawing table, pile of pictures and bed are directly actionable. The table opens Ausmalen directly; the picture pile opens Meine Bilder. Place the Waldspiele book button beside the shelf books so the books remain visible. The player clicks or taps to open the letter, then leaves the den. Outdoors, clicking/tapping the ground moves Fuchs; an arrow guides the route to the active recipient or mailman. There is no movement pad, keyboard walking or jump feature. Buttons remain keyboard accessible. Keep meaningful German accessibility names and optional captions.

The user endorsed the characters and den artwork. Preserve the warm painted appearance and the original illustrated puzzles. Learning rounds use 2D paper and painted objects; the forest, moving characters and guidance arrow use 3D. Preserve frozen baseline files; record intentional departures as new milestone evidence.

### Mandatory curriculum requirement

The game's primary goal is to help children practise the school learning of **first grade in the canton of Zürich**. Alignment with the official **Zürcher Lehrplan 21** is a requirement for every learning puzzle, including future additions. Story, characters and the letter journey serve that goal.

Use **Zyklus 1** as the curriculum framework, then select tasks suitable for first grade and the classroom's current learning. Zyklus 1 spans kindergarten and first/second primary classes; its competency steps are not an official first-grade annual or trimester schedule. The app's single difficulty level is a first-grade content selection, not a claim that every child or class follows the same sequence. Prioritise German literacy and mathematics, with related nature learning and creative practice.

Before a puzzle is accepted for implementation, document its official competency code and relevant Zyklus-1 step, concrete learning objective, first-grade task range or vocabulary, required prior learning and observable action. Check the actual question pool, instructions and feedback against that objective. Check curriculum references and first-grade task boundaries internally during implementation. No teacher consultation/testing is planned or required. The user tests with a child after implementation once the game is running; mappings are design mappings, not official approval or complete curriculum coverage.

### Simple learning categories

Use a small set of familiar categories: **Mathematics (Mathematik), Reading (Lesen), Writing (Schreiben), Nature (Natur), and Creativity (Gestalten)**. Reading is a core priority. The first playable set focuses on Mathematics and Reading; the other categories describe the existing catalogue and later work, not extra launch requirements.

Categories organise puzzles, not animal identities. Several animals can offer Reading or Mathematics. Within a category, different animals may introduce different puzzle types; a shared category does not force identical activities at every visit. Once released, a puzzle can be reused by any assigned friend with an adapted story. Never invent a category just to give an animal something unique.

| Category | Learning content inside the category | Initial hosts |
| --- | --- | --- |
| Mathematics / Mathematik | Counting and arithmetic; patterns; shapes, space and simple data representations | Eichhörnchen, Biber; later Fisch and Eisvogel |
| Reading / Lesen | Letters and syllables; written words; written rhyme pairs; short sentence-to-picture matching | Maus, Blaumeise, Waldkauz |
| Writing / Schreiben | Introduced letter forms and simple spelling tasks | Later activities with Maus or another existing friend |
| Nature / Natur | Familiar animals, habitats, tracks and material properties | Later Igel and Reh |
| Creativity / Gestalten | Drawing, colouring and picture composition | Fuchs at home |

Memory, attention, phonological awareness, sequencing and spatial reasoning are supporting skills or internal curriculum tags. They are not separate main categories. Pure memory/search play remains optional enrichment and does not count as subject coverage. Each learning puzzle still needs its own specific Lehrplan mapping; a simple category name never substitutes for that review.

### Updated initial examples

| Category | Animal | Puzzle | Child's action |
| --- | --- | --- | --- |
| Mathematics | Eichhörnchen | Waldkäfer zählen | Count pictured nuts and choose a numeral |
| Mathematics | Biber | Welche Form fehlt? | Choose the shape that fills a visible gap in a house or cart; one tap inserts it |
| Reading | Maus | Wort und Waldbild | Read a familiar word and choose its picture |
| Reading | Blaumeise | Waldreime | Read a written target and two written, pictured answers; choose the rhyme, e.g. Haus → Maus |
| Reading | Waldkauz | Lies und zeig | Read a three-word sentence and choose between two clear pictures, e.g. «Die Maus sitzt.» |

The old game's Reimzirkus word-and-picture cards are the basis for Blaumeise. The single explanation describes the matching action without pronouncing the scored words. Remove individual word-audio buttons. This is a reading-led activity with rhyming practice; picture matching alone does not establish independent reading.

Waldkauz starts with familiar nouns and concrete actions: «Die Maus sitzt.», «Der Vogel fliegt.», «Die Maus rennt.», «Der Vogel sitzt.», «Der Fisch schwimmt.» Use two large pictures, short sentences, optional syllable support, unlimited time and a separate spoken example. Avoid opening with spatial prepositions, similar multi-detail scenes, three-event ordering or a third distractor. The instruction speaker explains what to do without reading the scored sentence. This is one consistent content level, not a difficulty ladder. Longer sentences remain later content work, outside the initial pool.

Biber's newer round is a basic shape-recognition warm-up; do not label it full geometry or shape-composition mastery. Matching a gap does not establish that the child can name a shape. The restored Formenwerkstatt, Roboterpost and Was kommt dann? remain separate catalogue activities with their original interaction rules, rather than replacing the simpler newer examples.

The curriculum matrix distinguishes game categories from exact subject references. Reading uses D.2.A.1.b for initial decoding and short sentences; rhyming also has a listening/phonological support reference. Biber's recognition exercise supports basic shape vocabulary under MA.2.A.1.a, with naming practised in feedback; full naming/composition assessment is outside this fixture. Internal curriculum source checks remain required. No teacher test is planned; child testing follows implementation.

Official sources, checked on 7 November 2026:

- [Zürcher Lehrplan 21 — Mathematik](https://zh.lehrplan.ch/lehrplan_printout.php?e=1&fb_id=5&k=1).
- [Deutsch — Hören, D.1.A.1](https://zh.lehrplan.ch/index.php?code=a%7C1%7C11%7C1%7C1%7C1).
- [Deutsch — Lesen, D.2.A.1](https://zh.lehrplan.ch/index.php?code=a%7C1%7C11%7C2%7C1%7C1).
- [NMG — Tiere und Lebensräume, NMG.2.1](https://zh.lehrplan.ch/index.php?code=a%7C6%7C1%7C2%7C0%7C1).
- [Earlier project research with writing and nature references](../../docs/RESEARCH.md).

## 2. The continuous letter loop

1. **Start at home.** Fuchs is inside the den. The front door is closed, with a visible mail lid/slot.
2. **Receive the first letter.** The mail lid opens briefly and an envelope slips through onto the inside floor. It remains available until the player clicks it. No timed response is required.
3. **Open the invitation.** One click opens the letter. Unreadable handwritten marks surround a large picture of one of the five puzzle friends. The character picture identifies whom to visit without narration.
4. **Leave the den.** The fox goes outside through the doorway. A directional arrow in the 3D world points toward the pictured friend and updates as the fox moves. It guides clicking, rather than moving Fuchs automatically.
5. **Play with that friend.** The character starts one of their assigned library puzzles, including both original illustrated activities and the five newer rounds. An interrupted newer round resumes first. The learning rules and single difficulty level stay consistent with the overview.
6. **Meet the mailman nearby.** After completing the assigned puzzle, return to the 3D forest with Hase visibly close to Fuchs. The arrow now points to Hase rather than the completed friend. There is no currency payout or shopping detour.
7. **Receive another invitation.** Click Hase to receive/open a new letter. Its portrait identifies another friend. The arrow changes to that recipient. Continue from step 4 without returning home for every delivery.

The next invitation leads to a different friend; the host sequence revisits all five over time. The loop has no final purchasing goal or resource requirement. Mistakes, help, time spent and repeated play do not block the next letter once the puzzle is complete. Leaving an unfinished puzzle does not count as completion or trigger mailman delivery.

Fuchs can return home to paint, colour or rest. The picture-book overview remains available for choosing any old or new puzzle directly. Only a completed puzzle associated with the current invitation advances that invitation; unrelated practice never fabricates mail deliveries.

## 3. World, navigation and delivery staging

The home tree anchors the clearing, with a brook, bridge, familiar paths and the five friends' places. The shop and its destination, stall, prices and bag/wallet controls are removed from the current forest. Keep free exploration, the picture map, gentle camera motion, forgiving paths and solid obstacles.

Remove the golden leaf collectibles, counter, collection rewards and related effects. Preserve already stored collection fields as dormant compatibility data. Natural foliage and butterflies remain decorative woodland life.

The guidance arrow follows the active invitation, not an arbitrary reward destination. In the friend phase it indicates the invited friend; in the delivery phase it indicates Hase's current position. It stays visible and truthful as Fuchs and Hase move. It must not resemble a movement-control pad.

Hase wanders freely on walkable forest ground. After puzzle completion he is staged very near Fuchs, within a short click/tap walk and in a readable camera view. He should remain easy to catch for delivery rather than walking away as the child approaches. His regular wandering resumes between deliveries. No route may cross solid trunks or water without the bridge.

The den's closed wooden door and brass mail lid use the same painted texture, shading and perspective as the room. Remove the loose floor cushion. Sleeping places Fuchs lying sideways on the bed's mattress, with his paws and tail curled in, at a size comparable to the standing fox; resizing must keep him visible and on the bed. Reduced motion keeps the arriving envelope visible without requiring an animation; the same letter-opening action and saved outcome remain available. An opened postcard shows only the illustrated card, without a surrounding panel or separate door button. Clicking the card (or pressing Enter) takes Fuchs outside. Lower the shelf's Waldspiele book away from the screen edge.

## 4. Characters and assignments

Use Swiss Standard German names in speech, captions and accessibility labels. Every character has an expressive, articulated 3D model and a consistent portrait. The rabbit's current role is **Hase, der Briefträger**. He is not a puzzle friend, has no learning category or puzzle reward, and never presents an exercise.

| Character | Role and place | Appearance and behaviour | Learning role |
| --- | --- | --- | --- |
| Fuchs | Player; tree den and woodland paths | Orange fur, cream muzzle, bushy tail, green neckerchief; curious and friendly | Visits the pictured friend and uses the free Malatelier |
| Eichhörnchen | Puzzle friend at the nut tree | Rust-red fur, tufted ears and curling tail | Counting and arithmetic |
| Blaumeise | Puzzle friend at the singing tree | Blue and yellow, lively head and wings | Rhymes, syllables and nature activities |
| Waldkauz | Puzzle friend in the story hollow | Warm rounded brown owl, expressive face and head tilt | Short sentence reading, patterns and discovery |
| Maus | Puzzle friend in the reading nook | Small brown mouse, cream belly, large ears | Words, vowels and writing |
| Biber | Puzzle friend near the brook | Sturdy brown body, broad tail and visible teeth | Shapes and spatial activities |
| Hase, der Briefträger | Roaming delivery character, arriving nearby after a puzzle | Long ears and warm brown fur; clearly identifiable postal cap, mail satchel and envelope insignia; carries/delivers letters | Delivery only; no puzzles |

Igel, Reh, Fisch and Eisvogel remain possible later puzzle friends. Hase remains the mailman when further neighbours are added. Historical Heart Tree character roles are retained only in that separate original adventure.

## 5. Shared categories and puzzle catalogue

Use the simple categories in section 1 throughout navigation, adult summaries and logs. Several animals share a category; each puzzle retains a precise objective and its own curriculum tags. A friend may introduce a particular puzzle without owning a new category or exposing the entire category catalogue immediately. Add a puzzle once, then reuse it across eligible hosts with the same answer rules and adapted story objects.

The catalogue below has one puzzle type per row, grouped by category. Existing activities come from the current checkout's documented learning activities; proposed additions expand the task pool. Creative activities are included alongside puzzles so the home activities have a place in the same catalogue.

| Category | Puzzle or activity | What the child practises | Basis |
| --- | --- | --- | --- |
| Mathematics | Waldkäfer zählen | Count objects and match quantities to numbers | Existing |
| Mathematics | Äpfel rechnen | Addition and subtraction | Existing |
| Mathematics | Glühwürmchen sammeln | Find number bonds and missing quantities | Existing |
| Mathematics | Nüsse verdoppeln | Double quantities | Existing |
| Mathematics | Nachbarhäuser | Find predecessor and successor numbers | Existing |
| Mathematics | Beerenvergleich | Compare quantities | Existing |
| Mathematics | Rechenfreunde | Recognise related addition facts | Existing |
| Mathematics | Waldpicknick | Share objects into equal groups | Existing |
| Mathematics | Zahlenwege | Connect numbers in order to reveal a picture | Existing |
| Reading | Waldreime | Read written words and match rhymes, with pictures and an optional action explanation | Existing, adapted |
| Reading | Lies und zeig | Read a three-word sentence and select one of two pictures | Initial Waldkauz activity |
| Reading | Silben klopfen | Hear and count spoken syllables | Existing |
| Reading | Initial-sound matching | Match pictures with the same initial sound | Proposed |
| Reading | Silben-Puzzle | Assemble woodland words from written syllables | Existing, direct entry |
| Reading | Wort und Waldbild | Read a woodland word and choose its picture | Existing, direct entry |
| Reading | Farben lesen | Read colour words, phrases and sentences carefully | Existing |
| Reading | Silbenblätter | Recognise written syllable families | Existing |
| Writing | Waldwörter ergänzen | Supply missing written vowels | Existing |
| Writing | Schreibspuren | Trace letter forms | Existing |
| Reading | Letter–sound matching | Connect written letters with spoken sounds | Proposed |
| Reading | Build a word | Combine written syllables into a word | Proposed |
| Optional enrichment | Waldschatz | Remember objects and identify what is missing | Existing |
| Reading | Was kommt dann? | Put events or actions in a logical order | Existing |
| Optional enrichment | Lost belongings | Remember where an object belongs | Proposed |
| Reading | Mixed-up stories | Understand and order a narrated story | Later proposal; withdrawn from initial set |
| Mathematics | Waldmuster | Recognise and extend repeating patterns | Existing |
| Mathematics | Welche Form fehlt? | Recognise a missing shape in a familiar object | Initial Biber warm-up |
| Mathematics | Waldwerkstatt | Combine geometric shapes | Existing, restored composition activity |
| Mathematics | Waldspiegel | Complete a reflected grid | Existing |
| Mathematics | Waldpost | Follow and construct routes | Existing |
| Mathematics | Bridge builder | Fit pieces to a pictured construction plan | Proposed |
| Mathematics | Waldumfrage | Read and compare quantities in picture charts | Existing |
| Nature | Naturdetektive | Identify animals, habitats, traits and needs | Existing |
| Nature | Nest-material sorting | Group materials by properties and suitability | Proposed |
| Nature | Track matching | Match animal tracks to their owners | Proposed |
| Optional enrichment | Spot the difference | Find changes between two forest scenes | Proposed |
| Creativity | Free drawing | Express ideas through drawing | Existing |
| Creativity | Colouring | Colour illustrated scenes | Existing |

Creative missions are a source collection outside this table; add each selected mission as its own named row with a learning objective.

The restored catalogue includes Writing, Nature and Creativity alongside the newer Reading and Mathematics rounds, without requiring a new animal for every skill. Optional enrichment is kept outside claims of curriculum coverage.

The Waldspiele overview shows all 29 puzzles in one grid, with the same friend filters and no separate newer-round section. The four Leseschatz activities are direct independent puzzles: Silben-Puzzle, Wort und Waldbild, Silbenblätter and Farben lesen. Use the Silben-Puzzle's pictured task, clear paper, large answer tiles and quiet feedback as the common design. Match characters-v1.png with warm dimensional woodland animals, softly shaded natural objects and one forest clearing. Use woodland names and motifs: Waldmuster, Waldreime, Glühwürmchen sammeln, Nüsse verdoppeln and Waldpost replace unrelated train, circus, rocket and robot settings. Keep internal IDs and historical progress compatible.

Use one difficulty level for every puzzle. Vary questions and story objects within that level; there is no level selector or automatic difficulty progression. Add more tasks and variations within each puzzle type. A round begins with a separate worked example and initially contains five tasks; expand the question pool before increasing round length. Keep explanations short and allow replayable demonstrations and hints.

## 6. Free creativity and completion feedback

Fuchs's table opens **Ausmalen** directly, showing six polished woodland illustrations with clear closed outlines and generous areas to colour. A picture opens immediately in **Frei**. Do not offer Würfel, Zahlen, Silben or colour-word modes in the current adventure, and remove Stempel from both colouring and free drawing. Keep pencils, brushes, fill, patterns, eraser, brush sizes, undo and saved pictures. Waldspiele → Malatelier offers **Ausmalen** and **Meine Bilder**; remove Freies Malen and Meine bisherigen Blätter from its menu. The original free editor remains compatible by its direct route, including mirror/kaleidoscope and coloured paper. Preserve saved pictures and vector sheets. All pages, pencils and colours are freely available.

A pile of pictures beside the table has a separate **Meine Bilder** button that opens the gallery directly. Back from a picture returns to picture selection; when opened from Meine Bilder, it returns to the gallery. Label undo **Rückgängig** so it cannot be confused with navigation. Preserve each existing saved picture and original page identifier; older pages and guided-mode data remain compatible in the historical game.

Puzzle completion is acknowledged with the friend's friendly reaction and the next delivery. The current adventure has no coins, host tokens, prices, purchases, shop, reward multipliers or consumable inventory flow. Existing numerical progress records can be retained for save compatibility; they do not become a currency in this loop. No drawing activity is gated behind the puzzle journey.

## 7. Saving and continuity

Save the letter phase, current recipient, delivery sequence/cursor, completed invitation and exact interrupted newer puzzle state with attempts/support and audio settings. Completion and its transition to the nearby mailman must commit once. Reopening or refreshing must not create duplicate letters or advance the sequence twice.

Preserve old localStorage identifiers and IndexedDB drawings. Old wallets, purchases, consumables, unlocks and furniture fields can remain safely in the stored envelope for compatibility, but must not expose the retired shop or block access to drawing tools. Do not clear or destructively replace old data to demonstrate the new opening.

On relaunch Fuchs starts in the den. The saved invitation can be reopened and its correct arrow restored outside. A completed invitation still points to the mailman, rather than replaying a payout. A corrupt or newer unsupported envelope remains exportable and must not be overwritten silently. Maintain the validated previous-save backup and concurrent-tab protection.

## 8. Visuals, sound and access

Use warm ivory, woodland greens, honey timber, blue water and the orange fox. Redraw the map, letter, book and settings icons as one consistent painted set based on **characters-v1.png**. Centre each object optically inside an equally sized tile, including the open book. Letter paper, envelope, slot, portraits and postal costume belong to that illustrated family. Do not replace clear action illustrations with decorative marks that hide the puzzle's distinction.

The picture map is a polished painted woodland diorama with recognizable homes, clear connecting paths, brook and bridge. Use matching large character portraits as tappable destinations; mark the invited friend. Keep each touch target at least 48 × 48 and separated on a phone. A pending mailman destination uses his current reachable location rather than a fixed puzzle host position.

All settings entry points open the same new screen, including from the 3D world and Waldspiele. Put the optional stopwatch/countdown there and remove its Waldspiele launcher. Keep forest ambience, music, game effects, reading letter case and local save/log controls together. The clock waits in settings and in the background, restores paused after reload and never ends an activity.

Use locally available forest sounds: wind, rustling foliage, flowing water and varied birdsong. Start audio after a gesture, soften it in the den, quieten it during an explicit puzzle explanation and mute it while hidden. Speech is off by default and ordinary navigation, letters, feedback and task changes remain silent. Each original/new puzzle has one explicit explanation button; examples remain visual and reading answers are not pronounced. Silbentrommel's explanation can include its word as the listening stimulus. Touch controls remain usable at 390 × 844 as well as tablet viewports; neither letters nor the optional play timer introduce a puzzle deadline.

## 9. Development mode and local logs

Keep direct puzzle access and explicit task skips inside a visibly marked, separate development save. Test skips are distinguishable from completed child answers. They must not overwrite a child's invitation or drawing records.

Keep bounded, local gameplay logs with anonymous sessions, version/schema identifiers, letter arrival/opening, recipient selection, friend visits, mailman delivery, puzzle attempts/support, active durations, movement and save failures. Adults can export or clear logs; there is no automatic upload. Historic economy entries can remain in old logs, but current play does not emit payouts or purchases.

## 10. Acceptance and validation order

A complete reviewable loop must demonstrate:

- Closed den door → visible mail-lid delivery → click to picture letter → leave home.
- A truthful in-world arrow from Fuchs to the invited friend, without automatic movement.
- Old and new assigned puzzles available through both friend visits and the picture overview.
- Completion returns to the forest with the recognizable rabbit mailman very close; the arrow points to him.
- Clicking Hase opens a new invitation to another friend; Hase never launches a puzzle.
- Free wandering and delivery staging stay on walkable ground and remain understandable on a phone.
- No shop, currency grants, purchase controls or creative locks in current play.
- Refresh/relaunch, retries, abandoned rounds and repeated completion cannot skip or duplicate invitations.
- Existing drawings, newer puzzle snapshots, prior progress and adult audio choices survive the update.
- Model/content checks, browser flow, screenshots and offline continuity are checked before describing the build as verified.

No teacher testing is required. Internal first-grade curriculum/source checks remain mandatory; the user tests with a child after implementation. Software-browser success does not establish physical iPad/Safari performance, voice availability or child usability. Preserve the baseline art and add matched screenshot evidence for the changed opening, letter, arrow and mailman scenes.
