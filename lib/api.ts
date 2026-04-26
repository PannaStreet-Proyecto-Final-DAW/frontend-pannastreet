import { fetchApi } from "./httpClient"

export interface UserLeague {
  id: string
  name: string
  inviteCode: string
  createdAt: string
}

export interface UserLeagueMembership {
  id: string
  userId: string
  leagueId: string
  score: number
  joinedAt: string
  league?: UserLeague
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

export async function incrementScore(membershipId: string, points: number): Promise<UserLeagueMembership> {
  return fetchApi(`/user-league-membership/increment-score/${membershipId}`, {
    method: "PATCH",
    body: JSON.stringify({ points })
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
