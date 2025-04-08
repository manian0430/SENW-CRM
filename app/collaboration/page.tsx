"use client"

import { TableCell } from "@/components/ui/table"

import { TableBody } from "@/components/ui/table"

import { TableHead } from "@/components/ui/table"

import { TableRow } from "@/components/ui/table"

import { TableHeader } from "@/components/ui/table"

import { Table } from "@/components/ui/table"

import { useState } from "react"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  MessageSquare,
  Users,
  Home,
  Plus,
  Send,
  PaperclipIcon,
  Clock,
  Search,
  Filter,
  StickyNote,
  Edit,
  Trash2,
  MoreHorizontal,
  Bell,
  CheckCircle,
  User,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function CollaborationPage() {
  const [activeConversation, setActiveConversation] = useState<number | null>(1)
  const [messageText, setMessageText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  // Sample data for team members
  const teamMembers = [
    { id: 1, name: "Sarah Johnson", role: "Agent", status: "online", avatar: "" },
    { id: 2, name: "Mike Wilson", role: "Agent", status: "offline", avatar: "" },
    { id: 3, name: "David Miller", role: "Agent", status: "away", avatar: "" },
    { id: 4, name: "Emily Davis", role: "Admin", status: "online", avatar: "" },
    { id: 5, name: "Robert Brown", role: "Manager", status: "online", avatar: "" },
  ]

  // Sample data for conversations
  const conversations = [
    {
      id: 1,
      type: "direct",
      participants: [1, 4], // IDs of team members
      unread: 0,
      lastMessage: {
        sender: 4,
        text: "I've assigned you a new lead that came in this morning.",
        timestamp: "10:32 AM",
      },
    },
    {
      id: 2,
      type: "direct",
      participants: [1, 2],
      unread: 3,
      lastMessage: {
        sender: 2,
        text: "Can you cover my showing tomorrow at 2pm?",
        timestamp: "Yesterday",
      },
    },
    {
      id: 3,
      type: "group",
      name: "Sales Team",
      participants: [1, 2, 3, 5],
      unread: 5,
      lastMessage: {
        sender: 5,
        text: "Team meeting tomorrow at 9am to discuss Q3 goals.",
        timestamp: "Yesterday",
      },
    },
    {
      id: 4,
      type: "group",
      name: "123 Main St Deal",
      participants: [1, 2, 4],
      unread: 0,
      lastMessage: {
        sender: 1,
        text: "The inspection is scheduled for Friday at 10am.",
        timestamp: "2 days ago",
      },
    },
  ]

  // Sample data for messages in the active conversation
  const messages = [
    {
      id: 1,
      conversationId: 1,
      sender: 4,
      text: "Hi Sarah, I've assigned you a new lead that came in this morning.",
      timestamp: "10:32 AM",
      read: true,
    },
    {
      id: 2,
      conversationId: 1,
      sender: 1,
      text: "Thanks Emily! I'll reach out to them right away.",
      timestamp: "10:35 AM",
      read: true,
    },
    {
      id: 3,
      conversationId: 1,
      sender: 4,
      text: "Great! They're interested in properties in the downtown area, budget around $500k.",
      timestamp: "10:38 AM",
      read: true,
    },
    {
      id: 4,
      conversationId: 1,
      sender: 1,
      text: "Perfect, I have a few listings that might work for them. I'll prepare some options.",
      timestamp: "10:40 AM",
      read: true,
    },
    {
      id: 5,
      conversationId: 1,
      sender: 4,
      text: "Also, I've shared their contact details in the CRM. They're available for a call this afternoon if you can manage it.",
      timestamp: "10:45 AM",
      read: false,
    },
  ]

  // Sample data for notes
  const notes = [
    {
      id: 1,
      title: "123 Main St - Buyer Preferences",
      content: "Client prefers hardwood floors, updated kitchen, and at least 3 bedrooms. Budget is firm at $450k.",
      author: 1,
      created: "2023-07-15",
      updated: "2023-07-15",
      property: "123 Main St",
    },
    {
      id: 2,
      title: "Follow-up with John Smith",
      content: "Need to call back about financing options. He's pre-approved for $350k but might be able to go higher.",
      author: 1,
      created: "2023-07-14",
      updated: "2023-07-14",
      lead: "John Smith",
    },
    {
      id: 3,
      title: "Team Meeting Notes",
      content:
        "Discussed new listing presentation templates. Sarah to finalize by Friday. New commission structure starts next month.",
      author: 5,
      created: "2023-07-13",
      updated: "2023-07-13",
    },
    {
      id: 4,
      title: "456 Oak Ave - Showing Feedback",
      content: "Clients liked the layout but concerned about the small backyard. Might be interested if price drops.",
      author: 2,
      created: "2023-07-12",
      updated: "2023-07-12",
      property: "456 Oak Ave",
    },
    {
      id: 5,
      title: "Marketing Ideas",
      content:
        "Instagram campaign for luxury listings. Virtual tours for all properties above $400k. Weekly market update emails.",
      author: 3,
      created: "2023-07-10",
      updated: "2023-07-11",
    },
  ]

  // Sample data for tasks
  const tasks = [
    {
      id: 1,
      title: "Call John Smith about financing",
      description: "Follow up on pre-approval status and discuss higher budget options",
      assignedTo: 1,
      dueDate: "2023-07-16",
      status: "pending",
      priority: "high",
    },
    {
      id: 2,
      title: "Prepare listing presentation for 789 Pine Rd",
      description: "Include recent comps and marketing strategy",
      assignedTo: 1,
      dueDate: "2023-07-17",
      status: "pending",
      priority: "medium",
    },
    {
      id: 3,
      title: "Schedule photographer for 123 Main St",
      description: "Need professional photos for new listing",
      assignedTo: 2,
      dueDate: "2023-07-18",
      status: "completed",
      priority: "medium",
    },
    {
      id: 4,
      title: "Review contract for 456 Oak Ave",
      description: "Check contingencies and timeline",
      assignedTo: 3,
      dueDate: "2023-07-15",
      status: "pending",
      priority: "high",
    },
    {
      id: 5,
      title: "Update CRM with new leads",
      description: "Enter contact information and preferences",
      assignedTo: 4,
      dueDate: "2023-07-16",
      status: "pending",
      priority: "low",
    },
  ]

  const getTeamMember = (id: number) => {
    return teamMembers.find((member) => member.id === id)
  }

  const getConversationName = (conversation: any) => {
    if (conversation.type === "group") {
      return conversation.name
    } else {
      // For direct messages, show the other person's name
      const otherParticipantId = conversation.participants.find((id: number) => id !== 1) // Assuming current user is ID 1
      const otherParticipant = getTeamMember(otherParticipantId)
      return otherParticipant?.name || "Unknown"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      case "offline":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
  }

  const handleSendMessage = () => {
    if (messageText.trim() === "") return
    // In a real app, this would send the message to the server
    console.log("Sending message:", messageText)
    setMessageText("")
  }

  // Create Note Dialog Content
  const CreateNoteDialog = (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Create New Note</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <label htmlFor="note-title">Title</label>
          <Input id="note-title" placeholder="Enter note title" />
        </div>
        <div className="grid gap-2">
          <label htmlFor="note-content">Content</label>
          <Textarea id="note-content" placeholder="Enter note content" rows={5} />
        </div>
        <div className="grid gap-2">
          <label htmlFor="related-to">Related To (Optional)</label>
          <Select>
            <SelectTrigger id="related-to">
              <SelectValue placeholder="Select related item" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="lead">Lead</SelectItem>
              <SelectItem value="property">Property</SelectItem>
              <SelectItem value="transaction">Transaction</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <label htmlFor="share-with">Share With (Optional)</label>
          <Select>
            <SelectTrigger id="share-with">
              <SelectValue placeholder="Select team members" />
            </SelectTrigger>
            <SelectContent>
              {teamMembers.map((member) => (
                <SelectItem key={member.id} value={member.id.toString()}>
                  {member.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline">Cancel</Button>
        <Button className="bg-senw-gold hover:bg-senw-gold/90 text-white">Save Note</Button>
      </DialogFooter>
    </DialogContent>
  )

  // Create Task Dialog Content
  const CreateTaskDialog = (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Create New Task</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <label htmlFor="task-title">Title</label>
          <Input id="task-title" placeholder="Enter task title" />
        </div>
        <div className="grid gap-2">
          <label htmlFor="task-description">Description</label>
          <Textarea id="task-description" placeholder="Enter task description" rows={3} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <label htmlFor="assigned-to">Assigned To</label>
            <Select>
              <SelectTrigger id="assigned-to">
                <SelectValue placeholder="Select team member" />
              </SelectTrigger>
              <SelectContent>
                {teamMembers.map((member) => (
                  <SelectItem key={member.id} value={member.id.toString()}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <label htmlFor="due-date">Due Date</label>
            <Input id="due-date" type="date" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <label htmlFor="priority">Priority</label>
            <Select>
              <SelectTrigger id="priority">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <label htmlFor="related-to">Related To (Optional)</label>
            <Select>
              <SelectTrigger id="related-to">
                <SelectValue placeholder="Select related item" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="lead">Lead</SelectItem>
                <SelectItem value="property">Property</SelectItem>
                <SelectItem value="transaction">Transaction</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline">Cancel</Button>
        <Button className="bg-senw-gold hover:bg-senw-gold/90 text-white">Create Task</Button>
      </DialogFooter>
    </DialogContent>
  )

  // Create Conversation Dialog Content
  const CreateConversationDialog = (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>New Conversation</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <label htmlFor="conversation-type">Conversation Type</label>
          <Select>
            <SelectTrigger id="conversation-type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="direct">Direct Message</SelectItem>
              <SelectItem value="group">Group Chat</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <label htmlFor="participants">Participants</label>
          <Select>
            <SelectTrigger id="participants">
              <SelectValue placeholder="Select team members" />
            </SelectTrigger>
            <SelectContent>
              {teamMembers.map((member) => (
                <SelectItem key={member.id} value={member.id.toString()}>
                  {member.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <label htmlFor="group-name">Group Name (for group chats)</label>
          <Input id="group-name" placeholder="Enter group name" />
        </div>
        <div className="grid gap-2">
          <label htmlFor="initial-message">Initial Message (Optional)</label>
          <Textarea id="initial-message" placeholder="Type your first message..." rows={3} />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline">Cancel</Button>
        <Button className="bg-senw-gold hover:bg-senw-gold/90 text-white">Start Conversation</Button>
      </DialogFooter>
    </DialogContent>
  )

  return (
    <div className="space-y-6">
      <PageHeader title="Team Collaboration" description="Communicate and collaborate with your team" />

      <Tabs defaultValue="messages" className="space-y-4">
        <TabsList>
          <TabsTrigger value="messages" className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-2" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center">
            <StickyNote className="h-4 w-4 mr-2" />
            Notes
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-2" />
            Tasks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-220px)]">
            {/* Conversations List */}
            <Card className="lg:col-span-1 overflow-hidden flex flex-col">
              <CardHeader className="px-4 py-3 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-lg font-semibold">Conversations</CardTitle>
                <Button variant="ghost" size="icon" className="text-senw-gold">
                  <Plus className="h-5 w-5" />
                </Button>
              </CardHeader>
              <div className="px-4 py-2">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search conversations..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <CardContent className="flex-1 overflow-auto p-0">
                <div className="divide-y">
                  {conversations.map((conversation) => {
                    const conversationName = getConversationName(conversation)
                    const lastMessageSender = getTeamMember(conversation.lastMessage.sender)

                    return (
                      <div
                        key={conversation.id}
                        className={`p-4 cursor-pointer hover:bg-gray-50 ${
                          activeConversation === conversation.id ? "bg-senw-gold/5 border-l-4 border-senw-gold" : ""
                        }`}
                        onClick={() => setActiveConversation(conversation.id)}
                      >
                        <div className="flex items-start">
                          <Avatar className="h-10 w-10">
                            {conversation.type === "group" ? (
                              <div className="bg-senw-gold text-white h-full w-full flex items-center justify-center">
                                <Users className="h-5 w-5" />
                              </div>
                            ) : (
                              <>
                                <AvatarImage src="" />
                                <AvatarFallback>{getInitials(conversationName)}</AvatarFallback>
                              </>
                            )}
                          </Avatar>
                          <div className="ml-3 flex-1">
                            <div className="flex justify-between items-start">
                              <div className="font-medium">{conversationName}</div>
                              <div className="text-xs text-gray-500">{conversation.lastMessage.timestamp}</div>
                            </div>
                            <div className="text-sm text-gray-500 mt-1 flex items-center">
                              {conversation.type === "group" && (
                                <span className="font-medium mr-1">{lastMessageSender?.name.split(" ")[0]}:</span>
                              )}
                              <span className="truncate">{conversation.lastMessage.text}</span>
                            </div>
                            {conversation.unread > 0 && (
                              <div className="mt-1">
                                <Badge className="bg-senw-gold text-white">{conversation.unread} new</Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
              <CardFooter className="border-t p-4">
                <Button className="w-full bg-senw-gold hover:bg-senw-gold/90 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  New Conversation
                </Button>
              </CardFooter>
            </Card>

            {/* Message Thread */}
            <Card className="lg:col-span-2 overflow-hidden flex flex-col">
              {activeConversation ? (
                <>
                  <CardHeader className="px-4 py-3 flex flex-row items-center justify-between space-y-0 border-b">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src="" />
                        <AvatarFallback>
                          {getInitials(getConversationName(conversations.find((c) => c.id === activeConversation)))}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg font-semibold">
                          {getConversationName(conversations.find((c) => c.id === activeConversation))}
                        </CardTitle>
                        <p className="text-xs text-gray-500">
                          {conversations.find((c) => c.id === activeConversation)?.type === "group"
                            ? `${conversations.find((c) => c.id === activeConversation)?.participants.length} members`
                            : "Direct Message"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon">
                        <Bell className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-auto p-4">
                    <div className="space-y-4">
                      {messages
                        .filter((message) => message.conversationId === activeConversation)
                        .map((message) => {
                          const sender = getTeamMember(message.sender)
                          const isCurrentUser = message.sender === 1 // Assuming current user is ID 1

                          return (
                            <div key={message.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                              <div className="flex items-start max-w-[80%]">
                                {!isCurrentUser && (
                                  <Avatar className="h-8 w-8 mr-2">
                                    <AvatarImage src="" />
                                    <AvatarFallback>{getInitials(sender?.name || "")}</AvatarFallback>
                                  </Avatar>
                                )}
                                <div>
                                  <div
                                    className={`rounded-lg p-3 ${
                                      isCurrentUser ? "bg-senw-gold text-white" : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    <p className="text-sm">{message.text}</p>
                                  </div>
                                  <div className="flex items-center mt-1">
                                    <p className="text-xs text-gray-500">{message.timestamp}</p>
                                    {isCurrentUser && message.read && (
                                      <CheckCircle className="h-3 w-3 text-gray-400 ml-1" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t p-4">
                    <div className="flex items-center w-full space-x-2">
                      <Button variant="outline" size="icon">
                        <PaperclipIcon className="h-4 w-4" />
                      </Button>
                      <Input
                        placeholder="Type your message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage()
                          }
                        }}
                        className="flex-1"
                      />
                      <Button
                        className="bg-senw-gold hover:bg-senw-gold/90 text-white"
                        onClick={handleSendMessage}
                        disabled={messageText.trim() === ""}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <MessageSquare className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium">No conversation selected</h3>
                  <p className="text-sm text-gray-500 mt-1">Select a conversation from the list or start a new one</p>
                </div>
              )}
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search notes..." className="pl-8" />
            </div>
            <Button className="bg-senw-gold hover:bg-senw-gold/90 text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Note
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => {
              const author = getTeamMember(note.author)

              return (
                <Card key={note.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-semibold">{note.title}</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    {note.property && (
                      <Badge variant="outline" className="mt-1">
                        <Home className="h-3 w-3 mr-1" />
                        {note.property}
                      </Badge>
                    )}
                    {note.lead && (
                      <Badge variant="outline" className="mt-1">
                        <User className="h-3 w-3 mr-1" />
                        {note.lead}
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <p className="text-sm text-gray-600 line-clamp-3">{note.content}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between items-center text-xs text-gray-500">
                    <div className="flex items-center">
                      <Avatar className="h-5 w-5 mr-1">
                        <AvatarFallback className="text-[10px]">{getInitials(author?.name || "")}</AvatarFallback>
                      </Avatar>
                      <span>{author?.name}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{new Date(note.updated).toLocaleDateString()}</span>
                    </div>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search tasks..." className="pl-8" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            <Button className="bg-senw-gold hover:bg-senw-gold/90 text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[300px]">Task</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasks.map((task) => {
                      const assignee = getTeamMember(task.assignedTo)

                      return (
                        <TableRow key={task.id}>
                          <TableCell className="font-medium">
                            <div>
                              <div>{task.title}</div>
                              <div className="text-xs text-muted-foreground">{task.description}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Avatar className="h-6 w-6 mr-2">
                                <AvatarFallback>{getInitials(assignee?.name || "")}</AvatarFallback>
                              </Avatar>
                              <span>{assignee?.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                                task.priority,
                              )}`}
                            >
                              {task.priority}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                task.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {task.status === "completed" ? (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              ) : (
                                <Clock className="h-3 w-3 mr-1" />
                              )}
                              {task.status === "completed" ? "Completed" : "Pending"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                {task.status !== "completed" ? (
                                  <DropdownMenuItem>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Mark as Complete
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem>
                                    <Clock className="mr-2 h-4 w-4" />
                                    Mark as Pending
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
