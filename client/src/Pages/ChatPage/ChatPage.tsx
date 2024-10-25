import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import Message from "./Assets/Message.tsx";

interface Message {
	message: string;
}

// JSON.parse(localStorage.getItem("user")!).username;

const ChatPage: React.FC = () => {
	const endOfChatRef = useRef<HTMLDivElement | null>(null);
	const { open } = useSidebar();
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState<string>("");
	const [socket, setSocket] = useState<WebSocket | null>(null);

	const handleSendMessage = () => {
		if (socket && input.trim()) {
			const newMessage: Message = { message: input };
			socket.send(JSON.stringify(newMessage));
			setMessages((messages) => [...messages, newMessage]);
			setInput("");
		}
	};

	useEffect(() => {
		const wsServer = import.meta.env.VITE_WS_HOST;
		const socketInstance = new WebSocket(wsServer);
		setSocket(socketInstance);

		socketInstance.onmessage = function (event) {
			console.log("Message from server ", event.data);
			const data = JSON.parse(event.data);
			const newMessage: Message = { message: data.message };
			setMessages((prevMessages) => [...prevMessages, newMessage]);
		};

		socketInstance.onerror = function (event) {
			console.log("Error ", event);
		};

		socketInstance.onopen = function (event) {
			console.log("Connected to server ", event);
		};

		socketInstance.onclose = function (event) {
			console.log("Disconnected from server ", event);
		};

		return () => {
			socketInstance.close();
		};
	}, []);

	useEffect(() => {
		if (endOfChatRef.current) {
			(endOfChatRef.current as HTMLElement).scrollIntoView({
				behavior: "smooth",
			});
		}
	}, [messages]);

	return (
		<div
			className={`grid place-items-center h-[96vh] ${
				open ? "w-[82vw]" : "w-screen"
			}`}
		>
			<div className="flex flex-col justify-center h-full w-full p-4">
				<div className="flex flex-col-reverse flex-1 overflow-y-auto mb-4 p-4 bg-gray-100 rounded shadow">
					{/* {messages.map((message, index) => (
						<div
							key={index}
							className="mb-2"
						>
							<strong>{message.user}:</strong> {message.text}
						</div>
					))} */}
					<div className="bg-stone-700 p-4 w-3/4 rounded-lg mb-2 max-w-max self-end">
						<p className="text-base text-white break-words">
							{"message"}
						</p>
					</div>
					<div className="bg-gray-200 p-4 w-3/4 rounded-lg mb-2 max-w-max self-start">
						<p className="text-base text-gray-900 break-words">
							{"message"}
						</p>
					</div>
					<div ref={endOfChatRef} />
				</div>
				<div className="flex">
					<Button
						onClick={handleSendMessage}
						className="rounded-l h-full"
					>
						Send
					</Button>
					<input
						type="text"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
						placeholder="Type your message..."
						className="flex-1 p-2 border rounded-l"
					/>
				</div>
			</div>
		</div>
	);
};

export default ChatPage;
