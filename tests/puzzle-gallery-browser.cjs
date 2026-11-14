/* Puzzle-Galerie: separate from the Puzzle-Prüfung, lists only signed-off puzzles, filters by friend, and plays
   a round of five tasks without touching the child's saved rounds, letter or usage log. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const BASE=process.env.FARBTUPF_BASE_URL||'http://127.0.0.1:8000',shots=process.env.FARBTUPF_SHOTS||'/tmp/puzzle-gallery';fs.mkdirSync(shots,{recursive:true});
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,headless:true,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 try{
  const page=await (await browser.newContext({viewport:{width:1080,height:810},deviceScaleFactor:1,hasTouch:true,reducedMotion:'reduce'})).newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(BASE+'/?software=1&dev=1');await page.waitForFunction(()=>window.FK?.friends&&FK.current()==='friends',null,{timeout:120000});
  const current=()=>page.evaluate(()=>FK.current()),act=()=>page.locator('.screen:not([hidden])');
  const gate=async()=>{const n=(await page.locator('.gate-task').innerText()).match(/\d+/g).map(Number);await page.locator('.gate-input').fill(String(n[0]*n[1]));await page.getByRole('button',{name:'Öffnen',exact:true}).click();};
  await page.getByRole('button',{name:'Einstellungen für Erwachsene',exact:true}).first().click();await gate();await page.waitForFunction(()=>FK.current()==='settings');
  // nothing signed off yet: the gallery is empty and points to the review
  await page.getByRole('button',{name:'Puzzle-Galerie öffnen',exact:true}).click();await page.waitForFunction(()=>FK.current()==='puzzle-gallery');
  assert.equal(await act().locator('.gallery-puzzle').count(),0);assert.equal(await act().getByRole('button',{name:'Zur Puzzle-Prüfung',exact:true}).count(),1);
  // sign off two puzzles of different friends, as a completed review would (local approvals; no GitHub in dev mode)
  const ids=await page.evaluate(()=>{const games=FK.friendsLibrary.catalogue(),pick=[games.find(g=>g.screen==='puzzle'),games.find(g=>g.screen==='puzzle'&&g.host!==games.find(x=>x.screen==='puzzle').host)];
   for(const g of pick){for(const it of FK.puzzleCatalogue.iterations(g.id)){FK.puzzleReview.seen(g.id,it.id);FK.puzzleReview.decide(g.id,it.id,'approved');}FK.puzzleReview.decide(g.id,null,'approved');}
   return pick.map(g=>({id:g.id,host:g.host,ready:FK.puzzleReview.ready(g.id)}));});
  assert.ok(ids.every(g=>g.ready),'signed off');
  await page.waitForTimeout(300);assert.equal(await act().locator('.gallery-puzzle').count(),2,'only signed-off puzzles');
  await page.screenshot({path:shots+'/gallery-1080.png'});
  // friend filter
  const tab=act().locator('.gallery-friend').nth(1+await page.evaluate(h=>[...new Set(FK.friendsLibrary.catalogue().map(g=>g.host))].indexOf(h),ids[0].host));
  await tab.click();await page.waitForTimeout(200);assert.equal(await act().locator('.gallery-puzzle').count(),1);assert.equal(await act().locator('.gallery-puzzle').getAttribute('data-puzzle'),ids[0].id);
  // play a round of five: nothing is saved for the child, no letter changes
  const before=await page.evaluate(()=>({rounds:localStorage.getItem('farbtupf.puzzles.v1')||localStorage.getItem('farbtupf.puzzles.v1.dev'),mail:JSON.stringify(FK.friends.mail())}));
  await act().locator('.gallery-puzzle').click();await page.waitForFunction(()=>FK.current()==='puzzle');
  const s=await page.evaluate(()=>{const it=document.querySelector('.screen:not([hidden]) .puzzle-progress');return {leaves:document.querySelectorAll('.screen:not([hidden]) .puzzle-progress > *').length,reject:document.querySelectorAll('.screen:not([hidden]) .review-reject').length,back:document.querySelector('.screen:not([hidden]) .btn-back').getAttribute('aria-label')};});
  assert.equal(s.reject,0,'no review controls');assert.equal(s.back,'Zur Puzzle-Galerie');
  for(let round=0;round<5;round++){const tiles=act().locator('[data-answer]');const n=await tiles.count();assert.ok(n>0,'answers in round '+round);let moved=false;
   for(let k=0;k<n&&!moved;k++){await tiles.nth(k).click({force:true});await page.waitForTimeout(200);moved=await page.evaluate(r=>{const leaves=document.querySelectorAll('.screen:not([hidden]) .puzzle-celebration, .screen:not([hidden]) .wb-confetti, .screen:not([hidden]) .is-correct');return leaves.length>0;},round);}
   assert.ok(moved,'round '+round+' solved');await page.waitForTimeout(1900);}
  const after=await page.evaluate(()=>({rounds:localStorage.getItem('farbtupf.puzzles.v1')||localStorage.getItem('farbtupf.puzzles.v1.dev'),mail:JSON.stringify(FK.friends.mail())}));
  assert.deepEqual(after,before,'no saved round and no letter change');
  await act().locator('.btn-back').click();await page.waitForTimeout(300);assert.equal(await current(),'puzzle-gallery');
  await act().locator('.btn-back').click();await page.waitForTimeout(300);assert.equal(await current(),'settings');
  await page.getByRole('button',{name:'Puzzle-Prüfung öffnen',exact:true}).click();await page.waitForFunction(()=>FK.current()==='puzzle-review');assert.equal(await act().locator('.review-puzzle').count(),34,'the review still lists every puzzle');
  assert.deepEqual(errors,[]);console.log('PASS: Puzzle-Galerie lists only signed-off puzzles, filters by friend and plays five tasks without saving; Puzzle-Prüfung is separate.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
