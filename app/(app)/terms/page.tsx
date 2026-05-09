"use client"

import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 animate-in fade-in duration-700">
      <Link 
        href="/games" 
        className="inline-flex items-center gap-1 text-white hover:text-primary transition-colors mb-8 text-sm"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Games
      </Link>

      <div className="bg-card border border-border rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
        
        <h1 className="text-2xl md:text-3xl font-black italic uppercase text-primary mb-8 tracking-tighter leading-none">
          Terms & Conditions
        </h1>
        
        <div className="space-y-8 text-muted-foreground leading-relaxed text-[13px] md:text-sm">
          <section>
            <h2 className="text-base font-bold text-primary mb-2 uppercase italic tracking-tight">1. Acceptance of the Agreement</h2>
            <p>
              By accessing PannaMaster, you agree to comply with and be bound by the following terms. These terms govern your relationship with our platform. We reserve the right to modify these terms at any time, and your continued use of the site signifies your acceptance of any changes.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-primary mb-2 uppercase italic tracking-tight">2. User Accounts & Security</h2>
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
            <h2 className="text-base font-bold text-primary mb-2 uppercase italic tracking-tight">3. Fair Play Policy</h2>
            <p>
              PannaMaster is built on the spirit of football competition. Any form of cheating, including the use of bots, scripts, or external databases to gain an unfair advantage in games like "Guess the Player" or "11 Clubs", is strictly prohibited and will result in immediate account suspension.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-primary mb-2 uppercase italic tracking-tight">4. Intellectual Property</h2>
            <p>
              The PannaMaster brand, our unique game mechanics, code, graphics, and interface are the exclusive property of the development team. Unauthorized reproduction or distribution of any part of this platform is a violation of copyright laws.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-primary mb-2 uppercase italic tracking-tight">5. Service Availability</h2>
            <p>
              While we strive for 100% uptime for our daily challenges, we do not guarantee that the service will be uninterrupted. We may perform maintenance or updates that could temporarily affect access to the games or your league standings.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-primary mb-2 uppercase italic tracking-tight">6. Limitation of Liability</h2>
            <p>
              PannaMaster is provided "as is". We are not liable for any direct or indirect damages resulting from your use of the platform, including but not limited to loss of data or emotional distress from losing a 90th-minute trivia challenge.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] md:text-xs font-medium">
          <p className="text-muted-foreground">© {new Date().getFullYear()} PannaMaster Legal Team</p>
          <p className="text-primary">Last updated: May 9, 2026</p>
        </div>
      </div>
    </div>
  )
}
