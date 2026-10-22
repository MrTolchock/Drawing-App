/* Farbtupf – Sammelalbum (Belohnungs-Sticker für Sterne) und Einstellungen für Eltern. */
(function () {
  'use strict';
  const FK = window.FK;
  const h = FK.h;

  /* ---------- Sammelalbum ---------- */
  let albumBody = null;

  function stat(icon, n, label) {
    return h('div', { class: 'stat' }, h('span', { class: 'stat-ic', html: FK.icon(icon, 'ic') }), h('b', { text: String(n) }), h('span', { text: label }));
  }

  // letters written at least once (guided or free); digits and the «alle geschafft» bonus are not letters
  function lettersDone() {
    let n = 0;
    ((FK.glyphs && FK.glyphs.sets) || []).forEach((set) => {
      if (set.id === 'zahlen') return;
      set.items.forEach((g) => { if (FK.progress.isDone('trace', g) || FK.progress.isDone('trace', g + ':frei')) n++; });
    });
    return n;
  }

  function renderAlbum() {
    const stars = FK.progress.stars();
    const per = FK.STARS_PER_STICKER;
    const unlocked = FK.rewardsUnlocked();
    const seen = FK.settings.get('album.seen') | 0;
    albumBody.innerHTML = '';

    const toNext = unlocked >= FK.REWARDS.length ? 0 : per - (stars % per);
    const head = h('div', { class: 'album-head' });
    const meter = h('div', { class: 'album-meter' });
    for (let i = 0; i < per; i++) {
      meter.insertAdjacentHTML('beforeend', FK.icon(i < per - toNext || !toNext ? 'star' : 'star-empty', 'ic'));
    }
    head.append(FK.ui.mascot({ mood: unlocked > seen ? 'cheer' : '', cls: 'album-mascot' }), h('div', { class: 'album-next' },
      h('p', { text: toNext ? 'Noch ' + toNext + (toNext === 1 ? ' Stern' : ' Sterne') + ' bis zum nächsten Sticker' : 'Alle Sticker gesammelt!' }),
      meter));
    albumBody.append(head);

    const stats = h('div', { class: 'album-stats' },
      stat('crayon', FK.progress.doneCount('color'), 'Bilder'),
      stat('pencil', lettersDone(), 'Buchstaben'),
      stat('star', stars, 'Sterne'));
    albumBody.append(stats);

    const grid = h('div', { class: 'album-grid' });
    FK.REWARDS.forEach(([e, name], i) => {
      if (i < unlocked) {
        const card = h('div', { class: 'album-sticker' + (i >= seen ? ' new' : ''), style: { '--tilt': ((i * 37) % 9) - 4 + 'deg', animationDelay: (i - seen) * 0.15 + 's' } },
          h('span', { class: 'emoji', text: e }), h('span', { class: 'album-name', text: FK.text.word(name) }));
        grid.append(card);
      } else {
        grid.append(h('div', { class: 'album-sticker locked', html: FK.icon('lock', 'ic') + '<span class="album-name">?</span>' }));
      }
    });
    albumBody.append(grid);

    if (unlocked > seen) {
      setTimeout(() => {
        FK.sound.fanfare();
        FK.fx.confetti(120);
      }, 300);
      FK.settings.set('album.seen', unlocked);
    }
  }

  FK.screen('album', {
    build(r) {
      albumBody = h('div', { class: 'album-body' });
      r.append(FK.ui.topbar({ title: 'Sammelalbum' }), h('div', { class: 'scroll' }, albumBody));
    },
    enter() { renderAlbum(); },
  });

  /* ---------- Für Eltern ---------- */
  function toggle(id, icon, title, text, checked, onChange) {
    const input = h('input', { type: 'checkbox', id });
    input.checked = checked;
    input.addEventListener('change', () => onChange(input.checked));
    return h('label', { class: 'toggle', for: id },
      h('span', { class: 'toggle-ic', html: FK.icon(icon, 'ic') }),
      h('span', { class: 'toggle-txt' }, h('b', { text: title }), h('small', { text: text })),
      input, h('span', { class: 'switch', 'aria-hidden': 'true' }));
  }

  function segmented(name, options, value, onChange) {
    const wrap = h('div', { class: 'seg', role: 'radiogroup' });
    options.forEach((o) => {
      const id = name + '-' + o.value;
      const input = h('input', { type: 'radio', name, id, value: o.value });
      input.checked = o.value === value;
      input.addEventListener('change', () => { if (input.checked) onChange(o.value); });
      wrap.append(input, h('label', { for: id, class: 'seg-opt' }, h('b', { class: 'read', text: o.sample }), h('small', { text: o.label })));
    });
    return wrap;
  }

  FK.screen('parents', {
    build(r) {
      const body = h('div', { class: 'settings' });
      body.append(toggle('set-sound', 'sound', 'Geräusche', 'Töne beim Malen, Lesen und Schreiben', FK.settings.get('sound') !== false, (v) => {
        FK.settings.set('sound', v);
        if (v) {
          FK.sound.unlock();
          FK.sound.tick();
        }
      }));

      const schrift = h('div', { class: 'setting-card' },
        h('div', { class: 'setting-head' }, h('b', { text: 'Schrift zum Lesen' }), h('small', { text: 'Wie Silben und Wörter angezeigt werden' })),
        segmented('schrift', [
          { value: 'gross', sample: 'MA MI MO', label: 'Nur gross' },
          { value: 'normal', sample: 'ma mi mo', label: 'Gross und klein' },
        ], FK.settings.get('schrift') || 'gross', (v) => {
          FK.settings.set('schrift', v);
          FK.sound.tick();
        }));
      body.append(schrift);

      const reset = FK.ui.btn({ icon: 'trash', label: 'Sterne zurücksetzen', cls: 'btn-wide', onClick: async () => {
        const ok = await FK.ui.confirm('Alle Sterne und Fortschritte löschen? Die Bilder bleiben.', 'Löschen', 'Behalten', { danger: true });
        if (!ok) return;
        FK.progress.reset();
        FK.settings.set('album.seen', 0);
        FK.ui.toast('Fortschritt zurückgesetzt');
      } });

      const info = h('div', { class: 'info' });
      info.innerHTML =
        '<h3>Was Ihr Kind hier lernt</h3>' +
        '<p>Farbtupf ist auf die <b>1. Klasse</b> im Kanton Zürich abgestimmt (Lehrplan 21, Zyklus 1). Es ersetzt den Unterricht nicht, sondern übt spielerisch, was in der Schule eingeführt wird.</p>' +
        '<ul class="lp">' +
        '<li><b>Rechnen</b> – Mathematik, Zahlenraum bis 20 (MA.1 Zahl und Variable): Mengen auf einen Blick erkennen (Zehner- und Zwanzigerfeld), Zahlen zerlegen (Zahlenhaus), Plus und Minus bis 10 und bis 20, Nachbarzahlen, vorwärts und rückwärts zählen. Geld bis 20 Franken (MA.3) und Formen und Muster (MA.2).</li>' +
        '<li><b>Schreiben</b> – Deutsch D.4: Buchstaben und Ziffern in der Deutschschweizer Basisschrift (unverbunden), mit Startpunkt, Reihenfolge und Richtung jedes Strichs, dazu ein Anlautbild.</li>' +
        '<li><b>Lesen</b> – Deutsch D.2 und D.5: Anlaute, Reime, Silben mit Silbenbögen (silbenorientiert wie im Zürcher Lehrmittel «Deutsch»), Wörter und kurze Sätze. Ohne Ton – das Bild zeigt, ob es stimmt.</li>' +
        '<li><b>Ausmalen</b> – Bildnerisches Gestalten und Zahlen: frei ausmalen, nach Zahlen oder nach Rechnungen bis 10 und bis 20 – auch Bilder aus Zürich (Tram, Grossmünster, Böögg, Räbeliechtli, Zürichsee, Samichlaus).</li>' +
        '<li><b>Punkt zu Punkt</b> – Zahlenfolge bis 20 vorwärts und rückwärts.</li>' +
        '</ul>' +
        '<p>Die Schrift (GROSS oder Gross und klein) stellen Sie oben ein – passend zu dem, was Ihr Kind in der Schule schon kennt.</p>' +
        '<h3>Als App installieren</h3>' +
        '<p>In Safari auf <b>Teilen</b> tippen und <b>«Zum Home-Bildschirm»</b> wählen. Danach startet Farbtupf wie eine App – auch ohne Internet.</p>' +
        '<h3>Daten</h3>' +
        '<p>Alle Bilder und Sterne bleiben auf diesem Gerät. Unter «Meine Bilder» → <b>In Fotos</b> lässt sich ein Bild in die Fotos legen oder teilen. Es gibt keine Werbung, kein Konto und keine Datenübertragung.</p>' +
        '<p class="ver">Farbtupf ' + FK.VERSION + '</p>';

      body.append(reset, info);
      r.append(FK.ui.topbar({ title: 'Für Eltern' }), h('div', { class: 'scroll' }, body));
    },
  });
})();
