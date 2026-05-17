"use client"

import { useProfileForm } from "@/hooks/use-profile-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { Eye, EyeOff } from "lucide-react"

interface ProfileFormProps {
  onCancel?: () => void
  onSuccess?: () => void
}

export function ProfileForm({ onCancel, onSuccess }: ProfileFormProps) {
  const {
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
  } = useProfileForm({ onSuccess })

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    )
  }

  return (
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
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
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
              <FieldLabel htmlFor="profile-password" className="text-xs">New Password (Optional)</FieldLabel>
              <div className="relative">
                <Input
                  id="profile-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Leave blank to keep current"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  className="bg-input border-border pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[9px] text-muted-foreground mt-0">
                Min 8 characters, with uppercase, lowercase and a number.
              </p>
            </Field>

            {password && (
              <Field className="gap-1 animate-in fade-in slide-in-from-top-2 duration-300">
                <FieldLabel htmlFor="current-password" className="text-xs">Current Password (Required to change password)</FieldLabel>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required={!!password}
                    autoComplete="current-password"
                    className="bg-input border-primary/20 focus:border-primary pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </Field>
            )}
          </FieldGroup>

          {error && (
            <p className="text-destructive text-sm mt-4 text-center">{error}</p>
          )}

          <div className="flex gap-3 mt-4">
            {onCancel && (
              <Button
                type="button"
                variant="ghost"
                className="flex-1 rounded-xl font-bold uppercase text-[10px] tracking-widest h-10 px-6 border border-black/10 dark:border-border/20 text-black/60 dark:text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Don't Save
              </Button>
            )}
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
  )
}
