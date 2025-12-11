import React from "react";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";

interface RulesModalProps {
  onClose: () => void;
}

const rules = [
  "Any live cell with fewer than two live neighbors dies (underpopulation)",
  "Any live cell with two or three live neighbors lives on",
  "Any live cell with more than three live neighbors dies (overpopulation)",
  "Any dead cell with exactly three live neighbors becomes a live cell (reproduction)",
];

const howToUse = [
  "Click on cells to toggle them between alive and dead",
  "Use the Start/Stop button to control the simulation",
  "Select predefined patterns to see interesting behaviors",
  "Use the Step button to advance one generation at a time",
  "Adjust the speed slider to control simulation speed",
  "Use the zoom controls to adjust the view",
  "Try the Random button to generate random patterns",
];

export const RulesModal: React.FC<RulesModalProps> = ({ onClose }) => (
  <Modal title="Conway's Game of Life Rules" onClose={onClose}>
    <div className="text-white mb-4">
      <p className="mb-2">
        Conway&apos;s Game of Life is a cellular automaton where cells live or
        die based on their neighbors:
      </p>
      <ul className="list-disc pl-5 space-y-1">
        {rules.map((rule, i) => (
          <li key={i}>{rule}</li>
        ))}
      </ul>
    </div>

    <div className="text-white mb-4">
      <h3 className="text-lg font-medium mb-2">How to Use:</h3>
      <ul className="list-disc pl-5 space-y-1">
        {howToUse.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>

    <Button onClick={onClose} variant="blue">
      Close
    </Button>
  </Modal>
);
