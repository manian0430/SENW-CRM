"use client"

import { useState } from "react"
import { UserPlus, Mail, Phone, MoreHorizontal, Edit, Trash2, User, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DataTable } from "@/components/ui/data-table"
import { PageHeader } from "@/components/ui/page-header"
import type { ColumnDef } from "@tanstack/react-table"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Types
interface TeamMember {
  id: number
  name: string
  role: string
  email: string
  phone: string
  status: string
  avatar?: string
}

export default function TeamPage() {
  const [open, setOpen] = useState(false)
  const [roleFilter, setRoleFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  // Placeholder for API calls
  // Fetch team members from /api/team

  const teamMembers = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Agent",
      email: "sarah@example.com",
      phone: "(555) 123-4567",
      status: "Active",
    },
    {
      id: 2,
      name: "Mike Wilson",
      role: "Agent",
      email: "mike@example.com",
      phone: "(555) 987-6543",
      status: "Active",
    },
    {
      id: 3,
      name: "David Miller",
      role: "Agent",
      email: "david@example.com",
      phone: "(555) 456-7890",
      status: "Active",
    },
    {
      id: 4,
      name: "Emily Davis",
      role: "Admin",
      email: "emily@example.com",
      phone: "(555) 234-5678",
      status: "Active",
    },
    {
      id: 5,
      name: "Robert Brown",
      role: "Manager",
      email: "robert@example.com",
      phone: "(555) 876-5432",
      status: "Active",
    },
    {
      id: 6,
      name: "Jennifer Smith",
      role: "Agent",
      email: "jennifer@example.com",
      phone: "(555) 345-6789",
      status: "Inactive",
    },
  ]

  const roles = ["Agent", "Admin", "Manager"]
  const statuses = ["Active", "Inactive"]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
  }

  // Define columns for the data table
  const columns: ColumnDef<TeamMember>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={row.original.avatar} alt={row.getValue("name")} />
            <AvatarFallback>{getInitials(row.getValue("name"))}</AvatarFallback>
          </Avatar>
          <div className="font-medium">{row.getValue("name")}</div>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="flex items-center">
          <Mail className="h-4 w-4 mr-2 text-gray-500" />
          <span>{row.getValue("email")}</span>
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => (
        <div className="flex items-center">
          <Phone className="h-4 w-4 mr-2 text-gray-500" />
          <span>{row.getValue("phone")}</span>
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
                <Edit className="mr-2 h-4 w-4" />
                Edit
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
      <Select value={roleFilter} onValueChange={setRoleFilter}>
        <SelectTrigger>
          <SelectValue placeholder="Filter by role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          {roles.map((role) => (
            <SelectItem key={role} value={role}>
              {role}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger>
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {statuses.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )

  // Add Team Member Dialog Content
  const AddTeamMemberDialogContent = (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add Team Member</DialogTitle>
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
          <label htmlFor="role">Role</label>
          <Select>
            <SelectTrigger id="role">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <label htmlFor="status">Status</label>
          <Select>
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <label htmlFor="avatar">Profile Picture</label>
          <Input type="file" id="avatar" />
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={() => setOpen(false)}>Add Team Member</Button>
      </div>
    </DialogContent>
  )

  // Team views for tabs
  const views = [
    { id: "all", name: "All Members" },
    { id: "agents", name: "Agents" },
    { id: "admins", name: "Admins" },
    { id: "managers", name: "Managers" },
  ]

  // Team member cards for grid view
  const TeamMemberCard = ({ member }: { member: TeamMember }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-20 w-20 mb-4">
            <AvatarImage src={member.avatar} alt={member.name} />
            <AvatarFallback className="text-lg">{getInitials(member.name)}</AvatarFallback>
          </Avatar>
          <h3 className="font-semibold text-lg">{member.name}</h3>
          <p className="text-sm text-muted-foreground mb-2">{member.role}</p>
          <span className={`px-2 py-1 rounded-full text-xs font-medium mb-4 ${getStatusColor(member.status)}`}>
            {member.status}
          </span>
          <div className="flex flex-col space-y-2 w-full">
            <Button variant="outline" size="sm" className="w-full">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
            <Button variant="outline" size="sm" className="w-full">
              <Phone className="h-4 w-4 mr-2" />
              Call
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team Management"
        description="Manage your team members"
        action={{
          label: "Add Team Member",
          icon: UserPlus,
          dialogContent: AddTeamMemberDialogContent,
        }}
      />

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            {views.map((view) => (
              <TabsTrigger key={view.id} value={view.id}>
                {view.name}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <User className="h-4 w-4 mr-2" />
              Card View
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Table View
            </Button>
          </div>
        </div>

        {views.map((view) => (
          <TabsContent key={view.id} value={view.id}>
            <Card>
              <CardContent className="pt-6">
                <FilterControls />

                {/* Table View */}
                <div className="hidden md:block">
                  <DataTable
                    columns={columns}
                    data={teamMembers.filter(
                      (member) =>
                        (view.id === "all" ||
                          (view.id === "agents" && member.role === "Agent") ||
                          (view.id === "admins" && member.role === "Admin") ||
                          (view.id === "managers" && member.role === "Manager")) &&
                        (roleFilter === "" || member.role === roleFilter) &&
                        (statusFilter === "" || member.status === statusFilter),
                    )}
                    searchColumn="name"
                    searchPlaceholder="Search team members..."
                  />
                </div>

                {/* Card View */}
                <div className="md:hidden">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {teamMembers
                      .filter(
                        (member) =>
                          (view.id === "all" ||
                            (view.id === "agents" && member.role === "Agent") ||
                            (view.id === "admins" && member.role === "Admin") ||
                            (view.id === "managers" && member.role === "Manager")) &&
                          (roleFilter === "" || member.role === roleFilter) &&
                          (statusFilter === "" || member.status === statusFilter),
                      )
                      .map((member) => (
                        <TeamMemberCard key={member.id} member={member} />
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
