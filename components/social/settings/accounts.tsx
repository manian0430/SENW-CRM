'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Share2, Twitter, Linkedin, Instagram, Facebook } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { createClient } from '@supabase/supabase-js'
import type { Database, SocialAccount } from '../../../types/supabase'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { format } from 'date-fns'

type Platform = {
  id: string
  name: string
  icon: any
  connected: boolean
  username?: string
  authUrl: string
  status?: 'connected' | 'disconnected' | 'error'
  lastSync?: string
  logs?: {
    timestamp: string
    message: string
    type: 'info' | 'success' | 'error'
  }[]
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
      authUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/twitter`,
      status: 'disconnected',
      logs: []
    },
    { 
      id: 'linkedin', 
      name: 'LinkedIn', 
      icon: Linkedin, 
      connected: false,
      authUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/linkedin`,
      status: 'disconnected',
      logs: []
    },
    { 
      id: 'instagram', 
      name: 'Instagram', 
      icon: Instagram, 
      connected: false,
      authUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/instagram`,
      status: 'disconnected',
      logs: []
    },
    { 
      id: 'facebook', 
      name: 'Facebook', 
      icon: Facebook, 
      connected: false,
      authUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/facebook`,
      status: 'disconnected',
      logs: []
    },
    { 
      id: 'tiktok', 
      name: 'TikTok', 
      icon: Share2, 
      connected: false,
      authUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/tiktok`,
      status: 'disconnected',
      logs: []
    },
    { 
      id: 'bluesky', 
      name: 'Bluesky', 
      icon: Share2, 
      connected: false,
      authUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/bluesky`,
      status: 'disconnected',
      logs: []
    },
    { 
      id: 'truth', 
      name: 'Truth Social', 
      icon: Share2, 
      connected: false,
      authUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/truth`,
      status: 'disconnected',
      logs: []
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
        const status = connectedAccount?.is_active ? 'connected' : 'error'
        const lastSync = connectedAccount?.last_sync_at
        const logs: Platform['logs'] = [
          {
            timestamp: new Date().toISOString(),
            message: connectedAccount ? `Account connected as @${connectedAccount.username}` : 'Account disconnected',
            type: connectedAccount ? 'success' : 'info'
          }
        ]
        
        return {
          ...platform,
          connected: !!connectedAccount,
          username: connectedAccount?.username,
          status,
          lastSync,
          logs
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
    // Use Supabase OAuth for supported providers
    if (["facebook", "twitter", "linkedin", "linkedin_oidc", "instagram", "tiktok"].includes(platformId)) {
      if (platformId === "facebook") {
        await supabase.auth.signInWithOAuth({
          provider: "facebook",
          options: { scopes: "email,public_profile" }
        });
        return;
      }
      if (platformId === "linkedin" || platformId === "linkedin_oidc") {
        await supabase.auth.signInWithOAuth({ provider: "linkedin_oidc" });
        return;
      }
      await supabase.auth.signInWithOAuth({ provider: platformId as any });
      return;
    }
    // Fallback: simulate connection for unsupported providers
    setPlatforms(platforms.map(p => {
      if (p.id === platformId) {
        return {
          ...p,
          status: 'disconnected',
          logs: [
            ...(p.logs || []),
            {
              timestamp: new Date().toISOString(),
              message: 'Attempting to connect account...',
              type: 'info'
            }
          ]
        }
      }
      return p
    }))
    await new Promise(resolve => setTimeout(resolve, 1200))
    setPlatforms(platforms.map(p => {
      if (p.id === platformId) {
        return {
          ...p,
          connected: true,
          username: 'ianmanaguelod',
          status: 'connected',
          lastSync: new Date().toISOString(),
          logs: [
            ...(p.logs || []),
            {
              timestamp: new Date().toISOString(),
              message: 'Connected as @ianmanaguelod',
              type: 'success'
            }
          ]
        }
      }
      return p
    }))
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

      // Add disconnect log
      setPlatforms(platforms.map(p => {
        if (p.id === platformId) {
          return {
            ...p,
            connected: false,
            username: undefined,
            status: 'disconnected',
            lastSync: undefined,
            logs: [
              ...(p.logs || []),
              {
                timestamp: new Date().toISOString(),
                message: 'Account disconnected',
                type: 'info'
              }
            ]
          }
        }
        return p
      }))

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

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-500'
      case 'error':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
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
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className={`h-2 w-2 rounded-full ${getStatusColor(platform.status || 'disconnected')}`} />
                    <span className="text-sm text-muted-foreground">
                      {(platform.status || 'disconnected').charAt(0).toUpperCase() + (platform.status || 'disconnected').slice(1)}
                    </span>
                  </div>
                  {platform.lastSync && (
                    <span className="text-sm text-muted-foreground">
                      Last sync: {format(new Date(platform.lastSync), 'MMM d, h:mm a')}
                    </span>
                  )}
                  <Button
                    variant={platform.connected ? "destructive" : "default"}
                    onClick={() => platform.connected ? handleDisconnect(platform.id) : handleConnect(platform.id)}
                  >
                    {platform.connected ? "Disconnect" : "Connect"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Connection Logs</h4>
                <ScrollArea className="h-[100px] rounded-md border p-4">
                  <div className="space-y-2">
                    {platform.logs?.map((log, index) => (
                      <div key={index} className="flex items-start space-x-2 text-sm">
                        <span className="text-muted-foreground">
                          {format(new Date(log.timestamp), 'MMM d, h:mm:ss a')}
                        </span>
                        <Badge
                          variant={
                            log.type === 'success'
                              ? 'default'
                              : log.type === 'error'
                              ? 'destructive'
                              : 'secondary'
                          }
                        >
                          {log.message}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 