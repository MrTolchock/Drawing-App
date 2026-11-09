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

## Phase 2 · Menus

Build: app/cache 8.6.0 (`farbtupf-v8.6.0-waldbuch-menus`), 9 November 2026, on top of phase 1 (`d2857ff`). Same capture settings as phase 1.

All menu styles are in the phase 2 section of `css/waldbuch.css`. Script changes are content-only: the Wörter-und-Bilder card shows `mouse-sit` instead of the human "reader" picture, the bed hotspot shows the sleeping fox (`fox-sleep`), and the postcard carries `data-host` for its stamp colour and item.

| State | Evidence | Against the mockup |
| --- | --- | --- |
| Den | [Tablet](den-1080.jpg), [phone](den-390.jpg) | 1a: toolbar is one paper pill with 64 px square buttons; an unread letter (`data-mail=den-letter`) shows the 22 px fox-orange dot. Hotspots are cream discs with a gold ring; the bed uses the sleeping fox. |
| Letter | [Tablet](letter-1080.jpg), [phone](letter-390.jpg) | 1b: landscape postcard tilted −3°, inner border, stamp with a dashed border in the friend accent and the friend's item, two-line postmark. Static vignette, no blur. The card is still the only control (tap / Enter). |
| Map | [Tablet](map-1080.jpg), [phone](map-390.jpg) | 4.10: the map card is a book page with stitching; destinations are glowing rings, the invited friend's ring is gold. Pin sizes unchanged so they never overlap at 390. |
| Waldspiele | [Tablet](waldspiele-1080.jpg), [phone](waldspiele-390.jpg), [Blaumeise tab](waldspiele-bird-1080.jpg) | 3a: white title on the clearing, bookmark tabs with portraits and accent tops (selected tab taller and joined to the page), 4-column card grid on a page (3 below 860 px, 2 on phones), friend chips. No human figure. |
| Ausmalen | [Tablet](ausmalen-1080.jpg), [phone](ausmalen-390.jpg) | 3b: den painting under a flat `#5a3418a6` tint, six pages with friend-coloured washi tape and −2.5…+2° tilt; captions hidden, names remain the cards' `aria-label`. |
| Meine Bilder | [Empty](bilder-1080.jpg), [with pictures](bilder-hanging-1080.jpg), phones `-390` | 3c: pictures hang from wooden pegs on a rope and scroll sideways; empty state is the happy fox under an empty peg, the sentence stays for screen readers. |
| Einstellungen | [Tablet](settings-1080.jpg), [phone](settings-390.jpg) | 3d: one page over the clearing at 35 %, checkboxes drawn as switches (native inputs with `appearance:none`), timer and font choices as segmented controls; same order and labels. |

**Intentional deviations**

- The Waldspiele intro ("Ein Wald voller Spiele …") is visually hidden but kept for screen readers and tests; the title and selected tab carry the same meaning. The back button keeps Fuchs' portrait inside the wooden ring.
- Meine Bilder has no "new picture" frame at the end of the rope: the gallery has no existing new-picture action (blueprint: omit the frame then). Dates stay visible under each picture.
- The rope is a repeating sagging segment drawn in CSS rather than one long SVG path; it scrolls with the pictures.
- Den toolbar and hotspot rings (mockup 1a) were not assigned to a phase; they are done here because they are 2D menus. World hotspots share the ring style.

**P4.** Opening the letter/map, Waldspiele, a friend round, Ausmalen, painting, Meine Bilder or Einstellungen leaves the world `paused` and its clock stops (0.000 s advanced over 700 ms in each case, against 0.5–0.8 s in the den), so no 3D frames are drawn under them. This was already the case: `open()` pauses for overlays and the friends screen pauses on `leave()`.

**Validation.** `node --test tests/*.test.cjs` (169 pass); `friends-library-browser.cjs`, `den-browser.cjs`, `interface-browser.cjs`, `friends-mail-browser.cjs` and `puzzles-browser.cjs` pass.

## Phase 3 · Consistency

Build: app/cache 8.7.0 (`farbtupf-v8.7.0-waldbuch-consistency`), 9 November 2026, on top of phase 2 (`11bc136`). Same capture settings; celebration frames use normal motion, 450 ms after the tap.

