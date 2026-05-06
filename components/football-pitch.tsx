"use client"

import { cn } from "@/lib/utils"

/**
 * Interface representing a clickable position on the pitch
 */
export interface Position {
  id: number
  label: string // e.g., "GK", "ST"
  row: number // Vertical position (0 to 5)
  col: number // Horizontal position (0 to 4)
}

/**
 * Interface for a player assigned to a position
 */
export interface SelectedPlayer {
  positionId: number
  club: string
  player: string
}

interface FootballPitchProps {
  lineup: (SelectedPlayer | null)[] // Array of 11 slots
  currentPosition: number | null // Currently active slot being edited
  onPositionClick: (id: number) => void // Handler for slot clicks
  gameComplete?: boolean
  positions?: Position[]
  highlightedPositions?: number[] // Array of slot IDs that should be highlighted/clickable
  className?: string
}

/**
 * Standard 4-3-3 formation coordinates
 */
export const DEFAULT_FORMATION: Position[] = [
  { id: 0, label: "GK", row: 4, col: 2 },
  { id: 1, label: "LB", row: 3, col: 0 },
  { id: 2, label: "CB", row: 3, col: 1.5 },
  { id: 3, label: "CB", row: 3, col: 2.5 },
  { id: 4, label: "RB", row: 3, col: 4 },
  { id: 5, label: "CM", row: 2, col: 0.5 },
  { id: 6, label: "CM", row: 2, col: 2 },
  { id: 7, label: "CM", row: 2, col: 3.5 },
  { id: 8, label: "LW", row: 1, col: 0.5 },
  { id: 9, label: "ST", row: 1, col: 2 },
  { id: 10, label: "RW", row: 1, col: 3.5 },
]

/**
 * Component that renders a visual football pitch with interactive player positions
 */
export function FootballPitch({
  lineup,
  currentPosition,
  onPositionClick,
  gameComplete = false,
  positions = DEFAULT_FORMATION,
  highlightedPositions = [],
  className
}: FootballPitchProps) {
  return (
    <div className={cn("relative bg-gradient-to-b from-primary/20 to-primary/10 flex-1 p-2 min-h-[320px]", className)}>
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

      {/* Render interactive player position buttons */}
      {positions.map((pos) => {
        const player = lineup[pos.id]
        const isSelected = currentPosition === pos.id
        const isHighlighted = highlightedPositions.includes(pos.id)

        return (
          <button
            key={pos.id}
            onClick={() => onPositionClick(pos.id)}
            className={cn(
              "absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2 rounded-full",
              "flex flex-col items-center justify-center text-xs font-medium transition-all duration-300",
              // Styling based on state: Occupied, Selected, Highlighted, or Empty
              player
                ? "bg-primary text-primary-foreground"
                : isSelected
                  ? "bg-primary/50 text-primary-foreground ring-2 ring-primary"
                  : isHighlighted
                    ? "bg-primary/20 text-primary ring-2 ring-primary ring-offset-2 ring-offset-background animate-pulse cursor-pointer hover:bg-primary/40"
                    : "bg-secondary/40 dark:bg-secondary/80 text-secondary-foreground cursor-default"
            )}
            style={{
              // Position mapping: converts coordinate values to percentage-based CSS positions
              left: `${(pos.col / 4) * 80 + 10}%`,
              top: `${(pos.row / 5) * 85 + 7.5}%`,
            }}
            disabled={!!player || gameComplete || (!isHighlighted && highlightedPositions.length > 0)}
          >
            {player ? (
              // Show player name (shortened) if slot is filled
              <>
                <span className="truncate max-w-[44px]">{player.player.split(" ")[0]}</span>
              </>
            ) : (
              // Show position label (e.g. "GK") if slot is empty
              <span>{pos.label}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
