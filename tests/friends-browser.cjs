/* Complete loop through real controls, refresh boundaries, legacy stores and offline relaunch.
   Run with a local server. Software mode changes rendering only, never progress or rewards. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'/opt/codex/cua_node/lib/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const BASE=process.env.FARBTUPF_BASE_URL||'http://127.0.0.1:8000';
const shots=process.env.FARBTUPF_SHOTS||'/tmp/farbtupf-friends';fs.mkdirSync(shots,{recursive:true});
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const errors=[];try{
  const context=await browser.newContext({viewport:{width:1024,height:900},hasTouch:true,reducedMotion:'reduce'}),page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));
  const read=()=>page.evaluate(()=>FK.friends.get());
  const snapshot=async name=>{await page.screenshot({path:shots+'/'+name+'.jpg',type:'jpeg',quality:85});};
  const click=name=>page.getByRole('button',{name,exact:true}).click();
  const ready=()=>page.waitForFunction(()=>window.FK?.current()==='friends'&&!!document.querySelector('[data-place]'),null,{timeout:60000});
  await page.goto(BASE+'/?software=1');await ready();await snapshot('home-1024');
  await page.evaluate(async()=>{localStorage.setItem('farbklecks.progress.v1',JSON.stringify({stars:47,done:{old:1}}));await FK.store.put('free',{testLegacy:true,blob:new Blob(['legacy-drawing'],{type:'text/plain'})});});
  // Real keyboard and map routing, not teleportation.
  await page.locator('[data-place="outside"]').click();assert.equal(await page.locator('.ff-pad,.ff-jump').count(),0);await snapshot('forest-1024');
  await click('Bildkarte');await snapshot('map-1024');await click('Zu Eichhörnchen');await page.locator('.ff-example-banner').waitFor({timeout:60000});await snapshot('demo-1024');await click('Zurück');
  await snapshot('count-1024');await page.setViewportSize({width:390,height:844});await snapshot('count-390');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  const smallTargets=await page.locator('.ff-overlay button').evaluateAll(list=>list.filter(e=>{const r=e.getBoundingClientRect();return r.width<48||r.height<48;}).map(e=>e.getAttribute('aria-label')));assert.deepEqual(smallTargets,[]);
  let r=(await read()).rounds.squirrel,t=r.tasks[r.index];await page.locator('[data-answer="'+t.choices.find(c=>c!==t.answer)+'"]').click();await click('Tipp');const saved=(await read()).rounds.squirrel;
  await page.reload();await ready();await click('Aufgabe mit Eichhörnchen fortsetzen');assert.deepEqual((await read()).rounds.squirrel.tasks,saved.tasks);assert.equal((await read()).rounds.squirrel.attempts.length,1);assert.ok((await read()).rounds.squirrel.support.some(e=>e.kind==='hint'));
  // Sleep/hidden/example intervals do not run the active question clock.
  await click('Beispiel ansehen');let duration=(await read()).rounds.squirrel.activeMilliseconds;await page.waitForTimeout(600);await click('Zurück');assert.equal((await read()).rounds.squirrel.activeMilliseconds,duration);
  await page.setViewportSize({width:1024,height:900});
  async function solve(host){for(let i=0;i<5;i++){const s=await read(),round=s.rounds[host];if(round.index===5)break;const task=round.tasks[round.index];if(round.feedback==='correct'){await page.waitForFunction(h=>FK.friends.get().rounds[h].feedback!=='correct',host);continue;}await page.locator('[data-answer="'+task.answer+'"]').click();if(round.index<4)await page.waitForFunction(({host,index})=>FK.friends.get().rounds[host].index>index,{host,index:round.index},{timeout:10000});}assert.equal((await read()).rounds[host].index,5);}
  await solve('squirrel');assert.equal((await read()).wallet.nuts,3);await snapshot('reward-1024');
  await page.reload();await ready();await click('Aufgabe mit Eichhörnchen fortsetzen');assert.equal((await read()).wallet.nuts,3);await click('Zum Laden');await page.locator('[data-place="apple"]').waitFor({timeout:60000});await snapshot('shop-1024');
  await page.locator('[data-place="apple"]').click();await click('Kaufen');assert.equal((await read()).inventory.apple,1);assert.equal((await read()).wallet.nuts,2);await click('Zurück');
  await click('Deine Tasche');await click('Apfel benutzen');await snapshot('apple-1024');assert.equal((await read()).inventory.apple,0);assert.equal((await read()).animation.item,'apple');const pos=(await read()).world;await page.reload();await ready();assert.equal((await read()).inventory.apple,0);assert.equal((await read()).animation,null);assert.deepEqual((await read()).world,pos);
  const names={bird:'Blaumeise',owl:'Waldkauz',beaver:'Biber',mouse:'Maus'};
  for(const host of ['bird','owl','beaver','mouse']){
   await click('Bildkarte');await click('Zu '+names[host]);await page.locator('.ff-example-banner').waitFor({timeout:60000});await click('Zurück');if(host==='mouse')await snapshot('reading-1024');if(host==='owl')await snapshot('sentence-1024');if(host==='beaver')await snapshot('shape-1024');if(host==='bird')await snapshot('rhyme-1024');
   await solve(host);const resource={bird:'seeds',owl:'feathers',beaver:'logs',mouse:'berries'}[host];assert.equal((await read()).wallet[resource],3);
   await click('Zum Laden');await page.locator('[data-place="apple"]').waitFor({timeout:60000});const item={bird:'leaf',owl:'bath',beaver:'pencils'}[host];if(item){await page.locator('[data-place="'+item+'"]').click();await click('Kaufen');if(host==='bird'||host==='beaver'){assert.equal((await read()).unlocks[item],true);assert.equal(await page.getByRole('button',{name:'Kaufen',exact:true}).count(),0);}await click('Zurück');}
  }
  await click('Deine Tasche');await click('Schaumbad benutzen');await page.waitForTimeout(1000);await snapshot('bath-1024');await click('Animation überspringen');assert.equal((await read()).inventory.bath,0);assert.equal((await read()).animation,null);
  // Free and purchased pages each preserve their own strokes across page changes and reloads.
  await click('Bildkarte');await click('Nach Hause');await page.locator('[data-place="drawing"]').waitFor({timeout:60000});await page.locator('[data-place="drawing"]').click();await click('Meine bisherigen Blätter');
  async function stroke(){const box=await page.locator('.ff-paper').boundingBox();await page.mouse.move(box.x+box.width*.3,box.y+box.height*.5);await page.mouse.down();await page.mouse.move(box.x+box.width*.6,box.y+box.height*.6,{steps:8});await page.mouse.up();}
  await stroke();const free=(await read()).drawings.free;await click('Blatt ausmalen');await stroke();assert.equal((await read()).drawings.leaf.length,1);assert.equal(await page.locator('.ff-palette button').count(),9);await click('Freies Blatt');assert.deepEqual((await read()).drawings.free,free);await snapshot('drawing-1024');await click('Zurück');
  await click('Einstellungen für Erwachsene');const gate=(await page.locator('.gate-task').innerText()).match(/(\d+) × (\d+)/);await page.locator('.gate-ans').filter({hasText:new RegExp('^'+Number(gate[1])*Number(gate[2])+'$')}).click();await page.getByLabel('Musik',{exact:true}).uncheck();await page.getByLabel('Waldgeräusche',{exact:true}).uncheck();await page.getByLabel('Sprache',{exact:true}).uncheck();assert.deepEqual((await read()).settings,{music:false,ambience:false,speech:false});const logDownload=page.waitForEvent('download');await page.getByRole('button',{name:'Protokoll exportieren',exact:true}).click();assert.equal((await logDownload).suggestedFilename(),'waldfreunde-protokoll.json');await click('Zurück');
  await page.evaluate(()=>navigator.serviceWorker.ready);await page.waitForFunction(()=>!!navigator.serviceWorker.controller);await context.setOffline(true);await page.reload();await ready();assert.deepEqual((await read()).drawings.free,free);assert.equal((await read()).drawings.leaf.length,1);assert.equal(JSON.parse(await page.evaluate(()=>localStorage.getItem('farbklecks.progress.v1'))).stars,47);assert.equal(await page.evaluate(async()=>(await FK.store.get('free')).blob.text()),'legacy-drawing');await context.setOffline(false);
  const child=await read();await page.goto(BASE+'/?software=1&dev=1');await ready();await click('Maus direkt öffnen');await click('Zurück');await click('Aufgabe überspringen (Entwicklung)');await page.waitForFunction(()=>FK.friends.get().rounds.mouse.index===1);assert.ok((await read()).rounds.mouse.skipped);await page.goto(BASE+'/?software=1');await ready();assert.deepEqual((await read()).wallet,child.wallet);assert.deepEqual((await read()).completed,child.completed);
  assert.deepEqual(errors,[]);console.log('PASS: five real rounds; exact resume; reward replay; four purchases; apple refresh; bath skip; per-page drawings; legacy IndexedDB; offline relaunch; isolated development skip; 390px targets.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
