# Waldbuch visual overhaul — implementation progress

Claude Code keeps this file current: tick items as they land on `main`, add the commit, and note deviations from the [blueprint](BLUEPRINT.md). A new session reads this file first to know where to continue.

**Design handed over:** 9 November 2026 (blueprint, mockups, 3D look-dev, asset requests).
**Implementation started:** 9 November 2026 (phase 1).

## Phase 1 · Tokens and puzzle shell · Opus 5.5, effort `high`
- [x] `css/waldbuch.css` with tokens and components from `mockup/waldbuch.css`, loaded last in `index.html`
- [x] Friend accent via `data-host` on puzzle screens
- [x] Back, speaker and demo buttons restyled
- [x] Book page, ribbon, host on the margin, progress twig, stage, answer tiles, syllable chips on all 29 puzzles
- [x] Older activity step strips restyled
- [x] P3 (no blur over the canvas) and P8 (CSS cost)
- [x] `puzzles-browser.cjs` passes at 1024 and 390; milestone screenshots and `COMPARISON.md` — app 8.5.0, branch `claude/inspiring-thompson-wnlj9u` (see notes)

## Phase 2 · Menus · Opus 5.5, effort `high`
- [x] Waldspiele bookmark tabs and cards (no human figure)
- [x] Ausmalen taped pages, Meine Bilder clothes line, Einstellungen switches
- [x] Map frame, letter postcard with stamp and vignette
- [x] P4 (pause 3D under every overlay)
- [x] `friends-library-browser.cjs`, `den-browser.cjs`, `interface-browser.cjs` pass; screenshots — app 8.6.0, on `main`

## Phase 3 · Consistency · Opus 5.5, effort `high`
- [x] Cast remapping (crayon foxes retired, mailman portrait)
- [x] Picture-family rules; vector → library pictures (Haus, Stein, Nuss, Ast)
- [x] Wooden-toy finish for colour and shape answers
- [x] Celebration on correct answers (reduced-motion safe)

## Phase 4 · 3D world and characters · effort `xhigh` (or Fable 5.1)
- [x] **Before starting:** told the owner to switch (`/effort xhigh` or `/model fable`) and got confirmation
- [x] Landscape ported from `lookdev/forest.js` (terrain, meandering brook with banks and flowing water, narrow trails, grass, ferns, flowers, reeds, rocks, trees) — 4.2, `84fecd7`
- [x] Log bridge as a second walkable crossing — 4.2
- [x] Den door and round window outside; fireflies replace the arrow; gold ring on the invited friend — 4.2
- [x] `tools/bake-characters.mjs` and baked plush cast (`assets/characters/*.glb`, 570 KB, two LODs) — 4.4, `0527cba`
- [x] `characters3d.js` loads the baked cast; animations and sleep pose work; den fox uses the same model — 4.4
- [x] Region/tile/ring world structure with `home` as the only region; `?world=10x` test world and budget test — 4.2 and 4.3, `46008f4`
- [x] Context-loss handling, forest built while in the den (section 7B) — 4.1, 4.2
- [x] P1 adaptive render scale, P2 draw-call budget, P5 den idle at 30 fps, P9 `?perf=1` overlay — 4.1, `52732b5`
- [x] `friends-mail-browser.cjs`, `friends-animation-browser.cjs`, `world-browser.cjs` pass; renders match the look-dev — app 8.8.0, on `main`
- [x] **After finishing:** told the owner to switch back with `/effort high`

## Phase 5 · Assets and offline · Opus 5.5, effort `high`
- [x] P6 PNG sheets → WebP; P7 atlas decode budget; precache list updated — `6226578`
- [x] Optional new word pictures from `ASSET-REQUESTS.md` — none delivered yet; fallbacks stay
- [x] Offline reload passes; precached total < 25 MB (16.0 MB) — app 8.9.0, on `main`

## Phase 6 · Device check (owner)
- [ ] iPad 9, home-screen app, `?perf=1`: fps, render scale, memory in the normal game
- [ ] Same on the `?world=10x` route
- [ ] Results recorded in `design/forest-friends/visuals/milestones/waldbuch/COMPARISON.md`

