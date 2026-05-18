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
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { Menu } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const navLinks = [
  { href: "/games", label: "Games" },
  { href: "/leagues", label: "Leagues" },
]

/**
 * Navbar Component
 * 
 * This is the main navigation header for the application.
 * It provides links to different modules, a theme toggle, and a user profile dropdown.
 */
export function Navbar() {
  // Access authentication context for user data and logout functionality.
  const { user, logout } = useAuth()

  /**
   * usePathname: Hook to get the current URL path.
   * Used to highlight the active link in the navigation menu.
   */
  const pathname = usePathname()

  /**
   * handleLogout: Handles the sign-out process.
   * Clears session data and redirects the user to the landing page.
   */
  const router = useRouter()

  /**
   * handleLogout: Handles the sign-out process.
   * Clears session data and redirects the user to the landing page.
   */
  const handleLogout = () => {
    logout()
    window.location.href = "/"
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/90 backdrop-blur-md shadow-sm">
      <div className="container mx-auto flex h-[72px] items-center justify-between px-6">
        {/* --- LOGO SECTION --- */}
        <Link href="/games" className="flex items-center gap-3">
          <div className="flex items-center justify-center shrink-0">
            <Image
              src="/icon.webp"
              alt="PannaStreet Logo"
              width={42}
              height={42}
              className="rounded-full shadow-md"
              priority
            />
          </div>
          <span className="font-bold text-lg text-primary tracking-tight">PannaStreet</span>
        </Link>

        {/* --- NAVIGATION LINKS (Desktop & Tablet) --- */}
        <nav className="nav-desktop-links items-center gap-2 tablet-ls-nav-gap">
          {pathname === "/profile" ? (
            <div className="px-4 py-2 rounded-xl text-sm font-bold bg-primary/10 text-primary shadow-sm">
              Edit Profile
            </div>
          ) : (
            navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                /**
                 * Dynamic Styling:
                 * 1. If active: Apply primary background/text and a subtle shadow.
                 * 2. If inactive: Use muted colors with a hover effect.
                 * 3. Mode awareness: In dark mode, inactive links turn white as per user preference.
                 */
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200",
                  pathname === link.href || pathname.startsWith(link.href + "/")
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-muted-foreground dark:text-white hover:text-primary hover:bg-primary/5"
                )}
              >
                {link.label}
              </Link>
            ))
          )}
        </nav>

        {/* --- USER ACTIONS & SETTINGS --- */}
        <div className="flex items-center gap-2">
          {/* ThemeToggle: Component to switch between Light and Dark modes */}
          <ThemeToggle />

          {/* Mobile Menu Trigger (Only for screens < 600px) */}
          <div className="nav-mobile-trigger">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-muted-foreground hover:text-primary">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-1/2 bg-card/95 backdrop-blur-xl border-border/50 p-0 flex flex-col">
                <SheetHeader className="p-6 border-b border-border/50 flex flex-row items-center gap-4">
                  <Image src="/icon.webp" alt="PannaStreet Logo" width={32} height={32} className="rounded-full" />
                  <SheetTitle className="text-primary font-black italic tracking-tighter uppercase">{user?.userName || "Options"}</SheetTitle>
                </SheetHeader>

                <div className="flex-1 flex flex-col p-4 gap-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-2 mb-2">Navigation</p>
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200",
                        pathname === link.href || pathname.startsWith(link.href + "/")
                          ? "bg-primary/10 text-primary shadow-sm"
                          : "text-muted-foreground dark:text-white hover:bg-primary/5 hover:text-primary"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}

                  <DropdownMenuSeparator className="my-4 bg-border/50" />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-2 mb-2">Account</p>
                  <Link
                    href="/profile"
                    className={cn(
                      "flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200",
                      pathname === "/profile"
                        ? "bg-primary/10 text-primary shadow-sm"
                        : "text-muted-foreground dark:text-white hover:bg-primary/5 hover:text-primary"
                    )}
                  >
                    Edit Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold text-destructive hover:bg-destructive/10 transition-all duration-200 text-left"
                  >
                    Sign out
                  </button>
                </div>

              </SheetContent>
            </Sheet>
          </div>

          {/* User Profile Dropdown Menu (Desktop & Tablet) */}
          <div className="nav-desktop-links">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-3 py-4 px-3 h-auto text-muted-foreground hover:bg-primary/5 hover:text-primary rounded-xl transition-all"
                >
                  {/* User Avatar: Displays the first letter of the username */}
                  <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center border border-primary/10 shadow-inner">
                    <span className="text-sm font-bold text-primary">
                      {user?.userName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  {/* Username label (hidden on small mobile screens) */}
                  <span className="hidden md:inline text-sm font-semibold">
                    {user?.userName}
                  </span>
                  {/* Downward arrow icon for the dropdown */}
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

              {/* Dropdown Content */}
              <DropdownMenuContent align="end" className="w-48 bg-popover border-border">
                {/* User Identity Header */}
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-popover-foreground">{user?.userName}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                {/* Edit Profile Action */}
                <DropdownMenuItem
                  onClick={() => router.push("/profile")}
                  className="cursor-pointer"
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Edit Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {/* Sign Out Action */}
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
        </div>
      </div>
    </header>
  )
}
