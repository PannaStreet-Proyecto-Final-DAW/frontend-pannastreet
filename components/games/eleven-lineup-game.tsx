/**
 * ElevenLineupGame: A generic and modular football lineup game engine.
 * It manages a 4-3-3 formation where players must be selected from a unique set of categories (e.g., Clubs or Countries).
 */
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { FootballPitch, DEFAULT_FORMATION, type SelectedPlayer } from "@/components/football-pitch"
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
  itemsByGroup: Record<string, { name: string; positions: string[] }[]>
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

  /** User input for filtering players in the selection list */
  const [searchQuery, setSearchQuery] = useState("")

  /** Error message to display when a slot is full */
  const [searchError, setSearchError] = useState<string | null>(null)

  /** State for handling players with multiple available positions */
  const [pendingPlayer, setPendingPlayer] = useState<{
    group: string
    name: string
    availableSlots: number[] // IDs of available slots on the pitch
    positions: string[] // The valid position labels for this player that have slots
  } | null>(null)

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
   * Evaluates and assigns a player based on available slots for their positions.
   */
  const handlePlayerSelect = (group: string, playerItem: { name: string; positions: string[] }) => {
    // Find all empty pitch positions that match ANY of the player's possible positions
    const emptySlots = DEFAULT_FORMATION.filter(
      (pos) => playerItem.positions.includes(pos.label) && lineup[pos.id] === null
    )

    if (emptySlots.length === 0) {
      // No empty slots available for any of their positions
      setSearchError(`No empty slots available for positions: ${playerItem.positions.join(", ")}`)
      setTimeout(() => setSearchError(null), 3000)
      return
    }

    // Enforce unique category constraint
    const groupAlreadyUsed = lineup.some((l) => l && l.club === group)
    if (groupAlreadyUsed) return

    // Extract unique position labels that have empty slots
    const availablePositionLabels = Array.from(new Set(emptySlots.map((s) => s.label)))

    if (availablePositionLabels.length === 1) {
      // Only one position type available, so auto-insert into the first slot of that type
      insertPlayer(group, playerItem.name, emptySlots[0].id)
    } else {
      // Multiple position types available, prompt the user
      setPendingPlayer({
        group,
        name: playerItem.name,
        availableSlots: emptySlots.map((s) => s.id),
        positions: availablePositionLabels,
      })
      setSearchQuery("") // Clear search to focus on position selection
    }
  }

  /**
   * Finalizes the insertion of a player into a specific slot and updates the score.
   */
  const insertPlayer = (group: string, playerName: string, slotId: number) => {
    const newLineup = [...lineup]
    newLineup[slotId] = { positionId: slotId, club: group, player: playerName }

    const nextCount = newLineup.filter(Boolean).length
    const currentScore = calculateScore(nextCount)

    setLineup(newLineup)
    setSearchQuery("")
    setSearchError(null)
    setPendingPlayer(null)

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
    const results: { group: string; item: { name: string; positions: string[] } }[] = []

    availableGroups.forEach((group) => {
      // Don't show players from groups that are already in the lineup
      if (usedGroups.has(group)) return

      itemsByGroup[group]?.forEach((item) => {
        // Search by player name or group name starting with the query
        const itemLower = item.name.toLowerCase()
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
          currentPosition={null}
          onPositionClick={(id) => {
            if (pendingPlayer && pendingPlayer.availableSlots.includes(id)) {
              insertPlayer(pendingPlayer.group, pendingPlayer.name, id)
            }
          }}
          highlightedPositions={pendingPlayer ? pendingPlayer.availableSlots : []}
          gameComplete={isGameOver || completedCount === 11}
        />
      </Card>

      {/* COLUMN 3: Selection interface and real-time progress counter */}
      <Card className="border-border bg-card h-full flex flex-col">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold text-card-foreground">
              {isGameOver || completedCount === 11
                ? "Game Over!"
                : "Search Player"}
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
          {pendingPlayer ? (
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-primary/30 rounded-xl bg-primary/5 text-center">
              <p className="text-sm font-bold mb-2">
                Where should <span className="text-primary text-base">{pendingPlayer.name}</span> play?
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Click a highlighted position on the pitch to place them.
              </p>
              <button
                onClick={() => setPendingPlayer(null)}
                className="px-4 py-2 text-xs font-bold bg-background text-muted-foreground hover:text-foreground border rounded-lg hover:bg-muted transition-colors"
              >
                Cancel Selection
              </button>
            </div>
          ) : (
            <PlayerSearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              onSelect={(result) => handlePlayerSelect(result.originalData.group, result.originalData.item)}
              results={getFilteredResults().map(({ group, item }) => ({
                id: `${group}-${item.name}`,
                primaryText: item.name,
                originalData: { group, item },
              }))}
              placeholder={`Search ${groupLabel.toLowerCase()} or player...`}
              error={searchError}
              mode="inline"
              autoFocus
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
