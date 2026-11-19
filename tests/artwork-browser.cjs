/* Real world navigation/letters and the standalone image library, using disposable storage and intercepted review APIs. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'/opt/codex/cua_node/lib/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict'),sharp=require('../tools/node_modules/sharp'),{installRemote}=require('./review-repository-support.cjs');
const base=process.env.FARBTUPF_BASE_URL||'http://127.0.0.1:8000',out=process.env.FARBTUPF_SHOTS||'/tmp/waldpost-artwork';fs.mkdirSync(out,{recursive:true});
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});try{
 const context=await browser.newContext({viewport:{width:1080,height:810},hasTouch:true,reducedMotion:'reduce',serviceWorkers:'block',acceptDownloads:true,permissions:['clipboard-read','clipboard-write']}),page=await context.newPage(),errors=[];page.setDefaultTimeout(60000);page.on('pageerror',e=>errors.push(e.message));const remote=await installRemote(context);
 await page.goto(base+'/?software=1');await page.waitForFunction(()=>!!window.FK?.friendsView&&FK.current()==='friends',{},{timeout:120000});
 const exit=page.getByRole('button',{name:'Nach draussen',exact:true}),den=[];
 for(const [width,height]of [[1080,810],[390,844],[844,390]]){
  await page.setViewportSize({width,height});
  assert.match(await exit.locator('[data-hud="door"]').evaluate(n=>getComputedStyle(n).backgroundImage),/exit-symbol.webp/);
  assert.ok(await exit.evaluate(n=>{const r=n.getBoundingClientRect();return r.width>=48&&r.height>=48&&r.x>=0&&r.y>=0&&r.right<=innerWidth&&r.bottom<=innerHeight;}),'illustrated exit remains a visible touch target');
  await exit.locator('[data-hud="door"]').evaluate(async n=>{const pic=new Image();pic.src=getComputedStyle(n).backgroundImage.slice(5,-2);await pic.decode();if(pic.naturalWidth!==320||pic.naturalHeight!==320)throw Error('Exit artwork did not load');});
  await page.screenshot({path:out+'/den-exit-'+width+'.png'});
  den.push({width,height,exitVisible:true,touchTarget:true});
 }
 await exit.tap();await page.getByRole('button',{name:'Zum Freund gehen',exact:true}).click();await page.waitForFunction(()=>document.querySelector('.ff-game').dataset.area==='forest');
 const active=()=>page.locator('.screen:not([hidden])'),gate=async()=>{const [a,b]=(await page.locator('.gate-task').textContent()).match(/\d+/g).map(Number);await page.getByLabel('Deine Antwort',{exact:true}).fill(String(a*b));await page.locator('.gate-submit').click();};
 const states=[];
 for(const [width,height]of [[1080,810],[390,844],[844,390]]){
  await page.setViewportSize({width,height});
  const nav=active().locator('.ff-nav');for(const label of ['Bildkarte','Einstellungen für Erwachsene']){
   const button=nav.getByRole('button',{name:label,exact:true});assert.ok(await button.evaluate(n=>{const r=n.getBoundingClientRect();return r.width>=48&&r.height>=48;}));const icon=button.locator('.ff-hud-art');assert.match(await icon.evaluate(n=>getComputedStyle(n).backgroundImage),/assets\/interface\/navigation-symbols.webp/);assert.ok(await icon.evaluate(n=>{const r=n.getBoundingClientRect();return r.width>=34&&r.height>=34&&Math.abs(r.width-r.height)<1;}),label+' has visible square artwork');
  }
  await page.screenshot({path:out+'/navigation-'+width+'.png'});await page.evaluate(()=>{FK.friendsStartSession(3);document.querySelector('.ff-den-envelope').click();});
  const letter=active().getByRole('button',{name:'Zum Freund gehen',exact:true});assert.match(await letter.evaluate(n=>getComputedStyle(n).backgroundImage),/letter-paper.webp/);
  const host=await page.evaluate(()=>FK.friends.mail().host),portrait=letter.locator('.ff-letter-friend');assert.equal(await portrait.getAttribute('data-friend'),host);assert.match(await portrait.evaluate(n=>getComputedStyle(n).backgroundImage),/character-portraits.webp/);
  assert.equal(await active().getByRole('button',{name:'Brief vorlesen',exact:true}).count(),0);
  const rect=await letter.boundingBox();assert.ok(rect.x>=0&&rect.y>=0&&rect.x+rect.width<=width&&rect.y+rect.height<=height,JSON.stringify({width,height,rect}));assert.ok(await portrait.evaluate(n=>{const r=n.getBoundingClientRect();return r.width>=140&&r.height>=140;}));
  await page.screenshot({path:out+'/letter-'+width+'.png'});states.push({width,height,host,letterFits:true});await letter.click();
  await nav.getByRole('button',{name:'Bildkarte',exact:true}).click();await active().locator('.ff-map-storybook').waitFor();assert.equal(await active().locator('.ff-map-home [data-hud="den"]').count(),1);assert.match(await active().locator('.ff-map-home [data-hud="den"]').evaluate(n=>getComputedStyle(n).backgroundImage),/den-marker.webp/);assert.equal(await active().locator('.ff-map-invitation [data-hud="letter"]').count(),1);assert.equal(await active().locator('.ff-map-card .ff-card-top').count(),0);await page.screenshot({path:out+'/map-'+width+'.png'});const mapRect=await active().locator('.ff-map-card').boundingBox();await page.touchscreen.tap(width/2,mapRect.y/2);await page.waitForFunction(()=>document.querySelector('.ff-overlay').hidden);
  await nav.getByRole('button',{name:'Einstellungen für Erwachsene',exact:true}).click();await gate();await page.waitForFunction(()=>FK.current()==='settings');assert.equal(await active().evaluate(n=>n.scrollWidth>n.clientWidth+2),false);await page.screenshot({path:out+'/settings-'+width+'.png'});await active().locator('.btn-back').click();await page.waitForFunction(()=>FK.current()==='friends');
 }
 const painted=await page.evaluate(()=>['fox','squirrel','bird','owl','beaver','mouse','mailman','hedgehog','fish','deer','kingfisher','frog','badger','ibex','fox-sleep'].map(id=>{
  const pic=FK.friendsArt.letterPortrait(id);document.body.append(pic);const style=getComputedStyle(pic),result={id,role:pic.dataset.artRole,image:style.backgroundImage,position:style.backgroundPosition};pic.remove();return result;
 }));
 assert.equal(new Set(painted.map(p=>p.position)).size,15,'each sender, including Steinbock, has its own painted cell');for(const pic of painted){assert.equal(pic.role,'letter-character');assert.match(pic.image,/character-portraits.webp/);}
 const atlas=sharp('assets/forest-friends/character-portraits.webp'),meta=await atlas.metadata();assert.ok(meta.hasAlpha);assert.equal(meta.width,1280);assert.equal(meta.height,1280);
 for(let i=0;i<16;i++){
  const cell=await sharp('assets/forest-friends/character-portraits.webp').extract({left:i%4*320,top:Math.floor(i/4)*320,width:320,height:320}).ensureAlpha().raw().toBuffer();let paintedPixels=0;
  for(let y=0;y<320;y++)for(let x=0;x<320;x++){const alpha=cell[(y*320+x)*4+3];if(alpha>38){paintedPixels++;assert.ok(x>=20&&x<300&&y>=20&&y<300,'complete portrait stays inside its cell: '+i);}}
  assert.ok(i<15?paintedPixels>2500:paintedPixels===0,'correct filled/empty portrait cell '+i);
 }
 assert.equal(await page.evaluate(()=>FK.friends.mail().session.completed),0,'viewing letters/maps never completes a puzzle');assert.equal(remote.writes.length,0);
 const gallery=await context.newPage();gallery.on('pageerror',e=>errors.push(e.message));await gallery.goto(base+'/assets/waldatelier/');await gallery.waitForFunction(()=>document.querySelector('#count').textContent.includes('690'));
 await gallery.getByLabel('Bildname oder ID',{exact:true}).fill('forest-nut');assert.equal(await gallery.locator('.image-card').count(),1);await gallery.getByLabel('Transparenzraster zeigen',{exact:true}).check();await gallery.getByRole('button',{name:'ID forest-nut kopieren',exact:true}).click();assert.equal(await gallery.evaluate(()=>navigator.clipboard.readText()),'forest-nut');
 const download=gallery.waitForEvent('download');await gallery.locator('[data-image="forest-nut"] .actions button').last().click();const file=await download;assert.equal(file.suggestedFilename(),'forest-nut.png');const metadata=await sharp(await file.path()).metadata();assert.equal(metadata.format,'png');assert.ok(metadata.hasAlpha&&metadata.width>=300&&metadata.height>=300);await gallery.screenshot({path:out+'/image-library-1080.png'});
 await gallery.getByLabel('Bildname oder ID',{exact:true}).fill('');await gallery.getByLabel('Bildbogen',{exact:true}).selectOption('forest-wildlife');assert.equal(await gallery.locator('.image-card').count(),16);await gallery.getByLabel('Nur Bilder aus aktiven Rätseln',{exact:true}).check();assert.ok(await gallery.locator('.image-card').count()>0);
 await gallery.setViewportSize({width:390,height:844});assert.equal(await gallery.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false);await gallery.screenshot({path:out+'/image-library-390.png'});await gallery.getByLabel('Bildname oder ID',{exact:true}).fill('does-not-exist');assert.equal(await gallery.locator('.image-card').count(),0);assert.match(await gallery.locator('#images').textContent(),/Kein Bild/);
 assert.deepEqual(errors,[]);fs.writeFileSync(out+'/report.json',JSON.stringify({den,exitAction:'unread invitation followed by forest',world:states,library:{images:690,sheets:49,search:true,filters:true,clipboard:true,transparentPngDownload:true},reviewWrites:remote.writes.length},null,2)+'\n');await context.close();console.log('PASS illustrated den exit and its touch action, drawn navigation, sender-aware letter at phone/tablet/landscape sizes, map/settings gates, image-library search/filter/copy and real transparent PNG export.');
}finally{await browser.close();}})().catch(error=>{console.error(error);process.exitCode=1;});
