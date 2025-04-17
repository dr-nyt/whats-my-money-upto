"use server";
import { and, eq } from "drizzle-orm";
import { db } from "../client";
import { crypto_trade_table, CryptoTradeInsertT, CryptoTradeT } from "../schema";
import { getUser } from "@/lib/supabase/server";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { User } from "@supabase/supabase-js";
import { validateId } from "./validator";

export const createCryptoTrade = async (trade: CryptoTradeInsertT): Promise<CryptoTradeT | null> => {
	const user = await getUser();
	if (!user) return null;

	const validatedTradeData = validateInsert(user, trade);
	if (!validatedTradeData) return null;

	const res = await db.insert(crypto_trade_table).values(validatedTradeData).returning().execute();
	if (res.length === 0) {
		return null;
	}
	return res[0];
}

export const getCryptoTrade = async (id: number): Promise<CryptoTradeT | null> => {
	const user = await getUser();
	if (!user) return null;

	const validatedId = validateId(id);
	if (!validatedId) return null;

	const res = await db.select().from(crypto_trade_table).where(and(
		eq(crypto_trade_table.id, validatedId),
		eq(crypto_trade_table.uid, user.id)
	)).execute();
	if (res.length === 0) {
		return null;
	}
	return res[0];
}

export const getAllCryptoTrades = async (): Promise<CryptoTradeT[] | null> => {
	const user = await getUser();
	if (!user) return null;

	const res = await db.select().from(crypto_trade_table).where(eq(crypto_trade_table.uid, user.id)).execute();
	return res;
}

export const updateCryptoTrade = async (id: number, trade: Partial<CryptoTradeInsertT>): Promise<CryptoTradeT | null> => {
	const user = await getUser();
	if (!user) return null;

	const validatedId = validateId(id);
	if (!validatedId) return null;

	const validatedTradeData = validateUpdate(user, trade);
	if (!validatedTradeData) return null;

	const res = await db.update(crypto_trade_table).set(validatedTradeData).where(and(
		eq(crypto_trade_table.id, validatedId),
		eq(crypto_trade_table.uid, user.id)
	)).returning().execute();
	if (res.length === 0) {
		return null;
	}
	return res[0];
}

export const deleteCryptoTrade = async (id: number): Promise<CryptoTradeT | null> => {
	const user = await getUser();
	if (!user) return null;

	const validatedId = validateId(id);
	if (!validatedId) return null;

	const res = await db.delete(crypto_trade_table).where(and(
		eq(crypto_trade_table.id, validatedId),
		eq(crypto_trade_table.uid, user.id)
	)).returning().execute();
	if (res.length === 0) {
		return null;
	}
	return res[0];
}

export const deleteAllCryptoTrades = async (): Promise<CryptoTradeT[] | null> => {
	const user = await getUser();
	if (!user) return null;

	const res = await db.delete(crypto_trade_table).where(eq(crypto_trade_table.uid, user.id)).returning().execute();
	return res;
}

const selectSchema = createSelectSchema(crypto_trade_table);
const insertSchema = createInsertSchema(crypto_trade_table);
const updateSchema = createUpdateSchema(crypto_trade_table);

const validateSelect = (user: User, data: CryptoTradeT) => {
	const validatedData = selectSchema.safeParse(data);
	if (!validatedData.success) {
		console.error("Invalid trade data", validatedData.error.format());
		return null;
	}
	validatedData.data.uid = user.id;
	return validatedData.data;
}

const validateInsert = (user: User, data: CryptoTradeInsertT) => {
	const validatedData = insertSchema.safeParse(data);
	if (!validatedData.success) {
		console.error("Invalid trade data", validatedData.error.format());
		return null;
	}
	validatedData.data.uid = user.id;
	return validatedData.data;
}

const validateUpdate = (user: User, data: Partial<CryptoTradeInsertT>) => {
	const validatedData = updateSchema.safeParse(data);
	if (!validatedData.success) {
		console.error("Invalid trade data", validatedData.error.format());
		return null;
	}
	validatedData.data.uid = user.id;
	return validatedData.data;
}
