import { GameCard, type Game } from "@/components/game-card"

const games: Game[] = [
  {
    id: "guess-the-player",
    title: "Guess the Player",
    description: "Test your football intuition by identifying the mystery player from daily clues. You have 6 attempts to solve the puzzle.",
    icon: "guess-the-player",
    color: "from-emerald-500/20 to-emerald-600/10",
    href: "/games/guess-the-player"
  },
  {
    id: "11clubs",
    title: "11 Clubs",
    description: "Build a unique starting 11 using players from eleven different football clubs. Complete the lineup to win the challenge.",
    icon: "lineup",
    color: "from-blue-500/20 to-blue-600/10",
    href: "/games/11clubs"
  },
  {
    id: "trivia",
    title: "Football Trivia",
    description: "Prove your status as a football historian with our daily knowledge test about legends, records, and iconic moments.",
    icon: "trivia",
    color: "from-amber-500/20 to-amber-600/10",
    href: "/games/trivia"
  }
]

export default function GamesPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-foreground mb-2">Daily Football Games</h1>
        <p className="text-muted-foreground">
          Select a game to play and test your football knowledge
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground">
          New challenges every day at midnight
        </p>
      </div>
    </div>
  )
}
