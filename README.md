# Farbtupf — Der Herzbaum

[Play the game](https://mrtolchock.github.io/Drawing-App/) · [Design blueprint](design/heart-tree/BLUEPRINT.md) · [Next-step review](design/heart-tree/REVIEW.md)

A woodland adventure for children aged 6–7 in Zürich. Guide a fox through a solid 3D forest, help five animal neighbours reconnect, and bring the bare Heart Tree back to life. Swiss Standard German, pictured controls, spoken guidance and short learning games support children who are beginning to read.

## The current game

- Free walking with a held touch stick, arrows/WASD or ground taps; a rotating perspective camera, picture map and friend arrows help with orientation.
- Five neighbours, three story chapters and nine helping projects. Each completed project restores one leafy bough. An animated gathering completes the story.
- Acted 3D requests and thanks, a travelling heartlight, companions and lasting repairs connect puzzles to the forest.
- Six optional nature discoveries, hills, moving vegetation, water, flowers and wildlife give reasons to explore.
- One **Waldspiele** book contains learning games, reading, writing, drawing, colouring and the sticker album. Optional tours offer a next activity.
- Saved repairs, interrupted story puzzles, discoveries, pictures and settings survive reloads. Offline play follows a successful initial download; speech depends on device voices.

## Working documents

| Document | Purpose |
| --- | --- |
| [Blueprint](design/heart-tree/BLUEPRINT.md) | Current experience, storyline, world, features and design rules |
| [Blueprint v2 — redesign draft](design/heart-tree/blueprint-v2.md) | Separate space for the planned major change; concept and decisions to be written before implementation |
| [Design review](design/heart-tree/REVIEW.md) | Assessment of the current game and priorities for the next step |
| [Gameplay](docs/GAMEPLAY.md) | Story puzzles, library activities, guidance and rewards |
| [Exploration](docs/EXPLORATION.md) | Movement, camera, map and discovery controls |
| [Learning and sources](docs/LEARNING.md) | Learning scope, reading expectations and research limits |
| [Development and validation](docs/DEVELOPMENT.md) | Run, test, save compatibility and GitHub Pages deployment |
| [Archive](archive/README.md) | Preserved previous plans, release notes, references and screenshots |

The blueprint describes implemented behaviour. The review separates observations and proposed work from shipped features. Update both when the game changes; previous drafts belong in the archive.

## Run locally

No build step or dependency installation is needed for the app. Serve the repository root:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000`. Run model and content checks with `node --test tests/*.test.cjs`. Browser-check setup is in [Development](docs/DEVELOPMENT.md).

GitHub Pages serves `main`. Reopen or reload the app after an update downloads. Progress stays on each device and origin; there is no account, cloud sync, advertising or tracking.
