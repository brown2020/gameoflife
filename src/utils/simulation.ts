import { Grid, CellState } from "@/types/game";
import { NEIGHBOR_OFFSETS } from "@/constants/game";
import { createEmptyGrid, isInBounds } from "@/utils/grid";

export type SimulationStepResult = {
  grid: Grid;
  changed: boolean;
  shouldStop: boolean;
};

/** Pure Conway step with live-cell bounding-box optimization. */
export function stepSimulation(
  currentGrid: Grid,
  numRows: number,
  numCols: number
): SimulationStepResult {
  let minRow = numRows;
  let maxRow = 0;
  let minCol = numCols;
  let maxCol = 0;
  let hasLiveCells = false;

  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      if (currentGrid[i]?.[j]) {
        hasLiveCells = true;
        minRow = Math.min(minRow, i);
        maxRow = Math.max(maxRow, i);
        minCol = Math.min(minCol, j);
        maxCol = Math.max(maxCol, j);
      }
    }
  }

  if (!hasLiveCells) {
    return { grid: currentGrid, changed: false, shouldStop: true };
  }

  minRow = Math.max(0, minRow - 1);
  maxRow = Math.min(numRows - 1, maxRow + 1);
  minCol = Math.max(0, minCol - 1);
  maxCol = Math.min(numCols - 1, maxCol + 1);

  const newGrid = currentGrid.map((row, i) =>
    i >= minRow && i <= maxRow ? ([...row] as CellState[]) : row
  );

  let hasChanged = false;

  for (let i = minRow; i <= maxRow; i++) {
    for (let j = minCol; j <= maxCol; j++) {
      let neighbors = 0;
      for (const [dx, dy] of NEIGHBOR_OFFSETS) {
        const ni = i + dx;
        const nj = j + dy;
        if (isInBounds(ni, nj, numRows, numCols)) {
          neighbors += currentGrid[ni][nj];
        }
      }

      const current = currentGrid[i][j];
      let next: CellState = current;
      if (neighbors < 2 || neighbors > 3) {
        next = 0;
      } else if (current === 0 && neighbors === 3) {
        next = 1;
      }

      if (next !== current) {
        hasChanged = true;
        newGrid[i][j] = next;
      }
    }
  }

  if (!hasChanged) {
    return { grid: currentGrid, changed: false, shouldStop: true };
  }

  return { grid: newGrid, changed: true, shouldStop: false };
}

/** Copy cells into a new grid sized to nextRows x nextCols. */
export function resizeGrid(
  prev: Grid,
  nextRows: number,
  nextCols: number
): Grid {
  const newGrid = createEmptyGrid(nextRows, nextCols);
  const copyRows = Math.min(prev.length, nextRows);
  const copyCols = Math.min(prev[0]?.length ?? 0, nextCols);
  for (let i = 0; i < copyRows; i++) {
    for (let j = 0; j < copyCols; j++) {
      newGrid[i][j] = prev[i][j];
    }
  }
  return newGrid;
}
