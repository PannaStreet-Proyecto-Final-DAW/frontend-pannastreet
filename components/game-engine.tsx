/**
 * GameEngine: The "Console" component that manages the standard game lifecycle.
 * It handles the transition between Intro, Gameplay, and Results.
 */
"use client"

import React, { useState, ReactNode } from "react"
import { GameLayout } from "./game-layout"
import { GameIntroCard } from "./game-intro-card"
import { GameResultCard } from "./game-result-card"
import { cn } from "@/lib/utils"

interface GameEngineProps {
  // Intro screen metadata
  gameId: string
  title: ReactNode
  description: ReactNode
  image: string

  // Settings (passed down to Intro and Game)
  difficulty: string
  setDifficulty: (d: string) => void
  mode: string
  setMode: (m: string) => void

  // Game status (received from the specific game logic)
  gameOver: boolean
  won: boolean
  score?: number       // Final score calculated by the game
  onReset: () => void
  onSurrender?: () => void

  // Result screen customization
  resultTitle?: string
  resultContent?: ReactNode

  // Navigation properties for the Layout back button
  backHref: string     // URL to navigate back to (e.g. "/games")
  backText: string     // Text accompanying the arrow (e.g. "Back")
  
  // The "Cartridge": This is where the specific game component is injected
  children: ReactNode
}

export function GameEngine({
  gameId,
  title,
  description,
  image,
  difficulty,
  setDifficulty,
  mode,
  setMode,
  gameOver,
  won,
  score,
  onReset,
  onSurrender,
  resultTitle,
  resultContent,
  backHref,
  backText,
  children
}: GameEngineProps) {
  // Internal state: controls whether we are in the Intro (false) or the Game (true)
  const [isStarted, setIsStarted] = useState(false)

  // Executed when clicking "Start Game" in the Intro
  const handleStart = () => {
    setIsStarted(true)
  }

  // Executed when clicking "Play Again" in the result screen
  const handleReset = () => {
    // 1. Notify the game logic to reset (clear attempts, pick new target)
    onReset()
    
    // 2. Note: We don't reset 'isStarted' because we want the user to stay 
    // in the game view for a quick rematch, without seeing the rules again.
  }

  return (
    <GameLayout
      backHref={backHref}
      backText={backText}
      showSurrender={isStarted && !gameOver}
      onSurrender={onSurrender}
    >
      {!isStarted ? (
        /* --- PHASE 1: INTRO --- */
        <GameIntroCard
          gameId={gameId}
          title={title}
          image={image}
          description={description}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          mode={mode}
          setMode={setMode}
          onStart={handleStart}
        />
      ) : (
        /* --- PHASE 2: ACTIVE GAME --- */
        <>
          {/* This is where the specific game (the Cartridge) is injected */}
          {children}

          {/* --- PHASE 3: RESULTS --- 
              Displayed automatically when 'gameOver' is true */}
          {gameOver && (
            <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <GameResultCard
                className={cn(won ? "bg-primary/10" : "bg-destructive/10")}
                title={resultTitle || (won ? "¡Congratulations!" : "Game Over")}
                thanksMessage="¡Thanks for playing! See you tomorrow"
              >
                {/* Score display */}
                {score !== undefined && (
                  <div className="mb-4 text-center">
                    <span className={cn(
                      "text-3xl font-black drop-shadow-sm",
                      won ? "text-primary" : "text-destructive"
                    )}>
                      {score}
                    </span>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Points earned</p>
                  </div>
                )}

                {resultContent}

                {/* Standardized Replay Button */}
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={handleReset}
                    className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform shadow-lg"
                  >
                    Play Again
                  </button>
                </div>
              </GameResultCard>
            </div>
          )}
        </>
      )}
    </GameLayout>
  )
}
