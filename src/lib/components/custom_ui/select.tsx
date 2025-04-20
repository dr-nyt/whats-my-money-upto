import { ControllerRenderProps } from "react-hook-form";
import { FormControl } from "../ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { cn } from "@/lib/utils";


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
	placeholder?: string;
	className?: string;
};
export const SelectFormUI = ({ field, items, placeholder, className }: SelectFormUIPropsT) => {
	return (
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
	)
}
