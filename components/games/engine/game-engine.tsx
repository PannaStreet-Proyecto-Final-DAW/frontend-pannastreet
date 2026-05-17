/**
 * GameEngine: The "Console" component that manages the standard game lifecycle.
 * It handles the transition between Intro, Gameplay, and Results.
 */
"use client"

import React, { useState, ReactNode } from "react"
import { GameLayout } from "../ui/game-layout"
import { GameIntroCard } from "../ui/game-intro-card"
import { GameResultCard } from "../ui/game-result-card"
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
  playMode?: "practice" | "daily"
  setPlayMode?: (v: "practice" | "daily") => void
  dailyCompleted?: boolean
  isSettingsLocked?: boolean

  // Game status (received from the specific game logic)
  gameOver: boolean
  won: boolean
  score?: number       // Final score calculated by the game
  onReset: () => void
  onSurrender?: () => void

  // Result screen customization
  resultTitle?: string
  resultContent?: ReactNode
  resultClassName?: string

  // Navigation properties for the Layout back button
  backHref: string     // URL to navigate back to (e.g. "/games")
  backText: string     // Text accompanying the arrow (e.g. "Back")
  
  isStarted?: boolean
  onStart?: () => void
  
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
  playMode = "practice",
  setPlayMode,
  dailyCompleted = false,
  isSettingsLocked = false,
  gameOver,
  won,
  score,
  onReset,
  onSurrender,
  resultTitle,
  resultContent,
  resultClassName,
  backHref,
  backText,
  isStarted: isStartedProp,
  onStart: onStartProp,
  children
}: GameEngineProps) {
  // Internal state: controls whether we are in the Intro (false) or the Game (true)
  const [internalStarted, setInternalStarted] = useState(false)
  const isStarted = isStartedProp !== undefined ? isStartedProp : internalStarted

  // Executed when clicking "Start Game" in the Intro
  const handleStart = () => {
    if (onStartProp) {
      onStartProp()
    } else {
      setInternalStarted(true)
    }
  }

  // Executed when clicking "Play Again" in the result screen
  const handleReset = () => {
    // 1. Notify the game logic to reset (clear attempts, pick new target)
    onReset()
    
    // 2. Reset isStarted to show the intro card again
    setInternalStarted(false)
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
          playMode={playMode}
          setPlayMode={setPlayMode}
          dailyCompleted={dailyCompleted}
          onStart={handleStart}
          isSettingsLocked={isSettingsLocked}
        />
      ) : (
        /* --- PHASE 2: ACTIVE GAME --- */
        <>
          {/* This is where the specific game (the Cartridge) is injected */}
          {children}

          {/* --- PHASE 3: RESULTS --- 
              Displayed automatically when 'gameOver' is true */}
          {gameOver && (
            <div className={cn("mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500", resultClassName || "game-result-container-v2")}>
              <GameResultCard
                className={cn(won ? "bg-primary/10" : "bg-destructive/10", "game-result-card-v2")}
                title={resultTitle || (won ? "Congratulations!" : "Game Over")}
                thanksMessage={playMode === "daily" ? "Daily Challenge registered!" : "Thanks for playing!"}
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
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {playMode === "daily" ? "Points earned" : "Final Score"}
                    </p>
                  </div>
                )}

                {resultContent}

                {/* Standardized Replay Button or Daily Challenge options */}
                <div className="mt-8 flex flex-col items-center gap-3">
                  {playMode === "practice" ? (
                    <button
                      onClick={handleReset}
                      className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform shadow-lg"
                    >
                      Play Again
                    </button>
                  ) : (
                    <a
                      href="/games"
                      className="px-8 py-3 bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-white rounded-xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all duration-300 shadow-md flex items-center justify-center gap-2 text-center"
                    >
                      Go back to Games
                    </a>
                  )}
                </div>
              </GameResultCard>
            </div>
          )}
        </>
      )}
    </GameLayout>
  )
}
