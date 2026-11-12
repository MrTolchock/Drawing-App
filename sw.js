/* Farbtupf – Service Worker: keeps the whole app on the device so it runs without internet. */
const CACHE = 'farbtupf-v9.0.10-recovery';
const SCOPE=self.registration.scope;
const INDEX=new URL('index.html',SCOPE).href;
const ACTIVE_MARKER=new URL('.farbtupf-active-cache',SCOPE).href;
const ASSETS = [
  './js/core/updates.js',
  './css/typography.css',
  './js/friends/puzzle-rounds.js',
  './js/screens/puzzle.js',
  './css/puzzle-rounds.css',
  './assets/waldatelier/puzzle-vocabulary.webp',
  './assets/waldatelier/puzzle-flowers.webp',
  './js/friends/puzzles.js',
  './css/puzzles.css',
  './css/waldbuch.css',
  './js/ui/waldbuch.js',
  './assets/forest-friends/puzzle-clearing.webp',
  './assets/waldatelier/forest-objects.webp',
  './assets/waldatelier/forest-actions.webp',
  './assets/waldatelier/menu.webp',
  './js/friends/interface.js',
  './js/friends/settings.js',
  './assets/forest-friends/interface-icons.webp',
  './assets/forest-friends/picture-map.webp',
  './assets/forest-friends/world-map.webp',
  './assets/forest-friends/neighbours.webp',
  './assets/forest-friends/mailman-portrait.webp',
  './js/art/den-pages.js',
  './assets/forest-friends/den-v2.webp',
  './assets/forest-friends/postcard-friends.webp',
  './assets/forest-friends/colouring-friends.webp',
  './css/friends.css',
  './js/friends/content.js',
  './js/friends/library.js',
  './js/friends/state.js',
  './js/friends/art.js',
  './js/friends/actors.js',
  './js/friends/world.js',
  './js/friends/painted.js',
  './js/friends/perf.js',
  './js/friends/world/index.js',
  './js/friends/world/noise.js',
  './js/friends/world/textures.js',
  './js/friends/world/tiles.js',
  './js/friends/world/landmarks.js',
  './js/friends/world/streamer.js',
  './js/friends/world/big/layout.js',
  './js/friends/world/big/terrain.js',
  './js/friends/world/big/index.js',
  './js/friends/world/big/nav.js',
  './js/friends/world/big/tiles.js',
  './js/friends/world/big/atlas.js',
  './js/friends/world/big/sites.js',
  './assets/characters/fox.glb',
  './assets/characters/squirrel.glb',
  './assets/characters/bird.glb',
  './assets/characters/owl.glb',
  './assets/characters/mouse.glb',
  './assets/characters/beaver.glb',
  './assets/characters/mailman.glb',
  './assets/characters/deer.glb',
  './assets/characters/frog.glb',
  './assets/characters/hedgehog.glb',
  './assets/characters/fish.glb',
  './assets/characters/kingfisher.glb',
  './assets/characters/badger.glb',
  './vendor/three/addons/GLTFLoader.js',
  './vendor/three/addons/BufferGeometryUtils.js',
  './vendor/three/addons/SkeletonUtils.js',
  './vendor/meshoptimizer/meshopt_decoder.js',
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
  './assets/woodland/characters-nature.webp',
  './assets/woodland/forest-props.webp',
  './assets/woodland/places.webp',
  './assets/woodland/ground.webp',
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
  './assets/waldatelier/hero.webp',
  './assets/waldatelier/navigation.webp',
  './assets/waldatelier/animals.webp',
  './assets/waldatelier/creatures.webp',
  './assets/waldatelier/words-one.webp',
  './assets/waldatelier/words-two.webp',
  './assets/waldatelier/words-three.webp',
  './assets/waldatelier/discovery.webp',
  './assets/waldatelier/people.webp',
  './assets/waldatelier/alphabet.webp',
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

async function appCaches(){
  const result=[];
  for(const name of await caches.keys()){
    if(!name.startsWith('farbtupf-'))continue;
    const cache=await caches.open(name);
    if(await cache.match(INDEX,{ignoreVary:true}))result.push({name,marked:!!await cache.match(ACTIVE_MARKER)});
  }
  return result;
}
async function removeAppCache(name){
  if(!await caches.has(name))return;
  const cache=await caches.open(name),requests=await cache.keys();
  // Other installations can share this origin. Remove only this app's URLs.
  await Promise.all(requests.filter(r=>r.url.startsWith(SCOPE)).map(r=>cache.delete(r)));
  if(!(await cache.keys()).length)await caches.delete(name);
}
async function prepareCache(){
  const entries=await appCaches();
  // Legacy activation deleted every other cache, so its earliest complete cache
  // is the active one; later caches are abandoned waiting downloads. New releases
  // mark the active cache explicitly. Keep it until the replacement is complete.
  const marked=entries.filter(e=>e.marked);
  const active=self.registration.active?(marked[marked.length-1]?.name||entries[0]?.name):null;
  await Promise.all(entries.filter(e=>e.name!==active).map(e=>removeAppCache(e.name)));
  if(CACHE!==active)await removeAppCache(CACHE);
  return active===CACHE;
}
async function reportFailure(error){
  for(const client of await self.clients.matchAll({type:'window',includeUncontrolled:true})){
    if(client.url.startsWith(SCOPE))client.postMessage({type:'farbtupf-update-error',name:error.name||'Error',message:error.message||'Update failed'});
  }
}

// Fully cache the release before activation. Legacy installed pages cannot ask a
// waiting worker to activate, so activation must not depend on their JavaScript.
// Current pages reload only on idle screens (updates.js), never during a task.
self.addEventListener('install', (event) => {
  event.waitUntil((async()=>{
    let alreadyActive=true;
    try{
      alreadyActive=await prepareCache();
      const cache=await caches.open(CACHE);
      await cache.addAll(ASSETS.map(u=>new Request(u,{cache:'reload'})));
      await self.skipWaiting();
    }catch(error){
      if(!alreadyActive)await removeAppCache(CACHE);
      await reportFailure(error);throw error;
    }
  })());
});

self.addEventListener('message', (event) => {
  if (event.data === 'activate') self.skipWaiting();
  if(event.data==='version')event.ports[0]?.postMessage({version:CACHE.match(/^farbtupf-v([^-]+)/)?.[1]||CACHE});
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    appCaches()
      .then(entries=>Promise.all(entries.filter(e=>e.name!==CACHE).map(e=>removeAppCache(e.name))))
      .then(()=>caches.open(CACHE)).then(cache=>cache.put(ACTIVE_MARKER,new Response(CACHE)))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  // This small independent recovery page must remain reachable from old shells.
  if(new URL(req.url).pathname===new URL('update.html',SCOPE).pathname){event.respondWith(fetch(req,{cache:'no-store'}));return;}
  event.respondWith(
    caches.open(CACHE).then(c=>c.match(req, { ignoreSearch: true })).then((hit) => {
      if (hit) return hit;
      return fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => (req.mode === 'navigate' ? caches.open(CACHE).then(c=>c.match('./index.html')) : Response.error()));
    })
  );
});
