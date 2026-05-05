/**
 * PlayerSearchInput: Shared component to search for players.
 * Supports "floating" (dropdown) and "inline" (list) display modes.
 */
"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface SearchResult {
  id: string
  primaryText: string
  secondaryText?: string
  originalData?: any
}

interface PlayerSearchInputProps {
  value: string
  onChange: (value: string) => void
  onSelect: (result: SearchResult) => void
  results: SearchResult[]
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
  placeholder = "Search...",
  error,
  mode = "floating",
  onSubmit,
  autoFocus
}: PlayerSearchInputProps) {
  const [selectedIndex, setSelectedIndex] = useState(-1)

  // Reset selected index when search changes or results update
  useEffect(() => {
    setSelectedIndex(-1)
  }, [value, results.length])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (results.length === 0) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        onSelect(results[selectedIndex])
        setSelectedIndex(-1)
      } else if (onSubmit) {
        onSubmit()
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.()
  }

  // Common input styling based on mode, extracted from existing components
  const inputClassNames = cn(
    mode === "inline"
      ? "bg-primary/5 dark:bg-input border-primary/20 dark:border-border h-9 text-sm mb-3 rounded-xl focus-visible:ring-primary/30 text-primary dark:text-foreground placeholder:text-primary/40 dark:placeholder:text-muted-foreground"
      : "bg-input border-border"
  )

  return (
    <div className={cn("w-full", mode === "floating" ? "relative" : "")}>
      <form onSubmit={handleSubmit} className="relative w-full">
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className={inputClassNames}
          autoComplete="off"
          autoFocus={autoFocus}
        />
        {error && (
          <p className="text-destructive text-[10px] font-bold mt-1 animate-pulse absolute top-full mt-1">
            {error}
          </p>
        )}
      </form>

      {/* Floating Mode: Used by Guess the Player */}
      {mode === "floating" && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-10 overflow-hidden p-2 space-y-1">
          {results.map((result, index) => (
            <button
              key={result.id}
              type="button"
              onClick={() => onSelect(result)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={cn(
                "w-full flex items-center justify-between p-2.5 rounded-xl transition-all duration-300 border shadow-sm group",
                "bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 hover:border-primary/30",
                "dark:bg-secondary/40 dark:border-secondary/20 dark:text-card-foreground dark:hover:bg-secondary/60 dark:hover:border-primary/50",
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

      {/* Inline Mode: Used by 11 Clubs */}
      {mode === "inline" && (
        <div className="space-y-1 max-h-56 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-primary/20">
          {results.map((result, index) => (
            <button
              key={result.id}
              type="button"
              onClick={() => onSelect(result)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={cn(
                "w-full flex items-center justify-between p-2.5 rounded-xl transition-all duration-300 border shadow-sm group",
                "bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 hover:border-primary/30",
                "dark:bg-secondary/40 dark:border-secondary/20 dark:text-card-foreground dark:hover:bg-secondary/60 dark:hover:border-primary/50",
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
          {results.length === 0 && value.length >= 3 && (
            <p className="text-center text-xs text-muted-foreground py-4 italic">No results found</p>
          )}
        </div>
      )}
    </div>
  )
}
