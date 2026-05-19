import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

let adminInstance = null;

export const getSupabaseAdmin = () => {
  if (!adminInstance) {
    adminInstance = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        storageKey: 'wb_admin_auth_token', // Isolate key completely
        storage: {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {}
        }
      }
    })
  }
  return adminInstance;
}
