import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://behebhohabohiiparyie.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlaGViaG9oYWJvaGlpcGFyeWllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2NDQyMDksImV4cCI6MjA4NDIyMDIwOX0.3p0iFtzKq0FCaTARslaKatEMd5JvGclfYeLBFNdioyc'

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
