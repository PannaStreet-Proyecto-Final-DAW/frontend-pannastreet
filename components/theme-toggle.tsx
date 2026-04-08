"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Wait until mounted on client to avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-xl bg-secondary/50 border border-border/50"
        disabled
      >
        <Sun className="h-[1.2rem] w-[1.2rem] text-primary/50" />
      </Button>
    )
  }

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark")
    else if (theme === "dark") setTheme("system")
    else setTheme("light")
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      className="relative h-10 w-10 rounded-xl bg-secondary/50 hover:bg-secondary/80 text-foreground transition-all duration-300 shadow-sm border border-border/50"
      title={
        theme === "system"
          ? "Modo: Sistema"
          : theme === "light"
            ? "Modo: Claro"
            : "Modo: Oscuro"
      }
    >
      <div className="relative h-full w-full flex items-center justify-center">
        {theme === "light" && (
          <Sun className="h-[1.2rem] w-[1.2rem] text-primary transition-all animate-in zoom-in-50 duration-300" />
        )}
        {theme === "dark" && (
          <Moon className="h-[1.2rem] w-[1.2rem] text-primary transition-all animate-in zoom-in-50 duration-300" />
        )}
        {theme === "system" && (
          <Monitor className="h-[1.2rem] w-[1.2rem] text-primary transition-all animate-in zoom-in-50 duration-300" />
        )}
      </div>
      <span className="sr-only">Cambiar tema</span>
    </Button>
  )
}
