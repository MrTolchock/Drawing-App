# Making Waldpost's drawn learning pictures

This is the handoff for Claude and other assistants making new puzzle illustrations. Read the [visual style](../VISUAL-STYLE.md) and [puzzle blueprint](../PUZZLE-BLUEPRINT.md) first. They remain the specifications for the game.

The 9.3.37 pictures were made with ChatGPT's hosted image-generation tool, using existing drawn sheets as image references and `transparent_background: true`. No custom model was trained for this project. The tool did not expose a model version or seed. This repository contains the prompts, references, editable outputs and preparation code; it does not contain the hosted generator or service credentials. Generation is not pixel-deterministic.

## Using this from Claude

Use whatever image-generation/editing service is available in the current environment. Supply the reference images themselves, rather than only mentioning their filenames in a text prompt. Keep the style and layout requirements below when adapting a prompt to another provider.

If the environment cannot generate images, say so and ask the owner for an image-generation tool or a generated PNG using these prompts. Claude can still plan the subjects, prepare the prompts and run the packing/integration steps. Do not claim images were generated without actually using an image generator. The owner can also generate a sheet in ChatGPT and hand the PNG back to Claude for preparation.

## Style references

Use these **drawn learning subjects** as reference inputs:

| Reference | What it establishes |
| --- | --- |
| [Existing animal actions](../../assets/waldatelier/forest-actions.webp) | Animal proportions, warm pencil/crayon shading and clear action contrasts |
| [Existing vocabulary](../../assets/waldatelier/puzzle-vocabulary.webp) | Drawn objects, textured edges, colour palette and isolated subjects |
| [New woodland animals](../../assets/waldatelier/forest-wildlife.webp) | Matching action pairs plus Swiss woodland species |
| [New rhyme vocabulary](../../assets/waldatelier/rhyme-vocabulary.webp) | New nouns in the same picture-book family |
| [Phone owl task](../evidence/2026-11-14-review-feedback-2/friends-owl-390.png) | The actual size and clarity needed in the game |
| [Phone wildlife riddle](../evidence/2026-11-14-review-feedback-2/friends-hedgehog-390.png) | Three local-animal answer pictures on the real page |

The drawing style is a warm children's picture book: soft coloured-pencil/crayon texture, gentle shading, soft edges, warm browns/cream, restrained green/blue accents and friendly, recognizable subjects. Animals need believable anatomy and the features that make the answer correct. Keep identity and markings consistent between action pictures of the same animal.

Learning pictures use this drawn style. The separate [character identity atlas](../../assets/forest-friends/character-portraits.webp) is rendered from the game's 3D models and belongs on letters, host portraits and celebrations. Use the drawn references above for scored animals and objects.

## Prompts used for 9.3.37

These are the actual prompts, including the second pass that added more space around subjects:

| Sheet / order | Generate with an existing reference | Repair the generated draft | Editable source used for packing | Cell manifest |
| --- | --- | --- | --- | --- |
| Woodland actions and species | [Generation prompt](prompts/forest-wildlife-generation.txt), with `forest-actions.webp` | [Padding prompt](prompts/forest-wildlife-padding.txt), with that draft | [Padded source PNG](sources/forest-wildlife-padded.png) | [Manifest](forest-wildlife.json) |
| Rhyme nouns | [Generation prompt](prompts/rhyme-vocabulary-generation.txt), with `puzzle-vocabulary.webp` | [Padding prompt](prompts/rhyme-vocabulary-padding.txt), with that draft | [Padded source PNG](sources/rhyme-vocabulary-padded.png) | [Manifest](rhyme-vocabulary.json) |

The generator's padded outputs had smaller subjects than intended. The packing step crops each subject's visible bounds and restores a consistent scale and margin. Its alpha threshold is used to **find crop bounds**; it does not turn the artwork's alpha channel into a hard mask.

The manifests list subjects in left-to-right, top-to-bottom order. `forest-wildlife` has sixteen occupied cells. `rhyme-vocabulary` has ten occupied cells followed by six transparent empty cells. These orders must match the arrays in [the illustration registry](../../js/ui/waldatelier.js).

## Prompt template for new subjects

Attach one or two drawn reference sheets and adapt this template. Give every cell an explicit subject and action before generation.

```text
Create a companion Waldpost learning-illustration sheet matching the attached references.
Warm coloured-pencil/crayon children's picture-book drawing, soft textured edges,
gentle shading, restrained woodland colours and friendly, recognizable subjects.
Use accurate anatomy and keep the same animal's markings/proportions across action pairs.

Canvas: [shape/aspect ratio]. Exactly [columns] columns by [rows] rows of equal SQUARE cells.
Fully transparent RGBA background. No visible grid, labels, writing, numbers or decoration.
One scored subject per occupied cell, centered with generous transparent gutters.
Every ear, tail, foot, antenna, wing and branch must stay inside its own cell.
For an action pair, make the two actions visibly distinct while keeping the same animal.

Cell order, LEFT TO RIGHT and TOP TO BOTTOM:
1. [precise subject, species if relevant, and action]
2. [precise subject and action]
...
Remaining cells: completely transparent and empty.

Draw learning illustrations; no emoji, stock photos or 3D character-portrait substitutes.
```

