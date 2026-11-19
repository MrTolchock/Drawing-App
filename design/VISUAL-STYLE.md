# Visual style — Waldpost

This is the single visual specification for the active game. The direction is a warm woodland picture book: plush characters, drawn learning illustrations, cream paper, quiet sepia controls, sage/ochre accents and readable school text. Apply the same rules to all existing and new screens. The [puzzle blueprint](PUZZLE-BLUEPRINT.md) adds interaction rules.

## Drawn or rendered: choose by purpose

| Role | Required treatment | Current source / API |
| --- | --- | --- |
| Forest, terrain, trees, water, walking characters | Real-time 3D, soft natural lighting and plush character materials | `js/friends/forest3d.js`, `world/`, `characters3d.js`, `assets/characters/*.glb` |
| Den | Painted interior with the same model fox rendered into the room; perspective and warm light match the painting | `assets/forest-friends/den-v2.webp`, `js/friends/painted.js` |
| Character identity on map, puzzle context, companions, votes, celebration and game-over | The same canonical painted cast as invitation letters: watercolour/pencil, recognizable species/markings, genuine transparency; includes Steinbock and a matching sleeping fox | `assets/forest-friends/character-portraits.webp`, `FK.friendsArt.portrait(id)`; [shared atlas preparation](artwork/friend-portraits.json) |
| Learning subjects: animals, objects, quantities and pictured verbs | The canonical watercolour-and-coloured-pencil drawing, organic sepia contours, soft edges, transparent background and consistent woodland palette | [Canonical style](illustrations/STYLE.md), `assets/waldatelier/*.webp`, `FK.visual.art(subject)` |
| Exact geometry, shape constructions, mirror grids, routes, handwriting paths | SVG/canvas paths where precision is the task. Use the same paper, ink, colour palette and rounded stroke language | Shared puzzle renderer, `js/learn/glyphs.js`, trace engine |
| Puzzle utility controls: explain, reset and task directions | One sepia SVG family, rounded line ends, 48-unit viewBox, 2.2-unit strokes, restrained fills | `js/ui/waldatelier-icons.js`, `FK.icons.element(name)` or `FK.icon(name)` |
| World controls: map, settings and back | Simple illustrated symbols with broad brown outlines, nearly flat cream/ochre fills and restrained blue/red marks; no miniature scenery, grain, stamps or material realism | `assets/interface/navigation-symbols.webp`, `navigation-back.webp`, `FK.hudArt.element(name)`; [recorded prompts and sources](artwork/README.md) |
| Den/home map marker | Canonical watercolour/pencil tree home, reduced in detail to match the animal portraits | `assets/interface/den-marker.webp`, `FK.hudArt.element('den')`, [source/preparation](artwork/den-marker.json) |
| Leaving-den sign | Simple illustrated open door and exit arrow; softly irregular sepia outlines and nearly flat cream/ochre/blue fills matching settings/map/letter; no wood grain or material shading | `assets/interface/exit-symbol.webp`, `FK.hudArt.element('door')`, [source and packing](artwork/exit-symbol.json) |
| Navigation back in menus, galleries, review and puzzle host rows | The same simple ochre left arrow with broad sepia outline everywhere, matching map/letter/settings; quiet cream circular button, no wood grain or raised wooden rim; 56 px button, 40 px picture | `FK.hudArt.decorateBack(button)`, `FK.ui.topbar`, `css/navigation.css`; task-direction arrows remain functional SVGs |
| Picture letter | Drawn cream stationery with transparent deckled edges and leaf stamp; the sender's canonical watercolour/pencil portrait is composited on its clear left half | `assets/interface/letter-paper.webp`, `FK.friendsArt.letterPortrait(id)`; [letter recipe](artwork/letter-paper.json) |
| Puzzle surroundings and map | Painted woodland backdrop; the adopted flat top-down map uses calibrated geography, painted-animal pins without visible names, 64 px hit areas and real world routing | `puzzle-clearing.webp`, `world-map.webp`, `js/friends/map-layout.js`, [calibration](artwork/world-map-layout.json) |
| Retired colouring pages and saved drawings | Inactive historical artwork/data; preserve saved IDs and local drawing records. The den table and paper pile remain in the background without drawing icons | `legacy/retired-runtime/assets/forest-friends/colouring-friends.webp`, `legacy/retired-runtime/js/art/`, `legacy/retired-runtime/js/paint/` |

A vocabulary fox is a drawn animal; invitation letters show the painted sender from the fourteen-friend letter atlas, including Reh, Igel and Steinbock. Every UI identity uses the shared painted cast, including letters, map, puzzles, menus, companions and celebration. The walking characters and den fox keep their real-time 3D models. Do not replace a scored subject with a character portrait because they name the same animal. No photographic/stock assets, platform emoji, CSS-drawn substitute animals or a new illustration style for one puzzle. Emoji may remain internal legacy content tokens, but are resolved to our art before display. A missing illustration is a content defect, not permission to fall back to an emoji.

