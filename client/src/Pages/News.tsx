import { useState } from "react";
import NewsCard from "@/Part/NewsCard.tsx";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import CompanyPortfolioCard, {
	CompanyPortfolioCardProps,
} from "@/Part/CompanyPortfolioCard.tsx";

interface NewsData {
	companyName: string;
	moneyInvested: number;
}

const News = () => {
	const { open } = useSidebar();
	const { register, handleSubmit } = useForm<NewsData>();
	const [companyPortfolioCards, setCompanyPortfolioCards] = useState<
		CompanyPortfolioCardProps[]
	>([]);

	const onSubmit = (data: NewsData) => {
		console.log(data);
		setCompanyPortfolioCards((prev) => [
			...prev,
			{
				companyName: data.companyName,
				stockSentiment: Math.random() >= 0.5,
				moneyInvested: data.moneyInvested,
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
				onSubmit={handleSubmit(onSubmit)}
				className="flex min-w-96 flex-col justify-center mt-5 gap-y-4"
			>
				<Input
					type="text"
					placeholder="Search for a company"
					className="w-1/3 mx-auto px-5 py-5"
					{...register("companyName")}
				/>
				<Input
					type="number"
					placeholder="Money Invested"
					className="w-1/5 mx-auto px-5 py-5"
					{...register("moneyInvested")}
				/>
				<Button className="mx-auto w-2/12 py-5 font-semibold">
					Invest
				</Button>
				{companyPortfolioCards.map((card, index) => (
					<div
						key={index * card.companyName.length}
						className="w-5/12 mx-auto"
					>
						<CompanyPortfolioCard
							companyName={card.companyName}
							stockSentiment={card.stockSentiment}
							moneyInvested={card.moneyInvested}
						/>
					</div>
				))}
			</form>
		</>
	);
};

export default News;
