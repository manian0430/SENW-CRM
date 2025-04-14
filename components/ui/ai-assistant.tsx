'use client';

import { useState, useEffect } from 'react';
import { Button } from './button';
import { Card, CardContent } from './card';
import { Input } from './input';
import { ScrollArea } from './scroll-area';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MessageCircle, X, Mic, MicOff, Loader2, Bed, Bath, Square } from 'lucide-react';
import { useProperties } from '@/contexts/property-context';
import { type Property } from '@/lib/utils/property-data';
import { formatCurrency } from "@/lib/utils/format";
import { PropertyDetailsDialog } from './property-details-dialog';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'properties';
  properties?: Partial<Property>[];
}

// Web Speech API types
interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: Event) => void;
  onend: () => void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

interface Window {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
}

const EXAMPLE_PROMPTS = [
  "List active properties under $500k in Chicago",
  "Find properties with a pool",
  "Show me 3+ bedroom Single Family homes"
];

const SYSTEM_CONTEXT = `You are an AI assistant for a real estate CRM system. Base your answers *only* on the property data provided below. \nWhen asked to list properties matching certain criteria, respond ONLY with a valid JSON array containing objects for each matching property. \nEach object in the array should have the following fields: address, city, state, price, beds, baths, status, type (use universalLandUse), sqft (use livingAreaSqft), and apn. \nVERY IMPORTANT: Do NOT wrap the JSON array in markdown code blocks (like \`\`\`json ... \`\`\`). Respond with ONLY the raw JSON array string starting with '[' and ending with ']'. \nDo not include any introductory text, explanations, or summaries outside the JSON array itself.`;

function FormattedProperties({ 
  properties, 
  onViewDetails 
}: { 
  properties: Partial<Property>[], 
  onViewDetails: (apn: string) => void 
}) {
  return (
    <div className="space-y-2">
      {properties.map((p, index) => (
        <Button
          key={index} 
          variant="ghost"
          className="h-auto w-full p-0 text-left"
          onClick={() => p.apn && onViewDetails(p.apn)}
          disabled={!p.apn}
        >
          <Card className="w-full overflow-hidden hover:bg-accent transition-colors">
            <CardContent className="p-3 space-y-1 text-xs">
              <p className="font-semibold text-sm whitespace-normal">{p.address}</p>
              <p className="whitespace-normal">{p.city}, {p.state}</p>
              <div className="flex justify-between items-center pt-1">
                <p className="font-bold text-primary text-sm">{p.price ? formatCurrency(p.price) : 'N/A'}</p>
                <div className="flex items-center gap-2 text-muted-foreground">
                  {p.beds !== undefined && <span className="flex items-center gap-1"><Bed size={12} />{p.beds}</span>}
                  {p.baths !== undefined && <span className="flex items-center gap-1"><Bath size={12} />{p.baths}</span>}
                  {p.livingAreaSqft && <span className="flex items-center gap-1"><Square size={12} />{p.livingAreaSqft} sqft</span>}
                </div>
              </div>
              {p.status && <p className="text-[10px] text-muted-foreground">Status: {p.status}</p>}
            </CardContent>
          </Card>
        </Button>
      ))}
    </div>
  );
}

