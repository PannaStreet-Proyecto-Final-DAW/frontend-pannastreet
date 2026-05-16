"use client"

import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 animate-in fade-in duration-700 tablet-v-legal-container">
      <Link
        href="/games"
        className="inline-flex items-center gap-1 text-white hover:text-primary transition-colors mb-8 text-sm"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Games
      </Link>

      <div className="bg-card border border-border rounded-[2rem] p-8 md:px-24 md:py-12 shadow-2xl relative overflow-hidden tablet-v-legal-card">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

        <h1 className="text-2xl md:text-3xl font-black italic uppercase text-primary mb-8 tracking-tighter leading-none">
          Terms & Conditions
        </h1>

        <div className="space-y-8 text-muted-foreground leading-relaxed text-[13px] md:text-sm text-justify tablet-v-legal-text">
          <section>
            <h2 className="text-base font-bold text-primary mb-2 uppercase italic tracking-tight tablet-v-legal-h2">1. Acceptance of the Agreement</h2>
            <p>
              Welcome to PannaStreet. By using our platform, you agree to these terms, which help us maintain a fair and fun environment for all football fans. We may update these terms occasionally to reflect new features or changes in our service. We also encourage you to read our <Link href="/privacy" className="text-primary font-bold hover:underline">Privacy Policy</Link> to understand how we protect and handle your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-primary mb-2 uppercase italic tracking-tight tablet-v-legal-h2">2. User Accounts & Security</h2>
            <p className="mb-2">
              To enjoy the full experience, including leagues and daily tracking, you must create an account. You are solely responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Maintaining the confidentiality of your credentials.</li>
              <li>All activities that occur under your account.</li>
              <li>Providing accurate and up-to-date information.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-primary mb-2 uppercase italic tracking-tight tablet-v-legal-h2">3. Fair Play Policy</h2>
            <p>
              PannaStreet is built on the spirit of football competition. Any form of cheating, including the use of bots, scripts, or external databases to gain an unfair advantage in games like "Guess the Player" or "11 Clubs", is strictly prohibited and will result in immediate account suspension.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-primary mb-2 uppercase italic tracking-tight tablet-v-legal-h2">4. Intellectual Property</h2>
            <p>
              The PannaStreet brand, our unique game mechanics, code, graphics, and interface are the exclusive property of the development team. Unauthorized reproduction or distribution of any part of this platform is a violation of copyright laws.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-primary mb-2 uppercase italic tracking-tight tablet-v-legal-h2">5. Service & Disclaimer</h2>
            <p>
              We work hard to ensure PannaStreet is always available and running smoothly. However, we may perform maintenance or updates that could temporarily affect access to the games or your league standings. Please understand that this platform is provided for entertainment purposes, and we cannot be held responsible for technical interruptions, minor bugs, or temporary loss of game progress. We appreciate your support as we continue to improve the experience for all fans.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] md:text-xs font-medium">
          <p className="text-muted-foreground">© {new Date().getFullYear()} PannaStreet Legal Team</p>
          <p className="text-primary">Last updated: May 15, 2026</p>
        </div>
      </div>
    </div>
  )
}
