const BASE_URL = process.env.FARBTUPF_BASE_URL || 'http://127.0.0.1:8000';
const {chromium}=require('/opt/codex/cua_node/lib/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
  const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,reducedMotion:'reduce'}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));await page.goto(BASE_URL + '/?screen=hub');
  await page.evaluate(()=>FK.settings.set('sound',false));fs.mkdirSync('/tmp/farbtupf-play',{recursive:true});
  for(const size of [{width:390,height:844},{width:320,height:568},{width:844,height:390},{width:820,height:1180}]){
   await page.setViewportSize(size);
   for(const [screen,game] of [['learn','count'],['learn','add'],['learn','nature'],['adventure','rhyme'],['adventure','rocket'],['adventure','picnic'],['adventure','shapes'],['adventure','sequence'],['expedition','survey'],['expedition','mirror']]){
    await page.evaluate(({screen,game})=>{FK.settings.set('learning.stage',2);FK.go(screen,{game});},{screen,game});
    await page.waitForFunction(()=>!document.querySelector('.screen.in'));
    assert.equal(await page.locator('.screen-'+screen+' .learn-body').evaluate(el=>el.scrollWidth>el.clientWidth+1),false,game+' overflow at '+size.width);
    if(size.width===390)await page.screenshot({path:'/tmp/farbtupf-play/'+game+'.png',animations:'disabled'});
   }
   await page.evaluate(()=>FK.go('forest-book'));
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   assert.equal(await page.locator('.forest-book-games').first().evaluate(el=>el.scrollWidth>el.clientWidth+1),false,'library overflow at '+size.width);
  }
  // A mounted settings screen must reflect changes made with the forest sound toggle.
  await page.evaluate(()=>{FK.go('parents');FK.settings.set('sound',true);FK.go('forest-book');FK.go('parents');});
  assert.equal(await page.locator('#set-sound').isChecked(),true);
  await page.evaluate(()=>{FK.settings.set('sound',false);FK.go('forest-book');FK.go('parents');});
  assert.equal(await page.locator('#set-sound').isChecked(),false);
  await page.evaluate(()=>FK.go('forest-book'));await page.evaluate(async()=>{await navigator.serviceWorker.ready;});await page.reload();
  await context.setOffline(true);await page.reload();assert.equal(await page.evaluate(()=>FK.current()),'forest-book');assert.deepEqual(errors,[]);
  console.log('PASS: ten revised games at 320/390/820/844px, settings refresh, one library, offline reload and no browser errors.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
