/* Farbtupf – Service Worker: keeps the whole app on the device so it runs without internet. */
const CACHE = 'farbtupf-v9.4.2-waldpost';
const SCOPE=self.registration.scope;
const INDEX=new URL('index.html',SCOPE).href;
const ACTIVE_MARKER=new URL('.farbtupf-active-cache',SCOPE).href;
const ASSETS = [
  './assets/audio/credits.html',
  './assets/audio/narration/add.mp3',
  './assets/audio/narration/clips.js',
  './assets/audio/narration/compare.mp3',
  './assets/audio/narration/count.mp3',
  './assets/audio/narration/friends-badger.mp3',
  './assets/audio/narration/friends-beaver.mp3',
  './assets/audio/narration/friends-bird.mp3',
  './assets/audio/narration/friends-hedgehog.mp3',
  './assets/audio/narration/friends-ibex.mp3',
  './assets/audio/narration/friends-mouse.mp3',
  './assets/audio/narration/friends-owl.mp3',
  './assets/audio/narration/friends-squirrel.mp3',
  './assets/audio/narration/letter-badger.mp3',
  './assets/audio/narration/letter-beaver.mp3',
  './assets/audio/narration/letter-bird.mp3',
  './assets/audio/narration/letter-deer.mp3',
  './assets/audio/narration/letter-fish.mp3',
  './assets/audio/narration/letter-frog.mp3',
  './assets/audio/narration/letter-hedgehog.mp3',
  './assets/audio/narration/letter-ibex.mp3',
  './assets/audio/narration/letter-kingfisher.mp3',
  './assets/audio/narration/letter-mouse.mp3',
  './assets/audio/narration/letter-owl.mp3',
  './assets/audio/narration/letter-squirrel.mp3',
  './assets/audio/narration/mirror.mp3',
  './assets/audio/narration/nature.mp3',
  './assets/audio/narration/neighbours.mp3',
  './assets/audio/narration/pattern.mp3',
  './assets/audio/narration/picnic.mp3',
  './assets/audio/narration/read-puzzle.mp3',
  './assets/audio/narration/robot.mp3',
  './assets/audio/narration/rocket.mp3',
  './assets/audio/narration/sequence.mp3',
  './assets/audio/narration/syllable.mp3',
  './assets/audio/narration/treasure.mp3',
  './assets/audio/narration/vowels.mp3',
  './assets/audio/blackbird.mp3',
  './assets/audio/blackcap.mp3',
  './assets/audio/blueTit.mp3',
  './assets/audio/brook.mp3',
  './assets/audio/chaffinch.mp3',
  './assets/audio/coalTit.mp3',
  './assets/audio/greatTit.mp3',
  './assets/audio/leaves.mp3',
  './assets/audio/robin.mp3',
  './assets/audio/thrush.mp3',
  './assets/audio/wren.mp3',
  './css/navigation.css',
  './assets/interface/navigation-symbols.webp',
  './assets/interface/navigation-back.webp',
  './css/map.css',
  './js/friends/map-layout.js',
  './assets/interface/den-marker.webp',
  './assets/interface/exit-symbol.webp',
  './assets/interface/letter-paper.webp',
  './js/friends/review-repository.js',
  './js/ui/review-connection.js',
  './js/core/updates.js',
  './css/typography.css',
  './js/friends/puzzle-rounds.js',
  './js/friends/puzzle-implementation.js',
  './js/friends/puzzle-catalogue.js',
  './js/friends/puzzle-review.js',
  './js/screens/puzzle-review.js',
  './js/screens/puzzle-gallery.js',
  './css/puzzle-review.css',
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
  './assets/waldatelier/review-nature.webp',
  './assets/waldatelier/puzzle-garden.webp',
  './assets/waldatelier/expansion-woodland-trees.webp',
  './assets/waldatelier/expansion-woodland-finds.webp',
  './assets/waldatelier/expansion-meadow-pond.webp',
  './assets/waldatelier/expansion-garden-harvest.webp',
  './assets/waldatelier/expansion-woodland-equipment.webp',
  './assets/waldatelier/expansion-picnic-home.webp',
  './assets/waldatelier/expansion-seasons-weather.webp',
  './assets/waldatelier/expansion-woodland-actions.webp',
  './assets/waldatelier/expansion-nature-cycles.webp',
  './assets/waldatelier/expansion-woodland-places.webp',
  './assets/waldatelier/forest-actions.webp',
  './assets/waldatelier/forest-wildlife.webp',
  './assets/waldatelier/forest-fox.webp',
  './assets/waldatelier/rhyme-vocabulary.webp',
  './assets/waldatelier/menu.webp',
  './js/friends/interface.js',
  './js/friends/hud-art.js',
  './js/friends/settings.js',
  './assets/forest-friends/world-map.webp',
  './assets/forest-friends/den-v2.webp',
  './css/friends.css',
  './js/friends/content.js',
  './js/friends/library.js',
  './js/friends/state.js',
  './js/friends/play-log.js',
  './js/friends/world.js',
  './js/friends/painted.js',
  './js/friends/perf.js',
  './js/friends/world/index.js',
  './js/friends/world/noise.js',
  './js/friends/world/textures.js',
  './js/friends/world/streamer.js',
  './js/friends/world/fade.js',
  './js/friends/world/life.js',
  './js/friends/world/footprints.js',
  './js/friends/world/shadows.js',
  './js/friends/world/ambience.js',
  './js/friends/world/rain.js',
  './js/friends/world/big/wonders.js',
  './js/friends/world/tiles.js',
  './js/friends/world/landmarks.js',
  './js/friends/world/big/layout.js',
  './js/friends/world/big/terrain.js',
  './js/friends/world/big/index.js',
  './js/friends/world/big/nav.js',
  './js/friends/world/big/tiles.js',
  './js/friends/world/big/atlas.js',
  './js/friends/world/big/decals.js',
  './js/friends/world/big/sites.js',
  './js/friends/world/big/cave.js',
  './js/friends/world/big/beaver.js',
  './js/friends/world/big/bats.js',
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
  './assets/characters/ibex.glb',
  './vendor/three/addons/GLTFLoader.js',
  './vendor/three/addons/BufferGeometryUtils.js',
  './vendor/three/addons/SkeletonUtils.js',
  './vendor/meshoptimizer/meshopt_decoder.js',
  './js/friends/forest3d.js',
  './js/friends/characters3d.js',
  './js/friends/audio.js',
  './js/friends/weather.js',
  './js/friends/soundscape.js',
  './js/friends/game.js',
  './',
  './index.html',
  './css/base.css',
  './css/screens.css',
  './css/trace.css',
  './css/waldatelier.css',
  './vendor/three/three.module.js',
  './vendor/three/three.core.js',
  './js/learn/routes.js',
  './js/ui/waldatelier.js',
  './js/ui/waldatelier-icons.js',
  './assets/waldatelier/navigation.webp',
  './assets/waldatelier/animals.webp',
  './assets/waldatelier/creatures.webp',
  './assets/waldatelier/words-one.webp',
  './assets/waldatelier/words-two.webp',
  './assets/waldatelier/words-three.webp',
  './assets/waldatelier/discovery.webp',
  './assets/waldatelier/people.webp',
  './assets/waldatelier/alphabet.webp',
  './js/core/util.js',
  './js/core/store.js',
  './js/core/sound.js',
  './js/learn/glyphs.js',
  './js/ui/fx.js',
  './js/ui/ui.js',
  './js/screens/trace.js',
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
  './js/core/speech.js',
  './js/ui/gestures.js',
  './js/scene/materials.js',
  './assets/forest-friends/character-portraits.webp',

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

// Safari asks for byte ranges even for short audio files. Supply them from the
// complete installed copy so a narration clip can start without a connection.
async function audioRange(hit, range) {
  const match = /^bytes=(\d*)-(\d*)$/.exec(range);
  if (!match || (!match[1] && !match[2])) return hit;
  const blob = await hit.blob(), size = blob.size;
  const start = match[1] ? Number(match[1]) : Math.max(0, size - Number(match[2]));
  const end = match[1] && match[2] ? Math.min(size - 1, Number(match[2])) : size - 1;
  if (start > end) return new Response(null, {status:416, headers:{'Content-Range':'bytes */'+size}});
  return new Response(blob.slice(start, end + 1), {status:206, headers:{
    'Content-Type':blob.type || 'audio/mpeg', 'Accept-Ranges':'bytes',
    'Content-Length':String(end - start + 1), 'Content-Range':'bytes '+start+'-'+end+'/'+size
  }});
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  // This small independent recovery page must remain reachable from old shells.
  if(new URL(req.url).pathname===new URL('update.html',SCOPE).pathname){event.respondWith(fetch(req,{cache:'no-store'}));return;}
  event.respondWith(
    caches.open(CACHE).then(c=>c.match(req, { ignoreSearch: true })).then((hit) => {
      if (hit) {
        const range = req.headers.get('Range');
        return range && new URL(req.url).pathname.endsWith('.mp3') ? audioRange(hit, range) : hit;
      }
      return fetch(req)
        .then((res) => {
          if (res.ok && res.status !== 206) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => (req.mode === 'navigate' ? caches.open(CACHE).then(c=>c.match('./index.html')) : Response.error()));
    })
  );
});
