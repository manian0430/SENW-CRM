"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileUp, Eye, FileText, FileSignature } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function TransactionsPage() {
  const [open, setOpen] = useState(false)

  // Placeholder for API calls
  // Fetch transactions from /api/transactions

  const transactions = [
    {
      id: "TX-1001",
      property: "123 Main St, Seattle, WA",
      stage: "Offer",
      agent: "Sarah Johnson",
      documents: 3,
      lastUpdated: "2 days ago",
    },
    {
      id: "TX-1002",
      property: "456 Oak Ave, Bellevue, WA",
      stage: "Under Contract",
      agent: "Mike Wilson",
      documents: 5,
      lastUpdated: "Yesterday",
    },
    {
      id: "TX-1003",
      property: "789 Pine Rd, Redmond, WA",
      stage: "Closing",
      agent: "David Miller",
      documents: 8,
      lastUpdated: "Just now",
    },
    {
      id: "TX-1004",
      property: "321 Elm St, Kirkland, WA",
      stage: "Under Contract",
      agent: "Sarah Johnson",
      documents: 4,
      lastUpdated: "3 days ago",
    },
    {
      id: "TX-1005",
      property: "555 Cedar Ln, Seattle, WA",
      stage: "Offer",
      agent: "Mike Wilson",
      documents: 2,
      lastUpdated: "1 week ago",
    },
  ]

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Offer":
        return "bg-yellow-100 text-yellow-800"
      case "Under Contract":
        return "bg-blue-100 text-blue-800"
      case "Closing":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h1 className="text-2xl font-bold">Transaction Management</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <FileUp className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="transaction">Transaction</label>
                <Select>
                  <SelectTrigger id="transaction">
                    <SelectValue placeholder="Select transaction" />
                  </SelectTrigger>
                  <SelectContent>
                    {transactions.map((tx) => (
                      <SelectItem key={tx.id} value={tx.id}>
                        {tx.id} - {tx.property}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="document-type">Document Type</label>
                <Select>
                  <SelectTrigger id="document-type">
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="offer">Offer</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="inspection">Inspection Report</SelectItem>
                    <SelectItem value="disclosure">Disclosure</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="file">File</label>
                <Input type="file" id="file" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setOpen(false)}>Upload</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Transactions Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Deal ID</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell className="font-medium">{tx.id}</TableCell>
                <TableCell>{tx.property}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(tx.stage)}`}>
                    {tx.stage}
                  </span>
                </TableCell>
                <TableCell>{tx.agent}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-1 text-gray-500" />
                    <span>{tx.documents}</span>
                  </div>
                </TableCell>
                <TableCell>{tx.lastUpdated}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <FileText className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileSignature className="mr-2 h-4 w-4" />
                        Sign Documents
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
