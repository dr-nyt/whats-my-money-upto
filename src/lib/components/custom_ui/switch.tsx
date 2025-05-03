"use client";

import { ControllerRenderProps } from "react-hook-form";
import { Switch } from "../ui/switch";
import { FormItemUI } from "./form";
import { ReactNode } from "react";

type SwitchFormUIPropsT = {
	field: ControllerRenderProps<any>;
	label?: ReactNode;
	description?: string;
	className?: string;
	disabled?: boolean;
	onClick?: (checked: boolean) => void;
}
export function SwitchFormUI({ field, label, description, className, disabled, onClick = () => { } }: SwitchFormUIPropsT) {
	return (
		<FormItemUI label={label} description={description} className={className}>
			<Switch
				checked={field.value}
				onCheckedChange={(v) => {
					field.onChange(v)
					onClick(v)
				}}
				disabled={disabled}
				aria-readonly={disabled}
			/>
		</FormItemUI>
	)
}
