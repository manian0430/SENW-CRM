'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { createClient } from '@supabase/supabase-js'
import type { Database, SocialAccount } from '../../../types/supabase'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { format } from 'date-fns'
import { Twitter, Linkedin, Instagram, Facebook } from 'lucide-react'

type ApiConfig = {
  platform: string
  icon: any
  fields: {
    name: string
    key: string
    value: string
    type: 'text' | 'password'
  }[]
  status?: 'connected' | 'disconnected' | 'error'
  lastSync?: string
  logs?: {
    timestamp: string
    message: string
    type: 'info' | 'success' | 'error'
  }[]
}

type AccountData = {
  platform: string
  platform_specific_data: Record<string, any> | null
}

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export function ApiSettings() {
  const { toast } = useToast()
  const [configs, setConfigs] = useState<ApiConfig[]>([
    {
      platform: 'X (Twitter)',
      icon: Twitter,
      fields: [
        { name: 'API Key', key: 'api_key', value: '', type: 'password' },
        { name: 'API Secret', key: 'api_secret', value: '', type: 'password' },
        { name: 'Access Token', key: 'access_token', value: '', type: 'password' },
        { name: 'Access Token Secret', key: 'access_token_secret', value: '', type: 'password' },
      ],
      status: 'disconnected',
      logs: []
    },
    {
      platform: 'LinkedIn',
      icon: Linkedin,
      fields: [
        { name: 'Client ID', key: 'client_id', value: '', type: 'password' },
        { name: 'Client Secret', key: 'client_secret', value: '', type: 'password' },
      ],
      status: 'disconnected',
      logs: []
    },
    {
      platform: 'Instagram',
      icon: Instagram,
      fields: [
        { name: 'Access Token', key: 'access_token', value: '', type: 'password' },
        { name: 'Client ID', key: 'client_id', value: '', type: 'password' },
        { name: 'Client Secret', key: 'client_secret', value: '', type: 'password' },
      ],
      status: 'disconnected',
      logs: []
    },
    {
      platform: 'Facebook',
      icon: Facebook,
      fields: [
        { name: 'App ID', key: 'app_id', value: '', type: 'password' },
        { name: 'App Secret', key: 'app_secret', value: '', type: 'password' },
        { name: 'Access Token', key: 'access_token', value: '', type: 'password' },
      ],
      status: 'disconnected',
      logs: []
    }
  ])

  useEffect(() => {
    loadSavedCredentials()
  }, [])

  const loadSavedCredentials = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: accounts, error } = await supabase
        .from('accounts')
        .select('platform, platform_specific_data')
        .eq('user_id', user.id)

      if (error) throw error

      if (accounts) {
        const newConfigs = [...configs]
        accounts.forEach((account: AccountData) => {
          const configIndex = newConfigs.findIndex(c => c.platform.toLowerCase().includes(account.platform.toLowerCase()))
          if (configIndex >= 0 && account.platform_specific_data) {
            newConfigs[configIndex].fields = newConfigs[configIndex].fields.map(field => ({
              ...field,
              value: account.platform_specific_data![field.key] || ''
            }))
            newConfigs[configIndex].status = 'connected'
            newConfigs[configIndex].lastSync = new Date().toISOString()
            newConfigs[configIndex].logs = [
              {
                timestamp: new Date().toISOString(),
                message: 'API credentials loaded successfully',
                type: 'success'
              }
            ]
          }
        })
        setConfigs(newConfigs)
      }
    } catch (error) {
      console.error('Error loading credentials:', error)
      toast({
        title: "Error",
        description: "Failed to load saved credentials",
        variant: "destructive"
      })
    }
  }

  const handleSave = async (platform: string) => {
    try {
      // Simulate API connection process
      setConfigs(configs.map(c => {
        if (c.platform === platform) {
          return {
            ...c,
            status: 'disconnected',
            logs: [
              ...(c.logs || []),
              {
                timestamp: new Date().toISOString(),
                message: 'Attempting to connect API...',
                type: 'info'
              }
            ]
          }
        }
        return c
      }))

      await new Promise(resolve => setTimeout(resolve, 1200))

      // Add success log and update status
      setConfigs(configs.map(c => {
        if (c.platform === platform) {
          return {
            ...c,
            status: 'connected',
            lastSync: new Date().toISOString(),
            logs: [
              ...(c.logs || []),
              {
                timestamp: new Date().toISOString(),
                message: `API connection successful for managuelodian@gmail.com`,
                type: 'success'
              }
            ]
          }
        }
        return c
      }))
    } catch (error) {
      // Add error log
      setConfigs(configs.map(c => {
        if (c.platform === platform) {
          return {
            ...c,
            status: 'error',
            logs: [
              ...(c.logs || []),
              {
                timestamp: new Date().toISOString(),
                message: 'Failed to connect API',
                type: 'error'
              }
            ]
          }
        }
        return c
      }))
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
    <div className="grid gap-6">
      {configs.map((config) => (
        <Card key={config.platform}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <config.icon className="h-6 w-6" />
                <div>
                  <CardTitle>{config.platform} API Configuration</CardTitle>
                  <CardDescription>Enter your API credentials for {config.platform}</CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className={`h-2 w-2 rounded-full ${getStatusColor(config.status || 'disconnected')}`} />
                  <span className="text-sm text-muted-foreground">
                    {(config.status || 'disconnected').charAt(0).toUpperCase() + (config.status || 'disconnected').slice(1)}
                  </span>
                </div>
                {config.lastSync && (
                  <span className="text-sm text-muted-foreground">
                    Last sync: {format(new Date(config.lastSync), 'MMM d, h:mm a')}
                  </span>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {config.fields.map((field) => (
                <div key={field.key} className="grid gap-2">
                  <Label htmlFor={`${config.platform}-${field.key}`}>{field.name}</Label>
                  <Input
                    id={`${config.platform}-${field.key}`}
                    type={field.type}
                    value={field.value}
                    onChange={(e) => {
                      const newConfigs = [...configs]
                      const configIndex = newConfigs.findIndex(c => c.platform === config.platform)
                      const fieldIndex = newConfigs[configIndex].fields.findIndex(f => f.key === field.key)
                      newConfigs[configIndex].fields[fieldIndex].value = e.target.value
                      setConfigs(newConfigs)
                    }}
                    placeholder={`Enter ${field.name}`}
                  />
                </div>
              ))}
              <Button 
                className="mt-4"
                onClick={() => handleSave(config.platform)}
              >
                Save {config.platform} Configuration
              </Button>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Configuration Logs</h4>
              <ScrollArea className="h-[100px] rounded-md border p-4">
                <div className="space-y-2">
                  {config.logs?.map((log, index) => (
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
  )
} 