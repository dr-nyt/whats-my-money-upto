"use client";
import { Button } from "./ui/button";
import { DialogFormUI } from "./custom_ui/dialog";
import { ComboBoxFormUI, ComboBoxUI } from "./custom_ui/combo_box";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { FormField } from "./ui/form";
import { FormItemUI } from "./custom_ui/form";
import CryptoSymbols from "@/lib/crypto_symbols.json";
import { crypto_trade_platform_enum, crypto_trade_side_enum, CryptoTradeInsertT } from "@/db/schema";
import { SelectFormUI } from "./custom_ui/select";
import { Input } from "./ui/input";
import { DatePickerFormUI, InputFormUI } from "./custom_ui/input";
import { Plus, TrashSolid } from "@mynaui/icons-react";
import { startTransition, useActionState, useEffect, useState } from "react";
import { createCryptoTrade } from "@/db/utils/crypto_trade_table";
import { toast } from "sonner";

const FormSchema: z.ZodSchema<Omit<CryptoTradeInsertT, "uid">> = z.object({
	pair_base: z.string({ message: "Pair base is required" }),
	pair_main: z.string({ message: "Pair main is required" }),
	side: z.enum(crypto_trade_side_enum.enumValues, {
		errorMap: () => ({ message: "Side is required" })
	}),
	market_price: z.coerce.number({ message: "Market price is required" })
		.gt(0, "Market price must be greater than 0"),
	amount: z.coerce.number({ message: "Amount is required" }).gt(0, "Amount must be greater than 0"),
	fees: z.object({
		data: z.array(z.object({
			name: z.string({ message: "Fee name is required" }),
			amount: z.coerce.number({ message: "Fee amount is required" }).gt(0, "Fee amount must be greater than 0"),
		}))
	}).default({ data: [] }),
	platform: z.enum(crypto_trade_platform_enum.enumValues, {
		errorMap: () => ({ message: "Platform is required" })
	}),
	time: z.date({ message: "Time is required" }),
});

export default function CryptoTradeForm() {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [feeName, setFeeName] = useState("");
	const [feeAmount, setFeeAmount] = useState("");
	const cryptoItems = CryptoSymbols.map((symbol) => ({ label: symbol, value: symbol }));

	const [state, createCryptoTradeAction, pending] = useActionState(createCryptoTrade, undefined);
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {}
	});

	useEffect(() => {
		console.log("!!!State:", state);
		if (state?.data?.length) {
			form.reset();
			setIsDialogOpen(false);
			toast.success(`${state.data[0].pair_main}/${state.data[0].pair_base} trade created successfully`);
		} else if (state?.errors) {
			const errorKeys = Object.keys(state.errors) as (keyof typeof state.errors)[];
			const formKeys = Object.keys(form.formState.validatingFields) as (keyof z.infer<typeof FormSchema>)[];
			if (!errorKeys.length) return;
			for (const key of errorKeys) {
				if (formKeys.includes(key as keyof z.infer<typeof FormSchema>)) {
					form.setError(key as keyof z.infer<typeof FormSchema>, { message: state.errors[key] as string });
				} else {
					form.setError("root", { message: state.errors[key] as string });
				}
			}
		}
	}, [state]);

	const onSubmit = (data: z.infer<typeof FormSchema>) => {
		startTransition(() => {
			createCryptoTradeAction({ uid: "", ...data });
		});
	}

	const addFee = () => {
		if (feeName && feeAmount) {
			if (form.getValues("fees.data")?.find((fee) => fee.name === feeName))
				return form.setError("fees", { message: `${feeName} fee already exists` });
			if (parseFloat(feeAmount) <= 0)
				return form.setError("fees", { message: "Fee amount must be greater than 0" });
			form.setValue("fees.data", [...(form.getValues("fees")?.data || []), { name: feeName, amount: Number(feeAmount) }]);
			form.clearErrors("fees");
			setFeeName("");
			setFeeAmount("");
		}
		else {
			form.setError("fees", { message: "Fee name and amount are required" });
		}
	}

	const removeFee = (index: number) => {
		const fees = form.getValues("fees.data") || [];
		fees.splice(index, 1);
		form.setValue("fees.data", fees);
		form.clearErrors("fees");
	}

	return (
		<DialogFormUI
			form={form}
			trigger={<Button variant="outline" className="w-full">Add Crypto Trade</Button>}
			onSubmit={onSubmit}
			title="New Crypto Trade"
			open={isDialogOpen} setOpen={setIsDialogOpen}
			isLoading={pending}
		>
			<FormField control={form.control} name="pair_base" render={({ field }) => (
				<ComboBoxFormUI form={form} field={field} label="Pair base" description="USDT in BTC/USDT"
					items={cryptoItems}
				/>
			)} />

			<FormField control={form.control} name="pair_main" render={({ field }) => (
				<ComboBoxFormUI form={form} field={field} label="Pair main" description="BTC in BTC/USDT"
					items={cryptoItems}
				/>
			)} />

			<FormField control={form.control} name="side" render={({ field }) => (
				<SelectFormUI field={field} placeholder="None" label="Trade type"
					items={crypto_trade_side_enum.enumValues.map((side) =>
						({ label: side, value: side })
					)}
				/>
			)} />

			<FormField control={form.control} name="market_price" render={({ field }) => (
				<InputFormUI field={field} label="Market price"
					type="number" placeholder="0.00" />
			)} />

			<FormField control={form.control} name="amount" render={({ field }) => (
				<InputFormUI field={field} label="Amount"
					type="number" placeholder="0.00" />
			)} />

			<FormField control={form.control} name="fees" render={({ field }) => (
				<FormItemUI label="Fees" optional>
					<div className="flex flex-col">
						<div className="flex gap-2">
							<ComboBoxUI
								items={cryptoItems.filter((item) => field.value?.data.find((fee) => fee.name === item.value) === undefined)}
								placeholder="Symbol"
								buttonClassName="w-1/3"
								value={feeName} setValue={setFeeName}
							/>
							<Input
								type="number" placeholder="Amount"
								value={feeAmount} onChange={e => setFeeAmount(e.target.value)}
							/>
							<Button
								type="button" variant="secondary" size="icon"
								className="cursor-pointer"
								onClick={addFee}>
								<Plus />
							</Button>
						</div>
						<div className="flex flex-col gap-2 mt-2">
							{field.value?.data.map((fee, index) => {
								const error = form.formState.errors.fees?.data?.[index]?.amount?.message;
								return (
									<div className="flex flex-col">
										<div className={`flex justify-between items-center pl-4 rounded-md ${error ? "bg-destructive py-1" : "bg-accent"}`} key={fee.name}>
											<div className="flex flex-col">
												<p className="text-xs">{fee.amount} {fee.name}</p>
												{!!error && <p className="text-xs font-normal">{error}</p>}
											</div>
											<Button
												className="cursor-pointer"
												type="button" variant="destructive" size="icon"
												onClick={() => removeFee(index)}
											>
												<TrashSolid className="!w-5 !h-5" />
											</Button>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</FormItemUI>
			)} />

			<FormField control={form.control} name="platform" render={({ field }) => (
				<SelectFormUI field={field} placeholder="None" label="Platform"
					items={crypto_trade_platform_enum.enumValues.map((platform) =>
						({ label: platform, value: platform })
					)}
				/>
			)} />

			<FormField control={form.control} name="time" render={({ field }) => (
				<DatePickerFormUI
					form={form}
					field={field}
					label="Time" placeholder="DDMMYYYY HH:MM"
					defaultDateFn={() => new Date}
				/>
			)} />
		</DialogFormUI>
	);
}
