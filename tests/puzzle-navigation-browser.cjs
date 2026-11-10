/* Real Forest friends integration: immediate celebration exits, courier staging and reload. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'/opt/codex/cua_node/lib/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-angle=swiftshader','--enable-unsafe-swiftshader']});try{
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,reducedMotion:'reduce'}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(60000);
 const ready=()=>page.waitForFunction(()=>!!window.FK?.friendsView&&FK.current()==='friends',null,{timeout:60000});
 await page.goto((process.env.FARBTUPF_BASE_URL||'http://127.0.0.1:8000')+'/?software=1',{waitUntil:'domcontentloaded'});await ready();
 await page.getByRole('button',{name:'Brief öffnen',exact:true}).tap();await page.getByRole('button',{name:'Zum Freund gehen',exact:true}).tap();
 await page.evaluate(()=>FK.friendsStartRound('squirrel'));
 for(let round=0;round<5;round++){
  const answer=await page.evaluate(()=>{const r=FK.friends.round('squirrel');return r.tasks[r.index].answer;});
  await page.locator('.screen-puzzle [data-answer="'+answer+'"]').tap();
  if(round<4)await page.waitForFunction(n=>document.querySelector('.screen-puzzle .puzzle-round')?.textContent===n+' / 5',round+2);
 }
 await page.locator('.puzzle-completion').waitFor({state:'visible'});await page.locator('.screen-puzzle .btn-back').tap();
 assert.equal(await page.evaluate(()=>FK.current()),'friends');assert.equal(await page.evaluate(()=>FK.friends.round('squirrel')),null);
 async function courier(){const state=await page.evaluate(()=>({mail:FK.friends.mail(),view:FK.friendsView()}));assert.equal(state.mail.phase,'to-mailman');assert.equal(state.view.mailTarget,'mailman');assert.ok(Math.hypot(state.view.position.x-state.view.mailman.x,state.view.position.z-state.view.mailman.z)<3.3);}
 await courier();
 await page.evaluate(()=>{FK.friends.openLetter();FK.friendsLibrary.launch(FK.friendsLibrary.catalogue().find(g=>g.id==='syllable'),'friends');});
 for(let round=0;round<5;round++){
  const answer=await page.evaluate(()=>{const s=FK.puzzleRounds.start('syllable');return FK.puzzleRounds.question('syllable',s.round,s.seed).answer;});
  await page.locator('.screen-puzzle [data-answer="'+answer+'"]').tap();
  if(round<4)await page.waitForFunction(n=>document.querySelector('.screen-puzzle .puzzle-round')?.textContent===n+' / 5',round+2);
 }
 await page.locator('.puzzle-completion').waitFor({state:'visible'});await page.locator('.screen-puzzle .btn-back').tap();await courier();assert.equal(await page.evaluate(()=>FK.puzzleRounds.pending('syllable')),false);
 await page.reload({waitUntil:'domcontentloaded'});await ready();await courier();
 await page.evaluate(()=>FK.go('forest-book',{from:'friends'}));await page.locator('.forest-book-game[data-game="friends-bird"]').tap();await page.locator('.screen-puzzle .btn-back').tap();assert.equal(await page.evaluate(()=>FK.current()),'forest-book');
 await page.locator('.forest-book-game[data-game="trace-numbers"]').tap();await page.locator('.screen-trace .btn-back').tap();assert.equal(await page.evaluate(()=>FK.current()),'forest-book');
 await page.evaluate(()=>navigator.serviceWorker.ready);await page.waitForFunction(()=>!!navigator.serviceWorker.controller);await context.setOffline(true);await page.reload({waitUntil:'domcontentloaded'});await ready();await courier();
 await page.evaluate(()=>FK.go('forest-book',{from:'friends'}));await page.locator('.forest-book-game[data-game="read-colours"]').tap();assert.match(await page.locator('.puzzle-answer .wa-illustration').first().getAttribute('style'),/puzzle-flowers/);
 assert.deepEqual(errors,[]);console.log('PASS: real world; original and generated five-task completions; immediate celebration exit; nearby courier; reload/offline handover; original and digit-puzzle menu return.');
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
