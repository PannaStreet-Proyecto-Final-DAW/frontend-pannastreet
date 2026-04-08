"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { getUserMemberships, createUserLeague, getAllUserLeagues, joinLeague, type UserLeagueMembership, type UserLeague } from "@/lib/api"
import { Button } from "@/components/ui/button"
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

export default function LeaguesPage() {
  const { user } = useAuth()
  const [memberships, setMemberships] = useState<UserLeagueMembership[]>([])
  const [availableLeagues, setAvailableLeagues] = useState<UserLeague[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  // Create league state
  const [newLeagueName, setNewLeagueName] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  // Join league state
  const [joinDialogOpen, setJoinDialogOpen] = useState(false)
  const [isJoining, setIsJoining] = useState(false)

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

      // Filter out leagues user is already a member of
      const memberLeagueIds = new Set(membershipData.map(m => m.leagueId))
      setAvailableLeagues(leaguesData.filter(l => !memberLeagueIds.has(l.id)))
    } catch {
      setError("Failed to load data. Make sure your backend is running.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [user])

  const handleCreateLeague = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newLeagueName.trim()) return

    setIsCreating(true)
    try {
      const newLeague = await createUserLeague(newLeagueName)
      await joinLeague(user.id, newLeague.id)
      setNewLeagueName("")
      setCreateDialogOpen(false)
      await fetchData()
    } catch {
      setError("Failed to create league")
    } finally {
      setIsCreating(false)
    }
  }

  const handleJoinLeague = async (leagueId: string) => {
    if (!user) return

    setIsJoining(true)
    try {
      await joinLeague(user.id, leagueId)
      setJoinDialogOpen(false)
      await fetchData()
    } catch {
      setError("Failed to join league")
    } finally {
      setIsJoining(false)
    }
  }

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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Leagues</h1>
          <p className="text-white mt-1">
            Compete with friends and track your scores
          </p>
        </div>
        <div className="flex gap-3">
          {/* Join League Dialog */}
          <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-border">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Join League
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-card-foreground">Join a League</DialogTitle>
                <DialogDescription>
                  Select a league to join and start competing
                </DialogDescription>
              </DialogHeader>
              {availableLeagues.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No available leagues to join. Create one!
                </p>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {availableLeagues.map((league) => (
                    <div
                      key={league.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border"
                    >
                      <div>
                        <p className="font-medium text-card-foreground">{league.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Code: {league.inviteCode}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleJoinLeague(league.id)}
                        disabled={isJoining}
                        className="bg-primary text-primary-foreground"
                      >
                        {isJoining ? <Spinner className="h-4 w-4" /> : "Join"}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Create League Dialog */}
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Create League
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-card-foreground">Create a League</DialogTitle>
                <DialogDescription>
                  Create your own league and invite friends to compete
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateLeague}>
                <Field>
                  <FieldLabel htmlFor="league-name" className="text-card-foreground">League Name</FieldLabel>
                  <Input
                    id="league-name"
                    type="text"
                    placeholder="Enter league name"
                    value={newLeagueName}
                    onChange={(e) => setNewLeagueName(e.target.value)}
                    required
                    className="bg-input border-border"
                  />
                </Field>
                <Button
                  type="submit"
                  className="w-full mt-4 bg-primary text-primary-foreground"
                  disabled={isCreating}
                >
                  {isCreating ? <Spinner className="h-4 w-4" /> : "Create League"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          {error}
        </div>
      )}

      {!hasLeagues ? (
        <Card className="border-border bg-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <CardTitle className="text-card-foreground mb-2">No leagues yet</CardTitle>
            <CardDescription className="text-center max-w-sm">
              Join an existing league or create your own to compete with friends and track your game scores.
            </CardDescription>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {memberships.map((membership) => (
            <Card key={membership.id} className="border-border bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-primary transition-colors">
                    {membership.league?.name || `League ${membership.leagueId}`}
                  </CardTitle>
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                    Member
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Your Score</p>
                    <p className="text-2xl font-bold text-primary">{membership.score}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Joined</p>
                    <p className="text-sm text-primary">
                      {new Date(membership.joinedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
