/**
 * GuessesTable: Renders the history of the user's attempts in a table format,
 * providing color-coded visual feedback for each guessed attribute.
 */
"use client"

import React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Player, Guess, Hint } from "@/types"
import { getCountryCode } from "@/lib/country-mapper"
import * as Flags from 'country-flag-icons/react/3x2'

interface GuessesTableProps {
  guesses: Guess[] // Array of all attempts made by the user
  players: Player[] // Full list of players to pull display data from
  teamCrests?: Record<string, string | null> // Map of team names to crest URLs
  leagueLogos?: Record<string, string | null> // Map of league names to logo URLs
}

export const GuessesTable = React.memo(function GuessesTable({ guesses, players, teamCrests = {}, leagueLogos = {} }: GuessesTableProps) {
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
        return "bg-yellow-100 text-black"
      default:
        return "bg-[#DAE0C9] dark:bg-secondary text-black dark:text-white"
    }
  }

  // Helper to abbreviate positions for space optimization
  const abbreviatePosition = (pos: string) => {
    if (!pos) return "??";
    const p = pos.toUpperCase();
    if (p === "GOALKEEPER") return "GK";
    if (p === "DEFENDER") return "DF";
    if (p === "MIDFIELDER") return "MD";
    if (p === "FORWARD") return "FW";
    return p.substring(0, 2);
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
          <Table className="guesses-table-v2">
            <TableHeader className="bg-primary/10">
              <TableRow className="hover:bg-transparent">
                <TableHead className="py-4 px-2 sm:px-6 text-[11px] font-black uppercase tracking-widest text-black/60 dark:text-white/60">
                  Player
                </TableHead>
                <TableHead className="py-4 px-2 sm:px-4 text-center text-[11px] font-black uppercase tracking-widest text-black/60 dark:text-white/60">
                  Team
                </TableHead>
                <TableHead className="py-4 px-2 sm:px-4 text-center text-[11px] font-black uppercase tracking-widest text-black/60 dark:text-white/60">
                  League
                </TableHead>
                <TableHead className="py-4 px-2 sm:px-4 text-center text-[11px] font-black uppercase tracking-widest text-black/60 dark:text-white/60">
                  Country
                </TableHead>
                <TableHead className="py-4 px-2 sm:px-4 text-center text-[11px] font-black uppercase tracking-widest text-black/60 dark:text-white/60">
                  Position
                </TableHead>
                <TableHead className="py-4 px-2 sm:px-4 text-center text-[11px] font-black uppercase tracking-widest text-black/60 dark:text-white/60">
                  Age
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Map through each guess and render a row */}
              {guesses.map((guess, index) => {
                // Find the full player details using unique ID to distinguish homonyms
                const player = players.find((p) => p.id === guess.id)
                if (!player) return null

                return (
                  <TableRow
                    key={index}
                    className="group last:border-0 hover:bg-primary/5 transition-colors duration-300"
                  >
                    <TableCell className="py-4 px-2 sm:px-6">
                      <div className={cn(
                        "flex flex-col sm:block font-bold text-[12px] sm:text-sm transition-all duration-300",
                        guess.isCorrect 
                          ? "bg-primary text-black px-3 py-2 rounded-lg shadow-sm text-center" 
                          : "text-card-foreground group-hover:text-primary transition-colors leading-tight"
                      )}>
                        {guess.name.split(' ').map((part, i) => (
                          <span key={i} className="block sm:inline sm:mr-1 last:mr-0">{part}</span>
                        ))}
                      </div>
                    </TableCell>

                    {/* Team Column: Highlighted Green if correct */}
                    <TableCell className="py-4 px-2 sm:px-4 text-center">
                      <span className={cn(
                        "inline-flex items-center justify-center rounded-lg shadow-sm transition-transform group-hover:scale-105 duration-300",
                        getHintColor(guess.hints.team),
                        teamCrests[player.team.trim().toLowerCase()] ? "p-1 min-w-[40px] h-[40px]" : "px-3 py-1.5 text-[10px] font-black uppercase tracking-wider min-w-[80px]"
                      )}>
                        {teamCrests[player.team.trim().toLowerCase()] ? (
                          <img
                            src={teamCrests[player.team.trim().toLowerCase()]!}
                            alt={player.team}
                            className="w-8 h-8 object-contain"
                            onError={(e) => {
                              console.log("Error loading crest for:", player.team);
                              (e.target as any).style.display = 'none';
                              (e.target as any).parentElement.innerText = player.team;
                            }}
                          />
                        ) : (
                          <span className="text-[10px] font-bold">{player.team}</span>
                        )}
                      </span>
                    </TableCell>

                    {/* League Column: Highlighted Green if correct */}
                    <TableCell className="py-4 px-2 sm:px-4 text-center">
                      <span className={cn(
                        "inline-flex items-center justify-center gap-2 px-1.5 sm:px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider min-w-[40px] sm:min-w-[80px] shadow-sm transition-transform group-hover:scale-105 duration-300",
                        getHintColor(guess.hints.league)
                      )}>
                        {(() => {
                          const leagueName = player.league?.trim().toLowerCase();
                          const leagueLogo = leagueLogos[leagueName];
                          return leagueLogo ? (
                            <>
                              <img src={leagueLogo} alt={player.league} className="w-5 h-5 sm:w-4 sm:h-4 object-contain" />
                              <span className="hidden sm:inline">{player.league}</span>
                            </>
                          ) : (
                            <span>{player.league}</span>
                          );
                        })()}
                      </span>
                    </TableCell>

                    {/* Country Column: Highlighted Green if correct */}
                    <TableCell className="py-4 px-2 sm:px-4 text-center">
                      <span className={cn(
                        "inline-flex items-center justify-center gap-2 px-1.5 sm:px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider min-w-[40px] sm:min-w-[80px] shadow-sm transition-transform group-hover:scale-105 duration-300",
                        getHintColor(guess.hints.nationality)
                      )}>
                        {(() => {
                          const isoCode = getCountryCode(player.nationality);
                          const Flag = isoCode ? (Flags as any)[isoCode] : null;
                          return Flag ? (
                            <>
                              <Flag className="w-6 h-4 sm:w-4 sm:h-3 rounded-sm shadow-sm" />
                              <span className="hidden sm:inline">{player.nationality}</span>
                            </>
                          ) : (
                            <span>{player.nationality}</span>
                          );
                        })()}
                      </span>
                    </TableCell>

                    {/* Position Column: Highlighted Green if correct */}
                    <TableCell className="py-4 px-2 sm:px-4 text-center">
                      <span className={cn(
                        "inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider min-w-[40px] shadow-sm transition-transform group-hover:scale-105 duration-300",
                        getHintColor(guess.hints.position)
                      )}>
                        {abbreviatePosition(player.generalPosition)}
                      </span>
                    </TableCell>

                    {/* Age Column: Correct color + Arrows to indicate higher/lower */}
                    <TableCell className="py-4 px-2 sm:px-4 text-center">
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
})
