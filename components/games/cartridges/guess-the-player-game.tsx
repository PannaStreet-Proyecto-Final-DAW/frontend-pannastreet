/**
 * GuessThePlayerGame: The specific gameplay logic and UI for the "Guess the Player" game.
 * This is the "Cartridge" that plugs into the GameEngine.
 */
"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { GuessesTable } from "@/components/games/engine/guesses-table"
import { PlayerSearchInput } from "@/components/games/shared/player-search-input"
import { useNormalization } from "@/hooks/use-normalization"
import { useGameLogic } from "@/hooks/use-game-logic"
import { usePlayerSearch } from "@/hooks/use-player-search"
import { Player, Guess } from "@/types"

// --- Constants ---
const SCORE_CONFIG = {
  base: { Easy: 10, Medium: 20, Hard: 30 },
  multipliers: { Male: 1, Female: 1.5, Both: 2 },
  attempts: { Male: 10, Female: 10, Both: 15 }
} as const

// Mapping of corresponding male/female leagues for mode="Both"
const leaguePairs: Record<string, string> = {
  "la liga": "liga f",
  "liga f": "la liga",
  "premier league": "wsl",
  "wsl": "premier league",
  "ligue 1": "premiere ligue",
  "premiere ligue": "ligue 1",
  "bundesliga": "frauen bundesliga",
  "frauen bundesliga": "bundesliga",
  "serie a (m)": "serie a (f)",
  "serie a (f)": "serie a (m)",
}

interface GuessThePlayerGameProps {
  difficulty: string
  mode: string
  players: Player[]
  allPlayers: Player[]
  onGameOver: (won: boolean, targetPlayer: any, score: number) => void
  isGameOver: boolean
}

