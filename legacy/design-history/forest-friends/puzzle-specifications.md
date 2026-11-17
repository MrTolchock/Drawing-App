> Current revision 10: purchases never alter the environment. No teacher testing is planned or required. Child testing happens after implementation, once the game is running. This replaces earlier pre-implementation external-review gates; internal curriculum source checks remain.

> Shared visual rule: [den-led art direction](visuals/art-direction.md). Outdoors, den and shop use 3D; learning puzzles use 2D.

> Latest interaction decisions: [Design revision 9](visuals/revisions/v9.md) sets shared categories and the revised Reading/Mathematics examples. The single difficulty level and curriculum requirements remain.

# Initial puzzle specifications

**Status:** Reviewable design drafts, 7 November 2026. No gameplay implementation. Curriculum mappings and prerequisites are in [the matrix](curriculum-matrix.md). No teacher testing is required. Child testing follows implementation.

## Shared round behaviour

Use one difficulty level, five scored tasks and a separate worked example. No timer, lives, resource deductions or penalty for help. A child can replay the example or leave at any time. First visits show the example; later visits offer it through the demonstration button.

Answer actions submit directly. A numeral, written-word card or picture tap submits immediately in the initial five activities. There is no checkmark or next-task button. Tap placement is available alongside dragging; placed objects remain removable and editable. Wrong answers preserve the arrangement, show a gentle retry cue and say «Schau noch einmal. Du kannst es ändern.» Correct answers show brief feedback, then continue automatically; the current design specimen uses a 1.4-second feedback pause, not a timed question. Pause continuation while an example is open or the child has left. Examples and adult visual-review states are separate from scored tasks.

Directions can be spoken and demonstrated. Written target words, rhyme choices and scored sentences are intentional reading content; do not narrate scored reading targets automatically. Five completed tasks grant three of the host's resource once, regardless of retries or requested support. The thanks animation and pictured bag action acknowledge the already-earned reward; replaying them must not grant more resources.

Save the round ID, puzzle/content version, generated task IDs, task order, current task, object placements/selections, completed tasks, attempts, help state and reward transaction ID. Returning to an interrupted round shows a resume invitation; it does not roll a new puzzle. Refresh restores the current task. Developer skip is logged and never counted as a correct child answer.

A task pool has at least 15 reviewed items or valid generated variants per puzzle before public release. Use five distinct tasks per round; do not repeat the previous round's exact set when the approved pool permits another. Sample tasks below are specification fixtures, not a sufficient release pool. Generation must preserve valid answers and content boundaries. Positions are shuffled independently of correctness.

## NUM-01 — Zählgarten

**Characters:** Eichhörnchen and, when introduced, Hase. **Goal:** count and connect a collection to its numeral; MA.1.A.2.a. **Prerequisite:** recognise the offered numerals. **One level:** 0–20 objects with optional five/ten frames. No timed quantity recognition.

Eichhörnchen: «Ich sammle Nüsse für den Winter. Wie viele sind hier?» Hase uses the same rules with carrots and a picnic story.

**Example:** Show three nuts. The demonstration taps them once each, moves them into a counting row and chooses 3. Say «Jede Nuss zählt einmal. Es sind drei.» The example never becomes one of the scored tasks.

**Interaction:** Objects are non-interactive pictures in the first screen design. The child taps one of three numeral cards; that tap submits immediately. Do not require tapping or marking the objects. Use visible five/ten structures for support. Shuffle answer positions independently of correctness.

| Task | Collection | Numeral choices | Correct answer | Likely error and useful hint |
| --- | --- | --- | --- | --- |
| 1 | Empty basket | 0, 1, 2 | 0 | Counting the basket; «Im Korb ist keine Nuss.» |
| 2 | 4 scattered nuts | 3, 4, 5 | 4 | Missing/double-counting; offer one mark per nut. |
| 3 | 7 nuts | 6, 7, 8 | 7 | Losing count; offer a row of five and the rest. |
| 4 | 12 nuts | 11, 12, 13 | 12 | Losing the second ten; offer ten plus two. |
| 5 | 18 nuts | 17, 18, 19 | 18 | Recounting crowded objects; spread into two ten frames. |

**Completion feedback:** «Danke! Jetzt weiss ich, wie viele Nüsse hier sind.» Render any stated quantity from the actual answer. Selecting an answer should not be blocked by an arbitrary requirement to tap every object. Record answer, help and arrangement; do not infer a mental counting strategy from taps alone.

