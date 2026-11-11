/* The big world's layout as plain data (metres; x east, z south, so north is −z and the camera
   looks north). Everything a child can find is listed here: water, trails, crossings, places,
   friends and landmark sites. `terrain.js` turns it into ground and water, `sites.js` into objects.
   See design/world-10x/PLAN.md for the map in words. */

export const EXTENT = {x0: -128, x1: 128, z0: -112, z1: 112};
export const DEN = {x: 0, z: -8};

/* The Rock: an elliptical massif with a plateau. `fall` is the direction (from its centre) in
   which the waterfall drops. */
export const ROCK = {x: 84, z: -80, rx: 36, rz: 30, top: 11.5, fall: 2.135};

/* Still water. `plunge` and `pond` are carved bowls; the swamp is a basin whose hollows fill. */
export const POOLS = [
  {id: 'plunge', x: 61.6, z: -50.2, rx: 5.6, rz: 4.6, rot: .6, level: 1.5, depth: 1.2},
  {id: 'pond', x: 35.5, z: -17.5, rx: 10.5, rz: 7.4, rot: -Math.PI / 4, level: .9, depth: 1.3},
];
export const SWAMP = {x: -18, z: 80, rx: 31, rz: 25, level: -1.2};

/* Running water, upstream first. `from`/`to` name the pool a stream leaves or enters; `drop` is
   the fall below the source pool (the beaver dam). */
export const STREAMS = [
  {id: 'spring', pts: [[97, -89], [90, -82], [82, -73], [74, -65], [68.6, -59.6]], width: [.85, .2, .1], meander: .5},
  {id: 'upper', from: 'plunge', to: 'pond', pts: [[58.2, -46.6], [53.5, -41], [48, -35.5], [44, -29], [41.5, -24.5], [39.5, -21.5]], width: [1.25, .3, .15], meander: .6},
  {id: 'brook', from: 'pond', drop: 1.0, to: 'swamp', pts: [[26.6, -8.6], [21.5, -10.2], [16.8, -9.2], [13.8, -6.4], [13, -3], [13.4, 4], [14.6, 12], [15, 22], [13, 32], [9, 42], [4, 52], [-2, 61], [-8, 68.5], [-12, 73]], width: [1.15, .38, .2], meander: .9, pin: [13, -3]},
];
/* The beaver's dam closes the pond where the brook leaves it. */
export const DAM = {a: [24.9, -13.3], b: [31.3, -6.9], width: 1.7};

/* Hills as soft bumps [x, z, radius, height]. */
export const HILLS = [[-10, -90, 30, 5], [-62, -82, 34, 6.5], [30, -94, 24, 4], [90, 62, 36, 5.5], [104, 4, 22, 3.2], [40, 96, 26, 3.6], [-104, 70, 30, 4.5], [-108, -52, 26, 4]];

/* Clearings without trees [x, z, radius]. */
export const GLADES = [[1, -3, 15], [52, 44, 11], [-30, -61, 6.5], [86, -6, 7], [-57, 53, 7], [-32, 10, 6], [61, -50, 10], [33, -15, 15], [13, 22, 4]];

