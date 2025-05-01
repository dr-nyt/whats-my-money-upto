"use client";
import { Dispatch, ReactNode, SetStateAction } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { FormUI } from "./form";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { CircleNotch } from "@mynaui/icons-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";

type DialogUIPropsT = {
	trigger: ReactNode;
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	triggerAsChild?: boolean;
	className?: string;
	title?: string;
	description?: string;
	children?: ReactNode;
	footerChildren?: ReactNode;
}
export function DialogUI({ trigger, open, setOpen, triggerAsChild = true, className = "", title, description, children, footerChildren }: DialogUIPropsT) {
	return (
		<Dialog open={open} onOpenChange={setOpen}>
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
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	triggerAsChild?: boolean;
	className?: string;
	title?: string;
	description?: string;
	children?: ReactNode;
	onSubmit?: (values: z.infer<any>) => void;
	submitButtonText?: string;
	footerChildren?: ReactNode;
	disabled?: boolean;
	isLoading?: boolean;
	generateOnOpen?: boolean;
}
export function DialogFormUI({ form, trigger, open, setOpen, triggerAsChild = true, className = "", title, description, children, onSubmit = () => { }, submitButtonText = "Submit", footerChildren, disabled = false, isLoading = false, generateOnOpen = false }: DialogFormUIPropsT) {
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild={triggerAsChild} disabled={disabled}>
				{trigger}
			</DialogTrigger>
			<DialogContent className="max-h-[100vh]">{(!generateOnOpen || open) &&
				<FormUI form={form} onSubmit={onSubmit} withoutSubmitButton className="flex flex-col gap-8 max-h-[90vh]" disabled={disabled} isLoading={isLoading}>
					{(title || description) &&
						<DialogHeader>
							{title && <DialogTitle>{title}</DialogTitle>}
							{description && <DialogDescription>{description}</DialogDescription>}
							{form.formState.errors.root && <p className="text-red-500 text-sm">{form.formState.errors.root.message}</p>}
						</DialogHeader>
					}
					<div className={`overflow-auto flex flex-col gap-4 py-2 pr-2 ${className}`}>
						{children}
					</div>
					<DialogFooter className="flex justify-between items-center">
						{footerChildren && footerChildren}
						<Button type="submit" disabled={disabled || isLoading}>
							{isLoading ? <CircleNotch className="animate-spin" /> : submitButtonText}
						</Button>
					</DialogFooter>
				</FormUI>
			}</DialogContent>
		</Dialog>
	);
}

type AlertDialogUIPropsT = {
	trigger: ReactNode;
	title?: string;
	description?: string;
	acceptText?: string;
	cancelText?: string;
	onAccept?: () => void;
	onCancel?: () => void;
}
export const AlertDialogUI = ({ trigger, title, description, acceptText = "Continue", cancelText = "Cancel", onAccept = () => { }, onCancel = () => { } }: AlertDialogUIPropsT) => {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				{trigger}
			</AlertDialogTrigger>
			<AlertDialogContent>
				{(title || description) && <AlertDialogHeader>
					{title && <AlertDialogTitle>{title}</AlertDialogTitle>}
					{description && <AlertDialogDescription>{description}</AlertDialogDescription>}
				</AlertDialogHeader>}
				<AlertDialogFooter>
					<AlertDialogCancel onClick={onCancel}>{cancelText}</AlertDialogCancel>
					<AlertDialogAction onClick={onAccept}>{acceptText}</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
