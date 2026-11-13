/* Active letter-assigned puzzle inventory. */
(function(){
'use strict';
const FK=window.FK;
const games=[
  {
    "id": "friends-squirrel",
    "host": "squirrel",
    "title": "Nüsse zählen",
    "picture": "forest-nut",
    "screen": "puzzle"
  },
  {
    "id": "friends-bird",
    "host": "bird",
    "title": "Reimpaare lesen",
    "picture": "words",
    "screen": "puzzle"
  },
  {
    "id": "friends-owl",
    "host": "owl",
    "title": "Lies und zeig",
    "picture": "book",
    "screen": "puzzle"
  },
  {
    "id": "friends-beaver",
    "host": "beaver",
    "title": "Welche Form fehlt?",
    "picture": "shapes",
    "screen": "puzzle"
  },
  {
    "id": "friends-mouse",
    "host": "mouse",
    "title": "Wörter und Bilder",
    "picture": "mouse-sit",
    "screen": "puzzle"
  },
  {
    "id": "friends-hedgehog",
    "host": "hedgehog",
    "title": "Tierrätsel",
    "picture": "hedgehog",
    "screen": "puzzle"
  },
  {
    "id": "friends-fish",
    "host": "fish",
    "title": "Fische zählen",
    "picture": "fish",
    "screen": "puzzle"
  },
  {
    "id": "friends-deer",
    "host": "deer",
    "title": "Wer wohnt wo?",
    "picture": "nest",
    "screen": "puzzle"
  },
  {
    "id": "friends-kingfisher",
    "host": "kingfisher",
    "title": "Am Bach zählen",
    "picture": "forest-feather",
    "screen": "puzzle"
  },
  {
    "id": "friends-frog",
    "host": "frog",
    "title": "Tierwörter lesen",
    "picture": "frog",
    "screen": "puzzle"
  },
  {
    "id": "friends-badger",
    "host": "badger",
    "title": "Naturrätsel",
    "picture": "seedling",
    "screen": "puzzle"
  },
  {
    "id": "count",
    "host": "squirrel",
    "title": "Waldkäfer zählen",
    "picture": "ladybird",
    "screen": "puzzle"
  },
  {
    "id": "add",
    "host": "squirrel",
    "title": "Äpfel rechnen",
    "picture": "add",
    "screen": "puzzle"
  },
  {
    "id": "pattern",
    "host": "owl",
    "title": "Waldmuster",
    "picture": "forest-leaf",
    "screen": "puzzle"
  },
  {
    "id": "nature",
    "host": "bird",
    "title": "Naturdetektive",
    "picture": "seedling",
    "screen": "puzzle"
  },
  {
    "id": "rocket",
    "host": "squirrel",
    "title": "Glühwürmchen sammeln",
    "picture": "forest-lantern",
    "screen": "puzzle"
  },
  {
    "id": "picnic",
    "host": "squirrel",
    "title": "Waldpicknick",
    "picture": "forest-basket",
    "screen": "puzzle"
  },
  {
    "id": "double",
    "host": "beaver",
    "title": "Nüsse verdoppeln",
    "picture": "forest-nut",
    "screen": "puzzle"
  },
  {
    "id": "shapes",
    "host": "beaver",
    "title": "Waldwerkstatt",
    "picture": "forest-shapes",
    "screen": "puzzle"
  },
  {
    "id": "syllable",
    "host": "bird",
    "title": "Silben klopfen",
    "picture": "forest-branch",
    "screen": "puzzle"
  },
  {
    "id": "robot",
    "host": "beaver",
    "title": "Waldpost",
    "picture": "forest-post",
    "screen": "puzzle"
  },
  {
    "id": "sequence",
    "host": "owl",
    "title": "Was kommt zuerst?",
    "picture": "sprout",
    "screen": "puzzle"
  },
  {
    "id": "treasure",
    "host": "owl",
    "title": "Waldschatz",
    "picture": "forest-basket",
    "screen": "puzzle"
  },
  {
    "id": "neighbours",
    "host": "squirrel",
    "title": "Zahlennachbarn",
    "picture": "neighbours",
    "screen": "puzzle"
  },
  {
    "id": "compare",
    "host": "squirrel",
    "title": "Beeren vergleichen",
    "picture": "forest-berry",
    "screen": "puzzle"
  },
  {
    "id": "mirror",
    "host": "beaver",
    "title": "Waldspiegel",
    "picture": "mirror",
    "screen": "puzzle"
  },
  {
    "id": "vowels",
    "host": "mouse",
    "title": "Waldwörter ergänzen",
    "picture": "words",
    "screen": "puzzle"
  },
  {
    "id": "survey",
    "host": "owl",
    "title": "Waldumfrage",
    "picture": "forest-apple",
    "screen": "puzzle"
  },
  {
    "id": "read-puzzle",
    "host": "mouse",
    "title": "Silben-Puzzle",
    "picture": "words",
    "screen": "puzzle"
  },
  {
    "id": "read-word",
    "host": "mouse",
    "title": "Wort und Waldbild",
    "picture": "mouse",
    "screen": "puzzle"
  },
  {
    "id": "read-leaves",
    "host": "mouse",
    "title": "Silbenblätter",
    "picture": "leaf",
    "screen": "puzzle"
  },
  {
    "id": "read-colours",
    "host": "mouse",
    "title": "Farben lesen",
    "picture": "flower",
    "screen": "puzzle"
  },
  {
    "id": "trace",
    "host": "mouse",
    "title": "Schreibspuren",
    "picture": "pencil",
    "screen": "trace"
  },
  {
    "id": "trace-numbers",
    "host": "mouse",
    "title": "Zahlenspuren",
    "picture": "numbers",
    "screen": "trace"
  }
];
const hosts=Object.fromEntries(games.map(g=>[g.id,g.host]));
function catalogue(){return games.map(g=>({...g}));}
function portrait(id){const pic=FK.friendsArt.portrait(id);pic.classList.add('forest-portrait');return pic;}
  let permit=null;
  function canPlay(id){const m=FK.friends?.mail();return !!(permit&&permit.game===id&&m?.session?.id===permit.session&&m.index===permit.index&&FK.friends.canPuzzle(permit.host));}
  function visit(g){if(!g||!FK.friends?.canPuzzle(g.host))return false;const m=FK.friends.mail();permit={game:g.id,host:g.host,index:m.index,session:m.session.id};return launch(g,'friends');}
  function launch(g,returnTo=FK.current()==='forest-book'?'forest-book':'friends'){
    if(!g||!canPlay(g.id)){if(FK.screenExists?.('friends'))FK.go('friends');return false;}
    returnTo='friends';
    if(returnTo==='friends'){
      const queue=FK.settings.get('friends.queue.'+g.host);
      if(Array.isArray(queue))FK.settings.set('friends.queue.'+g.host,queue.filter(id=>id!==g.id));
      FK.settings.set('friends.rotation.'+g.host,g.id);
      FK.settings.set('friends.active.'+g.host,g.id);
      FK.settings.set('friends.lastPuzzle',g.id);
    }
    FK.go(g.screen,{game:g.id,stage:1,lvl:1,level:1,returnTo});return true;
  }
  function pick(host){
    const pool=catalogue().filter(g=>g.host===host&&(!FK.puzzleReview||FK.puzzleReview.ready(g.id))),active=FK.settings.get('friends.active.'+host);
    const unfinished=pool.find(g=>g.id===active&&FK.puzzleRounds.pending(g.id));
    if(unfinished)return unfinished;
    if(!pool.length)return null;
    const saved=FK.settings.get('friends.queue.'+host),ids=new Set(pool.map(g=>g.id));
    let queue=Array.isArray(saved)?[...new Set(saved.filter(id=>ids.has(id)))]:[];
    if(!queue.length)queue=FK.shuffle(pool.map(g=>g.id));
    const last=FK.settings.get('friends.rotation.'+host),kind=id=>FK.puzzleCatalogue?.iterations(id)[0]?.question.kind||FK.puzzleRounds.question(id,0,0).kind;
    const previous=FK.settings.get('friends.lastPuzzle'),previousKind=previous&&games.some(g=>g.id===previous)?kind(previous):null;
    // Prefer another interaction when this friend's remaining bag offers one.
    let next=queue.findIndex(id=>id!==last&&(!previousKind||kind(id)!==previousKind));
    if(next<0)next=queue.findIndex(id=>id!==last);if(next>0)queue.unshift(...queue.splice(next,1));
    FK.settings.set('friends.queue.'+host,queue);
    return pool.find(g=>g.id===queue[0]);
  }
  function complete(host,game){if(!game||FK.settings.get('friends.active.'+host)===game)FK.settings.set('friends.active.'+host,null);}
FK.friendsLibrary={active:false,hosts,portrait,catalogue,launch,visit,canPlay,pick,complete};
})();
