import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function QuickStartGuide() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Start Guide</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          Welcome to Task Automation! Here's how to get started:
        </p>
        <ol className="list-decimal list-inside space-y-2">
          <li>
            <strong>Define your workflow:</strong> Identify a repetitive task you want to automate (e.g., sending a follow-up email after a showing).
          </li>
          <li>
            <strong>Create a new workflow:</strong> Click the "Create Workflow" button above.
          </li>
          <li>
            <strong>Set a trigger:</strong> Choose what event will start your workflow (e.g., "Showing Scheduled").
          </li>
          <li>
            <strong>Add actions:</strong> Define the steps the workflow will take (e.g., "Send Email" using a specific template).
          </li>
          <li>
            <strong>Activate:</strong> Turn on your workflow, and it will start automating the task whenever the trigger occurs.
          </li>
        </ol>
        <p>
          Explore the "Email Templates" tab to create reusable email content for your workflows. The "Logs" tab will show you a history of all automation executions.
        </p>
      </CardContent>
    </Card>
  );
}