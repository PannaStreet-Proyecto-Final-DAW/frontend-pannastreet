"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userName, setUserName] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { login, register, user, isLoading } = useAuth()
  const router = useRouter()

  // Redirect if already logged in
  if (!isLoading && user) {
    router.push("/games")
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    if (isLogin) {
      const result = await login(email, password)
      if (result.success) {
        router.push("/games")
      } else {
        setError(result.error || "Login failed")
      }
    } else {
      if (!userName.trim()) {
        setError("Username is required")
        setIsSubmitting(false)
        return
      }
      const result = await register(userName, email, password)
      if (result.success) {
        router.push("/games")
      } else {
        setError(result.error || "Registration failed")
      }
    }
    setIsSubmitting(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <path
                strokeWidth="2"
                d="M12 2C12 2 14.5 5.5 14.5 8.5C14.5 11.5 12 14 12 14C12 14 9.5 11.5 9.5 8.5C9.5 5.5 12 2 12 2Z"
              />
              <path strokeWidth="2" d="M2.5 9.5L7 12L2.5 14.5" />
              <path strokeWidth="2" d="M21.5 9.5L17 12L21.5 14.5" />
              <path strokeWidth="2" d="M7 19L12 15L17 19" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-foreground">PannaMaster</h1>
          <p className="text-muted-foreground mt-1">Daily Football Games</p>
        </div>

        <Card className="border-border bg-card">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-card-foreground">
              {isLogin ? "Welcome back" : "Create account"}
            </CardTitle>
            <CardDescription>
              {isLogin
                ? "Sign in to continue playing"
                : "Register to start playing"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                {!isLogin && (
                  <Field>
                    <FieldLabel htmlFor="username">Username</FieldLabel>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      required={!isLogin}
                      className="bg-input border-border"
                    />
                  </Field>
                )}
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-input border-border"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="bg-input border-border"
                  />
                </Field>
              </FieldGroup>

              {error && (
                <p className="text-destructive text-sm mt-4 text-center">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Spinner className="h-4 w-4" />
                ) : isLogin ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError("")
                }}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {isLogin
                  ? "Don't have an account? Register"
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Play Wordle, Trivia, 11 Clubs and more football games daily
        </p>
      </div>
    </div>
  )
}
