# Activity guidance readiness

> Archived design/review note. Implementation and approval statements describe the stage when it was written. See the [current app notes](../../docs/HEART-TREE.md) and [design index](../README.md) for the present build.

All 22 named groups in the current hub are accounted for below. This is a source-informed instruction and interaction review, not a certification of exercise correctness, native-species content or child usability.

**Every group still needs review of its actual guidance and observation with children.** “Candidate” means a plausible route after the described work. It does not mean the current activity is ready for independent use by a non-reader.

## Reading the matrix

Keep the learning target separate from understanding the controls. Numerals, letter formation and printed-word decoding may be learning targets. A written instruction, button label or hint should not be an additional gate.

- Visual and quantity activities can be candidates with spoken and demonstrated guidance.
- Auditory activities need the target sounds or words, not only narrated instructions.
- Reading and letter activities need a policy for what may be spoken without answering the task.
- The beginner story has a complete route that does not require printed-word decoding.
- Difficulty, instruction support and story chapter remain independent.

| Activity | Current interaction | Guidance still needed | Reading/audio policy and route |
| --- | --- | --- | --- |
| Zählgarten | Tap countable objects, then choose a number | Demonstrate counting once per object and what the number cards mean; introduce zero explicitly | Speak the instruction; number recognition is a learning prerequisite, not reading prose. Candidate with quantity/numeral support. |
| Znüni-Rechnen | Choose a numeric answer beside object groups and equation | Show one combining or removing example; make + and − meaningful before relying on them | Read the operation if needed without giving the total. Candidate when the number concept fits. |
| Musterzug | Choose a pictorial next item | Show a separate repeating unit and a fresh arrangement; teach new rule variants when needed | Short instruction; no reading target. First-slice candidate, pending observation. |
| Naturdetektive | Choose an image or labelled answer | Speak the question and ensure every answer is understandable pictorially; review text-heavy habitat choices | Spoken question is essential guidance. Candidate after prompt/choice review. |
| Leseschatz | Select or manipulate printed language with picture support | Explain the action orally; review Silben-Puzzle, Wort und Bild, Silben-Ballone and Lies genau separately | Do not automatically pronounce the printed target when decoding it is the task; assisted practice is a separate policy. Reading is a learning target; optional for the pre-reader story route. |
| Schreibspuren | Trace from a visual start using the displayed model | Retain the model and start cues; demonstrate one stroke and the finish action | Naming the symbol can support formation; prose reading unnecessary. Candidate for symbol-formation learning. |
| Zahlenwege | Connect the next numbered point | Demonstrate the gesture and next-point cue; number recognition remains part of the target skill | Speak the rule and appropriate number support. Candidate when numerical sequencing is appropriate. |
| Sternenrakete | Tap empty places and confirm | Show filling and undoing one place; replace a written start instruction with demonstrated action | Speak the goal; exact numeral support depends on stage. Candidate after instruction/control support. |
| Waldpicknick | Tap plates to distribute, undo and check | Demonstrate one item going to each plate and how to undo; show the remaining group | Speak the sharing goal; text labels are additional. Candidate after a concrete sharing example. |
| Zauberzwillinge | View equal groups and choose a total | Demonstrate what both equal groups mean; support numeric choices appropriately | Speak the question, not the computed result. Candidate when the number concept fits. |
| Formenwerkstatt | Choose a drawn shape | Use a spoken target and separate example; review each mode so a hint does not silently answer the live task | Spoken shape/property prompt; no prose reading needed. Candidate after mode-specific guidance. |
| Reimzirkus | Choose among currently written words | Provide recognisable choices and pronounce target/options; demonstrate a different rhyming pair | Hearing words is the learning content; sound is required for this route. Auditory activity; needs speech/choice adaptation. |
| Silbentrommel | Tap drum beats, undo and check | Speak the pictured word; demonstrate beats on another word and the undo control | Spoken word is part of the activity; avoid relying on reading it. Auditory activity; needs word recordings and demo. |
| Roboterpost | Arrow taps move the robot immediately; reaching the goal succeeds | Demonstrate the goal, a legal arrow move and undo; distinguish this flat arrow interaction from world walking | Short spoken direction guidance. Candidate after a route-control demonstration. |
| Was kommt dann? | Tap cards into a sequence and check | Show a separate two-step example, visible sequence positions and reset | Narrate the situation; choices need picture support. Candidate after picture-card review. |
| Waldschatz | Look, choose when to hide, select an answer; look again is allowed | Teach basket/hide and eye/look-again separately; preserve the same trial when replaying | Speak the phases without naming the missing answer. Candidate after state-control guidance. |
| Nachbarhäuser | Choose an active house then assign numbers | Demonstrate one house at a time and the active slot; replace dependence on written before/after labels | Speak the rule; number ordering is the target skill. Candidate when number ordering fits. |
| Beerenvergleich | View groups and choose a labelled relation | Make the selectable relation pictorial and demonstrate equality separately | Speak more/less/equal; do not require reading left/right labels. Candidate after relation-choice adaptation. |
| Spiegelmosaik | Toggle cells, undo, clear and check | Demonstrate an asymmetric example across the visible mirror line; show toggling and check controls | Speak one action at a time; pictures carry the spatial rule. Candidate after reflection demonstration. |
| Rechenfreunde | Compare equations and optional object support; choose a number | Demonstrate the specific transformation; keep quantity support available appropriately | Speak the operation when useful; preserve the computation as the task. Candidate when the number concept fits. |
| Vokalversteck | Choose a letter for a pictured incomplete word | Speak the pictured word where intended; teach the missing-letter action on another item | Pronouncing the word may be valid support; spelling or naming the missing letter would answer it. Letter/orthographic target; optional for the initial story route. |
| Waldumfrage | Read a pictorial chart and choose a number/category | Teach one mark as one vote; introduce count, most/least, total and difference as distinct variants | Speak the selected question; category pictures identify what to inspect. Candidate after chart-mode guidance. |

## Beyond these 22 groups

The 24 creative missions currently include written steps and adult-reading language. Give a child one pictured and spoken step at a time, show how to enter the relevant drawing tool, and retain child-controlled completion. Mark any mission that genuinely involves an adult as such in its authoring record and preview.

Free painting and colouring need demonstrations of unfamiliar tools. Dice, number, syllable and colour-word modes have different learning targets; assess them separately. An instruction can be spoken while a colour word being tested remains a reading target.

Saved pictures, sticker collections, replay, return and challenge selection also need picture-led controls introduced in context.

## Evidence and limits

The review used existing metadata, generators and screen controls. In particular:

- Counting starts at zero in the current generator.
- The stage-one pattern uses two alternating symbols and four to six given positions.
- Roboterpost currently moves on each arrow tap; it is not a queued program requiring a separate run action.
- The memory screen currently uses written hide/look-again labels.
- The current sound module contains effects but no speech.
- Leseschatz contains four modes requiring separate target-audio policies.

These findings determine guidance work. They are not an individual question-bank review.

The machine-readable [CSV](ACTIVITY-READINESS.csv) includes source references for all groups. Existing activity IDs and progress keys remain unchanged until implementation work is explicitly begun.

## Authoring completion criteria

For each activity or materially different rule version, supply a visible goal, short spoken action, separate demonstration, fresh attempt, replay behaviour, safe exit and appropriate feedback. Record the learning prerequisite, audio requirement and which target material may be spoken.

An activity enters the recommended beginner route after this material is reviewed and its interaction is observed. Other learning activities remain available with appropriate support and level choice; the story does not force a child into a reading target before readiness.

[First-session walkthrough](FIRST-SESSION.md) · [Non-reader design](BEFORE-READING.md)

