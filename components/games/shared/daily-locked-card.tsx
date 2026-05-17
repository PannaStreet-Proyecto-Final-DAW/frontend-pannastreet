"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, ShieldAlert, Share2, Award, Calendar, ArrowLeft, TrophyIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface DailyLockedCardProps {
  gameId: string
  gameTitle: string
  score: number
  won: boolean
}

export function DailyLockedCard({
  gameId,
  gameTitle,
  score,
  won
}: DailyLockedCardProps) {
  const router = useRouter()
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [copied, setCopied] = useState(false)

  // Calculate seconds remaining until Madrid midnight
  useEffect(() => {
    const calculateSeconds = () => {
      try {
        const formatter = new Intl.DateTimeFormat("en-US", {
          timeZone: "Europe/Madrid",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: false
        })
        const parts = formatter.formatToParts(new Date())
        const hourVal = parts.find(p => p.type === "hour")?.value
        const minVal = parts.find(p => p.type === "minute")?.value
        const secVal = parts.find(p => p.type === "second")?.value

        if (hourVal && minVal && secVal) {
          const hour = parseInt(hourVal) % 24
          const minute = parseInt(minVal)
          const second = parseInt(secVal)

          const totalSecondsInDay = 24 * 3600
          const currentSeconds = hour * 3600 + minute * 60 + second
          return totalSecondsInDay - currentSeconds
        }
      } catch (e) {
        console.error("Error calculating Madrid timezone offset:", e)
      }
      // Fallback to local timezone midnight
      const now = new Date()
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0)
      return Math.max(0, Math.floor((midnight.getTime() - now.getTime()) / 1000))
    }

    setTimeLeft(calculateSeconds())

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          return calculateSeconds()
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Format seconds into HH:MM:SS
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return [
      hrs.toString().padStart(2, "0"),
      mins.toString().padStart(2, "0"),
      secs.toString().padStart(2, "0")
    ].join(":")
  }

  // Handle results sharing (Wordle-style)
  const handleShare = () => {
    const todayStr = new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit" })
    const shareText = `PannaStreet - ${gameTitle} (${todayStr})\nResult: ${won ? "WON" : "PLAYED"}\nScore: ${score} pts\nPlay now: ${window.location.origin}/games`
    
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(err => {
      console.error("Could not copy results to clipboard:", err)
    })
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <Card className={cn(
        "relative overflow-hidden border bg-card backdrop-blur-md transition-all duration-500",
        won 
          ? "border-amber-500/30 shadow-[0_20px_50px_rgba(245,158,11,0.15)] shadow-amber-500/20" 
          : "border-red-500/30 shadow-[0_20px_50px_rgba(239,68,68,0.15)] shadow-red-500/20"
      )}>
        {/* Shimmering Top Bar decoration */}
        <div className={cn(
          "absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r",
          won ? "from-amber-500 via-yellow-400 to-amber-600" : "from-red-500 via-rose-400 to-red-600"
        )} />

        <CardContent className="pt-10 pb-8 px-6 text-center flex flex-col items-center">
          {/* Circular Shield with dynamic Icon */}
          <div className={cn(
            "w-24 h-24 rounded-full flex items-center justify-center mb-6 animate-bounce shadow-lg border",
            won 
              ? "bg-gradient-to-br from-amber-400 to-yellow-600 border-amber-300 text-white" 
              : "bg-gradient-to-br from-red-500 to-rose-600 border-red-400 text-white"
          )}>
            {won ? <Trophy className="w-12 h-12" /> : <ShieldAlert className="w-12 h-12" />}
          </div>

          {/* Heading */}
          <h2 className="text-xl font-black italic tracking-tight uppercase mb-6">
            {won ? "Daily Challenge Completed!" : "Better Luck Tomorrow!"}
          </h2>

          {/* Points Container */}
          <div className="bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 mb-8 w-full max-w-sm relative overflow-hidden group">
            {/* Ambient inner glow */}
            <div className={cn(
              "absolute inset-0 opacity-5 bg-gradient-to-br transition-opacity group-hover:opacity-10",
              won ? "from-amber-500 to-yellow-500" : "from-red-500 to-rose-500"
            )} />
            
            <p className="text-neutral-500 dark:text-neutral-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
              Score Registered:
            </p>
            <div className={cn(
              "text-3xl font-black italic tracking-tighter mb-1",
              won ? "text-amber-500" : "text-red-500"
            )}>
              +{score} PTS
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex flex-col items-center mb-10">
            <p className="text-neutral-500 dark:text-neutral-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
              Next Daily Challenge In:
            </p>
            <div className="flex items-center gap-1 bg-neutral-200/50 dark:bg-neutral-800/50 px-6 py-3 rounded-2xl border border-neutral-300/30 dark:border-neutral-700/30 backdrop-blur-md">
              <span className="text-xl font-black font-mono tracking-wider tabular-nums text-neutral-800 dark:text-white">
                {formatTime(timeLeft)}
              </span>
              <span className="relative flex h-3 w-3 ml-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
            </div>
          </div>

          {/* Interactive Button row */}
          <div className="w-full max-w-sm justify-center">
            <Button
              onClick={() => router.push("/games")}
              variant="default"
              className="w-full bg-primary text-primary-foreground font-black py-4 rounded-xl text-xs uppercase tracking-[0.1em] hover:scale-[1.03] transition-all duration-300 h-auto flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Games
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}
