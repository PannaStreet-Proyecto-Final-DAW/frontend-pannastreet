"use client"

import { useState, useEffect } from "react"
import { GameCard, type Game } from "@/components/games/ui/game-card"
import { getUserTodayAttempt } from "@/lib/api"

const initialGames: Omit<Game, "completed">[] = [
  {
    id: "guess-the-player",
    title: "Guess the Player",
    description: "Test your football intuition by identifying the mystery player from daily clues. You have 6 attempts to solve the puzzle.",
    icon: "guess-the-player",
    image: "/images/games/guess-the-player.webp",
    color: "from-game-1 to-transparent",
    href: "/games/guess-the-player"
  },
  {
    id: "11clubs",
    title: "11 Clubs",
    description: "Build a unique starting 11 using players from eleven different football clubs. Complete the lineup to win the challenge.",
    icon: "lineup",
    image: "/images/games/11clubs.webp",
    color: "from-game-2 to-transparent",
    href: "/games/11clubs"
  },
  {
    id: "trivia",
    title: "Football Trivia",
    description: "Prove your status as a football historian with our daily knowledge test about legends, records, and iconic moments.",
    icon: "trivia",
    image: "/images/games/trivia.webp",
    color: "from-game-3 to-transparent",
    href: "/games/trivia",
    isComingSoon: true
  }
]

export default function GamesPage() {
  const [completedGames, setCompletedGames] = useState<Record<string, boolean>>({
    "guess-the-player": false,
    "11clubs": false
  })

  useEffect(() => {
    async function fetchCompletedAttempts() {
      try {
        const [gtpAttempt, clubsAttempt] = await Promise.all([
          getUserTodayAttempt("guess-the-player"),
          getUserTodayAttempt("11clubs")
        ])
        setCompletedGames({
          "guess-the-player": !!gtpAttempt,
          "11clubs": !!clubsAttempt
        })
      } catch (err) {
        console.error("Failed to fetch today's game attempts:", err)
      }
    }
    fetchCompletedAttempts()
  }, [])

  return (
    <div className="max-w-4xl mx-auto tablet-v-container">
      <div className="text-center mb-6 md:mb-10 px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 tablet-v-title mobile-games-title">Daily Football Games</h1>
        <p className="text-xs md:text-base text-white/80 font-medium tracking-wide mobile-games-subtitle">
          Select a game to play and test your football knowledge
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 px-2 md:px-0">
        {initialGames.map((game) => (
          <GameCard 
            key={game.id} 
            game={{
              ...game,
              completed: completedGames[game.id] || false
            } as Game} 
          />
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-white font-medium mobile-games-footer-text">
          New challenges every day at midnight
        </p>
      </div>
    </div>
  )
}


