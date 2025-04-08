"use client"

import { useState } from "react"
import { MoreHorizontal, Plus, Eye, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DataTable } from "@/components/ui/data-table"
import { PageHeader } from "@/components/ui/page-header"
import type { ColumnDef } from "@tanstack/react-table"

// Types
interface Lead {
  id: number
  name: string
  email: string
  phone: string
  status: string
  agent: string
  updated: string
}

export default function LeadsPage() {
  const [open, setOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState("")
  const [agentFilter, setAgentFilter] = useState("")

  // Placeholder for API calls
  // Fetch leads from /api/leads

  const leads = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "(555) 123-4567",
      status: "Hot",
      agent: "Sarah Johnson",
      updated: "2 days ago",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "(555) 987-6543",
      status: "Cold",
      agent: "Mike Wilson",
      updated: "1 week ago",
    },
    {
      id: 3,
      name: "Robert Brown",
      email: "robert@example.com",
      phone: "(555) 456-7890",
      status: "New",
      agent: "Sarah Johnson",
      updated: "1 day ago",
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily@example.com",
      phone: "(555) 234-5678",
      status: "Hot",
      agent: "David Miller",
      updated: "3 days ago",
    },
    {
      id: 5,
      name: "Michael Wilson",
      email: "michael@example.com",
      phone: "(555) 876-5432",
      status: "New",
      agent: "Mike Wilson",
      updated: "Just now",
    },
  ]

  const agents = ["Sarah Johnson", "Mike Wilson", "David Miller"]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Hot":
        return "bg-red-100 text-red-800"
      case "Cold":
        return "bg-blue-100 text-blue-800"
      case "New":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Define columns for the data table
  const columns: ColumnDef<Lead>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "contact",
      header: "Contact",
      cell: ({ row }) => (
        <div>
          <div>{row.original.email}</div>
          <div className="text-sm text-gray-500">{row.original.phone}</div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(row.getValue("status"))}`}>
          {row.getValue("status")}
        </span>
      ),
    },
    {
      accessorKey: "agent",
      header: "Assigned Agent",
    },
    {
      accessorKey: "updated",
      header: "Last Updated",
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
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit Lead
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
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger>
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="Hot">Hot</SelectItem>
          <SelectItem value="Cold">Cold</SelectItem>
          <SelectItem value="New">New</SelectItem>
        </SelectContent>
      </Select>
      <Select value={agentFilter} onValueChange={setAgentFilter}>
        <SelectTrigger>
          <SelectValue placeholder="Filter by agent" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Agents</SelectItem>
          {agents.map((agent) => (
            <SelectItem key={agent} value={agent}>
              {agent}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )

  // Add Lead Dialog Content
  const AddLeadDialogContent = (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add New Lead</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <label htmlFor="name">Name</label>
          <Input id="name" placeholder="Full name" />
        </div>
        <div className="grid gap-2">
          <label htmlFor="email">Email</label>
          <Input id="email" type="email" placeholder="Email address" />
        </div>
        <div className="grid gap-2">
          <label htmlFor="phone">Phone</label>
          <Input id="phone" placeholder="Phone number" />
        </div>
        <div className="grid gap-2">
          <label htmlFor="notes">Notes</label>
          <Textarea id="notes" placeholder="Additional information" />
        </div>
        <div className="grid gap-2">
          <label htmlFor="status">Status</label>
          <Select>
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Hot">Hot</SelectItem>
              <SelectItem value="Cold">Cold</SelectItem>
              <SelectItem value="New">New</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <label htmlFor="agent">Assigned Agent</label>
          <Select>
            <SelectTrigger id="agent">
              <SelectValue placeholder="Select agent" />
            </SelectTrigger>
            <SelectContent>
              {agents.map((agent) => (
                <SelectItem key={agent} value={agent.toLowerCase().replace(" ", "-")}>
                  {agent}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={() => setOpen(false)}>Save Lead</Button>
      </div>
    </DialogContent>
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lead Management"
        description="Manage and track your leads"
        action={{
          label: "Add New Lead",
          icon: Plus,
          dialogContent: AddLeadDialogContent,
        }}
      />

      <FilterControls />

      <DataTable columns={columns} data={leads} searchColumn="name" searchPlaceholder="Search leads..." />
    </div>
  )
}
