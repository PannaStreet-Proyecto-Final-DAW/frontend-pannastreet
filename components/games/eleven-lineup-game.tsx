/**
 * ElevenLineupGame: A generic and modular football lineup game engine.
 * It manages a 4-3-3 formation where players must be selected from a unique set of categories (e.g., Clubs or Countries).
 */
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { FootballPitch, type SelectedPlayer } from "@/components/football-pitch"
import { PlayerSearchInput } from "@/components/player-search-input"

/** Standard football positions labels used for the selection UI title */
const POSITIONS = ["GK", "LB", "CB", "CB", "RB", "CM", "CM", "CM", "LW", "ST", "RW"]

/**
 * Props for the ElevenLineupGame component
 */
interface ElevenLineupGameProps {
  /** The plural name of the category being used (e.g., "Clubs", "Countries") */
  groupLabel: string
  /** The specific 11 groups (clubs/countries) allowed for the current game session */
  availableGroups: string[]
  /** Data mapping: category name -> list of player names */
  itemsByGroup: Record<string, string[]>
  /** Difficulty setting (Easy, Intermediate, Hard) */
  difficulty: string
  /** Mode setting (Male, Female, Both) */
  mode: string
  /** Triggered when the lineup is complete (passes final score) */
  onGameOver: (score: number) => void
  /** Triggered whenever a player is added (passes current calculated score) */
  onProgressUpdate?: (score: number) => void
  /** Flag to disable all interactions once the game has ended */
  isGameOver?: boolean
}

/**
 * This component handles the core gameplay loop for building an 11-player lineup.
 * It enforces the rule of one player per category (club/country) and calculates scores.
 */
