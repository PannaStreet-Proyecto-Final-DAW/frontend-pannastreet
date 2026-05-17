import { describe, it, expect } from 'vitest'
import { getCountryCode } from './country-mapper'

describe('getCountryCode', () => {
  it('should return the correct ISO code for common countries', () => {
    expect(getCountryCode('Spain')).toBe('ES')
    expect(getCountryCode('Brazil')).toBe('BR')
    expect(getCountryCode('Japan')).toBe('JP')
  })

  it('should handle case insensitivity', () => {
    expect(getCountryCode('spain')).toBe('ES')
    expect(getCountryCode('SPAIN')).toBe('ES')
    expect(getCountryCode(' ArGeNtInA ')).toBe('AR')
  })

  it('should handle special cases', () => {
    expect(getCountryCode('England')).toBe('GB_ENG')
    expect(getCountryCode('United Kingdom')).toBe('GB')
    expect(getCountryCode('USA')).toBe('US')
  })

  it('should return undefined for unknown countries', () => {
    expect(getCountryCode('Neverland')).toBeUndefined()
    expect(getCountryCode('')).toBeUndefined()
  })
})
