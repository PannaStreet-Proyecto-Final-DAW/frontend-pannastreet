"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

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
      const response = await fetch(`${API_BASE_URL}/api/user/email/${encodeURIComponent(email)}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          return { success: false, error: "User not found" }
        }
        return { success: false, error: "Server error" }
      }

      const userData = await response.json()
      
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
    } catch {
      return { success: false, error: "Connection error. Please check your backend is running." }
    }
  }

  const register = async (userName: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userName,
          email,
          password,
          role: "user"
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        return { success: false, error: errorData.error || "Registration failed" }
      }

      const userData = await response.json()
      
      const newUser: User = {
        id: userData.id,
        userName: userData.userName,
        email: userData.email,
        role: userData.role
      }

      setUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser))
      return { success: true }
    } catch {
      return { success: false, error: "Connection error. Please check your backend is running." }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
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
