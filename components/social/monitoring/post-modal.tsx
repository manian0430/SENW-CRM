import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ExternalLink, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PostModalProps {
  isOpen: boolean
  onClose: () => void
  post: {
    platform: 'x' | 'facebook' | 'linkedin' | 'instagram' | 'tiktok' | 'bluesky' | 'truth'
    type: string
    content: string
    author: string
    link: string
    date: string
    engagement?: {
      likes?: number
      replies?: number
      retweets?: number
    }
  } | null
}

export function PostModal({ isOpen, onClose, post }: PostModalProps) {
  if (!post || !isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] p-0 gap-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Post Details</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <div className="space-y-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    {post.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold">{post.author}</div>
                    <div className="text-sm text-muted-foreground">@{post.author}</div>
                  </div>
                </div>
              </div>
              <div className="text-[15px] whitespace-pre-wrap">{post.content}</div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{post.date}</span>
                <Button
                  variant="link"
                  size="sm"
                  className="flex items-center gap-2 px-0"
                  onClick={() => window.open(post.link, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                  View Original
                </Button>
              </div>
              {post.engagement && (
                <div className="flex gap-6 border-y py-3 text-sm text-muted-foreground">
                  {post.engagement.replies !== undefined && (
                    <div>
                      <span className="font-semibold text-foreground">{post.engagement.replies}</span> replies
                    </div>
                  )}
                  {post.engagement.retweets !== undefined && (
                    <div>
                      <span className="font-semibold text-foreground">{post.engagement.retweets}</span> reposts
                    </div>
                  )}
                  {post.engagement.likes !== undefined && (
                    <div>
                      <span className="font-semibold text-foreground">{post.engagement.likes}</span> likes
                    </div>
                  )}
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" disabled>
                  Convert to Lead
                </Button>
                <Button variant="outline" size="sm" disabled className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add as Contact
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}