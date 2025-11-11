import { createClient } from '@supabase/supabase-js'

export function createSupabaseClient() {
  const config = useRuntimeConfig()
  const key = config.supabaseServiceRoleKey || config.supabaseAnonKey

  if (!config.supabaseUrl || !key) {
    throw new Error('Supabase environment variables are not configured')
  }

  return createClient(config.supabaseUrl, key)
}

export const supabase = createSupabaseClient()
