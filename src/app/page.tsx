import CryptoTradeForm from "@/lib/components/crypto_trade_form";
import { logout } from "./auth/actions";
import { DataTableUI } from "@/lib/components/custom_ui/table";
import { Suspense } from "react";
import { getAllCryptoTrades } from "@/db/utils/crypto_trade_table";
import { cryptoTradeColumns } from "@/lib/components/columns";
import { Button } from "@/lib/components/ui/button";

export default function Home() {
	const dataP = getAllCryptoTrades();
	// const dataP: Promise<CryptoTradeT[]> = new Promise((resolve) => {
	// 	resolve([
	// 		{
	// 			"id": 1,
	// 			"uid": "6f1edc6f-799c-44d4-aefd-e210a92e7cbb",
	// 			"pair_base": "ETH",
	// 			"pair_main": "USDT",
	// 			"side": "BUY",
	// 			"market_price": 2,
	// 			"amount": 3,
	// 			"fees": {
	// 				"data": [
	// 					{
	// 						"name": "ETH",
	// 						"amount": 2
	// 					}
	// 				]
	// 			},
	// 			"platform": "BINANCE",
	// 			"time": new Date("2025-04-30T16:23:10.148Z"),
	// 			"created_at": new Date("2025-04-30T16:30:51.082Z"),
	// 			"updated_at": new Date("2025-04-30T16:30:51.082Z")
	// 		},
	// 		{
	// 			"id": 2,
	// 			"uid": "6f1edc6f-799c-44d4-aefd-e210a92e7cbb",
	// 			"pair_base": "USDT",
	// 			"pair_main": "ETH",
	// 			"side": "BUY",
	// 			"market_price": 2000,
	// 			"amount": 100,
	// 			"fees": {
	// 				"data": [
	// 					{
	// 						"name": "BNB",
	// 						"amount": 0.00011923
	// 					}
	// 				]
	// 			},
	// 			"platform": "BINANCE",
	// 			"time": new Date("2025-03-19T20:00:00.000Z"),
	// 			"created_at": new Date("2025-04-30T20:12:28.578Z"),
	// 			"updated_at": new Date("2025-04-30T20:12:28.578Z")
	// 		}
	// 	]);
	// });

	return (
		<main>
			<h1 className="text-9xl">ETH/USDT</h1>
			<h2>1560.0123456789</h2>
			<code>
				if (hello)
				then_bye(0123456789);
			</code>
			<CryptoTradeForm trigger={<Button variant="outline" className="w-full">Add Crypto Trade</Button>} />
			<form action={logout}>
				<button type="submit">Logout</button>
			</form>
			<Suspense fallback={<div>Loading...</div>}>
				<DataTableUI dataP={dataP} columns={cryptoTradeColumns} sortingState={[{ id: "time", "desc": false }]} />
			</Suspense>
		</main >
	);
}
