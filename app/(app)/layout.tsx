"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Spinner } from "@/components/ui/spinner"
import { Navbar } from "@/components/navbar"
import { useEffect } from "react"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [isLoading, user, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-transparent">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
