import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageSquare, Calendar, BarChart2 } from 'lucide-react'
import Link from 'next/link'

export default function SocialPage() {
  return (
    <div className="grid gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Social Media Management</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Link href="/social/inbox">
          <Card className="p-6 hover:bg-accent transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <MessageSquare className="h-6 w-6" />
              <div>
                <h3 className="font-semibold">Inbox</h3>
                <p className="text-sm text-muted-foreground">Manage messages and mentions</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/social/publishing">
          <Card className="p-6 hover:bg-accent transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <Calendar className="h-6 w-6" />
              <div>
                <h3 className="font-semibold">Publishing</h3>
                <p className="text-sm text-muted-foreground">Schedule and manage posts</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/social/monitoring">
          <Card className="p-6 hover:bg-accent transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <BarChart2 className="h-6 w-6" />
              <div>
                <h3 className="font-semibold">Monitoring</h3>
                <p className="text-sm text-muted-foreground">Track social media activity</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  )
} 