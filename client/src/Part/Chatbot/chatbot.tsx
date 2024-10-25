import React, { useState } from "react";
import styles from "./ChatBot.module.css";
// import bot from "./assets/bot.svg";
// import send from "./assets/send.png";
import { SendHorizontal, BotMessageSquare } from "lucide-react";
// import user from "./assets/user.png";
import cancel from "./assets/cancel.svg";
import axios, { AxiosResponse } from "axios";

interface Message {
	text: string;
	sender: "user" | "bot";
}

interface ChatResponse {
	success: boolean;
	answer: string;
}

const ChatBot: React.FC<{ propFnc: () => void; OpenChat: boolean }> = ({
	propFnc,
	OpenChat,
}) => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState<string>("");

	const handleSendMessage = async () => {
		const obj: Message = {
			text: input,
			sender: "user",
		};

		setMessages((prev) => [...prev, obj]);

		const objToSend = {
			external_user_id: JSON.parse(localStorage.getItem("user")!).username,
			query: input,
		};

		try {
			const response: AxiosResponse<ChatResponse> = await axios.post(
				"http://localhost:8000/chat",
				objToSend,
			);

			// Check if response was successful and update the message accordingly
			if (response.data.success) {
				obj.text = response.data.answer;
			} else {
				obj.text = "ERROR: Unable to get a valid response.";
			}
		} catch (error) {
			console.error("Error sending message:", error);
			obj.text = "ERROR: Something went wrong.";
		} finally {
			// Update state with bot response
			obj.sender = "bot";
			setMessages((prev) => [...prev, obj]);
		}
	};

	return (
		<div
			className={styles.chatbot}
			style={{ display: OpenChat ? "flex" : "none" }}
		>
			<div className={styles.header}>
				<div>
					<BotMessageSquare
						color="white"
						size={"30px"}
					/>
					<h4>Chat with Us</h4>
				</div>
				<button
					onClick={propFnc}
					className="cursor-pointer"
					aria-label="Cancel"
				>
					<img
						src={cancel}
						alt="cancelBtn"
					/>
				</button>
			</div>
			<div className={styles.messages}>
				{messages.map((msg, index) => (
					<div
						key={index + msg.sender}
						className={styles[msg.sender]}
					>
						{msg.text}
					</div>
				))}
			</div>
			<div className={styles.inputArea}>
				<div className={styles.input}>
					<input
						type="text"
						placeholder="Type your Message Here..."
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={(event) =>
							event.key === "Enter" && handleSendMessage()
						}
					/>
					<button onClick={handleSendMessage}>
						<SendHorizontal />
					</button>
				</div>
			</div>
		</div>
	);
};

export default ChatBot;
