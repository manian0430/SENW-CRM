"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Home,
  FileText,
  Calendar,
  BarChart2,
  FileIcon,
  UserPlus,
  Menu,
  X,
  MessageSquare,
  Clock,
  Share2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Leads", href: "/leads", icon: Users },
  { name: "Properties", href: "/properties", icon: Home },
  { name: "Transactions", href: "/transactions", icon: FileText },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Analytics", href: "/analytics", icon: BarChart2 },
  { name: "Documents", href: "/documents", icon: FileIcon, disabled: true },
  { name: "Team", href: "/team", icon: UserPlus },
  { name: "Agent Submission", href: "/team/agent-submission", icon: UserPlus },
  { name: "Automation", href: "/automation", icon: Clock },
  { name: "Collaboration", href: "/collaboration", icon: MessageSquare },
  { name: "Social", href: "/social", icon: Share2 },
]

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && <div className="md:hidden fixed inset-0 bg-black/20 z-40" onClick={() => setIsOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-black text-white transform transition-transform duration-200 ease-in-out md:translate-x-0 overflow-y-auto",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-center h-16 border-b border-white/10 px-4">
          <div className="relative h-10 w-full max-w-[140px]">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-8WyKB0kEHIBoIkHY6qpbdPO3fPIUU6.png"
              alt="SENW Realty"
              fill
              className="object-contain"
            />
          </div>
        </div>
        <nav className="mt-5 px-2 pb-24">
          {navItems.map((item) => {
            const isActive = !item.disabled && (pathname === item.href || pathname.startsWith(`${item.href}/`))

            // Instead of conditional component, render different things based on disabled state
            if (item.disabled) {
              return (
                <div
                  key={item.name}
                  className="sidebar-item text-gray-500 opacity-50 cursor-not-allowed"
                  aria-disabled={true}
                  tabIndex={-1}
                >
                  <item.icon className="mr-3 h-5 w-5 text-gray-500 opacity-50" />
                  {item.name}
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "sidebar-item",
                  isActive ? "sidebar-item-active" : "sidebar-item-inactive"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
