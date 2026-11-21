/* Settings is the shared adult menu frame; all review APIs are disposable fixtures. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'/opt/codex/cua_node/lib/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const {installRemote,seedFromPage}=require('./review-repository-support.cjs');
const base=process.env.FARBTUPF_BASE_URL||'http://127.0.0.1:8000',shots=process.env.FARBTUPF_SHOTS||'/tmp/waldpost-adult-menus';fs.mkdirSync(shots,{recursive:true});
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 try{for(const width of [390,1080]){
  const context=await browser.newContext({viewport:{width,height:width===390?844:810},hasTouch:true,reducedMotion:'reduce',serviceWorkers:'block'}),server=await installRemote(context),page=await context.newPage(),errors=[];
  await context.route('**/js/friends/game.js',r=>r.fulfill({contentType:'application/javascript',body:'// Adult menu fixture.'}));page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(60000);
  await page.goto(base+'/?screen=puzzle-review');const [a,b]=(await page.locator('.gate-task').innerText()).match(/\d+/g).map(Number);await page.getByLabel('Deine Antwort',{exact:true}).fill(String(a*b));await page.locator('.gate-submit').click();await page.waitForFunction(()=>FK.reviewRepository.state.phase==='saved');
  await seedFromPage(page,server,['friends-bird','add']);
  const ledger=server.ledger,key='puzzle:add',revision=await page.evaluate(()=>FK.puzzleCatalogue.puzzleRevision('add'));ledger.entries[key+'@'+revision].note='Bereits erfasst.';server.ledger=ledger;await page.evaluate(()=>FK.reviewRepository.refresh());
  const frame=()=>page.locator('.screen:not([hidden]) .ff-settings-body').evaluate(el=>{const s=getComputedStyle(el);return Object.fromEntries(['fontFamily','fontSize','lineHeight','color','backgroundColor','borderRadius','boxShadow','outlineStyle','outlineOffset','padding'].map(k=>[k,s[k]]));});
  const font=locator=>locator.evaluate(el=>{const s=getComputedStyle(el);return [s.fontFamily,s.fontSize,s.fontWeight,s.color];});
  await page.evaluate(()=>FK.go('settings'));const settings=await frame(),heading=await font(page.locator('.setting-head h2').first());
  assert.ok(parseFloat(settings.borderRadius)>=26);assert.equal(settings.fontSize,'16px');assert.equal(await page.locator('.ff-data-settings .ff-developer-panel').count(),1);assert.equal(await page.locator('.ff-developer-panel input[aria-label="Entwicklermodus"]').count(),1);assert.match(await page.locator('.ff-data-settings').innerText(),/30 Tage/);
  const panel=await page.locator('.ff-developer-panel').evaluate(el=>{const s=getComputedStyle(el);return {border:s.borderTopWidth,background:s.backgroundColor};});assert.ok(parseFloat(panel.border)>=1);assert.notEqual(panel.background,settings.backgroundColor);
  await page.screenshot({path:shots+'/settings-'+width+'.png'});
  await page.locator('.ff-developer-panel').scrollIntoViewIfNeeded();await page.screenshot({path:shots+'/settings-protocol-'+width+'.png'});
  await page.getByRole('button',{name:"Rätsel-Galerie",exact:true}).click();assert.deepEqual(await frame(),settings);
  assert.equal(await page.locator('.gallery-puzzle').count(),2);for(const card of await page.locator('.gallery-puzzle').all())assert.equal((await card.innerText()).trim(),await card.locator('b').innerText(),'only the puzzle name remains on each card');
  const fish=page.getByRole('button',{name:'Fisch (1)',exact:true});assert.equal(await fish.count(),1);assert.equal(await fish.isDisabled(),false);assert.equal(await fish.locator('.forest-portrait').count(),1);assert.deepEqual(await font(page.locator('.gallery-puzzle>b').first()),heading);
  await page.screenshot({path:shots+'/gallery-'+width+'.png'});
  await page.locator('.screen:not([hidden]) .btn-back').click();await page.getByRole('button',{name:"Rätsel-Prüfung",exact:true}).click();assert.deepEqual(await frame(),settings);
  assert.doesNotMatch(await page.locator('.screen:not([hidden]) .review-grid').innerText(),/MA\.\d|D\.\d|NMG\.|[Ff]ür Kinder freigegeben/);
  assert.equal(await page.locator('.screen:not([hidden]) .review-body').evaluate(el=>el.scrollWidth>el.clientWidth+1),false);
  await page.screenshot({path:shots+'/review-'+width+'.png'});
  await page.locator('.screen:not([hidden]) [data-puzzle="add"]').click();const field=page.getByLabel("Allgemeiner Kommentar zum Rätsel",{exact:true});assert.equal(await field.inputValue(),'');assert.match(await page.locator('.review-competence').innerText(),/Lehrplanbezug: MA\./);assert.deepEqual(await font(page.locator('.review-body>h2')),heading);
  await field.fill('Neuer Kommentar.');await page.getByRole('button',{name:'Kommentar speichern',exact:true}).click();assert.equal(await field.inputValue(),'');assert.match(await page.locator('.review-feedback').innerText(),/Bereits erfasst\./);assert.match(await page.locator('.review-feedback').innerText(),/Neuer Kommentar\./);
  await field.fill('Noch nicht abgeschickter Entwurf.');await page.getByRole('button',{name:'Offen',exact:true}).click();assert.equal(await field.inputValue(),'Noch nicht abgeschickter Entwurf.');await page.getByRole('button',{name:'Kommentar speichern',exact:true}).click();assert.equal(await field.inputValue(),'');
  await page.locator('.screen:not([hidden]) .btn-back').click();await page.locator('.screen:not([hidden]) [data-puzzle="add"]').click();assert.equal(await field.inputValue(),'');
  await page.screenshot({path:shots+'/review-detail-'+width+'.png'});assert.equal(await page.locator('.screen:not([hidden]) .review-body').evaluate(el=>el.scrollWidth>el.clientWidth+1),false);assert.deepEqual(errors,[]);await context.close();
 }console.log('PASS settings/gallery/review frame and typography, separate developer section, name-only gallery cards, Fisch portrait, review wording/references, empty saved-comment field and retained drafts at phone/tablet sizes.');}
 finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
