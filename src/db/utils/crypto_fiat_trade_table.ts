"use server";
import { and, eq } from "drizzle-orm";
import { db } from "../client";
import { crypto_fiat_trade_table, CryptoFiatTradeInsertT, CryptoFiatTradeT } from "../schema";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { User } from "@supabase/supabase-js";
import { getUser } from "@/lib/supabase/server";
import { validateId } from "./validator";

export const createCryptoFiatTrade = async (trade: CryptoFiatTradeInsertT) => {
	const user = await getUser();
	if (!user) return null;

	const validatedTradeData = validateInsert(user, trade);
	if (!validatedTradeData) return null;

	const res = await db.insert(crypto_fiat_trade_table).values(validatedTradeData).returning().execute();
	if (res.length === 0) {
		return null;
	}
	return res[0];
}

export const getCryptoFiatTrade = async (id: number) => {
	const user = await getUser();
	if (!user) return null;

	const validatedId = validateId(id);
	if (!validatedId) return null;

	const res = await db.select().from(crypto_fiat_trade_table).where(and(
		eq(crypto_fiat_trade_table.id, id),
		eq(crypto_fiat_trade_table.uid, user.id)
	)).execute();
	if (res.length === 0) {
		return null;
	}
	return res[0];
}

export const getAllCryptoFiatTrades = async () => {
	const user = await getUser();
	if (!user) return null;

	const res = await db.select().from(crypto_fiat_trade_table).where(eq(crypto_fiat_trade_table.uid, user.id)).execute();
	return res;
}

export const updateCryptoFiatTrade = async (id: number, trade: Partial<CryptoFiatTradeInsertT>) => {
	const user = await getUser();
	if (!user) return null;

	const validatedId = validateId(id);
	if (!validatedId) return null;

	const validatedTradeData = validateUpdate(user, trade);
	if (!validatedTradeData) return null;

	const res = await db.update(crypto_fiat_trade_table).set(validatedTradeData).where(and(
		eq(crypto_fiat_trade_table.id, validatedId),
		eq(crypto_fiat_trade_table.uid, user.id)
	)).returning().execute();
	if (res.length === 0) {
		return null;
	}
	return res[0];
}

export const deleteCryptoFiatTrade = async (id: number) => {
	const user = await getUser();
	if (!user) return null;

	const validatedId = validateId(id);
	if (!validatedId) return null;

	const res = await db.delete(crypto_fiat_trade_table).where(and(
		eq(crypto_fiat_trade_table.id, validatedId),
		eq(crypto_fiat_trade_table.uid, user.id)
	)).returning().execute();
	if (res.length === 0) {
		return null;
	}
	return res[0];
}

export const deleteAllCryptoFiatTrades = async () => {
	const user = await getUser();
	if (!user) return null;

	const res = await db.delete(crypto_fiat_trade_table).where(eq(crypto_fiat_trade_table.uid, user.id)).returning().execute();
	return res;
}

const selectSchema = createSelectSchema(crypto_fiat_trade_table);
const insertSchema = createInsertSchema(crypto_fiat_trade_table);
const updateSchema = createUpdateSchema(crypto_fiat_trade_table);

const validateSelect = (user: User, data: CryptoFiatTradeT) => {
	const validatedData = selectSchema.safeParse(data);
	if (!validatedData.success) {
		console.error("Invalid trade data", validatedData.error.format());
		return null;
	}
	validatedData.data.uid = user.id;
	return validatedData.data;
}

const validateInsert = (user: User, data: CryptoFiatTradeInsertT) => {
	const validatedData = insertSchema.safeParse(data);
	if (!validatedData.success) {
		console.error("Invalid trade data", validatedData.error.format());
		return null;
	}
	validatedData.data.uid = user.id;
	return validatedData.data;
}

const validateUpdate = (user: User, data: Partial<CryptoFiatTradeInsertT>) => {
	const validatedData = updateSchema.safeParse(data);
	if (!validatedData.success) {
		console.error("Invalid trade data", validatedData.error.format());
		return null;
	}
	validatedData.data.uid = user.id;
	return validatedData.data;
}
