/**
 * ElevenClubsPage: The entry point for the "11 Clubs" game mode.
 * It initializes the game session with random clubs and connects the generic gameplay logic to the GameEngine.
 */
"use client"

import { useState, useEffect } from "react"
import { GameEngine } from "@/components/game-engine"
import { ElevenLineupGame } from "@/components/games/eleven-lineup-game"
import { useScoreSync } from "@/hooks/use-score-sync"
import { SyncStatusIndicator } from "@/components/sync-status-indicator"

/** Mock list of football clubs to select from */
const CLUBS = [
  "Real Madrid", "Barcelona", "Bayern Munich", "Man City", "Liverpool",
  "PSG", "Juventus", "Inter Milan", "Chelsea", "Arsenal", "Man United"
]

/** Mock mapping of clubs to their top players */
const PLAYERS_BY_CLUB: Record<string, { name: string; positions: string[] }[]> = {
  "Real Madrid": [
    { name: "Bellingham", positions: ["CM"] }, { name: "Jude Bellingham", positions: ["CM"] },
    { name: "Vinicius", positions: ["LW"] }, { name: "Vinicius Junior", positions: ["LW", "ST"] },
    { name: "Mbappe", positions: ["ST", "LW", "RW"] }, { name: "Kylian Mbappe", positions: ["ST", "LW", "RW"] },
    { name: "Rodrygo", positions: ["RW", "LW"] }, { name: "Valverde", positions: ["CM", "RW"] }
  ],
  "Barcelona": [
    { name: "Pedri", positions: ["CM"] }, { name: "Gavi", positions: ["LW"] },
    { name: "Yamal", positions: ["RW"] }, { name: "Lamine Yamal", positions: ["RW"] },
    { name: "Raphinha", positions: ["LW", "RW"] }, { name: "Lewandowski", positions: ["ST"] }, { name: "Robert Lewandowski", positions: ["ST"] }
  ],
  "Bayern Munich": [
    { name: "Sane", positions: ["LW", "RW"] }, { name: "Musiala", positions: ["CM", "LW"] },
    { name: "Kane", positions: ["ST"] }, { name: "Harry Kane", positions: ["ST"] },
    { name: "Kimmich", positions: ["CM", "RB"] }, { name: "Muller", positions: ["CM", "ST"] }, { name: "Thomas Muller", positions: ["CM", "ST"] }
  ],
  "Man City": [
    { name: "Haaland", positions: ["ST"] }, { name: "Erling Haaland", positions: ["ST"] },
    { name: "De Bruyne", positions: ["CM"] }, { name: "Kevin De Bruyne", positions: ["CM"] },
    { name: "Foden", positions: ["RW", "LW", "CM"] }, { name: "Rodri", positions: ["CM"] }, { name: "Grealish", positions: ["LW", "CM"] }
  ],
  "Liverpool": [
    { name: "Salah", positions: ["RW", "ST"] }, { name: "Mohamed Salah", positions: ["RW", "ST"] },
    { name: "Nunez", positions: ["ST", "LW"] }, { name: "Darwin Nunez", positions: ["ST", "LW"] },
    { name: "Mac Allister", positions: ["CM"] }, { name: "Szoboszlai", positions: ["CM", "RW"] }, { name: "Van Dijk", positions: ["CB"] }
  ],
  "PSG": [
    { name: "Dembele", positions: ["RW", "LW"] }, { name: "Ousmane Dembele", positions: ["RW", "LW"] },
    { name: "Barcola", positions: ["LW", "RW"] }, { name: "Asensio", positions: ["ST", "RW"] },
    { name: "Vitinha", positions: ["CM"] }, { name: "Hakimi", positions: ["RB", "RW"] }
  ],
  "Juventus": [
    { name: "Vlahovic", positions: ["ST"] }, { name: "Chiesa", positions: ["LW", "RW"] },
    { name: "Locatelli", positions: ["CM"] }, { name: "Yildiz", positions: ["ST", "LW"] }, { name: "Bremer", positions: ["CB"] }
  ],
  "Inter Milan": [
    { name: "Lautaro", positions: ["ST"] }, { name: "Lautaro Martinez", positions: ["ST"] },
    { name: "Thuram", positions: ["ST", "LW"] }, { name: "Marcus Thuram", positions: ["ST", "LW"] },
    { name: "Barella", positions: ["CM"] }, { name: "Calhanoglu", positions: ["CM"] }, { name: "Bastoni", positions: ["CB", "LB"] }
  ],
  "Chelsea": [
    { name: "Palmer", positions: ["RW", "CM"] }, { name: "Cole Palmer", positions: ["RW", "CM"] },
    { name: "Mudryk", positions: ["LW"] }, { name: "Jackson", positions: ["ST"] }, { name: "Nicolas Jackson", positions: ["ST"] },
    { name: "Enzo", positions: ["CM"] }, { name: "Enzo Fernandez", positions: ["CM"] }, { name: "Caicedo", positions: ["CM"] }
  ],
  "Arsenal": [
    { name: "Saka", positions: ["RW", "LB"] }, { name: "Bukayo Saka", positions: ["RW", "LB"] },
    { name: "Odegaard", positions: ["CM"] }, { name: "Martin Odegaard", positions: ["CM"] },
    { name: "Rice", positions: ["CM", "CB"] }, { name: "Declan Rice", positions: ["CM", "CB"] },
    { name: "Havertz", positions: ["ST", "CM"] }, { name: "Martinelli", positions: ["LW", "ST"] }
  ],
  "Man United": [
    { name: "Rashford", positions: ["LW", "ST"] }, { name: "Marcus Rashford", positions: ["LW", "ST"] },
    { name: "Bruno", positions: ["CM", "RW"] }, { name: "Bruno Fernandes", positions: ["CM", "RW"] },
    { name: "Hojlund", positions: ["ST"] }, { name: "Mainoo", positions: ["CM"] }, { name: "Garnacho", positions: ["RW", "LW"] }
  ]
}

