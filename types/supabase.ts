// Supabase Database Types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          profile_photo_path: string | null
          type: string
          finished_register: boolean
          instagram_link: string | null
          instagram_accounts: string[] | null
          email_verified_at: string | null
          remember_token: string | null
          two_factor_secret: string | null
          two_factor_recovery_codes: string | null
          two_factor_confirmed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          profile_photo_path?: string | null
          type?: string
          finished_register?: boolean
          instagram_link?: string | null
          instagram_accounts?: string[] | null
          email_verified_at?: string | null
          remember_token?: string | null
          two_factor_secret?: string | null
          two_factor_recovery_codes?: string | null
          two_factor_confirmed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          profile_photo_path?: string | null
          password?: string
          type?: string
          finished_register?: boolean
          email_verified_at?: string | null
          remember_token?: string | null
          two_factor_secret?: string | null
          two_factor_recovery_codes?: string | null
          two_factor_confirmed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_social_integrations: {
        Row: {
          id: string
          user_id: string
          platform: string
          platform_user_id: string
          username: string | null
          display_name: string | null
          profile_picture_url: string | null
          access_token: string
          refresh_token: string | null
          token_expires_at: string | null
          platform_data: any | null
          permissions: any | null
          is_active: boolean
          last_sync_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          platform: string
          platform_user_id: string
          username?: string | null
          display_name?: string | null
          profile_picture_url?: string | null
          access_token: string
          refresh_token?: string | null
          token_expires_at?: string | null
          platform_data?: any | null
          permissions?: any | null
          is_active?: boolean
          last_sync_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          platform?: string
          platform_user_id?: string
          username?: string | null
          display_name?: string | null
          profile_picture_url?: string | null
          access_token?: string
          refresh_token?: string | null
          token_expires_at?: string | null
          platform_data?: any | null
          permissions?: any | null
          is_active?: boolean
          last_sync_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      social_media_posts: {
        Row: {
          id: string
          company_id: string
          integration_id: string
          platform: string
          post_type: string
          status: string
          content: string
          media_urls: any | null
          hashtags: any | null
          location: string | null
          scheduled_at: string | null
          published_at: string | null
          platform_post_id: string | null
          platform_post_url: string | null
          platform_response: any | null
          analytics: any | null
          error_message: string | null
          retry_count: number
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          integration_id: string
          platform: string
          post_type: string
          status?: string
          content: string
          media_urls?: any | null
          hashtags?: any | null
          location?: string | null
          scheduled_at?: string | null
          published_at?: string | null
          platform_post_id?: string | null
          platform_post_url?: string | null
          platform_response?: any | null
          analytics?: any | null
          error_message?: string | null
          retry_count?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          integration_id?: string
          platform?: string
          post_type?: string
          status?: string
          content?: string
          media_urls?: any | null
          hashtags?: any | null
          location?: string | null
          scheduled_at?: string | null
          published_at?: string | null
          platform_post_id?: string | null
          platform_post_url?: string | null
          platform_response?: any | null
          analytics?: any | null
          error_message?: string | null
          retry_count?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      ai_generations: {
        Row: {
          id: string
          company_id: string
          user_id: string
          type: string
          prompt: string
          generated_content: string
          parameters: any | null
          ai_model: string | null
          cost: number | null
          tokens_used: number | null
          processing_time: number | null
          status: string
          error_message: string | null
          is_used: boolean
          related_post_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          user_id: string
          type: string
          prompt: string
          generated_content: string
          parameters?: any | null
          ai_model?: string | null
          cost?: number | null
          tokens_used?: number | null
          processing_time?: number | null
          status?: string
          error_message?: string | null
          is_used?: boolean
          related_post_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          user_id?: string
          type?: string
          prompt?: string
          generated_content?: string
          parameters?: any | null
          ai_model?: string | null
          cost?: number | null
          tokens_used?: number | null
          processing_time?: number | null
          status?: string
          error_message?: string | null
          is_used?: boolean
          related_post_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
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