## SOUND-01 — Reimzirkus (Reading)

**Initial host:** Blaumeise; reusable by other Reading hosts. **Goal:** read familiar written words and recognise a rhyme. **References:** D.2.A.1.b; supporting rhyme listening D.1.A.1.b. The legacy ID is retained for compatibility, not as a separate Sound category. Use the original game's word-and-picture presentation from `js/screens/adventure.js` and `js/learn/adventures.js`.

Show a large written target with a picture, and two written, pictured choices. The single **Spiel erklären** button says «Lies die Wörter. Was reimt sich?» on request. There is no automatic speech or individual word-audio control. Keep the writing visible. Picture matching alone cannot prove reading; this playful task combines reading exposure with rhyme recognition.

**Worked example:** «Haus → Maus», with visible written words and pictures; speak both and explain the shared ending. This familiar approved demonstration is retained in the disposable review. Before release use a reviewed scored pool excluding the demonstrated pair.

| Task | Written target | Written/pictured choices | Correct |
| --- | --- | --- | --- |
| 1 | Haus | Maus, Baum | Maus |
| 2 | Tisch | Fisch, Hut | Fisch |
| 3 | Bein | Stein, Boot | Stein |
| 4 | Kuh | Schuh, Ball | Schuh |
| 5 | Maus | Haus, Hut | Haus |

Shuffle positions once per task and retain them after retries. One tap submits. Replay the pair as a requested hint; log that support. Fixed picture names must match the written words. No ambiguous alternatives or abstract Traum/Stall picture naming is required in this fixture. These five specimens repeat the Haus/Maus pair intentionally; a release pool needs at least 15 reviewed distinct tasks and should avoid immediate reversed-pair repeats.

## READ-02 — Lies und zeig (Reading; replaces initial STORY-01)

**Initial host:** Waldkauz; reusable by other Reading hosts. **Goal:** slowly decode a very short sentence and connect it to a clear action picture. **References:** D.2.A.1.b; D.2.B.1.b for supported sentence meaning. This is an easier replacement for narrated three-card sequencing and for revision-9 spatial sentences, not another difficulty level.

«Lies den Satz. Tippe auf das passende Bild.» The target stays visible. Use exactly two large pictures and three-word sentences with familiar nouns and verbs. Do not begin with location/preposition contrasts, nested clauses, negatives, a third distractor or several events. Do not automatically read the target through the instruction speaker. Let the child take unlimited time; optional syllable support changes the presentation, not the level.

**Separate worked example:** «Die Maus schläft.» Show and narrate a sleeping mouse, explaining the match. This sentence is excluded from the scored fixtures below.

| Task | Written sentence | Picture choices | Correct |
| --- | --- | --- | --- |
| 1 | Die Maus sitzt. | Mouse sitting / mouse running | Sitting |
| 2 | Der Vogel fliegt. | Bird flying / bird perched | Flying |
| 3 | Die Maus rennt. | Mouse running / mouse sitting | Running |
| 4 | Der Vogel sitzt. | Bird perched / bird flying | Perched |
| 5 | Der Fisch schwimmt. | Fish swimming / mouse running | Swimming |

Pictures must distinguish actions, especially sitting versus running; motion lines alone may be insufficient and need child review. Same-subject alternatives on four tasks make the verb meaningful. Task 5 is a gentle confidence task, not evidence of close sentence reading by itself. Shuffle positions independently; retries preserve position and sentence. One picture tap submits and success advances automatically. Whole-sentence audio, if explicitly requested as help in production, is answer-revealing support and must be logged accordingly. No timer, oral retelling requirement or story-order memory test.

**Feedback:** «Das passt zum Satz. Danke fürs Lesen!» Long sentences and story sequencing remain optional later designs with separate objectives and review.

## SPACE-01 — Welche Form fehlt? (Mathematics)

**Initial host:** Biber; reusable by other Mathematics hosts. **Goal:** recognise a basic shape in a familiar pictured object. **Reference:** supports MA.2.A.1.a basic shape vocabulary; feedback names the selected shape. This introductory exercise does not assess the full naming step, solids, geometric composition or all first-grade geometry.

«Welche Form passt in die Lücke?» Show a house or cart with one outlined gap and three shape cards. Tapping a card submits immediately and a correct shape fills the gap. There is no grid-coordinate selection, rotation or drag requirement. Use consistent orientation and proportions. Decorative colours cannot identify the answer.

