"use client"

import { useState, useEffect } from "react" // Import useEffect
import { MoreHorizontal, Plus, Eye, Edit } from "lucide-react"
import { useAuth } from "@/contexts/auth-context" // Import useAuth
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog" // Import Dialog components fully
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DataTable } from "@/components/ui/data-table"
import { PageHeader } from "@/components/ui/page-header"
import { Skeleton } from "@/components/ui/skeleton" // Import Skeleton
import type { ColumnDef } from "@tanstack/react-table"
import { formatDistanceToNow } from 'date-fns' // For relative time formatting

// Types matching Supabase table
interface Lead {
  id: string // UUID from Supabase
  name: string
  email?: string
  phone?: string
  status: string
  agent_name?: string // Matches table column
  notes?: string
  created_at: string
  updated_at: string
}

export default function LeadsPage() {
  const { supabase } = useAuth(); // Get Supabase client
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all"); // Default to 'all'
  const [agentFilter, setAgentFilter] = useState("all");
  const [availableAgents, setAvailableAgents] = useState<string[]>([]); // State for agent names

  // Fetch leads data, applying filters
  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      setError(null);
      try {
        let query = supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false });

        // Apply status filter
        if (statusFilter && statusFilter !== "all") {
          query = query.eq('status', statusFilter);
        }

        // Apply agent filter
        if (agentFilter && agentFilter !== "all") {
          query = query.eq('agent_name', agentFilter);
        }

        const { data, error: dbError } = await query;

        if (dbError) {
          console.error("Error fetching leads:", dbError);
          throw new Error("Could not load leads data.");
        }
        setLeads(data || []);

        // Removed agent population from leads fetch
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, [supabase, statusFilter, agentFilter]); // Re-fetch leads when filters change

  // Fetch available agent names from team_members table on mount
  useEffect(() => {
    const fetchAgents = async () => {
       try {
         const { data, error } = await supabase
           .from('team_members')
           .select('name') // Select only the name column
           .order('name', { ascending: true });

         if (error) {
           console.error("Error fetching team members:", error);
           // Handle error appropriately, maybe set an error state
         } else {
           // Extract unique names and update state
           const uniqueAgentNames = Array.from(new Set(data.map(member => member.name))) as string[];
           setAvailableAgents(uniqueAgentNames);
         }
       } catch (err) {
          console.error("Client-side error fetching agents:", err);
       }
    };
    fetchAgents();
  }, [supabase]); // Fetch agents only once when supabase client is available


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
      // Corrected: Removed duplicate accessorKey, keep only agent_name
      accessorKey: "agent_name", // Use agent_name from table
      header: "Assigned Agent",
      cell: ({ row }) => row.getValue("agent_name") || 'N/A',
    },
    {
      accessorKey: "updated_at", // Use updated_at timestamp
      header: "Last Updated",
      cell: ({ row }) => formatDistanceToNow(new Date(row.getValue("updated_at")), { addSuffix: true }),
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
          {/* Use dynamic agents from state */}
          {availableAgents.map((agent) => (
            <SelectItem key={agent} value={agent}>
              {agent}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )

  // Add Lead Dialog Component with state and save logic
  const AddLeadDialogContent = () => {
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [newNotes, setNewNotes] = useState('');
    const [newStatus, setNewStatus] = useState('New'); // Default status
    const [newAgent, setNewAgent] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    const handleAddLead = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSaving(true);
      setSaveError(null);

      try {
        const { error: insertError } = await supabase
          .from('leads')
          .insert({
            name: newName,
            email: newEmail || null, // Handle empty string
            phone: newPhone || null, // Handle empty string
            notes: newNotes || null, // Handle empty string
            status: newStatus,
            agent_name: newAgent || null, // Handle empty string
            // created_at and updated_at will be set by default/trigger
          });

        if (insertError) {
          console.error("Error inserting lead:", insertError);
          throw new Error(insertError.message || "Failed to save lead.");
        }

        // Success
        setOpenAddDialog(false); // Close dialog
        // Manually trigger a refresh by changing a dependency of the main fetch useEffect
        // A simple way is to slightly modify a filter and then reset it,
        // or add a dedicated refresh state trigger. Let's reset filters for now.
        setStatusFilter("all");
        setAgentFilter("all");
        // Alternatively, could call fetchLeads() directly if passed as prop

      } catch (err) {
        setSaveError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setIsSaving(false);
      }
    };

    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Lead</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleAddLead}>
          <div className="grid gap-4 py-4">
            {/* Form fields with state binding */}
            <div className="grid gap-2">
              <label htmlFor="name">Name</label>
              <Input id="name" placeholder="Full name" required value={newName} onChange={(e) => setNewName(e.target.value)} disabled={isSaving} />
            </div>
            <div className="grid gap-2">
              <label htmlFor="email">Email</label>
              <Input id="email" type="email" placeholder="Email address" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} disabled={isSaving} />
            </div>
            <div className="grid gap-2">
              <label htmlFor="phone">Phone</label>
              <Input id="phone" placeholder="Phone number" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} disabled={isSaving} />
            </div>
            <div className="grid gap-2">
              <label htmlFor="notes">Notes</label>
              <Textarea id="notes" placeholder="Additional information" value={newNotes} onChange={(e) => setNewNotes(e.target.value)} disabled={isSaving} />
            </div>
            <div className="grid gap-2">
              <label htmlFor="status">Status</label>
              <Select value={newStatus} onValueChange={setNewStatus} disabled={isSaving}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Hot">Hot</SelectItem>
                  <SelectItem value="Cold">Cold</SelectItem>
                  {/* Add other statuses if needed */}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="agent">Assigned Agent</label>
              <Select value={newAgent} onValueChange={setNewAgent} disabled={isSaving}>
                <SelectTrigger id="agent">
                  <SelectValue placeholder="Select agent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem> {/* Option for no agent */}
                  {availableAgents.map((agent) => (
                    <SelectItem key={agent} value={agent}>
                      {agent}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
             {saveError && <p className="text-sm text-red-500">{saveError}</p>}
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Lead'}
            </Button>
          </div>
        </form>
      </DialogContent>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lead Management"
        description="Manage and track your leads"
        // Reverted: Use the 'action' prop structure expected by PageHeader
        action={{
          label: "Add New Lead",
          icon: Plus,
          // Trigger dialog opening via state, not directly in prop
          onClick: () => setOpenAddDialog(true),
        }}
      />

      {/* Keep Dialog separate from PageHeader */}
      <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
         <AddLeadDialogContent />
      </Dialog>

      <FilterControls />

      {loading && <Skeleton className="h-64 w-full" />}
      {error && <p className="text-red-500">Error loading leads: {error}</p>}
      {!loading && !error && (
        <DataTable columns={columns} data={leads} searchColumn="name" searchPlaceholder="Search leads..." />
      )}
    </div>
  )
}
