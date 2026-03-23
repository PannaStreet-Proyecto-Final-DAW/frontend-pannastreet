export const MOCK_USERS = [
  {
    id: "1",
    userName: "Juan Pérez",
    email: "juan@example.com",
    password: "12341234",
    role: "user"
  },
  {
    id: "2",
    userName: "Admin Panna",
    email: "admin@panna.com",
    password: "12341234",
    role: "admin"
  }
]

export const MOCK_LEAGUES = [
  { id: "1", name: "Liga de Verano", inviteCode: "VERANO123", createdAt: new Date().toISOString() },
  { id: "2", name: "Copa Panna 2024", inviteCode: "PANNA24", createdAt: new Date().toISOString() }
]

export const MOCK_MEMBERSHIPS = [
  {
    id: "m1",
    userId: "1",
    leagueId: "1",
    score: 1500,
    joinedAt: new Date().toISOString(),
    league: MOCK_LEAGUES[0]
  }
]

export const MOCK_PLAYERS = [
  { id: "p1", name: "Lionel Messi", position: "Forward", nationality: "Argentina", teamId: "t1" },
  { id: "p2", name: "Cristiano Ronaldo", position: "Forward", nationality: "Portugal", teamId: "t2" },
  { id: "p3", name: "Kylian Mbappé", position: "Forward", nationality: "France", teamId: "t3" }
]

export const MOCK_TEAMS = [
  { id: "t1", name: "Inter Miami", country: "USA", leagueId: "l1" },
  { id: "t2", name: "Al Nassr", country: "Saudi Arabia", leagueId: "l2" },
  { id: "t3", name: "Real Madrid", country: "Spain", leagueId: "1" }
]
