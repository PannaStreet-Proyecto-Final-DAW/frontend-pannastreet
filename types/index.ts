// --- LEAGUE DATA MODELS ---

// UserLeague: Represents a competitive league created by a user.
export interface UserLeague {
  id: string
  name: string
  inviteCode: string
  createdAt: string
}

// UserLeagueMembership: Represents the link between a user and a league.
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

// Player: Represents a professional player in the system database.
export interface Player {
  id: string
  name: string
  age: number
  tier: number
  team: string
  nationality: string
  position: string[]
  generalPosition: "GOALKEEPER" | "DEFENDER" | "MIDFIELDER" | "FORWARD"
  pictureUrl: string | null
  gender: "male" | "female"
  league: string
}

// Team: Represents a professional club/team.
export interface Team {
  id: string
  name: string
  tier: number
  pictureUrl: string | null
  league: string
  gender: "male" | "female"
  country: string
}

// League: Represents a professional league.
export interface League {
  id: string
  name: string
  category: "male" | "female"
  country: string
  pictureUrl: string | null
}

// Formation: Represents a tactical formation.
export interface Formation {
  id: string
  name: string
  goalkeeper: string
  defenders: string[]
  midfielders: string[]
  forwards: string[]
}

// --- GAME MECHANICS ---

export type GameStatus = "playing" | "won" | "lost"

export type Hint = "correct" | "partial" | "wrong"

// Represents a single guess attempt in the Guess the Player game.
export interface Guess {
  id: string
  name: string
  hints: {
    team: Hint
    league: Hint
    nationality: Hint
    position: Hint
    age: "correct" | "higher" | "lower"
  }
}

// --- ENGINE SPECIFIC ---

// Interface representing a clickable position on the football pitch.
export interface Position {
  id: number
  label: string
  row: number
  col: number
}

// Interface for a player assigned to a position in a lineup.
export interface SelectedPlayer {
  playerId: string
  positionId: number
  club: string
  player: string
  crestUrl?: string | null
}
