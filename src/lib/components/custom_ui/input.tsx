"use client";
import { Dispatch, HTMLInputTypeAttribute, SetStateAction, useEffect, useState } from "react";
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

type InputUIPropsT = {
	id?: string;
	label?: string;
	description?: string;
	type?: HTMLInputTypeAttribute;
	required?: boolean;
	placeholder?: string;
	className?: string;
	wrapperClassName?: string;
	disabled?: boolean;
	value?: string;
	setValue?: Dispatch<SetStateAction<string>>;
	symbol?: string;
	selectAllOnFocus?: boolean;
}
export const InputUI = ({ id = "", label = "", description, type = "text", required = false, placeholder = "", className = "", wrapperClassName = "", disabled, value, setValue = () => { }, symbol, selectAllOnFocus }: InputUIPropsT) => {
	const [showPassword, setShowPassword] = useState(false);

	return <div className={`flex flex-col gap-1 ${wrapperClassName}`}>
		{label && <label htmlFor={id} className="text-sm">{label}</label>}
		<div className="relative">
			{symbol && <span className="absolute top-1/2 -translate-y-1/2 right-2 text-sm">{symbol}</span>}
			<Input
				id={id} name={id} type={type} className={`${symbol ? `pr-[6ch]` : ""}  [&::-webkit-inner-spin-button]:appearance-none ${className}`}
				required={required} placeholder={placeholder} disabled={disabled}
				value={value} onChange={(e) => setValue(e.target.value)}
				onFocus={(e) => {
					if (selectAllOnFocus) e.target.select();
				}}
			/>
		</div>
		{description && <p className="text-sm text-muted-foreground -mt-1">{description}</p>}
	</div>
}

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
			<Input id={id} name={id} type={showPassword ? "text" : "password"} required={required} placeholder={placeholder} />
			<Button variant="ghost" size="icon" type="button" onClick={() => setShowPassword(v => !v)}>
				{showPassword ? <Eye /> : <EyeSlash />}
			</Button>
		</div>
		{description && <p className="text-sm text-muted-foreground -mt-1">{description}</p>}
	</div>
}

type InputFormUIPropsT = {
	field: ControllerRenderProps<any>;
	label?: string;
	description?: string;
	type?: HTMLInputTypeAttribute;
	placeholder?: string;
	className?: string;
	wrapperClassName?: string;
	symbol?: string;
	onChange?: Dispatch<SetStateAction<string>>;
	disabled?: boolean;
	selectAllOnFocus?: boolean;
}
export const InputFormUI = ({ field, label, description, type, placeholder, className = "", wrapperClassName = "", symbol = "", onChange = () => { }, disabled = false, selectAllOnFocus = false }: InputFormUIPropsT) => {
	useEffect(() => {
		if (onChange) onChange(field.value);
	}, [field.value]);

	return (
		<FormItemUI label={label} description={description} className={wrapperClassName}>
			<div className="relative">
				{symbol && <span className="absolute top-1/2 -translate-y-1/2 right-2 text-sm">{symbol}</span>}
				<Input
					className={`${symbol ? `pr-[6ch]` : ""} [&::-webkit-inner-spin-button]:appearance-none ${className}`}
					type={type} placeholder={placeholder} {...field} disabled={disabled}
					onFocus={(e) => {
						if (selectAllOnFocus) e.target.select();
					}}
				/>
			</div>
		</FormItemUI>
	)
}

type DatePickerFormUIPropsT = {
	form: UseFormReturn<any>;
	field: ControllerRenderProps<any>;
	label?: string;
	description?: string;
	presets?: { label: string; value: number }[];
	wrapperClassName?: string;
	buttonClassName?: string;
	contentClassName?: string;
	defaultDateFn?: () => Date;
	disabledDatesFn?: Matcher | Matcher[];
	placeholder?: string;
	onChange?: (date: Date) => void;
}
export function DatePickerFormUI({ form, field, label, description, presets = [], wrapperClassName = "", buttonClassName = "", contentClassName = "", defaultDateFn, disabledDatesFn, placeholder = "", onChange = () => { } }: DatePickerFormUIPropsT) {
	useEffect(() => {
		if (defaultDateFn)
			setTimeout(() => form.setValue(field.name, defaultDateFn()), 500);
	}, []);

	return (
		<FormItemUI withoutFormControl label={label} description={description} className={wrapperClassName}>
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
								format(field.value, "dd/MM/yyyy")
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
							onSelect={(date) => {
								form.clearErrors(field.name);
								form.setValue(field.name, date);
								if (date) onChange(date);
							}}
							disabled={disabledDatesFn}
							initialFocus
						/>
					</div>
				</PopoverContent>
			</Popover>
		</FormItemUI>
	)
}
