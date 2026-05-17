"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { Position, SelectedPlayer } from "@/types"

interface FootballPitchProps {
  lineup: (SelectedPlayer | null)[] // Array of 11 slots
  currentPosition: number | null // Currently active slot being edited
  onPositionClick: (id: number) => void // Handler for slot clicks
  gameComplete?: boolean
  positions?: Position[]
  highlightedPositions?: number[] // Array of slot IDs that should be highlighted/clickable
  className?: string
  showGrid?: boolean
}

// Standard 4-3-3 formation coordinates
export const DEFAULT_FORMATION: Position[] = [
  { id: 0, label: "GK", row: 4.8, col: 2 },
  { id: 1, label: "LB", row: 3.6, col: 0 },
  { id: 2, label: "CB", row: 3.9, col: 1.3 },
  { id: 3, label: "CB", row: 3.9, col: 2.7 },
  { id: 4, label: "RB", row: 3.6, col: 4 },
  { id: 5, label: "CM", row: 2.2, col: 1.3 },
  { id: 6, label: "CM", row: 2.2, col: 2 },
  { id: 7, label: "CM", row: 2.2, col: 2.7 },
  { id: 8, label: "LW", row: 0.8, col: 0 },
  { id: 9, label: "ST", row: 0.4, col: 2 },
  { id: 10, label: "RW", row: 0.8, col: 4 },
]

// Component that renders a visual football pitch with interactive player positions
export const FootballPitch = React.memo(function FootballPitch({
  lineup,
  currentPosition,
  onPositionClick,
  gameComplete = false,
  positions = DEFAULT_FORMATION,
  highlightedPositions = [],
  className,
  showGrid = false
}: FootballPitchProps) {
  return (
    <div className={cn("relative bg-gradient-to-b from-primary/20 to-primary/10 flex-1 p-2 min-h-[450px]", className)}>
      {/* Field Decorations: Lines, boxes, and center circle */}
      <div className="absolute inset-4 border-2 border-primary/30 rounded-lg">
        {/* Goal boxes */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1/6 border-2 border-t-0 border-primary/30"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-1/6 border-2 border-b-0 border-primary/30"></div>
        {/* Halfway line */}
        <div className="absolute top-1/2 left-0 right-0 border-t-2 border-primary/30"></div>
        {/* Center circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-2 border-primary/30"></div>
      </div>
      
      {/* Grid Visualizer (Debug Mode) */}
      {showGrid && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
          {/* Row Lines (0 to 5) */}
          {[0, 1, 2, 3, 4, 5].map((row) => (
            <div 
              key={`row-${row}`} 
              className="absolute w-full border-t border-white/50 flex items-start pl-1"
              style={{ top: `${(row / 5) * 90 + 5}%` }}
            >
              <span className="text-[7px] text-white font-mono bg-black/40 px-0.5 rounded">R{row}</span>
            </div>
          ))}
          {/* Column Lines (0 to 4) */}
          {[0, 1, 2, 3, 4].map((col) => (
            <div 
              key={`col-${col}`} 
              className="absolute h-full border-l border-white/50 flex items-end pb-1"
              style={{ left: `${(col / 4) * 80 + 10}%` }}
            >
              <span className="text-[7px] text-white font-mono bg-black/40 px-0.5 rounded ml-0.5">C{col}</span>
            </div>
          ))}
        </div>
      )}

      {/* Render interactive player position buttons */}
      {positions.map((pos) => {
        const player = lineup[pos.id]
        const isSelected = currentPosition === pos.id
        const isHighlighted = highlightedPositions.includes(pos.id)

        // Extract last name (surname) if player exists
        const surname = player ? player.player.trim().split(" ").pop() : ""

        return (
          <div
            key={pos.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group/pos"
            style={{
              // Position mapping: converts coordinate values to percentage-based CSS positions
              left: `${(pos.col / 4) * 80 + 10}%`,
              top: `${(pos.row / 5) * 90 + 5}%`,
            }}
          >
            <button
              onClick={() => onPositionClick(pos.id)}
              className={cn(
                "w-12 h-12 rounded-full",
                "flex flex-col items-center justify-center text-xs font-black transition-all duration-300 shadow-md",
                // Styling based on state: Occupied, Selected, Highlighted, or Empty
                player
                  ? "bg-white/90 dark:bg-card/90 border-2 border-primary shadow-lg scale-110"
                  : isSelected
                    ? "bg-primary/50 text-primary-foreground ring-2 ring-primary"
                    : isHighlighted
                      ? "bg-primary/20 text-primary ring-2 ring-primary ring-offset-2 ring-offset-background animate-pulse cursor-pointer hover:bg-primary/40"
                      : "bg-secondary/40 dark:bg-secondary/80 text-secondary-foreground cursor-default"
              )}
              disabled={!!player || gameComplete || (!isHighlighted && highlightedPositions.length > 0)}
            >
              {player ? (
                // Show club crest (larger) if slot is filled
                player.crestUrl ? (
                  <img
                    src={player.crestUrl}
                    alt={player.club}
                    className="w-9 h-9 object-contain drop-shadow-sm"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/10" />
                )
              ) : (
                // Show position label (e.g. "GK") if slot is empty
                <span className="uppercase tracking-tighter">{pos.label}</span>
              )}
            </button>

            {/* Player Name Tag (Outside the circle) */}
            {player && (
              <div className="mt-1.5 px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded border border-white/20 shadow-sm animate-in fade-in slide-in-from-top-1 duration-300">
                <span className="text-[9px] font-black uppercase text-white tracking-tighter whitespace-nowrap block">
                  {surname}
                </span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
})
