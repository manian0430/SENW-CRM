import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PropertyAutomationOptionsProps {
  property: any;
  actionType: "marketing" | "phone-sms" | "email"; // To determine which options to show
}

export function PropertyAutomationOptions({ property, actionType }: PropertyAutomationOptionsProps) {
  if (!property) {
    return null; // Or a placeholder message
  }

  return (
    <Card>
      <CardContent className="space-y-6">
        {actionType === "marketing" ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <h4 className="font-semibold">Brochure</h4>
              <Input type="file" accept=".pdf,.jpeg,.jpg" />
              <p className="text-sm text-gray-500">Upload a 1-page brochure (PDF/JPEG) for the property.</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Distribution Options</h4>
              <div className="flex items-center space-x-2">
                <Checkbox id="distribute-mail" />
                <Label htmlFor="distribute-mail">Mail</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="distribute-email" />
                <Label htmlFor="distribute-email">Email</Label>
              </div>
            </div>
          </div>
        ) : actionType === "phone-sms" ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <h4 className="font-semibold">SMS Message</h4>
              <Textarea placeholder="Enter your SMS message here..." />
              <p className="text-sm text-gray-500">Compose your SMS message. AI assistance and brochure attachment options can be added here.</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Phone Call / Dialer Integration</h4>
              <p className="text-sm text-gray-500">Options for AI voice calls to VM and integration with dialer tools can be added here.</p>
            </div>
          </div>
        ) : actionType === "email" ? (
           <div className="space-y-6">
             <div className="space-y-2">
               <h4 className="font-semibold">Email Automation</h4>
               <p className="text-sm text-gray-500">
                 Compose emails with brochure attachments and AI assistance. Integration options for Mailchimp, Klaviyo, and Office 365 can be added here.
               </p>
             </div>
           </div>
        ) : null} {/* Render null if actionType doesn't match */}
      </CardContent>
    </Card>
  );
}