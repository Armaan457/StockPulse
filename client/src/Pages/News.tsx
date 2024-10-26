import { useState } from "react";
import NewsCard from "@/Part/NewsCard.tsx";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import CompanyPortfolioCard, {
	CompanyPortfolioCardProps,
} from "@/Part/CompanyPortfolioCard.tsx";
import axios from "axios";

interface NewsData {
	ticker_name: string;
	investment_amount: number;
}

const BASE_URL = "http://localhost:8000";

const News = () => {
	const { open } = useSidebar();
	const { register, handleSubmit } = useForm<NewsData>();
	const [companyPortfolioCards, setCompanyPortfolioCards] = useState<
		CompanyPortfolioCardProps[]
	>([]);

	const createPortfolioCompany = async (data: NewsData) => {
		if (data.ticker_name.trim() === "" || data.investment_amount <= 0) return;
		console.log(data);
		await axios.post(`${BASE_URL}/NewsSection/portfolio`, data);
		const response = await axios.get(`${BASE_URL}/Chatsession`);
		const sentiment = response.data.answer.split("Sentiment:")[1];
		setCompanyPortfolioCards((prev) => [
			...prev,
			{
				companyName: data.ticker_name,
				stockSentiment: response.data.answer,
				moneyInvested: data.investment_amount,
				sentiment,
			},
		]);
	};

	return (
		<>
			<div
				className={`grid grid-cols-2 place-items-center gap-y-5 mx-28 ${
					open ? "gap-x-[20vw]" : "gap-x-[37vw]"
				}`}
			>
				<h1 className="text-3xl font-semibold text-green-700">Winners</h1>
				<h1 className="text-3xl font-semibold text-red-700">Losers</h1>
				<div className="grid grid-cols-2 grid-rows-2 ">
					<NewsCard
						companyName="Apple"
						stockTrend={23}
					/>
					<NewsCard
						companyName="Starbucks"
						stockTrend={12}
					/>
					<NewsCard
						companyName="Meta"
						stockTrend={76}
					/>
					<NewsCard
						companyName="Google"
						stockTrend={56}
					/>
				</div>
				<div className="grid grid-cols-2 grid-rows-2">
					<NewsCard
						companyName="Berkshir Hathaway"
						stockTrend={-23}
					/>
					<NewsCard
						companyName="Lemon Brothers"
						stockTrend={-100}
					/>
					<NewsCard
						companyName="Nokia"
						stockTrend={-12}
					/>
					<NewsCard
						companyName="Jaguar"
						stockTrend={-34}
					/>
				</div>
			</div>
			<form
				onSubmit={handleSubmit(createPortfolioCompany)}
				className="flex min-w-96 flex-col justify-center mt-5 gap-y-4"
			>
				<Input
					type="text"
					placeholder="Search for a company"
					className="w-1/3 mx-auto px-5 py-5"
					{...register("ticker_name")}
				/>
				<Input
					type="number"
					placeholder="Money Invested"
					className="w-1/5 mx-auto px-5 py-5"
					{...register("investment_amount")}
				/>
				<Button className="mx-auto w-2/12 py-5 font-semibold">
					Invest
				</Button>
				{companyPortfolioCards.map((card, index) => (
					<button
						key={index * card.companyName.length}
						className="w-full mx-auto"
					>
						<CompanyPortfolioCard
							companyName={card.companyName}
							stockSentiment={card.stockSentiment}
							moneyInvested={card.moneyInvested}
							sentiment={card.sentiment}
						/>
					</button>
				))}
			</form>
		</>
	);
};

export default News;
