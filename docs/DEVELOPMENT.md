# Development and deployment

Serve the repository root with `python3 -m http.server 8000 --bind 127.0.0.1`. There is no application build step. **Einstellungen → Zum Testen → Entwicklermodus** pauses usage logging until switched off, including after refresh. `?software=1` lowers rendering cost for automated checks; the older `?dev=1` route also suppresses logging and uses separate development saves/reviews. See [play-log modes](PLAY-LOG.md). Never clear real device storage for a demonstration.

## Required checks

```sh
npm ci --prefix tools
node tools/illustrations/style.cjs --check
node tools/map/layout.cjs --check
node tools/puzzle-catalogue.cjs
node tools/illustrations/library.cjs
node tools/illustrations/library.cjs --check
node tools/illustrations/handoff.cjs --check
node tools/check-design.cjs
node --test tests/*.test.cjs
node tests/design-system-browser.cjs
node tests/letter-sessions-browser.cjs
node tests/navigation-browser.cjs   # map dismissal; same back/frame in menus, review and puzzles; correct routes, phone and keyboard
node tests/puzzle-gallery-browser.cjs   # gallery: only signed-off puzzles, friend filter, five-task round without saving
node tests/review-seen-browser.cjs   # an answered review task is approved even if its seen mark was lost; dialog buttons fit
node tests/play-log-browser.cjs
node tests/puzzle-review-browser.cjs
node tests/review-sync-browser.cjs
node tests/review-compatibility-browser.cjs
node tests/puzzle-feedback-browser.cjs
node tests/artwork-browser.cjs
node tests/drawn-map-browser.cjs   # compact map, no header icons, outside tap/Escape/focus, pan safety; all 13 named pins and real routes at phone/tablet/landscape
node tests/swamp-navigation-browser.cjs   # real Steg journeys in both directions, Frosch arrival, steering collision and no off-deck frames at phone/tablet sizes
node tests/gallery-images-browser.cjs   # all 38 redrawn pictures: real PNG exports, source-cell match, alpha and phone layout
```

Browser suites require Playwright and Chromium. Set `PLAYWRIGHT_MODULE`, `CHROMIUM_PATH` and optionally `FARBTUPF_BASE_URL` for your installation. The review suite solves all 983 exact iterations, exercises native touch/mouse input for every puzzle, and checks whole-pool approval/rejection, gesture cancellation, persistence and offline review. The design suite compares review and child-play paper/writing dimensions for all 32 puzzles at phone/tablet sizes; `FARBTUPF_GAMES=add,trace,trace-numbers` limits its content pass during targeted work. Letter sessions checks Settings, real invitations, access restrictions, ten actual answers, mailman, home, sleep, reload/offline and adult restart. The design suite checks asset/font roles and current entry points. Screenshots go to `/tmp` unless an output path is set.

`node tools/check-design.cjs` verifies current links, runtime/offline dependencies, picture roles and archived file hashes. The original 14 fixed visual references remain intact; run `python3 legacy/design-history/forest-friends/visuals/check-baseline.py`. Retired code, assets, drafts and browser/model tests live under `legacy/` and are excluded from current CI and offline downloads. `legacy/manifest.json` records original paths and hashes, including the former `archive/` tree; completed image requests keep their actual historical filenames. Current authoring sources and tools stay under `design/` and `tools/`.

The [local play-log](PLAY-LOG.md) suite exercises exact answers/definitions, input method, dialog-time exclusion, interrupted/reloaded rounds, robot controls, handwriting outcomes, review exclusion, the real Settings JSON download and isolated deletion at phone/tablet widths. It also verifies developer-mode on/off and reload, zero test events/definitions, the navigation marker, subsequent normal recording, separate resumed run IDs and the legacy URL exit. Letter sessions additionally verifies all fifteen outcomes, three celebrations and offline log retention through actual child journeys. These suites use disposable browser storage and intercepted review APIs.

## Authoring

Read [Visual style](../design/VISUAL-STYLE.md) and [Puzzle blueprint](../design/PUZZLE-BLUEPRINT.md). Register finite, bounded content in `js/friends/puzzle-catalogue.js` and the inventory in `library.js`. Regenerate catalogue pages and the per-puzzle implementation fingerprints after any runtime/art change. Review is required again for every changed content/difficulty/presentation revision; deployment never grants approvals.

