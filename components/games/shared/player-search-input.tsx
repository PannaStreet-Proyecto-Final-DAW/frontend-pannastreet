/**
 * PlayerSearchInput: Shared component to search for players.
 * Supports "floating" (dropdown) and "inline" (list) display modes.
 * Now primarily a presentational component meant to be used with usePlayerSearch hook.
 */
"use client"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { SearchResult } from "@/hooks/use-player-search"

interface PlayerSearchInputProps {
  // Controlled Input Props
  value: string
  onChange: (value: string) => void
  onSelect: (result: SearchResult) => void
  results: SearchResult[]

  // Selection Props (usually from usePlayerSearch)
  selectedIndex?: number
  setSelectedIndex?: (index: number) => void
  resultsContainerRef?: React.RefObject<HTMLDivElement | null>
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void

  // Customization Props
  placeholder?: string
  error?: string | null
  mode?: "floating" | "inline"
  onSubmit?: () => void
  autoFocus?: boolean
}

export function PlayerSearchInput({
  value,
  onChange,
  onSelect,
  results,
  selectedIndex = -1,
  setSelectedIndex,
  resultsContainerRef,
  onKeyDown,
  placeholder = "Search...",
  error,
  mode = "floating",
  onSubmit,
  autoFocus
}: PlayerSearchInputProps) {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.()
  }

  // Common input styling based on mode
  const inputClassNames = cn(
    mode === "inline"
      ? "bg-primary/5 dark:bg-input border-primary/20 dark:border-border h-9 text-sm mb-3 rounded-xl focus-visible:ring-primary/30 text-primary dark:text-foreground placeholder:text-primary/40 dark:placeholder:text-muted-foreground"
      : "bg-input border-border"
  )

  return (
    <div className={cn("w-full", mode === "floating" ? "relative" : "")}>
      {/* Search Input Field */}
      <form onSubmit={handleSubmit} className="relative w-full">
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          className={inputClassNames}
          autoComplete="off"
          autoFocus={autoFocus}
        />
        {/* Animated error message display */}
        {error && (
          <p className="text-destructive text-[10px] font-bold mt-1 animate-pulse absolute top-full mt-1">
            {error}
          </p>
        )}
      </form>

      {/* Results Display - Floating Mode (Dropdown style) */}
      {mode === "floating" && results.length > 0 && (
        <div
          ref={resultsContainerRef} // Attached to the hook's auto-scroll logic
          className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-10 overflow-hidden p-2 space-y-1"
        >
          {results.map((result, index) => (
            <button
              key={result.id}
              type="button"
              onClick={() => onSelect(result)}
              onMouseEnter={() => setSelectedIndex?.(index)}
              className={cn(
                "w-full flex items-center justify-between p-2.5 rounded-xl transition-all duration-300 border shadow-sm group",
                "bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 hover:border-primary/30",
                "dark:bg-secondary/40 dark:border-secondary/20 dark:text-card-foreground dark:hover:bg-secondary/60 dark:hover:border-primary/50",
                // Highlight item if selected via keyboard
                index === selectedIndex && "bg-primary/10 border-primary/30 dark:bg-secondary/60 dark:border-primary/50"
              )}
            >
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest opacity-70 group-hover:opacity-100 group-hover:text-primary transition-all",
                index === selectedIndex && "opacity-100 text-primary"
              )}>
                {result.primaryText}
              </span>
              {result.secondaryText && (
                <span className={cn(
                  "text-[10px] font-bold opacity-50 group-hover:opacity-100 transition-all",
                  index === selectedIndex && "opacity-100"
                )}>
                  {result.secondaryText}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Results Display - Inline Mode (List style) */}
      {mode === "inline" && (
        <div
          ref={resultsContainerRef} // Attached to the hook's auto-scroll logic
          className="space-y-1 max-h-56 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-primary/20"
        >
          {results.map((result, index) => (
            <button
              key={result.id}
              type="button"
              onClick={() => onSelect(result)}
              onMouseEnter={() => setSelectedIndex?.(index)}
              className={cn(
                "w-full flex items-center justify-between p-2.5 rounded-xl transition-all duration-300 border shadow-sm group",
                "bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 hover:border-primary/30",
                "dark:bg-secondary/40 dark:border-secondary/20 dark:text-card-foreground dark:hover:bg-secondary/60 dark:hover:border-primary/50",
                // Highlight item if selected via keyboard
                index === selectedIndex && "bg-primary/10 border-primary/30 dark:bg-secondary/60 dark:border-primary/50"
              )}
            >
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest opacity-70 group-hover:opacity-100 group-hover:text-primary transition-all",
                index === selectedIndex && "opacity-100 text-primary"
              )}>
                {result.primaryText}
              </span>
              {result.secondaryText && (
                <span className={cn(
                  "text-[10px] font-bold opacity-50 group-hover:opacity-100 transition-all",
                  index === selectedIndex && "opacity-100"
                )}>
                  {result.secondaryText}
                </span>
              )}
            </button>
          ))}
          {/* Feedback when search returns nothing */}
          {results.length === 0 && value.length >= 3 && (
            <p className="text-center text-xs text-muted-foreground py-4 italic">No results found</p>
          )}
        </div>
      )}
    </div>
  )
}
