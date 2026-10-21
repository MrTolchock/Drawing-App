/* Farbklecks – kleine Helfer, die alle Module brauchen. */
(function () {
  'use strict';
  const FK = (window.FK = window.FK || {});

  FK.VERSION = '2.0.0';
  FK.TAU = Math.PI * 2;
  FK.$ = (sel, root) => (root || document).querySelector(sel);
  FK.$$ = (sel, root) => Array.prototype.slice.call((root || document).querySelectorAll(sel));
  FK.clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  FK.rnd = (a, b) => a + Math.random() * (b - a);
  FK.pick = (arr) => arr[(Math.random() * arr.length) | 0];
  FK.shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      const t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  };
  FK.wait = (ms) => new Promise((r) => setTimeout(r, ms));
  FK.reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  // h('div', { class: 'x', onclick: fn, style: {…}, html: '<b>…</b>' }, child, 'text', …)
  FK.h = function h(tag, attrs) {
    const el = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach((k) => {
        const v = attrs[k];
        if (v === undefined || v === null || v === false) return;
        if (k === 'class') el.className = v;
        else if (k === 'html') el.innerHTML = v;
        else if (k === 'text') el.textContent = v;
        else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
        else if (k.slice(0, 2) === 'on' && typeof v === 'function') el.addEventListener(k.slice(2), v);
        else if (k === 'dataset') Object.assign(el.dataset, v);
        else el.setAttribute(k, v === true ? '' : v);
      });
    }
    for (let i = 2; i < arguments.length; i++) {
      const c = arguments[i];
      if (c === null || c === undefined || c === false) continue;
      if (Array.isArray(c)) c.forEach((x) => x && el.append(x));
      else el.append(c);
    }
    return el;
  };

  // Inline SVG icon from the sprite in index.html.
  FK.icon = (name, cls) => '<svg class="' + (cls || 'ic') + '" aria-hidden="true" focusable="false"><use href="#i-' + name + '"/></svg>';

  /* ---------- colours ---------- */
  function hexRgb(hex) {
    const n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function rgbCss(r, g, b) {
    return 'rgb(' + Math.round(r) + ',' + Math.round(g) + ',' + Math.round(b) + ')';
  }
  function mix(hex, toHex, t) {
    const a = hexRgb(hex);
    const b = hexRgb(toHex);
    return rgbCss(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t);
  }
  function hsl(h, s, l) {
    return 'hsl(' + ((((h % 360) + 360) % 360) | 0) + ',' + s + '%,' + l + '%)';
  }
  function hslRgb(h, s, l) {
    h = (((h % 360) + 360) % 360) / 360;
    s /= 100;
    l /= 100;
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const f = (t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    return [f(h + 1 / 3) * 255, f(h) * 255, f(h - 1 / 3) * 255];
  }
  FK.color = Object.assign(FK.color || {}, { hexRgb, rgbCss, mix, hsl, hslRgb });

  /* ---------- text: GROSS or normal spelling, set by parents ---------- */
  // 'gross' → everything children read is in capitals (kindergarten), 'normal' → German spelling,
  // syllables in lowercase (ma mi mo).
  FK.text = {
    mode() { return (FK.settings && FK.settings.get('schrift')) || 'gross'; },
    word(w) { return FK.text.mode() === 'gross' ? w.toLocaleUpperCase('de-CH') : w; },
    syllable(s) { return FK.text.mode() === 'gross' ? s.toLocaleUpperCase('de-CH') : s.toLocaleLowerCase('de-CH'); },
  };

  /* ---------- tiny event bus ---------- */
  const handlers = {};
  FK.on = (evt, fn) => {
    (handlers[evt] = handlers[evt] || []).push(fn);
    return () => { handlers[evt] = handlers[evt].filter((f) => f !== fn); };
  };
  FK.emit = (evt, data) => {
    (handlers[evt] || []).slice().forEach((fn) => {
      try { fn(data); } catch (e) { setTimeout(() => { throw e; }); }
    });
  };

  // Canvas → Blob (Safari has toBlob since iOS 11).
  FK.canvasBlob = (c, type, q) => new Promise((resolve, reject) => {
    c.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), type || 'image/png', q);
  });
  FK.blobToImage = (blob) => {
    const viaImg = () => new Promise((resolve, reject) => {
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
      img.onerror = (err) => { URL.revokeObjectURL(url); reject(err); };
      img.src = url;
    });
    if (window.createImageBitmap) return createImageBitmap(blob).catch(viaImg);
    return viaImg();
  };
})();
