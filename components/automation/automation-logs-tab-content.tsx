import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";

interface AutomationLogsTabContentProps {
  automationLogs: any[]; // This prop will now contain communication logs
  loading: boolean;
  error: string | null;
}

export function AutomationLogsTabContent({ automationLogs, loading, error }: AutomationLogsTabContentProps) {
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
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Timestamp</TableHead>
                <TableHead>Type</TableHead>
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
                  <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                  <TableCell>{log.communication_type}</TableCell>
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