## Notes and deviations
**Phase 1** (details in [`milestones/waldbuch/COMPARISON.md`](../forest-friends/visuals/milestones/waldbuch/COMPARISON.md)):
- Phases 1–2 went to `main` via the session branch (PR #3, fast-forward). From phase 3 on, the owner asked to always push straight to `main`.
- Page in normal flow (title kept on the scene, long activities scroll inside the page); ribbon/paper as background layers and stitching as a dashed outline, so no new DOM.
- Phones keep the host small in the page header instead of 120 px above the page corner.
- Counter scatter fixed by position (nth-child), not by task id. Schreibspuren/Zahlenwege pages have no ribbon; their host is drawn on the scene.
- Step strips restyled (pills, moss first step) but keep their icons; library pictures there move to phase 3.
- Celebration (confetti, hop, check badge, moss page ring) is left for phase 3 as listed there.
- Fixed a literal "null" printed on the Silben-klopfen screen; scoped one flaky `puzzles-browser.cjs` locator to the visible screen.
- `play-layout-browser.cjs` already fails on the base commit (retired `#set-sound`); `play-browser.cjs` and `play-layout-browser.cjs` hard-code a Playwright path that only exists on the old runner.

**Phase 2:**
- Waldspiele intro kept for screen readers only; title and selected tab show the same thing. Back button keeps Fuchs' portrait in the wooden ring.
- Meine Bilder: no "new picture" frame, because the gallery has no new-picture action; dates stay under the pictures.
- Den toolbar pill, unread-letter dot and hotspot rings (mockup 1a) done here, as no phase listed them.
- P4 was already in place (overlays and leaving the friends screen pause the world); verified for every menu and overlay.

**Phase 3** (app 8.7.0, on `main`):
- Fuchs for 🦊 comes from postcard cell 6 (square, for paint stamps) rather than `fox-front.webp`.
- Den Ausmalen / Meine Bilder hotspots keep storybook-crayon object icons (no plush art for them).
- Farben-lesen objects keep their ink outline; highlight and contact shadow added.
- `tests/waldatelier.test.cjs` reads sheet paths from `FK.visual.source` so the WebP cast sheet is checked too.

**Phase 4** (app 8.8.0, on `main`; details in [`milestones/waldbuch/COMPARISON.md`](../forest-friends/visuals/milestones/waldbuch/COMPARISON.md)):
- Far ring ends at 68 m (tile centre), not 80 m: beyond 68 m the haze is over 90 %, and it keeps the far ring within 40 tiles at every point of the 10× route. Rings are measured from tile centres.
- Plants are one merged mesh per near tile (grass, flowers, ferns, clover, litter, reeds share the plant atlas) rather than one `InstancedMesh` per kind: one draw call instead of six. Leaf cards are instanced.
- Characters and small rocks do not cast into the static shadow map (it is re-baked only every 8 m, so moving characters would leave frozen shadows); characters keep their soft contact-shadow discs.
- Route planning stays local: only `home` has places, so map routing over the region graph and the zoomed-out world map page wait for the first real new region. The fireflies' route planner caches hub-to-hub sight lines (built in the den).
- The den door does not swing open; going outside fades as before.
- The sleep pose lays the tail along the body rather than over the nose.
- Budget test (`tests/world-budget-browser.cjs`): draw calls, triangles, tiles and animated characters are measured while drawing in software mode (no shadows); build slices in a second pass with drawing skipped, because SwiftShader shares the CPU with the page here. Criterion there: 95th percentile ≤ 4 ms, longest ≤ 12 ms. The strict ≤ 4 ms maximum and the shadow re-bake frames are for the iPad walk (phase 6).
- `forest-browser.cjs` (historical Heart Tree game) already fails on the phase 3 commit ("Hase besuchen" never appears); phase 4 did not touch that game.
- `tests/characters-preview.html` now fits the camera to the window and stacks the characters on portrait screens.
- `navigator.storage.persist()` and "apply updates at the next start in the den" (section 7B) are offline topics and left for phase 5.

**Phase 5** (app 8.9.0, on `main`):
- WebP at quality 82 with exact alpha: 37.7 MB → 7.0 MB; the PNGs are removed and kept in git history (no `archive/` copy).
- Canvas drawing keeps at most six atlases (`FK.visual.load`, least recently used dropped); CSS backgrounds are left to the browser, which loads them with the screen that shows them.
- Updates now wait and apply at the next start in the den (section 7B); `navigator.storage.persist()` was already in place.
- **Next: phase 6** (owner): iPad 9, home-screen app, `?perf=1` in the normal game and on the `?world=10x` route; record fps, render scale and memory here and in `COMPARISON.md`.

**Cast in the painted style** (12 November 2026, app 9.0.10, on `main`; owner's step 5 after the world ×10 work):
- The owner chose the painted friends sheet as the reference for every character. All thirteen plush models were resculpted towards it in `lookdev/plush.js` and baked again; details and screenshots in `COMPARISON.md`.
- Deviation from blueprint 6.2 ("brows painted, not modelled"): brows and the smile are thin modelled strokes lying on the head, because painted vertex colours that fine do not survive simplification to 12 k triangles.
- Deviation from the 6.2 colour list: Hase is a warmer orange-brown (`#c98450`) with brown paws, as on his painted portrait; creams are a little warmer throughout.
- The Waldkauz has no ear tufts (as painted, and as the real bird); his wings are bound to the `arm` joints so he waves with a wing.
- New development sheet `tools/bake/sculpt.html`; `tests/characters-preview.html?action=wave` shows an action.

**Fuchs behind trees and Waldgeräusche** (12 November 2026, app 9.0.11, on `main`; owner's requests):
- Trees in front of Fuchs turn translucent in a narrow, soft-edged column and keep a ghost, instead of being cut away in a circle (`js/friends/world/textures.js`).
- Forest sound rebuilt: footsteps by ground, seven birds, frogs, crickets, wind in gusts, brook and waterfall by distance, a tune with long rests; rules against wear over twenty minutes are tested (`tests/soundscape.test.cjs`). How it sounds is for the owner to judge on the iPad (`tests/audio-preview.html`).
- Sound plays into gameplay nowhere; saves and settings are unchanged (**Waldgeräusche** and **Musik** stay on by default, **Spielklänge** off).
