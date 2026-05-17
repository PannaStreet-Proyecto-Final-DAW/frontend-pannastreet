/**
 * Guess the Player Page: Standard implementation using the GameEngine (Console)
 * and the GuessThePlayerGame (Cartridge).
 */
"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { GameEngine } from "@/components/games/engine/game-engine"
import { GuessThePlayerGame } from "@/components/games/cartridges/guess-the-player-game"
import { 
  getAllPlayers, 
  getAllTeams, 
  getAllLeagues, 
  getUserTodayAttempt, 
  getDailyChallenge, 
  saveUserAttempt,
  UserGameAttempt
} from "@/lib/api"
import { useScoreSync } from "@/hooks/use-score-sync"
import { Player, Team, League } from "@/types"
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

export default function GuessThePlayerPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [leagues, setLeagues] = useState<League[]>([])
  const [loading, setLoading] = useState(true)

  // 1. Settings state (Difficulty, Mode and Play Mode)
  const [difficulty, setDifficulty] = useState("Easy")
  const [mode, setMode] = useState("Both")
  const [playMode, setPlayMode] = useState<"practice" | "daily">("practice")
  
  // Daily attempt state
  const [dailyAttempt, setDailyAttempt] = useState<UserGameAttempt | null>(null)
  const [dailyCompleted, setDailyCompleted] = useState(false)
  const [dailyTargetPlayer, setDailyTargetPlayer] = useState<Player | null>(null)
  const [checkingAttempt, setCheckingAttempt] = useState(true)

  // Settings lock and temporary progress state
  const [isStarted, setIsStarted] = useState(false)
  const [dailyState, setDailyState] = useState<any>(null)
  const [isSettingsLocked, setIsSettingsLocked] = useState(false)

  // --- Score Synchronization Hook (Syncs points with Supabase) ---
  const { syncPoints } = useScoreSync()

  // 2. High-level game status (Controlled by the GameEngine "Console")
  const [gameState, setGameState] = useState({
    gameOver: false,
    won: false,
    target: null as any,
    score: 0,
    key: 0 // Key to force re-mounting the game logic component on reset
  })

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

  // 3. Check today's attempt on mount
  useEffect(() => {
    async function checkAttempt() {
      try {
        const attempt = await getUserTodayAttempt("guess-the-player")
        if (attempt) {
          setDailyAttempt(attempt)
          setDailyCompleted(true)
          // Default to daily mode so they see the completed screen
          setPlayMode("daily")
          setGameState(prev => ({
            ...prev,
            gameOver: true,
            won: attempt.won,
            score: attempt.points
          }))
        }
      } catch (err) {
        console.error("Failed to load today's attempt:", err)
      } finally {
        setCheckingAttempt(false)
      }
    }
    checkAttempt()
  }, [])

  // 3b. Load saved daily progress/config if exists on mount or playMode change
  useEffect(() => {
    if (typeof window === "undefined") return

    if (playMode === "daily") {
      const { progressKey, configKey } = getDailyKeys("guess-the-player", madridDate)
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
        if (parsed.targetPlayer) {
          setDailyTargetPlayer(parsed.targetPlayer)
        }
        setGameState(prev => ({
          ...prev,
          gameOver: parsed.status !== "playing",
          won: parsed.status === "won",
          score: parsed.score,
          key: Date.now() // Force remount to load daily progress state cleanly
        }))
      } else {
        setDailyState(null)
        setIsStarted(false)
        setGameState(prev => ({
          ...prev,
          gameOver: false,
          won: false,
          score: 0,
          key: Date.now() // Force remount to clear practice session state
        }))
      }
    } else {
      // Practice mode: settings never locked, starts at intro
      setIsSettingsLocked(false)
      setIsStarted(false)
      setGameState(prev => ({
        ...prev,
        gameOver: false,
        won: false,
        score: 0,
        key: Date.now()
      }))
    }
  }, [playMode, madridDate])

  // 4. Fetch players, teams and leagues from API
  useEffect(() => {
    async function loadPlayers() {
      try {
        const [playerData, teamData, leagueData] = await Promise.all([
          getAllPlayers(),
          getAllTeams(),
          getAllLeagues()
        ])
        setPlayers(playerData)
        setTeams(teamData)
        setLeagues(leagueData)
      } catch (error) {
        console.error("Failed to fetch game data:", error)
      } finally {
        setLoading(false)
      }
    }
    loadPlayers()
  }, [])

  // Fetch daily challenge target player when playMode is "daily"
  useEffect(() => {
    if (playMode !== "daily" || loading || dailyCompleted) return

    async function loadDailyChallenge() {
      try {
        const formattedMode = mode.toLowerCase() // 'male', 'female', 'both'
        const formattedDiff = difficulty.toLowerCase() // 'easy', 'intermediate', 'hard'
        const modeId = `${formattedMode}-${formattedDiff}`
        
        const challenge = await getDailyChallenge(madridDate, "guess-the-player", modeId)
        if (challenge && challenge.challengeData) {
          const rawPlayer = challenge.challengeData
          const playerId = rawPlayer.id || rawPlayer.playerId
          
          // Match with our fully detailed players list or fallback
          const matchedPlayer = players.find(p => p.id === playerId) || rawPlayer
          setDailyTargetPlayer(matchedPlayer)
        }
      } catch (err) {
        console.error("Failed to load daily challenge target:", err)
      }
    }
    loadDailyChallenge()
  }, [playMode, mode, difficulty, madridDate, players, loading, dailyCompleted])

  // Filter players based on difficulty tier and gender mode requirements
  const filteredPlayers = useMemo(() => {
    return players.filter((player: Player) => {
      // Difficulty Match
      const difficultyMatch =
        difficulty === "Easy" ? player.tier === 1 :
          difficulty === "Intermediate" ? (player.tier === 1 || player.tier === 2) :
            difficulty === "Hard" ? player.tier === 2 : true;

      // Mode/Gender Match
      const modeMatch =
        mode === "Male" ? player.gender === "male" :
          mode === "Female" ? player.gender === "female" : true;

      return difficultyMatch && modeMatch;
    });
  }, [players, difficulty, mode]);

  // Create a map of team names to their crest URLs
  const teamCrests = useMemo(() => {
    const map: Record<string, string | null> = {}
    teams.forEach(t => {
      const nameClean = t.name.trim().toLowerCase()
      map[nameClean] = t.pictureUrl

      // Also map with common gender suffixes just in case
      const suffix = t.gender === "male" ? " (m)" : " (f)"
      map[nameClean + suffix] = t.pictureUrl
    })
    return map
  }, [teams])

  // Create a map of league names to their logo URLs
  const leagueLogos = useMemo(() => {
    const map: Record<string, string | null> = {}
    leagues.forEach(l => {
      const nameClean = l.name.trim().toLowerCase()
      map[nameClean] = l.pictureUrl
    })
    return map
  }, [leagues])

  // Callback triggered when the user surrenders
  const handleSurrender = () => {
    // If they surrender, they lose by default
    handleGameOver(false, playMode === "daily" ? dailyTargetPlayer : gameState.target, 0)
  }

  /**
   * Callback triggered by the Game Cartridge when the match ends.
   */
  const handleGameOver = useCallback(async (won: boolean, target: any, score: number) => {
    setGameState(prev => ({ ...prev, gameOver: true, won, target, score }))

    // If we are in Daily Challenge mode, sync with new API endpoint
    if (playMode === "daily") {
      try {
        const formattedMode = mode.toLowerCase() // 'male', 'female', 'both'
        const formattedDiff = difficulty.toLowerCase() // 'easy', 'intermediate', 'hard'
        const modeId = `${formattedMode}-${formattedDiff}`

        await saveUserAttempt("guess-the-player", modeId, score, won ? "won" : "lost")
        await syncPoints(score)
        setDailyCompleted(true)
        setDailyAttempt({
          id: "temp",
          userId: "temp",
          date: madridDate,
          gameId: "guess-the-player",
          modeId: modeId,
          score: score,
          points: score,
          status: won ? "won" : "lost",
          won: won
        } as any)
        
        if (typeof window !== "undefined") {
          const { progressKey, configKey } = getDailyKeys("guess-the-player", madridDate)
          localStorage.removeItem(progressKey)
          localStorage.removeItem(configKey)
        }
      } catch (error) {
        console.error("Failed to save today's game attempt:", error)
      }
    }
  }, [playMode, madridDate, mode, difficulty, syncPoints])

  // Resets the game state to start a new round
  const resetGame = () => {
    setGameState({
      gameOver: false,
      won: false,
      target: null,
      score: 0,
      key: Date.now() // Changing the key forces the Cartridge to reset its internal state
    })
    setIsStarted(false)
  }

  // Handle click on "Start Game" inside GameIntroCard
  const handleStartGame = () => {
    setIsStarted(true)
    if (playMode === "daily") {
      const { progressKey, configKey } = getDailyKeys("guess-the-player", madridDate)
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
          attempts: [],
          status: "playing",
          score: 0,
          targetPlayer: dailyTargetPlayer
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

    const { progressKey } = getDailyKeys("guess-the-player", madridDate)
    const progToSave = {
      ...newState,
      targetPlayer: dailyTargetPlayer
    }
    localStorage.setItem(
      progressKey,
      JSON.stringify(progToSave)
    )

    setGameState(prev => {
      const newGameOver = newState.status !== "playing"
      const newWon = newState.status === "won"
      const newScore = newState.score
      if (prev.gameOver === newGameOver && prev.won === newWon && prev.score === newScore) {
        return prev
      }
      return {
        ...prev,
        gameOver: newGameOver,
        won: newWon,
        score: newScore
      }
    })
  }, [playMode, dailyCompleted, dailyTargetPlayer, madridDate])

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
          gameId="guess-the-player"
          gameTitle="Guess the Player"
          score={dailyAttempt?.score !== undefined ? dailyAttempt.score : gameState.score}
          won={dailyAttempt?.won !== undefined ? dailyAttempt.won : gameState.won}
        />
      </div>
    )
  }

  return (
    <GameEngine
      gameId="guess-the-player"
      title={
        <>
          <span className="text-primary">GUESS THE</span> <span className="text-black dark:text-white tracking-normal">PLAYER</span>
        </>
      }
      image="/images/games/guess-the-player.webp"
      description={
        <>
          <p className="mb-2">Guess the Player is a daily football game where you have to uncover the hidden football star using dynamic hints.</p>
          <ul className="list-disc list-inside space-y-0 opacity-80 decoration-primary/50">
            <li>After each guess, the tiles will change color to show how close you are.</li>
            <li>Matches are highlighted in Gold, with partial matches (equivalent league in Both) in Light Yellow.</li>
            <li>Misses will appear as Green or Grey depending on your Light/Dark mode setting.</li>
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
      gameOver={gameState.gameOver}
      won={gameState.won}
      score={gameState.score}
      onReset={resetGame}
      onSurrender={handleSurrender}
      backHref="/games"
      backText="Back to Games"
      resultClassName="game-result-card-gtp"
      resultContent={
        (gameState.target || dailyTargetPlayer) && (
          <p className="text-foreground/80 font-medium">
            {gameState.won ? (
              <>
                You have guessed <span className="font-bold">{(gameState.target || dailyTargetPlayer).name}</span>!
              </>
            ) : (
              <>
                The player was <span className="font-bold">{(gameState.target || dailyTargetPlayer).name}</span>.
              </>
            )}
          </p>
        )
      }
    >
      {/* The Game Cartridge: Contains all the specific logic for this game */}
      <GuessThePlayerGame
        key={gameState.key}
        difficulty={difficulty}
        mode={mode}
        players={filteredPlayers}
        allPlayers={players}
        teamCrests={teamCrests}
        leagueLogos={leagueLogos}
        onGameOver={handleGameOver}
        isGameOver={gameState.gameOver}
        targetPlayerOverride={playMode === "daily" ? dailyTargetPlayer : null}
        initialState={playMode === "daily" ? dailyState : undefined}
        onStateChange={handleStateChange}
      />
    </GameEngine>
  )
}
