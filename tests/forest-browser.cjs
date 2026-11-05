/* Real touch journeys through the Three.js world and two existing flat games. */
const { chromium } = require('/opt/codex/cua_node/lib/node_modules/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

(async () => {
  const shots = process.env.FARBTUPF_SHOTS || '/tmp/farbtupf-forest-test'; fs.mkdirSync(shots, { recursive: true });
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, hasTouch: true, reducedMotion: 'reduce' });
  await context.addInitScript(() => {
    if (localStorage.getItem('forest-test-seeded')) return;
    localStorage.setItem('farbklecks.settings.v2', JSON.stringify({ sound: false, 'learning.stage': 3, schrift: 'gross' }));
    localStorage.setItem('farbklecks.progress.v1', JSON.stringify({ stars: 7, done: { 'learn:pattern:1': 1, 'expedition:treasure:1': 1 } }));
    localStorage.setItem('forest-test-seeded', 'yes');
  });
  const page = await context.newPage(), errors = [], external = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('request', r => { if (!r.url().startsWith('http://127.0.0.1:8000') && !r.url().startsWith('data:')) external.push(r.url()); });
  const ready = () => page.waitForFunction(() => !!window.FK?.forestScene && FK.current() === 'forest', null, { timeout: 60000 });
  const state = () => page.evaluate(() => FK.forestState.get());
  const shot = filename => page.screenshot({ path: path.join(shots, filename) });
  async function movingTarget(name) {
    const box = await page.getByRole('button', { name, exact: true }).boundingBox();
    assert.ok(box, name + ' is visible');
    await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
  }
  async function resumeAtBeaver() {
    await page.getByRole('button', { name: 'Zum Biber gehen', exact: true }).tap();
    await page.locator('.forest-dialog-beaver').waitFor({ timeout: 45000 });
    await page.locator('.forest-dialog-beaver .forest-primary').tap();
    await page.locator('.screen-learn.forest-activity').waitFor();
  }
  await page.goto('http://127.0.0.1:8000', { waitUntil: 'networkidle' }); await ready();
  await page.evaluate(() => FK.store.put('forest-preservation-check', { drawing: 'retained', revision: 4 }));
  await page.getByRole('button', { name: 'Mit dem Fuchs losgehen', exact: true }).tap();
  await shot('01-opening.png');
  assert.ok(await page.evaluate(() => FK.forestScene.renderer.isWebGLRenderer && FK.forestScene.renderer.info.render.triangles > 10000));

  // Actual ground raycasting, followed by a second target while already walking.
  const ground = await page.evaluate(() => {
    const p = FK.forestScene.camera.position.clone().set(-12, 0, 4.2).project(FK.forestScene.camera);
    return { x: (p.x + 1) * innerWidth / 2, y: (-p.y + 1) * innerHeight / 2 };
  });
  await page.touchscreen.tap(ground.x, ground.y);
  await page.waitForFunction(() => Math.hypot(FK.forestScene.position.x + 8, FK.forestScene.position.z - 8) > 1, null, { timeout: 30000 });
  await movingTarget('Hase besuchen');
  await page.locator('.forest-dialog-hare').waitFor({ timeout: 60000 });
  assert.equal((await state()).met.hare, true); assert.equal((await state()).bridgeRepaired, false);
  await page.locator('.forest-dialog-hare .forest-primary').tap();
  await page.locator('.forest-dialog-beaver').waitFor({ timeout: 60000 });
  await page.locator('.forest-dialog-replay').tap();
  assert.equal((await state()).accepted, false);
  await shot('02-bridge-request.png');
  console.log('PASS: touch walking, a changed destination, Hare first, safe detour and one shared request.');

  await page.locator('.forest-dialog-beaver .forest-primary').tap();
  await page.locator('.forest-demo').waitFor(); await shot('03-demonstration.png');
  assert.equal(await page.evaluate(() => FK.forestScene.running), false);
  assert.equal(await page.evaluate(() => FK.settings.get('learning.stage')), 3);
  await page.getByRole('button', { name: 'Jetzt selber probieren', exact: true }).tap();
  const original = (await state()).activity;
  assert.equal(original.stage, 1); assert.equal(original.round, 0);
  const wrong = original.question.choices.find(value => value !== original.question.answer);
  await page.getByRole('button', { name: String(wrong), exact: true }).tap();
  assert.equal((await state()).activity.round, 0); assert.equal((await state()).bridgeRepaired, false);
  await page.getByRole('button', { name: 'Aufgabe nochmals hören', exact: true }).tap();
  assert.deepEqual((await state()).activity, original);
  await page.getByRole('button', { name: 'Beispiel nochmals zeigen', exact: true }).tap();
  await page.getByRole('button', { name: 'Jetzt selber probieren', exact: true }).tap();
  assert.deepEqual((await state()).activity, original);
  assert.equal(await page.locator('.learn-answer.correct').count(), 0);
  await shot('04-flat-puzzle.png');

  // Save an answered item before Next, leave, reload, and resume it honestly.
  await page.getByRole('button', { name: String(original.question.answer), exact: true }).tap();
  const answered = (await state()).activity;
  assert.equal(answered.answered, true);
  await page.getByRole('button', { name: 'Zurück zum Biber', exact: true }).tap();
  await ready(); assert.equal((await state()).bridgeRepaired, false);
  await page.reload(); await ready(); assert.deepEqual((await state()).activity, answered);
  await resumeAtBeaver();
  assert.equal(await page.locator('.learn-answer:disabled').count(), 3);
  assert.equal(await page.locator('.learn-next').isVisible(), true);
  await page.locator('.learn-next').tap();
  console.log('PASS: separate demonstration, fresh attempt, wrong-answer retry, help without answer leakage, saved level/item and return after reload.');

  for (let i = 1; i < 5; i++) {
    const activity = (await state()).activity; assert.equal(activity.round, i);
    await page.getByRole('button', { name: String(activity.question.answer), exact: true }).tap();
    await page.locator('.learn-next').tap();
  }
  await page.locator('.forest-round-finish').waitFor(); await shot('05-pictured-return.png');
  assert.equal(await page.evaluate(() => FK.progress.stars()), 7);
  assert.equal((await state()).bridgeRepaired, true); assert.equal(Object.keys((await state()).contributions).length, 1);
  assert.equal(await page.evaluate(() => FK.settings.get('learning.stage')), 3);
  assert.deepEqual(await page.evaluate(() => FK.store.get('forest-preservation-check')), { drawing: 'retained', revision: 4 });
  await page.locator('.forest-scene-return').tap(); await ready();
  await page.waitForFunction(() => FK.forestState.get().payoffSeen, null, { timeout: 15000 });
  await page.getByRole('button', { name: 'Zu Hase gehen', exact: true }).tap();
  await page.waitForFunction(() => {
    const p = FK.forestScene.position;
    return p.x > -1.8 && p.x < 3.3 && Math.abs(p.z + 7) < 0.3;
  }, null, { timeout: 30000 });
  assert.ok(await page.evaluate(() => FK.forestScene.scene.getObjectByName('fox').position.y > 0.2));
  await shot('06-crossing.png');
  await page.locator('.forest-dialog-hare').waitFor({ timeout: 45000 });
  assert.equal((await state()).greetingSeen, true);
  console.log('PASS: existing-star replay still completes the quest, one saved repair, pictured return, real walk over the new bridge, saved artwork/settings retained.');

  await page.locator('.forest-dialog-hare .forest-primary').tap();
  await page.locator('.forest-dialog-hedgehog').waitFor({ timeout: 60000 });
  assert.equal((await state()).met.hedgehog, true);
  await shot('08-grove-request.png');
  await page.locator('.forest-dialog-hedgehog .forest-primary').tap();
  const memory = page.locator('.screen-forest-memory');
  const memoryState = () => page.evaluate(() => FK.forestState.getActivity(FK.forestState.REST));
  await memory.locator('.forest-demo').waitFor();
  const freshMemory = await memoryState();
  assert.equal(freshMemory.stage, 1); assert.equal(freshMemory.question.objects.length, 3);
  assert.notEqual(await memory.locator('.memory-demo-hand').locator('..').getAttribute('aria-label'), freshMemory.question.answer);
  await memory.locator('.exp-hide').tap();
  await memory.locator('.memory-demo-hand').locator('..').tap();
  await shot('09-memory-example.png');
  await memory.getByRole('button', { name: 'Jetzt selber probieren', exact: true }).tap();
  assert.deepEqual(await memoryState(), freshMemory);
  assert.equal(await memory.locator('.memory-demo-hand').count(), 0);
  assert.equal(await memory.locator('.exp-treasure-answers').isVisible(), false);
  assert.equal(await memory.locator('.memory-name').first().isVisible(), false);
  await memory.locator('.exp-hide').tap();
  assert.equal(await memory.locator('.memory-gap').count(), 1);
  const wrongMemory = freshMemory.question.choices.find(o => o.name !== freshMemory.question.answer);
  await memory.getByRole('button', { name: wrongMemory.name, exact: true }).tap();
  assert.equal((await memoryState()).answered, false);
  await memory.locator('.exp-hide').tap();
  assert.equal(await memory.locator('.memory-gap').count(), 0);
  await memory.locator('.exp-hide').tap();
  const concealed = await memoryState();
  await memory.getByRole('button', { name: 'Beispiel nochmals zeigen', exact: true }).tap();
  await memory.getByRole('button', { name: 'Jetzt selber probieren', exact: true }).tap();
  assert.deepEqual(await memoryState(), concealed);
  await memory.getByRole('button', { name: 'Zurück zum Igel', exact: true }).tap(); await ready();
  await page.reload(); await ready();
  assert.deepEqual(await memoryState(), concealed);
  async function resumeAtHedgehog() {
    await page.locator('.forest-goal').tap();
    await page.locator('.forest-dialog-hedgehog').waitFor({ timeout: 30000 });
    await page.locator('.forest-dialog-hedgehog .forest-primary').tap();
  }
  await resumeAtHedgehog();
  assert.equal(await memory.locator('.memory-gap').count(), 1);
  await memory.getByRole('button', { name: concealed.question.answer, exact: true }).tap();
  const answeredMemory = await memoryState();
  await memory.getByRole('button', { name: 'Zurück zum Igel', exact: true }).tap(); await ready();
  await page.reload(); await ready(); await resumeAtHedgehog();
  assert.deepEqual(await memoryState(), answeredMemory);
  assert.equal(await memory.locator('.learn-answer:disabled').count(), 3);
  await memory.locator('.learn-next').tap();
  await page.setViewportSize({ width: 390, height: 844 });
  await shot('10-memory-phone.png');
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  for (let i = 1; i < 5; i++) {
    const a = await memoryState(); assert.equal(a.round, i);
    await memory.locator('.exp-hide').tap();
    await memory.getByRole('button', { name: a.question.answer, exact: true }).tap();
    await memory.locator('.learn-next').tap();
  }
  assert.equal(await page.evaluate(() => FK.forestState.isComplete(FK.forestState.REST)), true);
  assert.equal(Object.keys((await state()).contributions).length, 2);
  assert.equal(await page.evaluate(() => FK.progress.stars()), 7);
  await memory.locator('.forest-scene-return').tap(); await ready();
  await page.locator('.forest-dialog-hedgehog').waitFor({ timeout: 15000 });
  await shot('11-resting-place-phone.png');
  assert.equal(await page.evaluate(() => FK.forestState.get().payoffsSeen[FK.forestState.REST]), true);
  await page.locator('.forest-dialog-hedgehog .forest-secondary').tap();
  await page.setViewportSize({ width: 1280, height: 900 });
  await shot('12-resting-place.png');
  console.log('PASS: grove discovery, native Hedgehog, shared flat memory rules, separate example, look again, no answer cue, two exact resume states, saved resting place and no duplicate rewards.');

  await page.locator('.forest-book').tap();
  assert.equal(await page.evaluate(() => FK.current()), 'hub');
  await page.getByRole('button', { name: /Musterzug/ }).tap();
  assert.equal(await page.locator('.screen-learn .forest-learning-controls').isVisible(), false);
  assert.equal(await page.locator('.learn-answer').count(), 3);
  await page.evaluate(() => FK.go('hub'));
  await page.getByRole('button', { name: 'Zurück zum Wald', exact: true }).tap(); await ready();
  assert.equal((await state()).bridgeRepaired, true);

  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload(); await ready();
  await context.setOffline(true); await page.reload(); await ready();
  assert.equal((await state()).bridgeRepaired, true); assert.equal(await page.evaluate(() => FK.progress.stars()), 7);
  assert.equal(await page.evaluate(() => FK.forestState.isComplete(FK.forestState.REST)), true);
  assert.ok(await page.evaluate(() => FK.forestScene.renderer.info.render.triangles > 10000));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForFunction(() => document.querySelector('.forest-canvas').width > 0 && innerWidth === 390);
  await page.waitForFunction(() => {
    const p = FK.forestScene.scene.getObjectByName('fox').position.clone().project(FK.forestScene.camera);
    return Math.abs(p.x) < 0.65 && Math.abs(p.y) < 0.7;
  });
  await shot('07-phone.png');
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  assert.deepEqual(errors, []); assert.deepEqual(external, []);
  console.log('PASS: existing library routing, offline Three.js reload, persistent bridge, phone layout, no external runtime requests or browser exceptions.');
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
