# Farbtupf — Waldfreunde

[Play the game](https://mrtolchock.github.io/Drawing-App/) · [Implementation and saves](docs/FOREST-FRIENDS.md) · [Design handoff](design/forest-friends/CLOUD-HANDOFF.md)

A woodland learning game for first-grade practice in Zürich, in Swiss Standard German. Fuchs receives pictured letters, visits the invited friend, solves a puzzle and meets Hase the rabbit mailman for the next invitation.

## The current game

- Start inside the den with its door closed. A letter slips through the mail lid; clicking opens unreadable handwriting and a clear portrait of the friend to visit.
- Click/tap to walk through the 3D forest. A directional arrow guides Fuchs to the pictured friend, then to the nearby mailman after a completed puzzle. There are no movement arrows, keyboard walking or jumping.
- Hase roams as a recognizable mailman with postal clothing and a satchel. He delivers new letters and never presents puzzles.
- The five puzzle friends offer 28 directly selectable puzzles at one fixed level, with a common forest design based on the character sheet and Silben-Puzzle. The four reading activities are separate entries. All rounds contain five tasks, advance automatically after correct answers and end with a brief woodland celebration. Waldreime is folded into Reimpaare lesen; Zahlenspuren replaces the retired Zahlenwege entry.
- The table opens Ausmalen directly with six illustrated woodland pages and free colouring only, without stamps. The picture pile beside it opens Meine Bilder. Waldspiele → Malatelier offers Ausmalen and Meine Bilder; all included tools, colours and pages are free.
- The sleeping fox keeps the standing fox's proportions. Opened postcards are directly clickable, without a surrounding frame or door button. The current adventure has no shop, coins, prices or purchases.
- Matching painted toolbar icons and a woodland picture map use the original character artwork's style. Settings is shared by the forest and Waldspiele, including the optional timer.
- Speech is off during ordinary play. Each puzzle has one **Spiel erklären** button; wind, birds, rustling foliage and brook sounds accompany the forest. Golden leaves are removed.
- Exact interrupted newer puzzles, invitation progress, drawings and sound preferences remain local. Adults can export or delete bounded anonymous gameplay logs.
- Offline play follows the initial successful download. Speech depends on installed voices; device and child testing follow implementation.

The original [Heart Tree adventure](https://mrtolchock.github.io/Drawing-App/?screen=forest), [historical Waldspiele book](https://mrtolchock.github.io/Drawing-App/?screen=hub), drawings and progress remain accessible. Earlier currency/inventory fields are preserved as compatibility data; the new letter journey does not spend them.

## Working documents

| Document | Purpose |
| --- | --- |
| [Heart Tree blueprint](design/heart-tree/BLUEPRINT.md) | Retained original adventure and its historical design rules |
| [Blueprint v2 — Forest friends](design/forest-friends/blueprint-v2.md) | Current letter adventure, curriculum requirements and picture-led visual design |
| [Cloud conversation handoff](design/forest-friends/CLOUD-HANDOFF.md) | Decisions, current references and next steps for continuing design across devices |
| [Visual comparison baseline](design/forest-friends/visuals/baseline.md) | Preserved art, versioned mockups and screenshots for evaluating development |
| [Waldbuch visual overhaul](design/visual-overhaul/README.md) | Visual consistency, mockups and iPad 9 performance plan, ready for implementation |
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
