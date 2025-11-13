// Database model interfaces
export interface User {
  id: string
  name: string
  email: string
  phone: string
  profile_photo_path?: string | null
  type: 'client' | 'professional' | 'admin'
  finished_register: boolean
  created_at: string
  updated_at: string
}

export interface Company {
  id: string
  name: string
  slug: string
  description?: string | null
  logo?: string | null
  website?: string | null
  instagram_handle?: string | null
  facebook_page?: string | null
  // Business settings for AI content generation
  business_category: 'restaurant' | 'retail' | 'services' | 'beauty' | 'fitness' | 'technology' | 'education' | 'other'
  target_audience?: string | null
  brand_voice: 'professional' | 'friendly' | 'casual' | 'enthusiastic' | 'informative' | 'humorous'
  // Subscription and limits
  is_active: boolean
  monthly_post_limit: number
  posts_used_this_month: number
  subscription_expires_at?: string | null
  created_at: string
  updated_at: string
}

export interface Plan {
  id: string
  name: string
  description?: string | null
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

export interface CompanyUser {
  id: string
  company_id: string
  user_id: string
  role: 'owner' | 'admin' | 'editor' | 'viewer'
  is_active: boolean
  created_at: string
  updated_at: string
  // Joined data
  user?: User
  company?: Company
}

export interface AIGeneration {
  id: string
  company_id: string
  user_id: string
  // Generation parameters
  content_type: 'post' | 'story' | 'reel' | 'carousel'
  business_category: string
  theme: string
  custom_prompt: string
  tone: string
  // Generated content
  generated_caption: string
  generated_hashtags?: string[] | null
  generated_cta?: string | null
  alternative_captions?: string[] | null
  // AI metadata
  ai_model: string
  generation_time_ms?: number | null
  was_used: boolean
  created_at: string
  updated_at: string
  // Joined data
  user?: User
  company?: Company
}

// Removed unused interfaces for simplified AI post generator schema

export interface CompanySocialIntegration {
  id: string
  company_id: string
  platform: 'instagram' | 'facebook'
  access_token?: string | null
  refresh_token?: string | null
  token_expires_at?: string | null
  platform_user_id?: string | null
  platform_username?: string | null
  platform_data?: any | null
  is_active: boolean
  last_sync_at?: string | null
  created_at: string
  updated_at: string
}

export interface SocialMediaPost {
  id: string
  company_id: string
  user_id: string
  company_social_integration_id?: string | null
  ai_generation_id?: string | null
  // Post content
  title: string
  caption: string
  hashtags?: string[] | null
  cta?: string | null
  content_type: 'post' | 'story' | 'reel' | 'carousel'
  platform: 'instagram' | 'facebook'
  // Media
  media_urls?: string[] | null
  thumbnail_url?: string | null
  // Publishing
  status: 'draft' | 'scheduled' | 'publishing' | 'published' | 'failed'
  scheduled_at?: string | null
  published_at?: string | null
  platform_post_id?: string | null
  error_message?: string | null
  platform_response?: any | null
  // Analytics
  likes_count: number
  comments_count: number
  shares_count: number
  reach: number
  impressions: number
  last_analytics_update?: string | null
  // AI metadata
  ai_generated: boolean
  ai_prompt?: string | null
  created_at: string
  updated_at: string
  // Joined data
  user?: User
  company?: Company
  integration?: CompanySocialIntegration
  ai_generation?: AIGeneration
}

// API Response types
export interface ApiResponse<T = any> {
  data?: T
  message?: string
  error?: string
  status: number
}

export interface PaginatedResponse<T = any> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Form data types
export interface CreateUserData {
  name: string
  email: string
  phone: string
  password: string
  type?: 'client' | 'professional' | 'admin'
}

export interface CreateCompanyData {
  name: string
  slug: string
  description?: string
  business_category?: string
  target_audience?: string
  brand_voice?: string
}

export interface CreateAIGenerationData {
  company_id: string
  user_id: string
  content_type: 'post' | 'story' | 'reel' | 'carousel'
  business_category: string
  theme: string
  custom_prompt: string
  tone: string
}

export interface CreateSocialMediaPostData {
  company_id: string
  user_id: string
  title: string
  caption: string
  hashtags?: string[]
  cta?: string
  content_type: 'post' | 'story' | 'reel' | 'carousel'
  platform: 'instagram' | 'facebook'
  media_urls?: string[]
  scheduled_at?: string
  ai_generation_id?: string
}

export interface UpdateSocialMediaPostData {
  title?: string
  caption?: string
  hashtags?: string[]
  cta?: string
  media_urls?: string[]
  scheduled_at?: string
  status?: 'draft' | 'scheduled' | 'publishing' | 'published' | 'failed'
}

export interface ContentGenerationRequest {
  type: 'post' | 'story' | 'reel' | 'carousel'
  category: string
  theme: string
  customPrompt: string
  tone: string
  businessName?: string
  targetAudience?: string
}

export interface GeneratedContent {
  caption: string
  hashtags: string[]
  cta?: string
  suggestions?: string[]
}
