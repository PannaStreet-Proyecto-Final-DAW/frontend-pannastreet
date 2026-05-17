/**
 * GameResultCard: A reusable container to show the final outcome of a game,
 * including win/loss status and game-specific result messages.
 */
"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface GameResultCardProps {
  title: string;              // Main title (e.g., "Congratulations!" or "Game Over")
  subtitle?: string;           // Optional subtitle for extra info
  children: React.ReactNode;   // Inner content (depending on the game, this will reveal the player's name or other result details)
  thanksMessage?: string;      // Custom message at the bottom
  className?: string;          // Additional CSS classes
  noCard?: boolean;            // If true, renders without the Card wrapper
}

// A reusable component to display the final result of any game.
export const GameResultCard = React.memo(function GameResultCard({
  title,
  subtitle,
  children,
  thanksMessage = "Thanks for playing! See you tomorrow",
  className,
  noCard = false
}: GameResultCardProps) {
  // Centralized content to avoid repetition in the conditional return
  const content = (
    <div className={cn("text-center", !noCard && "pt-6 pb-6 px-6")}>
      {/* Dynamic Game Title */}
      <h2 className="text-2xl font-bold text-primary mb-1">
        {title}
      </h2>

      {/* Optional Subtitle */}
      {subtitle && (
        <p className="text-xs text-muted-foreground mb-6">
          {subtitle}
        </p>
      )}

      {/* Main result details (passed as children from the parent) */}
      {children && (
        <div className="mb-6">
          {children}
        </div>
      )}

      {/* Footer message */}
      <div className="mt-4 pt-4 max-w-sm mx-auto">
        <p className="text-primary text-[11px] font-bold italic uppercase tracking-wider">
          {thanksMessage}
        </p>
      </div>
    </div>
  )

  // If noCard is true, return only the content wrapped in a div
  if (noCard) {
    return <div className={className}>{content}</div>
  }

  // Default: Return the content wrapped in a styled Card component
  return (
    <Card className={cn("border-border bg-card", className)}>
      <CardContent className="p-0">
        {content}
      </CardContent>
    </Card>
  )
})
