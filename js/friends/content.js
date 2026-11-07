/* Versioned task snapshots are copied into saves; updates never rewrite an active question. */
(function (root) {
  'use strict';
  const hosts = {
    squirrel: { name: 'Eichhörnchen', picture: 'squirrel', resource: 'nuts', category: 'Mathematik', code: 'NUM-01', reference: 'MA.1.A.2.a', instruction: 'Wie viele Nüsse sind hier?' },
    bird: { name: 'Blaumeise', picture: 'bird', resource: 'seeds', category: 'Lesen', code: 'SOUND-01', reference: 'D.2.A.1.b; D.1.A.1.b', instruction: 'Lies die Wörter. Was reimt sich?' },
    owl: { name: 'Waldkauz', picture: 'owl', resource: 'feathers', category: 'Lesen', code: 'READ-02', reference: 'D.2.A.1.b; D.2.B.1.b', instruction: 'Lies den Satz. Tippe auf das passende Bild.' },
    beaver: { name: 'Biber', picture: 'beaver', resource: 'logs', category: 'Mathematik', code: 'SPACE-01', reference: 'MA.2.A.1.a', instruction: 'Welche Form passt in die Lücke?' },
    mouse: { name: 'Maus', picture: 'mouse', resource: 'berries', category: 'Lesen', code: 'READ-01', reference: 'D.2.A.1.b', instruction: 'Lies das Wort. Welches Bild passt?' },
  };
  const words = { Maus:'mouse', Haus:'house', Hut:'hat', Rose:'rose', Nase:'nose', Fisch:'fish', Tisch:'table', Ball:'ball', Baum:'tree', Boot:'boat', Kuh:'cow', Schuh:'shoe', Bein:'leg', Stein:'stone', Buch:'book', Tuch:'cloth', Hase:'hare', Dose:'tin', Bus:'bus', Nuss:'nut', Stern:'star', Turm:'tower', Wurm:'worm', Topf:'pot', Kopf:'head', Hand:'hand', Sand:'sand', Schal:'scarf', Wal:'whale', Seil:'rope', Pfeil:'arrow', Tasse:'cup', Kasse:'till', Bank:'bench', Schrank:'wardrobe', Kern:'seeds' };
  const version = 'friends-1';
  function task(host, id, data) { return { id: hosts[host].code+'-'+id, version, host, ...data }; }
  const pools = {};
  pools.squirrel = Array.from({length:21}, (_,n) => task('squirrel',n,{ kind:'count', count:n, answer:String(n), choices:[Math.max(0,n-1),n,n+1].filter((v,i,a)=>a.indexOf(v)===i).concat(n===0?[2]:[]).map(v=>String(v>20?18:v)) })).filter(t=>t.count!==3);
  // Every scored word has one unambiguous picture, three distinct options and no demo word (Ast).
  const reading = ['Maus','Haus','Hut','Rose','Nase','Fisch','Tisch','Ball','Baum','Boot','Kuh','Schuh','Bein','Stein','Buch','Hase','Dose','Nuss'];
  pools.mouse = reading.map((word,i) => task('mouse',i,{kind:'word',target:word,answer:words[word],choices:[words[word],words[reading[(i+3)%reading.length]],words[reading[(i+7)%reading.length]]] }));
  // No Haus/Maus demonstration, reversed duplicates or abstract picture names in scored rhymes.
  const rhymes = [['Tisch','Fisch','Hut'],['Bein','Stein','Boot'],['Kuh','Schuh','Ball'],['Hase','Nase','Baum'],['Rose','Dose','Hut'],['Buch','Tuch','Ball'],['Bus','Nuss','Hut'],['Turm','Wurm','Boot'],['Topf','Kopf','Baum'],['Hand','Sand','Kuh'],['Schal','Wal','Hut'],['Seil','Pfeil','Rose'],['Tasse','Kasse','Schuh'],['Bank','Schrank','Fisch'],['Stern','Kern','Hut']];
  pools.bird = rhymes.map(([word,right,wrong],i)=>task('bird',i,{kind:'rhyme',target:word,targetPicture:words[word],answer:right,choices:[right,wrong]}));
  const sentences = [
    ['Die Maus sitzt.','mouse-sit','mouse-run'],['Die Maus rennt.','mouse-run','mouse-sit'],['Der Vogel fliegt.','bird-fly','bird-sit'],['Der Vogel sitzt.','bird-sit','bird-fly'],['Der Fisch schwimmt.','fish-swim','mouse-run'],
    ['Der Hase rennt.','hare-run','hare-sit'],['Der Hase sitzt.','hare-sit','hare-run'],['Der Fuchs schläft.','fox-sleep','fox-run'],['Der Fuchs rennt.','fox-run','fox-sleep'],['Die Katze schläft.','cat-sleep','cat-sit'],
    ['Die Katze sitzt.','cat-sit','cat-sleep'],['Der Hund rennt.','dog-run','dog-sleep'],['Der Hund schläft.','dog-sleep','dog-run'],['Die Ente schwimmt.','duck-swim','duck-fly'],['Die Ente fliegt.','duck-fly','duck-swim'],
  ];
  pools.owl=sentences.map(([target,answer,wrong],i)=>task('owl',i,{kind:'sentence',target,answer,choices:[answer,wrong]}));
  const shapes=['circle','triangle','square','rectangle'];
  // Five pictured objects, each with four genuinely different missing parts (not colour-only variants).
  const objects={house:['window-round','roof','window','door'],cart:['wheel','flag','parcel','side'],train:['wheel','roof','window','carriage'],boat:['porthole','sail','crate','cabin']};
  pools.beaver=Object.entries(objects).flatMap(([object,parts],o)=>shapes.map((answer,i)=>task('beaver',o*4+i,{kind:'shape',object,part:parts[i],answer,choices:[answer,shapes[(i+1)%4],shapes[(i+2)%4]]})));
  const examples = {
    squirrel:task('squirrel','example',{kind:'count',count:3,answer:'3',choices:['2','3','4'], explanation:'Jede Nuss zählt einmal. Es sind drei.'}),
    mouse:task('mouse','example',{kind:'word',target:'Ast',answer:'branch',choices:['house','branch','hat'],explanation:'Das Wort heisst Ast. Dieses Bild passt.'}),
    bird:task('bird','example',{kind:'rhyme',target:'Haus',targetPicture:'house',answer:'Maus',choices:['Maus','Baum'],explanation:'Haus und Maus. Höre: Beide enden gleich.'}),
    owl:task('owl','example',{kind:'sentence',target:'Die Maus schläft.',answer:'mouse-sleep',choices:['mouse-run','mouse-sleep'],explanation:'Die Maus schläft. Das Bild mit der schlafenden Maus passt.'}),
    beaver:task('beaver','example',{kind:'shape',object:'tent',part:'roof',answer:'triangle',choices:['circle','triangle','square'],explanation:'Das Dreieck passt in die Lücke.'}),
  };
  const shop={leaf:{name:'Blatt-Malvorlage',picture:'leaf',resource:'seeds',price:2,permanent:true},pencils:{name:'Buntstifte',picture:'pencils',resource:'logs',price:2,permanent:true},apple:{name:'Apfel',picture:'apple',resource:'nuts',price:1},bath:{name:'Schaumbad',picture:'bath',resource:'feathers',price:2}};
  const api={version,hosts,pools,examples,shop,words};
  if(typeof module!=='undefined')module.exports=api;else root.FriendsContent=api;
})(typeof window!=='undefined'?window:globalThis);
