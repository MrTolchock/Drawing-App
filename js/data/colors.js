/* Farbtupf – die Farbstifte. `word` is the colour word children read in «Farbwörter» mode. */
(function () {
  'use strict';
  const FK = (window.FK = window.FK || {});

  FK.COLORS = [
    { id: 'rot', name: 'Rot', word: 'rot', hex: '#e5322d' },
    { id: 'orange', name: 'Orange', word: 'orange', hex: '#ff8a1f' },
    { id: 'gelb', name: 'Gelb', word: 'gelb', hex: '#ffd60a' },
    { id: 'hellgruen', name: 'Hellgrün', word: 'hellgrün', hex: '#8bd448' },
    { id: 'gruen', name: 'Grün', word: 'grün', hex: '#1f9d55' },
    { id: 'tuerkis', name: 'Türkis', word: 'türkis', hex: '#1cc6c6' },
    { id: 'hellblau', name: 'Hellblau', word: 'hellblau', hex: '#5bc0ff' },
    { id: 'blau', name: 'Blau', word: 'blau', hex: '#2f5bea' },
    { id: 'violett', name: 'Violett', word: 'violett', hex: '#8a4fe0' },
    { id: 'pink', name: 'Pink', word: 'pink', hex: '#ff4fa3' },
    { id: 'rosa', name: 'Rosa', word: 'rosa', hex: '#ffb3d1' },
    { id: 'pfirsich', name: 'Pfirsich', word: 'pfirsich', hex: '#ffc9a0' },
    { id: 'braun', name: 'Braun', word: 'braun', hex: '#8b5a2b' },
    { id: 'grau', name: 'Grau', word: 'grau', hex: '#9aa0b4' },
    { id: 'schwarz', name: 'Schwarz', word: 'schwarz', hex: '#2a2a2e' },
    { id: 'weiss', name: 'Weiss', word: 'weiss', hex: '#ffffff' },
    { id: 'regenbogen', name: 'Regenbogen', word: 'Regenbogen', hex: '#ff3b3b', rainbow: true },
  ];

  FK.color = FK.color || {};
  FK.color.byId = (id) => FK.COLORS.find((c) => c.id === id) || null;
})();
