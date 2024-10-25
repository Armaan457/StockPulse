import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import Message from "./Assets/Message.tsx";

interface Message {
	message: string;
}

interface ChatMessage {
	message: string;
	type: "sender" | "receiver";
}

// JSON.parse(localStorage.getItem("user")!).username;

const ChatPage: React.FC = () => {
	const endOfChatRef = useRef<HTMLDivElement | null>(null);
	const { open } = useSidebar();
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [input, setInput] = useState<string>("");
	const [socket, setSocket] = useState<WebSocket | null>(null);

	const handleSendMessage = () => {
		if (socket && input.trim()) {
			const inputMessage: Message = { message: input };
			const newMessage: ChatMessage = { message: input, type: "sender" };
			socket.send(JSON.stringify(inputMessage));
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
			const newMessage: ChatMessage = {
				message: data.message,
				type: "receiver",
			};
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
			className={`grid place-items-center h-[93vh] overflow-hidden ${
				open ? "w-[82vw]" : "w-screen"
			}`}
		>
			<div className="flex flex-col justify-center h-full w-full p-4">
				<div className="flex flex-col-reverse flex-1 overflow-y-auto mb-4 p-4 bg-gray-100 rounded shadow">
					{messages.map((message, index) => (
						<Message
							message={message.message}
							type={message.type}
							key={message.message.length * index}
						/>
					))}
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
