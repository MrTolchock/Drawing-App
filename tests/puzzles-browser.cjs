/* Direct woodland catalogue, real reading rounds and touch-only paint confirmation. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'/opt/codex/cua_node/lib/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const base=process.env.FARBTUPF_BASE_URL||'http://127.0.0.1:8000',shots=process.env.FARBTUPF_SHOTS||'/tmp/forest-puzzles';fs.mkdirSync(shots,{recursive:true});
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-angle=swiftshader','--enable-unsafe-swiftshader']});try{
 const page=await browser.newPage({viewport:{width:1024,height:900},hasTouch:true,reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const click=name=>page.getByRole('button',{name,exact:true}).first().click();
 const ready=()=>page.waitForFunction(()=>!!window.FK?.friendsView);
 const snapshot=async name=>{await page.waitForTimeout(180);await page.screenshot({path:shots+'/'+name+'.png',animations:'disabled'});};
 await page.goto(base+'/?software=1');await ready();await page.evaluate(()=>Promise.all([FK.visual.ready,document.fonts.ready]));
 for(const width of process.env.FARBTUPF_READING_ONLY?[]:[1024,390]){
  await page.setViewportSize({width,height:width===390?844:900});await page.waitForTimeout(200);
  const standing=await page.evaluate(()=>FK.friendsView().foxBounds);const book=await page.locator('[data-place="games"]').boundingBox();assert.ok(book.y>85,'book has space above it');
  await page.locator('[data-place="sleep"]').click();await page.waitForTimeout(100);const sleep=await page.evaluate(()=>FK.friendsView().sleepBounds);
  assert.ok(sleep.width>standing.height*.6&&sleep.width<standing.height*1.15,JSON.stringify({standing,sleep}));assert.ok(sleep.x>=0&&sleep.x+sleep.width<=width+2,'whole fox remains visible');await snapshot('sleep-'+width);await click('Animation überspringen');
 }
 await page.setViewportSize({width:390,height:844});await click('Brief öffnen');assert.equal(await page.locator('.ff-overlay button').count(),1);assert.equal(await page.locator('.ff-overlay .ff-card,.ff-letter-go').count(),0);await snapshot('postcard-390');await page.locator('.ff-letter-paper').press('Enter');assert.equal(await page.evaluate(()=>FK.friendsView().area),'forest');
 await page.evaluate(()=>FK.go('forest-book',{from:'friends'}));const entries=await page.evaluate(()=>FK.friendsLibrary.catalogue());assert.equal(entries.length,24);
 assert.equal(await page.getByRole('button',{name:'Leseschatz',exact:true}).count(),0);
 for(const width of process.env.FARBTUPF_READING_ONLY?[]:[1024,390]){
  await page.setViewportSize({width,height:width===390?844:900});
  for(const entry of entries){
   await page.locator('[data-game="'+entry.id+'"]').click();assert.equal(await page.evaluate(()=>FK.current()),entry.screen,entry.id);
   const screen=page.locator('.screen:not([hidden])');assert.match(await screen.evaluate(el=>getComputedStyle(el).backgroundImage),/puzzle-clearing/,entry.id);
   if(entry.screen==='read')assert.equal(await page.locator('.rd-tiles').count(),0,'no nested reading menu');
   const overflow=await screen.evaluate(el=>el.scrollWidth>el.clientWidth+2);assert.equal(overflow,false,entry.id+' at '+width);
   const body=screen.locator('.learn-body');if(await body.count())assert.equal(await body.evaluate(el=>el.scrollWidth>el.clientWidth+2),false,entry.id+' paper at '+width);
   await snapshot(entry.id+'-'+width);await screen.locator('.btn-back').click();assert.equal(await page.evaluate(()=>FK.current()),'forest-book',entry.id);
  }
 }
 // All four former Leseschatz activities finish as independent mouse puzzles.
 await page.setViewportSize({width:1024,height:900});
 await page.locator('[data-game="read-puzzle"]').click();
 for(let round=0;round<5;round++){
  const old=await page.locator('.rd-slot').first().elementHandle();const parts=await page.locator('.rd-slot-txt').allTextContents();
  for(const part of parts){const chips=page.locator('.rd-chip:not(.used)');const index=await chips.evaluateAll((cs,p)=>cs.findIndex(c=>c.textContent===p),part);assert.ok(index>=0);await chips.nth(index).click();}
  await page.waitForFunction(el=>!el.isConnected,old,{timeout:10000});
 }
 await page.waitForFunction(()=>FK.current()==='friends',null,{timeout:15000});
 for(const id of ['read-word','read-colours']){
  await click('Waldspiele');await page.locator('[data-game="'+id+'"]').click();
  for(let i=0;i<6;i++){const cards=page.locator('.rd-card');const index=await cards.evaluateAll(cs=>cs.findIndex(c=>c._it.ok)),old=await cards.first().elementHandle();await cards.nth(index).click();await page.waitForFunction(el=>!el.isConnected,old,{timeout:10000});}
  assert.equal(await page.evaluate(()=>FK.current()),'friends',id);
 }
 await click('Waldspiele');await page.locator('[data-game="read-leaves"]').click();await page.getByRole('button',{name:'M',exact:true}).click();
 for(let i=0;i<8;i++){const live=page.locator('.rd-balloon.is-t:not(.rd-popping):not(.rd-away):not(.rd-leave)').first();await live.waitFor({state:'visible',timeout:15000});if(!i)await live.press('Enter');else await live.locator('.rd-b-hit').dispatchEvent('pointerdown',{pointerType:'touch',isPrimary:true});if(i<7)assert.equal(await page.locator('.rd-cnt.on').count(),i+1);await page.waitForTimeout(400);}
 await page.waitForFunction(()=>FK.current()==='friends',null,{timeout:10000});
 // Rethemed counting objects still complete their original number exercises.
 await page.evaluate(()=>{const make=FK.puzzles.question;FK.puzzles.question=(...args)=>{const q=make(...args);window.puzzleTestQuestion=q;return q;};});
 for(const game of ['rocket','double']){
  await click('Waldspiele');await page.locator('[data-game="'+game+'"]').click();
  for(let round=0;round<5;round++){
   const q=await page.evaluate(()=>window.puzzleTestQuestion);
   if(game==='rocket'){for(let n=0;n<q.answer;n++)await page.locator('.rocket-load[data-amount="1"]').click();await click('✓ Prüfen');}
   else{for(let n=0;n<q.n;n++)await page.locator('.mirror-add').click();await page.locator('.mirror-check').click();await page.locator('.learn-answer[data-answer="'+q.answer+'"]').click();}
   await page.locator('.adventure-next').click();
  }
  assert.equal(await page.evaluate(()=>FK.current()),'friends',game);
 }
 // A real paint stroke survives Cancel and Undo; pointer release alone confirms New.
 await page.reload();await ready();if(await page.evaluate(()=>FK.friendsView().area)==='forest'){await click('Bildkarte');await click('Nach Hause');await page.waitForFunction(()=>FK.friendsView().area==='den',null,{timeout:60000});}await page.locator('[data-place="drawing"]').click();await page.locator('.book-card').first().click();await page.waitForTimeout(800);await click('Stift');await page.locator('.pop .opt').first().click();
 const paper=await page.locator('.screen-color .paper').boundingBox();await page.mouse.move(paper.x+paper.width*.35,paper.y+paper.height*.45);await page.mouse.down();await page.mouse.move(paper.x+paper.width*.65,paper.y+paper.height*.6,{steps:8});await page.mouse.up();
 const painted=()=>page.evaluate(()=>{const c=document.querySelector('.screen-color .cv-paint');return Array.from(c.getContext('2d').getImageData(0,0,c.width,c.height).data).some((v,i)=>i%4===3&&v>0);});
 assert.equal(await painted(),true);await click('Neu');await click('Nein');assert.equal(await painted(),true);await click('Neu');
 const yes=page.getByRole('button',{name:'Ja',exact:true}),rect=await yes.boundingBox(),event={pointerId:91,pointerType:'touch',isPrimary:true,clientX:rect.x+rect.width/2,clientY:rect.y+rect.height/2};
 await yes.dispatchEvent('pointerdown',event);await yes.dispatchEvent('pointerup',event);await page.waitForTimeout(500);assert.equal(await page.locator('.modal').count(),0);assert.equal(await painted(),false);await click('Rückgängig');assert.equal(await painted(),true);await snapshot('paint-undo-1024');
 await page.evaluate(()=>navigator.serviceWorker.ready);await page.waitForFunction(()=>!!navigator.serviceWorker.controller);await page.context().setOffline(true);await page.reload();await ready();await click('Waldspiele');await page.locator('[data-game="read-puzzle"]').click();assert.match(await page.locator('.screen-read').evaluate(el=>getComputedStyle(el).backgroundImage),/puzzle-clearing/);await page.evaluate(()=>FK.visual.ready);
 assert.deepEqual(errors,[]);console.log('PASS: '+(process.env.FARBTUPF_READING_ONLY?'reading/math/paint/offline continuation':'24 catalogue routes at 1024/390 and complete puzzle flow')+'; four reading completions; rethemed arithmetic; frameless keyboard postcard; New/Cancel/Undo with pointer-only confirmation; offline assets.');
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
