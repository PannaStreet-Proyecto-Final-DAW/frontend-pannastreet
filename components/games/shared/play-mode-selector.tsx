"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PlayModeSelectorProps {
  value: "practice" | "daily"
  onChange: (value: "practice" | "daily") => void
  dailyCompleted?: boolean
}

export function PlayModeSelector({
  value,
  onChange,
  dailyCompleted = false
}: PlayModeSelectorProps) {
  return (
    <div className="w-full">
      <p className="text-white text-[11px] font-black mb-2 uppercase tracking-wider text-center md:text-left">
        Select Game Mode:
      </p>
      
      <div className="grid grid-cols-2 p-1 bg-neutral-200/50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-300/30 dark:border-neutral-700/30 backdrop-blur-md">
        
        {/* Practice Mode Tab */}
        <button
          onClick={() => onChange("practice")}
          className={cn(
            "relative py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-500",
            value === "practice"
              ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] scale-[1.02]"
              : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
          )}
        >
          Practice Mode
        </button>

        {/* Daily Challenge Tab */}
        <button
          onClick={() => onChange("daily")}
          className={cn(
            "relative py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-500 overflow-hidden flex items-center justify-center gap-1.5",
            value === "daily"
              ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-[0_4px_20px_rgba(245,158,11,0.3)] scale-[1.02]"
              : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
          )}
        >
          {/* Subtle gold shine effect on active daily challenge */}
          {value === "daily" && (
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite] pointer-events-none" />
          )}
          
          Daily Challenge
          
          {dailyCompleted && (
            <span className="bg-emerald-500/20 text-emerald-400 text-[9px] px-1.5 py-0.5 rounded-full font-bold ml-1 border border-emerald-500/30">
              Done
            </span>
          )}
        </button>
      </div>
    </div>
  )
}
