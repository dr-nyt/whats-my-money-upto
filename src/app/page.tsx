import CryptoTradeForm from "@/lib/components/crypto_trade_form";
import { DataTableUI } from "@/lib/components/custom_ui/table";
import { Suspense } from "react";
import { getAllCryptoTrades } from "@/db/utils/crypto_trade_table";
import { cryptoTradeColumns } from "@/lib/components/columns";
import { Button } from "@/lib/components/ui/button";
import Nav from "@/lib/components/nav";
import { Plus } from "@mynaui/icons-react";
import { CryptoTradeT } from "@/db/schema";
import CryptoAssets from "@/lib/components/assets";

export default function Home() {
	const dataP = getAllCryptoTrades();
	// const dataP: Promise<CryptoTradeT[]> = new Promise((resolve) => {
	// 	resolve([
	// 		{
	// 			"id": 5,
	// 			"uid": "6f1edc6f-799c-44d4-aefd-e210a92e7cbb",
	// 			"pair_base": "USDT",
	// 			"pair_main": "ETH",
	// 			"side": "BUY",
	// 			"market_price": 1590,
	// 			"amount": 13387.641,
	// 			"fees": {
	// 				"data": [
	// 					{
	// 						"name": "ETH",
	// 						"amount": 0.0084199
	// 					}
	// 				]
	// 			},
	// 			"platform": "BINANCE",
	// 			"time": new Date("2025-04-13T20:00:00.000Z"),
	// 			"created_at": new Date("2025-04-30T20:59:41.241Z"),
	// 			"updated_at": new Date("2025-04-30T20:59:41.241Z")
	// 		},
	// 		{
	// 			"id": 6,
	// 			"uid": "6f1edc6f-799c-44d4-aefd-e210a92e7cbb",
	// 			"pair_base": "USDT",
	// 			"pair_main": "AI",
	// 			"side": "BUY",
	// 			"market_price": 0.19,
	// 			"amount": 99.997,
	// 			"fees": {
	// 				"data": [
	// 					{
	// 						"name": "BNB",
	// 						"amount": 0.00001665
	// 					},
	// 					{
	// 						"name": "AI",
	// 						"amount": 0.4522
	// 					}
	// 				]
	// 			},
	// 			"platform": "BINANCE",
	// 			"time": new Date("2025-03-22T20:00:00.000Z"),
	// 			"created_at": new Date("2025-04-30T21:10:41.744Z"),
	// 			"updated_at": new Date("2025-04-30T21:10:41.744Z")
	// 		},
	// 		{
	// 			"id": 23,
	// 			"uid": "6f1edc6f-799c-44d4-aefd-e210a92e7cbb",
	// 			"pair_base": "USDT",
	// 			"pair_main": "TRUMP",
	// 			"side": "SELL",
	// 			"market_price": 16,
	// 			"amount": 29.392,
	// 			"fees": {
	// 				"data": [
	// 					{
	// 						"name": "BNB",
	// 						"amount": 0.00003664
	// 					}
	// 				]
	// 			},
	// 			"platform": "BINANCE",
	// 			"time": new Date("2025-04-25T20:00:00.000Z"),
	// 			"created_at": new Date("2025-05-01T15:41:39.228Z"),
	// 			"updated_at": new Date("2025-05-01T15:41:39.228Z")
	// 		},
	// 		{
	// 			"id": 24,
	// 			"uid": "6f1edc6f-799c-44d4-aefd-e210a92e7cbb",
	// 			"pair_base": "USDT",
	// 			"pair_main": "ETH",
	// 			"side": "BUY",
	// 			"market_price": 1750,
	// 			"amount": 14394.1,
	// 			"fees": {
	// 				"data": [
	// 					{
	// 						"name": "BNB",
	// 						"amount": 0.01816517
	// 					}
	// 				]
	// 			},
	// 			"platform": "BINANCE",
	// 			"time": new Date("2025-04-29T20:00:00.000Z"),
	// 			"created_at": new Date("2025-05-01T15:43:25.345Z"),
	// 			"updated_at": new Date("2025-05-01T15:43:25.345Z")
	// 		},
	// 		{
	// 			"id": 25,
	// 			"uid": "6f1edc6f-799c-44d4-aefd-e210a92e7cbb",
	// 			"pair_base": "USDT",
	// 			"pair_main": "ETH",
	// 			"side": "SELL",
	// 			"market_price": 1824,
	// 			"amount": 15002.7648,
	// 			"fees": {
	// 				"data": [
	// 					{
	// 						"name": "BNB",
	// 						"amount": 0.01862645
	// 					}
	// 				]
	// 			},
	// 			"platform": "BINANCE",
	// 			"time": new Date("2025-05-01T15:43:35.923Z"),
	// 			"created_at": new Date("2025-05-01T15:45:42.720Z"),
	// 			"updated_at": new Date("2025-05-01T15:45:42.720Z")
	// 		},
	// 		{
	// 			"id": 26,
	// 			"uid": "6f1edc6f-799c-44d4-aefd-e210a92e7cbb",
	// 			"pair_base": "USDC",
	// 			"pair_main": "XRP",
	// 			"side": "BUY",
	// 			"market_price": 2,
	// 			"amount": 26,
	// 			"fees": {
	// 				"data": [
	// 					{
	// 						"name": "XRP",
	// 						"amount": 0.013
	// 					}
	// 				]
	// 			},
	// 			"platform": "BINANCE",
	// 			"time": new Date("2025-03-26T20:00:00.000Z"),
	// 			"created_at": new Date("2025-05-01T16:01:50.632Z"),
	// 			"updated_at": new Date("2025-05-01T16:01:50.632Z")
	// 		},
	// 		{
	// 			"id": 19,
	// 			"uid": "6f1edc6f-799c-44d4-aefd-e210a92e7cbb",
	// 			"pair_base": "USDT",
	// 			"pair_main": "ETH",
	// 			"side": "SELL",
	// 			"market_price": 1610.5371229,
	// 			"amount": 13818.086407,
	// 			"fees": {
	// 				"data": [
	// 					{
	// 						"name": "BNB",
	// 						"amount": 0.01741241
	// 					}
	// 				]
	// 			},
	// 			"platform": "BINANCE",
	// 			"time": new Date("2025-04-20T20:00:00.000Z"),
	// 			"created_at": new Date("2025-05-01T15:32:19.398Z"),
	// 			"updated_at": new Date("2025-05-01T15:32:19.398Z")
	// 		},
	// 		{
	// 			"id": 3,
	// 			"uid": "6f1edc6f-799c-44d4-aefd-e210a92e7cbb",
	// 			"pair_base": "USDT",
	// 			"pair_main": "SOL",
	// 			"side": "BUY",
	// 			"market_price": 130,
	// 			"amount": 99.97,
	// 			"fees": {
	// 				"data": [
	// 					{
	// 						"name": "BNB",
	// 						"amount": 0.0001199
	// 					}
	// 				]
	// 			},
	// 			"platform": "BINANCE",
	// 			"time": new Date("2025-03-19T20:05:00.000Z"),
	// 			"created_at": new Date("2025-04-30T20:55:09.427Z"),
	// 			"updated_at": new Date("2025-04-30T20:55:09.427Z")
	// 		},
	// 		{
	// 			"id": 21,
	// 			"uid": "6f1edc6f-799c-44d4-aefd-e210a92e7cbb",
	// 			"pair_base": "USDT",
	// 			"pair_main": "BNB",
	// 			"side": "BUY",
	// 			"market_price": 595,
	// 			"amount": 24.395,
	// 			"fees": {
	// 				"data": [
	// 					{
	// 						"name": "BNB",
	// 						"amount": 0.00003075
	// 					}
	// 				]
	// 			},
	// 			"platform": "BINANCE",
	// 			"time": new Date("2025-04-21T20:05:00.000Z"),
	// 			"created_at": new Date("2025-05-01T15:35:30.092Z"),
	// 			"updated_at": new Date("2025-05-01T15:35:30.092Z")
	// 		},
	// 		{
	// 			"id": 9,
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
	// 			"created_at": new Date("2025-05-01T13:58:10.814Z"),
	// 			"updated_at": new Date("2025-05-01T13:58:10.814Z")
	// 		},
	// 		{
	// 			"id": 10,
	// 			"uid": "6f1edc6f-799c-44d4-aefd-e210a92e7cbb",
	// 			"pair_base": "USDT",
	// 			"pair_main": "DOT",
	// 			"side": "BUY",
	// 			"market_price": 4.4,
	// 			"amount": 49.984,
	// 			"fees": {
	// 				"data": [
	// 					{
	// 						"name": "BNB",
	// 						"amount": 0.00005921
	// 					}
	// 				]
	// 			},
	// 			"platform": "BINANCE",
	// 			"time": new Date("2025-03-20T20:00:00.000Z"),
	// 			"created_at": new Date("2025-05-01T14:00:16.356Z"),
	// 			"updated_at": new Date("2025-05-01T14:00:16.356Z")
	// 		},
	// 		{
	// 			"id": 11,
	// 			"uid": "6f1edc6f-799c-44d4-aefd-e210a92e7cbb",
	// 			"pair_base": "USDT",
	// 			"pair_main": "TRUMP",
	// 			"side": "BUY",
	// 			"market_price": 11.01,
	// 			"amount": 20.22537,
	// 			"fees": {
	// 				"data": [
	// 					{
	// 						"name": "BNB",
	// 						"amount": 0.0000242
	// 					}
	// 				]
	// 			},
	// 			"platform": "BINANCE",
	// 			"time": new Date("2025-03-21T20:00:00.000Z"),
	// 			"created_at": new Date("2025-05-01T14:02:13.102Z"),
	// 			"updated_at": new Date("2025-05-01T14:02:13.102Z")
	// 		},
	// 		{
	// 			"id": 12,
	// 			"uid": "6f1edc6f-799c-44d4-aefd-e210a92e7cbb",
	// 			"pair_base": "USDT",
	// 			"pair_main": "USDC",
	// 			"side": "BUY",
	// 			"market_price": 0.9999,
	// 			"amount": 26.9973,
	// 			"fees": {
	// 				"data": []
	// 			},
	// 			"platform": "BINANCE",
	// 			"time": new Date("2025-03-23T20:00:00.000Z"),
	// 			"created_at": new Date("2025-05-01T14:03:43.141Z"),
	// 			"updated_at": new Date("2025-05-01T14:03:43.141Z")
	// 		},
	// 		{
	// 			"id": 14,
	// 			"uid": "6f1edc6f-799c-44d4-aefd-e210a92e7cbb",
	// 			"pair_base": "USDT",
	// 			"pair_main": "ETH",
	// 			"side": "BUY",
	// 			"market_price": 1630,
	// 			"amount": 14031.855,
	// 			"fees": {
	// 				"data": [
	// 					{
	// 						"name": "ETH",
	// 						"amount": 0.0086085
	// 					}
	// 				]
	// 			},
	// 			"platform": "BINANCE",
	// 			"time": new Date("2025-04-14T20:00:00.000Z"),
	// 			"created_at": new Date("2025-05-01T14:07:00.379Z"),
	// 			"updated_at": new Date("2025-05-01T14:07:00.379Z")
	// 		},
	// 		{
	// 			"id": 13,
	// 			"uid": "6f1edc6f-799c-44d4-aefd-e210a92e7cbb",
	// 			"pair_base": "USDT",
	// 			"pair_main": "ETH",
	// 			"side": "SELL",
	// 			"market_price": 1660,
	// 			"amount": 14045.924,
	// 			"fees": {
	// 				"data": [
	// 					{
	// 						"name": "USDT",
	// 						"amount": 14.045924
	// 					}
	// 				]
	// 			},
	// 			"platform": "BINANCE",
	// 			"time": new Date("2025-04-13T20:05:00.000Z"),
	// 			"created_at": new Date("2025-05-01T14:05:23.194Z"),
	// 			"updated_at": new Date("2025-05-01T14:05:23.194Z")
	// 		},
	// 		{
	// 			"id": 15,
	// 			"uid": "6f1edc6f-799c-44d4-aefd-e210a92e7cbb",
	// 			"pair_base": "USDT",
	// 			"pair_main": "ETH",
	// 			"side": "SELL",
	// 			"market_price": 1631,
	// 			"amount": 50.8872,
	// 			"fees": {
	// 				"data": [
	// 					{
	// 						"name": "USDT",
	// 						"amount": 0.0508872
	// 					}
	// 				]
	// 			},
	// 			"platform": "BINANCE",
	// 			"time": new Date("2025-04-14T20:05:00.000Z"),
	// 			"created_at": new Date("2025-05-01T14:57:33.904Z"),
	// 			"updated_at": new Date("2025-05-01T14:57:33.904Z")
	// 		},
	// 		{
	// 			"id": 17,
	// 			"uid": "6f1edc6f-799c-44d4-aefd-e210a92e7cbb",
	// 			"pair_base": "USDT",
	// 			"pair_main": "ETH",
	// 			"side": "SELL",
	// 			"market_price": 1597,
	// 			"amount": 13684.2139,
	// 			"fees": {
	// 				"data": [
	// 					{
	// 						"name": "BNB",
	// 						"amount": 0.01726672
	// 					}
	// 				]
	// 			},
	// 			"platform": "BINANCE",
	// 			"time": new Date("2025-04-18T20:00:00.000Z"),
	// 			"created_at": new Date("2025-05-01T15:26:04.832Z"),
	// 			"updated_at": new Date("2025-05-01T15:26:04.832Z")
	// 		},
	// 		{
	// 			"id": 20,
	// 			"uid": "6f1edc6f-799c-44d4-aefd-e210a92e7cbb",
	// 			"pair_base": "USDT",
	// 			"pair_main": "ETH",
	// 			"side": "BUY",
	// 			"market_price": 1570,
	// 			"amount": 13793.392,
	// 			"fees": {
	// 				"data": [
	// 					{
	// 						"name": "BNB",
	// 						"amount": 0.01739034
	// 					}
	// 				]
	// 			},
	// 			"platform": "BINANCE",
	// 			"time": new Date("2025-04-20T20:05:00.000Z"),
	// 			"created_at": new Date("2025-05-01T15:34:14.764Z"),
	// 			"updated_at": new Date("2025-05-01T15:34:14.764Z")
	// 		},
	// 		{
	// 			"id": 16,
	// 			"uid": "6f1edc6f-799c-44d4-aefd-e210a92e7cbb",
	// 			"pair_base": "USDT",
	// 			"pair_main": "BNB",
	// 			"side": "BUY",
	// 			"market_price": 584.93,
	// 			"amount": 50.30398,
	// 			"fees": {
	// 				"data": [
	// 					{
	// 						"name": "BNB",
	// 						"amount": 0.0000645
	// 					}
	// 				]
	// 			},
	// 			"platform": "BINANCE",
	// 			"time": new Date("2025-04-14T20:10:00.000Z"),
	// 			"created_at": new Date("2025-05-01T15:00:27.056Z"),
	// 			"updated_at": new Date("2025-05-01T15:00:27.056Z")
	// 		},
	// 		{
	// 			"id": 18,
	// 			"uid": "6f1edc6f-799c-44d4-aefd-e210a92e7cbb",
	// 			"pair_base": "USDT",
	// 			"pair_main": "ETH",
	// 			"side": "BUY",
	// 			"market_price": 1595,
	// 			"amount": 13684.781,
	// 			"fees": {
	// 				"data": [
	// 					{
	// 						"name": "BNB",
	// 						"amount": 0.01727401
	// 					}
	// 				]
	// 			},
	// 			"platform": "BINANCE",
	// 			"time": new Date("2025-04-19T20:00:00.000Z"),
	// 			"created_at": new Date("2025-05-01T15:27:29.219Z"),
	// 			"updated_at": new Date("2025-05-01T15:27:29.219Z")
	// 		},
	// 		{
	// 			"id": 22,
	// 			"uid": "6f1edc6f-799c-44d4-aefd-e210a92e7cbb",
	// 			"pair_base": "USDT",
	// 			"pair_main": "ETH",
	// 			"side": "SELL",
	// 			"market_price": 1635,
	// 			"amount": 14364.456,
	// 			"fees": {
	// 				"data": [
	// 					{
	// 						"name": "BNB",
	// 						"amount": 0.01776868
	// 					}
	// 				]
	// 			},
	// 			"platform": "BINANCE",
	// 			"time": new Date("2025-04-21T20:05:00.000Z"),
	// 			"created_at": new Date("2025-05-01T15:37:42.229Z"),
	// 			"updated_at": new Date("2025-05-01T15:37:42.229Z")
	// 		}
	// 	]);
	// });

	return (
		<main className="flex flex-col gap-4">
			<Nav />
			<div className="flex flex-col gap-4 px-4 pb-4">
				<h1 className="text-2xl font-bold">Assets</h1>
				<CryptoAssets dataP={dataP} />
				<div className="flex gap-2">
					<h1 className="text-2xl font-bold">Crypto Trades</h1>
					<CryptoTradeForm trigger={<Button variant="outline" size="icon"><Plus /></Button>} />
				</div>
				<Suspense fallback={<div>Loading...</div>}>
					<DataTableUI dataP={dataP} columns={cryptoTradeColumns} sortingState={[{ id: "time", "desc": true }]} />
				</Suspense>
			</div>
		</main >
	);
}
