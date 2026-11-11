/* Regression: first-tap buttons across all surfaces, correctable parent gate,
   no ghost clicks, scrolling/cancel, and computed typography roles. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'/opt/codex/cua_node/lib/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const base=process.env.FARBTUPF_BASE_URL||'http://127.0.0.1:8000',shots=process.env.FARBTUPF_SHOTS||'/tmp/input-typography';fs.mkdirSync(shots,{recursive:true});
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-angle=swiftshader','--enable-unsafe-swiftshader']});try{
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,reducedMotion:'reduce',serviceWorkers:'block'}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>{errors.push(e.message);console.error('PAGE ERROR',e.message);});page.setDefaultTimeout(60000);
 await page.goto(base+'/?software=1',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>!!window.FK?.friendsView);await page.evaluate(()=>document.fonts.ready);
 const cdp=await context.newCDPSession(page);
 async function tap(node,jitter=true){await node.scrollIntoViewIfNeeded();const r=await node.boundingBox(),p={x:r.x+r.width/2,y:r.y+r.height/2};await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[p]});if(jitter)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:p.x+3,y:p.y+2}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
 const button=name=>page.getByRole('button',{name,exact:true});
 const current=()=>page.evaluate(()=>FK.current());
 const back=()=>tap(page.locator('.screen:not([hidden]) .btn-back'));
 async function fonts(selector,family,weight){const values=await page.locator(selector).evaluateAll(es=>es.map(e=>({family:getComputedStyle(e).fontFamily.split(',')[0].replaceAll('"','').trim(),weight:getComputedStyle(e).fontWeight})));assert.ok(values.length,selector);for(const v of values){assert.equal(v.family,family,selector);if(weight)assert.equal(v.weight,weight,selector);}}
 async function gate(){await tap(button('Einstellungen für Erwachsene'));const n=(await page.locator('.gate-task').innerText()).match(/\d+/g).map(Number);return n[0]*n[1];}
 // Wrong answers stay in the gate; close/reopen and correction work immediately.
 let right=await gate();await tap(button('Öffnen'));assert.equal(await page.locator('.gate-input').getAttribute('aria-invalid'),'true');await page.locator('.gate-input').fill(String(right+1));await tap(button('Öffnen'));
 assert.equal(await page.locator('.gate-input').getAttribute('aria-invalid'),'true');assert.match(await page.locator('.gate-feedback').textContent(),/nochmals/);assert.equal(await current(),'friends');
 await fonts('.gate-task,.gate-input,.gate-submit .lbl','Andika','700');await fonts('.modal-title','Baloo 2','700');
 assert.equal(await page.locator('.gate-submit .lbl').evaluate(el=>getComputedStyle(el).fontSize),'18px');
 await page.screenshot({path:shots+'/gate-retry-390.png',animations:'disabled'});
 await tap(button('Schliessen'));right=await gate();await page.locator('.gate-input').fill(String(right+2));await page.locator('.gate-input').press('Enter');assert.equal(await current(),'friends');
 await page.locator('.gate-input').fill(String(right));await tap(button('Öffnen'));assert.equal(await current(),'settings');assert.equal(await page.locator('.modal').count(),0);
 await fonts('.screen-settings .title','Baloo 2','700');await fonts('.ff-settings-body .setting-head b,.ff-setting-toggle,.ff-font-choices button,.ff-data-settings>.btn','Andika','700');
 const sound=page.getByRole('checkbox',{name:'Spielklänge',exact:true}),before=await sound.isChecked();await tap(sound);assert.equal(await sound.isChecked(),!before);await tap(sound);assert.equal(await sound.isChecked(),before);
 await page.screenshot({path:shots+'/settings-390.png',animations:'disabled'});await back();assert.equal(await current(),'friends');
 console.log('PASS parent-gate retry and first-tap native settings controls');
 // Dismissing on the backdrop must consume that gesture but allow the next tap.
 const games=page.getByRole('navigation',{name:'Waldmenü'}).getByRole('button',{name:'Waldspiele',exact:true}),g=await games.boundingBox();await page.evaluate(()=>FK.ui.modal({title:'Bildkarte',body:FK.h('p',{text:'Schliessen und weiterspielen'})}));
 const point={x:g.x+g.width/2,y:g.y+g.height/2};assert.equal(await page.evaluate(p=>document.elementFromPoint(p.x,p.y).classList.contains('modal'),point),true);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert.equal(await current(),'friends');assert.equal(await page.locator('.modal').count(),0);
 await tap(games);assert.equal(await current(),'forest-book');await fonts('.screen-forest-book .topbar .title,.play-library-intro h2','Baloo 2','700');await fonts('.forest-book-game b,.forest-book-game small','Andika');
 await page.screenshot({path:shots+'/games-390.png',animations:'disabled'});
 // A drag that scrolls the book never opens the card under the finger.
 const card=page.locator('.forest-book-game[data-game="count"]');await card.scrollIntoViewIfNeeded();const cr=await card.boundingBox(),start={x:cr.x+cr.width/2,y:cr.y+cr.height/2};await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[start]});for(let y=20;y<=100;y+=20)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:start.x,y:start.y-y}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert.equal(await current(),'forest-book');
 await tap(card);assert.equal(await current(),'puzzle');await fonts('.screen-puzzle .title,.puzzle-prompt,.puzzle-answer','Andika','700');
 // Pick a real ladybird using its semantic name; mark twice with quick, moving taps.
 const counter=button('Marienkäfer markieren').first();await tap(counter);assert.equal(await counter.getAttribute('aria-pressed'),'true');await tap(counter);assert.equal(await counter.getAttribute('aria-pressed'),'false');
 const cancelBox=await counter.boundingBox();await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:cancelBox.x+cancelBox.width/2,y:cancelBox.y+cancelBox.height/2}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});assert.equal(await counter.getAttribute('aria-pressed'),'false');
 // Pointer-only browsers, mouse and keyboard each produce exactly one activation.
 await counter.evaluate(el=>{el._count=0;el.addEventListener('click',()=>el._count++);const r=el.getBoundingClientRect(),args={bubbles:true,pointerType:'touch',pointerId:71,isPrimary:true,button:0,clientX:r.x+r.width/2,clientY:r.y+r.height/2};el.dispatchEvent(new PointerEvent('pointerdown',args));el.dispatchEvent(new PointerEvent('pointerup',args));});assert.equal(await counter.evaluate(el=>el._count),1);
 await counter.click();assert.equal(await counter.evaluate(el=>el._count),2);await counter.focus();await counter.press('Enter');assert.equal(await counter.evaluate(el=>el._count),3);
 await back();assert.equal(await current(),'forest-book');await tap(page.locator('.forest-book-game[data-game="picnic"]'));assert.equal(await current(),'puzzle');
 for(let i=0;i<3;i++)await tap(page.locator('.puzzle-plate').first());assert.equal(await page.evaluate(()=>FK.puzzleRounds.start('picnic').work.plates[0]),3);
 await back();await tap(page.locator('.forest-book-game[data-game="read-puzzle"]'));assert.equal(await current(),'puzzle');
 const parts=await page.evaluate(()=>{const s=FK.puzzleRounds.start('read-puzzle');return FK.puzzleRounds.question('read-puzzle',s.round,s.seed).parts;});for(const part of parts)await tap(page.locator('.puzzle-syllable-chip:not(:disabled)[data-part='+JSON.stringify(part)+']').first());await page.waitForFunction(()=>document.querySelector('.puzzle-round').textContent==='2 / 5');
 await back();await tap(page.locator('.screen-forest-book .btn-back'));assert.equal(await current(),'friends');
 // Book and gallery pictures use the same first-tap delegate as puzzles.
 console.log('PASS backdrop, scroll/cancel, rapid taps, pointer-only, mouse/keyboard and puzzle transitions');
 await tap(page.locator('[data-place="drawing"]'));assert.equal(await current(),'book');await tap(page.locator('.book-card canvas').first());assert.equal(await current(),'color');await fonts('.screen-color .title,.screen-color .btn .lbl','Andika','700');
 await tap(button('Zur Bildauswahl'));assert.equal(await current(),'book');await back();assert.equal(await current(),'friends');
 for(const width of [1024,390]){
  await page.setViewportSize({width,height:width===390?844:900});await tap(games);await tap(page.locator('.forest-book-game[data-game="read-colours"]'));await fonts('.screen-puzzle .title,.puzzle-read-text','Andika','700');await page.screenshot({path:shots+'/reading-'+width+'.png',animations:'disabled'});await back();right=await gate();await page.locator('.gate-input').fill(String(right));await page.locator('.gate-input').press('Enter');assert.equal(await current(),'settings');assert.equal(await page.locator('.screen-settings').evaluate(el=>el.scrollWidth>el.clientWidth+2),false);await page.screenshot({path:shots+'/settings-'+width+'.png',animations:'disabled'});await back();await back();
 }
 assert.deepEqual(errors,[]);console.log('PASS: wrong/empty/correct parent gate and immediate reopen; native jitter taps in world/book/puzzles/settings/paint; fast repeats; pointer-only, mouse and keyboard; scroll and backdrop ghost prevention; typography at 390/1024.');
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
