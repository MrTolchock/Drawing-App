# Waldbuch visual overhaul — milestones

Target: [blueprint](../../../../visual-overhaul/BLUEPRINT.md) and the mockups in [`board.html`](../../../../visual-overhaul/mockup/board.html). Each phase adds a section below; phase 6 (device check) records the iPad numbers.

## Phase 1 · Tokens and puzzle shell

Build: app/cache 8.5.0 (`farbtupf-v8.5.0-waldbuch-shell`), 9 November 2026, based on `719a0e2`. Chromium (SwiftShader), 1080 × 810 and 390 × 844 CSS pixels at device scale 2, reduced motion, `?software=1&dev=1` (developer save).

`css/waldbuch.css` holds the tokens and components and is loaded after every other stylesheet. It restyles existing elements by selector; no control moved in the DOM. The only script changes are a `data-host` attribute (screen root in `FK.go`, round card in `game.js`) that carries the friend accent and twig item, and a literal `null` that the Silben-klopfen screen printed next to its picture.

| State | Evidence | Against the mockup |
| --- | --- | --- |
| Nüsse zählen | [Tablet](nuts-1080.jpg), [phone](nuts-390.jpg) | Matches 2a: wooden back button on the scene, page with stitched edge and squirrel ribbon, nut twig, paper speaker/demo/hint buttons top right, host and name tag on the margin, wooden numeral tiles. Counters ≈ 108 px with a small scatter. |
| Correct answer | [Tablet](nuts-correct-1080.jpg), [phone](nuts-correct-390.jpg) | Chosen tile sinks and turns moss (2d). Confetti, host hop, check badge and moss page ring are phase 3. |
| Reimpaare lesen | [Tablet](rhyme-1080.jpg), [phone](rhyme-390.jpg) | Matches 2b: picture over the Andika target word, dotted rhyme arc, large picture-word tiles. Vector pictures (Tasse, Schal …) stay until phase 3 / new art. |
| Lies und zeig | [Tablet](sentence-1080.jpg), [phone](sentence-390.jpg), [after a tap](sentence-answer-390.jpg) | Sentence in Andika on the stage, large picture tiles; owl accent and lantern twig. |
| Welche Form fehlt? | [Tablet](shape-1080.jpg), [phone](shape-390.jpg) | Shell and tiles; the wooden-toy finish of the shapes is phase 3. |
| Wörter und Bilder | [Tablet](words-1080.jpg), [phone](words-390.jpg) | Mouse accent, berry twig. |
| Silben-Puzzle | [Tablet](syllables-1080.jpg), [phone](syllables-390.jpg) | Matches 2c: dashed paper slots with the unchanged bows, chips with coloured undersides. |
| Wort und Waldbild | [Tablet](word-picture-1080.jpg), [phone](word-picture-390.jpg) | Same page, tiles and twig (six items, as before). |
| Äpfel rechnen | [Tablet](apples-1080.jpg), [phone](apples-390.jpg) | Older family (2e): same page; host tag reads "Eichhörnchen spielt mit dir" (the existing text, now ≥ 15 px). |
| Beeren vergleichen | [Tablet](berries-1080.jpg), [phone](berries-390.jpg) | Step strip as pills with numbered discs, first step moss. |
| Waldmuster | [Tablet](pattern-1080.jpg), [phone](pattern-390.jpg) | Owl page with lantern twig. |
| Schreibspuren / Zahlenwege | [Writing](writing-1080.jpg), [number paths](number-paths-1080.jpg), phones `-390` | Same shell and buttons; the host (mouse, beaver) stands on the scene; canvases keep their colours. |

**Intentional deviations**

- The page sits in the normal flow (top row, then the page) rather than at fixed 200/70/850 × 690 px, so long older activities still scroll inside the page. At 1080 × 810 it lands at x 222, y 90, 836 px wide — close to the mockup.
- The page title stays visible as white Baloo on the scene next to the back button (guardrail: do not hide existing text). The mockup puzzle pages show no title.
- Ribbon and paper are background layers and the stitching is a dashed `outline` (rounded on Safari 16.4+, square inside the rounded page on older Safari). This needs no extra DOM and keeps the ribbon in place while a page scrolls.
- Phones: the host stays small in the page header (72 px) instead of 120 px above the page corner; it keeps the existing phone breakpoints and avoids covering the back button.
- Counter scatter is fixed per position (nth-child) rather than seeded by task id; it is equally stable across reloads.
- Schreibspuren and Zahlenwege pages have no ribbon: their tile column starts at the page corner.
- Step strips keep their existing icons; replacing them with library pictures belongs with the picture work in phase 3.

**Performance (P3, P8).** `grep -n "backdrop-filter\|blur(" css/` returns nothing: blur was removed from `.ff-nav`, `.ff-pad`, `.ff-overlay`, `.ff-hotspot`, the postcard overlay, legacy forest controls and modals; `.ff-painted-fill` uses a flat inset tint instead of `filter: blur(26px)`. Tiles carry one soft shadow (`--wb-lift`) plus a hard press underside; nothing that animates has a shadow and no `will-change` is set.

**Validation.** `node --test tests/*.test.cjs` (169 pass). Browser: `puzzles-browser.cjs` (all 24 routes at 1024/390, no overflow), `friends-library-browser.cjs`, `friends-mail-browser.cjs`, `interface-browser.cjs`, `den-browser.cjs`, `play-browser.cjs` pass. `puzzles-browser.cjs` had a pre-existing flaky locator (an answer button in a hidden survey screen can share the doubling answer's value); it is now scoped to the visible screen. `play-layout-browser.cjs` fails identically on the untouched base commit (it waits for the retired `#set-sound` settings control) and is not affected by this phase.
