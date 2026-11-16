# Drawn puzzle image library

All drawn puzzle subjects live in this directory. Reuse their stable IDs with `FK.visual.art(id)`; their atlas cells stay in place.

[Browse, search and download individual pictures](https://mrtolchock.github.io/Drawing-App/assets/waldatelier/) · [Generator handoff and backgrounds](../../design/artwork/README.md) · [Machine-readable catalogue](library.json)

**235 pictures · 17 atlases · 31 active puzzles.** The browser library shows which pictures each puzzle uses, copies stable IDs and exports transparent PNGs from the existing atlas cells. Character portraits and backgrounds have separate roles, documented in the handoff.

Generated with `node tools/illustrations/library.cjs`. Edit the runtime registry, then regenerate; do not edit the catalogue by hand. Existing image files are not repacked or moved.

| Sheet | Pictures | Source |
| --- | ---: | --- |
| [alphabet](alphabet.webp) | 16 | [Original recorded prompt](../../design/artwork/prompts/recorded-waldatelier.json) |
| [animals](animals.webp) | 16 | [Original recorded prompt](../../design/artwork/prompts/recorded-waldatelier.json) |
| [creatures](creatures.webp) | 16 | [Original recorded prompt](../../design/artwork/prompts/recorded-waldatelier.json) |
| [discovery](discovery.webp) | 16 | [Original recorded prompt](../../design/artwork/prompts/recorded-waldatelier.json) |
| [forest-actions](forest-actions.webp) | 16 | [Recorded prompt and source](../../design/illustrations/forest-actions.json) |
| [forest-fox](forest-fox.webp) | 1 | [Recorded prompt and source](../../design/illustrations/forest-fox.json) |
| [forest-objects](forest-objects.webp) | 16 | [Recorded prompt and source](../../design/illustrations/forest-objects.json) |
| [forest-wildlife](forest-wildlife.webp) | 16 | [Recorded prompt and source](../../design/illustrations/forest-wildlife.json) |
| [menu](menu.webp) | 6 | [Reconstruction recipe](../../design/artwork/prompts/puzzle-sheet-reconstruction.txt) |
| [navigation](navigation.webp) | 16 | [Original recorded prompt](../../design/artwork/prompts/recorded-waldatelier.json) |
| [people](people.webp) | 16 | [Original recorded prompt](../../design/artwork/prompts/recorded-waldatelier.json) |
| [puzzle-flowers](puzzle-flowers.webp) | 6 | [Recorded prompt and source](../../design/illustrations/puzzle-flowers.json) |
| [puzzle-vocabulary](puzzle-vocabulary.webp) | 20 | [Reconstruction recipe](../../design/artwork/prompts/puzzle-sheet-reconstruction.txt) |
| [rhyme-vocabulary](rhyme-vocabulary.webp) | 10 | [Recorded prompt and source](../../design/illustrations/rhyme-vocabulary.json) |
| [words-one](words-one.webp) | 16 | [Original recorded prompt](../../design/artwork/prompts/recorded-waldatelier.json) |
| [words-three](words-three.webp) | 16 | [Original recorded prompt](../../design/artwork/prompts/recorded-waldatelier.json) |
| [words-two](words-two.webp) | 16 | [Original recorded prompt](../../design/artwork/prompts/recorded-waldatelier.json) |

For an individual file, open the browser library, search its ID/name, then choose **PNG herunterladen**. The PNG comes from the existing atlas; it is not newly generated. Atlas cell coordinates and exact pixel dimensions are also in `library.json`.
