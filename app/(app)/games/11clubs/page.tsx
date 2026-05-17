"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { GameEngine } from "@/components/games/engine/game-engine"
import { ElevenLineupGame } from "@/components/games/cartridges/eleven-lineup-game"
import { FORMATIONS as FORMATION_COORDS } from "@/lib/formations"
import { 
  getAllTeams, 
  getAllPlayers, 
  getAllFormations, 
  getUserTodayAttempt, 
  getDailyChallenge, 
  saveUserAttempt,
  UserGameAttempt
} from "@/lib/api"
import { useScoreSync } from "@/hooks/use-score-sync"
import { Player, Team, Formation } from "@/types"
import { DailyLockedCard } from "@/components/games/shared/daily-locked-card"
import { PlayModeSelector } from "@/components/games/shared/play-mode-selector"

function getDailyKeys(gameId: string, madridDate: string) {
  if (typeof window === "undefined") return { progressKey: "", configKey: "" }
  const userJson = localStorage.getItem("user")
  const user = userJson ? JSON.parse(userJson) : null
  const userId = user?.id ? `${user.id}_` : ""
  return {
    progressKey: `pannastreet_daily_progress_${gameId}_${userId}${madridDate}`,
    configKey: `pannastreet_daily_config_${gameId}_${userId}${madridDate}`
  }
}

