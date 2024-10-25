import logo from "/stockPulseLogo.png";
import { Button } from "@/components/ui/button";

const Navbar = () => {
	return (
		<nav className="flex justify-between items-center px-16">
			<img
				src={logo}
				alt="logo"
				className="h-24"
			/>
			<Button
				className="mb-5"
				variant={"default"}
			>
				Login/Sign Up
			</Button>
		</nav>
	);
};

export default Navbar;
