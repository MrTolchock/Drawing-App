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
  function draw() {
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
    if (!forest) body.prepend(FK.play.context(game.id, current.prompt, round));
    const visual = h('div', { class: 'learn-visual' });
    if (game.id === 'count') {
      const field = h('div', { class: 'learn-frame' });
      const size = [5, 10, 20][stage - 1];
      for (let i = 0; i < size; i++) {
        const cell = h('div', { class: 'learn-cell' });
        if (i < current.count) {
          const b = button('🐞', () => { b.classList.toggle('counted'); b.setAttribute('aria-pressed', String(b.classList.contains('counted'))); FK.sound.tick(); }, 'learn-bug');
          b.setAttribute('aria-label', 'Käfer ' + (i + 1)); b.setAttribute('aria-pressed', 'false'); cell.append(b);
        }
        field.append(cell);
      }
      visual.append(h('div', {class:'play-garden', 'aria-label':current.count === 0 ? 'Ein Garten ohne Marienkäfer' : 'Marienkäfer im Garten'}, field), h('p',{class:'play-instruction',text:current.count === 0 ? 'Schau genau: Ist ein Käfer da?' : 'Tippe jeden Käfer an. Zähle mit.'}));
    } else if (game.id === 'add') {
      if (current.known) visual.append(h('div',{class:'play-known'},h('small',{text:current.known.rule==='swap'?'Tauschfreunde: Die Mengen wechseln den Platz.':'Ein Apfel mehr als vorher.'}),h('b',{text:current.known.a+' + '+current.known.b+' = '+current.known.answer})));
      const left=h('div',{class:'play-snack-bowl','aria-label':'Äpfel beim Fuchs'}),right=h('div',{class:'play-snack-bowl','aria-label':current.subtract?'Äpfel beim Hasen':'Äpfel zum Dazulegen'});
      const moved=new Set(), meter=h('p',{class:'play-instruction',role:'status'});
      function updateSnack() {
        meter.textContent=current.subtract ? moved.size+' von '+current.b+' Äpfeln weitergegeben' : moved.size+' von '+current.b+' Äpfeln dazugelegt';
      }
      if(current.subtract) {
        for(let i=0;i<current.a;i++) {
          const apple=button('',()=>{
            if(locked)return;
            if(moved.has(i)){moved.delete(i);left.append(apple);}else if(moved.size<current.b){moved.add(i);right.append(apple);}else return;
            apple.setAttribute('aria-pressed',String(moved.has(i)));FK.ui.bounce(apple);updateSnack();FK.sound.tick();
          },'play-snack-apple');
          apple.append(FK.visual.art('apple'));apple.setAttribute('aria-label','Apfel '+(i+1)+' weitergeben oder zurücknehmen');apple.setAttribute('aria-pressed','false');left.append(apple);
        }
      } else {
        for(let i=0;i<current.a;i++) left.append(h('span',{class:'play-snack-apple fixed'},FK.visual.art('apple')));
        for(let i=0;i<current.b;i++) {
          const apple=button('',()=>{
            if(locked)return;
            if(moved.has(i)){moved.delete(i);right.append(apple);}else{moved.add(i);left.append(apple);}
            apple.setAttribute('aria-pressed',String(moved.has(i)));FK.ui.bounce(apple);updateSnack();FK.sound.tick();
          },'play-snack-apple');
          apple.append(FK.visual.art('apple'));apple.setAttribute('aria-label','Apfel '+(i+1)+' dazulegen oder zurücknehmen');apple.setAttribute('aria-pressed','false');right.append(apple);
        }
      }
      const group=h('div',{class:'play-snack-table'},h('section',{},FK.forestArt.character('fox'),left),h('b',{text:current.subtract?'→':'+'}),h('section',{},current.subtract?FK.forestArt.character('hare'):FK.forestArt.icon('basket'),right));
      visual.append(h('p',{class:'play-instruction',text:current.subtract?'Gib dem Hasen '+current.b+' Äpfel. Tippe die Äpfel an.':'Tippe die Äpfel im Korb an. Lege sie zum Znüni dazu.'}),group,meter,
        h('div',{class:'learn-equation',text:current.a+(current.subtract?' − ':' + ')+current.b+' = ?'}));
      updateSnack();
    } else if (game.id === 'pattern') {
      visual.append(h('div', { class: 'learn-train', 'aria-label': 'Muster', style: { '--pattern-count': current.sequence.length + 1 } },
        forest ? null : h('span', { text: '🚂' }), current.sequence.map(s => forest ? h('span', { class: 'learn-wagon', 'aria-label': FK.woodland.patternName(s) }, FK.woodland.pattern(s)) : h('span', { class: 'learn-wagon', text: s })),
        h('span', { class: 'learn-wagon' + (forest ? ' forest-live-gap' : ''), text: forest ? '' : '?', 'aria-label': forest ? 'Hier fehlt ein Bild' : 'Hier fehlt eine Form' })));
    } else visual.append(FK.play.natureCue(current.cue), h('p',{class:'play-instruction',text:'Welches Bild passt?'}));
    body.append(visual);
    live = h('p', { class: 'learn-feedback', role: 'status', 'aria-live': 'polite', text: 'Tippe deine Antwort an.' });
    answers = h('div', { class: 'learn-answers' });
    options.forEach(value => {
      const b = button(String(value), () => {
        if (locked) return;
        if (value !== current.answer) {
          FK.sound.undo(); live.textContent = 'Versuche es nochmals. ' + current.hint;
          if (forest) FK.forestVoice.say('Schau noch einmal. Die kleine Gruppe wiederholt sich.');
          else FK.play.speak(current.hint);
          b.classList.add('try-again'); return;
        }
        locked = true;
        answers.querySelectorAll('button').forEach(x => { x.disabled = true; });
        b.classList.add('correct');
        if (forest) { FK.forestState.answer(value, quest); FK.sound.right(); FK.forestVoice.say('Das passt! Tippe auf den Pfeil.'); }
        else FK.play.feedback(body, game.id === 'nature' ? current.hint : 'Juhui! Das passt.', true);
        live.textContent = game.id === 'nature' ? 'Bravo! ' + current.hint : 'Juhui! Das stimmt.';
        next.hidden = false;
      }, 'learn-answer');
      b.setAttribute('aria-label', forest ? FK.woodland.patternName(value) : String(value));
      b.dataset.answer = String(value);
      if (forest) b.replaceChildren(FK.woodland.pattern(value));
      else if (game.id === 'nature') b.replaceChildren(FK.play.picture(value, value));
      if (locked) { b.disabled = true; if (value === current.answer) b.classList.add('correct'); }
      answers.append(b);
    });
    next = button(round === 4 ? '⭐ Geschafft!' : 'Weiter →', () => {
      if (!locked) return;
      if (forest) { if (FK.forestState.advance(quest)) finish(); else draw(); }
      else { round++; if (round === 5) finish(); else draw(); }
    }, 'learn-next');
    if (forest) { next.replaceChildren(FK.forestArt.icon('arrow')); next.setAttribute('aria-label', round === 4 ? 'Zum Ergebnis' : 'Nächstes Muster'); }
    next.hidden = !locked;
    body.append(answers, live, next, button('💡 Tipp', () => { live.textContent = current.hint; FK.play.speak(current.hint); }, 'learn-hint'));
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
      root = element; bar = FK.ui.topbar({ title: 'Lernspiel', onBack: () => forest ? returnToForest() : FK.back() });
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
      stage = forest ? 1 : FK.learning.stage(); round = 0; title.textContent = forest ? 'Waldspiele' : game.title; if (forest) FK.forestActivity.prepare(root, quest);
      if (forest) {
        const session = FK.forestState.getActivity(quest) || FK.forestState.startActivity(quest);
        if (session?.finished) { finish(); return; }
        if (!session) { returnToForest(); return; }
        if (!FK.forestState.hasDemo(quest)) { demonstrate(); return; }
      }
      draw();
    },
    leave() { FK.forestVoice.cancel(); locked = true; },
  });
})();
