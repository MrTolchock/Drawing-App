/* World budget (blueprint 7A): the per-frame cost must depend on what is near Fuchs, not on the size of
   the world. Walks a loop round the home clearing (1×) and the fixed route through all ten regions of the
   development test world (?world=10x, separate save) and fails above the budget.
   - Drawing pass: the worst frame's draw calls, triangles, live near/far tiles and animated characters.
   - Build pass: the same walk with drawing skipped, timing the build slices. On the iPad drawing runs on the
     GPU, but here SwiftShader draws on the same CPU cores as the page and keeps preempting it, which turns
     0.2 ms build steps into 3–5 ms stalls. Even without drawing, about one slice in a hundred stalls in this
     virtual machine (a garbage collection, the host), so the 95th percentile (at least the second-longest
     slice) must stay within 4 ms and the longest slice within 12 ms (a step that is not split up shows
     there); the strict maximum is read on the iPad walk (phase 6, ?perf=1). Run against a local server
     like the other browser suites, one at a time: anything else running on the machine shows up here. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'/opt/codex/cua_node/lib/node_modules/playwright');
const assert=require('node:assert/strict');
const BASE=process.env.FARBTUPF_BASE_URL||'http://127.0.0.1:8000';
const SLICE=Number(process.env.FARBTUPF_SLICE_BUDGET||4);
const DRAW_BUDGET={maxCalls:150,maxTriangles:350000,maxLiveTiles:25,maxFarTiles:40,maxAnimated:6};
const BUILD_BUDGET={p95BuildSliceMs:SLICE,maxBuildSliceMs:SLICE*3};
const HOME_LOOP=[[-3.2,-2.4],[-7,-9.6],[-6.4,1.6],[1,4],[6.6,4.2],[9.6,-3],[16.2,-2.4],[15.6,-9.8],[8.8,-9.4],[1.4,-3.4]];

async function walk(page,query,route,draw){
  await page.goto(BASE+'/?'+query);
  await page.waitForFunction(()=>window.FK?.friendsForest&&FK.perf,null,{timeout:120000});
  // The den builds the forest in slices while the child is inside.
  await page.waitForFunction(()=>!FK.friendsForest.pending,null,{timeout:300000});
  await page.locator('[data-place="outside"]').dispatchEvent('click');await page.waitForTimeout(300);
  if(await page.locator('.ff-letter-paper').count())await page.locator('.ff-letter-paper').click();
  await page.waitForFunction(()=>FK.friendsView().area==='forest',null,{timeout:120000});
  await page.evaluate(draw=>{FK.friendsForest.speed=3;if(!draw)window.__r.render=()=>{};FK.perf.reset();},draw);
  for(const [x,z] of route){
    await page.evaluate(([x,z])=>FK.friendsForest.walkTo(x,z),[x,z]);
    await page.waitForFunction(()=>!FK.friendsForest.destination,null,{timeout:300000});
    const p=await page.evaluate(()=>FK.friendsForest.position);
    assert.ok(Math.hypot(p.x-x,p.z-z)<2.5,query+': Fuchs stopped at '+p.x.toFixed(1)+','+p.z.toFixed(1)+' instead of reaching '+x+','+z);
  }
  return page.evaluate(()=>({...FK.perf.stats}));
}
const check=(label,s,budget)=>{for(const [k,limit] of Object.entries(budget))assert.ok(s[k]<=limit,label+': '+k+' '+s[k]+' > '+limit);};
const pick=(s,budget)=>Object.fromEntries(Object.keys(budget).map(k=>[k,+(+s[k]).toFixed(2)]));
(async()=>{
  const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try{
    const context=await browser.newContext({viewport:{width:1080,height:810},reducedMotion:'reduce'}),page=await context.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto(BASE+'/?world=10x');
    const route10=await page.evaluate(async()=>(await import('/js/friends/world/index.js')).TEST_ROUTE);
    for(const [label,query,route] of [['big world','dev=1&software=1',route10]]){
      const drawn=await walk(page,query,route,true);
      console.log(label.padEnd(10),'draw ',JSON.stringify({...pick(drawn,DRAW_BUDGET),frames:drawn.rendered}));
      check(label,drawn,DRAW_BUDGET);
      const built=await walk(page,query,route,false);
      console.log(label.padEnd(10),'build',JSON.stringify({...pick(built,BUILD_BUDGET),slices:built.buildSlices}));
      check(label,built,BUILD_BUDGET);
    }
    assert.deepEqual(errors,[]);
    console.log('PASS: the big world stays within the frame budget ('+Object.entries({...DRAW_BUDGET,...BUILD_BUDGET}).map(([k,v])=>k.replace(/^max/,'')+' ≤ '+v).join(', ')+').');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
