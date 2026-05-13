"use client"

import { ChevronLeft, Linkedin } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 animate-in fade-in duration-700">
      <Link
        href="/games"
        className="inline-flex items-center gap-1 text-foreground hover:text-primary transition-colors mb-8 text-sm"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Games
      </Link>

      <div className="bg-card border border-border rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute top-0 left-0 w-48 h-48 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />

        <h1 className="text-2xl md:text-3xl font-black italic uppercase text-primary mb-8 tracking-tighter leading-none">
          About PannaStreet
        </h1>

        <div className="space-y-8 text-muted-foreground leading-relaxed text-[13px] md:text-sm">
          <section>
            <h2 className="text-base font-bold text-primary mb-2 uppercase italic tracking-tight">Our Mission</h2>
            <p>
              PannaStreet was born from the pure passion for the beautiful game. Our mission is simple: to provide football enthusiasts with the ultimate daily challenge to test their knowledge, strategy, and memory. We believe that every fan deserves a premium, high-stakes environment to prove their football IQ.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-primary mb-2 uppercase italic tracking-tight">The Experience</h2>
            <p className="mb-4">
              We've designed a suite of modular "cartridges"—individual game modes that challenge different aspects of your football brain:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><span className="text-card-foreground font-bold italic">11 CLUBS:</span> A tactical puzzle where you must build a complete lineup using players from 11 specific, randomly selected clubs.</li>
              <li><span className="text-card-foreground font-bold italic">GUESS THE PLAYER:</span> A daily mystery challenge where you must identify a professional player through a series of tactical hints.</li>
              <li><span className="text-card-foreground font-bold italic">TRIVIA:</span> Fast-paced questions to test your historical and current knowledge of the game.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-primary mb-2 uppercase italic tracking-tight">Global Competition</h2>
            <p>
              PannaStreet isn't just about playing alone. Through our League system, users can create private competitions with friends or climb the global leaderboard. Every point counts, and every daily challenge is an opportunity to prove you belong to the elite.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-primary mb-2 uppercase italic tracking-tight">The Development Team</h2>
            <p className="mb-6">
              PannaStreet is the result of a collaborative effort by a dedicated team of developers and football fans. We are committed to constantly evolving the platform and adding new ways to celebrate the sport.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link 
                href="https://www.linkedin.com/in/alberto-casas-ramirez" 
                target="_blank"
                className="group flex items-center justify-between p-4 bg-primary/5 border border-primary/10 rounded-2xl hover:bg-primary/10 transition-all duration-300"
              >
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-primary uppercase tracking-widest italic">Developer</span>
                  <span className="text-card-foreground font-black uppercase tracking-tighter">Alberto Casas</span>
                </div>
                <Linkedin className="w-5 h-5 text-primary/40 group-hover:text-primary transition-colors" />
              </Link>

              <Link 
                href="https://www.linkedin.com/in/candela-martinez-casas/" 
                target="_blank"
                className="group flex items-center justify-between p-4 bg-primary/5 border border-primary/10 rounded-2xl hover:bg-primary/10 transition-all duration-300"
              >
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-primary uppercase tracking-widest italic">Developer</span>
                  <span className="text-card-foreground font-black uppercase tracking-tighter">Candela Martínez</span>
                </div>
                <Linkedin className="w-5 h-5 text-primary/40 group-hover:text-primary transition-colors" />
              </Link>

              <Link 
                href="https://www.linkedin.com/in/ivan-garcia-santos" 
                target="_blank"
                className="group flex items-center justify-between p-4 bg-primary/5 border border-primary/10 rounded-2xl hover:bg-primary/10 transition-all duration-300"
              >
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-primary uppercase tracking-widest italic">Developer</span>
                  <span className="text-card-foreground font-black uppercase tracking-tighter">Iván García</span>
                </div>
                <Linkedin className="w-5 h-5 text-primary/40 group-hover:text-primary transition-colors" />
              </Link>
            </div>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] md:text-xs font-medium">
          <p className="text-muted-foreground">© {new Date().getFullYear()} PannaStreet Development Team</p>
          <p className="text-primary font-bold italic tracking-widest uppercase">Built for the fans</p>
        </div>
      </div>
    </div>
  )
}
