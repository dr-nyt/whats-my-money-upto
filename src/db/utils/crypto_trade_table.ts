"use server";
import { and, eq } from "drizzle-orm";
import { db } from "../client";
import { crypto_trade_table } from "../schema";

export type CryptoTradeTableT = typeof crypto_trade_table.$inferSelect;
export type CryptoTradeTableInsertT = typeof crypto_trade_table.$inferInsert;

export const createCryptoTrade = async (trade: CryptoTradeTableInsertT) => {
	const res = await db.insert(crypto_trade_table).values(trade).returning().execute();
	if (res.length === 0) {
		return null;
	}
	return res[0];
}

export const getCryptoTrade = async (id: number, uid: string) => {
	const res = await db.select().from(crypto_trade_table).where(and(
		eq(crypto_trade_table.id, id),
		eq(crypto_trade_table.uid, uid)
	)).execute();
	if (res.length === 0) {
		return null;
	}
	return res[0];
}

export const getAllCryptoTrades = async (uid: string) => {
	const res = await db.select().from(crypto_trade_table).where(eq(crypto_trade_table.uid, uid)).execute();
	return res;
}

export const updateCryptoTrade = async (id: number, uid: string, trade: Partial<CryptoTradeTableInsertT>) => {
	const res = await db.update(crypto_trade_table).set(trade).where(and(
		eq(crypto_trade_table.id, id),
		eq(crypto_trade_table.uid, uid)
	)).returning().execute();
	if (res.length === 0) {
		return null;
	}
	return res[0];
}

export const deleteCryptoTrade = async (id: number, uid: string) => {
	const res = await db.delete(crypto_trade_table).where(and(
		eq(crypto_trade_table.id, id),
		eq(crypto_trade_table.uid, uid)
	)).returning().execute();
	if (res.length === 0) {
		return null;
	}
	return res[0];
}

export const deleteAllCryptoTrades = async (uid: string) => {
	const res = await db.delete(crypto_trade_table).where(eq(crypto_trade_table.uid, uid)).returning().execute();
	return res;
}
