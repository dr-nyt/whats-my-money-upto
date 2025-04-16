ALTER TABLE "crypto_fiat_trade" ADD COLUMN "uid" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "crypto_trade_fee" ADD COLUMN "uid" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "crypto_trade" ADD COLUMN "uid" varchar(255) NOT NULL;