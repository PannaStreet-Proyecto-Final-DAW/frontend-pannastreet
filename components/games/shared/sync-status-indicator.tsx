/**
 * SyncStatusIndicator: A reusable UI component to show the status of backend synchronization.
 * Displays a toast-like notification for syncing, success, or error states.
 */
"use client"

import { cn } from "@/lib/utils"

interface SyncStatusIndicatorProps {
  status: "idle" | "syncing" | "success" | "error"
}

/**
 * A small toast-like indicator displayed at the bottom right 
 * to show the status of backend synchronization.
 */
export function SyncStatusIndicator({ status }: SyncStatusIndicatorProps) {
  if (status === "idle") return null

  const config = {
    syncing: {
      text: "Syncing score...",
      styles: "bg-primary/10 border-primary text-primary"
    },
    success: {
      text: "Points saved!",
      styles: "bg-green-500/10 border-green-500 text-green-500"
    },
    error: {
      text: "Error saving points",
      styles: "bg-destructive/10 border-destructive text-destructive"
    }
  }

  const { text, styles } = config[status as keyof typeof config]

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-right-4">
      <div className={cn(
        "px-4 py-2 rounded-xl shadow-lg text-xs font-bold border",
        styles
      )}>
        {text}
      </div>
    </div>
  )
}
