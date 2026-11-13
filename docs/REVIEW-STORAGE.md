# Shared review storage on GitHub

The authoritative review file is [reviews.json](https://github.com/MrTolchock/Drawing-App/blob/puzzle-review-data/reviews.json), on the repository's **puzzle-review-data** branch. This branch contains data and its README, separate from the game code. Every saved edit is a Git commit. Refreshing the app, using a different browser or reinstalling it does not delete published reviews.

The repository is public, so review statuses and optional notes are public. Only editorial data is shared: puzzle/iteration IDs, exact revisions, approved/improve/pending status, optional notes, inspection evidence and timestamps. Drawings, child progress, anonymous gameplay logs and credentials are not uploaded.

## Connect once to edit

1. Unlock **Einstellungen** with the existing adult calculation. Open **Prüfung auf GitHub → GitHub zum Speichern verbinden**. There is no additional gallery calculation.
2. Use the link to create a **fine-grained GitHub personal access token**. Select only **MrTolchock/Drawing-App** and grant repository **Contents: Read and write**. Choose an expiry that suits your reviewing session.
3. Paste the token into **GitHub-Zugriffstoken** in the app and press **Mit GitHub verbinden**. Do not put the token in chat, repository files, notes or exports. The app checks the owner's GitHub account.
4. Solve review tasks to approve them; use × to flag an iteration, with an optional comment. Completing the whole queue and celebration approves the puzzle only if every current iteration passed. Changes are saved automatically after a short pause; quick decisions are batched to respect GitHub’s limits. **Auf GitHub gespeichert** confirms shared storage. **Nur lokal gesichert** or a pending count means the upload has not finished.

The token stays in this browser tab's session storage; a refresh retains that connection. **GitHub trennen** removes it. Closing the session, a different browser or a reinstall can require connecting again **to edit**. Reading/playing needs no token: every browser loads published approvals automatically.

GitHub Pages is a static host, so it cannot authenticate repository writes itself. This connection works without another hosted service. The transport is separated from the review UI so a hosted GitHub sign-in flow can replace token entry later without changing the review ledger.

## Offline, recovery and multiple browsers

- Each device keeps the last verified GitHub snapshot and an outbox of unsaved decisions in `farbtupf.puzzle-review.v1`. Offline review remains possible. Reconnecting retries pending changes when the editing connection is available.
- Only confirmed GitHub approvals for the current exact revision release a puzzle. Flagging an item locally blocks it on that device immediately, even before upload. Other devices receive the flag when they refresh, resume or perform the periodic online check.
- Wait for **Auf GitHub gespeichert** before deleting/reinstalling an app with pending edits. Unsaved offline work exists only on that device; export it first if a connection is unavailable.
- Fresh browser storage restores published records automatically. **Prüfung exportieren/importieren** remains a revision-checked backup for drafts, and older backup metadata is readable. Imported decisions enter the outbox; they do not silently become published approvals.
- Different-item edits merge. If two browsers change the same revision differently, neither silently overwrites the other. **GitHub behalten** discards that local edit; **Meine Änderung speichern** explicitly replaces the current GitHub decision. Equal decisions are deduplicated.

## Format and maintenance

The ledger has `format: farbtupf-review-ledger`, `version: 1`, an `entries` object and `history`. Each entry is indexed by **stable key + @ + exact revision**. A key is an iteration ID or `puzzle:<id>`. Each entry contains `key`, `revision`, `status`, `note`, `at`, `seen` and an optional operation ID. Approved iterations require inspection evidence. Puzzle release also requires every current iteration to be approved.

Legacy approval records without matching inspection evidence are retained with their original status in `legacyStatus`, but remain pending until reviewed.

Different revisions coexist: an older app cannot replace the newer revision's sign-off. Content/difficulty/presentation changes still reopen their relevant current reviews. Do not clear the data branch when deploying code or merge it into the game branch. Empty initial data ships no approvals.

Authenticated updates use the GitHub Contents API with the current file SHA, reread/retry concurrent changes, and retain an idempotent outbox across interrupted responses. Large-file reads use immutable Git blobs. Credentials go only to `api.github.com` in the Authorization header, never to public raw-file reads or commit content. The app reads the public ledger at startup, on resume/reconnection and during periodic foreground checks.

`js/friends/review-repository.js` owns transport/merge/conflict handling; `puzzle-review.js` binds it to local decisions and the release gate; `js/ui/review-connection.js` supplies adult connection/status controls. The repository-data tests use a deterministic fake GitHub API. No real token or fixture approval is committed.
