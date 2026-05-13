import { useState, useEffect, useRef, useCallback, useMemo } from "react"

/**
 * SearchResult: Standardized interface for search suggestions across all games.
 */
export interface SearchResult {
  id: string
  primaryText: string
  secondaryText?: string
  originalData?: any
}

interface UsePlayerSearchOptions<T> {
  items: T[]                                      // The raw data source to search through
  filterFn: (query: string, items: T[]) => SearchResult[] // Custom filtering logic provided by the game
  onSelect: (result: SearchResult) => void        // Callback triggered when a result is confirmed
  wrapAround?: boolean                            // If true, Up/Down arrows wrap around the list
  minLength?: number                              // Minimum characters to trigger search
  maxResults?: number                             // Maximum suggestions to display
}

/**
 * usePlayerSearch: Custom hook that centralizes search state, keyboard navigation, 
 * and accessibility features like auto-scrolling.
 */
export function usePlayerSearch<T>({
  items,
  filterFn,
  onSelect,
  wrapAround = false,
  minLength = 3,
  maxResults = 10
}: UsePlayerSearchOptions<T>) {
  // --- States ---
  const [query, setQuery] = useState("")          // Current text input value
  const [selectedIndex, setSelectedIndex] = useState(-1) // Currently highlighted index via keyboard
  const resultsContainerRef = useRef<HTMLDivElement>(null) // Ref to the scrollable container

  /**
   * Memoized Results:
   * Only re-calculate the filtered list if the query or the source items change.
   */
  const results = useMemo(() => {
    if (query.length < minLength) return []
    return filterFn(query, items).slice(0, maxResults)
  }, [query, items, filterFn, minLength, maxResults])

  /**
   * Selection Reset:
   * Whenever the result list changes (new search or filtered items), 
   * reset the highlighted index to -1.
   */
  useEffect(() => {
    setSelectedIndex(-1)
  }, [results.length])

  /**
   * Auto-scroll Effect:
   * Ensures the highlighted item is always visible within the scrollable container.
   */
  useEffect(() => {
    if (selectedIndex >= 0 && resultsContainerRef.current) {
      const selectedElement = resultsContainerRef.current.children[selectedIndex] as HTMLElement
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: "nearest",
          behavior: "auto"
        })
      }
    }
  }, [selectedIndex])

  /**
   * Keyboard Handler:
   * Manages ArrowUp, ArrowDown, Enter, and Escape keys.
   */
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (results.length === 0) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      // If at bottom, either wrap to top (0) or stay at bottom
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : (wrapAround ? 0 : prev)))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      // If at top, either wrap to bottom (length-1) or stay at top/clear
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : (wrapAround ? results.length - 1 : prev)))
    } else if (e.key === "Enter") {
      e.preventDefault()
      // Confirm selection if an index is highlighted
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        onSelect(results[selectedIndex])
        setSelectedIndex(-1)
      }
    } else if (e.key === "Escape") {
      // Clear search and reset focus
      setQuery("")
      setSelectedIndex(-1)
    }
  }, [results, selectedIndex, onSelect, wrapAround])

  /**
   * Manual Selection:
   * Helper to handle clicks on suggestion items.
   */
  const selectResult = useCallback((result: SearchResult) => {
    onSelect(result)
    setSelectedIndex(-1)
  }, [onSelect])

  /**
   * Clear Utility:
   * Resets the entire search state.
   */
  const resetSearch = useCallback(() => {
    setQuery("")
    setSelectedIndex(-1)
  }, [])

  return {
    query,
    setQuery,
    results,
    selectedIndex,
    setSelectedIndex,
    handleKeyDown,
    resultsContainerRef,
    selectResult,
    resetSearch
  }
}
