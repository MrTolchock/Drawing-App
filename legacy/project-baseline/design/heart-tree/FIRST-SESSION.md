# The first session: a picture-and-voice walkthrough

> Design reference recorded during planning. Implementation and approval statements describe the stage when it was written. See the [current app notes](../../docs/HEART-TREE.md) and [design index](../README.md) for the present build.

Design material for a 6–7-year-old who cannot yet read. These cards are static references; no child observations have been collected. A separate [first local playable slice](../../../../design/archive/implementation-notes/PLAYABLE-SLICE.md) now uses the existing Musterzug content with the planned guidance and return flow.

## 1. Use this pack

- [Opening layout and camera](OPENING-LAYOUT.md)
- [Help, leaving and return state contract](OPENING-INTERACTIONS.md)
- [Current opening review packet](../../../../design/archive/reviews/OPENING-REVIEW.pdf)
- [Opening walkthrough in the selected original A, Painted woodland](painted-woodland-opening.png)
- [Chosen art direction](ART-DIRECTION.md)
- [Picture-only walkthrough cards — 13-page PDF](walkthrough-cards.pdf)
- [Adult overview](walkthrough-preview.png)
- [World and guidance storyboard](../../../../design/archive/storyboards/before-reading-storyboard.png)
- [Underlying non-reader design](BEFORE-READING.md)

Use one activity family per short walkthrough. Breaks and stopping are welcome. The child does not need to complete all of the material in one sitting.

The PDF has an adult cover followed by a demonstration and fresh attempts for each family. The child-facing area contains pictures and controls, with no written task instruction. Cover the small adult footer. The adult overview and answer key are for preparation; do not show them to the child as a puzzle screen.

These are deliberately simple diagrams for examining understanding. They retain the cream and forest-green palette and native woodland objects. The final app retains the selected watercolour identity.

## 2. The first forest visit

The opening gives a visible result after one short activity. Quantity and memory are separate reference checks for later introductions; they are not three consecutive tutorials before the first reward.

Use pattern completion as the working reference for the bridge introduction. It has one visible gap and a simple selection action. This is a design reference rather than a final assignment of the first learning activity.

| Moment | Show or do | Exact draft spoken line |
| --- | --- | --- |
| First touch | Fox is the large welcoming interaction; a gesture invites a touch | “Hallo! Komm mit.” |
| First movement | A hand demonstrates touching one path spot; the fox walks there | “Tippe auf den Weg.” |
| First neighbour | Beaver gestures at the unfinished crossing; Hare is visible nearby | “Die Brücke ist noch nicht fertig.” |
| Request | Beaver looks towards the fox and the gap | “Hilfst du mir?” |
| Activity introduction | Move into the flat pattern demonstration | “Schau, so geht’s.” |
| Fresh attempt | Show a new equivalent pattern with no answer cue | “Jetzt du. Wie geht es weiter?” |
| Return | Show one clear picture of Beaver and the place left behind as the primary return action | “Zurück zum Biber.” |
| World result | Return beside Beaver; the final plank is placed | “Jetzt ist der Weg frei.” |
| Use the change | Hare gestures from the garden side; the fox can cross | “Komm herüber!” |
| Continue | The wider loop becomes available; keep the next nearby invitation simple | “Im Wald warten noch mehr Nachbarn.” |

Keep the story at this scale for the first visit. Longer explanations of chapters, activity categories or the full library can wait until they are useful.

If Hare is visited first, she says “Der Biber braucht Hilfe bei der Brücke.” Her Beaver picture guides towards the same request. The existing route via the tree makes both neighbours reachable before repair.

The return action is picture-led. It must not depend on reading a “Weiter” or “Zur Lerninsel” label. Its exact styling remains part of the future interface implementation.

## 3. Shared guidance script

Before the first unfamiliar activity, point to and demonstrate the speaker control:

**“Hier hörst du es noch einmal.”**

A real tap on it should replay the relevant spoken instruction. On paper, the adult performs that response using the lines below. Explain the gesture through the demonstration rather than adding an unplanned verbal lesson.

Use these feedback lines consistently:

- Success: **“Das passt!”**
- A further attempt: **“Schau noch einmal.”**
- New independent example: **“Jetzt du.”**

Do not add a timer or deduct rewards for help. Asking for a demonstration is a normal part of learning. Give the child thinking time.

## 4. Pattern cards

### Demonstration — PDF page 2

Show leaf, nut, leaf, nut, empty place. The two picture choices are leaf and nut.

Say:

**“Schau, so geht’s. Blatt, Nuss. Blatt, Nuss.”**

Follow the repeating pairs with a finger, then point to the next leaf choice and the missing position:

**“Dann kommt das Blatt.”**

The arrow on this demonstration page is a teaching cue. It does not appear on the fresh attempts.

### Fresh attempt A — PDF page 3

Show nut, leaf, nut, leaf, empty place. Read only:

**“Jetzt du. Wie geht es weiter?”**

Wait for the child to point. Do not follow their gaze or point towards the live answer.

### Fresh attempt B — PDF page 4

Use another equivalent arrangement with wild strawberry and nut. Repeat the same short prompt if needed.

If help is requested, replay the separate demonstration or show the repeated unit. Do not simply indicate the answer on the fresh card.

## 5. Quantity cards

### Demonstration — PDF page 5

The upper group contains two individual hazelnuts. The lower cards contain one and two. Each nut drawing represents one object.

Say:

**“Wo sind gleich viele Nüsse?”**

Point to each nut in the upper group, then demonstrate matching with the two-nut answer card. The positions differ so the comparison concerns amount rather than an identical arrangement.

