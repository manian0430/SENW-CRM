"use client"

import { useState, useEffect } from "react"
import { MoreHorizontal, Plus, Eye, Edit, Phone, Mail, MessageSquare, Calendar, MapPin, User, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DataTable } from "@/components/ui/data-table"
import { PageHeader } from "@/components/ui/page-header"
import { Skeleton } from "@/components/ui/skeleton"
import type { ColumnDef } from "@tanstack/react-table"
import { formatDistanceToNow } from 'date-fns'
import { useRouter, useSearchParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

// Types matching Supabase table
interface Lead {
  id: string
  name: string
  email?: string
  phone?: string
  status: string
  agent_name?: string
  notes?: string
  created_at: string
  updated_at: string
  is_hot: boolean
}

interface CommunicationLog {
  id: string
  communication_type: 'email' | 'sms' | 'call'
  from_address: string
  to_address: string
  subject?: string
  body?: string
  direction: 'inbound' | 'outbound'
  status: string
  timestamp: string
  gemini_analysis?: string
  property?: {
    property_address: string
  }
}

export default function LeadsPage() {
  const { supabase } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [agentFilter, setAgentFilter] = useState("all");
  const [availableAgents, setAvailableAgents] = useState<string[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [view, setView] = useState("all");
  const [communicationLogs, setCommunicationLogs] = useState<CommunicationLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsError, setLogsError] = useState<string | null>(null);

  // Sync filters from URL on mount
  useEffect(() => {
    const status = searchParams.get('status');
    const agent = searchParams.get('agent');
    if (status) setStatusFilter(status);
    if (agent) setAgentFilter(agent);
  }, [searchParams]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (statusFilter !== 'all') {
      params.set('status', statusFilter);
    } else {
      params.delete('status');
    }
    if (agentFilter !== 'all') {
      params.set('agent', agentFilter);
    } else {
      params.delete('agent');
    }
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.replace(newUrl, { scroll: false });
  }, [statusFilter, agentFilter, router]);

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

        if (view === 'hot') {
          query = query.eq('is_hot', true);
        }

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
        setLeads(data as Lead[] || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, [supabase, statusFilter, agentFilter, view]);

  // Fetch available agent names
  useEffect(() => {
    const fetchAgents = async () => {
       try {
         const { data, error } = await supabase
           .from('team_members')
           .select('name')
           .order('name', { ascending: true });

         if (error) {
           console.error("Error fetching team members:", error);
         } else {
           const uniqueAgentNames = Array.from(new Set(data.map(member => member.name))) as string[];
           setAvailableAgents(uniqueAgentNames);
         }
       } catch (err) {
          console.error("Client-side error fetching agents:", err);
       }
    };
    fetchAgents();
  }, [supabase]);

  // Fetch communication logs when dialog opens
  useEffect(() => {
    if (viewDialogOpen && selectedLead) {
      fetchCommunicationLogs(selectedLead);
    } else if (!viewDialogOpen) {
      // Clear logs when dialog closes
      setCommunicationLogs([]);
      setLogsLoading(false);
      setLogsError(null);
    }
  }, [viewDialogOpen, selectedLead]);


  const getStatusColor = (status: string) => {
    switch (status) {
      case "Hot": return "bg-red-100 text-red-800"
      case "Cold": return "bg-blue-100 text-blue-800"
      case "New": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const columns: ColumnDef<Lead>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="font-medium flex items-center">
          {row.original.is_hot && <span className="mr-2">🔥</span>}
          {row.getValue("name")}
        </div>
      ),
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
      accessorKey: "agent_name",
      header: "Assigned Agent",
      cell: ({ row }) => row.getValue("agent_name") || 'N/A',
    },
    {
      accessorKey: "updated_at",
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
              <DropdownMenuItem onClick={() => { setSelectedLead(row.original); setViewDialogOpen(true); }}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSelectedLead(row.original); setEditDialogOpen(true); }}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Lead
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ]

  const FilterControls = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger><SelectValue placeholder="Filter by status" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="Hot">Hot</SelectItem>
          <SelectItem value="Cold">Cold</SelectItem>
          <SelectItem value="New">New</SelectItem>
        </SelectContent>
      </Select>
      <Select value={agentFilter} onValueChange={setAgentFilter}>
        <SelectTrigger><SelectValue placeholder="Filter by agent" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Agents</SelectItem>
          {availableAgents.map((agent) => (
            <SelectItem key={agent} value={agent}>{agent}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )

  const AddLeadDialogContent = () => {
    // This component's implementation is assumed to be correct and is omitted for brevity
    // It should handle adding a new lead via a form in a dialog
    return <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>{/* ... */}</Dialog>;
  };
  
  // Helper to parse notes field
  function parseNotes(notes?: string) {
    if (!notes) return {};
    const lines = notes.split(/\r?\n/);
    const result: Record<string, string> = {};
    for (const line of lines) {
      const [key, ...rest] = line.split(':');
      if (rest.length > 0) {
        result[key.trim().toLowerCase()] = rest.join(':').trim();
      }
    }
    return result;
  }

  const ViewLeadDialog = () => {
    if (!selectedLead) return null;
    
    const parsed = parseNotes(selectedLead.notes);

    return (
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Lead Details: {selectedLead.name}
              {selectedLead.is_hot && <span className="text-red-500">🔥</span>}
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="communications">Communications</TabsTrigger>
              <TabsTrigger value="agent-activity">Agent Activity</TabsTrigger>
              <TabsTrigger value="property">Property Info</TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[60vh] mt-4">
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-semibold">Name:</span>
                      <span>{selectedLead.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="font-semibold">Email:</span>
                      <span>{selectedLead.email || '—'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="font-semibold">Phone:</span>
                      <span>{selectedLead.phone || '—'}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="font-semibold">Status:</span>
                      <Badge className={`ml-2 ${getStatusColor(selectedLead.status)}`}>
                        {selectedLead.status}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-semibold">Assigned Agent:</span>
                      <span className="ml-2">{selectedLead.agent_name || '—'}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Is Hot Lead:</span>
                      <Badge variant={selectedLead.is_hot ? "destructive" : "secondary"} className="ml-2">
                        {selectedLead.is_hot ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="font-semibold">Created:</span>
                    <span>{selectedLead.created_at ? new Date(selectedLead.created_at).toLocaleString() : '—'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="font-semibold">Last Updated:</span>
                    <span>{selectedLead.updated_at ? new Date(selectedLead.updated_at).toLocaleString() : '—'}</span>
                  </div>
                </div>

                {Object.keys(parsed).length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <h4 className="font-semibold">Lead Source Information:</h4>
                      {parsed['type'] && <div><span className="font-medium">Log Type:</span> {parsed['type']}</div>}
                      {parsed['subject'] && <div><span className="font-medium">Subject:</span> {parsed['subject']}</div>}
                      {parsed['message'] && <div><span className="font-medium">Message:</span> {parsed['message']}</div>}
                      {parsed['property'] && <div><span className="font-medium">Property:</span> {parsed['property']}</div>}
                      {parsed['from'] && <div><span className="font-medium">From:</span> {parsed['from']}</div>}
                      {parsed['to'] && <div><span className="font-medium">To:</span> {parsed['to']}</div>}
                    </div>
                  </>
                )}
              </TabsContent>

              <TabsContent value="communications" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Communication History</h4>
                  <Badge variant="outline">{communicationLogs.length} communications</Badge>
                </div>
                
                {logsLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                ) : logsError ? (
                  <div className="text-red-500 text-center py-8">{logsError}</div>
                ) : communicationLogs.length === 0 ? (
                  <div className="text-gray-500 text-center py-8">No communication history found</div>
                ) : (
                  <div className="space-y-3">
                    {communicationLogs.map((log) => (
                      <div key={log.id} className="border rounded-lg p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getCommunicationIcon(log.communication_type)}
                            <span className="font-medium capitalize">{log.communication_type}</span>
                            {getDirectionBadge(log.direction)}
                            {getStatusBadge(log.status)}
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div><span className="font-medium">From:</span> {log.from_address}</div>
                          <div><span className="font-medium">To:</span> {log.to_address}</div>
                        </div>
                        
                        {log.subject && (
                          <div><span className="font-medium">Subject:</span> {log.subject}</div>
                        )}
                        
                        {log.body && (
                          <div>
                            <span className="font-medium">Content:</span>
                            <div className="mt-1 text-sm bg-gray-50 rounded p-2 max-h-20 overflow-y-auto">
                              {log.body.length > 200 ? `${log.body.substring(0, 200)}...` : log.body}
                            </div>
                          </div>
                        )}
                        
                        {log.property?.property_address && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">Property:</span> {log.property.property_address}
                          </div>
                        )}
                        
                        {log.gemini_analysis && (
                          <div>
                            <span className="font-medium">AI Analysis:</span>
                            <div className="mt-1 text-sm bg-blue-50 rounded p-2">
                              {log.gemini_analysis}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="agent-activity" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Agent Activity</h4>
                  <Badge variant="outline">
                    {communicationLogs.filter(log => log.direction === 'outbound').length} outbound
                  </Badge>
                </div>
                
                {logsLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {communicationLogs
                      .filter(log => log.direction === 'outbound')
                      .map((log) => (
                        <div key={log.id} className="border rounded-lg p-4 space-y-2 bg-blue-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getCommunicationIcon(log.communication_type)}
                              <span className="font-medium">Agent {log.communication_type}</span>
                              {getStatusBadge(log.status)}
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(log.timestamp).toLocaleString()}
                            </span>
                          </div>
                          
                          {log.subject && (
                            <div><span className="font-medium">Subject:</span> {log.subject}</div>
                          )}
                          
                          {log.body && (
                            <div>
                              <span className="font-medium">Content:</span>
                              <div className="mt-1 text-sm bg-white rounded p-2 max-h-20 overflow-y-auto">
                                {log.body.length > 200 ? `${log.body.substring(0, 200)}...` : log.body}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    
                    {communicationLogs.filter(log => log.direction === 'outbound').length === 0 && (
                      <div className="text-gray-500 text-center py-8">No agent activity found</div>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="property" className="space-y-4">
                <h4 className="font-semibold">Property Information</h4>
                
                {parsed['property'] ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Property Address:</span>
                      <span>{parsed['property']}</span>
                    </div>
                    
                    {/* Show communications related to this property */}
                    {communicationLogs.filter(log => log.property?.property_address).length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <span className="font-medium">Property Communications:</span>
                          <div className="mt-2 space-y-2">
                            {communicationLogs
                              .filter(log => log.property?.property_address)
                              .map((log) => (
                                <div key={log.id} className="text-sm bg-gray-50 rounded p-2">
                                  <div className="flex items-center gap-2">
                                    {getCommunicationIcon(log.communication_type)}
                                    <span>{new Date(log.timestamp).toLocaleDateString()}</span>
                                    <span>-</span>
                                    <span>{log.communication_type}</span>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="text-gray-500 text-center py-8">No property information available</div>
                )}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </DialogContent>
      </Dialog>
    );
  };
  
  const EditLeadDialog = () => {
      // This component's implementation is assumed to be correct and is omitted for brevity
      // It should handle editing a lead in a dialog
      return <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>{/* ... */}</Dialog>;
  };

  const DataTableWithFilters = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm">
        <FilterControls />
        {loading ? (
          <Skeleton className="h-64 w-full" />
        ) : error ? (
          <div className="text-red-500 text-center py-10">{error}</div>
        ) : (
          <DataTable
            columns={columns}
            data={leads}
            searchColumn="name"
            searchPlaceholder="Search leads..."
          />
        )}
      </div>
  )

  const getCommunicationIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'sms': return <MessageSquare className="h-4 w-4" />;
      case 'call': return <Phone className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getDirectionBadge = (direction: string) => {
    return (
      <Badge variant={direction === 'inbound' ? 'default' : 'secondary'}>
        {direction === 'inbound' ? 'Received' : 'Sent'}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      'sent': 'bg-green-100 text-green-800',
      'delivered': 'bg-blue-100 text-blue-800',
      'failed': 'bg-red-100 text-red-800',
      'initiated': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-green-100 text-green-800'
    };
    
    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  // Fetch communication logs for a specific lead
  const fetchCommunicationLogs = async (lead: Lead) => {
    setLogsLoading(true);
    setLogsError(null);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock communication data
    const mockLogs: CommunicationLog[] = [
      {
        id: '1',
        communication_type: 'email',
        from_address: 'agent@senw.io',
        to_address: lead.email || 'lead@example.com',
        subject: 'Property Inquiry - 123 Main St',
        body: 'Hi there! Thank you for your interest in the property at 123 Main St. I\'d be happy to schedule a viewing for you. The property features 3 bedrooms, 2 bathrooms, and a beautiful backyard. Would you be available this weekend?',
        direction: 'outbound',
        status: 'sent',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        gemini_analysis: 'Mock Analysis: Professional tone, clear property details, proactive scheduling request. Sentiment: Positive (0.85)',
        property: { property_address: '123 Main St, Chicago, IL' }
      },
      {
        id: '2',
        communication_type: 'sms',
        from_address: lead.phone || '+1234567890',
        to_address: '+1987654321',
        subject: undefined,
        body: 'Hi! I saw your listing for 123 Main St. Is it still available? I\'m very interested and would like to see it ASAP.',
        direction: 'inbound',
        status: 'delivered',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        gemini_analysis: 'Mock Analysis: High urgency, strong interest indicated, immediate action requested. Sentiment: Very Positive (0.92) - HOT LEAD',
        property: { property_address: '123 Main St, Chicago, IL' }
      },
      {
        id: '3',
        communication_type: 'call',
        from_address: '+1987654321',
        to_address: lead.phone || '+1234567890',
        subject: undefined,
        body: 'Outbound call to discuss property details and schedule viewing',
        direction: 'outbound',
        status: 'completed',
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        gemini_analysis: 'Mock Analysis: Call duration: 8 minutes. Lead showed strong interest in financing options. Sentiment: Positive (0.78)',
        property: { property_address: '123 Main St, Chicago, IL' }
      },
      {
        id: '4',
        communication_type: 'email',
        from_address: lead.email || 'lead@example.com',
        to_address: 'agent@senw.io',
        subject: 'Re: Property Inquiry - 123 Main St',
        body: 'Thank you for the quick response! Yes, I would love to see the property this weekend. Saturday afternoon would work best for me. Also, could you send me more details about the financing options you mentioned?',
        direction: 'inbound',
        status: 'sent',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        gemini_analysis: 'Mock Analysis: Engaged response, specific scheduling request, financing interest. Sentiment: Positive (0.88)',
        property: { property_address: '123 Main St, Chicago, IL' }
      },
      {
        id: '5',
        communication_type: 'sms',
        from_address: '+1987654321',
        to_address: lead.phone || '+1234567890',
        subject: undefined,
        body: 'Perfect! I\'ve scheduled your viewing for Saturday at 2 PM. I\'ll also prepare the financing information for you. Looking forward to meeting you!',
        direction: 'outbound',
        status: 'delivered',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        gemini_analysis: 'Mock Analysis: Confirmation message, proactive preparation, positive tone. Sentiment: Professional (0.82)',
        property: { property_address: '123 Main St, Chicago, IL' }
      }
    ];
    
    setCommunicationLogs(mockLogs);
    setLogsLoading(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leads"
        description="Manage your leads and prospects"
        action={{
          label: "Add Lead",
          icon: Plus,
          onClick: () => setOpenAddDialog(true),
        }}
      />

      <AddLeadDialogContent />
      {selectedLead && <>
          <ViewLeadDialog />
          <EditLeadDialog />
      </>}

      <Tabs value={view} onValueChange={setView}>
        <TabsList>
          <TabsTrigger value="all">All Leads</TabsTrigger>
          <TabsTrigger value="hot">🔥 Hot Leads</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <DataTableWithFilters />
        </TabsContent>
        <TabsContent value="hot" className="mt-4">
          <DataTableWithFilters />
        </TabsContent>
      </Tabs>
    </div>
  )
}
