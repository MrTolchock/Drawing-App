/* Shared, serialisable movement rules for the existing Roboterpost grids. */
(function () {
  'use strict';
  const FK = window.FK;
  const walkable = (q, p) => Number.isInteger(p) && p >= 0 && p < q.size * q.size && !q.obstacles.includes(p);
  function validQuestion(q) {
    if (!q || q.kind !== 'robot' || q.mode !== 'route' || !Number.isInteger(q.size) || q.size < 3 || q.size > 5 ||
        !Array.isArray(q.obstacles) || q.obstacles.length > q.size * q.size || new Set(q.obstacles).size !== q.obstacles.length ||
        !q.obstacles.every(p => Number.isInteger(p) && p >= 0 && p < q.size * q.size) || !walkable(q, q.start) || !walkable(q, q.goal) || q.start === q.goal) return false;
    const seen = new Set([q.start]), queue = [q.start];
    for (let i = 0; i < queue.length; i++) {
      const p = queue[i];
      for (const [dx, dy] of [[0, -1], [-1, 0], [0, 1], [1, 0]]) {
        const x = p % q.size + dx, y = Math.floor(p / q.size) + dy, next = y * q.size + x;
        if (x < 0 || x >= q.size || y < 0 || y >= q.size || !walkable(q, next) || seen.has(next)) continue;
        seen.add(next); queue.push(next);
      }
    }
    return seen.has(q.goal);
  }
  const initial = q => ({ position: q.start, history: [q.start], answered: false });
  function restore(q, saved) {
    if (!validQuestion(q) || !saved || !walkable(q, saved.position) || !Array.isArray(saved.history) ||
        !saved.history.length || saved.history.length > 64 || saved.history.at(-1) !== saved.position ||
        saved.answered !== (saved.position === q.goal)) return null;
    for (let i = 0; i < saved.history.length; i++) {
      const p = saved.history[i], before = saved.history[i - 1];
      if (!walkable(q, p) || (i && (before === q.goal || Math.abs(p % q.size - before % q.size) + Math.abs(Math.floor(p / q.size) - Math.floor(before / q.size)) !== 1))) return null;
    }
    return { position: saved.position, history: saved.history.slice(), answered: saved.answered };
  }
  function move(q, state, dx, dy) {
    if (!state || state.answered || !Number.isInteger(dx) || !Number.isInteger(dy) || Math.abs(dx) + Math.abs(dy) !== 1) return null;
    const x = state.position % q.size + dx, y = Math.floor(state.position / q.size) + dy, next = y * q.size + x;
    if (x < 0 || x >= q.size || y < 0 || y >= q.size || !walkable(q, next)) return null;
    return { position: next, history: state.history.concat(next).slice(-64), answered: next === q.goal };
  }
  function undo(q, state) {
    if (!state || state.answered || state.history.length < 2) return null;
    const history = state.history.slice(0, -1);
    return { position: history.at(-1), history, answered: false };
  }
  FK.routes = { validQuestion, initial, restore, move, undo };
})();
