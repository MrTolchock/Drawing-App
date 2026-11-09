# Asset requests — Waldbuch overhaul

Implementation does not wait for these: every item has an interim fallback in [BLUEPRINT.md](BLUEPRINT.md). Generate with the same image tool used for the existing sheets, attach the named reference image, then save into `assets/waldatelier/` as WebP (quality 82, 1024 × 1024, transparent background).

## A1 · `words-four.webp` — 16 storybook word pictures

**Reference to attach:** `assets/waldatelier/words-three.png` (style only).

**Prompt**

> Use case: illustration-story. Production art assets for Farbtupf, a first-grade children's learning app in Zürich. The attached sheet is a STYLE REFERENCE ONLY: match its storybook crayon-and-watercolour medium, thin warm-sepia ink outline, soft paper texture, warm natural colours and gentle light. A 4 × 4 grid of 16 separate objects on a fully transparent background, each centred in its own equal square cell with generous empty margin, nothing touching cell edges, no shadows crossing cells. Simple, instantly recognisable silhouettes for six-year-olds, one object per cell, front or three-quarter view. No text, letters, numbers, labels, frames, UI or watermark. Row by row: (1) a wooden kitchen table, (2) a single red children's shoe, (3) one child's leg in shorts from knee to foot, standing, (4) a folded square cloth with a simple border, (5) a round stone castle tower with a pointed red roof, (6) a pink earthworm curved in an S, (7) a cooking pot with two handles and a lid, (8) a friendly child's head and shoulders seen from the front, neutral, (9) an open child's hand, palm forward, (10) a small heap of sand with a toy spade, (11) a striped knitted winter scarf, (12) a coiled rope, (13) a single arrow with feathers, (14) a cup with a saucer, (15) a toy shop till / cash register, (16) a park bench.

Mapping (row-major index → word key in `js/friends/content.js`): 0 `table` Tisch, 1 `shoe` Schuh, 2 `leg` Bein, 3 `cloth` Tuch, 4 `tower` Turm, 5 `worm` Wurm, 6 `pot` Topf, 7 `head` Kopf, 8 `hand` Hand, 9 `sand` Sand, 10 `scarf` Schal, 11 `rope` Seil, 12 `arrow` Pfeil, 13 `cup` Tasse, 14 `till` Kasse, 15 `bench` Bank.

## A2 · `words-five.webp` — 2 pictures (+ spare cells)

Same prompt with a 2 × 2 grid: (1) a wooden wardrobe with two doors (`wardrobe` Schrank), (2) a halved apple showing its pips (`seeds` Kern), (3) and (4) left empty.

## A3 · Optional: plush celebration items

Not needed: the celebration uses existing `forest-objects` leaf, flower, feather, nut, berry, lantern and branch.

## Acceptance

- Each picture is recognisable without its word to a six-year-old (check with the child test).
- Cell crops have transparent margins; the atlas is registered in `js/ui/waldatelier.js` (`sheets`), and the words are added to `paintedWords` in `js/friends/game.js`.
- Keep the prompt text and output file names in `design/visual-overhaul/prompts.json` for provenance.
