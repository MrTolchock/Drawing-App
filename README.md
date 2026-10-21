# Farbklecks

A drawing app for kids around six years old, in Swiss Standard German. It is plain HTML, CSS and JavaScript: no build step, no server code, no tracking, no ads. Once it's on the iPad or iPhone home screen it runs offline like a native app.

## What kids can do

- **Pinsel** – 8 brushes: Filzstift, Wachskreide, Neon, Spraydose, Glitzer, Sternli, Herzli, Perlen. Apple Pencil pressure works. Several fingers can draw at once.
- **16 Farbstifte** in a pencil box, including a **Regenbogen** pencil. Each pencil plays its own note.
- **Stempel** – about 100 emoji stickers in 5 groups (Tiere, Natur, Essen, Spass, Schweiz: Kuh, Glocke, Fondue, Schoggi, Gondel …). Drag to make a trail of stickers.
- **Eimer** (fill bucket) – fills an area. With the Regenbogen pencil it fills with rainbow rings.
- **Radierer**, **Grösse** (4 sizes), **Zurück** (undo, up to 40 steps).
- **Spiegel** – mirror drawing (left/right) or **Kaleidoskop** (8-way symmetry).
- **Ausmalbilder** – 14 colouring pages: Katze, Teddybär, Haus, Fisch, Schmetterling, Blume, Rakete, Kuh (with Swiss flag and cow bell), Schnecke, Glace, Zug, Dino, Auto, Mandala.
- **Neu** – fresh paper in 7 colours (the black «Nachthimmel» paper is great with Neon).
- **Speichern** – saves to «Meine Bilder» with confetti and praise («Mega schön!»).
- **Vorlesen** – button, colour and sticker names are spoken aloud, so children who can't read yet can still find their way.

The current drawing is saved automatically, so nothing is lost when the app is closed.

## Getting it onto the iPad / iPhone

iOS can't run an HTML file straight from the Files app, so the files have to be served over HTTPS **once**. After that, everything stays on the device and no server or internet is needed.

The easiest free option is **GitHub Pages**:

1. In this repository on GitHub, open **Settings → Pages**.
2. Under *Build and deployment*, choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then **Save**. (On a free GitHub plan the repository must be public.)
3. After a minute the app is live at `https://<your-user>.github.io/<repo-name>/`.
4. Open that address in **Safari** on the iPad or iPhone, tap **Teilen** (Share), then **Zum Home-Bildschirm** (Add to Home Screen).
5. Start Farbklecks from the home screen icon. It now works in airplane mode too.

Any other static host (Netlify, Cloudflare Pages, your own web space) works the same way: upload the folder as is.

On a computer you can also just double-click `index.html` and play in the browser. Offline install and saving behave best when the app is served over HTTPS as above.

## For parents

- The **gear button** in «Meine Bilder» opens the parent settings: sounds on/off and voice on/off.
- To get a picture out of the app, open it in «Meine Bilder» and tap **Sichern**. The iOS share sheet opens, where you can choose «Bild sichern» to save it to Photos, or send it.
- All pictures stay on the device (IndexedDB). Apps added to the home screen are not affected by Safari's 7-day cleanup of website data. Deleting the app from the home screen deletes its pictures.
- The voice uses the German voice installed on the device. You can add or change voices in iOS under *Settings → Accessibility → Spoken Content → Voices → German*.

## Project layout

```
index.html              page structure, icons (SVG sprite)
css/app.css             layout and look (iPad landscape/portrait, iPhone portrait/landscape)
js/store.js             settings (localStorage) and pictures (IndexedDB)
js/sound.js             synthesized sounds (Web Audio) and speech output
js/brushes.js           colours, brushes, stamps
js/pages.js             colouring pages, drawn with code
js/app.js               drawing engine, undo, fill, mirror, gallery, UI
sw.js                   service worker (offline cache)
manifest.webmanifest    PWA manifest
icons/                  app icons
```

When you change any file, bump `CACHE` in `sw.js` (e.g. `farbklecks-v2`) so installed apps pick up the new version on their next launch.
