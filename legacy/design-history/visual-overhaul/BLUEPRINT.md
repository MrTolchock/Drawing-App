# Waldbuch — visual overhaul blueprint

**Status:** design approved for implementation handover, 9 November 2026.
**Scope:** visuals, consistency and iPad performance of Forest friends (the default game).
**Mockups:** [`mockup/board.html`](mockup/board.html) (open locally via the dev server), with the reference stylesheet [`mockup/waldbuch.css`](mockup/waldbuch.css).
**3D look-dev:** [`lookdev/`](lookdev/) — the forest in the new style, rendered with three.js (`/design/visual-overhaul/lookdev/?view=hero`).
**Asset requests:** [`ASSET-REQUESTS.md`](ASSET-REQUESTS.md).

This document is written for the implementing agent (Claude Code). Every item names the file to change, the target, and how to check it. Where something needs new artwork, the interim fallback is stated so no phase blocks on art.

---

## 0. Guardrails (read first)

1. **Do not change gameplay.** Puzzle rules, task pools, answers, choice order, number of tasks, step order, buttons and their behaviour, auto-advance timing, the letter loop, movement rules, saves and logs stay as they are. If a visual change would require moving or removing a control, keep the control and restyle it instead.
2. **Do not change frozen references.** `design/forest-friends/visuals/` originals, `review-v*.html`, baselines and `check-baseline.py` stay untouched. Add new milestone screenshots under `design/forest-friends/visuals/milestones/waldbuch/`.
3. **Persistence identifiers and IndexedDB stay.** No migration is needed for this work.
4. **Safari 15+ on iPad 9th generation is the target device.** No `backdrop-filter`, no `filter: blur()` over the WebGL canvas, no `color-mix()`, no CSS nesting, no `:has()` in layout-critical rules. Animations use `transform` and `opacity` only.
5. **Bump** the app version in `js/core/util.js` and the cache id in `sw.js` with each phase that changes runtime files; add new runtime assets to the `sw.js` list.
6. Run `node --test tests/*.test.cjs` and the affected browser suites before each push (see `docs/DEVELOPMENT.md`). Some browser tests assert on class names or computed styles (for example `puzzles-browser.cjs` checks `puzzle-clearing` in the background image): update the assertion only when the visual change is intended, never the behaviour checks.

---

## 1. Concept: Fuchs' Waldbuch

The game is a picture book that Fuchs carries through the forest.

- **The world** (den, forest, characters) is plush 3D / plush painting: soft felt, warm low sun, no outlines. Master reference: `design/forest-friends/visuals/characters-v1.png`.
- **Every puzzle and every menu is a page of the book**: cream paper with a stitched edge, lying in a woodland clearing. The friend who set the puzzle stands on the page margin. Progress is five of that friend's items on a twig. Answers are wooden blocks with a paper face.
- **Pictures inside the book** (words, objects, scenes) come from the storybook illustration library. **The friends themselves always come from the master cast**, never from a different drawing.

Three looks currently compete: plush, storybook crayon, and flat vector drawings (`js/friends/art.js`). The flat vector look is phased out (section 5).

---

## 2. Design tokens

Create **`css/waldbuch.css`** with the `:root` tokens and component classes from `mockup/waldbuch.css` (copy them; drop the `@font-face` block because `base.css` already loads the fonts). Load it in `index.html` **after** all existing stylesheets.

| Token | Value | Use |
| --- | --- | --- |
| `--wb-ink` | `#4b3b2d` | all text and drawn UI glyphs |
| `--wb-ink-soft` | `#7a6650` | secondary text, never below 15 px |
| `--wb-paper` | `#fff8e8` | page and card faces |
| `--wb-paper-inset` | `#f5ebd2` | stages, wells, empty slots, twig |
| `--wb-paper-edge` | `#dcc59c` | hairlines, stitching |
| `--wb-honey` / `--wb-honey-deep` | `#e8b968` / `#c98d3e` | button rims, rings |
| `--wb-timber` / `--wb-timber-deep` | `#a8703f` / `#74482a` | the 6 px "press" underside, wooden buttons |
| `--wb-moss` / `--wb-moss-deep` / `--wb-moss-tint` | `#7f9a48` / `#4f6b34` / `#e8efcf` | correct, chosen, current step |
| `--wb-focus` | `#3f6a8c` | keyboard focus ring (4 px, 5 px offset) |
| Friend accents | fox `#d9692a`, squirrel `#cf7a33`, bluetit `#4f86b8`, owl `#9c7046`, beaver `#8a5a34`, mouse `#968a80`, hare `#4d6886` | ribbon, tag border, stamp, tape, tab top |
| Radii | 32 / 24 / 18 / 12 px | page / tile / chip / small |
| Shadow | `--wb-lift: 0 10px 24px #5a3f2420` | the only soft shadow |
| Press | `--wb-press: 6px` | timber underside; pressed = translateY(4px) |

