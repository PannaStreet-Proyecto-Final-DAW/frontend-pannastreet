/**
 * GuessThePlayerGame: The specific gameplay logic and UI for the "Guess the Player" game.
 * This is the "Cartridge" that plugs into the GameEngine.
 */
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { GuessesTable, type Guess } from "@/components/guesses-table"

const SCORE_CONFIG = {
  base: { Easy: 10, Medium: 20, Hard: 30 },
  multipliers: { Male: 1, Female: 1.5, Both: 2 },
  attempts: { Male: 10, Female: 10, Both: 15 }
} as const

// Sample players for the game - in production, fetch from cache or API
const PLAYERS = [
  { name: "Messi", team: "Inter Miami", league: "MLS", nationality: "Argentina", position: "Forward", age: 36 },
  { name: "Ronaldo", team: "Al Nassr", league: "Saudi Pro League", nationality: "Portugal", position: "Forward", age: 39 },
  { name: "Mbappe", team: "Real Madrid", league: "La Liga", nationality: "France", position: "Forward", age: 25 },
  { name: "Haaland", team: "Man City", league: "Premier League", nationality: "Norway", position: "Forward", age: 23 },
  { name: "Bellingham", team: "Real Madrid", league: "La Liga", nationality: "England", position: "Midfielder", age: 20 },
  { name: "Vinicius", team: "Real Madrid", league: "La Liga", nationality: "Brazil", position: "Forward", age: 23 },
  { name: "Salah", team: "Liverpool", league: "Premier League", nationality: "Egypt", position: "Forward", age: 31 },
  { name: "De Bruyne", team: "Man City", league: "Premier League", nationality: "Belgium", position: "Midfielder", age: 32 },
]

interface GuessThePlayerGameProps {
  difficulty: string
  mode: string
  onGameOver: (won: boolean, targetPlayer: any, score: number) => void
  isGameOver: boolean
}

export function GuessThePlayerGame({
  difficulty,
  mode,
  onGameOver,
  isGameOver
}: GuessThePlayerGameProps) {
  // --- GAME STATES ---
  const [targetPlayer, setTargetPlayer] = useState(PLAYERS[0]) // The player to guess
  const [guesses, setGuesses] = useState<Guess[]>([])           // List of attempts made
  const [currentGuess, setCurrentGuess] = useState("")          // What the user types in the input
  const [suggestions, setSuggestions] = useState<typeof PLAYERS>([]) // List of names appearing while typing
  const [error, setError] = useState<string | null>(null)       // Error message if player not found

  // --- INITIALIZATION ---
  // Pick a random player when the component mounts
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * PLAYERS.length)
    setTargetPlayer(PLAYERS[randomIndex])
  }, [])

  /**
   * Handles text input changes.
   * Filters the player list to show suggestions.
   */
  const handleInputChange = (value: string) => {
    setCurrentGuess(value)
    setError(null) // Clear error when user types again
    if (value.length > 0) {
      // Search for players matching the input that have NOT been guessed yet
      const filtered = PLAYERS.filter(
        (p) =>
          p.name.toLowerCase().includes(value.toLowerCase()) &&
          !guesses.some((g) => g.name.toLowerCase() === p.name.toLowerCase())
      )
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
    const player = PLAYERS.find((p) => p.name.toLowerCase() === playerName.toLowerCase())
    
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    makeGuess(currentGuess)
  }

  return (
    <>
      {/* Guess input UI */}
      {!isGameOver && (
        <Card className="border-border bg-card mb-6">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="relative">
              <Input
                type="text"
                placeholder="Enter player name..."
                value={currentGuess}
                onChange={(e) => handleInputChange(e.target.value)}
                className="bg-input border-border"
                autoComplete="off"
              />
              {error && (
                <p className="text-destructive text-[10px] font-bold mt-1 animate-pulse">
                  {error}
                </p>
              )}
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-10 overflow-hidden">
                  {suggestions.map((player) => (
                    <button
                      key={player.name}
                      type="button"
                      onClick={() => makeGuess(player.name)}
                      className="w-full px-4 py-2 text-left text-popover-foreground hover:bg-secondary transition-colors"
                    >
                      {player.name}
                    </button>
                  ))}
                </div>
              )}
            </form>
            <p className="text-xs text-black dark:text-white mt-2 text-center font-bold uppercase tracking-wider">
              Attempts: {guesses.length}/{SCORE_CONFIG.attempts[mode as keyof typeof SCORE_CONFIG.attempts] || 10}
            </p>
          </CardContent>
        </Card>
      )}

      {/* History table */}
      <GuessesTable guesses={guesses} players={PLAYERS} />

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
