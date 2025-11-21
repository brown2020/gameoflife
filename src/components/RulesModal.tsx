import React from "react";

interface RulesModalProps {
    onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg max-w-md">
                <h2 className="text-white text-xl mb-4">
                    Conway&apos;s Game of Life Rules
                </h2>
                <div className="text-white mb-4">
                    <p className="mb-2">
                        Conway&apos;s Game of Life is a cellular automaton where cells live
                        or die based on their neighbors:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>
                            Any live cell with fewer than two live neighbors dies
                            (underpopulation)
                        </li>
                        <li>Any live cell with two or three live neighbors lives on</li>
                        <li>
                            Any live cell with more than three live neighbors dies
                            (overpopulation)
                        </li>
                        <li>
                            Any dead cell with exactly three live neighbors becomes a live
                            cell (reproduction)
                        </li>
                    </ul>
                </div>
                <div className="text-white mb-4">
                    <h3 className="text-lg font-medium mb-2">How to Use:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Click on cells to toggle them between alive and dead</li>
                        <li>Use the Start/Stop button to control the simulation</li>
                        <li>Select predefined patterns to see interesting behaviors</li>
                        <li>Use the Step button to advance one generation at a time</li>
                        <li>Adjust the speed slider to control simulation speed</li>
                        <li>Use the zoom controls to adjust the view</li>
                        <li>Try the Random button to generate random patterns</li>
                    </ul>
                </div>
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Close
                </button>
            </div>
        </div>
    );
};
