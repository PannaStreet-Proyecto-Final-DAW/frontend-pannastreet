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
  return (
    <Link href={game.href} className="block group">
      <Card className={cn(
        "relative overflow-hidden border-border bg-card transition-all duration-500",
        "hover:border-primary/50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:shadow-primary/20",
        "hover:-translate-y-3"
      )}>
        <div className={cn(
          "relative aspect-[16/10] overflow-hidden border-b border-border bg-gradient-to-br",
          game.color
        )}>
          <img
            src={game.image}
            alt={game.title}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <CardHeader className="relative pt-4 pb-2">
          <CardTitle className="text-xl text-card-foreground group-hover:text-primary transition-colors">
            {game.title}
          </CardTitle>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
              Daily Game
            </span>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <CardDescription className="text-neutral-600 dark:text-neutral-300 line-clamp-2 transition-colors">
            {game.description}
          </CardDescription>
          <div className="mt-4 flex items-center text-sm text-primary font-medium">
            Play now
            <svg
              className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
