// Shared settings for the engine and the renderer.
// Tests rely on these values, so change them here rather than in the code.

export const CONFIG = {
  // Size of the square scene view, in CSS pixels: the width of a phone
  // screen, so the island takes about half of the screen height.
  frame: { width: 390, height: 390, marginPx: 12 },

  // The island is a square grid of cells. One cell = one terrain block.
  island: { cellsPerSide: 8 },

  // World size of one cell. The KayKit terrain blocks are 2 x 2 units.
  cellSize: 2,

  // Seed used when the page opens.
  defaultSeed: 1,

  // True isometric view: the camera looks along (1, 1, 1),
  // i.e. 45 degrees around and about 35.26 degrees down.
  camera: { azimuthDeg: 45, elevationDeg: 35.264, distance: 50 },
};
