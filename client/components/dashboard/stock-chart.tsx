"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { BarChart3 } from "lucide-react"

// Mock stock performance data
const chartData = [
  { date: "Jan", value: 23400 },
  { date: "Feb", value: 24100 },
  { date: "Mar", value: 23800 },
  { date: "Apr", value: 24500 },
  { date: "May", value: 24200 },
  { date: "Jun", value: 25300 },
]

const chartConfig = {
  value: {
    label: "Portfolio Value",
    color: "hsl(var(--chart-1))",
  },
}

export function StockChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Portfolio Performance
        </CardTitle>
        <CardDescription>6-month portfolio value trend</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="date" tickLine={false} axisLine={false} className="text-xs" />
              <YAxis
                tickLine={false}
                axisLine={false}
                className="text-xs"
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value) => [`$${value.toLocaleString()}`, "Portfolio Value"]}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--color-chart-1)"
                strokeWidth={3}
                dot={{ fill: "var(--color-chart-1)", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "var(--color-chart-1)", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
