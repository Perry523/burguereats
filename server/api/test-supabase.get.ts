import { supabase } from '../utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    // Test Supabase connection by checking if we can connect
    const { data, error } = await supabase.from('companies').select('count').limit(1)
    
    if (error) {
      console.error('Supabase error:', error)
      return {
        success: false,
        error: error.message,
        message: 'Supabase connection failed'
      }
    }

    return {
      success: true,
      message: 'Supabase connection successful',
      data: data
    }
  } catch (error) {
    console.error('Test Supabase error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to test Supabase connection'
    }
  }
})