**Type.** Baloo 2 for UI, titles and numerals. Andika for every word a child reads (prompts, scored words, sentences, syllables): 30–48 px for scored text, 26 px for prompts. Secondary text ≥ 15 px (the current 9–11 px "Eichhörnchen spielt mit dir" line is too small; it becomes the host tag).

**Touch targets (iPad, CSS px).** Buttons ≥ 64, answer tiles ≥ 120 (word tiles ≥ 200 × 200), hotspots 84.

Each friend's accent is set as `--accent` on the screen root from the active host (`squirrel`, `bird`, `owl`, `beaver`, `mouse`): add a `data-host` attribute where the screen is mounted and map it in CSS (`[data-host=bird]{--accent:var(--wb-bluetit)}` …).

---

## 3. Components

All in `css/waldbuch.css`. The mockup uses exactly these classes; in the game, **apply them to existing elements by selector** rather than renaming DOM nodes, so tests that query existing classes keep working.

| Component | Class in mockup | Existing elements to restyle |
| --- | --- | --- |
| Wooden round button | `.wb-btn--wood` | `.btn-back` in all puzzle/menu screens |
| Paper round button | `.wb-btn` | speaker (`Spiel erklären`), demo/example buttons, `rd` speaker |
| Toolbar | `.wb-hud` + `.wb-btn--square` | `.ff-nav` and its four icon buttons |
| Hotspot ring | `.wb-spot` | `.ff-hotspot` (den and world portrait bubbles) |
| Book page | `.wb-page` | `.learn-body`, `.rd-stage`, `.forest-book-body`, `.ff-card` in rounds, trace/dots containers |
| Ribbon | `.wb-ribbon` | new decorative `::before` on the page (no DOM needed) |
| Host on margin | `.wb-host` + `.wb-tag` | `.play-context .forest-portrait` and its label (move visually with CSS positioning, not in DOM order) |
| Progress twig | `.wb-twig` | `.woodland-progress`, `.rd-steps`, `.ff-progress` (keep the same count and done/current classes; swap the dot for the host item picture) |
| Stage | `.wb-stage` | `.learn-visual`, `.ff-task-scene`, `.play-garden`, `.exp-bowl`, `.rd-pic`, `.play-word-card` |
| Answer tile | `.wb-tile`, `.is-chosen`, `.is-retry`, `.is-focus` | `.learn-answer`, `.ff-answer`, `.rd-card`, `.learn-button` (answer variants). Map `.correct`/`.chosen`/`.right` → chosen; `.try-again`/`.ff-retry`/`.dim` → retry |
| Syllable chip | `.wb-chip` | `.rd-chip` (keep `--c` colours) |
| Step strip | (Äpfel rechnen mockup) | `.play-steps` / `.play-step`: replace outline icons with small library pictures, current step moss |
| Celebration | `.wb-confetti`, `.wb-hop` | added on the existing "correct" state, inside the existing advance delay |
| List card | `.wb-card`, `.wb-friend` | Waldspiele tiles `[data-game]` |
| Bookmark tab | `.wb-tab` | `.ff-library-tabs` buttons |
| Tape / peg | `.wb-tape`, `.wb-peg` | Ausmalen page cards, Meine Bilder cards |
| Switch / segmented | `.wb-switch`, `.wb-seg` | `.ff-setting-toggle` checkboxes (style the native input with `appearance:none`), timer/font choices |

Progress items per host: squirrel = nut, bluetit = feather, owl = lantern, beaver = branch, mouse = berry (all from `forest-objects.png`, already loaded).

---

## 4. Screens

Screens are specified at 1080 × 810 (iPad 9 landscape). Phone layouts (390 wide) keep their current breakpoints: page full width, host shrinks to 120 px and sits above the page's top-left corner, tiles wrap.

### 4.1 Den (mockup 1a)
- Painting `den-v2.webp` unchanged.
- Fox: the baked plush Fuchs (section 6.2). Its idle position stays.
- Hotspots: `.wb-spot` with icons: Waldspiele = book icon, door = letter/door icon as now, **bed = sleeping-fox picture** (`forest-actions` `fox-sleep`), pictures = pictures icon, table = pencil. Remove `backdrop-filter` from `.ff-hotspot`.
- Toolbar `.ff-nav`: one pill, `#fff8e8e6` background (no blur), four 64 px square buttons. Unread letter = 22 px fox-orange dot (keep the existing state that drives it).

