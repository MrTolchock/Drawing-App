/* Farbtupf: original exercise content; see docs/LEARNING.md for curriculum review. */
(function () {
  'use strict';
  const FK = window.FK;
  const stages = ['🌱 Entdecken', '🌼 Üben', '🌳 Knobeln'];
  const games = [
    { id: 'count', title: 'Zählgarten', emoji: '🐞', color: 'mint', sub: ['Mengen bis 5', 'Mengen bis 10', 'Mengen bis 20'] },
    { id: 'add', title: 'Znüni-Rechnen', emoji: '🍎', color: 'sun', sub: ['Zusammen bis 5', 'Plus und Minus bis 10', 'Plus und Minus bis 20'] },
    { id: 'pattern', title: 'Musterzug', emoji: '🚂', color: 'sky', sub: ['Immer abwechselnd', 'Zwei und eins', 'Neue Muster'] },
    { id: 'nature', title: 'Naturdetektive', emoji: '🦔', color: 'rose', sub: ['Tiere entdecken', 'Wo leben Tiere?', 'Genau beobachten'] },
  ];
  const nature = [
    [
      ['Wer hat Federn?', '🐦', ['🐦', '🐟', '🐈'], 'Ein Vogel hat Federn.'],
      ['Wer hat ein Schneckenhaus?', '🐌', ['🐌', '🐕', '🐝'], 'Die Schnecke trägt ihr Haus.'],
      ['Wer hat Flossen?', '🐟', ['🐟', '🐦', '🐈'], 'Mit Flossen schwimmt der Fisch.'],
      ['Wer hat sechs Beine?', '🐝', ['🐝', '🐈', '🐦'], 'Die Biene ist ein Insekt mit sechs Beinen.'],
      ['Wer trägt Stacheln?', '🦔', ['🦔', '🐕', '🐟'], 'Stacheln schützen den Igel.'],
    ],
    [
      ['Wo lebt ein Fisch?', 'Im Wasser 🌊', ['Im Wasser 🌊', 'Im Vogelnest 🪺', 'Im Bienenstock 🍯'], 'Fische brauchen Wasser zum Leben.'],
      ['Wo bauen viele Vögel ihr Nest?', 'Im Baum 🌳', ['Im Baum 🌳', 'Unter Wasser 🌊', 'Im Ameisenhaufen 🐜'], 'Viele Vögel bauen ihr Nest im Baum.'],
      ['Wo findet eine Biene Nektar?', 'An Blüten 🌼', ['An Blüten 🌼', 'Auf Steinen 🪨', 'Im Schnee ❄️'], 'Blüten bieten der Biene Nahrung.'],
      ['Wo kann sich ein Igel verstecken?', 'Im Laubhaufen 🍂', ['Im Laubhaufen 🍂', 'Im See 🌊', 'Im Vogelnest 🪺'], 'Ein Laubhaufen bietet Schutz.'],
      ['Was braucht eine Pflanze?', 'Wasser und Licht 💧☀️', ['Wasser und Licht 💧☀️', 'Nur Steine 🪨', 'Nur Dunkelheit 🌑'], 'Mit Wasser und Licht kann sie wachsen.'],
    ],
    [
      ['Welches Tier ist ein Insekt?', 'Die Biene 🐝', ['Die Biene 🐝', 'Die Spinne 🕷️', 'Der Igel 🦔'], 'Insekten haben sechs Beine. Spinnen haben acht.'],
      ['Wer säugt seine Jungen?', 'Die Katze 🐈', ['Die Katze 🐈', 'Die Amsel 🐦', 'Der Schmetterling 🦋'], 'Säugetiere geben ihren Jungen Milch.'],
      ['Was wird aus einer Raupe?', 'Ein Schmetterling 🦋', ['Ein Schmetterling 🦋', 'Ein Fisch 🐟', 'Ein Igel 🦔'], 'Aus der Raupe wird eine Puppe, dann ein Schmetterling.'],
      ['Warum lassen wir ein Vogelnest in Ruhe?', 'Damit die Jungen sicher sind 🪺', ['Damit die Jungen sicher sind 🪺', 'Damit Steine wachsen 🪨', 'Damit es schneit ❄️'], 'Beobachte Tiere mit Abstand.'],
      ['Was hilft Bienen im Garten?', 'Viele Blüten 🌼', ['Viele Blüten 🌼', 'Nur Beton 🧱', 'Plastikblumen 🧸'], 'Verschiedene Blüten bieten Nahrung.'],
    ],
  ];
  const integer = (max, rng) => Math.floor(rng() * (max + 1));
  function choices(answer, max, rng) {
    const out = [answer];
    // Close distractors, always distinct and inside the practiced number range.
    for (let d = 1; out.length < Math.min(3, max + 1); d++) {
      for (const v of [answer - d, answer + d]) if (v >= 0 && v <= max && !out.includes(v) && out.length < 3) out.push(v);
    }
    return out.sort((a, b) => a - b);
  }
  function question(kind, stage, round, rng) {
    rng = rng || Math.random;
    stage = Math.max(1, Math.min(3, Number(stage) || 1));
    const max = [5, 10, 20][stage - 1];
    if (kind === 'count') {
      const answer = round === 0 ? 0 : 1 + integer(max - 1, rng);
      return { prompt: 'Wie viele Marienkäfer sind im Garten?', answer, choices: choices(answer, max, rng), count: answer, hint: 'Tippe jeden Käfer einmal an. Ein leeres Feld bedeutet null.' };
    }
    if (kind === 'add') {
      const subtract = stage > 1 && round % 2 === 1;
      const a = 1 + integer(max - 1, rng);
      const b = integer(subtract ? a : max - a, rng);
      const answer = subtract ? a - b : a + b;
      return { prompt: subtract ? 'Ein paar Znüni gehen weg. Wie viele bleiben?' : 'Znüni kommen dazu. Wie viele sind es zusammen?', answer, choices: choices(answer, max, rng), a, b, subtract, hint: subtract ? 'Zähle die Äpfel, die bleiben. Durchgestrichene gehen weg.' : 'Zähle beide Gruppen zusammen.' };
    }
    if (kind === 'pattern') {
      const units = stage === 1 ? ['🔵', '⭐'] : stage === 2 ? ['🔵', '🔵', '⭐'] : round % 2 ? ['🔵', '⭐', '⭐'] : ['🔵', '⭐', '❤️'];
      const length = (stage === 1 ? 4 : 6) + round % 3;
      return { prompt: 'Was kommt als Nächstes in den Musterzug?', sequence: Array.from({ length }, (_, i) => units[i % units.length]), answer: units[length % units.length], choices: ['🔵', '⭐', '❤️'], hint: 'Suche die kleine Gruppe, die sich wiederholt.' };
    }
    if (kind !== 'nature') throw new Error('Unknown learning game: ' + kind);
    const q = nature[stage - 1][round % 5];
    return { prompt: q[0], answer: q[1], choices: q[2].slice(), hint: q[3] };
  }
  FK.learning = { stages, games, question, stage: () => Math.max(1, Math.min(3, Number(FK.settings.get('learning.stage')) || 1)) };
})();
