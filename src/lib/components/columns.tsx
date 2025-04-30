"use client";
import { CryptoTradeT } from "@/db/schema";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { ArrowDown, ArrowUp, ChevronUpDown, PencilSolid, TrashSolid } from "@mynaui/icons-react";
import { AlertDialogUI } from "./custom_ui/dialog";
import { deleteCryptoTrade } from "@/db/utils/crypto_trade_table";
import { toast } from "sonner";

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
			const { pair_base, pair_main } = row.original;
			return `${pair_main}/${pair_base}`;
		}
	},
	{
		accessorKey: "market_price",
		header: "Market Price",
		cell: ({ row }) => {
			const { market_price, pair_base } = row.original;
			return `${market_price} ${pair_base}`;
		}
	},
	{
		accessorKey: "amount",
		header: "Amount",
		cell: ({ row }) => {
			const { amount, pair_base, side } = row.original;
			return <p className={`flex gap-1 items-center ${side === "SELL" ? "text-green-400" : "text-red-400"}`}>
				{side === "BUY" ? <ArrowDown className="w-4" /> : <ArrowUp className="w-4" />}
				{amount} {pair_base}
			</p>
		}
	},
	{
		accessorKey: "total",
		header: "Total",
		cell: ({ row }) => {
			const { side, market_price, amount, pair_base, pair_main } = row.original;
			return <p className={`flex gap-1 items-center ${side === "BUY" ? "text-green-400" : "text-red-400"}`}>
				{side === "SELL" ? <ArrowDown className="w-4" /> : <ArrowUp className="w-4" />}
				{amount / market_price} {pair_main}
			</p>
		}
	},
	{
		accessorKey: "fees",
		header: "Fees",
		cell: ({ row }) => {
			const { fees } = row.original;
			return <p className="flex flex-col gap-1">{fees.data.map((fee) =>
				<span key={fee.name + fee.amount}>{fee.amount} {fee.name}</span>
			)}</p>
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
					<Button variant="ghost" size="icon" onClick={() => console.log("Edit")}><PencilSolid /></Button>
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