### 4.2 Letter (mockup 1b)
- Keep the postcard and its tap/Enter behaviour; no new buttons.
- Replace `.ff-overlay` `backdrop-filter` and `.ff-painted-fill` `filter: blur(26px)` with: (a) pause the 3D loop while the overlay is open (already paused for `anim`; extend to overlays), (b) a static radial vignette `radial-gradient(ellipse at 50% 48%, #3a24127a, #2a180bcc)`.
- Stamp: dashed border in the friend accent, friend's item picture inside; add a 2-line postmark SVG. Card rotation −3°, stitched inner border.

### 4.3 Puzzle page (mockups 2a–2e) — all 29 puzzles
Layout at 1080 × 810: scene background (`puzzle-clearing`, converted to WebP), wooden back button at top-left (22, 22), page at x 200, y 70, 850 × 690 with radius 32 and stitched inner border, ribbon at page x 60, twig centred at page top 34, speaker/demo buttons at page top-right, host 230 px wide at bottom-left overlapping the page edge by 30 px with name tag in the friend accent.

Inside the page the existing content keeps its order: prompt (when present) → steps (when present) → stage → answers → hint/feedback. Do not hide existing text the old activities show; only restyle it.

Per family:
- **Nüsse zählen:** counters 118 px, small random rotation (±8°) and vertical jitter (±10 px) seeded by task id so a saved task looks the same after reload. Each counter remains exactly one item.
- **Reimpaare lesen:** target picture 170 px over the target word; two word tiles 200 × 200 with picture 120 px and Andika 30 px word. Decorative dotted arc between target and choices (pure SVG, no meaning).
- **Lies und zeig:** sentence Andika 48 px in the stage; picture tiles 230 × 210.
- **Welche Form fehlt?:** keep the SVG scene, re-render with the "wooden toy" finish (section 5.3).
- **Wörter und Bilder / Silben-Puzzle / Wort und Waldbild / Silbenblätter / Farben lesen:** chips and slots as in mockup 2c; bows unchanged.
- **Older activities** (learn/adventure/expedition screens): same shell; step strip restyled; any appearance of Fuchs uses the master fox (section 5.1).
- **Schreibspuren, Zahlenwege:** same shell and buttons; their canvases keep their own colours.

### 4.4 Feedback (mockup 2d)
On a correct answer, within the existing delay before auto-advance: chosen tile sinks and turns moss with a 52 px check badge; the page edge gains a moss ring; the current twig item pops (scale 1.3); host gets `.wb-hop` (two hops, 0.7 s each); up to 12 confetti items (leaf, flower, the host item) burst from the tile (1.4 s). A wrong answer only gets `.is-retry` (dashed, 65 % opacity) as now. `prefers-reduced-motion` turns all of it into the static end state.

### 4.5 Waldspiele (mockup 3a)
White title on the scene (Baloo 40, text-shadow timber), bookmark tabs with friend portraits (Alle = book icon, Malatelier = palette), page below with 4-column card grid (2 on phones). Card = 92 px picture, Baloo 20 title, friend chip with portrait. **Replace the human "reader" picture** for Wörter und Bilder with `mouse-sit`; check every card picture against section 5.

### 4.6 Ausmalen (mockup 3b)
Background = den painting with a flat `#5a3418a6` overlay (no blur). Six page cards, each with friend-coloured washi tape and a small rotation (−2.5° … +2°). The small visible captions under each page are hidden; the page names stay as `aria-label` for screen readers and tests.

### 4.7 Meine Bilder (mockup 3c)
Same backdrop. Saved pictures hang from wooden pegs on a curved rope (one SVG path, horizontal scroll). The last slot is a dashed empty frame with a pencil button that starts a new picture (same action as the existing new-picture path in the gallery, if one exists; otherwise omit the frame). Empty state: happy fox + empty peg; keep the existing text for screen readers.

### 4.8 Einstellungen (mockup 3d)
Clearing at 35 % opacity behind a single page. Checkboxes → `.wb-switch`, choice buttons → `.wb-seg`. Same order and labels.

### 4.9 Forest HUD and world (mockups 5a–5c)
Visual target: the look-dev renders ("Forest look-dev — game camera", "Close to Fuchs", "Along the brook"), made with three.js from [`lookdev/`](lookdev/) at iPad 9 resolution. The look-dev scene is a design reference built with the same techniques the game should use; it is not wired to game logic. Port its techniques into `js/friends/forest3d.js` as described in section 6, keeping the existing layout data, colliders, routes and interactions. World portrait bubbles use the `.wb-spot` look; the invited friend's ring is gold. Remove `backdrop-filter` from `.ff-pad` (if still present) and `.ff-nav`.

