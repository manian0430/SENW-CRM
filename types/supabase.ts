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
  platform_specific_data?: Record<string, any>
  is_active: boolean
  last_sync_at?: string
  created_at: string
  updated_at: string
}

export interface Database {
  social: {
    Tables: {
      accounts: {
        Row: SocialAccount
        Insert: Omit<SocialAccount, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<SocialAccount, 'id'>>
      }
    }
  }
} 