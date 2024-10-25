import { useState } from "react";
import ChatBot from "./Part/Chatbot/chatbot";
import bot from "./Part/Chatbot/Assets/bot.svg";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
	const [OpenChat, setOpenChat] = useState<boolean>(false);

	const propFnc = () => {
		setOpenChat(false);
	};
	return (
		<SidebarProvider>
			<AppSidebar />
			<main>
				<SidebarTrigger />
				<Outlet />
			</main>
			<div className="fixed bottom-[5%] right-[3%] h-[90vh] w-[480px] z-[2000]">
				{OpenChat && <ChatBot propFnc={propFnc} />}
				{!OpenChat && (
					<img
						src={bot}
						onClick={() => setOpenChat(true)}
						alt="Chatbot Icon"
						className="fixed bottom-[5%] right-[3%] h-[50px] w-[50px] z-[2000] cursor-pointer"
					/>
				)}
			</div>
		</SidebarProvider>
	);
}
