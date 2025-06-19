import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PhoneCall, PhoneOff, Mic, MicOff, Volume2, Loader2 } from "lucide-react";

interface PropertyAutomationOptionsProps {
  property: any;
  actionType: "marketing" | "phone-sms" | "email";
  onCommunicationSent?: () => void;
}

const tabButtonStyle = (active: boolean) =>
  `px-4 py-2 rounded-t-md font-semibold transition-colors border-b-2 ${
    active
      ? "bg-white border-primary text-primary shadow"
      : "bg-gray-100 border-transparent text-gray-500 hover:bg-primary/10"
  }`;

export function PropertyAutomationOptions({ property, actionType, onCommunicationSent }: PropertyAutomationOptionsProps) {
  const [activeTab, setActiveTab] = useState<'sms' | 'call'>('sms');
  const [smsMessage, setSmsMessage] = useState("");
  const [manualPhoneNumber, setManualPhoneNumber] = useState("");
  const [selectedDialer, setSelectedDialer] = useState<"twilio" | "dialpad" | "" | string>("");
  const [isDialpadCallActive, setIsDialpadCallActive] = useState(false);
  const [calling, setCalling] = useState<'twilio' | 'dialpad' | null>(null);

  if (!property) return null;

  // Collect all phone numbers from property (flattened, unique)
  const phoneNumbers: string[] = [];
  if (property.owner_1_phone_numbers) phoneNumbers.push(...property.owner_1_phone_numbers.split(", "));
  if (property.owner_2_phone_numbers) phoneNumbers.push(...property.owner_2_phone_numbers.split(", "));
  const uniqueNumbers = Array.from(new Set(phoneNumbers.map(num => num.trim())));

  useEffect(() => {
    // Reset call status when tab changes or phone number changes
    setIsDialpadCallActive(false);
  }, [activeTab, manualPhoneNumber]);

  // Render content based on the main actionType prop
  const renderContent = () => {
    if (actionType === "marketing") {
      return (
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
      );
    } else if (actionType === "phone-sms") {
      return (
        <>
          {/* Internal Tabs for SMS/Call */}
          <div className="flex space-x-2 mb-4">
            <button
              className={tabButtonStyle(activeTab === 'sms')}
              onClick={() => setActiveTab('sms')}
              type="button"
            >
              Send SMS
            </button>
            <button
              className={tabButtonStyle(activeTab === 'call')}
              onClick={() => setActiveTab('call')}
              type="button"
            >
              Phone Call
            </button>
          </div>

          {/* Phone number chips */}
          {uniqueNumbers.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {uniqueNumbers.map((num, idx) => (
                <button
                  key={num + idx}
                  type="button"
                  className={`px-3 py-1 rounded-full border text-sm transition-colors ${manualPhoneNumber === num ? 'bg-primary text-white border-primary' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-primary/10'}`}
                  onClick={() => setManualPhoneNumber(num)}
                >
                  {num}
                </button>
              ))}
            </div>
          )}

          {/* SMS Tab Content */}
          {activeTab === 'sms' && (
            <div className="space-y-4">
              <div>
                <Label className="font-semibold">Phone Number</Label>
                <Input
                  placeholder="Enter phone number to send SMS"
                  value={manualPhoneNumber}
                  onChange={e => setManualPhoneNumber(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">This number will be used for sending the SMS.</p>
              </div>
              <div>
                <Label className="font-semibold">SMS Message</Label>
                <Textarea
                  placeholder="Enter your SMS message here..."
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  className="mt-1 min-h-[80px]"
                />
                <p className="text-xs text-gray-500 mt-1">Compose your SMS message. AI assistance and brochure attachment options can be added here.</p>
              </div>
              <Button
                className="w-full mt-2"
                disabled={smsMessage.trim().length === 0 || manualPhoneNumber.trim().length === 0}
                onClick={async () => {
                  const phoneNumber = manualPhoneNumber.trim();
                  if (!phoneNumber) {
                    alert("Please enter a phone number.");
                    return;
                  }
                  
                  // Validate phone number format
                  const phoneRegex = /^\+[1-9]\d{1,14}$/;
                  if (!phoneRegex.test(phoneNumber)) {
                    alert("Please enter a valid phone number in international format (e.g., +1234567890)");
                    return;
                  }

                  try {
                    const response = await fetch('/api/dialpad/sms', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        to: phoneNumber,
                        message: smsMessage,
                        direction: 'outbound', // Mark as outbound
                      }),
                    });
                    let data = null;
                    try {
                      data = await response.json();
                    } catch (err) {
                      data = null;
                    }
                    if (response.ok) {
                      alert(`SMS sent successfully to ${phoneNumber}!`);
                      // After sending, refresh logs in parent component
                      if (onCommunicationSent) {
                        onCommunicationSent();
                      }
                    } else {
                      alert(`Error sending SMS: ${data && data.error ? data.error : 'Unknown error'}`);
                    }
                  } catch (error: any) {
                    alert(`Error sending SMS: ${error.message}`);
                  }
                }}
              >
                Send SMS
              </Button>
            </div>
          )}

          {/* Phone Call Tab Content */}
          {activeTab === 'call' && (
            <div className="space-y-4">
              <div>
                <Label className="font-semibold">Phone Number</Label>
                <Input
                  placeholder="Enter phone number to call"
                  value={manualPhoneNumber}
                  onChange={e => setManualPhoneNumber(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">This number will be used for the call.</p>
              </div>
              <div>
                <Label className="font-semibold">Select Dialer</Label>
                <Select onValueChange={(value) => setSelectedDialer(value as "twilio" | "dialpad" | "")}
                  value={selectedDialer}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a dialer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="twilio">Twilio</SelectItem>
                    <SelectItem value="dialpad">Dialpad</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">Choose your preferred service for calls.</p>
              </div>
              {(selectedDialer === 'twilio' || selectedDialer === 'dialpad') && (
                <div className="flex space-x-2">
                  <Button
                    className="w-full"
                    disabled={manualPhoneNumber.trim().length === 0 || calling !== null}
                    onClick={async () => {
                      const phoneNumber = manualPhoneNumber.trim();
                      if (!phoneNumber) {
                        alert("Please enter a phone number.");
                        return;
                      }
                      
                      // Validate phone number format
                      const phoneRegex = /^\+[1-9]\d{1,14}$/;
                      if (!phoneRegex.test(phoneNumber)) {
                        alert("Please enter a valid phone number in international format (e.g., +1234567890)");
                        return;
                      }

                      if (selectedDialer === "twilio") {
                        setCalling('twilio');
                        try {
                          const response = await fetch('/api/twilio/call', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              to: phoneNumber,
                              from: '+12013356486', // Replace with your Twilio From number
                              url: 'http://demo.twilio.com/docs/voice.xml', // Example TwiML URL
                            }),
                          });
                          const data = await response.json();
                          if (response.ok) {
                            alert(`Twilio call initiated: ${data.message}`);
                            // Refresh logs after successful Twilio call initiation
                            if (onCommunicationSent) {
                              onCommunicationSent();
                            }
                          } else {
                            alert(`Error initiating Twilio call: ${data.error}`);
                          }
                        } catch (error: any) {
                          alert(`Error initiating Twilio call: ${error.message}`);
                        } finally {
                          setCalling(null);
                        }
                      } else if (selectedDialer === "dialpad") {
                        setCalling('dialpad');
                        try {
                          const response = await fetch('/api/dialpad/call', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ phone_number: phoneNumber }),
                          });
                          const data = await response.json();
                          if (response.ok) {
                            alert('Dialpad call initiated!');
                            setIsDialpadCallActive(true); // Set call as active
                            // Refresh logs after successful Dialpad call initiation
                            if (onCommunicationSent) {
                              onCommunicationSent();
                            }
                          } else {
                            alert(`Error initiating Dialpad call: ${data.error}`);
                          }
                        } catch (error: any) {
                          alert(`Error initiating Dialpad call: ${error.message}`);
                        } finally {
                          setCalling(null);
                        }
                      }
                    }}
                  >
                    {calling === 'twilio' ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <PhoneCall className="h-5 w-5" />
                    )}
                    {selectedDialer === 'twilio' ? 'Twilio Call' : 'Dialpad Call'}
                  </Button>
                  {selectedDialer === 'dialpad' && isDialpadCallActive && (
                    <Button
                      variant="destructive"
                      onClick={async () => {
                        // In a real scenario, you'd call a Dialpad API to end the call
                        alert("Call ended (mock action). Implement Dialpad API to end call.");
                        setIsDialpadCallActive(false);
                      }}
                    >
                      <PhoneOff className="h-5 w-5 mr-2" />
                      End Call
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      );
    } else if (actionType === "email") {
      return (
        <div className="space-y-6">
          <p className="text-sm text-gray-500">Email actions are handled via the &quot;Email Templates&quot; tab.</p>
        </div>
      );
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardContent className="p-6">
        {renderContent()}
      </CardContent>
    </Card>
  );
}