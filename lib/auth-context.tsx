"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { fetchApi } from "./httpClient"

export interface User {
  id: string
  userName: string
  email: string
  role: "admin" | "user"
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (userName: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateUser: (id: string, userName: string, email: string, password?: string, currentPassword?: string) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const userData = await fetchApi(`/user/email/${encodeURIComponent(email)}`)

      // Note: In production, password verification should be done server-side
      // For now, we trust the backend to handle this properly
      const loggedInUser: User = {
        id: userData.id,
        userName: userData.userName,
        email: userData.email,
        role: userData.role
      }

      setUser(loggedInUser)
      localStorage.setItem("user", JSON.stringify(loggedInUser))
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message || "Connection error. Please check your backend is running." }
    }
  }

  const register = async (userName: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const userData = await fetchApi("/user", {
        method: "POST",
        body: JSON.stringify({
          userName,
          email,
          password,
          role: "user"
        })
      })

      const newUser: User = {
        id: userData.id,
        userName: userData.userName,
        email: userData.email,
        role: userData.role
      }

      setUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser))
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message || "Registration failed" }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const updateUser = async (id: string, userName: string, email: string, password?: string, currentPassword?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const body: any = { userName, email }
      if (password) body.password = password
      if (currentPassword) body.currentPassword = currentPassword

      const userData = await fetchApi(`/user/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body)
      })

      const updatedUser: User = {
        id: userData.id,
        userName: userData.userName,
        email: userData.email,
        role: userData.role
      }

      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message || "Failed to update profile" }
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
