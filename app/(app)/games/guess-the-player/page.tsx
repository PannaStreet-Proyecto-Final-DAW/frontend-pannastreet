"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { GuessesTable, type Guess } from "@/components/guesses-table"
import { GameLayout } from "@/components/game-layout"
import { GameIntroCard } from "@/components/game-intro-card"
import { GameResultCard } from "@/components/game-result-card"

// Sample players for the game - in production, fetch from API
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


export default function GuessThePlayerPage() {
  const [targetPlayer, setTargetPlayer] = useState(PLAYERS[0])
  const [guesses, setGuesses] = useState<Guess[]>([])
  const [currentGuess, setCurrentGuess] = useState("")
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [suggestions, setSuggestions] = useState<typeof PLAYERS>([])
  const [isStarted, setIsStarted] = useState(false)
  const [difficulty, setDifficulty] = useState("Easy")
  const [mode, setMode] = useState("Both")

  useEffect(() => {
    // Pick a random player for today (in production, use a seed based on date)
    const randomIndex = Math.floor(Math.random() * PLAYERS.length)
    setTargetPlayer(PLAYERS[randomIndex])
  }, [])

  const handleInputChange = (value: string) => {
    setCurrentGuess(value)
    if (value.length > 0) {
      const filtered = PLAYERS.filter(
        (p) =>
          p.name.toLowerCase().includes(value.toLowerCase()) &&
          !guesses.some((g) => g.name.toLowerCase() === p.name.toLowerCase())
      )
      setSuggestions(filtered.slice(0, 5))
    } else {
      setSuggestions([])
    }
  }

  const makeGuess = (playerName: string) => {
    const player = PLAYERS.find((p) => p.name.toLowerCase() === playerName.toLowerCase())
    if (!player) return

    const hints: Guess["hints"] = {
      team: player.team === targetPlayer.team ? "correct" : "wrong",
      league: player.league === targetPlayer.league ? "correct" : "wrong",
      nationality: player.nationality === targetPlayer.nationality ? "correct" : "wrong",
      position: player.position === targetPlayer.position ? "correct" : "wrong",
      age: player.age === targetPlayer.age ? "correct" : player.age > targetPlayer.age ? "lower" : "higher",
    }

    const newGuess: Guess = { name: player.name, hints }
    const newGuesses = [...guesses, newGuess]
    setGuesses(newGuesses)
    setCurrentGuess("")
    setSuggestions([])

    if (player.name === targetPlayer.name) {
      setWon(true)
      setGameOver(true)
    } else if (newGuesses.length >= 6) {
      setGameOver(true)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    makeGuess(currentGuess)
  }

  const resetGame = () => {
    const randomIndex = Math.floor(Math.random() * PLAYERS.length)
    setTargetPlayer(PLAYERS[randomIndex])
    setGuesses([])
    setCurrentGuess("")
    setGameOver(false)
    setWon(false)
    setIsStarted(false)
  }


  return (
    <GameLayout
      backHref="/games"
      backText="Back to Games"
      showSurrender={isStarted && !gameOver}
      onSurrender={() => console.log("Surrender")}
    >
      {!isStarted ? (
        <GameIntroCard
          gameId="guess-the-player"
          title={
            <>
              <span className="text-primary">GUESS THE</span> <span className="text-black dark:text-white tracking-normal">PLAYER</span>
            </>
          }
          image="/images/games/guess-the-player.png"
          description={
            <>
              <p className="mb-2">Guess the Player is a daily football game where you have 6 attempts to uncover the hidden football star.</p>
              <ul className="list-disc list-inside space-y-0 opacity-80 decoration-primary/50">
                <li>After each guess, you'll receive dynamic feedback.</li>
                <li>The tiles will change color to show how close you are.</li>
                <li>Green for a match, and Grey for no match.</li>
                <li>Select from 3 difficulty levels that increase in challenge.</li>
                <li>Play in Men's, Women's, or Both categories.</li>
                <li>Double your points by choosing the Both mode!</li>
                <li>You can give up by clicking the Red Card button.</li>
              </ul>
            </>
          }
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          mode={mode}
          setMode={setMode}
          onStart={() => setIsStarted(true)}
        />
      ) : (
        <>
          {/* Guess input */}
          {!gameOver && (
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
                  Attempts: {guesses.length}/6
                </p>
              </CardContent>
            </Card>
          )}

          {/* Guesses table */}
          <GuessesTable guesses={guesses} players={PLAYERS} />

          {/* Game over */}
          {gameOver && (
            <GameResultCard
              className={cn(won ? "bg-primary/10" : "bg-destructive/10")}
              title={won ? "¡Congratulations!" : "Game Over"}
              thanksMessage="¡Thanks for playing! See you tomorrow"
            >
              <p className="text-foreground/80 font-medium">
                {won ? (
                  <>
                    You have guessed <span className="font-bold">{targetPlayer.name}</span> in {guesses.length} {guesses.length === 1 ? "guess" : "guesses"}.
                  </>
                ) : (
                  <>
                    The player was <span className="font-bold">{targetPlayer.name}</span>.
                  </>
                )}
              </p>
            </GameResultCard>
          )}

          {/* Legend */}
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
      )}
    </GameLayout>
  )
}


