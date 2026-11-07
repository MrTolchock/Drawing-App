# Farbtupf — Waldfreunde

[Play the game](https://mrtolchock.github.io/Drawing-App/) · [Implementation and saves](docs/FOREST-FRIENDS.md) · [Design handoff](design/forest-friends/CLOUD-HANDOFF.md)

A woodland learning game for first-grade practice in Zürich, in Swiss Standard German. Fuchs lives in a fixed 3D den, walks to five friends, completes short pictured learning rounds and trades earned resources for drawing unlocks or animated treats.

## The current game

- A 3D den, freely explorable forest and fixed shop, with pictured hotspots, a destination map, keyboard/touch walking and replayable instructions.
- Five-task counting, word reading, written rhymes, short sentences and missing-shape rounds. One content level, unlimited correction, separate examples and no countdown.
- Three host tokens per completed round, credited once. Leaf colouring page, extra pencils, apple and bubble bath purchases save together with their charges.
- Articulated 3D apple, bath and pretend-sleep sequences. Consumables commit once before playback and can be skipped.
- Saved exact interrupted tasks, wallet, inventory, unlocks, per-page drawings and separate audio controls. Local bounded gameplay logs can be exported or deleted by adults.
- Offline play after the initial successful download. Speech depends on installed voices. Physical iPad and child testing follow implementation; visual polish is recorded separately.

The original [Heart Tree adventure](https://mrtolchock.github.io/Drawing-App/?screen=forest), [Waldspiele book](https://mrtolchock.github.io/Drawing-App/?screen=hub), drawings and progress remain accessible and unchanged. New Forest friends resources start at zero; legacy stars are not converted.

## Working documents

| Document | Purpose |
| --- | --- |
| [Blueprint](design/heart-tree/BLUEPRINT.md) | Current experience, storyline, world, features and design rules |
| [Blueprint v2 — Forest friends](design/forest-friends/blueprint-v2.md) | Redesign outline, curriculum requirements and picture-led visual design |
| [Cloud conversation handoff](design/forest-friends/CLOUD-HANDOFF.md) | Decisions, current references and next steps for continuing design across devices |
| [Visual comparison baseline](design/forest-friends/visuals/baseline.md) | Preserved art, versioned mockups and screenshots for evaluating development |
| [Design review](design/heart-tree/REVIEW.md) | Assessment of the current game and priorities for the next step |
| [Gameplay](docs/GAMEPLAY.md) | Story puzzles, library activities, guidance and rewards |
| [Exploration](docs/EXPLORATION.md) | Movement, camera, map and discovery controls |
| [Learning and sources](docs/LEARNING.md) | Learning scope, reading expectations and research limits |
| [Development and validation](docs/DEVELOPMENT.md) | Run, test, save compatibility and GitHub Pages deployment |
| [Archive](archive/README.md) | Preserved previous plans, release notes, references and screenshots |

The Heart Tree blueprint documents the retained original game. Forest friends implementation status is documented in [FOREST-FRIENDS.md](docs/FOREST-FRIENDS.md); Blueprint V2 remains its design target. Update both when the game changes; previous drafts belong in the archive.

## Run locally

No build step or dependency installation is needed for the app. Serve the repository root:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000`. Run model and content checks with `node --test tests/*.test.cjs`. Browser-check setup is in [Development](docs/DEVELOPMENT.md).

GitHub Pages serves `main`. Reopen or reload the app after an update downloads. Progress and anonymous gameplay logs stay on each device and origin; there is no account, cloud sync, advertising or automatic log upload.
