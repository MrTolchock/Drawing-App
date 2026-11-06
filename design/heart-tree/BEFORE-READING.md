# Understand before reading

> Design reference recorded during planning. Implementation and approval statements describe the stage when it was written. See the [current app notes](../../docs/HEART-TREE.md) and [design index](../README.md) for the present build.

Audience requirement for Farbtupf — Der Herzbaum: children aged 6–7, initially unable to read.

Concept work only. No application or exercise has been changed, and this design has not yet been observed with children.

## 1. The central requirement

**The child must understand the goal, action and feedback without reading instructions.**

Understanding the task and solving it are separate. A child can understand that a missing pattern item is needed while still finding the pattern difficult. Difficulty in the learning task is appropriate; uncertainty about what a button or instruction means needs design attention.

Reading ability, subject difficulty and forest chapter are independent. A child can need spoken instructions while handling a more advanced number task. The story must have a complete route that works before reading.

Choose and remember challenge levels per activity family, with the existing global stage as an initial default. Keep instruction support available independently of that choice.

## 2. Current gap in the application

A read-only inspection found:

- The [sound system](../../js/core/sound.js#L1) synthesises sound effects and currently has no speech.
- [Learning prompts](../../js/screens/learn.js#L19) and [hints](../../js/screens/learn.js#L60) use written text.
- [Adventure](../../js/screens/adventure.js#L133) and [expedition](../../js/screens/expedition.js#L147) screens also present written prompts and hints.
- Reading activities intentionally test reading and have their own visual support.
- Tracing and dot-to-dot already contain visual guidance that can be retained and developed.

Keeping puzzles flat is compatible with adding the guidance they need. Some activities will need pictorial prompts or choices as well as narrated instructions. A general read-aloud button alone does not establish that the task is understandable.

Individual exercise content remains for the later review. Beginner comprehension is now an entry requirement for story placement.

## 3. See it, hear it, try it

| Stage | What the child receives | Design purpose |
| --- | --- | --- |
| See the goal | A visible situation, target or missing part | Understand what needs to change |
| Hear one action | One short, concrete spoken instruction in Swiss Standard German | Understand what to do now |
| Watch an example | A brief visual demonstration on a separate practice item | See the rule and gesture |
| Try a fresh item | A comparable new example without an answer cue | Act independently |
| Ask again | A consistent replay/help control that has itself been demonstrated | Recover from uncertainty |
| See feedback | A piece fits, an object moves, a neighbour responds or a path changes | Understand the result |

Text can accompany this information for emerging readers and adults. It is not needed to operate the beginner route.

Instructions introduce one action at a time. Let the child act before introducing another step. Icons also need teaching: a speaker, arrow, tick or map symbol must not be assumed self-explanatory.

When a rule is familiar, the full demonstration can be shortened. Keep its replay available. Introduce another example when an activity’s interaction changes, rather than repeating a full tutorial for every new content pack.

## 4. Apply it to the opening

| Opening moment | Visible explanation | Spoken line |
| --- | --- | --- |
| Begin | A large fox interaction and a hand gesture invite the first touch | “Hallo! Komm mit.” |
| Walk | A hand touches a nearby path spot; a few footprints show movement | “Tippe auf den Weg.” |
| Meet Beaver | Beaver gestures towards the unfinished crossing; Hare is visible nearby | “Hilfst du mir?” |
| Understand the activity | A short practice example shows the gesture and rule | “Schau, so geht’s.” |
| First independent attempt | A fresh example appears, with only the relevant controls visible | “Jetzt du.” |
| Ask for help | A taught speaker/character control repeats the instruction or demonstration | “Schau noch einmal.” |
| Return and use the result | The same crossing is completed and the fox walks across | “Jetzt können wir hinüber!” |

The first touch can also establish the interaction needed for audio playback on the device. The real implementation must respect mute preferences.

The gap in the crossing, the two neighbours and the completed bridge explain the story through action. A written quest description is additional information.

The final activity selection for this quest remains open for the puzzle review. The storyboard uses a pattern activity to illustrate guidance, not to specify a new exercise or approve the current activity’s content.

## 5. Three reference interactions in the walkthrough pack

These are representative checks, not alternatives for the user to choose.

The [first-session script](FIRST-SESSION.md) and [picture-only cards](walkthrough-cards.pdf) make these interactions concrete. They are reference material for examining comprehension, not final replacements for the current exercises. Use one family at a time.

### Quantity

Use clearly separated countable objects. Demonstrate touching each object once. If recognising a digit is a learning target, introduce the symbol deliberately; otherwise an early quantity task can use picture groups.

Possible short instructions: “Tippe jede Nuss einmal an.” or “Wo sind gleich viele?”

Check whether the child understands what to count, what can be touched and what the answer cards represent. Number recognition must not be silently treated as an interface skill already mastered.

### Pattern

Show one missing position and a small set of picture choices.

Demonstration: leaf, nut, leaf, empty place → nut.\
Fresh try: nut, leaf, nut, empty place → child chooses.

Possible instruction: “Wie geht es weiter?”

The demonstration uses different material or an equivalent different arrangement from the independent attempt. Help can repeat the rule without pointing to the live answer.

### Memory

Let the child look at the objects for as long as desired. Demonstrate the hide/reveal action, then show picture answers for the missing item.

Possible instruction: “Schau gut hin.” followed by “Was fehlt?”

A new practice configuration checks that the child understands the interaction rather than repeating a demonstrated answer. The actual memory task remains untimed.

These examples use the approved Swiss-native visual palette. They do not redesign or certify the existing activities.

## 6. Guidance and feedback

- Use large, forgiving interaction targets and calm layouts.
- Keep one immediate action in focus.
- Show a mistake through a gentle reversible response and, if useful, a short encouraging line.
- Let success change the relevant object or scene, with sound as additional feedback.
- Keep colour, motion and object position meaningful; colour alone should not carry the full message.
- Make help repeatable without reducing rewards.
- Give thinking time. A pause need not trigger another explanation or reveal the answer.
- Preserve the current task when the child asks for help.
- Use the same return and replay meanings across activities, and introduce them in context.
- Keep long descriptions and technical details in the parent or author view.

Assistance can support learning and story completion. It must not be presented as proof of unaided mastery.

## 7. Reading as a learning goal

A reading task can ask the child to read; its explanation still needs to be understandable before reading.

For example, a spoken instruction can explain matching a word to a picture. Automatically speaking the target word or all written choices may change what the activity tests. Each reading activity needs a deliberate policy for which content may be spoken.

Word-learning or phonological activities can intentionally include spoken target words when hearing them is part of the learning goal. Assisted reading practice can provide more support, with that help represented honestly.

The main forest story must offer suitable picture- and voice-led activities. Reading activities remain available for learning, with their own appropriate support and level choice.

## 8. Sound and offline guidance

Beginner instruction speech becomes standard when audio is enabled. It is separate from optional music and decorative sound effects.

Use short local recordings in Swiss Standard German, cache required guidance for offline use, avoid overlapping voices, lower other sounds during instruction and allow immediate replay. Respect system and saved mute preferences.

Visual demonstrations must explain non-auditory activities when speech is unavailable. Some activities, such as hearing rhymes, have an auditory learning goal. They need sound or another suitable activity for the current story contribution; a silent animation cannot demonstrate that the child heard a rhyme.

A large library can share instruction and demonstration assets by activity family and interaction version. A new content pack usually needs context, while a genuinely new rule needs a new explanation.

No voice recordings have been produced and no speech integration is implemented at this stage.

## 9. Finding activities before reading

The child recognises a resident, landmark and activity preview.

- Local invitations use a character portrait and a picture of the small problem.
- An activity card shows a meaningful preview of what happens, such as a piece filling a gap.
- Opening an unfamiliar activity starts its explanation and demonstration.
- Labels can remain for emerging readers, but choosing an activity does not depend on reading its title.
- Browsing uses familiar places and demonstrated picture controls.
- Beginner recommendations offer activities with appropriate guidance; the full catalogue and freely selectable levels remain available.
- Keep one active goal and only a few nearby invitations visible.

Adult concept-board captions describe the plan. They are not a requirement to put written instructions into the child’s interface.

## 10. Activity metadata and author review

Add these requirements to every future activity record:

| Requirement | What the author must define |
| --- | --- |
| Visible goal | What the child can recognise as the intended result |
| Spoken instruction | A short, concrete line for the current action |
| Demonstration | How the rule and input gesture are shown |
| Guided practice | A separate example and a fresh independent attempt |
| Repeat/help | How the child asks again and what the help reveals |
| Reading target | Whether reading is the skill being taught or tested |
| Audio content policy | Which instructions and target content may be spoken |
| Audio requirement | Whether hearing sound is part of the learning goal |
| Picture support | Which prompts, choices and controls need pictures |
| Comprehension observations | Evidence from actual child walkthroughs or playtests |
| Interaction version | Which rule changes require a new demonstration |

Guidance cannot be inferred from a title or from the fact that pictures are present. New activities enter the beginner story route after their guidance has been reviewed and observed.

## 11. The next validation step

Prepare a picture-and-voice walkthrough of the opening and the three reference interactions. A paper walkthrough can use the exact planned spoken lines read by an adult; the adult should avoid adding extra explanations.

Prepared materials now include a 13-page card set, an adult-only answer key, exact draft speech and a blank observation sheet in [The first session](FIRST-SESSION.md). Pattern completion is the working reference for the first bridge introduction; quantity and memory are separate checks for later encounters.

Observe actual 6–7-year-olds when they are available. A later interactive prototype is needed to check movement, gestures, timing and recovery in the real experience.

Useful neutral prompts:

- “Was würdest du jetzt machen?”
- “Zeig mir, was du machen würdest.”
- After the payoff: “Was hat sich verändert?”

Record whether the child can identify the goal, attempt the intended action, recognise relevant feedback, find taught help and connect the puzzle result with the world change. Separate misunderstanding the rule from difficulty solving the learning task.

Revise the instructions, example or interaction when the child needs unplanned adult translation. The artwork alone does not demonstrate usability, and no observation results are claimed here.

## 12. Scope and deliverables

This changes the design’s priority: establish understanding of the first session before authoring a large catalogue or producing the full 3D forest.

- [Non-reader storyboard](../archive/storyboards/before-reading-storyboard.png)
- [First-session script and observation sheet](FIRST-SESSION.md)
- [Picture-only walkthrough cards](walkthrough-cards.pdf)
- [Adult overview of the reference cards](walkthrough-preview.png)
- [Main blueprint](BLUEPRINT.md)
- [Puzzle-library design](PUZZLE-LIBRARY.md)

The app remains unchanged. The next work is the comprehension walkthrough and subsequent activity review, with implementation still a later authorised step.
