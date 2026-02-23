"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, MessageCircle, Trophy, TrendingUp } from "lucide-react"

interface UserProfileProps {
  user: any
  isOpen: boolean
  onClose: () => void
}

export function UserProfile({ user, isOpen, onClose }: UserProfileProps) {
  if (!user) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
          <DialogDescription>Community member information</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-lg">{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h3 className="font-heading text-xl font-bold">{user.username}</h3>
              <div className="flex flex-wrap gap-1">
                {user.badges.map((badge: string) => (
                  <Badge key={badge} variant="secondary" className="text-xs">
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center space-y-1">
              <div className="text-2xl font-bold text-primary">{user.posts}</div>
              <div className="text-sm text-muted-foreground">Posts</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-2xl font-bold text-primary">{Math.floor(Math.random() * 5000) + 1000}</div>
              <div className="text-sm text-muted-foreground">Reputation</div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Joined</span>
              <span>{new Date(user.joinDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Trophy className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Achievements</span>
              <span>{user.badges.length} badges earned</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Activity</span>
              <span>Active this week</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button className="flex-1">
              <MessageCircle className="h-4 w-4 mr-2" />
              Send Message
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              View Posts
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
