/* Inspect actual current pages against the visual role contract at phone/tablet sizes. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'/opt/codex/cua_node/lib/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const base=process.env.FARBTUPF_BASE_URL||'http://127.0.0.1:8000',out=process.env.FARBTUPF_SHOTS||'/tmp/design-system';fs.mkdirSync(out,{recursive:true});
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{
 const context=await browser.newContext({viewport:{width:1080,height:810},hasTouch:true,reducedMotion:'reduce'}),page=await context.newPage(),errors=[],missing=[];
 page.setDefaultTimeout(60000);page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
 await context.addInitScript(()=>localStorage.setItem('farbtupf.forest.v1','{"archivedFixture":true}'));
 await page.goto(base+'/?screen=forest&software=1');await page.waitForFunction(()=>FK.current()==='friends');
 assert.equal(await page.evaluate(()=>['forest','forest-book','learn','adventure','expedition','read','dots'].some(s=>FK.screenExists(s))),false);
 assert.equal(await page.evaluate(()=>localStorage.getItem('farbtupf.forest.v1')),'{"archivedFixture":true}');
 const duplicateIds=await page.locator('symbol[id]').evaluateAll(nodes=>nodes.map(n=>n.id).filter((id,i,all)=>all.indexOf(id)!==i));assert.deepEqual(duplicateIds,[]);
 await page.getByRole('button',{name:'Brief öffnen',exact:true}).click();
 assert.match(await page.locator('.ff-letter-friend').evaluate(e=>getComputedStyle(e).backgroundImage),/character-portraits.webp/);
 await page.screenshot({path:out+'/letter-tablet.png'});
 await page.evaluate(()=>FK.puzzleReview.open());await page.locator('.gate-task').waitFor();
 const [a,b]=(await page.locator('.gate-task').textContent()).match(/\d+/g).map(Number);await page.getByLabel('Deine Antwort',{exact:true}).fill(String(a*b));await page.locator('.gate-submit').click();await page.waitForFunction(()=>FK.current()==='puzzle-review');
 await page.evaluate(()=>document.fonts.ready);
 const games=await page.evaluate(()=>FK.friendsLibrary.catalogue()),report=[];
 for(const width of [1080,390]){
  await page.setViewportSize({width,height:width===390?844:810});
  for(const g of games){
   await page.evaluate(id=>FK.puzzleReview.preview(id,FK.puzzleCatalogue.iterations(id)[0].id),g.id);
   const active=page.locator('.screen:not([hidden])');
   if(g.screen==='trace'){await page.waitForFunction(()=>{const e=document.querySelector('.screen-trace .tr-play');return e&&!e.hidden&&getComputedStyle(e).opacity==='1'&&document.querySelectorAll('.tr-track path').length>0;});assert.ok(await page.locator('.tr-paper').evaluate(e=>e.getBoundingClientRect().height>200),'visible writing paper');}
   const result=await active.evaluate(root=>{
    const visible=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
    return {
     overflow:root.scrollWidth>root.clientWidth+2,
     progress:root.querySelectorAll('.puzzle-progress>span').length,
     font:getComputedStyle(root.querySelector('.title')).fontFamily,
     portraits:[...root.querySelectorAll('[data-art-role="character"]')].filter(visible).map(e=>getComputedStyle(e).backgroundImage),
     subjects:[...root.querySelectorAll('.wa-illustration')].filter(visible).map(e=>({id:e.dataset.subject,image:e.style.backgroundImage})),
     explain:[...root.querySelectorAll('button')].filter(e=>visible(e)&&e.getAttribute('aria-label')==='Spiel erklären').length,
     hints:[...root.querySelectorAll('button')].filter(e=>visible(e)&&/^(Tipp|Hinweis|Beispiel|Weiter zur nächsten Aufgabe)/i.test(e.getAttribute('aria-label')||e.textContent)).length,
    };
   });
   assert.equal(result.overflow,false,g.id+' overflow '+width);assert.equal(result.progress,5,g.id+' progress');assert.match(result.font,/Andika/,g.id+' title font');assert.equal(result.explain,0,g.id+' speech tested on puzzle overview');assert.equal(result.hints,0,g.id+' hint');
   assert.ok(result.portraits.length,g.id+' host portrait');for(const image of result.portraits)assert.match(image,/character-portraits.webp/,g.id+' mixed portrait');
   for(const subject of result.subjects)assert.match(subject.image,/assets\/waldatelier\//,g.id+' missing/mixed subject '+subject.id);
   report.push({puzzle:g.id,width,checks:'passed',subjects:result.subjects.length});
   if(['add','friends-owl','trace','read-puzzle'].includes(g.id))await page.screenshot({path:out+'/'+g.id+'-'+width+'.png'});
  }
 }
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);fs.writeFileSync(out+'/report.json',JSON.stringify(report,null,2)+'\n');console.log('Visual contract passed: 34 puzzles × 2 viewports, font/art roles, five leaves, speech on puzzle overview, no hints, current routes and preserved legacy storage.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
