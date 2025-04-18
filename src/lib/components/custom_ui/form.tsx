"use client";

import { ReactNode } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Button } from "../ui/button";

type FormUIPropsT = {
	form: UseFormReturn<any, any, any>;
	children?: ReactNode;
	onSubmit?: (values: z.infer<any>) => void;
	submitButtonText?: string;
	className?: string;
}
export const FormUI = ({ form, children, onSubmit = () => { }, submitButtonText = "Submit", className = "" }: FormUIPropsT) => {
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className={className}>
				{children}
				<Button type="submit">{submitButtonText}</Button>
			</form>
		</Form>
	)
}

type FromItemUIPropsT = {
	label?: string;
	description?: string;
	children?: ReactNode;
	withoutFormControl?: boolean;
}
export const FormItemUI = ({ label, description, children, withoutFormControl = false }: FromItemUIPropsT) => {
	return <FormItem>
		{label && <FormLabel>{label}</FormLabel>}
		{withoutFormControl ? children : <FormControl>{children}</FormControl>}
		{description && <FormDescription className="-mt-1">{description}</FormDescription>}
		<FormMessage className="-mt-2" />
	</FormItem>
}
