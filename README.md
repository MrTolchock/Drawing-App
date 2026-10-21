# Farbklecks

A colouring and early-learning app for children around six years old, in Swiss Standard German. It runs on iPad and iPhone as an installable web app (PWA): plain HTML, CSS and JavaScript with no build step, no server code, no tracking and no ads. Once it's on the home screen it works offline.

## What children can do

**Ausmalen (colouring), the main activity.** A picture book with about 50 hand-drawn colouring pages in five categories: Tiere, Schweiz, Fahrzeuge, Fantasie and Natur. Each picture can be coloured five ways:

| Mode | What the child does | What it practises |
| --- | --- | --- |
| Frei | Colours freely, with patterns, glitter and stamps | Fine motor skills, creativity |
| Würfel | Matches dice dots on the picture to the dice on the pencils | Counting 1–6 |
| Zahlen | Matches the numbers 1–6 | Reading digits |
| Silben | Matches syllables (e.g. MA, MI, MO) | Reading first syllables |
| Farbwörter | Reads «rot», «blau», «gelb»… and picks the colour | Reading colour words |

Some details that make colouring easier and more fun:

- Crayons and markers stay inside the lines.
- The bucket fills a whole area, including with patterns (dots, stripes, checks, stars, hearts, waves, glitter) or rainbow rings.
- Two fingers zoom in for small areas.
- Labels pop away when the right colour goes in.
- A finished picture gets a fanfare and stars, and goes into «Meine Bilder».
- Progress is saved per picture and mode.

**Schreiben (writing).** The child traces capital letters, small letters and the digits 0–9 with a finger. Each stroke is shown in the right order and direction, on Swiss school writing lines. Each letter ends with an «Anlaut» picture: A wie Affe 🐒.

**Lesen (reading).** Reading games with Silbenbögen (the syllable arcs used in Swiss schools), at three levels. There is no audio: every game checks itself with pictures.

**Punkt zu Punkt.** The child connects numbered dots up to 10, 20 or 30. The finished outline becomes a colouring page.

**Freies Malen.** Free drawing with 8 brushes, stamps, a mirror mode and coloured paper.

**Sterne & Sammelalbum.** Finished activities earn stars, and every 3 stars unlock a new sticker in the sticker album.

**Für Eltern.** Hold the gear button on the home screen for one second to open the parent settings. There you can:

- turn sounds on or off;
- choose how syllables and words are shown: CAPITALS only, or normal upper and lower case;
- reset the stars and progress.

## Getting it onto the iPad / iPhone

The app is served by GitHub Pages from the `main` branch: <https://mrtolchock.github.io/Drawing-App/>

1. Open the address in **Safari**.
2. Tap **Teilen**, then **Zum Home-Bildschirm**.
3. Start Farbklecks from the home screen icon. It works in airplane mode too.

Pictures, stars and progress stay on the device (browser storage). Apps added to the home screen are not affected by Safari's 7-day cleanup. To get a picture out of the app, open it in «Meine Bilder» and tap **Sichern**.

## Project layout

```
index.html            page shell, icon sprite, script order
css/                  base.css (design tokens, components), paint.css, screens.css, trace/dots/read.css
fonts/                Andika (for reading) and Baloo 2 (headings), both SIL Open Font License
js/core/              util, store (settings, progress, IndexedDB), sound (Web Audio)
js/data/              colours, stickers
js/art/               dsl.js (drawing helper + registry), colouring pages per category, preview
js/learn/             glyphs.js (letter strokes), words.js (words, syllables, sentences), dots.js
js/paint/             brushes.js, engine.js (painting engine)
js/ui/                ui.js (components, router), fx.js (effects), pencils.js
js/screens/           hub, book, color, free, gallery, album (+ parent settings), trace, dots, read
sw.js                 service worker (offline cache)
```

When you change any file, bump `CACHE` in `sw.js` (e.g. `farbklecks-v3`) so installed apps pick up the new version on their next launch.
