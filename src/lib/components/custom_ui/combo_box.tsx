"use client";
import { useState } from "react";
import { Popover, PopoverTrigger } from "../ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { PopoverContent } from "@radix-ui/react-popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { cn } from "../../utils";
import { Button } from "../ui/button";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { FormControl } from "../ui/form";

type ComboboxUIItemT = {
	label: string;
	value: string;
}
type ComboboxUIPropsT = {
	items: ComboboxUIItemT[];
	itemName?: string;
}
export function ComboBoxUI({ itemName, items }: ComboboxUIPropsT) {
	const [open, setOpen] = useState(false)
	const [value, setValue] = useState("")

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-[200px] justify-between"
				>
					{value
						? items.find((item) => item.value === value)?.label
						: itemName ? `Select ${itemName}...` : "None"}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandInput placeholder={`Search`} />
					<CommandList>
						<CommandEmpty>No framework found.</CommandEmpty>
						<CommandGroup>
							{items.map((item) => (
								<CommandItem
									key={item.value}
									value={item.value}
									onSelect={(currentValue) => {
										setValue(currentValue === value ? "" : currentValue)
										setOpen(false)
									}}
								>
									<Check
										className={cn(
											"mr-2 h-4 w-4",
											value === item.value ? "opacity-100" : "opacity-0"
										)}
									/>
									{item.label}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}

type ComboBoxFormUIPropsT = {
	form: UseFormReturn<any>;
	field: ControllerRenderProps<any>;
	items: ComboboxUIItemT[];
	itemName?: string;
}
export function ComboBoxFormUI({ form, field, items, itemName }: ComboBoxFormUIPropsT) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<FormControl>
					<Button
						variant="outline"
						role="combobox"
						className={cn(
							"w-[200px] justify-between",
							!field.value && "text-muted-foreground"
						)}
					>
						{field.value
							? items.find(
								(item) => item.value === field.value
							)?.label
							: itemName ? `Select ${itemName}...` : "None"}
						<ChevronsUpDown className="opacity-50" />
					</Button>
				</FormControl>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandInput
						placeholder={`Search`}
						className="h-9"
					/>
					<CommandList>
						<CommandEmpty>No framework found.</CommandEmpty>
						<CommandGroup>
							{items.map((item) => (
								<CommandItem
									value={item.label}
									key={item.value}
									onSelect={() => {
										form.setValue(field.name, item.value)
									}}
								>
									{item.label}
									<Check
										className={cn(
											"ml-auto",
											item.value === field.value
												? "opacity-100"
												: "opacity-0"
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
