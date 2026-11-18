/* Woodland sound in the real game: it starts on the first tap, the den has its own sounds (letter flap, door,
   apple, sleep), and the sound comes back after the browser suspends, closes or stalls it, or after speech that
   never reports its end (iOS). */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict');
const base=process.env.FARBTUPF_BASE_URL||'http://127.0.0.1:8000';
(async()=>{
 const browser=await chromium.launch({...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 try{
  const page=await browser.newPage({viewport:{width:1080,height:810}}),errors=[];page.setDefaultTimeout(60000);page.on('pageerror',e=>errors.push(e.message));
  const d=()=>page.evaluate(()=>FK.friendsAudio.diagnostics),wait=(fn,arg)=>page.waitForFunction(fn,arg,{timeout:15000});
  const tap=()=>page.mouse.click(540,600);
  await page.goto(base+'/?software=1');await page.waitForFunction(()=>!!window.FK?.friendsAudio&&FK.current()==='friends');
  assert.equal((await d()).state,'locked','no sound before a gesture');
  await tap();await wait(()=>FK.friendsAudio.diagnostics.state==='running');assert.equal((await d()).area,'den');console.log('PASS starts on the first tap');
  // the den's own sounds are clear (not behind the wall filter) and loud enough to hear
  for(const type of ['letterbox','door','creak','trickle','crunch','splash','breath']){
   assert.equal(await page.evaluate(type=>FK.friendsAudio.cue({type}),type),true,type);
  }
  await wait(()=>FK.friendsAudio.diagnostics.rms>.002);console.log('PASS den sounds play');
  // Fuchs potters about the den: the world reports his paws on the den floor
  await wait(()=>{const s=FK.friendsView().soundscape;return s.ground==='den'&&s.moving&&!s.sleeping;});await wait(()=>FK.friendsAudio.diagnostics.steps>0);console.log('PASS paws in the den');
  // the letter comes through the flap (shown again as on arrival), and the door is heard on the way out and back in
  assert.equal(await page.evaluate(()=>FK.friends.mail().phase),'den-letter');let cues=(await d()).cues;
  await page.evaluate(()=>{document.querySelector('.ff-den-envelope').hidden=true;FK.go('friends');});await wait(()=>!document.querySelector('.ff-den-envelope').hidden);
  await wait(c=>FK.friendsAudio.diagnostics.cues>c,cues);console.log('PASS the letter flap when the letter arrives');
  await page.locator('.ff-den-envelope').click();cues=(await d()).cues;await page.locator('.ff-letter-paper').click();
  await wait(c=>FK.friendsView().area==='forest'&&FK.friendsAudio.diagnostics.area==='forest'&&FK.friendsAudio.diagnostics.cues>c,cues);console.log('PASS the door on the way out');
  // suspended (iOS: screen lock, a call, other audio): the next tap wakes it
  await page.evaluate(()=>FK.friendsAudio.context.suspend());await wait(()=>FK.friendsAudio.diagnostics.state==='suspended');
  await tap();await wait(()=>FK.friendsAudio.diagnostics.state==='running');console.log('PASS a suspended context resumes on the next tap');
  // closed: a new context is built on the next tap
  await page.evaluate(()=>FK.friendsAudio.context.close());await wait(()=>FK.friendsAudio.diagnostics.state==='closed');
  await tap();await wait(()=>FK.friendsAudio.diagnostics.state==='running'&&FK.friendsAudio.diagnostics.recoveries===1);
  assert.equal(await page.evaluate(()=>FK.friendsAudio.cue({type:'creak'})),true);console.log('PASS a closed context is replaced on the next tap');
  // speech that never reports its end does not keep the wood ducked
  await page.evaluate(()=>FK.emit('speech',{active:true}));assert.equal((await d()).speaking,true);
  await wait(()=>!FK.friendsAudio.diagnostics.speaking);console.log('PASS ducking ends when speech has stopped');
  assert.equal(errors.length,0,errors.join('\n'));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
