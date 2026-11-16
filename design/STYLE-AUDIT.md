# Current visual consistency audit

Current app: **Waldpost 9.3.79** (art unchanged from 9.3.78). Current generation contract: **`waldpost-watercolour-pencil-v1`**, defined once in the [canonical style kit](illustrations/STYLE.md).

The gallery has 235 registered drawings. Its predominant medium is warm watercolour finished with visible coloured-pencil strokes, organic sepia contours and modest drawn shading. The 38 earlier sculpted/plush/felt-like outliers were corrected in 9.3.78. The current style kit freezes the majority animal/object reference pixels; all 15 forward generation/editing prompts include the same mandatory style block. Navigation detail, stationery and scene composition follow prescribed roles under that contract.

Historical prompts, competing directions, drafts, before images, comparisons, dated audits and renderer evidence are [archived with their original bytes](../archive/design-history/2026-11-16-before-style-contract/README.md). They are provenance only. The archived [gallery audit](../archive/design-history/2026-11-16-before-style-contract/design/illustrations/GALLERY-STYLE-AUDIT.md) and [validation](../archive/design-history/2026-11-16-before-style-contract/design/evidence/2026-11-16-gallery-style/README.md) document the previous correction.

Current final source PNGs and packing manifests remain in the design area. Each manifest identifies the current style/forward prompt separately from its archived generation record. Claude and other assistants enter through the canonical guide and request builder; CI rejects stale style text, changed reference pixels, unregistered prompts and historical inputs in generated requests.

This consolidation changes documentation, prompt preparation and catalogue provenance. Runtime pictures, subjects, cell geometry, gameplay, saves and puzzle rendering revisions are preserved. The review requirements introduced by the 9.3.78 artwork correction remain in place; this documentation change grants no approvals.

Validation commands: `node tools/illustrations/style.cjs --check`, `node tools/check-design.cjs`, catalogue/library checks and the meaningful prompt-contract regression tests. The [development guide](../docs/DEVELOPMENT.md) lists the complete workflow.

All 117 original model/contract checks passed; the style suite also verifies that archived working instructions cannot be auto-loaded, bringing it to six positive/negative guard cases. Archive checks preserve all 775 recorded originals. Direct comparisons confirm that all 152 cached runtime files, all 31 puzzle revision IDs and every one of the 235 gallery image/crop records remain unchanged. A generated den request supplies the canonical pair first, the current scene only as composition, and opaque output; isolated-subject requests use transparency. Historical agent/Claude instructions retain their original bytes under inert `.record.md` filenames.

## Menu and review navigation — 9.3.79

The map keeps its existing portrait/home pins and accessible destination names, with no friend-name tooltips or visible courier text. Settings uses the standard automatic narration voice and no longer repeats the GitHub connection panel. Puzzle-Prüfung opens with all 31 puzzles; its entry page owns the GitHub panel. The shared drawn header arrow returns from selected puzzle details to that overview and then to Settings. Iteration previews (including handwriting) return to their selected puzzle details.

Each selected puzzle explains its bounded competence in words alongside its curriculum reference and offers an optional general comment. Comments use the existing exact-revision puzzle record and GitHub synchronization, preserve decision status/revision and survive queue/bulk approval. Drafts survive filtering and navigation within the visit. The normal child puzzle page and artwork stay the same. Updated implementation fingerprints reflect the explicit review return routes; no editorial approvals are generated.
