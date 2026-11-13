# Independent review: Waldpost for Zürich first grade

**Recommendation: do not start child use on the current published state.** The production review ledger contains no approved items. The app's own gate correctly blocks unapproved puzzles, but the child can still receive a letter and reach its friend, then cannot finish that journey. After current content is reviewed and released, a small supervised pilot is warranted before independent classroom use.

This review covers **GitHub main commit [d8a583b43228a8aba46b5f33e488dde7b81ac128](https://github.com/MrTolchock/Drawing-App/tree/d8a583b43228a8aba46b5f33e488dde7b81ac128)**, checked on 13 November 2026. The separate report branch changes no game files or approval decisions. This is an independent expert desk review and technical playthrough, not an observation of children, accessibility certification, legal opinion or learning outcome study.

## What the game offers

Waldpost gives a child a pictured letter, guides a fox to a woodland friend, presents five tasks and leads the fox home after the adult's chosen number of letters. The default is three letters; adults can choose 1–50. There is no countdown, shop or currency loop. Wrong answers can be retried without penalty. This is a considerate structure for short practice, although 50 letters could mean 250 tasks and is far beyond a sensible first-grade sitting. The letter count is not a time limit. The game has 34 puzzles and 1,048 finite iterations across counting, arithmetic, shapes, patterns, spatial work, language, nature, reading and tracing. Each completed round samples five iterations.

The [catalogue](PUZZLE-CATALOGUE.md) names a related Zürich Zyklus 1 competence and bounds for each puzzle. The [curriculum note](CURRICULUM.md) appropriately says these are opportunities for practice rather than proof of mastery or complete coverage. The story, distinct characters and pictured destinations could make repeated practice inviting. The current review and revision gate is a genuine safeguard against accidentally releasing new material.

## Findings, ordered by effect on use

### 1. Blocker: no child puzzle is currently approved

The public [review ledger](https://github.com/MrTolchock/Drawing-App/blob/puzzle-review-data/reviews.json) contained `"entries": {}` and `"history": []` when checked. The child eligibility function in [puzzle-review.js](../js/friends/puzzle-review.js) requires at least 25 iterations, approval of every current iteration, puzzle approval and GitHub confirmation. In a fresh Chromium profile on the reviewed main snapshot, `FK.puzzleReview.ready('friends-squirrel')` returned `false`. The [game journey](../js/friends/game.js) still issues a letter before eligibility is known; on meeting its friend, a missing eligible puzzle shows “Dieses Puzzle wartet noch auf die Freigabe von Erwachsenen.” The letter cannot be completed there. The browser tests use simulated approvals, so their success does not contradict this production state.

This gate prevents exposure to unreviewed tasks, which is desirable. Its current effect is a journey that begins but cannot progress. Before inviting any child, an adult must actually inspect and publish the required current approvals, confirm eligible puzzles on a fresh device and check that each possible invited friend has an eligible puzzle. Ideally the start flow would tell the adult that no child journey is available yet, before a child receives a letter. Do not manufacture approvals merely to make the game playable.

### 2. High teaching risk: random assignment has no teacher selection of a learning goal

The [letter session design](LETTER-SESSIONS.md) chooses friends from a shuffled bag, and the [library](../js/friends/library.js) chooses among eligible puzzle types for a friend. This creates variety, but an adult's letter limit controls quantity, not subject, prerequisite or difficulty. The pool mixes counting to 20, simple arithmetic, letter tracing, reading words and reading sentences. For example, [Reimpaare lesen](puzzles/friends-bird.md) needs word reading; [Naturdetektive](puzzles/nature.md) needs reading plus nature knowledge. Seven-year-olds in one Zürich class may be at very different points in literacy and may use several home languages. An error can reflect decoding, vocabulary, fine motor control or understanding of the game's rule rather than the named competence.

For a pilot, release only a teacher-selected suitable pool and check how random assignment behaves with that pool. Ideally the adult can choose a practice area or activity for a session. Do not use success or the local statistics as a grade or diagnosis. Ask children how they arrived at an answer.

### 3. Medium consistency defect: the learning overview describes retired content as current

The [learning scope](LEARNING.md) table lists “Drawing, colouring, saved pictures and sticker album” under “Current activities,” while the same page later says creative missions are not active. The current [README](../README.md) and [letter sessions](LETTER-SESSIONS.md) say drawing and saved-picture screens are retired. The learning overview also uses names from an earlier activity set, while the generated catalogue is the current inventory. A teacher planning a lesson from the overview could expect tools that are not there. Use the catalogue as the source of truth, and reconcile the overview before sharing it with schools.

### 4. Medium review process risk: correct completion is treated as editorial approval

The [adult review workflow](PUZZLE-REVIEW.md) records an iteration approval when the reviewer solves it correctly; completing the queue can approve the puzzle. This proves that the reviewer could find the expected answer. It does not by itself prove that the wording is clear to a child, the illustration is unambiguous, distractors are fair, letter forms match teaching, or the item fits this class. The explicit rejection control helps, but a reviewer must deliberately assess those qualities, including all 1,048 current iterations and the shared interaction. Record substantive concerns and recheck changed revisions. This review did not approve any item.

### 5. Medium deployment and inclusion risk: spoken help depends on the device

The [learning scope](LEARNING.md) says speech uses installed German device voices; no recorded narration is bundled. On school devices, voice quality and offline availability must be checked directly. Reading tasks intentionally require reading, so spoken rule help does not remove their prerequisite. Test actual tablets with headphones, network off, sound muted and sound on. Check whether children can find the “Spiel erklären” control, whether audio is intelligible, and whether a visual equivalent remains usable. Trace activities need comparison with the school's taught letter forms and observation of children using fingers or a stylus; tracing success does not establish independent handwriting.

### 6. Medium school privacy question: detailed local observations can be exported

The [play log](PLAY-LOG.md) records answers, task times, prompts, input problems and journey events, with timestamps and session identifiers. It remains on the device and is retained for up to seven days, 10,000 events and about 750,000 storage characters; an adult can clear it or export JSON “für KI”. It excludes name, age, physical location, images and audio. Even so, a shared tablet used by one child at a known time may make a record attributable in practice. Establish who may access, export or delete it; check school data protection requirements before external AI use; and avoid identifiable comments in the public editorial ledger. The documented developer mode pauses new observations, but suitability of that setting for a classroom pilot needs a school decision. This is a practical privacy concern, not a claim of unlawful behavior.

## Child experience and accessibility review

The pictured letter, friend portraits and homecoming give the session a clear arc. The observed tablet den was visually legible, with large icon controls; the observed 390 × 844 settings screen fitted its width and exposed a large restart button. The forest involves movement to a target; the journey test found a reachable courier at all 11 friends. These are positive technical observations, not proof that a seven-year-old knows what to tap. In the den, the top navigation envelope and the small envelope near the door may need observation for ambiguity. Children may also need help connecting the letter portrait, direction arrow and destination.

The shared [puzzle blueprint](../design/PUZZLE-BLUEPRINT.md) specifies visible focus, keyboard-operable buttons, touch input, editable wrong answers, reduced motion and responsive phone/tablet layout. Those intentions should be checked on real school hardware with children who use zoom, alternative input or need motor or visual support. This review did not complete an assistive-technology audit. Verify contrast, focus order, touch target size, orientation, text size, audio alternatives, tracing tolerance and whether the speech voice works offline. Observe emerging readers and multilingual learners, and note when an adult prompt is needed. A short successful scripted route is not a child usability result.

## Verification performed on the exact main commit

| Check | Result | What it establishes |
| --- | --- | --- |
| `node --test tests/*.test.cjs` | 12 test files passed | State, puzzles, review repository, log, routes, sound and other modeled behavior meet the project's assertions. |
| `node tools/check-design.cjs` | Passed | Project design and file consistency checks passed. |
| `node tools/puzzle-catalogue.cjs --check` | Passed | Generated catalogue and implementation revision match. |
| `tests/letter-sessions-browser.cjs` against a local static server | Passed | With simulated approvals and programmatic input: parent limit and gallery gate, invited friend restriction, two invitations and ten answers, courier and home routes, sleep/game over, reload and offline lock, parent restart, and logged outcomes. |
| Fresh Chromium profile, no test approvals | `ready('friends-squirrel') === false` | A real fresh session cannot open that unapproved puzzle. Public ledger is empty. |
| Visual inspection | Tablet den and 390 × 844 settings capture inspected | Layout observations above only; no broad visual or accessibility certification. |

The browser journey exercises controls and state, but uses simulated approvals and programmatic travel/answers. The unit tests likewise do not establish pedagogy, live production approval, audio quality or child comprehension. A separate interface browser run reached the parent settings/gallery checkpoint but was stopped after prolonged resource contention; no full pass is claimed for it. I did not individually inspect all 1,048 iterations or run a child study.

## Classroom pilot after the blocker is cleared

Start with one letter, five tasks, from content that a teacher has inspected for this class and this point in the year. Introduce the story and controls together. Observe a small group with varied reading, language and access needs on the actual school device. For each task, note whether the child understands the prompt independently, whether a wrong answer is recoverable, what the child says their reasoning was, and whether the child can finish or leave comfortably. Stop when attention or comfort requires it. Revisit ambiguous items, device issues and the length of the journey before expanding to a class. Compare observations with ordinary classroom work rather than treating game completion as attainment.

## Requested Three.js skills

I inspected [threejs-game-skills](https://github.com/majidmanzarpour/threejs-game-skills), particularly [threejs-qa-release](https://github.com/majidmanzarpour/threejs-game-skills/blob/main/skills/threejs-qa-release/SKILL.md). Its advice to check real input, viewports, console errors and full progression informed the technical review. The packaged scaffold inspector, bot metrics, graphics and asset-generation skills are aimed at building or releasing a game and would not determine first-grade educational suitability. No external skills were installed. Their use does not substitute for teacher review or observation with children.
