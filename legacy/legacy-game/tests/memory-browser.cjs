const {seedSeenStoryScenes}=require('./cinema-support.cjs');
const BASE_URL = process.env.FARBTUPF_BASE_URL || 'http://127.0.0.1:8000';
/* The shared memory board keeps ordinary practice working at all three stages. */
const { chromium } = require('/opt/codex/cua_node/lib/node_modules/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');

(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, reducedMotion: 'reduce' });
    await context.addInitScript(seedSeenStoryScenes);
    const page = await context.newPage(), errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.goto(BASE_URL + '/?screen=hub');
    await page.evaluate(() => {
      FK.settings.set('sound', false); FK.ui.celebrate = () => {};
      const make = FK.expeditions.question;
      FK.expeditions.question = (...args) => { const q = make(...args); window.memoryTestQuestion = q; return q; };
    });
    async function complete(stage) {
      await page.evaluate(stage => { FK.settings.set('learning.stage', stage); FK.go('expedition', { game: 'treasure' }); }, stage);
      for (let round = 0; round < 5; round++) {
        const q = await page.evaluate(() => window.memoryTestQuestion);
        assert.equal(q.objects.length, stage + 2);
        assert.equal(await page.locator('.exp-treasures .exp-picture').count(), stage + 2);
        assert.equal(await page.locator('.exp-treasure-answers').isVisible(), false);
        await page.getByRole('button', { name: 'Ich bin bereit – verstecken!', exact: true }).tap();
        assert.equal(await page.locator('.exp-treasures .exp-picture').count(), stage + 1);
        if (round === 0) {
          const wrong = q.choices.find(o => o.name !== q.answer);
          await page.getByRole('button', { name: wrong.name, exact: true }).tap();
          assert.equal(await page.locator('.exp-next').isVisible(), false);
          await page.getByRole('button', { name: 'Nochmals schauen', exact: true }).tap();
          assert.equal(await page.locator('.exp-treasure-answers').isVisible(), false);
          await page.getByRole('button', { name: 'Ich bin bereit – verstecken!', exact: true }).tap();
        }
        await page.getByRole('button', { name: q.answer, exact: true }).tap();
        assert.equal(await page.locator('.exp-hide').isDisabled(), true);
        await page.locator('.exp-next').tap();
      }
      await page.locator('.learn-finish').waitFor();
    }
    for (const stage of [1, 2, 3]) await complete(stage);
    assert.equal(await page.evaluate(() => FK.progress.stars()), 3);
    await complete(3); assert.equal(await page.evaluate(() => FK.progress.stars()), 3);
    // A completed world fixture checks the final camera and preserved legacy stars.
    await page.evaluate(() => {
      const m = FK.forestState;
      localStorage.setItem(m.KEY, JSON.stringify({ version: 1, welcomed: true, bridgeRepaired: true, greetingSeen: true, payoffSeen: true,
        position: m.nodes.hedgehog, contributions: { [m.QUEST]: true, [m.REST]: true } }));
    });
    await page.goto(BASE_URL + '/?screen=forest');
    await page.locator('.forest-dialog-hedgehog').waitFor({ timeout: 60000 });
    await page.waitForFunction(() => {
      const p = FK.forestScene.scene.getObjectByName('hedgehog').position.clone().project(FK.forestScene.camera);
      return Math.abs(p.x) < 0.4 && p.y > -0.4 && p.y < 0.4;
    });
    const shots = process.env.FARBTUPF_SHOTS || '/tmp/farbtupf-forest-test'; fs.mkdirSync(shots, { recursive: true });
    await page.screenshot({ path: shots + '/13-grove-clear-phone.png' });
    assert.equal(await page.evaluate(() => FK.progress.stars()), 3);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    assert.deepEqual(errors, []);
    console.log('PASS: shared library memory at all three stages, 20 touch rounds, look again, wrong answers, replay-safe stars and final grove phone framing.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
