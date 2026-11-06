/* Pictured woodland explorations. All input works with taps and native buttons. */
(function () {
  'use strict';
  const FK = window.FK, h = FK.h;
  let body, title, game, stage, round, q, locked, feedback, next, wordOffset;
  const button = (text, fn, cls) => h('button', { type: 'button', class: 'learn-button ' + (cls || ''), text, onclick: fn });
  const control = (text, fn, cls) => button(text, () => { if (!locked) fn(); }, cls);
  function say(text) { feedback.textContent = text; FK.play.speak(text); }
  function check(ok) {
    if (locked) return;
    FK.play.attempt(ok);
    if (!ok) { say('Probiere weiter. ' + q.hint); FK.sound.undo(); return; }
    locked = true;
    body.querySelectorAll('.exp-work button').forEach(b => { b.disabled = true; });
    feedback.textContent='Juhui! ' + q.explain; FK.play.feedback(body,feedback.textContent,true);
    next.hidden = false;
  }
  function picture(emoji, name, cls) {
    return h('div', { class: 'exp-picture ' + (cls || '') }, h('span', { class: 'exp-art', text: emoji, 'aria-hidden': 'true' }), h('span', { text: FK.text.word(name) }));
  }
  function choices(host, values, label, answer, cls) {
    const row = h('div', { class: 'learn-answers ' + (cls || '') });
    values.forEach(value => {
      const b = control(label(value), () => { const ok = answer(value); b.classList.add(ok ? 'correct' : 'try-again'); check(ok); }, 'learn-answer');
      row.append(b);
    });
    host.append(row);
  }
  function quantity(n, capacity) {
    const field = h('div', { class: 'exp-quantity', role: 'img', 'aria-label': n + ' Beeren, in Fünferreihen' });
    for (let i = 0; i < capacity; i++) field.append(h('span', { class: 'exp-counter' + (i < n ? ' filled' : ''), 'aria-hidden': 'true', text: i < n ? '🫐' : '' }));
    return field;
  }
  function treasure(host) {
    host.append(FK.ui.memoryBoard({ question: q, onChoice: (_, correct) => check(correct) }));
  }
  function neighbours(host) {
    const selected = [null, null], houses = []; let active = 0;
    const instruction = h('p', { class: 'exp-instructions', role: 'status' });
    function update() {
      houses.forEach((b, i) => {
        b.lastChild.textContent = selected[i] === null ? '?' : selected[i];
        b.setAttribute('aria-pressed', String(i === active));
        b.setAttribute('aria-label', (i === 0 ? 'Zahl vor ' : 'Zahl nach ') + q.n + ': ' + (selected[i] === null ? 'noch leer' : selected[i]) + '. Ändern');
      });
      instruction.textContent = (active ? 'Rechtes Haus: Welche Zahl kommt direkt nach ' : 'Linkes Haus: Welche Zahl kommt direkt vor ') + q.n + '?';
    }
    const street = h('div', { class: 'exp-street', role: 'group', 'aria-label': 'Drei Nachbarhäuser in Zahlenreihenfolge' });
    for (let i = 0; i < 3; i++) {
      if (i === 1) street.append(h('div', { class: 'exp-house exp-house-fixed', role: 'img', 'aria-label': 'Mittleres Haus: ' + q.n }, h('span', { text: 'Mitte' }), h('b', { text: q.n })));
      else {
        const index = i === 0 ? 0 : 1;
        const b = control('', () => { active = index; update(); }, 'exp-house');
        b.append(h('span', { text: index ? 'danach' : 'davor' }), h('b')); houses.push(b); street.append(b);
      }
    }
    const bank = h('div', { class: 'learn-answers', role: 'group', 'aria-label': 'Zahlen für das gewählte Haus' });
    q.choices.forEach(n => bank.append(control(String(n), () => { selected[active] = n; if (!active && selected[1] === null) active = 1; update(); FK.sound.tick(); }, 'learn-answer')));
    host.append(instruction, street, bank, control('Neu belegen', () => { selected.fill(null); active = 0; update(); }),
      control('Nachbarn prüfen', () => check(selected.every((n, i) => n === q.answer[i])), 'learn-next'));
    update();
  }
  function compare(host) {
    const selected=[null,null],paired=new Set(),history=[],tokens=[[],[]];
    const row=h('div',{class:'exp-compare compare-pairing'}),pairs=h('div',{class:'compare-pairs','aria-label':'Deine Beerenpaare'}),meter=h('p',{class:'play-instruction',role:'status',text:'Tippe links und rechts eine Beere an. Wer hat welche übrig?'});
    function update(){
      tokens.forEach((list,side)=>list.forEach((b,i)=>{b.disabled=paired.has(side+':'+i)||locked;b.classList.toggle('paired',paired.has(side+':'+i));b.setAttribute('aria-pressed',String(selected[side]===i));}));
      pairs.replaceChildren(...history.map(()=>h('span',{class:'compare-pair'},FK.play.picture('🫐'),h('b',{text:'↔'}),FK.play.picture('🫐'))));
      meter.textContent=history.length===Math.min(q.a,q.b)?history.length?'Alle möglichen Paare sind verbunden. Auf welcher Seite bleiben Beeren übrig?':'Auf einer Seite sind keine Beeren. Schau, wo noch welche liegen.':'Tippe links und rechts eine Beere an. Wer hat welche übrig?';
    }
    [q.a,q.b].forEach((n,side)=>{
      const bowl=h('section',{class:'exp-bowl'},FK.forestArt.character(side?'hare':'fox'));
      const field=h('div',{class:'compare-berry-field'});
      for(let i=0;i<n;i++){
        const b=control('',()=>{selected[side]=selected[side]===i?null:i;
          if(selected.every(v=>v!==null)){history.push(selected.slice());selected.forEach((index,s)=>paired.add(s+':'+index));selected.fill(null);FK.sound.right();}else FK.sound.tick();update();},'compare-berry');
        b.append(FK.play.picture('🫐'));b.setAttribute('aria-label',(side?'Rechts':'Links')+' Beere '+(i+1)+' verbinden');tokens[side].push(b);field.append(b);
      }
      if(!n)field.append(h('span',{class:'compare-empty',text:'0'}));bowl.append(field);row.append(bowl);
    });
    host.append(FK.play.steps([['🫐','Eine links'],['🫐','Eine rechts'],['✓','Paare bilden']]),row,pairs,meter,
      control('↶ Letztes Paar lösen',()=>{const pair=history.pop();if(pair)pair.forEach((index,side)=>paired.delete(side+':'+index));selected.fill(null);update();}));
    choices(host,q.choices,n=>n===0?'= Gleich viele':n<0?'← Links mehr':'Rechts mehr →',n=>n===q.answer);update();
  }
  function mirror(host) {
    host.append(FK.play.steps([['🪞','An der Linie beginnen'],['🖐️','Gegenüber antippen'],['✓','Prüfen']]), h('div',{class:'play-mirror-example',role:'img','aria-label':'Beispiel: zwei Reihen. Das obere linke Feld erscheint im Spiegel oben rechts.',html:'<svg viewBox="0 0 210 94"><g fill="#fff8e8" stroke="#b0bc95" stroke-width="2"><rect x="8" y="8" width="35" height="35" fill="#9ab477"/><rect x="46" y="8" width="35" height="35"/><rect x="8" y="46" width="35" height="35"/><rect x="46" y="46" width="35" height="35"/><rect x="128" y="8" width="35" height="35"/><rect x="166" y="8" width="35" height="35" fill="#9ab477"/><rect x="128" y="46" width="35" height="35"/><rect x="166" y="46" width="35" height="35"/></g><path d="M105 1v90" stroke="#96afb1" stroke-width="4" stroke-dasharray="5 4"/></svg>'}));
    const selected = new Set(), history = [], cells = [];
    const layout = h('div', { class: 'exp-mirror', style: { '--columns': q.width } });
    const left = h('div', { class: 'exp-mosaic', role: 'group', 'aria-label': 'Vorlage links' });
    const right = h('div', { class: 'exp-mosaic', role: 'group', 'aria-label': 'Dein Spiegelbild rechts' });
    const meter = h('p', { class: 'exp-instructions', role: 'status' });
    function update() {
      cells.forEach((b, i) => { b.setAttribute('aria-pressed', String(selected.has(i))); b.textContent = selected.has(i) ? '◆' : ''; });
      meter.textContent = selected.size + ' Felder rechts gefüllt. Tippe ein Feld nochmals an, um es zu leeren.';
    }
    q.left.forEach((filled, i) => {
      const coord = 'Reihe ' + (Math.floor(i / q.width) + 1) + ', Spalte ' + (i % q.width + 1);
      left.append(h('span', { class: 'exp-mosaic-cell' + (filled ? ' filled' : ''), role: 'img', 'aria-label': coord + (filled ? ': gefüllt' : ': leer'), text: filled ? '◆' : '' }));
      const b = control('', () => { history.push(i); if (selected.has(i)) selected.delete(i); else selected.add(i); update(); FK.sound.tick(); }, 'exp-mosaic-cell');
      b.setAttribute('aria-label', 'Spiegelbild ' + coord); cells.push(b); right.append(b);
    });
    layout.append(left, h('div', { class: 'exp-axis', role: 'img', 'aria-label': 'Senkrechte Spiegellinie' }), right);
    host.append(h('div', { class: 'exp-mirror-labels' }, h('span', { text: 'Vorlage' }), h('span', { text: 'Dein Spiegelbild' })), layout, meter,
      control('↶ Zurück', () => { if (history.length) { const i = history.pop(); if (selected.has(i)) selected.delete(i); else selected.add(i); update(); } }),
      control('Leeren', () => { selected.clear(); history.length = 0; update(); }),
      control('Spiegelbild prüfen', () => check(selected.size === q.answer.length && q.answer.every(i => selected.has(i))), 'learn-next'));
    update();
  }
  function tricks(host) {
    const known = h('section', { class: 'exp-known' }, h('p', { class: 'wa-kicker', text: 'Das weisst du schon' }),
      h('p', { class: 'exp-equation', text: q.knownA + ' + ' + q.knownB + ' = ' + q.knownTotal }));
    const support = h('div', { class: 'exp-trick-support', hidden: stage > 1 }, quantity(q.knownA, Math.max(5, Math.ceil(q.knownA / 5) * 5)), h('span', { text: '+' }), quantity(q.knownB, Math.max(5, Math.ceil(q.knownB / 5) * 5)));
    const toggle = control(stage > 1 ? 'Mengen zeigen' : 'Mengen ausblenden', () => { support.hidden = !support.hidden; toggle.textContent = support.hidden ? 'Mengen zeigen' : 'Mengen ausblenden'; toggle.setAttribute('aria-expanded', String(!support.hidden)); });
    toggle.setAttribute('aria-expanded', String(!support.hidden));
    host.append(known, support, toggle, h('p', { class: 'exp-equation', text: q.a + ' + ' + q.b + ' = ?' }));
    choices(host, q.choices, String, n => n === q.answer);
  }
  function vowels(host) {
    const line = h('div', { class: 'exp-word', role: 'img', 'aria-label': 'Bildwort: ' + Array.from(q.word).map((c, i) => i === q.index ? 'Lücke' : FK.text.word(c)).join(' ') });
    let blank;
    Array.from(q.word).forEach((c, i) => {
      const el = h('span', { class: 'exp-letter' + (i === q.index ? ' exp-blank' : ''), 'aria-hidden': 'true', text: i === q.index ? '?' : FK.text.word(c) });
      if (i === q.index) blank = el; line.append(el);
    });
    host.append(h('div', { class: 'exp-word-picture' }, FK.visual.art(q.emoji, '', q.word)), line,
      h('p', { class: 'exp-instructions', text: 'Du darfst dir das Bildwort nennen lassen.' }));
    choices(host, q.choices, c => FK.text.word(c), c => {
      if (c !== q.answer) return false;
      blank.textContent = FK.text.word(c); blank.classList.add('correct'); line.setAttribute('aria-label', FK.text.word(q.word)); return true;
    });
  }
  function survey(host) {
    host.append(h('div',{class:'play-survey-key'},FK.forestArt.character('fox'),h('span',{text:'→'}),FK.forestArt.icon('paw'),h('span',{text:'Eine Pfote = eine Stimme'})));
    const task=h('div',{class:'play-survey-question','aria-label':q.prompt});
    if(q.task==='count') task.append(FK.play.picture(q.fruit[q.target].emoji),h('b',{text:'→ ?'}));
    else if(q.task==='difference') task.append(FK.play.picture(q.fruit[q.target].emoji),h('b',{text:'↔'}),FK.play.picture(q.fruit[q.other].emoji),h('b',{text:'?'}));
    else task.append(h('b',{text:q.task==='most'?'↑ ?':q.task==='least'?'↓ ?':'🍎 + 🍐 + 🍓 = ?'}));
    host.append(task);
    const chart=h('div',{class:'exp-chart play-survey-chart',role:'group','aria-label':'Waldumfrage: jede Pfote ist eine Stimme'});
    q.fruit.forEach((f,i)=>{
      const votes=h('div',{class:'exp-votes','aria-label':f.name+': '+q.counts[i]+' Stimmen'});
      for(let row=0;row<q.scale;row++) {
        if(row<q.counts[i]) {
          const vote=control('',()=>{vote.classList.toggle('counted');vote.setAttribute('aria-pressed',String(vote.classList.contains('counted')));FK.sound.tick();},'exp-vote filled');
          vote.replaceChildren(FK.forestArt.icon('paw'));vote.setAttribute('aria-label',f.name+', Stimme '+(row+1));vote.setAttribute('aria-pressed','false');votes.append(vote);
        } else votes.append(h('span',{class:'exp-vote empty','aria-hidden':'true'}));
      }
      const target=q.task==='count'?i===q.target:q.task==='difference'?i===q.target||i===q.other:false;
      chart.append(h('section',{class:'exp-chart-column'+(target?' is-target':'')},FK.play.picture(f.emoji,f.name),votes));
    });
    const bank=h('div',{class:'survey-ballots'}),ballots=[];
    q.counts.forEach((n,index)=>{for(let i=0;i<n;i++)ballots.push(index);});
    const ordered=FK.shuffle(ballots),recorded=[0,0,0];let cursor=0;
    const ballotArt=h('div',{class:'survey-ballot-art'}),meter=h('p',{class:'play-instruction',role:'status'}),cast=h('div',{class:'survey-cast'}),answers=h('div',{class:'learn-answers',hidden:stage<3});
    const votes=[...chart.querySelectorAll('.exp-votes')];
    function drawVotes(){votes.forEach((line,i)=>{[...line.children].forEach((el,j)=>{if(j<q.counts[i])el.classList.toggle('uncast',j>=recorded[i]);});});}
    function reveal(){recorded.splice(0,3,...q.counts);cursor=ordered.length;bank.hidden=true;answers.hidden=false;drawVotes();FK.play.speak(q.prompt);}
    function nextBallot(){
      drawVotes();if(cursor===ordered.length){reveal();return;}
      const resident=['fox','hare','hedgehog','owl','kingfisher'][cursor%5];
      ballotArt.replaceChildren(FK.forestArt.character(resident),FK.forestArt.icon('arrow'),FK.play.picture(q.fruit[ordered[cursor]].emoji));
      meter.textContent=cursor+' / '+ordered.length+' Stimmen eingetragen';
    }
    q.fruit.forEach((f,i)=>cast.append(control('',()=>{
      if(i!==ordered[cursor]){FK.sound.undo();FK.play.speak('Schau auf das Obst im Stimmzettel.');return;}
      recorded[i]++;cursor++;FK.sound.tick();nextBallot();
    },'survey-cast-button')));
    [...cast.children].forEach((b,i)=>{b.append(FK.play.picture(q.fruit[i].emoji));b.setAttribute('aria-label',q.fruit[i].name+' eine Stimme geben');});
    bank.append(h('p',{class:'play-instruction',text:'Trage die Stimmen der Freunde ein.'}),ballotArt,cast,meter,control('Umfrage direkt anschauen',reveal,'survey-reveal'));
    host.append(bank,chart);
    q.choices.forEach(value=>{
      const f=q.fruit.find(item=>item.id===value),b=control(f?f.name:String(value),()=>{const ok=value===q.answer;b.classList.add(ok?'correct':'try-again');check(ok);},'learn-answer');
      b.dataset.answer=String(value);if(f)b.replaceChildren(FK.play.picture(f.emoji,f.name));answers.append(b);
    });host.append(answers);
    if(stage<3)nextBallot();else{bank.hidden=true;recorded.splice(0,3,...q.counts);drawVotes();}
  }

  const renderers = { treasure, neighbours, compare, mirror, tricks, vowels, survey };
  function draw() {
    q = FK.expeditions.question(game.id, stage, round, Math.random, wordOffset); locked = false;
    const host = h('div', { class: 'exp-work exp-game-' + game.id });
    feedback = h('p', { class: 'learn-feedback', role: 'status', 'aria-live': 'polite', text: 'Probiere aus. Du hast Zeit.' });
    next = button(round === 4 ? '⭐ Geschafft!' : 'Weiter →', () => { if (!locked) return; round++; if (round === 5) finish(); else draw(); }, 'learn-next exp-next'); next.hidden = true;
    body.replaceChildren(FK.play.context(game.id,q.prompt,round,stage),
      FK.woodland.progress(round),
      h('h2', { class: 'learn-prompt', text: q.prompt }), host, feedback, next,
      button('💡 Tipp', () => {FK.play.hint();say(q.hint);}, 'learn-hint'));
    renderers[game.id](host); body.scrollTop = 0; FK.play.speak(q.prompt);
  }
  function finish() {
    FK.play.finish(body,'expedition',game.id,stage,()=>{round=0;wordOffset=(wordOffset+1)%8;draw();});
  }
  FK.screen('expedition', {
    build(root) { FK.play.bindTouch(root); const bar = FK.ui.topbar({ title: 'Forschen & Knobeln' }); title = bar.querySelector('.title'); body = h('div', { class: 'learn-body scroll' }); root.append(bar, body); },
    enter(params) { if(params.game==='tricks'){FK.go('learn',{game:'add'},{replace:true});return;} game = FK.expeditions.games.find(g => g.id === (params || {}).game) || FK.expeditions.games[0]; stage = FK.learning.stage(); round = 0; wordOffset = Math.floor(Math.random() * 8); title.textContent = game.title;FK.play.begin(game.id,stage); draw(); },
    leave() { locked = true; FK.forestVoice.cancel(); },
  });
})();
