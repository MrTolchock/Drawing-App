# Farbtupf

[Open the private story preview](https://farbtupf-herzbaum-preview-k7m4.andreas-itten.chatgpt.site) — sign in with the ChatGPT account that owns the preview. [GitHub Pages](https://mrtolchock.github.io/Drawing-App/) · [Preview and deployment notes](docs/PREVIEW.md).

[**Current design and visualisations**](design/README.md) · [Story and gameplay blueprint](design/heart-tree/BLUEPRINT.md) · [Dismissed alternatives and earlier work](design/archive/README.md).

[Original design review PDF — archived](design/archive/reviews/DESIGN-REVIEW.pdf).

Finger-friendly learning adventures for first-grade children in Zürich, in Swiss Standard German. Static HTML/CSS/JavaScript PWA with locally bundled Three.js: no build step, account, ads, tracking or runtime CDN. Works offline after initial loading; prototype narration uses device voices and is not guaranteed offline.

The app opens in **Der Herzbaum**, a woodland story about bringing five neighbours back together. Its central tree starts bare. Each of nine helping projects restores another leafy branch; the final gathering brings everyone home. The saved world, repairs, interrupted puzzles and ending survive reloads. The portrait camera stays close to the fox, with the wider forest view retained in landscape.

**Waldspiele is the single games library.** Open the book in the forest, choose a neighbour or browse all games. The old `?screen=hub` bookmark opens this same book. The fox returns to the forest; back arrows return to the previous activity or the book. Settings opens with one tap from the forest or book, followed by the existing adult arithmetic gate. Existing local progress, stars and drawings keep their storage identifiers.

All short game families use the same neighbours, five-leaf round progress, gentle retry feedback, end celebration, replay-safe star and pictured return choices. Story projects also show the tree's growth. Practice earns album stars without changing story repairs or advancing the ending. Reading, writing, drawing, colouring and the sticker album remain available in the book. Creative missions have been removed.

The revised activities include:

| Activity | How children play |
| --- | --- |
| Zählgarten | Count visible ladybirds by tapping them; a deliberately empty garden introduces zero at the end of the round |
| Znüni-Rechenfreunde | Move apples together or give them to Hase; combines Plus/Minus with the former Rechenfreunde's swap and adjacent problems |
| Naturdetektive | Match an illustrated feature or animal to pictured answers, with a repeatable spoken question |
| Sternenrakete | Fill empty star seats, then launch the rocket |
| Waldpicknick | See the berries leave the basket and appear on Fuchs and Igel's plates; undo and compare before checking |
| Zauberspiegel | Count a group and its reflection across a visible mirror line |
| Formenwerkstatt | Match a pictured silhouette, marked corners or a rotated form |
| Reimzirkus | Hear each word separately and choose among literal matching pictures; abstract rhyme words were removed |
| Was kommt dann? | Drag picture cards into order, tap two cards to swap, or use left/right keys; every arrangement remains editable |
| Waldumfrage | Count one paw per vote in aligned picture rows; relevant fruit rows are highlighted |
| Spiegelmosaik | Follow a small worked reflection example, then edit the mirrored grid |
| Zahlenwege | Find the next number independently; the number and its location are revealed only when asking for a hint, apart from the initial 1 |

The three freely selectable stages are **Entdecken**, **Üben** and **Knobeln**. They are an app progression, not an official Zürich trimester schedule. Short rounds have five tasks, unlimited retries and no time pressure. The established Leseschatz reading puzzles and handwriting models remain in place.

Narration uses a German device voice, preferring Swiss German language settings. Picture cues carry the core interactions; the speaker repeats the current task, hint or exact rhyme word. Voice availability and offline speech depend on the device; no recorded audio or online speech service is included. Test on a physical iPhone/iPad with its installed German voice before release.

The optional **Spielzeit** clock offers a stopwatch or a 5/10/15/20/30-minute countdown. It is initially off and pauses in the background and parent settings. Reload restores it paused. [Timer behaviour](docs/TIMER.md).

The original painted woodland and Waldatelier illustrations are bundled locally and used throughout the world, games, painting tools and 42-sticker album. [Artwork notes](assets/woodland/ART-NOTES.md) · [Story and save behaviour](docs/HEART-TREE.md) · [This revision and verification](docs/IMPROVEMENTS.md).

All exercises are original. Source research, curriculum scope and the seventeen retained handwriting corrections are documented in [LMVZ research](docs/LMVZ-RESEARCH.md), [resource research](docs/RESOURCE-RESEARCH.md) and the [learning concept](docs/LEARNING.md). Those research documents describe earlier activity sets as historical context; the list above describes the current app.

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
node tests/routes.test.cjs
node tests/story.test.cjs
node tests/timer.test.cjs
node tests/play-content.test.cjs
node --check js/screens/learn.js
# With the server running and the cloud image browser tools:
node tests/handwriting-browser.cjs
node tests/forest-browser.cjs
node tests/memory-browser.cjs
node tests/trail-browser.cjs
node tests/story-browser.cjs
node tests/timer-browser.cjs
node tests/painted-browser.cjs
node tests/play-browser.cjs
node tests/play-layout-browser.cjs
```

The content tests cover answer validity, range boundaries, arithmetic, offline assets and storage compatibility. Browser smoke checks are in `tests/browser-smoke.cjs` and require Playwright plus Chromium. In this cloud image: `node tests/browser-smoke.cjs` with the server running. They exercise 60 tasks through touch taps, wrong answers, replay rewards, three-stage routing, mobile layout, offline reload and saved stars. The dedicated handwriting browser check verifies model bounds across stage changes and completes all seventeen revised models with simulated touch strokes. These tests do not establish Safari compatibility or certify pedagogical accuracy; test on a physical iPad before release.

The forest tests cover safe routes, independent story/practice sessions, earlier-save compatibility, replay-safe completion and local Three.js imports. Story tests exercise all 72 supported chapter-order combinations and prove that new optional content cannot reset the ending. The full story browser test walks through all nine quests and both chapter transitions with touch inputs, interrupts three new sessions, resumes the ending, plays all three guided practice types and reloads the restored world offline. Existing family and legacy-learning checks remain available. Use `?screen=hub` for direct access to the single Waldspiele book. Three.js 0.187.0 and its MIT license are in `vendor/three`; no package install is needed.

Bump `CACHE` in `sw.js` after app changes. Include new runtime assets in its cache list. Never rename localStorage/IndexedDB keys merely to change the app name.

For manual responsive checks, open `tests/waldatelier-responsive.html` through the server. It loads the actual app in 390px phone and 820px tablet frames. `tests/waldatelier-paint.html` checks the new pages' guided colour regions at four paper sizes. Neither page is part of the child-facing navigation or offline install.

## Install

The existing GitHub Pages location is <https://mrtolchock.github.io/Drawing-App/>. The repository uses `main` as its sole branch; check the Pages deployment status after pushing updates.

Open the deployed page in Safari, choose **Teilen → Zum Home-Bildschirm**. All pictures, settings and stars stay on the device. Offline use requires one successful initial load.
