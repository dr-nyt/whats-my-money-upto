"use server";
import { and, eq } from "drizzle-orm";
import { db } from "../client";
import { crypto_fiat_trade_table, CryptoFiatTradeInsertT, CryptoFiatTradeT } from "../schema";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { User } from "@supabase/supabase-js";
import { sGetUser } from "@/lib/supabase/server";
import { validateData, validateId } from "./validator";
import { revalidatePath } from "next/cache";

type FormState = {
	errors?: {
		other?: string;
	} & Partial<Record<keyof CryptoFiatTradeT, string[]>>;
	data?: CryptoFiatTradeT[];
} | undefined;

export const createCryptoFiatTrade = async (state: FormState, data: CryptoFiatTradeInsertT): Promise<FormState> => {
	const user = await sGetUser();
	if (!user) return { errors: { other: "User authentication failed" } };

	const validatedData = validateInsert(user, data);
	if (!validatedData.success) return { errors: validatedData.error.flatten().fieldErrors };

	try {
		const res = await db.insert(crypto_fiat_trade_table).values(validatedData.data).returning().execute();
		revalidatePath("/");
		return { data: res };
	} catch (error) {
		console.error("createCryptoFiatTrade:", error);
		return { errors: { other: "Error creating crypto fiat trade" } };
	}
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

export const updateCryptoFiatTrade = async (state: FormState, data: Partial<CryptoFiatTradeT>): Promise<FormState> => {
	const user = await sGetUser();
	if (!user) return { errors: { other: "User authentication failed" } };

	const validatedId = validateId(data.id);
	if (!validatedId) return { errors: { other: "Invalid id" } };

	const validatedData = validateUpdate(user, data);
	if (!validatedData.success) return { errors: validatedData.error.flatten().fieldErrors };

	try {
		const res = await db.update(crypto_fiat_trade_table).set(validatedData.data).where(and(
			eq(crypto_fiat_trade_table.id, validatedId),
			eq(crypto_fiat_trade_table.uid, user.id)
		)).returning().execute();
		revalidatePath("/");
		return { data: res };
	} catch (error) {
		console.error("updateCryptoFiatTrade:", error);
		return { errors: { other: "Error updating crypto fiat trade" } };
	}
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

function validateSelect(user: User, data: CryptoFiatTradeT) {
	return validateData<CryptoFiatTradeT, typeof selectSchema>(user, data, selectSchema);
}

const validateInsert = (user: User, data: CryptoFiatTradeInsertT) => {
	return validateData<CryptoFiatTradeInsertT, typeof insertSchema>(user, data, insertSchema);
}

const validateUpdate = (user: User, data: Partial<CryptoFiatTradeInsertT>) => {
	return validateData<Partial<CryptoFiatTradeInsertT>, typeof updateSchema>(user, data, updateSchema);
}
