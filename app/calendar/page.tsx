"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar as CalendarIcon, Clock, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { format, parseISO, getDay, parse } from 'date-fns' // Import date-fns functions
import { toast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"; // Import Textarea
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // For month view
import timeGridPlugin from '@fullcalendar/timegrid' // For week/day views
import interactionPlugin from '@fullcalendar/interaction' // For clicking/selecting dates/events
import type { EventInput, EventClickArg, DateSelectArg } from '@fullcalendar/core'
import { formatISO, addMinutes } from 'date-fns' // For date manipulation

// Interface matching Supabase table structure
interface Appointment {
  id: string; 
  created_at: string; 
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM:SS
  duration_minutes: number;
  purpose: string | null;
  attendees: string[] | null;
  notes: string | null;
}

// Form state interface
interface AppointmentFormState {
  id?: string; // Add ID for editing existing appointments
  title: string;
  date: string;
  time: string;
  duration_minutes: string; // Store as string from select
  purpose: string;
  attendees: string; // Comma-separated string
  notes: string;
}

const DEFAULT_FORM_STATE: AppointmentFormState = {
  title: "",
  date: "",
  time: "",
  duration_minutes: "60",
  purpose: "",
  attendees: "",
  notes: "",
};

export default function CalendarPage() {
  const [open, setOpen] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formState, setFormState] = useState<AppointmentFormState>(DEFAULT_FORM_STATE);
  const [isEditing, setIsEditing] = useState(false);

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]; // Sunday is 0
  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

  // Fetch appointments from Supabase
  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (error) {
        throw error;
      }
      setAppointments(data || []);
    } catch (err: any) {
      console.error('Error fetching appointments:', err);
      setError('Failed to load appointments.');
      toast({
        title: "Error",
        description: "Could not fetch appointments from database.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleInputChange = (
    field: keyof AppointmentFormState,
    value: string
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const resetFormAndClose = () => {
    setFormState(DEFAULT_FORM_STATE);
    setIsEditing(false);
    setOpen(false);
  };

  // --- Calendar Event Formatting --- 
  const mapAppointmentsToEvents = (appointments: Appointment[]): EventInput[] => {
    return appointments.map(apt => {
      const startDateTime = parseISO(`${apt.date}T${apt.time}`);
      const endDateTime = addMinutes(startDateTime, apt.duration_minutes);
      
      let backgroundColor = '#e5e7eb'; // Default gray
      let borderColor = '#d1d5db';
      switch (apt.purpose) {
        case "Showing": backgroundColor = '#dbeafe'; borderColor = '#93c5fd'; break; // Blue
        case "Meeting": backgroundColor = '#ede9fe'; borderColor = '#c4b5fd'; break; // Purple
        case "Open House": backgroundColor = '#dcfce7'; borderColor = '#86efac'; break; // Green
        case "Closing": backgroundColor = '#fee2e2'; borderColor = '#fca5a5'; break; // Red
      }

      return {
        id: apt.id,
        title: apt.title,
        start: formatISO(startDateTime),
        end: formatISO(endDateTime),
        extendedProps: { 
            purpose: apt.purpose,
            attendees: apt.attendees,
            notes: apt.notes
         }, // Store original data
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        textColor: '#1f2937' // Dark gray text for better contrast
      };
    });
  };

  // --- FullCalendar Event Handlers --- 
  const handleDateSelect = (selectInfo: DateSelectArg) => {
    // Pre-fill form based on selected date/time range
    const startDate = format(selectInfo.start, 'yyyy-MM-dd');
    const startTime = format(selectInfo.start, 'HH:mm');
    setFormState({
        ...DEFAULT_FORM_STATE,
        date: startDate,
        time: startTime, // Pre-fill start time
    });
    setIsEditing(false);
    setOpen(true);
    // selectInfo.view.calendar.unselect(); // Deselect the date range visually
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    // Populate form with existing event data for viewing/editing
    const clickedEvent = appointments.find(apt => apt.id === clickInfo.event.id);
    if (clickedEvent) {
      setFormState({
        id: clickedEvent.id,
        title: clickedEvent.title,
        date: clickedEvent.date,
        time: clickedEvent.time.substring(0, 5), // Extract HH:MM
        duration_minutes: clickedEvent.duration_minutes.toString(),
        purpose: clickedEvent.purpose || "",
        attendees: clickedEvent.attendees?.join(', ') || "",
        notes: clickedEvent.notes || "",
      });
      setIsEditing(true);
      setOpen(true);
    }
  };

  // --- CRUD Operations --- 
  const handleSaveAppointment = async () => {
    if (!formState.title || !formState.date || !formState.time || !formState.duration_minutes) {
      toast({ title: "Missing Information", description: "Title, Date, Time, and Duration are required.", variant: "destructive" });
      return;
    }

    try {
      const attendeesArray = formState.attendees.split(',').map(name => name.trim()).filter(name => name);
      const appointmentData = {
        title: formState.title,
        date: formState.date,
        time: formState.time,
        duration_minutes: parseInt(formState.duration_minutes, 10),
        purpose: formState.purpose || null,
        attendees: attendeesArray.length > 0 ? attendeesArray : null,
        notes: formState.notes || null,
      };

      let error: any;
      if (isEditing && formState.id) {
        // Update existing appointment
        const { error: updateError } = await supabase
          .from('appointments')
          .update(appointmentData)
          .eq('id', formState.id);
        error = updateError;
      } else {
        // Insert new appointment
        const { error: insertError } = await supabase
          .from('appointments')
          .insert([appointmentData]);
        error = insertError;
      }

      if (error) throw error;

      toast({ title: "Success", description: `Appointment ${isEditing ? 'updated' : 'scheduled'} successfully.` });
      resetFormAndClose();
      fetchAppointments(); // Refetch appointments

    } catch (err: any) {
      console.error("Error saving appointment:", err);
      toast({ title: "Error", description: `Failed to save appointment: ${err.message || 'Unknown error'}`, variant: "destructive" });
    }
  };

  const handleDeleteAppointment = async () => {
     if (!isEditing || !formState.id) return;

     try {
        const { error } = await supabase
            .from('appointments')
            .delete()
            .eq('id', formState.id);

        if (error) throw error;

        toast({ title: "Deleted", description: "Appointment removed successfully." });
        resetFormAndClose();
        fetchAppointments();
     } catch (err: any) {
         console.error("Error deleting appointment:", err);
         toast({ title: "Error", description: `Failed to delete appointment: ${err.message || 'Unknown error'}`, variant: "destructive" });
     }
  }

  // --- Display Logic Helpers (Adapted for Supabase data) ---

  // Get day name from date string (e.g., "2024-08-15")
  const getDayNameFromDate = (dateStr: string): string => {
    try {
       // getDay returns 0 for Sunday, 1 for Monday, etc.
      const dayIndex = getDay(parseISO(dateStr)); 
      return days[dayIndex];
    } catch (e) {
      console.error("Error parsing date for day name:", dateStr, e);
      return "Invalid Date";
    }
  };
  
  // Format time from HH:MM:SS to HH:MM AM/PM
  const formatDisplayTime = (timeStr: string): string => {
    try {
      // Parse HH:MM:SS and format to h:mm aa
      const parsedTime = parse(timeStr, 'HH:mm:ss', new Date());
      return format(parsedTime, 'h:mm aa');
    } catch(e) {
      console.error("Error formatting time:", timeStr, e);
      return "Invalid Time";
    }
  };

  // Calculate position based on time (HH:MM:SS)
  const getAppointmentPosition = (time: string): number => {
    try {
      const [hourStr, minuteStr] = time.split(":");
      const hour = Number.parseInt(hourStr);
      const minute = Number.parseInt(minuteStr);
      const hourPosition = hour - 8; // Relative to 8 AM start
      const minutePosition = minute / 60;
      return Math.max(0, hourPosition + minutePosition); // Ensure non-negative
    } catch (e) {
        console.error("Error calculating position:", time, e);
        return 0;
    }
  };

  const getAppointmentHeight = (duration: number): number => {
    return (duration / 60) || 1; // Default to 1 hour height if duration is invalid
  };

  const getAppointmentColor = (type: string | null): string => {
    switch (type) {
      case "Showing":
        return "bg-blue-100 border-blue-300 text-blue-800";
      case "Meeting":
        return "bg-purple-100 border-purple-300 text-purple-800";
      case "Open House":
        return "bg-green-100 border-green-300 text-green-800";
      case "Closing":
        return "bg-red-100 border-red-300 text-red-800";
      default:
        return "bg-gray-100 border-gray-300 text-gray-800";
    }
  };
  // --- End Display Logic Helpers ---

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Appointment Scheduler</h1>
        <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) resetFormAndClose(); else setOpen(true); }}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto" onClick={() => { setIsEditing(false); setFormState(DEFAULT_FORM_STATE); setOpen(true); }}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              Schedule Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Appointment' : 'Schedule Appointment'}</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto pr-6 -mr-6 px-2 sm:px-4">
            <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="title" className="text-sm font-medium">Title*</label>
                  <Input 
                    id="title" 
                    placeholder="Appointment title" 
                    value={formState.title} 
                    onChange={e => handleInputChange('title', e.target.value)}
                    className="focus-visible:ring-1 focus-visible:ring-offset-0" 
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="date" className="text-sm font-medium">Date*</label>
                    <Input 
                      id="date" 
                      type="date" 
                      value={formState.date} 
                      onChange={e => handleInputChange('date', e.target.value)}
                      className="focus-visible:ring-1 focus-visible:ring-offset-0" 
                    />
                </div>
                <div className="grid gap-2">
                    <label htmlFor="time" className="text-sm font-medium">Time*</label>
                    <Input 
                      id="time" 
                      type="time" 
                      value={formState.time} 
                      onChange={e => handleInputChange('time', e.target.value)}
                      className="focus-visible:ring-1 focus-visible:ring-offset-0" 
                    />
                </div>
              </div>
              <div className="grid gap-2">
                  <label htmlFor="duration" className="text-sm font-medium">Duration*</label>
                <Select value={formState.duration_minutes} onValueChange={value => handleInputChange('duration_minutes', value)}>
                    <SelectTrigger id="duration" className="focus-visible:ring-1 focus-visible:ring-offset-0">
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
                  <label htmlFor="purpose" className="text-sm font-medium">Purpose</label>
                <Select value={formState.purpose || ''} onValueChange={value => handleInputChange('purpose', value)}>
                    <SelectTrigger id="purpose" className="focus-visible:ring-1 focus-visible:ring-offset-0">
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Showing">Showing</SelectItem>
                    <SelectItem value="Meeting">Meeting</SelectItem>
                    <SelectItem value="Open House">Open House</SelectItem>
                    <SelectItem value="Closing">Closing</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                  <label htmlFor="attendees" className="text-sm font-medium">Attendees</label>
                  <Input 
                    id="attendees" 
                    placeholder="Enter names separated by commas" 
                    value={formState.attendees} 
                    onChange={e => handleInputChange('attendees', e.target.value)}
                    className="focus-visible:ring-1 focus-visible:ring-offset-0" 
                  />
              </div>
              <div className="grid gap-2">
                  <label htmlFor="notes" className="text-sm font-medium">Notes</label>
                  <Textarea 
                    id="notes" 
                    placeholder="Additional information" 
                    value={formState.notes} 
                    onChange={e => handleInputChange('notes', e.target.value)}
                    className="focus-visible:ring-1 focus-visible:ring-offset-0 resize-none" 
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="mt-4 pt-4 border-t">
              <div className="flex flex-col sm:flex-row gap-2 w-full">
               {isEditing && (
                  <Button variant="destructive" onClick={handleDeleteAppointment} disabled={loading} className="w-full sm:w-auto">
                  Delete
                </Button>
              )}
                <Button onClick={handleSaveAppointment} disabled={loading} className="w-full sm:w-auto">
                {isEditing ? 'Update Appointment' : 'Save Appointment'}
              </Button>
            </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* FullCalendar Component */} 
      <Card>
        <CardContent className="p-4">
          {loading && (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              <span className="ml-2">Loading appointments...</span>
            </div>
          )}
          {error && (
            <div className="text-center text-red-600 p-4">
              {error}
            </div>
          )}
          {!loading && !error && (
            <div className="calendar-container">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
                events={mapAppointmentsToEvents(appointments)}
                editable={true}
                selectable={true}
              selectMirror={true}
                dayMaxEvents={true}
              weekends={true}
                select={handleDateSelect}
                eventClick={handleEventClick}
                height="auto"
              contentHeight="auto"
                slotMinTime="08:00:00"
                slotMaxTime="20:00:00"
            />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
