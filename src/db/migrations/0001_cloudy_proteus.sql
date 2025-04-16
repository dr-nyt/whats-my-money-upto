ALTER TABLE "crypto_trade" ADD COLUMN "pair_base" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "crypto_trade" ADD COLUMN "pair_main" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "crypto_trade" DROP COLUMN "pair";