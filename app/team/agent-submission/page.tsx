"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, Info } from "lucide-react";
import { useState } from "react";

export default function AgentSubmission() {
  const [agentPhoto, setAgentPhoto] = useState<File | null>(null);
  const [propertyPhotos, setPropertyPhotos] = useState<File[]>([]);
  const [videoTour, setVideoTour] = useState<File | null>(null);

  return (
    <div className="max-w-2xl mx-auto py-10 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Agent Submission Form</CardTitle>
          <CardDescription>
            Please fill out the following details to submit your listing or project for SENW Realty marketing.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* 1. Agent Details */}
          <section>
            <h2 className="text-lg font-semibold mb-2">1. Agent Details</h2>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" placeholder="Enter your full name" />
              </div>
              <div>
                <Label htmlFor="location">State and City You Operate In</Label>
                <Input id="location" placeholder="e.g. Illinois, Niles" />
              </div>
              <div>
                <Label htmlFor="contact">Contact Information (Phone/Email/License Number)</Label>
                <Input id="contact" placeholder="e.g. (555) 123-4567 / you@email.com / 123456" />
              </div>
              <div>
                <Label htmlFor="social">Professional Social Media or Website (if any)</Label>
                <Input id="social" placeholder="e.g. https://linkedin.com/in/yourname" />
              </div>
              <div>
                <Label htmlFor="agentPhoto">Agent Photo (optional)</Label>
                <Input id="agentPhoto" type="file" accept="image/*" onChange={e => setAgentPhoto(e.target.files?.[0] || null)} />
                {agentPhoto && (
                  <div className="mt-2 text-xs text-muted-foreground">Selected: {agentPhoto.name}</div>
                )}
              </div>
            </div>
          </section>

          {/* 2. Listing or Project Information */}
          <section>
            <h2 className="text-lg font-semibold mb-2 mt-6">2. Listing or Project Information</h2>
            <div className="grid gap-4 mb-4">
              <div>
                <Label htmlFor="propertyPhotos">Property Photos (multiple)</Label>
                <Input id="propertyPhotos" type="file" accept="image/*" multiple onChange={e => setPropertyPhotos(e.target.files ? Array.from(e.target.files) : [])} />
                {propertyPhotos.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {propertyPhotos.map((file, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 rounded px-2 py-1">{file.name}</span>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="videoTour">Video Tour (max 1 file, ideally under 2 minutes)</Label>
                <Input id="videoTour" type="file" accept="video/*" onChange={e => setVideoTour(e.target.files?.[0] || null)} />
                {videoTour && (
                  <div className="mt-2 text-xs text-muted-foreground">Selected: {videoTour.name}</div>
                )}
              </div>
            </div>
            <div className="space-y-3 bg-muted/50 rounded-lg p-4 border">
              <div className="flex items-start gap-2">
                <input type="checkbox" className="mt-1" disabled />
                <span>High-quality photos (interior/exterior/ and even your photo beside the property)</span>
              </div>
              <div className="flex items-start gap-2">
                <input type="checkbox" className="mt-1" disabled />
                <span>Video tour (clear audio, ideally under 2 minutes, high quality)</span>
              </div>
              <div className="flex items-start gap-2">
                <input type="checkbox" className="mt-1" disabled />
                <span>Full property description: size, type, year built, features, upgrades</span>
              </div>
              <div className="flex items-start gap-2">
                <input type="checkbox" className="mt-1" disabled />
                <span>Pricing info and availability</span>
              </div>
              <div className="flex items-start gap-2">
                <input type="checkbox" className="mt-1" disabled />
                <span>Neighborhood/community highlights</span>
              </div>
              <div className="flex items-start gap-2">
                <input type="checkbox" className="mt-1" disabled />
                <span>Unique selling points (e.g., seller financing, zoning, investment potential)</span>
              </div>
            </div>
            <div className="mt-4 grid gap-4">
              <div>
                <Label htmlFor="propertyDescription">Full Property Description</Label>
                <Textarea id="propertyDescription" placeholder="Describe the property: size, type, year built, features, upgrades..." rows={3} />
              </div>
              <div>
                <Label htmlFor="pricing">Pricing Info and Availability</Label>
                <Input id="pricing" placeholder="e.g. $500,000, Available Now" />
              </div>
              <div>
                <Label htmlFor="neighborhood">Neighborhood/Community Highlights</Label>
                <Textarea id="neighborhood" placeholder="Describe the neighborhood or community..." rows={2} />
              </div>
              <div>
                <Label htmlFor="uniqueSelling">Unique Selling Points</Label>
                <Textarea id="uniqueSelling" placeholder="e.g. Seller financing, zoning, investment potential..." rows={2} />
              </div>
            </div>
          </section>

          {/* 3. Agent Spotlight Narrative */}
          <section>
            <h2 className="text-lg font-semibold mb-2 mt-6">3. Agent Spotlight Narrative <span className="text-xs text-muted-foreground">(optional but highly encouraged)</span></h2>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="story">A brief story or highlight about your experience with the property or client</Label>
                <Textarea id="story" placeholder="Share your story or highlight..." rows={2} />
              </div>
              <div>
                <Label htmlFor="whatSets">What sets this property apart</Label>
                <Textarea id="whatSets" placeholder="Describe what makes this property unique..." rows={2} />
              </div>
              <div>
                <Label htmlFor="insight">Your approach or insight as a local market expert</Label>
                <Textarea id="insight" placeholder="Share your approach or insight..." rows={2} />
              </div>
            </div>
          </section>
        </CardContent>
        <CardFooter>
          <div className="w-full">
            <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-2">
              <Info className="text-yellow-600 h-5 w-5" />
              <div className="text-sm text-yellow-900">
                Send the information to <a href="mailto:socials@senw.io" className="underline font-medium">socials@senw.io</a>.<br />
                Preferably send the photos as files to the following account: <span className="font-medium">@raghad_9_8</span>
              </div>
            </div>
            <Button className="w-full gold-button" disabled>
              Submit (Coming Soon)
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 