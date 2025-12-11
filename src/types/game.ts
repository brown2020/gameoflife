/**
 * Shared type definitions for the Game of Life
 */

/** Tool types for grid interaction */
export type Tool = "pointer" | "draw" | "eraser";

/** Cell state: 0 = dead, 1 = alive */
export type CellState = 0 | 1;

/** Grid representation as a 2D array of cell states */
export type Grid = CellState[][];

/** Coordinate tuple for patterns */
export type Coordinate = [number, number];

/** Pattern definition as array of coordinates */
export type Pattern = Coordinate[];

/** Neighbor offset for calculating adjacent cells */
export type NeighborOffset = readonly [number, number];

/** Modal types for the game */
export type ModalType = "rules" | "tutorial" | null;
