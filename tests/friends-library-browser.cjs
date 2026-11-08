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
  assert.equal(await page.locator('.ff-nav [aria-label="Einstellungen für Erwachsene"] use').getAttribute('href'),'#i-gear');
  await page.evaluate(()=>{FK.settings.set('learning.stage',3);FK.settings.set('read.lvl',3);FK.settings.set('dots.level',3);});
  await click('Waldspiele');
  assert.equal(await page.locator('.forest-book-game').count(),30);
  assert.equal(await page.locator('.island-levels').count(),0);
  await snapshot('library-1024');
  const catalogue=await page.evaluate(()=>FK.friendsLibrary.catalogue());assert.equal(catalogue.length,21);
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
   assert.deepEqual(ids,['friends-'+host,...catalogue.filter(g=>g.host===host).map(g=>g.id)]);
   await page.locator('[data-game="friends-'+host+'"]').click();await click('Zurück');
   assert.equal(await page.locator('.ff-task-scene').count(),1);
   await snapshot('round-'+host);
   await click('Zurück');await click('Waldspiele');
  }
  // Completion must stay inside v2, without raising the difficulty or advancing a legacy tour.
  await page.evaluate(()=>FK.go('learn',{game:'count'}));
  for(let i=0;i<5;i++){
   const bugs=page.locator('.screen-learn .learn-bug'),n=await bugs.count();
   for(const bug of await bugs.all())await bug.click();
   await page.locator('.screen-learn [data-answer="'+n+'"]').click();await page.locator('.screen-learn .learn-next').click();
  }
  assert.equal(await page.locator('.play-finish').count(),0);
  assert.equal(await page.evaluate(()=>FK.current()),'friends');
  assert.equal(await page.evaluate(()=>FK.progress.stars()),0);
  await click('Waldspiele');await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>FK.current()),'friends');
  await home();await page.locator('[data-place="drawing"]').click();
  assert.equal(await page.locator('.play-library-intro h2').innerText(),'Dein Malatelier');
  await click('Freies Malen');await page.waitForFunction(()=>document.querySelector('.screen-free .paper canvas')?.width>0);
  for(const label of ['Stift','Stempel','Eimer','Gummi','Grösse','Spiegel','Neu','Speichern'])assert.equal(await page.getByRole('button',{name:label,exact:true}).isVisible(),true,label);
  await snapshot('atelier-1024');
  const paper=page.locator('.screen-free .paper'),box=await paper.boundingBox();
  await page.mouse.move(box.x+box.width*.3,box.y+box.height*.4);await page.mouse.down();await page.mouse.move(box.x+box.width*.7,box.y+box.height*.7,{steps:30});await page.mouse.up();
  for(let i=0;i<40;i++){if(await page.evaluate(async()=>!!(await FK.store.get('free'))?.paint))break;await page.waitForTimeout(250);}
  const before=await page.evaluate(async()=>{const s=await FK.store.get('free');return {gid:s.gid,size:s.paint.size};});assert.ok(before.size>0);
  await back();await click('Ausmalen');assert.ok(await page.locator('.book-card').count()>0);await back();await back();
  assert.equal(await page.evaluate(()=>FK.current()),'friends');
  await page.reload();await page.waitForFunction(()=>window.FK?.friends);await home();await page.locator('[data-place="drawing"]').click();await click('Freies Malen');
  assert.deepEqual(await page.evaluate(async()=>{const s=await FK.store.get('free');return {gid:s.gid,size:s.paint.size};}),before);
  await back();await back();await click('Waldspiele');await page.setViewportSize({width:390,height:844});await snapshot('library-390');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await click('Mit Maus spielen');await page.locator('[data-game="friends-mouse"]').click();assert.equal(await page.evaluate(()=>FK.current()),'friends');assert.equal(await page.locator('.ff-task-scene').isVisible(),true);await snapshot('reading-390');await click('Zurück');
  await home();await home();await page.locator('[data-place="drawing"]').click();await click('Freies Malen');await snapshot('atelier-390');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  // Original bookmarks retain their settings; v2 never rewrites their difficulty.
  await page.goto(BASE+'/?screen=hub');assert.equal(await page.locator('.island-levels').count(),1);assert.equal(await page.evaluate(()=>FK.learning.stage()),3);assert.equal(await page.evaluate(()=>FK.settings.get('read.lvl')),3);assert.equal(await page.evaluate(()=>FK.settings.get('dots.level')),3);
  assert.deepEqual(errors,[]);console.log('PASS: 21 restored games, 5 new rounds, all host filters, fixed level, currency-free completion, v2 returns, original gear, full atelier tools and drawing persistence, phone layouts, legacy settings.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
