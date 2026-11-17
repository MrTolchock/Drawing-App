# Image-generator inputs for any AI model

This is the starting point for recreating Waldpost's pictures. Everything needed from this repository is committed to GitHub: complete prompts, actual reference images, stable subject/cell order, retained editable sources, preparation manifests and provenance. No previous chat is required.

**[Download/read the complete generator handoff](generator-inputs.json).** It contains every registered request as full text, its ordered image inputs and transparency flag, plus every shipped image's dimensions, SHA-256, role and available preparation/source records. Paths are relative to the repository root so another model can use any checkout. The [browsable picture library](../../assets/waldatelier/README.md) also offers individual transparent PNG downloads.

## Supply a request to another model

1. Read the [canonical style](../illustrations/STYLE.md). In `generator-inputs.json`, select `requests[<request ID>]`, or run `node tools/illustrations/style.cjs --request <request ID>` from the repository root.
2. Supply **the entire `request.prompt`**, including the shared style and final priority instruction. Attach the actual images in `request.referenced_image_paths`, in that order. The first two are always the fixed [animal](../illustrations/references/watercolour-pencil-v1/animals.png) and [object](../illustrations/references/watercolour-pencil-v1/objects.png) style references. Other images define composition, character identity or navigation simplicity as explicitly recorded in `references`.
3. Use `request.transparent_background`. If another service uses different field names, translate them while keeping the prompt, ordered image pixels and intended alpha. Rebase relative paths to your checkout or upload those files; filenames and GitHub links alone do not attach their pixels. The command-line request uses absolute local paths; the committed JSON uses portable relative paths.
4. Select the aspect ratio specified in the brief. The asset's `files` record describes the shipped dimensions; its preparation manifest or `exportRecipe` describes the export target. An export size is not a recovered model API parameter. For an edit, keep the current target after the canonical pair; preserve camera anchors, cell order and quiet panel space.
5. Inspect the result, retain a PNG source and save the **actual** request, ordered references/hashes, generator/model/date and source hash. Pack/convert with the recorded settings, then inspect the actual phone/tablet UI. Newly generated art still needs normal puzzle review.

Example, using any available image-generation service:

```sh
node tools/illustrations/style.cjs --request den > /tmp/waldpost-den-request.json
node tools/illustrations/style.cjs --request puzzle-vocabulary > /tmp/waldpost-vocabulary-request.json
```

The repository prepares inputs; it does not include a hosted image model, API key or deterministic seed. Earlier model identifiers and seeds were not retained/exposed. These are usable reconstruction/edit recipes; a different model will not reproduce identical pixels. Actual historical generation records remain separately linked as provenance and do not override the current style.

## Puzzle pictures: all 238 subjects

Each of the 18 atlases has its own complete prompt and ordered stable IDs. No sheet below requires filling the generic `subject-sheet` template. Cell indices are zero-based in JSON; prompt rows are one-based, left to right then top to bottom. Empty trailing cells remain transparent. Current atlases are attached as composition-only inputs after the canonical style pair.

| Request ID / sheet | Grid | Complete prompt |
| --- | --- | --- |
| `alphabet` | 4 × 4 | [Alphabet vocabulary](../illustrations/prompts/alphabet.txt) |
| `animals` | 4 × 4 | [Animals](../illustrations/prompts/animals.txt) |
| `creatures` | 4 × 4 | [Creatures and vehicles](../illustrations/prompts/creatures.txt) |
| `discovery` | 4 × 4 | [Discovery subjects](../illustrations/prompts/discovery.txt) |
| `forest-actions` | 4 × 4 | [Animal action contrasts](../illustrations/prompts/forest-actions.txt) |
| `forest-fox` | 2 × 2; one occupied | [Learning fox](../illustrations/prompts/forest-fox.txt) |
| `forest-objects` | 4 × 4 | [Woodland objects](../illustrations/prompts/forest-objects.txt) |
| `forest-wildlife` | 4 × 4 | [Woodland species/actions](../illustrations/prompts/forest-wildlife.txt) |
| `menu` | 3 × 2 | [Retained menu subjects](../illustrations/prompts/menu.txt) |
| `navigation` | 4 × 4 | [Learning/menu motifs](../illustrations/prompts/navigation.txt) |
| `people` | 4 × 4 | [People and vocabulary](../illustrations/prompts/people.txt) |
| `puzzle-flowers` | 3 × 2 | [Six scored flower colours](../illustrations/prompts/puzzle-flowers.txt) |
| `puzzle-vocabulary` | 4 × 5 | [Twenty puzzle nouns](../illustrations/prompts/puzzle-vocabulary.txt) |
| `review-nature` | 2 × 2; three occupied | [Empty basket, swimming habitat and squirrel with nut](../illustrations/prompts/review-nature.txt) |
| `rhyme-vocabulary` | 4 × 4; ten occupied | [Rhyme nouns](../illustrations/prompts/rhyme-vocabulary.txt) |
| `words-one` | 4 × 4 | [Vocabulary 1](../illustrations/prompts/words-one.txt) |
| `words-two` | 4 × 4 | [Vocabulary 2](../illustrations/prompts/words-two.txt) |
| `words-three` | 4 × 4 | [Vocabulary 3](../illustrations/prompts/words-three.txt) |

