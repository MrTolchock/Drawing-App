# Shared review storage on GitHub

The authoritative review file is [reviews.json](https://github.com/MrTolchock/Drawing-App/blob/puzzle-review-data/reviews.json), on the repository's **puzzle-review-data** branch. This branch contains data and its README, separate from the game code. If the branch or file does not exist yet, the first sync with a connected token creates it automatically as its own history holding only an empty `reviews.json`; until then, reading without a token simply shows no shared approvals. Every saved edit is a Git commit. Refreshing the app, using a different browser or reinstalling it does not delete published reviews.

The repository is public, so review statuses and optional notes are public. Only editorial data is shared: puzzle/iteration IDs, exact revisions, approved/improve/pending status, optional notes, inspection evidence and timestamps. Drawings, child progress, anonymous gameplay logs and credentials are not uploaded.

## Connect once to edit

1. Unlock **Einstellungen** with the existing adult calculation. Open **Puzzle-Prüfung → Prüfung auf GitHub → GitHub zum Speichern verbinden** on the all-puzzle overview. There is no additional gallery calculation.
2. Use the link to create a **fine-grained GitHub personal access token**. Select only **MrTolchock/Drawing-App** and grant repository **Contents: Read and write**. Choose an expiry that suits your reviewing session.
3. Paste the token into **GitHub-Zugriffstoken** in the app and press **Mit GitHub verbinden**. Do not put the token in chat, repository files, notes or exports. The app checks the owner's GitHub account.
4. Solve review tasks to approve them. Use × to flag an iteration with an optional comment, or save a general comment to reopen the whole puzzle. The queue ends automatically. All current approvals must be confirmed on GitHub for release. Changes save locally first and sync to GitHub in batches. **Auf GitHub gespeichert** confirms shared storage. **Nur lokal gesichert** or a pending count indicates an upload is due.

The token stays in this browser tab's session storage; a refresh retains that connection. **GitHub trennen** removes it. Closing the session, a different browser or a reinstall can require connecting again **to edit**. Reading/playing needs no token: every browser loads published approvals automatically.

GitHub Pages is a static host, so it cannot authenticate repository writes itself. This connection works without another hosted service. The transport is separated from the review UI so a hosted GitHub sign-in flow can replace token entry later without changing the review ledger.

## Offline, recovery and multiple browsers

- Each device keeps the last verified GitHub snapshot and an outbox of unsaved decisions in `farbtupf.puzzle-review.v1`. Offline review remains possible. Reconnecting retries pending changes when the editing connection is available.
- Only confirmed GitHub approvals for the current exact revision release a puzzle. Flagging an item locally blocks it on that device immediately, even before upload. Other devices receive the flag when they refresh, resume or perform the periodic online check.
- Wait for **Auf GitHub gespeichert** before deleting/reinstalling an app with pending edits. Unsaved offline work exists only on that device; reconnect and let it upload first.
- Fresh browser storage restores published records automatically. The Puzzle-Prüfung page no longer offers file export/import; GitHub is the backup.
- Different-item edits merge. If two browsers change the same revision differently, neither silently overwrites the other. **GitHub behalten** discards that local edit; **Meine Änderung speichern** explicitly replaces the current GitHub decision. Equal decisions are deduplicated.

## Format and maintenance

The ledger has `format: farbtupf-review-ledger`, `version: 1`, an `entries` object and `history`. Each entry is indexed by **stable key + @ + exact revision**. A key is an iteration ID or `puzzle:<id>`. Each entry contains `key`, `revision`, `status`, `note`, `at`, `seen` and an optional operation ID. Approved iterations require inspection evidence. Puzzle release also requires every current iteration to be approved.

Legacy approval records without matching inspection evidence are retained with their original status in `legacyStatus`, but remain pending until reviewed.

Different revisions coexist: an older app cannot replace a newer content revision's sign-off. Each puzzle fingerprints its own finite definitions, renderer and reachable helpers, relevant CSS, fonts, model portraits and the decoded picture cells it uses. Changing another puzzle or another cell in the same atlas no longer reopens unrelated reviews. Shared changes still reopen every affected puzzle. `tools/puzzle-review-build.cjs` computes the scope; `node tools/puzzle-catalogue.cjs` writes the runtime revisions.

On every read, notes from older revision entries and ledger history are restored into the device's read-only history, even if the current selected decision has an empty note. Identical records are deduplicated across refreshes. **Bisherige Hinweise** in the puzzle details exposes these notes and links them to current stable iterations. This restoration neither changes the chosen exact-revision decision nor creates an upload; a historical note or approval cannot release changed content.

For releases that used the former global fingerprint, `tools/puzzle-review-baselines.json` records definition and presentation hashes derived from the named Git commits. A historical revision is accepted only when both hashes match the current puzzle. Recovery is read-only: original notes, evidence and timestamps stay intact, with no token, new approval or upload. Across equivalent revisions, the latest published decision wins; rejection wins a timestamp tie. Unknown or changed revisions remain pending. Baselines contain no editorial decisions. To reproduce them, fetch history and run `node tools/puzzle-review-build.cjs` with the recorded full commit IDs, then regenerate the catalogue.

Do not clear the data branch when deploying code or merge it into the game branch. Empty initial data ships no approvals.

Authenticated updates use the GitHub Contents API with the current file SHA, reread/retry concurrent changes, and retain an idempotent outbox across interrupted responses. Large-file reads use immutable Git blobs. Credentials go only to `api.github.com` in the Authorization header, never to public raw-file reads or commit content. The app reads the public ledger at startup, on resume/reconnection and during periodic foreground checks.

`js/friends/review-repository.js` owns transport/merge/conflict handling; `puzzle-review.js` binds it to local decisions and the release gate; `js/ui/review-connection.js` supplies adult connection/status controls. The repository-data tests use a deterministic fake GitHub API. No real token or fixture approval is committed.

## Deleting comments

The optional `deletedNotes` array stores `{key, note, at}` deletion markers. They suppress that stable-key/text pair through the recorded time, across every older graphics revision and history duplicate. Markers merge independently of decision conflicts; they never change a decision, exact revision, inspection evidence or release status. They are included in backups and the durable offline outbox count until GitHub acknowledges them. Readers without a token restore them automatically. A later explicitly saved comment has a newer timestamp and remains visible. Existing ledger entries, decision history and Git commits remain audit records; the deleted comment is removed from the review interface, including the general field and iteration list.
