(function () {
  'use strict';
  const FK = window.FK, h = FK.h;
  let body, title, selected = null, filter;
  const btn = (text, fn, cls) => h('button', { type: 'button', class: 'learn-button ' + (cls || ''), text, onclick: fn });
  function list() {
    selected = null; title.textContent = 'Kreativmissionen'; body.replaceChildren();
    const filters = h('div', { class: 'mission-filters', role: 'group', 'aria-label': 'Missionen nach Stufe' });
    [1, 2, 3, 0].forEach(s => filters.append(h('button', { type: 'button', class: 'learn-button', text: s ? FK.learning.stages[s - 1] : 'Alle', 'aria-pressed': String(s === filter), onclick: () => { filter = s; list(); } })));
    const grid = h('div', { class: 'mission-grid' });
    FK.missions.filter(m => !filter || m.stage === filter).forEach(m => {
      const done = FK.settings.get('mission.done.' + m.id);
      grid.append(btn(m.emoji + ' ' + m.title + (done ? ' ✓' : ''), () => detail(m), 'mission-tile'));
    });
    body.append(h('h2', { class: 'learn-prompt', text: 'Deine Ideen sind gefragt!' }), h('p', { text: 'Schauen, erzählen, malen. Eine erwachsene Person darf mitlesen.' }), filters, grid);
  }
  function detail(m) {
    selected = m; title.textContent = m.emoji + ' ' + m.title;
    body.replaceChildren(h('p', { class: 'learn-meta', text: m.area + ' · ' + FK.learning.stages[m.stage - 1] }), h('h2', { class: 'learn-prompt', text: m.goal }));
    const steps = h('ol', { class: 'mission-steps' }); m.steps.forEach(s => steps.append(h('li', { text: s })));
    body.append(steps, h('p', { class: 'mission-tip', text: '💡 ' + m.hint }),
      btn('🎨 Im Atelier malen', () => FK.go('free', { mission: m.id }), 'learn-next'),
      h('p', { text: 'Dein bisheriges Blatt bleibt erhalten. Im Atelier kannst du mit «Neu» ein neues Blatt beginnen.' }),
      h('h3', { text: '💬 Zeigen und erzählen' }), h('p', { text: m.talk }), h('h3', { text: '✨ Noch eine Idee' }), h('p', { text: m.stretch }));
    const done = !!FK.settings.get('mission.done.' + m.id);
    const mark = btn(done ? '✓ Ausprobiert!' : 'Das habe ich ausprobiert', () => { FK.settings.set('mission.done.' + m.id, true); mark.textContent = '✓ Ausprobiert!'; mark.setAttribute('aria-pressed', 'true'); }, 'mission-done');
    mark.setAttribute('aria-pressed', String(done));
    body.append(mark, h('p', { class: 'learn-meta', text: 'Hier gibt es viele gute Lösungen. Das Häkchen ist deine eigene Rückschau.' }), btn('← Andere Mission', list));
    body.scrollTop = 0;
  }
  FK.screen('missions', {
    build(root) { const bar = FK.ui.topbar({ title: 'Kreativmissionen', onBack: () => selected ? list() : FK.back() }); title = bar.querySelector('.title'); body = h('div', { class: 'learn-body mission-body scroll' }); root.append(bar, body); },
    enter(params) { filter = FK.learning.stage(); const m = FK.missions.find(x => x.id === (params || {}).mission); if (m) detail(m); else list(); },
  });
})();
