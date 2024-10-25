import * as React from "react";
import { GalleryVerticalEnd } from "lucide-react";

import { NavMain } from "@/components/nav-main";
// import { SidebarOptInForm } from "@/components/sidebar-opt-in-form";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";

const data = {
	navMain: [
		{
			title: "News",
			url: "/pulse",
			items: [
				{
					title: "Newsletter",
					url: "/pulse/component",
				},
				{
					title: "Project Structure",
					url: "/",
				},
			],
		},
		{
			title: "Learning",
			url: "#",
			items: [
				{
					title: "Text",
					url: "#",
				},
				{
					title: "YouTube",
					url: "#",
				},
				{
					title: "Gen. AI Video",
					url: "#",
				},
			],
		},
		{
			title: "Investment ",
			url: "#",
			items: [
				{
					title: "Community",
					url: "#",
				},
				{
					title: "Back Test",
					url: "#",
				},
			],
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							size="lg"
							asChild
						>
							<a href="#">
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
									<GalleryVerticalEnd className="size-4" />
								</div>
								<div className="flex flex-col gap-0.5 leading-none">
									<span className="font-semibold">Navbar</span>
								</div>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
			</SidebarContent>
			<SidebarFooter></SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
