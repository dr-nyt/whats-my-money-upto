ALTER TABLE "crypto_platform_fee" ALTER COLUMN "crypto_buy_fee_percentage" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "crypto_platform_fee" ALTER COLUMN "crypto_sell_fee_percentage" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "crypto_platform_fee" ALTER COLUMN "fiat_buy_fee_percentage" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "crypto_platform_fee" ALTER COLUMN "fiat_sell_fee_percentage" SET NOT NULL;