import { doublePrecision, integer, pgEnum, pgTable, varchar, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";

export const crypto_trade_platform_enum = pgEnum("crypto_trade_platform", ["BINANCE"]);
export const crypto_trade_side_enum = pgEnum("crypto_trade_side", ["BUY", "SELL"]);

export const crypto_trade_table = pgTable("crypto_trade", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	uid: varchar({ length: 255 }).notNull(),
	pair_base: varchar({ length: 255 }).notNull(),												// USDT in BTC/USDT
	pair_main: varchar({ length: 255 }).notNull(),												// BTC in BTC/USDT
	side: crypto_trade_side_enum().notNull(),
	market_price: doublePrecision().notNull(),
	amount: doublePrecision().notNull(),
	fees: jsonb().$type<{ data: { name: string, amount: number }[] }>().default({ data: [] }).notNull(),
	platform: crypto_trade_platform_enum().notNull(),
	time: timestamp({ withTimezone: true }).notNull(),
	unknown_trade: boolean().notNull().default(false),

	created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
	updated_at: timestamp({ withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});
export const UNKNOWN_PAIR_BASE = "!UNKNOWN!"
export type CryptoTradeT = typeof crypto_trade_table.$inferSelect;
export type CryptoTradeInsertT = Omit<typeof crypto_trade_table.$inferInsert, "created_at" | "updated_at">;

export const crypto_fiat_trade_table = pgTable("crypto_fiat_trade", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	uid: varchar({ length: 255 }).notNull(),
	crypto_name: varchar({ length: 255 }).notNull(),
	fiat_name: varchar({ length: 255 }).notNull(),
	rate: doublePrecision().notNull(),
	amount: doublePrecision().notNull(),
	side: crypto_trade_side_enum().notNull(),
	fees: jsonb().$type<{ data: { name: string, amount: number }[] }>().default({ data: [] }).notNull(),
	platform: crypto_trade_platform_enum().notNull(),
	time: timestamp({ withTimezone: true }).notNull(),

	created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
	updated_at: timestamp({ withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});
export type CryptoFiatTradeT = typeof crypto_fiat_trade_table.$inferSelect;
export type CryptoFiatTradeInsertT = Omit<typeof crypto_fiat_trade_table.$inferInsert, "created_at" | "updated_at">;

export const crypto_platform_fee_table = pgTable("crypto_platform_fee", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	uid: varchar({ length: 255 }).notNull(),
	platform: crypto_trade_platform_enum().notNull(),
	crypto_buy_fee_percentage: doublePrecision().notNull().default(0),
	crypto_sell_fee_percentage: doublePrecision().notNull().default(0),
	fiat_buy_fee_percentage: doublePrecision().notNull().default(0),
	fiat_sell_fee_percentage: doublePrecision().notNull().default(0),

	created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
	updated_at: timestamp({ withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});
export type CryptoPlatformFeeT = typeof crypto_platform_fee_table.$inferSelect;
export type CryptoPlatformFeeInsertT = Omit<typeof crypto_platform_fee_table.$inferInsert, "created_at" | "updated_at">;
