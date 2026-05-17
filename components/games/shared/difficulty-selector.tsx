"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DifficultySelectorProps {
  value: string
  onChange: (value: string) => void
  options?: string[]
  disabled?: boolean
}

export function DifficultySelector({ 
  value, 
  onChange, 
  options = ["Easy", "Intermediate", "Hard"],
  disabled = false
}: DifficultySelectorProps) {
  return (
    <div>
      <p className="text-white text-[11px] font-bold mb-2 uppercase tracking-wider">Select difficulty:</p>
      <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
        {options.map((opt) => (
          <Button
            key={opt}
            variant={value === opt ? "default" : "secondary"}
            onClick={() => onChange(opt)}
            disabled={disabled}
            className={cn(
              "rounded-full px-4 h-7 text-[11px] transition-all duration-300",
              value === opt 
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "bg-primary/10 hover:bg-primary/20 text-black/70 dark:text-white/70",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            size="sm"
          >
            {opt}
          </Button>
        ))}
      </div>
    </div>
  )
}
