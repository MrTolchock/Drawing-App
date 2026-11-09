const {test}=require('node:test');
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const FK={friendsLibrary:{active:true},shuffle:xs=>xs.slice().reverse()};
vm.runInNewContext(fs.readFileSync('js/friends/puzzles.js','utf8'),{window:{FK}});
test('the four reading puzzles have distinct direct routes and descriptive names',()=>{
  const entries=FK.puzzles.reading;
  assert.equal(entries.length,4);
  assert.equal(new Set(entries.map(e=>e.id)).size,4);
  assert.deepEqual(Array.from(entries,e=>e.params.game),['puzzle','wort','ballone','genau']);
  assert.ok(entries.every(e=>e.host==='mouse'&&e.screen==='read'&&e.title!=='Leseschatz'));
  assert.equal(new Set(Object.values(FK.puzzles.names)).size,Object.keys(FK.puzzles.names).length);
});
test('woodland wording retains numerical answers and leaves historical questions untouched',()=>{
  for(const id of ['rocket','double','robot','count','pattern']){
    const old={answer:4,choices:[3,4,5],filled:1,total:5,n:2,prompt:'Original',hint:'Original'};
    const themed=FK.puzzles.question(old,id,0);
    assert.equal(themed.answer,old.answer);assert.equal(themed.total,old.total);
    assert.deepEqual(themed.choices,old.choices);assert.equal(old.prompt,'Original');
    FK.friendsLibrary.active=false;assert.equal(FK.puzzles.question(old,id,0),old);FK.friendsLibrary.active=true;
  }
});
test('woodland vowel questions replace exactly one vowel and keep five distinct pictured words',()=>{
  const seen=new Set();
  for(let i=0;i<5;i++){
    const q=FK.puzzles.question({kind:'vowels'},'vowels',i);
    assert.match(q.answer,/^[aeiou]$/i);assert.equal(q.word[q.index],q.answer);
    assert.equal(q.choices.filter(c=>c===q.answer).length,1);
    assert.equal(new Set(q.choices).size,3);assert.ok(q.emoji);seen.add(q.word);
  }
  assert.equal(seen.size,5);
});
test('reading words and sequence stories use real woodland subjects',()=>{
  assert.ok(FK.puzzles.words.length>=20);
  assert.ok(FK.puzzles.words.filter(w=>w.w.includes('-')).length>=5);
  assert.ok(FK.puzzles.words.every(w=>w.lvl===1&&w.e&&/^[\p{L}-]+$/u.test(w.w)));
  for(let round=0;round<5;round++){
    const q=FK.puzzles.question({kind:'sequence'},'sequence',round);
    assert.equal(q.ordered.length,2);assert.equal(new Set(q.ordered).size,2);
  }
});
