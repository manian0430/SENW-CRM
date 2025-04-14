"use client"

import { useState, useRef, FormEvent } from "react"
import { FileUp, FileText, Download, Trash2, MoreHorizontal, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DialogContent, DialogHeader, DialogTitle, Dialog } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DataTable } from "@/components/ui/data-table"
import { PageHeader } from "@/components/ui/page-header"
import type { ColumnDef } from "@tanstack/react-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { useDocuments } from "@/hooks/useDocuments"
import { toast } from "sonner"
import { type Document } from "@/app/services/documents"

export default function DocumentsPage() {
  const { documents, isLoading, uploadDocument, deleteDocument, getDocumentUrl } = useDocuments()
  const [documentType, setDocumentType] = useState("all")
  const [propertyFilter, setPropertyFilter] = useState("all")
  const [open, setOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    property: "all"
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Properties from API in a real app
  const properties = [
    { id: "prop-1", name: "123 Main St, Seattle, WA" },
    { id: "prop-2", name: "456 Oak Ave, Bellevue, WA" },
    { id: "prop-3", name: "789 Pine Rd, Redmond, WA" },
    { id: "prop-4", name: "321 Elm St, Kirkland, WA" },
  ]

  const documentTypes = ["Contract", "Inspection", "Disclosure", "Listing", "Financial", "Other"]

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!fileInputRef.current?.files?.length) {
      toast.error("Please select a file to upload")
      return
    }
    
    if (!formData.name || !formData.type) {
      toast.error("Please fill all required fields")
      return
    }
    
    const file = fileInputRef.current.files[0]
    setIsUploading(true)
    
    try {
      const selectedProperty = formData.property !== "all" ? 
        properties.find(p => p.id === formData.property) : null
      
      await uploadDocument(
        file,
        formData.name,
        formData.type,
        selectedProperty?.id || null,
        selectedProperty?.name || null
      )
      
      // Reset form
      setFormData({ name: "", type: "", property: "all" })
      if (fileInputRef.current) fileInputRef.current.value = ""
      setOpen(false)
    } catch (error) {
      console.error("Error uploading document:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDownload = async (filePath: string, fileName: string) => {
    try {
      const url = await getDocumentUrl(filePath)
      
      // Create an anchor element and trigger download
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error downloading document:", error)
    }
  }

  const handleDelete = async (id: string, filePath: string) => {
    try {
      await deleteDocument(id, filePath)
    } catch (error) {
      console.error("Error deleting document:", error)
    }
  }

  // Define columns for the data table
  const columns: ColumnDef<Document>[] = [
    {
      accessorKey: "name",
      header: "Document Name",
      cell: ({ row }) => (
        <div className="flex items-center">
          <FileText className="h-4 w-4 mr-2 text-gray-500" />
          <span className="font-medium">{row.getValue("name")}</span>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {row.getValue("type")}
        </span>
      ),
    },
    {
      accessorKey: "property_name",
      header: "Property",
      cell: ({ row }) => {
        const property = row.getValue("property_name") as string | null
        return <span>{property || "N/A"}</span>
      }
    },
    {
      accessorKey: "uploaded_by",
      header: "Uploaded By",
      cell: () => <span>Demo User</span>, // In a real app, this would show the actual user name
    },
    {
      accessorKey: "created_at",
      header: "Upload Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"))
        return <span>{date.toLocaleDateString()}</span>
      },
    },
    {
      accessorKey: "size",
      header: "Size",
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => 
                handleDownload(row.original.file_path, row.original.name)}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => 
                handleDelete(row.original.id, row.original.file_path)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ]

  // Filter controls
  const FilterControls = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <Select value={documentType} onValueChange={setDocumentType}>
        <SelectTrigger>
          <SelectValue placeholder="Filter by document type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {documentTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={propertyFilter} onValueChange={setPropertyFilter}>
        <SelectTrigger>
          <SelectValue placeholder="Filter by property" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Properties</SelectItem>
          {properties.map((property) => (
            <SelectItem key={property.id} value={property.id}>
              {property.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )

  // Upload Document Dialog Content
  const UploadDocumentDialogContent = (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Upload Document</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="grid gap-4 py-4">
        <div className="grid gap-2">
          <label htmlFor="document-name">Document Name*</label>
          <Input 
            id="document-name" 
            placeholder="Enter document name" 
            value={formData.name}
            onChange={(e) => handleFormChange("name", e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="document-type">Document Type*</label>
          <Select 
            value={formData.type} 
            onValueChange={(value) => handleFormChange("type", value)}
            required
          >
            <SelectTrigger id="document-type">
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent>
              {documentTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <label htmlFor="property">Related Property</label>
          <Select 
            value={formData.property} 
            onValueChange={(value) => handleFormChange("property", value)}
          >
            <SelectTrigger id="property">
              <SelectValue placeholder="Select property" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">None</SelectItem>
              {properties.map((property) => (
                <SelectItem key={property.id} value={property.id}>
                  {property.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <label htmlFor="file">File*</label>
          <Input type="file" id="file" ref={fileInputRef} required />
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : 'Upload'}
          </Button>
        </div>
      </form>
    </DialogContent>
  )

  // Document categories for tabs
  const categories = [
    { id: "all", name: "All Documents" },
    { id: "contracts", name: "Contracts" },
    { id: "inspections", name: "Inspections" },
    { id: "disclosures", name: "Disclosures" },
    { id: "financial", name: "Financial" },
  ]

  // Filter documents based on selected filters
  const filteredDocuments = documents.filter(doc => {
    const typeMatch = !documentType || documentType === "all" || doc.type === documentType
    const propertyMatch = !propertyFilter || propertyFilter === "all" || doc.property_id === propertyFilter
    return typeMatch && propertyMatch
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Document Management"
        description="Upload and manage your documents"
        action={{
          label: "Upload Document",
          icon: FileUp,
          onClick: () => setOpen(true),
        }}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        {UploadDocumentDialogContent}
      </Dialog>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <Card>
              <CardContent className="pt-6">
                <FilterControls />
                
                {isLoading && !documents.length ? (
                  <div className="flex items-center justify-center h-48">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : (
                  <DataTable
                    columns={columns}
                    data={filteredDocuments.filter(doc => {
                      if (category.id === "all") return true
                      if (category.id === "contracts" && doc.type === "Contract") return true
                      if (category.id === "inspections" && doc.type === "Inspection") return true
                      if (category.id === "disclosures" && doc.type === "Disclosure") return true
                      if (category.id === "financial" && doc.type === "Financial") return true
                      return false
                    })}
                    searchColumn="name"
                    searchPlaceholder="Search documents..."
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
