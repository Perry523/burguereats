/**
 * Instagram API Service
 * Handles fetching posts from Instagram accounts for AI analysis
 */

export interface InstagramPost {
  id: string;
  caption: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  permalink: string;
  timestamp: string;
  like_count?: number;
  comments_count?: number;
  thumbnail_url?: string;
}

export interface InstagramAccount {
  id: string;
  username: string;
  account_type: string;
  media_count: number;
}

export class InstagramService {
  private baseUrl = 'https://graph.instagram.com';
  
  /**
   * Fetch user's Instagram account info
   */
  async getAccountInfo(accessToken: string): Promise<InstagramAccount> {
    try {
      const response = await fetch(
        `${this.baseUrl}/me?fields=id,username,account_type,media_count&access_token=${accessToken}`
      );
      
      if (!response.ok) {
        throw new Error(`Instagram API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching Instagram account info:', error);
      throw error;
    }
  }

  /**
   * Fetch last N posts from user's Instagram account
   */
  async getUserPosts(accessToken: string, limit: number = 5): Promise<InstagramPost[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/me/media?fields=id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count,thumbnail_url&limit=${limit}&access_token=${accessToken}`
      );
      
      if (!response.ok) {
        throw new Error(`Instagram API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching Instagram posts:', error);
      throw error;
    }
  }

  /**
   * Fetch posts from a public Instagram account (using username)
   * Note: This requires Instagram Basic Display API or scraping
   * For now, we'll return mock data as Instagram doesn't allow easy public access
   */
  async getPublicAccountPosts(username: string, limit: number = 5): Promise<InstagramPost[]> {
    try {
      // TODO: Implement actual public post fetching
      // This would require either:
      // 1. Instagram Basic Display API with user permission
      // 2. Instagram Graph API for Business accounts
      // 3. Web scraping (not recommended due to ToS)

      console.log(`Would fetch posts for public account: ${username}, but no real Instagram API configured`);

      // Return empty array instead of mock data
      return [];
    } catch (error) {
      console.error('Error fetching public Instagram posts:', error);
      return [];
    }
  }



  /**
   * Extract username from Instagram URL
   */
  extractUsername(url: string): string {
    const match = url.match(/instagram\.com\/([^\/\?]+)/);
    return match ? match[1] : '';
  }

  /**
   * Validate Instagram access token
   */
  async validateAccessToken(accessToken: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.baseUrl}/me?access_token=${accessToken}`
      );
      return response.ok;
    } catch (error) {
      console.error('Error validating access token:', error);
      return false;
    }
  }

  /**
   * Refresh Instagram access token
   */
  async refreshAccessToken(accessToken: string): Promise<string> {
    try {
      const response = await fetch(
        `${this.baseUrl}/refresh_access_token?grant_type=ig_refresh_token&access_token=${accessToken}`,
        { method: 'GET' }
      );
      
      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.status}`);
      }
      
      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Error refreshing access token:', error);
      throw error;
    }
  }
}

/**
 * Instagram Posts Fetcher
 * Aggregates posts from user account and reference accounts
 */
export class InstagramPostsFetcher {
  private instagramService: InstagramService;
  private supabase: any;

  constructor() {
    this.instagramService = new InstagramService();
    this.supabase = useSupabaseClient();
  }

  /**
   * Fetch posts from user's account and all reference accounts
   */
  async fetchAllReferencePosts(userId: string): Promise<{
    userPosts: InstagramPost[];
    referencePosts: { username: string; posts: InstagramPost[] }[];
    totalPosts: number;
  }> {
    try {
      // Get user data from database
      const { data: userData, error: userError } = await this.supabase
        .from('users')
        .select('instagram_link, instagram_accounts')
        .eq('id', userId)
        .single();

      if (userError) {
        throw userError;
      }

      const results = {
        userPosts: [] as InstagramPost[],
        referencePosts: [] as { username: string; posts: InstagramPost[] }[],
        totalPosts: 0
      };

      // Fetch user's own posts if they have an Instagram account
      if (userData.instagram_link) {
        const username = this.instagramService.extractUsername(userData.instagram_link);
        if (username) {
          try {
            const posts = await this.instagramService.getPublicAccountPosts(username, 5);
            results.userPosts = posts;
            results.totalPosts += posts.length;
          } catch (error) {
            console.error(`Error fetching posts for user account ${username}:`, error);
          }
        }
      }

      // Fetch posts from reference accounts
      if (userData.instagram_accounts && Array.isArray(userData.instagram_accounts)) {
        for (const accountUrl of userData.instagram_accounts) {
          const username = this.instagramService.extractUsername(accountUrl);
          if (username) {
            try {
              const posts = await this.instagramService.getPublicAccountPosts(username, 5);
              results.referencePosts.push({
                username,
                posts
              });
              results.totalPosts += posts.length;
            } catch (error) {
              console.error(`Error fetching posts for reference account ${username}:`, error);
            }
          }
        }
      }

      return results;
    } catch (error) {
      console.error('Error fetching all reference posts:', error);
      throw error;
    }
  }

  /**
   * Format posts for AI analysis
   */
  formatPostsForAI(posts: InstagramPost[]): string {
    return posts.map(post => {
      return `Post: ${post.caption || 'No caption'}\nMedia Type: ${post.media_type}\nEngagement: ${post.like_count || 0} likes, ${post.comments_count || 0} comments\n---`;
    }).join('\n\n');
  }

  /**
   * Get posts summary for AI context
   */
  async getPostsSummaryForAI(userId: string): Promise<string> {
    try {
      const { userPosts, referencePosts } = await this.fetchAllReferencePosts(userId);
      
      let summary = '';
      
      if (userPosts.length > 0) {
        summary += `USER'S RECENT POSTS:\n${this.formatPostsForAI(userPosts)}\n\n`;
      }
      
      for (const { username, posts } of referencePosts) {
        if (posts.length > 0) {
          summary += `REFERENCE ACCOUNT @${username}:\n${this.formatPostsForAI(posts)}\n\n`;
        }
      }
      
      return summary;
    } catch (error) {
      console.error('Error getting posts summary for AI:', error);
      return '';
    }
  }
}

// Export singleton instance
export const instagramService = new InstagramService();
export const instagramPostsFetcher = new InstagramPostsFetcher();
