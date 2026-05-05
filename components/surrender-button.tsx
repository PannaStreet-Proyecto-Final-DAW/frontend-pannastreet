"use client"

import { cn } from "@/lib/utils"

interface SurrenderButtonProps {
  className?: string
  onClick?: () => void
  title?: string
}

export function SurrenderButton({ className, onClick, title = "Surrender" }: SurrenderButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        "w-10 h-10 rounded-xl border-[3px] border-primary flex items-center justify-center transition-all duration-300",
        "bg-primary/5 dark:bg-card/50 dark:backdrop-blur-md shadow-sm dark:shadow-lg dark:shadow-primary/10",
        "hover:scale-110 hover:shadow-primary/30 hover:border-primary",
        "active:scale-95",
        "group",
        className
      )}
    >
      <svg
        className="w-5 h-7 transition-transform duration-300 group-hover:rotate-12"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Red Card Shape */}
        <rect
          x="6"
          y="3"
          width="12"
          height="18"
          rx="2"
          className="fill-red-600 stroke-red-700/50"
          strokeWidth="0.5"
        />
        {/* Subtle shine on the card */}
        <path
          d="M8 5C8 4.44772 8.44772 4 9 4H10C10.5523 4 11 4.44772 11 5V19C11 19.5523 10.5523 20 10 20H9C8.44772 20 8 19.5523 8 19V5Z"
          fill="white"
          fillOpacity="0.1"
        />
      </svg>
    </button>
  )
}
