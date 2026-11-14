/* Waldatelier: one illustration family for navigation, exercises and painting.
   Emoji values remain stable content identifiers and accessible text. They are
   displayed as our own artwork, including in the canvas stamp renderer. */
(function () {
  'use strict';
  const FK = window.FK;
  const sheets = {
    navigation: ['numbers','words','nature','shapes','painting','pictures','rocket','picnic','star','drum','robot','sprout','pencil','train','fox','palette'],
    animals: ['dog','cat','rabbit','fox-animal','hedgehog','bird','fish','bee','snail','spider','butterfly','caterpillar','ladybird','cow','sheep','pig'],
    creatures: ['zebra','lion','penguin','camel','tiger','beaver','frog','mouse','dragon','unicorn','bear','tortoise','tram','bus','car','steam-train'],
    'words-one': ['nose','sofa','rose','tin','trousers','magnifier','bicycle','kiwi','banana','tomato','rocket-word','watermelon','radio','camera','feather','needle'],
    'words-two': ['fork','parcel','sun','moon','flower','apple','carrot','croissant','biscuit','chocolate','scooter','egg','bell','fir','mushroom','crown'],
    'words-three': ['pear','snowman','heart','book','bed','clock','tree','cake','strawberry','grapes','icecream','boat','hat','ball','balloon','robot-word'],
    discovery: ['bean','seedling','plant','water','rain','cloud','sunset','bucket','letter','postbox','mailbox','nest','chick','cocoon','leaf','fire-engine'],
    people: ['mummy','daddy','grandma','grandpa','llama','judo','ufo','moped','lemonade','canoe','pilot','honey','cheese','comet','reader','blueberries'],
    alphabet: ['monkey','clown','dinosaur','elephant','giraffe','ear','whale','taxi','teddy','spoon','jacket','sunflower','ant','badger','bowl','spade'],
    menu: ['squirrel','blue-tit','berry-cluster','neighbour-houses','hand-mirror','magic-wand'],
    'forest-objects':['forest-nut','forest-apple','forest-berry','forest-leaf','forest-feather','forest-fir','forest-mushroom','forest-flower','forest-honey','forest-rose','forest-stone','forest-branch','forest-lantern','forest-shapes','forest-post','forest-basket'],
    'forest-actions':['mouse-sit','mouse-run','mouse-sleep','bird-fly','bird-sit','fish-swim','hare-run','hare-sit','fox-sleep','fox-run','cat-sleep','cat-sit','dog-run','dog-sleep','duck-swim','duck-fly'],
    'forest-wildlife':['squirrel-sit','squirrel-run','hedgehog-walk','hedgehog-sleep','badger-walk','badger-sleep','roe-stand','roe-run','frog-sit','frog-jump','forest-woodpecker','forest-bat','forest-owl','forest-robin','forest-lynx','forest-marten'],
    'rhyme-vocabulary':['rhyme-bread','rhyme-rail','rhyme-blanket','rhyme-bin','rhyme-jug','rhyme-mouth','rhyme-roof','rhyme-brook','rhyme-goat','rhyme-fly'],
    'puzzle-vocabulary':['vocab-house','vocab-table','vocab-shoe','vocab-leg','vocab-stone','vocab-cloth','vocab-tower','vocab-worm','vocab-pot','vocab-head','vocab-hand','vocab-sand','vocab-scarf','vocab-rope','vocab-arrow','vocab-cup','vocab-till','vocab-bench','vocab-wardrobe','vocab-seed'],
    'puzzle-flowers':['puzzle-flower-rot','puzzle-flower-gelb','puzzle-flower-blau','puzzle-flower-rosa','puzzle-flower-weiss','puzzle-flower-lila'],
  };
  const grid = { menu:[3,2], 'puzzle-vocabulary':[4,5], 'puzzle-flowers':[3,2] };
  const source = sheet => 'assets/waldatelier/' + sheet + '.webp';
  // Learning subjects are drawn illustrations; character identity uses friendsArt.
  const cast = {fox:'fox-animal',mouse:'mouse-sit',rabbit:'hare-sit'};
  const subjects = {};
  Object.keys(sheets).forEach(sheet => sheets[sheet].forEach((id,index) => {
    subjects[id] = { sheet, index, columns:(grid[sheet]||[4])[0], rows:(grid[sheet]||[4,4])[1] };
  }));
  const tokens = {};
  function bind(id, values) { values.split(' ').filter(Boolean).forEach(v => { tokens[v] = id; }); }
  [
    ['numbers','🔢'],['words','🔤'],['shapes','🔷'],['painting','🖌️'],['pictures','🖼️'],['rocket','🚀'],['picnic','🧺'],['star','⭐ 🌟 🌠'],['drum','🥁'],['robot','🤖'],['sprout','🌱'],['pencil','✏️ 👆 🖐️'],['train','🚂'],['fox','🦊'],['palette','🎨'],
    ['dog','🐶 🐕'],['cat','🐱 🐈'],['rabbit','🐰 🐇'],['hedgehog','🦔'],['bird','🐦'],['fish','🐟 🐠'],['bee','🐝'],['snail','🐌'],['spider','🕷️'],['butterfly','🦋'],['caterpillar','🐛'],['ladybird','🐞'],['cow','🐄 🐮'],['sheep','🐑'],['pig','🐷'],
    ['zebra','🦓'],['lion','🦁'],['penguin','🐧'],['camel','🐫 🐪'],['tiger','🐯'],['beaver','🦫'],['frog','🐸'],['mouse','🐭'],['dragon','🐉'],['unicorn','🦄'],['bear','🐻'],['tortoise','🐢'],['tram','🚋'],['bus','🚌'],['car','🚗'],
    ['nose','👃'],['sofa','🛋️'],['rose','🌹'],['tin','🥫'],['trousers','👖'],['magnifier','🔎 🔍'],['bicycle','🚲'],['kiwi','🥝'],['banana','🍌'],['tomato','🍅'],['watermelon','🍉'],['radio','📻'],['camera','📷'],['feather','🪶'],['needle','🪡'],
    ['fork','🍴'],['parcel','📦 🎁'],['sun','☀️'],['moon','🌙'],['flower','🌸 🌼'],['apple','🍎 🍏'],['carrot','🥕'],['croissant','🥐'],['biscuit','🍪'],['chocolate','🍫'],['scooter','🛴'],['egg','🥚'],['bell','🔔'],['fir','🌲'],['mushroom','🍄'],['crown','👑'],
    ['pear','🍐'],['snowman','⛄'],['heart','❤️ 💜'],['book','📖 📚'],['bed','🛏️'],['clock','⏰ ⌚'],['tree','🌳'],['cake','🍰'],['strawberry','🍓'],['grapes','🍇'],['icecream','🍦'],['boat','⛵'],['hat','👒 🎩'],['ball','⚽'],['balloon','🎈'],
    ['bean','🫘'],['plant','🪴'],['water','💧 🌊'],['rain','🌧️'],['cloud','☁️'],['sunset','🌇 🌄'],['bucket','🪣'],['letter','✉️ ✉ 💌'],['postbox','📮'],['mailbox','📬'],['nest','🪺'],['chick','🐣 🐤'],['cocoon','🟤'],['leaf','🌿 🍃 🍂 🍁'],['fire-engine','🚒'],
    ['mummy','👩‍👧'],['daddy','👨‍👧'],['grandma','👵'],['grandpa','👴'],['llama','🦙'],['judo','🥋'],['ufo','🛸'],['moped','🛵'],['lemonade','🥤'],['canoe','🛶'],['pilot','🧑‍✈️'],['honey','🍯'],['cheese','🧀'],['comet','☄️'],['blueberries','🫐'],
    ['monkey','🐒 🐵'],['clown','🤡 🎪'],['dinosaur','🦕 🦖'],['elephant','🐘'],['giraffe','🦒'],['ear','👂'],['whale','🐳'],['taxi','🚕'],['teddy','🧸'],['spoon','🥄'],['jacket','🧥'],['sunflower','🌻'],['ant','🐜'],['badger','🦡'],['bowl','🥣'],
  ].forEach(row => bind(row[0], row[1]));

  // Decorative instructions and exact geometric tokens use the same sepia icon
  // language. No picture-answer token is replaced by a different subject.
  const symbols = {
    '🇨🇭': '<path d="M6 7q18-3 36 0v34q-18-3-36 0z" fill="#c4745c"/><path d="M20 13h8v8h8v8h-8v8h-8v-8h-8v-8h8z" fill="#fffaf0" stroke="none"/>',
    '🌷': '<path d="M24 43V24M24 39Q7 39 8 26q13 0 16 13" fill="#94aa70"/><path d="m10 5 9 7 5-10 6 10 8-7v10c0 20-28 20-28 0z" fill="#d3a18b"/>',
    '🧊': '<path d="m7 15 17-9 17 9v21l-17 9-17-9z" fill="#d9e9e6"/><path d="m7 15 17 9 17-9M24 24v21M13 14l12-6m8 22 5-3" stroke="#94b0b6"/>',
    '🪨': '<path d="m5 33 6-16 16-8 13 11 4 18-18 5-19-4z" fill="#b6b1a2"/><path d="m11 17 12 13 17-10m-17 10 3 13m-3-13-18 3" stroke="#8f8a79"/>',
    '🌑': '<circle cx="24" cy="24" r="19" fill="#44524a"/><circle cx="17" cy="16" r="4" fill="#64715e"/><circle cx="30" cy="30" r="6" fill="#64715e"/>',
    '🧱': '<path d="M5 7h38v34H5z" fill="#c99675"/><path d="M5 18h38M5 30h38M17 7v11m13 0v12M17 30v11" stroke="#f1dfc7"/>',
    '🌦️': '<circle cx="31" cy="14" r="10" fill="#edcf83"/><path d="M31 1v3m12 1-2 3m5 7h-3"/><path d="M9 29C-1 24 9 12 16 18c6-15 23-7 20 4 10 0 10 12 0 12H12Z" fill="#dce9e7"/><path d="m14 38-2 6m13-6-2 6m13-6-2 6" stroke="#719aaa"/>',
    '💥': '<path d="m23 3 5 13 13-8-5 16 10 9-15 1-5 13-8-12-15 4 8-14-7-11 14 3z" fill="#e6ba79"/>',
    '🫐': '<circle cx="24" cy="25" r="17" fill="#697ca4"/><path d="m24 10 3 6 6-1-4 5 2 6-7-3-6 3 2-6-4-5 6 1z" fill="#43587d" stroke-width="1"/>',
    '🔵': '<circle cx="24" cy="24" r="16" fill="#458fc7"/>',
    '🟢': '<circle cx="24" cy="24" r="16" fill="#658b43"/>',
    '🟦': '<rect x="8" y="8" width="32" height="32" rx="1" fill="#458fc7"/>',
    '💡': '<path d="M17 31c-12-13-3-25 7-25s19 12 7 25l-3 4h-8z" fill="#f3d17f"/><path d="M19 40h10m-8 4h6"/>',
    '💬': '<path d="M7 9h34v24H24l-11 8v-8H7z" fill="#e0e8d1"/><path d="M15 18h18m-18 7h11"/>',
    '💭': '<ellipse cx="26" cy="20" rx="17" ry="12" fill="#e4ecdd"/><circle cx="12" cy="37" r="3"/><circle cx="6" cy="43" r="1"/>',
    '✨': '<path d="M25 4l5 14 14 5-14 5-5 15-5-15-15-5 15-5z" fill="#e6b85f"/>',
    '🪄': '<path d="M9 40l21-24m-6-8 2-5m10 5 6-2m-5 13 6 3"/><path d="M29 8l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill="#e6b85f"/>',
    '🪞': '<path d="M19 32v11h10V32" fill="#c89c63"/><ellipse cx="24" cy="19" rx="15" ry="17" fill="#d3e6e8"/><path d="M17 22 29 10" stroke="#fff"/>',
    '❓': '<path d="M15 15c0-13 23-13 23 0 0 8-14 7-14 17m0 9v1"/>',
    '❄️': '<path d="M24 4v40M7 14l34 20M7 34l34-20m-23-2 6 6 6-6m-12 24 6-6 6 6"/>',
    '🏠': '<path d="M5 22 24 6l19 16M10 19v24h28V19" fill="#e3c7a0"/><path d="M20 43V28h9v15"/>',
    '🏘️': '<path d="m2 23 13-12 13 12M7 22v20h17V22m0-7L35 5l12 11m-20-2v27h16V14" fill="#e3c7a0"/>',
    '🗺️': '<path d="m3 10 14-4 14 4 14-4v32l-14 4-14-4-14 4zm14-4v32m14-28v32" fill="#e2e9cd"/><path d="m8 30 6-10 10 5 12-10" stroke-dasharray="2 4"/>',
    '👾': '<path d="M10 13h28v25H10z" fill="#b6bf98"/><circle cx="18" cy="23" r="2"/><circle cx="30" cy="23" r="2"/><path d="M16 33h16M10 17H4m34 0h6M16 38v7m16-7v7"/>',
    '🌈': '<path d="M7 39v-8a17 17 0 0 1 34 0v8" stroke="#bb6f52" stroke-width="5"/><path d="M12 39v-8a12 12 0 0 1 24 0v8" stroke="#d8b657" stroke-width="5"/><path d="M17 39v-8a7 7 0 0 1 14 0v8" stroke="#719d8c" stroke-width="5"/>',
    '☆': '<path d="m24 3 6 14 15 2-11 11 3 15-13-8-13 8 3-15L3 19l15-2z" fill="#fbf5e6"/>',
    '🐾': '<ellipse cx="24" cy="31" rx="12" ry="10" fill="#b79d7d"/><circle cx="8" cy="20" r="4"/><circle cx="18" cy="10" r="4"/><circle cx="30" cy="10" r="4"/><circle cx="40" cy="20" r="4"/>',
    '🔒': '<rect x="10" y="22" width="28" height="21" rx="4" fill="#e9ddc5"/><path d="M16 22v-9a8 8 0 0 1 16 0v9m-8 8v6"/>',
    '🎲': '<rect x="5" y="5" width="38" height="38" rx="7" fill="#fff7e9"/><circle cx="15" cy="15" r="3"/><circle cx="33" cy="15" r="3"/><circle cx="24" cy="24" r="3"/><circle cx="15" cy="33" r="3"/><circle cx="33" cy="33" r="3"/>',
  };
  const aliases = { '❔':'❓', '🔐':'🔒', '🏆':'✨', '💎':'✨', '🛝':'🏘️', '🌆':'🏘️', '👤':'💭', '🎉':'✨', '😋':'💬', '🚶':'🗺️', '🔎':'magnifier' };
  delete tokens['🫐']; // A counter is one berry, never a whole jar of berries.
  bind('forest-nut','🌰');
  const lookup = value => subjects[value] ? value : tokens[value] || (aliases[value] && (subjects[aliases[value]] ? aliases[value] : tokens[aliases[value]])) || null;
  const resolve = value => { const id = lookup(value); return cast[id] || id; };
  // Atlases (P7): CSS backgrounds load with the screen that shows them. Canvas drawing (paint stamps)
  // loads a sheet on first use and keeps at most six, dropping the least recently used: each 1254 px
  // atlas is about 6 MB once decoded.
  const MAX_SHEETS = 6, images = new Map();
  function sheet(id) {
    let entry = images.get(id);
    if (entry) { images.delete(id); images.set(id, entry); return entry; }
    const img = new Image(); img.decoding = 'async';
    entry = { img, loaded: new Promise(done => { img.onload = () => done(true); img.onerror = () => done(false); }) };
    images.set(id, entry); img.src = source(id);
    while (images.size > MAX_SHEETS) { const [oldest, old] = images.entries().next().value; images.delete(oldest); old.img.onload = old.img.onerror = null; old.img.removeAttribute?.('src'); }
    return entry;
  }
  /** Load the sheets of the given pictures for canvas drawing; resolves when they are ready. */
  function load(values) {
    const ids = new Set([].concat(values).map(v => subjects[resolve(v)]?.sheet).filter(Boolean));
    return Promise.all([...ids].map(id => sheet(id).loaded));
  }
  const ready = Promise.resolve(true);
  function art(id, cls, label) {
    const resolved=resolve(id),themed=FK.friendsLibrary?.active?FK.puzzles?.pictures[resolved]:null;
    const rec = subjects[themed||resolved];
    const el = document.createElement('span'); el.className = 'wa-illustration ' + (cls || ''); el.dataset.artRole='subject'; el.dataset.subject=themed||resolved||String(id);
    if (label) { el.setAttribute('role', 'img'); el.setAttribute('aria-label', label); } else el.setAttribute('aria-hidden', 'true');
    if (rec) {
      el.style.backgroundImage = 'url("' + source(rec.sheet) + '")';
      el.style.backgroundSize = (rec.columns * 100) + '% ' + (rec.rows * 100) + '%';
      el.style.backgroundPosition = (rec.index % rec.columns * 100 / (rec.columns - 1)) + '% ' + (Math.floor(rec.index / rec.columns) * 100 / (rec.rows - 1)) + '%';
    }
    return el;
  }
  function glyph(value) {
    const key = symbols[value] ? value : aliases[value];
    const el = document.createElement('span'); el.className = 'wa-symbol'; el.setAttribute('aria-hidden','true');
    el.innerHTML = '<svg viewBox="0 0 48 48" fill="none" stroke="#725234" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' + (symbols[key] || symbols['✨']) + '</svg>';
    return el;
  }
  const keys = Object.keys(tokens).concat(Object.keys(symbols), Object.keys(aliases));
  const matcher = new RegExp(Array.from(new Set(keys)).sort((a,b) => b.length-a.length).map(s => s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'), 'gu');
  function decorateText(node) {
    if (!node || node.nodeType !== 3 || !node.parentElement || node.parentElement.closest('.wa-original,.wa-illustration,.wa-symbol,svg,script,style,textarea')) return;
    const text = node.nodeValue; matcher.lastIndex = 0;
    if (!matcher.test(text)) return;
    matcher.lastIndex = 0;
    const fragment = document.createDocumentFragment(); let last = 0, match;
    while ((match = matcher.exec(text))) {
      if (match.index > last) fragment.append(text.slice(last, match.index));
      fragment.append(match[0]==='🫐'&&FK.friendsLibrary?.active ? art('forest-berry') : resolve(match[0]) ? art(match[0]) : glyph(match[0]));
      const original = document.createElement('span'); original.className = 'wa-original'; original.textContent = match[0]; fragment.append(original);
      last = matcher.lastIndex;
    }
    if (last < text.length) fragment.append(text.slice(last));
    node.replaceWith(fragment);
  }
  function decorate(root) {
    if (!root) return;
    if (root.nodeType === 3) { decorateText(root); return; }
    if (root.nodeType !== 1 || root.closest('.wa-original,.wa-illustration,.wa-symbol,svg,script,style')) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), list = [];
    while (walker.nextNode()) list.push(walker.currentNode);
    list.forEach(decorateText);
  }
  function draw(value, ctx, x, y, size) {
    const rec = subjects[resolve(value)];
    if (!rec) return false;
    const {img} = sheet(rec.sheet); if (!img.complete || !img.naturalWidth) return false;
    const w = img.naturalWidth / rec.columns, hh = img.naturalHeight / rec.rows;
    ctx.drawImage(img, rec.index % rec.columns * w, Math.floor(rec.index / rec.columns) * hh, w, hh, x, y, size, size);
    return true;
  }
  FK.visual = { art, decorate, draw, load, ready, loadedSheets: () => [...images.keys()], subjects, tokens, source, has: value => !!resolve(value), supports: value => !!(resolve(value) || symbols[value] || symbols[aliases[value]]) };
  new MutationObserver(records => records.forEach(rec => {
    if (rec.type === 'characterData') decorateText(rec.target);
    else rec.addedNodes.forEach(decorate);
  })).observe(document.body, { childList:true, subtree:true, characterData:true });

  // Curate stamp/reward choices to subjects that have real, matching artwork.
  // Existing saved pictures stay pixels; reward count and progress keys stay stable.
  FK.STICKERS = FK.STICKERS.map(group => Object.assign({},group,{ items:group.items.filter(([token]) => !!resolve(token)) })).filter(group => group.items.length);
  FK.STICKERS.unshift({ icon:'🦊', name:'Waldatelier', items:[['🦊','Fuchs'],['🦡','Dachs'],['🦔','Igel'],['🦫','Biber'],['🐦','Eisvogel'],['🪺','Nest'],['🍃','Blatt'],['🌻','Sonnenblume'],['🚋','Tram'],['📮','Briefkasten'],['⛵','Segelboot'],['🧺','Picknickkorb']] });
  const collection = [['🦊','Fuchs'],['🐦','Eisvogel'],['🦋','Schmetterling'],['🦔','Igel'],['🐰','Hase'],['🐻','Bär'],['🦄','Einhorn'],['🐉','Drache'],['🐌','Schnecke'],['🐝','Biene'],['🐞','Marienkäfer'],['🐸','Frosch'],['🦫','Biber'],['🐧','Pinguin'],['🦁','Löwe'],['🦓','Zebra'],['🐘','Elefant'],['🦒','Giraffe'],['🐢','Schildkröte'],['🐳','Wal'],['🌹','Rose'],['🌻','Sonnenblume'],['🍄','Pilz'],['🌳','Baum'],['🍃','Blatt'],['☀️','Sonne'],['🌙','Mond'],['⭐','Stern'],['🚋','Tram'],['⛵','Segelboot'],['🚂','Zug'],['🚲','Velo'],['🛸','Ufo'],['🚀','Rakete'],['🤖','Roboter'],['🎈','Ballon'],['👑','Krone'],['🧸','Teddy'],['🍓','Erdbeere'],['🍎','Apfel'],['🍰','Kuchen'],['🎨','Farben']];
  FK.REWARDS = collection;
})();
