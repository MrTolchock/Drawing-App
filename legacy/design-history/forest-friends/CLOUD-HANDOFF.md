> **9 November 2026 — visual overhaul handed to Claude Code.** The current design work is the [Waldbuch visual overhaul](../visual-overhaul/README.md): blueprint, mockups, 3D look-dev and progress checklist. Implementation continues with Claude Code (see the repository `CLAUDE.md`), not Codex.

> Implementation continuation: Forest friends now has a runtime entry at the repository root. See [implemented scope and save contract](../../docs/FOREST-FRIENDS.md) and the [first playable comparison](visuals/milestones/playable-loop-1/COMPARISON.md). Design documents below remain the target; runtime art differences and device/child testing are recorded separately.

> Current revision 10: purchases never alter the environment. No teacher testing is planned or required. Child testing happens after implementation, once the game is running. This replaces earlier pre-implementation external-review gates; internal curriculum source checks remain.

> Current design pass: [Revision 9](visuals/revisions/v9.md), viewed and updated in [Sites](https://forest-friends-design-review.andreas-itten.chatgpt.site/). This supersedes earlier puzzle-confirmation, wallet and camera-direction notes below; frozen visual references remain intact.

# Drawing-App — cloud conversation handoff

**Updated:** 7 November 2026.
**Repository:** [MrTolchock/Drawing-App](https://github.com/MrTolchock/Drawing-App), branch `main`.
**Phase:** Forest friends redesign and visual design. The implemented game is still the earlier Heart Tree experience. The user plans to take development forward with Codex after design.

This document carries the decisions and working context from a local design conversation into a new ChatGPT cloud project. It is a decision summary, not the original chat transcript. GitHub is the durable source for project files, artwork and visual references. A cloud chat should fetch current files rather than depend on Mac paths or a running localhost preview.

## Start here

1. [Blueprint v2](https://github.com/MrTolchock/Drawing-App/blob/main/design/forest-friends/blueprint-v2.md): current product outline and requirements.
2. [Curriculum matrix](https://github.com/MrTolchock/Drawing-App/blob/main/design/forest-friends/curriculum-matrix.md): official Zürich references, initial puzzle objectives and backlog.
3. [Puzzle specifications](https://github.com/MrTolchock/Drawing-App/blob/main/design/forest-friends/puzzle-specifications.md): worked examples, sample tasks, answer rules and help.
4. [Experience design](https://github.com/MrTolchock/Drawing-App/blob/main/design/forest-friends/experience-design.md): world topology, first-session flow and picture-led interface.
5. [Rewards and continuity](https://github.com/MrTolchock/Drawing-App/blob/main/design/forest-friends/rewards-and-continuity.md): prices, resources, save behaviour and local logs.
6. [Visual comparison baseline](https://github.com/MrTolchock/Drawing-App/blob/main/design/forest-friends/visuals/baseline.md): preserved design references and development comparison rules.
7. [Current visual review source](https://github.com/MrTolchock/Drawing-App/blob/main/design/forest-friends/visuals/review.html) and [art/screenshots](https://github.com/MrTolchock/Drawing-App/tree/main/design/forest-friends/visuals).

For existing runtime behaviour, read [Heart Tree baseline](https://github.com/MrTolchock/Drawing-App/blob/main/design/heart-tree/BLUEPRINT.md), [current gameplay](https://github.com/MrTolchock/Drawing-App/blob/main/docs/GAMEPLAY.md) and [development guide](https://github.com/MrTolchock/Drawing-App/blob/main/docs/DEVELOPMENT.md). The root README describes the shipped game, not the v2 proposal.

## Decisions and user preferences

- Primary goal: help children with first-grade school learning in Zürich. Zürcher Lehrplan 21 alignment is mandatory. Zyklus 1 is broader than first grade; choose suitable task ranges and prerequisites, and record exact references. Internal source/content review is still pending; do not claim approval or full curriculum coverage.
- Use Swiss Standard German in the game and German character names: Fuchs, Waldkauz, Eichhörnchen, Blaumeise, Maus, Biber, Hase, Igel, Reh, Fisch, Eisvogel. Design prose can remain English.
- There is **one difficulty level**. Earlier suggestions of two or three levels are superseded.
- Catalogue each puzzle on its own row. Use simple shared categories: Mathematics, Reading, Writing, Nature and Creativity. Several animals can share a category and introduce different activities inside it. Reuse puzzle rules across eligible hosts; never invent an animal-specific category. Precise competencies remain internal curriculum tags.
- Fuchs is a small orange fox with a green neckerchief. Home is a den beneath the central tree and acts as the playable menu: draw/colour, use a treat animation, sleep and go outside.
- Outside is a freely explorable 3D forest. Use Emberwick as a movement-feel reference, keeping this game's woodland identity. Each visit offers fresh tasks from the friend's competency. Interrupted tasks resume exactly.
- Blaumeise needs rhymes for songs; Eichhörnchen counts winter stores; Waldkauz reads very short messages with the child; Maus learns letters, syllables and reading; Biber builds from shapes.
- Friends give characteristic resources: nuts, logs, feathers, seeds, berries and later other types. Use pictured barter prices in the shop. Sell colouring pages/pencil palettes and repeatable apple/bubble-bath consumables; no environment placement.
- Furniture, wallet, owned items, drawings and interrupted puzzles must persist through refreshes, relaunches and normal updates. Preserve existing progress during migration. Development skips are separate from the child's save and rewards.
- Add subtle background music and forest ambience with replayable speech and saved audio controls. Mistakes and hints cause no resource loss, lives or mandatory countdown.
- The running version should log local movement, task attempts/errors, hints and active duration. Adults can export the log and manually upload it to AI for improvement. No automatic AI upload; keep logs anonymous and bounded.

## Latest visual feedback and preserved baseline

The user said the characters are great and the den is beautiful. Preserve those art directions. The user said navigation was too text-heavy because children usually cannot read.

The resulting version-2 interface uses direct object hotspots, pictured destinations, portrait-led visits, spoken directions, separate visual demonstrations, token prices and pictured feedback/confirmation. Written navigation prose is not required; the reading task retains its target word and number tasks retain numerals. Accessible German names remain. Unfamiliar symbols still need demonstration and child testing.

The baseline is tagged **`codex/forest-friends-visual-v2`**, created at commit `e6479ef`. Its original art, frozen `review-v1.html`/`review-v2.html`, eight screenshots, integrity manifest and comparison rubric are checked in. Do not overwrite the references to make development appear to match; create a new revision for a design change. At each development milestone, capture equivalent real-game states and record comparison results and intentional deviations. Run `python3 design/forest-friends/visuals/check-baseline.py` to verify reference integrity.

The review is a disposable screen prototype: scenes are generated illustrations, not a running 3D world; it has one counting and one reading specimen, a sample wallet and drawing/consumable rewards. Its refresh resets are not the intended production save behaviour. Post-implementation child testing, physical iPad testing, narration quality and production model/animation work remain outstanding.

## Suggested next design work

1. Review the picture-led v2 interface with the user and children, especially speaker/demo/help/check symbols and shop token exchange.
2. Create remaining character references for Eichhörnchen, Blaumeise, Biber and Maus and screen studies for written rhyme pairs, easy sentence reading and missing-shape recognition, following the endorsed art direction.
3. Expand initial puzzle content pools to at least 15 reviewed tasks or valid variants per puzzle and complete internal source/content checks.
4. Implement the current scope, then record child-test observations. Its initial cast includes Eichhörnchen, Blaumeise, Waldkauz, Biber and Maus, with one initial puzzle type per competency represented.
5. For development, implement one complete den → friend → puzzle → resource → shop → drawing/animation → refresh loop first, comparing it against the visual baseline.

Continue the design conversation in the cloud project. Start runtime development when the user requests it. Keep project sources current from GitHub; do not assume that syncing a conversation provides access to the Mac's working folder or preview server.

## Ongoing workflow

Always push completed design and project changes to GitHub main. The user reaffirmed this requirement on 7 November 2026. Current outdoor direction follows revision 6: return from v5 to richer v4 art with stronger 3D volume, while preserving the accepted den fox.

## Current shared style and rendering split

The original den and Fuchs are the master art reference. Match outdoors, shop, puzzles and interface to its colours, rounded forms and soft light. Production outside/den/shop are 3D; learning puzzles are 2D. See [art direction](visuals/art-direction.md) and [revision 7](visuals/revisions/v7.md). This supersedes separate flat/clay or unrelated scene styles. Always push changes to GitHub.

## Current design pass: shared categories and easier Reading

The user endorsed the revised examples and simple category names, and found Waldkauz a little difficult. Blueprint V2 and revision 9 now use Reading for Maus (word-picture), Blaumeise (written rhyme pairs from the old game) and Waldkauz (three-word action sentences, two pictures). Mathematics includes Eichhörnchen (counting) and Biber (missing shape in a house/cart). Writing, Nature and Creativity cover later catalogue activities. Attention, phonology, sequencing and spatial reasoning are objective tags, not separate main categories.

Waldkauz's initial content excludes preposition contrasts, three-choice spatial scenes and narrative sequencing. Sentences remain visible; the speaker explains the action without pronouncing the target. Separate examples can be spoken. Biber is a basic geometry warm-up, not the former coordinate-placement grid or a claim of full geometry mastery. See [current puzzle specifications](puzzle-specifications.md).

Each round has five tasks, one difficulty level, direct answer submission, correction, automatic advancement and a pictured reward credited once. Review refreshes still reset disposable state. Production persistence, approved 15-item pools, internal content checks and post-implementation child testing remain outstanding. Frozen v1/v2 and earlier revisions stay untouched. Always push completed source, docs and dependencies to GitHub main.


## Revision 10 handoff

Use the fixed-environment shop: colouring pages and pencils unlock at the drawing table; apple/bubble bath are bag consumables with short skippable sequences. No purchased furniture or placement mode. Preserve legacy save data safely. Switch to Codex implementation after this update is pushed; child testing follows the running build, and no teacher consultation/testing is required.
