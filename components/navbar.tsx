"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/games", label: "Games" },
  { href: "/leagues", label: "Leagues" },
]

export function Navbar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  const handleLogout = () => {
    logout()
    window.location.href = "/"
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto flex h-[72px] items-center justify-between px-6">
        {/* Logo */}
        <Link href="/games" className="flex items-center gap-3">
          <div className="flex items-center justify-center shrink-0">
            <Image 
              src="/icon.jpg" 
              alt="PannaMaster Logo" 
              width={42} 
              height={42} 
              className="rounded-full shadow-md"
              priority
            />
          </div>
          <span className="font-bold text-lg text-foreground tracking-tight">PannaMaster</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-4 py-2 rounded-xl text-base font-semibold transition-all duration-200",
                pathname === link.href || pathname.startsWith(link.href + "/")
                  ? "bg-primary/15 text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/70"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-3 py-4 px-3 h-auto text-foreground hover:bg-secondary/70 rounded-xl transition-all"
            >
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center border border-primary/10 shadow-inner">
                <span className="text-sm font-bold text-primary">
                  {user?.userName?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="hidden md:inline text-sm font-semibold">
                {user?.userName}
              </span>
              <svg
                className="w-4 h-4 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-popover border-border">
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-popover-foreground">{user?.userName}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive cursor-pointer focus:text-destructive"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
