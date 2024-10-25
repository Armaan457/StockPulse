import React, { useState, useEffect } from "react";
import styles from "./ChatBot.module.css";
// import bot from "./assets/bot.svg";
// import send from "./assets/send.png";
import { SendHorizontal, BotMessageSquare } from "lucide-react";
// import user from "./assets/user.png";
import cancel from "./assets/cancel.svg";

interface Message {
	text: string;
	sender: "user" | "bot";
}

const ChatBot: React.FC<{ propFnc: () => void; OpenChat: boolean }> = ({
	propFnc,
	OpenChat,
}) => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState<string>("");

	const handleSendMessage = () => {};

	useEffect(() => {});

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
