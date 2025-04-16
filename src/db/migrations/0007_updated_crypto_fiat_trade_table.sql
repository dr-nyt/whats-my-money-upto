ALTER TABLE "crypto_fiat_trade" RENAME COLUMN "fee" TO "fees";--> statement-breakpoint
ALTER TABLE "crypto_fiat_trade" ADD COLUMN "amount" double precision NOT NULL;--> statement-breakpoint
ALTER TABLE "crypto_fiat_trade" ADD COLUMN "side" "crypto_trade_side" NOT NULL;--> statement-breakpoint
ALTER TABLE "crypto_fiat_trade" ADD COLUMN "time" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "crypto_fiat_trade" ADD COLUMN "updated_at" timestamp with time zone;