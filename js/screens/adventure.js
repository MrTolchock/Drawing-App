/* Pictured, spoken and directly editable woodland games. */
(function () {
  'use strict';
  const FK = window.FK, h = FK.h;
  let body, title, game, stage, round, q, locked, feedback, next, cleanup = () => {};
  const button = (text, fn, cls = '') => h('button', {type:'button',class:'learn-button '+cls,text,onclick:() => {if(!locked) fn();}});
  function say(text) { feedback.textContent=text; FK.play.speak(text); }
  function success() {
    if(locked) return; locked=true;
    body.querySelectorAll('.adventure-work button').forEach(b=>b.disabled=true);
    say('Juhui! '+q.explain); FK.play.feedback(body,q.explain,true); next.hidden=false;
    if(q.kind==='rocket') body.querySelector('.play-rocket').classList.add('launching');
  }
  function check(ok) { if(locked) return; if(ok) success(); else {FK.sound.undo();say(q.hint);} }
  function stars(n) { return h('span',{class:'adventure-quantity','aria-label':n+' Sterne'},Array.from({length:n},()=>FK.visual.art('star'))); }
  function shape(id, rotated, target = false) {
    const paths = {circle:'<circle cx="60" cy="60" r="36"/>',triangle:'<path d="M60 16 104 98H16Z"/>',square:'<rect x="27" y="27" width="66" height="66"/>',rectangle:'<rect x="14" y="38" width="92" height="44"/>'};
    const vertices = {circle:[],triangle:[[60,16],[104,98],[16,98]],square:[[27,27],[93,27],[93,93],[27,93]],rectangle:[[14,38],[106,38],[106,82],[14,82]]};
    return '<svg viewBox="0 0 120 120" aria-hidden="true"><g fill="'+(target?'#e0d8be':'#b7d4df')+'" stroke="#756247" stroke-width="4"'+(rotated?' transform="rotate(25 60 60)"':'')+'>'+paths[id]+(target&&stage===2?vertices[id].map(([x,y])=>'<circle cx="'+x+'" cy="'+y+'" r="6" fill="#a86645" stroke="none"/>').join(''):'')+'</g></svg>';
  }
  function wordPicture(word) {
    const known = FK.adventures.rhymePictures[word];
    if(known) return FK.play.picture(known,word);
    return FK.play.wordDrawing(word);
  }
  function work(host) {
    if(q.mode==='fill') {
      const selected=new Set(), rocket=h('div',{class:'play-rocket'}), meter=h('p',{class:'adventure-meter',role:'status'});
      const field=h('div',{class:'learn-frame adventure-seats'});
      function update() { meter.textContent=(q.filled+selected.size)+' / '+q.total+' Sterne'; }
      for(let i=0;i<q.total;i++) {
        const cell=h('div',{class:'learn-cell'});
        if(i<q.filled) cell.append(h('span',{class:'adventure-fixed','aria-label':'Stern schon an Bord',text:'⭐'}));
        else {
          const b=button('＋',()=>{if(selected.has(i)) selected.delete(i);else selected.add(i);b.textContent=selected.has(i)?'⭐':'＋';FK.visual.decorate(b);b.setAttribute('aria-pressed',String(selected.has(i)));update();FK.sound.tick();},'learn-bug');
          b.setAttribute('aria-label','Sternplatz '+(i+1));b.setAttribute('aria-pressed','false');cell.append(b);
        }
        field.append(cell);
      }
      rocket.append(h('div',{class:'adventure-scene',text:'🚀'}),field,meter);
      host.append(FK.play.steps([['⭐','Leere Plätze füllen'],['🚀','Rakete starten']]),rocket,button('🚀 Starten',()=>check(selected.size===q.answer),'learn-next'));update();
    } else if(q.mode==='share') {
      const placed=[], counts=[0,0], plates=[], basket=h('div',{class:'play-berry-basket','aria-label':'Beeren im Korb'});
      function update() {
        basket.replaceChildren(FK.forestArt.icon('basket'),...Array.from({length:q.total-placed.length},()=>FK.play.picture('🫐')));
        if(placed.length===q.total) basket.append(FK.forestArt.icon('check'));
        plates.forEach((p,i)=>{p.lastChild.replaceChildren(...Array.from({length:counts[i]},()=>FK.play.picture('🫐')));p.setAttribute('aria-label',(i?'Igel':'Fuchs')+': '+counts[i]+' Beeren. Eine Beere geben');});
      }
      const row=h('div',{class:'adventure-plates'});
      ['fox','hedgehog'].forEach((friend,i)=>{
        const b=button('',()=>{if(placed.length>=q.total) return;placed.push(i);counts[i]++;update();FK.sound.tick();},'adventure-plate');
        b.append(FK.forestArt.character(friend),h('span',{class:'adventure-berries'}));plates.push(b);row.append(b);
      });
      host.append(FK.play.steps([['🫐','Eine Beere nehmen'],['🦊 🦔','Teller antippen'],['⚖️','Beide gleich voll']]),basket,row,
        button('↶ Eine zurück',()=>{if(placed.length){counts[placed.pop()]--;update();}}),button('✓ Prüfen',()=>check(placed.length===q.total&&counts.every(n=>n===q.answer)),'learn-next'));
      update();
    } else if(q.mode==='clap') {
      let count=0;const meter=h('p',{class:'adventure-meter',role:'status',text:'0 Schläge'});
      host.append(FK.play.picture(q.emoji,q.word),FK.play.listen(()=>q.word,'Wort hören'),h('p',{class:'adventure-word',text:FK.text.word(q.word)}),
        button('🥁',()=>{if(count<8){count++;meter.textContent=count+' '+(count===1?'Schlag':'Schläge');FK.sound.tick();}},'adventure-drum'),meter,
        button('↶',()=>{count=Math.max(0,count-1);meter.textContent=count+' Schläge';}),button('✓ Prüfen',()=>check(count===q.answer),'learn-next'));
    } else if(q.mode==='route') {
      host.append(FK.ui.routeBoard({question:q,onSuccess:success,onBlocked:()=>say('Dort ist der Rand oder eine Hecke. Probiere einen anderen Pfeil.')}));
    } else if(q.mode==='order') {
      orderBoard(host);
    } else {
      if(q.kind==='double') host.append(FK.play.steps([['⭐','Links zählen'],['🪞','Spiegeln'],['🔢','Zusammen zählen']]),h('div',{class:'play-mirror-scene'},stars(q.n),h('span',{class:'play-mirror-axis','aria-label':'Spiegellinie'}),Object.assign(stars(q.n),{className:'adventure-quantity reflected'})),h('p',{class:'learn-equation',text:q.n+' + '+q.n+' = ?'}));
      if(q.kind==='shapes') host.append(h('div',{class:'play-shape-target',role:'img','aria-label':'Gesuchte Form: '+FK.adventures.shapes.find(s=>s.id===q.answer).name,html:shape(q.answer,false,true)}),h('p',{class:'play-instruction',text:stage===3?'Welche gedrehte Form passt?':'Finde die gleiche Form.'}));
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
        if(moved){skipClick=true;if(target&&line.contains(target))swap(from,Number(target.dataset.slot));}
        else if(e.pointerType==='touch'){touchHandled=true;skipClick=true;selectCard();}
      });
      b.addEventListener('pointercancel',()=>{clearDrag();b.classList.remove('dragging');});
      slot.append(h('b'),b);slots.set(value,slot);
    });
    const verify=button('✓ Prüfen',()=>check(values.every((v,i)=>v===q.ordered[i])),'learn-next');
    verify.addEventListener('pointerup',e=>{if(e.pointerType==='touch')check(values.every((v,i)=>v===q.ordered[i]));});
    host.append(FK.play.steps([['🖐️','Bild ziehen'],['🗺️','An den Platz legen'],['✓','Prüfen']]),line,instruction,
      button('↶ Neu mischen',()=>{values=FK.shuffle(q.ordered);selected=null;update();}),verify);
    update();
  }
  function draw() {
    cleanup();cleanup=()=>{};
    q=FK.adventures.question(game.id,stage,round);locked=false;
    if(q.kind==='picnic')q.prompt='Teile die Beeren gerecht zwischen Fuchs und Igel.';
    const host=h('div',{class:'adventure-work adventure-'+q.kind});
    feedback=h('p',{class:'learn-feedback',role:'status','aria-live':'polite',text:'Probiere aus. Du hast Zeit.'});
    next=h('button',{type:'button',class:'learn-button learn-next adventure-next',hidden:true,text:round===4?'⭐ Geschafft!':'Weiter →',onclick:()=>{if(!locked)return;round++;if(round===5)finish();else draw();}});
    body.replaceChildren(FK.play.context(game.id,q.prompt,round),FK.woodland.progress(round),h('h2',{class:'learn-prompt',text:q.prompt}),host,feedback,next,
      h('button',{type:'button',class:'learn-button learn-hint',text:'💡 Tipp',onclick:()=>say(q.hint)}));
    work(host);body.scrollTop=0;FK.play.speak(q.prompt);
  }
  function finish(){cleanup();FK.play.finish(body,'adventure',game.id,stage,()=>{round=0;draw();});}
  FK.screen('adventure',{
    build(root){const bar=FK.ui.topbar({title:'Waldspiel'});title=bar.querySelector('.title');body=h('div',{class:'learn-body scroll'});root.append(bar,body);},
    enter(p){game=FK.adventures.games.find(g=>g.id===p.game)||FK.adventures.games[0];stage=FK.learning.stage();round=0;title.textContent=game.title;draw();},
    leave(){locked=true;cleanup();FK.forestVoice.cancel();},
  });
})();
