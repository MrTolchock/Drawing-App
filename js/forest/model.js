/* Persistent world, independent puzzle sessions and a fixed ten-milestone story. */
(function () {
  'use strict';
  const FK = window.FK, story = FK.forestStory;
  const { QUEST, REST, TRAIL, WATER, GARDEN, STORIES, CLEARING, SEATING, INVITE, quests, chapters } = story;
  const KEY = 'farbtupf.forest.v1';
  const practiceDefs = Object.fromEntries(Object.values(story.collections).flat().map(pack => [pack.id, { ...pack, practice: true,
    picture: { pattern: 'bridge', treasure: 'rest', robot: 'sign' }[pack.game], rewardGroup: { pattern: 'learn', treasure: 'expedition', robot: 'adventure' }[pack.game] }]));
  const nodes = {
    home: { x: -8, z: 8 }, west: { x: -13, z: 6 }, bend: { x: -14, z: -1 }, brook: { x: -10, z: -7 },
    beaver: { x: -5, z: -4.8 }, bridgeWest: { x: -2.8, z: -7 }, bridgeEast: { x: 4, z: -7 }, hare: { x: 8.3, z: -2.8 },
    garden: { x: 12, z: 2 }, east: { x: 9, z: 10 }, fordEast: { x: 4.8, z: 12 }, fordWest: { x: -2.8, z: 12 }, south: { x: -6, z: 11 },
    mossTurn: { x: 22, z: 4 }, mossPath: { x: 25, z: 14 }, hedgehog: { x: 19, z: 14 },
    hollowBend: { x: 15, z: 21 }, hollowApproach: { x: 9, z: 23 }, owl: { x: 6, z: 25 },
    pondEast: { x: 6.2, z: 29 }, pondWest: { x: -5.2, z: 29 }, kingfisher: { x: -9.6, z: 23.1 },
    reeds: { x: -15, z: 21 }, reedReturn: { x: -22, z: 13 }, reedBend: { x: -21, z: 3 },
  };
  const residents = { beaver: { x: -5.8, z: -8.9 }, hare: { x: 9.2, z: -6.7 }, hedgehog: { x: 21, z: 17 }, owl: { x: 8.7, z: 28 }, kingfisher: { x: -6.4, z: 25.4 } };
  const edges = [
    ['home', 'west'], ['west', 'bend'], ['bend', 'brook'], ['brook', 'beaver'], ['beaver', 'bridgeWest'],
    ['home', 'south'], ['south', 'fordWest'], ['fordWest', 'fordEast'], ['fordEast', 'east'], ['east', 'garden'], ['garden', 'hare'], ['hare', 'bridgeEast'],
    ['bridgeWest', 'bridgeEast', 'bridge'], ['garden', 'mossTurn', 'world'], ['mossTurn', 'mossPath', 'world'], ['mossPath', 'hedgehog', 'world'],
    ['hedgehog', 'hollowBend', 'world'], ['hollowBend', 'hollowApproach', 'world'], ['hollowApproach', 'owl', 'world'],
    ['owl', 'pondEast', 'world'], ['pondEast', 'pondWest', 'world'], ['pondWest', 'kingfisher', 'world'], ['kingfisher', 'reeds', 'world'],
    ['reeds', 'reedReturn', 'world'], ['reedReturn', 'reedBend', 'world'], ['reedBend', 'bend', 'world'],
    ['garden', 'hedgehog', GARDEN], ['owl', 'kingfisher', STORIES],
  ];
  const distance = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
  const copy = value => JSON.parse(JSON.stringify(value));
  const riverX = z => 0.8 + Math.sin((z + 5) * 0.16);
  const riverHalfWidth = z => 1.75 + Math.sin(z * 0.21) * 0.15 + 2.4 * Math.exp(-Math.pow((z - 25) / 5, 2));
  const tokens = ['🔵', '⭐', '❤️'];
  const definition = id => Object.hasOwn(quests, id) ? quests[id] : Object.hasOwn(practiceDefs, id) ? practiceDefs[id] : undefined;
  const fresh = () => ({ version: 1, welcomed: false, met: Object.fromEntries(Object.keys(residents).map(id => [id, false])),
    position: { ...nodes.home }, accepted: false, demoSeen: false, bridgeRepaired: false, payoffSeen: false, greetingSeen: false,
    contributions: {}, activity: null, activities: {}, practices: {}, guidanceSeen: {}, familyGuidanceSeen: {}, payoffsSeen: {}, chapterSeen: {},
    endingUnlocked: false, endingSeen: false, endingReplay: false, endingPage: 0 });
  function validPattern(q) {
    return !!(q && Array.isArray(q.sequence) && q.sequence.length >= 4 && q.sequence.length <= 12 && q.sequence.every(v => tokens.includes(v)) &&
      tokens.includes(q.answer) && Array.isArray(q.choices) && q.choices.length === 3 && new Set(q.choices).size === 3 && q.choices.every(v => tokens.includes(v)));
  }
  function validMemory(q) {
    const names = FK.expeditions.woodlandTreasures.map(o => o.name);
    const items = list => Array.isArray(list) && list.length === 3 && new Set(list.map(o => o?.name)).size === 3 &&
      list.every(o => o && names.includes(o.name) && typeof o.emoji === 'string' && o.emoji.length < 8);
    return !!(q && items(q.objects) && Number.isInteger(q.missing) && q.missing >= 0 && q.missing < 3 &&
      q.answer === q.objects[q.missing].name && items(q.choices) && q.choices.every(o => q.objects.some(p => p.name === o.name)));
  }
  function restoreActivity(a, def, complete) {
    if (!a || a.id !== def.id || a.game !== def.game || a.stage !== 1 || !Number.isInteger(a.round) || a.round < 0 || a.round > 5 || (a.round === 5 && !complete)) return null;
    const base = { id: def.id, game: def.game, stage: 1, round: a.round, finished: a.round === 5 && complete, rewardRecorded: a.rewardRecorded === true };
    if (def.game === 'pattern') {
      const valid = validPattern(a.question), choices = a.choices;
      return { ...base, question: valid ? a.question : null,
        choices: Array.isArray(choices) && choices.length === 3 && new Set(choices).size === 3 && choices.every(v => tokens.includes(v)) ? choices : null,
        answered: valid && a.answered === true };
    }
    if (def.game === 'treasure') { const valid = validMemory(a.question); return { ...base, question: valid ? a.question : null, concealed: valid && a.concealed === true, answered: valid && a.concealed === true && a.answered === true }; }
    const snapshot = a.question?.size === 3 ? FK.routes.restore(a.question, a) : null;
    return { ...base, question: snapshot ? a.question : null, ...(snapshot || { position: null, history: [], answered: false }) };
  }
  function restore() {
    const base = fresh();
    try {
      const saved = JSON.parse(localStorage.getItem(KEY)); if (!saved || saved.version !== 1) return base;
      for (const key of ['welcomed', 'accepted', 'demoSeen', 'payoffSeen', 'greetingSeen', 'endingUnlocked', 'endingSeen', 'endingReplay']) base[key] = saved[key] === true;
      for (const [id, done] of Object.entries(saved.contributions || {})) if (/^[a-z0-9-]{1,80}$/.test(id) && done === true) base.contributions[id] = true;
      base.bridgeRepaired = saved.bridgeRepaired === true || base.contributions[QUEST] === true;
      if (base.bridgeRepaired) base.contributions[QUEST] = true;
      for (const id of Object.keys(residents)) base.met[id] = saved.met?.[id] === true;
      if (saved.position && Number.isFinite(saved.position.x) && Number.isFinite(saved.position.z) && Math.abs(saved.position.x) < 40 && Math.abs(saved.position.z) < 40) base.position = saved.position;
      for (const [id, def] of Object.entries(quests)) {
        const a = restoreActivity(id === QUEST ? saved.activity : saved.activities?.[id], def, base.contributions[id] === true);
        if (id === QUEST) base.activity = a; else if (a) base.activities[id] = a;
        base.guidanceSeen[id] = saved.guidanceSeen?.[id] === true;
        base.payoffsSeen[id] = saved.payoffsSeen?.[id] === true;
      }
      for (const [id, def] of Object.entries(practiceDefs)) {
        const a = restoreActivity(saved.practices?.[id], def, saved.practices?.[id]?.round === 5);
        if (a) base.practices[id] = a;
        base.guidanceSeen[id] = saved.guidanceSeen?.[id] === true;
      }
      for (const game of ['pattern', 'treasure', 'robot']) base.familyGuidanceSeen[game] = saved.familyGuidanceSeen?.[game] === true;
      if (base.demoSeen) base.familyGuidanceSeen.pattern = true;
      if (base.guidanceSeen[REST]) base.familyGuidanceSeen.treasure = true;
      if (base.guidanceSeen[TRAIL]) base.familyGuidanceSeen.robot = true;
      for (const chapter of ['reconnect', 'gather']) base.chapterSeen[chapter] = saved.chapterSeen?.[chapter] === true;
      base.endingPage = Number.isInteger(saved.endingPage) ? Math.max(0, Math.min(3, saved.endingPage)) : 0;
      if (base.endingSeen) base.endingUnlocked = true;
      return base;
    } catch (_) { return base; }
  }
  let state = restore();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) { /* continue in memory */ } return copy(state); }
  const activity = id => id === QUEST ? state.activity : Object.hasOwn(quests, id) ? state.activities[id] : Object.hasOwn(practiceDefs, id) ? state.practices[id] : null;
  function residentAvailable(id) { return Object.hasOwn(residents, id) && (id === 'beaver' || id === 'hare' || (state.bridgeRepaired && state.greetingSeen)); }
  function activeEdges(repaired) { return edges.filter(e => !e[2] || (e[2] === 'bridge' ? repaired : e[2] === 'world' ? state.bridgeRepaired && state.greetingSeen : state.contributions[e[2]] === true)); }
  function payoffSeen(id) { return id === QUEST ? state.payoffSeen && state.greetingSeen : state.payoffsSeen[id] === true; }
  function chapterReady(chapter) { return !!chapters[chapter] && chapters[chapter].every(id => state.contributions[id] === true && payoffSeen(id)); }
  function questAvailable(id) {
    const def = definition(id); if (!def) return false;
    if (def.practice) return residentAvailable(def.resident);
    if (id === QUEST) return true;
    if (def.chapter === 'meet') return state.bridgeRepaired && state.greetingSeen;
    if (def.chapter === 'reconnect') return state.chapterSeen.reconnect === true && chapterReady('meet');
    return state.chapterSeen.gather === true && chapterReady('reconnect');
  }
  function objective() {
    if (!state.bridgeRepaired) return { kind: 'visit', resident: 'beaver', quest: QUEST };
    if (!state.greetingSeen) return { kind: 'visit', resident: 'hare', quest: QUEST };
    for (const [chapter, next] of [['meet', 'reconnect'], ['reconnect', 'gather'], ['gather', 'ending']]) {
      for (const id of chapters[chapter]) if (state.contributions[id] && !payoffSeen(id)) return { kind: 'visit', resident: quests[id].resident, quest: id };
      const pending = chapters[chapter].find(id => !state.contributions[id]);
      if (pending) return { kind: 'visit', resident: quests[pending].resident, quest: pending };
      if (next === 'ending') return state.endingSeen ? { kind: 'free', resident: 'home' } : { kind: 'ending', resident: 'home' };
      if (!state.chapterSeen[next]) return { kind: 'chapter', chapter: next, resident: 'home' };
    }
    return { kind: 'free', resident: 'home' };
  }
  function projection(p, a, b) {
    const dx = b.x - a.x, dz = b.z - a.z;
    const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.z - a.z) * dz) / (dx * dx + dz * dz)));
    return { x: a.x + dx * t, z: a.z + dz * t, t };
  }
  function nearest(p, repaired, bank) {
    let best;
    for (const edge of activeEdges(repaired)) {
      const point = projection(p, nodes[edge[0]], nodes[edge[1]]);
      if (bank && Math.sign(point.x - riverX(point.z)) !== bank) continue;
      const d = distance(p, point);
      if (!best || d < best.distance) best = { point, edge, distance: d };
    }
    return best;
  }
  function route(from, target, repaired = state.bridgeRepaired) {
    if (!from || !target || ![from.x, from.z, target.x, target.z].every(Number.isFinite)) return [];
    const start = nearest(from, repaired);
    const water = Math.abs(target.x - riverX(target.z)) < riverHalfWidth(target.z) && Math.abs(target.z - 12) > 1.7 && Math.abs(target.z - 29) > 1.7 && !(state.contributions[STORIES] && Math.abs(target.z - 24) < 1.8) && !(repaired && Math.abs(target.z + 7) < 1.6);
    const end = nearest(target, repaired, water ? Math.sign(from.x - riverX(from.z)) : null);
    if (!start || !end) return [];
    const graph = {}, positions = { ...nodes, start: start.point, end: end.point };
    const add = (a, b, weight) => { (graph[a] ||= []).push([b, weight]); (graph[b] ||= []).push([a, weight]); };
    for (const [a, b] of activeEdges(repaired)) add(a, b, distance(nodes[a], nodes[b]));
    for (const [key, hit] of [['start', start], ['end', end]]) {
      add(key, hit.edge[0], distance(hit.point, nodes[hit.edge[0]]));
      add(key, hit.edge[1], distance(hit.point, nodes[hit.edge[1]]));
    }
    if (start.edge === end.edge) add('start', 'end', distance(start.point, end.point));
    const cost = { start: 0 }, previous = {}, visited = new Set();
    while (true) {
      const current = Object.keys(cost).filter(k => !visited.has(k)).sort((a, b) => cost[a] - cost[b])[0];
      if (!current || current === 'end') break;
      visited.add(current);
      for (const [next, length] of graph[current] || []) {
        const candidate = cost[current] + length;
        if (cost[next] === undefined || candidate < cost[next]) { cost[next] = candidate; previous[next] = current; }
      }
    }
    if (cost.end === undefined) return [];
    const keys = ['end'];
    while (keys[0] !== 'start') keys.unshift(previous[keys[0]]);
    return keys.map(k => ({ x: positions[k].x, z: positions[k].z })).filter((p, i, list) => !i || distance(p, list[i - 1]) > 0.025);
  }
  const api = {
    KEY, QUEST, REST, TRAIL, WATER, GARDEN, STORIES, CLEARING, SEATING, INVITE, quests, nodes, residents, edges, distance, riverX, riverHalfWidth, route,
    definition, residentAvailable, questAvailable, chapterReady, objective,
    get: () => copy(state), getActivity: (id = QUEST) => activity(id) ? copy(activity(id)) : null,
    isComplete: id => state.contributions[id] === true,
    hasDemo: (id = QUEST) => id === QUEST ? state.demoSeen : state.guidanceSeen[id] === true || state.familyGuidanceSeen[definition(id)?.game] === true,
    snap(point, repaired = state.bridgeRepaired) { const p = nearest(point, repaired).point; return { x: p.x, z: p.z }; },
    position(point) { if (point && Number.isFinite(point.x) && Number.isFinite(point.z)) { const p = nearest(point, state.bridgeRepaired).point; state.position = { x: p.x, z: p.z }; save(); } },
    welcome() { state.welcomed = true; return save(); },
    visit(id) { if (residents[id]) { state.met[id] = true; save(); } },
    demoSeen(id = QUEST) { const def = definition(id); if (!def) return; if (id === QUEST) state.demoSeen = true; state.guidanceSeen[id] = true; state.familyGuidanceSeen[def.game] = true; save(); },
    startActivity(id = QUEST) {
      const def = definition(id); if (!def || !questAvailable(id) || (!def.practice && state.contributions[id])) return null;
      if (id === QUEST) state.accepted = true;
      const a = activity(id) || { id, game: def.game, stage: 1, round: 0, question: null, answered: false, finished: false, rewardRecorded: false,
        ...(def.game === 'pattern' ? { choices: null } : def.game === 'treasure' ? { concealed: false } : { position: null, history: [] }) };
      if (id === QUEST) state.activity = a; else if (def.practice) state.practices[id] = a; else state.activities[id] = a;
      save(); return copy(a);
    },
    startPractice(game, resident) {
      const pack = story.collections[resident]?.find(p => p.game === game); if (!pack || !residentAvailable(resident)) return null;
      if (state.practices[pack.id]?.finished) delete state.practices[pack.id];
      return this.startActivity(pack.id);
    },
    question(q, choices, id = QUEST) {
      const a = activity(id), def = definition(id); if (!a || a.finished || !def) return;
      if (def.game === 'robot') { if (!FK.routes.validQuestion(q) || q.size !== 3) return; a.question = copy(q); Object.assign(a, FK.routes.initial(q)); }
      else if (def.game === 'treasure') { if (!validMemory(q)) return; a.question = copy(q); a.concealed = false; a.answered = false; }
      else { if (!validPattern(q) || !Array.isArray(choices) || choices.length !== 3 || new Set(choices).size !== 3 || !choices.every(v => tokens.includes(v))) return; a.question = copy(q); a.choices = choices.slice(); a.answered = false; }
      save();
    },
    conceal(value, id = REST) { const a = activity(id); if (!a || a.finished || a.answered || !a.question || definition(id)?.game !== 'treasure') return; a.concealed = value === true; save(); },
    answer(value, id = QUEST) {
      const a = activity(id), game = definition(id)?.game;
      if (!a || a.finished || !a.question || game === 'robot' || (game === 'treasure' && !a.concealed) || value !== a.question.answer) return false;
      a.answered = true; save(); return true;
    },
    moveRoute(dx, dy, id = TRAIL) {
      const a = activity(id); if (!a?.question || a.finished || definition(id)?.game !== 'robot') return null;
      const next = FK.routes.move(a.question, a, dx, dy); if (!next) return null; Object.assign(a, next); save(); return copy(next);
    },
    undoRoute(id = TRAIL) {
      const a = activity(id); if (!a?.question || a.finished || definition(id)?.game !== 'robot') return null;
      const next = FK.routes.undo(a.question, a); if (!next) return null; Object.assign(a, next); save(); return copy(next);
    },
    advance(id = QUEST) {
      const a = activity(id), def = definition(id); if (!a || !a.answered || a.finished || !def) return false;
      a.round++; a.question = null; a.answered = false;
      if (def.game === 'pattern') a.choices = null; else if (def.game === 'treasure') a.concealed = false; else { a.position = null; a.history = []; }
      if (a.round === 5) { a.finished = true; if (!def.practice) { state.contributions[id] = true; if (id === QUEST) { state.bridgeRepaired = true; state.payoffSeen = false; } else state.payoffsSeen[id] = false; } }
      save(); return a.finished;
    },
    rewardRecorded(id = QUEST) { const a = activity(id); if (a?.finished) { a.rewardRecorded = true; save(); } },
    seePayoff(id = QUEST) { if (state.contributions[id]) { if (id === QUEST) state.payoffSeen = true; else state.payoffsSeen[id] = true; save(); } },
    greet() { if (state.bridgeRepaired) { state.greetingSeen = true; save(); } },
    questForResident(resident) {
      const related = Object.values(quests).filter(q => q.resident === resident || q.partner === resident);
      return related.find(q => state.contributions[q.id] && !payoffSeen(q.id)) || related.find(q => !state.contributions[q.id] && questAvailable(q.id)) || null;
    },
    acknowledgeChapter(chapter) {
      if (!['reconnect', 'gather'].includes(chapter) || !chapterReady(chapter === 'reconnect' ? 'meet' : 'reconnect')) return false;
      state.chapterSeen[chapter] = true; save(); return true;
    },
    beginEnding(replay = false) {
      if (!chapterReady('gather') || !state.chapterSeen.gather) return false;
      state.endingUnlocked = true;
      if (replay && state.endingSeen) { state.endingReplay = true; state.endingPage = 0; }
      save(); return true;
    },
    endingNext() {
      if (!state.endingUnlocked || (state.endingSeen && !state.endingReplay)) return false;
      if (state.endingPage < 3) { state.endingPage++; save(); return false; }
      state.endingSeen = true; state.endingReplay = false; save(); return true;
    },
    stopReplay() { if (state.endingReplay) { state.endingReplay = false; save(); } },
  };
  state.position = api.snap(state.position);
  FK.forestState = api;
})();
