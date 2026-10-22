/* Farbklecks – Stempel (Emoji-Sticker) und Belohnungs-Sticker fürs Sammelalbum. Emoji ≤ 13.0 (iOS 14+). */
(function () {
  'use strict';
  const FK = window.FK;

  FK.STICKERS = [
    { icon: '🐶', name: 'Tiere', items: [['🐶', 'Hund'], ['🐱', 'Katze'], ['🐰', 'Hase'], ['🦊', 'Fuchs'], ['🐻', 'Bär'], ['🐼', 'Panda'], ['🐯', 'Tiger'], ['🦁', 'Löwe'], ['🐵', 'Affe'], ['🐸', 'Frosch'], ['🐷', 'Schwein'], ['🐔', 'Huhn'], ['🐧', 'Pinguin'], ['🦉', 'Eule'], ['🦄', 'Einhorn'], ['🐢', 'Schildkröte'], ['🐙', 'Krake'], ['🐠', 'Fisch'], ['🐳', 'Wal'], ['🦖', 'Dino'], ['🐞', 'Marienkäfer'], ['🦋', 'Schmetterling'], ['🐝', 'Biene'], ['🐌', 'Schnecke']] },
    { icon: '🌸', name: 'Natur', items: [['🌸', 'Blüte'], ['🌻', 'Sonnenblume'], ['🌷', 'Tulpe'], ['🌹', 'Rose'], ['🍀', 'Kleeblatt'], ['🌲', 'Tanne'], ['🌴', 'Palme'], ['🍄', 'Pilz'], ['🌈', 'Regenbogen'], ['☀️', 'Sonne'], ['🌙', 'Mond'], ['⭐', 'Stern'], ['☁️', 'Wolke'], ['⚡', 'Blitz'], ['❄️', 'Schneeflocke'], ['💧', 'Tropfen'], ['🔥', 'Feuer'], ['🍁', 'Blatt']] },
    { icon: '🍦', name: 'Essen', items: [['🍎', 'Apfel'], ['🍓', 'Erdbeere'], ['🍌', 'Banane'], ['🍒', 'Kirschen'], ['🍉', 'Melone'], ['🍇', 'Trauben'], ['🥕', 'Rüebli'], ['🍦', 'Glace'], ['🍭', 'Lolli'], ['🧁', 'Muffin'], ['🍩', 'Donut'], ['🍪', 'Guetzli'], ['🍕', 'Pizza'], ['🥐', 'Gipfeli'], ['🎂', 'Torte'], ['🥨', 'Bretzel'], ['🍿', 'Popcorn'], ['🍰', 'Kuchen']] },
    { icon: '🎈', name: 'Spass', items: [['🎈', 'Ballon'], ['🎁', 'Geschenk'], ['❤️', 'Herz'], ['💜', 'Herz'], ['👑', 'Krone'], ['💎', 'Diamant'], ['🚀', 'Rakete'], ['🚗', 'Auto'], ['🚒', 'Feuerwehr'], ['🚁', 'Helikopter'], ['⛵', 'Segelboot'], ['🏰', 'Schloss'], ['⚽', 'Fussball'], ['🪁', 'Drachen'], ['🎵', 'Musik'], ['🧸', 'Teddy'], ['👻', 'Gespenst'], ['🤖', 'Roboter'], ['😀', 'Lachen'], ['😎', 'Cool'], ['🥳', 'Party'], ['🌟', 'Glitzerstern'], ['🎨', 'Farben'], ['✏️', 'Bleistift']] },
    { icon: '🇨🇭', name: 'Schweiz', items: [['🇨🇭', 'Schweiz'], ['🏔️', 'Berg'], ['🐄', 'Kuh'], ['🔔', 'Glocke'], ['🧀', 'Käse'], ['🫕', 'Fondue'], ['🍫', 'Schoggi'], ['🚡', 'Gondel'], ['🚂', 'Zug'], ['⌚', 'Uhr'], ['⛷️', 'Skifahrer'], ['🏂', 'Snowboard'], ['🐐', 'Geiss'], ['🦌', 'Hirsch'], ['🦅', 'Adler'], ['🦢', 'Schwan'], ['🍏', 'Apfel'], ['🌄', 'Sonnenaufgang']] },
  ];

  // Collected in the Sammelalbum: one new sticker for every STARS_PER_STICKER stars.
  FK.REWARDS = [
    ['🦄', 'Einhorn'], ['🐉', 'Drache'], ['🧚', 'Fee'], ['🦸', 'Superheld'], ['🧜', 'Meerjungfrau'], ['🏆', 'Pokal'],
    ['🎠', 'Karussell'], ['🎡', 'Riesenrad'], ['🎢', 'Achterbahn'], ['🛸', 'Ufo'], ['🪐', 'Planet'], ['🌋', 'Vulkan'],
    ['🦩', 'Flamingo'], ['🦚', 'Pfau'], ['🦜', 'Papagei'], ['🐬', 'Delfin'], ['🦈', 'Hai'], ['🦒', 'Giraffe'],
    ['🦓', 'Zebra'], ['🐘', 'Elefant'], ['🦔', 'Igel'], ['🐿️', 'Eichhörnchen'], ['🦦', 'Otter'], ['🐨', 'Koala'],
    ['🎪', 'Zirkus'], ['🎭', 'Theater'], ['🎸', 'Gitarre'], ['🥁', 'Trommel'], ['🎺', 'Trompete'], ['🎻', 'Geige'],
    ['🧁', 'Muffin'], ['🍬', 'Bonbon'], ['🧇', 'Waffel'], ['🍡', 'Spiess'], ['🌮', 'Taco'], ['🥞', 'Pfannkuchen'],
    ['🌠', 'Sternschnuppe'], ['☄️', 'Komet'], ['🔮', 'Zauberkugel'], ['🪄', 'Zauberstab'], ['👸', 'Prinzessin'], ['🤴', 'Prinz'],
  ];
  FK.STARS_PER_STICKER = 3;
  FK.rewardsUnlocked = () => Math.min(FK.REWARDS.length, Math.floor(FK.progress.stars() / FK.STARS_PER_STICKER));
})();
