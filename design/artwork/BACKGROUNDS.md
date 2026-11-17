# Background generation with the current style

Use the [canonical watercolour/pencil style](../illustrations/STYLE.md) and the complete `den`, `puzzle-clearing` or `background` request from `node tools/illustrations/style.cjs --request <id>`. The fixed animal/object references define technique; the current painting supplies composition only. Historical concept prompts are archived and are not current recipes.

The [complete generator-input index](GENERATOR-INPUTS.md) links every painting and records full portable requests, actual reference paths/hashes, dimensions, proposed exports and available original sources in [generator-inputs.json](generator-inputs.json). It also covers the older Lake Zürich scene and explicitly missing historical requests.

## Den

Current painting: [den-v2.webp](../../assets/forest-friends/den-v2.webp), 1448 × 1086, opaque. The live fox, its shadow and sleep pose are rendered separately by `js/friends/painted.js`; keep the room empty of generated characters.

| Layout constraint | Value |
| --- | --- |
| Source canvas | 1448 × 1086, 4:3 |
| Camera | 30° FOV, y=12, tilt −17° |
| Standing / bed anchors | `(300,440)` / `(80,405)` on a 1024 × 768 reference |
| Door hotspot | `(859,346)` on that reference |
| Mail flap overlay | Source rectangle `(1180,280,106,34)`, centre x=1233 |
| Required crop region | `scenes.den.need=[.03,.2,.97,.92]`, with live cover/view-offset logic |

Preserve bed, floor perspective, door/slot, shelf, basket and drawing table. Reuse the current painting when the task does not request a change. If an edit moves composition, update its matching coordinates and test standing, delivery, walking and sleep at phone/tablet sizes.

## Shared clearing

[puzzle-clearing.webp](../../assets/forest-friends/puzzle-clearing.webp) is one opaque 1536 × 1024 painting behind puzzle pages, adult gallery/review, menus and Settings. CSS supplies different crops and washes. Keep the central area pale and quiet; detailed trees/canopy, ferns, leaves and mushrooms stay mostly at the perimeter. Panels, buttons, labels and portraits remain separate layers.

For a new edit, the current painting defines this framing and the canonical references define the drawing technique. Do not paint interface controls or characters into the background. Check portrait/landscape `cover` crops; changing this shared scene changes puzzle presentation and requires normal review again.

## Conversion and records

Retain the new editable PNG, complete style-composed request, references and conversion manifest. `prepare-image.cjs` with `transparent:false` produces an opaque scene; use the intended ratio/dimensions and an explicit fit choice. Avoid stretching a room to fit a generator's default canvas.

The final historical den edit and original clearing request were not retained in full. Their history, recoverable original PNG commits, earlier concept prompts and former reconstruction recipes are preserved in the [archived background record](../../legacy/design-history/2026-11-16-before-style-contract/design/artwork/BACKGROUNDS.md). Those original records are not forward instructions.
