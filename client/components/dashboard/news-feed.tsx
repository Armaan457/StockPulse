"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Newspaper, TrendingUp, TrendingDown } from "lucide-react"

// Mock news data
const newsItems = [
  {
    id: 1,
    headline: "Federal Reserve announces interest rate decision",
    sentiment: "negative",
    time: "2 hours ago",
    source: "Reuters",
  },
  {
    id: 2,
    headline: "Apple beats earnings expectations with strong iPhone sales",
    sentiment: "positive",
    time: "4 hours ago",
    source: "Bloomberg",
  },
  {
    id: 3,
    headline: "Tesla stock surges on new battery technology announcement",
    sentiment: "positive",
    time: "6 hours ago",
    source: "CNBC",
  },
  {
    id: 4,
    headline: "Tech sector faces regulatory scrutiny in Europe",
    sentiment: "negative",
    time: "8 hours ago",
    source: "Financial Times",
  },
  {
    id: 5,
    headline: "Microsoft AI revenue growth exceeds analyst predictions",
    sentiment: "positive",
    time: "10 hours ago",
    source: "Wall Street Journal",
  },
]

const getSentimentColor = (sentiment: string) => {
  return sentiment === "positive" ? "text-success" : "text-loss"
}

const getSentimentIcon = (sentiment: string) => {
  return sentiment === "positive" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />
}

export function NewsFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-primary" />
          Market News & Sentiment
        </CardTitle>
        <CardDescription>Latest financial news with AI sentiment analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {newsItems.map((item) => (
              <div key={item.id} className="border-b pb-4 last:border-b-0">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium leading-tight">{item.headline}</h4>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {item.source} • {item.time}
                    </span>
                    <Badge variant="outline" className={`${getSentimentColor(item.sentiment)} border-current`}>
                      {getSentimentIcon(item.sentiment)}
                      <span className="ml-1 capitalize">{item.sentiment}</span>
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