export function ElevenLineupGame({
  groupLabel,
  availableGroups,
  itemsByGroup,
  difficulty,
  mode,
  onGameOver,
  onProgressUpdate,
  isGameOver = false,
}: ElevenLineupGameProps) {
  // --- Internal State ---

  /** The lineup array: null means the position is empty */
  const [lineup, setLineup] = useState<(SelectedPlayer | null)[]>(Array(11).fill(null))

  /** The ID of the position currently being edited (0-10) */
  const [currentPosition, setCurrentPosition] = useState<number | null>(null)

  /** User input for filtering players in the selection list */
  const [searchQuery, setSearchQuery] = useState("")

  // --- Scoring Logic ---

  /**
   * Helper to calculate the score based on the number of players, difficulty and mode.
   */
  const calculateScore = (count: number) => {
    const difficultyPoints: Record<string, number> = {
      "Easy": 1,
      "Intermediate": 2,
      "Hard": 3
    }

    const modeMultipliers: Record<string, number> = {
      "Male": 1,
      "Female": 1.5,
      "Both": 2
    }

    const basePoints = difficultyPoints[difficulty] || 1
    const multiplier = modeMultipliers[mode] || 1

    return Math.floor(count * basePoints * multiplier)
  }

  // --- Derived State ---

  /** Dynamic count of how many players have been assigned to the pitch */
  const completedCount = lineup.filter(Boolean).length

  // --- Handlers ---

  /**
   * Activates a position for player selection. 
   */
  const handlePositionClick = (positionId: number) => {
    if (isGameOver || completedCount === 11) return
    if (lineup[positionId]) return
    setCurrentPosition(positionId)
    setSearchQuery("")
  }

  /**
   * Assigns a player and calculates the new score.
   */
  const handlePlayerSelect = (group: string, item: string) => {
    if (currentPosition === null) return

    // Enforce unique category constraint
    const groupAlreadyUsed = lineup.some((l) => l && l.club === group)
    if (groupAlreadyUsed) return

    const newLineup = [...lineup]
    newLineup[currentPosition] = { positionId: currentPosition, club: group, player: item }

    const nextCount = newLineup.filter(Boolean).length
    const currentScore = calculateScore(nextCount)

    setLineup(newLineup)
    setCurrentPosition(null)
    setSearchQuery("")

    // Notify parent of the new score
    onProgressUpdate?.(currentScore)

    // Trigger game over if the final slot (11th) is filled
    if (nextCount === 11) {
      onGameOver(currentScore)
    }
  }

  /**
   * Logic to compute which items (players) can be displayed in the search results.
   * Excludes groups already present in the current lineup.
   */
  const getFilteredResults = () => {
    if (searchQuery.length < 3) return []

    const usedGroups = new Set(lineup.filter(Boolean).map((l) => l!.club))
    const results: { group: string; item: string }[] = []

    availableGroups.forEach((group) => {
      // Don't show players from groups that are already in the lineup
      if (usedGroups.has(group)) return

      itemsByGroup[group]?.forEach((item) => {
        // Search by player name or group name starting with the query
        const itemLower = item.toLowerCase()
        const groupLower = group.toLowerCase()
        const searchLower = searchQuery.toLowerCase()
        
        const matchesItem = itemLower.startsWith(searchLower) || itemLower.split(" ").some(w => w.startsWith(searchLower))
        const matchesGroup = groupLower.startsWith(searchLower) || groupLower.split(" ").some(w => w.startsWith(searchLower))

        if (searchQuery === "" || matchesItem || matchesGroup) {
          results.push({ group, item })
        }
      })
    })

    return results.slice(0, 10) // UI limit for better usability
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_1.8fr_1fr] gap-6 items-stretch">

      {/* COLUMN 1: List of mandatory categories to use (Clubs/Countries) */}
      <Card className="border-border bg-card sticky top-6 md:h-full flex flex-col">
        <CardHeader className="p-3 pb-1">
          <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-card-foreground">
            {groupLabel} to Use
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="flex flex-wrap md:flex-col gap-1">
            {availableGroups.map((group) => {
              const isUsed = lineup.some((l) => l?.club === group)
              return (
                <span
                  key={group}
                  className={cn(
                    "px-2.5 py-1 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all border shadow-sm",
                    isUsed
                      ? "bg-black/5 dark:bg-white/5 border-transparent text-primary/30 dark:text-white/30 line-through"
                      : "bg-primary/5 dark:bg-secondary/40 border-primary/20 dark:border-secondary/20 text-primary dark:text-card-foreground"
                  )}
                >
                  {group}
                </span>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* COLUMN 2: Visual Football Pitch representation */}
      <Card className="border-border bg-card overflow-hidden h-full flex flex-col">
        <FootballPitch
          lineup={lineup}
          currentPosition={currentPosition}
          onPositionClick={handlePositionClick}
          gameComplete={isGameOver || completedCount === 11}
        />
      </Card>

      {/* COLUMN 3: Selection interface and real-time progress counter */}
      <Card className="border-border bg-card h-full flex flex-col">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold text-card-foreground">
              {currentPosition !== null
                ? `Select for ${POSITIONS[currentPosition]}`
                : isGameOver || completedCount === 11
                  ? "Game Over!"
                  : "Choose Position"}
            </CardTitle>

            {/* Progress Counter Badge: 0/11 -> 11/11 */}
            <div className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-black tracking-tighter transition-all",
              completedCount === 11
                ? "bg-green-500/20 text-green-500 animate-pulse"
                : "bg-primary/10 text-primary"
            )}>
              {completedCount} / 11
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0">
          {currentPosition !== null ? (
            <PlayerSearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              onSelect={(result) => handlePlayerSelect(result.originalData.group, result.originalData.item)}
              results={getFilteredResults().map(({ group, item }) => ({
                id: `${group}-${item}`,
                primaryText: item,
                originalData: { group, item },
              }))}
              placeholder={`Search ${groupLabel.toLowerCase()} or player...`}
              mode="inline"
              autoFocus
            />
          ) : (
            /* Empty state when no position is selected */
            <div className="text-center py-10 text-muted-foreground border-2 border-dashed border-border/50 rounded-2xl">
              <p className="text-xs font-medium px-4">
                {isGameOver || completedCount === 11
                  ? "Lineup finalized. Click 'Play Again' to restart."
                  : "Click a position on the pitch to start building your lineup"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
