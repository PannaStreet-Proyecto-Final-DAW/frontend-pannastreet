/**
 * ElevenLineupGame: A generic and modular football lineup game engine.
 * It manages a 4-3-3 formation where players must be selected from a unique set of categories (e.g., Clubs or Countries).
 */
"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { FootballPitch } from "@/components/games/engine/football-pitch"
import { PlayerSearchInput } from "@/components/games/shared/player-search-input"
import { useNormalization } from "@/hooks/use-normalization"
import { useGameLogic } from "@/hooks/use-game-logic"
import { usePlayerSearch } from "@/hooks/use-player-search"
import { Position, SelectedPlayer } from "@/types"

// Props for the ElevenLineupGame component
interface ElevenLineupGameProps {
  // The plural name of the category being used (e.g., "Clubs", "Countries")
  groupLabel: string
  // The specific 11 groups (clubs/countries) allowed for the current game session
  availableGroups: string[]
  // Data mapping: category name -> list of player names
  itemsByGroup: Record<string, { id: string; name: string; positions: string[] }[]>
  // Data mapping: category name -> crest URL
  availableCrests?: Record<string, string | null>
  // Difficulty setting (Easy, Intermediate, Hard)
  difficulty: string
  // Mode setting (Male, Female, Both)
  mode: string
  // The specific 11 positions (coordinates and labels) for the pitch
  formation: Position[]
  // Triggered when the lineup is complete (passes final score)
  onGameOver: (score: number) => void
  // Triggered whenever a player is added (passes current calculated score)
  onProgressUpdate?: (score: number) => void
  // Flag to disable all interactions once the game has ended
  isGameOver?: boolean
}

