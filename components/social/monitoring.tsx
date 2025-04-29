"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function Monitoring() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Mentions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            No mentions to display
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Keywords</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            No tracked keywords
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Competitors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            No competitors tracked
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 