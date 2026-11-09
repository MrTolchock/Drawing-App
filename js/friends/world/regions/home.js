/* Region `home`: the clearing around Fuchs' tree, exactly as it plays today (places, colliders,
   trail graph, brook line and the arched bridge), plus the fallen-log crossing from the look-dev.
   Coordinates in metres; map pins are positions on the 1024 × 768 picture map. */
import {sstep} from '../noise.js';

const pin = (x, y) => ({pu: x / 1024, pv: y / 768});

export function home(origin = [0, 0]) {
  const [ox, oz] = origin, P = ([x, z]) => [x + ox, z + oz];
  return {
    id: 'home', origin, seed: 20261109,
    bounds: {x0: -32 + ox, x1: 32 + ox, z0: -48 + oz, z1: 32 + oz},
    clearing: {x: 2 + ox, z: -2 + oz, r: 19.6},
    home: {x: 0 + ox, z: -8 + oz},
    places: {
      home: {x: 0 + ox, z: -3.3 + oz, picture: 'door', name: 'Nach Hause', ...pin(392, 262)},
      mailman: {x: 3.2 + ox, z: -.8 + oz, picture: 'mailman', name: 'Zum Briefträger', ...pin(570, 390)},
      squirrel: {x: -8.2 + ox, z: -10.4 + oz, picture: 'squirrel', name: 'Zu Eichhörnchen', ...pin(86, 134)},
      bird: {x: -7.2 + ox, z: .9 + oz, picture: 'bird', name: 'Zu Blaumeise', ...pin(98, 390)},
      owl: {x: -4.0 + ox, z: -2.6 + oz, picture: 'owl', name: 'Zu Waldkauz', ...pin(262, 300)},
      beaver: {x: 16.9 + ox, z: -1.4 + oz, picture: 'beaver', name: 'Zu Biber', ...pin(792, 352)},
      mouse: {x: 7.0 + ox, z: 5.3 + oz, picture: 'mouse', name: 'Zu Maus', ...pin(852, 532)},
    },
    // Where each friend stands (y is the height above the ground: on the owl's rock, the mouse's stump, the bird's branch).
    friends: {squirrel: {at: P([-9.4, -12.3]), y: 0, yaw: .35, h: 1.15}, bird: {at: P([-8.5, -.25]), y: 2.38, yaw: .4, h: .6},
      owl: {at: P([-5.2, -4.2]), y: 1.0, yaw: .55, h: 1.25}, mouse: {at: P([8.72, 6.88]), y: .62, yaw: -.55, h: 1.1}, beaver: {at: P([18.2, -2.4]), y: 0, yaw: -1.2, h: 1.2}},
    pins: {home: [0, 3.75, -5.3], squirrel: [-9.4, 1.75, -12.3], bird: [-8.55, 3.35, -.25], owl: [-5.2, 2.55, -4.2], beaver: [18.2, 2.35, -2.4], mouse: [8.7, 2.2, 6.88]},
    brook: {line: [[12.6, -34], [12.1, -20], [12.3, -10], [13, -3], [13.6, 4], [14.4, 12], [15.8, 24], [17, 36]].map(P), meander: {amp: 1.4, freq: .21, zeroAt: -3 + oz}, width: [1.15, .42, .22]},
    crossings: [{kind: 'bridge', x: 13 + ox, z: -3 + oz, dir: [1, 0]}, {kind: 'log', z: -9.5 + oz}],
    trails: [
      {pts: [[1.5, -2.6], [-3, -5.8], [-6.5, -8], [-8.2, -10.4], [-9.6, -17.5]].map(P), w: .95},
      {pts: [[0, -1.4], [-4, -.5], [-7.2, .9], [-10.5, 2.6]].map(P), w: .9},
      {pts: [[1.5, -1], [.5, 6], [-.5, 17]].map(P), w: .85},
      {pts: [[6, -2.8], [10.9, -3]].map(P), w: .85},
      {pts: [[15.1, -3], [16.9, -1.4], [19.5, 1]].map(P), w: .8},
      {pts: [[1, 1], [4.5, 4.2], [7, 5.3]].map(P), w: .8},
      {pts: [[4.6, -5.4], [7.4, -8.3], [8.8, -9.4]].map(P), w: .7},
      {pts: [[13.4, -9.6], [15.4, -7.6], [16.4, -4.8]].map(P), w: .7},
    ],
    plaza: {x: .6 + ox, z: -4.1 + oz, rx: 2.4, rz: 1.5},
    mossy: [{x: 0 + ox, z: -8 + oz, r: 4}],
    // Colliders: the home tree, the owl's rock, the bird's tree, forest trees, the stump, the fallen log, the lodge and rocks.
    solids: [[0, -8, 3.05], [-5.2, -4.2, 1], [-10.3, -.7, .55], [-11.6, -14.2, 1.1], [8.6, 6.8, .95], [-9.6, 7.2, .75], [-7.8, 7.2, .75], [19.4, -3.9, 1.05], [-13.5, -5, 1], [-5.5, -16, 1], [5, -15.5, 1], [-14, 4, .9], [3.5, 13.5, .9], [-3, 15, .9], [17, -10.5, 1], [19, 7.5, 1], [-2, 9, .6], [9.6, 1.2, .55], [-12, -9, .6]].map(([x, z, r]) => [...P([x, z]), r]),
    trees: [[-11.6, -14.2, 1.25], [-13.5, -5, 1.2], [-5.5, -16, 1.25], [5, -15.5, 1.2], [-14, 4, 1.15], [3.5, 13.5, 1.15], [-3, 15, 1.15], [17, -10.5, 1.2], [19, 7.5, 1.2]].map(([x, z, s]) => [...P([x, z]), s])
      .concat([[...P([-10.3, -.7]), .62, {branch: [1.9, 2.42, .45]}]]),
    rocks: [[-5.2, -4.2, 1.05, 1.6], [-2, 9, .65, .9], [9.6, 1.2, .6, .8], [-12, -9, .65, .9]].map(([x, z, s, h]) => [...P([x, z]), s, h]),
    keepClear: [{x: 0 + ox, z: -8 + oz, r: 9}],
    treeDensity: .0085,
    hills: (x, z) => sstep(-14 + oz, -46 + oz, z) * 3.2 + sstep(22 + ox, 32 + ox, x) * 1.2 + sstep(-20 + ox, -32 + ox, x) * 1.4,
    landmarks: ['homeTree', 'bridge', 'logBridge', 'acorns', 'stump', 'fallenLog', 'lodge'],
  };
}
