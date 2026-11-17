# Water edges — 17 November 2026, 9.3.92

Actual forest renderer (`?software=1`, 1080 × 810, afternoon light, no rain), before (9.3.91) and after (9.3.92) from the same camera. Overhead views hide tree crowns and trunks so the water's edges are visible; the game view uses the normal camera behind Fuchs.

- [Fisch's plunge pool running into the upper brook](fish-pond-outlet.png): the toothed cut across the channel and the second, paler layer of water are gone; the pool narrows into the brook.
- [The upper brook running into Biber's pond](beaver-pond-inlet.png): the brook no longer lies over the open pond as a pale strip; it meets the pond at its mouth.
- [Frosch's swamp from above, west and south shore](swamp-south-west-above.png): the water ended at the bog's outline in a staircase; a low bank now forms a smooth shore.
- [Frosch's swamp, south shore in the game view](swamp-south-shore-game.png): the same shore as a child sees it.

`tests/water-edges.test.cjs` checks the bank all round the bog and the pool/brook junctions on the water and the bed colour; it fails on 9.3.91. The swamp keeps about 96 % of its open water; the Steg, Frosch's place and every route are unchanged (Steg and map-route browser suites).
