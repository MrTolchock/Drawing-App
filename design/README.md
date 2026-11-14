# Waldpost — current design

These documents define the game shipped from `main`. There is one current visual specification and one current puzzle specification.

| Document | Responsibility |
| --- | --- |
| [Visual style](VISUAL-STYLE.md) | What is drawn, what is rendered, fonts, colours, icons, layout and asset sources |
| [Illustration handoff](illustrations/README.md) | How to make matching drawn pictures: generation prompts, references, source sheets and atlas preparation |
| [Puzzle blueprint](PUZZLE-BLUEPRINT.md) | Required appearance, five-iteration behaviour, guidance, sounds, feedback and review |
| [Consistency audit](STYLE-AUDIT.md) | Findings, implemented corrections, evidence and remaining human review |
| [Asset rules](asset-rules.json) | Machine-readable roles used by repository checks |

The [puzzle catalogue](../docs/PUZZLE-CATALOGUE.md) lists every active puzzle, competence and iteration. [Letter sessions](../docs/LETTER-SESSIONS.md) defines the parent limit and den → letter → friend → puzzle → home/sleep journey.

Superseded Heart Tree, Forest friends drafts, Waldbuch mockups and visual-overhaul experiments are in [design history](../archive/design-history/README.md). Their claims and restrictions describe past versions. They are reference material, not current instructions. Current character sculpting tools are maintained under [tools/characters](../tools/characters/README.md).
