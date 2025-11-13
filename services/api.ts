// API service for Tomatiza serverless endpoints
import type { 
  CreateUserData, 
  CreateCompanyData, 
  CreateSocialMediaPostData,
  UpdateSocialMediaPostData,
  ContentGenerationRequest,
  User,
  Company,
  SocialMediaPost,
  GeneratedContent,
  ApiResponse,
  PaginatedResponse
} from '~/types/database'

class ApiService {
  private baseURL: string
  private token: string | null = null

  constructor() {
    this.baseURL = '/api'
    // Get token from localStorage or cookie
    if (process.client) {
      this.token = localStorage.getItem('auth_token')
    }
  }

  setToken(token: string) {
    this.token = token
    if (process.client) {
      localStorage.setItem('auth_token', token)
    }
  }

  clearToken() {
    this.token = null
    if (process.client) {
      localStorage.removeItem('auth_token')
    }
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    return headers
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const response = await $fetch<T>(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers
      }
    })

    return response
  }

  // Authentication
  async register(userData: CreateUserData): Promise<ApiResponse<{ user: User }>> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
  }

  async login(email: string, password: string): Promise<ApiResponse<{ user: User, token: string, companies: Company[] }>> {
    const response = await this.request<ApiResponse<{ user: User, token: string, companies: Company[] }>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })

    if (response.data?.token) {
      this.setToken(response.data.token)
    }

    return response
  }

  async logout() {
    this.clearToken()
  }

  // Companies
  async createCompany(companyData: CreateCompanyData & { userId: string }): Promise<ApiResponse<{ company: Company }>> {
    return this.request('/companies/create', {
      method: 'POST',
      body: JSON.stringify(companyData)
    })
  }

  async getCompany(slug: string): Promise<ApiResponse<{ company: Company, stats: any }>> {
    return this.request(`/companies/${slug}`)
  }

  // Social Media Integration
  async connectInstagram(companyId: string, accessToken: string, userId: string, username: string): Promise<ApiResponse> {
    return this.request('/social/instagram/connect', {
      method: 'POST',
      body: JSON.stringify({
        company_id: companyId,
        access_token: accessToken,
        user_id: userId,
        username
      })
    })
  }

  async connectFacebook(companyId: string, accessToken: string, pageId: string, pageName: string): Promise<ApiResponse> {
    return this.request('/social/facebook/connect', {
      method: 'POST',
      body: JSON.stringify({
        company_id: companyId,
        access_token: accessToken,
        page_id: pageId,
        page_name: pageName
      })
    })
  }

  async getSocialStatus(companyId: string): Promise<ApiResponse<{ status: any }>> {
    return this.request(`/social/${companyId}/status`)
  }

  async disconnectSocial(companyId: string, platform: 'instagram' | 'facebook'): Promise<ApiResponse> {
    return this.request('/social/disconnect', {
      method: 'POST',
      body: JSON.stringify({
        company_id: companyId,
        platform
      })
    })
  }

  // AI Content Generation
  async generateContent(companyId: string, request: ContentGenerationRequest): Promise<ApiResponse<{ generation: any }>> {
    return this.request('/ai/generate', {
      method: 'POST',
      body: JSON.stringify({
        company_id: companyId,
        ...request
      })
    })
  }

  async getAIHistory(companyId: string, params?: {
    page?: number
    limit?: number
    content_type?: string
    used_only?: boolean
  }): Promise<ApiResponse<{ generations: any[], pagination: any }>> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.content_type) searchParams.set('content_type', params.content_type)
    if (params?.used_only) searchParams.set('used_only', 'true')

    const query = searchParams.toString()
    return this.request(`/ai/history/${companyId}${query ? `?${query}` : ''}`)
  }

  async getContentIdeas(companyId: string, count: number = 5): Promise<ApiResponse<{ ideas: string[], source: string }>> {
    return this.request(`/ai/ideas/${companyId}?count=${count}`)
  }

  // Posts Management
  async createPost(postData: CreateSocialMediaPostData): Promise<ApiResponse<{ post: SocialMediaPost }>> {
    return this.request('/posts/create', {
      method: 'POST',
      body: JSON.stringify(postData)
    })
  }

  async getPosts(companyId: string, params?: {
    page?: number
    limit?: number
    status?: string
    platform?: string
    content_type?: string
  }): Promise<ApiResponse<{ posts: SocialMediaPost[], pagination: any }>> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.status) searchParams.set('status', params.status)
    if (params?.platform) searchParams.set('platform', params.platform)
    if (params?.content_type) searchParams.set('content_type', params.content_type)

    const query = searchParams.toString()
    return this.request(`/posts/${companyId}${query ? `?${query}` : ''}`)
  }

  async updatePost(postId: string, updateData: UpdateSocialMediaPostData): Promise<ApiResponse<{ post: SocialMediaPost }>> {
    return this.request(`/posts/${postId}/update`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    })
  }

  async publishPost(postId: string): Promise<ApiResponse<{ post: SocialMediaPost }>> {
    return this.request(`/posts/${postId}/publish`, {
      method: 'POST'
    })
  }

  async deletePost(postId: string): Promise<ApiResponse> {
    return this.request(`/posts/${postId}/delete`, {
      method: 'DELETE'
    })
  }

  // Calendar
  async getCalendarPosts(companyId: string, startDate: string, endDate: string, platform?: string): Promise<ApiResponse<{ posts: any[], posts_by_date: any, total_posts: number }>> {
    const searchParams = new URLSearchParams({
      start_date: startDate,
      end_date: endDate
    })
    if (platform) searchParams.set('platform', platform)

    return this.request(`/calendar/${companyId}/posts?${searchParams.toString()}`)
  }

  async getCalendarAnalytics(companyId: string, startDate: string, endDate: string): Promise<ApiResponse<{ overview: any, platforms: any, content_types: any, engagement: any, ai_usage: any }>> {
    const searchParams = new URLSearchParams({
      start_date: startDate,
      end_date: endDate
    })

    return this.request(`/calendar/${companyId}/analytics?${searchParams.toString()}`)
  }

  async bulkSchedulePosts(companyId: string, posts: { id: string, scheduled_at: string }[]): Promise<ApiResponse<{ scheduled_posts: any[], count: number }>> {
    return this.request('/calendar/bulk-schedule', {
      method: 'POST',
      body: JSON.stringify({
        company_id: companyId,
        posts
      })
    })
  }
}

// Export singleton instance
export const api = new ApiService()

// Export class for testing or multiple instances
export { ApiService }
