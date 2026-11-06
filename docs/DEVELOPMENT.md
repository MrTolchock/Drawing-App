# Development and validation

The app is static HTML, CSS and JavaScript with locally bundled Three.js and artwork. Serve the repository root; no app build or dependency installation is required.

```sh
python3 -m http.server 8000 --bind 127.0.0.1
node --test tests/*.test.cjs
```

Open `http://127.0.0.1:8000`. Browser scripts require Playwright and Chromium. Their current runner paths are specified in the scripts; adapt them for another machine. Set `FARBTUPF_BASE_URL` when using a different local port. Screenshots go to temporary directories.

| Check | Coverage |
| --- | --- |
| `tests/world-browser.cjs` | Free walking, held touch, discoveries, map, camera, responsive controls and offline positions |
| `tests/cinema-browser.cjs` | Opening, requests, heartlight, reunion, saved finale and framed faces |
| `tests/story-browser.cjs` | Nine repairs, chapter transitions, exact puzzle recovery, practice and offline ending |
| `tests/painted-browser.cjs` | Solid world picking, shared puzzle pictures and saved questions |
| `tests/play-browser.cjs` and `tests/play-layout-browser.cjs` | Revised activity interactions and layouts |
| Other `tests/*browser.cjs` files | Reading, handwriting, tours, timers and individual game families |

For the full story suite on software rendering, set `FARBTUPF_SOFTWARE_RENDERING=1`. It reduces raster resolution and disables shadows, leaving gameplay and state intact. Chromium touch emulation is not physical iPhone/iPad Safari testing. Installed voices and offline speech need device checks.

## Persistence

Retain existing localStorage and IndexedDB identifiers. Story repairs, exact unfinished story questions, chapter acknowledgements, ending cursor, free world position, exploration journal, tour, stars, pictures and settings are separate records. Optional practice and discoveries must not create story contributions. Exactly nine authored projects grow the Heart Tree.

`?screen=hub` remains a compatible entry to the single Waldspiele book. Do not clear storage to demonstrate a new feature. A separate browser profile provides an independent playthrough.

## Publish

GitHub Pages serves the repository root from `main`: <https://mrtolchock.github.io/Drawing-App/>. A push starts the Pages deployment. Check the workflow result and live assets before reporting a release as deployed.

When changing cached runtime content, bump the app version in `js/core/util.js` and cache identifier in `sw.js`; include new runtime assets in its list. Keep technical cache versions and persistent schema IDs even though active product documentation does not use a release-by-release narrative. Reload after an update downloads. Documentation outside the offline parent guide is not part of the installed game.

## Maintain the baseline

The [blueprint](../design/heart-tree/BLUEPRINT.md) describes implemented behaviour; the [review](../design/heart-tree/REVIEW.md) describes proposed next work. Archive superseded material and repair links rather than deleting project history. Keep runtime files and production assets at their working paths.