Reference images matter more than adding more style adjectives. Inspect a first draft before requesting a repair. Ask the generator to correct anatomy, subject identity, opaque backgrounds, wrong cell order or objects crossing a cell boundary. The packing tool cannot fix those content defects.

For a single new subject, the tool also accepts a 1 × 1 manifest. For a multi-subject sheet, provide an already ordered grid as its input.

## Prepare a runtime atlas

Requirements: Node.js and **ImageMagick 7** (`magick` on `PATH`) with WebP and colour-profile support. The original pipeline used ImageMagick **7.1.1-43 Q16** and a system sRGB ICC profile. No image-service API key is needed for this local preparation step.

Run from the repository root. These commands rebuild the current atlases into temporary files without changing the game:

```sh
node tools/illustrations/pack-atlas.cjs design/illustrations/forest-wildlife.json --output /tmp/forest-wildlife.webp
node tools/illustrations/pack-atlas.cjs design/illustrations/rhyme-vocabulary.json --output /tmp/rhyme-vocabulary.webp
```

Use `--icc-profile /path/to/sRGB.icc` or `WALDPOST_SRGB_PROFILE` if the profile is not in a standard Linux/macOS location. `WALDPOST_MAGICK` can name the ImageMagick executable. Run `node tools/illustrations/pack-atlas.cjs --help` for usage. Manifest source/output paths are relative to the manifest; an explicit output path is relative to the current working directory.

Omit `--output` when you intend to write the manifest's runtime file. Each current atlas becomes **1280 × 1280**, with sixteen **320 × 320** cells and each subject fitted into at most **256 × 256** pixels. The tool derives input dimensions, crops the cells, finds subject bounds above 15% alpha, preserves the subject's aspect ratio, and centers it on a transparent cell. It creates unused cells as genuinely transparent images.

The final export is lossless WebP with an embedded sRGB profile. The separate final profile/export step is intentional: `magick montage` alone did not reliably retain the profile. It gives the extended `VP8X` WebP header expected by the existing asset checks. Different ImageMagick/WebP/profile versions can change encoded bytes; compare decoded RGBA pixels when validating a rebuild.

Both example commands were verified against the 9.3.37 runtime atlases: they reproduced identical decoded RGBA pixels and identical encoded bytes with the recorded ImageMagick/profile versions. The manifest cell orders were also checked against the runtime registry.

For a new sheet, copy a manifest, choose stable subject IDs, replace `source`/`output`, and edit the subject list and grid. Record the actual generator/date, prompts, reference files and source checksum under `provenance`. Keep cells square. Set unoccupied trailing cells by listing only the occupied subjects. Empty holes between subjects are not supported by this simple manifest format.

## Inspect and integrate

1. Inspect each subject against its intended question. Check anatomy, exact quantities, action differences, species markings and vocabulary. View transparency on cream paper as well as a contrasting background; low-alpha colour fringes can be misleading in a raw image viewer.
2. Compare the new pictures with existing ones at phone and tablet sizes. Keep useful scale and empty gutters. Check that neighboring cells never appear at an edge. A transparent background must be real alpha, not a painted checkerboard or white rectangle.
3. Register the atlas and ordered IDs in [js/ui/waldatelier.js](../../js/ui/waldatelier.js). Its default grid is 4 × 4; add a grid override for other dimensions. Add noun mappings in [puzzle-rounds.js](../../js/friends/puzzle-rounds.js) and accessible action/species labels in [the puzzle renderer](../../js/screens/puzzle.js) when needed.
4. Add the atlas path to [sw.js](../../sw.js). Keep subjects under `assets/waldatelier/`. Match the existing task format while adding content: owl tasks always have one sentence and two pictures; rhyme pairs count once regardless of word order; hedgehog riddles use Swiss woodland wildlife in every answer and distractor.
5. For changed runtime artwork/content, bump `FK.VERSION` and the service-worker cache version, regenerate with `node tools/puzzle-catalogue.cjs`, and follow the review rules in [Development](../../docs/DEVELOPMENT.md). Actual visual changes require review again; never manufacture approvals or overwrite the owner's review ledger as a fixture.
6. Run `node tools/check-design.cjs`, `node tools/puzzle-catalogue.cjs --check`, the relevant model/browser checks from Development, and capture real phone/tablet evidence. Test an offline reload and verify that the new atlases decode from the cache. Record the result in [the consistency audit](../STYLE-AUDIT.md).

Changes only to this guide, prompts, editable sources or preparation tools do not change the shipped runtime and need no app-version bump or review reset.
