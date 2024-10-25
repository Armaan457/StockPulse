import { useState } from "react";
import { Activity } from "lucide-react";
import logo from "/stockPulseLogo.png";
import { Button } from "@/components/ui/button";
import RegisterPage from "./Pages/RegisterPage.tsx";
import LoginForm from "./Pages/LoginPage.tsx";

const MainLandingPage = () => {
	const [opaque, setOpaque] = useState<boolean>(false);
	const [login, setLogin] = useState<boolean>(false);

	const handleSwitchToLogin = () => setLogin(true);
	const handleSwitchToRegister = () => setLogin(false);
	const handleLogin = () => setOpaque((prev) => !prev);

	return (
		<>
			<div
				className={`bg-stone-100 min-h-screen ${
					opaque ? "opacity-25" : ""
				}`}
			>
				<nav className="flex justify-between items-center px-16">
					<img
						src={logo}
						alt="logo"
						className="h-24"
					/>
					<div>
						<Button
							className="mb-5"
							variant={"default"}
							onClick={handleLogin}
						>
							Login/Sign Up
						</Button>
					</div>
				</nav>
				<section className="flex flex-col gap-y-8 items-center text-center mt-16">
					<h1 className="text-6xl max-w-3xl">
						Lorem ipsum dolor, sit amet consectetur adipisicing elit.
					</h1>
					<h3 className="text-xl max-w-xl">
						Quisquam, voluptates. Quisquam, voluptates. Consequuntur
						asperiores non enim. Consequuntur asperiores non enim.
					</h3>
					<Button
						className="mb-5 max-w-max text-base"
						variant={"default"}
					>
						<Activity />
						Get Started
					</Button>
				</section>{" "}
			</div>
			<div
				className={`fixed inset-0 flex items-center justify-center ${
					opaque ? "" : "hidden opacity-0"
				}`}
			>
				<div className="bg-white p-4 rounded-md shadow-lg min-w-[500px]">
					{!login ? (
						<RegisterPage handleSwitchToLogin={handleSwitchToLogin} />
					) : (
						<LoginForm handleSwitchToRegister={handleSwitchToRegister} />
					)}
				</div>
			</div>
		</>
	);
};

export default MainLandingPage;
