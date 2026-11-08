// Checks that the project can run: Node version, vendored three.js, models.
// Run it first in a new environment: nothing needs to be installed.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { BUILDINGS } from '../engine/index.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const exists = (path) => existsSync(root + path);

test('Node is version 18 or newer', () => {
  const major = Number(process.versions.node.split('.')[0]);
  assert.ok(major >= 18, `Node ${process.versions.node} found, 18+ needed`);
});

test('three.js and the addons in use are vendored', () => {
  for (const path of [
    'vendor/three/three.module.js',
    'vendor/three/addons/loaders/GLTFLoader.js',
    'vendor/three/addons/utils/BufferGeometryUtils.js',
    'vendor/three/LICENSE',
  ]) {
    assert.ok(exists(path), `missing ${path}`);
  }
});

test('three.js loads in Node (for maths in tests, no rendering)', async () => {
  const THREE = await import('../vendor/three/three.module.js');
  assert.equal(typeof THREE.OrthographicCamera, 'function');
});

test('every model used by the catalog and the renderer exists, with its .bin and texture', () => {
  const models = [...BUILDINGS.map((b) => b.model), 'kaykit-space-base/terrain_low.gltf'];
  for (const model of models) {
    const path = `assets/models/${model}`;
    assert.ok(exists(path), `missing ${path}`);
    if (model.endsWith('.gltf')) {
      const dir = path.slice(0, path.lastIndexOf('/') + 1);
      const gltf = JSON.parse(readFileSync(root + path, 'utf8'));
      for (const uri of [...(gltf.buffers ?? []), ...(gltf.images ?? [])].map((x) => x.uri)) {
        assert.ok(exists(dir + uri), `${model} needs missing file ${dir + uri}`);
      }
    }
  }
});

test('each model pack ships its license', () => {
  assert.ok(exists('assets/models/kaykit-space-base/License.txt'));
  assert.ok(exists('assets/models/kenney-space-kit/License.txt'));
});
