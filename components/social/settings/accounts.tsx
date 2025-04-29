'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Share2, Twitter, Linkedin, Instagram, Facebook } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { createClient } from '@supabase/supabase-js'
import type { Database, SocialAccount } from '../../../types/supabase'

type Platform = {
  id: string
  name: string
  icon: any
  connected: boolean
  username?: string
  authUrl: string
}

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export function SocialAccountSettings() {
  const { toast } = useToast()
  const [platforms, setPlatforms] = useState<Platform[]>([
    { 
      id: 'x', 
      name: 'X (Twitter)', 
      icon: Twitter, 
      connected: false,
      authUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/twitter`
    },
    { 
      id: 'linkedin', 
      name: 'LinkedIn', 
      icon: Linkedin, 
      connected: false,
      authUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/linkedin`
    },
    { 
      id: 'instagram', 
      name: 'Instagram', 
      icon: Instagram, 
      connected: false,
      authUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/instagram`
    },
    { 
      id: 'facebook', 
      name: 'Facebook', 
      icon: Facebook, 
      connected: false,
      authUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/facebook`
    },
    { 
      id: 'tiktok', 
      name: 'TikTok', 
      icon: Share2, 
      connected: false,
      authUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/tiktok`
    },
    { 
      id: 'bluesky', 
      name: 'Bluesky', 
      icon: Share2, 
      connected: false,
      authUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/bluesky`
    },
    { 
      id: 'truth', 
      name: 'Truth Social', 
      icon: Share2, 
      connected: false,
      authUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/truth`
    }
  ])

  useEffect(() => {
    loadConnectedAccounts()
  }, [])

  const loadConnectedAccounts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: accounts, error } = await supabase
        .from('social.accounts')
        .select('*')
        .eq('user_id', user.id)

      if (error) throw error

      setPlatforms(platforms.map(platform => {
        const connectedAccount = accounts?.find((acc: SocialAccount) => acc.platform === platform.id)
        return {
          ...platform,
          connected: !!connectedAccount,
          username: connectedAccount?.username
        }
      }))
    } catch (error) {
      console.error('Error loading accounts:', error)
      toast({
        title: "Error",
        description: "Failed to load connected accounts",
        variant: "destructive"
      })
    }
  }

  const handleConnect = async (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId)
    if (!platform) return

    // Store the platform ID in localStorage for the OAuth callback
    localStorage.setItem('connecting_platform', platformId)
    
    // Open OAuth popup
    const width = 600
    const height = 600
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2
    
    window.open(
      platform.authUrl,
      'Connect Social Account',
      `width=${width},height=${height},left=${left},top=${top}`
    )

    // Listen for message from OAuth callback
    window.addEventListener('message', async (event) => {
      if (event.origin !== window.location.origin) return
      if (event.data.type !== 'social_auth_callback') return

      const { tokens, profile } = event.data
      
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        // Store tokens and profile in database
        const { error } = await supabase.from('social.accounts').upsert({
          user_id: user.id,
          platform: platformId,
          account_id: profile.id,
          username: profile.username,
          display_name: profile.displayName,
          access_token: tokens.accessToken,
          refresh_token: tokens.refreshToken,
          token_expires_at: new Date(Date.now() + tokens.expiresIn * 1000).toISOString()
        })

        if (error) throw error

        toast({
          title: "Success",
          description: `Connected to ${platform.name} successfully`
        })

        loadConnectedAccounts()
      } catch (error) {
        console.error('Error saving account:', error)
        toast({
          title: "Error",
          description: "Failed to save account connection",
          variant: "destructive"
        })
      }
    })
  }

  const handleDisconnect = async (platformId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('social.accounts')
        .delete()
        .eq('user_id', user.id)
        .eq('platform', platformId)

      if (error) throw error

      toast({
        title: "Success",
        description: "Account disconnected successfully"
      })

      loadConnectedAccounts()
    } catch (error) {
      console.error('Error disconnecting account:', error)
      toast({
        title: "Error",
        description: "Failed to disconnect account",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="grid gap-4">
      <h2 className="text-2xl font-bold">Connected Accounts</h2>
      <div className="grid gap-6">
        {platforms.map((platform) => (
          <Card key={platform.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <platform.icon className="h-6 w-6" />
                  <div>
                    <CardTitle>{platform.name}</CardTitle>
                    {platform.connected && platform.username && (
                      <CardDescription>Connected as @{platform.username}</CardDescription>
                    )}
                  </div>
                </div>
                <Button
                  variant={platform.connected ? "destructive" : "default"}
                  onClick={() => platform.connected ? handleDisconnect(platform.id) : handleConnect(platform.id)}
                >
                  {platform.connected ? "Disconnect" : "Connect"}
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
} 