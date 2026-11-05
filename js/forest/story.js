/* Authored story milestones are fixed; optional collections never extend them. */
(function () {
  'use strict';
  const FK = window.FK;
  const ids = {
    QUEST: 'bridge-neighbours-v1', REST: 'moss-rest-v1', TRAIL: 'owl-trail-sign-v1', WATER: 'kingfisher-view-v1',
    GARDEN: 'garden-path-v1', STORIES: 'waterside-stories-v1', CLEARING: 'meeting-clearing-v1', SEATING: 'shared-seating-v1', INVITE: 'forest-invitation-v1',
  };
  const names = { beaver: 'Biber', hare: 'Hase', hedgehog: 'Igel', owl: 'Waldkauz', kingfisher: 'Eisvogel' };
  const quests = {};
  function quest(key, game, chapter, resident, partner, picture, title, request, result) {
    const id = ids[key];
    quests[id] = { id, game, stage: 1, chapter, resident, partner, picture, title, request, result,
      rewardGroup: { pattern: 'learn', treasure: 'expedition', robot: 'adventure' }[game] };
  }
  quest('QUEST', 'pattern', 'meet', 'beaver', 'hare', 'bridge', 'Die kleine Brücke', 'Die Brücke ist noch nicht fertig. Hilfst du mir?', 'Jetzt können wir uns wieder besuchen.');
  quest('REST', 'treasure', 'meet', 'hedgehog', null, 'rest', 'Ein Platz zum Ausruhen', 'Merken wir uns meine Waldschätze. Dann richten wir meinen Ruheplatz ein.', 'Danke! Hier kann ich mich ausruhen.');
  quest('TRAIL', 'robot', 'meet', 'owl', null, 'sign', 'Der alte Wegweiser', 'Am Wegweiser fehlt das Bild. Finde auf der Karte den Weg zu mir.', 'Das Herz auf dem Wegweiser zeigt wieder zum Herzbaum.');
  quest('WATER', 'treasure', 'meet', 'kingfisher', null, 'water', 'Ein Blick aufs Wasser', 'Schau mit mir genau hin. Finden wir die kleinen Waldschätze wieder? Dann machen wir den Platz am Wasser frei.', 'Jetzt können wir das Wasser sehen. Komm bald wieder!');
  quest('GARDEN', 'pattern', 'reconnect', 'hare', 'hedgehog', 'path', 'Der Gartenweg', 'Der Igel und ich möchten uns öfter besuchen. Hilfst du uns beim kurzen Gartenweg?', 'Jetzt führt ein kurzer Weg vom Garten zum Mooshain.');
  quest('STORIES', 'robot', 'reconnect', 'owl', 'kingfisher', 'stories', 'Geschichten am Wasser', 'Der Eisvogel kennt einen stillen Platz am Wasser. Zeige uns den Weg. Dann können wir dort Geschichten erzählen.', 'Unser Geschichtenplatz am Wasser ist fertig. Hier können wir einander besuchen.');
  quest('CLEARING', 'treasure', 'reconnect', 'beaver', null, 'clearing', 'Unser alter Treffpunkt', 'Am Herzbaum möchten wir uns wieder treffen. Hilfst du mir, die kleinen Waldschätze zu ordnen?', 'Die Lichtung ist wieder einladend. Unsere Freunde finden hier zusammen.');
  quest('SEATING', 'pattern', 'gather', 'hedgehog', 'beaver', 'bench', 'Ein Platz für alle', 'Alle sollen am Herzbaum gemütlich sitzen. Hilfst du dem Biber und mir?', 'Jetzt ist am Herzbaum ein gemütlicher Platz für alle.');
  quest('INVITE', 'robot', 'gather', 'kingfisher', 'hare', 'invitation', 'Die Einladung', 'Der Hase und ich laden unsere Freunde ein. Zeige auf der Karte den Weg. Dann bringen wir die Bilder zum Herzbaum.', 'Unsere Freunde sind eingeladen. Komm zum Herzbaum!');
  const chapters = {
    meet: [ids.QUEST, ids.REST, ids.TRAIL, ids.WATER],
    reconnect: [ids.GARDEN, ids.STORIES, ids.CLEARING], gather: [ids.SEATING, ids.INVITE],
  };
  Object.values(chapters).forEach(Object.freeze); Object.freeze(chapters);
  const collections = Object.fromEntries(Object.keys(names).map(resident => [resident, ['pattern', 'treasure', 'robot'].map(game => ({
    id: resident + '-' + game + '-practice-v1', game, resident, stage: 1,
    title: { pattern: 'Muster entdecken', treasure: 'Waldschätze merken', robot: 'Wege finden' }[game],
  }))]));
  FK.forestStory = { ...ids, quests, chapters, names, collections,
    placeNames: { beaver: 'Am Bach', hare: 'Im Garten', hedgehog: 'Im Mooshain', owl: 'In der Geschichtenmulde', kingfisher: 'Am Schilfteich' } };
})();
