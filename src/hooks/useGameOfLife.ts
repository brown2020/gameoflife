import { useState, useEffect, useCallback, useRef } from "react";
import { patterns } from "@/utils/patterns";
import { Grid } from "@/types/game";
import {
  GRID,
  CELL_SIZE,
  SPEED,
  NEIGHBOR_OFFSETS,
  RANDOM_DENSITY,
} from "@/constants/game";

/** Helper to create an empty grid with given dimensions */
const createEmptyGrid = (rows: number, cols: number): Grid =>
  Array.from({ length: rows }, () => Array(cols).fill(0));

export const useGameOfLife = () => {
  const [grid, setGrid] = useState<Grid>(() =>
    createEmptyGrid(GRID.DEFAULT_ROWS, GRID.DEFAULT_COLS)
  );
  const [isRunning, setIsRunning] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [speed, setSpeed] = useState<number>(SPEED.DEFAULT);
  const [cellSize, setCellSize] = useState<number>(CELL_SIZE.DEFAULT);
  const [numRows, setNumRows] = useState<number>(GRID.DEFAULT_ROWS);
  const [numCols, setNumCols] = useState<number>(GRID.DEFAULT_COLS);
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  /** Run one step of the simulation */
  const runSimulation = useCallback(() => {
    setGrid((currentGrid) => {
      // Find boundaries of live cells for optimization
      let minRow = numRows;
      let maxRow = 0;
      let minCol = numCols;
      let maxCol = 0;
      let hasLiveCells = false;

      for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
          if (currentGrid[i][j]) {
            hasLiveCells = true;
            minRow = Math.min(minRow, i);
            maxRow = Math.max(maxRow, i);
            minCol = Math.min(minCol, j);
            maxCol = Math.max(maxCol, j);
          }
        }
      }

      if (!hasLiveCells) {
        setIsRunning(false);
        return currentGrid;
      }

      // Add buffer around active area
      minRow = Math.max(0, minRow - 1);
      maxRow = Math.min(numRows - 1, maxRow + 1);
      minCol = Math.max(0, minCol - 1);
      maxCol = Math.min(numCols - 1, maxCol + 1);

      // Create new grid with shallow row copies
      const newGrid = currentGrid.map((row) => [...row]);

      // Process only cells within active area
      for (let i = minRow; i <= maxRow; i++) {
        for (let j = minCol; j <= maxCol; j++) {
          let neighbors = 0;

          for (const [dx, dy] of NEIGHBOR_OFFSETS) {
            const ni = i + dx;
            const nj = j + dy;
            if (ni >= 0 && ni < numRows && nj >= 0 && nj < numCols) {
              neighbors += currentGrid[ni][nj];
            }
          }

          if (neighbors < 2 || neighbors > 3) {
            newGrid[i][j] = 0;
          } else if (currentGrid[i][j] === 0 && neighbors === 3) {
            newGrid[i][j] = 1;
          }
        }
      }

      // Check if grid has changed (stable state detection)
      let hasChanged = false;
      for (let i = minRow; i <= maxRow && !hasChanged; i++) {
        for (let j = minCol; j <= maxCol && !hasChanged; j++) {
          if (currentGrid[i][j] !== newGrid[i][j]) {
            hasChanged = true;
          }
        }
      }

      if (!hasChanged) {
        setIsRunning(false);
      } else {
        setGeneration((prev) => prev + 1);
      }

      return newGrid;
    });
  }, [numRows, numCols]);

  /** Step one generation manually */
  const stepSimulation = useCallback(() => {
    runSimulation();
  }, [runSimulation]);

  /** Clear the grid and reset state */
  const clearGrid = useCallback(() => {
    setGrid(createEmptyGrid(numRows, numCols));
    setIsRunning(false);
    setGeneration(0);
    setSelectedPattern(null);
    setActiveLabel(null);
  }, [numRows, numCols]);

  /** Generate a random grid */
  const generateRandomGrid = useCallback(() => {
    const newGrid = createEmptyGrid(numRows, numCols).map((row) =>
      row.map(() => (Math.random() > 1 - RANDOM_DENSITY ? 1 : 0))
    );
    setGrid(newGrid);
    setGeneration(0);
    setSelectedPattern(null);
    setActiveLabel("Random");
  }, [numRows, numCols]);

  /** Load a predefined pattern */
  const setPattern = useCallback(
    (patternName: string) => {
      const source = patterns[patternName];
      if (!source) return;

      const newGrid = createEmptyGrid(numRows, numCols);

      for (const [r, c] of source) {
        if (r >= 0 && r < numRows && c >= 0 && c < numCols) {
          newGrid[r][c] = 1;
        }
      }

      setGrid(newGrid);
      setIsRunning(false);
      setSelectedPattern(patternName);
      setActiveLabel(patternName);
      setGeneration(0);
    },
    [numRows, numCols]
  );

  /** Toggle a single cell (efficient single-cell update) */
  const toggleCell = useCallback(
    (i: number, j: number) => {
      if (i >= 0 && i < numRows && j >= 0 && j < numCols) {
        setGrid((prev) => {
          const newGrid = prev.map((row) => [...row]);
          newGrid[i][j] = prev[i][j] ? 0 : 1;
          return newGrid;
        });
      }
    },
    [numRows, numCols]
  );

  /** Set a cell to a specific value (efficient single-cell update) */
  const setCell = useCallback(
    (i: number, j: number, value: number) => {
      if (i >= 0 && i < numRows && j >= 0 && j < numCols) {
        setGrid((prev) => {
          // Skip update if value unchanged
          if (prev[i][j] === value) return prev;

          const newGrid = prev.map((row) => [...row]);
          newGrid[i][j] = value;
          return newGrid;
        });
      }
    },
    [numRows, numCols]
  );

  /** Handle zoom in/out */
  const handleZoom = useCallback((zoomIn: boolean) => {
    setCellSize((prev) => {
      const newSize = zoomIn ? prev + CELL_SIZE.STEP : prev - CELL_SIZE.STEP;
      return Math.max(CELL_SIZE.MIN, Math.min(CELL_SIZE.MAX, newSize));
    });
  }, []);

  /** Resize grid to fit container */
  const resizeGridToContainer = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { width, height } = container.getBoundingClientRect();
    const nextCols = Math.max(GRID.MIN_DIMENSION, Math.ceil(width / cellSize));
    const nextRows = Math.max(GRID.MIN_DIMENSION, Math.ceil(height / cellSize));

    if (nextCols === numCols && nextRows === numRows) return;

    setNumCols(nextCols);
    setNumRows(nextRows);

    setGrid((prev) => {
      const newGrid = createEmptyGrid(nextRows, nextCols);
      const copyRows = Math.min(prev.length, nextRows);
      const copyCols = Math.min(prev[0]?.length ?? 0, nextCols);

      for (let i = 0; i < copyRows; i++) {
        for (let j = 0; j < copyCols; j++) {
          newGrid[i][j] = prev[i][j];
        }
      }
      return newGrid;
    });
  }, [cellSize, numCols, numRows]);

  // Simulation loop
  useEffect(() => {
    if (isRunning) {
      const id = setInterval(runSimulation, speed);
      return () => clearInterval(id);
    }
  }, [isRunning, runSimulation, speed]);

  // Resize observer
  useEffect(() => {
    resizeGridToContainer();

    const handleResize = () => resizeGridToContainer();
    window.addEventListener("resize", handleResize);

    let observer: ResizeObserver | null = null;
    const el = containerRef.current;

    if (el && typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(resizeGridToContainer);
      observer.observe(el);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      observer?.disconnect();
    };
  }, [resizeGridToContainer]);

  return {
    grid,
    isRunning,
    setIsRunning,
    generation,
    setGeneration,
    speed,
    setSpeed,
    cellSize,
    handleZoom,
    selectedPattern,
    activeLabel,
    setPattern,
    stepSimulation,
    clearGrid,
    generateRandomGrid,
    toggleCell,
    setCell,
    containerRef,
    numRows,
    numCols,
  };
};
