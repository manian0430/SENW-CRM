import { supabase } from '@/lib/supabaseClient'

export interface TeamMember {
  id: string
  name: string
  role: string
  email: string
  phone: string
  status: string
  avatar_url?: string | null
  created_at: string
}

export const getTeamMembers = async () => {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('name')

    if (error) {
      throw error
    }

    return data as TeamMember[]
  } catch (error) {
    console.error('Error fetching team members:', error)
    throw error
  }
}

export const addTeamMember = async (teamMember: Omit<TeamMember, 'id' | 'created_at'>, avatarFile?: File) => {
  try {
    let avatarUrl = null
    
    // Upload avatar if provided
    if (avatarFile) {
      const fileExt = avatarFile.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `team/${fileName}`
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile)
        
      if (uploadError) {
        throw uploadError
      }
      
      // Get the public URL
      const { data } = await supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)
        
      avatarUrl = data.publicUrl
    }
    
    // Insert team member record
    const { data, error } = await supabase
      .from('team_members')
      .insert({
        ...teamMember,
        avatar_url: avatarUrl
      })
      .select()
      
    if (error) {
      throw error
    }
    
    return data[0] as TeamMember
  } catch (error) {
    console.error('Error adding team member:', error)
    throw error
  }
}

export const updateTeamMember = async (
  id: string, 
  updates: Partial<Omit<TeamMember, 'id' | 'created_at'>>,
  avatarFile?: File
) => {
  try {
    let avatarUrl = updates.avatar_url
    
    // Upload new avatar if provided
    if (avatarFile) {
      const fileExt = avatarFile.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `team/${fileName}`
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile)
        
      if (uploadError) {
        throw uploadError
      }
      
      // Get the public URL
      const { data } = await supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)
        
      avatarUrl = data.publicUrl
    }
    
    // Update team member record
    const { data, error } = await supabase
      .from('team_members')
      .update({
        ...updates,
        avatar_url: avatarUrl
      })
      .eq('id', id)
      .select()
      
    if (error) {
      throw error
    }
    
    return data[0] as TeamMember
  } catch (error) {
    console.error('Error updating team member:', error)
    throw error
  }
}

export const deleteTeamMember = async (id: string, avatarPath?: string | null) => {
  try {
    // Delete avatar if path provided
    if (avatarPath) {
      // Extract the path from the URL
      const pathParts = avatarPath.split('avatars/')
      if (pathParts.length > 1) {
        const path = pathParts[1]
        
        const { error: storageError } = await supabase.storage
          .from('avatars')
          .remove([path])
          
        if (storageError) {
          console.error('Error deleting avatar:', storageError)
          // Continue with deletion even if avatar deletion fails
        }
      }
    }
    
    // Delete team member record
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', id)
      
    if (error) {
      throw error
    }
    
    return true
  } catch (error) {
    console.error('Error deleting team member:', error)
    throw error
  }
} 