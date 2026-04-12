"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Sample data - in production, fetch from API
const CLUBS = [
  "Real Madrid", "Barcelona", "Bayern Munich", "Man City", "Liverpool",
  "PSG", "Juventus", "Inter Milan", "Chelsea", "Arsenal", "Man United"
]

const PLAYERS_BY_CLUB: Record<string, string[]> = {
  "Real Madrid": ["Bellingham", "Vinicius", "Mbappe", "Rodrygo", "Valverde"],
  "Barcelona": ["Pedri", "Gavi", "Yamal", "Raphinha", "Lewandowski"],
  "Bayern Munich": ["Sane", "Musiala", "Kane", "Kimmich", "Muller"],
  "Man City": ["Haaland", "De Bruyne", "Foden", "Rodri", "Grealish"],
  "Liverpool": ["Salah", "Nunez", "Mac Allister", "Szoboszlai", "Van Dijk"],
  "PSG": ["Dembele", "Barcola", "Asensio", "Vitinha", "Hakimi"],
  "Juventus": ["Vlahovic", "Chiesa", "Locatelli", "Yildiz", "Bremer"],
  "Inter Milan": ["Lautaro", "Thuram", "Barella", "Calhanoglu", "Bastoni"],
  "Chelsea": ["Palmer", "Mudryk", "Jackson", "Enzo", "Caicedo"],
  "Arsenal": ["Saka", "Odegaard", "Rice", "Havertz", "Martinelli"],
  "Man United": ["Rashford", "Bruno", "Hojlund", "Mainoo", "Garnacho"]
}

const POSITIONS = ["GK", "LB", "CB", "CB", "RB", "CM", "CM", "CM", "LW", "ST", "RW"]
const FORMATION_POSITIONS = [
  { id: 0, label: "GK", row: 4, col: 2 },
  { id: 1, label: "LB", row: 3, col: 0 },
  { id: 2, label: "CB", row: 3, col: 1.5 },
  { id: 3, label: "CB", row: 3, col: 2.5 },
  { id: 4, label: "RB", row: 3, col: 4 },
  { id: 5, label: "CM", row: 2, col: 0.5 },
  { id: 6, label: "CM", row: 2, col: 2 },
  { id: 7, label: "CM", row: 2, col: 3.5 },
  { id: 8, label: "LW", row: 1, col: 0.5 },
  { id: 9, label: "ST", row: 1, col: 2 },
  { id: 10, label: "RW", row: 1, col: 3.5 },
]

interface SelectedPlayer {
  positionId: number
  club: string
  player: string
}

