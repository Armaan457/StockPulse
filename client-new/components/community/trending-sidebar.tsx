"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TrendingUp, Hash, Users, Crown } from "lucide-react"

// Mock trending data
const trendingTags = [
  { tag: "AIStocks", posts: 156, trend: "up" },
  { tag: "OptionsTrading", posts: 89, trend: "up" },
  { tag: "TSLA", posts: 234, trend: "down" },
  { tag: "Earnings", posts: 67, trend: "up" },
  { tag: "TechStocks", posts: 123, trend: "up" },
  { tag: "Dividends", posts: 45, trend: "neutral" },
]

const topContributors = [
  {
    username: "MarketMaven",
    avatar: "/placeholder.svg?height=32&width=32",
    posts: 1247,
    reputation: 9850,
    badges: ["Expert", "Top Contributor"],
  },
  {
    username: "TechAnalyst",
    avatar: "/placeholder.svg?height=32&width=32",
    posts: 892,
    reputation: 7320,
    badges: ["Tech Expert", "Verified"],
  },
  {
    username: "ValueSeeker",
    avatar: "/placeholder.svg?height=32&width=32",
    posts: 634,
    reputation: 5940,
    badges: ["Value Investor"],
  },
]

const recentActivity = [
  {
    user: "CryptoKing",
    action: "started a discussion about",
    topic: "Bitcoin ETF approval impact",
    time: "5 min ago",
  },
  {
    user: "DividendHunter",
    action: "replied to",
    topic: "Best dividend stocks for 2024",
    time: "12 min ago",
  },
  {
    user: "OptionsGuru",
    action: "shared insights on",
    topic: "Volatility trading strategies",
    time: "18 min ago",
  },
]

export function TrendingSidebar() {
  return (
    <div className="space-y-6">
      {/* Trending Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Hash className="h-4 w-4 text-primary" />
            Trending Topics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {trendingTags.map((item) => (
              <div key={item.tag} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">#{item.tag}</span>
                  {item.trend === "up" && <TrendingUp className="h-3 w-3 text-success" />}
                </div>
                <span className="text-xs text-muted-foreground">{item.posts} posts</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Contributors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Crown className="h-4 w-4 text-primary" />
            Top Contributors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topContributors.map((contributor, index) => (
              <div key={contributor.username} className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-muted-foreground w-4">#{index + 1}</span>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={contributor.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{contributor.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{contributor.username}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{contributor.reputation} rep</span>
                    {contributor.badges.slice(0, 1).map((badge) => (
                      <Badge key={badge} variant="secondary" className="text-xs">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4 text-primary" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="space-y-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.user}</span>{" "}
                  <span className="text-muted-foreground">{activity.action}</span>{" "}
                  <span className="font-medium">{activity.topic}</span>
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
