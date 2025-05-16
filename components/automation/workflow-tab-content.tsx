import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CheckCircle, Pause, Play, Edit, Trash2, MoreHorizontal, Loader2 } from "lucide-react";

interface WorkflowTabContentProps {
  workflows: any[];
  loading: boolean;
  error: string | null;
}

export function WorkflowTabContent({ workflows, loading, error }: WorkflowTabContentProps) {
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

  if (workflows.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          No workflows found. Create a new workflow to get started.
        </CardContent>
      </Card>
    );
  }

  return (
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
          <Card className="bg-senw-gold/5 border-senw-gold/20">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                <Pause className="h-6 w-6 text-gray-500" />
              </div>
              <h3 className="text-xl font-bold">{workflows.filter((w) => w.status === "Paused").length}</h3>
              <p className="text-sm text-gray-500">Paused Workflows</p>
            </CardContent>
          </Card>
          <Card className="bg-senw-gold/5 border-senw-gold/20">
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
                      {workflow.actions.map((action: string, i: number) => (
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
  );
}