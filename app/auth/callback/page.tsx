"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const supabase = createClient()

        const { searchParams } = new URL(window.location.href)
        const code = searchParams.get("code")

        if (code) {
          console.log("[v0] Auth callback: Exchanging code for session")
          const { data, error } = await supabase.auth.exchangeCodeForSession(code)

          if (error) {
            console.error("[v0] Auth callback error:", error)
            router.push("/auth/login?error=callback_error")
            return
          }

          if (data.session) {
            console.log("[v0] Auth callback: Session established for", data.session.user.email)
            // Force a page refresh to ensure cookies are properly set
            window.location.href = "/"
            return
          }
        }

        // Fallback: check existing session
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("[v0] Auth callback error:", error)
          router.push("/auth/login?error=callback_error")
          return
        }

        if (data.session) {
          console.log("[v0] Auth callback: Existing session found for", data.session.user.email)
          // User is authenticated, redirect to home
          window.location.href = "/"
        } else {
          console.log("[v0] Auth callback: No session found, redirecting to login")
          // No session, redirect to login
          router.push("/auth/login")
        }
      } catch (error) {
        console.error("[v0] Auth callback unexpected error:", error)
        router.push("/auth/login?error=unexpected_error")
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  )
}
