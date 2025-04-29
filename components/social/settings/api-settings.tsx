'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { createClient } from '@supabase/supabase-js'
import type { Database, SocialAccount } from '../../../types/supabase'

type ApiConfig = {
  platform: string
  fields: {
    name: string
    key: string
    value: string
    type: 'text' | 'password'
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
      fields: [
        { name: 'API Key', key: 'api_key', value: '', type: 'password' },
        { name: 'API Secret', key: 'api_secret', value: '', type: 'password' },
        { name: 'Access Token', key: 'access_token', value: '', type: 'password' },
        { name: 'Access Token Secret', key: 'access_token_secret', value: '', type: 'password' },
      ],
    },
    {
      platform: 'LinkedIn',
      fields: [
        { name: 'Client ID', key: 'client_id', value: '', type: 'password' },
        { name: 'Client Secret', key: 'client_secret', value: '', type: 'password' },
      ],
    },
    {
      platform: 'Instagram',
      fields: [
        { name: 'Access Token', key: 'access_token', value: '', type: 'password' },
        { name: 'Client ID', key: 'client_id', value: '', type: 'password' },
        { name: 'Client Secret', key: 'client_secret', value: '', type: 'password' },
      ],
    },
    {
      platform: 'Facebook',
      fields: [
        { name: 'App ID', key: 'app_id', value: '', type: 'password' },
        { name: 'App Secret', key: 'app_secret', value: '', type: 'password' },
        { name: 'Access Token', key: 'access_token', value: '', type: 'password' },
      ],
    },
    {
      platform: 'TikTok',
      fields: [
        { name: 'Client Key', key: 'client_key', value: '', type: 'password' },
        { name: 'Client Secret', key: 'client_secret', value: '', type: 'password' },
      ],
    },
    {
      platform: 'Bluesky',
      fields: [
        { name: 'Identifier', key: 'identifier', value: '', type: 'text' },
        { name: 'Password', key: 'app_password', value: '', type: 'password' },
      ],
    },
    {
      platform: 'Truth Social',
      fields: [
        { name: 'API Key', key: 'api_key', value: '', type: 'password' },
        { name: 'API Secret', key: 'api_secret', value: '', type: 'password' },
      ],
    },
  ])

  useEffect(() => {
    loadSavedCredentials()
  }, [])

  const loadSavedCredentials = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: accounts, error } = await supabase
        .from('social.accounts')
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
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const config = configs.find(c => c.platform === platform)
      if (!config) return

      const platformSpecificData = config.fields.reduce((acc, field) => ({
        ...acc,
        [field.key]: field.value
      }), {})

      const { error } = await supabase.from('social.accounts').upsert({
        user_id: user.id,
        platform: platform.toLowerCase().split(' ')[0],
        platform_specific_data: platformSpecificData,
        updated_at: new Date().toISOString()
      })

      if (error) throw error

      toast({
        title: "Success",
        description: `Saved ${platform} configuration`
      })
    } catch (error) {
      console.error('Error saving credentials:', error)
      toast({
        title: "Error",
        description: "Failed to save credentials",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="grid gap-6">
      {configs.map((config) => (
        <Card key={config.platform}>
          <CardHeader>
            <CardTitle>{config.platform} API Configuration</CardTitle>
            <CardDescription>Enter your API credentials for {config.platform}</CardDescription>
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
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 