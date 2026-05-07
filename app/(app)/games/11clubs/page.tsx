/**
 * ElevenClubsPage: The entry point for the "11 Clubs" game mode.
 * It initializes the game session with random clubs and connects the generic gameplay logic to the GameEngine.
 */
"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { GameEngine } from "@/components/game-engine"
import { ElevenLineupGame } from "@/components/games/eleven-lineup-game"
import { useScoreSync } from "@/hooks/use-score-sync"
import { SyncStatusIndicator } from "@/components/sync-status-indicator"
import { FORMATIONS as FORMATION_COORDS } from "@/lib/formations"
import { getAllTeams, getAllPlayers, getAllFormations, Player, Team, Formation } from "@/lib/api"


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

  const [allTeams, setAllTeams] = useState<Team[]>([])
  const [allPlayers, setAllPlayers] = useState<Player[]>([])
  const [allFormations, setAllFormations] = useState<Formation[]>([])
  const [loading, setLoading] = useState(true)

  /** The 11 clubs picked for the current attempt */
  const [selectedClubs, setSelectedClubs] = useState<string[]>([])

  /** The formation picked for the current attempt */
  const [currentFormation, setCurrentFormation] = useState(FORMATION_COORDS["4-3-3"])

  /** Track current calculated score for real-time reporting */
  const [currentCalculatedScore, setCurrentCalculatedScore] = useState(0)

  /** Unique key to force a clean remount of the game component */
  const [key, setKey] = useState(0)

  /** 
   * Fetches all required data from the API on mount
   */
  useEffect(() => {
    async function loadData() {
      try {
        const [teams, players, formations] = await Promise.all([
          getAllTeams(),
          getAllPlayers(),
          getAllFormations()
        ])
        setAllTeams(teams)
        setAllPlayers(players)
        setAllFormations(formations)
      } catch (error) {
        console.error("Failed to load 11 Clubs data:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  /**
   * Helper to group players by team name for the game engine
   */
  const playersByTeamMap = useMemo(() => {
    const map: Record<string, { name: string; positions: string[] }[]> = {}
    allPlayers.forEach(player => {
      // Filter by gender mode
      const genderMatch =
        mode === "Men" ? player.gender === "male" :
          mode === "Women" ? player.gender === "female" : true;

      if (!genderMatch) return;

      if (!map[player.team]) map[player.team] = []
      map[player.team].push({
        name: player.name,
        positions: player.position
      })
    })
    return map
  }, [allPlayers, mode])

  /**
   * Initializes or resets the game session.
   */
  const initializeGame = useCallback(() => {
    if (loading || allTeams.length === 0) return;

    // 1. Filter teams based on difficulty tier
    const filteredTeams = allTeams.filter(team => {
      if (difficulty === "Easy") return team.tier === 1;
      if (difficulty === "Medium") return team.tier === 1 || team.tier === 2;
      if (difficulty === "Hard") return team.tier === 3;
      return true;
    });

    // 2. Select 11 random clubs
    const shuffledTeams = [...filteredTeams].sort(() => Math.random() - 0.5)
    setSelectedClubs(shuffledTeams.slice(0, 11).map(t => t.name))

    // 3. Randomize formation from backend
    if (allFormations.length > 0) {
      const randomFormation = allFormations[Math.floor(Math.random() * allFormations.length)]
      const coords = FORMATION_COORDS[randomFormation.name] || FORMATION_COORDS["4-3-3"]
      setCurrentFormation(coords)
    }

    // 4. Reset states
    setGameOver(false)
    setWon(false)
    setScore(0)
    setCurrentCalculatedScore(0)
    resetSync()
    setKey(prev => prev + 1)
  }, [difficulty, allTeams, allFormations, loading, resetSync])

  // Set up game when data is ready or difficulty changes
  useEffect(() => {
    if (!loading && allTeams.length > 0) {
      initializeGame()
    }
  }, [loading, allTeams.length, difficulty, initializeGame])

  /**
   * Finalizes the game session when the lineup is complete.
   */
  const handleGameOver = async (finalScore: number) => {
    setWon(true)
    setScore(finalScore)
    setGameOver(true)
    await syncPoints(finalScore)
  }

  /**
   * Handles the surrender action.
   */
  const handleSurrender = async () => {
    const finalScore = currentCalculatedScore
    setWon(false)
    setScore(finalScore)
    setGameOver(true)
    await syncPoints(finalScore)
  }

  //Loading message
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl font-bold animate-pulse text-primary">
          Cargando el vestuario...
        </div>
      </div>
    )
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
        itemsByGroup={playersByTeamMap}
        difficulty={difficulty}
        mode={mode}
        formation={currentFormation}
        isGameOver={gameOver}
        onProgressUpdate={setCurrentCalculatedScore}
        onGameOver={handleGameOver}
      />
    </GameEngine>
  )
}
