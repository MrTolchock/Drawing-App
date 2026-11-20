/* Every finite task must fit iPad play without scrolling or stretching artwork. Disposable storage and review API only. */
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
 for(const [width,height]of [[1024,650],[1024,700],[1080,695],[1080,790],[1080,810],[1280,820],[768,980],[810,1060],[390,844]]){
  await page.setViewportSize({width,height});
  const result=await page.evaluate(()=>{
   let count=0;const failures=[],distorted=[];
   for(const g of FK.friendsLibrary.catalogue())for(const it of FK.puzzleCatalogue.iterations(g.id)){
    const states=it.question.kind==='treasure'?[{}, {hidden:true}]:it.question.kind==='picnic'?[{}, {plates:Array(it.question.friends).fill(it.question.each)}]:it.question.kind==='order'?[{}, {order:[0,null,1]}, {order:[0,1,2]}]:it.question.kind==='mirror'?[{}, {mirror:it.question.answer}]:[{}];
    for(const work of states){
     FK.puzzleRounds.start=()=>({id:g.id,seed:1,round:0,solved:false,work,questions:Array(5).fill(it.question),iterationIds:Array(5).fill(it.id),gallery:true});FK.go('puzzle',{game:g.id});
     const root=document.querySelector('.screen-puzzle'),paper=root.querySelector('.puzzle-paper'),back=root.querySelector('.puzzle-context>.btn-back'),portrait=root.querySelector('.puzzle-context>.forest-portrait');
     const over=paper.scrollHeight-paper.clientHeight;
     if((innerWidth>600&&over>1)||root.scrollWidth>root.clientWidth+1||!back||back.nextElementSibling!==portrait||root.querySelector('.topbar')||root.querySelector('.puzzle-round'))failures.push({id:it.id,work,over});
     if(innerWidth>600){
      const bounds=paper.getBoundingClientRect();
      for(const control of paper.querySelectorAll('button,[data-neighbour-slot]')){
       const r=control.getBoundingClientRect();
       if(r.width&&r.height&&(r.left<bounds.left-1||r.right>bounds.right+1||r.top<bounds.top-1||r.bottom>bounds.bottom+1))failures.push({id:it.id,work,clippedControl:control.getAttribute('aria-label')});
      }
     }
     // Atlas cells and painted portraits are square; a non-square CSS box stretches their original pixels.
     for(const art of root.querySelectorAll('.wa-illustration,.forest-portrait')){
      const style=getComputedStyle(art),w=parseFloat(style.width),h=parseFloat(style.height);
      if(w<=0||h<=0||Math.abs(w-h)>.1)distorted.push({id:it.id,subject:art.dataset.subject||art.className,w,h});
     }
     for(const pair of root.querySelectorAll('.puzzle-picture-composite')){
      const bounds=pair.getBoundingClientRect();
      for(const item of pair.children){const r=item.getBoundingClientRect();if(r.left<bounds.left-1||r.top<bounds.top-1||r.right>bounds.right+1||r.bottom>bounds.bottom+1)failures.push({id:it.id,work,pairedPictureOverflow:true});}
     }
     count++;
    }
   }
   const g=FK.friendsLibrary.catalogue()[0];
   FK.puzzleRounds.start=()=>({id:g.id,round:5,questions:Array(5),gallery:true});FK.go('puzzle',{game:g.id});
   const paper=document.querySelector('.screen-puzzle .puzzle-paper');
   if(innerWidth>600&&paper.scrollHeight>paper.clientHeight+1)failures.push({id:'celebration',over:paper.scrollHeight-paper.clientHeight});
   return {count,failures,distorted};
  });
  assert.deepEqual(result.failures,[],width+' × '+height+' task overflow/navigation');
  assert.deepEqual(result.distorted,[],width+' × '+height+' original artwork proportions');total+=result.count;
  // A short task must use the page's height as well as fitting inside it.
  if(width>600){
   const balance=await page.evaluate(()=>{
    const it=FK.puzzleCatalogue.iterations('vowels').find(it=>it.question.word==='Nest');
    FK.puzzleRounds.start=()=>({id:'vowels',seed:1,round:0,solved:false,work:{},questions:Array(5).fill(it.question),iterationIds:Array(5).fill(it.id),gallery:true});FK.go('puzzle',{game:'vowels'});
    const paper=document.querySelector('.screen-puzzle .puzzle-paper'),bounds=paper.getBoundingClientRect(),scene=paper.querySelector('.puzzle-scene').getBoundingClientRect(),answers=paper.querySelector('.puzzle-answers').getBoundingClientRect();
    const style=selector=>{const s=getComputedStyle(paper.querySelector(selector));return {width:s.width,height:s.height,border:s.border,borderRadius:s.borderRadius,backgroundColor:s.backgroundColor,boxShadow:s.boxShadow};};
    const text=[...paper.querySelectorAll('.puzzle-context>span:not(.forest-portrait),.puzzle-prompt,.puzzle-read-text,.puzzle-answer')].map(el=>{const s=getComputedStyle(el);return {font:s.fontFamily,size:s.fontSize};});
    return {height:bounds.height,scene:scene.height,answerBottom:answers.bottom-bounds.top,answerGap:answers.top-scene.bottom,back:style('.btn-back'),speaker:style('.puzzle-listen'),text,wordSize:getComputedStyle(paper.querySelector('.puzzle-read-text')).fontSize,answerSize:getComputedStyle(paper.querySelector('.puzzle-answer')).fontSize};
   });
   assert.ok(balance.scene>=balance.height*.4,'task uses the middle of the page '+width+' × '+height);
   assert.ok(balance.answerBottom>=balance.height*.85&&balance.answerBottom<=balance.height-12,'answers use the lower page with breathing room');
   assert.ok(balance.answerGap>=12&&balance.answerGap<=24,'task and answers stay together');
   assert.deepEqual(balance.back,balance.speaker,'quiet matching back and speaker controls');
   assert.ok(parseFloat(balance.back.width)>=48,'complete touch targets');
   assert.ok(balance.text.every(t=>t.font.includes('Andika')),'one puzzle font');
   assert.equal(new Set(balance.text.map(t=>t.size)).size,3,'three consistent text roles');
   assert.equal(balance.wordSize,balance.answerSize,'word and offered letters use the same size');
   if(process.env.FARBTUPF_SHOTS){fs.mkdirSync(process.env.FARBTUPF_SHOTS,{recursive:true});await page.screenshot({path:process.env.FARBTUPF_SHOTS+'/vowels-'+width+'x'+height+'.png'});}
  }
 }
 // The shortened header also fits a narrow phone, with ordinary vertical scroll available.
 await page.setViewportSize({width:390,height:844});await page.evaluate(()=>FK.puzzleReview.preview('friends-bird','friends-bird/rhyme-2'));
 assert.equal(await page.locator('.screen-puzzle').evaluate(n=>n.scrollWidth>n.clientWidth+1),false);
 await page.locator('.screen-puzzle .btn-back').focus();await page.keyboard.press('Enter');await page.waitForFunction(()=>FK.current()==='puzzle-review');
 await page.getByRole('button',{name:"Zur Rätsel-Übersicht",exact:true}).click();
 assert.equal(await page.locator('[data-puzzle="friends-squirrel"] b').textContent(),'Mengen zählen');
 assert.equal(await page.locator('[data-puzzle="friends-squirrel"]>span:not(.review-status):not(.forest-portrait)').count(),0,'no duplicate subtitle');
 if(process.env.FARBTUPF_SHOTS){fs.mkdirSync(process.env.FARBTUPF_SHOTS,{recursive:true});await page.setViewportSize({width:1280,height:854});await page.evaluate(()=>FK.puzzleReview.preview('friends-bird','friends-bird/rhyme-2'));await page.screenshot({path:process.env.FARBTUPF_SHOTS+'/ipad-rhyme.png'});}
 assert.deepEqual(errors,[]);console.log('PASS '+total+' iPad/phone task/state layouts: original artwork proportions, no iPad scrolling, inline return arrow, memory phases, distributed berries and keyboard return.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
