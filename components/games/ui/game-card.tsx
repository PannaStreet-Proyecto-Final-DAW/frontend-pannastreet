"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export interface Game {
  id: string
  title: string
  description: string
  icon: "guess-the-player" | "lineup" | "trivia"
  image: string
  color: string
  href: string
  isComingSoon?: boolean
}

const icons = {
  "guess-the-player": (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="5" height="5" rx="1" className="fill-primary/30" />
      <rect x="9.5" y="3" width="5" height="5" rx="1" />
      <rect x="16" y="3" width="5" height="5" rx="1" />
      <rect x="3" y="9.5" width="5" height="5" rx="1" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="1" className="fill-primary/30" />
      <rect x="16" y="9.5" width="5" height="5" rx="1" />
      <rect x="3" y="16" width="5" height="5" rx="1" />
      <rect x="9.5" y="16" width="5" height="5" rx="1" />
      <rect x="16" y="16" width="5" height="5" rx="1" className="fill-primary/30" />
    </svg>
  ),
  lineup: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="2" />
      <line x1="12" y1="2" x2="12" y2="22" />
      <circle cx="6" cy="8" r="1.5" className="fill-primary" />
      <circle cx="6" cy="12" r="1.5" className="fill-primary" />
      <circle cx="6" cy="16" r="1.5" className="fill-primary" />
      <circle cx="10" cy="6" r="1.5" className="fill-primary" />
      <circle cx="10" cy="18" r="1.5" className="fill-primary" />
      <circle cx="14" cy="8" r="1.5" className="fill-primary" />
      <circle cx="14" cy="12" r="1.5" className="fill-primary" />
      <circle cx="14" cy="16" r="1.5" className="fill-primary" />
      <circle cx="18" cy="10" r="1.5" className="fill-primary" />
      <circle cx="18" cy="14" r="1.5" className="fill-primary" />
      <circle cx="3" cy="12" r="1.5" className="fill-amber-500" />
    </svg>
  ),
  trivia: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
      <circle cx="12" cy="17" r="0.5" className="fill-primary" />
    </svg>
  )
}

export function GameCard({ game }: { game: Game }) {
  const CardWrapper = game.isComingSoon ? "div" : Link;
  const wrapperProps = game.isComingSoon ? {} : { href: game.href };

  return (
    <CardWrapper {...(wrapperProps as any)} className={cn("block group", game.isComingSoon && "cursor-default")}>
      <Card className={cn(
        "relative overflow-hidden border-border bg-card transition-all duration-500",
        "hover:border-primary hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:shadow-primary/40 hover:-translate-y-3"
      )}>
        <div className={cn(
          "relative aspect-[2/1] md:aspect-[16/10] overflow-hidden border-b border-border flex items-center justify-center p-2 md:p-6 bg-muted/5 tablet-v-image-container",
          game.isComingSoon && "filter blur-md"
        )}>
          {/* Subtle background glow */}
          <div className={cn(
            "absolute inset-0 opacity-20 bg-gradient-to-br",
            game.color
          )} />

          <img
            src={game.image}
            alt={game.title}
            className={cn(
              "relative z-10 max-h-full max-w-full object-contain rounded-xl shadow-2xl transition-transform duration-500 tablet-v-image",
              "group-hover:scale-110"
            )}
          />

          {game.isComingSoon && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20" />
          )}
        </div>

        {/* Overlaid Coming Soon Badge - OUTSIDE the blurred container if possible, 
            but in current structure it's better to put it here and ensure it has no blur */}
        {game.isComingSoon && (
          <div className="absolute inset-x-0 top-[55%] md:top-1/2 -translate-y-1/2 z-30 flex items-center justify-center pointer-events-none px-2">
            <span className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-[9px] md:text-xs font-black tracking-[0.1em] md:tracking-[0.2em] uppercase shadow-2xl border border-primary/50 backdrop-blur-md text-center leading-tight whitespace-nowrap">
              Coming Soon
            </span>
          </div>
        )}

        <CardHeader className="relative pt-0.5 md:pt-1 pb-0 px-3 md:px-6 tablet-v-card-header">
          <CardTitle className={cn(
            "text-base md:text-xl text-card-foreground transition-colors text-center tablet-v-card-title",
            !game.isComingSoon && "group-hover:text-primary",
            game.isComingSoon && "opacity-40 blur-sm"
          )}>
            {game.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="relative pt-0 md:pt-0 pb-3 md:pb-6 px-3 md:px-6 tablet-v-card-content">
          <CardDescription className={cn(
            "text-xs md:text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2 md:line-clamp-none transition-colors text-center md:text-left tablet-v-card-description",
            game.isComingSoon && "opacity-40 blur-sm"
          )}>
            {game.description}
          </CardDescription>
          <div className={cn(
            "mt-2 md:mt-4 flex items-center justify-center text-[10px] md:text-sm font-bold uppercase tracking-wider transition-colors tablet-v-play-btn",
            game.isComingSoon ? "text-primary opacity-40 blur-sm" : "text-primary"
          )}>
            {game.isComingSoon ? "Coming Soon" : "Play now"}
            {!game.isComingSoon && (
              <svg
                className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            )}
          </div>
        </CardContent>

      </Card>
    </CardWrapper>
  )
}

