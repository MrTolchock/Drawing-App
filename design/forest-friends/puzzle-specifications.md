> Shared visual rule: [den-led art direction](visuals/art-direction.md). Outdoors, den and shop use 3D; learning puzzles use 2D.

> Latest interaction decisions: [Design revision 7](visuals/revisions/v7.md) supersedes earlier check-to-submit, owl-help and shop-layout proposals. The single difficulty level and curriculum requirements remain.

# Initial puzzle specifications

**Status:** Reviewable design drafts, 7 November 2026. No gameplay implementation. Curriculum mappings and prerequisites are in [the matrix](curriculum-matrix.md). First-grade teacher and child review remain outstanding.

## Shared round behaviour

Use one difficulty level, five scored tasks and a separate worked example. No timer, lives, resource deductions or penalty for help. A child can replay the example or leave at any time. First visits show the example; later visits offer it through the demonstration button.

Objects can be selected and placed by tapping as well as dragging. Keep choices editable until the child presses the pictured check button. Its accessible name is «Antwort prüfen»; demonstrate its action and use spoken guidance instead of requiring a written label. Wrong answers preserve the scene, show a gentle retry cue and speak an invitation to try again: «Schau noch einmal. Du kannst es ändern.» Show a specific clue when requested rather than immediately supplying the answer. A correct answer gets a visible and spoken in-scene response and an explicit pictured next action. All quoted child-facing instructions and feedback below are spoken scripts, not required reading. Five completed tasks produce one round reward. Corrections and hints do not reduce it.

Save the round ID, puzzle/content version, generated task IDs, task order, current task, object placements/selections, completed tasks, attempts, help state and reward transaction ID. Returning to an interrupted round shows a resume invitation; it does not roll a new puzzle. Refresh restores the current task. Developer skip is logged and never counted as a correct child answer.

A task pool has at least 15 reviewed items or valid generated variants per puzzle before public release. Use five distinct tasks per round; do not repeat the previous round's exact set when the approved pool permits another. Sample tasks below are specification fixtures, not a sufficient release pool. Generation must preserve valid answers and content boundaries. Positions are shuffled independently of correctness.

## NUM-01 — Zählgarten

**Characters:** Eichhörnchen and, when introduced, Hase. **Goal:** count and connect a collection to its numeral; MA.1.A.2.a. **Prerequisite:** recognise the offered numerals. **One level:** 0–20 objects with optional five/ten frames. No timed quantity recognition.

Eichhörnchen: «Ich sammle Nüsse für den Winter. Wie viele sind hier?» Hase uses the same rules with carrots and a picnic story.

**Example:** Show three nuts. The demonstration taps them once each, moves them into a counting row and chooses 3. Say «Jede Nuss zählt einmal. Es sind drei.» The example never becomes one of the scored tasks.

**Interaction:** Child marks or unmarks each object, optionally arranges them into a frame, then chooses among three numeral cards and checks. Mark counts can be hidden while retaining counted-object marks; do not require marking if the child already recognises the quantity. The numeral cards must not be ordered by correctness.

| Task | Collection | Numeral choices | Correct answer | Likely error and useful hint |
| --- | --- | --- | --- | --- |
| 1 | Empty basket | 0, 1, 2 | 0 | Counting the basket; «Im Korb ist keine Nuss.» |
| 2 | 4 scattered nuts | 3, 4, 5 | 4 | Missing/double-counting; offer one mark per nut. |
| 3 | 7 nuts | 6, 7, 8 | 7 | Losing count; offer a row of five and the rest. |
| 4 | 12 nuts | 11, 12, 13 | 12 | Losing the second ten; offer ten plus two. |
| 5 | 18 nuts | 17, 18, 19 | 18 | Recounting crowded objects; spread into two ten frames. |

**Completion feedback:** «Danke! Jetzt weiss ich, wie viele Nüsse hier sind.» Render any stated quantity from the actual answer. Selecting an answer should not be blocked by an arbitrary requirement to tap every object. Record answer, help and arrangement; do not infer a mental counting strategy from taps alone.

