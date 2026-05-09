"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, Trophy, Users, Zap, Globe } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function AboutPage() {
  const stats = [
    { label: "Active Players", value: "10K+", icon: <Users className="w-4 h-4" /> },
    { label: "Games Played", value: "250K+", icon: <Zap className="w-4 h-4" /> },
    { label: "Leagues Created", value: "500+", icon: <Trophy className="w-4 h-4" /> },
    { label: "Countries", value: "40+", icon: <Globe className="w-4 h-4" /> },
  ]

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Link 
        href="/games" 
        className="inline-flex items-center gap-2 text-white hover:text-primary transition-colors mb-6 text-sm font-bold"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Games
      </Link>

      <header className="mb-16 text-center">
        <div className="inline-flex items-center justify-center mb-6">
          <Image
            src="/icon.jpg"
            alt="PannaMaster Logo"
            width={100}
            height={100}
            className="rounded-full shadow-2xl border-2 border-primary/20"
          />
        </div>
        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase text-primary leading-none mb-4">
          About PannaMaster
        </h1>
        <p className="text-xl text-white/80 max-w-2xl mx-auto font-medium">
          The ultimate daily challenge for football fans worldwide.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-white uppercase italic tracking-tight">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            PannaMaster was born from the passion for the beautiful game. Our mission is to provide football enthusiasts with a daily dose of excitement through brain-teasing games and competitive leagues.
          </p>
          <p className="text-muted-foreground leading-relaxed text-lg">
            Whether you're testing your knowledge in "Guess the Player", strategy in "11 Clubs", or speed in "Trivia", we aim to be the first destination for your morning football fix.
          </p>
          
          <div className="grid grid-cols-2 gap-4 pt-4">
            {stats.map((stat, i) => (
              <div key={i} className="bg-card border border-border p-4 rounded-2xl">
                <div className="flex items-center gap-2 text-primary mb-1">
                  {stat.icon}
                  <span className="text-xs font-bold uppercase tracking-wider">{stat.label}</span>
                </div>
                <div className="text-2xl font-black text-white">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <Card className="relative bg-card border-border h-full overflow-hidden flex items-center justify-center p-8">
            <div className="text-center space-y-6">
              <Trophy className="w-20 h-20 text-primary mx-auto animate-bounce" style={{ animationDuration: '3s' }} />
              <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Join the Elite</h3>
              <p className="text-muted-foreground">
                Compete in global leagues, create private groups with your friends, and prove that you are the ultimate PannaMaster.
              </p>
              <Link href="/games" className="inline-block w-full">
                <button className="w-full bg-primary text-primary-foreground font-black py-4 rounded-xl text-sm hover:scale-[1.02] transition-transform shadow-lg uppercase tracking-widest">
                  Start Playing Now
                </button>
              </Link>
            </div>
          </Card>
        </div>
      </div>

      <section className="bg-card border border-border rounded-[2.5rem] p-10 md:p-16 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full" />
        <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-primary mb-6">
          The Team
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-10">
          PannaMaster is developed by a dedicated group of football fans and software engineers who believe that every fan deserves a premium experience to test their football IQ daily.
        </p>
        <div className="flex justify-center gap-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black">AC</div>
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black">PM</div>
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black">DAW</div>
        </div>
      </section>
    </div>
  )
}
