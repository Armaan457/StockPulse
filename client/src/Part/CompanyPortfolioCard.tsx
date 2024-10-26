import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import React from "react";

// import { TrendingDown, TrendingUp } from "lucide-react";

export interface CompanyPortfolioCardProps {
	companyName: string;
	stockSentiment: string;
	moneyInvested: number;
	sentiment: string;
}

const CompanyPortfolioCard: React.FC<CompanyPortfolioCardProps> = ({
	companyName,
	stockSentiment,
	moneyInvested,
	sentiment,
}) => {
	const color =
		sentiment === "positive"
			? "green"
			: sentiment === "neutral"
			? "gray"
			: "red";
	return (
		<Card className="bg-gray-100 flex justify-around items-center">
			<CardHeader>
				<CardTitle className="text-xl">{companyName}</CardTitle>
			</CardHeader>
			<CardContent>
				<CardDescription className={`mt-6 font-medium text-${color}-500`}>
					{stockSentiment}
				</CardDescription>
			</CardContent>
			<CardFooter>
				<CardDescription className="mt-6">{moneyInvested}</CardDescription>
			</CardFooter>
		</Card>
	);
};

export default CompanyPortfolioCard;