| Item | Evidence | Result |
| --- | --- | --- |
| One cast (5.1) | probe of `FK.visual.art` | The crayon subjects are retired everywhere `FK.visual` draws, including paint stamps and the album: 🦊 / `fox` / `fox-animal` → Fuchs from the postcard sheet (cell 6), 🦫 / `beaver` → postcard Biber, 🐭 / `mouse` → `mouse-sit`, 🐰 / `rabbit` → `hare-sit`. The mailman fallback shows `mailman-portrait.webp`, and the old mascot uses the postcard Fuchs. |
| Picture families (5.2) | probe of every navigation picture | Waldspiele cards, tabs, toolbar and hotspots use no `people` picture and no crayon friend. |
| Vector → library (5.3) | — | Haus → `neighbour-houses`, Stein → `forest-stone`, Nuss → `forest-nut` (also the Nüsse-zählen counters, one nut each), Ast → `forest-branch`. The other vector words keep their 3 px ink outline until new art arrives (`ASSET-REQUESTS.md`). |
| Wooden-toy finish | [Shapes](toy-shapes-1080.jpg) ([phone](toy-shapes-390.jpg)), [colours](toy-colours-1080.jpg) ([phone](toy-colours-390.jpg)) | Shape answers and the shape scene: top-left highlight, same-hue outline at 70 % lightness, contact shadow. Farben-lesen objects: highlight clipped to the object's silhouette and a contact shadow, keeping their ink outline. Fills and colours unchanged. |
| Celebration (4.4) | [Friend round](celebrate-1080.jpg) ([phone](celebrate-390.jpg)), [older activity](celebrate-learn-1080.jpg) ([phone](celebrate-learn-390.jpg)) | On a correct answer: moss tile with a 52 px check badge, moss page ring, current twig item pops, host hops twice, 12 leaves/flowers/host items burst from the tile (1.4 s, transform and opacity only, `will-change` only on those pieces). It fits inside the existing advance delay; with reduced motion only the badge and moss tile show. A wrong answer is still only dashed and faded. |

The celebration lives in `js/ui/waldbuch.js` (`FK.waldbuch.celebrate`) and is called from the existing correct-answer paths: `FK.play.feedback` (learn, adventure, expedition), the friend rounds' `answer()`, and `read.js` (`right()` and a completed syllable word).

**Intentional deviations**

- Fuchs for 🦊 comes from the postcard sheet (cell 6, a listed source) rather than `fox-front.webp`: paint stamps need square cells and `fox-front.webp` is 249 × 360.
- The den's Ausmalen and Meine Bilder hotspots still use storybook-crayon object icons (pencil, pictures); there is no plush version yet.
- Farben-lesen objects keep their ink outline; only the shapes take the same-hue outline, so the colour objects stay as recognisable as before.
- Silbenblätter (leaf popping) keeps its own pop effect and is not given the page celebration on every leaf.

