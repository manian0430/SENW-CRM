import { supabase } from '@/lib/supabaseClient'

export interface Document {
  id: string
  name: string
  type: string
  property_id?: string | null
  property_name?: string | null
  uploaded_by: string
  created_at: string
  size: string
  file_path: string
}

export const uploadDocument = async (
  file: File,
  fileName: string,
  type: string,
  propertyId: string | null = null,
  propertyName: string | null = null,
  userId: string
) => {
  try {
    // 1. Upload file to Supabase Storage
    const fileExt = file.name.split('.').pop()
    const filePath = `${userId}/${Date.now()}.${fileExt}`
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file)

    if (uploadError) {
      throw uploadError
    }

    // 2. Create document record in the database
    const { data, error } = await supabase
      .from('documents')
      .insert({
        name: fileName,
        type,
        property_id: propertyId,
        property_name: propertyName,
        uploaded_by: userId,
        size: formatFileSize(file.size),
        file_path: filePath
      })
      .select()

    if (error) {
      throw error
    }

    return data[0]
  } catch (error) {
    console.error('Error uploading document:', error)
    throw error
  }
}

export const getDocuments = async () => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return data as Document[]
  } catch (error) {
    console.error('Error fetching documents:', error)
    throw error
  }
}

export const deleteDocument = async (id: string, filePath: string) => {
  try {
    // 1. Delete from storage
    const { error: storageError } = await supabase.storage
      .from('documents')
      .remove([filePath])

    if (storageError) {
      throw storageError
    }

    // 2. Delete from database
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }

    return true
  } catch (error) {
    console.error('Error deleting document:', error)
    throw error
  }
}

export const getDocumentUrl = async (filePath: string) => {
  try {
    const { data, error } = await supabase.storage
      .from('documents')
      .createSignedUrl(filePath, 60) // URL valid for 60 seconds

    if (error) {
      throw error
    }

    return data.signedUrl
  } catch (error) {
    console.error('Error getting document URL:', error)
    throw error
  }
}

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(1)) + ' ' + sizes[i]
} 