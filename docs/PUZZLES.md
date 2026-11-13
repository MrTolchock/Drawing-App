# Current woodland puzzles

The active Waldfreunde catalogue contains **34 puzzles and 1,048 finite iterations**. Every puzzle has at least 25 iterations. Schreibspuren covers A–Z and ÄÖÜ in upper and lower case (58 forms). Zahlenspuren covers all ten digits with three illustrated quantity contexts (30 iterations).

- [Shared puzzle blueprint](PUZZLE-BLUEPRINT.md): the contract for pictures, page, sound, guidance, five-task rounds and celebration.
- [Complete puzzle catalogue](PUZZLE-CATALOGUE.md): every puzzle, competence, difficulty and iteration count, with a page listing every individual definition and solution.
- [Adult review instructions](PUZZLE-REVIEW.md): inspect, approve or flag every iteration and the puzzle, export/import decisions, and repeat review after changes.

## One shared flow

The existing Waldbuch page, model-rendered identity portrait, Andika scored text, wooden answer cards and five-leaf progress row are shared. Pictures come from the existing drawn woodland library; geometry and handwriting use drawn paths. Every enabled puzzle button clicks, with separate correct/retry sounds and the existing mute preference. One manual **Spiel erklären** button explains the rule without reading an answer. There are no hints, demonstration controls, question-mark help, next-task buttons or question deadlines. Tracing retains numbered starts and directional guides, without an automatic demonstration.

A round selects five distinct iterations, preferring items outside the previous completed round. Selected questions, answer order and partial board work are saved exactly. Correct answers remain visible for 900 ms before automatically advancing. Mistakes leave the board editable. The fifth answer leads to the existing 2.2-second friend celebration with painted leaves and flowers; reduced motion keeps a static wreath. Necessary reset/reinspection controls remain available.

The parent-only gallery/review workbench and forest invitations use the same catalogue. Children can start a puzzle only by visiting the friend on their current letter. After the parent-chosen number of letters, Fuchs must return to the den to sleep; no further puzzles or letters open until a parent starts the next journey. Back returns to the entry point. See [letter sessions](LETTER-SESSIONS.md). The owner reviews all unconfirmed iterations in the normal game viewport: solve to approve, or × to reject with an optional comment. The complete queue ends with the common celebration and approves the puzzle only if every iteration passed. No approvals ship by default. Editorial previews use the real renderer and separate in-memory sessions.

## Learning boundaries

The catalogue references the Zürich Zyklus-1 [curriculum matrix](CURRICULUM.md). These are practice mappings, not claims of full competence attainment. Quantities require numeral familiarity; written questions require previously taught letters and familiar vocabulary. Tracing practises letter/digit forms, not pencil grip or independent handwriting fluency. Picture ordering alone does not prove reading. Memory enrichment has no subject-attainment claim.

Variety comes from different quantities, operand combinations, missing parts, paths, arrangements, word targets and complete pictured stories. Some reviewed tasks have a partly completed board. Reading sentences and colour sentences explicitly include one- and two-sentence tasks; their difficulty boundary is visible for review. Neither seeds nor shuffled answer order count as extra iterations.

## Continuity and verification

Historical Heart Tree code is archived; drawings and save identifiers are preserved. Original friend snapshots stay in FriendsState. The active catalogue now uses shared five-question snapshots; older seeded sessions are retained in `legacy` when a newly reviewed catalogue starts a fresh round. Adult review records are shared through [GitHub storage](REVIEW-STORAGE.md), with a device-local offline cache/outbox and export/import format. All new runtime files are precached for offline use.

Model tests check the catalogue, solutions, real artwork, routes, distinct five-item selection, exact restoration, review prerequisites, import/export and invalidation. `tests/puzzle-review-browser.cjs` opens and solves all 1,048 iterations through the real renderers, checks native touch/mouse interaction across all 34 puzzles, phone/tablet layouts, the full review queue, optional rejection, celebration, isolated saves, release blocking, persistence and offline review. `tests/puzzle-rounds-browser.cjs` checks full five-task sessions, celebration and return destinations. Automated tests never sign off editorial suitability for the owner.
