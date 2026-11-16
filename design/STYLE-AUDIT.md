# Current visual consistency audit

Current game art: **Waldpost 9.3.79**. Current generation contract: **`waldpost-watercolour-pencil-v1`**, defined once in the [canonical style kit](illustrations/STYLE.md).

The gallery has 235 registered drawings. Its predominant medium is warm watercolour finished with visible coloured-pencil strokes, organic sepia contours and modest drawn shading. The 38 earlier sculpted/plush/felt-like outliers were corrected in 9.3.78. The current style kit freezes the majority animal/object reference pixels; all **18** forward generation/editing prompts include the same mandatory style block. Navigation detail, stationery, painted letter portraits and scene composition follow prescribed roles under that contract.

Every navigation back now uses one simple ochre/sepia arrow matching the map, letter and settings symbols. Its shared 56 px cream button has a quiet outline/shadow, with no raised wooden rim. The approved den/door pins and three existing simple symbol cells are unchanged.

Invitation letters use a separate painted fourteen-friend atlas, including Reh, Igel and Steinbock. The [cast/preparation guide](artwork/LETTER-FRIENDS.md) fixes cell order, actual requests and source hashes. A spacing repair preserves complete ears, tails and horns before packing. Only the letter renderer uses `FK.friendsArt.letterPortrait`; world, puzzle, companion and map identities keep their model pipeline. Steinbock is available as a drawing; puzzle destinations and journey rules remain unchanged.

The [drawn map proposal](artwork/drafts/README.md) is a design draft only. Runtime map pixels, coordinates, pin positions and offline dependencies do not use it.

Historical prompts, competing directions, drafts, before images, comparisons, dated audits and renderer evidence are [archived with their original bytes](../archive/design-history/2026-11-16-before-style-contract/README.md). They are provenance only. The archived [gallery audit](../archive/design-history/2026-11-16-before-style-contract/design/illustrations/GALLERY-STYLE-AUDIT.md) and [validation](../archive/design-history/2026-11-16-before-style-contract/design/evidence/2026-11-16-gallery-style/README.md) document the previous correction.

Current final source PNGs and packing manifests remain in the design area. Each manifest identifies the current style/forward prompt separately from its actual generation record. Earlier records remain archived; new requests live in `design/artwork/generation-records/` with actual tool arguments, ordered references and source hashes. Claude and other assistants enter through the canonical guide and request builder; CI rejects stale style text, changed reference pixels, unregistered prompts and historical inputs in generated requests. Current record validation also checks actual style/reference order and source identity.

The puzzle implementation file is byte-identical to 9.3.78: all **31** puzzle revision IDs are preserved. The 235 gallery image/crop records, learning atlas pixels, model portrait atlas, approved den/door pins and current runtime map are unchanged. This release edits no editorial decisions or real-device saves, and grants no approvals.

Validation commands: `node tools/illustrations/style.cjs --check`, `node tools/check-design.cjs`, catalogue/library checks and the meaningful prompt-contract regression tests. The [development guide](../docs/DEVELOPMENT.md) lists the complete workflow.

The model suite covers reviews, saved rounds, journeys and style/provenance guards. Real-browser navigation and artwork checks cover phone, tablet and landscape: all fourteen distinct painted cells, genuine alpha, complete silhouettes, two empty cells, correct live sender identity, unchanged letter progress and matching back routes/appearance across map, Settings, gallery, review, puzzles and handwriting. Update checks cover installed-cache and saved-work behaviour. Archive checks preserve all **775** recorded originals; historical agent/Claude instructions retain their bytes under inert `.record.md` filenames. The [development guide](../docs/DEVELOPMENT.md) documents the complete workflow.
