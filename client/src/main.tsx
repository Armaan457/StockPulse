import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Component } from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLandingPage from "./MainLandingPage.tsx";
import News from "./Pages/News";
import Layout from "./LandingLayout.tsx";
import Error from "./Pages/Error.tsx";
import YoutubeCarousal from "./Pages/YoutubeCarousal.tsx";
import LineGraph from "./Part/LineGraph/LineGraph.tsx";
import ChatPage from "./Pages/ChatPage/ChatPage.tsx";
// import Page from "./app/dashboard/page.tsx";

const router = createBrowserRouter([
	{
		path: "/",
		errorElement: <Error />,
		element: <MainLandingPage />,
	},
	{
		path: "/line-graph",
		element: <LineGraph />,
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
			{
				path: "yt-c",
				element: <YoutubeCarousal />,
			},
			{
				path: "line-graph",
				element: <LineGraph />,
			},
			{
				path: "chatPage",
				element: <ChatPage />,
			},
		],
	},
]);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>,
);
