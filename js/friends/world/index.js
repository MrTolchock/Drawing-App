/* The forest's world: the big landscape of js/friends/world/big/ (design/world-10x/PLAN.md), with its
   own tile builder and landmark sites for the streamer. */
import {createBigWorld, BIG_ROUTE} from './big/index.js';
import {buildBigTile} from './big/tiles.js';
import {siteSteps} from './big/sites.js';

/** The fixed walk used by the budget test. */
export const TEST_ROUTE = BIG_ROUTE;

export function createWorld() {
  return Object.assign(createBigWorld(), {buildTile: buildBigTile, landmarkSteps: siteSteps});
}
