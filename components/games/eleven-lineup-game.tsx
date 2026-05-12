/**
 * ElevenLineupGame: A generic and modular football lineup game engine.
 * It manages a 4-3-3 formation where players must be selected from a unique set of categories (e.g., Clubs or Countries).
 */
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { FootballPitch, type Position, type SelectedPlayer } from "@/components/games/engine/football-pitch"
import { PlayerSearchInput } from "@/components/games/shared/player-search-input"
import { useNormalization } from "@/hooks/use-normalization"
import { useGameLogic } from "@/hooks/use-game-logic"
import { useCallback } from "react"

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
  /** Data mapping: category name -> crest URL */
  availableCrests?: Record<string, string | null>
  /** Difficulty setting (Easy, Intermediate, Hard) */
  difficulty: string
  /** Mode setting (Male, Female, Both) */
  mode: string
  /** The specific 11 positions (coordinates and labels) for the pitch */
  formation: Position[]
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
  availableCrests = {},
  difficulty,
  mode,
  formation,
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

  const { normalize } = useNormalization()

  // --- GAME LOGIC (REFEREE) ---
  /**
   * We initialize the generic useGameLogic hook for the 11 Clubs game.
   * - maxAttempts: Fixed at 11 since we need exactly 11 players for the lineup.
   * - scoringFormula: A progressive formula that calculates the score as the user adds players.
   */
  const { status, score, recordAttempt, isGameOver: hookIsGameOver } = useGameLogic<SelectedPlayer>({
    maxAttempts: 11,
    
    /**
     * Progressive Scoring Formula:
     * - Every player added to the pitch grants points.
     * - Points = (Number of Players) * (Difficulty Points) * (Mode Multiplier).
     */
    scoringFormula: useCallback((currentAttempts, won) => {
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

      return Math.floor(currentAttempts.length * basePoints * multiplier)
    }, [difficulty, mode])
  })

  // --- STATE SYNCHRONIZATION ---
  /**
   * We synchronize the hook's internal state with the parent page callbacks.
   * 1. If won: Notify parent of final score.
   * 2. While playing: Notify parent of current score for real-time progress.
   */
  useEffect(() => {
    if (status === "won") {
      onGameOver(score)
    } else if (status === "playing" && score > 0) {
      onProgressUpdate?.(score)
    }
  }, [status, score, onGameOver, onProgressUpdate])

  const effectiveIsGameOver = isGameOver || hookIsGameOver

  /** Randomized queue of clubs to use for the sequential challenge */
  const [clubQueue, setClubQueue] = useState<string[]>([])

  /** Initialize the shuffled club queue on mount or when availableGroups change */
  useEffect(() => {
    if (availableGroups.length > 0) {
      const shuffled = [...availableGroups].sort(() => Math.random() - 0.5)
      setClubQueue(shuffled)
    }
  }, [availableGroups])

  /** Dynamic count of how many players have been assigned to the pitch */
  const completedCount = lineup.filter(Boolean).length

  /** The currently active club for the challenge */
  const currentClub = clubQueue[completedCount] || null

  /** Randomized queue of clubs to use for the sequential challenge */

  // --- Derived State ---


  // --- Handlers ---

  /**
   * Evaluates and assigns a player based on available slots for their positions.
   */
  const handlePlayerSelect = (group: string, playerItem: { name: string; positions: string[] }) => {
    // 1. Enforce sequential club constraint (PRIORITY)
    if (group !== currentClub) {
      setSearchError(`You must select a player from ${currentClub}`)
      setSearchQuery("")
      setTimeout(() => setSearchError(null), 3000)
      return
    }

    // 2. Find all empty pitch positions that match ANY of the player's possible positions
    const emptySlots = formation.filter(
      (pos) => playerItem.positions.includes(pos.label) && lineup[pos.id] === null
    )

    if (emptySlots.length === 0) {
      // No empty slots available for any of their positions
      setSearchError(`No empty slots available`)
      setSearchQuery("")
      setTimeout(() => setSearchError(null), 3000)
      return
    }

    // Enforce unique category constraint (redundant with sequential but good for safety)
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
    const crestUrl = availableCrests[group] || null
    const playerAdded: SelectedPlayer = { positionId: slotId, club: group, player: playerName, crestUrl }

    const newLineup = [...lineup]
    newLineup[slotId] = playerAdded

    const nextCount = newLineup.filter(Boolean).length
    
    // Update local lineup for UI
    setLineup(newLineup)
    
    // Record attempt in the logic hook
    // Win condition for this game is reaching 11 players
    recordAttempt(playerAdded, nextCount === 11)

    setSearchQuery("")
    setSearchError(null)
    setPendingPlayer(null)
  }


  /**
   * Logic to compute which items (players) can be displayed in the search results.
   */
  const getFilteredResults = () => {
    if (searchQuery.length < 3) return []

    const usedGroups = new Set(lineup.filter(Boolean).map((l) => l!.club))
    const results: { group: string; item: { name: string; positions: string[] } }[] = []

    const searchNormalized = normalize(searchQuery)

    // Iterate over all groups (teams) available in the data, not just the selected ones
    Object.keys(itemsByGroup).forEach((group) => {
      // Don't show players from groups that are already in the lineup
      if (usedGroups.has(group)) return

      itemsByGroup[group]?.forEach((item) => {
        const itemNormalized = normalize(item.name)
        const groupNormalized = normalize(group)

        const matchesItem = itemNormalized.includes(searchNormalized)
        const matchesGroup = groupNormalized.includes(searchNormalized)

        if (matchesItem || matchesGroup) {
          results.push({ group, item })
        }
      })
    })

    return results.slice(0, 10)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_1.8fr_1fr] gap-6 items-stretch">

      {/* COLUMN 1: Current Challenge Card */}
      <Card className="border-border bg-card sticky top-6 md:h-full flex flex-col overflow-hidden">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-[11px] font-black uppercase tracking-widest text-primary/60 italic">
            Current Challenge
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 flex-1 flex flex-col items-center justify-center text-center gap-6">
          {currentClub ? (
            <>
              {/* Future Club Crest Placeholder */}
              <div className="w-32 h-32 rounded-full bg-primary/5 border-4 border-dashed border-primary/20 flex items-center justify-center overflow-hidden">
                {availableCrests[currentClub] ? (
                  <img 
                    src={availableCrests[currentClub]!} 
                    alt={currentClub} 
                    className="w-24 h-24 object-contain animate-in zoom-in-50 duration-500" 
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/20 animate-pulse" />
                )}
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Target {groupLabel.slice(0, -1)}</p>
                <h3 className="text-2xl font-black uppercase tracking-tighter text-card-foreground leading-none">
                  {currentClub}
                </h3>
              </div>

              <div className="mt-auto pt-6 border-t border-border/50 w-full">
                <p className="text-[9px] font-medium text-muted-foreground leading-relaxed">
                  Search and place any player that plays for <span className="text-primary font-bold">{currentClub}</span> to advance.
                </p>
              </div>
            </>
          ) : (
            <div className="py-12 flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-black uppercase italic tracking-tighter text-green-500">All Done!</p>
            </div>
          )}
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
          positions={formation}
          highlightedPositions={pendingPlayer ? pendingPlayer.availableSlots : []}
          gameComplete={effectiveIsGameOver || completedCount === 11}
        />
      </Card>

      {/* COLUMN 3: Selection interface and real-time progress counter */}
      <Card className="border-border bg-card h-full flex flex-col">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold text-card-foreground">
              {effectiveIsGameOver || completedCount === 11
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
                className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm transition-colors hover:bg-primary/90 duration-300 bg-primary text-primary-foreground mt-4"
              >
                Cancel Selection
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <PlayerSearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                onSelect={(result) => handlePlayerSelect(result.originalData.group, result.originalData.item)}
                results={getFilteredResults().map(({ group, item }) => ({
                  id: `${group}-${item.name}`,
                  primaryText: item.name,
                  secondaryText: (difficulty === "Intermediate" || difficulty === "Hard") ? undefined : group,
                  originalData: { group, item },
                }))}
                placeholder={`Search ${groupLabel.toLowerCase()} or player...`}
                mode="inline"
                autoFocus
              />

              {searchError && (
                <div className="animate-in fade-in slide-in-from-top-1 duration-300">
                  <p className="text-[9px] font-bold text-red-500/80 text-center uppercase tracking-wider italic">
                    {searchError}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
