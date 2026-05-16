import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useGameLogic } from './use-game-logic'

describe('useGameLogic', () => {
  // A simple scoring formula for testing
  const testScoringFormula = (attempts: any[], won: boolean) => {
    return won ? 100 - (attempts.length * 10) : 0
  }

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useGameLogic({ 
      maxAttempts: 5, 
      scoringFormula: testScoringFormula 
    }))

    expect(result.current.attempts).toHaveLength(0)
    expect(result.current.status).toBe('playing')
    expect(result.current.score).toBe(0)
    expect(result.current.isGameOver).toBe(false)
  })

  it('should transition to "won" when a winning attempt is recorded', () => {
    const { result } = renderHook(() => useGameLogic({ 
      maxAttempts: 5, 
      scoringFormula: testScoringFormula 
    }))

    act(() => {
      result.current.recordAttempt({ name: 'Winner' }, true)
    })

    expect(result.current.status).toBe('won')
    expect(result.current.score).toBe(90) // 100 - (1 * 10)
    expect(result.current.isGameOver).toBe(true)
  })

  it('should transition to "lost" when reaching max attempts', () => {
    const { result } = renderHook(() => useGameLogic({ 
      maxAttempts: 3, 
      scoringFormula: testScoringFormula 
    }))

    act(() => {
      result.current.recordAttempt({ name: 'Fail 1' }, false)
      result.current.recordAttempt({ name: 'Fail 2' }, false)
      result.current.recordAttempt({ name: 'Fail 3' }, false)
    })

    expect(result.current.status).toBe('lost')
    expect(result.current.score).toBe(0)
    expect(result.current.isGameOver).toBe(true)
  })

  it('should not allow recording attempts after game is over', () => {
    const { result } = renderHook(() => useGameLogic({ 
      maxAttempts: 3, 
      scoringFormula: testScoringFormula 
    }))

    act(() => {
      result.current.recordAttempt({ name: 'Win' }, true)
    })

    const attemptsCountBefore = result.current.attempts.length

    act(() => {
      result.current.recordAttempt({ name: 'Ghost' }, false)
    })

    expect(result.current.attempts.length).toBe(attemptsCountBefore)
  })

  it('should reset the game state correctly', () => {
    const { result } = renderHook(() => useGameLogic({ 
      maxAttempts: 5, 
      scoringFormula: testScoringFormula 
    }))

    act(() => {
      result.current.recordAttempt({ name: 'Some guess' }, false)
      result.current.reset()
    })

    expect(result.current.attempts).toHaveLength(0)
    expect(result.current.status).toBe('playing')
    expect(result.current.score).toBe(0)
  })
})
