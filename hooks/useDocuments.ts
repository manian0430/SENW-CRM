import { useState, useEffect } from 'react'
import { 
  uploadDocument, 
  getDocuments, 
  deleteDocument, 
  getDocumentUrl,
  type Document
} from '@/app/services/documents'
import { toast } from 'sonner'

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Fetch documents on initial load
  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const data = await getDocuments()
      setDocuments(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch documents'))
      toast.error('Failed to load documents')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUploadDocument = async (
    file: File,
    fileName: string,
    type: string,
    propertyId: string | null = null,
    propertyName: string | null = null
  ) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // For demo, we'll use a fixed user ID
      // In a real app, you would get this from authentication
      const userId = 'demo-user-id'
      
      const newDocument = await uploadDocument(
        file, 
        fileName, 
        type, 
        propertyId, 
        propertyName, 
        userId
      )
      
      setDocuments(prev => [newDocument, ...prev])
      toast.success('Document uploaded successfully')
      return newDocument
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to upload document'))
      toast.error('Failed to upload document')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteDocument = async (id: string, filePath: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      await deleteDocument(id, filePath)
      setDocuments(prev => prev.filter(doc => doc.id !== id))
      toast.success('Document deleted successfully')
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete document'))
      toast.error('Failed to delete document')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGetDocumentUrl = async (filePath: string) => {
    try {
      return await getDocumentUrl(filePath)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get document URL'))
      toast.error('Failed to access document')
      throw err
    }
  }

  return {
    documents,
    isLoading,
    error,
    fetchDocuments,
    uploadDocument: handleUploadDocument,
    deleteDocument: handleDeleteDocument,
    getDocumentUrl: handleGetDocumentUrl
  }
} 