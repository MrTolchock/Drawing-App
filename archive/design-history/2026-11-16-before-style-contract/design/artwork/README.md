# Waldpost artwork handoff for Claude

Start here for **every use of an image generator**: puzzle pictures, world navigation, letters, painted backgrounds and historical generated artwork. The [visual style](../VISUAL-STYLE.md) and [puzzle blueprint](../PUZZLE-BLUEPRINT.md) remain the current game specifications.

## Find and reuse an image

- **[Searchable puzzle image library](https://mrtolchock.github.io/Drawing-App/assets/waldatelier/)**: all 235 registered drawn pictures, their stable IDs, atlas cells and use in the 31 active puzzles. Search, copy an ID or download an individual transparent PNG. [GitHub directory](../../assets/waldatelier/README.md) · [JSON catalogue](../../assets/waldatelier/library.json).
- Puzzle drawings are saved together in **`assets/waldatelier/`**. Use `FK.visual.art(id)`; do not create another collection of duplicate puzzle images or reorder existing atlas cells. The image library exports existing artwork; it does not invoke a generator.
- **[Navigation and letter source files](sources/)** and [the exact new prompts](prompts/) are here. Runtime assets are in `assets/interface/`.
- **[Asset and generator inventory](assets.json)** maps the remaining artwork to its source, generator record or code pipeline. Background details are in [Backgrounds](BACKGROUNDS.md).

## What actually generates the pictures

The new navigation, letter and recent puzzle illustrations were made with **ChatGPT's hosted image-generation tool**, supplying the reference images themselves. The repository contains the briefs, sources, manifests and packing/conversion code. It contains no custom image model, hosted generator, credentials or service API client. The tool did not expose a model version or seed; these generations are not pixel-deterministic.

Claude needs an image-capable tool/service in its own environment. Attach the reference images to that service, adapt the recorded prompt to its API, and inspect the result. A filename in a text prompt does not supply its pixels. If generation is unavailable, Claude can still select existing pictures, prepare briefs and run local asset tools; explain the missing capability instead of claiming to have generated artwork.

Keep three roles separate:

| Role | How it is made | Use |
| --- | --- | --- |
| Learning subject | Drawn picture-book illustration | Animals, nouns, actions and counted objects in puzzles |
| Character identity | Render of the current GLB model | Sender portrait on a letter, map pins, host portrait and celebration; [portrait pipeline](../../tools/portraits/README.md) |
| World props / scenery | Drawn icons, letter paper or opaque painting | Navigation, stationery, den and clearing |

Never generate a new picture of a character to replace its model identity. The new letter is **blank stationery**; `letterPortrait(id)` adds the actual sender at runtime. Exact geometry, writing paths and the small puzzle utility icons are authored SVG/canvas, not generated illustrations.

## New world navigation and letter — 16 November 2026

| Asset | Exact prompt / references | Editable source | Preparation |
| --- | --- | --- | --- |
| Settings, map, envelope, den/home, door and back | [Generation](prompts/navigation-generation.txt), with the current den and forest-object sheet; then [transparency repair](prompts/navigation-transparency.txt), with the draft | [Draft](sources/navigation-draft.png), [final six-cell sheet](sources/navigation.png) | [Manifest](navigation.json), 3 × 2 cells, 320 px/cell; each subject fits 272 px |
| Invitation letter | [Generation](prompts/letter-generation.txt), with the current den and new navigation sheet | [Original PNG](sources/letter-paper.png) | [Manifest](letter-paper.json), 1200 × 900, WebP quality 90, real alpha outside the sheet |

The navigation repair removed the draft's faint coloured haze outside the objects. Inspect transparency **composited on cream and a contrasting background**, not just the source RGB preview. Transparent RGB can contain colour even where alpha is zero. Never paint a checkerboard into the image.

Rebuild from the saved sources:

```sh
node tools/illustrations/pack-atlas.cjs design/artwork/navigation.json
node tools/illustrations/prepare-image.cjs design/artwork/letter-paper.json
```

These commands need Node and ImageMagick 7 (`magick`) with WebP/profile support. Both accept `--output /tmp/example.webp` and `--icc-profile /path/to/sRGB.icc`; `WALDPOST_SRGB_PROFILE` and `WALDPOST_MAGICK` are also supported. Conversion needs no image-service key. Packing crops visible bounds while preserving the original alpha, fits each subject and leaves clean cell gutters. Letter conversion preserves its aspect ratio; it does not stretch the paper or bake in a sender.

### Simplified navigation symbols — 9.3.77

The owner requested simpler, more illustrative controls instead of tiny realistic objects. **Settings, map and envelope now use [navigation-symbols.webp](../../assets/interface/navigation-symbols.webp)**: bold brown outlines, broad nearly flat fills and a few meaningful interior marks. No wood grain, paper fibres, brass hub, tiny trees, postage stamp or embossed leaf. [Exact simplification prompt](prompts/navigation-symbols-generation.txt) · [original generated PNG](sources/navigation-symbols.png) · [packing manifest](navigation-symbols.json). The original six-icon atlas was supplied as the palette/subject reference; no final repair pass was needed.

```sh
node tools/illustrations/pack-atlas.cjs design/artwork/navigation-symbols.json
```

The new atlas is **2 × 2**: `gear, map, letter`, then one empty cell. It is deliberately separate from the original 3 × 2 atlas: the approved den/home tree, exit door and back arrow keep their original pixels. Do not regenerate those pins when changing toolbar symbols.

World pictures use `FK.hudArt.element(name)` in `js/friends/hud-art.js`, which selects the appropriate atlas and cell. **Every navigation back uses `FK.hudArt.decorateBack(button)`**, including the map and the shared `FK.ui.topbar` used by Settings, galleries, review and puzzle pages. `css/navigation.css` supplies their common cream/wood 56 px frame and 40 px drawn arrow; labels, callbacks and keyboard activation stay with the original button. A hidden legacy SVG handle remains for the retired handwriting overview's home/back update; it is not a second visible icon. Direction arrows within tasks and handwriting are separate functional content.

The letter background is applied in `css/waldbuch.css`; its portrait occupies the clear left half. Test the complete letter, door delivery, map, parent gate and all back routes at phone/tablet sizes, including a short landscape viewport. New sources must keep the simplified symbols' bold shape language; do not add material realism back to the toolbar.

## Puzzle pictures

The [puzzle illustration handoff](../illustrations/README.md) contains the detailed style template, packing rules, exact recent prompts and cell manifests. Use the library to find the closest existing action/subject sheet before requesting new art.

The [16 November gallery audit](../illustrations/GALLERY-STYLE-AUDIT.md) records all 235 pictures, the 38 style outliers that were redrawn and the 197 retained pictures. Use `animals.webp` and `words-two.webp` as the primary majority-style references. The corrected actions/objects/flowers retain exact generation and spacing-repair prompts, before references, editable sources and manifests. Learning drawings keep their pencil/watercolour technique, separately from the simpler navigation symbols.

The shared style is warm coloured-pencil/watercolour/gouache picture-book drawing, soft textured edges, gentle shading, honey/cream/sepia with restrained woodland greens and blues. Match the **supplied picture reference**, not a generic description of “cartoon”. Animals need accurate anatomy; one counted item must depict one object. Preserve action contrasts, exact scored colours, square cells, generous transparent padding and fixed cell order. Use drawn subjects for answers and model portraits for identity.

After adding/registering a picture, run:

```sh
npm ci --prefix tools
node tools/illustrations/library.cjs
node tools/illustrations/library.cjs --check
node tools/puzzle-catalogue.cjs
node tools/check-design.cjs
```

The image catalogue is generated from the real runtime registry and renderer dependencies, including common progress/celebration art. It distinguishes all available pictures from those used by active puzzles. Adding unused assets/documentation does not grant approvals. A changed picture, content or interaction reopens the affected puzzle's normal review.

## Recovered original records

These records were recovered from the preserved project archive. Historical names and old asset paths are retained verbatim inside the briefs; use current paths/roles from the inventory when implementing a change.

| Recorded material | Source now easy to find | Limitation |
| --- | --- | --- |
| Original Waldatelier landscape and nine sheets, including alphabet supplement | [Recorded prompts](prompts/recorded-waldatelier.json) | Original source: `archive/project-baseline/design/waldatelier/`; individual sheets may have later repairs |
| Initial den, forest and character concepts | [Recorded concepts](prompts/recorded-forest-concepts.json) | The den-v1 concept is not the final den-v2 edit; the exploratory character/forest images are not production 3D assets |
| Generated fox app icon | [Recorded brief and export notes](prompts/recorded-app-icon.json) | A brief is retained, not a complete provider request/seed |
| Five early visual directions | [Recorded style-direction briefs](prompts/recorded-style-directions.json) | Only Waldatelier was selected; these are historical experiments, not alternative current styles |
| Wildlife, rhyme words and natural fox | [Recent puzzle sources and prompts](../illustrations/README.md) | Includes the actual generation/padding/repair passes that were saved |

The **final den-v2 edit**, **puzzle clearing**, older **forest actions/objects**, **menu**, **puzzle vocabulary/flower** sheets and historical colouring/painted portrait sheets do not have a complete original final-generation request in the repository. The inventory says so explicitly. Use the saved current image as a reference and a clearly marked reconstruction recipe; do not present a new recipe as the lost original prompt. Original PNGs for many older sheets can be recovered from Git history (see Backgrounds and the inventory).

## Finish and publish

Record the actual tool/date, input references, complete prompt, editable source, source SHA-256 and conversion manifest for each new generation. Inspect source anatomy/composition and the actual game; keep all borders inside their cells. Add runtime assets to `sw.js`, bump app/cache versions and follow [Development](../../docs/DEVELOPMENT.md). Preserve saves, archive originals and the review data branch. Document-only/catalogue changes do not require a runtime version bump. Never generate editorial approvals or use the production review ledger for fixture writes.
