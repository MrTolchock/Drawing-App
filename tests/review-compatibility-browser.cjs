/* Fresh readers recover compatible approvals and reopen actual changed artwork. All APIs are intercepted. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'/opt/codex/cua_node/lib/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const {remoteServer,installRemote}=require('./review-repository-support.cjs'),{setup}=require('../tools/puzzle-catalogue.cjs');
const {empty}=require('../js/friends/review-repository.js'),{FK}=setup(),C=FK.puzzleCatalogue,id='friends-squirrel';
const ledger=process.env.WALDPOST_REVIEW_SNAPSHOT?JSON.parse(fs.readFileSync(process.env.WALDPOST_REVIEW_SNAPSHOT)):empty();
const compatible=C.formerPuzzleRevisions(id).length>0;
let former=C;
if(!compatible){const {snapshotReader}=require('../tools/puzzle-review-build.cjs'),{environment}=require('../tools/puzzle-environment.cjs'),env=environment({read:snapshotReader('4797c63611ea60aac33079440407d5fb5477bf80').read,review:false});env.execute('js/friends/puzzle-implementation.js');former=env.FK.puzzleCatalogue;}
const earlierIteration=it=>compatible?C.formerIterationRevisions(id,it)[0]:former.iterationRevision(id,former.iterations(id).find(old=>old.id===it.id));
const earlierPuzzle=compatible?C.formerPuzzleRevisions(id)[0]:former.puzzleRevision(id);
if(!process.env.WALDPOST_REVIEW_SNAPSHOT){
 for(const it of C.iterations(id)){const revision=earlierIteration(it);ledger.entries[it.id+'@'+revision]={key:it.id,revision,status:'approved',note:'Earlier inspected fixture',at:'2026-11-14T12:00:00Z',seen:true};}
 const key='puzzle:'+id,revision=earlierPuzzle;ledger.entries[key+'@'+revision]={key,revision,status:'approved',note:'Earlier inspected fixture',at:'2026-11-14T12:00:00Z',seen:true};
}
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});try{
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,reducedMotion:'reduce',serviceWorkers:'block'}),server=remoteServer(ledger),errors=[];
 await installRemote(context,server);await context.route('**/js/friends/game.js',r=>r.fulfill({contentType:'application/javascript',body:'// Isolated adult review UI.'}));
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(60000);
 await page.goto((process.env.FARBTUPF_BASE_URL||'http://127.0.0.1:8000')+'/?screen=puzzle-review');await page.locator('.gate-task').waitFor();
 const [a,b]=(await page.locator('.gate-task').textContent()).match(/\d+/g).map(Number);await page.getByLabel('Deine Antwort',{exact:true}).fill(String(a*b));await page.locator('.gate-submit').click();
 await page.waitForFunction(()=>FK.current()==='puzzle-review'&&FK.reviewRepository.state.phase==='saved');
 const result=await page.evaluate(()=>({ready:FK.puzzleReview.ready('friends-squirrel'),progress:FK.puzzleReview.progress('friends-squirrel'),pending:FK.reviewRepository.state.pending,connected:FK.reviewRepository.state.connected}));
 assert.deepEqual(result,{ready:compatible,progress:{total:25,approved:compatible?25:0,improve:0,pending:compatible?0:25},pending:0,connected:false});assert.deepEqual(server.ledger,ledger);assert.equal(server.writes.length,0);
 await page.locator('[data-puzzle="friends-squirrel"]').click();await page.screenshot({path:'/tmp/waldpost-restored-squirrel.png'});
 await page.reload();await page.waitForFunction(()=>FK.reviewRepository.state.phase==='saved');assert.equal(await page.evaluate(()=>FK.puzzleReview.ready('friends-squirrel')),compatible);
 // A later flag from an older compatible app still blocks release, and remains blocked offline.
 const next=server.ledger,key=C.iterations(id)[0].id,revision=earlierIteration(C.iterations(id)[0]);next.entries[key+'@'+revision]={key,revision,status:'improve',note:'Newer fixture rejection',at:'2099-01-01T00:00:00Z',seen:true};server.ledger=next;
 await page.evaluate(()=>FK.reviewRepository.refresh());assert.equal(await page.evaluate(()=>FK.puzzleReview.ready('friends-squirrel')),false);assert.equal(await page.evaluate(()=>FK.puzzleReview.status('friends-squirrel','friends-squirrel/count-0').status),compatible?'improve':'pending');
 server.offline=true;await page.reload();await page.waitForFunction(()=>FK.reviewRepository.state.phase==='error');assert.equal(await page.evaluate(()=>FK.puzzleReview.ready('friends-squirrel')),false);assert.equal(server.writes.length,0);assert.deepEqual(errors,[]);
 await context.close();console.log('PASS '+(compatible?'compatible historical approval recovery':'changed gallery artwork reopens pre-redraw approvals')+': fresh reader, no token/outbox/writes, reload, later rejection and offline cache.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
