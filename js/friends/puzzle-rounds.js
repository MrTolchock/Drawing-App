/* Five-task woodland sessions. Seeds keep questions and partial work stable across visits.
   The five original friends retain their versioned FriendsState task snapshots. */
(function () {
  'use strict';
  const FK=window.FK;
  const base={squirrel:'Nüsse zählen',bird:'Reimpaare lesen',owl:'Lies und zeig',beaver:'Welche Form fehlt?',mouse:'Wörter und Bilder',hedgehog:'Tierrätsel',fish:'Fische zählen',deer:'Wer wohnt wo?',kingfisher:'Am Bach zählen',frog:'Tierwörter lesen',badger:'Naturrätsel'};
  const instructions={
    'friends-squirrel':'Zähle die Nüsse. Du kannst sie zum Zählen markieren. Tippe auf die passende Zahl.',
    'friends-badger':'Lies die Frage. Tippe auf das passende Bild.',
    'friends-fish':'Zähle die Fische. Du kannst sie zum Zählen markieren. Tippe auf die passende Zahl.',
    'friends-kingfisher':'Zähle die Bilder. Du kannst sie zum Zählen markieren. Tippe auf die passende Zahl.',
    'friends-hedgehog':'Lies die Frage. Tippe auf das Tier, das gemeint ist.',
    'friends-deer':'Lies die Frage. Tippe auf das passende Bild.',
    'friends-frog':'Lies das Wort. Tippe auf das passende Tier.',
    'friends-bird':'Lies das Wort und die Wörter bei den Bildern. Wähle das Wort, das sich reimt.',
    'friends-owl':'Lies den Satz. Wähle das passende Bild.',
    'friends-beaver':'In jeder Reihe stehen dieselben drei Formen. Welche Form fehlt beim Fragezeichen?',
    'friends-mouse':'Lies das Wort. Wähle das passende Bild.',
    count:'Zähle nur die roten Marienkäfer zwischen den anderen Waldbewohnern. Du kannst jeden Käfer markieren. Wähle dann die Zahl.',
    add:'Zwei Freunde bringen Äpfel mit. Zähle beide Gruppen zusammen und wähle das Ergebnis.',
    pattern:'Suche die Bildgruppe, die sich wiederholt. Welches Bild gehört in die Lücke?',
    nature:'Lies den kleinen Hinweis. Welches Tier passt dazu?',
    rocket:'Auf dem Blatt siehst du, wie viele Glühwürmchen zusammenkommen sollen. Einige sind schon da. Wie viele fehlen noch?',
    picnic:'Teile alle Beeren gerecht auf. Tippe auf einen Teller, um eine Beere daraufzulegen. Tippe auf eine Beere, um sie zurückzunehmen. Wenn alle gleich viele haben, ist das Picknick bereit.',
    double:'Jede Nuss links bekommt rechts einen Partner. Tippe auf die leeren Plätze. Wie viele Nüsse sind es dann zusammen?',
    shapes:'Baue das kleine Bild fertig. Die gestrichelte Lücke ist markiert. Wähle die passende Form. Dreiecke und Rechtecke können auch gedreht sein.',
    syllable:'Sprich das Bildwort langsam. Klopfe für jede Silbe einmal auf das Blatt. Wähle dann die passende Silbenzahl.',
    robot:'Bring den Brief zum Briefkasten. Tippe ein freies Nachbarfeld oder einen Pfeil an, um einen Schritt zu gehen. Hecken sind gesperrt.',
    sequence:'Welche Bildergeschichte entsteht? Tippe zuerst auf das erste Bild, dann auf das nächste. Mit dem letzten Bild ist die Geschichte fertig.',
    treasure:'Merke dir die Dinge im Korb. Wenn du bereit bist, tippe auf «Ich habe sie mir gemerkt». Welches Ding fehlt danach?',
    neighbours:'Zähle einen Schritt zurück und einen Schritt weiter. Ergänze die Zahl vor und die Zahl nach der Mitte.',
    compare:'Vergleiche die beiden Beerenteller. Tippe auf den mit mehr Beeren. Sind es gleich viele, wähle «Gleich viele».',
    mirror:'Ergänze rechts das Spiegelbild. Felder in derselben Reihe liegen gleich weit von der Spiegellinie entfernt. Ein zweites Tippen leert ein Feld wieder.',
    vowels:'Lies das Bildwort. Welcher Buchstabe fehlt in der Lücke?',
    survey:'Die Freunde wählen ihr Lieblingsobst. Jedes Tierbild ist eine Stimme. Lies die Frage und zähle oder vergleiche die Bilderreihen.',
    'read-puzzle':'Das Bild zeigt ein Wort. Tippe seine Silben in der richtigen Reihenfolge an.',
    'read-word':'Lies das Wort. Wähle das passende Waldbild.',
    'read-leaves':'Lies die Silbe oben. Finde das Blatt mit genau derselben Silbe.',
    'read-colours':'Lies den Satz. Welches Bild hat die passende Farbe?',
    trace:'Fahre fünf Buchstaben nach. Beginne am grünen Punkt und folge den Pfeilen.',
    'trace-numbers':'Fahre fünf Zahlen nach. Beginne am grünen Punkt und folge den Pfeilen.'
  };
  const title=id=>id.startsWith('friends-')?base[id.slice(8)]:id==='trace-numbers'?'Zahlenspuren':FK.puzzles.names[id];
  const wordArt={...window.FriendsContent.words,Haus:'vocab-house',Tisch:'vocab-table',Schuh:'vocab-shoe',Bein:'vocab-leg',Stein:'vocab-stone',Tuch:'vocab-cloth',Turm:'vocab-tower',Wurm:'vocab-worm',Topf:'vocab-pot',Kopf:'vocab-head',Hand:'vocab-hand',Sand:'vocab-sand',Schal:'vocab-scarf',Seil:'vocab-rope',Pfeil:'vocab-arrow',Tasse:'vocab-cup',Kasse:'vocab-till',Bank:'vocab-bench',Schrank:'vocab-wardrobe',Kern:'vocab-seed',Ast:'forest-branch'};
  const words=[['Ha-se','hare-sit'],['Bi-ber','beaver'],['I-gel','hedgehog'],['Fe-der','forest-feather'],['Ro-se','forest-rose'],['Lu-pe','magnifier'],['Blu-me','forest-flower'],['Tan-ne','forest-fir'],['Ap-fel','forest-apple'],['Rau-pe','caterpillar'],['Bee-re','forest-berry'],['Bie-ne','bee'],['Maus','mouse-sit'],['Baum','tree'],['Pilz','forest-mushroom'],['Nuss','forest-nut'],['Fisch','fish-swim'],['Nest','nest'],['Blatt','forest-leaf'],['Son-ne','sun'],['Schmet-ter-ling','butterfly'],['A-mei-se','ant']];
  const shapes=['circle','triangle','square','rectangle'];
  const shapeNames={circle:'Kreis',triangle:'Dreieck',square:'Quadrat',rectangle:'Rechteck'};
  function rng(seed){let a=seed>>>0;return ()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;};}
  function mix(a,random){const b=a.slice();for(let i=b.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;}
  const int=(r,a,b)=>a+Math.floor(r()*(b-a+1));
  const numbers=(n,max,r)=>mix([n,...mix(Array.from({length:max+1},(_,i)=>i).filter(i=>i!==n&&Math.abs(i-n)<=2),r).slice(0,2)],r);
  function question(id,round,seed){
    const r=rng(seed),order=mix(Array.from({length:words.length},(_,i)=>i),r),entry=words[order[round]],word=entry[0].replaceAll('-','');
    // Round-local random stream; choosing another task never changes earlier questions.
    const random=rng((seed+Math.imul(round+1,2654435761))>>>0),q={id,round};
    if(id==='count'){
      const count=mix([6,8,9,11,13],r)[round];
      return {...q,kind:'count',prompt:'Wie viele rote Marienkäfer sind hier?',count,answer:count,choices:numbers(count,15,random),bugs:mix([...Array(count).fill('ladybird'),...Array(3+round%2).fill('bee'),...Array(2).fill('snail')],random)};
    }
    if(id==='add'){
      const [a,b]=mix([[2,3],[4,2],[3,4],[5,3],[6,4]],r)[round];
      return {...q,kind:'add',prompt:'Wie viele Äpfel sind es zusammen?',a,b,answer:a+b,choices:numbers(a+b,12,random)};
    }
    if(id==='pattern'){
      const tokens=mix(['forest-leaf','forest-nut','forest-feather'],random),unit=[[0,0,1],[0,1,1],[0,1,2],[0,1,0,2],[0,0,1,2]][round].map(i=>tokens[i]);
      const sequence=Array.from({length:unit.length*2+1},(_,i)=>unit[i%unit.length]),gap=sequence.length-1-(round%2);
      return {...q,kind:'pattern',prompt:'Welches Bild fehlt im Waldmuster?',sequence,gap,answer:sequence[gap],choices:tokens};
    }
    if(id==='nature'){
      const row=mix([
        ['Ich trage Stacheln. Im Laub schlafe ich.','hedgehog',['hedgehog','mouse-sit','snail']],
        ['Ich habe Federn. Mein Nest ist im Baum.','bird-sit',['bird-sit','bee','fish-swim']],
        ['Ich lebe im Wasser. Ich habe Flossen.','fish-swim',['fish-swim','snail','hare-sit']],
        ['Mein Haus ist auf meinem Rücken. Ich krieche langsam.','snail',['snail','hedgehog','bee']],
        ['Ich habe sechs Beine. Ich fliege von Blüte zu Blüte.','bee',['bee','bird-sit','mouse-sit']]
      ],r)[round];
      return {...q,kind:'reading',prompt:'Welches Tier bin ich?',text:row[0],answer:row[1],choices:mix(row[2],random)};
    }
    if(id==='rocket'){
      const [total,filled]=mix([[5,2],[6,4],[8,3],[9,5],[10,6]],r)[round];
      return {...q,kind:'fireflies',prompt:'Wie viele Glühwürmchen fehlen noch?',total,filled,answer:total-filled,choices:numbers(total-filled,10,random)};
    }
    if(id==='picnic'){
      const [friends,each]=mix([[2,3],[3,2],[2,4],[3,3],[4,2]],r)[round];
      return {...q,kind:'picnic',prompt:'Teile alle Beeren gerecht auf.',friends,each,total:friends*each,answer:each};
    }
    if(id==='double'){
      const n=mix([2,3,4,5,6],r)[round];return {...q,kind:'double',prompt:'Noch einmal gleich viele. Wie viele zusammen?',n,answer:n*2,choices:numbers(n*2,15,random)};
    }
    if(id==='shapes'){
      // Each construction has two holes. Correct orientation matters for a triangle and rectangle.
      const layouts=[
        {name:'Haus',parts:[['triangle',50,23,65,36,0],['square',50,65,48,48,0],['rectangle',50,76,15,27,0],['circle',35,58,14,14,0]]},
        {name:'Segelboot',parts:[['triangle',39,36,42,52,90],['triangle',70,43,30,38,90],['rectangle',50,76,74,18,90],['circle',33,76,10,10,0]]},
        {name:'Tanne',parts:[['triangle',50,28,36,30,0],['triangle',50,47,52,34,0],['triangle',50,66,72,38,0],['rectangle',50,89,14,18,0]]},
        {name:'Waldwagen',parts:[['rectangle',50,50,68,32,90],['circle',28,76,22,22,0],['circle',73,76,22,22,0],['square',48,27,24,24,0]]},
        {name:'Eule',parts:[['rectangle',50,60,46,58,0],['triangle',28,20,20,22,0],['triangle',72,20,20,22,0],['circle',36,46,18,18,0],['circle',64,46,18,18,0],['triangle',50,62,14,16,180]]}
      ];
      const layout=layouts[round],holes=mix(layout.parts.map((_,i)=>i),random).slice(0,2);
      return {...q,kind:'build',prompt:'Baue das Bild fertig.',...layout,holes,choices:shapes};
    }
    if(id==='syllable')return {...q,kind:'syllable',prompt:'Klopfe die Silben. Wie viele hörst du?',word,picture:entry[1],parts:entry[0].split('-'),answer:entry[0].split('-').length,choices:[1,2,3]};
    if(id==='robot'){
      const size=4,start=[0,12,3,15,0][round],goal=[15,3,12,0,15][round],obstacles=[[5,6],[5,9],[6,10],[9,10],[2,5,9]][round];
      return {...q,kind:'robot',mode:'route',prompt:'Bring den Brief zum Briefkasten.',size,start,goal,obstacles};
    }
    if(id==='sequence'){
      const stories=[
        [['bean','Bohne in die Erde'],['seedling','Die Bohne keimt'],['plant','Eine Pflanze wächst']],
        [['egg','Ein Ei liegt im Nest'],['chick','Ein Küken schlüpft'],['bird-sit','Der Vogel ist gross']],
        [['caterpillar','Eine Raupe frisst'],['cocoon','Die Raupe verpuppt sich'],['butterfly','Ein Schmetterling schlüpft']],
        [['forest-flower','Der Apfelbaum blüht'],['forest-apple','Ein Apfel wird reif'],['forest-basket','Wir ernten den Apfel']],
        [['pencil','Wir schreiben einen Brief'],['postbox','Wir werfen ihn ein'],['mailbox','Der Brief kommt an']]
      ];
      return {...q,kind:'order',prompt:'Was passiert zuerst? Tippe die Bilder der Reihe nach an.',items:stories[round],order:mix([0,1,2],random),answer:[0,1,2]};
    }
    if(id==='treasure'){
      const objects=mix(['forest-leaf','forest-feather','forest-mushroom','forest-stone','forest-berry','forest-nut','forest-apple','forest-flower'],random).slice(0,4),missing=int(random,0,3);
      return {...q,kind:'treasure',prompt:'Merke dir die vier Waldschätze.',objects,missing,answer:objects[missing],choices:mix([objects[missing],...mix(objects.filter((_,i)=>i!==missing),random).slice(0,2)],random)};
    }
    if(id==='neighbours'){
      const n=mix([3,5,7,9,12],r)[round];return {...q,kind:'neighbours',prompt:'Welche Zahlen kommen davor und danach?',n,answer:[n-1,n+1],choices:mix([n-2,n-1,n+1,n+2],random)};
    }
    if(id==='compare'){
      const [a,b]=mix([[3,5],[7,4],[6,6],[8,9],[10,7]],r)[round];return {...q,kind:'compare',prompt:'Wo sind mehr Beeren?',a,b,answer:a===b?'equal':a>b?'left':'right',choices:['left','equal','right']};
    }
    if(id==='mirror'){
      const width=3,rows=3,left=mix(Array.from({length:9},(_,i)=>i),random).slice(0,3+round%3).sort((a,b)=>a-b),answer=left.map(i=>Math.floor(i/width)*width+width-1-i%width).sort((a,b)=>a-b);
      return {...q,kind:'mirror',prompt:'Ergänze rechts das Spiegelbild.',width,rows,left,answer};
    }
    if(id==='vowels'){
      const vowelWords=words.filter(([w])=>!/(au|ei|ie|eu|äu)/i.test(w.replaceAll('-',''))),entry=mix(vowelWords,r)[round],word=entry[0].replaceAll('-','');
      const index=Array.from(word).findIndex(c=>/[aeiou]/i.test(c)),answer=word[index];
      return {...q,kind:'vowels',prompt:'Welcher Buchstabe fehlt?',word,picture:entry[1],index,answer,choices:mix([answer,...mix(['a','e','i','o','u'].filter(c=>c.toLowerCase()!==answer.toLowerCase()),random).slice(0,2)],random)};
    }
    if(id==='survey'){
      const counts=mix([2,4,5],random),fruit=['forest-apple','pear','forest-berry'],most=counts.indexOf(5),target=round%3,task=round%2?'most':'count';
      return {...q,kind:'survey',prompt:task==='most'?'Welches Obst mögen die meisten Freunde?':'Wie viele Freunde wählen '+['den Apfel','die Birne','die Beere'][target]+'?',counts,fruit,target,task,answer:task==='most'?fruit[most]:counts[target],choices:task==='most'?mix(fruit,random):numbers(counts[target],6,random)};
    }
    if(id==='read-puzzle'){
      const entry=mix(words.filter(([w])=>w.includes('-')),r)[round],word=entry[0].replaceAll('-',''),parts=entry[0].split('-');
      const distractor=mix(['ma','lo','su','ta','fe'].filter(s=>!parts.some(p=>p.toLowerCase()===s)),random)[0],chips=parts.concat(distractor);
      return {...q,kind:'syllables',prompt:'Setze das Wort aus Silben zusammen.',word,picture:entry[1],parts,chips,order:mix(chips.map((_,i)=>i),random),answer:word};
    }
    if(id==='read-word')return {...q,kind:'reading',prompt:'Welches Bild passt zum Wort?',text:word,answer:entry[1],choices:mix([entry[1],...order.slice(5,7).map(i=>words[i][1])],random)};
    if(id==='read-leaves'){
      const syllables=['ma','mi','mo','mu','la','li','lo','lu','sa','si','so','su','na','ni','no','nu'],order=mix(syllables,r),answer=order[round];
      return {...q,kind:'leaves',prompt:'Finde dieselbe Silbe auf einem Blatt.',text:answer,answer,choices:mix([answer,...mix(syllables.filter(s=>s!==answer),random).slice(0,3)],random)};
    }
    if(id==='read-colours'){
      const colours=[['rot','#bf5143'],['gelb','#deb845'],['blau','#5d91b4'],['rosa','#ce8a9b'],['weiss','#f8f4df']],colour=mix(colours,r)[round];
      return {...q,kind:'colours',prompt:'Welche Blume passt?',text:'Die Blume ist '+colour[0]+'.',answer:colour[0],choices:mix([colour,...mix(colours.filter(c=>c!==colour),random).slice(0,2)],random)};
    }
    if(id==='trace'||id==='trace-numbers'){
      const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜ';
      const pool=id==='trace-numbers'?Array.from('0123456789'):Array.from(seed%2?alphabet:alphabet.toLocaleLowerCase('de-CH')),glyph=mix(pool,r)[round];
      return {...q,kind:'trace',glyph};
    }
    throw new Error('Unknown woodland puzzle: '+id);
  }
  // Separate from historical save keys and the transactional FriendsState records.
  const key='farbtupf.puzzles.'+(new URLSearchParams(location.search).get('dev')==='1'?'development.':'')+'v1';
  let sessions={},previous={},legacy={};try{const saved=JSON.parse(localStorage.getItem(key));if(saved&&saved.version===1){sessions=saved.sessions||{};previous=saved.previous||{};legacy=saved.legacy||{};}}catch{}
  const valid=(s,id)=>s&&s.id===id&&Number.isInteger(s.seed)&&s.seed>=0&&s.seed<=0xffffffff&&Number.isInteger(s.round)&&s.round>=0&&s.round<=5&&typeof s.solved==='boolean'&&s.work&&typeof s.work==='object'&&!Array.isArray(s.work);
  function save(session){if(session.review||session.gallery||!valid(session,session.id)||!instructions[session.id])return false;sessions[session.id]=JSON.parse(JSON.stringify(session));try{localStorage.setItem(key,JSON.stringify({version:1,sessions,previous,legacy}));}catch{FK.friends?.record('storage_error',{scope:'puzzle_round',puzzleId:session.id});return false;}return true;}
  function start(id){
    const old=sessions[id],catalogue=FK.puzzleCatalogue;
    if(valid(old,id)&&(!catalogue||old.questions&&old.catalogueRevision===catalogue.puzzleRevision(id)&&catalogue.matchesSession(old)))return JSON.parse(JSON.stringify(old));
    // Keep earlier snapshots verbatim; changed content starts a separately reviewed round.
    if(old)legacy[id]=JSON.parse(JSON.stringify(old));
    const session={id,seed:Math.floor(Math.random()*0x100000000),round:0,solved:false,work:{}};
    if(catalogue){const items=catalogue.select(id,session.seed,previous[id]||[]);session.questions=items.map(i=>i.question);session.iterationIds=items.map(i=>i.id);session.catalogueRevision=catalogue.puzzleRevision(id);}
    save(session);return session;
  }
  function current(session){return session.questions?JSON.parse(JSON.stringify(session.questions[session.round])):question(session.id,session.round,session.seed);}
  function complete(id){const s=sessions[id];if(s?.iterationIds)previous[id]=s.iterationIds.slice();clear(id);}

  function clear(id){delete sessions[id];try{localStorage.setItem(key,JSON.stringify({version:1,sessions,previous,legacy}));}catch{}}
  function pending(id){return !!valid(sessions[id],id);}
  FK.puzzleRounds={base,instructions,title,wordArt,words,shapes,shapeNames,rng,mix,question,current,start,save,clear,complete,pending};
})();
