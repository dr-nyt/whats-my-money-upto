"use server";
import { and, eq } from "drizzle-orm";
import { db } from "../client";
import { crypto_platform_fee_table, CryptoPlatformFeeInsertT, CryptoPlatformFeeT } from "../schema";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { User } from "@supabase/supabase-js";
import { sGetUser } from "@/lib/supabase/server";
import { validateData, validateId } from "./validator";

export const createCryptoPlatformFee = async (data: CryptoPlatformFeeInsertT) => {
	const user = await sGetUser();
	if (!user) return null;

	const validatedData = validateInsert(user, data);
	if (!validatedData) return null;

	const res = await db.insert(crypto_platform_fee_table).values(validatedData).returning().execute();
	if (res.length === 0) {
		return null;
	}
	return res[0];
}

export const getCryptoPlatformFee = async (id: number) => {
	const user = await sGetUser();
	if (!user) return null;

	const validatedId = validateId(id);
	if (!validatedId) return null;

	const res = await db.select().from(crypto_platform_fee_table).where(and(
		eq(crypto_platform_fee_table.id, validatedId),
		eq(crypto_platform_fee_table.uid, user.id)
	)).execute();
	if (res.length === 0) {
		return null;
	}
	return res[0];
}

export const getAllCryptoPlatformFees = async () => {
	const user = await sGetUser();
	if (!user) return null;

	const res = await db.select().from(crypto_platform_fee_table).where(eq(crypto_platform_fee_table.uid, user.id)).execute();
	return res;
}

export const updateCryptoPlatformFee = async (id: number, data: Partial<CryptoPlatformFeeInsertT>) => {
	const user = await sGetUser();
	if (!user) return null;

	const validatedId = validateId(id);
	if (!validatedId) return null;

	const validatedData = validateUpdate(user, data);
	if (!validatedData) return null;

	const res = await db.update(crypto_platform_fee_table).set(validatedData).where(and(
		eq(crypto_platform_fee_table.id, validatedId),
		eq(crypto_platform_fee_table.uid, user.id)
	)).returning().execute();
	if (res.length === 0) {
		return null;
	}
	return res[0];
}

export const deleteCryptoPlatformFee = async (id: number) => {
	const user = await sGetUser();
	if (!user) return null;

	const validatedId = validateId(id);
	if (!validatedId) return null;

	const res = await db.delete(crypto_platform_fee_table).where(and(
		eq(crypto_platform_fee_table.id, validatedId),
		eq(crypto_platform_fee_table.uid, user.id)
	)).returning().execute();
	if (res.length === 0) {
		return null;
	}
	return res[0];
}

export const deleteAllCryptoPlatformFees = async () => {
	const user = await sGetUser();
	if (!user) return null;

	const res = await db.delete(crypto_platform_fee_table).where(eq(crypto_platform_fee_table.uid, user.id)).returning().execute();
	return res;
}

const selectSchema = createSelectSchema(crypto_platform_fee_table);
const insertSchema = createInsertSchema(crypto_platform_fee_table);
const updateSchema = createUpdateSchema(crypto_platform_fee_table);

const validateSelect = (user: User, data: CryptoPlatformFeeT) => {
	return validateData<CryptoPlatformFeeT, typeof selectSchema>(user, data, selectSchema);
}

const validateInsert = (user: User, data: CryptoPlatformFeeInsertT) => {
	return validateData<CryptoPlatformFeeInsertT, typeof insertSchema>(user, data, insertSchema);
}

const validateUpdate = (user: User, data: Partial<CryptoPlatformFeeInsertT>) => {
	return validateData<Partial<CryptoPlatformFeeInsertT>, typeof updateSchema>(user, data, updateSchema);
}
