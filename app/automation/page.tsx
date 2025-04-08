"use client"

import { useState } from "react"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Plus,
  Clock,
  Mail,
  Bell,
  FileText,
  MoreHorizontal,
  Play,
  Pause,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function AutomationPage() {
  const [activeTab, setActiveTab] = useState("workflows")

  // Sample data for workflows
  const workflows = [
    {
      id: 1,
      name: "New Lead Follow-up",
      description: "Automatically send follow-up emails to new leads",
      trigger: "New Lead Created",
      actions: ["Send Email", "Create Task"],
      status: "Active",
      lastRun: "2 hours ago",
      runs: 45,
    },
    {
      id: 2,
      name: "Property Showing Reminder",
      description: "Send reminders for upcoming property showings",
      trigger: "24h Before Showing",
      actions: ["Send Email", "Send SMS"],
      status: "Active",
      lastRun: "5 hours ago",
      runs: 32,
    },
    {
      id: 3,
      name: "Listing Update Notification",
      description: "Notify clients when their listing receives an update",
      trigger: "Listing Updated",
      actions: ["Send Email", "Create Notification"],
      status: "Paused",
      lastRun: "2 days ago",
      runs: 18,
    },
    {
      id: 4,
      name: "Document Expiration Alert",
      description: "Alert when documents are about to expire",
      trigger: "7 Days Before Expiration",
      actions: ["Send Email", "Create Task"],
      status: "Active",
      lastRun: "1 day ago",
      runs: 12,
    },
    {
      id: 5,
      name: "Lead Nurturing Sequence",
      description: "Send a series of emails to nurture cold leads",
      trigger: "Lead Status Changed to Cold",
      actions: ["Send Email Sequence", "Schedule Follow-up"],
      status: "Active",
      lastRun: "3 hours ago",
      runs: 27,
    },
  ]

  // Sample data for email templates
  const emailTemplates = [
    {
      id: 1,
      name: "New Lead Welcome",
      subject: "Welcome to SENW Realty",
      lastEdited: "2023-07-15",
      category: "Lead Nurturing",
    },
    {
      id: 2,
      name: "Property Showing Confirmation",
      subject: "Your Showing Appointment is Confirmed",
      lastEdited: "2023-07-12",
      category: "Appointments",
    },
    {
      id: 3,
      name: "Price Reduction Notification",
      subject: "Price Reduced on Your Favorite Property",
      lastEdited: "2023-07-10",
      category: "Listings",
    },
    {
      id: 4,
      name: "Follow-up After Showing",
      subject: "Following Up on Your Recent Property Viewing",
      lastEdited: "2023-07-05",
      category: "Follow-up",
    },
    {
      id: 5,
      name: "Monthly Market Update",
      subject: "Your Local Real Estate Market Update",
      lastEdited: "2023-07-01",
      category: "Marketing",
    },
  ]

  // Sample data for automation logs
  const automationLogs = [
    {
      id: 1,
      workflow: "New Lead Follow-up",
      trigger: "New Lead: John Smith",
      actions: ["Email Sent", "Task Created"],
      status: "Success",
      timestamp: "2023-07-15 14:32:45",
    },
    {
      id: 2,
      workflow: "Property Showing Reminder",
      trigger: "Showing: 123 Main St",
      actions: ["Email Sent", "SMS Sent"],
      status: "Success",
      timestamp: "2023-07-15 10:15:22",
    },
    {
      id: 3,
      workflow: "Listing Update Notification",
      trigger: "Listing Updated: 456 Oak Ave",
      actions: ["Email Sent"],
      status: "Failed",
      timestamp: "2023-07-14 16:45:30",
      error: "Invalid email address",
    },
    {
      id: 4,
      workflow: "Document Expiration Alert",
      trigger: "Document: Purchase Agreement",
      actions: ["Email Sent", "Task Created"],
      status: "Success",
      timestamp: "2023-07-14 09:22:18",
    },
    {
      id: 5,
      workflow: "Lead Nurturing Sequence",
      trigger: "Lead Status Changed: Sarah Johnson",
      actions: ["Email 1 Sent"],
      status: "Success",
      timestamp: "2023-07-13 11:05:42",
    },
  ]

  // Create Workflow Dialog Content
  const CreateWorkflowDialog = (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Create New Workflow</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="workflow-name">Workflow Name</Label>
          <Input id="workflow-name" placeholder="Enter workflow name" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="workflow-description">Description</Label>
          <Textarea id="workflow-description" placeholder="Describe what this workflow does" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="trigger-type">Trigger</Label>
          <Select>
            <SelectTrigger id="trigger-type">
              <SelectValue placeholder="Select trigger event" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new-lead">New Lead Created</SelectItem>
              <SelectItem value="lead-status-change">Lead Status Changed</SelectItem>
              <SelectItem value="property-update">Property Updated</SelectItem>
              <SelectItem value="showing-scheduled">Showing Scheduled</SelectItem>
              <SelectItem value="document-uploaded">Document Uploaded</SelectItem>
              <SelectItem value="time-based">Time-based Trigger</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="border rounded-md p-4">
          <h3 className="font-medium mb-2">Actions</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="send-email">Send Email</SelectItem>
                  <SelectItem value="send-sms">Send SMS</SelectItem>
                  <SelectItem value="create-task">Create Task</SelectItem>
                  <SelectItem value="create-notification">Create Notification</SelectItem>
                  <SelectItem value="update-record">Update Record</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Action
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch id="activate" />
          <Label htmlFor="activate">Activate workflow immediately</Label>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline">Cancel</Button>
        <Button className="bg-senw-gold hover:bg-senw-gold/90 text-white">Create Workflow</Button>
      </DialogFooter>
    </DialogContent>
  )

  // Create Email Template Dialog Content
  const CreateEmailTemplateDialog = (
    <DialogContent className="sm:max-w-[700px]">
      <DialogHeader>
        <DialogTitle>Create Email Template</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="template-name">Template Name</Label>
            <Input id="template-name" placeholder="Enter template name" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="template-category">Category</Label>
            <Select>
              <SelectTrigger id="template-category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lead-nurturing">Lead Nurturing</SelectItem>
                <SelectItem value="appointments">Appointments</SelectItem>
                <SelectItem value="listings">Listings</SelectItem>
                <SelectItem value="follow-up">Follow-up</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email-subject">Subject Line</Label>
          <Input id="email-subject" placeholder="Enter email subject" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email-body">Email Body</Label>
          <div className="border rounded-md p-2 min-h-[300px]">
            {/* This would be a rich text editor in a real implementation */}
            <Textarea
              id="email-body"
              placeholder="Compose your email..."
              className="min-h-[280px] border-none focus-visible:ring-0 resize-none"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            Insert Placeholder
          </Button>
          <Button variant="outline" size="sm">
            Preview
          </Button>
          <Button variant="outline" size="sm">
            Test Send
          </Button>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline">Cancel</Button>
        <Button className="bg-senw-gold hover:bg-senw-gold/90 text-white">Save Template</Button>
      </DialogFooter>
    </DialogContent>
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Task Automation"
        description="Create and manage automated workflows for your business processes"
        action={{
          label: "Create Workflow",
          icon: Plus,
          dialogContent: CreateWorkflowDialog,
        }}
      />

      <Tabs defaultValue="workflows" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="workflows" className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Workflows
          </TabsTrigger>
          <TabsTrigger value="email-templates" className="flex items-center">
            <Mail className="h-4 w-4 mr-2" />
            Email Templates
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-senw-gold/5 border-senw-gold/20">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <div className="h-12 w-12 rounded-full bg-senw-gold/10 flex items-center justify-center mb-2">
                      <CheckCircle className="h-6 w-6 text-senw-gold" />
                    </div>
                    <h3 className="text-xl font-bold">{workflows.filter((w) => w.status === "Active").length}</h3>
                    <p className="text-sm text-gray-500">Active Workflows</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                      <Pause className="h-6 w-6 text-gray-500" />
                    </div>
                    <h3 className="text-xl font-bold">{workflows.filter((w) => w.status === "Paused").length}</h3>
                    <p className="text-sm text-gray-500">Paused Workflows</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                      <Play className="h-6 w-6 text-gray-500" />
                    </div>
                    <h3 className="text-xl font-bold">{workflows.reduce((acc, w) => acc + w.runs, 0)}</h3>
                    <p className="text-sm text-gray-500">Total Executions</p>
                  </CardContent>
                </Card>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Workflow Name</TableHead>
                      <TableHead>Trigger</TableHead>
                      <TableHead>Actions</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Run</TableHead>
                      <TableHead className="text-right">Options</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workflows.map((workflow) => (
                      <TableRow key={workflow.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div>{workflow.name}</div>
                            <div className="text-xs text-muted-foreground">{workflow.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>{workflow.trigger}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {workflow.actions.map((action, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100"
                              >
                                {action}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              workflow.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {workflow.status}
                          </span>
                        </TableCell>
                        <TableCell>{workflow.lastRun}</TableCell>
                        <TableCell className="text-right">
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
                                {workflow.status === "Active" ? (
                                  <>
                                    <Pause className="mr-2 h-4 w-4" />
                                    Pause
                                  </>
                                ) : (
                                  <>
                                    <Play className="mr-2 h-4 w-4" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email-templates" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-muted-foreground">Showing {emailTemplates.length} email templates</div>
            <Button className="bg-senw-gold hover:bg-senw-gold/90 text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </Button>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Template Name</TableHead>
                      <TableHead>Subject Line</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Last Edited</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {emailTemplates.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell className="font-medium">{template.name}</TableCell>
                        <TableCell>{template.subject}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100">
                            {template.category}
                          </span>
                        </TableCell>
                        <TableCell>{new Date(template.lastEdited).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
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
                                <Mail className="mr-2 h-4 w-4" />
                                Test Send
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Workflow</TableHead>
                      <TableHead>Trigger</TableHead>
                      <TableHead>Actions</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead className="text-right">Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {automationLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.workflow}</TableCell>
                        <TableCell>{log.trigger}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {log.actions.map((action, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100"
                              >
                                {action}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              log.status === "Success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {log.status === "Success" ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <AlertCircle className="h-3 w-3 mr-1" />
                            )}
                            {log.status}
                          </span>
                        </TableCell>
                        <TableCell>{log.timestamp}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Start Guide */}
      {activeTab === "workflows" && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Start Guide</CardTitle>
            <CardDescription>Learn how to create effective automation workflows</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col items-center text-center p-4">
                <div className="h-12 w-12 rounded-full bg-senw-gold/10 flex items-center justify-center mb-2">
                  <Bell className="h-6 w-6 text-senw-gold" />
                </div>
                <h3 className="font-medium mb-1">Choose a Trigger</h3>
                <p className="text-sm text-gray-500">
                  Select what event will start your workflow, such as a new lead or property update
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <div className="h-12 w-12 rounded-full bg-senw-gold/10 flex items-center justify-center mb-2">
                  <FileText className="h-6 w-6 text-senw-gold" />
                </div>
                <h3 className="font-medium mb-1">Define Actions</h3>
                <p className="text-sm text-gray-500">
                  Set up what should happen when the trigger occurs, like sending emails or creating tasks
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <div className="h-12 w-12 rounded-full bg-senw-gold/10 flex items-center justify-center mb-2">
                  <Play className="h-6 w-6 text-senw-gold" />
                </div>
                <h3 className="font-medium mb-1">Activate & Monitor</h3>
                <p className="text-sm text-gray-500">
                  Turn on your workflow and track its performance in the logs section
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
