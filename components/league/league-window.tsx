"use client"

import { useState } from "react"

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
import { deleteMembership, updateUserLeague, type UserLeagueMembership } from "@/lib/api"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { LeagueLayout } from "./league-layout"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Copy, LogOut, Edit2, Trophy, Calendar } from "lucide-react"
import { toast } from "sonner"

interface LeagueWindowProps {
  selectedLeague: UserLeagueMembership
  leagueMembers: UserLeagueMembership[]
  isLoadingMembers: boolean
  onBack: () => void
  currentUserId?: string
}

/**
 * LeagueWindow Component
 * 
 * This component displays the detailed view of a specific league, including:
 * 1. A leaderboard showing all members and their scores.
 * 2. Administrative actions like renaming the league (if owner/logic allows).
 * 3. An invitation system via invite codes.
 * 4. The ability to leave the league.
 */
export function LeagueWindow({
  selectedLeague,
  leagueMembers,
  isLoadingMembers,
  onBack,
  currentUserId
}: LeagueWindowProps) {

  /**
   * League Identification: Resolve the display name from the membership object.
   * Falls back to a truncated ID if the name is not present.
   */
  const leagueName = selectedLeague.league?.name || `League ${selectedLeague.league?.id?.substring(0, 8) || selectedLeague.id.substring(0, 8)}`
  
  // Invite Code: Used for sharing the league with other players.
  const inviteCode = selectedLeague.league?.inviteCode || "N/A"

  /**
   * handleCopyCode: Helper to copy the invitation code to the user's clipboard.
   * Provides visual feedback via a toast notification.
   */
  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode)
    toast.success("Invite code copied to clipboard!")
  }

  // --- Leave League State ---
  // isLeaving: Local loading state to prevent double-clicks during the leave process.
  const [isLeaving, setIsLeaving] = useState(false)

  /**
   * handleLeaveLeague: Initiates the "Leave League" process.
   * This action removes the user's membership from the current league.
   * Upon successful removal, it returns the user to the "My Leagues" dashboard.
   */
  const handleLeaveLeague = async () => {
    setIsLeaving(true)
    try {
      // Call the API to delete the specific membership record
      await deleteMembership(selectedLeague.id)
      toast.success(`You have left the league`)

      // onBack is passed from the parent component (LeagueCode.tsx) to return to the list view
      onBack()
    } catch {
      toast.error("Failed to leave league")
    } finally {
      setIsLeaving(false)
    }
  }

  // --- Edit League Name States ---
  // editedName: Tracks the value of the name input in the edit dialog.
  const [editedName, setEditedName] = useState(leagueName)
  
  // isUpdating: Loading state for the rename API request.
  const [isUpdating, setIsUpdating] = useState(false)
  
  // editDialogOpen: Controls the visibility of the rename modal.
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  /**
   * handleUpdateLeague: Manages the league renaming process.
   * It performs basic validation to ensure the name has actually changed
   * and isn't just whitespace. After a successful API call, it performs
   * a "local state update" to the current object to avoid a full page refresh.
   */
  const handleUpdateLeague = async (e: React.FormEvent) => {
    e.preventDefault()

    // Prevent redundant API calls if nothing changed
    if (!editedName.trim() || editedName === leagueName) {
      setEditDialogOpen(false)
      return
    }

    const currentLeagueId = selectedLeague.league?.id || selectedLeague.leagueId
    if (!currentLeagueId) return

    setIsUpdating(true)
    try {
      // PATCH request to update the league name in the database
      await updateUserLeague(currentLeagueId, editedName)
      toast.success("League name updated successfully")
      setEditDialogOpen(false)

      /**
       * Manual state update: We update the local reference to the name 
       * so the UI reflects the change immediately without a full reload.
       */
      if (selectedLeague.league) {
        selectedLeague.league.name = editedName
      }
    } catch {
      toast.error("Failed to update league name")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <LeagueLayout
      backOnClick={onBack}
      backText="Back to My Leagues"
      title={leagueName}
      subtitle={
        // Header Meta Data: Shows player count and join date.
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-1">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-[0.15em] text-black/50 dark:text-muted-foreground/70 font-black">Members</span>
            <span className="text-base text-black dark:text-foreground font-bold italic tracking-tight leading-none">{leagueMembers.length} Players</span>
          </div>
          {selectedLeague.joinedAt && (
            <div className="flex flex-col gap-1 border-l border-black/10 dark:border-border/50 pl-8">
              <span className="text-[10px] uppercase tracking-[0.15em] text-black/50 dark:text-muted-foreground/70 font-black">Member Since</span>
              <span className="text-sm text-black dark:text-foreground font-bold italic tracking-tight leading-none">
                {new Date(selectedLeague.joinedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
          )}
        </div>
      }
      actions={
        // Action Toolbar: Group of buttons for managing the league.
        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* --- INVITE CODE SECTION --- */}
          <div className="flex items-center bg-card dark:bg-muted/60 border border-border/60 rounded-lg px-2 py-1 shadow-sm">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mr-3">Invite Code:</span>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary/10 px-2"
                >
                  Show
                </Button>
              </DialogTrigger>
              {/* Detailed Invite Modal */}
              <DialogContent className="bg-white dark:bg-gradient-to-br dark:from-[#071a0c] dark:to-[#030d05] border-border/30 text-black dark:text-popover-foreground sm:max-w-[600px] shadow-2xl p-0 rounded-[2.5rem] overflow-hidden border">
                <div className="relative p-10 flex flex-col items-center text-center gap-8">
                  {/* Visual Flourish */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 blur-[80px] rounded-full" />

                  <DialogHeader className="space-y-3 relative z-10">
                    <DialogTitle className="text-primary font-black italic tracking-tighter uppercase text-3xl md:text-4xl leading-none">
                      League Invite Code
                    </DialogTitle>
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-[1px] w-8 bg-primary/30" />
                      <DialogDescription className="text-black/40 dark:text-muted-foreground/60 text-[10px] uppercase tracking-[0.3em] font-black">
                        Exclusive Access Token
                      </DialogDescription>
                      <div className="h-[1px] w-8 bg-primary/30" />
                    </div>
                  </DialogHeader>

                  {/* Copy-to-Clipboard Field */}
                  <div className="w-full max-md bg-black/5 dark:bg-black/30 backdrop-blur-md p-8 rounded-3xl flex flex-col items-center gap-6 border border-black/5 dark:border-white/5 relative z-10">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[9px] uppercase tracking-widest text-muted-foreground/60 font-black">Your Code</span>
                      <code className="font-mono font-black text-xl tracking-[0.3em] text-primary uppercase">
                        {inviteCode}
                      </code>
                    </div>

                    <Button
                      onClick={handleCopyCode}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-black italic uppercase text-xs tracking-wider h-11 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Invitation
                    </Button>
                  </div>

                  <p className="text-[11px] text-black/60 dark:text-muted-foreground/80 font-medium leading-relaxed max-w-[240px]">
                    Invite your rivals to join <span className="text-black dark:text-foreground font-bold italic">"{leagueName}"</span> and start the competition.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex items-center gap-2">
            {/* --- RENAME LEAGUE ACTION --- */}
            <Dialog open={editDialogOpen} onOpenChange={(open) => {
              setEditDialogOpen(open)
              if (!open) {
                setEditedName(leagueName)
              }
            }}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 h-9 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Edit</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white dark:bg-[#071a0c] border-border/30 rounded-[2rem] p-8 max-w-[450px]">
                <DialogHeader className="space-y-3">
                  <DialogTitle className="text-primary font-black italic uppercase text-2xl tracking-tight leading-none">
                    Rename League
                  </DialogTitle>
                  <DialogDescription className="text-black/60 dark:text-muted-foreground font-medium text-sm">
                    Enter a new name for your competitive arena.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleUpdateLeague} className="mt-4 space-y-6">
                  <Field>
                    <FieldLabel className="text-[10px] uppercase tracking-widest font-black text-primary/70">New League Name</FieldLabel>
                    <Input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="bg-black/5 dark:bg-black/20 border-border/40 h-12 rounded-xl text-lg font-bold italic text-black dark:text-foreground"
                      placeholder="e.g. Pro Champions League"
                      autoFocus
                    />
                  </Field>
                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setEditDialogOpen(false)}
                      className="flex-1 rounded-xl font-bold uppercase text-[10px] tracking-widest border border-black/10 dark:border-border/20 text-black/60 dark:text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isUpdating || !editedName.trim()}
                      className="flex-[2] bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-black italic uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                    >
                      {isUpdating ? "Updating..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            {/* --- LEAVE LEAGUE ACTION --- */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={isLeaving}
                  className="gap-2 h-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isLeaving ? "Leaving..." : "Leave"}</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white dark:bg-[#071a0c] border-border/30 rounded-[2rem] p-8 max-w-[400px]">
                <AlertDialogHeader className="space-y-3 text-center sm:text-left">
                  <AlertDialogTitle className="text-black dark:text-foreground font-black italic uppercase text-2xl tracking-tight leading-none">
                    Leave League?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-black/60 dark:text-muted-foreground font-medium text-sm leading-relaxed">
                    Are you sure you want to leave <span className="text-black dark:text-foreground font-bold italic">"{leagueName}"</span>?
                    Your scores and progress will be permanently lost.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-6 gap-3">
                  <AlertDialogCancel className="bg-transparent dark:bg-transparent border-black/10 dark:border-border/50 text-black/60 dark:text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 rounded-xl font-bold uppercase text-[10px] tracking-widest px-6 h-10 transition-colors">
                    Stay in
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleLeaveLeague}
                    className="bg-destructive/80 text-destructive-foreground hover:bg-destructive rounded-xl font-black italic uppercase text-[10px] tracking-widest px-6"
                  >
                    Confirm Leave
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      }
    >
      {/* --- MAIN LEADERBOARD TABLE --- */}
      <div className="overflow-hidden">
        {isLoadingMembers ? (
          /* Loading State Spinner */
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
                <TableHead className="text-primary font-bold text-center py-5 px-4 uppercase tracking-tighter italic">Daily Score</TableHead>
                <TableHead className="text-primary font-bold text-right py-5 pr-8 uppercase tracking-tighter italic">Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leagueMembers.length > 0 ? (
                /**
                 * Ranking Logic: We sort members by score descending.
                 * Then map them to table rows with appropriate rank styling.
                 */
                [...leagueMembers].sort((a, b) => b.score - a.score).map((member, index) => {
                  const isCurrentUser = (member.user?.id || member.userId) === currentUserId
                  return (
                    <TableRow
                      key={member.id}
                      className={cn(
                        "group transition-colors border-border/40",
                        isCurrentUser ? "bg-primary/20 hover:bg-primary/30" : "hover:bg-primary/10 dark:hover:bg-white/5"
                      )}
                    >
                      {/* Rank Indicator: Visual medals for top 3 players */}
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
                      
                      {/* Player Identity Cell */}
                      <TableCell className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className={cn(
                            "text-base font-bold transition-colors",
                            isCurrentUser ? "text-primary" : "text-black dark:text-foreground"
                          )}>
                            {isCurrentUser ? "You" : (member.user?.userName || `User ${(member.user?.id || member.userId || member.id).substring(0, 8)}`)}
                          </span>
                          <span className="text-[10px] uppercase tracking-widest text-black/40 dark:text-muted-foreground font-medium">
                            {isCurrentUser ? "Active Member" : "Challenger"}
                          </span>
                        </div>
                      </TableCell>
                      
                      {/* Score Cell */}
                      <TableCell className="text-center py-4 px-4">
                        <span className="text-xl font-black italic text-primary tabular-nums tracking-tighter">
                          {member.score}
                        </span>
                      </TableCell>
                      
                      {/* Daily Score (Mock calculation) */}
                      <TableCell className="text-center py-4 px-4">
                        <div className="inline-flex items-center px-2 py-1 rounded bg-primary/10 text-primary text-[10px] font-black italic uppercase">
                          +{Math.floor(member.score / 10)} PTS
                        </div>
                      </TableCell>
                      
                      {/* Join Date / Status Cell */}
                      <TableCell className="text-right py-4 pr-8 text-xs font-bold text-black/40 dark:text-muted-foreground/60 uppercase tracking-widest">
                        {member.joinedAt
                          ? new Date(member.joinedAt).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
                          : "N/A"}
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                /* Empty Leaderboard State */
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
