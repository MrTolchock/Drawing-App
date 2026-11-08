/* Shared settings, quiet puzzle speech, real ambience and the illustrated destination map. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'/opt/codex/cua_node/lib/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const BASE=process.env.FARBTUPF_BASE_URL||'http://127.0.0.1:8000',shots=process.env.FARBTUPF_SHOTS||'/tmp/interface-polish';fs.mkdirSync(shots,{recursive:true});
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 try{
  const context=await browser.newContext({viewport:{width:1024,height:900},hasTouch:true,reducedMotion:'reduce'}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await context.addInitScript(()=>{
   window.testSpeech=[];window.testHidden=false;
   Object.defineProperty(document,'hidden',{configurable:true,get:()=>window.testHidden});
   window.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};
   Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{getVoices:()=>[{lang:'de-CH'}],cancel(){},speak(u){window.testSpeech.push(u.text);queueMicrotask(()=>u.onend?.());}}});
  });
  const click=name=>page.getByRole('button',{name,exact:true}).first().click();
  const ready=()=>page.waitForFunction(()=>!!window.FK?.friendsView,null,{timeout:60000});
  const snapshot=async name=>{await page.waitForTimeout(350);await page.screenshot({path:shots+'/'+name+'.png',animations:'disabled'});};
  const spoken=()=>page.evaluate(()=>window.testSpeech.length);
  async function settings(){await click('Einstellungen für Erwachsene');const n=(await page.locator('.gate-task').innerText()).match(/\d+/g).map(Number);await click(String(n[0]*n[1]));assert.equal(await page.evaluate(()=>FK.current()),'settings');}
  await page.goto(BASE+'/?software=1');await ready();await page.evaluate(()=>document.fonts.ready);
  assert.equal(await page.evaluate(()=>FK.friends.get().settings.speech),false);assert.equal(await spoken(),0);
  assert.deepEqual(await page.locator('.ff-nav .ff-ui-art').evaluateAll(es=>es.map(e=>e.dataset.icon)),['map','letter','book','gear']);
  assert.equal(await page.locator('.ff-nav [aria-label="Anleitung wiederholen"],.ff-leaves').count(),0);
  for(const width of [1024,390]){
   await page.setViewportSize({width,height:width===390?844:900});await page.waitForTimeout(250);
   const centre=await page.locator('.ff-nav [aria-label="Waldspiele"]').evaluate(b=>{const r=b.getBoundingClientRect(),i=b.querySelector('.ff-ui-art').getBoundingClientRect();return {dx:Math.abs(r.x+r.width/2-i.x-i.width/2),dy:Math.abs(r.y+r.height/2-i.y-i.height/2)};});
   assert.ok(centre.dx<1&&centre.dy<1,'book is centred at '+width);await snapshot('den-'+width);
  }
  await page.setViewportSize({width:1024,height:900});await settings();
  assert.equal(await page.locator('.screen-settings .play-timer-settings').isVisible(),true);
  await page.getByRole('checkbox',{name:'Musik',exact:true}).uncheck();
  await page.waitForFunction(()=>FK.friendsAudio.diagnostics.state==='running'&&FK.friendsAudio.diagnostics.rms>.00001);
  assert.equal(await page.evaluate(()=>FK.friendsAudio.diagnostics.layers),4);await page.waitForFunction(()=>FK.friendsAudio.diagnostics.birdCalls>0);
  await click('Stoppuhr');await page.locator('.screen-settings').getByRole('button',{name:'Uhr starten',exact:true}).click();await page.waitForTimeout(650);
  assert.equal(await page.evaluate(()=>FK.playTimer.get().elapsedMs),0,'timer waits inside settings');await snapshot('settings-1024');
  await page.setViewportSize({width:390,height:844});await snapshot('settings-390');await page.locator('.screen-settings .btn-back').click();
  assert.equal(await page.evaluate(()=>FK.current()),'friends');await page.waitForTimeout(650);assert.ok(await page.evaluate(()=>FK.playTimer.get().elapsedMs)>400);
  await click('Waldspiele');assert.equal(await page.locator('.screen-forest-book .play-timer-launcher,.screen-forest-book .topbar .play-listen').count(),0);
  await settings();const paused=await page.evaluate(()=>FK.playTimer.get().elapsedMs);await page.waitForTimeout(650);assert.equal(await page.evaluate(()=>FK.playTimer.get().elapsedMs),paused);
  await click('Countdown');await click('5 Minuten');assert.equal(await page.evaluate(()=>FK.playTimer.get().durationMs),300000);await click('Aus');
  await page.locator('.screen-settings .btn-back').click();assert.equal(await page.evaluate(()=>FK.current()),'forest-book');await page.locator('.screen-forest-book .btn-back').click();
  await click('Brief öffnen');await click('Zum Freund gehen');assert.equal(await spoken(),0);
  await page.getByRole('button',{name:'Bildkarte',exact:true}).click();
  for(const width of [390,1024]){
   await page.setViewportSize({width,height:width===390?844:900});await page.waitForTimeout(300);
   const pins=await page.locator('.ff-map-storybook .ff-button').evaluateAll(bs=>bs.map(b=>({r:b.getBoundingClientRect().toJSON(),p:b.firstElementChild.getBoundingClientRect().toJSON()})));
   assert.equal(pins.length,6);assert.ok(pins.every(p=>p.r.width>=48&&p.r.height>=48&&p.p.width>35&&p.p.height>35),'all map portraits are visible touch targets');
   for(let i=0;i<pins.length;i++)for(let j=0;j<i;j++){const a=pins[i].r,b=pins[j].r;assert.ok(a.right<=b.left||b.right<=a.left||a.bottom<=b.top||b.bottom<=a.top,'map destinations do not overlap at '+width);}
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await snapshot('map-'+width);
  }
  assert.equal(await page.locator('.ff-map-storybook .ff-map-invited').getAttribute('data-place'),'squirrel');
  await page.locator('.ff-map-storybook [data-place="owl"]').click();await page.locator('.ff-example-banner').waitFor({timeout:120000});assert.equal(await spoken(),0);
  await click('Zurück');assert.equal(await page.getByRole('button',{name:'Spiel erklären',exact:true}).count(),1);await click('Spiel erklären');assert.equal(await spoken(),1);
  assert.equal(await page.evaluate(()=>window.testSpeech.at(-1)),await page.evaluate(()=>FriendsContent.hosts.owl.instruction));await snapshot('puzzle-explanation-1024');await click('Zurück');
  // Original activity families have the same one explicit explanation and no automatic reading.
  for(const [screen,params]of [['learn',{game:'count'}],['adventure',{game:'rhyme'}],['adventure',{game:'syllable'}],['expedition',{game:'vowels'}],['read',{game:'wort'}],['trace',{glyph:'I'}],['dots',{}]]){
   const before=await spoken();await page.evaluate(({screen,params})=>FK.go(screen,params),{screen,params});
   assert.equal(await spoken(),before,screen+' stays quiet');const explain=page.locator('.screen:not([hidden])').getByRole('button',{name:'Spiel erklären',exact:true});assert.equal(await explain.isVisible(),true,screen);await explain.click();assert.equal(await spoken(),before+1);
   assert.equal(await page.locator('.screen:not([hidden]) .play-listen:visible').count(),1,screen+' has one speech action');
  }
  await page.evaluate(()=>FK.go('friends'));await settings();await page.getByRole('checkbox',{name:'Waldgeräusche',exact:true}).uncheck();
  await page.waitForFunction(()=>FK.friendsAudio.diagnostics.rms<.00001,null,{timeout:15000});
  await page.getByRole('checkbox',{name:'Waldgeräusche',exact:true}).check();await page.waitForFunction(()=>FK.friendsAudio.diagnostics.rms>.00001);
  await page.evaluate(()=>{window.testHidden=true;document.dispatchEvent(new Event('visibilitychange'));});await page.waitForTimeout(150);assert.ok(await page.evaluate(()=>FK.friendsAudio.diagnostics.rms)<.00001,'hidden page is silent');
  await page.evaluate(()=>{window.testHidden=false;document.dispatchEvent(new Event('visibilitychange'));});await page.waitForFunction(()=>FK.friendsAudio.diagnostics.rms>.00001);
  await page.locator('.screen-settings .btn-back').click();assert.equal(await page.locator('.ff-leaves').count(),0);
  await page.evaluate(()=>navigator.serviceWorker.ready);await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
  const mail=await page.evaluate(()=>FK.friends.mail());
  // A prior save with narration enabled and a collected leaf is retained without restoring either feature.
  await page.evaluate(()=>{const s=FK.friends.get();s.settings.speech=true;s.collected={'goldleaf-1':true};localStorage.setItem(FK.friends.key,JSON.stringify(s));});
  await context.setOffline(true);await page.reload();await ready();assert.equal(await spoken(),0);assert.deepEqual(await page.evaluate(()=>FK.friends.mail()),mail);assert.deepEqual(await page.evaluate(()=>FK.friends.get().collected),{'goldleaf-1':true});
  assert.equal(await page.evaluate(()=>FK.friends.collect('goldleaf-2')),false);assert.equal(await page.locator('.ff-leaves').count(),0);
  await settings();assert.equal(await page.getByRole('checkbox',{name:'Musik',exact:true}).isChecked(),false);await page.locator('.screen-settings .btn-back').click();await click('Bildkarte');assert.equal(await page.locator('.ff-map-storybook').isVisible(),true);await snapshot('map-offline-1024');
  await context.setOffline(false);assert.deepEqual(errors,[]);await context.close();
  console.log('PASS: matching centred toolbar at1024/390, shared gated settings, timer moved/paused, six visible non-overlapping map destinations and actual route, manual-only explanation in every activity family, audible four-layer ambience with birds/mute/background pause, retired leaves and saved/offline continuity.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
