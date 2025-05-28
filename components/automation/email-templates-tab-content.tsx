import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Edit, Trash2, Loader2 } from "lucide-react";
import { EmailPropertyList } from "@/components/automation/email-property-list";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface EmailTemplatesTabContentProps {
  emailTemplates: any[];
  loading: boolean;
  error: string | null;
  selectedProperties: any[];
  onPropertyClick: (property: any) => void;
}

export function EmailTemplatesTabContent({ emailTemplates, loading, error, selectedProperties, onPropertyClick }: EmailTemplatesTabContentProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newBody, setNewBody] = useState("");
  const [saving, setSaving] = useState(false);

  const handleCreateTemplate = async () => {
    setSaving(true);
    await fetch("/api/email-templates/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newName,
        category: newCategory,
        subject: newSubject,
        body: newBody,
      }),
    });
    setSaving(false);
    setCreateDialogOpen(false);
    setNewName("");
    setNewCategory("");
    setNewSubject("");
    setNewBody("");
    // Optionally: trigger a refresh in parent
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-red-600">
          Error: {error}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <EmailPropertyList
        properties={selectedProperties}
        loading={false}
        error={null}
        onPropertyClick={onPropertyClick}
      />
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Email Template</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="template-name">Template Name</Label>
              <Input id="template-name" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Enter template name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="template-category">Category</Label>
              <Select value={newCategory} onValueChange={setNewCategory}>
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
            <div className="grid gap-2">
              <Label htmlFor="email-subject">Subject Line</Label>
              <Input id="email-subject" value={newSubject} onChange={e => setNewSubject(e.target.value)} placeholder="Enter email subject" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email-body">Email Body</Label>
              <Textarea id="email-body" value={newBody} onChange={e => setNewBody(e.target.value)} placeholder="Enter email body" className="min-h-[120px]" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)} disabled={saving}>Cancel</Button>
            <Button className="bg-senw-gold hover:bg-senw-gold/90 text-white" onClick={handleCreateTemplate} disabled={saving}>
              {saving ? "Saving..." : "Save Template"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {emailTemplates.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            No email templates found. Create a new template to get started.
            <div className="mt-4">
              <Button className="bg-senw-gold hover:bg-senw-gold/90 text-white" onClick={() => setCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Template
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <h4 className="font-semibold">Email Automation</h4>
              <p className="text-sm text-gray-500">
                Compose emails with brochure attachments and AI assistance. Integration options for Mailchimp, Klaviyo, and Office 365 can be added here.
              </p>
            </div>
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-muted-foreground">Showing {emailTemplates.length} email templates</div>
              <Button className="bg-senw-gold hover:bg-senw-gold/90 text-white" onClick={() => setCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Template
              </Button>
            </div>
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
                      <TableCell>{template.lastEdited ? new Date(template.lastEdited).toLocaleDateString() : 'N/A'}</TableCell>
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
      )}
    </div>
  );
}