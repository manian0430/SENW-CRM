"use client"

import { useState } from "react"
import { BarChart, LineChart, PieChart, TrendingUp, Users, Home, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import {
  Bar,
  Line,
  Pie,
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  PieChart as RechartsPieChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30")

  // Placeholder for API calls
  // Fetch analytics data from /api/analytics

  // Sample data for charts
  const leadData = [
    { name: "Jan", new: 65, converted: 28 },
    { name: "Feb", new: 59, converted: 24 },
    { name: "Mar", new: 80, converted: 35 },
    { name: "Apr", new: 81, converted: 32 },
    { name: "May", new: 56, converted: 20 },
    { name: "Jun", new: 55, converted: 25 },
    { name: "Jul", new: 40, converted: 18 },
  ]

  const propertyData = [
    { name: "Jan", listed: 12, sold: 8 },
    { name: "Feb", listed: 19, sold: 10 },
    { name: "Mar", listed: 15, sold: 12 },
    { name: "Apr", listed: 21, sold: 15 },
    { name: "May", listed: 18, sold: 14 },
    { name: "Jun", listed: 25, sold: 18 },
    { name: "Jul", listed: 22, sold: 16 },
  ]

  const revenueData = [
    { name: "Jan", revenue: 45000 },
    { name: "Feb", revenue: 52000 },
    { name: "Mar", revenue: 48000 },
    { name: "Apr", revenue: 61000 },
    { name: "May", revenue: 55000 },
    { name: "Jun", revenue: 67000 },
    { name: "Jul", revenue: 72000 },
  ]

  const leadSourceData = [
    { name: "Website", value: 45 },
    { name: "Referral", value: 28 },
    { name: "Social Media", value: 18 },
    { name: "Other", value: 9 },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <PageHeader title="Analytics Dashboard" description="Track your business performance" />
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Leads"
          value="120"
          icon={Users}
          trend={{ value: "+12%", direction: "up", label: "from last month" }}
        />
        <StatCard
          title="Active Listings"
          value="45"
          icon={Home}
          trend={{ value: "+5%", direction: "up", label: "from last month" }}
        />
        <StatCard
          title="Conversion Rate"
          value="15%"
          icon={TrendingUp}
          trend={{ value: "+3%", direction: "up", label: "from last month" }}
        />
        <StatCard
          title="Revenue"
          value="$45,231"
          icon={DollarSign}
          trend={{ value: "+20.1%", direction: "up", label: "from last month" }}
        />
      </div>

      {/* Charts */}
      <Tabs defaultValue="leads" className="space-y-4">
        <TabsList>
          <TabsTrigger value="leads" className="flex items-center">
            <BarChart className="h-4 w-4 mr-2" />
            Leads
          </TabsTrigger>
          <TabsTrigger value="properties" className="flex items-center">
            <LineChart className="h-4 w-4 mr-2" />
            Properties
          </TabsTrigger>
          <TabsTrigger value="revenue" className="flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            Revenue
          </TabsTrigger>
          <TabsTrigger value="sources" className="flex items-center">
            <PieChart className="h-4 w-4 mr-2" />
            Lead Sources
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lead Generation & Conversion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={leadData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="new" fill="#1E3A8A" name="New Leads" />
                    <Bar dataKey="converted" fill="#38BDF8" name="Converted Leads" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="properties" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Property Listings & Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={propertyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="listed" stroke="#1E3A8A" name="Properties Listed" />
                    <Line type="monotone" stroke="#1E3A8A" name="Properties Listed" />
                    <Line type="monotone" dataKey="sold" stroke="#38BDF8" name="Properties Sold" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#1E3A8A" name="Revenue" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lead Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={leadSourceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {leadSourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
