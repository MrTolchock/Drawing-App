/* Back buttons always lead out again: den → settings → puzzle review → a puzzle and back, several times,
   must end in the game, never in a loop between settings and the review. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs'),{installRemote}=require('./review-repository-support.cjs');
const BASE=process.env.FARBTUPF_BASE_URL||'http://127.0.0.1:8000';
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,headless:true,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 try{
  const context=await browser.newContext({viewport:{width:1024,height:768},hasTouch:true,reducedMotion:'reduce',serviceWorkers:'block'});await installRemote(context);const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(60000);
  await page.goto(BASE+'/?software=1&dev=1');await page.waitForFunction(()=>window.FK?.friendsView&&FK.current()==='friends',null,{timeout:120000});
  const current=()=>page.evaluate(()=>FK.current());
  const appearance=button=>button.evaluate(n=>{const s=getComputedStyle(n),icon=n.querySelector('[data-hud="back"]'),i=icon&&getComputedStyle(icon);return {width:s.width,height:s.height,background:s.background,border:s.border,borderRadius:s.borderRadius,boxShadow:s.boxShadow,icon:i&&{width:i.width,height:i.height,image:i.backgroundImage,position:i.backgroundPosition,filter:i.filter}};});
  await page.getByRole('button',{name:'Dein Brief',exact:true}).click();await page.getByRole('button',{name:'Zum Freund gehen',exact:true}).click();
  await page.getByRole('button',{name:'Bildkarte',exact:true}).click();const mapBack=page.locator('.screen:not([hidden]) .ff-card-top').getByRole('button',{name:'Zurück',exact:true}),reference=await appearance(mapBack);assert.ok(parseFloat(reference.width)>=48);assert.match(reference.icon.image,/assets\/interface\/navigation.webp/);assert.equal(reference.icon.filter,'none');await mapBack.click();
  const checked=[];
  const back=async()=>{const button=page.locator('.screen:not([hidden]) .btn-back').first();assert.deepEqual(await appearance(button),reference,'same drawn arrow and frame in '+await current());checked.push(await current());await button.click();await page.waitForTimeout(250);};
  const gate=async()=>{const n=(await page.locator('.gate-task').innerText()).match(/\d+/g).map(Number);await page.locator('.gate-input').fill(String(n[0]*n[1]));await page.getByRole('button',{name:'Öffnen',exact:true}).click();};
  const settings=async()=>{await page.getByRole('button',{name:'Einstellungen für Erwachsene',exact:true}).first().click();await gate();await page.waitForFunction(()=>FK.current()==='settings');};
  for(let round=0;round<2;round++){
   await settings();
   // into the review and back, twice, then into a puzzle preview from the review and back
   for(let k=0;k<2;k++){await page.getByRole('button',{name:'Puzzle-Prüfung öffnen',exact:true}).click();await page.waitForFunction(()=>FK.current()==='puzzle-review');await back();assert.equal(await current(),'settings','review back → settings');}
   await page.getByRole('button',{name:'Puzzle-Prüfung öffnen',exact:true}).click();await page.waitForFunction(()=>FK.current()==='puzzle-review');
   const id=round===0?'friends-squirrel':'trace',it=await page.evaluate(id=>FK.puzzleCatalogue.iterations(id)[0].id,id);
   assert.ok(await page.evaluate(([id,it])=>FK.puzzleReview.preview(id,it),[id,it]),'preview opens');await page.waitForTimeout(400);assert.notEqual(await current(),'puzzle-review');
   await back();assert.equal(await current(),'puzzle-review','puzzle back → review');
   await back();assert.equal(await current(),'settings','review back → settings');
   await back();assert.equal(await current(),'friends','settings back → the game');
  }
  await settings();await page.getByRole('button',{name:'Puzzle-Galerie öffnen',exact:true}).click();await page.waitForFunction(()=>FK.current()==='puzzle-gallery');await back();assert.equal(await current(),'settings');await back();assert.equal(await current(),'friends');
  // the plain way: settings and straight back
  await settings();await back();assert.equal(await current(),'friends');
  await page.setViewportSize({width:390,height:844});await settings();const mobile=page.locator('.screen:not([hidden]) .btn-back');assert.deepEqual(await appearance(mobile),reference);await mobile.focus();await page.keyboard.press('Enter');await page.waitForFunction(()=>FK.current()==='friends');
  if(process.env.FARBTUPF_SHOTS){fs.mkdirSync(process.env.FARBTUPF_SHOTS,{recursive:true});fs.writeFileSync(process.env.FARBTUPF_SHOTS+'/navigation-report.json',JSON.stringify({reference,checkedScreens:[...new Set(checked)],phone:true,keyboard:true},null,2)+'\n');}
  assert.deepEqual(errors,[]);console.log('PASS: map, Settings, gallery, review, puzzle and handwriting backs share the same drawn arrow/frame and return without loops; phone and keyboard navigation work.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
