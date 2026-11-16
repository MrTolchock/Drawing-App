# Gallery drawing-style correction — 16 November 2026

Waldpost 9.3.78, compared with 9.3.77 (`4797c63611ea60aac33079440407d5fb5477bf80`). All browser checks use disposable storage and intercepted review APIs. No production editorial records are written.

- [Full manual audit and every replacement ID](../../illustrations/GALLERY-STYLE-AUDIT.md): 235 drawings inspected; 38 redrawn, 197 retained. [Before/after comparison](comparison.png), [whole gallery before](all-sheets-before.png) and [after](all-sheets-after.png).
- [Artwork report](art-report.json) verifies that all 14 other atlases remain byte-identical and records the 31 affected puzzle IDs. All IDs and cell order are retained.
- All **112 model tests** passed. The compatible-review component fixtures now declare an unchanged test release explicitly; production tests verify that the former leaf's historical approvals cannot approve the new art. Production compatibility metadata is generated normally, without new aliases or approvals.
- All **31 puzzles × two viewports** passed fonts, asset roles, progress, overflow and child/review geometry; [layout report](layout-report.json).
- All **38 actual PNG downloads** matched their source atlas cell, had transparent corners and nonempty content; all three sheets fit desktop and phone and left storage unchanged. [Download report](gallery-download-report.json), [woodland objects](forest-objects-1080.png), [phone flowers](puzzle-flowers-390.png).
- A fresh reader using real pre-redraw revision IDs correctly reopened the squirrel's old approvals, retained the remote ledger unchanged, made zero writes and kept that state through reload and offline cache (`tests/review-compatibility-browser.cjs`). Compatible historical recovery and unchanged partial-round behaviour remain covered by the component fixtures.
- Installed-app checks from 9.3.77 passed complete offline installation, local/IndexedDB retention, partial-puzzle and dialog protection, failed-download recovery, first install and the independent recovery page.
- Design/archive checks preserve 610 originals; the fixed visual baseline preserves 14 references. Catalogue/fingerprint and image-library outputs are current.

The leaf and flower also appear in shared progress and celebrations, so **all 31 puzzles need normal review again**. Existing editorial decisions remain history; none are replaced or silently applied to the new drawings.
