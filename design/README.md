# Waldpost — current design

These documents define the game shipped from `main`. There is one current visual specification and one current puzzle specification.

| Document | Responsibility |
| --- | --- |
| [Canonical illustration style](illustrations/STYLE.md) | The predominant watercolour/pencil style, fixed reference pixels and mandatory shared prompt block |
| [Visual style](VISUAL-STYLE.md) | What is drawn, what is rendered, fonts, colours, icons, layout and asset sources |
| [All generator inputs and prompts](artwork/GENERATOR-INPUTS.md) | Complete portable requests for any AI model, all image roles, cell order, sources, exports and missing historical records |
| [Artwork workflow](artwork/README.md) | Icons, letter, backgrounds, preparation and central image library |
| [Illustration handoff](illustrations/README.md) | How to make matching drawn pictures: generation prompts, references, source sheets and atlas preparation |
| [Puzzle blueprint](PUZZLE-BLUEPRINT.md) | Required appearance, five-iteration behaviour, guidance, sounds, feedback and review |
| [Consistency audit](STYLE-AUDIT.md) | Findings, implemented corrections, evidence and remaining human review |
| [Asset rules](asset-rules.json) | Machine-readable roles used by repository checks |

The [puzzle catalogue](../docs/PUZZLE-CATALOGUE.md) lists every active puzzle, competence and iteration. [Letter sessions](../docs/LETTER-SESSIONS.md) defines the parent limit and den → letter → friend → puzzle → home/sleep journey.

All superseded prompts, alternative styles, drafts, before images, comparisons and dated audits/evidence are preserved in the [historical snapshot](../legacy/design-history/2026-11-16-before-style-contract/README.md). Earlier retired designs remain in [design history](../legacy/design-history/README.md). Historical records are provenance only and must not be used as current generation-style inputs. Current character sculpting tools are maintained under [tools/characters](../tools/characters/README.md).
