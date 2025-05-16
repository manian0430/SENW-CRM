import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Mail, FileText } from "lucide-react";
import { Dispatch, SetStateAction, ReactNode } from "react";

interface AutomationTabsProps {
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
  children: ReactNode;
}

export function AutomationTabs({ activeTab, setActiveTab, children }: AutomationTabsProps) {
  return (
    <Tabs defaultValue="workflows" className="space-y-4" onValueChange={setActiveTab}>

      <TabsList>
        <TabsTrigger value="workflows" className="flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          Workflows
        </TabsTrigger>
        <TabsTrigger value="marketing" className="flex items-center">
           {/* Add appropriate icon for Marketing */}
          Marketing
        </TabsTrigger>
        <TabsTrigger value="phone-sms" className="flex items-center">
           {/* Add appropriate icon for Phone/SMS */}
          Phone/SMS
        </TabsTrigger>
        <TabsTrigger value="email-templates" className="flex items-center">
          <Mail className="h-4 w-4 mr-2" />
          Email Templates
        </TabsTrigger>
        <TabsTrigger value="logs" className="flex items-center">
          <FileText className="h-4 w-4 mr-2" />
          Logs
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
}