### 4.10 Map
`picture-map.webp` already shows the den tree with an arched door and a round window right of it, which agrees with section 6.3. Restyle the map card frame with `.wb-page`; destination markers use `.wb-spot`.

---

## 5. Consistency rules

### 5.1 The cast
| Character | 2D source (only these) | 3D | Notes |
| --- | --- | --- | --- |
| Fuchs | `fox-front`, `fox-side`, `fox-back`, `fox-happy` (`assets/forest-friends/`), postcard cell 6, `forest-actions` `fox-run`/`fox-sleep` | baked plush model, 6.2 | Retire `navigation` `fox` and `animals` `fox-animal` (crayon foxes): remap their tokens (🦊) to `fox-front` in `js/ui/waldatelier.js`. |
| Eichhörnchen | `squirrel.webp`, postcard cell 1, `menu` `squirrel` | existing, check colours | |
| Blaumeise | `bird.webp`, postcard cell 2, `forest-actions` bird | existing | |
| Waldkauz | `owl.webp`, postcard cell 3 | existing | |
| Biber | postcard cell 4 | existing | Never `creatures` `beaver` (crayon). |
| Maus | `mouse.webp`, postcard cell 5, `forest-actions` mouse | **recolour**, 6.2 | Never `creatures` `mouse` (crayon). |
| Hase | `mailman-portrait.webp` | match portrait colours, 6.2 | Mailman fallback currently uses `visual.art('rabbit')` (crayon rabbit): use the portrait. |

Generic animals in reading content (Katze, Hund, Ente, Fisch, Hase in sentences) keep their `forest-actions` plush pictures; that sheet already matches the cast.

### 5.2 Picture families
- **Plush** (`forest-objects`, `forest-actions`, `menu`, `interface-icons`, all friend portraits): friends, counters, progress items, toolbar, hotspots, celebration.
- **Storybook crayon** (`navigation`, `animals`, `creatures`, `words-*`, `discovery`, `people`, `alphabet`): word and object pictures inside the book only. Never friends. Avoid `people` (humans) in any navigation tile.

### 5.3 Flat vector drawings (`js/friends/art.js` `picture()`)
Map these names to existing library pictures in `paintedWords` (`js/friends/game.js`):

| Word | Use |
| --- | --- |
| Haus `house` | `menu` `neighbour-houses` |
| Stein `stone` | `forest-objects` `forest-stone` |
| Nuss `nut` | `forest-objects` `forest-nut` |
| Ast `branch` | `forest-objects` `forest-branch` |

Still vector after that (need new art, see `ASSET-REQUESTS.md`): Tisch, Schuh, Bein, Tuch, Turm, Wurm, Topf, Kopf, Hand, Sand, Schal, Seil, Pfeil, Tasse, Kasse, Bank, Schrank, Kern. **Interim:** keep the vector drawing but render it on the paper stage with a 3 px `--wb-ink` outline and soft fills (already close); do not block the phase.

**Colour and shape answers** (Farben lesen mushrooms, Welche Form fehlt? shapes and scenes) stay SVG because the colour/shape is the answer. Give them the "wooden toy" finish: a top-left highlight gradient (`#ffffff59` → transparent), a 3 px outline in the same hue at 70 % lightness, and a soft contact ellipse below. Colours themselves do not change.

### 5.4 Den door (section 6.3) and window
Inside and outside show the same closed door, mirrored. No room interior is visible from outside.

---

## 6. 3D world and characters (port from `lookdev/`)

Open the reference with the dev server: `/design/visual-overhaul/lookdev/?view=hero` (also `close`, `brook`; `&scale=2` renders at iPad resolution; `&chars=0` hides the characters; `&hud=0` hides the overlay). `window.stats` reports draw calls, triangles per part and build time. Everything is generated in code and drawn on canvases at start-up: no new downloads, so it works offline in the home-screen app.

