"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"

interface ProfileLayoutProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * ProfileLayout Component
 * 
 * Provides a form for users to edit their profile information.
 * Uses the same aesthetic as the registration form.
 */
export function ProfileLayout({ isOpen, onClose }: ProfileLayoutProps) {
  const { user, updateUser } = useAuth()
  const [userName, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Initialize fields with current user data
  useEffect(() => {
    if (user && isOpen) {
      setUserName(user.userName)
      setEmail(user.email)
      setPassword("") // Don't show current password
      setError("")
    }
  }, [user, isOpen])

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
      onClose()
    } else {
      setError(result.error || "Failed to update profile")
    }
    setIsSubmitting(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl text-card-foreground">Edit Profile</DialogTitle>
          <DialogDescription>
            Update your account information below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="edit-username">Username</FieldLabel>
              <Input
                id="edit-username"
                type="text"
                placeholder="Enter your username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                className="bg-input border-border"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="edit-email">Email</FieldLabel>
              <Input
                id="edit-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-input border-border"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="edit-password">New Password (optional)</FieldLabel>
              <Input
                id="edit-password"
                type="password"
                placeholder="Enter new password to change it"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Spinner className="h-4 w-4" /> : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
