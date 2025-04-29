import { Card } from '@/components/ui/card'

export default function SocialPage() {
  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Total Interactions</h3>
          <p className="text-3xl font-bold">0</p>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-2">Pending Responses</h3>
          <p className="text-3xl font-bold">0</p>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-2">Scheduled Posts</h3>
          <p className="text-3xl font-bold">0</p>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-2">Active Monitors</h3>
          <p className="text-3xl font-bold">0</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Activity Overview</h3>
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          Activity chart will be displayed here
        </div>
      </Card>
    </div>
  )
} 