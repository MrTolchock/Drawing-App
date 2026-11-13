/* All finite items in the real renderer, isolated previews and parent release flow. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'/opt/codex/cua_node/lib/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const {installRemote}=require('./review-repository-support.cjs');
const base=process.env.FARBTUPF_BASE_URL||'http://127.0.0.1:8000',shots=process.env.FARBTUPF_SHOTS||'/tmp/puzzle-review';fs.mkdirSync(shots,{recursive:true});
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 try{
 const context=await browser.newContext({viewport:{width:1080,height:810},hasTouch:true,reducedMotion:'reduce',acceptDownloads:true}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(60000);
 await installRemote(context);
 await page.goto(base+'/?screen=puzzle-review&software=1');await page.waitForFunction(()=>!!window.FK?.friends&&!!document.querySelector('.gate-task'));await page.evaluate(()=>{FK.settings.set('sound',false);});
 const entries=await page.evaluate(()=>FK.friendsLibrary.catalogue());
 // The gallery itself is now behind the adult gate; child access is covered by letter-sessions-browser.cjs.
 const task=await page.locator('.gate-task').textContent(),[a,b]=task.match(/\d+/g).map(Number);await page.getByLabel('Deine Antwort',{exact:true}).fill(String(a*b));await page.locator('.gate-submit').click();
 await page.waitForFunction(()=>FK.current()==='puzzle-review');await page.evaluate(()=>FK.reviewRepository.connect('test-review-token'));assert.equal(await page.locator('.review-puzzle').count(),34);
 assert.equal(await page.locator('.review-puzzle').evaluateAll(nodes=>nodes.some(n=>n.scrollWidth>n.clientWidth+2)),false,'review card contents fit');
 await page.screenshot({path:shots+'/review-catalogue-tablet.png'});
 // One shared spoken rule is tested on each puzzle overview, never per iteration.
 await page.evaluate(()=>{window.reviewSpeechRequests=[];const synth=window.speechSynthesis,speak=synth.speak.bind(synth);synth.speak=utterance=>{reviewSpeechRequests.push({text:utterance.text,lang:utterance.lang});speak(utterance);};});
 for(const g of entries){
  await page.getByRole('button',{name:'Alle Puzzles',exact:true}).click();await page.locator('[data-puzzle="'+g.id+'"]').click();
  assert.equal(await page.getByLabel('Prüferin oder Prüfer',{exact:true}).count(),0);
  assert.equal(await page.locator('.review-decision input[type="checkbox"],.review-decision fieldset').count(),0);
  await page.getByRole('button',{name:'Spielerklärung anhören',exact:true}).click();
  const request=await page.evaluate(()=>reviewSpeechRequests.at(-1)),instruction=await page.evaluate(id=>FK.puzzleCatalogue.puzzle(id).instruction,g.id);
  assert.equal(request.text,instruction,g.id+' spoken rule');assert.match(request.lang,/^de(?:-|$)/,g.id+' German speech');
 }
 assert.equal(await page.evaluate(()=>reviewSpeechRequests.length),34);console.log('PASS one spoken rule on each of 34 puzzle overviews');

 const active=()=>page.locator('.screen:not([hidden])');
 const preview=async(id,iteration)=>page.evaluate(({id,iteration})=>FK.puzzleReview.preview(id,iteration),{id,iteration});
 const currentId=()=>active().getAttribute('data-review-iteration');
 const back=()=>active().getByRole('button',{name:'Zur Puzzle-Prüfung',exact:true}).click();
 const reject=async note=>{await active().getByRole('button',{name:'Iteration ablehnen',exact:true}).tap();if(note)await page.getByLabel('Kommentar (optional)',{exact:true}).fill(note);await page.getByRole('button',{name:'Ablehnen und weiter',exact:true}).tap();};
 const snapshot=()=>page.evaluate(()=>Object.fromEntries(Object.entries(localStorage).filter(([k])=>!k.startsWith('farbtupf.puzzle-review.'))));
 let nativeInput=false;
 const touch=await context.newCDPSession(page);
 const activate=async locator=>{if(nativeInput==='mouse')await locator.click();else if(nativeInput)await locator.tap();else await locator.evaluate(b=>b.click());};
 const answer=async value=>activate(page.locator('.screen:not([hidden]) .puzzle-paper [data-answer='+JSON.stringify(String(value))+']'));

 const solve=async q=>{
  if(q.kind==='trace'){
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   const paths=await page.locator('.tr-track path').evaluateAll(paths=>paths.map(path=>{const len=path.getTotalLength(),m=path.getScreenCTM(),steps=Math.max(1,Math.ceil(len));return Array.from({length:steps+1},(_,i)=>{const p=path.getPointAtLength(len*i/steps).matrixTransform(m);return{x:p.x,y:p.y};});}));
   for(const points of paths){
    if(nativeInput){
     const send=(type,p)=>nativeInput==='mouse'?(type==='touchStart'?page.mouse.move(p.x,p.y).then(()=>page.mouse.down()):type==='touchEnd'?page.mouse.up():page.mouse.move(p.x,p.y)):touch.send('Input.dispatchTouchEvent',{type,touchPoints:type==='touchEnd'?[]:[{x:p.x,y:p.y,id:1}]});
     await send('touchStart',points[0]);for(let i=3;i<points.length;i+=3)await send('touchMove',points[i]);await send('touchMove',points.at(-1));await send('touchEnd',points.at(-1));
    }else await page.evaluate(points=>{const paper=document.querySelector('.screen-trace .tr-paper'),send=(type,p)=>paper.dispatchEvent(new PointerEvent(type,{bubbles:true,cancelable:true,pointerId:73,pointerType:'touch',isPrimary:true,button:0,buttons:type==='pointerup'?0:1,clientX:p.x,clientY:p.y}));send('pointerdown',points[0]);for(const p of points.slice(1))send('pointermove',p);send('pointerup',points.at(-1));},points);
    await page.evaluate(()=>new Promise(requestAnimationFrame));
   }
   assert.equal(await page.locator('.screen-trace .tr-pip:not(.is-done)').count(),0,'all strokes completed for '+q.glyph);return;
  }
  if(q.kind==='picnic'){for(let i=0;i<q.friends;i++)for(let n=(q.plates?.[i]||0);n<q.each;n++)await activate(page.locator('.puzzle-plate').nth(i));}
  else if(q.kind==='double'){while(await page.locator('.puzzle-partner:not(.filled)').count())await activate(page.locator('.puzzle-partner:not(.filled)').first());await answer(q.answer);}
  else if(q.kind==='syllable'){
   for(let n=0;n<q.answer;n++)await activate(page.getByRole('button',{name:'Eine Silbe klopfen',exact:true}));
   assert.equal(await page.locator('.puzzle-claps>span').count(),q.answer,'visible syllable tally');assert.equal(await page.locator('.puzzle-claps').textContent(),'●'.repeat(q.answer));
   await activate(page.getByRole('button',{name:'Klopfen zurücksetzen',exact:true}));assert.equal(await page.locator('.puzzle-claps>span').count(),0);await answer(q.answer);
  }
  else if(q.kind==='build'){for(const target of q.holes){const p=q.parts[target];await activate(page.locator('.puzzle-answer[data-shape="'+p[0]+'"][data-rotation="'+p[5]+'"]'));}}
  else if(q.kind==='robot'){
   const route=await page.evaluate(q=>{const queue=[[q.start]],seen=new Set([q.start]);for(const path of queue){const p=path.at(-1);if(p===q.goal)return path.slice(1);for(const [dx,dy]of [[0,-1],[-1,0],[0,1],[1,0]]){const x=p%q.size+dx,y=Math.floor(p/q.size)+dy,n=y*q.size+x;if(x<0||x>=q.size||y<0||y>=q.size||q.obstacles.includes(n)||seen.has(n))continue;seen.add(n);queue.push([...path,n]);}}},q);
   for(const cell of route)await activate(page.locator('.puzzle-route-cell[data-cell="'+cell+'"]'));
  }else if(q.kind==='order'){for(const n of [0,1,2])await activate(page.locator('.puzzle-story-card[data-order="'+n+'"]'));}
  else if(q.kind==='treasure'){await activate(page.getByRole('button',{name:'Ich habe sie mir gemerkt',exact:true}));await answer(q.answer);}
  else if(q.kind==='neighbours'){if(!q.given)await answer(q.answer[0]);await answer(q.answer[1]);}
  else if(q.kind==='mirror'){for(const n of q.answer)await activate(page.locator('.puzzle-mirror-grid button[data-cell="'+n+'"]'));}
  else if(q.kind==='syllables'){for(const part of q.parts)await activate(page.locator('.puzzle-syllable-chip:not(:disabled)[data-part="'+part+'"]').first());}
  else await answer(q.answer);
  assert.equal(await page.locator('.screen:not([hidden]) .is-correct').count()>0,true,q.kind+' solved');
 };

 await page.getByRole('button',{name:'Alle Puzzles',exact:true}).click();await page.locator('[data-puzzle="add"]').click();
 assert.equal(await page.getByRole('button',{name:'Puzzle freigeben',exact:true}).count(),0);
 await page.screenshot({path:shots+'/puzzle-overview-tablet.png'});
 await page.getByRole('button',{name:/^Offene Iterationen prüfen/}).click();
 const addPool=await page.evaluate(()=>FK.puzzleCatalogue.iterations('add')),total=addPool.length;
 assert.ok(total>5);assert.equal(await active().locator('.puzzle-round').textContent(),'1 / '+total);
 assert.equal(await active().locator('.review-preview,.review-decision,textarea').count(),0);
 assert.equal(await active().getByRole('button',{name:'Spiel erklären',exact:true}).count(),0);
 const first=await currentId(),q1=addPool.find(i=>i.id===first).question;
 nativeInput=true;await answer(q1.choices.find(v=>v!==q1.answer));assert.equal(await page.evaluate(id=>FK.puzzleReview.status('add',id).status,first),'pending');assert.equal(await currentId(),first);
 await solve(q1);assert.equal(await page.evaluate(id=>FK.puzzleReview.status('add',id).status,first),'approved');
 assert.equal(await active().getByRole('button',{name:'Iteration ablehnen',exact:true}).isDisabled(),true);
 await page.waitForFunction(id=>document.querySelector('.screen:not([hidden])').dataset.reviewIteration!==id,first);
 const second=await currentId();await active().getByRole('button',{name:'Iteration ablehnen',exact:true}).tap();await page.getByLabel('Kommentar (optional)',{exact:true}).fill('Draft to cancel');await page.getByRole('button',{name:'Weiter prüfen',exact:true}).tap();assert.equal(await currentId(),second);assert.equal(await page.evaluate(id=>FK.puzzleReview.status('add',id).status,second),'pending');
 await reject();assert.equal(await page.evaluate(id=>FK.puzzleReview.status('add',id).decision.note,second),'');
 const third=await currentId();await reject('Bitte Bildgrösse prüfen');assert.equal(await page.evaluate(id=>FK.puzzleReview.status('add',id).decision.note,third),'Bitte Bildgrösse prüfen');
 await page.screenshot({path:shots+'/review-gameplay-tablet.png'});await back();
 const download=page.waitForEvent('download');await page.getByRole('button',{name:'Prüfung exportieren',exact:true}).click();const backup=await download;await page.getByLabel('Prüfdatei importieren',{exact:true}).setInputFiles(await backup.path());assert.equal(await page.evaluate(id=>FK.puzzleReview.status('add',id).status,third),'improve');
 const before=await snapshot();nativeInput=false;
 let checked=0;
 for(const g of entries.filter(g=>!process.env.FARBTUPF_GAMES||process.env.FARBTUPF_GAMES.split(',').includes(g.id))){
  const pool=await page.evaluate(id=>FK.puzzleCatalogue.iterations(id),g.id);
  for(const it of pool){
   await preview(g.id,it.id);
   assert.equal(await active().evaluate(e=>e.scrollWidth>e.clientWidth+2),false,it.id+' overflow');
   assert.equal(await active().locator('.review-preview,.review-decision').count(),0,it.id+' no footer');
   const missing=await active().locator('.puzzle-paper .wa-illustration,.tr-play .wa-illustration').evaluateAll(nodes=>nodes.filter(n=>getComputedStyle(n).backgroundImage==='none').length);assert.equal(missing,0,it.id+' artwork');
   await solve(it.question);assert.equal(await page.evaluate(({id,it})=>FK.puzzleReview.status(id,it).status,{id:g.id,it:it.id}),'approved',it.id+' auto approval');checked++;
  }console.log('PASS every iteration:',g.id,pool.length);
 }
 if(!process.env.FARBTUPF_GAMES)assert.equal(checked,1048);assert.deepEqual(await snapshot(),before,'review leaves child saves unchanged');
 // All 34 puzzle types accept real taps, including SVG/image descendants and redrawing controls.
 for(const width of [1080,390]){
  await page.setViewportSize({width,height:width===390?844:810});nativeInput=width===390?'mouse':true;
  for(const g of entries){const it=await page.evaluate(id=>FK.puzzleCatalogue.iterations(id)[0],g.id);await preview(g.id,it.id);assert.equal(await active().evaluate(e=>e.scrollWidth>e.clientWidth+2),false,g.id+' '+width);await solve(it.question);if(['add','trace','read-colours'].includes(g.id))await page.screenshot({path:shots+'/'+g.id+'-'+width+'.png'});}
 }console.log('PASS native touch/mouse for 34 puzzles at phone and tablet sizes');
 // Quiet button clicks use Web Audio and obey mute.
 await preview('syllable','syllable/word-0');
 await page.evaluate(()=>{window.reviewSoundCounts={clicks:0,oscillators:0};const tick=FK.sound.tick;FK.sound.tick=()=>{reviewSoundCounts.clicks++;tick();};const AC=window.AudioContext||window.webkitAudioContext;const create=AC.prototype.createOscillator;AC.prototype.createOscillator=function(){reviewSoundCounts.oscillators++;return create.call(this);};FK.settings.set('sound',true);});
 await page.getByRole('button',{name:'Klopfen zurücksetzen',exact:true}).tap();assert.equal(await page.evaluate(()=>reviewSoundCounts.clicks),1);assert.ok(await page.evaluate(()=>reviewSoundCounts.oscillators)>0);
 await page.evaluate(()=>{FK.settings.set('sound',false);reviewSoundCounts.clicks=0;reviewSoundCounts.oscillators=0;});await page.getByRole('button',{name:'Klopfen zurücksetzen',exact:true}).tap();assert.deepEqual(await page.evaluate(()=>reviewSoundCounts),{clicks:1,oscillators:0});
 // Repeated taps activate once each; drags and cancelled gestures must not become answers.
 const drum=page.getByRole('button',{name:'Eine Silbe klopfen',exact:true});
 for(let n=0;n<10;n++)await drum.tap();assert.equal(await page.locator('.puzzle-claps>span').count(),4,'ten taps, no duplicate compatibility clicks');
 await drum.focus();await page.keyboard.press('Space');await page.keyboard.press('Enter');assert.equal(await page.locator('.puzzle-claps>span').count(),0,'keyboard activates once');
 await drum.scrollIntoViewIfNeeded();const hit=await drum.boundingBox(),center={x:hit.x+hit.width/2,y:hit.y+hit.height/2,id:1};
 await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[center]});await touch.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{...center,y:center.y-35}]});await touch.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert.equal(await page.locator('.puzzle-claps>span').count(),0,'drag is not a tap');
 await drum.scrollIntoViewIfNeeded();const fresh=await drum.boundingBox();await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:fresh.x+fresh.width/2,y:fresh.y+fresh.height/2,id:1}]});await touch.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});assert.equal(await page.locator('.puzzle-claps>span').count(),0,'cancel is not a tap');await drum.tap();assert.equal(await page.locator('.puzzle-claps>span').count(),1,'fresh tap after cancel works');
 await active().getByRole('button',{name:'Iteration ablehnen',exact:true}).tap();await page.locator('.modal-x').tap();await drum.tap();assert.equal(await page.locator('.puzzle-claps>span').count(),2,'closing a modal does not eat the next tap');
 // Complete a whole review queue through the actual answers, beyond the normal fifth item.
 await page.evaluate(()=>{for(const it of FK.puzzleCatalogue.iterations('add'))FK.puzzleReview.decide('add',it.id,'pending');FK.puzzleReview.decide('add',null,'pending');FK.puzzleReview.start('add');});
 for(let n=0;n<total;n++){
  const id=await currentId();assert.equal(await active().locator('.puzzle-round').textContent(),(n+1)+' / '+total);await solve(addPool.find(it=>it.id===id).question);
  if(n<total-1)await page.waitForFunction(id=>document.querySelector('.screen:not([hidden])').dataset.reviewIteration!==id,id);
 }
 await page.locator('.puzzle-completion').waitFor({state:'visible'});assert.equal(await page.evaluate(()=>FK.puzzleReview.status('add').status),'pending','puzzle waits for celebration');assert.equal(await page.locator('.puzzle-completion .done').count(),5);await page.waitForFunction(()=>FK.current()==='puzzle-review');await page.evaluate(()=>FK.reviewRepository.refresh());assert.equal(await page.evaluate(()=>FK.puzzleReview.ready('add')),true);
 // A rejection is not repeated forever; only that item remains for the next run.
 await page.evaluate(ids=>{for(const id of ids)FK.puzzleReview.decide('add',id,'pending');FK.puzzleReview.start('add');},addPool.slice(0,2).map(i=>i.id));
 const reopen=await currentId();await reject('One more look');assert.equal(await active().locator('.puzzle-round').textContent(),'2 / 2');const last=await currentId();await solve(addPool.find(i=>i.id===last).question);await page.locator('.puzzle-completion').waitFor({state:'visible'});await page.waitForFunction(()=>FK.current()==='puzzle-review');assert.equal(await page.evaluate(()=>FK.puzzleReview.ready('add')),false);
 await page.evaluate(()=>FK.puzzleReview.start('add'));assert.equal(await currentId(),reopen);assert.equal(await active().locator('.puzzle-round').textContent(),'1 / 1');
 // Storage failure must keep the item open and offer a retry, rather than silently approve.
 await page.evaluate(()=>{window.reviewWrite=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k===FK.puzzleReview.key)throw Error('quota');return reviewWrite.call(this,k,v);};});
 await answer(addPool.find(i=>i.id===reopen).question.answer);await page.getByRole('dialog',{name:'Prüfung nicht gespeichert',exact:true}).waitFor();assert.equal(await page.evaluate(id=>FK.puzzleReview.status('add',id).status,reopen),'improve');await page.evaluate(()=>Storage.prototype.setItem=reviewWrite);await page.getByRole('button',{name:'Erneut versuchen',exact:true}).click();await page.locator('.puzzle-completion').waitFor({state:'visible'});await page.waitForFunction(()=>FK.current()==='puzzle-review');
 await page.evaluate(()=>FK.reviewRepository.refresh());assert.equal(await page.evaluate(()=>FK.puzzleReview.ready('add')),true);
 // Flagging survives refresh and offline use; a fresh review resumes only unconfirmed items.
 await page.evaluate(id=>FK.puzzleReview.decide('add',id,'improve','Check image'),reopen);await page.reload();await page.waitForFunction(()=>!!window.FK?.friends);assert.equal(await page.evaluate(()=>FK.puzzleReview.ready('add')),false);
 await page.evaluate(()=>navigator.serviceWorker.ready);await page.waitForFunction(()=>!!navigator.serviceWorker.controller);await context.setOffline(true);await page.reload();await page.waitForFunction(()=>!!window.FK?.friends);assert.equal(await page.evaluate(id=>FK.puzzleReview.status('add',id).status,reopen),'improve');assert.equal(await page.evaluate(()=>window.reviewSpeechRequests?.length||0),0);
 assert.deepEqual(errors,[]);console.log('PASS '+checked+' finite solutions, native input for all puzzles, whole-pool review, retries, optional rejection, celebration, isolated saves, export/import, persistence and offline review.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
