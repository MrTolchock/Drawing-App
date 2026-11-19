# Second woodland picture expansion — 19 November 2026

150 more drawings extend the central library from 390 to 540 pictures. The ten new sheets use the same `waldpost-watercolour-pencil-v1` style, with the frozen animal/object reference pixels supplied to every actual generator request. Every subject has a stable ID and German search label.

[Browse and download transparent PNGs](../../assets/waldatelier/index.html) · [Subject plan](expansion-two-2026-11-19.json) · [First 150-picture expansion](EXPANSION-2026-11-19.md) · [Complete generator handoff](../artwork/generator-inputs.json)

Each new sheet has fifteen occupied cells in a 4 × 4 grid, with the last cell transparent. Exports use 320 px cells with a 256 px longest subject side. Select an `expansion-…` sheet in the library or search its German label/stable ID, then use `FK.visual.art(id, className, accessibleLabel)` when authoring a future puzzle. Existing pictures, puzzle content and editorial decisions are preserved.

[Preview all 150 new drawings](../evidence/2026-11-19-image-expansion-two/overview.png) · [Phone library](../evidence/2026-11-19-image-expansion-two/library-390.png) · [Tablet library](../evidence/2026-11-19-image-expansion-two/library-1080.png)

| Set | Pictures | Future puzzle material |
| --- | ---: | --- |
| [Vögel des Waldes](../../assets/waldatelier/expansion-woodland-birds.webp) | 15 | Species recognition, bird features, woodland observation |
| [Säugetiere und Bergtiere](../../assets/waldatelier/expansion-woodland-mammals.webp) | 15 | Animal families, coverings, woodland and mountain habitats |
| [Pilze und Unterholz](../../assets/waldatelier/expansion-undergrowth.webp) | 15 | Fungi, leaf forms, botanical vocabulary and sorting |
| [Wiesen- und Bergblumen](../../assets/waldatelier/expansion-meadow-flowers.webp) | 15 | Flower recognition, colours, seasonal and habitat grouping |
| [Obst und Gartenvorrat](../../assets/waldatelier/expansion-orchard-produce.webp) | 15 | Vocabulary, fruit/vegetable grouping, observation |
| [Basteln und Handarbeit](../../assets/waldatelier/expansion-woodland-crafts.webp) | 15 | Tool/function matching, material categories and crafts |
| [Musik und Bewegung](../../assets/waldatelier/expansion-music-play.webp) | 15 | Instrument matching, play vocabulary and movement |
| [Küche und Backen](../../assets/waldatelier/expansion-kitchen-tools.webp) | 15 | Kitchen vocabulary, tools and preparation sequences |
| [Dinge im Waldhaus](../../assets/waldatelier/expansion-woodland-household.webp) | 15 | Household vocabulary, materials and sorting |
| [Tiere beim Entdecken](../../assets/waldatelier/expansion-animal-behaviours.webp) | 15 | Verbs, animal/action matching and picture stories |

The raw transparent PNGs, actual complete requests, ordered references and hashes are retained in `sources/expansion-two-2026-11-19/` and `../artwork/generation-records/`. Each sheet has its own packing manifest and current complete forward prompt. The manifest identifies the selected source, including any recorded repairs.

Example new IDs: `blackbird`, `wild-boar`, `chanterelle`, `cornflower`, `sweetcorn`, `thread-spool`, `recorder`, `rolling-pin`, `clothes-peg`, `frog-croak`.

Selected flower, kitchen and action sources use explicit source crop rectangles in their manifests. Their boundaries lie in empty alpha gaps, preserving complete stems, handles and tails while excluding neighbouring drawings. The standard square-cell output, proportions and framing are preserved.

## Verification

All 150 new pictures passed browser PNG-export, pixel-match, transparency, framing and phone/tablet checks (431 exports in the full collection check). All 163 model tests passed, including explicit-source-crop validation. [Export report](../evidence/2026-11-19-image-expansion-two/export-report.json) · [Source edge checks](../evidence/2026-11-19-image-expansion-two/source-edges.jsonl). Canonical style, generated handoff, offline/design inventory and existing puzzle implementation revisions are consistent.
