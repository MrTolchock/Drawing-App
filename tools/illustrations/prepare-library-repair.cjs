#!/usr/bin/env node
/* Rebuild a recorded repair from the exact previous atlases and retained redraws. */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');
const { execFileSync } = require('node:child_process');
const sharp = require('../node_modules/sharp');

const root = path.resolve(__dirname, '../..');
const read = file => fs.readFileSync(path.join(root, file));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const json = file => JSON.parse(read(file));
const rgba = bytes => sharp(bytes).toColourspace('srgb').ensureAlpha().raw().toBuffer({ resolveWithObject: true });

function readRepair(file) {
  const repair = json(file);
  if (repair.format !== 'waldpost-library-cell-repair' || repair.version !== 1 || !/^[a-f0-9]{40}$/.test(repair.baseCommit)) {
    throw Error('Invalid library repair record: ' + file);
  }
  const style = json('design/illustrations/style.json');
  const block = read(style.styleBlock).toString().trimEnd();
  const redraws = repair.redraws.map(recordFile => {
    const record = json(recordFile);
    const referencePaths = record.references.map(ref => ref.path);
    if (record.style !== style.id || !record.request.prompt.startsWith(block) ||
        record.request.transparent_background !== true || record.subjects.length !== 4 ||
        JSON.stringify(referencePaths) !== JSON.stringify(record.request.referenced_image_paths)) {
      throw Error('Invalid retained redraw request: ' + recordFile);
    }
    if (!style.references.every((ref, index) => ref.path === referencePaths[index] && ref.sha256 === record.references[index].sha256)) {
      throw Error('Redraw lacks the ordered canonical references: ' + recordFile);
    }
    for (const ref of record.references) {
      if (hash(read(ref.preservedAt || ref.path)) !== ref.sha256) throw Error('Reference changed: ' + ref.path);
    }
    if (hash(read(record.source)) !== record.sourceSha256) throw Error('Redraw source changed: ' + record.source);
    return { ...record, recordFile };
  });
  return { repair, redraws };
}

function neighbours(index, width, height, visit) {
  if (index % width > 0) visit(index - 1);
  if (index % width < width - 1) visit(index + 1);
  if (index >= width) visit(index - width);
  if (index < width * (height - 1)) visit(index + width);
}

// Generated subjects can cross a nominal grid line. Identify the complete silhouettes on the original canvas.
function components({ data, info: { width, height } }, alpha) {
  const labels = new Int32Array(width * height);
  const queue = new Int32Array(labels.length);
  const parts = [];
  for (let start = 0; start < labels.length; start++) {
    if (labels[start] || data[start * 4 + 3] < alpha) continue;
    const label = parts.length + 1;
    let count = 1, x = 0, y = 0;
    queue[0] = start;
    labels[start] = label;
    function add(index) {
      if (labels[index] || data[index * 4 + 3] < alpha) return;
      labels[index] = label;
      queue[count++] = index;
    }
    for (let head = 0; head < count; head++) {
      const index = queue[head];
      x += index % width;
      y += Math.floor(index / width);
      neighbours(index, width, height, add);
    }
    const cell = (x / count < width / 2 ? 0 : 1) + (y / count < height / 2 ? 0 : 2);
    parts.push({ label, count, cell });
  }
  return { labels, parts: parts.sort((a, b) => b.count - a.count) };
}

// Retain the original soft pencil edges near the opaque strokes. Remove the distant, low-alpha matte.
function isolate(img, isSubject, radius) {
  const { width, height } = img.info;
  const data = Buffer.from(img.data);
  const distance = new Uint8Array(width * height).fill(255);
  const queue = new Int32Array(distance.length);
  let count = 0;
  for (let i = 0; i < distance.length; i++) {
    if (!isSubject(i)) continue;
    distance[i] = 0;
    queue[count++] = i;
  }
  for (let head = 0; head < count; head++) {
    const at = queue[head], next = distance[at] + 1;
    if (next > radius) continue;
    neighbours(at, width, height, index => {
      if (distance[index] !== 255) return;
      distance[index] = next;
      queue[count++] = index;
    });
  }
  for (let i = 0; i < distance.length; i++) {
    if (distance[i] > radius) data[i * 4 + 3] = 0;
    else if (distance[i] === radius) data[i * 4 + 3] = Math.round(data[i * 4 + 3] / 2);
  }
  return { data, info: img.info };
}

function bounds({ data, info: { width, height } }, alpha = 32) {
  let left = width, top = height, right = -1, bottom = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] < alpha) continue;
      left = Math.min(left, x);
      top = Math.min(top, y);
      right = Math.max(right, x);
      bottom = Math.max(bottom, y);
    }
  }
  if (right < 0) throw Error('Subject is empty');
  return { left, top, width: right - left + 1, height: bottom - top + 1 };
}

function cellRect(entry) {
  const { x, y, width, height } = entry.sourceRect;
  const left = Math.floor(x), top = Math.floor(y);
  return { left, top, width: Math.floor(x + width) - left, height: Math.floor(y + height) - top };
}

function paste(target, pixels, left, top) {
  const rowBytes = pixels.info.width * 4;
  for (let y = 0; y < pixels.info.height; y++) {
    const destination = ((top + y) * target.info.width + left) * 4;
    pixels.data.copy(target.data, destination, y * rowBytes, (y + 1) * rowBytes);
  }
}

