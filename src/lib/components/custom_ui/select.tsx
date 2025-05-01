import { ControllerRenderProps } from "react-hook-form";
import { FormControl } from "../ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { cn } from "@/lib/utils";
import { FormItemUI } from "./form";
import { Dispatch, SetStateAction } from "react";


type SelectUIItemT = {
	label: string;
	value: string;
};

type SelectUIPropsT = {
	items: SelectUIItemT[];
	label?: string;
	description?: string;
	placeholder?: string;
	className?: string;
	wrapperClassName?: string;
	value: string;
	setValue: Dispatch<SetStateAction<string>>;
};
export const SelectUI = ({ items, label, description, placeholder, className = "", wrapperClassName = "", value, setValue = () => { } }: SelectUIPropsT) => {
	return (
		<div className={`flex flex-col gap-1 ${wrapperClassName}`}>
			{label && <label className="text-sm">{label}</label>}
			<Select value={value} onValueChange={setValue}>
				<SelectTrigger className={cn(
					"w-full",
					className,
				)}>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{items.map((item) => (
							<SelectItem key={item.value} value={item.value}>
								{item.label}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
			{description && <p className="text-sm text-muted-foreground -mt-1">{description}</p>}
		</div>
	)
}

type SelectFormUIPropsT = {
	field: ControllerRenderProps<any>;
	items: SelectUIItemT[];
	label?: string;
	description?: string;
	placeholder?: string;
	className?: string;
	wrapperClassName?: string;
	onChange?: Dispatch<SetStateAction<string>>;
};
export const SelectFormUI = ({ field, items, label, description, placeholder, className = "", wrapperClassName = "", onChange = () => { } }: SelectFormUIPropsT) => {
	return (
		<FormItemUI withoutFormControl label={label} description={description} className={wrapperClassName}>
			<Select onValueChange={(v) => {
				field.onChange(v);
				onChange(v);
			}} defaultValue={field.value}>
				<FormControl>
					<SelectTrigger className={cn(
						"w-full",
						className,
					)}>
						<SelectValue placeholder={placeholder} />
					</SelectTrigger>
				</FormControl>
				<SelectContent>
					<SelectGroup>
						{items.map((item) => (
							<SelectItem key={item.value} value={item.value}>
								{item.label}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</FormItemUI>
	)
}
