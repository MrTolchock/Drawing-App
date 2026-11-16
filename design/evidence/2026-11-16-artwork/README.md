# Drawn navigation, letter and image library — 16 November 2026

Waldpost 9.3.75, built on main's 9.3.74 (`697f0528875d73e06df47d4708262a6130ed7979`). Screenshots come from the actual game and standalone library in disposable Chromium storage with intercepted review APIs. The fixtures never write to the production review branch.

## Results

- All **112 model tests** passed (`node --test tests/*.test.cjs`).
- `tests/artwork-browser.cjs`: visible square drawn navigation with targets at least 48 px; the actual sender's model portrait on generated stationery; letter fits 1080 × 810, 390 × 844 and 844 × 390; drawn map home/invitation/back; parent gate and Settings; zero completed puzzles or remote writes from browsing. Library search, sheet/active-use filters, clipboard ID, actual transparent PNG download and mobile layout passed.
- `tests/design-system-browser.cjs`: all **31 puzzles × two viewport sizes** passed child/review geometry, fonts, subject/identity roles, progress and no-hint checks; legacy storage remains intact.
- `tests/navigation-browser.cjs`: back buttons from Settings, puzzle review and reviewed puzzles return to the game without loops.
- `tests/letter-sessions-browser.cjs`: complete two-letter journey, ten answers, home/sleep/game over, offline reload, parent restart, an additional writing invitation and fifteen durable observations with three celebrations passed.
- `FARBTUPF_LEGACY_REF=697f052 FARBTUPF_LEGACY_VERSION=9.3.74 node tests/updates-browser.cjs`: old-to-new activation, unfinished-puzzle/dialog protection, local/IndexedDB retention, first install, complete offline cache, failed-download recovery and independent recovery page passed. The fixture uses synthetic subsequent version strings for its multi-step update sequence.
- Catalogue/fingerprint and image-library generation checks passed. All **31 puzzle revision IDs remain unchanged**; see [comparison and artwork hashes](art-and-revisions.json).
- Both artwork preparation commands recreated the committed WebPs byte for byte. An opaque-background preparation also verified that `transparent:false` removes the alpha channel.
- Design/archive checks preserve **610 originals**; the historical visual baseline preserves **14 references**.

The [browser report](report.json) records the navigation/letter sizes and real PNG/clipboard result. Source artwork, exact generation prompts and references are in the [Claude handoff](../../artwork/README.md). Screenshots are linked from the [consistency audit](../../STYLE-AUDIT.md).
