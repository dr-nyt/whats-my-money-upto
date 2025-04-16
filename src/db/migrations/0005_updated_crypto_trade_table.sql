ALTER TABLE "crypto_trade" RENAME COLUMN "fee_id" TO "fees";--> statement-breakpoint
ALTER TABLE "crypto_trade" DROP CONSTRAINT "crypto_trade_fee_id_crypto_trade_fee_id_fk";
--> statement-breakpoint
ALTER TABLE "crypto_trade" ADD COLUMN "time" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "crypto_trade" ADD COLUMN "updated_at" timestamp with time zone;