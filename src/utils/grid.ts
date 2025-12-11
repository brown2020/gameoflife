import { Grid, CellState } from "@/types/game";

/** Create an empty grid with given dimensions */
export const createEmptyGrid = (rows: number, cols: number): Grid =>
  Array.from({ length: rows }, () => Array<CellState>(cols).fill(0));

/** Shallow copy a grid (for immutable updates) */
export const copyGrid = (grid: Grid): Grid =>
  grid.map((row) => [...row] as CellState[]);

/** Update a single cell immutably, returns same grid reference if unchanged */
export const updateCell = (
  grid: Grid,
  row: number,
  col: number,
  value: CellState
): Grid => {
  if (grid[row][col] === value) return grid;
  const newGrid = copyGrid(grid);
  newGrid[row][col] = value;
  return newGrid;
};

/** Toggle a single cell immutably */
export const toggleCell = (grid: Grid, row: number, col: number): Grid => {
  const newGrid = copyGrid(grid);
  newGrid[row][col] = grid[row][col] ? 0 : 1;
  return newGrid;
};
