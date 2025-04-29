"use client";
import { ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { FormUI } from "./form";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";

type DialogUIPropsT = {
	trigger: ReactNode;
	triggerAsChild?: boolean;
	className?: string;
	title?: string;
	description?: string;
	children?: ReactNode;
	footerChildren?: ReactNode;
}
export function DialogUI({ trigger, triggerAsChild = true, className = "", title, description, children, footerChildren }: DialogUIPropsT) {
	return (
		<Dialog>
			<DialogTrigger asChild={triggerAsChild}>
				{trigger}
			</DialogTrigger>
			<DialogContent className="flex flex-col gap-8 max-h-[100vh]">
				{(title || description) &&
					<DialogHeader>
						{title && <DialogTitle>{title}</DialogTitle>}
						{description && <DialogDescription>{description}</DialogDescription>}
					</DialogHeader>
				}
				<div className={`overflow-auto flex flex-col gap-4 py-2 pr-2 ${className}`}>
					{children}
				</div>
				{footerChildren && <DialogFooter>{footerChildren}</DialogFooter>}
			</DialogContent>
		</Dialog>
	);
}

type DialogFormUIPropsT = {
	form: UseFormReturn<any, any, any>;
	trigger: ReactNode;
	triggerAsChild?: boolean;
	className?: string;
	title?: string;
	description?: string;
	children?: ReactNode;
	onSubmit?: (values: z.infer<any>) => void;
	submitButtonText?: string;
	footerChildren?: ReactNode;
}
export function DialogFormUI({ form, trigger, triggerAsChild = true, className = "", title, description, children, onSubmit = () => { }, submitButtonText = "Submit", footerChildren }: DialogFormUIPropsT) {
	return (
		<Dialog onOpenChange={(open) => !open && form.reset()}>
			<DialogTrigger asChild={triggerAsChild}>
				{trigger}
			</DialogTrigger>
			<DialogContent className="max-h-[100vh]">
				<FormUI form={form} onSubmit={onSubmit} withoutSubmitButton className="flex flex-col gap-8 max-h-[90vh]">
					{(title || description) &&
						<DialogHeader>
							{title && <DialogTitle>{title}</DialogTitle>}
							{description && <DialogDescription>{description}</DialogDescription>}
						</DialogHeader>
					}
					<div className={`overflow-auto flex flex-col gap-4 py-2 pr-2 ${className}`}>
						{children}
					</div>
					<DialogFooter className="flex justify-between items-center">
						{footerChildren && footerChildren}
						<Button type="submit">{submitButtonText}</Button>
					</DialogFooter>
				</FormUI>
			</DialogContent>
		</Dialog>
	);
}
