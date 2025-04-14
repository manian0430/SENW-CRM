import { useState, useEffect } from 'react'
import { 
  getTeamMembers, 
  addTeamMember, 
  updateTeamMember, 
  deleteTeamMember,
  type TeamMember
} from '@/app/services/team'
import { toast } from 'sonner'

export function useTeam() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Fetch team members on initial load
  useEffect(() => {
    fetchTeamMembers()
  }, [])

  const fetchTeamMembers = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const data = await getTeamMembers()
      setTeamMembers(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch team members'))
      toast.error('Failed to load team members')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddTeamMember = async (
    newMember: Omit<TeamMember, 'id' | 'created_at'>,
    avatarFile?: File
  ) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const addedMember = await addTeamMember(newMember, avatarFile)
      setTeamMembers(prev => [...prev, addedMember])
      toast.success('Team member added successfully')
      return addedMember
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add team member'))
      toast.error('Failed to add team member')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateTeamMember = async (
    id: string,
    updates: Partial<Omit<TeamMember, 'id' | 'created_at'>>,
    avatarFile?: File
  ) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const updatedMember = await updateTeamMember(id, updates, avatarFile)
      setTeamMembers(prev => 
        prev.map(member => member.id === id ? updatedMember : member)
      )
      toast.success('Team member updated successfully')
      return updatedMember
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update team member'))
      toast.error('Failed to update team member')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteTeamMember = async (id: string, avatarUrl?: string | null) => {
    setIsLoading(true)
    setError(null)
    
    try {
      await deleteTeamMember(id, avatarUrl)
      setTeamMembers(prev => prev.filter(member => member.id !== id))
      toast.success('Team member deleted successfully')
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete team member'))
      toast.error('Failed to delete team member')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    teamMembers,
    isLoading,
    error,
    fetchTeamMembers,
    addTeamMember: handleAddTeamMember,
    updateTeamMember: handleUpdateTeamMember,
    deleteTeamMember: handleDeleteTeamMember
  }
} 