For each sheet, `assets` in the JSON records its exact runtime filename, width/height, columns/rows and ordered `subjects`, including stable IDs, source rectangles, labels, tokens and puzzle usage. [library.json](../../assets/waldatelier/library.json) is the picture-level catalogue. Preserve IDs and ordering when replacing artwork; English IDs are metadata, not text to paint into the image. Exact answer colours, quantities, species and action contrasts are functional content.

The newer sheets retain editable PNGs and [packing manifests](../illustrations/README.md). Older sheets have original briefs or inventory-only provenance and no retained final packing manifest; the JSON says so. For a newly generated source, make an atlas manifest using its existing columns/rows and ordered subject list, an integer square cell size and explicit subject bounds. See [forest-actions.json](../illustrations/forest-actions.json) for the format. Do not apply a default 4 × 4 square grid to the 3 × 2 or 4 × 5 sheets. `pack-atlas.cjs` preserves aspect ratio and genuine edge alpha; it cannot repair an incorrect subject or quantity.

## Painted scenes, map, letters and icons

| Image / purpose | Request ID and complete prompt | Inputs and preparation |
| --- | --- | --- |
| [Den painting](../../assets/forest-friends/den-v2.webp) | `den` · [Prompt](prompts/den.txt) | Opaque 1448 × 1086, 4:3. Current painting supplies composition; preserve bed, empty floor, closed door, brass mail slot and drawing table. The live fox is separate. [Camera, crop and hotspot anchors](BACKGROUNDS.md). |
| [Clearing behind puzzle pages](../../assets/forest-friends/puzzle-clearing.webp) | `puzzle-clearing` · [Prompt](prompts/puzzle-clearing.txt) | Opaque 1536 × 1024, 3:2. Current painting supplies framing; pale quiet centre, trees/foliage at the edges. |
| Painted woodland behind menus, Settings, gallery and review | **The same `puzzle-clearing` request and file** | CSS supplies cover crops and light/dark washes. There is no separate Settings painting to regenerate. |
| [Painted world map](../../assets/forest-friends/world-map.webp) | `world-map` · [Prompt](prompts/world-map.txt) | Opaque 1536 × 1024, strict top-down 2D. [Source/export](world-map.json), [calibration](world-map-layout.json), [map tooling](../../tools/map/README.md). Real pins and current position remain separate. |
| [Settings, map and envelope symbols](../../assets/interface/navigation-symbols.webp) | `navigation-symbols` · [Prompt](prompts/navigation-symbols.txt) | Transparent 2 × 2 atlas: gear, folded map, sealed envelope, empty. [PNG, cell order and packing](navigation-symbols.json). Additional simplicity reference is part of the request. |
| [Navigation back arrow](../../assets/interface/navigation-back.webp) | `navigation-back` · [Prompt](prompts/navigation-back.txt) | Same simple illustrated control family. [Source/export](navigation-back.json). |
| [Den exit sign](../../assets/interface/exit-symbol.webp) | `exit-symbol` · [Prompt](prompts/exit-symbol.txt) | Same simple illustrated control family. [Source/export](exit-symbol.json). The retained SVG is superseded. |
| [Den marker on map](../../assets/interface/den-marker.webp) | `den-marker` · [Prompt](prompts/den-marker.txt) | Transparent compact painted landmark matching animal map pins. [Source/export](den-marker.json). |
| [Invitation paper](../../assets/interface/letter-paper.webp) | `letter-paper` · [Prompt](prompts/letter-paper.txt) | Transparent 1200 × 900. Empty sender area; portrait/name are separate layers. [Source/export](letter-paper.json). |
| [Shared friend portraits](../../assets/forest-friends/character-portraits.webp) | `friend-portraits` · [Prompt](prompts/friend-portraits.txt) | Transparent 4 × 4 atlas, 1280 × 1280: fourteen friends, sleeping fox, empty. [Cast/order](LETTER-FRIENDS.md), [composition/export](friend-portraits.json). Used on letters, puzzles, menus, pins and celebrations. |
| [Fourteen-friend preparation input](prepared/letter-friends.webp) | `letter-friends` · [Prompt](prompts/letter-friends.txt) | Retained base cast; [source/export](letter-friends.json). Identity reference defines markings/accessories, not 3D style. |
| [Sleeping-fox preparation input](prepared/fox-sleep.webp) | `fox-sleep-portrait` · [Prompt](prompts/fox-sleep-portrait.txt) | Separate generated pose composed into shared portraits. [Source/export](fox-sleep-portrait.json). |
| [App/install emblem](../../icons/icon-512.png) | `app-icon` · [Prompt](prompts/app-icon.txt) | Current icon supplies identity/framing. Export 192/512 px PNG and 180 px Apple icon; maskable 512 px uses 75% portrait on warm ivory; SVG embeds the PNG. All output hashes/dimensions are in JSON. |
| [Older Lake Zürich scene](../../legacy/retired-runtime/assets/waldatelier/hero.webp) | [Archived recipe](../../legacy/retired-design/design/artwork/prompts/lake-hero.txt) | Retained landing image, opaque 1536 × 1024. Fox/tree at left, quiet lake/sky at right. Separate from the active woodland clearing. |

