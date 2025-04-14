"use client"

import { useState, useRef, FormEvent } from "react"
import { UserPlus, Mail, Phone, MoreHorizontal, Edit, Trash2, User, FileText, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DialogContent, DialogHeader, DialogTitle, Dialog } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DataTable } from "@/components/ui/data-table"
import { PageHeader } from "@/components/ui/page-header"
import type { ColumnDef } from "@tanstack/react-table"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTeam } from "@/hooks/useTeam"
import { type TeamMember } from "@/app/services/team"
import { toast } from "sonner"

export default function TeamPage() {
  const { teamMembers, isLoading, addTeamMember, updateTeamMember, deleteTeamMember } = useTeam()
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [open, setOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [viewMode, setViewMode] = useState<"card" | "table">("table")

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    status: "Active"
  })
  const avatarFileRef = useRef<HTMLInputElement>(null)

  const roles = ["Agent", "Admin", "Manager"]
  const statuses = ["Active", "Inactive"]

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "",
      status: "Active"
    })
    if (avatarFileRef.current) avatarFileRef.current.value = ""
    setEditingMember(null)
  }

  const handleOpenDialog = (member?: TeamMember) => {
    if (member) {
      setEditingMember(member)
      setFormData({
        name: member.name,
        email: member.email,
        phone: member.phone,
        role: member.role,
        status: member.status
      })
    } else {
      resetForm()
    }
    setOpen(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.role) {
      toast.error("Please fill all required fields")
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const avatarFile = avatarFileRef.current?.files?.[0]
      
      if (editingMember) {
        // Update existing team member
        await updateTeamMember(
          editingMember.id,
          formData,
          avatarFile
        )
      } else {
        // Add new team member
        await addTeamMember(formData, avatarFile)
      }
      
      resetForm()
      setOpen(false)
    } catch (error) {
      console.error("Error saving team member:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string, avatarUrl?: string | null) => {
    if (confirm("Are you sure you want to delete this team member?")) {
      try {
        await deleteTeamMember(id, avatarUrl)
      } catch (error) {
        console.error("Error deleting team member:", error)
      }
    }
  }

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
            <AvatarImage src={(row.original.avatar_url || "") as string} alt={row.getValue("name")} />
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
              <DropdownMenuItem onClick={() => handleOpenDialog(row.original)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(row.original.id, row.original.avatar_url)}>
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

  // Team Member Form Dialog Content
  const TeamMemberFormDialog = (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetForm()
      setOpen(isOpen)
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingMember ? "Edit Team Member" : "Add Team Member"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="name">Name*</label>
            <Input 
              id="name" 
              placeholder="Full name" 
              value={formData.name}
              onChange={(e) => handleFormChange("name", e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="email">Email*</label>
            <Input 
              id="email" 
              type="email" 
              placeholder="Email address" 
              value={formData.email}
              onChange={(e) => handleFormChange("email", e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="phone">Phone</label>
            <Input 
              id="phone" 
              placeholder="Phone number" 
              value={formData.phone}
              onChange={(e) => handleFormChange("phone", e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="role">Role*</label>
            <Select 
              value={formData.role} 
              onValueChange={(value) => handleFormChange("role", value)}
              required
            >
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
            <Select 
              value={formData.status} 
              onValueChange={(value) => handleFormChange("status", value)}
            >
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
            <Input 
              type="file" 
              id="avatar" 
              ref={avatarFileRef}
              accept="image/*"
            />
            {editingMember?.avatar_url && (
              <div className="flex items-center gap-2 mt-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={editingMember.avatar_url} alt={editingMember.name} />
                  <AvatarFallback>{getInitials(editingMember.name)}</AvatarFallback>
                </Avatar>
                <span className="text-xs text-gray-500">Current profile picture</span>
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editingMember ? "Updating..." : "Adding..."}
                </>
              ) : (
                editingMember ? "Update Team Member" : "Add Team Member"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )

  // Team views for tabs
  const views = [
    { id: "all", name: "All Members" },
    { id: "agents", name: "Agents" },
    { id: "admins", name: "Admins" },
    { id: "managers", name: "Managers" },
  ]

  // Filter team members based on selected filters and view
  const filteredMembers = teamMembers.filter(member => {
    const roleMatch = roleFilter === "all" || member.role === roleFilter
    const statusMatch = statusFilter === "all" || member.status === statusFilter
    return roleMatch && statusMatch
  })

  // Team member cards for grid view
  const TeamMemberCard = ({ member }: { member: TeamMember }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-20 w-20 mb-4">
            <AvatarImage src={(member.avatar_url || "") as string} alt={member.name} />
            <AvatarFallback className="text-lg">{getInitials(member.name)}</AvatarFallback>
          </Avatar>
          <h3 className="font-semibold text-lg">{member.name}</h3>
          <p className="text-sm text-muted-foreground mb-2">{member.role}</p>
          <span className={`px-2 py-1 rounded-full text-xs font-medium mb-4 ${getStatusColor(member.status)}`}>
            {member.status}
          </span>
          <div className="flex flex-col space-y-2 w-full">
            <Button variant="outline" size="sm" className="w-full" asChild>
              <a href={`mailto:${member.email}`}>
                <Mail className="h-4 w-4 mr-2" />
                Email
              </a>
            </Button>
            {member.phone && (
              <Button variant="outline" size="sm" className="w-full" asChild>
                <a href={`tel:${member.phone}`}>
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </a>
              </Button>
            )}
            <div className="flex gap-2 mt-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => handleOpenDialog(member)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm" className="flex-1" onClick={() => handleDelete(member.id, member.avatar_url)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
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
          onClick: () => handleOpenDialog(),
        }}
      />

      {TeamMemberFormDialog}

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
            <Button 
              variant={viewMode === "card" ? "default" : "outline"} 
              size="sm"
              onClick={() => setViewMode("card")}
            >
              <User className="h-4 w-4 mr-2" />
              Card View
            </Button>
            <Button 
              variant={viewMode === "table" ? "default" : "outline"} 
              size="sm"
              onClick={() => setViewMode("table")}
            >
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
                
                {isLoading && !teamMembers.length ? (
                  <div className="flex items-center justify-center h-48">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : (
                  <>
                    {/* Table View */}
                    {viewMode === "table" && (
                      <div className="hidden md:block">
                        <DataTable
                          columns={columns}
                          data={filteredMembers.filter(member => 
                            view.id === "all" ||
                            (view.id === "agents" && member.role === "Agent") ||
                            (view.id === "admins" && member.role === "Admin") ||
                            (view.id === "managers" && member.role === "Manager")
                          )}
                          searchColumn="name"
                          searchPlaceholder="Search team members..."
                        />
                      </div>
                    )}

                    {/* Card View */}
                    {viewMode === "card" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredMembers
                          .filter(member =>
                            view.id === "all" ||
                            (view.id === "agents" && member.role === "Agent") ||
                            (view.id === "admins" && member.role === "Admin") ||
                            (view.id === "managers" && member.role === "Manager")
                          )
                          .map((member) => (
                            <TeamMemberCard key={member.id} member={member} />
                          ))}
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
