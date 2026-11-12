# Development and validation

The app is static HTML, CSS and JavaScript with locally bundled Three.js and artwork. Serve the repository root; no app build or dependency installation is required.

```sh
python3 -m http.server 8000 --bind 127.0.0.1
node --test tests/*.test.cjs
```

Open `http://127.0.0.1:8000`. Browser scripts require Playwright and Chromium. Their current runner paths are specified in the scripts; adapt them for another machine. Set `FARBTUPF_BASE_URL` when using a different local port. Screenshots go to temporary directories.

| Check | Coverage |
| `tests/puzzle-review-browser.cjs` | All 1,048 finite iterations, real solutions, 34 phone/tablet layouts, parent/release gates, isolated previews, individual decisions, export/import and offline review |
| --- | --- |
| `tests/updates-browser.cjs` | Real archived app upgrades; abandoned-cache cleanup under a storage quota, foreground/online/manual checks, safe reload after saves, failed downloads/offline play, first-install loop prevention and independent recovery past a stale updater URL |
| `tests/input-typography-browser.cjs` | Parent-gate error/retry and immediate reopen; first-tap activation with finger movement in world, books, settings, puzzles and painting; rapid taps, scrolling, cancellation, overlay dismissal, mouse/keyboard and shared font roles at phone/tablet sizes |
| `tests/friends-mail-browser.cjs` | Closed-door letter delivery, friend arrow, puzzle completion, nearby mailman, next letter, refresh and offline continuity |
| `tests/den-browser.cjs` | Fox lying on the mattress, visible shelf books, direct free colouring, new outlines/postcards, back navigation, gallery save/resume and offline restoration at tablet/phone sizes |
| `tests/interface-browser.cjs` | Matching centred icons, shared settings, painted map and actual route, manual-only puzzle explanations, audible ambience/mute/background behaviour, retired leaves and offline saves |
| `tests/letter-sessions-browser.cjs` | Parent-selected letter budget, adult-only gallery, invited characters only, courier, home route, sleeping game over, offline persistence and parent-only restart |
| `tests/friends-library-browser.cjs` | Restored v2 catalogue, new host assignments, fixed difficulty, return paths, original gear and full atelier persistence |
| `tests/puzzle-rounds-browser.cjs` | All 33 routes at 1024/390, all 165 tasks with real answers/touch tracing, five-task celebration, retry, menu/world returns, host rotation, persisted work and offline assets |
| `tests/world-browser.cjs` | Free walking, held touch, discoveries, map, camera, responsive controls and offline positions |
| `tests/world-budget-browser.cjs` | Frame budget (blueprint 7A) on a loop round home and the fixed route through `?world=10x`: draw calls, triangles, near/far tiles and animated characters while drawing; build slices in a second pass with drawing skipped |
| `tests/cinema-browser.cjs` | Opening, requests, heartlight, reunion, saved finale and framed faces |
| `tests/story-browser.cjs` | Nine repairs, chapter transitions, exact puzzle recovery, practice and offline ending |
| `tests/painted-browser.cjs` | Solid world picking, shared puzzle pictures and saved questions |
| `tests/play-browser.cjs` and `tests/play-layout-browser.cjs` | Revised activity interactions and layouts |
| Other `tests/*browser.cjs` files | Reading, handwriting, tours and individual game families |

For the full story suite on software rendering, set `FARBTUPF_SOFTWARE_RENDERING=1`. It reduces raster resolution and disables shadows, leaving gameplay and state intact. Chromium touch emulation is not physical iPhone/iPad Safari testing. Installed voices and offline speech need device checks.

## Forest friends milestone

The default entry is Forest friends. See [implementation, source checks and persistence](FOREST-FRIENDS.md). Run `node tests/friends-mail-browser.cjs` (also available as `friends-browser.cjs`) for the letter loop; `node tests/friends-animation-browser.cjs` checks free bed sleep and Skip; use `?screen=forest` for original Heart Tree browser checks. `?software=1` affects rendering only, and `?dev=1` uses separate developer saves. `?perf=1` shows the frame counters, and `?world=10x` opens the ten-region test world with its own save.

## Persistence

Retain existing localStorage and IndexedDB identifiers. Story repairs, exact unfinished story questions, chapter acknowledgements, ending cursor, free world position, exploration journal, tour, stars, pictures and settings are separate records. Optional practice and discoveries must not create story contributions. Exactly nine authored projects grow the Heart Tree.

`?screen=hub` now opens the adult-gated puzzle workbench; the child gallery shortcut is retired. Do not clear storage to demonstrate a new feature. A separate browser profile provides an independent playthrough.

