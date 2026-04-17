"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { SurrenderButton } from "@/components/surrender-button"

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
  const [difficulty, setDifficulty] = useState("Intermediate")
  const [mode, setMode] = useState("Male")

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
    <div className="max-w-5xl mx-auto">
      <div className="relative flex flex-col items-center justify-center mb-6">
        <div className="absolute left-0 top-0">
          <Link href="/games" className="text-white hover:text-primary text-sm flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Games
          </Link>
        </div>
        <div className="text-center pt-6 md:pt-0">
          <h1 className="text-xl font-bold text-foreground">Guess the Player</h1>
          <p className="text-xs text-white/80 font-medium">
            Test your football intuition by identifying the mystery player from daily clues.
          </p>
        </div>
        {isStarted && !gameOver && (
          <div className="absolute right-0 top-0">
            <SurrenderButton onClick={() => console.log("Surrender")} />
          </div>
        )}
      </div>

      {!isStarted ? (
        <Card className="border-border bg-card overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row items-stretch md:items-center">
              <div className="w-full md:w-1/3 aspect-video md:aspect-auto relative flex items-center justify-center p-4 md:p-8 bg-muted/5">
                <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-game-1 to-transparent" />
                <img
                  src="/images/games/guess-the-player.png"
                  alt="Guess the Player"
                  className="relative z-10 max-h-full max-w-full object-contain rounded-2xl shadow-2xl"
                />
              </div>
              <div className="p-4 md:p-6 flex-1 flex flex-col justify-center text-center md:text-left">
                <h2 className="text-3xl font-black italic mb-2 tracking-tighter uppercase">
                  <span className="text-primary">GUESS THE</span> <span className="text-black dark:text-white tracking-normal">PLAYER</span>
                </h2>

                <div className="flex flex-col gap-4">
                  <div className="text-[13px] text-black dark:text-white/90 font-medium leading-tight space-y-0.5 text-pretty">
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
                  </div>

                  <div className="flex flex-col md:flex-row gap-8 items-center bg-muted/5 p-4 rounded-2xl border border-border/50 backdrop-blur-sm">
                    <div className="flex flex-col gap-4 flex-1 w-full">
                      <div>
                        <p className="text-black dark:text-white text-[11px] font-bold mb-2 uppercase tracking-wider">Select difficulty:</p>
                        <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
                          {["Easy", "Intermediate", "Hard"].map((opt) => (
                            <Button
                              key={opt}
                              variant={difficulty === opt ? "default" : "secondary"}
                              onClick={() => setDifficulty(opt)}
                              className={cn(
                                "rounded-full px-4 h-7 text-[11px] transition-all duration-300",
                                difficulty === opt ? "bg-primary text-primary-foreground shadow-sm" : "bg-primary/10 hover:bg-primary/20 text-black/70 dark:text-white/70"
                              )}
                              size="sm"
                            >
                              {opt}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-border/30">
                        <p className="text-black dark:text-white text-[11px] font-bold mb-2 uppercase tracking-wider">Select mode:</p>
                        <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
                          {["Male", "Female", "Both"].map((opt) => (
                            <Button
                              key={opt}
                              variant={mode === opt ? "default" : "secondary"}
                              onClick={() => setMode(opt)}
                              className={cn(
                                "rounded-full px-4 h-7 text-[11px] transition-all duration-300",
                                mode === opt ? "bg-primary text-primary-foreground shadow-sm" : "bg-primary/10 hover:bg-primary/20 text-black/70 dark:text-white/70"
                              )}
                              size="sm"
                            >
                              {opt}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:w-auto flex items-center justify-center md:pr-4">
                      <Button 
                        onClick={() => setIsStarted(true)} 
                        className="w-full md:w-[180px] bg-primary text-primary-foreground font-black py-4 rounded-xl text-xs hover:scale-[1.05] transition-transform shadow-lg h-auto uppercase tracking-[0.2em]"
                      >
                        Start Game
                      </Button>
                    </div>
                  </div>
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
                <p className="text-xs text-black dark:text-white mt-2 text-center font-bold uppercase tracking-wider">
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
                      <tr className="text-xs text-black/80 dark:text-white font-bold uppercase tracking-wider">
                        <th className="text-left pb-2">Player</th>
                        <th className="text-center pb-2">Team</th>
                        <th className="text-center pb-2">Nationality</th>
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
              <CardContent className="py-2 text-center">
                {won ? (
                  <>
                    <h2 className="text-2xl font-bold text-primary">¡Congratulations!</h2>
                    <p className="text-foreground/80 font-medium">
                      You have guessed <span className="font-bold">{targetPlayer.name}</span> in {guesses.length} {guesses.length === 1 ? "guess" : "guesses"}.
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-destructive">Game Over</h2>
                    <p className="text-foreground/80 font-medium">
                      The player was <span className="font-bold">{targetPlayer.name}</span>.
                    </p>
                  </>
                )}

                <div className="mt-2 pt-2 border-t border-border/50 max-w-xs mx-auto">
                  <p className="text-primary font-bold">¡Thanks for playing! See you tomorrow</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Legend */}
          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-white font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-primary"></span>
              Correct
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-secondary"></span>
              Incorrect
            </div>
          </div>
        </>
      )}
    </div>
  )
}


