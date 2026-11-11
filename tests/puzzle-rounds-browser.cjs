/* All active games: actual answers, all five rounds, menu/world return paths and offline continuity. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'/opt/codex/cua_node/lib/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const base=process.env.FARBTUPF_BASE_URL||'http://127.0.0.1:8000',shots=process.env.FARBTUPF_SHOTS||'/tmp/woodland-rounds';fs.mkdirSync(shots,{recursive:true});
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 try{
 console.log('START browser');const context=await browser.newContext({viewport:{width:1024,height:900},hasTouch:true,reducedMotion:'reduce'}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>{errors.push(e.message);console.error('PAGE ERROR',e.message);});page.setDefaultTimeout(60000);
 const uiOnly=process.env.FARBTUPF_UI_ONLY==='1';
 const ready=async()=>{
  await page.waitForFunction(()=>!!window.FK?.puzzleUI,null,{timeout:60000});
  if(uiOnly)await page.evaluate(()=>{FK.friends=FriendsState.create({storage:localStorage,content:FriendsContent});FK.friendsPuzzleCompleted=()=>FK.go('forest-book',{from:'friends'});});else await page.waitForFunction(()=>!!window.FK?.friends,null,{timeout:60000});
  await page.evaluate(()=>{
   window.lastPuzzleCorrect=null;window.puzzleCompletions=[];
   const celebrate=FK.waldbuch.celebrate;FK.waldbuch.celebrate=node=>{const screen=node.closest('.screen');window.lastPuzzleCorrect={game:screen.dataset.game,round:Number(screen.querySelector('.puzzle-round').textContent.split('/')[0])-1,visible:node.classList.contains('is-correct')};celebrate(node);};
   const complete=FK.puzzleUI.completion;FK.puzzleUI.completion=(container,host,done)=>{const cancel=complete(container,host,done);window.puzzleCompletions.push({game:container.closest('.screen').dataset.game,leaves:container.querySelectorAll('.puzzle-progress .done').length});return cancel;};
  });
 };
 await page.goto(base+(uiOnly?'/?screen=hub':'/?software=1'),{waitUntil:'domcontentloaded'});await ready();
 await page.evaluate(()=>{FK.settings.set('sound',false);FK.go('forest-book',{from:'friends'});});await page.evaluate(()=>document.fonts.ready);console.log('READY catalogue');
 const entries=await page.evaluate(()=>FK.friendsLibrary.catalogue());assert.equal(entries.length,33);
 assert.equal(await page.locator('[data-game="rhyme"],[data-game="dots"]').count(),0);
 const menu=()=>page.evaluate(()=>FK.go('forest-book',{from:'friends'}));
 const open=async id=>{await page.locator('.forest-book-game[data-game="'+id+'"]').click();};
 const back=()=>page.locator('.screen:not([hidden]) .btn-back').click();
 const answer=async value=>{const node=page.locator('.screen:not([hidden]) [data-answer="'+value+'"]');await node.first().tap();};
 // Every entry stays within its page, has one explanation, Andika and the original menu return.
 for(const width of process.env.FARBTUPF_FLOW_ONLY?[]:[1024,390]){
  await page.setViewportSize({width,height:width===390?844:900});
  for(const g of entries){
   console.log('LAYOUT',width,g.id);await open(g.id);assert.equal(await page.evaluate(()=>FK.current()),g.screen,g.id);
   const el=page.locator('.screen:not([hidden])');assert.equal(await el.evaluate(e=>e.scrollWidth>e.clientWidth+2),false,'overflow '+g.id+' '+width);
   assert.equal(await el.getByRole('button',{name:'Spiel erklären',exact:true}).count(),1,g.id);
   assert.equal(await el.getByRole('button',{name:/Zeigemodus|Beispiel|Tipp|Hilfe/}).count(),0,g.id);
   assert.match(await el.locator('.title').evaluate(e=>getComputedStyle(e).fontFamily),/Andika/,g.id);
   if(g.screen==='puzzle'){
    const sizes=await el.locator('.puzzle-answer>.puzzle-picture,.puzzle-word-answer>.puzzle-picture').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return [r.width,r.height];}));
    if(sizes.length>1)assert.ok(sizes.every(v=>v[0]===sizes[0][0]&&v[1]===sizes[0][1]),g.id+' image sizes');
   }
   if(process.env.FARBTUPF_SCREENSHOTS!=='0')await page.screenshot({path:shots+'/'+g.id+'-'+width+'.png',animations:'disabled'});await back();assert.equal(await page.evaluate(()=>FK.current()),'forest-book',g.id+' back');
  }
 }
 // Optional counters and partial board work survive leaving and reloading.
 await open('mirror');await page.locator('.puzzle-mirror-grid button').first().tap();
 const mirrorBefore=await page.evaluate(()=>FK.puzzleRounds.start('mirror'));await back();await open('mirror');
 assert.deepEqual(await page.evaluate(()=>FK.puzzleRounds.start('mirror')),mirrorBefore);await page.reload();await ready();await menu();await open('mirror');assert.deepEqual(await page.evaluate(()=>FK.puzzleRounds.start('mirror')),mirrorBefore);await back();
 // Restore a clean board for the full playthrough without touching any other saves.
 await page.evaluate(()=>FK.puzzleRounds.clear('mirror'));
 const cdp=await context.newCDPSession(page);
 for(const g of entries.filter(g=>!process.env.FARBTUPF_GAMES||process.env.FARBTUPF_GAMES.split(',').includes(g.id))){
  if(g.screen==='trace'&&process.env.FARBTUPF_TRACE_SEED)await page.evaluate(({id,seed})=>FK.puzzleRounds.save({id,seed,round:0,solved:false,work:{}}),{id:g.id,seed:Number(process.env.FARBTUPF_TRACE_SEED)});
  await open(g.id);
  for(let round=0;round<5;round++){
   if(g.screen==='trace'){
    assert.equal(await page.locator('.screen:not([hidden]) .puzzle-round').textContent(),(round+1)+' / 5');
    const glyph=await page.locator('.screen-trace').getAttribute('data-glyph');assert.match(glyph,g.id==='trace-numbers'?/^\d$/:/^[\p{L}]$/u);
    const paths=await page.locator('.tr-track path').evaluateAll(paths=>paths.map(path=>{const len=path.getTotalLength(),m=path.getScreenCTM(),steps=Math.max(1,Math.ceil(len/4));return Array.from({length:steps+1},(_,i)=>{const p=path.getPointAtLength(len*i/steps).matrixTransform(m);return{x:p.x,y:p.y};});}));
    if(process.env.FARBTUPF_NATIVE_TOUCH==='1'){
     for(const points of paths){await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[points[0]]});for(const p of points.slice(1))await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[p]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
    }else await page.evaluate(paths=>{
     const paper=document.querySelector('.screen-trace .tr-paper');
     const send=(type,p)=>paper.dispatchEvent(new PointerEvent(type,{bubbles:true,cancelable:true,pointerId:73,pointerType:'touch',isPrimary:true,button:0,buttons:type==='pointerup'?0:1,clientX:p.x,clientY:p.y}));
     for(const points of paths){send('pointerdown',points[0]);for(const p of points.slice(1))send('pointermove',p);send('pointerup',points.at(-1));}
    },paths);
    console.log('Traced:',g.id,round+1,glyph);
   }else{
    const q=await page.evaluate(id=>{if(id.startsWith('friends-')){const r=FK.friends.round(id.slice(8));return r.tasks[r.index];}const s=FK.puzzleRounds.start(id);return FK.puzzleRounds.question(id,s.round,s.seed);},g.id);
    const old=await page.locator('.puzzle-prompt').elementHandle();
    if(q.kind==='picnic'){for(let i=0;i<q.friends;i++)for(let n=0;n<q.each;n++)await page.locator('.puzzle-plate').nth(i).tap();}
    else if(q.kind==='double'){for(const partner of await page.locator('.puzzle-partner').all())await partner.tap();await answer(q.answer);}
    else if(q.kind==='build'){
     for(let n=0;n<2;n++){const s=await page.evaluate(()=>FK.puzzleRounds.start('shapes')),target=q.holes.find(i=>!(s.work.built||[]).includes(i)),part=q.parts[target];await page.locator('.puzzle-answer[data-shape="'+part[0]+'"][data-rotation="'+part[5]+'"]').tap();}
    }else if(q.kind==='robot'){
     const route=await page.evaluate(q=>{const queue=[[q.start]],seen=new Set([q.start]);for(const path of queue){const p=path.at(-1);if(p===q.goal)return path.slice(1);for(const [dx,dy]of [[0,-1],[-1,0],[0,1],[1,0]]){const x=p%q.size+dx,y=Math.floor(p/q.size)+dy,n=y*q.size+x;if(x<0||x>=q.size||y<0||y>=q.size||q.obstacles.includes(n)||seen.has(n))continue;seen.add(n);queue.push([...path,n]);}}},q);
     for(const cell of route)await page.locator('.puzzle-route-cell[data-cell="'+cell+'"]').tap();
    }else if(q.kind==='order'){for(const n of [0,1,2])await page.locator('.puzzle-story-card[data-order="'+n+'"]').tap();}
    else if(q.kind==='treasure'){await page.getByRole('button',{name:'Ich habe sie mir gemerkt',exact:true}).tap();await answer(q.answer);}
    else if(q.kind==='neighbours'){await answer(q.answer[0]);await answer(q.answer[1]);}
    else if(q.kind==='mirror'){for(const n of q.answer)await page.locator('.puzzle-mirror-grid button[data-cell="'+n+'"]').tap();}
    else if(q.kind==='syllables'){for(const part of q.parts)await page.locator('.puzzle-syllable-chip:not(:disabled)[data-part="'+part+'"]').first().tap();}
    else {
     if(round===0&&q.choices&&q.choices.some(v=>typeof v!=='object'&&v!==q.answer)&&q.kind!=='shape'){
      const wrong=q.choices.find(v=>typeof v!=='object'&&v!==q.answer);await answer(wrong);assert.ok(await page.locator('.screen:not([hidden]) .is-retry').count()>0,g.id+' retry');assert.equal(await page.locator('.screen:not([hidden]) .puzzle-round').textContent(),'1 / 5');
     }
     await answer(q.answer);
    }
    assert.deepEqual(await page.evaluate(()=>window.lastPuzzleCorrect),{game:g.id,round,visible:true},g.id+' visible correct answer');assert.equal(await page.locator('.learn-feedback,.ff-feedback,.learn-next,.adventure-next,.exp-next').count(),0,g.id+' obsolete UI');
    if(round<4)try{await page.waitForFunction(e=>!e.isConnected,old,{timeout:5000});}catch(error){console.error('TRANSITION STATE',g.id,round,await page.evaluate(()=>({screen:FK.current(),hidden:document.hidden,modal:document.querySelector('.modal')?.innerText,session:FK.puzzleRounds.start(document.querySelector('.screen-puzzle').dataset.game),text:document.querySelector('.screen:not([hidden])').innerText})));throw error;}
   }
   if(round<4)await page.waitForFunction(n=>document.querySelector('.screen:not([hidden]) .puzzle-round')?.textContent===n+' / 5',round+2,{timeout:7000});
  }
  await page.waitForFunction(id=>window.puzzleCompletions.some(c=>c.game===id&&c.leaves===5),g.id,{timeout:15000});
  if(process.env.FARBTUPF_SCREENSHOTS!=='0'&&await page.locator('.screen:not([hidden]) .puzzle-completion').isVisible())await page.screenshot({path:shots+'/'+g.id+'-complete.png',animations:'disabled'});
  try{await page.waitForFunction(()=>FK.current()==='forest-book',null,{timeout:15000});}catch(error){console.error('COMPLETION STATE',g.id,await page.evaluate(()=>({screen:FK.current(),hidden:document.hidden,modal:!!document.querySelector('.modal'),error:FK.friends.error,text:document.querySelector('.screen:not([hidden])').innerText,rounds:FK.friends.get().rounds})));throw error;}console.log('PASS five rounds:',g.id);
 }
 // Character visits rotate through the same catalogue; unfinished work takes precedence.
 for(const host of ['squirrel','bird','owl','beaver','mouse']){
  const ids=await page.evaluate(host=>{const L=FK.friendsLibrary,pool=L.catalogue().filter(g=>g.host===host),ids=[];L.complete(host);for(let i=0;i<pool.length+1;i++){const next=L.pick(host);ids.push(next.id);FK.settings.set('friends.rotation.'+host,next.id);}return ids;},host);
  assert.equal(new Set(ids.slice(0,-1)).size,ids.length-1,host);assert.equal(ids[0],ids.at(-1),host);
 }
 if(!uiOnly){
 // A completed invitation uses the world return; the book is never a detour.
 await page.evaluate(()=>{FK.friends.openLetter();const host=FK.friends.mail().host;FK.friendsLibrary.launch(FK.friendsLibrary.catalogue().find(g=>g.id==='friends-'+host),'friends');});
 for(let i=0;i<5;i++){const value=await page.evaluate(()=>{const r=FK.friends.round(FK.friends.mail().host);return r.tasks[r.index].answer;});await answer(value);if(i<4)await page.waitForFunction(n=>document.querySelector('.screen:not([hidden]) .puzzle-round')?.textContent===n+' / 5',i+2);}
 await page.locator('.screen:not([hidden]) .puzzle-completion').waitFor({state:'visible'});await page.waitForFunction(()=>FK.current()==='friends');assert.equal(await page.evaluate(()=>FK.friends.mail().phase),'to-mailman');
 }
 await menu();await page.evaluate(()=>navigator.serviceWorker.ready);await page.waitForFunction(()=>!!navigator.serviceWorker.controller);await context.setOffline(true);await page.reload();await ready();await menu();await open('friends-bird');
 assert.match(await page.locator('.screen-puzzle').evaluate(e=>getComputedStyle(e).backgroundImage),/puzzle-clearing/);assert.ok(await page.locator('.puzzle-answer .wa-illustration').count()>0);
 assert.deepEqual(errors,[]);console.log('PASS: '+(process.env.FARBTUPF_FLOW_ONLY?'selected gameplay flows':entries.length+' tablet/phone routes and gameplay')+'; five-task celebrations; retry; persisted work; host rotation; '+(uiOnly?'menu returns':'menu/world returns')+' and offline assets.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
