"use client";

import { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

type TooltipUIPropsT = {
	content: ReactNode;
	children: ReactNode;
	className?: string;
	side?: "top" | "bottom" | "left" | "right";
	sideOffset?: number;
}
export default function TooltipUI({ content, children, className = "", side = "bottom", sideOffset = 5 }: TooltipUIPropsT) {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger>{children}</TooltipTrigger>
				<TooltipContent className={className} side={side} sideOffset={sideOffset}>
					{content}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
