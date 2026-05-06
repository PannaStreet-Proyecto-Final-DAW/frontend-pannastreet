"use client"

import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface SurrenderButtonProps {
  className?: string
  onClick?: () => void
  title?: string
}

export function SurrenderButton({ className, onClick, title = "Surrender" }: SurrenderButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
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
      </AlertDialogTrigger>
      <AlertDialogContent className="border-primary/10 bg-white/90 backdrop-blur-xl dark:bg-card/95 dark:backdrop-blur-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-black uppercase tracking-tight text-primary">
            Confirm Surrender
          </AlertDialogTitle>
          <AlertDialogDescription className="text-black/80 dark:text-white/60 font-medium">
            Are you sure you want to surrender?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel className="rounded-xl border-2 border-primary/10 hover:bg-primary/5 font-bold transition-all">
            No, keep going!
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onClick}
            className="rounded-xl bg-destructive/10 hover:bg-destructive/20 text-destructive border-2 border-destructive/20 font-black uppercase tracking-widest text-xs px-6 py-2 transition-all active:scale-95 shadow-none"
          >
            Yes, Surrender
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