function restoreUneditedCells(base, assembled, entries) {
  // Older atlases have half-pixel cell boundaries. Preserve the shared boundary pixels of every untouched cell.
  for (const entry of entries) {
    const { x, y, width, height } = entry.sourceRect;
    for (let row = Math.floor(y); row < Math.ceil(y + height); row++) {
      const start = (row * base.info.width + Math.floor(x)) * 4;
      const end = (row * base.info.width + Math.ceil(x + width)) * 4;
      base.data.copy(assembled.data, start, start, end);
    }
  }
}

async function fit(img, width, height, { longestSideRatio, centre: [centreX, centreY] }) {
  const main = bounds(img);
  const scale = Math.round(Math.min(width, height) * longestSideRatio) / Math.max(main.width, main.height);
  const left = Math.max(0, main.left - 4), top = Math.max(0, main.top - 4);
  const crop = {
    left, top,
    width: Math.min(img.info.width, main.left + main.width + 4) - left,
    height: Math.min(img.info.height, main.top + main.height + 4) - top
  };
  const resized = await sharp(img.data, { raw: img.info }).extract(crop)
    .resize(Math.round(crop.width * scale), Math.round(crop.height * scale), { fit: 'fill', kernel: 'lanczos3' })
    .raw().toBuffer({ resolveWithObject: true });
  const visible = bounds(resized);
  const x = Math.round(width * centreX - visible.width / 2 - visible.left);
  const y = Math.round(height * centreY - visible.height / 2 - visible.top);
  if (x < 0 || y < 0 || x + resized.info.width > width || y + resized.info.height > height) {
    throw Error('Subject does not fit in its cell');
  }
  const canvas = { data: Buffer.alloc(width * height * 4), info: { width, height, channels: 4 } };
  paste(canvas, resized, x, y);
  return canvas;
}

async function prepare(file, output, only) {
  const { repair, redraws } = readRepair(file);
  const snapshot = file => execFileSync('git', ['show', repair.baseCommit + ':' + file], { cwd: root, maxBuffer: 16 * 1024 * 1024 });
  const library = JSON.parse(snapshot('assets/waldatelier/library.json'));
  const atlasCache = new Map();
  function atlas(id) {
    if (!atlasCache.has(id)) {
      const sheet = library.sheets.find(sheet => sheet.id === id);
      const input = snapshot('assets/waldatelier/' + sheet.file);
      if (hash(input) !== sheet.sha256) throw Error('Original atlas does not match the library: ' + id);
      atlasCache.set(id, rgba(input));
    }
    return atlasCache.get(id);
  }
  const edits = only ? [[only, repair.sheets[only]]] : Object.entries(repair.sheets);
  if (edits.some(([, sheet]) => !sheet)) throw Error('Unknown repaired sheet: ' + only);
  const targetIds = new Set(edits.flatMap(([, sheet]) => sheet.ids));
  const repaint = new Map();
  for (const record of redraws) {
    if (!record.subjects.some(id => targetIds.has(id))) continue;
    const img = await rgba(read(record.source));
    const { labels, parts } = components(img, repair.framing.generatedAlphaCore);
    const subjects = parts.slice(0, 4);
    if (subjects.length !== 4 || new Set(subjects.map(subject => subject.cell)).size !== 4 ||
        subjects[3].count < labels.length * 0.025) {
      throw Error('Expected four separate silhouettes: ' + record.source);
    }
    for (const { label, cell } of subjects) {
      repaint.set(record.subjects[cell], isolate(img, index => labels[index] === label, 6));
    }
  }
  fs.mkdirSync(output, { recursive: true });
  for (const [id, sheet] of edits) {
    const base = await atlas(id);
    const assembled = { ...base, data: Buffer.from(base.data) };
    for (const subject of sheet.ids) {
      const cell = library.images.find(image => image.id === subject && image.sheet === id);
      const destination = cellRect(cell);
      let picture = repaint.get(subject);
      if (!picture) {
        const original = library.images.find(image => image.id === (repair.reuse[subject] || subject));
        const source = cellRect(original);
        for (const [field, offset] of Object.entries(repair.sourceRectAdjustments[subject] || {})) source[field] += offset;
        const { data, info } = await atlas(original.sheet);
        const cropped = await sharp(data, { raw: info }).extract(source).raw().toBuffer({ resolveWithObject: true });
        picture = isolate(cropped, index => cropped.data[index * 4 + 3] >= repair.framing.matteAlphaCore, 3);
      }
      const fitted = await fit(picture, destination.width, destination.height, repair.framing);
      paste(assembled, fitted, destination.left, destination.top);
    }
    restoreUneditedCells(base, assembled, library.images.filter(image => image.sheet === id && !sheet.ids.includes(image.id)));
    await sharp(assembled.data, { raw: assembled.info }).withIccProfile('srgb').webp({ lossless: true, effort: 6 })
      .toFile(path.join(output, id + '.webp'));
    console.log(id + ': prepared ' + sheet.ids.length + ' picture cells');
  }
}

module.exports = { readRepair };
if (require.main === module) {
  const [record, output, only] = process.argv.slice(2);
  if (!record || !output) {
    console.error('Usage: node tools/illustrations/prepare-library-repair.cjs <record.json> <output directory> [sheet]');
    process.exitCode = 1;
  } else prepare(record, output, only).catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
