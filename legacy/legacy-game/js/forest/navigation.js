/* World coordinates and safe free walking, independent of drawing and story saves. */
export const WORLD = Object.freeze({ minX: -38, maxX: 38, minZ: -27, maxZ: 43, cell: 0.75 });
export const PLACES = Object.freeze([
  { id: 'lookout', caption: 'Unser Herzbaum, der Bach und ein ganzer Wald!', x: -29, z: -8, name: 'Weitblickhügel', picture: 'hill', text: 'Wow, so weit kann ich schauen! Dort steht unser Herzbaum. Und dort schlängelt sich der Bach durch den ganzen Wald.' },
  { id: 'meadow', caption: 'Ganz langsam. Dann kommen die Schmetterlinge näher.', x: -27, z: 16, name: 'Schmetterlingswiese', picture: 'butterfly', text: 'Psst, ganz langsam. Schau, wie die Schmetterlinge von Blüte zu Blüte tanzen! Wenn ich stillhalte, kommen sie ganz nah.' },
  { id: 'log', caption: 'Im alten Stamm leuchten kleine Pilze.', x: 28, z: -15, name: 'Leuchtpilzstamm', picture: 'mushroom', text: 'Oh! In diesem alten Baumstamm leuchten kleine Pilze. Ein winziger Zauberwald mitten im grossen Wald!' },
  { id: 'spring', caption: 'Hier beginnt die Reise unseres Bachs.', x: -4.8, z: -22, name: 'Bachquelle', picture: 'waterfall', text: 'Plitsch, platsch! Hier springt unser Bach über die Felsen. Ich könnte den glitzernden Tropfen stundenlang zuschauen.' },
  { id: 'pond', caption: 'Psst! Zwischen den Seerosen schwimmt ein Fisch.', x: -3.2, z: 33, name: 'Stiller Teich', picture: 'fish', text: 'Hast du das gesehen? Ein Fisch! Ganz leise, kleiner Fuchs. Dann traut er sich wieder aus den Seerosen heraus.' },
  { id: 'cloud', caption: 'Welche Tiere entdeckst du in den Wolken?', x: 29, z: 32, name: 'Wolkenhügel', picture: 'cloud', text: 'Hier oben kitzelt der Wind meine Ohren. Diese Wolke sieht aus wie Hase! Welche Tiere entdeckst du am Himmel?' },
]);
const hills = [[-29, -8, 10, 4.7], [29, 32, 11, 5.3], [-26, 35, 9, 2.6], [29, -17, 9, 2.4], [-19, -25, 8, 2.2]];
export function terrainHeight(x, z) {
  let y = 0;
  for (const [cx, cz, radius, peak] of hills) {
    const t = Math.max(0, 1 - Math.hypot(x - cx, z - cz) / radius);
    y += peak * t * t * (3 - 2 * t);
  }
  return y;
}
const finite = p => p && Number.isFinite(p.x) && Number.isFinite(p.z);
const distance = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
export function createNavigation(model, obstacles = []) {
  const { minX, maxX, minZ, maxZ, cell } = WORLD;
  const columns = Math.floor((maxX - minX) / cell) + 1, rows = Math.floor((maxZ - minZ) / cell) + 1;
  const point = index => ({ x: minX + index % columns * cell, z: minZ + Math.floor(index / columns) * cell });
  const indexOf = p => Math.round((p.z - minZ) / cell) * columns + Math.round((p.x - minX) / cell);
  let cachedSignature = '', blocked = new Uint8Array(columns * rows);
  function crossing(p, state) {
    if (Math.abs(p.z - 12) < 1.12 && p.x > -3.1 && p.x < 5.2) return true;
    if (state.bridgeRepaired && Math.abs(p.z + 7) < 1.04 && p.x > -3.1 && p.x < 4.4) return true;
    if (state.bridgeRepaired && state.greetingSeen && Math.abs(p.z - 29) < 1.1 && p.x > -5.55 && p.x < 6.55) return true;
    if (state.contributions?.[model.STORIES]) {
      const a = model.nodes.kingfisher, b = model.nodes.owl, dx = b.x - a.x, dz = b.z - a.z;
      const t = ((p.x - a.x) * dx + (p.z - a.z) * dz) / (dx * dx + dz * dz);
      if (t >= 0 && t <= 1 && Math.hypot(p.x - a.x - t * dx, p.z - a.z - t * dz) < 0.88) return true;
    }
    return false;
  }
  function walkable(p, state = model.get()) {
    if (!finite(p) || p.x < minX + 0.5 || p.x > maxX - 0.5 || p.z < minZ + 0.5 || p.z > maxZ - 0.5) return false;
    // Rounded woodland edges, water and solid trunks are real obstacles, not path rails.
    if (Math.pow(Math.abs(p.x) / 39, 8) + Math.pow(Math.abs(p.z - 8) / 36, 8) > 1) return false;
    if (Math.abs(p.x - model.riverX(p.z)) < model.riverHalfWidth(p.z) + 0.34 && !crossing(p, state)) return false;
    return !obstacles.some(o => (!o.available || o.available(state)) && Math.hypot(p.x - o.x, p.z - o.z) < o.radius + 0.34);
  }
  function nearest(p, state = model.get(), bank = 0) {
    if (!finite(p)) return null;
    const target = { x: Math.max(minX + 1, Math.min(maxX - 1, p.x)), z: Math.max(minZ + 1, Math.min(maxZ - 1, p.z)) };
    if (walkable(target, state) && (!bank || Math.sign(target.x - model.riverX(target.z)) === bank)) return target;
    let best = null, bestDistance = Infinity;
    for (let radius = cell; radius <= 12 && !best; radius += cell) {
      const count = Math.ceil(2 * Math.PI * radius / (cell * 0.55));
      for (let i = 0; i < count; i++) {
        const a = i / count * Math.PI * 2, candidate = { x: target.x + Math.sin(a) * radius, z: target.z + Math.cos(a) * radius };
        if (bank && Math.sign(candidate.x - model.riverX(candidate.z)) !== bank) continue;
        const d = distance(candidate, target);
        if (d < bestDistance && walkable(candidate, state)) { best = candidate; bestDistance = d; }
      }
    }
    return best;
  }
  function clearLine(a, b, state = model.get()) {
    const length = distance(a, b), steps = Math.ceil(length / 0.22);
    for (let i = 0; i <= steps; i++) {
      const t = steps ? i / steps : 0;
      if (!walkable({ x: a.x + (b.x - a.x) * t, z: a.z + (b.z - a.z) * t }, state)) return false;
    }
    return true;
  }
  function refresh(state) {
    const signature = [state.bridgeRepaired, state.greetingSeen, ...Object.keys(state.contributions || {}).sort()].join('|');
    if (cachedSignature === signature) return;
    cachedSignature = signature;
    for (let i = 0; i < blocked.length; i++) blocked[i] = walkable(point(i), state) ? 0 : 1;
  }
  function gridPoint(p, state) {
    const initial = indexOf(p), x = initial % columns, z = Math.floor(initial / columns);
    for (let radius = 0; radius < 5; radius++) {
      let best = null, length = Infinity;
      for (let dx = -radius; dx <= radius; dx++) for (let dz = -radius; dz <= radius; dz++) {
        const gx = x + dx, gz = z + dz, id = gz * columns + gx;
        if (gx < 0 || gx >= columns || gz < 0 || gz >= rows || blocked[id]) continue;
        const target = point(id), d = distance(p, target);
        if (d < length && clearLine(p, target, state)) { best = id; length = d; }
      }
      if (best !== null) return best;
    }
    return null;
  }
  function route(from, to) {
    if (!finite(from) || !finite(to)) return [];
    const state = model.get(), start = nearest(from, state);
    const inWater = Math.abs(to.x - model.riverX(to.z)) < model.riverHalfWidth(to.z) + 0.3 && !crossing(to, state);
    const end = nearest(to, state, inWater ? Math.sign(from.x - model.riverX(from.z)) : 0);
    if (!start || !end) return [];
    if (clearLine(start, end, state)) return [end];
    refresh(state);
    const first = gridPoint(start, state), last = gridPoint(end, state);
    if (first === null || last === null) return [];
    const costs = new Float64Array(blocked.length); costs.fill(Infinity); costs[first] = 0;
    const parents = new Int32Array(blocked.length); parents.fill(-1);
    const closed = new Uint8Array(blocked.length), heap = [];
    function push(id, score) { let i = heap.length; heap.push({ id, score }); while (i) { const parent = (i - 1) >> 1; if (heap[parent].score <= score) break; heap[i] = heap[parent]; i = parent; } heap[i] = { id, score }; }
    function pop() { const result = heap[0], tail = heap.pop(); if (heap.length) { let i = 0; while (i * 2 + 1 < heap.length) { let child = i * 2 + 1; if (child + 1 < heap.length && heap[child + 1].score < heap[child].score) child++; if (heap[child].score >= tail.score) break; heap[i] = heap[child]; i = child; } heap[i] = tail; } return result.id; }
    push(first, distance(point(first), end));
    while (heap.length) {
      const current = pop(); if (closed[current]) continue; if (current === last) break; closed[current] = 1;
      const x = current % columns, z = Math.floor(current / columns);
      for (let dz = -1; dz <= 1; dz++) for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dz) continue;
        const nx = x + dx, nz = z + dz, next = nz * columns + nx;
        if (nx < 0 || nx >= columns || nz < 0 || nz >= rows || blocked[next] || closed[next]) continue;
        if (dx && dz && (blocked[z * columns + nx] || blocked[nz * columns + x])) continue;
        const candidate = costs[current] + Math.hypot(dx, dz) * cell;
        if (candidate >= costs[next] || !clearLine(point(current), point(next), state)) continue;
        costs[next] = candidate; parents[next] = current; push(next, candidate + distance(point(next), end));
      }
    }
    if (first !== last && parents[last] < 0) return [];
    const raw = [end]; let id = last;
    while (id !== first) { raw.push(point(id)); id = parents[id]; }
    raw.push(point(first)); raw.push(start); raw.reverse();
    // Keep only safe turns: the fox may cross a meadow, but never cut a river bend.
    const result = []; let anchor = start, cursor = 1;
    while (cursor < raw.length) {
      let furthest = cursor;
      for (let i = cursor + 1; i < raw.length; i++) if (clearLine(anchor, raw[i], state)) furthest = i;
      result.push(raw[furthest]); anchor = raw[furthest]; cursor = furthest + 1;
    }
    return result;
  }
  function move(from, dx, dz) {
    if (!finite(from) || !Number.isFinite(dx) || !Number.isFinite(dz)) return from;
    const state = model.get(), steps = Math.max(1, Math.ceil(Math.hypot(dx, dz) / 0.16));
    let p = { x: from.x, z: from.z };
    for (let i = 0; i < steps; i++) {
      const next = { x: p.x + dx / steps, z: p.z + dz / steps };
      if (walkable(next, state)) p = next;
      else if (walkable({ x: next.x, z: p.z }, state)) p.x = next.x;
      else if (walkable({ x: p.x, z: next.z }, state)) p.z = next.z;
    }
    return p;
  }
  return { route, move, nearest, walkable, clearLine, crossing };
}
