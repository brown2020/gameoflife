// patterns.ts

const numRows = 50; // Number of rows for the grid
const numCols = 50; // Number of columns for the grid

// Type for the grid: a 2D array of numbers
type Grid = number[][];

// Helper function to create an empty grid
const createEmptyGrid = (): Grid => {
  return Array.from({ length: numRows }, () => Array(numCols).fill(0));
};

// Predefined starting states
export const patterns: { [key: string]: Grid } = {
  Glider: createEmptyGrid().map((row, i) =>
    row.map((cell, j) =>
      (i === 1 && j === 2) ||
      (i === 2 && j === 3) ||
      (i === 3 && j === 1) ||
      (i === 3 && j === 2) ||
      (i === 3 && j === 3)
        ? 1
        : 0
    )
  ),
  LWSS: createEmptyGrid().map((row, i) =>
    row.map((cell, j) =>
      (i === 1 && j === 2) ||
      (i === 1 && j === 3) ||
      (i === 1 && j === 4) ||
      (i === 1 && j === 5) ||
      (i === 2 && j === 1) ||
      (i === 2 && j === 5) ||
      (i === 3 && j === 5) ||
      (i === 4 && j === 1) ||
      (i === 4 && j === 4)
        ? 1
        : 0
    )
  ),
  Pulsar: createEmptyGrid().map((row, i) =>
    row.map((cell, j) =>
      ((i === 6 || i === 7 || i === 8 || i === 12 || i === 13 || i === 14) &&
        (j === 4 || j === 9 || j === 11 || j === 16)) ||
      ((i === 4 || i === 9 || i === 11 || i === 16) &&
        (j === 6 || j === 7 || j === 8 || j === 12 || j === 13 || j === 14))
        ? 1
        : 0
    )
  ),
  GosperGliderGun: createEmptyGrid().map((row, i) =>
    row.map((cell, j) =>
      // Left block
      (i === 5 && j === 1) ||
      (i === 5 && j === 2) ||
      (i === 6 && j === 1) ||
      (i === 6 && j === 2) ||
      // Left "hook" shape
      (i === 3 && j === 13) ||
      (i === 3 && j === 14) ||
      (i === 4 && j === 12) ||
      (i === 4 && j === 16) ||
      (i === 5 && j === 11) ||
      (i === 5 && j === 17) ||
      (i === 6 && j === 11) ||
      (i === 6 && j === 15) ||
      (i === 6 && j === 17) ||
      (i === 6 && j === 18) ||
      (i === 7 && j === 11) ||
      (i === 7 && j === 17) ||
      (i === 8 && j === 12) ||
      (i === 8 && j === 16) ||
      (i === 9 && j === 13) ||
      (i === 9 && j === 14) ||
      // Right glider-producing part
      (i === 1 && j === 25) ||
      (i === 2 && j === 23) ||
      (i === 2 && j === 25) ||
      (i === 3 && j === 21) ||
      (i === 3 && j === 22) ||
      (i === 4 && j === 21) ||
      (i === 4 && j === 22) ||
      (i === 5 && j === 21) ||
      (i === 5 && j === 22) ||
      (i === 6 && j === 23) ||
      (i === 6 && j === 25) ||
      (i === 7 && j === 25) ||
      // Rightmost block
      (i === 3 && j === 35) ||
      (i === 4 && j === 35) ||
      (i === 3 && j === 36) ||
      (i === 4 && j === 36)
        ? 1
        : 0
    )
  ),
  Diehard: createEmptyGrid().map((row, i) =>
    row.map((cell, j) =>
      (i === 10 && j === 30) ||
      (i === 11 && j === 24) ||
      (i === 11 && j === 25) ||
      (i === 12 && j === 25) ||
      (i === 11 && j === 29) ||
      (i === 11 && j === 30) ||
      (i === 11 && j === 31)
        ? 1
        : 0
    )
  ),
  Pentadecathlon: createEmptyGrid().map((row, i) =>
    row.map((cell, j) =>
      // First vertical bar
      (i === 10 && j === 14) || // Top single cell
      (i === 11 && (j === 13 || j === 15)) || // Top double cells
      (i >= 12 && i <= 17 && j === 14) || // Middle single cells
      (i === 18 && (j === 13 || j === 15)) || // Bottom double cells
      (i === 19 && j === 14) || // Bottom single cell
      // Second vertical bar, 8 cells apart
      (i === 10 && j === 24) || // Top single cell of the second bar
      (i === 11 && (j === 23 || j === 25)) || // Top double cells of the second bar
      (i >= 12 && i <= 17 && j === 24) || // Middle single cells of the second bar
      (i === 18 && (j === 23 || j === 25)) || // Bottom double cells of the second bar
      (i === 19 && j === 24) // Bottom single cell of the second bar
        ? 1
        : 0
    )
  ),
  Toad: createEmptyGrid().map((row, i) =>
    row.map((cell, j) =>
      (i === 10 && j === 11) ||
      (i === 10 && j === 12) ||
      (i === 10 && j === 13) ||
      (i === 11 && j === 10) ||
      (i === 11 && j === 11) ||
      (i === 11 && j === 12)
        ? 1
        : 0
    )
  ),
  Beacon: createEmptyGrid().map((row, i) =>
    row.map((cell, j) =>
      (i === 10 && j === 10) ||
      (i === 10 && j === 11) ||
      (i === 11 && j === 10) ||
      (i === 12 && j === 13) ||
      (i === 13 && j === 12) ||
      (i === 13 && j === 13)
        ? 1
        : 0
    )
  ),
};
