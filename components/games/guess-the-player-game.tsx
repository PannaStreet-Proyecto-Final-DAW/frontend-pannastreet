/**
 * GuessThePlayerGame: The specific gameplay logic and UI for the "Guess the Player" game.
 * This is the "Cartridge" that plugs into the GameEngine.
 */
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { GuessesTable, type Guess } from "@/components/guesses-table"
import { PlayerSearchInput } from "@/components/player-search-input"

const SCORE_CONFIG = {
  base: { Easy: 10, Medium: 20, Hard: 30 },
  multipliers: { Male: 1, Female: 1.5, Both: 2 },
  attempts: { Male: 10, Female: 10, Both: 15 }
} as const

interface PlayerData {
  name: string
  team: string
  league: string
  nationality: string
  position: string
  age: number
  tier: number
}

interface GuessThePlayerGameProps {
  difficulty: string
  mode: string
  players: PlayerData[]
  onGameOver: (won: boolean, targetPlayer: any, score: number) => void
  isGameOver: boolean
}

export function GuessThePlayerGame({
  difficulty,
  mode,
  players,
  onGameOver,
  isGameOver
}: GuessThePlayerGameProps) {
  // --- GAME STATES ---
  const [targetPlayer, setTargetPlayer] = useState<PlayerData>(players[0]) // The player to guess
  const [guesses, setGuesses] = useState<Guess[]>([])           // List of attempts made
  const [currentGuess, setCurrentGuess] = useState("")          // What the user types in the input
  const [suggestions, setSuggestions] = useState<PlayerData[]>([]) // List of names appearing while typing
  const [error, setError] = useState<string | null>(null)       // Error message if player not found

  // --- INITIALIZATION ---
  // Pick a random player when the component mounts or when players change
  useEffect(() => {
    if (players && players.length > 0) {
      const randomIndex = Math.floor(Math.random() * players.length)
      setTargetPlayer(players[randomIndex])
    }
  }, [players])

  /**
   * Handles text input changes.
   * Filters the player list to show suggestions.
   */
  const handleInputChange = (value: string) => {
    setCurrentGuess(value)
    setError(null) // Clear error when user types again
    if (value.length >= 3) {
      const filtered = players.filter((p) => {
        const nameLower = p.name.toLowerCase()
        const searchLower = value.toLowerCase()
        const matchesSearch = nameLower.startsWith(searchLower) || nameLower.split(" ").some(w => w.startsWith(searchLower))
        const notGuessed = !guesses.some((g) => g.name.toLowerCase() === p.name.toLowerCase())
        return matchesSearch && notGuessed
      })
      setSuggestions(filtered.slice(0, 5)) // Show a maximum of 5 suggestions
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
    const player = players.find((p) => p.name.toLowerCase() === playerName.toLowerCase())
    
    // SAFETY CHECK: If the player wasn't found, we notify the user and exit.
    if (!player) {
      setError("Player not found! Please check the spelling.")
      return 
    }

    // If player is found, we clear any previous error
    setError(null)

    // --- HINT CALCULATION ---
    // Compare each field. If it matches -> "correct", otherwise -> "wrong".
    // For age, we indicate if it's "higher" or "lower" than the target.
    const hints: Guess["hints"] = {
      team: player.team === targetPlayer.team ? "correct" : "wrong",
      league: player.league === targetPlayer.league ? "correct" : "wrong",
      nationality: player.nationality === targetPlayer.nationality ? "correct" : "wrong",
      position: player.position === targetPlayer.position ? "correct" : "wrong",
      age: player.age === targetPlayer.age ? "correct" : player.age > targetPlayer.age ? "lower" : "higher",
    }

    // Save the new attempt to the list
    const newGuess: Guess = { name: player.name, hints }
    const newGuesses = [...guesses, newGuess]
    
    setGuesses(newGuesses)
    setCurrentGuess("") // Clear the input
    setError(null)      // Clear error
    setSuggestions([])   // Clear the suggestions

    // --- SCORE CALCULATION LOGIC ---
    // 1. Get configuration based on selected difficulty and mode
    const maxAttempts = SCORE_CONFIG.attempts[mode as keyof typeof SCORE_CONFIG.attempts] || 10
    const basePoints = SCORE_CONFIG.base[difficulty as keyof typeof SCORE_CONFIG.base] || 10
    const multiplier = SCORE_CONFIG.multipliers[mode as keyof typeof SCORE_CONFIG.multipliers] || 1
    
    // 2. Calculate the total potential score and the penalty per wrong guess
    const totalPotentialScore = basePoints * multiplier
    const pointsPerFail = totalPotentialScore / maxAttempts

    // --- WIN OR LOSS CHECK ---
    if (player.name === targetPlayer.name) {
      // If the name matches, the user has won
      // Points = Total Potential - (number of wrong guesses * penalty)
      // Note: newGuesses.length - 1 is the number of failures before the correct one
      const finalScore = Math.max(0, Math.floor(totalPotentialScore - ((newGuesses.length - 1) * pointsPerFail)))
      onGameOver(true, targetPlayer, finalScore)
    } else if (newGuesses.length >= maxAttempts) {
      // If the maximum number of attempts is reached without a match, the user has lost
      onGameOver(false, targetPlayer, 0)
    }
  }

  const handleSubmit = () => {
    makeGuess(currentGuess)
  }

  return (
    <>
      {/* Guess input UI */}
      {!isGameOver && (
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
      <GuessesTable guesses={guesses} players={players} />

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
