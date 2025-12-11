"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useGameOfLife } from "@/hooks/useGameOfLife";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { Controls } from "./Controls";
import { GridCanvas } from "./GridCanvas";
import { RulesModal } from "./RulesModal";
import { TutorialModal } from "./TutorialModal";
import { InfoPanel } from "./InfoPanel";
import { Tool } from "@/types/game";

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

  const [showTutorial, setShowTutorial] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [tool, setTool] = useState<Tool>("pointer");

  // Use functional update to avoid dependency on isRunning
  const toggleRunning = useCallback(
    () => setIsRunning((prev) => !prev),
    [setIsRunning]
  );

  // Memoize zoom callbacks to avoid creating new functions each render
  const zoomIn = useCallback(() => handleZoom(true), [handleZoom]);
  const zoomOut = useCallback(() => handleZoom(false), [handleZoom]);

  // Memoize keyboard shortcut actions object
  const keyboardActions = useMemo(
    () => ({
      toggleRunning,
      clear: clearGrid,
      random: generateRandomGrid,
      step: stepSimulation,
      zoomIn,
      zoomOut,
      isRunning,
    }),
    [
      toggleRunning,
      clearGrid,
      generateRandomGrid,
      stepSimulation,
      zoomIn,
      zoomOut,
      isRunning,
    ]
  );

  useKeyboardShortcuts(keyboardActions);

  const handleShowTutorial = useCallback(() => setShowTutorial(true), []);
  const handleCloseTutorial = useCallback(() => setShowTutorial(false), []);
  const handleToggleRules = useCallback(() => setShowRules((s) => !s), []);
  const handleCloseRules = useCallback(() => setShowRules(false), []);

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
        onShowTutorial={handleShowTutorial}
        onToggleRules={handleToggleRules}
        showRules={showRules}
        tool={tool}
        setTool={setTool}
      />

      <InfoPanel activeLabel={activeLabel} />

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
        <p className="text-gray-400 text-xs mt-2 text-center">
          Keyboard: Space (Start/Stop), C (Clear), R (Random), S (Step), +/−
          (Zoom)
        </p>
      </main>

      {showRules && <RulesModal onClose={handleCloseRules} />}
      {showTutorial && <TutorialModal onClose={handleCloseTutorial} />}
    </div>
  );
};

export default GameComponent;
