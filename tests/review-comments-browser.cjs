/* Exercise real deletion controls against disposable GitHub storage, never the production ledger. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'/opt/codex/cua_node/lib/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const {remoteServer,installRemote}=require('./review-repository-support.cjs');
const base=process.env.FARBTUPF_BASE_URL||'http://127.0.0.1:8000',out=process.env.FARBTUPF_SHOTS||'/tmp/review-comments';fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 try{for(const width of [390,1080]){
  const server=remoteServer(),errors=[];
  async function device(){
   const context=await browser.newContext({viewport:{width,height:width===390?844:810},hasTouch:true,reducedMotion:'reduce',serviceWorkers:'block'});await installRemote(context,server);
   await context.route('**/js/friends/game.js',r=>r.fulfill({contentType:'application/javascript',body:'// Isolated adult review UI.'}));
   const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(30000);
   await page.goto(base+'/?screen=puzzle-review');await page.locator('.gate-task').waitFor();
   const [a,b]=(await page.locator('.gate-task').textContent()).match(/\d+/g).map(Number);await page.getByLabel('Deine Antwort',{exact:true}).fill(String(a*b));await page.locator('.gate-submit').click();
   await page.waitForFunction(()=>FK.current()==='puzzle-review'&&FK.reviewRepository.state.phase==='saved');return {context,page};
  }
  const a=await device();
  const seed=await a.page.evaluate(()=>{const C=FK.puzzleCatalogue,it=C.iterations('add')[0];return {key:it.id,revision:C.iterationRevision('add',it),puzzle:C.puzzleRevision('add')};});
  const at='2026-11-17T10:00:00.000Z',note='Allgemeiner Hinweis.',old='Kommentar zur früheren Grafik.\nBitte anpassen.',ledger=server.ledger;
  ledger.entries['puzzle:add@'+seed.puzzle]={key:'puzzle:add',revision:seed.puzzle,status:'pending',note,at,seen:true};
  ledger.entries[seed.key+'@'+seed.revision]={key:seed.key,revision:seed.revision,status:'improve',note:'Aktueller Hinweis.',at,seen:true};
  ledger.history.push({key:seed.key,revision:'old-pictures',status:'improve',note:old,at,seen:true},{key:seed.key,revision:'even-older-pictures',status:'improve',note:old,at,seen:true});server.ledger=ledger;
  const before=structuredClone(server.ledger.entries),b=await device();await a.page.evaluate(()=>FK.reviewRepository.refresh());
  await a.page.locator('[data-puzzle="add"]').click();await b.page.locator('[data-puzzle="add"]').click();
  assert.equal(await a.page.locator('.review-delete-comment').count(),3,'one X per visible note, deduplicated across revisions');
  for(const box of await a.page.locator('.review-delete-comment').all()){const r=await box.boundingBox();assert.ok(r.width>=48&&r.height>=48&&r.x>=0&&r.x+r.width<=width,'touch target fits');assert.equal(await box.locator('svg').count(),1,'shared X icon');}
  await a.page.locator('.review-feedback').scrollIntoViewIfNeeded();await a.page.screenshot({path:out+'/comments-'+width+'.png'});
  await a.page.getByLabel("Allgemeiner Kommentar zum Rätsel",{exact:true}).fill('Ungespeicherter Entwurf.');
  const historical=a.page.locator('.review-feedback-list>li').filter({hasText:old});await historical.locator('.review-delete-comment').tap();
  assert.equal(await a.page.locator('.review-feedback-list>li').filter({hasText:old}).count(),0);assert.equal(await a.page.getByLabel("Allgemeiner Kommentar zum Rätsel",{exact:true}).inputValue(),'Ungespeicherter Entwurf.','deletion preserves unsaved drafts');
  assert.equal(await a.page.evaluate(()=>FK.reviewRepository.state.pending),1);assert.equal(server.writes.length,0,'disconnected deletion stays local');
  await a.page.locator('.screen:not([hidden]) .btn-back').click();await a.page.locator('.review-connection summary').click();await a.page.getByLabel('GitHub-Zugriffstoken',{exact:true}).fill('test-review-token');await a.page.getByRole('button',{name:'Mit GitHub verbinden',exact:true}).click();await a.page.waitForFunction(()=>FK.reviewRepository.state.connected&&FK.reviewRepository.state.pending===0);
  await b.page.evaluate(()=>FK.reviewRepository.refresh());await b.page.waitForFunction(()=>!FK.puzzleReview.feedback('add').some(v=>v.note.startsWith('Kommentar zur früheren')));assert.equal(await b.page.locator('.review-feedback-list>li').filter({hasText:old}).count(),0);
  await a.page.locator('[data-puzzle="add"]').click();
  const general=a.page.locator('[data-feedback-key="puzzle:add"]');await general.locator('.review-delete-comment').tap();await a.page.evaluate(()=>FK.reviewRepository.refresh());
  assert.equal(await a.page.locator('[data-feedback-key="puzzle:add"]').count(),0);assert.equal(await a.page.getByLabel("Allgemeiner Kommentar zum Rätsel",{exact:true}).inputValue(),'Ungespeicherter Entwurf.');
  await b.page.evaluate(()=>FK.reviewRepository.refresh());await b.page.waitForFunction(()=>FK.puzzleReview.status('add').decision.note===''&&document.querySelector("textarea[aria-label=\"Allgemeiner Kommentar zum Rätsel\"]")?.value==='');assert.equal(await b.page.getByLabel("Allgemeiner Kommentar zum Rätsel",{exact:true}).inputValue(),'','other device clears the deleted saved comment');
  assert.deepEqual(server.ledger.entries,before,'deleting notes never changes approval status, revision, timestamps or seen evidence');assert.equal(server.ledger.deletedNotes.length,2);
  const c=await device();await c.page.locator('[data-puzzle="add"]').click();assert.equal(await c.page.locator('.review-delete-comment').count(),1,'fresh browser restores only the remaining note');
  await b.page.reload();await b.page.locator('.gate-task').waitFor();const [x,y]=(await b.page.locator('.gate-task').textContent()).match(/\d+/g).map(Number);await b.page.getByLabel('Deine Antwort',{exact:true}).fill(String(x*y));await b.page.locator('.gate-submit').click();await b.page.waitForFunction(()=>FK.current()==='puzzle-review'&&FK.reviewRepository.state.phase==='saved');await b.page.locator('[data-puzzle="add"]').click();assert.equal(await b.page.locator('.review-delete-comment').count(),1,'reload cannot resurrect old history');
  assert.deepEqual(errors,[]);await a.context.close();await b.context.close();await c.context.close();
 }}finally{await browser.close();}
 console.log('PASS comment X controls at phone/tablet sizes, historical duplicates, drafts, disconnected outbox, cross-device deletion, fresh browser/reload and unchanged review decisions.');
})().catch(error=>{console.error(error);process.exitCode=1;});
