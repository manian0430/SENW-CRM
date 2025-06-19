"use client"

import { useState, useEffect, useRef } from "react"
import { PageHeader } from "@/components/ui/page-header"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog" // Added Dialog
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { createBrowserClient } from '@supabase/ssr'

import { PropertiesReceivedCard } from "@/components/automation/properties-received-card"
import { AutomationTabs } from "@/components/automation/automation-tabs"
import { WorkflowTabContent } from "@/components/automation/workflow-tab-content"
import { EmailTemplatesTabContent } from "@/components/automation/email-templates-tab-content"
import { AutomationLogsTabContent } from "@/components/automation/automation-logs-tab-content"
import { QuickStartGuide } from "@/components/automation/quick-start-guide"
import { MarketingPropertyList } from "@/components/automation/marketing-property-list" // Added import
import { PhoneSmsPropertyList } from "@/components/automation/phone-sms-property-list" // Added import
import { EmailPropertyList } from "@/components/automation/email-property-list"

import { PropertyAutomationOptions } from "@/components/automation/property-automation-options"; // Added import

export default function AutomationPage() {
  const [activeTab, setActiveTab] = useState("workflows")

  const searchParams = useSearchParams()
  const propertyIds = searchParams.get('propertyIds')

  const [workflows, setWorkflows] = useState<any[]>([])
  const [emailTemplates, setEmailTemplates] = useState<any[]>([])
  const [communicationLogs, setCommunicationLogs] = useState<any[]>([]) // Renamed from automationLogs
  const [selectedProperties, setSelectedProperties] = useState<any[]>([]) // Added state for selected properties
  const [selectedPropertyForOptions, setSelectedPropertyForOptions] = useState<any | null>(null); // New state for the property whose options are displayed
  const [appliedActionTypes, setAppliedActionTypes] = useState<string[]>([]); // New state for applied action types
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailProperty, setEmailProperty] = useState<any | null>(null);
  const [emailRecipients, setEmailRecipients] = useState("");
  const [emailTemplateId, setEmailTemplateId] = useState<string | null>(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [emailAttachments, setEmailAttachments] = useState<File[]>([]);
  const [sendingEmail, setSendingEmail] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const refreshCommunicationLogs = async () => {
    setLoading(true);
    console.log('Attempting to refresh communication logs...');
    const { data: updatedCommunicationLogs, error: logsError } = await supabase
      .from('communications_log')
      .select('*')
      .order('timestamp', { ascending: false });
    if (logsError) {
      console.error('Error refetching communication logs:', logsError);
      setError(logsError.message);
      console.log('Error details from Supabase logs fetch:', logsError);
    } else {
      console.log('Successfully fetched communication logs:', updatedCommunicationLogs);
      setCommunicationLogs(updatedCommunicationLogs || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Fetch workflows
        const { data: workflowsData, error: workflowsError } = await supabase
          .from('workflows')
          .select('*')
        if (workflowsError) throw workflowsError
        setWorkflows(workflowsData || [])

        // Fetch email templates
        const { data: emailTemplatesData, error: emailTemplatesError } = await supabase
          .from('email_templates')
          .select('*')
        if (emailTemplatesError) throw emailTemplatesError
        setEmailTemplates(emailTemplatesData || [])

        // Fetch communication logs (instead of automation logs)
        await refreshCommunicationLogs(); // Use the new refresh function

        // Fetch selected properties if propertyIds are present
        if (propertyIds) {
          const ids = propertyIds.split(','); // Removed parseInt
          const { data: propertiesData, error: propertiesError } = await supabase
            .from('properties') // Assuming 'properties' is your table name
            .select('*')
            .in('id', ids); // Assuming 'id' is the primary key column
          if (propertiesError) throw propertiesError;
          setSelectedProperties(propertiesData || []);
        } else {
          setSelectedProperties([]); // Clear selected properties if propertyIds are not present
        }

      } catch (err: any) {
        setError(err.message)
      } finally {
        // setLoading(false); // setLoading is now handled by refreshCommunicationLogs
      }
    }

    fetchData()
  }, [propertyIds]) // Added propertyIds to dependency array

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

  // Helper to handle property click in Email tab
  const handleEmailPropertyClick = (property: any) => {
    setEmailProperty(property);
    setEmailDialogOpen(true);
    setEmailRecipients("");
    setEmailTemplateId(null);
    setEmailSubject("");
    setEmailBody("");
    setEmailAttachments([]);
  };

  const handleTemplateChange = (templateId: string) => {
    setEmailTemplateId(templateId);
    const selectedTemplate = emailTemplates.find(template => template.id === templateId);
    if (selectedTemplate) {
      setEmailSubject(selectedTemplate.subject);
      setEmailBody(selectedTemplate.body);
    } else {
      setEmailSubject("");
      setEmailBody("");
    }
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setEmailAttachments(Array.from(e.target.files));
    }
  };

  const handleSendEmail = async () => {
    if (!emailRecipients || (!emailBody && emailAttachments.length === 0)) {
      alert("Please fill in recipients and provide an email body or attachment.");
      return;
    }

    setSendingEmail(true);
    // Removed formData approach as the backend expects a JSON body.
    // Attachments will be sent as an array of objects with filenames.
    try {
      const response = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: emailRecipients,
          subject: emailSubject,
          html: emailBody,
          // Simplified attachments for now. For actual file content, 
          // you'd need to base64 encode them or implement a separate file upload mechanism.
          attachments: emailAttachments.map(file => ({ filename: file.name })) 
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Email sent successfully!');
        setEmailDialogOpen(false);

        // Removed Gemini analysis alert, as it's now logged to DB and displayed in Logs tab

        // Refetch communication logs after sending email to update the display
        await refreshCommunicationLogs();

      } else {
        alert(`Failed to send email: ${data && data.error ? data.error : 'Unknown error'}`);
      }
    } catch (err) {
      alert("Failed to send email");
    } finally {
      setSendingEmail(false);
    }
  };

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

      <PropertiesReceivedCard
        propertyIds={propertyIds}
        onApplyActions={(actionTypes) => {
          setAppliedActionTypes(actionTypes); // Set applied action types
          if (actionTypes.length > 0) {
            setActiveTab(actionTypes[0]); // Set active tab to the first selected action type
          }
        }}
      />

      <AutomationTabs activeTab={activeTab} setActiveTab={setActiveTab}>
        <TabsContent value="workflows" className="space-y-4">
          <WorkflowTabContent workflows={workflows} loading={loading} error={error} />
        </TabsContent>

        {/* Placeholder content for Marketing tab */}
        <TabsContent value="marketing" className="space-y-4">
          {appliedActionTypes.includes("marketing") && ( // Conditionally render based on appliedActionTypes
            <MarketingPropertyList
              properties={selectedProperties}
              loading={loading}
              error={error}
              onPropertyClick={async (property) => {
                setLoading(true); // Optional: show loading state while fetching
                const { data, error } = await supabase
                  .from('properties')
                  .select('*')
                  .eq('id', property.id)
                  .single(); // Fetch a single property by ID

                if (error) {
                  console.error('Error fetching single property:', error);
                  setError('Failed to fetch property details.'); // Optional: set error state
                } else {
                  setSelectedPropertyForOptions(data); // Update state with fresh data
                }
                setLoading(false); // Optional: hide loading state
              }}
            />
          )}
        </TabsContent>

        {/* Placeholder content for Phone/SMS tab */}
        <TabsContent value="phone-sms" className="space-y-4">
           {appliedActionTypes.includes("phone-sms") && ( // Conditionally render based on appliedActionTypes
            <PhoneSmsPropertyList
              properties={selectedProperties}
              loading={loading}
              error={error}
              onPropertyClick={async (property) => {
                setLoading(true); // Optional: show loading state while fetching
                const { data, error } = await supabase
                  .from('properties')
                  .select('*')
                  .eq('id', property.id)
                  .single(); // Fetch a single property by ID

                if (error) {
                  console.error('Error fetching single property:', error);
                  setError('Failed to fetch property details.'); // Optional: set error state
                } else {
                  setSelectedPropertyForOptions(data); // Update state with fresh data
                }
                setLoading(false); // Optional: hide loading state
              }}
            />
          )}
        </TabsContent>

        <TabsContent value="email-templates" className="space-y-4">
          <EmailTemplatesTabContent
            emailTemplates={emailTemplates}
            loading={loading}
            error={error}
            selectedProperties={selectedProperties}
            onPropertyClick={handleEmailPropertyClick}
          />
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <AutomationLogsTabContent automationLogs={communicationLogs} loading={loading} error={error} />
        </TabsContent>
      </AutomationTabs>

      {selectedPropertyForOptions && (
        <Dialog open={!!selectedPropertyForOptions} onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedPropertyForOptions(null); // Clear selected property when modal is closed
          }
        }}>
          <DialogContent className="sm:max-w-[600px]"> {/* Adjust max-width as needed */}
            <DialogHeader>
              <DialogTitle>Automation Options for {selectedPropertyForOptions?.property_address}</DialogTitle>
            </DialogHeader>
            <PropertyAutomationOptions
              property={selectedPropertyForOptions}
              actionType={activeTab as "marketing" | "phone-sms" | "email"} // Pass activeTab as actionType
              onCommunicationSent={refreshCommunicationLogs} // Pass the refresh function
            />
            {/* Optional: Add a footer with action buttons if needed */}
            {/* <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedPropertyForOptions(null)}>Close</Button>
            </DialogFooter> */}
          </DialogContent>
        </Dialog>
      )}

      {activeTab === "workflows" && (
        <QuickStartGuide />
      )}

      {/* Email Send Dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Send Email to {emailProperty?.owner_1_name || 'Property Owner'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email-to">To</Label>
              <Input
                id="email-to"
                placeholder="Recipient email address (e.g., owner@example.com)"
                value={emailRecipients}
                onChange={(e) => setEmailRecipients(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email-template">Select Template</Label>
              <Select onValueChange={handleTemplateChange} value={emailTemplateId || ''}>
                <SelectTrigger id="email-template">
                  <SelectValue placeholder="Choose an email template" />
                </SelectTrigger>
                <SelectContent>
                  {emailTemplates.length === 0 ? (
                    <SelectItem value="no-templates" disabled>
                      No templates available
                    </SelectItem>
                  ) : (
                    emailTemplates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email-subject">Subject</Label>
              <Input
                id="email-subject"
                placeholder="Email Subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email-body">Body</Label>
              <Textarea
                id="email-body"
                placeholder="Email Body"
                className="min-h-[150px]"
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email-attachments">Attachments</Label>
              <Input
                id="email-attachments"
                type="file"
                multiple
                onChange={handleAttachmentChange}
                ref={fileInputRef}
              />
              {emailAttachments.length > 0 && (
                <div className="text-sm text-gray-500">
                  Attached: {emailAttachments.map(file => file.name).join(", ")}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmailDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSendEmail} disabled={sendingEmail}>
              {sendingEmail ? "Sending..." : "Send Email"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
