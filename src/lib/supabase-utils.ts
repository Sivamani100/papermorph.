import { supabase } from './supabase'

// Auth utilities
export const auth = {
  signUp: async (email: string, password: string) => {
    return await supabase.auth.signUp({ email, password })
  },
  
  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password })
  },
  
  signOut: async () => {
    return await supabase.auth.signOut()
  },
  
  getCurrentUser: async () => {
    return await supabase.auth.getUser()
  },
  
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Database utilities
export const db = {
  // Generic CRUD operations
  select: async <T>(table: string, columns = '*') => {
    return await supabase.from(table).select(columns)
  },
  
  insert: async <T>(table: string, data: Partial<T>) => {
    return await supabase.from(table).insert(data)
  },
  
  update: async <T>(table: string, data: Partial<T>, match: Partial<T>) => {
    return await supabase.from(table).update(data).match(match)
  },
  
  delete: async <T>(table: string, match: Partial<T>) => {
    return await supabase.from(table).delete().match(match)
  },
  
  // Query helpers
  query: (table: string) => supabase.from(table)
}

// Storage utilities
export const storage = {
  upload: async (bucket: string, path: string, file: File) => {
    return await supabase.storage.from(bucket).upload(path, file)
  },
  
  download: async (bucket: string, path: string) => {
    return await supabase.storage.from(bucket).download(path)
  },
  
  getPublicUrl: (bucket: string, path: string) => {
    return supabase.storage.from(bucket).getPublicUrl(path)
  },
  
  remove: async (bucket: string, paths: string[]) => {
    return await supabase.storage.from(bucket).remove(paths)
  }
}

// Error handling helper
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error)
  return error?.message || 'An unknown error occurred'
}
