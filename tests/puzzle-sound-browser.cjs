/* Puzzle answers keep working when iOS stops the game sound (a system menu, Control Center, the app switcher,
   a call): the context is closed, its clock stands still while it says "running", it stays suspended although a
   tap asks it to resume, or Web Audio throws. The right answer still advances, and the next tap brings sound back. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict');
const base=process.env.FARBTUPF_BASE_URL||'http://127.0.0.1:8000';
(async()=>{
 const browser=await chromium.launch({...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
  const context=await browser.newContext({viewport:{width:1080,height:810},hasTouch:true,reducedMotion:'reduce',serviceWorkers:'block'}),page=await context.newPage(),errors=[];
  page.setDefaultTimeout(30000);page.on('pageerror',e=>errors.push(e.message));
  await context.route('**/js/friends/game.js',r=>r.fulfill({contentType:'application/javascript',body:'// Isolated puzzle fixture.'}));
  await context.addInitScript(()=>{const Native=window.AudioContext;window.soundContexts=[];window.AudioContext=class extends Native{constructor(...args){super(...args);soundContexts.push(this);}};});
  await page.goto(base+'/');await page.waitForFunction(()=>!!window.FK?.puzzleRounds);
  await page.evaluate(()=>{
   FK.settings.set('sound',true);FK.friends={record(){},mail:()=>({host:'owl'}),flushLog(){}};
   FK.friendsLibrary.canPlay=()=>true;FK.puzzleReview.ready=()=>true;FK.puzzleRounds.clear('add');FK.go('puzzle',{game:'add'});
  });
  const active=page.locator('.screen:not([hidden])'),round=()=>active.locator('.puzzle-progress').getAttribute('aria-label');   // child play: five leaves, no task number
  const latest=()=>page.evaluate(()=>({count:soundContexts.length,state:soundContexts.at(-1)?.state}));
  await active.locator('.puzzle-answer').first().waitFor();
  await active.locator('.puzzle-prompt').tap();await page.evaluate(()=>FK.sound.tick());
  await page.waitForFunction(()=>soundContexts.length===1&&soundContexts[0].state==='running');
  async function answer(){
   const before=await round(),value=await page.evaluate(()=>String(FK.puzzleRounds.current(FK.puzzleRounds.start('add')).answer));
   await active.locator('.puzzle-answer[data-answer="'+value+'"]').tap();
   await page.waitForFunction(text=>document.querySelector('.screen:not([hidden]) .puzzle-progress')?.getAttribute('aria-label')!==text,before);
  }
  // Closed: the tap on the right answer submits it and builds a new context that plays.
  await page.evaluate(()=>soundContexts[0].close());await page.waitForFunction(()=>soundContexts[0].state==='closed');
  await answer();assert.deepEqual(await latest(),{count:2,state:'running'});console.log('PASS a closed sound context neither blocks the answer nor stays silent');
  // WebKit after an interruption: "running", but the clock stands still.
  await page.evaluate(()=>{const c=soundContexts.at(-1),t=c.currentTime;Object.defineProperty(c,'currentTime',{get:()=>t});FK.sound.tick();});
  await page.waitForTimeout(1700);await answer();assert.deepEqual(await latest(),{count:3,state:'running'});console.log('PASS a stalled sound context is replaced on the next tap');
  // Suspended for good: resume() never settles. A tap two seconds after the first attempt replaces it.
  await page.evaluate(()=>{const c=soundContexts.at(-1);Object.defineProperty(c,'state',{get:()=>'suspended'});c.resume=()=>new Promise(()=>{});});
  await answer();assert.equal((await latest()).count,3,'the first tap only asks the context to resume');
  await page.waitForTimeout(2100);await active.locator('.puzzle-prompt').tap();assert.deepEqual(await latest(),{count:4,state:'running'});console.log('PASS a context that never resumes is replaced');
  // Web Audio throws: sound is feedback only, the answer still counts.
  await page.evaluate(()=>{window.createOscillator=AudioContext.prototype.createOscillator;AudioContext.prototype.createOscillator=()=>{throw new Error('InvalidStateError');};});
  await answer();await page.evaluate(()=>{AudioContext.prototype.createOscillator=window.createOscillator;});console.log('PASS a failing sound never blocks an answer');
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