/**
 * Main game component for building an 11-player lineup based on specific constraints (clubs/countries).
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
  // --- STATE ---
  const [lineup, setLineup] = useState<(SelectedPlayer | null)[]>(Array(11).fill(null))
  const [searchError, setSearchError] = useState<string | null>(null)

  // Temporary state when a player can fit in multiple pitch positions
  const [pendingPlayer, setPendingPlayer] = useState<{
    id: string
    group: string
    name: string
    availableSlots: number[] // IDs of available slots on the pitch
    positions: string[] // The valid position labels for this player that have slots
  } | null>(null)

  const { normalize } = useNormalization()

  // --- REFEREE LOGIC (State & Progress) ---
  const { status, score, recordAttempt, isGameOver: hookIsGameOver } = useGameLogic<SelectedPlayer>({
    maxAttempts: 11,

    scoringFormula: useCallback((currentAttempts, won) => {
      const difficultyPoints: Record<string, number> = { "Easy": 1, "Intermediate": 2, "Hard": 3 }
      const modeMultipliers: Record<string, number> = { "Male": 1, "Female": 1.5, "Both": 2 }
      const basePoints = difficultyPoints[difficulty] || 1
      const multiplier = modeMultipliers[mode] || 1
      return Math.floor(currentAttempts.length * basePoints * multiplier)
    }, [difficulty, mode])
  })

  // --- SEARCH ENGINE ---
  // Pre-process items into a flat searchable array
  const searchItems = useMemo(() => {
    return Object.entries(itemsByGroup).flatMap(([group, players]) =>
      players.map(player => ({ group, item: player }))
    )
  }, [itemsByGroup])

  const {
    query,
    setQuery,
    results,
    selectedIndex,
    setSelectedIndex,
    handleKeyDown,
    resultsContainerRef,
    resetSearch,
    selectResult
  } = usePlayerSearch<{ group: string; item: { id: string; name: string; positions: string[] } }>({
    items: searchItems,
    wrapAround: false, // Standard navigation for scrollable lists
    filterFn: useCallback((q, items) => {
      const searchNormalized = normalize(q)
      const usedGroups = new Set(lineup.filter(Boolean).map((l) => l!.club))

      return items
        .filter(({ group, item }) => {
          // Rule: Cannot select multiple players from the same club/country
          if (usedGroups.has(group)) return false
          // Rule: Search matches player name only (as requested)
          return normalize(item.name).includes(searchNormalized)
        })
        .map(({ group, item }) => ({
          id: item.id,
          primaryText: item.name,
          // Only show the club name if difficulty allows it
          secondaryText: (difficulty === "Intermediate" || difficulty === "Hard") ? undefined : group,
          originalData: { group, item }
        }))
    }, [lineup, difficulty, normalize]),
    onSelect: (result) => handlePlayerSelect(result.originalData.group, result.originalData.item)
  })

  // --- PROGRESS TRACKING ---
  useEffect(() => {
    if (status === "won") {
      onGameOver(score)
    } else if (status === "playing" && score > 0) {
      onProgressUpdate?.(score)
    }
  }, [status, score, onGameOver, onProgressUpdate])

  const effectiveIsGameOver = isGameOver || hookIsGameOver

  // Shuffled sequence of clubs to challenge the user sequentially
  const [clubQueue, setClubQueue] = useState<string[]>([])
  useEffect(() => {
    if (availableGroups.length > 0) {
      const shuffled = [...availableGroups].sort(() => Math.random() - 0.5)
      setClubQueue(shuffled)
    }
  }, [availableGroups])

  // Dynamic count of how many players have been assigned to the pitch
  const completedCount = lineup.filter(Boolean).length

  // The currently active club for the challenge
  const currentClub = clubQueue[completedCount] || null

  // --- HANDLERS ---

  /**
   * Selection Logic:
   * Validates the selected player against game constraints (current club and empty slots).
   */
  const handlePlayerSelect = (group: string, playerItem: { id: string; name: string; positions: string[] }) => {
    // 1. Enforce sequential club constraint
    if (group !== currentClub) {
      setSearchError(`You must select a player from ${currentClub}`)
      resetSearch()
      setTimeout(() => setSearchError(null), 3000)
      return
    }

    // 2. Find empty pitch positions matching the player's positions
    const emptySlots = formation.filter(
      (pos) => playerItem.positions.includes(pos.label) && lineup[pos.id] === null
    )

    if (emptySlots.length === 0) {
      // No empty slots available for any of their positions
      setSearchError(`No empty slots available`)
      resetSearch()
      setTimeout(() => setSearchError(null), 3000)
      return
    }

    const availablePositionLabels = Array.from(new Set(emptySlots.map((s) => s.label)))

    if (availablePositionLabels.length === 1) {
      // Auto-insert if only one position type is valid/available
      insertPlayer(playerItem.id, group, playerItem.name, emptySlots[0].id)
    } else {
      // Prompt user to pick which position they want the player to occupy
      setPendingPlayer({
        id: playerItem.id,
        group,
        name: playerItem.name,
        availableSlots: emptySlots.map((s) => s.id),
        positions: availablePositionLabels,
      })
      resetSearch()
    }
  }

  /**
   * Final Insertion Logic:
   * Updates state and notifies the game engine.
   */
  const insertPlayer = (playerId: string, group: string, playerName: string, slotId: number) => {
    const crestUrl = availableCrests[group] || null
    const playerAdded: SelectedPlayer = { playerId, positionId: slotId, club: group, player: playerName, crestUrl }

    const newLineup = [...lineup]
    newLineup[slotId] = playerAdded
    setLineup(newLineup)

    // Check for win condition (11 players reached)
    const nextCount = newLineup.filter(Boolean).length
    recordAttempt(playerAdded, nextCount === 11)

    resetSearch()
    setSearchError(null)
    setPendingPlayer(null)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_1.8fr_1fr] gap-6 items-stretch eleven-game-layout">
      {/* COLUMN 1: The Challenge Monitor (Amarillo) */}
      <Card className="border-border bg-card sticky top-6 md:h-full flex flex-col overflow-hidden eleven-monitor-card">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-[11px] font-black uppercase tracking-widest text-primary/60 italic">
            Current Challenge
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 flex-1 flex flex-col items-center justify-center text-center gap-6 eleven-monitor-content">
          {currentClub ? (
            <>
              <div className="w-32 h-32 rounded-full bg-primary/5 border-4 border-dashed border-primary/20 flex items-center justify-center overflow-hidden">
                {availableCrests[currentClub] ? (
                  <img src={availableCrests[currentClub]!} alt={currentClub} className="w-24 h-24 object-contain animate-in zoom-in-50 duration-500" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/20 animate-pulse" />
                )}
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Target {groupLabel.slice(0, -1)}</p>
                <h3 className="text-2xl font-black uppercase tracking-tighter text-card-foreground leading-none">{currentClub}</h3>
              </div>
            </>
          ) : (
            <div className="py-12 flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
              </div>
              <p className="font-black uppercase italic tracking-tighter text-green-500">All Done!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* COLUMN 2: Pitch Visualization (Verde) */}
      <Card className="border-border bg-card overflow-hidden h-full flex flex-col eleven-pitch-card">
        <FootballPitch
          lineup={lineup}
          currentPosition={null}
          onPositionClick={(id) => {
            if (pendingPlayer && pendingPlayer.availableSlots.includes(id)) {
              insertPlayer(pendingPlayer.id, pendingPlayer.group, pendingPlayer.name, id)
            }
          }}
          positions={formation}
          highlightedPositions={pendingPlayer ? pendingPlayer.availableSlots : []}
          gameComplete={effectiveIsGameOver || completedCount === 11}
        />
      </Card>

      {/* COLUMN 3: Interaction Hub (Azul) */}
      <Card className="border-border bg-card h-full flex flex-col eleven-search-card">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold text-card-foreground">
              {effectiveIsGameOver || completedCount === 11 ? "Game Over!" : "Search Player"}
            </CardTitle>
            <div className={cn("px-2 py-0.5 rounded-full text-[10px] font-black tracking-tighter transition-all", completedCount === 11 ? "bg-green-500/20 text-green-500 animate-pulse" : "bg-primary/10 text-primary")}>
              {completedCount} / 11
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {pendingPlayer ? (
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-primary/30 rounded-xl bg-primary/5 text-center">
              <p className="text-sm font-bold mb-2">Where should <span className="text-primary text-base">{pendingPlayer.name}</span> play?</p>
              <button onClick={() => setPendingPlayer(null)} className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm transition-colors hover:bg-primary/90 duration-300 bg-primary text-primary-foreground mt-4">Cancel Selection</button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <PlayerSearchInput
                value={query}
                onChange={(val) => { setQuery(val); setSearchError(null); }}
                onSelect={selectResult}
                results={results}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
                resultsContainerRef={resultsContainerRef}
                onKeyDown={handleKeyDown}
                placeholder="Search player name..."
                mode="inline"
                autoFocus
              />
              {searchError && (
                <div className="animate-in fade-in slide-in-from-top-1 duration-300">
                  <p className="text-[9px] font-bold text-red-500/80 text-center uppercase tracking-wider italic">{searchError}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
