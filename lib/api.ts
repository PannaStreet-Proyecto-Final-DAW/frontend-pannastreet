const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

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
  const response = await fetch(`${API_BASE_URL}/api/user-league`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name })
  })
  if (!response.ok) throw new Error("Failed to create league")
  return response.json()
}

export async function getAllUserLeagues(): Promise<UserLeague[]> {
  const response = await fetch(`${API_BASE_URL}/api/user-league`)
  if (!response.ok) throw new Error("Failed to fetch leagues")
  return response.json()
}

export async function getUserLeagueById(id: string): Promise<UserLeague> {
  const response = await fetch(`${API_BASE_URL}/api/user-league/id/${id}`)
  if (!response.ok) throw new Error("Failed to fetch league")
  return response.json()
}

// User League Membership API
export async function joinLeague(userId: string, leagueId: string): Promise<UserLeagueMembership> {
  const response = await fetch(`${API_BASE_URL}/api/user-league-membership`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, leagueId })
  })
  if (!response.ok) throw new Error("Failed to join league")
  return response.json()
}

export async function getUserMemberships(userId: string): Promise<UserLeagueMembership[]> {
  const response = await fetch(`${API_BASE_URL}/api/user-league-membership/user/${userId}`)
  if (!response.ok) throw new Error("Failed to fetch memberships")
  return response.json()
}

export async function getLeagueMembers(leagueId: string): Promise<UserLeagueMembership[]> {
  const response = await fetch(`${API_BASE_URL}/api/user-league-membership/league/${leagueId}`)
  if (!response.ok) throw new Error("Failed to fetch league members")
  return response.json()
}

export async function incrementScore(membershipId: string, points: number): Promise<UserLeagueMembership> {
  const response = await fetch(`${API_BASE_URL}/api/user-league-membership/increment-score/${membershipId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ points })
  })
  if (!response.ok) throw new Error("Failed to increment score")
  return response.json()
}

// Players API
export async function getAllPlayers(): Promise<Player[]> {
  const response = await fetch(`${API_BASE_URL}/api/player`)
  if (!response.ok) throw new Error("Failed to fetch players")
  return response.json()
}

export async function getPlayerById(id: string): Promise<Player> {
  const response = await fetch(`${API_BASE_URL}/api/player/id/${id}`)
  if (!response.ok) throw new Error("Failed to fetch player")
  return response.json()
}

// Teams API
export async function getAllTeams(): Promise<Team[]> {
  const response = await fetch(`${API_BASE_URL}/api/team`)
  if (!response.ok) throw new Error("Failed to fetch teams")
  return response.json()
}

export async function getTeamById(id: string): Promise<Team> {
  const response = await fetch(`${API_BASE_URL}/api/team/id/${id}`)
  if (!response.ok) throw new Error("Failed to fetch team")
  return response.json()
}
