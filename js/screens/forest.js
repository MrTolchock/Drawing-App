/* The Heart Tree: short quest arcs inside one growing woodland. */
(function () {
  'use strict';
  const FK = window.FK, h = FK.h, model = FK.forestState, art = FK.forestArt, voice = FK.forestVoice;
  let root, canvas, ui, overlay, goal, sound, bubble, hint, hitTargets, runtime, loading, active = false;
  let firstWalk = true, overlayKind = '', payoffTimer = 0, entry = 0;
  const button = (label, children, click, cls = '') => h('button', { type: 'button', class: 'forest-button ' + cls, 'aria-label': label,
    onclick: () => { FK.sound.tick(); click(); } }, ...(Array.isArray(children) ? children : [children]));

  function closeOverlay() {
    if (!overlayKind || overlayKind === 'welcome') return false;
    overlay.replaceChildren(); overlayKind = ''; runtime?.focus(null); runtime?.input(true);
    voice.cancel(); root.classList.remove('has-dialog'); updateHUD(); canvas.focus({ preventScroll: true }); return true;
  }
  function panel(kind, title, content, actions, narration) {
    overlay.replaceChildren(); overlayKind = kind; runtime.input(false);
    runtime.focus(kind === 'welcome' ? null : kind);
    root.classList.add('has-dialog');
    const replay = narration ? button('Nochmals hören', art.icon('speaker'), () => voice.say(narration), 'forest-dialog-replay') : null;
    const card = h('section', { class: 'forest-dialog forest-dialog-' + kind, role: 'dialog', 'aria-modal': 'true', 'aria-label': title },
      content, h('div', { class: 'forest-dialog-actions' }, actions, replay));
    overlay.append(card);
    if (narration) voice.say(narration);
    requestAnimationFrame(() => card.querySelector('button')?.focus({ preventScroll: true }));
    updateHUD();
  }
  function postpone() { closeOverlay(); voice.say('Ich bin hier, wenn du magst.'); }
  function showWelcome() {
    panel('welcome', 'Willkommen am Herzbaum',
      h('div', { class: 'forest-welcome-copy' }, art.character('fox'), h('div', {},
        h('p', { class: 'forest-eyebrow', text: 'Dein Waldabenteuer' }), h('h2', { text: 'Komm mit in den Wald.' }),
        h('p', { text: 'Kleine Abenteuer. Grosse Freundschaften.' }))),
      [button('Mit dem Fuchs losgehen', [art.icon('paw'), art.icon('play'), h('span', { text: 'Komm mit' })], () => {
        model.welcome(); overlay.replaceChildren(); overlayKind = ''; root.classList.remove('has-dialog');
        runtime.input(true); firstWalk = true; updateHUD(); voice.say('Hallo! Komm mit. Tippe auf den Weg.');
      }, 'forest-primary forest-start')]);
  }
  function showBeaver() {
    model.visit('beaver');
    const state = model.get();
    if (state.bridgeRepaired) {
      panel('beaver', 'Die Brücke ist fertig', h('div', { class: 'forest-request-copy' }, art.character('beaver'),
        h('div', {}, h('h2', { text: 'Der Weg ist frei!' }), h('p', { text: 'Jetzt können wir uns wieder besuchen.' })), art.bridge(true)),
        [button('Zu Hase gehen', [art.character('hare'), art.icon('paw')], () => { closeOverlay(); runtime.walkToResident('hare'); }, 'forest-primary'),
          button('Weiter erkunden', art.icon('paw'), closeOverlay, 'forest-secondary')], 'Jetzt können wir uns wieder besuchen! Komm, wir gehen zum Hasen.');
      return;
    }
    panel('beaver', 'Eine Brücke für die Nachbarn', h('div', { class: 'forest-request-copy' }, art.character('beaver'),
      h('div', {}, h('p', { class: 'forest-eyebrow', text: 'Biber braucht deine Hilfe' }), h('h2', { text: 'Eine Brücke für uns.' }),
        h('p', { text: state.accepted ? 'Hilfst du mir weiter?' : 'Dann ist der Weg zum Garten wieder frei.' })), art.bridge(false)),
      [button(state.accepted ? 'Biber weiterhelfen' : 'Biber bei der Brücke helfen', [art.bridge(true), art.icon('play'), h('span', { text: state.accepted ? 'Weiterhelfen' : 'Ich helfe dir' })], () => {
        model.startActivity(); FK.go('learn', { game: 'pattern', stage: 1, forest: true });
      }, 'forest-primary'), button('Zurück in den Wald', [art.icon('paw')], postpone, 'forest-secondary')],
      state.accepted ? 'Hilfst du mir weiter?' : 'Die Brücke ist noch nicht fertig. Hilfst du mir?');
  }
  function showHare() {
    model.visit('hare');
    const state = model.get();
    if (!state.bridgeRepaired) {
      panel('hare', 'Hase zeigt den Weg zum Biber', h('div', { class: 'forest-request-copy' }, art.character('hare'),
        h('div', {}, h('h2', { text: 'Hallo, kleiner Fuchs!' }), h('p', { text: 'Der Biber braucht Hilfe bei der Brücke.' })), art.bridge(false)),
        [button('Zum Biber gehen', [art.character('beaver'), art.icon('paw'), h('span', { text: 'Zum Biber' })], () => {
          closeOverlay(); runtime.walkToResident('beaver'); voice.say('Komm zum Biber.');
        }, 'forest-primary'), button('Weiter erkunden', art.icon('paw'), postpone, 'forest-secondary')],
        'Hallo! Der Biber braucht Hilfe bei der Brücke. Komm zum Biber.');
    } else {
      model.greet();
      panel('hare', 'Schön, dass du da bist', h('div', { class: 'forest-request-copy' }, art.character('hare'),
        h('div', {}, h('p', { class: 'forest-eyebrow', text: 'Ein neuer Weg. Neue Freunde.' }), h('h2', { text: 'Schön, dass du da bist!' }),
          h('p', { text: 'Hinter meinem Garten wartet der Igel auf dich.' })), art.bridge(true)),
        [button('Zum Igel gehen', [art.character('hedgehog'), art.icon('paw'), h('span', { text: 'Zum Igel' })], () => { closeOverlay(); runtime.walkToResident('hedgehog'); }, 'forest-primary'),
          button('Im Wald weitergehen', art.icon('paw'), closeOverlay, 'forest-secondary')],
        'Schön, dass du da bist! Jetzt können wir uns wieder besuchen. Hinter meinem Garten wartet der Igel auf dich.');
    }
  }
  function showHedgehog() {
    if (!model.get().greetingSeen) return;
    model.visit('hedgehog');
    const complete = model.isComplete(model.REST), started = !!model.getActivity(model.REST);
    if (complete) model.seePayoff(model.REST);
    panel('hedgehog', complete ? 'Ein Ruheplatz für den Igel' : 'Igel braucht deine Hilfe',
      h('div', { class: 'forest-request-copy' }, art.character('hedgehog'), h('div', {},
        h('p', { class: 'forest-eyebrow', text: complete ? 'Ein gemütlicher Platz' : 'Im Mooshain' }),
        h('h2', { text: complete ? 'Hier kann ich mich ausruhen.' : 'Hilfst du mir beim Einrichten?' }),
        h('p', { text: complete ? 'Danke, kleiner Fuchs. Komm mich bald wieder besuchen.' : 'Merken wir uns meine kleinen Waldschätze.' })), art.rest(complete)),
      complete ? [button('Zum Waldkauz gehen', [art.character('owl'), art.icon('paw')], () => { closeOverlay(); runtime.walkToResident('owl'); }, 'forest-primary'),
        button('Im Wald bleiben', art.icon('paw'), closeOverlay, 'forest-secondary')] :
        [button(started ? 'Igel weiterhelfen' : 'Igel beim Ruheplatz helfen', [art.rest(true), art.icon('play'), h('span', { text: started ? 'Weiterhelfen' : 'Ich helfe dir' })], () => {
          model.startActivity(model.REST); FK.go('forest-memory');
        }, 'forest-primary'), button('Zurück in den Wald', art.icon('paw'), postpone, 'forest-secondary')],
      complete ? 'Danke! Hier kann ich mich ausruhen. Unter der alten Eiche wartet der Waldkauz auf dich.' :
        started ? 'Hilfst du mir weiter? Meine Waldschätze warten auf dich.' : 'Hilfst du mir? Merke dir meine Waldschätze. Dann richten wir meinen Ruheplatz ein.');
  }
  function showOwl() {
    if (!model.residentAvailable('owl')) return;
    model.visit('owl');
    const complete = model.isComplete(model.TRAIL), started = !!model.getActivity(model.TRAIL);
    if (complete) model.seePayoff(model.TRAIL);
    panel('owl', complete ? 'Der alte Wegweiser' : 'Ein Bild zeigt den Weg',
      h('div', { class: 'forest-request-copy' }, art.character('owl'), h('div', {},
        h('p', { class: 'forest-eyebrow', text: 'In der Geschichtenmulde' }),
        h('h2', { text: complete ? 'Das Herz zeigt nach Hause.' : 'Finden wir den Weg zusammen?' }),
        h('p', { text: complete ? 'Nun finden unsere Freunde wieder zum Herzbaum.' : 'Am alten Wegweiser fehlt das Bild.' })), art.sign(complete)),
      complete ? [button('Zum Herzbaum gehen', [art.sign(true), art.icon('paw')], () => { closeOverlay(); runtime.walkTo(model.nodes.home); }, 'forest-primary'),
        button('Im Wald bleiben', art.icon('paw'), closeOverlay, 'forest-secondary')] :
        [button(started ? 'Waldkauz weiterhelfen' : 'Waldkauz beim Wegweiser helfen', [art.sign(true), art.icon('play'), h('span', { text: started ? 'Weiterhelfen' : 'Ich helfe dir' })], () => {
          model.startActivity(model.TRAIL); FK.go('forest-trail');
        }, 'forest-primary'), button('Zurück in den Wald', art.icon('paw'), postpone, 'forest-secondary')],
      complete ? 'Danke! Das Herz auf dem Wegweiser zeigt wieder zum Herzbaum. Dort treffen sich unsere Freunde.' :
        started ? 'Gehen wir zusammen weiter? Der Wegweiser wartet auf uns.' : 'Hallo, kleiner Fuchs. Am Wegweiser fehlt das Bild. Hilfst du mir? Finde auf der Karte den Weg zu mir.');
  }
  function nextResident() {
    const state = model.get();
    if (!state.bridgeRepaired) return 'beaver';
    if (!state.greetingSeen) return 'hare';
    if (!model.isComplete(model.REST) || !state.payoffsSeen[model.REST]) return 'hedgehog';
    if (!model.isComplete(model.TRAIL) || !state.payoffsSeen[model.TRAIL]) return 'owl';
    return null;
  }
  function updateHUD() {
    if (!runtime || !active) return;
    const state = model.get(); root.dataset.bridge = state.bridgeRepaired ? 'repaired' : 'unfinished';
    root.dataset.rest = model.isComplete(model.REST) ? 'ready' : 'unfinished';
    root.dataset.sign = model.isComplete(model.TRAIL) ? 'ready' : 'unfinished';
    const hidden = !!overlayKind; goal.hidden = hidden; hint.hidden = hidden || !firstWalk;
    ui.querySelector('.forest-footer').hidden = hidden;
    const finished = state.bridgeRepaired;
    goal.replaceChildren();
    if (!nextResident()) {
      goal.append(art.icon('book'), h('span', {}, h('small', { text: 'Dein nächstes Abenteuer' }), h('b', { text: 'Das Spielebuch' })), art.icon('arrow'));
      goal.setAttribute('aria-label', 'Spielebuch öffnen');
    } else if (nextResident() === 'owl') {
      goal.append(art.character('owl'), h('span', {}, h('small', { text: 'Unter der alten Eiche' }), h('b', { text: 'Der alte Wegweiser' })), art.sign(model.isComplete(model.TRAIL)));
      goal.setAttribute('aria-label', 'Zum Waldkauz gehen');
    } else if (finished && state.greetingSeen) {
      goal.append(art.character('hedgehog'), h('span', {}, h('small', { text: 'Hinter dem Garten' }), h('b', { text: 'Ein Platz zum Ausruhen' })), art.rest(model.isComplete(model.REST)));
      goal.setAttribute('aria-label', 'Zum Igel gehen');
    } else {
      goal.append(art.character(finished ? 'hare' : 'beaver'),
        h('span', {}, h('small', { text: finished ? 'Der Weg ist frei' : state.accepted ? 'Wir helfen weiter' : 'Ein Nachbar wartet' }),
          h('b', { text: finished ? 'Zum Hasengarten' : 'Die kleine Brücke' })), art.bridge(finished));
      goal.setAttribute('aria-label', finished ? 'Zu Hase gehen' : 'Zum Biber gehen');
    }
    sound.replaceChildren(art.icon(FK.settings.get('sound') === false ? 'muted' : 'speaker'));
    sound.setAttribute('aria-label', FK.settings.get('sound') === false ? 'Ton einschalten' : 'Ton ausschalten');
    sound.setAttribute('aria-pressed', String(FK.settings.get('sound') !== false));
  }
  function updateProjection(points) {
    if (!active) return;
    for (const id of Object.keys(model.residents)) {
      const p = points[id], target = hitTargets[id];
      target.hidden = !p.visible || !!overlayKind;
      target.style.transform = `translate(${p.x - 42}px, ${p.y - 43}px)`;
    }
    const beaver = points.beaver;
    bubble.hidden = !!overlayKind || model.get().bridgeRepaired || !beaver.visible || model.distance(runtime.position, model.residents.beaver) > 12;
    bubble.style.transform = `translate(${beaver.x - 31}px, ${beaver.y - 112}px)`;
    if (firstWalk && points.spot) hint.style.transform = `translate(${points.spot.x - 34}px, ${points.spot.y - 36}px)`;
  }
  async function ensureScene() {
    if (runtime) return runtime;
    if (!loading) loading = import('../forest/scene.js').then(module => {
      runtime = module.createForest(canvas, {
        onWalk() { if (firstWalk) { firstWalk = false; hint.hidden = true; } },
        onArrive(id) { if (!active) return; ({ beaver: showBeaver, hare: showHare, hedgehog: showHedgehog, owl: showOwl })[id]?.(); },
        onProject: updateProjection,
      });
      FK.forestScene = runtime; root.classList.add('forest-ready'); return runtime;
    }).catch(error => {
      console.warn('The woodland renderer could not start.', error);
      if (active) overlay.replaceChildren(h('section', { class: 'forest-dialog', role: 'status' },
        art.character('fox'), h('h2', { text: 'Dein Waldatelier wartet.' }),
        button('Spielebuch öffnen', [art.icon('book'), h('span', { text: 'Zu den Spielen' })], () => FK.go('hub'), 'forest-primary')));
      loading = null; throw error;
    });
    return loading;
  }
  FK.screen('forest', {
    build(element) {
      root = element; root.classList.add('forest-loading');
      const viewport = h('div', { class: 'forest-viewport' });
      canvas = h('canvas', { class: 'forest-canvas', tabindex: '0', role: 'application', 'aria-label': 'Wald: Tippe auf den Weg oder einen Nachbarn. Pfeiltasten bewegen den Fuchs.' }); viewport.append(canvas); root.append(viewport);
      ui = h('div', { class: 'forest-ui' });
      sound = button('Ton ausschalten', art.icon('speaker'), () => { FK.settings.set('sound', FK.settings.get('sound') === false); updateHUD(); if (FK.settings.get('sound')) voice.say('Komm mit in den Wald.'); }, 'forest-round');
      const book = button('Spielebuch öffnen', art.icon('book'), () => FK.go('hub'), 'forest-round forest-book');
      ui.append(h('header', { class: 'forest-header' }, h('div', { class: 'forest-heading' },
        h('p', { class: 'forest-eyebrow', text: 'Farbtupf' }), h('h1', { text: 'Der Herzbaum' })), h('nav', { 'aria-label': 'Wald und Spiele' }, book, sound)));
      hitTargets = {};
      for (const [id, name] of Object.entries({ beaver: 'Biber', hare: 'Hase', hedgehog: 'Igel', owl: 'Waldkauz' })) {
        const b = button(name + ' besuchen', [], () => runtime?.walkToResident(id), 'forest-npc-target');
        b.hidden = true; hitTargets[id] = b; ui.append(b);
      }
      bubble = button('Biber bei der Brücke helfen', art.bridge(false), () => runtime?.walkToResident('beaver'), 'forest-bubble'); bubble.hidden = true; ui.append(bubble);
      hint = button('Hier auf den Weg tippen', [art.icon('paw'), art.icon('hand')], () => runtime?.walkTo({ x: -12.0, z: 5.0 }), 'forest-walk-hint'); hint.hidden = true; ui.append(hint);
      goal = button('Zum Biber gehen', [], () => {
        if (!runtime || overlayKind) return;
        const id = nextResident();
        if (id) runtime.walkToResident(id); else FK.go('hub');
      }, 'forest-goal'); goal.hidden = true;
      const repeat = button('Nochmals hören', art.icon('speaker'), () => voice.repeat(), 'forest-round forest-repeat');
      ui.append(h('footer', { class: 'forest-footer' }, goal, repeat));
      overlay = h('div', { class: 'forest-overlay' }); ui.append(overlay); root.append(ui);
      FK.on('settings', e => { if (e.key === 'sound') updateHUD(); });
      root.addEventListener('keydown', event => {
        if (!overlayKind || event.key !== 'Tab') return;
        const buttons = [...overlay.querySelectorAll('button')]; if (!buttons.length) return;
        const index = buttons.indexOf(document.activeElement);
        if (event.shiftKey && index <= 0) { event.preventDefault(); buttons.at(-1).focus(); }
        else if (!event.shiftKey && index === buttons.length - 1) { event.preventDefault(); buttons[0].focus(); }
      });
      FK.forestScreen = { closeOverlay };
    },
    async enter(params) {
      active = true; const token = ++entry; overlayKind = ''; overlay.replaceChildren(); root.classList.remove('has-dialog');
      for (const [id, def] of Object.entries(model.quests)) {
        const a = model.getActivity(id), group = { pattern: 'learn', treasure: 'expedition', robot: 'adventure' }[def.game], key = def.game + ':' + def.stage;
        if (a?.finished && !a.rewardRecorded) {
          if (!FK.progress.isDone(group, key)) FK.progress.finish(group, key, 1);
          model.rewardRecorded(id);
        }
      }
      try { await ensureScene(); } catch (_) { return; }
      if (!active || token !== entry) return;
      runtime.input(true); runtime.focus(null); runtime.start(); root.classList.remove('forest-loading');
      if (!model.get().welcomed) { firstWalk = true; showWelcome(); }
      else {
        firstWalk = false; updateHUD();
        if (model.get().bridgeRepaired && !model.get().payoffSeen) {
          runtime.repair(); runtime.focus('beaver'); voice.say('Jetzt ist der Weg frei. Komm herüber!');
          payoffTimer = setTimeout(() => { if (active && token === entry) { model.seePayoff(); runtime.focus(null); updateHUD(); } }, 1700);
        } else if (model.isComplete(model.REST) && !model.get().payoffsSeen[model.REST]) {
          runtime.focus('hedgehog');
          payoffTimer = setTimeout(() => { if (active && token === entry) showHedgehog(); }, 700);
        } else if (model.isComplete(model.TRAIL) && !model.get().payoffsSeen[model.TRAIL]) {
          runtime.focus('owl');
          payoffTimer = setTimeout(() => { if (active && token === entry) showOwl(); }, 700);
        } else if (params.returned) voice.say('Ich bin hier, wenn du magst.');
      }
    },
    leave() {
      active = false; ++entry; clearTimeout(payoffTimer); runtime?.stop(); voice.cancel();
      overlayKind = ''; overlay.replaceChildren(); root.classList.remove('has-dialog');
    },
  });
})();
