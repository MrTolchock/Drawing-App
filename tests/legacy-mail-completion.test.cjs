/* Restored puzzles keep completion history while the letter adventure has no currency. */
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

function fixture(){
  const data=new Map([['farbklecks.progress.v1',JSON.stringify({stars:47,done:{'old:saved':1}})]]);
  const completed=[];
  const FK={friendsLibrary:{active:true,hosts:{count:'squirrel',rhyme:'bird',survey:'owl',vowels:'mouse',shapes:'beaver'}},friendsPuzzleCompleted:host=>completed.push(host)};
  const context=vm.createContext({window:{FK},document:{addEventListener(){}},localStorage:{getItem:key=>data.get(key)||null,setItem:(key,value)=>data.set(key,value)}});
  for(const file of ['js/core/store.js','js/ui/play.js'])vm.runInContext(fs.readFileSync(file,'utf8'),context,{filename:file});
  return {FK,completed,data};
}

test('each restored round finishes through its assigned friend without a currency grant',()=>{
  const {FK,completed,data}=fixture();
  const body={replaceChildren(){throw Error('obsolete reward screen');}};
  for(const [group,game]of [['learn','count'],['adventure','rhyme'],['expedition','survey'],['expedition','vowels'],['adventure','shapes']]){
    FK.play.finish(body,group,game,1,()=>{});
    assert.equal(FK.progress.count(group,game+':1'),1);
  }
  assert.deepEqual(completed,['squirrel','bird','owl','mouse','beaver']);
  assert.equal(FK.progress.stars(),47);
  assert.equal(JSON.parse(data.get('farbklecks.progress.v1')).done['old:saved'],1);
});

test('drawing and bonus awards cannot introduce currency in v2; retained legacy mode still works',()=>{
  const {FK}=fixture();
  assert.equal(FK.progress.finish('free','picture',3,true),0);
  assert.equal(FK.progress.finish('trace','alle:ABC',3),0);
  assert.equal(FK.progress.stars(),47);
  FK.friendsLibrary.active=false;
  assert.equal(FK.progress.finish('learn','legacy:3',1),1);
  assert.equal(FK.progress.stars(),48);
});
