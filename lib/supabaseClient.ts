// Re-export from the main supabase file for compatibility
export { supabase } from "./supabase"
export { createClient, createServerClient, signInWithGoogle, signOut, getCurrentUser } from "./supabase"
export type { Database } from "./supabase"
