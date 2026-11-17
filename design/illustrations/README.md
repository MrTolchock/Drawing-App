# Drawn learning pictures

Start with the [canonical illustration style](STYLE.md), **`waldpost-watercolour-pencil-v1`**, and its fixed animal/object reference pixels. Every forward prompt uses that same style block. The [artwork handoff](../artwork/README.md) covers navigation, paper and backgrounds under the same contract.

## Reuse and generate

Search the [235-picture library](../../assets/waldatelier/README.md) and reuse stable IDs with `FK.visual.art(id)`. New subjects belong in `assets/waldatelier/`; preserve existing IDs and cell positions.

```sh
node tools/illustrations/style.cjs --request subject-sheet
node tools/illustrations/style.cjs --request puzzle-vocabulary
node tools/illustrations/style.cjs --request forest-actions
node tools/illustrations/style.cjs --request layout-repair
```

The JSON output contains the complete prompt, absolute paths of the actual reference images, and `transparent_background`. Supply these to the available image-generation/editing service. It is a local request-preparation tool, not an image model or service client. Keep the two canonical images first when adding a current edit target. No archived artwork is a generation-style input.

Every existing atlas has a specific request with the same ID as the sheet, including the older vocabulary, animal and menu sheets. The [complete generator-input index](../artwork/GENERATOR-INPUTS.md) lists all 17 and supplies portable full requests for any AI model. Use `subject-sheet` only as a template for new subjects; `layout-repair` and `transparency-repair` need an explicit current target. Read the subject/layout brief, fill any generic placeholders and regenerate complete prompts before use. Change subjects/layout in `briefs/`, not the generated `prompts/` files. Every request retains the current style and final style-priority instruction.

## Prepare and integrate

Node, ImageMagick 7 (`magick`) with WebP/profile support and an sRGB ICC profile are required for preparation. Generation uses the external image-capable service; conversion needs no service credential.

```sh
node tools/illustrations/pack-atlas.cjs design/illustrations/forest-actions.json --output /tmp/forest-actions.webp
```

Manifest source/output paths are relative to the manifest. `--output` is relative to the working directory; `--icc-profile`, `WALDPOST_SRGB_PROFILE` and `WALDPOST_MAGICK` override local tool/profile locations. Packing finds subject bounds above the recorded alpha threshold, preserves aspect ratio and edge alpha, centres each picture and writes a profiled lossless WebP. Current sheets use 320 px cells and 256 px subject bounds; unused trailing cells stay transparent. A single registered subject uses a 2 × 2 atlas to preserve the renderer's grid contract.

Inspect every picture against its intended answer and canonical references. Register ordered IDs and any grid override in `js/ui/waldatelier.js`, preserve accessible labels and exact quantities, and add new runtime dependencies to `sw.js`. Runtime art changes require app/cache version updates, generated fingerprints and normal adult review; they never grant approval automatically.

```sh
node tools/illustrations/style.cjs --check
node tools/illustrations/library.cjs
node tools/illustrations/handoff.cjs
node tools/illustrations/handoff.cjs --check
node tools/puzzle-catalogue.cjs
node tools/check-design.cjs
```

Follow the relevant checks in [Development](../../docs/DEVELOPMENT.md). Current final sources and packing manifests are editable preparation inputs. Their archived `generationRecord` is provenance only; use `forwardPrompt` for new work. [Historical records](../../legacy/design-history/2026-11-16-before-style-contract/README.md) retain all original prompts, old styles and drafts without presenting them as current instructions.
