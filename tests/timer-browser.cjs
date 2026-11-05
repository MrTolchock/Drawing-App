/* Clock controls preserve the mounted puzzle and use foreground elapsed time. */
const { chromium } = require('/opt/codex/cua_node/lib/node_modules/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, reducedMotion: 'reduce' });
    await context.addInitScript(() => {
      if (!localStorage.getItem('timer-browser-seed')) {
        localStorage.setItem('farbklecks.settings.v2', JSON.stringify({ sound: false, 'learning.stage': 3 }));
        localStorage.setItem('farbklecks.progress.v1', JSON.stringify({ stars: 7, done: {} }));
        localStorage.setItem('timer-browser-seed', 'yes');
      }
      Object.defineProperty(document, 'hidden', { configurable: true, get: () => window.timerTestHidden === true });
    });
    const page = await context.newPage(), errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.clock.install({ time: new Date('2026-11-05T12:00:00Z') });
    await page.clock.pauseAt(new Date('2026-11-05T12:00:01Z'));
    await page.goto('http://127.0.0.1:8000/?screen=hub');
    const clock = () => page.evaluate(() => FK.playTimer.get());
    assert.equal((await clock()).mode, 'off'); assert.equal(await page.locator('.play-timer-bar').isVisible(), false);
    const originalProgress = await page.evaluate(() => localStorage.getItem('farbklecks.progress.v1'));
    await page.evaluate(() => { FK.go('parents'); FK.store.put('timer-drawing-check', { drawing: 'kept' }); });
    await page.locator('.screen-parents').getByRole('button', { name: 'Stoppuhr', exact: true }).tap();
    await page.locator('.screen-parents').getByRole('button', { name: 'Uhr starten', exact: true }).tap();
    await page.clock.fastForward(60000); assert.equal((await clock()).elapsedMs, 0);
    await page.evaluate(() => {
      const make = FK.learning.question;
      FK.learning.question = (...args) => { const q = make(...args); window.timerQuestion = q; return q; };
      FK.go('learn', { game: 'pattern' });
    });
    await page.clock.fastForward(12345);
    assert.ok((await clock()).elapsedMs >= 12345);
    const question = await page.evaluate(() => window.timerQuestion);
    const screenBounds = await page.locator('#screens').boundingBox(), barBounds = await page.locator('.play-timer-bar').boundingBox();
    assert.ok(screenBounds.y >= barBounds.y + barBounds.height);
    await page.locator('.play-timer-summary').tap();
    assert.equal(await page.evaluate(() => FK.current()), 'learn'); assert.deepEqual(await page.evaluate(() => window.timerQuestion), question);
    const modal = page.locator('.play-timer-modal');
    await modal.getByRole('button', { name: 'Uhr pausieren', exact: true }).tap(); const paused = (await clock()).elapsedMs;
    await page.clock.fastForward(30000); assert.equal((await clock()).elapsedMs, paused);
    await modal.getByRole('button', { name: 'Uhr zurücksetzen', exact: true }).tap(); assert.equal((await clock()).elapsedMs, 0);
    await modal.getByRole('button', { name: 'Countdown', exact: true }).tap(); await modal.getByRole('button', { name: '5 Minuten', exact: true }).tap();
    assert.equal((await clock()).durationMs, 300000);
    await page.evaluate(() => { window.timerReminders = []; FK.forestVoice.say = text => window.timerReminders.push(text); });
    await modal.getByRole('button', { name: 'Uhr starten', exact: true }).tap();
    await page.keyboard.press('Escape'); assert.equal(await modal.count(), 0);
    await page.clock.fastForward(299000); assert.ok((await clock()).remainingMs > 0);
    await page.clock.fastForward(1000); assert.equal((await clock()).remainingMs, 0); assert.equal((await clock()).completed, true);
    assert.equal(await page.evaluate(() => window.timerReminders.filter(t => t.includes('Zeit für eine Pause')).length), 1);
    await page.clock.fastForward(10000);
    assert.equal(await page.evaluate(() => window.timerReminders.filter(t => t.includes('Zeit für eine Pause')).length), 1);
    assert.equal(await page.evaluate(() => FK.current()), 'learn'); assert.deepEqual(await page.evaluate(() => window.timerQuestion), question);
    assert.equal(await page.locator('.screen-learn .learn-next').isVisible(), false);
    assert.equal(await page.evaluate(() => localStorage.getItem('farbklecks.progress.v1')), originalProgress);
    await page.locator('.play-timer-summary').tap(); await modal.getByRole('button', { name: 'Stoppuhr', exact: true }).tap();
    await modal.getByRole('button', { name: 'Uhr starten', exact: true }).tap(); await page.keyboard.press('Escape');
    await page.clock.fastForward(5000); const beforeHidden = (await clock()).elapsedMs;
    await page.evaluate(() => { window.timerTestHidden = true; document.dispatchEvent(new Event('visibilitychange')); });
    await page.clock.fastForward(60000); assert.equal((await clock()).elapsedMs, beforeHidden);
    await page.evaluate(() => { window.timerTestHidden = false; document.dispatchEvent(new Event('visibilitychange')); });
    await page.clock.fastForward(5000); assert.equal((await clock()).elapsedMs, beforeHidden + 5000);
    await page.reload(); assert.equal((await clock()).running, false); assert.equal((await clock()).mode, 'stopwatch');
    assert.equal(await page.evaluate(() => FK.progress.stars()), 7); assert.deepEqual(await page.evaluate(() => FK.store.get('timer-drawing-check')), { drawing: 'kept' });
    await page.clock.resume(); // Real frames for the remaining layout, screenshots and WebGL checks.
    await page.evaluate(() => FK.go('forest-book')); await page.getByRole('button', { name: 'Spielzeit-Uhr öffnen', exact: true }).last().tap();
    await modal.getByRole('button', { name: 'Aus', exact: true }).tap(); await page.keyboard.press('Escape');
    assert.equal(await page.locator('.play-timer-bar').isVisible(), false);
    assert.equal(await page.evaluate(() => document.body.classList.contains('play-timer-enabled')), false);
    await page.waitForFunction(() => getComputedStyle(document.querySelector('#screens')).top === '0px');
    assert.equal(await page.locator('#screens').evaluate(el => getComputedStyle(el).top), '0px');
    assert.equal((await page.locator('#screens').boundingBox()).y, 0);
    await page.getByRole('button', { name: 'Spielzeit-Uhr öffnen', exact: true }).tap(); await modal.getByRole('button', { name: 'Countdown', exact: true }).tap();
    await modal.getByRole('button', { name: '10 Minuten', exact: true }).tap(); await page.keyboard.press('Escape');
    const shots = process.env.FARBTUPF_SHOTS || '/tmp/farbtupf-timer-test'; fs.mkdirSync(shots, { recursive: true });
    await page.screenshot({ path: shots + '/01-clock-book-phone.png', animations: 'disabled' });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.locator('.play-timer-summary').tap(); await modal.waitFor({ state: 'visible' });
    await page.screenshot({ path: shots + '/02-clock-settings-phone.png', animations: 'disabled' }); await page.keyboard.press('Escape');
    await page.evaluate(async () => { await navigator.serviceWorker.ready; }); await page.reload();
    await context.setOffline(true); await page.reload(); assert.equal((await clock()).mode, 'countdown'); assert.equal((await clock()).running, false);
    // The clock must also preserve a walking fox's destination and dialogue arrival.
    await context.setOffline(false); await page.evaluate(() => FK.go('forest'));
    await page.waitForFunction(() => !!FK.forestScene, null, { timeout: 60000 });
    await page.getByRole('button', { name: 'Mit dem Fuchs losgehen', exact: true }).tap();
    await page.getByRole('button', { name: 'Zum Biber gehen', exact: true }).tap();
    await page.waitForFunction(() => Math.hypot(FK.forestScene.position.x + 8, FK.forestScene.position.z - 8) > 0.5);
    await page.locator('.play-timer-summary').tap(); assert.equal(await page.evaluate(() => FK.forestScene.running), false);
    const stopped = await page.evaluate(() => FK.forestScene.position); await page.waitForTimeout(400);
    assert.deepEqual(await page.evaluate(() => FK.forestScene.position), stopped);
    await page.keyboard.press('Escape'); assert.equal(await page.evaluate(() => FK.forestScene.running), true);
    await page.locator('.forest-dialog-beaver').waitFor({ timeout: 60000 });
    const dialogueRunning = await page.evaluate(() => FK.forestScene.running);
    await page.locator('.play-timer-summary').tap(); assert.equal(await modal.count(), 0);
    assert.equal(await page.evaluate(() => FK.forestScene.running), dialogueRunning);
    assert.equal(await page.locator('.forest-dialog-beaver').isVisible(), true);
    assert.deepEqual(errors, []);
    console.log('PASS: off-by-default timer, parent pause, stopwatch/countdown controls, one gentle reminder, preserved live question, background pause, paused reload, drawing/stars, phone layout, offline clock and a fox destination preserved across the clock panel.');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exit(1); });
