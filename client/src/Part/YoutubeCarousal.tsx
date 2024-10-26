import {
	Carousel,
	CarouselContent,
	CarouselNext,
	CarouselPrevious,
	CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState } from "react";
import axios from "axios";

const YtLink = function ({ url }: { url: string }) {
	return (
		<iframe
			width="100%"
			height="100%"
			src={url}
			title="YouTube video player"
			// frameBorder="0"
			referrerPolicy="strict-origin-when-cross-origin"
			allowFullScreen
		></iframe>
	);
};

const getEmberUrl = (uri: string): string => {
	const id = uri.split("=")[1];
	return `https://www.youtube.com/embed/${id}`;
};

// const arr: JSX.Element[] = [
// 	<YtLink
// 		key="b2MP5QGrYWU"
// 		url={getEmberUrl("https://www.youtube.com/watch?v=b2MP5QGrYWU")}
// 	/>,
// 	<YtLink
// 		key="jo94x4NN2Ms"
// 		url={getEmberUrl("https://www.youtube.com/watch?v=jo94x4NN2Ms")}
// 	/>,
// 	<YtLink
// 		key="gZ-Tfg4_gx0"
// 		url={getEmberUrl("https://www.youtube.com/watch?v=gZ-Tfg4_gx0")}
// 	/>,
// 	<YtLink
// 		key="enxM1qAdtjs"
// 		url={getEmberUrl("https://www.youtube.com/watch?v=enxM1qAdtjs")}
// 	/>,
// ];
const YoutubeCarousal = () => {
	const [arr, setArr] = useState<JSX.Element[]>();
	useEffect(() => {
		axios
			.get("")
			.then((data) => {
				data.map((val, index) => (
					<YtLink
						url={getEmberUrl(val)}
						key={val + index}
					/>
				));
			})
			.catch((err) => console.log(err));
	});
	return (
		<div className="flex justify-center items-center min-w-full">
			<Carousel
				className="w-11/12"
				opts={{
					align: "center",
					loop: true,
				}}
				plugins={[
					Autoplay({
						delay: 4000,
						stopOnMouseEnter: true,
						stopOnInteraction: false,
					}),
				]}
			>
				<CarouselPrevious />
				<CarouselContent>
					{arr.map((item, index) => (
						<CarouselItem
							className="max-w-lg min-h-64 flex-shrink-0"
							key={index + item.type.name}
						>
							{item}
						</CarouselItem>
					))}
				</CarouselContent>
				; <CarouselNext />
			</Carousel>
		</div>
	);
};

export default YoutubeCarousal;
