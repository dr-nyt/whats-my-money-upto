"use client";
import { HTMLInputTypeAttribute, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Eye } from "lucide-react";
import { Calendar as CalendarIcon, EyeSlash } from "@mynaui/icons-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { addDays, format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { FormControl } from "../ui/form";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { Matcher } from "react-day-picker";
import { FormItemUI } from "./form";

type PasswordInputUIPropsT = {
	id?: string;
	label?: string;
	description?: string;
	required?: boolean;
	placeholder?: string;
}
export const PasswordInputUI = ({ id = "password", label = "password", description, required = true, placeholder = "" }: PasswordInputUIPropsT) => {
	const [showPassword, setShowPassword] = useState(false);

	return <div className="flex flex-col gap-1">
		<label htmlFor={id} className="text-sm">{label}</label>
		<div className="flex gap-1">
			<Input id={id} name={id} type={showPassword ? "text" : "password"} className="px-2 py-1" required={required} placeholder={placeholder} />
			<Button variant="ghost" size="icon" type="button" className="cursor-pointer" onClick={() => setShowPassword(v => !v)}>
				{showPassword ? <Eye /> : <EyeSlash />}
			</Button>
		</div>
	</div>
}

type InputFormUIPropsT = {
	field: ControllerRenderProps<any>;
	label?: string;
	description?: string;
	type?: HTMLInputTypeAttribute;
	placeholder?: string;
	className?: string;
}
export const InputFormUI = ({ field, label, description, type, placeholder, className }: InputFormUIPropsT) => {
	return (
		<FormItemUI label={label} description={description}>
			<Input className={className} type={type} placeholder={placeholder} {...field} />
		</FormItemUI>
	)
}

type DatePickerFormUIPropsT = {
	form: UseFormReturn<any>;
	field: ControllerRenderProps<any>;
	label?: string;
	description?: string;
	presets?: { label: string; value: number }[];
	buttonClassName?: string;
	contentClassName?: string;
	defaultDateFn?: () => Date;
	disabledDatesFn?: Matcher | Matcher[];
	placeholder?: string;
}
export function DatePickerFormUI({ form, field, label, description, presets = [], buttonClassName = "", contentClassName = "", defaultDateFn, disabledDatesFn, placeholder = "" }: DatePickerFormUIPropsT) {
	useEffect(() => {
		if (defaultDateFn)
			setTimeout(() => form.setValue(field.name, defaultDateFn()), 500);
	}, []);

	return (
		<FormItemUI withoutFormControl label={label} description={description}>
			<Popover>
				<PopoverTrigger asChild>
					<FormControl>
						<Button
							variant={"outline"}
							className={cn(
								buttonClassName,
								"pl-3 font-normal",
								!field.value && "text-muted-foreground"
							)}
						>
							{field.value ? (
								format(field.value, "PPP 'at' HH:mm O")
							) : (
								<span>{placeholder}</span>
							)}
							<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
						</Button>
					</FormControl>
				</PopoverTrigger>
				<PopoverContent className={cn(contentClassName, "w-auto p-0")} align="start">
					{(presets && !!presets.length) &&
						<div className="m-1">
							<Select onValueChange={(value) =>
								form.setValue(field.name, addDays(new Date(), parseInt(value)))
							}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select Preset Dates" />
								</SelectTrigger>
								<SelectContent position="popper">
									{presets.map((preset) => (
										<SelectItem key={preset.label + preset.value} value={preset.value.toString()}>{preset.label}</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					}
					<div className={`${(presets && !!presets.length) ? "rounded-md border-t" : ""}`}>
						<Calendar
							mode="single"
							selected={field.value}
							onSelect={field.onChange}
							disabled={disabledDatesFn}
							initialFocus
						/>
					</div>
				</PopoverContent>
			</Popover>
		</FormItemUI>
	)
}
