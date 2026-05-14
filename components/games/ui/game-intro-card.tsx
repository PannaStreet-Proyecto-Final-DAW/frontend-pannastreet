"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { DifficultySelector } from "../shared/difficulty-selector"
import { ModeSelector } from "../shared/mode-selector"

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
 * Targets a specific layout for iPad Mini Vertical (md) using CSS Grid,
 * while preserving original layouts for Mobile and Desktop (lg).
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
        {/* 
          CONDITIONAL GRID SYSTEM:
          - Default (Mobile): Everything stacked in 1 column.
          - md (Tablet Vertical): Image & Text in row 1, Buttons span full row 2.
          - lg (Desktop): Image spans 2 rows on the left, Text/Buttons on the right.
        */}
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] lg:grid-cols-[1fr_2fr] items-stretch">
          
          {/* 1. IMAGE AREA: Top-left and larger in Tablet, Sidebar in Desktop */}
          <div className="row-start-1 col-start-1 lg:row-span-2 relative flex items-center justify-center p-6 md:p-4 lg:p-10 bg-muted/5 border-b md:border-b-0 md:border-r border-border/20">
            <div className={cn(
              "absolute inset-0 opacity-10 bg-gradient-to-br from-transparent",
              gameId === "guess-the-player" ? "from-game-1" : "from-primary"
            )} />
            <img
              src={image}
              alt="Game Image"
              className="relative z-10 max-h-[120px] md:max-h-[180px] lg:max-h-full max-w-full object-contain rounded-2xl shadow-2xl transition-transform duration-500 hover:scale-105"
            />
          </div>

          {/* 2. INSTRUCTIONS AREA: Always to the right of the image if space allows */}
          <div className="row-start-2 col-start-1 md:row-start-1 md:col-start-2 lg:row-start-1 lg:col-start-2 p-6 md:p-8 lg:p-10 lg:pb-2 flex flex-col justify-center text-center md:text-left">
            <div className="text-3xl lg:text-4xl font-black italic mb-4 tracking-tighter uppercase text-primary">
              {title}
            </div>
            <div className="text-[13px] md:text-sm lg:text-base text-black dark:text-white/90 font-medium leading-relaxed">
              {description}
            </div>
          </div>

          {/* 3. SETTINGS AREA: Spans full width only in Tablet (md) */}
          <div className="row-start-3 col-start-1 md:row-start-2 md:col-span-2 lg:row-start-2 lg:col-start-2 lg:col-span-1 p-6 md:p-8 lg:p-10 pt-0 md:pt-4">
            <div className="flex flex-col lg:flex-row gap-8 items-center bg-muted/5 p-4 md:p-6 rounded-2xl backdrop-blur-sm border border-border/40">
              <div className="flex flex-col gap-4 flex-1 w-full">
                {/* Selectors */}
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

              {/* Start Game Button */}
              <div className="w-full lg:w-auto flex items-center justify-center lg:pr-4">
                <Button
                  onClick={onStart}
                  className="w-full lg:w-[180px] bg-primary text-primary-foreground font-black py-4 rounded-xl text-xs hover:scale-[1.05] transition-transform shadow-lg h-auto uppercase tracking-[0.2em]"
                >
                  Start Game
                </Button>
              </div>
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  )
}
