# Working in Waldpost

Follow the [working agreement](CLAUDE.md) and the [current design](design/README.md).

For every image-generator request, first read the [canonical illustration style](design/illustrations/STYLE.md), `waldpost-watercolour-pencil-v1`. Use its fixed reference pixels and `node tools/illustrations/style.cjs --request <id>` so the complete current style is included. Keep the canonical pair first when adding a current edit target. Do not use archived prompts, old style directions or superseded images as style inputs.

The [illustration workflow](design/illustrations/README.md), [artwork handoff](design/artwork/README.md) and [central image library](assets/waldatelier/README.md) cover current sources, roles and preparation. Every active prompt is generated from the same style block; run `node tools/illustrations/style.cjs --check`. Historical generation records are read-only provenance. Image generation still requires a service available in the current environment.
