import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PhoneCall, PhoneOff, Mic, MicOff, Volume2 } from "lucide-react";
import { createClient } from '@supabase/supabase-js';

interface PropertyAutomationOptionsProps {
  property: any;
  actionType: "marketing" | "phone-sms" | "email";
}

const tabButtonStyle = (active: boolean) =>
  `px-4 py-2 rounded-t-md font-semibold transition-colors border-b-2 ${
    active
      ? "bg-white border-primary text-primary shadow"
      : "bg-gray-100 border-transparent text-gray-500 hover:bg-primary/10"
  }`;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Ensure Supabase client is only created once
const supabase = (() => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL or Anon Key is missing.');
    return null;
  }
  return createClient(supabaseUrl, supabaseAnonKey);
})();

export function PropertyAutomationOptions({ property, actionType }: PropertyAutomationOptionsProps) {
  const [activeTab, setActiveTab] = useState<'sms' | 'call'>('sms');
  const [smsMessage, setSmsMessage] = useState("");
  const [manualPhoneNumber, setManualPhoneNumber] = useState("");
  const [selectedDialer, setSelectedDialer] = useState<"twilio" | "dialpad" | "" | string>("");
  const [receivedSms, setReceivedSms] = useState<any[]>([]);
  const [loadingSms, setLoadingSms] = useState<boolean>(false);
  const [isDialpadCallActive, setIsDialpadCallActive] = useState(false);

  if (!property) return null;

  // Collect all phone numbers from property (flattened, unique)
  const phoneNumbers: string[] = [];
  if (property.owner_1_phone_numbers) phoneNumbers.push(...property.owner_1_phone_numbers.split(", "));
  if (property.owner_2_phone_numbers) phoneNumbers.push(...property.owner_2_phone_numbers.split(", "));
  const uniqueNumbers = Array.from(new Set(phoneNumbers.map(num => num.trim())));

  const fetchReceivedSms = async () => {
    if (activeTab === 'sms' && manualPhoneNumber && supabase) {
      setLoadingSms(true);
      console.log('Fetching SMS for number:', manualPhoneNumber);
      const { data, error } = await supabase
        .from('dialpad_sms_messages')
        .select('*')
        .or(`to_number.eq.${manualPhoneNumber},from_number.eq.${manualPhoneNumber}`)
        .order('received_at', { ascending: false });

      if (error) {
        console.error('Error fetching received SMS:', error);
        console.log('Supabase fetch error details:', error);
        setReceivedSms([]);
      } else {
        console.log('Supabase fetch success. Data:', data);
        setReceivedSms(data || []);
      }
      setLoadingSms(false);
    }
  };

  useEffect(() => {
    fetchReceivedSms();
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
                      // After sending, refetch messages to update the conversation view
                      fetchReceivedSms(); 
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

              <h5 className="font-semibold mt-6">Conversation History</h5>
              {loadingSms ? (
                <p className="text-gray-500">Loading messages...</p>
              ) : receivedSms.length > 0 ? (
                <div className="space-y-3 max-h-60 overflow-y-auto border p-3 rounded-md bg-gray-50 dark:bg-gray-900">
                  {receivedSms.map((msg, index) => {
                    const isSent = msg.direction === 'outbound';
                    return (
                      <div key={msg.id || index} className={`flex items-start space-x-2 ${isSent ? 'justify-end' : ''}`}>
                        {!isSent && (
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
                            {msg.from_number.charAt(0)}
                          </div>
                        )}
                        <div className={`p-3 rounded-lg shadow-sm max-w-[80%] ${isSent ? 'bg-primary text-white ml-auto' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
                          <p className="font-medium text-sm">{isSent ? 'You' : msg.from_number}</p>
                          <p className="text-sm mt-1">{msg.message_body}</p>
                          <p className={`text-xs mt-1 ${isSent ? 'text-gray-200' : 'text-gray-500 dark:text-gray-400'} text-right`}>{new Date(msg.received_at).toLocaleString()}</p>
                        </div>
                        {isSent && (
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold">
                            Me
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500">No messages in this conversation.</p>
              )}
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
                <p className="text-xs text-gray-500 mt-1">This number will be used for the phone call.</p>
              </div>
              <div>
                <Label className="font-semibold">Dialer Provider</Label>
                <Select value={selectedDialer} onValueChange={setSelectedDialer}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="twilio">Twilio</SelectItem>
                    <SelectItem value="dialpad">Dialpad</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedDialer === "dialpad" && (
                <div className="space-y-4 mt-4">
                  <div className="flex flex-col items-center justify-center p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{isDialpadCallActive ? 'Dialpad Call in Progress' : 'Dialpad Call Ready'}</p>
                    <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center text-gray-500 dark:text-gray-400">
                      <p>Dialpad iFrame Placeholder</p>
                    </div>
                    <div className="flex space-x-4 mt-4">
                      <Button variant="destructive" size="icon" aria-label="End Call">
                        <PhoneOff className="h-5 w-5" />
                      </Button>
                      <Button variant="outline" size="icon" aria-label="Mute Call">
                        <MicOff className="h-5 w-5" />
                      </Button>
                      <Button variant="outline" size="icon" aria-label="Loudspeaker">
                        <Volume2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <Button
                className="w-full mt-2"
                disabled={manualPhoneNumber.trim().length === 0 || !selectedDialer}
                onClick={async () => {
                  const phoneNumber = manualPhoneNumber.trim();
                  if (!phoneNumber) {
                    alert("Please enter a phone number.");
                    return;
                  }
                  if (!selectedDialer) {
                    alert("Please select a dialer provider.");
                    return;
                  }
                  if (selectedDialer === "twilio") {
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
                  } else if (selectedDialer === "dialpad") {
                    try {
                      const response = await fetch('/api/dialpad/call', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          phone_number: phoneNumber, // Use phoneNumber from input
                          is_consult: false,
                          outbound_caller_id: '+12013356486', // Hardcoded as per example
                          user_id: 6412736863617024 // Hardcoded as per example
                        }),
                      });
                      const data = await response.json();
                      if (response.ok) {
                        alert('Dialpad call initiated!');
                        setIsDialpadCallActive(true); // Set call as active
                      } else {
                        alert(`Error initiating Dialpad call: ${data.error}`);
                      }
                    } catch (error: any) {
                      alert(`Error initiating Dialpad call: ${error.message}`);
                    }
                  }
                }}
              >
                Call
              </Button>
            </div>
          )}
        </>
      );
    } else if (actionType === "email") {
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <h4 className="font-semibold">Email Automation</h4>
            <p className="text-sm text-gray-500">
              Compose emails with brochure attachments and AI assistance. Integration options for Mailchimp, Klaviyo, and Office 365 can be added here.
            </p>
          </div>
        </div>
      );
    }
    return null; // Fallback if actionType doesn't match
  };

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        {renderContent()}
      </CardContent>
    </Card>
  );
}