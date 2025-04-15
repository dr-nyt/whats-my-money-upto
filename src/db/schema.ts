import { AnyPgColumn, doublePrecision, integer, pgEnum, pgTable, varchar, jsonb, timestamp } from "drizzle-orm/pg-core";

export const crypto_trade_platform_enum = pgEnum("crypto_trade_platform", ["BINANCE"]);
export const crypto_trade_side_enum = pgEnum("crypto_trade_side", ["BUY", "SELL"]);

export const crypto_trade_table = pgTable("crypto_trade", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	pair_base: varchar({ length: 255 }).notNull(),												// USDT in BTC/USDT
	pair_main: varchar({ length: 255 }).notNull(),												// BTC in BTC/USDT
	side: crypto_trade_side_enum().notNull(),
	market_price: doublePrecision().notNull(),
	amount: doublePrecision().notNull(),
	fee_id: integer().references(() => crypto_trade_fee_table.id).notNull(),
	platform: crypto_trade_platform_enum().notNull(),
	created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const crypto_trade_fee_table = pgTable("crypto_trade_fee", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	trade_id: integer().references((): AnyPgColumn => crypto_trade_table.id).notNull(),
	fees: jsonb().$type<{ name: string, amount: number }>().array().notNull(),
	created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const crypto_fiat_trade_table = pgTable("crypto_fiat_trade", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	crypto_name: varchar({ length: 255 }).notNull(),
	fiat_name: varchar({ length: 255 }).notNull(),
	rate: doublePrecision().notNull(),
	fee: doublePrecision().notNull(),
	platform: crypto_trade_platform_enum().notNull(),
	created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
});