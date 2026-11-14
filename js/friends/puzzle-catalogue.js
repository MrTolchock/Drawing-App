/* Finite editorial content. No question is invented at play time.
   Stable IDs name content; choice shuffling is presentation, not an iteration. */
(function () {
  'use strict';
  const FK=window.FK,R=FK.puzzleRounds,C=window.FriendsContent;
  const meta={
    'friends-squirrel':['MA.1.A.2.a','Mengen zählen','0–20 Nüsse; Vierer- und Fünferstruktur'],
    'friends-bird':['D.2.A.1.b; D.1.A.1.b','Wörter lesen und Reime erkennen','25 konkrete Wortpaare; eingeführte Buchstaben'],
    'friends-owl':['D.2.A.1.b; D.2.B.1.b','Kurze Sätze verstehen','Ein bis zwei kurze Sätze mit vertrauten Tierverben'],
    'friends-beaver':['MA.2.A.1.a','Formen in einer Matrix erkennen','3 × 3; Kreis, Dreieck, Quadrat, Rechteck'],
    'friends-mouse':['D.2.A.1.b','Wörter mit Bildern verbinden','25 vertraute Nomen; eingeführte Buchstaben'],
    'friends-hedgehog':['NMG.2.4.a; D.2.B.1.b','Tiermerkmale erkennen und Fragen lesen','25 kurze Tierfragen; drei Bildantworten'],
    'friends-fish':['MA.1.A.2.a','Fische zählen','0–20; Vierer- und Fünferstruktur'],
    'friends-deer':['NMG.2.1.a; D.2.B.1.b','Lebensräume und Nahrung zuordnen','25 kurze Naturfragen; drei Bildantworten'],
    'friends-kingfisher':['MA.1.A.2.a','Dinge am Bach zählen','2–20; sechs verschiedene Gegenstände'],
    'friends-frog':['D.2.A.1.b','Tierwörter lesen','25 vertraute Tier- und Naturwörter'],
    'friends-badger':['NMG.2.3.a; D.2.B.1.b','Wachstum und Naturveränderungen erkennen','25 kurze Fragen zu Wetter, Pflanzen und Entwicklung'],
    count:['MA.1.A.2.a','Gezielt Mengen zählen','6–15 Marienkäfer zwischen Bienen und Schnecken'],
    add:['MA.1.A.3.a','Sichtbare Gruppen addieren','Zwei positive Summanden; Summe höchstens 10'],
    pattern:['MA.2.A.2.a','Wiederholungsmuster fortsetzen','AAB, ABB, ABC, ABAC, AABC; zwei sichtbare Einheiten'],
    nature:['D.2.B.1.b; NMG.2.4.a','Naturhinweise lesend verstehen','25 Rätsel; zwei kurze Merkmale'],
    rocket:['MA.1.A.4.b','Mengen ergänzen','Gesamtmenge 5–10; besetzte und freie Plätze'],
    picnic:['MA.1.A.4.a (Übung)','Eins zu eins gerecht verteilen','2–4 Freunde; 1–10 Beeren je Teller; insgesamt höchstens 20'],
    double:['MA.1.A.3.a','Gleich grosse Gruppen verdoppeln','2–10 Nüsse; bis 20; teilweise vorhandene Partner ergänzen'],
    shapes:['MA.2.A.1.a; MA.2.A.2.b (Übung)','Form und Lage mit einer Vorlage vergleichen','Fünf Bilder, je zwei fehlende Teile und sichtbare Vorlage'],
    syllable:['D.1.A.1.b','Wörter in Silben zerlegen','1–3 Silben; vertraute Bildwörter'],
    robot:['MA.2.A.1.c (Unterstützung)','Benachbarte Schritte im Raum planen','4 × 4; sichtbares Ziel und gesperrte Hecken'],
    sequence:['D.2.B.1.b (beim Lesen)','Zeitliche Abfolgen ordnen','25 Bildgeschichten mit drei beschrifteten Schritten'],
    treasure:['Optionale Gedächtnisübung','Gegenstände wiedererkennen','Vier Dinge, eines fehlt; kein Zeitlimit; erneut anschauen möglich'],
    neighbours:['MA.1.A.2.a/b','Zahlennachbarn bestimmen','Mitte 1–18; Mengenrahmen bis 20; ein Nachbar kann vorgegeben sein'],
    compare:['MA.1.A.1.a (Übung)','Mengen vergleichen','1–10 Beeren; mehr oder gleich viele'],
    mirror:['MA.2.A.2.c','Ein Muster spiegeln','3 × 3; drei bis fünf Blätter; senkrechte Spiegelachse'],
    vowels:['D.4.A.1.c (Unterstützung)','Einen Vokal ergänzen','Bildwörter; keine Lücke innerhalb von au/ei/ie/eu/äu'],
    survey:['MA.3.C.1.a/b','Eine Bildumfrage auswerten','Drei Obstsorten; 1–6 Stimmen; zählen oder eindeutiges Maximum'],
    'read-puzzle':['D.2.A.1.b','Silben zu Wörtern verbinden','28 Bildwörter; zwei bis drei Silben; ein Ablenker'],
    'read-word':['D.2.A.1.b','Waldwörter lesen','Mindestens 25 konkrete Bildwörter'],
    'read-leaves':['D.2.A.1.b (Übung)','Silben visuell unterscheiden','32 Silben: m/l/s/n/r/f/t/p mit a/i/o/u'],
    'read-colours':['D.2.A.1.b/c','Farbsätze genau lesen','Fünf Farben; ein Satz oder zwei Sätze mit links/rechts'],
    trace:['D.4.A.1.c','Buchstabenformen nachfahren','A–Z und ÄÖÜ, gross und klein; 58 Formen; keine Handschriftbeurteilung'],
    'trace-numbers':['D.4.A.1.c (Graphomotorik)','Ziffernformen nachfahren','0–9; je drei gezeichnete Mengenbezüge; 30 Aufgaben']
  };
  const pools={},clone=v=>JSON.parse(JSON.stringify(v));
  function add(id,key,label,q){(pools[id]||=[]).push({id:id+'/'+key,label,question:clone(q)});}
  const numeric=(n,max=20)=>[n,Math.max(0,n-1),Math.min(max,n+1)].filter((v,i,a)=>a.indexOf(v)===i).concat(n===0?[2]:n===max?[max-2]:[]);
  const numberQ=(count,item,columns=5)=>({kind:'nuts',prompt:'Wie viele '+(item==='fish'?'Fische':item==='forest-nut'?'Nüsse':'Dinge')+' sind hier?',count,item,columns,answer:count,choices:numeric(count)});
  for(const [id,item]of [['friends-squirrel','forest-nut'],['friends-fish','fish']]){
    for(let n=0;n<=20;n++)add(id,'count-'+n,'Menge '+n,numberQ(n,item));
    for(const n of [4,8,12,16])add(id,'four-'+n,'Menge '+n+' in Viererreihen',numberQ(n,item,4));
  }
  for(const item of ['forest-feather','forest-leaf','forest-stone','forest-flower','forest-berry','forest-mushroom'])for(const n of [2,5,9,14,20])add('friends-kingfisher',item+'-'+n,n+' × '+item,numberQ(n,item));
  const wordArt={...R.wordArt,Bus:'bus',Hose:'trousers',Stern:'star',Topf:'vocab-pot'};
  const reading=['Maus','Haus','Hut','Rose','Nase','Fisch','Tisch','Ball','Baum','Boot','Kuh','Schuh','Bein','Stein','Buch','Hase','Dose','Nuss','Hose','Bus','Stern','Turm','Wurm','Tuch','Topf'];
  reading.forEach((text,i)=>add('friends-mouse','word-'+i,text,{kind:'reading',prompt:'Welches Bild passt zum Wort?',text,answer:wordArt[text],choices:[wordArt[text],wordArt[reading[(i+3)%reading.length]],wordArt[reading[(i+7)%reading.length]]]}));
  const rhymes=C.pools.bird.map(t=>[t.target,t.answer,t.choices.find(c=>c!==t.answer)]).concat([['Maus','Haus','Hut'],['Fisch','Tisch','Ball'],['Stein','Bein','Boot'],['Schuh','Kuh','Baum'],['Nase','Hase','Ball'],['Dose','Rose','Hut'],['Tuch','Buch','Ball'],['Wurm','Turm','Boot'],['Kopf','Topf','Baum'],['Sand','Hand','Kuh']]);
  rhymes.forEach(([text,answer,wrong],i)=>add('friends-bird','rhyme-'+i,text+' – '+answer,{kind:'rhyme',prompt:'Welches Wort reimt sich?',text,picture:wordArt[text],answer,choices:[answer,wrong]}));
  C.pools.owl.forEach((t,i)=>add('friends-owl','sentence-'+i,t.target,{kind:'reading',prompt:'Welches Bild passt zum Satz?',text:t.target,answer:t.answer,choices:t.choices}));
  const pairs=[['Die Maus sitzt.','mouse-sit','Der Vogel fliegt.','bird-fly','mouse-run','bird-sit'],['Der Hase rennt.','hare-run','Der Fuchs schläft.','fox-sleep','hare-sit','fox-run'],['Die Katze sitzt.','cat-sit','Der Hund rennt.','dog-run','cat-sleep','dog-sleep'],['Die Ente fliegt.','duck-fly','Die Maus schläft.','mouse-sleep','duck-swim','mouse-run'],['Der Fisch schwimmt.','fish-swim','Der Vogel sitzt.','bird-sit','duck-swim','bird-fly'],['Der Vogel fliegt.','bird-fly','Der Hund schläft.','dog-sleep','bird-sit','dog-run'],['Der Fuchs rennt.','fox-run','Die Katze schläft.','cat-sleep','fox-sleep','cat-sit'],['Die Ente schwimmt.','duck-swim','Der Hase sitzt.','hare-sit','duck-fly','hare-run'],['Die Maus rennt.','mouse-run','Die Katze sitzt.','cat-sit','mouse-sit','cat-sleep'],['Der Hund rennt.','dog-run','Der Vogel sitzt.','bird-sit','dog-sleep','bird-fly']];
  pairs.forEach(([a,ap,b,bp,aw,bw],i)=>{const answer='scene:'+ap+'+'+bp;add('friends-owl','pair-'+i,a+' '+b,{kind:'reading',prompt:'Welches Bild passt zu beiden Sätzen?',text:a+' '+b,answer,choices:[answer,'scene:'+aw+'+'+bp,'scene:'+ap+'+'+bw]});});
  const shapes=['circle','triangle','square','rectangle'];let matrixN=0;
  for(let omit=0;omit<4;omit++)for(let shift=0;shift<3;shift++)for(let gap=0;gap<3&&matrixN<25;gap++){
    const line=shapes.filter((_,i)=>i!==omit),matrix=Array.from({length:9},(_,i)=>line[(i%3+Math.floor(i/3)+shift)%3]),hole=6+gap;
    add('friends-beaver','matrix-'+matrixN++,'Formenreihe '+matrixN,{kind:'matrix',prompt:'In jeder Reihe dieselben drei Formen. Welche fehlt?',matrix,gap:hole,answer:matrix[hole],choices:line});
  }
  const extra={
    hedgehog:[['Wer hat einen Rüssel?','elephant','cat','fish'],['Wer hat einen sehr langen Hals?','giraffe','pig','frog'],['Wer hat eine Mähne?','lion','sheep','snail'],['Wer hat schwarze und weisse Streifen?','zebra','dog','bee'],['Wer trägt einen Höcker?','camel','cat','spider'],['Wer hat orangefarbenes Fell mit schwarzen Streifen?','tiger','cow','snail'],['Welcher Vogel kann nicht fliegen, aber gut schwimmen?','penguin','bird','butterfly'],['Wer hat schwarze und weisse Streifen im Gesicht?','badger','pig','fish'],['Wer baut einen Damm?','beaver','cat','ant']],
    deer:[['Wo sammelt der Schmetterling Nektar?','flower','water','egg'],['Was knabbert der Biber ab?','tree','fish','egg'],['Was pickt der Vogel aus der Erde?','vocab-worm','boat','moon'],['Was frisst die Schnecke?','leaf','fish','egg'],['Wo sucht der Igel kleine Tiere?','leaf','cloud','moon'],['Was stellt die Biene aus Nektar her?','honey','cheese','egg'],['Wo kann der Frosch schwimmen?','water','cloud','tree'],['Was knabbert der Hase auf der Wiese?','leaf','moon','nest'],['Was hängt an einer Weinrebe?','grapes','egg','fish']],
    badger:[['Was braucht eine Pflanze neben Wasser zum Wachsen?','sun','moon','cheese'],['Was wird aus einer Apfelblüte?','apple','egg','snowman'],['Was wächst aus einem Samen in der Erde?','plant','fish','moon'],['Was sammeln wir im Herbst unter der Eiche?','forest-nut','egg','snowman'],['Was sehen wir bei klarem Himmel in der Nacht?','moon','sun','sunflower'],['Was wächst auf der Erdbeerpflanze?','strawberry','carrot','egg'],['Womit giessen wir die Pflanzen?','bucket','fork','hat'],['Was schützt einen Samen in der Erde vor dem Austrocknen?','water','cheese','snowman'],['Was blüht zuerst, bevor die Birne reif wird?','flower','fish','egg']]
  };
  for(const host of ['hedgehog','deer','badger']){
    const list=C.pools[host].map(t=>[t.target,t.answer,...t.choices.filter(c=>c!==t.answer)]).concat(extra[host]);
    list.forEach(([text,answer,...wrong],i)=>add('friends-'+host,'riddle-'+i,text,{kind:'reading',prompt:'Welches Bild passt zur Frage?',text,answer,choices:[answer,...wrong]}));
  }
  const animals=C.pools.frog.map(t=>[t.target,t.answer]).concat([['Zebra','zebra'],['Löwe','lion'],['Pinguin','penguin'],['Kamel','camel'],['Tiger','tiger'],['Elefant','elephant'],['Giraffe','giraffe'],['Dachs','badger']]);
  animals.forEach(([text,answer],i)=>add('friends-frog','animal-'+i,text,{kind:'reading',prompt:'Welches Tier passt zum Wort?',text,answer,choices:[answer,animals[(i+4)%animals.length][1],animals[(i+9)%animals.length][1]]}));
  for(let n=6;n<=15;n++)for(let b=2;b<=4;b++)add('count',n+'-'+b,n+' Käfer, '+b+' Bienen',{kind:'count',prompt:'Wie viele rote Marienkäfer sind hier?',count:n,answer:n,choices:numeric(n),bugs:[...Array(n).fill('ladybird'),...Array(b).fill('bee'),...Array(2).fill('snail')]});
  for(let a=1;a<=8;a++)for(let b=1;b<=9-a;b++)add('add',a+'-'+b,a+' + '+b,{kind:'add',prompt:'Wie viele Äpfel sind es zusammen?',a,b,answer:a+b,choices:numeric(a+b)});
  const tokens=['forest-leaf','forest-nut','forest-feather'],permutations=[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]],units=[[0,0,1],[0,1,1],[0,1,2],[0,1,0,2],[0,0,1,2]];
  units.forEach((u,i)=>permutations.forEach((p,j)=>{const unit=u.map(x=>tokens[p[x]]),sequence=Array.from({length:unit.length*2+1},(_,k)=>unit[k%unit.length]),gap=sequence.length-1;add('pattern',i+'-'+j,'Muster '+['AAB','ABB','ABC','ABAC','AABC'][i]+' / '+(j+1),{kind:'pattern',prompt:'Welches Bild fehlt im Waldmuster?',sequence,gap,answer:sequence[gap],choices:tokens});}));
  const natural=[
    ['Ich trage Stacheln. Im Laub schlafe ich.','hedgehog','fish','frog'],
    ['Ich habe Flossen. Im Wasser schwimme ich.','fish','dog','bee'],
    ['Ich bin oft grün. Am Teich quake ich.','frog','cat','bird'],
    ['Ich habe sechs Beine. Aus Nektar mache ich Honig.','bee','cow','snail'],
    ['Ich belle. Meine Nase riecht sehr gut.','dog','frog','butterfly'],
    ['Ich miaue. Meine Pfoten sind weich.','cat','fish','pig'],
    ['Ich bin gross. Meine Milch wird getrunken.','cow','bee','spider'],
    ['Ich habe acht Beine. Ich baue ein Netz.','spider','bird','fish'],
    ['Ich krieche langsam. Mein Haus trage ich mit.','snail','dog','sheep'],
    ['Ich habe vier Beine. Mein Panzer schützt mich.','tortoise','rabbit','bee'],
    ['Ich habe lange Ohren. Ich hüpfe über die Wiese.','rabbit','fish','snail'],
    ['Ich hatte als Raupe viele Beine. Nun habe ich bunte Flügel.','butterfly','pig','frog'],
    ['Ich habe Federn. Mein Nest ist im Baum.','bird','cow','spider'],
    ['Ich bin klein und rot. Mein Rücken hat schwarze Punkte.','ladybird','sheep','dog'],
    ['Ich trage Wolle. Auf der Weide blöke ich.','sheep','fish','ant'],
    ['Ich habe einen buschigen Schwanz. Ich sammle Nüsse.','squirrel','spider','fish'],
    ['Ich bin sehr gross. Mit dem Rüssel trinke ich.','elephant','cat','fish'],
    ['Mein Hals ist sehr lang. Ich erreiche hohe Blätter.','giraffe','pig','frog'],
    ['Ich bin eine grosse Katze. Das Männchen trägt eine Mähne.','lion','sheep','snail'],
    ['Ich sehe einem Pferd ähnlich. Mein Fell ist schwarz-weiss gestreift.','zebra','dog','bee'],
    ['Ich kann lange ohne Wasser auskommen. Auf dem Rücken habe ich Höcker.','camel','cat','spider'],
    ['Ich bin eine grosse Katze. Mein orangefarbenes Fell hat schwarze Streifen.','tiger','cow','snail'],
    ['Ich bin ein Vogel. Ich kann gut schwimmen, aber nicht fliegen.','penguin','bird','butterfly'],
    ['Ich grabe einen Bau in der Erde. Mein Gesicht hat schwarze und weisse Streifen.','badger','pig','fish'],
    ['Meine Zähne fällen Bäume. Mit Ästen baue ich einen Damm.','beaver','cat','ant']
  ];
  natural.forEach(([text,answer,...wrong],i)=>add('nature','clue-'+i,text,{kind:'reading',prompt:'Welches Tier passt?',text,answer,choices:[answer,...wrong]}));
  for(let total=5;total<=10;total++)for(let filled=1;filled<total;filled++)add('rocket',total+'-'+filled,total+' insgesamt, '+filled+' leuchten',{kind:'fireflies',prompt:'Wie viele Glühwürmchen fehlen noch?',total,filled,answer:total-filled,choices:numeric(total-filled,10)});
  for(let friends=2;friends<=4;friends++)for(let each=1;each<=Math.floor(20/friends);each++){
    add('picnic',friends+'-'+each,friends+' Freunde, '+(friends*each)+' Beeren',{kind:'picnic',prompt:'Teile alle Beeren gerecht auf.',friends,each,total:friends*each,answer:each});
  }
  // Twenty-one different distributions plus four partially filled, editable plates.
  for(const [friends,each,plates]of [[2,3,[1,0]],[2,4,[0,2]],[3,2,[1,0,0]],[4,2,[0,1,0,1]]])add('picnic','started-'+friends+'-'+each,'Begonnenes Picknick: '+friends+' × '+each,{kind:'picnic',prompt:'Teile alle Beeren gerecht auf.',friends,each,total:friends*each,plates,answer:each});
  for(let n=2;n<=10;n++)for(let ready=0;ready<3;ready++){
    if(ready>=n)continue;add('double',n+'-'+ready,n+' Nüsse, '+ready+' Partner schon da',{kind:'double',prompt:'Noch einmal gleich viele. Wie viele zusammen?',n,partners:Array.from({length:ready},(_,i)=>i),answer:n*2,choices:numeric(n*2)});
  }
  for(let layout=0;layout<5;layout++){
    const q=R.question('shapes',layout,1234);
    for(let a=0;a<q.parts.length;a++)for(let b=a+1;b<q.parts.length;b++)add('shapes',layout+'-'+a+'-'+b,q.name+': Teile '+(a+1)+' und '+(b+1),{...q,holes:[a,b]});
  }
  const words=R.words.concat([['Ba-na-ne','banana'],['To-ma-te','tomato'],['Ka-me-ra','camera'],['Na-del','needle'],['Ga-bel','fork'],['Glo-cke','bell'],['Ka-rot-te','carrot'],['Wol-ke','cloud'],['Schau-fel','spade'],['Ku-chen','cake'],['Re-gen','rain'],['Vo-gel','bird-sit'],['Schne-cke','snail']]);
  words.forEach(([w,picture],i)=>{
    const word=w.replaceAll('-',''),parts=w.split('-'),choices=[picture,words[(i+4)%words.length][1],words[(i+9)%words.length][1]];
    add('syllable','word-'+i,word,{kind:'syllable',prompt:'Klopfe die Silben. Wie viele hörst du?',word,picture,parts,answer:parts.length,choices:[1,2,3]});
    add('read-word','word-'+i,word,{kind:'reading',prompt:'Welches Bild passt zum Wort?',text:word,answer:picture,choices});
    if(parts.length>1){const distractor=['ma','lo','su','ta','fe'].find(s=>!parts.some(p=>p.toLowerCase()===s)),chips=parts.concat(distractor);add('read-puzzle','word-'+i,word,{kind:'syllables',prompt:'Setze das Wort aus Silben zusammen.',word,picture,parts,chips,order:chips.map((_,n)=>n),answer:word});}
    // Every eligible vowel position is a different spelling task.
    Array.from(word).forEach((answer,index)=>{if(!/[aeiou]/i.test(answer)||/(au|ei|ie|eu|äu)/i.test(word.slice(Math.max(0,index-1),index+2)))return;add('vowels','word-'+i+'-'+index,word+' / Lücke '+(index+1),{kind:'vowels',prompt:'Welcher Buchstabe fehlt?',word,picture,index,answer,choices:[answer,...['a','e','i','o','u'].filter(v=>v.toLowerCase()!==answer.toLowerCase()).slice(0,2)]});});
  });
  // Fully authored routes: five obstacle sets, six distinct start/goal pairs, BFS checked in tests.
  const blocked=[[5,6],[5,9],[6,10],[9,10],[2,5,9]],ends=[[0,15],[12,3],[3,12],[15,0],[0,3],[12,15]];
  blocked.forEach((obstacles,i)=>ends.forEach(([start,goal],j)=>add('robot',i+'-'+j,'Weg '+(i+1)+' / '+(j+1),{kind:'robot',mode:'route',prompt:'Bring den Brief zum Briefkasten.',size:4,start,goal,obstacles})));
  const stories=[
    [['bean','Bohne in die Erde'],['seedling','Die Bohne keimt'],['plant','Eine Pflanze wächst']],
    [['egg','Ein Ei liegt im Nest'],['chick','Ein Küken schlüpft'],['bird-sit','Der Vogel ist gross']],
    [['caterpillar','Eine Raupe frisst'],['cocoon','Die Raupe verpuppt sich'],['butterfly','Ein Schmetterling schlüpft']],
    [['forest-flower','Der Apfelbaum blüht'],['forest-apple','Ein Apfel wird reif'],['forest-basket','Wir ernten den Apfel']],
    [['pencil','Wir schreiben einen Brief'],['postbox','Wir werfen ihn ein'],['mailbox','Der Brief kommt an']],
    [['cloud','Wolken sammeln sich'],['rain','Regen fällt'],['plant','Die Pflanze bekommt Wasser']],
    [['forest-nut','Eine Nuss liegt im Wald'],['squirrel','Das Eichhörnchen findet sie'],['forest-basket','Es sammelt sie ein']],
    [['sun','Der Tag ist hell'],['sunset','Die Sonne geht unter'],['moon','Die Nacht kommt']],
    [['forest-apple','Ein Apfel hängt am Baum'],['forest-basket','Wir pflücken ihn'],['vocab-seed','Nach dem Essen bleiben Kerne']],
    [['seedling','Eine junge Pflanze wächst'],['flower','Eine Blüte öffnet sich'],['bee','Eine Biene besucht sie']],
    [['forest-leaf','Ein Blatt hängt am Ast'],['leaf','Es fällt zu Boden'],['hedgehog','Der Igel nutzt das Laub']],
    [['vocab-seed','Wir nehmen einen Samen'],['spade','Wir graben ein Loch'],['bucket','Wir giessen den Samen']],
    [['forest-berry','Beeren werden reif'],['forest-basket','Wir sammeln sie'],['bowl','Wir teilen sie auf']],
    [['forest-branch','Ein Ast liegt am Boden'],['bird-sit','Ein Vogel holt ihn'],['nest','Er baut ein Nest']],
    [['rain','Es regnet'],['water','Eine Pfütze entsteht'],['sun','Die Sonne trocknet sie']],
    [['spade','Wir lockern die Erde'],['carrot','Eine Karotte wächst'],['forest-basket','Wir ernten sie']],
    [['flower','Die Birnenblüte öffnet sich'],['pear','Eine Birne wächst'],['bowl','Wir legen sie in die Schale']],
    [['cow','Die Kuh gibt Milch'],['bucket','Wir sammeln die Milch'],['cheese','Daraus wird Käse']],
    [['sunflower','Die Sonnenblume blüht'],['vocab-seed','Ihre Kerne sind reif'],['bird-sit','Ein Vogel frisst die Kerne']],
    [['vocab-cloth','Wir nehmen ein Tuch'],['water','Wir machen es nass'],['vocab-table','Wir wischen den Tisch']],
    [['book','Wir suchen ein Buch aus'],['reader','Wir lesen es'],['bed','Danach gehen wir schlafen']],
    [['forest-apple','Wir pflücken einen Apfel'],['water','Wir waschen ihn'],['bowl','Wir legen ihn in die Schale']],
    [['forest-basket','Wir nehmen einen Korb mit'],['forest-mushroom','Wir finden Pilze'],['vocab-table','Wir prüfen sie mit Erwachsenen']],
    [['letter','Ein Brief kommt an'],['vocab-hand','Wir öffnen ihn'],['reader','Wir lesen ihn']],
    [['forest-flower','Wir pflücken eine Blume'],['water','Wir stellen sie ins Wasser'],['vocab-table','Wir stellen sie auf den Tisch']]
  ];
  stories.forEach((items,i)=>add('sequence','story-'+i,items.map(v=>v[1]).join(' → '),{kind:'order',prompt:'Was passiert zuerst? Tippe die Bilder der Reihe nach an.',items,order:[2,0,1],answer:[0,1,2]}));
  const treasures=['forest-leaf','forest-feather','forest-mushroom','forest-stone','forest-berry','forest-nut','forest-apple','forest-flower'];
  for(let i=0;i<8;i++)for(let missing=0;missing<4;missing++){const objects=Array.from({length:4},(_,n)=>treasures[(i+n)%8]);add('treasure',i+'-'+missing,'Korb '+(i+1)+', fehlt: '+objects[missing],{kind:'treasure',prompt:'Merke dir die vier Waldschätze.',objects,missing,answer:objects[missing],choices:[objects[missing],...objects.filter((_,n)=>n!==missing).slice(0,2)]});}
  for(let n=1;n<=18;n++)for(const given of [null,'left'])add('neighbours',n+'-'+(given||'both'),'Mitte '+n+(given?' / Vorgänger gegeben':''),{kind:'neighbours',prompt:'Welche Zahlen kommen davor und danach?',n,given,answer:[n-1,n+1],choices:Array.from(new Set([Math.max(0,n-2),n-1,n+1,n+2]))});
  for(let a=1;a<=10;a++)for(const b of [a,Math.max(1,a-1),Math.min(10,a+2)])if(!pools.compare?.some(t=>t.question.a===a&&t.question.b===b))add('compare',a+'-'+b,a+' und '+b,{kind:'compare',prompt:'Wo sind mehr Beeren?',a,b,answer:a===b?'equal':a>b?'left':'right',choices:['left','equal','right']});
  const mirrorMasks=[7,56,448,73,146,292,273,84,15,30,60,120,240,480,31,62,124,248,496,91,182,364,341,170,85,340,325,387,457,199];
  mirrorMasks.forEach((mask,n)=>{const left=Array.from({length:9},(_,i)=>i).filter(i=>mask&(1<<i));add('mirror','grid-'+mask,'Blattmuster '+(n+1),{kind:'mirror',prompt:'Ergänze rechts das Spiegelbild.',width:3,rows:3,left,answer:left.map(i=>Math.floor(i/3)*3+2-i%3).sort((a,b)=>a-b)});});
  for(let i=0;i<30;i++){const counts=[1+i%3,4+i%3,1+(i*3)%5],target=i%3,task=i%2?'most':'count',max=Math.max(...counts);if(task==='most'&&counts.filter(n=>n===max).length>1)counts[1]=6;const fruit=['forest-apple','pear','forest-berry'];add('survey','survey-'+i,'Umfrage '+(i+1)+' / '+task,{kind:'survey',prompt:task==='most'?'Welches Obst mögen die meisten Freunde?':'Wie viele Freunde wählen '+['den Apfel','die Birne','die Beere'][target]+'?',counts,fruit,target,task,answer:task==='most'?fruit[counts.indexOf(Math.max(...counts))]:counts[target],choices:task==='most'?fruit:numeric(counts[target],6)});}
  for(const c of ['m','l','s','n','r','f','t','p'])for(const v of ['a','i','o','u']){const answer=c+v,other=['a','i','o','u'].filter(x=>x!==v).map(x=>c+x);add('read-leaves',answer,answer,{kind:'leaves',prompt:'Finde dieselbe Silbe auf einem Blatt.',text:answer,answer,choices:[answer,...other]});}
  const colours=['rot','gelb','blau','rosa','weiss'],adjective={rot:'rote',gelb:'gelbe',blau:'blaue',rosa:'rosa',weiss:'weisse'};
  colours.forEach((a,i)=>{
    add('read-colours',a,a,{kind:'colours',prompt:'Welche Blume passt?',text:'Die Blume ist '+a+'.',answer:a,choices:[a,colours[(i+1)%5],colours[(i+2)%5]].map(n=>[n])});
    colours.filter(b=>b!==a).forEach(b=>{const answer='scene:puzzle-flower-'+a+'+puzzle-flower-'+b;add('read-colours',a+'-'+b,a+' links / '+b+' rechts',{kind:'reading',prompt:'Welche Blumen passen?',text:'Links steht eine '+adjective[a]+' Blume. Rechts steht eine '+adjective[b]+' Blume.',answer,choices:[answer,'scene:puzzle-flower-'+b+'+puzzle-flower-'+a,'scene:puzzle-flower-'+a+'+puzzle-flower-'+a]});});
  });
  for(const glyph of Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜabcdefghijklmnopqrstuvwxyzäöü'))add('trace','letter-'+glyph,glyph,{kind:'trace',glyph});
  for(const item of ['forest-nut','forest-apple','forest-feather'])for(let n=0;n<=9;n++)add('trace-numbers','digit-'+n+'-'+item,n+' / '+item,{kind:'trace',glyph:String(n),quantity:{count:n,item}});
  // Strip legacy generator bookkeeping: question identity belongs to the editorial item.
  for(const pool of Object.values(pools))for(const item of pool){delete item.question.id;delete item.question.round;}
  const canonical=v=>Array.isArray(v)?'['+v.map(canonical).join(',')+']':v&&typeof v==='object'?'{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+canonical(v[k])).join(',')+'}':JSON.stringify(v);
  function hash(v){const s=canonical(v);let a=2166136261,b=5381;for(let i=0;i<s.length;i++){a=Math.imul(a^s.charCodeAt(i),16777619);b=Math.imul(b,33)^s.charCodeAt(i);}return (a>>>0).toString(16).padStart(8,'0')+(b>>>0).toString(16).padStart(8,'0');}
  function puzzle(id){const g=FK.friendsLibrary.catalogue().find(g=>g.id===id),m=meta[id];return g&&m?{...g,hostName:C.hosts[g.host].name,reference:m[0],competence:m[1],difficulty:m[2],instruction:R.instructions[id]}:null;}
  const iterations=id=>clone(pools[id]||[]);
  const implementation=()=>FK.puzzleImplementation||'unbuilt';
  const iterationRevision=(id,item)=>hash({blueprint:1,implementation:implementation(),puzzle:puzzle(id),item});
  const puzzleRevision=id=>hash({blueprint:1,implementation:implementation(),puzzle:puzzle(id),items:iterations(id)});
  // The same revisions under earlier releases whose puzzles are unchanged (reviews made there carry over).
  const former=()=>FK.puzzleFormerImplementations||[];
  const formerIterationRevisions=(id,item)=>former().map(impl=>hash({blueprint:1,implementation:impl,puzzle:puzzle(id),item}));
  const formerPuzzleRevisions=id=>{const p=puzzle(id),items=iterations(id);return former().map(impl=>hash({blueprint:1,implementation:impl,puzzle:p,items}));};
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
  FK.puzzleCatalogue={matchesSession,meta,puzzle,iterations,canonical,hash,iterationRevision,puzzleRevision,formerIterationRevisions,formerPuzzleRevisions,select,prepare};
})();
