"use client";

// import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
	Card,
	CardContent,
	// CardDescription,
	// CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

// export const description = "A line chart";

// const chartData = [
// 	{ name: "January", value: 186 },
// 	{ name: "February", value: 305 },
// 	{ name: "March", value: 237 },
// 	{ name: "April", value: 73 },
// 	{ name: "May", value: 209 },
// 	{ name: "June", value: 214 },
// ];

const chartConfig = {
	value: {
		label: "Value",
		color: "hsl(var(--chart-1))",
	},
} satisfies ChartConfig;

export default function SingleLineChart({ chartData }) {
	return (
		<Card className="min-w-[600px]">
			<CardHeader>
				<CardTitle>BackTesting</CardTitle>
				{/* <CardDescription>January - June 2024</CardDescription> */}
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<LineChart
						accessibilityLayer
						data={chartData}
						margin={{
							left: 12,
							right: 12,
						}}
					>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="month"
							tickLine={true}
							axisLine={true}
							tickMargin={9}
							tickFormatter={(value) => value.slice(0, 3)}
						/>
						<YAxis
							axisLine={true}
							tickLine={true}
							tickMargin={12}
							tickCount={6}
							tickFormatter={(value) => `${value}k`}
						/>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						<Line
							dataKey="value"
							type="natural"
							stroke="var(--color-desktop)"
							strokeWidth={3}
							dot={false}
						/>
					</LineChart>
				</ChartContainer>
			</CardContent>
			{/* <CardFooter className="flex-col items-start gap-2 text-sm">
				<div className="flex gap-2 font-medium leading-none">
					Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
				</div>
				<div className="leading-none text-muted-foreground">
					Showing total visitors for the last 6 months
				</div>
			</CardFooter> */}
		</Card>
	);
}
