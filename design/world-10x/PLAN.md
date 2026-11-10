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

- [ ] 1 Terrain, water, biomes, walkability, path search, streamed tiles (near + far)
- [ ] 2 Rock and waterfall
- [ ] 3 Beaver dam, pond and lodge
- [ ] 4 Swamp (pools, boardwalk, lily pads, mist)
- [ ] 5 Meadow, tree species (birch, spruce), backdrop hills, mood per area
- [ ] 6 New plush characters: Reh, Frosch, Igel, Fisch, Eisvogel (sculpt, bake, place)
- [ ] 7 Budget test on the new route, mail-loop suites, switch the default
- [ ] 8 Clean-up list for later (below)

## Left for later (clean-up, suitable for a smaller model)
(filled in as work proceeds)