## SOUND-01 — Reimzirkus

**Character:** Blaumeise. **Goal:** recognise a rhyme by hearing word endings; D.1.A.1.b. **Prerequisite:** understand the pictured words. **One level:** one spoken target, three spoken pictured choices, exactly one rhyme.

«Für mein Lied fehlt ein Reim. Hör gut zu!» Every picture has a replay button with a fixed spoken label. No written answers are required. Ambient birdsong pauses during word playback.

**Example:** Speak «Haus», then label Maus, Baum and Ball. Demonstrate selecting Maus: «Haus und Maus klingen am Ende gleich.»

| Task | Target | Choices | Correct answer | Hint |
| --- | --- | --- | --- | --- |
| 1 | Ball | Stall, Baum, Fisch | Stall | Replay Ball and Stall, stressing the shared ending naturally. |
| 2 | Tisch | Fisch, Haus, Kuh | Fisch | Replay the target, then each choice with the same speaking pace. |
| 3 | Bein | Stein, Boot, Maus | Stein | Draw attention to the end of the word, not its first sound. |
| 4 | Kuh | Schuh, Ball, Tisch | Schuh | Use the fixed label Schuh; do not alternate with Stiefel. |
| 5 | Baum | Traum, Fisch, Bein | Traum | Use a clear dream-bubble picture with the spoken label Traum. |

The example rhyme is excluded from this sample round. Child review must check whether Stall and Traum are understood; replace confusing pictures/words after review. Reject pools with alternative correct rhymes, identical target answers or inconsistent audio. Wrong attempts can replay the pair. Final help may demonstrate the answer and records that support. Reward remains unchanged.

**Completion feedback:** Blaumeise sings a short phrase with the solved rhyme, then «Danke für die Reime!» This is an authored sound, not a live generated song.

## STORY-01 — Mixed-up stories / Bildergeschichte

**Character:** Waldkauz. **Goal:** follow an audible narrative and reconstruct its events; D.1.B.1.b. **One level:** three spoken sentences and three scene cards. Reading is optional; the spoken story determines the answer.

«Meine Bilder sind durcheinander. Hör meine Geschichte und ordne sie.» The cards have no printed sequence numbers. The three slots have left-to-right arrows; the example teaches this layout.

**Example:** «Ich nehme ein Buch. Dann setze ich mich auf den Ast. Dort lese ich.» Demonstrate book → branch → reading. The scene remains visible while replaying, with no countdown or forced memory delay.

| Task | Full spoken story | Correct scene order | Likely mix-up and hint |
| --- | --- | --- | --- |
| 1 | «Ich hole eine Tasse. Dann fülle ich Wasser ein. Zum Schluss trinke ich.» | Take cup → fill → drink | Drink before filling; replay «Dann fülle ich Wasser ein.» |
| 2 | «Ich sammle Blätter. Dann lege ich sie ins Körbchen. Zum Schluss trage ich das Körbchen heim.» | Gather → basket → carry home | Basket/carry swap; replay the middle sentence. |
| 3 | «Zuerst läute ich die Glocke. Dann winke ich Maus. Zum Schluss öffne ich das Buch.» | Bell → wave → book | Plausible alternative sequences; replay the complete story. |
| 4 | «Ich öffne die Kiste. Dann lege ich mein Tuch hinein. Zum Schluss schliesse ich die Kiste.» | Open → put cloth in → close | Open/close confusion; highlight the relevant action in replay. |
| 5 | «Zuerst zeichne ich einen Stern. Dann klopfe ich an die Tür. Zum Schluss schenke ich Fuchs das Bild.» | Draw → knock → give | Giving before visiting; replay the last sentence. |

Drag or tap cards into slots, swap and undo, then check the whole arrangement. Card art must distinguish each action. Do not auto-place correct cards before submission. Task 3 makes comprehension of the narrated order necessary even where everyday reasoning cannot determine it. A correct arrangement practises this part of listening comprehension; it does not establish oral retelling.

