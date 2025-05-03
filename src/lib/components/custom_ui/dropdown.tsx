import { ReactNode } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "../ui/dropdown-menu"


type DropDownContentT = {
	label?: string;
	items: {
		label: string;
		action?: () => void;
		disabled?: boolean;
		shortcut?: ReactNode;
		variant?: "default" | "destructive";
		className?: string;
	}[];
}
type DropDownUIPropsT = {
	children: ReactNode;
	content: DropDownContentT[];
	asChild?: boolean;
	side?: "top" | "bottom" | "left" | "right";
	sideOffset?: number;
}
export const DropDownUI = ({ children, asChild = true, content, side = "bottom", sideOffset = 5 }: DropDownUIPropsT) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild={asChild} className="cursor-pointer">
				{children}
			</DropdownMenuTrigger>
			<DropdownMenuContent side={side} sideOffset={sideOffset}>
				{content.map((item, index) =>
					<div key={index}>
						{item.label && <>
							<DropdownMenuLabel className="font-bold">{item.label}</DropdownMenuLabel>
							<DropdownMenuSeparator />
						</>}
						{item.items.map((item2, index2) =>
							<DropdownMenuItem key={index2} onClick={item2.action} disabled={item2.disabled} variant={item2.variant} className={`
								${item2.variant !== "destructive" ? "hover:bg-zinc-800" : "hover:bg-red-950"}
								${item2.action ? "cursor-pointer disabled:cursor-default" : ""}
								${item2.className ? item2.className : ""}
								`}>
								{item2.label}
								{item2.shortcut && <DropdownMenuShortcut>{item2.shortcut}</DropdownMenuShortcut>}
							</DropdownMenuItem>
						)}
						{index === (content.length - 1) ? null : <DropdownMenuSeparator />}
					</div>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
