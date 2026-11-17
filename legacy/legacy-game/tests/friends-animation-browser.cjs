/* Bed sleep uses real wall-clock animation and skip, independently of letters.
   Retained legacy balances/inventory must never be charged or rewarded. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'/opt/codex/cua_node/lib/node_modules/playwright');
const {create}=require('../js/friends/state.js'),content=require('../js/friends/content.js'),assert=require('node:assert/strict');
const data=new Map(),storage={getItem:key=>data.get(key)??null,setItem:(key,value)=>data.set(key,value),removeItem:key=>data.delete(key)};
const fixture=create({storage,content}),saved=fixture.get();
saved.wallet.nuts=7;saved.wallet.feathers=4;saved.inventory.apple=2;saved.inventory.bath=1;
const legacyKeys={'farbklecks.progress.v1':'{"stars":47,"done":{"old":1}}','farbtupf.forest.v1':'{"version":1,"furniture":{"chair":true}}'};
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 try{
  const page=await browser.newPage({viewport:{width:1024,height:900},reducedMotion:'no-preference'}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.addInitScript(({key,raw,legacy})=>{if(localStorage.getItem(key)===null){localStorage.setItem(key,raw);for(const [name,value]of Object.entries(legacy))localStorage.setItem(name,value);}},{key:fixture.key,raw:JSON.stringify(saved),legacy:legacyKeys});
  await page.goto((process.env.FARBTUPF_BASE_URL||'http://127.0.0.1:8000')+'/?software=1');
  await page.waitForFunction(()=>!!window.FK?.friendsView,null,{timeout:60000});
  const read=()=>page.evaluate(()=>FK.friends.get()),bed=page.locator('[data-place="sleep"]');
  assert.equal(await page.locator('.ff-nav [aria-label="Deine Tasche"],[data-place="shop"]').count(),0);
  const before=await read(),start=Date.now();await bed.click();await page.locator('.ff-animation-overlay').waitFor();
  await page.locator('.ff-animation-overlay').waitFor({state:'hidden',timeout:15000});
  const elapsed=Date.now()-start;assert.ok(elapsed>=3500&&elapsed<14000,'bed wall-clock duration '+elapsed);
  assert.equal((await page.evaluate(()=>FK.friendsView())).area,'den');
  await bed.click();await page.locator('.ff-animation-overlay').waitFor();await page.getByRole('button',{name:'Animation überspringen',exact:true}).click();
  assert.equal(await page.locator('.ff-animation-overlay').count(),0);
  const after=await read();assert.deepEqual(after.inventory,before.inventory);assert.deepEqual(after.wallet,before.wallet);assert.deepEqual(after.mail,before.mail);assert.equal(after.animation,null);
  for(const [key,value]of Object.entries(legacyKeys))assert.equal(await page.evaluate(name=>localStorage.getItem(name),key),value);
  assert.equal(await page.evaluate(()=>FK.friends.exportLog().events.filter(event=>['resource_grant','purchase','consumption'].includes(event.event)).length),0);
  assert.deepEqual(errors,[]);console.log('PASS: bed sleep completes in '+elapsed+'ms; skip returns to den; letter, saved legacy balances and inventory remain intact with no grants or charges.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
