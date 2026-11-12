# World ×10 — plan and status

Owner request (10 November 2026): expand the 3D world to ten times its size; fox den stays in the
middle; meadow (Reh), a rock with a waterfall, a swamp (Frosch), terrain, a beaver dam with a pond,
Igel, and the remaining blueprint-v2 friends (Fisch, Eisvogel); characters in their habitats, well
spread; 3D first, the rest (puzzles, letters, picture map for the new friends) later; must still
render on the iPad 9; hardest 3D work first, clean-up for a weaker model later.

## Approach
- One continuous landscape, 256 × 224 m (x −128…128, z −112…112; north is −z, the camera looks
  north). Fuchs may walk anywhere that is not water, cliff, tree, rock or the world's rim.
- New engine in `js/friends/world/big/` (the old `home` region engine stays untouched until the
  switch): `layout.js` (data), `terrain.js` (height, water, biomes, colour, trails, crossings),
  `index.js` (world object: trees, colliders, walkability, places), `nav.js` (grid path search),
  `tiles.js` (streamed tiles), `sites.js` (landmarks).
- While in work it runs behind `?world=10x` (own save). The default flips when the mail-loop suites
  and `tests/world-budget-browser.cjs` pass.
- Budget unchanged (blueprint 7A): ≤ 150 draw calls, ≤ 350 k triangles, ≤ 25 near / ≤ 40 far tiles,
  ≤ 6 animated characters, build slices ≤ 4 ms.

## Layout (metres)
- Den tree (0, −8), door faces south.
- The Rock, north-east (centre 84, −80): plateau ≈ +11.5 m, cliffs to the south and south-west,
  ramp on the west flank; spring and upper brook on top; waterfall at (67, −58) into the plunge
  pool (61.5, −50.5). Fisch lives in the plunge pool.
- Brook: plunge pool → beaver pond (35.5, −17.5) → dam (28, −10) → arched bridge by the den
  (13, −3) → south → swamp. Biber by the dam, lodge in the pond. Eisvogel on the brook (13, 22).
- Meadow, west (centre −72, −4): Reh. Maus at its east edge (−32, 10).
- Spruce forest on the northern hills: Eichhörnchen (−30, −60).
- Old beech wood, east: Waldkauz in a hollow tree (86, −6).
- Sunny glade, south-east (52, 44): Igel.
- Birch grove, south-west (−58, 54): Blaumeise.
- Swamp, south (centre −18, 80): pools, boardwalk, Frosch on a lily pad.

## Status
See the checklist at the end of this file; update it at every checkpoint.

