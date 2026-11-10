/* Landmark sites of the big world: one-off objects built when Fuchs comes near (the streamer asks
   for a site's steps once). The den tree, the arched bridge and the log come from world/landmarks.js;
   the Rock's waterfall, the dam and lodge, the swamp's boardwalk and the friends' props are built here. */
import {landmarkSteps} from '../landmarks.js';

export function siteSteps(site, look, world, group, out) {
  const T = world.terrain, L = world.layout;
  // the home builders expect a region: give them the parts they read
  const asRegion = landmarks => ({seed: 20261109, origin: [0, 0], ground: T.ground, deck: T.deck, home: L.DEN, crossings: T.crossings, landmarks, brook: null});
  if (site.id === 'home') return landmarkSteps(asRegion(['homeTree', 'bridge']), look, world, group, out);
  if (site.id === 'swamp') return landmarkSteps(asRegion(['logBridge']), look, world, group, out);
  return [];
}
