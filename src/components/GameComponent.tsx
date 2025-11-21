"use client";

import React, { useState, useEffect } from "react";
import { useGameOfLife } from "@/hooks/useGameOfLife";
import { Controls } from "./Controls";
import { GridCanvas } from "./GridCanvas";
import { RulesModal } from "./RulesModal";
import { TutorialModal } from "./TutorialModal";
import { patternInfo } from "@/utils/patterns";

const defaultInfoText =
  "Explore Conway's Game of Life. Select a pattern or generate a random configuration to begin.";

const GameComponent: React.FC = () => {
  const {
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
  } = useGameOfLife();

  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  const [showRules, setShowRules] = useState<boolean>(false);
  const [tool, setTool] = useState<"pointer" | "draw" | "eraser">("pointer");

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case " ": // Space to toggle running
          setIsRunning(!isRunning);
          break;
        case "c": // C to clear
          clearGrid();
          break;
        case "r": // R to random
          generateRandomGrid();
          break;
        case "s": // S to step
          if (!isRunning) stepSimulation();
          break;
        case "+": // + to zoom in
          handleZoom(true);
          break;
        case "-": // - to zoom out
          handleZoom(false);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isRunning,
    setIsRunning,
    stepSimulation,
    clearGrid,
    generateRandomGrid,
    handleZoom,
  ]);

  const infoLabel = activeLabel ?? "About";
  const infoText = activeLabel
    ? patternInfo[activeLabel] ?? defaultInfoText
    : defaultInfoText;

  return (
    <div className="min-h-screen w-screen bg-gray-900">
      <Controls
        isRunning={isRunning}
        setIsRunning={setIsRunning}
        stepSimulation={stepSimulation}
        clearGrid={clearGrid}
        generateRandomGrid={generateRandomGrid}
        selectedPattern={selectedPattern}
        onPatternChange={setPattern}
        generation={generation}
        setGeneration={setGeneration}
        speed={speed}
        setSpeed={setSpeed}
        cellSize={cellSize}
        handleZoom={handleZoom}
        onShowTutorial={() => setShowTutorial(true)}
        onToggleRules={() => setShowRules(!showRules)}
        showRules={showRules}
        tool={tool}
        setTool={setTool}
      />

      {/* Pattern Information Panel (always visible) */}
      <div className="mx-auto max-w-6xl px-4">
        <div className="bg-gray-800/70 border border-gray-700 p-3 rounded-md mt-4">
          <h3 className="text-white text-base font-medium mb-1">{infoLabel}</h3>
          <p className="text-gray-300 text-xs">{infoText}</p>
        </div>
      </div>

      <main className="mx-auto max-w-6xl p-4">
        <div
          ref={containerRef}
          className="overflow-hidden max-w-full max-h-[78vh] h-[78vh] border border-gray-700 rounded-md bg-gray-900"
        >
          <GridCanvas
            grid={grid}
            cellSize={cellSize}
            numRows={numRows}
            numCols={numCols}
            onToggleCell={toggleCell}
            onSetCell={setCell}
            tool={tool}
          />
        </div>
        <div className="text-gray-400 text-xs mt-2 text-center">
          Keyboard: Space (Start/Stop), C (Clear), R (Random), S (Step), +/−
          (Zoom)
        </div>
      </main>

      {/* Rules Modal */}
      {showRules && <RulesModal onClose={() => setShowRules(false)} />}

      {showTutorial && <TutorialModal onClose={() => setShowTutorial(false)} />}
    </div>
  );
};

export default GameComponent;
