/* Original Farbtupf activities, informed by public teaching concepts.
   No publisher exercises, illustrations or characters are reproduced.
   Sources and age-range decisions: docs/LMVZ-RESEARCH.md. */
(function () {
  'use strict';
  const FK = window.FK;
  const games = [
    { id: 'rocket', title: 'Sternenrakete', emoji: '🚀', color: 'lilac', sub: ['Ergänzen bis 5', 'Ergänzen bis 10', 'Ergänzen bis 20'] },
    { id: 'picnic', title: 'Waldpicknick', emoji: '🧺', color: 'mint', sub: ['Für zwei verteilen', 'Gerecht teilen', 'Grössere Picknicks'] },
    { id: 'double', title: 'Zauberzwillinge', emoji: '🪄', color: 'rose', sub: ['Doppelt bis 6', 'Doppelt bis 10', 'Doppelt bis 20'] },
    { id: 'shapes', title: 'Formenwerkstatt', emoji: '🔷', color: 'sky', sub: ['Formen finden', 'Ecken entdecken', 'Formen drehen'] },
    { id: 'rhyme', title: 'Reimzirkus', emoji: '🎪', color: 'apricot', sub: ['Reime hören', 'Reime entdecken', 'Reimdetektive'] },
    { id: 'syllable', title: 'Silbentrommel', emoji: '🥁', color: 'sun', sub: ['Ein- und Zweisilber', 'Bis drei Silben', 'Lange Wörter'] },
    { id: 'robot', title: 'Roboterpost', emoji: '🤖', color: 'mint', sub: ['Kurze Wege', 'Um die Hecke', 'Wege planen'] },
    { id: 'sequence', title: 'Was kommt dann?', emoji: '🌱', color: 'sky', sub: ['Zwei Bilder ordnen', 'Drei Schritte', 'Vier Schritte'] },
  ];
  const rhymes = [
    [['Haus', 'Maus', 'Baum'], ['Hose', 'Rose', 'Tasse'], ['Dose', 'Rose', 'Nase'], ['Hand', 'Sand', 'Hut'], ['Tisch', 'Fisch', 'Tor']],
    [['Bein', 'Stein', 'Brot'], ['Brot', 'Boot', 'Berg'], ['Tor', 'Ohr', 'Tee'], ['Zahn', 'Bahn', 'Zelt'], ['Nacht', 'acht', 'neun']],
    [['Schnecke', 'Decke', 'Schnee'], ['Kanne', 'Tanne', 'Katze'], ['Sonne', 'Tonne', 'Socke'], ['Kissen', 'wissen', 'Kiste'], ['Hase', 'Nase', 'Hose']],
  ];
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
      ['Unsere kleine Forschungsreise.', ['❓ Frage stellen', '💭 Vermutung überlegen', '🔎 Beobachten', '💬 Ergebnis erzählen']],
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
  const options = (n, max) => Array.from(new Set([n, Math.max(0, n - 1), Math.min(max, n + 1), Math.max(0, n - 2), Math.min(max, n + 2)])).slice(0, 3);
  function question(kind, stage, round, rng) {
    rng = rng || Math.random;
    stage = Math.max(1, Math.min(3, Number(stage) || 1));
    round = Math.max(0, Number(round) || 0) % 5;
    const max = [5, 10, 20][stage - 1];
    if (kind === 'rocket') {
      const total = integer(stage === 1 ? 3 : max - 4, max, rng);
      const filled = integer(0, total - 1, rng);
      return { kind, mode: 'fill', prompt: 'Die Rakete braucht ' + total + ' Sterne. Ergänze die leeren Plätze!', total, filled, answer: total - filled,
        hint: 'Jeder leere Platz bekommt einen Stern. Tippe nochmals, um einen Stern wegzunehmen.', explain: filled + ' und ' + (total - filled) + ' ergeben ' + total + '.', transfer: 'Zeige mit deinen Fingern eine andere Zerlegung.' };
    }
    if (kind === 'picnic') {
      const each = integer(1, [3, 5, 10][stage - 1], rng);
      return { kind, mode: 'share', prompt: 'Teile ' + (each * 2) + ' Beeren gerecht zwischen Fuchs und Dachs.', total: each * 2, answer: each,
        hint: 'Tippe abwechselnd auf die beiden Teller. Mit «Zurück» nimmst du die letzte Beere weg.', explain: 'Jedes Tier bekommt ' + each + ' Beeren. ' + each + ' + ' + each + ' = ' + (each * 2) + '.', transfer: 'Wäre es auch gerecht, wenn jemand keinen Hunger hat? Erzählt eure Ideen.' };
    }
    if (kind === 'double') {
      const n = integer(1, [3, 5, 10][stage - 1], rng);
      return { kind, mode: 'choice', prompt: 'Der Zauberspiegel verdoppelt die Sterne. Wie viele sind es zusammen?', n, answer: n * 2, choices: options(n * 2, 20),
        hint: 'Links und rechts sind gleich viele. Zähle beide Gruppen oder rechne ' + n + ' + ' + n + '.', explain: 'Das Doppelte von ' + n + ' ist ' + (n * 2) + '.', transfer: 'Finde das Doppelte mit zwei gleichen Fingerbildern.' };
    }
    if (kind === 'shapes') {
      const target = shapes[(round + stage - 1) % shapes.length];
      const ids = shapes.map(s => s.id);
      return { kind, mode: 'choice', prompt: stage === 2 && target.corners !== 4 ? 'Welche Form hat ' + target.corners + ' Ecken?' : 'Finde: ' + target.name + '.', answer: target.id, choices: ids, rotated: stage === 3,
        hint: target.id === 'circle' ? 'Ein Kreis ist rund und hat keine Ecken.' : target.id === 'square' ? 'Suche vier gleich lange Seiten und vier rechte Ecken.' : target.id === 'rectangle' ? 'Gesucht ist das Rechteck mit zwei langen und zwei kurzen Seiten.' : 'Suche eine Form mit drei Ecken.',
        explain: target.name + ': ' + target.corners + ' Ecken.' + (stage === 3 ? ' Drehen verändert die Form nicht.' : ''), transfer: 'Finde diese Form im Zimmer. Ist ein Quadrat auch ein Rechteck? Sprecht darüber.' };
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
      return { kind, mode: 'order', prompt: row[0] + ' Tippe die Bilder in der richtigen Reihenfolge an.', ordered: row[1].slice(),
        hint: 'Was passiert zuerst? Erzähle die Geschichte Schritt für Schritt. «Neu ordnen» lässt dich nochmals beginnen.', explain: 'Du hast die Schritte geordnet!', transfer: 'Erzähle dazu eine eigene kleine Geschichte oder zeichne sie.' };
    }
    throw new Error('Unknown adventure: ' + kind);
  }
  FK.adventures = { games, question, shapes };
})();
