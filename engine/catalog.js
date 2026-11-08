// Buildings the player can add. Every building takes one cell for now.
// `model` is a path relative to assets/models/ and is only used by the renderer.

export const BUILDINGS = [
  { id: 'habitat', name: 'Habitat', model: 'kaykit-space-base/basemodule_A.gltf' },
  { id: 'greenhouse', name: 'Greenhouse', model: 'kaykit-space-base/dome.gltf' },
  { id: 'solar', name: 'Solar Array', model: 'kaykit-space-base/roofmodule_solarpanels.gltf' },
  { id: 'landingpad', name: 'Landing Pad', model: 'kaykit-space-base/landingpad_small.gltf' },
];

export function getBuildingType(id) {
  const type = BUILDINGS.find((b) => b.id === id);
  if (!type) throw new Error(`Unknown building type: ${id}`);
  return type;
}
