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
- [ ] **Before starting:** told the owner to switch (`/effort xhigh` or `/model fable`) and got confirmation
- [ ] Landscape ported from `lookdev/forest.js` (terrain, meandering brook with banks and flowing water, narrow trails, grass, ferns, flowers, reeds, rocks, trees)
- [ ] Log bridge as a second walkable crossing
- [ ] Den door and round window outside; fireflies replace the arrow; gold ring on the invited friend
- [ ] `tools/bake-characters.mjs` and baked plush cast (`assets/characters/*.glb`, ≤ 600 KB, two LODs)
- [ ] `characters3d.js` loads the baked cast; animations and sleep pose work; den fox uses the same model
- [ ] Region/tile/ring world structure with `home` as the only region; `?world=10x` test world and budget test
- [ ] Context-loss handling, forest built while in the den (section 7B)
- [ ] P1 adaptive render scale, P2 draw-call budget, P5 den idle at 30 fps, P9 `?perf=1` overlay
- [ ] `friends-mail-browser.cjs`, `friends-animation-browser.cjs`, `world-browser.cjs` pass; renders match the look-dev
- [ ] **After finishing:** told the owner to switch back with `/effort high`

## Phase 5 · Assets and offline · Opus 5.5, effort `high`
- [ ] P6 PNG sheets → WebP; P7 atlas decode budget; precache list updated
- [ ] Optional new word pictures from `ASSET-REQUESTS.md`
- [ ] Offline reload passes; precached total < 25 MB

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
- **Next: phase 4.** Before starting it, the owner must switch to `/effort xhigh` (or `/model fable`) and confirm.
