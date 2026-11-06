/* Original, generated activities inspired by the public teaching descriptions
   reviewed in docs/RESOURCE-RESEARCH.md. No source worksheets or media are used. */
(function () {
  'use strict';
  const FK = window.FK;
  const games = [
    { id: 'treasure', title: 'Waldschatz', emoji: '🧺', color: 'mint', sub: ['Drei Schätze merken', 'Vier Schätze merken', 'Fünf Schätze merken'] },
    { id: 'neighbours', title: 'Nachbarhäuser', emoji: '🏘️', color: 'apricot', sub: ['Nachbarn bis 5', 'Nachbarn bis 10', 'Nachbarn bis 20'] },
    { id: 'compare', title: 'Beerenvergleich', emoji: '🫐', color: 'rose', sub: ['Mengen bis 5', 'Mengen bis 10', 'Mengen bis 20'] },
    { id: 'mirror', title: 'Spiegelmosaik', emoji: '🪞', color: 'sky', sub: ['Vier Felder spiegeln', 'Neun Felder spiegeln', 'Sechzehn Felder spiegeln'] },
    { id: 'tricks', title: 'Rechenfreunde', emoji: '🪄', color: 'sun', sub: ['Tauschen bis 5', 'Nachbaraufgaben bis 10', 'Rund um die Zehn'] },
    { id: 'vowels', title: 'Vokalversteck', emoji: '🔤', color: 'lilac', sub: ['Kurze Bildwörter', 'Längere Bildwörter', 'Genau lesen'] },
    { id: 'survey', title: 'Waldumfrage', emoji: '🍎', color: 'mint', sub: ['Stimmen zählen', 'Mehr oder weniger?', 'Stimmen vergleichen'] },
  ];
  const treasures = [
    ['🍃', 'Blatt'], ['🪶', 'Feder'], ['🍎', 'Apfel'], ['🍄', 'Pilz'], ['🌹', 'Rose'],
    ['👑', 'Krone'], ['🧸', 'Teddy'], ['🔔', 'Glocke'], ['⚽', 'Ball'], ['🥄', 'Löffel'], ['🐌', 'Schnecke'], ['📖', 'Buch'],
  ].map(([emoji, name]) => ({ emoji, name }));
  // A reusable content pack; the library's existing questions keep their pool.
  const woodlandTreasures = [['🍃', 'Blatt'], ['🪶', 'Feder'], ['🍄', 'Pilz'], ['🪨', 'Stein'], ['🍓', 'Walderdbeere']]
    .map(([emoji, name]) => ({ emoji, name }));
  // Deliberately no missing letter inside a vowel pair such as au, ei or ie.
  const words = [
    [['Lama', '🦙'], ['Nase', '👃'], ['Rose', '🌹'], ['Sofa', '🛋️'], ['Lupe', '🔍'], ['Hase', '🐰'], ['Hose', '👖'], ['Velo', '🚲']],
    [['Banane', '🍌'], ['Tomate', '🍅'], ['Rakete', '🚀'], ['Melone', '🍉'], ['Roboter', '🤖'], ['Kamera', '📷'], ['Kamel', '🐫'], ['Feder', '🪶']],
    [['Hund', '🐶'], ['Mond', '🌙'], ['Fisch', '🐟'], ['Katze', '🐱'], ['Sonne', '☀️'], ['Pilz', '🍄'], ['Wolke', '☁️'], ['Blume', '🌸']],
  ];
  const fruit = [{ id: 'apple', emoji: '🍎', name: 'Apfel' }, { id: 'pear', emoji: '🍐', name: 'Birne' }, { id: 'berry', emoji: '🍓', name: 'Erdbeere' }];
  const int = (rng, a, b) => a + Math.floor(rng() * (b - a + 1));
  function shuffled(values, rng) {
    const a = values.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = int(rng, 0, i); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  function numbers(answer, max, rng) {
    const rest = Array.from({ length: max + 1 }, (_, i) => i).filter(n => n !== answer);
    return shuffled([answer].concat(shuffled(rest, rng).slice(0, 2)), rng);
  }
  function question(kind, stage, round, rng, wordOffset, content) {
    rng = rng || Math.random;
    stage = Math.max(1, Math.min(3, Number(stage) || 1)); round = Math.abs(Number(round) || 0) % 5;
    const max = [5, 10, 20][stage - 1], q = { kind, max };
    if (kind === 'treasure') {
      q.objects = shuffled(content === 'swiss-woodland' ? woodlandTreasures : treasures, rng).slice(0, stage + 2);
      q.missing = int(rng, 0, q.objects.length - 1);
      q.answer = q.objects[q.missing].name;
      q.choices = shuffled([q.objects[q.missing]].concat(shuffled(q.objects.filter((_, i) => i !== q.missing), rng).slice(0, 2)), rng);
      q.prompt = 'Der Fuchs hütet einen Waldschatz. Merke dir die Dinge!';
      q.hint = 'Erfinde eine kleine Geschichte mit den Dingen. Mit «Nochmals schauen» kannst du sie wieder ansehen.';
      q.explain = 'Das fehlende Ding ist: ' + q.answer + '.';
      q.transfer = 'Welche Merkhilfe hat dir geholfen: eine Geschichte, die Reihenfolge oder kleine Gruppen?';
    } else if (kind === 'neighbours') {
      q.n = int(rng, 1, max - 1); q.answer = [q.n - 1, q.n + 1];
      q.choices = shuffled(Array.from({ length: Math.min(5, max + 1) }, (_, i) => Math.min(Math.max(0, q.n - 2), max - Math.min(4, max)) + i), rng);
      q.prompt = 'Wer wohnt direkt vor und direkt nach ' + q.n + '?';
      q.hint = 'Zähle ein Haus zurück und ein Haus weiter. Tippe ein Dach an, wenn du seine Zahl ändern möchtest.';
      q.explain = q.answer[0] + ', ' + q.n + ', ' + q.answer[1] + ' sind direkte Nachbarn.';
      q.transfer = 'Zeige die drei Zahlen mit Fingern oder lege sie mit kleinen Dingen.';
    } else if (kind === 'compare') {
      q.a = int(rng, 0, max); q.b = round === 2 ? q.a : (q.a + int(rng, 1, max)) % (max + 1);
      q.answer = Math.sign(q.b - q.a); q.choices = [-1, 0, 1];
      q.prompt = 'Die Waldtiere vergleichen ihre Beeren. Wo sind mehr?';
      q.hint = 'Jede Beere zählt einmal. Vergleiche die Fünferreihen oder bilde Beerenpaare.';
      q.explain = q.a + (q.a === q.b ? ' = ' : q.a < q.b ? ' < ' : ' > ') + q.b + '. ' + (q.a === q.b ? 'Beide Seiten haben gleich viele.' : (q.a > q.b ? 'Links' : 'Rechts') + ' sind mehr Beeren.');
      q.transfer = 'Lege zwei Mengen aus Steinen. Wann passen alle Steine paarweise zusammen?';
    } else if (kind === 'mirror') {
      q.width = stage + 1; q.rows = stage + 1;
      const cells = q.width * q.rows, filled = Math.min(cells - 1, stage + 1 + round % 3);
      const positions = shuffled(Array.from({ length: cells }, (_, i) => i), rng).slice(0, filled);
      q.left = Array.from({ length: cells }, (_, i) => positions.includes(i));
      q.answer = positions.map(i => Math.floor(i / q.width) * q.width + q.width - 1 - i % q.width).sort((a, b) => a - b);
      q.prompt = 'Baue rechts das Spiegelbild des Waldmosaiks.';
      q.hint = 'Beginne an der Spiegellinie. Ein Feld direkt links von ihr braucht ein Feld direkt rechts von ihr – in derselben Reihe.';
      q.explain = 'Jedes gefüllte Feld hat sein Gegenüber gleich weit von der Spiegellinie entfernt.';
      q.transfer = 'Lege mit Bauklötzen ein eigenes Spiegelmuster. Kann jemand es ergänzen?';
    } else if (kind === 'tricks') {
      q.rule = stage === 1 || round === 0 ? 'swap' : 'neighbour';
      const total = q.rule === 'swap' ? int(rng, 2, max) : stage === 3 ? (round % 2 ? 10 : 11) : int(rng, 2, 9);
      q.knownA = int(rng, 1, total - 1); q.knownB = total - q.knownA; q.knownTotal = total;
      q.delta = q.rule === 'swap' ? 0 : stage === 3 ? (total === 10 ? 1 : -1) : (round % 2 ? 1 : -1);
      q.a = q.rule === 'swap' ? q.knownB : q.knownA;
      q.b = q.rule === 'swap' ? q.knownA : q.knownB + q.delta;
      q.answer = q.a + q.b; q.choices = numbers(q.answer, max, rng);
      q.prompt = 'Diese Rechnung hilft dir. Was ergibt die neue?';
      q.hint = q.rule === 'swap' ? 'Die beiden Mengen tauschen nur den Platz. Es kommt nichts dazu und nichts weg.' : 'Die erste Menge bleibt. Die zweite hat eine Beere ' + (q.delta > 0 ? 'mehr' : 'weniger') + '.';
      q.explain = q.rule === 'swap' ? 'Tauschfreunde! Beide Rechnungen ergeben ' + q.answer + '.' : 'Nachbarfreunde! ' + q.knownTotal + (q.delta > 0 ? ' + 1' : ' − 1') + ' = ' + q.answer + '.';
      q.transfer = 'Erfinde eine eigene Rechnung und eine passende Tausch- oder Nachbaraufgabe.';
    } else if (kind === 'vowels') {
      // A session uses one start offset, supplied by the screen, so its five words differ.
      const entry = words[stage - 1][(round + (wordOffset === undefined ? int(rng, 0, words[stage - 1].length - 1) : wordOffset)) % words[stage - 1].length];
      q.word = entry[0]; q.emoji = entry[1];
      const positions = Array.from(q.word).map((c, i) => /[aeiou]/i.test(c) ? i : -1).filter(i => i >= 0);
      q.index = positions[int(rng, 0, positions.length - 1)]; q.answer = q.word[q.index];
      q.choices = shuffled([q.answer].concat(shuffled(['a', 'e', 'i', 'o', 'u'].filter(c => c !== q.answer), rng).slice(0, stage === 1 ? 2 : stage === 2 ? 3 : 4)), rng);
      q.prompt = 'Ein Vokal hat sich versteckt. Ergänze das Bildwort!';
      q.hint = 'Das Bild zeigt «' + q.word + '». Sprich das Wort oder lass es dir nennen. Welcher Buchstabe fehlt?';
      q.explain = 'Jetzt steht hier «' + q.word + '». Der ergänzte Vokal ist ' + q.answer.toUpperCase() + '.';
      q.transfer = 'Suche den gleichen Vokal in deinem Namen oder in einem anderen Wort.';
    } else if (kind === 'survey') {
      q.fruit = fruit; q.counts = shuffled(stage === 1 ? [0, int(rng, 1, 3), int(rng, 4, 5)] : stage === 2 ? [int(rng, 0, 2), int(rng, 3, 4), int(rng, 5, 7)] : [int(rng, 0, 2), int(rng, 3, 4), int(rng, 5, 6)], rng);
      q.scale = stage === 1 ? 5 : stage === 2 ? 7 : 6;
      q.target = round % 3;
      if (stage === 1) {
        q.task = 'count'; q.answer = q.counts[q.target]; q.choices = numbers(q.answer, 5, rng);
        q.prompt = 'Wie viele Stimmen hat ' + fruit[q.target].name + '?';
        q.explain = fruit[q.target].name + ' hat ' + q.answer + ' Stimmen.';
      } else if (stage === 2) {
        q.task = round % 2 ? 'least' : 'most';
        const extreme = Math[q.task === 'most' ? 'max' : 'min'](...q.counts);
        q.answer = fruit[q.counts.indexOf(extreme)].id; q.choices = shuffled(fruit.map(f => f.id), rng);
        q.prompt = 'Welches Obst hat die ' + (q.task === 'most' ? 'meisten' : 'wenigsten') + ' Stimmen?';
        q.explain = fruit.find(f => f.id === q.answer).name + ' hat ' + extreme + ' Stimmen.';
      } else {
        q.task = round % 2 ? 'total' : 'difference'; q.other = (q.target + 1) % 3;
        q.answer = q.task === 'total' ? q.counts.reduce((a, b) => a + b, 0) : Math.abs(q.counts[q.target] - q.counts[q.other]);
        q.choices = numbers(q.answer, 20, rng);
        q.prompt = q.task === 'total' ? 'Wie viele Stimmen wurden insgesamt abgegeben?' : 'Wie gross ist der Unterschied zwischen ' + fruit[q.target].name + ' und ' + fruit[q.other].name + '?';
        q.explain = q.task === 'total' ? q.counts.join(' + ') + ' = ' + q.answer + ' Stimmen insgesamt.' : 'Die beiden Mengen unterscheiden sich um ' + q.answer + ' Stimmen.';
      }
      q.hint = 'Eine Pfote ist eine Stimme. ' + (q.task === 'difference' ? 'Vergleiche die beiden Säulen. Zähle die Pfoten, die überstehen.' : q.task === 'total' ? 'Zähle die Stimmen aller drei Obstsorten zusammen.' : 'Beginne links. Auch null Stimmen sind möglich.');
      q.transfer = 'Frage andere nach ihrem Lieblingsobst. Zeichne für jede Antwort genau einen Kreis.';
    } else throw new Error('Unknown expedition: ' + kind);
    return q;
  }
  FK.expeditions = { games, question, words, treasures, woodlandTreasures };
})();
