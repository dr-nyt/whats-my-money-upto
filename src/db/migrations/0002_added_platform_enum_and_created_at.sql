CREATE TYPE "public"."crypto_trade_platform" AS ENUM('BINANCE');--> statement-breakpoint
ALTER TYPE "public"."side" RENAME TO "crypto_trade_side";--> statement-breakpoint
ALTER TABLE "crypto_fiat_trade" ADD COLUMN "platform" "crypto_trade_platform" NOT NULL;--> statement-breakpoint
ALTER TABLE "crypto_fiat_trade" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "crypto_trade_fee" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "crypto_trade" ADD COLUMN "platform" "crypto_trade_platform" NOT NULL;--> statement-breakpoint
ALTER TABLE "crypto_trade" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;