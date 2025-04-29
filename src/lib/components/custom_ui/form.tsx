"use client";

import { ReactNode, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Eye, EyeSlash } from "@mynaui/icons-react";

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
		<FormMessage className={`${description ? "-mt-2" : "-mt-1"}`} />
	</FormItem>
}


type FormInputUIPropsT = {
	id?: string;
	label?: string;
	description?: string;
	required?: boolean;
	placeholder?: string;
}
export const FormPasswordInputUI = ({ id = "password", label = "password", description, required = true, placeholder = "" }: FormInputUIPropsT) => {
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
