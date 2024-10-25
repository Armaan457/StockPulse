import React, { useState } from "react";
import styles from "./ChatBot.module.css";
import bot from "./assets/bot.svg";
import send from "./assets/send.png";
// import user from "./assets/user.png";
import cancel from "./assets/cancel.svg";

interface Message {
	text: string;
	sender: "user" | "bot";
}

const ChatBot: React.FC<{ propFnc: () => void }> = ({ propFnc }) => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState<string>("");

	const handleSendMessage = async () => {
		setMessages((prev) => [...prev, { text: input, sender: "user" }]);
		setInput("");
	};

	return (
		<div className={styles.chatbot}>
			<div className={styles.header}>
				<div>
					<img
						src={bot}
						alt="chatBot"
					/>
					<h4>Chat with Us</h4>
				</div>
				<img
					onClick={propFnc}
					className="cursor-pointer"
					src={cancel}
					alt="cancelBtn"
				/>
			</div>
			<div className={styles.messages}>
				{messages.map((msg, index) => (
					<div
						key={index}
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
						onKeyPress={(event) =>
							event.key === "Enter" && handleSendMessage()
						}
					/>
					<button onClick={handleSendMessage}>
						<img
							src={send}
							alt="sendMessageButton"
						/>
					</button>
				</div>
			</div>
		</div>
	);
};

export default ChatBot;
