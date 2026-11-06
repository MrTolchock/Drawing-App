const {seedSeenStoryScenes}=require('./cinema-support.cjs');
const BASE_URL = process.env.FARBTUPF_BASE_URL || 'http://127.0.0.1:8000';
/* The running woodland and all three flat families share actual loaded paintings. */
const { chromium } = require('/opt/codex/cua_node/lib/node_modules/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  try {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, hasTouch: true, reducedMotion: 'reduce' });
    await context.addInitScript(seedSeenStoryScenes);
    await context.addInitScript(() => {
      if (localStorage.getItem('painted-test')) return;
      localStorage.setItem('farbklecks.settings.v2', JSON.stringify({ sound: false, 'learning.stage': 3 }));
      localStorage.setItem('farbklecks.progress.v1', JSON.stringify({ stars: 7, done: { 'learn:pattern:1': 1 } }));
      localStorage.setItem('painted-test', 'yes');
    });
    const page = await context.newPage(), errors = [], failed = [], external = [];
    page.on('pageerror', e => errors.push(e.message)); page.on('requestfailed', r => failed.push(r.url()));
    page.on('request', r => { if (!r.url().startsWith(BASE_URL) && !r.url().startsWith('data:')) external.push(r.url()); });
    const shots = process.env.FARBTUPF_SHOTS || '/tmp/farbtupf-painted-test'; fs.mkdirSync(shots, { recursive: true });
    const shot = name => page.screenshot({ path: shots + '/' + name + '.png', animations: 'disabled' });
    const session = () => page.evaluate(() => FK.forestState.getActivity(FK.forestState.QUEST));
    await page.goto(BASE_URL + '/', { waitUntil: 'networkidle' });
    await page.waitForFunction(() => !!FK.forestScene, null, { timeout: 60000 });
    await page.evaluate(async()=>{await document.fonts.ready;await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));});
    await page.getByRole('button', { name: 'Mit dem Fuchs losgehen', exact: true }).tap();
    await page.waitForTimeout(600); await shot('01-painted-world-desktop');
    const world = await page.evaluate(async () => {
      const THREE = await import('/vendor/three/three.module.js'), runtime = FK.forestScene;
      const paintings = []; runtime.scene.traverse(o => { if (o.isSprite && o.userData.painting) paintings.push(o); });
      const oak = paintings.find(o => o.name === 'painted-oak'), scale = oak.getWorldScale(new THREE.Vector3()), centre = oak.getWorldPosition(new THREE.Vector3());
      const camera = runtime.camera, right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0), up = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1);
      function hits(x, y) {
        const point = centre.clone().addScaledVector(right, (x - oak.center.x) * scale.x).addScaledVector(up, (y - oak.center.y) * scale.y);
        const ray = new THREE.Raycaster(camera.position, point.sub(camera.position).normalize()); ray.camera = camera;
        return ray.intersectObject(oak).length;
      }
      return { realWorld: runtime.renderer.isWebGLRenderer && camera.isOrthographicCamera, paintings: paintings.length,
        loaded: paintings.every(o => o.material.map.image.width > 1000), transparentCorner: hits(0.015, 0.985), trunk: hits(0.5, 0.4),
        foxViews: runtime.scene.getObjectByName('fox').children.filter(o => o.isSprite && o.visible).length };
    });
    assert.equal(world.realWorld, true); assert.ok(world.paintings > 25); assert.equal(world.loaded, true);
    assert.equal(world.transparentCorner, 0); assert.equal(world.trunk, 1); assert.equal(world.foxViews, 1);
    await page.evaluate(async () => {
      await FK.store.put('painted-drawing', { strokes: 'retained' });
      const m = FK.forestState; m.startActivity(); m.demoSeen(m.QUEST); FK.forestActivity.launch(m.QUEST);
    });
    const first = await session();
    assert.equal(await page.locator('.learn-train .woodland-art').count(), first.question.sequence.length);
    assert.deepEqual((await page.locator('.learn-answer').allTextContents()).map(s => s.trim()), ['', '', '']);
    assert.deepEqual((await page.locator('.learn-answer').evaluateAll(list => list.map(b => b.getAttribute('aria-label')).sort())), ['Blatt', 'Feder', 'Haselnuss']);
    await shot('02-painted-pattern-desktop');
    await page.getByRole('button', { name: 'Beispiel nochmals zeigen', exact: true }).tap();
    assert.match(await page.locator('.forest-demo-pattern').getAttribute('aria-label'), /Blatt, Haselnuss/);
    await page.getByRole('button', { name: 'Jetzt selber probieren', exact: true }).tap(); assert.deepEqual(await session(), first);
    const incorrect = first.question.choices.find(v => v !== first.question.answer);
    await page.locator('.learn-answer[data-answer=' + JSON.stringify(incorrect) + ']').tap();
    assert.equal((await session()).answered, false);
    for (const size of [{ width: 390, height: 844 }, { width: 820, height: 1180 }, { width: 844, height: 390 }, { width: 320, height: 568 }]) {
      await page.setViewportSize(size);
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      assert.equal(await page.locator('.screen-learn .learn-body').evaluate(el => el.scrollWidth > el.clientWidth + 1), false, 'first pattern at ' + size.width + 'px');
      await page.locator('.learn-answer').last().scrollIntoViewIfNeeded();
      const bounds = await page.locator('.learn-answer').last().boundingBox(); assert.ok(bounds.width >= 80 && bounds.height >= 80);
    }
    await page.setViewportSize({ width: 390, height: 844 }); await shot('03-painted-pattern-phone');
    await page.locator('.learn-answer[data-answer=' + JSON.stringify(first.question.answer) + ']').tap();
    const answered = await session(); assert.equal(answered.answered, true);
    await page.evaluate(() => FK.go('forest-book')); await shot('04-painted-book-phone');
    assert.equal(await page.locator('.forest-book-game[data-game="count"]').count(), 1);
    await page.getByRole('button',{name:'Mit Biber spielen',exact:true}).tap();
    assert.equal(await page.locator('.forest-guided-games .woodland-art').count(), 8);
    await page.evaluate(() => { FK.forestState.startPractice('treasure', 'beaver'); FK.forestActivity.launch(FK.forestStory.collections.beaver.find(p => p.game === 'treasure').id); });
    await page.getByRole('button', { name: 'Jetzt selber probieren', exact: true }).tap();
    assert.equal(await page.locator('.memory-pictured .exp-treasures .woodland-art').count(), 3);
    await page.locator('.exp-hide').tap(); await shot('05-painted-memory-phone');
    assert.equal(await page.locator('.memory-gap').count(), 1);
    await page.locator('.exp-hide').tap(); assert.equal(await page.locator('.memory-gap').count(), 0);
    await page.evaluate(() => { FK.forestState.startPractice('robot', 'beaver'); FK.forestActivity.launch(FK.forestStory.collections.beaver.find(p => p.game === 'robot').id); });
    await page.getByRole('button', { name: 'Jetzt selber probieren', exact: true }).tap(); await shot('06-painted-route-phone');
    assert.equal(await page.locator('.route-pictured .adventure-map [data-painting="fox-right"]').count(), 1);
    assert.equal(await page.locator('.route-pictured .adventure-map [data-painting="beaver"]').count(), 1);
    await page.locator('.route-right').tap(); await page.locator('.route-undo').tap();
    await page.evaluate(() => FK.go('forest')); await page.waitForTimeout(600); await shot('07-painted-world-phone');
    await page.evaluate(async () => { await navigator.serviceWorker.ready; }); await page.reload();
    await page.waitForFunction(() => !!FK.forestScene, null, { timeout: 60000 });
    assert.deepEqual(await session(), answered); assert.equal(await page.evaluate(() => FK.progress.stars()), 7);
    assert.equal(await page.evaluate(() => FK.settings.get('learning.stage')), 3);
    assert.deepEqual(await page.evaluate(() => FK.store.get('painted-drawing')), { strokes: 'retained' });
    await context.setOffline(true); await page.reload(); await page.waitForFunction(() => !!FK.forestScene, null, { timeout: 60000 });
    await page.evaluate(() => FK.forestActivity.launch(FK.forestState.QUEST));
    assert.equal(await page.locator('.learn-next').isVisible(), true);
    assert.deepEqual(await session(), answered); assert.deepEqual(errors, []); assert.deepEqual(external, []); assert.deepEqual(failed, []);
    // Round three is the longest stage-one row: six objects plus its empty slot.
    await page.locator('.learn-next').tap();
    const second = await session(); await page.locator('.learn-answer[data-answer=' + JSON.stringify(second.question.answer) + ']').tap(); await page.locator('.learn-next').tap();
    assert.equal((await session()).question.sequence.length, 6);
    for (const width of [320, 390, 700, 820]) {
      await page.setViewportSize({ width, height: 844 });
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      const bounds = await page.locator('.screen-learn .learn-body').evaluate(el => ({ scroll: el.scrollWidth, client: el.clientWidth }));
      assert.ok(bounds.scroll <= bounds.client + 1, 'long pattern at ' + width + 'px: ' + JSON.stringify(bounds));
    }
    await page.setViewportSize({ width: 390, height: 844 }); await shot('08-long-pattern-phone');
    console.log('PASS: loaded painted Three.js world, alpha-aware tree taps, four fox views, shared painted puzzle art, natural picture labels, guidance without changing the live item, wrong-answer retry, four viewport layouts, all three families, exact answered recovery, artwork/stars/stage and offline art.');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exit(1); });