The distinction between the 3D world and drawn learning pages is intentional. Within each role, use one treatment. Historical colouring artwork remains as legacy assets/data; drawing is no longer an active activity.

For every new image-generator request, follow the [single canonical illustration contract](illustrations/STYLE.md), its frozen reference pixels and complete generated prompt. Learning pictures use light watercolour washes, visible coloured-pencil strokes and organic contours; navigation uses the prescribed simpler detail level in the same palette. Historical prompts and images are archived records, never alternative current directions.

## Typography

All fonts are bundled locally; no network font requests.

| Role | Font | Weight / size |
| --- | --- | --- |
| Body, labels, controls, parent settings | Andika | 400 regular / 700 emphasis; body 16 px, controls usually 17–20 px, metadata 14 px minimum |
| Puzzle titles, prompts, answers, scored words/numerals | Andika | 700. Titles 20–30 px, prompts 21–29 px, scored text 29/34 px. See the [puzzle typography roles](PUZZLE-BLUEPRINT.md#illustration-and-typography). |
| Menu/section/modal headings | Baloo 2 | 700; titles 22–32 px responsive |
| Brand wordmark only | Baloo 2 | 800 permitted |
| Letter/digit tracing | Authored glyph paths | No font substitution; preserve stroke starts and direction |

`css/base.css` declares the font files and `css/typography.css`, loaded last, defines the roles. Controls inherit Andika. Keep Swiss Standard German wording; children's text is always in upper and lower case (the former capitals option is retired). No synthetic font weights, extra font families, text strokes or decorative shadows on learning text.

## Palette, surfaces and density

| Purpose | Colour family |
| --- | --- |
| Main ink / quiet secondary text | Brown `#4b3b2d` / `#78664f` |
| Paper / page | Cream `#fffaf0`, warm parchment `#f3edda` |
| Utility outlines | Sepia `#75593c`, shared 2.2-unit rounded strokes |
| Navigation / selection | Sage and moss; warm wood/ochre for card edges |
| Success / retry | Shared green confirmation / warm brown retry, with visible marks and accessible status |

`css/waldbuch.css` supplies the shared paper/wood tokens; `css/puzzle-rounds.css` owns the current puzzle layout. Task colours remain exact when they are the subject (colour reading, shapes, matching); never recolour an answer merely to match decoration. Avoid mixing neon toy gradients, hard black sticker shadows and glossy icon tiles into this page system.

Use one clear task area, generous cream space and a small portrait/context row. A puzzle has exactly five progress leaves. Keep control positions stable, icons inside the complete button hit area and touch targets at least 48 px. Use visible focus and accessible names. All iPad puzzle tasks and answers fit without scrolling, with the back arrow directly left of the host portrait and no separate title bar. Adapt through wrapping and bounded scrolling on narrow phones, safe areas and browser zoom. Reduced motion keeps meaningful static progress and celebration.

## Asset ownership and changes

- Register every new subject and use the canonical drawings. Pack transparent cells to the shared 80% visible extent and centre each silhouette with its proportions intact. Compare picture choices side by side and check their edges on light and dark backgrounds. Counted pictures show one object. [Framing and edge quality](illustrations/STYLE.md#framing-and-edge-quality)
- Live-world character identity comes from `tools/characters/plush.js` and the GLBs. UI identities come from the approved painted atlas and `FK.friendsArt.portrait`; `letterPortrait` uses the same image. Model renders are development references only. New portraits use the canonical `friend-portraits` request, preserving species, markings and accessories.
- Keep quiet puzzle utility icons in the shared SVG source, world controls in their simple symbol atlas and navigation backs in the one shared component. Reuse the current painted den marker and illustrated exit pictogram; generate additions with their registered role and the approved reference images. Register additions with the matching family and record their sources; no one-off or Unicode controls.
- No runtime imports, styles, assets or offline downloads may come from `legacy/` or retired design prototypes.
- After shared visual changes, regenerate the puzzle implementation fingerprint and compare affected iterations. Questions, answers, rules, interactions and actual picture changes require review. Typography corrections preserve approvals for otherwise matching tasks. Record the result in [Consistency audit](STYLE-AUDIT.md), run the design checks and capture the real game at phone and tablet sizes.

The owner approved [drawn map version 2](artwork/world-map.json) for runtime use. The prepared map has real interactive overlays, with calibrated landmark positions and a separate current-position marker. Preserve the projection and use the [map calibration workflow](../tools/map/README.md) when editing geography.

Historical references and fixed mockups are preserved in the [archive](../legacy/design-history/README.md); they are not competing specifications. New visual exceptions require an explicit update here, a reason and a real-renderer review before children see them.

The map panel is compact (maximum 940 px / 92 vw, 82 dvh), with no map/back header. A tap on the backdrop or Escape closes it and restores focus to the map launcher. Map and letter backdrop dismissal requires a tap that starts and ends outside the content; drags/pans never dismiss. The map board stays at least 880 px wide to preserve separated 64 px animal targets.
