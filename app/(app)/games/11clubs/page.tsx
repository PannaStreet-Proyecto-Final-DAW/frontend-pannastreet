/**
 * ElevenClubsPage: The entry point for the "11 Clubs" game mode.
 * It initializes the game session with random clubs and connects the generic gameplay logic to the GameEngine.
 */
"use client"

import { useState, useEffect } from "react"
import { GameEngine } from "@/components/game-engine"
import { ElevenLineupGame } from "@/components/games/eleven-lineup-game"
import { useScoreSync } from "@/hooks/use-score-sync"
import { SyncStatusIndicator } from "@/components/sync-status-indicator"
import { FORMATIONS } from "@/lib/formations"

/** Mock list of football clubs to select from with tiers */
const CLUBS = [
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

/** Mock mapping of clubs to their top players */
const PLAYERS_BY_CLUB: Record<string, { name: string; positions: string[] }[]> = {
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

/**
 * Page component for the 11 Clubs game.
 * Manages game lifecycle states (difficulty, mode, gameOver) required by the GameEngine console.
 */
export default function ElevenClubsPage() {
  // --- Game State (Required by GameEngine) ---
  const [difficulty, setDifficulty] = useState("Easy")
  const [mode, setMode] = useState("Both")
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [score, setScore] = useState(0)

  // --- Score Synchronization Hook ---
  const { syncStatus, syncPoints, resetSync } = useScoreSync()

  // --- Game Session Data ---

  /** The 11 clubs picked for the current attempt */
  const [selectedClubs, setSelectedClubs] = useState<string[]>([])

  /** The formation picked for the current attempt */
  const [currentFormation, setCurrentFormation] = useState(FORMATIONS["4-3-3"])

  /** Track current calculated score for real-time reporting (useful for surrender) */
  const [currentCalculatedScore, setCurrentCalculatedScore] = useState(0)

  /** Unique key to force a clean remount of the game component when starting over */
  const [key, setKey] = useState(0)

  /**
   * Initializes or resets the game session.
   * Randomizes the clubs and resets all scoring/status indicators.
   * Filters clubs based on difficulty:
   * - Easy: Tier 1 only
   * - Medium: Tiers 1 and 2
   * - Hard: Tier 3 only
   */
  const initializeGame = () => {
    // 1. Filter clubs based on difficulty tier requirements
    const filteredClubs = CLUBS.filter(club => {
      if (difficulty === "Easy") return club.tier === 1;
      if (difficulty === "Medium") return club.tier === 1 || club.tier === 2;
      if (difficulty === "Hard") return club.tier === 3;
      return true;
    });

    // 2. Randomly select 11 clubs from the filtered pool
    const shuffledClubs = [...filteredClubs].sort(() => Math.random() - 0.5)
    setSelectedClubs(shuffledClubs.slice(0, 11).map(c => c.name))
    
    // 3. Randomize formation
    const formationKeys = Object.keys(FORMATIONS)
    const randomFormationKey = formationKeys[Math.floor(Math.random() * formationKeys.length)]
    setCurrentFormation(FORMATIONS[randomFormationKey])
    
    // 4. Reset states
    setGameOver(false)
    setWon(false)
    setScore(0)
    setCurrentCalculatedScore(0)
    resetSync()
    setKey(prev => prev + 1) // Trigger React to create a fresh instance of the game component
  }

  // Set up initial game on mount
  useEffect(() => {
    initializeGame()
  }, [])

  // Re-initialize game when difficulty changes (if game hasn't finished yet)
  useEffect(() => {
    if (!gameOver) {
      initializeGame()
    }
  }, [difficulty])

  /**
   * Finalizes the game session when the lineup is complete.
   * Receives the final score from the game component.
   */
  const handleGameOver = async (finalScore: number) => {
    setWon(true)
    setScore(finalScore)
    setGameOver(true)
    await syncPoints(finalScore)
  }

  /**
   * Handles the surrender action from the GameEngine header.
   * Uses the last calculated score from the component.
   */
  const handleSurrender = async () => {
    const finalScore = currentCalculatedScore
    setWon(false)
    setScore(finalScore)
    setGameOver(true)
    await syncPoints(finalScore)
  }

  return (
    <GameEngine
      gameId="11clubs"
      title={
        <>
          <span className="text-primary">FOOTBALL 11</span> <span className="text-black dark:text-white tracking-normal">CLUBS</span>
        </>
      }
      image="/images/games/11clubs.png"
      description={
        <>
          <p className="mb-2">Football 11 is a daily football game where you have to add players from 11 different clubs in one lineup.</p>
          <ul className="list-disc list-inside space-y-0 opacity-80 decoration-primary/50">
            <li>Clubs appear in random order, and you must add a player from each club.</li>
            <li>Complete the full lineup to win.</li>
            <li>Choose between 3 difficulty levels that get progressively harder.</li>
            <li>Play in Men's, Women's, or Both mode.</li>
            <li>Earn double points by playing in Both mode!</li>
            <li>You can give up by clicking the Red Card button.</li>
          </ul>
        </>
      }
      // State props for synchronization with GameEngine
      difficulty={difficulty}
      setDifficulty={setDifficulty}
      mode={mode}
      setMode={setMode}
      gameOver={gameOver}
      won={won}
      score={score}
      onReset={initializeGame}
      onSurrender={handleSurrender}
      backHref="/games"
      backText="Back to Games"
    >
      {/* Visual indicator of backend synchronization status */}
      <SyncStatusIndicator status={syncStatus} />

      {/* The "Cartridge" Component: Encapsulates the specific game UI and logic */}
      <ElevenLineupGame
        key={key}
        groupLabel="Clubs"
        availableGroups={selectedClubs}
        itemsByGroup={PLAYERS_BY_CLUB}
        difficulty={difficulty}
        mode={mode}
        formation={currentFormation}
        isGameOver={gameOver}
        onProgressUpdate={setCurrentCalculatedScore}
        onGameOver={handleGameOver}
      />
    </GameEngine>
  )
}
