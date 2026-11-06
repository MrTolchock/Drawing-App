/* The Heart Tree: short quest arcs inside one growing woodland. */
(function () {
  'use strict';
  const FK = window.FK, h = FK.h, model = FK.forestState, art = FK.forestArt, voice = FK.forestVoice;
  let root, canvas, ui, overlay, goal, sound, treeStatus, bubble, hint, hitTargets, runtime, loading, active = false;
  let firstWalk = true, overlayKind = '', payoffTimer = 0, entry = 0;
  const button = (label, children, click, cls = '') => h('button', { type: 'button', class: 'forest-button ' + cls, 'aria-label': label,
    onclick: () => { FK.sound.tick(); click(); } }, ...(Array.isArray(children) ? children : [children]));

  function closeOverlay() {
    if (!overlayKind || overlayKind === 'welcome') return false;
    runtime?.gather(false); runtime?.moment(null); runtime?.accompany(null); model.stopReplay();
    overlay.replaceChildren(); overlayKind = ''; runtime?.focus(null); runtime?.input(true);
    voice.cancel(); root.classList.remove('has-dialog'); updateHUD(); canvas.focus({ preventScroll: true }); return true;
  }
  function panel(kind, title, content, actions, narration) {
    overlay.replaceChildren(); overlayKind = kind; runtime.input(false);
    runtime.focus(kind === 'welcome' ? 'home' : kind);
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
  function projectChange(q, complete) {
    return h('div', { class: 'forest-project-change', 'aria-hidden': 'true' },
      h('span', { class: 'forest-project-before' }, art.project(q.picture, false)), art.icon('arrow'),
      h('span', { class: 'forest-project-after' }, art.project(q.picture, true)),
      complete ? h('span', { class: 'forest-project-friends' }, art.character(q.resident), q.partner ? art.character(q.partner) : art.character('fox')) : null);
  }
  function showWelcome() {
    panel('welcome', 'Willkommen am Herzbaum',
      h('div', { class: 'forest-welcome-copy' }, art.character('fox'), h('div', {},
        h('p', { class: 'forest-eyebrow', text: 'Dein Waldabenteuer' }), h('h2', { text: 'Wecken wir den Herzbaum.' }),
        h('p', { text: 'Er hat alle Blätter verloren. Hilf den Freunden – und er wird wieder grün.' }), FK.heartTree.picture(0))),
      [button('Mit dem Fuchs losgehen', [art.icon('paw'), art.icon('play'), h('span', { text: 'Komm mit' })], () => {
        model.welcome(); overlay.replaceChildren(); overlayKind = ''; root.classList.remove('has-dialog');
        runtime.focus(null); runtime.input(true); firstWalk = true; updateHUD(); voice.say('Komm! Der Biber vermisst seinen Freund, den Hasen. Helfen wir ihm bei der Brücke. Tippe auf den Weg.');
      }, 'forest-primary forest-start')], 'Oh, schau! Unser Herzbaum hat alle Blätter verloren. Früher haben sich hier alle Freunde getroffen. Jetzt sind ihre Wege kaputt und sie vermissen einander. Hilfst du ihnen? Mit jeder Hilfe wird ein Ast wieder grün. Komm mit zum Biber!');
  }
  function showBeaver() {
    model.visit('beaver');
    const state = model.get();
    if (state.bridgeRepaired) {
      model.seePayoff();
      runtime.moment(model.quests[model.QUEST]);
      panel('beaver', 'Die Brücke ist fertig', h('div', { class: 'forest-request-copy' }, art.character('beaver'),
        h('div', {}, h('h2', { text: 'Du hast uns wieder zusammengebracht!' }), h('p', { text: 'Oh, danke, danke! Komm, wir gehen zusammen zu Hase!' })), projectChange(model.quests[model.QUEST], true)),
        [button('Zu Hase gehen', [art.character('beaver'), art.character('hare'), art.icon('paw')], () => travel({ kind: 'visit', resident: 'hare', quest: model.QUEST }, 'beaver'), 'forest-primary'),
          button('Weiter erkunden', art.icon('paw'), closeOverlay, 'forest-secondary')], 'Oh, danke, danke! Die Brücke hält! Endlich kann ich meinen alten Freund Hase wiedersehen. Ich habe ihn so vermisst! Schau, am Herzbaum wachsen die ersten Blätter. Du hast das geschafft! Komm, wir besuchen Hase.');
      return;
    }
    panel('beaver', 'Eine Brücke für die Nachbarn', h('div', { class: 'forest-request-copy' }, art.character('beaver'),
      h('div', {}, h('p', { class: 'forest-eyebrow', text: 'Biber braucht deine Hilfe' }), h('h2', { text: 'Eine Brücke für uns.' }),
        h('p', { text: state.accepted ? 'Hilfst du mir weiter?' : 'Dann ist der Weg zum Garten wieder frei.' })), projectChange(model.quests[model.QUEST], false)),
      [button(state.accepted ? 'Biber weiterhelfen' : 'Biber bei der Brücke helfen', [art.bridge(true), art.icon('play'), h('span', { text: state.accepted ? 'Weiterhelfen' : 'Ich helfe dir' })], () => {
        model.startActivity(); FK.go('learn', { game: 'pattern', stage: 1, forest: true });
      }, 'forest-primary'), button('Zurück in den Wald', [art.icon('paw')], postpone, 'forest-secondary')],
      state.accepted ? 'Hilfst du mir weiter?' : 'Ach, mein Freund Hase ist dort drüben. Wir haben uns so lange nicht gesehen! In der Brücke fehlen Bretter. Hilfst du mir, sie einzusetzen? Dann können wir endlich wieder zusammen sein.');
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
          h('p', { text: 'Ich habe den Biber so vermisst! Jetzt können wir wieder zusammen durch den Garten hüpfen.' })), art.bridge(true)),
        [button('Zum Igel gehen', [art.character('hedgehog'), art.icon('paw'), h('span', { text: 'Zum Igel' })], () => { closeOverlay(); runtime.walkToResident('hedgehog'); }, 'forest-primary'),
          button('Im Wald weitergehen', art.icon('paw'), closeOverlay, 'forest-secondary')],
        'Biber! Da bist du ja! Oh, wie schön! Danke, kleiner Fuchs. Wegen dir sind wir wieder zusammen. Hör mal: Hinter meinem Garten raschelt es. Der Igel braucht auch einen Freund. Gehen wir zu ihm!');
    }
  }
  function travel(target, companion) {
    closeOverlay();
    if (target.kind === 'free') { FK.go('forest-book'); return; }
    if (companion && companion !== target.resident) { runtime.accompany(companion); voice.say('Komm, ich begleite dich!'); }
    if (target.resident === 'home') runtime.walkTo(model.nodes.home, 'home'); else runtime.walkToResident(target.resident);
  }
  function onward(target = model.objective(), companion) {
    const home = target.resident === 'home', name = home ? 'Herzbaum' : FK.forestActivity.dative[target.resident];
    return button(target.kind === 'free' ? 'Waldspiele öffnen' : 'Zum ' + name + ' gehen',
      [target.kind === 'free' ? art.icon('book') : art.character(target.resident), art.icon(target.kind === 'free' ? 'play' : 'paw')], () => travel(target, companion), 'forest-primary');
  }
  function showQuest(q, visiting = q.resident) {
    model.visit(visiting);
    if (visiting !== q.resident) {
      panel(visiting, q.title, h('div', { class: 'forest-request-copy' }, art.character(visiting), h('div', {},
        h('h2', { text: 'Helfen wir zusammen.' }), h('p', { text: q.title })), art.character(q.resident)),
        [onward({ kind: 'visit', resident: q.resident, quest: q.id }), button('Im Wald bleiben', art.icon('paw'), closeOverlay, 'forest-secondary')],
        'Bei unserem Freund wartet ein kleines Abenteuer. Komm mit.'); return;
    }
    const complete = model.isComplete(q.id), started = !!model.getActivity(q.id);
    if (complete) { model.seePayoff(q.id); runtime.moment(q); }
    const copy = h('div', { class: 'forest-request-copy' }, art.character(q.resident), h('div', {},
      h('p', { class: 'forest-eyebrow', text: FK.forestStory.placeNames[q.resident] }),
      h('h2', { text: complete ? 'Oh, wie schön! Danke dir!' : q.title }),
      h('p', { text: complete ? q.result : started ? 'Hilfst du mir weiter?' : 'Ein kleines Abenteuer für uns.' })), projectChange(q, complete));
    panel(q.resident, q.title, copy,
      complete ? [onward(model.objective(), q.resident), button('Im Wald bleiben', art.icon('paw'), closeOverlay, 'forest-secondary')] :
        [button(started ? FK.forestStory.names[q.resident] + ' weiterhelfen' : FK.forestStory.names[q.resident] + ' helfen',
          [art.project(q.picture, true), art.icon('play'), h('span', { text: started ? 'Weiterhelfen' : 'Ich helfe dir' })], () => FK.forestActivity.launch(q.id), 'forest-primary'),
          button('Zurück in den Wald', art.icon('paw'), postpone, 'forest-secondary')], complete ? q.result : started ? 'Hilfst du mir weiter?' : q.request);
  }
  function showResident(id) {
    if (!model.residentAvailable(id)) return;
    if (id === 'beaver' && !model.get().bridgeRepaired) { showBeaver(); return; }
    if (id === 'hare' && (!model.get().bridgeRepaired || !model.get().greetingSeen)) { showHare(); return; }
    const q = model.questForResident(id); if (q) { showQuest(q, id); return; }
    model.visit(id);
    const free = model.objective().kind === 'free';
    panel(id, 'Schön, dass du da bist', h('div', { class: 'forest-request-copy' }, art.character(id),
      h('div', {}, h('h2', { text: 'Schön, dass du da bist!' }), h('p', { text: 'Hier ist immer ein Platz für dich.' })), art.icon('paw')),
      [free ? button('Waldspiele mit ' + FK.forestStory.names[id], [art.character(id), art.icon('book')], () => FK.go('forest-book', { resident: id }), 'forest-primary') : onward(),
        button('Im Wald bleiben', art.icon('paw'), closeOverlay, 'forest-secondary')],
      free ? 'Schön, dass du da bist. Möchtest du mit mir ein Waldspiel spielen?' : 'Schön, dass du da bist. Unsere Freunde freuen sich auf dich.');
  }
  function showEnding() {
    if (!model.beginEnding()) return;
    runtime.gather(true);
    const page = model.get().endingPage;
    const pages = [
      { title: 'Ein Weg zu unseren Freunden.', pictures: ['bridge', 'rest', 'sign'], voice: 'Erinnerst du dich? Du hast die Brücke repariert, einen Ruheplatz eingerichtet und das Bild am Wegweiser erneuert.' },
      { title: 'Nun finden wir zueinander.', pictures: ['water', 'path', 'stories'], voice: 'Am Wasser ist Platz zum Schauen und Erzählen. Die neuen Wege verbinden unsere Freunde.' },
      { title: 'Ein Platz für alle.', pictures: ['clearing', 'bench', 'invitation'], voice: 'Die Lichtung ist wieder ein Treffpunkt. Alle haben einen gemütlichen Platz. Und alle sind eingeladen.' },
      { title: 'Wir sind wieder zusammen.', pictures: ['tree'], voice: 'Schau! Alle Freunde sind am Herzbaum. Seine Blätter leuchten wieder. Danke, kleiner Fuchs. Du gehörst dazu. Der Wald bleibt für deine nächsten Abenteuer offen.' },
    ];
    const part = pages[page];
    panel('home', part.title, h('div', { class: 'forest-chapter-copy' },
      h('div', { class: 'forest-ending-memories' }, part.pictures.map(id => art.project(id, true))),
      h('h2', { text: part.title }), h('div', { class: 'forest-friends-row' }, Object.keys(model.residents).map(id => art.character(id)))),
      [button(page === 3 ? 'Im Wald weiterspielen' : 'Geschichte weiter', [art.icon(page === 3 ? 'paw' : 'arrow'), h('span', { text: page === 3 ? 'Weiter im Wald' : 'Weiter' })], () => {
        if (model.endingNext()) { closeOverlay(); voice.say('Besuche deine Freunde. Im Buch warten noch mehr Waldspiele.'); } else showEnding();
      }, 'forest-primary')], part.voice);
    root.dataset.endingPage = String(page);
  }
  function showTree() {
    const target = model.objective(), state = model.get();
    if (target.kind === 'ending' || (state.endingUnlocked && !state.endingSeen)) { showEnding(); return; }
    if (target.kind === 'chapter') {
      const reconnect = target.chapter === 'reconnect';
      panel('home', reconnect ? 'Unsere Wege verbinden sich' : 'Ein Treffen für alle', h('div', { class: 'forest-chapter-copy' },
        art.project('tree', true), h('h2', { text: reconnect ? 'Unsere Wege verbinden sich.' : 'Ein Treffen für alle.' }),
        h('div', { class: 'forest-ending-memories' }, (reconnect ? ['path', 'stories', 'clearing'] : ['bench', 'invitation']).map(id => art.project(id, true)))),
        [button('Gemeinsam weitergehen', [art.icon('play'), h('span', { text: 'Komm mit' })], () => {
          model.acknowledgeChapter(target.chapter); closeOverlay(); voice.say('Unsere Freunde warten auf dich.');
        }, 'forest-primary')], reconnect ? 'Du kennst jetzt alle Nachbarn. Machen wir die Wege zueinander frei und unseren Treffpunkt wieder einladend.' :
          'Unsere Wege verbinden uns wieder. Jetzt machen wir am Herzbaum einen Platz für alle und laden unsere Freunde ein.'); return;
    }
    panel('home', 'Der Herzbaum', h('div', { class: 'forest-chapter-copy' }, art.project('tree', state.endingSeen),
      h('h2', { text: state.endingSeen ? 'Hier gehören wir zusammen.' : FK.heartTree.count() ? 'Er wird wieder lebendig!' : 'Unser Herzbaum braucht Freunde.' }),
      h('p',{text:FK.heartTree.count()+' von 9 Ästen sind wieder grün. Jede Hilfe lässt ihn weiterwachsen.'}),
      h('div', { class: 'forest-friends-row' }, Object.keys(model.residents).filter(model.residentAvailable).map(id => art.character(id)))),
      state.endingSeen ? [button('Das Treffen nochmals anschauen', [art.project('tree', true), art.icon('play')], () => { model.beginEnding(true); showEnding(); }, 'forest-primary'),
        button('Waldspiele öffnen', art.icon('book'), () => FK.go('forest-book'), 'forest-secondary'), button('Im Wald bleiben', art.icon('paw'), closeOverlay, 'forest-secondary')] :
        [onward(target), button('Im Wald bleiben', art.icon('paw'), closeOverlay, 'forest-secondary')],
      state.endingSeen ? 'Der Wald ist wieder ein Treffpunkt. Möchtest du unser Treffen nochmals anschauen oder weiter im Wald spielen?' : 'Dieser Baum war einmal voller Blätter. Hier haben alle Freunde gespielt. Jetzt ist er kahl. Aber jede Hilfe bringt ein Stück Leben zurück. Schau, '+FK.heartTree.count()+' von neun Ästen sind wieder grün. Komm, unsere Freunde brauchen uns.');
  }
  function updateHUD() {
    if (!runtime || !active) return;
    const state = model.get(), target = model.objective(), q = model.quests[target.quest];
    root.dataset.bridge = state.bridgeRepaired ? 'repaired' : 'unfinished'; root.dataset.rest = model.isComplete(model.REST) ? 'ready' : 'unfinished'; root.dataset.sign = model.isComplete(model.TRAIL) ? 'ready' : 'unfinished';
    root.dataset.ending = state.endingSeen ? 'seen' : state.endingUnlocked ? 'ready' : 'waiting';
    const growth=FK.heartTree.count(state);
    treeStatus.replaceChildren(FK.heartTree.picture(growth),h('span',{text:growth+' / 9'}));
    treeStatus.setAttribute('aria-label','Herzbaum besuchen: '+growth+' von 9 Ästen grün');
    root.dataset.treeGrowth=String(growth);
    for (const [id, targetButton] of Object.entries(hitTargets)) {
      const current = target.resident === id && target.kind !== 'free';
      targetButton.classList.toggle('is-current', current);
      targetButton.setAttribute('aria-description', current ? 'Hier wartet dein nächstes Waldabenteuer.' : 'Gehe zu diesem Freund.');
    }
    const hidden = !!overlayKind; goal.hidden = hidden; hint.hidden = hidden || !firstWalk; ui.querySelector('.forest-footer').hidden = hidden;
    goal.replaceChildren();
    if (target.kind === 'free') { goal.append(art.icon('book'), h('span', {}, h('small', { text: 'Gemeinsam weiterentdecken' }), h('b', { text: 'Waldspiele' })), art.icon('arrow')); goal.setAttribute('aria-label', 'Waldspiele öffnen'); }
    else {
      const home = target.resident === 'home';
      goal.append(art.character(target.resident), h('span', {}, h('small', { text: home ? 'Unsere Freunde kommen zusammen' : 'Ein Nachbar freut sich auf dich' }),
        h('b', { text: home ? 'Zum Herzbaum' : target.resident === 'hare' && !state.greetingSeen ? 'Zum Hasengarten' : q.title })), art.project(home ? 'tree' : q.picture, home || model.isComplete(q.id)));
      goal.setAttribute('aria-label', home ? 'Zum Herzbaum gehen' : target.resident === 'beaver' ? 'Zum Biber gehen' : target.resident === 'hare' ? 'Zu Hase gehen' : 'Zum ' + FK.forestActivity.dative[target.resident] + ' gehen');
    }
    sound.replaceChildren(art.icon(FK.settings.get('sound') === false ? 'muted' : 'speaker'));
    sound.setAttribute('aria-label', FK.settings.get('sound') === false ? 'Ton einschalten' : 'Ton ausschalten'); sound.setAttribute('aria-pressed', String(FK.settings.get('sound') !== false));
  }
  function updateProjection(points) {
    if (!active) return;
    for (const id of Object.keys(hitTargets)) {
      const p = points[id], target = hitTargets[id];
      target.hidden = !p.visible || !!overlayKind;
      target.style.transform = `translate(${p.x - 42}px, ${p.y - 43}px)`;
    }
    const objective = model.objective(), q = model.quests[objective.quest], friend = points[objective.resident];
    const bubbleKey = objective.resident + ':' + (q?.picture || 'tree') + ':' + (q && model.isComplete(q.id));
    if (bubble.dataset.project !== bubbleKey) {
      bubble.dataset.project = bubbleKey;
      bubble.replaceChildren(art.project(q?.picture || 'tree', q ? model.isComplete(q.id) : true));
      bubble.setAttribute('aria-label', objective.resident === 'home' ? 'Zum Herzbaum gehen' : FK.forestStory.names[objective.resident] + ' helfen');
    }
    bubble.hidden = !!overlayKind || objective.kind === 'free' || !friend?.visible;
    if (friend) bubble.style.transform = `translate(${friend.x - 31}px, ${friend.y - 112}px)`;
    if (firstWalk && points.spot) hint.style.transform = `translate(${points.spot.x - 34}px, ${points.spot.y - 36}px)`;
  }
  async function ensureScene() {
    if (runtime) return runtime;
    if (!loading) loading = import('../forest/scene.js').then(async module => {
      await module.loadForestArt();
      runtime = module.createForest(canvas, {
        onWalk() { if (firstWalk) { firstWalk = false; hint.hidden = true; } },
        onArrive(id) { if (!active) return; if (id === 'home') showTree(); else showResident(id); },
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
      treeStatus=button('Herzbaum besuchen',[],()=>{closeOverlay();runtime?.walkTo(model.nodes.home,'home');},'play-tree-progress');
      const book = button('Spielebuch öffnen', art.icon('book'), () => FK.go('forest-book'), 'forest-round forest-book');
      ui.append(h('header', { class: 'forest-header' }, h('div', { class: 'forest-heading' },
        h('p', { class: 'forest-eyebrow', text: 'Farbtupf' }), h('h1', { text: 'Der Herzbaum' }),treeStatus), h('nav', { 'aria-label': 'Wald und Spiele' }, book, sound, FK.ui.settingsButton())));
      hitTargets = {};
      for (const [id, name] of Object.entries({ ...FK.forestStory.names, home: 'Herzbaum' })) {
        const b = button(name + ' besuchen', h('span', { class: 'forest-discovery-mark', 'aria-hidden': 'true' }, art.icon(id === 'home' ? 'eye' : 'paw')), () => id === 'home' ? runtime?.walkTo(model.nodes.home, 'home') : runtime?.walkToResident(id), 'forest-npc-target');
        b.hidden = true; hitTargets[id] = b; ui.append(b);
      }
      bubble = button('Biber bei der Brücke helfen', art.bridge(false), () => travel(model.objective()), 'forest-bubble'); bubble.hidden = true; ui.append(bubble);
      hint = button('Hier auf den Weg tippen', [art.icon('paw'), art.icon('hand')], () => runtime?.walkTo({ x: -12.0, z: 5.0 }), 'forest-walk-hint'); hint.hidden = true; ui.append(hint);
      goal = button('Zum Biber gehen', [], () => {
        if (!runtime || overlayKind) return;
        travel(model.objective());
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
      FK.forestActivity.recoverRewards();
      try { await ensureScene(); } catch (_) { return; }
      if (!active || token !== entry) return;
      runtime.moment(null); runtime.accompany(null); runtime.input(true); runtime.focus(null); runtime.start(); root.classList.remove('forest-loading');
      if (!model.get().welcomed) { firstWalk = true; showWelcome(); }
      else {
        firstWalk = false; updateHUD();
        if (model.get().bridgeRepaired && !model.get().payoffSeen) {
          runtime.repair(); showBeaver();
        } else if (model.get().endingUnlocked && !model.get().endingSeen) {
          showEnding();
        } else {
          const pending = Object.values(model.quests).find(q => q.id !== model.QUEST && model.isComplete(q.id) && !model.get().payoffsSeen[q.id]);
          if (pending) { runtime.focus(pending.resident); payoffTimer = setTimeout(() => { if (active && token === entry) showQuest(pending); }, 700); }
          else if (params.returned) voice.say('Ich bin hier, wenn du magst.');
        }
      }
    },
    leave() {
      active = false; ++entry; clearTimeout(payoffTimer); runtime?.gather(false); runtime?.moment(null); runtime?.accompany(null); runtime?.stop(); model.stopReplay(); voice.cancel();
      overlayKind = ''; overlay.replaceChildren(); root.classList.remove('has-dialog');
    },
  });
})();
