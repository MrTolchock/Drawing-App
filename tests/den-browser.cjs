/* Den repair: real bed, illustrated letter, direct free colouring and reliable return/save paths. */
const{chromium}=require(process.env.PLAYWRIGHT_MODULE||'/opt/codex/cua_node/lib/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const BASE=process.env.FARBTUPF_BASE_URL||'http://127.0.0.1:8000',shots=process.env.FARBTUPF_SHOTS||'/tmp/den-repair';fs.mkdirSync(shots,{recursive:true});
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-angle=swiftshader','--enable-unsafe-swiftshader']});try{
 const context=await browser.newContext({viewport:{width:1024,height:900},hasTouch:true,reducedMotion:'reduce'}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await context.addInitScript(()=>localStorage.setItem('farbklecks.settings.v2',JSON.stringify({'color.tool':{kind:'stamp',colorId:'rot'},'free.tool':{kind:'stamp',colorId:'rot'}})));
 const click=name=>page.getByRole('button',{name,exact:true}).click();
 const snapshot=async name=>{await page.waitForTimeout(350);await page.screenshot({path:shots+'/'+name+'.png',animations:'disabled'});};
 const ready=()=>page.waitForFunction(()=>!!window.FK?.friendsView,null,{timeout:60000});
 const waitForStored=async read=>{const until=Date.now()+30000;do{const value=await page.evaluate(read);if(value)return value;await page.waitForTimeout(100);}while(Date.now()<until);assert.fail('Drawing did not finish saving.');};
 await page.goto(BASE+'/?software=1');await ready();await page.evaluate(()=>document.fonts.ready);
 assert.match(await page.locator('.ff-world').evaluate(e=>e.style.backgroundImage),/den-v2/);
 await snapshot('den-1024');
 for(const width of [1024,390]){
  await page.setViewportSize({width,height:width===390?844:900});await page.waitForTimeout(350);
  await snapshot('den-'+width);
  const shelf=await page.evaluate(()=>{const world=document.querySelector('.ff-world'),[fw,fh]=world.style.backgroundSize.split(' ').map(parseFloat),[x,y]=world.style.backgroundPosition.split(' ').map(parseFloat),b=document.querySelector('[data-place="games"]').getBoundingClientRect();return {bookRight:b.right,booksLeft:x+fw*650/1448};});
  assert.ok(shelf.bookRight<shelf.booksLeft,'Waldspiele button leaves shelf books visible at '+width);
  await page.locator('[data-place="sleep"]').click();await page.waitForFunction(()=>{const v=FK.friendsView();return v.animation==='sleep'&&v.sleepBounds?.width>v.sleepBounds?.height;});
  const box=await page.evaluate(()=>{const e=document.querySelector('.ff-world'),[fw,fh]=e.style.backgroundSize.split(' ').map(parseFloat),[x,y]=e.style.backgroundPosition.split(' ').map(parseFloat);return {fox:FK.friendsView().sleepBounds,bed:{left:x,top:y+fh*450/1086,right:x+fw*230/1448,bottom:y+fh*720/1086}};});
  assert.ok(box.fox.width>box.fox.height,'fox lies horizontally');
  const cx=box.fox.x+box.fox.width/2,cy=box.fox.y+box.fox.height/2;
  assert.ok(cx>box.bed.left&&cx<box.bed.right&&cy>box.bed.top&&cy<box.bed.bottom,'sleeping fox lies on the mattress at '+width);
  await snapshot('sleep-'+width);await click('Animation überspringen');
 }
 await page.setViewportSize({width:1024,height:900});
 await click('Brief öffnen');assert.equal(await page.locator('.ff-letter-illustration').isVisible(),true);
 const portrait=await page.locator('.ff-letter-illustration').evaluate(el=>getComputedStyle(el).backgroundImage);assert.match(portrait,/postcard-friends/);await snapshot('postcard-1024');await page.setViewportSize({width:390,height:844});await snapshot('postcard-390');await click('Zurück');await page.setViewportSize({width:1024,height:900});
 await page.locator('[data-place="drawing"]').click();await page.locator('.book-card').first().waitFor();
 assert.equal(await page.evaluate(()=>FK.current()),'book');assert.equal(await page.locator('.book-card').count(),6);assert.equal(await page.locator('.mode-grid').count(),0);await snapshot('selection-1024');
 // Every new page has many closed paint regions at the real display sizes.
 const regions=await page.evaluate(async()=>{await FK.art.denReady;return FK.art.denPages.map(p=>{const c=document.createElement('canvas');c.width=c.height=512;const alpha=FK.art.renderOutline(c,p,3,[117,89,60]);return {id:p.id,count:FK.art.regions(alpha,512,512,110).n};});});
 assert.ok(regions.every(p=>p.count>15),JSON.stringify(regions));
 await page.locator('.book-card').first().click();await page.waitForFunction(()=>document.querySelector('.screen-color .cv-outline')?.width>0);
 assert.equal(await page.evaluate(()=>FK.current()),'color');assert.equal(await page.getByRole('button',{name:'Stempel',exact:true}).isVisible(),false);assert.equal(await page.locator('.lbl-spot').count(),0);
 await click('Eimer');await page.waitForTimeout(350);
 const fillPoint=await page.evaluate(()=>{const c=document.querySelector('.screen-color .cv-paint'),r=c.getBoundingClientRect(),f=FK.art.fitOf(c.width,c.height);return {x:r.left+(f.ox+(20+185/512*960)*f.s)/c.width*r.width,y:r.top+(f.oy+(20+335/512*960)*f.s)/c.height*r.height};});
 await page.touchscreen.tap(fillPoint.x,fillPoint.y);
 await page.waitForFunction(()=>{const c=document.querySelector('.screen-color .cv-paint');return c&&Array.from(c.getContext('2d').getImageData(0,0,c.width,c.height).data).some((v,i)=>i%4===3&&v>0);});
 await snapshot('colouring-1024');await click('Zur Bildauswahl');assert.equal(await page.evaluate(()=>FK.current()),'book');
 const saved=await waitForStored(async()=>{const p=await FK.store.get('c:bilderbrief-fuchs:frei');return p?.paint&&{size:p.paint.size,gid:p.gid};});assert.ok(saved.size>0);
 await page.locator('.book-card').first().click();await page.waitForTimeout(500);await click('Fertig');await waitForStored(async()=>(await FK.store.listBilder()).length===1);await page.getByRole('button',{name:'Malbuch',exact:true}).click();await page.locator('.screen-book .btn-back').click();
 await page.locator('[data-place="gallery"]').click();assert.equal(await page.evaluate(()=>FK.current()),'gallery');await snapshot('gallery-1024');await page.locator('.gallery-grid .frame-card').first().click();await click('Weitermalen');assert.equal(await page.evaluate(()=>FK.current()),'color');await click('Zur Galerie');assert.equal(await page.evaluate(()=>FK.current()),'gallery');await page.locator('.screen-gallery .btn-back').click();
 assert.equal(await page.evaluate(()=>FK.current()),'friends');
 await page.locator('[data-place="drawing"]').click();await page.setViewportSize({width:390,height:844});await snapshot('selection-390');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.locator('.book-card').nth(2).click();await page.waitForTimeout(500);await snapshot('colouring-390');assert.equal(await page.getByRole('button',{name:'Stempel',exact:true}).isVisible(),false);await click('Zur Bildauswahl');await page.locator('.screen-book .btn-back').click();
 await page.evaluate(()=>navigator.serviceWorker.ready);await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
 await context.setOffline(true);await page.reload();await ready();await page.locator('[data-place="drawing"]').click();await page.locator('.book-card').first().click();await page.waitForTimeout(500);assert.equal(await page.evaluate(()=>FK.current()),'color');assert.deepEqual(await page.evaluate(async()=>{const p=await FK.store.get('c:bilderbrief-fuchs:frei');return {size:p.paint.size,gid:p.gid};}),saved);await context.setOffline(false);
 assert.deepEqual(errors,[]);console.log('PASS: real bed lying pose at1024/390, painted den and clear shelf, high-resolution postcard, six closed-region free colouring pages, no stamps/mode chooser, back and gallery resume/save, mobile layout and offline restored picture.');
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
