/* Farbtupf: original exercise content; see docs/LEARNING.md for curriculum review. */
(function () {
  'use strict';
  const FK = window.FK;
  const stages = ['🌱 Entdecken', '🌼 Üben', '🌳 Knobeln'];
  const games = [
    { id: 'count', title: 'Zählgarten', emoji: '🐞', color: 'mint', sub: ['Mengen bis 5', 'Mengen bis 10', 'Mengen bis 20'] },
    { id: 'add', title: 'Znüni-Rechenfreunde', emoji: '🍎', color: 'sun', sub: ['Znüni zusammenlegen', 'Plus, Minus & Tauschfreunde', 'Rechentricks bis 20'] },
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
      ['Wer säugt seine Jungen?', 'Die Katze 🐈', ['Die Katze 🐈', 'Der Vogel 🐦', 'Der Schmetterling 🦋'], 'Säugetiere geben ihren Jungen Milch.'],
      ['Was wird aus einer Raupe?', 'Ein Schmetterling 🦋', ['Ein Schmetterling 🦋', 'Ein Fisch 🐟', 'Ein Igel 🦔'], 'Aus der Raupe wird eine Puppe, dann ein Schmetterling.'],
      ['Was schlüpft aus dem Vogelei?', 'Ein Vogel 🐣', ['Ein Vogel 🐣', 'Ein Fisch 🐟', 'Eine Blume 🌼'], 'Aus dem Vogelei schlüpft ein kleiner Vogel. Wir beobachten das Nest mit Abstand.'],
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
      const answer = round === 4 ? 0 : 1 + integer(max - 1, rng);
      return { prompt: 'Wie viele Marienkäfer sind im Garten?', answer, choices: choices(answer, max, rng), count: answer, hint: 'Zähle nur die Marienkäfer. Du kannst jeden einmal antippen und markieren. Kein Käfer bedeutet null.' };
    }
    if (kind === 'add') {
      const subtract = stage > 1 && round % 2 === 1;
      let a = subtract ? 2 + integer(max - 2, rng) : 1 + integer(max - 2, rng);
      let b = subtract ? 1 + integer(a - 1, rng) : 1 + integer(max - a - 1, rng);
      let known = null;
      if (round === 4) {
        a = 1 + integer(max - 2, rng); b = 1 + integer(max - a - 1, rng);
        known = { a:b, b:a, answer:a+b, rule:'swap' };
      } else if (stage > 1 && round === 2) {
        a = 1 + integer(max - 3, rng); b = 2 + integer(max - a - 2, rng);
        known = { a, b:b-1, answer:a+b-1, rule:'neighbour' };
      }
      const answer = subtract ? a - b : a + b;
      return { prompt: subtract ? 'Ein paar Znüni gehen weg. Wie viele bleiben?' : 'Znüni kommen dazu. Wie viele sind es zusammen?', answer, choices: choices(answer, max, rng), a, b, subtract, known, hint: subtract ? 'Gib dem Hasen seine Äpfel. Zähle dann nur die Äpfel beim Fuchs.' : 'Lege die Äpfel aus dem Korb zum Fuchs. Zähle dann alle zusammen.' };
    }
    if (kind === 'pattern') {
      const units = stage === 1 ? ['🔵', '⭐'] : stage === 2 ? ['🔵', '🔵', '⭐'] : round % 2 ? ['🔵', '⭐', '⭐'] : ['🔵', '⭐', '❤️'];
      const length = (stage === 1 ? 4 : 6) + round % 3;
      return { prompt: 'Was kommt als Nächstes in den Musterzug?', sequence: Array.from({ length }, (_, i) => units[i % units.length]), answer: units[length % units.length], choices: ['🔵', '⭐', '❤️'], hint: 'Suche die kleine Gruppe, die sich wiederholt.' };
    }
    if (kind !== 'nature') throw new Error('Unknown learning game: ' + kind);
    const q = nature[stage - 1][round % 5];
    const cues = [['feather','shell','fin','legs','spines'], ['🐟','🐦','🐝','🦔','🌱'], ['legs','milk','🐛','🪺','🐝']];
    return { prompt: q[0], answer: q[1], choices: q[2].slice(), hint: q[3], cue:cues[stage-1][round%5] };
  }
  FK.learning = { stages, games, question, stage: () => FK.friendsLibrary?.active ? 1 : Math.max(1, Math.min(3, Number(FK.settings.get('learning.stage')) || 1)) };
})();
