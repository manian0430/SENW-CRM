'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Settings, Twitter, Facebook, Instagram, Linkedin } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { PostModal } from '@/components/social/monitoring/post-modal'
import { useState } from 'react'

// Custom icons for platforms that aren't in lucide
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0011.14-4.02v-6.95a8.16 8.16 0 004.65 1.46V7.08a4.79 4.79 0 01-1.2-.4z"/>
  </svg>
)

const BlueSkyIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M12 3L4 9l8 6 8-6-8-6zM4 15l8 6 8-6-8-6-8 6z"/>
  </svg>
)

const TruthIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z"/>
  </svg>
)

export default function MonitoringPage() {
  const [selectedPost, setSelectedPost] = useState<any>(null)

  const mockXPost = {
    platform: 'x',
    type: 'Mention',
    content: '@brand Looking to upgrade our CRM system',
    author: 'tech_company',
    link: 'https://twitter.com/tech_company/status/123456789',
    date: '2024-06-01',
    engagement: {
      replies: 5,
      retweets: 3,
      likes: 15
    }
  }

  return (
    <div className="grid gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Social Monitoring</h2>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Customize Columns
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Monitor
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Platform Overview</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Twitter className="h-4 w-4" />
                <span className="font-medium">X (Twitter)</span>
              </div>
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-muted-foreground">New Leads</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Linkedin className="h-4 w-4" />
                <span className="font-medium">LinkedIn</span>
              </div>
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-muted-foreground">New Leads</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Instagram className="h-4 w-4" />
                <span className="font-medium">Instagram</span>
              </div>
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-muted-foreground">New Leads</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Facebook className="h-4 w-4" />
                <span className="font-medium">Facebook</span>
              </div>
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-muted-foreground">New Leads</div>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 h-auto gap-4">
            <TabsTrigger value="all" className="flex items-center">
              All Platforms
            </TabsTrigger>
            <TabsTrigger value="x" className="flex items-center">
              <Twitter className="h-4 w-4 mr-2" />
              X
            </TabsTrigger>
            <TabsTrigger value="linkedin" className="flex items-center">
              <Linkedin className="h-4 w-4 mr-2" />
              LinkedIn
            </TabsTrigger>
            <TabsTrigger value="instagram" className="flex items-center">
              <Instagram className="h-4 w-4 mr-2" />
              Instagram
            </TabsTrigger>
            <TabsTrigger value="facebook" className="flex items-center">
              <Facebook className="h-4 w-4 mr-2" />
              Facebook
            </TabsTrigger>
            <TabsTrigger value="tiktok" className="flex items-center">
              <TikTokIcon />
              <span className="ml-2">TikTok</span>
            </TabsTrigger>
            <TabsTrigger value="bluesky" className="flex items-center">
              <BlueSkyIcon />
              <span className="ml-2">Bluesky</span>
            </TabsTrigger>
            <TabsTrigger value="truth" className="flex items-center">
              <TruthIcon />
              <span className="ml-2">Truth</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid gap-6">
              <Card className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Platform</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Content</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Lead Score</TableHead>
                      <TableHead>Engagement</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>X</TableCell>
                      <TableCell>Mention</TableCell>
                      <TableCell>@user mentioned your brand</TableCell>
                      <TableCell>user123</TableCell>
                      <TableCell>85</TableCell>
                      <TableCell>12</TableCell>
                      <TableCell>New</TableCell>
                      <TableCell>2024-06-01</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" disabled>
                            Convert to Lead
                          </Button>
                          <Button variant="outline" size="sm" disabled className="flex items-center gap-2">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /><path strokeLinecap="round" strokeLinejoin="round" d="M20 8v6m3-3h-6" /></svg>
                            Add as Contact
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>LinkedIn</TableCell>
                      <TableCell>Comment</TableCell>
                      <TableCell>Interested in your product</TableCell>
                      <TableCell>jane.doe</TableCell>
                      <TableCell>90</TableCell>
                      <TableCell>5</TableCell>
                      <TableCell>Contacted</TableCell>
                      <TableCell>2024-06-02</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" disabled>
                            Convert to Lead
                          </Button>
                          <Button variant="outline" size="sm" disabled className="flex items-center gap-2">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /><path strokeLinecap="round" strokeLinejoin="round" d="M20 8v6m3-3h-6" /></svg>
                            Add as Contact
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Instagram</TableCell>
                      <TableCell>DM</TableCell>
                      <TableCell>Can I get more info?</TableCell>
                      <TableCell>insta_fan</TableCell>
                      <TableCell>70</TableCell>
                      <TableCell>3</TableCell>
                      <TableCell>Pending</TableCell>
                      <TableCell>2024-06-03</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" disabled>
                            Convert to Lead
                          </Button>
                          <Button variant="outline" size="sm" disabled className="flex items-center gap-2">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /><path strokeLinecap="round" strokeLinejoin="round" d="M20 8v6m3-3h-6" /></svg>
                            Add as Contact
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Facebook</TableCell>
                      <TableCell>Visitor Post</TableCell>
                      <TableCell>Great service!</TableCell>
                      <TableCell>fb_user</TableCell>
                      <TableCell>60</TableCell>
                      <TableCell>2</TableCell>
                      <TableCell>New</TableCell>
                      <TableCell>2024-06-04</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" disabled>
                            Convert to Lead
                          </Button>
                          <Button variant="outline" size="sm" disabled className="flex items-center gap-2">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /><path strokeLinecap="round" strokeLinejoin="round" d="M20 8v6m3-3h-6" /></svg>
                            Add as Contact
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>TikTok</TableCell>
                      <TableCell>Comment</TableCell>
                      <TableCell>Love this!</TableCell>
                      <TableCell>tiktok_star</TableCell>
                      <TableCell>75</TableCell>
                      <TableCell>8</TableCell>
                      <TableCell>Reviewed</TableCell>
                      <TableCell>2024-06-05</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" disabled>
                            Convert to Lead
                          </Button>
                          <Button variant="outline" size="sm" disabled className="flex items-center gap-2">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /><path strokeLinecap="round" strokeLinejoin="round" d="M20 8v6m3-3h-6" /></svg>
                            Add as Contact
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Bluesky</TableCell>
                      <TableCell>Mention</TableCell>
                      <TableCell>@brand you rock!</TableCell>
                      <TableCell>sky_user</TableCell>
                      <TableCell>65</TableCell>
                      <TableCell>1</TableCell>
                      <TableCell>New</TableCell>
                      <TableCell>2024-06-06</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" disabled>
                            Convert to Lead
                          </Button>
                          <Button variant="outline" size="sm" disabled className="flex items-center gap-2">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /><path strokeLinecap="round" strokeLinejoin="round" d="M20 8v6m3-3h-6" /></svg>
                            Add as Contact
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Truth</TableCell>
                      <TableCell>Reply</TableCell>
                      <TableCell>Looking forward to updates</TableCell>
                      <TableCell>truthseeker</TableCell>
                      <TableCell>55</TableCell>
                      <TableCell>0</TableCell>
                      <TableCell>Pending</TableCell>
                      <TableCell>2024-06-07</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" disabled>
                            Convert to Lead
                          </Button>
                          <Button variant="outline" size="sm" disabled className="flex items-center gap-2">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /><path strokeLinecap="round" strokeLinejoin="round" d="M20 8v6m3-3h-6" /></svg>
                            Add as Contact
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Card>

              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Trending Topics</h3>
                  <div className="space-y-4">
                    <div className="text-center text-muted-foreground py-8">
                      No trending topics found
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Engagement Stats</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold">0</div>
                        <div className="text-sm text-muted-foreground">Mentions</div>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold">0</div>
                        <div className="text-sm text-muted-foreground">Replies</div>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold">0</div>
                        <div className="text-sm text-muted-foreground">Retweets</div>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold">0</div>
                        <div className="text-sm text-muted-foreground">Likes</div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Sentiment Analysis</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-green-500">0</div>
                        <div className="text-sm text-muted-foreground">Positive</div>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-yellow-500">0</div>
                        <div className="text-sm text-muted-foreground">Neutral</div>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-red-500">0</div>
                        <div className="text-sm text-muted-foreground">Negative</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="x">
            <div className="grid gap-6">
              <Card className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Content</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Engagement</TableHead>
                      <TableHead>Sentiment</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelectedPost(mockXPost)}
                    >
                      <TableCell>Mention</TableCell>
                      <TableCell>@brand Looking to upgrade our CRM system</TableCell>
                      <TableCell>tech_company</TableCell>
                      <TableCell>15</TableCell>
                      <TableCell>Positive</TableCell>
                      <TableCell>2024-06-01</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            disabled
                            onClick={(e) => e.stopPropagation()}
                          >
                            Convert to Lead
                          </Button>
                          <Button variant="outline" size="sm" disabled className="flex items-center gap-2">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /><path strokeLinecap="round" strokeLinejoin="round" d="M20 8v6m3-3h-6" /></svg>
                            Add as Contact
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="linkedin">
            <div className="grid gap-6">
              <Card className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Content</TableHead>
                      <TableHead>Profile</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Post Comment</TableCell>
                      <TableCell>Interested in learning more about your solutions</TableCell>
                      <TableCell>Sarah Johnson</TableCell>
                      <TableCell>Tech Solutions Inc</TableCell>
                      <TableCell>IT Director</TableCell>
                      <TableCell>2024-06-02</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" disabled>
                            Convert to Lead
                          </Button>
                          <Button variant="outline" size="sm" disabled className="flex items-center gap-2">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /><path strokeLinecap="round" strokeLinejoin="round" d="M20 8v6m3-3h-6" /></svg>
                            Add as Contact
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tiktok">
            <div className="grid gap-6">
              <Card className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Content</TableHead>
                      <TableHead>Creator</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Likes</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Video Comment</TableCell>
                      <TableCell>This CRM looks perfect for our startup!</TableCell>
                      <TableCell>startup_guru</TableCell>
                      <TableCell>1.2k</TableCell>
                      <TableCell>156</TableCell>
                      <TableCell>2024-06-05</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" disabled>
                            Convert to Lead
                          </Button>
                          <Button variant="outline" size="sm" disabled className="flex items-center gap-2">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /><path strokeLinecap="round" strokeLinejoin="round" d="M20 8v6m3-3h-6" /></svg>
                            Add as Contact
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="instagram">
            <div className="grid gap-6">
              <Card className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Content</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Likes</TableHead>
                      <TableHead>Comments</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Story Mention</TableCell>
                      <TableCell>Check out this amazing CRM system! 🚀</TableCell>
                      <TableCell>business_insider</TableCell>
                      <TableCell>45</TableCell>
                      <TableCell>12</TableCell>
                      <TableCell>2024-06-03</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" disabled>
                            Convert to Lead
                          </Button>
                          <Button variant="outline" size="sm" disabled className="flex items-center gap-2">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /><path strokeLinecap="round" strokeLinejoin="round" d="M20 8v6m3-3h-6" /></svg>
                            Add as Contact
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="facebook">
            <div className="grid gap-6">
              <Card className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Content</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Reactions</TableHead>
                      <TableHead>Comments</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Page Comment</TableCell>
                      <TableCell>Do you offer enterprise solutions?</TableCell>
                      <TableCell>John Smith</TableCell>
                      <TableCell>8</TableCell>
                      <TableCell>3</TableCell>
                      <TableCell>2024-06-04</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" disabled>
                            Convert to Lead
                          </Button>
                          <Button variant="outline" size="sm" disabled className="flex items-center gap-2">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /><path strokeLinecap="round" strokeLinejoin="round" d="M20 8v6m3-3h-6" /></svg>
                            Add as Contact
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bluesky">
            <div className="grid gap-6">
              <Card className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Content</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Reposts</TableHead>
                      <TableHead>Likes</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Mention</TableCell>
                      <TableCell>Anyone tried this new CRM system?</TableCell>
                      <TableCell>tech_enthusiast</TableCell>
                      <TableCell>5</TableCell>
                      <TableCell>12</TableCell>
                      <TableCell>2024-06-06</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" disabled>
                            Convert to Lead
                          </Button>
                          <Button variant="outline" size="sm" disabled className="flex items-center gap-2">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /><path strokeLinecap="round" strokeLinejoin="round" d="M20 8v6m3-3h-6" /></svg>
                            Add as Contact
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="truth">
            <div className="grid gap-6">
              <Card className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Content</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>ReTruths</TableHead>
                      <TableHead>Likes</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Post</TableCell>
                      <TableCell>Great American CRM system! 🇺🇸</TableCell>
                      <TableCell>business_patriot</TableCell>
                      <TableCell>8</TableCell>
                      <TableCell>25</TableCell>
                      <TableCell>2024-06-07</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" disabled>
                            Convert to Lead
                          </Button>
                          <Button variant="outline" size="sm" disabled className="flex items-center gap-2">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /><path strokeLinecap="round" strokeLinejoin="round" d="M20 8v6m3-3h-6" /></svg>
                            Add as Contact
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <PostModal 
        isOpen={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        post={selectedPost}
      />
    </div>
  )
} 