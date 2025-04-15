import React from 'react';
import { PageHeader } from '@/components/ui/page-header';

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" description="Manage your application settings." />
      <div className="p-4">
        {/* Settings content will go here */}
        <p>Application settings will be available here.</p>
      </div>
    </div>
  );
}
