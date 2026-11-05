const { chromium } = require('/opt/codex/cua_node/lib/node_modules/playwright');
const assert = require('node:assert/strict');
(async () => {
 const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const context = await browser.newContext({viewport:{width:820,height:1180},hasTouch:true});
 const page = await context.newPage(); const errors=[]; page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8000/?screen=hub');
 await page.evaluate(async()=>{await navigator.serviceWorker.ready;});
 await page.reload();
 await page.evaluate(()=>{const make=FK.learning.question; FK.learning.question=(...args)=>{const q=make(...args); window.testQuestion=q; return q;};});
 for(let stage=1;stage<=3;stage++) for(const game of ['count','add','pattern','nature']) {
  await page.evaluate(({stage,game})=>{FK.settings.set('learning.stage',stage);FK.go('learn',{game});},{stage,game});
  for(let round=0;round<5;round++) {
   const q=await page.evaluate(()=>window.testQuestion);
   const stars=await page.evaluate(()=>FK.progress.stars());
   if(round===0) {
    const wrong=q.choices.find(v=>v!==q.answer);
    await page.getByRole('button',{name:String(wrong),exact:true}).tap();
    assert.equal(await page.evaluate(()=>FK.progress.stars()),stars);
    assert.equal(await page.locator('.learn-next').isVisible(),false);
   }
   await page.getByRole('button',{name:String(q.answer),exact:true}).tap();
   await page.locator('.learn-next').tap();
  }
  assert.match(await page.locator('.learn-finish').innerText(),/Fünf Aufgaben/);
 }
 assert.equal(await page.evaluate(()=>FK.progress.doneCount('learn')),12);
 assert.equal(await page.evaluate(()=>FK.progress.stars()),12);
 // Replaying never farms stars.
 await page.evaluate(()=>FK.go('learn',{game:'count'}));
 for(let i=0;i<5;i++){const a=await page.evaluate(()=>String(window.testQuestion.answer));await page.getByRole('button',{name:a,exact:true}).tap();await page.locator('.learn-next').tap();}
 assert.equal(await page.evaluate(()=>FK.progress.stars()),12);
 for(const stage of [1,2,3]) {
  await page.evaluate(stage=>{FK.settings.set('learning.stage',stage);FK.go('hub');},stage);
  await page.getByRole('button',{name:/Schreibspuren/}).tap();
  assert.ok(await page.locator('.tr-tile').count()>0);
  await page.locator('.tr-tile').first().tap();
  assert.equal(await page.locator('.tr-paper').isVisible(),true);
  await page.evaluate(()=>FK.go('hub'));
  await page.getByRole('button',{name:/Leseschatz/}).tap();
  assert.equal(await page.locator('.rd-lvl.on').getAttribute('aria-label'),'Stufe '+stage);
  await page.evaluate(()=>FK.go('hub'));
  await page.getByRole('button',{name:/Zahlenwege/}).tap();
  assert.equal(await page.locator('.pp-tab.on').getAttribute('aria-label'),'Stufe '+stage);
 }
 const letterCounts=[];
 for(const level of [1,2,3]) {
  await page.evaluate(level=>FK.go('read',{lvl:level}),level);
  await page.getByRole('button',{name:'Silben-Ballone',exact:true}).tap();
  letterCounts.push(await page.locator('.rd-letter:not(.rd-letter-rnd)').count());
  await page.evaluate(level=>FK.go('read',{lvl:level}),level);
  await page.getByRole('button',{name:'Lies genau',exact:true}).tap();
  assert.ok(await page.locator('.rd-genau').isVisible());
 }
 assert.ok(letterCounts[0]<letterCounts[1] && letterCounts[1]<letterCounts[2]);
 await page.evaluate(()=>FK.go('trace',{stage:1,glyph:'I'}));
 await page.waitForTimeout(400);
 const points=await page.locator('.tr-track path').first().evaluate(path=>{
  const length=path.getTotalLength(), matrix=path.getScreenCTM();
  return Array.from({length:101},(_,i)=>{const p=path.getPointAtLength(length*i/100).matrixTransform(matrix);return {x:p.x,y:p.y};});
 });
 const cdp=await context.newCDPSession(page);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[points[0]]});
 for(const p of points.slice(1)) await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[p]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 await page.waitForTimeout(900);
 assert.equal(await page.evaluate(()=>FK.progress.isDone('trace','I')),true);
 await page.evaluate(()=>FK.go('hub'));
 await page.waitForTimeout(400);
 await page.screenshot({path:'/tmp/farbtupf-tablet.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});
 await page.screenshot({path:'/tmp/farbtupf-phone.png',fullPage:true});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await context.setOffline(true); await page.reload();
 assert.equal(await page.title(),'Farbtupf');
 await page.getByRole('button',{name:/Musterzug/}).tap();
 assert.equal(await page.locator('.learn-answer').count(),3);
 assert.equal(await page.evaluate(()=>FK.progress.stars()),13);
 assert.deepEqual(errors,[]);
 console.log('PASS: 12 touch rounds (60 tasks), wrong-answer feedback, replay rewards, three-stage routing and reading progression, finger tracing, tablet/phone layout, offline reload, saved progress, no browser exceptions.');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
