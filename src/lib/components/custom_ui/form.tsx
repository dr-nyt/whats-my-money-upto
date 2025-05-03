"use client";

import { ReactNode } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { CircleNotch } from "@mynaui/icons-react";

type FormUIPropsT = {
	form: UseFormReturn<any, any, any>;
	children?: ReactNode;
	onSubmit?: (values: z.infer<any>) => void;
	submitButtonText?: string;
	className?: string;
	withoutSubmitButton?: boolean;
	disabled?: boolean;
	isLoading?: boolean;
}
export const FormUI = ({ form, children, onSubmit = () => { }, submitButtonText = "Submit", className = "", withoutSubmitButton = false, disabled = false, isLoading = false }: FormUIPropsT) => {
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className={className}>
				{children}
				{!withoutSubmitButton && <Button type="submit" disabled={disabled || isLoading}>
					{isLoading ? <CircleNotch className="animate-spin" /> : submitButtonText}
				</Button>}
			</form>
		</Form>
	)
}

type FromItemUIPropsT = {
	label?: ReactNode;
	description?: string;
	children?: ReactNode;
	withoutFormControl?: boolean;
	optional?: boolean;
	className?: string;
}
export const FormItemUI = ({ label, description, children, withoutFormControl = false, optional = false, className = "" }: FromItemUIPropsT) => {
	return <FormItem className={className}>
		{label && <FormLabel>{label} {optional && <Badge variant="secondary" className="font-light">Optional</Badge>}</FormLabel>}
		{withoutFormControl ? children : <FormControl>{children}</FormControl>}
		{description && <FormDescription className="-mt-1">{description}</FormDescription>}
		<FormMessage className={`${description ? "-mt-2" : "-mt-1"}`} />
	</FormItem>
}
