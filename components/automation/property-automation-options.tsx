import { useState } from "react"; // Added useState
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Added Select components
import { Button } from "@/components/ui/button"; // Added Button

interface PropertyAutomationOptionsProps {
  property: any;
  actionType: "marketing" | "phone-sms" | "email"; // To determine which options to show
}

export function PropertyAutomationOptions({ property, actionType }: PropertyAutomationOptionsProps) {
  const [selectedDialer, setSelectedDialer] = useState<"twilio" | "dialpad" | "" | string>(""); // Added state for selected dialer and updated type
  const [smsMessage, setSmsMessage] = useState(""); // Added state for SMS message

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
              <Textarea
                placeholder="Enter your SMS message here..."
                value={smsMessage}
                onChange={(e) => setSmsMessage(e.target.value)}
              />
              <p className="text-sm text-gray-500">Compose your SMS message. AI assistance and brochure attachment options can be added here.</p>
              {smsMessage.trim().length > 0 && (
                <Button className="w-full">Send SMS</Button>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Phone Numbers</h4>
              {property.owner_1_phone_numbers || property.owner_2_phone_numbers ? (
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {property.owner_1_phone_numbers && (
                    <li>{property.owner_1_phone_numbers}</li>
                  )}
                   {property.owner_2_phone_numbers && (
                    <li>{property.owner_2_phone_numbers}</li>
                  )}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No phone numbers available for this property.</p>
              )}
            </div>

             <div className="space-y-2">
               <h4 className="font-semibold">Phone Call / Dialer Integration</h4>
               <p className="text-sm text-gray-500">Select your preferred dialer and initiate calls.</p>
               <div className="grid grid-cols-[2fr_1fr] gap-4 items-end">
                 <div className="space-y-2">
                   <Label htmlFor="dialer-provider">Dialer Provider</Label>
                   <Select value={selectedDialer} onValueChange={setSelectedDialer}>
                     <SelectTrigger id="dialer-provider">
                       <SelectValue placeholder="Select a provider" />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="twilio">Twilio</SelectItem>
                       <SelectItem value="dialpad">Dialpad</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
                 {selectedDialer === "twilio" && (
                   <Button
                     className="w-full"
                     onClick={async () => {
                       const phoneNumber = property.owner_1_phone_numbers || property.owner_2_phone_numbers;
                       if (!phoneNumber) {
                           alert("No phone number available for this property.");
                           return;
                       }
                       try {
                           const response = await fetch('/api/twilio/call', {
                               method: 'POST',
                               headers: {
                                   'Content-Type': 'application/json',
                               },
                               body: JSON.stringify({ phoneNumber }),
                           });
                           const data = await response.json();
                           if (response.ok) {
                               alert(`Twilio call initiated: ${data.message}`);
                           } else {
                               alert(`Error initiating Twilio call: ${data.error}`);
                           }
                       } catch (error: any) {
                           alert(`Error initiating Twilio call: ${error.message}`);
                       }
                     }}
                   >
                     Call via Twilio
                   </Button>
                 )}
                 {selectedDialer === "dialpad" && (
                   <Button className="w-full">Call via Dialpad</Button>
                 )}
               </div>
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