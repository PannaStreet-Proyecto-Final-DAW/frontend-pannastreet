"use client"

import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function PrivacyPage() {
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
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

        <h1 className="text-2xl md:text-3xl font-black italic uppercase text-primary mb-8 tracking-tighter leading-none">
          Privacy Policy
        </h1>

        <div className="space-y-8 text-muted-foreground leading-relaxed text-[13px] md:text-sm text-justify tablet-v-legal-text">
          <section>
            <h2 className="text-base font-bold text-primary mb-2 uppercase italic tracking-tight tablet-v-legal-h2">Information We Collect</h2>
            <p className="mb-2">
              We only collect information that is necessary to provide you with the best football gaming experience:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Account Info: Username, email address, and encrypted password.</li>
              <li>Game Progress: Scores and league memberships.</li>
              <li>Preferences: Your selected theme, Light or Dark, and notification settings.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-primary mb-2 uppercase italic tracking-tight tablet-v-legal-h2">How We Use Your Data</h2>
            <p>
              Your information is used strictly to manage your player profile, calculate leaderboard rankings, and personalize your experience. We do not sell, trade, or share your personal data with any third-party marketing companies.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-primary mb-2 uppercase italic tracking-tight tablet-v-legal-h2">Data Security & Storage</h2>
            <p>
              Security is our top priority. We use industry-standard encryption to protect your account data. All information is stored on secure servers, and we use encrypted connections (SSL) to ensure that your data is safe while in transit.
            </p>
          </section>



          <section>
            <h2 className="text-base font-bold text-primary mb-2 uppercase italic tracking-tight tablet-v-legal-h2">Your Data Rights</h2>
            <p>
              You have the right to access your data, correct any inaccuracies, or request the total deletion of your account. You can perform most of these actions directly from your profile dashboard. For complete account removal, please contact our support team.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-primary mb-2 uppercase italic tracking-tight tablet-v-legal-h2">Changes to this Policy</h2>
            <p>
              We may update our Privacy Policy from time to time as we add new features or comply with new legal requirements. We will notify you of any significant changes via email or a notice on our platform.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] md:text-xs font-medium">
          <p className="text-muted-foreground">© {new Date().getFullYear()} PannaStreet Security Team</p>
          <p className="text-primary">Last updated: May 15, 2026</p>
        </div>
      </div>
    </div>
  )
}
