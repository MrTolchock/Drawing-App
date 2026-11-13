# Farbtupf — Waldfreunde

[Play](https://mrtolchock.github.io/Drawing-App/) · [Current design](design/README.md) · [All puzzles and competences](docs/PUZZLE-CATALOGUE.md) · [Development](docs/DEVELOPMENT.md)

A woodland learning game for first-grade practice in Zürich, in Swiss Standard German. Parents choose how many letters their child can complete. Fuchs starts at the den, receives a pictured letter, walks to that friend and solves a puzzle of five different iterations. Hase delivers the next letter. After the last puzzle, Fuchs returns home to sleep and the journey ends.

Only the friend on the current letter offers a puzzle. The 34 puzzles have 1,048 finite iterations, with a common page, sounds, feedback and celebration. Settings contains the adult-only gallery and review workbench: review every unconfirmed iteration in the normal game viewport. Correct completion approves and advances; × opens an optional rejection comment. The full queue ends with the usual celebration and approves the puzzle when every iteration passed. Exact-revision approvals are required before child play. New content, difficulty and shared implementation changes require review again. Deployment never approves content.

The table and picture pile remain part of the den painting; drawing and saved-picture screens are retired. There is no timer, shop or currency loop. Drawings and gameplay saves stay on the device. Editorial decisions are shared through [GitHub review storage](docs/REVIEW-STORAGE.md), with an offline cache and automatic recovery in other browsers. The game works offline after a complete initial download.

## Current documents

| Document | Purpose |
| --- | --- |
| [Visual style](design/VISUAL-STYLE.md) | Drawn/rendered boundaries, characters, pictures, icons, fonts and surfaces |
| [Puzzle blueprint](design/PUZZLE-BLUEPRINT.md) | Required page, interaction, five iterations and review process |
| [Consistency audit](design/STYLE-AUDIT.md) | Findings, corrections and real-game evidence |
| [Puzzle catalogue](docs/PUZZLE-CATALOGUE.md) | Every puzzle, competence, difficulty and iteration |
| [Letter sessions](docs/LETTER-SESSIONS.md) | Parent limit, invitations, return home and game over |
| [Local gameplay log](docs/PLAY-LOG.md) | Device-local observations and JSON export for improving flow, puzzles and difficulty |
| [Adult review](docs/PUZZLE-REVIEW.md) | Inspect, approve, flag improvements and repeat after changes |
| [Game implementation](docs/FOREST-FRIENDS.md) | Current modules, persistence and controls |
| [Learning and sources](docs/LEARNING.md) | Scope, prerequisites and research limits |
| [Development](docs/DEVELOPMENT.md) | Run, validate, author and publish |
| [Archive](archive/README.md) | Retired Heart Tree, past plans, screenshots and source history |

## Run locally

```sh
python3 -m http.server 8000 --bind 127.0.0.1
node tools/check-design.cjs
node tools/puzzle-catalogue.cjs --check
node --test tests/*.test.cjs
```

No build step is needed. Open `http://127.0.0.1:8000`. GitHub Pages serves `main`. [Development](docs/DEVELOPMENT.md) covers browser checks and release verification. Heart Tree is archived; its former URL opens the current den, and historical save keys are preserved.
