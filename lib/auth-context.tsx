"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()
        if (error) {
          console.error("[v0] Error getting session:", error)
        }
        setUser(session?.user ?? null)
        console.log("[v0] Initial session loaded:", session?.user?.email || "No user")
      } catch (error) {
        console.error("[v0] Error in getInitialSession:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[v0] Auth state changed:", event, session?.user?.email)
      setUser(session?.user ?? null)
      setLoading(false)

      if (event === "SIGNED_OUT") {
        // Only reload on sign out to clear any cached data
        setTimeout(() => window.location.reload(), 100)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const signOut = async () => {
    try {
      console.log("[v0] Signing out user")
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("[v0] Error signing out:", error)
      } else {
        console.log("[v0] Sign out successful")
        window.location.href = "/"
      }
    } catch (error) {
      console.error("[v0] Error in signOut:", error)
    }
  }

  const refreshUser = async () => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()
      if (error) {
        console.error("[v0] Error refreshing user:", error)
      }
      setUser(user)
      console.log("[v0] User refreshed:", user?.email || "No user")
    } catch (error) {
      console.error("[v0] Error in refreshUser:", error)
    }
  }

  const value = {
    user,
    loading,
    signOut,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
