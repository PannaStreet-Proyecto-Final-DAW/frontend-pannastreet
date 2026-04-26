"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

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

              <div className="flex flex-col md:flex-row gap-8 items-center bg-muted/5 p-4 rounded-2xl border border-border/50 backdrop-blur-sm">
                <div className="flex flex-col gap-4 flex-1 w-full">
                  {setDifficulty && (
                    <div>
                      <p className="text-black dark:text-white text-[11px] font-bold mb-2 uppercase tracking-wider">Select difficulty:</p>
                      <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
                        {["Easy", "Intermediate", "Hard"].map((opt) => (
                          <Button
                            key={opt}
                            variant={difficulty === opt ? "default" : "secondary"}
                            onClick={() => setDifficulty(opt)}
                            className={cn(
                              "rounded-full px-4 h-7 text-[11px] transition-all duration-300",
                              difficulty === opt ? "bg-primary text-primary-foreground shadow-sm" : "bg-primary/10 hover:bg-primary/20 text-black/70 dark:text-white/70"
                            )}
                            size="sm"
                          >
                            {opt}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {setMode && (
                    <div className={cn(setDifficulty && "pt-2 border-t border-border/30")}>
                      <p className="text-black dark:text-white text-[11px] font-bold mb-2 uppercase tracking-wider">Select mode:</p>
                      <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
                        {["Both", "Male", "Female"].map((opt) => (
                          <Button
                            key={opt}
                            variant={mode === opt ? "default" : "secondary"}
                            onClick={() => setMode(opt)}
                            className={cn(
                              "rounded-full px-4 h-7 text-[11px] transition-all duration-300",
                              mode === opt ? "bg-primary text-primary-foreground shadow-sm" : "bg-primary/10 hover:bg-primary/20 text-black/70 dark:text-white/70"
                            )}
                            size="sm"
                          >
                            {opt}
                          </Button>
                        ))}
                      </div>
                    </div>
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
