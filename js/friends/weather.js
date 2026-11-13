/* The forest's weather: mostly sun, and now and then a shower that comes in over a few seconds, rains for a
   minute or two and clears again. It makes no picture and no sound itself; forest3d.js darkens the light and
   lets the rain fall, audio.js plays the patter. No randomness in the rules a child could notice: the first
   few minutes are always dry, showers are short, and there are several minutes of sun between them.

   step(dt) advances the weather and returns its state:
     rain   0…1   how hard it rains now (eases in and out)
     wet    0…1   how wet the ground still is (follows the rain, dries over about a minute)
     fresh  0…1   the bright, clear spell just after a shower (birds sing a little more, the light is clearer)
   force(true | false) starts or stops a shower at once (development and tests: FK.friendsForest.weather). */

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export const WEATHER = {firstDry: [150, 240], dry: [300, 540], shower: [60, 120], easeIn: 12, easeOut: 16, dryUp: 70, freshFor: 60};

export function createWeather({random = Math.random} = {}) {
  const range = ([a, b]) => a + (b - a) * random();
  let phase = 'dry', left = range(WEATHER.firstDry), rain = 0, wet = 0, fresh = 0, showers = 0;
  function step(dt) {
    dt = clamp(dt, 0, 1); left -= dt;
    if (left <= 0) { if (phase === 'dry') { phase = 'rain'; left = range(WEATHER.shower); showers++; } else { phase = 'dry'; left = range(WEATHER.dry); fresh = 1; } }
    const target = phase === 'rain' ? 1 : 0, ease = phase === 'rain' ? WEATHER.easeIn : WEATHER.easeOut;
    rain = clamp(rain + Math.sign(target - rain) * Math.min(Math.abs(target - rain), dt / ease));
    wet = rain > wet ? rain : clamp(wet - dt / WEATHER.dryUp);
    fresh = phase === 'dry' && rain === 0 ? clamp(fresh - dt / WEATHER.freshFor) : phase === 'dry' ? fresh : 0;
    return state;
  }
  const state = {get rain() { return rain; }, get wet() { return wet; }, get fresh() { return fresh; }, get phase() { return phase; }, get showers() { return showers; }, get left() { return left; }};
  return {step, state, force(on) { if (on !== (phase === 'rain')) { left = 0; step(0); } return state; }};
}
