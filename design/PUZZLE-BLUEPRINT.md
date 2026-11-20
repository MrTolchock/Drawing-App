# One puzzle, five iterations

User-facing terminology is **Rätsel** for a game and **Aufgaben** for its individual tasks; internal IDs and historical records stay stable.

This is the required contract for every active and future puzzle. It builds on the existing Waldbuch page and Silben-Puzzle interaction. Visual decisions are defined once in [Visual style](VISUAL-STYLE.md); the [runtime inventory](../docs/PUZZLE-CATALOGUE.md) maps every puzzle to this contract.

All generated learning pictures follow the [canonical watercolour/pencil style](illustrations/STYLE.md), with its fixed reference images and style-complete prompts. Historical generation records do not define new artwork.

## Illustration and typography

Use the actual animal and object reference images in every generation request. Compare answer pictures as a group on cream and on a dark background at the size used in the game. Pack isolated drawings with the longest visible side about 80% of the square cell and the silhouette centred on both axes. Keep proportions and soft pencil edges. Check for clipped features, pale matte and neighbour fragments, and reuse the same drawing when the subject and pose recur. A repair to one cell preserves the positions and visible pixels of the other cells. [Illustration workflow](illustrations/STYLE.md)

Use bundled Andika for puzzle text in child play, gallery rounds and review previews. Keep the same role size across puzzles at a given viewport. Preserve the authored handwriting paths and the structure of exact diagrams.

| Role | Font and size |
| --- | --- |
| Puzzle title | Andika 700, responsive 20–30 px |
| Task prompt | Andika 700, responsive 21–29 px |
| Scored words, sentences, syllables and numerals | Andika 700, 29 px at widths up to 600 px and 34 px above |
| Text controls, including both memory actions | Andika 700, 21 px |
| Picture captions and group success text | Andika 700, 16 px |
| Host context and iteration counter | Andika 400 at 12/15 px and 700 at 14/16 px, respectively, on narrow/wide screens |
| Tracing quantities and labels | Andika 400, 16 px |

Give longer words and captions room to wrap. Keep the same touch area for equivalent controls.

## The shared contract

| Rule | Every active puzzle |
| --- | --- |
| Identity | One stable puzzle ID, competence title (no separate decorative title/subtitle), host, explicit difficulty and bounded competence. A puzzle is not a difficulty ladder. |
| Pictures | Drawn woodland illustrations for scored subjects; the common painted cast for character identity. Exact SVG geometry, arrows and handwriting strokes where those are the subject. See the visual-style asset table. No emoji, stock-photo or text substitute for a missing picture. |
| Page | Cream stitched Waldbuch paper, woodland clearing, matching wooden answer cards, Andika for scored text, one host portrait and five progress leaves. |
| Round | A random sample of five distinct iterations from the finite, inspectable pool. Prefer items not in the last completed round. Keep the selected questions and partial work stable on return/reload. |
| Pool | At least 25 explicit, stable iterations per puzzle. Full upper/lower alphabet including ÄÖÜ; numeral practice includes the complete 0–9 set in three illustrated quantity contexts. Iterations differ in content, configuration or required action, never only answer order or a random seed. |
| Guidance | In child play, one optional “Spiel erklären” control explains the rule without reading a scored answer. No hint, demonstration, question-mark help, timed question or next-task button. Necessary reset and reinspection controls remain available. |
| Input | Finger, stylus and mouse as appropriate; keyboard-operable buttons, visible focus, readable labels and responsive phone/tablet layout. Wrong answers remain editable; no penalty or countdown. |
| Sound | A quiet click for task/answer buttons, then distinct correct/retry feedback. Menus, navigation and adult review controls are silent. Respect Spielklänge mute. Speech only when requested. |
| Progress | Correct answer stays visible for 900 ms, then advances automatically. After five: the existing 2.2-second friend/leaf/flower celebration. Reduced motion uses a static wreath. |
| Access | Children visit the character on their current letter. Only that character can start a puzzle. The complete gallery/review workbench is in adult Settings. Parents choose the number of letters; the last puzzle leads home to sleep and game over. |
| Continuity | Back returns to the actual entry point. Child play, parent previews, reviews and historical saves are separate. Previews must not complete invitations, award progress or alter an unfinished child round. |
| Observations | Child play uses the shared [local gameplay log](../docs/PLAY-LOG.md): exact iteration/revision, selections/configuration, explicit outcomes, active task time and relevant input/reset events. Review previews and developer-mode activity are excluded; no network upload or raw handwriting paths. |

## Content and competence

Each iteration has an ID, readable label, complete question, correct answer/solution and an exact revision. All 22 current riddles are mapped individually in the [catalogue](../docs/PUZZLE-CATALOGUE.md); each has a GitHub-readable page listing every iteration and its competence. These are practice mappings, not certification of curriculum attainment. Memory enrichment has no invented curriculum code.

Numeric bounds and reading prerequisites are explicit. Expanding variety must not silently expand difficulty: use different operand combinations, missing positions, routes, reflections and pictured word targets within the stated boundary. Any intentional difficulty change is a new review revision.

## Adult review and release gate

