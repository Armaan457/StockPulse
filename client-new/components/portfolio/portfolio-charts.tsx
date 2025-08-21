"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ComposedChart, Bar } from "recharts"
import { BarChart3 } from "lucide-react"

// Mock time-series data for different chart types
const lineChartData = [
  { date: "Jan", AAPL: 165, MSFT: 370, TSLA: 720, GOOGL: 145 },
  { date: "Feb", AAPL: 168, MSFT: 375, TSLA: 710, GOOGL: 148 },
  { date: "Mar", AAPL: 170, MSFT: 372, TSLA: 705, GOOGL: 144 },
  { date: "Apr", AAPL: 172, MSFT: 378, TSLA: 715, GOOGL: 142 },
  { date: "May", AAPL: 169, MSFT: 376, TSLA: 708, GOOGL: 140 },
  { date: "Jun", AAPL: 173, MSFT: 379, TSLA: 710, GOOGL: 142 },
]

const candlestickData = [
  { date: "Mon", open: 170, high: 175, low: 168, close: 173, volume: 2500000 },
  { date: "Tue", open: 173, high: 176, low: 171, close: 174, volume: 2200000 },
  { date: "Wed", open: 174, high: 177, low: 172, close: 175, volume: 2800000 },
  { date: "Thu", open: 175, high: 178, low: 173, close: 176, volume: 2100000 },
  { date: "Fri", open: 176, high: 179, low: 174, close: 177, volume: 2600000 },
]

const chartConfig = {
  AAPL: { label: "Apple", color: "hsl(var(--chart-1))" },
  MSFT: { label: "Microsoft", color: "hsl(var(--chart-2))" },
  TSLA: { label: "Tesla", color: "hsl(var(--chart-3))" },
  GOOGL: { label: "Google", color: "hsl(var(--chart-4))" },
  volume: { label: "Volume", color: "hsl(var(--chart-5))" },
}

export function PortfolioCharts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Interactive Charts
        </CardTitle>
        <CardDescription>Advanced charting with line and candlestick views</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="line" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="line">Line Chart</TabsTrigger>
            <TabsTrigger value="candlestick">Candlestick Chart</TabsTrigger>
          </TabsList>

          <TabsContent value="line" className="space-y-4">
            <ChartContainer config={chartConfig} className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData}>
                  <XAxis dataKey="date" tickLine={false} axisLine={false} className="text-xs" />
                  <YAxis tickLine={false} axisLine={false} className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="AAPL" stroke="var(--color-chart-1)" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="MSFT" stroke="var(--color-chart-2)" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="TSLA" stroke="var(--color-chart-3)" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="GOOGL" stroke="var(--color-chart-4)" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="candlestick" className="space-y-4">
            <ChartContainer config={chartConfig} className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={candlestickData}>
                  <XAxis dataKey="date" tickLine={false} axisLine={false} className="text-xs" />
                  <YAxis yAxisId="price" orientation="left" tickLine={false} axisLine={false} className="text-xs" />
                  <YAxis yAxisId="volume" orientation="right" tickLine={false} axisLine={false} className="text-xs" />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    formatter={(value, name) => {
                      if (name === "volume") return [value.toLocaleString(), "Volume"]
                      return [`$${value}`, name]
                    }}
                  />
                  <Bar yAxisId="volume" dataKey="volume" fill="var(--color-chart-5)" opacity={0.3} />
                  <Line
                    yAxisId="price"
                    type="monotone"
                    dataKey="close"
                    stroke="var(--color-chart-1)"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
