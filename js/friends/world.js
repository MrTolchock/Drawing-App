/* One current renderer for the painted den and freely explorable 3D forest. */
import {createPaintedWorld} from './painted.js';
import {forestPlaces,forestExits} from './forest3d.js';
export const painted=true;
export const places=forestPlaces;
export const exitPoints=forestExits;
export function createWorld(canvas,options){return createPaintedWorld(canvas,options);}