## Puzzle branches and review

Work on a feature branch for puzzle changes and push checkpoints there. Regenerate the [catalogue](PUZZLE-CATALOGUE.md) with `node tools/puzzle-catalogue.cjs` before committing. New or changed content/difficulty requires the [adult review workflow](PUZZLE-REVIEW.md); no editorial approvals are generated by tests or deployment. Do not merge or publish this branch without the owner’s later instruction.

## Publish

GitHub Pages serves the repository root from `main`: <https://mrtolchock.github.io/Drawing-App/>. A push starts the Pages deployment. Check the workflow result and live assets before reporting a release as deployed.

When changing cached runtime content, bump the app version in `js/core/util.js` and cache identifier in `sw.js`; include new runtime assets in its list. Keep technical cache versions and persistent schema IDs even though active product documentation does not use a release-by-release narrative. `js/core/updates.js` checks on startup, foreground/page restoration, reconnection and **Nach Updates suchen** in Settings, using `updateViaCache: none`. Automatic repeated checks are limited to once per minute; the parent button and reconnection bypass that limit.

A release activates only after its complete offline cache downloads successfully. Activation does not depend on JavaScript in an older installed app. The current page reloads once on an idle menu/settings screen or in the den, after asynchronous editor saves finish. Puzzles, drawing, outdoor play and open dialogs remain uninterrupted. The worker reads its own version's cache. Before downloading, it removes abandoned waiting downloads while retaining the working cache; this avoids running out of room before activation can clean up. New releases mark their active cache. For unmarked legacy releases, the earliest complete app cache is retained because their activation removed all other caches. Only this app's cached URLs are removed; LocalStorage, IndexedDB and other scopes remain intact. A failed download retains the working release and offline access.

For an installation stuck on older code, open the Home Screen app online and allow the update to download (roughly 30 seconds on a normal connection), then close it fully in the app switcher and reopen. The **App-Version** section in Settings shows the running version and offers a manual check for future updates. Opening a separate Safari tab can use different storage from the installed iPhone app, so verify the version inside the Home Screen app itself.

If Safari itself remains stale, open [the independent recovery page](../update.html). It registers a unique updater URL with HTTP caching disabled and confirms the installed version directly with the new worker. The ordinary app retains that updater URL so opening the game does not switch back to a stale registration. Recovery applies to the browser/storage container where it runs; Home Screen and Safari installations can update separately. Installation errors, including insufficient storage, are reported without resetting game data.

The upgrade suite reads real runtime snapshots from Git history. To reproduce the reported older installations and a 50 MiB storage limit with abandoned downloads:

```sh
FARBTUPF_LEGACY_REF=37bae81 FARBTUPF_LEGACY_VERSION=8.9.2 FARBTUPF_ORPHAN_CACHES=1 node tests/updates-browser.cjs
FARBTUPF_LEGACY_REF=1e2731c FARBTUPF_LEGACY_VERSION=9.0.0 FARBTUPF_ORPHAN_CACHES=1 node tests/updates-browser.cjs
```

Picture sheets are WebP (quality 82, exact alpha); keep the precached total under 25 MB. Atlases for canvas drawing load on first use, at most six at a time (`FK.visual.load`). Documentation outside the offline parent guide is not part of the installed game.

## Maintain the baseline

The [blueprint](../design/heart-tree/BLUEPRINT.md) describes implemented behaviour; the [review](../design/heart-tree/REVIEW.md) describes proposed next work. Archive superseded material and repair links rather than deleting project history. Keep runtime files and production assets at their working paths.


## Forest friends redesign visual target

For Forest friends work, read [Blueprint v2](../design/forest-friends/blueprint-v2.md) and the [preserved visual baseline](../design/forest-friends/visuals/baseline.md). The user endorsed the character/den direction and required picture-led navigation that does not depend on reading. The versioned mockups, original art, fixed screenshots and integrity manifest are development references; do not overwrite them to match an implementation.

At each visual milestone, capture equivalent game states at the documented viewports, compare them with the baseline, and record the build, screenshots, outstanding differences and intentional deviations. Verify baseline integrity with `python3 design/forest-friends/visuals/check-baseline.py`. Functional and persistence checks remain necessary in addition to visual comparison. The baseline is a design target, not evidence that the real game already implements its behaviour.

The new Forest friends model suite also tests unknown-schema refusal, corrupt drawing validation, temporary storage recovery and concurrent-tab conflicts. Its log-cap check deliberately exercises the full 10,000-event bound and can take several seconds.
