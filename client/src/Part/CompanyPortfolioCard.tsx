import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import React from "react";

import { TrendingDown, TrendingUp } from "lucide-react";

export interface CompanyPortfolioCardProps {
	companyName: string;
	stockSentiment: boolean;
	moneyInvested: number;
}

const CompanyPortfolioCard: React.FC<CompanyPortfolioCardProps> = ({
	companyName,
	stockSentiment,
	moneyInvested,
}) => {
	return (
		<Card className="bg-gray-100 flex justify-around items-center">
			<CardHeader>
				<CardTitle className="text-xl">{companyName}</CardTitle>
			</CardHeader>
			<CardContent>
				<CardDescription className="mt-6">
					{stockSentiment ? (
						<button className="flex flex-col">
							<span className="text-green-500">Bullish</span>{" "}
							<TrendingUp color="green" />
						</button>
					) : (
						<button className="flex flex-col">
							<span className="text-red-500">Bearish</span>{" "}
							<TrendingDown color="red" />
						</button>
					)}
				</CardDescription>
			</CardContent>
			<CardFooter>
				<CardDescription className="mt-6">{moneyInvested}</CardDescription>
			</CardFooter>
		</Card>
	);
};

export default CompanyPortfolioCard;
