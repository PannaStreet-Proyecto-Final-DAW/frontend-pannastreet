"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface GameResultCardProps {
  title: string
  subtitle?: string
  children?: React.ReactNode
  thanksMessage?: string
  className?: string
  noCard?: boolean
}

export function GameResultCard({
  title,
  subtitle,
  children,
  thanksMessage = "Thanks for playing! See you tomorrow",
  className,
  noCard = false
}: GameResultCardProps) {
  const content = (
    <div className={cn("text-center", !noCard && "pt-6 pb-6 px-6")}>
      <h2 className="text-2xl font-bold text-primary mb-1">
        {title}
      </h2>

      {subtitle && (
        <p className="text-xs text-muted-foreground mb-6">
          {subtitle}
        </p>
      )}

      {children && (
        <div className="mb-6">
          {children}
        </div>
      )}

      <div className="mt-4 pt-4 max-w-sm mx-auto">
        <p className="text-primary text-[11px] font-bold italic uppercase tracking-wider">
          {thanksMessage}
        </p>
      </div>
    </div>
  )

  if (noCard) {
    return <div className={className}>{content}</div>
  }

  return (
    <Card className={cn("border-border bg-card", className)}>
      <CardContent className="p-0">
        {content}
      </CardContent>
    </Card>
  )
}
