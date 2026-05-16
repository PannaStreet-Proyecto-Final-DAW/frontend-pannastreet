/**
 * Guess the Player Page: Standard implementation using the GameEngine (Console)
 * and the GuessThePlayerGame (Cartridge).
 */
"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { GameEngine } from "@/components/games/engine/game-engine"
import { GuessThePlayerGame } from "@/components/games/cartridges/guess-the-player-game"
import { useScoreSync } from "@/hooks/use-score-sync"
import { getAllPlayers, getAllTeams, getAllLeagues } from "@/lib/api"
import { Player, Team, League } from "@/types"


export default function GuessThePlayerPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [leagues, setLeagues] = useState<League[]>([])
  const [loading, setLoading] = useState(true)

  // 1. Settings state (Difficulty and Mode)
  const [difficulty, setDifficulty] = useState("Easy")
  const [mode, setMode] = useState("Both")

  // 2. High-level game status (Controlled by the GameEngine "Console")
  const [gameState, setGameState] = useState({
    gameOver: false,
    won: false,
    target: null as any,
    score: 0,
    key: 0 // Key to force re-mounting the game logic component on reset
  })

  // 3. Score Synchronization Hook (Syncs points with the server/Supabase)
  const { syncPoints, resetSync } = useScoreSync()

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
    setGameState(prev => ({ ...prev, gameOver: true, won: false, score: 0 }))
  }

  /**
   * Callback triggered by the Game Cartridge when the match ends.
   * This bridges the internal Game Logic (hook) with the UI Console (Engine).
   */
  const handleGameOver = useCallback(async (won: boolean, target: any, score: number) => {
    setGameState(prev => ({ ...prev, gameOver: true, won, target, score }))

    // If the user won points, sync with backend (Supabase)
    if (won && score > 0) {
      await syncPoints(score)
    }
  }, [syncPoints])

  // Resets the game state to start a new round
  const resetGame = () => {
    resetSync()
    setGameState({
      gameOver: false,
      won: false,
      target: null,
      score: 0,
      key: Date.now() // Changing the key forces the Cartridge to reset its internal state
    })
  }

  //Loading messagge
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
      gameOver={gameState.gameOver}
      won={gameState.won}
      score={gameState.score}
      onReset={resetGame}
      onSurrender={handleSurrender}
      backHref="/games"
      backText="Back to Games"
      resultClassName="game-result-card-gtp"
      // Content to show inside the result card
      resultContent={
        gameState.target && (
          <p className="text-foreground/80 font-medium">
            {gameState.won ? (
              <>
                You have guessed <span className="font-bold">{gameState.target.name}</span>!
              </>
            ) : (
              <>
                The player was <span className="font-bold">{gameState.target.name}</span>.
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
      />
    </GameEngine>
  )
}
