/* One woodland vocabulary, catalogue and visual language. Saved game IDs stay stable. */
(function () {
  'use strict';
  const FK=window.FK;
  const names={count:'Waldkäfer zählen',add:'Äpfel rechnen',pattern:'Waldmuster',nature:'Naturdetektive',
    rocket:'Glühwürmchen sammeln',picnic:'Waldpicknick',double:'Nüsse verdoppeln',shapes:'Waldwerkstatt',
    rhyme:'Waldreime',syllable:'Silben klopfen',robot:'Waldpost',sequence:'Was kommt zuerst?',
    treasure:'Waldschatz',neighbours:'Zahlennachbarn',compare:'Beeren vergleichen',mirror:'Waldspiegel',vowels:'Waldwörter ergänzen',survey:'Waldumfrage',
    'read-puzzle':'Silben-Puzzle','read-word':'Wort und Waldbild','read-leaves':'Silbenblätter','read-colours':'Farben lesen',trace:'Schreibspuren',dots:'Zahlenwege'};
  const reading=[['read-puzzle','puzzle','words'],['read-word','wort','mouse'],['read-leaves','ballone','leaf'],['read-colours','genau','flower']]
    .map(([id,game,picture])=>({id,screen:'read',host:'mouse',title:names[id],picture,params:{game}}));
  const icons={pattern:'forest-leaf',rhyme:'bird-sit',syllable:'forest-branch',robot:'forest-post',rocket:'forest-lantern',double:'forest-nut',shapes:'forest-shapes',sequence:'sprout',treasure:'forest-basket',compare:'forest-berry'};
  const words=[['Ha-se','🐰'],['Bi-ber','🦫'],['I-gel','🦔'],['Fe-der','🪶'],['Ro-se','🌹'],['Lu-pe','🔍'],['Blu-me','🌸'],['Tan-ne','🌲'],['Ap-fel','🍎'],['Rau-pe','🐛'],['Bee-re','🫐'],['Bie-ne','🐝'],['Maus','🐭'],['Baum','🌳'],['Pilz','🍄'],['Nuss','🌰'],['Fisch','🐟'],['Nest','🪺'],['Blatt','🍃'],['Son-ne','☀️']]
    .map(([w,e])=>({w,e,lvl:1}));
  const phrases=[['Die Sonne ist gelb.','☀️','gelb'],['Die Maus ist grau.','🐭','grau'],['Der Baum ist grün.','🌳','gruen'],['Die Blume ist rosa.','🌸','rosa'],['Der Apfel ist rot.','🍎','rot'],['Der Pilz ist braun.','🍄','braun']]
    .map(([t,e,color])=>({t,e,check:{emoji:e,color}}));
  const pictures={nut:'forest-nut',apple:'forest-apple',leaf:'forest-leaf',feather:'forest-feather',fir:'forest-fir',mushroom:'forest-mushroom',flower:'forest-flower',honey:'forest-honey',rose:'forest-rose',rocket:'forest-lantern',shapes:'forest-shapes',robot:'forest-post',picnic:'forest-basket',mouse:'mouse-sit',bird:'bird-sit',rabbit:'hare-sit',cat:'cat-sit',dog:'dog-sleep',fish:'fish-swim'};
  const actions=['mouse-sit','mouse-run','mouse-sleep','bird-fly','bird-sit','fish-swim','hare-run','hare-sit','fox-sleep','fox-run','cat-sleep','cat-sit','dog-run','dog-sleep','duck-swim','duck-fly'];
  const sequences=[
    ['Wir pflanzen eine Bohne.',['🫘 Bohne in feuchte Erde legen','🌱 Keimling wächst']],
    ['Ein Vogel wird gross.',['🥚 Ei im Nest','🐣 Jungvogel schlüpft']],
    ['Eine Raupe verändert sich.',['🐛 Raupe','🦋 Schmetterling']],
    ['Die Nacht kommt.',['🌇 Sonnenuntergang','🌙 Nacht']],
    ['Wir ernten einen Apfel.',['🌸 Apfelblüte','🍎 Reifer Apfel']],
  ];
  function question(q,id,round){
    if(!FK.friendsLibrary?.active)return q;
    if(id==='count')return {...q,prompt:'Wie viele Marienkäfer findest du im Wald?'};
    if(id==='pattern')return {...q,prompt:'Welches Waldschatz-Bild kommt als Nächstes?',hint:'Schau auf die kleine Gruppe aus Blättern, Nüssen und Federn. Sie wiederholt sich.'};
    if(id==='vowels'){
      const entry=words[(round*3)%words.length],word=entry.w.replace(/-/g,''),index=Array.from(word).findIndex(c=>/[aeiou]/i.test(c)),answer=word[index];
      return {...q,word,index,answer,emoji:entry.e,choices:FK.shuffle([answer,...['a','e','i','o','u'].filter(c=>c!==answer).slice(0,2)]),hint:'Das Bild zeigt «'+word+'». Welcher Vokal fehlt?',explain:'Jetzt steht hier «'+word+'».'};
    }
    if(id==='rocket')return {...q,prompt:'Wie viele Glühwürmchen fehlen noch in der Laterne?',hint:'Zähle die Glühwürmchen. Ergänze bis zur Zahl auf der Laterne.',explain:'Die Laterne ist voll. Alle Glühwürmchen leuchten!'};
    if(id==='double')return {...q,prompt:'Lege noch einmal gleich viele Nüsse dazu. Wie viele sind es zusammen?',hint:'Jede Nuss bekommt eine zweite Nuss als Partner.',explain:'Zwei gleich grosse Nussgruppen sind das Doppelte.'};
    if(id==='robot')return {...q,prompt:'Plane den Weg für die Waldpost zum Briefkasten.',hint:'Die Post geht nur über freie Felder. Plane einen Pfeil nach dem anderen.'};
    if(id==='sequence'){
      const [prompt,ordered]=sequences[round%sequences.length];
      return {...q,prompt,ordered,answer:ordered,items:FK.shuffle(ordered),hint:'Was passiert zuerst? Lege die Bilder in die richtige Reihenfolge.',explain:'Die Waldgeschichte ist richtig geordnet.'};
    }
    return q;
  }
  function title(id,fallback){return FK.friendsLibrary?.active?(names[id]||fallback):fallback;}
  function firefly(){return FK.h('span',{class:'puzzle-firefly','aria-hidden':'true',html:'<svg viewBox="0 0 64 64"><ellipse cx="23" cy="24" rx="10" ry="15" fill="#e3e9ce" stroke="#8e9b6b" transform="rotate(-28 23 24)"/><ellipse cx="41" cy="24" rx="10" ry="15" fill="#e3e9ce" stroke="#8e9b6b" transform="rotate(28 41 24)"/><ellipse cx="32" cy="39" rx="11" ry="16" fill="#e7c35f" stroke="#947647" stroke-width="2"/><circle cx="32" cy="20" r="8" fill="#80633c"/><ellipse cx="30" cy="42" rx="5" ry="8" fill="#fff0a9"/></svg>'});}
  FK.puzzles={names,reading,words,phrases,pictures,actions,question,title,firefly,icons};
})();
