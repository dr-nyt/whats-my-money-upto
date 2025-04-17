"use server";
import { and, eq } from "drizzle-orm";
import { db } from "../client";
import { crypto_trade_table, CryptoTradeInsertT, CryptoTradeT } from "../schema";
import { sGetUser } from "@/lib/supabase/server";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { User } from "@supabase/supabase-js";
import { validateData, validateId } from "./validator";

export const createCryptoTrade = async (data: CryptoTradeInsertT): Promise<CryptoTradeT | null> => {
	const user = await sGetUser();
	if (!user) return null;

	const validatedData = validateInsert(user, data);
	if (!validatedData) return null;

	const res = await db.insert(crypto_trade_table).values(validatedData).returning().execute();
	if (res.length === 0) {
		return null;
	}
	return res[0];
}

export const getCryptoTrade = async (id: number): Promise<CryptoTradeT | null> => {
	const user = await sGetUser();
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
	const user = await sGetUser();
	if (!user) return null;

	const res = await db.select().from(crypto_trade_table).where(eq(crypto_trade_table.uid, user.id)).execute();
	return res;
}

export const updateCryptoTrade = async (id: number, data: Partial<CryptoTradeInsertT>): Promise<CryptoTradeT | null> => {
	const user = await sGetUser();
	if (!user) return null;

	const validatedId = validateId(id);
	if (!validatedId) return null;

	const validatedData = validateUpdate(user, data);
	if (!validatedData) return null;

	const res = await db.update(crypto_trade_table).set(validatedData).where(and(
		eq(crypto_trade_table.id, validatedId),
		eq(crypto_trade_table.uid, user.id)
	)).returning().execute();
	if (res.length === 0) {
		return null;
	}
	return res[0];
}

export const deleteCryptoTrade = async (id: number): Promise<CryptoTradeT | null> => {
	const user = await sGetUser();
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
	const user = await sGetUser();
	if (!user) return null;

	const res = await db.delete(crypto_trade_table).where(eq(crypto_trade_table.uid, user.id)).returning().execute();
	return res;
}

const selectSchema = createSelectSchema(crypto_trade_table);
const insertSchema = createInsertSchema(crypto_trade_table);
const updateSchema = createUpdateSchema(crypto_trade_table);

const validateSelect = (user: User, data: CryptoTradeT) => {
	return validateData<CryptoTradeT, typeof selectSchema>(user, data, selectSchema);
}

const validateInsert = (user: User, data: CryptoTradeInsertT) => {
	return validateData<CryptoTradeInsertT, typeof insertSchema>(user, data, insertSchema);
}

const validateUpdate = (user: User, data: Partial<CryptoTradeInsertT>) => {
	return validateData<Partial<CryptoTradeInsertT>, typeof updateSchema>(user, data, updateSchema);
}

