"use client"

import { useCallback } from "react"

/**
 * Hook to provide string normalization utilities across the app.
 * Primarily used for comparing player names, teams, and nationalities
 * ignoring accents, case, and special characters.
 */
export function useNormalization() {
  /**
   * Normalizes a string by:
   * 1. Converting to NFD (Normalization Form Decomposition) to separate accents
   * 2. Removing diacritics using regex
   * 3. Replacing specific special characters not covered by NFD
   * 4. Converting to lowercase
   */
  const normalize = useCallback((str: string | null | undefined): string => {
    if (!str) return ""
    
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Cubre á, é, í, ó, ú, ñ, à, ă, å, ä, ã, ć, č, ç, è, ê, ě, ë, ę, ğ, î, ï, ò, ô, ö, ő, ō, ś, š, ş, ș
      .replace(/æ/g, "ae")             // Ligadura nórdica
      .replace(/[đð]/g, "d")           // Islandesas/Croatas
      .replace(/[ł]/g, "l")           // L polaca
      .replace(/[ß]/g, "ss")          // Eszett alemana
      .replace(/[ø]/g, "o")           // Nórdica
      .replace(/[þÞ]/g, "th")         // Thorn islandesa
      .toLowerCase()
      .trim()
  }, [])

  return { normalize }
}
