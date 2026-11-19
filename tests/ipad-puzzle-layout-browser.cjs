/* Every finite task must fit iPad play without scrolling. Disposable storage and review API only. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'/opt/codex/cua_node/lib/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const {installRemote}=require('./review-repository-support.cjs');
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});try{
 const context=await browser.newContext({viewport:{width:1024,height:650},hasTouch:true,reducedMotion:'reduce',serviceWorkers:'block'});await installRemote(context);
 await context.route('**/js/friends/game.js',r=>r.fulfill({contentType:'application/javascript',body:'// Isolated layout fixture.'}));
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto((process.env.FARBTUPF_BASE_URL||'http://127.0.0.1:8000')+'/?screen=puzzle-review');await page.locator('.gate-task').waitFor();const [a,b]=(await page.locator('.gate-task').textContent()).match(/\d+/g).map(Number);await page.getByLabel('Deine Antwort',{exact:true}).fill(String(a*b));await page.locator('.gate-submit').click();await page.waitForFunction(()=>FK.current()==='puzzle-review');await page.evaluate(()=>document.fonts.ready);
 await page.evaluate(()=>{FK.friendsLibrary.canPlay=()=>true;FK.puzzleReview.ready=()=>true;});
 let total=0;
 for(const [width,height]of [[1024,650],[1024,700],[1080,810],[1280,820],[768,980]]){
  await page.setViewportSize({width,height});
  const result=await page.evaluate(()=>{
   let count=0;const failures=[];
   for(const g of FK.friendsLibrary.catalogue())for(const it of FK.puzzleCatalogue.iterations(g.id)){
    const states=it.question.kind==='treasure'?[{}, {hidden:true}]:it.question.kind==='picnic'?[{}, {plates:Array(it.question.friends).fill(it.question.each)}]:[{}];
    for(const work of states){
     FK.puzzleRounds.start=()=>({id:g.id,seed:1,round:0,solved:false,work,questions:Array(5).fill(it.question),iterationIds:Array(5).fill(it.id),gallery:true});FK.go('puzzle',{game:g.id});
     const root=document.querySelector('.screen-puzzle'),paper=root.querySelector('.puzzle-paper'),back=root.querySelector('.puzzle-context>.btn-back'),portrait=root.querySelector('.puzzle-context>.forest-portrait');
     const over=paper.scrollHeight-paper.clientHeight;
     if(over>1||root.scrollWidth>root.clientWidth+1||!back||back.nextElementSibling!==portrait||root.querySelector('.topbar'))failures.push({id:it.id,work,over});
     count++;
    }
   }
   const g=FK.friendsLibrary.catalogue()[0];
   FK.puzzleRounds.start=()=>({id:g.id,round:5,questions:Array(5),gallery:true});FK.go('puzzle',{game:g.id});
   const paper=document.querySelector('.screen-puzzle .puzzle-paper');
   if(paper.scrollHeight>paper.clientHeight+1)failures.push({id:'celebration',over:paper.scrollHeight-paper.clientHeight});
   return {count,failures};
  });
  assert.deepEqual(result.failures,[],width+' × '+height+' task overflow/navigation');total+=result.count;
 }
 // The shortened header also fits a narrow phone, with ordinary vertical scroll available.
 await page.setViewportSize({width:390,height:844});await page.evaluate(()=>FK.puzzleReview.preview('friends-bird','friends-bird/rhyme-2'));
 assert.equal(await page.locator('.screen-puzzle').evaluate(n=>n.scrollWidth>n.clientWidth+1),false);
 await page.locator('.screen-puzzle .btn-back').focus();await page.keyboard.press('Enter');await page.waitForFunction(()=>FK.current()==='puzzle-review');
 await page.getByRole('button',{name:'Zur Puzzle-Übersicht',exact:true}).click();
 assert.equal(await page.locator('[data-puzzle="friends-squirrel"] b').textContent(),'Mengen zählen');
 assert.equal(await page.locator('[data-puzzle="friends-squirrel"]>span:not(.review-status):not(.forest-portrait)').count(),0,'no duplicate subtitle');
 if(process.env.FARBTUPF_SHOTS){fs.mkdirSync(process.env.FARBTUPF_SHOTS,{recursive:true});await page.setViewportSize({width:1280,height:854});await page.evaluate(()=>FK.puzzleReview.preview('friends-bird','friends-bird/rhyme-2'));await page.screenshot({path:process.env.FARBTUPF_SHOTS+'/ipad-rhyme.png'});}
 assert.deepEqual(errors,[]);console.log('PASS '+total+' iPad task/state layouts: no scrolling, inline return arrow, memory phases, distributed berries, phone and keyboard return.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
