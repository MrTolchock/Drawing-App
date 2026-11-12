/* Parent budget, actual invitations/answers, character-only access, return home and durable game over. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'/opt/codex/cua_node/lib/node_modules/playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
const {installRemote,seedFromPage}=require('./review-repository-support.cjs');
const base=process.env.FARBTUPF_BASE_URL||'http://127.0.0.1:8000',shots=process.env.FARBTUPF_SHOTS||'/tmp/letter-sessions';fs.mkdirSync(shots,{recursive:true});
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 try{
  const context=await browser.newContext({viewport:{width:1080,height:810},hasTouch:true,reducedMotion:'reduce'}),page=await context.newPage(),errors=[];page.setDefaultTimeout(60000);page.on('pageerror',e=>errors.push(e.message));
  const reviewServer=await installRemote(context);
  await context.addInitScript(()=>localStorage.setItem('farbtupf.timer.v1','{"version":1,"mode":"countdown","running":true,"durationMs":1000,"elapsedMs":999}'));
  const ready=()=>page.waitForFunction(()=>!!window.FK?.friends&&!!FK.friendsForest);
  const active=()=>page.locator('.screen:not([hidden])');
  const gate=async()=>{await page.locator('.gate-task').waitFor();const [a,b]=(await page.locator('.gate-task').textContent()).match(/\d+/g).map(Number);await page.getByLabel('Deine Antwort',{exact:true}).fill(String(a*b));await page.locator('.gate-submit').click();};
  const settings=async()=>{await active().getByRole('button',{name:'Einstellungen für Erwachsene',exact:true}).first().click();await gate();await page.waitForFunction(()=>FK.current()==='settings');};
  const shot=async name=>{await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:shots+'/'+name+'.png',animations:'disabled'});};
  const mail=()=>page.evaluate(()=>FK.friends.mail());
  const visit=async id=>{await page.evaluate(async id=>{const {places}=await import('./js/friends/world.js'),p=places[id];FK.friendsForest.teleport(p.x,p.z);document.querySelector('.ff-hotspots [data-place="'+id+'"]').click();},id);};
  const solve=async(id,trace=false)=>{
   assert.equal(await active().getByRole('button',{name:'Spiel erklären',exact:true}).count(),1,'child puzzle keeps its explanation');
   for(let n=0;n<5;n++){
    if(trace){
     await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
     await page.evaluate(()=>{const paper=document.querySelector('.screen-trace .tr-paper'),paths=[...document.querySelectorAll('.tr-track path')].map(path=>{const len=path.getTotalLength(),m=path.getScreenCTM(),steps=Math.max(1,Math.ceil(len/4));return Array.from({length:steps+1},(_,i)=>{const p=path.getPointAtLength(len*i/steps).matrixTransform(m);return {x:p.x,y:p.y};});});const send=(type,p)=>paper.dispatchEvent(new PointerEvent(type,{bubbles:true,cancelable:true,pointerId:73,pointerType:'touch',isPrimary:true,button:0,buttons:type==='pointerup'?0:1,clientX:p.x,clientY:p.y}));for(const points of paths){send('pointerdown',points[0]);for(const p of points.slice(1))send('pointermove',p);send('pointerup',points.at(-1));}});
    }else{
     const q=await page.evaluate(id=>FK.puzzleRounds.current(FK.puzzleRounds.start(id)),id);
     await active().locator('[data-answer]').evaluateAll((nodes,answer)=>{const b=nodes.find(n=>n.dataset.answer===String(answer));if(!b)throw Error('Answer missing');b.click();},q.answer);
    }
    if(n<4)await page.waitForFunction(n=>document.querySelector('.screen:not([hidden]) .puzzle-round')?.textContent===n+' / 5',n+2);
   }
   await active().locator('.puzzle-completion').waitFor();assert.equal(await active().locator('.puzzle-completion .done').count(),5);
   await page.waitForFunction(()=>FK.current()==='friends');
  };
  await page.goto(base+'/?software=1');await ready();assert.equal(await page.evaluate(()=>FK.friendsView().area),'den');
  assert.equal(await page.locator('.ff-nav [aria-label="Waldspiele"],.ff-hotspots [data-place="games"],.play-timer-bar').count(),0);
  assert.equal(await page.evaluate(()=>!!FK.playTimer||!!FK.timerUI),false);
  await page.evaluate(()=>FK.settings.set('sound',false));await seedFromPage(page,reviewServer,['friends-squirrel','friends-bird','friends-mouse','trace']);
  // Even an approved puzzle cannot start before the letter or from the gallery/router.
  await page.evaluate(()=>FK.go('puzzle',{game:'friends-squirrel',from:'friends'}));assert.equal(await page.evaluate(()=>FK.current()),'friends');assert.equal((await mail()).phase,'den-letter');
  await settings();assert.equal(await active().getByRole('button',{name:/Stoppuhr|Countdown|Uhr starten/}).count(),0);
  await page.getByLabel('Anzahl Briefe',{exact:true}).fill('2');await page.getByLabel('Anzahl Briefe',{exact:true}).press('Tab');assert.equal((await mail()).session.limit,2);await shot('settings-tablet');
  await page.setViewportSize({width:390,height:844});assert.equal(await active().evaluate(e=>e.scrollWidth>e.clientWidth+2),false);await shot('settings-phone');await page.setViewportSize({width:1080,height:810});
  await page.getByRole('button',{name:'Puzzle-Galerie öffnen',exact:true}).click();assert.equal(await page.locator('.gate-task').count(),0);await page.waitForFunction(()=>FK.current()==='puzzle-review');assert.equal(await page.locator('.review-puzzle').count(),34);
  const beforeReview=await mail();await page.evaluate(()=>FK.puzzleReview.preview('friends-mouse',FK.puzzleCatalogue.iterations('friends-mouse')[0].id));assert.equal(await active().locator('.review-preview').count(),1);assert.deepEqual(await mail(),beforeReview);
  await active().getByRole('button',{name:'Zur Puzzle-Prüfung',exact:true}).click();await active().locator('.btn-back').click();await page.waitForFunction(()=>FK.current()==='settings');
  await page.getByRole('button',{name:'Neue Briefreise starten',exact:true}).click();await page.waitForFunction(()=>FK.current()==='friends');assert.equal(await page.evaluate(()=>FK.friendsView().area),'den');assert.equal((await mail()).session.limit,2);await shot('den-start');console.log('PASS parent settings and adult-only gallery');
  await active().getByRole('button',{name:'Brief öffnen',exact:true}).click();assert.equal((await mail()).host,'squirrel');await active().getByRole('button',{name:'Zum Freund gehen',exact:true}).click();assert.equal(await page.evaluate(()=>FK.friendsView().mailTarget),'squirrel');
  await visit('mouse');assert.equal(await page.evaluate(()=>FK.current()),'friends');assert.equal((await mail()).session.completed,0);
  await page.evaluate(()=>FK.go('trace',{game:'trace',from:'friends'}));assert.equal(await page.evaluate(()=>FK.current()),'friends');assert.equal(await page.evaluate(()=>FK.puzzleRounds.pending('trace')),false);
  await visit('squirrel');await page.waitForFunction(()=>FK.current()==='puzzle');await solve('friends-squirrel');assert.equal((await mail()).session.completed,1);assert.equal((await mail()).phase,'to-mailman');assert.equal(await page.evaluate(()=>FK.friendsView().mailTarget),'mailman');
  await page.locator('.ff-hotspots [data-place="mailman"]').evaluate(b=>b.click());assert.equal((await mail()).host,'bird');assert.equal((await mail()).phase,'to-friend');await active().getByRole('button',{name:'Zum Freund gehen',exact:true}).click();
  const saved=await mail();await page.reload();await ready();assert.deepEqual(await mail(),saved);assert.equal(await page.evaluate(()=>FK.friendsView().area),'den');try{await active().getByRole('button',{name:'Dein Brief',exact:true}).click();}catch(error){console.log('RELOAD STATE',await page.evaluate(()=>({screen:FK.current(),mail:FK.friends.mail().phase,navHidden:document.querySelector('.ff-nav')?.hidden,overlayHidden:document.querySelector('.ff-overlay')?.hidden,overlay:document.querySelector('.ff-overlay')?.className,modal:!!document.querySelector('.modal'),updates:FK.updates?.get(),repository:FK.reviewRepository?.state})));await shot('reload-failure');throw error;}await active().getByRole('button',{name:'Zum Freund gehen',exact:true}).click();
  await visit('squirrel');assert.equal(await page.evaluate(()=>FK.current()),'friends');assert.equal((await mail()).session.completed,1);
  await visit('bird');await page.waitForFunction(()=>FK.current()==='puzzle');await solve('friends-bird');assert.equal((await mail()).session.completed,2);assert.equal((await mail()).phase,'return-home');assert.equal(await page.evaluate(()=>FK.friendsView().mailTarget),'home');assert.equal(await page.locator('.ff-hotspots [data-place="mailman"]').count(),0);await shot('return-home');console.log('PASS two invitations, ten answers and final home target');
  assert.equal(await page.evaluate(()=>FK.friends.openLetter()),false);await visit('mouse');assert.equal(await page.evaluate(()=>FK.current()),'friends');
  // Follow the real route/arrival callback for the final few metres into the den.
  await page.evaluate(async()=>{const {places}=await import('./js/friends/world.js'),p=places.home;FK.friendsForest.teleport(p.x+5,p.z);document.querySelector('.ff-hotspots [data-place="home"]').click();});
  await page.waitForFunction(()=>FK.friends.mail().phase==='sleeping'||FK.friends.mail().phase==='finished');await page.waitForFunction(()=>FK.friends.mail().phase==='finished');assert.equal(await page.evaluate(()=>FK.friendsView().area),'den');await page.locator('.ff-session-end').waitFor();await shot('game-over-tablet');
  await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false);assert.ok(await page.locator('.ff-session-end').evaluate(e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth;}));await shot('game-over-phone');await page.keyboard.press('Escape');assert.equal(await page.locator('.ff-session-end').isVisible(),true);
  await page.evaluate(()=>FK.go('puzzle',{game:'friends-mouse',from:'friends'}));assert.equal(await page.evaluate(()=>FK.current()),'friends');assert.equal((await mail()).phase,'finished');
  await page.evaluate(()=>navigator.serviceWorker.ready);await page.waitForFunction(()=>!!navigator.serviceWorker.controller);await context.setOffline(true);await page.reload();await ready();assert.equal((await mail()).phase,'finished');assert.equal(await page.locator('.ff-session-end').isVisible(),true);assert.equal(await page.evaluate(()=>!!FK.timerUI||!!FK.playTimer),false);await context.setOffline(false);console.log('PASS home arrival, sleep, game-over and offline lock');
  // Parent-only restart creates a new allowance at the den; select writing for the next host.
  await settings();await page.getByLabel('Anzahl Briefe',{exact:true}).fill('1');await page.getByLabel('Anzahl Briefe',{exact:true}).press('Tab');assert.equal((await mail()).phase,'finished');await page.getByRole('button',{name:'Neue Briefreise starten',exact:true}).click();assert.equal((await mail()).phase,'den-letter');assert.equal((await mail()).host,'owl');assert.equal((await mail()).session.completed,0);assert.equal((await mail()).session.limit,1);assert.equal(await page.evaluate(()=>FK.friendsView().area),'den');
  // Separate writing invitation fixture: five glyphs still spend exactly one letter.
  await page.evaluate(()=>{const s=FK.friends.get();s.mail.host='mouse';s.mail.index=4;localStorage.setItem(FK.friends.key,JSON.stringify(s));FK.settings.set('friends.rotation.mouse','friends-mouse');});
  await page.reload();await ready();await active().getByRole('button',{name:'Brief öffnen',exact:true}).click();await active().getByRole('button',{name:'Zum Freund gehen',exact:true}).click();await visit('mouse');await page.waitForFunction(()=>FK.current()==='trace');await solve('trace',true);assert.equal((await mail()).session.completed,1);assert.equal((await mail()).phase,'return-home');assert.equal(await page.evaluate(()=>FK.friendsView().mailTarget),'home');
  assert.deepEqual(errors,[]);console.log('PASS: parent letter limit, no timer/gallery in child UI, invited characters only, exact two-puzzle journey, persisted allowance, home route, sleeping game over, offline lock and parent-only restart.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
