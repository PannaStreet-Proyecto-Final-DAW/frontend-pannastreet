/**
 * GameLayout: A wrapper component that provides a consistent header with
 * navigation (Back button) and gameplay controls (Surrender button).
 */
"use client"

import Link from "next/link"
import { SurrenderButton } from "../shared/surrender-button"

interface GameLayoutProps {
  backHref?: string       // Destination URL for the back button
  backOnClick?: () => void // Optional custom click handler for navigation
  backText: string         // Label for the back button (e.g., "Back to Games")
  showSurrender?: boolean  // Controls visibility of the Red Card/Surrender button
  onSurrender?: () => void // Function triggered when surrendering
  children: React.ReactNode // The actual game content to be displayed
}

export function GameLayout({
  backHref,
  backOnClick,
  backText,
  showSurrender,
  onSurrender,
  children
}: GameLayoutProps) {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="relative flex flex-col items-center justify-center mb-6">
        <div className="absolute left-0 top-0">
          {backHref ? (
            <Link href={backHref} className="text-white hover:text-primary text-sm flex items-center gap-1 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              {backText}
            </Link>
          ) : (
            <button
              onClick={backOnClick}
              className="text-white hover:text-primary text-sm flex items-center gap-1 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              {backText}
            </button>
          )}
        </div>
        <div className="h-8 md:h-10" />
        {showSurrender && (
          <div className="absolute right-0 top-0">
            <SurrenderButton
              onClick={onSurrender || (() => { })}
              title="Surrender"
            />
          </div>
        )}
      </div>
      {children}
    </div>
  )
}
