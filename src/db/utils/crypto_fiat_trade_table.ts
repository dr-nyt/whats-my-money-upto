"use server";
import { and, eq } from "drizzle-orm";
import { db } from "../client";
import { crypto_fiat_trade_table } from "../schema";

export type CryptoFiatTradeTableT = typeof crypto_fiat_trade_table.$inferSelect;
export type CryptoFiatTradeTableInsertT = typeof crypto_fiat_trade_table.$inferInsert;

export const createCryptoFiatTrade = async (trade: CryptoFiatTradeTableInsertT) => {
	const res = await db.insert(crypto_fiat_trade_table).values(trade).returning().execute();
	if (res.length === 0) {
		return null;
	}
	return res[0];
}

export const getCryptoFiatTrade = async (id: number, uid: string) => {
	const res = await db.select().from(crypto_fiat_trade_table).where(and(
		eq(crypto_fiat_trade_table.id, id),
		eq(crypto_fiat_trade_table.uid, uid)
	)).execute();
	if (res.length === 0) {
		return null;
	}
	return res[0];
}

export const getAllCryptoFiatTrades = async (uid: string) => {
	const res = await db.select().from(crypto_fiat_trade_table).where(eq(crypto_fiat_trade_table.uid, uid)).execute();
	return res;
}

export const updateCryptoFiatTrade = async (id: number, uid: string, trade: Partial<CryptoFiatTradeTableInsertT>) => {
	const res = await db.update(crypto_fiat_trade_table).set(trade).where(and(
		eq(crypto_fiat_trade_table.id, id),
		eq(crypto_fiat_trade_table.uid, uid)
	)).returning().execute();
	if (res.length === 0) {
		return null;
	}
	return res[0];
}

export const deleteCryptoFiatTrade = async (id: number, uid: string) => {
	const res = await db.delete(crypto_fiat_trade_table).where(and(
		eq(crypto_fiat_trade_table.id, id),
		eq(crypto_fiat_trade_table.uid, uid)
	)).returning().execute();
	if (res.length === 0) {
		return null;
	}
	return res[0];
}

export const deleteAllCryptoFiatTrades = async (uid: string) => {
	const res = await db.delete(crypto_fiat_trade_table).where(eq(crypto_fiat_trade_table.uid, uid)).returning().execute();
	return res;
}
