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

// --- DAILY CHALLENGES & ATTEMPTS API ---

export interface UserGameAttempt {
  id: string;
  userId: string;
  date: string;
  gameId: string;
  modeId: string;
  score: number;
  points: number;
  status: "pending" | "won" | "lost";
  won: boolean;
  history?: any;
  createdAt?: string;
  updatedAt?: string;
}

export interface DailyChallenge {
  date: string;
  gameId: string;
  modeId: string;
  challengeData: any;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * getMadridDate: Helper to format the current date in Europe/Madrid timezone as YYYY-MM-DD.
 */
export function getMadridDate(): string {
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Europe/Madrid",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    })
    const parts = formatter.formatToParts(new Date())
    const year = parts.find(p => p.type === "year")!.value
    const month = parts.find(p => p.type === "month")!.value
    const day = parts.find(p => p.type === "day")!.value
    return `${year}-${month}-${day}`
  } catch (e) {
    const now = new Date()
    return now.toISOString().split("T")[0]
  }
}

/**
 * getDailyChallenge: Fetches the daily challenge of today for a specific game and mode.
 * Route: GET /api/daily-challenge/:date/:gameId/:modeId
 */
export async function getDailyChallenge(
  date: string,
  gameId: string,
  modeId: string
): Promise<DailyChallenge> {
  return fetchApi(`/daily-challenge/${date}/${gameId}/${modeId}`)
}

/**
 * getUserTodayAttempt: Checks if the user already played this game today.
 * Route: GET /api/user-game-attempt/:userId/:date/:gameId
 */
export async function getUserTodayAttempt(gameId: string): Promise<UserGameAttempt | null> {
  try {
    if (typeof window === "undefined") return null
    const userJson = localStorage.getItem("user")
    if (!userJson) return null
    const user = JSON.parse(userJson)
    if (!user || !user.id) return null
    
    const today = getMadridDate()
    const attempt = await fetchApi(`/user-game-attempt/${user.id}/${today}/${gameId}`, {
      ignoreErrors: true
    } as any)
    
    if (attempt) {
      // Map properties for backwards compatibility
      attempt.points = attempt.score !== undefined ? attempt.score : attempt.points
      attempt.won = attempt.status === "won" ? true : attempt.status === "lost" ? false : attempt.won
    }
    return attempt || null
  } catch (error) {
    return null
  }
}

/**
 * saveUserAttempt: Registers the daily game attempt score and status.
 * Route: POST /api/user-game-attempt
 */
export async function saveUserAttempt(
  gameId: string,
  modeId: string,
  score: number,
  status: "pending" | "won" | "lost",
  history?: any
): Promise<UserGameAttempt> {
  if (typeof window === "undefined") {
    throw new Error("Cannot save attempt outside of browser context")
  }
  const userJson = localStorage.getItem("user")
  if (!userJson) {
    throw new Error("User not authenticated")
  }
  const user = JSON.parse(userJson)
  if (!user || !user.id) {
    throw new Error("Invalid user data in authentication context")
  }

  const today = getMadridDate()
  
  const attempt = await fetchApi("/user-game-attempt", {
    method: "POST",
    body: JSON.stringify({
      userId: user.id,
      date: today,
      gameId,
      modeId,
      score,
      status,
      history
    })
  })

  if (attempt) {
    // Map properties for backwards compatibility
    attempt.points = attempt.score !== undefined ? attempt.score : attempt.points
    attempt.won = attempt.status === "won" ? true : attempt.status === "lost" ? false : attempt.won
  }
  return attempt
}

