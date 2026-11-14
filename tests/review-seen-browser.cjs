/* Reviewing a task approves it even if its "seen" mark was lost after it appeared (e.g. another tab replaced the
   local record); before, that showed "Prüfung nicht gespeichert – Bitte diese Iteration zuerst im Spiel ansehen".
   Also: the dialog's text buttons are as wide as their labels (they overlapped). */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');const assert=require('node:assert/strict');const BASE=process.env.FARBTUPF_BASE_URL||'http://127.0.0.1:8000';
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});const page=await (await b.newContext({viewport:{width:1080,height:810},deviceScaleFactor:2,hasTouch:true,reducedMotion:'reduce'})).newPage();page.on('pageerror',e=>console.log('pageerror',e.message));
await page.goto(BASE+'/?software=1&dev=1');await page.waitForFunction(()=>window.FK?.friends&&FK.current()==='friends',null,{timeout:120000});
const gate=async()=>{const n=(await page.locator('.gate-task').innerText()).match(/\d+/g).map(Number);await page.locator('.gate-input').fill(String(n[0]*n[1]));await page.getByRole('button',{name:'Öffnen',exact:true}).click();};
await page.getByRole('button',{name:'Einstellungen für Erwachsene',exact:true}).first().click();await gate();await page.waitForFunction(()=>FK.current()==='settings');
await page.getByRole('button',{name:'Puzzle-Galerie öffnen',exact:true}).click();await page.waitForFunction(()=>FK.current()==='puzzle-review');
await page.evaluate(()=>FK.puzzleReview.start('friends-squirrel'));await page.waitForTimeout(600);
const it=await page.evaluate(()=>document.querySelector('.screen:not([hidden])').dataset.reviewIteration);
// another tab writes the record without this task's seen mark
await page.evaluate(()=>{const k=Object.keys(localStorage).find(k=>k.startsWith('farbtupf.puzzle-review'));const d=JSON.parse(localStorage.getItem(k));d.seen={};window.dispatchEvent(new StorageEvent('storage',{key:k,newValue:JSON.stringify(d)}));});
assert.equal(await page.evaluate(it=>FK.puzzleReview.status('friends-squirrel',it).seen,it),false,'the other tab removed the seen mark');
const tiles=page.locator('.screen:not([hidden]) [data-answer]');const n=await tiles.count();let res='none';
for(let k=0;k<n;k++){await tiles.nth(k).click({force:true}).catch(()=>{});await page.waitForTimeout(300);const err=await page.locator('.modal-card:has-text("nicht gespeichert")').count();if(err){res='ERROR dialog';break;}if(await page.evaluate(it=>FK.puzzleReview.status('friends-squirrel',it).status==='approved',it)){res='approved';break;}}
assert.equal(res,'approved','answering approves the task on screen');
// show the dialog to check its buttons
await page.evaluate(()=>FK.puzzleReview.saveFailure(()=>{}));await page.waitForTimeout(400);
const boxes=await page.locator('.modal-actions .btn').evaluateAll(bs=>bs.map(b=>{const r=b.getBoundingClientRect(),l=b.querySelector('.lbl').getBoundingClientRect();return {x:r.x,w:r.width,lx:l.x,lw:l.width};}));
for(const q of boxes)assert.ok(q.lx>=q.x-.5&&q.lx+q.lw<=q.x+q.w+.5,'label inside its button');for(let i=1;i<boxes.length;i++)assert.ok(boxes[i].x>=boxes[i-1].x+boxes[i-1].w,'buttons do not overlap');
console.log('PASS: an answered review task is approved even after its seen mark was lost; dialog buttons fit their labels.');
await b.close();})().catch(e=>{console.error(e);process.exit(1);});
