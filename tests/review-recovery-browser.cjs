/* Verified historical approvals restore without migrating records or writing to GitHub. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'/opt/codex/cua_node/lib/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const {setup}=require('../tools/puzzle-catalogue.cjs'),{environment}=require('../tools/puzzle-environment.cjs');
const {snapshotReader}=require('../tools/puzzle-review-build.cjs'),R=require('../js/friends/review-repository.js');
const {remoteServer,installRemote}=require('./review-repository-support.cjs');
const {FK}=setup(),C=FK.puzzleCatalogue,games=FK.friendsLibrary.catalogue();
const syntheticReady=[];
const snapshot=process.env.WALDPOST_REVIEW_SNAPSHOT,ledger=snapshot?JSON.parse(fs.readFileSync(snapshot)):R.empty();
if(!snapshot){
 const old=environment({read:snapshotReader('d030f8d0919c980ecf7fc49b80f9785ded68e09b').read,review:false});old.execute('js/friends/puzzle-implementation.js');
 for(const game of games){
  const previous=old.FK.puzzleCatalogue;
  if(C.acceptsRevision(game.id,null,previous.puzzleRevision(game.id))&&C.iterations(game.id).every(it=>previous.iterations(game.id).some(p=>p.id===it.id&&C.acceptsRevision(game.id,it.id,previous.iterationRevision(game.id,p)))))syntheticReady.push(game.id);
  for(const item of [null,...old.FK.puzzleCatalogue.iterations(game.id)]){
   const key=item?.id||'puzzle:'+game.id,revision=item?old.FK.puzzleCatalogue.iterationRevision(game.id,item):old.FK.puzzleCatalogue.puzzleRevision(game.id);
   ledger.entries[key+'@'+revision]={key,revision,status:'approved',note:item?'':'Ursprünglicher Kommentar.',at:'2026-11-17T20:00:00Z',seen:true};
  }
 }
 const key='puzzle:friends-bird',revision=C.puzzleRevision('friends-bird');ledger.entries[key+'@'+revision]={key,revision,status:'approved',note:'Späterer Kommentar.',at:'2026-11-17T21:00:00Z',seen:true};
 ledger.deletedNotes=[{key:'puzzle:friends-beaver',note:'Ursprünglicher Kommentar.',at:'2026-11-17T21:00:00Z'}];
}
const expected=snapshot?JSON.parse(fs.readFileSync(process.env.WALDPOST_REVIEW_EXPECTED)).rows:null;
const initialReady=expected?expected.filter(r=>r.ready).map(r=>r.id):syntheticReady;
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 try{
  const server=remoteServer(ledger),errors=[];
  async function reader(){
   const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,reducedMotion:'reduce',serviceWorkers:'block'});
   await installRemote(context,server);await context.route('**/js/friends/game.js',r=>r.fulfill({contentType:'application/javascript',body:'// Review storage fixture.'}));
   const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(60000);
   await page.goto((process.env.FARBTUPF_BASE_URL||'http://127.0.0.1:8000')+'/?screen=puzzle-review');
   const [a,b]=(await page.locator('.gate-task').innerText()).match(/\d+/g).map(Number);await page.getByLabel('Deine Antwort',{exact:true}).fill(String(a*b));await page.locator('.gate-submit').click();
   await page.waitForFunction(()=>FK.current()==='puzzle-review'&&FK.reviewRepository.state.phase==='saved');return {context,page};
  }
  const state=page=>page.evaluate(()=>FK.friendsLibrary.catalogue().map(g=>({id:g.id,ready:FK.puzzleReview.ready(g.id),...FK.puzzleReview.progress(g.id),puzzle:FK.puzzleReview.status(g.id).status,stale:FK.puzzleReview.status(g.id).stale,feedback:FK.puzzleReview.feedback(g.id).length})));
  const {context,page}=await reader(),restored=await state(page);
  assert.deepEqual(restored.filter(r=>r.ready).map(r=>r.id),initialReady);
  if(expected)assert.deepEqual(restored,expected.map(({latest,...row})=>row));
  if(!snapshot){
   assert.equal(await page.evaluate(()=>FK.puzzleReview.status('friends-bird').decision.note),'Späterer Kommentar.');
   assert.equal(await page.evaluate(()=>FK.puzzleReview.feedback('friends-beaver').length),0,'deleted historical comments remain deleted');
   assert.equal(await page.evaluate(()=>FK.puzzleReview.status('friends-beaver').decision.at),'2026-11-17T20:00:00Z','recovery preserves the original timestamp');
  }
  const storage=await page.evaluate(()=>JSON.parse(localStorage.getItem(FK.puzzleReview.key)));assert.deepEqual(storage.repository.pending,{});assert.equal(server.writes.length,0);assert.deepEqual(server.ledger,ledger);
  await page.screenshot({path:'/tmp/waldpost-review-recovered.png'});
  await page.evaluate(()=>FK.puzzleReview.openGallery());await page.waitForFunction(()=>FK.current()==='puzzle-gallery');assert.equal(await page.locator('.gallery-puzzle').count(),initialReady.length,'restored approvals really re-enter the playable gallery');
  await page.reload();await page.waitForFunction(()=>FK.reviewRepository.state.phase==='saved');assert.deepEqual(await state(page),restored);
  // A later restriction still wins, even when written by another app revision.
  const item=C.iterations('friends-beaver')[0],entry={key:item.id,revision:'later-unknown-renderer',status:'improve',note:'Späterer Hinweis hat Vorrang.',at:'2099-01-01T00:00:00Z',seen:true},next=server.ledger;next.entries[R.address(entry)]=entry;server.ledger=next;
  await page.evaluate(()=>FK.reviewRepository.refresh());assert.equal(await page.evaluate(()=>FK.puzzleReview.ready('friends-beaver')),false);
  assert.equal(await page.evaluate(key=>FK.puzzleReview.status('friends-beaver',key).decision.note,item.id),entry.note);
  const fresh=await reader();assert.equal(await fresh.page.evaluate(()=>FK.puzzleReview.ready('friends-beaver')),false,'a fresh device also respects the later flag');
  server.offline=true;await page.reload();await page.waitForFunction(()=>FK.reviewRepository.state.phase==='error');assert.equal(await page.evaluate(()=>FK.puzzleReview.ready('friends-beaver')),false,'the flag survives offline restart');
  assert.equal(await page.evaluate(()=>FK.reviewRepository.state.pending),0);assert.equal(server.writes.length,0);assert.deepEqual(server.ledger,next);assert.deepEqual(errors,[]);
  await fresh.context.close();await context.close();console.log('PASS '+initialReady.length+' historical puzzle releases: gallery, unchanged timestamps, comments, deletions, fresh devices, later rejection, offline and zero GitHub writes.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
