"use client"

import { Spinner } from "@/components/ui/spinner"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { type UserLeagueMembership } from "@/lib/api"

import { GameLayout } from "./game-layout"

interface LeagueWindowProps {
  selectedLeague: UserLeagueMembership
  leagueMembers: UserLeagueMembership[]
  isLoadingMembers: boolean
  onBack: () => void
  currentUserId?: string
}

export function LeagueWindow({
  selectedLeague,
  leagueMembers,
  isLoadingMembers,
  onBack,
  currentUserId
}: LeagueWindowProps) {
  return (
    <GameLayout
      backOnClick={onBack}
      backText="Back to Leagues"
    >
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-4">
          <div className="flex items-center gap-3 pb-2">
            <h2 className="text-3xl font-black italic tracking-tighter uppercase text-primary">
              {selectedLeague.league?.name}
            </h2>
            <button className="text-muted-foreground hover:text-primary transition-colors opacity-50 cursor-default" title="Edit league">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
        </div>

        <Card className="border-border bg-card mt-4 overflow-hidden">
          {isLoadingMembers ? (
            <div className="flex justify-center py-20">
              <Spinner className="h-8 w-8 text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/5">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="text-primary font-bold py-4 pl-10 w-16 text-center">Rank</TableHead>
                  <TableHead className="text-primary font-bold py-4 px-4">Name</TableHead>
                  <TableHead className="text-primary font-bold text-center py-4 px-4">Total Score</TableHead>
                  <TableHead className="text-primary font-bold text-center py-4 px-4">Today's Score</TableHead>
                  <TableHead className="text-primary font-bold text-right py-4 pr-10">Join Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leagueMembers.length > 0 ? (
                  leagueMembers.sort((a, b) => b.score - a.score).map((member, index) => (
                    <TableRow
                      key={member.id}
                      className="hover:bg-muted/5 transition-colors"
                    >
                      <TableCell className="py-4 pl-10 text-center">
                        <span className="text-xs font-bold text-muted-foreground bg-muted/20 w-6 h-6 inline-flex items-center justify-center rounded-full">
                          {index + 1}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium py-4 px-4">
                        <span className={cn(
                          "text-base",
                          member.userId === currentUserId ? "text-primary font-bold" : "text-card-foreground"
                        )}>
                          {member.userId === currentUserId ? "You" : `User ${member.userId.substring(0, 8)}`}
                        </span>
                      </TableCell>
                      <TableCell className="text-center font-bold text-primary py-4 text-lg px-4">{member.score}</TableCell>
                      <TableCell className="text-center text-primary/80 py-4 font-medium px-4">
                        +{Math.floor(member.score / 10)}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground py-4 text-sm pr-10">
                        {new Date(member.joinedAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                      No members found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </GameLayout>
  )
}
