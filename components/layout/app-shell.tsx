'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';
import { AiAssistant } from '@/components/ui/ai-assistant';
// Restore PropertyProvider import
import { PropertyProvider } from '@/contexts/property-context';

interface AppShellProps {
  children: React.ReactNode;
}

const AUTH_PATHS = ['/login', '/signup'];

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isAuthPage = AUTH_PATHS.includes(pathname);

  if (isAuthPage) {
    // Render only children for auth pages (minimal layout)
    return <>{children}</>;
  }

  // Render the full application shell for other pages
  return (
    <PropertyProvider> {/* Restore PropertyProvider wrapper */}
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
    </PropertyProvider>
  );
}
