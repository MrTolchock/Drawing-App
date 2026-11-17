/* The actual forest: route along the Steg, stop at Frosch, walk back and keep manual input out of the bog. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'/opt/codex/cua_node/lib/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const {installRemote}=require('./review-repository-support.cjs');
const base=process.env.FARBTUPF_BASE_URL||'http://127.0.0.1:8000',out=process.env.FARBTUPF_SHOTS||'/tmp/waldpost-swamp';fs.mkdirSync(out,{recursive:true});
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage','--use-angle=swiftshader','--enable-unsafe-swiftshader']});try{
 const context=await browser.newContext({viewport:{width:1080,height:810},hasTouch:true,reducedMotion:'reduce',serviceWorkers:'block'}),remote=await installRemote(context),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(60000);
 await page.goto(base+'/?software=1');await page.waitForFunction(()=>!!window.FK?.friendsForest&&!!FK.friendsView,null,{timeout:120000});
 await page.getByRole('button',{name:'Dein Brief',exact:true}).click();await page.getByRole('button',{name:'Zum Freund gehen',exact:true}).click();await page.waitForFunction(()=>FK.friendsView().area==='forest');
 await page.evaluate(()=>{
  FK.friendsForest.weather(false);window.swampSamples=[];window.swampFailures=[];
  const record=FK.friends.record;FK.friends.record=function(event,data){if(event==='route_failure')swampFailures.push(data);return record.call(this,event,data);};
  const sample=()=>{const F=FK.friendsForest,p=F.position,T=F.world.terrain;if(T.swampMask(p.x,p.z)>.3)swampSamples.push({x:p.x,z:p.z,deck:T.onCrossing(p.x,p.z)?.c.kind==='planks'});window.swampFrame=requestAnimationFrame(sample);};sample();
 });
 const arrive=async(x,z)=>{try{await page.waitForFunction(([x,z])=>Math.hypot(FK.friendsForest.position.x-x,FK.friendsForest.position.z-z)<.12,[x,z],{timeout:120000});}catch(error){console.error(await page.evaluate(()=>({position:FK.friendsForest.position,destination:FK.friendsForest.destination,view:FK.friendsView(),samples:swampSamples.length,failures:swampFailures})));throw error;}};
 for(const [width,height]of [[1080,810],[390,844]]){
  await page.setViewportSize({width,height});
  await page.evaluate(()=>FK.friendsForest.teleport(-9.5,58));
  await page.locator('.screen:not([hidden]) .ff-nav').getByRole('button',{name:'Bildkarte',exact:true}).click();
  const pin=page.locator('.ff-map-storybook [data-place="frog"]');await pin.scrollIntoViewIfNeeded();await pin.tap();await arrive(-27.2,83.7);
  const atFrog=await page.evaluate(()=>({position:FK.friendsForest.position,near:FK.friendsForest.near,ground:FK.friendsForest.soundscape.ground}));assert.equal(atFrog.near,'frog');assert.equal(atFrog.ground,'wood');
  console.log('PASS Steg arrival at Frosch, viewport '+width);
  await page.screenshot({path:out+'/frog-'+width+'.png'});
  await page.evaluate(()=>FK.friendsForest.walkTo(-9.5,58));await arrive(-9.5,58);
  console.log('PASS Steg return to shore, viewport '+width);
  // The actual movement engine must stop continuous steering at the deck edge, not enter dry bog.
  const steering=await page.evaluate(()=>{
   const F=FK.friendsForest;F.teleport(-17.25,73.75);const before=F.position,time=FK.friendsView().time;
   for(let i=0;i<120;i++){F.update(1/60,time+i/60,{keys:new Set(),stick:{x:1,z:0}});const p=F.position;swampSamples.push({...p,deck:F.world.terrain.onCrossing(p.x,p.z)?.c.kind==='planks'});}
   for(let i=0;i<30;i++)F.update(1/60,time+2+i/60,{keys:new Set(),stick:{x:0,z:0}});
   return {before,after:F.position};
  });assert.ok(steering.after.x-steering.before.x>.3&&steering.after.x-steering.before.x<.8,'steering moves to the edge and stops');
  assert.equal(await page.evaluate(()=>FK.friendsForest.world.terrain.onCrossing(FK.friendsForest.position.x,FK.friendsForest.position.z)?.c.kind),'planks');
  // A ground destination in the bog is projected onto a deck/shore; it cannot enable a shortcut.
  await page.evaluate(()=>FK.friendsForest.walkTo(-16,73.75));await page.waitForTimeout(1200);await page.screenshot({path:out+'/edge-'+width+'.png'});
 }
 const result=await page.evaluate(()=>{cancelAnimationFrame(swampFrame);return {samples:swampSamples.length,offDeck:swampSamples.filter(s=>!s.deck),routeFailures:swampFailures};});
 assert.ok(result.samples>100);assert.deepEqual(result.offDeck,[]);assert.deepEqual(result.routeFailures,[]);assert.deepEqual(errors,[]);assert.equal(remote.writes.length,0);
 fs.writeFileSync(out+'/report.json',JSON.stringify(result,null,2)+'\n');await context.close();console.log('PASS phone/tablet Steg journeys in both directions, Frosch arrival, continuous steering collision, bog destinations and zero off-deck frames.');
}finally{await browser.close();}})().catch(error=>{console.error(error);process.exitCode=1;});