export default function ElevenClubsPage() {
  // --- Game State (Required by GameEngine "Console") ---
  const [difficulty, setDifficulty] = useState("Easy")
  const [mode, setMode] = useState("Both")
  const [playMode, setPlayMode] = useState<"practice" | "daily">("practice")
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [score, setScore] = useState(0)

  // --- Game Session Data ---
  const [allTeams, setAllTeams] = useState<Team[]>([])
  const [allPlayers, setAllPlayers] = useState<Player[]>([])
  const [allFormations, setAllFormations] = useState<Formation[]>([])
  const [loading, setLoading] = useState(true)

  // Daily challenge states
  const [dailyAttempt, setDailyAttempt] = useState<UserGameAttempt | null>(null)
  const [dailyCompleted, setDailyCompleted] = useState(false)
  const [dailyChallengeData, setDailyChallengeData] = useState<any>(null)
  const [checkingAttempt, setCheckingAttempt] = useState(true)

  // Settings lock and temporary progress state
  const [isStarted, setIsStarted] = useState(false)
  const [dailyState, setDailyState] = useState<any>(null)
  const [isSettingsLocked, setIsSettingsLocked] = useState(false)

  // The 11 clubs picked for the current attempt
  const [selectedClubs, setSelectedClubs] = useState<string[]>([])

  // The formation picked for the current attempt
  const [currentFormation, setCurrentFormation] = useState(FORMATION_COORDS["4-3-3"])

  // Map of club name (with gender) to its crest URL
  const [teamCrests, setTeamCrests] = useState<Record<string, string | null>>({})

  // Track current calculated score for real-time reporting
  const [currentCalculatedScore, setCurrentCalculatedScore] = useState(0)

  // Unique key to force a clean remount of the game component
  const [key, setKey] = useState(0)

  // --- Score Synchronization Hook (Syncs points with Supabase) ---
  const { syncPoints } = useScoreSync()

  // Spain timezone date YYYY-MM-DD
  const madridDate = useMemo(() => {
    try {
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "Europe/Madrid",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      })
      const parts = formatter.formatToParts(new Date())
      const year = parts.find(p => p.type === "year")!.value
      const month = parts.find(p => p.type === "month")!.value
      const day = parts.find(p => p.type === "day")!.value
      return `${year}-${month}-${day}`
    } catch (e) {
      const now = new Date()
      return now.toISOString().split("T")[0]
    }
  }, [])

  // 1. Check today's attempt on mount
  useEffect(() => {
    async function checkAttempt() {
      try {
        const attempt = await getUserTodayAttempt("11clubs")
        if (attempt) {
          setDailyAttempt(attempt)
          setDailyCompleted(true)
          setPlayMode("daily")
          setGameOver(true)
          setWon(attempt.won)
          setScore(attempt.points)
        }
      } catch (err) {
        console.error("Failed to load 11clubs today's attempt:", err)
      } finally {
        setCheckingAttempt(false)
      }
    }
    checkAttempt()
  }, [])

  // 1b. Load saved daily progress/config if exists on mount or playMode change
  useEffect(() => {
    if (typeof window === "undefined") return

    if (playMode === "daily") {
      const { progressKey, configKey } = getDailyKeys("11clubs", madridDate)
      const savedConfig = localStorage.getItem(configKey)
      const savedProgress = localStorage.getItem(progressKey)

      if (savedConfig && savedProgress) {
        const { difficulty: savedDiff, mode: savedMode } = JSON.parse(savedConfig)
        setDifficulty(savedDiff)
        setMode(savedMode)
        setIsSettingsLocked(true)
      } else {
        setIsSettingsLocked(false)
      }

      if (savedProgress) {
        const parsed = JSON.parse(savedProgress)
        setDailyState(parsed)
        if (parsed.refereeState) {
          setGameOver(parsed.refereeState.status !== "playing")
          setWon(parsed.refereeState.status === "won")
          setScore(parsed.refereeState.score)
          setCurrentCalculatedScore(parsed.refereeState.score)
        }
      } else {
        setDailyState(null)
        setIsStarted(false)
      }
    } else {
      // Practice mode: settings never locked, starts at intro
      setIsSettingsLocked(false)
      setIsStarted(false)
      setGameOver(false)
      setWon(false)
      setScore(0)
      setCurrentCalculatedScore(0)
      setKey(prev => prev + 1)
    }
  }, [playMode, madridDate])

  // 2. Fetches all required data from the API on mount
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

  // 3. Fetch daily challenge configuration
  useEffect(() => {
    if (playMode !== "daily" || loading || dailyCompleted) return

    async function loadDailyChallenge() {
      try {
        const formattedMode = mode.toLowerCase() // 'male', 'female', 'both'
        const formattedDiff = difficulty.toLowerCase() // 'easy', 'intermediate', 'hard'
        const modeId = `${formattedMode}-${formattedDiff}`
        
        const challenge = await getDailyChallenge(madridDate, "11clubs", modeId)
        if (challenge && challenge.challengeData) {
          setDailyChallengeData(challenge.challengeData)
        }
      } catch (err) {
        console.error("Failed to load daily challenge configuration:", err)
      }
    }
    loadDailyChallenge()
  }, [playMode, mode, difficulty, madridDate, loading, dailyCompleted])

  // Helper to group players by team name for the game engine
  const playersByTeamMap = useMemo(() => {
    const map: Record<string, { id: string; name: string; positions: string[]; tier?: number }[]> = {}
    allPlayers.forEach(player => {
      // Filter by gender mode
      const genderMatch =
        mode === "Male" ? player.gender === "male" :
          mode === "Female" ? player.gender === "female" : true;

      if (!genderMatch) return;

      const groupKey = `${player.team} (${player.gender === "male" ? "M" : "F"})`
      if (!map[groupKey]) map[groupKey] = []
      map[groupKey].push({
        id: player.id,
        name: player.name,
        positions: player.position,
        tier: player.tier
      })
    })
    return map
  }, [allPlayers, mode])

  // Helper to group all players by team name for search (unfiltered by gender)
  const allPlayersByTeamMap = useMemo(() => {
    const map: Record<string, { id: string; name: string; positions: string[]; tier?: number }[]> = {}
    allPlayers.forEach(player => {
      const groupKey = `${player.team} (${player.gender === "male" ? "M" : "F"})`
      if (!map[groupKey]) map[groupKey] = []
      map[groupKey].push({
        id: player.id,
        name: player.name,
        positions: player.position,
        tier: player.tier
      })
    })
    return map
  }, [allPlayers])

  // Initializes or resets the game session.
  const initializeGame = useCallback(() => {
    if (loading || allTeams.length === 0) return;

    if (playMode === "daily") {
      if (!dailyChallengeData) return;

      const clubsPicked = dailyChallengeData.teams || dailyChallengeData.clubs || []
      const formationName = typeof dailyChallengeData.formation === "string"
        ? dailyChallengeData.formation
        : (dailyChallengeData.formation?.name || "4-3-3")

      const selected: Team[] = []
      clubsPicked.forEach((club: any) => {
        const clubName = typeof club === "string" ? club : club.name
        const clubGender = typeof club === "string" 
          ? (mode === "Male" ? "male" : mode === "Female" ? "female" : "male") 
          : club.gender
        
        const teamObj = allTeams.find(t => t.name.trim().toLowerCase() === clubName.trim().toLowerCase() && t.gender === clubGender)
        if (teamObj) {
          selected.push(teamObj)
        }
      })

      const crestsMap: Record<string, string | null> = {}
      selected.forEach(t => {
        const key = `${t.name} (${t.gender === "male" ? "M" : "F"})`
        crestsMap[key] = t.pictureUrl
      })

      setSelectedClubs(selected.map(t => `${t.name} (${t.gender === "male" ? "M" : "F"})`))
      setTeamCrests(crestsMap)

      const coords = FORMATION_COORDS[formationName] || FORMATION_COORDS["4-3-3"]
      setCurrentFormation(coords)

      if (dailyState) {
        setGameOver(dailyState.refereeState?.status !== "playing")
        setWon(dailyState.refereeState?.status === "won")
        setScore(dailyState.refereeState?.score || 0)
        setCurrentCalculatedScore(dailyState.refereeState?.score || 0)
      } else {
        setGameOver(false)
        setWon(false)
        setScore(0)
        setCurrentCalculatedScore(0)
        setIsStarted(false)
      }
      setKey(prev => prev + 1)
      return
    }

    // Practice Mode: Random setup
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

    // Reset states
    setGameOver(false)
    setWon(false)
    setScore(0)
    setCurrentCalculatedScore(0)
    setKey(prev => prev + 1)
    setIsStarted(false)
  }, [difficulty, mode, allTeams, allFormations, loading, playMode, dailyChallengeData])

  // Set up game when data is ready or difficulty changes
  useEffect(() => {
    if (!loading && allTeams.length > 0) {
      if (playMode === "daily" && !dailyChallengeData) return
      initializeGame()
    }
  }, [loading, allTeams.length, difficulty, playMode, dailyChallengeData, initializeGame])

  // Finalizes the game session when the lineup is complete.
  const handleGameOver = useCallback(async (finalScore: number) => {
    setWon(true)
    setScore(finalScore)
    setGameOver(true)
    
    if (playMode === "daily") {
      try {
        const formattedMode = mode.toLowerCase() // 'male', 'female', 'both'
        const formattedDiff = difficulty.toLowerCase() // 'easy', 'intermediate', 'hard'
        const modeId = `${formattedMode}-${formattedDiff}`

        await saveUserAttempt("11clubs", modeId, finalScore, "won")
        await syncPoints(finalScore)
        setDailyCompleted(true)
        setDailyAttempt({
          id: "temp",
          userId: "temp",
          date: madridDate,
          gameId: "11clubs",
          modeId: modeId,
          score: finalScore,
          points: finalScore,
          status: "won",
          won: true
        } as any)

        if (typeof window !== "undefined") {
          const { progressKey, configKey } = getDailyKeys("11clubs", madridDate)
          localStorage.removeItem(progressKey)
          localStorage.removeItem(configKey)
        }
      } catch (error) {
        console.error("Failed to save today's game attempt:", error)
      }
    }
  }, [playMode, madridDate, mode, difficulty, syncPoints])

  // Handles the surrender action.
  const handleSurrender = useCallback(async () => {
    const finalScore = currentCalculatedScore
    setWon(false)
    setScore(finalScore)
    setGameOver(true)
    
    if (playMode === "daily") {
      try {
        const formattedMode = mode.toLowerCase()
        const formattedDiff = difficulty.toLowerCase()
        const modeId = `${formattedMode}-${formattedDiff}`

        await saveUserAttempt("11clubs", modeId, finalScore, "lost")
        await syncPoints(finalScore)
        setDailyCompleted(true)
        setDailyAttempt({
          id: "temp",
          userId: "temp",
          date: madridDate,
          gameId: "11clubs",
          modeId: modeId,
          score: finalScore,
          points: finalScore,
          status: "lost",
          won: false
        } as any)

        if (typeof window !== "undefined") {
          const { progressKey, configKey } = getDailyKeys("11clubs", madridDate)
          localStorage.removeItem(progressKey)
          localStorage.removeItem(configKey)
        }
      } catch (error) {
        console.error("Failed to save today's game attempt:", error)
      }
    }
  }, [currentCalculatedScore, playMode, madridDate, mode, difficulty, syncPoints])

  // Handle click on "Start Game" inside GameIntroCard
  const handleStartGame = () => {
    setIsStarted(true)
    if (playMode === "daily") {
      const { progressKey, configKey } = getDailyKeys("11clubs", madridDate)
      // Lock difficulty and mode
      localStorage.setItem(
        configKey,
        JSON.stringify({ difficulty, mode })
      )
      setIsSettingsLocked(true)

      // Only save initial progress if there is no existing dailyState/savedProgress
      const existingProgress = localStorage.getItem(progressKey)
      if (!existingProgress) {
        const initialProg = {
          lineup: Array(11).fill(null),
          clubQueue: selectedClubs,
          refereeState: {
            attempts: [],
            status: "playing",
            score: 0
          }
        }
        localStorage.setItem(
          progressKey,
          JSON.stringify(initialProg)
        )
        setDailyState(initialProg)
      }
    }
  }

  // Handle internal gameplay updates to save progress
  const handleStateChange = useCallback((newState: any) => {
    if (playMode !== "daily" || dailyCompleted) return

    const { progressKey } = getDailyKeys("11clubs", madridDate)
    const progToSave = {
      lineup: newState.lineup,
      clubQueue: newState.clubQueue,
      refereeState: newState.refereeState
    }
    localStorage.setItem(
      progressKey,
      JSON.stringify(progToSave)
    )

    const newGameOver = newState.refereeState.status !== "playing"
    const newWon = newState.refereeState.status === "won"
    const newScore = newState.refereeState.score

    setGameOver(prev => prev === newGameOver ? prev : newGameOver)
    setWon(prev => prev === newWon ? prev : newWon)
    setScore(prev => prev === newScore ? prev : newScore)
    setCurrentCalculatedScore(prev => prev === newScore ? prev : newScore)
  }, [playMode, dailyCompleted, madridDate])

  //Loading message
  if (loading || checkingAttempt) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl font-bold animate-pulse text-primary">
          Loading players from the tunnel...
        </div>
      </div>
    )
  }

  // Render Locked Card if user already completed the challenge today
  if (playMode === "daily" && dailyCompleted) {
    return (
      <div className="pt-12 animate-in fade-in duration-500 flex flex-col gap-6">
        {/* Play Mode Selector so they can switch back to practice mode */}
        <div className="max-w-2xl mx-auto w-full px-4">
          <PlayModeSelector
            value={playMode}
            onChange={setPlayMode}
            dailyCompleted={dailyCompleted}
          />
        </div>
        <DailyLockedCard
          gameId="11clubs"
          gameTitle="11 Clubs"
          score={dailyAttempt?.score !== undefined ? dailyAttempt.score : score}
          won={dailyAttempt?.won !== undefined ? dailyAttempt.won : won}
        />
      </div>
    )
  }

  return (
    <GameEngine
      gameId="11clubs"
      title={
        <>
          <span className="text-primary">11</span> <span className="text-black dark:text-white tracking-normal">CLUBS</span>
        </>
      }
      image="/images/games/11clubs.webp"
      description={
        <>
          <p className="mb-2">11 Clubs is a daily football game where you have to add players from 11 different clubs in one lineup.</p>
          <ul className="list-disc list-inside space-y-0 opacity-80 decoration-primary/50">
            <li>Clubs appear in random order, and you must add a player from each club.</li>
            <li>Complete the full lineup to win.</li>
            <li>Choose between 3 difficulty levels that get progressively harder.</li>
            <li>Choose your mode to multiply your points: Male (x1), Female (x1.5) or Both (x2).</li>
            <li>You can give up by clicking the Red Card icon.</li>
          </ul>
        </>
      }
      difficulty={difficulty}
      setDifficulty={setDifficulty}
      mode={mode}
      setMode={setMode}
      playMode={playMode}
      setPlayMode={setPlayMode}
      dailyCompleted={dailyCompleted}
      isSettingsLocked={isSettingsLocked}
      isStarted={isStarted}
      onStart={handleStartGame}
      gameOver={gameOver}
      won={won}
      score={score}
      onReset={initializeGame}
      onSurrender={handleSurrender}
      backHref="/games"
      backText="Back to Games"
    >
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
        initialState={playMode === "daily" ? dailyState : undefined}
        initialLineup={playMode === "daily" ? dailyState?.lineup : undefined}
        onStateChange={handleStateChange}
      />
    </GameEngine>
  )
}
