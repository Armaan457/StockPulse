"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { OptionsModal } from "@/components/portfolio/options-modal"
import { TrendingUp, TrendingDown, Briefcase } from "lucide-react"

// Mock portfolio holdings data
const holdings = [
  {
    ticker: "AAPL",
    company: "Apple Inc.",
    shares: 50,
    avgCost: 165.2,
    currentPrice: 172.5,
    marketValue: 8625,
    dayChange: 1.2,
    totalGainLoss: 365,
    totalGainLossPercent: 4.4,
  },
  {
    ticker: "MSFT",
    company: "Microsoft Corp.",
    shares: 25,
    avgCost: 370.8,
    currentPrice: 378.9,
    marketValue: 9472.5,
    dayChange: 0.8,
    totalGainLoss: 202.5,
    totalGainLossPercent: 2.2,
  },
  {
    ticker: "TSLA",
    company: "Tesla Inc.",
    shares: 15,
    avgCost: 720.0,
    currentPrice: 710.2,
    marketValue: 10653,
    dayChange: -2.4,
    totalGainLoss: -147,
    totalGainLossPercent: -1.4,
  },
  {
    ticker: "GOOGL",
    company: "Alphabet Inc.",
    shares: 30,
    avgCost: 145.6,
    currentPrice: 142.3,
    marketValue: 4269,
    dayChange: -1.5,
    totalGainLoss: -99,
    totalGainLossPercent: -2.3,
  },
  {
    ticker: "NVDA",
    company: "NVIDIA Corp.",
    shares: 20,
    avgCost: 420.0,
    currentPrice: 445.8,
    marketValue: 8916,
    dayChange: 3.2,
    totalGainLoss: 516,
    totalGainLossPercent: 6.1,
  },
]

export function PortfolioTable() {
  const [selectedStock, setSelectedStock] = useState<string | null>(null)

  const totalMarketValue = holdings.reduce((sum, holding) => sum + holding.marketValue, 0)
  const totalGainLoss = holdings.reduce((sum, holding) => sum + holding.totalGainLoss, 0)

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Portfolio Holdings
          </CardTitle>
          <CardDescription>
            Total Value: ${totalMarketValue.toLocaleString()} • Total Gain/Loss:{" "}
            <span className={totalGainLoss >= 0 ? "text-success" : "text-loss"}>${totalGainLoss.toLocaleString()}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead className="text-right">Shares</TableHead>
                  <TableHead className="text-right">Avg Cost</TableHead>
                  <TableHead className="text-right">Current Price</TableHead>
                  <TableHead className="text-right">Market Value</TableHead>
                  <TableHead className="text-right">Day Change</TableHead>
                  <TableHead className="text-right">Total Gain/Loss</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {holdings.map((holding) => (
                  <TableRow key={holding.ticker}>
                    <TableCell className="font-medium">{holding.ticker}</TableCell>
                    <TableCell className="text-muted-foreground">{holding.company}</TableCell>
                    <TableCell className="text-right">{holding.shares}</TableCell>
                    <TableCell className="text-right">${holding.avgCost.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${holding.currentPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${holding.marketValue.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <div
                        className={`flex items-center justify-end gap-1 ${
                          holding.dayChange >= 0 ? "text-success" : "text-loss"
                        }`}
                      >
                        {holding.dayChange >= 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {holding.dayChange >= 0 ? "+" : ""}
                        {holding.dayChange}%
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="space-y-1">
                        <div className={holding.totalGainLoss >= 0 ? "text-success" : "text-loss"}>
                          ${holding.totalGainLoss >= 0 ? "+" : ""}
                          {holding.totalGainLoss.toLocaleString()}
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            holding.totalGainLossPercent >= 0 ? "text-success border-success" : "text-loss border-loss"
                          }`}
                        >
                          {holding.totalGainLossPercent >= 0 ? "+" : ""}
                          {holding.totalGainLossPercent}%
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => setSelectedStock(holding.ticker)}>
                        Options
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <OptionsModal ticker={selectedStock} isOpen={!!selectedStock} onClose={() => setSelectedStock(null)} />
    </>
  )
}