**Completion feedback:** «Jetzt stimmt meine Geschichte wieder. Danke fürs Zuhören!» Waldkauz is warmly grateful, never mocked for confusion.

## SPACE-01 — Formenwerkstatt

**Characters:** Biber, Fisch and Eisvogel when introduced. **Goal:** compose figures from pieces; the composition part of MA.2.A.2.b. **One level:** two or three pieces, supplied in the needed orientation. No rotation control for this first puzzle.

Biber: «Hilfst du mir, die Teile zusammenzusetzen?» The activity builds pictured bridge components on a flat workbench. Fisch can assemble pond mosaics and Eisvogel a lookout sign using identical geometry rules.

**Example:** Two 1×1 squares fill a 2×1 plank outline. Demonstrate selection, placement, undo and check. One unit is a visible grid cell; units below define artwork, not child-facing measurements.

| Task | Target and provided pieces | Correct arrangement |
| --- | --- | --- |
| 1 | 2×1 rectangle; two 1×1 squares | Squares side by side |
| 2 | 1×2 rectangle; two 1×1 squares | Squares above one another |
| 3 | 3×1 rectangle; three 1×1 squares | One horizontal row |
| 4 | 2×2 square; two 2×1 rectangles | Two horizontal rows |
| 5 | L outline: occupied cells (0,0), (1,0), (0,1); one 2×1 rectangle and one 1×1 square | Rectangle across upper row; square below its left cell |

Allow removal and swapping. Accept any complete non-overlapping solution using all supplied pieces, including permutations of identical pieces. Colour is decorative and must not reveal placement. A hint traces the target boundary or offers a ghost of one piece; it does not silently complete the task. Misplaced pieces remain editable on the workbench. The check identifies gaps or overlaps gently. Exact position tolerance is a usability detail to determine in the mockup.

**Completion feedback:** «Die Teile passen zusammen. Danke!» These are repeatable workbench tasks. Restoring a physical bridge is a separate story event, not repeated after every round.

## READ-01 — Leseschatz

**Character:** Maus. **Goal:** connect letters into familiar short words; D.2.A.1.b. **Prerequisite:** the classroom has introduced the relevant letter–sound relationships. **One level:** one word and three pictures; no countdown.

«Ich möchte lesen lernen. Welches Bild passt zum Wort?» Narrate the instruction and demonstrate the controls, but do not automatically pronounce a scored target word. Before the round, offer practice with introduced letters; adult content selection determines which approved words are in the pool, without adding difficulty levels.

**Example:** Show «Ast» and three pictures. Demonstrate blending and select the branch. This example introduces an extra letter only if A, s and t are in the selected letter set; otherwise use a separate reviewed word from that set.

| Task | Written target | Picture choices | Correct picture | Support |
| --- | --- | --- | --- | --- |
| 1 | Maus | mouse, house, hat | Mouse | Reveal syllable/letter support; do not label the pictures automatically. |
| 2 | Haus | house, rose, nose | House | Trace the graphemes and offer sounds on request. |
| 3 | Hut | hat, house, mouse | Hat | Offer separate phonemes then blending, with reviewed audio. |
| 4 | Rose | rose, nose, hat | Rose | Mark Ro-se on request; avoid teaching letter names as blending sounds. |
| 5 | Nase | nose, mouse, rose | Nose | Mark Na-se on request and allow extra time. |

This sample requires A/a, E/e, H/h, M/m, N/n, O/o, R/r, S/s, T/t and U/u; confirm sounds and capitalisation with the teacher. Picture labels are explanatory English here, not UI text. Requested whole-word audio is a teaching aid: log it as answer-revealing support. After it, completion earns the same resource but cannot count as an independent reading response.

**Completion feedback:** «Danke! Wir haben zusammen gelesen.» Replay of a completed word can pronounce it and show the word-picture match.

## Content review gate

For every sample and added variant, review correct/incorrect choices, uniqueness, spoken wording, image recognisability, taught content and saved-state recovery. Keep authored content versioned so an update cannot silently change the answer in an active round. If a task becomes unavailable, explain and restart that task safely while retaining earned progress.
