import {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useRef,
} from "react";
import { patterns, placePattern } from "@/utils/patterns";
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
  fitGridDimensions,
} from "@/utils/grid";
import { stepSimulation, resizeGrid } from "@/utils/simulation";
import { clampSpeed } from "@/utils/speed";

const gridSize = (grid: Grid | null): { rows: number; cols: number } => ({
  rows: grid?.length ?? GRID.DEFAULT_ROWS,
  cols: grid?.[0]?.length ?? GRID.DEFAULT_COLS,
});

export const useGameOfLife = () => {
  const [grid, setGrid] = useState<Grid>(() =>
    createEmptyGrid(GRID.DEFAULT_ROWS, GRID.DEFAULT_COLS)
  );
  const gridRef = useRef<Grid>(grid);

  useLayoutEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  const [isRunning, setIsRunning] = useState(false);
  const isRunningRef = useRef(false);
  const [generation, setGeneration] = useState(0);
  const [speed, setSpeedState] = useState<number>(SPEED.DEFAULT);
  const speedRef = useRef<number>(SPEED.DEFAULT);
  const [cellSize, setCellSize] = useState<number>(CELL_SIZE.DEFAULT);
  const [numRows, setNumRows] = useState<number>(GRID.DEFAULT_ROWS);
  const [numCols, setNumCols] = useState<number>(GRID.DEFAULT_COLS);
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const [patternNotice, setPatternNotice] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const commitGrid = useCallback((next: Grid) => {
    gridRef.current = next;
    setGrid(next);
  }, []);

  const setRunning = useCallback(
    (next: boolean | ((prev: boolean) => boolean)) => {
      const value =
        typeof next === "function" ? next(isRunningRef.current) : next;
      isRunningRef.current = value;
      setIsRunning(value);
    },
    []
  );

  const setSpeed = useCallback((next: number) => {
    const value = clampSpeed(next);
    speedRef.current = value;
    setSpeedState(value);
  }, []);

  const runSimulation = useCallback(() => {
    const current = gridRef.current;
    if (!current) return;
    const { rows, cols } = gridSize(current);
    const result = stepSimulation(current, rows, cols);
    if (result.shouldStop) {
      isRunningRef.current = false;
      setIsRunning(false);
    }
    if (!result.changed) {
      return;
    }
    commitGrid(result.grid);
    setGeneration((prev) => prev + 1);
  }, [commitGrid]);

  const clearGrid = useCallback(() => {
    const { rows, cols } = gridSize(gridRef.current);
    commitGrid(createEmptyGrid(rows, cols));
    setRunning(false);
    setGeneration(0);
    setSelectedPattern(null);
    setActiveLabel(null);
    setPatternNotice(null);
  }, [commitGrid, setRunning]);

  const generateRandomGrid = useCallback(() => {
    const { rows, cols } = gridSize(gridRef.current);
    const newGrid = createEmptyGrid(rows, cols).map((row) =>
      row.map(() => (Math.random() > 1 - RANDOM_DENSITY ? 1 : 0) as CellState)
    );
    commitGrid(newGrid);
    setGeneration(0);
    setSelectedPattern(null);
    setActiveLabel("Random");
    setPatternNotice(null);
  }, [commitGrid]);

  const setPattern = useCallback(
    (patternName: string) => {
      const source = patterns[patternName];
      if (!source) return;

      const { rows, cols } = gridSize(gridRef.current);
      const placed = placePattern(source, rows, cols);

      commitGrid(placed.grid);
      setRunning(false);
      setSelectedPattern(patternName);
      setActiveLabel(patternName);
      setPatternNotice(
        placed.clipped > 0
          ? `${placed.clipped} cell${placed.clipped === 1 ? "" : "s"} did not fit and were clipped. Zoom out to give this pattern more room.`
          : null
      );
      setGeneration(0);
    },
    [commitGrid, setRunning]
  );

  const toggleCell = useCallback(
    (i: number, j: number) => {
      const current = gridRef.current;
      const { rows, cols } = gridSize(current);
      if (!current || !isInBounds(i, j, rows, cols)) return;
      commitGrid(toggleCellUtil(current, i, j));
    },
    [commitGrid]
  );

  const setCell = useCallback(
    (i: number, j: number, value: CellState) => {
      const current = gridRef.current;
      const { rows, cols } = gridSize(current);
      if (!current || !isInBounds(i, j, rows, cols)) return;
      commitGrid(updateCell(current, i, j, value));
    },
    [commitGrid]
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

    const { rows: nextRows, cols: nextCols } = fitGridDimensions(
      container.clientWidth,
      container.clientHeight,
      cellSize
    );
    const { rows, cols } = gridSize(current);

    if (nextCols === cols && nextRows === rows) {
      if (nextCols !== numCols) setNumCols(nextCols);
      if (nextRows !== numRows) setNumRows(nextRows);
      return;
    }

    setNumCols(nextCols);
    setNumRows(nextRows);
    commitGrid(resizeGrid(current, nextRows, nextCols));
  }, [cellSize, numCols, numRows, commitGrid]);

  useEffect(() => {
    if (!isRunning) return;

    let lastTime = 0;
    let frameId = 0;

    const animate = (time: number) => {
      if (!isRunningRef.current) return;
      if (time - lastTime >= speedRef.current) {
        runSimulation();
        lastTime = time;
      }
      if (!isRunningRef.current) return;
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isRunning, runSimulation]);

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
    setIsRunning: setRunning,
    generation,
    resetGeneration,
    speed,
    setSpeed,
    cellSize,
    handleZoom,
    selectedPattern,
    activeLabel,
    patternNotice,
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
