// The island: for now a flat square of cells, all buildable.

export function createFlatIsland(cellsPerSide) {
  const cells = [];
  for (let z = 0; z < cellsPerSide; z++) {
    for (let x = 0; x < cellsPerSide; x++) {
      cells.push({ x, z, height: 0, buildable: true });
    }
  }
  return { cellsPerSide, cells };
}

export function getCell(island, x, z) {
  return island.cells.find((c) => c.x === x && c.z === z) ?? null;
}
