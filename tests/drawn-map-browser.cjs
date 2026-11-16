/* Real touch/keyboard activation of every named pin, with intercepted review storage. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'/opt/codex/cua_node/lib/node_modules/playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
const {installRemote}=require('./review-repository-support.cjs'),base=process.env.FARBTUPF_BASE_URL||'http://127.0.0.1:8000',out=process.env.FARBTUPF_SHOTS||'/tmp/waldpost-drawn-map';fs.mkdirSync(out,{recursive:true});
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});try{
 const context=await browser.newContext({viewport:{width:1080,height:810},hasTouch:true,reducedMotion:'reduce',serviceWorkers:'block'}),remote=await installRemote(context),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(60000);
 await page.goto(base+'/?software=1');await page.waitForFunction(()=>!!window.FK?.friendsView,null,{timeout:120000});await page.getByRole('button',{name:'Dein Brief',exact:true}).click();await page.getByRole('button',{name:'Zum Freund gehen',exact:true}).click();
 await page.evaluate(()=>{window.mapEvents=[];const record=FK.friends.record;FK.friends.record=function(event,data){if(['movement_destination','route_failure'].includes(event))window.mapEvents.push({event,...data});return record.call(this,event,data);};});
 const active=()=>page.locator('.screen:not([hidden])'),open=async()=>{await active().locator('.ff-nav').getByRole('button',{name:'Bildkarte',exact:true}).click();await active().locator('.ff-map-storybook').waitFor();};
 const results=[];
 for(const [width,height]of [[1080,810],[390,844],[844,390]]){
  await page.setViewportSize({width,height});await open();const board=active().locator('.ff-map-storybook'),pins=board.locator('button[data-place]'),ids=await pins.evaluateAll(nodes=>nodes.map(n=>n.dataset.place));assert.equal(ids.length,13);assert.ok(ids.includes('ibex'));assert.match(await board.evaluate(n=>getComputedStyle(n).backgroundImage),/world-map.webp/);
  const rects=await pins.evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return {id:n.dataset.place,x:r.x,y:r.y,w:r.width,h:r.height,label:n.querySelector('.ff-map-pin-label')?.textContent,art:n.querySelector('[data-character]')?.dataset.character};}));
  for(const pin of rects){assert.ok(pin.w>=64&&pin.h>=64,pin.id+' touch size');assert.ok(pin.label,pin.id+' visible name');if(pin.id!=='home')assert.equal(pin.art,pin.id);}
  for(let i=0;i<rects.length;i++)for(let j=0;j<i;j++)assert.ok(rects[i].x+rects[i].w<=rects[j].x||rects[j].x+rects[j].w<=rects[i].x||rects[i].y+rects[i].h<=rects[j].y||rects[j].y+rects[j].h<=rects[i].y,'separate hit boxes');
  await page.screenshot({path:out+'/map-'+width+'.png'});
  for(let i=0;i<ids.length;i++){
   if(i)await open();const id=ids[i],pin=active().locator('.ff-map-storybook button[data-place="'+id+'"]');await pin.scrollIntoViewIfNeeded();
   assert.ok(await pin.evaluate(n=>{const r=n.getBoundingClientRect();return [[0,0],[-16,0],[16,0],[0,-16],[0,16]].every(([x,y])=>document.elementFromPoint(r.x+r.width/2+x,r.y+r.height/2+y)?.closest('button')===n);}),id+' unobstructed hit area');
   const before=await page.evaluate(()=>mapEvents.length);await pin.tap();await page.waitForFunction(count=>mapEvents.length>count,before);const event=await page.evaluate(()=>mapEvents.at(-1));assert.equal(event.event,'movement_destination',id+' starts a real walking route');assert.equal(event.destination,id);assert.equal(await active().locator('.ff-map-storybook').count(),0,'tap closes the map');results.push({width,id,route:true});
  }
 }
 await open();const keyboard=active().locator('.ff-map-storybook button[data-place="ibex"]');await keyboard.focus();const before=await page.evaluate(()=>mapEvents.length);await keyboard.press('Enter');await page.waitForFunction(count=>mapEvents.length>count,before);assert.equal(await page.evaluate(()=>mapEvents.at(-1).destination),'ibex');
 assert.equal(await page.evaluate(()=>FK.friends.mail().session.completed),0);assert.equal(remote.writes.length,0);assert.deepEqual(errors,[]);fs.writeFileSync(out+'/report.json',JSON.stringify({pins:results,keyboard:true,reviewWrites:0},null,2)+'\n');await context.close();console.log('PASS all 13 painted/named map pins at tablet, phone and landscape sizes: distinct hit areas, unobstructed touch, actual routes and keyboard activation.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
