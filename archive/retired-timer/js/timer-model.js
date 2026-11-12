/* Optional foreground play time. It never changes a puzzle, star or story key. */
(function () {
  'use strict';
  const FK = window.FK, KEY = 'farbtupf.timer.v1', MAX_MS = 7 * 24 * 60 * 60 * 1000;
  function createTimer(options = {}) {
    const now = options.now || (() => typeof performance !== 'undefined' ? performance.now() : Date.now());
    const storage = options.storage || { getItem: key => localStorage.getItem(key), setItem: (key, value) => localStorage.setItem(key, value) };
    let mode = 'off', durationMs = 15 * 60 * 1000, elapsedMs = 0, running = false, completed = false, active = true;
    let anchor = now(), lastWrite = anchor;
    const listeners = new Set(), endListeners = new Set();
    try {
      const saved = JSON.parse(storage.getItem(KEY));
      if (saved?.version === 1 && ['off', 'stopwatch', 'countdown'].includes(saved.mode)) {
        mode = saved.mode;
        if (Number.isFinite(saved.durationMs) && saved.durationMs >= 1000 && saved.durationMs <= MAX_MS) durationMs = Math.round(saved.durationMs);
        if (Number.isFinite(saved.elapsedMs) && saved.elapsedMs >= 0 && saved.elapsedMs <= MAX_MS) elapsedMs = saved.elapsedMs;
        if (mode === 'countdown') elapsedMs = Math.min(elapsedMs, durationMs);
        if (mode === 'off') elapsedMs = 0;
        completed = mode === 'countdown' && elapsedMs === durationMs;
        // A reload restores the measured time paused, never a wall-clock deadline.
      }
    } catch (_) { /* works without storage */ }
    function snapshot() { return { mode, durationMs, elapsedMs, running, completed, active,
      remainingMs: mode === 'countdown' ? Math.max(0, durationMs - elapsedMs) : null,
      displayMs: mode === 'countdown' ? Math.max(0, durationMs - elapsedMs) : elapsedMs }; }
    function persist() {
      try { storage.setItem(KEY, JSON.stringify({ version: 1, mode, durationMs, elapsedMs, running, completed })); } catch (_) { /* keep playing */ }
      lastWrite = now();
    }
    function emit() { const state = snapshot(); listeners.forEach(fn => fn(state)); }
    function tick() {
      const current = now(), delta = Math.max(0, current - anchor); anchor = current;
      if (!running || !active || mode === 'off') return snapshot();
      const previousSecond = Math.floor(elapsedMs / 1000);
      elapsedMs = Math.min(mode === 'countdown' ? durationMs : MAX_MS, elapsedMs + delta);
      if (mode === 'countdown' && elapsedMs >= durationMs && !completed) {
        completed = true; running = false; persist(); emit(); endListeners.forEach(fn => fn(snapshot()));
      } else {
        if (mode === 'stopwatch' && elapsedMs === MAX_MS) running = false;
        if (Math.floor(elapsedMs / 1000) !== previousSecond) emit();
        if (current - lastWrite >= 5000) persist();
      }
      return snapshot();
    }
    return {
      KEY, get: snapshot, tick,
      configure(nextMode, duration = durationMs) {
        if (!['off', 'stopwatch', 'countdown'].includes(nextMode) || !Number.isFinite(duration) || duration < 1000 || duration > MAX_MS) return false;
        tick(); mode = nextMode; durationMs = Math.round(duration); elapsedMs = 0; running = false; completed = false; anchor = now(); persist(); emit(); return true;
      },
      start() { tick(); if (mode === 'off' || completed) return false; running = true; anchor = now(); persist(); emit(); return true; },
      pause() { tick(); running = false; persist(); emit(); },
      reset() { tick(); elapsedMs = 0; running = false; completed = false; anchor = now(); persist(); emit(); },
      setActive(value) { tick(); active = value === true; anchor = now(); emit(); },
      flush() { tick(); if (mode !== 'off') persist(); },
      subscribe(fn) { listeners.add(fn); fn(snapshot()); return () => listeners.delete(fn); },
      onComplete(fn) { endListeners.add(fn); return () => endListeners.delete(fn); },
    };
  }
  function format(milliseconds, countdown = false) {
    if (!Number.isFinite(milliseconds)) milliseconds = 0;
    const seconds = Math.max(0, countdown ? Math.ceil(milliseconds / 1000) : Math.floor(milliseconds / 1000));
    const hours = Math.floor(seconds / 3600), minutes = Math.floor(seconds / 60) % 60, rest = seconds % 60;
    return (hours ? String(hours).padStart(2, '0') + ':' : '') + String(minutes).padStart(2, '0') + ':' + String(rest).padStart(2, '0');
  }
  FK.createPlayTimer = createTimer; FK.playTimerFormat = format; FK.playTimer = createTimer();
})();
