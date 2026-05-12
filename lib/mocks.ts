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
    joinedAt: "2024-01-10T10:00:00Z",
    league: MOCK_LEAGUES[0]
  },
  {
    id: "m2",
    userId: "2",
    leagueId: "1",
    score: 1250,
    joinedAt: "2024-01-15T12:00:00Z",
    league: MOCK_LEAGUES[0]
  },
  {
    id: "m3",
    userId: "3",
    leagueId: "1",
    score: 1800,
    joinedAt: "2024-01-05T09:00:00Z",
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

// GAME-SPECIFIC MOCKS (Used before API integration)

export const GAME_MOCK_PLAYERS = [
  { name: "Messi", team: "Inter Miami", league: "MLS", nationality: "Argentina", position: ["RW", "ST"], age: 36, tier: 1, gender: "male", generalPosition: "FORWARD" },
  { name: "Lionel Messi", team: "Inter Miami", league: "MLS", nationality: "Argentina", position: ["RW", "ST"], age: 36, tier: 1, gender: "male", generalPosition: "FORWARD" },
  { name: "Ronaldo", team: "Al Nassr", league: "Saudi Pro League", nationality: "Portugal", position: ["ST"], age: 39, tier: 1, gender: "male", generalPosition: "FORWARD" },
  { name: "Cristiano Ronaldo", team: "Al Nassr", league: "Saudi Pro League", nationality: "Portugal", position: ["ST"], age: 39, tier: 1, gender: "male", generalPosition: "FORWARD" },
  { name: "Ronaldinho", team: "Retired", league: "Icons", nationality: "Brazil", position: ["LW", "CM"], age: 44, tier: 3, gender: "male", generalPosition: "MIDFIELDER" },
  { name: "Ronaldo Nazario", team: "Retired", league: "Icons", nationality: "Brazil", position: ["ST"], age: 47, tier: 3, gender: "male", generalPosition: "FORWARD" },
  { name: "Mbappe", team: "Real Madrid", league: "La Liga", nationality: "France", position: ["ST", "LW"], age: 25, tier: 1, gender: "male", generalPosition: "FORWARD" },
  { name: "Kylian Mbappe", team: "Real Madrid", league: "La Liga", nationality: "France", position: ["ST", "LW"], age: 25, tier: 1, gender: "male", generalPosition: "FORWARD" },
  { name: "Haaland", team: "Man City", league: "Premier League", nationality: "Norway", position: ["ST"], age: 23, tier: 1, gender: "male", generalPosition: "FORWARD" },
  { name: "Erling Haaland", team: "Man City", league: "Premier League", nationality: "Norway", position: ["ST"], age: 23, tier: 1, gender: "male", generalPosition: "FORWARD" },
  { name: "Bellingham", team: "Real Madrid", league: "La Liga", nationality: "England", position: ["CM"], age: 20, tier: 2, gender: "male", generalPosition: "MIDFIELDER" },
  { name: "Jude Bellingham", team: "Real Madrid", league: "La Liga", nationality: "England", position: ["CM"], age: 20, tier: 2, gender: "male", generalPosition: "MIDFIELDER" },
  { name: "Vinicius", team: "Real Madrid", league: "La Liga", nationality: "Brazil", position: ["LW"], age: 23, tier: 2, gender: "male", generalPosition: "FORWARD" },
  { name: "Vinicius Junior", team: "Real Madrid", league: "La Liga", nationality: "Brazil", position: ["LW", "ST"], age: 23, tier: 2, gender: "male", generalPosition: "FORWARD" },
  { name: "Salah", team: "Liverpool", league: "Premier League", nationality: "Egypt", position: ["RW", "ST"], age: 31, tier: 2, gender: "male", generalPosition: "FORWARD" },
  { name: "Mohamed Salah", team: "Liverpool", league: "Premier League", nationality: "Egypt", position: ["RW", "ST"], age: 31, tier: 2, gender: "male", generalPosition: "FORWARD" },
  { name: "De Bruyne", team: "Man City", league: "Premier League", nationality: "Belgium", position: ["CM"], age: 32, tier: 2, gender: "male", generalPosition: "MIDFIELDER" },
  { name: "Kevin De Bruyne", team: "Man City", league: "Premier League", nationality: "Belgium", position: ["CM"], age: 32, tier: 2, gender: "male", generalPosition: "MIDFIELDER" },
  { name: "Bruno Fernandes", team: "Man United", league: "Premier League", nationality: "Portugal", position: ["CM", "RW"], age: 29, tier: 3, gender: "male", generalPosition: "MIDFIELDER" },
  { name: "Enzo Fernandez", team: "Chelsea", league: "Premier League", nationality: "Argentina", position: ["CM"], age: 23, tier: 3, gender: "male", generalPosition: "MIDFIELDER" },
]

export const GAME_MOCK_CLUBS = [
  // Tier 1: World Powerhouses (11)
  { name: "Real Madrid", tier: 1 }, { name: "Barcelona", tier: 1 }, { name: "Man City", tier: 1 },
  { name: "Liverpool", tier: 1 }, { name: "Bayern Munich", tier: 1 }, { name: "PSG", tier: 1 },
  { name: "Arsenal", tier: 1 }, { name: "Inter Milan", tier: 1 }, { name: "Bayer Leverkusen", tier: 1 },
  { name: "Juventus", tier: 1 }, { name: "Atletico Madrid", tier: 1 },
  // Tier 2: Elite European Clubs (11)
  { name: "Chelsea", tier: 2 }, { name: "Man United", tier: 2 }, { name: "AC Milan", tier: 2 },
  { name: "Dortmund", tier: 2 }, { name: "Tottenham", tier: 2 }, { name: "Napoli", tier: 2 },
  { name: "Aston Villa", tier: 2 }, { name: "RB Leipzig", tier: 2 }, { name: "Benfica", tier: 2 },
  { name: "Porto", tier: 2 }, { name: "Roma", tier: 2 },
  // Tier 3: Competitive Mid-Tier Clubs (11)
  { name: "West Ham", tier: 3 }, { name: "Villarreal", tier: 3 }, { name: "Sevilla", tier: 3 },
  { name: "Brighton", tier: 3 }, { name: "Lazio", tier: 3 }, { name: "Real Sociedad", tier: 3 },
  { name: "Newcastle", tier: 3 }, { name: "Girona", tier: 3 }, { name: "Athletic Club", tier: 3 },
  { name: "Fiorentina", tier: 3 }, { name: "Everton", tier: 3 }
]

export const GAME_MOCK_PLAYERS_BY_CLUB: Record<string, { name: string; positions: string[] }[]> = {
  // Tier 1
  "Real Madrid": [
    { name: "Bellingham", positions: ["CM"] }, { name: "Jude Bellingham", positions: ["CM"] },
    { name: "Vinicius", positions: ["LW"] }, { name: "Vinicius Junior", positions: ["LW", "ST"] },
    { name: "Mbappe", positions: ["ST", "LW", "RW"] }, { name: "Kylian Mbappe", positions: ["ST", "LW", "RW"] },
    { name: "Rodrygo", positions: ["RW", "LW"] }, { name: "Valverde", positions: ["CM", "RW"] }
  ],
  "Barcelona": [
    { name: "Pedri", positions: ["CM"] }, { name: "Gavi", positions: ["LW"] },
    { name: "Yamal", positions: ["RW"] }, { name: "Lamine Yamal", positions: ["RW"] },
    { name: "Raphinha", positions: ["LW", "RW"] }, { name: "Lewandowski", positions: ["ST"] }, { name: "Robert Lewandowski", positions: ["ST"] }
  ],
  "Bayern Munich": [
    { name: "Sane", positions: ["LW", "RW"] }, { name: "Musiala", positions: ["CM", "LW"] },
    { name: "Kane", positions: ["ST"] }, { name: "Harry Kane", positions: ["ST"] },
    { name: "Kimmich", positions: ["CM", "RB"] }, { name: "Muller", positions: ["CM", "ST"] }, { name: "Thomas Muller", positions: ["CM", "ST"] }
  ],
  "Man City": [
    { name: "Haaland", positions: ["ST"] }, { name: "Erling Haaland", positions: ["ST"] },
    { name: "De Bruyne", positions: ["CM"] }, { name: "Kevin De Bruyne", positions: ["CM"] },
    { name: "Foden", positions: ["RW", "LW", "CM"] }, { name: "Rodri", positions: ["CM"] }, { name: "Grealish", positions: ["LW", "CM"] }
  ],
  "Liverpool": [
    { name: "Salah", positions: ["RW", "ST"] }, { name: "Mohamed Salah", positions: ["RW", "ST"] },
    { name: "Nunez", positions: ["ST", "LW"] }, { name: "Darwin Nunez", positions: ["ST", "LW"] },
    { name: "Mac Allister", positions: ["CM"] }, { name: "Szoboszlai", positions: ["CM", "RW"] }, { name: "Van Dijk", positions: ["CB"] }
  ],
  "PSG": [
    { name: "Dembele", positions: ["RW", "LW"] }, { name: "Ousmane Dembele", positions: ["RW", "LW"] },
    { name: "Barcola", positions: ["LW", "RW"] }, { name: "Asensio", positions: ["ST", "RW"] },
    { name: "Vitinha", positions: ["CM"] }, { name: "Hakimi", positions: ["RB", "RW"] }
  ],
  "Inter Milan": [
    { name: "Lautaro", positions: ["ST"] }, { name: "Lautaro Martinez", positions: ["ST"] },
    { name: "Thuram", positions: ["ST", "LW"] }, { name: "Marcus Thuram", positions: ["ST", "LW"] },
    { name: "Barella", positions: ["CM"] }, { name: "Calhanoglu", positions: ["CM"] }, { name: "Bastoni", positions: ["CB", "LB"] }
  ],
  "Bayer Leverkusen": [
    { name: "Wirtz", positions: ["CM"] }, { name: "Florian Wirtz", positions: ["CM"] },
    { name: "Grimaldo", positions: ["LB", "LW"] }, { name: "Frimpong", positions: ["RB", "RW"] },
    { name: "Xhaka", positions: ["CM"] }, { name: "Schick", positions: ["ST"] }
  ],
  "Juventus": [
    { name: "Vlahovic", positions: ["ST"] }, { name: "Dusan Vlahovic", positions: ["ST"] },
    { name: "Chiesa", positions: ["LW", "RW"] }, { name: "Locatelli", positions: ["CM"] },
    { name: "Bremer", positions: ["CB"] }, { name: "Yildiz", positions: ["ST", "LW"] }
  ],
  "Atletico Madrid": [
    { name: "Griezmann", positions: ["ST", "CM"] }, { name: "Antoine Griezmann", positions: ["ST", "CM"] },
    { name: "Morata", positions: ["ST"] }, { name: "Alvaro Morata", positions: ["ST"] },
    { name: "Koke", positions: ["CM"] }, { name: "De Paul", positions: ["CM"] }, { name: "Oblak", positions: ["GK"] }
  ],
  "Arsenal": [
    { name: "Saka", positions: ["RW", "LB"] }, { name: "Bukayo Saka", positions: ["RW", "LB"] },
    { name: "Odegaard", positions: ["CM"] }, { name: "Martin Odegaard", positions: ["CM"] },
    { name: "Rice", positions: ["CM", "CB"] }, { name: "Declan Rice", positions: ["CM", "CB"] },
    { name: "Havertz", positions: ["ST", "CM"] }, { name: "Martinelli", positions: ["LW", "ST"] }
  ],
  // Tier 2
  "Chelsea": [
    { name: "Palmer", positions: ["RW", "CM"] }, { name: "Cole Palmer", positions: ["RW", "CM"] },
    { name: "Mudryk", positions: ["LW"] }, { name: "Jackson", positions: ["ST"] },
    { name: "Enzo", positions: ["CM"] }, { name: "Enzo Fernandez", positions: ["CM"] }, { name: "Caicedo", positions: ["CM"] }
  ],
  "Man United": [
    { name: "Rashford", positions: ["LW", "ST"] }, { name: "Marcus Rashford", positions: ["LW", "ST"] },
    { name: "Bruno", positions: ["CM", "RW"] }, { name: "Bruno Fernandes", positions: ["CM", "RW"] },
    { name: "Hojlund", positions: ["ST"] }, { name: "Mainoo", positions: ["CM"] }, { name: "Garnacho", positions: ["RW", "LW"] }
  ],
  "AC Milan": [
    { name: "Leao", positions: ["LW"] }, { name: "Rafael Leao", positions: ["LW"] },
    { name: "Pulisic", positions: ["RW", "LW"] }, { name: "Giroud", positions: ["ST"] },
    { name: "Hernandez", positions: ["LB"] }, { name: "Theo Hernandez", positions: ["LB"] }, { name: "Maignan", positions: ["GK"] }
  ],
  "Dortmund": [
    { name: "Brandt", positions: ["CM", "LW"] }, { name: "Sancho", positions: ["LW", "RW"] },
    { name: "Fullkrug", positions: ["ST"] }, { name: "Adeyemi", positions: ["LW", "RW"] },
    { name: "Sabitzer", positions: ["CM"] }, { name: "Hummels", positions: ["CB"] }
  ],
  "Tottenham": [
    { name: "Son", positions: ["LW", "ST"] }, { name: "Heung-min Son", positions: ["LW", "ST"] },
    { name: "Madison", positions: ["CM"] }, { name: "James Maddison", positions: ["CM"] },
    { name: "Richarlison", positions: ["ST", "LW"] }, { name: "Kulusevski", positions: ["RW", "CM"] }, { name: "Romero", positions: ["CB"] }
  ],
  "Napoli": [
    { name: "Osimhen", positions: ["ST"] }, { name: "Victor Osimhen", positions: ["ST"] },
    { name: "Kvaratskhelia", positions: ["LW"] }, { name: "Khvicha Kvaratskhelia", positions: ["LW"] },
    { name: "Anguissa", positions: ["CM"] }, { name: "Lobotka", positions: ["CM"] }, { name: "Di Lorenzo", positions: ["RB"] }
  ],
  "Aston Villa": [
    { name: "Watkins", positions: ["ST"] }, { name: "Ollie Watkins", positions: ["ST"] },
    { name: "Bailey", positions: ["RW", "LW"] }, { name: "McGinn", positions: ["CM"] },
    { name: "Douglas Luiz", positions: ["CM"] }, { name: "Martinez", positions: ["GK"] }, { name: "Emiliano Martinez", positions: ["GK"] }
  ],
  "RB Leipzig": [
    { name: "Openda", positions: ["ST", "LW"] }, { name: "Simons", positions: ["CM", "LW", "RW"] },
    { name: "Xavi Simons", positions: ["CM", "LW", "RW"] }, { name: "Olmo", positions: ["CM", "LW"] },
    { name: "Dani Olmo", positions: ["CM", "LW"] }, { name: "Sesko", positions: ["ST"] }
  ],
  "Benfica": [
    { name: "Di Maria", positions: ["RW", "CM"] }, { name: "Angel Di Maria", positions: ["RW", "CM"] },
    { name: "Rafa", positions: ["ST", "LW"] }, { name: "Kokcu", positions: ["CM"] },
    { name: "Neves", positions: ["CM"] }, { name: "Joao Neves", positions: ["CM"] }, { name: "Otamendi", positions: ["CB"] }
  ],
  "Porto": [
    { name: "Taremi", positions: ["ST"] }, { name: "Evanilson", positions: ["ST"] },
    { name: "Galeno", positions: ["LW"] }, { name: "Pepe", positions: ["CB", "LW"] },
    { name: "Varela", positions: ["CM"] }, { name: "Diogo Costa", positions: ["GK"] }
  ],
  "Roma": [
    { name: "Dybala", positions: ["ST", "CM"] }, { name: "Paulo Dybala", positions: ["ST", "CM"] },
    { name: "Lukaku", positions: ["ST"] }, { name: "Romelu Lukaku", positions: ["ST"] },
    { name: "Pellegrini", positions: ["CM"] }, { name: "Cristante", positions: ["CM", "CB"] }, { name: "Mancini", positions: ["CB"] }
  ],
  // Tier 3
  "West Ham": [
    { name: "Bowen", positions: ["RW", "ST"] }, { name: "Jarrod Bowen", positions: ["RW", "ST"] },
    { name: "Kudus", positions: ["RW", "CM"] }, { name: "Mohammed Kudus", positions: ["RW", "CM"] },
    { name: "Paqueta", positions: ["CM"] }, { name: "Antonio", positions: ["ST"] }
  ],
  "Villarreal": [
    { name: "Gerard Moreno", positions: ["ST", "RW"] }, { name: "Sorloth", positions: ["ST"] },
    { name: "Baena", positions: ["CM", "LW"] }, { name: "Alex Baena", positions: ["CM", "LW"] },
    { name: "Parejo", positions: ["CM"] }
  ],
  "Sevilla": [
    { name: "En-Nesyri", positions: ["ST"] }, { name: "Ocampos", positions: ["RW", "LW"] },
    { name: "Ramos", positions: ["CB"] }, { name: "Sergio Ramos", positions: ["CB"] },
    { name: "Suso", positions: ["RW", "CM"] }, { name: "Navas", positions: ["RB", "RW"] }
  ],
  "Brighton": [
    { name: "Mitoma", positions: ["LW"] }, { name: "Kaoru Mitoma", positions: ["LW"] },
    { name: "Pedro", positions: ["ST", "LW"] }, { name: "Joao Pedro", positions: ["ST", "LW"] },
    { name: "Gross", positions: ["CM", "RB"] }, { name: "Ferguson", positions: ["ST"] }
  ],
  "Lazio": [
    { name: "Immobile", positions: ["ST"] }, { name: "Ciro Immobile", positions: ["ST"] },
    { name: "Luis Alberto", positions: ["CM"] }, { name: "Zaccagni", positions: ["LW"] },
    { name: "Felipe Anderson", positions: ["RW", "LW"] }, { name: "Romagnoli", positions: ["CB"] }
  ],
  "Real Sociedad": [
    { name: "Oyarzabal", positions: ["LW", "ST"] }, { name: "Mikel Oyarzabal", positions: ["LW", "ST"] },
    { name: "Kubo", positions: ["RW", "CM"] }, { name: "Takefusa Kubo", positions: ["RW", "CM"] },
    { name: "Merino", positions: ["CM"] }, { name: "Zubimendi", positions: ["CM"] }, { name: "Remiro", positions: ["GK"] }
  ],
  "Newcastle": [
    { name: "Isak", positions: ["ST"] }, { name: "Alexander Isak", positions: ["ST"] },
    { name: "Gordon", positions: ["LW", "RW"] }, { name: "Anthony Gordon", positions: ["LW", "RW"] },
    { name: "Bruno Guimaraes", positions: ["CM"] }, { name: "Joelinton", positions: ["CM", "LW"] }, { name: "Trippier", positions: ["RB"] }
  ],
  "Girona": [
    { name: "Dovbyk", positions: ["ST"] }, { name: "Artem Dovbyk", positions: ["ST"] },
    { name: "Savio", positions: ["LW", "RW"] }, { name: "Tsygankov", positions: ["RW"] },
    { name: "Aleix Garcia", positions: ["CM"] }, { name: "Miguel Gutierrez", positions: ["LB"] }
  ],
  "Athletic Club": [
    { name: "Inaki Williams", positions: ["RW", "ST"] }, { name: "Nico Williams", positions: ["LW"] },
    { name: "Sancet", positions: ["CM"] }, { name: "Guruzeta", positions: ["ST"] },
    { name: "Vivian", positions: ["CB"] }, { name: "Unai Simon", positions: ["GK"] }
  ],
  "Fiorentina": [
    { name: "Nico Gonzalez", positions: ["RW", "LW"] }, { name: "Beltran", positions: ["ST", "CM"] },
    { name: "Bonaventura", positions: ["CM"] }, { name: "Arthur", positions: ["CM"] },
    { name: "Biraghi", positions: ["LB"] }
  ],
  "Everton": [
    { name: "Calvert-Lewin", positions: ["ST"] }, { name: "McNeil", positions: ["LW"] },
    { name: "Doucoure", positions: ["CM"] }, { name: "Onana", positions: ["CM"] },
    { name: "Amadou Onana", positions: ["CM"] }, { name: "Pickford", positions: ["GK"] }, { name: "Jordan Pickford", positions: ["GK"] }
  ]
}
