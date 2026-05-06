import { fetchApi } from "./httpClient"

/**
 * --- LEAGUE DATA MODELS ---
 */

/**
 * UserLeague: Represents a competitive league created by a user.
 * Each league has a unique name and a private invite code used for secure joining.
 */
export interface UserLeague {
  id: string
  name: string
  inviteCode: string
  createdAt: string
}

/**
 * UserLeagueMembership: Represents the link between a user and a league.
 * It tracks the user's performance (score) and when they joined the competition.
 * Note: Includes optional league and user objects for enriched leaderboard displays.
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

/**
 * Player: Represents a professional player in the system database.
 */
export interface Player {
  id: string
  name: string
  position: string
  nationality: string
  teamId: string
}

/**
 * Team: Represents a professional club/team.
 */
export interface Team {
  id: string
  name: string
  country: string
  leagueId: string
}

/**
 * --- LEAGUE MANAGEMENT API ---
 */

/**
 * createUserLeague: Creates a new competitive arena in the system.
 * @param name - The desired name for the new league.
 * @returns A promise resolving to the created league object.
 */
export async function createUserLeague(name: string): Promise<UserLeague> {
  return fetchApi("/user-league", {
    method: "POST",
    body: JSON.stringify({ name })
  })
}

/**
 * getAllUserLeagues: Fetches every user-created league in the system.
 * Useful for building discovery lists or public league browsers.
 */
export async function getAllUserLeagues(): Promise<UserLeague[]> {
  return fetchApi("/user-league")
}

/**
 * updateUserLeague: Modifies an existing league's metadata.
 * Primarily used to rename a league by its owner/manager.
 * @param id - Unique identifier of the target league.
 * @param name - The new name to apply.
 */
export async function updateUserLeague(id: string, name: string): Promise<UserLeague> {
  return fetchApi(`/user-league/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ name })
  })
}

/**
 * getUserLeagueById: Retrieves full details of a specific league.
 */
export async function getUserLeagueById(id: string): Promise<UserLeague> {
  return fetchApi(`/user-league/id/${id}`)
}

/**
 * --- MEMBERSHIP & LEADERBOARD API ---
 */

/**
 * joinLeague: Grants a user access to a specific league.
 * This establishes a membership relationship in the database.
 * @param userId - ID of the user who wants to join.
 * @param leagueId - ID of the league they are entering.
 */
export async function joinLeague(userId: string, leagueId: string): Promise<UserLeagueMembership> {
  return fetchApi("/user-league-membership", {
    method: "POST",
    body: JSON.stringify({ userId, leagueId })
  })
}

/**
 * getUserMemberships: Retrieves all leagues that a specific user has joined.
 * Crucial for populating the user's personal dashboard.
 */
export async function getUserMemberships(userId: string): Promise<UserLeagueMembership[]> {
  return fetchApi(`/user-league-membership/user/${userId}`)
}

/**
 * getLeagueMembers: Fetches all participants within a specific league.
 * Used to calculate and display the real-time leaderboard rankings.
 */
export async function getLeagueMembers(leagueId: string): Promise<UserLeagueMembership[]> {
  return fetchApi(`/user-league-membership/league/${leagueId}`)
}

/**
 * incrementScore: Updates a user's points for a specific league entry.
 * Logic: Adds 'points' to the existing score.
 * Note: Both 'pointsToAdd' and 'amount' are sent to satisfy diverse backend schema versions.
 */
export async function incrementScore(membershipId: string, points: number): Promise<UserLeagueMembership> {
  return fetchApi(`/user-league-membership/increment-score/${membershipId}`, {
    method: "PATCH",
    body: JSON.stringify({ 
      pointsToAdd: points,
      amount: points 
    })
  })
}

/**
 * deleteMembership: Performs the "Leave League" action.
 * Permanently removes the user's presence and score from a specific league.
 * @param id - The membership record ID to be deleted.
 */
export async function deleteMembership(id: string): Promise<{ message: string }> {
  return fetchApi(`/user-league-membership/${id}`, {
    method: "DELETE"
  })
}

/**
 * --- CORE ENTITIES API ---
 */

/**
 * getAllPlayers: Fetches the complete database of professional players.
 */
export async function getAllPlayers(): Promise<Player[]> {
  return fetchApi("/player")
}

/**
 * getPlayerById: Retrieves detailed information for a single player.
 */
export async function getPlayerById(id: string): Promise<Player> {
  return fetchApi(`/player/id/${id}`)
}

/**
 * getAllTeams: Fetches the complete list of teams/clubs.
 */
export async function getAllTeams(): Promise<Team[]> {
  return fetchApi("/team")
}

/**
 * getTeamById: Retrieves detailed information for a specific team.
 */
export async function getTeamById(id: string): Promise<Team> {
  return fetchApi(`/team/id/${id}`)
}
