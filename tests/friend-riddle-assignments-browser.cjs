/* Current assignments through the adult gallery and shared task renderer. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'/opt/codex/cua_node/lib/node_modules/playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {installRemote,seedFromPage}=require('./review-repository-support.cjs');
const base=process.env.FARBTUPF_BASE_URL||'http://127.0.0.1:8000';
const output=process.env.FARBTUPF_SHOTS||'/tmp/waldpost-friend-assignments';

(async()=>{
 const browser=await chromium.launch({
  executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',
  args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']
 });
 try{
  fs.mkdirSync(output,{recursive:true});
  const context=await browser.newContext({viewport:{width:1024,height:700},hasTouch:true,reducedMotion:'reduce',serviceWorkers:'block'});
  const remote=await installRemote(context);
  await context.route('**/js/friends/game.js',route=>route.fulfill({contentType:'application/javascript',body:'// Isolated adult gallery.'}));
  const page=await context.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base+'/?screen=puzzle-review');
  await page.locator('.gate-task').waitFor();
  const [a,b]=(await page.locator('.gate-task').textContent()).match(/\d+/g).map(Number);
  await page.getByLabel('Deine Antwort',{exact:true}).fill(String(a*b));
  await page.locator('.gate-submit').click();
  await page.waitForFunction(()=>FK.current()==='puzzle-review');
  await page.evaluate(()=>document.fonts.ready);
  const games=await page.evaluate(()=>FK.friendsLibrary.catalogue());
  const hosts=await page.evaluate(()=>Object.fromEntries(Object.entries(FriendsContent.hosts).map(([id,host])=>[id,host.name])));
  assert.equal(games.length,24);
  await seedFromPage(page,remote,games.map(game=>game.id));
  const snapshot=()=>page.evaluate(()=>Object.fromEntries(Object.entries(localStorage).filter(([key])=>!key.startsWith('farbtupf.puzzle-review.'))));
  const before=await snapshot();
  const active=()=>page.locator('.screen:not([hidden])');
  const cardSize=async()=>{
   const sizes=await active().locator('.review-puzzle').evaluateAll(nodes=>nodes.map(node=>{
    const {width,height}=node.getBoundingClientRect();
    return {width:Math.round(width*100)/100,height:Math.round(height*100)/100,overflow:node.scrollWidth>node.clientWidth+1||node.scrollHeight>node.clientHeight+1};
   }));
   assert.equal(sizes.length,24,'all puzzle tiles are measured');
   assert.ok(sizes.every(size=>Math.abs(size.width-sizes[0].width)<1&&Math.abs(size.height-sizes[0].height)<1&&!size.overflow),'all tiles have the same size with no clipped content: '+JSON.stringify(sizes));
   return sizes[0];
  };
  // Use the actual gallery filter and open a normal gallery round at every friend.
  for(const [width,height]of [[1024,700],[390,844]]){
   await page.setViewportSize({width,height});
   await page.evaluate(()=>FK.go('puzzle-gallery'));
   await active().getByRole('button',{name:'Alle (24)',exact:true}).click();
   await page.evaluate(()=>document.fonts.ready);
   const gallerySize=await cardSize();
   await active().locator('.review-grid').evaluate(grid=>grid.scrollIntoView({block:'start'}));
   await page.screenshot({path:output+'/gallery-tiles-'+width+'.png',fullPage:true});
   await page.evaluate(()=>FK.go('puzzle-review'));
   assert.deepEqual(await cardSize(),gallerySize,'gallery and review use the same tile dimensions');
   await active().locator('.review-grid').evaluate(grid=>grid.scrollIntoView({block:'start'}));
   await page.screenshot({path:output+'/review-tiles-'+width+'.png',fullPage:true});
   await page.evaluate(()=>FK.go('puzzle-gallery'));
   for(const [host,name]of Object.entries(hosts)){
    const expected=games.filter(game=>game.host===host).map(game=>game.id).sort();
    assert.equal(expected.length,2,host);
    await active().getByRole('button',{name:name+' (2)',exact:true}).click();
    const cards=active().locator('.gallery-puzzle');
    assert.deepEqual((await cards.evaluateAll(nodes=>nodes.map(node=>node.dataset.puzzle))).sort(),expected);
    assert.deepEqual(await cards.locator('[data-character]').evaluateAll(nodes=>nodes.map(node=>node.dataset.character)),[host,host]);
    await cards.first().click();
    await page.waitForFunction(()=>FK.current()==='puzzle');
    assert.equal(await active().getAttribute('data-host'),host);
    assert.equal(await active().locator('.puzzle-context>[data-character]').getAttribute('data-character'),host);
    assert.equal(await active().locator('.puzzle-progress>span').count(),5);
    await active().locator('.btn-back').click();
    await page.waitForFunction(()=>FK.current()==='puzzle-gallery');
   }
   await page.evaluate(()=>FK.go('puzzle-review'));
   await page.evaluate(()=>FK.puzzleReview.preview('robot','robot/0-3'));
   assert.equal(await active().locator('.post [data-character="deer"]').count(),1);
   assert.equal(await active().locator('.goal [data-subject="forest-fir"]').count(),1);
   assert.equal(await active().locator('.hedge [data-subject="forest-stone"]').count(),2);
   assert.equal(await active().locator('[data-character="mailman"],[data-subject="swiss-postbox"]').count(),0);
   await page.screenshot({path:output+'/deer-route-'+width+'.png'});
   for(const [id,key,selector]of [['add','1-1','.puzzle-addition'],['compare','3-5','.puzzle-compare']]){
    await page.evaluate(({id,key})=>FK.puzzleReview.preview(id,id+'/'+key),{id,key});
    assert.ok(await active().locator(selector+' [data-subject="fish-swim"]').count());
    assert.equal(await active().locator(selector+' [data-subject="forest-apple"],'+selector+' [data-subject="forest-berry"]').count(),0);
    if(id==='add')await page.screenshot({path:output+'/fish-addition-'+width+'.png'});
   }
   for(const [id,key]of [['colour-words','rot-gelb-blau'],['shape-match','square-45']]){
    const question=await page.evaluate(({id,key})=>{
     const item=FK.puzzleCatalogue.iterations(id).find(item=>item.id===id+'/'+key);
     FK.puzzleReview.decide(id,item.id,'pending');
     FK.puzzleReview.preview(id,item.id);
     return item.question;
    },{id,key});
    if(id==='shape-match'){
     const fits=await active().locator('.puzzle-form-sample').evaluate(sample=>{
      const bounds=sample.getBoundingClientRect(),drawing=sample.querySelector('g').getBoundingClientRect();
      return drawing.left>=bounds.left&&drawing.right<=bounds.right&&drawing.top>=bounds.top&&drawing.bottom<=bounds.bottom;
     });
     assert.equal(fits,true,'rotated form stays inside its sample');
    }else assert.equal(await active().locator('.puzzle-answer [data-subject]').count(),3);
    await page.screenshot({path:output+'/'+id+'-'+width+'.png'});
    const wrong=question.choices.map(choice=>Array.isArray(choice)?choice[0]:choice).find(choice=>choice!==question.answer);
    await active().locator('[data-answer="'+wrong+'"]').tap();
    assert.equal(await active().locator('.is-retry').count(),1);
    assert.equal(await page.evaluate(({id,key})=>FK.puzzleReview.status(id,id+'/'+key).status,{id,key}),'pending');
    await active().locator('[data-answer="'+question.answer+'"]').tap();
    assert.equal(await page.evaluate(({id,key})=>FK.puzzleReview.status(id,id+'/'+key).status,{id,key}),'approved');
   }
  }
  assert.deepEqual(await snapshot(),before,'gallery rounds and previews preserve player saves');
  assert.equal(remote.writes.length,0);
  assert.deepEqual(errors,[]);
  console.log('PASS all twelve gallery filters and host portraits, Reh route, fish pictures, both new activities with native touch, preserved player saves and zero remote writes at iPad/phone sizes.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
