"use client"

import Link from "next/link"

import { Instagram } from "lucide-react"

/**
 * Footer Component
 * 
 * Provides global navigation for legal terms, about section, and social links.
 * Matches the application's premium glassmorphism aesthetic.
 */
export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card/90 backdrop-blur-md py-4 mt-auto shadow-[0_-1px_3px_rgba(0,0,0,0.05)] mobile-footer">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mobile-footer-wrapper">
          {/* --- LEFT SECTION: BRAND & COPYRIGHT --- */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-primary tracking-tight">PannaStreet</span>
            </div>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} PannaStreet. All rights reserved.
            </p>
          </div>

          {/* --- CENTER SECTION: LEGAL LINKS --- */}
          <nav className="flex flex-wrap justify-center gap-x-12 gap-y-2 mobile-footer-nav">
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
              href="/about" 
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
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </Link>
              <Link
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm"
                aria-label="X (Twitter)"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153ZM17.61 20.644h2.039L6.486 3.24H4.298L17.61 20.644Z" />
                </svg>
              </Link>
              <Link
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm"
                aria-label="Discord"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2758-3.6806-.2758-5.4873 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1971.3728.2914a.077.077 0 01-.0066.1277 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
