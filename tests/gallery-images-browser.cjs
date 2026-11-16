/* Actual gallery previews and individual PNG exports for every redrawn subject. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'/opt/codex/cua_node/lib/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),sharp=require('../tools/node_modules/sharp');
const base=process.env.FARBTUPF_BASE_URL||'http://127.0.0.1:8000',out=process.env.FARBTUPF_SHOTS||'/tmp/waldpost-gallery-images',root=path.resolve(__dirname,'..');fs.mkdirSync(out,{recursive:true});
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium'});try{
 const context=await browser.newContext({viewport:{width:1080,height:810},serviceWorkers:'block',acceptDownloads:true}),page=await context.newPage(),errors=[],report=[];
 await context.addInitScript(()=>localStorage.setItem('gallery-storage-fixture','retained'));page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(30000);
 await page.goto(base+'/assets/waldatelier/');await page.waitForFunction(()=>document.querySelector('#count').textContent.includes('235'));await page.getByLabel('Transparenzraster zeigen',{exact:true}).check();
 for(const sheet of ['forest-actions','forest-objects','puzzle-flowers']){
  const manifest=require('../design/illustrations/'+sheet+'.json');await page.getByLabel('Bildbogen',{exact:true}).selectOption(sheet);assert.equal(await page.locator('.image-card').count(),manifest.subjects.length);
  await page.evaluate(async file=>{const image=new Image();image.src=file;await image.decode();},sheet+'.webp');await page.screenshot({path:out+'/'+sheet+'-1080.png',fullPage:true});
  for(let index=0;index<manifest.subjects.length;index++){
   const entry=manifest.subjects[index];await page.getByLabel('Bildname oder ID',{exact:true}).fill(entry.id);assert.equal(await page.locator('.image-card').count(),1);assert.equal(await page.locator('.image-card').getAttribute('data-image'),entry.id);
   const pending=page.waitForEvent('download');await page.locator('.image-card .actions button').last().click();const download=await pending;assert.equal(download.suggestedFilename(),entry.id+'.png');
   const file=await download.path(),metadata=await sharp(file).metadata();assert.equal(metadata.format,'png');assert.equal(metadata.width,320);assert.equal(metadata.height,320);assert.equal(metadata.hasAlpha,true);
   const actual=await sharp(file).flatten({background:'#fffaf0'}).removeAlpha().raw().toBuffer(),expected=await sharp(path.join(root,'assets/waldatelier',sheet+'.webp')).extract({left:index%manifest.columns*320,top:Math.floor(index/manifest.columns)*320,width:320,height:320}).flatten({background:'#fffaf0'}).removeAlpha().raw().toBuffer();
   let total=0;for(let i=0;i<actual.length;i++)total+=Math.abs(actual[i]-expected[i]);const meanError=total/actual.length;assert.ok(meanError<1.5,entry.id+' PNG matches its real atlas cell: '+meanError);
   const {data,info}=await sharp(file).ensureAlpha().raw().toBuffer({resolveWithObject:true});let cornerAlpha=0,visible=0;for(let y=0;y<320;y++)for(let x=0;x<320;x++){const a=data[(y*info.width+x)*4+3];if(a>38)visible++;if((x<20||x>=300)&&(y<20||y>=300))cornerAlpha=Math.max(cornerAlpha,a);}assert.equal(cornerAlpha,0,entry.id+' clean transparent corners');assert.ok(visible>1000,entry.id+' is not empty');report.push({id:entry.id,transparent:true,pngMatchesAtlas:true,meanPixelError:meanError});
  }
  await page.getByLabel('Bildname oder ID',{exact:true}).fill('');await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false);await page.screenshot({path:out+'/'+sheet+'-390.png'});await page.setViewportSize({width:1080,height:810});
 }
 assert.equal(report.length,38);assert.deepEqual(await page.evaluate(()=>Object.fromEntries(Object.entries(localStorage))),{'gallery-storage-fixture':'retained'});assert.deepEqual(errors,[]);fs.writeFileSync(out+'/report.json',JSON.stringify({images:report,storageUnchanged:true,errors},null,2)+'\n');await context.close();console.log('PASS: all 38 gallery images have correct, matching transparent PNG exports; all three sheets fit desktop/phone and preserve storage.');
}finally{await browser.close();}})().catch(error=>{console.error(error);process.exitCode=1;});
