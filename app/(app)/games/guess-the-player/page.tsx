/**
 * Guess the Player Page: Standard implementation using the GameEngine (Console)
 * and the GuessThePlayerGame (Cartridge).
 */
"use client"

import { useState } from "react"
import { GameEngine } from "@/components/game-engine"
import { GuessThePlayerGame } from "@/components/games/guess-the-player-game"
import { useScoreSync } from "@/hooks/use-score-sync"
import { SyncStatusIndicator } from "@/components/sync-status-indicator"

export default function GuessThePlayerPage() {
  // 1. Settings state (Difficulty and Mode)
  const [difficulty, setDifficulty] = useState("Easy")
  const [mode, setMode] = useState("Both")
  
  // 2. High-level game status
  const [gameState, setGameState] = useState({ 
    gameOver: false, 
    won: false, 
    target: null as any,
    score: 0,
    key: 0 // Key to force re-mounting the game logic component on reset
  })

  // 3. Score Synchronization Hook
  const { syncStatus, syncPoints, resetSync } = useScoreSync()

  /**
   * Callback triggered when the user surrenders
   */
  const handleSurrender = () => {
    // If they surrender, they lose by default
    setGameState(prev => ({ ...prev, gameOver: true, won: false, score: 0 }))
  }

  /**
   * Callback triggered by the Game Cartridge when the match ends
   */
  const handleGameOver = async (won: boolean, target: any, score: number) => {
    setGameState(prev => ({ ...prev, gameOver: true, won, target, score }))

    // If the user won points, sync with backend
    if (won && score > 0) {
      await syncPoints(score)
    }
  }

  /**
   * Resets the game state to start a new round
   */
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

  return (
    <GameEngine
      gameId="guess-the-player"
      title={
        <>
          <span className="text-primary">GUESS THE</span> <span className="text-black dark:text-white tracking-normal">PLAYER</span>
        </>
      }
      image="/images/games/guess-the-player.png"
      description={
        <>
          <p className="mb-2">Guess the Player is a daily football game where you have 6 attempts to uncover the hidden football star.</p>
          <ul className="list-disc list-inside space-y-0 opacity-80 decoration-primary/50">
            <li>After each guess, you'll receive dynamic feedback.</li>
            <li>The tiles will change color to show how close you are.</li>
            <li>Green for a match, and Grey for no match.</li>
            <li>Select from 3 difficulty levels that increase in challenge.</li>
            <li>Play in Men's, Women's, or Both categories.</li>
            <li>Double your points by choosing the Both mode!</li>
            <li>You can give up by clicking the Red Card button.</li>
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
      {/* Visual indicator of backend synchronization status */}
      <SyncStatusIndicator status={syncStatus} />

      {/* The Game Cartridge: Contains all the specific logic for this game */}
      <GuessThePlayerGame
        key={gameState.key}
        difficulty={difficulty}
        mode={mode}
        onGameOver={handleGameOver}
        isGameOver={gameState.gameOver}
      />
    </GameEngine>
  )
}
