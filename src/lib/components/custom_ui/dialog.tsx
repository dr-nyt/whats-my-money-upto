"use client";
import { ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { FormUI } from "./form";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

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
			<DialogContent className={className}>
				{(title || description) &&
					<DialogHeader>
						{title && <DialogTitle>{title}</DialogTitle>}
						{description && <DialogDescription>{description}</DialogDescription>}
					</DialogHeader>
				}
				{children}
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
}
export function DialogFormUI({ form, trigger, triggerAsChild = true, className = "", title, description, children, onSubmit = () => { }, submitButtonText = "Submit" }: DialogFormUIPropsT) {
	return (
		<Dialog onOpenChange={(open) => !open && form.reset()}>
			<DialogTrigger asChild={triggerAsChild}>
				{trigger}
			</DialogTrigger>
			<DialogContent>
				{(title || description) &&
					<DialogHeader>
						{title && <DialogTitle>{title}</DialogTitle>}
						{description && <DialogDescription>{description}</DialogDescription>}
					</DialogHeader>
				}
				<FormUI form={form} onSubmit={onSubmit} submitButtonText={submitButtonText} className={className}>
					{children}
				</FormUI>
			</DialogContent>
		</Dialog>
	);
}
