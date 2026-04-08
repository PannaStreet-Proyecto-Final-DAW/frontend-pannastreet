import { GameCard, type Game } from "@/components/game-card"

const games: Game[] = [
  {
    id: "guess-the-player",
    title: "Guess the Player",
    description: "Test your football intuition by identifying the mystery player from daily clues. You have 6 attempts to solve the puzzle.",
    icon: "guess-the-player",
    image: "/images/games/guess-the-player.png",
    color: "from-game-1 to-transparent",
    href: "/games/guess-the-player"
  },
  {
    id: "11clubs",
    title: "11 Clubs",
    description: "Build a unique starting 11 using players from eleven different football clubs. Complete the lineup to win the challenge.",
    icon: "lineup",
    image: "/images/games/11clubs.png",
    color: "from-game-2 to-transparent",
    href: "/games/11clubs"
  },
  {
    id: "trivia",
    title: "Football Trivia",
    description: "Prove your status as a football historian with our daily knowledge test about legends, records, and iconic moments.",
    icon: "trivia",
    image: "/images/games/trivia.png",
    color: "from-game-3 to-transparent",
    href: "/games/trivia"
  }
]

export default function GamesPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-foreground mb-2">Daily Football Games</h1>
        <p className="text-foreground/80 font-medium tracking-wide">
          Select a game to play and test your football knowledge
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-foreground/80 font-medium">
          New challenges every day at midnight
        </p>
      </div>
    </div>
  )
}

