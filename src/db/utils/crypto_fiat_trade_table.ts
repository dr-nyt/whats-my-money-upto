"use server";
import { and, eq } from "drizzle-orm";
import { db } from "../client";
import { crypto_fiat_trade_table, CryptoFiatTradeInsertT, CryptoFiatTradeT } from "../schema";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { User } from "@supabase/supabase-js";
import { sGetUser } from "@/lib/supabase/server";
import { validateData, validateId } from "./validator";

export const createCryptoFiatTrade = async (data: CryptoFiatTradeInsertT) => {
	const user = await sGetUser();
	if (!user) return null;

	const validatedData = validateInsert(user, data);
	if (!validatedData) return null;

	const res = await db.insert(crypto_fiat_trade_table).values(validatedData).returning().execute();
	if (res.length === 0) {
		return null;
	}
	return res[0];
}

export const getCryptoFiatTrade = async (id: number) => {
	const user = await sGetUser();
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
	const user = await sGetUser();
	if (!user) return null;

	const res = await db.select().from(crypto_fiat_trade_table).where(eq(crypto_fiat_trade_table.uid, user.id)).execute();
	return res;
}

export const updateCryptoFiatTrade = async (id: number, data: Partial<CryptoFiatTradeInsertT>) => {
	const user = await sGetUser();
	if (!user) return null;

	const validatedId = validateId(id);
	if (!validatedId) return null;

	const validatedData = validateUpdate(user, data);
	if (!validatedData) return null;

	const res = await db.update(crypto_fiat_trade_table).set(validatedData).where(and(
		eq(crypto_fiat_trade_table.id, validatedId),
		eq(crypto_fiat_trade_table.uid, user.id)
	)).returning().execute();
	if (res.length === 0) {
		return null;
	}
	return res[0];
}

export const deleteCryptoFiatTrade = async (id: number) => {
	const user = await sGetUser();
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
	const user = await sGetUser();
	if (!user) return null;

	const res = await db.delete(crypto_fiat_trade_table).where(eq(crypto_fiat_trade_table.uid, user.id)).returning().execute();
	return res;
}

const selectSchema = createSelectSchema(crypto_fiat_trade_table);
const insertSchema = createInsertSchema(crypto_fiat_trade_table);
const updateSchema = createUpdateSchema(crypto_fiat_trade_table);

const validateSelect = (user: User, data: CryptoFiatTradeT) => {
	return validateData<CryptoFiatTradeT, typeof selectSchema>(user, data, selectSchema);
}

const validateInsert = (user: User, data: CryptoFiatTradeInsertT) => {
	return validateData<CryptoFiatTradeInsertT, typeof insertSchema>(user, data, insertSchema);
}

const validateUpdate = (user: User, data: Partial<CryptoFiatTradeInsertT>) => {
	return validateData<Partial<CryptoFiatTradeInsertT>, typeof updateSchema>(user, data, updateSchema);
}
