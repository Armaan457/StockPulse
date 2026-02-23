"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus, Brain } from "lucide-react"

// Mock AI insights data
const aiInsights = [
  {
    ticker: "AAPL",
    company: "Apple Inc.",
    prediction: "Buy",
    confidence: 78,
    price: 172.5,
    change: "+1.2%",
    reasoning: "Strong earnings outlook and product innovation pipeline",
  },
  {
    ticker: "TSLA",
    company: "Tesla Inc.",
    prediction: "Hold",
    confidence: 65,
    price: 710.2,
    change: "-2.4%",
    reasoning: "Volatile market conditions but solid fundamentals",
  },
  {
    ticker: "MSFT",
    company: "Microsoft Corp.",
    prediction: "Buy",
    confidence: 82,
    price: 378.9,
    change: "+0.8%",
    reasoning: "AI integration driving revenue growth",
  },
  {
    ticker: "GOOGL",
    company: "Alphabet Inc.",
    prediction: "Sell",
    confidence: 71,
    price: 142.3,
    change: "-1.5%",
    reasoning: "Regulatory concerns and increased competition",
  },
]

const getPredictionColor = (prediction: string) => {
  switch (prediction) {
    case "Buy":
      return "bg-success text-success-foreground"
    case "Sell":
      return "bg-loss text-loss-foreground"
    case "Hold":
      return "bg-warning text-warning-foreground"
    default:
      return "bg-muted text-muted-foreground"
  }
}

const getPredictionIcon = (prediction: string) => {
  switch (prediction) {
    case "Buy":
      return <TrendingUp className="h-4 w-4" />
    case "Sell":
      return <TrendingDown className="h-4 w-4" />
    case "Hold":
      return <Minus className="h-4 w-4" />
    default:
      return null
  }
}

export function AIInsightsPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Market Insights
        </CardTitle>
        <CardDescription>Real-time AI-powered stock recommendations and analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aiInsights.map((insight) => (
            <div key={insight.ticker} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-semibold">{insight.ticker}</h3>
                  <p className="text-sm text-muted-foreground">{insight.company}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${insight.price}</p>
                  <p className={`text-sm ${insight.change.startsWith("+") ? "text-success" : "text-loss"}`}>
                    {insight.change}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Badge className={getPredictionColor(insight.prediction)}>
                  {getPredictionIcon(insight.prediction)}
                  <span className="ml-1">{insight.prediction}</span>
                </Badge>
                <span className="text-sm text-muted-foreground">{insight.confidence}% confidence</span>
              </div>

              <p className="text-sm text-muted-foreground">{insight.reasoning}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
