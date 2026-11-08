// Connects the control panel, the engine and the renderer.

import { CONFIG } from './config.js';
import { createBase, addBuildingRandom, BUILDINGS, getBuildingType } from './engine/index.js';
import { createScene } from './render/scene.js';
import { createBaseView } from './render/baseView.js';

const canvas = document.getElementById('scene');
const frame = document.getElementById('frame');
frame.style.width = `${CONFIG.frame.width}px`;
frame.style.height = `${CONFIG.frame.height}px`;

const view = createScene(canvas, CONFIG);
const baseView = createBaseView(CONFIG);
view.scene.add(baseView.root);

const seedInput = document.getElementById('seed');
const message = document.getElementById('message');
const list = document.getElementById('buildings');
seedInput.value = CONFIG.defaultSeed;

let base;

async function reset() {
  base = createBase({ cellsPerSide: CONFIG.island.cellsPerSide, seed: Number(seedInput.value) || 0 });
  await baseView.setIsland(base.island);
  await baseView.setBuildings(base);
  view.fitTo(baseView.islandGroup);
  refreshPanel('');
}

async function add(typeId) {
  const result = addBuildingRandom(base, typeId);
  if (!result.ok) {
    refreshPanel('No free cell left on the island.');
    return;
  }
  await baseView.setBuildings(base);
  refreshPanel(`${getBuildingType(typeId).name} added at (${result.building.x}, ${result.building.z}).`);
}

function refreshPanel(text) {
  message.textContent = text;
  list.innerHTML = '';
  for (const b of base.buildings) {
    const li = document.createElement('li');
    li.textContent = `#${b.id} ${getBuildingType(b.type).name} (${b.x}, ${b.z})`;
    list.appendChild(li);
  }
}

const buttons = document.getElementById('add-buttons');
for (const type of BUILDINGS) {
  const button = document.createElement('button');
  button.textContent = `Add ${type.name}`;
  button.addEventListener('click', () => add(type.id));
  buttons.appendChild(button);
}
document.getElementById('add-random').addEventListener('click', () => {
  add(BUILDINGS[Math.floor(Math.random() * BUILDINGS.length)].id);
});
document.getElementById('reset').addEventListener('click', reset);

// Exposed for debugging in the browser console.
window.spaceStation = { get base() { return base; }, view };

function loop() {
  view.render();
  requestAnimationFrame(loop);
}

reset().then(loop);
