import { renderHook } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useNormalization } from './use-normalization'

describe('useNormalization', () => {
  it('should convert strings to lowercase', () => {
    const { result } = renderHook(() => useNormalization())
    expect(result.current.normalize('PUTELLAS')).toBe('putellas')
  })

  it('should remove accents and diacritics', () => {
    const { result } = renderHook(() => useNormalization())
    expect(result.current.normalize('Bonmatí')).toBe('bonmati')
    expect(result.current.normalize('Özil')).toBe('ozil')
    expect(result.current.normalize('Čeferin')).toBe('ceferin')
  })

  it('should handle special characters like ß, æ, ø', () => {
    const { result } = renderHook(() => useNormalization())
    expect(result.current.normalize('Reusß')).toBe('reusss')
    expect(result.current.normalize('Ægir')).toBe('aegir')
    expect(result.current.normalize('Ødegaard')).toBe('odegaard')
  })

  it('should handle polish characters like ł', () => {
    const { result } = renderHook(() => useNormalization())
    expect(result.current.normalize('Błaszczykowski')).toBe('blaszczykowski')
  })

  it('should handle icelandic characters like þ', () => {
    const { result } = renderHook(() => useNormalization())
    expect(result.current.normalize('Þorsteinsson')).toBe('thorsteinsson')
  })

  it('should trim whitespace', () => {
    const { result } = renderHook(() => useNormalization())
    expect(result.current.normalize('  Alexia  ')).toBe('alexia')
  })

  it('should handle null or undefined input', () => {
    const { result } = renderHook(() => useNormalization())
    expect(result.current.normalize(null)).toBe('')
    expect(result.current.normalize(undefined)).toBe('')
  })
})
