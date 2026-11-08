// The base: an island plus the buildings placed on it.
// The state is plain JSON, so it can be saved or sent anywhere.

import { createFlatIsland } from './island.js';
import { getBuildingType } from './catalog.js';
import { createRng } from './rng.js';

export function createBase({ cellsPerSide, seed }) {
  return {
    seed,
    // Number of random draws made so far, so the generator can be rebuilt.
    rngCalls: 0,
    island: createFlatIsland(cellsPerSide),
    buildings: [],
  };
}

function freeCells(base) {
  const taken = new Set(base.buildings.map((b) => `${b.x},${b.z}`));
  return base.island.cells.filter((c) => c.buildable && !taken.has(`${c.x},${c.z}`));
}

// Puts a building on a random free cell.
// Returns { ok: true, building } or { ok: false, reason }.
export function addBuildingRandom(base, typeId) {
  getBuildingType(typeId);
  const free = freeCells(base);
  if (free.length === 0) return { ok: false, reason: 'no-space' };

  const rng = createRng(base.seed);
  for (let i = 0; i < base.rngCalls; i++) rng.next();
  const cell = rng.pick(free);
  base.rngCalls += 1;

  const building = { id: base.buildings.length + 1, type: typeId, x: cell.x, z: cell.z };
  base.buildings.push(building);
  return { ok: true, building };
}
