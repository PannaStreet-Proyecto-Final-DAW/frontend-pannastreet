import { Navbar } from "@/components/layout/navbar"

export default function FooterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 bg-transparent">
      <Navbar />
      <main className="container mx-auto px-4 pt-4 pb-8">
        {children}
      </main>
    </div>
  )
}
