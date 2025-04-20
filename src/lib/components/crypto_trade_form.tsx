"use client";
import { Button } from "./ui/button";
import { DialogFormUI } from "./custom_ui/dialog";
import { ComboBoxFormUI } from "./custom_ui/combo_box";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { FormField } from "./ui/form";
import { FormItemUI } from "./custom_ui/form";
import CryptoSymbols from "@/lib/crypto_symbols.json";
import { useEffect } from "react";
import { crypto_trade_side_enum } from "@/db/schema";
import { SelectFormUI, SelectUI } from "./custom_ui/select";
import { Input } from "./ui/input";

const FormSchema = z.object({
	pair_base: z.string({ message: "Pair base is required" }),
	pair_main: z.string({ message: "Pair main is required" }),
	side: z.enum(crypto_trade_side_enum.enumValues, {
		errorMap: () => ({ message: "Side is required" })
	}),
	market_price: z.number({ message: "Market price is required" })
		.min(0, "Market price must be greater than 0"),
	// amount: z.number().min(0, "Amount must be greater than 0"),
	// fees: z.array(z.object({
	// 	name: z.string().min(1, "Fee name is required"),
	// 	amount: z.number().min(0, "Fee amount must be greater than 0"),
	// })),
	// platform: z.enum(crypto_trade_platform_enum.enumValues, {
	// 	errorMap: () => ({ message: "Platform is required" })
	// }),
	// time: z.date({ message: "Time is required" }),
});

export default function CryptoTradeForm() {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {}
	})

	function onSubmit(data: z.infer<typeof FormSchema>) {
		console.log(data);
	}

	return (
		<DialogFormUI
			form={form}
			trigger={<Button variant="outline" className="w-full">Add Crypto Trade</Button>}
			onSubmit={onSubmit}
			title="New Crypto Trade"
			className="flex flex-col gap-4"
		>
			<FormField control={form.control} name="pair_base" render={({ field }) => (
				<FormItemUI withoutFormControl label="Pair base" description="USDT in BTC/USDT">
					<ComboBoxFormUI form={form} field={field}
						items={CryptoSymbols.map((symbol) => ({ label: symbol, value: symbol }))}
					/>
				</FormItemUI>
			)} />

			<FormField control={form.control} name="pair_main" render={({ field }) => (
				<FormItemUI withoutFormControl label="Pair main" description="BTC in BTC/USDT">
					<ComboBoxFormUI form={form} field={field}
						items={CryptoSymbols.map((symbol) => ({ label: symbol, value: symbol }))}
					/>
				</FormItemUI>
			)} />

			<FormField control={form.control} name="side" render={({ field }) => (
				<FormItemUI withoutFormControl label="Trade type">
					<SelectFormUI field={field} placeholder="None"
						items={crypto_trade_side_enum.enumValues.map((side) =>
							({ label: side, value: side })
						)}
					/>
				</FormItemUI>
			)} />

			<FormField control={form.control} name="market_price" render={({ field }) => (
				<FormItemUI withoutFormControl label="Market price">
					<Input type="number" placeholder="0.00" {...field} />
				</FormItemUI>
			)} />
		</DialogFormUI>
	);
}
