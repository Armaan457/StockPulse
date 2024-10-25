"use client";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { CircleX } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// 1. Define the form schema with Zod validation.
const formSchema = z.object({
	username: z
		.string()
		.min(2, { message: "Username must be at least 2 characters." })
		.max(50, { message: "Username cannot exceed 50 characters." }),
	password: z
		.string()
		.min(6, { message: "Password must be at least 6 characters." }),
});

type LoginFormProps = {
	readonly handleSwitchToRegister: () => void;
	readonly closeModal: () => void;
};

export default function LoginForm({
	handleSwitchToRegister,
	closeModal,
}: LoginFormProps) {
	// 2. Define the form with default values and resolver.
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	// 3. Define the submit handler.
	async function onSubmit(values: z.infer<typeof formSchema>) {
		await axios.post("http://127.0.0.1:8000/api/login/", values, {
			withCredentials: true,
		});

		localStorage.setItem("user", JSON.stringify(values));

		// You can handle form submission logic here (e.g., API call).
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="w-full mx-auto my-3 max-w-md p-8 rounded-lg shadow-lg bg-white space-y-6 relative"
			>
				<CircleX
					className=" absolute right-5 top-5 cursor-pointer"
					onClick={closeModal}
				/>
				<h2 className="text-[2.5rem] font-sans font-semibold text-center text-gray-700">
					Login
				</h2>

				{/* Username Field */}
				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Username</FormLabel>
							<FormControl>
								<Input
									placeholder="Enter your username"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Password Field */}
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input
									type="password"
									placeholder="Enter your password"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="text-right text-sm">
					Don&apos;t have an Account!{" "}
					<button
						className="text-red-600 font-semibold cursor-pointer hover:underline"
						onClick={handleSwitchToRegister}
					>
						Register
					</button>
				</div>
				{/* Submit Button */}
				<Button
					type="submit"
					className="w-full bg-black text-white py-2 mt-4 hover:bg-gray-700"
				>
					Register
				</Button>
			</form>
		</Form>
	);
}
