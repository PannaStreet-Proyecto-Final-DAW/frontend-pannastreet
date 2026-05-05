/**
 * useScoreSync: A custom hook to handle backend score synchronization.
 * It manages synchronization status and provides a function to increment user points in their league memberships.
 */
import { useState, useCallback } from "react"
import { useAuth } from "@/lib/auth-context"
import { getUserMemberships, incrementScore } from "@/lib/api"

/**
 * Custom hook to handle score synchronization with the backend.
 * Encapsulates status management, API calls to fetch memberships, and score increments.
 */
export function useScoreSync() {
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "success" | "error">("idle")
  const { user } = useAuth()

  const syncPoints = useCallback(async (score: number) => {
    if (!user?.id || score <= 0) {
      console.log("ℹ️ [useScoreSync] Skipping sync: no user or zero score");
      return;
    }

    setSyncStatus("syncing")
    try {
      console.log(`🌐 [useScoreSync] Syncing ${score} points for user ${user.id}...`);
      
      const memberships = await getUserMemberships(user.id)
      
      if (!Array.isArray(memberships) || memberships.length === 0) {
        console.log("ℹ️ [useScoreSync] User has no active league memberships.");
        setSyncStatus("success")
        return
      }

      // Filter out memberships without a valid ID
      const validMemberships = memberships.filter(m => m && m.id);
      
      console.log(`🌐 [useScoreSync] Found ${validMemberships.length} memberships. Updating scores...`);
      
      const promises = validMemberships.map(m => incrementScore(m.id, score))
      await Promise.all(promises)
      
      console.log("✅ [useScoreSync] Points synced successfully!");
      setSyncStatus("success")
    } catch (error) {
      console.error("❌ [useScoreSync] Sync failed:", error)
      setSyncStatus("error")
    }
  }, [user?.id])

  const resetSync = useCallback(() => {
    setSyncStatus("idle")
  }, [])

  return { syncStatus, syncPoints, resetSync }
}
