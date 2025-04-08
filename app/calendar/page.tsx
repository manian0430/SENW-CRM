"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Home, Users } from "lucide-react"

export default function CalendarPage() {
  const [open, setOpen] = useState(false)

  // Placeholder for API calls
  // Fetch appointments from /api/calendar
  // Sync with Google Calendar via /api/integrations/google-calendar

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const hours = Array.from({ length: 12 }, (_, i) => i + 8) // 8 AM to 7 PM

  const appointments = [
    {
      id: 1,
      title: "Showing: 123 Main St",
      day: "Monday",
      time: "10:00 AM",
      duration: 60,
      type: "Showing",
      attendees: ["John Doe", "Sarah Johnson"],
    },
    {
      id: 2,
      title: "Client Meeting: Jane Smith",
      day: "Tuesday",
      time: "2:00 PM",
      duration: 90,
      type: "Meeting",
      attendees: ["Jane Smith", "Mike Wilson"],
    },
    {
      id: 3,
      title: "Showing: 456 Oak Ave",
      day: "Wednesday",
      time: "11:30 AM",
      duration: 60,
      type: "Showing",
      attendees: ["Robert Brown", "David Miller"],
    },
    {
      id: 4,
      title: "Open House: 789 Pine Rd",
      day: "Saturday",
      time: "1:00 PM",
      duration: 180,
      type: "Open House",
      attendees: ["Sarah Johnson"],
    },
    {
      id: 5,
      title: "Closing: 321 Elm St",
      day: "Friday",
      time: "9:00 AM",
      duration: 120,
      type: "Closing",
      attendees: ["Emily Davis", "Mike Wilson", "David Miller"],
    },
  ]

  const getAppointmentPosition = (time: string) => {
    const [hourStr, minuteStr] = time.split(":")
    const isPM = time.includes("PM") && hourStr !== "12"
    const hour = Number.parseInt(hourStr) + (isPM ? 12 : 0)
    const minute = Number.parseInt(minuteStr)

    // Calculate position relative to 8 AM (our first hour)
    const hourPosition = hour - 8
    const minutePosition = minute / 60

    return hourPosition + minutePosition
  }

  const getAppointmentHeight = (duration: number) => {
    // Convert duration in minutes to height units (1 hour = 1 unit)
    return duration / 60
  }

  const getAppointmentColor = (type: string) => {
    switch (type) {
      case "Showing":
        return "bg-blue-100 border-blue-300 text-blue-800"
      case "Meeting":
        return "bg-purple-100 border-purple-300 text-purple-800"
      case "Open House":
        return "bg-green-100 border-green-300 text-green-800"
      case "Closing":
        return "bg-red-100 border-red-300 text-red-800"
      default:
        return "bg-gray-100 border-gray-300 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h1 className="text-2xl font-bold">Appointment Scheduler</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Appointment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule Appointment</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="title">Title</label>
                <Input id="title" placeholder="Appointment title" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="date">Date</label>
                  <Input id="date" type="date" />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="time">Time</label>
                  <Input id="time" type="time" />
                </div>
              </div>
              <div className="grid gap-2">
                <label htmlFor="duration">Duration</label>
                <Select>
                  <SelectTrigger id="duration">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="180">3 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="purpose">Purpose</label>
                <Select>
                  <SelectTrigger id="purpose">
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="showing">Showing</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="open-house">Open House</SelectItem>
                    <SelectItem value="closing">Closing</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="attendees">Attendees</label>
                <Input id="attendees" placeholder="Enter names separated by commas" />
              </div>
              <div className="grid gap-2">
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  placeholder="Additional information"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setOpen(false)}>Save Appointment</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Calendar View */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-8 border rounded-md overflow-hidden">
            {/* Time column */}
            <div className="border-r">
              <div className="h-12 border-b flex items-center justify-center font-medium bg-gray-50"></div>
              {hours.map((hour) => (
                <div key={hour} className="h-16 border-b flex items-center justify-center text-sm text-gray-500">
                  {hour > 12 ? hour - 12 : hour} {hour >= 12 ? "PM" : "AM"}
                </div>
              ))}
            </div>

            {/* Days columns */}
            {days.map((day) => (
              <div key={day} className="border-r last:border-r-0">
                <div className="h-12 border-b flex items-center justify-center font-medium bg-gray-50">{day}</div>
                <div className="h-[768px] relative">
                  {/* Hour markers */}
                  {hours.map((hour) => (
                    <div key={hour} className="h-16 border-b"></div>
                  ))}

                  {/* Appointments */}
                  {appointments
                    .filter((apt) => apt.day === day)
                    .map((apt) => {
                      const top = getAppointmentPosition(apt.time) * 64 // 64px per hour
                      const height = getAppointmentHeight(apt.duration) * 64
                      const colorClass = getAppointmentColor(apt.type)

                      return (
                        <div
                          key={apt.id}
                          className={`absolute left-1 right-1 rounded-md border p-2 overflow-hidden ${colorClass}`}
                          style={{ top: `${top}px`, height: `${height}px` }}
                        >
                          <div className="text-xs font-medium truncate">{apt.title}</div>
                          <div className="flex items-center text-xs mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            {apt.time}
                          </div>
                          {apt.type === "Showing" && (
                            <div className="flex items-center text-xs mt-1">
                              <Home className="h-3 w-3 mr-1" />
                              {apt.title.split(": ")[1]}
                            </div>
                          )}
                          {apt.attendees.length > 0 && (
                            <div className="flex items-center text-xs mt-1">
                              <Users className="h-3 w-3 mr-1" />
                              {apt.attendees.length} attendee{apt.attendees.length !== 1 ? "s" : ""}
                            </div>
                          )}
                        </div>
                      )
                    })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
