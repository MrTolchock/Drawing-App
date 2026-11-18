# Drawn learning pictures

Start with the [canonical illustration style](STYLE.md), **`waldpost-watercolour-pencil-v1`**, and its fixed animal/object reference pixels. Every forward prompt uses that same style block. The [artwork handoff](../artwork/README.md) covers navigation, paper and backgrounds under the same contract.

## Reuse and generate

Search the [picture library](../../assets/waldatelier/README.md) and reuse stable IDs with `FK.visual.art(id)`. New subjects belong in `assets/waldatelier/`. Preserve existing IDs and cell positions.

```sh
node tools/illustrations/style.cjs --request subject-sheet
node tools/illustrations/style.cjs --request puzzle-vocabulary
node tools/illustrations/style.cjs --request forest-actions
node tools/illustrations/style.cjs --request layout-repair
```

The JSON output contains the complete prompt, absolute paths of the actual reference images, and `transparent_background`. Supply these to the available image-generation/editing service. It is a local request-preparation tool, not an image model or service client. Keep the two canonical images first when adding a current edit target. No archived artwork is a generation-style input.

Every existing atlas has a specific request with the same ID as the sheet, including the older vocabulary, animal and menu sheets. The [complete generator-input index](../artwork/GENERATOR-INPUTS.md) lists all 18 and supplies portable full requests for any AI model. Use `subject-sheet` only as a template for new subjects; `layout-repair` and `transparency-repair` need an explicit current target. Read the subject/layout brief, fill any generic placeholders and regenerate complete prompts before use. Change subjects/layout in `briefs/`, not the generated `prompts/` files. Every request retains the current style and final style-priority instruction.

## Prepare and integrate

Node, ImageMagick 7 (`magick`) with WebP/profile support and an sRGB ICC profile are required for preparation. Generation uses the external image-capable service; conversion needs no service credential.

```sh
node tools/illustrations/pack-atlas.cjs design/illustrations/forest-actions.json --output /tmp/forest-actions.webp
```

Manifest source/output paths are relative to the manifest. `--output` is relative to the working directory; `--icc-profile`, `WALDPOST_SRGB_PROFILE` and `WALDPOST_MAGICK` override local tool/profile locations. Packing finds subject bounds above the recorded alpha threshold, preserves aspect ratio and edge alpha, centres each picture and writes a profiled lossless WebP. Current sheets use 320 px cells and 256 px subject bounds; unused trailing cells stay transparent. A single registered subject uses a 2 × 2 atlas to preserve the renderer's grid contract.

Set `sourceCellPixels` when the generator supplies fewer trailing rows than the output grid. Each declared subject still has a complete square source cell. The packer fills the unused output cells with transparency.

Inspect every picture against its intended answer and canonical references. Register ordered IDs and any grid override in `js/ui/waldatelier.js`, preserve accessible labels and exact quantities, and add new runtime dependencies to `sw.js`. Runtime art changes require app/cache version updates, generated fingerprints and normal adult review.

```sh
node tools/illustrations/style.cjs --check
node tools/illustrations/library.cjs
node tools/illustrations/handoff.cjs
node tools/illustrations/handoff.cjs --check
node tools/puzzle-catalogue.cjs
node tools/check-design.cjs
```

Follow the relevant checks in [Development](../../docs/DEVELOPMENT.md). Current final sources and packing manifests are editable preparation inputs. Their archived `generationRecord` is provenance only; use `forwardPrompt` for new work. [Historical records](../../legacy/design-history/2026-11-16-before-style-contract/README.md) retain all original prompts, old styles and drafts without presenting them as current instructions.

For a correction to one cell of an existing packed atlas, keep the other visible RGBA pixels and cell positions unchanged. The current corrected puzzle-vocabulary and portrait manifests retain already packed composite PNGs with `preservePixels: true`. Export them with `node tools/illustrations/prepare-image.cjs <manifest>`; this mode requires the exact output dimensions and writes profiled lossless WebP without resizing/repacking unaffected cells. Actual generator output and the original base commit/hash are recorded separately in each generation record.

The 9.3.95 library repair uses the previous release as its packed source and adds the recorded redraws to specific cells. To reproduce the atlases, install the locked dependencies with `npm ci --prefix tools` and run the command below in a checkout with the 9.3.94 commit available. Add a sheet ID at the end to prepare one sheet. The [repair record](library-repair-2026-11-18.json) lists each corrected ID, the framing values and the retained generator inputs.

```sh
node tools/illustrations/prepare-library-repair.cjs design/illustrations/library-repair-2026-11-18.json /tmp/waldpost-library
```
