# Drawn puzzle image library

All drawn puzzle subjects live in this directory. Reuse their stable IDs with `FK.visual.art(id)`; their atlas cells stay in place.

[Browse, search and download individual pictures](https://mrtolchock.github.io/Drawing-App/assets/waldatelier/) · [Canonical style and fixed references](../../design/illustrations/STYLE.md) · [All generator inputs and prompts](../../design/artwork/GENERATOR-INPUTS.md) · [Machine-readable catalogue](library.json)

**240 pictures · 19 atlases · 24 active puzzles.** The browser library shows which pictures each puzzle uses, copies stable IDs and exports transparent PNGs from the existing atlas cells. Character portraits and backgrounds have separate roles, documented in the handoff.

New generations use **`waldpost-watercolour-pencil-v1`** and `node tools/illustrations/style.cjs --request <id>`. The complete prompts below include the same canonical style and reference images. Historical records describe existing assets; they are not forward prompts or style inputs.

Generated with `node tools/illustrations/library.cjs`. Edit the runtime registry, then regenerate; do not edit the catalogue by hand. Existing image files are not repacked or moved.

| Sheet | Pictures | Current forward prompt | Historical provenance only |
| --- | ---: | --- | --- |
| [alphabet](alphabet.webp) | 16 | [Style-complete prompt](../../design/illustrations/prompts/alphabet.txt) | [Archived record](../../legacy/design-history/2026-11-16-before-style-contract/design/artwork/prompts/recorded-waldatelier.json) |
| [animals](animals.webp) | 16 | [Style-complete prompt](../../design/illustrations/prompts/animals.txt) | [Archived record](../../legacy/design-history/2026-11-16-before-style-contract/design/artwork/prompts/recorded-waldatelier.json) |
| [creatures](creatures.webp) | 16 | [Style-complete prompt](../../design/illustrations/prompts/creatures.txt) | [Archived record](../../legacy/design-history/2026-11-16-before-style-contract/design/artwork/prompts/recorded-waldatelier.json) |
| [discovery](discovery.webp) | 16 | [Style-complete prompt](../../design/illustrations/prompts/discovery.txt) | [Archived record](../../legacy/design-history/2026-11-16-before-style-contract/design/artwork/prompts/recorded-waldatelier.json) |
| [forest-actions](forest-actions.webp) | 16 | [Style-complete prompt](../../design/illustrations/prompts/forest-actions.txt) | [Archived record](../../legacy/design-history/2026-11-16-before-style-contract/design/illustrations/forest-actions.json) |
| [forest-fox](forest-fox.webp) | 1 | [Style-complete prompt](../../design/illustrations/prompts/forest-fox.txt) | [Archived record](../../legacy/design-history/2026-11-16-before-style-contract/design/illustrations/forest-fox.json) |
| [forest-objects](forest-objects.webp) | 16 | [Style-complete prompt](../../design/illustrations/prompts/forest-objects.txt) | [Archived record](../../legacy/design-history/2026-11-16-before-style-contract/design/illustrations/forest-objects.json) |
| [forest-wildlife](forest-wildlife.webp) | 16 | [Style-complete prompt](../../design/illustrations/prompts/forest-wildlife.txt) | [Archived record](../../legacy/design-history/2026-11-16-before-style-contract/design/illustrations/forest-wildlife.json) |
| [menu](menu.webp) | 6 | [Style-complete prompt](../../design/illustrations/prompts/menu.txt) | [Archived record](../../legacy/design-history/2026-11-16-before-style-contract/design/artwork/assets.json) |
| [navigation](navigation.webp) | 16 | [Style-complete prompt](../../design/illustrations/prompts/navigation.txt) | [Archived record](../../legacy/design-history/2026-11-16-before-style-contract/design/artwork/prompts/recorded-waldatelier.json) |
| [people](people.webp) | 16 | [Style-complete prompt](../../design/illustrations/prompts/people.txt) | [Archived record](../../legacy/design-history/2026-11-16-before-style-contract/design/artwork/prompts/recorded-waldatelier.json) |
| [puzzle-flowers](puzzle-flowers.webp) | 6 | [Style-complete prompt](../../design/illustrations/prompts/puzzle-flowers.txt) | [Archived record](../../legacy/design-history/2026-11-16-before-style-contract/design/illustrations/puzzle-flowers.json) |
| [puzzle-garden](puzzle-garden.webp) | 2 | [Style-complete prompt](../../design/illustrations/prompts/puzzle-garden.txt) | [Archived record](../../design/artwork/generation-records/puzzle-garden-2026-11-18.json) |
| [puzzle-vocabulary](puzzle-vocabulary.webp) | 20 | [Style-complete prompt](../../design/illustrations/prompts/puzzle-vocabulary.txt) | [Archived record](../../legacy/design-history/2026-11-16-before-style-contract/design/artwork/assets.json) |
| [review-nature](review-nature.webp) | 3 | [Style-complete prompt](../../design/illustrations/prompts/review-nature.txt) | [Archived record](../../design/artwork/generation-records/review-nature.json) |
| [rhyme-vocabulary](rhyme-vocabulary.webp) | 10 | [Style-complete prompt](../../design/illustrations/prompts/rhyme-vocabulary.txt) | [Archived record](../../legacy/design-history/2026-11-16-before-style-contract/design/illustrations/rhyme-vocabulary.json) |
| [words-one](words-one.webp) | 16 | [Style-complete prompt](../../design/illustrations/prompts/words-one.txt) | [Archived record](../../legacy/design-history/2026-11-16-before-style-contract/design/artwork/prompts/recorded-waldatelier.json) |
| [words-three](words-three.webp) | 16 | [Style-complete prompt](../../design/illustrations/prompts/words-three.txt) | [Archived record](../../legacy/design-history/2026-11-16-before-style-contract/design/artwork/prompts/recorded-waldatelier.json) |
| [words-two](words-two.webp) | 16 | [Style-complete prompt](../../design/illustrations/prompts/words-two.txt) | [Archived record](../../legacy/design-history/2026-11-16-before-style-contract/design/artwork/prompts/recorded-waldatelier.json) |

For an individual file, open the browser library, search its ID/name, then choose **PNG herunterladen**. The PNG comes from the existing atlas; it is not newly generated. Atlas cell coordinates and exact pixel dimensions are also in `library.json`.
