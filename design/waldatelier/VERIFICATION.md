# Waldatelier verification · 2026-11-05

- All 44 Node content, storage-compatibility and asset checks pass. Every runtime JavaScript file parses and every offline asset exists.
- Browser plugin: completed all five Sternenrakete tasks, six Wort und Bild tasks, an I handwriting trace, a seven-point picture, and all 13 guided fox colouring anchors. Rewards update correctly.
- Original watercolour stamps paint onto the canvas; undo removes one stamp. Saving, gallery viewing, and returning from a creative mission preserve the drawing. The mission reminder, album and parent settings were inspected.
- The two new colouring pages pass eight region checks: each page at 1600 × 1000, 1000 × 1600, 720 × 960, and 720 × 480. Anchors stay off outlines and differently coloured anchors occupy different regions.
- Offline: stopped the local HTTP servers, reloaded Farbtupf, and opened the gallery and reading game. All new artwork appeared, six earned stars remained, and both the fox painting and free drawing were present. The server was then restarted for the review preview.
- Responsive review uses the actual app inside 390 × 844 and 820 × 1180 frames. This browser's viewport override did not change its 1280 × 720 viewport, so the frames provide genuine document widths. Home, reading, learning and phone painting were inspected. Their bodies/screens have no horizontal overflow. Guided dice labels remain countable; the palette intentionally uses corresponding numerals.
- The repository's newer iPhone safe-viewport, opaque-page and compositing-layer fixes are integrated. Physical iPad/iPhone Safari and installed Home Screen behaviour have not been tested here.
- The final narrow-screen painting title is readable after removing the old outline-scaling rule. The phone stamp picker shows matching artwork, with horizontally scrollable category tabs. The main app's browser error log is empty.

`tests/waldatelier-responsive.html` and `tests/waldatelier-paint.html` reproduce the visual and region checks through a local HTTP server. They are excluded from the offline install.
