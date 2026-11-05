/* Shared-library routes and a touch-only Owl quest with exact interrupted saves. */
const { chromium } = require('/opt/codex/cua_node/lib/node_modules/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
function solve(q, start = q.start) {
  const queue = [[start, []]], seen = new Set([start]);
  for (let i = 0; i < queue.length; i++) {
    const [p, route] = queue[i]; if (p === q.goal) return route;
    for (const [name, dx, dy] of [['Nach oben', 0, -1], ['Nach links', -1, 0], ['Nach unten', 0, 1], ['Nach rechts', 1, 0]]) {
      const x = p % q.size + dx, y = Math.floor(p / q.size) + dy, next = y * q.size + x;
      if (x < 0 || x >= q.size || y < 0 || y >= q.size || q.obstacles.includes(next) || seen.has(next)) continue;
      seen.add(next); queue.push([next, route.concat(name)]);
    }
  }
  throw Error('Unreachable route fixture');
}
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, reducedMotion: 'reduce' });
    const page = await context.newPage(), errors = [], external = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('request', r => { if (!r.url().startsWith('http://127.0.0.1:8000') && !r.url().startsWith('data:')) external.push(r.url()); });
    const shots = process.env.FARBTUPF_SHOTS || '/tmp/farbtupf-trail-test'; fs.mkdirSync(shots, { recursive: true });
    const shot = name => page.screenshot({ path: path.join(shots, name) });
    await page.goto('http://127.0.0.1:8000/?screen=hub');
    await page.evaluate(() => {
      FK.settings.set('sound', false); FK.ui.celebrate = () => {};
      const make = FK.adventures.question; FK.adventures.question = (...args) => { const q = make(...args); window.routeTestQuestion = q; return q; };
    });
    for (const stage of [1, 2, 3]) {
      await page.evaluate(stage => { FK.settings.set('learning.stage', stage); FK.go('adventure', { game: 'robot' }); }, stage);
      for (let round = 0; round < 5; round++) {
        const q = await page.evaluate(() => window.routeTestQuestion); assert.equal(q.size, stage + 2);
        const field = page.locator('.screen-adventure');
        if (!round) {
          const blocked = q.start === 0 ? 'Nach oben' : 'Nach unten';
          await field.getByRole('button', { name: blocked, exact: true }).tap();
          assert.equal(await field.locator('.adventure-next').isVisible(), false);
          const first = solve(q)[0]; await field.getByRole('button', { name: first, exact: true }).tap();
          await field.getByRole('button', { name: 'Einen Schritt zurück', exact: true }).tap();
        }
        for (const step of solve(q)) await field.getByRole('button', { name: step, exact: true }).tap();
        await field.locator('.adventure-next').tap();
      }
      await page.locator('.screen-adventure .learn-finish').waitFor();
    }
    assert.equal(await page.evaluate(() => FK.progress.stars()), 3);
    console.log('PASS: existing flat route library, all three stages, 15 touch rounds, edge rejection, undo and legacy rewards.');

    // Represents a child returning after the first two complete story arcs.
    await page.evaluate(() => {
      const m = FK.forestState;
      localStorage.setItem(m.KEY, JSON.stringify({ version: 1, welcomed: true, bridgeRepaired: true, greetingSeen: true, payoffSeen: true,
        position: m.nodes.hedgehog, met: { beaver: true, hare: true, hedgehog: true },
        contributions: { [m.QUEST]: true, [m.REST]: true }, payoffsSeen: { [m.REST]: true } }));
    });
    const ready = () => page.waitForFunction(() => !!window.FK?.forestScene && FK.current() === 'forest', null, { timeout: 60000 });
    const state = () => page.evaluate(() => FK.forestState.getActivity(FK.forestState.TRAIL));
    const root = page.locator('.screen-forest-trail');
    await page.goto('http://127.0.0.1:8000/'); await ready();
    await page.locator('.forest-goal').tap();
    await page.locator('.forest-dialog-owl').waitFor({ timeout: 60000 });
    assert.equal(await page.evaluate(() => FK.forestState.get().met.owl), true);
    assert.equal(await page.evaluate(() => FK.forestScene.scene.getObjectByName('owl-picture-sign').visible), false);
    await shot('01-owl-request-phone.png');
    await page.locator('.forest-dialog-owl .forest-primary').tap();
    await root.locator('.forest-demo').waitFor();
    const live = await state(); assert.equal(live.stage, 1); assert.equal(live.question.size, 3); assert.notEqual(live.question.goal, 5);
    await root.getByRole('button', { name: 'Nach rechts', exact: true }).tap();
    await root.getByRole('button', { name: 'Nach rechts', exact: true }).tap();
    await shot('02-separate-route-example.png');
    await root.getByRole('button', { name: 'Jetzt selber probieren', exact: true }).tap();
    assert.deepEqual(await state(), live); assert.equal(await root.locator('.route-demo-hand').count(), 0);
    await root.getByRole('button', { name: 'Nach oben', exact: true }).tap(); assert.deepEqual(await state(), live);
    await root.getByRole('button', { name: 'Nach rechts', exact: true }).tap();
    const partial = await state(); assert.equal(partial.position, 1);
    await root.getByRole('button', { name: 'Beispiel nochmals zeigen', exact: true }).tap();
    await root.getByRole('button', { name: 'Jetzt selber probieren', exact: true }).tap(); assert.deepEqual(await state(), partial);
    await root.getByRole('button', { name: 'Zurück zum Waldkauz', exact: true }).tap(); await ready(); await page.reload(); await ready();
    assert.deepEqual(await state(), partial);
    async function resume() {
      await page.locator('.forest-goal').tap(); await page.locator('.forest-dialog-owl').waitFor({ timeout: 30000 });
      await page.locator('.forest-dialog-owl .forest-primary').tap();
    }
    await resume(); await root.getByRole('button', { name: 'Einen Schritt zurück', exact: true }).tap(); assert.equal((await state()).position, 0);
    await shot('03-flat-route-phone.png');
    for (const step of solve(live.question)) await root.getByRole('button', { name: step, exact: true }).tap();
    const answered = await state(); assert.equal(answered.answered, true);
    await root.getByRole('button', { name: 'Zurück zum Waldkauz', exact: true }).tap(); await ready(); await page.reload(); await ready(); await resume();
    assert.deepEqual(await state(), answered); assert.equal(await root.locator('.route-direction:disabled').count(), 4);
    await root.locator('.learn-next').tap();
    for (let round = 1; round < 5; round++) {
      const a = await state(); assert.equal(a.round, round);
      for (const step of solve(a.question, a.position)) await root.getByRole('button', { name: step, exact: true }).tap();
      await root.locator('.learn-next').tap();
    }
    await root.locator('.forest-round-finish').waitFor();
    assert.equal(await page.evaluate(() => FK.forestState.isComplete(FK.forestState.TRAIL)), true);
    assert.equal(await page.evaluate(() => FK.progress.stars()), 3); // robot:1 was already earned in the library.
    assert.equal(await page.evaluate(() => FK.settings.get('learning.stage')), 3);
    await root.locator('.forest-scene-return').tap(); await ready();
    await page.locator('.forest-dialog-owl').waitFor({ timeout: 15000 });
    await page.waitForFunction(() => FK.forestScene.scene.getObjectByName('owl-picture-sign').visible);
    await shot('04-renewed-sign-phone.png');
    await page.locator('.forest-dialog-owl .forest-secondary').tap();
    await page.setViewportSize({ width: 1280, height: 900 });
    await shot('05-story-hollow.png');
    await page.evaluate(async () => { await navigator.serviceWorker.ready; }); await page.reload(); await ready();
    await context.setOffline(true); await page.reload(); await ready();
    assert.equal(await page.evaluate(() => FK.forestState.isComplete(FK.forestState.TRAIL)), true);
    assert.equal(await page.evaluate(() => Object.keys(FK.forestState.get().contributions).length), 3);
    assert.equal(await page.evaluate(() => FK.forestScene.scene.getObjectByName('owl-picture-sign').visible), true);
    assert.equal(await page.evaluate(() => FK.progress.stars()), 3);
    assert.deepEqual(errors, []); assert.deepEqual(external, []);
    console.log('PASS: real walk to Owl, separate example, no live cue, wrong-edge retry, two exact save/resume states, five routes, pictured return, persistent sign, unchanged stars/stage and offline 3D.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
