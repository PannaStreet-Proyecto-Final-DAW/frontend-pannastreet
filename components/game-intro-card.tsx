"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { DifficultySelector } from "./difficulty-selector"
import { ModeSelector } from "./mode-selector"

interface GameIntroCardProps {
  title: React.ReactNode
  description: React.ReactNode
  image: string
  difficulty?: string
  setDifficulty?: (d: string) => void
  mode?: string
  setMode?: (m: string) => void
  onStart: () => void
  gameId?: string
}

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
        <div className="flex flex-col md:flex-row items-stretch md:items-center">
          <div className="w-full md:w-1/3 aspect-video md:aspect-auto relative flex items-center justify-center p-4 md:p-8 bg-muted/5">
            <div className={cn(
              "absolute inset-0 opacity-10 bg-gradient-to-br from-transparent",
              gameId === "guess-the-player" ? "from-game-1" : "from-primary"
            )} />
            <img
              src={image}
              alt="Game Image"
              className="relative z-10 max-h-full max-w-full object-contain rounded-2xl shadow-2xl"
            />
          </div>
          <div className="p-4 md:p-6 flex-1 flex flex-col justify-center text-center md:text-left">
            <div className="text-3xl font-black italic mb-2 tracking-tighter uppercase">
              {title}
            </div>

            <div className="flex flex-col gap-4">
              <div className="text-[13px] text-black dark:text-white/90 font-medium leading-tight space-y-0.5 text-pretty">
                {description}
              </div>

              <div className="flex flex-col md:flex-row gap-8 items-center bg-muted/5 p-4 rounded-2xl backdrop-blur-sm">
                <div className="flex flex-col gap-4 flex-1 w-full">
                  {setDifficulty && difficulty && (
                    <DifficultySelector
                      value={difficulty}
                      onChange={setDifficulty}
                    />
                  )}

                  {setMode && mode && (
                    <ModeSelector
                      value={mode}
                      onChange={setMode}
                      className={cn(setDifficulty && "pt-2")}
                    />
                  )}
                </div>

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
