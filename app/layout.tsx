import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
// Remove direct imports of Sidebar, Header, AiAssistant, PropertyProvider
import { AuthProvider } from "@/contexts/auth-context" // Keep AuthProvider
import AppShell from "@/components/layout/app-shell" // Import AppShell

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
        <AuthProvider> {/* AuthProvider remains the outermost provider */}
          <AppShell>{children}</AppShell> {/* Use AppShell to wrap children */}
        </AuthProvider>
      </body>
    </html>
  )
}


import './globals.css'
