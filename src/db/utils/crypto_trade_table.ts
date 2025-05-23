"use server";
import { and, eq } from "drizzle-orm";
import { db } from "../client";
import { crypto_trade_table, CryptoTradeInsertT, CryptoTradeT } from "../schema";
import { sGetUser } from "@/lib/supabase/server";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { User } from "@supabase/supabase-js";
import { validateData, validateId } from "./validator";
import { revalidatePath } from "next/cache";

type FormState = {
	errors?: {
		other?: string;
	} & Partial<Record<keyof CryptoTradeT, string[]>>;
	data?: CryptoTradeT[];
} | undefined;

export const createCryptoTrade = async (state: FormState, data: CryptoTradeInsertT): Promise<FormState> => {
	const user = await sGetUser();
	if (!user) return { errors: { other: "User authentication failed" } };

	const validatedData = validateInsert(user, data);
	if (!validatedData.success) return { errors: validatedData.error.flatten().fieldErrors };

	try {
		const res = await db.insert(crypto_trade_table).values(validatedData.data).returning().execute();
		revalidatePath("/");
		return { data: res };
	} catch (error) {
		console.error("createCryptoTrade:", error);
		return { errors: { other: "Error creating crypto trade" } };
	}
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

export const getAllCryptoTrades = async (): Promise<CryptoTradeT[]> => {
	const user = await sGetUser();
	if (!user) return [];

	const res = await db.select().from(crypto_trade_table).where(eq(crypto_trade_table.uid, user.id)).execute();
	return res;
}

export const updateCryptoTrade = async (state: FormState, data: Partial<CryptoTradeT>): Promise<FormState> => {
	const user = await sGetUser();
	if (!user) return { errors: { other: "User authentication failed" } };

	const validatedId = validateId(data.id);
	if (!validatedId) return { errors: { other: "Invalid id" } };

	const validatedData = validateUpdate(user, data);
	if (!validatedData.success) return { errors: validatedData.error.flatten().fieldErrors };

	try {
		const res = await db.update(crypto_trade_table).set(validatedData.data).where(and(
			eq(crypto_trade_table.id, validatedId),
			eq(crypto_trade_table.uid, user.id)
		)).returning().execute();
		revalidatePath("/");
		return { data: res };
	} catch (error) {
		console.error("updateCryptoTrade:", error);
		return { errors: { other: "Error updating crypto trade" } };
	}
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
	revalidatePath("/");
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

function validateSelect(user: User, data: CryptoTradeT) {
	return validateData<CryptoTradeT, typeof selectSchema>(user, data, selectSchema);
}

const validateInsert = (user: User, data: CryptoTradeInsertT) => {
	return validateData<CryptoTradeInsertT, typeof insertSchema>(user, data, insertSchema);
}

const validateUpdate = (user: User, data: Partial<CryptoTradeInsertT>) => {
	return validateData<Partial<CryptoTradeInsertT>, typeof updateSchema>(user, data, updateSchema);
}

