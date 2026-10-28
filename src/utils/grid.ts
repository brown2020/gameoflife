import { Grid, CellState } from "@/types/game";
import { GRID } from "@/constants/game";

/** Check if coordinates are within grid bounds */
export const isInBounds = (
  row: number,
  col: number,
  numRows: number,
  numCols: number
): boolean => row >= 0 && row < numRows && col >= 0 && col < numCols;

/** Create an empty grid with given dimensions */
export const createEmptyGrid = (rows: number, cols: number): Grid =>
  Array.from({ length: rows }, () => Array<CellState>(cols).fill(0));

/** Shallow copy a grid (for immutable updates) */
const copyGrid = (grid: Grid): Grid =>
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

/**
 * Largest cell grid that fits inside a content box.
 * Uses floor so `cols * cellSize` never exceeds the content width.
 */
export const fitGridDimensions = (
  width: number,
  height: number,
  cellSize: number,
  minDimension: number = GRID.MIN_DIMENSION
): { rows: number; cols: number } => {
  const safeCell = cellSize > 0 ? cellSize : 1;
  return {
    cols: Math.max(minDimension, Math.floor(width / safeCell)),
    rows: Math.max(minDimension, Math.floor(height / safeCell)),
  };
};

/** Inclusive grid cells on the straight line from (r0, c0) to (r1, c1). */
export const cellsAlongLine = (
  r0: number,
  c0: number,
  r1: number,
  c1: number
): Array<{ r: number; c: number }> => {
  const cells: Array<{ r: number; c: number }> = [];
  let r = r0;
  let c = c0;
  const dr = Math.abs(r1 - r0);
  const dc = Math.abs(c1 - c0);
  const stepRow = r0 < r1 ? 1 : -1;
  const stepCol = c0 < c1 ? 1 : -1;
  let err = dc - dr;

  while (true) {
    cells.push({ r, c });
    if (r === r1 && c === c1) break;
    const doubled = 2 * err;
    if (doubled > -dr) {
      err -= dr;
      c += stepCol;
    }
    if (doubled < dc) {
      err += dc;
      r += stepRow;
    }
  }

  return cells;
};