export function AiAssistant() {
  const { properties, loading: propertiesLoading } = useProperties();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  
  const [detailsProperty, setDetailsProperty] = useState<Property | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize speech recognition
      const SpeechRecognition = (window as Window).SpeechRecognition || (window as Window).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsListening(false);
        };

        recognition.onerror = (event: Event) => {
          console.error('Speech recognition error:', event);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        setRecognition(recognition);
      }
    }
  }, []);

  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  // Helper function to prepare property data for the prompt
  const preparePropertyDataForPrompt = (properties: Property[]): string => {
    if (!properties || properties.length === 0) {
      return "No property data available.";
    }
    // Summarize properties to avoid overly long prompts
    const summarizedProperties = properties.slice(0, 50).map(p => ({
      apn: p.apn,
      address: p.address,
      city: p.city,
      state: p.state,
      price: p.price,
      beds: p.beds,
      baths: p.baths,
      status: p.status,
      type: p.universalLandUse,
      sqft: p.livingAreaSqft
    }));
    return JSON.stringify(summarizedProperties);
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading || propertiesLoading) return;

    try {
      setIsLoading(true);
      // Add user message to chat
      const userMessage: Message = { role: 'user', content: input, type: 'text' };
      setMessages(prev => [...prev, userMessage]);
      setInput('');

      // Prepare property data context
      const propertyDataContext = preparePropertyDataForPrompt(properties);
      const fullPrompt = `${SYSTEM_CONTEXT}\n\nProperty Data:\n${propertyDataContext}\n\nUser Question: ${input}`;

      // Initialize Gemini AI
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.0-flash',
        generationConfig: {
          temperature: 0.2,
          topK: 1,
          topP: 1,
        }
      });

      // Get response from Gemini
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      let text = response.text();
      let aiMessage: Message;

      // Attempt to parse the response as JSON
      try {
        let jsonText = text.trim();
        // Attempt to strip markdown fences if present
        if (jsonText.startsWith('```json') && jsonText.endsWith('```')) {
          jsonText = jsonText.substring(7, jsonText.length - 3).trim();
        } else if (jsonText.startsWith('```') && jsonText.endsWith('```')) {
           jsonText = jsonText.substring(3, jsonText.length - 3).trim();
        }

        const potentialJson = jsonText.startsWith('[') && jsonText.endsWith(']');
        if (potentialJson) {
          const parsedProperties: Partial<Property>[] = JSON.parse(jsonText);
          // Check if it's an array of objects (basic validation)
          if (Array.isArray(parsedProperties) && parsedProperties.length > 0 && typeof parsedProperties[0] === 'object') {
            // Ensure APN is present in parsed data if possible
            const propertiesWithApn = parsedProperties.filter(p => p.apn);
            aiMessage = { role: 'assistant', content: '', type: 'properties', properties: propertiesWithApn };
          } else {
             // Not the expected format, treat as text
             aiMessage = { role: 'assistant', content: text, type: 'text' }; // Use original text
          }
        } else {
           // Not JSON, treat as text
           aiMessage = { role: 'assistant', content: text, type: 'text' }; // Use original text
        }
      } catch (parseError) {
        // JSON parsing failed, treat as text
        console.warn("AI response was not valid JSON or markdown-wrapped JSON:", parseError);
        aiMessage = { role: 'assistant', content: text, type: 'text' }; // Use original text
      }

      setMessages(prev => [...prev, aiMessage]);

      // Optional: Read out the response
      /* if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
      } */
    } catch (error) {
      console.error('Error getting AI response:', error);
      // Add error message to chat
      const errorMessage: Message = { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error retrieving the AI response. Please try again.',
        type: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler to open the details dialog
  const handleViewDetailsClick = (apn: string) => {
    const propertyToView = properties.find(p => p.apn === apn);
    if (propertyToView) {
      setDetailsProperty(propertyToView);
      setDetailsOpen(true);
    } else {
      console.warn(`Property with APN ${apn} not found in the main list.`);
      // Optionally show a toast message
    }
  };

  if (!isOpen) {
    return (
      <Button
        className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <>
      <Card className="fixed bottom-4 right-4 w-[400px] h-[500px] p-4 flex flex-col shadow-lg z-50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">AI Assistant</h3>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {propertiesLoading && (
              <div className="flex items-center justify-center p-4 text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading property data...
              </div>
            )}
            {!propertiesLoading && messages.length === 0 && (
              <div className="text-center text-muted-foreground p-4">
                <p className="mb-4">👋 Hi! I'm your real estate assistant.</p>
                <div className="space-y-2">
                  <p className="text-sm font-medium mb-2">Try asking me:</p>
                  {EXAMPLE_PROMPTS.map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full text-left h-auto whitespace-normal"
                      onClick={() => {
                        setInput(prompt);
                      }}
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`rounded-lg px-3 py-2 max-w-[85%] ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.type === 'properties' && message.properties ? (
                    <FormattedProperties 
                      properties={message.properties} 
                      onViewDetails={handleViewDetailsClick} 
                    />
                  ) : (
                    message.content
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex gap-2 mt-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? 'Listening...' : 'Ask about properties...'}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            disabled={propertiesLoading}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={toggleListening}
            className={isListening ? 'bg-red-100 hover:bg-red-200' : ''}
            disabled={!recognition || propertiesLoading}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Button onClick={sendMessage} disabled={isLoading || propertiesLoading}>
            {isLoading || propertiesLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              'Send'
            )}
          </Button>
        </div>
      </Card>

      {detailsProperty && (
        <PropertyDetailsDialog
          property={detailsProperty}
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
        />
      )}
    </>
  );
} 