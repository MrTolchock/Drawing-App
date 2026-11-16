/* The active woodland catalogue uses one picture / task / answer flow.
   Historical Heart Tree screens remain available with their original save records. */
(function () {
  'use strict';
  const FK=window.FK,h=FK.h,R=FK.puzzleRounds;
  let root,bar,body,title,session,game,host,origin,question,locked=false,timer=0,alive=false,status,scene,answerArea;
  const aliases={house:'vocab-house',table:'vocab-table',shoe:'vocab-shoe',leg:'vocab-leg',stone:'vocab-stone',cloth:'vocab-cloth',tower:'vocab-tower',worm:'vocab-worm',pot:'vocab-pot',head:'vocab-head',hand:'vocab-hand',sand:'vocab-sand',scarf:'vocab-scarf',rope:'vocab-rope',arrow:'vocab-arrow',cup:'vocab-cup',till:'vocab-till',bench:'vocab-bench',wardrobe:'vocab-wardrobe',seeds:'vocab-seed',hare:'hare-sit',mouse:'mouse-sit',bird:'bird-sit',fish:'fish-swim',tin:'tin',nut:'forest-nut',feathers:'forest-feather'};
  const labels={...Object.fromEntries(Object.entries(R.wordArt).map(([word,pic])=>[pic,word])),...Object.fromEntries(R.words.map(([word,pic])=>[pic,word.replaceAll('-','')])),
    'mouse-sit':'Maus sitzt','mouse-run':'Maus rennt','mouse-sleep':'Maus schläft','bird-fly':'Vogel fliegt','bird-sit':'Vogel sitzt','fish-swim':'Fisch schwimmt','hare-run':'Hase rennt','hare-sit':'Hase sitzt','fox-sleep':'Fuchs schläft','fox-run':'Fuchs rennt','cat-sleep':'Katze schläft','cat-sit':'Katze sitzt','dog-run':'Hund rennt','dog-sleep':'Hund schläft','duck-swim':'Ente schwimmt','duck-fly':'Ente fliegt','forest-stone':'Stein','forest-apple':'Apfel','forest-feather':'Feder','forest-flower':'Blume','forest-nut':'Nuss','forest-leaf':'Blatt','forest-berry':'Beere'};
  Object.assign(labels,{'squirrel-sit':'Eichhörnchen sitzt','squirrel-run':'Eichhörnchen rennt','hedgehog-walk':'Igel läuft','hedgehog-sleep':'Igel schläft','badger-walk':'Dachs läuft','badger-sleep':'Dachs schläft','roe-stand':'Reh steht','roe-run':'Reh rennt','frog-sit':'Frosch sitzt','frog-jump':'Frosch springt','forest-fox':'Fuchs','forest-woodpecker':'Buntspecht','forest-bat':'Fledermaus','forest-owl':'Waldkauz','forest-robin':'Rotkehlchen','forest-lynx':'Luchs','forest-marten':'Baummarder'});
  const pictureName=id=>id.startsWith('scene:')?id.slice(6).split('+').map(pictureName).join(' und '):id.startsWith('puzzle-flower-')?id.slice(13)+'e Blume':labels[id]||labels[aliases[id]]||id;
  function picture(id,label='') {
    if(id?.startsWith('scene:'))return h('span',{class:'puzzle-picture puzzle-picture-composite',role:'img','aria-label':label||'Bild mit zwei Motiven'},id.slice(6).split('+').map(pic=>picture(pic)));
    if(id==='empty-basket')return h('span',{class:'puzzle-picture',role:'img','aria-label':'Leerer Korb',html:'<svg viewBox="0 0 180 130"><path d="M25 43Q90 0 155 43L139 112Q90 133 41 112Z" fill="#dfbf87" stroke="#987449" stroke-width="3"/><ellipse cx="90" cy="43" rx="65" ry="21" fill="#f4e7cb" stroke="#987449" stroke-width="3"/><path d="M41 72Q90 91 147 72M44 91Q90 111 142 91M60 64 67 119M89 65V124M120 63 113 120" fill="none" stroke="#b0905c" stroke-width="2"/></svg>'});
    const value=aliases[id]||id;
    if(!FK.visual.has(value)&&FK.visual.supports(value))return h('span',{class:'puzzle-picture',text:value,role:label?'img':null,'aria-label':label||null});
    return h('span',{class:'puzzle-picture'},FK.visual.art(value,'',label));
  }
  function button(label,fn,cls='',children=null) {return h('button',{type:'button',class:'puzzle-button '+cls,'aria-label':label,onclick:event=>{FK.sound.tick();FK.playLog?.button(label,event.currentTarget);fn();}},children===null?label:children);}
  function shape(id,rotation=0,outline=false,fitted=false) {
    const paths={circle:'<circle cx="50" cy="50" r="34"/>',square:'<rect x="16" y="16" width="68" height="68" rx="2"/>',rectangle:'<rect x="26" y="9" width="48" height="82" rx="2"/>',triangle:'<path d="M50 10 90 85H10Z"/>'};
    const pieces={circle:'<circle cx="50" cy="50" r="48"/>',square:'<rect x="2" y="2" width="96" height="96" rx="2"/>',rectangle:'<rect x="2" y="2" width="96" height="96" rx="2"/>',triangle:'<path d="M50 2 98 98H2Z"/>'};
    return h('span',{class:'puzzle-shape',role:'img','aria-label':R.shapeNames[id]+(rotation?' gedreht':''),html:'<svg viewBox="0 0 100 100"'+(fitted?' preserveAspectRatio="none"':'')+'><g transform="rotate('+rotation+' 50 50)" fill="'+(outline?'none':'#d8b987')+'" stroke="#8d6b45" stroke-width="3" '+(outline?'stroke-dasharray="5 4"':'')+'>'+(fitted?pieces[id]:paths[id])+'</g></svg>'});
  }
  function progress(round,total=5) {const leaves=total?Math.floor(5*round/total):5;return h('div',{class:'puzzle-progress','aria-label':round+' von '+total+' Aufgaben geschafft'},Array.from({length:5},(_,i)=>h('span',{class:i<leaves?'done':i===leaves?'current':'','aria-hidden':'true'},FK.visual.art('forest-leaf'))));}
  function context(owner,round,instruction,{explain=true,total=5}={}) {return h('div',{class:'puzzle-context'},FK.friendsLibrary.portrait(owner),h('span',{text:window.FriendsContent.hosts[owner].name+' spielt mit dir'}),h('b',{class:'puzzle-round',text:(round+1)+' / '+total}),explain?button('Spiel erklären',()=>FK.forestVoice.explain(instruction),'puzzle-listen',FK.icons.element('speaker')):null);}
  function later(fn,delay=900) {
    clearTimeout(timer);
    timer=setTimeout(()=>{if(!alive)return;if(document.hidden||document.querySelector('.modal')){later(fn,250);return;}fn();},delay);
  }
  function announcement(text) {status.textContent=text;}
  function persist() {if(!session.review&&!session.gallery)R.save(session);}
  function work() {return session.work;}
  function fail(node,text='Schau noch einmal. Du kannst es ändern.',selected) {
    if(locked)return;
    node?.classList.add('is-retry');announcement(text);FK.sound.undo();
    if(!session.review)FK.playLog?.answer(selected===undefined?{control:node?.getAttribute('aria-label'),answer:node?.dataset.answer,shape:node?.dataset.shape,rotation:node?.dataset.rotation,cell:node?.dataset.cell,part:node?.dataset.part,work:session.work}:selected,false,text);
  }
  function solved(node,value=question.answer) {
    if(locked)return;
    if(session.review&&!FK.puzzleReview.sessionDecision(session,'approved')){FK.puzzleReview.saveFailure(()=>solved(node,value));return;}
    locked=true;session.solved=true;persist();
    root.querySelector('.review-reject')?.setAttribute('disabled','');
    body.querySelectorAll('.is-retry').forEach(el=>el.classList.remove('is-retry'));
    (node||scene).classList.add('is-correct');
    body.querySelectorAll('button:not(.puzzle-listen)').forEach(b=>b.disabled=true);
    FK.sound.right();announcement('Das passt!');
    FK.waldbuch?.celebrate(node||scene);
    if(!session.review)FK.playLog?.answer(value===undefined?{work:session.work}:value,true);
    later(advance);
  }
  function choose(value,node) {
    if(locked)return;
    if(value===question.answer)solved(node,value);else fail(node,undefined,value);
  }
  function option(value,visual,label) {
    let node;node=button(label??String(value),()=>choose(value,node),'puzzle-answer',visual??String(value));
    node.dataset.answer=String(value);answerArea.append(node);return node;
  }
  function numeric(q=question) {q.choices.forEach(n=>option(n,null,String(n)));}
  function objects(id,n,cls='') {return h('div',{class:'puzzle-objects '+cls,'aria-label':n+' Objekte'},Array.from({length:n},()=>picture(id)));}
  const countNames={fish:'Fische','forest-feather':'Federn','forest-leaf':'Blätter','forest-stone':'Steine','forest-flower':'Blumen','forest-berry':'Beeren','forest-mushroom':'Pilze'};
  function renderCount(q) {
    const field=h('div',{class:q.kind==='nuts'?'puzzle-nuts':'puzzle-meadow',style:q.columns?{gridTemplateColumns:'repeat('+q.columns+', minmax(0,1fr))'}:{}}),marks=new Set(Array.isArray(work().marks)?work().marks:[]);
    const items=q.kind==='nuts'?Array(q.count).fill(q.item||'forest-nut'):q.bugs;
    items.forEach((id,i)=>{
      let node;node=button(id==='ladybird'?'Marienkäfer markieren':id==='forest-nut'?'Nuss markieren':q.kind==='nuts'?'Bild markieren':id==='bee'?'Biene':'Schnecke',()=>{
        if(locked)return;if(id!=='ladybird'&&q.kind!=='nuts'){fail(node,'Zähle nur die roten Marienkäfer.');return;}
        if(marks.has(i))marks.delete(i);else marks.add(i);
        node.classList.toggle('marked',marks.has(i));node.setAttribute('aria-pressed',String(marks.has(i)));work().marks=[...marks];persist();
      },'puzzle-counter'+(marks.has(i)?' marked':''),picture(id));node.setAttribute('aria-pressed',String(marks.has(i)));field.append(node);
    });
    if(!items.length){field.classList.add('puzzle-empty');field.append(h('span',{class:'puzzle-empty-basket','aria-hidden':'true',html:'<svg viewBox="0 0 180 130"><path d="M25 43Q90 0 155 43L139 112Q90 133 41 112Z" fill="#dfbf87" stroke="#987449" stroke-width="3"/><ellipse cx="90" cy="43" rx="65" ry="21" fill="#f4e7cb" stroke="#987449" stroke-width="3"/><path d="M41 72Q90 91 147 72M44 91Q90 111 142 91M60 64 67 119M89 65V124M120 63 113 120" fill="none" stroke="#b0905c" stroke-width="2"/></svg>'}));}
    scene.append(field);numeric();
  }
  function renderReading(q) {
    scene.classList.add('puzzle-reading');scene.append(h('p',{class:'puzzle-read-text',text:FK.text.word(q.text)}));
    if(q.kind==='rhyme')scene.append(picture(q.picture));
    q.choices.forEach(value=>{
      const visual=picture(q.kind==='rhyme'?R.wordArt[value]:value,q.kind==='rhyme'?'':null);
      option(value,q.kind==='rhyme'?h('span',{class:'puzzle-word-answer'},visual,h('b',{text:FK.text.word(value)})):visual,q.kind==='rhyme'?value:'Bild: '+pictureName(value));
    });
  }
  function renderAdd(q) {
    scene.append(h('div',{class:'puzzle-addition'},
      h('section',{},objects('forest-apple',q.a),h('b',{text:q.a})),
      h('b',{class:'puzzle-sign',text:'+'}),
      h('section',{},objects('forest-apple',q.b),h('b',{text:q.b}))),
      h('div',{class:'puzzle-equation',text:q.a+' + '+q.b+' = ?'}));numeric();
  }
  function renderPattern(q) {
    const line=h('div',{class:'puzzle-pattern'});
    q.sequence.forEach((id,i)=>line.append(h('span',{class:'puzzle-pattern-cell'+(i===q.gap?' gap':'')},i===q.gap?'?':picture(id))));
    scene.append(line);q.choices.forEach(v=>option(v,picture(v),'Dieses Bild einsetzen: '+pictureName(v)));
  }
  function renderFireflies(q) {
    scene.append(h('div',{class:'puzzle-goal'},h('span',{text:'Hier sollen '+q.total+' leuchten'})));
    const slots=h('div',{class:'puzzle-firefly-slots'});for(let i=0;i<q.total;i++)slots.append(h('span',{class:'puzzle-firefly-slot'+(i<q.filled?' filled':' is-empty'),'aria-label':i<q.filled?'Ein Glühwürmchen':'Ein freier Platz'},i<q.filled?FK.puzzles.firefly():'?'));
    scene.append(slots);numeric();
  }
  // Pointer dragging works with touch, pen and mouse. Ordinary taps/keyboard activation keep their button behavior.
  function draggable(node,selector,drop) {
    let press,ghost,target,frame;
    const clean=()=>{cancelAnimationFrame(frame);ghost?.remove();ghost=null;target?.classList.remove('is-drop-target');target=null;node.classList.remove('is-dragging');press=null;};
    const follow=()=>{
      if(!press?.moved)return;if(!node.isConnected||locked||!alive){clean();return;}
      const bounds=body.getBoundingClientRect();
      if(press.py<bounds.top+40)body.scrollTop-=12;else if(press.py>bounds.bottom-40)body.scrollTop+=12;
      const next=document.elementFromPoint(press.px,press.py)?.closest(selector);
      target?.classList.remove('is-drop-target');target=next&&scene.contains(next)?next:null;target?.classList.add('is-drop-target');frame=requestAnimationFrame(follow);
    };
    node.classList.add('puzzle-draggable');
    node.addEventListener('pointerdown',event=>{
      if(locked||!event.isPrimary||event.button!==0)return;
      clean();press={id:event.pointerId,x:event.clientX,y:event.clientY,moved:false};node.setPointerCapture(event.pointerId);
    });
    node.addEventListener('pointermove',event=>{
      if(!press||event.pointerId!==press.id)return;
      if(!press.moved&&Math.hypot(event.clientX-press.x,event.clientY-press.y)<8)return;
      event.preventDefault();const starting=!press.moved;press.moved=true;press.px=event.clientX;press.py=event.clientY;FK.play.consumeGesture(event);
      if(!ghost){const bounds=node.getBoundingClientRect();ghost=node.cloneNode(true);ghost.removeAttribute('id');ghost.className='puzzle-drag-ghost';ghost.setAttribute('aria-hidden','true');ghost.style.width=bounds.width+'px';ghost.style.height=bounds.height+'px';document.body.append(ghost);node.classList.add('is-dragging');}
      ghost.style.left=event.clientX+'px';ghost.style.top=event.clientY+'px';
      if(starting)follow();
    });
    node.addEventListener('pointerup',event=>{
      if(!press||event.pointerId!==press.id)return;
      const moved=press.moved,hit=document.elementFromPoint(event.clientX,event.clientY)?.closest(selector),destination=hit&&scene.contains(hit)?hit:null;
      if(moved){event.fkPlayHandled=true;FK.play.consumeGesture(event);event.preventDefault();}
      clean();if(moved&&destination&&!locked){FK.sound.tick();FK.playLog?.button('Bild verschieben',node);drop(destination);}
    });
    node.addEventListener('pointercancel',clean);node.addEventListener('lostpointercapture',clean);
    return node;
  }
  function renderPicnic(q) {
    let counts=Array.isArray(work().plates)&&work().plates.length===q.friends?work().plates.slice():(q.plates||Array(q.friends).fill(0)).slice();
    counts=counts.map(n=>Number.isInteger(n)&&n>=0&&n<=q.total?n:0);if(counts.reduce((a,b)=>a+b,0)>q.total)counts.fill(0);
    let selected='bank';
    const basket=h('div',{class:'puzzle-picnic-bank','data-picnic-target':'bank','aria-label':'Beeren zum Verteilen'}),places=h('div',{class:'puzzle-picnic-friends',style:{'--friends':q.friends}});
    const move=(from,to)=>{
      if(locked||from===to)return;
      if(from==='bank'&&counts.reduce((a,b)=>a+b,0)>=q.total||from!=='bank'&&!counts[from])return;
      if(from!=='bank')counts[from]--;if(to!=='bank')counts[to]++;
      FK.playLog?.place?.('berry',{from,to,counts:counts.slice()});
      selected='bank';update();
    };
    const berry=from=>draggable(button(from==='bank'?'Beere auswählen':'Beere von Freund '+(from+1)+' zurücknehmen',()=>{if(from==='bank'){selected='bank';announcement('Wähle einen Freund.');}else move(from,'bank');},'puzzle-picnic-berry',picture('forest-berry')),'[data-picnic-target]',target=>move(from,target.dataset.picnicTarget==='bank'?'bank':Number(target.dataset.picnicTarget)));
    const redraw=()=>{
      basket.replaceChildren(...Array.from({length:q.total-counts.reduce((a,b)=>a+b,0)},()=>berry('bank')));
      places.replaceChildren();
      for(let i=0;i<q.friends;i++){
        const friend=button('Beere zu Freund '+(i+1)+' legen',()=>move(selected,i),'puzzle-picnic-friend',FK.friendsLibrary.portrait(['fox','mouse','bird','squirrel'][i]));
        places.append(h('section',{'data-picnic-target':i,class:'puzzle-picnic-place','aria-label':'Freund '+(i+1)},friend,h('div',{class:'puzzle-picnic-berries'},Array.from({length:counts[i]},()=>berry(i)))));
      }
    };
    const update=()=>{work().plates=counts;persist();redraw();if(counts.every(n=>n===q.each))solved(places);};
    scene.append(basket,places);redraw();
  }
  function renderMatrix(q) {
    const matrix=h('div',{class:'puzzle-matrix',role:'table','aria-label':'Drei Reihen mit je drei Formen'});
    for(let row=0;row<3;row++){
      const line=h('div',{class:'puzzle-matrix-row',role:'row','aria-label':'Reihe '+(row+1)});
      for(let col=0;col<3;col++){
        const i=row*3+col;
        line.append(h('span',{class:i===q.gap?'gap':'',role:'cell','aria-label':i===q.gap?'Fehlende Form':R.shapeNames[q.matrix[i]]},i===q.gap?'?':shape(q.matrix[i])));
      }
      matrix.append(line);
    }
    scene.append(matrix);q.choices.forEach(id=>option(id,shape(id),R.shapeNames[id]));
  }
  function renderSyllable(q) {
    scene.append(picture(q.picture),h('p',{class:'puzzle-read-text',text:FK.text.word(q.word)}));numeric();
  }
  function renderRobot(q) {
    const model={...q,kind:'robot'},saved=FK.routes.restore(model,work().route),initial=FK.routes.initial(model);let route=saved||initial;
    const board=h('div',{class:'puzzle-route',style:{'--size':q.size}}),arrows=h('div',{class:'puzzle-arrows'});
    function move(dx,dy,node){if(locked)return;const next=FK.routes.move(model,route,dx,dy);if(!next){fail(node,'Hier ist kein freier Weg.');return;}route=next;work().route=route;persist();redraw();if(route.answered)solved(board);}
    function redraw(){board.replaceChildren();for(let i=0;i<q.size*q.size;i++){
      const blocked=q.obstacles.includes(i),current=route.position===i,goal=q.goal===i;
      const cell=button(blocked?'Hecke':current?'Hier ist der Brief':goal?'Briefkasten':'Freies Feld',()=>{
        const dx=i%q.size-route.position%q.size,dy=Math.floor(i/q.size)-Math.floor(route.position/q.size);
        if(Math.abs(dx)+Math.abs(dy)!==1){fail(cell,'Tippe ein Nachbarfeld an.');return;}move(dx,dy,cell);
      },'puzzle-route-cell'+(current?' post':'')+(goal?' goal':'')+(blocked?' hedge':''),blocked?picture('forest-fir'):current?picture(goal?'mailbox':'letter'):goal?picture('postbox'):route.history.includes(i)?h('span',{text:'·'}):'');
      cell.dataset.cell=i;cell.disabled=blocked;board.append(cell);
    }}
    for(const [dx,dy,turn,label]of [[0,-1,-90,'Nach oben'],[-1,0,180,'Nach links'],[1,0,0,'Nach rechts'],[0,1,90,'Nach unten']])arrows.append(button(label,()=>move(dx,dy,board),'puzzle-arrow',h('span',{'aria-hidden':'true',style:{transform:'rotate('+turn+'deg)'},html:'<svg viewBox="0 0 48 48"><path d="M8 24h30M25 11l13 13-13 13" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>'})));
    scene.append(board);answerArea.append(arrows);redraw();
  }
  function renderOrder(q) {
    const saved=Array.isArray(work().order)?work().order:[];
    let order=Array.from({length:3},(_,i)=>Number.isInteger(saved[i])&&saved[i]>=0&&saved[i]<3&&saved.indexOf(saved[i])===i?saved[i]:null),selected=null;
    const slots=h('div',{class:'puzzle-story-slots'}),cards=h('div',{class:'puzzle-story-cards'});
    const caption=text=>text.replace(/Schmetterling|Sonnenblume|Erdbeerpflanze|Apfelblüte|Birnenblüte/g,word=>({Schmetterling:'Schmetter\u00adling',Sonnenblume:'Sonnen\u00adblume',Erdbeerpflanze:'Erdbeer\u00adpflanze',Apfelblüte:'Apfel\u00adblüte',Birnenblüte:'Birnen\u00adblüte'}[word]));
    const select=value=>{selected=selected===value?null:value;scene.querySelectorAll('[data-story-value]').forEach(node=>{const active=Number(node.dataset.storyValue)===selected;node.classList.toggle('active',active);node.setAttribute('aria-pressed',String(active));});};
    function place(value,index){
      if(locked)return;const from=order.indexOf(value),displaced=order[index];if(from!==-1)order[from]=displaced;order[index]=value;FK.playLog?.place?.('story',{item:value,from,to:index,order:order.slice()});selected=null;update();
    }
    function update(){
      slots.classList.remove('is-retry');work().order=order;persist();redraw();
      if(order.every(value=>value!==null)){if(order.every((v,i)=>v===i))solved(slots);else fail(slots,'Du kannst die Bilder noch umlegen.');}
    }
    function redraw(){
      slots.replaceChildren(...order.map((value,i)=>{
        const node=button('Platz '+(i+1)+(value===null?'':': '+q.items[value][1]),()=>{if(locked)return;if(selected!==null)place(selected,i);else if(value!==null)select(value);},'puzzle-story-slot');
        node.replaceChildren(h('b',{text:i+1}),value===null?h('span',{text:'?'}):h('span',{},picture(q.items[value][0]),h('small',{text:caption(q.items[value][1])})));node.dataset.storySlot=i;
        if(value!==null){node.dataset.storyValue=value;node.setAttribute('aria-pressed','false');}
        return value===null?node:draggable(node,'[data-story-slot]',target=>place(value,Number(target.dataset.storySlot)));
      }));
      cards.replaceChildren();q.order.filter(value=>!order.includes(value)).forEach(value=>{
        const [pic,text]=q.items[value],node=button(text,()=>{if(!locked)select(value);},'puzzle-story-card',h('span',{},picture(pic),h('small',{text:caption(text)})));
        node.dataset.order=value;node.dataset.storyValue=value;node.setAttribute('aria-pressed','false');cards.append(draggable(node,'[data-story-slot]',target=>place(value,Number(target.dataset.storySlot))));
      });
    }
    scene.append(slots,cards);answerArea.append(button('Reihenfolge zurücksetzen',()=>{if(locked)return;order=[null,null,null];selected=null;update();},'puzzle-reset','↺ Neu ordnen'));redraw();
  }
  function renderTreasure(q) {
    const reveal=!!work().hidden,items=h('div',{class:'puzzle-treasures'},q.objects.map((id,i)=>h('span',{class:reveal&&i===q.missing?'gap':''},reveal&&i===q.missing?'?':picture(id))));
    scene.append(items);
    if(!reveal)answerArea.append(button('Ich habe sie mir gemerkt',()=>{if(locked)return;work().hidden=true;persist();draw();},'puzzle-memory-ready'));
    else {body.querySelector('.puzzle-prompt').textContent='Welcher Waldschatz fehlt?';q.choices.forEach(v=>option(v,picture(v),'Diesen Waldschatz wählen: '+pictureName(v)));answerArea.append(button('Nochmals anschauen',()=>{if(locked)return;work().hidden=false;persist();draw();},'puzzle-look-again'));}
  }
  function renderNeighbours(q) {
    let selected=work().neighbours||(q.given==='left'?[q.n-1,null]:[null,null]),slot=selected[0]===null?0:1;const row=h('div',{class:'puzzle-neighbours'}),nodes=[];
    for(let i=0;i<3;i++){
      if(i===1)row.append(h('div',{class:'puzzle-number-card middle'},h('b',{text:q.n})));
      else {const pos=i===0?0:1,node=button(pos===0?'Zahl davor ändern':'Zahl danach ändern',()=>{if(locked)return;slot=pos;nodes.forEach((b,j)=>b.classList.toggle('active',j===slot));},'puzzle-number-card'+(pos===slot?' active':''),h('b',{text:selected[pos]??'?'}));nodes.push(node);row.append(node);}
    }
    scene.append(row);q.choices.forEach(value=>{let node;node=button(String(value),()=>{
      if(locked)return;selected[slot]=value;work().neighbours=selected;persist();nodes[slot].querySelector('b').textContent=value;
      if(selected.every(v=>v!==null)){
        if(selected.every((v,i)=>v===q.answer[i]))solved(row);else fail(row,'Zähle einen Schritt zurück und einen Schritt weiter.');
      }else {slot=selected[0]===null?0:1;nodes.forEach((b,j)=>b.classList.toggle('active',j===slot));}
    },'puzzle-answer');node.dataset.answer=value;answerArea.append(node);});
  }
  function renderCompare(q) {
    const pair=h('div',{class:'puzzle-compare'});
    for(const [id,n]of [['left',q.a],['right',q.b]]){let node;node=button(id==='left'?'Links sind mehr Beeren':'Rechts sind mehr Beeren',()=>choose(id,node),'puzzle-berry-plate',h('span',{},objects('forest-berry',n)));node.dataset.answer=id;pair.append(node);}
    scene.append(pair);option('equal','Gleich viele','Gleich viele');
  }
  function renderMirror(q) {
    const selected=new Set(Array.isArray(work().mirror)?work().mirror:[]),pair=h('div',{class:'puzzle-mirror'}),left=h('div',{class:'puzzle-mirror-grid'}),right=h('div',{class:'puzzle-mirror-grid'});
    for(let i=0;i<9;i++){
      left.append(h('span',{class:'puzzle-mirror-cell'+(q.left.includes(i)?' filled':'')},q.left.includes(i)?picture('forest-leaf'):''));
      let node;node=button('Spiegelfeld Reihe '+(Math.floor(i/3)+1)+' Spalte '+(i%3+1),()=>{
        if(locked)return;if(selected.has(i))selected.delete(i);else selected.add(i);node.classList.toggle('filled',selected.has(i));node.replaceChildren(selected.has(i)?picture('forest-leaf'):'');node.setAttribute('aria-pressed',String(selected.has(i)));work().mirror=[...selected];persist();
        if(selected.size===q.answer.length&&q.answer.every(v=>selected.has(v)))solved(right);
      },'puzzle-mirror-cell'+(selected.has(i)?' filled':''),selected.has(i)?picture('forest-leaf'):'');node.setAttribute('aria-pressed',String(selected.has(i)));node.dataset.cell=i;right.append(node);
    }
    pair.append(left,h('div',{class:'puzzle-mirror-line','aria-label':'Spiegellinie'}),right);scene.append(pair);
  }
  function renderVowels(q) {
    scene.append(picture(q.picture),h('p',{class:'puzzle-read-text'},Array.from(q.word).map((c,i)=>h('span',{class:i===q.index?'puzzle-letter-gap':'',text:i===q.index?'_':FK.text.word(c)}))));q.choices.forEach(v=>option(v,FK.text.word(v),v));
  }
  function renderSyllables(q) {
    let picked=Array.isArray(work().syllables)?work().syllables:[];
    const slots=h('div',{class:'puzzle-syllable-slots'}),chips=h('div',{class:'puzzle-syllable-chips'});
    const redraw=()=>{slots.replaceChildren(...q.parts.map((part,i)=>h('span',{class:'puzzle-syllable-slot'+(i<picked.length?' filled':'')},i<picked.length?FK.text.syllable(part):'___')));chips.replaceChildren();q.order.forEach(i=>{
      let node;node=button(q.chips[i],()=>{if(locked)return;const expected=q.parts[picked.length];if(q.chips[i]!==expected){fail(node);return;}picked.push(i);work().syllables=picked;persist();redraw();if(picked.length===q.parts.length)solved(slots);},'puzzle-syllable-chip',FK.text.syllable(q.chips[i]));node.disabled=picked.includes(i);node.dataset.part=q.chips[i];chips.append(node);
    });};
    scene.append(picture(q.picture),slots);answerArea.append(chips);redraw();
  }
  function renderColours(q) {scene.append(h('p',{class:'puzzle-read-text',text:FK.text.word(q.text)}));q.choices.forEach(([name])=>option(name,picture('puzzle-flower-'+name),(name==='rosa'?'rosa':name+'e')+' Blume'));}
  function renderLeaves(q) {
    scene.append(h('p',{class:'puzzle-read-text',text:FK.text.syllable(q.text)}));q.choices.forEach(v=>option(v,h('span',{class:'puzzle-syllable-leaf'},picture('forest-leaf'),h('b',{text:FK.text.syllable(v)})),v));
  }
  function draw() {
    clearTimeout(timer);locked=false;
    if(!session.review&&!session.gallery&&!FK.friendsLibrary.canPlay(game)){FK.go('friends');return;}
    if(!session.review&&!FK.puzzleReview.ready(game)){blocked();return;}
    if(session.round===session.questions.length){finish();return;}question=R.current(session);
    root.dataset.game=game;root.dataset.host=host;
    if(!session.review)FK.playLog?.show(question);
    body.replaceChildren(context(host,session.round,R.instructions[game],{explain:!session.review,total:session.questions.length}),progress(session.round,session.questions.length),h('h2',{class:'puzzle-prompt',text:question.prompt}));
    scene=h('div',{class:'puzzle-scene'});answerArea=h('div',{class:'puzzle-answers'});status=h('p',{class:'puzzle-status sr-only',role:'status','aria-live':'polite'});body.append(scene,answerArea,status);
    const renderers={nuts:renderCount,count:renderCount,reading:renderReading,rhyme:renderReading,add:renderAdd,pattern:renderPattern,fireflies:renderFireflies,picnic:renderPicnic,matrix:renderMatrix,syllable:renderSyllable,robot:renderRobot,order:renderOrder,treasure:renderTreasure,neighbours:renderNeighbours,compare:renderCompare,mirror:renderMirror,vowels:renderVowels,syllables:renderSyllables,colours:renderColours,leaves:renderLeaves};
    renderers[question.kind](question);body.scrollTop=0;
    if(session.review)FK.puzzleReview.attachPreview(root,session,advance);
    // Restore a pending correct transition without accepting the same answer twice.
    if(session.solved){locked=true;scene.classList.add('is-correct');body.querySelectorAll('button:not(.puzzle-listen)').forEach(b=>b.disabled=true);later(advance);}
    const heading=body.querySelector('h2');heading.tabIndex=-1;heading.focus({preventScroll:true});
  }
  function advance() {
    session.round++;session.solved=false;session.work={};persist();draw();
  }
  function finish() {
    if(session.review){delete root.dataset.reviewIteration;FK.puzzleUI.completion(body,host,()=>FK.puzzleReview.finishPreview(session),{total:session.questions.length,review:true});return;}
    if(session.gallery){FK.puzzleUI.completion(body,host,()=>FK.go('puzzle-gallery'),{total:session.questions.length});return;}   // a gallery round leaves no trace
    if(origin==='friends'&&FK.friends?.mail().host===host&&FK.friends.mail().phase==='to-friend'&&!FK.friends.completeMail(host)){
      announcement(FK.friends.error||'Bitte nochmals versuchen.');return;
    }
    FK.playLog?.finish();
    R.complete(game);
    FK.progress.finish('puzzle',game+':1',0);
    FK.friendsLibrary.complete(host,game);
    FK.puzzleUI.completion(body,host,()=>{
      FK.playLog?.celebration();
      if(origin==='forest-book')FK.go('forest-book');else FK.friendsPuzzleCompleted(host);
    });
  }
  function blocked(){FK.playLog?.stop('review_required');body.replaceChildren(h('section',{class:'puzzle-review-blocked'},FK.friendsLibrary.portrait(host),h('h2',{text:'Dieses Puzzle wartet auf Freigabe.'}),h('p',{text:'Eine erwachsene Person prüft zuerst alle Aufgaben.'})));}
  function completion(container,owner,done,{total=5,review=false}={}) {
    const card=h('section',{class:'puzzle-completion',role:'status'},
      h('div',{class:'puzzle-completion-wreath'},Array.from({length:8},(_,i)=>h('span',{style:{'--i':i}},FK.visual.art(i%3?'forest-leaf':'forest-flower'))),FK.friendsLibrary.portrait(owner)),
      progress(total,total),h('h2',{text:review?'Juhui, alle geprüft!':'Juhui, fünf geschafft!'}),h('p',{text:'Dein Waldfreund freut sich mit dir.'}));
    container.replaceChildren(card);FK.sound.rainbow();
    let cancelled=false,timeout;
    const finishWhenVisible=()=>{if(cancelled)return;if(document.hidden||document.querySelector('.modal')){timeout=setTimeout(finishWhenVisible,250);return;}done();};
    timeout=setTimeout(finishWhenVisible,2200);
    // Navigation cancels completion, so a stale celebration never pulls a child out of another game.
    const unsubscribe=FK.on('screen',()=>{if(!card.isConnected||container.closest('.screen')?.hidden){cancelled=true;clearTimeout(timeout);unsubscribe();}});
    return ()=>{cancelled=true;clearTimeout(timeout);unsubscribe();};
  }
  let cancelCompletion=()=>{};
  FK.puzzleUI={picture,shape,progress,context,completion:(...args)=>{cancelCompletion();cancelCompletion=completion(...args);return cancelCompletion;}};
  FK.screen('puzzle',{
    build(el){
      root=el;bar=FK.ui.topbar({title:'Waldspiel',stars:false,onBack:()=>FK.go(origin,session?.review?{reviewPuzzle:game}:{},{isBack:true})});title=bar.querySelector('.title');body=h('div',{class:'puzzle-paper scroll'});root.append(bar,body);FK.play.bindTouch(root);FK.on('puzzle-review-change',()=>{if(alive&&session&&!session.review&&!FK.puzzleReview.ready(game)){clearTimeout(timer);locked=true;blocked();}});
    },
    enter(params){
      alive=true;root.scrollTop=0;game=params.game;const entry=FK.friendsLibrary.catalogue().find(g=>g.id===game);
      if(!entry||entry.screen!=='puzzle'){FK.go('forest-book');return;}
      origin=['forest-book','puzzle-review','puzzle-gallery'].includes(params.returnTo)?params.returnTo:'friends';host=entry.host;title.textContent=entry.title;
      session=null;root.querySelector('.review-reject')?.remove();delete root.dataset.reviewIteration;
      if(params.reviewIteration||params.reviewQueue||params.reviewRound)session=FK.puzzleReview.previewSession(game,params.reviewIteration);
      else if(params.gallery){session=FK.puzzleReview.gallerySession(game);if(!session){FK.go('puzzle-gallery');return;}}
      if(!session){if(!FK.friendsLibrary.canPlay(game)){FK.go('friends');return;}if(!FK.puzzleReview.ready(game)){blocked();return;}session=R.start(game);}
      FK.playLog?.begin(session);draw();
      root.querySelector('.btn-back').setAttribute('aria-label',session.review?'Zur Puzzle-Prüfung':session.gallery?'Zur Puzzle-Galerie':origin==='forest-book'?'Zurück zu Waldspiele':'Zurück zum Wald');
    },
    leave(){FK.playLog?.stop();alive=false;clearTimeout(timer);cancelCompletion();FK.forestVoice.cancel();locked=true;}
  });
})();
