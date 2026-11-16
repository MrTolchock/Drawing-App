# Artwork handoff for Claude

**Read the [canonical illustration style](../illustrations/STYLE.md) first.** Every image-generator request uses `waldpost-watercolour-pencil-v1`, the same fixed reference pixels and the generated complete prompts. There is one current style contract; role instructions control detail and composition.

## Choose the current request

| Work | Prompt ID | Guide |
| --- | --- | --- |
| Learning subjects/actions/colour pictures | `subject-sheet` or the registered sheet name | [Illustration workflow](../illustrations/README.md), [image library](../../assets/waldatelier/README.md) |
| Simpler settings/map/envelope symbols | `navigation-symbols` | Broad outlines, flat warm fills, no miniature scenery or material detail |
| Map den marker | `den-marker` | Watercolour/pencil landmark matching the animal pins; transparent, compact silhouette |
| Leaving-den sign | Authored SVG | Flat 64-unit icon with rounded sepia outline, cream/ochre/blue fills; edit `assets/interface/exit-symbol.svg`, no image generator |
| Navigation back arrow | `navigation-back` | Same simple symbol family; no wood grain, carving, bevel or circular backing in the picture |
| Invitation paper | `letter-paper` | Empty portrait zone; current sender added from the painted friend atlas |
| Shared painted UI friends | `friend-portraits` | Four-by-four atlas with fourteen friends plus sleeping Fuchs; same cast on letters, puzzles, map pins and menus |
| Sleeping Fuchs pose | `fox-sleep-portrait` | Matching scarf, markings and watercolour/pencil medium |
| Adopted drawn map | `world-map` | Flat 2D, strict top-down view; preserve geography and [calibration](world-map-layout.json). Named pins and current-position marker remain real interactive layers |
| New map proposal | `drawn-map-draft` | A separate future proposal, outside runtime until approved |
| Den painting | `den` | [Camera/layout anchors](BACKGROUNDS.md) |
| Shared puzzle/menu/settings woodland | `puzzle-clearing` | [Shared scene and quiet crop area](BACKGROUNDS.md) |
| New companion scene | `background` | Same canonical medium; explicit framing and panel-safe space |
| App branding | `app-icon` | Simple readable emblem; preserve install identity |
| Spacing/transparency edit | `layout-repair`, `transparency-repair` | Preserve content and the same style |

```sh
node tools/illustrations/style.cjs --request navigation-symbols
node tools/illustrations/style.cjs --request den
```

Pass the returned `prompt`, `referenced_image_paths` and `transparent_background` to the available image service. Paths in prose do not attach their pixels. The repository supplies reference files, briefs and preparation tools; it contains no custom model, hosted generator, service credentials or deterministic seed. If generation is unavailable, explain that capability gap and reuse existing images or prepare the brief.

The two canonical animal/object images always define drawing technique. Additional current assets define composition, species identity or the prescribed navigation simplicity. The map home uses the painted `den-marker` asset; the leaving-den sign is the authored flat `exit-symbol.svg`. Keep those role treatments separate and never reuse the retired detailed wooden icons. Never use the superseded detailed toolbar, historical style boards or sculpted/plush pictures as new style references. The model sheet in `letter-friends` defines markings and accessories only; repaint every animal in the canonical technique.

## Prepare and retain

```sh
node tools/illustrations/pack-atlas.cjs design/artwork/navigation-symbols.json --output /tmp/navigation-symbols.webp
node tools/illustrations/prepare-image.cjs design/artwork/letter-paper.json --output /tmp/letter-paper.webp
```

Both tools need ImageMagick 7 and an sRGB profile; the [illustration workflow](../illustrations/README.md) documents overrides. `prepare-image.cjs` preserves aspect ratio and uses the manifest's explicit `contain`/`cover`, alpha and quality settings. Use real transparency for paper/isolated props and opaque output for scenes. Inspect source anatomy/composition, transparent edges, actual phone/tablet layout and offline behaviour.

Save the actual generator/date, complete request, ordered reference inputs, editable source, SHA-256 and preparation manifest. Current manifests retain a `generationRecord` for the actual image and a `forwardPrompt` for new work. Earlier original prompts remain unchanged in the archive; new actual requests are retained in `generation-records/` with ordered references and source hashes. Every forward prompt includes the current style.

```sh
node tools/illustrations/style.cjs
node tools/illustrations/style.cjs --check
node tools/illustrations/library.cjs
node tools/check-design.cjs
```

Follow [Development](../../docs/DEVELOPMENT.md) for runtime version/cache, fingerprint and review checks. Documentation, archive and prompt maintenance alone do not change runtime art or grant puzzle approvals.

See [painted letter friends](LETTER-FRIENDS.md) for the complete cast and packing order, and [current design drafts](drafts/README.md) for the unimplemented map proposal. Actual new requests live in `generation-records/`; these preserve the tool arguments and reference/source hashes separately from future prompt templates.

## Current pipelines and history

[assets.json](assets.json) separates runtime art, current forward prompts, preparation inputs and historical provenance. The runtime map is the approved version 2 painting, prepared with `world-map.json`; `tools/map/` maintains geographic calibration and can produce geometry references for development. All UI identities use the shared painted atlas; `tools/portraits/` produces model references only. The live world, den fox, sky, water and textures retain their geometry/material pipelines.

Old briefs, alternative directions, original requests, drafts, before images and dated evidence are in the [historical snapshot](../../archive/design-history/2026-11-16-before-style-contract/README.md). All original bytes are protected by the archive manifest. They are retained for explanation and exact provenance, not for copying into a new generator request.

The map dialog is a compact, header-free panel dismissed by outside taps or Escape. Keep the 64 px animal targets, real routing and pan gestures intact when changing its framing. See [map behaviour and calibration](../../tools/map/README.md).
