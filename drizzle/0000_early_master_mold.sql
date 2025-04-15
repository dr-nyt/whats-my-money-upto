CREATE TYPE "public"."side" AS ENUM('BUY', 'SELL');--> statement-breakpoint
CREATE TABLE "crypto_fiat_trade" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "crypto_fiat_trade_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"crypto_name" varchar(255) NOT NULL,
	"fiat_name" varchar(255) NOT NULL,
	"rate" double precision NOT NULL,
	"fee" double precision NOT NULL
);
--> statement-breakpoint
CREATE TABLE "crypto_trade_fee" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "crypto_trade_fee_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"trade_id" integer NOT NULL,
	"fees" jsonb[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE "crypto_trade" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "crypto_trade_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"pair" varchar(255) NOT NULL,
	"side" "side" NOT NULL,
	"market_price" double precision NOT NULL,
	"amount" double precision NOT NULL,
	"fee_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "crypto_trade_fee" ADD CONSTRAINT "crypto_trade_fee_trade_id_crypto_trade_id_fk" FOREIGN KEY ("trade_id") REFERENCES "public"."crypto_trade"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crypto_trade" ADD CONSTRAINT "crypto_trade_fee_id_crypto_trade_fee_id_fk" FOREIGN KEY ("fee_id") REFERENCES "public"."crypto_trade_fee"("id") ON DELETE no action ON UPDATE no action;