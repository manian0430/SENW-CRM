"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

interface PageHeaderProps {
  title: string
  description?: string
  action?: {
    label: string
    icon?: LucideIcon
    onClick?: () => void
    dialogContent?: ReactNode
  }
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 page-header">
      <div>
        <h1 className="page-title">{title}</h1>
        {description && <p className="page-description">{description}</p>}
      </div>
      {action && (
        <>
          {action.dialogContent ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-senw-gold hover:bg-senw-gold/90 text-white">
                  {action.icon && <action.icon className="mr-2 h-4 w-4" />}
                  {action.label}
                </Button>
              </DialogTrigger>
              {action.dialogContent}
            </Dialog>
          ) : (
            <Button className="bg-senw-gold hover:bg-senw-gold/90 text-white" onClick={action.onClick}>
              {action.icon && <action.icon className="mr-2 h-4 w-4" />}
              {action.label}
            </Button>
          )}
        </>
      )}
    </div>
  )
}