/**
 * Page component for the 11 Clubs game.
 * Manages game lifecycle states (difficulty, mode, gameOver) required by the GameEngine console.
 */
export default function ElevenClubsPage() {
  // --- Game State (Required by GameEngine) ---
  const [difficulty, setDifficulty] = useState("Easy")
  const [mode, setMode] = useState("Both")
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [score, setScore] = useState(0)

  // --- Score Synchronization Hook ---
  const { syncStatus, syncPoints, resetSync } = useScoreSync()

  // --- Game Session Data ---

  /** The 11 clubs picked for the current attempt */
  const [selectedClubs, setSelectedClubs] = useState<string[]>([])

  /** Track current calculated score for real-time reporting (useful for surrender) */
  const [currentCalculatedScore, setCurrentCalculatedScore] = useState(0)

  /** Unique key to force a clean remount of the game component when starting over */
  const [key, setKey] = useState(0)

  /**
   * Initializes or resets the game session.
   * Randomizes the clubs and resets all scoring/status indicators.
   */
  const initializeGame = () => {
    const shuffled = [...CLUBS].sort(() => Math.random() - 0.5)
    setSelectedClubs(shuffled.slice(0, 11))
    setGameOver(false)
    setWon(false)
    setScore(0)
    setCurrentCalculatedScore(0)
    resetSync()
    setKey(prev => prev + 1) // Trigger React to create a fresh instance of the game component
  }

  // Set up initial game on mount
  useEffect(() => {
    initializeGame()
  }, [])

  /**
   * Finalizes the game session when the lineup is complete.
   * Receives the final score from the game component.
   */
  const handleGameOver = async (finalScore: number) => {
    setWon(true)
    setScore(finalScore)
    setGameOver(true)
    await syncPoints(finalScore)
  }

  /**
   * Handles the surrender action from the GameEngine header.
   * Uses the last calculated score from the component.
   */
  const handleSurrender = async () => {
    const finalScore = currentCalculatedScore
    setWon(false)
    setScore(finalScore)
    setGameOver(true)
    await syncPoints(finalScore)
  }

  return (
    <GameEngine
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
      // State props for synchronization with GameEngine
      difficulty={difficulty}
      setDifficulty={setDifficulty}
      mode={mode}
      setMode={setMode}
      gameOver={gameOver}
      won={won}
      score={score}
      onReset={initializeGame}
      onSurrender={handleSurrender}
      backHref="/games"
      backText="Back to Games"
    >
      {/* Visual indicator of backend synchronization status */}
      <SyncStatusIndicator status={syncStatus} />

      {/* The "Cartridge" Component: Encapsulates the specific game UI and logic */}
      <ElevenLineupGame
        key={key}
        groupLabel="Clubs"
        availableGroups={selectedClubs}
        itemsByGroup={PLAYERS_BY_CLUB}
        difficulty={difficulty}
        mode={mode}
        isGameOver={gameOver}
        onProgressUpdate={setCurrentCalculatedScore}
        onGameOver={handleGameOver}
      />
    </GameEngine>
  )
}
