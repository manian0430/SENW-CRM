"use client"

import { useState } from "react"
import { Bell, Search, ChevronDown, Settings, LogOut, UserIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Header() {
  const [notifications, setNotifications] = useState(3)

  // Placeholder for WebSocket connection
  // WebSocket: Update notification bell

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-6 fixed top-0 right-0 left-0 md:left-64 z-30 shadow-sm">
      <div className="relative w-full max-w-md mr-4 ml-10 md:ml-0">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input type="search" placeholder="Search..." className="pl-8 w-full bg-gray-50 border-gray-200" />
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5 text-gray-600" />
          {notifications > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 bg-senw-gold rounded-full text-xs text-white flex items-center justify-center">
              {notifications}
            </span>
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2 focus:outline-none">
              <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center">A</div>
              <div className="flex items-center">
                <span className="text-sm font-medium">Admin</span>
                <ChevronDown className="ml-1 h-4 w-4" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center justify-start p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground">admin@senwrealty.com</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
