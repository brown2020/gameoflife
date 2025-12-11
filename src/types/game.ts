/**
 * Shared type definitions for the Game of Life
 */

/** Tool types for grid interaction */
export type Tool = "pointer" | "draw" | "eraser";

/** Grid representation as a 2D array of cell states (0 = dead, 1 = alive) */
export type Grid = number[][];

/** Coordinate tuple for patterns */
export type Coordinate = [number, number];

/** Pattern definition as array of coordinates */
export type Pattern = Coordinate[];

/** Neighbor offset for calculating adjacent cells */
export type NeighborOffset = readonly [number, number];
