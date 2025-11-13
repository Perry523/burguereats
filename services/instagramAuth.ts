interface InstagramAuthConfig {
  appId: string;
  redirectUri: string;
  scope: string[];
}

interface InstagramTokenResponse {
  access_token: string;
  user_id: string;
}

interface InstagramUserProfile {
  id: string;
  username: string;
  account_type: string;
  media_count: number;
  followers_count?: number;
  follows_count?: number;
}

interface InstagramMedia {
  id: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  permalink: string;
  caption?: string;
  timestamp: string;
  like_count?: number;
  comments_count?: number;
}

class InstagramAuthService {
  private config: InstagramAuthConfig;

  constructor() {
    const runtimeConfig = useRuntimeConfig();

    // Get redirect URI - handle SSR
    let redirectUri = 'http://localhost:3000/auth/instagram/callback';
    if (process.client && window.location) {
      redirectUri = `${window.location.origin}/auth/instagram/callback`;
    } else if (runtimeConfig.public.INSTAGRAM_REDIRECT_URI) {
      redirectUri = runtimeConfig.public.INSTAGRAM_REDIRECT_URI;
    }

    this.config = {
      appId: runtimeConfig.public.INSTAGRAM_APP_ID || '',
      redirectUri,
      scope: [
        'user_profile',
        'user_media'
      ],
    };
  }

  /**
   * Generate Instagram OAuth URL for user authorization
   */
  getAuthUrl(): string {
    if (!this.config.appId) {
      throw new Error('Instagram App ID not configured');
    }

    const params = new URLSearchParams({
      client_id: this.config.appId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scope.join(','),
      response_type: 'code',
      state: this.generateState(),
    });

    return `https://api.instagram.com/oauth/authorize?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string, companyId: number): Promise<InstagramTokenResponse> {
    try {
      const response = await $fetch('/api/instagram/token', {
        method: 'POST',
        body: {
          code,
          redirect_uri: this.config.redirectUri,
          company_id: companyId,
        },
      });

      return response as InstagramTokenResponse;
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      throw new Error('Failed to get Instagram access token');
    }
  }

  /**
   * Get user profile information
   */
  async getUserProfile(accessToken: string): Promise<InstagramUserProfile> {
    try {
      const response = await $fetch('/api/instagram/profile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response as InstagramUserProfile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw new Error('Failed to fetch Instagram profile');
    }
  }

  /**
   * Get user media (posts)
   */
  async getUserMedia(accessToken: string, limit: number = 25): Promise<InstagramMedia[]> {
    try {
      const response = await $fetch('/api/instagram/media', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          limit,
        },
      });

      return response.data as InstagramMedia[];
    } catch (error) {
      console.error('Error fetching user media:', error);
      throw new Error('Failed to fetch Instagram media');
    }
  }

  /**
   * Publish a post to Instagram
   */
  async publishPost(accessToken: string, postData: {
    image_url: string;
    caption: string;
    access_token: string;
  }): Promise<{ id: string }> {
    try {
      // Step 1: Create media container
      const containerResponse = await $fetch('/api/instagram/create-container', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: postData,
      });

      // Step 2: Publish the container
      const publishResponse = await $fetch('/api/instagram/publish', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: {
          creation_id: containerResponse.id,
        },
      });

      return publishResponse as { id: string };
    } catch (error) {
      console.error('Error publishing post:', error);
      throw new Error('Failed to publish Instagram post');
    }
  }

  /**
   * Get insights for a media post
   */
  async getMediaInsights(accessToken: string, mediaId: string): Promise<Record<string, number>> {
    try {
      const response = await $fetch('/api/instagram/insights', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          media_id: mediaId,
        },
      });

      return response as Record<string, number>;
    } catch (error) {
      console.error('Error fetching media insights:', error);
      throw new Error('Failed to fetch Instagram insights');
    }
  }

  /**
   * Refresh long-lived access token
   */
  async refreshToken(accessToken: string): Promise<{ access_token: string; expires_in: number }> {
    try {
      const response = await $fetch('/api/instagram/refresh-token', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response as { access_token: string; expires_in: number };
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw new Error('Failed to refresh Instagram token');
    }
  }

  /**
   * Disconnect Instagram account
   */
  async disconnect(accessToken: string): Promise<void> {
    try {
      await $fetch('/api/instagram/disconnect', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      console.error('Error disconnecting Instagram:', error);
      throw new Error('Failed to disconnect Instagram account');
    }
  }

  /**
   * Check if Instagram is properly configured
   */
  isConfigured(): boolean {
    return !!this.config.appId;
  }

  /**
   * Generate a random state parameter for OAuth security
   */
  private generateState(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  /**
   * Validate Instagram webhook signature (server-side only)
   */
  validateWebhookSignature(signature: string, payload: string, appSecret: string): boolean {
    // This should only be used on the server side
    if (process.server) {
      try {
        const crypto = require('crypto');
        const expectedSignature = crypto
          .createHmac('sha1', appSecret)
          .update(payload)
          .digest('hex');

        return signature === `sha1=${expectedSignature}`;
      } catch (error) {
        console.error('Error validating webhook signature:', error);
        return false;
      }
    }
    return false;
  }

  /**
   * Get Instagram Business Account ID from Page Access Token
   */
  async getBusinessAccountId(pageAccessToken: string): Promise<string> {
    try {
      const response = await $fetch('/api/instagram/business-account', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${pageAccessToken}`,
        },
      });

      return response.instagram_business_account.id;
    } catch (error) {
      console.error('Error getting business account ID:', error);
      throw new Error('Failed to get Instagram Business Account ID');
    }
  }
}

// Create singleton instance
export const instagramAuth = new InstagramAuthService();

// Export types
export type {
  InstagramAuthConfig,
  InstagramTokenResponse,
  InstagramUserProfile,
  InstagramMedia,
};
