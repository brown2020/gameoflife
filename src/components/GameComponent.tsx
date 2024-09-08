"use client";

import { patterns } from "@/utils/patterns";
import React, { useState, useEffect, useCallback, useMemo } from "react";

const numRows = 50; // Number of rows for the grid
const numCols = 50; // Number of columns for the grid

// Type for the grid: a 2D array of numbers
type Grid = number[][];

// Helper function to create an empty grid
const createEmptyGrid = (): Grid => {
  return Array.from({ length: numRows }, () => Array(numCols).fill(0));
};

const GameComponent: React.FC = () => {
  const [grid, setGrid] = useState<Grid>(() => createEmptyGrid());
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Memoize the operations array
  const operations = useMemo(
    () => [
      [0, 1],
      [0, -1],
      [1, -1],
      [-1, 1],
      [1, 1],
      [-1, -1],
      [1, 0],
      [-1, 0],
    ],
    []
  );

  // Function to handle setting a predefined pattern
  const setPattern = (patternName: string) => {
    setGrid(patterns[patternName]);
    setIsRunning(false); // Stop the simulation when a new pattern is set
  };

  // The function to run the simulation for each tick
  const runSimulation = useCallback(() => {
    setGrid((currentGrid) => {
      const newGrid = currentGrid.map((row, i) =>
        row.map((cell, j) => {
          let neighbors = 0;
          operations.forEach(([x, y]) => {
            const newI = i + x;
            const newJ = j + y;
            if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
              neighbors += currentGrid[newI][newJ];
            }
          });

          if (neighbors < 2 || neighbors > 3) return 0;
          if (cell === 0 && neighbors === 3) return 1;
          return cell;
        })
      );

      // Check if the grid has changed
      const isGridSame = newGrid.every((row, i) =>
        row.every((cell, j) => cell === currentGrid[i][j])
      );

      // If the grid hasn't changed, stop the simulation
      if (isGridSame) {
        setIsRunning(false);
      }

      return newGrid;
    });
  }, [operations]);

  // useEffect to handle starting and stopping the simulation
  useEffect(() => {
    if (isRunning) {
      const id = setInterval(runSimulation, 100);
      return () => clearInterval(id);
    }
  }, [isRunning, runSimulation]);

  // Handle clicking on a cell to toggle its state
  const handleCellClick = (i: number, j: number): void => {
    const newGrid = grid.map((row, rowIndex) =>
      row.map((cell, colIndex) =>
        rowIndex === i && colIndex === j ? (cell ? 0 : 1) : cell
      )
    );
    setGrid(newGrid);
  };

  // Handle the start/stop button click
  const toggleRunning = (): void => {
    setIsRunning(!isRunning);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-800 p-4 overflow-hidden">
      <div className="flex mb-4 space-x-2">
        {Object.keys(patterns).map((pattern) => (
          <button
            key={pattern}
            onClick={() => setPattern(pattern)}
            className="px-2 py-1 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            {pattern}
          </button>
        ))}
        <button
          onClick={toggleRunning}
          className={`px-2 py-1 text-sm font-medium text-white rounded ${
            isRunning ? "bg-red-500" : "bg-green-500"
          } hover:opacity-80`}
        >
          {isRunning ? "Stop" : "Start"}
        </button>
      </div>
      <div
        className="grid overflow-auto"
        style={{
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
          maxWidth: "100%",
          maxHeight: "80vh",
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, j) => (
            <div
              key={`${i}-${j}`}
              onClick={() => handleCellClick(i, j)}
              className={`w-[20px] h-[20px] border border-gray-700 ${
                grid[i][j] ? "bg-green-400" : "bg-black"
              }`}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default GameComponent;
