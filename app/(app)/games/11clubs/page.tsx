"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { SurrenderButton } from "@/components/surrender-button"

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
  const [isPlaying, setIsPlaying] = useState(false)
  const [difficulty, setDifficulty] = useState("Intermediate")
  const [mode, setMode] = useState("Male")

  useEffect(() => {
    // Shuffle and pick 11 random clubs
    const shuffled = [...CLUBS].sort(() => Math.random() - 0.5)
    setSelectedClubs(shuffled.slice(0, 11))
  }, [])



  const startGame = () => {
    setIsPlaying(true)
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


  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="relative flex flex-col items-center justify-center mb-4">
        <div className="absolute left-0 top-0">
          <Link href="/games" className="text-white hover:text-primary text-sm flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Games
          </Link>
        </div>
        <div className="h-8 md:h-10" /> {/* Spacer */}
        {isPlaying && !gameComplete && (
          <div className="absolute right-0 top-0">
            <SurrenderButton onClick={() => console.log("Surrender")} />
          </div>
        )}
      </div>

      {!isPlaying ? (
        <Card className="border-border bg-card overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row items-stretch md:items-center">
              <div className="w-full md:w-1/3 aspect-video md:aspect-auto relative flex items-center justify-center p-4 md:p-8 bg-muted/5">
                <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-game-2 to-transparent" />
                <img
                  src="/images/games/11clubs.png"
                  alt="11 Clubs"
                  className="relative z-10 max-h-full max-w-full object-contain rounded-2xl shadow-2xl"
                />
              </div>
              <div className="p-4 md:p-6 flex-1 flex flex-col justify-center text-center md:text-left">
                <h2 className="text-3xl font-black italic mb-2 tracking-tighter uppercase">
                  <span className="text-primary">FOOTBALL 11</span> <span className="text-black dark:text-white tracking-normal">CLUBS</span>
                </h2>

                <div className="flex flex-col gap-4">
                  <div className="text-[13px] text-black dark:text-white/90 font-medium leading-tight space-y-0.5 text-pretty">
                    <p className="mb-2">Football 11 is a daily football game where you have to add players from 11 different clubs in one lineup.</p>
                    <ul className="list-disc list-inside space-y-0 opacity-80 decoration-primary/50">
                      <li>Clubs appear in random order, and you must add a player from each club.</li>
                      <li>Complete the full lineup to win.</li>
                      <li>Choose between 3 difficulty levels that get progressively harder.</li>
                      <li>Play in Men's, Women's, or Both mode.</li>
                      <li>Earn double points by playing in Both mode!</li>
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
                        onClick={startGame}
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

          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.8fr_1fr] gap-6 items-stretch">
            {/* Clubs used */}
            <Card className="border-border bg-card sticky top-6 md:h-full flex flex-col">
              <CardHeader className="p-3 pb-1">
                <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-card-foreground">Clubs to Use</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="flex flex-wrap md:flex-col gap-1">
                  {selectedClubs.map((club) => {
                    const isUsed = lineup.some((l) => l?.club === club)
                    return (
                      <span
                        key={club}
                        className={cn(
                          "px-2.5 py-1 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all border shadow-sm",
                          isUsed
                            ? "bg-black/5 dark:bg-white/5 border-transparent text-primary/30 dark:text-white/30 line-through"
                            : "bg-primary/5 dark:bg-secondary/40 border-primary/20 dark:border-secondary/20 text-primary dark:text-card-foreground"
                        )}
                      >
                        {club}
                      </span>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Pitch */}
            <Card className="border-border bg-card overflow-hidden h-full flex flex-col">
              <div className="relative bg-gradient-to-b from-primary/20 to-primary/10 flex-1 p-2 min-h-[320px]">
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
                        top: `${(pos.row / 5) * 85 + 7.5}%`,
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
            <Card className="border-border bg-card h-full flex flex-col">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base text-card-foreground">
                  {currentPosition !== null
                    ? `Select for ${POSITIONS[currentPosition]}`
                    : gameComplete
                      ? "Lineup Complete!"
                      : "Choose Position"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                {gameComplete ? (
                  <div className="text-center py-4">
                    <p className="text-xl font-bold text-primary mb-1">¡Well done!</p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Lineup complete
                    </p>
                    <div className="mt-2 pt-2 border-t border-border/50">
                      <p className="text-primary text-[11px] font-bold">Thanks for playing!</p>
                    </div>
                  </div>
                ) : currentPosition !== null ? (
                  <>
                    <Input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-primary/5 dark:bg-input border-primary/20 dark:border-border h-9 text-sm mb-3 rounded-xl focus-visible:ring-primary/30 text-primary dark:text-foreground placeholder:text-primary/40 dark:placeholder:text-muted-foreground"
                      autoComplete="off"
                      autoFocus
                    />
                    <div className="space-y-1 max-h-56 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-primary/20">
                      {getAvailablePlayers().map(({ club, player }) => (
                        <button
                          key={`${club}-${player}`}
                          onClick={() => handlePlayerSelect(club, player)}
                          className={cn(
                            "w-full flex items-center justify-between p-2.5 rounded-xl transition-all duration-300 border shadow-sm group",
                            "bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 hover:border-primary/30",
                            "dark:bg-secondary/40 dark:border-secondary/20 dark:text-card-foreground dark:hover:bg-secondary/60 dark:hover:border-primary/50"
                          )}
                        >
                          <span className={cn(
                            "text-[10px] font-black uppercase tracking-widest transition-colors opacity-70 group-hover:opacity-100",
                            "dark:opacity-100 dark:group-hover:text-primary"
                          )}>
                            {player}
                          </span>
                          <span className={cn(
                            "text-[10px] font-bold transition-colors opacity-50 group-hover:opacity-100",
                            "dark:opacity-70 dark:group-hover:text-card-foreground"
                          )}>
                            {club}
                          </span>
                        </button>
                      ))}
                      {getAvailablePlayers().length === 0 && (
                        <p className="text-center text-xs text-muted-foreground py-2">No players found</p>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <p className="text-sm">Click the pitch to start</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
