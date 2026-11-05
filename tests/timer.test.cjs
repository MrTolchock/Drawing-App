const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
function boot(saved = new Map()) {
  const FK = {}, context = { window: { FK } }; vm.runInNewContext(fs.readFileSync('js/core/timer.js', 'utf8'), context);
  let time = 0, writes = 0;
  const timer = FK.createPlayTimer({ now: () => time, storage: { getItem: k => saved.get(k) || null, setItem: (k, v) => { writes++; saved.set(k, v); } } });
  return { FK, timer, saved, advance(ms, tick = true) { time += ms; if (tick) timer.tick(); }, writes: () => writes };
}
test('the clock is off initially and cannot time a puzzle until enabled', () => {
  const { timer, advance, saved } = boot();
  assert.equal(timer.get().mode, 'off'); assert.equal(timer.start(), false);
  advance(60000); assert.equal(timer.get().elapsedMs, 0); assert.equal(saved.size, 0);
});
test('stopwatch measures elapsed time rather than the number of callbacks', () => {
  const { timer, advance } = boot(); timer.configure('stopwatch'); timer.start();
  advance(12345); assert.equal(timer.get().elapsedMs, 12345);
  advance(123, false); timer.pause(); assert.equal(timer.get().elapsedMs, 12468);
  advance(50000); assert.equal(timer.get().elapsedMs, 12468);
  timer.start(); advance(532); assert.equal(timer.get().elapsedMs, 13000);
});
test('background and parent-settings pauses exclude time while retaining manual running state', () => {
  const { timer, advance } = boot(); timer.configure('stopwatch'); timer.start(); advance(3500);
  timer.setActive(false); advance(300000); assert.equal(timer.get().elapsedMs, 3500); assert.equal(timer.get().running, true);
  timer.setActive(true); advance(1500); assert.equal(timer.get().elapsedMs, 5000);
  timer.pause(); timer.setActive(false); advance(5000); timer.setActive(true); advance(5000);
  assert.equal(timer.get().elapsedMs, 5000); assert.equal(timer.get().running, false);
});
test('countdown stops exactly at zero and reminds only once per run', () => {
  const { timer, advance } = boot(); let ended = 0; timer.onComplete(() => ended++);
  timer.configure('countdown', 5000); timer.start(); advance(3750); assert.equal(timer.get().remainingMs, 1250);
  advance(60000); assert.equal(timer.get().displayMs, 0); assert.equal(timer.get().elapsedMs, 5000);
  assert.equal(timer.get().running, false); assert.equal(timer.get().completed, true); assert.equal(ended, 1);
  advance(60000); assert.equal(ended, 1); assert.equal(timer.start(), false);
  timer.reset(); assert.equal(timer.get().remainingMs, 5000); timer.start(); advance(5000); assert.equal(ended, 2);
});
test('reload restores the selected clock and measured value paused', () => {
  const { timer, advance, saved } = boot(); timer.configure('countdown', 60000); timer.start(); advance(12345); timer.flush();
  const restored = boot(saved); assert.equal(restored.timer.get().mode, 'countdown'); assert.equal(restored.timer.get().remainingMs, 47655);
  assert.equal(restored.timer.get().running, false); restored.advance(86400000); assert.equal(restored.timer.get().remainingMs, 47655);
  restored.timer.start(); restored.advance(655); assert.equal(restored.timer.get().remainingMs, 47000);
});
test('completed reload stays quiet, and reset starts a fresh paused clock', () => {
  const { timer, advance, saved } = boot(); timer.configure('countdown', 1000); timer.start(); advance(1000);
  const restored = boot(saved); let ended = 0; restored.timer.onComplete(() => ended++); restored.advance(30000);
  assert.equal(restored.timer.get().completed, true); assert.equal(ended, 0);
  restored.timer.reset(); assert.equal(restored.timer.get().completed, false); assert.equal(restored.timer.get().running, false);
});
test('timer storage never writes legacy settings, rewards, drawings or story contributions', () => {
  const saved = new Map([['farbklecks.settings.v2', '{"sound":false}'], ['farbklecks.progress.v1', '{"stars":7}'], ['farbtupf.forest.v1', '{"endingSeen":true}']]);
  const original = [...saved]; const { timer, advance } = boot(saved); timer.configure('stopwatch'); timer.start(); advance(20000); timer.pause(); timer.reset();
  for (const [key, value] of original) assert.equal(saved.get(key), value);
  assert.equal(saved.size, 4); assert.ok(saved.has(timer.KEY));
});
test('periodic persistence is batched while control changes save immediately', () => {
  const { timer, advance, writes } = boot(); timer.configure('stopwatch'); timer.start(); const before = writes();
  for (let i = 0; i < 40; i++) advance(250);
  assert.equal(timer.get().elapsedMs, 10000); assert.equal(writes() - before, 2);
  timer.pause(); assert.equal(writes() - before, 3);
});
test('malformed and blocked storage recover safely without accepting invalid durations', () => {
  const { timer } = boot(new Map([['farbtupf.timer.v1', '{broken']])); assert.equal(timer.get().mode, 'off');
  for (const [mode, duration] of [['race', 1000], ['countdown', 0], ['countdown', Infinity], ['countdown', -1]]) assert.equal(timer.configure(mode, duration), false);
  const FK = {}; vm.runInNewContext(fs.readFileSync('js/core/timer.js', 'utf8'), { window: { FK } });
  let time = 0;
  const blocked = FK.createPlayTimer({ now: () => time, storage: { getItem() { throw Error(); }, setItem() { throw Error(); } } });
  assert.doesNotThrow(() => { blocked.configure('stopwatch'); blocked.start(); time = 2000; blocked.tick(); });
  assert.equal(blocked.get().elapsedMs, 2000);
});
test('time formatting is readable and a countdown does not show zero early', () => {
  const { FK } = boot(); assert.equal(FK.playTimerFormat(999), '00:00'); assert.equal(FK.playTimerFormat(1001, true), '00:02');
  assert.equal(FK.playTimerFormat(3662000), '01:01:02'); assert.equal(FK.playTimerFormat(0, true), '00:00');
  assert.equal(FK.playTimerFormat(NaN), '00:00');
});
