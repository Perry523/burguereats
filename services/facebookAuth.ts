export interface FacebookConfig {
  appId: string;
  redirectUri: string;
  scope: string[];
}

export interface FacebookTokenResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
}

export interface FacebookUserProfile {
  id: string;
  name: string;
  email?: string;
  picture?: {
    data: {
      url: string;
    };
  };
}

export interface FacebookPage {
  id: string;
  name: string;
  access_token: string;
  category: string;
  tasks: string[];
  picture?: {
    data: {
      url: string;
    };
  };
}

export interface FacebookPost {
  id: string;
  message?: string;
  story?: string;
  created_time: string;
  updated_time: string;
  permalink_url?: string;
  full_picture?: string;
  attachments?: {
    data: Array<{
      type: string;
      media?: {
        image: {
          src: string;
        };
      };
    }>;
  };
  reactions?: {
    summary: {
      total_count: number;
    };
  };
  comments?: {
    summary: {
      total_count: number;
    };
  };
  shares?: {
    count: number;
  };
}

export interface FacebookInsights {
  page_impressions: number;
  page_reach: number;
  page_engaged_users: number;
  page_fans: number;
}

class FacebookAuthService {
  private config: FacebookConfig;

  constructor() {
    const runtimeConfig = useRuntimeConfig();
    
    // Get redirect URI - handle SSR
    let redirectUri = 'http://localhost:3000/auth/facebook/callback';
    if (process.client && window.location) {
      redirectUri = `${window.location.origin}/auth/facebook/callback`;
    } else if (runtimeConfig.public.FACEBOOK_REDIRECT_URI) {
      redirectUri = runtimeConfig.public.FACEBOOK_REDIRECT_URI;
    }
    
    this.config = {
      appId: runtimeConfig.public.FACEBOOK_APP_ID || '',
      redirectUri,
      scope: [
        'email',
        'public_profile',
        'pages_show_list',
        'pages_read_engagement',
        'pages_manage_posts',
        'pages_read_user_content',
        'publish_to_groups'
      ],
    };
  }

  /**
   * Check if Facebook is properly configured
   */
  isConfigured(): boolean {
    return !!(
      this.config.appId && 
      this.config.appId !== 'your_facebook_app_id_here'
    );
  }

  /**
   * Generate Facebook OAuth authorization URL
   */
  getAuthUrl(): string {
    if (!this.isConfigured()) {
      throw new Error('Facebook not configured. Please set FACEBOOK_APP_ID in environment variables.');
    }

    const params = new URLSearchParams({
      client_id: this.config.appId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scope.join(','),
      response_type: 'code',
      state: this.generateState(),
    });

    return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string, companyId: number): Promise<FacebookTokenResponse> {
    const response = await $fetch<FacebookTokenResponse>('/api/facebook/token', {
      method: 'POST',
      body: {
        code,
        redirect_uri: this.config.redirectUri,
        company_id: companyId,
      },
    });

    return response;
  }

  /**
   * Get user profile information
   */
  async getUserProfile(accessToken: string): Promise<FacebookUserProfile> {
    const response = await $fetch<FacebookUserProfile>('/api/facebook/profile', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response;
  }

  /**
   * Get user's Facebook pages
   */
  async getUserPages(accessToken: string): Promise<FacebookPage[]> {
    const response = await $fetch<{ data: FacebookPage[] }>('/api/facebook/pages', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  }

  /**
   * Get page posts
   */
  async getPagePosts(pageAccessToken: string, pageId: string, limit = 25): Promise<FacebookPost[]> {
    const response = await $fetch<{ data: FacebookPost[] }>('/api/facebook/posts', {
      headers: {
        Authorization: `Bearer ${pageAccessToken}`,
      },
      query: {
        page_id: pageId,
        limit,
      },
    });

    return response.data;
  }

  /**
   * Create a post on Facebook page
   */
  async createPost(pageAccessToken: string, pageId: string, postData: {
    message?: string;
    link?: string;
    picture?: string;
    scheduled_publish_time?: number;
    published?: boolean;
  }): Promise<{ id: string }> {
    const response = await $fetch<{ id: string }>('/api/facebook/create-post', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${pageAccessToken}`,
      },
      body: {
        page_id: pageId,
        ...postData,
      },
    });

    return response;
  }

  /**
   * Get page insights
   */
  async getPageInsights(pageAccessToken: string, pageId: string): Promise<FacebookInsights> {
    const response = await $fetch<FacebookInsights>('/api/facebook/insights', {
      headers: {
        Authorization: `Bearer ${pageAccessToken}`,
      },
      query: {
        page_id: pageId,
      },
    });

    return response;
  }

  /**
   * Refresh long-lived access token
   */
  async refreshToken(accessToken: string): Promise<FacebookTokenResponse> {
    const response = await $fetch<FacebookTokenResponse>('/api/facebook/refresh-token', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response;
  }

  /**
   * Disconnect Facebook account
   */
  async disconnect(accessToken: string): Promise<{ success: boolean }> {
    const response = await $fetch<{ success: boolean }>('/api/facebook/disconnect', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response;
  }

  /**
   * Generate random state for OAuth security
   */
  private generateState(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  /**
   * Validate Facebook webhook signature (server-side only)
   */
  validateWebhookSignature(signature: string, payload: string, appSecret: string): boolean {
    // This should only be used on the server side
    if (process.server) {
      try {
        const crypto = require('crypto');
        const expectedSignature = crypto
          .createHmac('sha256', appSecret)
          .update(payload)
          .digest('hex');
        
        return signature === `sha256=${expectedSignature}`;
      } catch (error) {
        console.error('Error validating webhook signature:', error);
        return false;
      }
    }
    return false;
  }
}

// Export singleton instance
export const facebookAuth = new FacebookAuthService();
