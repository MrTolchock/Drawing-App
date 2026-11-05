# Farbtupf

[Play Farbtupf](https://mrtolchock.github.io/Drawing-App/) · [Preview and deployment notes](docs/PREVIEW.md).

Finger-friendly learning adventures for first-grade children in Zürich, in Swiss Standard German. Static HTML/CSS/JavaScript PWA with locally bundled Three.js: no build step, account, ads, tracking or runtime CDN. Works offline after initial loading; prototype narration uses device voices and is not guaranteed offline.

The app opens in **Der Herzbaum**, a playable woodland neighbourhood in the selected **Painted woodland** direction. Guide a 3D fox to Beaver or Brown Hare, help with a guided flat Musterzug round, return to the brook and cross the repaired bridge. Hare then introduces European Hedgehog's moss grove: a flat Waldschatz memory round creates a leaf-and-moss resting place. Both changes and interrupted puzzle sessions survive reloading. Pictures, separate examples and repeatable device narration support children who cannot yet read. The book opens all the existing activities; its fox button returns to the woodland. The remaining five-clearing story is still to come. [Controls, implementation and remaining checks](docs/HEART-TREE.md).

The learning island is retained as the games book. Drawing is a creative companion:

| Activity | Three selectable stages |
| --- | --- |
| Zählgarten | Count and tap quantities 0–5 / 0–10 / 0–20 |
| Znüni-Rechnen | Addition to 5 / addition and subtraction to 10 / to 20 |
| Musterzug | AB / AAB / ABC and ABB patterns |
| Naturdetektive | Recognise animals / habitats / traits and needs |
| Leseschatz | Syllables and words at three existing reading levels; colour words / noun + colour / sentences in «Lies genau»; expanding syllable families in «Silben-Ballone» |
| Schreibspuren | Small initial selection / expanded selection / all existing glyphs |
| Zahlenwege | Three existing dot-to-dot levels |

Each stage is labelled with a trimester. This is a **provisional app progression**, not an official Zürich trimester schedule. The curriculum covers a whole cycle. Nature questions may be read together with an adult. All stages are freely accessible, with no timers or penalties in the new games. Complete five questions to earn a star once per game and stage. Replay freely. Stars unlock stickers.

**Learning adventures:** Sternenrakete (number bonds), Waldpicknick (sharing), Zauberzwillinge (doubling), Formenwerkstatt (geometry), Reimzirkus, Silbentrommel, Roboterpost (routes) and Was kommt dann? (sequencing). Each has three stages, five tasks per round, hints, unlimited retries and a replay-safe star.

**Forschen & Knobeln:** Seven additional games: Waldschatz (self-paced missing-object memory), Nachbarhäuser (predecessor/successor), Beerenvergleich (structured quantity comparisons), Spiegelmosaik (editable reflected grids), Rechenfreunde (commutative/adjacent addition), Vokalversteck (missing written vowels) and Waldumfrage (picture charts). Each has three stages, five tasks and a replay-safe star. Twenty-four open creative missions now connect observation, language, mathematics, movement and water investigations to the painting tools. [Research from all six requested resource sites and original activity mapping](docs/RESOURCE-RESEARCH.md).

**Official sources reviewed:** The public LMVZ product pages are now accessible and have been researched alongside Zürich's 2026/27 directory and Klett und Balmer's Young World didactics. All new exercises are original; no publisher worksheets or illustrations are included. See the [new research and activity mapping](docs/LMVZ-RESEARCH.md), [earlier curriculum/handwriting report](docs/RESEARCH.md) and [learning concept](docs/LEARNING.md). The seventeen earlier handwriting corrections are retained. These remain simplified original drawings, not a licensed official font or a certified complete curriculum.

The selected **Waldatelier** design brings a watercolour Zürich lakeside, a fox companion, coordinated subject illustrations, sepia tool icons and cream/forest-green stationery to every activity. The same illustrations appear in reading, learning, canvas stamps and the 42-sticker collection. Two original colouring pages, **Fuchs am See** and **Tram am Zürichsee**, join the existing 41 pages. Both support free painting, dice, numbers, syllables and colour words. Paint colours and handwriting geometry keep their learning meaning.

«Kreativpause & Schätze» contains the colouring book, free drawing, saved pictures and sticker album. Keep the parent gear pressed to open settings. Existing device progress and pictures retain their original storage identifiers. See the [design notes](design/waldatelier/README.md) and [five original design directions](design/mockups/index.html).

## Develop and check

Use the existing checkout; no worktree is needed. No dependency installation or build is required.

```sh
cd /workspace/Drawing-App
python3 -m http.server 8000 --bind 0.0.0.0
```

In another terminal:

```sh
node tests/learning.test.cjs
node tests/adventures.test.cjs
node tests/expeditions.test.cjs
node tests/waldatelier.test.cjs
node tests/forest.test.cjs
node --check js/screens/learn.js
# With the server running and the cloud image browser tools:
node tests/handwriting-browser.cjs
node tests/forest-browser.cjs
node tests/memory-browser.cjs
```

The content tests cover answer validity, range boundaries, arithmetic, offline assets and storage compatibility. Browser smoke checks are in `tests/browser-smoke.cjs` and require Playwright plus Chromium. In this cloud image: `node tests/browser-smoke.cjs` with the server running. They exercise 60 tasks through touch taps, wrong answers, replay rewards, three-stage routing, mobile layout, offline reload and saved stars. The dedicated handwriting browser check verifies model bounds across stage changes and completes all seventeen revised models with simulated touch strokes. These tests do not establish Safari compatibility or certify pedagogical accuracy; test on a physical iPad before release.

The forest tests cover safe routes before/after repair, the independent activity level, two saved quest sessions, first-slice save compatibility, replay-safe story completion and local Three.js imports. Its browser journey covers touch walking, Hare-first discovery, help, leaving/reload/continuation, previously earned stars, walking over the new bridge, Hedgehog's resting place, old-library access and an offline 3D reload. The memory browser check also exercises ordinary Waldschatz practice at all three stages. Use `?screen=hub` for the direct library entry. Three.js 0.187.0 and its MIT license are in `vendor/three`; no package install is needed.

Bump `CACHE` in `sw.js` after app changes. Include new runtime assets in its cache list. Never rename localStorage/IndexedDB keys merely to change the app name.

For manual responsive checks, open `tests/waldatelier-responsive.html` through the server. It loads the actual app in 390px phone and 820px tablet frames. `tests/waldatelier-paint.html` checks the new pages' guided colour regions at four paper sizes. Neither page is part of the child-facing navigation or offline install.

## Install

The existing GitHub Pages location is <https://mrtolchock.github.io/Drawing-App/>. The repository uses `main` as its sole branch; check the Pages deployment status after pushing updates.

Open the deployed page in Safari, choose **Teilen → Zum Home-Bildschirm**. All pictures, settings and stars stay on the device. Offline use requires one successful initial load.
