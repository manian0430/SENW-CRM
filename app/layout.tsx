import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Sidebar from "@/components/layout/sidebar"
import Header from "@/components/layout/header"
import { AiAssistant } from "@/components/ui/ai-assistant"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SENW Real Estate CRM",
  description: "Real estate brokerage CRM dashboard",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar />
          <div className="flex flex-col flex-1 md:ml-64">
            {" "}
            {/* Add margin for sidebar */}
            <Header />
            <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6 pt-20 md:pt-24">{children}</main>
          </div>
          <AiAssistant />
        </div>
      </body>
    </html>
  )
}


import './globals.css'