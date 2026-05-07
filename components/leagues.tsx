"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import {
  getUserMemberships,
  createUserLeague,
  getAllUserLeagues,
  joinLeague,
  getLeagueMembers,
  type UserLeagueMembership,
  type UserLeague
} from "@/lib/api"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { LeagueWindow } from "@/components/league-window"
import { cn } from "@/lib/utils"

/**
 * Leagues Component
 * 
 * This is the central hub for league management. It allows users to:
 * 1. View their active leagues and scores.
 * 2. Discover and join new leagues using a secure invitation code.
 * 3. Create their own leagues.
 * 4. Navigate into a detailed leaderboard view for a specific league.
 */
export function Leagues() {
  const { user } = useAuth()

  // --- Dashboard Data States ---
  const [memberships, setMemberships] = useState<UserLeagueMembership[]>([]) // List of leagues the user belongs to
  const [availableLeagues, setAvailableLeagues] = useState<UserLeague[]>([]) // Public leagues available to be joined
  const [isLoading, setIsLoading] = useState(true) // Global loading state for initial data fetch
  const [error, setError] = useState("") // Global error message

  // --- Create League States ---
  const [newLeagueName, setNewLeagueName] = useState("") // Input value for new league name
  const [isCreating, setIsCreating] = useState(false) // Loading state during league creation
  const [createDialogOpen, setCreateDialogOpen] = useState(false) // Controls visibility of the creation modal

  // --- Secure Join Flow States ---
  // We use a multi-step join flow: 
  // 1. User sees list of available leagues.
  // 2. User selects a league, triggering the 'joiningLeague' state.
  // 3. User must enter the correct invite code to finalize.
  const [joinDialogOpen, setJoinDialogOpen] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [joiningLeague, setJoiningLeague] = useState<UserLeague | null>(null)
  const [inviteCodeInput, setInviteCodeInput] = useState("")
  const [inviteCodeError, setInviteCodeError] = useState(false)

  // --- League Details (Leaderboard) States ---
  const [selectedLeague, setSelectedLeague] = useState<UserLeagueMembership | null>(null) // The league currently being focused
  const [leagueMembers, setLeagueMembers] = useState<UserLeagueMembership[]>([]) // Members of the focused league
  const [isLoadingMembers, setIsLoadingMembers] = useState(false) // Loading state for leaderboard data

  /**
   * fetchData: Orchestrates the initial loading of user data.
   * Fetches both the user's current memberships and all available leagues simultaneously.
   */
  const fetchData = async () => {
    if (!user) return

    setIsLoading(true)
    setError("")

    try {
      const [membershipData, leaguesData] = await Promise.all([
        getUserMemberships(user.id),
        getAllUserLeagues()
      ])

      setMemberships(membershipData)

      // Filter Logic: Only show leagues that the user is NOT already a part of.
      const memberLeagueIds = new Set(membershipData.map(m => m.league?.id || m.leagueId))
      setAvailableLeagues(leaguesData.filter(l => !memberLeagueIds.has(l.id)))
    } catch {
      setError("Failed to load data. Make sure your backend is running.")
    } finally {
      setIsLoading(false)
    }
  }

  // Trigger data fetch on component mount or user change
  useEffect(() => {
    fetchData()
  }, [user])

  /**
   * handleCreateLeague: Processes the creation of a new competition.
   * Automatically joins the creator to their own league upon success.
   */
  const handleCreateLeague = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newLeagueName.trim()) return

    setIsCreating(true)
    try {
      const newLeague = await createUserLeague(newLeagueName)
      await joinLeague(user.id, newLeague.id)

      // Cleanup UI
      setNewLeagueName("")
      setCreateDialogOpen(false)

      // Refresh global state
      await fetchData()
      toast.success(`League "${newLeague.name}" created successfully!`)
    } catch {
      setError("Failed to create league")
    } finally {
      setIsCreating(false)
    }
  }

  /**
   * handleJoinLeague: Finalizes the secure join process.
   * Validates the invite code locally before making the API request.
   */
  const handleJoinLeague = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !joiningLeague) return

    // Security Check: Invite code must match perfectly.
    if (inviteCodeInput !== joiningLeague.inviteCode) {
      setInviteCodeError(true)
      toast.error("Invalid invite code")
      return
    }

    setInviteCodeError(false)
    setIsJoining(true)

    try {
      await joinLeague(user.id, joiningLeague.id)
      const leagueName = joiningLeague.name

      // Successful join cleanup
      setJoinDialogOpen(false)
      setJoiningLeague(null)
      setInviteCodeInput("")
      setInviteCodeError(false)

      await fetchData()
      toast.success(`Welcome to ${leagueName}!`)
    } catch {
      setError("Failed to join league")
    } finally {
      setIsJoining(false)
    }
  }

  /**
   * handleViewLeagueDetails: Loads and displays the leaderboard for a specific league.
   * Transforms the main view from the "My Leagues" dashboard to the "League Leaderboard".
   */
  const handleViewLeagueDetails = async (membership: UserLeagueMembership) => {
    setSelectedLeague(membership)
    setIsLoadingMembers(true)

    try {
      // Defensive ID handling: Backend may store league ID in different nested levels
      const currentLeagueId = membership.league?.id || membership.leagueId
      if (!currentLeagueId || currentLeagueId === "undefined") {
        throw new Error("Invalid League ID")
      }

      const members = await getLeagueMembers(currentLeagueId)
      setLeagueMembers(members)
    } catch {
      setError("Failed to load league members")
    } finally {
      setIsLoadingMembers(false)
    }
  }

  // --- RENDERING LOGIC ---

  // Show a loading spinner while initial data is being fetched
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    )
  }

  const hasLeagues = memberships.length > 0

  return (
    <div className="max-w-4xl mx-auto">
      {/* 
          Main Toggle: 
          If no league is selected, show the dashboard.
          If a league is selected, show the LeagueWindow (leaderboard).
      */}
      {!selectedLeague ? (
        <>
          {/* Dashboard Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Leagues</h1>
            </div>

            <div className="flex gap-3">
              {/* --- SECURE JOIN LEAGUE DIALOG --- */}
              <Dialog open={joinDialogOpen} onOpenChange={(open) => {
                setJoinDialogOpen(open)
                // Cleanup states if user closes the modal halfway through
                if (!open) {
                  setJoiningLeague(null)
                  setInviteCodeInput("")
                  setInviteCodeError(false)
                }
              }}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-border rounded-xl font-bold uppercase text-[10px] tracking-widest h-10 px-6 hover:bg-white/5 transition-colors">
                    Join League
                  </Button>
                </DialogTrigger>

                <DialogContent className="bg-white dark:bg-[#071a0c] border-border/30 rounded-[2rem] p-8 max-w-[450px] shadow-2xl">
                  <DialogHeader className="space-y-3">
                    <DialogTitle className="text-2xl font-bold">
                      {joiningLeague ? `Join ${joiningLeague.name}` : "Join a League"}
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                      {joiningLeague
                        ? "Please enter the invite code to join this league."
                        : "Choose a league to join or enter an invite code."}
                    </DialogDescription>
                  </DialogHeader>

                  {/* UI Switch: Show list of leagues OR show the code input field */}
                  {!joiningLeague ? (
                    availableLeagues.length === 0 ? (
                      <p className="text-muted-foreground text-center py-12 italic font-medium">
                        No available leagues to join. Create your own legacy!
                      </p>
                    ) : (
                      <div className="space-y-3 max-h-[300px] overflow-y-auto mt-6 pr-2">
                        {availableLeagues.map((league) => (
                          <div
                            key={league.id}
                            className="flex items-center justify-between p-4 rounded-2xl bg-black/5 dark:bg-black/20 border border-border/40 transition-all hover:border-primary/40 group"
                          >
                            <div className="flex flex-col">
                              <p className="font-semibold text-foreground text-lg">{league.name}</p>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => {
                                setJoiningLeague(league)
                                setInviteCodeInput("")
                              }}
                            >
                              Join
                            </Button>
                          </div>
                        ))}
                      </div>
                    )
                  ) : (
                    /* The actual code verification form */
                    <form onSubmit={handleJoinLeague} className="mt-8 space-y-6">
                      <Field>
                        <FieldLabel className="text-sm font-semibold mb-2 block">Invite Code</FieldLabel>
                        <Input
                          value={inviteCodeInput}
                          onChange={(e) => {
                            setInviteCodeInput(e.target.value)
                            if (inviteCodeError) setInviteCodeError(false)
                          }}
                          className={cn(
                            "bg-muted/50 border-border h-12 rounded-lg text-center font-mono text-xl uppercase",
                            inviteCodeError ? "border-destructive text-destructive" : ""
                          )}
                          placeholder="Enter code"
                          autoFocus
                          required
                        />
                        {inviteCodeError && (
                          <p className="text-xs font-medium text-destructive mt-2 text-center">
                            Invalid code
                          </p>
                        )}
                      </Field>

                      <div className="flex gap-3 pt-4">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setJoiningLeague(null)}
                          className="flex-1"
                        >
                          Back
                        </Button>
                        <Button
                          type="submit"
                          disabled={isJoining || !inviteCodeInput.trim()}
                          className="flex-[2]"
                        >
                          {isJoining ? "Joining..." : "Join League"}
                        </Button>
                      </div>
                    </form>
                  )}
                </DialogContent>
              </Dialog>

              {/* --- CREATE LEAGUE DIALOG --- */}
              <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary text-primary-foreground rounded-xl font-black italic uppercase text-[10px] tracking-widest h-10 px-6 shadow-lg shadow-primary/10 transition-all active:scale-95">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                    </svg>
                    Create League
                  </Button>
                </DialogTrigger>

                <DialogContent className="bg-white dark:bg-[#071a0c] border-border/30 rounded-[2rem] p-8 max-w-[450px]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Create League</DialogTitle>
                    <DialogDescription>
                      Create a new league to compete with your friends.
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleCreateLeague} className="mt-4 space-y-4">
                    <Field>
                      <FieldLabel className="text-sm font-semibold">League Name</FieldLabel>
                      <Input
                        id="league-name"
                        type="text"
                        placeholder="e.g. My Awesome League"
                        value={newLeagueName}
                        onChange={(e) => setNewLeagueName(e.target.value)}
                        required
                        autoComplete="off"
                        className="bg-muted/50 border-border"
                      />
                    </Field>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isCreating}
                    >
                      {isCreating ? "Creating..." : "Create League"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Display any API or loading errors */}
          {error && (
            <div className="mb-8 p-4 rounded-2xl bg-destructive/5 border border-destructive/20 text-destructive text-xs font-bold uppercase tracking-widest text-center italic">
              {error}
            </div>
          )}

          {/* Empty State: No leagues joined yet */}
          {!hasLeagues ? (
            <Card className="border-border/40 bg-card/90 backdrop-blur-md rounded-[2rem] overflow-hidden">
              <CardContent className="flex flex-col items-center justify-center py-20">
                <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center mb-6 relative">
                  <div className="absolute inset-0 bg-primary/5 rounded-full animate-pulse" />
                  <svg className="w-12 h-12 text-primary relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <CardTitle className="text-2xl font-bold">No leagues joined</CardTitle>
                <CardDescription className="text-center max-w-sm">
                  You haven't joined any leagues yet. Join a league or create your own to start playing!
                </CardDescription>
              </CardContent>
            </Card>
          ) : (
            /* Grid of Joined Leagues */
            <div className="grid gap-6 md:grid-cols-2">
              {memberships.map((membership) => (
                <Card
                  key={membership.id}
                  className="border-border dark:border-border/40 bg-white dark:bg-card/60 dark:backdrop-blur-sm hover:border-primary/40 transition-all cursor-pointer group rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
                  onClick={() => handleViewLeagueDetails(membership)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-bold">
                        {membership.league?.name && membership.league.name !== ""
                          ? membership.league.name
                          : `League ${membership.league?.id?.substring(0, 8) || membership.id.substring(0, 8)}`}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Score</p>
                        <p className="text-3xl font-bold text-primary">{membership.score} pts</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-muted-foreground">Joined</p>
                        <p className="text-sm font-semibold">
                          {membership.joinedAt
                            ? new Date(membership.joinedAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: '2-digit' })
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      ) : (
        /* Focused League View (Leaderboard) */
        <LeagueWindow
          selectedLeague={selectedLeague}
          leagueMembers={leagueMembers}
          isLoadingMembers={isLoadingMembers}
          onBack={() => setSelectedLeague(null)}
          currentUserId={user?.id}
        />
      )}
    </div>
  )
}
