# Farbtupf

Finger-friendly learning adventures for first-grade children in Zürich, in Swiss Standard German. Static HTML/CSS/JavaScript PWA: no build, dependencies, account, ads or tracking. Works offline after initial loading.

The learning island comes first. Drawing is a creative companion:

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

**Official sources reviewed:** Zürich's curriculum and the official first-class Basisschrift model sheet have now been inspected. Seventeen letter/digit models have structural corrections, and writing previews use the same SVG shapes as tracing. These are simplified original drawings, not a licensed official font or a certified complete curriculum. LMVZ product pages remain inaccessible. See the [source report and limitations](docs/RESEARCH.md) and [learning concept](docs/LEARNING.md).

«Kreativpause & Schätze» contains the existing 41-page colouring book, free drawing, saved pictures and sticker album. Keep the parent gear pressed to open settings. Existing device progress and pictures retain their original storage identifiers across the rename.

## Develop and check

Use the existing checkout; no worktree is needed. No dependency installation or build is required.

```sh
cd /workspace/Drawing-App
python3 -m http.server 8000 --bind 0.0.0.0
```

In another terminal:

```sh
node tests/learning.test.cjs
node --check js/screens/learn.js
```

The content tests cover answer validity, range boundaries, arithmetic, offline assets and storage compatibility. Browser smoke checks are in `tests/browser-smoke.cjs` and require Playwright plus Chromium. In this cloud image: `node tests/browser-smoke.cjs` with the server running. They exercise 60 tasks through touch taps, wrong answers, replay rewards, three-stage routing, mobile layout, offline reload and saved stars. This does not establish Safari compatibility or correct official handwriting models; test on a physical iPad before release.

Bump `CACHE` in `sw.js` after app changes. Include new runtime assets in its cache list. Never rename localStorage/IndexedDB keys merely to change the app name.

## Install

The existing GitHub Pages location is <https://mrtolchock.github.io/Drawing-App/>. Development checkpoints on `farbtupf-learning` do not update that deployment until merged into the configured Pages branch.

Open the deployed page in Safari, choose **Teilen → Zum Home-Bildschirm**. All pictures, settings and stars stay on the device. Offline use requires one successful initial load.