### 6.1 Landscape techniques to port
| Element | Technique in `lookdev/forest.js` | Replaces in the game |
| --- | --- | --- |
| Terrain | One displaced grid (≈ 60 k triangles for 88 × 86 m) with gentle noise hills rising behind the clearing; per-vertex colours for meadow, sunny patches, moss under trees, trail earth with a ragged edge, wet soil, sand and stream bed; one tiled grain texture. Receives the static shadow map. | Flat ground with painted trail strips |
| Brook | A Catmull-Rom spline that meanders; width varies 0.6–1.8 m along it. The terrain is carved from the spline: shoulder, cut bank, rounded bed. Water is one ribbon mesh (≈ 1 k triangles) with a small shader: depth colour across the stream, two scrolling noise layers along the flow, sun glints, sky fresnel, foam at the banks, transparent edges so the bed shows. | Wide straight blue band, `flowTex`, foam ribbon |
| Trails | Splines 0.7–1 m wide that wander and branch; drawn into the terrain colours and slightly sunken; stepping stones and fallen-leaf decals along them. | Broad straight trails |
| Grass | Instanced cards: three crossed quads with ~130 drawn blades (12 triangles per clump, 7 000 clumps ≈ 42 k triangles). Normals point up and back faces keep the same normal (`foliage()` patch), so cards shade like the ground and never turn dark. | Grass blobs |
| Ferns, flowers, clover, litter, reeds | Instanced: ferns from eight bent frond strips with a drawn frond texture; flowers in drifts (daisy, buttercup, bellflower spike, campion) from one 4-cell atlas; clover and leaf decals; reeds with cattails in clusters along the banks. | Broad-leaf ground plants, "green blobs" |
| Rocks and pebbles | Noise-displaced icosahedra with moss only on top faces; pebbles in the stream bed; plain stepping stones. | Speckled stone spheres |
| Trees | Lathe trunks with flutes, flare and buttress roots merged into one mesh; crowns of instanced leaf-cluster cards shaded toward the sun (unlit material with baked shading). | Existing trunks and leaf cards (keep the home-tree layout) |
| Den tree | Wide flared trunk flattened at the front, the closed door (canvas texture: planks, strap hinges right, brass mail lid, knob left), round glowing window right of the door, two lanterns, a stone doorstep. | Open arch with the lit room |
| Atmosphere | Sky gradient dome with sun glow, warm fog 24–72 m, low golden sun with soft shadows, light shafts, pollen motes, butterflies, CSS vignette. | Keep and retune existing equivalents |
| Log bridge | A fallen tree across the brook as a second crossing: tapered tube with bark grain running along it, moss on top, shelf fungi, a root plate with fanning roots at the uprooted end. Walkable: add it to the collider data as a second crossing next to the arched bridge. | — (new) |
| Guidance | 6–7 firefly sprites from Fuchs toward the invited friend; gold ring on the friend's portrait bubble. | Arrow |

Measured in the look-dev scene (Chromium, iPad resolution, same numbers at any resolution): **landscape without characters: 54 draw calls, 251 k triangles**, build time ≈ 1.9 s in software rendering (measure again on the iPad; generate during the den so the forest is ready when Fuchs goes outside, and cache nothing to disk).

