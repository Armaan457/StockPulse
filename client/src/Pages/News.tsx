import { Component } from "../App.tsx";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";

import Autoplay from "embla-carousel-autoplay";

const arr: JSX.Element[] = [
	<Component />,
	<Component />,
	<Component />,
	<Component />,
	<Component />,
	<Component />,
];

const News = () => {
	return (
		<Carousel
			className=" mx-20"
			opts={{
				align: "center",
				loop: true,
			}}
			plugins={[
				Autoplay({
					delay: 1000,
					stopOnMouseEnter: true,
					stopOnInteraction: false,
				}),
			]}
		>
			<CarouselPrevious />
			<CarouselContent>
				{arr.map((item: JSX.Element, index: number) => (
					<CarouselItem
						key={index + item.type.name}
						className="max-w-lg flex-shrink-0"
					>
						{item}
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselNext />
		</Carousel>
	);
};

export default News;
