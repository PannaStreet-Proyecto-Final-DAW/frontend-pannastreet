/**
 * GuessesTable: Renders the history of the user's attempts in a table format,
 * providing color-coded visual feedback for each guessed attribute.
 */
"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export type Hint = "correct" | "partial" | "wrong"

/**
 * Represents a single guess attempt with the player's name and the calculated hints.
 */
export interface Guess {
  name: string
  hints: {
    team: Hint
    league: Hint
    nationality: Hint
    position: Hint
    age: "correct" | "higher" | "lower"
  }
}

/**
 * Basic player data structure for comparison.
 */
interface Player {
  name: string
  team: string
  league: string
  nationality: string
  position: string
  age: number
}

interface GuessesTableProps {
  guesses: Guess[] // Array of all attempts made by the user
  players: Player[] // Full list of players to pull display data from
}

export function GuessesTable({ guesses, players }: GuessesTableProps) {
  /**
   * Helper function to determine the CSS color classes based on the hint value.
   * - correct: Green (Primary)
   * - partial: Amber (Used for "almost" matches if applicable)
   * - default/wrong: Grey (Secondary)
   */
  const getHintColor = (hint: Hint | "higher" | "lower") => {
    switch (hint) {
      case "correct":
        return "bg-primary text-primary-foreground"
      case "partial":
        return "bg-amber-500 text-white"
      default:
        return "bg-[#DAE0C9] dark:bg-secondary text-black dark:text-white"
    }
  }

  // Don't render the table if there are no guesses yet
  if (guesses.length === 0) return null

  return (
    <Card className="border-border bg-card mb-6 overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-primary italic uppercase tracking-tighter">
          Your Guesses
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-primary/10">
              <TableRow className="hover:bg-transparent">
                <TableHead className="py-4 px-6 text-[11px] font-black uppercase tracking-widest text-black/60 dark:text-white/60">
                  Player
                </TableHead>
                <TableHead className="py-4 px-4 text-center text-[11px] font-black uppercase tracking-widest text-black/60 dark:text-white/60">
                  Team
                </TableHead>
                <TableHead className="py-4 px-4 text-center text-[11px] font-black uppercase tracking-widest text-black/60 dark:text-white/60">
                  League
                </TableHead>
                <TableHead className="py-4 px-4 text-center text-[11px] font-black uppercase tracking-widest text-black/60 dark:text-white/60">
                  Nationality
                </TableHead>
                <TableHead className="py-4 px-4 text-center text-[11px] font-black uppercase tracking-widest text-black/60 dark:text-white/60">
                  Position
                </TableHead>
                <TableHead className="py-4 px-4 text-center text-[11px] font-black uppercase tracking-widest text-black/60 dark:text-white/60">
                  Age
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Map through each guess and render a row */}
              {guesses.map((guess, index) => {
                // Find the full player details to display team, league, etc.
                const player = players.find((p) => p.name === guess.name)
                if (!player) return null

                return (
                  <TableRow
                    key={index}
                    className="group last:border-0 hover:bg-primary/5 transition-colors duration-300"
                  >
                    <TableCell className="py-4 px-6">
                      <span className="font-bold text-sm text-card-foreground group-hover:text-primary transition-colors">
                        {guess.name}
                      </span>
                    </TableCell>

                    {/* Team Column: Highlighted Green if correct */}
                    <TableCell className="py-4 px-4 text-center">
                      <span className={cn(
                        "inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider min-w-[80px] shadow-sm transition-transform group-hover:scale-105 duration-300",
                        getHintColor(guess.hints.team)
                      )}>
                        {player.team}
                      </span>
                    </TableCell>

                    {/* League Column: Highlighted Green if correct */}
                    <TableCell className="py-4 px-4 text-center">
                      <span className={cn(
                        "inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider min-w-[80px] shadow-sm transition-transform group-hover:scale-105 duration-300",
                        getHintColor(guess.hints.league)
                      )}>
                        {player.league}
                      </span>
                    </TableCell>

                    {/* Nationality Column: Highlighted Green if correct */}
                    <TableCell className="py-4 px-4 text-center">
                      <span className={cn(
                        "inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider min-w-[80px] shadow-sm transition-transform group-hover:scale-105 duration-300",
                        getHintColor(guess.hints.nationality)
                      )}>
                        {player.nationality}
                      </span>
                    </TableCell>

                    {/* Position Column: Highlighted Green if correct */}
                    <TableCell className="py-4 px-4 text-center">
                      <span className={cn(
                        "inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider min-w-[80px] shadow-sm transition-transform group-hover:scale-105 duration-300",
                        getHintColor(guess.hints.position)
                      )}>
                        {player.position}
                      </span>
                    </TableCell>

                    {/* Age Column: Correct color + Arrows to indicate higher/lower */}
                    <TableCell className="py-4 px-4 text-center">
                      <span className={cn(
                        "inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider min-w-[60px] shadow-sm transition-transform group-hover:scale-105 duration-300",
                        getHintColor(guess.hints.age)
                      )}>
                        {player.age}
                        {/* Render UP arrow if the target player is OLDER than the guess */}
                        {guess.hints.age === "higher" && (
                          <svg className="w-3.5 h-3.5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                          </svg>
                        )}
                        {/* Render DOWN arrow if the target player is YOUNGER than the guess */}
                        {guess.hints.age === "lower" && (
                          <svg className="w-3.5 h-3.5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                      </span>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
