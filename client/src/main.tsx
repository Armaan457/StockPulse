import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Component } from "./App.tsx";
import Navbar from "./Pages/Navbar";
import Landing from "./Pages/Landing";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import News from "./Pages/News";
import Layout from "./LandingLayout.tsx";
import Error from "./Pages/Error.tsx";
// import Page from "./app/dashboard/page.tsx";

const router = createBrowserRouter([
	{
		path: "/",
		errorElement: <Error />,

		element: (
			<div className="bg-stone-100 min-h-screen">
				<Navbar />
				<Landing />
			</div>
		),
	},
	{
		path: "/pulse",
		element: <Layout />,
		errorElement: <Error />,
		children: [
			{
				index: true,
				element: <News />,
			},
			{
				path: "component",
				element: <Component />,
			},
		],
	},
]);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>,
);
