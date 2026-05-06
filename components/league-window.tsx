"use client"

import { Spinner } from "@/components/ui/spinner"
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
import { LeagueLayout } from "./league-layout"
import { Button } from "@/components/ui/button"
import { Copy, LogOut, Edit2, Trophy, Calendar } from "lucide-react"
import { toast } from "sonner"

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

  const leagueName = selectedLeague.league?.name || `League ${selectedLeague.league?.id?.substring(0, 8) || selectedLeague.id.substring(0, 8)}`
  const inviteCode = selectedLeague.league?.inviteCode || "N/A"

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode)
    toast.success("Invite code copied to clipboard!")
  }

  const handleLeaveLeague = () => {
    // TODO: Implement leave logic in next step
    toast.info("Leave functionality coming soon")
  }

  const handleEditLeague = () => {
    // TODO: Implement edit logic in next step
    toast.info("Edit functionality coming soon")
  }

  return (
    <LeagueLayout
      backOnClick={onBack}
      backText="Back to My Leagues"
      title={leagueName}
      subtitle={
        <div className="flex items-center gap-8 mt-2">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/70 font-black">Members</span>
            <span className="text-base text-foreground font-bold italic tracking-tight leading-none">{leagueMembers.length} Players</span>
          </div>
          {selectedLeague.joinedAt && (
            <div className="flex flex-col gap-1 border-l border-border/50 pl-8">
              <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/70 font-black">Member Since</span>
              <span className="text-sm text-foreground font-bold italic tracking-tight leading-none">
                {new Date(selectedLeague.joinedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
          )}
        </div>
      }
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-card dark:bg-muted/60 border border-border/60 rounded-lg px-3 py-1.5 mr-2 shadow-sm">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mr-3">Invite Code:</span>
            <span className="text-sm font-mono font-bold text-primary mr-3 tracking-tighter">{inviteCode}</span>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleCopyCode}
              className="h-6 w-6 text-muted-foreground hover:text-primary p-0"
              title="Copy code"
            >
              <Copy className="w-3.5 h-3.5" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleEditLeague} className="gap-2 h-9 border-border/60">
              <Edit2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Edit</span>
            </Button>

            <Button variant="destructive" size="sm" onClick={handleLeaveLeague} className="gap-2 h-9">
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Leave</span>
            </Button>
          </div>
        </div>
      }
    >
      <div className="overflow-hidden">
        {isLoadingMembers ? (
          <div className="flex justify-center py-20">
            <Spinner className="h-8 w-8 text-primary" />
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/10 border-b border-border/50">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="text-primary font-bold py-5 pl-8 w-20 text-center uppercase tracking-tighter italic">Rank</TableHead>
                <TableHead className="text-primary font-bold py-5 px-4 uppercase tracking-tighter italic">Player</TableHead>
                <TableHead className="text-primary font-bold text-center py-5 px-4 uppercase tracking-tighter italic">Total Score</TableHead>
                <TableHead className="text-primary font-bold text-center py-5 px-4 uppercase tracking-tighter italic">Weekly Impact</TableHead>
                <TableHead className="text-primary font-bold text-right py-5 pr-8 uppercase tracking-tighter italic">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leagueMembers.length > 0 ? (
                leagueMembers.sort((a, b) => b.score - a.score).map((member, index) => {
                  const isCurrentUser = (member.user?.id || member.userId) === currentUserId
                  return (
                    <TableRow
                      key={member.id}
                      className={cn(
                        "group transition-colors border-border/40",
                        isCurrentUser ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/5"
                      )}
                    >
                      <TableCell className="py-4 pl-8 text-center">
                        <div className={cn(
                          "w-8 h-8 inline-flex items-center justify-center rounded-full text-sm font-black italic",
                          index === 0 ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110" :
                            index === 1 ? "bg-muted-foreground/30 text-card-foreground" :
                              index === 2 ? "bg-muted-foreground/20 text-card-foreground/80" :
                                "bg-muted/20 text-muted-foreground"
                        )}>
                          {index + 1}
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className={cn(
                            "text-base font-bold transition-colors",
                            isCurrentUser ? "text-primary" : "text-foreground group-hover:text-primary/80"
                          )}>
                            {isCurrentUser ? "You" : (member.user?.userName || `User ${(member.user?.id || member.userId || member.id).substring(0, 8)}`)}
                          </span>
                          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                            {isCurrentUser ? "Active Member" : "Challenger"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center py-4 px-4">
                        <span className="text-xl font-black italic text-primary tabular-nums tracking-tighter">
                          {member.score}
                        </span>
                      </TableCell>
                      <TableCell className="text-center py-4 px-4">
                        <div className="inline-flex items-center px-2 py-1 rounded bg-primary/10 text-primary text-[10px] font-black italic uppercase">
                          +{Math.floor(member.score / 10)} PTS
                        </div>
                      </TableCell>
                      <TableCell className="text-right py-4 pr-8 text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
                        {member.joinedAt
                          ? new Date(member.joinedAt).toLocaleDateString(undefined, { month: 'short', year: '2-digit' })
                          : "N/A"}
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20 text-muted-foreground italic">
                    No contenders found in this league yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </LeagueLayout>
  )
}
