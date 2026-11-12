const BASE_URL = process.env.FARBTUPF_BASE_URL || 'http://127.0.0.1:8000';
// Run against the local static server. Checks the actual finger-event tracing engine,
// including turns, lifting between strokes, umlaut dots and revised descenders.
const { chromium } = require('/opt/codex/cua_node/lib/node_modules/playwright');
const assert = require('node:assert/strict');
(async () => {
 const browser = await chromium.launch({ executablePath:'/usr/bin/chromium', headless:true, args:['--no-sandbox'] });
 const context = await browser.newContext({ viewport:{width:1024,height:768}, hasTouch:true, reducedMotion:'reduce' });
 const page = await context.newPage(); const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(BASE_URL + '/?screen=hub');
 await page.evaluate(async()=>{ await document.fonts.ready; FK.settings.set('sound',false); FK.ui.celebrate=()=>Promise.resolve(); });
 const cdp=await context.newCDPSession(page);
 const revised=['A','Ä','E','G','J','M','N','W','Y','f','t','w','y','Ö','Ü','4','9'];
 // Fill the stage-one frame cache first: switching stages must not crop newly available glyphs.
 await page.evaluate(()=>FK.go('trace',{stage:1,glyph:'I'}));
 const all=await page.evaluate(()=>Object.keys(FK.glyphs.data));
 for(const glyph of all) {
  await page.evaluate(glyph=>FK.go('trace',{stage:3,glyph}),glyph);
  const contained=await page.locator('.tr-svg').evaluate(svg=>{
   const vb=svg.viewBox.baseVal;
   return [...svg.querySelectorAll('.tr-track path')].every(path=>{
    const b=path.getBBox();
    return b.x>=vb.x && b.y>=vb.y && b.x+b.width<=vb.x+vb.width && b.y+b.height<=vb.y+vb.height;
   });
  });
  assert.ok(contained,'clipped model: '+glyph);
 }
 for(const glyph of revised) {
  await page.evaluate(glyph=>FK.go('trace',{stage:3,glyph}),glyph);
  await page.waitForTimeout(60);
  const paths=await page.locator('.tr-track path').evaluateAll(paths=>paths.map(path=>{
   const len=path.getTotalLength(), matrix=path.getScreenCTM();
   const steps=Math.max(1,Math.ceil(len));
   return Array.from({length:steps+1},(_,i)=>{const p=path.getPointAtLength(len*i/steps).matrixTransform(matrix);return {x:p.x,y:p.y};});
  }));
  for(const points of paths) {
   await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[points[0]]});
   for(const p of points.slice(1)) await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[p]});
   await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  }
  await page.waitForFunction(g=>FK.progress.isDone('trace',g),glyph,{timeout:4000});
  console.log('Finger tracing passed:',glyph);
 }
 // Thumbnails must use stroke geometry rather than the reading-font text glyph.
 await page.evaluate(()=>FK.go('trace',{stage:3}));
 assert.equal(await page.locator('.tr-tile text').count(),0);
 assert.ok(await page.locator('.tr-tile path').count()>0);
 assert.deepEqual(errors,[]);
 console.log(`PASS: ${all.length} models fit after changing stages; all ${revised.length} corrected models completed with touch input; previews use tracing geometry.`);
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
