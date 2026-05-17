/**
 * GameIntroCard: The initial screen for every game, displaying rules,
 * image, and settings (difficulty/mode) before the game starts.
 */
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { DifficultySelector } from "../shared/difficulty-selector"
import { ModeSelector } from "../shared/mode-selector"
import { PlayModeSelector } from "../shared/play-mode-selector"

interface GameIntroCardProps {
  title: React.ReactNode      // Title of the game (can include HTML tags)
  description: React.ReactNode // Detailed rules or description
  image: string               // Path to the game's image
  difficulty?: string         // Current difficulty setting
  setDifficulty?: (d: string) => void // Function to update difficulty
  mode?: string               // Current game mode
  setMode?: (m: string) => void // Function to update mode
  playMode?: "practice" | "daily"
  setPlayMode?: (v: "practice" | "daily") => void
  dailyCompleted?: boolean
  onStart: () => void         // Function triggered to begin the game
  gameId?: string             // Identifier for specific game styling
  isSettingsLocked?: boolean  // Lock settings if a daily challenge has started
}

/**
 * A reusable intro card for all games.
 * It displays instructions and allows users to configure settings before starting.
 */
export function GameIntroCard({
  title,
  description,
  image,
  difficulty,
  setDifficulty,
  mode,
  setMode,
  playMode,
  setPlayMode,
  dailyCompleted = false,
  onStart,
  gameId,
  isSettingsLocked = false
}: GameIntroCardProps) {
  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardContent className="p-0">
        {/* Main Layout: Grid/Flex depending on device */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center game-intro-main-layout">

          {/* Left/Top Section: Game Image */}
          <div className="w-full md:w-1/3 aspect-[21/9] md:aspect-auto relative flex items-center justify-center p-6 md:p-8 game-intro-image-container-v2">
            <img
              src={image}
              alt="Game Image"
              className="relative z-10 max-h-[120px] md:max-h-[220px] max-w-full object-contain rounded-2xl shadow-2xl transition-transform duration-500 hover:scale-110"
            />
          </div>

          {/* Right Section: Content and Settings */}
          <div className="p-4 md:p-6 tablet-ls-card-padding flex-1 flex flex-col justify-center text-center md:text-left game-intro-info-block">
            <div className="game-intro-text-header">
              <div className="text-3xl font-black italic mb-2 tracking-tighter uppercase">
                {title}
              </div>

              <div className="text-[13px] text-black dark:text-white/90 font-medium leading-tight space-y-0.5 text-pretty mb-4">
                {description}
              </div>
            </div>

            {/* Settings Panel */}
            <div className="flex flex-col gap-6 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/30 border border-neutral-100 dark:border-neutral-800 game-intro-footer-v2">
                {setPlayMode && playMode && (
                  <div className="w-full">
                    <PlayModeSelector
                      value={playMode}
                      onChange={setPlayMode}
                      dailyCompleted={dailyCompleted}
                    />
                  </div>
                )}

                <div className="flex flex-col md:flex-row gap-6 items-center w-full">
                  <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full game-intro-selectors-grid-v2">
                    {setDifficulty && difficulty && (
                      <DifficultySelector
                        value={difficulty}
                        onChange={setDifficulty}
                        disabled={isSettingsLocked}
                      />
                    )}

                    {setMode && mode && (
                      <ModeSelector
                        value={mode}
                        onChange={setMode}
                        disabled={isSettingsLocked}
                      />
                    )}
                  </div>

                  {/* Start Game Button */}
                  <div className="w-full md:w-auto flex items-center justify-center game-intro-btn-v2">
                    <Button
                      onClick={onStart}
                      disabled={playMode === "daily" && dailyCompleted}
                      className={cn(
                        "w-full md:w-[180px] text-primary-foreground font-black py-4 rounded-xl text-xs transition-all duration-300 shadow-lg h-auto uppercase tracking-[0.2em]",
                        playMode === "daily" && dailyCompleted
                          ? "bg-neutral-300 dark:bg-neutral-800 text-neutral-500 cursor-not-allowed shadow-none"
                          : "bg-primary hover:scale-[1.05]"
                      )}
                    >
                      {playMode === "daily" && dailyCompleted 
                        ? "Completed" 
                        : (playMode === "daily" && isSettingsLocked 
                          ? "Continue Game" 
                          : "Start Game")}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </CardContent>
    </Card>
  )
}