### 6.2 Characters: the new sculpted plush cast
This supersedes the "Model spec" board (parameter tweaks to today's rigs).

Target: the cast sheet and the close-up render, built by [`lookdev/plush.js`](lookdev/plush.js) (`/design/visual-overhaul/lookdev/cast.html`, or `?only=fox`).

**How the look is made.** Each body part is one seamless sculpted shape: a smooth union of ellipsoids and tapered capsules (signed distance field), turned into a mesh with surface nets. Fur colours (cream chest and cheeks, dark socks and ear tips, the owl's facial disc, the blue tit's cap and stripe, Hase's waistcoat) are painted as soft-edged vertex-colour regions. One shared plush material adds fine fur fuzz to colour and normals, a warm velvet rim and a little self-light. Eyes are glossy spheres with a painted iris texture (darker top, warm lower iris, two catchlights). Parts hang on the same joints as today's rigs (`body`, `head`, `ear`, `arm`, `leg`, `tail`, `wing`), so `animator()` in `characters3d.js` keeps driving breathing, blinking, ear flicks, walk cycle, greeting and sleep.

**Production path (do not polygonize on the iPad).**
1. Add `tools/bake-characters.mjs` (Node, run by the developer): runs the `plush.js` builders, simplifies each part with meshoptimizer to the budgets below, and writes one skinned glTF per character to `assets/characters/<name>.glb` (each part rigidly bound to its joint bone, vertex colours, quantized positions/normals).
2. At runtime load the GLBs with three.js `GLTFLoader` (+ meshopt decoder, vendored locally), precached by the service worker for offline use. Total ≤ 600 KB for the seven characters.
3. Replace the mesh building in `characters3d.js` with the loaded skinned mesh; keep the joint names, `finish()` height normalisation and the animation API, so `forest3d.js`, `painted.js` (den fox) and the sleep pose work unchanged.

**Budgets per character.**
| | Draw calls | Triangles |
| --- | --- | --- |
| Fuchs (always near) | 2 (fur + glossy eyes/nose) + 1 neckerchief | ≤ 20 k |
| Friends near the camera (< 8 m) | 2–3 | ≤ 12 k |
| Friends far away | 2 | ≤ 4 k (second LOD in the same GLB) |
Measured in the look-dev (unbaked, all parts separate): the full cast at the far LOD is 117 k triangles and 185 calls. Baking into skinned meshes is what brings the calls down: with seven characters in view the brook angle drops from 156 to about 75 calls.

**Look rules.** Head ≈ 45 % of height; cream areas always stay inside the silhouette; eyes large, set low and wide, brown with catchlights (owl larger, blue tit small and dark); brows painted, not modelled; one soft contact shadow under each character. Colours: Fuchs `#dd6a28` / cream `#f6e7cf` / dark `#4a2413` / neckerchief `#5f7d31`; Eichhörnchen `#c9612a`; Blaumeise yellow `#f3cf3c`, blue `#3f80c4`, white `#f8f6ee`, stripe `#1f2b3c`; Waldkauz `#9b6a3f`, disc `#efd9b2`; Maus `#9b8c80`, ears `#eaa9a0`; Biber `#8c5a34`, tail `#4a3324`; Hase `#b98a5e`, waistcoat `#456f93`, satchel `#8e5a33`. Sleep pose: lying on the side, legs tucked, tail wrapped over the nose.

The den fox (`painted.js`) uses the same baked Fuchs, so den, forest, letter margin and puzzles show one fox.

### 6.3 Den door and window
As in the look-dev and the door blueprint: closed by default, swings inward only during the fade into the den; hinges right and knob left seen from outside; round window to the right.

## 7. iPad 9 performance plan

Device: A13 Bionic, 3 GB RAM, 2160 × 1620 px panel (devicePixelRatio 2), Safari. Current numbers below were measured in headless Chromium on this repository and must be re-measured on the iPad with Safari Web Inspector.

| # | Change | Where | Check |
| --- | --- | --- | --- |
| P1 | **Adaptive render scale**: start at 1.5 on iPad (DPR 2), clamp 1.0–1.5; every 60 frames, if average frame time > 18 ms step down 0.125, if < 12 ms step up 0.125 (max one step per 2 s). Now fixed `min(DPR, 1.75)` = 1890 × 1417 px. | `js/friends/painted.js` renderer setup and `resize` | `?perf=1` overlay shows scale and fps |
| P2 | **Forest ≤ 150 draw calls, ≤ 350 k triangles** (now ≈ 236 / ≈ 650 k). Split instanced ground plants, grass and leaf cards into ~16 × 16 m chunks so frustum culling works; hide chunks beyond fog end (74 m); merge remaining static meshes by material. | `js/friends/forest3d.js` | perf overlay draw calls / triangles at the den exit and at the bridge |
| P3 | **No blur over the canvas**: remove `backdrop-filter` from `.ff-nav`, `.ff-pad`, `.ff-overlay`, `.ff-hotspot` and `filter: blur()` from `.ff-painted-fill`; use flat translucent paper or the static vignette. | `css/friends.css`, `css/forest*.css`, `css/puzzles.css`, `css/waldatelier.css`, `css/story-cinema.css` | `grep -n "backdrop-filter\|blur(" css/` returns only non-canvas uses |
| P4 | **Pause 3D under every full overlay** (letter, map, settings, puzzle, Waldspiele, painting). The loop already returns when `paused`; make every overlay set it. | `js/friends/game.js`, `painted.js` | perf overlay: 0 draw calls while an overlay is open |
| P5 | **Den idle at 30 fps**: when the fox is idle and no animation runs, render every second frame. | `painted.js` frame loop | perf overlay |
| P6 | **Images to WebP**: convert every PNG in `assets/waldatelier/` and `assets/woodland/` and `puzzle-clearing.png` to WebP quality 82 (keep the PNGs in `archive/` only if needed for regeneration). ≈ 36 MB PNG → target ≤ 8 MB. Update references and `sw.js`. | `assets/`, `js/ui/waldatelier.js`, `js/ui/woodland.js`, CSS urls, `sw.js` | total download in DevTools; offline reload test still passes |
| P7 | **Sheet decode budget**: load each 1254 px atlas only when a screen needs it (they are 6 MB each decoded). Keep ≤ 6 atlases decoded at once. | `js/ui/waldatelier.js` | Safari Web Inspector memory timeline stays below 600 MB |
| P8 | **CSS cost**: one shadow per card (`--wb-lift`), no shadows on elements that animate, `will-change: transform` only during the celebration. | `css/waldbuch.css` | Safari timeline: no long "Composite" frames on puzzle screens |
| P9 | **Perf overlay** `?perf=1` (development only, like `?dev=1`): fps, frame ms, render scale, draw calls, triangles, textures. | new small module | visible only with the flag |

Targets on iPad 9: menus and puzzles 60 fps; forest ≥ 50 fps while walking; no frame above 50 ms during area fades; memory below 600 MB.

## 7A. Room to grow: a world ten times larger

**Requirement:** the forest must be able to grow to about ten times today's walkable area later, and still meet the section 7 targets on the iPad 9. Today the walkable area is one clearing of radius 19.6 m (≈ 1,200 m², `walkable()` in `forest3d.js`) and the whole scene is built at start-up. Built the same way, ten times the area would mean roughly 2,400 draw calls and 6.5 M triangles per frame, plus a much longer start-up. The cost per frame must therefore depend on what is near the fox, not on the size of the world.

Do this restructuring in phase 4 **without adding any new region yet**: the current clearing becomes region `home` and must look and play exactly as it does after phases 1–4.

### Structure
| Part | Rule |
| --- | --- |
| Regions | Each region is a data module `js/friends/world/regions/<id>.js`: places (friends, mailman stops), trails, water polylines, bridges, solids, decoration seed and density, landmark builders, exits to neighbouring regions. `home` holds today's data unchanged. A region is about 35–45 m across. |
| World graph | `js/friends/world/index.js` lists regions with their world offset and the exits that join them (paths, bridges). Regions never overlap. |
| Tiles | The world is cut into 16 × 16 m tiles. A tile's static geometry (ground, trunks, roots, rocks) is built from its region data and seed, merged per material; its foliage and plants are one `InstancedMesh` per kind per tile. Building is deterministic, so a tile rebuilt later looks the same. |
| Detail rings | Near ring (≤ 40 m from the fox): full detail. Far ring (40–80 m): trunks plus two-sided tree cards from one shared atlas, no grass, plants or rocks. Beyond 80 m: nothing; the existing fog (ends at 74 m) and a painted horizon cylinder hide the edge. |
| Streaming | Tiles enter and leave the rings as the fox moves. Build work is time-sliced (≤ 4 ms per frame, using idle frames first) and starts ahead of the fox along its current route. Freed tiles `dispose()` their geometry; materials and textures are shared and never disposed. A small cache keeps the last 8 freed tiles for quick returns. |
| Materials | One material per surface kind for the whole world (bark, leaves, ground, rock, water, path), all compiled with `renderer.compile()` at start-up, so entering a new tile never compiles a shader mid-walk. Textures are shared atlases, total ≤ 64 MB on the GPU. |
| Shadows | The static shadow map (`autoUpdate=false`) re-renders only when the fox has moved more than 8 m from the last shadow centre, centred on the fox, with a 2048 map covering the near ring. |
| Collision and routes | Solids go into a tile-indexed spatial hash (replaces the single `solids` array scan). Taps inside the near ring use today's local walk graph; map destinations in another region route over the region graph (exit to exit), then locally. |
| Characters | Only characters in the near ring are animated and drawn; at most 6 animated at once. Others are paused. |
| Saves | Position is saved as `{region, x, z}`; a save without `region` means `home`. Additive field, existing identifiers unchanged. |
| Picture map | Grows with regions: the map card shows the current region plus its neighbours, with a zoomed-out world page when more than three regions exist. |
| Download | Regions are code and data, not baked meshes: ≤ 150 KB per region. A unique landmark may use a small glTF (≤ 300 KB, meshopt-compressed) cached by the service worker. |

### Budget (same at 1× and 10×)
Draw calls ≤ 150 · triangles ≤ 350 k · near tiles ≤ 25, far tiles ≤ 40 · animated characters ≤ 6 · GPU memory ≤ 250 MB · tile build ≤ 4 ms per frame · start-up no slower than today.

### Proof before content
Add a development-only test world, `?world=10x` (like `?dev=1`, separate save): ten placeholder regions generated from the `home` decoration rules with different seeds, laid out as in the "World ×10" mockup, joined by paths. A new browser test walks a fixed route through all ten regions and records the maximum draw calls, triangles, live tiles and the longest build slice per frame from the `?perf=1` counters; it fails above the budget. The same route is then run on the iPad 9 (section 8, phase 6).

## 7B. Home-screen app (PWA) on the iPad

The game is used as a web app saved to the iPad home screen and must start and play offline.

| Topic | Rule |
| --- | --- |
| Offline | The service worker precaches every runtime file, including `waldbuch.css`, new WebP art and any new world data. The landscape adds no downloads (textures are drawn on canvases at start-up); the baked character GLBs add ≤ 600 KB, precached like the rest. Bump the cache id with each release; the app keeps working from the old cache until the new one is complete. |
| Download size | Keep the precached total under 25 MB (today ≈ 45 MB, mostly PNG sheets): the WebP conversion (P6) does most of this. |
| Storage | Home-screen apps keep their own storage, separate from Safari. Saves and drawings stay in localStorage/IndexedDB as today; call `navigator.storage.persist()` once after the first save and keep the existing export. |
| Returning from the background | iPadOS may drop the WebGL context when the app is in the background. Listen for `webglcontextlost` (prevent default, stop the loop) and `webglcontextrestored` (rebuild textures and materials from the same code, re-bake the shadow map). Pause rendering and audio on `visibilitychange`. |
| Memory | Stay under 600 MB in use: shared materials and textures, freed tiles disposed (section 7A), at most six atlases decoded at once (P7). |
| Start-up | Show the den immediately (it is a painting); build the forest while the child is in the den, in slices of ≤ 8 ms, and compile its shaders with `renderer.compile()` before Fuchs steps outside. |
| Screen | Landscape, standalone display, safe-area insets respected (already in the CSS); no pinch zoom; touch targets as in section 2. |
| Updates | When a new version is ready, apply it at the next start in the den, never during a puzzle. |

---

## 8. Phases

Each phase ends with tests, milestone screenshots at 1080 × 810 and 390 × 844 in `design/forest-friends/visuals/milestones/waldbuch/`, a short `COMPARISON.md` against the mockup, version bump and push.

1. **Tokens and shell.** Add `css/waldbuch.css`; restyle back/speaker/demo buttons, page, ribbon, host margin, twig, stage, tiles, chips, feedback states across all 29 puzzles; perf items P3 and P8. *Done when* every catalogue route renders the new shell without horizontal overflow at both widths (`puzzles-browser.cjs`) and no control moved in the DOM.
2. **Menus.** Waldspiele tabs and cards, Ausmalen, Meine Bilder, Einstellungen, map frame, letter postcard; P4. *Done when* `friends-library-browser.cjs`, `den-browser.cjs`, `interface-browser.cjs` pass and the reader-child picture is gone.
3. **Consistency.** Cast remapping (5.1), picture-family rules (5.2), vector → library mappings (5.3), wooden-toy finish for colour/shape answers, celebration (4.4). *Done when* a grep for the crayon fox subjects (`'fox'` in `navigation`, `fox-animal`) finds no runtime use and `puzzles-browser.cjs` passes.
4. **3D and world structure.** Port the look-dev landscape (section 6.1: terrain, meandering brook with banks and flowing water, narrow trails, grass cards, ferns, flowers, reeds, rocks, trees, log bridge, den door and window, fireflies); bake and integrate the sculpted plush cast (6.2: bake tool, skinned GLBs, LODs) and the sleep pose; mouse and hare colours; hotspot rings in the world; context-loss handling (7B); P1, P2, P5, P9; the region/tile/ring structure of section 7A with `home` as the only real region, plus the `?world=10x` test world and its budget test. *Done when* `friends-mail-browser.cjs`, `friends-animation-browser.cjs`, `world-browser.cjs` pass, the forest matches the look-dev renders, models screenshot sits next to the sheet, and both `home` and `?world=10x` meet the budget in Chromium.
5. **Assets.** P6, P7; integrate any new pictures delivered from `ASSET-REQUESTS.md`. *Done when* offline reload passes and download size is ≤ 8 MB for puzzle art.
6. **Device check (owner).** Run on the iPad 9 with `?perf=1`, once in the normal game and once walking the `?world=10x` route; record fps, render scale and memory in the milestone `COMPARISON.md`.

---

## 9. Acceptance checklist

- [ ] One fox everywhere: den, forest, letter margin, puzzles, Waldspiele, colouring (line art matches the same character), sleep.
- [ ] Den door looks the same from inside and outside (mirrored), no fake interior visible outside.
- [ ] The forest matches the look-dev: winding brook with banks and flowing water, narrow trails, a fallen-log bridge, grass, ferns and flowers instead of blobs.
- [ ] All seven characters are the baked plush cast (seamless bodies, painted fur, glossy eyes), animated by the existing rig.
- [ ] Works offline from the home screen, survives backgrounding (context restore) and keeps saves.
- [ ] Every puzzle and menu uses the Waldbuch page, the same buttons and the same tiles.
- [ ] No human figure in navigation; no crayon versions of the friends.
- [ ] No `backdrop-filter`; no blur over the canvas.
- [ ] All tests green; gameplay, task order and saves unchanged.
- [ ] iPad 9: 60 fps in menus/puzzles, ≥ 50 fps in the forest, memory < 600 MB.
- [ ] The `?world=10x` test world meets the same budget as `home` (Chromium test and iPad walk).
