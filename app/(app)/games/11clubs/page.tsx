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

  /** Map of club name (with gender) to its crest URL */
  const [teamCrests, setTeamCrests] = useState<Record<string, string | null>>({})

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
        mode === "Male" ? player.gender === "male" :
          mode === "Female" ? player.gender === "female" : true;

      if (!genderMatch) return;

      const groupKey = `${player.team} (${player.gender === "male" ? "M" : "F"})`
      if (!map[groupKey]) map[groupKey] = []
      map[groupKey].push({
        name: player.name,
        positions: player.position
      })
    })
    return map
  }, [allPlayers, mode])

  /**
   * Helper to group all players by team name for search (unfiltered by gender)
   */
  const allPlayersByTeamMap = useMemo(() => {
    const map: Record<string, { name: string; positions: string[] }[]> = {}
    allPlayers.forEach(player => {
      const groupKey = `${player.team} (${player.gender === "male" ? "M" : "F"})`
      if (!map[groupKey]) map[groupKey] = []
      map[groupKey].push({
        name: player.name,
        positions: player.position
      })
    })
    return map
  }, [allPlayers])

  /**
   * Initializes or resets the game session.
   */
  const initializeGame = useCallback(() => {
    if (loading || allTeams.length === 0) return;

    // 1. Filter teams based on difficulty tier and gender mode
    const filteredTeams = allTeams.filter(team => {
      // Tier filter
      const tierMatch = difficulty === "Easy" ? team.tier === 1 :
                        difficulty === "Intermediate" ? (team.tier === 1 || team.tier === 2) :
                        difficulty === "Hard" ? team.tier === 2 : true;
      
      // Gender filter
      const genderMatch = mode === "Male" ? team.gender === "male" :
                          mode === "Female" ? team.gender === "female" : true;

      return tierMatch && genderMatch;
    });

    // 2. Select 11 random clubs with balanced gender if mode is "Both"
    let selected: Team[] = []
    
    if (mode === "Both") {
      const menTeams = filteredTeams.filter(t => t.gender === "male")
      const womenTeams = filteredTeams.filter(t => t.gender === "female")
      
      // Randomly decide which gender gets 6 and which gets 5
      const menCount = Math.random() > 0.5 ? 6 : 5
      const womenCount = 11 - menCount
      
      const pickedMen = [...menTeams].sort(() => Math.random() - 0.5).slice(0, menCount)
      const pickedWomen = [...womenTeams].sort(() => Math.random() - 0.5).slice(0, womenCount)
      
      selected = [...pickedMen, ...pickedWomen].sort(() => Math.random() - 0.5)
    } else {
      // Just pick 11 random from the filtered list (which only contains one gender anyway)
      selected = [...filteredTeams].sort(() => Math.random() - 0.5).slice(0, 11)
    }
    
    // 3. Create a map of group keys to their respective crests
    const crestsMap: Record<string, string | null> = {}
    selected.forEach(t => {
      const key = `${t.name} (${t.gender === "male" ? "M" : "F"})`
      crestsMap[key] = t.pictureUrl
    })

    setSelectedClubs(selected.map(t => `${t.name} (${t.gender === "male" ? "M" : "F"})`))
    setTeamCrests(crestsMap)

    // 4. Randomize formation from backend
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
  }, [difficulty, mode, allTeams, allFormations, loading, resetSync])

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
          Loading players from the tunnel...
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
      image="/images/games/11clubs.webp"
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
        availableCrests={teamCrests}
        itemsByGroup={allPlayersByTeamMap}
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
