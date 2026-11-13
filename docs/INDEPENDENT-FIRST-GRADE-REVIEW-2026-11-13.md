# Independent review: Waldpost for Zürich first grade

**Decision: conditional, supervised pilot only.** Waldpost has a gentle story and useful practice possibilities. The evidence does not yet establish that seven-year-olds can understand, navigate and complete the full range independently, or that all 1,048 items are suitable. A teacher should review a small suitable pool and observe children before wider use.

Reviewed GitHub main commit [d8a583b43228a8aba46b5f33e488dde7b81ac128](https://github.com/MrTolchock/Drawing-App/tree/d8a583b43228a8aba46b5f33e488dde7b81ac128), 13 November 2026. This is an independent desk and technical review, not a study with children or a certification.

## Strengths

- A pictured letter, woodland friend, five tasks and a return home provide a story and a natural stopping point. There is no timer, shop or currency loop; retries have no penalty. Adults can choose the letter limit ([session design](LETTER-SESSIONS.md)).
- Counting, patterns, spatial reasoning, language and nature activities offer varied practice. The [catalogue](PUZZLE-CATALOGUE.md) gives competence references and explicit difficulty boundaries; these are practice opportunities, not proof of mastery or comprehensive curriculum coverage.
- Revision-specific review gates, editable retries, reduced-motion support and local persistence are constructive choices. The local log documentation describes retention limits and a way to clear it.

## Priorities before classroom use

1. **Match tasks to children and the point in the school year.** The catalogue includes counting to 20, sentence reading, written rhymes, vowels and handwriting. [Reimpaare lesen](puzzles/friends-bird.md) requires reading words, while [Naturdetektive](puzzles/nature.md) combines reading and nature knowledge. Seven-year-olds differ greatly in reading, language background and numeracy; a wrong answer may reflect reading or motor difficulty rather than the target concept. The journey draws from approved puzzles rather than letting a teacher select a particular child-facing activity. Pre-review and approve only suitable content for the pilot, provide adult support, and confirm enough eligible content remains to run the journey.
2. **Observe children on physical devices.** Test a small diverse group, including emerging readers, multilingual learners and children needing motor or visual support. Observe whether they understand the letter, find the friend, understand the task without prompting, recover from mistakes and return home. Record prompts and frustration, not just completion. Test the actual school tablet, headphones, browser, screen orientation and offline state. Browser automation cannot establish comprehension, accessibility or learning gains.
3. **Check narration and accessibility in context.** The [learning scope](LEARNING.md) says speech relies on installed German device voices and is not bundled. Verify a clear German voice and offline availability on each device; narration does not necessarily remove reading requirements. Check touch targets, contrast, zoom, keyboard or switch access, audio alternatives and tracing with children who need them. Compare letter formation with the school's taught handwriting model before using tracing as practice.
4. **Verify actual approvals before use.** The [review process](PUZZLE-REVIEW.md) requires approval of each current iteration and puzzle. Solving an item records approval, so a correct answer alone is not a full pedagogical review. Check wording, illustration, ambiguity, distractors, difficulty and local language for each item; confirm current shared approvals on intended devices. This review did not sign off individual items or verify the live ledger.
5. **Make a school privacy decision for the log.** The [local play log](PLAY-LOG.md) records answers, times and interaction details, with timestamps and run identifiers; it can be exported for AI analysis. Although it omits names and stays local unless exported, a shared-device record may still be attributable in context. Establish who can access, clear or export it, obtain school data protection guidance before any external upload, and avoid identifiable notes in the public editorial ledger. Developer mode pauses new logging; assess its suitability for the pilot. This is not a legal determination.

## Suggested pilot

Set one letter initially (five tasks), use a teacher-reviewed appropriate pool, and introduce the story and controls together. Observe a short session rather than treating a letter count as a time limit; stop when attention or comfort requires it. Ask children to explain their solutions and compare observations with ordinary classroom work. Review unclear items and device problems before expanding. Do not use the log as a diagnosis or grading instrument.

## Evidence and limitations

- Examined the current README, learning and session documentation, catalogue, sample item lists, review and storage descriptions, and journey browser test. Did not individually inspect or play all 34 puzzles or 1,048 iterations.
- On the exact commit, `node --test tests/*.test.cjs` passed 12 test files; `node tools/check-design.cjs` and `node tools/puzzle-catalogue.cjs --check` passed. These developer checks are not evidence of educational effectiveness.
- The local browser journey test used simulated review approvals and programmatic navigation and answers. It passed the parent settings, two invitations, ten answers, home arrival, sleep, game-over and offline-lock checkpoints. It was still running at report preparation; these checkpoints do not verify the production ledger or constitute a child playtest.
- No independent observation of children, full accessibility audit, physical-device check, legal assessment, audio quality assessment or learning-outcome study was performed. The game's documentation also recognises the need for physical-device checks and observation with children.

## Requested Three.js skills

Reviewed [threejs-game-skills](https://github.com/majidmanzarpour/threejs-game-skills) and its [threejs-qa-release skill](https://github.com/majidmanzarpour/threejs-game-skills/blob/main/skills/threejs-qa-release/SKILL.md). Its guidance to check actual input, responsive views and errors is useful for the technical part of this Three.js game review. Its scaffold-specific inspector, bot metrics and release workflow are not evidence of age suitability and were not applied as a release certification. No external skill was installed and no game files or approvals were changed.
