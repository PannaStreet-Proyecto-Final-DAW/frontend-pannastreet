"use client"

import { useRouter } from "next/navigation"
import { ProfileForm } from "@/components/profile/profile-form"
import { ChevronLeft } from "lucide-react"

/**
 * ProfilePage Component
 * 
 * A full page for editing user profile details.
 * Uses the ProfileForm component for logic and UI.
 */
export default function ProfilePage() {
  const router = useRouter()

  return (
    <div className="max-w-2xl mx-auto py-4 px-4 animate-in fade-in slide-in-from-top-4 duration-700">
      {/* Back Button */}
      <button
        onClick={() => router.push("/games")}
        className="w-fit -ml-2 mb-6 text-white hover:text-primary transition-colors text-sm flex items-center gap-1 bg-transparent border-none p-0"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to games
      </button>

      <div className="w-full">
        <ProfileForm 
          onCancel={() => router.back()} 
          onSuccess={() => router.push("/games")}
        />
      </div>
    </div>
  )
}
