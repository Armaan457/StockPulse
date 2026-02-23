"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Activity, TrendingUp } from "lucide-react"

// Mock backtesting results
const generateBacktestResults = (ticker: string, strategy: string) => ({
  totalReturn: 12.4,
  annualizedReturn: 8.7,
  maxDrawdown: -5.2,
  sharpeRatio: 1.34,
  winRate: 67,
  totalTrades: 24,
  chartData: [
    { date: "Jan", portfolio: 10000, benchmark: 10000 },
    { date: "Feb", portfolio: 10200, benchmark: 10150 },
    { date: "Mar", portfolio: 10350, benchmark: 10100 },
    { date: "Apr", portfolio: 10500, benchmark: 10300 },
    { date: "May", portfolio: 10800, benchmark: 10450 },
    { date: "Jun", portfolio: 11100, benchmark: 10600 },
    { date: "Jul", portfolio: 11240, benchmark: 10750 },
  ],
})

const chartConfig = {
  portfolio: { label: "Strategy", color: "hsl(var(--chart-1))" },
  benchmark: { label: "Benchmark", color: "hsl(var(--chart-2))" },
}

export function BacktestingTool() {
  const [ticker, setTicker] = useState("")
  const [strategy, setStrategy] = useState("")
  const [results, setResults] = useState<ReturnType<typeof generateBacktestResults> | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleBacktest = async () => {
    if (!ticker || !strategy) return

    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setResults(generateBacktestResults(ticker, strategy))
      setIsLoading(false)
    }, 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Backtesting Tool
        </CardTitle>
        <CardDescription>Test your trading strategies against historical data</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ticker">Stock Symbol</Label>
            <Select value={ticker} onValueChange={setTicker}>
              <SelectTrigger>
                <SelectValue placeholder="Select ticker" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AAPL">AAPL - Apple Inc.</SelectItem>
                <SelectItem value="MSFT">MSFT - Microsoft Corp.</SelectItem>
                <SelectItem value="TSLA">TSLA - Tesla Inc.</SelectItem>
                <SelectItem value="GOOGL">GOOGL - Alphabet Inc.</SelectItem>
                <SelectItem value="NVDA">NVDA - NVIDIA Corp.</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="strategy">Strategy</Label>
            <Select value={strategy} onValueChange={setStrategy}>
              <SelectTrigger>
                <SelectValue placeholder="Select strategy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buy-hold">Buy & Hold</SelectItem>
                <SelectItem value="moving-average">Moving Average Crossover</SelectItem>
                <SelectItem value="rsi">RSI Mean Reversion</SelectItem>
                <SelectItem value="momentum">Momentum Strategy</SelectItem>
                <SelectItem value="pairs-trading">Pairs Trading</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button onClick={handleBacktest} disabled={!ticker || !strategy || isLoading} className="w-full">
              {isLoading ? "Running Backtest..." : "Run Backtest"}
            </Button>
          </div>
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-6">
            {/* Performance Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center space-y-1">
                <p className="text-sm text-muted-foreground">Total Return</p>
                <p className="text-2xl font-bold text-success">+{results.totalReturn}%</p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm text-muted-foreground">Annualized Return</p>
                <p className="text-2xl font-bold text-success">+{results.annualizedReturn}%</p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm text-muted-foreground">Max Drawdown</p>
                <p className="text-2xl font-bold text-loss">{results.maxDrawdown}%</p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
                <p className="text-2xl font-bold">{results.sharpeRatio}</p>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Win Rate:</span>
                <span className="font-medium">{results.winRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Trades:</span>
                <span className="font-medium">{results.totalTrades}</span>
              </div>
            </div>

            {/* Performance Chart */}
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Strategy vs Benchmark Performance
              </h4>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={results.chartData}>
                    <XAxis dataKey="date" tickLine={false} axisLine={false} className="text-xs" />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      className="text-xs"
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      formatter={(value) => [`$${value.toLocaleString()}`, ""]}
                    />
                    <Line
                      type="monotone"
                      dataKey="portfolio"
                      stroke="var(--color-chart-1)"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="benchmark"
                      stroke="var(--color-chart-2)"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