Generic `subject-sheet` and `background` templates and `layout-repair` / `transparency-repair` requests are also included in the JSON, marked `requiresBriefCustomization`. Fill their subject/layout details and attach the current target when repairing an image. `drawn-map-draft` describes a separate proposal workflow; use `world-map` for the adopted runtime painting.

## Original records, missing history and retained art

Current full requests are **forward recipes**. They do not claim to be the original requests for older art. Each asset links to a retained actual generation record, archived original brief or an explicitly incomplete provenance record. New requests retain the actual arguments under [generation-records](generation-records/exit-symbol.json), including ordered reference/source hashes. Current source manifests embed the source hash and actual-record path; mechanically composed portraits also record their component inputs.

The final den edit prompt/source PNG and original clearing prompt were not retained in full. Their current complete prompts reconstruct the required content using the shipped painting as a composition input. The clearing's original PNG is recoverable from Git history:

```sh
git show 6f40fc0:assets/forest-friends/puzzle-clearing.png > /tmp/waldpost-clearing-original.png
git show 991bb95:assets/waldatelier/hero.png > /tmp/waldpost-hero-original.png
```

The den final edit shipped in `44574ce`; clearing WebP conversion is recorded in `6226578` with quality 82. [Archived background provenance](../../legacy/design-history/2026-11-16-before-style-contract/design/artwork/BACKGROUNDS.md) retains earlier concepts and known gaps. Proposed exports for new PNGs are labelled `exportRecipe` rather than being passed off as recovered conversion commands. For new opaque scene PNGs, create an explicit `waldpost-illustration-image` manifest with width/height, `fit`, `transparent:false`, quality and provenance, then use `prepare-image.cjs`. [world-map.json](world-map.json) demonstrates the format. Do not overwrite a historical source or claim a reconstructed prompt is an actual generation record.

The [retired colouring sheet](../../legacy/retired-runtime/assets/forest-friends/colouring-friends.webp) is preserved under `legacy/` with saved template IDs, outside runtime and offline downloads. Its final generator prompt is missing. JSON records its six panels in fixed 3 × 2 order: fox painting, squirrel with nuts, owl reading, beaver at brook, mouse picnic and blue tit at nest, with each `bilderbrief-*` ID. It uses black outlines, white fill and closed colouring regions. This historical line-art activity has no active forward prompt under the painted style contract; its reconstruction facts and [historical account](../../legacy/design-history/forest-friends/visuals/milestones/den-polish/COMPARISON.md) remain available.

The old detailed [navigation atlas](../../legacy/retired-runtime/assets/interface/navigation.webp), geometric [exit SVG](../../legacy/retired-runtime/assets/interface/exit-symbol.svg), superseded map proposal and past portrait/style experiments are indexed as retained historical artifacts. Current prompts never use their old style directions. The [archive index](../../legacy/design-history/2026-11-16-before-style-contract/README.md) preserves original prompts, alternative directions, drafts and evidence unchanged.

## Images and surfaces made in code

The JSON's `codePipelines` records work that has no image-generator prompt: live 3D world/den fox, GLB sculpt/bake pipeline and model-reference renders, sky/water/materials/canvas textures, utility SVGs, exact handwriting/geometry paths and CSS paper/wood frames, stitches, shadows and background washes. Start with [visual role boundaries](../VISUAL-STYLE.md), [character sources](../../tools/characters/README.md) and [model-reference tooling](../../tools/portraits/README.md). The adopted world map and UI friend portraits are painted images; their older geometry/model renderers are development references.

## Keep the GitHub handoff complete

When changing subjects or layout, edit the registered brief and regenerate; do not hand-edit the generated complete prompts or JSON. For a new sheet, register its exact grid, subject IDs, request and inventory entry. Update the actual generation/source records after generation.

```sh
node tools/illustrations/style.cjs
node tools/illustrations/library.cjs
node tools/illustrations/handoff.cjs
node tools/illustrations/style.cjs --check
node tools/illustrations/library.cjs --check
node tools/illustrations/handoff.cjs --check
node tools/check-design.cjs
```

The handoff check compares the committed JSON against current full requests, reference hashes, sources, cell IDs/order and preparation records, and rejects any offline PNG/WebP/SVG omitted from the inventory. CI runs it for pushes and pull requests. Documentation/prompt maintenance alone changes no runtime pixels and grants no puzzle approvals.

## Repository history

The [legacy index](../../legacy/README.md) and [move manifest](../../legacy/manifest.json) locate retired assets, drafts and their exact original paths/hashes. Completed generation records retain the actual request text and reference filenames. `tools/legacy-paths.cjs` resolves those historical paths for provenance verification; active forward requests only attach current files. The approved map source is `sources/world-map.png`; draft copies and superseded attempts are historical records.
