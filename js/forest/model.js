/* Heart Tree: world/session data and safe path navigation. No learning keys change. */
(function () {
  'use strict';
  const FK = window.FK;
  const KEY = 'farbtupf.forest.v1';
  const QUEST = 'bridge-neighbours-v1';
  const REST = 'moss-rest-v1';
  const quests = { [QUEST]: { game: 'pattern', stage: 1 }, [REST]: { game: 'treasure', stage: 1 } };
  const nodes = {
    home: { x: -8, z: 8 }, west: { x: -13, z: 6 }, bend: { x: -14, z: -1 },
    brook: { x: -10, z: -7 }, beaver: { x: -5, z: -4.8 }, bridgeWest: { x: -2.8, z: -7 },
    bridgeEast: { x: 4, z: -7 }, hare: { x: 8.3, z: -2.8 }, garden: { x: 12, z: 2 },
    east: { x: 9, z: 10 }, fordEast: { x: 4.8, z: 12 }, fordWest: { x: -2.8, z: 12 },
    south: { x: -6, z: 11 }, mossTurn: { x: 15, z: 6 }, mossPath: { x: 19, z: 10 }, hedgehog: { x: 19, z: 14 },
  };
  const residents = { beaver: { x: -5.8, z: -8.9 }, hare: { x: 9.2, z: -6.7 }, hedgehog: { x: 21, z: 17 } };
  const edges = [
    ['home', 'west'], ['west', 'bend'], ['bend', 'brook'], ['brook', 'beaver'], ['beaver', 'bridgeWest'],
    ['home', 'south'], ['south', 'fordWest'], ['fordWest', 'fordEast'], ['fordEast', 'east'],
    ['east', 'garden'], ['garden', 'hare'], ['hare', 'bridgeEast'],
    ['bridgeWest', 'bridgeEast', 'bridge'],
    ['garden', 'mossTurn', 'grove'], ['mossTurn', 'mossPath', 'grove'], ['mossPath', 'hedgehog', 'grove'],
  ];
  const distance = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
  const copy = value => JSON.parse(JSON.stringify(value));
  const riverX = z => 0.8 + Math.sin((z + 5) * 0.16) * 1.0;
  const tokens = ['🔵', '⭐', '❤️'];
  const fresh = () => ({
    version: 1, welcomed: false, met: { beaver: false, hare: false, hedgehog: false },
    position: { ...nodes.home }, accepted: false, demoSeen: false,
    bridgeRepaired: false, payoffSeen: false, greetingSeen: false,
    contributions: {}, activity: null, activities: {}, guidanceSeen: {}, payoffsSeen: {},
  });
  function validQuestion(q) {
    return q && Array.isArray(q.sequence) && q.sequence.length >= 4 && q.sequence.length <= 12 &&
      q.sequence.every(v => tokens.includes(v)) && tokens.includes(q.answer) &&
      Array.isArray(q.choices) && q.choices.length === 3 && new Set(q.choices).size === 3 && q.choices.every(v => tokens.includes(v));
  }
  function validMemory(q) {
    const names = ['Blatt', 'Feder', 'Pilz', 'Stein', 'Walderdbeere'];
    const items = list => Array.isArray(list) && list.length === 3 && new Set(list.map(o => o?.name)).size === 3 &&
      list.every(o => o && names.includes(o.name) && typeof o.emoji === 'string' && o.emoji.length < 8);
    return q && items(q.objects) && Number.isInteger(q.missing) && q.missing >= 0 && q.missing < 3 &&
      q.answer === q.objects[q.missing].name && items(q.choices) && q.choices.every(o => q.objects.some(p => p.name === o.name));
  }
  function restore() {
    const base = fresh();
    try {
      const saved = JSON.parse(localStorage.getItem(KEY));
      if (!saved || saved.version !== 1) return base;
      for (const key of ['welcomed', 'accepted', 'demoSeen', 'payoffSeen', 'greetingSeen']) base[key] = saved[key] === true;
      base.bridgeRepaired = saved.bridgeRepaired === true || saved.contributions?.[QUEST] === true;
      // Keep stable milestones when later content packs add more activities.
      for (const [id, done] of Object.entries(saved.contributions || {})) {
        if (/^[a-z0-9-]{1,80}$/.test(id) && done === true) base.contributions[id] = true;
      }
      if (base.bridgeRepaired) base.contributions[QUEST] = true;
      for (const id of Object.keys(residents)) base.met[id] = saved.met?.[id] === true;
      if (saved.position && Number.isFinite(saved.position.x) && Number.isFinite(saved.position.z) &&
          Math.abs(saved.position.x) < 40 && Math.abs(saved.position.z) < 40) base.position = saved.position;
      const a = saved.activity;
      if (a && a.id === QUEST && a.game === 'pattern' && a.stage === 1 && Number.isInteger(a.round) && a.round >= 0 && a.round <= 5) {
        base.activity = { id: QUEST, game: 'pattern', stage: 1, round: a.round,
          question: validQuestion(a.question) ? a.question : null,
          choices: Array.isArray(a.choices) && a.choices.length === 3 && new Set(a.choices).size === 3 && a.choices.every(v => tokens.includes(v)) ? a.choices : null,
          answered: a.answered === true && validQuestion(a.question),
          finished: a.round === 5 && base.bridgeRepaired, rewardRecorded: a.rewardRecorded === true };
        if (base.activity.round === 5 && !base.bridgeRepaired) base.activity = null;
      }
      const memory = saved.activities?.[REST];
      if (memory?.id === REST && memory.game === 'treasure' && memory.stage === 1 && Number.isInteger(memory.round) && memory.round >= 0 && memory.round <= 5 &&
          (memory.round < 5 || base.contributions[REST])) {
        const valid = validMemory(memory.question);
        base.activities[REST] = { id: REST, game: 'treasure', stage: 1, round: memory.round,
          question: valid ? memory.question : null, concealed: valid && memory.concealed === true,
          answered: valid && memory.concealed === true && memory.answered === true,
          finished: memory.round === 5 && base.contributions[REST] === true, rewardRecorded: memory.rewardRecorded === true };
      }
      base.guidanceSeen[REST] = saved.guidanceSeen?.[REST] === true;
      base.payoffsSeen[REST] = saved.payoffsSeen?.[REST] === true;
      return base;
    } catch (_) { return base; }
  }
  let state = restore();
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) { /* usable in memory when storage is blocked */ }
    return copy(state);
  }
  function activeEdges(repaired) { return edges.filter(e => !e[2] || (e[2] === 'bridge' ? repaired : state.bridgeRepaired && state.greetingSeen)); }
  const activity = id => id === QUEST ? state.activity : state.activities[id];
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
    const water = Math.abs(target.x - riverX(target.z)) < 1.7 && Math.abs(target.z - 12) > 1.7 && !(repaired && Math.abs(target.z + 7) < 1.6);
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
    KEY, QUEST, REST, quests, nodes, residents, edges, distance, riverX, route,
    get: () => copy(state),
    getActivity: (id = QUEST) => activity(id) ? copy(activity(id)) : null,
    isComplete: id => state.contributions[id] === true,
    hasDemo: (id = QUEST) => id === QUEST ? state.demoSeen : state.guidanceSeen[id] === true,
    snap(point, repaired = state.bridgeRepaired) { const p = nearest(point, repaired).point; return { x: p.x, z: p.z }; },
    position(point) { if (point && Number.isFinite(point.x) && Number.isFinite(point.z)) { const p = nearest(point, state.bridgeRepaired).point; state.position = { x: p.x, z: p.z }; save(); } },
    welcome() { state.welcomed = true; return save(); },
    visit(id) { if (residents[id]) { state.met[id] = true; save(); } },
    demoSeen(id = QUEST) { if (id === QUEST) state.demoSeen = true; else if (quests[id]) state.guidanceSeen[id] = true; save(); },
    startActivity(id = QUEST) {
      if (!quests[id] || state.contributions[id]) return null;
      if (id === REST) {
        if (!state.bridgeRepaired || !state.greetingSeen) return null;
        state.activities[id] ||= { id, ...quests[id], round: 0, question: null, concealed: false, answered: false, finished: false, rewardRecorded: false };
        save(); return copy(state.activities[id]);
      }
      state.accepted = true;
      state.activity ||= { id: QUEST, game: 'pattern', stage: 1, round: 0, question: null, choices: null, answered: false, finished: false, rewardRecorded: false };
      save(); return copy(state.activity);
    },
    question(q, choices, id = QUEST) {
      if (id === REST) {
        const a = activity(id);
        if (!a || a.finished || !validMemory(q)) return;
        a.question = copy(q); a.concealed = false; a.answered = false; save(); return;
      }
      if (!state.activity || state.activity.finished || !validQuestion(q)) return;
      state.activity.question = copy(q); state.activity.choices = choices.slice(); state.activity.answered = false; save();
    },
    conceal(value, id = REST) {
      const a = activity(id);
      if (!a || a.finished || a.answered || !a.question) return;
      a.concealed = value === true; save();
    },
    answer(value, id = QUEST) {
      const a = activity(id);
      if (!a || a.finished || !a.question || (id === REST && !a.concealed) || value !== a.question.answer) return false;
      a.answered = true; save(); return true;
    },
    advance(id = QUEST) {
      const a = activity(id);
      if (!a || !a.answered || a.finished) return false;
      a.round++; a.question = null; a.answered = false;
      if (id === QUEST) a.choices = null; else a.concealed = false;
      if (a.round === 5) {
        a.finished = true; state.contributions[id] = true;
        if (id === QUEST) { state.bridgeRepaired = true; state.payoffSeen = false; }
        else state.payoffsSeen[id] = false;
      }
      save(); return a.finished;
    },
    rewardRecorded(id = QUEST) { const a = activity(id); if (a?.finished) { a.rewardRecorded = true; save(); } },
    seePayoff(id = QUEST) { if (state.contributions[id]) { if (id === QUEST) state.payoffSeen = true; else state.payoffsSeen[id] = true; save(); } },
    greet() { if (state.bridgeRepaired) { state.greetingSeen = true; save(); } },
  };
  state.position = api.snap(state.position);
  FK.forestState = api;
})();