export function GuessThePlayerGame({
  difficulty,
  mode,
  players,
  allPlayers,
  onGameOver,
  isGameOver: externalIsGameOver
}: GuessThePlayerGameProps) {
  // --- STATE ---
  const [targetPlayer, setTargetPlayer] = useState<Player | null>(null) // The player to guess
  const [error, setError] = useState<string | null>(null)       // UI error messages
  const { normalize } = useNormalization()

  // --- REFEREE LOGIC ---
  // Centralized state for attempts and scoring
  const { attempts: guesses, status, score, recordAttempt, isGameOver } = useGameLogic<Guess>({
    maxAttempts: SCORE_CONFIG.attempts[mode as keyof typeof SCORE_CONFIG.attempts] || 10,
    
    scoringFormula: useCallback((currentGuesses, won) => {
      if (!won) return 0
      const maxAttempts = SCORE_CONFIG.attempts[mode as keyof typeof SCORE_CONFIG.attempts] || 10
      const basePoints = SCORE_CONFIG.base[difficulty as keyof typeof SCORE_CONFIG.base] || 10
      const multiplier = SCORE_CONFIG.multipliers[mode as keyof typeof SCORE_CONFIG.multipliers] || 1
      
      const totalPotentialScore = basePoints * multiplier
      const pointsPerFail = totalPotentialScore / maxAttempts
      
      return Math.max(0, Math.floor(totalPotentialScore - ((currentGuesses.length - 1) * pointsPerFail)))
    }, [difficulty, mode])
  })

  // --- SEARCH ENGINE (Custom Hook) ---
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
  } = usePlayerSearch<Player>({
    items: allPlayers,
    maxResults: 5,         // Short list for this game
    wrapAround: true,      // Circular navigation enabled
    filterFn: useCallback((q, items) => {
      const searchNormalized = normalize(q)
      return items
        .filter((p) => {
          const nameNormalized = normalize(p.name)
          const matchesSearch = nameNormalized.includes(searchNormalized)
          // Filter out already guessed players to avoid duplicates
          const notGuessed = !guesses.some((g) => normalize(g.name) === nameNormalized)
          return matchesSearch && notGuessed
        })
        .map(p => ({
          id: p.name,
          primaryText: p.name,
          originalData: p
        }))
    }, [guesses, normalize]),
    onSelect: (result) => makeGuess(result.primaryText)
  })

  // --- PROGRESS MONITORING ---
  const effectiveIsGameOver = externalIsGameOver || isGameOver
  useEffect(() => {
    if (status !== "playing" && targetPlayer) {
      onGameOver(status === "won", targetPlayer, score)
    }
  }, [status, score, targetPlayer, onGameOver])

  // --- INITIALIZATION ---
  // Pick target player randomly on mount
  useEffect(() => {
    if (players && players.length > 0 && !targetPlayer) {
      const randomIndex = Math.floor(Math.random() * players.length)
      setTargetPlayer(players[randomIndex])
    }
  }, [players, targetPlayer])

  /**
   * Processes a guess attempt.
   * Compares the selected player attributes against the target.
   */
  const makeGuess = (playerName: string) => {
    if (isGameOver) return

    const player = allPlayers.find((p) => p.name.toLowerCase() === playerName.toLowerCase())
    
    if (!player) {
      setError("Player not found! Please check the spelling.")
      return 
    }

    setError(null)
    if (!targetPlayer) return;
    
    // Hint calculation logic
    const isCorrectPosition = player.generalPosition === targetPlayer.generalPosition;
    const playerLeague = (player.league || "").trim().toLowerCase();
    const targetLeague = (targetPlayer.league || "").trim().toLowerCase();
    
    let leagueStatus: "correct" | "wrong" | "partial" = "wrong";
    if (playerLeague === targetLeague) {
      leagueStatus = "correct";
    } else if (mode === "Both" && leaguePairs[playerLeague] === targetLeague) {
      leagueStatus = "partial";
    }

    const hints: Guess["hints"] = {
      team: (player.team || "").trim().toLowerCase() === (targetPlayer.team || "").trim().toLowerCase() ? "correct" : "wrong",
      league: leagueStatus,
      nationality: (player.nationality || "").trim().toLowerCase() === (targetPlayer.nationality || "").trim().toLowerCase() ? "correct" : "wrong",
      position: isCorrectPosition ? "correct" : "wrong",
      age: player.age === targetPlayer.age ? "correct" : player.age > targetPlayer.age ? "lower" : "higher",
    }

    // Save the new attempt to the list
    const newGuess: Guess = { name: player.name, hints }
    const isWin = player.name === targetPlayer.name
    
    recordAttempt(newGuess, isWin)
    
    // Cleanup UI
    resetSearch()
    setError(null)
  }

  const handleSubmit = () => {
    makeGuess(query)
  }

  return (
    <>
      {/* Game Header & Search UI */}
      {!effectiveIsGameOver && (
        <Card className="border-border bg-card mb-6">
          <CardContent className="pt-6">
            <PlayerSearchInput
              value={query}
              onChange={(val) => {
                setQuery(val)
                setError(null)
              }}
              onSelect={selectResult}
              results={results}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
              resultsContainerRef={resultsContainerRef}
              onKeyDown={handleKeyDown}
              placeholder="Enter player name..."
              error={error}
              mode="floating"
              onSubmit={handleSubmit}
            />
            <p className="text-xs text-black dark:text-white mt-2 text-center font-bold uppercase tracking-wider">
              Attempts: {guesses.length}/{SCORE_CONFIG.attempts[mode as keyof typeof SCORE_CONFIG.attempts] || 10}
            </p>
          </CardContent>
        </Card>
      )}

      {/* List of Previous Guesses */}
      <GuessesTable guesses={guesses} players={allPlayers} />

      {/* Legend for the colors */}
      <div className="mt-6 flex items-center justify-center gap-4 text-xs font-medium">
        <div className="flex items-center gap-1.5 text-white">
          <span className="w-4 h-4 rounded bg-primary"></span>
          Correct
        </div>
        <div className="flex items-center gap-1.5 text-white">
          <span className="w-4 h-4 rounded bg-[#DAE0C9] dark:bg-secondary"></span>
          Incorrect
        </div>
      </div>
    </>
  )
}
