"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useGameOfLife } from "@/hooks/useGameOfLife";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { Controls } from "./Controls";
import { GridCanvas } from "./GridCanvas";
import { RulesModal } from "./RulesModal";
import { TutorialModal } from "./TutorialModal";
import { InfoPanel } from "./InfoPanel";
import { Tool, ModalType } from "@/types/game";

const GameComponent: React.FC = () => {
  const {
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
    stepSimulation,
    clearGrid,
    generateRandomGrid,
    toggleCell,
    setCell,
    containerRef,
    numRows,
    numCols,
  } = useGameOfLife();

  const [tool, setTool] = useState<Tool>("pointer");
  const [activeModal, setActiveModal] = useState<ModalType>(null);

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

  // Modal handler factory - creates stable callbacks for each modal type
  const createModalHandler = useCallback(
    (modal: ModalType) => () => setActiveModal(modal),
    []
  );
  const openTutorial = useMemo(
    () => createModalHandler("tutorial"),
    [createModalHandler]
  );
  const openRules = useMemo(
    () => createModalHandler("rules"),
    [createModalHandler]
  );
  const closeModal = useMemo(
    () => createModalHandler(null),
    [createModalHandler]
  );

  return (
    <div className="min-h-screen w-screen bg-gray-900">
      <Controls
        isRunning={isRunning}
        toggleRunning={toggleRunning}
        stepSimulation={stepSimulation}
        clearGrid={clearGrid}
        generateRandomGrid={generateRandomGrid}
        selectedPattern={selectedPattern}
        onPatternChange={setPattern}
        generation={generation}
        resetGeneration={resetGeneration}
        speed={speed}
        setSpeed={setSpeed}
        cellSize={cellSize}
        zoomIn={zoomIn}
        zoomOut={zoomOut}
        onShowTutorial={openTutorial}
        onShowRules={openRules}
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

      {activeModal === "rules" && <RulesModal onClose={closeModal} />}
      {activeModal === "tutorial" && <TutorialModal onClose={closeModal} />}
    </div>
  );
};

export default GameComponent;
