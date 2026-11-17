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
  quest('QUEST', 'pattern', 'meet', 'beaver', 'hare', 'bridge', 'Die kleine Brücke', 'Die Brücke ist noch nicht fertig. Hilfst du mir?', 'Oh, danke! Endlich kann ich meinen alten Freund Hase wiedersehen. Ich habe ihn so vermisst!');
  quest('REST', 'treasure', 'meet', 'hedgehog', null, 'rest', 'Ein Platz zum Ausruhen', 'Merken wir uns meine Waldschätze. Dann richten wir meinen Ruheplatz ein.', 'Ahh, wie weich das ist! Danke! Endlich ein gemütlicher Platz. Komm, setz dich zu mir. Jetzt bin ich nicht mehr allein.');
  quest('TRAIL', 'robot', 'meet', 'owl', null, 'sign', 'Der alte Wegweiser', 'Am Wegweiser fehlt das Bild. Finde auf der Karte den Weg zu mir.', 'Huhu, du hast es gefunden! Das Herz zeigt wieder nach Hause. Jetzt finden meine Freunde zu mir. Ich habe so viele Geschichten für sie!');
  quest('WATER', 'treasure', 'meet', 'kingfisher', null, 'water', 'Ein Blick aufs Wasser', 'Schau mit mir genau hin. Finden wir die kleinen Waldschätze wieder? Dann machen wir den Platz am Wasser frei.', 'Oh, wie das Wasser glitzert! Danke, dass du bei mir geblieben bist. Zu zweit ist mein Lieblingsplatz noch viel schöner.');
  quest('GARDEN', 'pattern', 'reconnect', 'hare', 'hedgehog', 'path', 'Der Gartenweg', 'Der Igel und ich möchten uns öfter besuchen. Hilfst du uns beim kurzen Gartenweg?', 'Juhui! Jetzt kann ich jeden Tag zum Igel hüpfen. Hast du sein glückliches Schnäuzchen gesehen? Das verdanken wir dir!');
  quest('STORIES', 'robot', 'reconnect', 'owl', 'kingfisher', 'stories', 'Geschichten am Wasser', 'Der Eisvogel kennt einen stillen Platz am Wasser. Zeige uns den Weg. Dann können wir dort Geschichten erzählen.', 'Huhu! Eisvogel, ich bin da! Endlich können wir uns unsere Geschichten erzählen. Danke für den Weg, kleiner Fuchs!');
  quest('CLEARING', 'treasure', 'reconnect', 'beaver', null, 'clearing', 'Unser alter Treffpunkt', 'Am Herzbaum möchten wir uns wieder treffen. Hilfst du mir, die kleinen Waldschätze zu ordnen?', 'Weisst du noch, wie leer es hier war? Jetzt ist wieder Platz für alle! Und schau: Unser Herzbaum bekommt immer mehr Blätter.');
  quest('SEATING', 'pattern', 'gather', 'hedgehog', 'beaver', 'bench', 'Ein Platz für alle', 'Alle sollen am Herzbaum gemütlich sitzen. Hilfst du dem Biber und mir?', 'Für Biber, Hase, Waldkauz, Eisvogel und dich! Niemand muss allein sitzen. Oh, ich freue mich so auf unser Treffen!');
  quest('INVITE', 'robot', 'gather', 'kingfisher', 'hare', 'invitation', 'Die Einladung', 'Der Hase und ich laden unsere Freunde ein. Zeige auf der Karte den Weg. Dann bringen wir die Bilder zum Herzbaum.', 'Alle haben unsere Einladung bekommen! Hörst du schon ihre Schritte? Komm schnell zum Herzbaum. Sie warten auf dich!');
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
