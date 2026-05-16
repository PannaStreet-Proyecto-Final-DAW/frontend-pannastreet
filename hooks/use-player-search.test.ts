import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { usePlayerSearch, SearchResult } from './use-player-search'

describe('usePlayerSearch', () => {
  const realPlayers = [
    { name: 'Alessia Russo', id: 'e38ffc75-94ba-452f-a34b-8bd08e4a583b', gender: 'female', team: 'Arsenal', league: 'WSL' },
    { name: 'Ingrid Engen', id: 'fa069e67-89c6-4424-9af1-48cdc9da1c02', gender: 'female', team: 'Olympique de Lyon', league: 'Premiere Ligue' },
    { name: 'Antony', id: '30549fda-e560-4d8d-952a-f31130eb03f4', gender: 'male', team: 'Real Betis', league: 'La Liga' },
    { name: 'Michael Olise', id: '25ad42cb-1158-4089-9c4a-e996a0ca2229', gender: 'male', team: 'Bayern München', league: 'Bundesliga' },
    { name: 'Lia Walti', id: '8278eacb-3036-4dda-a0f3-49631ca46ae8', gender: 'female', team: 'Juventus', league: 'Serie A' },
  ]

  const playerFilter = (query: string, items: typeof realPlayers): SearchResult[] => {
    return items
      .filter(item => item.name.toLowerCase().includes(query.toLowerCase()))
      .map(item => ({
        id: item.id,
        primaryText: item.name,
      }))
  }

  const onSelectCallback = vi.fn()

  it('should return empty results when query is shorter than minLength', () => {
    const { result } = renderHook(() => 
      usePlayerSearch({
        items: realPlayers,
        filterFn: playerFilter,
        onSelect: onSelectCallback,
        minLength: 3
      })
    )

    act(() => {
      result.current.setQuery('Al')
    })

    expect(result.current.results).toHaveLength(0)
  })

  it('should return filtered results when query is valid', () => {
    const { result } = renderHook(() => 
      usePlayerSearch({
        items: realPlayers,
        filterFn: playerFilter,
        onSelect: onSelectCallback,
        minLength: 3
      })
    )

    act(() => {
      result.current.setQuery('Alessia')
    })

    expect(result.current.results).toHaveLength(1)
    expect(result.current.results[0].primaryText).toBe('Alessia Russo')
  })

  it('should handle keyboard navigation (ArrowDown)', () => {
    const { result } = renderHook(() => 
      usePlayerSearch({
        items: realPlayers,
        filterFn: playerFilter,
        onSelect: onSelectCallback,
        minLength: 1
      })
    )

    act(() => {
      result.current.setQuery('li') // Should match Alessia and Lia
    })

    expect(result.current.results).toHaveLength(2)
    expect(result.current.selectedIndex).toBe(-1)

    act(() => {
      // Simulate ArrowDown
      const event = { key: 'ArrowDown', preventDefault: vi.fn() } as any
      result.current.handleKeyDown(event)
    })

    expect(result.current.selectedIndex).toBe(0)

    act(() => {
      // Simulate ArrowDown again
      const event = { key: 'ArrowDown', preventDefault: vi.fn() } as any
      result.current.handleKeyDown(event)
    })

    expect(result.current.selectedIndex).toBe(1)
  })

  it('should call onSelect when Enter is pressed on a selected index', () => {
    const { result } = renderHook(() => 
      usePlayerSearch({
        items: realPlayers,
        filterFn: playerFilter,
        onSelect: onSelectCallback,
        minLength: 1
      })
    )

    act(() => {
      result.current.setQuery('Alessia')
    })

    act(() => {
      // Highlight the first result
      const downEvent = { key: 'ArrowDown', preventDefault: vi.fn() } as any
      result.current.handleKeyDown(downEvent)
    })

    act(() => {
      // Press Enter
      const enterEvent = { key: 'Enter', preventDefault: vi.fn() } as any
      result.current.handleKeyDown(enterEvent)
    })

    expect(onSelectCallback).toHaveBeenCalledWith(expect.objectContaining({
      primaryText: 'Alessia Russo'
    }))
  })
})
