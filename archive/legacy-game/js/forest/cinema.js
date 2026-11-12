/* Authored, child-controlled films. Watching a scene never repairs the world. */
(function () {
  'use strict';
  const FK=window.FK,KEY='farbtupf.cinema.v1';
  let seen={};
  try { const saved=JSON.parse(localStorage.getItem(KEY));if(saved?.version===1)for(const [id,value]of Object.entries(saved.seen||{}))if(/^[a-z0-9:-]{1,90}$/.test(id)&&value===true)seen[id]=true; } catch(_){}
  const names={fox:'Fuchs',narrator:'Der Herzbaum',...FK.forestStory.names};
  const beat=(speaker,text,shot,extra={})=>({speaker,text,shot,mood:'gentle',...extra});
  const requests={
    bridge:[
      beat('beaver','Ach, Fuchs … ich vermisse meinen Freund Hase.','friend',{mood:'sad'}),
      beat('beaver','Er wohnt dort drüben. Aber in unserer Brücke fehlen Bretter.','bridge',{mood:'sad',action:'gap'}),
      beat('hare','Biber! Ich bin hier! Wie gern würde ich wieder mit dir spielen!','across',{mood:'longing',action:'wave'}),
      beat('fox','Auf den Brettern sind Bilder. Finde das nächste Bild. Dann hält die Brücke wieder!','together',{action:'plank',mood:'hopeful'}),
    ],
    rest:[
      beat('hedgehog','Brrr … mein Ruheplatz ist ganz kahl. Hier liege ich allein.','friend',{mood:'sad',action:'shiver'}),
      beat('fox','Deine Waldschätze sind wunderschön. Daraus machen wir es gemütlich!','together',{action:'leaves',mood:'curious'}),
      beat('hedgehog','Merk dir meine Lieblingsschätze. Dann darfst du dich zu mir kuscheln.','friend',{mood:'hopeful'}),
    ],
    sign:[
      beat('owl','Huhu? Niemand kommt zu meiner Geschichtenmulde.','friend',{mood:'sad'}),
      beat('owl','Am Wegweiser fehlt das Bild. Meine Freunde finden den Weg nicht.','project',{action:'point',mood:'worried'}),
      beat('fox','Zeigen wir ihnen den Weg. Deine Geschichten sollen alle hören!','together',{action:'map',mood:'hopeful'}),
    ],
    water:[
      beat('kingfisher','Psst! Hier glitzert das Wasser. Doch mein schöner Platz ist zugewachsen.','friend',{mood:'longing'}),
      beat('kingfisher','Allein schauen ist nur halb so schön. Bleibst du bei mir?','project',{action:'point',mood:'sad'}),
      beat('fox','Natürlich! Finden wir deine Waldschätze und machen den Blick frei.','together',{action:'leaves',mood:'hopeful'}),
    ],
    path:[
      beat('hare','Ich würde so gern jeden Tag zum Igel hüpfen!','friend',{mood:'longing'}),
      beat('hedgehog','Der kurze Gartenweg ist zugewachsen. Ich warte schon so lange.','project',{mood:'sad'}),
      beat('fox','Ein Muster aus Trittsteinen! So finden eure Pfoten wieder zueinander.','together',{action:'point',mood:'hopeful'}),
    ],
    stories:[
      beat('owl','Ich habe eine neue Geschichte. Aber Geschichten brauchen jemanden, der zuhört.','friend',{mood:'sad'}),
      beat('kingfisher','Bei mir am Wasser wäre Platz für uns beide!','project',{mood:'hopeful',action:'wave'}),
      beat('fox','Dann suchen wir einen Weg zueinander. Die Geschichten nehmen wir mit.','together',{action:'map',mood:'hopeful'}),
    ],
    clearing:[
      beat('beaver','Hier am Herzbaum haben wir uns früher alle getroffen.','project',{mood:'longing'}),
      beat('beaver','Jetzt rascheln hier nur die alten Blätter. Unser Treffpunkt fehlt mir.','friend',{mood:'sad',action:'leaves'}),
      beat('fox','Machen wir wieder Platz für alle. Hilfst du uns, die Waldschätze zu ordnen?','together',{mood:'hopeful'}),
    ],
    bench:[
      beat('hedgehog','Bald sind alle hier! Aber wo sollen wir zusammen sitzen?','friend',{mood:'worried'}),
      beat('beaver','Ich habe Holz mitgebracht. Eine Bank für alle Freunde!','project',{action:'plank',mood:'hopeful'}),
      beat('fox','Ein Platz für dich, ein Platz für mich. Bauen wir sie gemeinsam!','together',{action:'plank',mood:'joyful'}),
    ],
    invitation:[
      beat('kingfisher','Der Treffpunkt ist fertig. Jetzt fehlen nur noch unsere Freunde!','friend',{mood:'excited'}),
      beat('hare','Unsere Einladungen haben Bilder. So weiss jeder: Du gehörst dazu!','together',{action:'invitation',mood:'joyful'}),
      beat('fox','Bringen wir sie zu allen Nachbarn. Das grosse Treffen kann beginnen!','project',{action:'map',mood:'hopeful'}),
    ],
  };
  const thanks={bridge:'Sie hält! Endlich kann ich Hase wieder besuchen. Danke, kleiner Fuchs!',rest:'Ahh … so weich! Komm, kuschel dich zu mir. Jetzt bin ich nicht mehr allein.',sign:'Huhu! Meine Freunde finden mich wieder. Ich habe so viele Geschichten für euch!',water:'Schau, wie das Wasser glitzert! Danke, dass du bei mir geblieben bist.',path:'Juhui! Jetzt kann ich jeden Tag zum Igel hüpfen. Du hast uns einen Freundschaftsweg gebaut!',stories:'Eisvogel, ich bin da! Komm, ich erzähle dir meine schönste Geschichte.',clearing:'Hier ist wieder Platz für uns alle. Unser alter Treffpunkt ist zurück!',bench:'Ein Platz für dich. Ein Platz für mich. Niemand muss mehr allein sitzen!',invitation:'Alle sind eingeladen! Hörst du schon ihre Schritte? Sie kommen zum Herzbaum!'};
  function script(kind,q=null,growth=FK.heartTree.count()) {
    growth=Math.max(0,Math.min(9,Math.floor(Number(growth)||0)));
    const replay=kind==='opening-replay';
    const common={growth,project:q?.picture||'tree',resident:q?.resident||'beaver',partner:q?.partner||null,meeting:kind==='reunion',...(replay?{visualGrowth:0,preview:'beginning'}:{})};
    let id=kind,title='Der Herzbaum',beats;
    if(kind==='opening'||replay){
      title=replay?'So fing alles an':growth?'Unser Wald lebt weiter':'Das leise Herz des Waldes';
      beats=growth&&!replay?[
        beat('narrator','Da ist er: unser Herzbaum. Hier gehört jeder dazu.','tree-wide'),
        beat('fox',growth===9?'Du hast alle Freunde zusammengebracht. Schau, wie unser Baum leuchtet!':'Schon '+growth+' Äste sind wieder grün. Deine Hilfe hat sie geweckt!','tree-close',{mood:'joyful',action:'pulse'}),
        beat('narrator',growth===9?'Der Wald ist voller Geschichten. Besuche deine Freunde oder entdecke ein Spiel.':'Wenn wir einander helfen, kommt Leben zurück. Unser nächster Freund wartet schon.','tree-wide',{mood:'hopeful'}),
      ]:[
        beat('narrator','Mitten im Wald steht ein alter Baum. Sein Herz ist ganz still geworden.','tree-wide',{action:'last-leaf'}),
        beat('fox','Hallo, grosser Baum … Wo sind denn alle deine Blätter?','tree-fox',{mood:'curious',action:'touch-heart'}),
        beat('narrator','Früher trafen sich hier alle Freunde. Nun sind ihre Wege kaputt. Die Plätze bleiben leer.','empty-clearing',{mood:'sad'}),
        beat('beaver','Ach … wenn ich meinen Freund Hase doch wiedersehen könnte!','bridge',{mood:'sad',action:'gap'}),
        beat('fox','Komm! Wir helfen den Freunden. Jede Freundschaft schenkt dem Herzbaum neues Leben.','tree-fox',{mood:'hopeful',action:'promise'}),
      ];
      if(replay){beats[0]={...beats[0],text:'Weisst du noch? Als der Fuchs ankam, war das Herz im Baum ganz still.'};if(growth)beats.push(beat('narrator','Und schau, wie viel Leben du schon zurückgebracht hast! Hier wachsen eure Freundschaften.','tree-wide',{mood:'joyful',visualGrowth:growth,preview:null}));}
    }else if(kind==='request'){
      id='request:'+q.id;title=q.title;beats=requests[q.picture];
    }else if(kind==='return'){
      id='return:'+q.id;title='Ein Herzlicht für unseren Baum';
      beats=[
        beat(q.resident,thanks[q.picture],q.picture==='bridge'?'friend':'together',{mood:'joyful',action:'celebrate',visualGrowth:Math.max(0,growth-1)}),
        beat('fox','Schau! Zwischen euch leuchtet etwas. Ein kleines Herzlicht!',q.picture==='bridge'?'bridge':'together',{mood:'amazed',action:'spark',visualGrowth:Math.max(0,growth-1)}),
        beat('narrator','Es trägt eure Freundschaft nach Hause. Zum Herzbaum, mitten im Wald.','spark-flight',{action:'carry',visualGrowth:Math.max(0,growth-1)}),
        beat('fox',growth===9?'Er ist wach! Alle neun Äste leuchten. Unsere Freunde können nach Hause kommen!':'Ein neuer Ast wird grün! Das hast du geschafft. Helfen wir dem nächsten Freund?','tree-close',{mood:'joyful',action:'grow',visualGrowth:growth}),
      ];
    }else if(kind==='reunion'){
      title='Endlich wieder zusammen!';beats=[
        beat('hare','Biber? Biber! Da bist du ja!','across',{mood:'excited',action:'wave'}),
        beat('beaver','Hase! Oh, ich habe dich so vermisst!','reunion',{mood:'joyful',action:'reunion'}),
        beat('hare','Danke, kleiner Fuchs. Jetzt muss keiner mehr allein spielen.','together',{mood:'joyful',action:'celebrate'}),
      ];
    }else if(kind==='chapter:reconnect'||kind==='chapter:gather'){
      const gather=kind.endsWith('gather');title=gather?'Ein Platz für alle':'Unsere Wege finden zusammen';
      beats=[
        beat('narrator','Hörst du es? Das Herz im Baum schlägt wieder ein bisschen kräftiger.','tree-close',{action:'pulse',mood:'hopeful'}),
        beat('fox',gather?'Die Wege verbinden uns wieder. Bereiten wir am Herzbaum ein grosses Treffen vor!':'Wir kennen jetzt alle Nachbarn. Nun machen wir die kurzen Wege zueinander frei.','tree-friends',{mood:'joyful',action:'gather'}),
        beat('narrator',gather?'Eine gemütliche Bank. Eine Einladung für jeden. Und mittendrin: du.':'Jeder neue Weg beginnt mit einer kleinen Hilfe. Und jeder führt ein Stück nach Hause.','tree-wide',{mood:'hopeful',action:'pulse'}),
      ];
    }else if(kind==='ending'){
      title='Der Wald findet nach Hause';beats=[
        beat('fox','Hört ihr die Schritte? Sie kommen! Alle kommen!','tree-wide',{mood:'excited',action:'gather'}),
        beat('beaver','Eine Brücke hat uns wieder zusammengebracht. Danke, kleiner Fuchs!','tree-friends',{mood:'joyful',action:'celebrate'}),
        beat('owl','Aus kleinen Hilfen sind neue Wege geworden. Und aus neuen Wegen: Freundschaft.','tree-friends',{mood:'gentle'}),
        beat('narrator','Neun Herzlichter. Neun grüne Äste. Der Herzbaum lebt!','tree-close',{mood:'joyful',action:'bloom'}),
        beat('hare','Hier ist dein Platz, kleiner Fuchs. Du gehörst zu uns.','tree-friends',{mood:'joyful',action:'celebrate'}),
      ];
    }else return null;
    return {id,title,beats:beats.map(b=>({...common,...b}))};
  }
  function mark(id){seen[id]=true;try{localStorage.setItem(KEY,JSON.stringify({version:1,seen}));}catch(_){}}
  FK.forestCinema={KEY,names,script,seen:id=>seen[id]===true,mark};
})();
