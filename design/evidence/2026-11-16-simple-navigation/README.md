# Simpler symbols and shared navigation back — 16 November 2026

Waldpost 9.3.77. Artwork and revision comparisons use 9.3.75 (`6b272e1a4fc5fe3e13e28f6bdde94c041fa34d8d`); main's 9.3.76 landscape changes are integrated before publication. Real Chromium screenshots use disposable browser storage and intercepted review APIs. No production review records are written.

- All 112 model tests passed.
- `tests/artwork-browser.cjs` passed the simplified symbols, unchanged sender-aware letter, map and adult gate at tablet, phone and short landscape sizes; existing image-library search/filter/clipboard/PNG export also passed.
- `tests/navigation-browser.cjs` compared the actual arrow, background, border, shadow and size against the map back. Settings, gallery, review, puzzle and handwriting matched exactly. Actual return routes, phone layout and keyboard activation passed; see [navigation report](navigation-report.json).
- `tests/design-system-browser.cjs` passed all 31 puzzles at phone/tablet sizes, including child/review geometry, fonts, asset roles, progress and legacy storage; see [layout report](layout-report.json).
- Installed-app checks from 9.3.75 and integrated main's 9.3.76 passed partial-puzzle and dialog protection, saved-data retention, first install, failed-download/offline recovery and the independent recovery page. The fixture uses synthetic subsequent version strings for its update sequence. Its offline reload now waits for startup and the initial offline check before exercising the separate manual control.
- The [artwork/revision record](art-and-revisions.json) verifies the exact generated source, the runtime image hash, unchanged den/door/back atlas and all 31 unchanged puzzle revision IDs. Preparation recreated the runtime WebP byte for byte.
- The design/archive checks preserve 610 originals and the historical visual baseline preserves 14 references.
- After integrating main's landscape work, all 112 model tests and the complete navigation comparison passed again on the combined 9.3.77 runtime; no world changes were discarded.

The [Claude handoff](../../artwork/README.md#simplified-navigation-symbols--9377) includes the exact new prompt, reference, source PNG, packing manifest and shared back-component instructions. [Consistency audit and screenshots](../../STYLE-AUDIT.md).
