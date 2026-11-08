// Draws a base state: one terrain block per island cell, one model per building.
// It only reads the state; all decisions are made by the engine.

import * as THREE from 'three';
import { getBuildingType } from '../engine/index.js';
import { loadModel } from './models.js';

const TERRAIN_MODEL = 'kaykit-space-base/terrain_low.gltf';

export function createBaseView(config) {
  const root = new THREE.Group();
  const islandGroup = new THREE.Group();
  const buildingGroup = new THREE.Group();
  root.add(islandGroup, buildingGroup);

  // Cell (x, z) -> world position of its centre, island centred on the origin.
  function cellToWorld(x, z, cellsPerSide) {
    const offset = (cellsPerSide - 1) / 2;
    return new THREE.Vector3((x - offset) * config.cellSize, 0, (z - offset) * config.cellSize);
  }

  async function setIsland(island) {
    islandGroup.clear();
    const blocks = await Promise.all(island.cells.map(() => loadModel(TERRAIN_MODEL)));
    island.cells.forEach((cell, i) => {
      blocks[i].position.copy(cellToWorld(cell.x, cell.z, island.cellsPerSide));
      blocks[i].position.y = cell.height;
      islandGroup.add(blocks[i]);
    });
  }

  async function setBuildings(base) {
    const models = await Promise.all(
      base.buildings.map((b) => loadModel(getBuildingType(b.type).model)),
    );
    buildingGroup.clear();
    base.buildings.forEach((b, i) => {
      models[i].position.copy(cellToWorld(b.x, b.z, base.island.cellsPerSide));
      buildingGroup.add(models[i]);
    });
  }

  return { root, islandGroup, setIsland, setBuildings };
}
