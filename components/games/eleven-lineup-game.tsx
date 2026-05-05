/**
 * ElevenLineupGame: A generic and modular football lineup game engine.
 * It manages a 4-3-3 formation where players must be selected from a unique set of categories (e.g., Clubs or Countries).
 */
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { FootballPitch, type SelectedPlayer } from "@/components/football-pitch"

/** Standard football positions labels used for the selection UI title */
const POSITIONS = ["GK", "LB", "CB", "CB", "RB", "CM", "CM", "CM", "LW", "ST", "RW"]

/**
 * Props for the ElevenLineupGame component
 */
interface ElevenLineupGameProps {
  /** The plural name of the category being used (e.g., "Clubs", "Countries") */
  groupLabel: string
  /** The specific 11 groups (clubs/countries) allowed for the current game session */
  availableGroups: string[]
  /** Data mapping: category name -> list of player names */
  itemsByGroup: Record<string, string[]>
  /** Callback triggered when all 11 positions are successfully filled */
  onGameOver: (success: boolean) => void
  /** Optional callback for handling the surrender action */
  onSurrender?: () => void
}

/**
 * This component handles the core gameplay loop for building an 11-player lineup.
 * It enforces the rule of one player per category (club/country).
 */
export function ElevenLineupGame({
  groupLabel,
  availableGroups,
  itemsByGroup,
  onGameOver,
}: ElevenLineupGameProps) {
  // --- Internal State ---
  
  /** The lineup array: null means the position is empty */
  const [lineup, setLineup] = useState<(SelectedPlayer | null)[]>(Array(11).fill(null))
  
  /** The ID of the position currently being edited (0-10) */
  const [currentPosition, setCurrentPosition] = useState<number | null>(null)
  
  /** User input for filtering players in the selection list */
  const [searchQuery, setSearchQuery] = useState("")

  // --- Derived State ---
  
  /** Dynamic count of how many players have been assigned to the pitch */
  const completedCount = lineup.filter(Boolean).length

  // --- Handlers ---

  /**
   * Activates a position for player selection. 
   * Prevents interaction if the game is over or the position is already filled.
   */
  const handlePositionClick = (positionId: number) => {
    if (completedCount === 11) return
    if (lineup[positionId]) return 
    setCurrentPosition(positionId)
    setSearchQuery("")
  }

  /**
   * Assigns a player to the active position and updates the global lineup state.
   * Validates that the category (club) hasn't been used yet.
   */
  const handlePlayerSelect = (group: string, item: string) => {
    if (currentPosition === null) return

    // Enforce unique category constraint
    const groupAlreadyUsed = lineup.some((l) => l && l.club === group)
    if (groupAlreadyUsed) return

    const newLineup = [...lineup]
    newLineup[currentPosition] = { positionId: currentPosition, club: group, player: item }
    
    const nextCount = newLineup.filter(Boolean).length
    setLineup(newLineup)
    setCurrentPosition(null)
    setSearchQuery("")

    // Trigger game over if the final slot (11th) is filled
    if (nextCount === 11) {
      onGameOver(true)
    }
  }

  /**
   * Logic to compute which items (players) can be displayed in the search results.
   * Excludes groups already present in the current lineup.
   */
  const getFilteredResults = () => {
    const usedGroups = new Set(lineup.filter(Boolean).map((l) => l!.club))
    const results: { group: string; item: string }[] = []

    availableGroups.forEach((group) => {
      // Don't show players from groups that are already in the lineup
      if (usedGroups.has(group)) return
      
      itemsByGroup[group]?.forEach((item) => {
        // Search by player name or group name
        if (
          searchQuery === "" ||
          item.toLowerCase().includes(searchQuery.toLowerCase()) ||
          group.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          results.push({ group, item })
        }
      })
    })

    return results.slice(0, 10) // UI limit for better usability
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_1.8fr_1fr] gap-6 items-stretch">
      
      {/* COLUMN 1: List of mandatory categories to use (Clubs/Countries) */}
      <Card className="border-border bg-card sticky top-6 md:h-full flex flex-col">
        <CardHeader className="p-3 pb-1">
          <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-card-foreground">
            {groupLabel} to Use
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="flex flex-wrap md:flex-col gap-1">
            {availableGroups.map((group) => {
              const isUsed = lineup.some((l) => l?.club === group)
              return (
                <span
                  key={group}
                  className={cn(
                    "px-2.5 py-1 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all border shadow-sm",
                    isUsed
                      ? "bg-black/5 dark:bg-white/5 border-transparent text-primary/30 dark:text-white/30 line-through"
                      : "bg-primary/5 dark:bg-secondary/40 border-primary/20 dark:border-secondary/20 text-primary dark:text-card-foreground"
                  )}
                >
                  {group}
                </span>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* COLUMN 2: Visual Football Pitch representation */}
      <Card className="border-border bg-card overflow-hidden h-full flex flex-col">
        <FootballPitch
          lineup={lineup}
          currentPosition={currentPosition}
          onPositionClick={handlePositionClick}
          gameComplete={completedCount === 11}
        />
      </Card>

      {/* COLUMN 3: Selection interface and real-time progress counter */}
      <Card className="border-border bg-card h-full flex flex-col">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold text-card-foreground">
              {currentPosition !== null
                ? `Select for ${POSITIONS[currentPosition]}`
                : completedCount === 11
                  ? "Lineup Complete!"
                  : "Choose Position"}
            </CardTitle>
            
            {/* Progress Counter Badge: 0/11 -> 11/11 */}
            <div className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-black tracking-tighter transition-all",
              completedCount === 11
                ? "bg-green-500/20 text-green-500 animate-pulse"
                : "bg-primary/10 text-primary"
            )}>
              {completedCount} / 11
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 pt-0">
          {currentPosition !== null ? (
            <>
              {/* Search input for quick player/group lookup */}
              <Input
                type="text"
                placeholder={`Search ${groupLabel.toLowerCase()} or player...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-primary/5 dark:bg-input border-primary/20 dark:border-border h-9 text-sm mb-3 rounded-xl focus-visible:ring-primary/30 text-primary dark:text-foreground placeholder:text-primary/40 dark:placeholder:text-muted-foreground"
                autoComplete="off"
                autoFocus
              />
              
              {/* Scrollable list of matches */}
              <div className="space-y-1 max-h-56 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-primary/20">
                {getFilteredResults().map(({ group, item }) => (
                  <button
                    key={`${group}-${item}`}
                    onClick={() => handlePlayerSelect(group, item)}
                    className={cn(
                      "w-full flex items-center justify-between p-2.5 rounded-xl transition-all duration-300 border shadow-sm group",
                      "bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 hover:border-primary/30",
                      "dark:bg-secondary/40 dark:border-secondary/20 dark:text-card-foreground dark:hover:bg-secondary/60 dark:hover:border-primary/50"
                    )}
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-70 group-hover:opacity-100 group-hover:text-primary transition-all">
                      {item}
                    </span>
                    <span className="text-[10px] font-bold opacity-50 group-hover:opacity-100 transition-all">
                      {group}
                    </span>
                  </button>
                ))}
                {getFilteredResults().length === 0 && (
                  <p className="text-center text-xs text-muted-foreground py-4 italic">No results found</p>
                )}
              </div>
            </>
          ) : (
            /* Empty state when no position is selected */
            <div className="text-center py-10 text-muted-foreground border-2 border-dashed border-border/50 rounded-2xl">
              <p className="text-xs font-medium">
                {completedCount === 11 
                  ? "Lineup complete!" 
                  : "Click a position on the pitch to start building your lineup"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
