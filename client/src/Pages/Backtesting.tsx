import React, { useState } from "react";
import { useForm } from "react-hook-form";
import SingleLineChart from "@/Part/SingleLineChart";

const Backtesting: React.FC = () => {
	const { register, handleSubmit } = useForm();

	const [numCompanies, setNumCompanies] = useState(0);
	const [showGraph, setShowGraph] = useState(false);
	const [chartData, setChartData] = useState([]);

	const onSubmit = (data: any) => {
		console.log(data);
		setShowGraph(true);
		setChartData(data.companies);
	};

	const onSubmitNumberOfCompanies = (data: any) => {
		console.log(data);
		setNumCompanies(parseInt(data.numCompanies, 10));
	};

	return (
		<div className="bg-cream min-h-screen p-8">
			<h1 className="text-dark text-2xl mb-4">Backtesting</h1>
			<form onSubmit={handleSubmit(onSubmitNumberOfCompanies)}>
				<label
					htmlFor="numCompanies"
					className="block text-dark mb-2"
				>
					Number of Companies:
				</label>
				<input
					type="number"
					id="numCompanies"
					className="border border-dark p-2 w-full rounded-md"
					{...register("numCompanies")}
				/>
				<button
					type="submit"
					className="px-3 py-2 text-white bg-stone-700 rounded-md mt-4 hover:bg-stone-600"
				>
					Submit number of Companies
				</button>
			</form>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className={`space-y-5 mt-4`}
			>
				{Array.from({ length: numCompanies }).map((_, index) => (
					<div
						key={index * 23}
						className="space-y-2"
					>
						<div>
							<label
								htmlFor={`companies.${index}.name`}
								className="block text-dark mb-2"
							>
								Company Name:
							</label>
							<input
								{...register(`companies.${index}.name` as const)}
								className="border border-dark p-2 w-full"
								id={`companies.${index}.name`}
							/>
						</div>
						<div>
							<label
								htmlFor={`companies.${index}.value`}
								className="block text-dark mb-2"
							>
								Value Invested:
							</label>
							<input
								type="number"
								{...register(`companies.${index}.value` as const)}
								className="border border-dark p-2 w-full"
								id={`companies.${index}.value`}
							/>
						</div>
					</div>
				))}
				{numCompanies > 0 && (
					<button
						type="submit"
						className="bg-stone-700 hover:bg-stone-600 rounded-md px-3 py-2 text-white p-2 mt-4"
					>
						Submit
					</button>
				)}
			</form>
			{showGraph && (
				<div className="max-w-lg">
					<SingleLineChart chartData={chartData} />
				</div>
			)}
		</div>
	);
};

export default Backtesting;
