import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function InboxPage() {
  return (
    <div className="grid gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Social Inbox</h2>
      </div>

      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Platform</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>From</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>X</TableCell>
              <TableCell>Mention</TableCell>
              <TableCell>user123</TableCell>
              <TableCell>Hi, I want to know more about your CRM!</TableCell>
              <TableCell>Unread</TableCell>
              <TableCell>2024-06-09</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </div>
  )
} 