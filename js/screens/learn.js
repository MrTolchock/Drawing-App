/* Farbtupf: short, untimed finger-first learning rounds. */
(function () {
  'use strict';
  const FK = window.FK, h = FK.h;
  let body, title, game, stage, round, current, locked, live, next, answers, root, bar, controls;
  let forest = false, demonstrating = false, quest;
  function returnToForest() { FK.forestActivity.leave(quest); }
  function forestPrompt() {
    if (!demonstrating && FK.forestState.getActivity(quest)?.finished) { FK.forestVoice.say(FK.forestActivity.backLabel(quest) + '.'); return; }
    FK.forestVoice.say(demonstrating ? 'Schau: Blatt, Haselnuss. Blatt, Haselnuss. Dann kommt wieder ein Blatt.' : locked ? 'Das passt! Tippe auf den Pfeil.' : 'Wie geht es weiter? Tippe auf das passende Bild.');
  }
  function demonstrate() {
    if (!forest) return;
    demonstrating = true; body.replaceChildren();
    const sequence = h('div', { class: 'forest-demo-pattern', 'aria-label': 'Beispiel: Blatt, Haselnuss, Blatt, Haselnuss. Danach wieder ein Blatt.' });
    ['🔵', '⭐', '🔵', '⭐'].forEach(token => sequence.append(h('span', {}, FK.woodland.pattern(token))));
    sequence.append(h('span', { class: 'forest-demo-gap' }, FK.woodland.pattern('🔵'), FK.forestArt.icon('hand')));
    body.append(h('section', { class: 'forest-demo' }, h('h2', { text: 'Schau, so geht’s.' }), sequence,
      h('button', { type: 'button', class: 'forest-button forest-primary', 'aria-label': 'Jetzt selber probieren', onclick: () => {
        FK.forestState.demoSeen(quest); demonstrating = false; draw();
      } }, FK.forestArt.icon('play'), h('span', { text: 'Jetzt du' }))));
    forestPrompt();
  }
  function button(label, fn, cls) {
    return h('button', { type: 'button', class: 'learn-button ' + (cls || ''), text: label, onclick: fn });
  }
  const gestureCleanup = [];
  function clearGestures() { gestureCleanup.splice(0).forEach(cleanup => cleanup()); }
  // The same move works with a finger, a mouse, or the button's ordinary tap/keyboard action.
  function dragTo(node, getTarget, drop) {
    let start, target, ghost, dragging = false, suppressUntil = 0;
    const hit = event => { const r = target.getBoundingClientRect(); return event.clientX >= r.left && event.clientX <= r.right && event.clientY >= r.top && event.clientY <= r.bottom; };
    function clean() { ghost?.remove(); ghost = null; target?.classList.remove('receiving'); node.classList.remove('is-dragging'); dragging = false; start = null; }
    node.addEventListener('click', event => { if (Date.now() < suppressUntil) { event.preventDefault(); event.stopImmediatePropagation(); } }, true);
    node.addEventListener('keydown', () => { suppressUntil = 0; });
    node.addEventListener('pointerdown', event => {
      suppressUntil = 0;
      if (locked || !event.isPrimary || event.button !== 0) return;
      target = typeof getTarget === 'function' ? getTarget() : getTarget;
      if (!target) return;
      start = { x:event.clientX, y:event.clientY, id:event.pointerId };
      node.setPointerCapture?.(event.pointerId);
    });
    node.addEventListener('pointermove', event => {
      if (!start || event.pointerId !== start.id) return;
      if (!dragging && Math.hypot(event.clientX-start.x,event.clientY-start.y) < 9) return;
      if (!dragging) { dragging = true; ghost = node.cloneNode(true); ghost.removeAttribute('id'); ghost.removeAttribute('aria-label'); ghost.setAttribute('aria-hidden','true'); ghost.className += ' learn-drag-ghost'; ghost.style.width = node.getBoundingClientRect().width+'px'; document.body.append(ghost); node.classList.add('is-dragging'); }
      event.preventDefault(); ghost.style.left = event.clientX+'px'; ghost.style.top = event.clientY+'px'; target.classList.toggle('receiving',hit(event));
    });
    node.addEventListener('pointerup', event => {
      if (!start || event.pointerId !== start.id) return;
      const didDrag = dragging, landed = didDrag && hit(event);
      const touchTap = !didDrag && event.pointerType === 'touch';
      if (didDrag || touchTap) { suppressUntil = Date.now()+500; event.fkPlayHandled=true; }
      if (didDrag) event.preventDefault();
      clean(); if ((landed || touchTap) && !locked) drop();
    });
    node.addEventListener('pointercancel',clean);
    gestureCleanup.push(clean);
  }
  function countGarden(visual) {
    let onChange = () => {};
    const size = [5,10,20][stage-1], marks = [], bugs = [], tally = h('div',{class:'learn-census',role:'status','aria-live':'polite'});
    const field = h('div',{class:'learn-frame learn-garden-field'}), slots = FK.shuffle(Array.from({length:size},(_,i)=>i)), bugSlots = new Set(slots.slice(0,current.count));
    const instruction = h('p',{class:'play-instruction',text:current.count ? 'Finde die Marienkäfer. Tippe sie an und zähle mit.' : 'Heute ist es ganz still im Garten. Wie viele Marienkäfer sind da?'});
    function update() {
      marks.forEach((bug,i)=>{bug.querySelector('.learn-count-mark').textContent=i+1;});
      tally.replaceChildren(FK.forestArt.icon('hand'),h('span',{text:marks.length ? 'Du hast '+marks.length+' gezählt.' : 'Noch kein Käfer gezählt.'}));
      onChange();
    }
    for (let i=0;i<size;i++) {
      const cell=h('div',{class:'learn-cell'});
      if(bugSlots.has(i)) {
        const bug=button('',()=>{
          if(locked)return;
          const at=marks.indexOf(bug);
          if(at>=0)marks.splice(at,1);else marks.push(bug);
          bug.classList.toggle('counted',at<0);bug.setAttribute('aria-pressed',String(at<0));update();FK.sound.tick();
        },'learn-bug');
        bug.append(FK.play.picture('🐞'),h('b',{class:'learn-count-mark','aria-hidden':'true'}));
        bug.setAttribute('aria-label','Käfer '+(bugs.length+1));bug.setAttribute('aria-pressed','false');bugs.push(bug);cell.append(bug);
      } else cell.append(FK.visual.art(i%2?'flower':'leaf','learn-garden-plant'));
      field.append(cell);
    }
    visual.append(h('div',{class:'play-garden learn-census-garden','aria-label':current.count===0?'Ein Garten ohne Marienkäfer':'Marienkäfer zwischen den Pflanzen'},field),instruction,tally);
    update();
    return {
      ready:() => marks.length === bugs.length,
      bind(fn) { onChange=fn; },
      waiting:'Markiere zuerst alle Marienkäfer. Dann wählst du die Zahl.',
      solve() { visual.classList.add('scene-solved'); },
      hint() { bugs.find(bug=>!bug.classList.contains('counted'))?.classList.add('needs-look'); },
      retry() { bugs.forEach(bug=>bug.classList.remove('needs-look')); }
    };
  }
  function snackPicnic(visual) {
    let onChange = () => {};
    const left=h('div',{class:'play-snack-bowl','aria-label':'Äpfel beim Fuchs'}),right=h('div',{class:'play-snack-bowl','aria-label':current.subtract?'Äpfel beim Hasen':'Äpfel zum Dazulegen'});
    const moved=new Set(), meter=h('p',{class:'play-instruction learn-snack-status',role:'status','aria-live':'polite'});
    const leftFriend=FK.forestArt.character('fox'),rightFriend=current.subtract?FK.forestArt.character('hare'):FK.forestArt.icon('basket');
    const goal=h('div',{class:'learn-snack-goal','aria-label':current.b+' Äpfel '+(current.subtract?'für den Hasen':'dazulegen')},h('span',{text:current.b}),FK.visual.art('apple'),FK.forestArt.icon('arrow'),current.subtract?FK.forestArt.character('hare'):FK.forestArt.character('fox'));
    function updateSnack() {
      meter.textContent=moved.size===current.b ? current.subtract?'Danke! Mein Znüni ist bereit. Wie viele Äpfel bleiben beim Fuchs?':'Alles eingepackt! Wie viele Äpfel sind jetzt beim Fuchs?' : current.subtract?'Gib dem Hasen '+current.b+' Äpfel. Noch '+(current.b-moved.size)+' fehlen.':'Lege die Äpfel aus dem Korb zum Fuchs.';
      goal.classList.toggle('ready',moved.size===current.b);
      left.classList.toggle('snack-ready',!current.subtract&&moved.size===current.b);right.classList.toggle('snack-ready',current.subtract&&moved.size===current.b);
      onChange();
    }
    function makeApple(i,from) {
      let apple;
      function move() {
        if(locked)return;
        if(moved.has(i)){moved.delete(i);from.append(apple);}
        else if(!current.subtract||moved.size<current.b){moved.add(i);(current.subtract?right:left).append(apple);}
        else { meter.textContent='Der Hase hat genug. Zähle jetzt die Äpfel beim Fuchs.';FK.ui.bounce(right);return; }
        apple.setAttribute('aria-pressed',String(moved.has(i)));FK.ui.bounce(apple);updateSnack();FK.sound.tick();
        if(moved.size===current.b)FK.play.speak(current.subtract?'Danke! Mein Bauch knurrt schon. Jetzt können wir zusammen Znüni essen. Wie viele bleiben beim Fuchs?':'Juhui, alles im Picknickkorb! Wie viele Äpfel haben wir zusammen?');
      }
      apple=button('',move,'play-snack-apple learn-movable');
      apple.append(FK.visual.art('apple'));apple.setAttribute('aria-label','Apfel '+(i+1)+(current.subtract?' weitergeben oder zurücknehmen':' dazulegen oder zurücknehmen'));apple.setAttribute('aria-pressed','false');
      dragTo(apple,()=>moved.has(i)?from:current.subtract?right:left,move);from.append(apple);
    }
    if(current.subtract)for(let i=0;i<current.a;i++)makeApple(i,left);
    else {
      for(let i=0;i<current.a;i++)left.append(h('span',{class:'play-snack-apple fixed'},FK.visual.art('apple')));
      for(let i=0;i<current.b;i++)makeApple(i,right);
    }
    if(current.known) {
      const known=current.known;
      visual.append(h('div',{class:'play-known'},h('small',{text:known.rule==='swap'?'Tauschfreunde: andere Reihenfolge, gleich viele Äpfel.':'Rechentrick: Heute kommt ein Apfel mehr dazu.'}),h('b',{text:known.rule==='swap'?known.a+' + '+known.b+' ↔ '+current.a+' + '+current.b:known.a+' + '+known.b+' = '+known.answer})));
    }
    const group=h('div',{class:'play-snack-table learn-picnic-table'},h('section',{},leftFriend,h('small',{text:'Beim Fuchs'}),left),h('b',{text:current.subtract?'→':'+'}),h('section',{},rightFriend,h('small',{text:current.subtract?'Für den Hasen':'Aus dem Korb'}),right));
    visual.append(goal,h('p',{class:'play-instruction',text:current.subtract?'Ziehe oder tippe Äpfel zum Hasen.':'Ziehe oder tippe die Äpfel aus dem Korb zum Fuchs.'}),group,meter,h('div',{class:'learn-equation',text:current.a+(current.subtract?' − ':' + ')+current.b+' = ?'}));
    updateSnack();
    return {ready:()=>moved.size===current.b,bind(fn){onChange=fn;},waiting:current.subtract?'Gib dem Hasen zuerst seine Äpfel. Dann zählst du beim Fuchs.':'Lege zuerst die Äpfel zum Fuchs. Dann zählst du alle zusammen.',solve(){visual.classList.add('scene-solved');},hint(){(moved.size<current.b?current.subtract?left:right:left).classList.add('needs-look');}};
  }
  function patternTrain(visual) {
    const gap=h('span',{class:'learn-wagon learn-pattern-gap','aria-label':'Hier fehlt eine Form',text:'?'});
    const wagons=current.sequence.map(token=>h('span',{class:'learn-wagon'},FK.play.picture(token)));
    const train=h('div',{class:'learn-train learn-pattern-train','aria-label':'Muster',style:{'--pattern-count':current.sequence.length+1}},h('span',{class:'learn-engine'},FK.play.picture('🚂')),wagons,gap);
    visual.append(train,h('p',{class:'play-instruction',text:'Ziehe das passende Bild in den letzten Wagen. Oder tippe es an.'}));
    return {target:gap,solve(value){gap.replaceChildren(FK.play.picture(value));gap.classList.add('filled');train.classList.add('train-departs');},hint(){const period=[1,2,3].find(p=>current.sequence.every((v,i)=>v===current.sequence[i%p]))||3;wagons.forEach((wagon,i)=>wagon.classList.toggle('pattern-group',i<period));}};
  }
  function natureInvestigation(visual) {
    const cue=FK.play.natureCue(current.cue),target=cue.querySelector('.play-question');
    target.classList.add('learn-nature-target');target.setAttribute('aria-label','Hier kommt das passende Bild hin');
    visual.append(h('div',{class:'learn-nature-scene'},cue),h('p',{class:'play-instruction',text:'Welches Bild passt? Ziehe es zum Fragezeichen. Oder tippe es an.'}));
    return {target,solve(value){target.replaceChildren(FK.play.picture(value,value));target.classList.add('filled');visual.classList.add('scene-solved');},retry(){target.classList.remove('needs-look');},hint(){cue.firstElementChild.classList.add('needs-look');}};
  }
  function draw() {
    clearGestures();
    demonstrating = false;
    let options;
    if (forest) {
      const session = FK.forestState.getActivity(quest);
      if (session.finished) { finish(); return; }
      round = session.round;
      current = session.question || FK.learning.question(game.id, stage, round);
      options = session.choices || FK.shuffle(current.choices);
      if (!session.question || !session.choices) FK.forestState.question(current, options, quest);
      locked = session.answered;
    } else { current = FK.learning.question(game.id, stage, round); locked = false; options = FK.shuffle(current.choices); }
    body.replaceChildren();
    body.append(h('p', { class: 'learn-meta', text: 'Stufe ' + stage + ' · ' + FK.learning.stages[stage - 1] + ' · Aufgabe ' + (round + 1) + ' von 5' }),
      FK.woodland.progress(round),
      h('h2', { class: 'learn-prompt', text: forest ? 'Wie geht es weiter?' : current.prompt }));
    if (!forest) body.prepend(FK.play.context(game.id, current.prompt, round, stage));
    const visual = h('div', { class: 'learn-visual' });
    root.dataset.learnGame = forest ? 'forest' : game.id;
    let scene = {};
    if (!forest) {
      scene = game.id === 'count' ? countGarden(visual) : game.id === 'add' ? snackPicnic(visual) : game.id === 'pattern' ? patternTrain(visual) : natureInvestigation(visual);
    } else if (game.id === 'pattern') {
      visual.append(h('div', { class: 'learn-train', 'aria-label': 'Muster', style: { '--pattern-count': current.sequence.length + 1 } },
        current.sequence.map(s => h('span', { class: 'learn-wagon', 'aria-label': FK.woodland.patternName(s) }, FK.woodland.pattern(s))),
        h('span', { class: 'learn-wagon forest-live-gap', text: '', 'aria-label': 'Hier fehlt ein Bild' })));
    }
    body.append(visual);
    live = h('p', { class: 'learn-feedback', role: 'status', 'aria-live': 'polite', text: 'Tippe deine Antwort an.' });
    answers = h('div', { class: 'learn-answers' });
    options.forEach(value => {
      let b;
      const choose = () => {
        if (locked) return;
        if (value !== current.answer) {
          FK.sound.undo(); live.textContent = 'Versuche es nochmals. ' + current.hint;
          if (forest) FK.forestVoice.say('Schau noch einmal. Die kleine Gruppe wiederholt sich.');
          else { FK.play.attempt?.(false); scene.retry?.(value); FK.play.speak(current.hint); }
          b.classList.add('try-again'); return;
        }
        locked = true;
        answers.querySelectorAll('button').forEach(x => { x.disabled = true; });
        b.classList.add('correct');
        if (forest) { FK.forestState.answer(value, quest); FK.sound.right(); FK.forestVoice.say('Das passt! Tippe auf den Pfeil.'); }
        else { FK.play.attempt?.(true); scene.solve?.(value); FK.play.feedback(body, game.id === 'nature' ? current.hint : game.id === 'count' ? 'Danke! Jetzt wissen wir, wie viele kleine Gartenfreunde hier wohnen.' : game.id === 'add' ? 'Mmmh, danke! Mit dir ist unser Waldpicknick gerettet!' : 'Juhui, der Musterzug kann weiterfahren!', true); }
        live.textContent = game.id === 'nature' ? 'Bravo! ' + current.hint : 'Juhui! Das stimmt.';
        next.hidden = false;
      };
      b = button(String(value), choose, 'learn-answer');
      b.setAttribute('aria-label', forest ? FK.woodland.patternName(value) : String(value));
      b.dataset.answer = String(value);
      if (forest) b.replaceChildren(FK.woodland.pattern(value));
      else if (game.id === 'nature' || game.id === 'pattern') b.replaceChildren(FK.play.picture(value, value));
      if (!forest && scene.target) { b.classList.add('learn-movable'); dragTo(b,scene.target,choose); }
      if (locked) { b.disabled = true; if (value === current.answer) b.classList.add('correct'); }
      answers.append(b);
    });
    if (!forest && scene.ready) {
      const gate = () => {
        if (locked) return;
        const ready = scene.ready();
        answers.classList.toggle('learn-answers-waiting', !ready);
        answers.querySelectorAll('button').forEach(b => { b.disabled = !ready; });
        live.textContent = ready ? 'Jetzt wähle die passende Zahl.' : scene.waiting;
      };
      scene.bind(gate); gate();
    }
    next = button(round === 4 ? '⭐ Geschafft!' : 'Weiter →', () => {
      if (!locked) return;
      if (forest) { if (FK.forestState.advance(quest)) finish(); else draw(); }
      else { round++; if (round === 5) finish(); else draw(); }
    }, 'learn-next');
    if (forest) { next.replaceChildren(FK.forestArt.icon('arrow')); next.setAttribute('aria-label', round === 4 ? 'Zum Ergebnis' : 'Nächstes Muster'); }
    next.hidden = !locked;
    body.append(answers, live, next, button('💡 Tipp', () => { if (!forest) { FK.play.hint?.(); scene.hint?.(); } live.textContent = current.hint; FK.play.speak(current.hint); }, 'learn-hint'));
    if (forest) forestPrompt(); else { FK.play.speak(current.prompt); body.scrollTop = 0; }
  }
  function finish() {
    if (forest) {
      FK.forestActivity.finish(body, quest); return;
    }
    FK.play.finish(body, 'learn', game.id, stage, () => { round=0; draw(); });
  }

  FK.screen('learn', {
    build(element) {
      root = element;
      FK.play.bindTouch(root);
      bar = FK.ui.topbar({ title: 'Lernspiel', onBack: () => forest ? returnToForest() : FK.back() });
      title = bar.querySelector('.title'); controls = h('div', { class: 'forest-learning-controls', hidden: true });
      controls.append(h('button', { type: 'button', class: 'forest-button', 'aria-label': 'Aufgabe nochmals hören', onclick: forestPrompt }, FK.forestArt.icon('speaker')),
        h('button', { type: 'button', class: 'forest-button', 'aria-label': 'Beispiel nochmals zeigen', onclick: demonstrate }, FK.forestArt.icon('hand')));
      bar.append(controls); body = h('div', { class: 'learn-body scroll' }); root.append(bar, body);
    },
    enter(p) {
      forest = p.forest === true; quest = p.quest || FK.forestState.QUEST; demonstrating = false; root.classList.toggle('forest-activity', forest); controls.hidden = !forest;
      if (forest && FK.forestState.definition(quest)?.game !== 'pattern') { FK.go('forest'); return; }
      const back = bar.querySelector('.btn-back');
      back.replaceChildren(); back.insertAdjacentHTML('beforeend', forest ? '' : FK.icon('back'));
      back.setAttribute('aria-label', forest ? 'Zurück zum Biber' : 'Zurück');
      game = FK.learning.games.find(g => g.id === (forest ? 'pattern' : p.game)) || FK.learning.games[0];
      stage = forest ? 1 : FK.learning.stage(); round = 0; if (!forest) FK.play.begin?.(game.id, stage); title.textContent = forest ? 'Waldspiele' : game.title; if (forest) FK.forestActivity.prepare(root, quest);
      if (forest) {
        const session = FK.forestState.getActivity(quest) || FK.forestState.startActivity(quest);
        if (session?.finished) { finish(); return; }
        if (!session) { returnToForest(); return; }
        if (!FK.forestState.hasDemo(quest)) { demonstrate(); return; }
      }
      draw();
    },
    leave() { clearGestures(); FK.forestVoice.cancel(); locked = true; },
  });
})();
