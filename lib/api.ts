import { fetchApi } from "./httpClient"

import { 
  UserLeague, 
  UserLeagueMembership, 
  Player, 
  Team, 
  League, 
  Formation 
} from "@/types"

// Re-export everything from centralized types to maintain backward compatibility
export * from "@/types"

// --- LEAGUE MANAGEMENT API ---

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

// getUserLeagueById: Retrieves full details of a specific league.
export async function getUserLeagueById(id: string): Promise<UserLeague> {
  return fetchApi(`/user-league/id/${id}`)
}

// --- MEMBERSHIP & LEADERBOARD API ---

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

// --- CORE ENTITIES API (WITH MEMORY CACHE) ---

// Simple singleton cache to avoid redundant network requests across different game pages
const apiCache: {
  players: Player[] | null;
  teams: Team[] | null;
  formations: Formation[] | null;
  leagues: League[] | null;
} = {
  players: null,
  teams: null,
  formations: null,
  leagues: null
};

/**
 * getAllPlayers: Fetches the complete database of professional players.
 * Uses cache if available to optimize loading between games.
 */
export async function getAllPlayers(): Promise<Player[]> {
  if (apiCache.players) return apiCache.players;
  const players = await fetchApi("/player");
  apiCache.players = players;
  return players;
}

// getPlayerById: Retrieves detailed information for a single player.
export async function getPlayerById(id: string): Promise<Player> {
  return fetchApi(`/player/id/${id}`)
}

// getAllTeams: Fetches the complete list of teams/clubs.
export async function getAllTeams(): Promise<Team[]> {
  if (apiCache.teams) return apiCache.teams;
  const teams = await fetchApi("/team");
  apiCache.teams = teams;
  return teams;
}

// getTeamById: Retrieves detailed information for a specific team.
export async function getTeamById(id: string): Promise<Team> {
  return fetchApi(`/team/id/${id}`)
}

// getAllLeagues: Fetches all professional leagues.
export async function getAllLeagues(): Promise<League[]> {
  if (apiCache.leagues) return apiCache.leagues;
  const leagues = await fetchApi("/league");
  apiCache.leagues = leagues;
  return leagues;
}

// getAllFormations: Fetches all tactical formations.
export async function getAllFormations(): Promise<Formation[]> {
  if (apiCache.formations) return apiCache.formations;
  const formations = await fetchApi("/formation");
  apiCache.formations = formations;
  return formations;
}
