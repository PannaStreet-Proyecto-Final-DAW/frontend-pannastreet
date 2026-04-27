"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

import { GameLayout } from "@/components/game-layout"
import { GameIntroCard } from "@/components/game-intro-card"
import { GameResultCard } from "@/components/game-result-card"
import { FootballPitch, type SelectedPlayer } from "@/components/football-pitch"

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

export default function ElevenClubsPage() {
  const [selectedClubs, setSelectedClubs] = useState<string[]>([])
  const [lineup, setLineup] = useState<(SelectedPlayer | null)[]>(Array(11).fill(null))
  const [currentPosition, setCurrentPosition] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [gameComplete, setGameComplete] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [difficulty, setDifficulty] = useState("Easy")
  const [mode, setMode] = useState("Both")

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
    <GameLayout
      backHref="/games"
      backText="Back to Games"
      showSurrender={isPlaying && !gameComplete}
      onSurrender={() => console.log("Surrender")}
    >
      {!isPlaying ? (
        <GameIntroCard
          gameId="11clubs"
          title={
            <>
              <span className="text-primary">FOOTBALL 11</span> <span className="text-black dark:text-white tracking-normal">CLUBS</span>
            </>
          }
          image="/images/games/11clubs.png"
          description={
            <>
              <p className="mb-2">Football 11 is a daily football game where you have to add players from 11 different clubs in one lineup.</p>
              <ul className="list-disc list-inside space-y-0 opacity-80 decoration-primary/50">
                <li>Clubs appear in random order, and you must add a player from each club.</li>
                <li>Complete the full lineup to win.</li>
                <li>Choose between 3 difficulty levels that get progressively harder.</li>
                <li>Play in Men's, Women's, or Both mode.</li>
                <li>Earn double points by playing in Both mode!</li>
                <li>You can give up by clicking the Red Card button.</li>
              </ul>
            </>
          }
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          mode={mode}
          setMode={setMode}
          onStart={startGame}
        />
      ) : (
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
            <FootballPitch
              lineup={lineup}
              currentPosition={currentPosition}
              onPositionClick={handlePositionClick}
              gameComplete={gameComplete}
            />
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
                <GameResultCard
                  title="¡Well done!"
                  subtitle="Lineup complete"
                  thanksMessage="Thanks for playing!"
                  noCard={true}
                  className="py-4"
                />
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
      )}
    </GameLayout>
  )
}

