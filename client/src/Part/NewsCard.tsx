import React from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { TrendingUp, TrendingDown } from "lucide-react";

interface NewsCardProps {
	companyName: string;
	stockTrend: number; // positive for increase, negative for decline
}

const NewsCard: React.FC<NewsCardProps> = ({ companyName, stockTrend }) => {
	const trendColor = stockTrend >= 0 ? "green" : "red";
	const trendSign = stockTrend >= 0 ? "+" : "";

	return (
		<Card className="grid place-items-center min-w-44 gap-2 m-1">
			<CardHeader>
				<CardTitle className="text-center leading-4">
					{companyName}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<CardDescription style={{ color: trendColor }}>
					{trendSign}
					{stockTrend}%
					{stockTrend >= 0 ? <TrendingUp /> : <TrendingDown />}
				</CardDescription>
			</CardContent>
			<CardFooter>{/* Additional footer content can go here */}</CardFooter>
		</Card>
	);
};

export default NewsCard;
