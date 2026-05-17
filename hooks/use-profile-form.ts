"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"

interface UseProfileFormProps {
  onSuccess?: () => void
}

export function useProfileForm({ onSuccess }: UseProfileFormProps = {}) {
  const { user, updateUser, isLoading } = useAuth()
  const [userName, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

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

    if (password && !currentPassword) {
      setError("Please enter your current password to change it")
      setIsSubmitting(false)
      return
    }

    if (!user?.id) return

    const result = await updateUser(user.id, userName, email, password || undefined, currentPassword || undefined)

    if (result.success) {
      toast.success("Profile updated successfully")
      if (onSuccess) onSuccess()
    } else {
      setError(result.error || "Failed to update profile")
    }
    setIsSubmitting(false)
  }

  return {
    userName,
    setUserName,
    email,
    setEmail,
    password,
    setPassword,
    currentPassword,
    setCurrentPassword,
    showPassword,
    setShowPassword,
    showCurrentPassword,
    setShowCurrentPassword,
    error,
    isSubmitting,
    isLoading,
    user,
    handleSubmit
  }
}
