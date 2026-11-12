# Working agreement

- Read [current design](design/README.md), [visual style](design/VISUAL-STYLE.md) and [puzzle blueprint](design/PUZZLE-BLUEPRINT.md) before changing the game.
- Build on the shared current renderers. Every puzzle uses five distinct iterations, no hints/timer, common feedback/celebration and individual adult review. Do not generate or ship editorial approvals.
- Keep learning subjects drawn, character identities rendered from current models and utility controls in the shared SVG family. Fonts: Andika for learning/controls/body; Baloo 2 for menu headings.
- Preserve save keys, drawing template IDs, offline/update behaviour and archived originals. Archive is historical reference, never a runtime dependency or competing specification.
- Run the relevant checks in [Development](docs/DEVELOPMENT.md), regenerate the puzzle catalogue/fingerprint and update the consistency audit after visual changes.
- Work on a branch and push useful checkpoints. Publish to main when the user authorizes it; session instructions take precedence over older documents.
