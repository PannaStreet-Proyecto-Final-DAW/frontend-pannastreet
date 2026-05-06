"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

interface LeagueLayoutProps {
  children: React.ReactNode
  backOnClick: () => void
  backText?: string
  title: React.ReactNode
  subtitle?: React.ReactNode
  actions?: React.ReactNode
}

/**
 * LeagueLayout: A premium wrapper component for league management.
 * Provides a consistent structure with a navigation header, editable title area,
 * and a clear delimitation for the main content (e.g., membership tables).
 */
export function LeagueLayout({
  children,
  backOnClick,
  backText = "Back",
  title,
  subtitle,
  actions,
}: LeagueLayoutProps) {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 md:py-10 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex flex-col gap-8">
        {/* Navigation & Header Section */}
        <header className="flex flex-col gap-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={backOnClick}
            className="w-fit -ml-2 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all group"
          >
            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            {backText}
          </Button>

          <div className="relative bg-card border border-border rounded-3xl p-6 md:p-10 shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 group/header">
            {/* Subtle decorative background glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 blur-[100px] rounded-full transition-colors group-hover/header:bg-primary/10" />
            
            <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-primary leading-none">
                    {title}
                  </h1>
                </div>
                {subtitle && (
                  <div className="text-muted-foreground font-medium tracking-tight">
                    {subtitle}
                  </div>
                )}
              </div>

              {actions && (
                <div className="flex flex-wrap items-center gap-3">
                  {actions}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content with Premium Framing */}
        <main className="relative group">
          {/* Subtle background glow for depth */}
          <div className="absolute -inset-4 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-[2.5rem] blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
          
          {/* Content Container */}
          <div className="relative bg-card border border-border rounded-2xl overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] transition-all duration-300">
            {/* Top decorative accent line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            
            {/* The actual content area */}
            <div className="relative">
              {children}
            </div>
          </div>
          
          {/* Bottom subtle detail */}
          <div className="mt-4 flex justify-end">
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/30 font-bold">
              PannaMaster League System
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
