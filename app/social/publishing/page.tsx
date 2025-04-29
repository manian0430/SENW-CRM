import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'

export default function PublishingPage() {
  return (
    <div className="grid gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Content Publishing</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Post
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Content Calendar</h3>
          <div className="h-[400px] flex items-center justify-center text-muted-foreground">
            Calendar view will be displayed here
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Scheduled Posts</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Platform</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>X</TableCell>
                <TableCell>@brand Excited to announce our new CRM features! 🚀</TableCell>
                <TableCell>Scheduled</TableCell>
                <TableCell>2024-06-10 09:00</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  )
} 