**Validation.** `node --test tests/*.test.cjs` (169 pass; the offline sheet test now reads each sheet's path from `FK.visual.source` and accepts the WebP postcard sheet); `puzzles-browser.cjs`, `den-browser.cjs`, `friends-mail-browser.cjs`, `interface-browser.cjs`, `friends-library-browser.cjs` and `play-browser.cjs` pass.

## Phase 4 · 3D world and characters

Build: app/cache 8.8.0 (`farbtupf-v8.8.0-waldbuch-world`), 9 November 2026, in four steps on `main`: 4.1 perf overlay, adaptive render scale and context loss (`52732b5`), 4.2 the look-dev forest streamed in tiles (`84fecd7`), 4.4 the baked plush cast (`0527cba`), 4.3 the `?world=10x` test world and budget test with the phase records (this commit). Chromium (SwiftShader) at 1080 × 810 and 390 × 844 CSS pixels, device scale 1 (the forest renders at 1.0–1.5× anyway), normal motion, shadows on, `?dev=1` (developer save); the 10× shots use `?world=10x` (its own save). Look-dev references rendered from `design/visual-overhaul/lookdev/` at the same size.

| Item | Evidence | Against the look-dev |
| --- | --- | --- |
| Forest at home | [Game](forest-1080.jpg) ([phone](forest-390.jpg)) · [look-dev hero](lookdev-hero-1080.jpg), [close](lookdev-close-1080.jpg) | Same light, materials and plants as the look-dev: low warm sun with soft static shadows, painted terrain, leaf-card crowns, fluted trunks with buttress roots, home tree with round door, window and lanterns, fireflies leading off to the invited squirrel (gold ring on its portrait). The game camera is the existing play camera (closer and steeper than the hero view), and its flower drifts are sparser than in the hero render. |
| Brook and arched bridge | [Game](forest-brook-1080.jpg) ([phone](forest-brook-390.jpg)) · [look-dev brook](lookdev-brook-1080.jpg) | Meandering brook with sandy banks, reeds and cattails, flowing water; the arched bridge crosses where it always did, and the log bridge sits upstream. |
| Log bridge (second crossing) | [Game](forest-log-1080.jpg) ([phone](forest-log-390.jpg)) · [look-dev log](lookdev-log-1080.jpg) | The fallen-log bridge is a second walkable crossing with short ramps at both ends; Fuchs walks over it on the home loop. |
| Plush cast | [Game models](cast-1080.jpg) ([phone](cast-390.jpg)) next to the [look-dev cast](cast-lookdev-1080.jpg) ([phone](cast-lookdev-390.jpg)) | All seven characters are the look-dev plush builders baked to skinned GLBs (fur and gloss materials, eyes drawn at runtime): proportions, colours and faces match; the far level of detail switches in beyond 8 m. The sheet shows front and three-quarter views; the look-dev cast page shows five of them, and Fuchs and Hase come from the same builders (they stand in the look-dev forest views). |
| Sleep pose in the den | [Den](den-sleep-1080.jpg) ([phone](den-sleep-390.jpg)) | Fuchs lies curled on the mattress with closed eyes during bed sleep; the den keeps its painting. |
| `?world=10x` | [Wild forest on a path between regions](world10x-wild-1080.jpg) ([phone](world10x-wild-390.jpg)), [placeholder region r3](world10x-region-1080.jpg) ([phone](world10x-region-390.jpg)) | Placeholder regions from the `home` decoration rules with their own seeds, joined by paths through wild forest; walkable only on clearings and paths. |

**Frame budget** (`tests/world-budget-browser.cjs`, blueprint 7A; software mode, so no shadow map):

| Walk | Draw calls (≤ 150) | Triangles (≤ 350 k) | Near tiles (≤ 25) | Far tiles (≤ 40) | Animated (≤ 6) | Build slice p95 (≤ 4 ms) / longest (≤ 12 ms) |
| --- | --- | --- | --- | --- | --- | --- |
| Loop round home (1×) | 108 | 253 k | 19 | 4 | 6 | 3.25 ms / 4.1 ms (13 slices) |
| Route through all ten regions (10×) | 108 | 233 k | 23 | 36 | 6 | 3.25 ms / 9.9 ms (777 slices) |

The forest is built while the child is in the den (8 ms slices, including the fireflies' route table) and its shaders are compiled before Fuchs steps outside. Outside, the streamer spends at most 3 ms per frame; it predicts each step from the steps of the same kind and leaves a step that would overrun for the next frame. With drawing skipped (on the iPad the GPU draws; here SwiftShader shares the CPU), the longest slice on the home loop was 2.9–4.1 ms over six walks; while drawing in SwiftShader, single 0.2 ms steps stall for 3–5 ms.

**Intentional deviations**

- Far ring ends at 68 m (tile centre) instead of 80 m: past 68 m the haze is over 90 %, and it keeps the far ring within 40 tiles on the whole 10× route.
- Plants are one merged mesh per near tile instead of one `InstancedMesh` per kind (one draw call instead of six); leaf cards are instanced.
- Characters and small rocks do not cast into the static shadow map (re-baked only every 8 m); characters keep soft contact-shadow discs.
- Routing over the region graph and the zoomed-out world map page wait for the first real new region; today only `home` has places.
- The den door does not swing open; going outside fades as before.
- The sleep pose lays the tail along the body rather than over the nose.
- Build slices are judged on the 95th percentile (and a 12 ms cap) in a pass with drawing skipped; the strict 4 ms maximum and the shadow re-bake frames are left for the iPad walk in phase 6.

**Validation.** `node --test tests/*.test.cjs` (170 pass, including the separate `?world=10x` save); `world-budget-browser.cjs` (above, run alone), `friends-mail-browser.cjs`, `friends-browser.cjs`, `friends-animation-browser.cjs`, `friends-click-browser.cjs`, `world-browser.cjs`, `den-browser.cjs`, `painted-browser.cjs`, `interface-browser.cjs`, `puzzles-browser.cjs`, `friends-library-browser.cjs` and `browser-smoke.cjs` pass. `forest-browser.cjs` (the historical Heart Tree game) times out waiting for its "Hase besuchen" button; it fails the same way on the phase 3 commit `8a4afe6`, and phase 4 did not touch that game.

## Phase 5 · Assets and offline

Build: app/cache 8.9.0 (`farbtupf-v8.9.0-waldbuch-webp`), 9 November 2026, `6226578` on `main`. Chromium (SwiftShader), 1080 × 810 and 390 × 844 at device scale 2, reduced motion, `?software=1&dev=1`, service workers off; each screen captured from app 8.8.0 (PNG sheets) and 8.9.0 (WebP) in the same run.

| Screen | Evidence (8.9.0) | Difference from 8.8.0 |
| --- | --- | --- |
| Waldspiele (menu sheet) | [Tablet](webp-waldspiele-1080.jpg), [phone](webp-waldspiele-390.jpg) | mean 0.6 / 0.3 of 255, no pixel over 16 |
| Muster (woodland and object sheets) | [Tablet](webp-pattern-1080.jpg), [phone](webp-pattern-390.jpg) | mean 0.6 / 0.3, 0.2 % of pixels over 16 |
| Wörter (word sheets) | [Tablet](webp-words-1080.jpg), [phone](webp-words-390.jpg) | mean 3.1 / 3.7 |
| Nüsse zählen (forest objects, clearing background) | [Tablet](webp-nuts-1080.jpg), [phone](webp-nuts-390.jpg) | tablet mean 3.3; phone 27.7 because the round drew 14 nuts instead of 19 |
| Wort und Waldbild (word sheets) | [Tablet](webp-word-picture-1080.jpg), [phone](webp-word-picture-390.jpg) | mean 9.2 / 4.8: a different random word (BLUME instead of BEERE) |

The larger differences come from tasks being chosen at random, not from compression; side by side the pictures cannot be told apart at full size.

| Item | Result |
| --- | --- |
| P6 WebP | The 18 PNG sheets in `assets/waldatelier/`, `assets/woodland/` and `puzzle-clearing` are WebP at quality 82 with exact alpha: 37.7 MB → 7.0 MB (target ≤ 8 MB). The PNGs are removed from the app and kept in git history. |
| Precache | 182 files, 16.0 MB in total (limit 25 MB). |
| P7 decode budget | Atlases are no longer preloaded at start-up; CSS backgrounds load with the screen that shows them. Canvas drawing (paint stamps) loads a sheet on first use and keeps at most six; the paint screens load the selected stamp's sheet before the first tap. Checked in Chromium: no sheet loaded at start, stamps draw, six sheets held after drawing every reward. Memory on the iPad is phase 6. |
| Updates (7B) | A new version downloads and waits; the open game keeps its cache. The next start in the den switches over with one automatic reload, never during a puzzle. Checked in Chromium with a changed `sw.js`. `navigator.storage.persist()` was already requested at start-up. |
| New pictures | None delivered yet (`words-four`, `words-five` in `ASSET-REQUESTS.md`); the interim fallbacks stay. |

**Validation.** `node --test tests/*.test.cjs` (170 pass; the offline sheet test now also checks the six-sheet limit); `puzzles-browser.cjs` (including offline reload), `friends-library-browser.cjs`, `interface-browser.cjs`, `den-browser.cjs`, `friends-mail-browser.cjs`, `browser-smoke.cjs`, `painted-browser.cjs`, `world-browser.cjs` and `friends-animation-browser.cjs` pass.