### Fresh attempts — PDF pages 6 and 7

Use the same prompt:

**“Wo sind gleich viele Nüsse?”**

The child chooses one lower group. No digit knowledge is needed for this reference interaction.

The quantity reference checks understanding of matching amounts. The current Zählgarten instead uses counted objects and numeric answer choices. Its [first question starts with zero](../../../../js/learn/learning.js#L49). Visible small groups introduce the operation in this walkthrough; an empty group and the symbol for zero need their own deliberate teaching step during the later review.

This is a proposed reference interaction, not a drop-in replacement or a claim that the existing counting activity has been redesigned.

## 6. Missing-object cards

The object set is an oak leaf, one hazelnut and a wild strawberry. Acorn and stone pictures are used as alternative answers. This reference content is illustrative; final memory question banks and distractors remain for the later puzzle review.

### Demonstration — PDF pages 8 and 9

1. Show page 8. Say **“Schau dir alles an.”**
2. Let the child look.
3. Demonstrate the basket control: **“Bereit? Tippe auf den Korb.”**
4. Remove the LOOK page before showing page 9.
5. Say **“Was fehlt?”**
6. Demonstrate the correct picture on this practice page.

The child controls when hiding happens. The LOOK page must not remain visible beside HIDDEN: that would change the task.

### Fresh attempt A — PDF pages 10 and 11

Show LOOK, wait for the child to indicate readiness with the basket, remove it, then show HIDDEN. Use the same spoken lines.

The three choices include new alternatives, so the child needs to remember what was originally present. Do not name the missing item in the instruction.

### Fresh attempt B — PDF pages 12 and 13

Repeat with the new arrangement.

Teach the eye control during the demonstration. If the child uses it, show the matching LOOK page again. The basket then returns to the same HIDDEN state. This is available help, not a penalty.

The current activity uses [written hide and look-again labels](../../../../js/screens/expedition.js#L40). Its existing self-paced structure can be retained while introducing picture controls and speech.

## 7. Adult-only card key

This table is preparation material. Never print it into the child-facing screens.

| PDF page | Card | Correct response |
| --- | --- | --- |
| 1 | Adult cover | Keep out of the child’s view |
| 2 | PATTERN-DEMO | Leaf; left answer |
| 3 | PATTERN-TRY-A | Nut; right answer |
| 4 | PATTERN-TRY-B | Wild strawberry; left answer |
| 5 | QUANTITY-DEMO | Two nuts; right answer |
| 6 | QUANTITY-TRY-A | Three nuts; left answer |
| 7 | QUANTITY-TRY-B | Two nuts; right answer |
| 8 | MEMORY-DEMO-LOOK | Look first; basket advances to page 9 |
| 9 | MEMORY-DEMO-HIDDEN | Oak leaf; left answer |
| 10 | MEMORY-TRY-A-LOOK | Look first; basket advances to page 11 |
| 11 | MEMORY-TRY-A-HIDDEN | Hazelnut; middle answer |
| 12 | MEMORY-TRY-B-LOOK | Look first; basket advances to page 13 |
| 13 | MEMORY-TRY-B-HIDDEN | Wild strawberry; right answer |

The [manifest](walkthrough-manifest.json) records the card contents and page order for future authoring. It is not a child-facing interface.

## 8. What to observe

Use neutral prompts only when needed:

- “Was würdest du jetzt machen?”
- “Zeig mir, was du machen würdest.”
- After showing the bridge result: “Was hat sich verändert?”

Do not require a detailed verbal explanation. Pointing or an intentional gesture can show understanding.

Separate these observations:

| Observation | Independent | After planned help | Needed an extra adult explanation | Notes |
| --- | --- | --- | --- | --- |
| Recognises the visible goal or missing part |  |  |  |  |
| Attempts the intended gesture or control |  |  |  |  |
| Understands which picture area supplies the answer |  |  |  |  |
| Finds the taught replay control |  |  |  |  |
| Understands the basket and eye states, where relevant |  |  |  |  |
| Recognises the relevant feedback |  |  |  |  |
| Connects the puzzle result with the repaired bridge |  |  |  |  |

Record answer accuracy separately from this table. An incorrect answer can still show that the child understood the action and goal. A correct answer alone can be a guess.

Use these interpretation rules:

- If the child identifies the goal and uses the intended action but finds the learning challenge hard, review the activity level or support.
- If the child cannot identify where or how to act, revise the explanation, demonstration or layout.
- If the adult repeatedly needs new words beyond the script, revise the planned script.
- If the child uses taught help and continues, record that supported route honestly.
- If only a highlighted demonstration is understood, keep examining fresh attempts before assuming the interaction is learned.

## 9. What this pack establishes

The cards make the design concrete enough for a picture-and-voice walkthrough. Their counts, example answers and page order have been checked, and the quantity and hidden-object layouts have been visually inspected.

No child comprehension results have been collected. Paper cannot validate actual touch targets, animation timing, audio playback, return transitions or walking. An interactive prototype and observation on the intended device are later steps.

The card examples are not a full pedagogical review, a new released activity library or the prototype's question bank. The separate first slice reuses the existing Musterzug generator.

## 10. Next work

Observe a walkthrough when children are available, then revise the instruction, demonstration or input as the observations warrant. Continue reviewing the beginner interaction contracts for other activity families while preserving the separate later deep dive on question content.

The first Three.js slice now contains the short world opening, existing pattern activity with separate visual guidance and available device narration, pictured return and usable bridge payoff. Observe it on the intended device before calling its guidance ready for independent use.
