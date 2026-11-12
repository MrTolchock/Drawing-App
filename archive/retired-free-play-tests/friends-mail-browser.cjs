/* Actual letter -> assigned new round -> courier -> original round, with save/reload boundaries. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'/opt/codex/cua_node/lib/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const BASE=process.env.FARBTUPF_BASE_URL||'http://127.0.0.1:8000';
const shots=process.env.FARBTUPF_SHOTS||'/tmp/farbtupf-mail';fs.mkdirSync(shots,{recursive:true});
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 try{
  const context=await browser.newContext({viewport:{width:1024,height:900},hasTouch:true,reducedMotion:'reduce'}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const click=name=>page.getByRole('button',{name,exact:true}).first().click();
  const read=()=>page.evaluate(()=>FK.friends.get());
  const view=()=>page.evaluate(()=>FK.friendsView());
  const ready=()=>page.waitForFunction(()=>window.FK?.friends&&FK.current()==='friends',null,{timeout:60000});
  const snapshot=async name=>{await page.waitForTimeout(350);await page.screenshot({path:shots+'/'+name+'.png',animations:'disabled'});};
  await page.goto(BASE+'/?software=1');await ready();
  assert.equal((await view()).area,'den');assert.equal((await read()).mail.phase,'den-letter');
  assert.equal(await page.locator('.ff-den-door').isVisible(),true);
  assert.equal(await page.getByRole('button',{name:'Brief öffnen',exact:true}).isVisible(),true);
  assert.equal(await page.locator('.ff-nav [aria-label="Deine Tasche"], [data-place="shop"], .ff-pad, .ff-jump').count(),0);
  assert.equal(await page.locator('.star-count:visible, .ff-wallet:visible').count(),0);
  await snapshot('den-1024');await page.setViewportSize({width:390,height:844});await snapshot('den-390');await page.setViewportSize({width:1024,height:900});
  await click('Brief öffnen');
  assert.equal((await read()).mail.phase,'to-friend');assert.equal((await read()).mail.host,'squirrel');
  assert.equal(await page.locator('.ff-letter-friend').isVisible(),true);
  assert.equal(await page.locator('.ff-letter-scribbles path').count(),1);
  assert.equal((await page.locator('.ff-letter-paper').innerText()).trim(),'');
  await snapshot('letter-1024');await page.setViewportSize({width:390,height:844});await snapshot('letter-390');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.setViewportSize({width:1024,height:900});
  await click('Zum Freund gehen');assert.equal((await view()).area,'forest');assert.equal((await view()).mailTarget,'squirrel');
  await snapshot('arrow-to-squirrel-1024');
  await click('Bildkarte');await snapshot('picture-map-1024');assert.equal(await page.getByRole('button',{name:'Zum Laden',exact:true}).count(),0);assert.equal(await page.locator('.ff-map [data-place="shop"]').count(),0);
  await click('Zu Eichhörnchen');await page.locator('.screen-puzzle').waitFor({state:'visible',timeout:120000});
  assert.equal(await page.locator('.puzzle-scene').isVisible(),true);await snapshot('assigned-puzzle-1024');
  for(let index=0;index<5;index++){
   const state=await read(),round=state.rounds.squirrel,task=round.tasks[round.index];
   assert.equal(round.index,index);
   if(index===0){await page.locator('[data-answer="'+task.choices.find(value=>value!==task.answer)+'"]').click();assert.equal((await read()).mail.phase,'to-friend');}
   await page.locator('[data-answer="'+task.answer+'"]').click();
   if(index<4)await page.waitForFunction(i=>FK.friends.get().rounds.squirrel.index>i,index,{timeout:15000});
  }
  await page.waitForFunction(()=>FK.current()==='friends'&&FK.friends.mail().phase==='to-mailman');
  assert.equal(await page.evaluate(()=>FK.current()),'friends');assert.equal((await view()).area,'forest');assert.equal((await view()).mailTarget,'mailman');
  const s=await read(),world=await view();assert.equal(s.completed.squirrel,1);assert.equal(s.rounds.squirrel,undefined);assert.equal(Object.values(s.wallet).reduce((a,b)=>a+b,0),0);
  assert.ok(Math.hypot(world.position.x-world.mailman.x,world.position.z-world.mailman.z)<3.2,'mailman waits close to the fox');
  await snapshot('mailman-1024');await page.setViewportSize({width:390,height:844});await snapshot('mailman-390');await page.setViewportSize({width:1024,height:900});
  await click('Bildkarte');assert.equal(await page.locator('.ff-map-courier').isVisible(),true);await snapshot('courier-map-1024');await page.setViewportSize({width:390,height:844});await snapshot('courier-map-390');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await click('Zurück');await page.setViewportSize({width:1024,height:900});
  await page.locator('[data-place="mailman"]').click();
  assert.equal((await read()).mail.host,'bird');assert.equal((await read()).mail.phase,'to-friend');await snapshot('next-letter-1024');
  await click('Zum Freund gehen');assert.equal((await view()).mailTarget,'bird');
  const saved=(await read()).mail;
  await page.reload();await ready();assert.deepEqual((await read()).mail,saved);assert.equal((await read()).completed.squirrel,1);
  await click('Dein Brief');assert.equal(await page.locator('.ff-letter-paper').isVisible(),true);await click('Zum Freund gehen');assert.equal((await view()).mailTarget,'bird');
  // Completing practice for a different friend must not consume the current letter.
  await page.evaluate(()=>FK.friendsPuzzleCompleted('mouse'));assert.deepEqual((await read()).mail,saved);
  // The next assigned bird game uses the same automatic five-task flow.
  await page.evaluate(()=>FK.friendsLibrary.launch(FK.friendsLibrary.catalogue().find(g=>g.id==='syllable'),'friends'));
  for(let index=0;index<5;index++){
   const answer=await page.evaluate(()=>{const s=FK.puzzleRounds.start('syllable');return FK.puzzleRounds.question('syllable',s.round,s.seed).answer;});
   await page.locator('.screen-puzzle [data-answer="'+answer+'"]').click();
   if(index<4)await page.waitForFunction(n=>document.querySelector('.screen-puzzle .puzzle-round')?.textContent===n+' / 5',index+2);
  }
  await page.waitForFunction(()=>FK.current()==='friends'&&FK.friends.mail().phase==='to-mailman');
  const completed=await read();assert.equal(completed.mail.host,'bird');assert.equal((await view()).mailTarget,'mailman');assert.equal(await page.evaluate(()=>FK.progress.stars()),0);
  await page.evaluate(()=>FK.friendsPuzzleCompleted('bird'));assert.deepEqual((await read()).mail,completed.mail);
  assert.equal(await page.evaluate(()=>FK.friendsLibrary.catalogue().some(g=>g.id==='dots'||g.id==='rhyme')),false);
  // All five-glyph handwriting and digit flows are exercised in puzzle-rounds-browser.cjs.
  await page.waitForFunction(async()=>!!(await navigator.serviceWorker.getRegistration())?.active,null,{timeout:60000});await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
  const beforeOffline=(await read()).world;
  await context.setOffline(true);await page.reload();await ready();
  assert.deepEqual((await read()).world,beforeOffline);
  assert.equal((await read()).mail.phase,'to-mailman');assert.equal((await view()).mailTarget,'mailman');assert.equal((await read()).completed.squirrel,1);
  await click('Bildkarte');assert.equal(await page.locator('.ff-map').isVisible(),true);await click('Zurück');await context.setOffline(false);
  assert.deepEqual(errors,[]);
  await context.close();
  // Normal-motion delivery uses the door slot, drops to the floor, then remains clickable.
  const moving=await browser.newContext({viewport:{width:1024,height:900},reducedMotion:'no-preference'}),delivery=await moving.newPage();
  delivery.on('pageerror',e=>errors.push(e.message));await delivery.goto(BASE+'/?software=1');await delivery.waitForFunction(()=>window.FK?.friends,null,{timeout:60000});
  const deliveryGeometry=await delivery.locator('.ff-den-envelope').evaluate(envelope=>{
   const animation=envelope.getAnimations().find(a=>a.animationName==='ff-letter-arrive');
   if(!animation)throw Error('Normal-motion envelope animation is missing');
   animation.pause();animation.currentTime=0;
   const start=envelope.getBoundingClientRect(),lid=document.querySelector('.ff-mail-lid').getBoundingClientRect();
   animation.currentTime=2400;const end=envelope.getBoundingClientRect();
   animation.currentTime=0;animation.play();
   return {start:{x:start.x+start.width/2,y:start.y+start.height/2},lid:{x:lid.x+lid.width/2,y:lid.y+lid.height/2,width:lid.width,height:lid.height},end:{y:end.y+end.height/2}};
  });
  assert.ok(Math.abs(deliveryGeometry.start.x-deliveryGeometry.lid.x)<deliveryGeometry.lid.width,'letter begins at mail-slot horizontal position');
  assert.ok(Math.abs(deliveryGeometry.start.y-deliveryGeometry.lid.y)<35,'letter begins at mail-slot height');
  assert.ok(deliveryGeometry.end.y>deliveryGeometry.start.y+40,'letter lands below the slot');
  await delivery.waitForTimeout(2600);await delivery.screenshot({path:shots+'/den-delivered-normal-motion.png'});
  await delivery.getByRole('button',{name:'Brief öffnen',exact:true}).click();assert.equal(await delivery.locator('.ff-letter-paper').isVisible(),true);
  assert.deepEqual(errors,[]);await moving.close();
  console.log('PASS: den delivery, picture letters, assigned new and original puzzles, directional targets, nearby rabbit courier, next recipient, replay/reload boundaries, zero currency, retired-game removal, offline saves, normal-motion delivery and 390px layouts.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
