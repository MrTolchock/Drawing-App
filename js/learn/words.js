/* Farbtupf – Wörter, Silben und kleine Sätze zum Lesenlernen (ohne Ton: das Bild zeigt, ob es stimmt).
   w:   Wort mit Silbentrennung «-» (für die Silbenbögen)
   e:   Emoji, das genau dieses Wort zeigt (Emoji ≤ 13.0, iOS 14+)
   lvl: 1 = zwei offene Silben (Konsonant + Vokal), 2 = drei offene Silben oder eine geschlossene,
        3 = geschlossene Silben, Doppelkonsonanten, au/ei/ie/sch/ch/ck/tz, Umlaute */
(function () {
  'use strict';
  const FK = window.FK;

  const list = [
    // Stufe 1
    { w: 'Ma-mi', e: '👩‍👧', lvl: 1 },
    { w: 'Pa-pi', e: '👨‍👧', lvl: 1 },
    { w: 'O-ma', e: '👵', lvl: 1 },
    { w: 'O-pa', e: '👴', lvl: 1 },
    { w: 'La-ma', e: '🦙', lvl: 1 },
    { w: 'So-fa', e: '🛋️', lvl: 1 },
    { w: 'Ro-se', e: '🌹', lvl: 1 },
    { w: 'Na-se', e: '👃', lvl: 1 },
    { w: 'Ha-se', e: '🐰', lvl: 1 },
    { w: 'Do-se', e: '🥫', lvl: 1 },
    { w: 'Ho-se', e: '👖', lvl: 1 },
    { w: 'Lu-pe', e: '🔍', lvl: 1 },
    { w: 'Ve-lo', e: '🚲', lvl: 1 },
    { w: 'Ki-wi', e: '🥝', lvl: 1 },
    { w: 'Ju-do', e: '🥋', lvl: 1 },
    { w: 'U-fo', e: '🛸', lvl: 1 },
    { w: 'Mo-fa', e: '🛵', lvl: 1 },
    { w: 'Li-mo', e: '🥤', lvl: 1 },
    { w: 'Ka-nu', e: '🛶', lvl: 1 },
    // Stufe 2
    { w: 'Pi-lot', e: '🧑‍✈️', lvl: 2 },
    { w: 'Ba-na-ne', e: '🍌', lvl: 2 },
    { w: 'To-ma-te', e: '🍅', lvl: 2 },
    { w: 'Ra-ke-te', e: '🚀', lvl: 2 },
    { w: 'Me-lo-ne', e: '🍉', lvl: 2 },
    { w: 'Ro-bo-ter', e: '🤖', lvl: 2 },
    { w: 'Ka-mel', e: '🐫', lvl: 2 },
    { w: 'Ra-di-o', e: '📻', lvl: 2 },
    { w: 'Ti-ger', e: '🐯', lvl: 2 },
    { w: 'Ka-me-ra', e: '📷', lvl: 2 },
    { w: 'Bi-ber', e: '🦫', lvl: 2 },
    { w: 'Ko-met', e: '☄️', lvl: 2 },
    { w: 'I-gel', e: '🦔', lvl: 2 },
    { w: 'Ho-nig', e: '🍯', lvl: 2 },
    { w: 'Fe-der', e: '🪶', lvl: 2 },
    { w: 'Na-del', e: '🪡', lvl: 2 },
    { w: 'Ga-bel', e: '🍴', lvl: 2 },
    { w: 'Pa-ket', e: '📦', lvl: 2 },
    // Stufe 3
    { w: 'Maus', e: '🐭', lvl: 3 },
    { w: 'Haus', e: '🏠', lvl: 3 },
    { w: 'Son-ne', e: '☀️', lvl: 3 },
    { w: 'Mond', e: '🌙', lvl: 3 },
    { w: 'Kat-ze', e: '🐱', lvl: 3 },
    { w: 'Hund', e: '🐶', lvl: 3 },
    { w: 'Fisch', e: '🐟', lvl: 3 },
    { w: 'Zug', e: '🚂', lvl: 3 },
    { w: 'Au-to', e: '🚗', lvl: 3 },
    { w: 'Blu-me', e: '🌸', lvl: 3 },
    { w: 'Ap-fel', e: '🍎', lvl: 3 },
    { w: 'Kä-se', e: '🧀', lvl: 3 },
    { w: 'Rüeb-li', e: '🥕', lvl: 3 },
    { w: 'Gip-fe-li', e: '🥐', lvl: 3 },
    { w: 'Guetz-li', e: '🍪', lvl: 3 },
    { w: 'Schog-gi', e: '🍫', lvl: 3 },
    { w: 'Trot-ti-nett', e: '🛴', lvl: 3 },
    { w: 'Ei', e: '🥚', lvl: 3 },
    { w: 'Bus', e: '🚌', lvl: 3 },
    { w: 'Tram', e: '🚋', lvl: 3 },
    { w: 'Glo-cke', e: '🔔', lvl: 3 },
    { w: 'Tan-ne', e: '🌲', lvl: 3 },
    { w: 'Kuh', e: '🐄', lvl: 3 },
    { w: 'Schaf', e: '🐑', lvl: 3 },
    { w: 'Stern', e: '⭐', lvl: 3 },
    { w: 'Pilz', e: '🍄', lvl: 3 },
    { w: 'Kro-ne', e: '👑', lvl: 3 },
    { w: 'Bir-ne', e: '🍐', lvl: 3 },
    { w: 'Ze-bra', e: '🦓', lvl: 3 },
    { w: 'Schnee-mann', e: '⛄', lvl: 3 },
    { w: 'Lö-we', e: '🦁', lvl: 3 },
    { w: 'Pin-gu-in', e: '🐧', lvl: 3 },
    { w: 'Herz', e: '❤️', lvl: 3 },
    { w: 'Buch', e: '📖', lvl: 3 },
    { w: 'Bett', e: '🛏️', lvl: 3 },
    { w: 'Uhr', e: '⏰', lvl: 3 },
    { w: 'Baum', e: '🌳', lvl: 3 },
    { w: 'Schwein', e: '🐷', lvl: 3 },
    { w: 'Frosch', e: '🐸', lvl: 3 },
    { w: 'Schne-cke', e: '🐌', lvl: 3 },
    { w: 'Ku-chen', e: '🍰', lvl: 3 },
  ];

  const vowels = ['a', 'e', 'i', 'o', 'u'];
  const syllables = {};
  'M L S N R T F P B D H K W G'.split(' ').forEach((c) => {
    syllables[c] = vowels.map((v) => c + v);
  });

  const phrases = [
    { t: 'Die Sonne ist gelb.', e: '☀️', check: { emoji: '☀️', color: 'gelb' } },
    { t: 'Der Ball ist rot.', e: '⚽', check: { emoji: '⚽', color: 'rot' } },
    { t: 'Das Auto ist blau.', e: '🚗', check: { emoji: '🚗', color: 'blau' } },
    { t: 'Die Maus ist grau.', e: '🐭', check: { emoji: '🐭', color: 'grau' } },
    { t: 'Der Fisch ist orange.', e: '🐟', check: { emoji: '🐟', color: 'orange' } },
    { t: 'Das Herz ist rot.', e: '❤️', check: { emoji: '❤️', color: 'rot' } },
    { t: 'Der Baum ist grün.', e: '🌳', check: { emoji: '🌳', color: 'gruen' } },
    { t: 'Die Blume ist rosa.', e: '🌸', check: { emoji: '🌸', color: 'rosa' } },
    { t: 'Der Hut ist braun.', e: '👒', check: { emoji: '👒', color: 'braun' } },
    { t: 'Das Haus ist gelb.', e: '🏠', check: { emoji: '🏠', color: 'gelb' } },
    { t: 'Der Stern ist gelb.', e: '⭐', check: { emoji: '⭐', color: 'gelb' } },
    { t: 'Die Kuh ist braun.', e: '🐄', check: { emoji: '🐄', color: 'braun' } },
    { t: 'Das Velo ist grün.', e: '🚲', check: { emoji: '🚲', color: 'gruen' } },
    { t: 'Der Ballon ist blau.', e: '🎈', check: { emoji: '🎈', color: 'blau' } },
    { t: 'Die Glace ist rosa.', e: '🍦', check: { emoji: '🍦', color: 'rosa' } },
    { t: 'Das Boot ist rot.', e: '⛵', check: { emoji: '⛵', color: 'rot' } },
    { t: 'Der Apfel ist grün.', e: '🍎', check: { emoji: '🍎', color: 'gruen' } },
    { t: 'Die Banane ist gelb.', e: '🍌', check: { emoji: '🍌', color: 'gelb' } },
    { t: 'Das Rüebli ist orange.', e: '🥕', check: { emoji: '🥕', color: 'orange' } },
    { t: 'Der Pilz ist rot.', e: '🍄', check: { emoji: '🍄', color: 'rot' } },
    { t: 'Die Traube ist violett.', e: '🍇', check: { emoji: '🍇', color: 'violett' } },
  ];

  // Pictures that also fit the other word (a Tanne is a Baum): «Wort und Bild» never shows them side by side.
  const near = [
    ['🌳', '🌲'],
    ['🚂', '🚋'],
    ['🌸', '🌹'],
    ['⭐', '☄️'],
  ];

  FK.words = { list, syllables, phrases, near };
})();
