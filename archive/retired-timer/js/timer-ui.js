/* A quiet timer row and controls; the current activity stays mounted underneath. */
(function () {
  'use strict';
  const FK = window.FK, h = FK.h, timer = FK.playTimer;
  let bar, openPanel = null, initialized = false;
  const activity=()=>timer.setActive(!document.hidden&&!['parents','settings'].includes(FK.current())&&!openPanel);
  const elements = new Set();
  function icon(name) {
    const paths = {
      clock: '<circle cx="24" cy="26" r="17" fill="#edf0d6" stroke="currentColor" stroke-width="3"/><path d="M24 15v12l8 5M18 4h12m-6 0v5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>',
      play: '<path d="m17 10 22 14-22 14z" fill="currentColor"/>', pause: '<path d="M15 11h6v26h-6zm12 0h6v26h-6z" fill="currentColor"/>',
      reset: '<path d="M12 14a17 17 0 1 1-4 18M12 5v12H2" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>',
    };
    return h('span', { class: 'play-timer-icon', 'aria-hidden': 'true', html: '<svg viewBox="0 0 48 48">' + (paths[name] || paths.clock) + '</svg>' });
  }
  const button = (label, children, fn, cls = '') => h('button', { type: 'button', class: 'play-timer-button ' + cls, 'aria-label': label, onclick: fn }, children);
  function clock() {
    return h('span', { class: 'play-timer-clock', 'aria-hidden': 'true', html: '<svg viewBox="0 0 44 44"><circle class="play-timer-track" cx="22" cy="22" r="18"/><circle class="play-timer-progress" cx="22" cy="22" r="18" pathLength="100" transform="rotate(-90 22 22)"/></svg>' }, icon('clock'));
  }
  function view(large = false) {
    const display = h('output', { class: 'play-timer-digits', role: 'timer', 'aria-live': 'off' });
    const status = h('span', { class: 'play-timer-status', role: large ? 'status' : undefined });
    const ring = clock(), wrap = h('div', { class: large ? 'play-timer-readout large' : 'play-timer-readout' }, ring, h('span', {}, display, status));
    const toggle = button('Uhr starten', icon('play'), () => { if (timer.get().running) timer.pause(); else timer.start(); });
    const reset = button('Uhr zurücksetzen', icon('reset'), () => timer.reset());
    const record = { wrap, display, status, ring, toggle, reset }; elements.add(record);
    return record;
  }
  function render(state) {
    const enabled = state.mode !== 'off';
    const showBar=enabled&&FK.current()!=='settings';
    if (bar) { bar.hidden = !showBar; document.body.classList.toggle('play-timer-enabled', showBar); }
    const value = FK.playTimerFormat(state.displayMs, state.mode === 'countdown');
    const caption = state.completed ? 'Zeit für eine Pause' : state.running ? state.active ? 'Spielzeit' : 'Start beim Weiterspielen' : 'Pause';
    for (const el of elements) {
      el.display.textContent = value;
      if (el.status.textContent !== caption) el.status.textContent = caption;
      el.toggle.disabled = !enabled || state.completed; el.reset.disabled = !enabled;
      el.toggle.setAttribute('aria-label', state.running ? 'Uhr pausieren' : 'Uhr starten');
      el.toggle.replaceChildren(icon(state.running ? 'pause' : 'play'));
      const fraction = state.mode === 'countdown' ? state.remainingMs / state.durationMs : state.elapsedMs % 60000 / 60000;
      el.ring.style.setProperty('--timer-progress', String(Math.max(0, Math.min(100, fraction * 100))));
      el.wrap.dataset.completed = String(state.completed);
    }
  }
  function controls() {
    const state = timer.get(), panel = h('div', { class: 'play-timer-panel' }), el = view(true);
    panel.append(el.wrap, h('div', { class: 'play-timer-actions' }, el.toggle, el.reset),
      h('p', { text: 'Die Uhr zählt beim Spielen. Im Hintergrund und in den Elterneinstellungen wartet sie. Dein Spiel bleibt erhalten.' }));
    render(state); return { panel, dispose: () => elements.delete(el) };
  }
  function settings() {
    const card = h('section', { class: 'setting-card play-timer-settings' }, h('div', { class: 'setting-head' },
      h('b', { text: 'Spielzeit' }), h('small', { text: 'Eine freiwillige Uhr. Der Countdown erinnert an eine Pause und beendet kein Spiel.' })));
    const modes = h('div', { class: 'play-timer-modes', role: 'group', 'aria-label': 'Uhr auswählen' });
    const presets = h('div', { class: 'play-timer-presets', role: 'group', 'aria-label': 'Dauer der Spielzeit' });
    const modeButtons = [], durationButtons = [];
    for (const [mode, label] of [['off', 'Aus'], ['stopwatch', 'Stoppuhr'], ['countdown', 'Countdown']]) {
      const b = button(label, h('span', { text: label }), () => { if (timer.get().mode !== mode) timer.configure(mode); }); b.dataset.mode = mode; modeButtons.push(b); modes.append(b);
    }
    for (const minutes of [5, 10, 15, 20, 30]) {
      const b = button(minutes + ' Minuten', h('span', { text: minutes + ' Min.' }), () => { if (timer.get().mode !== 'countdown' || timer.get().durationMs !== minutes * 60000) timer.configure('countdown', minutes * 60000); });
      b.dataset.duration = String(minutes * 60000); durationButtons.push(b); presets.append(b);
    }
    const c = controls(); card.append(modes, presets, c.panel);
    const off = timer.subscribe(s => {
      modeButtons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === s.mode)));
      presets.hidden = s.mode !== 'countdown'; durationButtons.forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.duration) === s.durationMs)));
      c.panel.hidden = s.mode === 'off';
    });
    return { element: card, dispose() { off(); c.dispose(); } };
  }
  function open() {
    if (document.querySelector('.modal')) return;
    const forest = FK.current() === 'forest';
    if (forest && document.querySelector('.screen-forest.has-dialog')) return;
    if (forest) FK.forestScene?.stop();
    const config = settings(), previousFocus = document.activeElement;
    openPanel = FK.ui.modal({ title: 'Spielzeit', body: config.element, cls: 'play-timer-modal', onClose() {
      config.dispose(); openPanel = null;activity();
      if (FK.current() === 'forest' && !document.querySelector('.screen-forest.has-dialog')) FK.forestScene?.start();
      const target = previousFocus.closest?.('.play-timer-bar') && timer.get().mode === 'off' ? document.querySelector('.screen:not([hidden]) button') : previousFocus;
      if (target?.isConnected) target.focus({ preventScroll: true });
    } });
    activity();
    openPanel.el.addEventListener('keydown', event => {
      if (event.key !== 'Tab') return;
      const buttons = [...openPanel.el.querySelectorAll('button:not(:disabled)')].filter(b => b.getClientRects().length);
      const index = buttons.indexOf(document.activeElement);
      if (event.shiftKey && index <= 0) { event.preventDefault(); buttons.at(-1)?.focus(); }
      else if (!event.shiftKey && index === buttons.length - 1) { event.preventDefault(); buttons[0]?.focus(); }
    });
    openPanel.el.querySelector('button[aria-pressed="true"]')?.focus({ preventScroll: true });
    render(timer.get());
  }
  function launcher() { return button('Spielzeit-Uhr öffnen', icon('clock'), open, 'play-timer-launcher'); }
  function init() {
    if (initialized) return; initialized = true;
    const el = view();
    const label = button('Spielzeit-Uhr öffnen', el.wrap, open, 'play-timer-summary');
    bar = h('aside', { class: 'play-timer-bar', 'aria-label': 'Spielzeit', hidden: true }, label, h('div', { class: 'play-timer-actions' }, el.toggle, el.reset));
    document.body.append(bar); timer.subscribe(render);
    FK.on('screen', activity); document.addEventListener('visibilitychange', activity); window.addEventListener('pageshow', activity); window.addEventListener('pagehide', () => timer.flush());
    window.setInterval(() => timer.tick(), 250); activity();
    timer.onComplete(() => { FK.sound.right(); FK.ui.toast('Zeit für eine Pause. Dein Abenteuer wartet auf dich.'); });
  }
  FK.timerUI = { init, open, launcher, settings };
})();
