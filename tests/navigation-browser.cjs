/* Back buttons always lead out again: den → settings → puzzle review → a puzzle and back, several times,
   must end in the game, never in a loop between settings and the review. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const BASE=process.env.FARBTUPF_BASE_URL||'http://127.0.0.1:8000';
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,headless:true,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 try{
  const page=await (await browser.newContext({viewport:{width:1024,height:768},hasTouch:true,reducedMotion:'reduce'})).newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(BASE+'/?software=1&dev=1');await page.waitForFunction(()=>window.FK?.friends&&FK.current()==='friends',null,{timeout:120000});
  const current=()=>page.evaluate(()=>FK.current());
  const back=async()=>{await page.locator('.screen:not([hidden]) .btn-back').first().click();await page.waitForTimeout(250);};
  const gate=async()=>{const n=(await page.locator('.gate-task').innerText()).match(/\d+/g).map(Number);await page.locator('.gate-input').fill(String(n[0]*n[1]));await page.getByRole('button',{name:'Öffnen',exact:true}).click();};
  const settings=async()=>{await page.getByRole('button',{name:'Einstellungen für Erwachsene',exact:true}).first().click();await gate();await page.waitForFunction(()=>FK.current()==='settings');};
  for(let round=0;round<2;round++){
   await settings();
   // into the review and back, twice, then into a puzzle preview from the review and back
   for(let k=0;k<2;k++){await page.getByRole('button',{name:'Puzzle-Prüfung öffnen',exact:true}).click();await page.waitForFunction(()=>FK.current()==='puzzle-review');await back();assert.equal(await current(),'settings','review back → settings');}
   await page.getByRole('button',{name:'Puzzle-Prüfung öffnen',exact:true}).click();await page.waitForFunction(()=>FK.current()==='puzzle-review');
   const id=await page.evaluate(()=>Object.keys(FK.puzzleCatalogue.meta)[0]),it=await page.evaluate(id=>FK.puzzleCatalogue.iterations(id)[0].id,id);
   assert.ok(await page.evaluate(([id,it])=>FK.puzzleReview.preview(id,it),[id,it]),'preview opens');await page.waitForTimeout(400);assert.notEqual(await current(),'puzzle-review');
   await back();assert.equal(await current(),'puzzle-review','puzzle back → review');
   await back();assert.equal(await current(),'settings','review back → settings');
   await back();assert.equal(await current(),'friends','settings back → the game');
  }
  // the plain way: settings and straight back
  await settings();await back();assert.equal(await current(),'friends');
  assert.deepEqual(errors,[]);console.log('PASS: back buttons lead from settings, the puzzle review and its puzzles out to the game again, without a loop.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
