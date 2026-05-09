"use client"

import Link from "next/link"

import { Linkedin } from "lucide-react"

/**
 * Footer Component
 * 
 * Provides global navigation for legal terms, about section, and social links.
 * Matches the application's premium glassmorphism aesthetic.
 */
export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card/90 backdrop-blur-md py-8 mt-auto shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* --- LEFT SECTION: BRAND & COPYRIGHT --- */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-primary tracking-tight">PannaMaster</span>
            </div>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} PannaMaster. All rights reserved.
            </p>
          </div>

          {/* --- CENTER SECTION: LEGAL LINKS --- */}
          <nav className="flex flex-wrap justify-center gap-x-12 gap-y-2">
            <Link 
              href="/terms" 
              className="text-sm font-bold text-muted-foreground hover:text-primary dark:text-white dark:hover:text-primary transition-all duration-200"
            >
              Terms & Conditions
            </Link>
            <Link 
              href="/privacy" 
              className="text-sm font-bold text-muted-foreground hover:text-primary dark:text-white dark:hover:text-primary transition-all duration-200"
            >
              Privacy Policy
            </Link>
            <Link 
              href="#" 
              className="text-sm font-bold text-muted-foreground hover:text-primary dark:text-white dark:hover:text-primary transition-all duration-200"
            >
              About Us
            </Link>
          </nav>

          {/* --- RIGHT SECTION: SOCIAL LINKS --- */}
          <div className="flex items-center gap-4">
            <p className="text-sm font-semibold text-primary hidden md:block">Connect with us:</p>
            <div className="flex gap-3">
              <Link
                href="https://www.linkedin.com/in/alberto-casas-ramirez"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm"
                aria-label="Alberto Casas Ramirez LinkedIn"
              >
                <Linkedin size={20} />
              </Link>
              <Link
                href="https://www.linkedin.com/in/candela-martinez-casas/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm"
                aria-label="Candela Martinez Casas LinkedIn"
              >
                <Linkedin size={20} />
              </Link>
              <Link
                href="https://www.linkedin.com/in/ivan-garcia-santos"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm"
                aria-label="Ivan Garcia Santos LinkedIn"
              >
                <Linkedin size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
