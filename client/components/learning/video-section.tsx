"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Clock, Users } from "lucide-react"

// Real YouTube video data for financial education
const videoPlaylist = [
  {
    id: "1",
    title: "Stock Market Basics for Beginners",
    description: "Learn the fundamentals of stock market investing, including how stocks work and basic terminology.",
    videoId: "p7HKvqRI_Bo",
    duration: "15:32",
    views: "2.1M",
    level: "Beginner",
    category: "Fundamentals",
  },
  {
    id: "2",
    title: "Understanding Financial Statements",
    description: "Deep dive into reading and analyzing company financial statements for better investment decisions.",
    videoId: "WEDIj9JBTC8",
    duration: "22:45",
    views: "890K",
    level: "Intermediate",
    category: "Analysis",
  },
  {
    id: "3",
    title: "Options Trading Explained",
    description: "Complete guide to options trading, including calls, puts, and basic strategies.",
    videoId: "7PM4rNDr4oI",
    duration: "28:17",
    views: "1.5M",
    level: "Advanced",
    category: "Options",
  },
  {
    id: "4",
    title: "Technical Analysis Fundamentals",
    description: "Learn to read charts, identify patterns, and use technical indicators for trading decisions.",
    videoId: "08c4YvEb2F8",
    duration: "19:23",
    views: "1.2M",
    level: "Intermediate",
    category: "Technical Analysis",
  },
  {
    id: "5",
    title: "Portfolio Diversification Strategies",
    description: "Master the art of building a diversified investment portfolio to manage risk effectively.",
    videoId: "uSUIZI6OuFY",
    duration: "16:54",
    views: "750K",
    level: "Intermediate",
    category: "Portfolio Management",
  },
  {
    id: "6",
    title: "Cryptocurrency Investing Guide",
    description: "Understanding digital assets, blockchain technology, and crypto investment strategies.",
    videoId: "VYWc9dFqROI",
    duration: "24:11",
    views: "980K",
    level: "Beginner",
    category: "Cryptocurrency",
  },
]

const getLevelColor = (level: string) => {
  switch (level) {
    case "Beginner":
      return "bg-success text-success-foreground"
    case "Intermediate":
      return "bg-warning text-warning-foreground"
    case "Advanced":
      return "bg-loss text-loss-foreground"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export function VideoSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5 text-primary" />
          Video Learning Library
        </CardTitle>
        <CardDescription>Comprehensive video courses from market fundamentals to advanced strategies</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videoPlaylist.map((video) => (
            <div key={video.id} className="group cursor-pointer">
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden mb-3">
                <iframe
                  src={`https://www.youtube.com/embed/${video.videoId}`}
                  title={video.title}
                  className="w-full h-full"
                  allowFullScreen
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              </div>

              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors">
                    {video.title}
                  </h3>
                  <Badge className={getLevelColor(video.level)} variant="secondary">
                    {video.level}
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2">{video.description}</p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {video.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {video.views} views
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {video.category}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
