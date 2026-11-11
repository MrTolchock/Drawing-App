/* Real old-to-new service workers: recovery, foreground checks, safe reload and saved work. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'/opt/codex/cua_node/lib/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),read=file=>fs.readFileSync(path.join(root,file));
const legacy=new Map(['index.html','js/app.js','js/friends/settings.js','sw.js'].map(file=>[file,execFileSync('git',['show','95b27dc:'+file],{cwd:root})]));
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webmanifest':'application/manifest+json','.woff2':'font/woff2','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.glb':'model/gltf-binary'};
let version='9.0.2',broken=false;
const server=http.createServer((req,res)=>{
 const file=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\//,'')||'index.html',full=path.resolve(root,file);
 if(!full.startsWith(root+path.sep)||!fs.existsSync(full)||!fs.statSync(full).isFile()){res.writeHead(404);res.end();return;}
 let data=version==='9.0.2'&&legacy.has(file)?legacy.get(file):read(file);
 if(file==='js/core/util.js')data=data.toString().replace(/FK.VERSION = '[^']+'/,"FK.VERSION = '"+version+"'");
 if(file==='sw.js'&&version!=='9.0.2')data=data.toString().replace(/farbtupf-v[^']+/, 'farbtupf-v'+version+'-update-test').replace('const ASSETS = [','const ASSETS = ['+(broken?"'./missing-update-fixture.png',":''));
 res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data);
});
(async()=>{await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,reducedMotion:'reduce'}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(60000);
 let navigations=0;page.on('framenavigated',f=>{if(f===page.mainFrame())navigations++;console.log('DOCUMENT',navigations);});
 await page.goto(base+'/?screen=hub');await page.evaluate(()=>navigator.serviceWorker.ready);await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
 await page.evaluate(async()=>{FK.settings.set('schrift','normal');FK.progress.finish('trace','A',1);localStorage.setItem('update-save-sentinel','retained');await FK.store.put('update-sentinel',{drawing:'retained'});await (await caches.open('unrelated-app-cache')).put('other.txt',new Response('retained'));});
 assert.equal(await page.evaluate(()=>FK.VERSION),'9.0.2');assert.equal(await page.evaluate(()=>!!FK.updates),false);
 // This old app has no controllerchange reload or foreground checker. The new
 // worker must activate on its own, without old code posting an activate message.
 version='9.0.3';await page.evaluate(async()=>{window.oldController=navigator.serviceWorker.controller;await (await navigator.serviceWorker.getRegistration()).update();});
 await page.waitForFunction(()=>navigator.serviceWorker.controller!==window.oldController);
 assert.equal(await page.evaluate(()=>FK.VERSION),'9.0.2');await page.reload();await page.waitForFunction(()=>FK.VERSION==='9.0.3'&&!!FK.updates);
 await page.waitForFunction(()=>FK.updates.get().status==='current');
 assert.equal(await page.evaluate(async()=>(await navigator.serviceWorker.getRegistration()).updateViaCache),'none');
 async function saved(){assert.equal(await page.evaluate(()=>localStorage.getItem('update-save-sentinel')),'retained');assert.equal(await page.evaluate(()=>FK.settings.get('schrift')),'normal');assert.equal(await page.evaluate(()=>FK.progress.isDone('trace','A')),true);assert.deepEqual(await page.evaluate(()=>FK.store.get('update-sentinel')),{drawing:'retained'});}
 await saved();assert.equal(await page.evaluate(()=>caches.has('unrelated-app-cache')),true);
 await page.evaluate(async()=>{await (await caches.open('unrelated-app-cache')).put('cache-probe',new Response('wrong cache'));const name=(await caches.keys()).find(k=>k.startsWith('farbtupf-v9.0.3'));await (await caches.open(name)).put('cache-probe',new Response('own cache'));});
 assert.equal(await page.evaluate(()=>fetch('cache-probe').then(r=>r.text())),'own cache');
 console.log('PASS: legacy installation recovers without new page code; own cache, unrelated caches and local/IndexedDB saves retained.');
 // A first/current registration must not loop, and Settings offers visible feedback.
 const initial=navigations;await page.evaluate(()=>{FK.friendsLibrary.active=true;FK.go('settings');});await page.getByRole('button',{name:'Nach Updates suchen',exact:true}).tap();await page.waitForFunction(()=>FK.updates.get().status==='current');assert.equal(navigations,initial);
 const shots=process.env.FARBTUPF_SHOTS||'/tmp/pwa-updates';fs.mkdirSync(shots,{recursive:true});
 for(const width of [390,1024]){await page.setViewportSize({width,height:width===390?844:900});await page.locator('.ff-update-settings').scrollIntoViewIfNeeded();await page.screenshot({path:shots+'/settings-'+width+'.png',animations:'disabled'});}
 // A release arriving during a partially answered puzzle cannot reload it.
 await page.evaluate(()=>FK.go('puzzle',{game:'count',returnTo:'forest-book'}));await page.getByRole('button',{name:'Marienkäfer markieren',exact:true}).first().tap();
 const partial=await page.evaluate(()=>FK.puzzleRounds.start('count')),inPuzzle=navigations;
 version='9.0.4';await page.evaluate(()=>window.dispatchEvent(new Event('online')));await page.waitForFunction(()=>FK.updates.get().status==='ready');
 assert.equal(navigations,inPuzzle);assert.equal(await page.evaluate(()=>FK.current()),'puzzle');assert.equal(await page.evaluate(()=>FK.VERSION),'9.0.3');assert.deepEqual(await page.evaluate(()=>FK.puzzleRounds.start('count')),partial);
 await page.evaluate(()=>FK.go('forest-book'));await page.waitForFunction(()=>window.FK?.VERSION==='9.0.4'&&!!FK.current?.());await saved();assert.deepEqual(await page.evaluate(()=>FK.puzzleRounds.start('count')),partial);
 console.log('PASS: update found after startup; puzzle stays untouched until the menu, then one reload preserves partial answers.');
 // Real colouring: delay its IndexedDB write, discover an update on foreground,
 // then leave. Reload must wait for the snapshot transaction to complete.
 await page.evaluate(()=>{FK.friendsLibrary.active=true;FK.go('book',{from:'friends'});});await page.locator('.book-card').first().click();await page.waitForFunction(()=>FK.current()==='color'&&document.querySelector('.screen-color .cv-outline')?.width>0);
 await page.getByRole('button',{name:'Eimer',exact:true}).click();
 const fillPoint=await page.evaluate(()=>{const c=document.querySelector('.screen-color .cv-paint'),r=c.getBoundingClientRect(),f=FK.art.fitOf(c.width,c.height);return{x:r.left+(f.ox+(20+185/512*960)*f.s)/c.width*r.width,y:r.top+(f.oy+(20+335/512*960)*f.s)/c.height*r.height};});await page.touchscreen.tap(fillPoint.x,fillPoint.y);
 await page.waitForFunction(()=>{const c=document.querySelector('.screen-color .cv-paint');return Array.from(c.getContext('2d').getImageData(0,0,c.width,c.height).data).some((v,i)=>i%4===3&&v>0);});
 await page.evaluate(()=>{const put=FK.store.put;window.colourWrites=[];FK.store.put=(key,record)=>{if(!key.startsWith('c:'))return put(key,record);window.savedColourKey=key;window.savedColourFinished=false;return new Promise(resolve=>{window.colourWrites.push(()=>put(key,record).then(value=>{window.savedColourFinished=true;resolve(value);}));});};Object.defineProperty(document,'hidden',{configurable:true,get:()=>!!window.hiddenForUpdateTest});window.hiddenForUpdateTest=true;document.dispatchEvent(new Event('visibilitychange'));});
 const drawingNav=navigations;version='9.0.5';await page.evaluate(()=>{const now=Date.now;Date.now=()=>now()+61000;window.hiddenForUpdateTest=false;document.dispatchEvent(new Event('visibilitychange'));});await page.waitForFunction(()=>FK.updates.get().status==='ready');assert.equal(navigations,drawingNav);assert.equal(await page.evaluate(()=>FK.current()),'color');
 const previousWrites=await page.evaluate(()=>window.colourWrites.length);await page.evaluate(()=>FK.go('book',{from:'friends'}));await page.waitForFunction(n=>window.colourWrites.length>n,previousWrites);assert.equal(navigations,drawingNav);assert.equal(await page.evaluate(()=>window.savedColourFinished),false);
 const colourKey=await page.evaluate(()=>window.savedColourKey);await page.evaluate(()=>{window.colourWrites.forEach(write=>write());});await page.waitForFunction(()=>window.FK?.VERSION==='9.0.5'&&!!FK.current?.());assert.ok(await page.evaluate(key=>FK.store.get(key).then(r=>r?.paint instanceof Blob),colourKey));await saved();
 console.log('PASS: foreground update waits during drawing, then waits for the actual IndexedDB snapshot before reloading.');
 // A failed precache must leave the current app and its offline fallback intact.
 await page.evaluate(()=>FK.go('settings'));version='9.0.6';broken=true;await page.getByRole('button',{name:'Nach Updates suchen',exact:true}).tap();await page.waitForFunction(()=>FK.updates.get().status==='error');assert.equal(await page.evaluate(()=>FK.VERSION),'9.0.5');
 await context.setOffline(true);await page.reload();await page.waitForFunction(()=>window.FK?.VERSION==='9.0.5'&&!!FK.current?.());await page.evaluate(()=>FK.go('settings'));await page.getByRole('button',{name:'Nach Updates suchen',exact:true}).tap();assert.match(await page.locator('.ff-update-status').textContent(),/offline/);await saved();assert.ok(await page.evaluate(key=>FK.store.get(key).then(r=>r?.paint instanceof Blob),colourKey));
 assert.deepEqual(errors,[]);console.log('PASS: failed download keeps the working release; offline reload and all saved work survive.');await context.close();
 version='9.0.3';broken=false;
 const first=await browser.newContext({viewport:{width:390,height:844}}),fresh=await first.newPage();let freshLoads=0;fresh.on('framenavigated',f=>{if(f===fresh.mainFrame())freshLoads++;});await fresh.goto(base+'/?screen=hub');await fresh.waitForFunction(()=>!!navigator.serviceWorker.controller&&window.FK?.updates?.get().status==='current');assert.equal(freshLoads,1,'first install does not reload');await fresh.evaluate(()=>FK.go('settings'));assert.equal(await fresh.getByRole('button',{name:'Nach Updates suchen',exact:true}).isEnabled(),true);await first.close();console.log('PASS: first install finishes with an enabled update control and no reload loop.');

 }finally{await browser.close();server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e);process.exitCode=1;server.close();});
