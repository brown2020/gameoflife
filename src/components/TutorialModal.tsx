import React, { useState, useCallback } from "react";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";

interface TutorialModalProps {
  onClose: () => void;
}

const TUTORIAL_STEPS: readonly React.ReactNode[] = [
  <>
    <p className="mb-2">Welcome to Conway&apos;s Game of Life!</p>
    <p>
      This simulation demonstrates how complex patterns can emerge from simple
      rules.
    </p>
  </>,
  <>
    <p className="mb-2">
      The grid consists of cells that can be either alive (green) or dead
      (black).
    </p>
    <p>Click on any cell to toggle its state.</p>
  </>,
  <>
    <p className="mb-2">
      Try selecting a predefined pattern like &quot;Glider&quot; or
      &quot;Pulsar&quot;.
    </p>
    <p>These are famous patterns with interesting behaviors.</p>
  </>,
  <>
    <p className="mb-2">
      Press the &quot;Start&quot; button to begin the simulation.
    </p>
    <p>Watch how the cells evolve according to Conway&apos;s rules!</p>
  </>,
  <>
    <p className="mb-2">You&apos;re all set to explore the Game of Life!</p>
    <p>
      Check out the &quot;Rules&quot; button if you want to learn more about how
      it works.
    </p>
  </>,
];

const TOTAL_STEPS = TUTORIAL_STEPS.length;

export const TutorialModal: React.FC<TutorialModalProps> = ({ onClose }) => {
  const [step, setStep] = useState(0);

  const goBack = useCallback(() => setStep((s) => Math.max(0, s - 1)), []);
  const goNext = useCallback(
    () => setStep((s) => Math.min(TOTAL_STEPS - 1, s + 1)),
    []
  );

  const isFirstStep = step === 0;
  const isLastStep = step === TOTAL_STEPS - 1;

  return (
    <Modal title="Game of Life Tutorial" onClose={onClose}>
      <div className="text-white mb-4">{TUTORIAL_STEPS[step]}</div>

      <div className="flex justify-between items-center mt-4">
        <div>
          {!isFirstStep && (
            <Button onClick={goBack} variant="secondary">
              Previous
            </Button>
          )}
        </div>

        <span className="text-gray-400 text-xs">
          {step + 1} / {TOTAL_STEPS}
        </span>

        <div>
          {isLastStep ? (
            <Button onClick={onClose} variant="primary">
              Finish
            </Button>
          ) : (
            <Button onClick={goNext} variant="info">
              Next
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
