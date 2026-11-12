# Review every puzzle before children play

Open **Einstellungen** through its existing adult calculation, then tap **Puzzle-Galerie öffnen**. The gallery opens directly, without another calculation. A direct review URL still asks once before opening. Published reviews live on GitHub and restore automatically across browsers/installations. Nothing is preapproved.

## Inspect and decide

1. Choose a puzzle. Its overview shows competence, fixed difficulty and iteration progress. Use **Spielerklärung anhören** to test the one shared spoken rule for that puzzle. The complete rule text is also shown. Speech is requested only by that button; individual iteration previews have no repeated speech control. Normal child play keeps **Spiel erklären**.
2. Open each iteration in the actual puzzle/tracing renderer. Check the pictures, wording, answer, interaction and difficulty. **Iteration freigeben** and **Verbessern** save immediately, without typing a name or note. An iteration must be opened before it can be approved.
3. **Notiz hinzufügen (optional)** lets you add a note when useful. It is optional for every decision, including improvements. **Wieder öffnen** returns an item to pending.
4. **Zur Puzzle-Prüfung** returns to that puzzle's overview. **Fünfer-Runde und Feier prüfen** tests a random full round; **Feier ansehen** previews its ending. These previews do not approve iterations or change a child's journey/save.
5. After all current iterations are approved, press **Puzzle freigeben**. There is no checklist, reviewer field or required text. You can also flag the whole puzzle for improvement.

Only puzzles whose current iterations **and puzzle** are approved enter child play. Flagging an iteration or the puzzle removes that eligibility immediately. Filters show pending, improvement, approved and changed items.

## Save, restore and revisit

[Connect GitHub once per editing session](REVIEW-STORAGE.md) in Settings to save changes automatically. Other browsers and fresh installations read the shared file without a token. A local-only decision does not release a puzzle for children. Wait for **Auf GitHub gespeichert** before deleting local storage; offline changes remain in the outbox until uploaded.

Use **Prüfung exportieren** regularly. **Prüfung importieren** restores revision-checked decisions and history; invalid files leave existing work intact. Older backups containing reviewer/checklist metadata remain readable, but those fields are neither displayed nor required. New decisions contain no reviewer/checklist fields.

The shared file is [reviews.json on puzzle-review-data](https://github.com/MrTolchock/Drawing-App/blob/puzzle-review-data/reviews.json). The offline cache and outbox use `farbtupf.puzzle-review.v1`. The GitHub token is held separately in session storage and is never exported or committed. Development reviews with `?dev=1` stay local and do not publish.

New iterations change puzzle sign-off; changed content, difficulty, instructions or shared rendering/interaction/audio/typography reopen the relevant revisions. Old decisions remain in history or marked stale. Adding content cannot inherit a previous approval. A deployment does not sign off anything.

## Developer process

Work on a branch and push checkpoints. Publish to main when the owner authorizes it. Follow the [visual style](../design/VISUAL-STYLE.md) and [puzzle blueprint](../design/PUZZLE-BLUEPRINT.md), reuse the real renderers and give new iterations stable IDs and explicit solutions/difficulty.

Run `node tools/puzzle-catalogue.cjs` after runtime/content/art changes. Commit its generated catalogue and implementation fingerprint. Run the model, design, review and journey checks described in [Development](DEVELOPMENT.md); review fixtures live only in disposable test contexts. The review browser suite checks all 34 puzzle-level speech requests, one-click decisions, optional notes, backup compatibility, layout, revision gates and isolated previews. `tests/review-sync-browser.cjs` covers real UI saves and restoration across independent browser storage, plus offline edits and conflict resolution. Tests intercept GitHub requests and never use a real token or publish fixture approvals.

Preserve storage keys and historical snapshots. Bump the app/cache version for changed cached runtime files. No approval data ships with the app. The [catalogue](PUZZLE-CATALOGUE.md) lists every puzzle, competence and exact iteration definition; CI checks its revisions and generated pages.
