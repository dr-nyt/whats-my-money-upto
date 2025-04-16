"use server";
import { and, eq } from "drizzle-orm";
import { db } from "../client";
import { crypto_platform_fee_table } from "../schema";

export type CryptoPlatformFeeTableT = typeof crypto_platform_fee_table.$inferSelect;
export type CryptoPlatformFeeTableInsertT = typeof crypto_platform_fee_table.$inferInsert;

export const createCryptoPlatformFee = async (fee: CryptoPlatformFeeTableInsertT) => {
	const res = await db.insert(crypto_platform_fee_table).values(fee).returning().execute();
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

export const updateCryptoPlatformFee = async (id: number, uid: string, fee: Partial<CryptoPlatformFeeTableInsertT>) => {
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
