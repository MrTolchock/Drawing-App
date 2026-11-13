/* Real old-to-new service workers: recovery, foreground checks, safe reload and saved work. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'/opt/codex/cua_node/lib/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),os=require('node:os'),{execFileSync}=require('node:child_process');
const {installRemote,seedFromPage}=require('./review-repository-support.cjs');
const root=path.resolve(__dirname,'..');
const legacyRef=process.env.FARBTUPF_LEGACY_REF||'95b27dc',legacyVersion=process.env.FARBTUPF_LEGACY_VERSION||'9.0.2';
const legacySW=execFileSync('git',['show',legacyRef+':sw.js'],{cwd:root,encoding:'utf8'});
const legacyHTML=execFileSync('git',['show',legacyRef+':index.html'],{cwd:root,encoding:'utf8'});
const files=[...new Set(['index.html','sw.js',...Array.from(legacySW.split('const ASSETS = [')[1].split('];')[0].matchAll(/'\.\/([^']*)'/g),m=>m[1]||'index.html'),...Array.from(legacyHTML.matchAll(/(?:src|href)="([^"#]+)"/g),m=>m[1]).filter(p=>!p.includes(':'))])];
const legacyRoot=fs.mkdtempSync(path.join(os.tmpdir(),'farbtupf-legacy-'));
execFileSync('tar',['-xf','-','-C',legacyRoot],{input:execFileSync('git',['archive',legacyRef,'--',...files],{cwd:root,maxBuffer:128*1024*1024})});
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webmanifest':'application/manifest+json','.woff2':'font/woff2','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.glb':'model/gltf-binary'};
let version=legacyVersion,broken=false,staleBareWorker=false;
const server=http.createServer((req,res)=>{
 const requestURL=new URL(req.url,'http://localhost'),file=decodeURIComponent(requestURL.pathname).replace(/^\//,'')||'index.html',sourceRoot=version===legacyVersion?legacyRoot:root,full=path.resolve(sourceRoot,file);
 if(!full.startsWith(sourceRoot+path.sep)||!fs.existsSync(full)||!fs.statSync(full).isFile()){res.writeHead(404);res.end();return;}
 let data=fs.readFileSync(full);
 if(file==='js/core/util.js')data=data.toString().replace(/FK.VERSION = '[^']+'/,"FK.VERSION = '"+version+"'");
 if(file==='sw.js'&&version!==legacyVersion)data=data.toString().replace(/farbtupf-v[^']+/, 'farbtupf-v'+version+'-update-test').replace('const ASSETS = [','const ASSETS = ['+(broken?"'./missing-update-fixture.png',":''));
 if(file==='sw.js'&&staleBareWorker&&!requestURL.searchParams.has('repair'))data=legacySW;
 res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data);
});
(async()=>{await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 try{
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,reducedMotion:'reduce'}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(60000);
 const reviewServer=await installRemote(context);
 let navigations=0;page.on('framenavigated',f=>{if(f===page.mainFrame())navigations++;console.log('DOCUMENT',navigations);});
 await page.goto(base+'/?screen=hub&software=1');await page.evaluate(()=>navigator.serviceWorker.ready);await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
 await page.evaluate(async()=>{FK.settings.set('schrift','normal');FK.progress.finish('trace','A',1);localStorage.setItem('update-save-sentinel','retained');await FK.store.put('update-sentinel',{drawing:'retained'});await (await caches.open('unrelated-app-cache')).put('other.txt',new Response('retained'));});
 assert.equal(await page.evaluate(()=>FK.VERSION),legacyVersion);assert.equal(await page.evaluate(()=>!!FK.updates),legacyHTML.includes('js/core/updates.js'));
 if(process.env.FARBTUPF_ORPHAN_CACHES==='1'){
  await page.evaluate(async()=>{const name=(await caches.keys()).find(n=>n.startsWith('farbtupf-')),old=await caches.open(name),keys=await old.keys();for(const suffix of ['abandoned-a','abandoned-b']){const copy=await caches.open('farbtupf-'+suffix);for(const key of keys)await copy.put(key,await old.match(key));}});
  const cdp=await context.newCDPSession(page);await cdp.send('Storage.overrideQuotaForOrigin',{origin:base,quotaSize:50*1024*1024});const usage=await cdp.send('Storage.getUsageAndQuota',{origin:base});console.log('SIMULATED STORAGE',JSON.stringify({usage:usage.usage,quota:usage.quota}));
 }
 // This old app has no controllerchange reload or foreground checker. The new
 // worker must activate on its own, without old code posting an activate message.
 version='9.0.3';await page.evaluate(async()=>{window.oldController=navigator.serviceWorker.controller;await (await navigator.serviceWorker.getRegistration()).update();});
 await page.waitForFunction(()=>navigator.serviceWorker.controller!==window.oldController);
 assert.equal(await page.evaluate(()=>FK.VERSION),legacyVersion);await page.reload();await page.waitForFunction(()=>FK.VERSION==='9.0.3'&&!!FK.updates&&!!FK.friends&&!!FK.current?.());
 await page.waitForFunction(()=>FK.updates.get().status==='current');
 assert.equal(await page.evaluate(async()=>(await navigator.serviceWorker.getRegistration()).updateViaCache),'none');
 async function saved(){assert.equal(await page.evaluate(()=>localStorage.getItem('update-save-sentinel')),'retained');assert.equal(await page.evaluate(()=>FK.settings.get('schrift')),'normal');assert.equal(await page.evaluate(()=>FK.progress.isDone('trace','A')),true);assert.deepEqual(await page.evaluate(()=>FK.store.get('update-sentinel')),{drawing:'retained'});}
 await saved();assert.equal(await page.evaluate(()=>caches.has('unrelated-app-cache')),true);assert.deepEqual(await page.evaluate(async()=>(await caches.keys()).filter(n=>n.includes('abandoned-'))),[],'abandoned waiting downloads removed');
 await page.evaluate(async()=>{await (await caches.open('unrelated-app-cache')).put('cache-probe',new Response('wrong cache'));const name=(await caches.keys()).find(k=>k.startsWith('farbtupf-v9.0.3'));await (await caches.open(name)).put('cache-probe',new Response('own cache'));});
 assert.equal(await page.evaluate(()=>fetch('cache-probe').then(r=>r.text())),'own cache');
 console.log('PASS: legacy installation recovers without new page code; own cache, unrelated caches and local/IndexedDB saves retained.');
 // A first/current registration must not loop, and Settings offers visible feedback.
 const initial=navigations;await page.evaluate(()=>{FK.friendsLibrary.active=true;FK.go('settings');});await page.getByRole('button',{name:'Nach Updates suchen',exact:true}).tap();await page.waitForFunction(()=>FK.updates.get().status==='current');assert.equal(navigations,initial);
 const shots=process.env.FARBTUPF_SHOTS||'/tmp/pwa-updates';fs.mkdirSync(shots,{recursive:true});
 for(const width of [390,1024]){await page.setViewportSize({width,height:width===390?844:900});await page.locator('.ff-update-settings').scrollIntoViewIfNeeded();await page.screenshot({path:shots+'/settings-'+width+'.png',animations:'disabled'});}
 // A release arriving during a partially answered puzzle cannot reload it.
 await seedFromPage(page,reviewServer,['count']);await page.evaluate(()=>{for(let n=0;FK.friends.mail().host!=='squirrel'&&n<11;n++)FK.friends.startLetterSession(3);FK.friends.openLetter();FK.friendsLibrary.visit(FK.friendsLibrary.catalogue().find(g=>g.id==='count'));});await page.getByRole('button',{name:'Marienkäfer markieren',exact:true}).first().tap();
 const partial=await page.evaluate(()=>FK.puzzleRounds.start('count')),inPuzzle=navigations;
 version='9.0.4';await page.evaluate(()=>window.dispatchEvent(new Event('online')));await page.waitForFunction(()=>FK.updates.get().status==='ready');
 assert.equal(navigations,inPuzzle);assert.equal(await page.evaluate(()=>FK.current()),'puzzle');assert.equal(await page.evaluate(()=>FK.VERSION),'9.0.3');assert.deepEqual(await page.evaluate(()=>FK.puzzleRounds.start('count')),partial);
 await page.evaluate(()=>FK.go('settings'));await page.waitForFunction(()=>window.FK?.VERSION==='9.0.4'&&!!FK.current?.());await saved();assert.deepEqual(await page.evaluate(()=>FK.puzzleRounds.start('count')),partial);
 console.log('PASS: update found after startup; puzzle stays untouched until the menu, then one reload preserves partial answers.');
 // Removed drawing routes stay closed, while existing IndexedDB drawings survive upgrades.
 assert.equal(await page.evaluate(()=>['book','color','free','gallery'].some(FK.screenExists)),false);
 const colourKey='retired-colour-fixture';await page.evaluate(async key=>{await FK.store.put(key,{paint:new Blob(['legacy drawing'],{type:'image/png'})});FK.go('settings');FK.ui.modal({title:'Offene Notiz',body:FK.h('textarea',{'aria-label':'Notiz',text:'Entwurf behalten'})});Object.defineProperty(document,'hidden',{configurable:true,get:()=>!!window.hiddenForUpdateTest});window.hiddenForUpdateTest=false;},colourKey);
 const noteNav=navigations;version='9.0.5';await page.evaluate(()=>{const now=Date.now;Date.now=()=>now()+61000;document.dispatchEvent(new Event('visibilitychange'));});await page.waitForFunction(()=>FK.updates.get().status==='ready');assert.equal(navigations,noteNav);assert.equal(await page.getByLabel('Notiz',{exact:true}).inputValue(),'Entwurf behalten');
 await page.evaluate(()=>FK.ui.closeModal());await page.waitForFunction(()=>window.FK?.VERSION==='9.0.5'&&!!FK.current?.());await saved();assert.ok(await page.evaluate(key=>FK.store.get(key).then(r=>r?.paint instanceof Blob),colourKey));
 console.log('PASS: foreground update waits for an open parent dialog; retired drawings survive without drawing routes.');
 await page.evaluate(()=>FK.go('settings'));version='9.0.6';broken=true;await page.getByRole('button',{name:'Nach Updates suchen',exact:true}).tap();await page.waitForFunction(()=>FK.updates.get().status==='error');assert.equal(await page.evaluate(()=>FK.VERSION),'9.0.5');
 await context.setOffline(true);await page.reload();await page.waitForFunction(()=>window.FK?.VERSION==='9.0.5'&&!!FK.current?.());await page.evaluate(()=>FK.go('settings'));await page.getByRole('button',{name:'Nach Updates suchen',exact:true}).tap();assert.match(await page.locator('.ff-update-status').textContent(),/offline/);await saved();assert.ok(await page.evaluate(key=>FK.store.get(key).then(r=>r?.paint instanceof Blob),colourKey));
 assert.deepEqual(errors,[]);console.log('PASS: failed download keeps the working release; offline reload and all saved work survive.');await context.close();
 version='9.0.3';broken=false;
 const first=await browser.newContext({viewport:{width:390,height:844}}),fresh=await first.newPage();await installRemote(first,reviewServer);let freshLoads=0;fresh.on('framenavigated',f=>{if(f===fresh.mainFrame())freshLoads++;});await fresh.goto(base+'/?screen=hub&software=1');await fresh.waitForFunction(()=>!!navigator.serviceWorker.controller&&window.FK?.updates?.get().status==='current'&&!!FK.friends&&!!FK.current?.());assert.equal(freshLoads,1,'first install does not reload');await fresh.evaluate(()=>FK.go('settings'));assert.equal(await fresh.getByRole('button',{name:'Nach Updates suchen',exact:true}).isEnabled(),true);await first.close();console.log('PASS: first install finishes with an enabled update control and no reload loop.');

 // Recovery must escape even a stale bare sw.js URL and keep all saved data.
 version=legacyVersion;const repairContext=await browser.newContext({viewport:{width:390,height:844}}),repairPage=await repairContext.newPage();await installRemote(repairContext,reviewServer);repairPage.on('pageerror',e=>errors.push(e.message));await repairPage.goto(base+'/?screen=hub&software=1');await repairPage.evaluate(()=>navigator.serviceWorker.ready);await repairPage.waitForFunction(()=>!!navigator.serviceWorker.controller);await repairPage.evaluate(async()=>{localStorage.setItem('recovery-sentinel','retained');await FK.store.put('recovery-drawing',{retained:true});});
 version='9.0.4';staleBareWorker=true;await repairPage.evaluate(async()=>{await (await navigator.serviceWorker.getRegistration()).update();});assert.equal(await repairPage.evaluate(()=>FK.VERSION),legacyVersion);
 await repairPage.goto(base+'/update.html');await repairPage.getByRole('link',{name:'Spiel öffnen',exact:true}).waitFor({state:'visible',timeout:60000});assert.match(await repairPage.locator('#status').innerText(),/9\.0\.4/);
 for(const width of [390,1024]){await repairPage.setViewportSize({width,height:width===390?844:900});await repairPage.screenshot({path:shots+'/recovery-'+width+'.png',animations:'disabled'});}
 await repairPage.goto(base+'/?screen=hub&software=1');await repairPage.waitForFunction(()=>window.FK?.VERSION==='9.0.4'&&FK.updates?.get().status==='current'&&!!FK.friends&&!!FK.current?.());assert.match(await repairPage.evaluate(()=>navigator.serviceWorker.controller.scriptURL),/repair=/);assert.equal(await repairPage.evaluate(()=>localStorage.getItem('recovery-sentinel')),'retained');assert.deepEqual(await repairPage.evaluate(()=>FK.store.get('recovery-drawing')),{retained:true});assert.deepEqual(errors,[]);await repairContext.close();console.log('PASS: independent recovery page bypasses a stale updater URL, verifies 9.0.4 and retains saves without another installation.');
 }finally{await browser.close();server.closeAllConnections();await new Promise(resolve=>server.close(resolve));fs.rmSync(legacyRoot,{recursive:true,force:true});}
})().catch(e=>{console.error(e);process.exitCode=1;server.close();});
