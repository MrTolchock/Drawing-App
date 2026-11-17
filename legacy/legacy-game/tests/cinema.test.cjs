const {test}=require('node:test');
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function app(storage=new Map(),blocked=false){
  const FK={heartTree:{count:()=>0}},localStorage={getItem:key=>{if(blocked)throw Error('Blocked');return storage.get(key)||null;},setItem:(key,value)=>{if(blocked)throw Error('Blocked');storage.set(key,value);}};
  for(const file of ['js/forest/story.js','js/forest/cinema.js'])vm.runInNewContext(fs.readFileSync(file,'utf8'),{window:{FK},localStorage},{filename:file});
  return{FK,cinema:FK.forestCinema,storage};
}
test('the opening establishes the actual tree, lonely neighbours and the purpose of helping',()=>{
  const {cinema}=app(),opening=cinema.script('opening',null,0);
  assert.equal(opening.beats[0].shot,'tree-wide');
  assert.ok(opening.beats.some(b=>b.speaker==='beaver'&&b.mood==='sad'&&b.shot==='bridge'));
  assert.match(opening.beats.at(-1).text,/Freundschaft.*Herzbaum/);
  for(const growth of [1,4,9]){
    const recap=cinema.script('opening',null,growth);
    assert.ok(recap.beats.every(b=>b.growth===growth));
    assert.ok(!recap.beats.some(b=>b.text.includes('alle Blätter verloren')),'a returning child never gets a false bare-tree opening');
  }
});
test('all nine projects have a short, acted request and a visible return to the tree',()=>{
  const {cinema,FK}=app();let growth=0;
  for(const q of Object.values(FK.forestStory.quests)){
    const request=cinema.script('request',q,growth),payoff=cinema.script('return',q,++growth);
    assert.equal(request.id,'request:'+q.id);assert.equal(payoff.id,'return:'+q.id);
    assert.ok(request.beats.length>=3);
    assert.ok(request.beats.some(b=>b.speaker===q.resident));
    for(const beat of [...request.beats,...payoff.beats]){
      assert.ok(cinema.names[beat.speaker]);assert.ok(beat.shot&&beat.mood);
      assert.ok(beat.text.length>10&&beat.text.length<=180,'short spoken captions: '+q.id);
      assert.equal(beat.project,q.picture);
    }
    assert.equal(payoff.beats[0].visualGrowth,growth-1);
    assert.ok(payoff.beats.some(b=>b.shot==='spark-flight'&&b.action==='carry'));
    assert.equal(payoff.beats.at(-1).visualGrowth,growth);
    assert.equal(payoff.beats.at(-1).action,'grow');
  }
});
test('the bridge shows both separated friends, then reunites them without adding a repair',()=>{
  const {cinema,FK,storage}=app(),q=FK.forestStory.quests[FK.forestStory.QUEST];
  const request=cinema.script('request',q,0),reunion=cinema.script('reunion',q,1);
  assert.ok(request.beats.some(b=>b.action==='gap'));
  assert.ok(request.beats.some(b=>b.speaker==='hare'&&b.shot==='across'));
  assert.ok(reunion.beats.some(b=>b.action==='reunion'));
  assert.ok(reunion.beats.every(b=>b.growth===1));assert.equal(storage.size,0);
});
test('chapter returns and finale keep the tree and every neighbour in the story',()=>{
  const {cinema,storage}=app();
  for(const [kind,growth]of [['chapter:reconnect',4],['chapter:gather',7],['ending',9]]){
    const scene=cinema.script(kind,null,growth);assert.ok(scene.beats.every(b=>b.shot.startsWith('tree')));
    assert.ok(scene.beats.some(b=>b.shot==='tree-friends'));
  }
  const ending=cinema.script('ending',null,9);assert.equal(ending.beats.length,5);
  assert.ok(ending.beats.some(b=>b.action==='bloom'));assert.match(ending.beats.at(-1).text,/gehörst zu uns/);
  assert.equal(storage.size,0,'rendering a script cannot finish any story milestone');
});
test('seen films persist independently, while malformed or blocked storage remains playable',()=>{
  const store=new Map([['farbtupf.forest.v1','original world'],['farbklecks.progress.v1','original stars']]);
  const first=app(store);first.cinema.mark('opening');
  assert.equal(app(store).cinema.seen('opening'),true);
  assert.equal(store.get('farbtupf.forest.v1'),'original world');assert.equal(store.get('farbklecks.progress.v1'),'original stars');
  for(const corrupt of ['{','null',JSON.stringify({version:99}),JSON.stringify({version:1,seen:{opening:'true'}})])assert.equal(app(new Map([[first.cinema.KEY,corrupt]])).cinema.seen('opening'),false);
  const blocked=app(new Map(),true);blocked.cinema.mark('opening');assert.equal(blocked.cinema.seen('opening'),true);
  assert.ok(blocked.cinema.script('opening'));
});
test('scripts are independent copies and all cinema modules are included offline',()=>{
  const {cinema}=app(),script=cinema.script('opening');script.beats[0].text='changed';
  assert.notEqual(cinema.script('opening').beats[0].text,'changed');assert.equal(cinema.script('unknown'),null);
  const sw=fs.readFileSync('sw.js','utf8');
  for(const file of ['js/forest/cinema.js','js/forest/heart-oak.js','js/forest/story-actors.js','js/forest/story-director.js','css/story-cinema.css']){assert.ok(fs.existsSync(file));assert.ok(sw.includes("'./"+file+"'"),file);}
});
test('the opening can be revisited as a flashback with the real progress restored in its last frame',()=>{
  const {cinema,storage}=app(),replay=cinema.script('opening-replay',null,9);
  assert.equal(replay.beats[0].visualGrowth,0);assert.equal(replay.beats[0].preview,'beginning');
  assert.ok(replay.beats.every(b=>b.growth===9),'the authored count is never rewritten for a replay');
  assert.equal(replay.beats.at(-1).visualGrowth,9);assert.equal(replay.beats.at(-1).preview,null);
  assert.equal(storage.size,0);
});
