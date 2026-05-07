"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { ChevronLeft } from "lucide-react"

/**
 * ProfilePage Component
 * 
 * A full page for editing user profile details.
 * Mirrored after the registration/login page for consistency.
 */
export default function ProfilePage() {
  const { user, updateUser, isLoading } = useAuth()
  const [userName, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()


  // Initialize fields with current user data
  useEffect(() => {
    if (user) {
      setUserName(user.userName)
      setEmail(user.email)
    }
  }, [user])

  const validatePassword = (pass: string) => {
    if (!pass) return true // Password change is optional
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    return regex.test(pass)
  }

  const validateEmail = (emailStr: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(emailStr)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    // Validations
    if (!userName.trim()) {
      setError("Username is required")
      setIsSubmitting(false)
      return
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      setIsSubmitting(false)
      return
    }

    if (password && !validatePassword(password)) {
      setError("Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, and a number.")
      setIsSubmitting(false)
      return
    }

    if (!user?.id) return

    const result = await updateUser(user.id, userName, email, password || undefined)

    if (result.success) {
      toast.success("Profile updated successfully")
      // Optionally redirect or just stay here
      router.push("/games")
    } else {
      setError(result.error || "Failed to update profile")
    }
    setIsSubmitting(false)
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto py-4 px-4 animate-in fade-in slide-in-from-top-4 duration-700">
      {/* Back Button */}
      <button
        onClick={() => router.push("/games")}
        className="w-fit -ml-2 mb-6 text-white hover:text-primary transition-colors text-sm flex items-center gap-1 bg-transparent border-none p-0"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to PannaMaster
      </button>

      <div className="w-full">

        <Card className="border-border bg-card shadow-xl overflow-hidden">
          <CardHeader className="text-center pb-2 pt-4">
            <CardTitle className="text-lg text-card-foreground">
              Update Information
            </CardTitle>
            <CardDescription className="text-[10px]">
              Modify your account details below
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-4 pt-0">
            <form onSubmit={handleSubmit}>
              <FieldGroup className="gap-3">
                <Field className="gap-1">
                  <FieldLabel htmlFor="profile-username" className="text-xs">Username</FieldLabel>
                  <Input
                    id="profile-username"
                    type="text"
                    placeholder="Enter your username"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                    autoComplete="username"
                    className="bg-input border-border"
                  />
                </Field>
                <Field className="gap-1">
                  <FieldLabel htmlFor="profile-email" className="text-xs">Email</FieldLabel>
                  <Input
                    id="profile-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="bg-input border-border"
                  />
                </Field>
                <Field className="gap-1">
                  <FieldLabel htmlFor="profile-password" className="text-xs">New Password (optional)</FieldLabel>
                  <Input
                    id="profile-password"
                    type="password"
                    placeholder="Leave blank to keep current"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    className="bg-input border-border"
                  />
                  <p className="text-[9px] text-muted-foreground mt-0">
                    Min 8 characters, with uppercase, lowercase and a number.
                  </p>
                </Field>
              </FieldGroup>

              {error && (
                <p className="text-destructive text-sm mt-4 text-center">{error}</p>
              )}

              <div className="flex gap-3 mt-4">
                <Button
                  type="button"
                  variant="ghost"
                  className="flex-1 rounded-xl font-bold uppercase text-[10px] tracking-widest h-10 px-6 border border-black/10 dark:border-border/20 text-black/60 dark:text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                >
                  Don't Save
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-black italic uppercase text-[10px] tracking-widest h-10 px-6 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Spinner className="h-4 w-4" />
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6 italic">
          Your data is securely stored and protected.
        </p>
      </div>
    </div>
  )
}
