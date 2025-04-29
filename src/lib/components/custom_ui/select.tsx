import { ControllerRenderProps } from "react-hook-form";
import { FormControl } from "../ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { cn } from "@/lib/utils";
import { FormItemUI } from "./form";


type SelectUIItemT = {
	label: string;
	value: string;
};

type SelectUIPropsT = {
	items: SelectUIItemT[];
	placeholder?: string;
	className?: string;
};
export const SelectUI = ({ items, placeholder, className }: SelectUIPropsT) => {
	return (
		<Select>
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
	)
}

type SelectFormUIPropsT = {
	field: ControllerRenderProps<any>;
	items: SelectUIItemT[];
	label?: string;
	description?: string;
	placeholder?: string;
	className?: string;
};
export const SelectFormUI = ({ field, items, label, description, placeholder, className }: SelectFormUIPropsT) => {
	return (
		<FormItemUI withoutFormControl label={label} description={description}>
			<Select onValueChange={field.onChange} defaultValue={field.value}>
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
