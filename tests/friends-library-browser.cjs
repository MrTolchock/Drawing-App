/* Restored library: every game, new hosts, fixed level, return paths and full atelier. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'/opt/codex/cua_node/lib/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const BASE=process.env.FARBTUPF_BASE_URL||'http://127.0.0.1:8000';
const shots=process.env.FARBTUPF_SHOTS||'/tmp/farbtupf-library';fs.mkdirSync(shots,{recursive:true});
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 try{
  const context=await browser.newContext({viewport:{width:1024,height:900},reducedMotion:'reduce'}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(BASE+'/?software=1');
  await page.waitForFunction(()=>window.FK?.friends&&FK.current()==='friends');
  const click=name=>page.getByRole('button',{name,exact:true}).first().click();
  const snapshot=async name=>{await page.waitForTimeout(350);await page.screenshot({path:shots+'/'+name+'.png',animations:'disabled'});};
  const back=()=>page.locator('.screen:not([hidden]) .btn-back').click();
  const home=async()=>{if(await page.evaluate(()=>FK.friendsView().area)==='forest'){await click('Bildkarte');await click('Nach Hause');await page.waitForFunction(()=>document.querySelector('.ff-game')?.dataset.area==='den',null,{timeout:60000});}};
  assert.equal(await page.locator('.ff-nav [aria-label="Einstellungen für Erwachsene"] .ff-ui-art').getAttribute('data-icon'),'gear');
  await page.evaluate(()=>{FK.settings.set('learning.stage',3);FK.settings.set('read.lvl',3);FK.settings.set('dots.level',3);});
  await click('Waldspiele');
  assert.equal(await page.locator('.forest-book-game').count(),30);
  assert.equal(await page.getByText('Spiele aus dem Wald',{exact:true}).count(),0);
  assert.equal(await page.locator('.forest-book-body > .forest-book-games > .forest-book-game').count(),30);
  assert.equal(await page.locator('.forest-book-body').innerText().then(text=>/\b(?:null|undefined)\b/.test(text)),false);
  assert.equal(await page.locator('.forest-book-body img,.forest-book-games .wa-symbol').count(),0);
  assert.equal(await page.locator('.forest-book-game > span > .wa-illustration').count(),30);
  for(const id of ['neighbours','mirror'])assert.match(await page.locator('[data-game="'+id+'"] > span > .wa-illustration').getAttribute('style'),/menu\.webp/);
  assert.equal(await page.locator('.island-levels').count(),0);
  await snapshot('library-1024');
  const catalogue=await page.evaluate(()=>FK.friendsLibrary.catalogue());assert.equal(catalogue.length,28);
  for(const g of catalogue){
   await page.locator('[data-game="'+g.id+'"]').click();
   assert.equal(await page.evaluate(()=>FK.current()),g.screen,g.id);
   assert.equal(await page.evaluate(()=>FK.learning.stage()),1);
   if(['learn','adventure','expedition'].includes(g.screen))assert.match(await page.locator('.screen:not([hidden]) .play-context').innerText(),new RegExp(await page.evaluate(id=>FriendsContent.hosts[id].name,g.host)));
   assert.equal(await page.locator('.screen:not([hidden]) [aria-label^="Stufe"]:visible').count(),0,g.id);
   await back();assert.equal(await page.evaluate(()=>FK.current()),'forest-book',g.id);
  }
  for(const host of ['squirrel','bird','owl','beaver','mouse']){
   const name=await page.evaluate(id=>FriendsContent.hosts[id].name,host);
   await click('Mit '+name+' spielen');
   const ids=await page.locator('.forest-book-game').evaluateAll(bs=>bs.map(b=>b.dataset.game));
   assert.deepEqual(ids,catalogue.filter(g=>g.host===host).map(g=>g.id));
   await page.locator('[data-game="friends-'+host+'"]').click();
   assert.equal(await page.locator('.screen-puzzle .puzzle-scene').count(),1);
   await snapshot('round-'+host);await back();
  }
  // Completion must stay inside v2, without raising the difficulty or advancing a legacy tour.
  await page.evaluate(()=>FK.friendsLibrary.launch(FK.friendsLibrary.catalogue().find(g=>g.id==='count'),'friends'));
  for(let i=0;i<5;i++){
   const n=await page.evaluate(()=>{const s=FK.puzzleRounds.start('count');return FK.puzzleRounds.question('count',s.round,s.seed).answer;});
   await page.locator('.screen-puzzle [data-answer="'+n+'"]').click();
   if(i<4)await page.waitForFunction(n=>document.querySelector('.screen-puzzle .puzzle-round')?.textContent===n+' / 5',i+2);
  }
  await page.waitForFunction(()=>FK.current()==='friends');
  assert.equal(await page.locator('.play-finish').count(),0);
  assert.equal(await page.evaluate(()=>FK.progress.stars()),0);
  await click('Waldspiele');await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>FK.current()),'friends');
  await home();await page.locator('[data-place="drawing"]').click();assert.equal(await page.evaluate(()=>FK.current()),'book');await back();await click('Waldspiele');await click('Malatelier');
  assert.equal(await page.locator('.play-library-intro h2').innerText(),'Dein Malatelier');
  const atelierIds=()=>page.locator('.forest-book-game').evaluateAll(bs=>bs.map(b=>b.dataset.game));
  assert.deepEqual(await atelierIds(),['book','gallery']);
  assert.equal(await page.locator('.forest-book-body').innerText().then(text=>/\b(?:null|undefined)\b/.test(text)),false);
  await snapshot('atelier-menu-1024');
  // Preserved vector drawings do not bring back the removed shortcut.
  const strokes=[{colour:'#73955b',points:[[.3,.4],[.7,.6]]}];
  await page.evaluate(strokes=>{FK.friends.draw('free',strokes);FK.go('forest-book',{resident:'atelier'});},strokes);
  assert.deepEqual(await atelierIds(),['book','gallery']);
  assert.deepEqual(await page.evaluate(()=>FK.friends.get().drawings.free),strokes);
  // The legacy free editor still opens directly and preserves existing pictures.
  await page.evaluate(()=>FK.go('free'));await page.waitForFunction(()=>document.querySelector('.screen-free .paper canvas')?.width>0);
  for(const label of ['Stift','Eimer','Gummi','Grösse','Spiegel','Neu','Speichern'])assert.equal(await page.getByRole('button',{name:label,exact:true}).isVisible(),true,label);
  await snapshot('atelier-1024');
  const paper=page.locator('.screen-free .paper'),box=await paper.boundingBox();
  await page.mouse.move(box.x+box.width*.3,box.y+box.height*.4);await page.mouse.down();await page.mouse.move(box.x+box.width*.7,box.y+box.height*.7,{steps:30});await page.mouse.up();
  for(let i=0;i<40;i++){if(await page.evaluate(async()=>!!(await FK.store.get('free'))?.paint))break;await page.waitForTimeout(250);}
  const before=await page.evaluate(async()=>{const s=await FK.store.get('free');return {gid:s.gid,size:s.paint.size};});assert.ok(before.size>0);
  await back();await click('Ausmalen');assert.ok(await page.locator('.book-card').count()>0);await back();await back();
  assert.equal(await page.evaluate(()=>FK.current()),'friends');
  await page.reload();await page.waitForFunction(()=>window.FK?.friends);await home();await click('Waldspiele');await click('Malatelier');await page.evaluate(()=>FK.go('free'));
  assert.deepEqual(await page.evaluate(async()=>{const s=await FK.store.get('free');return {gid:s.gid,size:s.paint.size};}),before);
  await back();await back();await click('Waldspiele');await page.setViewportSize({width:390,height:844});await snapshot('library-390');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await click('Mit Maus spielen');await page.locator('[data-game="friends-mouse"]').click();assert.equal(await page.evaluate(()=>FK.current()),'friends');assert.equal(await page.locator('.ff-task-scene').isVisible(),true);await snapshot('reading-390');await click('Zurück');
  await home();await click('Waldspiele');await click('Malatelier');await snapshot('atelier-menu-390');assert.deepEqual(await atelierIds(),['book','gallery']);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.evaluate(()=>FK.go('free'));await snapshot('atelier-390');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  // The menu's painted assets also load after an offline restart.
  await page.evaluate(()=>navigator.serviceWorker.ready);await page.waitForFunction(()=>!!navigator.serviceWorker.controller);await context.setOffline(true);
  await page.reload();await page.waitForFunction(()=>window.FK?.friends);await click('Waldspiele');
  assert.equal(await page.locator('.forest-book-game').count(),30);
  assert.ok(await page.evaluate(async()=>{const im=new Image();im.src='assets/waldatelier/menu.webp';await im.decode();return im.naturalWidth>0;}));
  assert.deepEqual(await page.evaluate(()=>FK.friends.get().drawings.free),strokes);
  await context.setOffline(false);
  // Original bookmarks retain their settings; v2 never rewrites their difficulty.
  await page.goto(BASE+'/?screen=hub');assert.equal(await page.locator('.island-levels').count(),1);assert.equal(await page.evaluate(()=>FK.learning.stage()),3);assert.equal(await page.evaluate(()=>FK.settings.get('read.lvl')),3);assert.equal(await page.evaluate(()=>FK.settings.get('dots.level')),3);
  await click('Malatelier');assert.deepEqual(await atelierIds(),['book','gallery','album']);assert.equal(await page.locator('.forest-book-body').innerText().then(text=>/\b(?:null|undefined)\b/.test(text)),false);
  assert.deepEqual(errors,[]);console.log('PASS: 24 catalogue games, 5 new rounds, all host filters, fixed level, currency-free completion, v2 returns, painted settings icon, full atelier tools and drawing persistence, phone layouts, legacy settings.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
