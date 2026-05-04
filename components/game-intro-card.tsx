/**
 * GameIntroCard: The initial screen for every game, displaying rules,
 * image, and settings (difficulty/mode) before the game starts.
 */
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { DifficultySelector } from "./difficulty-selector"
import { ModeSelector } from "./mode-selector"

interface GameIntroCardProps {
  title: React.ReactNode      // Title of the game (can include HTML tags)
  description: React.ReactNode // Detailed rules or description
  image: string               // Path to the game's image
  difficulty?: string         // Current difficulty setting
  setDifficulty?: (d: string) => void // Function to update difficulty
  mode?: string               // Current game mode
  setMode?: (m: string) => void // Function to update mode
  onStart: () => void         // Function triggered to begin the game
  gameId?: string             // Identifier for specific game styling
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
  onStart,
  gameId
}: GameIntroCardProps) {
  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardContent className="p-0">
        {/* Responsive layout: Column on mobile, Row on desktop */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center">

          {/* Left/Top Section: Game Image and Background Gradient */}
          <div className="w-full md:w-1/3 aspect-video md:aspect-auto relative flex items-center justify-center p-4 md:p-8 bg-muted/5">
            <div className={cn(
              "absolute inset-0 opacity-10 bg-gradient-to-br from-transparent",
              // Conditional gradient color based on the gameId
              gameId === "guess-the-player" ? "from-game-1" : "from-primary"
            )} />
            <img
              src={image}
              alt="Game Image"
              className="relative z-10 max-h-full max-w-full object-contain rounded-2xl shadow-2xl"
            />
          </div>

          {/* Right/Bottom Section: Content and Settings */}
          <div className="p-4 md:p-6 flex-1 flex flex-col justify-center text-center md:text-left">
            <div className="text-3xl font-black italic mb-2 tracking-tighter uppercase">
              {title}
            </div>

            <div className="flex flex-col gap-4">
              {/* Game description/rules area */}
              <div className="text-[13px] text-black dark:text-white/90 font-medium leading-tight space-y-0.5 text-pretty">
                {description}
              </div>

              {/* Settings Panel: Contains difficulty and mode selectors */}
              <div className="flex flex-col md:flex-row gap-8 items-center bg-muted/5 p-4 rounded-2xl backdrop-blur-sm">
                <div className="flex flex-col gap-4 flex-1 w-full">
                  {/* Only render DifficultySelector if props are provided */}
                  {setDifficulty && difficulty && (
                    <DifficultySelector
                      value={difficulty}
                      onChange={setDifficulty}
                    />
                  )}

                  {/* Only render ModeSelector if props are provided */}
                  {setMode && mode && (
                    <ModeSelector
                      value={mode}
                      onChange={setMode}
                      className={cn(setDifficulty && "pt-2")}
                    />
                  )}
                </div>

                {/* Start Game Button: Updates isStarted state in the parent page */}
                <div className="w-full md:w-auto flex items-center justify-center md:pr-4">
                  <Button
                    onClick={onStart}
                    className="w-full md:w-[180px] bg-primary text-primary-foreground font-black py-4 rounded-xl text-xs hover:scale-[1.05] transition-transform shadow-lg h-auto uppercase tracking-[0.2em]"
                  >
                    Start Game
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
