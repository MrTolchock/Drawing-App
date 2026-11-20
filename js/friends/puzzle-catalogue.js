/* Finite editorial content. No question is invented at play time.
   Stable IDs name content; choice shuffling is presentation, not an iteration. */
(function () {
  'use strict';
  const FK=window.FK,R=FK.puzzleRounds,C=window.FriendsContent;
  const meta={
    'friends-squirrel':['MA.1.A.2.a','Mengen zählen','0–20 Nüsse; Vierer- und Fünferstruktur'],
    'friends-bird':['D.2.A.1.b; D.1.A.1.b','Reime erkennen','25 verschiedene Reimpaare ohne vertauschte Doppelungen; eingeführte Buchstaben'],
    'friends-owl':['D.2.A.1.b; D.2.B.1.b','Kurze Sätze verstehen','Ein kurzer Satz über ein Tier; immer zwei Bildantworten'],
    'friends-beaver':['MA.2.A.1.a','Mengen von Waldgegenständen vergleichen','Zwei gleiche und ein anderer Gegenstand je Reihe; das Muster der ersten zwei Reihen ergänzen','Zwei oder drei verschiedene Waldgegenstände je Reihe; die Mengen der ersten zwei Reihen ergänzen'],
    // Keep the original difficulty contract for existing word cards; the fourth field describes the expanded pool.
    'friends-mouse':['D.2.A.1.b','Wörter mit Bildern verbinden','25 vertraute Nomen; eingeführte Buchstaben','Vertraute Nomen und Tiernamen; eingeführte Buchstaben'],
    'friends-hedgehog':['NMG.2.4.a; D.2.B.1.b','Tiermerkmale erkennen und Fragen lesen','25 kurze Fragen zu sichtbaren Tiermerkmalen; zwei Bildantworten','50 kurze Tierfragen; zwei Bildantworten'],
    'friends-deer':['NMG.2.1.a; D.2.B.1.b','Lebensräume und Nahrung zuordnen','25 kurze Naturfragen; drei Bildantworten'],
    'friends-badger':['NMG.2.3.a; D.2.B.1.b','Wachstum und Naturveränderungen erkennen','25 kurze Fragen zu Wetter, Pflanzen und Entwicklung'],
    'friends-ibex':['MA.2.A.2.a','Wiederholungsmuster fortsetzen und ergänzen','AAB, ABB, ABC, ABAC, AABC mit Stein, Tanne und Blume; Lücke am Ende oder in der zweiten Gruppe','AAB, ABB, ABC, ABAC, AABC mit Berg- und Waldgegenständen; Lücke am Ende oder in der zweiten Gruppe'],
    count:['MA.1.A.2.a','Gezielt Mengen zählen','6–15 Marienkäfer zwischen Bienen und Schnecken'],
    add:['MA.1.A.3.a','Sichtbare Gruppen addieren','Zwei positive Summanden; Summe höchstens 10'],
    rocket:['MA.1.A.4.b','Mengen ergänzen','Gesamtmenge 5–10; besetzte und freie Plätze'],
    picnic:['MA.1.A.4.a (Übung)','Eins zu eins gerecht verteilen','2–4 Freunde; 1–10 Beeren je Freund; insgesamt höchstens 20'],
    syllable:['D.1.A.1.b','Wörter in Silben zerlegen','1–5 Silben; vertraute Bildwörter'],
    robot:['MA.2.A.1.c (Unterstützung)','Benachbarte Schritte im Raum planen','4 × 4; sichtbares Waldziel und gesperrte Felsen'],
    sequence:['NMG.9.1.a (Übung)','Zeitliche Abfolgen ordnen','25 Bildgeschichten mit drei bebilderten Schritten'],
    treasure:['Optionale Gedächtnisübung','Gegenstände wiedererkennen','Vier Dinge, eines fehlt; kein Zeitlimit; erneut anschauen möglich'],
    neighbours:['MA.1.A.2.a/b','Zahlennachbarn bestimmen','Mitte 1–18; Mengenrahmen bis 20; ein Nachbar kann vorgegeben sein'],
    compare:['MA.1.A.1.a (Übung)','Mengen vergleichen','1–10 Fische; mehr oder gleich viele'],
    mirror:['MA.2.A.2.c','Ein Muster spiegeln','3 × 3; drei bis fünf Blätter; senkrechte Spiegelachse'],
    vowels:['D.4.A.1.c (Unterstützung)','Einen Vokal ergänzen','Bildwörter; keine Lücke innerhalb von au/ei/ie/eu/äu'],
    'colour-words':['D.2.A.1.b','Farbwörter verstehen','Sechs Farbwörter; drei verschiedenfarbige Blumen zur Auswahl'],
    'shape-match':['MA.2.A.1.a','Ebene Formen unabhängig von ihrer Lage erkennen','Kreis, Dreieck, Quadrat und Rechteck; 25 unterschiedliche Ansichten'],
    'read-puzzle':['D.2.A.1.b','Silben zu Wörtern verbinden','28 Bildwörter; zwei bis drei Silben; ein Ablenker'],
  };
  const pools={},clone=v=>JSON.parse(JSON.stringify(v));
  function add(id,key,label,q){(pools[id]||=[]).push({id:id+'/'+key,label,question:clone(q)});}
  const numeric=(n,max=20)=>[n,Math.max(0,n-1),Math.min(max,n+1)].filter((v,i,a)=>a.indexOf(v)===i).concat(n===0?[2]:n===max?[max-2]:[]);
  const numberQ=(count,item,columns=5)=>({kind:'nuts',prompt:'Wie viele '+(item==='fish'?'Fische':item==='forest-nut'?'Nüsse':'Dinge')+' sind hier?',count,item,columns,answer:count,choices:numeric(count)});
  for(const [id,item]of [['friends-squirrel','forest-nut']]){
    for(let n=0;n<=20;n++)add(id,'count-'+n,'Menge '+n,numberQ(n,item));
    for(const n of [4,8,12,16])add(id,'four-'+n,'Menge '+n+' in Viererreihen',numberQ(n,item,4));
  }
  // Steinbock: mountain patterns of stone, fir and flower (content.js mountainPatterns), 30 tasks.
  for(const p of C.mountainPatterns())add('friends-ibex','pattern-'+p.key,p.label,{kind:'pattern',prompt:'Welches Bild fehlt im Bergmuster?',sequence:p.sequence,gap:p.gap,answer:p.answer,choices:p.choices});
  const wordArt={...R.wordArt,Bus:'bus',Hose:'trousers',Stern:'star',Topf:'vocab-pot'};
  const reading=['Maus','Haus','Hut','Rose','Nase','Fisch','Tisch','Ball','Baum','Boot','Kuh','Schuh','Bein','Stein','Buch','Hase','Dose','Nuss','Hose','Bus','Stern','Turm','Wurm','Tuch','Topf'];
  reading.forEach((text,i)=>add('friends-mouse','word-'+i,text,{kind:'reading',prompt:'Welches Bild passt zum Wort?',text,answer:wordArt[text],choices:[wordArt[text],wordArt[reading[(i+3)%reading.length]],wordArt[reading[(i+7)%reading.length]]]}));
  // A rhyme pair is unordered: Tisch/Fisch and Fisch/Tisch are the same task.
  // Keep the original distinct pairs and replace the nine reversed duplicates with new pictured words.
  const rhymes=C.pools.bird.map(t=>[t.target,t.answer,t.choices.find(c=>c!==t.answer)]).concat([
    ['Maus','Haus','Hut'],['Nuss','Bus','Baum'],['Boot','Brot','Maus'],['Biene','Schiene','Rose'],
    ['Schnecke','Decke','Ball'],['Sonne','Tonne','Kuh'],['Kanne','Tanne','Hut'],
    ['Mund','Hund','Stern'],['Dach','Bach','Schuh'],['Ziege','Fliege','Nase']
  ]);
  rhymes.forEach(([text,answer,wrong],i)=>add('friends-bird','rhyme-'+i,text+' – '+answer,{kind:'rhyme',prompt:'Welches Wort reimt sich?',text,picture:wordArt[text],answer,choices:[answer,wrong]}));
  C.pools.owl.forEach((t,i)=>{
    // Like the other short sentences, compare actions of the same animal.
    // The fish has no alternative action drawing; use the sleeping mouse instead.
    const q=i===4?{target:'Die Maus schläft.',answer:'mouse-sleep',choices:['mouse-sleep','mouse-run']}:t;
    add('friends-owl','sentence-'+i,q.target,{kind:'reading',prompt:'Welches Bild passt zum Satz?',text:q.target,answer:q.answer,choices:q.choices});
  });
  // Retain the saved IDs while replacing the two-sentence tasks with newly drawn action pairs.
  // Every task has the same one-sentence / two-picture format and compares actions of one animal.
  const animalActions=[
    ['Das Eichhörnchen sitzt.','squirrel-sit','squirrel-run'],
    ['Das Eichhörnchen rennt.','squirrel-run','squirrel-sit'],
    ['Der Igel läuft.','hedgehog-walk','hedgehog-sleep'],
    ['Der Igel schläft.','hedgehog-sleep','hedgehog-walk'],
    ['Der Dachs läuft.','badger-walk','badger-sleep'],
    ['Der Dachs schläft.','badger-sleep','badger-walk'],
    ['Das Reh steht.','roe-stand','roe-run'],
    ['Das Reh rennt.','roe-run','roe-stand'],
    ['Der Frosch sitzt.','frog-sit','frog-jump'],
    ['Der Frosch springt.','frog-jump','frog-sit']
  ];
  animalActions.forEach(([text,answer,wrong],i)=>add('friends-owl','pair-'+i,text,{kind:'reading',prompt:'Welches Bild passt zum Satz?',text,answer,choices:[answer,wrong]}));
  // The first two rows establish a repeated quantity pattern (two of A, one of B).
  // The incomplete last row alone cannot tell whether A or B needs repeating.
  const shapes=['forest-leaf','forest-nut','forest-feather'],shapeOrders=[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
  for(let n=0;n<25;n++){
    const order=shapeOrders[n%6],line=[shapes[order[0]],shapes[order[0]],shapes[order[1]]],shift=1+Math.floor(n/6)%2,phase=Math.floor(n/12),hole=6+Math.floor(n/6)%3;
    const matrix=Array.from({length:9},(_,i)=>line[(i%3+Math.floor(i/3)*shift+phase)%3]);
    add('friends-beaver','matrix-'+n,'Waldreihe '+(n+1),{kind:'matrix',prompt:'Welcher Waldgegenstand fehlt?',matrix,gap:hole,answer:matrix[hole],choices:shapes});
  }
  // Additional rows with all three kinds, keeping the original 25 tasks verbatim.
  shapeOrders.forEach((order,n)=>[6,7,8].forEach(hole=>{
    const matrix=Array.from({length:9},(_,i)=>shapes[order[(i%3+Math.floor(i/3))%3]]);
    add('friends-beaver','matrix-three-'+n+'-'+hole,'Drei Gegenstände / Reihe '+(n+1)+' / Lücke '+(hole-5),{kind:'matrix',prompt:'Welcher Waldgegenstand fehlt?',matrix,gap:hole,answer:matrix[hole],choices:shapes});
  }));
  const extra={
    deer:[['Wo sammelt der Schmetterling Nektar?','flower','water','egg'],['Was knabbert der Biber ab?','tree','fish','egg'],['Was pickt der Vogel aus der Erde?','vocab-worm','boat','moon'],['Was frisst die Schnecke?','leaf','fish','egg'],['Wo sucht der Igel kleine Tiere?','leaf','cloud','moon'],['Was stellt die Biene aus Nektar her?','honey','cheese','egg'],['Wo kann der Frosch schwimmen?','water','cloud','tree'],['Was knabbert der Hase auf der Wiese?','leaf','moon','nest'],['Was hängt an einer Weinrebe?','grapes','egg','fish']],
    badger:[['Was braucht eine Pflanze zum Wachsen?','sun','moon','cheese'],['Was wird aus einer Apfelblüte?','apple','egg','snowman'],['Was wächst aus einem Samen in der Erde?','plant','fish','moon'],['Was sammelt das Eichhörnchen im Herbst?','forest-nut','egg','snowman'],['Was sehen wir bei klarem Himmel in der Nacht?','moon','sun','sunflower'],['Was wächst auf der Erdbeerpflanze?','strawberry','carrot','egg'],['Womit giessen wir die Pflanzen?','watering-can','fork','hat'],['Was wächst aus einer Eichel?','tree','cloud','snowman'],['Was ernten wir vom Birnbaum?','pear','fish','egg']]
  };
  const forestRiddles=[
    ['Wer hat Stacheln?','hedgehog','mouse-sit'],
    ['Wer hat einen blauen Kopf?','bird-sit','forest-robin'],
    ['Wer hat Flossen?','fish-swim','snail'],
    ['Wer ist gelb und schwarz?','bee','spider'],
    ['Wer trägt ein Haus?','snail','caterpillar'],
    ['Wer hat acht Beine?','spider','bird-sit'],
    ['Wer hat bunte Flügel?','butterfly','vocab-worm'],
    ['Wer hat viele Beine?','caterpillar','snail'],
    ['Wer hat schwarze Punkte?','ladybird','bee'],
    ['Wer hat lange Ohren?','hare-sit','hedgehog'],
    ['Wer hält eine Nuss?','squirrel-nut','frog-sit'],
    ['Wer hat Streifen im Gesicht?','badger-walk','forest-fox'],
    ['Wer hat einen breiten Schwanz?','beaver','hare-sit'],
    ['Wer ist grün?','frog-sit','mouse-sit'],
    ['Wer hat Fühler?','ant','spider'],
    ['Wer hat einen dünnen Schwanz?','mouse-sit','squirrel-sit'],
    ['Wer hat eine weisse Schwanzspitze?','forest-fox','mouse-sit'],
    ['Wer hat ein Geweih?','roe-stand','hare-sit'],
    ['Wessen Kopf ist oben rot?','forest-woodpecker','frog-sit'],
    ['Wer hängt am Ast?','forest-bat','squirrel-sit'],
    ['Wer hat grosse Augen?','forest-owl','vocab-worm'],
    ['Wer hat eine rote Brust?','forest-robin','bird-sit'],
    ['Wer hat Flecken im Fell?','forest-lynx','forest-fox'],
    ['Wer hat einen hellen Hals?','forest-marten','vocab-worm'],
    ['Wer hat keine Beine?','vocab-worm','ant']
  ];
  forestRiddles.forEach(([text,answer,wrong],i)=>add('friends-hedgehog','riddle-'+i,text,{kind:'reading',prompt:'Welches Tier passt?',text,answer,choices:[answer,wrong]}));
  for(const host of ['deer','badger']){
    const list=C.pools[host].map(t=>[t.target,t.answer,...t.choices.filter(c=>c!==t.answer)]).concat(extra[host]);
    list.forEach(([text,answer,...wrong],i)=>add('friends-'+host,'riddle-'+i,text,{kind:'reading',prompt:'Welches Bild passt zur Frage?',text,answer,choices:[answer,...wrong]}));
  }
  // Habitat questions need a visible place to swim, rather than a water droplet.
  for(const it of pools['friends-deer']){it.question.choices=it.question.choices.map(pic=>pic==='water'?'habitat-pond':pic);if(it.question.answer==='water')it.question.answer='habitat-pond';}
  const mouseWords=new Set(pools['friends-mouse'].map(it=>it.question.text));
  function addMouseWord(key,text,answer,choices){
    if(mouseWords.has(text))return;
    mouseWords.add(text);
    add('friends-mouse',key,text,{kind:'reading',prompt:'Welches Bild passt zum Wort?',text,answer,choices});
  }
  const animals=C.pools.frog.map(t=>t.answer==='nest'?['Ente','duck-swim']:t.answer==='egg'?['Fuchs','forest-fox']:['mushroom','forest-mushroom'].includes(t.answer)?['Eichhörnchen','squirrel-sit']:[t.target,t.answer]).concat([['Zebra','zebra'],['Löwe','lion'],['Pinguin','penguin'],['Kamel','camel'],['Tiger','tiger'],['Elefant','elephant'],['Giraffe','giraffe'],['Dachs','badger']]);
  animals.forEach(([text,answer],i)=>addMouseWord('friends-frog-animal-'+i,text,answer,[answer,animals[(i+4)%animals.length][1],animals[(i+9)%animals.length][1]]));
  for(let n=6;n<=15;n++)for(let b=2;b<=4;b++)add('count',n+'-'+b,n+' Käfer, '+b+' Bienen',{kind:'count',prompt:'Wie viele rote Marienkäfer sind hier?',count:n,answer:n,choices:numeric(n),bugs:[...Array(n).fill('ladybird'),...Array(b).fill('bee'),...Array(2).fill('snail')]});
  for(let a=1;a<=8;a++)for(let b=1;b<=9-a;b++)add('add',a+'-'+b,a+' + '+b,{kind:'add',item:'fish-swim',prompt:'Wie viele Fische sind es zusammen?',a,b,answer:a+b,choices:numeric(a+b)});
  const tokens=['forest-leaf','forest-nut','forest-feather'],permutations=[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]],units=[[0,0,1],[0,1,1],[0,1,2],[0,1,0,2],[0,0,1,2]];
  units.forEach((u,i)=>permutations.forEach((p,j)=>{const unit=u.map(x=>tokens[p[x]]),sequence=Array.from({length:unit.length*2+1},(_,k)=>unit[k%unit.length]),gap=sequence.length-1;add('friends-ibex','woodland-'+i+'-'+j,'Muster '+['AAB','ABB','ABC','ABAC','AABC'][i]+' / '+(j+1),{kind:'pattern',prompt:'Welches Bild fehlt im Waldmuster?',sequence,gap,answer:sequence[gap],choices:tokens});}));
  const animalQuestions=[
  [
    "Wer trägt Stacheln auf dem Rücken?",
    "hedgehog",
    "fish"
  ],
  [
    "Wer schwimmt mit Flossen?",
    "fish",
    "dog"
  ],
  [
    "Wer quakt am Teich?",
    "frog",
    "cat"
  ],
  [
    "Wer macht Honig aus Nektar?",
    "bee",
    "cow"
  ],
  [
    "Wer bellt?",
    "dog",
    "frog"
  ],
  [
    "Wer miaut?",
    "cat",
    "fish"
  ],
  [
    "Wer gibt uns Milch?",
    "cow",
    "bee"
  ],
  [
    "Wer baut ein Netz?",
    "spider",
    "bird"
  ],
  [
    "Wer trägt sein Haus mit?",
    "snail",
    "dog"
  ],
  [
    "Wen schützt ein Panzer?",
    "tortoise",
    "rabbit"
  ],
  [
    "Wer hüpft mit langen Ohren?",
    "rabbit",
    "fish"
  ],
  [
    "Wer wird aus einer Raupe?",
    "butterfly",
    "pig"
  ],
  [
    "Wer baut ein Nest im Baum?",
    "bird",
    "cow"
  ],
  [
    "Wessen roter Rücken hat schwarze Punkte?",
    "ladybird",
    "sheep"
  ],
  [
    "Wer hat weiche Wolle?",
    "sheep",
    "fish"
  ],
  [
    "Wer balanciert mit buschigem Schwanz?",
    "squirrel",
    "spider"
  ],
  [
    "Wer trinkt mit einem Rüssel?",
    "elephant",
    "cat"
  ],
  [
    "Wer hat einen sehr langen Hals?",
    "giraffe",
    "pig"
  ],
  [
    "Wer trägt eine Mähne?",
    "lion",
    "sheep"
  ],
  [
    "Wessen Fell ist schwarz-weiss gestreift?",
    "zebra",
    "dog"
  ],
  [
    "Wer hat Höcker auf dem Rücken?",
    "camel",
    "cat"
  ],
  [
    "Wessen orangefarbenes Fell hat schwarze Streifen?",
    "tiger",
    "cow"
  ],
  [
    "Welcher Vogel schwimmt und taucht?",
    "penguin",
    "bird"
  ],
  [
    "Wessen Gesicht ist schwarz-weiss gestreift?",
    "badger",
    "pig"
  ],
  [
    "Wer baut einen Damm aus Ästen?",
    "beaver",
    "cat"
  ]
];
  animalQuestions.forEach(([text,answer,wrong],i)=>add('friends-hedgehog','nature-question-'+i,text,{kind:'reading',prompt:'Welches Tier passt?',text,answer,choices:[answer,wrong]}));
  for(let total=5;total<=10;total++)for(let filled=1;filled<total;filled++)add('rocket',total+'-'+filled,total+' insgesamt, '+filled+' leuchten',{kind:'fireflies',prompt:'Wie viele Glühwürmchen fehlen noch?',total,filled,answer:total-filled,choices:numeric(total-filled,10)});
  for(let friends=2;friends<=4;friends++)for(let each=1;each<=Math.floor(20/friends);each++){
    add('picnic',friends+'-'+each,friends+' Freunde, '+(friends*each)+' Beeren',{kind:'picnic',prompt:'Teile alle Beeren gerecht auf.',friends,each,total:friends*each,answer:each});
  }
  // Twenty-one different distributions plus four partially filled, editable plates.
  for(const [friends,each,plates]of [[2,3,[1,0]],[2,4,[0,2]],[3,2,[1,0,0]],[4,2,[0,1,0,1]]])add('picnic','started-'+friends+'-'+each,'Begonnenes Picknick: '+friends+' × '+each,{kind:'picnic',prompt:'Teile alle Beeren gerecht auf.',friends,each,total:friends*each,plates,answer:each});
  const words=R.words.concat([['Ba-na-ne','banana'],['To-ma-te','tomato'],['Ka-me-ra','camera'],['Na-del','needle'],['Ga-bel','fork'],['Glo-cke','bell'],['Ka-rot-te','carrot'],['Wol-ke','cloud'],['Schau-fel','spade'],['Ku-chen','cake'],['Re-gen','rain'],['Vo-gel','bird-sit'],['Schne-cke','snail']]);
  const syllableWords=words.concat([['Scho-ko-la-de','chocolate'],['Ei-sen-bahn-zug','steam-train'],['Was-ser-me-lo-ne','watermelon'],['Feu-er-wehr-au-to','fire-engine']]);
  syllableWords.forEach(([w,picture],i)=>{
    const word=w.replaceAll('-',''),parts=w.split('-');
    add('syllable','word-'+i,word,{kind:'syllable',prompt:'Wie viele Silben hat das Wort?',word,picture,parts,answer:parts.length,choices:[0,1,2].map(i=>Math.max(1,Math.min(3,parts.length-1))+i)});
  });
  words.forEach(([w,picture],i)=>{
    const word=w.replaceAll('-',''),parts=w.split('-'),choices=[picture,words[(i+4)%words.length][1],words[(i+9)%words.length][1]];
    addMouseWord('read-word-word-'+i,word,picture,choices);
    if(parts.length>1){const distractor=['ma','lo','su','ta','fe'].find(s=>!parts.some(p=>p.toLowerCase()===s)),chips=parts.concat(distractor);add('read-puzzle','word-'+i,word,{kind:'syllables',prompt:'Setze das Wort aus Silben zusammen.',word,picture,parts,chips,order:chips.map((_,n)=>n),answer:word});}
    // Every eligible vowel position is a different spelling task.
    Array.from(word).forEach((answer,index)=>{if(!/[aeiou]/i.test(answer)||/(au|ei|ie|eu|äu)/i.test(word.slice(Math.max(0,index-1),index+2)))return;add('vowels','word-'+i+'-'+index,word+' / Lücke '+(index+1),{kind:'vowels',prompt:'Welcher Buchstabe fehlt?',word,picture,index,answer,choices:[answer,...['a','e','i','o','u'].filter(v=>v.toLowerCase()!==answer.toLowerCase()).slice(0,2)]});});
  });
  // Fully authored routes: five obstacle sets, six distinct start/goal pairs, BFS checked in tests.
  const blocked=[[5,6],[5,9],[6,10],[9,10],[2,5,9]],ends=[[0,15],[12,3],[3,12],[15,0],[0,3],[12,15]];
  blocked.forEach((obstacles,i)=>ends.forEach(([start,goal],j)=>add('robot',i+'-'+j,'Weg '+(i+1)+' / '+(j+1),{kind:'robot',mode:'route',prompt:'Führe das Reh zum Wald.',size:4,start,goal,obstacles})));
  const stories=[
    [['bean','Bohne in die Erde'],['seedling','Die Bohne keimt'],['plant','Eine Pflanze wächst']],
    [['egg','Ein Ei liegt im Nest'],['chick','Ein Küken schlüpft'],['bird-sit','Der Vogel ist gross']],
    [['caterpillar','Eine Raupe frisst'],['cocoon','Die Raupe verpuppt sich'],['butterfly','Ein Schmetterling schlüpft']],
    [['forest-flower','Der Apfelbaum blüht'],['forest-apple','Ein Apfel wird reif'],['scene:forest-basket+forest-apple','Wir ernten den Apfel']],
    [['pencil','Wir schreiben einen Brief'],['postbox','Wir werfen ihn ein'],['mailbox','Der Brief kommt an']],
    [['cloud','Wolken sammeln sich'],['rain','Regen fällt'],['plant','Die Pflanze bekommt Wasser']],
    [['forest-nut','Eine Nuss liegt im Wald'],['squirrel-run','Das Eichhörnchen kommt'],['squirrel-nut','Es hält die Nuss']],
    [['sun','Der Tag ist hell'],['sunset','Die Sonne geht unter'],['moon','Die Nacht kommt']],
    [['forest-apple','Ein Apfel hängt am Baum'],['scene:forest-basket+forest-apple','Wir pflücken ihn'],['vocab-seed','Nach dem Essen bleiben Kerne']],
    [['seedling','Eine junge Pflanze wächst'],['flower','Eine Blüte öffnet sich'],['scene:bee+flower','Eine Biene besucht sie']],
    [['forest-leaf','Ein Blatt hängt am Ast'],['scene:hedgehog+forest-leaf','Der Igel findet das Blatt'],['hedgehog-sleep','Der Igel schläft']],
    [['vocab-seed','Wir nehmen einen Samen'],['spade','Wir graben ein Loch'],['bucket','Wir giessen den Samen']],
    [['forest-berry','Beeren werden reif'],['scene:forest-basket+forest-berry','Wir sammeln sie'],['scene:bowl+forest-berry','Wir teilen sie auf']],
    [['forest-branch','Ein Ast liegt am Boden'],['scene:bird-sit+forest-branch','Ein Vogel holt ihn'],['nest','Er baut ein Nest']],
    [['rain','Es regnet'],['water','Eine Pfütze entsteht'],['sun','Die Sonne trocknet sie']],
    [['spade','Wir lockern die Erde'],['carrot','Eine Karotte wächst'],['scene:forest-basket+carrot','Wir ernten sie']],
    [['flower','Die Birnenblüte öffnet sich'],['pear','Eine Birne wächst'],['scene:bowl+pear','Wir legen sie in die Schale']],
    [['cow','Die Kuh gibt Milch'],['bucket','Wir sammeln die Milch'],['cheese','Daraus wird Käse']],
    [['sunflower','Die Sonnenblume blüht'],['vocab-seed','Ihre Kerne sind reif'],['scene:bird-sit+vocab-seed','Ein Vogel frisst die Kerne']],
    [['vocab-cloth','Wir nehmen ein Tuch'],['water','Wir machen es nass'],['vocab-table','Wir wischen den Tisch']],
    [['book','Wir suchen ein Buch aus'],['reader','Wir lesen es'],['bed','Danach gehen wir schlafen']],
    [['forest-apple','Wir pflücken einen Apfel'],['water','Wir waschen ihn'],['scene:bowl+forest-apple','Wir legen ihn in die Schale']],
    [['forest-basket','Wir nehmen einen Korb mit'],['forest-mushroom','Wir finden Pilze'],['vocab-table','Wir prüfen sie mit Erwachsenen']],
    [['letter','Ein Brief kommt an'],['vocab-hand','Wir öffnen ihn'],['reader','Wir lesen ihn']],
    [['forest-flower','Wir pflücken eine Blume'],['water','Wir stellen sie ins Wasser'],['vocab-table','Wir stellen sie auf den Tisch']]
  ];
  stories.forEach((items,i)=>add('sequence','story-'+i,items.map(v=>v[1]).join(' → '),{kind:'order',prompt:'Ziehe die Bilder in die richtige Reihenfolge.',items,order:[2,0,1],answer:[0,1,2]}));
  const treasures=['forest-leaf','forest-feather','forest-mushroom','forest-stone','forest-berry','forest-nut','forest-apple','forest-flower'];
  for(let i=0;i<treasures.length;i++){
    const objects=Array.from({length:4},(_,n)=>treasures[(i+n)%treasures.length]),decoys=treasures.filter(id=>!objects.includes(id));
    for(let missing=0;missing<objects.length;missing++){
      const answer=objects[missing],choices=[answer,decoys[missing],decoys[(missing+1)%decoys.length]];
      add('treasure',i+'-'+missing,'Korb '+(i+1)+', fehlt: '+answer,{kind:'treasure',prompt:'Merke dir die vier Waldschätze.',objects,missing,answer,choices});
    }
  }
  for(let n=1;n<=18;n++)for(const given of [null,'left'])add('neighbours',n+'-'+(given||'both'),'Mitte '+n+(given?' / Vorgänger gegeben':''),{kind:'neighbours',prompt:'Welche Zahlen kommen davor und danach?',n,given,answer:[n-1,n+1],choices:Array.from(new Set([Math.max(0,n-2),n-1,n+1,n+2]))});
  for(let a=1;a<=10;a++)for(const b of [a,Math.max(1,a-1),Math.min(10,a+2)])if(!pools.compare?.some(t=>t.question.a===a&&t.question.b===b))add('compare',a+'-'+b,a+' und '+b,{kind:'compare',item:'fish-swim',prompt:'Wo sind mehr Fische?',a,b,answer:a===b?'equal':a>b?'left':'right',choices:['left','equal','right']});
  const mirrorMasks=[7,56,448,73,146,292,273,84,15,30,60,120,240,480,31,62,124,248,496,91,182,364,341,170,85,340,325,387,457,199];
  mirrorMasks.forEach((mask,n)=>{const left=Array.from({length:9},(_,i)=>i).filter(i=>mask&(1<<i));add('mirror','grid-'+mask,'Blattmuster '+(n+1),{kind:'mirror',prompt:'Ergänze rechts das Spiegelbild.',width:3,rows:3,left,answer:left.map(i=>Math.floor(i/3)*3+2-i%3).sort((a,b)=>a-b)});});
  // Strip legacy generator bookkeeping: question identity belongs to the editorial item.
  for(const pool of Object.values(pools))for(const item of pool){delete item.question.id;delete item.question.round;}
  // The colour of the target stays the same within each set; the competing colours change.
  const flowerColours=[['rot','#bf5143'],['gelb','#deb845'],['blau','#5d91b4'],['rosa','#ce8a9b'],['weiss','#f8f4df'],['lila','#9874b1']];
  for(const colour of flowerColours){
    const others=flowerColours.filter(other=>other[0]!==colour[0]);
    for(let i=0;i<others.length;i++){
      const choices=[colour,others[i],others[(i+1)%others.length]];
      add('colour-words',choices.map(choice=>choice[0]).join('-'),'Farbe '+colour[0]+' zwischen '+choices.slice(1).map(choice=>choice[0]).join(' und '),{kind:'colours',prompt:'Welche Blume passt zum Satz?',text:'Die Blume ist '+colour[0]+'.',answer:colour[0],choices});
    }
  }
  // Only visually distinct orientations count as tasks. A circle has one orientation.
  const formAngles={circle:[0],square:[0,15,30,45,60,75],rectangle:[0,30,60,90,120,150],triangle:[0,30,60,90,120,150,180,210,240,270,300,330]};
  for(const [form,angles]of Object.entries(formAngles))for(const rotation of angles){
    add('shape-match',form+'-'+rotation,R.shapeNames[form]+' / '+rotation+' Grad',{kind:'shape-match',prompt:'Welche Form ist das?',form,rotation,answer:form,choices:R.shapes});
  }
  const canonical=v=>Array.isArray(v)?'['+v.map(canonical).join(',')+']':v&&typeof v==='object'?'{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+canonical(v[k])).join(',')+'}':JSON.stringify(v);
  function hash(v){const s=canonical(v);let a=2166136261,b=5381;for(let i=0;i<s.length;i++){a=Math.imul(a^s.charCodeAt(i),16777619);b=Math.imul(b,33)^s.charCodeAt(i);}return (a>>>0).toString(16).padStart(8,'0')+(b>>>0).toString(16).padStart(8,'0');}
  function puzzle(id){const g=FK.friendsLibrary.catalogue().find(g=>g.id===id),m=meta[id];return g&&m?{...g,hostName:C.hosts[g.host].name,reference:m[0],competence:m[1],difficulty:m[2],displayDifficulty:m[3]||m[2],instruction:R.instructions[id]}:null;}
  const iterations=id=>clone(pools[id]||[]);
  const implementation=id=>(FK.puzzleImplementation||'unbuilt')+(FK.puzzleImplementations?':'+(FK.puzzleImplementations[id]||'unbuilt'):'');
  const reviewContract=id=>{const p=puzzle(id);return p?{id:p.id,host:p.host,screen:p.screen,instruction:p.instruction,difficulty:p.difficulty}:null;};
  const iterationRevision=(id,item)=>FK.puzzleIterationImplementations?hash({blueprint:2,implementation:(FK.puzzleImplementation||'unbuilt')+':'+(FK.puzzleIterationImplementations[item.id]||'unbuilt'),puzzle:reviewContract(id),item:{id:item.id,question:item.question}}):hash({blueprint:1,implementation:implementation(id),puzzle:puzzle(id),item});
  const puzzleRevision=id=>FK.puzzleIterationImplementations?hash({blueprint:2,puzzle:reviewContract(id),items:iterations(id).map(item=>[item.id,iterationRevision(id,item)])}):hash({blueprint:1,implementation:implementation(id),puzzle:puzzle(id),items:iterations(id)});
  // Build-time verification proves these older releases have identical puzzle definitions and presentation.
  const former=id=>FK.puzzleLegacyImplementations?.[id]||[];
  const formerIterationRevisions=(id,item)=>{if(FK.puzzleReviewCompatibility){const proof=FK.puzzleReviewCompatibility.iterations[item.id];return proof?.current===iterationRevision(id,item)?proof.former:[];}return former(id).map(impl=>hash({blueprint:1,implementation:impl,puzzle:puzzle(id),item}));};
  const formerPuzzleRevisions=id=>{if(FK.puzzleReviewCompatibility){const proof=FK.puzzleReviewCompatibility.puzzles[id];return proof?.current===puzzleRevision(id)?proof.former:[];}const p=puzzle(id),items=iterations(id);return former(id).map(impl=>hash({blueprint:1,implementation:impl,puzzle:p,items}));};
  const iterationRevisions=(id,item)=>[iterationRevision(id,item),...formerIterationRevisions(id,item)];
  const puzzleRevisions=id=>[puzzleRevision(id),...formerPuzzleRevisions(id)];
  function acceptsRevision(id,iteration,revision){const it=iteration?pools[id]?.find(it=>it.id===iteration):null;return !!revision&&(!iteration||!!it)&&(it?iterationRevisions(id,it):puzzleRevisions(id)).includes(revision);}
  function select(id,seed,previous=[]){const r=R.rng(seed);let pool=R.mix(iterations(id),r);
    if(id==='trace')pool=pool.filter(i=>seed%2?i.question.glyph===i.question.glyph.toLocaleUpperCase('de-CH'):i.question.glyph===i.question.glyph.toLocaleLowerCase('de-CH'));
    pool.sort((a,b)=>Number(previous.includes(a.id))-Number(previous.includes(b.id)));
    const chosen=[];for(const it of pool){if(it.question.glyph&&chosen.some(c=>c.question.glyph===it.question.glyph))continue;chosen.push(it);if(chosen.length===5)break;}return arrange(chosen,r);}
  function arrange(items,r){return clone(items).map(item=>{const q=item.question;if(q.choices&&q.kind!=='neighbours')q.choices=R.mix(q.choices,r);if(q.kind==='count')q.bugs=R.mix(q.bugs,r);if(q.kind==='syllables')q.order=R.mix(q.order,r);if(q.kind==='order')q.order=R.mix(q.order,r);return item;});}
  const prepare=(items,seed)=>arrange(items,R.rng(seed));
  function matchesSession(s){
    if(!Array.isArray(s.questions)||s.questions.length!==5||!Array.isArray(s.iterationIds)||s.iterationIds.length!==5||new Set(s.iterationIds).size!==5)return false;
    const normalize=q=>{const v=clone(q);if(v.choices)v.choices.sort((a,b)=>canonical(a).localeCompare(canonical(b)));if(v.bugs)v.bugs.sort();if(v.order)v.order.sort();return canonical(v);};
    return s.iterationIds.every((id,i)=>{const it=iterations(s.id).find(it=>it.id===id);return it&&normalize(it.question)===normalize(s.questions[i]);});
  }
  FK.puzzleCatalogue={matchesSession,meta,puzzle,iterations,canonical,hash,iterationRevision,puzzleRevision,iterationRevisions,puzzleRevisions,acceptsRevision,formerIterationRevisions,formerPuzzleRevisions,select,prepare};
})();
