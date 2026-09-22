import { useState, useEffect, useCallback, useRef } from "react";
import { patterns } from "@/utils/patterns";
import { Grid, CellState } from "@/types/game";
import {
  GRID,
  CELL_SIZE,
  SPEED,
  RANDOM_DENSITY,
} from "@/constants/game";
import {
  createEmptyGrid,
  updateCell,
  toggleCell as toggleCellUtil,
  isInBounds,
} from "@/utils/grid";
import { stepSimulation, resizeGrid } from "@/utils/simulation";

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
  const gridRef = useRef(grid);

  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  /** Run one step of the simulation (pure compute, then state writes). */
  const runSimulation = useCallback(() => {
    const result = stepSimulation(gridRef.current, numRows, numCols);
    if (result.shouldStop) {
      setIsRunning(false);
    }
    if (!result.changed) {
      return;
    }
    setGrid(result.grid);
    setGeneration((prev) => prev + 1);
  }, [numRows, numCols]);

  const clearGrid = useCallback(() => {
    setGrid(createEmptyGrid(numRows, numCols));
    setIsRunning(false);
    setGeneration(0);
    setSelectedPattern(null);
    setActiveLabel(null);
  }, [numRows, numCols]);

  const generateRandomGrid = useCallback(() => {
    const newGrid = createEmptyGrid(numRows, numCols).map((row) =>
      row.map(() => (Math.random() > 1 - RANDOM_DENSITY ? 1 : 0) as CellState)
    );
    setGrid(newGrid);
    setGeneration(0);
    setSelectedPattern(null);
    setActiveLabel("Random");
  }, [numRows, numCols]);

  const setPattern = useCallback(
    (patternName: string) => {
      const source = patterns[patternName];
      if (!source) return;

      const newGrid = createEmptyGrid(numRows, numCols);
      for (const [r, c] of source) {
        if (isInBounds(r, c, numRows, numCols)) {
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

  const toggleCell = useCallback(
    (i: number, j: number) => {
      if (isInBounds(i, j, numRows, numCols)) {
        setGrid((prev) => toggleCellUtil(prev, i, j));
      }
    },
    [numRows, numCols]
  );

  const setCell = useCallback(
    (i: number, j: number, value: CellState) => {
      if (isInBounds(i, j, numRows, numCols)) {
        setGrid((prev) => updateCell(prev, i, j, value));
      }
    },
    [numRows, numCols]
  );

  const handleZoom = useCallback((zoomIn: boolean) => {
    setCellSize((prev) => {
      const newSize = zoomIn ? prev + CELL_SIZE.STEP : prev - CELL_SIZE.STEP;
      return Math.max(CELL_SIZE.MIN, Math.min(CELL_SIZE.MAX, newSize));
    });
  }, []);

  const resetGeneration = useCallback(() => setGeneration(0), []);

  const resizeGridToContainer = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { width, height } = container.getBoundingClientRect();
    const nextCols = Math.max(GRID.MIN_DIMENSION, Math.ceil(width / cellSize));
    const nextRows = Math.max(GRID.MIN_DIMENSION, Math.ceil(height / cellSize));

    if (nextCols === numCols && nextRows === numRows) return;

    setNumCols(nextCols);
    setNumRows(nextRows);
    setGrid((prev) => resizeGrid(prev, nextRows, nextCols));
  }, [cellSize, numCols, numRows]);

  useEffect(() => {
    if (!isRunning) return;

    let lastTime = 0;
    let frameId: number;

    const animate = (time: number) => {
      if (time - lastTime >= speed) {
        runSimulation();
        lastTime = time;
      }
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isRunning, runSimulation, speed]);

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
    resetGeneration,
    speed,
    setSpeed,
    cellSize,
    handleZoom,
    selectedPattern,
    activeLabel,
    setPattern,
    stepSimulation: runSimulation,
    clearGrid,
    generateRandomGrid,
    toggleCell,
    setCell,
    containerRef,
    numRows,
    numCols,
  };
};
