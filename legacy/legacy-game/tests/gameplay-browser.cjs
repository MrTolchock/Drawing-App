const BASE_URL = process.env.FARBTUPF_BASE_URL || 'http://127.0.0.1:8000';
/* Journey navigation and feedback integration. Completed rounds are simulated through
   the shared feedback API; individual game mechanics have separate browser checks. */
const { chromium } = require('/opt/codex/cua_node/lib/node_modules/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, reducedMotion: 'reduce' });
    await context.addInitScript(() => {
      if (!localStorage.getItem('journey-browser-initialized')) {
        localStorage.setItem('farbklecks.settings.v2', JSON.stringify({ sound: false, 'learning.stage': 2 }));
        localStorage.setItem('journey-browser-initialized', 'yes');
      }
    });
    const page = await context.newPage(), errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const shots = process.env.FARBTUPF_SHOTS || '/tmp/farbtupf-gameplay';
    fs.mkdirSync(shots, { recursive: true });
    async function shot(name) {
      await page.evaluate(async () => { await document.fonts.ready; await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))); });
      await page.waitForFunction(() => !document.querySelector('.screen:not([hidden]).in, .screen:not([hidden]).in-back'));
      if (await page.locator('.new-sticker').count()) await page.locator('.new-sticker').waitFor({ state: 'detached', timeout: 8000 });
      return page.screenshot({ path: path.join(shots, name) });
    }
    const goBook = () => page.evaluate(() => FK.go('forest-book'));
    const state = () => page.evaluate(() => FK.journey.get());
    const current = () => page.evaluate(() => FK.journey.step());
    async function keyboardActivate(button) { await button.focus(); await page.keyboard.press('Enter'); }
    async function layout(label) {
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, label + ': page overflow');
      const overflow = await page.locator('.screen:not([hidden]) .journey-card, .screen:not([hidden]) .journey-stops, .screen:not([hidden]) .play-finish').evaluateAll(nodes => nodes.filter(node => node.scrollWidth > node.clientWidth + 1).map(node => node.className));
      if (overflow.length) {
        await shot('overflow-' + label.replace(/[^a-z0-9]+/gi, '-') + '.png');
        console.error(await page.locator('.screen:not([hidden]) .play-finish, .screen:not([hidden]) .play-finish > *, .screen:not([hidden]) .journey-card, .screen:not([hidden]) .journey-card *').evaluateAll(nodes => nodes.filter(node => node.scrollWidth > node.clientWidth + 1 || node.classList.contains('journey-card')).map(node => ({ class: node.className, width: node.clientWidth, scroll: node.scrollWidth, box: node.getBoundingClientRect().toJSON() }))));
      }
      assert.deepEqual(overflow, [], label + ': journey content overflow');
    }
    async function completeRound(step, options = {}) {
      await page.evaluate(({ step, hints, misses }) => {
        const body = document.querySelector('.screen-' + step.screen + ' .learn-body');
        for (let round = 0; round < 5; round++) {
          FK.play.context(step.game, 'Testaufgabe', round, step.stage);
          if (hints.includes(round)) FK.play.hint();
          if (misses.includes(round)) FK.play.attempt(false);
          FK.play.attempt(true);
        }
        FK.play.finish(body, step.screen, step.game, step.stage, () => {});
      }, { step, hints: options.hints || [], misses: options.misses || [] });
      await page.locator('.screen-' + step.screen + ' .play-finish').waitFor();
    }
    await page.goto(BASE_URL + '/?screen=hub');
    await page.waitForFunction(() => !!window.FK?.journey && FK.current() === 'forest-book');
    const story = await page.evaluate(() => JSON.stringify(FK.forestState.get()));
    assert.equal(await page.locator('.journey-card').count(), 1);
    assert.equal((await state()).tour, null);
    await layout('initial phone book');
    await shot('01-journey-start-phone.png');
    // Starting is possible with a keyboard and respects the openly selected level.
    await keyboardActivate(page.getByRole('button', { name: 'Entdeckertour starten', exact: true }));
    const first = await current(), route = (await state()).tour.steps;
    assert.equal(first.stage, 2);
    assert.equal(new Set(route.map(step => step.game)).size, 3);
    assert.equal(await page.evaluate(() => FK.current()), first.screen);
    assert.match(await page.locator('.screen-' + first.screen + ' .play-context').innerText(), /Halt 1 von 3/);
    await completeRound(first);
    assert.equal((await state()).tour.index, 1);
    assert.equal(await page.locator('.screen:not([hidden]) .play-finish .journey-stop.done').count(), 1);
    assert.equal(await page.locator('.screen:not([hidden]) .play-finish .journey-stop.current').count(), 1);
    await layout('first finish phone');
    await shot('02-journey-next-phone.png');
    await page.getByRole('button', { name: 'Waldspiele', exact: true }).tap();
    const expectedSecond = await current();
    await keyboardActivate(page.getByRole('button', { name: /Knobeln.*Stufe 3/ }));
    assert.equal(await page.evaluate(() => FK.learning.stage()), 3);
    // Leaving the tour for another activity keeps its next stop and original level.
    await page.locator('[data-game="add"]').tap();
    await completeRound({ screen: 'learn', game: 'add', stage: 3 }, { hints: [0], misses: [1] });
    assert.equal((await state()).tour.index, 1);
    assert.equal((await state()).records['learn:add:3'].independent, 3, 'hints and retries affect guidance, not completion');
    assert.deepEqual(await current(), expectedSecond);
    await page.getByRole('button', { name: 'Entdeckertour fortsetzen', exact: true }).tap();
    assert.equal(await page.evaluate(() => FK.learning.stage()), 2, 'continuing explicitly restores the saved tour level');
    assert.equal(await page.evaluate(() => FK.current()), expectedSecond.screen);
    await goBook();
    await page.reload();
    await page.waitForFunction(() => FK.current() === 'forest-book');
    assert.deepEqual(await current(), expectedSecond);
    assert.equal(await page.locator('.journey-stop.done').count(), 1);
    await page.getByRole('button', { name: 'Entdeckertour fortsetzen', exact: true }).tap();
    await completeRound(expectedSecond, { hints: [0] });
    assert.equal((await state()).tour.index, 2);
    await page.getByRole('button', { name: 'Entdeckertour fortsetzen', exact: true }).tap();
    const third = await current();
    await completeRound(third);
    assert.equal((await state()).completed, 1);
    assert.equal((await state()).tour.index, 3);
    assert.equal(await current(), null);
    assert.equal(await page.getByRole('heading', { name: 'Entdeckertour geschafft!', exact: true }).count(), 1);
    assert.equal(await page.locator('.screen:not([hidden]) .play-finish .journey-stop.done').count(), 3);
    assert.equal(await page.locator('.screen:not([hidden]) .play-finish .journey-stop.current').count(), 0);
    assert.equal(await page.evaluate(() => JSON.stringify(FK.forestState.get())), story, 'optional practice never repairs the story world');
    assert.equal(await page.evaluate(() => FK.heartTree.count()), 0);
    // Four independent tasks offer a new level, which only changes after activation.
    await page.evaluate(() => { FK.settings.set('learning.stage', 1); FK.go('learn', { game: 'count' }); });
    await completeRound({ screen: 'learn', game: 'count', stage: 1 }, { hints: [0] });
    assert.equal(await page.evaluate(() => FK.learning.stage()), 1);
    assert.equal(await page.getByRole('button', { name: 'Nächste Stufe probieren', exact: true }).count(), 1);
    await keyboardActivate(page.getByRole('button', { name: 'Nächste Stufe probieren', exact: true }));
    assert.equal(await page.evaluate(() => FK.learning.stage()), 2);
    assert.equal(await page.evaluate(() => FK.current()), 'learn');
    assert.equal(await page.locator('.screen-learn .play-finish').count(), 0);
    await completeRound({ screen: 'learn', game: 'count', stage: 2 }, { hints: [0, 1] });
    assert.equal(await page.getByRole('button', { name: 'Nächstes Waldspiel', exact: true }).count(), 1);
    assert.equal((await state()).records['learn:count:2'].independent, 3);
    assert.equal((await state()).completed, 1);
    // A new set must forget an abandoned round's hint and failed attempt.
    await page.evaluate(() => {
      FK.go('learn', { game: 'count' }); FK.play.hint(); FK.play.attempt(false);
      FK.go('forest-book'); FK.go('learn', { game: 'count' });
    });
    await completeRound({ screen: 'learn', game: 'count', stage: 2 });
    assert.equal((await state()).records['learn:count:2'].independent, 5, 'fresh sets reset their help history');
    for (const width of [320, 390, 844, 820]) {
      await page.setViewportSize({ width, height: width === 844 ? 390 : 844 });
      await layout('finish width ' + width);
    }
    await goBook();
    await keyboardActivate(page.getByRole('button', { name: 'Mit Hase spielen', exact: true }));
    assert.equal(await page.getByRole('button', { name: 'Mit Hase spielen', exact: true }).getAttribute('aria-pressed'), 'true');
    assert.equal(await page.locator('.forest-book-games [data-game="count"]').count(), 0);
    assert.equal(await page.locator('.forest-book-games [data-game="rhyme"]').count(), 1);
    for (const width of [320, 390, 844, 820]) {
      await page.setViewportSize({ width, height: width === 844 ? 390 : 844 });
      await layout('filtered book width ' + width);
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await shot('03-journey-friend-book-phone.png');
    await page.reload();
    await page.waitForFunction(() => FK.current() === 'forest-book');
    assert.equal((await state()).completed, 1);
    assert.equal(await current(), null);
    assert.equal(await page.getByRole('button', { name: 'Entdeckertour starten', exact: true }).count(), 1);
    await page.evaluate(async () => { await navigator.serviceWorker.ready; });
    await context.setOffline(true);
    await page.reload();
    await page.waitForFunction(() => FK.current() === 'forest-book');
    assert.equal((await state()).completed, 1);
    assert.equal(await page.getByRole('button', { name: 'Entdeckertour starten', exact: true }).count(), 1);
    assert.deepEqual(errors, []);
    console.log('PASS: journey start/resume/reload/finish, separate free practice, saved levels, explicit recommendations, keyboard controls, four mobile layouts and offline reload. Round completion was simulated through FK.play; individual game interaction is covered separately.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
