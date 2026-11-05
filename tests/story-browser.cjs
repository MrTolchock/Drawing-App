/* A fresh, touch-only playthrough of every authored quest, chapter and ending. */
const { chromium } = require('/opt/codex/cua_node/lib/node_modules/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
function solve(q, start) {
  const queue = [[start, []]], seen = new Set([start]);
  for (let i = 0; i < queue.length; i++) {
    const [p, route] = queue[i]; if (p === q.goal) return route;
    for (const [name, dx, dy] of [['Nach oben', 0, -1], ['Nach links', -1, 0], ['Nach unten', 0, 1], ['Nach rechts', 1, 0]]) {
      const x = p % q.size + dx, y = Math.floor(p / q.size) + dy, n = y * q.size + x;
      if (x < 0 || x >= q.size || y < 0 || y >= q.size || q.obstacles.includes(n) || seen.has(n)) continue;
      seen.add(n); queue.push([n, route.concat(name)]);
    }
  }
  throw Error('Unreachable generated route');
}
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  try {
    const context = await browser.newContext({ viewport: { width: 820, height: 1180 }, hasTouch: true, reducedMotion: 'reduce' });
    await context.addInitScript(() => {
      if (localStorage.getItem('complete-story-test')) return;
      localStorage.setItem('farbklecks.settings.v2', JSON.stringify({ sound: false, 'learning.stage': 3 }));
      localStorage.setItem('farbklecks.progress.v1', JSON.stringify({ stars: 7, done: { 'learn:pattern:1': 1, 'expedition:treasure:1': 1, 'adventure:robot:1': 1 } }));
      localStorage.setItem('complete-story-test', 'yes');
    });
    const page = await context.newPage(), errors = [], external = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('request', r => { if (!r.url().startsWith('http://127.0.0.1:8000') && !r.url().startsWith('data:')) external.push(r.url()); });
    const shots = process.env.FARBTUPF_SHOTS || '/tmp/farbtupf-complete-story'; fs.mkdirSync(shots, { recursive: true });
    const shot = name => page.screenshot({ path: path.join(shots, name) });
    const ready = () => page.waitForFunction(() => !!window.FK?.forestScene && FK.current() === 'forest', null, { timeout: 90000 });
    const world = () => page.evaluate(() => FK.forestState.get());
    const session = id => page.evaluate(id => FK.forestState.getActivity(id), id);
    const currentRoot = async () => page.locator('.screen-' + await page.evaluate(() => FK.current()));
    await page.goto('http://127.0.0.1:8000/'); await ready();
    await page.evaluate(() => FK.store.put('full-story-legacy-check', { picture: 'kept', revision: 8 }));
    await page.getByRole('button', { name: 'Mit dem Fuchs losgehen', exact: true }).tap();
    async function demonstration(id) {
      const root = await currentRoot(); if (!await root.locator('.forest-demo').count()) return;
      const a = await session(id), game = a.game;
      if (game === 'treasure') { await root.locator('.exp-hide').tap(); await root.locator('.memory-demo-hand').locator('..').tap(); }
      if (game === 'robot') { await root.getByRole('button', { name: 'Nach rechts', exact: true }).tap(); await root.getByRole('button', { name: 'Nach rechts', exact: true }).tap(); }
      await root.getByRole('button', { name: 'Jetzt selber probieren', exact: true }).tap();
      if (a.question) assert.deepEqual(await session(id), a);
    }
    async function resume(id) {
      const before = await session(id), label = await page.evaluate(id => FK.forestActivity.backLabel(id), id), root = await currentRoot();
      await root.getByRole('button', { name: label, exact: true }).tap(); await ready(); await page.reload(); await ready();
      assert.deepEqual(await session(id), before);
      await page.locator('.forest-goal').tap();
      const resident = await page.evaluate(id => FK.forestState.definition(id).resident, id);
      await page.locator('.forest-dialog-' + resident).waitFor({ timeout: 120000 });
      await page.locator('.forest-dialog-' + resident + ' .forest-primary').tap();
      assert.deepEqual(await session(id), before);
    }
    async function completePuzzle(id, interruptions = true) {
      await demonstration(id);
      while (!(await session(id)).finished) {
        const a = await session(id), root = await currentRoot();
        if (a.game === 'pattern') {
          if (!a.answered) await root.getByRole('button', { name: a.question.answer, exact: true }).tap();
          if (interruptions && id === 'shared-seating-v1' && a.round === 0) { await resume(id); assert.equal(await (await currentRoot()).locator('.learn-answer:disabled').count(), 3); }
        } else if (a.game === 'treasure') {
          if (!a.concealed && !a.answered) await root.locator('.exp-hide').tap();
          if (interruptions && id === 'kingfisher-view-v1' && a.round === 0) { await resume(id); assert.equal((await session(id)).concealed, true); }
          if (!a.answered) await (await currentRoot()).getByRole('button', { name: a.question.answer, exact: true }).tap();
        } else if (!a.answered) {
          if (interruptions && id === 'waterside-stories-v1' && a.round === 0) {
            await root.getByRole('button', { name: 'Nach rechts', exact: true }).tap(); await root.getByRole('button', { name: 'Nach rechts', exact: true }).tap();
            await resume(id); assert.equal((await session(id)).position, 2);
            await (await currentRoot()).getByRole('button', { name: 'Einen Schritt zurück', exact: true }).tap();
          }
          const now = await session(id); for (const step of solve(now.question, now.position)) await (await currentRoot()).getByRole('button', { name: step, exact: true }).tap();
        }
        await (await currentRoot()).locator('.learn-next').tap();
      }
      await (await currentRoot()).locator('.forest-round-finish').waitFor();
      assert.equal(await page.evaluate(() => FK.progress.stars()), 7);
    }
    const completed = [];
    for (let guard = 0; guard < 18; guard++) {
      const target = await page.evaluate(() => FK.forestState.objective());
      if (target.kind === 'ending') break;
      await page.locator('.forest-goal').tap();
      if (target.quest === 'forest-invitation-v1') {
        await page.waitForFunction(() => { const p = FK.forestScene.position, fox = FK.forestScene.scene.getObjectByName('fox'); return Math.abs(p.x) < 2.5 && Math.abs(p.z - 24) < 2 && fox.position.y > 0.2; }, null, { timeout: 120000 });
      }
      const dialog = page.locator('.forest-dialog-' + target.resident); await dialog.waitFor({ timeout: 150000 });
      if (target.kind === 'chapter') {
        await shot('chapter-' + target.chapter + '.png'); await dialog.getByRole('button', { name: 'Gemeinsam weitergehen', exact: true }).tap();
        console.log('PASS: pictured transition into ' + target.chapter + '.'); continue;
      }
      if (target.resident === 'hare' && target.quest === 'bridge-neighbours-v1') { await dialog.locator('.forest-secondary').tap(); continue; }
      if (target.quest === 'kingfisher-view-v1') await shot('01-kingfisher-request.png');
      await dialog.locator('.forest-primary').tap(); await completePuzzle(target.quest);
      completed.push(target.quest); assert.equal(Object.keys((await world()).contributions).length, completed.length);
      await (await currentRoot()).locator('.forest-scene-return').tap(); await ready();
      if (target.quest === 'bridge-neighbours-v1') await page.waitForFunction(() => FK.forestState.get().payoffSeen, null, { timeout: 20000 });
      else {
        await page.locator('.forest-dialog-' + target.resident).waitFor({ timeout: 20000 });
        if (target.quest === 'kingfisher-view-v1') await shot('02-water-view-restored.png');
        await page.locator('.forest-dialog-' + target.resident + ' .forest-secondary').tap();
      }
      console.log('PASS: completed and returned from ' + target.quest + '.');
    }
    assert.equal(completed.length, 9); assert.equal((await world()).endingSeen, false);
    await page.locator('.forest-goal').tap(); await page.locator('.forest-dialog-home').waitFor({ timeout: 150000 });
    assert.equal((await world()).endingUnlocked, true);
    await page.getByRole('button', { name: 'Geschichte weiter', exact: true }).tap(); await page.getByRole('button', { name: 'Geschichte weiter', exact: true }).tap();
    assert.equal((await world()).endingPage, 2);
    await page.locator('.forest-book').tap(); await page.reload(); await ready();
    await page.locator('.forest-dialog-home').waitFor(); assert.equal((await world()).endingPage, 2);
    await page.getByRole('button', { name: 'Geschichte weiter', exact: true }).tap();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForFunction(() => FK.forestScene.scene.getObjectByName('kingfisher').position.x < 0 && FK.forestScene.scene.getObjectByName('kingfisher').position.z < 12);
    await shot('03-finale-phone.png');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.getByRole('button', { name: 'Im Wald weiterspielen', exact: true }).tap();
    assert.equal((await world()).endingSeen, true); assert.equal((await world()).endingReplay, false);
    const finalContributions = (await world()).contributions;
    await page.locator('.forest-book').tap();
    await page.getByRole('button', { name: 'Mit Biber spielen', exact: true }).tap(); await shot('04-guided-practice-book.png');
    for (const [game, title] of [['pattern', 'Muster entdecken'], ['treasure', 'Waldschätze merken'], ['robot', 'Wege finden']]) {
      await page.getByRole('button', { name: title + ' spielen', exact: true }).tap();
      const id = 'beaver-' + game + '-practice-v1'; await completePuzzle(id, false);
      await (await currentRoot()).locator('.forest-scene-return').tap();
      assert.equal(await page.evaluate(() => FK.current()), 'forest-book');
      assert.deepEqual((await world()).contributions, finalContributions); assert.equal((await world()).endingSeen, true);
    }
    await page.getByRole('button', { name: 'Alle Spiele öffnen', exact: true }).tap(); assert.equal(await page.evaluate(() => FK.current()), 'hub');
    await page.getByRole('button', { name: 'Zurück zum Wald', exact: true }).tap(); await ready();
    await page.evaluate(async () => { await navigator.serviceWorker.ready; }); await page.reload(); await ready();
    await context.setOffline(true); await page.reload(); await ready();
    for (const name of ['water-view-deck', 'garden-shortcut', 'waterside-story-link', 'restored-meeting-clearing', 'shared-seating', 'picture-invitations', 'heart-tree-awake']) assert.equal(await page.evaluate(name => FK.forestScene.scene.getObjectByName(name).visible, name), true, name);
    assert.equal((await world()).endingSeen, true); assert.equal(await page.evaluate(() => FK.progress.stars()), 7);
    assert.equal(await page.evaluate(() => FK.settings.get('learning.stage')), 3);
    assert.deepEqual(await page.evaluate(() => FK.store.get('full-story-legacy-check')), { picture: 'kept', revision: 8 });
    assert.deepEqual(errors, []); assert.deepEqual(external, []);
    console.log('PASS: all nine quests, three chapters, saved ending, five gathered neighbours, optional practice without story effects, full library, offline restored world and preserved legacy data.');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exit(1); });
