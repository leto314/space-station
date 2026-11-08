import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { CONFIG } from '../config.js';
import { createBase, addBuildingRandom, BUILDINGS } from '../engine/index.js';

const engineDir = fileURLToPath(new URL('../engine/', import.meta.url));

test('the island has cellsPerSide x cellsPerSide cells', () => {
  const base = createBase({ cellsPerSide: CONFIG.island.cellsPerSide, seed: 1 });
  assert.equal(base.island.cells.length, CONFIG.island.cellsPerSide ** 2);
});

test('a building lands on a cell of the island and two buildings never share a cell', () => {
  const base = createBase({ cellsPerSide: 4, seed: 7 });
  for (let i = 0; i < 16; i++) assert.ok(addBuildingRandom(base, BUILDINGS[i % BUILDINGS.length].id).ok);
  const keys = base.buildings.map((b) => `${b.x},${b.z}`);
  assert.equal(new Set(keys).size, keys.length);
  for (const b of base.buildings) {
    assert.ok(b.x >= 0 && b.x < 4 && b.z >= 0 && b.z < 4);
  }
});

test('adding a building to a full island is refused', () => {
  const base = createBase({ cellsPerSide: 2, seed: 3 });
  for (let i = 0; i < 4; i++) addBuildingRandom(base, 'habitat');
  assert.deepEqual(addBuildingRandom(base, 'habitat'), { ok: false, reason: 'no-space' });
  assert.equal(base.buildings.length, 4);
});

test('same seed and same actions give the same base', () => {
  const build = (seed) => {
    const base = createBase({ cellsPerSide: 8, seed });
    for (const type of ['habitat', 'solar', 'greenhouse', 'landingpad']) addBuildingRandom(base, type);
    return base;
  };
  assert.deepEqual(build(42), build(42));
});

test('the base state survives a JSON round trip', () => {
  const base = createBase({ cellsPerSide: 8, seed: 5 });
  addBuildingRandom(base, 'habitat');
  assert.deepEqual(JSON.parse(JSON.stringify(base)), base);
});

test('the engine does not depend on three.js or the browser', () => {
  for (const file of readdirSync(engineDir).filter((f) => f.endsWith('.js'))) {
    const source = readFileSync(join(engineDir, file), 'utf8');
    assert.doesNotMatch(source, /from ['"](three|\.\.\/render|\.\.\/vendor)/, file);
    assert.doesNotMatch(source, /\b(window|document)\./, file);
  }
});
