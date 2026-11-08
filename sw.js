/* Farbtupf – Service Worker: keeps the whole app on the device so it runs without internet. */
const CACHE = 'farbtupf-v7.11.0-cosy-sleep';
const ASSETS = [
  './css/friends.css',
  './js/friends/content.js',
  './js/friends/library.js',
  './js/friends/state.js',
  './js/friends/art.js',
  './js/friends/actors.js',
  './js/friends/world.js',
  './js/friends/painted.js',
  './js/friends/forest3d.js',
  './js/friends/characters3d.js',
  './assets/forest-friends/squirrel.webp',
  './assets/forest-friends/bird.webp',
  './assets/forest-friends/mouse.webp',
  './assets/forest-friends/den.webp',
  './assets/forest-friends/forest.webp',
  './assets/forest-friends/shop.webp',
  './assets/forest-friends/fox-front.webp',
  './assets/forest-friends/fox-side.webp',
  './assets/forest-friends/fox-back.webp',
  './assets/forest-friends/fox-happy.webp',
  './assets/forest-friends/owl.webp',
  './js/friends/audio.js',
  './js/friends/game.js',
  './',
  './index.html',
  './docs/lernideen.html',
  './css/base.css',
  './css/paint.css',
  './css/screens.css',
  './css/trace.css',
  './css/dots.css',
  './css/read.css',
  './css/learning.css',
  './css/waldatelier.css',
  './css/expeditions.css',
  './css/forest.css',
  './css/woodland.css',
  './assets/woodland/characters-nature.png',
  './assets/woodland/forest-props.png',
  './assets/woodland/places.png',
  './assets/woodland/ground.png',
  './js/ui/woodland.js',
  './js/forest/painted.js',
  './css/timer.css',
  './css/play.css',
  './js/ui/play.js',
  './js/core/journey.js',
  './css/gameplay.css',
  './css/learning-gameplay.css',
  './css/adventure-gameplay.css',
  './css/forest-gameplay.css',
  './css/story-cinema.css',
  './css/forest-exploration.css',
  './js/forest/exploration.js',
  './js/forest/navigation.js',
  './js/forest/woodland.js',
  './js/forest/cinema.js',
  './js/forest/heart-oak.js',
  './js/forest/story-actors.js',
  './js/forest/story-director.js',
  './js/ui/heart-tree.js',
  './vendor/three/three.module.js',
  './vendor/three/three.core.js',
  './js/forest/model.js',
  './js/forest/story.js',
  './js/forest/speech.js',
  './js/forest/art.js',
  './js/forest/activity.js',
  './js/ui/memory-board.js',
  './js/ui/route-board.js',
  './js/forest/memory.js',
  './js/forest/trail.js',
  './js/learn/routes.js',
  './js/forest/materials.js',
  './js/forest/characters.js',
  './js/forest/landscape.js',
  './js/forest/projects.js',
  './js/forest/scene.js',
  './js/screens/forest.js',
  './js/screens/forest-book.js',
  './js/ui/waldatelier.js',
  './js/ui/waldatelier-icons.js',
  './assets/waldatelier/hero.png',
  './assets/waldatelier/navigation.png',
  './assets/waldatelier/animals.png',
  './assets/waldatelier/creatures.png',
  './assets/waldatelier/words-one.png',
  './assets/waldatelier/words-two.png',
  './assets/waldatelier/words-three.png',
  './assets/waldatelier/discovery.png',
  './assets/waldatelier/people.png',
  './assets/waldatelier/alphabet.png',
  './js/learn/learning.js',
  './js/learn/adventures.js',
  './js/learn/expeditions.js',
  './js/screens/learn.js',
  './js/screens/adventure.js',
  './js/screens/expedition.js',
  './js/core/util.js',
  './js/core/store.js',
  './js/core/timer.js',
  './js/ui/timer.js',
  './js/core/sound.js',
  './js/data/colors.js',
  './js/data/stickers.js',
  './js/art/dsl.js',
  './js/art/waldatelier.js',
  './js/art/tiere.js',
  './js/art/tiere2.js',
  './js/art/schweiz.js',
  './js/art/schweiz2.js',
  './js/art/fahrzeuge.js',
  './js/art/fahrzeuge2.js',
  './js/art/fantasie.js',
  './js/art/fantasie2.js',
  './js/art/natur.js',
  './js/art/preview.js',
  './js/learn/glyphs.js',
  './js/learn/words.js',
  './js/learn/dots.js',
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
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS.map((u) => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
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
