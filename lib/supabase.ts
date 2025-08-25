import { createBrowserClient, createServerClient } from "@supabase/ssr"

// Environment variables with fallbacks for build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: false,
      detectSessionInUrl: true,
      flowType: "pkce",
      storageKey: "stitch-pop-auth",
    },
    global: {
      fetch: async (url, options = {}) => {
        try {
          console.log("[v0] Supabase fetch to:", url)

          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

          const response = await fetch(url, {
            ...options,
            signal: controller.signal,
          })

          clearTimeout(timeoutId)
          console.log("[v0] Supabase fetch success:", response.status)
          return response
        } catch (error) {
          console.error("[v0] Supabase fetch error:", error)
          if (error.name === "AbortError" || error.message.includes("fetch")) {
            console.log("[v0] Returning mock response to prevent auth reset")
            return new Response(JSON.stringify({ error: "Network timeout" }), {
              status: 408,
              headers: { "Content-Type": "application/json" },
            })
          }
          throw error
        }
      },
    },
  })
}

// Server-side Supabase client that reads user sessions from cookies
export async function createSupabaseServerClient() {
  const { cookies } = await import("next/headers")
  const cookieStore = cookies()

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch {
          // The `set` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
      remove(name: string, options: any) {
        try {
          cookieStore.set({ name, value: "", ...options })
        } catch {
          // The `delete` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

export function createServiceRoleClient() {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseServiceKey) {
    throw new Error("Missing Supabase service role key")
  }

  return createServerClient(supabaseUrl, supabaseServiceKey, {
    cookies: {
      get() {
        return undefined
      },
      set() {},
      remove() {},
    },
  })
}

// Legacy export for backward compatibility
export const supabase = createClient()

export const signInWithGoogle = async () => {
  try {
    const client = createClient()

    const { data, error } = await client.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    })
    return { data, error }
  } catch (error) {
    console.error("[v0] Google sign-in error:", error)
    return { data: null, error: { message: "Network error during sign-in" } }
  }
}

export const signOut = async () => {
  try {
    const client = createClient()
    const { error } = await client.auth.signOut()
    return { error }
  } catch (error) {
    console.error("[v0] Sign-out error:", error)
    return { error: { message: "Network error during sign-out" } }
  }
}

export const getCurrentUser = async () => {
  try {
    const client = createClient()
    const {
      data: { session },
      error,
    } = await client.auth.getSession()
    return { user: session?.user || null, error }
  } catch (error) {
    console.error("[v0] Get user error:", error)
    return { user: null, error: { message: "Network error getting user" } }
  }
}

export const signUpWithEmail = async (email: string, password: string, name: string) => {
  try {
    const client = createClient()

    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          name,
        },
      },
    })
    return { data, error }
  } catch (error) {
    console.error("[v0] Sign-up error:", error)
    return { data: null, error: { message: "Network error during sign-up" } }
  }
}

export const resetPassword = async (email: string) => {
  try {
    const client = createClient()

    const { data, error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    return { data, error }
  } catch (error) {
    console.error("[v0] Reset password error:", error)
    return { data: null, error: { message: "Network error during password reset" } }
  }
}

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      themes: {
        Row: {
          id: string
          name: string
          description: string | null
          image_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          image_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          image_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          gender: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          gender: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          gender?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          original_price: number | null
          images: string[]
          sizes: string[]
          colors: string[]
          stock: number
          category_id: string
          theme_id: string | null
          gender: string
          rating: number
          is_featured: boolean
          is_active: boolean
          is_on_sale: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          original_price?: number | null
          images?: string[]
          sizes?: string[]
          colors?: string[]
          stock?: number
          category_id: string
          theme_id?: string | null
          gender?: string
          rating?: number
          is_featured?: boolean
          is_active?: boolean
          is_on_sale?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          original_price?: number | null
          images?: string[]
          sizes?: string[]
          colors?: string[]
          stock?: number
          category_id?: string
          theme_id?: string | null
          gender?: string
          rating?: number
          is_featured?: boolean
          is_active?: boolean
          is_on_sale?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      cart: {
        Row: {
          id: string
          user_id: string
          product_id: string
          quantity: number
          size: string | null
          color: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          quantity?: number
          size?: string | null
          color?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          quantity?: number
          size?: string | null
          color?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          product_id: string
          user_id: string
          rating: number
          title: string
          comment: string
          is_verified: boolean
          helpful_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          user_id: string
          rating: number
          title: string
          comment: string
          is_verified?: boolean
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          user_id?: string
          rating?: number
          title?: string
          comment?: string
          is_verified?: boolean
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
