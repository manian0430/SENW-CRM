import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: string
    direction: "up" | "down" | "neutral"
    label?: string
  }
}

export function StatCard({ title, value, icon: Icon, trend }: StatCardProps) {
  const getTrendColor = (direction: "up" | "down" | "neutral") => {
    switch (direction) {
      case "up":
        return "text-green-500"
      case "down":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <Card className="stat-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-senw-gold/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-senw-gold" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <div className="flex items-center mt-1">
            <span className={`text-xs ${getTrendColor(trend.direction)}`}>{trend.value}</span>
            {trend.direction === "up" ? (
              <ArrowUpRight className="h-3 w-3 text-green-500 ml-1" />
            ) : trend.direction === "down" ? (
              <ArrowDownRight className="h-3 w-3 text-red-500 ml-1" />
            ) : null}
            {trend.label && <span className="text-xs text-gray-500 ml-1">{trend.label}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
