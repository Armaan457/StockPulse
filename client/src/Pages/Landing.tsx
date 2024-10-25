import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";

const Landing = () => {
	return (
		<section className="flex flex-col gap-y-8 items-center text-center mt-16">
			<h1 className="text-6xl max-w-3xl">
				Lorem ipsum dolor, sit amet consectetur adipisicing elit.
			</h1>
			<h3 className="text-xl max-w-xl">
				Quisquam, voluptates. Quisquam, voluptates. Consequuntur asperiores
				non enim. Consequuntur asperiores non enim.
			</h3>
			<Button
				className="mb-5 max-w-max text-base"
				variant={"default"}
			>
				<Activity />
				Get Started
			</Button>
		</section>
	);
};

export default Landing;