export default function ElevenClubsPage() {
  const [selectedClubs, setSelectedClubs] = useState<string[]>([])
  const [lineup, setLineup] = useState<(SelectedPlayer | null)[]>(Array(11).fill(null))
  const [currentPosition, setCurrentPosition] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [gameComplete, setGameComplete] = useState(false)
  const [timer, setTimer] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [difficulty, setDifficulty] = useState("Intermediate")
  const [mode, setMode] = useState("Male")

  useEffect(() => {
    // Shuffle and pick 11 random clubs
    const shuffled = [...CLUBS].sort(() => Math.random() - 0.5)
    setSelectedClubs(shuffled.slice(0, 11))
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && !gameComplete) {
      interval = setInterval(() => {
        setTimer((t) => t + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, gameComplete])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const startGame = () => {
    setIsPlaying(true)
    setTimer(0)
  }

  const handlePositionClick = (positionId: number) => {
    if (!isPlaying || gameComplete) return
    if (lineup[positionId]) return // Position already filled
    setCurrentPosition(positionId)
    setSearchQuery("")
  }

  const handlePlayerSelect = (club: string, player: string) => {
    if (currentPosition === null) return

    // Check if this club is already used
    const clubAlreadyUsed = lineup.some((l) => l && l.club === club)
    if (clubAlreadyUsed) return

    const newLineup = [...lineup]
    newLineup[currentPosition] = { positionId: currentPosition, club, player }
    setLineup(newLineup)
    setCurrentPosition(null)
    setSearchQuery("")

    // Check if game is complete
    if (newLineup.filter(Boolean).length === 11) {
      setGameComplete(true)
    }
  }

  const getAvailablePlayers = () => {
    const usedClubs = new Set(lineup.filter(Boolean).map((l) => l!.club))
    const available: { club: string; player: string }[] = []

    selectedClubs.forEach((club) => {
      if (usedClubs.has(club)) return
      PLAYERS_BY_CLUB[club]?.forEach((player) => {
        if (
          searchQuery === "" ||
          player.toLowerCase().includes(searchQuery.toLowerCase()) ||
          club.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          available.push({ club, player })
        }
      })
    })

    return available.slice(0, 10)
  }

  const resetGame = () => {
    const shuffled = [...CLUBS].sort(() => Math.random() - 0.5)
    setSelectedClubs(shuffled.slice(0, 11))
    setLineup(Array(11).fill(null))
    setCurrentPosition(null)
    setSearchQuery("")
    setGameComplete(false)
    setTimer(0)
    setIsPlaying(false)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/games" className="text-white hover:text-primary text-sm flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Games
        </Link>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-1">11 Clubs</h1>
        <p className="text-sm text-white/90 font-medium">
          Build a unique starting 11 using players from eleven different football clubs.
        </p>
      </div>

      {!isPlaying ? (
        <Card className="border-border bg-card overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row items-stretch md:items-center">
              <div className="w-full md:w-[35%] aspect-video md:aspect-auto relative flex items-center justify-center p-6 bg-muted/5">
                <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-game-2 to-transparent" />
                <img
                  src="/images/games/11clubs.png"
                  alt="11 Clubs"
                  className="relative z-10 max-h-full max-w-full object-contain rounded-2xl shadow-2xl"
                />
              </div>
              <div className="p-4 md:p-6 flex-1 flex flex-col justify-center text-center md:text-left">
                <h2 className="text-xl font-black italic mb-2 tracking-tighter uppercase">
                  <span className="text-primary">FOOTBALL 11</span> <span className="text-black dark:text-white tracking-normal">CLUBS</span>
                </h2>
                <div className="text-[10px] text-black dark:text-white/90 mb-4 max-w-lg mx-auto md:mx-0 font-medium leading-relaxed space-y-1 text-pretty">
                  <p>Football 11 is a daily football game where you have to add players from 11 different clubs in one lineup.</p>
                  <ul className="list-disc list-inside space-y-0.5 opacity-80 decoration-primary/50">
                    <li>Clubs will appear in random order, and you must add a player from each club.</li>
                    <li>Complete the full lineup to win.</li>
                    <li>Choose between 3 difficulty levels that get progressively harder.</li>
                    <li>Play in Men's, Women's, or Mixed mode.</li>
                    <li>Earn double points by playing in Mixed mode!</li>
                    <li>You can give up by clicking the Red Card button.</li>
                  </ul>
                </div>

                <div className="space-y-3 mb-6">
                  <div>
                    <p className="text-black dark:text-white text-sm font-bold mb-3 uppercase tracking-wider">Select difficulty:</p>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      {["Easy", "Intermediate", "Hard"].map((opt) => (
                        <Button
                          key={opt}
                          variant={difficulty === opt ? "default" : "secondary"}
                          onClick={() => setDifficulty(opt)}
                          className={cn(
                            "rounded-full px-4 transition-all duration-300",
                            difficulty === opt ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--gold),0.3)]" : "bg-primary/10 hover:bg-primary/20 text-black/70 dark:text-white/70"
                          )}
                          size="sm"
                        >
                          {opt}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-black dark:text-white text-sm font-bold mb-3 uppercase tracking-wider">Select mode:</p>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      {["Male", "Female", "Mixed"].map((opt) => (
                        <Button
                          key={opt}
                          variant={mode === opt ? "default" : "secondary"}
                          onClick={() => setMode(opt)}
                          className={cn(
                            "rounded-full px-4 transition-all duration-300",
                            mode === opt ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--gold),0.3)]" : "bg-primary/10 hover:bg-primary/20 text-black/70 dark:text-white/70"
                          )}
                          size="sm"
                        >
                          {opt}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-center md:justify-start">
                  <Button onClick={startGame} size="md" className="bg-primary text-primary-foreground font-black px-8 rounded-xl text-base hover:scale-105 transition-transform shadow-lg">
                    Start Game
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Timer and progress */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-white font-medium">
              Players: {lineup.filter(Boolean).length}/11
            </div>
            <div className="text-lg font-mono text-foreground">{formatTime(timer)}</div>
            <Button variant="outline" size="sm" onClick={resetGame} className="border-border">
              Reset
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Pitch */}
            <Card className="border-border bg-card overflow-hidden">
              <div className="relative bg-gradient-to-b from-primary/20 to-primary/10 aspect-[3/4] p-4">
                {/* Field lines */}
                <div className="absolute inset-4 border-2 border-primary/30 rounded-lg">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1/6 border-2 border-t-0 border-primary/30"></div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-1/6 border-2 border-b-0 border-primary/30"></div>
                  <div className="absolute top-1/2 left-0 right-0 border-t-2 border-primary/30"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-2 border-primary/30"></div>
                </div>

                {/* Positions */}
                {FORMATION_POSITIONS.map((pos) => {
                  const player = lineup[pos.id]
                  const isSelected = currentPosition === pos.id
                  return (
                    <button
                      key={pos.id}
                      onClick={() => handlePositionClick(pos.id)}
                      className={cn(
                        "absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2 rounded-full",
                        "flex flex-col items-center justify-center text-xs font-medium transition-all",
                        player
                          ? "bg-primary text-primary-foreground"
                          : isSelected
                            ? "bg-primary/50 text-primary-foreground ring-2 ring-primary"
                            : "bg-secondary/80 text-secondary-foreground hover:bg-secondary",
                        !player && !gameComplete && "cursor-pointer"
                      )}
                      style={{
                        left: `${(pos.col / 4) * 80 + 10}%`,
                        top: `${(pos.row / 5) * 80 + 10}%`,
                      }}
                      disabled={!!player || gameComplete}
                    >
                      {player ? (
                        <>
                          <span className="truncate max-w-[44px]">{player.player.split(" ")[0]}</span>
                        </>
                      ) : (
                        <span>{pos.label}</span>
                      )}
                    </button>
                  )
                })}
              </div>
            </Card>

            {/* Player selection */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg text-card-foreground">
                  {currentPosition !== null
                    ? `Select player for ${POSITIONS[currentPosition]}`
                    : gameComplete
                      ? "Lineup Complete!"
                      : "Click a position"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {gameComplete ? (
                  <div className="text-center py-8">
                    <p className="text-2xl font-bold text-primary mb-2">¡Buen trabajo!</p>
                    <p className="text-muted-foreground mb-6">
                      Has completado la alineación en {formatTime(timer)}
                    </p>
                    <div className="mt-4 pt-4 border-t border-border/50 max-w-sm mx-auto">
                      <p className="text-primary font-bold">¡Gracias por jugar! Nos vemos mañana</p>
                    </div>
                  </div>
                ) : currentPosition !== null ? (
                  <>
                    <Input
                      type="text"
                      placeholder="Search players or clubs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-input border-border mb-4"
                      autoComplete="off"
                      autoFocus
                    />
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {getAvailablePlayers().map(({ club, player }) => (
                        <button
                          key={`${club}-${player}`}
                          onClick={() => handlePlayerSelect(club, player)}
                          className="w-full flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                        >
                          <span className="font-medium text-card-foreground">{player}</span>
                          <span className="text-xs text-muted-foreground">{club}</span>
                        </button>
                      ))}
                      {getAvailablePlayers().length === 0 && (
                        <p className="text-center text-muted-foreground py-4">No players found</p>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Click on a position on the pitch to add a player</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Clubs used */}
          <Card className="border-border bg-card mt-6">
            <CardHeader>
              <CardTitle className="text-sm text-card-foreground">Clubs to Use</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {selectedClubs.map((club) => {
                  const isUsed = lineup.some((l) => l?.club === club)
                  return (
                    <span
                      key={club}
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium transition-all",
                        isUsed
                          ? "bg-primary/20 text-primary line-through"
                          : "bg-secondary text-secondary-foreground"
                      )}
                    >
                      {club}
                    </span>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
