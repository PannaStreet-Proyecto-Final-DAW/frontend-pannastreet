import { fetchApi } from "./httpClient"

/**
 * Represents a user-created league in the system.
 */
export interface UserLeague {
  id: string
  name: string
  inviteCode: string
  createdAt: string
}

/**
 * Represents a user's participation in a league.
 * Note: userId and leagueId are optional because the current backend response 
 * might only include the full 'league' and 'user' objects.
 */
export interface UserLeagueMembership {
  id: string
  userId?: string
  leagueId?: string
  score: number
  joinedAt: string
  league?: UserLeague
  user?: {
    id: string
    userName: string
    email: string
  }
}

export interface Player {
  id: string
  name: string
  position: string
  nationality: string
  teamId: string
}

export interface Team {
  id: string
  name: string
  country: string
  leagueId: string
}

// User Leagues API
export async function createUserLeague(name: string): Promise<UserLeague> {
  return fetchApi("/user-league", {
    method: "POST",
    body: JSON.stringify({ name })
  })
}

export async function getAllUserLeagues(): Promise<UserLeague[]> {
  return fetchApi("/user-league")
}

export async function getUserLeagueById(id: string): Promise<UserLeague> {
  return fetchApi(`/user-league/id/${id}`)
}

// User League Membership API
export async function joinLeague(userId: string, leagueId: string): Promise<UserLeagueMembership> {
  return fetchApi("/user-league-membership", {
    method: "POST",
    body: JSON.stringify({ userId, leagueId })
  })
}

export async function getUserMemberships(userId: string): Promise<UserLeagueMembership[]> {
  return fetchApi(`/user-league-membership/user/${userId}`)
}

export async function getLeagueMembers(leagueId: string): Promise<UserLeagueMembership[]> {
  return fetchApi(`/user-league-membership/league/${leagueId}`)
}

/**
 * Increments the score for a specific league membership.
 * Note: We send both 'pointsToAdd' and 'amount' to satisfy the backend's
 * current validation schema requirements while matching the controller's logic.
 */
export async function incrementScore(membershipId: string, points: number): Promise<UserLeagueMembership> {
  return fetchApi(`/user-league-membership/increment-score/${membershipId}`, {
    method: "PATCH",
    body: JSON.stringify({ 
      pointsToAdd: points,
      amount: points // Fallback for backend validation schema mismatch
    })
  })
}

// Players API
export async function getAllPlayers(): Promise<Player[]> {
  return fetchApi("/player")
}

export async function getPlayerById(id: string): Promise<Player> {
  return fetchApi(`/player/id/${id}`)
}

// Teams API
export async function getAllTeams(): Promise<Team[]> {
  return fetchApi("/team")
}

export async function getTeamById(id: string): Promise<Team> {
  return fetchApi(`/team/id/${id}`)
}
