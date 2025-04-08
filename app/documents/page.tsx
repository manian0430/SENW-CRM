"use client"

import { useState } from "react"
import { FileUp, FileText, Download, Trash2, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DataTable } from "@/components/ui/data-table"
import { PageHeader } from "@/components/ui/page-header"
import type { ColumnDef } from "@tanstack/react-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"

// Types
interface Document {
  id: string
  name: string
  type: string
  property: string
  uploadedBy: string
  uploadDate: string
  size: string
}

export default function DocumentsPage() {
  const [open, setOpen] = useState(false)
  const [documentType, setDocumentType] = useState("")
  const [propertyFilter, setPropertyFilter] = useState("")

  // Placeholder for API calls
  // Fetch documents from /api/documents

  const documents = [
    {
      id: "DOC-1001",
      name: "Purchase Agreement - 123 Main St.pdf",
      type: "Contract",
      property: "123 Main St, Seattle, WA",
      uploadedBy: "Sarah Johnson",
      uploadDate: "2023-07-15",
      size: "2.4 MB",
    },
    {
      id: "DOC-1002",
      name: "Inspection Report - 456 Oak Ave.pdf",
      type: "Inspection",
      property: "456 Oak Ave, Bellevue, WA",
      uploadedBy: "Mike Wilson",
      uploadDate: "2023-07-12",
      size: "5.1 MB",
    },
    {
      id: "DOC-1003",
      name: "Disclosure Form - 789 Pine Rd.pdf",
      type: "Disclosure",
      property: "789 Pine Rd, Redmond, WA",
      uploadedBy: "David Miller",
      uploadDate: "2023-07-10",
      size: "1.2 MB",
    },
    {
      id: "DOC-1004",
      name: "Listing Agreement - 321 Elm St.pdf",
      type: "Listing",
      property: "321 Elm St, Kirkland, WA",
      uploadedBy: "Sarah Johnson",
      uploadDate: "2023-07-05",
      size: "1.8 MB",
    },
    {
      id: "DOC-1005",
      name: "Mortgage Pre-Approval - John Doe.pdf",
      type: "Financial",
      property: "N/A",
      uploadedBy: "Mike Wilson",
      uploadDate: "2023-07-01",
      size: "0.9 MB",
    },
  ]

  const properties = [
    "123 Main St, Seattle, WA",
    "456 Oak Ave, Bellevue, WA",
    "789 Pine Rd, Redmond, WA",
    "321 Elm St, Kirkland, WA",
  ]

  const documentTypes = ["Contract", "Inspection", "Disclosure", "Listing", "Financial", "Other"]

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
      accessorKey: "property",
      header: "Property",
    },
    {
      accessorKey: "uploadedBy",
      header: "Uploaded By",
    },
    {
      accessorKey: "uploadDate",
      header: "Upload Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("uploadDate"))
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
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem>
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
            <SelectItem key={property} value={property}>
              {property}
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
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <label htmlFor="document-name">Document Name</label>
          <Input id="document-name" placeholder="Enter document name" />
        </div>
        <div className="grid gap-2">
          <label htmlFor="document-type">Document Type</label>
          <Select>
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
          <Select>
            <SelectTrigger id="property">
              <SelectValue placeholder="Select property" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {properties.map((property) => (
                <SelectItem key={property} value={property}>
                  {property}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <label htmlFor="file">File</label>
          <Input type="file" id="file" />
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={() => setOpen(false)}>Upload</Button>
      </div>
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Document Management"
        description="Upload and manage your documents"
        action={{
          label: "Upload Document",
          icon: FileUp,
          dialogContent: UploadDocumentDialogContent,
        }}
      />

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
                <DataTable
                  columns={columns}
                  data={documents.filter(
                    (doc) =>
                      (category.id === "all" ||
                        (category.id === "contracts" && doc.type === "Contract") ||
                        (category.id === "inspections" && doc.type === "Inspection") ||
                        (category.id === "disclosures" && doc.type === "Disclosure") ||
                        (category.id === "financial" && doc.type === "Financial")) &&
                      (documentType === "" || doc.type === documentType) &&
                      (propertyFilter === "" || doc.property === propertyFilter),
                  )}
                  searchColumn="name"
                  searchPlaceholder="Search documents..."
                />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
