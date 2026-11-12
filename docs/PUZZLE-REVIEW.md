# Review every puzzle before children play

The review workbench and complete puzzle gallery are in adult Settings. Children use the [letter-limited journey](LETTER-SESSIONS.md). Open **Einstellungen → Puzzle-Galerie öffnen** and answer the existing adult-gate question. You can also open `?screen=puzzle-review` or the old `?screen=hub` link; both require the adult gate.

Nothing is preapproved. The active Waldfreunde library and forest visits only play puzzles whose entire current pool and puzzle checklist you have signed off. The historical Heart Tree code is archived; its old URL opens the current den. This review gate covers all active Waldfreunde puzzles.

## Inspect and decide

1. Enter your name or initials. Pick a puzzle to see its competence, explicit difficulty and complete iteration list. Filter by **Offen**, **Verbessern**, **Freigegeben** or **Geändert**.
2. Open **Prüfen** for each iteration. This is the real puzzle screen, with the same pictures, controls, sounds and solution checking as child play. The parent panel is below the puzzle; scroll to it. **Aufgabe und erwartete Lösung** exposes the exact question/answer definition.
3. Play or inspect it. **Iteration freigeben** records a decision for this revision. **Verbessern** requires a note, and **Wieder öffnen** removes its approval. Previous/next controls let you inspect the entire pool in order. There is no bulk sign-off.
4. **Zur Puzzle-Prüfung** returns to that puzzle's list. **Fünfer-Runde und Feier prüfen** exercises a random full round; **Feier ansehen** previews the ending separately. Neither grants any iteration approval. Check muted/unmuted sound and reduced motion as part of the puzzle checklist.
5. When all iterations are individually approved, tick every shared checklist item and press **Puzzle freigeben**. Only then is this puzzle eligible for child play.

A single-iteration preview deliberately holds the solved state so you can inspect it. A five-iteration round preview follows normal automatic continuation and celebration. Previews do not alter interrupted child rounds, invitations, rewards, progress or gameplay logs. They only record that you opened the item and any editorial decisions you make.

The puzzle and tracing pages share the five-leaf progress/header and final celebration. Geometric shapes and letter paths are drawn directly; all other pictures use the existing woodland illustration library. Numeric and word pools are finite and documented; no runtime AI or unconstrained question generator is involved.

## Save, share and revisit

Review decisions and their history stay in this browser/PWA on this device and origin. They do not automatically sync to GitHub, another device, Safari, another branch preview, or the Home Screen app's separate storage. Use **Prüfung exportieren** regularly. **Prüfung importieren** restores a review JSON file, merges its decisions with the current device and preserves superseded decisions as history. Invalid files leave existing decisions intact. Imported decisions for different revisions remain **Geändert · Offen**. The import is a trusted adult editorial backup, not a digitally signed identity record.

If saving fails, the screen reports the failure and does not claim the decision was saved. Export a backup before changing devices or clearing site storage. Developer mode (`?dev=1`) uses separate child and review keys.

Adding an iteration changes the puzzle revision and requires puzzle sign-off again; unchanged iteration decisions can remain valid. Changing an iteration, its puzzle's difficulty, competence or instructions invalidates its previous approval. Changing shared rendering, interactions, sound, typography, glyphs or illustration assets conservatively reopens all affected shared-contract reviews. Old decisions remain in history or marked stale. Flagging any current item immediately blocks its puzzle, including in another open tab.

## Developer process

1. Work on a branch and push checkpoints. Publish to main when the owner authorizes it.
2. Edit the finite definitions in `js/friends/puzzle-catalogue.js`. Give every new iteration a new stable ID. Change the definition of an existing ID only for a correction; its fingerprint changes automatically. Keep difficulty in `meta` accurate.
3. Reuse the real puzzle or tracing renderer and the shared blueprint. Do not ship a separate approximate review renderer.
4. Run `node tools/puzzle-catalogue.cjs`. This writes all GitHub catalogue pages and the shared implementation fingerprint. The fingerprint hashes actual shared runtime source and artwork; individual content/difficulty also has its own fingerprint. Generated files must be committed with the implementation.
5. Run `node --test tests/*.test.cjs`, `node tests/puzzle-review-browser.cjs` and `node tests/letter-sessions-browser.cjs`. Browser suites need Playwright and Chromium as described in [Development](DEVELOPMENT.md). Test fixtures create approvals only inside disposable browser contexts; no approvals ship with the app.
6. Bump the app/cache version for runtime changes and keep all new assets in `sw.js`. Push checkpoints to the same feature branch. Owner review is still required in the application after deploying to the intended origin.

`docs/PUZZLE-CATALOGUE.md` and `docs/puzzles/*.md` list every puzzle, every iteration, the competence and its blueprint mapping on GitHub. The catalogue-generation check runs in CI, so content, difficulty or runtime changes cannot silently ship with stale revision data. CI validates the process; it does not grant editorial approval.

Original FriendsState snapshots and historical storage keys are preserved. New current-library rounds use one shared snapshot format. An older seeded round or a round from a different catalogue revision is kept verbatim in the puzzle save's `legacy` field; a fresh reviewed round starts separately. Previously interrupted original-friend rounds remain in their original FriendsState record and are not silently rewritten or completed by a preview.
