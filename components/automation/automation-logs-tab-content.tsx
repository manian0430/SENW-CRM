import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface AutomationLogsTabContentProps {
  automationLogs: any[]; // This prop will now contain communication logs
  loading: boolean;
  error: string | null;
}

export function AutomationLogsTabContent({ automationLogs, loading, error }: AutomationLogsTabContentProps) {
  const [selectedLogIds, setSelectedLogIds] = useState<string[]>([]);
  const [isAssigning, setIsAssigning] = useState(false);
  const { toast } = useToast();

  const handleAssign = async () => {
    setIsAssigning(true);
    try {
      const response = await fetch('/api/leads/assign-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ log_ids: selectedLogIds }),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: result.message,
        });
        setSelectedLogIds([]); // Clear selection after successful assignment
      } else {
        toast({
          title: "Error",
          description: result.error || "An unknown error occurred.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign leads. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAssigning(false);
    }
  };

  const handleSelectAll = (checked: boolean | "indeterminate") => {
    if (checked === true) {
      setSelectedLogIds(automationLogs.map((log) => log.id));
    } else {
      setSelectedLogIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedLogIds((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
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

  if (automationLogs.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          No communication logs found.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-end mb-4">
            <Button onClick={handleAssign} disabled={selectedLogIds.length === 0 || isAssigning}>
                {isAssigning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Assign Selected to Agent
            </Button>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>
                  <Checkbox
                    onCheckedChange={handleSelectAll}
                    checked={
                        automationLogs.length > 0 && selectedLogIds.length === automationLogs.length
                          ? true
                          : selectedLogIds.length > 0
                          ? "indeterminate"
                          : false
                      }
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Subject/Body</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Gemini Analysis</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {automationLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedLogIds.includes(log.id)}
                      onCheckedChange={() => handleSelectRow(log.id)}
                      aria-label="Select row"
                    />
                  </TableCell>
                  <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                  <TableCell>{log.communication_type}</TableCell>
                  <TableCell>{log.property?.address || "N/A"}</TableCell>
                  <TableCell>{log.from_address}</TableCell>
                  <TableCell>{log.to_address}</TableCell>
                  <TableCell>
                    {log.communication_type === 'email' ? 
                      <><strong>Subject:</strong> {log.subject}<br/><strong>Body:</strong> {log.body?.substring(0, 100)}...</> : 
                      log.body?.substring(0, 100)}...
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        log.status === "sent" || log.status === "initiated" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {log.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {log.gemini_analysis || 'No analysis available'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}