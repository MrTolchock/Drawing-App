# One puzzle, five iterations

This blueprint builds on the Waldbuch picture-book design, Silben-Puzzle interaction, [existing puzzle flow](PUZZLES.md), and [curriculum matrix](../design/forest-friends/curriculum-matrix.md). It supersedes the old visual-only restriction on task pools for this branch. Main and the published game remain unchanged.

## The shared contract

| Rule | Every active puzzle |
| --- | --- |
| Identity | One stable puzzle ID, title, host, explicit difficulty and bounded competence. A puzzle is not a difficulty ladder. |
| Pictures | Existing illustrated woodland library and master-cast portraits; drawn SVG geometry, arrows and handwriting strokes where those are the subject. No emoji, stock-photo or text substitute for a missing picture. |
| Page | Cream stitched Waldbuch paper, woodland clearing, matching wooden answer cards, Andika for scored text, one host portrait and five progress leaves. |
| Round | A random sample of five distinct iterations from the finite, inspectable pool. Prefer items not in the last completed round. Keep the selected questions and partial work stable on return/reload. |
| Pool | At least 25 explicit, stable iterations per puzzle. Full upper/lower alphabet including ÄÖÜ; numeral practice includes the complete 0–9 set in three illustrated quantity contexts. Iterations differ in content, configuration or required action, never only answer order or a random seed. |
| Guidance | One optional “Spiel erklären” control explains the rule without reading a scored answer. No hint, demonstration, question-mark help, timed question or next-task button. Necessary reset and reinspection controls remain available. |
| Input | Finger, stylus and mouse as appropriate; keyboard-operable buttons, visible focus, readable labels and responsive phone/tablet layout. Wrong answers remain editable; no penalty or countdown. |
| Sound | A quiet click for every enabled puzzle button, then distinct correct/retry feedback. Respect Spielklänge mute. Speech only when requested. |
| Progress | Correct answer stays visible for 900 ms, then advances automatically. After five: the existing 2.2-second friend/leaf/flower celebration. Reduced motion uses a static wreath. |
| Access | Children visit the character on their current letter. Only that character can start a puzzle. The complete gallery/review workbench is in adult Settings. Parents choose the number of letters; the last puzzle leads home to sleep and game over. |
| Continuity | Back returns to the actual entry point. Child play, parent previews, reviews and historical saves are separate. Previews must not complete invitations, award progress or alter an unfinished child round. |

## Content and competence

Each iteration has an ID, readable label, complete question, correct answer/solution and an exact revision. All 34 current puzzles are mapped individually in the [catalogue](PUZZLE-CATALOGUE.md); each has a GitHub-readable page listing every iteration and its competence. These are practice mappings, not certification of curriculum attainment. Memory enrichment has no invented curriculum code.

Numeric bounds and reading prerequisites are explicit. Expanding variety must not silently expand difficulty: use different operand combinations, missing positions, routes, reflections and pictured word targets within the stated boundary. Any intentional difficulty change is a new review revision.

## Adult review and release gate

1. Open **Einstellungen → Puzzle-Prüfung**, behind the existing adult gate.
2. Select a puzzle. Inspect its competence, difficulty, rule checklist and every iteration.
3. Open each iteration in the real puzzle renderer. Check pictures, wording, answer, interaction and difficulty. Mark **Freigeben** or **Verbessern**, with a note for improvements. An unopened iteration cannot be approved.
4. Sign off the puzzle checklist and the puzzle itself only after every current iteration is approved. There is no “approve all” shortcut.
5. Only fully approved puzzles enter child play. Flagging any iteration or the puzzle immediately removes its release eligibility.
6. Additions, content/answer changes, difficulty changes and changes to shared presentation/interaction invalidate the relevant sign-offs automatically. Old decisions remain visible as history, never silently apply to new content.
7. Decisions persist locally on this device/origin. Export/import a revision-checked review file to back up work, move it to another device, or attach it to GitHub. A branch or deployment does not itself approve content. Reviews are adult editorial decisions, not an account/authentication system.

## Maintaining the contract

The runtime catalogue is the source of truth. Regenerate the GitHub catalogue and implementation revision after editing runtime files with `node tools/puzzle-catalogue.cjs`. Run model tests and the relevant browser suites before pushing. Catalogue checks reject missing competence, missing/duplicate IDs, fewer than 25 items, duplicate content and stale generated documentation. Review tests cover blocked unapproved play, isolated previews, persistence, import/export and automatic invalidation. New puzzle types must implement this same contract before being added.

Physical iPad/Safari, sound comfort and child suitability still need the owner's review; automated checks do not sign off content.
