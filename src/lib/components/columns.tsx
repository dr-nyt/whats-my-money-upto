"use client";
import { CryptoTradeT } from "@/db/schema";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { ArrowDown, ArrowUp, ChevronUpDown, InfoCircle, PencilSolid, TrashSolid } from "@mynaui/icons-react";
import { AlertDialogUI } from "./custom_ui/dialog";
import { deleteCryptoTrade } from "@/db/utils/crypto_trade_table";
import { toast } from "sonner";
import CryptoTradeForm from "./crypto_trade_form";
import Decimal from "decimal.js";
import TooltipUI from "./custom_ui/tooltip";

export const cryptoTradeColumns: ColumnDef<CryptoTradeT>[] = [
	{
		accessorKey: "time",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Date
					{column.getIsSorted() === "desc" ? (
						<ArrowDown />
					) : column.getIsSorted() === "asc" ? (
						<ArrowUp />
					) : (
						<ChevronUpDown />
					)}
				</Button>
			)
		},
		cell: ({ row }) => {
			const { time } = row.original;
			return format(new Date(time), "dd/MM/yyyy");
		},
	},
	{
		accessorKey: "side",
		header: "Side",
		cell: ({ row }) => {
			const { side } = row.original;
			return <p className={`${side === "BUY" ? "text-green-400" : "text-red-400"}`}>{side === "BUY" ? "Buy" : "Sell"}</p>
		}
	},
	{
		accessorKey: "pair",
		header: "Pair",
		cell: ({ row }) => {
			const { pair_base, pair_main, unknown_trade } = row.original;
			if (!unknown_trade) return `${pair_main}/${pair_base}`;
			return <div className="flex gap-2 items-center"><TooltipUI className="max-w-72" content="This is a corrective trade with unknown data"><InfoCircle className="w-5" /></TooltipUI> {pair_main}</div>;
		}
	},
	{
		accessorKey: "market_price",
		header: "Market Price",
		cell: ({ row }) => {
			const { market_price, pair_base, unknown_trade } = row.original;
			if (!unknown_trade) return `${market_price} ${pair_base}`;
			return "-";
		}
	},
	{
		accessorKey: "amount",
		header: "Amount",
		cell: ({ row }) => {
			const { amount, pair_base, side, unknown_trade } = row.original;
			if (!unknown_trade) return <p className={`flex gap-1 items-center ${side === "SELL" ? "text-green-400" : "text-red-400"}`}>
				{side === "BUY" ? <ArrowDown className="w-4" /> : <ArrowUp className="w-4" />}
				{amount} {pair_base}
			</p>
			return "-";
		}
	},
	{
		accessorKey: "total",
		header: "Total",
		cell: ({ row }) => {
			const { side, market_price, amount, pair_main } = row.original;
			return <p className={`flex gap-1 items-center ${side === "BUY" ? "text-green-400" : "text-red-400"}`}>
				{side === "SELL" ? <ArrowDown className="w-4" /> : <ArrowUp className="w-4" />}
				{Decimal.set({ precision: 6, defaults: true }).div(amount, market_price).toString()} {pair_main}
			</p>
		}
	},
	{
		accessorKey: "fees",
		header: "Fees",
		cell: ({ row }) => {
			const { fees } = row.original;
			if (fees.data.length) return <p className="flex flex-col gap-1">{fees.data.map((fee) =>
				<span key={fee.name + fee.amount}>{fee.amount} {fee.name}</span>
			)}</p>
			return "-";
		}
	},
	{
		accessorKey: "platform",
		header: "Platform",
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const { id, pair_base, pair_main } = row.original;
			return (
				<div className="flex gap-2 justify-end">
					<CryptoTradeForm
						trigger={<Button variant="ghost" size="icon"><PencilSolid /></Button>}
						trade={row.original} isUpdate resetOnClose
					/>
					<AlertDialogUI
						trigger={<Button variant="destructive" size="icon"><TrashSolid /></Button>}
						title="Delete Trade"
						description="Are you sure you want to delete this trade? This action cannot be undone."
						acceptText="Delete"
						cancelText="Cancel"
						onAccept={async () => {
							await deleteCryptoTrade(id);
							toast.success(`${pair_main}/${pair_base} trade deleted successfully`);
						}}
					/>
				</div>
			)
		},
	},
]
