/**
 * Game constants and configuration values
 */

/** Grid dimension defaults */
export const GRID = {
  DEFAULT_ROWS: 50,
  DEFAULT_COLS: 50,
  MIN_DIMENSION: 5,
} as const;

/** Cell size configuration */
export const CELL_SIZE = {
  DEFAULT: 20,
  MIN: 5,
  MAX: 30,
  STEP: 2,
} as const;

/** Simulation speed configuration (in milliseconds) */
export const SPEED = {
  MIN: 10,
  MAX: 500,
  DEFAULT: 100,
  STEP: 10,
} as const;

/** Cell colors for rendering */
export const COLORS = {
  CELL_ALIVE: "#22c55e",
  CELL_DEAD: "#111827",
  GRID_LINE: "#374151",
} as const;

/** Neighbor offsets for calculating adjacent cells (8-directional) */
export const NEIGHBOR_OFFSETS = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
] as const;

/** Random grid density (probability of a cell being alive) */
export const RANDOM_DENSITY = 0.3;
