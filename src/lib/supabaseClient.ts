import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a singleton instance with lazy initialization
let supabaseInstance: SupabaseClient | null = null

/**
 * Get the Supabase client instance
 * Returns null if environment variables are not configured
 */
export function getSupabase(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables not configured. Using local storage fallback.')
    return null
  }
  
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  }
  
  return supabaseInstance
}

/**
 * Check if Supabase is configured
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey)
}

/**
 * Legacy export for backward compatibility
 * @deprecated Use getSupabase() instead
 */
export const supabase = isSupabaseConfigured() 
  ? createClient(supabaseUrl!, supabaseAnonKey!) 
  : (null as unknown as SupabaseClient)

// Export types for database tables
export interface DatabaseProject {
  id: string
  project_id: string
  project_name: string
  owner_name?: string
  consultant_name?: string
  contract_number?: string
  contract_value?: number
  contract_start_date?: string
  contract_end_date?: string
  project_location?: string
  description?: string
  initiative?: string
  template?: string
  status: 'draft' | 'in-progress' | 'completed'
  current_step: number
  progress?: number
  health?: 'on-track' | 'watch' | 'blocked'
  created_at: string
  updated_at: string
}
