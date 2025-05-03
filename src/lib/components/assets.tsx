"use client";

import { CryptoTradeT, UNKNOWN_PAIR_BASE } from "@/db/schema";
import Decimal from "decimal.js";
import { use, useEffect, useState } from "react";

type CryptoAssetsT = {
	[asset: string]: { amount: Decimal, price: Decimal }
}
type AssetsPropsT = {
	dataP: Promise<CryptoTradeT[]>;
}
export default function CryptoAssets({ dataP }: AssetsPropsT) {
	const data = use(dataP);
	const [cryptoAssets, setCryptoAssets] = useState<CryptoAssetsT>({})

	useEffect(() => {
		if (data) computeData();
	}, [data]);

	const computeData = async () => {
		const assets: CryptoAssetsT = {};
		Decimal.set({ precision: 20, defaults: true });
		for (const trade of data) {
			if (!assets[trade.pair_main]) {
				assets[trade.pair_main] = { amount: Decimal(0), price: Decimal(0) };
			}
			if (!assets[trade.pair_base]) {
				assets[trade.pair_base] = { amount: Decimal(0), price: Decimal(0) };
			}
			for (let i = 0; i < trade.fees.data.length; i++) {
				const fee = trade.fees.data[i];
				if (!assets[fee.name]) {
					assets[fee.name] = { amount: Decimal(0), price: Decimal(0) };
				}
				assets[fee.name].amount = assets[fee.name].amount.minus(fee.amount);
			}
			const currMainAmount = assets[trade.pair_main].amount;
			const currBaseAmount = assets[trade.pair_base].amount;
			const currTradeTotal = Decimal.div(trade.amount, trade.market_price)
			if (trade.side === "BUY") {
				assets[trade.pair_main].amount = currMainAmount.plus(currTradeTotal);
				assets[trade.pair_base].amount = currBaseAmount.minus(trade.amount);
			} else if (trade.side === "SELL") {
				assets[trade.pair_main].amount = currMainAmount.minus(currTradeTotal);
				assets[trade.pair_base].amount = currBaseAmount.plus(trade.amount);
			}
		}
		delete assets[UNKNOWN_PAIR_BASE];
		// setCryptoAssets(assets);

		const symbols = Object.keys(assets).filter(a => a !== "USDT").map(a => a + "USDT");
		const json: { symbol: string, price: string }[] = await fetch("https://api.binance.com/api/v3/ticker/price?symbols=" + encodeURIComponent(JSON.stringify(symbols))).then(res => res.json())
		for (let i = 0; i < json.length; i++) {
			const asset = json[i];
			const symbol = asset.symbol.replace("USDT", "");
			assets[symbol].price = Decimal(asset.price);
		}
		assets["USDT"].price = Decimal(1);
		setCryptoAssets(assets);
	}

	return (
		<div className="flex gap-2 overflow-auto pb-1">
			{Object.entries(cryptoAssets).map(([asset, data]) => {
				return (
					<div key={asset} className="border rounded-md p-2 min-w-52">
						<h1 className="text-lg"><b>{asset}</b> <span className="text-muted-foreground">{data.amount.toFixed(7).toString()}</span></h1>
						<p>~ ${data.price.mul(data.amount).toFixed(2).toString()}</p>
					</div>
				)
			})}
		</div>
	);
}