/* Trails: polylines through the points, drawn as wandering earth paths. */
export const TRAILS = [
  {id: 'east', pts: [[1.5, -2.6], [6, -2.8], [10.9, -3]], w: .9},
  {id: 'beaver', pts: [[15.1, -3], [18.6, -5], [21.5, -8.2], [22.6, -12], [23.2, -15.5]], w: .85},
  {id: 'falls', pts: [[23.2, -15.5], [24.5, -22], [29.5, -29], [37, -34.5], [44.5, -41], [51, -46.5], [55, -50]], w: .8},
  {id: 'summit', pts: [[51, -46.5], [47, -56], [43.5, -67], [42.5, -77], [47, -82.5], [56, -83], [66, -81], [75, -77], [76, -68], [72.5, -62.5]], w: .75},
  {id: 'north', pts: [[-1.2, -4.4], [-5, -8], [-9, -14], [-12, -25], [-18, -38], [-25, -50], [-29.5, -59]], w: .9},
  {id: 'west', pts: [[-.6, -1.6], [-8, .8], [-18, 4.6], [-28, 8.6], [-31.5, 9.6]], w: .9},
  {id: 'meadow', pts: [[-31.5, 9.6], [-46, 6], [-60, 0], [-72, -6], [-79, -10.5], [-92, -20]], w: .8},
  {id: 'south', pts: [[1.4, -.6], [2, 8], [4, 18], [7, 27], [3, 38], [-3.5, 48], [-8.5, 57], [-11.5, 63], [-13, 65.5]], w: .85},
  {id: 'kingfisher', pts: [[4, 18], [8, 20.6], [11.6, 21.8]], w: .7},
  {id: 'glade', pts: [[15.1, -3], [22, 4], [30, 14], [40, 26], [48, 38], [51, 42.5]], w: .85},
  {id: 'owl', pts: [[30, 14], [44, 10], [60, 6], [76, 0], [84.5, -4.5]], w: .8},
  {id: 'birch', pts: [[2, 8], [-6, 16], [-20, 28], [-36, 40], [-50, 49.5], [-55.5, 52.2]], w: .8},
  {id: 'meadow-birch', pts: [[-60, 0], [-64.5, 20], [-62.5, 40], [-57, 51.5]], w: .75},
  {id: 'squirrel-meadow', pts: [[-29.5, -59], [-46, -46], [-58, -32], [-66, -18], [-72, -6]], w: .75},
  {id: 'glade-south', pts: [[51, 42.5], [44, 58], [30, 68], [14, 72], [3, 67], [.2, 64.4]], w: .75},
  {id: 'swamp-east', pts: [[-5.6, 60.6], [-9.5, 61], [-11.5, 63]], w: .7},
  {id: 'owl-falls', pts: [[84.5, -4.5], [80, -22], [71, -35], [62.5, -41], [58.6, -42.6]], w: .75},
];

/* Ways across water. `at` is snapped to the named stream; boardwalk planks are given end to end. */
export const CROSSINGS = [
  {kind: 'bridge', stream: 'brook', at: [13, -3]},
  {kind: 'log', stream: 'brook', at: [-2.8, 62.4]},
  {kind: 'stones', stream: 'upper', at: [54.6, -42.2]},
  {kind: 'dam'},
  {kind: 'planks', a: [-13, 65.5], b: [-17.5, 70.5]},
  {kind: 'planks', a: [-17.5, 70.5], b: [-17, 77]},
  {kind: 'planks', a: [-17, 77], b: [-22, 82.5]},
  {kind: 'planks', a: [-22, 82.5], b: [-28.5, 84]},
];

const pin = (x, y) => ({pu: x / 1024, pv: y / 768});
/* Places Fuchs can be sent to (the five puzzle friends, home and the mailman). The map pins stay
   where the painted picture map shows them until the map is redrawn. */
