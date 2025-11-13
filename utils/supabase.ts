import { createClient } from '@supabase/supabase-js'

// Server-side Supabase client (with service key for admin operations)
// This is still needed for server-side operations with elevated privileges
export const supabaseAdmin = (config?: Record<string, unknown>) => {
  const runtimeConfig = config || useRuntimeConfig()
  return createClient(
    runtimeConfig.public.supabaseUrl,
    runtimeConfig.supabaseServiceKey
  )
}

// For client-side usage, use useSupabaseClient() composable directly in components/composables
// Example: const supabase = useSupabaseClient()

// Database types (will be expanded as we create migrations)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          profile_photo_path: string | null
          type: string
          finished_register: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          profile_photo_path?: string | null
          type?: string
          finished_register?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          profile_photo_path?: string | null
          type?: string
          finished_register?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      companies: {
        Row: {
          id: string
          name: string
          plan_id: string | null
          slug: string
          description: string | null
          logo: string | null
          banner: string | null
          whatsapp: string | null
          instagram: string | null
          buttons_color: string | null
          background_color: string | null
          cards_color: string | null
          tryal_phase: boolean
          solo_professional: boolean
          // Working hours
          sunday_time: string | null
          monday_time: string | null
          tuesday_time: string | null
          wednesday_time: string | null
          thursday_time: string | null
          friday_time: string | null
          saturday_time: string | null
          // Pause hours
          sunday_pause: string | null
          monday_pause: string | null
          tuesday_pause: string | null
          wednesday_pause: string | null
          thursday_pause: string | null
          friday_pause: string | null
          saturday_pause: string | null
          // Social media integration
          instagram_app_id: string | null
          instagram_app_secret: string | null
          instagram_redirect_uri: string | null
          facebook_app_id: string | null
          facebook_app_secret: string | null
          facebook_redirect_uri: string | null
          instagram_enabled: boolean
          facebook_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          plan_id?: string | null
          slug: string
          description?: string | null
          logo?: string | null
          banner?: string | null
          whatsapp?: string | null
          instagram?: string | null
          buttons_color?: string | null
          background_color?: string | null
          cards_color?: string | null
          tryal_phase?: boolean
          solo_professional?: boolean
          sunday_time?: string | null
          monday_time?: string | null
          tuesday_time?: string | null
          wednesday_time?: string | null
          thursday_time?: string | null
          friday_time?: string | null
          saturday_time?: string | null
          sunday_pause?: string | null
          monday_pause?: string | null
          tuesday_pause?: string | null
          wednesday_pause?: string | null
          thursday_pause?: string | null
          friday_pause?: string | null
          saturday_pause?: string | null
          instagram_app_id?: string | null
          instagram_app_secret?: string | null
          instagram_redirect_uri?: string | null
          facebook_app_id?: string | null
          facebook_app_secret?: string | null
          facebook_redirect_uri?: string | null
          instagram_enabled?: boolean
          facebook_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          plan_id?: string | null
          slug?: string
          description?: string | null
          logo?: string | null
          banner?: string | null
          whatsapp?: string | null
          instagram?: string | null
          buttons_color?: string | null
          background_color?: string | null
          cards_color?: string | null
          tryal_phase?: boolean
          solo_professional?: boolean
          sunday_time?: string | null
          monday_time?: string | null
          tuesday_time?: string | null
          wednesday_time?: string | null
          thursday_time?: string | null
          friday_time?: string | null
          saturday_time?: string | null
          sunday_pause?: string | null
          monday_pause?: string | null
          tuesday_pause?: string | null
          wednesday_pause?: string | null
          thursday_pause?: string | null
          friday_pause?: string | null
          saturday_pause?: string | null
          instagram_app_id?: string | null
          instagram_app_secret?: string | null
          instagram_redirect_uri?: string | null
          facebook_app_id?: string | null
          facebook_app_secret?: string | null
          facebook_redirect_uri?: string | null
          instagram_enabled?: boolean
          facebook_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      plans: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          max_professionals: number
          max_clients: number
          max_services: number
          max_products: number
          social_media_integration: boolean
          ai_content_generation: boolean
          advanced_analytics: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          max_professionals?: number
          max_clients?: number
          max_services?: number
          max_products?: number
          social_media_integration?: boolean
          ai_content_generation?: boolean
          advanced_analytics?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          max_professionals?: number
          max_clients?: number
          max_services?: number
          max_products?: number
          social_media_integration?: boolean
          ai_content_generation?: boolean
          advanced_analytics?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      company_users: {
        Row: {
          id: string
          company_id: string
          user_id: string
          total_spent: number
          total_scheduled: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          user_id: string
          total_spent?: number
          total_scheduled?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          user_id?: string
          total_spent?: number
          total_scheduled?: number
          created_at?: string
          updated_at?: string
        }
      }
      company_professionals: {
        Row: {
          id: string
          company_id: string
          user_id: string
          role: string | null
          status: string
          commission: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          user_id: string
          role?: string | null
          status?: string
          commission?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          user_id?: string
          role?: string | null
          status?: string
          commission?: number
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          company_id: string
          name: string
          description: string | null
          price: number
          duration: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          name: string
          description?: string | null
          price: number
          duration: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          name?: string
          description?: string | null
          price?: number
          duration?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          company_id: string
          name: string
          description: string | null
          brand: string | null
          status: 'active' | 'inactive'
          base_price: number
          quantity: number
          total_quantity_spent: number
          total_money_spent: number
          current_balance: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          name: string
          description?: string | null
          brand?: string | null
          status?: 'active' | 'inactive'
          base_price?: number
          quantity?: number
          total_quantity_spent?: number
          total_money_spent?: number
          current_balance?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          name?: string
          description?: string | null
          brand?: string | null
          status?: 'active' | 'inactive'
          base_price?: number
          quantity?: number
          total_quantity_spent?: number
          total_money_spent?: number
          current_balance?: number
          created_at?: string
          updated_at?: string
        }
      }
      // More tables will be added as we create migrations
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
