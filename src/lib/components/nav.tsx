"use client";
import Image from "next/image";
import { DropDownUI } from "./custom_ui/dropdown";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { logout } from "@/app/auth/actions";
import { Logout } from "@mynaui/icons-react";
import { cGetUser } from "../supabase/client";
import { useEffect, useState } from "react";
// import logo from "./icons/logo.png";

export default function Nav() {
	const [name, setName] = useState("");

	useEffect(() => {
		cGetUser().then(user => {
			setName(user?.user_metadata.name);
		});
	}, []);

	return (
		<nav className="flex justify-between items-center px-4 py-2 border-b">
			<div className="flex items-center gap-4">
				<Image src="/icons/logo.png" alt="Logo" width={40} height={100} />
			</div>
			<div className="flex items-center gap-4">
				<DropDownUI content={[
					{
						label: name,
						items: [
							{
								label: "Profile",
							},
							{
								label: "Settings",
							},
						]
					},
					{
						items: [
							{
								label: "Logout",
								variant: "destructive",
								action: () => {
									logout();
								},
								shortcut: <Logout className="text-red-400" />
							}
						]
					}
				]}>
					<Avatar>
						<AvatarImage src="https://github.com/shadcn.png" />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
				</DropDownUI>
			</div>
		</nav>
	)
}
