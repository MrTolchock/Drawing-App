/* All finite items in the real renderer, isolated previews and parent release flow. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'/opt/codex/cua_node/lib/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const base=process.env.FARBTUPF_BASE_URL||'http://127.0.0.1:8000',shots=process.env.FARBTUPF_SHOTS||'/tmp/puzzle-review';fs.mkdirSync(shots,{recursive:true});
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 try{
 const context=await browser.newContext({viewport:{width:1080,height:810},hasTouch:true,reducedMotion:'reduce',acceptDownloads:true}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(60000);
 await page.goto(base+'/?screen=puzzle-review&software=1');await page.waitForFunction(()=>!!window.FK?.friends&&!!document.querySelector('.gate-task'));await page.evaluate(()=>{FK.settings.set('sound',false);});
 const entries=await page.evaluate(()=>FK.friendsLibrary.catalogue());
 // The gallery itself is now behind the adult gate; child access is covered by letter-sessions-browser.cjs.
 const task=await page.locator('.gate-task').textContent(),[a,b]=task.match(/\d+/g).map(Number);await page.getByLabel('Deine Antwort',{exact:true}).fill(String(a*b));await page.locator('.gate-submit').click();
 await page.waitForFunction(()=>FK.current()==='puzzle-review');assert.equal(await page.locator('.review-puzzle').count(),34);
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
 await page.getByRole('button',{name:'Alle Puzzles',exact:true}).click();
 await page.locator('[data-puzzle="add"]').click();assert.equal(await page.getByRole('button',{name:'Puzzle freigeben',exact:true}).isDisabled(),true);
 await page.locator('[data-iteration="add/1-1"]').click();
 assert.equal(await page.getByRole('button',{name:'Spiel erklären',exact:true}).count(),0);
 await page.getByRole('button',{name:'Iteration freigeben',exact:true}).click();
 assert.equal(await page.evaluate(()=>FK.puzzleReview.status('add','add/1-1').status),'approved');
 await page.getByRole('button',{name:'Verbessern',exact:true}).click();assert.equal(await page.evaluate(()=>FK.puzzleReview.status('add','add/1-1').decision.note),'');
 await page.locator('.review-decision summary').click();await page.getByLabel('Prüfnotiz (optional)',{exact:true}).fill('Bitte Bildgrösse prüfen');await page.getByRole('button',{name:'Verbessern',exact:true}).click();
 assert.equal(await page.evaluate(()=>FK.puzzleReview.status('add','add/1-1').status),'improve');
 await page.getByRole('button',{name:'Zur Puzzle-Prüfung',exact:true}).click();
 // Backup through the actual download/upload controls.
 const download=page.waitForEvent('download');await page.getByRole('button',{name:'Prüfung exportieren',exact:true}).click();const backup=await download,backupPath=await backup.path();
 await page.getByLabel('Prüfdatei importieren',{exact:true}).setInputFiles(backupPath);assert.equal(await page.evaluate(()=>FK.puzzleReview.status('add','add/1-1').status),'improve');
 const snapshot=()=>page.evaluate(()=>Object.fromEntries(Object.entries(localStorage).filter(([k])=>!k.startsWith('farbtupf.puzzle-review.'))));
 const before=await snapshot();
 const preview=async(id,iteration)=>{await page.evaluate(({id,iteration})=>FK.puzzleReview.preview(id,iteration),{id,iteration});};
 const answer=async value=>page.locator('.screen:not([hidden]) .puzzle-paper [data-answer]').filter({}).evaluateAll((nodes,value)=>{const b=nodes.find(n=>n.dataset.answer===String(value));if(!b||b.disabled)throw Error('Missing/enabled answer '+value);b.click();},value);
 const solve=async q=>{
  if(q.kind==='trace'){
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   const paths=await page.locator('.tr-track path').evaluateAll(paths=>paths.map(path=>{const len=path.getTotalLength(),m=path.getScreenCTM(),steps=Math.max(1,Math.ceil(len));return Array.from({length:steps+1},(_,i)=>{const p=path.getPointAtLength(len*i/steps).matrixTransform(m);return{x:p.x,y:p.y};});}));
   for(const points of paths){await page.evaluate(points=>{const paper=document.querySelector('.screen-trace .tr-paper'),send=(type,p)=>paper.dispatchEvent(new PointerEvent(type,{bubbles:true,cancelable:true,pointerId:73,pointerType:'touch',isPrimary:true,button:0,buttons:type==='pointerup'?0:1,clientX:p.x,clientY:p.y}));send('pointerdown',points[0]);for(const p of points.slice(1))send('pointermove',p);send('pointerup',points.at(-1));},points);await page.evaluate(()=>new Promise(requestAnimationFrame));}
   assert.equal(await page.locator('.screen-trace .tr-pip:not(.is-done)').count(),0,'all strokes completed for '+q.glyph);return;
  }
  if(q.kind==='picnic'){for(let i=0;i<q.friends;i++)for(let n=(q.plates?.[i]||0);n<q.each;n++)await page.locator('.puzzle-plate').nth(i).evaluate(b=>b.click());}
  else if(q.kind==='double'){while(await page.locator('.puzzle-partner:not(.filled)').count())await page.locator('.puzzle-partner:not(.filled)').first().evaluate(b=>b.click());await answer(q.answer);}
  else if(q.kind==='build'){for(const target of q.holes){const p=q.parts[target];await page.locator('.puzzle-answer[data-shape="'+p[0]+'"][data-rotation="'+p[5]+'"]').evaluate(b=>b.click());}}
  else if(q.kind==='robot'){
   const route=await page.evaluate(q=>{const queue=[[q.start]],seen=new Set([q.start]);for(const path of queue){const p=path.at(-1);if(p===q.goal)return path.slice(1);for(const [dx,dy]of [[0,-1],[-1,0],[0,1],[1,0]]){const x=p%q.size+dx,y=Math.floor(p/q.size)+dy,n=y*q.size+x;if(x<0||x>=q.size||y<0||y>=q.size||q.obstacles.includes(n)||seen.has(n))continue;seen.add(n);queue.push([...path,n]);}}},q);
   for(const cell of route)await page.locator('.puzzle-route-cell[data-cell="'+cell+'"]').evaluate(b=>b.click());
  }else if(q.kind==='order'){for(const n of [0,1,2])await page.locator('.puzzle-story-card[data-order="'+n+'"]').evaluate(b=>b.click());}
  else if(q.kind==='treasure'){await page.getByRole('button',{name:'Ich habe sie mir gemerkt',exact:true}).evaluate(b=>b.click());await answer(q.answer);}
  else if(q.kind==='neighbours'){if(!q.given)await answer(q.answer[0]);await answer(q.answer[1]);}
  else if(q.kind==='mirror'){for(const n of q.answer)await page.locator('.puzzle-mirror-grid button[data-cell="'+n+'"]').evaluate(b=>b.click());}
  else if(q.kind==='syllables'){for(const part of q.parts)await page.locator('.puzzle-syllable-chip:not(:disabled)[data-part="'+part+'"]').first().evaluate(b=>b.click());}
  else await answer(q.answer);
  assert.equal(await page.locator('.screen:not([hidden]) .is-correct').count()>0,true,q.kind+' solved');
 };
 let checked=0;
 for(const g of entries.filter(g=>!process.env.FARBTUPF_GAMES||process.env.FARBTUPF_GAMES.split(',').includes(g.id))){
  const pool=await page.evaluate(id=>FK.puzzleCatalogue.iterations(id),g.id);
  for(const it of pool){
   await preview(g.id,it.id);
   assert.equal(await page.locator('.screen:not([hidden])').evaluate(e=>e.scrollWidth>e.clientWidth+2),false,it.id+' overflow');
   assert.equal(await page.locator('.screen:not([hidden])').getByRole('button',{name:'Spiel erklären',exact:true}).count(),0,it.id);
   const missing=await page.locator('.screen:not([hidden]) .puzzle-paper .wa-illustration,.screen:not([hidden]) .tr-play .wa-illustration').evaluateAll(nodes=>nodes.filter(n=>getComputedStyle(n).backgroundImage==='none').length);assert.equal(missing,0,it.id+' artwork');
   await solve(it.question);checked++;
  }
  console.log('PASS every iteration:',g.id,pool.length);
 }
 if(!process.env.FARBTUPF_GAMES)assert.equal(checked,1048);assert.deepEqual(await snapshot(),before,'all previews leave child saves unchanged');
 // Equivalent real previews at phone/tablet sizes; both picture and tracing pages.
 for(const width of [1080,390]){await page.setViewportSize({width,height:width===390?844:810});for(const g of entries){const it=await page.evaluate(id=>FK.puzzleCatalogue.iterations(id)[0],g.id);await preview(g.id,it.id);assert.equal(await page.locator('.screen:not([hidden])').evaluate(e=>e.scrollWidth>e.clientWidth+2),false,g.id+' '+width);if(['add','trace','read-colours'].includes(g.id))await page.screenshot({path:shots+'/'+g.id+'-'+width+'.png'});}}
 // Quiet button clicks are real Web Audio and obey the existing mute setting.
 await preview('syllable','syllable/word-0');
 await page.evaluate(()=>{window.reviewSoundCounts={clicks:0,oscillators:0};const tick=FK.sound.tick;FK.sound.tick=()=>{window.reviewSoundCounts.clicks++;tick();};const AC=window.AudioContext||window.webkitAudioContext;const create=AC.prototype.createOscillator;AC.prototype.createOscillator=function(){window.reviewSoundCounts.oscillators++;return create.call(this);};FK.settings.set('sound',true);});
 await page.getByRole('button',{name:'Klopfen zurücksetzen',exact:true}).click();assert.equal(await page.evaluate(()=>reviewSoundCounts.clicks),1);assert.ok(await page.evaluate(()=>reviewSoundCounts.oscillators)>0);
 await page.evaluate(()=>{FK.settings.set('sound',false);reviewSoundCounts.clicks=0;reviewSoundCounts.oscillators=0;});await page.getByRole('button',{name:'Klopfen zurücksetzen',exact:true}).click();assert.deepEqual(await page.evaluate(()=>reviewSoundCounts),{clicks:1,oscillators:0});
 // Single-item inspection never advances out from under the reviewer.
 await preview('add','add/1-1');await solve({kind:'add',answer:2});await page.waitForTimeout(1100);assert.equal(await page.locator('.screen:not([hidden]) .puzzle-round').textContent(),'1 / 5');
 // A real puzzle sign-off: individual decisions are fixtures; one final button, no checklist.
 await page.evaluate(()=>{for(const i of FK.puzzleCatalogue.iterations('add')){FK.puzzleReview.seen('add',i.id);FK.puzzleReview.decide('add',i.id,'approved');}FK.go('puzzle-review');});
 assert.equal(await page.locator('.review-decision input[type="checkbox"],.review-decision fieldset').count(),0);await page.getByRole('button',{name:'Puzzle freigeben',exact:true}).click();assert.equal(await page.evaluate(()=>FK.puzzleReview.ready('add')),true);
 await page.evaluate(()=>FK.go('puzzle',{game:'add',reviewRound:true,returnTo:'puzzle-review',from:'friends'}));
 for(let round=0;round<5;round++){const q=await page.evaluate(()=>{const n=document.querySelector('.puzzle-equation').textContent.match(/\d+/g).map(Number);return {kind:'add',answer:n[0]+n[1]};});await solve(q);if(round<4)await page.waitForFunction(n=>document.querySelector('.screen:not([hidden]) .puzzle-round')?.textContent===n+' / 5',round+2);}
 await page.locator('.puzzle-completion').waitFor({state:'visible'});assert.equal(await page.locator('.puzzle-completion .puzzle-progress .done').count(),5);await page.waitForFunction(()=>FK.current()==='puzzle-review');
 // Flagging removes play eligibility and survives reload; no approval ships by default.
 await page.evaluate(()=>FK.puzzleReview.decide('add','add/1-1','improve','Check image'));await page.reload();await page.waitForFunction(()=>!!window.FK?.friends);assert.equal(await page.evaluate(()=>FK.puzzleReview.ready('add')),false);
 // Offline inspection uses the newly cached runtime, without losing review records.
 await page.evaluate(()=>navigator.serviceWorker.ready);await page.waitForFunction(()=>!!navigator.serviceWorker.controller);await context.setOffline(true);await page.reload();await page.waitForFunction(()=>!!window.FK?.friends);assert.equal(await page.evaluate(()=>FK.puzzleReview.status('add','add/1-1').status),'improve');
 assert.equal(await page.evaluate(()=>window.reviewSpeechRequests?.length||0),0,'reload starts without automatic speech');assert.deepEqual(errors,[]);console.log('PASS: '+checked+' real iteration previews/solutions, 34 phone/tablet layouts, parent gate, release gate, export/import, isolated saves, five-task celebration, persisted flag and offline review.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
