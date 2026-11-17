/* Real UI, separate browser storage and a deterministic GitHub API, without real credentials/writes. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'/opt/codex/cua_node/lib/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const {remoteServer,installRemote,seedFromPage}=require('./review-repository-support.cjs');
const base=process.env.FARBTUPF_BASE_URL||'http://127.0.0.1:8000',shots=process.env.FARBTUPF_SHOTS||'/tmp/review-sync';fs.mkdirSync(shots,{recursive:true});
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});try{
 const server=remoteServer(),errors=[];
 async function device(width){
  const context=await browser.newContext({viewport:{width,height:width===390?844:810},hasTouch:true,reducedMotion:'reduce',serviceWorkers:'block'});await installRemote(context,server);
  // All actual review/trace/puzzle code runs; the unrelated world is omitted for these storage checks.
  await context.route('**/js/friends/game.js',r=>r.fulfill({contentType:'application/javascript',body:'// Isolated adult review UI.'}));
  const page=await context.newPage();page.setDefaultTimeout(60000);page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/?screen=puzzle-review');await page.locator('.gate-task').waitFor();
  const [a,b]=(await page.locator('.gate-task').textContent()).match(/\d+/g).map(Number);await page.getByLabel('Deine Antwort',{exact:true}).fill(String(a*b));await page.locator('.gate-submit').click();await page.waitForFunction(()=>FK.current()==='puzzle-review'&&FK.reviewRepository.state.phase==='saved');
  return {context,page};
 }
 const a=await device(1080),active=page=>page.locator('.screen:not([hidden])');
 async function connect(page){
  await active(page).locator('.review-connection summary').click();await active(page).getByLabel('GitHub-Zugriffstoken',{exact:true}).fill('test-review-token');await active(page).getByRole('button',{name:'Mit GitHub verbinden',exact:true}).click();await page.waitForFunction(()=>FK.reviewRepository.state.connected&&FK.reviewRepository.state.phase==='saved');
 }
 await connect(a.page);await a.page.locator('[data-puzzle="add"]').click();
 await a.page.getByLabel('Allgemeiner Kommentar zum Puzzle',{exact:true}).fill('Die Bilder im ganzen Puzzle prüfen.');
 await a.page.getByRole('button',{name:'Offen',exact:true}).click();assert.equal(await a.page.getByLabel('Allgemeiner Kommentar zum Puzzle',{exact:true}).inputValue(),'Die Bilder im ganzen Puzzle prüfen.','filtering preserves the comment draft');
 await active(a.page).locator('.btn-back').click();await a.page.locator('[data-puzzle="add"]').click();assert.equal(await a.page.getByLabel('Allgemeiner Kommentar zum Puzzle',{exact:true}).inputValue(),'Die Bilder im ganzen Puzzle prüfen.','Back and reselect preserve the comment draft');
 await a.page.getByRole('button',{name:'Kommentar speichern',exact:true}).click();await a.page.evaluate(()=>FK.reviewRepository.refresh());await a.page.waitForFunction(()=>FK.reviewRepository.state.pending===0);
 assert.equal(Object.values(server.ledger.entries).find(e=>e.key==='puzzle:add').note,'Die Bilder im ganzen Puzzle prüfen.');
 assert.equal(await a.page.evaluate(()=>FK.puzzleReview.status('add').status),'pending','a comment does not approve the puzzle');
 await a.page.locator('[data-iteration="add/1-1"]').click();
 await active(a.page).locator('[data-answer="2"]').tap();await a.page.evaluate(()=>FK.reviewRepository.refresh());await a.page.waitForFunction(()=>FK.reviewRepository.state.pending===0&&FK.reviewRepository.state.phase==='saved');
 assert.equal(Object.values(server.ledger.entries).find(e=>e.key==='add/1-1').status,'approved');
 await a.page.waitForFunction(()=>document.querySelector('.screen:not([hidden])').dataset.reviewIteration!=='add/1-1');
 const second=await active(a.page).getAttribute('data-review-iteration');await active(a.page).getByRole('button',{name:'Iteration ablehnen',exact:true}).tap();await a.page.getByRole('button',{name:'Ablehnen und weiter',exact:true}).tap();await a.page.evaluate(()=>FK.reviewRepository.refresh());await a.page.waitForFunction(()=>FK.reviewRepository.state.pending===0);
 assert.equal(Object.values(server.ledger.entries).find(e=>e.key===second).status,'improve');
 const b=await device(390);assert.equal(await b.page.evaluate(()=>FK.reviewRepository.state.connected),false);assert.equal(await b.page.evaluate(()=>FK.puzzleReview.status('add','add/1-1').status),'approved');assert.equal(await b.page.evaluate(id=>FK.puzzleReview.status('add',id).status,second),'improve');
 await b.page.locator('[data-puzzle="add"]').click();assert.equal(await b.page.getByLabel('Allgemeiner Kommentar zum Puzzle',{exact:true}).inputValue(),'Die Bilder im ganzen Puzzle prüfen.');
 assert.equal(await active(b.page).locator('.review-connection').count(),0);
 await b.page.screenshot({path:shots+'/puzzle-comment-phone.png'});
 await active(b.page).locator('.btn-back').click();await b.page.screenshot({path:shots+'/fresh-browser-phone.png'});
 // A completed fixture pool can finish its actual celebration, without a sign-off form.
 await seedFromPage(a.page,server,['add']);await active(a.page).getByRole('button',{name:'Zur Puzzle-Prüfung',exact:true}).click();
 await a.page.evaluate(()=>FK.puzzleReview.decide('add',null,'pending'));await a.page.evaluate(()=>FK.reviewRepository.refresh());
 await a.page.evaluate(()=>FK.puzzleReview.start('add'));await a.page.locator('.puzzle-completion').waitFor();await a.page.waitForFunction(()=>FK.current()==='puzzle-review');await a.page.evaluate(()=>FK.reviewRepository.refresh());await a.page.waitForFunction(()=>FK.reviewRepository.state.pending===0&&FK.puzzleReview.ready('add'));
 await b.page.evaluate(()=>FK.reviewRepository.refresh());assert.equal(await b.page.evaluate(()=>FK.puzzleReview.ready('add')),true);await b.page.waitForFunction(()=>document.querySelector('.review-intro')?.textContent.startsWith('1 / 31'));
 // A flagged offline decision blocks this device immediately, persists and later conflicts safely.
 await a.context.setOffline(true);await a.page.evaluate(()=>FK.puzzleReview.decide('add','add/1-1','improve'));assert.equal(await a.page.evaluate(()=>FK.puzzleReview.ready('add')),false);await a.page.evaluate(()=>FK.reviewRepository.refresh());assert.equal(await a.page.evaluate(()=>FK.reviewRepository.state.pending),1);
 await connect(b.page);await b.page.evaluate(()=>FK.puzzleReview.decide('add','add/1-1','pending'));await b.page.evaluate(()=>FK.reviewRepository.refresh());
 await a.context.setOffline(false);await a.page.evaluate(()=>FK.reviewRepository.refresh());assert.equal(await a.page.evaluate(()=>FK.reviewRepository.state.phase),'conflict');assert.equal(Object.values(server.ledger.entries).find(e=>e.key==='add/1-1').status,'pending');
 await active(a.page).locator('.btn-back').click();await active(a.page).getByRole('button',{name:'GitHub behalten',exact:true}).click();await a.page.waitForFunction(()=>FK.reviewRepository.state.pending===0);assert.equal(await a.page.evaluate(()=>FK.puzzleReview.status('add','add/1-1').status),'pending');
 // A fresh install with no cache/token restores the authoritative decision automatically.
 await b.page.evaluate(()=>FK.puzzleReview.decide('add','add/1-1','improve'));await b.page.evaluate(()=>FK.reviewRepository.refresh());const c=await device(1080);assert.equal(await c.page.evaluate(()=>FK.puzzleReview.status('add','add/1-1').status),'improve');assert.equal(await c.page.evaluate(()=>FK.reviewRepository.state.connected),false);
 assert.equal(await a.page.evaluate(()=>JSON.stringify(FK.puzzleReview.exportData()).includes('test-review-token')),false);assert.equal(await a.page.evaluate(()=>Object.values(localStorage).some(v=>v.includes('test-review-token'))),false);
 // Notes attached to yesterday's graphics survive a fresh browser and link to today's task.
 const previous={key:'syllable/word-6',revision:'before-new-graphics',status:'improve',note:'Das Klopfen braucht es nicht, einfach nur Silben zählen.',at:'2026-11-15T20:58:24.776Z',seen:true};
 const current=await c.page.evaluate(()=>{const C=FK.puzzleCatalogue,it=C.iterations('syllable').find(it=>it.id==='syllable/word-6');return C.iterationRevision('syllable',it);});
 const ledger=server.ledger;ledger.entries[previous.key+'@'+previous.revision]=previous;ledger.entries[previous.key+'@'+current]={...previous,revision:current,status:'pending',note:'',at:'2026-11-16T12:00:00.000Z',seen:false};
 ledger.history.push({...previous,key:'puzzle:syllable',note:'Die frühere Notiz bleibt auch nach Bildänderungen wichtig.'});server.ledger=ledger;
 for(const width of [1080,390]){
  const fresh=await device(width),page=fresh.page,writes=server.writes.length;await page.locator('[data-puzzle="syllable"]').click();
  const note=active(page).locator('.review-feedback [data-feedback-key="syllable/word-6"]');assert.equal(await note.locator('p').textContent(),previous.note);assert.match(await note.locator('small').textContent(),/15\.11\.2026.*Frühere Version/);
  assert.equal(await active(page).locator('.review-feedback [data-feedback-key="puzzle:syllable"]').count(),1);
  if(width===1080){
   const updated=server.ledger;updated.history.push({...previous,key:'syllable/word-7',note:'Ein später geladener Hinweis zur früheren Grafik.'});server.ledger=updated;
   await page.evaluate(()=>FK.reviewRepository.refresh());await active(page).locator('.review-feedback').getByText('Ein später geladener Hinweis zur früheren Grafik.',{exact:true}).waitFor();
  }
  await active(page).getByRole('button',{name:'Verbessern',exact:true}).click();assert.equal(await note.count(),1,'older feedback remains visible when the current revision is pending');
  assert.equal(await page.evaluate(()=>FK.puzzleReview.status('syllable','syllable/word-6').status),'pending');assert.equal(await page.evaluate(()=>FK.puzzleReview.ready('syllable')),false);assert.equal(server.writes.length,writes,'restoring notes never writes decisions');
  await note.scrollIntoViewIfNeeded();await page.screenshot({path:shots+'/older-feedback-'+width+'.png'});
  await note.getByRole('button',{name:'Aktuelle Aufgabe ansehen',exact:true}).click();assert.equal(await active(page).locator('.puzzle-prompt').textContent(),'Wie viele Silben hat das Wort?');
  assert.equal(await active(page).getAttribute('data-review-iteration'),'syllable/word-6');await fresh.context.close();
 }
 await a.page.screenshot({path:shots+'/synced-review-tablet.png'});assert.deepEqual(errors,[]);console.log('PASS GitHub review UI: automatic writes, independent browsers/fresh install, confirmed release, offline outbox, conflict choice, token isolation and no required notes/checklist.');
 await a.context.close();await b.context.close();await c.context.close();
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
