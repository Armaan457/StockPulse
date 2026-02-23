"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Wallet, TrendingUp, TrendingDown } from "lucide-react"

// Mock portfolio data
const portfolioData = {
  totalBalance: 25300,
  dayChange: 2.4,
  dayChangeAmount: 610,
  weekChange: -1.2,
  monthChange: 8.7,
  topHoldings: [
    { ticker: "AAPL", percentage: 35, value: 8855 },
    { ticker: "MSFT", percentage: 25, value: 6325 },
    { ticker: "TSLA", percentage: 20, value: 5060 },
    { ticker: "GOOGL", percentage: 20, value: 5060 },
  ],
}

export function PortfolioSnapshot() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          Portfolio Snapshot
        </CardTitle>
        <CardDescription>Your investment overview</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Total Balance */}
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
          <p className="text-3xl font-heading font-bold">${portfolioData.totalBalance.toLocaleString()}</p>
          <div className="flex items-center justify-center gap-1">
            {portfolioData.dayChange > 0 ? (
              <TrendingUp className="h-4 w-4 text-success" />
            ) : (
              <TrendingDown className="h-4 w-4 text-loss" />
            )}
            <span className={portfolioData.dayChange > 0 ? "text-success" : "text-loss"}>
              {portfolioData.dayChange > 0 ? "+" : ""}
              {portfolioData.dayChange}% (${portfolioData.dayChangeAmount})
            </span>
            <span className="text-muted-foreground">today</span>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">1 Week</span>
            <span className={portfolioData.weekChange > 0 ? "text-success" : "text-loss"}>
              {portfolioData.weekChange > 0 ? "+" : ""}
              {portfolioData.weekChange}%
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">1 Month</span>
            <span className={portfolioData.monthChange > 0 ? "text-success" : "text-loss"}>
              {portfolioData.monthChange > 0 ? "+" : ""}
              {portfolioData.monthChange}%
            </span>
          </div>
        </div>

        {/* Top Holdings */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Top Holdings</h4>
          {portfolioData.topHoldings.map((holding) => (
            <div key={holding.ticker} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{holding.ticker}</span>
                <span className="text-muted-foreground">${holding.value.toLocaleString()}</span>
              </div>
              <Progress value={holding.percentage} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
