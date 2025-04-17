"use server";
import { and, eq } from "drizzle-orm";
import { db } from "../client";
import { crypto_platform_fee_table, CryptoPlatformFeeInsertT, CryptoPlatformFeeT } from "../schema";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { User } from "@supabase/supabase-js";
import { getUser } from "@/lib/supabase/server";

export const createCryptoPlatformFee = async (data: CryptoPlatformFeeInsertT) => {
	const user = await getUser();
	if (!user) return null;

	const validatedData = validateInsert(user, data);
	if (!validatedData) return null;

	const res = await db.insert(crypto_platform_fee_table).values(validatedData).returning().execute();
	if (res.length === 0) {
		return null;
	}
	return res[0];
}

export const getCryptoPlatformFee = async (id: number, uid: string) => {
	const res = await db.select().from(crypto_platform_fee_table).where(and(
		eq(crypto_platform_fee_table.id, id),
		eq(crypto_platform_fee_table.uid, uid)
	)).execute();
	if (res.length === 0) {
		return null;
	}
	return res[0];
}

export const getAllCryptoPlatformFees = async (uid: string) => {
	const res = await db.select().from(crypto_platform_fee_table).where(eq(crypto_platform_fee_table.uid, uid)).execute();
	return res;
}

export const updateCryptoPlatformFee = async (id: number, uid: string, fee: Partial<CryptoPlatformFeeInsertT>) => {
	const res = await db.update(crypto_platform_fee_table).set(fee).where(and(
		eq(crypto_platform_fee_table.id, id),
		eq(crypto_platform_fee_table.uid, uid)
	)).returning().execute();
	if (res.length === 0) {
		return null;
	}
	return res[0];
}

export const deleteCryptoPlatformFee = async (id: number, uid: string) => {
	const res = await db.delete(crypto_platform_fee_table).where(and(
		eq(crypto_platform_fee_table.id, id),
		eq(crypto_platform_fee_table.uid, uid)
	)).returning().execute();
	if (res.length === 0) {
		return null;
	}
	return res[0];
}

export const deleteAllCryptoPlatformFees = async (uid: string) => {
	const res = await db.delete(crypto_platform_fee_table).where(eq(crypto_platform_fee_table.uid, uid)).returning().execute();
	return res;
}

const selectSchema = createSelectSchema(crypto_platform_fee_table);
const insertSchema = createInsertSchema(crypto_platform_fee_table);
const updateSchema = createUpdateSchema(crypto_platform_fee_table);

const validateSelect = (user: User, data: CryptoPlatformFeeT) => {
	const validatedData = selectSchema.safeParse(data);
	if (!validatedData.success) {
		console.error("Invalid trade data", validatedData.error.format());
		return null;
	}
	validatedData.data.uid = user.id;
	return validatedData.data;
}

const validateInsert = (user: User, data: CryptoPlatformFeeInsertT) => {
	const validatedData = insertSchema.safeParse(data);
	if (!validatedData.success) {
		console.error("Invalid trade data", validatedData.error.format());
		return null;
	}
	validatedData.data.uid = user.id;
	return validatedData.data;
}

const validateUpdate = (user: User, data: Partial<CryptoPlatformFeeInsertT>) => {
	const validatedData = updateSchema.safeParse(data);
	if (!validatedData.success) {
		console.error("Invalid trade data", validatedData.error.format());
		return null;
	}
	validatedData.data.uid = user.id;
	return validatedData.data;
}
