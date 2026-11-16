# Painted backgrounds and other generated art

The original images are the strongest references. Send the actual pixels to the generator. A prompt alone cannot reproduce their exact brushwork, framing or layout. The tools used for the older images did not retain an exposed model version/seed.

## The den painting

Current file: [den-v2.webp](../../assets/forest-friends/den-v2.webp), **1448 × 1086 (4:3), opaque**. The final room edit first shipped in commit `44574ce` on 8 November 2026. [Historical implementation record](../../archive/design-history/forest-friends/visuals/milestones/den-polish/COMPARISON.md).

The [initial den-v1 prompt is recorded](prompts/recorded-forest-concepts.json); its reference concept is [preserved here](../../archive/design-history/forest-friends/visuals/den-v1.png). It included a fox and open doorway. Later illustrated edits produced the current empty room with closed door, brass mail slot and no loose floor cushion. The complete final edit prompt/source PNG was not retained. Use [this labelled reconstruction recipe](prompts/den-current-reconstruction.txt) with **the current den-v2 image** for a new edit.

The live fox, shadow, sleep and effects are rendered separately by `js/friends/painted.js`. Never paint another fox into the room. Layout depends on these existing anchors:

| Constraint | Runtime value |
| --- | --- |
| Source canvas | 1448 × 1086 |
| Perspective lens | 30° FOV; camera y=12; tilt −17° |
| Authored standing / bed spots | `(300,440)` / `(80,405)` on a 1024 × 768 reference |
| Door hot spot | `(859,346)` on that reference |
| Brass mail overlay | Source rectangle `(1180,280,106,34)`; centre x=1233 |
| Portrait/landscape crop | `scenes.den.need=[.03,.2,.97,.92]`, plus the live cover/view-offset calculation |

Keep the bed, floor perspective, door, slot, shelf and drawing table in place. Test real standing, door delivery, walking and sleep at phone/tablet sizes after any painting change. If the composition intentionally moves, update the matching coordinates and test the complete journey.

## Clearing behind puzzle pages, menus and settings

Current file: [puzzle-clearing.webp](../../assets/forest-friends/puzzle-clearing.webp), **1536 × 1024 (3:2), opaque**. Its original PNG first shipped with `6f40fc0` on 9 November 2026; the WebP conversion followed in `6226578`. The original generator prompt was not retained. [Current reconstruction recipe](prompts/puzzle-clearing-reconstruction.txt).

This **one painting** supplies the woodland behind puzzle pages, adult gallery/review, menus and Settings. There is no separate generated settings background. `css/puzzle-rounds.css`, `css/puzzles.css` and `css/waldbuch.css` choose crops and light/dark CSS washes. Paper panels, buttons, stitches, labels and portraits are separate DOM/CSS/model layers. Do not ask the generator to paint those controls into the scenery.

Keep the central field pale and quiet. Trees/canopy frame the sides and upper corners; ferns, white flowers, acorns, leaves and mushrooms stay mainly at the perimeter. Preserve that quiet area through `center / cover` crops and different phone/tablet aspect ratios. Editing this shared painting changes the presentation of every puzzle that uses it and requires review again.

Recover the original pre-WebP clearing for a reference or conversion comparison:

```sh
git show 6f40fc0:assets/forest-friends/puzzle-clearing.png > /tmp/waldpost-clearing-original.png
```

The 2026-11-09 conversion used WebP **quality 82** and exact alpha. For new opaque painting exports, retain a PNG source, convert in sRGB at the intended dimensions, inspect the result and record the actual command/version. Do not upscale or crop the den to another ratio merely to match a generator's default canvas.

## Other image-generator uses

| Artwork | Record / workflow |
| --- | --- |
| Lake Zürich / fox landscape (`assets/waldatelier/hero.webp`) | Original `hero` prompt in [recorded-waldatelier.json](prompts/recorded-waldatelier.json). 3:2 landscape: fox/tree in the left quarter, quiet pale lake/sky to the right, distant Grossmünster. Historical landing-screen art; it is not the Settings woodland. |
| Drawn learning atlases | [Image library](../../assets/waldatelier/README.md), original/modern prompts and [packing handoff](../illustrations/README.md). Sources with lost final prompts use the [explicit reconstruction template](prompts/puzzle-sheet-reconstruction.txt). |
| New world icons and letter paper | [Exact prompts, sources and commands](README.md#new-world-navigation-and-letter--16-november-2026). Real alpha outside objects/paper; no generated sender portrait. |
| App/install icon | [Original brief](prompts/recorded-app-icon.json), source image under `archive/project-baseline/design/waldatelier/`. The PNG install sizes and SVG wrapper were mechanical exports; the maskable export used a 75% portrait on warm ivory. This is branding, not a puzzle character identity. |
| Historical colouring sheet (`colouring-friends.webp`) | Image-tool-generated six-panel black/white colouring art; [historical record](../../archive/design-history/forest-friends/visuals/milestones/den-polish/COMPARISON.md). Final prompt not retained. If repairing a historical panel, supply that sheet as reference, keep closed fill regions, fixed 3 × 2 order and historical save/template IDs. Colouring is not an active game activity. |
| Historical painted postcard portraits | Generated for the earlier picture-letter experiment; recorded in the same historical den-polish note. Superseded by the current model-rendered portrait atlas. Do not restore these as current character identity. |
| Early style boards / character and forest concepts | [Recorded visual directions](prompts/recorded-style-directions.json) and [concept prompts](prompts/recorded-forest-concepts.json); images remain in the archive. They explain art history and do not override the current visual rules. |

## Drawn-looking work that does not use an image generator

- **Picture map:** `tools/map/map.html` paints the actual world layout into `assets/forest-friends/world-map.webp`. [Rebuild command and recent map notes](../../tools/map/README.md). World coordinates, pin positions and the live Fuchs marker determine the map; do not invent its geography in an image prompt.
- **Current character portraits:** same GLB models, consistent camera/light, [rendered with `tools/portraits/`](../../tools/portraits/README.md). Characters are sculpted/baked with [the character tools](../../tools/characters/README.md).
- **3D world, water, sky, painted distance and surface textures:** geometry, materials, shaders and canvas in `js/friends/world/`, `forest3d.js` and `characters3d.js`; not a generated background image.
- **Puzzle geometry, routes, handwriting paths, progress and quiet utility icons:** SVG/canvas/code and bundled fonts. Their exact coordinates, strokes and colours are functional content.
- **Paper/wood control frames, shadows and background washes:** CSS. Only the new foreground navigation pictures and invitation stationery use the new generated art.

For a new background, keep its editable source, actual prompt/reference list, generator/date and conversion manifest beside this guide. `tools/illustrations/prepare-image.cjs` converts a `waldpost-illustration-image` manifest; `contain` preserves the complete source, while an explicitly chosen `cover` crops to the target. Use `transparent:false` for scenery, `true` for isolated paper/props. The current [letter manifest](letter-paper.json) is a working example. Inspect the complete game and offline installation before publishing.
