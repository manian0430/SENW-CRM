export type SocialPlatform = 'x' | 'linkedin' | 'instagram' | 'facebook' | 'tiktok' | 'bluesky' | 'truth'

export type SocialAccount = {
  id: string
  user_id: string
  platform: SocialPlatform
  account_id: string
  username: string
  display_name?: string
  profile_url?: string
  avatar_url?: string
  access_token?: string
  refresh_token?: string
  token_expires_at?: string
  is_active: boolean
  last_sync_at?: string
  created_at: string
  updated_at: string
}

export type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed'

export type SocialPost = {
  id: string
  account_id: string
  platform: SocialPlatform
  post_id?: string
  content: string
  media_urls?: {
    type: 'image' | 'video'
    url: string
  }[]
  scheduled_for?: string
  published_at?: string
  status: PostStatus
  platform_specific_data?: Record<string, any>
  analytics?: {
    likes?: number
    comments?: number
    shares?: number
    views?: number
    engagement_rate?: number
  }
  created_by: string
  created_at: string
  updated_at: string
}

export type InteractionType = 'comment' | 'dm' | 'mention' | 'like' | 'share'
export type InteractionStatus = 'unread' | 'read' | 'responded' | 'archived' | 'spam'
export type Sentiment = 'positive' | 'neutral' | 'negative'

export type SocialInteraction = {
  id: string
  account_id: string
  platform: SocialPlatform
  interaction_type: InteractionType
  interaction_id: string
  content?: string
  author_id?: string
  author_username?: string
  author_data?: {
    name?: string
    avatar_url?: string
    followers_count?: number
    verified?: boolean
    [key: string]: any
  }
  parent_id?: string
  post_id?: string
  status: InteractionStatus
  sentiment?: Sentiment
  assigned_to?: string
  response_content?: string
  response_sent_at?: string
  created_at: string
  updated_at: string
}

export type KeywordType = 'brand' | 'competitor' | 'industry' | 'custom'

export type MonitoringKeyword = {
  id: string
  user_id: string
  keyword: string
  type: KeywordType
  is_active: boolean
  created_at: string
  updated_at: string
}

export type SocialAnalytics = {
  id: string
  account_id: string
  date: string
  platform: SocialPlatform
  metrics: {
    followers_count?: number
    following_count?: number
    posts_count?: number
    engagement_rate?: number
    impressions?: number
    reach?: number
    profile_views?: number
    website_clicks?: number
    [key: string]: any
  }
  created_at: string
}

// Database interface
export interface Database {
  social: {
    Tables: {
      accounts: {
        Row: SocialAccount
        Insert: Omit<SocialAccount, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<SocialAccount, 'id'>>
      }
      posts: {
        Row: SocialPost
        Insert: Omit<SocialPost, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<SocialPost, 'id'>>
      }
      interactions: {
        Row: SocialInteraction
        Insert: Omit<SocialInteraction, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<SocialInteraction, 'id'>>
      }
      monitoring_keywords: {
        Row: MonitoringKeyword
        Insert: Omit<MonitoringKeyword, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<MonitoringKeyword, 'id'>>
      }
      analytics: {
        Row: SocialAnalytics
        Insert: Omit<SocialAnalytics, 'id' | 'created_at'>
        Update: Partial<Omit<SocialAnalytics, 'id'>>
      }
    }
    Views: {
      [key: string]: {
        Row: Record<string, unknown>
      }
    }
    Functions: {
      [key: string]: {
        Args: Record<string, unknown>
        Returns: unknown
      }
    }
    Enums: {
      [key: string]: string[]
    }
  }
} 