- [x] 1 Terrain, water, biomes, walkability, path search, streamed tiles (near + far) — on `main` behind `?world=10x`
- [x] 2 Rock and waterfall (cliff is there; no falling water yet) — **high effort**
- [x] 3 Beaver dam, pond and lodge (pond and a plain log pile are there) — **high effort** for the look
- [x] 4 Swamp (pools, boardwalk, lily pads are there; mist, light and dead-wood mood missing) — **high effort**
- [x] 5 Backdrop hills, light and haze per area, tree species polish (birch, spruce, willow, the owl's hollow tree) — **high effort**
- [x] 6 New plush characters: Reh, Frosch, Igel, Fisch, Eisvogel (sculpt in the look-dev style, bake, place) — **high effort**
- [x] 7 (except the longest build slice, see below) Friends' props at their new places (stump, lodge, nest box, acorns), budget test on `BIG_ROUTE`
      (the plateau point 72.5, −62.5 is not walkable yet), mail-loop suites, switch the default — medium effort
- [ ] 8 Clean-up list for later (below) — medium or smaller

## How to look at it
`/?world=10x` (own save). `FK.friendsForest.teleport(x, z)` in the console jumps anywhere;
`tests/world-map.html?s=4&nav=1` draws the whole map from above.

## Done on high effort (10 November 2026)
Waterfall with foam and mist, boulders, sculpted dam and lodge, swamp mist and fireflies, hazy backdrop
hills, haze per area, and the five neighbours (builders in `design/visual-overhaul/lookdev/plush.js`,
baked with `node tools/bake-characters.mjs deer frog hedgehog fish kingfisher`; model sheet:
`tests/characters-preview.html?only=deer,frog,hedgehog,fish,kingfisher`).
Later added: the willow's hanging curtains and the owl's hollow tree. Open: from about 30 m the den tree looks white (seen from the willow); check that Fisch shows above the water.

## State on 11 November 2026
The big world is the game's world (`?world=home` opens the old clearing). Mail loop, den, sleep, click and
interface suites pass. Budget walk: draw calls 88–111, triangles ≤ 245 k, near ≤ 22, far ≤ 36, animated 5,
build slice p95 3.25 ms: all within limits. Still failing: the longest single build slice, 16.4 ms
(limit 12 ms), most likely a landmark site built in one step (dam and lodge, waterfall): split those steps.
One build-timing run also stopped with Fuchs not arriving somewhere on the route (not reproduced with
positions logged): watch for it.

## Done on 11 November 2026
- The old clearing is removed (region engine, old tile builder, `?world=home`).
- The neighbours have letters, puzzles, portraits (`tools/portraits/`) and map pins; the picture map is painted
  from the world (`tools/map/`). Letters cycle through all ten friends; older saves stay valid.
- Lehrplan 21 references NMG.2.4.a (Igel) and NMG.2.1.a (Reh) confirmed by the owner.

## Left for later (clean-up, suitable for a smaller model)
- `friends-library-browser.cjs` line 83 and `friends-click-browser.cjs` still expect the screens from before
  the puzzle unification (`7ad24dc`); they fail on that commit too.
- Budget test on the big world counted 32 near / 41 far tiles (limits 25 / 40) at triple walking speed:
  check whether lagging far versions of near tiles are counted, then fix the streamer or the count.
- Remove the old `home` region engine (`world/region.js`, `regions/home.js`, the non-big branches in
  `world/index.js`, `forest3d.js`, `tiles.js` `buildTile`) once the big world is the default.
- The fireflies re-plan their route every second; re-plan only when Fuchs leaves the route.
- Picture map, letters and puzzles for the new neighbours; map pins for the moved friends.
- `docs/FOREST-FRIENDS.md` and `docs/DEVELOPMENT.md`: describe the big world.
- Decorative rocks are not colliders; large ones are only placed where Fuchs cannot walk.

## Done on 11 November 2026 (evening)
- Streamer plans from the place of its last plan (it used the previous frame and never planned on a steady
  walk: plain ground and holes on the iPad); holes before detail; `?perf=1` shows waiting tiles, holes, plain.
- Fuchs no longer circles a waypoint on long frames or stays wedged (re-plan after 0.5 s).
- Beaver dam rebuilt (mud wall, thatched face, crest poles, seep), pond water ends at the dam, lodge to match,
  stumps, felled trunks and a pole stack at Biber's (`STUMPS`, `FELLED`, `POLES` in `layout.js`).
- Open: the longest build slice is 12.3 ms (limit 12 ms); `FK.perf.stats.slowestStep` names the step kind.

## Done on 12 November 2026
- Dachs: sculpted like Fuchs (`badger` in `lookdev/plush.js`), baked (89 KB), eleventh letter friend. He lives in a
  sett under an old oak in the spruce slope north-west (`SETT`, site `sett`, spur trail from the
  Eichhörnchen–Reh path, two glades for the view). Puzzles: "Naturrätsel" (16 questions on growing, weather
  and seasons; Natur, NAT-03). Lehrplan reference NMG.2.3.a is proposed, not yet confirmed by the owner.
- Portrait in the free sixth cell of `neighbours.webp`; picture map redrawn.

## Done on 12 November 2026 — the whole cast follows the painted sheet (owner's step 5, option B)
- All thirteen characters resculpted in `lookdev/plush.js` towards `postcard-friends.webp` and baked again (1.07 MB,
  same triangle budgets). One face kit for everyone: cream eyes with a dark upper lid, brows, button nose, "w" smile.
- Fur shader brushed instead of grainy, fading with distance; the eye drawing was upside down in the game before.
- Igel now sits upright under a hood of spines; Waldkauz has a head that turns and wings that wave; Hase has his cap,
  waistcoat, satchel and letters as on his portrait.
- `neighbours.webp` rendered again from the new models (`tools/portraits/`); painted portraits stay optional (A4).
- Screenshots and notes: `design/forest-friends/visuals/milestones/waldbuch/COMPARISON.md`, app 9.0.10.
- Open, unchanged by this step: the longest build slice measured 13.6–26.8 ms here on 12 November (limit 12 ms), on app 9.0.9
  and 9.0.10 alike; `FK.perf.stats.slowestStep` names the step. Draw calls, triangles and tiles are within budget.
