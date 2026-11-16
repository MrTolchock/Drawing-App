# Working agreement

- Read [current design](design/README.md), [visual style](design/VISUAL-STYLE.md) and [puzzle blueprint](design/PUZZLE-BLUEPRINT.md) before changing the game.
- Build on the shared current renderers. Every puzzle uses five distinct iterations, no hints/timer, common feedback/celebration and individual adult review. Do not generate or ship editorial approvals.
- Keep learning subjects drawn, character identities rendered from current models and task utility controls in the shared SVG family. World controls use the simple illustrated symbols; all navigation backs use the same drawn-arrow component. Preserve the existing den/door pins. Fonts: Andika for learning/controls/body; Baloo 2 for menu headings.
- For all image-generation work, read the [artwork handoff](design/artwork/README.md), including backgrounds and the generated letter. Reuse pictures from the [central image library](assets/waldatelier/README.md). Retain exact prompts, reference images, sources and preparation manifests; label reconstruction recipes honestly.
- For new drawn pictures, use the [illustration handoff](design/illustrations/README.md): existing style references, exact prompts, source sheets, cell manifests and a reusable packing tool. Use an available image-generation service with those references; follow the handoff's guidance if the current environment has no image-generation capability.
- Preserve save keys, drawing template IDs, offline/update behaviour and archived originals. Archive is historical reference, never a runtime dependency or competing specification.
- Run the relevant checks in [Development](docs/DEVELOPMENT.md), regenerate the puzzle catalogue/fingerprint and update the consistency audit after visual changes.
- Work on a branch and push useful checkpoints. Publish to main when the user authorizes it; session instructions take precedence over older documents.
