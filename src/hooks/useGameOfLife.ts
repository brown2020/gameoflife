import {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useRef,
} from "react";
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
  const gridRef = useRef<Grid | null>(null);

  useLayoutEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  const [isRunning, setIsRunning] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [speed, setSpeed] = useState<number>(SPEED.DEFAULT);
  const [cellSize, setCellSize] = useState<number>(CELL_SIZE.DEFAULT);
  const [numRows, setNumRows] = useState<number>(GRID.DEFAULT_ROWS);
  const [numCols, setNumCols] = useState<number>(GRID.DEFAULT_COLS);
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const commitGrid = useCallback((next: Grid) => {
    gridRef.current = next;
    setGrid(next);
  }, []);

  const runSimulation = useCallback(() => {
    const current = gridRef.current;
    if (!current) return;
    const result = stepSimulation(current, numRows, numCols);
    if (result.shouldStop) {
      setIsRunning(false);
    }
    if (!result.changed) {
      return;
    }
    commitGrid(result.grid);
    setGeneration((prev) => prev + 1);
  }, [numRows, numCols, commitGrid]);

  const clearGrid = useCallback(() => {
    commitGrid(createEmptyGrid(numRows, numCols));
    setIsRunning(false);
    setGeneration(0);
    setSelectedPattern(null);
    setActiveLabel(null);
  }, [numRows, numCols, commitGrid]);

  const generateRandomGrid = useCallback(() => {
    const newGrid = createEmptyGrid(numRows, numCols).map((row) =>
      row.map(() => (Math.random() > 1 - RANDOM_DENSITY ? 1 : 0) as CellState)
    );
    commitGrid(newGrid);
    setGeneration(0);
    setSelectedPattern(null);
    setActiveLabel("Random");
  }, [numRows, numCols, commitGrid]);

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

      commitGrid(newGrid);
      setIsRunning(false);
      setSelectedPattern(patternName);
      setActiveLabel(patternName);
      setGeneration(0);
    },
    [numRows, numCols, commitGrid]
  );

  const toggleCell = useCallback(
    (i: number, j: number) => {
      const current = gridRef.current;
      if (!current || !isInBounds(i, j, numRows, numCols)) return;
      commitGrid(toggleCellUtil(current, i, j));
    },
    [numRows, numCols, commitGrid]
  );

  const setCell = useCallback(
    (i: number, j: number, value: CellState) => {
      const current = gridRef.current;
      if (!current || !isInBounds(i, j, numRows, numCols)) return;
      commitGrid(updateCell(current, i, j, value));
    },
    [numRows, numCols, commitGrid]
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
    const current = gridRef.current;
    if (!container || !current) return;

    const { width, height } = container.getBoundingClientRect();
    const nextCols = Math.max(GRID.MIN_DIMENSION, Math.ceil(width / cellSize));
    const nextRows = Math.max(GRID.MIN_DIMENSION, Math.ceil(height / cellSize));

    if (nextCols === numCols && nextRows === numRows) return;

    setNumCols(nextCols);
    setNumRows(nextRows);
    commitGrid(resizeGrid(current, nextRows, nextCols));
  }, [cellSize, numCols, numRows, commitGrid]);

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
