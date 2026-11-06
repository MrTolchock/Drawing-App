/* One flat route board for ordinary Roboterpost and the woodland story. */
(function () {
  'use strict';
  const FK = window.FK, h = FK.h;
  function programBoard(options){
    const q=options.question,root=h('div',{class:'route-board route-program'}),directions=[['↑','Nach oben','up',0,-1],['←','Nach links','left',-1,0],['↓','Nach unten','down',0,1],['→','Nach rechts','right',1,0]];
    const plan=[],controls=[],strip=h('div',{class:'route-program-strip',role:'group','aria-label':'Dein Programm'}),stage=h('div',{class:'route-program-stage'}),status=h('p',{class:'play-instruction',role:'status',text:'Erst planen. Dann die Post losschicken.'});
    let board,running=false,finished=false,timer=0,cursor=-1,disposed=false;
    function makeBoard(){
      board=FK.ui.routeBoard({question:q,onChange:options.onChange,onBlocked:()=>{},onSuccess:()=>{finished=true;running=false;options.onSuccess?.();}});
      board.querySelector('.route-controls').remove();stage.replaceChildren(board);
    }
    function update(){
      strip.replaceChildren();
      if(!plan.length)strip.append(h('span',{text:'＋ → → ↓ …',class:'route-program-placeholder'}));
      plan.forEach((dir,i)=>strip.append(h('button',{type:'button',class:'route-command'+(i===cursor?' executing':''),'aria-label':'Befehl '+(i+1)+': '+dir[1]+'. Entfernen',disabled:running||finished,onclick:()=>{plan.splice(i,1);update();}},h('small',{text:i+1}),h('b',{text:dir[0]}))));
      controls.forEach(b=>b.disabled=running||finished||plan.length>=32);
      run.disabled=running||finished||!plan.length;undo.disabled=running||finished||!plan.length;reset.disabled=running||finished;
    }
    function add(dir){if(running||finished||plan.length>=32)return;plan.push(dir);cursor=-1;FK.sound.tick();update();}
    function execute(){
      if(running||finished||!plan.length)return;makeBoard();running=true;cursor=-1;status.textContent='Die Post ist unterwegs …';update();
      function tick(){
        if(disposed||!root.isConnected)return;
        cursor++;if(cursor>=plan.length){running=false;FK.play.attempt?.(false);status.textContent='Noch nicht am Briefkasten. Ändere deinen Plan und probiere nochmals.';options.onBlocked?.();update();return;}
        const dir=plan[cursor];
        if(!board.walk(dir[3],dir[4])){running=false;FK.play.attempt?.(false);status.textContent='Hier ist eine Hecke oder der Rand. Ändere diesen Pfeil.';options.onBlocked?.();update();return;}
        update();if(finished){status.textContent='Die Post ist da! Dein Programm funktioniert.';return;}
        timer=setTimeout(tick,FK.reduced?40:320);
      }
      timer=setTimeout(tick,FK.reduced?20:220);
    }
    const arrows=h('div',{class:'adventure-arrows route-program-controls','aria-label':'Programm planen'});
    directions.forEach(dir=>{const b=h('button',{type:'button',class:'learn-button route-direction route-'+dir[2],'aria-label':dir[1],onclick:()=>add(dir),text:dir[0]});controls.push(b);arrows.append(b);});
    const run=h('button',{type:'button',class:'learn-button learn-next route-run',onclick:execute},FK.forestArt.icon('play'),h('span',{text:'Post losschicken'}));
    const undo=h('button',{type:'button',class:'learn-button route-undo','aria-label':'Letzten Befehl entfernen',onclick:()=>{if(running||finished)return;plan.pop();update();}},FK.forestArt.icon('undo'));
    const reset=h('button',{type:'button',class:'learn-button route-reset',onclick:()=>{if(running||finished)return;plan.length=0;cursor=-1;makeBoard();status.textContent='Plane einen neuen Weg.';update();},text:'Neu planen'});
    root.append(FK.play.steps([['🗺️','Weg anschauen'],['🖐️','Pfeile planen'],['✓','Losfahren']]),stage,strip,arrows,h('div',{class:'route-program-actions'},undo,run,reset),status);
    root.addEventListener('keydown',e=>{const dir={ArrowUp:directions[0],ArrowLeft:directions[1],ArrowDown:directions[2],ArrowRight:directions[3]}[e.key];if(dir){e.preventDefault();add(dir);}});
    root.dispose=()=>{disposed=true;clearTimeout(timer);};makeBoard();update();return root;
  }
  FK.ui.routeBoard = function (options) {
    if(options.planning)return programBoard(options);
    const q = options.question, pictured = options.pictured === true;
    let state = options.snapshot || FK.routes.initial(q);
    const root = h('div', { class: 'route-board' + (pictured ? ' route-pictured' : '') });
    const field = h('div', { class: 'adventure-map', style: { '--size': q.size }, role: 'group', 'aria-label': pictured ? 'Fuchs und ' + (FK.forestStory?.names[options.targetResident || 'owl'] || 'Waldkauz') + ' auf der Wegekarte' : 'Postkarte mit ' + q.size + ' mal ' + q.size + ' Feldern' });
    const commands = h('p', { class: 'adventure-commands', role: 'status', 'aria-live': 'polite' });
    const arrows = h('div', { class: 'adventure-arrows', role: 'group', 'aria-label': pictured ? 'Fuchs bewegen' : 'Roboter steuern' });
    const cells = [], controls = [];
    for (let i = 0; i < q.size * q.size; i++) { const cell = h('span', { class: 'adventure-map-cell', 'aria-hidden': 'true' }); cells.push(cell); field.append(cell); }
    function update() {
      cells.forEach((cell, i) => {
        cell.replaceChildren(); cell.classList.toggle('route-goal', i === q.goal); cell.classList.toggle('route-arrived', i === q.goal && state.answered);
        if (!pictured) { cell.textContent = i === state.position ? '🤖' : i === q.goal ? '📬' : q.obstacles.includes(i) ? '🌳' : state.history.includes(i) ? '·' : ''; FK.visual?.decorate(cell); }
        else {
          if (i === q.goal) cell.append(FK.forestArt.character(options.targetResident || 'owl'));
          if (i === state.position) cell.append(FK.forestArt.character('fox'));
          else if (q.obstacles.includes(i)) cell.append(FK.visual.art('tree'));
          else if (i !== q.goal && state.history.includes(i)) cell.append(h('span', { class: 'route-footprint' }, FK.forestArt.icon('paw')));
        }
      });
      commands.textContent = (pictured ? 'Fuchs' : 'Roboter') + ': Reihe ' + (Math.floor(state.position / q.size) + 1) + ', Spalte ' + (state.position % q.size + 1) + '.';
      controls.forEach(b => { b.disabled = state.answered || (options.demonstration === true && b.dataset.direction !== 'right'); }); undo.disabled = state.answered || state.history.length < 2;
      if (options.demonstration) {
        arrows.querySelector('.route-demo-hand')?.remove();
        if (!state.answered) arrows.querySelector('[data-direction="right"]').append(FK.forestArt.icon('hand', 'route-demo-hand'));
      }
    }
    function move(dx, dy) {
      if (state.answered) return;
      const next = options.move ? options.move(dx, dy) : FK.routes.move(q, state, dx, dy);
      if (!next) { options.onBlocked?.(); return false; }
      state = next; FK.sound.tick(); update(); options.onChange?.(state);
      if (state.answered) options.onSuccess?.();
      return true;
    }
    [['↑', 'Nach oben', 'up', 0, -1], ['←', 'Nach links', 'left', -1, 0], ['↓', 'Nach unten', 'down', 0, 1], ['→', 'Nach rechts', 'right', 1, 0]].forEach(([symbol, label, direction, dx, dy]) => {
      const b = h('button', { type: 'button', class: 'learn-button route-direction route-' + direction, 'data-direction': direction, 'aria-label': label, onclick: () => move(dx, dy) },
        pictured ? FK.forestArt.icon('arrow', 'route-arrow-' + direction) : document.createTextNode(symbol));
      controls.push(b); arrows.append(b);
    });
    const undo = h('button', { type: 'button', class: 'learn-button route-undo' + (pictured ? ' forest-button' : ''), 'aria-label': 'Einen Schritt zurück', onclick: () => {
      const next = options.undo ? options.undo() : FK.routes.undo(q, state);
      if (next) { state = next; FK.sound.tick(); update(); options.onChange?.(state); }
    } }, pictured ? FK.forestArt.icon('undo') : document.createTextNode('↶ Einen Schritt zurück'));
    if (!pictured) root.append(h('p', { text: 'Ziel: Reihe ' + (Math.floor(q.goal / q.size) + 1) + ', Spalte ' + (q.goal % q.size + 1) }));
    root.append(field, commands, h('div', { class: 'route-controls' }, arrows, undo)); root.walk=move; update(); return root;
  };
})();