1. Unlock **Einstellungen** with its existing adult calculation, then open **Rätsel-Galerie öffnen** or **Rätsel-Prüfung öffnen** directly; moving between Settings, the gallery and the review (e.g. the gallery's **Zur Rätsel-Prüfung**) asks no second calculation. Direct review URLs retain one adult gate.
2. Select a puzzle to inspect its competence explanation, curriculum reference and difficulty. Test **Spielerklärung anhören** once in the details. Saving a general comment marks the puzzle **Offen** for improvement and keeps the individual iteration decisions. The comment field clears after saving. The header back arrow returns to all puzzles, then to Settings.
3. Start **Offene Aufgaben prüfen**. Review all unconfirmed iterations once in the normal puzzle viewport, with no footer. Explicitly selecting an iteration places it first. Correct completion saves its exact-revision approval, uses the same 900 ms feedback and advances automatically. Wrong answers do not approve it. Handwriting requires all strokes.
4. A small **×** in the rule-speech position opens **Ablehnen und weiter** and its optional comment. Cancelling keeps the existing decision. Rejected items return in the next queue. A completed queue plays the normal 2.2-second celebration automatically. **Alle bestätigen** lets the adult explicitly approve every current iteration and the puzzle after a confirmation. Review preserves child saves and letters.
5. Every current iteration requires GitHub-confirmed approval for release. A flag on an iteration or a general comment blocks release immediately. Completing the open queue can clear an earlier puzzle flag. When all iterations are already approved, **Alle bestätigen** clears a general flag explicitly. A comment saved during an older review queue keeps the puzzle open.
6. Additions and changes to questions, answers, difficulty, rules, interaction or pictures reopen the affected iterations. Typography corrections retain existing approvals when those aspects match. Full display revisions still identify the exact version for saved rounds and gameplay logs. Earlier GitHub decisions keep their original dates and comments, and later restrictions continue to apply.
7. GitHub’s `puzzle-review-data` branch is the shared source of truth, keyed by stable ID and exact revision. Devices restore published decisions automatically and keep an offline cache/outbox. Only confirmed GitHub approvals release puzzles. Authenticate once per editing session on the Rätsel-Prüfung entry page; readers need no token. Conflicting edits require a choice. There is no file export/import or search in Rätsel-Prüfung; the page and each puzzle open at the top. A deployment does not approve anything. See [review storage](../docs/REVIEW-STORAGE.md).

## Maintaining the contract

The runtime catalogue is the source of truth. Regenerate the GitHub catalogue and implementation revision after editing runtime files with `node tools/puzzle-catalogue.cjs`. Run model tests and the relevant browser suites before pushing. Catalogue checks reject missing competence, missing/duplicate IDs, fewer than 25 items, duplicate content and stale generated documentation. Review tests cover blocked unapproved play, isolated previews, persistence, import/export and automatic invalidation. New puzzle types must implement this same contract before being added.

Physical iPad/Safari, sound comfort and child suitability still need the owner's review; automated checks do not sign off content.

## Required anatomy

```text
┌ Back · Host portrait · context · Explain ──┐
│                 five progress leaves        │
│                   prompt                    │
│          drawn subject / exact board        │
│              answer controls                │
│          feedback on the chosen answer      │
└─────────────────────────────────────────────┘
```

Use `js/screens/puzzle.js` and `css/puzzle-rounds.css`. Writing uses the existing stroke engine in `js/screens/trace.js` inside the same page shell. The inline return arrow, context portrait, five leaves, guidance, feedback and celebration are shared. Active puzzles have no separate title bar; the task prompt is the visible heading. Adult review uses the same sized task region, with a small rejection × in the usual speech-control slot and no review strip. The counter shows the full review queue; five leaves represent its overall progress. The speech test belongs to the puzzle overview; children keep the shared “Spiel erklären” control during normal play.

- Cream stitched paper and quiet woodland background; one main task per page. Cards use the shared wood/cream treatment, soft brown borders and sage selected states. Feedback adds a visible mark and accessible status, never colour alone.
- Use the typography roles above in the shared puzzle and tracing layouts.
- Touch controls are at least 48 × 48 CSS px. On a narrow screen wrap answers or scroll the task region; do not shrink letters or targets until they become hard to use. Keep the inline back button reachable. On iPad, all task variants and answers fit without scrolling; compact surrounding spacing and boards rather than scored text or touch targets. Honour safe areas, visible keyboard focus and reduced motion.
- Keep illustration proportions intact at every size and in saved/filled task states. Scale square atlas cells uniformly inside compact rows and picture pairs; never force their width and height to follow different container dimensions.
- Nouns/verbs use drawn artwork through `FK.visual`; companions and voters use the same painted identity API `FK.friendsArt.portrait`. An identity portrait must never substitute for a pictured vocabulary answer. Task utility controls use `FK.icons`; the inline back uses the shared `FK.ui.topbar` navigation arrow, matching menus and the map.

## Adding or revising a puzzle

1. Choose a stable ID, host, competence, prerequisites and explicit fixed difficulty. Add its inventory entry to `js/friends/library.js` and finite definitions to `js/friends/puzzle-catalogue.js`.
2. Supply at least 25 substantively different, inspectable iterations; include each expected answer/solution. Use complete natural sets where appropriate (alphabet, digits). Do not create a second page shell or duplicate a retired engine.
3. Implement the interaction in the shared renderer, including saved partial work, editable retries, requested rule speech, mute, keyboard/touch input and the common finish sequence. Retain shared play-log hooks; log relevant actions for any new interaction and classify construction/tracing separately from choice questions in its summaries.
4. Run `node tools/puzzle-catalogue.cjs`, `node tools/check-design.cjs`, model checks and the relevant browser suites. Review the real phone/tablet layout against [Visual style](VISUAL-STYLE.md).
5. Open Settings → Rätsel-Prüfung and play through **every unconfirmed iteration**. Solve to approve or use × to request improvement. The final iteration ends the queue automatically. New assets, interaction or difficulty change the affected revisions and require review again.
