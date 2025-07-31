import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// Environment variables with fallbacks for build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

// Create a singleton client for use throughout the app
export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

// Server-side client with service role key
export function createServerClient() {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseServiceKey) {
    throw new Error("Missing Supabase service role key")
  }

  return createSupabaseClient(supabaseUrl, supabaseServiceKey)
}

// Auth helpers
export const signInWithGoogle = async () => {
  const client = createClient()
  if (!client) {
    return { data: null, error: { message: "Supabase not configured" } }
  }

  const { data, error } = await client.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  return { data, error }
}

export const signOut = async () => {
  const client = createClient()
  if (!client) {
    return { error: { message: "Supabase not configured" } }
  }

  const { error } = await client.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const client = createClient()
  if (!client) {
    return { user: null, error: { message: "Supabase not configured" } }
  }

  const {
    data: { user },
    error,
  } = await client.auth.getUser()
  return { user, error }
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
          category: string
          gender: string
          rating: number
          is_featured: boolean
          is_active: boolean
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
          category: string
          gender?: string
          rating?: number
          is_featured?: boolean
          is_active?: boolean
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
          category?: string
          gender?: string
          rating?: number
          is_featured?: boolean
          is_active?: boolean
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
      collections: {
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
