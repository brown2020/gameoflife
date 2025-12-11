import React, { memo } from "react";
import { patternInfo } from "@/utils/patterns";

const DEFAULT_INFO_TEXT =
  "Explore Conway's Game of Life. Select a pattern or generate a random configuration to begin.";

interface InfoPanelProps {
  activeLabel: string | null;
}

export const InfoPanel = memo<InfoPanelProps>(({ activeLabel }) => {
  const label = activeLabel ?? "About";
  const text = activeLabel
    ? patternInfo[activeLabel] ?? DEFAULT_INFO_TEXT
    : DEFAULT_INFO_TEXT;

  return (
    <div className="mx-auto max-w-6xl px-4">
      <div className="bg-gray-800/70 border border-gray-700 p-3 rounded-md mt-4">
        <h3 className="text-white text-base font-medium mb-1">{label}</h3>
        <p className="text-gray-300 text-xs">{text}</p>
      </div>
    </div>
  );
});

InfoPanel.displayName = "InfoPanel";
