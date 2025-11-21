import React, { useState } from "react";

interface TutorialModalProps {
    onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ onClose }) => {
    const [step, setStep] = useState(1);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg max-w-md">
                <h2 className="text-white text-xl mb-4">Game of Life Tutorial</h2>

                {step === 1 && (
                    <div className="text-white mb-4">
                        <p className="mb-2">Welcome to Conway&apos;s Game of Life!</p>
                        <p>
                            This simulation demonstrates how complex patterns can emerge from
                            simple rules.
                        </p>
                    </div>
                )}

                {step === 2 && (
                    <div className="text-white mb-4">
                        <p className="mb-2">
                            The grid consists of cells that can be either alive (green) or
                            dead (black).
                        </p>
                        <p>Click on any cell to toggle its state.</p>
                    </div>
                )}

                {step === 3 && (
                    <div className="text-white mb-4">
                        <p className="mb-2">
                            Try selecting a predefined pattern like &quot;Glider&quot; or
                            &quot;Pulsar&quot;.
                        </p>
                        <p>These are famous patterns with interesting behaviors.</p>
                    </div>
                )}

                {step === 4 && (
                    <div className="text-white mb-4">
                        <p className="mb-2">
                            Press the &quot;Start&quot; button to begin the simulation.
                        </p>
                        <p>Watch how the cells evolve according to Conway&apos;s rules!</p>
                    </div>
                )}

                {step === 5 && (
                    <div className="text-white mb-4">
                        <p className="mb-2">
                            You&apos;re all set to explore the Game of Life!
                        </p>
                        <p>
                            Check out the &quot;Rules&quot; button if you want to learn more
                            about how it works.
                        </p>
                    </div>
                )}

                <div className="flex justify-between mt-4">
                    {step > 1 && (
                        <button
                            onClick={() => setStep((prev) => prev - 1)}
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
                        >
                            Previous
                        </button>
                    )}

                    {step < 5 ? (
                        <button
                            onClick={() => setStep((prev) => prev + 1)}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            Finish
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
