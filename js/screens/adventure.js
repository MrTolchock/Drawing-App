/* Pictured, spoken and directly editable woodland games. */
(function () {
  'use strict';
  const FK = window.FK, h = FK.h;
  let body, title, game, stage, round, q, locked, feedback, next, cleanup = () => {};
  function touchAction(node,fn){
    node.addEventListener('pointerup',event=>{
      if(event.pointerType!=='touch'||!event.isPrimary||node.disabled||event.fkPlayHandled)return;
      const r=node.getBoundingClientRect();
      if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)return;
      event.fkPlayHandled=true;fn();
    });
    return node;
  }
  const button = (text, fn, cls = '') => {
    const run=()=>{if(!locked)fn();};
    return touchAction(h('button',{type:'button',class:'learn-button '+cls,text,onclick:run}),run);
  };
  function say(text) { feedback.textContent=text; FK.play.speak(text); }
  function success() {
    if(locked) return; locked=true;
    FK.play.attempt?.(true);
    body.querySelectorAll('.adventure-work button').forEach(b=>b.disabled=true);
    feedback.textContent='Juhui! '+q.explain; FK.play.feedback(body,feedback.textContent,true); next.hidden=false;
    if(q.kind==='rocket') body.querySelector('.play-rocket').classList.add('launching');
  }
  function check(ok, message = q.hint) { if(locked) return; if(ok) success(); else {FK.play.attempt?.(false);FK.sound.undo();say(message);} }
  function stars(n) { return h('span',{class:'adventure-quantity','aria-label':n+' Sterne'},Array.from({length:n},()=>FK.visual.art('star'))); }
  function shape(id, rotated, target = false) {
    const paths = {circle:'<circle cx="60" cy="60" r="36"/>',triangle:'<path d="M60 16 104 98H16Z"/>',square:'<rect x="27" y="27" width="66" height="66"/>',rectangle:'<rect x="14" y="38" width="92" height="44"/>'};
    const vertices = {circle:[],triangle:[[60,16],[104,98],[16,98]],square:[[27,27],[93,27],[93,93],[27,93]],rectangle:[[14,38],[106,38],[106,82],[14,82]]};
    const angle = typeof rotated === 'number' ? rotated : rotated ? 25 : 0;
    return '<svg viewBox="0 0 120 120" aria-hidden="true"><g fill="'+(target?'#e0d8be':'#b7d4df')+'" stroke="#756247" stroke-width="4"'+(angle?' transform="rotate('+angle+' 60 60)"':'')+'>'+paths[id]+(target&&stage===2?vertices[id].map(([x,y])=>'<circle cx="'+x+'" cy="'+y+'" r="6" fill="#a86645" stroke="none"/>').join(''):'')+'</g></svg>';
  }
  function wordPicture(word) {
    const known = FK.adventures.rhymePictures[word];
    if(known) return FK.play.picture(known,word);
    return FK.play.wordDrawing(word);
  }
  function work(host) {
    if(q.mode==='fill') {
      rocketBoard(host);
    } else if(q.mode==='share') {
      picnicBoard(host);
    } else if(q.mode==='double') {
      doubleBoard(host);
    } else if(q.mode==='build') {
      shapeBoard(host);
    } else if(q.mode==='clap') {
      let count=0;const meter=h('p',{class:'adventure-meter',role:'status',text:'0 Schläge'});
      host.append(FK.play.picture(q.emoji,q.word),FK.play.listen(()=>q.word,'Wort hören'),h('p',{class:'adventure-word',text:FK.text.word(q.word)}),
        button('🥁',()=>{if(count<8){count++;meter.textContent=count+' '+(count===1?'Schlag':'Schläge');FK.sound.tick();}},'adventure-drum'),meter,
        button('↶',()=>{count=Math.max(0,count-1);meter.textContent=count+' Schläge';}),button('✓ Prüfen',()=>check(count===q.answer),'learn-next'));
    } else if(q.mode==='route') {
      const board=FK.ui.routeBoard({question:q,planning:true,onSuccess:success,onBlocked:()=>say('Dort ist der Rand oder eine Hecke. Probiere einen anderen Pfeil.')});
      cleanup=()=>board.dispose?.();host.append(board);
    } else if(q.mode==='order') {
      orderBoard(host);
    } else {
      if(q.kind==='rhyme') host.append(h('div',{class:'play-rhyme-word'},h('div',{class:'play-word-card'},wordPicture(q.word),h('small',{text:FK.text.word(q.word)})),FK.play.listen(()=>q.word,'Suchwort '+q.word+' hören')));
      const row=h('div',{class:'learn-answers'});
      FK.shuffle(q.choices).forEach(value=>{
        const name=q.kind==='shapes'?FK.adventures.shapes.find(s=>s.id===value).name:String(value);
        const b=button(q.kind==='shapes'?'':name,()=>{const ok=value===q.answer;b.classList.add(ok?'correct':'try-again');check(ok);},'learn-answer'+(q.kind==='shapes'?' adventure-shape':''));
        b.dataset.answer=String(value);b.setAttribute('aria-label',name);
        if(q.kind==='shapes') b.innerHTML=shape(value,q.rotated);
        if(q.kind==='rhyme') {
          b.replaceChildren(h('span',{class:'play-word-card'},wordPicture(value),h('small',{text:FK.text.word(value)})));
          row.append(h('div',{class:'play-word-choice'},b,FK.play.listen(()=>String(value),'Wort '+value+' hören')));
        } else row.append(b);
      });host.append(row);
    }
  }
  // Direct manipulation shares one gesture implementation. A drag moves the
  // existing token only after pointerup, so iPhone touch targets stay attached.
  // Every drag also has an ordinary tap/keyboard path.
  function dragBoard(host) {
    let drag=null, ghost=null, over=null, suppressClick=false, scrollFrame=0;
    function clear() {
      cancelAnimationFrame(scrollFrame);scrollFrame=0;
      ghost?.remove();ghost=null;over?.classList.remove('drop-ready');over=null;
      drag?.node.classList.remove('piece-dragging');drag=null;
    }
    function highlight(x,y){
      const target=document.elementFromPoint(x,y)?.closest('[data-drop]');
      over?.classList.remove('drop-ready');over=target&&host.contains(target)?target:null;over?.classList.add('drop-ready');
    }
    function scrollWhileDragging(){
      if(!drag?.moved)return;
      const area=host.closest('.scroll');
      if(area){
        const r=area.getBoundingClientRect(),edge=48,y=drag.currentY;
        const delta=y<r.top+edge?-Math.min(18,(r.top+edge-y)/2):y>r.bottom-edge?Math.min(18,(y-r.bottom+edge)/2):0;
        if(delta){area.scrollTop+=delta;highlight(drag.currentX,y);}
      }
      scrollFrame=requestAnimationFrame(scrollWhileDragging);
    }
    host.addEventListener('pointerdown',()=>{suppressClick=false;},true);
    host.addEventListener('click',event=>{
      if(suppressClick&&event.detail!==0){suppressClick=false;event.preventDefault();event.stopImmediatePropagation();}
    },true);
    return {
      dispose:clear,
      wire(node,tap,drop) {
        node.addEventListener('click',()=>{if(!locked)tap();});
        node.addEventListener('pointerdown',e=>{
          if(locked||!e.isPrimary||e.button>0)return;
          drag={node,id:e.pointerId,x:e.clientX,y:e.clientY,currentX:e.clientX,currentY:e.clientY,moved:false};node.setPointerCapture(e.pointerId);
        });
        node.addEventListener('pointermove',e=>{
          if(!drag||drag.node!==node||drag.id!==e.pointerId)return;
          if(!drag.moved&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>8){
            drag.moved=true;scrollFrame=requestAnimationFrame(scrollWhileDragging);ghost=node.cloneNode(true);ghost.classList.add('adventure-drag-ghost');ghost.setAttribute('aria-hidden','true');ghost.tabIndex=-1;document.body.append(ghost);node.classList.add('piece-dragging');
          }
          drag.currentX=e.clientX;drag.currentY=e.clientY;
          if(!ghost)return;
          ghost.style.left=e.clientX+'px';ghost.style.top=e.clientY+'px';
          highlight(e.clientX,e.clientY);
        });
        node.addEventListener('pointerup',e=>{
          if(!drag||drag.node!==node||drag.id!==e.pointerId)return;
          const moved=drag.moved,target=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-drop]');clear();
          if(moved){suppressClick=true;e.fkPlayHandled=true;if(target&&host.contains(target))drop(target.dataset.drop);}
          else if(e.pointerType==='touch'){suppressClick=true;e.fkPlayHandled=true;tap();}
        });
        node.addEventListener('pointercancel',clear);
      },
    };
  }
  function rocketBoard(host) {
    const loaded=[],bank=[],gestures=dragBoard(host);let id=0;
    cleanup=gestures.dispose;
    const hold=h('div',{class:'rocket-hold',dataset:{drop:'rocket'},'aria-label':'Sterne neu einladen'});
    const meter=h('p',{class:'adventure-meter',role:'status'});
    const rocket=h('div',{class:'play-rocket rocket-challenge'},
      h('div',{class:'rocket-destination'},FK.play.picture('⭐'),h('strong',{text:String(q.total)}),h('span',{text:'für den Start'})),
      h('div',{class:'adventure-scene',text:'🚀'}),
      h('div',{class:'rocket-cargo'},h('section',{class:'rocket-original'},h('h3',{text:'Schon an Bord: '+q.filled}),stars(q.filled)),
        h('span',{class:'rocket-plus',text:'+'}),h('section',{class:'rocket-new'},h('h3',{text:'Deine Ladung'}),hold,meter)));
    const empty=h('span',{class:'rocket-empty',text:'⭐ ↓','aria-hidden':'true'});
    function update(){
      meter.textContent=loaded.length+' neu geladen';empty.hidden=loaded.length>0;
      unload.disabled=loaded.length===0;
      bank.forEach(b=>b.disabled=loaded.length+Number(b.dataset.amount)>q.total+5);
      rocket.classList.toggle('has-cargo',loaded.length>0);
    }
    function remove(token){if(locked)return;const i=loaded.indexOf(token);if(i<0)return;loaded.splice(i,1);token.remove();FK.sound.tick();update();}
    function add(amount){
      if(loaded.length+amount>q.total+5)return;
      for(let i=0;i<amount;i++){
        const b=h('button',{type:'button',class:'learn-button rocket-star','aria-label':'Geladenen Stern '+(++id)+' herausnehmen'},FK.visual.art('star'));
        gestures.wire(b,()=>remove(b),target=>{if(target==='rocket-bank')remove(b);});loaded.push(b);hold.append(b);
      }
      FK.sound.tick();update();
    }
    const controls=h('div',{class:'rocket-controls',dataset:{drop:'rocket-bank'}});
    q.loads.forEach(amount=>{
      const b=h('button',{type:'button',class:'learn-button rocket-load',dataset:{amount},'aria-label':amount+' '+(amount===1?'Stern':'Sterne')+' einladen'},
        stars(amount),h('b',{text:'+'+amount}));
      gestures.wire(b,()=>add(amount),target=>{if(target==='rocket')add(amount);});bank.push(b);controls.append(b);
    });
    const unload=button('↶ Einen herausnehmen',()=>remove(loaded[loaded.length-1]),'rocket-unload');
    hold.append(empty);
    host.append(FK.play.steps([['⭐','Ziel ansehen'],['🖐️','Sterne einladen'],['🚀','Start versuchen']]),rocket,controls,unload,
      button('🚀 Starten',()=>{
        const count=q.filled+loaded.length;
        check(count===q.total,count<q.total?'Pffft … die Rakete hat noch zu wenig Sternenkraft! Zähle die Sterne an Bord und lade noch welche ein.':'Uff, diese Ladung ist zu schwer! Nimm ein paar neu geladene Sterne heraus.');
      },'learn-next'));
    update();
  }
  function picnicBoard(host) {
    const names={fox:'Fuchs',hedgehog:'Igel',hare:'Hase',beaver:'Biber'};
    const places=Array(q.total).fill(-1),tokens=[],plates=[],zones=[],history=[],gestures=dragBoard(host);let selected=null;
    cleanup=gestures.dispose;
    const remaining=h('strong'),basketZone=h('div',{class:'picnic-basket-tokens'});
    const basket=h('section',{class:'play-berry-basket picnic-basket',dataset:{drop:'-1'},'aria-label':'Beerenkorb'},
      h('div',{class:'picnic-basket-heading'},FK.forestArt.icon('basket'),remaining),basketZone);
    const returnButton=button('↶ In den Korb',()=>{if(selected!==null)move(selected,-1);else say('Wähle zuerst eine Beere auf einem Teller.');},'picnic-return');
    const row=h('div',{class:'adventure-plates picnic-plates',style:{'--friends':q.recipients.length}});
    function update(){
      const counts=q.recipients.map((_,i)=>places.filter(p=>p===i).length),left=places.filter(p=>p===-1).length;
      remaining.textContent=left+' / '+q.total;
      basket.setAttribute('aria-label',left+' Beeren im Korb. Hierher ziehen, um eine Beere zurückzulegen.');
      tokens.forEach((b,i)=>{
        const where=places[i],zone=where===-1?basketZone:zones[where];
        if(b.parentNode!==zone)zone.append(b);
        b.classList.toggle('selected',selected===i);b.setAttribute('aria-pressed',String(selected===i));
        b.setAttribute('aria-label','Beere '+(i+1)+', '+(where===-1?'im Korb':'bei '+names[q.recipients[where]])+'. Zum Verschieben wählen oder ziehen.');
      });
      plates.forEach((plate,i)=>{
        plate.querySelector('.picnic-count').textContent=String(counts[i]);
        plate.querySelector('.picnic-give').setAttribute('aria-label','Eine Beere zu '+names[q.recipients[i]]+' geben. '+counts[i]+' Beeren auf dem Teller.');
      });
      undo.disabled=history.length===0;returnButton.disabled=selected===null||places[selected]===-1;
    }
    function move(token,to){
      if(locked||to< -1||to>=q.recipients.length)return;
      if(places[token]!==to){history.push([token,places[token]]);places[token]=to;FK.sound.tick();}
      selected=null;update();
    }
    function give(to){
      const token=selected===null?places.indexOf(-1):selected;
      if(token<0){say('Der Korb ist leer. Wähle eine Beere auf einem Teller und gib sie einem anderen Freund.');return;}
      move(token,to);
    }
    q.recipients.forEach((friend,i)=>{
      const zone=h('div',{class:'adventure-berries',dataset:{drop:String(i)}});
      const giveButton=button('',()=>give(i),'picnic-give');
      giveButton.append(FK.forestArt.character(friend),h('span',{class:'picnic-friend-name',text:names[friend]}),h('span',{class:'picnic-give-sign',text:'🫐 +1'}));
      const plate=h('section',{class:'adventure-plate',dataset:{drop:String(i)},'aria-label':names[friend]+'s Teller'},giveButton,
        h('div',{class:'picnic-plate-heading'},FK.play.picture('🫐'),h('strong',{class:'picnic-count',text:'0'})),zone);
      zones.push(zone);plates.push(plate);row.append(plate);
    });
    for(let i=0;i<q.total;i++){
      const b=h('button',{type:'button',class:'learn-button picnic-berry',dataset:{berry:String(i)},'aria-pressed':'false'},FK.play.picture('🫐'));
      gestures.wire(b,()=>{selected=selected===i?null:i;update();},target=>move(i,Number(target)));tokens.push(b);basketZone.append(b);
    }
    const undo=button('↶ Letzte Beere zurück',()=>{const last=history.pop();if(last){places[last[0]]=last[1];selected=null;update();}},'picnic-undo');
    host.append(FK.play.steps([['🫐','Beere ziehen'],['🦊','Oder Tier antippen'],['⚖️','Alle gleich viel']]),basket,row,undo,returnButton,
      button('✓ Picknick beginnen',()=>{
        const left=places.filter(p=>p===-1).length,counts=q.recipients.map((_,i)=>places.filter(p=>p===i).length);
        const ok=left===0&&counts.every(n=>n===q.answer);
        check(ok,left>0?'Im Korb warten noch Beeren! Gib sie den Freunden. Jeder soll am Ende gleich viele haben.':'Oh, ein Freund schaut noch hungrig! Vergleiche die Teller. Ziehe eine Beere von einem vollen auf einen leeren Teller.');
        if(ok)row.classList.add('picnic-party');
      },'learn-next'));
    update();
  }
  function doubleBoard(host) {
    const copies=[];let matched=false;
    const reflected=h('div',{class:'mirror-copy-group','aria-label':'Deine zweite Sternengruppe'}),count=h('span',{class:'mirror-copy-count',role:'status'});
    const mirror=h('div',{class:'mirror-building'},
      h('section',{class:'mirror-side'},h('h3',{text:'Hier: '+q.n}),stars(q.n)),
      h('div',{class:'mirror-magic-axis','aria-hidden':'true'},FK.play.picture('🪄')),
      h('section',{class:'mirror-side mirror-copy'},h('h3',{text:'Noch einmal gleich viel'}),reflected,count));
    const empty=h('span',{class:'mirror-empty',text:'⭐ ?','aria-hidden':'true'});reflected.append(empty);
    const answerRow=h('div',{class:'learn-answers'}),numberTask=h('section',{class:'mirror-number-task',hidden:true},
      h('p',{class:'learn-equation',text:q.n+' + '+q.n+' = ?'}),answerRow);
    FK.shuffle(q.choices).forEach(value=>{
      const b=button(String(value),()=>{const ok=value===q.answer;b.classList.add(ok?'correct':'try-again');check(ok);},'learn-answer');
      b.dataset.answer=String(value);b.setAttribute('aria-label',String(value));answerRow.append(b);
    });
    function update(){
      count.textContent=copies.length+' Sterne';empty.hidden=copies.length>0;
      remove.disabled=copies.length===0||matched;add.disabled=copies.length>=q.n+3||matched;
      copyCheck.disabled=matched;
    }
    function take(b){if(matched)return;const i=copies.indexOf(b);if(i>=0){copies.splice(i,1);b.remove();FK.sound.tick();update();}}
    const add=button('🪄 +1 Stern',()=>{
      if(matched||copies.length>=q.n+3)return;
      const b=button('',()=>take(b),'mirror-star');b.setAttribute('aria-label','Stern aus deiner Gruppe entfernen');b.append(FK.visual.art('star'));copies.push(b);reflected.append(b);FK.sound.tick();update();
    },'mirror-add');
    const remove=button('↶ Ein Stern zurück',()=>take(copies[copies.length-1]),'mirror-remove');
    const copyCheck=button('🪞 Gleich viele?',()=>{
      if(copies.length!==q.n){check(false,copies.length<q.n?'Der Spiegel braucht noch Sterne. Für jeden Stern links soll rechts einer leuchten.':'Huch, rechts funkeln mehr Sterne! Nimm Sterne weg, bis beide Gruppen gleich gross sind.');return;}
      matched=true;mirror.classList.add('mirror-matched');numberTask.hidden=false;copies.forEach(b=>b.disabled=true);FK.sound.right();
      say('Hui, der Zauber wirkt! Zwei gleiche Gruppen. Wie viele Sterne sind es jetzt zusammen?');update();
    },'mirror-check');
    host.append(FK.play.steps([['⭐','Sterne ansehen'],['🪄','Gleich viele zaubern'],['🔢','Beide Gruppen zählen']]),mirror,
      h('div',{class:'mirror-tools'},add,remove,copyCheck),numberTask);
    update();
  }
  function shapeBoard(host) {
    const placed=new Set(),pieces=new Map(),targets=new Map(),rotations={...q.rotations},gestures=dragBoard(host);let selected=null;
    cleanup=gestures.dispose;
    const scene=h('div',{class:'shape-build-scene',role:'group','aria-label':'Waldhäuschen aus Formen'},
      h('div',{class:'shape-house-backdrop','aria-hidden':'true',html:'<svg viewBox="0 0 400 340"><path d="M18 325Q95 291 202 313T386 319" fill="none" stroke="#a7bc84" stroke-width="24" stroke-linecap="round"/><rect x="78" y="102" width="244" height="218" rx="10" fill="#e9c995" stroke="#8f7756" stroke-width="5"/><path d="M48 119 200 9 352 119Z" fill="#dac1a1" stroke="#8f7756" stroke-width="5" stroke-linejoin="round"/><path d="M78 153H322M78 211H322M78 271H322" stroke="#b99569" stroke-width="3" opacity=".5"/></svg>'}));
    const palette=h('div',{class:'shape-build-palette','aria-label':'Formen zum Einsetzen'});
    const meter=h('p',{class:'adventure-meter',role:'status',text:'0 / '+q.targets.length});
    const name=id=>FK.adventures.shapes.find(s=>s.id===id).name;
    function update(){
      pieces.forEach((b,id)=>{b.innerHTML=shape(id,rotations[id]);b.classList.toggle('selected',selected===id);b.setAttribute('aria-pressed',String(selected===id));});
      rotate.disabled=!selected;meter.textContent=placed.size+' / '+q.targets.length+' Teile eingesetzt';
    }
    function choose(id){selected=selected===id?null:id;update();}
    function put(key,id){
      if(locked||!id||placed.has(key))return;
      const target=q.targets.find(t=>t.key===key);if(!target)return;
      if(id!==target.shape){check(false,'Diese Umrisse passen noch nicht zusammen. Vergleiche die Ecken und die langen und kurzen Seiten.');return;}
      const period={circle:1,triangle:360,square:90,rectangle:180}[id];
      if((rotations[id]-target.rotation)%period!==0){check(false,'Die Form stimmt! Drehe sie mit dem runden Pfeil, bis sie genauso liegt wie die Lücke.');return;}
      placed.add(key);const slot=targets.get(key);slot.innerHTML=shape(id,target.rotation);slot.classList.add('shape-placed');slot.disabled=true;selected=null;update();FK.sound.tick();
      if(placed.size===q.targets.length){scene.classList.add('shape-house-complete');success();}
      else say('Das '+name(id)+' passt! Baue weiter.');
    }
    q.parts.forEach(part=>{
      const missing=q.targets.some(t=>t.key===part.key);
      const props={class:'shape-build-hole'+(missing?'':' shape-placed'),style:{left:part.x+'%',top:part.y+'%',width:part.w+'%',height:part.h+'%'},html:shape(part.shape,part.rotation,missing)};
      let slot;
      if(missing){
        slot=button('',()=>{if(selected)put(part.key,selected);else say('Wähle zuerst unten eine Form oder ziehe sie direkt hierher.');},'shape-build-hole');
        Object.assign(slot.style,{left:props.style.left,top:props.style.top,width:props.style.width,height:props.style.height});slot.innerHTML=props.html;
        slot.dataset.drop=part.key;slot.dataset.target=part.key;slot.setAttribute('aria-label',name(part.shape)+' einsetzen');targets.set(part.key,slot);
      }else slot=h('div',props);
      scene.append(slot);
    });
    q.choices.forEach(id=>{
      const b=h('button',{type:'button',class:'learn-button shape-piece',dataset:{shape:id},'aria-label':name(id)+' wählen','aria-pressed':'false'});
      gestures.wire(b,()=>choose(id),target=>{selected=id;put(target,id);});pieces.set(id,b);palette.append(b);
    });
    const rotate=button('⟳ Drehen',()=>{if(selected){rotations[selected]=(rotations[selected]+90)%360;update();FK.sound.tick();}},'shape-rotate');
    rotate.hidden=stage!==3;
    host.append(FK.play.steps(stage===3?[['🔷','Form wählen'],['🔄','Bei Bedarf drehen'],['🖐️','Lücke antippen']]:[['🔷','Form wählen'],['🖐️','In die gleiche Lücke legen']]),scene,meter,palette,rotate);
    update();
  }
  function orderBoard(host) {
    let values=FK.shuffle(q.ordered), selected=null, drag=null, ghost=null, skipClick=false;
    if(values.every((v,i)=>v===q.ordered[i])) values=values.slice(1).concat(values[0]);
    const line=h('ol',{class:'play-order-line','aria-label':'Bilder von links nach rechts ordnen'}), slots=new Map();
    const instruction=h('p',{class:'play-instruction',role:'status',text:'Bilder ziehen. Oder zwei Bilder antippen zum Tauschen.'});
    function clearDrag(){ghost?.remove();ghost=null;drag=null;}
    cleanup=clearDrag;
    // Move the existing cards. Keeping the actual touch target connected lets
    // native touchend/click finish normally, including the next tap on Prüfen.
    function update(){
      values.forEach((value,i)=>{
        const slot=slots.get(value),b=slot.querySelector('button');
        slot.dataset.slot=String(i);slot.classList.toggle('selected',selected===i);
        slot.firstChild.textContent=String(i+1);
        b.setAttribute('aria-pressed',String(selected===i));
        b.setAttribute('aria-label','Bild '+(i+1)+': '+value.replace(/^\S+\s*/,'')+'. Zum Tauschen antippen oder ziehen.');
        if(line.children[i]!==slot)line.insertBefore(slot,line.children[i]||null);
      });
    }
    function swap(a,b){if(a===b)return;[values[a],values[b]]=[values[b],values[a]];selected=null;FK.sound.tick();update();}
    line.addEventListener('click',event=>{if(skipClick&&event.detail!==0){skipClick=false;event.stopPropagation();}},true);
    values.forEach(value=>{
      const label=value.replace(/^\S+\s*/,''),slot=h('li',{class:'play-order-slot'});
      let touchHandled=false;
      function selectCard(){
        if(locked)return;
        const index=values.indexOf(value);
        if(selected===null){selected=index;update();FK.play.speak(label+'. Wähle den Platz zum Tauschen.');}
        else if(selected===index){selected=null;update();}else swap(selected,index);
      }
      const b=h('button',{type:'button',class:'learn-button play-order-card',onclick:event=>{
        if(touchHandled&&event.detail!==0){touchHandled=false;return;}
        selectCard();
      }});
      b.dataset.value=value;b.append(FK.play.sequencePicture(value),h('small',{text:label}));
      b.addEventListener('keydown',e=>{if(locked)return;const index=values.indexOf(value),to=e.key==='ArrowLeft'?index-1:e.key==='ArrowRight'?index+1:-1;if(to>=0&&to<values.length){e.preventDefault();swap(index,to);b.focus();}});
      b.addEventListener('pointerdown',e=>{if(locked||!e.isPrimary)return;skipClick=false;touchHandled=false;drag={id:e.pointerId,from:values.indexOf(value),x:e.clientX,y:e.clientY,moved:false};b.setPointerCapture(e.pointerId);});
      b.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;if(!drag.moved&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>8){drag.moved=true;ghost=b.cloneNode(true);ghost.classList.add('play-drag-ghost');ghost.setAttribute('aria-hidden','true');document.body.append(ghost);b.classList.add('dragging');}if(ghost){ghost.style.left=e.clientX+'px';ghost.style.top=e.clientY+'px';}});
      b.addEventListener('pointerup',e=>{
        if(!drag||e.pointerId!==drag.id)return;
        const from=drag.from,moved=drag.moved,target=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-slot]');
        clearDrag();b.classList.remove('dragging');
        if(moved){e.fkPlayHandled=true;skipClick=true;if(target&&line.contains(target))swap(from,Number(target.dataset.slot));}
        else if(e.pointerType==='touch'){e.fkPlayHandled=true;touchHandled=true;skipClick=true;selectCard();}
      });
      b.addEventListener('pointercancel',()=>{clearDrag();b.classList.remove('dragging');});
      slot.append(h('b'),b);slots.set(value,slot);
    });
    const verify=button('✓ Prüfen',()=>check(values.every((v,i)=>v===q.ordered[i])),'learn-next');
    host.append(FK.play.steps([['🖐️','Bild ziehen'],['🗺️','An den Platz legen'],['✓','Prüfen']]),line,instruction,
      button('↶ Neu mischen',()=>{values=FK.shuffle(q.ordered);selected=null;update();}),verify);
    update();
  }
  function draw() {
    cleanup();cleanup=()=>{};
    q=FK.adventures.question(game.id,stage,round);locked=false;
    const host=h('div',{class:'adventure-work adventure-'+q.kind});
    feedback=h('p',{class:'learn-feedback',role:'status','aria-live':'polite',text:'Probiere aus. Du hast Zeit.'});
    const advance=()=>{if(!locked)return;round++;if(round===5)finish();else draw();};
    next=touchAction(h('button',{type:'button',class:'learn-button learn-next adventure-next',hidden:true,text:round===4?'⭐ Geschafft!':'Weiter →',onclick:advance}),advance);
    body.replaceChildren(FK.play.context(game.id,q.prompt,round,stage),FK.woodland.progress(round),h('h2',{class:'learn-prompt',text:q.prompt}),host,feedback,next,
      h('button',{type:'button',class:'learn-button learn-hint',text:'💡 Tipp',onclick:()=>{FK.play.hint?.();say(q.hint);}}));
    work(host);body.scrollTop=0;FK.play.speak(q.prompt);
  }
  function finish(){cleanup();FK.play.finish(body,'adventure',game.id,stage,()=>{round=0;draw();});}
  FK.screen('adventure',{
    build(root){FK.play.bindTouch(root);const bar=FK.ui.topbar({title:'Waldspiel'});title=bar.querySelector('.title');body=h('div',{class:'learn-body scroll'});root.append(bar,body);},
    enter(p){game=FK.adventures.games.find(g=>g.id===p.game)||FK.adventures.games[0];stage=FK.journey.stageOf(p.stage||FK.learning.stage());round=0;FK.play.begin?.(game.id,stage);title.textContent=game.title;draw();},
    leave(){locked=true;cleanup();FK.forestVoice.cancel();},
  });
})();
