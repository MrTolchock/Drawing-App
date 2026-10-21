/* Farbklecks – Service Worker: keeps the whole app on the device so it runs without internet. */
const CACHE = 'farbklecks-v2';
const ASSETS = [
  './',
  './index.html',
  './css/base.css',
  './css/paint.css',
  './css/screens.css',
  './css/trace.css',
  './css/dots.css',
  './css/read.css',
  './js/core/util.js',
  './js/core/store.js',
  './js/core/sound.js',
  './js/data/colors.js',
  './js/data/stickers.js',
  './js/art/dsl.js',
  './js/art/tiere.js',
  './js/art/tiere2.js',
  './js/art/schweiz.js',
  './js/art/fahrzeuge.js',
  './js/art/fantasie.js',
  './js/art/fantasie2.js',
  './js/art/natur.js',
  './js/art/preview.js',
  './js/learn/glyphs.js',
  './js/learn/words.js',
  './js/paint/brushes.js',
  './js/paint/engine.js',
  './js/ui/fx.js',
  './js/ui/ui.js',
  './js/ui/pencils.js',
  './js/screens/hub.js',
  './js/screens/book.js',
  './js/screens/color.js',
  './js/screens/free.js',
  './js/screens/gallery.js',
  './js/screens/album.js',
  './js/screens/trace.js',
  './js/screens/dots.js',
  './js/screens/read.js',
  './js/app.js',
  './fonts/andika-400.woff2',
  './fonts/andika-700.woff2',
  './fonts/baloo2.woff2',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => {
      if (hit) return hit;
      return fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => (req.mode === 'navigate' ? caches.match('./index.html') : Response.error()));
    })
  );
});
