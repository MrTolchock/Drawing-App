/* Farbklecks – Speicher: Einstellungen (localStorage) und Bilder (IndexedDB). */
(function () {
  'use strict';
  const FK = (window.FK = window.FK || {});

  const SETTINGS_KEY = 'farbklecks.settings.v1';
  const DB_NAME = 'farbklecks';
  const DB_VERSION = 1;

  function loadSettings() {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      return raw ? JSON.parse(raw) || {} : {};
    } catch (e) {
      return {};
    }
  }

  function saveSettings(obj) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(obj));
    } catch (e) { /* private mode or blocked storage: settings just aren't remembered */ }
  }

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
    loadSettings,
    saveSettings,
    getCurrent: () => tx('state', 'readonly', (s) => s.get('current')),
    putCurrent: (rec) => tx('state', 'readwrite', (s) => s.put(rec, 'current')),
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