export const PLACES = {
  home: {x: 0, z: -3.3, picture: 'door', name: 'Nach Hause', ...pin(392, 262)},
  mailman: {x: 3.2, z: -.8, picture: 'mailman', name: 'Zum Briefträger', ...pin(570, 390)},
  squirrel: {x: -29.5, z: -59, picture: 'squirrel', name: 'Zu Eichhörnchen', ...pin(86, 134)},
  bird: {x: -55.5, z: 52.2, picture: 'bird', name: 'Zu Blaumeise', ...pin(98, 390)},
  owl: {x: 84.5, z: -4.5, picture: 'owl', name: 'Zu Waldkauz', ...pin(262, 300)},
  beaver: {x: 23.2, z: -15.5, picture: 'beaver', name: 'Zu Biber', ...pin(792, 352)},
  mouse: {x: -31.5, z: 9.6, picture: 'mouse', name: 'Zu Maus', ...pin(852, 532)},
  hedgehog: {x: 51.6, z: 43.8, picture: 'friend-hedgehog', name: 'Zu Igel'},
  fish: {x: 59.5, z: -43.1, picture: 'friend-fish', name: 'Zu Fisch'},
  deer: {x: -78.6, z: -11, picture: 'friend-deer', name: 'Zu Reh'},
  kingfisher: {x: 11.2, z: 21.5, picture: 'friend-kingfisher', name: 'Zu Eisvogel'},
  frog: {x: -27.4, z: 83.2, picture: 'friend-frog', name: 'Zu Frosch'},
};
/** The picture map (assets/forest-friends/world-map.webp, tools/map/) shows this part of the world. */
export const MAP = {x0: -168, x1: 168, z0: -112, z1: 112};
/* Where every character stands: `y` above the ground (branch, rock, stump), `h` body height. */
export const FRIENDS = {
  squirrel: {at: [-31.2, -61.2], y: 0, yaw: .6, h: 1.15},
  bird: {at: [-57.6, 54.45], y: 2.38, yaw: .9, h: .6},
  owl: {at: [86.4, -7.15], y: 2.12, yaw: -.5, h: 1.25},
  mouse: {at: [-33.4, 11.2], y: .62, yaw: .7, h: 1.1},
  beaver: {at: [24.6, -17.2], y: 0, yaw: -.5, h: 1.2},
};
/* The new neighbours (no puzzles yet): they greet Fuchs when he comes by. */
export const NEIGHBOURS = {
  deer: {at: [-80.5, -12.5], y: 0, yaw: 1.0, h: 1.75},
  frog: {at: [-23.4, 80.2], y: .06, yaw: .9, h: .8, onWater: true},
  hedgehog: {at: [53.6, 45.4], y: 0, yaw: -.7, h: .85},
  fish: {at: [62.6, -49.2], y: .02, yaw: -.6, h: .8, onWater: true},
  kingfisher: {at: [12.9, 22.85], y: 1.6, yaw: -1.2, h: .6},
};
/* Authored trees [x, z, size, options]: the friends' trees and a few giants. */
export const TREES = [
  [-59.3, 54.2, .62, {kind: 'birch', branch: [1.7, 2.42, .45]}],
  [88.2, -7.4, 3.4, {kind: 'hollow', branch: [-1.8, 2.0, .6]}],   // the owl's old tree: 1.15 m thick, with a hollow
  [-83, -15, 1.35, {kind: 'oak'}],
  [-33.6, -62.8, 1.3, {kind: 'oak'}],
  [11.4, 22.6, .7, {kind: 'willow', branch: [1.5, 1.52, .45]}],
];
/* Big rocks [x, z, size, height] (colliders). */
export const ROCKS = [[-5.2, -4.2, 1.05, 1.6], [-2, 9, .65, .9], [9.6, 1.2, .6, .8], [57.6, -54.4, 1.5, 1.7], [66.4, -47.6, 1.2, 1.3], [-70, 8, .9, 1], [50.5, 48.4, .8, .9]];
/* Further colliders [x, z, radius]: the den tree, the stump, the lodge. */
export const SOLIDS = [[0, -8, 3.05], [-33.4, 11.2, .95], [37.5, -18.6, 2.3]];

/* Landmark sites: objects built when Fuchs comes near (centre and radius decide when). */
export const SITES = [
  {id: 'home', x: 0, z: -6, r: 16},
  {id: 'falls', x: 64, z: -56, r: 26},
  {id: 'pond', x: 33, z: -15, r: 20},
  {id: 'swamp', x: -19, z: 76, r: 26},
  {id: 'meadow', x: -72, z: -4, r: 30},
  {id: 'crossings', x: 10, z: 30, r: 60},
  {id: 'friends', x: 0, z: 0, r: 200},
];