**Worked example:** A triangular roof is missing. Show selecting the triangle and inserting it. The current fixture repeats a roof item; before release use a separate reviewed example object excluded from the scored pool.

| Task | Missing part | Choices | Correct |
| --- | --- | --- | --- |
| 1 | House roof | Circle, triangle, square | Triangle |
| 2 | Square window | Triangle, rectangle, square | Square |
| 3 | Cart wheel | Square, circle, triangle | Circle |
| 4 | Tall door | Circle, rectangle, triangle | Rectangle |
| 5 | Another roof | Square, triangle, circle | Triangle |

On error, leave the gap visible, mark the selected card gently and allow another choice. A hint traces the boundary; it does not silently choose. On success name the shape, e.g. «Das Dreieck passt.» This is a warm-up and may be easy for some 7–8-year-olds. Expand variation after review without adding a level menu. Shape composition/bridge construction remains a later separately specified Mathematics activity; it is no longer this initial puzzle's objective.

## READ-01 — Leseschatz

**Character:** Maus. **Goal:** connect letters into familiar short words; D.2.A.1.b. **Prerequisite:** the classroom has introduced the relevant letter–sound relationships. **One level:** one word and three pictures; no countdown.

«Ich möchte lesen lernen. Welches Bild passt zum Wort?» The single **Spiel erklären** button explains the controls on request, without pronouncing a scored target word. Demonstrations remain visual and use separate example content. Before the round, offer practice with introduced letters; adult content selection determines which approved words are in the pool, without adding difficulty levels.

**Example:** Show «Ast» and three pictures. Demonstrate blending and select the branch. This example introduces an extra letter only if A, s and t are in the selected letter set; otherwise use a separate reviewed word from that set.

| Task | Written target | Picture choices | Correct picture | Support |
| --- | --- | --- | --- | --- |
| 1 | Maus | mouse, house, hat | Mouse | Reveal syllable/letter support; do not label the pictures automatically. |
| 2 | Haus | house, rose, nose | House | Trace the graphemes visually. |
| 3 | Hut | hat, house, mouse | Hat | Show letter-by-letter blending visually, using a separate example. |
| 4 | Rose | rose, nose, hat | Rose | Mark Ro-se on request; avoid teaching letter names as blending sounds. |
| 5 | Nase | nose, mouse, rose | Nose | Mark Na-se on request and allow extra time. |

This sample requires A/a, E/e, H/h, M/m, N/n, O/o, R/r, S/s, T/t and U/u; check sounds and capitalisation against the introduced letter inventory. Picture labels are explanatory English here, not UI text. The current interface does not offer whole-word audio; its single explanation does not reveal the reading answer.

**Completion feedback:** A friendly visual acknowledgement and the word-picture match, without automatic speech.

## Content review gate

For every sample and added variant, review correct/incorrect choices, uniqueness, spoken wording, image recognisability, taught content and saved-state recovery. Keep authored content versioned so an update cannot silently change the answer in an active round. If a task becomes unavailable, explain and restart that task safely while retaining earned progress.

## Current screen specimens and content status

[Revision 9](visuals/review-v9.html) contains five introductory activities across two shared categories: counting and missing shapes under Mathematics; word reading, written rhyme pairs and easy sentence matching under Reading. The user endorsed the revised examples/category direction and requested a simpler Waldkauz start; the current sentence fixtures implement that request. This is user design feedback, not a teacher or child validation record.

The preview includes examples, retries, automatic advancement and pictured rewards. It is disposable and resets on refresh; production persistence/logging remain future implementation. Earlier revision-8 audio-only rhymes, story ordering and composition fixtures remain in frozen files for history only. They are not the initial release specification.

Before release: expand to at least 15 reviewed tasks per puzzle; separate scored tasks from demonstrations; validate letter inventory, verb-picture recognition, rhyme reading support and first-grade appropriateness. Do not treat sample success as curriculum mastery.


## Revision 10 handoff

Use the fixed-environment shop: colouring pages and pencils unlock at the drawing table; apple/bubble bath are bag consumables with short skippable sequences. No purchased furniture or placement mode. Preserve legacy save data safely. Switch to Codex implementation after this update is pushed; child testing follows the running build, and no teacher consultation/testing is required.
