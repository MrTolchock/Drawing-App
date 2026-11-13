# Visual style — Waldpost

This is the single visual specification for the active game. The direction is a warm woodland picture book: plush characters, drawn learning illustrations, cream paper, quiet sepia controls, sage/ochre accents and readable school text. Apply the same rules to all existing and new screens. The [puzzle blueprint](PUZZLE-BLUEPRINT.md) adds interaction rules.

## Drawn or rendered: choose by purpose

| Role | Required treatment | Current source / API |
| --- | --- | --- |
| Forest, terrain, trees, water, walking characters | Real-time 3D, soft natural lighting and plush character materials | `js/friends/forest3d.js`, `world/`, `characters3d.js`, `assets/characters/*.glb` |
| Den | Painted interior with the same model fox rendered into the room; perspective and warm light match the painting | `assets/forest-friends/den-v2.webp`, `js/friends/painted.js` |
| Character identity on letters, map, puzzle context, companions, votes, celebration and game-over | Transparent render of the **same current model**, same lighting/framing for the entire cast. Sleeping fox is a pose of that model | `assets/forest-friends/character-portraits.webp`, `FK.friendsArt.portrait(id)`; generated with `tools/portraits/` |
| Learning subjects: animals, objects, quantities and pictured verbs | Drawn crayon/pencil illustrations, soft textured edges, transparent background, consistent woodland palette | `assets/waldatelier/*.webp`, `FK.visual.art(subject)`; `forest-actions` for actions and `puzzle-vocabulary` for nouns |
| Exact geometry, shape constructions, mirror grids, routes, handwriting paths | SVG/canvas paths where precision is the task. Use the same paper, ink, colour palette and rounded stroke language | Shared puzzle renderer, `js/learn/glyphs.js`, trace engine |
| Utility controls: back, explain, settings, map, letter and reset | One sepia SVG family, rounded line ends, 48-unit viewBox, 2.2-unit strokes, restrained fills | `js/ui/waldatelier-icons.js`, `FK.icons.element(name)` or `FK.icon(name)` |
| Puzzle surroundings and map | Painted woodland backdrop; the picture map reflects the actual world layout, with rendered identity pins | `puzzle-clearing.webp`, `world-map.webp`, `tools/map/` |
| Retired colouring pages and saved drawings | Inactive historical artwork/data; preserve saved IDs and local drawing records. The den table and paper pile remain in the background without drawing icons | `colouring-friends.webp`, `js/art/`, `js/paint/` |

A vocabulary fox is a drawn animal; a letter from Fuchs shows the model portrait. Do not replace a subject with a character portrait because they name the same animal. Do not use painted postcard portraits alongside model renders. No photographic/stock assets, platform emoji, CSS-drawn substitute animals or a new illustration style for one puzzle. Emoji may remain internal legacy content tokens, but are resolved to our art before display. A missing illustration is a content defect, not permission to fall back to an emoji.

The distinction between the 3D world and drawn learning pages is intentional. Within each role, use one treatment. Historical colouring artwork remains as legacy assets/data; drawing is no longer an active activity.

## Typography

All fonts are bundled locally; no network font requests.

| Role | Font | Weight / size |
| --- | --- | --- |
| Body, labels, controls, parent settings | Andika | 400 regular / 700 emphasis; body 16 px, controls usually 17–20 px, metadata 14 px minimum |
| Puzzle titles, prompts, answers, scored words/numerals | Andika | 700; titles 21–28 px responsive; use the shared task sizes, never decorative lettering |
| Menu/section/modal headings | Baloo 2 | 700; titles 22–32 px responsive |
| Brand wordmark only | Baloo 2 | 800 permitted |
| Letter/digit tracing | Authored glyph paths | No font substitution; preserve stroke starts and direction |

`css/base.css` declares the font files and `css/typography.css`, loaded last, defines the roles. Controls inherit Andika. Keep Swiss Standard German wording and reading-case preferences. No synthetic font weights, extra font families, text strokes or decorative shadows on learning text.

## Palette, surfaces and density

| Purpose | Colour family |
| --- | --- |
| Main ink / quiet secondary text | Brown `#4b3b2d` / `#78664f` |
| Paper / page | Cream `#fffaf0`, warm parchment `#f3edda` |
| Utility outlines | Sepia `#75593c`, shared 2.2-unit rounded strokes |
| Navigation / selection | Sage and moss; warm wood/ochre for card edges |
| Success / retry | Shared green confirmation / warm brown retry, with visible marks and accessible status |

`css/waldbuch.css` supplies the shared paper/wood tokens; `css/puzzle-rounds.css` owns the current puzzle layout. Task colours remain exact when they are the subject (colour reading, shapes, matching); never recolour an answer merely to match decoration. Avoid mixing neon toy gradients, hard black sticker shadows and glossy icon tiles into this page system.

Use one clear task area, generous cream space and a small portrait/context row. A puzzle has exactly five progress leaves. Keep control positions stable, icons inside the complete button hit area and touch targets at least 48 px. Use visible focus and accessible names. Adapt through wrapping and bounded scrolling at phone/tablet sizes, safe areas and browser zoom. Reduced motion keeps meaningful static progress and celebration.

## Asset ownership and changes

- Add subjects to an existing drawn atlas or supply a matching drawn sheet. Register and name every picture before using it. Transparent cells need consistent scale, crop and padding; counted pictures must show exactly one object.
- Change character identity through the current sculpt/bake pipeline: `tools/characters/plush.js` → `tools/bake/` → GLBs → `tools/portraits/` → one portrait atlas. Update all surfaces together.
- Keep UI icons in the shared symbol source. Do not introduce a one-off painted or Unicode control icon.
- No runtime imports, styles, assets or offline downloads may come from `archive/` or retired design prototypes.
- After shared visual changes, regenerate the puzzle implementation fingerprint. Existing editorial sign-offs become stale; adults must inspect the new revisions. Record the result in [Consistency audit](STYLE-AUDIT.md), run the design checks and capture the real game at phone and tablet sizes.

Historical references and fixed mockups are preserved in the [archive](../archive/design-history/README.md); they are not competing specifications. New visual exceptions require an explicit update here, a reason and a real-renderer review before children see them.
