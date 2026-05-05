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
const PLAYERS_BY_CLUB: Record<string, { name: string; position: string }[]> = {
  "Real Madrid": [
    { name: "Bellingham", position: "CM" }, { name: "Jude Bellingham", position: "CM" },
    { name: "Vinicius", position: "LW" }, { name: "Vinicius Junior", position: "LW" },
    { name: "Mbappe", position: "ST" }, { name: "Kylian Mbappe", position: "ST" },
    { name: "Rodrygo", position: "RW" }, { name: "Valverde", position: "CM" }
  ],
  "Barcelona": [
    { name: "Pedri", position: "CM" }, { name: "Gavi", position: "CM" },
    { name: "Yamal", position: "RW" }, { name: "Lamine Yamal", position: "RW" },
    { name: "Raphinha", position: "LW" }, { name: "Lewandowski", position: "ST" }, { name: "Robert Lewandowski", position: "ST" }
  ],
  "Bayern Munich": [
    { name: "Sane", position: "LW" }, { name: "Musiala", position: "CM" },
    { name: "Kane", position: "ST" }, { name: "Harry Kane", position: "ST" },
    { name: "Kimmich", position: "CM" }, { name: "Muller", position: "CM" }, { name: "Thomas Muller", position: "CM" }
  ],
  "Man City": [
    { name: "Haaland", position: "ST" }, { name: "Erling Haaland", position: "ST" },
    { name: "De Bruyne", position: "CM" }, { name: "Kevin De Bruyne", position: "CM" },
    { name: "Foden", position: "RW" }, { name: "Rodri", position: "CM" }, { name: "Grealish", position: "LW" }
  ],
  "Liverpool": [
    { name: "Salah", position: "RW" }, { name: "Mohamed Salah", position: "RW" },
    { name: "Nunez", position: "ST" }, { name: "Darwin Nunez", position: "ST" },
    { name: "Mac Allister", position: "CM" }, { name: "Szoboszlai", position: "CM" }, { name: "Van Dijk", position: "CB" }
  ],
  "PSG": [
    { name: "Dembele", position: "RW" }, { name: "Ousmane Dembele", position: "RW" },
    { name: "Barcola", position: "LW" }, { name: "Asensio", position: "ST" },
    { name: "Vitinha", position: "CM" }, { name: "Hakimi", position: "RB" }
  ],
  "Juventus": [
    { name: "Vlahovic", position: "ST" }, { name: "Chiesa", position: "LW" },
    { name: "Locatelli", position: "CM" }, { name: "Yildiz", position: "ST" }, { name: "Bremer", position: "CB" }
  ],
  "Inter Milan": [
    { name: "Lautaro", position: "ST" }, { name: "Lautaro Martinez", position: "ST" },
    { name: "Thuram", position: "ST" }, { name: "Marcus Thuram", position: "ST" },
    { name: "Barella", position: "CM" }, { name: "Calhanoglu", position: "CM" }, { name: "Bastoni", position: "CB" }
  ],
  "Chelsea": [
    { name: "Palmer", position: "RW" }, { name: "Cole Palmer", position: "RW" },
    { name: "Mudryk", position: "LW" }, { name: "Jackson", position: "ST" }, { name: "Nicolas Jackson", position: "ST" },
    { name: "Enzo", position: "CM" }, { name: "Enzo Fernandez", position: "CM" }, { name: "Caicedo", position: "CM" }
  ],
  "Arsenal": [
    { name: "Saka", position: "RW" }, { name: "Bukayo Saka", position: "RW" },
    { name: "Odegaard", position: "CM" }, { name: "Martin Odegaard", position: "CM" },
    { name: "Rice", position: "CM" }, { name: "Declan Rice", position: "CM" },
    { name: "Havertz", position: "ST" }, { name: "Martinelli", position: "LW" }
  ],
  "Man United": [
    { name: "Rashford", position: "LW" }, { name: "Marcus Rashford", position: "LW" },
    { name: "Bruno", position: "CM" }, { name: "Bruno Fernandes", position: "CM" },
    { name: "Hojlund", position: "ST" }, { name: "Mainoo", position: "CM" }, { name: "Garnacho", position: "RW" }
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
