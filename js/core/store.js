/* Farbklecks – Speicher.
   FK.settings  – parent settings (localStorage)
   FK.progress  – stars and what the child has finished (localStorage)
   FK.store     – drawings and pictures as blobs (IndexedDB)
   Everything stays on the device. Every access is wrapped so the app also runs where storage is blocked. */
(function () {
  'use strict';
  const FK = (window.FK = window.FK || {});

  function readJSON(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) || {} : {};
    } catch (e) {
      return {};
    }
  }
  function writeJSON(key, obj) {
    try {
      localStorage.setItem(key, JSON.stringify(obj));
    } catch (e) { /* private mode or blocked storage */ }
  }

  /* ---------- settings ---------- */
  const SETTINGS_KEY = 'farbklecks.settings.v2';
  const DEFAULTS = { sound: true, schrift: 'gross' };
  let settings = Object.assign({}, DEFAULTS, readJSON(SETTINGS_KEY));
  FK.settings = {
    get(k) { return settings[k]; },
    set(k, v) {
      settings[k] = v;
      writeJSON(SETTINGS_KEY, settings);
      FK.emit && FK.emit('settings', { key: k, value: v });
    },
    all() { return Object.assign({}, settings); },
  };

  /* ---------- progress & stars ---------- */
  const PROGRESS_KEY = 'farbklecks.progress.v1';
  let progress = Object.assign({ stars: 0, done: {} }, readJSON(PROGRESS_KEY));
  if (!progress.done || typeof progress.done !== 'object') progress.done = {};

  FK.progress = {
    stars() { return progress.stars | 0; },
    // kind: 'color' | 'trace' | 'dots' | 'read' | 'free'; id: e.g. 'katze:zahlen', 'A', 'pp-stern'
    isDone(kind, id) { return !!progress.done[kind + ':' + id]; },
    count(kind, id) { return progress.done[kind + ':' + id] | 0; },
    doneCount(kind) {
      const p = kind + ':';
      return Object.keys(progress.done).filter((k) => k.indexOf(p) === 0).length;
    },
    // Records a finished activity. Returns the number of NEW stars (only the first time,
    // unless `always` is set). The caller shows the celebration.
    finish(kind, id, stars, always) {
      const key = kind + ':' + id;
      const first = !progress.done[key];
      progress.done[key] = (progress.done[key] | 0) + 1;
      const n = first || always ? stars | 0 : 0;
      progress.stars = (progress.stars | 0) + n;
      writeJSON(PROGRESS_KEY, progress);
      if (n) FK.emit && FK.emit('stars', { total: progress.stars, added: n });
      return n;
    },
    reset() {
      progress = { stars: 0, done: {} };
      writeJSON(PROGRESS_KEY, progress);
      FK.emit && FK.emit('stars', { total: 0, added: 0 });
    },
  };

  /* ---------- IndexedDB ---------- */
  const DB_NAME = 'farbklecks';
  const DB_VERSION = 2;
  let dbPromise = null;

  function db() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      if (!window.indexedDB) return reject(new Error('no indexedDB'));
      let req;
      try {
        req = indexedDB.open(DB_NAME, DB_VERSION);
      } catch (e) {
        return reject(e);
      }
      req.onupgradeneeded = () => {
        const d = req.result;
        if (!d.objectStoreNames.contains('state')) d.createObjectStore('state');
        if (!d.objectStoreNames.contains('bilder')) d.createObjectStore('bilder', { keyPath: 'id' });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
      req.onblocked = () => reject(new Error('blocked'));
    });
    dbPromise.catch(() => { dbPromise = null; });
    return dbPromise;
  }

  function tx(storeName, mode, fn) {
    return db().then((d) => new Promise((resolve, reject) => {
      const t = d.transaction(storeName, mode);
      const s = t.objectStore(storeName);
      let result;
      const r = fn(s);
      if (r) r.onsuccess = () => { result = r.result; };
      t.oncomplete = () => resolve(result);
      t.onerror = () => reject(t.error);
      t.onabort = () => reject(t.error);
    }));
  }

  FK.store = {
    // key/value state: 'free' (free drawing), 'c:<pageId>:<mode>' (colouring progress)
    get: (key) => tx('state', 'readonly', (s) => s.get(key)),
    put: (key, rec) => tx('state', 'readwrite', (s) => s.put(rec, key)),
    del: (key) => tx('state', 'readwrite', (s) => s.delete(key)),
    keys: () => tx('state', 'readonly', (s) => (s.getAllKeys ? s.getAllKeys() : null)).then((k) => k || []),
    // finished pictures for «Meine Bilder»
    listBilder: () => tx('bilder', 'readonly', (s) => s.getAll()).then((all) =>
      (all || []).sort((a, b) => (b.updated || 0) - (a.updated || 0))),
    getBild: (id) => tx('bilder', 'readonly', (s) => s.get(id)),
    putBild: (rec) => tx('bilder', 'readwrite', (s) => s.put(rec)),
    deleteBild: (id) => tx('bilder', 'readwrite', (s) => s.delete(id)),
    persist() {
      try {
        if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
      } catch (e) { /* not supported */ }
    },
  };
})();
