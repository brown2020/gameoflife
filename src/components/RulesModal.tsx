import React from "react";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { ListItems } from "./ui/ListItems";

interface RulesModalProps {
  onClose: () => void;
}

const RULES = [
  "Any live cell with fewer than two live neighbors dies (underpopulation)",
  "Any live cell with two or three live neighbors lives on",
  "Any live cell with more than three live neighbors dies (overpopulation)",
  "Any dead cell with exactly three live neighbors becomes a live cell (reproduction)",
] as const;

const HOW_TO_USE = [
  "Click on cells to toggle them between alive and dead",
  "Use the Start/Stop button to control the simulation",
  "Select predefined patterns to see interesting behaviors",
  "Use the Step button to advance one generation at a time",
  "Adjust the speed slider to control simulation speed",
  "Use the zoom controls to adjust the view",
  "Try the Random button to generate random patterns",
] as const;

export const RulesModal: React.FC<RulesModalProps> = ({ onClose }) => (
  <Modal title="Conway's Game of Life Rules" onClose={onClose}>
    <div className="text-white mb-4">
      <p className="mb-2">
        Conway&apos;s Game of Life is a cellular automaton where cells live or
        die based on their neighbors:
      </p>
      <ListItems items={RULES} />
    </div>

    <div className="text-white mb-4">
      <h3 className="text-lg font-medium mb-2">How to Use:</h3>
      <ListItems items={HOW_TO_USE} />
    </div>

    <Button onClick={onClose} variant="blue">
      Close
    </Button>
  </Modal>
);
