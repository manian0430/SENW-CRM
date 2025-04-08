import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Home, FileCheck, BarChart, Calendar, FileText, DollarSign } from "lucide-react"
import { StatCard } from "@/components/ui/stat-card"

export default function Dashboard() {
  // Placeholder for API calls
  // Fetch dashboard stats from /api/dashboard/stats
  // Fetch recent activity from /api/dashboard/activity

  const stats = [
    {
      title: "Total Leads",
      value: "120",
      icon: Users,
      change: "+12%",
      trend: "up",
    },
    {
      title: "Active Listings",
      value: "45",
      icon: Home,
      change: "+5%",
      trend: "up",
    },
    {
      title: "Pending Deals",
      value: "8",
      icon: FileCheck,
      change: "-2%",
      trend: "down",
    },
    {
      title: "Conversion Rate",
      value: "15%",
      icon: BarChart,
      change: "+3%",
      trend: "up",
    },
  ]

  const recentActivity = [
    { id: 1, type: "lead", message: "New lead added: John Doe", time: "10 minutes ago" },
    { id: 2, type: "property", message: "Property listed: 123 Main St", time: "1 hour ago" },
    { id: 3, type: "deal", message: "Offer accepted: 456 Oak Ave", time: "3 hours ago" },
    { id: 4, type: "document", message: "Document signed: Purchase Agreement for 789 Pine Rd", time: "Yesterday" },
    { id: 5, type: "calendar", message: "New showing scheduled: 321 Elm St", time: "Yesterday" },
  ]

  const upcomingAppointments = [
    { id: 1, title: "Property Showing", location: "123 Main St", time: "Today, 2:00 PM", client: "John Smith" },
    { id: 2, title: "Client Meeting", location: "Office", time: "Tomorrow, 10:00 AM", client: "Sarah Johnson" },
    { id: 3, title: "Open House", location: "456 Oak Ave", time: "Saturday, 1:00 PM", client: "Multiple" },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "lead":
        return <Users className="h-4 w-4" />
      case "property":
        return <Home className="h-4 w-4" />
      case "deal":
        return <FileCheck className="h-4 w-4" />
      case "document":
        return <FileText className="h-4 w-4" />
      case "calendar":
        return <Calendar className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={{
              value: stat.change,
              direction: stat.trend as "up" | "down",
              label: "from last month",
            }}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="dashboard-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                >
                  <div className="h-8 w-8 rounded-full bg-senw-gold/10 text-senw-gold flex items-center justify-center mr-3">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div>
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                >
                  <div className="h-8 w-8 rounded-full bg-senw-gold/10 text-senw-gold flex items-center justify-center mr-3">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{appointment.title}</p>
                    <p className="text-xs text-gray-500">{appointment.time}</p>
                    <div className="flex items-center mt-1">
                      <Home className="h-3 w-3 text-gray-400 mr-1" />
                      <p className="text-xs text-gray-500">{appointment.location}</p>
                    </div>
                    <div className="flex items-center mt-1">
                      <Users className="h-3 w-3 text-gray-400 mr-1" />
                      <p className="text-xs text-gray-500">{appointment.client}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-4 rounded-lg border border-gray-200">
              <DollarSign className="h-8 w-8 text-senw-gold mb-2" />
              <h3 className="text-lg font-semibold">$1.2M</h3>
              <p className="text-sm text-gray-500">Total Sales Volume</p>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg border border-gray-200">
              <Home className="h-8 w-8 text-senw-gold mb-2" />
              <h3 className="text-lg font-semibold">12</h3>
              <p className="text-sm text-gray-500">Properties Sold</p>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg border border-gray-200">
              <Users className="h-8 w-8 text-senw-gold mb-2" />
              <h3 className="text-lg font-semibold">85%</h3>
              <p className="text-sm text-gray-500">Client Satisfaction</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
