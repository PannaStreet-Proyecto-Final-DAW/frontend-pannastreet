/**
 * GuessThePlayerGame: The specific gameplay logic and UI for the "Guess the Player" game.
 * This is the "Cartridge" that plugs into the GameEngine.
 */
"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { GuessesTable, type Guess } from "@/components/games/engine/guesses-table"
import { PlayerSearchInput } from "@/components/games/shared/player-search-input"
import { useNormalization } from "@/hooks/use-normalization"
import { useGameLogic } from "@/hooks/use-game-logic"

const SCORE_CONFIG = {
  base: { Easy: 10, Medium: 20, Hard: 30 },
  multipliers: { Male: 1, Female: 1.5, Both: 2 },
  attempts: { Male: 10, Female: 10, Both: 15 }
} as const

import { Player } from "@/lib/api"

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
  // --- GAME STATES ---
  const [targetPlayer, setTargetPlayer] = useState<Player | null>(null) // The player to guess
  const [currentGuess, setCurrentGuess] = useState("")          // What the user types in the input
  const [suggestions, setSuggestions] = useState<Player[]>([]) // List of names appearing while typing
  const [error, setError] = useState<string | null>(null)       // Error message if player not found
  const { normalize } = useNormalization()

  // --- GAME LOGIC (REFEREE) ---
  /**
   * We initialize the generic useGameLogic hook with:
   * 1. maxAttempts: Based on the selected game mode.
   * 2. scoringFormula: A custom function that penalizes based on failed attempts.
   */
  const { attempts: guesses, status, score, recordAttempt, isGameOver } = useGameLogic<Guess>({
    maxAttempts: SCORE_CONFIG.attempts[mode as keyof typeof SCORE_CONFIG.attempts] || 10,
    
    /**
     * The scoring formula for "Guess the Player":
     * - Only gives points if the user won.
     * - Points = Base Points * Mode Multiplier.
     * - Penalizes based on the number of wrong guesses before the correct one.
     */
    scoringFormula: useCallback((currentGuesses, won) => {
      if (!won) return 0
      const maxAttempts = SCORE_CONFIG.attempts[mode as keyof typeof SCORE_CONFIG.attempts] || 10
      const basePoints = SCORE_CONFIG.base[difficulty as keyof typeof SCORE_CONFIG.base] || 10
      const multiplier = SCORE_CONFIG.multipliers[mode as keyof typeof SCORE_CONFIG.multipliers] || 1
      
      const totalPotentialScore = basePoints * multiplier
      const pointsPerFail = totalPotentialScore / maxAttempts
      
      // Points = Total Potential - (number of failures * penalty)
      // currentGuesses.length - 1 because the LAST guess was correct and shouldn't be penalized
      return Math.max(0, Math.floor(totalPotentialScore - ((currentGuesses.length - 1) * pointsPerFail)))
    }, [difficulty, mode])
  })

  // --- STATE SYNCHRONIZATION ---
  /**
   * This effect listens for changes in the "referee" state (status and score).
   * When the game ends (won or lost), it notifies the parent page component.
   */
  const effectiveIsGameOver = externalIsGameOver || isGameOver
  useEffect(() => {
    if (status !== "playing" && targetPlayer) {
      onGameOver(status === "won", targetPlayer, score)
    }
  }, [status, score, targetPlayer, onGameOver])

  // --- INITIALIZATION ---
  // Pick a random player once when players are available
  useEffect(() => {
    if (players && players.length > 0 && !targetPlayer) {
      const randomIndex = Math.floor(Math.random() * players.length)
      setTargetPlayer(players[randomIndex])
    }
  }, [players, targetPlayer])


  /**
   * Handles text input changes.
   * Filters the player list to show suggestions.
   */
  const handleInputChange = (value: string) => {
    setCurrentGuess(value)
    setError(null) // Clear error when user types again
    if (value.length >= 3) {
      const searchNormalized = normalize(value)
      const filtered = allPlayers.filter((p) => {
        const nameNormalized = normalize(p.name)
        const matchesSearch = nameNormalized.includes(searchNormalized)
        const notGuessed = !guesses.some((g) => normalize(g.name) === nameNormalized)
        return matchesSearch && notGuessed
      })
      setSuggestions(filtered.slice(0, 5))
    } else {
      setSuggestions([])
    }
  }

  /**
   * Processes a guess attempt.
   * Compares the selected player's attributes with the target.
   */
  const makeGuess = (playerName: string) => {
    // If the game is already over, do nothing
    if (isGameOver) return

    // Find the full data of the player the user typed/selected.
    // If the user types a name not in our PLAYERS list, 'find' returns undefined.
    const player = allPlayers.find((p) => p.name.toLowerCase() === playerName.toLowerCase())
    
    // SAFETY CHECK: If the player wasn't found, we notify the user and exit.
    if (!player) {
      setError("Player not found! Please check the spelling.")
      return 
    }

    // If player is found, we clear any previous error
    setError(null)

    // --- HINT CALCULATION ---
    // Compare each field. If it matches -> "correct", otherwise -> "wrong".
    // For Guess the Player, we only compare the generalPosition.
    if (!targetPlayer) return;
    
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
    
    setCurrentGuess("") // Clear the input
    setError(null)      // Clear error
    setSuggestions([])   // Clear the suggestions
  }

  const handleSubmit = () => {
    makeGuess(currentGuess)
  }

  return (
    <>
      {/* Guess input UI */}
      {!effectiveIsGameOver && (
        <Card className="border-border bg-card mb-6">
          <CardContent className="pt-6">
            <PlayerSearchInput
              value={currentGuess}
              onChange={handleInputChange}
              onSelect={(result) => makeGuess(result.primaryText)}
              results={suggestions.map((p) => ({
                id: p.name,
                primaryText: p.name,
                originalData: p,
              }))}
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

      {/* History table */}
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
