import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://behebhohabohiiparyie.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types (you can generate these with Supabase CLI)
export interface Database {
  public: {
    Tables: {
      // Add your table types here
      // Example:
      // users: {
      //   Row: { id: string; email: string; created_at: string }
      //   Insert: { id?: string; email: string }
      //   Update: { id?: string; email?: string }
      // }
    }
  }
}
