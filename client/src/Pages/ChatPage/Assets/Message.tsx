import React from "react";

interface MessageProps {
	message: string;
	type: "sender" | "receiver" | "system";
}

const Message: React.FC<MessageProps> = ({ message, type }) => {
	if (type === "sender") {
		return (
			<div className="bg-stone-700 p-4 w-3/4 rounded-lg mb-2 max-w-max self-end">
				<p className="text-base text-white break-words">{message}</p>
			</div>
		);
	} else if (type === "receiver") {
		return (
			<div className="bg-gray-200 p-4 w-3/4 rounded-lg mb-2 max-w-max self-start">
				<p className="text-base text-gray-900 break-words">{message}</p>
			</div>
		);
	} else {
		return (
			<div className="bg-yellow-100 text-yellow-800 p-2 w-3/4 rounded-lg mb-2 max-w-max mx-auto">
				<p className="text-sm text-center break-words">{message}</p>
			</div>
		);
	}
};

export default Message;
