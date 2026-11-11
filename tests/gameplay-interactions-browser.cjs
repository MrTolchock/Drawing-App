const BASE_URL = process.env.FARBTUPF_BASE_URL || 'http://127.0.0.1:8000';
const {chromium}=require('/opt/codex/cua_node/lib/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
  const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,reducedMotion:'reduce'}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));await page.goto(BASE_URL + '/?screen=hub');
  await page.evaluate(()=>{
   FK.settings.set('sound',false);FK.go('expedition',{game:'compare'});
   window.routeWins=0;const host=document.querySelector('.screen-expedition .learn-body');host.replaceChildren();
   const board=FK.ui.routeBoard({planning:true,question:{kind:'robot',mode:'route',size:3,start:0,goal:8,obstacles:[4]},onSuccess:()=>routeWins++});host.append(board);window.testProgram=board;
  });
  // Simulate a busy phone between pointer release and its native click. The
  // compatibility click must not add a second command even after one second.
  await page.evaluate(()=>document.addEventListener('pointerup',()=>{const until=performance.now()+1100;while(performance.now()<until){}},{once:true}));
  await page.getByRole('button',{name:'Nach links',exact:true}).tap();await page.waitForTimeout(400);
  assert.equal(await page.locator('.route-command').count(),1);
  assert.equal(await page.evaluate(()=>routeWins),0,'planning never moves the character');
  await page.locator('.route-run').tap();await page.waitForFunction(()=>!document.querySelector('.route-run').disabled);
  assert.match(await page.locator('.route-program > .play-instruction').innerText(),/Hecke|Rand/);
  await page.locator('.route-reset').tap();assert.equal(await page.locator('.route-command').count(),0);
  for(const label of ['Nach rechts','Nach rechts','Nach unten','Nach unten'])await page.getByRole('button',{name:label,exact:true}).tap();
  await page.getByRole('button',{name:'Befehl 2: Nach rechts. Entfernen',exact:true}).tap();assert.equal(await page.locator('.route-command').count(),3);
  await page.locator('.route-reset').tap();
  for(const label of ['Nach rechts','Nach rechts','Nach unten','Nach unten'])await page.getByRole('button',{name:label,exact:true}).tap();
  await page.locator('.route-run').tap();await page.waitForFunction(()=>routeWins===1);assert.equal(await page.locator('.route-run').isDisabled(),true);
  await page.evaluate(()=>testProgram.dispose());
  await page.evaluate(()=>{
   const make=FK.expeditions.question;FK.expeditions.question=(kind,...args)=>kind==='compare'?{kind,max:5,a:3,b:5,choices:[-1,0,1],answer:1,prompt:'Wo bleiben Beeren übrig?',hint:'Bilde Paare.',explain:'Rechts sind mehr.'}:make(kind,...args);
   FK.go('expedition',{game:'compare'});
  });
  for(let i=1;i<=3;i++){await page.getByRole('button',{name:'Links Beere '+i+' verbinden',exact:true}).tap();await page.getByRole('button',{name:'Rechts Beere '+i+' verbinden',exact:true}).tap();}
  assert.equal(await page.locator('.compare-pair').count(),3);assert.equal(await page.locator('.compare-berry.paired').count(),6);
  await page.getByRole('button',{name:'↶ Letztes Paar lösen',exact:true}).tap();assert.equal(await page.locator('.compare-pair').count(),2);
  await page.getByRole('button',{name:'Rechts mehr →',exact:true}).tap();assert.equal(await page.locator('.screen-expedition .exp-next').isVisible(),true);
  await page.evaluate(()=>{
   const fruit=[{id:'apple',name:'Apfel',emoji:'🍎'},{id:'pear',name:'Birne',emoji:'🍐'},{id:'berry',name:'Erdbeere',emoji:'🍓'}];
   const make=FK.expeditions.question;FK.expeditions.question=(kind,...args)=>kind==='survey'?{kind,fruit,counts:[1,2,0],scale:5,target:0,task:'count',choices:[0,1,2],answer:1,prompt:'Wie viele Stimmen hat Apfel?',hint:'Eine Pfote zählt eine Stimme.',explain:'Ein Apfel.'}:make(kind,...args);
   FK.settings.set('learning.stage',1);FK.go('expedition',{game:'survey'});
  });
  assert.equal(await page.locator('.screen-expedition .learn-answers').isVisible(),false);
  const names={'🍎':'Apfel','🍐':'Birne','🍓':'Erdbeere'};
  for(let i=0;i<3;i++){
   const emoji=await page.locator('.survey-ballot-art .play-picture').textContent();
   const name=Object.entries(names).find(([token])=>emoji.includes(token))[1];
   if(i===0){const wrong=Object.values(names).find(n=>n!==name);await page.getByRole('button',{name:wrong+' eine Stimme geben',exact:true}).tap();assert.match(await page.locator('.survey-ballots > p[role=status]').innerText(),/^0/);}
   await page.getByRole('button',{name:name+' eine Stimme geben',exact:true}).tap();
  }
  assert.equal(await page.locator('.survey-ballots').isVisible(),false);assert.equal(await page.locator('.exp-vote.uncast').count(),0);
  await page.locator('.screen-expedition .learn-answer[data-answer="2"]').tap();assert.equal(await page.locator('.screen-expedition .exp-next').isVisible(),false);
  await page.locator('.screen-expedition .learn-answer[data-answer="1"]').tap();assert.equal(await page.locator('.screen-expedition .exp-next').isVisible(),true);
  assert.equal(await page.evaluate(()=>FK.progress.stars()),0);assert.deepEqual(errors,[]);
  console.log('PASS: editable robot programs, blocked-route retry, execution, pair/undo quantities, ballot construction, wrong votes, answer retries and no premature rewards.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