Current character sculpt source: `tools/characters/plush.js`, baked to GLBs for the live world. All UI identities now use the canonical painted cast in `assets/forest-friends/character-portraits.webp`: letters, puzzle context, map pins, menus, companions and celebrations. Use `friend-portraits` and `fox-sleep-portrait`; `tools/portraits/` creates development model references only. The approved top-down map uses `design/artwork/world-map.json`; [map calibration](../tools/map/README.md) aligns real world locations with the painting and keeps named 64 px pins separate. Learning nouns/actions remain in the drawn Waldatelier library. Preserve saved template IDs, settings records and historical localStorage/IndexedDB keys.

Every image-generator request starts with the [canonical style](../design/illustrations/STYLE.md). `node tools/illustrations/style.cjs --request <id>` prepares the complete prompt, actual canonical reference-image paths and transparency flag. Edit registered subject/layout briefs, regenerate with `node tools/illustrations/style.cjs`, then run `--check`; CI enforces the shared block, fixed reference pixels, current source records and absence of unregistered/historical prompts. The [artwork handoff](../design/artwork/README.md) explains each role. All puzzle drawings remain in [one browsable library](../assets/waldatelier/README.md). Historical original prompts/drafts/evidence are archived as provenance, not future style instructions. Documentation/legacy/prompt changes alone do not need a runtime version bump or reopen puzzle reviews.

The [generator-input index](../design/artwork/GENERATOR-INPUTS.md) and committed `generator-inputs.json` provide complete portable requests and preparation inputs for other AI models. After changing a brief, inventory, source or reference, regenerate style prompts, the library and then `node tools/illustrations/handoff.cjs`. CI runs `handoff.cjs --check` to reject stale inputs, missing per-sheet subject IDs and undocumented offline images.

Work on a branch for reviewable changes, commit and push checkpoints. Merge/push `main` only when the owner authorizes publication. Keep current rules in `design/`; archive superseded documents with a clear index. No runtime reference may load archive material.

## Shared review storage

See [REVIEW-STORAGE.md](REVIEW-STORAGE.md). Code changes stay on a feature branch; editorial records use the separate `puzzle-review-data` branch. Keep that data branch through deployments. Never commit a token or actual editorial approvals in the app bundle. `tests/review-repository.test.cjs` checks conflicts, retry/idempotency, revisions, offline recovery and token isolation; browser suites intercept GitHub with `review-repository-support.cjs`. The production ledger is never used for fixture writes.

## Publish and installed-app updates

GitHub Pages serves `main`: <https://mrtolchock.github.io/Drawing-App/>. Bump `FK.VERSION` in `js/core/util.js` and the cache identifier in `sw.js` whenever cached runtime content changes. Include every active dependency in the offline list. Check CI and the Pages deployment, then compare live critical assets with the pushed commit before reporting deployment.

The game is named **Waldpost** (`FK.APP_NAME`). Browser/install labels and download filenames use this name. Keep historical `farbtupf`/`farbklecks` storage keys, JSON format IDs, updater messages, cache prefixes and the manifest's app identity/URLs stable so existing journeys, logs, reviews and installations remain compatible. Archived names stay historical.

A release activates only after its complete offline cache downloads successfully. `js/core/updates.js` checks startup, resume, reconnection and the parent **Nach Updates suchen** button. Active puzzles and open dialogs are not interrupted; the historical asynchronous-save barrier remains for compatibility. Drawing/gallery routes are retired and existing IndexedDB records remain intact. The worker retains a working cache when installation fails and removes abandoned downloads without clearing localStorage or IndexedDB.

[update.html](../update.html) is the independent recovery page for a stale installation. It requests a fresh updater URL and confirms the installed release. Safari tabs and installed Home Screen apps can have separate storage: verify the version in the app being used. `tests/updates-browser.cjs` exercises previous-release update behaviour using Git snapshots. For the prior 9.2.2 release, run `FARBTUPF_LEGACY_REF=7cb9821 FARBTUPF_LEGACY_VERSION=9.2.2 node tests/updates-browser.cjs`. Its disposable fixture authorizes one invited counting puzzle to verify that updates preserve partial answers. Physical iPad/Safari, sound comfort and child suitability remain owner checks.
