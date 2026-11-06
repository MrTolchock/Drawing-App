/* Original Farbtupf activities, informed by public teaching concepts.
   No publisher exercises, illustrations or characters are reproduced.
   Sources and age-range decisions: docs/LMVZ-RESEARCH.md. */
(function () {
  'use strict';
  const FK = window.FK;
  const games = [
    { id: 'rocket', title: 'Sternenrakete', emoji: '🚀', color: 'lilac', sub: ['Ergänzen bis 5', 'Ergänzen bis 10', 'Ergänzen bis 20'] },
    { id: 'picnic', title: 'Waldpicknick', emoji: '🧺', color: 'mint', sub: ['Für zwei verteilen', 'Für drei teilen', 'Vier Freunde einladen'] },
    { id: 'double', title: 'Zauberspiegel', emoji: '🪄', color: 'rose', sub: ['Doppelt bis 6', 'Doppelt bis 10', 'Doppelt bis 20'] },
    { id: 'shapes', title: 'Formenwerkstatt', emoji: '🔷', color: 'sky', sub: ['Häuschen bauen', 'Drei Teile einsetzen', 'Formen drehen'] },
    { id: 'rhyme', title: 'Reimzirkus', emoji: '🎪', color: 'apricot', sub: ['Reime hören', 'Reime entdecken', 'Reimdetektive'] },
    { id: 'syllable', title: 'Silbentrommel', emoji: '🥁', color: 'sun', sub: ['Ein- und Zweisilber', 'Bis drei Silben', 'Lange Wörter'] },
    { id: 'robot', title: 'Roboterpost', emoji: '🤖', color: 'mint', sub: ['Kurze Wege', 'Um die Hecke', 'Wege planen'] },
    { id: 'sequence', title: 'Was kommt dann?', emoji: '🌱', color: 'sky', sub: ['Zwei Bilder ordnen', 'Drei Schritte', 'Vier Schritte'] },
  ];
  // Concrete picture words only; every spoken word has its own matching picture.
  const rhymes = [
    [['Haus','Maus','Baum'],['Hose','Rose','Nase'],['Dose','Rose','Nase'],['Hase','Nase','Hut'],['Tisch','Fisch','Tor']],
    [['Bein','Stein','Brot'],['Brot','Boot','Berg'],['Tor','Ohr','Tee'],['Zahn','Bahn','Zelt'],['Maus','Haus','Hut']],
    [['Schnecke','Decke','Schnee'],['Kanne','Tanne','Katze'],['Sonne','Tonne','Socke'],['Hase','Nase','Hose'],['Fisch','Tisch','Hut']],
  ];
  const rhymePictures = { Haus:'🏠',Maus:'🐭',Baum:'🌳',Hose:'👖',Rose:'🌹',Nase:'👃',Dose:'🥫',Hase:'🐇',Hut:'🎩',Fisch:'🐟',Ohr:'👂',Bahn:'🚂',Schnecke:'🐌',Schnee:'❄️',Tanne:'🌲',Katze:'🐈',Sonne:'☀️',Bus:'🚌',Blume:'🌸',Velo:'🚲',Kuh:'🐄' };
  const syllables = [
    [['Ro-se', '🌹'], ['Ha-se', '🐇'], ['Hut', '🎩'], ['Na-se', '👃'], ['Fisch', '🐟']],
    [['Ba-na-ne', '🍌'], ['To-ma-te', '🍅'], ['Ra-ke-te', '🚀'], ['Me-lo-ne', '🍉'], ['Lu-pe', '🔎']],
    [['Scho-ko-la-de', '🍫'], ['Re-gen-bo-gen', '🌈'], ['Feu-er-wehr', '🚒'], ['Son-nen-blu-me', '🌻'], ['A-mei-se', '🐜']],
  ];
  // These are original, explicitly bounded scenarios, not universal biological timelines.
  const sequences = [
    [
      ['Erst anziehen, dann los!', ['🧥 Jacke anziehen', '🚶 Hinausgehen']],
      ['Unser Znüni ist eine Banane.', ['🍌 Banane schälen', '😋 Banane essen']],
      ['Wir zeichnen ein Bild.', ['🎨 Bild malen', '🖼️ Bild aufhängen']],
      ['Wir sammeln Regenwasser.', ['🪣 Leeren Eimer hinstellen', '💧 Regen füllt den Eimer']],
      ['Die Sonne geht unter.', ['🌇 Sonnenuntergang', '🌙 Nacht']],
    ],
    [
      ['Wir pflanzen eine Bohne.', ['🫘 Bohne in feuchte Erde legen', '🌱 Keimling wächst', '🌿 Junge Pflanze wächst weiter']],
      ['Wir machen einen Obstsalat.', ['💧 Obst waschen', '🥣 Stücke in die Schüssel geben', '😋 Obstsalat essen']],
      ['Vom Ei zum Vogel.', ['🥚 Ei im Nest', '🐣 Jungvogel schlüpft', '🐦 Vogel wächst heran']],
      ['Eis auf einem warmen Teller.', ['🧊 Eiswürfel', '💧 Schmelzwasser', '☀️ Wasser verdunstet langsam']],
      ['Unser Brief reist los.', ['✏️ Brief schreiben', '📮 Brief einwerfen', '📬 Brief kommt an']],
    ],
    [
      ['Das Leben eines Schmetterlings.', ['🥚 Ei auf einem Blatt', '🐛 Raupe', '🟤 Puppe', '🦋 Schmetterling']],
      ['Von der Blüte zum Apfel.', ['🌸 Apfelblüte', '🟢 Kleiner unreifer Apfel', '🍎 Reifer Apfel', '🧺 Apfel ernten']],
      ['Ein Schneemann entsteht.', ['❄️ Schnee fällt', '⚽ Schneekugeln rollen', '⛄ Kugeln aufeinanderstellen', '🎩 Hut aufsetzen']],
      ['Vom Regen zur Pfütze.', ['☁️ Regenwolke', '🌧️ Regen fällt', '💧 Pfütze entsteht', '☀️ Pfütze trocknet langsam']],
      ['Unser Bild wird eine Einladung.', ['💡 Bildidee sammeln', '✏️ Bild zeichnen', '✉️ Einladung verschicken', '🎉 Gemeinsam feiern']],
    ],
  ];
  const shapes = [
    { id: 'circle', name: 'Kreis', corners: 0 },
    { id: 'triangle', name: 'Dreieck', corners: 3 },
    { id: 'square', name: 'Quadrat', corners: 4 },
    { id: 'rectangle', name: 'Langes Rechteck', corners: 4 },
  ];
  const integer = (min, max, rng) => min + Math.floor(rng() * (max - min + 1));
  function mix(values, rng) {
    const result = values.slice();
    for (let i = result.length - 1; i > 0; i--) { const j = integer(0, i, rng); [result[i], result[j]] = [result[j], result[i]]; }
    return result;
  }
  const options = (n, max) => Array.from(new Set([n, Math.max(0, n - 1), Math.min(max, n + 1), Math.max(0, n - 2), Math.min(max, n + 2)])).slice(0, 3);
  function question(kind, stage, round, rng) {
    rng = rng || Math.random;
    stage = Math.max(1, Math.min(3, Number(stage) || 1));
    round = Math.max(0, Number(round) || 0) % 5;
    const max = [5, 10, 20][stage - 1];
    if (kind === 'rocket') {
      const total = integer(stage === 1 ? 3 : max - 4, max, rng);
      const filled = integer(1, total - 1, rng);
      return { kind, mode: 'fill', prompt: 'Für den Start braucht die Rakete genau ' + total + ' Sterne. ' + filled + ' sind schon an Bord. Wie viele fehlen?', total, filled, answer: total - filled, loads: stage === 1 ? [1] : stage === 2 ? [1, 2] : [1, 2, 5],
        hint: 'Zähle von ' + filled + ' bis ' + total + ' weiter. Lade die fehlenden Sterne ein. Einen geladenen Stern kannst du wieder antippen und herausnehmen.', explain: filled + ' und ' + (total - filled) + ' ergeben ' + total + '. Der Biber fliegt zu seinem Freund!', transfer: 'Zeige mit deinen Fingern eine andere Zerlegung.' };
    }
    if (kind === 'picnic') {
      const each = integer(stage === 1 ? 1 : 2, [3, 4, 5][stage - 1], rng);
      const recipients = ['fox', 'hedgehog', 'hare', 'beaver'].slice(0, stage + 1);
      const total = each * recipients.length;
      return { kind, mode: 'share', prompt: recipients.length + ' Freunde haben Hunger! Teile alle ' + total + ' Beeren so, dass jeder gleich viele bekommt.', total, answer: each, recipients,
        hint: 'Gib reihum jedem Tier eine Beere. Du kannst eine Beere auch auf einen anderen Teller oder zurück in den Korb ziehen.', explain: 'Alle ' + recipients.length + ' Freunde strahlen! Jeder hat ' + each + ' Beeren. Niemand bleibt hungrig.', transfer: 'Teile eine Handvoll Steine gerecht auf mehrere Teller auf.' };
    }
    if (kind === 'double') {
      const n = integer(1, [3, 5, 10][stage - 1], rng);
      return { kind, mode: 'double', prompt: 'Zaubere auf die andere Seite genau gleich viele Sterne. Wie viele leuchten dann zusammen?', n, answer: n * 2, choices: options(n * 2, 20),
        hint: 'Für jeden Stern links braucht es einen Stern rechts. Danach zählst du beide Gruppen: ' + n + ' und nochmals ' + n + '.', explain: 'Das Doppelte von ' + n + ' ist ' + (n * 2) + '. Zwei gleiche Sternengruppen leuchten!', transfer: 'Finde das Doppelte mit zwei gleichen Fingerbildern.' };
    }
    if (kind === 'shapes') {
      const target = shapes[(round + stage - 1) % shapes.length];
      const ids = shapes.map(s => s.id);
      const parts = [
        {key:'roof',shape:'triangle',x:50,y:21,w:37,h:37,rotation:0},
        {key:'window',shape:'circle',x:32,y:57,w:24,h:24,rotation:0},
        {key:'attic',shape:'square',x:68,y:57,w:24,h:24,rotation:0},
        {key:'door',shape:'rectangle',x:50,y:82,w:34,h:24,rotation:90},
      ];
      const targets = mix(parts, rng).slice(0, stage + 1);
      const rotations = Object.fromEntries(ids.map(id => [id, stage === 3 ? integer(1, 3, rng) * 90 : id === 'rectangle' ? 90 : 0]));
      return { kind, mode: 'build', prompt: stage === 3 ? 'Baue das Waldhäuschen! Wähle eine Form, drehe sie und setze sie in die passende Lücke.' : 'Unser Waldhäuschen braucht deine Hilfe! Setze die Formen in die passenden Lücken.', answer: target.id, choices: ids, parts, targets, rotations, rotated: stage === 3,
        hint: stage === 3 ? 'Wähle unten eine Form. Mit dem runden Pfeil drehst du sie. Lege sie auf die gleiche Umrissform.' : 'Wähle unten eine Form und tippe auf die gleiche Umrissform im Häuschen. Oder ziehe sie direkt dorthin.',
        explain: 'Ein Dach, Fenster und eine Tür! Das Waldhäuschen ist wieder gemütlich.' + (stage === 3 ? ' Drehen verändert die Form nicht.' : ''), transfer: 'Finde diese Formen im Zimmer. Baut zusammen ein Häuschen aus Papierformen.' };
    }
    if (kind === 'rhyme') {
      const row = rhymes[stage - 1][round];
      return { kind, mode: 'choice', prompt: 'Was reimt sich auf «' + row[0] + '»?', word: row[0], answer: row[1], choices: [row[1], row[2], ['Bus', 'Licht', 'Blume', 'Velo', 'Kuh'][round]],
        hint: 'Sprich die Wörter laut. Höre auf das Ende, nicht auf den ersten Buchstaben. Lass dir bei Bedarf vorlesen.', explain: row[0] + ' und ' + row[1] + ' klingen am Ende gleich.', transfer: 'Erfinde einen lustigen Satz mit dem Reimpaar.' };
    }
    if (kind === 'syllable') {
      const row = syllables[stage - 1][round];
      return { kind, mode: 'clap', prompt: 'Sprich «' + row[0].replace(/-/g, '') + '». Trommle einmal für jede Silbe!', word: row[0].replace(/-/g, ''), emoji: row[1], parts: row[0].split('-'), answer: row[0].split('-').length,
        hint: 'Sprich langsam und klatsche mit. Nochmals tippen zählt einen weiteren Schlag. «Zurück» nimmt einen weg.', explain: row[0].split('-').join(' · '), transfer: 'Wie viele Silben hat dein Name? Trommle ihn!' };
    }
    if (kind === 'robot') {
      const size = stage + 2;
      // Guaranteed route: go along the top row, then down the last column.
      const obstacles = stage === 1 ? [] : Array.from({ length: size - 2 }, (_, i) => (i + 1) * size + 1);
      const corners = [0, size - 1, size * (size - 1), size * size - 1];
      const start = corners[round % 4], goal = corners[3 - round % 4];
      return { kind, mode: 'route', prompt: 'Bring die Roboterpost zum Briefkasten. Plane deinen Weg!', size, start, goal, obstacles,
        hint: 'Die Pfeile bewegen den Roboter ein Feld. Hecken sind gesperrt. Es gibt mehrere richtige Wege.', explain: 'Die Post ist da! Du hast eine Folge von Befehlen geplant.', transfer: 'Beschreibe deinen Weg einer anderen Person. Findet ihr einen zweiten Weg?' };
    }
    if (kind === 'sequence') {
      const row = sequences[stage - 1][round];
      return { kind, mode: 'order', prompt: row[0] + ' Ziehe die Bilder in die richtige Reihenfolge.', ordered: row[1].slice(),
        hint: 'Ziehe ein Bild an seinen Platz. Oder tippe zwei Bilder an, um sie zu tauschen. Links beginnt die Geschichte.', explain: 'Du hast die Schritte geordnet!', transfer: 'Erzähle dazu eine eigene kleine Geschichte oder zeichne sie.' };
    }
    throw new Error('Unknown adventure: ' + kind);
  }
  FK.adventures = { games, question, shapes, rhymePictures };
})();
