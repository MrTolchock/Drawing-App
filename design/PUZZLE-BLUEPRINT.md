# One puzzle, five iterations

This is the required contract for every active and future puzzle. It builds on the existing Waldbuch page and Silben-Puzzle interaction. Visual decisions are defined once in [Visual style](VISUAL-STYLE.md); the [runtime inventory](../docs/PUZZLE-CATALOGUE.md) maps every puzzle to this contract.

## The shared contract

| Rule | Every active puzzle |
| --- | --- |
| Identity | One stable puzzle ID, title, host, explicit difficulty and bounded competence. A puzzle is not a difficulty ladder. |
| Pictures | Drawn woodland illustrations for scored subjects; model-rendered portraits only for character identity. Exact SVG geometry, arrows and handwriting strokes where those are the subject. See the visual-style asset table. No emoji, stock-photo or text substitute for a missing picture. |
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

Each iteration has an ID, readable label, complete question, correct answer/solution and an exact revision. All 34 current puzzles are mapped individually in the [catalogue](../docs/PUZZLE-CATALOGUE.md); each has a GitHub-readable page listing every iteration and its competence. These are practice mappings, not certification of curriculum attainment. Memory enrichment has no invented curriculum code.

Numeric bounds and reading prerequisites are explicit. Expanding variety must not silently expand difficulty: use different operand combinations, missing positions, routes, reflections and pictured word targets within the stated boundary. Any intentional difficulty change is a new review revision.

## Adult review and release gate

1. Unlock **Einstellungen** with its existing adult calculation, then open **Puzzle-Galerie öffnen** directly. There is no second calculation. Direct review URLs retain one adult gate.
2. Select a puzzle. Inspect its competence and difficulty. Test **Spielerklärung anhören** once on the puzzle overview; iteration previews do not repeat the speech control.
3. Start **Offene Iterationen prüfen**. Review all unconfirmed iterations once in the normal puzzle viewport, with no footer. Explicitly selecting an iteration places it first. Correct completion saves its exact-revision approval, uses the same 900 ms feedback and advances automatically. Wrong answers do not approve it. Handwriting requires all strokes.
4. A small **×** replaces rule speech during review and opens an optional comment and **Ablehnen und weiter**. Cancelling makes no decision. Rejected items stay flagged for the next run. After the entire queue, show the normal 2.2-second celebration; completing it approves the puzzle only if every current iteration passed. No separate sign-off button, name, checklist or required text. Review never changes child saves or letters.
5. Only fully approved puzzles enter child play. Flagging any iteration or the puzzle immediately removes its release eligibility.
6. Additions, content/answer changes, difficulty changes and changes to shared presentation/interaction invalidate the relevant sign-offs automatically. Old decisions remain visible as history, never silently apply to new content.
7. GitHub’s `puzzle-review-data` branch is the shared source of truth, keyed by stable ID and exact revision. Devices restore published decisions automatically and keep an offline cache/outbox. Only confirmed GitHub approvals release puzzles. Authenticate once per editing session in Settings; readers need no token. Conflicting edits require a choice. Export/import remains available for local drafts. A deployment does not approve anything. See [review storage](../docs/REVIEW-STORAGE.md).

## Maintaining the contract

The runtime catalogue is the source of truth. Regenerate the GitHub catalogue and implementation revision after editing runtime files with `node tools/puzzle-catalogue.cjs`. Run model tests and the relevant browser suites before pushing. Catalogue checks reject missing competence, missing/duplicate IDs, fewer than 25 items, duplicate content and stale generated documentation. Review tests cover blocked unapproved play, isolated previews, persistence, import/export and automatic invalidation. New puzzle types must implement this same contract before being added.

Physical iPad/Safari, sound comfort and child suitability still need the owner's review; automated checks do not sign off content.

## Required anatomy

```text
┌ Back ───────────────────────── Puzzle title ┐
│ Host portrait · context        Explain rule │
│                 five progress leaves        │
│                   prompt                    │
│          drawn subject / exact board        │
│              answer controls                │
│          feedback on the chosen answer      │
└─────────────────────────────────────────────┘
```

Use `js/screens/puzzle.js` and `css/puzzle-rounds.css`. Writing uses the existing stroke engine in `js/screens/trace.js` inside the same page shell. The context portrait, five leaves, topbar, guidance, feedback and celebration are shared. Adult review uses the same sized task region, with a small rejection × in the usual speech-control slot and no review strip. The counter shows the full review queue; five leaves represent its overall progress. The speech test belongs to the puzzle overview; children keep the shared “Spiel erklären” control during normal play.

- Cream stitched paper and quiet woodland background; one main task per page. Cards use the shared wood/cream treatment, soft brown borders and sage selected states. Feedback adds a visible mark and accessible status, never colour alone.
- Andika 700 for the puzzle title, prompt, scored words and numerals; Andika 400 for explanations and labels. Do not use Baloo for scored text or handwriting.
- Touch controls are at least 48 × 48 CSS px. On a narrow screen wrap answers or scroll the task region; do not shrink letters or targets until they become hard to use. Keep the topbar and back button reachable. Honour safe areas, visible keyboard focus and reduced motion.
- Nouns/verbs use drawn artwork through `FK.visual`; companions and voters use the identity API `FK.friendsArt.portrait`. A model portrait must never substitute for a pictured vocabulary answer. Utility controls use `FK.icons`.

## Adding or revising a puzzle

1. Choose a stable ID, host, competence, prerequisites and explicit fixed difficulty. Add its inventory entry to `js/friends/library.js` and finite definitions to `js/friends/puzzle-catalogue.js`.
2. Supply at least 25 substantively different, inspectable iterations; include each expected answer/solution. Use complete natural sets where appropriate (alphabet, digits). Do not create a second page shell or duplicate a retired engine.
3. Implement the interaction in the shared renderer, including saved partial work, editable retries, requested rule speech, mute, keyboard/touch input and the common finish sequence. Retain shared play-log hooks; log relevant actions for any new interaction and classify construction/tracing separately from choice questions in its summaries.
4. Run `node tools/puzzle-catalogue.cjs`, `node tools/check-design.cjs`, model checks and the relevant browser suites. Review the real phone/tablet layout against [Visual style](VISUAL-STYLE.md).
5. Open Settings → Puzzle-Prüfung, play through **every unconfirmed iteration**, solve to approve or use × to request improvement, and complete the celebration. New assets, interaction or difficulty change the revision and require review again. A deployment does not grant editorial approval.
