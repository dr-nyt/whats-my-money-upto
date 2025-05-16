"use client";

import { CryptoTradeT, UNKNOWN_PAIR_BASE } from "@/db/schema";
import { format } from "date-fns";
import Decimal from "decimal.js";
import { use, useEffect, useState } from "react";
import { ChartUI } from "./chart";

type CryptoAssetsT = {
	[asset: string]: { amount: Decimal, price: Decimal }
};
type CryptoValuesT = { name: string, value: Decimal }[];
type AssetsPropsT = {
	dataP: Promise<CryptoTradeT[]>;
}
type ChartDataT = { date: string, buy: number, sell: number };
export default function CryptoAssets({ dataP }: AssetsPropsT) {
	const data = use(dataP);
	const [cryptoAssets, setCryptoAssets] = useState<CryptoAssetsT>({})
	const [cryptoValues, setCryptoValues] = useState<CryptoValuesT>([]);
	const [chartData, setChartData] = useState<ChartDataT[]>([]);

	useEffect(() => {
		if (data) {
			computeData();
			loadChartData("ETH", "USDT", data);
		}
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

		const symbols = Object.keys(assets).filter(a => a !== "USDT").map(a => a + "USDT");
		if (symbols.length) {
			const json: { symbol: string, price: string }[] = await fetch("https://api.binance.com/api/v3/ticker/price?symbols=" + encodeURIComponent(JSON.stringify(symbols))).then(res => res.json())
			for (let i = 0; i < json.length; i++) {
				const asset = json[i];
				const symbol = asset.symbol.replace("USDT", "");
				assets[symbol].price = Decimal(asset.price);
			}
		}
		if (assets["USDT"]) assets["USDT"].price = Decimal(1);
		setCryptoAssets(assets);

		const values: CryptoValuesT = [];
		Object.entries(assets).forEach(([name, data]) => {
			values.push({
				name,
				value: data.price.mul(data.amount),
			});
		})
		values.sort((a, b) => b.value.toNumber() - a.value.toNumber());
		setCryptoValues(values);
	}

	const loadChartData = (pair_main: string, pair_base: string, cryptoData: CryptoTradeT[]) => {
		const newChartData: ChartDataT[] = [];
		let prevBuy = 0;
		let prevSell = 0;
		cryptoData.toSorted((a, b) => a.time.getTime() - b.time.getTime()).forEach(d => {
			if (pair_main !== d.pair_main || pair_base !== d.pair_base) return;
			const chartData: ChartDataT = { date: format(d.time, "dd/MM/yyyy"), buy: prevBuy, sell: prevSell };
			if (d.side === "BUY") {
				chartData.buy = d.amount;
				prevBuy = d.amount;
			} else {
				chartData.sell = d.amount
				prevSell = d.amount;
			}
			newChartData.push(chartData);
		});
		console.log("!!!", newChartData);
		setChartData(newChartData);
	}

	return (
		<div className="flex flex-col gap-4">
			<h1 className="text-6xl">
				${Object.values(cryptoValues).reduce((total, v) => Decimal.add(total, v.value), Decimal(0)).toNumber().toFixed(2)}
			</h1>
			<div className="flex gap-2 overflow-auto pb-4">
				{cryptoValues.map(({ name, value }) => {
					return (
						<div key={name} className="border rounded-md p-2 min-w-52">
							<h1 className="text-lg"><b>{name}</b> <span className="text-muted-foreground">{parseFloat(cryptoAssets[name].amount.toNumber().toFixed(7))}</span></h1>
							<p>~ ${value.toNumber().toFixed(2)}</p>
						</div>
					)
				})}
			</div>
			<ChartUI
				title="ETH/USDT"
				description="Buy v. Sell Graph"
				xAxisKey="date"
				chartData={chartData}
				chartConfig={{
					buy: {
						label: "Buy",
						color: "green",
					},
					sell: {
						label: "Sell",
						color: "red",
					},
				}} />
		</div>
	);
}
