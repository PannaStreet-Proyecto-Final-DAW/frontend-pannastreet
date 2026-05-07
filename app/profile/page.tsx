"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { ThemeToggle } from "@/components/theme-toggle"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"

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

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [isLoading, user, router])

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
    <div className="min-h-screen flex items-center justify-center bg-transparent p-4 relative">
      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <Image
              src="/icon.jpg"
              alt="PannaMaster Logo"
              width={80}
              height={80}
              className="rounded-full shadow-lg"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold text-foreground">PannaMaster</h1>
          <p className="text-white mt-1">Edit Your Profile</p>
        </div>

        <Card className="border-border bg-card">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-card-foreground">
              Update Information
            </CardTitle>
            <CardDescription>
              Modify your account details below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="profile-username">Username</FieldLabel>
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
                <Field>
                  <FieldLabel htmlFor="profile-email">Email</FieldLabel>
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
                <Field>
                  <FieldLabel htmlFor="profile-password">New Password (optional)</FieldLabel>
                  <Input
                    id="profile-password"
                    type="password"
                    placeholder="Leave blank to keep current"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    className="bg-input border-border"
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Min 8 characters, with uppercase, lowercase and a number.
                  </p>
                </Field>
              </FieldGroup>

              {error && (
                <p className="text-destructive text-sm mt-4 text-center">{error}</p>
              )}

              <div className="flex gap-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Spinner className="h-4 w-4" />
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-white mt-6">
          Your data is securely stored and protected.
        </p>
      </div>
    </div>
  )
}
