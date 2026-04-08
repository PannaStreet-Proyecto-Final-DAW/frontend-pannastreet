"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Sample players for the game - in production, fetch from API
const PLAYERS = [
  { name: "Messi", team: "Inter Miami", nationality: "Argentina", position: "Forward", age: 36 },
  { name: "Ronaldo", team: "Al Nassr", nationality: "Portugal", position: "Forward", age: 39 },
  { name: "Mbappe", team: "Real Madrid", nationality: "France", position: "Forward", age: 25 },
  { name: "Haaland", team: "Man City", nationality: "Norway", position: "Forward", age: 23 },
  { name: "Bellingham", team: "Real Madrid", nationality: "England", position: "Midfielder", age: 20 },
  { name: "Vinicius", team: "Real Madrid", nationality: "Brazil", position: "Forward", age: 23 },
  { name: "Salah", team: "Liverpool", nationality: "Egypt", position: "Forward", age: 31 },
  { name: "De Bruyne", team: "Man City", nationality: "Belgium", position: "Midfielder", age: 32 },
]

type Hint = "correct" | "partial" | "wrong"

interface Guess {
  name: string
  hints: {
    team: Hint
    nationality: Hint
    position: Hint
    age: "correct" | "higher" | "lower"
  }
}

export default function GuessThePlayerPage() {
  const [targetPlayer, setTargetPlayer] = useState(PLAYERS[0])
  const [guesses, setGuesses] = useState<Guess[]>([])
  const [currentGuess, setCurrentGuess] = useState("")
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [suggestions, setSuggestions] = useState<typeof PLAYERS>([])
  const [isStarted, setIsStarted] = useState(false)

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

  const getHintColor = (hint: Hint | "higher" | "lower") => {
    switch (hint) {
      case "correct":
        return "bg-primary text-primary-foreground"
      case "partial":
        return "bg-amber-500 text-white"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/games" className="text-muted-foreground hover:text-primary text-sm flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Games
        </Link>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Guess the Player</h1>
        <p className="text-foreground/80 font-medium">
          Test your football intuition by identifying the mystery player from daily clues.
        </p>
      </div>

      {!isStarted ? (
        <Card className="border-border bg-card overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row items-stretch">
              <div className="w-full md:w-1/2 aspect-video md:aspect-[4/3] bg-primary/5">
                <img
                  src="/images/games/guess-the-player.png"
                  alt="Guess the Player"
                  className="w-full h-full object-contain p-4"
                />
              </div>
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-center text-center md:text-left">
                <h2 className="text-2xl font-bold text-card-foreground mb-4">Will You Solve Today's Mystery?</h2>
                <p className="text-muted-foreground mb-6 max-w-lg mx-auto md:mx-0 leading-relaxed">
                  You have <strong>6 attempts</strong> to uncover the hidden football star of the day. After each guess, you'll receive dynamic feedback. The tiles will change color to show how close you are: <strong>Green</strong> for a match, and <strong>Grey</strong> for no match.
                </p>
                <div className="flex justify-center md:justify-start">
                  <Button onClick={() => setIsStarted(true)} size="lg" className="bg-primary text-primary-foreground font-bold px-8">
                    Start Game
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
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
                <p className="text-xs text-foreground/70 mt-2 text-center font-medium uppercase tracking-wider">
                  Attempts: {guesses.length}/6
                </p>
              </CardContent>
            </Card>
          )}

          {/* Guesses table */}
          {guesses.length > 0 && (
            <Card className="border-border bg-card mb-6">
              <CardHeader>
                <CardTitle className="text-lg text-card-foreground">Your Guesses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-xs text-muted-foreground">
                        <th className="text-left pb-2">Player</th>
                        <th className="text-center pb-2">Team</th>
                        <th className="text-center pb-2">Nation</th>
                        <th className="text-center pb-2">Position</th>
                        <th className="text-center pb-2">Age</th>
                      </tr>
                    </thead>
                    <tbody className="space-y-2">
                      {guesses.map((guess, index) => {
                        const player = PLAYERS.find((p) => p.name === guess.name)!
                        return (
                          <tr key={index} className="text-sm">
                            <td className="py-2 font-medium text-card-foreground">{guess.name}</td>
                            <td className="py-2">
                              <span className={cn("px-2 py-1 rounded text-xs", getHintColor(guess.hints.team))}>
                                {player.team}
                              </span>
                            </td>
                            <td className="py-2">
                              <span className={cn("px-2 py-1 rounded text-xs", getHintColor(guess.hints.nationality))}>
                                {player.nationality}
                              </span>
                            </td>
                            <td className="py-2">
                              <span className={cn("px-2 py-1 rounded text-xs", getHintColor(guess.hints.position))}>
                                {player.position}
                              </span>
                            </td>
                            <td className="py-2">
                              <span className={cn("px-2 py-1 rounded text-xs flex items-center justify-center gap-1", getHintColor(guess.hints.age))}>
                                {player.age}
                                {guess.hints.age === "higher" && (
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                                  </svg>
                                )}
                                {guess.hints.age === "lower" && (
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                  </svg>
                                )}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Game over */}
          {gameOver && (
            <Card className={cn("border-border", won ? "bg-primary/10" : "bg-destructive/10")}>
              <CardContent className="pt-6 text-center">
                {won ? (
                  <>
                    <h2 className="text-2xl font-bold text-primary mb-2">Congratulations!</h2>
                    <p className="text-muted-foreground">
                      You guessed <span className="text-foreground font-medium">{targetPlayer.name}</span> in {guesses.length} {guesses.length === 1 ? "try" : "tries"}!
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-destructive mb-2">Game Over</h2>
                    <p className="text-muted-foreground">
                      The player was <span className="text-foreground font-medium">{targetPlayer.name}</span>
                    </p>
                  </>
                )}
                <Button onClick={resetGame} className="mt-4 bg-primary text-primary-foreground">
                  Play Again
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Legend */}
          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <span className="w-4 h-4 rounded bg-primary"></span>
              Correct
            </div>
            <div className="flex items-center gap-1">
              <span className="w-4 h-4 rounded bg-secondary"></span>
              Wrong
            </div>
          </div>
        </>
      )}
    </div>
  )
}


