# Waldpost

[Play](https://mrtolchock.github.io/Drawing-App/) · [Current design](design/README.md) · [Alle Rätsel und Kompetenzen](docs/PUZZLE-CATALOGUE.md) · [Development](docs/DEVELOPMENT.md)

[Drawn image library](https://mrtolchock.github.io/Drawing-App/assets/waldatelier/) · [All image-generator prompts and inputs](design/artwork/GENERATOR-INPUTS.md) · [Artwork workflow](design/artwork/README.md)

All new image generation follows the [canonical watercolour/pencil style](design/illustrations/STYLE.md), its fixed reference images and shared complete prompts. Superseded styles and requests are archived.

A woodland learning game for first-grade practice in Zürich, in Swiss Standard German. Parents choose how many letters their child can complete. Fuchs starts at the den, receives a pictured letter, walks to that friend and solves a puzzle of five different iterations. Hase delivers the next letter. After the last puzzle, Fuchs returns home to sleep and the journey ends.

Only the friend on the current letter offers a puzzle. The 22 Rätsel have 794 Aufgaben, with a common page, sounds, feedback and celebration. Settings contains the adult-only gallery and review workbench: review every unconfirmed iteration in the normal game viewport. Correct completion approves and advances; × opens an optional rejection comment. The full queue ends with the usual celebration and approves the puzzle when every iteration passed. Exact-revision approvals are required before child play. New content, difficulty and shared implementation changes require review again. Deployment never approves content.

The table and picture pile remain part of the den painting; drawing and saved-picture screens are retired. There is no timer, shop or currency loop. Drawings and gameplay saves stay on the device. Editorial decisions are shared through [GitHub review storage](docs/REVIEW-STORAGE.md), with an offline cache and automatic recovery in other browsers. The game works offline after a complete initial download.

## Current documents

| Document | Purpose |
| --- | --- |
| [Visual style](design/VISUAL-STYLE.md) | Drawn/rendered boundaries, characters, pictures, icons, fonts and surfaces |
| [Making drawn pictures](design/illustrations/README.md) | Image-generation prompts, style references, editable source sheets and atlas preparation for Claude and other assistants |
| [Rätsel-Bauplan](design/PUZZLE-BLUEPRINT.md) | Required page, interaction, five iterations and review process |
| [Consistency audit](design/STYLE-AUDIT.md) | Findings, corrections and real-game evidence |
| [Rätselkatalog](docs/PUZZLE-CATALOGUE.md) | Every puzzle, competence, difficulty and iteration |
| [Letter sessions](docs/LETTER-SESSIONS.md) | Parent limit, invitations, return home and game over |
| [Local gameplay log](docs/PLAY-LOG.md) | Device-local observations and JSON export for improving flow, puzzles and difficulty |
| [Rätsel-Prüfung](docs/PUZZLE-REVIEW.md) | Inspect, approve, flag improvements and repeat after changes |
| [Game implementation](docs/FOREST-FRIENDS.md) | Current modules, persistence and controls |
| [Learning and sources](docs/LEARNING.md) | Scope, prerequisites and research limits |
| [Development](docs/DEVELOPMENT.md) | Run, validate, author and publish |
| [Legacy](legacy/README.md) | Retired engines, drawing tools, unused art, proposals and original history |

## Repository layout

`index.html`, `js/`, `css/`, `assets/`, `icons/`, `fonts/` and `vendor/` serve the current game and image library. `design/` documents current rules and editable artwork inputs. `docs/`, `tools/`, `tests/` and `.github/` maintain and validate this game. All retired implementations, unused runtime assets, old proposals and historical records live under `legacy/`; the game and offline cache never load them. Existing device saves and the separate GitHub review-data branch remain compatible.

## Run locally

```sh
python3 -m http.server 8000 --bind 127.0.0.1
node tools/check-design.cjs
node tools/puzzle-catalogue.cjs --check
node --test tests/*.test.cjs
```

No build step is needed. Open `http://127.0.0.1:8000`. GitHub Pages serves `main`. [Development](docs/DEVELOPMENT.md) covers browser checks and release verification. Heart Tree is archived; its former URL opens the current den, and historical save keys are preserved.
